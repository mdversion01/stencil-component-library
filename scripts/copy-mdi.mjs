// scripts/copy-mdi.mjs
import { promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const mdiRoot = path.join(projectRoot, 'node_modules', '@mdi', 'font');
  const outRoot = path.join(projectRoot, 'src', 'assets', 'mdi');

  const cssSrc = path.join(mdiRoot, 'css', 'materialdesignicons.min.css');
  const cssDest = path.join(outRoot, 'materialdesignicons.min.css');

  const fontsSrc = path.join(mdiRoot, 'fonts');
  const fontsDest = path.join(outRoot, 'fonts');

  // Copy CSS
  await copyFile(cssSrc, cssDest);

  // Copy fonts
  await ensureDir(fontsDest);
  const fontFiles = await fs.readdir(fontsSrc);
  for (const f of fontFiles) {
    if (/\.(eot|ttf|woff2?|otf)$/i.test(f)) {
      await copyFile(path.join(fontsSrc, f), path.join(fontsDest, f));
    }
  }

  // Rewrite font URLs in the vendored CSS so they match where Stencil will copy them
  // We’ll serve from /assets/mdi/fonts (see stencil.config.ts below)
  let css = await fs.readFile(cssDest, 'utf8');
  css = css.replace(/\.\.\/fonts\//g, '/assets/mdi/fonts/');
  await fs.writeFile(cssDest, css, 'utf8');

  console.log('✔ Copied MDI CSS & fonts to src/global/vendor/mdi and rewrote URLs.');
}

main().catch((err) => {
  console.error('copy-mdi failed:', err);
  process.exit(1);
});
