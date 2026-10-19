/* TasteTown – demo verze pro prezentace. Data: veřejné profily podniků z tastetown.app (Praha). */
(() => {
'use strict';

const S3 = 'https://s3.eu-central-1.amazonaws.com/tt-apps-assets/images/Branch/';
const IMG = (p, w = 640) => `https://www.tastetown.app/_next/image?url=${encodeURIComponent(S3 + p)}&w=${w}&q=75`;
const HOME = [50.0794, 14.4302];            // výchozí poloha: Václavské náměstí
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAY_CZ = { Mo: 'Pondělí', Tu: 'Úterý', We: 'Středa', Th: 'Čtvrtek', Fr: 'Pátek', Sa: 'Sobota', Su: 'Neděle' };
const DAY_AB = { Po: 'Mo', 'Út': 'Tu', St: 'We', 'Čt': 'Th', 'Pá': 'Fr', So: 'Sa', Ne: 'Su' };
const CATS = [['HOT Deal', '🔥'], ['Kavárna', '☕️'], ['Asijská', '🍜'], ['Pizza', '🍕'], ['Burger', '🍔'], ['Zmrzlina', '🍦'], ['Snídaně', '🍳'],
  ['Pečivo', '🥐'], ['Matcha', '🍵'], ['Bowls', '🥗'], ['Maso', '🥩'], ['Fast Food', '🍟'], ['Kebab', '🌯'], ['Sushi', '🍣'], ['Dezerty', '🧁'],
  ['Zdraví', '🥑'], ['Vegan', '🌱'], ['Orientální', '🥘'], ['Seafood', '🐟'], ['Pivo', '🍻'], ['Víno', '🍷'], ['Koktejl', '🍹'], ['Mexická', '🌮'],
  ['Italská', '🍝'], ['Tapas', '🇪🇸'], ['Indická', '🇮🇳'], ['Česká', '🇨🇿'], ['Ukrajinská', '🇺🇦'], ['Mezinárodní', '🌍']];

/* ---------- ikony ---------- */
const I = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  chev: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20" stroke-linecap="round"/></svg>',
  filters: '<svg viewBox="0 0 24 24"><path d="M4 7h7M4 17h4M15 17h5M17 7h3"/><circle cx="14" cy="7" r="2.3"/><circle cx="11.5" cy="17" r="2.3"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>',
  pinFill: '<svg class="pinico" viewBox="0 0 24 24"><path d="M12 2a7.5 7.5 0 00-7.5 7.5C4.5 15 12 22 12 22s7.5-7 7.5-12.5A7.5 7.5 0 0012 2zm0 10a2.6 2.6 0 110-5.2 2.6 2.6 0 010 5.2z"/></svg>',
  nav: '<svg viewBox="0 0 24 24"><path d="M20 4L4 11l7 2 2 7z"/></svg>',
  star: (c = '#F4BB40') => `<svg viewBox="0 0 24 24"><path fill="${c}" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>`,
  starO: '<svg viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="1.5" d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>',
  loc: (c = '#8C94A6') => `<svg viewBox="0 0 24 24"><path fill="${c}" d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.6a2.6 2.6 0 110-5.2 2.6 2.6 0 010 5.2z"/></svg>`,
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 11v6" stroke-linecap="round" stroke-width="2.4"/><circle cx="12" cy="7.5" r="1.1" fill="#8C94A6" stroke="none"/></svg>',
  gift: '<svg viewBox="0 0 24 24"><g fill="#EC6F00"><rect x="3" y="8" width="18" height="4.5" rx="1"/><rect x="4.5" y="13.5" width="15" height="7.5" rx="1"/><path d="M12 8c-1.5-3.5-5.5-4.5-6-2s3 2 6 2zm0 0c1.5-3.5 5.5-4.5 6-2s-3 2-6 2z"/></g><path d="M12 8v13" stroke="#FAFAFE" stroke-width="1.6"/></svg>',
  renew: '<svg viewBox="0 0 24 24" fill="none" stroke="#EC6F00" stroke-width="2.4" stroke-linecap="round"><path d="M19 12a7 7 0 11-2.1-5"/><path d="M17.5 2.5v4.6h-4.6" stroke-linejoin="round"/></svg>',
  place: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6.5" fill="#EC6F00"/><circle cx="12" cy="10" r="2.4" fill="#FAFAFE"/><path d="M12 16.5V21M8 21.5h8" stroke="#EC6F00" stroke-width="2.2" stroke-linecap="round"/></svg>',
  cal: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4" stroke-linecap="round"/></svg>',
  calFill: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="16" rx="2.5" fill="#EC6F00"/><rect x="5.5" y="10" width="13" height="8" rx="1" fill="#FAFAFE"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 005.1 5.1l1.4-2.3L19 14.5V18a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/></svg>',
  navC: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M16 8l-6 2.6 3 .4.4 3z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4"/></svg>',
  alert: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v5.5" stroke-linecap="round"/><circle cx="12" cy="16.3" r=".9" fill="#222"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.8-8-11A4.5 4.5 0 0112 6.8a4.5 4.5 0 018 2.7c0 6.2-8 11-8 11z" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  okCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="#5DC968" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.3l3 3 6-6.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><path d="M7 10V7.5a5 5 0 0110 0V10h.5A1.5 1.5 0 0119 11.5v8a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19.5v-8A1.5 1.5 0 016.5 10zm2 0h6V7.5a3 3 0 00-6 0z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="#1d1e20" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/></svg>',
  ig: '<svg viewBox="0 0 24 24"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEC053"/><stop offset=".35" stop-color="#F2203E"/><stop offset=".7" stop-color="#B729A8"/><stop offset="1" stop-color="#5342D6"/></linearGradient></defs><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="url(#igg)"/><rect x="6.5" y="6.5" width="11" height="11" rx="3.4" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="2.7" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="16.6" cy="7.4" r="1" fill="#fff"/></svg>',
  tt: '<svg viewBox="0 0 24 24"><path fill="#25F4EE" d="M9.6 9.3v-.9A6.8 6.8 0 004 18.6a6.8 6.8 0 015.6-9.3z"/><path fill="#25F4EE" d="M9.8 19.6a3.1 3.1 0 003.1-3V2.5h2.7a5 5 0 01-.1-1h-3.7v14.1a3.1 3.1 0 01-4.4 2.6 3.1 3.1 0 002.4 1.4zM20.7 7.5v-.8a5 5 0 01-2.8-.8 5.1 5.1 0 002.8 1.6z"/><path fill="#FE2C55" d="M17.9 5.9a5.1 5.1 0 01-1.3-3.4h-1a5.1 5.1 0 002.3 3.4zM8.4 12.9a3.1 3.1 0 00-1.4 5.8 3.1 3.1 0 013.6-4.7V10.3a6.8 6.8 0 00-1-.1h-.1V13a3.1 3.1 0 00-1.1-.1zm12.3-5.4v2.9a8.9 8.9 0 01-5.2-1.7v7.4A6.8 6.8 0 014.9 19.8 6.8 6.8 0 0016.5 15V7.6a8.9 8.9 0 005.2 1.7V6.4a5.2 5.2 0 01-1-.1z"/><path fill="#000" d="M15.5 15.6V8.2a8.9 8.9 0 005.2 1.7V7a5.2 5.2 0 01-2.8-1.6 5.1 5.1 0 01-2.3-3.4h-2.7v14.1a3.1 3.1 0 01-5.5 1.8 3.1 3.1 0 011.4-5.8 3 3 0 01.9.1v-2.8a6.8 6.8 0 00-4.8 11.4 6.8 6.8 0 0010.6-5.6z"/></svg>',
  fb: '<svg viewBox="0 0 24 24"><path fill="#1877F2" d="M13.6 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 00-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21z"/></svg>',
  yt: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000"/><path d="M10 9v6l5.2-3z" fill="#fff"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path fill="#EC6F00" d="M12.5 2.5c.6 3-1.3 4.6-2.6 6.2C8.6 10.3 7 12 7 15a5 5 0 0010 0c0-2.2-1-3.8-1.8-4.8-.2 1.5-.9 2.5-2 2.9.9-3.2.1-7-.7-10.6z"/></svg>',
  heartF: '<svg viewBox="0 0 24 24"><path fill="#EC6F00" d="M12 20.5s-8-4.8-8-11A4.5 4.5 0 0112 6.8a4.5 4.5 0 018 2.7c0 6.2-8 11-8 11z"/></svg>',
  hex: '<svg viewBox="0 0 24 24"><path fill="#EC6F00" d="M12 2l8.7 5v10L12 22l-8.7-5V7z"/><circle cx="12" cy="12" r="3.2" fill="#FAFAFE"/></svg>',
  play: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#EC6F00"/><path d="M10 8l6 4-6 4z" fill="#fff"/></svg>',
  qm: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#EC6F00"/><path d="M9.6 9.4a2.5 2.5 0 114 2c-.9.6-1.6 1.1-1.6 2.3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.2" fill="#fff"/></svg>',
  ex: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#EC6F00"/><path d="M12 7v6.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17" r="1.3" fill="#fff"/></svg>',
  inf: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#EC6F00"/><path d="M12 11v6.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="7.3" r="1.3" fill="#fff"/></svg>',
  smile: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#EC6F00"/><path d="M8 12.5a4 4 0 008 0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  card: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2" fill="#EC6F00"/><path d="M2.5 9.5h19" stroke="#FAFAFE" stroke-width="2"/></svg>',
  earth: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#EC6F00"/><path d="M6 7.5c2 .5 2.5 2 4 2.5s1 2-.5 2.8S8 15.5 8.5 18M15 4.8c-.5 1.6.5 2.6 2 2.8s2 1.7 1.2 3.3-2.7 1.4-3.2 3.4.6 3.6.2 5.2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
  ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 014 18.5v-11A1.5 1.5 0 015.5 6H10" fill="none" stroke="#8C94A6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ticket: '<svg viewBox="0 0 24 24"><path fill="#EC6F00" d="M3 6h18v4a2 2 0 000 4v4H3v-4a2 2 0 000-4z"/><path d="M7 10h10M7 14h6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  grid: '<svg viewBox="0 0 24 24"><g fill="#EC6F00"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></g></svg>',
  table: '<svg viewBox="0 0 24 24"><path d="M3 8h18M5 8l1-3h12l1 3M6 8v11M18 8v11M6 13h12"/></svg>',
  pinO: '<svg viewBox="0 0 24 24"><path fill="#EC6F00" d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.6a2.6 2.6 0 110-5.2 2.6 2.6 0 010 5.2z"/></svg>',
};

/* ---------- pomocníci ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dfmt = d => `${pad(d.getDate())}. ${pad(d.getMonth() + 1)}. ${d.getFullYear()}`;
const stars = (r, c) => `<span class="stars">${[1, 2, 3, 4, 5].map(i => i <= Math.round(r) ? I.star(c) : I.star('#E2E5EB')).join('')}</span>`;
const plural = (n, a, b, c) => n === 1 ? a : (n >= 2 && n <= 4 ? b : c);
const renewTxt = d => `Obnoví se každých ${d} ${plural(d, 'den', 'dny', 'dnů')}`.replace('každých 1 den', 'každý den');
const vib = () => { try { navigator.vibrate && navigator.vibrate(12); } catch (e) {} };

const store = {
  get() { try { return JSON.parse(localStorage.getItem('tt-demo')) || null; } catch (e) { return null; } },
  set(v) { try { localStorage.setItem('tt-demo', JSON.stringify(v)); } catch (e) {} },
};

let V = [], byId = {}, map, markers = {}, user = HOME.slice(), selected = null;
let st = store.get() || {};
const F = { avail: 'any', where: new Set(), cats: new Set() };

function save() { store.set(st); }
function seed() {
  if (st.v === 2) return;
  const pick = n => V.filter(v => v.d.length && v.rc > 300).sort((a, b) => b.rc - a.rc)[n];
  const now = Date.now(), day = 864e5, hist = [];
  [[2, 3], [7, 9], [11, 17]].forEach(([n, ago]) => {
    const v = pick(n); if (!v) return;
    hist.push({ vi: v.i, di: 0, ts: now - ago * day, time: ['12:34', '17:28', '09:12'][hist.length] });
  });
  st = { v: 2, name: st.name || 'Rafael B.', booked: [], redeemed: hist, favs: [pick(5)?.i].filter(Boolean), saved0: 0 };
  save();
}

/* ---------- vzdálenost a otevírací doba ---------- */
function dist(v) {
  const R = 6371, t = Math.PI / 180, dLa = (v.la - user[0]) * t, dLn = (v.ln - user[1]) * t;
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(user[0] * t) * Math.cos(v.la * t) * Math.sin(dLn / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
const km = v => `${dist(v).toFixed(1)} km`;
function todayHours(v, d = new Date()) {
  const code = DAYS[d.getDay()];
  return v.h.find(x => x[0].includes(code)) || null;
}
function isOpen(v, d = new Date()) {
  const t = todayHours(v, d); if (!t) return false;
  const m = d.getHours() * 60 + d.getMinutes(), [oh, om] = t[1].split(':').map(Number), [ch, cm] = t[2].split(':').map(Number);
  const o = oh * 60 + om, c = (ch * 60 + cm) || 1440;
  return c > o ? m >= o && m < c : m >= o || m < c;
}
const openTag = v => isOpen(v) ? '<span class="is-open">Otevřeno</span>' : '<span class="is-closed">Zavřeno</span>';

/* ---------- filtrování ---------- */
function passes(v) {
  if (F.avail === 'now' && !isOpen(v)) return false;
  if (F.where.size) {
    const ok = v.d.some(d => (F.where.has('misto') && /místě|na místě/i.test(d.m)) || (F.where.has('sebou') && /sebou/i.test(d.m)));
    if (!ok) return false;
  }
  if (F.cats.size) {
    const ok = [...F.cats].some(c => c === 'HOT Deal' ? v.k === 'hot' : v.c.includes(c));
    if (!ok) return false;
  }
  return true;
}
const filterCount = () => (F.avail !== 'any' ? 1 : 0) + F.where.size + F.cats.size;

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); t.className = 'toastm'; t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('in'));
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('in'), 2400);
}

