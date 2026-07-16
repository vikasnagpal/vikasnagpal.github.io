import { useCallback, useRef, useState } from 'react'
import { COIN, DISCOVERY } from '../../motion/tokens'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import type { CoinRare } from '../../motion/choreographies/coin'
import { KEYS, readJSON, writeJSON } from '../../lib/storage'
import { chime } from '../../lib/audio'
import { useAtmosphere } from '../atmosphere/atmosphere'
import { useConfig } from '../../config'

/* The easter egg, born from a hover-flicker bug. Trigger: entering the same nav
   item 3 times within the fast window (leaving and returning counts; on-icon
   wiggle strokes and touch rub strokes count too). Phase 2 on top: coral every
   10th lifetime coin, soft probabilistic damping after ~8 per session, rare
   unexplained variations. Lifetime ledger feeds the 50-coin P.S. secret.

   Discovery ladder (see DISCOVERY tokens): a slow second look whispers (2°),
   a fast re-entry tells (5°), the third fast entry pays out. */

export type CoinVariant = 'gold' | 'coral'

/** Escalating pre-coin signals: faint whisper → the 5° tell */
export type CoinTell = null | 'whisper' | 'tell'

export interface CoinSpawn {
  variant: CoinVariant
  rare: CoinRare
  key: number
}

export interface CoinLedger {
  total: number
}

export const COINS_EVENT = 'vikas:coins'

interface UseCoin {
  coins: (CoinSpawn | null)[]
  tells: CoinTell[]
  notes: boolean[]
  navHover: (i: number) => void
  clearCoin: (i: number) => void
}

const none = <T,>(n: number, v: T): T[] => Array(n).fill(v)
const only = <T,>(n: number, i: number, v: T, off: T): T[] => none(n, off).map((_, j) => (j === i ? v : off))

export function useCoin(count = 3): UseCoin {
  const { night } = useAtmosphere()
  const { discovery } = useConfig()
  const [coins, setCoins] = useState<(CoinSpawn | null)[]>(none(count, null))
  const [tells, setTells] = useState<CoinTell[]>(none<CoinTell>(count, null))
  const [notes, setNotes] = useState<boolean[]>(none(count, false))
  const hoverLog = useRef<Record<number, number[]>>({})
  const session = useRef(0)
  const seq = useRef(0)
  const coinsRef = useRef(coins)
  coinsRef.current = coins

  const popCoin = useCallback(
    (i: number) => {
      if (coinsRef.current[i]) return // one coin at a time per item

      // Phase 2 damping: the toy quietly winds down; nobody gets told "no"
      if (session.current >= COIN.dampAfter && Math.random() > COIN.dampChance) return

      const ledger = readJSON<CoinLedger>(KEYS.coins, { total: 0 })
      const firstEver = !ledger.total
      ledger.total = (ledger.total || 0) + 1
      writeJSON(KEYS.coins, ledger)
      window.dispatchEvent(new CustomEvent(COINS_EVENT, { detail: ledger.total }))
      session.current += 1

      const variant: CoinVariant = ledger.total % COIN.coralEvery === 0 ? 'coral' : 'gold'
      const rare: CoinRare = Math.random() < COIN.rareOdds ? (Math.random() < 0.5 ? 'spin' : 'wobble') : 'none'

      const spawn = () => {
        seq.current += 1
        const spawnData: CoinSpawn = { variant, rare, key: seq.current }
        setCoins((arr) => arr.map((c, j) => (j === i ? spawnData : c)))
        setTells(none<CoinTell>(count, null))
        chime({ octaveUp: variant === 'coral', night })
        // a tiny physical tick on devices that can do it (Android; iOS has no API)
        try {
          navigator.vibrate?.(10)
        } catch {
          /* haptics are a bonus, never a failure */
        }
        if (firstEver) {
          // First discovery is the whole memory — a handwritten note, once, never again
          setTimeout(() => {
            setNotes(only(count, i, true, false))
            setTimeout(() => setNotes(none(count, false)), 1950)
          }, COIN.noteDelayMs)
        }
      }

      if (firstEver && !prefersReducedMotion()) {
        // slowed slightly: the icon reacts, a beat, then the coin
        setTells(only<CoinTell>(count, i, 'tell', null))
        setTimeout(spawn, COIN.firstCatchBeatMs)
      } else {
        spawn()
      }
    },
    [count, night],
  )

  const navHover = useCallback(
    (i: number) => {
      const now = Date.now()
      // Two windows: fast entries arm the trigger; slower ones (whisper window)
      // only feed the faint first rung of the ladder.
      const fastMs = discovery.wiggle ? DISCOVERY.windowMs : COIN.windowMs
      const keepMs = discovery.whisper ? Math.max(fastMs, DISCOVERY.whisperWindowMs) : fastMs
      const log = (hoverLog.current[i] ?? []).filter((ts) => now - ts < keepMs)
      log.push(now)
      hoverLog.current[i] = log
      const fast = log.filter((ts) => now - ts < fastMs).length

      if (fast >= 3) {
        hoverLog.current[i] = []
        popCoin(i)
        return
      }
      if (coinsRef.current[i] || prefersReducedMotion()) return
      const tell: CoinTell = fast === 2 ? 'tell' : discovery.whisper && log.length >= 2 ? 'whisper' : null
      if (tell) {
        setTells(only<CoinTell>(count, i, tell, null))
        setTimeout(() => setTells(none<CoinTell>(count, null)), 420)
      }
    },
    [count, popCoin, discovery.whisper, discovery.wiggle],
  )

  const clearCoin = useCallback((i: number) => {
    setCoins((arr) => arr.map((c, j) => (j === i ? null : c)))
  }, [])

  return { coins, tells, notes, navHover, clearCoin }
}
