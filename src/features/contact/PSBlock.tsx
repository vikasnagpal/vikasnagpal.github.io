import { useEffect, useState } from 'react'
import { useConfig } from '../../config'
import { KEYS, readJSON } from '../../lib/storage'
import { COINS_EVENT, type CoinLedger } from '../nav/useCoin'
import './contact.css'

/* A quiet sign-off. At 50 lifetime coins the copy gains an inside joke —
   no announcement, the room just knows you. */

export function PSBlock() {
  const { calendarUrl } = useConfig()
  const [coins, setCoins] = useState(() => readJSON<CoinLedger>(KEYS.coins, { total: 0 }).total)

  useEffect(() => {
    const onCoins = (e: Event) => setCoins((e as CustomEvent<number>).detail)
    window.addEventListener(COINS_EVENT, onCoins)
    return () => window.removeEventListener(COINS_EVENT, onCoins)
  }, [])

  return (
    <div className="ps">
      <div className="ps-title">P.S.</div>
      <p className="ps-copy">
        If you are building something, stuck on a problem, or just want another brain to bounce things off
        {coins >= 50 ? ', or just want to talk about how you found all fifty hidden coins' : ''}, I&#39;d love to chat.
        Those conversations usually leave me with something new to think about too.
      </p>
      <a className="ps-cta" href={calendarUrl}>
        <span>Grab some time</span>
        <span className="ps-arrow" aria-hidden>
          →
        </span>
      </a>
    </div>
  )
}
