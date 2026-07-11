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
