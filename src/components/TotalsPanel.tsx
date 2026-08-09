import { grandTotal } from '../totals'
import { TOKENS } from '../types'
import type { TokenTotals } from '../types'
import { TokenAmount } from './TokenAmount'

interface Props {
  title: string
  totals: TokenTotals
  songCount: number
  skippedCount: number
  accent: 'amber' | 'neutral'
  /** Narrow layouts stack the tokens under the title instead of sitting them all in one row. */
  stacked?: boolean
}

export function TotalsPanel({ title, totals, songCount, skippedCount, accent, stacked = false }: Props) {
  const highlighted = accent === 'amber'
  const frame = highlighted ? 'border-amber-400/40 bg-amber-400/5' : 'border-white/10 bg-white/[0.03]'

  const heading = (
    <div className="min-w-0 shrink-0 leading-tight">
      <h2 className={`truncate text-[11px] font-semibold ${highlighted ? 'text-amber-300' : 'text-neutral-300'}`}>
        {title}
      </h2>
      <p className="text-[10px] text-neutral-500">
        {songCount} left
        {skippedCount > 0 && <span className="text-amber-300/70"> · {skippedCount} skipped</span>}
      </p>
    </div>
  )

  const sum = (
    <div className={`shrink-0 text-right leading-tight ${stacked ? '' : 'border-l border-white/10 pl-3'}`}>
      <div className="text-[10px] text-neutral-500">Sum</div>
      <div className="text-lg font-semibold tabular-nums">{grandTotal(totals)}</div>
    </div>
  )

  const tokens = TOKENS.map((token) => <TokenAmount key={token} token={token} amount={totals[token]} size="lg" />)

  if (stacked) {
    return (
      <section className={`rounded-lg border px-3 py-1.5 ${frame}`}>
        <div className="flex items-start justify-between gap-2">
          {heading}
          {sum}
        </div>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">{tokens}</div>
      </section>
    )
  }

  return (
    <section className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg border px-3 py-1.5 ${frame}`}>
      {heading}
      {/* Wraps rather than overflowing: the tokens do not shrink, and without this they spill
          out of the panel and paint over whatever sits next to it. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-around gap-x-2 gap-y-0.5">{tokens}</div>
      {sum}
    </section>
  )
}
