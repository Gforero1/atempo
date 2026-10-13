// Render de la web de Atempo. Lo usan:
//  - las Functions de Cloudflare (web publicada, con el contenido guardado desde /admin),
//  - el editor /admin (vista previa en vivo),
//  - build.mjs (versión estática de respaldo).
// Todo texto que viene del contenido se escapa. Solo se permiten dos marcas:
//   *texto*  -> cursiva en el color de acento
//   [texto]  -> enlace a la política de privacidad (solo en ese campo)

export const FONTS = {
  newsreader: {
    label: 'Atempo',
    note: 'Newsreader y Albert Sans',
    serif: '"Newsreader",Georgia,serif',
    sans: '"Albert Sans",system-ui,sans-serif',
    faces: [
      ['Newsreader', 'newsreader-latin-opsz-normal.woff2', '200 800', 'normal'],
      ['Newsreader', 'newsreader-latin-opsz-italic.woff2', '200 800', 'italic'],
      ['Albert Sans', 'albert-sans-latin-wght-normal.woff2', '100 900', 'normal']
    ]
  },
  baskerville: {
    label: 'Como tu Canva',
    note: 'Libre Baskerville y Albert Sans',
    serif: '"Libre Baskerville",Georgia,serif',
    sans: '"Albert Sans",system-ui,sans-serif',
    scale: 0.86,
    faces: [
      ['Libre Baskerville', 'libre-baskerville-latin-400-normal.woff2', '400', 'normal'],
      ['Libre Baskerville', 'libre-baskerville-latin-400-italic.woff2', '400', 'italic'],
      ['Albert Sans', 'albert-sans-latin-wght-normal.woff2', '100 900', 'normal']
    ]
  },
  cormorant: {
    label: 'Clásica y ligera',
    note: 'Cormorant Garamond y Mulish',
    serif: '"Cormorant Garamond",Georgia,serif',
    sans: '"Mulish",system-ui,sans-serif',
    scale: 1.12,
    faces: [
      ['Cormorant Garamond', 'cormorant-garamond-latin-wght-normal.woff2', '300 700', 'normal'],
      ['Cormorant Garamond', 'cormorant-garamond-latin-wght-italic.woff2', '300 700', 'italic'],
      ['Mulish', 'mulish-latin-wght-normal.woff2', '200 1000', 'normal']
    ]
  },
  instrument: {
    label: 'Editorial moderna',
    note: 'Instrument Serif e Instrument Sans',
    serif: '"Instrument Serif",Georgia,serif',
    sans: '"Instrument Sans",system-ui,sans-serif',
    scale: 1.06,
    faces: [
      ['Instrument Serif', 'instrument-serif-latin-400-normal.woff2', '400', 'normal'],
      ['Instrument Serif', 'instrument-serif-latin-400-italic.woff2', '400', 'italic'],
      ['Instrument Sans', 'instrument-sans-latin-wght-normal.woff2', '400 700', 'normal']
    ]
  }
};

export const BRAND_COLORS = { bg: '#E6E1DA', panel: '#C2BECB', text: '#5A391E', accent: '#A5676F' };

// ---------- utilidades ----------
export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// Texto con *acento* (y opcionalmente [enlace])
function rich(s, link) {
  let out = esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
  if (link) out = out.replace(/\[([^\]]+)\]/g, '<a href="' + link + '">$1</a>');
  return out;
}
const roman = n => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n] || String(n + 1);
const plain = s => String(s || '').replace(/[*[\]]/g, '');

function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function lum(h) {
  return hexToRgb(h).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
}
export function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

// <style> con fuentes y colores elegidos en /admin
export function themeCss(theme, assetBase) {
  const f = FONTS[theme && theme.font] || FONTS.newsreader;
  const c = Object.assign({}, BRAND_COLORS, theme && theme.colors);
  const serifName = f.faces[0][0];
  const faces = f.faces.map(([fam, file, w, st]) =>
    `@font-face{font-family:"${fam}";src:url(${assetBase}assets/fonts/${file}) format("woff2");font-weight:${w};font-style:${st};font-display:swap${fam === serifName && f.scale ? `;size-adjust:${Math.round(f.scale * 100)}%` : ''}}`).join('\n');
  return `${faces}
:root{--linen:${c.bg};--lav:${c.panel};--brown:${c.text};--rose:${c.accent};--serif:${f.serif};--sans:${f.sans}}`;
}
function fontPreloads(theme, assetBase) {
  const f = FONTS[theme && theme.font] || FONTS.newsreader;
  return f.faces.filter(x => x[3] === 'normal')
    .map(x => `<link rel="preload" href="${assetBase}assets/fonts/${x[1]}" as="font" type="font/woff2" crossorigin>`).join('\n');
}

