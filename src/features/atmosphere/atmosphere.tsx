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
}

function readPersisted(): Persisted {
  const p = readJSON<Partial<Persisted> | null>(KEYS.atmosphere, null)
  const auto = typeof p?.auto === 'boolean' ? p.auto : true
  const choice = p?.choice && p.choice in DAYPARTS ? p.choice : null
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

  // The whole page is themed: attributes on <html> so body + tokens respond.
  useEffect(() => {
    const dp = DAYPARTS[daypart]
    document.documentElement.dataset.theme = dp.theme
    document.documentElement.dataset.treatment = dp.treatment
  }, [daypart])

  const value = useMemo<AtmosphereState>(
    () => ({
      daypart,
      auto,
      night: daypart === 'night',
      pace: DECK.pace[daypart] ?? 1,
      choose: (dp) => {
        setPref({ auto: false, choice: dp })
        writeJSON(KEYS.atmosphere, { auto: false, choice: dp })
      },
      toggleAuto: () => {
        const next = !auto
        setPref({ auto: next, choice: next ? null : daypart })
        writeJSON(KEYS.atmosphere, { auto: next, choice: next ? null : daypart })
        if (next) setClockPart(daypartFromClock())
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
