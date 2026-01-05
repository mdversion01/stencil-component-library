// stories/button-component.stories.js

// tiny helper to set/remove attributes cleanly
const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export default {
  title: 'Components/Button',
  tags: ['autodocs'],

  render: args => {
    const el = document.createElement('button-component');

    // strings
    setAttr(el, 'aria-label', args.ariaLabel);
    setAttr(el, 'btn-text', args.btnText);
    setAttr(el, 'class-names', args.classNames);
    setAttr(el, 'elevation', args.elevation);
    setAttr(el, 'left', args.left);
    setAttr(el, 'right', args.right);
    setAttr(el, 'top', args.top);
    setAttr(el, 'bottom', args.bottom);
    setAttr(el, 'size', args.size);
    setAttr(el, 'shape', args.shape);
    setAttr(el, 'styles', args.styles);
    setAttr(el, 'title-attr', args.titleAttr);
    setAttr(el, 'url', args.url);
    setAttr(el, 'variant', args.variant);
    setAttr(el, 'z-index', args.zIndex);
    setAttr(el, 'slot-side', args.slotSide);
    // setAttr(el, 'target-id', args.targetId);

    // booleans
    args.absolute ? el.setAttribute('absolute', '') : el.removeAttribute('absolute');
    args.active ? el.setAttribute('active', '') : el.removeAttribute('active');
    args.block ? el.setAttribute('block', '') : el.removeAttribute('block');
    args.btnIcon ? el.setAttribute('btn-icon', '') : el.removeAttribute('btn-icon');
    args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
    args.end ? el.setAttribute('end', '') : el.removeAttribute('end');
    args.fixed ? el.setAttribute('fixed', '') : el.removeAttribute('fixed');
    args.groupBtn ? el.setAttribute('group-btn', '') : el.removeAttribute('group-btn');
    args.iconBtn ? el.setAttribute('icon-btn', '') : el.removeAttribute('icon-btn');
    args.link ? el.setAttribute('link', '') : el.removeAttribute('link');
    args.outlined ? el.setAttribute('outlined', '') : el.removeAttribute('outlined');
    args.ripple ? el.setAttribute('ripple', '') : el.removeAttribute('ripple');
    args.start ? el.setAttribute('start', '') : el.removeAttribute('start');
    args.stripped ? el.setAttribute('stripped', '') : el.removeAttribute('stripped');
    args.text ? el.setAttribute('text', '') : el.removeAttribute('text');
    args.textBtn ? el.setAttribute('text-btn', '') : el.removeAttribute('text-btn');
    args.vertical ? el.setAttribute('vertical', '') : el.removeAttribute('vertical');
    args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');

    // toggle + pressed: only set `pressed` when toggle is true
    args.toggle ? el.setAttribute('toggle', '') : el.removeAttribute('toggle');
    if (args.toggle) {
      if (args.pressed === true) setAttr(el, 'pressed', 'true');
      else if (args.pressed === false) setAttr(el, 'pressed', 'false');
      else setAttr(el, 'pressed', args.pressed || 'false');
    } else {
      el.removeAttribute('pressed');
    }

    // default slot content:
    // - If you use icon-only or iconBtn, provide an icon in the default slot.
    // - If you want leading/trailing slot, honor slotSide = 'left' | 'right'.
    if (args.iconHtml && (args.btnIcon || args.iconBtn)) {
      const icon = document.createElement('span');
      icon.innerHTML = args.iconHtml;
      el.appendChild(icon);
    }

    if (args.slotSide !== 'none' && args.sideIconHtml) {
      const side = document.createElement('span');
      // side.setAttribute('slot', args.slotSide);
      side.innerHTML = args.sideIconHtml;
      el.appendChild(side);
    }

    // event demo
    el.addEventListener('customClick', () => {
      // eslint-disable-next-line no-console
      console.log('[button-component] customClick');
    });

    // el.style.margin = '12px';
    return el;
  },

  parameters: {
    docs: {
      description: {
        component: ['Button component allows for various styles and behaviors.', 'Content is provided via the \'btnText\' prop (text only) or the **default slot** (text or markup).'].join('\n'),
      },
    },
  },

  argTypes: {
    absolute: { control: 'boolean', description: 'If true, adds an inline style with position: absolute.' },
    active: { control: 'boolean', description: 'If true, adds active styles to the button.' },
    ariaLabel: { control: 'text', description: 'Adds an aria-label attribute for accessibility.' },
    block: { control: 'boolean', description: 'If true, makes the button a block-level element (full width).' },
    bottom: { control: 'text', description: 'CSS bottom value (e.g., "10px", "1rem") added to the inline style. Requires `absolute` prop to be true.' },
    btnIcon: { control: 'boolean', description: 'If true, styles the button as an icon-only button.' },
    btnText: { control: 'text', description: 'Text content of the button.' },
    classNames: { control: 'text', description: 'Additional custom class names to add to the button component.' },
    devMode: { control: 'boolean', description: 'If true, enables dev mode with additional logging.' },
    disabled: { control: 'boolean', description: 'If true, disables the button.' },
    elevation: { control: 'text', description: 'Elevation level 0-24, for shadow effects.' },
    end: { control: 'boolean', description: 'If true, aligns content to the end.' },
    fixed: { control: 'boolean', description: 'If true, adds an inline style with position: fixed.' },
    groupBtn: { control: 'boolean', description: 'If true, styles the button as part of a group.' },
    iconBtn: { control: 'boolean', description: 'If true, styles the button as an icon button (similar to btnIcon).' },
    // iconHtml: { control: 'text' },
    left: { control: 'text', description: 'CSS left value (e.g., "10px", "1rem") added to the inline style. Requires `absolute` prop to be true.' },
    link: { control: 'boolean', description: 'If true, styles the button to look like a link.' },
    outlined: { control: 'boolean', description: 'If true, styles the button with an outline.' },
    pressed: {
      control: 'boolean',
      description: 'Only applies when `toggle` is true. Controls the on/off state (aria-pressed).',
    },
    right: { control: 'text', description: 'CSS right value (e.g., "10px", "1rem") added to the inline style. Requires `absolute` prop to be true.' },
    ripple: { control: 'boolean', description: 'If true, enables ripple effect on click.' },
    shape: {
      control: { type: 'select' },
      options: ['', 'circle', 'pill', 'square'],
      description: 'Sets the shape of the button: circle, pill, and square. If not set, default shape is used.',
    },
    // sideIconHtml: { control: 'text' },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], description: 'Sets the size of the button, e.g., small (sm) or large (lg). If not set, default size is used.' },
    slotSide: {
      control: 'text',
      description:
        "If using a side icon, entering 'left' or 'right' specifies whether it appears on the left or right side of the button text. Cannot use both left and right simultaneously.",
    },
    start: {
      control: 'boolean',
      description:
        "Used with the button-group component. If true, this property will add the 'btn-group-start' or 'btn-group-vertical-start' (when the property 'vertical' is used) class to the button.",
    },
    stripped: { control: 'boolean', description: 'If true, removes background and border styles for a stripped-down appearance.' },
    styles: { control: 'text', description: 'Additional inline styles to apply to the button component.' },
    text: { control: 'boolean', description: 'If true, styles the button as a text button (no background or border).' },
    textBtn: { control: 'boolean', description: 'If true, styles the button as text but with the same hover effects as a button.' },
    titleAttr: { control: 'text', description: 'Adds a title attribute to the button for tooltip text on hover.' },
    toggle: {
      control: 'boolean',
      description: 'If true, renders as a toggle button (adds aria-pressed and lets `pressed` control its state).',
    },
    top: { control: 'text', description: 'CSS top value (e.g., "10px", "1rem") added to the inline style. Requires `absolute` prop to be true.' },
    url: { control: 'text', description: 'If provided, renders the button as an anchor element and a url or path can be applied to the href that is rendered.' },
    variant: {
      control: 'text',
      description: 'Visual variant/color for the badge (e.g., primary, secondary, success, danger, warning, info, light, dark, or any custom variant your app supports).',
    },
    vertical: { control: 'boolean', description: 'If true, and used within a button-group, stacks the buttons vertically instead of horizontally.' },
    zIndex: { control: 'text', description: 'CSS z-index value added to the inline style. Requires `absolute` or `fixed` prop to be true.' },

    // Accordion helpers
    // accordion: { control: 'boolean' },
    // isOpen: { control: 'boolean' },
    // targetId: { control: 'text' },
  },

  controls: {
    exclude: ['iconHtml', 'sideIconHtml'], // belt & suspenders for Controls panel
  },

  args: {
    absolute: false,
    active: false,
    ariaLabel: '',
    block: false,
    bottom: '',
    btnIcon: false,
    btnText: 'Click me',
    classNames: '',
    devMode: false,
    disabled: false,
    elevation: '',
    end: false,
    fixed: false,
    groupBtn: false,
    iconBtn: false,
    // iconHtml: '<i class="fa-solid fa-star"></i>',
    left: '',
    link: false,
    outlined: false,
    pressed: false, // only relevant when toggle=true
    right: '',
    ripple: false,
    shape: '',
    // sideIconHtml: '<i class="fa-solid fa-circle-info"></i>',
    size: '',
    slotSide: '',
    start: false,
    stripped: false,
    styles: '',
    text: false,
    textBtn: false,
    titleAttr: '',
    toggle: false,
    top: '',
    url: '',
    variant: '',
    vertical: false,
    zIndex: '',

    // accordion: false,
    // isOpen: false,
    // targetId: '',
  },
};

