import { isPurchasable, isUnlocked } from './stages'
import { emptyTotals, TOKENS } from './types'
import type { Progress, Song, TokenTotals } from './types'

export interface Remaining {
  /** Every unbought song, whether or not it is in the shop yet. */
  all: TokenTotals
  /** Only unbought songs the current progress has already unlocked. */
  unlocked: TokenTotals
  allCount: number
  unlockedCount: number
}

export function sumRemaining(songs: readonly Song[], bought: ReadonlySet<string>, progress: Progress): Remaining {
  const all = emptyTotals()
  const unlocked = emptyTotals()
  let allCount = 0
  let unlockedCount = 0

  for (const song of songs) {
    if (!isPurchasable(song) || bought.has(song.id)) continue

    const available = isUnlocked(song, progress)
    allCount += 1
    if (available) unlockedCount += 1

    for (const token of TOKENS) {
      const amount = song.cost[token]
      if (amount === undefined) continue
      all[token] += amount
      if (available) unlocked[token] += amount
    }
  }

  return { all, unlocked, allCount, unlockedCount }
}

export const grandTotal = (totals: TokenTotals): number => TOKENS.reduce((sum, token) => sum + totals[token], 0)
