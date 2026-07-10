import { useEffect, useState } from 'react'
import { istTimeString } from '../../lib/ist'

/** "Bangalore, 3:35 pm" — IST, ticking every 30s. */
export function useClock(): string {
  const [time, setTime] = useState(istTimeString)
  useEffect(() => {
    const t = setInterval(() => setTime(istTimeString()), 30000)
    return () => clearInterval(t)
  }, [])
  return time
}
