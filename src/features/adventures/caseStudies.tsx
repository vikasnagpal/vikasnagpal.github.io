import type { ReactNode } from 'react'

/* Case studies. Each carries its card/reader metadata plus a Body component
   that renders the article itself, so a bespoke narrative (its own images,
   pull quotes, figure layouts) lives next to its data instead of being
   squeezed through a generic block schema. The reader shell (header, docking,
   dismiss) is CaseStudySheet.tsx; the styles are casestudysheet.css. */

export interface CaseStudy {
  slug: string
  /** eyebrow label on the card and sheet, e.g. an org name */
  org: string
  title: string
  /** one-line script dek */
  dek: string
  role: string
  year: string
  readTime: string
  /** the card's supporting line */
  cardDek: string
  /** cover / hero image (in public/) */
  cover: string
  Body: () => ReactNode
}

const BASE = '/case-studies/site'

function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="cs-fig">
      <img src={src} alt={alt} loading="lazy" />
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  )
}

function MoodTriptych() {
  return (
    <figure className="cs-fig">
      <div className="cs-fig-row cs-fig-3">
        <img src={`${BASE}/mood-morning.png`} alt="The home page in Morning Light" loading="lazy" />
        <img src={`${BASE}/mood-golden.png`} alt="The home page at Golden Hour" loading="lazy" />
        <img src={`${BASE}/mood-night.png`} alt="The home page in Quiet Night" loading="lazy" />
      </div>
      <figcaption className="cs-cap">
        Same room, three times of day. The site reads your local clock and picks the light to match.
      </figcaption>
    </figure>
  )
}

