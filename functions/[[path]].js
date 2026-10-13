// Cloudflare Pages Function: sirve la web con el contenido guardado y la API del editor (/admin).
// Necesita en el proyecto de Pages:
//   - un KV namespace enlazado como  ATEMPO
//   - un secreto  ADMIN_PASSWORD  (la contraseña del editor)
// Las rutas que pasan por aquí están en /_routes.json; el resto (css, js, fuentes, /admin) es estático.

import DEFAULT from '../content/default.json';
import { renderPage, renderLegal, sanitize } from '../src/render.mjs';

const COOKIE = 'atempo_s';
const SESSION_DAYS = 14;
const MAX_BODY = 400 * 1024;
const MAX_PHOTO = 3 * 1024 * 1024;
const KEEP_HISTORY = 30;
const KEEP_PHOTOS = 8;
const MAX_FAILS = 8;

const SEC_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export async function onRequest(ctx) {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const p = url.pathname;
  try {
    if (p.startsWith('/api/')) return await api(request, env, p.slice(5));
    if (p.startsWith('/media/')) return await media(env, p);
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    if (p === '/en') return Response.redirect(url.origin + '/en/' + url.search, 301);
    const content = await loadContent(env);
    const v = (env.CF_PAGES_COMMIT_SHA || '1').slice(0, 8);
    let html;
    if (p === '/') html = renderPage(content, 'es', { version: v });
    else if (p === '/en/') html = renderPage(content, 'en', { version: v });
    else if (p === '/privacidad.html') html = renderLegal(content, 'es', { version: v });
    else if (p === '/en/privacy.html') html = renderLegal(content, 'en', { version: v });
    else return ctx.next();
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate', 'X-Frame-Options': 'SAMEORIGIN', ...SEC_HEADERS }
    });
  } catch (err) {
    return json({ error: 'server' }, 500);
  }
}

// ---------- contenido ----------
async function loadContent(env) {
  if (!env.ATEMPO) return DEFAULT;
  const raw = await env.ATEMPO.get('content');
  if (!raw) return DEFAULT;
  try { return sanitize(JSON.parse(raw), DEFAULT); } catch { return DEFAULT; }
}