// Rutas: 'abs' para Cloudflare (raíz del dominio), 'rel' para la copia estática en una subcarpeta
export function paths(lang, mode) {
  const en = lang === 'en';
  if (mode === 'rel') {
    const up = en ? '../' : '';
    return { asset: up, es: en ? '../' : './', en: en ? './' : 'en/', legal: en ? 'privacy.html' : 'privacidad.html', home: './' };
  }
  return { asset: '/', es: '/', en: '/en/', legal: en ? '/en/privacy.html' : '/privacidad.html', home: en ? '/en/' : '/' };
}

export function photoUrl(settings, base) {
  return settings && settings.photo ? `${base}media/adelina-${settings.photo}.jpg` : '';
}

// ---------- página principal ----------
export function renderPage(content, lang, opts = {}) {
  const S = content.settings || {};
  const t = content[lang];
  const isEn = lang === 'en';
  const P = paths(lang, opts.mode || 'abs');
  const edit = !!opts.edit;
  const v = opts.version || '1';
  const k = key => edit ? ` data-k="${key}"` : '';
  const site = (S.site || '').replace(/\/$/, '');
  const photo = opts.photoUrl !== undefined ? opts.photoUrl : photoUrl(S, P.asset);
  const formAction = S.formspree ? `https://formspree.io/f/${esc(S.formspree)}` : '';
  const ig = S.instagram ? `https://instagram.com/${encodeURIComponent(S.instagram)}` : '';
  const focus = Math.max(0, Math.min(100, Number(S.photoFocus) || 30));
  const list = (arr, fn) => (arr || []).map(fn).join('');

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
${site ? `<link rel="canonical" href="${esc(site)}${isEn ? '/en/' : '/'}">
<link rel="alternate" hreflang="es" href="${esc(site)}/">
<link rel="alternate" hreflang="en" href="${esc(site)}/en/">
<link rel="alternate" hreflang="x-default" href="${esc(site)}/">
<meta property="og:url" content="${esc(site)}${isEn ? '/en/' : '/'}">
<meta property="og:image" content="${esc(site)}/assets/img/og.png">` : ''}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:locale" content="${isEn ? 'en_US' : 'es_ES'}">
<meta name="theme-color" content="${esc((content.theme && content.theme.colors && content.theme.colors.bg) || BRAND_COLORS.bg)}">
<link rel="icon" href="${P.asset}assets/img/favicon.svg" type="image/svg+xml">
${fontPreloads(content.theme, P.asset)}
<link rel="stylesheet" href="${P.asset}assets/css/site.css?v=${v}">
<style id="theme">${themeCss(content.theme, P.asset)}</style>
<script>document.documentElement.classList.add('js');</script>
${!isEn && !edit ? `<script>
try{if(!localStorage.getItem('atempo-lang')&&!/^es\\b/i.test(navigator.language||'')&&!/[?&]lang=es/.test(location.search)){location.replace('${P.en}'+location.hash)}}catch(e){}
</script>` : ''}
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Psychologist',
    name: 'Atempo Psychology',
    founder: { '@type': 'Person', name: 'Adelina Arocena', jobTitle: plain(t.meta.profession) },
    description: plain(t.meta.description),
    ...(site ? { url: site + (isEn ? '/en/' : '/') } : {}),
    areaServed: 'Worldwide',
    availableLanguage: ['es', 'en'],
    ...(S.email ? { email: S.email } : {}),
    ...(ig ? { sameAs: [ig] } : {})
  }).replace(/</g, '\\u003c')}</script>
</head>
<body>
<a class="skip" href="#main">${esc(t.ui.skip)}</a>

