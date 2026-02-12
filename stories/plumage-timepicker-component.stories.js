// src/stories/plumage-timepicker-component.stories.js

export default {
  title: 'Components/Timepicker/Plumage Timepicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The Plumage Timepicker Component is a time selection input field styled to match the Plumage design system. It supports both 12-hour and 24-hour formats, optional seconds input, and various customization options to fit different use cases.',
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
      description: 'Accessible label for the timepicker input',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID of an element that labels the timepicker input',
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
      description: 'Show required indicator (label asterisk).',
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
      description: 'If true, hides the seconds input.',
    },

    /* -----------------------------
     UI Controls
  ------------------------------ */
    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'If true, the button to open the timepicker dropdown is hidden, allowing only manual input.',
    },

    /* -----------------------------
     State
  ------------------------------ */
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disabled',
      description: 'If true, disables the timepicker input.',
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

// ✅ Explicit boolean-as-string attributes so Docs doesn't strip them
const boolTrueAttr = (name, on) => (on ? `${name}="true"` : null);

/* ---------------------------------------------
   Template (UPDATED)
---------------------------------------------- */

const Template = args => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';

  const attrs = [
    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', args.ariaLabelledby),

    boolAttr('show-label', args.showLabel),
    attr('label-text', args.labelText),

    attr('input-id', args.inputId),
    attr('input-name', args.inputName),

    boolAttr('is-twenty-four-hour-format', args.isTwentyFourHourFormat),

    // ✅ important for asterisk + Docs code preview
    boolTrueAttr('required', args.required),

    attr('size', args.size),
    attr('validation-message', args.validationMessage),

    boolAttr('twenty-four-hour-only', args.twentyFourHourOnly),
    boolAttr('twelve-hour-only', args.twelveHourOnly),

    boolAttr('hide-timepicker-btn', args.hideTimepickerBtn),
    boolAttr('is-valid', args.isValid),
    boolAttr('hide-seconds', args.hideSeconds),

    attr('input-width', args.inputWidth),

    // ✅ same issue as required: keep it visible in Docs
    boolTrueAttr('validation', args.validation),

    // ✅ disabled is a real prop on plumage component
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
  ariaLabelledby: 'time-label',
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
    description: { story: 'This is the default configuration of the Plumage Timepicker Component with standard settings.' },
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
      story: 'This example demonstrates the Plumage Timepicker Component in small size by setting the `size` prop to "sm". The label is hidden in this configuration.',
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
};
LargeWithVisibleLabel.storyName = 'Large Size (with label)';
LargeWithVisibleLabel.parameters = {
  docs: {
    description: { story: 'This example demonstrates the Plumage Timepicker Component in large size with a visible label.' },
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
};
TwentyFourHourOnly.storyName = '24-Hour Format Only';
TwentyFourHourOnly.parameters = {
  docs: {
    description: { story: 'This example shows the Plumage Timepicker Component configured to allow only 24-hour time selection.' },
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
};
TwelveHourOnly.storyName = '12-Hour Format Only';
TwelveHourOnly.parameters = {
  docs: {
    description: { story: 'This example shows the Plumage Timepicker Component configured to allow only 12-hour time selection.' },
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
};
HideSeconds.storyName = 'Hide Seconds';
HideSeconds.parameters = {
  docs: {
    description: { story: 'This example demonstrates hiding the seconds input by setting the `hide-seconds` prop to true.' },
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
};
NoDropdownButton.storyName = 'No Dropdown Button';
NoDropdownButton.parameters = {
  docs: {
    description: { story: 'This example shows the component without the dropdown button by setting `hide-timepicker-btn` to true.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

/**
 * ✅ UPDATED validation story to match new Plumage behavior:
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
  inputId: 'validation-timepicker',
  isValid: false,
  validation: true,
  validationMessage: 'Please enter a valid time.',
};
WithValidationMessage.storyName = 'With Validation Message';
WithValidationMessage.parameters = {
  docs: {
    description: {
      story:
        'Shows Plumage invalid underline styling + a validation message. The component clears invalid classes and the message when the user clears, types a new time, or changes time via the spinners. Format toggle does not clear validation.',
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
};
CustomInputWidth.storyName = 'Custom Input Width';
CustomInputWidth.parameters = {
  docs: {
    description: { story: 'This example demonstrates a custom input width by setting `input-width` to 320.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => Template(ctx.args) },
  },
};

// Optional story if you want it:
// export const Disabled = Template.bind({});
// Disabled.args = {
//   ...Default.args,
//   wrapperWidth: 300,
//   showLabel: true,
//   disabled: true,
//   required: true,
// };
// Disabled.storyName = 'Disabled';
