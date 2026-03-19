// src/stories/plumage-timepicker-component.stories.js

export default {
  title: 'Components/Timepicker/Plumage Timepicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The **Plumage Timepicker Component** is a time selection input field styled to match the Plumage design system.

## Accessibility + derived IDs (recommended)
This component derives stable IDs from \`input-id\` to support robust labeling and relationships:

- **Label id**: \`\${inputId}-label\` (used when \`show-label\` is true)
- **Popover id**: \`\${inputId}-dropdown\`
- **Validation message id**: \`\${inputId}-validation\` (present in DOM; shown when \`validation-message\` has content)
- **Warning message id**: \`\${inputId}-warning\` (present in DOM; shown when time limits are exceeded)

### Accessible name precedence
- If \`show-label\` is true: the input is labelled by the internal label id (\`\${inputId}-label\`).
- Otherwise: if \`aria-labelledby\` is provided, it is used.
- Otherwise: the component falls back to \`aria-label\`.

### \`aria-describedby\` composition
\`aria-describedby\` merges:
- any external ids provided via \`aria-describedby\`
- \`\${inputId}-validation\` when a validation message exists
- \`\${inputId}-warning\` when the warning is visible

## Keyboard model for the popover/spinners (best-practice)
When the popover is open:

- **Tab / Shift+Tab**: focus is trapped within the popover
- **Escape**: closes the popover and returns focus to the trigger/input
- **Left / Right**: roving focus between time parts (Hour → Minute → Second → AM/PM)
- **Up / Down**: increment/decrement active part
- **PageUp / PageDown**: increment/decrement by 10
- **Home / End**: jump to min/max for that part
- **Enter**: commits the value (keeps popover open by default)

> Note: True 508 compliance also depends on page-level usage: unique \`input-id\` per instance, visible or programmatic labels, and consistent error messaging.
        `.trim(),
      },
      source: {
        type: 'dynamic',
        language: 'html',
        // ✅ keep Docs "Code" tab synced + show HTML cleanly
        transform: (_code, ctx) => Template(ctx.args),
      },
    },
  },
  argTypes: {
    /* -----------------------------
     Storybook Only
  ------------------------------ */
    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      description: 'Demo wrapper width (px)',
      name: 'wrapper-width',
      table: { category: 'Storybook Only' },
    },

    /* -----------------------------
     Accessibility
  ------------------------------ */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible label for the timepicker input (used when aria-labelledby is not provided and no visible label).',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID(s) of element(s) that label the timepicker input (space-separated).',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'ID(s) of external description/help elements (space-separated). Component may append -validation/-warning ids when shown.',
      table: { category: 'Accessibility' },
    },

    /* -----------------------------
     Labeling
  ------------------------------ */
    showLabel: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'show-label',
      description: 'Whether to show the label visually. If false, label is sr-only (still available to AT).',
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
      description: 'Show required indicator (label asterisk).',
    },

    /* -----------------------------
     Input Attributes
  ------------------------------ */
    inputId: {
      control: 'text',
      name: 'input-id',
      description: 'ID for the timepicker input element. Used as the base for derived ids: -label/-dropdown/-validation/-warning.',
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
      description: 'Custom width for the timepicker input (px). If not set, defaults to auto width.',
      table: { category: 'Layout & Sizing' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the timepicker input. Options are small (sm), large (lg), or default (empty).',
      name: 'size',
      table: { category: 'Layout & Sizing' },
    },

    /* -----------------------------
     Format & Options
  ------------------------------ */
    isTwentyFourHourFormat: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'Format & Options' },
      name: 'is-twenty-four-hour-format',
      description: 'Initial preference (24h). Component may toggle internally.',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'If true, restricts time selection to 24-hour format only.',
    },
    twelveHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twelve-hour-only',
      description: 'If true, restricts time selection to 12-hour format only.',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'If true, hides the seconds spinner/part.',
    },

    /* -----------------------------
     UI Controls
  ------------------------------ */
    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'If true, the button to open the timepicker dropdown is hidden (manual input only).',
    },

    /* -----------------------------
     State
  ------------------------------ */
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disabled',
      description: 'If true, disables the entire timepicker (input + buttons + popover).',
    },
    isValid: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'State' },
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
      description: 'If true, applies Plumage underline styles to indicate validation state.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'Validation message to display below the timepicker input.',
      table: { category: 'Validation' },
    },
  },

  args: {
    wrapperWidth: 280,
    ariaLabel: 'Time Picker',
    ariaLabelledby: '',
    ariaDescribedby: '',
    showLabel: false,
    labelText: 'Enter Time',
    inputId: 'time-input',
    inputName: 'time',
    isTwentyFourHourFormat: true,
    required: false,
    size: '',
    validationMessage: '',
    twentyFourHourOnly: false,
    twelveHourOnly: false,
    hideTimepickerBtn: false,
    isValid: true,
    hideSeconds: false,
    inputWidth: null,
    validation: false,
    disabled: false,
  },
};

