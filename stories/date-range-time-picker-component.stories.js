// stories/date-range-time-picker-component.stories.js
import { action } from '@storybook/addon-actions';

export default {
  title: 'Form/Date Range + Time Picker',
  tags: ['autodocs'],
  argTypes: {
    // Core
    plumage: { control: 'boolean' },
    rangeTimePicker: {
      control: 'boolean',
      description: 'Render only the picker (no input group); disables OK button.',
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },

    // Display format
    dateFormat: {
      control: { type: 'inline-radio' },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
    },
    isTwentyFourHourFormat: {
      control: 'boolean',
      description: '24h vs 12h time inputs',
    },
    showDuration: { control: 'boolean' },
    showYmd: { control: 'boolean', description: 'Force YYYY-MM-DD display (date part)' },
    showLong: { control: 'boolean', description: 'Force long date display (e.g., Wednesday, January 1, 2025)' },
    showIso: { control: 'boolean', description: 'Show/accept full ISO datetimes in the main input' },

    // Input / adornments
    placeholder: { control: 'text', description: 'Leave blank to auto-generate' },
    joinBy: { control: 'text', description: 'Separator between start and end (input & display)' },
    icon: { control: 'text' },
    inputId: { control: 'text', name: 'input-id' },
    appendProp: { control: 'boolean', name: 'append' },
    prependProp: { control: 'boolean', name: 'prepend' },

    // Label & layout
    label: { control: 'text' },
    labelHidden: { control: 'boolean', name: 'label-hidden' },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['', 'sm', 'lg'],
    },

    // Grid (when formLayout = horizontal/inline)
    labelCol: { control: 'number', min: 0, max: 12, step: 1 },
    inputCol: { control: 'number', min: 0, max: 12, step: 1 },
    labelCols: { control: 'text', description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4"' },
    inputCols: { control: 'text', description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8"' },

    // Validation messages (controlled by props)
    validation: { control: 'boolean' },
    validationMessage: { control: 'text', name: 'validation-message' },
    warningMessage: { control: 'text', name: 'warning-message' },

    // Controls
    showOkButton: { control: 'boolean', name: 'show-ok-button' },
    ariaLabel: { control: 'text', name: 'aria-label' },

    // Value (string reflected by component)
    value: { control: 'text', table: { disable: true } },
  },
  args: {
    plumage: false,
    rangeTimePicker: false,
    disabled: false,
    required: false,

    dateFormat: 'YYYY-MM-DD',
    isTwentyFourHourFormat: true,
    showDuration: false,
    showYmd: false,
    showLong: false,
    showIso: false,

    placeholder: '',
    joinBy: ' - ',
    icon: 'fas fa-calendar-alt',
    inputId: 'date-range-time',
    appendProp: true,
    prependProp: false,

    label: 'Date and Time Picker',
    labelHidden: false,
    formLayout: '',
    size: '',

    labelCol: 2,
    inputCol: 10,
    labelCols: '',
    inputCols: '',

    validation: false,
    validationMessage: 'Required field',
    warningMessage: '',

    showOkButton: true,
    ariaLabel: '',
  },
};

const buildEl = (args) => {
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
  el.addEventListener('date-time-updated', (e) => action('date-time-updated')(e.detail));

  return el;
};

const Template = (args) => buildEl(args);

// ===== Stories =====

export const Basic = Template.bind({});

export const Plumage = Template.bind({});
Plumage.args = {
  plumage: true,
  appendProp: true,
  prependProp: false,
};

export const USDate_12h_WithDuration = Template.bind({});
USDate_12h_WithDuration.args = {
  dateFormat: 'MM-DD-YYYY',
  isTwentyFourHourFormat: false,
  showDuration: true,
  placeholder: '',
};

export const ISOInputOutput = Template.bind({});
ISOInputOutput.args = {
  showIso: true,
  joinBy: ' to ',
  placeholder: '', // component will show ISO example
};

export const LongDateDisplay = Template.bind({});
LongDateDisplay.args = {
  showLong: true,
  joinBy: ' — ',
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  labelCol: 3,
  inputCol: 9,
  label: 'Meeting Window',
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  label: 'Inline Date/Time Range',
  labelCols: 'col-auto',
  inputCols: 'col-auto',
};

export const RequiredWithValidation = Template.bind({});
RequiredWithValidation.args = {
  required: true,
  validation: true, // show invalid state until a full range (with times) is chosen
  validationMessage: 'Please enter a valid date/time range.',
};

export const PickerOnly_NoInput = Template.bind({});
PickerOnly_NoInput.args = {
  rangeTimePicker: true,
  showOkButton: false, // ignored in picker-only mode
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const Sizes = Template.bind({});
Sizes.args = {
  size: 'sm', // try '', 'sm', 'lg'
};
