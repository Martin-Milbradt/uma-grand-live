import type { Remaining } from '../totals'
import type { Progress, Song, Stage } from '../types'

export interface StageSongs {
  stage: Stage
  songs: readonly Song[]
}

/** Everything the two layouts render. They differ in arrangement only, never in data. */
export interface ViewProps {
  songsByStage: readonly StageSongs[]
  progress: Progress
  onSelectProgress: (stage: Progress) => void
  remaining: Remaining
  ownedCount: number
  totalCount: number
  isOwned: (song: Song) => boolean
  skipped: ReadonlySet<string>
  onToggleBought: (id: string) => void
  onToggleSkipped: (id: string) => void
  onReset: () => void
}
