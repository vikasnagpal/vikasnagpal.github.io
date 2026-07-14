import { CHIME } from '../motion/tokens'

/* Two-note chime (A5 grace note → ringing D6), synthesized live with triangle waves —
   a warm marimba "ding", not an arcade bleep. AudioContext is created lazily on the
   first trigger; every failure is silent. */

let ctx: AudioContext | null = null

/* Browsers keep audio locked until a real user gesture, and the coin's hover-jiggle
   isn't one. Arm the context on any gesture anywhere — the click that opens an inner
   page counts — and keep listening so a browser that re-suspends the context
   (Safari does) gets healed by the next tap or keypress. */
function arm(): void {
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state !== 'running') void ctx.resume()
  } catch {
    /* silent */
  }
}

for (const gesture of ['pointerdown', 'click', 'keydown']) {
  window.addEventListener(gesture, arm, { capture: true, passive: true })
}

export interface ChimeOpts {
  /** coral milestone coin rings an octave up */
  octaveUp?: boolean
  /** at Quiet Night the chime is quieter — it's late */
  night?: boolean
}

export function chime(opts: ChimeOpts = {}): void {
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state !== 'running') {
      // notes queued on a suspended clock would all burst out at the next click
      void ctx.resume()
      return
    }
    const t0 = ctx.currentTime
    const mult = opts.octaveUp ? CHIME.octaveUp : 1
    const gain = opts.night ? CHIME.nightGain : CHIME.gain

    const mk = (freq: number, start: number, dur: number) => {
      const o = ctx!.createOscillator()
      const g = ctx!.createGain()
      o.type = 'triangle'
      o.frequency.value = freq
      g.gain.setValueAtTime(0.0001, t0 + start)
      g.gain.exponentialRampToValueAtTime(gain, t0 + start + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur)
      o.connect(g)
      g.connect(ctx!.destination)
      o.start(t0 + start)
      o.stop(t0 + start + dur + 0.05)
    }

    mk(CHIME.graceHz * mult, 0, CHIME.graceDur)
    mk(CHIME.ringHz * mult, CHIME.ringStart, CHIME.ringDur)
  } catch {
    /* silent */
  }
}
