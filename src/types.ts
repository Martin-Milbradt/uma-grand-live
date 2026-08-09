/** The five Performance Point currencies songs are bought with. */
export const TOKENS = ['dance', 'passion', 'vocal', 'visual', 'composure'] as const

export type Token = (typeof TOKENS)[number]

/** Cost is sparse: a song only lists the tokens it actually charges. */
export type Cost = Partial<Record<Token, number>>

export type TokenTotals = Record<Token, number>

/** Which concert has to be cleared before a song appears in the shop. */
export type Stage = 'start' | 'concert1' | 'concert2' | 'concert3' | 'awarded'

export interface Song {
  id: string
  name: string
  stage: Stage
  cost: Cost
  mastery: string
  concert: string
  /** Set only for the two songs handed out for free; they are never purchased. */
  gainedAt: string | null
  priority: string | null
}

/** How far into the career the user currently is. Drives the "unlocked" totals. */
export type Progress = 'start' | 'concert1' | 'concert2' | 'concert3'

export const emptyTotals = (): TokenTotals => ({
  dance: 0,
  passion: 0,
  vocal: 0,
  visual: 0,
  composure: 0,
})
