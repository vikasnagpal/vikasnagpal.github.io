/* Hand-drawn stroke glyphs standing in for text arrows/marks. Same reason as
   PageFrame's back arrow: Nunito's self-hosted subset only carries U+2191/2193
   (up/down), not →/↗/✦/✕ — those substitute to a mismatched system font on
   Android. Strokes render identically everywhere. */

const PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export function ArrowNE() {
  return (
    <svg {...PROPS} width="11" height="11" viewBox="0 0 14 14" strokeWidth={1.9}>
      <path d="M4 10 L10 4" />
      <path d="M5 4 H10 V9" />
    </svg>
  )
}

export function ArrowRight() {
  return (
    <svg {...PROPS} width="13" height="10" viewBox="0 0 16 12" strokeWidth={1.9}>
      <path d="M1 6 H14" />
      <path d="M9 1.5 L14 6 L9 10.5" />
    </svg>
  )
}

export function CloseX() {
  return (
    <svg {...PROPS} width="13" height="13" viewBox="0 0 14 14" strokeWidth={1.8}>
      <path d="M2 2 L12 12" />
      <path d="M12 2 L2 12" />
    </svg>
  )
}

export function Sparkle() {
  return (
    <svg {...PROPS} width="20" height="20" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path d="M12 3 C12 8 12 8 19 9 C12 10 12 10 12 19 C12 10 12 10 5 9 C12 8 12 8 12 3 Z" />
    </svg>
  )
}
