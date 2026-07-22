// File: src/stories/datepicker-component.stories.js

import { action } from '@storybook/addon-actions';
import DatepickerDocs from './datepicker-component.docs.mdx';
import { buildDocsHtml, buildDocsHtmlControlledValue, buildEl, renderMatrixRow, setDateValueWhenReady, updateArgsBestEffort } from './datepicker-component.story-helpers';

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
  value: '',
};

const renderTemplate = args => buildEl(args, action);

export default {
  title: 'Form/Datepicker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DatepickerDocs,
      description: {
        component:
          'A datepicker input with an optional attached calendar view. Supports Bootstrap-style layout and sizing, validation states, disabled/read-only modes, externally supplied values, and custom formatting.',
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
      description: 'Standalone calendar view (no input group)',
    },
    plumage: {
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description: 'Render using Plumage styling',
    },
    disabled: {
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description: 'Disable the input and calendar button',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description: 'Make the input read-only and disable calendar toggles while preserving the field value',
    },
    required: {
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
        category: 'Validation',
      },
      description: 'Mark the input as required',
    },
    autocomplete: {
      control: { type: 'select' },
      options: ['off', 'bday', 'bday-day', 'bday-month', 'bday-year'],
      table: {
        defaultValue: { summary: 'off' },
        category: 'Core',
      },
      description: 'HTML autocomplete value for the input. Use "bday" / "bday-*" when the date represents a birthday. Default is "off".',
    },
    validationAttr: {
      control: 'boolean',
      name: 'validation-attr',
      table: {
        defaultValue: { summary: false },
        category: 'Validation',
      },
      description: 'Turns on validation mode by adding the "validation" attribute. Component only validates if the attribute is present.',
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
      description: 'Message displayed when validation fails',
    },
    warningMessage: {
      control: 'text',
      name: 'warning-message',
      table: {
        defaultValue: { summary: '' },
        category: 'Validation',
      },
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
      description: 'Size variant. Applies Bootstrap-style sizing to the input and calendar button. Note: in horizontal layout, size only affects the input, not the label.',
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
      table: {
        category: 'Layout',
        defaultValue: { summary: false },
      },
      description: 'Visually hide the label (but keep it accessible to screen readers)',
    },
    label: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Label text for the input',
    },
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
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      name: 'label-col',
      description: 'Number of grid columns for the label (horizontal layout only)',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'input-col',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description: 'Number of grid columns for the input (horizontal layout only)',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4"',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8"',
    },
    prepend: {
      control: 'boolean',
      table: {
        category: 'Layout',
        defaultValue: { summary: false },
      },
      description: 'Show calendar button before input',
    },
    append: {
      control: 'boolean',
      table: {
        category: 'Layout',
        defaultValue: { summary: true },
      },
      description: 'Show calendar button after input',
    },
    icon: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Icon class for the calendar button',
    },
    dateFormat: {
      control: { type: 'select' },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      name: 'date-format',
      table: {
        category: 'Formatting',
        defaultValue: { summary: 'YYYY-MM-DD' },
      },
      description: 'Date format used for parsing and displaying the selected date.',
    },
    placeholder: {
      control: 'text',
      table: {
        category: 'Formatting',
        defaultValue: { summary: 'YYYY-MM-DD' },
      },
      description: 'Hint shown in the input (defaults to dateFormat if not provided)',
    },
    value: {
      control: 'text',
      table: {
        category: 'Value',
        defaultValue: { summary: '' },
      },
      description: 'Initial or externally controlled date value. The value must match dateFormat, such as "2026-07-20" or "07-20-2026".',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: {
        category: 'Identity',
        defaultValue: { summary: 'datepicker' },
      },
      description: 'ID for the input element. If you omit the input-id attribute entirely, the component will generate a unique ID per instance.',
    },
    dropdownOpen: {
      control: 'boolean',
      name: 'dropdown-open',
      table: {
        disable: true,
        category: 'Demo Helpers',
        defaultValue: { summary: false },
      },
      description: 'Open the calendar dropdown (for demonstration purposes)',
    },
    displayContextExamples: {
      control: 'boolean',
      name: 'display-context-examples',
      table: {
        category: 'Demo Helpers',
        defaultValue: { summary: false },
      },
      description: 'Display context examples (for demonstration purposes)',
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
        story: 'A basic datepicker with default settings. Click the calendar button to select a date.',
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
    inputId: 'datepicker-value',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'A datepicker initialized with a value. The component parses the value using dateFormat, displays it in the input, and opens the calendar to the selected month.',
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
    inputId: 'datepicker-controlled',
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
      <code>value</code>, and calendar selections update the same
      external value.
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
          'Demonstrates the datepicker as a controlled component. External buttons update the value and selected calendar date, while calendar selections update the same external source of truth.',
      },
      story: {
        height: '480px',
      },
    },
  },
};

