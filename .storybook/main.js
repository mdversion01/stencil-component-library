// .storybook/main.js
export default {
  framework: { name: '@storybook/web-components-vite', options: {} },
  stories: ['../stories/**/*.stories.@(js|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],

  // Only mount FA webfonts. We’ll import JS/CSS via relative paths in preview.js.
  staticDirs: [
    { from: '../node_modules/@fortawesome/fontawesome-free/webfonts', to: '/assets/fonts' },
  ],

  docs: { autodocs: 'tag' },
};


/*
// OR, if your CSS instead references /webfonts/fa-solid-900.woff2, use:
export default {
  ...,
  staticDirs: [
    { from: '../node_modules/@fortawesome/fontawesome-free/webfonts', to: '/webfonts' },
  ],
  ...
};
*/
