// src/stories/toggle-switch-component.stories.js
/* eslint-disable no-unused-vars */

/* ------------------------------------------------------------------
 * Storybook: Toggle Switch
 * - Docs/source preview: HTML, no blank lines, stable formatting
 * - Docs preview includes property-only args via a tiny <script> (switchesArray)
 * - newToggleTxt is now supported as an ATTRIBUTE: new-toggle-txt='{"on":"A","off":"B"}'
 * - Canvas demo: returns DOM nodes (no inline <script>) so wiring always runs
 * ------------------------------------------------------------------ */

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
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    demoWidth: {
      control: { type: 'number', min: 180, step: 10 },
      table: { category: 'Storybook Only' },
      description: 'Wrapper width (px). Used for displaying in Storybook.',
    },
    showEventLog: {
      control: 'boolean',
      table: { category: 'Storybook Only', defaultValue: { summary: false } },
      description: 'Show live event log for checkedChanged. Used for displaying in Storybook.',
    },

    inline: { control: 'boolean', table: { category: 'Layout', defaultValue: { summary: false } }, description: 'Inline layout (multi mode only).' },

    checked: { control: 'boolean', table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } }, description: 'Checked state (single mode) or initial checked state (multi mode).' },
    customSwitch: { control: 'boolean', name: 'custom-switch', table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } }, description: 'Use custom switch style.'},
    disabled: { control: 'boolean', table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } }, description: 'Disable the toggle switch.' },
    inputId: { control: 'text', name: 'input-id', table: { category: 'Toggle Switch Attribute' }, description: 'ID for the input element.' },
    labelTxt: { control: 'text', name: 'label-txt', table: { category: 'Toggle Switch Attribute' }, description: 'Label text for the toggle switch.' },
    newToggleTxt: {
      control: 'object',
      table: { category: 'Toggle Switch Attribute' },
      description: 'Toggle text to show changes when toggling. Now also supported as attribute via `new-toggle-txt` (JSON).',
    },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], table: { category: 'Toggle Switch Attribute' }, description: 'Size of the toggle switch that can be set to `sm`, `lg`, or leave blank for default.' },
    switches: { control: 'boolean', table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } }, description: 'Multi mode (array of toggle switches). If false, renders a single toggle switch.' },
    switchesArray: {
      control: 'object',
      table: { category: 'Toggle Switch Attribute' },
      description: 'Multi mode items (property-only; set in JS).',
    },
    toggleTxt: { control: 'boolean', name: 'toggle-txt', table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } }, description: 'Show toggle text (on/off) based on checked state.' },
    value: { control: 'text', table: { category: 'Toggle Switch Attribute' }, description: 'Value of the toggle switch (single mode) or value prefix for multi mode (optional).' },

    required: { control: 'boolean', table: { category: 'Validation', defaultValue: { summary: false } }, description: 'Mark the toggle switch as required.' },
    validation: { control: 'boolean', table: { category: 'Validation', defaultValue: { summary: false } }, description: 'Enable validation for the toggle switch.' },
    validationMessage: { control: 'text', name: 'validation-message', table: { category: 'Validation' }, description: 'Validation message to display when the toggle switch is invalid.' },
  },
};

/* =========================
 * Docs helpers (NO blanks)
 * ========================= */

const normalize = (txt) => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      prevBlank = true;
      out.push('');
      continue;
    }
    prevBlank = false;
    out.push(line);
  }

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${esc(v)}"`))
    .join('\n    ');

