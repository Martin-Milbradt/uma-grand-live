/**
 * Folds the Vite build into one self-contained grand-live.html at the repo root.
 *
 * Images are already data URIs (see src/assets.ts), so after inlining the JS and CSS the
 * file has no external references at all and runs from a file:// URL.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = `${ROOT}/grand-live.html`

let html = await readFile(`${ROOT}/dist/index.html`, 'utf8')

const script = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)
if (!script) throw new Error('No bundled <script> in dist/index.html')

const style = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)
if (!style) throw new Error('No bundled stylesheet in dist/index.html')

const asset = (href) => readFile(resolve(`${ROOT}/dist`, href.replace(/^\.?\//, '')), 'utf8')

const [js, css] = await Promise.all([asset(script[1]), asset(style[1])])

// Vite tags the entry type="module" regardless of output format. We re-emit it as a classic
// script, which only works if Rollup really produced an IIFE: module scripts fail on file://.
if (/^\s*(import|export)[\s{*]/m.test(js)) {
  throw new Error('Bundle contains ESM syntax; a classic <script> would not load it')
}

// `$` sequences are meaningful to String.replace, so substitute via a function.
html = html.replace(style[0], () => `<style>\n${css}\n</style>`)

// A classic inline script runs where it sits, so it has to come after #root exists.
// (The original tag was a deferred module in <head>.)
html = html.replace(script[0], '')
if (!html.includes('</body>')) throw new Error('No </body> to append the bundle to')
html = html.replace('</body>', () => `<script>\n${js}\n</script>\n</body>`)

if (/<(script|link)[^>]*(src|href)=/.test(html)) {
  throw new Error('Output still references an external file')
}

await writeFile(OUT, html)
const kb = Math.round(Buffer.byteLength(html) / 1024)
console.log(`Wrote grand-live.html (${kb} kB, fully self-contained)`)
