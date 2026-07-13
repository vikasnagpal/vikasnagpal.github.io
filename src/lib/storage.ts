/* Typed, throw-safe localStorage access for every vikas-* key. */

export const KEYS = {
  atmosphere: 'vikas-atmosphere-v2',
  reactions: 'vikas-reactions-v1',
  lastVisit: 'vikas-last-visit',
  coins: 'vikas-coins-v1',
  visitor: 'vikas-visitor-v1',
  weather: 'vikas-weather-v1',
  favicon: 'vikas-favicon-v1',
} as const

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage may be unavailable — the site simply forgets */
  }
}

export function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeRaw(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}
