import { KEYS, readRaw, writeRaw } from './storage'

/* First-visit / returning-visitor logic. Computed once at module load (before React
   mounts, immune to StrictMode double-effects), then the visit timestamp is refreshed. */

const RETURNING_AFTER_MS = 4 * 3600 * 1000

const last = parseInt(readRaw(KEYS.lastVisit) ?? '', 10)

/** ">4h since last visit" → "Welcome back — it's Vikas, and" */
export const returning: boolean = !!last && Date.now() - last > RETURNING_AFTER_MS

/** The handwritten line writes itself on a visitor's first visit only — never repeats. */
export const writeOn: boolean = !last

writeRaw(KEYS.lastVisit, String(Date.now()))
