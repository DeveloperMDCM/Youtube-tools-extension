# Browser extension (Chrome / Edge / Firefox)

Separado de `tampermonkey/` (userscript) y del código React antiguo en la raíz (`src/`).

## Qué incluye

- **Popup** con la UI clásica (General / Themes / Appearance / Setting) + **Tailwind CSS v4**
- **Content script** = motor del userscript Tampermonkey (botones, descargas, dislikes…) con polyfill `GM_*` → `chrome.storage`
- **Theme bridge** para colores/temas del popup sobre YouTube

## Preview (sin instalar)

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) — mismo layout que el icono de la extensión.

## Compilar

```bash
npm run build:userscript   # si cambiaste tampermonkey/src
npm run build:extension
```

| Navegador | Carpeta unpacked |
|-----------|------------------|
| Chrome | `extension/dist/chrome` |
| Edge | `extension/dist/edge` |
| Firefox | `extension/dist/firefox` |

Rutas del manifest son **relativas** (compatible con carga local en Edge).
