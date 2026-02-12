// src/stories/timepicker-manager.stories.js

export default {
  title: 'Components/Timepicker/Timepicker Manager',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The Timepicker Manager component wraps a timepicker input and manages its state and behavior, including format preferences and validation. It uses the `<timepicker-manager>` web component to manage the `<timepicker-component>` or the `<plumage-timepicker-component>`.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        // ✅ keeps Docs "Code" tab synced with controls and returns cleaned HTML
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
      description: 'Accessible label for the timepicker input (if no visible label)',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID of the element that labels the timepicker input',
      table: { category: 'Accessibility' },
    },

    /* -----------------------------
     Labeling
  ------------------------------ */
    showLabel: {
      control: 'boolean',
      name: 'show-label',
      table: { defaultValue: { summary: true }, category: 'Labeling' },
      description: 'Whether to show the label (for demo purposes; in practice, use aria-label or aria-labelledby if not showing a visible label)',
    },
    labelText: {
      control: 'text',
      name: 'label-text',
      description: 'Text for the label (if show-label is true)',
      table: { category: 'Labeling' },
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'required',
      description: 'Show required indicator (label asterisk) where supported',
    },

    /* -----------------------------
     Input Attributes
  ------------------------------ */
    inputId: {
      control: 'text',
      name: 'input-id',
      description: 'ID for the timepicker input',
      table: { category: 'Input Attributes' },
    },
    inputName: {
      control: 'text',
      name: 'input-name',
      description: 'Name attribute for the timepicker input',
      table: { category: 'Input Attributes' },
    },

    /* -----------------------------
     Layout & Sizing
  ------------------------------ */
    inputWidth: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'input-width',
      description: 'Custom width for the timepicker input (px)',
      table: { category: 'Layout & Sizing' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the timepicker input',
      table: { category: 'Layout & Sizing' },
    },

    /* -----------------------------
     Format & Options
  ------------------------------ */
    isTwentyFourHourFormat: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'Format & Options' },
      name: 'is-twenty-four-hour-format',
      description: 'Initial format preference (24h)',
    },
    twelveHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twelve-hour-only',
      description: 'Whether to only allow 12-hour format (hides the option to switch to 24-hour)',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'Whether to only allow 24-hour format (hides the option to switch to 12-hour)',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'Whether to hide the seconds input',
    },

    /* -----------------------------
     UI Controls
  ------------------------------ */
    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'Whether to hide the timepicker toggle button',
    },

    /* -----------------------------
     State
  ------------------------------ */
    disableTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disable-timepicker',
      description: 'Disable the timepicker (input + buttons + dropdown). Passed to child as `disableTimepicker` or `disabled` (Plumage).',
    },
    isValid: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'is-valid',
      description: 'Whether the input is in a valid state',
    },

    /* -----------------------------
     Validation
  ------------------------------ */
    validation: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      name: 'validation',
      description: 'Apply invalid styling (drives `invalid` / `is-invalid` classes inside the rendered timepicker)',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'Validation message to display (if any)',
      table: { category: 'Validation' },
    },

    /* -----------------------------
     Rendering Mode
  ------------------------------ */
    usePlTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Rendering Mode' },
      name: 'use-pl-timepicker',
      description: 'Render <plumage-timepicker-component> instead of <timepicker-component>',
    },

    /* -----------------------------
     Storybook Only
  ------------------------------ */
    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      description: 'Demo wrapper width (px), for Storybook only',
      table: { category: 'Storybook Only' },
    },
  },
};

/* ---------------------------------------------
   Helpers (UPDATED)
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
    boolAttr('use-pl-timepicker', args.usePlTimepicker),
    boolAttr('validation', args.validation),
    attr('validation-message', args.validationMessage),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(`
<div class="timepicker-wrapper"${width ? ` style="width:${width};"` : ''}>
  <timepicker-manager
    ${attrs}
  ></timepicker-manager>
</div>
`);
};

/* =========================
   Stories
   ========================= */

export const Default = Template.bind({});
Default.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'default-time-input',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: false,
  labelText: 'Add Time',
  required: false,
  showLabel: true,
  size: '',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  wrapperWidth: 210,
};
Default.storyName = 'Default Timepicker Manager';
Default.parameters = {
  docs: {
    description: {
      story:
        'This is the default configuration of the Timepicker Manager, which renders a standard timepicker input with a visible label. Use the controls to customize the appearance and behavior.',
    },
    story: { height: '200px' },
  },
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'time-input',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: true,
  labelText: 'Add Time',
  required: false,
  showLabel: false,
  size: 'sm',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  wrapperWidth: 210,
};
SmallSize.storyName = 'Small Size (no Label)';
SmallSize.parameters = {
  docs: {
    description: {
      story: 'This example shows the Timepicker Manager with a small-sized input and no visible label. The `size` prop is set to "sm" to reduce the input size.',
    },
    story: { height: '200px' },
  },
};

