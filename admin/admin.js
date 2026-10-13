// Editor de la web de Atempo.
// Carga el contenido publicado, deja editarlo con vista previa en vivo y lo publica en /api/content.
import { renderPage, FONTS, BRAND_COLORS, contrast } from '/src/render.mjs?v=2';

const $ = (s, el = document) => el.querySelector(s);
const DRAFT_KEY = 'atempo-admin-draft';
const INTRO_KEY = 'atempo-admin-intro';

// ---------- definición del editor ----------
// k: ruta dentro del idioma (es/en). g: ruta global (settings, theme).
const ACCENT = 'Lo que pongas entre *asteriscos* sale en cursiva y en color.';
const HIDE = 'Si lo dejas vacío, no aparece en la web.';
const SECTIONS = [
  { group: 'Contenido de la web' },
  { id: 'hero', sec: 'hero', title: 'Inicio', fields: [
    { k: 'hero.title', label: 'Titular', type: 'area', accent: true },
    { k: 'hero.lead', label: 'Presentación', type: 'area' },
    { k: 'hero.cta', label: 'Botón principal' },
    { k: 'hero.cta2', label: 'Enlace junto al botón' },
    { k: 'hero.caption', label: 'Texto bajo la foto' },
    { k: 'hero.bpm', label: 'Texto junto a ♩ = 60' }
  ] },
  { id: 'photo', sec: 'hero', title: 'Tu foto', custom: 'photo' },
  { id: 'about', sec: 'about', title: 'Sobre mí', fields: [
    { k: 'about.kicker', label: 'Etiqueta pequeña' },
    { k: 'about.title', label: 'Titular', type: 'area', accent: true },
    { k: 'about.p1', label: 'Primer párrafo', type: 'area' },
    { k: 'about.p2', label: 'Segundo párrafo', type: 'area', hint: HIDE }
  ] },
  { id: 'creds', sec: 'about', title: 'Formación', fields: [
    { k: 'about.credsTitle', label: 'Título' },
    { k: 'about.creds', label: 'Títulos y másteres', type: 'list', add: 'Añadir formación' },
    { k: 'about.approachTitle', label: 'Título de enfoques' },
    { k: 'about.approaches', label: 'Enfoques con los que trabajas', type: 'list', add: 'Añadir enfoque', hint: HIDE }
  ] },
  { id: 'quote', sec: 'about', title: '¿Por qué Atempo?', fields: [
    { k: 'about.quoteTitle', label: 'Título' },
    { k: 'about.quote', label: 'Texto de la cita', type: 'area' },
    { k: 'about.quoteBy', label: 'Firma' }
  ] },
  { id: 'help', sec: 'help', title: 'Terapias', fields: [
    { k: 'help.kicker', label: 'Etiqueta pequeña' },
    { k: 'help.title', label: 'Titular', accent: true },
    { k: 'help.services', label: 'Tipos de terapia', type: 'cards', add: 'Añadir terapia', item: [
      { f: 'name', label: 'Nombre' }, { f: 'text', label: 'Descripción', type: 'area' }] }
  ] },
  { id: 'themes', sec: 'help', title: 'Temas que trabajas', fields: [
    { k: 'help.listTitle', label: 'Frase de introducción' },
    { k: 'help.list', label: 'Temas', type: 'list', add: 'Añadir tema' }
  ] },
  { id: 'steps', sec: 'steps', title: 'Cómo es el proceso', fields: [
    { k: 'steps.kicker', label: 'Etiqueta pequeña' },
    { k: 'steps.title', label: 'Titular', accent: true },
    { k: 'steps.items', label: 'Pasos', type: 'cards', add: 'Añadir paso', item: [
      { f: 'title', label: 'Paso' }, { f: 'text', label: 'Explicación', type: 'area' }] }
  ] },
  { id: 'fees', sec: 'fees', title: 'Honorarios', fields: [
    { k: 'fees.kicker', label: 'Etiqueta pequeña' },
    { k: 'fees.title', label: 'Titular', accent: true },
    { k: 'fees.items', label: 'Sesiones y precios', type: 'cards', add: 'Añadir sesión', item: [
      { f: 'name', label: 'Sesión' }, { f: 'price', label: 'Precio (por ejemplo, 65 €)' }] },
    { k: 'fees.note', label: 'Nota bajo los precios', hint: HIDE },
    { k: 'fees.hoursTitle', label: 'Título del horario' },
    { k: 'fees.hours', label: 'Horario', hint: HIDE },
    { k: 'fees.cancelTitle', label: 'Título de cancelaciones' },
    { k: 'fees.cancel', label: 'Política de cancelación', type: 'area', hint: HIDE }
  ] },
  { id: 'faq', sec: 'faq', title: 'Preguntas frecuentes', fields: [
    { k: 'faq.kicker', label: 'Etiqueta pequeña' },
    { k: 'faq.title', label: 'Titular', accent: true },
    { k: 'faq.items', label: 'Preguntas', type: 'cards', add: 'Añadir pregunta', item: [
      { f: 'q', label: 'Pregunta' }, { f: 'a', label: 'Respuesta', type: 'area' }] }
  ] },
  { id: 'contact', sec: 'contact', title: 'Contacto', fields: [
    { k: 'contact.kicker', label: 'Etiqueta pequeña' },
    { k: 'contact.title', label: 'Titular', type: 'area', accent: true },
    { k: 'contact.lead', label: 'Texto de invitación', type: 'area' },
    { k: 'contact.crisis', label: 'Aviso de urgencias', type: 'area' },
    { k: 'contact.direct', label: 'Frase antes de tu correo' }
  ] },
  { id: 'form', sec: 'contact', title: 'Formulario', fields: [
    { k: 'contact.name', label: 'Campo: nombre' },
    { k: 'contact.email', label: 'Campo: correo' },
    { k: 'contact.phone', label: 'Campo: teléfono' },
    { k: 'contact.where', label: 'Campo: país o ciudad' },
    { k: 'contact.type', label: 'Pregunta: tipo de terapia' },
    { k: 'contact.typeOpts', label: 'Opciones de tipo de terapia', type: 'list', add: 'Añadir opción' },
    { k: 'contact.language', label: 'Pregunta: idioma' },
    { k: 'contact.langOpts', label: 'Opciones de idioma', type: 'list', add: 'Añadir opción' },
    { k: 'contact.message', label: 'Campo: mensaje' },
    { k: 'contact.messageHint', label: 'Ayuda bajo el mensaje' },
    { k: 'contact.adult', label: 'Casilla: mayor de edad' },
    { k: 'contact.privacy', label: 'Casilla: privacidad', type: 'area', hint: 'Lo que pongas entre [corchetes] se convierte en el enlace a la política de privacidad.' },
    { k: 'contact.send', label: 'Botón de enviar' },
    { k: 'contact.ok', label: 'Mensaje cuando se envía bien', type: 'area' },
    { k: 'contact.fail', label: 'Mensaje si falla el envío', type: 'area' }
  ] },
  { id: 'menu', sec: 'hero', title: 'Menú de arriba', fields: [
    { k: 'nav.about', label: 'Sobre mí' }, { k: 'nav.help', label: 'Terapia' },
    { k: 'nav.fees', label: 'Honorarios' }, { k: 'nav.faq', label: 'Preguntas' },
    { k: 'nav.contact', label: 'Botón de primera consulta' }
  ] },
  { id: 'footer', sec: 'footer', title: 'Pie de página', fields: [
    { k: 'footer.line', label: 'Frase' }, { k: 'footer.legal', label: 'Enlace al aviso legal' }, { k: 'footer.top', label: 'Enlace para subir' }
  ] },
  { id: 'seo', sec: 'hero', title: 'Google y redes sociales', fields: [
    { k: 'meta.title', label: 'Título en Google y en la pestaña' },
    { k: 'meta.description', label: 'Descripción en Google', type: 'area', hint: 'Unas 150 letras. Es lo que se lee bajo el título en Google y al compartir el enlace.' },
    { k: 'meta.profession', label: 'Profesión (para Google y el aviso legal)' }
  ] },
  { group: 'Diseño' },
  { id: 'design', title: 'Tipografía y colores', custom: 'design' },
  { group: 'Ajustes' },
  { id: 'settings', title: 'Datos de contacto y legales', fields: [
    { g: 'settings.email', label: 'Tu correo', type: 'email', hint: 'Aparece en la web y en el aviso legal.' },
    { g: 'settings.instagram', label: 'Instagram', hint: 'Solo el usuario, sin @.' },
    { g: 'settings.colegiada', label: 'Número de colegiada', hint: HIDE },
    { g: 'settings.nif', label: 'NIF', hint: 'Solo aparece en el aviso legal.' },
    { g: 'settings.formspree', label: 'Código del formulario (Formspree)', hint: 'Es lo que hace que las consultas lleguen a tu correo. Lo configura Guillermo.' }
  ] },
  { id: 'history', title: 'Versiones anteriores', custom: 'history' }
];

