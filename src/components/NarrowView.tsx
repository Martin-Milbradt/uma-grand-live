import { isUnlocked, STAGE_ACCENT, STAGE_INFO } from '../stages'
import { OwnedBadge, ResetButton, StagePicker } from './HeaderControls'
import { SongCard } from './SongCard'
import { TotalsPanel } from './TotalsPanel'
import type { ViewProps } from './viewProps'

/** Cards are a fixed height here rather than stretched, since the list scrolls. Tall enough
 *  for a two-line song name on top of the costs and the mastery/concert lines. */
const CARD_HEIGHT = 'h-28'

/**
 * A pinned header over a scrolling list of songs, split into stage sections whose headings
 * stick to the top of the scroller. Used by phones and by any window too narrow or too tall
 * for the columns.
 */
export function NarrowView({
  songsByStage,
  progress,
  onSelectProgress,
  remaining,
  ownedCount,
  totalCount,
  isOwned,
  skipped,
  onToggleBought,
  onToggleSkipped,
  onReset,
}: ViewProps) {
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
            <StagePicker progress={progress} onSelect={onSelectProgress} layout="grid" />
          </div>

          <OwnedBadge owned={ownedCount} total={totalCount} />
          <ResetButton onReset={onReset} />
        </div>

        {/* Side by side once there is width for it, or when the height leaves no other option. */}
        <div className="flex flex-col gap-2 xl:flex-row short:flex-row">
          <div className="min-w-0 flex-1">
            <TotalsPanel
              title="Still to buy — unlocked"
              totals={remaining.unlocked}
              songCount={remaining.unlockedCount}
              skippedCount={remaining.unlockedSkippedCount}
              accent="amber"
            />
          </div>

          <div className="min-w-0 flex-1">
            <TotalsPanel
              title="Still to buy — total"
              totals={remaining.all}
              songCount={remaining.allCount}
              skippedCount={remaining.allSkippedCount}
              accent="neutral"
            />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-8">
        {songsByStage.map(({ stage, songs }) => (
          <section key={stage}>
            {/* Pulled out to the page edges so the blur covers cards sliding underneath. */}
            <h2 className="sticky top-0 z-10 -mx-3 flex items-baseline justify-between gap-2 border-b border-white/10 bg-neutral-950/90 px-3 py-1.5 backdrop-blur">
              <span className={`text-xs font-semibold ${STAGE_ACCENT[stage]}`}>{STAGE_INFO[stage].label}</span>
              <span className="shrink-0 text-[10px] text-neutral-500">
                {STAGE_INFO[stage].turn}
                {stage !== 'awarded' && ` · ${songs.filter(isOwned).length}/${songs.length}`}
              </span>
            </h2>

            {/* Portrait tablets and portrait monitors are wide enough for more than one column. */}
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
                    onToggle={() => onToggleBought(song.id)}
                    onToggleSkip={() => onToggleSkipped(song.id)}
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
