// File: src/stories/plumage-timepicker-component.stories.js

import DocsPage from './plumage-timepicker-component.docs.mdx';
import {
  DocsWrapStyles,
  Template,
  buildDocsHtml,
  getComputedSnapshot,
  normalizeHtml,
} from './plumage-timepicker-component.story-helpers.js';

const baseArgs = {
  wrapperWidth: 280,
  ariaLabel: 'Time Picker',
  ariaLabelledby: '',
  ariaDescribedby: '',
  showLabel: false,
  labelText: 'Enter Time',
  inputId: 'time-input',
  inputName: 'time',
  value: '',
  isTwentyFourHourFormat: true,
  required: false,
  size: '',
  validationMessage: '',
  validation: false,
  timeValidation: true,
  timeValidationMessage: '',
  twentyFourHourOnly: false,
  twelveHourOnly: false,
  hideTimepickerBtn: false,
  isValid: true,
  hideSeconds: false,
  inputWidth: null,
  disabled: false,
  readOnly: false,
  timeInputThrottleMs: 50,
};

const renderTemplate = args => Template(args);

const docsSource = {
  transform: (_code, ctx) => buildDocsHtml(ctx.args),
};

export default {
  title: 'Form/Timepicker/Plumage Timepicker',
  tags: ['autodocs'],
  decorators: [
    Story => {
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
The **Plumage Timepicker Component** is a time selection input styled for the Plumage design system.

## Controlled value + events
This component supports a mutable \`value\` prop:

- \`value\`: when non-empty, the component parses and displays it
- On commit-like actions, the component updates \`value\` and emits \`timeChange\`

### \`timeChange\`
Emitted on committed changes:
- \`source\`: \`commit\` | \`spinner\` | \`clear\` | \`format\` | \`external\` | \`inputName\` | \`inputId\` | \`constraints\` | \`hideSeconds\`
- \`value\`
- \`parts\`: { hour, minute, second, ampm }
- \`isValid\`

### \`timeInput\`
Emitted during typing, throttled by \`time-input-throttle-ms\`:
- \`raw\`
- \`normalized\`
- \`caretStart\` / \`caretEnd\`
- \`inputType\`
- \`isValid\`
- optional \`reason\` and \`parts\`

## Accessibility + derived IDs
The component derives stable IDs from \`input-id\`:

- label: \`\${inputId}-label\`
- dropdown: \`\${inputId}-dropdown\`
- time validation: \`\${inputId}-time-validation\`
- user validation: \`\${inputId}-validation\`
- warning: \`\${inputId}-warning\`

### Accessible name precedence
- if \`show-label\` is true, the input uses \`\${inputId}-label\`
- otherwise, \`aria-labelledby\` is used when provided
- otherwise, it falls back to \`aria-label\`

### \`aria-describedby\` composition
The component merges:
- external ids from \`aria-describedby\`
- \`\${inputId}-time-validation\` when \`time-validation\` is enabled and a time validation message exists
- \`\${inputId}-validation\` when user validation is active and a validation message exists
- \`\${inputId}-warning\` when the warning is visible

## Current UI behavior
- supports read-only mode
- supports disabled state
- supports 12h/24h toggle via \`.toggle-format-btn\`
- popover includes a close button via \`.close-button\`
- clear and time icon buttons remove their \`invalid\` class when validation is satisfied

## Keyboard model
When the popover is open:

- **Escape** closes the popover and restores focus
- **Left / Right** move between time parts
- **Up / Down** increment or decrement the active part
- **Home / End** move to the first or last enabled part
- **Enter / Space** toggles AM/PM when that part is active

> Use a unique \`input-id\` per instance for correct a11y wiring.
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
    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      description: 'Demo wrapper width (px).',
      name: 'wrapper-width',
      table: { category: 'Storybook Only' },
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible label when no visible label or aria-labelledby is used.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID(s) of external labelling element(s), space-separated.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'External description/help IDs. Component may append time-validation, validation, and warning IDs.',
      table: { category: 'Accessibility' },
    },

    showLabel: {
      control: 'boolean',
      name: 'show-label',
      description: 'Shows the label visually. Otherwise it remains sr-only.',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
    },
    labelText: {
      control: 'text',
      name: 'label-text',
      description: 'Input label text.',
      table: { category: 'Labeling' },
    },
    required: {
      control: 'boolean',
      name: 'required',
      description: 'Marks the field as required and shows the label asterisk.',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      description: 'Base ID used for the input and derived IDs.',
      table: { category: 'Input Attributes' },
    },
    inputName: {
      control: 'text',
      name: 'input-name',
      description: 'Input name attribute.',
      table: { category: 'Input Attributes' },
    },

    value: {
      control: 'text',
      name: 'value',
      description: 'Controlled/mutable time value.',
      table: { category: 'Controlled Value' },
    },

    inputWidth: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'input-width',
      description: 'Explicit input width in px.',
      table: { category: 'Layout & Sizing' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      description: 'Input and control sizing.',
      table: { category: 'Layout & Sizing' },
    },

    isTwentyFourHourFormat: {
      control: 'boolean',
      name: 'is-twenty-four-hour-format',
      description: 'Current format preference.',
      table: { defaultValue: { summary: true }, category: 'Format & Options' },
    },
    twentyFourHourOnly: {
      control: 'boolean',
      name: 'twenty-four-hour-only',
      description: 'Restricts the component to 24-hour format only.',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
    },
    twelveHourOnly: {
      control: 'boolean',
      name: 'twelve-hour-only',
      description: 'Restricts the component to 12-hour format only.',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
    },
    hideSeconds: {
      control: 'boolean',
      name: 'hide-seconds',
      description: 'Hides the seconds part.',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
    },

    hideTimepickerBtn: {
      control: 'boolean',
      name: 'hide-timepicker-btn',
      description: 'Hides the dropdown trigger button.',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
    },

    readOnly: {
      control: 'boolean',
      name: 'read-only',
      description: 'Read-only mode. Hides clear, dropdown trigger, and format toggle controls.',
      table: { defaultValue: { summary: false }, category: 'State' },
    },
    disabled: {
      control: 'boolean',
      name: 'disabled',
      description: 'Disables the entire timepicker.',
      table: { defaultValue: { summary: false }, category: 'State' },
    },
    isValid: {
      control: 'boolean',
      name: 'is-valid',
      description: 'Current validity state.',
      table: { defaultValue: { summary: true }, category: 'State' },
    },

    validation: {
      control: 'boolean',
      name: 'validation',
      description: 'Enables user validation styling/state.',
      table: { defaultValue: { summary: false }, category: 'Validation' },
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'User validation message.',
      table: { category: 'Validation' },
    },
    timeValidation: {
      control: 'boolean',
      name: 'time-validation',
      description: 'Enables built-in time validation messaging.',
      table: { defaultValue: { summary: true }, category: 'Validation' },
    },
    timeValidationMessage: {
      control: 'text',
      name: 'time-validation-message',
      description: 'Built-in time validation message.',
      table: { category: 'Validation' },
    },

    timeInputThrottleMs: {
      control: { type: 'number', min: 0, step: 10 },
      name: 'time-input-throttle-ms',
      description: 'Throttle window for timeInput events in ms.',
      table: { category: 'Events' },
    },
  },

  args: {
    ...baseArgs,
  },
};

export const Default = {
  name: 'Default Plumage Styled Timepicker',
  render: renderTemplate,
  args: {
    ...baseArgs,
  },
  parameters: {
    docs: {
      description: { story: 'Default Plumage timepicker configuration.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const Small = {
  name: 'Small Size (no label)',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 220,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: { story: 'Small size variant.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const LargeWithVisibleLabel = {
  name: 'Large Size (with label)',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 340,
    size: 'lg',
    showLabel: true,
    labelText: 'Enter Time',
    inputId: 'pl-lg',
  },
  parameters: {
    docs: {
      description: { story: 'Large size with visible label.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const TwentyFourHourOnly = {
  name: '24-Hour Format Only',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    twentyFourHourOnly: true,
    twelveHourOnly: false,
    isTwentyFourHourFormat: true,
    showLabel: true,
    labelText: '24-hour Time',
    inputId: 'pl-24h',
  },
  parameters: {
    docs: {
      description: { story: 'Restricted to 24-hour format.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const TwelveHourOnly = {
  name: '12-Hour Format Only',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    twentyFourHourOnly: false,
    twelveHourOnly: true,
    isTwentyFourHourFormat: false,
    showLabel: true,
    labelText: '12-hour Time',
    inputId: 'pl-12h',
  },
  parameters: {
    docs: {
      description: { story: 'Restricted to 12-hour format.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const HideSeconds = {
  name: 'Hide Seconds',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 280,
    hideSeconds: true,
    showLabel: true,
    labelText: 'HH:mm (no seconds)',
    inputId: 'pl-nosec',
  },
  parameters: {
    docs: {
      description: { story: 'Hides the seconds part.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const NoDropdownButton = {
  name: 'No Dropdown Button',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 260,
    hideTimepickerBtn: true,
    showLabel: true,
    labelText: 'Manual Entry Only',
    inputId: 'pl-nodrop',
  },
  parameters: {
    docs: {
      description: { story: 'Hides the dropdown trigger button.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const ReadOnly = {
  name: 'Read Only',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    readOnly: true,
    showLabel: true,
    labelText: 'Read Only Time',
    inputId: 'pl-readonly',
    value: '13:05:09',
  },
  parameters: {
    docs: {
      description: { story: 'Read-only mode hides the clear, dropdown trigger, and format toggle controls.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const Disabled = {
  name: 'Disabled',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    disabled: true,
    showLabel: true,
    labelText: 'Disabled Time',
    inputId: 'pl-disabled',
    inputName: 'disabled-time',
    value: '13:05:09',
  },
  parameters: {
    docs: {
      description: {
        story: `Disabled state using the \`disabled\` prop.`
      },
      story: {
        height: '220px',
      },
      source: docsSource,
    },
  },
};

