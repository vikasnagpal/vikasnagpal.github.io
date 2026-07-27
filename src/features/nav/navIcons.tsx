/* The trio's hand-drawn glyphs, kept apart from NavTrio so other surfaces can
   borrow one (the site's own case study bumps the waves icon for a live coin).
   One shared stroke language across the set: sparkle, wave and document all
   carry the ICON_PROPS weight (3) with round caps and joins, so the trio sits
   at one optical weight. The document's body corners are rounded (not the
   sharp-cornered, thin-ruled version) and its body widened ~12% so it doesn't
   read squished or heavier than the curved glyphs beside it. */

export const ICON_PROPS = {
  width: 60,
  height: 60,
  viewBox: '0 0 72 72',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export const workIcon = (
  <svg {...ICON_PROPS}>
    <path d="M40 62 C40 50 50 40 62 40 C50 40 40 30 40 18 C40 30 30 40 18 40 C30 40 40 50 40 62 Z" />
    <path d="M21 31 C21 27 23 25 27 25 C23 25 21 23 21 19 C21 23 19 25 15 25 C19 25 21 27 21 31 Z" />
  </svg>
)

export const wavesIcon = (
  <svg {...ICON_PROPS}>
    <path d="M12 37 C21 25 28 50 37 37 C46 25 53 50 62 37" />
    <path d="M16 50 C25 39 31 59 40 50 C49 41 55 58 64 50" />
  </svg>
)

export const notesIcon = (
  <svg {...ICON_PROPS}>
    {/* body widened (walls 26.5/54.5) via hand-edited coordinates, not a scaleX
        transform — a non-uniform scale would thicken the vertical strokes and
        break the unified weight */}
    <g transform="rotate(-6 40 40)">
      <path d="M30 16 H46.5 L54.5 24 V60 A3.5 3.5 0 0 1 51 63.5 H30 A3.5 3.5 0 0 1 26.5 60 V19.5 A3.5 3.5 0 0 1 30 16 Z" />
      <path d="M46.5 16 V24 H54.5" />
      <path d="M32.5 38 H47.5 M32.5 46 H47.5 M32.5 54 H43.5" />
    </g>
  </svg>
)
