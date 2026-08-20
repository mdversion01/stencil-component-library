// File: .storybook/main.js

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const storybookDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(storybookDirectory, '..');
const styleLibraryRoot = path.resolve(
  projectRoot,
  '../../plumage-style-library',
);
const styleLibraryEntry = path.resolve(
  styleLibraryRoot,
  'src/core.scss',
);

export default {
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],

  staticDirs: [
    {
      from: '../node_modules/@fortawesome/fontawesome-free/webfonts',
      to: '/assets/fonts',
    },
    {
      from: '../dist',
      to: '/dist',
    },
  ],

  async viteFinal(config) {
    return {
      ...config,

      resolve: {
        ...config.resolve,

        alias: {
          ...config.resolve?.alias,

          // Development-only:
          // point the packaged CSS import at the live SCSS source.
          '@plumage/plumage-style-library/core.css': styleLibraryEntry,
        },
      },

      server: {
        ...config.server,

        fs: {
          ...config.server?.fs,

          // The style library lives outside this project's Vite root.
          allow: [
            projectRoot,
            styleLibraryRoot,
          ],
        },
      },
    };
  },
};