// Qué sección abrir al tocar algo en la vista previa
const PICK = { '@photo': 'photo', 'about.creds': 'creds', 'about.quote': 'quote', 'help.list': 'themes', 'contact.form': 'form' };
for (const s of SECTIONS) for (const f of s.fields || []) if (f.k && !PICK[f.k]) PICK[f.k] = s.id;

// ---------- estado ----------
let state = null;       // contenido que se está editando
let published = null;   // contenido publicado
let publishedAt = null;
let lang = 'es';
let device = 'desktop';
const clone = o => JSON.parse(JSON.stringify(o));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const get = (o, path) => path.split('.').reduce((x, p) => x == null ? x : x[p], o);
const set = (o, path, v) => { const ps = path.split('.'); const last = ps.pop(); ps.reduce((x, p) => x[p], o)[last] = v; };
const target = f => f.g ? state : state[lang];
const fpath = f => f.g || f.k;

// ---------- API ----------
async function call(path, opts = {}) {
  const headers = Object.assign({ 'X-Atempo': '1' }, opts.headers || {});
  const r = await fetch('/api/' + path, Object.assign({}, opts, { headers, credentials: 'same-origin' }));
  let data = {};
  try { data = await r.json(); } catch {}
  if (!r.ok) { const e = new Error(data.error || String(r.status)); e.status = r.status; throw e; }
  return data;
}