export const Plumage = {
  name: 'Plumage',
  render: renderTemplate,
  args: {
    ...baseArgs,
    plumage: true,
    label: 'Plumage Date',
    append: true,
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Datepicker rendered with Plumage styling. Note the different colors and focus styles.',
      },
      story: { height: '430px' },
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
        story: 'Datepicker with a horizontal form layout. Labels and inputs are aligned side by side.',
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
        story: 'Datepicker with an inline form layout. Labels and inputs are aligned inline.',
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
    validationMessage: 'Date is required.',
    placeholder: 'YYYY-MM-DD',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Datepicker with validation enabled. Try leaving the field empty then blurring to see the validation message.',
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
    placeholder: 'MM-DD-YYYY',
    label: 'Date Format',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Datepicker using MM-DD-YYYY format. The input and calendar use the specified format for displaying and parsing dates.',
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
        story: 'Datepicker in a disabled state. The value remains visible, but the input and calendar are not interactive.',
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
        story: 'Datepicker in a read-only state. The value remains visible and read-only, and the calendar toggle is not interactive.',
      },
    },
  },
};

export const Sizes = {
  name: 'Sizes',
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
        story: 'Datepicker with different size options. Try changing the size to see the effect.',
      },
      story: { height: '430px' },
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
        story: 'Datepicker with a prepend icon. The icon appears before the input field.',
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
        story: 'Datepicker displayed as a standalone calendar. No input field is shown.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '16px';

    const intro = document.createElement('div');
    intro.innerHTML = `
      <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
      <div style="font-size:13px; color:#444;">
        Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + IDs.
        Also reports whether <code>aria-labelledby</code> / <code>aria-describedby</code> resolve to real elements,
        whether help text is outside the dialog, and the current input value.
      </div>
    `;
    root.appendChild(intro);

    const rows = [
      {
        title: 'Default',
        args: {
          label: 'Date',
          formLayout: '',
          disabled: false,
          readOnly: false,
          required: false,
          validationAttr: false,
          autocomplete: 'off',
          value: '',
        },
        forceInvalid: false,
      },
      {
        title: 'With Value',
        args: {
          label: 'Date',
          formLayout: '',
          disabled: false,
          readOnly: false,
          required: false,
          validationAttr: false,
          autocomplete: 'off',
          value: '2026-07-20',
        },
        forceInvalid: false,
      },
      {
        title: 'Inline',
        args: {
          label: 'Date',
          formLayout: 'inline',
          disabled: false,
          readOnly: false,
          required: false,
          validationAttr: false,
          autocomplete: 'off',
          value: '',
        },
        forceInvalid: false,
      },
      {
        title: 'Horizontal',
        args: {
          label: 'Date',
          formLayout: 'horizontal',
          labelCol: 3,
          inputCol: 9,
          disabled: false,
          readOnly: false,
          required: false,
          validationAttr: false,
          autocomplete: 'off',
          value: '',
        },
        forceInvalid: false,
      },
      {
        title: 'Validation / Error (required + validation attr)',
        args: {
          label: 'Date',
          formLayout: '',
          required: true,
          validationAttr: true,
          validationMessage: 'Date is required.',
          autocomplete: 'off',
          value: '',
        },
        forceInvalid: true,
      },
      {
        title: 'Disabled',
        args: {
          label: 'Date',
          formLayout: '',
          disabled: true,
          readOnly: false,
          required: false,
          validationAttr: false,
          autocomplete: 'off',
          value: '2026-07-20',
        },
        forceInvalid: false,
      },
      {
        title: 'Read Only',
        args: {
          label: 'Date',
          formLayout: '',
          disabled: false,
          readOnly: true,
          required: false,
          validationAttr: false,
          autocomplete: 'off',
          value: '2026-07-20',
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
          'Matrix of key states including a populated value, default/inline/horizontal layouts, validation/error, disabled, and read-only. Each row prints computed role/aria/IDs, the input value, and whether ARIA references resolve.',
      },
      story: { height: '1480px' },
    },
    controls: { disable: true },
  },
};
