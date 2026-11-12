# Portafolio Danna Tomás — sitio web estático

Sitio estático (HTML + CSS + JS, sin build). Bilingüe ES / EN con botón en el header; el idioma elegido se guarda en `localStorage` (`dt-lang`).

## Estructura
- `index.html` — Inicio
- `sandmade.html`, `google-x-inroads.html`, `regio-operadora.html`, `ugc.html`, `modelaje.html`, `sobre-mi.html` — subpáginas
- `js/preact.min.umd.js` — Preact 10.24.3 (licencia MIT)
- `js/dc-lite.js` — motor que pinta las plantillas `<template id="dc-tpl">` de cada página
- `assets/` — fotos (JPG), videos (MP4 H.264) y el CV en PDF (~185 MB en total)

## Probar en local
```
python3 -m http.server 8000
```
y abrir http://localhost:8000

## Publicar
Cualquier hosting de sitios estáticos sirve; no hay paso de build y el directorio a publicar es la raíz de esta carpeta.
Recomendado por el peso de los videos: Netlify o Cloudflare Pages.