/* ---------- karta podniku ---------- */
function vcard(v, opts = {}) {
  const fav = st.favs.includes(v.i);
  const el = h(`<div class="vcard">
    <div class="info">
      <div class="nm">${esc(v.n)}</div>
      <div class="cats">${v.c.map(esc).join(' ・ ')}</div>
      <div class="meta"><span class="st">${I.star()}${v.r.toFixed(1)}</span><span class="st">${I.loc()}${km(v)}</span>${openTag(v)}</div>
      <div class="pills">${v.d.map(d => `<span class="pill">${esc(d.t)}</span>`).join('')}</div>
    </div>
    <img class="ph" loading="lazy" src="${IMG(v.im[0], 256)}" alt="">
    ${opts.fav || fav && opts.showFav ? `<span class="fav">${I.heart.replace('<path', '<path fill="#fff" stroke="none"')}</span>` : ''}
  </div>`);
  el.addEventListener('click', () => openDetail(v));
  return el;
}

/* ================= OBJEVUJ ================= */
function buildExplore() {
  const s = h(`<section class="screen" id="s-objevuj">
    <div id="map"></div>
    <div class="ex-top">
      <button class="search glass" id="openSearch">${I.search}<span>Hledat podniky…</span></button>
      <div class="chips">
        <button class="chip glass" id="cFilters">${I.filters}<span>Filtry</span><span class="dn">${I.down.replace('<svg', '<svg style="width:17px;height:17px"')}</span></button>
        <button class="chip glass" id="cNow">${I.clock}<span>Teď</span></button>
        <button class="chip glass" id="cCats"><span>Kategorie</span>${I.down.replace('<svg', '<svg style="width:17px;height:17px"')}</button>
        <button class="chip glass" id="cCity">${I.pinFill}<span>Praha</span>${I.down.replace('<svg', '<svg style="width:17px;height:17px"')}</button>
      </div>
    </div>
    <button class="locbtn glass" id="locBtn">${I.nav}</button>
    <div class="carousel off" id="carousel"></div>
    <div class="drawer" id="drawer">
      <div class="grab"><div class="handle"></div><h2 class="d">${I.ticket}Objevuj nová místa<span class="count" id="dCount"></span></h2></div>
      <div class="list" id="dList"></div>
    </div>
  </section>`);
  $('#screens').append(s);

  map = new maplibregl.Map({ container: 'map', style: mapStyle(), center: [14.43, 50.083], zoom: 12.2, attributionControl: false, dragRotate: false, pitchWithRotate: false });
  map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.once('load', () => $$('.maplibregl-ctrl-attrib', $('#map')).forEach(x => x.classList.remove('maplibregl-compact-show')));
  map.on('click', () => closeCarousel());
  map.on('style.load', () => tintMap(map));

  V.forEach(v => {
    const el = h(`<div class="pin"><img src="${pinSrc(v, false)}" alt=""></div>`);
    el.addEventListener('click', e => { e.stopPropagation(); selectVenue(v, true); });
    markers[v.i] = { el, mk: new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([v.ln, v.la]).addTo(map), on: true };
  });

  $('#openSearch').onclick = openSearch;
  $('#cFilters').onclick = sheetFilters;
  $('#cNow').onclick = () => { F.avail = F.avail === 'now' ? 'any' : 'now'; applyFilters(); };
  $('#cCats').onclick = sheetCategories;
  $('#cCity').onclick = sheetCity;
  $('#locBtn').onclick = () => { map.flyTo({ center: [user[1], user[0]], zoom: 15, duration: 800 }); };

  // spodní panel: tah za úchyt nebo klepnutí
  const dr = $('#drawer'), grab = $('.grab', dr);
  let y0 = null, base = 0, dy = 0, t0 = 0;
  const closedY = () => dr.offsetHeight - (150 + (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sbpx')) || 0));
  grab.addEventListener('pointerdown', e => { y0 = e.clientY; t0 = Date.now(); dy = 0; base = dr.classList.contains('open') ? 0 : closedY(); dr.style.transition = 'none'; grab.setPointerCapture(e.pointerId); });
  grab.addEventListener('pointermove', e => { if (y0 === null) return; dy = e.clientY - y0; dr.style.transform = `translateY(${Math.max(0, base + dy)}px)`; });
  const end = () => {
    if (y0 === null) return; y0 = null; dr.style.transition = ''; dr.style.transform = '';
    const tap = Math.abs(dy) < 6 && Date.now() - t0 < 350;
    if (tap) dr.classList.toggle('open'); else if (dy < -40) dr.classList.add('open'); else if (dy > 40) dr.classList.remove('open');
    placeLoc();
  };
  grab.addEventListener('pointerup', end); grab.addEventListener('pointercancel', end);
  // tah dolů v seznamu, když je nahoře
  const list = $('#dList'); let ly = null;
  list.addEventListener('touchstart', e => { ly = list.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  list.addEventListener('touchmove', e => { if (ly !== null && e.touches[0].clientY - ly > 70 && dr.classList.contains('open')) { dr.classList.remove('open'); ly = null; placeLoc(); } }, { passive: true });

  // karusel: posun = výběr dalšího podniku
  const car = $('#carousel'); let ct;
  car.addEventListener('scroll', () => {
    clearTimeout(ct);
    ct = setTimeout(() => {
      const cards = $$('.vcard', car); if (!cards.length) return;
      const mid = car.scrollLeft + car.clientWidth / 2;
      let best = cards[0], bd = 1e9;
      cards.forEach(c => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = c; } });
      const v = byId[best.dataset.id]; if (v && v !== selected) { setSelected(v); panTo(v); }
    }, 120);
  }, { passive: true });

  applyFilters();
}

// barevný styl mapy podle originálu (světlá, modrá voda, zelené parky)
function mapStyle() {
  return 'https://tiles.openfreemap.org/styles/positron';
}
function tintMap(m) {
  const set = (id, prop, val) => { try { if (m.getLayer(id)) m.setPaintProperty(id, prop, val); } catch (e) {} };
  set('background', 'background-color', '#F4F4F2'); set('water', 'fill-color', '#A9D7F3'); set('waterway', 'line-color', '#A9D7F3');
  set('park', 'fill-color', '#DDEFD6'); set('landcover_wood', 'fill-color', '#E0EFD9'); set('landuse_residential', 'fill-color', '#EFEFEC');
  set('building', 'fill-color', '#EAEAE7'); set('highway_minor', 'line-color', '#FFFFFF'); set('highway_major_casing', 'line-color', '#E2E2E2');
  ['label_village', 'label_town', 'label_city', 'label_city_capital', 'label_other'].forEach(id => set(id, 'text-color', '#3a3c42'));
  set('water_name_line_label', 'text-color', '#3A8FC0'); set('water_name_point_label', 'text-color', '#3A8FC0');
}
const pinSrc = (v, big) => { const k = v.k ? '_' + v.k : ''; return big ? `assets/pins/large_pin${k}.png` : `assets/pins/pin${st.favs.includes(v.i) ? '_fav' : k}.png`; };
function pinSet(v, big) {
  const m = markers[v.i]; if (!m) return;
  m.el.classList.toggle('big', big); $('img', m.el).src = pinSrc(v, big); m.el.style.zIndex = big ? 10 : '';
}
function panTo(v) { map.easeTo({ center: [v.ln, v.la], offset: [0, -90], duration: 450 }); }
function setSelected(v) {
  if (selected) pinSet(selected, false);
  selected = v;
  if (v) pinSet(v, true);
}
function selectVenue(v, fromMap) {
  setSelected(v);
  const near = V.filter(x => x !== v && passes(x)).sort((a, b) => {
    const da = (a.la - v.la) ** 2 + (a.ln - v.ln) ** 2, db = (b.la - v.la) ** 2 + (b.ln - v.ln) ** 2; return da - db;
  }).slice(0, 12);
  const car = $('#carousel'); car.innerHTML = '';
  [v, ...near].forEach((x, n) => {
    const c = vcard(x); c.dataset.id = x.i;
    if (n === 0) { const b = h(`<button class="x">${I.x}</button>`); b.onclick = e => { e.stopPropagation(); closeCarousel(); }; c.append(b); }
    car.append(c);
  });
  car.scrollLeft = 0;
  car.classList.remove('off'); $('#drawer').classList.add('hide'); $('#drawer').classList.remove('open');
  placeLoc();
  if (fromMap) panTo(v);
}
function closeCarousel() {
  if ($('#carousel').classList.contains('off')) return;
  setSelected(null);
  $('#carousel').classList.add('off'); $('#drawer').classList.remove('hide'); placeLoc();
}
function placeLoc() {
  const b = $('#locBtn'); if (!b) return;
  const car = !$('#carousel').classList.contains('off'), open = $('#drawer').classList.contains('open');
  b.style.bottom = car ? 'calc(var(--sb) + 270px)' : `calc(var(--sb) + ${open ? 9999 : 168}px)`;
  b.style.opacity = open ? 0 : 1;
}

function applyFilters() {
  const list = V.filter(passes).sort((a, b) => dist(a) - dist(b));
  V.forEach(v => { const m = markers[v.i]; if (!m) return; const on = passes(v); if (on && !m.on) m.mk.addTo(map); if (!on && m.on) m.mk.remove(); m.on = on; });
  const dl = $('#dList'); dl.innerHTML = '';
  list.slice(0, 60).forEach(v => dl.append(vcard(v)));
  if (!list.length) dl.innerHTML = '<div class="menu-empty"><b>Nic jsme nenašli</b>Zkus upravit filtry.</div>';
  $('#dCount').textContent = `${list.length} podniků`;
  const n = filterCount(), cf = $('#cFilters');
  cf.classList.toggle('on', n > 0);
  cf.innerHTML = `${I.filters}<span>Filtry</span>${n ? `<span class="n">${n}</span>` : I.down.replace('<svg', '<svg style="width:17px;height:17px"')}`;
  $('#cNow').classList.toggle('on', F.avail === 'now');
  const cat = F.cats.size === 1 ? [...F.cats][0] : null;
  $('#cCats').classList.toggle('on', !!F.cats.size);
  $('#cCats span').textContent = cat || 'Kategorie';
  closeCarousel();
}

/* ---------- hledání ---------- */
function openSearch() {
  const el = h(`<div class="srch"><div class="bar"><label class="search">${I.search}<input placeholder="Hledat podniky…" autocomplete="off"></label><button class="cancel">Zrušit</button></div><div class="res"></div></div>`);
  $('#app').append(el); requestAnimationFrame(() => el.classList.add('in'));
  const inp = $('input', el), res = $('.res', el);
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const draw = () => {
    const q = norm(inp.value.trim()); res.innerHTML = '';
    const hits = V.filter(v => !q || norm(v.n + ' ' + v.c.join(' ') + ' ' + v.d.map(d => d.t).join(' ') + ' ' + v.a).includes(q)).sort((a, b) => dist(a) - dist(b)).slice(0, 40);
    hits.forEach(v => { const c = vcard(v); c.addEventListener('click', () => close(), true); res.append(c); });
    if (!hits.length) res.innerHTML = '<div class="menu-empty"><b>Nic jsme nenašli</b>Zkus jiný název podniku nebo jídla.</div>';
  };
  const close = () => { el.classList.remove('in'); setTimeout(() => el.remove(), 250); };
  inp.oninput = draw; $('.cancel', el).onclick = close; draw(); setTimeout(() => inp.focus(), 60);
}

/* ================= SHEETY ================= */
function sheet(inner, { cls = '' } = {}) {
  const w = h(`<div class="sheet-wrap"><div class="sheet ${cls}"><div class="handle"></div></div></div>`);
  const sh = $('.sheet', w); sh.append(...(Array.isArray(inner) ? inner : [inner]));
  $('#sheets').append(w);
  requestAnimationFrame(() => requestAnimationFrame(() => w.classList.add('in')));
  const close = () => { w.classList.remove('in'); setTimeout(() => w.remove(), 380); };
  w.addEventListener('click', e => { if (e.target === w) close(); });
  // tah dolů za úchyt
  let y0 = null, dy = 0; const hd = $('.handle', sh);
  [hd, $('.ttl', sh) || hd, $('.sttl', sh) || hd].forEach(t => {
    t.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; sh.style.transition = 'none'; }, { passive: true });
    t.addEventListener('touchmove', e => { if (y0 === null) return; dy = Math.max(0, e.touches[0].clientY - y0); sh.style.transform = `translateY(${dy}px)`; }, { passive: true });
    t.addEventListener('touchend', () => { sh.style.transition = ''; sh.style.transform = ''; if (dy > 90) close(); y0 = null; dy = 0; });
  });
  return { el: w, sh, close };
}