<header class="top" id="top">
  <a class="mark" href="${P.home}" aria-label="Atempo Psychology">
    <span class="mark__word">atempo</span><span class="mark__sub">psychology</span>
  </a>
  <nav class="top__nav" aria-label="${isEn ? 'Main' : 'Principal'}">
    <a href="#sobre"${k('nav.about')}>${esc(t.nav.about)}</a>
    <a href="#terapia"${k('nav.help')}>${esc(t.nav.help)}</a>
    <a href="#honorarios"${k('nav.fees')}>${esc(t.nav.fees)}</a>
    <a href="#preguntas"${k('nav.faq')}>${esc(t.nav.faq)}</a>
  </nav>
  <div class="top__end">
    <nav class="langs" aria-label="Idioma / Language">
      <a href="${P.es}" hreflang="es" lang="es" data-lang="es"${isEn ? '' : ' class="is-on" aria-current="page"'}><span class="langs__long">Español</span><span class="langs__short">ES</span></a>
      <a href="${P.en}" hreflang="en" lang="en" data-lang="en"${isEn ? ' class="is-on" aria-current="page"' : ''}><span class="langs__long">English</span><span class="langs__short">EN</span></a>
    </nav>
    <a class="btn btn--small" href="#contacto"${k('nav.contact')}>${esc(t.nav.contact)}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-open="${isEn ? 'Menu' : 'Menú'}" data-close="${isEn ? 'Close' : 'Cerrar'}">${isEn ? 'Menu' : 'Menú'}</button>
  </div>
</header>
<nav class="sheet" id="menu" aria-label="${isEn ? 'Sections' : 'Secciones'}">
  <ol>
    <li><a href="#sobre">${esc(t.nav.about)}</a></li>
    <li><a href="#terapia">${esc(t.nav.help)}</a></li>
    <li><a href="#honorarios">${esc(t.nav.fees)}</a></li>
    <li><a href="#preguntas">${esc(t.nav.faq)}</a></li>
  </ol>
  <a class="btn" href="#contacto">${esc(t.nav.contact)}</a>
</nav>

<main id="main">

<section class="hero" aria-labelledby="hero-title" data-sec="hero">
  <div class="hero__text">
    <h1 id="hero-title"${k('hero.title')}>${rich(t.hero.title)}</h1>
    <p class="hero__lead"${k('hero.lead')}>${rich(t.hero.lead)}</p>
    <p class="hero__actions">
      <a class="btn" href="#contacto"${k('hero.cta')}>${esc(t.hero.cta)}</a>
      <a class="link" href="#pasos"${k('hero.cta2')}>${esc(t.hero.cta2)}</a>
    </p>
  </div>
  <figure class="portrait">
    <div class="portrait__frame"${k('@photo')}>
      ${photo
        ? `<img src="${esc(photo)}" alt="${esc(t.hero.photoAlt)}" width="800" height="1000" fetchpriority="high" style="object-position:50% ${focus}%">`
        : `<div class="portrait__empty" role="img" aria-label="${esc(t.ui.photoPlaceholder)}"><span>${esc(t.ui.photoPlaceholder)}</span></div>`}
    </div>
    <figcaption${k('hero.caption')}>${esc(t.hero.caption)}</figcaption>
  </figure>
  <div class="pulse" aria-hidden="true">
    <svg class="pulse__svg" viewBox="0 0 1200 80" preserveAspectRatio="none"><path class="pulse__path" d="M0 40 L1200 40"/></svg>
  </div>
  <div class="pulse__row">
  <p class="pulse__label"><span class="pulse__note"><svg viewBox="0 0 10 22" width="12" height="26" aria-hidden="true"><ellipse cx="4" cy="18" rx="3.6" ry="2.6" transform="rotate(-22 4 18)" fill="currentColor"/><path d="M7.2 17V1" stroke="currentColor" stroke-width="1.2"/></svg> = 60</span> <span${k('hero.bpm')}>${esc(t.hero.bpm)}</span></p>
  <button class="motion" type="button" aria-pressed="false" data-pause="${esc(t.ui.pause)}" data-play="${esc(t.ui.play)}">${esc(t.ui.pause)}</button>
  </div>
