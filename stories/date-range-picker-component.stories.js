// stories/date-range-picker-component.stories.js
import { action } from '@storybook/addon-actions';

export default {
  title: 'Form/Date Range Picker',
  tags: ['autodocs'],
  argTypes: {
    // Core
    plumage: { control: 'boolean' },
    rangePicker: {
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
    showYmd: { control: 'boolean', description: 'Force YYYY-MM-DD display' },
    showLong: { control: 'boolean', description: 'Force long date display' },
    showIso: { control: 'boolean', description: 'Force ISO display' },

    // Input / adornments
    placeholder: { control: 'text' },
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
    rangePicker: false,
    disabled: false,
    required: false,

    dateFormat: 'YYYY-MM-DD',
    showYmd: false,
    showLong: false,
    showIso: false,

    placeholder: '',
    joinBy: ' - ',
    icon: 'fas fa-calendar-alt',
    inputId: 'drp',
    appendProp: true,
    prependProp: false,

    label: 'Date Range Picker',
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
  const el = document.createElement('date-range-picker-component');

  // Core
  el.plumage = !!args.plumage;
  el.rangePicker = !!args.rangePicker;
  el.disabled = !!args.disabled;
  el.required = !!args.required;

  // Display format
  el.dateFormat = args.dateFormat;
  el.showYmd = !!args.showYmd;
  el.showLong = !!args.showLong;
  el.showIso = !!args.showIso;

  // Input / adornments
  el.placeholder = args.placeholder || undefined; // let component compute example if empty
  el.joinBy = args.joinBy || ' - ';
  el.icon = args.icon || 'fas fa-calendar-alt';
  el.inputId = args.inputId || 'drp';
  el.appendProp = !!args.appendProp;
  el.prependProp = !!args.prependProp;

  // Label & layout
  el.label = args.label || 'Date Range Picker';
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

  // Events
  el.addEventListener('date-range-updated', (e) => action('date-range-updated')(e.detail));

  return el;
};

const Template = (args) => buildEl(args);

// ===== Stories =====

export const Basic = Template.bind({});

export const USFormat = Template.bind({});
USFormat.args = {
  dateFormat: 'MM-DD-YYYY',
  placeholder: '',
};

export const Plumage = Template.bind({});
Plumage.args = {
  plumage: true,
  appendProp: true,
  prependProp: false,
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  labelCol: 3,
  inputCol: 9,
  label: 'Booking Window',
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  label: 'Inline Range',
  labelCols: 'col-auto',
  inputCols: 'col-auto',
};

export const WithValidationRequired = Template.bind({});
WithValidationRequired.args = {
  required: true,
  validation: true, // show invalid state until a full range is chosen
  validationMessage: 'Please enter a valid date range.',
};

export const StandalonePickerOnly = Template.bind({});
StandalonePickerOnly.args = {
  rangePicker: true,
  showOkButton: false, // ignored when rangePicker = true
};

export const CustomSeparator = Template.bind({});
CustomSeparator.args = {
  joinBy: ' to ',
  placeholder: '', // computed from display format + joinBy
};

export const ForceYMDDisplay = Template.bind({});
ForceYMDDisplay.args = {
  showYmd: true,
};

export const ForceLongDisplay = Template.bind({});
ForceLongDisplay.args = {
  showLong: true,
  joinBy: ' — ',
};

export const ForceIsoDisplay = Template.bind({});
ForceIsoDisplay.args = {
  showIso: true,
  joinBy: ' / ',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const Sizes = Template.bind({});
Sizes.args = {
  size: 'sm', // try '', 'sm', 'lg'
};