function sheetConditions() {
  const rows = [['🚫', 'Podnik nedostane žádnou informaci, když aktivujete svůj DEAL.'], ['📞', 'Pro rezervaci nebo objednávku se podniku ozvěte.'],
    ['📅', 'DEAL platí jen v daný čas a den.'], ['🤝', 'Při jedné návštěvě lze využít pouze jeden DEAL. Pokud přijdete ve více osobách na 1+1, platí to pro oba a nemůžete využít jinou akční nabídku.'],
    ['➕', 'DEALY nelze kombinovat.'], ['🚗', 'Nabídka s sebou neobsahuje doručení.'], ['🔁', 'Po uplatnění DEALU se ti DEAL po nějakém čase opět obnoví.']];
  const s = sheet([h('<div class="ttl">Podmínky dealů</div>'), h(`<div class="body"><div class="cond">${rows.map(r => `<div><span>${r[0]}</span>${r[1]}</div>`).join('')}</div><button class="cta dark" style="margin-top:18px">Rozumím</button></div>`)]);
  $('.cta', s.sh).onclick = s.close;
}

function slotsFor(deal, v, date) {
  const code = DAYS[date.getDay()], out = [];
  deal.sl.forEach(sl => {
    const txt = (sl[1] || '').trim();
    const days = /denně|každý den/i.test(txt) || !txt ? DAYS : txt.split(/,\s*/).map(x => DAY_AB[x.trim()]).filter(Boolean);
    if (days.includes(code)) out.push({ time: sl[0].replace('–', ' - '), cap: parseInt((sl[2] || '').replace(/\D/g, '')) || 10 });
  });
  return out;
}
// kontrolní háček pro QA: kolik dní v příštích 3 týdnech má deal termíny (bez pojistky)
window.__ttSlotsDays = (v, di) => { let n = 0; for (let k = 0; k < 21; k++) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + k); if (slotsFor(v.d[di], v, d).length) n++; } return n; };
function bookingDays(v, di) {
  // demo: vždy dnešek + 6 dní a vždy volno – i když podnik ten den termín nemá
  const deal = v.d[di] || v.d[0], days = [];
  const anyTime = (deal.sl[0] && deal.sl[0][0].replace('–', ' - ')) || null;
  for (let n = 0; n < 7; n++) {
    const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n);
    let sl = slotsFor(deal, v, d);
    if (!sl.length) { const t = todayHours(v, d); sl = [{ time: anyTime || (t ? `${t[1]} - ${t[2]}` : '10:00 - 22:00'), cap: 10 }]; }
    days.push({ d, n, sl: sl.map(x => ({ ...x, cap: Math.max(x.cap, 1) })) });
  }
  return days;
}
window.__ttBookingDays = (v, di) => { const ds = bookingDays(v, di); return ds.length === 7 && ds[0].n === 0 && ds.every(d => d.sl.length) ? ds.length : 0; };
function sheetBooking(v, di) {
  const days = bookingDays(v, di);
  let pick = days.length ? { day: 0, slot: 0 } : null;
  const body = h('<div class="body"><div class="fsec" style="margin-top:0">Vyber den a čas</div></div>');
  days.forEach((dd, k) => {
    const nm = dd.n === 0 ? 'Dnes' : dd.n === 1 ? 'Zítra' : `${dd.d.getDate()}. ${dd.d.getMonth() + 1}.`;
    const box = h(`<div class="day"><div class="t">${nm}<small>${dfmt(dd.d)}</small></div></div>`);
    dd.sl.forEach((s, j) => {
      const b = h(`<button class="slot${k === 0 && j === 0 ? ' on' : ''}"><span class="l">${I.clock}${s.time}</span><span class="r"><i></i>${s.cap} volné</span></button>`);
      b.onclick = () => { $$('.slot', body).forEach(x => x.classList.remove('on')); b.classList.add('on'); pick = { day: k, slot: j }; vib(); };
      box.append(b);
    });
    body.append(box);
  });
  const foot = h('<div class="foot"><button class="cta lime" style="margin-top:0">Potvrdit</button></div>');
  const s = sheet([h('<div class="ttl">Rezervace dealu</div>'), body, foot]);
  $('.cta', foot).onclick = () => {
    if (!pick) return;
    const dd = days[pick.day], sl = dd.sl[pick.slot];
    st.booked.unshift({ id: Date.now(), vi: v.i, di, ts: dd.d.getTime(), time: sl.time }); save();
    s.close(); setTimeout(() => modalBooked(v), 200);
  };
}

