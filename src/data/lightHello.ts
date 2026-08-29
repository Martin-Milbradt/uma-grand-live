// Base values and per-level percentages from gametora's page data for the SSR card
// (https://gametora.com/umamusume/supports/30052-light-hello). Energy rewards scale with the
// card's Event Recovery and stat rewards with its Event Effectiveness, both level dependent:
// shown = floor(base * (100 + pct) / 100). Max Energy, Mood, and hint levels do not scale.
// Every date also gives Light Hello bond +5, which the compact lines leave out.
export const LIGHT_HELLO_LEVELS = [30, 35, 40, 45, 50] as const

export type LightHelloLevel = (typeof LIGHT_HELLO_LEVELS)[number]

const EVENT_RECOVERY: Record<LightHelloLevel, number> = { 30: 40, 35: 45, 40: 50, 45: 55, 50: 60 }
const EVENT_EFFECTIVENESS: Record<LightHelloLevel, number> = { 30: 25, 35: 27, 40: 30, 45: 32, 50: 35 }

const scaled = (base: number, pct: number): number => Math.floor((base * (100 + pct)) / 100)

const energy = (base: number, level: LightHelloLevel): string =>
  `Energy +${scaled(base, EVENT_RECOVERY[level])}`

const stat = (label: string, base: number, level: LightHelloLevel): string =>
  `${label} +${scaled(base, EVENT_EFFECTIVENESS[level])}`

export interface LightHelloDate {
  name: string
  /** What the date gives at a card level, condensed to a single header line. */
  effect: (level: LightHelloLevel) => string
}

export const LIGHT_HELLO_DATES: readonly LightHelloDate[] = [
  {
    name: 'Repose in the Lunar Mare',
    effect: (level) => `Max Energy +4, ${energy(25, level)}, Mood +1`,
  },
  {
    name: "Tycho's Radiance",
    effect: (level) => `${energy(25, level)}, Mood +1, ${stat('Guts', 10, level)}`,
  },
  {
    name: 'Hidden Beneath the Regolith',
    effect: (level) => `${energy(50, level)} or ${stat('Speed', 15, level)} & ${stat('Guts', 15, level)}, Mood +1`,
  },
  {
    name: 'Scaling Mons Huygens',
    effect: (level) => `${energy(30, level)}, Mood +1, ${stat('Guts', 10, level)}`,
  },
  {
    name: 'At Rainbow Cove',
    effect: (level) =>
      `${energy(30, level)}, Mood +1, ${stat('Speed', 10, level)}, ${stat('Guts', 10, level)}, See Ya Later! +3 (less on failure)`,
  },
]
