// .storybook/main.js
export default {
  logLevel: 'warn',
  framework: { name: '@storybook/web-components-vite', options: {} },
  stories: ['../stories/**/*.stories.@(js|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
  ],
  staticDirs: [
    { from: '../node_modules/@fortawesome/fontawesome-free/webfonts', to: '/assets/fonts' },
    { from: '../dist', to: '/dist' },
  ],
  docs: { autodocs: 'tag' },
};