</section>

<section class="about" id="sobre" aria-labelledby="about-title" data-sec="about">
  <p class="kicker"${k('about.kicker')}>${esc(t.about.kicker)}</p>
  <h2 id="about-title" class="about__title reveal"${k('about.title')}>${rich(t.about.title)}</h2>
  <div class="about__body reveal">
    <p${k('about.p1')}>${rich(t.about.p1)}</p>
    ${t.about.p2 ? `<p${k('about.p2')}>${rich(t.about.p2)}</p>` : ''}
  </div>
  <aside class="about__creds reveal" aria-labelledby="creds-title"${k('about.creds')}>
    <h3 id="creds-title">${esc(t.about.credsTitle)}</h3>
    <ul>${list(t.about.creds, c => `<li>${esc(c)}</li>`)}</ul>
    ${(t.about.approaches || []).length ? `<h3 class="about__sub">${esc(t.about.approachTitle)}</h3><ul>${list(t.about.approaches, a => `<li>${esc(a)}</li>`)}</ul>` : ''}
    ${S.colegiada ? `<p class="about__num">${esc(t.ui.regNo)} ${esc(S.colegiada)}</p>` : ''}
  </aside>
  <figure class="quote reveal"${k('about.quote')}>
    <h3 class="quote__title">${esc(t.about.quoteTitle)}</h3>
    <blockquote><p>${rich(t.about.quote)}</p></blockquote>
    <figcaption>${esc(t.about.quoteBy)}</figcaption>
  </figure>
</section>

<section class="help" id="terapia" aria-labelledby="help-title" data-sec="help">
  <div class="help__head">
    <p class="kicker"${k('help.kicker')}>${esc(t.help.kicker)}</p>
    <h2 id="help-title"${k('help.title')}>${rich(t.help.title)}</h2>
  </div>
  <ol class="movements"${k('help.services')}>
    ${list(t.help.services, (s, i) => `<li class="movement reveal">
      <span class="movement__n">${roman(i)}.</span>
      <h3>${esc(s.name)}</h3>
      <p>${rich(s.text)}</p>
    </li>`)}
  </ol>
  <div class="themes reveal"${k('help.list')}>
    <h3>${esc(t.help.listTitle)}</h3>
    <ul class="themes__list">${list(t.help.list, l => `<li>${esc(l)}</li>`)}</ul>
  </div>
</section>

<section class="steps" id="pasos" aria-labelledby="steps-title" data-sec="steps">
  <div class="steps__head">
    <p class="kicker"${k('steps.kicker')}>${esc(t.steps.kicker)}</p>
    <h2 id="steps-title"${k('steps.title')}>${rich(t.steps.title)}</h2>
  </div>
  <ol class="staff"${k('steps.items')}>
    ${list(t.steps.items, (s, i) => `<li class="reveal"><span class="staff__n">${i + 1}</span><h3>${esc(s.title)}</h3><p>${rich(s.text)}</p></li>`)}
  </ol>
</section>

<section class="fees" id="honorarios" aria-labelledby="fees-title" data-sec="fees">
  <p class="kicker"${k('fees.kicker')}>${esc(t.fees.kicker)}</p>
  <h2 id="fees-title"${k('fees.title')}>${rich(t.fees.title)}</h2>
  <dl class="programme"${k('fees.items')}>
    ${list(t.fees.items, f => `<div class="programme__row"><dt>${esc(f.name)}</dt><dd>${esc(f.price)}</dd></div>`)}
  </dl>
  ${t.fees.note ? `<p class="fees__note"${k('fees.note')}>${rich(t.fees.note)}</p>` : ''}
  ${t.fees.hours || t.fees.cancel ? `<dl class="fees__info">
    ${t.fees.hours ? `<div${k('fees.hours')}><dt>${esc(t.fees.hoursTitle)}</dt><dd>${rich(t.fees.hours)}</dd></div>` : ''}
    ${t.fees.cancel ? `<div${k('fees.cancel')}><dt>${esc(t.fees.cancelTitle)}</dt><dd>${rich(t.fees.cancel)}</dd></div>` : ''}
  </dl>` : ''}
</section>