// JSON-in-attribute helper (single-quoted)
const jsonAttrLine = (name, obj) => {
  if (!obj || typeof obj !== 'object') return '';
  let json = '{}';
  try {
    json = JSON.stringify(obj);
  } catch (_e) {
    json = '{}';
  }
  // keep JSON double-quotes; escape single quotes only
  json = json.replace(/'/g, '&#39;');
  return `${name}='${json}'`;
};

/**
 * Docs preview should reflect ALL story args.
 * - newToggleTxt is now supported as ATTRIBUTE via `new-toggle-txt='{"on":"A","off":"B"}'`
 * - switchesArray remains property-only, so we include a tiny <script> when switches=true
 */
const buildDocsHtml = (args) => {
  const id = (args.inputId && String(args.inputId).trim()) || 'toggle-demo';

  const hasNewToggleTxt = args.newToggleTxt && typeof args.newToggleTxt === 'object';
  const hasSwitchesArray = !!args.switches && Array.isArray(args.switchesArray);

  const newToggleTxtLine = hasNewToggleTxt ? jsonAttrLine('new-toggle-txt', args.newToggleTxt) : '';

  const switchesScript = hasSwitchesArray
    ? normalize(`
<script>
  (function () {
    var el = document.getElementById('${esc(id)}');
    if (!el) return;
    el.switchesArray = ${JSON.stringify(args.switchesArray || [])};
  })();
</script>
`)
    : '';

  return normalize(`
<div${Number.isFinite(args.demoWidth) ? ` style="max-width:${args.demoWidth}px"` : ''}>
  <toggle-switch-component
    ${attrLines([
      ['id', id],
      ['input-id', id],
      ['label-txt', args.labelTxt],
      ['size', args.size],
      ['value', args.value],
      ['validation-message', args.validationMessage],
      ['checked', !!args.checked],
      ['custom-switch', !!args.customSwitch],
      ['disabled', !!args.disabled],
      ['inline', !!args.inline],
      ['required', !!args.required],
      ['switches', !!args.switches],
      ['toggle-txt', !!args.toggleTxt],
      ['validation', !!args.validation],
    ])}
    ${newToggleTxtLine ? newToggleTxtLine : ''}
  ></toggle-switch-component>
  ${switchesScript ? switchesScript.replace(/\n/g, '\n  ') : ''}
</div>
`);
};

/* =========================
 * Runtime render (DOM node)
 * ========================= */

const renderToggle = (args) => {
  const wrap = document.createElement('div');
  if (Number.isFinite(args.demoWidth)) wrap.style.maxWidth = `${args.demoWidth}px`;

  const title = document.createElement('div');
  title.style.marginBottom = '10px';
  title.style.fontSize = '.875rem';
  title.style.color = 'var(--sbtext, #444)';
  title.textContent = `${args.customSwitch ? 'Custom switch' : 'Bootstrap switch'}${args.switches ? ' (multi)' : ' (single)'} demo`;

  const el = document.createElement('toggle-switch-component');

  // Stable id
  const id = (args.inputId && String(args.inputId).trim()) || `toggle-${Math.random().toString(36).slice(2)}`;
  el.id = id;
  el.setAttribute('input-id', id);

  // attrs (simple)
  if (args.labelTxt != null) el.setAttribute('label-txt', String(args.labelTxt));
  if (args.size) el.setAttribute('size', args.size);
  if (args.value) el.setAttribute('value', args.value);
  if (args.validationMessage) el.setAttribute('validation-message', args.validationMessage);

  // booleans (presence)
  if (args.checked) el.setAttribute('checked', '');
  else el.removeAttribute('checked');

  if (args.customSwitch) el.setAttribute('custom-switch', '');
  else el.removeAttribute('custom-switch');

  if (args.disabled) el.setAttribute('disabled', '');
  else el.removeAttribute('disabled');

  if (args.inline) el.setAttribute('inline', '');
  else el.removeAttribute('inline');

  if (args.required) el.setAttribute('required', '');
  else el.removeAttribute('required');

  if (args.switches) el.setAttribute('switches', '');
  else el.removeAttribute('switches');

  if (args.toggleTxt) el.setAttribute('toggle-txt', '');
  else el.removeAttribute('toggle-txt');

  if (args.validation) el.setAttribute('validation', '');
  else el.removeAttribute('validation');

  // ✅ newToggleTxt now supported as attribute: new-toggle-txt='{"on":"A","off":"B"}'
  if (args.newToggleTxt && typeof args.newToggleTxt === 'object') {
    try {
      el.setAttribute('new-toggle-txt', JSON.stringify(args.newToggleTxt));
    } catch (_e) {
      // ignore
    }
  } else {
    el.removeAttribute('new-toggle-txt');
  }

  // props (complex)
  if (args.switches) {
    el.switchesArray = Array.isArray(args.switchesArray) ? args.switchesArray : [];
  } else {
    el.switchesArray = [];
  }

  // event log
  let pre = null;
  if (args.showEventLog) {
    const box = document.createElement('div');
    box.style.marginTop = '12px';

    const strong = document.createElement('strong');
    strong.textContent = 'checkedChanged event:';

    pre = document.createElement('pre');
    pre.style.background = '#f7f7f8';
    pre.style.padding = '8px';
    pre.style.borderRadius = '6px';
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.margin = '6px 0 0';
    pre.textContent = '(click toggle)';

    box.appendChild(strong);
    box.appendChild(pre);

    wrap.appendChild(title);
    wrap.appendChild(el);
    wrap.appendChild(box);
  } else {
    wrap.appendChild(title);
    wrap.appendChild(el);
  }

  // Wire once per element instance
  if (!el._wiredStory) {
    el._wiredStory = true;

    el.addEventListener('checkedChanged', (ev) => {
      const detail = ev?.detail;

      if (pre) {
        try {
          pre.textContent = JSON.stringify(detail, null, 2);
        } catch {
          pre.textContent = String(detail);
        }
      }

      // keep UI in sync if consumer treats this as controlled
      if (detail && typeof detail.checked === 'boolean') {
        el.checked = detail.checked;
        if (detail.checked) el.setAttribute('checked', '');
        else el.removeAttribute('checked');
      }
    });
  }

  return wrap;
};

/* =========================
 * Stories
 * ========================= */

const sampleMulti = [
  { id: 'wifi', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
  { id: 'bt', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
  { id: 'air', label: 'Airplane Mode', value: 'air', disabled: false },
];

export const Single_Bootstrap = {
  render: (args) => renderToggle(args),
  args: {
    demoWidth: 420,
    showEventLog: true,
    inputId: 'demo-toggle-single',
    labelTxt: 'Enable notifications',
    checked: false,
    customSwitch: false,
    disabled: false,
    inline: false,
    required: false,
    size: '',
    switches: false,
    switchesArray: [],
    toggleTxt: true,
    newToggleTxt: { on: 'On', off: 'Off' },
    validation: false,
    validationMessage: '',
    value: 'notifications',
  },
};
Single_Bootstrap.storyName = 'Single Toggle Switch (Bootstrap)';
Single_Bootstrap.parameters = {
  docs: {
    description: {
      story: 'A single toggle switch using the default Bootstrap styles.',
    },
  },
};

export const Single_WithValidation = {
  render: (args) => renderToggle(args),
  args: {
    ...Single_Bootstrap.args,
    inputId: 'demo-toggle-required',
    required: true,
    validation: true,
    validationMessage: 'This switch is required.',
    labelTxt: 'Accept terms',
  },
};
Single_WithValidation.storyName = 'Single Toggle Switch, with Required and Validation (Bootstrap)';
Single_WithValidation.parameters = {
  docs: {
    description: {
      story: 'A single toggle switch using with `required` and `validation` enabled.',
    },
  },
};


export const Single_Custom = {
  render: (args) => renderToggle(args),
  args: {
    ...Single_Bootstrap.args,
    inputId: 'demo-toggle-custom',
    customSwitch: true,
    disabled: false,
    size: '',
    labelTxt: 'Use custom theme',
    toggleTxt: true,
    newToggleTxt: { on: 'Enabled', off: 'Disabled' },
    required: false,
    validation: false,
    validationMessage: '',
  },
};
Single_Custom.storyName = 'Single Toggle Switch (Custom)';
Single_Custom.parameters = {
  docs: {
    description: {
      story: 'A single custom toggle switch.',
    },
  },
};

export const Single_Custom_Required = {
  render: (args) => renderToggle(args),
  args: {
    ...Single_Bootstrap.args,
    inputId: 'demo-toggle-custom-required',
    customSwitch: true,
    disabled: false,
    size: '',
    labelTxt: 'Use custom theme',
    toggleTxt: true,
    newToggleTxt: { on: 'Enabled', off: 'Disabled' },
    required: true,
    validation: true,
    validationMessage: 'Please enable this switch.',
  },
};
Single_Custom_Required.storyName = 'Single Toggle Switch, with Required and Validation (Custom)';
Single_Custom_Required.parameters = {
  docs: {
    description: {
      story: 'A single custom toggle switch using with `required` and `validation` enabled.',
    },
  },
};



export const Multi_Bootstrap = {
  render: (args) => renderToggle(args),
  args: {
    demoWidth: 520,
    showEventLog: true,
    switches: true,
    switchesArray: sampleMulti,
    inputId: 'settings-group',
    customSwitch: false,
    inline: true,
    size: '',
    toggleTxt: false,
    newToggleTxt: { on: 'On', off: 'Off' },
    required: false,
    validation: false,
    validationMessage: '',
    value: '',
    checked: false,
    disabled: false,
    labelTxt: '',
  },
};
Multi_Bootstrap.storyName = 'Multiple Inline Toggle Switches (Bootstrap)';
Multi_Bootstrap.parameters = {
  docs: {
    description: {
      story: 'A group of toggle switches using the default Bootstrap styles.',
    },
  },
};

export const Multi_Custom_Inline_Sizes = {
  render: (args) => renderToggle(args),
  args: {
    ...Multi_Bootstrap.args,
    inputId: 'settings-inline-sizes',
    customSwitch: true,
    inline: true,
    size: '',
    switchesArray: [
      { id: 'loc', label: 'Location', value: 'loc', checked: true, size: 'sm', toggleTxt: true },
      { id: 'cam', label: 'Camera', value: 'cam', checked: false, size: '', toggleTxt: true, newToggleTxt: { on: 'Yes', off: 'No' }, required: true, validation: true, validationMessage: 'Please enable.' },
      { id: 'mic', label: 'Microphone', value: 'mic', checked: false, size: 'lg', disabled: true },
    ],
  },
};
Multi_Custom_Inline_Sizes.storyName = 'Multiple Switches, Inline, Sizes and Disabled (Custom)';
Multi_Custom_Inline_Sizes.parameters = {
  docs: {
    description: {
      story: 'A group of custom toggle switches in inline layout with different sizes and a disabled switch.',
    },
  },
};

export const Multi_WithValidation = {
  render: (args) => renderToggle(args),
  args: {
    ...Multi_Bootstrap.args,
    inputId: 'settings-validated',
    inline: false,
    switchesArray: [
      { id: 't1', label: 'Primary', value: 'p', checked: true, required: true, validation: true, validationMessage: 'Please enable Primary.' },
      { id: 't2', label: 'Secondary (required)', value: 's', checked: false, required: true, validation: true, validationMessage: 'Please enable Secondary.' },
      { id: 't3', label: 'Optional', value: 'o', checked: false, disabled: true },
    ],
  },
};
Multi_WithValidation.storyName = 'Multiple Toggle Switches using Required, Validation and Disabled (Bootstrap)';
Multi_WithValidation.parameters = {
  docs: {
    description: {
      story: 'A group of toggle switches with validation enabled and disabled.',
    },
  },
};
