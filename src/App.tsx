import { useMemo } from 'react'
import { SongCard } from './components/SongCard'
import { TotalsPanel } from './components/TotalsPanel'
import { SONGS } from './data/songs'
import { isAutoOwned, isUnlocked, PROGRESS_ORDER, STAGE_INFO, STAGE_ORDER } from './stages'
import { sumRemaining } from './totals'
import { usePersistentState } from './usePersistentState'
import type { Progress, Song, Stage } from './types'

const STAGE_ACCENT: Record<Stage, string> = {
  start: 'text-stage-0',
  concert1: 'text-stage-1',
  concert2: 'text-stage-2',
  concert3: 'text-stage-3',
  awarded: 'text-stage-4',
}

const SONGS_BY_STAGE = STAGE_ORDER.map((stage) => ({
  stage,
  songs: SONGS.filter((song) => song.stage === stage),
}))

/** Every column shares this row count so cards stay the same size across columns. */
const MAX_ROWS = Math.max(...SONGS_BY_STAGE.map(({ songs }) => songs.length))

const isProgress = (value: unknown): value is Progress =>
  typeof value === 'string' && (PROGRESS_ORDER as readonly string[]).includes(value)

export default function App() {
  const [progress, setProgress] = usePersistentState<Progress>('grand-live.progress', 'start', (raw) =>
    isProgress(raw) ? raw : null,
  )
  const [bought, setBought] = usePersistentState<Set<string>>('grand-live.bought', new Set(), (raw) =>
    Array.isArray(raw) ? new Set(raw.filter((id): id is string => typeof id === 'string')) : null,
  )

  const remaining = useMemo(() => sumRemaining(SONGS, bought, progress), [bought, progress])

  const isOwned = (song: Song): boolean => bought.has(song.id) || isAutoOwned(song, progress)
  const ownedCount = SONGS.filter(isOwned).length

  const toggle = (id: string) => {
    const next = new Set(bought)
    if (!next.delete(id)) next.add(id)
    setBought(next)
  }

  const reset = () => {
    setBought(new Set())
    setProgress('start')
  }

  return (
    <div className="flex h-screen flex-col gap-2 overflow-hidden p-3">
      <header className="flex shrink-0 items-center gap-3">
        <h1 className="shrink-0 text-sm leading-tight font-bold">
          Grand Live
          <span className="block text-[10px] font-normal text-neutral-500">Click a song to buy it</span>
        </h1>

        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
          {PROGRESS_ORDER.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setProgress(stage)}
              aria-pressed={progress === stage}
              className={[
                'cursor-pointer rounded-md px-2.5 py-1 text-[11px] leading-tight font-medium transition',
                progress === stage
                  ? 'bg-amber-400 text-neutral-950'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
              ].join(' ')}
            >
              <span className="block">{STAGE_INFO[stage].label}</span>
              <span className={`block text-[9px] ${progress === stage ? 'opacity-70' : 'text-neutral-600'}`}>
                {STAGE_INFO[stage].turn}
              </span>
            </button>
          ))}
        </div>

        <TotalsPanel title="Still to buy — unlocked" totals={remaining.unlocked} songCount={remaining.unlockedCount} accent="amber" />
        <TotalsPanel title="Still to buy — total" totals={remaining.all} songCount={remaining.allCount} accent="neutral" />

        <div
          title="Songs owned, including the two awarded free"
          className="shrink-0 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-center leading-tight"
        >
          <div className="text-[10px] text-emerald-300/80">Owned</div>
          <div className="text-lg font-semibold tabular-nums text-emerald-300">
            {ownedCount}
            <span className="text-xs font-normal text-emerald-300/60">/{SONGS.length}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          title="Clear purchases and go back to the start"
          className="shrink-0 cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-white/25 hover:text-neutral-200"
        >
          Reset
        </button>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-5 gap-2.5">
        {SONGS_BY_STAGE.map(({ stage, songs }) => {
          const owned = songs.filter(isOwned).length

          return (
            <section key={stage} className="flex min-h-0 flex-col gap-1">
              <h2 className="flex shrink-0 items-baseline justify-between border-b border-white/10 pb-0.5">
                <span className={`text-[11px] font-semibold ${STAGE_ACCENT[stage]}`}>{STAGE_INFO[stage].label}</span>
                <span className="text-[10px] text-neutral-600">
                  {stage === 'awarded' ? STAGE_INFO[stage].turn : `${owned}/${songs.length}`}
                </span>
              </h2>

              <div
                className="grid min-h-0 flex-1 gap-2"
                style={{ gridTemplateRows: `repeat(${MAX_ROWS}, minmax(0, 1fr))` }}
              >
                {songs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    bought={isOwned(song)}
                    locked={!isUnlocked(song, progress)}
                    onToggle={() => toggle(song.id)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
