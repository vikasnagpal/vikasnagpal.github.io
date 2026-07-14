import { BOOT_HOURS } from './atmosphereBoot'

/* Time, season and weather all follow Bangalore (IST) — deliberately.
   It's Vikas' room, not the visitor's. */

export type Daypart = 'morning' | 'evening' | 'night'
export type Season = 'spring' | 'monsoon' | 'autumn' | 'winter'

/* IST wall-clock parts via Intl.formatToParts — spec-guaranteed, unlike the
   old trick of re-parsing a toLocaleString() through new Date() (which every
   modern engine happens to accept, but no spec promises). Falls back to the
   visitor's local clock if the IANA zone is somehow unavailable. */
let fmt: Intl.DateTimeFormat | null | undefined
function istFormatter(): Intl.DateTimeFormat | null {
  if (fmt !== undefined) return fmt
  try {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    })
  } catch {
    fmt = null
  }
  return fmt
}

interface IstClock {
  year: number
  /** 0-based, like Date#getMonth */
  month: number
  day: number
  hour: number
  minute: number
}

function istClock(from?: Date): IstClock {
  const d = from ?? new Date()
  const f = istFormatter()
  if (f) {
    try {
      const p: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {}
      for (const part of f.formatToParts(d)) p[part.type] = part.value
      return { year: +p.year!, month: +p.month! - 1, day: +p.day!, hour: +p.hour!, minute: +p.minute! }
    } catch {
      /* fall through to local time */
    }
  }
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), hour: d.getHours(), minute: d.getMinutes() }
}

/** "3:35 pm" — lowercase, thin space intentional (casual warmth over correctness) */
export function istTimeString(): string {
  const { hour, minute } = istClock()
  const ap = hour >= 12 ? 'pm' : 'am'
  const h = hour % 12 || 12
  return `${h}:${String(minute).padStart(2, '0')} ${ap}`
}

/** 5–14 Morning Light · 14–19 Golden Hour · 19–5 Quiet Night.
    Bangalore sun: first light ~5:30, warm afternoon slant from ~2pm,
    sunset ~6:30 — so noon stays "fresh and bright", not golden.
    (The pre-paint script is generated from these same BOOT_HOURS.) */
export function daypartFromClock(): Daypart {
  const { hour } = istClock()
  const { morningStart, eveningStart, nightStart } = BOOT_HOURS
  return hour >= morningStart && hour < eveningStart ? 'morning' : hour >= eveningStart && hour < nightStart ? 'evening' : 'night'
}

export function istSeason(): Season {
  const { month: m } = istClock()
  return m >= 2 && m <= 4 ? 'spring' : m >= 5 && m <= 8 ? 'monsoon' : m >= 9 && m <= 10 ? 'autumn' : 'winter'
}

const MONS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export interface DateParts {
  day: string
  mon: string
  yr: string
}

/** IST calendar-date parts for the guestbook cards ("09 / Jul '26"). */
export function istDateParts(from?: Date): DateParts {
  const { year, month, day } = istClock(from)
  return {
    day: String(day).padStart(2, '0'),
    mon: MONS[month],
    yr: String(year % 100),
  }
}
