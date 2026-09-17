// File: src/stories/plumage-datepicker-component.stories.js

import { action } from 'storybook/actions';

import {
  buildDocsHtml,
  buildDocsHtmlControlledValue,
  buildEl,
  renderMatrixRow,
  setDateValueWhenReady,
  updateArgsBestEffort,
} from './plumage-datepicker-component.story-helpers';

const baseArgs = {
  append: true,
  calendar: false,
  dateFormat: 'YYYY-MM-DD',
  disabled: false,
  readOnly: false,
  displayContextExamples: false,
  dropdownOpen: false,
  formLayout: '',
  icon: 'fas fa-calendar-alt',
  inputCol: 10,
  inputCols: '',
  inputId: 'plumage-datepicker',
  label: 'Date Picker',
  labelAlign: '',
  labelCol: 2,
  labelCols: '',
  labelHidden: false,
  labelSize: '',
  placeholder: '',
  prepend: false,
  required: false,
  size: '',
  validationAttr: false,
  validationMessage: 'Please select a date.',
  warningMessage: '',
  value: '',
};

const renderTemplate = args => buildEl(args, action);

export default {
  title: 'Plumage/Plumage Datepicker',

  parameters: {

     themeFamily: 'plumage',
    docs: {
      description: {
        component:
          'A Plumage-styled datepicker input with an optional attached calendar view. Supports responsive form layouts, sizing, validation states, disabled/read-only modes, externally controlled values, custom date formatting, and a standalone calendar.',
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
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description: 'Render the standalone calendar view instead of the input/dropdown datepicker.',
    },

    disabled: {
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description: 'Disable the date input and calendar toggle.',
    },

    readOnly: {
      control: 'boolean',
      name: 'read-only',
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description: 'Make the date input read-only and prevent calendar interaction while preserving its value.',
    },

    required: {
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
        category: 'Validation',
      },
      description: 'Mark the date input as required.',
    },

    validationAttr: {
      control: 'boolean',
      name: 'validation',
      table: {
        defaultValue: { summary: false },
        category: 'Validation',
      },
      description: 'Enable component validation by adding the validation attribute.',
    },

    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: {
        defaultValue: {
          summary: 'Please select a date.',
        },
        category: 'Validation',
      },
      description: 'Validation message displayed when the component is invalid.',
    },

    warningMessage: {
      control: 'text',
      name: 'warning-message',
      table: {
        defaultValue: { summary: '' },
        category: 'Validation',
      },
      description: 'Optional warning text displayed instead of the standard validation message while the field is invalid.',
    },

    formLayout: {
      control: { type: 'select' },
      name: 'form-layout',
      options: ['', 'horizontal', 'inline'],
      table: {
        category: 'Layout',
      },
      description:
        'Form layout variant. Horizontal uses Bootstrap-style label/input columns. Inline uses a compact row layout.',
    },

    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: {
        category: 'Layout',
      },
      description: 'Input-group sizing variant.',
    },

    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: {
        category: 'Layout',
      },
      description: 'Alignment of visible label text.',
    },

    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: {
        category: 'Layout',
        defaultValue: { summary: false },
      },
      description: 'Hide the visual label and use the label text as the input aria-label.',
    },

    label: {
      control: 'text',
      table: {
        category: 'Layout',
      },
      description: 'Label text associated with the date input.',
    },

    labelSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'label-size',
      table: {
        category: 'Layout',
      },
      description: 'Label sizing used by horizontal layouts.',
    },

    labelCol: {
      control: {
        type: 'number',
        min: 0,
        max: 12,
        step: 1,
      },
      name: 'label-col',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description: 'Numeric label grid width for horizontal layout when labelCols is not provided.',
    },

    inputCol: {
      control: {
        type: 'number',
        min: 0,
        max: 12,
        step: 1,
      },
      name: 'input-col',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description: 'Numeric input grid width for horizontal layout when inputCols is not provided.',
    },

    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description: 'Responsive label column specification such as "col-sm-3 col-md-4" or "xs-12 sm-6 md-4".',
    },

    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description: 'Responsive input column specification such as "col-sm-9 col-md-8" or "xs-12 sm-6 md-8".',
    },

    prepend: {
      control: 'boolean',
      table: {
        category: 'Layout',
        defaultValue: { summary: false },
      },
      description: 'Show the calendar toggle before the input.',
    },

    append: {
      control: 'boolean',
      table: {
        category: 'Layout',
        defaultValue: { summary: true },
      },
      description: 'Show the calendar toggle after the input.',
    },

    icon: {
      control: 'text',
      table: {
        category: 'Layout',
      },
      description: 'Icon class used by the calendar toggle button.',
    },

    dateFormat: {
      control: { type: 'select' },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      name: 'date-format',
      table: {
        category: 'Formatting',
        defaultValue: { summary: 'YYYY-MM-DD' },
      },
      description: 'Format used when parsing and displaying date values.',
    },

    placeholder: {
      control: 'text',
      table: {
        category: 'Formatting',
        defaultValue: {
          summary: 'Defaults to date-format',
        },
      },
      description: 'Optional custom placeholder. When omitted, the component uses dateFormat.',
    },

    value: {
      control: 'text',
      table: {
        category: 'Value',
        defaultValue: { summary: '' },
      },
      description:
        'Initial or externally controlled date value. The component accepts YYYY-MM-DD and MM-DD-YYYY values.',
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      table: {
        category: 'Identity',
        defaultValue: { summary: 'plumage-datepicker' },
      },
      description:
        'ID assigned to the internal input and used as the base for related accessibility IDs. When omitted, the component generates a unique ID.',
    },

    dropdownOpen: {
      control: 'boolean',
      name: 'dropdown-open',
      table: {
        disable: true,
        category: 'Demo Helpers',
        defaultValue: { summary: false },
      },
      description: 'Open the calendar dropdown for demonstration purposes.',
    },

    displayContextExamples: {
      control: 'boolean',
      name: 'display-context-examples',
      table: {
        category: 'Demo Helpers',
        defaultValue: { summary: false },
      },
      description: 'Display the component’s selected-date and active-date context output.',
    },
  },

  args: {
    ...baseArgs,
  },

  render: renderTemplate,
};