// ——— Stories ———

export const Basic = {
  args: {
    variant: 'primary',
    btnText: 'Basic Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic button shown below.',
      },
    },
  },
};

export const DisabledButton = {
  args: {
    variant: 'primary',
    btnText: 'Disabled Button',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled button shown below.',
      },
    },
  },
};

export const BackgroundColors = {
  name: 'Background Colors (all core variant colors)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexWrap = 'wrap';
    wrap.style.gap = '12px';

    const title = v => v.charAt(0).toUpperCase() + v.slice(1);
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    variants.forEach(v => {
      const btn = document.createElement('button-component');
      // filled style (no `outlined`)
      setAttr(btn, 'variant', v);
      setAttr(btn, 'btn-text', title(v));
      wrap.appendChild(btn);
    });

    return wrap;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Filled buttons for all core variants. Each button sets `variant` to one of: ' +
          '`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`.',
      },
    },
  },
};


export const OutlineColors = {
  name: 'Outlined Colors (all core variant colors)',
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexWrap = 'wrap';
    wrap.style.gap = '12px';

    const title = v => v.charAt(0).toUpperCase() + v.slice(1);
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    variants.forEach(v => {
      const btn = document.createElement('button-component');
      setAttr(btn, 'outlined', true);
      setAttr(btn, 'variant', v);
      setAttr(btn, 'btn-text', `Outlined ${title(v)}`);
      wrap.appendChild(btn);
    });

    return wrap;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Outlined buttons for all core variants. Each button uses `outlined` with `variant` set to one of: ' +
          '`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`.',
      },
    },
  },
};


