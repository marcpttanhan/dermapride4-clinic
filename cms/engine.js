/* ============================================================
   DermaPride CMS — Engine
   ----------------------------------------------------------------
   Supabase-backed CMS with draft/publish + live DOM binding.
   localStorage is used ONLY as a local render cache for instant
   first paint and offline fallback — Supabase is the source of truth.
   Mounts on window.CMS. Designed to be reused for multiple clinics.

   Public API:
     CMS.get(path)                  read published value
     CMS.getDraft(path)             read draft value (falls back to published)
     CMS.set(path, value)           write to draft, notify subscribers
     CMS.publish()                  copy draft → published, persist
     CMS.discardDraft()             reset draft to published
     CMS.subscribe(fn)              fn(state) called after any change
     CMS.exportJSON() / importJSON  full backup/restore
     CMS.hydrate(root)              bind data-cms-* attrs to current values
     CMS.media.add(file)            stash a file as data URL, return {id,src}
     CMS.media.list()               array of media items
     CMS.media.remove(id)
     CMS.sections.add(catSlug, type) push a new section onto a procedure
     CMS.sections.remove(catSlug, id)
     CMS.sections.move(catSlug, id, dir)
     CMS.sections.duplicate(catSlug, id)
     CMS.sections.update(catSlug, id, patch)

   DOM bindings (drop on any element in the host page):
     <h1 data-cms-text="home.hero.l1">default text</h1>
     <img data-cms-src="home.hero.bg" src="default.jpg" />
     <a data-cms-href="home.cta.link" href="#">…</a>
     <div data-cms-html="home.about.body">default HTML</div>
   ============================================================ */
