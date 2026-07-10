/* Pure stack geometry, ported verbatim from the DC. Slot 0 is the front card;
   1 and 2 peek out misaligned behind it; deeper cards hide. */

export interface CardLayout {
  bg: string
  tx: number
  ty: number
  rot: number
  sc: number
  z: number
  sh: string
  op: number
}

export function slotLayout(p: number): CardLayout {
  if (p <= 0)
    return { bg: 'var(--card-front)', tx: 0, ty: 0, rot: -1.2, sc: 1, z: 100, sh: '0 28px 58px rgba(122,56,24,0.36)', op: 1 }
  if (p === 1)
    return { bg: 'var(--card-green)', tx: -12, ty: 15, rot: -4, sc: 0.965, z: 90, sh: '0 16px 34px rgba(96,58,26,0.26)', op: 1 }
  if (p === 2)
    return { bg: 'var(--card-tan)', tx: 12, ty: 15, rot: 5, sc: 0.93, z: 80, sh: '0 12px 26px rgba(132,86,38,0.24)', op: 1 }
  return { bg: 'var(--card-tan)', tx: 13, ty: 16, rot: 5, sc: 0.9, z: 80 - p, sh: '0 8px 18px rgba(132,86,38,0.14)', op: 0 }
}

/** The front card lifting away: up-right with a tilt, shadow deepening first. */
export const LIFT: CardLayout = {
  bg: 'var(--card-front)',
  tx: 174,
  ty: -16,
  rot: 13,
  sc: 1.06,
  z: 999,
  sh: '0 46px 84px rgba(74,38,14,0.30)',
  op: 1,
}

/** Shadow while settling in from above (initial entrance / fresh note). */
export const RAISED_SHADOW = '0 42px 72px rgba(122,56,24,0.28)'
export const NOTE_SHADOW = '0 42px 72px rgba(122,56,24,0.30)'

/** At Quiet Night shadows become soft dark pools with a faint warm rim — lamp-lit paper. */
export function nightShadow(p: number): string {
  if (p <= 0) return '0 18px 44px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,133,96,0.06)'
  if (p === 1) return '0 10px 24px rgba(0,0,0,0.30)'
  return '0 8px 18px rgba(0,0,0,0.24)'
}
