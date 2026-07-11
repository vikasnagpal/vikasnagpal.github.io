/* Each thought owns its paper color for life — a card never changes color as it
   moves through the deck (paper doesn't repaint itself). The palette is warm
   Scandinavian card stock: coral, deep green, tan, sage. */

export type PaperKey = 'coral' | 'green' | 'tan' | 'sage'

const PAPERS: PaperKey[] = ['coral', 'green', 'tan', 'sage']

/* Notes you write yourself stay on the coral card you wrote them on. */
export function paperFor(id: string): PaperKey {
  if (id.startsWith('local-')) return 'coral'
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return PAPERS[h % PAPERS.length]
}

/* A fresh deal for every visit: true shuffle, no date order — then a random
   coral card is cut to the front so the room always opens on its signature paper. */
export function deckOrder(ids: string[]): string[] {
  const deck = [...ids]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  const c = deck.findIndex((id) => paperFor(id) === 'coral')
  if (c > 0) deck.unshift(deck.splice(c, 1)[0])
  return deck
}