<section class="faq" id="preguntas" aria-labelledby="faq-title" data-sec="faq">
  <div class="faq__head">
    <p class="kicker"${k('faq.kicker')}>${esc(t.faq.kicker)}</p>
    <h2 id="faq-title"${k('faq.title')}>${rich(t.faq.title)}</h2>
  </div>
  <div class="faq__list"${k('faq.items')}>
    ${list(t.faq.items, f => `<details><summary>${esc(f.q)}</summary><p>${rich(f.a)}</p></details>`)}
  </div>
</section>

<section class="contact" id="contacto" aria-labelledby="contact-title" data-sec="contact">
  <div class="contact__intro">
    <p class="kicker"${k('contact.kicker')}>${esc(t.contact.kicker)}</p>
    <h2 id="contact-title"${k('contact.title')}>${rich(t.contact.title)}</h2>
    <p${k('contact.lead')}>${rich(t.contact.lead)}</p>
    ${S.email ? `<p class="contact__direct">${esc(t.contact.direct)} <a href="mailto:${esc(S.email)}">${esc(S.email)}</a></p>` : ''}
    <p class="contact__crisis"${k('contact.crisis')}>${rich(t.contact.crisis)}</p>
  </div>
  <form class="form"${formAction ? ` action="${formAction}"` : ''} method="post" data-endpoint="${formAction}" data-email="${esc(S.email)}"
        data-sending="${esc(t.contact.sending)}" data-ok="${esc(t.contact.ok)}" data-fail="${esc(t.contact.fail)}" novalidate${k('contact.form')}>
    <input type="hidden" name="_subject" value="${isEn ? 'New enquiry from atempo' : 'Nueva consulta desde atempo'}">
    <input type="hidden" name="idioma_web" value="${lang}">
    <p class="form__hp" aria-hidden="true"><label>Web <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
    <div class="field"><label for="f-name">${esc(t.contact.name)}</label><input id="f-name" name="nombre" autocomplete="name" required></div>
    <div class="field"><label for="f-email">${esc(t.contact.email)}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="f-phone">${esc(t.contact.phone)}</label><input id="f-phone" name="telefono" type="tel" autocomplete="tel"></div>
    <div class="field"><label for="f-where">${esc(t.contact.where)}</label><input id="f-where" name="pais_ciudad" autocomplete="country-name"></div>
    <fieldset class="choice">
      <legend>${esc(t.contact.type)}</legend>
      ${list(t.contact.typeOpts, (o, i) => `<label><input type="radio" name="tipo" value="${esc(o)}"${i === 0 ? ' required' : ''}> <span>${esc(o)}</span></label>`)}
    </fieldset>
    <fieldset class="choice">
      <legend>${esc(t.contact.language)}</legend>
      ${list(t.contact.langOpts, (o, i) => `<label><input type="radio" name="idioma" value="${esc(o)}"${i === 0 ? ' checked' : ''}> <span>${esc(o)}</span></label>`)}
    </fieldset>
    <div class="field field--wide"><label for="f-msg">${esc(t.contact.message)}</label><textarea id="f-msg" name="mensaje" rows="3" maxlength="800" aria-describedby="f-msg-hint"></textarea><small id="f-msg-hint">${esc(t.contact.messageHint)}</small></div>
    <label class="check"><input type="checkbox" name="mayor_de_18" value="si" required> <span>${esc(t.contact.adult)}</span></label>
    <label class="check"><input type="checkbox" name="privacidad" value="si" required> <span>${rich(t.contact.privacy, P.legal)}</span></label>
    <p class="form__end"><button class="btn" type="submit">${esc(t.contact.send)}</button></p>
    <p class="form__status" role="status" aria-live="polite"></p>
  </form>
</section>

</main>

<a class="dock" href="#contacto" tabindex="-1" aria-hidden="true">${esc(t.nav.contact)}</a>

<footer class="foot" data-sec="footer">
  <p class="mark mark--foot"><span class="mark__word">atempo</span><span class="mark__sub">psychology</span></p>
  <p${k('footer.line')}>${esc(t.footer.line)}</p>
  <p class="foot__links">
    <a href="${P.legal}">${esc(t.footer.legal)}</a>
    ${ig ? `<a href="${ig}" rel="noopener">Instagram</a>` : ''}
    <a href="#top">${esc(t.footer.top)}</a>
  </p>
  <p class="foot__small">© ${new Date().getFullYear()} Adelina Arocena</p>
