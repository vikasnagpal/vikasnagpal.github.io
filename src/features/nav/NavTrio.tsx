import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { useLocation } from 'wouter'
import { COIN, DISCOVERY } from '../../motion/tokens'
import { useCoin, type CoinSpawn, type CoinTell } from './useCoin'
import { useBaits, type Bait } from './useBaits'
import { CoinSVG } from './CoinSVG'
import { coinArc, tellTilt, glintPeek } from '../../motion/choreographies/coin'
import { floatBurst } from '../../motion/choreographies/floats'
import { prefersReducedMotion } from '../../motion/reducedMotion'
import { registerTimeline } from '../../motion/registry'
import { useAtmosphere } from '../atmosphere/atmosphere'
import { useConfig } from '../../config'
import './nav.css'

/* Three hand-drawn icon links. The anchor (hit-area) never moves — only the inner
   wrapper lifts on hover (the original whole-anchor translate caused hover strobing;
   the "jiggle" people made while noticing that bug became the coin trigger). */

const ICON_PROPS = {
  width: 60,
  height: 60,
  viewBox: '0 0 72 72',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

const ITEMS: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: 'Work together',
    href: '/work',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M40 62 C40 50 50 40 62 40 C50 40 40 30 40 18 C40 30 30 40 18 40 C30 40 40 50 40 62 Z" />
        <path d="M21 31 C21 27 23 25 27 25 C23 25 21 23 21 19 C21 23 19 25 15 25 C19 25 21 27 21 31 Z" />
      </svg>
    ),
  },
  {
    label: 'Past adventures',
    href: '#',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 37 C21 25 28 50 37 37 C46 25 53 50 62 37" strokeWidth={3.5} />
        <path d="M16 50 C25 39 31 59 40 50 C49 41 55 58 64 50" strokeWidth={3.5} />
      </svg>
    ),
  },
  {
    label: 'Field Notes',
    href: '#',
    icon: (
      <svg {...ICON_PROPS}>
        <g transform="rotate(-8 40 40)">
          <path d="M27 17 H45 L54 26 V61 A2.5 2.5 0 0 1 51.5 63.5 H29.5 A2.5 2.5 0 0 1 27 61 Z" />
          <path d="M45 17 V26 H54" strokeWidth={2.6} />
          <path d="M33 38 H47 M33 46 H47 M33 54 H42" strokeWidth={2.6} />
        </g>
      </svg>
    ),
  },
]

interface NavItemProps {
  label: string
  href: string
  icon: ReactNode
  spawn: CoinSpawn | null
  tell: CoinTell
  note: boolean
  bait: Bait
  onEnter: () => void
  onCoinDone: () => void
  onBaitDone: () => void
}

