import { songCover } from '../assets'
import { TOKENS } from '../types'
import type { Song } from '../types'
import { TokenAmount } from './TokenAmount'

/** The guide's buy-recommendation labels, strongest first. */
const PRIORITY_STYLE: Record<string, string> = {
  'High Priority': 'bg-amber-400/15 text-amber-300 ring-amber-400/30',
  'Great Value': 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30',
  'Good Value': 'bg-sky-400/15 text-sky-300 ring-sky-400/30',
  'Low Priority': 'bg-neutral-500/15 text-neutral-400 ring-neutral-500/30',
}

interface Props {
  song: Song
  bought: boolean
  locked: boolean
  onToggle: () => void
}

export function SongCard({ song, bought, locked, onToggle }: Props) {
  const awarded = song.stage === 'awarded'
  const costs = TOKENS.filter((token) => song.cost[token] !== undefined)

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={awarded}
      aria-pressed={bought}
      className={[
        'flex h-full min-h-0 w-full items-stretch gap-2.5 overflow-hidden rounded-xl border p-2 text-left transition',
        awarded ? 'cursor-default' : 'cursor-pointer hover:border-white/25 hover:bg-white/[0.07]',
        bought
          ? 'border-emerald-500/40 bg-emerald-500/10'
          : locked
            ? 'border-white/5 bg-white/[0.015]'
            : 'border-white/12 bg-white/[0.04]',
      ].join(' ')}
    >
      <div className="relative aspect-square h-full shrink-0">
        <img
          src={songCover(song.id)}
          alt=""
          className={[
            'size-full rounded-lg object-cover transition',
            bought ? 'opacity-40 saturate-50' : locked ? 'opacity-45 grayscale' : '',
          ].join(' ')}
        />
        {bought && (
          <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-neutral-950 shadow">
            ✓
          </span>
        )}
        {locked && !bought && (
          <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-neutral-800 text-xs text-neutral-400 ring-1 ring-white/10">
            🔒
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className={[
            'line-clamp-2 text-[13px] leading-snug font-semibold',
            bought ? 'text-neutral-500 line-through' : locked ? 'text-neutral-400' : 'text-neutral-50',
          ].join(' ')}
        >
          {song.name}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {awarded ? (
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-neutral-400">{song.gainedAt}</span>
          ) : (
            costs.map((token) => (
              <TokenAmount key={token} token={token} amount={song.cost[token] ?? 0} size="md" muted={bought} />
            ))
          )}
        </div>

        <dl className="mt-auto space-y-0.5 text-[11px] leading-tight text-neutral-400">
          <div className="flex gap-1.5">
            <dt className="shrink-0 text-neutral-600">Mastery</dt>
            <dd className="truncate">{song.mastery}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="shrink-0 text-neutral-600">Concert</dt>
            <dd className="truncate">{song.concert}</dd>
          </div>
        </dl>
      </div>

      {song.priority && (
        <span
          className={[
            'h-fit shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ring-1 ring-inset',
            PRIORITY_STYLE[song.priority] ?? 'bg-white/5 text-neutral-400 ring-white/10',
            bought ? 'opacity-40' : '',
          ].join(' ')}
        >
          {song.priority.replace(' Priority', '').replace(' Value', '')}
        </span>
      )}
    </button>
  )
}