// ---------- arranque ----------
init();
async function init() {
  try { await call('session'); start(); }
  catch (e) { showLogin(e.status === 503 ? 'El editor aún no está configurado en el servidor.' : ''); }
}

function showLogin(msg) {
  $('#login').hidden = false; $('#app').hidden = true;
  $('#login-msg').textContent = msg || '';
  $('#login-pass').focus();
}

$('#login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.disabled = true; $('#login-msg').textContent = '';
  try {
    await call('login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: $('#login-pass').value }) });
    $('#login-pass').value = '';
    start();
  } catch (err) {
    $('#login-msg').textContent = err.message === 'weak_secret' ? 'La contraseña configurada es demasiado corta (mínimo 12 caracteres). Pídele a Guillermo que la cambie.'
      : err.status === 429 ? 'Demasiados intentos. Espera 15 minutos y vuelve a probar.'
      : err.status === 401 ? 'Esa contraseña no es correcta.' : 'No se pudo entrar. Revisa tu conexión.';
  } finally { btn.disabled = false; }
});

async function start() {
  $('#login').hidden = true; $('#app').hidden = false;
  const data = await call('content');
  published = data.content; publishedAt = data.at;
  state = clone(published);
  const draft = readDraft();
  if (draft && !same(draft.content, published)) {
    state = draft.content;
    banner('Hemos recuperado los cambios que no llegaste a publicar.', [['Descartarlos', () => { state = clone(published); clearDraft(); afterBigChange(); hideBanner(); }]]);
  }
  try { if (localStorage.getItem(INTRO_KEY)) $('#intro').hidden = true; } catch {}
  buildSections();
  renderPreview(true);
  updateStatus();
}

