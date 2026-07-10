/* Time, season and weather all follow Bangalore (IST) — deliberately.
   It's Vikas' room, not the visitor's. */

export type Daypart = 'morning' | 'evening' | 'night'
export type Season = 'spring' | 'monsoon' | 'autumn' | 'winter'

export function istNow(): Date {
  try {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  } catch {
    return new Date()
  }
}

/** "3:35 pm" — lowercase, thin space intentional (casual warmth over correctness) */
export function istTimeString(): string {
  try {
    const ist = istNow()
    let h = ist.getHours()
    const m = ist.getMinutes()
    const ap = h >= 12 ? 'pm' : 'am'
    h = h % 12 || 12
    return `${h}:${String(m).padStart(2, '0')} ${ap}`
  } catch {
    return '—'
  }
}

/** 5–12 morning · 12–19 golden hour · 19–5 night */
export function daypartFromClock(): Daypart {
  const hr = istNow().getHours()
  return hr >= 5 && hr < 12 ? 'morning' : hr >= 12 && hr < 19 ? 'evening' : 'night'
}

export function istSeason(): Season {
  const m = istNow().getMonth()
  return m >= 2 && m <= 4 ? 'spring' : m >= 5 && m <= 8 ? 'monsoon' : m >= 9 && m <= 10 ? 'autumn' : 'winter'
}

const MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export interface DateParts {
  day: string
  mon: string
  yr: string
}

export function istDateParts(from?: Date): DateParts {
  const d = from ?? istNow()
  return {
    day: String(d.getDate()).padStart(2, '0'),
    mon: MONS[d.getMonth()],
    yr: String(d.getFullYear() % 100),
  }
}
