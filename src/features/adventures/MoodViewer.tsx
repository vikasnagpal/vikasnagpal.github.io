import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../motion/reducedMotion'

/* The three moods, cross-fading in place instead of sitting side by side as a
   triptych. Three small shots of the same page prove they're different; one
   shot changing light proves it's the same room.

   It drifts on its own so the change is something you catch rather than
   something you operate, and it stops the moment you pick a mood yourself. It
   only runs while it's actually on screen — an idle animation playing to an
   empty theater is the exact thing this case study admits to cutting. */

interface Mood {
  key: string
  name: string
  src: string
}

const HOLD_MS = 3400

export function MoodViewer({ base }: { base: string }) {
  const MOODS: Mood[] = [
    { key: 'morning', name: 'Morning Light', src: `${base}/mood-morning.png` },
    { key: 'evening', name: 'Golden Hour', src: `${base}/mood-golden.png` },
    { key: 'night', name: 'Quiet Night', src: `${base}/mood-night.png` },
  ]

  const [at, setAt] = useState(0)
  const [held, setHeld] = useState(false)
  const [seen, setSeen] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = frameRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver((entries) => setSeen(entries[0].isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (held || !seen || prefersReducedMotion()) return
    const t = setInterval(() => setAt((i) => (i + 1) % MOODS.length), HOLD_MS)
    return () => clearInterval(t)
  }, [held, seen, MOODS.length])

  return (
    <figure className="cs-fig cs-moods">
      <div className="cs-mood-frame" ref={frameRef}>
        {MOODS.map((m, i) => (
          <img
            key={m.key}
            src={m.src}
            alt={`The home page in ${m.name}`}
            loading="lazy"
            data-on={i === at || undefined}
            aria-hidden={i !== at}
          />
        ))}
      </div>
      <div className="cs-mood-picks" role="group" aria-label="Choose a mood">
        {MOODS.map((m, i) => (
          <button
            key={m.key}
            type="button"
            className="cs-mood-pick"
            data-on={i === at || undefined}
            aria-pressed={i === at}
            onClick={() => {
              setAt(i)
              setHeld(true)
            }}
          >
            {m.name}
          </button>
        ))}
      </div>
      <figcaption className="cs-cap">
        Same room, three times of day. It drifts on its own until you pick one.
      </figcaption>
    </figure>
  )
}
