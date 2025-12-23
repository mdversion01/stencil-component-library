/* ------------------------------------------------------------------
 * Storybook: Plumage Select Field (Web Component)
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Plumage Select Field',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Plumage-styled `<select>` with focus underline, optional horizontal/inline form layout, validation, and multi-select. Works in the light DOM and accepts a JSON array for `options`.',
      },
    },
  },
  argTypes: {
    /* Core props */
    label: { control: 'text', table: { category: 'Props' } },
    selectFieldId: { control: 'text', table: { category: 'Props' } },
    options: {
      control: 'object',
      description: 'Array<{ value, name }>',
      table: { category: 'Props' },
    },
    value: {
      control: 'text',
      description: 'Selected value (string) or JSON array string for multi',
      table: { category: 'Props' },
    },

    /* Layout + sizes */
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      table: { category: 'Layout' },
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      table: { category: 'Layout' },
    },
    labelSize: {
      control: { type: 'select' },
      options: ['base', 'xs', 'sm', 'lg'],
      table: { category: 'Layout' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
    },
    labelHidden: { control: 'boolean', table: { category: 'Layout' } },
    labelCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    inputCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    labelCols: { control: 'text', table: { category: 'Layout' } },
    inputCols: { control: 'text', table: { category: 'Layout' } },

    /* Behavior */
    multiple: { control: 'boolean', table: { category: 'Behavior' } },
    required: { control: 'boolean', table: { category: 'Behavior' } },
    disabled: { control: 'boolean', table: { category: 'Behavior' } },
    fieldHeight: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Behavior' } },

    /* Placeholder / default option */
    defaultOptionTxt: { control: 'text', table: { category: 'Props' } },

    /* Validation */
    validation: { control: 'boolean', table: { category: 'Validation' } },
    validationMessage: { control: 'text', table: { category: 'Validation' } },

    /* Appearance hooks */
    classes: { control: 'text', table: { category: 'Appearance' } },
  },
};

/* ---------- helpers ---------- */

const attr = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  if (typeof v === 'boolean') return v ? ` ${name}` : '';
  return ` ${name}="${String(v).replace(/"/g, '&quot;')}"`;
};

const toOptionsJson = (arr) =>
  JSON.stringify(
    Array.isArray(arr) && arr.length
      ? arr
      : [
          { value: 'apple', name: 'Apple' },
          { value: 'banana', name: 'Banana' },
          { value: 'cherry', name: 'Cherry' },
        ],
  );

/* A small script inside the template to echo valueChange events into SB Actions (console) */
const wireValueChange = (id) => `
<script>
  (function(){
    var el = document.getElementById('${id}');
    if (!el || el._wired) return;
    el.addEventListener('valueChange', function(e){ console.log('[valueChange]', e.detail); });
    el._wired = true;
  })();
</script>
`;

/* ---------- base template ---------- */

const Template = (args) => {
  const id = args.selectFieldId || 'fruit-demo';
  const optionsJson = toOptionsJson(args.options);

  return `
<plumage-select-field-component
  id="${id}"
  ${attr('label', args.label)}
  ${attr('select-field-id', args.selectFieldId)}
  ${attr('form-layout', args.formLayout)}
  ${attr('label-align', args.labelAlign)}
  ${attr('label-size', args.labelSize)}
  ${attr('size', args.size)}
  ${attr('label-hidden', args.labelHidden)}
  ${attr('label-col', args.labelCol)}
  ${attr('input-col', args.inputCol)}
  ${attr('label-cols', args.labelCols)}
  ${attr('input-cols', args.inputCols)}
  ${attr('multiple', args.multiple)}
  ${attr('required', args.required)}
  ${attr('disabled', args.disabled)}
  ${attr('field-height', args.fieldHeight)}
  ${attr('default-option-txt', args.defaultOptionTxt)}
  ${attr('validation', args.validation)}
  ${attr('validation-message', args.validationMessage)}
  ${attr('classes', args.classes)}
  ${attr('value', args.value)}
  options='${optionsJson}'
></plumage-select-field-component>
${wireValueChange(id)}
`.trim();
};

/* ---------- Stories ---------- */

export const Playground = Template.bind({});
Playground.args = {
  label: 'Favorite Fruit',
  selectFieldId: 'fruit-playground',
  formLayout: '',
  labelAlign: '',
  labelSize: 'sm',
  size: '',
  labelHidden: false,
  labelCol: 2,
  inputCol: 10,
  multiple: false,
  required: false,
  disabled: false,
  defaultOptionTxt: 'Select an option',
  validation: false,
  validationMessage: '',
  value: '',
  options: [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ],
};

