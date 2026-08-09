import { PROGRESS_ORDER, STAGE_INFO } from '../stages'
import type { Progress } from '../types'

interface StagePickerProps {
  progress: Progress
  onSelect: (stage: Progress) => void
}

/** Four equal chips over whatever width it is given, short-labelled so they survive a phone. */
export function StagePicker({ progress, onSelect }: StagePickerProps) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
      {PROGRESS_ORDER.map((stage) => {
        const active = progress === stage

        return (
          <button
            key={stage}
            type="button"
            onClick={() => onSelect(stage)}
            aria-pressed={active}
            className={[
              'min-w-0 cursor-pointer rounded-md px-1 py-1.5 text-[11px] leading-tight font-medium transition',
              active ? 'bg-amber-400 text-neutral-950' : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
            ].join(' ')}
          >
            <span className="block truncate">{STAGE_INFO[stage].short}</span>
            <span className={`block truncate text-[9px] ${active ? 'opacity-70' : 'text-neutral-600'}`}>
              {STAGE_INFO[stage].turn}
            </span>
          </button>
        )
      })}
    </div>
  )
}

interface OwnedBadgeProps {
  owned: number
  total: number
}

export function OwnedBadge({ owned, total }: OwnedBadgeProps) {
  return (
    <div
      title="Songs owned, including the two awarded free"
      className="shrink-0 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-center leading-tight"
    >
      <div className="text-[10px] text-emerald-300/80">Owned</div>
      <div className="text-lg font-semibold tabular-nums text-emerald-300">
        {owned}
        <span className="text-xs font-normal text-emerald-300/60">/{total}</span>
      </div>
    </div>
  )
}

export function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      title="Clear purchases and go back to the start. Skipped songs stay skipped."
      className="shrink-0 cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-white/25 hover:text-neutral-200"
    >
      Reset
    </button>
  )
}
