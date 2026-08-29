import { LIGHT_HELLO_DATES, LIGHT_HELLO_LEVELS, type LightHelloLevel } from '../data/lightHello'
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

const DATE_CHIP_LABELS = ['🔒', '1st', '2nd', '3rd', '4th', '5th'] as const

interface LightHelloTrackerProps {
  /** 0 = no dates yet, 1–5 = highest date already seen. */
  stage: number
  level: LightHelloLevel
  onSelect: (stage: number) => void
  onLevelChange: (level: LightHelloLevel) => void
}

/** Title and level picker over a row of snug chips, with the next date's effect beside them at
 *  the chosen card level. Each chip's tooltip carries that date's own name and effect. */
export function LightHelloTracker({ stage, level, onSelect, onLevelChange }: LightHelloTrackerProps) {
  const next = LIGHT_HELLO_DATES[stage]

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
      <div className="shrink-0">
        <div className="flex items-center justify-between gap-2 pb-1">
          <h2 className="text-[11px] font-semibold text-neutral-300">Light Hello Dates</h2>
          <select
            value={level}
            onChange={(event) => onLevelChange(Number(event.target.value) as LightHelloLevel)}
            title="Light Hello card level. Energy and stat gains from the dates scale with it."
            className="cursor-pointer rounded border border-white/10 bg-neutral-900 px-0.5 text-[10px] text-neutral-300"
          >
            {LIGHT_HELLO_LEVELS.map((lv) => (
              <option key={lv} value={lv}>
                Lv {lv}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1">
          {DATE_CHIP_LABELS.map((label, index) => {
            const active = stage === index
            const date = LIGHT_HELLO_DATES[index - 1]

            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelect(index)}
                aria-pressed={active}
                title={date ? `${label} Date — ${date.name}: ${date.effect(level)}` : 'No dates seen yet'}
                className={[
                  'cursor-pointer rounded-md px-1.5 py-0.5 text-[11px] leading-tight font-medium transition',
                  active ? 'bg-fuchsia-400 text-neutral-950' : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <p className="line-clamp-3 min-w-0 flex-1 text-[11px] leading-tight text-neutral-400">
        {next ? (
          <>
            <span className="text-neutral-600">Next </span>
            {next.effect(level)}
          </>
        ) : (
          'All dates done'
        )}
      </p>
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