export const WithValidationMessage = {
  name: 'With User Validation Message',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    showLabel: true,
    labelText: 'Time with Validation',
    required: true,
    inputId: 'pl-validation',
    isValid: false,
    validation: true,
    validationMessage: 'Please enter a valid time.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows user validation state and message.',
      },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const WithTimeValidationMessage = {
  name: 'With Built-in Time Validation Message',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 340,
    showLabel: true,
    labelText: 'Built-in Time Validation',
    inputId: 'pl-time-validation',
    isValid: false,
    timeValidation: true,
    timeValidationMessage: 'Invalid time format. Correct format is HH:mm:ss',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the built-in time validation message wiring and state.',
      },
      story: { height: '240px' },
      source: docsSource,
    },
  },
};

export const CustomInputWidth = {
  name: 'Custom Input Width',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 460,
    inputWidth: 320,
    showLabel: true,
    labelText: 'Custom Width',
    inputId: 'pl-width',
  },
  parameters: {
    docs: {
      description: { story: 'Custom input width via input-width.' },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const ControlledValueExample = {
  name: 'Controlled Value (value="13:05:09")',
  render: renderTemplate,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    showLabel: true,
    labelText: 'Controlled Value',
    inputId: 'pl-controlled',
    value: '13:05:09',
    isTwentyFourHourFormat: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Initializes the component with a controlled value.',
      },
      story: { height: '220px' },
      source: docsSource,
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
        Renders multiple configurations and prints computed <code>role</code>, <code>aria-*</code>, derived ids,
        control visibility, and popover semantics for <code>&lt;plumage-timepicker-component&gt;</code>.
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
          } catch {}
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
        ${Template({ ...baseArgs, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        try {
          if (window.customElements?.whenDefined) {
            await customElements.whenDefined('plumage-timepicker-component');
          }

          const cmp = await waitFor(() => mount.querySelector('plumage-timepicker-component'));
          if (cmp?.componentOnReady) await cmp.componentOnReady();

          await waitFor(() => cmp.querySelector('input.time-input'));

          pre.textContent = JSON.stringify(getComputedSnapshot(cmp, mount), null, 2);
        } catch (err) {
          pre.textContent = `Accessibility Matrix error:\n${String(err?.stack || err)}`;
        }
      };

      setTimeout(() => requestAnimationFrame(update), 0);

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

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
        timeValidation: true,
        timeValidationMessage: '',
        disabled: false,
        readOnly: false,
      }),
    );

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
          timeValidation: true,
          timeValidationMessage: '',
          disabled: false,
        },
        `
        <div id="mx-pl-inline-label" style="font-weight:600; margin-bottom:6px;">External label for time</div>
        <div id="mx-pl-inline-help" style="opacity:.8; margin-bottom:8px;">Help: enter time in HH:mm.</div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'User validation (aria-describedby should include -validation)',
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
          timeValidation: true,
          timeValidationMessage: '',
          disabled: false,
        },
        `
        <div id="mx-pl-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: aria-describedby should include <code>mx-pl-error-validation</code>.
        </div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'Built-in time validation (aria-describedby should include -time-validation)',
        {
          showLabel: true,
          labelText: 'Format validation',
          inputId: 'mx-pl-time-error',
          ariaDescribedby: 'mx-pl-time-help',
          validation: false,
          validationMessage: '',
          timeValidation: true,
          timeValidationMessage: 'Invalid time format. Correct format is HH:mm:ss',
          isValid: false,
          disabled: false,
        },
        `
        <div id="mx-pl-time-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: aria-describedby should include <code>mx-pl-time-error-time-validation</code>.
        </div>
        `,
      ),
    );

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
        timeValidation: true,
        timeValidationMessage: '',
      }),
    );

    wrap.appendChild(
      card('Read only (controls hidden)', {
        readOnly: true,
        showLabel: true,
        labelText: 'Read only time',
        inputId: 'mx-pl-readonly',
        value: '13:05:09',
        isValid: true,
        validation: false,
        validationMessage: '',
        timeValidation: true,
        timeValidationMessage: '',
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders multiple configurations and prints computed accessibility wiring, derived IDs, control presence, popover state, and spinbutton semantics.',
      },
    },
  },
};
