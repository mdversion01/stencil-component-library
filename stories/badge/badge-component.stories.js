// File: src/stories/badge-component/badge-component.stories.js

import DocsPage from './badge-component.docs.mdx';
import { buildDocsHtml, buildDocsHtmlMany, renderBadge, setAttr } from './badge-component.story-helpers.js';

export default {
  title: 'Components/Badge',
  tags: ['autodocs'],

  render: (args) => renderBadge(args),

  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component: [
          'Content is provided via the **default slot** (text or markup).',
          'Use `icon` with the **`icon` slot**, and `token` with the **`token` slot**.',
          '',
        ].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  argTypes: {
    label: {
      control: 'text',
      name: 'label',
      description: 'Label text for the badge.',
      table: { category: 'Content' },
    },
    badgeId: {
      control: 'text',
      name: 'badge-id',
      description: 'Sets the ID attribute on the badge component.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'text',
      description:
        'Visual variant/color for the badge (e.g., primary, secondary, success, danger, warning, info, light, dark, or any custom variant your app supports).',
      table: { category: 'Appearance' },
    },
    size: {
      control: { type: 'select' },
      options: ['base', 'xs', 'sm', 'lg'],
      description: 'Size, base, xs, sm, or lg, of the badge component.',
      table: { category: 'Appearance' },
    },
    shape: {
      control: { type: 'select' },
      options: ['', 'pill', 'square'],
      description:
        'Shape, pill, square, or circle, of the badge component. The default shape is the standard rectangle with rounded corners.',
      table: { category: 'Appearance' },
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Sets the aria-label attribute on the badge component.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'Sets the aria-labelledby attribute on the badge component.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'Sets the aria-describedby attribute on the badge component.',
      table: { category: 'Accessibility' },
    },

    disabled: {
      control: 'boolean',
      description: 'If true, sets a disabled state on the badge component.',
      table: { category: 'State', defaultValue: { summary: false } },
    },
    devMode: {
      control: 'boolean',
      name: 'dev-mode',
      description: 'If true, enables dev mode with extra logging to the console.',
      table: { category: 'State', defaultValue: { summary: false } },
    },

    outlined: {
      control: 'boolean',
      description: 'If true, renders the badge with an outlined style.',
      table: { category: 'Modes', defaultValue: { summary: false } },
    },
    bordered: {
      control: 'boolean',
      description: 'If true, adds a border to the badge component.',
      table: { category: 'Modes', defaultValue: { summary: false } },
    },
    token: {
      control: 'boolean',
      description:
        'If true, renders the badge as a token, typically used to indicate a status or category associated with the parent element.',
      table: { category: 'Modes', defaultValue: { summary: false } },
    },
    dot: {
      control: 'boolean',
      description:
        'If true, renders the badge as a small dot, often used to indicate notifications or status without text content.',
      table: { category: 'Modes', defaultValue: { summary: false } },
    },
    pulse: {
      control: 'boolean',
      description:
        'If true, adds a pulsing animation to the dot badge, typically used to draw attention to notification badges.',
      table: { category: 'Modes', defaultValue: { summary: false } },
    },
    icon: {
      control: 'boolean',
      description:
        'If true, when using an icon within a badge, this property will add the some spacing to the left and right of the icon.',
      table: { category: 'Modes', defaultValue: { summary: false } },
    },

    bdgPosition: {
      control: { type: 'select' },
      options: ['', 'left', 'right'],
      name: 'bdg-position',
      description:
        "When placing a badge on the left of any content of a <button-component>, this adds the class 'ms-1' to the badge... Placing to the right adds 'me-1'.",
      table: { category: 'Placement' },
    },
    inset: {
      control: 'boolean',
      description:
        "To be used with the token or dot badges, if true, adds the set default style of 'inset: auto auto calc(100% - 12px) calc(100% - 12px);', positioning the badge token to the upper right of the element it is used with.",
      table: { category: 'Placement', defaultValue: { summary: false } },
    },
    absolute: {
      control: 'boolean',
      description:
        'To be used with the token or dot badges, if true, adds position: absolute inline style to the badge.',
      table: { category: 'Placement', defaultValue: { summary: false } },
    },

    classNames: {
      control: 'text',
      name: 'class-names',
      description: 'Additional custom class names to apply to the badge component.',
      table: { category: 'Styling' },
    },
    elevation: {
      control: 'text',
      description: 'Applies a shadow elevation to the badge component (0-24).',
      table: { category: 'Styling' },
    },
    styles: {
      control: 'text',
      name: 'styles',
      description: 'Additional inline styles can be added to the badge. Ex: styles="color: green; padding: 10px;"',
      table: { category: 'Styling' },
    },
    inlineStyles: {
      control: 'text',
      name: 'inline-styles',
      description: 'Additional inline styles can be added to the dot or token badges. Ex: inline-styles="color: pink; padding: 10px;"',
      table: { category: 'Styling' },
    },
    backgroundColor: {
      control: 'text',
      name: 'background-color',
      description:
        'To be used with the token or dot badges, sets or adds an inline style for background color that uses any valid CSS color value.',
      table: { category: 'Styling' },
    },
    color: {
      control: 'text',
      description:
        'To be used with the token or dot badges, sets or adds an inline style for text color that uses any valid CSS color value.',
      table: { category: 'Styling' },
    },

    top: {
      control: 'text',
      description: 'To be used with the token or dot badges, adds an inline style that sets the top CSS property.',
      table: { category: 'Offsets' },
    },
    right: {
      control: 'text',
      description: 'To be used with the token or dot badges, adds an inline style that sets the right CSS property.',
      table: { category: 'Offsets' },
    },
    bottom: {
      control: 'text',
      description: 'To be used with the token or dot badges, adds an inline style that sets the bottom CSS property.',
      table: { category: 'Offsets' },
    },
    left: {
      control: 'text',
      description: 'To be used with the token or dot badges, adds an inline style that sets the left CSS property.',
      table: { category: 'Offsets' },
    },
    offsetX: {
      control: 'text',
      name: 'offset-x',
      description:
        "To be used with the token or dot badges, used with the 'inset' property to overwrite the default bottom position value. Ex: offsetX=\"50\"",
      table: { category: 'Offsets' },
    },
    offsetY: {
      control: 'text',
      name: 'offset-y',
      description:
        "To be used with the token or dot badges, used with the 'inset' property to overwrite the default left position value. Ex: offsetY=\"50\"",
      table: { category: 'Offsets' },
    },
    zIndex: {
      control: 'text',
      name: 'z-index',
      description:
        'To be used with the token or dot badges, adds an inline style that sets the z-index CSS property. Ex: z-index="100"',
      table: { category: 'Offsets' },
    },

    id: {
      table: { disable: true },
      control: false,
      description: 'ID attribute for the badge component.',
    },
    text: {
      table: { disable: true },
      control: false,
    },
    useButtonComponentChild: {
      table: { disable: true },
      control: false,
    },
    buttonText: {
      table: { disable: true },
      control: false,
    },
    buttonType: {
      table: { disable: true },
      control: false,
    },
    buttonVariant: {
      table: { disable: true },
      control: false,
    },
    buttonOutlined: {
      table: { disable: true },
      control: false,
    },
    buttonSize: {
      table: { disable: true },
      control: false,
    },
    iconMode: {
      table: { disable: true },
      control: false,
    },
    iconName: {
      table: { disable: true },
      control: false,
    },
    iconClass: {
      table: { disable: true },
      control: false,
    },
    tokenIconMode: {
      table: { disable: true },
      control: false,
    },
    tokenIconName: {
      table: { disable: true },
      control: false,
    },
    tokenIconClass: {
      table: { disable: true },
      control: false,
    },
  },

  controls: {
    exclude: [
      'id',
      'text',
      'useButtonComponentChild',
      'buttonText',
      'buttonType',
      'buttonVariant',
      'buttonOutlined',
      'buttonSize',
      'iconMode',
      'iconName',
      'iconClass',
      'tokenIconMode',
      'tokenIconName',
      'tokenIconClass',
    ],
  },

  args: {
    absolute: false,
    ariaDescribedby: '',
    ariaLabel: '',
    ariaLabelledby: '',
    backgroundColor: '',
    badgeId: '',
    bdgPosition: '',
    bordered: false,
    bottom: '',
    classNames: '',
    color: '',
    devMode: false,
    disabled: false,
    dot: false,
    elevation: '',
    icon: false,
    inlineStyles: '',
    inset: false,
    left: '',
    offsetX: '',
    offsetY: '',
    outlined: false,
    pulse: false,
    right: '',
    shape: '',
    size: '',
    styles: '',
    token: false,
    top: '',
    variant: '',
    zIndex: '',
    text: 'Badge',
    iconMode: 'icon-component',
    iconName: '',
    iconClass: '',
    tokenIconMode: 'fa',
    tokenIconName: '',
    tokenIconClass: '',
    useButtonComponentChild: false,
    buttonText: 'Action',
    buttonType: 'button',
    buttonVariant: 'secondary',
    buttonOutlined: false,
    buttonSize: 'sm',
  },
};