function sheetFilters() {
  const tmp = { avail: F.avail, where: new Set(F.where), cats: new Set(F.cats) };
  const body = h(`<div class="body">
    <div class="fsec" style="margin-top:0">Dostupnost</div>
    <div class="tog" id="fAv"><button data-v="any">Kdykoliv</button><button data-v="now">Teď</button><button data-v="custom">Vlastní</button></div>
    <div class="fsec">Kde budeš jíst</div>
    <div class="ftags" id="fWh"><button class="ftag" data-v="misto">Jídlo na místě</button><button class="ftag" data-v="sebou">Jídlo s sebou</button></div>
    <div class="fsec">Kategorie</div>
    <div class="ftags" id="fCt">${CATS.map(c => `<button class="ftag" data-v="${c[0]}"><span>${c[1]}</span>${c[0]}</button>`).join('')}</div>
  </div>`);
  const foot = h('<div class="foot"><button class="cta" style="margin-top:0" id="fGo">Filtrovat</button><button style="display:block;margin:16px auto 4px;color:#E1582E;font-weight:600;font-size:18px" id="fClr">Zrušit filtr</button></div>');
  const head = h(`<div class="sttl">${I.filters.replace('<svg', '<svg style="stroke:#EB6B3B;stroke-width:2;fill:none"')}Filtry<button class="reset">Resetovat</button></div>`);
  const s = sheet([head, body, foot]);
  const draw = () => {
    $$('#fAv button', body).forEach(b => b.classList.toggle('on', b.dataset.v === tmp.avail));
    $$('#fWh .ftag', body).forEach(b => b.classList.toggle('on', tmp.where.has(b.dataset.v)));
    $$('#fCt .ftag', body).forEach(b => b.classList.toggle('on', tmp.cats.has(b.dataset.v)));
    const save0 = { ...F }; const n = V.filter(v => { Object.assign(F, tmp); const r = passes(v); return r; }).length; Object.assign(F, save0);
    $('#fGo', foot).innerHTML = `Filtrovat <span style="opacity:.85">(${(tmp.avail !== 'any' ? 1 : 0) + tmp.where.size + tmp.cats.size ? n : 0})</span>`;
  };
  $$('#fAv button', body).forEach(b => b.onclick = () => { tmp.avail = b.dataset.v; vib(); draw(); });
  $$('.ftag', body).forEach(b => b.onclick = () => { const set = b.closest('#fWh') ? tmp.where : tmp.cats; set.has(b.dataset.v) ? set.delete(b.dataset.v) : set.add(b.dataset.v); vib(); draw(); });
  $('.reset', head).onclick = () => { tmp.avail = 'any'; tmp.where.clear(); tmp.cats.clear(); draw(); };
  $('#fGo', foot).onclick = () => { Object.assign(F, tmp); applyFilters(); s.close(); };
  $('#fClr', foot).onclick = () => { F.avail = 'any'; F.where.clear(); F.cats.clear(); applyFilters(); s.close(); };
  draw();
}

function sheetCategories() {
  const cur = F.cats.size === 1 ? [...F.cats][0] : (F.cats.size ? null : 'Vše');
  const body = h(`<div class="body">${[['Vše', '']].concat(CATS).map(c => `<button class="opt${c[0] === cur ? ' on' : ''}" data-v="${c[0]}">${c[0] === 'Vše' ? '<span class="rad"></span>' : `<span class="em">${c[1]}</span>`}${c[0]}${c[0] === cur ? I.check.replace('<svg', '<svg class="ok"') : ''}</button>`).join('')}</div>`);
  const s = sheet([h(`<div class="sttl">${I.grid}Kategorie</div>`), body]);
  $$('.opt', body).forEach(b => b.onclick = () => { F.cats.clear(); if (b.dataset.v !== 'Vše') F.cats.add(b.dataset.v); applyFilters(); vib(); s.close(); });
}

