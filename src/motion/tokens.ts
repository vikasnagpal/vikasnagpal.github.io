/* The single tuning surface. Every duration (seconds), easing curve, and distance the
   site animates with lives here — ported verbatim from the design component, then
   adjusted only through this file. */

/** Cubic-bezier curves, registered as GSAP CustomEases in eases.ts */
export const CURVES = {
  /** Deck: front card lifting away */
  lift: '0.4,0,0.2,1',
  /** Deck: stack re-settling with a gentle overshoot */
  settle: '0.34,1.35,0.55,1',
  /** Deck: idle nudges (peek, breath, entrance) — soft overshoot */
  idle: '0.3,1.2,0.4,1',
  /** Page: blocks easing up into place on load — a decisive, unhurried ease-out */
  enter: '0.22,0.61,0.36,1',
  /** Hero: ink soaking across the handwritten line */
  inkFlow: '0.6,0.08,0.35,1',
  /** Hero: underline pen-stroke draw */
  inkDraw: '0.35,0.1,0.3,1',
  /** Reactions: stamp pop bounce */
  stampPop: '0.3,1.5,0.5,1',
  /** Coin: launch out of the squash */
  coinPop1: '0.2,0.7,0.35,1',
  /** Coin: rising to the apex */
  coinPop2: '0.2,0.7,0.45,1',
  /** Coin: gravity taking over after the apex */
  coinFall: '0.5,0.05,0.75,0.4',
} as const

export type CurveName = keyof typeof CURVES

/** Deck stack physics */
export const DECK = {
  size: { w: 320, h: 442 },
  /** transform durations per phase */
  lift: 0.25,
  settle: 0.54,
  idle: 0.48,
  /** shadow changes lead the movement — "weight first" */
  shadowLift: 0.18,
  shadowSettle: 0.42,
  shadowIdle: 0.24,
  /** opacity per phase */
  opacityLift: 0.25,
  opacitySettle: 0.46,
  opacityIdle: 0.32,
  /** front card settles in from above, ~90ms after mount */
  enterDelayMs: 90,
  enterRaise: { y: -22, rot: 3 },
  /** a fresh note drops in higher, with more tilt */
  noteRaise: { y: -34, rot: 5, scale: 1.03 },
  noteFlagClearMs: 60,
  /** hover peek: back cards slide out a few px */
  peek: { x: 6, y: 4 },
  /** desktop hover: the top card peels up a hair and tilts off the stack */
  frontPeek: { y: -6, rot: 1.6, scale: 1.012 },
  /** ambient breathing: back cards settle by a pixel and a third of a degree */
  breathEveryMs: 45000,
  breath: { y: 1, rot: 0.3 },
  /** per-card rotation jitter for the "slightly imperfect" stack */
  jitter: [-0.6, 1.1, -1.4, 0.7, 1.5, -0.9],
  /** motion pace per atmosphere: morning quicker, night slower */
  pace: { morning: 0.85, evening: 1, night: 1.25 } as Record<string, number>,
} as const

/** Reaction press choreography */
export const REACTION = {
  /** count updates deliberately AFTER the stamp pop — believability over responsiveness */
  countDelay: 0.28,
  pop: 0.42,
  glow: 0.9,
  glowDelay: 0.05,
  burst: 1.9,
} as const

/** Coin easter egg */
export const COIN = {
  arc: 0.95,
  /** keyframe stops as fractions of the arc (squash → launch → apex → hang → fall) */
  stops: [0, 0.12, 0.5, 0.62, 1],
  rise: { launch: -16, apex: -60, hang: -64, fadeAt: -22 },
  spins: 660, // degrees of Y rotation over the arc
  /** the nav icon dips to "catch" the falling coin near the end */
  catchAt: 0.74,
  tell: 0.4, // subliminal 5° tilt on the 2nd rapid re-entry
  tellDeg: 5,
  firstCatchBeatMs: 320,
  noteFloat: 1.9,
  noteDelayMs: 820,
  /** trigger: 3 entries on the same item within this window */
  windowMs: 3000,
  /** touch trigger: each horizontal rub stroke this long counts as one "entry" */
  rubStrokePx: 12,
  /** Phase 2: soft damping — after this many coins in a session, spawns get probabilistic */
  dampAfter: 8,
  dampChance: 0.45,
  /** Phase 2: every Nth lifetime coin is coral, chime an octave up */
  coralEvery: 10,
  /** Phase 2: rare variation odds (faster spin / landing wobble) */
  rareOdds: 0.05,
} as const

/** Coin discovery aids — the scent trail. Never an instruction: escalating,
    deniable whispers that widen the top of the funnel. Each aid is independently
    toggleable (dev tweaks → discovery) so it can be reviewed in isolation. */
export const DISCOVERY = {
  /** whisper: a second look at the same icon within this window (slower than the
      fast trigger window) gets a fainter tilt — the room noticing you noticing */
  whisperWindowMs: 8000,
  whisperDeg: 2,
  /** desktop wiggle: after one direction reversal inside the hit area, each
      horizontal stroke this long counts as an "entry" (mirrors the touch rub) */
  wiggleStrokePx: 24,
  /** forgiveness: widened fast-trigger window while wiggle is on (base 3000) */
  windowMs: 4500,
  /** glint: a gold edge peeks from behind an icon and hides — once per session,
      and only maybe (a slip, not a loop) */
  glintDelayMsMin: 15000,
  glintDelayMsMax: 40000,
  glintChance: 0.55,
  glintRise: 9, // px of coin edge that surfaces
  glintDur: 1.1,
  glintAlpha: 0.9,
} as const

/** Page entrance — the composition settling in once, on first paint */
export const INTRO = {
  /** how far each block rises as it fades in */
  y: 14,
  dur: 0.72,
  /** left-column blocks arrive one after another, top to bottom */
  stagger: 0.08,
  /** the guestbook panel joins a beat after the column starts */
  panelDelay: 0.14,
} as const

/** Inner pages — a lighter arrival than the home INTRO: the page was already
    on the desk, you just picked it up */
export const PAGE = {
  y: 12,
  dur: 0.6,
  stagger: 0.06,
} as const

/** Hero ink system */
export const HERO = {
  inkDur: 0.95,
  inkDelay: 0.35,
  drawDur: 0.55,
  drawDelay: 1.2,
  /** ink weight settles up to its resting thickness as the pen lands — monotonic, so
     the finished line never pulses thicker-then-thinner (a temporal swell past `to`
     crosses the pixel-rounding boundary and reads as a glitchy fatten, not nib pressure) */
  strokeSwell: { from: 2.6, to: 3.2 },
} as const

/** Toast timings */
export const TOAST = {
  in: 0.4,
  out: 0.25,
  /** default time a toast stays up */
  showForMs: 6500,
  submitForMs: 5600,
} as const

/** Chime synthesis (triangle waves — marimba ding, not arcade bleep) */
export const CHIME = {
  graceHz: 880, // A5
  ringHz: 1175, // D6
  graceDur: 0.1,
  ringStart: 0.09,
  ringDur: 0.42,
  gain: 0.1,
  nightGain: 0.06,
  octaveUp: 2, // multiplier for the coral coin
} as const