export const Default = {
  args: {
    text: 'Badge Base',
    ariaLabel: 'Badge Base',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic badge shown below.',
      },
    },
  },
};

export const VariantBadges = {
  name: 'Variant colors (badges only)',
  render: () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    const wrap = document.createElement('div');

    variants.forEach((v) => {
      const holder = document.createElement('span');
      holder.style.display = 'inline-block';
      holder.style.margin = '6px';

      const badge = document.createElement('badge-component');
      setAttr(badge, 'variant', v);
      setAttr(badge, 'size', 'base');
      badge.appendChild(document.createTextNode(v.charAt(0).toUpperCase() + v.slice(1)));

      holder.appendChild(badge);
      wrap.appendChild(holder);
    });

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: 'html',
        code: buildDocsHtmlMany(
          ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map(
            (v) => `<badge-component variant="${v}" size="base">${v.charAt(0).toUpperCase() + v.slice(1)}</badge-component>`,
          ),
        ),
      },
      description: {
        story: 'Displays one **badge** for each core variant: primary, secondary, success, danger, warning, info, light, and dark.',
      },
    },
  },
};

export const OutlinedCoreVariants = {
  name: 'Outlined (all core variants)',
  render: () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
    const wrap = document.createElement('div');

    variants.forEach((v) => {
      const badge = document.createElement('badge-component');
      setAttr(badge, 'outlined', true);
      setAttr(badge, 'variant', v);
      setAttr(badge, 'size', 'base');
      badge.appendChild(document.createTextNode(v.charAt(0).toUpperCase() + v.slice(1)));

      const holder = document.createElement('span');
      holder.style.display = 'inline-block';
      holder.style.margin = '6px';
      holder.appendChild(badge);
      wrap.appendChild(holder);
    });

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: 'html',
        code: buildDocsHtmlMany(
          ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map(
            (v) => `<badge-component outlined variant="${v}" size="base">${v.charAt(0).toUpperCase() + v.slice(1)}</badge-component>`,
          ),
        ),
      },
      description: {
        story: 'Outlined badges rendered in each core variant: **primary, secondary, success, danger, warning, info, light, dark**.',
      },
    },
  },
};

