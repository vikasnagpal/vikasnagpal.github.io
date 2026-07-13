import { useEffect, useState } from 'react'
import { useConfig } from '../../config'
import { KEYS, readRaw, writeRaw } from '../../lib/storage'
import { istNow } from '../../lib/ist'

export type WeatherKind = 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunder' | 'fog'

export interface Weather {
  kind: WeatherKind
  /** true after dark — clear/partly render as moons, not suns */
  night: boolean
}

const KINDS: readonly WeatherKind[] = ['clear', 'partly', 'cloudy', 'rain', 'thunder', 'fog']

function weatherFromCode(c: number): WeatherKind {
  if (c === 0) return 'clear'
  if (c === 1 || c === 2) return 'partly'
  if (c === 3) return 'cloudy'
  if (c === 45 || c === 48) return 'fog'
  if (c >= 95) return 'thunder'
  if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return 'rain'
  return 'cloudy'
}

/* Darkness guess for the first paint: Bangalore sits at 13°N, so the sun sets
   17:50–18:50 and rises 5:55–6:45 all year. The API's is_day corrects this
   within a beat; the guess only has to prevent a sun flashing at night.
   (Deliberately not the atmosphere daypart — Quiet Night starts at 19:00 as a
   mood, but the sky itself darkens before that.) */
function nightGuess(): boolean {
  const h = istNow().getHours()
  return h >= 19 || h < 6
}

/** One fetch to Open-Meteo (Bangalore, no API key) on mount; offline falls back
    silently to the last-known sky, then cloudy. The tweaks override wins when set. */
export function useWeather(): Weather {
  const { weatherOverride } = useConfig()
  // First paint shows the last fetch's sky, not a hardcoded cloud — otherwise
  // every refresh flashes the default icon and swaps when the API answers.
  const [weather, setWeather] = useState<Weather>(() => {
    const cached = readRaw(KEYS.weather) as WeatherKind | null
    return { kind: cached && KINDS.includes(cached) ? cached : 'cloudy', night: nightGuess() }
  })

  useEffect(() => {
    let alive = true
    fetch('https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=weather_code,is_day')
      .then((r) => r.json())
      .then((d) => {
        const c = d?.current?.weather_code
        if (alive && typeof c === 'number') {
          const kind = weatherFromCode(c)
          const isDay = d?.current?.is_day
          setWeather({ kind, night: typeof isDay === 'number' ? isDay === 0 : nightGuess() })
          writeRaw(KEYS.weather, kind)
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return weatherOverride !== 'auto' ? { kind: weatherOverride, night: weather.night } : weather
}
