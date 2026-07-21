// File: src/stories/timepicker-component.stories.js

import DocsPage from './timepicker-component.docs.mdx';
import {
  DocsWrapStyles,
  Template,
  buildDocsHtml,
  getSnapshot,
  normalizeHtml,
} from './timepicker-component.story-helpers.js';

const baseArgs = {
  wrapperWidth: 260,
  ariaLabel: 'Time Picker',
  ariaLabelledby: '',
  ariaDescribedby: '',
  showLabel: false,
  labelText: 'Enter Time',
  inputId: 'time-input',
  inputName: 'time',
  value: '',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  required: false,
  disableTimepicker: false,
  readOnly: false,
  isValid: true,
  validation: false,
  validationMessage: '',
  timeValidation: true,
  timeInputThrottleMs: 50,
};

const docsSource = {
  transform: (_code, ctx) => buildDocsHtml(ctx.args),
};

export default {
  title: 'Form/Timepicker/Timepicker',
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
The **Timepicker Component** is a time input with manual entry and an accessible popover spinner picker.

## Controlled value + events
This component supports a mutable \`value\` prop:

- \`value\`: when non-empty, the component parses and displays it
- commit-like actions update \`value\` and emit events

### \`timeChange\`
Emitted on committed changes:
- \`source\`: \`commit\` | \`spinner\` | \`clear\` | \`format\` | \`external\` | \`inputName\` | \`inputId\` | \`constraints\` | \`hideSeconds\`
- \`value\`
- \`parts\`: { hour, minute, second, ampm }
- \`isValid\`

### \`timeInput\`
Emitted during typing, throttled via \`time-input-throttle-ms\`:
- \`raw\`
- \`normalized\`
- \`caretStart\` / \`caretEnd\`
- \`inputType\`
- \`isValid\`
- optional \`reason\` and \`parts\`

## Accessibility + derived IDs
This component derives stable IDs from \`input-id\`:

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
- \`\${inputId}-time-validation\` when a time validation message is present
- \`\${inputId}-validation\` when user validation is active
- \`\${inputId}-warning\` when the warning is shown

## Current UI behavior
- supports read-only mode
- supports disabled state via \`disable-timepicker\`
- supports 12h/24h toggle via \`.toggle-format-btn\`
- popover includes a close button via \`.close-button\`
- clear and time icon buttons remove their \`invalid\` class when validation is satisfied

## Keyboard model
When the popover is open:

- **Escape** closes the popover and restores focus
- **Left / Right** move between time parts
- **Up / Down** increment or decrement the active part
- **Home / End** move to the first or last enabled part
- **Enter / Space** interacts with the active part

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
      description: 'Accessible label for the input when no visible label or aria-labelledby is used.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID(s) of external labeling element(s), space-separated.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'External help/description ids. Component may append time-validation, validation, and warning ids.',
      table: { category: 'Accessibility' },
    },

    showLabel: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'show-label',
      description: 'Whether to show the label visually.',
    },
    labelText: {
      control: 'text',
      name: 'label-text',
      description: 'Text for the associated label.',
      table: { category: 'Labeling' },
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'required',
      description: 'Marks the field as required.',
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      description: 'Base input id used for derived ids.',
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
      description: 'Custom input width in px.',
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
      description: 'Current format preference.',
    },
    twelveHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twelve-hour-only',
      description: 'Restricts the component to 12-hour format only.',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'Restricts the component to 24-hour format only.',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'Hides the seconds UI.',
    },

    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'Hides the dropdown trigger button.',
    },

    disableTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disable-timepicker',
      description: 'Disables the entire timepicker.',
    },
    readOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'read-only',
      description: 'Read-only mode. Hides clear, dropdown trigger, and format toggle controls.',
    },
    isValid: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'State' },
      name: 'is-valid',
      description: 'Current validity state.',
    },

    validation: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      name: 'validation',
      description: 'Enables user validation styling/state.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'User validation message.',
      table: { category: 'Validation' },
    },
    timeValidation: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'Validation' },
      name: 'time-validation',
      description: 'Backwards-compatible built-in time validation toggle prop.',
    },

    timeInputThrottleMs: {
      control: { type: 'number', min: 0, step: 10 },
      name: 'time-input-throttle-ms',
      description: 'Throttle window for timeInput events (ms).',
      table: { category: 'Events' },
    },
  },

  args: {
    ...baseArgs,
  },
};

export const Default = {
  name: 'Default Timepicker',
  render: Template,
  args: {
    ...baseArgs,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default configuration. With no visible label and no aria-labelledby, the input uses aria-label.',
      },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const Small = {
  name: 'Small Size (no label)',
  render: Template,
  args: {
    ...baseArgs,
    wrapperWidth: 210,
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
  render: Template,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    size: 'lg',
    showLabel: true,
    labelText: 'Enter Time',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size with visible label. When show-label is true, the component wires aria-labelledby to `${inputId}-label`.',
      },
      story: { height: '240px' },
      source: docsSource,
    },
  },
};

export const TwentyFourHourOnly = {
  name: '24-Hour Only',
  render: Template,
  args: {
    ...baseArgs,
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
        story: 'Configured to only allow 24-hour time input.',
      },
      story: { height: '240px' },
      source: docsSource,
    },
  },
};

export const TwelveHourOnly = {
  name: '12-Hour Only',
  render: Template,
  args: {
    ...baseArgs,
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
        story: 'Configured to only allow 12-hour time input.',
      },
      story: { height: '240px' },
      source: docsSource,
    },
  },
};

export const HideSeconds = {
  name: 'Hide Seconds',
  render: Template,
  args: {
    ...baseArgs,
    wrapperWidth: 280,
    hideSeconds: true,
    showLabel: true,
    labelText: 'HH:mm (no seconds)',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hides the seconds UI.',
      },
      story: { height: '240px' },
      source: docsSource,
    },
  },
};

export const NoDropdownButton = {
  name: 'No Dropdown Button',
  render: Template,
  args: {
    ...baseArgs,
    wrapperWidth: 260,
    hideTimepickerBtn: true,
    showLabel: true,
    labelText: 'Manual Entry Only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hides the dropdown trigger button, allowing manual entry only.',
      },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const ReadOnly = {
  name: 'Read Only',
  render: Template,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    readOnly: true,
    showLabel: true,
    labelText: 'Read Only Time',
    inputId: 'tp-readonly',
    value: '13:05:09',
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only mode hides the clear, dropdown trigger, and format toggle controls.',
      },
      story: { height: '220px' },
      source: docsSource,
    },
  },
};

export const WithValidationMessage = {
  name: 'With Validation Message',
  render: Template,
  args: {
    ...baseArgs,
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
        story: 'Shows invalid styling and a user validation message.',
      },
      story: { height: '260px' },
      source: docsSource,
    },
  },
};

export const CustomInputWidth = {
  name: 'Custom Input Width',
  render: Template,
  args: {
    ...baseArgs,
    wrapperWidth: 420,
    inputWidth: 300,
    showLabel: true,
    labelText: 'Custom Width',
  },
  parameters: {
    docs: {
      description: { story: 'Sets a custom width using input-width.' },
      story: { height: '240px' },
      source: docsSource,
    },
  },
};

export const ControlledValueExample = {
  name: 'Controlled Value (value="13:05:09")',
  render: Template,
  args: {
    ...baseArgs,
    wrapperWidth: 320,
    showLabel: true,
    labelText: 'Controlled Value',
    inputId: 'tp-controlled',
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
        Prints computed role, aria-*, derived ids, control visibility, and popover/spinbutton semantics for
        <code>&lt;timepicker-component&gt;</code>.
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
        ${Template({ ...baseArgs, ...storyArgs })}
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
        'Error / validation (user validation shown)',
        {
          wrapperWidth: 360,
          inputId: 'mx-tp-error',
          showLabel: true,
          labelText: 'Enter time',
          ariaDescribedby: 'mx-error-help',
          isValid: false,
          validation: true,
          validationMessage: 'Time is required.',
          required: true,
        },
        `
        <div id="mx-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: the input should include both this help id and its validation message id in aria-describedby.
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
        isValid: true,
        validation: false,
        validationMessage: '',
      }),
    );

    wrap.appendChild(
      card('Read only', {
        wrapperWidth: 320,
        inputId: 'mx-tp-readonly',
        showLabel: true,
        labelText: 'Read only time',
        readOnly: true,
        value: '13:05:09',
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders multiple configurations and prints computed accessibility wiring for the timepicker: aria-label/labelledby/describedby, popup relationships, derived ids, control presence, dropdown hidden/inert state, and spinbutton semantics.',
      },
    },
  },
};
