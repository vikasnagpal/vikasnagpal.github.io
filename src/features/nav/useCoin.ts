import { useCallback, useRef, useState } from 'react'
import { COIN } from '../../motion/tokens'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import type { CoinRare } from '../../motion/choreographies/coin'
import { KEYS, readJSON, writeJSON } from '../../lib/storage'
import { chime } from '../../lib/audio'
import { useAtmosphere } from '../atmosphere/atmosphere'

/* The easter egg, born from a hover-flicker bug. Trigger: entering the same nav
   item 3 times within 3s (leaving and returning counts). Phase 2 on top: coral
   every 10th lifetime coin, soft probabilistic damping after ~8 per session,
   rare unexplained variations. Lifetime ledger feeds the 50-coin P.S. secret. */

export type CoinVariant = 'gold' | 'coral'

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
  tells: boolean[]
  notes: boolean[]
  navHover: (i: number) => void
  clearCoin: (i: number) => void
}

const none = <T,>(n: number, v: T): T[] => Array(n).fill(v)
const only = (n: number, i: number): boolean[] => none(n, false).map((_, j) => j === i)

export function useCoin(count = 3): UseCoin {
  const { night } = useAtmosphere()
  const [coins, setCoins] = useState<(CoinSpawn | null)[]>(none(count, null))
  const [tells, setTells] = useState<boolean[]>(none(count, false))
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
        setTells(none(count, false))
        chime({ octaveUp: variant === 'coral', night })
        if (firstEver) {
          // First discovery is the whole memory — a handwritten note, once, never again
          setTimeout(() => {
            setNotes(only(count, i))
            setTimeout(() => setNotes(none(count, false)), 1950)
          }, COIN.noteDelayMs)
        }
      }

      if (firstEver && !prefersReducedMotion()) {
        // slowed slightly: the icon reacts, a beat, then the coin
        setTells(only(count, i))
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
      const log = (hoverLog.current[i] ?? []).filter((ts) => now - ts < COIN.windowMs)
      log.push(now)
      hoverLog.current[i] = log

      if (log.length === 2 && !coinsRef.current[i] && !prefersReducedMotion()) {
        setTells(only(count, i))
        setTimeout(() => setTells(none(count, false)), 420)
      }
      if (log.length >= 3) {
        hoverLog.current[i] = []
        popCoin(i)
      }
    },
    [count, popCoin],
  )

  const clearCoin = useCallback((i: number) => {
    setCoins((arr) => arr.map((c, j) => (j === i ? null : c)))
  }, [])

  return { coins, tells, notes, navHover, clearCoin }
}
