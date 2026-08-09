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
  /** Unbought songs the user marked as never buying, so the panels can show the totals are filtered. */
  allSkippedCount: number
  unlockedSkippedCount: number
}

export function sumRemaining(
  songs: readonly Song[],
  bought: ReadonlySet<string>,
  skipped: ReadonlySet<string>,
  progress: Progress,
): Remaining {
  const all = emptyTotals()
  const unlocked = emptyTotals()
  let allCount = 0
  let unlockedCount = 0
  let allSkippedCount = 0
  let unlockedSkippedCount = 0

  for (const song of songs) {
    if (!isPurchasable(song) || bought.has(song.id)) continue

    const available = isUnlocked(song, progress)

    if (skipped.has(song.id)) {
      allSkippedCount += 1
      if (available) unlockedSkippedCount += 1
      continue
    }

    allCount += 1
    if (available) unlockedCount += 1

    for (const token of TOKENS) {
      const amount = song.cost[token]
      if (amount === undefined) continue
      all[token] += amount
      if (available) unlocked[token] += amount
    }
  }

  return { all, unlocked, allCount, unlockedCount, allSkippedCount, unlockedSkippedCount }
}

export const grandTotal = (totals: TokenTotals): number => TOKENS.reduce((sum, token) => sum + totals[token], 0)
