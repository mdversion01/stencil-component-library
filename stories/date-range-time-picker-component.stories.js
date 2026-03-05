// stories/date-range-time-picker-component.stories.js
import { action } from '@storybook/addon-actions';

// ======================================================
// Docs helpers (same pattern as datepicker + date-range)
// ======================================================

/** Collapse blank lines + trim edges */
const normalize = txt => {
  const lines = String(txt ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

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

/** Build clean attribute block (line-wrapped) */
const attrs = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v)}"`))
    .join('\n  ');

/** Ensure numeric cols render only when meaningful (avoid "col-NaN") */
const asNumOrUndef = v => {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

/** Docs code preview that reflects CURRENT args (including Controls changes) */
const buildDocsHtml = args => {
  const attributeBlock = attrs([
    // Core
    ['plumage', !!args.plumage],
    ['range-time-picker', !!args.rangeTimePicker],
    ['disabled', !!args.disabled],
    ['required', !!args.required],

    // Display format
    ['date-format', args.dateFormat],
    ['is-twenty-four-hour-format', !!args.isTwentyFourHourFormat],
    ['show-duration', !!args.showDuration],
    ['show-ymd', !!args.showYmd],
    ['show-long', !!args.showLong],
    ['show-iso', !!args.showIso],

    // Input / adornments
    ['placeholder', args.placeholder],
    ['join-by', args.joinBy],
    ['icon', args.icon],
    ['input-id', args.inputId],
    ['append', !!args.appendProp],
    ['prepend', !!args.prependProp],

    // Layout
    ['label', args.label],
    ['label-align', args.labelAlign],
    ['label-hidden', !!args.labelHidden],
    ['form-layout', args.formLayout],
    ['size', args.size],

    // Grid
    ['label-col', asNumOrUndef(args.labelCol)],
    ['input-col', asNumOrUndef(args.inputCol)],
    ['label-cols', args.labelCols],
    ['input-cols', args.inputCols],

    // Validation
    ['validation', !!args.validation],
    ['validation-message', args.validationMessage],
    ['warning-message', args.warningMessage],

    // Controls
    ['show-ok-button', !!args.showOkButton],
    ['aria-label', args.ariaLabel],
  ]);

  return normalize(`
<date-range-time-picker-component
  ${attributeBlock}
></date-range-time-picker-component>
`);
};

export default {
  title: 'Form/Date Range + Time Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A combined date range and time picker, with flexible display and layout options.',
      },
      source: {
        language: 'html',
        // IMPORTANT: docs preview must reflect CURRENT args (including Controls changes)
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    // Core
    plumage: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Core' },
      description: 'Render using Plumage styling',
    },
    rangeTimePicker: {
      control: 'boolean',
      name: 'range-time-picker',
      table: { defaultValue: { summary: false }, category: 'Core' },
      description: 'Render only the picker (no input group); disables OK button.',
    },
    disabled: { control: 'boolean', table: { defaultValue: { summary: false }, category: 'Core' }, description: 'Disable the input and calendar button' },
    required: { control: 'boolean', table: { defaultValue: { summary: false }, category: 'Core' }, description: 'Mark the input as required' },

    // Display format
    dateFormat: {
      control: { type: 'select' },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      name: 'date-format',
      table: { category: 'Formatting', defaultValue: { summary: 'YYYY-MM-DD' } },
      description: 'Date format used for parsing and displaying the selected date. Uses dayjs formatting tokens.',
    },
    isTwentyFourHourFormat: {
      control: 'boolean',
      name: 'is-twenty-four-hour-format',
      table: { category: 'Formatting', defaultValue: { summary: true } },
      description: '24h vs 12h time inputs',
    },
    showDuration: {
      control: 'boolean',
      name: 'show-duration',
      table: { category: 'Formatting', defaultValue: { summary: false } },
      description: 'Show duration between start and end times',
    },
    showYmd: { control: 'boolean', name: 'show-ymd', table: { category: 'Formatting', defaultValue: { summary: false } }, description: 'Force YYYY-MM-DD display (date part)' },
    showLong: {
      control: 'boolean',
      name: 'show-long',
      table: { category: 'Formatting', defaultValue: { summary: false } },
      description: 'Force long date display (e.g., Wednesday, January 1, 2025)',
    },
    showIso: {
      control: 'boolean',
      name: 'show-iso',
      table: { category: 'Formatting', defaultValue: { summary: false } },
      description: 'Show/accept full ISO datetimes in the main input',
    },

    // Input / adornments
    placeholder: {
      control: 'text',
      table: { category: 'Input' },
      description: 'Placeholder text for the input; if empty, a default will be computed based on the display format + joinBy',
    },
    joinBy: { control: 'text', table: { category: 'Input' }, description: 'Separator between start and end (input & display)' },
    icon: { control: 'text', table: { category: 'Input' }, description: 'Calendar button icon (e.g. "fas fa-calendar-alt")' },
    inputId: { control: 'text', name: 'input-id', table: { category: 'Input' }, description: 'ID for the input element (used for accessibility and testing)' },
    appendProp: {
      control: 'boolean',
      name: 'append-prop',
      table: { category: 'Input', defaultValue: { summary: true } },
      description: 'Show an append button (e.g. calendar icon) that triggers the picker',
    },
    prependProp: {
      control: 'boolean',
      name: 'prepend-prop',
      table: { category: 'Input', defaultValue: { summary: false } },
      description: 'Show a prepend button (e.g. calendar icon) that triggers the picker',
    },

    // Label & layout
    label: { control: 'text', table: { category: 'Layout' }, description: 'Label text for the input' },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Alignment for the label text (only applies when label is visible)',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Visually hide the label (but keep it accessible to screen readers)',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      table: { category: 'Layout' },
      description:
        'Form layout variant. "Horizontal" uses a grid layout with label and input side by side. "Inline" is similar but uses auto-width columns for a more compact display.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description: 'Size variant; applies to input and buttons. "sm" for small, "lg" for large, or default size if empty.',
    },

    // Grid (when formLayout = horizontal/inline)
    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Number of grid columns for the label (horizontal layout only)',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Number of grid columns for the input (horizontal layout only)',
    },
    labelCols: {
      control: 'text',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4"',
    },
    inputCols: {
      control: 'text',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8"',
    },

    // Validation messages (controlled by props)
    validation: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Show validation state (e.g. invalid) based on the current value and required prop; does not perform actual validation, just shows the state when enabled',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { defaultValue: { summary: 'Please select a date.' }, category: 'Validation' },
      description: 'Message displayed when validation fails',
    },
    warningMessage: {
      control: 'text',
      name: 'warning-message',
      table: { defaultValue: { summary: '' }, category: 'Validation' },
      description: 'Optional warning message (displays with warning visuals)',
    },

    // Controls
    showOkButton: {
      control: 'boolean',
      name: 'show-ok-button',
      table: { category: 'Controls', defaultValue: { summary: true } },
      description: 'Show the OK button in the picker',
    },
    ariaLabel: { control: 'text', name: 'aria-label', table: { category: 'Controls' }, description: 'ARIA label for the input element (for accessibility)' },

    // Value (string reflected by component)
    value: {
      control: 'text',
      table: { category: 'Value', disable: true },
      description: 'Current value of the input (for controlled usage); should be in the format "startDate{joinBy}endDate" (e.g. "2024-01-01 - 2024-01-31")',
    },
  },
  args: {
    appendProp: true,
    ariaLabel: '',
    dateFormat: 'YYYY-MM-DD',
    disabled: false,
    formLayout: '',
    icon: 'fas fa-calendar-alt',
    inputCol: 10,
    inputCols: '',
    inputId: 'date-range-time',
    isTwentyFourHourFormat: true,
    joinBy: ' - ',
    label: 'Date and Time Picker',
    labelAlign: '',
    labelCol: 2,
    labelCols: '',
    labelHidden: false,
    placeholder: '',
    plumage: false,
    prependProp: false,
    rangeTimePicker: false,
    required: false,
    showDuration: false,
    showIso: false,
    showLong: false,
    showOkButton: true,
    showYmd: false,
    size: '',
    validation: false,
    validationMessage: 'Required field',
    warningMessage: '',
  },
};

