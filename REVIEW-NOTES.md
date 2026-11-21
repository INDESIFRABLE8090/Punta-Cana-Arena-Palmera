# Arena & Palmera — baseline browser review

**Status: private review only. Not published or approved for client delivery.**

## Source recovered

The original project was contained in `project-source.zip.b64`, while the repository root lacked `index.html`, `app.js`, and `styles.css`. The review branch contains editable copies of exactly those existing sources and the favicon. The original archive and the `main` branch were not altered.

`config.js` existed at repository root but was absent from the archived app's Vite build. The review branch adds `public/config.js` so the runtime configuration is served in production. The actual WhatsApp contact identifier is not repeated in this document.

## Reproducible evidence

- Baseline archive build succeeded: [run 44843126519](https://github.com/INDESIFRABLE8090/Punta-Cana-Arena-Palmera/actions/runs/44843126519).
- Initial Chrome audit at 390/768/1440 found **no horizontal overflow**, **11 excursion cards**, 3 canvases, no `<img>` elements or video elements. It also found `/config.js` HTTP 404: [run 44843543856](https://github.com/INDESIFRABLE8090/Punta-Cana-Arena-Palmera/actions/runs/44843543856). Screenshots and audit JSON attached for temporary private review.
- The recovered source and Vite build were validated: `dist/index.html`, `dist/config.js`, and `GET /config.js` **HTTP 200**, byte-identical to the compiled static asset: [run 44843851714](https://github.com/INDESIFRABLE8090/Punta-Cana-Arena-Palmera/actions/runs/44843851714).
- Final local-only Chrome review: [run 44843985836](https://github.com/INDESIFRABLE8090/Punta-Cana-Arena-Palmera/actions/runs/44843985836). Browser screenshots in mobile (390px) and desktop (1440px), plus JSON results are available in that run's private artifact `arena-palmera-fixed-preview-and-qa` (limited retention).

### Functional checks from Chrome

| Check | Result |
|---|---|
| Page loads at mobile and desktop | PASS |
| Runtime `window.BRAND_CONFIG` available | PASS |
| 11 excursion cards render | PASS |
| Sea filter reduces 11 cards to 6 | PASS |
| Excursion detail modal opens/closes | PASS |
| Spanish/English switch updates heading | PASS |
| Quote form constructs a WhatsApp URL | PASS, external action deliberately intercepted — no message sent |
| Horizontal overflow | None at 390 and 1440; initial audit also passed at 768 |
| JavaScript page errors / HTTP resource errors | None in final automated check |

## Next product/design work

This is **a functioning baseline, not the requested Awwwards-level visual result**. The current prototype uses code-generated SVG illustrations and Three.js scenes; no client photos or original promotional videos were used in this baseline. Before commercial presentation: visually review screenshots, integrate approved high-quality footage / photography and the tour source materials, refine cinematic hero and responsive motion, validate all excursions and copy against client-provided flyers, improve accessibility and speed (Three.js bundle triggered a >500 kB warning), and run a genuine client/owner review.

The existing quote form **prepares an enquiry**, not a confirmed booking or paid transaction. Do not claim booking/inventory integrations exist. No external messages, web publication, purchases, new Codespaces, Claude/Codex calls or autonomous AWS work occurred in this branch.
