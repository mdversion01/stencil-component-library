import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';

export const config: Config = {
  namespace: 'stencil-component-library',
  globalStyle: 'src/global/global.scss',
  plugins: [sass({ includePaths: ['node_modules'] }), postcss()],
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'dist-custom-elements', customElementsExportBehavior: 'auto-define-custom-elements', externalRuntime: false },
    { type: 'docs-readme' },
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        { src: 'index.html' },
        { src: '../node_modules/@fortawesome/fontawesome-free/webfonts', dest: 'assets/fonts' },
        { src: 'assets/mdi/materialdesignicons.min.css', dest: 'assets/mdi/materialdesignicons.min.css' },
        { src: 'assets/mdi/fonts', dest: 'assets/mdi/fonts' }
      ],
    },
  ],
  testing: {
    browserHeadless: 'shell',
    setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'], // ← changed to .js
  },
};