</footer>

<script src="${P.asset}assets/js/site.js?v=${v}" defer></script>
${edit ? EDIT_SCRIPT : ''}
</body>
</html>
`;
}

// En la vista previa del editor: resaltar lo editable y avisar al editor al tocarlo
const EDIT_SCRIPT = `<style>
[data-k]{cursor:pointer;outline:1px dashed transparent;outline-offset:4px;transition:outline-color .15s}
[data-k]:hover{outline-color:var(--rose)}
[data-k].is-picked{outline:2px solid var(--rose)}
.reveal{opacity:1!important;transform:none!important}
.dock{display:none!important}
</style>
<script>
(function(){
  document.addEventListener('click',function(e){
    var a=e.target.closest('a,button,summary,input,label');
    var el=e.target.closest('[data-k]');
    if(a&&!el){ if(a.tagName!=='SUMMARY'){e.preventDefault();} return; }
    if(el){e.preventDefault();parent.postMessage({atempo:'pick',k:el.getAttribute('data-k')},'*');}
  },true);
  document.addEventListener('submit',function(e){e.preventDefault();},true);
  window.addEventListener('message',function(e){
    var d=e.data||{};
    if(d.atempo==='scroll'){var s=document.querySelector('[data-sec="'+d.sec+'"]');if(s)s.scrollIntoView({block:'start'});}
    if(d.atempo==='mark'){document.querySelectorAll('.is-picked').forEach(function(x){x.classList.remove('is-picked')});
      var m=document.querySelector('[data-k="'+d.k+'"]');if(m){m.classList.add('is-picked');if(d.reveal)m.scrollIntoView({block:'center'});}}
  });
  parent.postMessage({atempo:'ready',y:0},'*');
})();
</script>`;

// ---------- aviso legal ----------
export function renderLegal(content, lang, opts = {}) {
  const S = content.settings || {};
  const t = content[lang];
  const isEn = lang === 'en';
  const P = paths(lang, opts.mode || 'abs');
  const v = opts.version || '1';
  const pend = isEn ? '[pending]' : '[pendiente]';
  const prof = esc(t.meta.profession);
  const reg = S.colegiada ? esc(S.colegiada) : pend;
  const nif = S.nif ? esc(S.nif) : pend;
  const mail = S.email ? esc(S.email) : pend;
  const body = isEn ? `
<h1>Legal notice and privacy policy</h1>
<h2>Who is responsible</h2>
<p>Adelina Arocena, ${prof}, registration no. ${reg}. Tax ID: ${nif}. Contact: ${mail}.</p>
<h2>What data this website collects</h2>
<p>Only what you send through the contact form: name, email, optional phone, your country or city, the type of therapy and language you’re interested in, and an optional short message. Please don’t include health details you’d rather share in session.</p>
<h2>What it is used for</h2>
<p>Solely to reply to your enquiry and arrange a first session. It is not used for marketing and is not shared with third parties, except the form provider that delivers the message by email, which acts as a data processor.</p>
<h2>Legal basis and retention</h2>
<p>Your consent when sending the form. Data is kept only while needed to handle your enquiry, or for as long as the therapeutic relationship and applicable law require.</p>
<h2>Your rights</h2>
<p>You can request access, rectification, erasure, restriction, portability or objection by writing to ${mail}. You may also lodge a complaint with the Spanish Data Protection Agency (aepd.es).</p>
<h2>Cookies</h2>
<p>This website does not use tracking or advertising cookies. It only stores your language choice in your browser.</p>`
  : `