export const BadgeWithAnIcon = {
  args: {
    badgeId: 'badge1-icon',
    shape: 'square',
    icon: true,
    iconMode: 'icon-component',
    iconName: 'fas fa-info-circle',
    size: 'base',
    text: 'Badge with Icon',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This badge uses the `icon` property along with the `icon` slot, `<span slot="icon">` to render an icon inside the badge. The icon is provided via the `<icon-component>`.',
      },
    },
  },
};

export const BadgeSizes = {
  name: 'Badge Sizes',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';
    wrap.style.alignItems = 'center';

    const make = (size, label) => {
      const b = document.createElement('badge-component');
      b.setAttribute('variant', 'primary');
      b.setAttribute('size', size);
      b.setAttribute('badge-id', `badge-${size}`);
      b.textContent = label;
      return b;
    };

    wrap.appendChild(make('xs', 'Extra Small'));
    wrap.appendChild(make('sm', 'Small'));
    wrap.appendChild(make('base', 'Base'));
    wrap.appendChild(make('lg', 'Large'));

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: 'html',
        code: `<badge-component badge-id="badge-xs" variant="primary" size="xs">Extra Small</badge-component>
<badge-component badge-id="badge-sm" variant="primary" size="sm">Small</badge-component>
<badge-component badge-id="badge-base" variant="primary" size="base">Default</badge-component>
<badge-component badge-id="badge-lg" variant="primary" size="lg">Large</badge-component>`,
      },
      description: {
        story: 'This example shows the different size options for the badge component: xs, sm, base, and lg.',
      },
    },
  },
};

