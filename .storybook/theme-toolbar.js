// ============================================================================
// File: .storybook/theme-toolbar.js
// ============================================================================

import React, { useEffect } from 'react';

import {
  addons,
  types,
  useGlobals,
  useParameter,
} from 'storybook/manager-api';

const ADDON_ID = 'custom-theme-selector';
const TOOL_ID = `${ADDON_ID}/toolbar`;

const BOOTSTRAP_OPTIONS = [
  {
    value: 'light',
    label: 'Bootstrap Light',
  },
  {
    value: 'dark',
    label: 'Bootstrap Dark',
  },
];

const PLUMAGE_OPTIONS = [
  {
    value: 'plmg-lt',
    label: 'Plumage Light',
  },
  {
    value: 'plmg-dk',
    label: 'Plumage Dark',
  },
];

const COMBINED_OPTIONS = [
  ...BOOTSTRAP_OPTIONS,
  ...PLUMAGE_OPTIONS,
];

function ThemeToolbar() {
  const [globals, updateGlobals] = useGlobals();

  const themeFamily = useParameter(
    'themeFamily',
    'bootstrap',
  );

  const isPlumage =
    themeFamily === 'plumage';

  const isAllThemes =
    themeFamily === 'allthemes';

  const options = isAllThemes
    ? COMBINED_OPTIONS
    : isPlumage
      ? PLUMAGE_OPTIONS
      : BOOTSTRAP_OPTIONS;

  const fallbackTheme = isPlumage
    ? 'plmg-dk'
    : 'dark';

  const selectedTheme = options.some(
    option =>
      option.value === globals.theme,
  )
    ? globals.theme
    : fallbackTheme;

  useEffect(() => {
    if (
      globals.theme === selectedTheme
    ) {
      return;
    }

    updateGlobals({
      theme: selectedTheme,
    });
  }, [
    globals.theme,
    selectedTheme,
    updateGlobals,
  ]);

  const handleChange = event => {
    updateGlobals({
      theme: event.target.value,
    });
  };

  return React.createElement(
    'label',
    {
      title: 'Theme',
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0 8px',
        height: '100%',
      },
    },
    React.createElement(
      'span',
      {
        style: {
          fontSize: '12px',
          fontWeight: 600,
        },
      },
      'Theme',
    ),
    React.createElement(
      'select',
      {
        value: selectedTheme,
        onChange: handleChange,
        'aria-label': 'Theme',
        style: {
          height: '28px',
          minWidth:
            isAllThemes || isPlumage
              ? '135px'
              : '80px',
          borderRadius: '4px',
          padding: '0 24px 0 8px',
          fontSize: '12px',
          cursor: 'pointer',
        },
      },
      ...options.map(option =>
        React.createElement(
          'option',
          {
            key: option.value,
            value: option.value,
          },
          option.label,
        ),
      ),
    ),
  );
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Theme',

    match: ({ viewMode }) =>
      viewMode === 'story' ||
      viewMode === 'docs',

    render: () =>
      React.createElement(
        ThemeToolbar,
      ),
  });
});
