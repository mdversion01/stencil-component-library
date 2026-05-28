import DocsPage from './icon-component.docs.mdx';
import {
  buildDocsHtml,
  buildIcon,
  buildIconRow,
  renderMatrixRow,
} from './icon-component.story-helpers.js';

export default {
  title: 'Components/Icon',
  tags: ['autodocs'],
  render: (args) => buildIcon(args),
  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component:
          'Icon component for rendering Font Awesome or similar icon classes with optional sizing, color, spacing, and accessibility hooks.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    icon: {
      control: 'text',
      table: { category: 'Content' },
      description: 'CSS class string for the icon, such as a Font Awesome class.',
    },
    iconMargin: {
      control: { type: 'select' },
      options: ['', 'left', 'right'],
      name: 'icon-margin',
      table: { category: 'Layout' },
      description: 'Applies left or right spacing utility classes to the icon.',
    },
    size: {
      control: 'text',
      table: { category: 'Appearance' },
      description: 'Optional size class to apply to the icon element.',
    },
    tokenIcon: {
      control: 'boolean',
      name: 'token-icon',
      table: { category: 'Appearance', defaultValue: { summary: false } },
      description: 'Applies token icon styling.',
    },
    iconSize: {
      control: 'number',
      name: 'icon-size',
      table: { category: 'Appearance' },
      description: 'Inline font-size in pixels.',
    },
    color: {
      control: 'text',
      table: { category: 'Appearance' },
      description: 'Inline color style for the icon.',
    },
    iconAriaLabel: {
      control: 'text',
      name: 'icon-aria-label',
      table: { category: 'Accessibility' },
      description: 'Accessible name for a meaningful icon. Required when icon-aria-hidden is false.',
    },
    iconAriaHidden: {
      control: 'boolean',
      name: 'icon-aria-hidden',
      table: { category: 'Accessibility', defaultValue: { summary: true } },
      description: 'Decorative by default. Set to false to expose the icon to assistive technology.',
    },

    storyLabel: {
      control: false,
      table: { disable: true },
      name: 'story-label',
    },
    showAsRow: {
      control: false,
      name: 'show-as-row',
      table: { disable: true },
    },
    matrixMode: {
      control: false,
      name: 'matrix-mode',
      table: { disable: true },
    },
  },
  args: {
    icon: 'fa-solid fa-user',
    iconMargin: '',
    size: '',
    tokenIcon: false,
    iconSize: undefined,
    color: '',
    iconAriaLabel: '',
    iconAriaHidden: true,

    storyLabel: '',
    showAsRow: false,
    matrixMode: false,
  },
};

// Keep all existing stories.
// Add these only if your file does not already have equivalent stories.

export const Basic = {
  args: {
    icon: 'fa-solid fa-user',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic decorative icon.',
      },
    },
  },
};

export const ColoredAndSized = {
  args: {
    icon: 'fa-solid fa-circle-info',
    color: '#2563eb',
    iconSize: 18,
  },
  parameters: {
    docs: {
      description: {
        story: 'An icon with inline color and font-size styling.',
      },
    },
  },
};

export const TokenIcon = {
  args: {
    icon: 'fa-solid fa-bell',
    tokenIcon: true,
    color: '#dc2626',
  },
  parameters: {
    docs: {
      description: {
        story: 'An icon using the token-icon mode.',
      },
    },
  },
};

export const AccessibleMeaningfulIcon = {
  args: {
    icon: 'fa-solid fa-circle-info',
    iconAriaHidden: false,
    iconAriaLabel: 'Information',
    color: '#2563eb',
    iconSize: 18,
  },
  parameters: {
    docs: {
      description: {
        story: 'A meaningful icon exposed to assistive technology with role="img" and aria-label.',
      },
    },
  },
};

export const MarginVariants = {
  render: () =>
    buildIconRow([
      { icon: 'fa-solid fa-arrow-left', iconMargin: 'right' },
      { icon: 'fa-solid fa-arrow-right', iconMargin: 'left' },
      { icon: 'fa-solid fa-star' },
    ]),
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: 'html',
        code: `<icon-component icon="fa-solid fa-arrow-left" icon-margin="right"></icon-component>
<icon-component icon="fa-solid fa-arrow-right" icon-margin="left"></icon-component>
<icon-component icon="fa-solid fa-star"></icon-component>`,
      },
      description: {
        story: 'Examples showing icon margin helpers.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '16px';

    const intro = document.createElement('div');
    intro.innerHTML = `
      <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
      <div style="font-size:13px; color:#444;">
        Renders decorative and meaningful icon variants and prints computed <code>aria-*</code> and <code>role</code>.
      </div>
    `;
    root.appendChild(intro);

    const rows = [
      {
        title: 'Decorative (default)',
        args: {
          icon: 'fa-solid fa-user',
          iconAriaHidden: true,
        },
      },
      {
        title: 'Meaningful with aria-label',
        args: {
          icon: 'fa-solid fa-circle-info',
          iconAriaHidden: false,
          iconAriaLabel: 'Information',
          color: '#2563eb',
        },
      },
      {
        title: 'Meaningful requested but missing label',
        args: {
          icon: 'fa-solid fa-triangle-exclamation',
          iconAriaHidden: false,
          iconAriaLabel: '',
          color: '#dc2626',
        },
      },
      {
        title: 'Token icon',
        args: {
          icon: 'fa-solid fa-bell',
          tokenIcon: true,
          iconAriaHidden: true,
          color: '#dc2626',
        },
      },
    ];

    rows.forEach((row) => {
      root.appendChild(renderMatrixRow(row));
    });

    return root;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Matrix of decorative and meaningful icon states showing computed aria-hidden, aria-label, role, and final icon classes.',
      },
      source: {
        language: 'html',
        code: `<!-- Decorative -->
<icon-component icon="fa-solid fa-user"></icon-component>

<!-- Meaningful -->
<icon-component
  icon="fa-solid fa-circle-info"
  icon-aria-hidden="false"
  icon-aria-label="Information"
  color="#2563eb"
></icon-component>

<!-- Missing label fallback -->
<icon-component
  icon="fa-solid fa-triangle-exclamation"
  icon-aria-hidden="false"
></icon-component>

<!-- Token icon -->
<icon-component
  icon="fa-solid fa-bell"
  token-icon
  color="#dc2626"
></icon-component>`,
      },
    },
  },
};
