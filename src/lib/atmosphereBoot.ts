/* The atmosphere's boot contract — the ONE place the daypart map, hour windows,
   manual-pick TTL and storage key live. Consumed from three sides:
     · atmosphere.tsx (runtime state) builds DAYPARTS from BOOT_DAYPARTS
     · ist.ts (daypartFromClock) uses BOOT_HOURS
     · vite.config.ts injects bootScript() into index.html at dev/build time,
       so the pre-paint script can never drift from the app again
   Keep this module pure (no import.meta.env, no DOM at module level):
   vite.config imports it under Node.

   The bg hexes mirror tokens.css (--bg light / --surface / dark --surface) —
   they must be literals here because the boot paints browser chrome before
   any CSS has loaded. */

export const ATMO_KEY = 'vikas-atmosphere-v2'

/** 5–14 Morning Light · 14–19 Golden Hour · 19–5 Quiet Night (IST). */
export const BOOT_HOURS = { morningStart: 5, eveningStart: 14, nightStart: 19 } as const

/** A manual pick is a peek, not a setting: after 12h the room follows the sun again. */
export const MANUAL_TTL_HOURS = 12

export const BOOT_DAYPARTS = {
  morning: { theme: 'light', treatment: 'Open · proximity', bg: '#fdf8f0' },
  evening: { theme: 'light', treatment: 'Unified ground', bg: '#fcead4' },
  night: { theme: 'dark', treatment: 'Unified ground', bg: '#262320' },
} as const

/* Resolve the atmosphere BEFORE first paint. The themed CSS variables that give
   every panel/pill/card its border, radius and padding live only under
   [data-treatment]; React sets that attribute in an effect that fires AFTER the
   first paint, so without this bootstrap each bordered block flashes a sharp,
   currentColor (dark) outline for one frame on load. */
export function bootScript(): string {
  const dayparts = JSON.stringify(BOOT_DAYPARTS)
  const { morningStart, eveningStart, nightStart } = BOOT_HOURS
  return `(function () {
  try {
    var DAYPARTS = ${dayparts}
    var auto = true,
      choice = null
    try {
      var p = JSON.parse(localStorage.getItem(${JSON.stringify(ATMO_KEY)}) || 'null')
      if (p) {
        if (typeof p.auto === 'boolean') auto = p.auto
        if (p.choice && DAYPARTS[p.choice]) choice = p.choice
        /* a manual pick is a peek, not a setting: after ${MANUAL_TTL_HOURS}h the room follows the sun again */
        if (!auto && (!p.at || Date.now() - p.at > ${MANUAL_TTL_HOURS} * 3600 * 1000)) {
          auto = true
          choice = null
        }
      }
    } catch (e) {}
    var daypart
    if (!auto && choice) {
      daypart = choice
    } else {
      /* ${morningStart}–${eveningStart} morning · ${eveningStart}–${nightStart} golden hour · ${nightStart}–${morningStart} night — mirror of daypartFromClock in ist.ts */
      var hr = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getHours()
      daypart = hr >= ${morningStart} && hr < ${eveningStart} ? 'morning' : hr >= ${eveningStart} && hr < ${nightStart} ? 'evening' : 'night'
    }
    var dp = DAYPARTS[daypart]
    document.documentElement.dataset.theme = dp.theme
    document.documentElement.dataset.treatment = dp.treatment
    var meta = document.getElementById('theme-color')
    if (meta) meta.setAttribute('content', dp.bg)
  } catch (e) {}
})()`
}