export const BadgeShapes = {
  name: 'Badge Shapes',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';
    wrap.style.alignItems = 'center';

    const make = (shape, label) => {
      const b = document.createElement('badge-component');
      b.setAttribute('variant', 'primary');
      b.setAttribute('shape', shape);
      b.setAttribute('size', 'base');
      b.setAttribute('badge-id', `badge-${shape || 'base'}`);
      b.textContent = label;
      return b;
    };

    wrap.appendChild(make('', 'Base'));
    wrap.appendChild(make('pill', 'Pill'));
    wrap.appendChild(make('square', 'Square'));

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: 'html',
        code: `<badge-component badge-id="badge-base" variant="primary">Base</badge-component>
<badge-component badge-id="badge-pill" variant="primary" shape="pill">Pill</badge-component>
<badge-component badge-id="badge-square" variant="primary" shape="square">Square</badge-component>`,
      },
      description: {
        story: 'This example shows the different shape options for the badge component: pill, square, and the default rectangular shape.',
      },
    },
  },
};

export const ButtonWithBadgeToken = {
  args: {
    id: 'badge5',
    elevation: '3',
    outlined: true,
    variant: 'purple',
    token: true,
    bordered: true,
    shape: 'circle',
    inset: true,
    useButtonComponentChild: true,
    buttonType: 'button',
    buttonVariant: 'primary',
    buttonOutlined: true,
    buttonSize: 'base',
    buttonText: 'Button with Badge Token',
    tokenIconMode: 'fa',
    tokenIconClass: 'fa-solid fa-house',
  },
  parameters: {
    docs: {
      description: {
        story: 'This example shows a badge used as a token positioned on the top-left of a button component. The badge includes an icon provided via the `token` slot.',
      },
    },
  },
};

export const ButtonWithDotBadge = {
  args: {
    id: 'badge6',
    elevation: '1',
    dot: true,
    pulse: true,
    variant: 'warning',
    useButtonComponentChild: true,
    buttonType: 'button',
    buttonVariant: 'secondary',
    buttonOutlined: true,
    buttonSize: 'base',
    buttonText: 'Button with Dot Badge',
  },
  parameters: {
    docs: {
      description: {
        story: 'This example shows a badge used as a dot with a pulsing animation, positioned on the top-right of a button component.',
      },
    },
  },
};

