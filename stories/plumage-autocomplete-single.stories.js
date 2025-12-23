/* ------------------------------------------------------------------
 * Storybook: Plumage Autocomplete (Single)
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Plumage Autocomplete Single',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Plumage-styled single-select autocomplete with focus underline, keyboard navigation, validation, responsive layouts (stacked, horizontal, inline), and optional clear action.',
      },
    },
  },
  argTypes: {
    /* Core text/behavior */
    inputId: { control: 'text', table: { category: 'Props' } },
    label: { control: 'text', table: { category: 'Props' } },
    value: { control: 'text', table: { category: 'Props' } },
    placeholder: { control: 'text', table: { category: 'Props' } },
    type: { control: 'text', table: { category: 'Props' } },

    /* Dataset */
    options: {
      control: 'object',
      table: { category: 'Data' },
      description: 'Array of option strings. (Applied via script, not as an attribute.)',
    },
    autoSort: {
      control: 'boolean',
      table: { category: 'Data' },
      description: 'Auto-sort options alphabetically (case-insensitive).',
    },

    /* Layout & label */
    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'], table: { category: 'Layout' } },
    labelHidden: { control: 'boolean', table: { category: 'Layout' } },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'], table: { category: 'Layout' } },
    labelSize: { control: { type: 'select' }, options: ['base', 'xs', 'sm', 'lg'], table: { category: 'Layout' } },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], table: { category: 'Layout' } },

    /* Grid (numeric fallback or responsive class specs) */
    labelCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    inputCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    labelCols: { control: 'text', table: { category: 'Layout' }, description: 'e.g. "col-12 col-sm-4"' },
    inputCols: { control: 'text', table: { category: 'Layout' }, description: 'e.g. "col-12 col-sm-8"' },

    /* Validation & error */
    required: { control: 'boolean', table: { category: 'Validation' } },
    validation: { control: 'boolean', table: { category: 'Validation' }, description: 'Externally toggled invalid state.' },
    validationMessage: { control: 'text', table: { category: 'Validation' } },
    error: { control: 'boolean', table: { category: 'Validation' } },
    errorMessage: { control: 'text', table: { category: 'Validation' } },

    /* UI bits */
    disabled: { control: 'boolean', table: { category: 'Behavior' } },
    removeClearBtn: { control: 'boolean', table: { category: 'Behavior' } },
    clearIcon: { control: 'text', table: { category: 'Behavior' }, description: 'FontAwesome or similar, e.g. "fa-solid fa-xmark".' },

    /* Misc */
    formId: { control: 'text', table: { category: 'Advanced' } },
    devMode: { control: 'boolean', table: { category: 'Advanced' } },
    arialabelledBy: { control: 'text', table: { category: 'A11y' } },
  },
};

/* ---------- helpers ---------- */

const attr = (name, v) => {
  if (v === undefined || v === null || v === '' || v === false) return '';
  if (v === true) return ` ${name}`;
  return ` ${name}="${String(v).replace(/"/g, '&quot;')}"`;
};

/** Pass complex props like `options` and wire events in-place. */
const hydrate = (id, args) => `
<script>
  (function () {
    var el = document.getElementById('${id}');
    if (!el || el._wired) return;

    // Apply complex props post-hydration
    try {
      var opts = ${JSON.stringify(args.options ?? [])};
      if (Array.isArray(opts)) el.options = opts;
      if (typeof ${JSON.stringify(args.autoSort)} === 'boolean') el.autoSort = ${JSON.stringify(args.autoSort)};
      if (typeof ${JSON.stringify(args.value)} === 'string') el.value = ${JSON.stringify(args.value)};
    } catch (e) { console.warn('[plumage-autocomplete-single story] options/value hydration failed:', e); }

    // Basic event logs for dev visibility
    el.addEventListener('itemSelect', function(e){ console.log('[itemSelect]', e.detail); });
    el.addEventListener('valueChange', function(e){ console.log('[valueChange]', e.detail); });
    el.addEventListener('clear', function(){ console.log('[clear]'); });

    el._wired = true;
  })();
</script>
`;

/* ---------- base template ---------- */

