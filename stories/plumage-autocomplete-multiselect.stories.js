/* ------------------------------------------------------------------
 * Storybook: Plumage Autocomplete – Multiselect
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Plumage Autocomplete Multiselect',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Plumage-styled multiselect autocomplete with badges, keyboard navigation (arrows/Home/End/PageUp/PageDown/Escape), optional adding/deleting user options, and responsive layouts (stacked, horizontal, inline).',
      },
    },
  },
  argTypes: {
    // Core
    inputId: { control: 'text', table: { category: 'Props' } },
    label: { control: 'text', table: { category: 'Props' } },
    placeholder: { control: 'text', table: { category: 'Props' } },

    // Dataset
    options: { control: 'object', table: { category: 'Data' }, description: 'Array of strings (set via script).' },
    autoSort: { control: 'boolean', table: { category: 'Data' } },
    editable: { control: 'boolean', table: { category: 'Data' }, description: 'Allow adding/deleting options.' },

    // Behavior
    required: { control: 'boolean', table: { category: 'Validation' } },
    validation: { control: 'boolean', table: { category: 'Validation' } },
    validationMessage: { control: 'text', table: { category: 'Validation' } },
    error: { control: 'boolean', table: { category: 'Validation' } },
    errorMessage: { control: 'text', table: { category: 'Validation' } },

    // UI
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], table: { category: 'UI' } },
    disabled: { control: 'boolean', table: { category: 'UI' } },
    removeClearBtn: { control: 'boolean', table: { category: 'UI' } },
    clearIcon: { control: 'text', table: { category: 'UI' } },

    // Add-btn & preserve/clear behaviors
    addBtn: { control: 'boolean', table: { category: 'Add/Preserve' } },
    addIcon: { control: 'text', table: { category: 'Add/Preserve' } },
    preserveInputOnSelect: { control: 'boolean', table: { category: 'Add/Preserve' } },
    clearInputOnBlurOutside: { control: 'boolean', table: { category: 'Add/Preserve' } },

    // Labels & layout
    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'], table: { category: 'Layout' } },
    labelHidden: { control: 'boolean', table: { category: 'Layout' } },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'], table: { category: 'Layout' } },
    labelSize: { control: { type: 'select' }, options: ['base', 'xs', 'sm', 'lg'], table: { category: 'Layout' } },
    labelCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    inputCol: { control: { type: 'number', min: 0, max: 12 }, table: { category: 'Layout' } },
    labelCols: { control: 'text', table: { category: 'Layout' }, description: 'e.g. "col-12 col-sm-4"' },
    inputCols: { control: 'text', table: { category: 'Layout' }, description: 'e.g. "col-12 col-sm-8"' },

    // Badges
    badgeVariant: { control: 'text', table: { category: 'Badges' }, description: 'e.g. "primary", "success", etc. (text-bg-*)' },
    badgeShape: { control: 'text', table: { category: 'Badges' }, description: 'Custom class for pill/rounded.' },
    badgeInlineStyles: { control: 'text', table: { category: 'Badges' }, description: 'Inline CSS, e.g. "border-radius:12px;"' },

    // Hidden field names
    name: { control: 'text', table: { category: 'Form data' }, description: 'Hidden inputs for selected items (as array).' },
    rawInputName: { control: 'text', table: { category: 'Form data' }, description: 'Hidden input for raw typed text.' },

    // Misc
    type: { control: 'text', table: { category: 'Advanced' } },
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

// Inject complex props + wire events (after Stencil hydration)
const hydrate = (id, args) => `
<script>
  (function () {
    var el = document.getElementById('${id}');
    if (!el || el._wired) return;

    // Initial options
    try {
      var opts = ${JSON.stringify(args.options ?? [])};
      if (Array.isArray(opts)) {
        // use public API setOptions for consistency
        el.componentOnReady?.().then(function(){ el.setOptions(opts); });
      }
    } catch (e) { console.warn('[plumage-multiselect story] options hydration failed:', e); }

    // Event logs
    el.addEventListener('multiSelectChange', function(e){ console.log('[multiSelectChange]', e.detail); });
    el.addEventListener('optionsChange', function(e){ console.log('[optionsChange]', e.detail); });
    el.addEventListener('itemSelect', function(e){ console.log('[itemSelect]', e.detail); });
    el.addEventListener('clear', function(){ console.log('[clear]'); });

    el._wired = true;
  })();
</script>
`;

/* ---------- base template ---------- */

