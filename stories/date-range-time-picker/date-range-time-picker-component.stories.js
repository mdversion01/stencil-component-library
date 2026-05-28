// File: stories/date-range-time-picker-component.stories.js

import DocsPage from './date-range-time-picker-component.docs.mdx';
import {
  buildDocsHtml,
  Template,
  renderDRTPMatrixRow,
} from './date-range-time-picker-component.story-helpers.js';

export default {
  title: 'Form/Date Range + Time Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component: 'A combined date range and time picker, with flexible display and layout options.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
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
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Core' },
      description: 'Disable the input and calendar button',
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Core' },
      description: 'Mark the input as required',
    },

    dateFormat: {
      control: { type: 'select' },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      name: 'date-format',
      table: { category: 'Formatting', defaultValue: { summary: 'YYYY-MM-DD' } },
      description: 'Date format used for parsing and displaying the selected date.',
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
    showYmd: {
      control: 'boolean',
      name: 'show-ymd',
      table: { category: 'Formatting', defaultValue: { summary: false } },
      description: 'Force YYYY-MM-DD display (date part)',
    },
    showLong: {
      control: 'boolean',
      name: 'show-long',
      table: { category: 'Formatting', defaultValue: { summary: false } },
      description: 'Force long date display',
    },
    showIso: {
      control: 'boolean',
      name: 'show-iso',
      table: { category: 'Formatting', defaultValue: { summary: false } },
      description: 'Show/accept full ISO datetimes in the main input',
    },

    placeholder: {
      control: 'text',
      table: { category: 'Input' },
      description: 'Placeholder text for the input; if empty, a default will be computed based on display format + joinBy',
    },
    joinBy: {
      control: 'text',
      table: { category: 'Input' },
      description: 'Separator between start and end (input & display)',
    },
    icon: {
      control: 'text',
      table: { category: 'Input' },
      description: 'Calendar button icon (e.g. "fas fa-calendar-alt")',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input' },
      description: 'ID for the input element',
    },

    appendProp: {
      control: 'boolean',
      name: 'append-prop',
      table: { category: 'Input', defaultValue: { summary: true } },
      description: 'Show an append button (calendar icon) that triggers the picker',
    },
    prependProp: {
      control: 'boolean',
      name: 'prepend-prop',
      table: { category: 'Input', defaultValue: { summary: false } },
      description: 'Show a prepend button (calendar icon) that triggers the picker',
    },

    label: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Label text for the input',
    },
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
      name: 'form-layout',
      options: ['', 'horizontal', 'inline'],
      table: { category: 'Layout' },
      description: 'Form layout variant. "Horizontal" uses grid. "Inline" uses compact inline layout.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description: 'Size variant; applies to input and buttons.',
    },

    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Number of grid columns for the label (horizontal layout only)',
      name: 'label-col',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Number of grid columns for the input (horizontal layout only)',
      name: 'input-col',
    },
    labelCols: {
      control: 'text',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4"',
      name: 'label-cols',
    },
    inputCols: {
      control: 'text',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8"',
      name: 'input-cols',
    },

    validation: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Force validation visuals (invalid). This is a controlled flag.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { defaultValue: { summary: 'Required field' }, category: 'Validation' },
      description: 'Message displayed when validation fails',
    },
    warningMessage: {
      control: 'text',
      name: 'warning-message',
      table: { defaultValue: { summary: '' }, category: 'Validation' },
      description: 'Optional warning message (displays with warning visuals)',
    },

    showOkButton: {
      control: 'boolean',
      name: 'show-ok-button',
      table: { category: 'Controls', defaultValue: { summary: true } },
      description: 'Show the OK/Close button in the picker (ignored when rangeTimePicker=true)',
    },
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Controls' },
      description: 'ARIA label for the component/input',
    },

    value: {
      control: 'text',
      table: { category: 'Value', disable: true },
      description: 'Current value of the input (reflected by component)',
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
    value: '',
  },
  render: (args) => Template(args),
};

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
  placeholder: '',
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
  validation: true,
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
  size: 'sm',
  labelCol: '',
  inputCol: '',
  inputId: 'size-drtp',
};
Sizes.storyName = 'Sizes';
Sizes.parameters = {
  docs: {
    description: {
      story: 'Size variants for the date/time range picker. Sizes are "", "sm", and "lg".',
    },
    story: { height: '525px' },
  },
};

export const PickerOnly_NoInput = Template.bind({});
PickerOnly_NoInput.args = {
  rangeTimePicker: true,
  showOkButton: false,
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

export const AccessibilityMatrix = (args) => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Date Range + Time Picker: common variants + computed <code>role</code>, <code>aria-*</code>, IDs.
    </div>
  `;
  root.appendChild(intro);

  const base = { ...args };
  const rows = [
    {
      title: 'Default',
      args: {
        ...base,
        formLayout: '',
        disabled: false,
        required: false,
        validation: false,
        rangeTimePicker: false,
        labelHidden: false,
      },
    },
    {
      title: 'Inline',
      args: {
        ...base,
        formLayout: 'inline',
        disabled: false,
        required: false,
        validation: false,
        rangeTimePicker: false,
        labelHidden: false,
        labelCol: '',
        inputCol: '',
      },
    },
    {
      title: 'Horizontal',
      args: {
        ...base,
        formLayout: 'horizontal',
        labelAlign: 'right',
        labelCol: 3,
        inputCol: 9,
        disabled: false,
        required: false,
        validation: false,
        rangeTimePicker: false,
        labelHidden: false,
      },
    },
    {
      title: 'Validation / Error (required + validation=true)',
      args: {
        ...base,
        formLayout: '',
        required: true,
        validation: true,
        validationMessage: 'Please enter a valid date/time range.',
        disabled: false,
        rangeTimePicker: false,
        labelHidden: false,
      },
    },
    {
      title: 'Disabled',
      args: {
        ...base,
        formLayout: '',
        disabled: true,
        required: false,
        validation: false,
        rangeTimePicker: false,
        labelHidden: false,
      },
    },
  ];

  rows.forEach((row, idx) => {
    root.appendChild(
      renderDRTPMatrixRow({
        ...row,
        idSuffix: String(idx + 1),
      }),
    );
  });

  return root;
};

AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  controls: { disable: true },
  docs: {
    description: {
      story:
        'Matrix of common Date Range + Time Picker states (default/inline/horizontal, validation/error, disabled) with computed roles, aria-* attributes, and IDs.',
    },
    story: { height: '1200px' },
  },
};
