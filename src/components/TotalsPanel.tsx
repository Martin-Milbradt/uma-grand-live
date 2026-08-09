import { grandTotal } from '../totals'
import { TOKENS } from '../types'
import type { TokenTotals } from '../types'
import { TokenAmount } from './TokenAmount'

interface Props {
  title: string
  totals: TokenTotals
  songCount: number
  accent: 'amber' | 'neutral'
}

export function TotalsPanel({ title, totals, songCount, accent }: Props) {
  const highlighted = accent === 'amber'

  return (
    <section
      className={[
        'flex min-w-0 flex-1 items-center gap-3 rounded-lg border px-3 py-1.5',
        highlighted ? 'border-amber-400/40 bg-amber-400/5' : 'border-white/10 bg-white/[0.03]',
      ].join(' ')}
    >
      <div className="shrink-0 leading-tight">
        <h2 className={`text-[11px] font-semibold ${highlighted ? 'text-amber-300' : 'text-neutral-300'}`}>{title}</h2>
        <p className="text-[10px] text-neutral-500">{songCount} left</p>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-around gap-1">
        {TOKENS.map((token) => (
          <TokenAmount key={token} token={token} amount={totals[token]} size="lg" />
        ))}
      </div>

      <div className="shrink-0 border-l border-white/10 pl-3 text-right leading-tight">
        <div className="text-[10px] text-neutral-500">Sum</div>
        <div className="text-lg font-semibold tabular-nums">{grandTotal(totals)}</div>
      </div>
    </section>
  )
}