// ---------- fotos ----------
async function media(env, p) {
  const m = p.match(/^\/media\/adelina-([0-9a-z]{1,20})\.jpg$/);
  if (!m || !env.ATEMPO) return new Response('Not found', { status: 404 });
  const buf = await env.ATEMPO.get('p:' + m[1], 'arrayBuffer');
  if (!buf) return new Response('Not found', { status: 404 });
  return new Response(buf, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable', ...SEC_HEADERS } });
}

// ---------- API del editor ----------
async function api(request, env, route) {
  if (!env.ATEMPO || !env.ADMIN_PASSWORD) return json({ error: 'not_configured' }, 503);
  const method = request.method;

  // Protección CSRF: toda escritura lleva una cabecera propia que un formulario externo no puede enviar
  if (method !== 'GET' && request.headers.get('X-Atempo') !== '1') return json({ error: 'forbidden' }, 403);

  if (route === 'login' && method === 'POST') return login(request, env);
  if (route === 'logout' && method === 'POST') return json({ ok: true }, 200, { 'Set-Cookie': cookie('', 0) });

  if (!(await authed(request, env))) return json({ error: 'auth' }, 401);

  if (route === 'session' && method === 'GET') return json({ ok: true });

  if (route === 'content' && method === 'GET') {
    const raw = await env.ATEMPO.getWithMetadata('content');
    const content = raw.value ? sanitize(JSON.parse(raw.value), DEFAULT) : DEFAULT;
    return json({ content, at: raw.metadata && raw.metadata.at || null, defaults: DEFAULT });
  }

  if (route === 'content' && method === 'POST') {
    const body = await readJson(request);
    if (!body) return json({ error: 'bad_body' }, 400);
    const clean = sanitize(body.content, DEFAULT);
    const at = Date.now();
    const prev = await env.ATEMPO.getWithMetadata('content');
    // La versión que se sustituye pasa al historial (la primera vez, la versión original de la web)
    await env.ATEMPO.put('h:' + String(at).padStart(15, '0'), prev.value || JSON.stringify(DEFAULT), { metadata: { at: prev.metadata && prev.metadata.at || null, original: !prev.value } });
    await trim(env, 'h:', KEEP_HISTORY);
    await env.ATEMPO.put('content', JSON.stringify(clean), { metadata: { at } });
    return json({ ok: true, at, content: clean });
  }

  if (route === 'history' && method === 'GET') {
    const list = await env.ATEMPO.list({ prefix: 'h:' });
    const items = list.keys.map(k => ({ id: k.name.slice(2), at: k.metadata && k.metadata.at, original: !!(k.metadata && k.metadata.original) })).reverse();
    return json({ items });
  }

  const hm = route.match(/^history\/([0-9]{1,15})$/);
  if (hm && method === 'GET') {
    const raw = await env.ATEMPO.get('h:' + hm[1].padStart(15, '0'));
    if (!raw) return json({ error: 'not_found' }, 404);
    return json({ content: sanitize(JSON.parse(raw), DEFAULT) });
  }

  if (route === 'photo' && method === 'POST') {
    if ((request.headers.get('Content-Type') || '') !== 'image/jpeg') return json({ error: 'type' }, 415);
    const len = Number(request.headers.get('Content-Length') || 0);
    if (len > MAX_PHOTO) return json({ error: 'size' }, 413);
    const buf = await request.arrayBuffer();
    const b = new Uint8Array(buf);
    if (buf.byteLength > MAX_PHOTO || buf.byteLength < 1000 || b[0] !== 0xFF || b[1] !== 0xD8 || b[2] !== 0xFF) return json({ error: 'type' }, 415);
    const id = Date.now().toString(36);
    await env.ATEMPO.put('p:' + id, buf);
    await trim(env, 'p:', KEEP_PHOTOS, await currentPhoto(env));
    return json({ ok: true, id });
  }

  return json({ error: 'not_found' }, 404);
}

async function currentPhoto(env) {
  try { const c = JSON.parse(await env.ATEMPO.get('content') || '{}'); return c.settings && c.settings.photo ? 'p:' + c.settings.photo : ''; } catch { return ''; }
}

// Borra las entradas más antiguas de un prefijo, conservando `keep` (y la que esté en uso)
async function trim(env, prefix, keep, protect) {
  const list = await env.ATEMPO.list({ prefix });
  const names = list.keys.map(k => k.name).sort();
  const extra = names.length - keep;
  for (let i = 0; i < extra; i++) if (names[i] !== protect) await env.ATEMPO.delete(names[i]);
}

// ---------- sesión ----------
async function login(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const rlKey = 'rl:' + ip;
  const fails = Number(await env.ATEMPO.get(rlKey) || 0);
  if (fails >= MAX_FAILS) return json({ error: 'too_many' }, 429);
  const body = await readJson(request);
  const pass = body && typeof body.password === 'string' ? body.password : '';
  const ok = pass.length > 0 && await sameSecret(pass, env.ADMIN_PASSWORD);
  if (!ok) {
    await env.ATEMPO.put(rlKey, String(fails + 1), { expirationTtl: 900 });
    return json({ error: 'wrong' }, 401);
  }
  await env.ATEMPO.delete(rlKey);
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const token = exp + '.' + await sign(env, 'atempo:' + exp);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie(token, SESSION_DAYS * 86400) });
}

async function authed(request, env) {
  const c = (request.headers.get('Cookie') || '').split(/;\s*/).find(x => x.startsWith(COOKIE + '='));
  if (!c) return false;
  const [exp, sig] = c.slice(COOKIE.length + 1).split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return sameSecret(sig, await sign(env, 'atempo:' + exp));
}

function cookie(value, maxAge) {
  return `${COOKIE}=${value}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

async function sign(env, msg) {
  const enc = new TextEncoder();
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(env.ADMIN_PASSWORD + '\u0000atempo-session'));
  const key = await crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const s = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Comparación en tiempo constante (sobre los hashes, para que la longitud no importe)
async function sameSecret(a, b) {
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(String(a))), crypto.subtle.digest('SHA-256', enc.encode(String(b)))]);
  const u = new Uint8Array(x), w = new Uint8Array(y);
  let d = 0;
  for (let i = 0; i < u.length; i++) d |= u[i] ^ w[i];
  return d === 0;
}

// ---------- utilidades ----------
async function readJson(request) {
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_BODY) return null;
  const text = await request.text();
  if (text.length > MAX_BODY) return null;
  try { return JSON.parse(text); } catch { return null; }
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SEC_HEADERS, ...extra }
  });
}
