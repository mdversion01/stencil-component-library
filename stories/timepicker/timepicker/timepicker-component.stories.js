import DocsPage from './timepicker-component.docs.mdx';
import {
  DocsWrapStyles,
  Template,
  buildDocsHtml,
  getSnapshot,
  normalizeHtml,
} from './timepicker-component.story-helpers.js';

export default {
  title: 'Components/Timepicker/Timepicker',
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const wrap = document.createElement('div');
      wrap.appendChild(DocsWrapStyles());

      const out = Story();

      if (typeof out === 'string') {
        const mount = document.createElement('div');
        mount.innerHTML = out;
        wrap.appendChild(mount);
      } else if (out instanceof Node) {
        wrap.appendChild(out);
      } else {
        const mount = document.createElement('div');
        mount.textContent = String(out ?? '');
        wrap.appendChild(mount);
      }

      return wrap;
    },
  ],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component: `
The **Timepicker Component** is a time selection input field that supports manual entry and an accessible popover “spinner” picker.

## Controlled value + events
This component supports a controlled (or semi-controlled) \`value\` prop:

- \`value\` (mutable): when set (non-empty), the component parses/displays it.
- On **commit-like actions** (blur/enter/spinner/clear/format toggle), the component updates \`value\` and emits events.

### \`timeChange\` (commit)
Emitted on committed changes:
- \`source\`: \`commit\` | \`spinner\` | \`clear\` | \`format\` | \`external\` | \`inputName\` | \`inputId\` | \`constraints\` | \`hideSeconds\`
- \`value\`: formatted value
- \`parts\`: { hour, minute, second, ampm }
- \`isValid\`

### \`timeInput\` (typing)
Emitted on keystrokes (throttled via \`time-input-throttle-ms\`):
- \`raw\`: raw input string
- \`normalized\`: normalized-for-typing string (does **not** pad segments)
- \`caretStart\` / \`caretEnd\`
- \`inputType\` (from InputEvent.inputType)
- \`isValid\`, \`reason\` (pattern/range) and optional \`parts\` (only when complete+valid)

## Accessibility + derived IDs (recommended)
This component derives stable IDs from \`input-id\`:

- **Label id**: \`\${inputId}-label\` (used when \`show-label\` is true)
- **Popover id**: \`\${inputId}-dropdown\`
- **Validation message id**: \`\${inputId}-validation\` (present in DOM; shown when \`validation-message\` has content)
- **Warning message id**: \`\${inputId}-warning\` (present in DOM; shown when time limits are exceeded)

### Accessible name precedence
- If \`show-label\` is true: the input is labelled by \`\${inputId}-label\`.
- Otherwise: if \`aria-labelledby\` is provided, it is used.
- Otherwise: falls back to \`aria-label\`.

### \`aria-describedby\` composition
\`aria-describedby\` merges:
- external ids provided via \`aria-describedby\`
- \`\${inputId}-validation\` when a validation message exists
- \`\${inputId}-warning\` when the warning is visible

## Keyboard model for the popover/spinners
When the popover is open:

- **Tab / Shift+Tab**: focus is trapped within the popover
- **Escape**: closes the popover and returns focus
- **Left / Right**: roving focus between parts (Hour → Minute → Second → AM/PM)
- **Up / Down**: increment/decrement active part
- **PageUp / PageDown**: increment/decrement by 10
- **Home / End**: jump to min/max for that part
- **Enter**: commits the value

> Note: 508 compliance also depends on page-level usage: unique \`input-id\` per instance, visible or programmatic labels, and consistent error messaging.
`.trim(),
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
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

    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'If true, hides the button that opens the timepicker dropdown.',
    },

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

    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      description: 'Demo wrapper width (px)',
      name: 'wrapper-width',
      table: { category: 'Storybook Only' },
    },
  },

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
};

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
        story: 'Default configuration. With no visible label and no aria-labelledby, the input uses aria-label for its accessible name.',
      },
      story: { height: '220px' },
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
        story: 'Large size (`size="lg"`) with visible label. When `show-label` is true, the component wires aria-labelledby to `${inputId}-label`.',
      },
      story: { height: '240px' },
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
        story: 'Shows invalid styling + a validation message. The input will reference the validation container id via aria-describedby.',
      },
      story: { height: '260px' },
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
      source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
    },
  },
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