export const Sizes = {
  name: 'Sizes (sm, default, lg)',
  args: {
    variant: 'primary',
  },
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';

    const mk = (size, text) => {
      const btn = document.createElement('button-component');
      // reuse your setAttr helper from the file
      setAttr(btn, 'variant', args.variant || 'primary');
      setAttr(btn, 'btn-text', text);
      if (size) setAttr(btn, 'size', size); // omit for default size
      return btn;
    };

    const small = mk('sm', 'Small');
    const deflt = mk('', 'Default'); // no size attribute => default
    const large = mk('lg', 'Large');

    wrap.append(small, deflt, large);
    return wrap;
  },
  parameters: {
    docs: {
      description: {
        story: 'Buttons in small, default, and large sizes.',
      },
    },
  },
};

export const Shapes = {
  name: 'Shapes (default, pill, square, circle w/ icon)',
  args: {
    variant: 'primary',
  },
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';

    // helper using the file's setAttr
    const mk = (opts = {}) => {
      const btn = document.createElement('button-component');
      setAttr(btn, 'variant', opts.variant ?? args.variant ?? 'primary');
      setAttr(btn, 'shape', opts.shape || '');
      setAttr(btn, 'btn-text', opts.btnText ?? '');
      if (opts.btnIcon) setAttr(btn, 'btn-icon', '');
      if (opts.ariaLabel) setAttr(btn, 'aria-label', opts.ariaLabel);
      return btn;
    };

    // 1) Default (no shape)
    const def = mk({ btnText: 'Default' });

    // 2) Pill
    const pill = mk({ shape: 'pill', btnText: 'Pill' });

    // 3) Square
    const square = mk({ shape: 'square', btnText: 'Square' });

    // 4) Circle (icon-only)
    const circle = mk({ shape: 'circle', btnIcon: true, ariaLabel: 'Home' });
    const icon = document.createElement('span');
    icon.innerHTML = '<i class="fa-solid fa-house"></i>';
    circle.appendChild(icon);

    wrap.append(def, pill, square, circle);
    return wrap;
  },
  parameters: {
    docs: {
      description: {
        story: 'Buttons in various shapes: default, pill, square, and circle with icon.',
      },
    },
  },
};

