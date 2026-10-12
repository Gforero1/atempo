// Genera index.html (español), en/index.html (inglés) y las páginas legales.
// Uso: node build.js
const fs = require('fs');
const path = require('path');
const S = require('./src/strings');
const C = require('./src/config');

const v = Date.now().toString(36); // versión para refrescar caché de css/js
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function page(t) {
  const isEn = t.lang === 'en';
  const up = isEn ? '../' : '';           // ruta relativa a la raíz
  const legal = isEn ? 'privacy.html' : 'privacidad.html';
  const otherHref = isEn ? '../' : 'en/';
  const contactPrivacy = t.contact.privacy.replace('/{{lp}}' + (isEn ? 'privacy.html' : 'privacidad.html'), legal);
  const emailLine = C.email
    ? `<p class="contact__direct">${t.contact.direct} <a href="mailto:${C.email}">${C.email}</a></p>`
    : '';

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t.title}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="canonical" href="${C.site}${t.path}">
<link rel="alternate" hreflang="es" href="${C.site}/">
<link rel="alternate" hreflang="en" href="${C.site}/en/">
<link rel="alternate" hreflang="x-default" href="${C.site}/">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${C.site}${t.path}">
<meta property="og:image" content="${C.site}/assets/img/og.png">
<meta property="og:locale" content="${isEn ? 'en_US' : 'es_ES'}">
<meta name="theme-color" content="#E6E1DA">
<link rel="icon" href="${up}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="${up}assets/fonts/newsreader-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${up}assets/fonts/albert-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${up}assets/css/site.css?v=${v}">
<script>document.documentElement.classList.add('js');</script>
${isEn ? '' : `<script>
/* Primera visita: si el navegador no está en español, se muestra la versión en inglés */
try{if(!localStorage.getItem('atempo-lang')&&!/^es\\b/i.test(navigator.language||'')&&!/[?&]lang=es/.test(location.search)){location.replace('en/'+location.hash)}}catch(e){}
</script>`}
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Psychologist',
    name: 'Atempo Psychology',
    founder: { '@type': 'Person', name: 'Adelina Arocena', jobTitle: isEn ? 'Clinical Psychologist' : 'Psicóloga clínica' },
    description: t.description,
    url: C.site + t.path,
    areaServed: 'Worldwide',
    availableLanguage: ['es', 'en'],
    ...(C.email ? { email: C.email } : {})
  })}</script>
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>

<header class="top" id="top">
  <a class="mark" href="${isEn ? './' : './'}" aria-label="Atempo Psychology">
    <span class="mark__word">atempo</span><span class="mark__sub">psychology</span>
  </a>
  <nav class="top__nav" aria-label="${isEn ? 'Main' : 'Principal'}">
    <a href="#sobre">${t.nav.about}</a>
    <a href="#terapia">${t.nav.help}</a>
    <a href="#honorarios">${t.nav.fees}</a>
    <a href="#preguntas">${t.nav.faq}</a>
  </nav>
  <div class="top__end">
    <a class="lang" href="${otherHref}" hreflang="${t.other.code}" lang="${t.other.code}" data-lang="${t.other.code}" aria-label="${t.other.label}">${t.other.short}</a>
    <a class="btn btn--small" href="#contacto">${t.nav.contact}</a>
  </div>
</header>

<main id="main">

