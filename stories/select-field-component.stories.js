// src/stories/select-field-component.stories.js

export default {
  title: 'Form/Select Field',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    // Core behavior
    options: { control: 'object', description: 'Array of { value, name } or JSON string' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    validation: { control: 'boolean' },
    validationMessage: { control: 'text', name: 'validation-message' },
    value: { control: 'text', description: 'For single select; in multiple mode prefer selection via UI' },

    // Appearance & layout
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'] },
    custom: { control: 'boolean' },
    classes: { control: 'text' },

    defaultOptionTxt: { control: 'text', name: 'default-option-txt' },
    fieldHeight: { control: { type: 'number', min: 2, step: 1 }, name: 'field-height' },

    label: { control: 'text' },
    labelSize: { control: { type: 'select' }, options: ['', 'xs', 'sm', 'lg'], name: 'label-size' },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'], name: 'label-align' },
    labelHidden: { control: 'boolean', name: 'label-hidden' },

    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'], name: 'form-layout' },
    formId: { control: 'text', name: 'form-id' },
    selectFieldId: { control: 'text', name: 'select-field-id' },

    // Grid helpers
    labelCol: { control: { type: 'number', min: 0, max: 12, step: 1 }, name: 'label-col' },
    inputCol: { control: { type: 'number', min: 0, max: 12, step: 1 }, name: 'input-col' },
    labelCols: { control: 'text', name: 'label-cols' },
    inputCols: { control: 'text', name: 'input-cols' },

    // Table sync (optional)
    withTable: { control: 'boolean', name: 'with-table' },
  },
};

/* Helpers --------------------------------------------------------------- */
const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  const s = String(v);
  // Prefer single-quoted attribute if the value contains double quotes (e.g., JSON)
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};
const serializeOptions = (opts) => {
  if (!opts) return '';
  try {
    return JSON.stringify(opts);
  } catch {
    return '[]';
  }
};

/* Base template --------------------------------------------------------- */
const Template = (args) => `
<select-field-component
  ${attr('label', args.label)}
  ${attr('label-size', args.labelSize)}
  ${attr('label-align', args.labelAlign)}
  ${boolAttr('label-hidden', args.labelHidden)}

  ${attr('size', args.size)}
  ${boolAttr('custom', args.custom)}
  ${attr('classes', args.classes)}

  ${boolAttr('multiple', args.multiple)}
  ${boolAttr('required', args.required)}
  ${boolAttr('disabled', args.disabled)}

  ${boolAttr('validation', args.validation)}
  ${attr('validation-message', args.validationMessage)}

  ${attr('default-option-txt', args.defaultOptionTxt)}
  ${args.value && !args.multiple ? attr('value', args.value) : ''}

  ${attr('options', serializeOptions(args.options))}

  ${attr('form-id', args.formId)}
  ${attr('form-layout', args.formLayout)}
  ${attr('select-field-id', args.selectFieldId)}

  ${args.fieldHeight != null && args.fieldHeight !== '' ? attr('field-height', args.fieldHeight) : ''}

  ${attr('label-col', args.labelCol)}
  ${attr('input-col', args.inputCol)}
  ${attr('label-cols', args.labelCols)}
  ${attr('input-cols', args.inputCols)}

  ${boolAttr('with-table', args.withTable)}
></select-field-component>
`;

/* Stories --------------------------------------------------------------- */

export const BasicSingle = Template.bind({});
BasicSingle.args = {
  label: 'Fruits',
  labelSize: 'sm',
  labelAlign: '',
  labelHidden: false,

  size: '',
  custom: false,
  classes: '',

  multiple: false,
  required: false,
  disabled: false,

  validation: false,
  validationMessage: '',

  defaultOptionTxt: 'Select a fruit',
  value: '',
  options: [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ],

  formId: '',
  formLayout: '',
  selectFieldId: 'fruit',

  fieldHeight: null,

  labelCol: 2,
  inputCol: 10,
  labelCols: '',
  inputCols: '',

  withTable: false,
};

export const WithSelection = Template.bind({});
WithSelection.args = {
  ...BasicSingle.args,
  value: 'banana',
};

export const MultipleSelection = Template.bind({});
MultipleSelection.args = {
  ...BasicSingle.args,
  label: 'Tags',
  multiple: true,
  // For multiple, leave `value` empty and use UI to select; you can also set via property in a play() if needed.
  defaultOptionTxt: 'Choose tags',
  options: [
    { value: 'ux', name: 'UX' },
    { value: 'web', name: 'Web' },
    { value: 'mobile', name: 'Mobile' },
    { value: 'data', name: 'Data' },
  ],
  fieldHeight: 6, // show more rows
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  ...BasicSingle.args,
  formLayout: 'horizontal',
  labelCols: 'col-sm-3',
  inputCols: 'col-sm-9',
  value: 'cherry',
};

export const WithValidationRequired = Template.bind({});
WithValidationRequired.args = {
  ...BasicSingle.args,
  required: true,
  validation: true,
  validationMessage: 'Please select an option.',
  defaultOptionTxt: 'Please choose…',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...BasicSingle.args,
  disabled: true,
  defaultOptionTxt: 'Not available',
};

export const SizeVariants = Template.bind({});
SizeVariants.args = {
  ...BasicSingle.args,
  size: 'lg', // try: '', 'sm', 'lg'
};

export const CustomStyling = Template.bind({});
CustomStyling.args = {
  ...BasicSingle.args,
  custom: true,
  classes: 'my-shadow-1',
  value: 'apple',
};

export const OptionsViaJSONAttribute = () => `
<select-field-component
  label="Continents"
  default-option-txt="Select continent"
  options='[
    { "value": "af", "name": "Africa" },
    { "value": "as", "name": "Asia" },
    { "value": "eu", "name": "Europe" },
    { "value": "na", "name": "North America" },
    { "value": "oc", "name": "Oceania" },
    { "value": "sa", "name": "South America" }
  ]'
></select-field-component>
`;