const Template = (args) => {
  const id = args._id || args.inputId || 'plumage-ac-single';
  return `
<plumage-autocomplete-single
  id="${id}"
  ${attr('input-id', args.inputId)}
  ${attr('label', args.label)}
  ${attr('placeholder', args.placeholder)}
  ${attr('type', args.type || 'text')}
  ${attr('size', args.size)}
  ${attr('form-layout', args.formLayout)}
  ${attr('label-hidden', args.labelHidden)}
  ${attr('label-align', args.labelAlign)}
  ${attr('label-size', args.labelSize)}
  ${attr('label-col', args.labelCol)}
  ${attr('input-col', args.inputCol)}
  ${attr('label-cols', args.labelCols)}
  ${attr('input-cols', args.inputCols)}
  ${attr('required', args.required)}
  ${attr('validation', args.validation)}
  ${attr('validation-message', args.validationMessage)}
  ${attr('error', args.error)}
  ${attr('error-message', args.errorMessage)}
  ${attr('disabled', args.disabled)}
  ${attr('remove-clear-btn', args.removeClearBtn)}
  ${attr('clear-icon', args.clearIcon)}
  ${attr('form-id', args.formId)}
  ${attr('dev-mode', args.devMode)}
  ${attr('arialabelled-by', args.arialabelledBy)}
></plumage-autocomplete-single>
${hydrate(id, args)}
`.trim();
};

/* ---------- Stories ---------- */

const defaultOptions = [
  'Apple','Apparatus','Apple Pie','Applegate','Apricot',
  'Banana','Blueberry','Blackberry','Cherry','Clementine',
  'Grape','Grapefruit','Kiwi','Lemon','Lime','Mango','Orange','Peach','Pear','Pineapple'
];

export const Playground = Template.bind({});
Playground.args = {
  _id: 'ac_playground',
  inputId: 'ac-single-playground',
  label: 'Autocomplete Single',
  placeholder: 'Type 3+ characters…',
  value: '',
  options: defaultOptions,
  autoSort: true,

  /* Layout */
  formLayout: '',
  labelHidden: false,
  labelAlign: '',
  labelSize: 'sm',
  size: '',

  /* Grid */
  labelCol: 2,
  inputCol: 10,
  labelCols: '',
  inputCols: '',

  /* Validation */
  required: false,
  validation: false,
  validationMessage: 'Please type 3 or more characters',
  error: false,
  errorMessage: '',

  /* UI */
  disabled: false,
  removeClearBtn: false,
  clearIcon: 'fa-solid fa-xmark',

  /* Misc */
  formId: '',
  devMode: false,
  arialabelledBy: '',
};

export const Sizes = () => `
<div style="display:grid; gap:14px; max-width:640px;">
  <plumage-autocomplete-single id="ac_sz_sm" input-id="ac-sm" size="sm" label="Small" placeholder="Type to search…"></plumage-autocomplete-single>
  <plumage-autocomplete-single id="ac_sz_md" input-id="ac-md" label="Default" placeholder="Type to search…"></plumage-autocomplete-single>
  <plumage-autocomplete-single id="ac_sz_lg" input-id="ac-lg" size="lg" label="Large" placeholder="Type to search…"></plumage-autocomplete-single>
  <script>
    (function(){
      ['ac_sz_sm','ac_sz_md','ac_sz_lg'].forEach(function(id){
        var el = document.getElementById(id); if(!el) return; el.options = ${JSON.stringify(defaultOptions)};
      });
    })();
  </script>
</div>
`;

export const RequiredValidation = () => `
<div style="max-width:560px;">
  <plumage-autocomplete-single
    id="ac_req"
    input-id="ac-required"
    label="Favorite Fruit"
    required
    validation
    validation-message="Please type 3 or more characters"
    placeholder="Type 3+ chars…"
  ></plumage-autocomplete-single>
  <script>
    (function(){
      var el = document.getElementById('ac_req'); if(!el) return;
      el.options = ${JSON.stringify(defaultOptions)};
    })();
  </script>
</div>
`;

