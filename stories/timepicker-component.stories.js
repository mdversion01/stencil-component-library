// src/stories/timepicker-component.stories.js
// UPDATED: adds aria-describedby control + Accessibility Matrix (computed) for new popover + spinbutton semantics

export default {
  title: 'Components/Timepicker/Timepicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The Timepicker Component is a time selection input field that allows users to select or input time values. It supports both 12-hour and 24-hour formats, optional seconds input, and various customization options to fit different use cases.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        // ✅ Keep Docs "Code" tab in sync with Controls, and ensure HTML is shown cleanly
        transform: (_code, ctx) => Template(ctx.args),
      },
    },
  },
  argTypes: {
    /* -----------------------------
     Accessibility
    ------------------------------ */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible label for the timepicker input. Used when `aria-labelledby` is not provided.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description:
        'ID(s) of element(s) that label the timepicker input (space-separated). Takes precedence over aria-label. When show-label is true, the component auto-uses `${inputId}-label`.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description:
        'ID(s) of external help/description elements (space-separated). The component may add its own ids when validation/warning are visible.',
      table: { category: 'Accessibility' },
    },

    /* -----------------------------
     Labeling
    ------------------------------ */
    showLabel: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'show-label',
      description: 'Whether to show the label visually. The label is still read by screen readers even if hidden.',
    },
    labelText: {
      control: 'text',
      name: 'label-text',
      description: 'Text for the label associated with the timepicker input.',
      table: { category: 'Labeling' },
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'required',
      description: 'Show required indicator (label asterisk) where supported.',
    },

    /* -----------------------------
     Input Attributes
    ------------------------------ */
    inputId: {
      control: 'text',
      name: 'input-id',
      description: 'ID for the timepicker input element. Used for label association and generated ids.',
      table: { category: 'Input Attributes' },
    },
    inputName: {
      control: 'text',
      name: 'input-name',
      description: 'Name attribute for the timepicker input element.',
      table: { category: 'Input Attributes' },
    },

    /* -----------------------------
     Layout & Sizing
    ------------------------------ */
    inputWidth: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'input-width',
      description: 'Custom width for the timepicker input (px). If not set, the input uses its default width.',
      table: { category: 'Layout & Sizing' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the timepicker input.',
      table: { category: 'Layout & Sizing' },
    },

    /* -----------------------------
     Format & Options
    ------------------------------ */
    isTwentyFourHourFormat: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'Format & Options' },
      name: 'is-twenty-four-hour-format',
      description: 'Initial preference (24h). Component may toggle this internally.',
    },
    twelveHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twelve-hour-only',
      description: 'If true, only allow 12-hour format (overrides is-twenty-four-hour-format).',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'If true, only allow 24-hour format (overrides is-twenty-four-hour-format).',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'If true, seconds UI is hidden.',
    },

    /* -----------------------------
     UI Controls
    ------------------------------ */
    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'If true, hides the button that opens the timepicker dropdown.',
    },

    /* -----------------------------
     State
    ------------------------------ */
    disableTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disable-timepicker',
      description: 'Disable the entire timepicker (input + buttons + dropdown).',
    },
    isValid: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'is-valid',
      description: 'Indicates whether the current input value is valid.',
    },

    /* -----------------------------
     Validation
    ------------------------------ */
    validation: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      name: 'validation',
      description: 'Apply invalid styling (drives `invalid` / `is-invalid` classes).',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'Validation message to display below the input. Shown when message is non-empty.',
      table: { category: 'Validation' },
    },

    /* -----------------------------
     Storybook Only
    ------------------------------ */
    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      description: 'Demo wrapper width (px)',
      name: 'wrapper-width',
      table: { category: 'Storybook Only' },
    },
  },

  args: {
    // Demo wrapper only
    wrapperWidth: 260,

    // Component defaults
    ariaLabel: 'Time Picker',
    ariaLabelledby: '',
    ariaDescribedby: '',
    disableTimepicker: false,
    hideSeconds: false,
    hideTimepickerBtn: false,
    inputId: 'time-input',
    inputName: 'time',
    inputWidth: null,
    isTwentyFourHourFormat: true,
    isValid: true,
    labelText: 'Enter Time',
    required: false,
    showLabel: false,
    size: '',
    twelveHourOnly: false,
    twentyFourHourOnly: false,
    validation: false,
    validationMessage: '',
  },
};

/* ---------------------------------------------
   Helpers
---------------------------------------------- */

