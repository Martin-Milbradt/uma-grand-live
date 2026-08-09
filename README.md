# Grand Live Song Tracker

Single-screen tracker for which Grand Live (Grand Concert) songs you have bought, and what the
rest still costs in Performance Points.

## Usage

Open `grand-live.html`. That is the whole app: one self-contained file with the CSS, JS and all
28 images inlined, so it runs straight off the filesystem with no server and no network.

Click a song card to toggle it bought. Pick your current career stage in the header to control
which songs count as unlocked. Both choices persist in `localStorage`, per browser.

The two header panels show what you still have to pay, broken down per Performance Point token:

| Panel | Counts |
| --- | --- |
| Still to buy, unlocked | Unbought songs already in the shop at your current stage |
| Still to buy, total | Every unbought song across the whole career |

`Make Debut!` and `Girls' Legend U` are awarded free rather than bought, so they never count
towards either total. `Make Debut!` ticks itself once you reach the 1st Concert, since it is
handed over during Junior year. `Girls' Legend U` arrives in Senior year, past the last stage on
the selector, so it stays unticked.

The green `Owned` badge counts songs you have out of all 23, awarded ones included, and each
column header carries the same count for its own tier.

`Reset` clears every purchase and returns the stage to *From the start*.

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

The song grid sizes its rows to the viewport, so it fits any window height without cutting off
the last card. `npm run build` must be re-run to fold changes into `grand-live.html`.
