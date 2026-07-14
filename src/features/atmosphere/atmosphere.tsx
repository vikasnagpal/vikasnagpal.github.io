import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { BOOT_DAYPARTS, MANUAL_TTL_HOURS } from '../../lib/atmosphereBoot'
import { setFavicon } from '../../lib/favicon'
import { daypartFromClock, type Daypart } from '../../lib/ist'
import { KEYS, readJSON, writeJSON } from '../../lib/storage'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { DECK } from '../../motion/tokens'

/* Atmosphere switches crossfade via the View Transitions API where available:
   the browser fades between two fully-rendered frames, each full-contrast, so
   the text never blends through the unreadable mid-tone that a slow fg+bg
   color transition must cross. While a crossfade runs, the CSS color
   transitions are silenced (html.atmo-vt) so the new frame lands instantly
   beneath the fade; browsers without the API get the quick synchronized CSS
   fallback in base.css. Rapid toggles overlap (the browser skips the older
   transition) — the counter keeps the class on until the last one settles. */
let vtCount = 0

/* Atmospheres are moods of the workspace, not themes. Each carries a theme
   (ink set) and a container treatment; both land as attributes on <html>.
   theme/treatment come from the boot contract (atmosphereBoot.ts) — the same
   values the generated pre-paint script applies before React exists. */

export const DAYPARTS: Record<Daypart, { theme: 'light' | 'dark'; treatment: string; name: string; tagline: string }> = {
  morning: { ...BOOT_DAYPARTS.morning, name: 'Morning Light', tagline: 'Fresh and bright, like a new day.' },
  evening: { ...BOOT_DAYPARTS.evening, name: 'Golden Hour', tagline: 'Warm afternoons and softer shadows.' },
  night: { ...BOOT_DAYPARTS.night, name: 'Quiet Night', tagline: 'For late nights and deep work.' },
}

interface AtmosphereState {
  daypart: Daypart
  auto: boolean
  night: boolean
  /** motion pace multiplier — morning quicker, night slower */
  pace: number
  choose: (dp: Daypart) => void
  toggleAuto: () => void
}

const AtmosphereContext = createContext<AtmosphereState | null>(null)

interface Persisted {
  auto: boolean
  choice: Daypart | null
  /** when the manual pick was made — it expires back to auto (see MANUAL_TTL_MS) */
  at?: number
}

/* Picking an atmosphere is peeking at another mood of the room, not flipping a
   permanent switch. After 12 hours the room follows the sun again — otherwise a
   visitor (or Vikas) who tried Quiet Night once would see it at 4pm forever. */
const MANUAL_TTL_MS = MANUAL_TTL_HOURS * 3600 * 1000

function readPersisted(): Persisted {
  const p = readJSON<Partial<Persisted> | null>(KEYS.atmosphere, null)
  const auto = typeof p?.auto === 'boolean' ? p.auto : true
  const choice = p?.choice && p.choice in DAYPARTS ? p.choice : null
  if (!auto && (!p?.at || Date.now() - p.at > MANUAL_TTL_MS)) return { auto: true, choice: null }
  return { auto, choice }
}

export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const [{ auto, choice }, setPref] = useState(readPersisted)
  const [clockPart, setClockPart] = useState<Daypart>(daypartFromClock)

  const daypart: Daypart = !auto && choice ? choice : clockPart

  // Auto mode follows the IST clock; re-check alongside the pill's 30s tick.
  useEffect(() => {
    const t = setInterval(() => setClockPart(daypartFromClock()), 30000)
    return () => clearInterval(t)
  }, [])

  // The whole page is themed: attributes on <html> so body + tokens respond. (An inline
  // script in index.html sets these before first paint too — this keeps them in sync as
  // the daypart changes.) The browser-chrome color follows the resolved ground.
  useEffect(() => {
    const root = document.documentElement
    const dp = DAYPARTS[daypart]
    const apply = () => {
      root.dataset.theme = dp.theme
      root.dataset.treatment = dp.treatment
      const meta = document.getElementById('theme-color')
      const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
      if (meta && bg) meta.setAttribute('content', bg)
      setFavicon(daypart)
    }
    const changing = root.dataset.theme !== dp.theme || root.dataset.treatment !== dp.treatment
    if (changing && !prefersReducedMotion() && document.startViewTransition) {
      vtCount += 1
      root.classList.add('atmo-vt')
      const vt = document.startViewTransition(apply)
      void vt.finished.finally(() => {
        vtCount -= 1
        if (vtCount === 0) root.classList.remove('atmo-vt')
      })
    } else {
      // first paint (the boot script already set the attributes), reduced
      // motion, or no View Transitions support — the CSS fallback applies
      apply()
    }
  }, [daypart])

  const value = useMemo<AtmosphereState>(
    () => ({
      daypart,
      auto,
      night: daypart === 'night',
      pace: DECK.pace[daypart] ?? 1,
      choose: (dp) => {
        const next: Persisted = { auto: false, choice: dp, at: Date.now() }
        setPref(next)
        writeJSON(KEYS.atmosphere, next)
      },
      toggleAuto: () => {
        const on = !auto
        const next: Persisted = { auto: on, choice: on ? null : daypart, at: Date.now() }
        setPref(next)
        writeJSON(KEYS.atmosphere, next)
        if (on) setClockPart(daypartFromClock())
      },
    }),
    [daypart, auto],
  )

  return <AtmosphereContext.Provider value={value}>{children}</AtmosphereContext.Provider>
}

export function useAtmosphere(): AtmosphereState {
  const ctx = useContext(AtmosphereContext)
  if (!ctx) throw new Error('useAtmosphere outside provider')
  return ctx
}
