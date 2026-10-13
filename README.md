# Atempo Psychology · Adelina Arocena

Web de una página, bilingüe (español en `/`, inglés en `/en/`), para la consulta online de Adelina Arocena, con un editor propio en `/admin` para que ella cambie textos, foto, tipografía y colores sin tocar código.

## Cómo está montada

- **Contenido:** `content/default.json` es la versión inicial. Lo que Adelina publica desde `/admin` se guarda en Cloudflare KV y tiene prioridad.
- **Render:** `src/render.mjs` pinta la página. Lo usan las Functions de Cloudflare (web publicada), el editor (vista previa en vivo) y `build.mjs` (copia estática de respaldo).
- **Servidor:** `functions/[[path]].js` sirve `/`, `/en/`, las páginas legales, las fotos (`/media/…`) y la API del editor (`/api/…`). Las rutas que pasan por la Function están en `_routes.json`.
- **Editor:** `admin/` (HTML, CSS y JS sin dependencias).

## Configuración en Cloudflare Pages

1. Proyecto de Pages conectado a este repo. Build command: `node build.mjs`. Output directory: `/`.
2. KV namespace (por ejemplo `atempo-content`) enlazado al proyecto con el nombre **`ATEMPO`** (Settings → Bindings).
3. Secreto **`ADMIN_PASSWORD`** (Settings → Variables and Secrets, tipo Secret) con la contraseña del editor. Cambiarla cierra todas las sesiones abiertas.

## Seguridad del editor

- Contraseña comparada en tiempo constante; 8 intentos fallidos bloquean esa IP 15 minutos.
- Sesión en cookie `HttpOnly; Secure; SameSite=Strict` firmada con HMAC y válida 14 días.
- Toda escritura exige la cabecera `X-Atempo` (protección CSRF).
- El contenido que llega se valida contra la estructura de `content/default.json`: solo se aceptan esas claves, con límites de longitud; todo texto se escapa al pintarlo. Solo existen dos marcas: `*texto*` (cursiva en color) y `[texto]` (enlace a privacidad, solo en ese campo).
- Fotos: solo JPEG reales (se comprueba la firma del archivo), máximo 3 MB; el editor las reduce a 1600 px antes de subirlas.
- Historial: cada publicación guarda la versión anterior (las últimas 30).
- En el repo no hay ningún secreto.

## Dirección de diseño

- **Idea:** "a tempo" es la indicación musical que pide volver al tiempo original. La web lo usa con discreción: una línea que respira (6 respiraciones por minuto, con botón de pausa y respetando `prefers-reduced-motion`), el detalle "♩ = 60", los servicios numerados como movimientos (I, II, III), los pasos sobre líneas como un pentagrama y los honorarios como el programa de un concierto.
- **Tipografías:** por defecto Newsreader + Albert Sans. Desde el editor se puede elegir entre cuatro parejas cerradas (todas alojadas en `assets/fonts`).
- **Paleta (del Canva de Adelina):** lino `#E6E1DA`, lavanda `#C2BECB`, marrón `#5A391E`, rosa viejo `#A5676F`. El editor avisa si un cambio de color deja el texto poco legible.

## Formulario

Envía a Formspree cuando en Ajustes hay un código de formulario (las consultas llegan al correo de Adelina). Si no lo hay pero sí hay correo, abre el correo de la persona con el mensaje escrito.

## Pendiente de Adelina

Foto, correo, número de colegiada y NIF, dominio.
