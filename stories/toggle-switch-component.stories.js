// src/stories/toggle-switch-component.stories.js
/* eslint-disable no-unused-vars */

/* ------------------------------------------------------------------
 * Storybook: Toggle Switch
 * - Docs/source preview: HTML, no blank lines, stable formatting
 * - Docs preview includes property-only args via a tiny <script> (switchesArray)
 * - newToggleTxt is supported as an ATTRIBUTE: new-toggle-txt='{"on":"A","off":"B"}'
 * - Canvas demo: returns DOM nodes (no inline <script>) so wiring always runs
 * - ✅ Adds Accessibility Matrix story (computed) with examples + printed a11y wiring
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Toggle Switch',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single or multi toggle (Bootstrap-style or custom) with validation, sizes, inline layout, and event emission (`checkedChanged`).\n\n' +
          'Accessibility notes:\n' +
          '- Single switch uses native <input type="checkbox"> with role="switch" and label association via htmlFor/id.\n' +
          '- If label text is empty (single mode), set `aria-label` (prop) for an accessible name.\n' +
          '- Multi-switch group uses role="group"; you can label it via `aria-labelledby` (attribute) pointing to external label element(s).\n' +
          '- Invalid state uses aria-invalid and aria-describedby -> validation message ids derived from input ids.',
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

    /* -----------------------------
     Accessibility
    ------------------------------ */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description:
        'Single mode only: fallback accessible name when `label-txt` is empty. (Prop: `ariaLabel` on the component.)',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description:
        'Multi mode only: label the group wrapper by id(s) of external elements (space-separated).',
    },

    inline: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Inline layout (multi mode only).',
    },

    checked: {
      control: 'boolean',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Checked state (single mode) or initial checked state (multi mode).',
    },
    customSwitch: {
      control: 'boolean',
      name: 'custom-switch',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Use custom switch style.',
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Disable the toggle switch.',
    },
    inputId: { control: 'text', name: 'input-id', table: { category: 'Toggle Switch Attribute' }, description: 'ID for the input element.' },
    labelTxt: { control: 'text', name: 'label-txt', table: { category: 'Toggle Switch Attribute' }, description: 'Label text for the toggle switch.' },
    newToggleTxt: {
      control: 'object',
      table: { category: 'Toggle Switch Attribute' },
      description: 'Toggle text to show changes when toggling. Also supported as attribute via `new-toggle-txt` (JSON).',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Toggle Switch Attribute' },
      description: 'Size of the toggle switch (`sm`, `lg`, or blank for default).',
    },
    switches: {
      control: 'boolean',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Multi mode (array of toggle switches). If false, renders a single toggle switch.',
    },
    switchesArray: {
      control: 'object',
      table: { category: 'Toggle Switch Attribute' },
      description: 'Multi mode items (property-only; set in JS).',
    },
    toggleTxt: {
      control: 'boolean',
      name: 'toggle-txt',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Show toggle text (on/off) based on checked state.',
    },
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
 * - newToggleTxt is supported as ATTRIBUTE via `new-toggle-txt='{"on":"A","off":"B"}'`
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
      // ✅ a11y
      ['aria-label', args.ariaLabel],
      ['aria-labelledby', args.ariaLabelledby],
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

  // ✅ accessibility attrs (pass-through to props)
  if (args.ariaLabel != null && String(args.ariaLabel).trim()) el.setAttribute('aria-label', String(args.ariaLabel));
  else el.removeAttribute('aria-label');

  if (args.ariaLabelledby != null && String(args.ariaLabelledby).trim()) el.setAttribute('aria-labelledby', String(args.ariaLabelledby));
  else el.removeAttribute('aria-labelledby');

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

  // ✅ newToggleTxt supported as attribute JSON
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
    ariaLabel: 'Toggle', // single fallback (used only if labelTxt empty)
    ariaLabelledby: '', // group only
  },
};
Single_Bootstrap.storyName = 'Single Toggle Switch (Bootstrap)';
Single_Bootstrap.parameters = {
  docs: { description: { story: 'A single toggle switch using the default Bootstrap styles.' } },
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
  docs: { description: { story: 'A single toggle switch using with `required` and `validation` enabled.' } },
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
Single_Custom.parameters = { docs: { description: { story: 'A single custom toggle switch.' } } };

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
  docs: { description: { story: 'A single custom toggle switch using with `required` and `validation` enabled.' } },
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
    ariaLabel: 'Toggle',
    ariaLabelledby: '', // group only
  },
};
Multi_Bootstrap.storyName = 'Multiple Inline Toggle Switches (Bootstrap)';
Multi_Bootstrap.parameters = { docs: { description: { story: 'A group of toggle switches using the default Bootstrap styles.' } } };

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
      {
        id: 'cam',
        label: 'Camera',
        value: 'cam',
        checked: false,
        size: '',
        toggleTxt: true,
        newToggleTxt: { on: 'Yes', off: 'No' },
        required: true,
        validation: true,
        validationMessage: 'Please enable.',
      },
      { id: 'mic', label: 'Microphone', value: 'mic', checked: false, size: 'lg', disabled: true },
    ],
  },
};
Multi_Custom_Inline_Sizes.storyName = 'Multiple Switches, Inline, Sizes and Disabled (Custom)';
Multi_Custom_Inline_Sizes.parameters = {
  docs: { description: { story: 'A group of custom toggle switches in inline layout with different sizes and a disabled switch.' } },
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
Multi_WithValidation.parameters = { docs: { description: { story: 'A group of toggle switches with validation enabled and disabled.' } } };

/* =========================================================
   Accessibility Matrix (computed) — WITH EXAMPLES
   ========================================================= */

const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

const resolveId = (root, id) => {
  if (!id) return false;
  try {
    return !!root.querySelector(`#${CSS.escape(id)}`);
  } catch {
    return false;
  }
};

const getSingleSnapshot = (root, host) => {
  const input = host.querySelector('input[type="checkbox"]');
  const label = input ? host.querySelector(`label[for="${CSS.escape(input.id)}"]`) : null;
  const described = input?.getAttribute('aria-describedby') || null;

  return {
    mode: 'single',
    host: { inputIdAttr: host.getAttribute('input-id') || null, custom: host.hasAttribute('custom-switch') },
    input: input
      ? {
          id: input.id || null,
          type: input.getAttribute('type'),
          role: input.getAttribute('role'),
          ariaLabel: input.getAttribute('aria-label'),
          ariaChecked: input.getAttribute('aria-checked'),
          ariaDisabled: input.getAttribute('aria-disabled'),
          ariaRequired: input.getAttribute('aria-required'),
          ariaInvalid: input.getAttribute('aria-invalid'),
          ariaDescribedby: described,
          describedbyIds: splitIds(described),
          describedbyAllResolve: splitIds(described).every((id) => resolveId(root, id)),
        }
      : null,
    label: label
      ? {
          text: label.textContent?.trim() || null,
          for: label.getAttribute('for') || null,
        }
      : null,
    validation: (() => {
      if (!described) return null;
      const ids = splitIds(described);
      const nodes = ids.map((id) => root.querySelector(`#${CSS.escape(id)}`)).filter(Boolean);
      return nodes.map((n) => ({
        id: n.getAttribute('id'),
        role: n.getAttribute('role'),
        ariaLive: n.getAttribute('aria-live'),
        text: (n.textContent || '').trim() || null,
      }));
    })(),
  };
};

const getMultiSnapshot = (root, host) => {
  const group = host.querySelector('[role="group"]');
  const inputs = Array.from(host.querySelectorAll('input[type="checkbox"]'));

  const groupLabelledby = group?.getAttribute('aria-labelledby') || null;
  const groupDescribedby = group?.getAttribute('aria-describedby') || null;

  return {
    mode: 'multi',
    host: { inputIdAttr: host.getAttribute('input-id') || null, inline: host.hasAttribute('inline'), custom: host.hasAttribute('custom-switch') },
    group: group
      ? {
          id: group.getAttribute('id') || null,
          role: group.getAttribute('role'),
          ariaLabelledby: groupLabelledby,
          ariaInvalid: group.getAttribute('aria-invalid'),
          ariaDescribedby: groupDescribedby,
          labelledbyIds: splitIds(groupLabelledby),
          labelledbyAllResolve: splitIds(groupLabelledby).every((id) => resolveId(root, id)),
          describedbyIds: splitIds(groupDescribedby),
          describedbyAllResolve: splitIds(groupDescribedby).every((id) => resolveId(root, id)),
        }
      : null,
    items: inputs.map((input) => {
      const label = host.querySelector(`label[for="${CSS.escape(input.id)}"]`);
      const described = input.getAttribute('aria-describedby') || null;

      return {
        id: input.id || null,
        role: input.getAttribute('role'),
        ariaChecked: input.getAttribute('aria-checked'),
        ariaDisabled: input.getAttribute('aria-disabled'),
        ariaRequired: input.getAttribute('aria-required'),
        ariaInvalid: input.getAttribute('aria-invalid'),
        ariaDescribedby: described,
        describedbyIds: splitIds(described),
        describedbyAllResolve: splitIds(described).every((id) => resolveId(root, id)),
        label: label ? (label.textContent || '').trim() : null,
      };
    }),
  };
};

const snapshotA11y = (root, host) => {
  const isMulti = host.hasAttribute('switches');
  return isMulti ? getMultiSnapshot(root, host) : getSingleSnapshot(root, host);
};

const mountToggle = (args) => {
  const el = document.createElement('toggle-switch-component');

  const id = (args.inputId && String(args.inputId).trim()) || `mx-${Math.random().toString(36).slice(2)}`;
  el.id = id;
  el.setAttribute('input-id', id);

  if (args.labelTxt != null) el.setAttribute('label-txt', String(args.labelTxt));
  if (args.size) el.setAttribute('size', args.size);
  if (args.value) el.setAttribute('value', args.value);
  if (args.validationMessage) el.setAttribute('validation-message', args.validationMessage);

  if (args.ariaLabel != null && String(args.ariaLabel).trim()) el.setAttribute('aria-label', String(args.ariaLabel));
  else el.removeAttribute('aria-label');

  if (args.ariaLabelledby != null && String(args.ariaLabelledby).trim()) el.setAttribute('aria-labelledby', String(args.ariaLabelledby));
  else el.removeAttribute('aria-labelledby');

  if (args.checked) el.setAttribute('checked', '');
  if (args.customSwitch) el.setAttribute('custom-switch', '');
  if (args.disabled) el.setAttribute('disabled', '');
  if (args.inline) el.setAttribute('inline', '');
  if (args.required) el.setAttribute('required', '');
  if (args.switches) el.setAttribute('switches', '');
  if (args.toggleTxt) el.setAttribute('toggle-txt', '');
  if (args.validation) el.setAttribute('validation', '');

  if (args.newToggleTxt && typeof args.newToggleTxt === 'object') {
    try {
      el.setAttribute('new-toggle-txt', JSON.stringify(args.newToggleTxt));
    } catch (_e) {}
  }

  // property-only
  el.switchesArray = args.switches ? (Array.isArray(args.switchesArray) ? args.switchesArray : []) : [];

  return el;
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (_args, context) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Includes examples (default/inline/horizontal/error/disabled) and prints computed <code>role</code>, <code>aria-*</code>, and derived ids.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title) => {
      const box = document.createElement('div');
      box.style.border = '1px solid #ddd';
      box.style.borderRadius = '10px';
      box.style.padding = '12px';
      box.style.display = 'grid';
      box.style.gap = '10px';

      const t = document.createElement('div');
      t.style.fontWeight = '600';
      t.textContent = title;

      const demo = document.createElement('div');

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);

      return { box, demo, pre };
    };

    const c1 = card('Default (single, labelled via <label>)');
    const c2 = card('Inline (multi, role="group", inline layout)');
    const c3 = card('Horizontal (multi, external label + aria-labelledby)');
    const c4 = card('Error / validation (single required + invalid + describedby)');
    const c5 = card('Disabled (single disabled)');

    wrap.appendChild(c1.box);
    wrap.appendChild(c2.box);
    wrap.appendChild(c3.box);
    wrap.appendChild(c4.box);
    wrap.appendChild(c5.box);

    // Mount examples synchronously (so the story returns a DOM node)
    const ex1 = mountToggle({
      inputId: 'mx-default',
      labelTxt: 'Enable notifications',
      switches: false,
      toggleTxt: true,
      newToggleTxt: { on: 'On', off: 'Off' },
      required: false,
      validation: false,
      ariaLabel: 'Toggle',
    });
    c1.demo.appendChild(ex1);

    const ex2 = mountToggle({
      inputId: 'mx-inline',
      switches: true,
      inline: true,
      customSwitch: false,
      switchesArray: [
        { id: 'a', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
        { id: 'b', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
      ],
      ariaLabelledby: '',
    });
    c2.demo.appendChild(ex2);

    // Horizontal example: external label + aria-labelledby
    const horizWrap = document.createElement('div');
    horizWrap.style.display = 'grid';
    horizWrap.style.gridTemplateColumns = '220px 1fr';
    horizWrap.style.gap = '12px';
    horizWrap.style.alignItems = 'start';
    horizWrap.style.maxWidth = '860px';

    const horizLabel = document.createElement('div');
    horizLabel.id = 'mx-horizontal-label';
    horizLabel.style.fontWeight = '600';
    horizLabel.textContent = 'Connectivity settings';

    const ex3 = mountToggle({
      inputId: 'mx-horizontal',
      switches: true,
      inline: false,
      switchesArray: [
        { id: 'w', label: 'Wi-Fi', value: 'wifi', checked: true },
        { id: 'c', label: 'Cellular', value: 'cell', checked: false },
      ],
      ariaLabelledby: 'mx-horizontal-label',
    });

    horizWrap.appendChild(horizLabel);
    horizWrap.appendChild(ex3);
    c3.demo.appendChild(horizWrap);

    const ex4 = mountToggle({
      inputId: 'mx-error',
      labelTxt: 'Accept terms',
      switches: false,
      required: true,
      validation: true,
      validationMessage: 'This switch is required.',
      checked: false,
      ariaLabel: 'Accept terms toggle',
    });
    c4.demo.appendChild(ex4);

    const ex5 = mountToggle({
      inputId: 'mx-disabled',
      labelTxt: 'Disabled toggle',
      switches: false,
      disabled: true,
      checked: true,
    });
    c5.demo.appendChild(ex5);

    // Compute snapshots after Stencil has a chance to render
    queueMicrotask(() =>
      requestAnimationFrame(() => {
        try {
          c1.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex1), null, 2);
          c2.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex2), null, 2);
          c3.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex3), null, 2);
          c4.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex4), null, 2);
          c5.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex5), null, 2);
        } catch (e) {
          const msg = e && e.message ? e.message : String(e);
          c1.pre.textContent = `Error: ${msg}`;
          c2.pre.textContent = `Error: ${msg}`;
          c3.pre.textContent = `Error: ${msg}`;
          c4.pre.textContent = `Error: ${msg}`;
          c5.pre.textContent = `Error: ${msg}`;
        }
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders example configurations and prints computed accessibility wiring. Includes single + multi (role="group"), external `aria-labelledby`, invalid describedby wiring, and disabled behavior.',
      },
      // give it room
      story: { height: '900px' },
    },
  },
};