/* ---------------------------------------------
   Helpers
---------------------------------------------- */

const normalizeHtml = (html) => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

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

const normalizeIdList = (v) => {
  const s = String(v ?? '').trim();
  if (!s) return '';
  return s.split(/\s+/).filter(Boolean).join(' ');
};

const boolAttr = (name, on) => (on ? name : null);
const attr = (name, v) => (v === undefined || v === null || v === '' ? null : `${name}="${String(v)}"`);

// ✅ Explicit boolean-as-string attributes so Docs doesn't strip them
const boolTrueAttr = (name, on) => (on ? `${name}="true"` : null);

/* ---------------------------------------------
   Template (UPDATED)
---------------------------------------------- */

const Template = (args) => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';

  const attrs = [
    // a11y
    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attr('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    // label + identity
    boolAttr('show-label', args.showLabel),
    attr('label-text', args.labelText),
    attr('input-id', args.inputId),
    attr('input-name', args.inputName),

    // options
    boolAttr('is-twenty-four-hour-format', args.isTwentyFourHourFormat),
    boolAttr('twenty-four-hour-only', args.twentyFourHourOnly),
    boolAttr('twelve-hour-only', args.twelveHourOnly),
    boolAttr('hide-seconds', args.hideSeconds),
    boolAttr('hide-timepicker-btn', args.hideTimepickerBtn),

    // state
    boolAttr('is-valid', args.isValid),
    attr('input-width', args.inputWidth),
    attr('size', args.size),
    attr('validation-message', args.validationMessage),

    // ✅ keep visible in Docs
    boolTrueAttr('required', args.required),
    boolTrueAttr('validation', args.validation),
    boolTrueAttr('disabled', args.disabled),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(`
<div class="timepicker-wrapper"${width ? ` style="width:${width};"` : ''}>
  <plumage-timepicker-component
    ${attrs}
  ></plumage-timepicker-component>
</div>
`);
};

/* =========================
   Stories
   ========================= */

export const Default = Template.bind({});
Default.args = {
  wrapperWidth: 280,
  ariaLabel: 'Time Picker',
  ariaLabelledby: '',
  ariaDescribedby: '',
  showLabel: false,
  labelText: 'Enter Time',
  inputId: 'time-input',
  inputName: 'time',
  isTwentyFourHourFormat: true,
  required: false,
  size: '',
  validationMessage: '',
  twentyFourHourOnly: false,
  twelveHourOnly: false,
  hideTimepickerBtn: false,
  isValid: true,
  hideSeconds: false,
  inputWidth: null,
  validation: false,
  disabled: false,
};
Default.storyName = 'Default Plumage Styled Timepicker';
Default.parameters = {
  docs: {
    description: { story: 'Default configuration of the Plumage Timepicker.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

export const Small = Template.bind({});
Small.args = {
  ...Default.args,
  wrapperWidth: 220,
  size: 'sm',
};
Small.storyName = 'Small Size (no label)';
Small.parameters = {
  docs: {
    description: {
      story: 'Small size variant (`size="sm"`). Label remains sr-only unless `show-label` is enabled.',
    },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

export const LargeWithVisibleLabel = Template.bind({});
LargeWithVisibleLabel.args = {
  ...Default.args,
  wrapperWidth: 340,
  size: 'lg',
  showLabel: true,
  labelText: 'Enter Time',
  inputId: 'pl-lg',
};
LargeWithVisibleLabel.storyName = 'Large Size (with label)';
LargeWithVisibleLabel.parameters = {
  docs: {
    description: { story: 'Large size variant (`size="lg"`) with visible label (`show-label`).' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

export const TwentyFourHourOnly = Template.bind({});
TwentyFourHourOnly.args = {
  ...Default.args,
  wrapperWidth: 320,
  twentyFourHourOnly: true,
  twelveHourOnly: false,
  isTwentyFourHourFormat: true,
  showLabel: true,
  labelText: '24-hour Time',
  inputId: 'pl-24h',
};
TwentyFourHourOnly.storyName = '24-Hour Format Only';
TwentyFourHourOnly.parameters = {
  docs: {
    description: { story: 'Restricts to 24-hour format only (`twenty-four-hour-only`).' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

export const TwelveHourOnly = Template.bind({});
TwelveHourOnly.args = {
  ...Default.args,
  wrapperWidth: 320,
  twentyFourHourOnly: false,
  twelveHourOnly: true,
  isTwentyFourHourFormat: false,
  showLabel: true,
  labelText: '12-hour Time',
  inputId: 'pl-12h',
};
TwelveHourOnly.storyName = '12-Hour Format Only';
TwelveHourOnly.parameters = {
  docs: {
    description: { story: 'Restricts to 12-hour format only (`twelve-hour-only`).' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

export const HideSeconds = Template.bind({});
HideSeconds.args = {
  ...Default.args,
  wrapperWidth: 280,
  hideSeconds: true,
  showLabel: true,
  labelText: 'HH:mm (no seconds)',
  inputId: 'pl-nosec',
};
HideSeconds.storyName = 'Hide Seconds';
HideSeconds.parameters = {
  docs: {
    description: { story: 'Hides the seconds spinner/part (`hide-seconds`).' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

export const NoDropdownButton = Template.bind({});
NoDropdownButton.args = {
  ...Default.args,
  wrapperWidth: 260,
  hideTimepickerBtn: true,
  showLabel: true,
  labelText: 'Manual Entry Only',
  inputId: 'pl-nodrop',
};
NoDropdownButton.storyName = 'No Dropdown Button';
NoDropdownButton.parameters = {
  docs: {
    description: { story: 'Hides the dropdown trigger button (`hide-timepicker-btn`) so users type time manually.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

/**
 * ✅ Validation story:
 * - Use `validation` to apply underline invalid styling
 * - Use `validationMessage` to show the message
 * - Component clears invalid/message when user clears, types, or changes spinners
 * - Format toggle does NOT clear validation
 */
export const WithValidationMessage = Template.bind({});
WithValidationMessage.args = {
  ...Default.args,
  wrapperWidth: 320,
  showLabel: true,
  labelText: 'Time with Validation',
  required: true,
  inputId: 'pl-validation',
  isValid: false,
  validation: true,
  validationMessage: 'Please enter a valid time.',
};
WithValidationMessage.storyName = 'With Validation Message';
WithValidationMessage.parameters = {
  docs: {
    description: {
      story:
        'Shows Plumage invalid underline styling + a validation message. Clears when the user clears, types, or uses spinners. Format toggle does not clear validation.',
    },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

export const CustomInputWidth = Template.bind({});
CustomInputWidth.args = {
  ...Default.args,
  wrapperWidth: 460,
  inputWidth: 320,
  showLabel: true,
  labelText: 'Custom Width',
  inputId: 'pl-width',
};
CustomInputWidth.storyName = 'Custom Input Width';
CustomInputWidth.parameters = {
  docs: {
    description: { story: 'Custom input width via `input-width`.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

/* ============================== Accessibility Matrix (computed) ============================== */

const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

const resolveId = (scopeRoot, id) => {
  if (!id) return false;
  try {
    return !!scopeRoot.querySelector(`#${CSS.escape(id)}`);
  } catch {
    return false;
  }
};

const getComputedSnapshot = (cmp, scopeRoot) => {
  const input = cmp?.querySelector?.('input.time-input') || null;
  const label = cmp?.querySelector?.('label') || null;
  const dropdown = cmp?.querySelector?.('.time-dropdown') || null;
  const validation = cmp?.querySelector?.(`#${CSS.escape(`${cmp?.inputId || cmp?.getAttribute?.('input-id') || 'time-input'}-validation`)}`) || null;
  const warning = cmp?.querySelector?.(`#${CSS.escape(`${cmp?.inputId || cmp?.getAttribute?.('input-id') || 'time-input'}-warning`)}`) || null;

  const inputId = cmp?.inputId ?? cmp?.getAttribute?.('input-id') ?? null;
  const derived = inputId
    ? {
        label: `${inputId}-label`,
        dropdown: `${inputId}-dropdown`,
        validation: `${inputId}-validation`,
        warning: `${inputId}-warning`,
      }
    : null;

  const ariaLabelledby = input?.getAttribute?.('aria-labelledby') ?? null;
  const ariaDescribedby = input?.getAttribute?.('aria-describedby') ?? null;

  const labelledIds = splitIds(ariaLabelledby);
  const describedIds = splitIds(ariaDescribedby);

  return {
    component: {
      tag: cmp?.tagName?.toLowerCase?.() ?? null,
      inputId,
      isOpen: cmp?._open ?? null, // may be undefined in prod builds; ok
      activePart: cmp?._activePart ?? null, // may be undefined in prod builds; ok
    },
    derivedIds: derived,
    dom: {
      hasLabel: !!label,
      hasInput: !!input,
      hasDropdown: !!dropdown,
      hasValidationEl: !!validation,
      hasWarningEl: !!warning,
    },
    input: input
      ? {
          id: input.getAttribute('id'),
          name: input.getAttribute('name'),
          disabled: input.hasAttribute('disabled'),
          role: input.getAttribute('role') || 'textbox (implicit)',
          ariaLabel: input.getAttribute('aria-label'),
          ariaLabelledby,
          ariaDescribedby,
          ariaControls: input.getAttribute('aria-controls'),
          ariaExpanded: input.getAttribute('aria-expanded'),
          ariaHaspopup: input.getAttribute('aria-haspopup'),
          ariaInvalid: input.getAttribute('aria-invalid'),
          ariaRequired: input.getAttribute('aria-required'),
          required: input.hasAttribute('required'),
        }
      : null,
    dropdown: dropdown
      ? {
          id: dropdown.getAttribute('id'),
          role: dropdown.getAttribute('role'),
          ariaLabelledby: dropdown.getAttribute('aria-labelledby'),
          ariaDescribedby: dropdown.getAttribute('aria-describedby'),
          hiddenClass: dropdown.classList.contains('hidden'),
          inertAttr: dropdown.hasAttribute('inert'),
          tabIndex: dropdown.getAttribute('tabindex'),
        }
      : null,
    resolved: {
      labelledbyIds: labelledIds,
      labelledbyAllResolve: labelledIds.every((id) => resolveId(scopeRoot, id)),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every((id) => resolveId(scopeRoot, id)),
      derivedResolves: derived
        ? {
            label: resolveId(scopeRoot, derived.label),
            dropdown: resolveId(scopeRoot, derived.dropdown),
            validation: resolveId(scopeRoot, derived.validation),
            warning: resolveId(scopeRoot, derived.warning),
          }
        : null,
    },
    spinbuttons: (() => {
      if (!dropdown) return null;
      const spins = Array.from(dropdown.querySelectorAll('[role="spinbutton"]')).map((el) => ({
        class: el.getAttribute('class'),
        tabIndex: el.getAttribute('tabindex'),
        ariaLabel: el.getAttribute('aria-label'),
        ariaValueNow: el.getAttribute('aria-valuenow'),
        ariaValueText: el.getAttribute('aria-valuetext'),
        ariaValueMin: el.getAttribute('aria-valuemin'),
        ariaValueMax: el.getAttribute('aria-valuemax'),
      }));
      return spins;
    })(),
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
        Renders multiple configurations and prints computed <code>role</code>, <code>aria-*</code>, and derived ids for
        <code>&lt;plumage-timepicker-component&gt;</code>.
      </div>
    `;
    wrap.appendChild(header);

    const waitFor = async (fn, timeoutMs = 2500, intervalMs = 50) => {
      const start = performance.now();
      return new Promise((resolve, reject) => {
        const tick = async () => {
          try {
            const val = await fn();
            if (val) return resolve(val);
          } catch {
            // keep retrying until timeout
          }
          if (performance.now() - start > timeoutMs) return reject(new Error('Timed out waiting for component'));
          setTimeout(tick, intervalMs);
        };
        tick();
      });
    };

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
        try {
          if (window.customElements?.whenDefined) {
            await customElements.whenDefined('plumage-timepicker-component');
          }

          const cmp = await waitFor(() => mount.querySelector('plumage-timepicker-component'));

          if (cmp?.componentOnReady) {
            await cmp.componentOnReady();
          }

          // hydration signal
          await waitFor(() => cmp.querySelector('input.time-input'));

          pre.textContent = JSON.stringify(getComputedSnapshot(cmp, mount), null, 2);
        } catch (err) {
          pre.textContent = `Accessibility Matrix error:\n${String(err?.stack || err)}`;
        }
      };

      // schedule after DOM insertion
      setTimeout(() => requestAnimationFrame(update), 0);

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    // Default
    wrap.appendChild(
      card('Default (sr-only label, aria-label fallback)', {
        showLabel: false,
        labelText: 'Enter time',
        inputId: 'mx-pl-default',
        inputName: 'time',
        ariaLabel: 'Time Picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
        disabled: false,
      }),
    );

    // Inline: no visible label, external label + help
    wrap.appendChild(
      card(
        'Inline (external aria-labelledby + aria-describedby)',
        {
          showLabel: false,
          labelText: '',
          inputId: 'mx-pl-inline',
          ariaLabel: 'Ignored',
          ariaLabelledby: 'mx-pl-inline-label',
          ariaDescribedby: 'mx-pl-inline-help',
          isValid: true,
          validation: false,
          disabled: false,
        },
        `
        <div id="mx-pl-inline-label" style="font-weight:600; margin-bottom:6px;">External label for time</div>
        <div id="mx-pl-inline-help" style="opacity:.8; margin-bottom:8px;">Help: enter time in HH:mm.</div>
        `,
      ),
    );

    // Horizontal (simulated): label left, control right
    wrap.appendChild(
      card(
        'Horizontal (simulated layout, external labelledby)',
        {
          showLabel: false,
          inputId: 'mx-pl-horizontal',
          ariaLabelledby: 'mx-pl-horizontal-label',
          ariaDescribedby: '',
          isValid: true,
          disabled: false,
        },
        `
        <div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px; margin-bottom:8px;">
          <div id="mx-pl-horizontal-label" style="font-weight:600;">Time (horizontal label area)</div>
        </div>
        `,
        'max-width:860px;',
      ),
    );

    // Error/validation
    wrap.appendChild(
      card(
        'Error / validation (aria-describedby should include -validation)',
        {
          showLabel: true,
          labelText: 'Add time',
          inputId: 'mx-pl-error',
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: 'mx-pl-error-help',
          validation: true,
          isValid: false,
          validationMessage: 'Time is required.',
          disabled: false,
        },
        `
        <div id="mx-pl-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: When a validation message exists, aria-describedby should include <code>mx-pl-error-validation</code>.
        </div>
        `,
      ),
    );

    // Disabled
    wrap.appendChild(
      card('Disabled (popover should remain inert/hidden)', {
        disabled: true,
        showLabel: true,
        labelText: 'Disabled time',
        inputId: 'mx-pl-disabled',
        ariaLabel: 'Disabled time picker',
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
          'Renders multiple configurations and prints computed accessibility wiring: aria-label/labelledby/describedby, derived ids (-label/-dropdown/-validation/-warning), popover role + inert/hidden state, and spinbutton semantics (role + aria-value*).',
      },
    },
  },
};