<section class="hero" aria-labelledby="hero-title">
  <div class="hero__text">
    <dl class="entry">
      <dt><span class="entry__term">${t.hero.term}</span> <span class="entry__gram">${t.hero.gram}</span></dt>
      <dd>${t.hero.def}</dd>
    </dl>
    <h1 id="hero-title">${t.hero.title}</h1>
    <p class="hero__lead">${t.hero.lead}</p>
    <p class="hero__actions">
      <a class="btn" href="#contacto">${t.hero.cta}</a>
      <a class="link" href="#pasos">${t.hero.cta2}</a>
    </p>
  </div>
  <figure class="portrait">
    <div class="portrait__frame">
      <!-- FOTO: sustituir por <img src="${up}assets/img/adelina.jpg" alt="Adelina Arocena" width="800" height="1000"> -->
      <div class="portrait__empty" role="img" aria-label="${t.hero.photo}"><span>${t.hero.photo}</span></div>
    </div>
    <figcaption>${t.hero.caption}</figcaption>
  </figure>
  <div class="pulse" aria-hidden="true">
    <svg class="pulse__svg" viewBox="0 0 1200 80" preserveAspectRatio="none"><path class="pulse__path" d="M0 40 L1200 40"/></svg>
  </div>
  <div class="pulse__row">
  <p class="pulse__label"><span class="pulse__note"><svg viewBox="0 0 10 22" width="7" height="15" aria-hidden="true"><ellipse cx="4" cy="18" rx="3.6" ry="2.6" transform="rotate(-22 4 18)" fill="currentColor"/><path d="M7.2 17V1" stroke="currentColor" stroke-width="1.2"/></svg> = 60</span> <span>${t.hero.bpm}</span></p>
  <button class="motion" type="button" aria-pressed="false" data-pause="${t.motion.pause}" data-play="${t.motion.play}">${t.motion.pause}</button>
  </div>
</section>

<section class="about" id="sobre" aria-labelledby="about-title">
  <p class="kicker">${t.about.kicker}</p>
  <h2 id="about-title" class="about__title reveal">${t.about.title}</h2>
  <div class="about__body reveal">
    <p>${t.about.p1}</p>
    <p>${t.about.p2}</p>
  </div>
  <aside class="about__creds reveal" aria-labelledby="creds-title">
    <h3 id="creds-title">${t.about.credsTitle}</h3>
    <ul>${t.about.creds.map(c => `<li>${c}</li>`).join('')}</ul>
    ${C.colegiada ? `<p class="about__num">${isEn ? 'Registration no.' : 'N.º de colegiada'} ${C.colegiada}</p>` : ''}
  </aside>
  <figure class="quote reveal">
    <h3 class="quote__title">${t.about.quoteTitle}</h3>
    <blockquote><p>${t.about.quote}</p></blockquote>
    <figcaption>${t.about.quoteBy}</figcaption>
  </figure>
</section>

<section class="help" id="terapia" aria-labelledby="help-title">
  <div class="help__head">
    <p class="kicker">${t.help.kicker}</p>
    <h2 id="help-title">${t.help.title}</h2>
  </div>
  <ol class="movements">
    ${t.help.services.map(s => `<li class="movement reveal">
      <span class="movement__n">${s.n}.</span>
      <h3>${s.name}</h3>
      <p>${s.text}</p>
    </li>`).join('\n    ')}
  </ol>
  <div class="themes reveal">
    <h3>${t.help.listTitle}</h3>
    <ul class="themes__list">${t.help.list.map(l => `<li>${l}</li>`).join('')}</ul>
    <p class="themes__for"><span>${t.help.forTitle}</span> ${t.help.forList.map(f => `<em>${f}</em>`).join(', ')}.</p>
  </div>
</section>

<section class="steps" id="pasos" aria-labelledby="steps-title">
  <div class="steps__head">
    <p class="kicker">${t.steps.kicker}</p>
    <h2 id="steps-title">${t.steps.title}</h2>
  </div>
  <ol class="staff">
    ${t.steps.items.map((s, i) => `<li class="reveal"><span class="staff__n">${i + 1}</span><h3>${s.t}</h3><p>${s.d}</p></li>`).join('\n    ')}
  </ol>
</section>

<section class="fees" id="honorarios" aria-labelledby="fees-title">
  <p class="kicker">${t.fees.kicker}</p>
  <h2 id="fees-title">${t.fees.title}</h2>
  <dl class="programme">
    ${t.fees.items.map(f => `<div class="programme__row"><dt>${f.name}</dt><dd>${f.price}</dd></div>`).join('\n    ')}
  </dl>
  <p class="fees__note">${t.fees.note}</p>
</section>

