import { action } from '@storybook/addon-actions';
import DatepickerDocs from './datepicker-component.docs.mdx';
import {
  buildDocsHtml,
  buildEl,
  renderMatrixRow,
} from './datepicker-component.story-helpers';

export default {
  title: 'Form/Datepicker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DatepickerDocs,
      description: {
        component:
          'A datepicker input with an optional attached calendar view. Supports Bootstrap-style layout and sizing, validation states, and custom formatting.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    calendar: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Core' },
      description: 'Standalone calendar view (no input group)',
    },
    plumage: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Core' },
      description: 'Render using Plumage styling',
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
    autocomplete: {
      control: { type: 'select' },
      options: ['off', 'bday', 'bday-day', 'bday-month', 'bday-year'],
      table: { defaultValue: { summary: 'off' }, category: 'Core' },
      description:
        'HTML autocomplete value for the input. Use "bday" / "bday-*" when the date represents a birthday. Default is "off".',
    },
    validationAttr: {
      control: 'boolean',
      name: 'validation-attr',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      description:
        'Turns on validation mode by adding the "validation" attribute. Component only validates if the attribute is present.',
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
    formLayout: {
      control: { type: 'select' },
      name: 'form-layout',
      options: ['', 'horizontal', 'inline'],
      description:
        'Form layout variant. "Horizontal" uses a grid layout with label and input side by side. "Inline" is similar but uses auto-width columns for a more compact display.',
      table: { category: 'Layout' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description:
        'Size variant. Applies Bootstrap-style sizing to the input and calendar button. Note: in horizontal layout, size only affects the input, not the label.',
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
    label: { control: 'text', table: { category: 'Layout' }, description: 'Label text for the input' },
    labelSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
      description: 'Size variant for the label',
    },
    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      table: { category: 'Layout', subcategory: 'Grid' },
      name: 'label-col',
      description: 'Number of grid columns for the label (horizontal layout only)',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'input-col',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Number of grid columns for the input (horizontal layout only)',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4"',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8"',
    },
    prepend: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Show calendar button before input',
    },
    append: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: true } },
      description: 'Show calendar button after input',
    },
    icon: { control: 'text', table: { category: 'Layout' }, description: 'Icon class for the calendar button' },
    dateFormat: {
      control: { type: 'select' },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      name: 'date-format',
      table: { category: 'Formatting', defaultValue: { summary: 'YYYY-MM-DD' } },
      description: 'Date format used for parsing and displaying the selected date.',
    },
    placeholder: {
      control: 'text',
      table: { category: 'Formatting', defaultValue: { summary: 'YYYY-MM-DD' } },
      description: 'Hint shown in the input (defaults to dateFormat if not provided)',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Identity', defaultValue: { summary: 'datepicker' } },
      description:
        'ID for the input element. If you omit the input-id attribute entirely, the component will generate a unique ID per instance.',
    },
    dropdownOpen: {
      control: 'boolean',
      name: 'dropdown-open',
      table: { disable: true, category: 'Demo Helpers', defaultValue: { summary: false } },
      description: 'Open the calendar dropdown (for demonstration purposes)',
    },
    displayContextExamples: {
      control: 'boolean',
      name: 'display-context-examples',
      table: { category: 'Demo Helpers', defaultValue: { summary: false } },
      description: 'Display context examples (for demonstration purposes)',
    },
  },
  args: {
    append: true,
    calendar: false,
    dateFormat: 'YYYY-MM-DD',
    disabled: false,
    displayContextExamples: false,
    dropdownOpen: false,
    formLayout: '',
    icon: 'fas fa-calendar-alt',
    inputCol: 10,
    inputCols: '',
    inputId: 'datepicker',
    label: 'Date Picker',
    labelAlign: '',
    labelCol: 2,
    labelCols: '',
    labelHidden: false,
    labelSize: '',
    placeholder: 'YYYY-MM-DD',
    plumage: false,
    prepend: false,
    required: false,
    size: '',
    autocomplete: 'off',
    validationAttr: false,
    validationMessage: 'Please select a date.',
    warningMessage: '',
  },
  render: args => buildEl(args, action),
};

const Template = args => buildEl(args, action);

export const Basic = Template.bind({});
Basic.args = {
  label: 'Select Date',
  labelCol: '',
  inputCol: '',
};
Basic.parameters = {
  docs: {
    description: {
      story: 'A basic datepicker with default settings. Click the calendar button to select a date.',
    },
    story: { height: '430px' },
  },
};