// ---------- barra superior ----------
document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => {
  lang = b.dataset.lang;
  document.querySelectorAll('[data-lang]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  $('#lang-note').hidden = lang !== 'en';
  $('#view-live').href = lang === 'en' ? '/en/' : '/';
  buildSections(openId);
  renderPreview(true);
}));
document.querySelectorAll('[data-device]').forEach(b => b.addEventListener('click', () => {
  device = b.dataset.device;
  document.querySelectorAll('[data-device]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  $('#stage').classList.toggle('is-mobile', device === 'mobile');
}));
$('#intro-close').addEventListener('click', () => { $('#intro').hidden = true; try { localStorage.setItem(INTRO_KEY, '1'); } catch {} });
$('#peek').addEventListener('click', () => togglePeek());
function togglePeek(force) {
  const on = force !== undefined ? force : !$('#app').classList.contains('is-peek');
  $('#app').classList.toggle('is-peek', on);
  $('#peek').textContent = on ? 'Volver a editar' : 'Ver vista previa';
}

$('#logout').addEventListener('click', async () => {
  if (state && published && !same(state, published)) saveDraft();
  try { await call('logout', { method: 'POST' }); } catch {}
  location.reload();
});
$('#publish').addEventListener('click', publish);
async function publish() {
  const btn = $('#publish');
  btn.disabled = true; btn.textContent = 'Publicando…';
  try {
    const r = await call('content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: state }) });
    published = r.content; publishedAt = r.at; state = clone(published);
    clearDraft(); hideBanner();
    toast('Publicado. Ya está en tu web.');
    if (openId === 'history') buildSections(openId);
  } catch (e) {
    if (e.status === 401) { toast('Tu sesión ha caducado. Vuelve a entrar; tus cambios siguen guardados aquí.', true); showLogin(); }
    else toast('No se pudo publicar. Revisa tu conexión y vuelve a intentarlo.', true);
  } finally { btn.textContent = 'Publicar'; updateStatus(); }
}

let discardArmed = false;
$('#discard').addEventListener('click', () => {
  const b = $('#discard');
  if (!discardArmed) { discardArmed = true; b.textContent = '¿Seguro? Pulsa otra vez'; b.classList.add('btn--danger'); setTimeout(resetDiscard, 4000); return; }
  resetDiscard();
  state = clone(published); clearDraft(); hideBanner(); afterBigChange();
  toast('Cambios descartados.');
});
function resetDiscard() { discardArmed = false; const b = $('#discard'); b.textContent = 'Descartar cambios'; b.classList.remove('btn--danger'); }

window.addEventListener('beforeunload', e => { if (state && published && !same(state, published)) { e.preventDefault(); e.returnValue = ''; } });

function updateStatus() {
  const dirty = !same(state, published);
  $('#publish').disabled = !dirty;
  $('#discard').hidden = !dirty;
  const st = $('#status');
  st.classList.toggle('is-dirty', dirty);
  st.textContent = dirty ? 'Cambios sin publicar' : publishedAt ? 'Publicado ' + when(publishedAt) : 'Todo publicado';
}

function when(ts) {
  const d = new Date(ts), now = new Date();
  const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === now.toDateString()) return 'hoy a las ' + time;
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' }) + ', ' + time;
}

// ---------- secciones ----------
let openId = null;
function buildSections(keepOpen) {
  const nav = $('#sections');
  nav.innerHTML = '';
  for (const s of SECTIONS) {
    if (s.group) { const h = document.createElement('p'); h.className = 'group-title'; h.textContent = s.group; nav.append(h); continue; }
    const box = document.createElement('div');
    box.className = 'sec'; box.dataset.id = s.id;
    const head = document.createElement('button');
    head.type = 'button'; head.className = 'sec__head'; head.textContent = s.title;
    head.setAttribute('aria-expanded', 'false');
    head.addEventListener('click', () => openSection(openId === s.id ? null : s.id, true));
    const body = document.createElement('div');
    body.className = 'sec__body'; body.hidden = true;
    box.append(head, body);
    nav.append(box);
  }
  openSection(keepOpen || null, false);
}

function openSection(id, scrollPreview) {
  openId = id;
  document.querySelectorAll('.sec').forEach(box => {
    const on = box.dataset.id === id;
    box.classList.toggle('is-open', on);
    box.querySelector('.sec__head').setAttribute('aria-expanded', String(on));
    const body = box.querySelector('.sec__body');
    body.hidden = !on;
    body.innerHTML = '';
    if (on) fillSection(SECTIONS.find(s => s.id === id), body);
  });
  const s = SECTIONS.find(x => x.id === id);
  if (s && s.sec && scrollPreview) post({ atempo: 'scroll', sec: s.sec });
  if (id) { const el = document.querySelector(`.sec[data-id="${id}"]`); el && el.scrollIntoView({ block: 'nearest' }); }
}

function fillSection(s, body) {
  if (s.custom === 'photo') return photoEditor(body);
  if (s.custom === 'design') return designEditor(body);
  if (s.custom === 'history') return historyEditor(body);
  for (const f of s.fields) body.append(field(f));
}

// ---------- campos ----------
function field(f) {
  const wrap = document.createElement('div');
  wrap.className = 'fld';
  wrap.dataset.k = fpath(f);
  const id = 'f-' + fpath(f).replace(/\./g, '-');
  const label = document.createElement('label');
  label.className = 'fld__label'; label.textContent = f.label; label.htmlFor = id;
  wrap.append(label);

  if (f.type === 'list') { label.removeAttribute('for'); wrap.append(listEditor(f)); }
  else if (f.type === 'cards') { label.removeAttribute('for'); wrap.append(cardsEditor(f)); }
  else {
    const input = textInput(f.type === 'area' ? 'area' : f.type === 'email' ? 'email' : 'text', get(target(f), fpath(f)), v => change(f, v));
    input.id = id;
    wrap.append(input);
    if (f.accent) wrap.append(accentTool(input));
  }
  if (f.hint || f.accent) {
    const h = document.createElement('p'); h.className = 'fld__hint'; h.textContent = f.hint || ACCENT; wrap.append(h);
  }
  return wrap;
}

function textInput(type, value, onInput) {
  const el = document.createElement(type === 'area' ? 'textarea' : 'input');
  if (type !== 'area') el.type = type === 'email' ? 'email' : 'text';
  el.value = value || '';
  el.spellcheck = true;
  el.addEventListener('input', () => { if (type === 'area') grow(el); onInput(el.value); });
  if (type === 'area') { el.rows = 2; requestAnimationFrame(() => grow(el)); }
  return el;
}
function grow(el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 2 + 'px'; }

function accentTool(input) {
  const tools = document.createElement('div'); tools.className = 'tools';
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'tool'; b.innerHTML = 'Selecciona un trozo y pulsa: <em>resaltar</em>';
  b.addEventListener('click', () => {
    const { selectionStart: a, selectionEnd: z, value } = input;
    if (a === z) { input.focus(); return; }
    const sel = value.slice(a, z).replace(/\*/g, '');
    input.value = value.slice(0, a) + '*' + sel + '*' + value.slice(z);
    input.dispatchEvent(new Event('input'));
    input.focus(); input.setSelectionRange(a, a + sel.length + 2);
  });
  tools.append(b);
  return tools;
}

function change(f, v) {
  set(target(f), fpath(f), v);
  touched(f.g ? null : f.k);
}

function listEditor(f) {
  const box = document.createElement('div'); box.className = 'items';
  const arr = () => get(target(f), fpath(f));
  const draw = () => {
    box.innerHTML = '';
    arr().forEach((val, i) => {
      const row = document.createElement('div'); row.className = 'item';
      const input = textInput('text', val, v => { arr()[i] = v; touched(f.k); });
      input.setAttribute('aria-label', f.label + ' ' + (i + 1));
      row.append(input, controls(arr(), i, draw, f.k));
      box.append(row);
    });
    box.append(addBtn(f.add, () => { arr().push(''); draw(); touched(f.k); box.querySelectorAll('input')[arr().length - 1].focus(); }));
  };
  draw();
  return box;
}

function cardsEditor(f) {
  const box = document.createElement('div'); box.className = 'items';
  const arr = () => get(target(f), fpath(f));
  const draw = () => {
    box.innerHTML = '';
    arr().forEach((obj, i) => {
      const card = document.createElement('div'); card.className = 'item item--card';
      for (const sub of f.item) {
        const l = document.createElement('label'); l.className = 'fld';
        const s = document.createElement('span'); s.className = 'fld__label'; s.textContent = sub.label;
        const input = textInput(sub.type === 'area' ? 'area' : 'text', obj[sub.f], v => { arr()[i][sub.f] = v; touched(f.k); });
        l.append(s, input); card.append(l);
      }
      card.append(controls(arr(), i, draw, f.k));
      box.append(card);
    });
    box.append(addBtn(f.add, () => {
      arr().push(Object.fromEntries(f.item.map(x => [x.f, '']))); draw(); touched(f.k);
      const cards = box.querySelectorAll('.item--card'); cards[cards.length - 1].querySelector('input,textarea').focus();
    }));
  };
  draw();
  return box;
}

function controls(arr, i, redraw, k) {
  const c = document.createElement('div'); c.className = 'item__ctrls';
  const mk = (txt, label, fn, dis, cls) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'ic' + (cls ? ' ' + cls : '');
    b.textContent = txt; b.title = label; b.setAttribute('aria-label', label); b.disabled = dis;
    b.addEventListener('click', () => { fn(); redraw(); touched(k); }); return b;
  };
  c.append(
    mk('↑', 'Subir', () => arr.splice(i - 1, 0, arr.splice(i, 1)[0]), i === 0),
    mk('↓', 'Bajar', () => arr.splice(i + 1, 0, arr.splice(i, 1)[0]), i === arr.length - 1),
    mk('×', 'Quitar', () => arr.splice(i, 1), false, 'ic--del')
  );
  return c;
}

