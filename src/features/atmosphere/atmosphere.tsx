import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { daypartFromClock, type Daypart } from '../../lib/ist'
import { KEYS, readJSON, writeJSON } from '../../lib/storage'
import { DECK } from '../../motion/tokens'

/* Atmospheres are moods of the workspace, not themes. Each carries a theme
   (ink set) and a container treatment; both land as attributes on <html>. */

export const DAYPARTS: Record<Daypart, { theme: 'light' | 'dark'; treatment: string; name: string; tagline: string }> = {
  morning: { theme: 'light', treatment: 'Open · proximity', name: 'Morning Light', tagline: 'Fresh and bright, like a new day.' },
  evening: { theme: 'light', treatment: 'Unified ground', name: 'Golden Hour', tagline: 'Warm afternoons and softer shadows.' },
  night: { theme: 'dark', treatment: 'Unified ground', name: 'Quiet Night', tagline: 'For late nights and deep work.' },
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
const MANUAL_TTL_MS = 12 * 3600 * 1000

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
    root.dataset.theme = dp.theme
    root.dataset.treatment = dp.treatment
    const meta = document.getElementById('theme-color')
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
    if (meta && bg) meta.setAttribute('content', bg)
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
