// scripts/fix-style-paths.mjs
import fs from 'node:fs'
import path from 'node:path'

const cssPath = path.resolve(
  'dist/stencil-component-library/stencil-component-library.css'
)

if (!fs.existsSync(cssPath)) {
  console.error(`CSS file not found: ${cssPath}`)
  process.exit(1)
}

let css = fs.readFileSync(cssPath, 'utf8')

css = css.replaceAll('url("/assets/fonts/', 'url("../../www/assets/fonts/')
css = css.replaceAll('url("/assets/mdi/fonts/', 'url("../../www/assets/mdi/fonts/')
css = css.replaceAll('url("/assets/mdi/', 'url("../../www/assets/mdi/')

fs.writeFileSync(cssPath, css)

console.log(`Updated asset URLs in ${cssPath}`)