function addBtn(text, fn) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn--ghost add';
  b.textContent = '+ ' + text; b.addEventListener('click', fn); return b;
}

// ---------- foto ----------
function photoEditor(body) {
  const S = state.settings;
  const wrap = document.createElement('div'); wrap.className = 'photo';
  const img = document.createElement('div'); img.className = 'photo__img';
  const paint = () => {
    img.innerHTML = S.photo ? `<img src="/media/adelina-${S.photo}.jpg" alt="" style="object-position:50% ${S.photoFocus}%">` : 'Aún no hay foto';
  };
  paint();
  const actions = document.createElement('div'); actions.className = 'photo__actions';
  const up = document.createElement('label'); up.className = 'btn filebtn';
  up.innerHTML = `<span>${S.photo ? 'Cambiar foto' : 'Subir foto'}</span><input type="file" accept="image/*">`;
  const msg = document.createElement('p'); msg.className = 'fld__hint';
  msg.textContent = 'Mejor vertical y con buena luz. La reducimos sola para que la web cargue rápido.';
  up.querySelector('input').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    up.querySelector('span').textContent = 'Subiendo…';
    try {
      const blob = await toJpeg(file, 1600, 0.85);
      const r = await call('photo', { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: blob });
      S.photo = r.id; touched('@photo', true); paint();
      up.querySelector('span').textContent = 'Cambiar foto';
      rm.hidden = false;
    } catch (err) {
      up.querySelector('span').textContent = S.photo ? 'Cambiar foto' : 'Subir foto';
      toast(err.status === 401 ? 'Tu sesión ha caducado. Vuelve a entrar.' : 'No se pudo subir la foto. Prueba con otra o revisa tu conexión.', true);
    }
    e.target.value = '';
  });
  const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'linkbtn'; rm.textContent = 'Quitar foto';
  rm.hidden = !S.photo;
  rm.addEventListener('click', () => { S.photo = ''; touched('@photo', true); paint(); rm.hidden = true; up.querySelector('span').textContent = 'Subir foto'; });
  actions.append(up, rm, msg);
  wrap.append(img, actions);

  const focus = document.createElement('div'); focus.className = 'fld';
  focus.innerHTML = '<label class="fld__label" for="f-focus">Encuadre</label>';
  const range = document.createElement('input');
  range.type = 'range'; range.min = 0; range.max = 100; range.id = 'f-focus'; range.value = S.photoFocus;
  range.addEventListener('input', () => { S.photoFocus = Number(range.value); paint(); touched('@photo', true); });
  const labels = document.createElement('div'); labels.className = 'range-labels'; labels.innerHTML = '<span>Más arriba</span><span>Más abajo</span>';
  focus.append(range, labels);
  body.append(wrap, focus);
}