(function () {
  'use strict';

  // ── VERSION STAMP ────────────────────────────────────────────────
  // Printed on every page load. If you see a different version in the
  // console, a stale cached build is still being served.
  const ENGINE_BUILD = 'cms_sections-only / build-2';
  console.log('[CMS] ENGINE LOADED — build:', ENGINE_BUILD,
    '| table: cms_sections | cms_data: RETIRED');
  // ─────────────────────────────────────────────────────────────────

  const STORAGE_KEY = 'dp_cms_v1';   // local cache key only
  const VERSION = 1;

  // ================================================================
  // SUPABASE CONFIG
  // Storage: Dashboard → Storage → New bucket → cms-media → Public: YES
  // SB_KEY: use the "anon public" JWT key (starts with eyJ…) from
  //         Dashboard → Project Settings → API → "anon public".
  // ================================================================
  const SB_URL    = 'https://riojltqsgtjvlzkpmhrb.supabase.co';
  const SB_KEY    = 'sb_publishable_XMnIk0XXsn_ayVJJZ7LSew_vsT5o0kG';
  const SB_BUCKET = 'cms-media';
  // cms_data is GONE — all writes go to cms_sections only.

  // cms_sections table — one row per logical slice so each write is small.
  //
  // Run once in Supabase Dashboard → SQL Editor:
  //
  //   create table if not exists cms_sections (
  //     section    text        primary key,
  //     published  jsonb       not null default '{}'::jsonb,
  //     draft      jsonb       not null default '{}'::jsonb,
  //     updated_at timestamptz default now()
  //   );
  //   insert into cms_sections (section)
  //     values ('home'),('procedures'),('reviews'),('media'),('settings')
  //   on conflict do nothing;
  //   alter table cms_sections enable row level security;
  //   create policy "public read" on cms_sections for select using (true);
  //   create policy "anon write"  on cms_sections for all    using (true);
  //
  const SB_SEC_TABLE = 'cms_sections';

  // Which top-level state keys belong to each section
  const _SEC_KEYS = {
    home:       ['home', 'theme'],
    procedures: ['procedures'],
    reviews:    ['reviews'],
    media:      ['media'],
    settings:   ['seo', 'version', 'updatedAt', 'publishedAt']
  };

  function _sbHeaders(extra) {
    return Object.assign({
      'apikey':        SB_KEY,
      'Authorization': 'Bearer ' + SB_KEY,
      'Content-Type':  'application/json'
    }, extra || {});
  }

  async function _sbRequest(method, path, body, extraHeaders) {
    // Hard guard — cms_data is retired. Any call to it is a bug, block immediately.
    if (path.indexOf('cms_data') !== -1) {
      var blocked = '[CMS] BLOCKED: attempt to access deprecated cms_data table. Path: ' + path;
      console.error(blocked);
      throw new Error(blocked);
    }

    var url  = SB_URL + path;
    var opts = { method: method, headers: _sbHeaders(extraHeaders) };
    if (body !== undefined) opts.body = (typeof body === 'string') ? body : JSON.stringify(body);
    var payloadKb = body !== undefined ? (opts.body.length / 1024).toFixed(1) + ' KB' : 'no body';
    console.log('➡️ SENDING REQUEST', method, path, '(' + payloadKb + ')');

    var res;
    try {
      res = await fetch(url, opts);
    } catch (netErr) {
      var netMsg = '[CMS] Network error on ' + method + ' ' + path + ': ' + netErr.message;
      console.error(netMsg);
      throw new Error(netMsg);
    }

    var text;
    try {
      text = await res.text();
    } catch (bodyErr) {
      var bodyMsg = '[CMS] Response body read failed on ' + method + ' ' + path + ': ' + bodyErr.message;
      console.error(bodyMsg);
      throw new Error(bodyMsg);
    }

    console.log('⬅️ RESPONSE', res.status, res.statusText, text.slice(0, 300) || '(empty)');
    if (!res.ok) {
      var httpMsg = '[CMS] HTTP ' + res.status + ' on ' + method + ' ' + path + ': ' + text;
      console.error(httpMsg);
      throw new Error(httpMsg);
    }
    return text ? JSON.parse(text) : null;
  }

  // Retries up to 3 times with linear back-off (1 s → 2 s).
  async function _sbRequestWithRetry(method, path, body, extraHeaders) {
    var MAX = 3, lastErr;
    for (var attempt = 1; attempt <= MAX; attempt++) {
      try {
        return await _sbRequest(method, path, body, extraHeaders);
      } catch (e) {
        lastErr = e;
        console.error('[CMS] attempt ' + attempt + '/' + MAX + ' FAILED:', e.message);
        if (attempt < MAX) {
          var delay = attempt * 1000;
          console.warn('[CMS] retrying in ' + delay + 'ms …');
          await new Promise(function(r) { setTimeout(r, delay); });
        }
      }
    }
    console.error('[CMS] ALL ' + MAX + ' attempts failed — giving up:', lastErr && lastErr.message);
    throw lastErr;
  }

  // ----- Supabase DB helpers -----

  // Fetch all section rows and reassemble the full CMS state.
  async function _loadSupabase() {
    console.log('[CMS] _loadSupabase: fetching sections …');
    var rows = await _sbRequest(
      'GET',
      '/rest/v1/' + SB_SEC_TABLE + '?select=section%2Cpublished%2Cdraft&limit=20'
    );
    if (!Array.isArray(rows) || rows.length === 0) { console.log('[CMS] no sections yet'); return null; }
    var pub = {}, dft = {};
    rows.forEach(function(row) {
      Object.assign(pub, row.published || {});
      Object.assign(dft, row.draft     || {});
    });
    console.log('[CMS] loaded', rows.length, 'section(s)');
    return {
      published: deepMerge(deepClone(DEFAULTS), pub),
      draft:     deepMerge(deepClone(DEFAULTS), dft)
    };
  }

  // Upsert a single section row — small payload, no timeout risk.
  async function _saveSection(sectionId, pubSlice, dftSlice) {
    var payload = { section: sectionId, published: pubSlice, draft: dftSlice, updated_at: new Date().toISOString() };
    var kb = (JSON.stringify(payload).length / 1024).toFixed(1);
    console.log('[CMS] saving section:', sectionId, '(' + kb + ' KB)');
    await _sbRequestWithRetry(
      'POST',
      '/rest/v1/' + SB_SEC_TABLE,
      payload,
      { 'Prefer': 'resolution=merge-duplicates,return=minimal' }
    );
    console.log('[CMS] section saved OK:', sectionId);
  }

  // Removes base64 data-URL image items from a media section slice before DB write.
  // Base64 blobs make the payload multi-MB and cause HTTP 500 statement timeouts.
  function _stripBase64FromMedia(slice) {
    if (!slice || !slice.media || !Array.isArray(slice.media.items)) return slice;
    var before = slice.media.items.length;
    var items  = slice.media.items.filter(function(it) {
      return it && it.src && !String(it.src).startsWith('data:');
    });
    if (items.length < before) {
      console.warn('[CMS] ⚠️ Stripped ' + (before - items.length) + ' base64 image(s) from publish payload. '
        + 'These images are stored locally only and will NOT appear cross-device. '
        + 'Re-upload via Media Library after confirming Supabase Storage is configured.');
    }
    return Object.assign({}, slice, { media: Object.assign({}, slice.media, { items: items }) });
  }

  // Split state into sections and save each sequentially.
  async function _saveSupabase(pub, dft) {
    console.log('[CMS] PUBLISH START — TABLE = cms_sections ONLY');
    var ids = Object.keys(_SEC_KEYS);
    for (var i = 0; i < ids.length; i++) {
      var id   = ids[i];
      var keys = _SEC_KEYS[id];
      var ps   = {}, ds = {};
      keys.forEach(function(k) {
        if (pub[k] !== undefined) ps[k] = pub[k];
        if (dft[k] !== undefined) ds[k] = dft[k];
      });
      // Guard: strip base64 from media section — payload size is the #1 cause of HTTP 500
      if (id === 'media') {
        ps = _stripBase64FromMedia(ps);
        ds = _stripBase64FromMedia(ds);
      }
      await _saveSection(id, ps, ds);
    }
    console.log('[CMS] _saveSupabase: all sections saved ✓');
  }

  // ----- Default content (the "factory reset" baseline) -----
  // We don't try to seed every field — only those most worth editing.
  // Unbound DOM keeps its hand-crafted HTML as the visible default.
  const DEFAULTS = {
    version: VERSION,
    updatedAt: null,
    publishedAt: null,
    theme: {
      primary: '#1A968F',
      secondary: '#E8A89E',
      ink: '#14242A',
      paper: '#FAF7F2',
      radiusScale: 1,
      fontScale: 1
    },
    seo: {
      home: {
        title: 'DermaPride · A Film of Integrity & Artistry',
        description: 'DermaPride Clinics · คลินิก4แท้ — เสน่ห์ที่สร้างจากความซื่อตรงและสุนทรียศิลป์',
        ogImage: 'assets/banner.jpg'
      }
    },
    home: {
      hero: {
        kicker: 'Reel 01 · A Pride of Skin',
        l1: 'เสน่ห์',
        l2: 'ที่สร้างจากความซื่อตรง',
        l3: 'และหลักการแห่งสุนทรียศิลป์',
        l4: '',
        side: 'โดยแพทย์ผู้ออกแบบ\nสร้างเสน่ห์อันเป็นเอกลักษณ์บนใบหน้า\nด้วยความซื่อตรง',
        ctaPrimary: 'จองคิวปรึกษาฟรี',
        ctaPrimaryHref: '#booking',
        ctaSecondary: 'ทักหา Facebook',
        ctaSecondaryHref: 'https://www.facebook.com/DermaPrideClinic/',
        showFacebook: true,
        backgroundImage: 'assets/welcome-hero.jpg',
        backgroundImageMobile: '',
        statValue: '12+',
        statLabel: 'YEARS OF ARTISTRY',
        visible: true
      },
      doctor: {
        role: 'Founder · Aesthetic Physician',
        name: 'Dr. Arpa Sungkanukit, M.D.',
        nameTh: 'พญ.อาภา สังขนุกิจ',
        license: 'ว.26433',
        quote: '"แตกต่าง ไม่ได้แปลว่าแปลก — เพียงแค่เรามีรสนิยม และเอกลักษณ์ในแบบของตัวเอง."',
        bio: 'แพทย์ผู้ก่อตั้ง DermaPride Clinics ผู้เชื่อในแนวคิด Integrity meets Artistry ดูแลคนไข้กว่า 50,000 เคส เน้นการวิเคราะห์โครงหน้าเป็นรายบุคคล เพื่อเสริมความงามให้ตรงจุด คงเอกลักษณ์ และเป็นธรรมชาติที่สุด',
        image: 'assets/doctor.jpg',
        specialization: 'Botox · Filler · Facial Design',
        certifications: 'Allergan · Galderma',
        experience: '12+ years · 50,000+ cases',
        verificationUrl: 'https://www.mct.or.th/'
      },
      contact: {
        phone: '065-859-8599',
        facebook: 'https://www.facebook.com/DermaPrideClinic/',
        line: 'https://line.me/R/ti/p/@dermaprideclinic',
        instagram: 'https://www.instagram.com/dermaprideclinics/',
        tiktok: 'https://www.tiktok.com/@drarpaartistdoctor'
      },
      branches: [
        {
          name: 'DermaPride · วัชรพล',
          address: 'ถนนวัชรพล กรุงเทพมหานคร',
          license: '12101005467',
          phone: '065-859-8599',
          image1: 'assets/clinic-watcharaphon-1.jpg',
          image2: 'assets/clinic-watcharaphon-2.jpg',
          image3: 'assets/in-clinic.jpg',
          mapUrl: 'https://www.google.com/maps/place/DermaPride+Clinics/@13.8792187,100.6415179,17z',
          mapEmbed: 'https://www.google.com/maps?q=DermaPride+Clinics+Watcharaphon+13.8792187,100.6415179&output=embed'
        },
        {
          name: 'DermaPride · ราชพฤกษ์',
          address: 'อมอร์ วิลเลจ ราชพฤกษ์ นนทบุรี',
          license: '10101033360',
          phone: '095-789-8595',
          image1: 'assets/clinic-ratchapruk-1.jpg',
          image2: 'assets/clinic-ratchapruk-2.jpg',
          image3: 'assets/clinic-ratchapruk-3.jpg',
          mapUrl: 'https://www.google.com/maps/place/DermaPride+Clinics+%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2/@13.9226954,100.4487628,17z',
          mapEmbed: 'https://www.google.com/maps?q=DermaPride+Clinics+Ratchapruek+13.9226954,100.4487628&output=embed'
        }
      ],
      hours: [
        { day: 'Monday',    th: 'วันจันทร์',    open: '',      close: '',      closed: true },
        { day: 'Tuesday',   th: 'วันอังคาร',    open: '',      close: '',      closed: true },
        { day: 'Wednesday', th: 'วันพุธ',       open: '10:00', close: '19:00', closed: false },
        { day: 'Thursday',  th: 'วันพฤหัสบดี',  open: '',      close: '',      closed: true },
        { day: 'Friday',    th: 'วันศุกร์',     open: '10:00', close: '19:00', closed: false },
        { day: 'Saturday',  th: 'วันเสาร์',     open: '10:00', close: '14:00', closed: false },
        { day: 'Sunday',    th: 'วันอาทิตย์',   open: '10:00', close: '14:00', closed: false }
      ],
      philosophy: {
        kicker: 'มาตรฐาน 4 แท้',
        title: 'มาตรฐาน [4 แท้]\nคือคำมั่นของเรา.',
        sub: 'คำสัญญาที่เราตั้งเป็นมาตรฐานคลินิก — ใช่ยาของแท้ที่ตรวจสอบได้ ใช้แพทย์ที่มีใบประกอบวิชาชีพ ใช้ขั้นตอนตามมาตรฐานสากล และยืนยันราคาก่อนทำหัตถการเสมอ',
        items: [
          { id: 'pl_1', title: 'Real Medicine', titleTh: 'ยาแท้',        body: 'ทุกขวด ทุกซอง ทุก lot — มีเลข อย. และนำเข้าโดยตรงจากตัวแทนผู้ผลิต ตรวจสอบได้ที่เคาน์เตอร์ก่อนเปิดใช้', visible: true },
          { id: 'pl_2', title: 'Real Doctor',   titleTh: 'หมอแท้',       body: 'หัตถการทุกขั้นตอนทำโดยแพทย์ผู้มีใบประกอบวิชาชีพเวชกรรม ที่ผ่านการอบรมจาก Allergan และ Galderma โดยตรง', visible: true },
          { id: 'pl_3', title: 'Real Protocol', titleTh: 'ขั้นตอนแท้',   body: 'ปรึกษา · วินิจฉัย · ทำหัตถการ · ดูแลหลังทำ — ยึดตามมาตรฐานการแพทย์อย่างเคร่งครัด ทุกขั้นตอนปลอดภัยและสะอาด', visible: true },
          { id: 'pl_4', title: 'Real Price',    titleTh: 'ราคาแท้',      body: 'ราคาโปร่งใส ตรวจสอบได้ ไม่มีค่าใช้จ่ายแอบแฝง ยืนยันราคาเป็นลายลักษณ์อักษรก่อนเริ่มทุกหัตถการ', visible: true }
        ]
      },
      results: {
        kicker: 'Real Results · ผลลัพธ์จริง',
        title: 'ผลลัพธ์ที่\n[บอกเล่าตัวเอง.]',
        sub: 'ภาพจากผู้ใช้บริการจริงที่ได้รับอนุญาตให้เผยแพร่ — ผลลัพธ์อาจแตกต่างกันในแต่ละบุคคล เราเน้นความเป็นธรรมชาติและคงเอกลักษณ์เดิม',
        items: [
          { id: 'rs_1', image: 'assets/ba-3.jpg',  title: 'โปรแกรมฟิลเลอร์ใต้ตา',     summary: 'แก้ปัญหาใต้ตาคล้ำดูสดใส เพิ่มมิติให้กระบอกตา ลดร่องลึกใต้ตา ด้วยฟิลเลอร์ Hyaluronic acid ของแท้จาก Galderma', treatment: 'ฟิลเลอร์ใต้ตา',          amount: '1 cc', resultTime: 'เห็นผลทันที', visible: true },
          { id: 'rs_2', image: 'assets/ba-1.jpg',  title: 'Restylane Full Face',     summary: 'ฟิลเลอร์ Restylane เติมเต็มได้ตรงจุด เพิ่มมิติให้ใบหน้า ทำให้ใบหน้าดูมีมุมมากขึ้น',           treatment: 'Restylane Filler',     amount: '2 cc', resultTime: 'เห็นผลทันที', visible: true },
          { id: 'rs_3', image: 'assets/ba-2.jpg',  title: 'ใต้ตาดำ → กระจ่างใส',    summary: 'เปลี่ยนใต้ตาดำคล้ำให้กระจ่างใสขึ้น ลดถุงใต้ตาที่ทำให้ดูบวม จากใบหน้าที่ดูโทรม ให้ดูสดใสมากขึ้น',  treatment: 'ฟิลเลอร์ใต้ตา + Skin Booster', amount: '3 cc', resultTime: '2 สัปดาห์', visible: true },
          { id: 'rs_4', image: 'assets/ba-5.jpg',  title: 'Babilone Neo One',        summary: 'สลายไขมัน พร้อมยกกระชับแบบขั้นสุด เห็นผลคูณ 2 — แก้มยุบ ยกกระชับ ไม่มีย้อย',         treatment: 'Babilone Neo One',     amount: '—',    resultTime: '4–6 สัปดาห์', visible: true },
          { id: 'rs_5', image: 'assets/ba-7.jpg',  title: 'ใต้ตา & ร่องแก้ม',       summary: 'โปรแกรมฟิลเลอร์ใต้ตา ร่องแก้ม — แก้ปัญหาใต้ตาดำคล้ำ ร่องแก้มตื้นขึ้น ใบหน้าดูอ่อนเยาว์ลง',  treatment: 'ฟิลเลอร์ใต้ตา + ร่องแก้ม', amount: '3 cc', resultTime: 'เห็นผลทันที', visible: true },
          { id: 'rs_6', image: 'assets/ba-10.jpg', title: 'Meso Reverse Aging',      summary: 'ย้อนวัย พร้อมสร้างผิวกระจก — ฟื้นฟูผิวที่ดูโทรมให้กระจ่างใส มีออร่า ลดเลือนรอยหมองคล้ำ',  treatment: 'Meso Reverse',         amount: '—',    resultTime: '3 ครั้ง', visible: true }
        ]
      },
      offers: {
        kicker: 'Curated Offerings',
        title: 'โปรโมชั่น\n[เดือนนี้.]',
        sub: 'แคมเปญที่คัดสรร — เพื่อให้คุณเริ่มต้นเส้นทางความงามได้ง่ายขึ้น ใช้ได้ทั้งสาขาวัชรพลและราชพฤกษ์',
        items: [
          { id: 'of_1', image: 'assets/slogan-2.jpg', title: '[First] Consultation', sub: 'ปรึกษาแพทย์ + วิเคราะห์ผิวครั้งแรก', tag: 'Signature',  price: 'ฟรี',        was: '฿ 1,200',  ctaHref: '#booking', visible: true },
          { id: 'of_2', image: 'assets/ba-5.jpg',     title: '[Botox] Slim Face',    sub: 'โบท็อกซ์เรียวกราม Allergan',          tag: 'Limited',    price: '฿ 3,900',     was: '฿ 6,500',  ctaHref: '#booking', visible: true },
          { id: 'of_3', image: 'assets/ba-4.jpg',     title: '[Restylane] Under-eye',sub: 'ฟิลเลอร์ใต้ตา 1 cc',                   tag: 'Best Seller',price: '฿ 8,900',     was: '฿ 12,000', ctaHref: '#booking', visible: true },
          { id: 'of_4', image: 'assets/ba-10.jpg',    title: '[Meso] Reverse Aging', sub: 'ย้อนวัย · ผิวกระจก',                   tag: 'New',        price: '฿ 2,500',     was: '฿ 4,000',  ctaHref: '#booking', visible: true },
          { id: 'of_5', image: 'assets/lifestyle-1.jpg', title: '[Vitamin] White Plus', sub: 'วิตามินผิว IV Drip',               tag: 'Wellness',   price: '฿ 1,290',     was: '฿ 1,900',  ctaHref: '#booking', visible: true }
        ]
      },
      faq: {
        kicker: 'Q&A',
        title: 'คำถาม\n[ที่พบบ่อย.]',
        items: [
          { id: 'fq_1', q: 'DermaPride ใช้ยา / ฟิลเลอร์ของแท้หรือไม่?', a: 'แท้ 100% นำเข้าโดยตรงจากตัวแทนจำหน่ายของผู้ผลิต (Allergan, Galderma, AbbVie) ทุกขวดมีเลข อย. ตรวจสอบได้ที่หน้าเคาน์เตอร์ก่อนเริ่มหัตถการ — เรายินดีให้ลูกค้าตรวจสอบเลข lot และวันหมดอายุก่อนเปิดใช้ทุกครั้ง', visible: true },
          { id: 'fq_2', q: 'คุณหมอเป็นใคร? มีประสบการณ์มาแค่ไหน?',     a: 'พญ.อาภา สังขนุกิจ (เลขที่ใบประกอบฯ ว.26433) เป็นแพทย์ผู้ก่อตั้ง มีประสบการณ์ด้านความงามมากกว่า 12 ปี ดูแลเคสมาแล้วกว่า 50,000 เคส และผ่านการอบรมจาก Allergan และ Galderma โดยตรง', visible: true },
          { id: 'fq_3', q: 'ปรึกษาแพทย์ครั้งแรก มีค่าใช้จ่ายไหม?',   a: 'ฟรีค่ะ การปรึกษาและวิเคราะห์โครงหน้าครั้งแรกไม่มีค่าใช้จ่าย และไม่บังคับให้ทำหัตถการ คุณสามารถนำคำแนะนำกลับไปคิดที่บ้านก่อนตัดสินใจได้', visible: true },
          { id: 'fq_4', q: 'เจ็บไหม? ใช้เวลานานไหม?',                a: 'หัตถการส่วนใหญ่ใช้ยาชาเฉพาะที่และมีการนวดเย็นก่อนทำ ทำให้รู้สึกตึงเล็กน้อยเท่านั้น Botox ใช้เวลาประมาณ 15–20 นาที, Filler ประมาณ 30–45 นาที, Laser ประมาณ 30 นาที — สามารถกลับไปทำกิจกรรมปกติได้ทันที', visible: true },
          { id: 'fq_5', q: 'ผ่อนชำระได้ไหม?',                        a: 'ได้ค่ะ — ผ่อน 0% สูงสุด 12 เดือน ผ่านบัตรเครดิตที่ร่วมรายการ และเรายังมีโปรแกรม "ผ่อนตรงกับคลินิก ไม่ง้อบัตร" สำหรับลูกค้าที่ไม่มีบัตรเครดิต', visible: true },
          { id: 'fq_6', q: 'ผลข้างเคียงที่ควรรู้?',                  a: 'อาการบวมแดงเล็กน้อยที่จุดฉีดเป็นเรื่องปกติและจะหายภายใน 1–3 วัน เราจะให้คำแนะนำการดูแลหลังหัตถการเป็นลายลักษณ์อักษร และมีไลน์ส่วนตัวสำหรับติดตามผลและสอบถามอาการได้ตลอด', visible: true },
          { id: 'fq_7', q: 'เปลี่ยนสาขาได้ไหม?',                     a: 'ได้ค่ะ — ระบบของเราเชื่อมต่อกันทั้งสาขาวัชรพลและราชพฤกษ์ ประวัติการรักษาจะอยู่ในระบบเดียวกัน คุณสามารถเลือกสาขาที่สะดวกได้ในแต่ละครั้ง', visible: true }
        ]
      }
    },
    procedures: (function() {
      const list = [
        seedProcedure('botox',         'Botox',          'โบท็อกซ์',      'assets/slogan-1.jpg', 'โบท็อกซ์ · ลดริ้วรอย ปรับโครงหน้า'),
        seedProcedure('filler',        'Filler',         'ฟิลเลอร์',     'assets/slogan-5.jpg', 'ฟิลเลอร์ · เติมเต็มอย่างปราณีต'),
        seedProcedure('laser',         'Laser',          'เลเซอร์',       'assets/slogan-3.jpg', 'เลเซอร์ · ฝ้า กระ ผิวกระจ่าง'),
        seedProcedure('skin-booster',  'Skin Booster',   'สกินบูสเตอร์', 'assets/ba-12.jpg',    'สกินบูสเตอร์ · ผิวฉ่ำ ฟูเด้ง'),
        seedProcedure('meso',          'Meso',           'เมโส',         'assets/ba-10.jpg',    'เมโส · ย้อนวัย ผิวกระจก'),
        seedProcedure('vitamin',       'Vitamin',        'วิตามิน',      'assets/lifestyle-1.jpg','วิตามิน IV Drip · บูสต์จากภายใน')
      ];
      const out = {};
      list.forEach((p, i) => { p.order = i + 1; out[p.slug] = p; });
      return out;
    })(),
    media: { items: [] },
    reviews: {
      items: [
        { id: 'r_seed1', name: 'คุณแอน', age: '41 ปี', treatment: 'Botox Slim Face', stars: 5, body: '"คุณหมออาภาวิเคราะห์หน้าให้ละเอียดมาก — ฉีดโบเรียวกราม แต่ยังเก็บเสน่ห์เดิมไว้ครบ ไม่ใช่หน้าเหมือนคนอื่นในโลก."', image: '' },
        { id: 'r_seed2', name: 'คุณพิม', age: '35 ปี', treatment: 'Restylane Filler', stars: 5, body: '"ฉีดฟิลเลอร์ใต้ตามาแล้ว 2 ครั้ง อุ่นใจมาก เพราะหมอใช้ของแท้ Restylane ให้ดูซองก่อนเปิดทุกครั้ง ผลลัพธ์เป็นธรรมชาติ."', image: '' },
        { id: 'r_seed3', name: 'คุณนิด', age: '32 ปี', treatment: 'Skin Booster', stars: 5, body: '"ฉีด Skin Booster เห็นผลจริง ผิวฟูเด้งขึ้นในไม่กี่วัน — แนะนำได้ตรงจุด ไม่กดดันให้ซื้อแพ็คเกจเลยค่ะ."', image: '' }
      ]
    }
  };

  function seedProcedure(slug, name, nameTh, image, description) {
    return {
      slug, name, nameTh,
      kicker: 'Procedures',
      headline: name,
      sub: 'การออกแบบความงามเฉพาะคุณ — ดูแลโดยแพทย์',
      heroImage: '',
      image: image || '',                     // home card thumbnail
      description: description || '',         // home card subtitle
      ctaText: 'ดูรายละเอียด',                // home card CTA label
      order: 0,                               // home sort order
      seo: { title: '', description: '', ogImage: '', slug: slug },
      sections: [],
      visible: true
    };
  }

  function uid(prefix) {
    return (prefix || 'id_') + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  }

  // ----- Local cache (localStorage) -----
  // Fast sync read/write used only as a render cache and offline fallback.
  // Supabase is the authoritative store.
  function _loadCache() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        published: deepMerge(deepClone(DEFAULTS), data.published || {}),
        draft:     deepMerge(deepClone(DEFAULTS), data.draft || data.published || {})
      };
    } catch (e) { return null; }
  }

  function _saveCache(pub, dft) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ published: pub, draft: dft })); } catch (e) {}
  }

  // Draft auto-save — local cache only.
  // Supabase is written exclusively by CMS.publish() using section-based upserts,
  // so frequent edits (every keystroke / section add) never hit the database.
  function saveToStorage() {
    _saveCache(published, draft);
  }

  function deepClone(v) { return JSON.parse(JSON.stringify(v)); }

  function deepMerge(target, src) {
    if (!src) return target;
    Object.keys(src).forEach(k => {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
        target[k] = deepMerge(target[k] || {}, src[k]);
      } else {
        target[k] = src[k];
      }
    });
    return target;
  }

  function getAt(obj, path) {
    if (!path) return obj;
    return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  }

  function setAt(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const parent = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
    parent[last] = value;
    return obj;
  }

  // ----- State -----
  // Initialise synchronously from local cache so the first paint is instant.
  // _initRemote() will overwrite with authoritative Supabase data when it arrives.
  const _cached = _loadCache();
  let published  = _cached ? _cached.published : deepClone(DEFAULTS);
  let draft      = _cached ? _cached.draft     : deepClone(DEFAULTS);
  const subscribers = new Set();
  function notify() {
    subscribers.forEach(fn => { try { fn({ published, draft }); } catch (e) { console.error(e); } });
  }

  // ----- Public API -----
  const CMS = {
    get(path) { return getAt(published, path); },
    getDraft(path) {
      const d = getAt(draft, path);
      return d !== undefined ? d : getAt(published, path);
    },

    set(path, value) {
      setAt(draft, path, value);
      draft.updatedAt = Date.now();
      saveToStorage();
      notify();
      this.hydrateAll();
    },

    async publish() {
      console.log('[CMS] PUBLISH CLICKED — entering publish()');
      published = deepClone(draft);
      published.publishedAt = Date.now();
      _saveCache(published, draft);
      notify();
      this.hydrateAll();
      console.log('[CMS] ABOUT TO SEND REQUEST — sections:', Object.keys(_SEC_KEYS).join(', '));
      console.log('[CMS] SENDING TO SUPABASE …');
      await _saveSupabase(published, draft);
      console.log('[CMS] publish() → ALL DONE ✓');
    },

    discardDraft() {
      draft = deepClone(published);
      saveToStorage();
      notify();
      this.hydrateAll();
    },

    resetAll() {
      published = deepClone(DEFAULTS);
      draft = deepClone(DEFAULTS);
      saveToStorage();
      notify();
      this.hydrateAll();
    },

    subscribe(fn) { subscribers.add(fn); return () => subscribers.delete(fn); },

    exportJSON() { return JSON.stringify({ published, draft }, null, 2); },
    importJSON(json) {
      const data = JSON.parse(json);
      published = deepMerge(deepClone(DEFAULTS), data.published || {});
      draft = deepMerge(deepClone(DEFAULTS), data.draft || {});
      saveToStorage();
      notify();
      this.hydrateAll();
    },

    hasDraftChanges() {
      return JSON.stringify(published) !== JSON.stringify(draft);
    },

    // Render source — always draft so edits show live; published is the committed copy
    _renderSource() { return draft; },

    // Hydrate DOM bindings — run on load + after each change
    hydrate(root) {
      root = root || document;
      const src = this._renderSource();
      root.querySelectorAll('[data-cms-text]').forEach(el => {
        const v = getAt(src, el.dataset.cmsText);
        if (v !== undefined && v !== null && v !== '') el.textContent = String(v);
      });
      root.querySelectorAll('[data-cms-html]').forEach(el => {
        const v = getAt(src, el.dataset.cmsHtml);
        if (v !== undefined && v !== null && v !== '') el.innerHTML = String(v);
      });
      root.querySelectorAll('[data-cms-src]').forEach(el => {
        const v = getAt(src, el.dataset.cmsSrc);
        if (v) el.src = v;
      });
      root.querySelectorAll('[data-cms-href]').forEach(el => {
        const v = getAt(src, el.dataset.cmsHref);
        if (v) el.setAttribute('href', v);
      });
      // Theme tokens → CSS custom properties on :root
      const theme = src.theme || {};
      const r = document.documentElement;
      if (theme.primary) r.style.setProperty('--cms-primary', theme.primary);
      if (theme.secondary) r.style.setProperty('--cms-secondary', theme.secondary);
      if (theme.ink) r.style.setProperty('--cms-ink', theme.ink);
      if (theme.paper) r.style.setProperty('--cms-paper', theme.paper);
      if (theme.radiusScale) r.style.setProperty('--cms-radius-scale', theme.radiusScale);
      if (theme.fontScale) r.style.setProperty('--cms-font-scale', theme.fontScale);
    },

    hydrateAll() { this.hydrate(document); },

    // ===== Media =====
    media: {
      list() { return CMS._renderSource().media.items.slice(); },
      async add(file) {
        const ext         = (file.name.split('.').pop() || 'bin').toLowerCase();
        const path        = uid('img_') + '.' + ext;
        const contentType = file.type || 'application/octet-stream';
        console.log('[MEDIA] upload start:', file.name,
          '(' + (file.size / 1024).toFixed(1) + ' KB)', '→', SB_BUCKET + '/' + path);

        var res;
        try {
          res = await fetch(SB_URL + '/storage/v1/object/' + SB_BUCKET + '/' + path, {
            method:  'POST',
            headers: {
              'apikey':        SB_KEY,
              'Authorization': 'Bearer ' + SB_KEY,
              'Content-Type':  contentType,
              'x-upsert':      'true'
            },
            body: file
          });
        } catch (netErr) {
          var netMsg = '[MEDIA] upload FAILED — network error: ' + netErr.message;
          console.error(netMsg);
          throw new Error(netMsg);
        }

        if (!res.ok) {
          var txt = await res.text().catch(function() { return '(unreadable)'; });
          console.error('[MEDIA] upload FAILED — HTTP', res.status, txt);
          if (res.status === 400 || res.status === 401 || res.status === 403) {
            console.error(
              '[MEDIA] Likely cause: cms-media bucket has no anon INSERT policy.\n' +
              'Run in Supabase SQL Editor:\n' +
              "  insert into storage.buckets (id, name, public) values ('cms-media', 'cms-media', true)\n" +
              '  on conflict (id) do update set public = true;\n' +
              "  create policy \"anon storage upload\"  on storage.objects for insert to anon with check (bucket_id = 'cms-media');\n" +
              "  create policy \"anon storage select\"  on storage.objects for select to anon using (bucket_id = 'cms-media');\n" +
              "  create policy \"anon storage delete\"  on storage.objects for delete to anon using (bucket_id = 'cms-media');"
            );
          }
          throw new Error('[MEDIA] upload FAILED HTTP ' + res.status + ': ' + txt);
        }

        const src  = SB_URL + '/storage/v1/object/public/' + SB_BUCKET + '/' + path;
        console.log('[MEDIA] upload success →', src);

        const item  = { id: uid('m_'), name: file.name, type: contentType, size: file.size, src, uploadedAt: Date.now() };
        const items = draft.media.items.slice();
        items.unshift(item);
        draft.media.items = items;
        draft.updatedAt   = Date.now();
        saveToStorage();
        notify();
        return item;
      },
      remove(id) {
        const item = draft.media.items.find(m => m.id === id);
        draft.media.items = draft.media.items.filter(m => m.id !== id);
        draft.updatedAt   = Date.now();
        saveToStorage(); notify();
        const prefix = SB_URL + '/storage/v1/object/public/' + SB_BUCKET + '/';
        if (item && item.src && item.src.startsWith(prefix)) {
          const path = item.src.slice(prefix.length);
          fetch(SB_URL + '/storage/v1/object/' + SB_BUCKET, {
            method: 'DELETE',
            headers: _sbHeaders(),
            body: JSON.stringify({ prefixes: [path] })
          }).catch(e => console.warn('[CMS] Storage delete failed:', e.message));
        }
      }
    },

    // ===== Procedure section management =====
    sections: {
      list(catSlug) {
        return (CMS._renderSource().procedures[catSlug] || {}).sections || [];
      },
      _proc(catSlug) {
        return draft.procedures[catSlug] || (draft.procedures[catSlug] = seedProcedure(catSlug, catSlug, catSlug));
      },
      add(catSlug, type) {
        const proc = this._proc(catSlug);
        const idx = proc.sections.length;
        const sec = {
          id: uid('s_'),
          type: type || 'image-text',
          visible: true,
          title: '',
          subtitle: '',
          body: '',
          price: '',
          tags: '',
          images: []
        };
        // sensible defaults per section type
        if (type === 'pricing') {
          sec.title = 'รายการราคา';
          sec.body = '— เริ่ม ฿ 3,900\n— ผ่อน 0% สูงสุด 12 เดือน';
        }
        if (type === 'reviews') {
          sec.title = 'รีวิวจากลูกค้า';
        }
        proc.sections.push(sec);
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
        return sec;
      },
      update(catSlug, id, patch) {
        const proc = this._proc(catSlug);
        const sec = proc.sections.find(s => s.id === id);
        if (!sec) return;
        Object.assign(sec, patch);
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
      },
      remove(catSlug, id) {
        const proc = this._proc(catSlug);
        proc.sections = proc.sections.filter(s => s.id !== id);
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
      },
      move(catSlug, id, dir) {
        const proc = this._proc(catSlug);
        const i = proc.sections.findIndex(s => s.id === id);
        if (i < 0) return;
        const j = i + (dir === 'up' ? -1 : 1);
        if (j < 0 || j >= proc.sections.length) return;
        [proc.sections[i], proc.sections[j]] = [proc.sections[j], proc.sections[i]];
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
      },
      duplicate(catSlug, id) {
        const proc = this._proc(catSlug);
        const i = proc.sections.findIndex(s => s.id === id);
        if (i < 0) return;
        const copy = JSON.parse(JSON.stringify(proc.sections[i]));
        copy.id = uid('s_');
        copy.title = (copy.title || '') + ' (copy)';
        proc.sections.splice(i + 1, 0, copy);
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
      }
    },

    // ===== Procedure metadata =====
    procedures: {
      list() {
        const src = CMS._renderSource().procedures;
        const items = Object.keys(src).map(slug => ({ slug, ...src[slug] }));
        // sort by .order (numeric, fallback 0), stable
        return items.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      },
      listVisible() {
        return this.list().filter(p => p.visible !== false);
      },
      get(slug) {
        return CMS._renderSource().procedures[slug];
      },
      update(slug, patch) {
        const proc = draft.procedures[slug] || (draft.procedures[slug] = seedProcedure(slug, slug, slug));
        Object.assign(proc, patch);
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
      },
      changeSlug(oldSlug, newSlug) {
        newSlug = (newSlug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
        if (!newSlug || newSlug === oldSlug) return oldSlug;
        if (draft.procedures[newSlug]) return oldSlug; // refuse collision
        const proc = draft.procedures[oldSlug];
        if (!proc) return oldSlug;
        proc.slug = newSlug;
        if (proc.seo) proc.seo.slug = newSlug;
        draft.procedures[newSlug] = proc;
        delete draft.procedures[oldSlug];
        saveToStorage();
        notify();
        return newSlug;
      },
      add(name) {
        name = name || 'New category';
        // generate unique slug
        let base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'category';
        let slug = base; let n = 2;
        while (draft.procedures[slug]) slug = `${base}-${n++}`;
        const maxOrder = Math.max(0, ...Object.values(draft.procedures).map(p => Number(p.order) || 0));
        const proc = seedProcedure(slug, name, '');
        proc.order = maxOrder + 1;
        draft.procedures[slug] = proc;
        saveToStorage();
        notify();
        return slug;
      },
      remove(slug) {
        delete draft.procedures[slug];
        saveToStorage();
        notify();
      },
      duplicate(slug) {
        const src = draft.procedures[slug];
        if (!src) return;
        let base = slug; let newSlug = `${base}-copy`; let n = 2;
        while (draft.procedures[newSlug]) newSlug = `${base}-copy-${n++}`;
        const copy = JSON.parse(JSON.stringify(src));
        copy.slug = newSlug;
        copy.name = (copy.name || '') + ' (copy)';
        if (copy.seo) copy.seo.slug = newSlug;
        const maxOrder = Math.max(0, ...Object.values(draft.procedures).map(p => Number(p.order) || 0));
        copy.order = maxOrder + 1;
        draft.procedures[newSlug] = copy;
        saveToStorage();
        notify();
        return newSlug;
      },
      move(slug, dir) {
        const items = this.list();
        const i = items.findIndex(p => p.slug === slug);
        if (i < 0) return;
        const j = i + (dir === 'up' ? -1 : 1);
        if (j < 0 || j >= items.length) return;
        // swap their .order values
        const a = draft.procedures[items[i].slug];
        const b = draft.procedures[items[j].slug];
        const ao = Number(a.order) || 0, bo = Number(b.order) || 0;
        a.order = bo; b.order = ao;
        // if they tied, force a gap
        if (ao === bo) { a.order = i; b.order = j; if (dir === 'up') { a.order = j-1; b.order = j; } }
        saveToStorage();
        notify();
      }
    },

    // ===== Reviews =====
    reviews: {
      list() { return CMS._renderSource().reviews.items.slice(); },
      add(item) {
        const r = Object.assign({ id: uid('r_'), name: '', body: '', stars: 5, treatment: '', image: '', video: '' }, item || {});
        draft.reviews.items.push(r);
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
        return r;
      },
      update(id, patch) {
        const r = draft.reviews.items.find(x => x.id === id);
        if (r) Object.assign(r, patch);
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
      },
      remove(id) {
        draft.reviews.items = draft.reviews.items.filter(x => x.id !== id);
        draft.updatedAt = Date.now();
        saveToStorage();
        notify();
      }
    }
  };

  // ----- Two-phase boot -----
  // Phase 1 (sync, instant): render from local cache — no visible delay.
  // Phase 2 (async):         fetch from Supabase, re-render with authoritative data.
  async function _initRemote() {
    try {
      console.log('[CMS] _initRemote: TARGET = cms_sections ONLY (cms_data is retired)');
      console.log('[CMS] _initRemote: connecting to Supabase …');
      const remote = await _loadSupabase();
      if (remote) {
        published = remote.published;
        draft     = remote.draft;
        _saveCache(published, draft);
        notify();
        CMS.hydrate(document);
        console.info('[CMS] ✓ Remote load OK. updatedAt:', draft.updatedAt || '(not set)');
      } else {
        console.info('[CMS] No row found — writing initial seed row …');
        await _saveSupabase(published, draft);
        console.info('[CMS] ✓ Initial seed row written.');
      }
    } catch (e) {
      console.error('[CMS] ✗ _initRemote FAILED:', e.message);
      if (String(e.message).includes('401') || String(e.message).includes('403') || String(e.message).includes('JWT')) {
        console.error('[CMS] Auth failure. Go to Supabase → Project Settings → API and copy the "anon public" JWT key (starts with eyJ…) into SB_KEY in engine.js.');
      }
    }
  }

  function _boot() {
    CMS.hydrate(document);  // Phase 1 — instant render from cache/defaults
    _initRemote();           // Phase 2 — async fetch from Supabase
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }
  CMS.subscribe(() => CMS.hydrate(document));

  window.CMS = CMS;
})();
