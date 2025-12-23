// stories/badge-component.stories.js

// small helpers
const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export default {
  title: 'Components/Badge',
  tags: ['autodocs'],

  render: (args) => {
    const el = document.createElement('badge-component');

    // strings
    setAttr(el, 'id', args.id);
    setAttr(el, 'label', args.label);
    setAttr(el, 'variant', args.variant);
    setAttr(el, 'size', args.size);
    setAttr(el, 'shape', args.shape);
    setAttr(el, 'class-names', args.classNames);
    setAttr(el, 'bdg-position', args.bdgPosition); // '', 'left', 'right'
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
    args.absolute ? el.setAttribute('absolute', '') : el.removeAttribute('absolute');
    args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
    args.outlined ? el.setAttribute('outlined', '') : el.removeAttribute('outlined');
    args.bordered ? el.setAttribute('bordered', '') : el.removeAttribute('bordered');
    args.pulse ? el.setAttribute('pulse', '') : el.removeAttribute('pulse');
    args.inset ? el.setAttribute('inset', '') : el.removeAttribute('inset');
    args.icon ? el.setAttribute('icon', '') : el.removeAttribute('icon');
    args.token ? el.setAttribute('token', '') : el.removeAttribute('token');
    args.dot ? el.setAttribute('dot', '') : el.removeAttribute('dot');
    args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');

    // content
    el.textContent = args.slotText;

    // optional icon slot (only rendered by the component when `icon` is true)
    if (args.icon) {
      const iconHost = document.createElement('span');
      iconHost.setAttribute('slot', 'icon');
      iconHost.innerHTML = `<i class="${args.iconClass || 'fa-solid fa-star'}"></i>`;
      el.appendChild(iconHost);
    }

    // demo click
    el.addEventListener('customClick', (e) => {
      console.log('[badge-component] customClick', e?.detail);
    });

    el.style.display = 'inline-block';
    el.style.margin = '12px';

    return el;
  },

  argTypes: {
    // layout/position
    bdgPosition: { control: { type: 'select' }, options: ['', 'left', 'right'] },
    absolute: { control: 'boolean' },
    inset: { control: 'boolean' },
    left: { control: 'text' },
    right: { control: 'text' },
    top: { control: 'text' },
    bottom: { control: 'text' },
    offsetX: { control: 'text' },
    offsetY: { control: 'text' },
    zIndex: { control: 'text' },

    // visuals
    variant: { control: 'text' }, // e.g. primary, secondary, success... (maps to bg-*)
    backgroundColor: { control: 'text' }, // CSS color (overrides variant bg)
    color: { control: 'text' },          // text color
    elevation: { control: 'text' },      // free string if your utils map it
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'] },
    shape: { control: { type: 'select' }, options: ['', 'pill', 'square'] },
    outlined: { control: 'boolean' },
    bordered: { control: 'boolean' },
    pulse: { control: 'boolean' },

    // modes
    token: { control: 'boolean' },
    dot: { control: 'boolean' },
    icon: { control: 'boolean' },
    iconClass: { control: 'text' },

    // a11y / misc
    label: { control: 'text' },
    ariaLabelledby: { control: 'text' },
    ariaDescribedby: { control: 'text' },
    disabled: { control: 'boolean' },
    classNames: { control: 'text' },
    inlineStyles: { control: 'text' },
    styles: { control: 'text' },
    slotText: { control: 'text' },
    devMode: { control: 'boolean' },
  },

  args: {
    id: 'badge-1',
    slotText: 'Badge',
    label: 'Badge',
    variant: 'secondary',
    size: '',
    shape: '',
    outlined: false,
    bordered: false,
    pulse: false,
    elevation: '',
    backgroundColor: '',
    color: '',
    classNames: '',
    inlineStyles: '',
    styles: '',
    bdgPosition: '',
    absolute: false,
    inset: false,
    left: '',
    right: '',
    top: '',
    bottom: '',
    offsetX: '12',
    offsetY: '12',
    zIndex: '',
    icon: false,
    iconClass: 'fa-solid fa-star',
    token: false,
    dot: false,
    disabled: false,
    ariaLabelledby: '',
    ariaDescribedby: '',
    devMode: false,
  },
};

// ——— Variants ———

export const Default = {};

export const PillPrimary = {
  args: {
    variant: 'primary',
    shape: 'pill',
    slotText: 'New',
  },
};

export const Outlined = {
  args: {
    variant: 'warning',
    outlined: true,
    slotText: 'Outlined',
  },
};

export const WithIcon = {
  args: {
    icon: true,
    iconClass: 'fa-solid fa-bell',
    variant: 'info',
    slotText: 'Alerts',
  },
};

export const TokenStyle = {
  name: 'Token',
  args: {
    token: true,
    variant: 'primary',
    slotText: 'Inbox',
  },
};

export const DotPulse = {
  name: 'Dot (Pulse)',
  args: {
    dot: true,
    pulse: true,
    variant: 'danger',
    slotText: 'Dot Pulse',
  },
};

export const PositionedLeft = {
  args: {
    bdgPosition: 'left',
    variant: 'success',
    slotText: 'Left',
  },
};

export const AbsoluteTopRight = {
  args: {
    absolute: true,
    top: '0',
    right: '0',
    variant: 'danger',
    slotText: 'Top Right',
  },
};

export const CustomColors = {
  args: {
    backgroundColor: '#663399',
    color: '#fff',
    slotText: 'Custom',
  },
};
