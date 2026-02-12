// stories/divider-component.stories.js
export default {
  title: 'Components/Divider',
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component: ['Divider component for separating content with optional text or styling.', ''].join('\n'),
      },
      // Ensure Docs shows rendered markup (attributes) in the Code tab
      source: { type: 'dynamic', language: 'html' },
    },
  },

  argTypes: {
    /* -----------------------------
   Appearance
  ------------------------------ */
    dashed: {
      control: 'boolean',
      description: 'Use a dashed line style',
      table: { category: 'Appearance', defaultValue: { summary: false } },
    },
    plain: {
      control: 'boolean',
      description: 'Removes default typography weight from text divider',
      table: { category: 'Appearance', defaultValue: { summary: false } },
    },
    styles: {
      control: 'text',
      description: 'Inline styles for inner text (e.g. "color:#666; font-weight:600")',
      table: { category: 'Appearance' },
    },

    /* -----------------------------
   Layout
  ------------------------------ */
    direction: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Divider direction',
      table: { category: 'Layout' },
    },
    orientation: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Sets the position of the text within the divider',
      table: { category: 'Layout' },
    },
    removeOrientationMargin: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Removes default side margin on the text divider',
      name: 'remove-orientation-margin',
      table: { category: 'Layout' },
    },

    /* -----------------------------
   Storybook Only / Internal
  ------------------------------ */
    slotText: {
      table: { category: 'Storybook Only', disable: true },
      control: 'false',
      description: 'Text content for the slot (used only in this Storybook preview).',
      name: 'slot text',
    },
  },

  controls: {
    exclude: ['slotText'], // keep Controls panel tidy
  },

  args: {
    dashed: false,
    direction: 'horizontal', // default (should not appear in markup)
    orientation: undefined,
    plain: false,
    removeOrientationMargin: undefined,
    styles: '',
    slotText: '',
  },
};

// -------- Helpers --------

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.';

const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const buildDivider = args => {
  const el = document.createElement('divider-component');

  // --- set PROPS (runtime behavior) ---
  // Only set direction prop if vertical; let component default handle horizontal
  if (args.direction === 'vertical') el.direction = 'vertical';
  else delete el.direction;

  el.dashed = !!args.dashed;
  el.plain = !!args.plain;

  if (args.orientation === undefined) delete el.orientation;
  else el.orientation = args.orientation;

  if (args.removeOrientationMargin === undefined) delete el.removeOrientationMargin;
  else el.removeOrientationMargin = args.removeOrientationMargin;

  if (args.styles && String(args.styles).trim().length) {
    el.styles = args.styles;
  } else {
    el.removeAttribute('styles');
  }

  // --- set ATTRIBUTES (so Docs prints them in the code block) ---
  // Only render direction attribute when vertical (horizontal is default)
  if (args.direction === 'vertical') setAttr(el, 'direction', 'vertical');
  else el.removeAttribute('direction');

  setAttr(el, 'dashed', !!args.dashed);
  setAttr(el, 'plain', !!args.plain);
  setAttr(el, 'orientation', args.orientation);
  setAttr(el, 'remove-orientation-margin', args.removeOrientationMargin);
  setAttr(el, 'styles', args.styles);

  // slot content (only appears if orientation is set)
  el.textContent = args.slotText || '';

  return el;
};

const makeParagraph = (text = LOREM) => {
  const p = document.createElement('p');
  p.textContent = text;
  return p;
};

// Template: wraps horizontal (default) dividers with <p> before and after
const Template = args => {
  const wrap = document.createElement('div');
  const divider = buildDivider({ ...args, direction: 'horizontal' }); // ensure we demo horizontal without printing attribute
  wrap.append(makeParagraph(), divider, makeParagraph());
  return wrap;
};

// ===== Stories (non-vertical use Template and therefore get <p> before/after) =====

