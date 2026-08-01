# Tampermonkey — Youtube Tools

Código del userscript (modular). La extensión vive en `extension/`.

## Estructura

```
tampermonkey/
├── README.md
├── build.mjs                 ← une los módulos en un solo .user.js
├── youtube-tools.user.js     ← salida del build (instalar / publicar)
└── src/
    ├── header.meta.js        ← cabecera @name @match @grant …
    ├── styles.css            ← estilos del menú / UI
    ├── 01-config-utils.js
    ├── 02-download.js
    ├── 03-storage-version.js
    ├── 04-continue-watching.js
    ├── 05-shorts-channel.js
    ├── 06-lockup-stats.js
    ├── 07-bookmarks.js
    ├── 08-dislikes.js
    ├── 09-styles.js          ← inyecta styles.css (vía build)
    ├── 10-player-buttons.js  ← botones bajo el video
    ├── 11-menu-ui.js         ← HTML del menú de settings
    └── 12-app.js             ← settings, apply, init
```

## Flujo de trabajo

1. Edita los archivos en `tampermonkey/src/` (no edites a mano el `.user.js` generado).
2. Genera el script único:

```bash
npm run build:userscript
```

3. Instala en Tampermonkey el archivo generado:

`tampermonkey/youtube-tools.user.js`

## Por qué un build (y no solo `@require`)

- En el repo el código queda organizado por feature.
- Para Greasy Fork / usuarios finales se publica **un solo archivo** (más fiable que cargar N URLs remotas).
- Tampermonkey sigue usando un `.user.js` normal; no cambia el uso final.

## Relación con el resto del repo

| Carpeta | Qué es |
|---------|--------|
| `extension/` | Extensión Chrome / Edge / Firefox (popup React + content) |
| `tampermonkey/` | Userscript Tampermonkey / Greasy Fork |