export const Basic = {
  name: 'Basic',
  render: renderTemplate,
  args: {
    ...baseArgs,
    label: 'Select Date',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic Plumage datepicker with the default date format and appended calendar button.',
      },
      story: { height: '430px' },
    },
  },
};

export const Value = {
  name: 'Initial Value',
  render: renderTemplate,
  args: {
    ...baseArgs,
    label: 'Scheduled Date',
    value: '2026-07-20',
    inputId: 'plumage-datepicker-value',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A datepicker initialized with a value. A valid value initializes the selected date, calendar month, and input display.',
      },
      story: { height: '430px' },
    },
  },
};

export const ControlledValue = {
  name: 'Controlled Value',

  args: {
    ...baseArgs,
    label: 'Controlled Date',
    inputId: 'plumage-datepicker-controlled',
    value: '2026-07-20',
    labelCol: '',
    inputCol: '',
  },

  render: (args, ctx) => {
    const wrap = document.createElement('div');

    wrap.style.maxWidth = '680px';
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';

    const element = buildEl(args, action);

    const note = document.createElement('div');

    note.style.fontSize = '13px';
    note.style.color = '#444';
    note.innerHTML = `
      Controlled example: external buttons update the component's
      <code>value</code>, and <code>date-selected</code> updates the
      same external value.
    `;

    const buttons = document.createElement('div');

    buttons.style.display = 'flex';
    buttons.style.gap = '8px';
    buttons.style.flexWrap = 'wrap';

    const makeButton = text => {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'btn btn-sm btn-secondary';
      button.textContent = text;

      return button;
    };

    const julyButton = makeButton('Set 2026-07-20');
    const augustButton = makeButton('Set 2026-08-15');
    const clearButton = makeButton('Clear');

    const eventDetailToValue = detail => {
      if (typeof detail === 'string') {
        return detail;
      }

      if (!detail || typeof detail !== 'object') {
        return '';
      }

      if (typeof detail.value === 'string') {
        return detail.value;
      }

      if (typeof detail.date === 'string') {
        return detail.date;
      }

      return '';
    };

    const applyValue = async nextValue => {
      const value = typeof nextValue === 'string' ? nextValue.trim() : '';

      await setDateValueWhenReady(element, value);

      updateArgsBestEffort(ctx, {
        value,
      });
    };

    julyButton.addEventListener('click', () => {
      void applyValue('2026-07-20');
    });

    augustButton.addEventListener('click', () => {
      void applyValue('2026-08-15');
    });

    clearButton.addEventListener('click', () => {
      void applyValue('');
    });

    element.addEventListener('date-selected', event => {
      const emittedValue = eventDetailToValue(event.detail);

      const value = emittedValue || String(element.value ?? '').trim();

      if (!value) {
        return;
      }

      void applyValue(value);
    });

    buttons.appendChild(julyButton);
    buttons.appendChild(augustButton);
    buttons.appendChild(clearButton);

    wrap.appendChild(note);
    wrap.appendChild(element);
    wrap.appendChild(buttons);

    return wrap;
  },

  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () => buildDocsHtmlControlledValue(),
      },
      description: {
        story:
          'Demonstrates the datepicker as a controlled component. External buttons update the value, while calendar selections update the same external value.',
      },
      story: { height: '480px' },
    },
  },
};

