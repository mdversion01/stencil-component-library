// File: src/stories/date-range-picker-component/date-range-picker-component.stories.js

import DocsPage from './date-range-picker-component.docs.mdx';
import {
  buildDocsHtml,
  Template,
} from './date-range-picker-component.story-helpers.js';

const baseArgs = {
  appendProp: true,
  appendId: '',
  ariaLabel: '',
  dateFormat: 'YYYY-MM-DD',
  disabled: false,
  readOnly: false,
  formLayout: '',
  icon: 'fas fa-calendar-alt',
  inputCol: 10,
  inputCols: '',
  inputId: 'drp',
  joinBy: ' - ',
  label: 'Date Range Picker',
  labelAlign: '',
  labelCol: 2,
  labelCols: '',
  labelHidden: false,
  plumage: false,
  placeholder: '',
  prependProp: false,
  prependId: '',
  rangePicker: false,
  required: false,
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
  title: 'Form/Date Range Picker',
  tags: ['autodocs'],

  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component:
          'A date range picker component with built-in support for various display formats, form layouts, validation states, read-only values, and externally supplied values.',
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
        defaultValue: {
          summary: false,
        },
        category: 'Core',
      },
      description: 'Render using Plumage styling.',
    },

    rangePicker: {
      control: 'boolean',
      name: 'range-picker',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Core',
      },
      description:
        'Render only the picker without an input group. The OK/Close button is not rendered.',
    },

    disabled: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Core',
      },
      description:
        'Disable the input and rendered calendar controls.',
    },

    readOnly: {
      control: 'boolean',
      name: 'read-only',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Core',
      },
      description:
        'Make the input read-only and remove interactive calendar and clear controls.',
    },

    required: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: false,
        },
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
        'Date format used for parsing and displaying the selected date.',
    },

    showYmd: {
      control: 'boolean',
      name: 'show-ymd',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Formatting',
      },
      description: 'Force YYYY-MM-DD display.',
    },

    showLong: {
      control: 'boolean',
      name: 'show-long',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Formatting',
      },
      description: 'Force long date display.',
    },

    showIso: {
      control: 'boolean',
      name: 'show-iso',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Formatting',
      },
      description: 'Force ISO display.',
    },

    placeholder: {
      control: 'text',
      table: {
        category: 'Input',
      },
      description:
        'Placeholder text for the input. If empty, a default is computed from the display format and joinBy.',
    },

    joinBy: {
      control: 'text',
      name: 'join-by',
      table: {
        category: 'Input',
        defaultValue: {
          summary: ' - ',
        },
      },
      description:
        'Separator between the start and end dates in the input and display.',
    },

    icon: {
      control: 'text',
      table: {
        category: 'Input',
        defaultValue: {
          summary: 'fas fa-calendar-alt',
        },
      },
      description:
        'Calendar button icon classes, such as "fas fa-calendar-alt".',
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      table: {
        category: 'Input',
        defaultValue: {
          summary: 'drp',
        },
      },
      description:
        'ID for the input element, used for accessibility and testing.',
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

    appendId: {
      control: 'text',
      name: 'append-id',
      table: {
        category: 'Input',
      },
      description:
        'Optional ID attribute for the appended calendar button.',
    },

    prependId: {
      control: 'text',
      name: 'prepend-id',
      table: {
        category: 'Input',
      },
      description:
        'Optional ID attribute for the prepended calendar button.',
    },

    label: {
      control: 'text',
      table: {
        category: 'Layout',
        defaultValue: {
          summary: 'Date Range Picker',
        },
      },
      description: 'Label text for the input.',
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
      description: 'Alignment for the label text.',
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
        'Visually hide the label while keeping it accessible.',
    },

    formLayout: {
      control: {
        type: 'select',
      },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: {
        category: 'Layout',
      },
      description: 'Form layout variant.',
    },

    size: {
      control: {
        type: 'select',
      },
      options: ['', 'sm', 'lg'],
      table: {
        category: 'Layout',
      },
      description: 'Size variant.',
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
        defaultValue: {
          summary: 2,
        },
      },
      description:
        'Number of grid columns used by the label in horizontal layout.',
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
        defaultValue: {
          summary: 10,
        },
      },
      description:
        'Number of grid columns used by the input in horizontal layout.',
    },

    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description:
        'Responsive label classes, such as "col-sm-3 col-md-4" or "xs-12 sm-6 md-4".',
    },

    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: {
        category: 'Layout',
        subcategory: 'Grid',
      },
      description:
        'Responsive input classes, such as "col-sm-9 col-md-8" or "xs-12 sm-6 md-8".',
    },

    validation: {
      control: 'boolean',
      table: {
        category: 'Validation',
        defaultValue: {
          summary: false,
        },
      },
      description: 'Show the invalid validation state.',
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
      description: 'Optional warning message.',
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
        'Show the OK/Close button in input-group mode.',
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: {
        category: 'Controls',
      },
      description: 'ARIA label for the picker dialog title.',
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
        'Initial or externally controlled date range displayed in the main input.',
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
    label: 'Select Date',
    labelCol: '',
    inputCol: '',
  },

  parameters: {
    docs: {
      description: {
        story:
          'A basic date range picker with default settings. Use the controls to customize the display format, layout, and validation states.',
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
    label: 'Reporting Period',
    labelCol: '',
    inputCol: '',
    inputId: 'drp-value',
    value: '2026-07-10 - 2026-07-20',
  },

  parameters: {
    docs: {
      description: {
        story:
          'A date range picker initialized with a date range through the value property.',
      },
      story: {
        height: '525px',
      },
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
    inputId: 'drp-format',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Customize the date format using the "dateFormat" property. This controls how selected dates are displayed and parsed.',
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
    inputId: 'drp-plumage',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Enable Plumage styling by setting the "plumage" property to true.',
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
    labelAlign: 'right',
    labelCol: 3,
    inputCol: 9,
    inputId: 'drp-horizontal',
  },

  parameters: {
    docs: {
      description: {
        story:
          'A horizontal layout with custom label and input column widths.',
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
    label: 'Inline Range',
    labelCols: '',
    inputCols: '',
    labelCol: '',
    inputCol: '',
    inputId: 'drp-inline',
  },

  parameters: {
    docs: {
      description: {
        story:
          'An inline layout with automatic column widths for the label and input.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const WithValidation = {
  name: 'With Validation',
  render: renderTemplate,

  args: {
    ...baseArgs,
    required: true,
    validation: true,
    validationMessage: 'Please enter a valid date range.',
    labelCol: '',
    inputCol: '',
    inputId: 'drp-validation',
  },

  parameters: {
    docs: {
      description: {
        story: 'A date range picker with validation enabled.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const CustomSeparator = {
  name: 'Custom Separator',
  render: renderTemplate,

  args: {
    ...baseArgs,
    joinBy: ' to ',
    placeholder: '',
    labelCol: '',
    inputCol: '',
    inputId: 'drp-custom-separator',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Customize the separator between start and end dates using the "joinBy" property.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const ForceYMDDisplay = {
  name: 'Force YMD Display',
  render: renderTemplate,

  args: {
    ...baseArgs,
    showYmd: true,
    labelCol: '',
    inputCol: '',
    inputId: 'drp-ymd',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Force the display format to YYYY-MM-DD regardless of the dateFormat property.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const ForceLongDisplay = {
  name: 'Force Long Display',
  render: renderTemplate,

  args: {
    ...baseArgs,
    showLong: true,
    joinBy: ' — ',
    labelCol: '',
    inputCol: '',
    inputId: 'drp-long',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Force the display format to a long date regardless of the dateFormat property.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const ForceIsoDisplay = {
  name: 'Force ISO Display',
  render: renderTemplate,

  args: {
    ...baseArgs,
    showIso: true,
    joinBy: ' / ',
    labelCol: '',
    inputCol: '',
    inputId: 'drp-iso',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Force the display format to ISO regardless of the dateFormat property.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const Disabled = {
  name: 'Disabled',
  render: renderTemplate,

  args: {
    ...baseArgs,
    disabled: true,
    readOnly: false,
    label: 'Disabled Date Range',
    labelCol: '',
    inputCol: '',
    inputId: 'drp-disabled',
    value: '2026-07-10 - 2026-07-20',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Disable the date range picker while preserving a visible value.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const ReadOnly = {
  name: 'Read Only',
  render: renderTemplate,

  args: {
    ...baseArgs,
    disabled: false,
    readOnly: true,
    label: 'Read Only Date Range',
    labelCol: '',
    inputCol: '',
    inputId: 'drp-readonly',
    value: '2026-07-10 - 2026-07-20',
  },

  parameters: {
    docs: {
      description: {
        story:
          'A read-only date range input. The value remains readable while calendar and clear controls are not rendered.',
      },
      story: {
        height: '525px',
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
    inputId: 'drp-size',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Set the size of the date range picker using the "size" property.',
      },
      story: {
        height: '525px',
      },
    },
  },
};

export const StandalonePickerOnly = {
  name: 'Standalone Picker Only',
  render: renderTemplate,

  args: {
    ...baseArgs,
    rangePicker: true,
    showOkButton: false,
    labelCol: '',
    inputCol: '',
    inputId: 'drp-standalone',
  },

  parameters: {
    docs: {
      description: {
        story:
          'Render only the date range picker without the input group.',
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
        Date Range Picker: common variants and computed
        <code>role</code>, <code>aria-*</code>, IDs, values, and control states.
      </div>
    `;

    root.appendChild(intro);

    const pickAttrs = (element, names) => {
      const output = {};

      if (!element) {
        return output;
      }

      for (const name of names) {
        const value = element.getAttribute(name);

        if (value !== null && value !== '') {
          output[name] = value;
        }
      }

      return output;
    };

    const splitIds = value =>
      String(value || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const resolveIdsWithin = (host, ids) => {
      const result = {};

      for (const id of ids) {
        const safe = String(id)
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"');

        result[id] = !!host.querySelector(
          `[id="${safe}"]`,
        );
      }

      return result;
    };

    const collect = host => {
      const ids = Array.from(
        host.querySelectorAll('[id]'),
      )
        .map(node => node.id)
        .filter(Boolean);

      const counts = new Map();

      for (const id of ids) {
        counts.set(
          id,
          (counts.get(id) || 0) + 1,
        );
      }

      const duplicates = Array.from(
        counts.entries(),
      )
        .filter(([, count]) => count > 1)
        .map(([id, count]) => ({
          id,
          count,
        }));

      return {
        total: ids.length,
        unique: counts.size,
        duplicates,
      };
    };

    const snapshotDRPA11y = host => {
      const input = host.querySelector(
        'input.form-control',
      );

      const label = host.querySelector(
        'label.form-control-label',
      );

      const group = host.querySelector(
        '.input-group',
      );

      const toggle = host.querySelector(
        '.calendar-button, button.btn.input-group-text',
      );

      const clearButton = host.querySelector(
        '.clear-input-button',
      );

      const dialog = host.querySelector(
        '.dropdown-content[role="dialog"], .dropdown-content',
      );

      const validation = host.querySelector(
        '.invalid-feedback.validation, .invalid-feedback.warning, .invalid-feedback',
      );

      const describedByIds = input
        ? splitIds(
            input.getAttribute('aria-describedby'),
          )
        : [];

      const labelledByIds = input
        ? splitIds(
            input.getAttribute('aria-labelledby'),
          )
        : [];

      return {
        host: {
          tag: host.tagName.toLowerCase(),
          id: host.id || null,
          role: host.getAttribute('role') || null,
          ...pickAttrs(host, [
            'value',
            'read-only',
            'disabled',
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
          ]),
          properties: {
            value: host.value || '',
            readOnly: !!host.readOnly,
            disabled: !!host.disabled,
          },
        },

        input: input
          ? {
              tag: input.tagName.toLowerCase(),
              id: input.id || null,
              role:
                input.getAttribute('role') || null,
              value: input.value || '',
              ...pickAttrs(input, [
                'name',
                'type',
                'autocomplete',
                'required',
                'readonly',
                'disabled',
                'aria-label',
                'aria-labelledby',
                'aria-describedby',
                'aria-invalid',
                'aria-readonly',
                'aria-disabled',
              ]),
              properties: {
                value: input.value || '',
                readOnly: input.readOnly,
                disabled: input.disabled,
              },
              resolves: {
                'aria-labelledby': resolveIdsWithin(
                  host,
                  labelledByIds,
                ),
                'aria-describedby': resolveIdsWithin(
                  host,
                  describedByIds,
                ),
              },
            }
          : null,

        label: label
          ? {
              tag: label.tagName.toLowerCase(),
              id: label.id || null,
              for:
                label.getAttribute('for') || null,
            }
          : null,

        group: group
          ? {
              tag: group.tagName.toLowerCase(),
              id: group.id || null,
              role:
                group.getAttribute('role') || null,
              className:
                group.getAttribute('class') || '',
              ...pickAttrs(group, [
                'aria-label',
                'aria-labelledby',
                'aria-describedby',
              ]),
            }
          : null,

        toggle: toggle
          ? {
              tag: toggle.tagName.toLowerCase(),
              id: toggle.id || null,
              role:
                toggle.getAttribute('role') || null,
              ...pickAttrs(toggle, [
                'aria-label',
                'aria-haspopup',
                'aria-expanded',
                'aria-controls',
                'disabled',
              ]),
            }
          : null,

        clearButton: clearButton
          ? {
              tag:
                clearButton.tagName.toLowerCase(),
              id: clearButton.id || null,
              ...pickAttrs(clearButton, [
                'aria-label',
                'disabled',
              ]),
            }
          : null,

        dialog: dialog
          ? {
              tag: dialog.tagName.toLowerCase(),
              id: dialog.id || null,
              role:
                dialog.getAttribute('role') || null,
              ...pickAttrs(dialog, [
                'aria-modal',
                'aria-labelledby',
                'aria-describedby',
              ]),
            }
          : null,

        validation: validation
          ? {
              tag:
                validation.tagName.toLowerCase(),
              id: validation.id || null,
              ...pickAttrs(validation, [
                'aria-live',
                'aria-atomic',
              ]),
              text:
                validation.textContent?.trim() ||
                null,
            }
          : null,

        controls: {
          calendarToggleRendered: !!toggle,
          clearButtonRendered: !!clearButton,
        },

        ids: collect(host),
      };
    };

    const renderRow = ({ title, build }) => {
      const wrapper = document.createElement('div');

      wrapper.style.border = '1px solid #ddd';
      wrapper.style.borderRadius = '12px';
      wrapper.style.padding = '12px';
      wrapper.style.display = 'grid';
      wrapper.style.gap = '10px';

      const heading = document.createElement('div');

      heading.style.fontWeight = '700';
      heading.textContent = title;

      const stage = document.createElement('div');

      stage.style.maxWidth = '560px';

      const output = document.createElement('pre');

      output.style.margin = '0';
      output.style.padding = '10px';
      output.style.background = '#f6f8fa';
      output.style.borderRadius = '10px';
      output.style.overflowX = 'auto';
      output.style.fontSize = '12px';
      output.textContent =
        'Collecting aria/role/id…';

      const component = build();

      stage.appendChild(component);
      wrapper.appendChild(heading);
      wrapper.appendChild(stage);
      wrapper.appendChild(output);

      const update = () => {
        const host = stage.querySelector(
          'date-range-picker-component',
        );

        output.textContent = host
          ? JSON.stringify(
              snapshotDRPA11y(host),
              null,
              2,
            )
          : 'No host found';
      };

      requestAnimationFrame(() =>
        requestAnimationFrame(update),
      );

      return wrapper;
    };

    const base = {
      ...args,
    };

    const cases = [
      {
        title: 'Default',
        build: () =>
          Template({
            ...base,
            formLayout: '',
            labelHidden: false,
            disabled: false,
            readOnly: false,
            required: false,
            validation: false,
            value: '',
            inputId: 'drp-a11y-default',
            label: 'Default DRP',
          }),
      },
      {
        title: 'With Value',
        build: () =>
          Template({
            ...base,
            formLayout: '',
            labelHidden: false,
            disabled: false,
            readOnly: false,
            required: false,
            validation: false,
            value:
              '2026-07-10 - 2026-07-20',
            inputId: 'drp-a11y-value',
            label: 'DRP With Value',
          }),
      },
      {
        title: 'Inline',
        build: () =>
          Template({
            ...base,
            formLayout: 'inline',
            labelHidden: false,
            disabled: false,
            readOnly: false,
            required: false,
            validation: false,
            value: '',
            inputId: 'drp-a11y-inline',
            label: 'Inline DRP',
            labelCol: '',
            inputCol: '',
            labelCols: '',
            inputCols: '',
          }),
      },
      {
        title: 'Horizontal',
        build: () =>
          Template({
            ...base,
            formLayout: 'horizontal',
            labelHidden: false,
            disabled: false,
            readOnly: false,
            required: false,
            validation: false,
            value: '',
            inputId: 'drp-a11y-horizontal',
            label: 'Horizontal DRP',
            labelAlign: 'right',
            labelCol: 3,
            inputCol: 9,
          }),
      },
      {
        title: 'Validation / Error',
        build: () =>
          Template({
            ...base,
            formLayout: '',
            disabled: false,
            readOnly: false,
            required: true,
            validation: true,
            validationMessage:
              'Please enter a valid date range.',
            value: '',
            inputId: 'drp-a11y-validation',
            label: 'Validated DRP',
          }),
      },
      {
        title: 'Disabled',
        build: () =>
          Template({
            ...base,
            disabled: true,
            readOnly: false,
            required: false,
            validation: false,
            value:
              '2026-07-10 - 2026-07-20',
            inputId: 'drp-a11y-disabled',
            label: 'Disabled DRP',
          }),
      },
      {
        title: 'Read Only',
        build: () =>
          Template({
            ...base,
            disabled: false,
            readOnly: true,
            required: false,
            validation: false,
            value:
              '2026-07-10 - 2026-07-20',
            inputId: 'drp-a11y-readonly',
            label: 'Read Only DRP',
          }),
      },
    ];

    cases.forEach(testCase => {
      root.appendChild(renderRow(testCase));
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
          'Matrix of common Date Range Picker states, including populated values, validation, disabled, and read-only behavior, with computed roles, aria-* attributes, IDs, and control states.',
      },

      story: {
        height: '1650px',
      },
    },
  },
};
