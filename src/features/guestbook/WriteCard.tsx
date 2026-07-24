import type { GuestbookApi } from './useGuestbook'
import { emojiSet } from './emojiSet'
import { useConfig } from '../../config'
import { useDismiss } from '../../lib/useDismiss'

/* The front card becomes the form — writing on paper, not filling a field.
   Empty submits get a gentle italic nudge: no red, no shake. */

export function WriteCard({ gb }: { gb: GuestbookApi }) {
  const { seasonOverride } = useConfig()
  const { set, names } = emojiSet(seasonOverride)
  const sel = gb.noteEmoji

  // The popover closes on outside click or Escape. (Escape never cancels the
  // write card itself — that would throw away a draft; "Not now" is the door.)
  useDismiss(gb.emojiOpen, () => gb.setEmojiOpen(false))

  return (
    <div className="gb-write" style={{ opacity: gb.closing ? 0 : 1 }}>
      <div className="gb-write-head">Leave a thought</div>
      <textarea
        className="gb-ta"
        value={gb.draft}
        onChange={(e) => gb.setDraft(e.target.value)}
        maxLength={200}
        placeholder="What's on your mind? A thought, an observation, something you're chewing on…"
        aria-label="Your thought"
        // The visitor just chose "Leave a note" — the pen should already be in hand.
        autoFocus
      />
      <div className="gb-hintrow">
        <span className="gb-anon">You&#39;ll be anonymous. Notes are read by me before they go up.</span>
        {gb.draft.length >= 160 && (
          <span className="gb-count" style={{ color: gb.draft.length >= 200 ? 'var(--card-cream)' : undefined }}>
            {200 - gb.draft.length} left
          </span>
        )}
      </div>
      {gb.guard && <div className="gb-guard">Share something before adding.</div>}
      <div className="gb-btnrow">
        <span className="gb-emojiwrap" onClick={(e) => e.stopPropagation()}>
          <button
            className="gb-emojibtn"
            onClick={() => gb.setEmojiOpen((o) => !o)}
            title="Pick an emoji that shows on your card"
            aria-label="Pick an emoji that shows on your card"
            aria-expanded={gb.emojiOpen}
            style={{ background: sel ? 'var(--card-cream)' : 'transparent' }}
          >
            {sel ?? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="8.6" />
                <path d="M8.6 14 C9.5 15.3 10.6 16 12 16 C13.4 16 14.5 15.3 15.4 14" />
                <path d="M9.3 9.6 L9.3 9.9 M14.7 9.6 L14.7 9.9" strokeWidth="2.3" />
              </svg>
            )}
          </button>
          {gb.emojiOpen && (
            <div className="gb-emojipop" role="menu">
              {set.map((em, i) => (
                <button
                  key={em}
                  className="gb-emojiopt"
                  role="menuitem"
                  aria-label={names[i]}
                  title={names[i]}
                  style={{ background: sel === em ? 'color-mix(in srgb, var(--card-front) 16%, transparent)' : 'transparent' }}
                  onClick={() => {
                    gb.setNoteEmoji(em)
                    gb.setEmojiOpen(false)
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </span>
        <button className="gb-add" onClick={gb.submit}>
          {gb.submitting ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'iconSwap 0.28s ease' }}
              aria-hidden
            >
              <path d="M4 12.5 L9.5 18 L20 6.5" />
            </svg>
          ) : (
            'Add to the guestbook'
          )}
        </button>
        <button className="gb-notnow" onClick={gb.cancelWrite}>
          Not now
        </button>
      </div>
    </div>
  )
}