<h1>Aviso legal y política de privacidad</h1>
<h2>Responsable</h2>
<p>Adelina Arocena, ${prof}, n.º de colegiada ${reg}. NIF: ${nif}. Contacto: ${mail}.</p>
<h2>Qué datos recoge esta web</h2>
<p>Solo los que envías por el formulario de contacto: nombre, correo, teléfono opcional, país o ciudad, el tipo de terapia y el idioma que te interesan y un mensaje breve opcional. Te pedimos que no incluyas datos de salud que prefieras contar en sesión.</p>
<h2>Para qué se usan</h2>
<p>Únicamente para responder a tu consulta y coordinar una primera sesión. No se usan con fines comerciales ni se ceden a terceros, salvo al proveedor del formulario que entrega el mensaje por correo, que actúa como encargado del tratamiento.</p>
<h2>Base legal y conservación</h2>
<p>Tu consentimiento al enviar el formulario. Los datos se conservan solo mientras hagan falta para atender tu consulta, o el tiempo que exijan la relación terapéutica y la ley aplicable.</p>
<h2>Tus derechos</h2>
<p>Puedes pedir acceso, rectificación, supresión, limitación, portabilidad u oposición escribiendo a ${mail}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
<h2>Cookies</h2>
<p>Esta web no usa cookies de seguimiento ni publicidad. Solo guarda en tu navegador el idioma que eliges.</p>`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${isEn ? 'Legal notice and privacy' : 'Aviso legal y privacidad'} · Atempo Psychology</title>
<meta name="robots" content="noindex">
<link rel="icon" href="${P.asset}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${P.asset}assets/css/site.css?v=${v}">
<style>${themeCss(content.theme, P.asset)}</style>
</head>
<body class="legal">
<header class="top"><a class="mark" href="${P.home}"><span class="mark__word">atempo</span><span class="mark__sub">psychology</span></a></header>
<main class="legal__body">${body}
<p><a class="link" href="${P.home}">${isEn ? '← Back to the website' : '← Volver a la web'}</a></p>
</main>
</body>
</html>
`;
}

// ---------- validación del contenido que llega desde /admin ----------
// Solo se aceptan las claves que existen en el contenido por defecto, con los mismos tipos.
const MAX = { str: 3000, item: 400, list: 40 };
function cleanStr(v, d, max) {
  if (typeof v !== 'string') return d;
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max || MAX.str);
}
function cleanLike(v, d) {
  if (typeof d === 'string') return cleanStr(v, d);
  if (typeof d === 'number') { const n = Number(v); return Number.isFinite(n) ? n : d; }
  if (Array.isArray(d)) {
    if (!Array.isArray(v)) return d;
    const tpl = d[0];
    return v.slice(0, MAX.list).map(x => typeof tpl === 'string' || tpl === undefined
      ? cleanStr(x, '', MAX.item)
      : cleanLike(x, Object.fromEntries(Object.keys(tpl).map(k2 => [k2, '']))));
  }
  if (d && typeof d === 'object') {
    const out = {};
    for (const key of Object.keys(d)) out[key] = cleanLike(v && typeof v === 'object' ? v[key] : undefined, d[key]);
    return out;
  }
  return d;
}
export function sanitize(input, defaults) {
  const c = cleanLike(input || {}, defaults);
  const s = c.settings;
  s.email = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,}$/i.test(s.email.trim()) ? s.email.trim() : '';
  const fs = s.formspree.trim().match(/(?:formspree\.io\/f\/)?([a-z0-9]{6,16})\/?$/i);
  s.formspree = fs ? fs[1] : '';
  s.instagram = s.instagram.trim().replace(/^.*instagram\.com\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '');
  if (!/^[A-Za-z0-9._]{1,30}$/.test(s.instagram)) s.instagram = '';
  s.colegiada = s.colegiada.trim().slice(0, 30);
  s.nif = s.nif.trim().slice(0, 20);
  s.site = /^https:\/\/[a-z0-9.-]+(\/)?$/i.test(s.site.trim()) ? s.site.trim().replace(/\/$/, '') : defaults.settings.site;
  s.photo = /^[0-9a-z]{1,20}$/i.test(s.photo) ? s.photo : '';
  s.photoFocus = Math.max(0, Math.min(100, Math.round(s.photoFocus)));
  if (!FONTS[c.theme.font]) c.theme.font = defaults.theme.font;
  for (const key of Object.keys(BRAND_COLORS)) {
    if (!/^#[0-9a-f]{6}$/i.test(c.theme.colors[key])) c.theme.colors[key] = BRAND_COLORS[key];
  }
  return c;
}
