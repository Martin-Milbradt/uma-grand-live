import { useMemo } from 'react'
import { OwnedBadge, ResetButton, StagePicker } from './components/HeaderControls'
import { SongCard } from './components/SongCard'
import { TotalsPanel } from './components/TotalsPanel'
import { SONGS } from './data/songs'
import {
  isAutoOwned,
  isEverythingUnlocked,
  isUnlocked,
  PROGRESS_ORDER,
  STAGE_ACCENT,
  STAGE_INFO,
  STAGE_ORDER,
} from './stages'
import { sumRemaining } from './totals'
import { usePersistentState } from './usePersistentState'
import type { Progress, Song } from './types'

/** Cards are a fixed height rather than stretched, since the list scrolls. Tall enough for a
 *  two-line song name on top of the costs and the mastery/concert lines. */
const CARD_HEIGHT = 'h-28'

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

/**
 * A pinned header over a scrolling list of songs, split into stage sections whose headings
 * stick to the top of the scroller. One layout for every screen: the header collapses a step
 * at a time and the grid drops a column roughly every 300px, so it holds from a phone up to a
 * monitor, where the whole career fits without scrolling anyway.
 */
export default function App() {
  const [progress, setProgress] = usePersistentState<Progress>('grand-live.progress', 'start', (raw) =>
    isProgress(raw) ? raw : null,
  )
  const [bought, setBought] = usePersistentState<Set<string>>('grand-live.bought', new Set(), reviveIds)
  // Songs the user never intends to buy. Kept in its own key so Reset leaves the list alone.
  const [skipped, setSkipped] = usePersistentState<Set<string>>('grand-live.skipped', new Set(), reviveIds)

  const remaining = useMemo(() => sumRemaining(SONGS, bought, skipped, progress), [bought, skipped, progress])

  const isOwned = (song: Song): boolean => bought.has(song.id) || isAutoOwned(song, progress)
  const everythingUnlocked = isEverythingUnlocked(progress)

  const reset = () => {
    setBought(new Set())
    setProgress('start')
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex shrink-0 flex-col gap-2 border-b border-white/10 px-3 pt-2 pb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="min-w-0 flex-1 text-base leading-tight font-bold md:flex-none">
            Grand Live
            {/* A landscape phone has no height to spare for the hint. */}
            <span className="block truncate text-[10px] font-normal text-neutral-500 short:hidden">
              Tap to buy · Skip to drop the cost
            </span>
          </h1>

          {/* Slots in beside the title once the row is wide enough to hold it. */}
          <div className="order-last w-full md:order-none md:w-auto md:min-w-0 md:max-w-lg md:flex-1">
            <StagePicker progress={progress} onSelect={setProgress} />
          </div>

          <OwnedBadge owned={SONGS.filter(isOwned).length} total={SONGS.length} />
          <ResetButton onReset={reset} />
        </div>

        {/* Side by side once there is width for it, or when the height leaves no other option. */}
        <div className="flex flex-col gap-2 xl:flex-row short:flex-row">
          {!everythingUnlocked && (
            <div className="min-w-0 flex-1">
              <TotalsPanel
                title="Still to buy — unlocked"
                totals={remaining.unlocked}
                songCount={remaining.unlockedCount}
                skippedCount={remaining.unlockedSkippedCount}
                accent="amber"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <TotalsPanel
              title={everythingUnlocked ? 'Still to buy' : 'Still to buy — total'}
              totals={remaining.all}
              songCount={remaining.allCount}
              skippedCount={remaining.allSkippedCount}
              accent={everythingUnlocked ? 'amber' : 'neutral'}
            />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-8">
        {SONGS_BY_STAGE.map(({ stage, songs }) => (
          <section key={stage}>
            {/* Pulled out to the page edges so the blur covers cards sliding underneath. */}
            <h2 className="sticky top-0 z-10 -mx-3 flex items-baseline justify-between gap-2 border-b border-white/10 bg-neutral-950/90 px-3 py-1.5 backdrop-blur">
              <span className={`text-xs font-semibold ${STAGE_ACCENT[stage]}`}>{STAGE_INFO[stage].label}</span>
              <span className="shrink-0 text-[10px] text-neutral-500">
                {STAGE_INFO[stage].turn}
                {stage !== 'awarded' && ` · ${songs.filter(isOwned).length}/${songs.length}`}
              </span>
            </h2>

            {/* A column roughly every 300px, which is about what a card needs to stay readable. */}
            <div className="grid gap-2 py-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
              {songs.map((song) => (
                // min-w-0: grid items default to min-content width, which a card would exceed.
                <div key={song.id} className={`min-w-0 ${CARD_HEIGHT}`}>
                  <SongCard
                    song={song}
                    bought={isOwned(song)}
                    locked={!isUnlocked(song, progress)}
                    skipped={skipped.has(song.id)}
                    onToggle={() => setBought(withToggled(bought, song.id))}
                    onToggleSkip={() => setSkipped(withToggled(skipped, song.id))}
                    touch
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
