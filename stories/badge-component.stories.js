// stories/badge-component.stories.js

import { size } from '@floating-ui/dom';

// helper: set/remove attributes based on value
const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export default {
  title: 'Components/Badge',
  tags: ['autodocs'],

  render: args => {
    const el = document.createElement('badge-component');

    // strings
    setAttr(el, 'id', args.id);
    setAttr(el, 'aria-label', args.ariaLabel);
    setAttr(el, 'badge-id', args.badgeId);
    setAttr(el, 'label', args.label);
    setAttr(el, 'variant', args.variant);
    setAttr(el, 'size', args.size);
    setAttr(el, 'shape', args.shape);
    setAttr(el, 'class-names', args.classNames);
    setAttr(el, 'bdg-position', args.bdgPosition);
    setAttr(el, 'elevation', args.elevation);
    setAttr(el, 'background-color', args.backgroundColor);
    setAttr(el, 'color', args.color);
    setAttr(el, 'inline-styles', args.inlineStyles);
    setAttr(el, 'styles', args.styles);
    setAttr(el, 'left', args.left);
    setAttr(el, 'right', args.right);
    setAttr(el, 'top', args.top);
    setAttr(el, 'bottom', args.bottom);
    setAttr(el, 'offset-x', args.offsetX);
    setAttr(el, 'offset-y', args.offsetY);
    setAttr(el, 'z-index', args.zIndex);
    setAttr(el, 'aria-labelledby', args.ariaLabelledby);
    setAttr(el, 'aria-describedby', args.ariaDescribedby);

    // booleans
    setAttr(el, 'absolute', args.absolute);
    setAttr(el, 'disabled', args.disabled);
    setAttr(el, 'outlined', args.outlined);
    setAttr(el, 'bordered', args.bordered);
    setAttr(el, 'pulse', args.pulse);
    setAttr(el, 'inset', args.inset);
    setAttr(el, 'icon', args.icon);
    setAttr(el, 'token', args.token);
    setAttr(el, 'dot', args.dot);
    setAttr(el, 'dev-mode', args.devMode);

    // ---------- slot content ----------
    // Default slot: either plain text or a <button-component>
    if (args.useButtonComponentChild) {
      const btnc = document.createElement('button-component');
      setAttr(btnc, 'type', args.buttonType || 'button');
      setAttr(btnc, 'variant', args.buttonVariant || 'secondary');
      setAttr(btnc, 'outlined', !!args.buttonOutlined);
      setAttr(btnc, 'size', args.buttonSize || 'sm');
      btnc.textContent = args.buttonText || 'Action';
      el.appendChild(btnc);
    } else if (args.text) {
      el.appendChild(document.createTextNode(args.text));
    }

    // Icon slot (rendered when `icon` is true)
    if (args.icon) {
      const iconHost = document.createElement('span');
      iconHost.setAttribute('slot', 'icon');
      if (args.iconMode === 'icon-component' && args.iconName) {
        iconHost.innerHTML = `<icon-component icon="${args.iconName}"></icon-component>`;
      } else if (args.iconClass) {
        iconHost.innerHTML = `<i class="${args.iconClass}"></i>`;
      }
      el.appendChild(iconHost);
    }

    // Token slot (useful for token mode)
    if (args.token) {
      if (args.tokenIconMode === 'icon-component' && args.tokenIconName) {
        const tokenIcon = document.createElement('span');
        tokenIcon.setAttribute('slot', 'token');
        tokenIcon.innerHTML = `<icon-component icon="${args.tokenIconName}"></icon-component>`;
        el.appendChild(tokenIcon);
      } else if (args.tokenIconClass) {
        const tokenIcon = document.createElement('span');
        tokenIcon.setAttribute('slot', 'token');
        tokenIcon.innerHTML = `<i class="${args.tokenIconClass}"></i>`;
        el.appendChild(tokenIcon);
      }
    }

    // demo click log
    el.addEventListener('customClick', e => {
      // eslint-disable-next-line no-console
      console.log('[badge-component] customClick', e?.detail);
    });

    return el;
  },

  parameters: {
    docs: {
      description: {
        component: ['Content is provided via the **default slot** (text or markup).', 'Use `icon` with the **`icon` slot**, and `token` with the **`token` slot**.', ''].join('\n'),
      },
    },
  },

  argTypes: {
    // Layout/position (dynamic style related)
    absolute: { control: 'boolean', description: 'To be used with the token or dot badges, if true, adds position: absolute inline style to the badge.' },
    ariaDescribedby: { control: 'text', description: 'Sets the aria-describedby attribute on the badge component.' },
    ariaLabel: { control: 'text', description: 'Sets the aria-label attribute on the badge component.' },
    ariaLabelledby: { control: 'text', description: 'Sets the aria-labelledby attribute on the badge component.' },
    backgroundColor: {
      control: 'text',
      description: 'To be used with the token or dot badges, sets or adds an inline style for background color that uses any valid CSS color value (e.g., hex, rgb, color name).',
    },
    badgeId: { control: 'text', description: 'Sets the ID attribute on the badge component.' },
    bdgPosition: {
      control: { type: 'select' },
      options: ['', 'left', 'right'],
      description:
        "When placing a badge on the left of any content of a <button-component>, this adds the class 'mr-1' to the badge, which provide 4px's of space between the badge and the content. Placing the badge to the right, and assigning 'right' to the property will do the reverse, adding the class of 'ml-1'. Ex: bdgPosition=\"left\" or bdgPosition=\"right\"",
    },
    bordered: { control: 'boolean', description: 'If true, adds a border to the badge component.' },
    bottom: { control: 'text', description: 'To be used with the token or dot badges, adds an inline style that sets the bottom CSS property.' },
    classNames: { control: 'text', description: 'Additional custom class names to apply to the badge component.' },
    color: {
      control: 'text',
      description: 'To be used with the token or dot badges, sets or adds an inline style for text color that uses any valid CSS color value (e.g., hex, rgb, color name).',
    },
    devMode: { control: 'boolean', description: 'If true, enables dev mode with extra logging.' },
    dot: { control: 'boolean', description: 'If true, renders the badge as a small dot, often used to indicate notifications or status without text content.' },
    disabled: { control: 'boolean', description: 'If true, sets a disabled state on the badge component.' },
    elevation: { control: 'text', description: 'Applies a shadow elevation to the badge component (0-24).' },
    icon: { control: 'boolean', description: 'If true, when using an icon within a badge, this property will add the some spacing to the left and right of the icon.' },
    inlineStyles: { control: 'text', description: 'Additional inline styles can be added to the dot or token badges. Ex: inline-styles="color: pink; padding: 10px;"' },
    inset: {
      control: 'boolean',
      description:
        "To be used with the token or dot badges, if true, adds the set default style of 'inset: auto auto calc(100% - 12px) calc(100% - 12px);', that positions the badge token to the upper right of the element it is used with.",
    },
    left: { control: 'text', description: 'To be used with the token or dot badges, adds an inline style that sets the left CSS property.' },
    offsetX: {
      control: 'text',
      description:
        "To be used with the token or dot badges, used with the 'inset' property if the user wants to overwrite the default bottom position value of the 'inset'. Ex: offsetX=\"50\"",
    },
    offsetY: {
      control: 'text',
      description:
        "To be used with the token or dot badges, used with the 'inset' property if the user wants to overwrite the default left position value of the 'inset'. Ex: offsetY=\"50\"",
    },
    outlined: { control: 'boolean', description: 'If true, renders the badge with an outlined style.' },
    pulse: { control: 'boolean', description: 'If true, adds a pulsing animation to the dot badge, typically used to draw attention to notification badges.' },
    right: { control: 'text', description: 'To be used with the token or dot badges, adds an inline style that sets the right CSS property.' },
    size: { control: { type: 'select' }, options: ['base', 'xs', 'sm', 'lg'], description: 'Size, base, xs, sm, or lg, of the badge component.' },
    shape: {
      control: { type: 'select' },
      options: ['', 'pill', 'square'],
      description: 'Shape, pill, square, or circle, of the badge component. The default shape is the standard rectangle with rounded corners.',
    },
    styles: { control: 'text', description: 'Additional inline styles can be added to the badge. Ex: styles="color: green; padding: 10px;"' },
    token: { control: 'boolean', description: 'If true, renders the badge as a token, typically used to indicate a status or category associated with the parent element.' },
    top: { control: 'text', description: 'To be used with the token or dot badges, adds an inline style that sets the top CSS property.' },
    variant: {
      control: 'text',
      description: 'Visual variant/color for the badge (e.g., primary, secondary, success, danger, warning, info, light, dark, or any custom variant your app supports).',
    },
    zIndex: { control: 'text', description: 'To be used with the token or dot badges, adds an inline style that sets the z-index CSS property. Ex: zIndex="100"' },

    // Slot/content helpers
    id: { table: { disable: true }, control: 'false', description: 'ID attribute for the badge component.' },
    text: {
      table: { disable: true }, // hides from ArgsTable
      control: false, // hides from Controls
    },

    // hides from Controls// useButtonComponentChild: { control: 'boolean' },
    // buttonText: { control: 'text' },
    // buttonType: { control: 'text' },
    // buttonVariant: { control: 'text' },
    // buttonOutlined: { control: 'boolean' },
    // buttonSize: { control: { type: 'select' }, options: ['sm', 'lg', ''] },

    // iconMode: { control: { type: 'select' }, options: ['icon-component', 'fa', ''] },
    // iconName: { control: 'text', description: 'Used when iconMode = icon-component, e.g. "fas fa-info-circle".' },
    // iconClass: { control: 'text', description: 'Used when iconMode = fa (plain <i> tag class list).' },

    // tokenIconMode: { control: { type: 'select' }, options: ['icon-component', 'fa', ''] },
    // tokenIconName: { control: 'text', description: 'Used when tokenIconMode = icon-component.' },
    // tokenIconClass: { control: 'text', description: 'Used when tokenIconMode = fa.' },
  },

  controls: {
    exclude: ['id', 'text'], // belt & suspenders for Controls panel
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

    // id: 'badge-1',
    // text: 'Badge',
    // iconMode: 'icon-component',
    // iconName: '',
    // iconClass: '',
    // tokenIconMode: 'fa',
    // tokenIconName: '',
    // tokenIconClass: '',
    // useButtonComponentChild: false,
    // buttonText: 'Action',
    // buttonType: 'button',
    // buttonVariant: 'secondary',
    // buttonOutlined: false,
    // buttonSize: 'sm',
  },
};

