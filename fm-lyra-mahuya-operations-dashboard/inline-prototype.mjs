// Post-build: replaces prototype.html src with srcdoc for local file compatibility
import { readFileSync, writeFileSync } from 'fs'

const htmlPath = './dist-single/index.html'
const prototypePath = './public/prototype.html'

const prototypeContent = readFileSync(prototypePath, 'utf-8')
const escaped = prototypeContent
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${')

let html = readFileSync(htmlPath, 'utf-8')

// Inject prototype HTML as a global JS variable
const INJECT = `<script>window.__PROTO_HTML__=\`${escaped}\`;</script>`
html = html.replace('</head>', INJECT + '</head>')

// Patch the two iframe src props in the Vite bundle (they use backtick strings)
html = html.replace(
  'src:`/prototype.html?embed=topbar`',
  'srcdoc:window.__PROTO_HTML__'
)
html = html.replace(
  'src:`/prototype.html?embed=full`',
  'srcdoc:window.__PROTO_HTML__'
)

writeFileSync(htmlPath, html)
const size = Math.round(readFileSync(htmlPath).length / 1024)
const matches = (html.match(/srcdoc:window\.__PROTO_HTML__/g) || []).length
console.log(`✓ prototype inlined — file size: ${size} KB, srcdoc patches: ${matches}`)
