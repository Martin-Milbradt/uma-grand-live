# Grand Live Song Tracker

Single-screen tracker for which Grand Live (Grand Concert) songs you have bought, and what the
rest still costs in Performance Points.

## Usage

Open `grand-live.html`. That is the whole app: one self-contained file with the CSS, JS and all
28 images inlined, so it runs straight off the filesystem with no server and no network.

Click a song card to toggle it bought. Pick your current career stage in the header to control
which songs count as unlocked. Both choices persist in `localStorage`, per browser.

Tick a card's `Skip` box for a song you never intend to buy. Its cost drops out of both totals
and the card greys out, so you only save up for what you actually want. Skipped songs still
count as unowned in the `Owned` badge and the column headers.

The two header panels show what you still have to pay, broken down per Performance Point token:

| Panel | Counts |
| --- | --- |
| Still to buy, unlocked | Unbought, unskipped songs already in the shop at your current stage |
| Still to buy, total | Every unbought, unskipped song across the whole career |

Each panel's subline says how many songs it left out as skipped.

`Make Debut!` and `Girls' Legend U` are awarded free rather than bought, so they never count
towards either total. `Make Debut!` ticks itself once you reach the 1st Concert, since it is
handed over during Junior year. `Girls' Legend U` arrives in Senior year, past the last stage on
the selector, so it stays unticked.

The green `Owned` badge counts songs you have out of all 23, awarded ones included, and each
column header carries the same count for its own tier.

`Reset` clears every purchase and returns the stage to *From the start*. Skipped songs survive
it: the list of songs you are never buying outlives a single career.

## Layouts

There are two, picked by `(orientation: portrait), (max-width: 900px)` and swapped live when
you rotate the device:

| Layout | Shape |
| --- | --- |
| Wide | One screenful, no scrolling. Each stage is a column, cards shrink to the window height |
| Narrow | A pinned header over one scrolling list, stages as sections with sticky headings |

The narrow layout goes to two card columns from 640px and three from 1024px, so a portrait
tablet or a rotated monitor is not one thin ribbon of cards. Below 520px of height, a landscape
phone, the header drops its hint line and puts the stage picker beside the totals.

## Data

Song names, costs, bonuses and unlock tiers are scraped from
<https://uma.guide/guides/grand-concert>. Costs are multi-currency: each song charges some
combination of Dance, Passion, Vocal, Visual and Composure.

```bash
npm run scrape   # rewrites src/data/songs.ts and re-downloads the images
```

`src/data/songs.ts` is generated. Edit the scraper, not the data file. The scraper throws rather
than guessing if the guide's table layout changes, so a silent cost error is not possible.

## Development

```bash
npm install
npm run dev        # http://localhost:41007/ with hot reload
npm run typecheck
npm run build      # regenerates grand-live.html
```

`App.tsx` owns all the state and hands the same `ViewProps` to either `DesktopView` or
`MobileView`; the two differ in arrangement only, never in data. `npm run build` must be re-run
to fold changes into `grand-live.html`.

## Publishing

The hosted copy lives at <https://martinmilbradt.de/uma-grand-live/>. Pushing to `main` runs
`.github/workflows/pages.yml`, which serves the committed `grand-live.html` as the site's
`index.html`. Nothing is built in CI, so a change only reaches the site once `npm run build`
has been run locally and the rebuilt `grand-live.html` is committed.
