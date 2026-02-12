export default {
  title: 'Components/Slider/Basic Slider',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A basic slider component allowing selection of a single value within a range.' } } },
  argTypes: {
    // -------- Behavior / State --------
    disabled: {
      control: 'boolean',
      description: 'Disables the slider when true.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },
    plumage: {
      control: 'boolean',
      description: 'Enables plumage style when true.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },

    // -------- Content --------
    label: {
      control: 'text',
      description: 'Label for the slider.',
      table: { category: 'Content' },
    },
    unit: {
      control: 'text',
      description: 'Unit to display with values.',
      table: { category: 'Content' },
    },

    // -------- Value & Range --------
    value: {
      control: { type: 'number', step: 1 },
      description: 'Current value of the slider.',
      table: { category: 'Value & Range' },
    },
    min: {
      control: { type: 'number', step: 1 },
      description: 'The minimum value of the slider.',
      table: { category: 'Value & Range' },
    },
    max: {
      control: { type: 'number', step: 1 },
      description: 'The maximum value of the slider.',
      table: { category: 'Value & Range' },
    },

    // -------- Tick Marks --------
    snapToTicks: {
      control: 'boolean',
      name: 'snap-to-ticks',
      description: 'Snaps the slider to tick marks when true.',
      table: { category: 'Ticks', defaultValue: { summary: false } },
    },
    tickLabels: {
      control: 'boolean',
      name: 'tick-labels',
      description: 'Shows labels for tick marks when true.',
      table: { category: 'Ticks', defaultValue: { summary: false } },
    },
    tickValues: {
      control: 'object',
      name: 'tick-values',
      description: 'Array of numeric values for tick marks.',
      table: { category: 'Ticks' },
    },
    sliderThumbLabel: {
      control: 'boolean',
      name: 'slider-thumb-label',
      description: 'Shows the slider thumb label when true.',
      table: { category: 'Ticks', defaultValue: { summary: false } },
    },

    // -------- Layout / Text Boxes --------
    hideLeftTextBox: {
      control: 'boolean',
      name: 'hide-left-text-box',
      description: 'Hides the left text box when true.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },
    hideRightTextBox: {
      control: 'boolean',
      name: 'hide-right-text-box',
      description: 'Hides the right text box when true.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },
    hideTextBoxes: {
      control: 'boolean',
      name: 'hide-text-boxes',
      description: 'Hides both text boxes when true.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },

    // -------- Appearance --------
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      description: 'Visual variant of the slider.',
      table: { category: 'Appearance' },
    },
  },
};

/* helpers */
const boolLine = (name, on) => (on ? ` ${name}` : '');
const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const serializeArray = val => {
  if (!val) return '';
  try {
    return JSON.stringify(val);
  } catch {
    return '';
  }
};

const normalizeHtml = html => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      out.push('');
      prevBlank = true;
      continue;
    }
    out.push(line);
    prevBlank = false;
  }

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

/* base template */
const Template = args => {
  const attrs = [
    boolLine('disabled', args.disabled),
    boolLine('hide-left-text-box', args.hideLeftTextBox),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    boolLine('hide-text-boxes', args.hideTextBoxes),
    attrLine('label', args.label),
    attrLine('max', args.max),
    attrLine('min', args.min),
    boolLine('plumage', args.plumage),
    boolLine('slider-thumb-label', args.sliderThumbLabel),
    boolLine('snap-to-ticks', args.snapToTicks),
    boolLine('tick-labels', args.tickLabels),
    attrLine('tick-values', serializeArray(args.tickValues)),
    attrLine('unit', args.unit),
    attrLine('value', args.value),
    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('');
  return normalizeHtml(`
    <div style="margin-top: 40px; margin-bottom: 40px;">
  <!-- div wrapper is for better appearance in Storybook -->
    <basic-slider-component${attrs}></basic-slider-component>
  </div>
    `);
};

/* stories */
export const Basic = Template.bind({});
Basic.args = {
  disabled: false,
  hideLeftTextBox: false,
  hideRightTextBox: false,
  hideTextBoxes: false,
  label: 'Volume',
  max: 100,
  min: 0,
  plumage: false,
  sliderThumbLabel: false,
  snapToTicks: false,
  tickLabels: false,
  tickValues: [],
  unit: '',
  value: 30,
  variant: 'primary',
};

export const WithTicks = Template.bind({});
WithTicks.args = {
  ...Basic.args,
  label: 'Brightness',
  value: 50,
  tickValues: [0, 25, 50, 75, 100],
  tickLabels: true,
  variant: 'info',
};

export const SnapToTicks = Template.bind({});
SnapToTicks.args = {
  ...Basic.args,
  label: 'Opacity',
  value: 75,
  snapToTicks: true,
  tickValues: [0, 20, 40, 60, 80, 100],
  tickLabels: true,
  variant: 'secondary',
};

export const ThumbLabel = Template.bind({});
ThumbLabel.args = {
  ...Basic.args,
  label: 'Temperature',
  unit: '°F',
  value: 68,
  sliderThumbLabel: true,
  variant: 'success',
};

export const PlumageVariant = Template.bind({});
PlumageVariant.args = {
  ...Basic.args,
  label: 'Speed',
  value: 70,
  plumage: true,
  variant: 'primary',
};

export const HideTextBoxes = Template.bind({});
HideTextBoxes.args = {
  ...Basic.args,
  label: 'Gain',
  value: 42,
  hideTextBoxes: true,
};

export const HideLeftOrRight = Template.bind({});
HideLeftOrRight.args = {
  ...Basic.args,
  label: 'Balance',
  value: 55,
  hideLeftTextBox: true,
  hideRightTextBox: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  label: 'Disabled',
  value: 35,
  disabled: true,
  variant: '',
};