async function toJpeg(file, max, quality) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
  const src = bmp || await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = URL.createObjectURL(file); });
  const w = src.width, h = src.height, s = Math.min(1, max / Math.max(w, h));
  const c = document.createElement('canvas'); c.width = Math.round(w * s); c.height = Math.round(h * s);
  c.getContext('2d').drawImage(src, 0, 0, c.width, c.height);
  return new Promise((ok, ko) => c.toBlob(b => b ? ok(b) : ko(new Error('jpeg')), 'image/jpeg', quality));
}

// ---------- tipografía y colores ----------
const COLOR_FIELDS = [
  ['bg', 'Fondo'], ['panel', 'Bloques lavanda'], ['text', 'Texto y botones'], ['accent', 'Acento (detalles y cursivas)']
];
function designEditor(body) {
  const T = state.theme;
  const fl = document.createElement('div'); fl.className = 'fld';
  fl.innerHTML = '<span class="fld__label">Tipografía</span>';
  const fonts = document.createElement('div'); fonts.className = 'fonts';
  const sample = lang === 'en' ? 'Find <em>your own pace</em>' : 'Vuelve a <em>tu propio ritmo</em>';
  for (const [id, f] of Object.entries(FONTS)) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'font';
    b.setAttribute('aria-pressed', String(T.font === id));
    b.innerHTML = `<span class="font__sample">${sample}</span><span class="font__name">${f.label} · ${f.note}</span>`;
    b.querySelector('.font__sample').style.fontFamily = f.serif;
    b.addEventListener('click', () => { T.font = id; fonts.querySelectorAll('.font').forEach(x => x.setAttribute('aria-pressed', String(x === b))); touched(null, true); });
    fonts.append(b);
  }
  fl.append(fonts);

  const cl = document.createElement('div'); cl.className = 'fld';
  cl.innerHTML = '<span class="fld__label">Colores</span>';
  const colors = document.createElement('div'); colors.className = 'colors';
  const warn = document.createElement('p'); warn.className = 'warn';
  const check = () => {
    const c = T.colors, msgs = [];
    if (contrast(c.text, c.bg) < 4.5) msgs.push('El texto se lee poco sobre el fondo.');
    if (contrast(c.text, c.panel) < 4.5) msgs.push('El texto se lee poco sobre los bloques lavanda.');
    if (contrast(c.accent, c.bg) < 2.5) msgs.push('El acento casi no se distingue del fondo.');
    warn.textContent = msgs.join(' ');
  };
  for (const [key, label] of COLOR_FIELDS) {
    const row = document.createElement('div'); row.className = 'color';
    const pick = document.createElement('input'); pick.type = 'color'; pick.value = T.colors[key]; pick.setAttribute('aria-label', label);
    const name = document.createElement('span'); name.textContent = label;
    const hex = document.createElement('input'); hex.type = 'text'; hex.value = T.colors[key].toUpperCase(); hex.maxLength = 7; hex.setAttribute('aria-label', label + ' en código');
    const apply = v => { T.colors[key] = v; check(); touched(null, true); };
    pick.addEventListener('input', () => { hex.value = pick.value.toUpperCase(); apply(pick.value); });
    hex.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(hex.value)) { pick.value = hex.value; apply(hex.value); } });
    const hw = document.createElement('div'); hw.className = 'fld'; hw.append(hex);
    row.append(pick, name, hw); colors.append(row);
  }
  const reset = document.createElement('button'); reset.type = 'button'; reset.className = 'linkbtn'; reset.textContent = 'Volver a los colores de la marca';
  reset.addEventListener('click', () => { T.colors = Object.assign({}, BRAND_COLORS); openSection('design'); touched(null, true); });
  cl.append(colors, warn, reset);
  check();
  body.append(fl, cl);
}

