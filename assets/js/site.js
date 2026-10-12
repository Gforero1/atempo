(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('reduced');

  /* Idioma: recordar la elección */
  document.querySelectorAll('.langs a').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('atempo-lang', a.getAttribute('data-lang')); } catch (e) {}
    });
  });
  try { if (!localStorage.getItem('atempo-lang')) localStorage.setItem('atempo-lang', root.lang); } catch (e) {}

  /* Cabecera con línea al hacer scroll */
  var top = document.querySelector('.top');
  if (top) {
    var onScroll = function () { top.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Barra de reserva en móvil */
  var dock = document.querySelector('.dock');
  var hero = document.querySelector('.hero');
  var contact = document.getElementById('contacto');
  if (dock && hero && contact && 'IntersectionObserver' in window) {
    var heroIn = true, contactIn = false;
    var sync = function () {
      var on = !heroIn && !contactIn;
      dock.classList.toggle('is-on', on);
      dock.setAttribute('aria-hidden', String(!on));
      dock.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(function (es) { heroIn = es[0].isIntersecting; sync(); }, { threshold: 0 }).observe(hero.querySelector('.hero__actions'));
    new IntersectionObserver(function (es) { contactIn = es[0].isIntersecting; sync(); }, { threshold: 0 }).observe(contact);
  }

  /* Aparición al entrar en pantalla */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* La línea que respira: una onda que se abre y se cierra cada 10 s (6 respiraciones por minuto) */
  var path = document.querySelector('.pulse__path');
  var btn = document.querySelector('.motion');
  if (path) {
    var W = 1200, MID = 40, CYCLE = 10000, paused = false, visible = true, raf = 0, t0 = performance.now(), offset = 0;
    var draw = function (now) {
      var t = now - t0 + offset;
      var breath = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / CYCLE);      // 0 → 1 → 0
      var amp = 4 + 22 * breath;
      var drift = t / 9000;                                               // la onda avanza muy despacio
      var d = 'M0 ' + MID;
      for (var x = 0; x <= W; x += 10) {
        var env = Math.sin((Math.PI * x) / W);                            // se apaga en los bordes
        var y = MID + Math.sin((x / W) * Math.PI * 5 - drift * Math.PI * 2) * amp * env;
        d += ' L' + x + ' ' + y.toFixed(2);
      }
      path.setAttribute('d', d);
    };
    var loop = function (now) { draw(now); raf = requestAnimationFrame(loop); };
    var start = function () { if (!raf && !paused && visible && !reduce) { t0 = performance.now(); raf = requestAnimationFrame(loop); } };
    var stop = function () { if (raf) { cancelAnimationFrame(raf); offset += performance.now() - t0; raf = 0; } };

    draw(performance.now() + CYCLE * 0.35); // estado inicial visible, también sin movimiento
    if (!reduce) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          visible = es[0].isIntersecting; visible ? start() : stop();
        }).observe(path.closest('.pulse'));
      }
      document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
      start();
    }
    if (btn) {
      btn.addEventListener('click', function () {
        paused = !paused;
        btn.setAttribute('aria-pressed', String(paused));
        btn.textContent = paused ? btn.getAttribute('data-play') : btn.getAttribute('data-pause');
        paused ? stop() : start();
      });
    }
  }

  /* Formulario */
  var form = document.querySelector('.form');
  if (form) {
    var status = form.querySelector('.form__status');
    var submit = form.querySelector('button[type="submit"]');
    var endpoint = form.getAttribute('data-endpoint');
    var email = form.getAttribute('data-email');
    var label = submit.textContent;

    var say = function (msg, err) { status.textContent = msg; status.classList.toggle('is-error', !!err); };

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (form.querySelector('[name="_gotcha"]').value) return;
      var bad = null;
      form.querySelectorAll('[required]').forEach(function (el) {
        var ok = el.type === 'radio' ? !!form.querySelector('[name="' + el.name + '"]:checked') : el.checkValidity();
        el.classList.toggle('is-invalid', !ok);
        if (!ok && !bad) bad = el;
      });
      if (bad) { bad.focus(); say(bad.validationMessage || (root.lang === 'en' ? 'Please complete the required fields.' : 'Completa los campos obligatorios.'), true); return; }

      var data = new FormData(form);
      if (endpoint) {
        submit.disabled = true; submit.textContent = form.getAttribute('data-sending'); say('');
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); say(form.getAttribute('data-ok')); })
          .catch(function () { say(form.getAttribute('data-fail') + ' ' + (email || ''), true); })
          .then(function () { submit.disabled = false; submit.textContent = label; });
      } else if (email) {
        var lines = [];
        data.forEach(function (v, k) { if (k.charAt(0) !== '_' && v) lines.push(k + ': ' + v); });
        location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(data.get('_subject')) + '&body=' + encodeURIComponent(lines.join('\n'));
      } else {
        say(root.lang === 'en' ? 'The form is not connected yet.' : 'El formulario aún no está conectado.', true);
      }
    });
  }
})();
