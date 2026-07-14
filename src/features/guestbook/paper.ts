/* Each thought keeps its paper color for the whole visit — a card never changes
   color as it moves through the deck (paper doesn't repaint itself while you
   watch). The one exception is decided at deal time: whichever card the shuffle
   puts at the front wears coral for the visit, so the room always opens on its
   signature paper. The palette is warm Scandinavian card stock: coral, deep
   green, tan, sage, terracotta, peach, moss, walnut. */

export type PaperKey = 'coral' | 'green' | 'tan' | 'sage' | 'terracotta' | 'peach' | 'moss' | 'walnut'

const PAPERS: PaperKey[] = ['coral', 'green', 'tan', 'sage', 'terracotta', 'peach', 'moss', 'walnut']

/* Notes you write yourself stay on the coral card you wrote them on. */
export function paperFor(id: string): PaperKey {
  if (id.startsWith('local-')) return 'coral'
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return PAPERS[h % PAPERS.length]
}

/* A fresh deal for every visit: true shuffle, no date order. The opening card
   isn't chosen by color — it gets repainted coral instead (see coralId in
   useGuestbook). */
export function deckOrder(ids: string[]): string[] {
  const deck = [...ids]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}
