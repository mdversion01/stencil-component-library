/* ------------------------------------------------------------------
 * Storybook: Plumage Input Field (Web Component)
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Plumage Input Field',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Single Plumage-styled text input with focus underline, validation messaging, and responsive layouts (stacked, horizontal, inline).',
      },
    },
  },
  argTypes: {
    // Core
    inputId: { control: 'text', table: { category: 'Props' } },
    label: { control: 'text', table: { category: 'Props' } },
    value: { control: 'text', table: { category: 'Props' } },
    type: { control: 'text', table: { category: 'Props' }, description: 'HTML input type' },
    placeholder: { control: 'text', table: { category: 'Props' } },

    // Behavior
    disabled: { control: 'boolean', table: { category: 'Behavior' } },
    required: { control: 'boolean', table: { category: 'Behavior' } },

    // Layout
    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'], table: { category: 'Layout' } },
    labelHidden: { control: 'boolean', table: { category: 'Layout' } },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'], table: { category: 'Layout' } },
    labelSize: { control: { type: 'select' }, options: ['base', 'xs', 'sm', 'lg'], table: { category: 'Layout' } },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], table: { category: 'Layout' } },

    // Grid (either numeric or string specs)
    labelCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    inputCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    labelCols: { control: 'text', table: { category: 'Layout' }, description: 'e.g. "col-12 col-sm-3"' },
    inputCols: { control: 'text', table: { category: 'Layout' }, description: 'e.g. "col-12 col-sm-9"' },

    // Validation
    validation: { control: 'boolean', table: { category: 'Validation' } },
    validationMessage: { control: 'text', table: { category: 'Validation' } },
  },
};

/* ---------- helpers ---------- */

const attr = (name, v) => {
  if (v === undefined || v === null || v === '' || v === false) return '';
  if (v === true) return ` ${name}`;
  return ` ${name}="${String(v).replace(/"/g, '&quot;')}"`;
};

/* Logs valueChange so you can see updates live in SB. */
const wireValueChange = (id) => `
<script>
  (function(){
    var el = document.getElementById('${id}');
    if (!el || el._wired) return;
    el.addEventListener('valueChange', function(e){ console.log('[plumage-input-field:valueChange]', e.detail); });
    el._wired = true;
  })();
</script>
`;

/* ---------- base template ---------- */

const Template = (args) => {
  const id = args.inputId || 'plumage-input-demo';
  return `
<plumage-input-field-component
  id="${id}"
  ${attr('input-id', args.inputId)}
  ${attr('label', args.label)}
  ${attr('value', args.value)}
  ${attr('type', args.type || 'text')}
  ${attr('placeholder', args.placeholder)}
  ${attr('disabled', args.disabled)}
  ${attr('required', args.required)}
  ${attr('form-layout', args.formLayout)}
  ${attr('label-hidden', args.labelHidden)}
  ${attr('label-align', args.labelAlign)}
  ${attr('label-size', args.labelSize)}
  ${attr('size', args.size)}
  ${attr('label-col', args.labelCol)}
  ${attr('input-col', args.inputCol)}
  ${attr('label-cols', args.labelCols)}
  ${attr('input-cols', args.inputCols)}
  ${attr('validation', args.validation)}
  ${attr('validation-message', args.validationMessage)}
></plumage-input-field-component>
${wireValueChange(id)}
`.trim();
};

/* ---------- Stories ---------- */

export const Playground = Template.bind({});
Playground.args = {
  inputId: 'firstName',
  label: 'First name',
  value: '',
  placeholder: 'Enter first name',
  type: 'text',
  disabled: false,
  required: false,

  formLayout: '',
  labelHidden: false,
  labelAlign: '',
  labelSize: 'sm',
  size: '',

  labelCol: 2,
  inputCol: 10,
  labelCols: '',
  inputCols: '',

  validation: false,
  validationMessage: '',
};

export const Sizes = () => `
<div style="display:grid; gap:14px; max-width:560px;">
  <plumage-input-field-component label="Small" input-id="sm1" size="sm"></plumage-input-field-component>
  <plumage-input-field-component label="Default" input-id="df1"></plumage-input-field-component>
  <plumage-input-field-component label="Large" input-id="lg1" size="lg"></plumage-input-field-component>
</div>
`;

export const Types = () => `
<div style="display:grid; gap:14px; max-width:560px;">
  <plumage-input-field-component label="Email" input-id="em1" type="email" placeholder="name@example.com"></plumage-input-field-component>
  <plumage-input-field-component label="Password" input-id="pw1" type="password"></plumage-input-field-component>
  <plumage-input-field-component label="Number" input-id="num1" type="number" placeholder="0"></plumage-input-field-component>
</div>
`;

export const HorizontalLayout = () => `
<div style="max-width: 720px;">
  <plumage-input-field-component
    label="Organization"
    input-id="org1"
    form-layout="horizontal"
    label-align="right"
    label-size="lg"
    label-col="3"
    input-col="9"
    placeholder="Dept. of…"
  ></plumage-input-field-component>

  <plumage-input-field-component
    label="Responsive Grid"
    input-id="org2"
    form-layout="horizontal"
    label-align="right"
    label-cols="col-12 col-sm-4"
    input-cols="col-12 col-sm-8"
    placeholder="Responsive columns"
  ></plumage-input-field-component>
</div>
`;

export const InlineLayout = () => `
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <plumage-input-field-component
    label="City"
    input-id="city1"
    form-layout="inline"
    size="sm"
  ></plumage-input-field-component>

  <plumage-input-field-component
    label="State"
    input-id="state1"
    form-layout="inline"
    size="sm"
    placeholder="CA"
  ></plumage-input-field-component>
</div>
`;

export const LabelHidden = () => `
<div style="max-width: 560px;">
  <plumage-input-field-component
    label="Search"
    input-id="searchHiddenLbl"
    label-hidden
    placeholder="Search"
  ></plumage-input-field-component>
</div>
`;

export const RequiredValidation = () => `
<div style="max-width: 520px;">
  <plumage-input-field-component
    label="Required"
    input-id="req1"
    required
    validation
    validation-message="Please enter at least 3 characters"
    placeholder="Type 3+ chars"
  ></plumage-input-field-component>
</div>
`;

export const Disabled = () => `
<plumage-input-field-component
  label="Disabled"
  input-id="disabled1"
  value="Read only"
  disabled
></plumage-input-field-component>
`;

export const PreFilled = () => `
<plumage-input-field-component
  label="Prefilled"
  input-id="prefill1"
  value="Existing value"
></plumage-input-field-component>
`;
