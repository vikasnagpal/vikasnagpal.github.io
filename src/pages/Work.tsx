import { useConfig } from '../config'
import { PageFrame } from '../features/pages/PageFrame'
import './work.css'

/* Work together — three ways in, told the way Vikas would across a desk:
   the visitor's situation first (serif, like the guestbook's voice), the
   answer in plain body text, and the name of the arrangement as a
   handwritten margin note. Offer blocks share the P.S. hairline (--ps-rule)
   so they follow every atmosphere's treatment for free. */

const OFFERS = [
  {
    situation: 'You have an idea, or a rough prototype, and you need a real version 1.0.',
    answer:
      "I work alongside you to build it — the founding designer who comes in before there's a team to hire one.",
    tag: 'founding designer',
  },
  {
    situation: 'You mostly need a thinking partner — someone to talk a decision through now and then.',
    answer:
      "A lighter touch. I'm on call for the product and design questions that are easier to work out with someone who's seen them before. One-off sessions, or a simple monthly retainer.",
    tag: 'design advisory',
  },
  {
    situation: "You need senior design leadership, but you're not ready to hire for it full-time.",
    answer:
      'I embed with your team part-time, usually one to four months — setting direction, supporting hiring, and being the leadership presence in the room without the permanent seat. The aim is to leave behind a design function that runs well after I step out.',
    tag: 'fractional head of design',
  },
]

/* A hand-drawn arrow in the icon language — Caveat has no "→" of its own */
function TagArrow() {
  return (
    <svg width="24" height="15" viewBox="0 0 26 16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 10.5 C 8.5 7.5, 15 7, 23 8.6" />
      <path d="M17.8 4.2 L23.4 8.5 L17.2 12.2" />
    </svg>
  )
}

export default function Work() {
  const { calendarUrl } = useConfig()

  return (
    <PageFrame
      title="Work together — Vikas"
      description="Founding designer, design advisory, or a fractional head of design — three ways to work with Vikas."
    >
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
        <section className="wk-offer" key={o.tag}>
          <h2 className="wk-sit">{o.situation}</h2>
          <p className="wk-ans">{o.answer}</p>
          <div className="wk-tag">
            <TagArrow />
            <span>{o.tag}</span>
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
