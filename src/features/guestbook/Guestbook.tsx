import { useGuestbook } from './useGuestbook'
import { Deck } from './Deck'
import './guestbook.css'

/* The right panel: a stack of thoughts someone left behind, and the door to
   leaving your own. */

export function Guestbook() {
  const gb = useGuestbook()
  const reading = gb.mode === 'read'

  return (
    <div className="gb-panel" data-panel>
      <div className="gb-head">
        <div className="gb-title">
          <span>Guestbook</span>
          <svg
            width="20"
            height="20.7"
            viewBox="0 0 24 24.863"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="gb-title-ico"
          >
            <path d="M4 3 H20 A2.4 2.4 0 0 1 22.4 5.4 V15.6 A2.4 2.4 0 0 1 20 18 H10.4 L5.2 22.2 A0.6 0.6 0 0 1 4.2 21.7 V18 A2.4 2.4 0 0 1 1.6 15.6 V5.4 A2.4 2.4 0 0 1 4 3 Z" />
            <path d="M7 8.6 H17 M7 12.4 H13.2" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="gb-sub">A thought someone left behind.</div>
      </div>

      <div className="gb-deckrow">
        <div className="gb-deckhover" onMouseEnter={() => gb.setPeek(true)} onMouseLeave={() => gb.setPeek(false)}>
          <Deck gb={gb} />
        </div>
      </div>

      <div
        className="gb-foot"
        style={{ opacity: reading ? 1 : 0, visibility: reading ? 'visible' : 'hidden' }}
        aria-hidden={!reading}
      >
        <button className="gb-again" data-spin onClick={gb.shuffle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 12 A8 8 0 1 1 6.5 17.8" />
            <path d="M4 8 L4 12 L8 12" />
          </svg>
          <span>tap for another</span>
        </button>
        <button className="gb-writebtn" onClick={gb.startWrite}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 20 L4.5 16 L15 5.5 L18.5 9 L8 19.5 Z" />
            <path d="M13 7.5 L16.5 11" />
            <path d="M4 20 L20 20" />
          </svg>
          <span>Leave a note</span>
        </button>
      </div>
    </div>
  )
}
