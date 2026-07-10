import { CHIME } from '../motion/tokens'

/* Two-note chime (A5 grace note → ringing D6), synthesized live with triangle waves —
   a warm marimba "ding", not an arcade bleep. AudioContext is created lazily on the
   first trigger; every failure is silent. */

let ctx: AudioContext | null = null

export interface ChimeOpts {
  /** coral milestone coin rings an octave up */
  octaveUp?: boolean
  /** at Quiet Night the chime is quieter — it's late */
  night?: boolean
}

export function chime(opts: ChimeOpts = {}): void {
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
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
