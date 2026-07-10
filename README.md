# Vikas — Personal Site

A warm, "inhabited" one-page personal site: three atmospheres that follow Bangalore
time, a live guestbook of physical thought-cards, an ink system in the hero, and a
coin easter egg for the curious. Built from the Claude Design project
(`Vikas Personal Site.dc.html` + docs), which remains the design source of truth.

## Stack

- **React 19 + Vite + TypeScript** — the design logic was already React-shaped
- **GSAP** (CustomEase, DrawSVG; GSDevTools in dev) — every choreographed sequence
  is a scrubbable timeline
- **Supabase** (optional) — real guestbook with a moderation queue; the site runs
  fully offline on seeds without it. See [supabase/README.md](supabase/README.md)
- No other runtime dependencies

## Commands

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + production bundle in dist/
```

## Fine-tuning motion (the whole point)

- **`src/motion/tokens.ts`** — every duration, easing curve, distance, and pace
  multiplier on the site. One file, tune anything.
- **`src/motion/choreographies/`** — parameterized GSAP timeline factories for the
  signature moments (coin arc, ink write-on, bursts).
- **Dev tweaks panel** (⚙ bottom-left, dev builds only) — atmosphere/weather/season
  overrides, global time-scale slider, GSDevTools scrubber for the last-run coin /
  shuffle / reaction / hero-ink timelines, and state resets (first visit, coins,
  reactions).

### Motion grammar (from the design docs — keep new motion inside it)

- Shadow changes **before** movement (weight first)
- Things **lift**, they never scale/inflate on hover
- Settles **overshoot** gently; night runs ~25% slower, morning ~15% quicker
- Decorative motion is skipped under `prefers-reduced-motion`; state changes never are
- New motion must pass: *"is this something paper, ink, or light does?"*

## Architecture notes

- **React owns** structure, content, colors, z-index; **GSAP owns** transform,
  box-shadow, opacity of animated nodes. Never write the same property from both.
- The atmosphere transition is pure CSS (staggered `transition-delay`s on
  background → border → text) — it should read as time passing, not a theme swap.
- Visitor memory is localStorage only: `vikas-last-visit`, `vikas-atmosphere-v2`,
  `vikas-reactions-v1`, `vikas-coins-v1`, `vikas-visitor-v1`.
- The three nav destinations are unbuilt (`#`) — when they exist, add a tiny router
  (`wouter`) and code-split the sections.
