import type { ReactNode } from 'react'
import { useConfig } from '../config'
import { PageFrame } from '../features/pages/PageFrame'
import { WORK } from '../lib/routeMeta'
import './work.css'

/* Work together — three ways in, each told the way Vikas would across a
   desk: a hand-drawn icon in the margin (the nav trio's stroke language),
   the arrangement's name as the heading (structural, scannable), the
   visitor's situation under it in the guestbook's serif voice, then the
   answer in plain body text. (Earlier cuts: a script "→ tag" after the
   answer read as a CTA that wasn't clickable; without the icons the blocks
   read as a services menu — the only ink-free stretch of the site.) Offer
   hairlines share --ps-rule so every atmosphere restyles them. */

const ICON_PROPS = {
  width: 44,
  height: 44,
  viewBox: '0 0 72 72',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

const OFFERS: { title: string; situation: string; answer: string; icon: ReactNode }[] = [
  {
    title: 'Founding designer',
    situation: 'You have an idea, or a rough prototype, and you need a real version 1.0.',
    answer:
      "I work alongside you to build it — the founding designer who comes in before there's a team to hire one.",
    // a sprout: the thing that grows before there's a garden
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M22 59 C30 62, 42 62, 50 59" />
        <path d="M36 58 C36 50, 36 44, 36 37" />
        <path d="M36 45 C28 45, 22 39, 21 30 C29 30, 35 37, 36 45 Z" />
        <path d="M36 37 C36 27, 42 20, 51 19 C51 28, 45 36, 36 37 Z" />
      </svg>
    ),
  },
  {
    title: 'Design advisory',
    situation: 'You mostly need a thinking partner — someone to talk a decision through now and then.',
    answer:
      "A lighter touch. I'm on call for the product and design questions that are easier to work out with someone who's seen them before. One-off sessions, or a simple monthly retainer.",
    // two voices: a conversation, one answering the other
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M10 25 C10 19.5 14.5 16 20 16 H37 C42.5 16 46 19.5 46 25 V31 C46 36.5 42.5 40 37 40 H27 L18 48 V40 C13 39.5 10 36.5 10 31 Z" />
        <path d="M51 25 H53 C58.5 25 62 28.5 62 34 V38 C62 43.5 58.5 47 53 47 L55 55 L45 47 C42 46.5 40 44.5 39.5 42" />
      </svg>
    ),
  },
  {
    title: 'Fractional head of design',
    situation: "You need senior design leadership, but you're not ready to hire for it full-time.",
    answer:
      'I embed with your team part-time, usually one to four months — setting direction, supporting hiring, and being the leadership presence in the room without the permanent seat. The aim is to leave behind a design function that runs well after I step out.',
    // a compass: direction you keep after the hand holding it leaves
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="36" cy="38" r="22" />
        <path d="M36 9 V13" />
        <path d="M45 27 L32 33 L27 49 L40 43 Z" />
      </svg>
    ),
  },
]

export default function Work() {
  const { calendarUrl } = useConfig()

  return (
    <PageFrame title={WORK.title} description={WORK.description}>
      <header className="wk-head">
        <h1 className="wk-title">How can I help?</h1>
        <p className="wk-intro">
          Most of the people I work with are somewhere between an idea and a team. Either they&#39;re trying to get a
          product into real hands for the first time, or they&#39;re scaling something that&#39;s started to strain at the
          edges. Wherever you are, the job is the same: enough design and structure that the work keeps moving — without
          the process becoming another thing to manage.
        </p>
      </header>

      {OFFERS.map((o) => (
        <section className="wk-offer" key={o.title}>
          <span className="wk-ico">{o.icon}</span>
          <div className="wk-body">
            <h2 className="wk-role">{o.title}</h2>
            <p className="wk-sit">{o.situation}</p>
            <p className="wk-ans">{o.answer}</p>
          </div>
        </section>
      ))}

      <section className="wk-why">
        <h2 className="wk-why-title">Why me?</h2>
        <p className="wk-ans">
          I&#39;ve spent 12+ years in design, the last eight leading teams and building products and design functions
          from scratch. I know what design needs look like at different stages of growth because I&#39;ve done it at most
          of them. I do this fractionally because a focused outside perspective, with no internal agenda, often moves
          things faster than waiting for the right full-time hire. And I&#39;ve made enough mistakes along the way to
          know what actually works versus what just sounds good in a deck.
        </p>
      </section>

      <div className="wk-cta">
        <div className="wk-script">It usually starts over a chai.</div>
        <a className="ps-cta" href={calendarUrl}>
          <span>Grab some time</span>
          <span className="ps-arrow" aria-hidden>
            →
          </span>
        </a>
      </div>
    </PageFrame>
  )
}
