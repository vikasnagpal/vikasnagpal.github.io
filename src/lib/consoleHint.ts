import { KEYS, readJSON } from './storage'

/* The out-of-band breadcrumb: one oblique line for the kind of visitor who opens
   devtools on a personal site. Never an instruction, just a direction to look.
   Pre-discovery only (a found coin retires it), once per session. */

const SESSION_KEY = 'vikas-console-hint'

export function consoleHint(): void {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return
    if (readJSON<{ total: number }>(KEYS.coins, { total: 0 }).total > 0) return
    sessionStorage.setItem(SESSION_KEY, '1')
    console.log('%cpsst. the icons are ticklish.', 'font-style: italic; font-family: Georgia, serif; color: #b0805c;')
  } catch {
    /* a hint, never a failure */
  }
}