export const HorizontalLayout = {
  name: 'Horizontal Layout',
  render: renderTemplate,
  args: {
    ...baseArgs,
    formLayout: 'horizontal',
    label: 'Start Date',
    labelAlign: 'right',
    labelHidden: false,
    labelCol: 3,
    inputCol: 9,
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout using a 3/9 Bootstrap-style label and input grid.',
      },
      story: { height: '430px' },
    },
  },
};

export const ResponsiveHorizontalLayout = {
  name: 'Responsive Horizontal Layout',
  render: renderTemplate,
  args: {
    ...baseArgs,
    formLayout: 'horizontal',
    label: 'Responsive Date',
    labelCols: 'sm-4 md-3',
    inputCols: 'sm-8 md-9',
    labelCol: 2,
    inputCol: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout using responsive label-cols and input-cols specifications.',
      },
      story: { height: '430px' },
    },
  },
};

export const InlineLayout = {
  name: 'Inline Layout',
  render: renderTemplate,
  args: {
    ...baseArgs,
    formLayout: 'inline',
    label: 'Inline Date',
    labelHidden: false,
    labelCols: '',
    inputCols: '',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Datepicker using the inline form layout.',
      },
      story: { height: '430px' },
    },
  },
};

export const WithValidation = {
  name: 'With Validation',
  render: renderTemplate,
  args: {
    ...baseArgs,
    required: true,
    validationAttr: true,
    validationMessage: 'Please select a date.',
    label: 'Required Date',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Datepicker with validation enabled. Clear the field or enter an incomplete date to see validation feedback.',
      },
      story: { height: '430px' },
    },
  },
};

export const WarningValidation = {
  name: 'Validation Warning',
  render: renderTemplate,
  args: {
    ...baseArgs,
    required: true,
    validationAttr: true,
    validationMessage: 'Please select a date.',
    warningMessage: 'Check the entered date before continuing.',
    label: 'Review Date',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays warning feedback when the component enters an invalid state.',
      },
      story: { height: '430px' },
    },
  },
};

export const DateFormat = {
  name: 'Date Format',
  render: renderTemplate,
  args: {
    ...baseArgs,
    dateFormat: 'MM-DD-YYYY',
    placeholder: '',
    label: 'US Date Format',
    value: '07-20-2026',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Datepicker using MM-DD-YYYY formatting.',
      },
      story: { height: '430px' },
    },
  },
};

export const CustomPlaceholder = {
  name: 'Custom Placeholder',
  render: renderTemplate,
  args: {
    ...baseArgs,
    dateFormat: 'YYYY-MM-DD',
    placeholder: 'Choose a date',
    label: 'Custom Hint',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses a custom input placeholder while date-format continues to control parsing and formatting.',
      },
      story: { height: '430px' },
    },
  },
};

export const Disabled = {
  name: 'Disabled',
  render: renderTemplate,
  args: {
    ...baseArgs,
    disabled: true,
    label: 'Disabled Date',
    value: '2026-07-20',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled datepicker with a visible but non-interactive value.',
      },
    },
  },
};

export const ReadOnly = {
  name: 'Read Only',
  render: renderTemplate,
  args: {
    ...baseArgs,
    readOnly: true,
    label: 'Read Only Date',
    value: '2026-07-20',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only datepicker. The value remains visible and the calendar button is not rendered.',
      },
    },
  },
};