export const LargeWithLabel = Template.bind({});
LargeWithLabel.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'time-input-lg',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: true,
  labelText: 'Add Time',
  required: false,
  showLabel: true,
  size: 'lg',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  wrapperWidth: 210,
};
LargeWithLabel.storyName = 'Large Size with Label';
LargeWithLabel.parameters = {
  docs: {
    description: {
      story: 'This example shows the Timepicker Manager with a large-sized input and a visible label. The `size` prop is set to "lg" to increase the input size.',
    },
    story: { height: '200px' },
  },
};

export const TwelveHourOnly = Template.bind({});
TwelveHourOnly.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'time-12h-only',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: false,
  isValid: true,
  labelText: '12-hour Time',
  required: false,
  showLabel: true,
  size: '',
  twelveHourOnly: true,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  wrapperWidth: 320,
};
TwelveHourOnly.storyName = '12-Hour Only';
TwelveHourOnly.parameters = {
  docs: {
    description: {
      story: 'This example configures the Timepicker Manager to only allow 12-hour format by setting the `twelve-hour-only` prop to true.',
    },
    story: { height: '200px' },
  },
};

export const TwentyFourHourOnlyHideSeconds = Template.bind({});
TwentyFourHourOnlyHideSeconds.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  disableTimepicker: false,
  hideSeconds: true,
  hideTimepickerBtn: false,
  inputId: 'time-24h-only',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: true,
  labelText: '24-hour (HH:mm)',
  required: false,
  showLabel: true,
  size: '',
  twelveHourOnly: false,
  twentyFourHourOnly: true,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  wrapperWidth: 320,
};
TwentyFourHourOnlyHideSeconds.storyName = '24-Hour Only (with Seconds Hidden)';
TwentyFourHourOnlyHideSeconds.parameters = {
  docs: {
    description: {
      story:
        'This example configures the Timepicker Manager to only allow 24-hour format by setting the `twenty-four-hour-only` prop to true. Additionally, the seconds input is hidden using the `hide-seconds` prop.',
    },
    story: { height: '200px' },
  },
};

export const CustomInputWidth = Template.bind({});
CustomInputWidth.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'time-custom-width',
  inputName: 'time',
  inputWidth: 260,
  isTwentyFourHourFormat: true,
  isValid: true,
  labelText: 'Custom Width',
  required: false,
  showLabel: true,
  size: '',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  wrapperWidth: 400,
};
CustomInputWidth.storyName = 'Custom Input Width';
CustomInputWidth.parameters = {
  docs: {
    description: {
      story: 'This example demonstrates setting a custom width for the timepicker input using the `input-width` prop. The input is set to 260px wide within a 400px wrapper.',
    },
    story: { height: '200px' },
  },
};

/**
 * ✅ UPDATED validation story:
 * - Uses `validation` to apply invalid styles
 * - Uses `validationMessage` to show the message
 * - Keeps `isValid` false so the child reflects an invalid state (buttons disabled, aria-invalid, etc.)
 *
 * Children will clear invalid/message internally when the user clears, types a new time, or uses spinners.
 */
export const WithValidation = Template.bind({});
WithValidation.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'time-input-validation',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: false,
  labelText: 'Add Time',
  required: false,
  showLabel: true,
  size: '',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: true,
  validationMessage: 'Please enter a valid time.',
  wrapperWidth: 400,
};
WithValidation.storyName = 'With Validation Message';
WithValidation.parameters = {
  docs: {
    description: {
      story:
        'Demonstrates invalid styling + a validation message. After the user clears the field, types a new time, or changes time via the dropdown spinners, the child component will remove invalid classes and clear the validation message (format toggle does not clear validation).',
    },
    story: { height: '200px' },
  },
};

export const PlumageStyle = Template.bind({});
PlumageStyle.args = {
  ariaLabel: 'Add Time',
  ariaLabelledby: 'time-label',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'one',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: true,
  labelText: 'Add Time',
  required: false,
  showLabel: true,
  size: '',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: true,
  validation: false,
  validationMessage: '',
  wrapperWidth: 500,
};
PlumageStyle.storyName = 'Plumage Style Timepicker';
PlumageStyle.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates the Timepicker Manager rendering the `<plumage-timepicker-component>` when the `use-pl-timepicker` prop is set to true. This allows for integration with the Plumage design system.',
    },
    story: { height: '200px' },
  },
};
