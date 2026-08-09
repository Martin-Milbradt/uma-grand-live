import { tokenIcon } from '../assets'
import type { Token } from '../types'

type Size = 'sm' | 'md' | 'lg'

const TEXT: Record<Size, string> = {
  sm: 'text-xs font-medium px-1 py-px bg-white/5 rounded',
  md: 'text-sm font-semibold px-1.5 py-0.5 bg-white/8 rounded',
  lg: 'text-xl font-semibold',
}

const ICON: Record<Size, number> = { sm: 13, md: 16, lg: 19 }

interface Props {
  token: Token
  amount: number
  size?: Size
  muted?: boolean
}

export function TokenAmount({ token, amount, size = 'sm', muted = false }: Props) {
  return (
    <span
      title={token}
      className={[
        'inline-flex items-center gap-1 tabular-nums',
        TEXT[size],
        muted ? 'text-neutral-500' : 'text-neutral-100',
      ].join(' ')}
    >
      <img
        src={tokenIcon(token)}
        alt={token}
        width={ICON[size]}
        height={ICON[size]}
        className={muted ? 'opacity-40' : ''}
      />
      {amount}
    </span>
  )
}