export const Small = {
  name: 'Small',
  render: renderTemplate,
  args: {
    ...baseArgs,
    size: 'sm',
    label: 'Small Date',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Datepicker using the small input-group size.',
      },
      story: { height: '430px' },
    },
  },
};

export const Large = {
  name: 'Large',
  render: renderTemplate,
  args: {
    ...baseArgs,
    size: 'lg',
    label: 'Large Date',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Datepicker using the large input-group size.',
      },
      story: { height: '460px' },
    },
  },
};

export const PrependIcon = {
  name: 'Prepend Icon',
  render: renderTemplate,
  args: {
    ...baseArgs,
    prepend: true,
    append: false,
    label: 'Prepend Button',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar button rendered before the input using the prepend attribute.',
      },
      story: { height: '430px' },
    },
  },
};

export const HiddenLabel = {
  name: 'Hidden Label',
  render: renderTemplate,
  args: {
    ...baseArgs,
    label: 'Appointment Date',
    labelHidden: true,
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hides the visible label while retaining an accessible label for the input.',
      },
      story: { height: '430px' },
    },
  },
};

export const StandaloneCalendar = {
  name: 'Standalone Calendar',
  render: renderTemplate,
  args: {
    ...baseArgs,
    calendar: true,
    displayContextExamples: true,
    label: 'Calendar Only',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standalone calendar mode renders the calendar directly without an input or dropdown.',
      },
      story: { height: '650px' },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: () => {
    const root = document.createElement('div');

    root.className = 'plumage-datepicker-accessibility-matrix';

    const intro = document.createElement('div');

    intro.innerHTML = `
      <div class="plumage-datepicker-accessibility-matrix__intro-title">
        Accessibility matrix
      </div>
      <div class="plumage-datepicker-accessibility-matrix__intro-description">
        Renders common Plumage datepicker variants and prints their computed
        <code>role</code>, <code>aria-*</code>, IDs, field state, and ARIA
        reference resolution.
      </div>
    `;

    root.appendChild(intro);

    const rows = [
      {
        title: 'Default',
        args: {
          ...baseArgs,
          label: 'Date',
          value: '',
        },
        forceInvalid: false,
      },
      {
        title: 'With Value',
        args: {
          ...baseArgs,
          label: 'Date',
          value: '2026-07-20',
        },
        forceInvalid: false,
      },
      {
        title: 'Hidden Label',
        args: {
          ...baseArgs,
          label: 'Date',
          labelHidden: true,
          value: '',
        },
        forceInvalid: false,
      },
      {
        title: 'Inline',
        args: {
          ...baseArgs,
          label: 'Date',
          formLayout: 'inline',
          value: '',
        },
        forceInvalid: false,
      },
      {
        title: 'Horizontal',
        args: {
          ...baseArgs,
          label: 'Date',
          formLayout: 'horizontal',
          labelCol: 3,
          inputCol: 9,
          value: '',
        },
        forceInvalid: false,
      },
      {
        title: 'Validation / Error',
        args: {
          ...baseArgs,
          label: 'Date',
          required: true,
          validationAttr: true,
          validationMessage: 'Date is required.',
          value: '',
        },
        forceInvalid: true,
      },
      {
        title: 'Disabled',
        args: {
          ...baseArgs,
          label: 'Date',
          disabled: true,
          value: '2026-07-20',
        },
        forceInvalid: false,
      },
      {
        title: 'Read Only',
        args: {
          ...baseArgs,
          label: 'Date',
          readOnly: true,
          value: '2026-07-20',
        },
        forceInvalid: false,
      },
      {
        title: 'Standalone Calendar',
        args: {
          ...baseArgs,
          calendar: true,
          value: '',
        },
        forceInvalid: false,
      },
    ];

    rows.forEach((row, index) => {
      root.appendChild(
        renderMatrixRow({
          ...row,
          idSuffix: String(index + 1),
          buildEl,
          action,
        }),
      );
    });

    return root;
  },

  parameters: {
    docs: {
      description: {
        story:
          'Computed accessibility matrix covering populated, hidden-label, inline, horizontal, validation, disabled, read-only, and standalone-calendar variants.',
      },
      story: { height: '2100px' },
    },
    controls: { disable: true },
  },
};