const Template = (args) => {
  const id = args._id || args.inputId || 'plumage-ac-multi';
  return `
<plumage-autocomplete-multiselect-component
  id="${id}"
  ${attr('input-id', args.inputId)}
  ${attr('label', args.label)}
  ${attr('placeholder', args.placeholder)}
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

  ${attr('add-btn', args.addBtn)}
  ${attr('add-icon', args.addIcon)}
  ${attr('editable', args.editable)}
  ${attr('auto-sort', args.autoSort)}
  ${attr('preserve-input-on-select', args.preserveInputOnSelect)}
  ${attr('clear-input-on-blur-outside', args.clearInputOnBlurOutside)}

  ${attr('badge-shape', args.badgeShape)}
  ${attr('badge-inline-styles', args.badgeInlineStyles)}

  ${attr('name', args.name)}
  ${attr('raw-input-name', args.rawInputName)}

  ${attr('type', args.type || 'text')}
  ${attr('form-id', args.formId)}
  ${attr('dev-mode', args.devMode)}
  ${attr('arialabelled-by', args.arialabelledBy)}
></plumage-autocomplete-multiselect-component>
${hydrate(id, args)}
`.trim();
};

/* ---------- sample data ---------- */

const FRUIT = [
  'Apple','Apparatus','Apple Pie','Applegate','Apricot',
  'Banana','Blackberry','Blueberry','Cherry','Clementine',
  'Date','Dragonfruit','Grape','Grapefruit','Kiwi',
  'Lemon','Lime','Mango','Orange','Papaya','Peach','Pear','Pineapple','Plum','Strawberry'
];

/* ---------- Stories ---------- */

export const Playground = Template.bind({});
Playground.args = {
  _id: 'acm_playground',
  inputId: 'acm-playground',
  label: 'Autocomplete Multiselect',
  placeholder: 'Type to search...',
  options: FRUIT,

  // Behavior
  required: false,
  validation: false,
  validationMessage: 'Please select at least one item or type 3+ characters.',
  error: false,
  errorMessage: '',

  // UI
  size: '',
  disabled: false,
  removeClearBtn: false,
  clearIcon: 'fa-solid fa-xmark',

  // Add/preserve behavior
  editable: true,
  addBtn: true,
  addIcon: 'fas fa-plus',
  autoSort: true,
  preserveInputOnSelect: false,
  clearInputOnBlurOutside: false,

  // Layout
  formLayout: '',
  labelHidden: false,
  labelAlign: '',
  labelSize: 'sm',
  labelCol: 2,
  inputCol: 10,
  labelCols: '',
  inputCols: '',

  // Badges
  // badgeVariant: 'primary',
  badgeShape: 'rounded-pill',
  badgeInlineStyles: '',

  // Form data
  name: 'fruits[]',
  rawInputName: 'fruits_raw',

  // Misc
  devMode: false,
  arialabelledBy: '',
};

export const Sizes = () => `
<div style="display:grid; gap:14px; max-width:760px;">
  <plumage-autocomplete-multiselect-component id="acm_sm" input-id="acm-sm" size="sm" label="Small" editable add-btn></plumage-autocomplete-multiselect-component>
  <plumage-autocomplete-multiselect-component id="acm_md" input-id="acm-md" label="Default" editable add-btn></plumage-autocomplete-multiselect-component>
  <plumage-autocomplete-multiselect-component id="acm_lg" input-id="acm-lg" size="lg" label="Large" editable add-btn></plumage-autocomplete-multiselect-component>
  <script>
    (function(){
      ['acm_sm','acm_md','acm_lg'].forEach(function(id){
        var el = document.getElementById(id); if(!el) return;
        el.componentOnReady?.().then(function(){ el.setOptions(${JSON.stringify(FRUIT)}); });
      });
    })();
  </script>
</div>
`;

export const RequiredValidation = () => `
<div style="max-width:640px;">
  <plumage-autocomplete-multiselect-component
    id="acm_req"
    input-id="acm-required"
    label="Favorite Fruits"
    required
    validation
    validation-message="Pick at least one fruit or type 3+ characters"
    editable
    add-btn
    badge-shape="rounded-pill"
  ></plumage-autocomplete-multiselect-component>
  <script>
    (function(){
      var el = document.getElementById('acm_req'); if(!el) return;
      el.componentOnReady?.().then(function(){ el.setOptions(${JSON.stringify(FRUIT)}); });
    })();
  </script>
</div>
`;

export const HorizontalLayout = () => `
<div style="max-width: 900px;">
  <plumage-autocomplete-multiselect-component
    id="acm_hz"
    input-id="acm-horizontal"
    label="Organizations"
    form-layout="horizontal"
    label-align="right"
    label-size="lg"
    label-col="3"
    input-col="9"
    placeholder="Start typing..."
    editable
    add-btn
  ></plumage-autocomplete-multiselect-component>
  <script>
    (function(){
      var el = document.getElementById('acm_hz'); if(!el) return;
      el.setOptions(['Acme, Inc.','Acme Labs','Alpha Co','Beta Corp','Delta Systems','Epsilon Partners','Gamma Group']);
    })();
  </script>
</div>
`;

