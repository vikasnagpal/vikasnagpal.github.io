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
    situation: 'Building the first version of a product is mostly about making good decisions quickly.',
    answer:
      "Whether you're starting with an idea, an MVP, or an early prototype, I work closely with founders and early teams to shape the product, design the experience, and iterate quickly on what we learn, until it's a product people actually want to use.",
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
    situation: "You don't need another designer. You need someone who's been through similar decisions before.",
    answer:
      "Whether you're exploring a new product direction, reviewing a design, hiring designers, or figuring out what comes next, I'll be your thinking partner. We can keep it to a one-off session or set up a simple monthly cadence.",
    // two voices: a conversation, one answering the other
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M10 25 C10 19.5 14.5 16 20 16 H37 C42.5 16 46 19.5 46 25 V31 C46 36.5 42.5 40 37 40 H27 L18 48 V40 C13 39.5 10 36.5 10 31 Z" />
        <path d="M51 25 H53 C58.5 25 62 28.5 62 34 V38 C62 43.5 58.5 47 53 47 L55 55 L45 47 C42 46.5 40 44.5 39.5 42" />
      </svg>
    ),
  },
  {
    title: 'Fractional design head',
    situation:
      'As products and teams grow, design challenges become less about screens and more about people, decisions, and how teams work together.',
    answer:
      "I join your team for a few months to provide experienced design leadership while you continue to grow. I'll work with the team to establish healthy design practices, improve how design works across product and engineering, and support hiring. The goal is to leave behind a design function that can keep growing without me.",
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
        <h1 className="pf-title">How we can work together</h1>
        <p className="wk-intro">
          Most of the people I work with are somewhere between an idea and a full design team. They&#39;re building
          their first product, searching for product-market fit, or figuring out how design needs to evolve as the
          company grows.
        </p>
        <p className="wk-intro">
          The challenge is usually the same: creating enough clarity and structure for the team to move with
          confidence, without turning process into another thing to manage. That&#39;s where I come in.
        </p>
        <p className="wk-intro">Depending on where you are today, there are a few ways I can help.</p>
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
        <h2 className="wk-why-title">Why work with me?</h2>
        <p className="wk-ans">
          Over the last 12+ years, I&#39;ve designed digital products and spent the past eight building teams and
          design practices from the ground up. Working across different stages of growth has given me the opportunity
          to learn how design needs evolve from finding product-market fit to building teams, processes, and products
          that can scale.
        </p>
        <p className="wk-ans">
          That experience helps me recognise patterns quickly, ask the right questions, and bring clarity to problems
          that often feel bigger than they are. Sometimes, an outside perspective is all it takes to move things
          forward.
        </p>
        <p className="wk-ans">
          If it sounds like I could be useful, I&#39;d love to hear what you&#39;re building and see if there&#39;s a
          fit.
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
