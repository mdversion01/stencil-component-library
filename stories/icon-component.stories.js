// stories/icon-component.stories.js

export default {
  title: 'Components/Icon',
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text', description: 'Icon class string (e.g., "fa-solid fa-user")' },
    iconMargin: {
      control: { type: 'inline-radio' },
      options: ['', 'left', 'right'],
      description: 'Applies spacing utility (ms-1 or me-1)',
    },
    size: {
      control: 'text',
      description: 'Extra size class (e.g., "fa-lg", "fa-2x", or a custom utility)',
    },
    tokenIcon: { control: 'boolean', description: 'Adds "token-icon" class' },
    iconSize: { control: 'number', description: 'Inline font-size in px' },
    svg: { control: 'boolean', description: 'Prop is available, but this component renders <i> classes' },
    color: { control: 'color', description: 'Inline color style' },
    iconAriaLabel: { control: 'text', description: 'Accessible label (sets aria-label)' },
    iconAriaHidden: {
      control: 'boolean',
      description: 'Whether the icon is hidden from assistive tech (aria-hidden)',
    },
  },
  args: {
    icon: 'fa-solid fa-star',
    iconMargin: '',
    size: '',
    tokenIcon: false,
    iconSize: undefined,
    svg: false,
    color: '',
    iconAriaLabel: '',
    iconAriaHidden: true,
  },
};

/** ------------ Helpers ------------ */

const makeIcon = (args = {}) => {
  const el = document.createElement('icon-component');

  // Assign props (Stencil props work as properties)
  el.icon = args.icon ?? 'fa-solid fa-star';
  el.iconMargin = args.iconMargin ?? '';
  el.size = args.size ?? '';
  el.tokenIcon = !!args.tokenIcon;
  el.iconSize = typeof args.iconSize === 'number' ? args.iconSize : undefined;
  el.svg = !!args.svg;
  el.color = args.color || undefined;
  el.iconAriaLabel = args.iconAriaLabel || undefined;
  el.iconAriaHidden = args.iconAriaHidden !== false;

  return el;
};

const Template = (args) => makeIcon(args);

/** ------------ Stories ------------ */

export const Basic = Template.bind({});
Basic.args = {
  icon: 'fa-solid fa-star',
};

export const Sizes = () => {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.gap = '16px';
  [
    { label: 'Default', props: { icon: 'fa-solid fa-user' } },
    { label: 'fa-lg', props: { icon: 'fa-solid fa-user', size: 'fa-lg' } },
    { label: 'fa-2x', props: { icon: 'fa-solid fa-user', size: 'fa-2x' } },
    { label: 'inline 28px', props: { icon: 'fa-solid fa-user', iconSize: 28 } },
    { label: 'inline 40px', props: { icon: 'fa-solid fa-user', iconSize: 40 } },
  ].forEach(({ label, props }) => {
    const col = document.createElement('div');
    col.style.display = 'flex';
    col.style.flexDirection = 'column';
    col.style.alignItems = 'center';
    col.style.gap = '8px';
    col.appendChild(makeIcon(props));
    const cap = document.createElement('small');
    cap.textContent = label;
    col.appendChild(cap);
    wrapper.appendChild(col);
  });
  return wrapper;
};

export const WithColor = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '16px';
  container.append(
    makeIcon({ icon: 'fa-solid fa-heart', color: '#ef4444', iconSize: 28 }),
    makeIcon({ icon: 'fa-solid fa-bolt', color: '#f59e0b', iconSize: 28 }),
    makeIcon({ icon: 'fa-solid fa-leaf', color: '#10b981', iconSize: 28 }),
    makeIcon({ icon: 'fa-solid fa-water', color: '#3b82f6', iconSize: 28 }),
  );
  return container;
};

export const TokenIcon = Template.bind({});
TokenIcon.args = {
  icon: 'fa-solid fa-shield',
  tokenIcon: true,
  iconSize: 28,
  color: '#0ea5e9',
};

export const Margins = () => {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '12px';

  const left = document.createElement('span');
  left.textContent = 'Left margin';
  left.appendChild(makeIcon({ icon: 'fa-solid fa-circle-info', iconMargin: 'left' }));

  const right = document.createElement('span');
  right.appendChild(makeIcon({ icon: 'fa-solid fa-circle-info', iconMargin: 'right' }));
  right.appendChild(document.createTextNode('Right margin'));

  row.append(left, right);
  return row;
};

export const AccessibleLabel = Template.bind({});
AccessibleLabel.args = {
  icon: 'fa-solid fa-bell',
  iconAriaHidden: false,
  iconAriaLabel: 'Notifications',
  iconSize: 24,
};

export const Playground = Template.bind({});
Playground.args = {
  icon: 'fa-solid fa-gear',
  size: 'fa-lg',
  color: '#111827',
  iconSize: undefined,
  tokenIcon: false,
  iconMargin: '',
  iconAriaHidden: true,
  iconAriaLabel: '',
};

/**
 * Optional: a small grid to preview multiple FA icons at once.
 * Adjust icon class names to match whatever icon set you load in Storybook.
 */
export const IconGallery = () => {
  const icons = [
    'fa-solid fa-star',
    'fa-solid fa-user',
    'fa-solid fa-bell',
    'fa-solid fa-gear',
    'fa-solid fa-house',
    'fa-solid fa-heart',
    'fa-solid fa-arrow-right',
    'fa-solid fa-check',
    'fa-solid fa-xmark',
  ];

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
  grid.style.gap = '12px';

  icons.forEach((ic) => {
    const cell = document.createElement('div');
    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.alignItems = 'center';
    cell.style.gap = '8px';
    cell.appendChild(makeIcon({ icon: ic, iconSize: 24 }));
    const cap = document.createElement('small');
    cap.style.textAlign = 'center';
    cap.textContent = ic.replace('fa-solid ', '');
    cell.appendChild(cap);
    grid.appendChild(cell);
  });

  return grid;
};
