import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';

function escapeBackslashDigits() {
  return {
    postcssPlugin: 'escape-backslash-digits',
    Once(root: any) {
      root.walkDecls((decl: any) => {
        if (/[\\][0-9]/.test(decl.value)) {
          // turns \1 -> \\1  (safe for JS strings)
          decl.value = decl.value.replace(/\\([0-9])/g, '\\\\$1');
        }
      });
    },
  };
}
(escapeBackslashDigits as any).postcss = true;

export const config: Config = {
  namespace: 'stencil-component-library',
  globalStyle: 'src/global/global.scss',
  plugins: [sass({ includePaths: ['node_modules'] }), postcss({ plugins: [escapeBackslashDigits()] })],
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false
    },
    { type: 'docs-readme' },
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        { src: 'index.html' },
        { src: '../node_modules/@fortawesome/fontawesome-free/webfonts', dest: 'assets/fonts' },
        { src: 'assets/mdi/materialdesignicons.min.css', dest: 'assets/mdi/materialdesignicons.min.css' },
        { src: 'assets/mdi/fonts', dest: 'assets/mdi/fonts' },
      ],
    },
  ],
  testing: {
    browserHeadless: 'shell',
    setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'], // ← changed to .js
  },
};