export const Plumage = Template.bind({});
Plumage.args = {
  plumage: true,
  label: 'Plumage Date',
  append: true,
  labelCol: '',
  inputCol: '',
};
Plumage.parameters = {
  docs: {
    description: {
      story: 'Datepicker rendered with Plumage styling. Note the different colors and focus styles.',
    },
    story: { height: '430px' },
  },
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  label: 'Start Date',
  labelAlign: 'right',
  labelHidden: false,
  labelCol: 3,
  inputCol: 9,
};
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'Datepicker with a horizontal form layout. Labels and inputs are aligned side by side.',
    },
    story: { height: '430px' },
  },
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  label: 'Inline Date',
  labelHidden: false,
  labelCols: '',
  inputCols: '',
  labelCol: '',
  inputCol: '',
};
InlineLayout.parameters = {
  docs: {
    description: {
      story: 'Datepicker with an inline form layout. Labels and inputs are aligned inline.',
    },
    story: { height: '430px' },
  },
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  required: true,
  validationAttr: true,
  validationMessage: 'Date is required.',
  placeholder: 'YYYY-MM-DD',
  labelCol: '',
  inputCol: '',
};
WithValidation.parameters = {
  docs: {
    description: {
      story: 'Datepicker with validation enabled. Try leaving the field empty then blurring to see the validation message.',
    },
    story: { height: '430px' },
  },
};

export const DateFormat = Template.bind({});
DateFormat.args = {
  dateFormat: 'MM-DD-YYYY',
  placeholder: 'MM-DD-YYYY',
  label: 'Date Format',
  labelCol: '',
  inputCol: '',
};
DateFormat.parameters = {
  docs: {
    description: {
      story: 'Datepicker using MM-DD-YYYY format. The input and calendar will use the specified format for displaying and parsing dates.',
    },
    story: { height: '430px' },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  labelCol: '',
  inputCol: '',
};
Disabled.parameters = {
  docs: {
    description: {
      story: 'Datepicker in a disabled state. The input and calendar are not interactive.',
    },
  },
};

export const Sizes = Template.bind({});
Sizes.args = {
  size: 'sm',
  label: 'Small Date',
  labelCol: '',
  inputCol: '',
};
Sizes.parameters = {
  docs: {
    description: {
      story: 'Datepicker with different size options. Try changing the size to see the effect.',
    },
    story: { height: '430px' },
  },
};

export const PrependIcon = Template.bind({});
PrependIcon.args = {
  prepend: true,
  append: false,
  label: 'Prepend Button',
  labelCol: '',
  inputCol: '',
};
PrependIcon.parameters = {
  docs: {
    description: {
      story: 'Datepicker with a prepend icon. The icon appears before the input field.',
    },
    story: { height: '430px' },
  },
};

export const StandaloneCalendar = Template.bind({});
StandaloneCalendar.args = {
  calendar: true,
  displayContextExamples: true,
  label: 'Calendar Only',
  labelCol: '',
  inputCol: '',
};
StandaloneCalendar.parameters = {
  docs: {
    description: {
      story: 'Datepicker displayed as a standalone calendar. No input field is shown.',
    },
  },
};

export const AccessibilityMatrix = () => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + IDs.
      Also reports whether <code>aria-labelledby</code> / <code>aria-describedby</code> resolve to real elements and whether help text is outside the dialog.
    </div>
  `;
  root.appendChild(intro);

  const rows = [
    {
      title: 'Default',
      args: { label: 'Date', formLayout: '', disabled: false, required: false, validationAttr: false, autocomplete: 'off' },
      forceInvalid: false,
    },
    {
      title: 'Inline',
      args: { label: 'Date', formLayout: 'inline', disabled: false, required: false, validationAttr: false, autocomplete: 'off' },
      forceInvalid: false,
    },
    {
      title: 'Horizontal',
      args: { label: 'Date', formLayout: 'horizontal', labelCol: 3, inputCol: 9, disabled: false, required: false, validationAttr: false, autocomplete: 'off' },
      forceInvalid: false,
    },
    {
      title: 'Validation / Error (required + validation attr)',
      args: { label: 'Date', formLayout: '', required: true, validationAttr: true, validationMessage: 'Date is required.', autocomplete: 'off' },
      forceInvalid: true,
    },
    {
      title: 'Disabled',
      args: { label: 'Date', formLayout: '', disabled: true, required: false, validationAttr: false, autocomplete: 'off' },
      forceInvalid: false,
    },
  ];

  rows.forEach((row, idx) => {
    root.appendChild(
      renderMatrixRow({
        ...row,
        idSuffix: String(idx + 1),
        buildEl,
        action,
      }),
    );
  });

  return root;
};

AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of key states (default/inline/horizontal, validation/error, disabled). Each row prints computed role/aria/ids and whether ARIA references resolve.',
    },
    story: { height: '1100px' },
  },
  controls: { disable: true },
};
