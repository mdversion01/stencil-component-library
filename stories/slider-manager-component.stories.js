export default {
  title: 'Components/Slider/Slider Manager',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    /* core */
    type: { control: { type: 'select' }, options: ['basic', 'multi', 'discrete'] },
    label: { control: 'text' },
    variant: { control: { type: 'select' }, options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'] },
    plumage: { control: 'boolean' },
    disabled: { control: 'boolean' },

    hideTextBoxes: { control: 'boolean', name: 'hide-text-boxes' },
    hideLeftTextBox: { control: 'boolean', name: 'hide-left-text-box' },
    hideRightTextBox: { control: 'boolean', name: 'hide-right-text-box' },

    /* shared slider props */
    min: { control: { type: 'number', step: 1 } },
    max: { control: { type: 'number', step: 1 } },
    unit: { control: 'text' },
    sliderThumbLabel: { control: 'boolean', name: 'slider-thumb-label' },
    snapToTicks: { control: 'boolean', name: 'snap-to-ticks' },
    tickLabels: { control: 'boolean', name: 'tick-labels' },
    tickValues: { control: 'object', description: 'Array<number>' },

    /* basic */
    value: { control: { type: 'number', step: 1 } },

    /* multi */
    lowerValue: { control: { type: 'number', step: 1 }, name: 'lower-value' },
    upperValue: { control: { type: 'number', step: 1 }, name: 'upper-value' },

    /* discrete */
    selectedIndex: { control: { type: 'number', min: 0, step: 1 }, name: 'selected-index' },
    stringValues: { control: 'object', description: 'Array<string>', name: 'string-values' },
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
  try {
    return JSON.stringify(val);
  } catch {
    return '';
  }
};

/* base template */
const Template = (args) => `
<slider-manager-component
  ${attr('type', args.type)}
  ${attr('label', args.label)}
  ${attr('variant', args.variant)}
  ${boolAttr('plumage', args.plumage)}
  ${boolAttr('disabled', args.disabled)}

  ${boolAttr('hide-text-boxes', args.hideTextBoxes)}
  ${boolAttr('hide-left-text-box', args.hideLeftTextBox)}
  ${boolAttr('hide-right-text-box', args.hideRightTextBox)}

  ${attr('min', args.min)}
  ${attr('max', args.max)}
  ${attr('unit', args.unit)}
  ${boolAttr('slider-thumb-label', args.sliderThumbLabel)}
  ${boolAttr('snap-to-ticks', args.snapToTicks)}
  ${boolAttr('tick-labels', args.tickLabels)}
  ${attr('tick-values', serializeArray(args.tickValues))}

  ${args.type === 'basic' ? attr('value', args.value) : ''}

  ${args.type === 'multi' ? attr('lower-value', args.lowerValue) : ''}
  ${args.type === 'multi' ? attr('upper-value', args.upperValue) : ''}

  ${args.type === 'discrete' ? attr('selected-index', args.selectedIndex) : ''}
  ${args.type === 'discrete' ? attr('string-values', serializeArray(args.stringValues)) : ''}
></slider-manager-component>
`;

/* stories */
export const Basic = Template.bind({});
Basic.args = {
  type: 'basic',
  label: 'Temperature',
  variant: 'primary',
  plumage: false,
  disabled: false,

  hideTextBoxes: false,
  hideLeftTextBox: false,
  hideRightTextBox: false,

  min: 0,
  max: 100,
  unit: '°F',
  sliderThumbLabel: true,
  snapToTicks: false,
  tickLabels: false,
  tickValues: [],

  value: 42,
};

export const BasicWithTicks = Template.bind({});
BasicWithTicks.args = {
  ...Basic.args,
  sliderThumbLabel: true,
  snapToTicks: true,
  tickLabels: true,
  tickValues: [0, 25, 50, 75, 100],
  value: 50,
  variant: 'info',
};

export const MultiRange = Template.bind({});
MultiRange.args = {
  type: 'multi',
  label: 'Price Range',
  variant: 'success',
  plumage: false,
  disabled: false,

  hideTextBoxes: false,
  hideLeftTextBox: false,
  hideRightTextBox: false,

  min: 0,
  max: 500,
  unit: '$',
  sliderThumbLabel: true,
  snapToTicks: false,
  tickLabels: true,
  tickValues: [0, 100, 200, 300, 400, 500],

  lowerValue: 125,
  upperValue: 375,
};

export const Discrete = Template.bind({});
Discrete.args = {
  type: 'discrete',
  label: 'T-Shirt Size',
  variant: 'secondary',
  plumage: false,
  disabled: false,

  hideTextBoxes: true,      // ignored by discrete, but harmless
  hideLeftTextBox: false,   // ignored by discrete, but harmless
  hideRightTextBox: false,

  // shared (some ignored by discrete)
  min: 0,
  max: 100,
  unit: '',
  sliderThumbLabel: false,
  snapToTicks: false,
  tickLabels: true,
  tickValues: [],

  selectedIndex: 2,
  stringValues: ['XS', 'S', 'M', 'L', 'XL'],
};

export const PlumageVariant = Template.bind({});
PlumageVariant.args = {
  ...Basic.args,
  plumage: true,
  variant: 'warning',
  value: 70,
  hideTextBoxes: true,
};

export const DisabledState = Template.bind({});
DisabledState.args = {
  ...Basic.args,
  disabled: true,
  value: 35,
};
