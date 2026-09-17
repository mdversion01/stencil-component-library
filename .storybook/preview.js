// ============================================================================
// File: .storybook/preview.js
// ============================================================================

import { defineCustomElements } from '../loader';

import '@plumage/plumage-style-library/core.css';
import './styles/storybook-themes-overrides.scss';

defineCustomElements();

const BOOTSTRAP_THEMES = [
  'light',
  'dark',
];

const PLUMAGE_THEMES = [
  'plmg-lt',
  'plmg-dk',
];

const ALL_THEMES = [
  ...BOOTSTRAP_THEMES,
  ...PLUMAGE_THEMES,
];

const THEME_CLASSES = [
  'sb-theme-light',
  'sb-theme-dark',
  'plmg-lt',
  'plmg-dk',
];

function resolveTheme(
  family,
  theme,
) {
  if (family === 'plumage') {
    return PLUMAGE_THEMES.includes(theme)
      ? theme
      : 'plmg-dk';
  }

  if (family === 'allthemes') {
    return ALL_THEMES.includes(theme)
      ? theme
      : 'dark';
  }

  return BOOTSTRAP_THEMES.includes(theme)
    ? theme
    : 'dark';
}

function clearThemeClasses(
  element,
) {
  for (
    const themeClass
    of THEME_CLASSES
  ) {
    element.classList.remove(
      themeClass,
    );
  }
}

function applyTheme(
  element,
  theme,
) {
  clearThemeClasses(
    element,
  );

  switch (theme) {
    case 'light':
      element.classList.add(
        'sb-theme-light',
      );

      element.setAttribute(
        'data-bs-theme',
        'light',
      );

      break;

    case 'dark':
      element.classList.add(
        'sb-theme-dark',
      );

      element.setAttribute(
        'data-bs-theme',
        'dark',
      );

      break;

    case 'plmg-lt':
      element.classList.add(
        'plmg-lt',
      );

      element.setAttribute(
        'data-bs-theme',
        'light',
      );

      break;

    case 'plmg-dk':
      element.classList.add(
        'plmg-dk',
      );

      element.setAttribute(
        'data-bs-theme',
        'dark',
      );

      break;

    default:
      element.classList.add(
        'sb-theme-dark',
      );

      element.setAttribute(
        'data-bs-theme',
        'dark',
      );
  }
}

function withTheme(
  story,
  context,
) {
  const root =
    document.documentElement;

  const family =
    context.parameters
      ?.themeFamily ||
    'bootstrap';

  const theme =
    resolveTheme(
      family,
      context.globals.theme,
    );

  applyTheme(
    root,
    theme,
  );

  return story();
}

const preview = {
  initialGlobals: {
    theme: 'dark',
  },

  parameters: {
    themeFamily:
      'bootstrap',

    controls: {
      expanded: true,
    },

    options: {
      storySort: {
        method:
          'alphabetical',
        locales:
          'en-US',
      },
    },

    a11y: {
      context:
        '#storybook-root',
    },

    docs: {
      source: {
        dark: false,
      },
    },
  },

  decorators: [
    withTheme,
  ],
};

export default preview;