<section class="faq" id="preguntas" aria-labelledby="faq-title">
  <div class="faq__head">
    <p class="kicker">${t.faq.kicker}</p>
    <h2 id="faq-title">${t.faq.title}</h2>
  </div>
  <div class="faq__list">
    ${t.faq.items.map(f => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n    ')}
  </div>
</section>

<section class="contact" id="contacto" aria-labelledby="contact-title">
  <div class="contact__intro">
    <p class="kicker">${t.contact.kicker}</p>
    <h2 id="contact-title">${t.contact.title}</h2>
    <p>${t.contact.lead}</p>
    ${emailLine}
    <p class="contact__crisis">${t.contact.crisis}</p>
  </div>
  <form class="form" action="${C.formEndpoint || '#'}" method="post" data-endpoint="${esc(C.formEndpoint)}" data-email="${esc(C.email)}"
        data-sending="${esc(t.contact.sending)}" data-ok="${esc(t.contact.ok)}" data-fail="${esc(t.contact.fail)}" novalidate>
    <input type="hidden" name="_subject" value="${isEn ? 'New enquiry from atempo' : 'Nueva consulta desde atempo'}">
    <input type="hidden" name="idioma_web" value="${t.lang}">
    <p class="form__hp" aria-hidden="true"><label>Web <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
    <div class="field"><label for="f-name">${t.contact.name}</label><input id="f-name" name="nombre" autocomplete="name" required></div>
    <div class="field"><label for="f-email">${t.contact.email}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="f-phone">${t.contact.phone}</label><input id="f-phone" name="telefono" type="tel" autocomplete="tel"></div>
    <fieldset class="choice">
      <legend>${t.contact.type}</legend>
      ${t.contact.typeOpts.map((o, i) => `<label><input type="radio" name="tipo" value="${esc(o)}"${i === 0 ? ' required' : ''}> <span>${o}</span></label>`).join('')}
    </fieldset>
    <fieldset class="choice">
      <legend>${t.contact.language}</legend>
      ${t.contact.langOpts.map((o, i) => `<label><input type="radio" name="idioma" value="${esc(o)}"${i === 0 ? ' checked' : ''}> <span>${o}</span></label>`).join('')}
    </fieldset>
    <div class="field field--wide"><label for="f-msg">${t.contact.message}</label><textarea id="f-msg" name="mensaje" rows="3" maxlength="800" aria-describedby="f-msg-hint"></textarea><small id="f-msg-hint">${t.contact.messageHint}</small></div>
    <label class="check"><input type="checkbox" name="mayor_de_18" value="si" required> <span>${t.contact.adult}</span></label>
    <label class="check"><input type="checkbox" name="privacidad" value="si" required> <span>${contactPrivacy}</span></label>
    <p class="form__end"><button class="btn" type="submit">${t.contact.send}</button></p>
    <p class="form__status" role="status" aria-live="polite"></p>
  </form>
</section>

</main>

<footer class="foot">
  <p class="mark mark--foot"><span class="mark__word">atempo</span><span class="mark__sub">psychology</span></p>
  <p>${t.footer.line}</p>
  <p class="foot__links">
    <a href="${legal}">${t.footer.legal}</a>
    ${C.instagram ? `<a href="https://instagram.com/${C.instagram}" rel="noopener">Instagram</a>` : ''}
    <a href="#top">${t.footer.top}</a>
  </p>
  <p class="foot__small">© ${new Date().getFullYear()} Adelina Arocena</p>
</footer>

<script src="${up}assets/js/site.js?v=${v}" defer></script>
</body>
</html>
`;
}

function legalPage(isEn) {
  const t = isEn ? S.en : S.es;
  const up = isEn ? '../' : '';
  const pend = isEn ? '[pending]' : '[pendiente]';
  const body = isEn ? `
<h1>Legal notice and privacy policy</h1>
<h2>Who is responsible</h2>
<p>Adelina Arocena, clinical psychologist${C.colegiada ? `, registration no. ${C.colegiada}` : ` (registration no. ${pend})`}. Tax ID: ${pend}. Contact: ${C.email || pend}.</p>
<h2>What data this website collects</h2>
<p>Only what you send through the contact form: name, email, optional phone, the type of therapy and language you’re interested in, and an optional short message. Please don’t include health details you’d rather share in session.</p>
<h2>What it is used for</h2>
<p>Solely to reply to your enquiry and arrange a first session. It is not used for marketing and is not shared with third parties, except the form provider that delivers the message by email, which acts as a data processor.</p>
<h2>Legal basis and retention</h2>
<p>Your consent when sending the form. Data is kept only while needed to handle your enquiry, or for as long as the therapeutic relationship and applicable law require.</p>
<h2>Your rights</h2>
<p>You can request access, rectification, erasure, restriction, portability or objection by writing to ${C.email || pend}. You may also lodge a complaint with the Spanish Data Protection Agency (aepd.es).</p>
<h2>Cookies</h2>
<p>This website does not use tracking or advertising cookies. It only stores your language choice in your browser.</p>`
  : `
<h1>Aviso legal y política de privacidad</h1>
<h2>Responsable</h2>
<p>Adelina Arocena, psicóloga clínica${C.colegiada ? `, n.º de colegiada ${C.colegiada}` : ` (n.º de colegiada ${pend})`}. NIF: ${pend}. Contacto: ${C.email || pend}.</p>
<h2>Qué datos recoge esta web</h2>
<p>Solo los que envías por el formulario de contacto: nombre, correo, teléfono opcional, el tipo de terapia y el idioma que te interesan y un mensaje breve opcional. Te pedimos que no incluyas datos de salud que prefieras contar en sesión.</p>
<h2>Para qué se usan</h2>
<p>Únicamente para responder a tu consulta y coordinar una primera sesión. No se usan con fines comerciales ni se ceden a terceros, salvo al proveedor del formulario que entrega el mensaje por correo, que actúa como encargado del tratamiento.</p>
<h2>Base legal y conservación</h2>
<p>Tu consentimiento al enviar el formulario. Los datos se conservan solo mientras hagan falta para atender tu consulta, o el tiempo que exijan la relación terapéutica y la ley aplicable.</p>
<h2>Tus derechos</h2>
<p>Puedes pedir acceso, rectificación, supresión, limitación, portabilidad u oposición escribiendo a ${C.email || pend}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
<h2>Cookies</h2>
<p>Esta web no usa cookies de seguimiento ni publicidad. Solo guarda en tu navegador el idioma que eliges.</p>`;
  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${isEn ? 'Legal notice and privacy' : 'Aviso legal y privacidad'} · Atempo Psychology</title>
<meta name="robots" content="noindex">
<link rel="icon" href="${up}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${up}assets/css/site.css?v=${v}">
</head>
<body class="legal">
<header class="top"><a class="mark" href="./"><span class="mark__word">atempo</span><span class="mark__sub">psychology</span></a></header>
<main class="legal__body">${body}
<p><a class="link" href="./">${isEn ? '← Back to the website' : '← Volver a la web'}</a></p>
</main>
</body>
</html>
`;
}

const root = __dirname;
fs.mkdirSync(path.join(root, 'en'), { recursive: true });
fs.writeFileSync(path.join(root, 'index.html'), page(S.es));
fs.writeFileSync(path.join(root, 'en/index.html'), page(S.en));
fs.writeFileSync(path.join(root, 'privacidad.html'), legalPage(false));
fs.writeFileSync(path.join(root, 'en/privacy.html'), legalPage(true));
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url><loc>${C.site}/</loc><xhtml:link rel="alternate" hreflang="en" href="${C.site}/en/"/><xhtml:link rel="alternate" hreflang="es" href="${C.site}/"/></url>
<url><loc>${C.site}/en/</loc><xhtml:link rel="alternate" hreflang="es" href="${C.site}/"/><xhtml:link rel="alternate" hreflang="en" href="${C.site}/en/"/></url>
</urlset>
`);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${C.site}/sitemap.xml\n`);
console.log('ok', v);
