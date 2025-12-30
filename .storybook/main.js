// // .storybook/main.js   ← create/replace (not .ts)
// export default {
//   framework: { name: '@storybook/web-components-vite', options: {} },
//   stories: ['../stories/**/*.stories.@(js)'], // JS only, outside configDir
//   addons: [],                                  // nothing; remove all addons for now
//   docs: { autodocs: false },
// };

// // .storybook/main.ts
// import type { StorybookConfig } from '@storybook/web-components-vite';

// const config: StorybookConfig = {
//   stories: ['../stories/**/*.stories.@(js|ts|tsx)'],
//   addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-interactions'],
//   framework: { name: '@storybook/web-components-vite', options: {} },

//   // ⬇️ Serve your built assets at /assets (fonts, mdi, etc.)
//   staticDirs: [
//     { from: '../www/assets', to: '/assets' }, // so /assets/fonts/... resolves
//   ],

//   docs: { autodocs: 'tag' },
// };
// export default config;

// Use ONE mapping that matches the URL your CSS requests.

// If your CSS requests /assets/fonts/fa-solid-900.woff2  ← (your 404)
export default {
  framework: { name: '@storybook/web-components-vite', options: {} },
  stories: ['../stories/**/*.stories.@(js|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  staticDirs: [
    // Mount Font Awesome webfonts from node_modules to /assets/fonts
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
