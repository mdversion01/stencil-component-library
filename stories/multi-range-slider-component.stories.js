export default {
  title: 'Components/Slider/Multi Range Slider',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    /* Core */
    label: { control: 'text' },
    unit: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
    },
    plumage: { control: 'boolean' },
    disabled: { control: 'boolean' },

    /* Values & bounds */
    lowerValue: { control: { type: 'number', step: 1 }, name: 'lower-value' },
    upperValue: { control: { type: 'number', step: 1 }, name: 'upper-value' },
    min: { control: { type: 'number', step: 1 } },
    max: { control: { type: 'number', step: 1 } },

    /* UI */
    sliderThumbLabel: { control: 'boolean', name: 'slider-thumb-label' },
    hideTextBoxes: { control: 'boolean', name: 'hide-text-boxes' },
    hideLeftTextBox: { control: 'boolean', name: 'hide-left-text-box' },
    hideRightTextBox: { control: 'boolean', name: 'hide-right-text-box' },

    /* Ticks */
    snapToTicks: { control: 'boolean', name: 'snap-to-ticks' },
    tickLabels: { control: 'boolean', name: 'tick-labels' },
    tickValues: {
      control: 'object',
      description: 'Array<number> or JSON string (used as attribute)',
      name: 'tick-values',
    },
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

/* template */
const Template = (args) => `
<multi-range-slider-component
  ${attr('label', args.label)}
  ${attr('unit', args.unit)}
  ${attr('variant', args.variant)}
  ${boolAttr('plumage', args.plumage)}
  ${boolAttr('disabled', args.disabled)}

  ${attr('lower-value', args.lowerValue)}
  ${attr('upper-value', args.upperValue)}
  ${attr('min', args.min)}
  ${attr('max', args.max)}

  ${boolAttr('slider-thumb-label', args.sliderThumbLabel)}
  ${boolAttr('hide-text-boxes', args.hideTextBoxes)}
  ${boolAttr('hide-left-text-box', args.hideLeftTextBox)}
  ${boolAttr('hide-right-text-box', args.hideRightTextBox)}

  ${boolAttr('snap-to-ticks', args.snapToTicks)}
  ${boolAttr('tick-labels', args.tickLabels)}
  ${attr('tick-values', serializeArray(args.tickValues))}
></multi-range-slider-component>
`;

/* stories */
export const Basic = Template.bind({});
Basic.args = {
  label: 'Price range',
  unit: '$',
  variant: 'primary',
  plumage: false,
  disabled: false,

  lowerValue: 20,
  upperValue: 80,
  min: 0,
  max: 100,

  sliderThumbLabel: false,
  hideTextBoxes: false,
  hideLeftTextBox: false,
  hideRightTextBox: false,

  snapToTicks: false,
  tickLabels: false,
  tickValues: [],
};

export const WithThumbLabels = Template.bind({});
WithThumbLabels.args = {
  ...Basic.args,
  label: 'Temperature',
  unit: '°F',
  sliderThumbLabel: true,
  variant: 'info',
};

export const WithTicksAndSnapping = Template.bind({});
WithTicksAndSnapping.args = {
  ...Basic.args,
  label: 'Steps',
  unit: '',
  snapToTicks: true,
  tickLabels: true,
  tickValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  lowerValue: 30,
  upperValue: 70,
  variant: 'success',
};

export const PlumageStyle = Template.bind({});
PlumageStyle.args = {
  ...Basic.args,
  label: 'Bandwidth',
  unit: 'Mbps',
  plumage: true,
  variant: 'warning',
  lowerValue: 50,
  upperValue: 150,
  min: 0,
  max: 200,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  label: 'Disabled range',
  disabled: true,
  variant: '',
};

export const JSONTickValuesAttribute = () => `
<multi-range-slider-component
  label="Snaps via JSON attr"
  lower-value="25"
  upper-value="75"
  min="0"
  max="100"
  snap-to-ticks
  tick-labels
  tick-values='[0, 25, 50, 75, 100]'
></multi-range-slider-component>
`;
