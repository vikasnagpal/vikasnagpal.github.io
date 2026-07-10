import type { ReactNode } from 'react'
import type { Thought } from '../../lib/seeds'

/* Card anatomy: emoji top-left, large date top-right, oversized serif open-quote,
   the thought in Newsreader. Type steps down over four tiers as text grows. */

function noteFont(text: string) {
  const n = (text || '').length
  if (n <= 76) return { fs: 30, lh: 1.28, fw: 'var(--quote-weight)' as string | number, ls: '0', qTop: 20, qFs: 62, qH: 30 }
  if (n <= 108) return { fs: 26, lh: 1.34, fw: 600, ls: '0.002em', qTop: 18, qFs: 58, qH: 28 }
  if (n <= 137) return { fs: 23, lh: 1.4, fw: 600, ls: '0.003em', qTop: 16, qFs: 54, qH: 26 }
  return { fs: 20, lh: 1.42, fw: 500, ls: '0.004em', qTop: 12, qFs: 50, qH: 24 }
}

export function QuoteCard({ thought, isFront, bar }: { thought: Thought; isFront: boolean; bar?: ReactNode }) {
  const f = noteFont(thought.text)
  return (
    <div className={`gb-quote${isFront ? ' is-front' : ''}`}>
      <div className="gb-top">
        <span className="gb-emoji">{thought.emoji}</span>
        <div className="gb-date">
          <div className="gb-day">{thought.day}</div>
          <div className="gb-mon">
            {thought.mon} &#39;{thought.yr}
          </div>
        </div>
      </div>
      <div style={{ marginTop: f.qTop }}>
        <div className="gb-qmark" style={{ fontSize: f.qFs, height: f.qH }}>
          &ldquo;
        </div>
        <div className="gb-text" style={{ fontSize: f.fs, lineHeight: f.lh, fontWeight: f.fw as number, letterSpacing: f.ls }}>
          {thought.text}
        </div>
      </div>
      {isFront && bar}
    </div>
  )
}