// ---------- historial ----------
async function historyEditor(body) {
  body.innerHTML = '<p class="fld__hint">Cada vez que publicas se guarda la versión anterior. Puedes abrir una, revisarla en la vista previa y publicarla si quieres recuperarla.</p>';
  const list = document.createElement('div'); list.className = 'hist'; body.append(list);
  list.textContent = 'Cargando…';
  try {
    const { items } = await call('history');
    list.textContent = items.length ? '' : 'Todavía no hay versiones anteriores.';
    for (const it of items) {
      const row = document.createElement('div'); row.className = 'hist__row';
      const t = document.createElement('span'); t.textContent = it.original ? 'La web original (antes del editor)' : it.at ? 'Publicada ' + when(it.at) : 'Versión anterior';
      const b = document.createElement('button'); b.type = 'button'; b.className = 'linkbtn'; b.textContent = 'Abrir';
      b.addEventListener('click', async () => {
        const r = await call('history/' + it.id);
        state = r.content; afterBigChange();
        banner('Estás viendo: ' + t.textContent.toLowerCase() + '. Si la quieres recuperar, pulsa Publicar.', [['Volver a la actual', () => { state = clone(published); afterBigChange(); hideBanner(); }]]);
      });
      row.append(t, b); list.append(row);
    }
  } catch { list.textContent = 'No se pudo cargar el historial.'; }
}

