---
name: verify
description: Build, launch, and drive this site to verify changes at the rendered surface (three atmospheres, guestbook deck).
---

# Verifying changes on this site

## Build & launch

- `npm run build` — vite build, ~0.5s. Catches TS errors.
- `npm run dev -- --port 5199 --strictPort` (background) — dev server for driving.

## Driving the page

No playwright in the repo. Install `playwright-core` in the scratchpad and use
the installed Chrome: `chromium.launch({ channel: 'chrome', headless: true })` —
no browser download needed.

Gotchas that cost time:

- **Atmosphere forcing**: seed localStorage before load via `addInitScript`:
  `localStorage.setItem('vikas-atmosphere-v2', JSON.stringify({ auto: false, choice: 'morning'|'evening'|'night', at: Date.now() }))`.
  `evening` = Golden Hour, `night` = Quiet Night. Manual picks expire after 12h (`at` must be fresh).
- **Guestbook cards start `visibility: hidden`** — GSAP reveals them only after
  the panel scrolls into view. Wait for `.gb-card` `state: 'attached'`, then
  `scrollIntoViewIfNeeded()` on `.gb-panel`, then wait for `.gb-card:visible`,
  then ~2.5s for the entrance choreography.
- **Finding the front card**: the front card is the one with inline
  `style.cursor === 'pointer'` (read mode). Clicking it shuffles; lift+settle
  takes ~1.4s before the next front is stable.
- **Write mode**: click `.gb-writebtn` ("Leave a note"); the front card morphs
  to `data-paper="coral"`. Cancel with `.gb-notnow`.

## What to capture

Computed styles are strong evidence for theming changes:
`getComputedStyle(card).backgroundColor` plus `.gb-text` / `.gb-date` colors,
compared against the tokens in `src/styles/tokens.css` (light/dark) and the
Golden Hour overrides in `src/styles/treatments.css`. Screenshot
`.gb-deckwrap` per card and `.gb-panel` per atmosphere.