function sheetCity() {
  const body = h(`<div class="body"><div class="fsec" style="margin-top:0;display:flex;align-items:center;gap:10px"><img src="assets/img/cz.png" style="width:30px;height:20px;border-radius:3px">Česká republika</div>
    <button class="city"><img src="https://s3.eu-central-1.amazonaws.com/tt-apps-assets/images/City/0-999/1/643978f6-28d9-48ec-909c-dcd989af5edb.png" alt=""><div><b>Praha</b><span>${V.reduce((a, v) => a + v.d.length, 0)} deals</span></div>${I.check}</button></div>`);
  const s = sheet([h(`<div class="sttl">${I.pinO}Vyber město</div>`), body]);
  $('.city', body).onclick = () => { s.close(); map.flyTo({ center: [14.43, 50.083], zoom: 12.2, duration: 800 }); };
}

function sheetNavigate(v) {
  const q = encodeURIComponent(`${v.n}, ${v.a}`);
  const apps = [['Apple Maps', 'apple_maps', `https://maps.apple.com/?q=${encodeURIComponent(v.n)}&ll=${v.la},${v.ln}`],
    ['Google Maps', 'google_maps', `https://www.google.com/maps/search/?api=1&query=${q}`], ['Waze', 'waze', `https://waze.com/ul?ll=${v.la},${v.ln}&navigate=yes`]];
  const body = h(`<div class="body">${apps.map(a => `<a class="navapp" href="${a[2]}" target="_blank" rel="noopener"><img src="assets/nav/${a[1]}.png" alt="">${a[0]}</a>`).join('')}</div>`);
  sheet([h('<div class="ttl">Navigovat</div>'), body]);
}

/* ================= DETAIL PODNIKU ================= */
let stack = [];
function push(el) {
  el.classList.add('push'); $('#screens').append(el); stack.push(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
  $('#tabbar').classList.add('off');
  // tah od levého okraje = zpět
  let x0 = null, dx = 0;
  el.addEventListener('touchstart', e => { const x = e.touches[0].clientX; if (x < 24) { x0 = x; el.style.transition = 'none'; } }, { passive: true });
  el.addEventListener('touchmove', e => { if (x0 === null) return; dx = Math.max(0, e.touches[0].clientX - x0); el.style.transform = `translateX(${dx}px)`; }, { passive: true });
  el.addEventListener('touchend', () => { if (x0 === null) return; el.style.transition = ''; el.style.transform = ''; if (dx > 90) pop(); x0 = null; dx = 0; });
  return el;
}
function pop() {
  const el = stack.pop(); if (!el) return;
  el.classList.remove('in'); setTimeout(() => { el._cleanup && el._cleanup(); el.remove(); }, 400);
  if (!stack.length) $('#tabbar').classList.remove('off');
}
function popAll() { while (stack.length) pop(); }

function dealCard(v, d, di, extra = '') {
  return `<div class="deal" data-di="${di}">
    <div class="hd"><h3>${esc(d.t)}</h3><button class="i" data-act="cond">${I.info}</button></div>
    <p>${esc(d.ds)}</p>
    <ul>${extra || `<li>${I.gift}Ušetříš až ${d.s} Kč</li><li>${I.renew}${renewTxt(d.rw)}</li><li>${I.place}${esc(d.m)}</li>`}</ul>
    ${extra ? '' : '<button class="cta" data-act="book">Rezervovat DEAL</button>'}
  </div>`;
}

function openDetail(v) {
  const imgs = v.im.length ? v.im : [''];
  const fav = () => st.favs.includes(v.i);
  const th = todayHours(v);
  const week = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(c => { const x = v.h.find(z => z[0].includes(c)); return `<div class="${DAYS[new Date().getDay()] === c ? 'today' : ''}"><span>${DAY_CZ[c]}</span><span>${x ? `${x[1]} - ${x[2]}` : 'Zavřeno'}</span></div>`; }).join('');
  const el = h(`<section class="screen"><div class="scroll">
    <div class="hero">
      <div class="imgs">${imgs.map((p, n) => `<img src="${IMG(p, n ? 828 : 750)}" ${n ? 'loading="lazy"' : ''} alt="">`).join('')}</div>
      <div class="dots">${imgs.length > 1 ? imgs.map((_, n) => `<i class="${n ? '' : 'on'}"></i>`).join('') : ''}</div>
      <button class="tl" data-act="back">${I.back}</button>
      <div class="tr"><a href="https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(v.n)}" target="_blank" rel="noopener">${I.ig}</a>${v.w ? `<a href="${esc(v.w)}" target="_blank" rel="noopener">${I.globe}</a>` : ''}</div>
      <div class="cap"><h1>${esc(v.n)}</h1><div class="c">${v.c.map(esc).join(' ・ ')}</div>
        <div class="m">${stars(v.r, '#F4BB40').replace(/#E2E5EB/g, 'rgba(255,255,255,.45)')}<b>${v.r.toFixed(1)}</b> (${v.rc})<span class="sep">|</span>${I.loc('#fff').replace('<svg', '<svg style="width:16px;height:16px"')}<b>${km(v)}</b><span class="sep">|</span><b>${isOpen(v) ? 'Otevřeno' : 'Zavřeno'}</b></div></div>
      <button class="heart${fav() ? ' on' : ''}" data-act="fav">${I.heart}</button>
    </div>
    <div style="padding:0 20px calc(var(--sb) + 30px)">
      <div class="seg"><button class="on" data-tab="deals">Dealy &amp; více</button><button data-tab="menu">Menu</button></div>
      <div id="tDeals">
        ${v.d.map((d, n) => dealCard(v, d, n)).join('')}
        ${v.rk.length ? `<div style="margin:-4px 0 8px">${v.rk.map(r => `<span class="rank">🏆 ${esc(r)}</span>`).join('')}</div>` : ''}
        <div class="label" style="margin-top:14px">Hodnocení a recenze</div>
        <div class="rv-head"><div class="big"><b>${v.r.toFixed(1)}</b>${stars(v.r, '#EB5A2E')}</div><div class="n">${v.rc} hodnocení <span style="margin:0 8px">・</span> ${Math.max(v.rv.length, Math.round(v.rc / 17))} recenzí</div></div>
        <div id="rvs">${v.rv.slice(0, 4).map(rv).join('')}</div>
        ${v.rv.length > 4 ? `<button class="cta outline" data-act="allrv" style="margin-top:22px;font-size:18px;font-weight:600">Zobrazit vše <span style="color:var(--muted2)">(${v.rv.length})</span></button>` : ''}
        <div style="margin-top:22px">
          <div class="kv" data-act="hours"><div class="k">Otevírací doba${I.down}</div><div class="v">${openTag(v)}<br>${th ? `${th[1]} - ${th[2]}` : 'Dnes zavřeno'}</div><div class="week">${week}</div></div>
          <div class="kv"><div class="k">Adresa</div><div class="v">${esc(v.a)}</div></div>
        </div>
        <div class="minimap" id="mini"><span class="lock">${I.lock}</span></div>
        <div class="acts"><button data-act="call">${I.phone}Zavolat</button><button data-act="nav">${I.navC}Navigovat</button><button data-act="share">${I.share}Sdílet</button></div>
        <button class="report" data-act="report">${I.alert}Nahlásit problém</button>
      </div>
      <div id="tMenu" style="display:none"><div class="menu-empty"><b>Menu podniku</b>Kompletní menu najdeš přímo v podniku nebo na jeho webu.${v.w ? `<br><br><a href="${esc(v.w)}" target="_blank" rel="noopener" style="color:#E1582E;font-weight:600">Otevřít web podniku</a>` : ''}</div></div>
    </div>
  </div></section>`);
  push(el);

  const imgsEl = $('.imgs', el), dots = $$('.dots i', el);
  imgsEl.addEventListener('scroll', () => { const n = Math.round(imgsEl.scrollLeft / imgsEl.clientWidth); dots.forEach((d, k) => d.classList.toggle('on', k === n)); }, { passive: true });
  $$('.seg button', el).forEach(b => b.onclick = () => {
    $$('.seg button', el).forEach(x => x.classList.toggle('on', x === b));
    $('#tDeals', el).style.display = b.dataset.tab === 'deals' ? '' : 'none'; $('#tMenu', el).style.display = b.dataset.tab === 'menu' ? '' : 'none';
  });
  el.addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act, di = +(a.closest('[data-di]')?.dataset.di || 0);
    if (act === 'back') pop();
    if (act === 'cond') sheetConditions();
    if (act === 'book') { vib(); sheetBooking(v, di); }
    if (act === 'fav') { st.favs = fav() ? st.favs.filter(x => x !== v.i) : [v.i, ...st.favs]; save(); a.classList.toggle('on', fav()); if (selected !== v) pinSet(v, false); vib(); toast(fav() ? 'Přidáno do Můj seznam ❤️' : 'Odebráno z Můj seznam'); }
    if (act === 'allrv') { $('#rvs', el).innerHTML = v.rv.map(rv).join(''); a.remove(); }
    if (act === 'hours') a.classList.toggle('ex');
    if (act === 'nav') sheetNavigate(v);
    if (act === 'call') window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.n + ', ' + v.a)}`, '_blank');
    if (act === 'share') shareVenue(v);
    if (act === 'report') toast('Díky, na nahlášení se podíváme.');
  });
  setTimeout(() => {
    if (!el.isConnected) return;
    const mm = new maplibregl.Map({ container: $('#mini', el), style: mapStyle(), center: [v.ln, v.la], zoom: 15.6, interactive: false, attributionControl: false });
    mm.on('style.load', () => tintMap(mm));
    new maplibregl.Marker({ element: h('<div class="pin" style="width:96px;height:84px"><img src="assets/pins/large_pin.png" alt=""></div>'), anchor: 'bottom' }).setLngLat([v.ln, v.la]).addTo(mm);
    el._cleanup = () => mm.remove();
  }, 420);
}
function rv(r) {
  return `<div class="rv"><div class="nm">${esc(r[0])}.</div><div class="mt">${stars(5)}<span>・</span>${esc(czDate(r[1]))}<span>・</span><span class="ok">Ověřeno ${I.okCircle}</span></div><div class="tx">${esc(r[2])}</div></div>`;
}
function czDate(s) {
  const M = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];
  const m = s.match(/(\d+)\.\s*(\S+)\s+(\d{4})/); if (!m) return s;
  const k = M.indexOf(m[2]); return k < 0 ? s : `${pad(m[1])}. ${pad(k + 1)}. ${m[3]}`;
}
function shareVenue(v) {
  const url = `https://www.tastetown.app/cs/restaurace/praha/${v.n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${v.i}`;
  if (navigator.share) navigator.share({ title: v.n, text: `${v.n} – ${v.d.map(d => d.t).join(', ')} s TasteTown`, url }).catch(() => {});
  else { try { navigator.clipboard.writeText(url); toast('Odkaz zkopírován'); } catch (e) {} }
}