export const InlineLayout = () => `
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <plumage-autocomplete-multiselect-component
    id="acm_inline1"
    input-id="acm-inline-1"
    label="Cities"
    form-layout="inline"
    size="sm"
    editable
    add-btn
  ></plumage-autocomplete-multiselect-component>

  <plumage-autocomplete-multiselect-component
    id="acm_inline2"
    input-id="acm-inline-2"
    label="States"
    form-layout="inline"
    size="sm"
  ></plumage-autocomplete-multiselect-component>

  <script>
    (function(){
      var cities = document.getElementById('acm_inline1');
      var states = document.getElementById('acm_inline2');
      if (cities) cities.setOptions(['Austin','Boston','Chicago','Denver','Los Angeles','New York','Portland','Seattle','San Francisco']);
      if (states) states.setOptions(['AL','AK','AZ','CA','CO','FL','GA','IL','MA','NY','OR','TX','WA']);
    })();
  </script>
</div>
`;

export const Disabled = () => `
<plumage-autocomplete-multiselect-component
  id="acm_disabled"
  input-id="acm-disabled"
  label="Disabled"
  disabled
></plumage-autocomplete-multiselect-component>
<script>
  (function(){
    var el = document.getElementById('acm_disabled'); if(!el) return;
    el.setOptions(${JSON.stringify(FRUIT)});
  })();
</script>
`;

export const EditableWithAddAndDelete = () => `
<div style="max-width:680px;">
  <p style="margin:0 0 8px;opacity:.75;">Enter creates new options (when no exact match). Right/Left inside a focused row toggles virtual focus to delete button; Enter deletes (user-added only).</p>
  <plumage-autocomplete-multiselect-component
    id="acm_edit"
    input-id="acm-editable"
    label="Tags"
    editable
    add-btn
    add-icon="fas fa-plus"
    preserve-input-on-select
    badge-shape="rounded-pill"
    placeholder="Type to add/select…"
    dev-mode
  ></plumage-autocomplete-multiselect-component>
  <script>
    (function(){
      var el = document.getElementById('acm_edit'); if(!el) return;
      el.setOptions(['Frontend','Backend','Fullstack','DevOps','Data','Design','QA','Product']);
    })();
  </script>
</div>
`;

export const CustomBadges = () => `
<div style="max-width:680px;">
  <plumage-autocomplete-multiselect-component
    id="acm_badges"
    input-id="acm-badges"
    label="With custom badge style"
    editable
    add-btn
    badge-shape="rounded-pill"
    badge-inline-styles="border-radius:14px; font-weight:600;"
  ></plumage-autocomplete-multiselect-component>
  <script>
    (function(){
      var el = document.getElementById('acm_badges'); if(!el) return;
      el.setOptions(${JSON.stringify(FRUIT)});
    })();
  </script>
</div>
`;

export const PreserveAndClearBehavior = () => `
<div style="display:grid; gap:18px; max-width:720px;">
  <div>
    <h4 style="margin:0 0 8px;">Preserve input on select</h4>
    <plumage-autocomplete-multiselect-component
      id="acm_preserve"
      input-id="acm-preserve"
      label="Preserve"
      preserve-input-on-select
      editable
      add-btn
    ></plumage-autocomplete-multiselect-component>
  </div>

  <div>
    <h4 style="margin:16px 0 8px;">Clear input when clicking outside</h4>
    <plumage-autocomplete-multiselect-component
      id="acm_clear_outside"
      input-id="acm-clear-outside"
      label="Clear on outside blur"
      clear-input-on-blur-outside
      editable
      add-btn
    ></plumage-autocomplete-multiselect-component>
  </div>

  <script>
    (function(){
      var a = document.getElementById('acm_preserve');
      var b = document.getElementById('acm_clear_outside');
      var data = ${JSON.stringify(FRUIT)};
      if (a) a.setOptions(data);
      if (b) b.setOptions(data);
    })();
  </script>
</div>
`;

export const ProgrammaticAPI = () => `
<div style="max-width:780px;">
  <plumage-autocomplete-multiselect-component
    id="acm_api"
    input-id="acm-api"
    label="Programmatic API"
    editable
    add-btn
    dev-mode
  ></plumage-autocomplete-multiselect-component>

  <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
    <button id="btn_replace" class="btn btn-sm btn-secondary" type="button">Replace Options</button>
    <button id="btn_read" class="btn btn-sm btn-secondary" type="button">Read Options</button>
    <button id="btn_remove_item" class="btn btn-sm btn-secondary" type="button">Remove "Mango"</button>
  </div>

  <script>
    (function(){
      var el = document.getElementById('acm_api'); if(!el) return;
      el.setOptions(${JSON.stringify(FRUIT)});

      document.getElementById('btn_replace').addEventListener('click', async function(){
        await el.setOptions(['Alpha','Beta','Gamma','Delta']);
      });
      document.getElementById('btn_read').addEventListener('click', async function(){
        const opts = await el.getOptions();
        console.log('[getOptions]', opts);
        alert('Options: ' + opts.join(', '));
      });
      document.getElementById('btn_remove_item').addEventListener('click', async function(){
        await el.removeItem('Mango');
      });
    })();
  </script>
</div>
`;