const buildEl = args => {
  const el = document.createElement('date-range-time-picker-component');

  // Core flags
  el.plumage = !!args.plumage;
  el.rangeTimePicker = !!args.rangeTimePicker;
  el.disabled = !!args.disabled;
  el.required = !!args.required;

  // Formats
  el.dateFormat = args.dateFormat;
  el.isTwentyFourHourFormat = !!args.isTwentyFourHourFormat;
  el.showDuration = !!args.showDuration;
  el.showYmd = !!args.showYmd;
  el.showLong = !!args.showLong;
  el.showIso = !!args.showIso;

  // Inputs/adornments
  el.placeholder = args.placeholder || undefined; // let component compute when empty
  el.joinBy = args.joinBy || ' - ';
  el.icon = args.icon || 'fas fa-calendar-alt';
  el.inputId = args.inputId || 'date-range-time';
  el.appendProp = !!args.appendProp;
  el.prependProp = !!args.prependProp;

  // Label & layout
  el.label = args.label || 'Date and Time Picker';
  el.labelAlign = args.labelAlign || '';
  el.labelHidden = !!args.labelHidden;
  el.formLayout = args.formLayout || '';
  el.size = args.size || '';

  // Grid
  el.labelCol = Number(args.labelCol ?? 2);
  el.inputCol = Number(args.inputCol ?? 10);
  el.labelCols = args.labelCols || '';
  el.inputCols = args.inputCols || '';

  // Validation
  el.validation = !!args.validation;
  el.validationMessage = args.validationMessage || 'Required field';
  el.warningMessage = args.warningMessage || '';

  // Controls
  el.showOkButton = !!args.showOkButton;
  el.ariaLabel = args.ariaLabel || '';

  // Event
  el.addEventListener('date-time-updated', e => action('date-time-updated')(e.detail));

  return el;
};

