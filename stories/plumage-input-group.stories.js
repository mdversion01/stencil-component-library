/* ------------------------------------------------------------------
 * Storybook: Plumage Input Group (Web Component)
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Plumage Input Group',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Plumage-styled input with optional prepend/append (icon or custom slot), focus underline, validation messaging, and responsive form layouts (stacked, horizontal, inline). Includes a search variant.',
      },
    },
  },
  argTypes: {
    /* Core */
    inputId: { control: 'text', table: { category: 'Props' } },
    label: { control: 'text', table: { category: 'Props' } },
    value: { control: 'text', table: { category: 'Props' } },
    type: { control: 'text', table: { category: 'Props' }, description: 'HTML input type' },
    placeholder: { control: 'text', table: { category: 'Props' } },

    /* Behavior */
    disabled: { control: 'boolean', table: { category: 'Behavior' } },
    required: { control: 'boolean', table: { category: 'Behavior' } },

    /* Layout */
    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'], table: { category: 'Layout' } },
    labelHidden: { control: 'boolean', table: { category: 'Layout' } },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'], table: { category: 'Layout' } },
    labelSize: { control: { type: 'select' }, options: ['base', 'xs', 'sm', 'lg'], table: { category: 'Layout' } },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], table: { category: 'Layout' } },

    /* Grid (either numeric or string specs) */
    labelCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    inputCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    labelCols: { control: 'text', table: { category: 'Layout' }, description: 'e.g. "col-12 col-sm-3"' },
    inputCols: { control: 'text', table: { category: 'Layout' }, description: 'e.g. "col-12 col-sm-9"' },

    /* Validation */
    validation: { control: 'boolean', table: { category: 'Validation' } },
    validationMessage: { control: 'text', table: { category: 'Validation' } },

    /* Addons (new + legacy) */
    prepend: { control: 'boolean', table: { category: 'Addons' } },
    append: { control: 'boolean', table: { category: 'Addons' } },
    'prepend-field': { control: 'boolean', table: { category: 'Addons' } },
    'append-field': { control: 'boolean', table: { category: 'Addons' } },
    prependIcon: { control: 'text', table: { category: 'Addons' }, description: 'Font Awesome class, e.g. "fas fa-dollar-sign"' },
    appendIcon: { control: 'text', table: { category: 'Addons' } },
    otherContent: { control: 'boolean', table: { category: 'Addons' } },
    prependId: { control: 'text', table: { category: 'Addons' } },
    appendId: { control: 'text', table: { category: 'Addons' } },

    /* Variant */
    plumageSearch: { control: 'boolean', table: { category: 'Variant' } },
  },
};

/* ---------- helpers ---------- */

const attr = (name, v) => {
  if (v === undefined || v === null || v === '' || v === false) return '';
  if (v === true) return ` ${name}`;
  return ` ${name}="${String(v).replace(/"/g, '&quot;')}"`;
};

/* Logs valueChange in the console so you can see updates live in SB. */
const wireValueChange = (id) => `
<script>
  (function(){
    var el = document.getElementById('${id}');
    if (!el || el._wired) return;
    el.addEventListener('valueChange', function(e){ console.log('[plumage-input-group:valueChange]', e.detail); });
    el._wired = true;
  })();
</script>
`;

/* ---------- base template ---------- */

const Template = (args) => {
  const id = args.inputId || 'plumage-input-demo';

  // Prefer modern flags (prepend/append) but also pass legacy spellings to help testing both
  const showPrepend = !!(args.prepend || args['prepend-field']);
  const showAppend = !!(args.append || args['append-field']);

  // Decide slot content (only used when no icon props are set)
  const prependSlot = `<span slot="prepend">@</span>`;
  const appendSlot = `<span slot="append">.com</span>`;

  const prependIcon = args.prependIcon ? attr('prepend-icon', args.prependIcon) : '';
  const appendIcon = args.appendIcon ? attr('append-icon', args.appendIcon) : '';

  return `
<plumage-input-group-component
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
  ${attr('prepend', args.prepend)}
  ${attr('append', args.append)}
  ${attr('prepend-field', args['prepend-field'])}
  ${attr('append-field', args['append-field'])}
  ${attr('prepend-id', args.prependId)}
  ${attr('append-id', args.appendId)}
  ${prependIcon}
  ${appendIcon}
  ${attr('other-content', args.otherContent)}
  ${attr('plumage-search', args.plumageSearch)}
>
  ${showPrepend && !args.prependIcon ? prependSlot : ''}
  ${showAppend && !args.appendIcon ? appendSlot : ''}
</plumage-input-group-component>
${wireValueChange(id)}
`.trim();
};