export const Horizontal = () => `
<div style="max-width: 640px;">
  <plumage-select-field-component
    label="Favorite Fruit"
    select-field-id="fruit-h"
    form-layout="horizontal"
    label-align="right"
    label-size="lg"
    size="lg"
    default-option-txt="Choose one"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"},{"value":"cherry","name":"Cherry"}]'
    value=""
  ></plumage-select-field-component>
</div>
`;

export const InlineLayout = () => `
<div style="max-width: 100%; display:flex; gap:12px; flex-wrap:wrap;">
  <plumage-select-field-component
    label="Fruit"
    select-field-id="fruit-inline"
    form-layout="inline"
    size="sm"
    default-option-txt="Pick fruit"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"},{"value":"cherry","name":"Cherry"}]'
  ></plumage-select-field-component>

  <plumage-select-field-component
    label="Toppings"
    select-field-id="toppings-inline"
    form-layout="inline"
    multiple
    field-height="4"
    default-option-txt="Select toppings"
    options='[
      {"value":"sprinkles","name":"Sprinkles"},
      {"value":"nuts","name":"Nuts"},
      {"value":"choc","name":"Chocolate Chips"},
      {"value":"caramel","name":"Caramel Drizzle"}
    ]'
  ></plumage-select-field-component>
</div>
`;

export const WithValidation = () => `
<div style="max-width: 520px;">
  <plumage-select-field-component
    label="Favorite Fruit"
    select-field-id="fruit-validate"
    form-layout="horizontal"
    label-align="right"
    required
    validation
    validation-message="Please make a selection"
    default-option-txt="Select an option"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"},{"value":"cherry","name":"Cherry"}]'
    value=""
  ></plumage-select-field-component>
</div>
`;

export const MultipleSelect = () => `
<div style="max-width: 520px;">
  <plumage-select-field-component
    label="Choose Fruits"
    select-field-id="fruit-multi"
    multiple
    required
    validation
    validation-message="Pick at least one fruit"
    field-height="5"
    default-option-txt="(Optional placeholder)"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"},{"value":"cherry","name":"Cherry"},{"value":"grape","name":"Grape"},{"value":"orange","name":"Orange"}]'
    value='["banana","cherry"]'
  ></plumage-select-field-component>
</div>
`;

export const DisabledState = () => `
<plumage-select-field-component
  label="Disabled Field"
  select-field-id="fruit-disabled"
  disabled
  default-option-txt="Unavailable"
  options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"}]'
></plumage-select-field-component>
`;

export const SizesAndLabels = () => `
<div style="display:grid; gap:14px; max-width:640px;">
  <plumage-select-field-component
    label="Small"
    select-field-id="fruit-sm"
    size="sm"
    default-option-txt="Select"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"}]'
  ></plumage-select-field-component>

  <plumage-select-field-component
    label="Base"
    select-field-id="fruit-base"
    label-size="base"
    default-option-txt="Select"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"}]'
  ></plumage-select-field-component>

  <plumage-select-field-component
    label="Large + Horizontal"
    select-field-id="fruit-lg"
    size="lg"
    label-size="lg"
    form-layout="horizontal"
    label-align="right"
    default-option-txt="Select"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"},{"value":"cherry","name":"Cherry"}]'
  ></plumage-select-field-component>
</div>
`;

/* Demonstrates grid control with labelCol/inputCol when horizontal */
export const HorizontalGridControl = () => `
<div style="max-width: 720px;">
  <plumage-select-field-component
    label="2/10 split (default)"
    select-field-id="fruit-grid-1"
    form-layout="horizontal"
    label-align="right"
    label-col="2"
    input-col="10"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"}]'
  ></plumage-select-field-component>

  <plumage-select-field-component
    label="3/9 split"
    select-field-id="fruit-grid-2"
    form-layout="horizontal"
    label-align="right"
    label-col="3"
    input-col="9"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"}]'
  ></plumage-select-field-component>

  <plumage-select-field-component
    label="Custom classes"
    select-field-id="fruit-grid-3"
    form-layout="horizontal"
    label-align="right"
    label-cols="col-12 col-sm-4"
    input-cols="col-12 col-sm-8"
    options='[{"value":"apple","name":"Apple"},{"value":"banana","name":"Banana"}]'
  ></plumage-select-field-component>
</div>
`;
