/* eslint-disable no-unused-vars */
export default {
  title: 'Form/Toggle Switch',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single or multi toggle (Bootstrap-style or custom) with validation, sizes, inline layout, and event emission (`checkedChanged`).',
      },
    },
  },
  argTypes: {
    // ---- Demo aids (not component props) ----
    demoWidth: { control: { type: 'number', min: 180, step: 10 }, description: 'Wrapper width (px).' },
    showEventLog: { control: 'boolean', description: 'Show live event log for checkedChanged.' },

    // ---- Component props ----
    inputId: { control: 'text', name: 'input-id' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    labelTxt: { control: 'text', name: 'label-txt' },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'] },
    inline: { control: 'boolean' },
    value: { control: 'text' },
    toggleTxt: { control: 'boolean', name: 'toggle-txt' },
    newToggleTxt: {
      control: 'object',
      description: `{ on: string; off: string } (set via property)`,
      table: { type: { summary: '{ on: string; off: string }' } },
    },
    validation: { control: 'boolean' },
    validationMessage: { control: 'text', name: 'validation-message' },

    switches: { control: 'boolean', description: 'Enable multi-switch mode.' },
    customSwitch: { control: 'boolean', name: 'custom-switch', description: 'Use Custom styling vs Bootstrap.' },
    switchesArray: {
      control: 'object',
      description: 'Array<ToggleItem> (set via property in multi mode).',
      table: {
        type: {
          summary:
            `Array<{ id: string; label: string; value?: string; checked?: boolean; disabled?: boolean; required?: boolean; validation?: boolean; validationMessage?: string; toggleTxt?: boolean; newToggleTxt?: {on:string;off:string}; size?: ""|"sm"|"lg" }>`
        },
      },
    },
  },
};

/* helpers */
const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, v) =>
  v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`;

/* Base template: renders the element and wires properties + event log */
const Template = (args) => {
  const id = args.inputId && args.inputId.trim() ? args.inputId : `toggle-${Math.random().toString(36).slice(2)}`;
  const w = Number.isFinite(args.demoWidth) ? `style="max-width:${args.demoWidth}px"` : '';

  // single vs multi markup is the same tag; multi is controlled by props + .switchesArray assignment
  const markup = `
<div ${w}>
  <div style="margin-bottom:10px; font-size:.875rem; color:var(--sbtext, #444)">${args.customSwitch ? 'Custom switch' : 'Bootstrap switch'}${args.switches ? ' (multi)' : ' (single)'} demo</div>

  <toggle-switch-component
    id="${id}"
    ${attr('input-id', id)}
    ${attr('label-txt', args.labelTxt)}
    ${attr('size', args.size)}
    ${attr('value', args.value)}
    ${attr('validation-message', args.validationMessage)}
    ${boolAttr('checked', !!args.checked)}
    ${boolAttr('disabled', !!args.disabled)}
    ${boolAttr('required', !!args.required)}
    ${boolAttr('inline', !!args.inline)}
    ${boolAttr('toggle-txt', !!args.toggleTxt)}
    ${boolAttr('validation', !!args.validation)}
    ${boolAttr('switches', !!args.switches)}
    ${boolAttr('custom-switch', !!args.customSwitch)}
  ></toggle-switch-component>

  ${args.showEventLog ? `<div style="margin-top:12px"><strong>checkedChanged</strong> event: <pre id="${id}-log" style="background:#f7f7f8;padding:8px;border-radius:6px;white-space:pre-wrap;margin:6px 0 0"></pre></div>` : ''}

  <script>
    (function(){
      const el = document.getElementById('${id}');
      if (!el) return;

      // Complex props must be applied as properties (not attributes)
      try {
        el.newToggleTxt = ${JSON.stringify(args.newToggleTxt || { on: 'On', off: 'Off' })};
      } catch(_) {}

      if (${!!args.switches}) {
        try { el.switchesArray = ${JSON.stringify(args.switchesArray || [])}; } catch(_) {}
      }

      // Live event log (optional)
      ${args.showEventLog
        ? `
      const out = document.getElementById('${id}-log');
      if (out) out.textContent = '(waiting...)';
      if (!el._wiredLog) {
        el._wiredLog = true;
        el.addEventListener('checkedChanged', (ev) => {
          try {
            const txt = JSON.stringify(ev.detail, null, 2);
            if (out) out.textContent = txt;
          } catch(e) {}
        });
      }
      `
        : ''
      }
    })();
  </script>
</div>`.trim();

  return markup;
};

/* ====== Stories ====== */

const sampleMulti = [
  { id: 'wifi', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
  { id: 'bt', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
  { id: 'air', label: 'Airplane Mode', value: 'air', disabled: false },
];

export const Single_Bootstrap = Template.bind({});
Single_Bootstrap.args = {
  demoWidth: 420,
  showEventLog: true,

  // component props
  inputId: 'demo-toggle-single',
  labelTxt: 'Enable notifications',
  checked: false,
  disabled: false,
  required: false,
  size: '',
  inline: false,
  value: 'notifications',
  toggleTxt: true,
  newToggleTxt: { on: 'On', off: 'Off' },
  validation: false,
  validationMessage: '',

  switches: false,
  customSwitch: false,
};

export const Single_Custom = Template.bind({});
Single_Custom.args = {
  ...Single_Bootstrap.args,
  inputId: 'demo-toggle-custom',
  customSwitch: true,
  size: 'lg',
  labelTxt: 'Use custom theme',
  toggleTxt: true,
  newToggleTxt: { on: 'Enabled', off: 'Disabled' },
};

export const Single_WithValidation = Template.bind({});
Single_WithValidation.args = {
  ...Single_Bootstrap.args,
  required: true,
  validation: true,
  validationMessage: 'This switch is required.',
  labelTxt: 'Accept terms',
};

export const Multi_Bootstrap = Template.bind({});
Multi_Bootstrap.args = {
  demoWidth: 520,
  showEventLog: true,

  // multi
  switches: true,
  switchesArray: sampleMulti,

  // shared
  inputId: 'settings-group',
  customSwitch: false,
  inline: false,
  size: '',
  toggleTxt: false,
  newToggleTxt: { on: 'On', off: 'Off' },
};

export const Multi_Custom_Inline_Sizes = Template.bind({});
Multi_Custom_Inline_Sizes.args = {
  ...Multi_Bootstrap.args,
  customSwitch: true,
  inline: true,
  size: 'sm',
  switchesArray: [
    { id: 'loc', label: 'Location', value: 'loc', checked: true, size: 'sm', toggleTxt: true },
    { id: 'cam', label: 'Camera', value: 'cam', checked: false, size: '', toggleTxt: true, newToggleTxt: { on: 'Yes', off: 'No' } },
    { id: 'mic', label: 'Microphone', value: 'mic', checked: false, size: 'lg' },
  ],
};

export const Multi_WithValidation = Template.bind({});
Multi_WithValidation.args = {
  ...Multi_Bootstrap.args,
  switchesArray: [
    { id: 't1', label: 'Primary', value: 'p', checked: true, required: true, validation: true },
    { id: 't2', label: 'Secondary (required)', value: 's', checked: false, required: true, validation: true, validationMessage: 'Please enable Secondary.' },
    { id: 't3', label: 'Optional', value: 'o', checked: false },
  ],
};
