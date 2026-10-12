# Atempo Psychology · Adelina Arocena

Web de una página, bilingüe (español en `/`, inglés en `/en/`), para la consulta online de Adelina Arocena. Hecha a mano, sin plantillas ni dependencias en producción.

## Cómo se edita

- Textos: `src/strings.js` (los dos idiomas, uno al lado del otro).
- Correo, endpoint del formulario, Instagram, n.º de colegiada y dominio: `src/config.js`.
- Después de cualquier cambio: `node build.js` (regenera `index.html`, `en/index.html`, páginas legales, `sitemap.xml` y `robots.txt`).
- Foto de Adelina: guardar como `assets/img/adelina.jpg` (vertical 4:5, unos 1200×1500) y sustituir el bloque `portrait__empty` de `build.js` por la `<img>` que hay comentada justo encima.

## Dirección de diseño (aprobada para este proyecto)

- **Idea:** "a tempo" es la indicación musical que pide volver al tiempo original. La web lo usa con discreción: entrada de diccionario en el hero, una línea que respira (6 respiraciones por minuto, con botón de pausa y respetando `prefers-reduced-motion`), los servicios numerados como movimientos (I, II, III), los cinco pasos sobre cinco líneas como un pentagrama y los honorarios como el programa de un concierto.
- **Tipografías:** Newsreader (titulares, con eje óptico; itálica para el acento) + Albert Sans (texto). Alojadas en `assets/fonts`. Se descartó Libre Baskerville porque es la de Sunara Psychology, la web de referencia.
- **Paleta (del Canva de Adelina):** lino `#E6E1DA` (fondo), lavanda `#C2BECB`, marrón `#5A391E` (texto y botones), rosa viejo `#A5676F` (solo acentos: línea, numerales, subrayados; no cumple contraste para texto pequeño).
- **No tiene:** arcos ni manchas orgánicas, tarjetas con sombra, iconos de línea, fotos de stock, testimonios inventados, contadores.
- Animaciones: solo dos (la línea y la aparición suave al hacer scroll).

## Formulario

Pide lo mínimo (son datos que pueden ser de salud): nombre, correo, teléfono opcional, tipo de terapia, idioma, mensaje breve opcional, +18 y consentimiento. Si `formEndpoint` está vacío, abre el correo de la persona con el mensaje ya escrito hacia `email`. Recomendado: Formspree (gratis hasta 50 envíos al mes) o una Pages Function en Cloudflare.

## Despliegue

Código en GitHub; publicación en Cloudflare Pages (sin paso de build, directorio de salida `/`). GitHub Pages solo como vista previa.

## Pendiente de Adelina

Foto, correo de contacto, n.º de colegiada y NIF (aviso legal), moneda de las tarifas (se asume €), dominio, Instagram.
