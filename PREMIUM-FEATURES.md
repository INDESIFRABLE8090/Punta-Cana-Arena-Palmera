# Arena & Palmera — premium experience planner (review-only)

**Status:** Private candidate. Not deployed, not published to customers, and not yet visually approved.

## Verified baseline and premium functionality

The website's editable source, including `public/config.js`, was recovered and built on the baseline branch. The premium candidate adds:

- **Multi-experience trip planner** in Spanish and English: add/remove selected excursions directly from cards and their existing 3D detail modal.
- **Day-by-day suggestions**: organize each tour on a suggested day 1–7, without claiming real availability, operating schedules or feasible transfers. The operator must confirm logistics.
- **Client-side saved selection** in localStorage; no guest identity or contact details stored.
- **Safe itinerary import/share links** using allowlisted catalog tour IDs and day numbers. Incoming query links are consumed once, so later visitor changes are preserved on reload.
- **QR image generation** for public-domain URLs only (not localhost/private preview). QR codes encode only tour IDs and days, never guest names, telephone, email or booking information.
- **Print-friendly itinerary**, interactive empty state, accessible buttons and focus states, responsive layouts.
- **Single multi-experience quote message** using existing form and WhatsApp integration. The message lists the suggested days; it does not book or take payment.
- No backend, registration, checkout, API tokens, external outbound tracking, fake reviews, prices or live availability.

## Evidence

**GitHub Actions run [44844898732](https://github.com/INDESIFRABLE8090/Punta-Cana-Arena-Palmera/actions/runs/44844898732)**: Vite production build PASS; Node QR generator created an encoded PNG data URI; Chrome tests PASS at 390, 768 and 1440 pixels. The test covered catalog 11 cards, importing 2 allowlisted experiences from a query link, rejecting unknown and duplicate tour IDs, absence of horizontal overflow and HTTP/browser errors, persistence of an added third tour on day 3 through a reload, switching the planner to English, and a combined quote including three tour names and day assignments. The WhatsApp window-opening action was intercepted in Chrome; no real message sent. Share buttons intentionally remain disabled in localhost preview.

Three private screenshots plus JSON report are attached in artifact `arena-premium-itinerary-qa` to that run (short retention). A previous run [44844720386](https://github.com/INDESIFRABLE8090/Punta-Cana-Arena-Palmera/actions/runs/44844720386) identified a real shared-link reload bug, which was fixed before the successful verification.

## Commercial quality checklist before delivery

1. **Visual:** replace procedural SVG placeholders with rights-cleared original client media and cinematic hero footage, after comparing the client's real materials against the 11 excursion entries. Current procedural 3D remains a functional fallback.
2. **Business rules:** verify official WhatsApp number, excursion inclusion details, exact tour naming, pickup areas, age restrictions, accessibility, safety and terms with the operator; only advertise real services.
3. **Sharing:** activate and verify public-domain QR links only after a staging domain is available; local preview will correctly refuse to generate shareable localhost QR links.
4. **Performance:** optimize Three.js chunk, WebGL fallback, font sizes and mobile low-power behavior. An earlier Vite build warned about the Three.js chunk size exceeding 500kB.
5. **Operations:** consider a private client-approved quote inbox, lead tracking, translated content CMS, and optional approved booking integration later. None is currently implemented, and no false promise is made.
6. **Approval:** publish only after the owner/customer reviews screenshots, usability and commercial terms. Do not merge to public-facing `main` automatically.

**Billing / execution:** No Claude/Codex models, Cloudflare deployment, Codespaces machine startup or real customer contact were used to implement this branch. GitHub Actions used CI runner time; production remains unchanged.
