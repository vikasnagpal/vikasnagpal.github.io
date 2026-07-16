import { useCallback, useEffect, useRef, useState } from 'react'
import { DISCOVERY } from '../../motion/tokens'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { KEYS, readJSON } from '../../lib/storage'
import { returning } from '../../lib/visit'
import { useConfig } from '../../config'
import { COINS_EVENT, type CoinLedger } from './useCoin'

/* The ambient bait — the unprompted half of the scent trail: a gold edge
   surfaces from behind an icon and ducks back. Hard rules: at most once per
   session (and only maybe), only before the first coin is ever found (after
   discovery the room goes quiet again), only for returning visitors when the
   gate is on, never under reduced motion. */

export type Bait = null | 'glint'

/** Dev preview: the tweaks panel dispatches this to fire the glint on demand */
export const BAIT_EVENT = 'vikas:bait'

interface UseBaits {
  baits: Bait[]
  clearBait: (i: number) => void
}

export function useBaits(count = 3): UseBaits {
  const { discovery } = useConfig()
  const [baits, setBaits] = useState<Bait[]>(Array(count).fill(null))
  const fired = useRef(false) // once per session
  const found = useRef(readJSON<CoinLedger>(KEYS.coins, { total: 0 }).total > 0)

  const fire = useCallback(() => {
    const i = Math.floor(Math.random() * count)
    setBaits((arr) => arr.map((b, j) => (j === i ? 'glint' : b)))
  }, [count])

  const clearBait = useCallback((i: number) => {
    setBaits((arr) => arr.map((b, j) => (j === i ? null : b)))
  }, [])

  useEffect(() => {
    const onCoins = () => {
      found.current = true
    }
    window.addEventListener(COINS_EVENT, onCoins)
    return () => window.removeEventListener(COINS_EVENT, onCoins)
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const arm = (delay: number) => {
      clearTimeout(timer)
      if (!discovery.glint || fired.current) return
      timer = setTimeout(() => {
        // tab hidden: the slip waits for another moment instead of being wasted
        if (document.visibilityState !== 'visible') return arm(DISCOVERY.glintDelayMsMin)
        if (fired.current || found.current || prefersReducedMotion()) return
        if (discovery.returningOnly && !returning) return
        if (Math.random() > DISCOVERY.glintChance) return // no glint this session
        fired.current = true
        fire()
      }, delay)
    }
    arm(DISCOVERY.glintDelayMsMin + Math.random() * (DISCOVERY.glintDelayMsMax - DISCOVERY.glintDelayMsMin))

    // Dev preview: bypasses every gate so the glint can be reviewed on demand
    const onPreview = (e: Event) => {
      if ((e as CustomEvent<string>).detail === 'glint') fire()
    }
    window.addEventListener(BAIT_EVENT, onPreview)

    return () => {
      clearTimeout(timer)
      window.removeEventListener(BAIT_EVENT, onPreview)
    }
  }, [discovery.glint, discovery.returningOnly, fire])

  return { baits, clearBait }
}
