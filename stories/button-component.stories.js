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

  render: (args) => {
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
    // args.accordion ? el.setAttribute('accordion', '') : el.removeAttribute('accordion');
    args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');

    // pressed can be boolean or "true"/"false"
    if (args.pressed === true) setAttr(el, 'pressed', 'true');
    else if (args.pressed === false) setAttr(el, 'pressed', 'false');
    else setAttr(el, 'pressed', args.pressed || '');

    // default slot content:
    // - If you use icon-only or iconBtn, provide an icon in the default slot.
    // - If you want leading/trailing slot, honor slotSide = 'left' | 'right'.
    if (args.iconHtml && (args.btnIcon || args.iconBtn)) {
      const icon = document.createElement('span');
      icon.innerHTML = args.iconHtml; // trusted in story; your component does not innerHTML user content
      el.appendChild(icon);
    }

    if (args.slotSide !== 'none' && args.sideIconHtml) {
      const side = document.createElement('span');
      side.setAttribute('slot', args.slotSide);
      side.innerHTML = args.sideIconHtml;
      el.appendChild(side);
    }

    // event demo
    el.addEventListener('customClick', () => {
      console.log('[button-component] customClick');
    });

    el.style.margin = '12px';
    return el;
  },

  argTypes: {
    // Visuals
    variant: { control: 'text', description: 'e.g. primary | secondary | success ... (maps to btn-*, or btn-outline-*)' },
    outlined: { control: 'boolean' },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'] },
    shape: { control: { type: 'select' }, options: ['', 'rounded', 'pill', 'square'] },
    classNames: { control: 'text' },
    elevation: { control: 'text' },
    ripple: { control: 'boolean' },
    text: { control: 'boolean' },
    textBtn: { control: 'boolean' },
    stripped: { control: 'boolean' },

    // Layout / grouping
    block: { control: 'boolean' },
    groupBtn: { control: 'boolean' },
    vertical: { control: 'boolean' },
    start: { control: 'boolean' },
    end: { control: 'boolean' },

    // Positioning
    absolute: { control: 'boolean' },
    fixed: { control: 'boolean' },
    left: { control: 'text' },
    right: { control: 'text' },
    top: { control: 'text' },
    bottom: { control: 'text' },
    zIndex: { control: 'text' },

    // Content modes
    btnText: { control: 'text' },
    btnIcon: { control: 'boolean' },
    iconBtn: { control: 'boolean' },
    iconHtml: { control: 'text' },
    slotSide: { control: { type: 'inline-radio' }, options: ['none', 'left', 'right'] },
    sideIconHtml: { control: 'text' },

    // Link mode
    link: { control: 'boolean' },
    url: { control: 'text' },

    // States / a11y
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    pressed: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    titleAttr: { control: 'text' },

    // Accordion helpers
    // accordion: { control: 'boolean' },
    // isOpen: { control: 'boolean' },
    // targetId: { control: 'text' },

    // Misc
    styles: { control: 'text' },
    devMode: { control: 'boolean' },
  },

  args: {
    variant: 'primary',
    outlined: false,
    size: '',
    shape: '',
    classNames: '',
    elevation: '',
    ripple: false,
    text: false,
    textBtn: false,
    stripped: false,

    block: false,
    groupBtn: false,
    vertical: false,
    start: false,
    end: false,

    absolute: false,
    fixed: false,
    left: '',
    right: '',
    top: '',
    bottom: '',
    zIndex: '',

    btnText: 'Click me',
    btnIcon: false,
    iconBtn: false,
    iconHtml: '<i class="fa-solid fa-star"></i>',
    slotSide: 'none',
    sideIconHtml: '<i class="fa-solid fa-circle-info"></i>',

    link: false,
    url: '',

    active: false,
    disabled: false,
    pressed: false,
    ariaLabel: '',
    titleAttr: '',

    // accordion: false,
    // isOpen: false,
    // targetId: '',

    styles: '',
    devMode: false,
  },
};

// ——— Stories ———

export const Primary = {};

export const Outline = {
  args: {
    variant: 'secondary',
    outlined: true,
    btnText: 'Outlined',
  },
};

export const Sizes = {
  args: { size: 'lg', btnText: 'Large Button' },
};

export const Block = {
  args: { block: true, btnText: 'Block Button' },
};

export const WithLeadingIcon = {
  args: {
    slotSide: 'left',
    sideIconHtml: '<i class="fa-solid fa-arrow-right"></i>',
    btnText: 'Next',
  },
};

export const IconOnly = {
  args: {
    btnIcon: true,
    btnText: '',
    ariaLabel: 'Star',
    iconHtml: '<i class="fa-solid fa-star"></i>',
  },
};

export const LinkButton = {
  args: {
    link: true,
    url: '#',
    variant: 'link',
    btnText: 'Anchor-like Button',
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
};
