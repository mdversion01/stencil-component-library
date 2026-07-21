// File: src/stories/timepicker-manager-component.stories.js

import DocsPage from './timepicker-manager-component.docs.mdx';
import {
  DocsWrapStyles,
  Template,
  buildDocsHtml,
  getChild,
  getSnapshot,
  normalizeHtml,
} from './timepicker-manager-component.story-helpers.js';

const baseArgs = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: '',
  ariaDescribedby: '',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'default-time-input',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: true,
  labelText: 'Add Time',
  required: false,
  readOnly: false,
  showLabel: true,
  size: '',
  timeInputThrottleMs: 50,
  timeValidation: true,
  timeValidationMessage: '',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  value: '',
  wrapperWidth: 240,
};

const storyWithTemplate = {
  render: args => Template(args),
};

export default {
  title: 'Form/Timepicker/Timepicker Manager',
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
The **Timepicker Manager** wraps either:
- \`<timepicker-component>\` or
- \`<plumage-timepicker-component>\`

and forwards a common API to the selected child implementation.

## Controlled value + events
The manager forwards \`value\` and re-emits child events.

### Passthrough events
- \`timeChange\`
- \`timeInput\`

### Namespaced events
- \`managerTimeChange\`
- \`managerTimeInput\`

These include:
- \`managerInputId\`
- \`impl\` = \`timepicker-component\` | \`plumage-timepicker-component\`

## Accessibility + derived IDs
The manager uses \`input-id\` as the stable base and forwards a11y props to the child.

### Accessible name precedence
- if \`aria-labelledby\` is provided, it wins and \`aria-label\` is not forwarded
- otherwise \`aria-label\` is forwarded when present

### \`aria-describedby\` composition
The manager forwards external \`aria-describedby\` ids and appends:
- \`\${inputId}-time-validation\` when \`time-validation\` is enabled and \`time-validation-message\` has content
- \`\${inputId}-validation\` when \`validation\` is enabled and \`validation-message\` has content

## Child forwarding differences
- classic child receives \`disableTimepicker\`
- plumage child receives \`disabled\`

## Public methods
- \`focusInput({ open: true })\`
- \`close()\`

These proxy to the active child when supported.

> Use a unique \`input-id\` per instance for correct relationship wiring.
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
      description: 'Accessible label for the timepicker input when aria-labelledby is not provided.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID(s) of external labeling element(s), space-separated. Takes precedence over aria-label.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'External description/help ids. Manager may append time-validation and validation ids.',
      table: { category: 'Accessibility' },
    },

    showLabel: {
      control: 'boolean',
      name: 'show-label',
      table: { defaultValue: { summary: true }, category: 'Labeling' },
      description: 'Whether to show the label.',
    },
    labelText: {
      control: 'text',
      name: 'label-text',
      description: 'Text for the label.',
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
      description: 'Base input id. Should be unique per instance.',
      table: { category: 'Input Attributes' },
    },
    inputName: {
      control: 'text',
      name: 'input-name',
      description: 'Name attribute for the input.',
      table: { category: 'Input Attributes' },
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
      description: 'Input size.',
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
      description: 'Only allow 12-hour format.',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'Only allow 24-hour format.',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'Hide seconds UI.',
    },

    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'Hide the timepicker toggle button.',
    },

    disableTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disable-timepicker',
      description: 'Disable the timepicker. Forwarded as disableTimepicker or disabled depending on child implementation.',
    },
    readOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'read-only',
      description: 'Read-only mode. Forwarded to the active child.',
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
      description: 'Enable user validation state.',
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
      description: 'Enable built-in time validation forwarding.',
    },
    timeValidationMessage: {
      control: 'text',
      name: 'time-validation-message',
      description: 'Built-in time validation message forwarded to the child.',
      table: { category: 'Validation' },
    },

    usePlTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Rendering Mode' },
      name: 'use-pl-timepicker',
      description: 'Render plumage-timepicker-component instead of timepicker-component.',
    },

    value: {
      control: 'text',
      table: { category: 'Controlled Value' },
      description: 'Controlled time value forwarded to the child.',
    },
    timeInputThrottleMs: {
      control: { type: 'number', min: 0, step: 10 },
      name: 'time-input-throttle-ms',
      description: 'Throttle window for timeInput events (ms).',
      table: { category: 'Controlled Value' },
    },

    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      name: 'wrapper-width',
      description: 'Demo wrapper width (px), Storybook only.',
      table: { category: 'Storybook Only' },
    },
  },
  args: {
    ...baseArgs,
  },
};

export const Default = {
  ...storyWithTemplate,
  name: 'Default Timepicker Manager',
  args: {
    ...baseArgs,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default configuration with a visible label.',
      },
      story: { height: '220px' },
    },
  },
};

export const SmallSize = {
  ...storyWithTemplate,
  name: 'Small Size (no Label)',
  args: {
    ...baseArgs,
    showLabel: false,
    size: 'sm',
    inputId: 'time-input-sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small input with no visible label.',
      },
      story: { height: '220px' },
    },
  },
};

export const LargeWithLabel = {
  ...storyWithTemplate,
  name: 'Large Size with Label',
  args: {
    ...baseArgs,
    size: 'lg',
    showLabel: true,
    inputId: 'time-input-lg',
  },
  parameters: {
    docs: {
      description: { story: 'Large input with visible label.' },
      story: { height: '220px' },
    },
  },
};

export const TwelveHourOnly = {
  ...storyWithTemplate,
  name: '12-Hour Only',
  args: {
    ...baseArgs,
    isTwentyFourHourFormat: false,
    twelveHourOnly: true,
    twentyFourHourOnly: false,
    labelText: '12-hour Time',
    inputId: 'time-12h-only',
    wrapperWidth: 340,
  },
  parameters: {
    docs: {
      description: { story: 'Only allow 12-hour format.' },
      story: { height: '220px' },
    },
  },
};

export const TwentyFourHourOnlyHideSeconds = {
  ...storyWithTemplate,
  name: '24-Hour Only (with Seconds Hidden)',
  args: {
    ...baseArgs,
    twentyFourHourOnly: true,
    twelveHourOnly: false,
    hideSeconds: true,
    labelText: '24-hour (HH:mm)',
    inputId: 'time-24h-only',
    wrapperWidth: 340,
  },
  parameters: {
    docs: {
      description: { story: 'Only allow 24-hour format and hide seconds.' },
      story: { height: '220px' },
    },
  },
};

export const CustomInputWidth = {
  ...storyWithTemplate,
  name: 'Custom Input Width',
  args: {
    ...baseArgs,
    inputId: 'time-custom-width',
    labelText: 'Custom Width',
    inputWidth: 260,
    wrapperWidth: 420,
  },
  parameters: {
    docs: {
      description: { story: 'Custom input width via input-width.' },
      story: { height: '220px' },
    },
  },
};

export const WithValidation = {
  ...storyWithTemplate,
  name: 'With User Validation Message',
  args: {
    ...baseArgs,
    inputId: 'time-input-validation',
    validation: true,
    isValid: false,
    validationMessage: 'Please enter a valid time.',
    wrapperWidth: 420,
  },
  parameters: {
    docs: {
      description: {
        story: 'User validation message. Manager appends the child validation id to aria-describedby when active.',
      },
      story: { height: '240px' },
    },
  },
};

export const WithTimeValidation = {
  ...storyWithTemplate,
  name: 'With Built-in Time Validation Message',
  args: {
    ...baseArgs,
    inputId: 'time-input-time-validation',
    timeValidation: true,
    timeValidationMessage: 'Invalid time format.',
    isValid: false,
    wrapperWidth: 420,
  },
  parameters: {
    docs: {
      description: {
        story: 'Built-in time validation message. Manager appends the child time-validation id to aria-describedby when active.',
      },
      story: { height: '240px' },
    },
  },
};

export const ReadOnly = {
  ...storyWithTemplate,
  name: 'Read Only',
  args: {
    ...baseArgs,
    readOnly: true,
    inputId: 'time-readonly',
    value: '13:05:09',
    wrapperWidth: 320,
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only state forwarded to the active child.',
      },
      story: { height: '220px' },
    },
  },
};

export const PlumageStyle = {
  ...storyWithTemplate,
  name: 'Plumage Style Timepicker',
  args: {
    ...baseArgs,
    usePlTimepicker: true,
    inputId: 'time-plumage',
    labelText: 'Add Time',
    wrapperWidth: 520,
  },
  parameters: {
    docs: {
      description: {
        story: 'Renders the plumage-timepicker-component when use-pl-timepicker is true.',
      },
      story: { height: '240px' },
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
        Renders multiple configurations and prints computed manager + child labeling, description wiring,
        forwarded child props, and inferred validation/time-validation IDs.
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
        const mgr = mount.querySelector('timepicker-manager');

        if (mgr?.componentOnReady) {
          try {
            await mgr.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('timepicker-manager');
          } catch (_e) {}
        }

        const child = getChild(mgr);
        if (child?.componentOnReady) {
          try {
            await child.componentOnReady();
          } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(mgr, mount), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    wrap.appendChild(
      card('Default (visible label)', {
        showLabel: true,
        labelText: 'Add time',
        inputId: 'mx-time-default',
        inputName: 'time',
        ariaLabel: 'Time Picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
        timeValidation: true,
        timeValidationMessage: '',
        usePlTimepicker: false,
        wrapperWidth: 260,
      }),
    );

    wrap.appendChild(
      card(
        'Inline (external aria-labelledby + aria-describedby)',
        {
          showLabel: false,
          labelText: '',
          inputId: 'mx-time-inline',
          ariaLabel: 'Ignored',
          ariaLabelledby: 'mx-inline-label',
          ariaDescribedby: 'mx-inline-help',
          isValid: true,
          validation: false,
          validationMessage: '',
          timeValidation: true,
          timeValidationMessage: '',
          usePlTimepicker: false,
          wrapperWidth: 260,
        },
        `
        <div id="mx-inline-label" style="font-weight:600; margin-bottom:6px;">External label for time</div>
        <div id="mx-inline-help" style="opacity:.8; margin-bottom:8px;">Help text: enter time in HH:mm.</div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'User validation (describedby + validation id)',
        {
          showLabel: true,
          labelText: 'Add time',
          inputId: 'mx-time-error',
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: 'mx-error-help',
          validation: true,
          validationMessage: 'Time is required.',
          timeValidation: true,
          timeValidationMessage: '',
          isValid: false,
          usePlTimepicker: false,
          wrapperWidth: 420,
        },
        `
        <div id="mx-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: manager should append <code>mx-time-error-validation</code> to aria-describedby.
        </div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'Built-in time validation (describedby + time-validation id)',
        {
          showLabel: true,
          labelText: 'Add time',
          inputId: 'mx-time-time-error',
          ariaDescribedby: 'mx-time-error-help',
          validation: false,
          validationMessage: '',
          timeValidation: true,
          timeValidationMessage: 'Invalid time format.',
          isValid: false,
          usePlTimepicker: false,
          wrapperWidth: 420,
        },
        `
        <div id="mx-time-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: manager should append <code>mx-time-time-error-time-validation</code> to aria-describedby.
        </div>
        `,
      ),
    );

    wrap.appendChild(
      card('Disabled (plumage)', {
        usePlTimepicker: true,
        disableTimepicker: true,
        showLabel: true,
        labelText: 'Disabled time',
        inputId: 'mx-time-disabled',
        ariaLabel: 'Disabled time picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
        timeValidation: true,
        timeValidationMessage: '',
        wrapperWidth: 320,
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the manager and active child: aria precedence, describedby forwarding and id appending, implementation selection, and disabled/read-only forwarding.',
      },
    },
  },
};
