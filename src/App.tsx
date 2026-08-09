import { useMemo } from 'react'
import { DesktopView } from './components/DesktopView'
import { MobileView } from './components/MobileView'
import type { ViewProps } from './components/viewProps'
import { SONGS } from './data/songs'
import { isAutoOwned, PROGRESS_ORDER, STAGE_ORDER } from './stages'
import { sumRemaining } from './totals'
import { useMediaQuery } from './useMediaQuery'
import { usePersistentState } from './usePersistentState'
import type { Progress, Song } from './types'

/**
 * Anything taller than it is wide, plus any window too narrow for the five columns. The
 * desktop layout packs a whole career into one screenful, which only works given the width.
 */
const MOBILE_QUERY = '(orientation: portrait), (max-width: 900px)'

const SONGS_BY_STAGE = STAGE_ORDER.map((stage) => ({
  stage,
  songs: SONGS.filter((song) => song.stage === stage),
}))

const isProgress = (value: unknown): value is Progress =>
  typeof value === 'string' && (PROGRESS_ORDER as readonly string[]).includes(value)

const reviveIds = (raw: unknown): Set<string> | null =>
  Array.isArray(raw) ? new Set(raw.filter((id): id is string => typeof id === 'string')) : null

const withToggled = (ids: ReadonlySet<string>, id: string): Set<string> => {
  const next = new Set(ids)
  if (!next.delete(id)) next.add(id)
  return next
}

export default function App() {
  const [progress, setProgress] = usePersistentState<Progress>('grand-live.progress', 'start', (raw) =>
    isProgress(raw) ? raw : null,
  )
  const [bought, setBought] = usePersistentState<Set<string>>('grand-live.bought', new Set(), reviveIds)
  // Songs the user never intends to buy. Kept in its own key so Reset leaves the list alone.
  const [skipped, setSkipped] = usePersistentState<Set<string>>('grand-live.skipped', new Set(), reviveIds)

  const mobile = useMediaQuery(MOBILE_QUERY)
  const remaining = useMemo(() => sumRemaining(SONGS, bought, skipped, progress), [bought, skipped, progress])

  const isOwned = (song: Song): boolean => bought.has(song.id) || isAutoOwned(song, progress)

  const view: ViewProps = {
    songsByStage: SONGS_BY_STAGE,
    progress,
    onSelectProgress: setProgress,
    remaining,
    ownedCount: SONGS.filter(isOwned).length,
    totalCount: SONGS.length,
    isOwned,
    skipped,
    onToggleBought: (id) => setBought(withToggled(bought, id)),
    onToggleSkipped: (id) => setSkipped(withToggled(skipped, id)),
    onReset: () => {
      setBought(new Set())
      setProgress('start')
    },
  }

  return mobile ? <MobileView {...view} /> : <DesktopView {...view} />
}
