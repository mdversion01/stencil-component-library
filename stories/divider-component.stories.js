// stories/divider-component.stories.js
export default {
  title: 'Components/Divider',
  tags: ['autodocs'],
  argTypes: {
    dashed: { control: 'boolean' },
    orientation: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Sets the position of the text within the divider',
    },
    orientationMargin: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Removes default side margin on the text divider',
    },
    plain: { control: 'boolean', description: 'Removes default typography weight from text divider' },
    styles: {
      control: 'text',
      description: 'Inline styles for inner text (e.g. "color:#666; font-weight:600")',
    },
    type: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Divider direction',
    },

    slotText: {
      table: { disable: true },
      control: 'false',
      description: 'Text content for the slot (used only in this Storybook preview).',
    },
  },

  controls: {
    exclude: ['slotText',], // belt & suspenders for Controls panel
  },

  args: {
    dashed: false,
    orientation: undefined,
    orientationMargin: undefined,
    plain: false,
    styles: '',
    type: 'horizontal',

    slotText: '',
  },
};

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.';

const buildDivider = args => {
  const el = document.createElement('divider-component');

  // core props
  el.type = args.type;
  el.dashed = !!args.dashed;
  el.plain = !!args.plain;

  // optional props
  if (args.orientation === undefined) delete el.orientation;
  else el.orientation = args.orientation;

  if (args.orientationMargin === undefined) delete el.orientationMargin;
  else el.orientationMargin = args.orientationMargin;

  if (args.styles && String(args.styles).trim().length) {
    el.styles = args.styles;
  } else {
    el.removeAttribute('styles');
  }

  // slot content (only appears if orientation is set)
  el.textContent = args.slotText || '';

  return el;
};

const makeParagraph = (text = LOREM) => {
  const p = document.createElement('p');
  p.textContent = text;
  return p;
};

// Template: wraps every non-vertical divider with <p> before and after
const Template = args => {
  const wrap = document.createElement('div');

  // force horizontal for template-based stories (these are the ones that need <p> wrappers)
  const divider = buildDivider({ ...args, type: 'horizontal' });

  wrap.append(makeParagraph(), divider, makeParagraph());
  return wrap;
};

// ===== Stories (non-vertical use Template and therefore get <p> before/after) =====

export const Horizontal = Template.bind({});

export const HorizontalDashed = Template.bind({});
HorizontalDashed.args = {
  dashed: true,
};

export const HorizontalPlain = Template.bind({});
HorizontalPlain.args = {
  plain: true,
};

export const TextCenter = Template.bind({});
TextCenter.args = {
  orientation: 'center',
  slotText: 'Center Title',
};

export const TextLeftWithMargin = Template.bind({});
TextLeftWithMargin.args = {
  orientation: 'left',
  orientationMargin: 'left',
  slotText: 'Left Title',
};

export const TextRightStyled = Template.bind({});
TextRightStyled.args = {
  orientation: 'right',
  slotText: 'More',
  styles: 'color:#6c757d; font-size:0.875rem; letter-spacing:0.02em;',
};

// Vertical example: no paragraphs; custom layout
export const Vertical = args => {
  // Showcase vertical divider inside a flex row
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '12px';
  wrap.style.height = '48px';

  const left = document.createElement('div');
  left.textContent = 'Left';
  const right = document.createElement('div');
  right.textContent = 'Right';

  const divider = buildDivider({ ...args, type: 'vertical', orientation: undefined, slotText: '' });

  wrap.append(left, divider, right);
  return wrap;
};
Vertical.args = {
  dashed: false,
  plain: false,
  styles: '',
};

// Mixed demo: keep as-is (includes vertical and horizontal examples)
export const KitchenSink = args => {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gap = '16px';

  // Add paragraphs around the standalone horizontal examples inside KitchenSink
  const aWrap = document.createElement('div');
  aWrap.append(makeParagraph(), buildDivider({ ...args, type: 'horizontal', dashed: true, orientation: undefined }), makeParagraph());

  const bWrap = document.createElement('div');
  bWrap.append(makeParagraph(), buildDivider({ ...args, orientation: 'center', slotText: 'Overview' }), makeParagraph());

  const cWrap = document.createElement('div');
  cWrap.append(
    makeParagraph(),
    buildDivider({
      ...args,
      orientation: 'left',
      orientationMargin: 'left',
      plain: true,
      slotText: 'Details',
      styles: 'color:#555; font-weight:600;',
    }),
    makeParagraph(),
  );

  // Row with vertical dividers (no paragraphs)
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '8px';
  row.style.height = '40px';
  row.append(
    document.createTextNode('Alpha'),
    buildDivider({ ...args, type: 'vertical' }),
    document.createTextNode('Beta'),
    buildDivider({ ...args, type: 'vertical', dashed: true }),
    document.createTextNode('Gamma'),
  );

  container.append(aWrap, bWrap, cWrap, row);
  return container;
};
KitchenSink.args = {};
