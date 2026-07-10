import { istSeason, type Season } from '../../lib/ist'
import type { SeasonOverride } from '../../config'

/* The emoji picker's 3×3 grid: seven constants plus two slots that rotate with the
   Bangalore season. Names double as aria-labels. */

const PAIRS: Record<Season, [string, string][]> = {
  spring: [
    ['🌱', 'Seedling'],
    ['🌸', 'Blossom'],
  ],
  monsoon: [
    ['🌧️', 'Rain outside'],
    ['🌿', 'Fresh leaves'],
  ],
  autumn: [
    ['🍂', 'Falling leaf'],
    ['✨', 'Sparkles'],
  ],
  winter: [
    ['🌙', 'Quiet moon'],
    ['🧣', 'Scarf weather'],
  ],
}

export function emojiSet(override: SeasonOverride): { set: string[]; names: string[] } {
  const season: Season = override !== 'auto' ? override : istSeason()
  const pair = PAIRS[season] ?? PAIRS.spring
  return {
    set: ['✌️', '💛', pair[0][0], '☕', '📚', pair[1][0], '🎧', '😄', '🤔'],
    names: ['Peace sign', 'Heart', pair[0][1], 'Coffee', 'Books', pair[1][1], 'Headphones', 'Smile', 'Thinking it over'],
  }
}