/* ================= MODÁLY: rezervace, uplatnění ================= */
function modal(cls, html) {
  const m = h(`<div class="modal ${cls}">${html}</div>`); $('#app').append(m);
  requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('in')));
  m.close = () => { m.classList.remove('in'); setTimeout(() => m.remove(), 430); };
  return m;
}
function modalBooked(v) {
  const m = modal('booked', `<div class="sp"></div>${I.okCircle.replace('<svg', '<svg class="ck"')}<h2>Deal zarezervován</h2>
    <p>Nezapomeň si rezervovat stůl nebo objednat jídlo s sebou.<br>Dobrou chuť!</p><div class="sp"></div>
    <button class="cta dark" data-a="my">Moje DEALY</button><button class="lnk" data-a="contact">Kontaktovat podnik</button>`);
  vib();
  m.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'); if (!a) return;
    if (a.dataset.a === 'my') { m.close(); popAll(); goTab('rezervace', 'booked'); }
    if (a.dataset.a === 'contact') window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.n + ', ' + v.a)}`, '_blank');
  });
}
function modalRedeem(b) {
  const v = byId[b.vi], d = v.d[b.di], date = new Date(b.ts);
  const m = modal('redeem', `<div class="ttl">Uplatnění dealu <span class="demo-pill">DEMO</span></div>
    <div class="rc"><img src="${IMG(v.im[1] || v.im[0], 750)}" alt="">
      <div class="rb">
        <div class="vn"><b>${esc(v.n)}</b>${I.info.replace('#8C94A6', '#8C94A6')}</div><div class="vc">${v.c.map(esc).join(' ・ ')}</div>
        <div class="dl"><b>${esc(d.t)}</b><p>${esc(d.ds)}</p></div>
        <div class="when"><span>${I.cal}${dfmt(date)}</span><span>${I.clock}${esc(b.time)}</span></div>
      </div>
      <div class="sa"><div class="swipe"><div class="fill"></div><div class="lbl">Přejeď pro uplatnění DEALU</div><div class="knob">${I.check}</div></div>
      <div class="demo-note">Ukázková verze aplikace. V podniku se deal neuplatňuje.</div></div>
    </div>
    <button class="close">Zavřít</button>`);
  $('.close', m).onclick = m.close;
  $('.vn svg', m).style.cssText = 'width:24px;height:24px;stroke:#8C94A6;fill:none;stroke-width:1.8';
  $('.vn svg', m).parentElement.onclick = sheetConditions;
  // posuvník
  const sw = $('.swipe', m), knob = $('.knob', sw), fill = $('.fill', sw), lbl = $('.lbl', sw);
  let x0 = null, x = 0, max = 0, done = false;
  const set = p => { knob.style.transform = `translateX(${p}px)`; fill.style.width = `${p + 64}px`; lbl.style.opacity = 1 - p / max; };
  sw.addEventListener('pointerdown', e => { if (done) return; max = sw.clientWidth - 64; x0 = e.clientX - x; sw.setPointerCapture(e.pointerId); knob.style.transition = fill.style.transition = 'none'; });
  sw.addEventListener('pointermove', e => { if (x0 === null) return; x = Math.min(max, Math.max(0, e.clientX - x0)); set(x); });
  const up = () => {
    if (x0 === null) return; x0 = null; knob.style.transition = fill.style.transition = 'transform .25s, width .25s';
    if (x > max * .82) { done = true; set(max); vib(); setTimeout(() => { finishRedeem(b); m.close(); }, 280); } else { x = 0; set(0); }
  };
  sw.addEventListener('pointerup', up); sw.addEventListener('pointercancel', up);
}
function finishRedeem(b) {
  st.booked = st.booked.filter(x => x.id !== b.id);
  const now = new Date();
  st.redeemed.unshift({ vi: b.vi, di: b.di, ts: now.getTime(), time: `${pad(now.getHours())}:${pad(now.getMinutes())}` }); save();
  const m = modal('applied', `${I.okCircle.replace('<svg', '<svg style="width:58px;height:58px"')}<h2>Úspěšně uplatněno</h2><div class="q">Jak se ti líbilo?</div>
    <div class="rate">${[1, 2, 3, 4, 5].map(n => `<button data-n="${n}">${I.star('#E2E5EB')}</button>`).join('')}</div>
    <textarea placeholder="Napiš nám svou zkušenost 😋"></textarea><div class="sp"></div><button class="cta grey" style="opacity:.6">Pokračovat</button>`);
  let r = 0;
  $$('.rate button', m).forEach(btn => btn.onclick = () => { r = +btn.dataset.n; $$('.rate button', m).forEach(x => x.classList.toggle('on', +x.dataset.n <= r)); $('.cta', m).className = 'cta'; vib(); });
  $('.cta', m).onclick = () => { m.close(); renderDeals('redeemed'); renderProfile(); if (r) toast('Díky za hodnocení! 🧡'); };
}

/* ================= REZERVACE ================= */
let dealsTab = 'booked';
function renderDeals(tab) {
  if (tab) dealsTab = tab;
  const s = $('#s-rezervace');
  const items = dealsTab === 'booked' ? st.booked : st.redeemed;
  s.innerHTML = `<div class="scroll"><div class="pad" style="padding-top:0">
    <div class="sw-head"><h1 class="h1 d" style="margin-top:6px">Moje dealy</h1>
    <div class="seg"><button data-t="booked" class="${dealsTab === 'booked' ? 'on' : ''}">Rezervované <span class="cnt">${st.booked.length}</span></button><button data-t="redeemed" class="${dealsTab === 'redeemed' ? 'on' : ''}">Uplatněné <span class="cnt">${st.redeemed.length}</span></button></div></div>
    <div id="dl"></div></div></div>`;
  const dl = $('#dl', s);
  if (!items.length) {
    dl.innerHTML = dealsTab === 'booked'
      ? '<div class="empty"><h3>Nemáš žádné rezervované DEALY</h3><p>Nezapomeň si DEAL rezervovat přímo na profilu podniku ještě před návštěvou!</p><button data-go="1">Chci objevovat</button></div>'
      : '<div class="empty"><h3>Zatím žádné uplatněné DEALY</h3><p>Až DEAL v podniku uplatníš, najdeš ho tady.</p><button data-go="1">Chci objevovat</button></div>';
  }
  items.forEach(b => {
    const v = byId[b.vi]; if (!v) return; const d = v.d[b.di] || v.d[0], dt = new Date(b.ts);
    const extra = dealsTab === 'booked'
      ? `<li>${I.gift}Ušetříš až ${d.s} Kč</li><li>${I.calFill}${dfmt(dt)}<span style="margin-left:auto;display:inline-flex;align-items:center;gap:6px;font-weight:500">${I.clock.replace('<svg', '<svg style="width:18px;height:18px;stroke:#222;stroke-width:2;fill:none"')}${esc(b.time)}</span></li><li>${I.place}${esc(d.m)}</li>`
      : `<li>${I.renew}${renewTxt(d.rw)}</li><li>${I.gift}Ušetřil jsi až ${d.s} Kč</li><li>${I.calFill}Uplatněno ${dfmt(dt)}<span style="margin-left:auto;display:inline-flex;align-items:center;gap:6px;font-weight:500">${I.clock.replace('<svg', '<svg style="width:18px;height:18px;stroke:#222;stroke-width:2;fill:none"')}${esc(b.time)}</span></li>`;
    const c = h(`<div class="mycard">
      <div class="top"><img src="${IMG(v.im[0], 750)}" loading="lazy" alt=""><div class="cap"><h3>${esc(v.n)}</h3><div class="c">${v.c.map(esc).join(' ・ ')}</div>
        <div class="m">${stars(v.r, '#fff').replace(/#E2E5EB/g, 'rgba(255,255,255,.4)')} <b>${v.r.toFixed(1)}</b> | ${I.loc('#fff').replace('<svg', '<svg style="width:15px;height:15px"')}${km(v)} | <b>${isOpen(v) ? 'Otevřeno' : 'Zavřeno'}</b></div></div></div>
      <div class="acts2"><button data-a="contact">${I.table}Kontakt</button><button data-a="nav">${I.navC}Navigovat</button><button data-a="share">${I.share}Sdílet</button></div>
      <div class="deal"><div class="hd"><h3>${esc(d.t)}</h3></div><p>${esc(d.ds)}</p><ul>${extra}</ul>
        ${dealsTab === 'booked' ? '<button class="cta" data-a="redeem">Uplatnit DEAL</button><button class="cta grey" data-a="cancel" style="margin-top:10px;height:52px;font-size:17px">Zrušit rezervaci</button>' : '<button class="cta" data-a="again">Rezervovat znovu</button>'}
      </div>
      <button class="report" data-a="report">${I.alert}Nahlásit problém</button>
    </div>`);
    $('.top', c).onclick = () => openDetail(v);
    c.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      const k = a.dataset.a;
      if (k === 'redeem') { vib(); modalRedeem(b); }
      if (k === 'cancel') { st.booked = st.booked.filter(x => x.id !== b.id); save(); renderDeals(); toast('Rezervace zrušena'); }
      if (k === 'again') sheetBooking(v, b.di || 0);
      if (k === 'nav') sheetNavigate(v);
      if (k === 'share') shareVenue(v);
      if (k === 'contact') window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.n + ', ' + v.a)}`, '_blank');
      if (k === 'report') toast('Díky, na nahlášení se podíváme.');
    });
    dl.append(c);
  });
  $$('.seg button', s).forEach(b => b.onclick = () => { vib(); renderDeals(b.dataset.t); });
  const go = $('[data-go]', s); if (go) go.onclick = () => goTab('objevuj');
}