export const ButtonWithBadge = {
  name: 'Button with Badge',
  render: () => {
    const btn = document.createElement('button-component');
    btn.setAttribute('title-attr', 'Button with Badge');
    btn.setAttribute('btn-text', 'With a badge');
    btn.setAttribute('variant', 'primary');

    const badge = document.createElement('badge-component');
    badge.setAttribute('id', 'badge12');
    badge.setAttribute('variant', 'light');
    badge.setAttribute('bdg-position', 'right');
    badge.setAttribute('size', 'sm');
    badge.textContent = '1';

    btn.appendChild(badge);
    return btn;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: 'html',
        code: `<button-component title-attr="Button with Badge" btn-text="With a badge" variant="primary">
  <badge-component id="badge12" variant="light" bdg-position="right" size="sm">1</badge-component>
</button-component>`,
      },
      description: {
        story: 'This example shows a badge positioned on the right side of a button component, typically used to indicate notifications or counts.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.alignItems = 'start';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML = `<strong>Accessibility matrix</strong><div style="opacity:.8">Shows computed host <code>role</code> / <code>aria-*</code> values for default/token/dot variants.</div>`;
    wrap.appendChild(title);

    const mkRow = (labelText, makeEl) => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '220px 1fr';
      row.style.gap = '12px';
      row.style.alignItems = 'start';
      row.style.border = '1px solid #ddd';
      row.style.borderRadius = '8px';
      row.style.padding = '12px';

      const left = document.createElement('div');
      left.innerHTML = `<div style="font-weight:600">${labelText}</div>`;

      const right = document.createElement('div');
      right.style.display = 'grid';
      right.style.gap = '8px';

      const demo = document.createElement('div');
      demo.style.display = 'inline-flex';
      demo.style.alignItems = 'center';
      demo.style.gap = '8px';
      demo.style.flexWrap = 'wrap';

      const el = makeEl();
      demo.appendChild(el);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading computed attributes…';

      right.appendChild(demo);
      right.appendChild(pre);

      row.appendChild(left);
      row.appendChild(right);

      const update = () => {
        const attrs = {
          role: el.getAttribute('role'),
          'aria-hidden': el.getAttribute('aria-hidden'),
          'aria-label': el.getAttribute('aria-label'),
          'aria-labelledby': el.getAttribute('aria-labelledby'),
          'aria-describedby': el.getAttribute('aria-describedby'),
          'aria-live': el.getAttribute('aria-live'),
          'aria-atomic': el.getAttribute('aria-atomic'),
        };
        pre.textContent = JSON.stringify(attrs, null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      return row;
    };

    wrap.appendChild(
      mkRow('Default (no ARIA name)', () => {
        const b = document.createElement('badge-component');
        b.textContent = 'Default';
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Default (with aria-label)', () => {
        const b = document.createElement('badge-component');
        b.setAttribute('aria-label', 'Informational badge');
        b.textContent = 'Named';
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Token (with aria-label)', () => {
        const b = document.createElement('badge-component');
        b.setAttribute('token', '');
        b.setAttribute('variant', 'info');
        b.setAttribute('size', 'sm');
        b.setAttribute('aria-label', 'Status badge');
        b.textContent = 'Token';
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Dot (with aria-label)', () => {
        const b = document.createElement('badge-component');
        b.setAttribute('dot', '');
        b.setAttribute('variant', 'danger');
        b.setAttribute('pulse', '');
        b.setAttribute('aria-label', 'Notification badge');
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Override role (role="img")', () => {
        const b = document.createElement('badge-component');
        b.setAttribute('role', 'img');
        b.setAttribute('aria-label', 'Badge image role override');
        b.textContent = 'Override';
        return b;
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders several badge modes and prints the **computed host** accessibility attributes (role + aria-*). Useful for validating 508 compliance behavior after changes.',
      },
      source: {
        language: 'html',
        code: `<!-- Default (no ARIA name) -->
<badge-component>Default</badge-component>

<!-- Default (with aria-label) -->
<badge-component aria-label="Informational badge">Named</badge-component>

<!-- Token (with aria-label) -->
<badge-component token variant="info" size="sm" aria-label="Status badge">Token</badge-component>

<!-- Dot (with aria-label) -->
<badge-component dot pulse variant="danger" aria-label="Notification badge"></badge-component>

<!-- Override role -->
<badge-component role="img" aria-label="Badge image role override">Override</badge-component>`,
      },
    },
  },
};