export const RippleEffect = {
  args: {
    variant: 'primary',
    ripple: true,
    btnText: 'Ripple Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with ripple effect enabled on click.',
      },
    },
  },
};

export const ActiveState = {
  args: {
    variant: 'active-blue',
    classNames: 'active',
    btnText: 'Active Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with active state styling.',
      },
    },
  },
};

export const Block = {
  args: { block: true, btnText: 'Block Button', variant: 'primary', },
  parameters: {
    docs: {
      description: {
        story: 'Block-level button that spans the full width of its container.',
      },
    },
  },
};

export const IconsLeftAndRightExamples = {
  name: 'Icons: Left & Right (two buttons)',
  args: {
    variant: 'primary',
    btnText: 'Home',
  },
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';

    // Left icon
    const leftBtn = document.createElement('button-component');
    leftBtn.setAttribute('variant', args.variant || 'primary');
    leftBtn.setAttribute('btn-text', args.btnText || 'Home');
    leftBtn.setAttribute('slot-side', 'left');
    const leftIcon = document.createElement('span');
    leftIcon.innerHTML = '<i class="fa-solid fa-house"></i>';
    leftBtn.appendChild(leftIcon);

    // Right icon
    const rightBtn = document.createElement('button-component');
    rightBtn.setAttribute('variant', args.variant || 'primary');
    rightBtn.setAttribute('btn-text', args.btnText || 'Home');
    rightBtn.setAttribute('slot-side', 'right');
    const rightIcon = document.createElement('span');
    rightIcon.innerHTML = '<i class="fa-solid fa-house"></i>';
    rightBtn.appendChild(rightIcon);

    wrap.append(leftBtn, rightBtn);
    return wrap;
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing two buttons: one with a left icon and one with a right icon.',
      },
    },
  },
};

export const IconOnly = {
  args: {
    btnIcon: true,
    btnText: '',
    ariaLabel: 'Star',
    iconHtml: '<i class="fa-solid fa-star"></i>',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only button example with a star icon.',
      },
    },
  },
};

export const StrippedButton = {
  args: {
    stripped: true,
    btnText: 'Stripped Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button styled as a link that navigates to a URL when clicked.',
      },
    },
  },
};

export const LinkButton = {
  args: {
    link: true,
    url: '#',
    variant: 'link',
    btnText: 'Anchor-like Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button styled as a link that navigates to a URL when clicked.',
      },
    },
  },
};

export const ToggleButton = {
  name: 'Toggle (aria-pressed)',
  args: {
    toggle: true,
    pressed: false,
    btnText: 'Toggle Me',
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle button that can be pressed or unpressed, indicated by aria-pressed attribute.',
      },
    },
  },
};

export const AccordionToggleExample = {
  name: 'Accordion toggle (aria)',
  args: {
    accordion: true,
    isOpen: false,
    targetId: 'accordion-section-1',
    variant: 'primary',
    btnText: 'Toggle Section',
  },
  parameters: {
    docs: {
      description: {
        story: 'Accordion toggle button that controls the visibility of a section, indicated by aria attributes. (See accordion component for full implementation.)',
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
    controls: { disable: true }, // this example doesn't use the badge story args
    docs: {
      source: {
        code: `<button-component title-attr="Button with Badge" btn-text="With a badge" variant="primary">
                  <badge-component id="badge12" variant="light" bdg-position="right" size="sm">1</badge-component>
              </button-component>`,
      },
      description: {
        story: 'Button that includes a badge component positioned to the right.',
      },
    },
  },
};