const Template = args => buildEl(args);

// ===== Stories =====

export const Basic = Template.bind({});
Basic.args = {
  label: 'Meeting Time',
  placeholder: 'Select a date and time range',
  labelCol: '',
  inputCol: '',
  inputId: 'meeting-time',
};
Basic.storyName = 'Basic Usage';
Basic.parameters = {
  docs: {
    description: {
      story: 'A basic date and time range picker with default settings.',
    },
    story: { height: '525px' },
  },
};

export const DateFormat_12h_WithDuration = Template.bind({});
DateFormat_12h_WithDuration.args = {
  dateFormat: 'MM-DD-YYYY',
  isTwentyFourHourFormat: false,
  showDuration: true,
  placeholder: 'MM-DD-YYYY hh:mm A to MM-DD-YYYY hh:mm A',
  labelCol: '',
  inputCol: '',
  label: 'Event Time',
  inputId: 'event-time',
};
DateFormat_12h_WithDuration.storyName = 'Date Format + 12h Time + Duration';
DateFormat_12h_WithDuration.parameters = {
  docs: {
    description: {
      story: 'Date format with 12-hour time and duration display.',
    },
    story: { height: '525px' },
  },
};

export const Plumage = Template.bind({});
Plumage.args = {
  plumage: true,
  appendProp: true,
  labelCol: '',
  inputCol: '',
  inputId: 'plumage-drtp',
};
Plumage.storyName = 'Plumage Styling';
Plumage.parameters = {
  docs: {
    description: {
      story: 'Render the component using Plumage styling.',
    },
    story: { height: '525px' },
  },
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  labelCol: 3,
  inputCol: 9,
  label: 'Meeting Window',
  labelAlign: 'right',
  inputId: 'meeting-window',
};
HorizontalLayout.storyName = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'Use horizontal form layout with label and input side by side.',
    },
    story: { height: '525px' },
  },
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  label: 'Inline Date/Time Range',
  labelCols: '',
  inputCols: '',
  labelCol: '',
  inputCol: '',
  inputId: 'inline-drtp',
};
InlineLayout.storyName = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    description: {
      story: 'Use inline form layout for a more compact display.',
    },
    story: { height: '525px' },
  },
};

export const ISOInputOutput = Template.bind({});
ISOInputOutput.args = {
  showIso: true,
  joinBy: ' to ',
  placeholder: '', // component will show ISO example
  labelCol: '',
  inputCol: '',
  inputId: 'iso-drtp',
  label: 'ISO Date/Time Range',
};
ISOInputOutput.storyName = 'ISO Input/Output';
ISOInputOutput.parameters = {
  docs: {
    description: {
      story: 'Show ISO input and output format.',
    },
    story: { height: '525px' },
  },
};

export const LongDateDisplay = Template.bind({});
LongDateDisplay.args = {
  showLong: true,
  joinBy: ' — ',
  labelCol: '',
  inputCol: '',
  inputId: 'long-date-drtp',
  label: 'Long Date/Time Range',
};
LongDateDisplay.storyName = 'Long Date Display';
LongDateDisplay.parameters = {
  docs: {
    description: {
      story: 'Display dates in a long format (e.g. Wednesday, January 1, 2025).',
    },
    story: { height: '525px' },
  },
};

export const RequiredWithValidation = Template.bind({});
RequiredWithValidation.args = {
  labelCol: '',
  inputCol: '',
  inputId: 'required-validation-drtp',
  label: 'Required Date/Time Range',
  required: true,
  validation: true, // show invalid state until a full range (with times) is chosen
  validationMessage: 'Please enter a valid date/time range.',
};
RequiredWithValidation.storyName = 'Required with Validation';
RequiredWithValidation.parameters = {
  docs: {
    description: {
      story: 'A required date/time range picker that shows validation state when the input is invalid.',
    },
    story: { height: '525px' },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  labelCol: '',
  inputCol: '',
  inputId: 'disabled-drtp',
  label: 'Disabled Date/Time Range',
};
Disabled.storyName = 'Disabled State';
Disabled.parameters = {
  docs: {
    description: {
      story: 'A disabled date/time range picker.',
    },
  },
};

export const Sizes = Template.bind({});
Sizes.args = {
  size: 'sm', // try '', 'sm', 'lg'
  labelCol: '',
  inputCol: '',
  inputId: 'size-drtp',
};
Sizes.storyName = 'Sizes';
Sizes.parameters = {
  docs: {
    description: {
      story: 'Size variants for the date/time range picker. Sizes are "" for default, "sm", and "lg".',
    },
    story: { height: '525px' },
  },
};

export const PickerOnly_NoInput = Template.bind({});
PickerOnly_NoInput.args = {
  rangeTimePicker: true,
  showOkButton: false, // ignored in picker-only mode
};
PickerOnly_NoInput.storyName = 'Picker Only (No Input)';
PickerOnly_NoInput.parameters = {
  docs: {
    description: {
      story: 'A date/time range picker in picker-only mode without an input field.',
    },
    story: { height: '425px' },
  },
};
