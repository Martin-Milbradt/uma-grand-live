import { isUnlocked, STAGE_ACCENT, STAGE_INFO } from '../stages'
import { OwnedBadge, ResetButton, StagePicker } from './HeaderControls'
import { SongCard } from './SongCard'
import { TotalsPanel } from './TotalsPanel'
import type { ViewProps } from './viewProps'

/**
 * One screenful, no scrolling: every stage is a column and the cards shrink to fit the
 * window height.
 */
export function DesktopView({
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
  // Every column shares this row count so cards stay the same size across columns.
  const maxRows = Math.max(...songsByStage.map(({ songs }) => songs.length))

  return (
    <div className="flex h-screen flex-col gap-2 overflow-hidden p-3">
      <header className="flex shrink-0 items-center gap-3">
        <h1 className="shrink-0 text-sm leading-tight font-bold">
          Grand Live
          <span className="block text-[10px] font-normal text-neutral-500">Click to buy · Skip to drop the cost</span>
        </h1>

        <StagePicker progress={progress} onSelect={onSelectProgress} layout="row" />

        <TotalsPanel
          title="Still to buy — unlocked"
          totals={remaining.unlocked}
          songCount={remaining.unlockedCount}
          skippedCount={remaining.unlockedSkippedCount}
          accent="amber"
        />
        <TotalsPanel
          title="Still to buy — total"
          totals={remaining.all}
          songCount={remaining.allCount}
          skippedCount={remaining.allSkippedCount}
          accent="neutral"
        />

        <OwnedBadge owned={ownedCount} total={totalCount} />
        <ResetButton onReset={onReset} />
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-5 gap-2.5">
        {songsByStage.map(({ stage, songs }) => (
          <section key={stage} className="flex min-h-0 flex-col gap-1">
            <h2 className="flex shrink-0 items-baseline justify-between border-b border-white/10 pb-0.5">
              <span className={`text-[11px] font-semibold ${STAGE_ACCENT[stage]}`}>{STAGE_INFO[stage].label}</span>
              <span className="text-[10px] text-neutral-600">
                {stage === 'awarded' ? STAGE_INFO[stage].turn : `${songs.filter(isOwned).length}/${songs.length}`}
              </span>
            </h2>

            <div className="grid min-h-0 flex-1 gap-2" style={{ gridTemplateRows: `repeat(${maxRows}, minmax(0, 1fr))` }}>
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  bought={isOwned(song)}
                  locked={!isUnlocked(song, progress)}
                  skipped={skipped.has(song.id)}
                  onToggle={() => onToggleBought(song.id)}
                  onToggleSkip={() => onToggleSkipped(song.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
