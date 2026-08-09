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
}

/**
 * Lays itself out from its own width rather than the window's: given room it sits the tokens
 * between the title and the sum on one line, and drops them onto a second line when squeezed.
 */
export function TotalsPanel({ title, totals, songCount, skippedCount, accent }: Props) {
  const highlighted = accent === 'amber'

  return (
    <section
      className={[
        '@container flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-1.5',
        highlighted ? 'border-amber-400/40 bg-amber-400/5' : 'border-white/10 bg-white/[0.03]',
      ].join(' ')}
    >
      <div className="order-1 min-w-0 shrink-0 leading-tight">
        <h2 className={`truncate text-[11px] font-semibold ${highlighted ? 'text-amber-300' : 'text-neutral-300'}`}>
          {title}
        </h2>
        <p className="text-[10px] text-neutral-500">
          {songCount} left
          {skippedCount > 0 && <span className="text-amber-300/70"> · {skippedCount} skipped</span>}
        </p>
      </div>

      {/* Second in the source so it keeps the title company on the wrapped line. */}
      <div className="order-2 ml-auto shrink-0 text-right leading-tight @lg:order-3 @lg:ml-0 @lg:border-l @lg:border-white/10 @lg:pl-3">
        <div className="text-[10px] text-neutral-500">Sum</div>
        <div className="text-lg font-semibold tabular-nums">{grandTotal(totals)}</div>
      </div>

      <div className="order-3 flex basis-full flex-wrap items-center justify-around gap-x-2 gap-y-0.5 @lg:order-2 @lg:min-w-0 @lg:flex-1 @lg:basis-0">
        {TOKENS.map((token) => (
          <TokenAmount key={token} token={token} amount={totals[token]} size="lg" />
        ))}
      </div>
    </section>
  )
}