/* ================= PROFIL ================= */
function savedTotal() { return st.redeemed.reduce((a, r) => a + ((byId[r.vi]?.d[r.di] || {}).s || 0), 0); }
function renderProfile() {
  const s = $('#s-profil');
  s.innerHTML = `<div class="scroll"><div class="pad">
    <h1 class="pname d" data-a="name">${esc(st.name)}</h1>
    <div class="stats"><div><small>Uplatněných</small><b>${st.redeemed.length}<em>${plural(st.redeemed.length, 'DEAL', 'DEALY', 'DEALŮ')}</em></b></div><div><small>Ušetřeno</small><b>${savedTotal()}<em>KČ</em></b></div></div>
    <button class="gift" data-a="invite"><span class="l1"></span><span class="l2"></span><span class="main"><small>POZVI PŘÍTELE A ZÍSKEJ ${I.chev.replace('<svg', '<svg style="width:20px;height:20px;stroke:#222;stroke-width:2.4;fill:none"')}</small><b>Měsíc zdarma</b><i>${I.gift.replace(/#EC6F00/g, '#000')}</i></span></button>
    <div class="label">Můj TasteTown</div>
    <div class="list">
      ${row('flame', 'Mám voucher', 'Využij kód a získej výhody', 'voucher')}
      ${row('heartF', 'Můj seznam', 'Tady se ti líbilo', 'favs')}
      ${row('hex', 'Nastavení', 'Přizpůsob si aplikaci', 'settings', true)}
    </div>
    <div class="label">Více informací</div>
    <div class="list">
      ${row('play', 'Jak to funguje ?', 'Prohlédni si aplikaci', 'video', false, true)}
      ${row('qm', 'Často kladené dotazy (FAQ)', 'Zde najdeš odpovědi', 'faq', false, true)}
      ${row('ex', 'Nahlásit technický problém', 'Napiš nám a my to opravíme', 'bug')}
      ${row('inf', 'Informace o aplikaci', 'Získej bližší informace', 'about')}
    </div>
    <div class="label">Tady nás najdeš</div>
    <div class="socials"><a href="https://www.instagram.com/tastetown_czsk/" target="_blank" rel="noopener">${I.ig}</a><a href="https://www.tiktok.com/@tastetown.cz" target="_blank" rel="noopener">${I.tt}</a><a href="https://www.facebook.com/people/TasteTown-app/61561382364268/" target="_blank" rel="noopener">${I.fb}</a><a href="https://www.youtube.com/@TasteTown_cz" target="_blank" rel="noopener">${I.yt}</a></div>
    <div class="ver">TasteTown · demo verze pro prezentace</div>
  </div></div>`;
  s.onclick = e => {
    const a = e.target.closest('[data-a]'); if (!a) return;
    const k = a.dataset.a;
    if (k === 'name') { const n = prompt('Jméno v profilu', st.name); if (n && n.trim()) { st.name = n.trim().slice(0, 28); save(); renderProfile(); } }
    if (k === 'invite') scrInvite();
    if (k === 'voucher') scrVoucher();
    if (k === 'favs') scrFavs();
    if (k === 'settings') scrSettings();
    if (k === 'video') playTutorial();
    if (k === 'faq') window.open('https://www.tastetown.app/cs/faq', '_blank');
    if (k === 'bug') toast('Díky! Technický problém nám napiš na support@tastetown.cz');
    if (k === 'about') scrAbout();
  };
}
function row(ic, t, sub, a, flag, ext) {
  return `<button class="row" data-a="${a}">${I[ic].replace('<svg', '<svg class="ic"')}<span class="tx"><b>${t}</b><span>${sub}</span></span>${flag ? '<img class="fl" src="assets/img/cz.png" alt="">' : ''}${ext ? I.ext.replace('<svg', '<svg class="ch" style="stroke:none;width:22px;height:22px"') : I.chev.replace('<svg', '<svg class="ch"')}</button>`;
}
function page(title, inner, sub = '') {
  const el = h(`<section class="screen"><div class="scroll"><div class="pad"><button class="back">${I.back}</button><h1 class="h1 d">${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}${inner}</div></div></section>`);
  $('.back', el).onclick = pop; push(el); return el;
}
function scrSettings() {
  const el = page('Nastavení', `<div class="label">Můj účet</div><div class="list">${row('smile', 'Uživatelský účet', 'Změň své osobní údaje', 'acc')}${row('card', 'Platby a předplatné', 'Nastav si, jak ti vyhovuje', 'pay')}</div>
    <div class="label">Nastavení aplikace</div><div class="list">${row('earth', 'Jazyk', 'Vyber si jazyk aplikace', 'lang', true)}</div>
    <button style="display:block;margin:70px auto 0;font-weight:500;font-size:19px" data-a="reset">Obnovit demo data</button>`);
  el.onclick = e => {
    const a = e.target.closest('[data-a]'); if (!a) return;
    if (a.dataset.a === 'pay') scrPay();
    if (a.dataset.a === 'acc') { const n = prompt('Jméno v profilu', st.name); if (n && n.trim()) { st.name = n.trim().slice(0, 28); save(); renderProfile(); toast('Uloženo'); } }
    if (a.dataset.a === 'lang') toast('Demo je dostupné v češtině 🇨🇿');
    if (a.dataset.a === 'reset' && confirm('Obnovit demo do výchozího stavu?')) { st = {}; seed(); renderProfile(); renderDeals('booked'); pop(); toast('Demo obnoveno'); }
  };
}
function scrPay() {
  page('Platby a předplatné', `<div class="sub" style="margin-top:-2px">Můžeš kdykoli zrušit</div>
    <div class="sub-card"><span class="l1"></span><span class="l2"></span><div class="main"><small>AKTIVNÍ PŘEDPLATNÉ</small><b>Neomezené DEALY</b></div></div>
    <div style="margin-top:22px">
      <div class="feat">${I.okCircle}<div><b>Demo přístup</b><p>Všechny dealy jsou <strong>odemčené</strong> a <strong>zdarma</strong> pro účely prezentace.</p></div></div>
      <div class="feat">${I.okCircle}<div><b>Neomezený počet dealů</b><p>Využij této nabídky a navštiv tolik podniků, kolik jen dokážeš!</p></div></div>
      <div class="feat">${I.okCircle}<div><b>Můžeš kdykoli zrušit</b><p>Následující předplatné můžeš kdykoli zrušit, jsme si ale jisti, že se ti nebude chtít.</p></div></div>
      <div class="feat" style="border:0">${I.okCircle}<div><b>TasteTown nezná hranic</b><p>DEALY můžeš využívat ve všech partnerských městech.</p></div></div>
    </div>
    <button class="cta outline" style="font-size:19px" onclick="window.open('https://www.tastetown.app/cs/pricing','_blank')">Změnit plán</button>`);
}
function scrVoucher() {
  const el = page('', `<div style="text-align:center;margin-top:16vh"><h2 class="d" style="font-size:34px">Zadej kód</h2><p class="sub" style="margin-top:8px;line-height:1.5">Zadej svůj kód a začni využívat neomezených výhod s TasteTown! 🥳</p>
    <div class="code">${'<input maxlength="1" inputmode="text" autocapitalize="characters">'.repeat(6)}</div></div>
    <button class="cta grey" style="margin-top:40px" data-a="go">Uplatnit kód</button>`);
  const ins = $$('.code input', el);
  ins.forEach((inp, k) => {
    inp.oninput = () => { inp.value = inp.value.slice(-1).toUpperCase(); if (inp.value && ins[k + 1]) ins[k + 1].focus(); $('[data-a=go]', el).className = ins.every(x => x.value) ? 'cta' : 'cta grey'; };
    inp.onkeydown = e => { if (e.key === 'Backspace' && !inp.value && ins[k - 1]) ins[k - 1].focus(); };
  });
  $('[data-a=go]', el).onclick = () => { if (ins.every(x => x.value)) { toast('Kód uplatněn – máš měsíc zdarma 🎉'); pop(); } };
}
function scrFavs() {
  const favs = st.favs.map(i => byId[i]).filter(Boolean);
  const el = page('Můj seznam', '<div id="fl" style="margin-top:20px"></div>');
  $('.h1', el).insertAdjacentHTML('beforeend', `<span style="float:right;margin-top:6px;width:52px;height:52px;border-radius:50%;background:#E6E8EE;display:inline-grid;place-items:center;font-family:Inter;font-weight:500;font-size:18px;color:#8C94A6">${favs.length}</span>`);
  const fl = $('#fl', el);
  favs.forEach(v => fl.append(vcard(v, { fav: true })));
  if (!favs.length) fl.innerHTML = '<div class="empty" style="padding-top:12vh"><h3>Zatím nic</h3><p>Srdíčkem na profilu podniku si ho uložíš sem.</p></div>';
}
function scrInvite() {
  const code = 'DEMO26';
  const el = page('Tvoje pozvánky', `<div class="seg"><button class="on">Odeslat</button><button>Přijmout <span class="cnt">0</span></button></div>
    <p class="sub" style="line-height:1.5">Pozvi svého přítele a získejte oba měsíc zdarma! Až pozvánku přítel přijme, najdeš ji v záložce "přijmout"</p>
    <div class="gift" style="height:auto;margin-top:22px"><span class="main" style="position:relative;inset:auto;display:block"><small>POZVI PŘÁTELE A ZÍSKEJ ZA KAŽDÉHO</small><b>Měsíc zdarma</b></span></div>
    <div class="steps" style="margin-top:14px">
      <div class="st"><span class="num">1</span><div><b>Sdílej svůj kód ${code}</b><p>Nasdílej svůj kód jednomu nebo více přátelům. Za každého máš měsíc zdarma.</p></div></div>
      <div class="st"><span class="num">2</span><div><b>Řekni příteli ať pozvánku přijme</b><p>Nejdříve musí tvůj přítel přijmout pozvánku, teprve poté můžeš aktivovat měsíc zdarma.</p></div></div>
      <div class="st"><span class="num">3</span><div><b>Aktivuj měsíc zdarma a objevuj</b><p>Aktivuj v záložce “přijmout” a využívej měsíc neomezených DEALŮ zdarma.</p></div></div>
    </div>
    <button class="cta dark" data-a="share">Sdílet</button>`);
  $('[data-a=share]', el).onclick = () => {
    const text = `Stáhni si TasteTown a s mým kódem ${code} máme oba měsíc zdarma! 🍔☕️`;
    if (navigator.share) navigator.share({ title: 'TasteTown', text, url: 'https://www.tastetown.app/cs' }).catch(() => {}); else toast(text);
  };
}
function scrAbout() {
  page('Informace o aplikaci', `<div class="list" style="margin-top:22px;padding:6px 20px">
    <div class="kv"><div class="k">Aplikace</div><div class="v">TasteTown – exkluzivní dealy v restauracích, kavárnách a barech</div></div>
    <div class="kv"><div class="k">Verze</div><div class="v">Demo pro prezentace (Praha)</div></div>
    <div class="kv"><div class="k">Podniky v demu</div><div class="v">${V.length} podniků · ${V.reduce((a, v) => a + v.d.length, 0)} dealů</div></div>
    <div class="kv"><div class="k">Stáhni si plnou verzi</div><div class="v"><a href="https://apps.apple.com/cz/app/tastetown/id6504561628" target="_blank" rel="noopener" style="color:#E1582E;font-weight:600">App Store</a> · <a href="https://play.google.com/store/apps/details?id=com.tastetown.tastetown" target="_blank" rel="noopener" style="color:#E1582E;font-weight:600">Google Play</a></div></div>
  </div><p class="sub" style="margin-top:18px;line-height:1.5">V demu jsou všechny dealy odemčené a bez limitu. Rezervace ani uplatnění se do podniků neposílají.</p>`);
}
function playTutorial() {
  const el = h(`<div class="video"><video src="assets/video/tutorial.mp4" playsinline autoplay controls></video><button>${I.x}</button></div>`);
  $('#app').append(el); $('button', el).onclick = () => el.remove();
}