/* ---------- Stories ---------- */

export const Playground = Template.bind({});
Playground.args = {
  inputId: 'username',
  label: 'Username',
  value: '',
  placeholder: 'Enter username',
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

  prepend: true,
  append: true,
  'prepend-field': false, // legacy alt spelling
  'append-field': false,  // legacy alt spelling
  prependIcon: '',
  appendIcon: '',
  otherContent: false,

  plumageSearch: false,
};

export const WithIcons = () => `
<div style="max-width: 520px;">
  <plumage-input-group-component
    label="Amount"
    input-id="amount"
    type="number"
    placeholder="0.00"
    form-layout="horizontal"
    label-align="right"
    size="lg"
    prepend
    append
    prepend-icon="fas fa-dollar-sign"
    append-icon="fas fa-percentage"
  ></plumage-input-group-component>
</div>
`;

export const CustomSlots = () => `
<div style="max-width: 520px;">
  <plumage-input-group-component
    label="Email"
    input-id="email"
    type="email"
    placeholder="you"
    prepend
    append
  >
    <span slot="prepend">@</span>
    <span slot="append">.example</span>
  </plumage-input-group-component>
</div>
`;

export const ValidationState = () => `
<div style="max-width: 520px;">
  <plumage-input-group-component
    label="Required Field"
    input-id="req1"
    required
    validation
    validation-message="Please enter at least 3 characters"
    placeholder="Type 3+ chars"
  ></plumage-input-group-component>
</div>
`;

export const Disabled = () => `
<plumage-input-group-component
  label="Disabled"
  input-id="disabled1"
  value="Read only"
  disabled
  prepend
  append
>
  <span slot="prepend">#</span>
  <span slot="append">.lock</span>
</plumage-input-group-component>
`;

export const Sizes = () => `
<div style="display:grid; gap:14px; max-width:560px;">
  <plumage-input-group-component
    label="Small"
    input-id="sm1"
    size="sm"
    prepend
  >
    <span slot="prepend">@</span>
  </plumage-input-group-component>

  <plumage-input-group-component
    label="Default"
    input-id="df1"
    prepend
  >
    <span slot="prepend">@</span>
  </plumage-input-group-component>

  <plumage-input-group-component
    label="Large"
    input-id="lg1"
    size="lg"
    prepend
  >
    <span slot="prepend">@</span>
  </plumage-input-group-component>
</div>
`;

export const HorizontalLayout = () => `
<div style="max-width: 720px;">
  <plumage-input-group-component
    label="Domain"
    input-id="domain1"
    form-layout="horizontal"
    label-align="right"
    label-size="lg"
    prepend
    append
    label-col="3"
    input-col="9"
  >
    <span slot="prepend">https://</span>
    <span slot="append">.gov</span>
  </plumage-input-group-component>

  <plumage-input-group-component
    label="Responsive Grid"
    input-id="domain2"
    form-layout="horizontal"
    label-align="right"
    label-cols="col-12 col-sm-4"
    input-cols="col-12 col-sm-8"
    prepend
  >
    <span slot="prepend">https://</span>
  </plumage-input-group-component>
</div>
`;

export const InlineLayout = () => `
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <plumage-input-group-component
    label="City"
    input-id="city1"
    form-layout="inline"
    size="sm"
  ></plumage-input-group-component>

  <plumage-input-group-component
    label="State"
    input-id="state1"
    form-layout="inline"
    size="sm"
    prepend
  >
    <span slot="prepend">US-</span>
  </plumage-input-group-component>
</div>
`;

export const SearchVariant = () => `
<div style="max-width: 560px;">
  <plumage-input-group-component
    input-id="search1"
    plumage-search
    placeholder="Search datasets"
  ></plumage-input-group-component>
</div>
`;

export const LegacyAttributes = () => `
<div style="max-width: 520px;">
  <!-- Uses legacy attribute names: prepend-field / append-field -->
  <plumage-input-group-component
    label="Handle"
    input-id="legacy1"
    prepend-field
    append-field
  >
    <span slot="prepend">@</span>
    <span slot="append">.org</span>
  </plumage-input-group-component>
</div>
`;
