// File: .storybook/main.js

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
};
