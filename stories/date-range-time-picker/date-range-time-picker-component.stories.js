// File: stories/date-range-time-picker-component.stories.js

import DocsPage from './date-range-time-picker-component.docs.mdx';
import {
  buildDocsHtml,
  buildDocsHtmlControlledValue,
  Template,
  renderDRTPMatrixRow,
  setDateRangeTimeValueWhenReady,
  updateArgsBestEffort,
} from './date-range-time-picker-component.story-helpers.js';

const baseArgs = {
  appendProp: true,
  ariaLabel: '',
  dateFormat: 'YYYY-MM-DD',
  disabled: false,
  readOnly: false,
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
};

const renderTemplate = args => Template(args);

export default {
  title: 'Form/Date Range + Time Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component:
          'A combined date range and time picker, with flexible display and layout options.',
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
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description: 'Render using Plumage styling.',
    },

    rangeTimePicker: {
      control: 'boolean',
      name: 'range-time-picker',
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description:
        'Render only the picker without an input group. The OK/Close button is not rendered.',
    },

    disabled: {
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description:
        'Disable the main input and rendered calendar controls.',
    },

    readOnly: {
      control: 'boolean',
      name: 'read-only',
      table: {
        defaultValue: { summary: false },
        category: 'Core',
      },
      description:
        'Make the main input read-only and remove interactive calendar and clear controls.',
    },

    required: {
      control: 'boolean',
      table: {
        defaultValue: { summary: false },
        category: 'Validation',
      },
      description: 'Mark the input as required.',
    },

    dateFormat: {
      control: {
        type: 'select',
      },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      name: 'date-format',
      table: {
        category: 'Formatting',
        defaultValue: {
          summary: 'YYYY-MM-DD',
        },
      },
      description:
        'Date format used for parsing and displaying selected dates.',
    },

    isTwentyFourHourFormat: {
      control: 'boolean',
      name: 'is-twenty-four-hour-format',
      table: {
        category: 'Formatting',
        defaultValue: {
          summary: true,
        },
      },
      description:
        'Use 24-hour time inputs when true and 12-hour time inputs when false.',
    },

    showDuration: {
      control: 'boolean',
      name: 'show-duration',
      table: {
        category: 'Formatting',
        defaultValue: {
          summary: false,
        },
      },
      description:
        'Show the duration between the selected start and end date-times.',
    },

    showYmd: {
      control: 'boolean',
      name: 'show-ymd',
      table: {
        category: 'Formatting',
        defaultValue: {
          summary: false,
        },
      },
      description: 'Force YYYY-MM-DD date display.',
    },

    showLong: {
      control: 'boolean',
      name: 'show-long',
      table: {
        category: 'Formatting',
        defaultValue: {
          summary: false,
        },
      },
      description: 'Display dates using the long date format.',
    },

    showIso: {
      control: 'boolean',
      name: 'show-iso',
      table: {
        category: 'Formatting',
        defaultValue: {
          summary: false,
        },
      },
      description:
        'Show and accept full ISO date-time values in the main input.',
    },

    placeholder: {
      control: 'text',
      table: {
        category: 'Input',
      },
      description:
        'Placeholder text. When empty, the component calculates a placeholder from the display format and joinBy value.',
    },

    joinBy: {
      control: 'text',
      table: {
        category: 'Input',
        defaultValue: {
          summary: ' - ',
        },
      },
      description:
        'Separator placed between the start and end date-time values.',
    },

    icon: {
      control: 'text',
      table: {
        category: 'Input',
        defaultValue: {
          summary: 'fas fa-calendar-alt',
        },
      },
      description: 'CSS classes used for the calendar button icon.',
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      table: {
        category: 'Input',
        defaultValue: {
          summary: 'date-range-time',
        },
      },
      description: 'ID assigned to the main input element.',
    },

    appendProp: {
      control: 'boolean',
      name: 'append-prop',
      table: {
        category: 'Input',
        defaultValue: {
          summary: true,
        },
      },
      description:
        'Render an appended calendar button that opens the picker.',
    },

    prependProp: {
      control: 'boolean',
      name: 'prepend-prop',
      table: {
        category: 'Input',
        defaultValue: {
          summary: false,
        },
      },
      description:
        'Render a prepended calendar button that opens the picker.',
    },

    label: {
      control: 'text',
      table: {
        category: 'Layout',
        defaultValue: {
          summary: 'Date and Time Picker',
        },
      },
      description: 'Label text for the main input.',
    },

    labelAlign: {
      control: {
        type: 'select',
      },
      options: ['', 'right'],
      name: 'label-align',
      table: {
        category: 'Layout',
      },
      description:
        'Label alignment when the label is visible.',
    },

    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: {
        category: 'Layout',
        defaultValue: {
          summary: false,
        },
      },
      description:
        'Visually hide the label while keeping it available to assistive technologies.',
    },

    formLayout: {
      control: {
        type: 'select',
      },
      name: 'form-layout',
      options: ['', 'horizontal', 'inline'],
      table: {
        category: 'Layout',
      },
      description:
        'Form layout. Horizontal uses grid columns and inline uses a compact row layout.',
    },

    size: {
      control: {
        type: 'select',
      },
      options: ['', 'sm', 'lg'],
      table: {
        category: 'Layout',
      },
      description:
        'Size variant applied to the input and rendered controls.',
    },

    labelCol: {
      control: {
        type: 'number',
        min: 0,
        max: 12,
        step: 1,
      },
      table: {
        category: 'Layout',
        subcategory: 'Grid',
        defaultValue: {
          summary: 2,
        },
      },
      description:
        'Number of grid columns used by the label in horizontal layout.',
      name: 'label-col',
    },

    inputCol: {
      control: {
        type: 'number',
        min: 0,
        max: 12,
        step: 1,
      },
      table: {
        category: 'Layout',
        subcategory: 'Grid',
        defaultValue: {
          summary: 10,
        },
      },
      description:
        'Number of grid columns used by the input in horizontal layout.',
      name: 'input-col',
    },

    labelCols: {
      control: 'text',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description:
        'Responsive label column classes, such as "col-sm-3 col-md-4" or "xs-12 sm-6 md-4".',
      name: 'label-cols',
    },

    inputCols: {
      control: 'text',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description:
        'Responsive input column classes, such as "col-sm-9 col-md-8" or "xs-12 sm-6 md-8".',
      name: 'input-cols',
    },

    validation: {
      control: 'boolean',
      table: {
        category: 'Validation',
        defaultValue: {
          summary: false,
        },
      },
      description:
        'Force invalid validation visuals. This is a controlled property.',
    },

    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: {
        defaultValue: {
          summary: 'Required field',
        },
        category: 'Validation',
      },
      description: 'Message displayed when validation fails.',
    },

    warningMessage: {
      control: 'text',
      name: 'warning-message',
      table: {
        defaultValue: {
          summary: '',
        },
        category: 'Validation',
      },
      description:
        'Optional warning message displayed with warning visuals.',
    },

    showOkButton: {
      control: 'boolean',
      name: 'show-ok-button',
      table: {
        category: 'Controls',
        defaultValue: {
          summary: true,
        },
      },
      description:
        'Show the OK/Close button. This is ignored in picker-only mode.',
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: {
        category: 'Controls',
      },
      description:
        'Accessible label used by the picker dialog or input.',
    },

    value: {
      control: 'text',
      table: {
        category: 'Value',
        defaultValue: {
          summary: '',
        },
      },
      description:
        'Initial or externally controlled date-time range value displayed in the main input.',
    },
  },

  args: {
    ...baseArgs,
  },

  render: renderTemplate,
};