/* ================= TABY ================= */
function goTab(t, sub) {
  popAll();
  $$('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  ['objevuj', 'profil', 'rezervace'].forEach(x => $('#s-' + x).classList.toggle('hidden', x !== t));
  if (t === 'rezervace') renderDeals(sub);
  if (t === 'profil') renderProfile();
  if (t === 'objevuj') setTimeout(() => map.resize(), 50);
}

/* ================= START ================= */
const BUILD = '20261019113649';
async function checkUpdate() {
  try {
    const r = await fetch(`version.json?t=${Date.now()}`, { cache: 'no-store' }); const { b } = await r.json();
    if (b && b !== BUILD && !BUILD.startsWith('__')) location.replace(`${location.pathname}?u=${b}`);
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkUpdate(); });
async function start() {
  checkUpdate();
  const r = await fetch('data/praha.json?v=f6bc4974'); V = await r.json();
  V.forEach(v => byId[v.i] = v);
  seed();
  buildExplore();
  $('#screens').append(h('<section class="screen hidden" id="s-profil"></section>'), h('<section class="screen hidden" id="s-rezervace"></section>'));
  $$('#tabbar button').forEach(b => b.onclick = () => { vib(); goTab(b.dataset.tab); });
  placeLoc();
  setTimeout(() => $('#splash').classList.add('out'), 500);
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => {
    const c = [p.coords.latitude, p.coords.longitude];
    if (Math.abs(c[0] - HOME[0]) < .35 && Math.abs(c[1] - HOME[1]) < .5) { user = c; applyFilters(); new maplibregl.Marker({ element: h('<div class="udot"></div>') }).setLngLat([c[1], c[0]]).addTo(map); }
  }, () => {}, { timeout: 8000, maximumAge: 6e5 });
}
start().catch(e => { console.error(e); document.body.insertAdjacentHTML('beforeend', '<p style="position:fixed;top:40%;width:100%;text-align:center">Nepodařilo se načíst data. Zkus to znovu.</p>'); });
})();
