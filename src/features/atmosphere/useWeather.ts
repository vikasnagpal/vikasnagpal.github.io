import { useEffect, useState } from 'react'
import { useConfig } from '../../config'

export type WeatherKind = 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunder' | 'fog'

function weatherFromCode(c: number): WeatherKind {
  if (c === 0) return 'clear'
  if (c === 1 || c === 2) return 'partly'
  if (c === 3) return 'cloudy'
  if (c === 45 || c === 48) return 'fog'
  if (c >= 95) return 'thunder'
  if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return 'rain'
  return 'cloudy'
}

/** One fetch to Open-Meteo (Bangalore, no API key) on mount; offline falls back
    silently to cloudy. The tweaks override wins when set. */
export function useWeather(): WeatherKind {
  const { weatherOverride } = useConfig()
  const [weather, setWeather] = useState<WeatherKind>('cloudy')

  useEffect(() => {
    let alive = true
    fetch('https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=weather_code')
      .then((r) => r.json())
      .then((d) => {
        const c = d?.current?.weather_code
        if (alive && typeof c === 'number') setWeather(weatherFromCode(c))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return weatherOverride !== 'auto' ? weatherOverride : weather
}
