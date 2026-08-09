import type { Token } from './types'

/**
 * Images are pulled in as `?inline` data URIs so the whole app can ship as a single
 * self-contained .html file that works straight off the filesystem.
 */
const covers = import.meta.glob('./assets/songs/*.webp', {
  eager: true,
  query: '?inline',
  import: 'default',
}) as Record<string, string>

const icons = import.meta.glob('./assets/tokens/*.png', {
  eager: true,
  query: '?inline',
  import: 'default',
}) as Record<string, string>

/** Icon file ids on uma.guide, mirrored into src/assets/tokens. */
const TOKEN_ICON: Record<Token, string> = {
  dance: '00',
  passion: '01',
  vocal: '02',
  visual: '03',
  composure: '05',
}

function lookup(map: Record<string, string>, path: string): string {
  const found = map[path]
  if (found === undefined) throw new Error(`Missing bundled asset: ${path}`)
  return found
}

export const songCover = (id: string): string => lookup(covers, `./assets/songs/${id}.webp`)

export const tokenIcon = (token: Token): string => lookup(icons, `./assets/tokens/${TOKEN_ICON[token]}.png`)
