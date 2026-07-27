import type { ReactNode } from 'react'
import { CoinBump } from './CoinBump'
import { GuestbookBefore } from './GuestbookBefore'
import { MoodViewer } from './MoodViewer'

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

function SiteBody() {
  return (
    <>
      <p className="css-p">
        Most portfolios are filing cabinets. You slide open a drawer, read a label, and leave. I wanted this one to
        do the opposite: to feel like you&rsquo;d knocked on a door, been waved inside, and found somewhere worth
        staying a few minutes. A room, not a r&eacute;sum&eacute;.
      </p>
      <p className="css-p">
        Delight isn&rsquo;t more features. It&rsquo;s the small places where software gets to feel a little more
        human. I spent years in visual effects, where nearly everything we made was built to go unnoticed, and you
        come out of that caring about things no one will ever consciously see. That habit is most of what this site
        is made of.
      </p>
      <p className="css-p">
        Every decision on it bends toward that one feeling. None of the parts I like best arrived that way, though.
        Each one started as something duller, or something I&rsquo;d got wrong the first time. These are the three
        I&rsquo;m most glad I stayed with.
      </p>

      <h3 className="css-h3">A room that keeps time</h3>
      <p className="css-p">
        The site has three moods: Morning Light, Golden Hour, and Quiet Night. It reads a clock and opens in the one
        that matches the hour, so most people never think about it at all. There&rsquo;s a small sun or moon in the
        corner if you want to look at another one, but the pick expires and drifts back on its own after a while.
      </p>
      <p className="css-p">
        The clock it reads is mine, not yours. It&rsquo;s whatever time of day it happens to be in Bangalore, at my
        desk. Reading your clock would have been the obvious, polite thing to build, and it would have quietly
        turned the room into a mirror. A friend&rsquo;s place is a different house depending on when you turn up:
        morning coffee in one light, late drinks in another. You don&rsquo;t set that light. You arrive into it.
      </p>
      <blockquote className="css-quote">It isn&rsquo;t a dark-mode toggle. It&rsquo;s the room having a time of day.</blockquote>
      <p className="css-p">
        The hours themselves I got wrong first. I cut the day the way a computer would, morning until noon and
        golden hour after, and then noticed that noon in Bangalore is the flattest, brightest part of the day and
        there is nothing golden about it. The slant doesn&rsquo;t start until around two. So the windows moved:
        bright until two, warm until seven, lamps after that.
      </p>
      <p className="css-p">
        The best thing about it is something I only found by not using it. I&rsquo;d left the site open on a second
        monitor overnight, and by the time I sat back down the next morning it had gone bright on its own. It
        rechecks the clock every thirty seconds. The room keeps time whether or not anyone is in it.
      </p>
      <MoodViewer base={BASE} />

      <h3 className="css-h3">The guestbook, and how it stopped being a comment box</h3>
      <p className="css-p">
        I never read comment sections. I scroll past the whole block in one motion, and if anything ever stops me
        it&rsquo;s a single note that happened to catch my eye. But a portfolio with nobody else in it is a
        monologue, and I wanted some evidence that other people had passed through here. So: a guestbook.
      </p>
      <p className="css-p">
        The first version was exactly what you&rsquo;d picture. A form, and a list of comments underneath. It was a
        chore from both sides, dull to fill in and duller to read.
      </p>
      <GuestbookBefore />
      <p className="css-p">
        So it became a deck. You flip through thoughts one at a time, each on its own colored paper, dated, with a
        few small reactions you can leave without typing a single word. A fresh card is dealt every time you arrive.
      </p>
      <p className="css-p">
        And the honesty line matters. Notes are read by me before they show up, and the copy says exactly that, in
        my voice. It used to read &ldquo;thoughts are read by everyone before they go up,&rdquo; which is true the
        way a press release is true. Somebody sees your note before anybody else does. That somebody is me, and the
        sentence should say so.
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
        bobbing up and down under my cursor, it stopped reading as a glitch.
      </p>
      <p className="css-beat">
        It was Mario, headbutting a block that was clearly holding a coin it hadn&rsquo;t handed over yet.
      </p>
      <p className="css-p">
        So I didn&rsquo;t fix it. Every so often the bug is pointing at something better than the thing you set out
        to build, and the whole trick is noticing before you patch it. I finished the joke instead. Bump an icon the
        way you&rsquo;d bump a block, wiggle it with the cursor on a desktop or rub it on a phone, and a coin flips
        out of it, turns through the air, and lands with a soft chime. A handwritten &ldquo;Nice catch.&rdquo;
        floats up. A hidden ledger keeps count, and at fifty the P.S. downstairs quietly rewrites itself to admit it
        has been paying attention.
      </p>
      <CoinBump />
      <Figure
        src={`${BASE}/coin.png`}
        alt="A gold coin mid-flip, arcing up out of the Past adventures navigation icon"
        caption="And out in the wild, where nothing announces it: the same coin, off the home page nav."
      />
      <p className="css-p">
        One part of it isn&rsquo;t there any more. For a while the icons would stir on their own if you sat still
        long enough, a small fidget meant to pull your eye toward the secret. It worked, which was the problem. A
        surprise that taps you on the shoulder isn&rsquo;t a surprise, and most of the time it was performing to an
        empty room anyway. It&rsquo;s gone. What&rsquo;s left is a faint glint on a coin&rsquo;s edge, which tells
        you something is hidden without telling you what to do about it.
      </p>
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
      <p className="css-p">
        The greeting for a returning visitor cost me most of an afternoon, and I&rsquo;d rather that weren&rsquo;t
        true. It read &ldquo;Welcome back, it&rsquo;s Vikas, and,&rdquo; which broke onto a second line at the size
        the display type wants to be, and a two-line greeting stops being a hello and becomes a paragraph. If
        you&rsquo;ve been here before, you already know whose room this is. So the name came out.
      </p>
      <div className="cs-fig-row">
        <Figure src={`${BASE}/mobile-home.png`} alt="The home page on a phone" />
        <Figure src={`${BASE}/mobile-guestbook.png`} alt="The guestbook on a phone" />
      </div>
      <p className="css-p">
        That&rsquo;s the effects work again, in a different medium. Get it right and the only evidence is that
        nothing ever pulled you out of the room.
      </p>

      <h3 className="css-h3">Why bother</h3>
      <p className="css-p">
        None of this reads as impressive on paper. It&rsquo;s a personal site; it didn&rsquo;t need to exist at
        all. And none of these decisions change what the site lets you do. They change how it feels while you do
        it, which is the part I have never been able to leave alone.
      </p>
      <p className="css-p">
        It&rsquo;s the most honest thing in my portfolio, because it&rsquo;s the one place I got to decide
        everything, down to how it feels to move your mouse across it. If it felt, even for a moment, like visiting
        someone rather than reading about them, then it did its job. And it got built the way I actually work:
        notice something, change it, live with it a while, notice the next thing.
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
    readTime: '7 min read',
    cardDek: "Why this site behaves like a room you've stepped into rather than a page you're skimming, and the small decisions that got it there.",
    cover: `${BASE}/cover.png`,
    Body: SiteBody,
  },
]
