export default {
  title: 'Components/Slider/Basic Slider',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    /* Core props */
    label: { control: 'text' },
    value: { control: { type: 'number', step: 1 } },
    disabled: { control: 'boolean' },
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
    },
    plumage: { control: 'boolean' },

    /* Ranges */
    min: { control: { type: 'number', step: 1 } },
    max: { control: { type: 'number', step: 1 } },
    unit: { control: 'text' },

    /* Thumb + ticks */
    sliderThumbLabel: { control: 'boolean', name: 'slider-thumb-label' },
    snapToTicks: { control: 'boolean', name: 'snap-to-ticks' },
    tickValues: { control: 'object', description: 'Array<number> or JSON string', name: 'tick-values' },
    tickLabels: { control: 'boolean', name: 'tick-labels' },

    /* Text boxes visibility */
    hideTextBoxes: { control: 'boolean', name: 'hide-text-boxes' },
    hideLeftTextBox: { control: 'boolean', name: 'hide-left-text-box' },
    hideRightTextBox: { control: 'boolean', name: 'hide-right-text-box' },
  },
};

/* helpers */
const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};
const serializeArray = (val) => {
  if (!val) return '';
  try { return JSON.stringify(val); } catch { return ''; }
};

/* base template */
const Template = (args) => `
<basic-slider-component
  ${attr('label', args.label)}
  ${attr('value', args.value)}
  ${attr('min', args.min)}
  ${attr('max', args.max)}
  ${attr('unit', args.unit)}
  ${attr('variant', args.variant)}
  ${boolAttr('plumage', args.plumage)}
  ${boolAttr('disabled', args.disabled)}

  ${boolAttr('slider-thumb-label', args.sliderThumbLabel)}
  ${boolAttr('snap-to-ticks', args.snapToTicks)}
  ${attr('tick-values', serializeArray(args.tickValues))}
  ${boolAttr('tick-labels', args.tickLabels)}

  ${boolAttr('hide-text-boxes', args.hideTextBoxes)}
  ${boolAttr('hide-left-text-box', args.hideLeftTextBox)}
  ${boolAttr('hide-right-text-box', args.hideRightTextBox)}
></basic-slider-component>
`;

/* stories */
export const Basic = Template.bind({});
Basic.args = {
  label: 'Volume',
  value: 30,
  min: 0,
  max: 100,
  unit: '',
  variant: 'primary',
  plumage: false,
  disabled: false,

  sliderThumbLabel: false,
  snapToTicks: false,
  tickValues: [],
  tickLabels: false,

  hideTextBoxes: false,
  hideLeftTextBox: false,
  hideRightTextBox: false,
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
  variant: 'warning',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  label: 'Disabled',
  value: 35,
  disabled: true,
  variant: '',
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
