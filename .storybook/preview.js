// File: .storybook/preview.js

import { defineCustomElements } from '../loader';
import { withThemeByClassName } from '@storybook/addon-themes';

import '@plumage/plumage-style-library/core.css';
import './styles/storybook-themes-overrides.scss';

defineCustomElements();

const BOOTSTRAP_THEME_MAP = {
  light: 'light',
  dark: 'dark',
  'plmg-lt': 'light',
  'plmg-dk': 'dark',
};

function withBootstrapTheme(story, context) {
  const themeName = context.globals.theme ?? 'dark';
  const bootstrapTheme = BOOTSTRAP_THEME_MAP[themeName] ?? 'dark';

  document.documentElement.setAttribute(
    'data-bs-theme',
    bootstrapTheme,
  );

  return story();
}

const preview = {
  parameters: {
    controls: {
      expanded: true,
    },

    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'en-US',
      },
    },

    a11y: {
      context: '#storybook-root',
    },

    docs: {
      source: {
        dark: false,
      },
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: 'sb-theme-light',
        dark: 'sb-theme-dark',
        'plmg-lt': 'plmg-lt',
        'plmg-dk': 'plmg-dk',
      },

      defaultTheme: 'dark',
    }),

    withBootstrapTheme,
  ],
};

export default preview;

