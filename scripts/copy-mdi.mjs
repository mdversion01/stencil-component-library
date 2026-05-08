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
      await copyFile(src, dest);
    }
  }
}

function stripSourceMapComments(css) {
  return css
    .replace(/\/\*# sourceMappingURL=.*?\*\//g, '')
    .replace(/\/\*@ sourceMappingURL=.*?\*\//g, '')
    .replace(/\/\/# sourceMappingURL=.*$/gm, '')
    .replace(/\/\/@ sourceMappingURL=.*$/gm, '')
    .trimEnd();
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const mdiRoot = path.join(projectRoot, 'node_modules', '@mdi', 'font');

  const cssSrc = path.join(mdiRoot, 'css', 'materialdesignicons.min.css');
  const fontsSrc = path.join(mdiRoot, 'fonts');

  const vendoredRoot = path.join(projectRoot, 'src', 'assets', 'mdi');
  const vendoredCssDest = path.join(vendoredRoot, 'materialdesignicons.min.css');
  const vendoredFontsDest = path.join(vendoredRoot, 'fonts');

  const packageRoot = path.join(projectRoot, 'assets', 'mdi');
  const packageCssDest = path.join(packageRoot, 'materialdesignicons.min.css');
  const packageFontsDest = path.join(packageRoot, 'fonts');

  await copyFile(cssSrc, vendoredCssDest);
  await copyDir(fontsSrc, vendoredFontsDest, name => /\.(eot|ttf|woff2?|otf)$/i.test(name));

  let css = await fs.readFile(vendoredCssDest, 'utf8');
  css = css.replace(/\.\.\/fonts\//g, '../../assets/mdi/fonts/');
  css = stripSourceMapComments(css);
  css += '\n';
  await fs.writeFile(vendoredCssDest, css, 'utf8');

  await copyFile(vendoredCssDest, packageCssDest);
  await copyDir(vendoredFontsDest, packageFontsDest, name => /\.(eot|ttf|woff2?|otf)$/i.test(name));

  console.log('✔ Copied MDI assets to src/assets/mdi and package assets/mdi');
}

main().catch(err => {
  console.error('copy-mdi failed:', err);
  process.exit(1);
});