function NavItem({ label, href, icon, spawn, tell, note, bait, onEnter, onCoinDone, onBaitDone }: NavItemProps) {
  const iconRef = useRef<HTMLSpanElement>(null)
  const coinRef = useRef<HTMLSpanElement>(null)
  const noteRef = useRef<HTMLSpanElement>(null)
  const glintRef = useRef<HTMLSpanElement>(null)
  const { night } = useAtmosphere()
  const { discovery } = useConfig()
  const [, navigate] = useLocation()

  /* Real anchors, SPA navigation: routes push state instead of reloading (a
     reload would replay the arrival and re-deal the deck), but modified
     clicks (new tab, etc.) keep native behavior. '#' placeholders do nothing —
     navigating to '#' scrolls the page to the top. */
  const onClick = (e: React.MouseEvent) => {
    if (href === '#') return e.preventDefault()
    if (!href.startsWith('/')) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(href)
  }

  /* The touch analog of the hover jiggle: rubbing the icon. Each horizontal
     stroke ≥ rubStrokePx counts as one "re-entry" — back-and-forth makes three
     fast ones (tell on the 2nd, coin on the 3rd). A plain swipe or scroll is a
     single stroke at most, so it can never trigger. */
  const rub = useRef<{ x: number; dir: number; travel: number; fired: boolean } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    rub.current = { x: e.touches[0].clientX, dir: 0, travel: 0, fired: false }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const r = rub.current
    if (!r) return
    const x = e.touches[0].clientX
    const dx = x - r.x
    r.x = x
    if (dx === 0) return
    const dir = dx > 0 ? 1 : -1
    if (dir !== r.dir) {
      r.dir = dir
      r.travel = 0
      r.fired = false
    }
    r.travel += Math.abs(dx)
    if (!r.fired && r.travel >= COIN.rubStrokePx) {
      r.fired = true
      onEnter()
    }
  }
  const onTouchEnd = () => {
    rub.current = null
  }

  /* The desktop analog of the rub: wiggling the cursor ON the icon. Unlike touch,
     strokes only count after a direction reversal — a straight pass through the
     hit area is one direction and can never fire; only deliberate back-and-forth
     does. Entering (1) + two reversal strokes (2, 3) completes the trigger. */
  const wig = useRef<{ x: number; dir: number; travel: number; fired: boolean; reversed: boolean } | null>(null)
  const onMouseMove = (e: React.MouseEvent) => {
    if (!discovery.wiggle) return
    let w = wig.current
    if (!w) {
      w = wig.current = { x: e.clientX, dir: 0, travel: 0, fired: false, reversed: false }
      return
    }
    const dx = e.clientX - w.x
    w.x = e.clientX
    if (dx === 0) return
    const dir = dx > 0 ? 1 : -1
    if (dir !== w.dir) {
      if (w.dir !== 0) w.reversed = true
      w.dir = dir
      w.travel = 0
      w.fired = false
    }
    w.travel += Math.abs(dx)
    if (w.reversed && !w.fired && w.travel >= DISCOVERY.wiggleStrokePx) {
      w.fired = true
      onEnter()
    }
  }
  const onMouseLeave = () => {
    wig.current = null
  }

  useGSAP(
    () => {
      if (tell && iconRef.current && !spawn)
        tellTilt(iconRef.current, tell === 'whisper' ? DISCOVERY.whisperDeg : COIN.tellDeg)
    },
    { dependencies: [tell] },
  )

  useGSAP(
    () => {
      if (bait === 'glint' && glintRef.current) {
        registerTimeline('coin-glint', glintPeek(glintRef.current, { onComplete: onBaitDone }))
      }
    },
    { dependencies: [bait] },
  )

  useGSAP(
    () => {
      if (!spawn || !coinRef.current) return
      const tl = coinArc(coinRef.current, iconRef.current, {
        rare: spawn.rare,
        reduced: prefersReducedMotion(),
        onComplete: onCoinDone,
      })
      registerTimeline('coin', tl)
    },
    { dependencies: [spawn?.key] },
  )

  useGSAP(
    () => {
      if (note && noteRef.current) floatBurst(noteRef.current)
    },
    { dependencies: [note] },
  )

  return (
    <a
      href={href}
      className="nav-item"
      data-nav
      onMouseEnter={onEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onClick={onClick}
    >
      {spawn && (
        <span className="nav-coin" ref={coinRef} aria-hidden>
          <CoinSVG variant={spawn.variant} night={night} />
        </span>
      )}
      {bait === 'glint' && (
        <span className="nav-glint" aria-hidden>
          <span className="nav-glint-coin" ref={glintRef}>
            <CoinSVG variant="gold" night={night} />
          </span>
        </span>
      )}
      {note && (
        <span className="nav-note" ref={noteRef} aria-hidden>
          Nice catch.
        </span>
      )}
      <span className="nav-inner" data-nav-inner>
        <span className="nav-icon" ref={iconRef}>
          {icon}
        </span>
        <span className="nav-label">{label}</span>
      </span>
    </a>
  )
}

export function NavTrio() {
  const { coins, tells, notes, navHover, clearCoin } = useCoin(ITEMS.length)
  const { baits, clearBait } = useBaits(ITEMS.length)

  return (
    <nav className="nav-grid" aria-label="Sections">
      {ITEMS.map((item, i) => (
        <NavItem
          key={item.label}
          {...item}
          spawn={coins[i]}
          tell={tells[i]}
          note={notes[i]}
          bait={baits[i]}
          onEnter={() => navHover(i)}
          onCoinDone={() => clearCoin(i)}
          onBaitDone={() => clearBait(i)}
        />
      ))}
    </nav>
  )
}