export const HorizontalLayout = () => `
<div style="max-width: 800px;">
  <plumage-autocomplete-single
    id="ac_hz"
    input-id="ac-horizontal"
    label="Organization"
    form-layout="horizontal"
    label-align="right"
    label-size="lg"
    label-col="3"
    input-col="9"
    placeholder="Start typing…"
  ></plumage-autocomplete-single>
  <script>
    (function(){
      var el = document.getElementById('ac_hz'); if(!el) return;
      el.options = ['Acme, Inc.','Acme Labs','Beta Corp','Delta Systems','Epsilon Partners','Gamma Group'];
    })();
  </script>
</div>
`;

export const InlineLayout = () => `
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <plumage-autocomplete-single
    id="ac_inline_city"
    input-id="ac-city"
    label="City"
    form-layout="inline"
    size="sm"
  ></plumage-autocomplete-single>

  <plumage-autocomplete-single
    id="ac_inline_state"
    input-id="ac-state"
    label="State"
    form-layout="inline"
    size="sm"
  ></plumage-autocomplete-single>

  <script>
    (function(){
      var city = document.getElementById('ac_inline_city');
      var state = document.getElementById('ac_inline_state');
      if (city) city.options = ['Austin','Boston','Chicago','Denver','Los Angeles','New York','Portland','Seattle','San Francisco'];
      if (state) state.options = ['AL','AK','AZ','CA','CO','FL','GA','IL','MA','NY','OR','TX','WA'];
    })();
  </script>
</div>
`;

export const Disabled = () => `
<plumage-autocomplete-single
  id="ac_disabled"
  input-id="ac-disabled"
  label="Disabled"
  disabled
  value="Banana"
></plumage-autocomplete-single>
<script>
  (function(){
    var el = document.getElementById('ac_disabled'); if(!el) return;
    el.options = ${JSON.stringify(defaultOptions)};
  })();
</script>
`;

export const ErrorState = () => `
<div style="max-width:560px;">
  <plumage-autocomplete-single
    id="ac_error"
    input-id="ac-error"
    label="With error"
    error
    error-message="Could not fetch suggestions"
    placeholder="Try typing…"
  ></plumage-autocomplete-single>
  <script>
    (function(){
      var el = document.getElementById('ac_error'); if(!el) return;
      // keep options empty to emphasize error UI
      el.options = [];
    })();
  </script>
</div>
`;

export const WithCustomClearIcon = () => `
<div style="max-width:560px;">
  <plumage-autocomplete-single
    id="ac_clear_icon"
    input-id="ac-clear-icon"
    label="Search"
    clear-icon="fa-solid fa-xmark"
    placeholder="Type to search…"
  ></plumage-autocomplete-single>
  <script>
    (function(){
      var el = document.getElementById('ac_clear_icon'); if(!el) return;
      el.options = ${JSON.stringify(defaultOptions)};
    })();
  </script>
</div>
`;

export const ProgrammaticValue = () => `
<div style="max-width:560px;">
  <plumage-autocomplete-single
    id="ac_prog"
    input-id="ac-prog"
    label="Pre-filled"
    value="Grape"
  ></plumage-autocomplete-single>
  <script>
    (function(){
      var el = document.getElementById('ac_prog'); if(!el) return;
      el.options = ${JSON.stringify(defaultOptions)};
      // Simulate programmatic update later
      setTimeout(function(){ el.value = 'Orange'; }, 1500);
    })();
  </script>
</div>
`;

export const KeyboardNavigation = () => `
<p style="margin-bottom:8px; opacity:.75;">Try Arrow Up/Down, Home/End, PageUp/PageDown, Enter, and Escape.</p>
<plumage-autocomplete-single
  id="ac_keys"
  input-id="ac-keys"
  label="Keyboard Demo"
  placeholder="Type e.g. ap…"
/>
<script>
  (function(){
    var el = document.getElementById('ac_keys'); if(!el) return;
    el.options = ${JSON.stringify(defaultOptions)};
  })();
</script>
`;

export const DevModeLogs = () => `
<plumage-autocomplete-single
  id="ac_dev"
  input-id="ac-dev"
  label="Dev Mode (console logs)"
  dev-mode
  placeholder="Type to see logs…"
/>
<script>
  (function(){
    var el = document.getElementById('ac_dev'); if(!el) return;
    el.options = ${JSON.stringify(defaultOptions)};
  })();
</script>
`;
