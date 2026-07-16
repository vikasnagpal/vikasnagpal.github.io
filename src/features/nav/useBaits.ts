import { useCallback, useEffect, useRef, useState } from 'react'
import { DISCOVERY } from '../../motion/tokens'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { KEYS, readJSON } from '../../lib/storage'
import { returning } from '../../lib/visit'
import { useConfig } from '../../config'
import { COINS_EVENT, type CoinLedger } from './useCoin'

/* Ambient baits — the unprompted half of the scent trail. Two flavors:
   - stir: after long stillness one icon shifts in its sleep
   - glint: a gold edge surfaces from behind an icon and ducks back
   Hard rules: at most ONE bait per session (first to fire wins), only before the
   first coin is ever found (after discovery the room goes quiet again), only for
   returning visitors when the gate is on, never under reduced motion. */

export type Bait = null | 'stir' | 'glint'

/** Dev preview: the tweaks panel dispatches this to fire a bait on demand */
export const BAIT_EVENT = 'vikas:bait'

const ACTIVITY = ['pointermove', 'pointerdown', 'scroll', 'keydown', 'touchstart'] as const

interface UseBaits {
  baits: Bait[]
  clearBait: (i: number) => void
}

export function useBaits(count = 3): UseBaits {
  const { discovery } = useConfig()
  const [baits, setBaits] = useState<Bait[]>(Array(count).fill(null))
  const fired = useRef(false) // one ambient bait per session, shared across flavors
  const found = useRef(readJSON<CoinLedger>(KEYS.coins, { total: 0 }).total > 0)

  const fire = useCallback(
    (kind: Exclude<Bait, null>) => {
      const i = Math.floor(Math.random() * count)
      setBaits((arr) => arr.map((b, j) => (j === i ? kind : b)))
    },
    [count],
  )

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
    const eligible = () =>
      !fired.current &&
      !found.current &&
      !prefersReducedMotion() &&
      document.visibilityState === 'visible' &&
      (!discovery.returningOnly || returning)

    let idleTimer: ReturnType<typeof setTimeout> | undefined
    const armIdle = () => {
      clearTimeout(idleTimer)
      if (!discovery.idleStir || fired.current) return
      idleTimer = setTimeout(() => {
        if (!eligible()) return
        fired.current = true
        fire('stir')
      }, DISCOVERY.idleMs)
    }
    const onActivity = () => armIdle()
    const onVisible = () => {
      if (document.visibilityState === 'visible') armIdle()
    }

    let glintTimer: ReturnType<typeof setTimeout> | undefined
    const armGlint = (delay: number) => {
      clearTimeout(glintTimer)
      if (!discovery.glint || fired.current) return
      glintTimer = setTimeout(() => {
        // tab hidden: the slip waits for another moment instead of being wasted
        if (document.visibilityState !== 'visible') return armGlint(DISCOVERY.glintDelayMsMin)
        if (!eligible()) return
        if (Math.random() > DISCOVERY.glintChance) return // no glint this session
        fired.current = true
        fire('glint')
      }, delay)
    }

    ACTIVITY.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }))
    document.addEventListener('visibilitychange', onVisible)
    armIdle()
    armGlint(DISCOVERY.glintDelayMsMin + Math.random() * (DISCOVERY.glintDelayMsMax - DISCOVERY.glintDelayMsMin))

    // Dev preview: bypasses every gate so each bait can be reviewed on demand
    const onPreview = (e: Event) => {
      const kind = (e as CustomEvent<Exclude<Bait, null>>).detail
      if (kind === 'stir' || kind === 'glint') fire(kind)
    }
    window.addEventListener(BAIT_EVENT, onPreview)

    return () => {
      clearTimeout(idleTimer)
      clearTimeout(glintTimer)
      ACTIVITY.forEach((ev) => window.removeEventListener(ev, onActivity))
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener(BAIT_EVENT, onPreview)
    }
  }, [discovery.idleStir, discovery.glint, discovery.returningOnly, fire])

  return { baits, clearBait }
}