// ——— Example stories mirroring your HTML ———

// 1) <badge-component id="badge1" elevation="6" shape="square">Badge Base</badge-component>
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
      // optional: make them base; remove if you want default size
      setAttr(badge, 'size', 'base');
      badge.appendChild(document.createTextNode(v.charAt(0).toUpperCase() + v.slice(1)));

      holder.appendChild(badge);
      wrap.appendChild(holder);
    });

    return wrap;
  },
  parameters: {
    docs: {
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

    variants.forEach(v => {
      const badge = document.createElement('badge-component');
      setAttr(badge, 'outlined', true);
      setAttr(badge, 'variant', v);
      setAttr(badge, 'size', 'base'); // keep your default
      badge.appendChild(document.createTextNode(v.charAt(0).toUpperCase() + v.slice(1)));

      // simple spacing for preview
      const holder = document.createElement('span');
      holder.style.display = 'inline-block';
      holder.style.margin = '6px';
      holder.appendChild(badge);

      wrap.appendChild(holder);
    });

    return wrap;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Outlined badges rendered in each core variant: **primary, secondary, success, danger, warning, info, light, dark**.',
      },
    },
  },
};


// 2) With icon slot using <icon-component>
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

// 3) <badge-component id="badge2" variant="success" size="lg">Badge Large</badge-component>
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
    controls: { disable: true }, // this example doesn’t use the shared args/controls
    docs: {
      source: {
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

// 4) <badge-component id="badge3" variant="purple" outlined shape="pill" size="sm">Badge Small</badge-component>
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
      b.setAttribute('badge-id', `badge-${shape}`);
      b.textContent = label;
      return b;
    };

    wrap.appendChild(make('', 'Base'));
    wrap.appendChild(make('pill', 'Pill'));
    wrap.appendChild(make('square', 'Square'));

    return wrap;
  },
  parameters: {
    controls: { disable: true }, // this example doesn’t use the shared args/controls
    docs: {
      source: {
        code: `<badge-component badge-id="badge-base" variant="primary">Base</badge-component>
              <badge-component badge-id="badge-pill" variant="primary" shape="pill">Pill</badge-component>
              <badge-component badge-id="badge-square" variant="primary" shape="square">Square</badge-component>
              `,
      },
      description: {
        story: 'This example shows the different shape options for the badge component: pill, square, and the default rectangular shape.',
      },
    },
  },
};

// 5) Token + left position + inset + button-component child + token icon
// <badge-component id="badge4" bdg-position="left" elevation="3" outlined variant="purple" token bordered shape="circle" inset>
//   <button-component type="button" variant="primary" outlined size="sm">Badge Small</button-component>
//   <span slot="token"><i class="fa-solid fa-house"></i></span>
// </badge-component>
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

// 6) Dot/pulse + button-component child
// <badge-component id="badge5" elevation="1" dot pulse variant="warning">
//   <button-component type="button" variant="secondary" outlined size="sm">Badge Small</button-component>
// </badge-component>
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

// 7) Button with a badge (badge positioned on the right)
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
    controls: { disable: true }, // this example doesn't use the badge story args
    docs: {
      source: {
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