// ---------- cambios y vista previa ----------
let saveTimer = null, renderTimer = null, pendingKeys = new Set(), fullPending = false;
function touched(k, full) {
  updateStatus();
  clearTimeout(saveTimer); saveTimer = setTimeout(saveDraft, 400);
  if (full || !k) fullPending = true; else pendingKeys.add(k);
  clearTimeout(renderTimer); renderTimer = setTimeout(flushPreview, 180);
}
function afterBigChange() { buildSections(openId); renderPreview(true); updateStatus(); }

function flushPreview() {
  if (fullPending) { fullPending = false; pendingKeys.clear(); return renderPreview(true); }
  const keys = [...pendingKeys]; pendingKeys.clear();
  const doc = $('#preview').contentDocument;
  if (!doc || !doc.body) return renderPreview(true);
  const fresh = new DOMParser().parseFromString(html(), 'text/html');
  for (const k of keys) {
    const olds = doc.querySelectorAll(`[data-k="${k}"]`), news = fresh.querySelectorAll(`[data-k="${k}"]`);
    if (olds.length !== news.length || !olds.length) return renderPreview(true);
    olds.forEach((o, i) => { const keep = o.classList.contains('is-picked'); o.replaceWith(news[i]); if (keep) news[i].classList.add('is-picked'); });
  }
  doc.title = fresh.title;
  // el botón fijo del móvil repite el texto del botón de consulta
  const dock = doc.querySelector('.dock'), fdock = fresh.querySelector('.dock');
  if (dock && fdock) dock.textContent = fdock.textContent;
}

function html() { return renderPage(state, lang, { edit: true, mode: 'abs', version: 'edit' }); }

let scrollY = 0;
function renderPreview(keepScroll) {
  const fr = $('#preview');
  try { scrollY = keepScroll && fr.contentWindow ? fr.contentWindow.scrollY : 0; } catch { scrollY = 0; }
  fr.onload = () => { try { fr.contentWindow.scrollTo(0, scrollY); } catch {} };
  fr.srcdoc = html();
}

function post(msg) { const w = $('#preview').contentWindow; if (w) w.postMessage(msg, '*'); }

window.addEventListener('message', e => {
  if (e.source !== $('#preview').contentWindow) return;
  const d = e.data || {};
  if (d.atempo === 'pick') pick(d.k);
});

function pick(k) {
  const id = PICK[k]; if (!id) return;
  togglePeek(false);
  if (openId !== id) openSection(id, false);
  post({ atempo: 'mark', k });
  const fld = document.querySelector(`.sec[data-id="${id}"] .fld[data-k="${k}"]`) || document.querySelector(`.sec[data-id="${id}"] .sec__body`);
  if (!fld) return;
  fld.scrollIntoView({ block: 'center', behavior: 'smooth' });
  const input = fld.querySelector('textarea,input');
  if (input) setTimeout(() => input.focus({ preventScroll: true }), 250);
  fld.classList.remove('is-flash'); void fld.offsetWidth; fld.classList.add('is-flash');
}

// ---------- borrador local (por si se cierra la pestaña sin publicar) ----------
function saveDraft() {
  try {
    if (same(state, published)) localStorage.removeItem(DRAFT_KEY);
    else localStorage.setItem(DRAFT_KEY, JSON.stringify({ at: Date.now(), content: state }));
  } catch {}
}
function readDraft() { try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch { return null; } }
function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch {} }

// ---------- avisos ----------
function banner(text, actions) {
  const b = $('#banner'); b.hidden = false; b.innerHTML = '';
  const p = document.createElement('span'); p.textContent = text;
  const row = document.createElement('div'); row.className = 'banner__row';
  for (const [label, fn] of actions) { const x = document.createElement('button'); x.type = 'button'; x.className = 'linkbtn'; x.textContent = label; x.addEventListener('click', fn); row.append(x); }
  b.append(p, row);
}
function hideBanner() { $('#banner').hidden = true; }
let toastTimer = null;
function toast(text, err) {
  const t = $('#toast'); t.textContent = text; t.classList.toggle('is-err', !!err); t.classList.add('is-on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('is-on'), err ? 6000 : 3200);
}
