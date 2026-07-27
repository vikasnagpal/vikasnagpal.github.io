import { SEEDS } from '../../lib/seeds'

/* The guestbook as it first existed: a form, and a list of comments under it.

   No screenshot of v1 survives, so this is a recreation rather than a relic,
   and the caption says so. It's built out of live markup instead of a flat
   image for two reasons: it stays legible at any width, and it carries the same
   real notes the deck deals, so the only thing changing between "before" and
   "after" is the treatment.

   Everything here is deliberately plain: a system stack instead of the site's
   type, square corners, a grey button, dates in the format a database hands
   you. It should look competent and joyless. That was the problem. */

const ROWS = SEEDS.slice(0, 3)

export function GuestbookBefore() {
  return (
    <figure className="cs-fig cs-before">
      <div className="cs-before-tag">Before</div>
      <div className="cs-before-box" aria-label="A recreation of the first guestbook: a comment form and a list" role="img">
        <div className="cs-before-h">Guestbook</div>
        <div className="cs-before-field">Leave a comment...</div>
        <div className="cs-before-row">
          <span className="cs-before-count">0 / 200</span>
          <span className="cs-before-btn">Submit</span>
        </div>
        <div className="cs-before-rule" />
        <div className="cs-before-h2">3 comments</div>
        <ul className="cs-before-list">
          {ROWS.map((t) => (
            <li key={t.id}>
              <div className="cs-before-meta">
                Anonymous &middot; {t.day} {t.mon} 20{t.yr}
              </div>
              <p className="cs-before-text">{t.text}</p>
            </li>
          ))}
        </ul>
        <div className="cs-before-more">Load more</div>
      </div>
      <figcaption className="cs-cap">
        A recreation of version one, same notes as the deck deals. Nothing wrong with it. Nobody would ever
        write into it.
      </figcaption>
    </figure>
  )
}