export const Basic = {
  name: 'Basic Usage',
  render: renderTemplate,
  args: {
    ...baseArgs,
    label: 'Meeting Time',
    placeholder: 'Select a date and time range',
    labelCol: '',
    inputCol: '',
    inputId: 'meeting-time',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic date and time range picker with default settings.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const Value = {
  name: 'Initial Value',
  render: renderTemplate,
  args: {
    ...baseArgs,
    inputId: 'value-drtp',
    label: 'Scheduled Maintenance',
    labelCol: '',
    inputCol: '',
    value: '2026-07-20 09:00 - 2026-08-20 17:00',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A date and time range picker initialized with a value through the value property.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const ControlledValue = {
  name: 'Controlled Value',

  args: {
    ...baseArgs,
    inputId: 'controlled-drtp',
    label: 'Controlled Date/Time Range',
    labelCol: '',
    inputCol: '',
    value: '2026-07-20 09:00 - 2026-08-20 12:00',
  },

  render: (args, ctx) => {
    const wrap = document.createElement('div');
    wrap.style.maxWidth = '720px';
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';

    const element = Template(args);

    const note = document.createElement('div');
    note.style.fontSize = '13px';
    note.style.color = '#444';
    note.innerHTML = `
      Controlled example: external buttons update the component's
      <code>value</code>, and component changes are pushed back into
      Storybook args.
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

    const morningButton = makeButton('Set Morning Window');
    const afternoonButton = makeButton('Set Afternoon Window');
    const clearButton = makeButton('Clear');

    const getJoinBy = () =>
      typeof element.joinBy === 'string' && element.joinBy
        ? element.joinBy
        : args.joinBy || ' - ';

    const eventDetailToValue = detail => {
      if (typeof detail === 'string') {
        return detail;
      }

      if (!detail || typeof detail !== 'object') {
        return '';
      }

      if (
        element.showIso &&
        typeof detail.startDateTimeIso === 'string' &&
        typeof detail.endDateTimeIso === 'string'
      ) {
        return `${detail.startDateTimeIso}${getJoinBy()}${detail.endDateTimeIso}`;
      }

      if (
        typeof detail.startDate !== 'string' ||
        typeof detail.endDate !== 'string' ||
        typeof detail.startTime !== 'string' ||
        typeof detail.endTime !== 'string'
      ) {
        return '';
      }

      const duration =
        element.showDuration &&
        typeof detail.duration === 'string' &&
        detail.duration
          ? ` (${detail.duration})`
          : '';

      return (
        `${detail.startDate} ${detail.startTime}` +
        `${getJoinBy()}` +
        `${detail.endDate} ${detail.endTime}` +
        duration
      );
    };

    const applyValue = async nextValue => {
      const value =
        typeof nextValue === 'string'
          ? nextValue.trim()
          : '';

      await setDateRangeTimeValueWhenReady(
        element,
        value,
      );

      updateArgsBestEffort(ctx, {
        value,
      });
    };

    morningButton.addEventListener('click', () => {
      void applyValue(
        '2026-07-20 09:00 - 2026-08-20 12:00',
      );
    });

    afternoonButton.addEventListener('click', () => {
      void applyValue(
        '2026-07-20 13:00 - 2026-08-20 17:00',
      );
    });

    clearButton.addEventListener('click', () => {
      void applyValue('');
    });

    element.addEventListener(
      'date-time-updated',
      event => {
        const value = eventDetailToValue(
          event.detail,
        );

        if (!value) {
          return;
        }

        void applyValue(value);
      },
    );

    buttons.appendChild(morningButton);
    buttons.appendChild(afternoonButton);
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
        transform: () =>
          buildDocsHtmlControlledValue(),
      },
      description: {
        story:
          'Demonstrates the date range + time picker as a controlled component. External buttons update the value and selected calendar state, while picker changes are converted from the emitted event object into the controlled value string.',
      },
      story: {
        height: '620px',
      },
    },
  },
};

export const DateFormat12hWithDuration = {
  name: 'Date Format + 12h Time + Duration',
  render: renderTemplate,
  args: {
    ...baseArgs,
    dateFormat: 'MM-DD-YYYY',
    isTwentyFourHourFormat: false,
    showDuration: true,
    placeholder:
      'MM-DD-YYYY hh:mm A to MM-DD-YYYY hh:mm A',
    labelCol: '',
    inputCol: '',
    label: 'Event Time',
    inputId: 'event-time',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Date format with 12-hour time and duration display.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const Plumage = {
  name: 'Plumage Styling',
  render: renderTemplate,
  args: {
    ...baseArgs,
    plumage: true,
    appendProp: true,
    labelCol: '',
    inputCol: '',
    inputId: 'plumage-drtp',
  },
  parameters: {
    docs: {
      description: {
        story: 'Render the component using Plumage styling.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const HorizontalLayout = {
  name: 'Horizontal Layout',
  render: renderTemplate,
  args: {
    ...baseArgs,
    formLayout: 'horizontal',
    labelCol: 3,
    inputCol: 9,
    label: 'Meeting Window',
    labelAlign: 'right',
    inputId: 'meeting-window',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use horizontal form layout with the label and input side by side.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const InlineLayout = {
  name: 'Inline Layout',
  render: renderTemplate,
  args: {
    ...baseArgs,
    formLayout: 'inline',
    label: 'Inline Date/Time Range',
    labelCols: '',
    inputCols: '',
    labelCol: '',
    inputCol: '',
    inputId: 'inline-drtp',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use inline form layout for a compact display.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const ISOInputOutput = {
  name: 'ISO Input/Output',
  render: renderTemplate,
  args: {
    ...baseArgs,
    showIso: true,
    joinBy: ' to ',
    placeholder: '',
    labelCol: '',
    inputCol: '',
    inputId: 'iso-drtp',
    label: 'ISO Date/Time Range',
  },
  parameters: {
    docs: {
      description: {
        story: 'Show ISO input and output format.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const LongDateDisplay = {
  name: 'Long Date Display',
  render: renderTemplate,
  args: {
    ...baseArgs,
    showLong: true,
    joinBy: ' — ',
    labelCol: '',
    inputCol: '',
    inputId: 'long-date-drtp',
    label: 'Long Date/Time Range',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Display dates in a long format such as Wednesday, January 1, 2025.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const RequiredWithValidation = {
  name: 'Required with Validation',
  render: renderTemplate,
  args: {
    ...baseArgs,
    labelCol: '',
    inputCol: '',
    inputId: 'required-validation-drtp',
    label: 'Required Date/Time Range',
    required: true,
    validation: true,
    validationMessage:
      'Please enter a valid date/time range.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A required date/time range picker showing an invalid validation state.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const Disabled = {
  name: 'Disabled State',
  render: renderTemplate,
  args: {
    ...baseArgs,
    disabled: true,
    readOnly: false,
    labelCol: '',
    inputCol: '',
    inputId: 'disabled-drtp',
    label: 'Disabled Date/Time Range',
    value: '2026-07-20 09:00 - 2026-08-20 17:00',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A disabled date/time range picker with a visible value.',
      },
    },
  },
};

export const ReadOnly = {
  name: 'Read Only State',
  render: renderTemplate,
  args: {
    ...baseArgs,
    disabled: false,
    readOnly: true,
    labelCol: '',
    inputCol: '',
    inputId: 'readonly-drtp',
    label: 'Read Only Date/Time Range',
    value: '2026-07-20 09:00 - 2026-08-20 17:00',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A read-only date/time range input. The value remains readable while calendar and clear controls are not rendered.',
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
    labelCol: '',
    inputCol: '',
    inputId: 'size-drtp',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Size variants for the date/time range picker. Supported values are empty, sm, and lg.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const PickerOnlyNoInput = {
  name: 'Picker Only (No Input)',
  render: renderTemplate,
  args: {
    ...baseArgs,
    rangeTimePicker: true,
    showOkButton: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A date/time range picker in picker-only mode without a main input.',
      },
      story: {
        height: '425px',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: args => {
    const root = document.createElement('div');

    root.style.display = 'grid';
    root.style.gap = '16px';

    const intro = document.createElement('div');

    intro.innerHTML = `
      <div style="font-weight:700; font-size:14px; margin-bottom:6px;">
        Accessibility matrix
      </div>
      <div style="font-size:13px; color:#444;">
        Date Range + Time Picker: common variants and computed
        <code>role</code>, <code>aria-*</code>, IDs.
      </div>
    `;

    root.appendChild(intro);

    const base = {
      ...args,
    };

    const rows = [
      {
        title: 'Default',
        args: {
          ...base,
          formLayout: '',
          disabled: false,
          readOnly: false,
          required: false,
          validation: false,
          rangeTimePicker: false,
          labelHidden: false,
          value: '',
        },
      },
      {
        title: 'With Value',
        args: {
          ...base,
          formLayout: '',
          disabled: false,
          readOnly: false,
          required: false,
          validation: false,
          rangeTimePicker: false,
          labelHidden: false,
          value:
            '2026-07-20 09:00 - 2026-08-20 17:00',
        },
      },
      {
        title: 'Inline',
        args: {
          ...base,
          formLayout: 'inline',
          disabled: false,
          readOnly: false,
          required: false,
          validation: false,
          rangeTimePicker: false,
          labelHidden: false,
          labelCol: '',
          inputCol: '',
          value: '',
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
          readOnly: false,
          required: false,
          validation: false,
          rangeTimePicker: false,
          labelHidden: false,
          value: '',
        },
      },
      {
        title:
          'Validation / Error (required + validation=true)',
        args: {
          ...base,
          formLayout: '',
          required: true,
          validation: true,
          validationMessage:
            'Please enter a valid date/time range.',
          disabled: false,
          readOnly: false,
          rangeTimePicker: false,
          labelHidden: false,
          value: '',
        },
      },
      {
        title: 'Disabled',
        args: {
          ...base,
          formLayout: '',
          disabled: true,
          readOnly: false,
          required: false,
          validation: false,
          rangeTimePicker: false,
          labelHidden: false,
          value:
            '2026-07-20 09:00 - 2026-08-20 17:00',
        },
      },
      {
        title: 'Read Only',
        args: {
          ...base,
          formLayout: '',
          disabled: false,
          readOnly: true,
          required: false,
          validation: false,
          rangeTimePicker: false,
          labelHidden: false,
          value:
            '2026-07-20 09:00 - 2026-08-20 17:00',
        },
      },
    ];

    rows.forEach((row, index) => {
      root.appendChild(
        renderDRTPMatrixRow({
          ...row,
          idSuffix: String(index + 1),
        }),
      );
    });

    return root;
  },

  parameters: {
    controls: {
      disable: true,
    },
    docs: {
      description: {
        story:
          'Matrix of common Date Range + Time Picker states, including a populated value, validation, disabled, and read-only behavior, with computed roles, aria-* attributes, and IDs.',
      },
      story: {
        height: '1650px',
      },
    },
  },
};
