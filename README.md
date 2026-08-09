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

## Layout

One layout for every screen: a pinned header over a scrolling list of songs, split into stage
sections whose headings stick to the top of the scroller. It holds from a 360px phone up to a
monitor, where the whole career fits without scrolling anyway, so there is no second layout to
switch to and no width at which the page falls apart.

The grid takes a card column at each of 640, 1024, 1280, 1536 and 1800px, keeping cards at
roughly 300px, which is about what one needs to stay readable. At 1920px that is six columns
and the career runs about 70px past the fold; at 2560px it all fits.

The header collapses a step at a time as the window shrinks, so nothing is dropped, it is only
rearranged:

| Width | Header |
| --- | --- |
| From 1280px | Stage picker beside the title, both totals panels side by side |
| From 768px | Stage picker beside the title, totals panels stacked |
| Below 768px | Stage picker on its own row |

Each totals panel decides separately, from its own width rather than the window's, whether the
tokens fit between the title and the sum or have to drop to a second line. Below 520px of
height, meaning a landscape phone, the header also drops its hint line and puts the two panels
side by side.

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

`App.tsx` owns the state and the page; everything under `src/components/` is presentational and
takes what it draws as props. `npm run build` must be re-run to fold changes into
`grand-live.html`.

## Publishing

The hosted copy lives at <https://martinmilbradt.de/uma-grand-live/>. Pushing to `main` runs
`.github/workflows/pages.yml`, which serves the committed `grand-live.html` as the site's
`index.html`. Nothing is built in CI, so a change only reaches the site once `npm run build`
has been run locally and the rebuilt `grand-live.html` is committed.