const normalizeHtml = html => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      out.push('');
      prevBlank = true;
      continue;
    }
    out.push(line);
    prevBlank = false;
  }

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

const normalizeIdList = v => {
  const s = String(v ?? '').trim();
  if (!s) return '';
  return s.split(/\s+/).filter(Boolean).join(' ');
};

const boolAttr = (name, on) => (on ? name : null);
const attr = (name, v) => (v === undefined || v === null || v === '' ? null : `${name}="${String(v)}"`);

/* ---------------------------------------------
   Template (UPDATED)
---------------------------------------------- */

// One HTML template used by stories
const Template = args => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';

  const attrs = [
    // a11y
    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attr('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    // state + behavior
    boolAttr('disable-timepicker', args.disableTimepicker),
    boolAttr('hide-seconds', args.hideSeconds),
    boolAttr('hide-timepicker-btn', args.hideTimepickerBtn),
    attr('input-id', args.inputId),
    attr('input-name', args.inputName),
    attr('input-width', args.inputWidth),
    boolAttr('is-twenty-four-hour-format', args.isTwentyFourHourFormat),
    boolAttr('is-valid', args.isValid),
    attr('label-text', args.labelText),
    boolAttr('required', args.required),
    boolAttr('show-label', args.showLabel),
    attr('size', args.size),
    boolAttr('twelve-hour-only', args.twelveHourOnly),
    boolAttr('twenty-four-hour-only', args.twentyFourHourOnly),
    boolAttr('validation', args.validation),
    attr('validation-message', args.validationMessage),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(`
<div class="timepicker-wrapper"${width ? ` style="width:${width};"` : ''}>
  <timepicker-component
    ${attrs}
  ></timepicker-component>
</div>
`);
};

/* =========================
   Stories (existing, updated where needed)
   ========================= */

export const Default = {
  name: 'Default Timepicker',
  render: Template,
  args: {
    wrapperWidth: 260,
    ariaLabel: 'Time Picker',
    ariaLabelledby: '',
    ariaDescribedby: '',
    disableTimepicker: false,
    hideSeconds: false,
    hideTimepickerBtn: false,
    inputId: 'time-input',
    inputName: 'time',
    inputWidth: null,
    isTwentyFourHourFormat: true,
    isValid: true,
    labelText: 'Enter Time',
    required: false,
    showLabel: false,
    size: '',
    twelveHourOnly: false,
    twentyFourHourOnly: false,
    validation: false,
    validationMessage: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default configuration. With no visible label and no aria-labelledby, the input uses aria-label for its accessible name.',
      },
      story: { height: '220px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

export const Small = {
  name: 'Small Size (no label)',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 210,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: { story: 'Small size variant (`size="sm"`). No visible label; uses aria-label.' },
      story: { height: '220px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

export const LargeWithVisibleLabel = {
  name: 'Large Size (with label)',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 320,
    size: 'lg',
    showLabel: true,
    labelText: 'Enter Time',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Large size (`size="lg"`) with visible label. When `show-label` is true, the component wires aria-labelledby to `${inputId}-label`.',
      },
      story: { height: '240px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

export const TwentyFourHourOnly = {
  name: '24-Hour Only',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 320,
    twentyFourHourOnly: true,
    twelveHourOnly: false,
    isTwentyFourHourFormat: true,
    showLabel: true,
    labelText: '24-hour Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'Configured to only allow 24-hour time input (`twenty-four-hour-only`).',
      },
      story: { height: '240px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

export const TwelveHourOnly = {
  name: '12-Hour Only',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 320,
    twentyFourHourOnly: false,
    twelveHourOnly: true,
    isTwentyFourHourFormat: false,
    showLabel: true,
    labelText: '12-hour Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'Configured to only allow 12-hour time input (`twelve-hour-only`).',
      },
      story: { height: '240px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

export const HideSeconds = {
  name: 'Hide Seconds',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 280,
    hideSeconds: true,
    showLabel: true,
    labelText: 'HH:mm (no seconds)',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hides the seconds UI (`hide-seconds`).',
      },
      story: { height: '240px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

export const NoDropdownButton = {
  name: 'No Dropdown Button',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 260,
    hideTimepickerBtn: true,
    showLabel: true,
    labelText: 'Manual Entry Only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hides the dropdown trigger button (`hide-timepicker-btn`), allowing manual time entry only.',
      },
      story: { height: '220px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

export const WithValidationMessage = {
  name: 'With Validation Message',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 320,
    isValid: false,
    validation: true,
    validationMessage: 'Please enter a valid time.',
    showLabel: true,
    labelText: 'Enter Time',
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows invalid styling + a validation message. The input will reference the validation container id via aria-describedby.',
      },
      story: { height: '260px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

export const CustomInputWidth = {
  name: 'Custom Input Width',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 420,
    inputWidth: 300,
    showLabel: true,
    labelText: 'Custom Width',
  },
  parameters: {
    docs: {
      description: { story: 'Sets a custom width using `input-width`.' },
      story: { height: '240px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

/* ============================== Accessibility Matrix (computed) ============================== */

const splitIds = v => String(v || '').trim().split(/\s+/).filter(Boolean);

const resolveId = (scopeRoot, id) => {
  if (!id) return false;
  try {
    return !!scopeRoot.querySelector(`#${CSS.escape(id)}`);
  } catch {
    return false;
  }
};

const getSnapshot = (host, scopeRoot) => {
  const input = host?.querySelector?.('input.time-input');
  const label = host?.querySelector?.('label');
  const trigger = host?.querySelector?.('button.time-icon-btn');
  const dropdown = host?.querySelector?.('.time-dropdown');
  const validation = host?.querySelector?.('.validation-message');
  const warning = host?.querySelector?.('.warning-message');

  const hour = host?.querySelector?.('.hour-display');
  const minute = host?.querySelector?.('.minute-display');
  const second = host?.querySelector?.('.second-display');
  const ampm = host?.querySelector?.('.ampm-display');

  const labelledbyIds = splitIds(input?.getAttribute?.('aria-labelledby'));
  const describedbyIds = splitIds(input?.getAttribute?.('aria-describedby'));

  return {
    hostTag: host?.tagName?.toLowerCase?.() ?? null,
    ids: {
      inputId: input?.getAttribute?.('id') ?? null,
      labelId: label?.getAttribute?.('id') ?? null,
      dropdownId: dropdown?.getAttribute?.('id') ?? null,
      validationId: validation?.getAttribute?.('id') ?? null,
      warningId: warning?.getAttribute?.('id') ?? null,
    },
    input: input
      ? {
          role: input.getAttribute('role') ?? null,
          disabled: input.hasAttribute('disabled'),
          required: input.hasAttribute('required'),
          'aria-label': input.getAttribute('aria-label'),
          'aria-labelledby': input.getAttribute('aria-labelledby'),
          'aria-describedby': input.getAttribute('aria-describedby'),
          'aria-controls': input.getAttribute('aria-controls'),
          'aria-expanded': input.getAttribute('aria-expanded'),
          'aria-haspopup': input.getAttribute('aria-haspopup'),
          'aria-invalid': input.getAttribute('aria-invalid'),
          'aria-required': input.getAttribute('aria-required'),
        }
      : null,
    trigger: trigger
      ? {
          disabled: trigger.hasAttribute('disabled'),
          'aria-controls': trigger.getAttribute('aria-controls'),
          'aria-expanded': trigger.getAttribute('aria-expanded'),
          'aria-haspopup': trigger.getAttribute('aria-haspopup'),
        }
      : null,
    dropdown: dropdown
      ? {
          role: dropdown.getAttribute('role'),
          hiddenClass: dropdown.classList.contains('hidden'),
          inert: dropdown.hasAttribute('inert'),
          'aria-labelledby': dropdown.getAttribute('aria-labelledby'),
          'aria-describedby': dropdown.getAttribute('aria-describedby'),
        }
      : null,
    spinbuttons: {
      hour: hour
        ? {
            role: hour.getAttribute('role'),
            tabIndex: hour.getAttribute('tabindex'),
            'aria-valuemin': hour.getAttribute('aria-valuemin'),
            'aria-valuemax': hour.getAttribute('aria-valuemax'),
            'aria-valuenow': hour.getAttribute('aria-valuenow'),
            'aria-valuetext': hour.getAttribute('aria-valuetext'),
          }
        : null,
      minute: minute
        ? {
            role: minute.getAttribute('role'),
            tabIndex: minute.getAttribute('tabindex'),
            'aria-valuemin': minute.getAttribute('aria-valuemin'),
            'aria-valuemax': minute.getAttribute('aria-valuemax'),
            'aria-valuenow': minute.getAttribute('aria-valuenow'),
            'aria-valuetext': minute.getAttribute('aria-valuetext'),
          }
        : null,
      second: second
        ? {
            role: second.getAttribute('role'),
            tabIndex: second.getAttribute('tabindex'),
            'aria-valuemin': second.getAttribute('aria-valuemin'),
            'aria-valuemax': second.getAttribute('aria-valuemax'),
            'aria-valuenow': second.getAttribute('aria-valuenow'),
            'aria-valuetext': second.getAttribute('aria-valuetext'),
          }
        : null,
      ampm: ampm
        ? {
            role: ampm.getAttribute('role'),
            tabIndex: ampm.getAttribute('tabindex'),
            'aria-valuemin': ampm.getAttribute('aria-valuemin'),
            'aria-valuemax': ampm.getAttribute('aria-valuemax'),
            'aria-valuenow': ampm.getAttribute('aria-valuenow'),
            'aria-valuetext': ampm.getAttribute('aria-valuetext'),
          }
        : null,
    },
    resolves: {
      labelledbyIds,
      labelledbyAllResolve: labelledbyIds.every(id => resolveId(scopeRoot, id)),
      describedbyIds,
      describedbyAllResolve: describedbyIds.every(id => resolveId(scopeRoot, id)),
    },
  };
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Prints computed <code>role</code> + <code>aria-*</code> + generated ids for default / inline / horizontal,
        simulated error/validation, and disabled. Includes spinbutton semantics for the dropdown parts.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '', containerStyle = '') => {
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
      if (containerStyle) demo.setAttribute('style', containerStyle);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      const mount = document.createElement('div');
      mount.innerHTML = normalizeHtml(`
        ${extraHtml}
        ${Template({ ...Default.args, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        const host = mount.querySelector('timepicker-component');

        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('timepicker-component');
          } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(host, mount), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    // Default (no visible label; aria-label used)
    wrap.appendChild(
      card('Default (aria-label)', {
        wrapperWidth: 280,
        inputId: 'mx-tp-default',
        showLabel: false,
        ariaLabel: 'Time Picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
      }),
    );

    // Inline: external aria-labelledby + describedby
    wrap.appendChild(
      card(
        'Inline (external aria-labelledby + aria-describedby)',
        {
          wrapperWidth: 320,
          inputId: 'mx-tp-inline',
          showLabel: false,
          ariaLabel: 'Ignored',
          ariaLabelledby: 'mx-inline-label',
          ariaDescribedby: 'mx-inline-help',
          isValid: true,
          validation: false,
          validationMessage: '',
        },
        `
        <div id="mx-inline-label" style="font-weight:600; margin-bottom:6px;">External label for time</div>
        <div id="mx-inline-help" style="opacity:.8; margin-bottom:8px;">Help: enter time in HH:mm (or use the picker).</div>
        `,
      ),
    );

    // Horizontal: label left, control right (simulated)
    wrap.appendChild(
      card(
        'Horizontal (simulated layout)',
        {
          wrapperWidth: 360,
          inputId: 'mx-tp-horizontal',
          showLabel: false,
          ariaLabelledby: 'mx-horizontal-label',
          ariaDescribedby: '',
          isValid: true,
        },
        `
        <div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px; margin-bottom:8px;">
          <div id="mx-horizontal-label" style="font-weight:600;">Time (horizontal label area)</div>
        </div>
        `,
        'max-width:860px;',
      ),
    );

    // Error / validation: external help + internal validation id should be present when message set
    wrap.appendChild(
      card(
        'Error / validation (validationMessage shown)',
        {
          wrapperWidth: 360,
          inputId: 'mx-tp-error',
          showLabel: true,
          labelText: 'Enter time',
          ariaLabelledby: '',
          ariaLabel: '',
          ariaDescribedby: 'mx-error-help',
          isValid: false,
          validation: true,
          validationMessage: 'Time is required.',
          required: true,
        },
        `
        <div id="mx-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: provide a time. The input should include both this help id and its validation message id in aria-describedby.
        </div>
        `,
      ),
    );

    // Disabled
    wrap.appendChild(
      card('Disabled', {
        wrapperWidth: 320,
        inputId: 'mx-tp-disabled',
        showLabel: true,
        labelText: 'Disabled time',
        disableTimepicker: true,
        ariaLabel: '',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders multiple configurations and prints computed accessibility wiring for the timepicker: aria-label/labelledby/describedby, popup relationships (aria-controls/expanded/haspopup), dropdown role/inert/hidden, and spinbutton semantics for the picker parts.',
      },
    },
  },
};
