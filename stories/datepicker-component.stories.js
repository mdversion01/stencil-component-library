// stories/datepicker-component.stories.js
import { action } from '@storybook/addon-actions';

export default {
  title: 'Form/Datepicker',
  tags: ['autodocs'],
  argTypes: {
    // Core behaviour
    calendar: { control: 'boolean', description: 'Standalone calendar view (no input group)' },
    plumage: { control: 'boolean', description: 'Render using Plumage styling' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    // IMPORTANT: validation visuals are gated by the *presence* of the attribute
    validationAttr: {
      control: 'boolean',
      name: 'validation (attribute)',
      description:
        'Turns on validation mode by adding the "validation" attribute. Component only validates if the attribute is present.',
    },
    validationMessage: { control: 'text', name: 'validation-message' },
    warningMessage: { control: 'text', name: 'warning-message' },

    // Layout & sizing (Bootstrap-style grid + variants)
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['', 'sm', 'lg'],
    },
    labelHidden: { control: 'boolean', name: 'label-hidden' },
    label: { control: 'text' },
    labelSize: {
      control: { type: 'inline-radio' },
      options: ['', 'sm', 'lg'],
      name: 'label-size',
    },

    // Grid cols
    labelCol: { control: 'number', min: 0, max: 12, step: 1 },
    inputCol: { control: 'number', min: 0, max: 12, step: 1 },
    labelCols: { control: 'text', description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4"' },
    inputCols: { control: 'text', description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8"' },

    // Input adornments
    prepend: { control: 'boolean', description: 'Show calendar button before input' },
    append: { control: 'boolean', description: 'Show calendar button after input' },
    icon: { control: 'text', description: 'Icon class for the calendar button' },

    // Formatting
    dateFormat: {
      control: { type: 'inline-radio' },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      name: 'date-format',
    },
    placeholder: { control: 'text', description: 'Hint shown in the input (defaults to dateFormat if not provided)' },

    // Identity
    inputId: { control: 'text', name: 'input-id' },

    // Demo helpers
    dropdownOpen: { control: 'boolean', table: { disable: true } },
    displayContextExamples: { control: 'boolean', name: 'display-context-examples' },
  },
  args: {
    // sensible defaults
    calendar: false,
    plumage: false,
    disabled: false,
    required: false,
    validationAttr: false,
    validationMessage: 'Please select a date.',
    warningMessage: '',

    formLayout: '',
    size: '',
    labelHidden: false,
    label: 'Date Picker',
    labelSize: '',

    labelCol: 2,
    inputCol: 10,
    labelCols: '',
    inputCols: '',

    prepend: false,
    append: true,
    icon: 'fas fa-calendar-alt',

    dateFormat: 'YYYY-MM-DD',
    placeholder: 'YYYY-MM-DD',

    inputId: 'datepicker',

    dropdownOpen: false,
    displayContextExamples: false,
  },
};

const setBoolAttr = (el, name, on) => {
  if (on) el.setAttribute(name, '');
  else el.removeAttribute(name);
};

const buildEl = (args) => {
  const el = document.createElement('datepicker-component');

  // --- attribute presence (important for this component) ---
  setBoolAttr(el, 'calendar', !!args.calendar);
  setBoolAttr(el, 'plumage', !!args.plumage);
  setBoolAttr(el, 'disabled', !!args.disabled);
  setBoolAttr(el, 'required', !!args.required);

  // validation visuals are gated by presence of "validation" attribute
  setBoolAttr(el, 'validation', !!args.validationAttr);

  // adornments map to reserved attribute names (component uses appendProp/prependProp internally)
  setBoolAttr(el, 'prepend', !!args.prepend);
  setBoolAttr(el, 'append', !!args.append);

  // layout & size
  if (typeof args.formLayout === 'string') el.formLayout = args.formLayout;
  if (typeof args.size === 'string') el.size = args.size;

  // label, ids, icon
  el.inputId = args.inputId;
  el.label = args.label;
  el.labelHidden = !!args.labelHidden;
  el.labelSize = args.labelSize || '';
  el.icon = args.icon || 'fas fa-calendar-alt';

  // formatting
  el.dateFormat = args.dateFormat;
  // If you supply a custom placeholder, the component will keep it (and still parse using dateFormat)
  el.placeholder = args.placeholder;

  // grid
  el.labelCol = Number(args.labelCol ?? 2);
  el.inputCol = Number(args.inputCol ?? 10);
  el.labelCols = args.labelCols || '';
  el.inputCols = args.inputCols || '';

  // validation text
  el.validationMessage = args.validationMessage || '';
  el.warningMessage = args.warningMessage || '';

  // demo helpers
  el.displayContextExamples = !!args.displayContextExamples;

  // events -> actions
  el.addEventListener('date-selected', (e) => action('date-selected')(e.detail));

  return el;
};

const Template = (args) => buildEl(args);

// ===== Stories =====

export const Basic = Template.bind({});

export const Plumage = Template.bind({});
Plumage.args = {
  plumage: true,
  label: 'Plumage Date',
  append: true,
  prepend: false,
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  label: 'Start Date',
  labelHidden: false,
  labelCol: 3,
  inputCol: 9,
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  label: 'Inline Date',
  labelHidden: false,
  labelCols: 'col-auto',
  inputCols: 'col-auto',
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  required: true,
  validationAttr: true, // attribute must be present to enable validation behavior
  validationMessage: 'Date is required.',
  placeholder: 'YYYY-MM-DD',
};

export const USFormat = Template.bind({});
USFormat.args = {
  dateFormat: 'MM-DD-YYYY',
  placeholder: 'MM-DD-YYYY',
  label: 'US Format',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const Sizes = Template.bind({});
Sizes.args = {
  size: 'sm', // try '', 'sm', 'lg'
  label: 'Small Date',
};

export const PrependIcon = Template.bind({});
PrependIcon.args = {
  prepend: true,
  append: false,
  label: 'Prepend Button',
};

export const StandaloneCalendar = Template.bind({});
StandaloneCalendar.args = {
  calendar: true,
  displayContextExamples: true,
  label: 'Calendar Only',
};