function SiteBody() {
  return (
    <>
      <p className="css-p">
        Most portfolios are filing cabinets. You slide open a drawer, read a label, and leave. I wanted this one to
        do the opposite: to feel like you&rsquo;d knocked on a door, been waved inside, and found somewhere worth
        staying a few minutes. A room, not a r&eacute;sum&eacute;.
      </p>
      <p className="css-p">
        Every decision on the site bends toward that one feeling. These are the three I&rsquo;m most glad I sweated.
      </p>

      <h3 className="css-h3">A room that keeps time</h3>
      <p className="css-p">
        The site has three moods: Morning Light, Golden Hour, and Quiet Night. It quietly reads the clock where
        you are and opens in the one that matches your hour, so a visitor arriving at midnight steps into a
        lamp-lit room, and someone at nine in the morning gets the bright version. You can change it yourself with
        the small sun or moon in the corner, but the pick expires and drifts back to your real time after a while.
      </p>
      <p className="css-p">
        That last part is the whole point. It isn&rsquo;t a theme switcher to fiddle with; it&rsquo;s the room
        having a time of day, present and a little different depending on when you happened to show up.
      </p>
      <blockquote className="css-quote">It isn&rsquo;t a dark-mode toggle. It&rsquo;s the room having a time of day.</blockquote>
      <MoodTriptych />

      <h3 className="css-h3">The guestbook, and how it stopped being a comment box</h3>
      <p className="css-p">
        A portfolio is usually a monologue. I wanted evidence that other people had passed through, some proof that
        this is a shared space and not just me talking. So: a guestbook.
      </p>
      <p className="css-p">
        The first version was exactly what you&rsquo;d picture, a form and a list of comments underneath, and it
        felt like a chore from both sides, dull to fill in and duller to read. So it became a deck. You flip through
        thoughts one at a time, each on its own colored paper, dated, with a few small reactions you can leave
        without typing a single word. A fresh card is dealt every time you arrive. And the honesty line matters:
        notes are read by me before they show up, and the copy says exactly that, in my voice, rather than hiding
        behind &ldquo;moderated by an administrator.&rdquo;
      </p>
      <blockquote className="css-quote">
        A portfolio is a monologue. A guestbook makes it a room with other people in it.
      </blockquote>
      <Figure
        src={`${BASE}/guestbook.png`}
        alt="The guestbook: a coral card with a visitor's quote, a date, and four reaction pills"
        caption="One thought at a time, on its own paper, with reactions you can leave without typing."
      />

      <h3 className="css-h3">The coin that started as a bug</h3>
      <p className="css-p">
        When I was wiring up the navigation, the three icons were meant to do one small thing: lift a little when
        you hover them. That part worked exactly as planned.
      </p>
      <p className="css-p">
        What I didn&rsquo;t plan for was a habit of my own. When something nudges on hover, I&rsquo;ll park my
        cursor right at the seam where the movement triggers, just to watch it happen. Here that turned into a loop:
        the icon lifts up and away from my cursor, so the cursor is no longer on it, so it settles back down, which
        drops it right under my cursor again, so it lifts&hellip; a tiny, endless bounce, entirely my own doing for
        sitting on the exact edge that sets it off.
      </p>
      <p className="css-p">
        The reasonable move is to call that a bug and go straighten out the hit area. But the moment I saw the icon
        bobbing up and down under my cursor, it stopped reading as a glitch. It was Mario, headbutting a block, the
        block popping up and settling and popping up again, clearly holding a coin it hadn&rsquo;t handed over yet.
      </p>
      <blockquote className="css-quote">
        It stopped reading as a glitch. It was Mario, headbutting a block that was clearly holding a coin.
      </blockquote>
      <p className="css-p">
        So I didn&rsquo;t fix it. I finished the joke. Bump an icon the way you&rsquo;d bump a block, wiggle it with
        the cursor on a desktop or rub it on a phone, and a coin flips out of it, turns through the air, and lands
        with a soft chime. A handwritten &ldquo;Nice catch.&rdquo; floats up. A hidden ledger keeps count, and at
        fifty the P.S. downstairs quietly rewrites itself to admit it has been paying attention.
      </p>
      <Figure
        src={`${BASE}/coin.png`}
        alt="A gold coin mid-flip, arcing up out of the Past adventures navigation icon"
        caption="Bump an icon the way you&rsquo;d bump a Mario block, and a coin flips out."
      />
      <p className="css-p">
        Nothing on the page tells you it&rsquo;s there. You find it the way I did, by fidgeting with an interface
        instead of just using it. And when you do, it&rsquo;s a small nod passing between us: you&rsquo;ve worked
        out something true about how I am with these things, and I&rsquo;ve left a coin behind for exactly the kind
        of person who would go looking.
      </p>
      <Figure
        src={`${BASE}/coin-note.png`}
        alt="A handwritten 'Nice catch.' note floating above the navigation after catching a coin"
        caption="Catch enough of them and the room slowly starts to know you."
      />

      <h3 className="css-h3">The parts nobody will notice</h3>
      <p className="css-p">
        The rest is small things. Every arrow and mark on the site is a hand-drawn stroke rather than a text
        character, because the typeface doesn&rsquo;t carry those glyphs and would swap in a mismatched system font
        on Android. The handwritten greeting inks itself in, left to right, but only on your very first visit,
        never again. And every layout was built twice, once for the desk and once for the phone in your hand, since
        that&rsquo;s where most people actually meet it.
      </p>
      <div className="cs-fig-row">
        <Figure src={`${BASE}/mobile-home.png`} alt="The home page on a phone" />
        <Figure src={`${BASE}/mobile-guestbook.png`} alt="The guestbook on a phone" />
      </div>
      <p className="css-p">
        In my years doing visual effects, most of what we made was meant to go unnoticed, and I learned to care
        about things nobody would ever consciously see. This whole site is that lesson, moved onto the web.
      </p>

      <h3 className="css-h3">Why bother</h3>
      <p className="css-p">
        None of this reads as impressive on paper. It&rsquo;s a personal site; it didn&rsquo;t need to exist at
        all. But it&rsquo;s the most honest thing in my portfolio, because it&rsquo;s the one place I got to decide
        everything, down to how it feels to move your mouse across it. If it felt, even for a moment, like visiting
        someone rather than reading about them, then it did its job.
      </p>
      <div className="css-fin">fin.</div>
    </>
  )
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'this-site',
    org: 'THIS SITE',
    title: "The room you're standing in",
    dek: 'how this site got made, and why it behaves the way it does',
    role: 'Design & build',
    year: '2026',
    readTime: '6 min read',
    cardDek: "Why this site behaves like a room you've stepped into rather than a page you're skimming, and the small decisions that got it there.",
    cover: `${BASE}/cover.png`,
    Body: SiteBody,
  },
]
