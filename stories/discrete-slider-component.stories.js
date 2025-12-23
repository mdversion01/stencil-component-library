export default {
  title: 'Components/Slider/Discrete Slider',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    /* Core */
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    plumage: { control: 'boolean' },
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
    },

    /* Values */
    selectedIndex: { control: { type: 'number', min: 0, step: 1 }, name: 'selected-index' },
    stringValues: {
      control: 'object',
      description: 'Array<string> or JSON string',
      name: 'string-values',
    },

    /* UI */
    tickLabels: { control: 'boolean', name: 'tick-labels' },
    hideRightTextBox: { control: 'boolean', name: 'hide-right-text-box' },
    unit: { control: 'text' },
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
<discrete-slider-component
  ${attr('label', args.label)}
  ${boolAttr('disabled', args.disabled)}
  ${boolAttr('plumage', args.plumage)}
  ${attr('variant', args.variant)}

  ${attr('selected-index', args.selectedIndex)}
  ${attr('string-values', serializeArray(args.stringValues))}

  ${boolAttr('tick-labels', args.tickLabels)}
  ${boolAttr('hide-right-text-box', args.hideRightTextBox)}
  ${attr('unit', args.unit)}
></discrete-slider-component>
`;

/* stories */
export const Basic = Template.bind({});
Basic.args = {
  label: 'Rating',
  disabled: false,
  plumage: false,
  variant: 'primary',

  selectedIndex: 2,
  stringValues: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],

  tickLabels: true,
  hideRightTextBox: false,
  unit: '',
};

export const WithTickLabels = Template.bind({});
WithTickLabels.args = {
  ...Basic.args,
  label: 'Size',
  stringValues: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  selectedIndex: 3,
  tickLabels: true,
  variant: 'info',
};

export const PlumageVariant = Template.bind({});
PlumageVariant.args = {
  ...Basic.args,
  label: 'Priority',
  plumage: true,
  variant: 'warning',
  stringValues: ['Low', 'Normal', 'High', 'Critical'],
  selectedIndex: 1,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  label: 'Disabled',
  disabled: true,
  variant: '',
  selectedIndex: 0,
};

export const JSONAttributeValues = () => `
<discrete-slider-component
  label="Stages"
  selected-index="1"
  tick-labels
  string-values='["Backlog","In Progress","Review","Done"]'
></discrete-slider-component>
`;

export const LongList = Template.bind({});
LongList.args = {
  ...Basic.args,
  label: 'Months',
  variant: 'secondary',
  tickLabels: false,
  hideRightTextBox: false,
  stringValues: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  selectedIndex: 5,
};
