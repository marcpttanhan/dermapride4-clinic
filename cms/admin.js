/* ============================================================
   DermaPride CMS — Admin UI v2 (visual & direct)
   ============================================================ */
(function () {
  'use strict';
  if (!window.CMS) { console.warn('CMS engine not loaded'); return; }

  // ---------- Icons ----------
  const I = {
    home:    '<svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>',
    doctor:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/></svg>',
    layers:  '<svg viewBox="0 0 24 24"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5"/></svg>',
    image:   '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>',
    star:    '<svg viewBox="0 0 24 24"><polygon points="12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5 12 2"/></svg>',
    pin:     '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock:   '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    search:  '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    palette: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="6" cy="14" r="1.5"/><circle cx="9" cy="7" r="1.5"/><circle cx="15" cy="7" r="1.5"/><circle cx="18" cy="14" r="1.5"/></svg>',
    archive: '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></svg>',
    plus:    '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    grip:    '<svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg>',
    up:      '<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>',
    dn:      '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
    copy:    '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    trash:   '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></svg>',
    eye:     '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff:  '<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22M9.88 9.88a3 3 0 0 0 4.24 4.24"/></svg>',
    x:       '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    swap:    '<svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    upload:  '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
    download:'<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    external:'<svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>'
  };

  // ---------- Sidebar tabs ----------
  const TABS = [
    { id: 'home',       label: 'Home',              icon: I.home },
    { id: 'philosophy', label: 'Philosophy',        icon: I.layers },
    { id: 'doctor',     label: 'Doctor',            icon: I.doctor },
    { id: 'procedures', label: 'Procedures',        icon: I.layers },
    { id: 'results',    label: 'Real Results',      icon: I.image },
    { id: 'offers',     label: 'Curated Offerings', icon: I.star },
    { id: 'faq',        label: 'FAQ',               icon: I.search },
    { id: 'videos',     label: 'Video Testimonials', icon: I.image },
    { id: 'reviews',    label: 'Reviews',           icon: I.star },
    { id: 'branches',   label: 'Branches',          icon: I.pin },
    { id: 'hours',      label: 'Opening Hours',     icon: I.clock },
    { id: 'theme',      label: 'Theme',             icon: I.palette },
    { id: 'seo',        label: 'SEO',               icon: I.search },
    { id: 'media',      label: 'Media Library',     icon: I.image },
    { id: 'backup',     label: 'Backup',            icon: I.archive }
  ];

  // ---------- Build shell ----------
  function build() {
    const v = document.createElement('div');
    v.className = 'cms-veil'; v.id = 'cmsVeil';
    v.setAttribute('role','dialog'); v.setAttribute('aria-modal','true'); v.setAttribute('aria-hidden','true');
    v.innerHTML = `
      <div class="cms-shell">
        <aside class="cms-aside">
          <div class="cms-aside-head">
            <h3 class="lg">DermaPride<em>.</em> CMS</h3>
            <div class="sub">Content Studio</div>
          </div>
          <nav class="cms-aside-nav" id="cmsNav"></nav>
          <div class="cms-aside-foot"><span class="ver">v1.1</span> · Visual Editor</div>
        </aside>
        <div class="cms-main">
          <div class="cms-bar">
            <div class="cms-bar-title">
              <span class="ctx" id="cmsCtx"></span>
              <span id="cmsTitle"></span>
            </div>
            <div class="cms-bar-actions">
              <span class="cms-draft-flag is-hidden" id="cmsDraftFlag">Unpublished draft</span>
              <button class="cms-btn cms-btn--ghost" id="cmsDiscard">Discard</button>
              <button class="cms-btn cms-btn--primary" id="cmsPublish">Publish</button>
              <button class="cms-close" id="cmsClose" aria-label="Close">${I.x}</button>
            </div>
          </div>
          <div class="cms-body" id="cmsBody"></div>
        </div>
      </div>
    `;
    document.body.appendChild(v);

    // Logout button in sidebar footer
    const foot = v.querySelector('.cms-aside-foot');
    if (foot) {
      const lb = document.createElement('button');
      lb.textContent = 'Log out';
      lb.style.cssText = 'display:block;width:100%;margin-top:.6rem;padding:.35rem;background:none;border:1px solid rgba(255,255,255,.2);border-radius:5px;color:inherit;font-size:.78rem;cursor:pointer;opacity:.7';
      lb.addEventListener('click', _logout);
      foot.appendChild(lb);
    }

    // Build nav
    const nav = v.querySelector('#cmsNav');
    TABS.forEach(t => {
      const a = document.createElement('div');
      a.className = 'cms-nav-item';
      a.dataset.tab = t.id;
      a.innerHTML = `<span class="ic">${t.icon}</span><span>${t.label}</span>`;
      a.addEventListener('click', () => setTab(t.id));
      nav.appendChild(a);
    });

    // Bar actions
    v.querySelector('#cmsClose').addEventListener('click', closeCMS);
    v.querySelector('#cmsPublish').addEventListener('click', async () => {
      console.log('[ADMIN] Publish button clicked');
      const btn = v.querySelector('#cmsPublish');
      const prev = btn.textContent;
      btn.textContent = 'Publishing…'; btn.disabled = true;
      try {
        console.log('[ADMIN] calling CMS.publish() …');
        await CMS.publish();
        console.log('[ADMIN] CMS.publish() resolved — success');
        toast('Published — changes are now live on all devices.');
      } catch (e) {
        console.error('[ADMIN] CMS.publish() FAILED:', e);
        toast('Publish failed — ' + (e && e.message ? e.message : 'check console'));
      } finally {
        btn.textContent = prev; btn.disabled = false; refreshFlag();
      }
    });
    v.querySelector('#cmsDiscard').addEventListener('click', () => {
      if (confirm('Discard unpublished changes?')) { CMS.discardDraft(); renderTab(); toast('Draft discarded.'); refreshFlag(); }
    });
    v.addEventListener('click', e => { if (e.target === v) closeCMS(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && v.classList.contains('is-open')) closeCMS(); });
    CMS.subscribe(refreshFlag);
  }

  function refreshFlag() {
    const f = document.getElementById('cmsDraftFlag');
    if (f) f.classList.toggle('is-hidden', !CMS.hasDraftChanges());
  }

  // ---------- Tab routing ----------
  let activeTab = 'home', activeProc = null;
  function setTab(id) {
    activeTab = id; activeProc = null;
    const v = document.getElementById('cmsVeil');
    v.querySelectorAll('.cms-nav-item').forEach(el => {
      el.classList.toggle('is-active', el.dataset.tab === id);
      if (el.dataset.tab === id) {
        document.getElementById('cmsCtx').textContent = '';
        document.getElementById('cmsTitle').textContent = el.querySelector('span:last-child').textContent;
      }
    });
    renderTab();
  }

  function renderTab() {
    const body = document.getElementById('cmsBody');
    body.innerHTML = '';
    const map = { home: pHome, doctor: pDoctor, procedures: pProcedures,
                  reviews: pReviews, branches: pBranches, hours: pHours,
                  media: pMedia, theme: pTheme, seo: pSEO, backup: pBackup,
                  philosophy: pPhilosophy, results: pResults, offers: pOffers, faq: pFAQ,
                  videos: pVideos };
    (map[activeTab] || pHome)(body);
  }

  // ---------- Reusable form widgets ----------

  function txt(label, path, opts) {
    opts = opts || {};
    const id = 'i_' + path.replace(/\./g, '_');
    const cur = CMS.getDraft(path);
    return `<div class="cms-field">
      <label for="${id}">${label}</label>
      <input id="${id}" type="${opts.type||'text'}" data-bind="${path}" value="${esc(cur)}" placeholder="${esc(opts.ph||'')}" />
    </div>`;
  }

  function area(label, path, opts) {
    opts = opts || {};
    const id = 'a_' + path.replace(/\./g, '_');
    const cur = CMS.getDraft(path);
    return `<div class="cms-field">
      <label for="${id}">${label}</label>
      <textarea id="${id}" data-bind="${path}" placeholder="${esc(opts.ph||'')}" style="${opts.style||''}">${esc(cur)}</textarea>
    </div>`;
  }

  function chk(label, path) {
    const id = 'c_' + path.replace(/\./g, '_');
    const cur = CMS.getDraft(path) !== false;
    return `<div class="cms-field">
      <label class="cms-cb" for="${id}">
        <input id="${id}" type="checkbox" data-bind="${path}" ${cur ? 'checked' : ''} />
        <span>${label}</span>
      </label>
    </div>`;
  }

  function bind(root, onAfter) {
    root.querySelectorAll('[data-bind]').forEach(el => {
      el.addEventListener('input', () => {
        let v = el.value;
        if (el.type === 'number') v = Number(v);
        if (el.type === 'checkbox') v = el.checked;
        CMS.set(el.dataset.bind, v);
        if (onAfter) onAfter(el.dataset.bind, v);
      });
    });
  }

  // Inline image swap — click to replace via library OR direct upload
  function img(label, path, opts) {
    opts = opts || {};
    const cur = CMS.getDraft(path) || '';
    const id = 'img_' + path.replace(/\./g, '_');
    return `
      <div class="cms-field cms-img-field" data-img-path="${path}" id="${id}">
        ${label ? `<label>${label}</label>` : ''}
        <div class="cms-img-preview${opts.aspect ? ' aspect-' + opts.aspect : ''}">
          ${cur ? `<img src="${esc(cur)}" alt="" />` : `<div class="empty">${I.image}<span>คลิกเพื่อเพิ่ม</span></div>`}
          <div class="cms-img-overlay">
            <button data-act="upload">${I.upload} อัปโหลด</button>
            <button data-act="library">${I.image} จาก Library</button>
            ${cur ? `<button data-act="clear" class="danger">${I.x} ลบ</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function bindImageFields(root) {
    root.querySelectorAll('.cms-img-field').forEach(el => {
      const path = el.dataset.imgPath;
      const onPicked = src => { CMS.set(path, src); refreshImageField(el); };

      el.querySelector('[data-act="upload"]')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*,video/*';
        f.onchange = async () => {
          if (!f.files[0]) return;
          if (f.files[0].size > 8 * 1024 * 1024) return alert('Max 8MB');
          const item = await CMS.media.add(f.files[0]);
          onPicked(item.src);
        };
        f.click();
      });
      el.querySelector('[data-act="library"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openMediaPicker(onPicked);
      });
      el.querySelector('[data-act="clear"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        onPicked('');
      });

      // drag & drop on the preview
      const prev = el.querySelector('.cms-img-preview');
      ['dragover','dragenter'].forEach(ev => prev.addEventListener(ev, e => { e.preventDefault(); prev.classList.add('is-drag'); }));
      ['dragleave','drop'].forEach(ev => prev.addEventListener(ev, e => { e.preventDefault(); prev.classList.remove('is-drag'); }));
      prev.addEventListener('drop', async e => {
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const item = await CMS.media.add(file);
        onPicked(item.src);
      });
    });
  }

  function refreshImageField(el) {
    const path = el.dataset.imgPath;
    const label = el.querySelector(':scope > label');
    const opts = el.querySelector('.cms-img-preview').className.match(/aspect-(\w+)/);
    const newHTML = img(label ? label.textContent : '', path, { aspect: opts ? opts[1] : '' });
    const tmp = document.createElement('div'); tmp.innerHTML = newHTML;
    el.innerHTML = tmp.firstElementChild.innerHTML;
    bindImageFields(el.parentElement);
  }

  // ---------- Generic collection helpers ----------
  // Move/duplicate/delete/add for any array at a CMS path
  function collMove(path, id, dir) {
    const list = (CMS.getDraft(path) || []).slice();
    const i = list.findIndex(x => x.id === id);
    const j = i + (dir === 'up' ? -1 : 1);
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    CMS.set(path, list);
  }
  function collRemove(path, id) {
    const list = (CMS.getDraft(path) || []).filter(x => x.id !== id);
    CMS.set(path, list);
  }
  function collDup(path, id) {
    const list = (CMS.getDraft(path) || []).slice();
    const i = list.findIndex(x => x.id === id);
    if (i < 0) return;
    const copy = JSON.parse(JSON.stringify(list[i]));
    copy.id = 'x_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
    list.splice(i + 1, 0, copy);
    CMS.set(path, list);
  }
  function collAdd(path, item) {
    const list = (CMS.getDraft(path) || []).slice();
    item.id = 'x_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
    if (item.visible === undefined) item.visible = true;
    list.push(item);
    CMS.set(path, list);
    return item;
  }
  function collUpdate(path, id, patch) {
    const list = (CMS.getDraft(path) || []).slice();
    const i = list.findIndex(x => x.id === id);
    if (i < 0) return;
    list[i] = Object.assign({}, list[i], patch);
    CMS.set(path, list);
  }

  // Reusable item-card chrome (used by all 4 collection editors)
  function itemActions(path, item, idx, total) {
    return `<div class="cms-itm-actions">
      <button data-act="vis" title="${item.visible === false ? 'แสดง' : 'ซ่อน'}">${item.visible === false ? I.eyeOff : I.eye}</button>
      <button data-act="up" ${idx===0?'disabled':''}>${I.up}</button>
      <button data-act="down" ${idx===total-1?'disabled':''}>${I.dn}</button>
      <button data-act="dup">${I.copy}</button>
      <button data-act="del" class="danger">${I.trash}</button>
    </div>`;
  }
  function bindItemActions(host, path, item) {
    host.querySelectorAll('.cms-itm-actions button').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        const a = b.dataset.act;
        if (a === 'up' || a === 'down') collMove(path, item.id, a);
        else if (a === 'dup') collDup(path, item.id);
        else if (a === 'del' && confirm('ลบรายการนี้?')) collRemove(path, item.id);
        else if (a === 'vis') collUpdate(path, item.id, { visible: !(item.visible !== false) });
        renderTab();
      });
    });
  }

  // ---------- PHILOSOPHY ----------
  function pPhilosophy(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Philosophy <em>· 4 แท้</em></h2>
      <p class="lead">หัวเรื่องและรายการคุณค่าหลัก (4 แท้) ของคลินิก</p>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Section header</div></div>
        ${txt('Kicker', 'home.philosophy.kicker')}
        ${area('Headline (ใช้ [bracket] สำหรับตัวเอน)', 'home.philosophy.title', { style: 'min-height: 70px;' })}
        ${area('Subtitle', 'home.philosophy.sub')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin: 18px 0 10px;">
        <h3 style="margin:0;">รายการ ${(CMS.getDraft('home.philosophy.items')||[]).length} รายการ</h3>
        <button class="cms-btn cms-btn--primary cms-btn--sm" id="addPl">${I.plus} เพิ่มรายการ</button>
      </div>
      <div id="plList"></div>
    `;
    body.appendChild(pane);
    bind(pane);
    pane.querySelector('#addPl').addEventListener('click', () => {
      collAdd('home.philosophy.items', { title: 'New', titleTh: 'ใหม่', body: '' });
      renderTab();
    });
    const host = pane.querySelector('#plList');
    const items = CMS.getDraft('home.philosophy.items') || [];
    if (!items.length) { host.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>รายการ</em></h4></div>'; return; }
    items.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = 'cms-card cms-itm' + (it.visible === false ? ' is-hidden' : '');
      card.innerHTML = `
        <div class="cms-itm-grid">
          <div style="flex:1;">
            <div class="cms-row">
              <div class="cms-field"><label>Title (EN)</label><input type="text" data-fld="title" value="${esc(it.title)}" /></div>
              <div class="cms-field"><label>Title (TH)</label><input type="text" data-fld="titleTh" value="${esc(it.titleTh||'')}" /></div>
            </div>
            <div class="cms-field"><label>Description</label><textarea data-fld="body" style="min-height: 70px;">${esc(it.body||'')}</textarea></div>
          </div>
          ${itemActions('home.philosophy.items', it, idx, items.length)}
        </div>
      `;
      host.appendChild(card);
      card.querySelectorAll('[data-fld]').forEach(inp => {
        inp.addEventListener('input', () => collUpdate('home.philosophy.items', it.id, { [inp.dataset.fld]: inp.value }));
      });
      bindItemActions(card, 'home.philosophy.items', it);
    });
  }

  // ---------- RESULTS (Real Results gallery) ----------
  function pResults(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Real <em>Results</em></h2>
      <p class="lead">แกลเลอรี่ Before / After ที่ผู้ใช้คลิกเลือกเคสได้ในหน้าจริง</p>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Section header</div></div>
        ${txt('Kicker', 'home.results.kicker')}
        ${area('Headline (ใช้ [bracket] สำหรับตัวเอน)', 'home.results.title', { style: 'min-height: 70px;' })}
        ${area('Subtitle', 'home.results.sub')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin: 18px 0 10px;">
        <h3 style="margin:0;">เคส ${(CMS.getDraft('home.results.items')||[]).length} เคส</h3>
        <button class="cms-btn cms-btn--primary cms-btn--sm" id="addR">${I.plus} เพิ่มเคส</button>
      </div>
      <div id="rsList"></div>
    `;
    body.appendChild(pane);
    bind(pane);
    pane.querySelector('#addR').addEventListener('click', () => {
      collAdd('home.results.items', { image: '', title: 'New case', summary: '', treatment: '', amount: '', resultTime: '' });
      renderTab();
    });
    const host = pane.querySelector('#rsList');
    const items = CMS.getDraft('home.results.items') || [];
    if (!items.length) { host.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>เคส</em></h4></div>'; return; }
    items.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = 'cms-card cms-itm cms-itm-rs' + (it.visible === false ? ' is-hidden' : '');
      card.innerHTML = `
        <div class="cms-review-grid">
          <div class="cms-img-field" data-img-path="home.results.items.${idx}.image">
            <div class="cms-img-preview aspect-square">
              ${it.image ? `<img src="${esc(it.image)}" alt="" />` : `<div class="empty">${I.image}<span>เพิ่มรูป</span></div>`}
              <div class="cms-img-overlay">
                <button data-act="upload">${I.upload}</button>
                <button data-act="library">${I.image}</button>
                ${it.image ? `<button data-act="clear" class="danger">${I.x}</button>` : ''}
              </div>
            </div>
          </div>
          <div>
            <div class="cms-field"><label>Title / หัวเรื่อง</label><input type="text" data-fld="title" value="${esc(it.title||'')}" /></div>
            <div class="cms-field"><label>Summary</label><textarea data-fld="summary" style="min-height: 70px;">${esc(it.summary||'')}</textarea></div>
            <div class="cms-row">
              <div class="cms-field"><label>Treatment</label><input type="text" data-fld="treatment" value="${esc(it.treatment||'')}" /></div>
              <div class="cms-field"><label>Amount</label><input type="text" data-fld="amount" value="${esc(it.amount||'')}" /></div>
            </div>
            <div class="cms-row">
              <div class="cms-field"><label>ระยะเวลาเห็นผล</label><input type="text" data-fld="resultTime" value="${esc(it.resultTime||'')}" /></div>
              <div class="cms-field" style="display:flex; align-items:flex-end;">${itemActions('home.results.items', it, idx, items.length)}</div>
            </div>
          </div>
        </div>
      `;
      host.appendChild(card);
      card.querySelectorAll('[data-fld]').forEach(inp => {
        inp.addEventListener('input', () => collUpdate('home.results.items', it.id, { [inp.dataset.fld]: inp.value }));
      });
      const setImg = src => { collUpdate('home.results.items', it.id, { image: src }); renderTab(); };
      const fld = card.querySelector('.cms-img-field');
      fld.querySelector('[data-act="upload"]')?.addEventListener('click', () => {
        const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
        f.onchange = async () => { if (f.files[0]) { const item = await CMS.media.add(f.files[0]); setImg(item.src); } };
        f.click();
      });
      fld.querySelector('[data-act="library"]')?.addEventListener('click', () => openMediaPicker(setImg));
      fld.querySelector('[data-act="clear"]')?.addEventListener('click', () => setImg(''));
      bindItemActions(card, 'home.results.items', it);
    });
  }

  // ---------- VIDEO TESTIMONIALS ----------
  function pVideos(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    const count = (CMS.getDraft('home.voices.videos') || []).length;
    pane.innerHTML = `
      <h2>Video <em>Testimonials</em></h2>
      <p class="lead">สไลด์เดอร์วิดีโอรีวิวจากลูกค้า — รองรับ YouTube, Facebook, TikTok</p>
      ${chk('แสดงส่วนนี้บนหน้าเว็บ', 'home.voices.visible')}
      <div style="display:flex; justify-content:space-between; align-items:center; margin: 18px 0 10px;">
        <h3 style="margin:0;">วิดีโอ ${count} รายการ</h3>
        <button class="cms-btn cms-btn--primary cms-btn--sm" id="addVid">${I.plus} เพิ่มวิดีโอ</button>
      </div>
      <div id="vidList"></div>
    `;
    body.appendChild(pane);
    bind(pane);
    pane.querySelector('#addVid').addEventListener('click', () => {
      collAdd('home.voices.videos', { title: '', name: '', videoUrl: '', platform: 'auto', embedStatus: 'auto', fallbackUrl: '', description: '', visible: true });
      renderTab();
    });
    const host = pane.querySelector('#vidList');
    const items = CMS.getDraft('home.voices.videos') || [];
    if (!items.length) {
      host.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>วิดีโอ</em></h4><p>กด + เพิ่มวิดีโอ แล้ววางลิงก์ YouTube, Facebook หรือ TikTok</p></div>';
      return;
    }
    items.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = 'cms-card cms-itm' + (it.visible === false ? ' is-hidden' : '');
      card.innerHTML = `
        <div class="cms-itm-grid">
          <div style="flex:1; min-width:0;">
            <div class="cms-row">
              <div class="cms-field" style="flex:2;">
                <label>Video URL (YouTube / Facebook / TikTok)</label>
                <input type="url" data-fld="videoUrl" value="${esc(it.videoUrl||'')}" placeholder="https://..." />
              </div>
              <div class="cms-field" style="flex:0 0 140px;">
                <label>Platform</label>
                <select data-fld="platform">
                  <option value="auto"     ${(!it.platform||it.platform==='auto')    ?'selected':''}>Auto-detect</option>
                  <option value="youtube"  ${it.platform==='youtube'                 ?'selected':''}>YouTube</option>
                  <option value="facebook" ${it.platform==='facebook'                ?'selected':''}>Facebook</option>
                  <option value="tiktok"   ${it.platform==='tiktok'                  ?'selected':''}>TikTok</option>
                </select>
              </div>
            </div>
            <div class="cms-row">
              <div class="cms-field"><label>ชื่อวิดีโอ / หัวเรื่อง</label><input type="text" data-fld="title" value="${esc(it.title||'')}" /></div>
              <div class="cms-field"><label>ชื่อลูกค้า</label><input type="text" data-fld="name" value="${esc(it.name||'')}" /></div>
            </div>
            <div class="cms-row">
              <div class="cms-field">
                <label>Embed Mode</label>
                <select data-fld="embedStatus">
                  <option value="auto"  ${(!it.embedStatus||it.embedStatus==='auto') ?'selected':''}>Auto (Facebook→link, others→embed)</option>
                  <option value="link"  ${it.embedStatus==='link'                    ?'selected':''}>Link only (safe fallback)</option>
                  <option value="embed" ${it.embedStatus==='embed'                   ?'selected':''}>Force embed</option>
                </select>
              </div>
              <div class="cms-field"><label>Fallback URL (override link)</label><input type="url" data-fld="fallbackUrl" value="${esc(it.fallbackUrl||'')}" placeholder="เว้นว่างถ้าใช้ Video URL เดิม" /></div>
            </div>
            <div class="cms-field"><label>คำอธิบาย (optional)</label><input type="text" data-fld="description" value="${esc(it.description||'')}" /></div>
          </div>
          <div>${itemActions('home.voices.videos', it, idx, items.length)}</div>
        </div>
      `;
      host.appendChild(card);
      card.querySelectorAll('[data-fld]').forEach(inp => {
        inp.addEventListener('input', () => collUpdate('home.voices.videos', it.id, { [inp.dataset.fld]: inp.value }));
      });
      bindItemActions(card, 'home.voices.videos', it);
    });
  }

  // ---------- OFFERS (Curated Offerings) ----------
  function pOffers(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Curated <em>Offerings</em></h2>
      <p class="lead">โปรโมชั่นและแคมเปญที่แสดงบนหน้าหลัก</p>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Section header</div></div>
        ${txt('Kicker', 'home.offers.kicker')}
        ${area('Headline (ใช้ [bracket] สำหรับตัวเอน)', 'home.offers.title', { style: 'min-height: 70px;' })}
        ${area('Subtitle', 'home.offers.sub')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin: 18px 0 10px;">
        <h3 style="margin:0;">รายการ ${(CMS.getDraft('home.offers.items')||[]).length} โปร</h3>
        <button class="cms-btn cms-btn--primary cms-btn--sm" id="addO">${I.plus} เพิ่มโปร</button>
      </div>
      <div id="ofList"></div>
    `;
    body.appendChild(pane);
    bind(pane);
    pane.querySelector('#addO').addEventListener('click', () => {
      collAdd('home.offers.items', { image: '', title: 'New offer', sub: '', tag: 'New', price: '', was: '', ctaHref: '#booking' });
      renderTab();
    });
    const host = pane.querySelector('#ofList');
    const items = CMS.getDraft('home.offers.items') || [];
    if (!items.length) { host.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>โปร</em></h4></div>'; return; }
    items.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = 'cms-card cms-itm' + (it.visible === false ? ' is-hidden' : '');
      card.innerHTML = `
        <div class="cms-review-grid">
          <div class="cms-img-field" data-img-path="home.offers.items.${idx}.image">
            <div class="cms-img-preview aspect-square">
              ${it.image ? `<img src="${esc(it.image)}" alt="" />` : `<div class="empty">${I.image}<span>เพิ่มรูป</span></div>`}
              <div class="cms-img-overlay">
                <button data-act="upload">${I.upload}</button>
                <button data-act="library">${I.image}</button>
                ${it.image ? `<button data-act="clear" class="danger">${I.x}</button>` : ''}
              </div>
            </div>
          </div>
          <div>
            <div class="cms-field"><label>Title (ใช้ [bracket] สำหรับตัวเอน)</label><input type="text" data-fld="title" value="${esc(it.title||'')}" placeholder="[Botox] Slim Face" /></div>
            <div class="cms-field"><label>Subtitle</label><input type="text" data-fld="sub" value="${esc(it.sub||'')}" /></div>
            <div class="cms-row">
              <div class="cms-field"><label>Tag</label><input type="text" data-fld="tag" value="${esc(it.tag||'')}" placeholder="New / Best Seller" /></div>
              <div class="cms-field"><label>Price</label><input type="text" data-fld="price" value="${esc(it.price||'')}" placeholder="฿ 3,900" /></div>
            </div>
            <div class="cms-row">
              <div class="cms-field"><label>Was (ราคาเดิม)</label><input type="text" data-fld="was" value="${esc(it.was||'')}" placeholder="฿ 6,500" /></div>
              <div class="cms-field"><label>CTA link</label><input type="text" data-fld="ctaHref" value="${esc(it.ctaHref||'')}" placeholder="#booking" /></div>
            </div>
            ${itemActions('home.offers.items', it, idx, items.length)}
          </div>
        </div>
      `;
      host.appendChild(card);
      card.querySelectorAll('[data-fld]').forEach(inp => {
        inp.addEventListener('input', () => collUpdate('home.offers.items', it.id, { [inp.dataset.fld]: inp.value }));
      });
      const setImg = src => { collUpdate('home.offers.items', it.id, { image: src }); renderTab(); };
      const fld = card.querySelector('.cms-img-field');
      fld.querySelector('[data-act="upload"]')?.addEventListener('click', () => {
        const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
        f.onchange = async () => { if (f.files[0]) { const item = await CMS.media.add(f.files[0]); setImg(item.src); } };
        f.click();
      });
      fld.querySelector('[data-act="library"]')?.addEventListener('click', () => openMediaPicker(setImg));
      fld.querySelector('[data-act="clear"]')?.addEventListener('click', () => setImg(''));
      bindItemActions(card, 'home.offers.items', it);
    });
  }

  // ---------- FAQ ----------
  function pFAQ(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>FAQ <em>· Q&A</em></h2>
      <p class="lead">คำถาม-คำตอบที่พบบ่อย</p>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Section header</div></div>
        ${txt('Kicker', 'home.faq.kicker')}
        ${area('Headline (ใช้ [bracket] สำหรับตัวเอน)', 'home.faq.title', { style: 'min-height: 70px;' })}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin: 18px 0 10px;">
        <h3 style="margin:0;">คำถาม ${(CMS.getDraft('home.faq.items')||[]).length} ข้อ</h3>
        <button class="cms-btn cms-btn--primary cms-btn--sm" id="addQ">${I.plus} เพิ่มคำถาม</button>
      </div>
      <div id="fqList"></div>
    `;
    body.appendChild(pane);
    bind(pane);
    pane.querySelector('#addQ').addEventListener('click', () => {
      collAdd('home.faq.items', { q: 'คำถามใหม่?', a: '' });
      renderTab();
    });
    const host = pane.querySelector('#fqList');
    const items = CMS.getDraft('home.faq.items') || [];
    if (!items.length) { host.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>คำถาม</em></h4></div>'; return; }
    items.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = 'cms-card cms-itm' + (it.visible === false ? ' is-hidden' : '');
      card.innerHTML = `
        <div class="cms-itm-grid">
          <div style="flex:1;">
            <div class="cms-field"><label>Q · คำถาม</label><input type="text" data-fld="q" value="${esc(it.q||'')}" /></div>
            <div class="cms-field"><label>A · คำตอบ</label><textarea data-fld="a" style="min-height: 90px;">${esc(it.a||'')}</textarea></div>
          </div>
          ${itemActions('home.faq.items', it, idx, items.length)}
        </div>
      `;
      host.appendChild(card);
      card.querySelectorAll('[data-fld]').forEach(inp => {
        inp.addEventListener('input', () => collUpdate('home.faq.items', it.id, { [inp.dataset.fld]: inp.value }));
      });
      bindItemActions(card, 'home.faq.items', it);
    });
  }

  // ---------- HOME ----------
  function pHome(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Home <em>Page</em></h2>
      <p class="lead">แก้ทุกอย่างในหน้าหลัก — เห็นผลทันที กด Publish เพื่อให้ขึ้นเว็บจริง</p>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Hero · <em>หน้าแรก Split Layout</em></div></div>

        <div class="cms-row" style="align-items:center; padding: 4px 0 12px;">
          ${chk('แสดง Hero Section', 'home.hero.visible')}
        </div>

        <hr style="border:0; border-top: 1px solid rgba(20,36,42,0.08); margin: 0 0 16px;" />
        <p style="font-size:12px; color: var(--dp-ink-500, #5A7180); margin: 0 0 12px; font-family: 'Anuphan', sans-serif;">รูปภาพ · Hero</p>
        ${img('รูปหลัก · Desktop', 'home.hero.backgroundImage', { aspect: 'portrait' })}
        ${img('รูปมือถือ · Mobile (ถ้ามี)', 'home.hero.backgroundImageMobile', { aspect: 'wide' })}

        <hr style="border:0; border-top: 1px solid rgba(20,36,42,0.08); margin: 16px 0;" />
        <p style="font-size:12px; color: var(--dp-ink-500, #5A7180); margin: 0 0 12px; font-family: 'Anuphan', sans-serif;">หัวข้อหลัก · Headline Typography</p>
        ${txt('วลีหลัก · Focal word (ใหญ่ ตัวเอน)', 'home.hero.l1', { ph: 'เสน่ห์' })}
        ${txt('บรรทัด 2 · Gradient accent', 'home.hero.l2', { ph: 'ที่สร้างจากความซื่อตรง' })}
        ${txt('บรรทัด 3 · Gradient accent', 'home.hero.l3', { ph: 'และหลักการแห่งสุนทรียศิลป์' })}
        ${txt('บรรทัด 4 · Gradient accent (ไม่บังคับ)', 'home.hero.l4', { ph: '— เว้นว่างเพื่อซ่อน' })}
        ${area('คำอธิบาย · พิมพ์แต่ละบรรทัดแยกกัน Enter ได้', 'home.hero.side')}

        <hr style="border:0; border-top: 1px solid rgba(20,36,42,0.08); margin: 16px 0;" />
        <p style="font-size:12px; color: var(--dp-ink-500, #5A7180); margin: 0 0 12px; font-family: 'Anuphan', sans-serif;">ปุ่มเรียกร้อง · CTA Buttons</p>
        <div class="cms-row">
          ${txt('ปุ่มหลัก · ข้อความ', 'home.hero.ctaPrimary')}
          ${txt('ปุ่มหลัก · ลิงก์', 'home.hero.ctaPrimaryHref')}
        </div>
        <div class="cms-row">
          ${txt('ปุ่ม Facebook · ข้อความ', 'home.hero.ctaSecondary')}
          ${txt('ปุ่ม Facebook · ลิงก์', 'home.hero.ctaSecondaryHref')}
        </div>
        ${chk('แสดงปุ่ม Facebook', 'home.hero.showFacebook')}

        <hr style="border:0; border-top: 1px solid rgba(20,36,42,0.08); margin: 16px 0;" />
        <p style="font-size:12px; color: var(--dp-ink-500, #5A7180); margin: 0 0 12px; font-family: 'Anuphan', sans-serif;">สถิติ · Floating Stat Card</p>
        <div class="cms-row">
          ${txt('ตัวเลข', 'home.hero.statValue', { ph: '12+' })}
          ${txt('ป้ายกำกับ', 'home.hero.statLabel', { ph: 'YEARS OF ARTISTRY' })}
        </div>
      </div>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Quick contact</div></div>
        <div class="cms-row">
          ${txt('Phone', 'home.contact.phone', { type: 'tel' })}
          ${txt('Facebook URL', 'home.contact.facebook', { type: 'url' })}
        </div>
        <div class="cms-row">
          ${txt('LINE URL', 'home.contact.line', { type: 'url' })}
          ${txt('Instagram', 'home.contact.instagram', { type: 'url' })}
        </div>
      </div>

      ${openPageBtn('DermaPride Clinics.html', 'เปิดหน้าจริง')}
    `;
    body.appendChild(pane);
    bind(pane);
    bindImageFields(pane);
  }

  // ---------- DOCTOR ----------
  function pDoctor(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>The <em>Doctor</em></h2>
      <p class="lead">โปรไฟล์ของแพทย์ผู้ดูแล — แก้ได้ทุกอย่างพร้อมรูป</p>

      <div class="cms-doctor-grid">
        <div>
          ${img('รูปแพทย์ · Portrait', 'home.doctor.image', { aspect: 'portrait' })}
        </div>
        <div>
          <div class="cms-card">
            ${txt('Title / Role', 'home.doctor.role', { ph: 'Founder · Aesthetic Physician' })}
            ${txt('Name (English)', 'home.doctor.name')}
            ${txt('Name (ไทย)', 'home.doctor.nameTh')}
            ${txt('License No.', 'home.doctor.license', { ph: 'ว.26433' })}
            ${txt('Verification URL', 'home.doctor.verificationUrl', { type: 'url', ph: 'https://...' })}
          </div>
          <div class="cms-card">
            <div class="cms-card-head"><div class="t">Quote & Bio</div></div>
            ${area('Quote', 'home.doctor.quote', { style: 'min-height: 70px;' })}
            ${area('Bio', 'home.doctor.bio', { style: 'min-height: 110px;' })}
          </div>
          <div class="cms-card">
            <div class="cms-card-head"><div class="t">Qualifications</div></div>
            ${txt('Specialization', 'home.doctor.specialization')}
            ${txt('Certifications', 'home.doctor.certifications')}
            ${txt('Experience', 'home.doctor.experience', { ph: '12+ years · 50,000+ cases' })}
          </div>
        </div>
      </div>
    `;
    body.appendChild(pane);
    bind(pane);
    bindImageFields(pane);

    // ── Artistry Gallery card (collection) ────────────────────────────────────
    const galCard = document.createElement('div');
    galCard.innerHTML = `
      <div class="cms-card" style="margin-top: 24px;">
        <div class="cms-card-head"><div class="t">Artistry Gallery · <em>แกลเลอรีใต้โปรไฟล์</em></div></div>
        <div class="cms-row" style="align-items:center; padding: 4px 0 12px;">
          ${chk('แสดง Artistry Gallery', 'home.doctorGallery.visible')}
          ${chk('Autoplay', 'home.doctorGallery.autoplay')}
        </div>
        <hr style="border:none; border-top:1px solid var(--c-bdr); margin: 0 0 14px;" />
        <div class="cms-row">
          ${txt('Gallery Title', 'home.doctorGallery.title', { ph: 'Artistry · in Practice' })}
          ${txt('Gallery Subtitle', 'home.doctorGallery.sub', { ph: 'บรรยากาศ · ปรัชญา · อัตลักษณ์' })}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin: 14px 0 10px;">
          <h3 style="margin:0; font-size:14px;">ภาพ ${(CMS.getDraft('home.doctorGallery.items')||[]).length} รูป</h3>
          <button class="cms-btn cms-btn--primary cms-btn--sm" id="addGal">${I.plus} เพิ่มรูป</button>
        </div>
        <div id="galList"></div>
      </div>
    `;
    pane.appendChild(galCard);
    bind(galCard);

    galCard.querySelector('#addGal').addEventListener('click', () => {
      collAdd('home.doctorGallery.items', { image: '', caption: '', quote: '', alt: '', visible: true });
      renderTab();
    });

    const galHost = galCard.querySelector('#galList');
    const galItems = CMS.getDraft('home.doctorGallery.items') || [];
    if (!galItems.length) {
      galHost.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>ภาพ</em></h4><p>คลิก "เพิ่มรูป" เพื่อเริ่มต้น</p></div>';
    } else {
      galItems.forEach((it, idx) => {
        const card = document.createElement('div');
        card.className = 'cms-card cms-itm' + (it.visible === false ? ' is-hidden' : '');
        card.style.cssText = 'margin-bottom:12px;';
        card.innerHTML = `
          <div class="cms-review-grid">
            <div class="cms-img-field" data-img-path="home.doctorGallery.items.${idx}.image">
              <div class="cms-img-preview aspect-portrait">
                ${it.image ? `<img src="${esc(it.image)}" alt="" />` : `<div class="empty">${I.image}<span>เพิ่มรูป</span></div>`}
                <div class="cms-img-overlay">
                  <button data-act="upload">${I.upload}</button>
                  <button data-act="library">${I.image}</button>
                  ${it.image ? `<button data-act="clear" class="danger">${I.x}</button>` : ''}
                </div>
              </div>
            </div>
            <div>
              <div class="cms-field"><label>Caption · คำบรรยาย</label><input type="text" data-fld="caption" value="${esc(it.caption||'')}" placeholder="ความซื่อตรงคือรากฐาน" /></div>
              <div class="cms-field"><label>Quote (ไม่บังคับ)</label><input type="text" data-fld="quote" value="${esc(it.quote||'')}" placeholder="วลีสั้น · italic" /></div>
              <div class="cms-field"><label>Alt text</label><input type="text" data-fld="alt" value="${esc(it.alt||'')}" placeholder="คำอธิบายรูปสำหรับ SEO" /></div>
              ${itemActions('home.doctorGallery.items', it, idx, galItems.length)}
            </div>
          </div>
        `;
        galHost.appendChild(card);
        card.querySelectorAll('[data-fld]').forEach(inp => {
          inp.addEventListener('input', () => collUpdate('home.doctorGallery.items', it.id, { [inp.dataset.fld]: inp.value }));
        });
        const setImg = src => { collUpdate('home.doctorGallery.items', it.id, { image: src }); renderTab(); };
        const fld = card.querySelector('.cms-img-field');
        fld.querySelector('[data-act="upload"]')?.addEventListener('click', () => {
          const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
          f.onchange = async () => { if (f.files[0]) { const item = await CMS.media.add(f.files[0]); setImg(item.src); } };
          f.click();
        });
        fld.querySelector('[data-act="library"]')?.addEventListener('click', () => openMediaPicker(setImg));
        fld.querySelector('[data-act="clear"]')?.addEventListener('click', () => setImg(''));
        bindItemActions(card, 'home.doctorGallery.items', it);
      });
    }
  }

  // ---------- REVIEWS ----------
  function pReviews(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Customer <em>Reviews</em></h2>
      <p class="lead">รีวิวจริงจากลูกค้า — เพิ่ม แก้ ลบ จัดเรียงได้ทันที</p>
      <button class="cms-btn cms-btn--primary" id="addR" style="margin-bottom: 18px;">${I.plus} เพิ่มรีวิว</button>
      <div id="rL"></div>
    `;
    body.appendChild(pane);
    pane.querySelector('#addR').addEventListener('click', () => {
      CMS.reviews.add({ name: 'ลูกค้าใหม่', body: '', treatment: '', stars: 5 });
      renderTab();
    });
    const host = pane.querySelector('#rL');
    const reviews = CMS.reviews.list();
    if (reviews.length === 0) {
      host.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>รีวิว</em></h4><p>คลิก "เพิ่มรีวิว" เพื่อเริ่มต้น</p></div>';
      return;
    }
    reviews.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = 'cms-card cms-review-card';
      card.innerHTML = `
        <div class="cms-review-grid">
          <div class="cms-img-field" data-img-path="reviews.items.${idx}.image">
            <div class="cms-img-preview aspect-square">
              ${r.image ? `<img src="${esc(r.image)}" alt="" />` : `<div class="empty">${I.image}<span>เพิ่มรูป</span></div>`}
              <div class="cms-img-overlay">
                <button data-act="upload">${I.upload}</button>
                <button data-act="library">${I.image}</button>
                ${r.image ? `<button data-act="clear" class="danger">${I.x}</button>` : ''}
              </div>
            </div>
          </div>
          <div>
            <div class="cms-row">
              <div class="cms-field"><label>ชื่อ</label><input type="text" id="n_${r.id}" value="${esc(r.name)}" /></div>
              <div class="cms-field"><label>อายุ</label><input type="text" id="g_${r.id}" value="${esc(r.age||'')}" placeholder="32 ปี" /></div>
            </div>
            <div class="cms-row">
              <div class="cms-field"><label>หัตถการ</label><input type="text" id="t_${r.id}" value="${esc(r.treatment)}" /></div>
              <div class="cms-field"><label>ดาว (1–5)</label><input type="number" min="1" max="5" id="s_${r.id}" value="${r.stars||5}" /></div>
            </div>
            <div class="cms-field"><label>ข้อความรีวิว</label><textarea id="b_${r.id}" style="min-height: 90px;">${esc(r.body)}</textarea></div>
            <div style="display:flex; gap: 8px;">
              <button class="cms-btn cms-btn--sm" data-mv="up" ${idx===0?'disabled':''}>${I.up}</button>
              <button class="cms-btn cms-btn--sm" data-mv="down" ${idx===reviews.length-1?'disabled':''}>${I.dn}</button>
              <button class="cms-btn cms-btn--sm cms-btn--danger" data-del>${I.trash} ลบ</button>
            </div>
          </div>
        </div>
      `;
      host.appendChild(card);
      card.querySelector(`#n_${r.id}`).addEventListener('input', e => CMS.reviews.update(r.id, { name: e.target.value }));
      card.querySelector(`#g_${r.id}`).addEventListener('input', e => CMS.reviews.update(r.id, { age: e.target.value }));
      card.querySelector(`#t_${r.id}`).addEventListener('input', e => CMS.reviews.update(r.id, { treatment: e.target.value }));
      card.querySelector(`#s_${r.id}`).addEventListener('input', e => CMS.reviews.update(r.id, { stars: Number(e.target.value)||5 }));
      card.querySelector(`#b_${r.id}`).addEventListener('input', e => CMS.reviews.update(r.id, { body: e.target.value }));
      card.querySelector('[data-del]').addEventListener('click', () => {
        if (confirm('ลบรีวิวนี้?')) { CMS.reviews.remove(r.id); renderTab(); }
      });
      card.querySelectorAll('[data-mv]').forEach(b => {
        b.addEventListener('click', () => { moveReview(r.id, b.dataset.mv); renderTab(); });
      });

      // image actions
      const field = card.querySelector('.cms-img-field');
      const setImg = src => { CMS.reviews.update(r.id, { image: src }); renderTab(); };
      field.querySelector('[data-act="upload"]')?.addEventListener('click', () => {
        const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
        f.onchange = async () => { if (f.files[0]) { const it = await CMS.media.add(f.files[0]); setImg(it.src); } };
        f.click();
      });
      field.querySelector('[data-act="library"]')?.addEventListener('click', () => openMediaPicker(setImg));
      field.querySelector('[data-act="clear"]')?.addEventListener('click', () => setImg(''));
    });
  }

  function moveReview(id, dir) {
    const items = CMS.getDraft('reviews.items').slice();
    const i = items.findIndex(x => x.id === id);
    const j = i + (dir === 'up' ? -1 : 1);
    if (j < 0 || j >= items.length) return;
    [items[i], items[j]] = [items[j], items[i]];
    CMS.set('reviews.items', items);
  }

  // ---------- PROCEDURES ----------
  function pProcedures(body) {
    if (activeProc) return pProcEditor(body, activeProc);
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: end; gap: 16px; flex-wrap: wrap; margin-bottom: 8px;">
        <div>
          <h2>Procedure <em>Categories</em></h2>
          <p class="lead" style="margin-bottom: 0;">การ์ดที่แสดงในหน้า Home — แก้รูป ชื่อ slug ลำดับ และเปิด/ปิดได้ทันที</p>
        </div>
        <button class="cms-btn cms-btn--primary" id="addCat">${I.plus} เพิ่มหมวดใหม่</button>
      </div>
      <div id="catList" class="cms-cat-list"></div>
    `;
    body.appendChild(pane);
    pane.querySelector('#addCat').addEventListener('click', () => {
      const name = prompt('ชื่อหมวดใหม่:', 'New Category');
      if (!name) return;
      const slug = CMS.procedures.add(name);
      activeProc = slug; renderTab();
    });
    renderCatList(pane.querySelector('#catList'));
  }

  function renderCatList(host) {
    host.innerHTML = '';
    const items = CMS.procedures.list();
    if (items.length === 0) {
      host.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>หมวด</em></h4><p>กด "เพิ่มหมวดใหม่" เพื่อเริ่มต้น</p></div>';
      return;
    }
    items.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'cms-cat-card' + (p.visible === false ? ' is-hidden' : '');
      card.innerHTML = `
        <div class="cms-cat-thumb cms-img-field" data-img-path="procedures.${p.slug}.image">
          <div class="cms-img-preview aspect-square">
            ${p.image ? `<img src="${esc(p.image)}" alt="" />` : `<div class="empty">${I.image}<span>เพิ่มรูป</span></div>`}
            <div class="cms-img-overlay">
              <button data-act="upload">${I.upload}</button>
              <button data-act="library">${I.image}</button>
              ${p.image ? `<button data-act="clear" class="danger">${I.x}</button>` : ''}
            </div>
          </div>
        </div>
        <div class="cms-cat-info">
          <div class="cms-cat-row">
            <input type="text" class="cms-cat-name" data-fld="name" value="${esc(p.name)}" placeholder="Display name" />
            <input type="text" class="cms-cat-name-th" data-fld="nameTh" value="${esc(p.nameTh||'')}" placeholder="ภาษาไทย" />
          </div>
          <input type="text" class="cms-cat-desc" data-fld="description" value="${esc(p.description||'')}" placeholder="คำอธิบายสั้น ๆ บนการ์ด" />
          <div class="cms-cat-meta">
            <label>
              <span>URL slug</span>
              <input type="text" class="cms-cat-slug" value="${esc(p.slug)}" />
            </label>
            <label>
              <span>CTA text</span>
              <input type="text" class="cms-cat-cta" data-fld="ctaText" value="${esc(p.ctaText||'')}" placeholder="ดูรายละเอียด" />
            </label>
            <div class="cms-cat-stat">${p.sections.length} <span>sections</span></div>
          </div>
        </div>
        <div class="cms-cat-actions">
          <button data-act="edit" class="cms-btn cms-btn--sm cms-btn--primary">Edit page →</button>
          <button data-act="vis" title="${p.visible === false ? 'แสดง' : 'ซ่อน'}">${p.visible === false ? I.eyeOff : I.eye}</button>
          <button data-act="up" title="ขึ้น" ${idx===0?'disabled':''}>${I.up}</button>
          <button data-act="down" title="ลง" ${idx===items.length-1?'disabled':''}>${I.dn}</button>
          <button data-act="dup" title="Duplicate">${I.copy}</button>
          <button data-act="del" title="ลบ" class="danger">${I.trash}</button>
        </div>
      `;
      host.appendChild(card);

      // Wire image field
      bindImageFields(card);

      // Wire text inputs
      card.querySelectorAll('[data-fld]').forEach(inp => {
        inp.addEventListener('input', () => {
          CMS.procedures.update(p.slug, { [inp.dataset.fld]: inp.value });
        });
      });

      // Slug change (commit on blur)
      const slugInp = card.querySelector('.cms-cat-slug');
      slugInp.addEventListener('blur', () => {
        const newSlug = CMS.procedures.changeSlug(p.slug, slugInp.value);
        if (newSlug !== slugInp.value) slugInp.value = newSlug;
        if (newSlug !== p.slug) renderTab();
      });

      // Actions
      card.querySelectorAll('.cms-cat-actions button').forEach(b => {
        b.addEventListener('click', () => {
          const a = b.dataset.act;
          if (a === 'edit') { activeProc = p.slug; renderTab(); return; }
          if (a === 'vis')  { CMS.procedures.update(p.slug, { visible: !(p.visible !== false) }); renderTab(); return; }
          if (a === 'up' || a === 'down') { CMS.procedures.move(p.slug, a); renderTab(); return; }
          if (a === 'dup') { CMS.procedures.duplicate(p.slug); renderTab(); return; }
          if (a === 'del') {
            if (confirm(`ลบหมวด "${p.name}"? เนื้อหา section ทั้งหมดของหมวดนี้จะหายไปด้วย`)) {
              CMS.procedures.remove(p.slug); renderTab();
            }
          }
        });
      });
    });
  }

  function pProcEditor(body, slug) {
    const proc = CMS.procedures.get(slug);
    if (!proc) { activeProc = null; return renderTab(); }
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom: 14px;">
        <button class="cms-btn cms-btn--sm" id="back">← All categories</button>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(20,36,42,0.55);">CATEGORY · ${esc(slug)}</div>
      </div>
      <h2>${esc(proc.name)} <em>· ${esc(proc.nameTh || '')}</em></h2>
      <p class="lead">แก้รายละเอียดหน้าและ section ทั้งหมด — เห็นผลทันที</p>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Home card · <em>การ์ดบนหน้าหลัก</em></div></div>
        ${img('Thumbnail image', `procedures.${slug}.image`, { aspect: 'square' })}
        ${txt('Description (บนการ์ด)', `procedures.${slug}.description`)}
        ${txt('CTA text', `procedures.${slug}.ctaText`)}
      </div>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Page header</div></div>
        ${txt('Display name', `procedures.${slug}.name`)}
        ${txt('Display name (ไทย)', `procedures.${slug}.nameTh`)}
        ${txt('Eyebrow', `procedures.${slug}.kicker`)}
        ${txt('Page headline', `procedures.${slug}.headline`)}
        ${area('Page subtitle', `procedures.${slug}.sub`)}
        ${img('Page hero image', `procedures.${slug}.heroImage`, { aspect: 'portrait' })}
      </div>

      <div class="cms-card">
        <div class="cms-card-head"><div class="t">SEO &amp; URL</div></div>
        ${txt('URL slug', `procedures.${slug}.seo.slug`)}
        ${txt('SEO Title', `procedures.${slug}.seo.title`)}
        ${area('SEO Description', `procedures.${slug}.seo.description`)}
      </div>

      <h3 style="margin-top: 28px;">Content sections (${proc.sections.length})</h3>
      <div class="cms-section-list" id="secL"></div>

      <div class="cms-add-section">
        <div class="label">+ Add a section</div>
        <button data-add="image-text"><span class="t">Image + Text</span><span class="d">หนึ่งภาพ + เนื้อหา</span></button>
        <button data-add="slider"><span class="t">Image Slider</span><span class="d">สไลด์รูปหลายภาพ</span></button>
        <button data-add="reviews"><span class="t">Reviews</span><span class="d">รีวิวลูกค้า</span></button>
        <button data-add="before-after"><span class="t">Before / After</span><span class="d">เปรียบเทียบผลลัพธ์</span></button>
        <button data-add="pricing"><span class="t">Pricing</span><span class="d">รายการราคา</span></button>
        <button data-add="cta"><span class="t">CTA Block</span><span class="d">เรียกให้ติดต่อ</span></button>
      </div>

      <div style="margin-top: 16px;">${openPageBtn(`procedure.html?cat=${slug}`, 'เปิดหน้านี้')}</div>
    `;
    body.appendChild(pane);
    bind(pane);
    bindImageFields(pane);
    pane.querySelector('#back').addEventListener('click', () => { activeProc = null; renderTab(); });
    renderSectionList(pane.querySelector('#secL'), slug);
    pane.querySelectorAll('[data-add]').forEach(b => {
      b.addEventListener('click', () => { CMS.sections.add(slug, b.dataset.add); renderTab(); });
    });
  }

  function renderSectionList(host, slug) {
    const sections = CMS.sections.list(slug);
    host.innerHTML = '';
    if (sections.length === 0) {
      host.innerHTML = '<div class="cms-empty"><h4>ยังไม่มี <em>section</em></h4><p>เริ่มต้นด้วยการคลิก section ใดๆ ด้านล่างเพื่อเพิ่มเนื้อหา</p></div>';
      return;
    }
    sections.forEach((sec, idx) => {
      const item = document.createElement('div');
      item.className = 'cms-section-item' + (sec.visible === false ? ' is-hidden' : '');
      item.innerHTML = `
        <div class="cms-section-head">
          <div class="grip">${I.grip}</div>
          <div class="info">
            <div class="ix">${String(idx+1).padStart(2,'0')} · ${sec.type}</div>
            <div class="nm">${sec.title ? esc(sec.title) : '<em>Untitled section</em>'}</div>
          </div>
          <div class="actions">
            <button data-act="vis">${sec.visible === false ? I.eyeOff : I.eye}</button>
            <button data-act="up" ${idx===0?'disabled':''}>${I.up}</button>
            <button data-act="down" ${idx===sections.length-1?'disabled':''}>${I.dn}</button>
            <button data-act="dup">${I.copy}</button>
            <button data-act="del" class="danger">${I.trash}</button>
            <span class="chev">${I.dn}</span>
          </div>
        </div>
        <div class="cms-section-body"></div>
      `;
      host.appendChild(item);
      const head = item.querySelector('.cms-section-head');
      const body = item.querySelector('.cms-section-body');
      head.addEventListener('click', e => {
        if (e.target.closest('.actions')) return;
        item.classList.toggle('is-open');
        if (item.classList.contains('is-open') && !body.childElementCount) renderSectionForm(body, slug, sec);
      });
      head.querySelectorAll('button').forEach(b => {
        b.addEventListener('click', e => {
          e.stopPropagation();
          const a = b.dataset.act;
          if (a === 'up' || a === 'down') CMS.sections.move(slug, sec.id, a);
          if (a === 'dup') CMS.sections.duplicate(slug, sec.id);
          if (a === 'del' && confirm('ลบ section นี้?')) CMS.sections.remove(slug, sec.id);
          if (a === 'vis') CMS.sections.update(slug, sec.id, { visible: !(sec.visible !== false) });
          renderTab();
        });
      });
    });
  }

  function renderSectionForm(host, slug, sec) {
    const upd = (p) => CMS.sections.update(slug, sec.id, p);
    const tagline = sec.type === 'before-after' ? '(2 รูป: before + after)'
                  : sec.type === 'slider' ? '(เพิ่มได้ไม่จำกัด)' : '';

    host.innerHTML = `
      <div class="cms-field"><label>Title</label><input type="text" id="t" value="${esc(sec.title)}" placeholder="ใส่หัวข้อ — ใช้ [วงเล็บก้ามปู] เพื่อทำตัวเอน" /></div>
      <div class="cms-field"><label>Subtitle / eyebrow</label><input type="text" id="s" value="${esc(sec.subtitle)}" /></div>
      <div class="cms-field"><label>Body</label><textarea id="b" style="min-height: 100px;">${esc(sec.body)}</textarea></div>
      ${(['pricing','image-text','slider','cta'].includes(sec.type)) ? `<div class="cms-field"><label>Price / highlight</label><input type="text" id="p" value="${esc(sec.price)}" placeholder="เริ่ม ฿ 3,900" /></div>` : ''}
      ${(['image-text','slider','cta'].includes(sec.type)) ? `<div class="cms-field"><label>Tags (คั่นด้วย comma)</label><input type="text" id="tg" value="${esc(sec.tags)}" placeholder="Allergan, Slim Face" /></div>` : ''}
      <label style="font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(20,36,42,0.6); margin-top:8px; display:block;">รูป ${tagline}</label>
      <div class="cms-section-images" id="ims"></div>
    `;
    host.querySelector('#t').addEventListener('input', e => upd({ title: e.target.value }));
    host.querySelector('#s').addEventListener('input', e => upd({ subtitle: e.target.value }));
    host.querySelector('#b').addEventListener('input', e => upd({ body: e.target.value }));
    const pi = host.querySelector('#p'); if (pi) pi.addEventListener('input', e => upd({ price: e.target.value }));
    const ti = host.querySelector('#tg'); if (ti) ti.addEventListener('input', e => upd({ tags: e.target.value }));
    renderSectionImages(host.querySelector('#ims'), slug, sec);
  }

  function renderSectionImages(host, slug, sec) {
    host.innerHTML = '';
    const images = sec.images || [];
    images.forEach((im, idx) => {
      const d = document.createElement('div');
      d.className = 'cms-section-image';
      d.innerHTML = `<img src="${esc(im.src)}" alt="" /><button class="x">${I.x}</button>`;
      d.querySelector('.x').addEventListener('click', e => {
        e.stopPropagation();
        CMS.sections.update(slug, sec.id, { images: images.filter((_, i) => i !== idx) });
        renderTab();
      });
      d.addEventListener('click', () => openMediaPicker(picked => {
        const next = images.map((it, i) => i === idx ? { ...it, src: picked } : it);
        CMS.sections.update(slug, sec.id, { images: next });
        renderTab();
      }));
      host.appendChild(d);
    });
    const add = document.createElement('button');
    add.className = 'cms-section-add-image';
    add.innerHTML = '+';
    add.addEventListener('click', () => openMediaPicker(picked => {
      CMS.sections.update(slug, sec.id, { images: (sec.images || []).concat([{ id: 'i_'+Date.now().toString(36), src: picked }]) });
      renderTab();
    }));
    host.appendChild(add);
  }

  // ---------- BRANCHES ----------
  function pBranches(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Branches & <em>Contact</em></h2>
      <p class="lead">ข้อมูลสาขา รูป แผนที่ และช่องทางติดต่อ</p>
    `;
    body.appendChild(pane);

    // Chapter 11 section header
    const hdrCard = document.createElement('div');
    hdrCard.className = 'cms-card';
    hdrCard.innerHTML = `
      <div class="cms-card-head"><div class="t">Section header · Chapter 11</div></div>
      ${txt('Chapter kicker', 'home.chapter11.kicker', { ph: 'Chapter 11 · Where to find us' })}
      <div class="cms-row">
        ${txt('Title (plain)', 'home.chapter11.title',   { ph: 'สองสาขา.' })}
        ${txt('Title (em / styled)', 'home.chapter11.titleEm', { ph: 'มาตรฐานเดียว.' })}
      </div>
      ${area('Subtitle paragraph', 'home.chapter11.sub')}
    `;
    pane.appendChild(hdrCard);

    const branches = CMS.getDraft('home.branches') || [];
    branches.forEach((b, i) => {
      const card = document.createElement('div');
      card.className = 'cms-card';
      card.innerHTML = `
        <div class="cms-card-head"><div class="t">Branch ${i+1} · <em>${esc(b.name||'')}</em></div></div>
        <div class="cms-branch-images">
          ${img('Image 1 (large)', `home.branches.${i}.image1`, { aspect: 'square' })}
          ${img('Image 2', `home.branches.${i}.image2`, { aspect: 'square' })}
          ${img('Image 3', `home.branches.${i}.image3`, { aspect: 'square' })}
        </div>
        ${txt('Branch tag', `home.branches.${i}.tag`, { ph: 'Branch 01 · Name' })}
        ${txt('Name', `home.branches.${i}.name`)}
        ${area('Address', `home.branches.${i}.address`)}
        <div class="cms-row">
          ${txt('Phone', `home.branches.${i}.phone`)}
          ${txt('License No.', `home.branches.${i}.license`)}
        </div>
        <div class="cms-row">
          ${txt('Info row 1 label', `home.branches.${i}.infoRow1Key`, { ph: 'Parking' })}
          ${txt('Info row 1 value', `home.branches.${i}.infoRow1Val`, { ph: 'ฟรี · จอดสะดวก' })}
        </div>
        <div class="cms-row">
          ${txt('Info row 2 label', `home.branches.${i}.infoRow2Key`, { ph: 'Access' })}
          ${txt('Info row 2 value', `home.branches.${i}.infoRow2Val`, { ph: 'ใกล้ทางด่วน' })}
        </div>
        ${txt('Google Maps URL', `home.branches.${i}.mapUrl`, { ph: 'https://...' })}
        ${txt('Map embed URL', `home.branches.${i}.mapEmbed`, { ph: 'https://www.google.com/maps?q=...&output=embed' })}
      `;
      pane.appendChild(card);
    });

    const contact = document.createElement('div');
    contact.className = 'cms-card';
    contact.innerHTML = `
      <div class="cms-card-head"><div class="t">Global contact &amp; socials</div></div>
      <div class="cms-row">
        ${txt('Phone', 'home.contact.phone', { type: 'tel' })}
        ${txt('Facebook URL', 'home.contact.facebook', { type: 'url' })}
      </div>
      <div class="cms-row">
        ${txt('LINE URL', 'home.contact.line', { type: 'url' })}
        ${txt('Instagram', 'home.contact.instagram', { type: 'url' })}
      </div>
      ${txt('TikTok', 'home.contact.tiktok', { type: 'url' })}
    `;
    pane.appendChild(contact);

    bind(pane);
    bindImageFields(pane);
  }

  // ---------- HOURS ----------
  function pHours(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Opening <em>Hours</em></h2>
      <p class="lead">ตารางเปิดบริการ — ติ๊กปิดในวันหยุด หรือใส่เวลาเปิด/ปิด</p>
      <div class="cms-card">
        <div class="cms-hours-grid">
          <div class="head">วัน</div>
          <div class="head">ภาษาไทย</div>
          <div class="head">เปิด</div>
          <div class="head">ปิด</div>
          <div class="head">หยุด</div>
        </div>
        <div id="hL"></div>
      </div>
    `;
    body.appendChild(pane);
    const list = pane.querySelector('#hL');
    const hours = CMS.getDraft('home.hours') || [];
    hours.forEach((h, i) => {
      const row = document.createElement('div');
      row.className = 'cms-hours-grid cms-hours-row' + (h.closed ? ' is-closed' : '');
      row.innerHTML = `
        <input type="text" data-bind="home.hours.${i}.day" value="${esc(h.day)}" />
        <input type="text" data-bind="home.hours.${i}.th" value="${esc(h.th)}" />
        <input type="time" data-bind="home.hours.${i}.open" value="${esc(h.open)}" ${h.closed?'disabled':''} />
        <input type="time" data-bind="home.hours.${i}.close" value="${esc(h.close)}" ${h.closed?'disabled':''} />
        <label class="cms-cb"><input type="checkbox" data-bind="home.hours.${i}.closed" ${h.closed?'checked':''} /> <span>ปิด</span></label>
      `;
      list.appendChild(row);
    });
    bind(pane, () => {
      // re-disable open/close fields when checkbox toggles
      pane.querySelectorAll('.cms-hours-row').forEach((r, i) => {
        const closed = !!CMS.getDraft(`home.hours.${i}.closed`);
        r.classList.toggle('is-closed', closed);
        r.querySelectorAll('input[type=time]').forEach(inp => inp.disabled = closed);
      });
    });
  }

  // ---------- MEDIA ----------
  function pMedia(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Media <em>Library</em></h2>
      <p class="lead">ไฟล์ที่อัปโหลดที่นี่จะถูกเลือกใช้ในส่วนต่าง ๆ ได้ภายหลัง — ปกติแล้วการแก้รูปใน section อื่น ๆ ไม่จำเป็นต้องมาที่นี่</p>
      <div class="cms-uploader" id="up">
        <div class="ic">${I.upload}</div>
        <div>ลากไฟล์มาวางหรือ <strong style="color:#1A968F">คลิกเพื่อเลือกไฟล์</strong></div>
        <div style="font-size:11px; opacity:0.6; margin-top:6px;">รองรับ JPG · PNG · WebP · MP4 (≤ 8MB)</div>
        <input type="file" id="upI" hidden accept="image/*,video/*" multiple />
      </div>
      <div class="cms-media-grid" id="mG"></div>
    `;
    body.appendChild(pane);
    const up = pane.querySelector('#up'), inp = pane.querySelector('#upI');
    up.addEventListener('click', () => inp.click());
    inp.addEventListener('change', e => handle(e.target.files));
    ['dragenter','dragover'].forEach(ev => up.addEventListener(ev, e => { e.preventDefault(); up.classList.add('is-drag'); }));
    ['dragleave','drop'].forEach(ev => up.addEventListener(ev, e => { e.preventDefault(); up.classList.remove('is-drag'); }));
    up.addEventListener('drop', e => handle(e.dataTransfer.files));
    async function handle(files) {
      for (const f of files) {
        if (f.size > 8 * 1024 * 1024) { toast(`${f.name} too large (max 8MB)`); continue; }
        await CMS.media.add(f);
      }
      renderTab();
    }
    const grid = pane.querySelector('#mG');
    const items = CMS.media.list();
    if (items.length === 0) {
      grid.innerHTML = '<div class="cms-empty" style="grid-column: 1/-1;"><h4>ยังไม่มี <em>media</em></h4><p>ลากไฟล์มาวางด้านบนเพื่อเริ่มอัปโหลด</p></div>';
      return;
    }
    items.forEach(m => {
      const d = document.createElement('div');
      d.className = 'cms-media-item';
      const isVid = (m.type || '').startsWith('video/');
      d.innerHTML = `${isVid ? `<video src="${m.src}" muted></video>` : `<img src="${m.src}" alt="" />`}<button class="del">${I.x}</button><div class="meta">${esc(m.name)}</div>`;
      d.querySelector('.del').addEventListener('click', e => {
        e.stopPropagation();
        if (confirm('ลบไฟล์นี้?')) { CMS.media.remove(m.id); renderTab(); }
      });
      grid.appendChild(d);
    });
  }

  // ---------- THEME ----------
  function pTheme(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Theme <em>& Design</em></h2>
      <p class="lead">สีและขนาดหลักของเว็บ — เห็นผลทันที</p>
      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Colors</div></div>
        <div class="cms-field"><label>Primary (teal)</label>${color('theme.primary')}</div>
        <div class="cms-field"><label>Secondary (blush)</label>${color('theme.secondary')}</div>
        <div class="cms-field"><label>Ink (text)</label>${color('theme.ink')}</div>
        <div class="cms-field"><label>Paper (background)</label>${color('theme.paper')}</div>
      </div>
      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Scale</div></div>
        ${txt('Font scale (0.9–1.2)', 'theme.fontScale', { type: 'number' })}
        ${txt('Radius scale (0.5–2)', 'theme.radiusScale', { type: 'number' })}
      </div>
    `;
    body.appendChild(pane);
    bind(pane);
    pane.querySelectorAll('input[type=color]').forEach(el => {
      el.addEventListener('input', () => {
        CMS.set(el.dataset.bind, el.value);
        el.nextElementSibling.textContent = el.value;
      });
    });
  }
  function color(path) {
    const v = CMS.getDraft(path) || '#1A968F';
    return `<div class="cms-color"><input type="color" data-bind="${path}" value="${esc(v)}" /><span class="val">${esc(v)}</span></div>`;
  }

  // ---------- SEO ----------
  function pSEO(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>SEO <em>Metadata</em></h2>
      <p class="lead">สำหรับ Google และ social sharing</p>
      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Home page</div></div>
        ${txt('Title', 'seo.home.title')}
        ${area('Description', 'seo.home.description')}
        ${img('OG Image (1200×630)', 'seo.home.ogImage', { aspect: 'wide' })}
      </div>
    `;
    body.appendChild(pane);
    bind(pane);
    bindImageFields(pane);
  }

  // ---------- BACKUP ----------
  function pBackup(body) {
    const pane = document.createElement('div');
    pane.className = 'cms-pane';
    pane.innerHTML = `
      <h2>Backup <em>& Restore</em></h2>
      <p class="lead">ส่งออก/นำเข้าทั้งหมด หรือรีเซ็ตเป็นค่าเริ่มต้น</p>
      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Export</div></div>
        <p style="font-family:'Anuphan'; font-size:13px; color: rgba(20,36,42,0.6); margin: 0 0 14px;">ดาวน์โหลดไฟล์ JSON ของเนื้อหาทั้งหมด</p>
        <button class="cms-btn cms-btn--primary" id="exp">${I.download} Export JSON</button>
      </div>
      <div class="cms-card">
        <div class="cms-card-head"><div class="t">Import</div></div>
        <textarea id="imp" style="width:100%; min-height:120px; padding:10px; border:1px solid rgba(20,36,42,0.14); border-radius:8px; font-family:'JetBrains Mono', monospace; font-size:12px;" placeholder="วาง JSON ที่เคย export ไว้..."></textarea>
        <div style="margin-top:10px;"><button class="cms-btn cms-btn--primary" id="impBtn">${I.upload} Import</button></div>
      </div>
      <div class="cms-card" style="border-color: rgba(183,64,42,0.2);">
        <div class="cms-card-head"><div class="t" style="color:#B7402A;">Reset</div></div>
        <p style="font-family:'Anuphan'; font-size:13px; color: rgba(20,36,42,0.6); margin: 0 0 14px;">ลบเนื้อหาทั้งหมด — กลับไปใช้ค่าเริ่มต้น</p>
        <button class="cms-btn cms-btn--danger" id="rst">${I.trash} Reset everything</button>
      </div>
    `;
    body.appendChild(pane);
    pane.querySelector('#exp').addEventListener('click', () => {
      const blob = new Blob([CMS.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `dermapride-cms-${new Date().toISOString().slice(0,10)}.json`;
      a.click(); URL.revokeObjectURL(a.href);
    });
    pane.querySelector('#impBtn').addEventListener('click', () => {
      try { CMS.importJSON(pane.querySelector('#imp').value); toast('Imported.'); renderTab(); }
      catch (e) { alert('Invalid JSON: ' + e.message); }
    });
    pane.querySelector('#rst').addEventListener('click', () => {
      if (confirm('Reset all content to factory defaults?')) { CMS.resetAll(); renderTab(); toast('Reset complete.'); }
    });
  }

  // ---------- Media picker (overlay) ----------
  function openMediaPicker(cb) {
    const ov = document.createElement('div');
    ov.className = 'cms-mp-veil';
    ov.innerHTML = `
      <div class="cms-mp">
        <div class="cms-mp-head">
          <h3>เลือกรูปจาก <em>Media</em></h3>
          <button class="cms-mp-close">${I.x}</button>
        </div>
        <div class="cms-mp-body">
          <button class="cms-btn cms-btn--primary cms-btn--sm" id="mpUp" style="margin-bottom: 14px;">${I.upload} อัปโหลดใหม่</button>
          <input type="file" id="mpInp" hidden accept="image/*,video/*" />
          <div id="mpG" class="cms-media-grid"></div>
        </div>
      </div>
    `;
    document.body.appendChild(ov);
    const close = () => ov.remove();
    ov.querySelector('.cms-mp-close').addEventListener('click', close);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });

    const grid = ov.querySelector('#mpG');
    const refresh = () => {
      grid.innerHTML = '';
      // user-uploaded
      CMS.media.list().forEach(m => {
        const d = document.createElement('div');
        d.className = 'cms-media-item';
        d.innerHTML = `<img src="${m.src}" alt="" /><div class="meta">${esc(m.name)}</div>`;
        d.addEventListener('click', () => { cb(m.src); close(); });
        grid.appendChild(d);
      });
      // static / built-in assets as quick picks
      [
        'assets/doctor.jpg','assets/doctor-2.jpg','assets/welcome-hero.jpg',
        'assets/welcome-zone.jpg','assets/welcome-zone-2.jpg','assets/banner.jpg',
        'assets/ba-1.jpg','assets/ba-2.jpg','assets/ba-3.jpg','assets/ba-4.jpg',
        'assets/ba-5.jpg','assets/ba-7.jpg','assets/ba-10.jpg','assets/ba-12.jpg',
        'assets/clinic-watcharaphon-1.jpg','assets/clinic-watcharaphon-2.jpg',
        'assets/clinic-ratchapruk-1.jpg','assets/clinic-ratchapruk-2.jpg','assets/clinic-ratchapruk-3.jpg',
        'assets/slogan-1.jpg','assets/slogan-2.jpg','assets/slogan-3.jpg','assets/slogan-4.jpg','assets/slogan-5.jpg',
        'assets/lifestyle-1.jpg','assets/in-clinic.jpg','assets/logo.jpg'
      ].forEach(src => {
        const d = document.createElement('div');
        d.className = 'cms-media-item';
        d.innerHTML = `<img src="${src}" alt="" /><div class="meta">${src.split('/').pop()}</div>`;
        d.addEventListener('click', () => { cb(src); close(); });
        grid.appendChild(d);
      });
    };
    refresh();
    ov.querySelector('#mpUp').addEventListener('click', () => ov.querySelector('#mpInp').click());
    ov.querySelector('#mpInp').addEventListener('change', async e => {
      const files = e.target.files;
      if (!files.length) return;
      for (const f of files) {
        if (f.size > 8 * 1024 * 1024) { toast(`${f.name} too large (max 8MB)`); continue; }
        await CMS.media.add(f);
      }
      refresh();
    });
  }

  // ---------- Utilities ----------
  function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function openPageBtn(url, label) {
    return `<a class="cms-open-btn" href="${esc(url)}" target="_blank" rel="noopener">${I.external} ${esc(label)}</a>`;
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);padding:12px 20px;background:#14242A;color:#fff;border-radius:10px;font-family:Anuphan,sans-serif;font-size:13px;z-index:99998;box-shadow:0 14px 36px -12px rgba(0,0,0,.5);white-space:nowrap;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity 300ms'; t.style.opacity = '0'; }, 1800);
    setTimeout(() => t.remove(), 2200);
  }

  // AUTH SYSTEM START
  const _AUTH_KEY  = 'cms_auth_v2';
  const _AUTH_USER = 'derma';
  const _AUTH_PASS = 'admin1234';

  function _isAuth() { return localStorage.getItem(_AUTH_KEY) === '1'; }

  function _showLoginModal(onSuccess) {
    const prev = document.getElementById('cmsLoginModal');
    if (prev) prev.remove();
    const m = document.createElement('div');
    m.id = 'cmsLoginModal';
    m.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);font-family:inherit';
    m.innerHTML = `
      <div style="background:#fff;border-radius:12px;padding:2rem 2.5rem;width:320px;max-width:90vw;box-shadow:0 24px 64px rgba(0,0,0,.3)">
        <h2 style="margin:0 0 1.5rem;font-size:1.2rem;font-weight:600;color:#111">Admin Access</h2>
        <div style="margin-bottom:.9rem">
          <label style="display:block;font-size:.78rem;font-weight:500;color:#555;margin-bottom:.3rem">Username</label>
          <input id="cmsLgUser" type="text" autocomplete="username"
            style="width:100%;box-sizing:border-box;padding:.55rem .7rem;border:1px solid #d1d5db;border-radius:6px;font-size:.92rem;outline:none" />
        </div>
        <div style="margin-bottom:1.4rem">
          <label style="display:block;font-size:.78rem;font-weight:500;color:#555;margin-bottom:.3rem">Password</label>
          <input id="cmsLgPass" type="password" autocomplete="current-password"
            style="width:100%;box-sizing:border-box;padding:.55rem .7rem;border:1px solid #d1d5db;border-radius:6px;font-size:.92rem;outline:none" />
        </div>
        <div id="cmsLgErr" style="display:none;color:#dc2626;font-size:.78rem;margin-bottom:.9rem">Invalid credentials. Please try again.</div>
        <button id="cmsLgBtn" style="width:100%;padding:.6rem;background:#111;color:#fff;border:none;border-radius:6px;font-size:.92rem;font-weight:500;cursor:pointer">Sign in</button>
        <button id="cmsLgCancel" style="width:100%;padding:.4rem;background:none;border:none;font-size:.82rem;color:#999;cursor:pointer;margin-top:.4rem">Cancel</button>
      </div>`;
    document.body.appendChild(m);

    const uInp = m.querySelector('#cmsLgUser');
    const pInp = m.querySelector('#cmsLgPass');
    const err  = m.querySelector('#cmsLgErr');

    function attempt() {
      if (uInp.value === _AUTH_USER && pInp.value === _AUTH_PASS) {
        localStorage.setItem(_AUTH_KEY, '1');
        m.remove();
        onSuccess();
      } else {
        err.style.display = 'block';
        pInp.value = '';
        pInp.focus();
      }
    }

    m.querySelector('#cmsLgBtn').addEventListener('click', attempt);
    m.querySelector('#cmsLgCancel').addEventListener('click', () => m.remove());
    pInp.addEventListener('keydown', e => { if (e.key === 'Enter') attempt(); });
    uInp.addEventListener('keydown', e => { if (e.key === 'Enter') pInp.focus(); });
    uInp.focus();
  }

  function _requireAuth(cb) {
    if (_isAuth()) { cb(); return; }
    _showLoginModal(cb);
  }

  function _logout() {
    localStorage.removeItem(_AUTH_KEY);
    closeCMS();
  }
  // AUTH SYSTEM END

  // CMS WRITE GUARD START
  (function() {
    var _writes = ['set', 'publish', 'discardDraft', 'resetAll', 'importJSON'];
    _writes.forEach(function(fn) {
      var orig = CMS[fn];
      if (typeof orig !== 'function') return;
      CMS[fn] = function() {
        if (!_isAuth()) {
          var err = new Error('[CMS] Not authenticated — ' + fn + ' blocked. Session may have expired; please log in again.');
          console.error(err.message);
          // Return a rejected Promise so any `await CMS.publish()` caller
          // reaches its catch block instead of silently succeeding.
          return Promise.reject(err);
        }
        return orig.apply(this, arguments);
      };
    });
    ['media', 'sections', 'procedures', 'reviews'].forEach(function(ns) {
      var obj = CMS[ns];
      if (!obj) return;
      Object.keys(obj).forEach(function(fn) {
        var orig = obj[fn];
        if (typeof orig !== 'function') return;
        obj[fn] = function() {
          if (!_isAuth()) {
            var err = new Error('[CMS] Not authenticated — ' + ns + '.' + fn + ' blocked. Session may have expired.');
            console.error(err.message);
            return Promise.reject(err);
          }
          return orig.apply(this, arguments);
        };
      });
    });
  })();
  // CMS WRITE GUARD END

  // ---------- Open/close ----------
  function openCMS() {
    _requireAuth(() => {
      let v = document.getElementById('cmsVeil');
      if (!v) { build(); v = document.getElementById('cmsVeil'); }
      v.classList.add('is-open'); v.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      setTab(activeTab);
      refreshFlag();
    });
  }
  function closeCMS() {
    const v = document.getElementById('cmsVeil');
    if (!v) return;
    v.classList.remove('is-open'); v.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  window.openCMS = openCMS; window.closeCMS = closeCMS;

  document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.dpe-nav-logo');
    let n = 0, t;
    if (logo) logo.addEventListener('click', e => {
      n++; clearTimeout(t); t = setTimeout(() => n = 0, 600);
      if (n >= 3) { e.preventDefault(); openCMS(); n = 0; }
    });
    const link = document.getElementById('adminLink');
    if (link) link.addEventListener('click', e => { e.preventDefault(); openCMS(); });
  });
})();
