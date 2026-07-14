import { useEffect, useState } from 'react'
import { useConfig } from '../../config'
import { KEYS, readRaw, writeRaw } from '../../lib/storage'

export type WeatherKind = 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunder' | 'fog'

const KINDS: readonly WeatherKind[] = ['clear', 'partly', 'cloudy', 'rain', 'thunder', 'fog']

/* Weather in the pill is time-free by design: the atmosphere lamp (sun/sunset/
   moon) owns the celestial story, so the weather slot only reports what's IN
   the sky — clouds, rain, fog, lightning. Precipitation codes win; otherwise
   cloud cover decides the clear/partly/cloudy family (the WMO code's clear
   boundary is stricter than how people read a sky — 12% cover is "partly" to
   most eyes, and to Google). */
function classify(code: number, cover: number | undefined): WeatherKind {
  if (code === 45 || code === 48) return 'fog'
  if (code >= 95) return 'thunder'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if (typeof cover === 'number') return cover < 12 ? 'clear' : cover < 70 ? 'partly' : 'cloudy'
  return code === 0 ? 'clear' : code === 1 || code === 2 ? 'partly' : 'cloudy'
}

/* One successful fetch per session — the pill unmounts on every trip to an
   inner page, and the Bangalore sky doesn't change that fast. A failed fetch
   leaves this unset so a later remount retries. */
let fetchedThisSession = false

/** One fetch to Open-Meteo (Bangalore, no API key) on mount; offline falls back
    silently to the last-known sky, then cloudy. The tweaks override wins when set. */
export function useWeather(): WeatherKind {
  const { weatherOverride } = useConfig()
  // First paint shows the last fetch's sky, not a hardcoded cloud — otherwise
  // every refresh flashes the default icon and swaps when the API answers.
  const [weather, setWeather] = useState<WeatherKind>(() => {
    const cached = readRaw(KEYS.weather) as WeatherKind | null
    return cached && KINDS.includes(cached) ? cached : 'cloudy'
  })

  useEffect(() => {
    if (fetchedThisSession) return
    let alive = true
    fetch('https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=weather_code,cloud_cover')
      .then((r) => r.json())
      .then((d) => {
        const c = d?.current?.weather_code
        if (typeof c === 'number') {
          fetchedThisSession = true
          const kind = classify(c, d?.current?.cloud_cover)
          writeRaw(KEYS.weather, kind)
          if (alive) setWeather(kind)
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return weatherOverride !== 'auto' ? weatherOverride : weather
}
