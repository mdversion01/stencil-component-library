import { promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function copyDir(srcDir, destDir, filter = () => true) {
  await ensureDir(destDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyDir(src, dest, filter);
      continue;
    }

    if (filter(entry.name, src, dest)) {
      await fs.copyFile(src, dest);
    }
  }
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const faFontsSrc = path.join(projectRoot, 'node_modules', '@fortawesome', 'fontawesome-free', 'webfonts');
  const faFontsDest = path.join(projectRoot, 'assets', 'fonts');

  await copyDir(faFontsSrc, faFontsDest, name => /\.(eot|ttf|woff2?|otf|svg)$/i.test(name));

  console.log('✔ Copied Font Awesome fonts to assets/fonts');
}

main().catch(err => {
  console.error('copy-package-assets failed:', err);
  process.exit(1);
});
