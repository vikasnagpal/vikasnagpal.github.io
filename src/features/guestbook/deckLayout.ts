/* Pure stack geometry, ported verbatim from the DC. Slot 0 is the front card;
   1 and 2 peek out misaligned behind it; deeper cards hide.
   Paper color is not slot geometry — each card keeps its own (see paper.ts). */

import type { Daypart } from '../../lib/ist'

export interface CardLayout {
  tx: number
  ty: number
  rot: number
  sc: number
  z: number
  sh: string
  op: number
}

/* --- Shadows follow the light in the room --------------------------------
   One light source, up and to the left — sun through a window onto the desk —
   so every resting card casts DOWN and to the RIGHT. Morning light rides high:
   short, crisp shadows. Golden hour rakes low: long, soft, warm ones. Quiet
   Night is a lamp pooling dark on the paper with a faint warm rim. */

/** Morning Light: high sun, short and crisp, a gentle lean right. */
export function morningShadow(p: number): string {
  if (p <= 0) return '9px 20px 44px rgba(120,54,22,0.26)'
  if (p === 1) return '6px 12px 28px rgba(96,58,26,0.20)'
  return '4px 9px 20px rgba(120,74,32,0.15)'
}

/** Golden Hour: low sun, long soft shadows raked to the lower-right, warmer. */
export function eveningShadow(p: number): string {
  if (p <= 0) return '20px 30px 62px rgba(122,52,18,0.30)'
  if (p === 1) return '13px 20px 44px rgba(100,56,24,0.23)'
  return '9px 14px 30px rgba(120,74,32,0.17)'
}

/** Quiet Night: lamp-lit paper — a dark pool with a faint warm rim. */
export function nightShadow(p: number): string {
  if (p <= 0) return '8px 18px 44px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,133,96,0.06)'
  if (p === 1) return '6px 12px 26px rgba(0,0,0,0.30)'
  return '5px 9px 18px rgba(0,0,0,0.24)'
}

/** The resting shadow for a card at slot p under the current atmosphere. */
export function deckShadow(daypart: Daypart, p: number): string {
  if (daypart === 'night') return nightShadow(p)
  if (daypart === 'evening') return eveningShadow(p)
  return morningShadow(p)
}

export function slotLayout(p: number): CardLayout {
  if (p <= 0) return { tx: 0, ty: 0, rot: -1.2, sc: 1, z: 100, sh: morningShadow(0), op: 1 }
  if (p === 1) return { tx: -12, ty: 15, rot: -4, sc: 0.965, z: 90, sh: morningShadow(1), op: 1 }
  if (p === 2) return { tx: 12, ty: 15, rot: 5, sc: 0.93, z: 80, sh: morningShadow(2), op: 1 }
  return { tx: 13, ty: 16, rot: 5, sc: 0.9, z: 80 - p, sh: morningShadow(3), op: 0 }
}

/** The front card lifting away: up-right with a tilt, shadow deepening first. */
export const LIFT: CardLayout = {
  tx: 174,
  ty: -16,
  rot: 13,
  sc: 1.06,
  z: 999,
  sh: '20px 46px 84px rgba(74,38,14,0.30)',
  op: 1,
}

/** Shadow while settling in from above (initial entrance / fresh note) — a lifted
    card throws its cast long and to the right, same light as the resting stack. */
export const RAISED_SHADOW = '16px 42px 72px rgba(122,56,24,0.26)'
export const NOTE_SHADOW = '16px 42px 74px rgba(122,56,24,0.28)'
