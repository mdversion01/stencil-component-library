// src/stories/timepicker-component.stories.js

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
      description: 'Accessible label for the timepicker input. Required if `aria-labelledby` is not provided.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID of an element that labels the timepicker input. Required if `aria-label` is not provided.',
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
      description: 'ID for the timepicker input element. Useful for associating a label with the input.',
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
      description: 'Custom width for the timepicker input (px). If not set, the input will use its default width.',
      table: { category: 'Layout & Sizing' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the timepicker input. Options are "sm" for small, "lg" for large, or default (empty) for standard size.',
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
      description: 'If true, the timepicker will only allow selection of 12-hour format times. Overrides `is-twenty-four-hour-format`.',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'If true, the timepicker will only allow selection of 24-hour format times. Overrides `is-twenty-four-hour-format`.',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'If true, the seconds input is hidden and users can only select hours and minutes.',
    },

    /* -----------------------------
     UI Controls
  ------------------------------ */
    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'If true, the button to open the timepicker dropdown and dropdown button are hidden, allowing only manual input.',
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
      description: 'Indicates whether the current input value is valid. When false, the validation message (if provided) is shown.',
    },

    /* -----------------------------
     Validation
  ------------------------------ */
    validation: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      name: 'validation',
      description: 'Apply invalid styling (drives `invalid` / `is-invalid` classes inside the component).',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'Validation message to display below the input. This is shown when `is-valid` is false.',
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
    ariaLabelledby: 'time-label',
    disableTimepicker: false,
    hideSeconds: false,
    hideTimepickerBtn: false,
    inputId: 'time-input',
    inputName: 'time',
    inputWidth: null,
    isTwentyFourHourFormat: true,
    isValid: false,
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

const boolAttr = (name, on) => (on ? name : null);
const attr = (name, v) => (v === undefined || v === null || v === '' ? null : `${name}="${String(v)}"`);

/* ---------------------------------------------
   Template (UPDATED)
---------------------------------------------- */

// One HTML template used by stories
const Template = args => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';

  const attrs = [
    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', args.ariaLabelledby),
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
   Stories
   ========================= */

export const Default = {
  name: 'Default Timepicker',
  render: Template,
  args: {
    wrapperWidth: 260,
    ariaLabel: 'Time Picker',
    ariaLabelledby: 'time-label',
    disableTimepicker: false,
    hideSeconds: false,
    hideTimepickerBtn: false,
    inputId: 'time-input',
    inputName: 'time',
    inputWidth: null,
    isTwentyFourHourFormat: true,
    isValid: false,
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
          'This is the default configuration of the Timepicker Component. It uses the default size, allows both 12-hour and 24-hour formats, and does not show a validation message or label by default.',
      },
      story: { height: '200px' },
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
      description: { story: 'This example shows the Timepicker Component with the small size variant by setting the `size` prop to "sm".' },
      story: { height: '200px' },
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
          'This example demonstrates the Timepicker Component with the large size variant by setting the `size` prop to "lg". Additionally, the label is made visible by setting `show-label` to true and providing text through the `label-text` prop.',
      },
      story: { height: '200px' },
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
        story: 'This example shows the Timepicker Component configured to only allow 24-hour time input by setting the `twenty-four-hour-only` prop to true.',
      },
      story: { height: '200px' },
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
        story: 'This example shows the Timepicker Component configured to only allow 12-hour time input by setting the `twelve-hour-only` prop to true.',
      },
      story: { height: '200px' },
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
        story:
          'This example demonstrates hiding the seconds input in the Timepicker Component by setting the `hide-seconds` prop to true. Users can only select hours and minutes.',
      },
      story: { height: '200px' },
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
        story: 'This example shows the Timepicker Component without the dropdown button by setting the `hide-timepicker-btn` prop to true, allowing manual time entry only.',
      },
      story: { height: '200px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};

/**
 * ✅ UPDATED validation story to match new component behavior:
 * - Use `validation` to apply invalid styling
 * - Use `validationMessage` to show the message
 * - Set `isValid: false` to represent invalid state
 *
 * The component will clear invalid/message when the user:
 * - clicks Clear
 * - types a new time
 * - uses dropdown spinners
 * Toggling the format button will NOT clear invalid/message.
 */
export const WithValidationMessage = {
  name: 'With Validation Message',
  render: Template,
  args: {
    ...Default.args,
    wrapperWidth: 300,
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
          'Shows invalid styling + a validation message. The component clears invalid classes and the message when the user clears, types a new time, or changes time via the spinners. Format toggle does not clear validation.',
      },
      story: { height: '200px' },
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
      description: { story: 'This example demonstrates the Timepicker Component with a custom input width by setting the `input-width` prop to 300.' },
      story: { height: '200px' },
      source: { transform: (_code, ctx) => Template(ctx.args) },
    },
  },
};
