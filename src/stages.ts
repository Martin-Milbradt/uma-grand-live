import type { Progress, Song, Stage } from './types'

interface StageInfo {
  /** Column heading in the song grid. */
  label: string
  /** When the concert that unlocks this tier happens, per the guide. */
  turn: string
}

export const STAGE_INFO: Record<Stage, StageInfo> = {
  start: { label: 'From the start', turn: 'Junior Year' },
  concert1: { label: 'After 1st Concert', turn: 'Junior Late Dec' },
  concert2: { label: 'After 2nd Concert', turn: 'Classic Late Jun' },
  concert3: { label: 'After 3rd Concert', turn: 'Classic Late Dec' },
  awarded: { label: 'Awarded free', turn: 'Fixed turns' },
}

/** Career order of the purchasable tiers. `awarded` is excluded: those songs are never bought. */
export const PROGRESS_ORDER: readonly Progress[] = ['start', 'concert1', 'concert2', 'concert3']

/** Column order of the grid, awarded songs last. */
export const STAGE_ORDER: readonly Stage[] = [...PROGRESS_ORDER, 'awarded']

/** Awarded songs cost nothing, so they are never part of a "still to buy" total. */
export const isPurchasable = (song: Song): boolean => song.stage !== 'awarded'

/**
 * Awarded songs that are already in hand by a given stage, so they show as owned without
 * being clicked. Make Debut! arrives 4 turns into Junior year, well before the 1st Concert.
 * Girls' Legend U is omitted: it lands in Senior year, past the last stage on the selector.
 */
const AUTO_OWNED_FROM: Record<string, Progress> = { gc_022_debut: 'concert1' }

export function isAutoOwned(song: Song, progress: Progress): boolean {
  const from = AUTO_OWNED_FROM[song.id]
  if (from === undefined) return false
  return PROGRESS_ORDER.indexOf(progress) >= PROGRESS_ORDER.indexOf(from)
}

export function isUnlocked(song: Song, progress: Progress): boolean {
  if (song.stage === 'awarded') return true
  return PROGRESS_ORDER.indexOf(song.stage) <= PROGRESS_ORDER.indexOf(progress)
}
