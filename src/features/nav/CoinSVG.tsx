import type { CoinVariant } from './useCoin'

/* A hand-drawn coin: warm face, darker rim, thin highlight ring, engraved with the
   site's four-pointed sparkle. Coral is the milestone variant (our accent — rarer
   than gold in this room); at Quiet Night the glint runs warmer. */

const PALETTES: Record<string, { rim: string; face: string; ring: string; engraving: string; shadow: string }> = {
  gold: { rim: '#c98d00', face: '#f2b307', ring: '#ffd95e', engraving: '#a97400', shadow: 'rgba(122,56,24,0.32)' },
  'gold-night': { rim: '#a97a08', face: '#e0a606', ring: '#f5cf6a', engraving: '#8a5e00', shadow: 'rgba(255,133,96,0.28)' },
  coral: { rim: '#a83c22', face: '#f0603d', ring: '#ffb39e', engraving: '#7c2913', shadow: 'rgba(122,32,12,0.35)' },
  'coral-night': { rim: '#993622', face: '#ff7a59', ring: '#ffc3ae', engraving: '#7c2913', shadow: 'rgba(255,133,96,0.32)' },
}

export function CoinSVG({ variant, night }: { variant: CoinVariant; night: boolean }) {
  const p = PALETTES[`${variant}${night ? '-night' : ''}`]
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block', filter: `drop-shadow(0 4px 5px ${p.shadow})` }}>
      <circle cx="12" cy="12" r="11" fill={p.rim} />
      <circle cx="12" cy="12" r="9.2" fill={p.face} />
      <circle cx="12" cy="12" r="7.4" fill="none" stroke={p.ring} strokeWidth="1.1" />
      <path
        d="M12 17.5 C12 14.2 14.2 12 17.5 12 C14.2 12 12 9.8 12 6.5 C12 9.8 9.8 12 6.5 12 C9.8 12 12 14.2 12 17.5 Z"
        fill="none"
        stroke={p.engraving}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}