export const Horizontal = Template.bind({});
Horizontal.parameters = {
  docs: {
    description: {
      story: 'A basic horizontal divider between two paragraphs.',
    },
  },
};

export const HorizontalDashed = Template.bind({});
HorizontalDashed.args = {
  dashed: true,
};
HorizontalDashed.parameters = {
  docs: {
    description: {
      story: 'A dashed horizontal divider between two paragraphs.',
    },
  },
};

export const PlainText = Template.bind({});
PlainText.args = {
  plain: true,
  orientation: 'center',
  slotText: 'Plain Text',
};
PlainText.parameters = {
  docs: {
    description: {
      story: 'If using a text divider, setting `plain` removes default typography weight.',
    },
  },
};

export const TextCentered = Template.bind({});
TextCentered.args = {
  orientation: 'center',
  slotText: 'Center Title',
};
TextCentered.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with centered text.',
    },
  },
};

export const TextLeftStyled = Template.bind({});
TextLeftStyled.args = {
  orientation: 'left',
  slotText: 'Left Aligned Text',
  styles: 'color:#096ac1; font-size:0.875rem; letter-spacing:0.02em;',
};
TextLeftStyled.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with left-aligned text and custom styles.',
    },
  },
};

export const TextRightStyled = Template.bind({});
TextRightStyled.args = {
  orientation: 'right',
  slotText: 'Right Aligned Text',
  styles: 'color:#0d9312; font-size:0.875rem; letter-spacing:0.02em;',
};
TextRightStyled.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with right-aligned text and custom styles.',
    },
  },
};

export const TextLeftWithNoLeftMargin = Template.bind({});
TextLeftWithNoLeftMargin.args = {
  orientation: 'left',
  removeOrientationMargin: 'left',
  slotText: 'Left Aligned Text',
};
TextLeftWithNoLeftMargin.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with left-aligned text and default left margin.',
    },
  },
};

export const TextRightWithNoRightMargin = Template.bind({});
TextRightWithNoRightMargin.args = {
  orientation: 'right',
  removeOrientationMargin: 'right',
  slotText: 'Right Aligned Text',
};
TextRightWithNoRightMargin.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with right-aligned text and default right margin.',
    },
  },
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

  const divider = buildDivider({ ...args, direction: 'vertical', orientation: undefined, slotText: '' });

  wrap.append(left, divider, right);
  return wrap;
};
Vertical.args = {
  dashed: false,
  plain: false,
  styles: '',
};
Vertical.parameters = {
  docs: {
    description: {
      story: 'A vertical divider between two items in a flex row.',
    },
  },
};

// Mixed demo: includes vertical and horizontal examples
export const KitchenSink = args => {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gap = '16px';

  // Standalone horizontal examples (with paragraphs before/after)
  const aWrap = document.createElement('div');
  aWrap.append(makeParagraph(), buildDivider({ ...args, dashed: true, orientation: undefined, direction: 'horizontal' }), makeParagraph());

  const bWrap = document.createElement('div');
  bWrap.append(makeParagraph(), buildDivider({ ...args, orientation: 'center', slotText: 'Overview', direction: 'horizontal' }), makeParagraph());

  const cWrap = document.createElement('div');
  cWrap.append(
    makeParagraph(),
    buildDivider({
      ...args,
      orientation: 'left',
      removeOrientationMargin: 'left',
      plain: true,
      slotText: 'Details',
      styles: 'color:#555; font-weight:600;',
      direction: 'horizontal',
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
    buildDivider({ ...args, direction: 'vertical' }),
    document.createTextNode('Beta'),
    buildDivider({ ...args, direction: 'vertical', dashed: true }),
    document.createTextNode('Gamma'),
  );

  container.append(aWrap, bWrap, cWrap, row);
  return container;
};
KitchenSink.args = {};
KitchenSink.parameters = {
  docs: {
    description: {
      story: 'A collection of various divider examples in one view.',
    },
  },
};
