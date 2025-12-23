// stories/divider-component.stories.js
export default {
  title: 'Components/Divider',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
      description: 'Divider direction',
    },
    dashed: { control: 'boolean' },
    plain: { control: 'boolean', description: 'Removes default typography weight from text divider' },
    orientation: {
      control: { type: 'inline-radio' },
      options: [undefined, 'left', 'center', 'right'],
      description: 'When set, renders a text divider (uses slot content)',
    },
    orientationMargin: {
      control: { type: 'inline-radio' },
      options: [undefined, 'left', 'right'],
      description: 'Removes default side margin on the text divider',
    },
    styles: {
      control: 'text',
      description: 'Inline styles for inner text (e.g. "color:#666; font-weight:600")',
    },
    slotText: {
      control: 'text',
      description: 'Content placed inside the divider (used when `orientation` is set)',
    },
  },
  args: {
    type: 'horizontal',
    dashed: false,
    plain: false,
    orientation: undefined,
    orientationMargin: undefined,
    styles: '',
    slotText: 'Section',
  },
};

const buildDivider = (args) => {
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
    // remove to let component ignore
    el.removeAttribute('styles');
  }

  // slot content (only appears if orientation is set)
  el.textContent = args.slotText || '';

  return el;
};

const Template = (args) => buildDivider(args);

// ===== Stories =====

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

export const Vertical = (args) => {
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

export const KitchenSink = (args) => {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gap = '16px';

  const a = buildDivider({ ...args, type: 'horizontal', dashed: true, orientation: undefined });
  const b = buildDivider({ ...args, orientation: 'center', slotText: 'Overview' });
  const c = buildDivider({
    ...args,
    orientation: 'left',
    orientationMargin: 'left',
    plain: true,
    slotText: 'Details',
    styles: 'color:#555; font-weight:600;',
  });

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
    document.createTextNode('Gamma')
  );

  container.append(a, b, c, row);
  return container;
};
KitchenSink.args = {};
