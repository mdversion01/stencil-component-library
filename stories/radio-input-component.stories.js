// src/stories/radio-input-component.stories.js

export default {
  title: 'Form/Radio Input',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    // render modes
    radio: { control: 'boolean', description: 'Single radio appearance' },
    radioGroup: { control: 'boolean', description: 'Group of radios (browser default style)' },
    customRadio: { control: 'boolean', description: 'Single radio, custom classes' },
    customRadioGroup: { control: 'boolean', description: 'Group of radios, custom classes' },

    // single props
    inputId: { control: 'text', name: 'input-id' },
    name: { control: 'text' },
    labelTxt: { control: 'text', name: 'label-txt' },
    value: { control: 'text' },

    // group props
    groupOptions: { control: 'object', description: 'Array or JSON string of options' },
    groupTitle: { control: 'text', name: 'group-title' },
    groupTitleSize: { control: 'text', name: 'group-title-size' },
    inline: { control: 'boolean' },

    // shared
    required: { control: 'boolean' },
    size: { control: 'text' },
    disabled: { control: 'boolean' },
    validation: { control: 'boolean' },
    validationMsg: { control: 'text', name: 'validation-msg' },

    // events
    groupChange: { action: 'groupChange', table: { category: 'Events' } },
  },
};

/* ---------------- helpers ---------------- */
const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, v) =>
  v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`;
const serialize = (v) => {
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v ?? []); } catch { return '[]'; }
};

/* ---------------- templates ---------------- */

// Single radio
const SingleTemplate = (args) => `
<radio-input-component
  ${boolAttr('radio', args.radio && !args.customRadio)}
  ${boolAttr('custom-radio', args.customRadio)}
  ${attr('input-id', args.inputId)}
  ${attr('name', args.name)}
  ${attr('label-txt', args.labelTxt)}
  ${attr('value', args.value)}
  ${attr('size', args.size)}
  ${boolAttr('required', args.required)}
  ${boolAttr('disabled', args.disabled)}
  ${boolAttr('validation', args.validation)}
  ${attr('validation-msg', args.validationMsg)}
></radio-input-component>
`;

// Radio group
const GroupTemplate = (args) => `
<radio-input-component
  ${boolAttr('radio-group', args.radioGroup && !args.customRadioGroup)}
  ${boolAttr('custom-radio-group', args.customRadioGroup)}
  ${attr('group-title', args.groupTitle)}
  ${attr('group-title-size', args.groupTitleSize)}
  ${boolAttr('inline', args.inline)}
  ${attr('name', args.name)}
  ${boolAttr('required', args.required)}
  ${boolAttr('validation', args.validation)}
  ${attr('validation-msg', args.validationMsg)}
  group-options='${serialize(args.groupOptions)}'
></radio-input-component>
`;

/* ---------------- stories ---------------- */

// SINGLE
export const SingleBasic = SingleTemplate.bind({});
SingleBasic.args = {
  radio: true,
  customRadio: false,
  inputId: 'r-basic',
  name: 'newsletter',
  labelTxt: 'Subscribe to newsletter',
  value: 'yes',
  required: false,
  disabled: false,
  size: '',
  validation: false,
  validationMsg: '',
};

export const SingleRequiredInvalid = SingleTemplate.bind({});
SingleRequiredInvalid.args = {
  radio: true,
  customRadio: false,
  inputId: 'r-required',
  name: 'tos',
  labelTxt: 'I agree to Terms',
  value: 'agree',
  required: true,
  disabled: false,
  size: '',
  validation: true,
  validationMsg: 'You must agree before continuing.',
};

export const SingleCustom = SingleTemplate.bind({});
SingleCustom.args = {
  customRadio: true,
  radio: false,
  inputId: 'r-custom',
  name: 'marketing',
  labelTxt: 'Email me product updates',
  value: 'optin',
  required: false,
  disabled: false,
  size: 'lg',
  validation: false,
  validationMsg: '',
};

// GROUP
export const GroupBasic = GroupTemplate.bind({});
GroupBasic.args = {
  radioGroup: true,
  customRadioGroup: false,
  name: 'color',
  groupTitle: 'Favorite Color',
  groupTitleSize: 'h6',
  inline: false,
  required: false,
  validation: false,
  validationMsg: '',
  groupOptions: [
    { inputId: 'color-red', value: 'red', labelTxt: 'Red', checked: true },
    { inputId: 'color-green', value: 'green', labelTxt: 'Green' },
    { inputId: 'color-blue', value: 'blue', labelTxt: 'Blue' },
  ],
};

export const GroupInline = GroupTemplate.bind({});
GroupInline.args = {
  radioGroup: true,
  customRadioGroup: false,
  name: 'size',
  groupTitle: 'T-Shirt Size',
  groupTitleSize: '',
  inline: true,
  required: false,
  validation: false,
  validationMsg: '',
  groupOptions: [
    { inputId: 'sz-s', value: 'S', labelTxt: 'Small' },
    { inputId: 'sz-m', value: 'M', labelTxt: 'Medium', checked: true },
    { inputId: 'sz-l', value: 'L', labelTxt: 'Large' },
  ],
};

export const GroupCustomStyled = GroupTemplate.bind({});
GroupCustomStyled.args = {
  customRadioGroup: true,
  radioGroup: false,
  name: 'delivery',
  groupTitle: 'Delivery Method',
  groupTitleSize: 'h6',
  inline: false,
  required: true,
  validation: false,
  validationMsg: 'Please choose a delivery method.',
  groupOptions: [
    { inputId: 'del-standard', value: 'standard', labelTxt: 'Standard (3–5 days)', checked: true },
    { inputId: 'del-express', value: 'express', labelTxt: 'Express (1–2 days)' },
  ],
};

export const GroupWithValidation = GroupTemplate.bind({});
GroupWithValidation.args = {
  radioGroup: true,
  customRadioGroup: false,
  name: 'contact',
  groupTitle: 'Preferred Contact',
  groupTitleSize: '',
  inline: false,
  required: true,
  validation: true,
  validationMsg: 'Select one contact method.',
  groupOptions: [
    { inputId: 'ct-email', value: 'email', labelTxt: 'Email' },
    { inputId: 'ct-sms', value: 'sms', labelTxt: 'SMS' },
    { inputId: 'ct-call', value: 'call', labelTxt: 'Phone Call' },
  ],
};

export const GroupDisabledOptions = GroupTemplate.bind({});
GroupDisabledOptions.args = {
  radioGroup: true,
  customRadioGroup: false,
  name: 'seat',
  groupTitle: 'Seat Preference',
  inline: true,
  required: false,
  validation: false,
  validationMsg: '',
  groupOptions: [
    { inputId: 'seat-window', value: 'window', labelTxt: 'Window', disabled: true },
    { inputId: 'seat-middle', value: 'middle', labelTxt: 'Middle' },
    { inputId: 'seat-aisle', value: 'aisle', labelTxt: 'Aisle', checked: true },
  ],
};

/* Optional: wire Storybook action to the custom event for docs demo */
GroupBasic.play = async ({ canvasElement, args }) => {
  const el = canvasElement.querySelector('radio-input-component');
  if (el) el.addEventListener('groupChange', (e) => args.groupChange?.(e.detail));
};
GroupInline.play = GroupBasic.play;
GroupCustomStyled.play = GroupBasic.play;
GroupWithValidation.play = GroupBasic.play;
GroupDisabledOptions.play = GroupBasic.play;
