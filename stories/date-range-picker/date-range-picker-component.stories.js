// File: src/stories/date-range-picker-component/date-range-picker-component.stories.js

import DocsPage from './date-range-picker-component.docs.mdx';
import { buildDocsHtml, Template } from './date-range-picker-component.story-helpers.js';

export default {
  title: 'Form/Date Range Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component:
          'A date range picker component with built-in support for various display formats, form layouts, and validation states.',
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
    rangePicker: {
      control: 'boolean',
      name: 'range-picker',
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
    showYmd: {
      control: 'boolean',
      name: 'show-ymd',
      table: { defaultValue: { summary: false }, category: 'Formatting' },
      description: 'Force YYYY-MM-DD display',
    },
    showLong: {
      control: 'boolean',
      name: 'show-long',
      table: { defaultValue: { summary: false }, category: 'Formatting' },
      description: 'Force long date display',
    },
    showIso: {
      control: 'boolean',
      name: 'show-iso',
      table: { defaultValue: { summary: false }, category: 'Formatting' },
      description: 'Force ISO display',
    },

    placeholder: {
      control: 'text',
      table: { category: 'Input' },
      description:
        'Placeholder text for the input; if empty, a default will be computed based on the display format + joinBy',
    },
    joinBy: {
      control: 'text',
      name: 'join-by',
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
      description: 'ID for the input element (used for accessibility and testing)',
    },

    appendProp: {
      control: 'boolean',
      name: 'append-prop',
      table: { category: 'Input', defaultValue: { summary: true } },
      description: 'Show an append button that triggers the picker',
    },
    prependProp: {
      control: 'boolean',
      name: 'prepend-prop',
      table: { category: 'Input', defaultValue: { summary: false } },
      description: 'Show a prepend button that triggers the picker',
    },
    appendId: {
      control: 'text',
      name: 'append-id',
      table: { category: 'Input' },
      description: 'Optional id attribute for the append button.',
    },
    prependId: {
      control: 'text',
      name: 'prepend-id',
      table: { category: 'Input' },
      description: 'Optional id attribute for the prepend button.',
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
      description: 'Alignment for the label text',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Visually hide the label while keeping it accessible',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description: 'Form layout variant',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description: 'Size variant',
    },

    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'label-col',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Number of grid columns for the label',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'input-col',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Number of grid columns for the input',
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

    validation: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Show validation state',
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
      description: 'Optional warning message',
    },

    showOkButton: {
      control: 'boolean',
      name: 'show-ok-button',
      table: { category: 'Controls', defaultValue: { summary: true } },
      description: 'Show the OK button in the picker',
    },
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Controls' },
      description: 'ARIA label for the dialog title',
    },

    value: {
      control: 'text',
      table: { category: 'Value', disable: true },
      description: 'Current input value',
    },
  },

  args: {
    appendProp: true,
    appendId: '',
    ariaLabel: '',
    dateFormat: 'YYYY-MM-DD',
    disabled: false,
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
  },

  render: (args) => Template(args),
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Select Date',
  labelCol: '',
  inputCol: '',
};
Basic.storyName = 'Basic Usage';
Basic.parameters = {
  docs: {
    description: {
      story:
        'A basic date range picker with default settings. Use the controls to customize the display format, layout, and validation states.',
    },
    story: { height: '525px' },
  },
};

export const DateFormat = Template.bind({});
DateFormat.args = {
  dateFormat: 'MM-DD-YYYY',
  placeholder: 'MM-DD-YYYY',
  label: 'Date Format',
  labelCol: '',
  inputCol: '',
  inputId: 'drp-format',
};
DateFormat.storyName = 'Date Format';
DateFormat.parameters = {
  docs: {
    description: {
      story:
        'Customize the date format using the "dateFormat" prop. This controls how the selected dates are displayed and parsed.',
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
  inputId: 'drp-plumage',
};
Plumage.storyName = 'Plumage Styling';
Plumage.parameters = {
  docs: {
    description: {
      story: 'Enable Plumage styling by setting the "plumage" prop to true.',
    },
    story: { height: '525px' },
  },
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  labelAlign: 'right',
  labelCol: 3,
  inputCol: 9,
  inputId: 'drp-horizontal',
};
HorizontalLayout.storyName = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'A horizontal layout with custom label and input column widths.',
    },
    story: { height: '525px' },
  },
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  label: 'Inline Range',
  labelCols: '',
  inputCols: '',
  labelCol: '',
  inputCol: '',
  inputId: 'drp-inline',
};
InlineLayout.storyName = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    description: {
      story: 'An inline layout with automatic column widths for the label and input.',
    },
    story: { height: '525px' },
  },
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  required: true,
  validation: true,
  validationMessage: 'Please enter a valid date range.',
  labelCol: '',
  inputCol: '',
  inputId: 'drp-validation',
};
WithValidation.parameters = {
  docs: {
    description: {
      story: 'A date range picker with validation enabled.',
    },
    story: { height: '525px' },
  },
};

export const CustomSeparator = Template.bind({});
CustomSeparator.args = {
  joinBy: ' to ',
  placeholder: '',
  labelCol: '',
  inputCol: '',
  inputId: 'drp-custom-separator',
};
CustomSeparator.parameters = {
  docs: {
    description: {
      story: 'Customize the separator between the start and end dates using the "joinBy" prop.',
    },
    story: { height: '525px' },
  },
};

export const ForceYMDDisplay = Template.bind({});
ForceYMDDisplay.args = {
  showYmd: true,
  labelCol: '',
  inputCol: '',
  inputId: 'drp-ymd',
};
ForceYMDDisplay.parameters = {
  docs: {
    description: {
      story: 'Force the display format to be YYYY-MM-DD regardless of the dateFormat prop.',
    },
    story: { height: '525px' },
  },
};

export const ForceLongDisplay = Template.bind({});
ForceLongDisplay.args = {
  showLong: true,
  joinBy: ' — ',
  labelCol: '',
  inputCol: '',
  inputId: 'drp-long',
};
ForceLongDisplay.parameters = {
  docs: {
    description: {
      story: 'Force the display format to be long regardless of the dateFormat prop.',
    },
    story: { height: '525px' },
  },
};

export const ForceIsoDisplay = Template.bind({});
ForceIsoDisplay.args = {
  showIso: true,
  joinBy: ' / ',
  labelCol: '',
  inputCol: '',
  inputId: 'drp-iso',
};
ForceIsoDisplay.parameters = {
  docs: {
    description: {
      story: 'Force the display format to be ISO regardless of the dateFormat prop.',
    },
    story: { height: '525px' },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  labelCol: '',
  inputCol: '',
  inputId: 'drp-disabled',
};
Disabled.parameters = {
  docs: {
    description: {
      story: 'Disable the date range picker using the "disabled" prop.',
    },
    story: { height: '525px' },
  },
};

export const Sizes = Template.bind({});
Sizes.args = {
  size: 'sm',
  labelCol: '',
  inputCol: '',
  inputId: 'drp-size',
};
Sizes.parameters = {
  docs: {
    description: {
      story: 'Set the size of the date range picker using the "size" prop.',
    },
    story: { height: '525px' },
  },
};

export const StandalonePickerOnly = Template.bind({});
StandalonePickerOnly.args = {
  rangePicker: true,
  showOkButton: false,
  labelCol: '',
  inputCol: '',
  inputId: 'drp-standalone',
};
StandalonePickerOnly.parameters = {
  docs: {
    description: {
      story: 'Render only the date range picker without the input group.',
    },
    story: { height: '425px' },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (args) => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '16px';

    const intro = document.createElement('div');
    intro.innerHTML = `
      <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
      <div style="font-size:13px; color:#444;">
        Date Range Picker: common variants + computed <code>role</code>, <code>aria-*</code>, IDs.
      </div>
    `;
    root.appendChild(intro);

    const pickAttrs = (el, names) => {
      const out = {};
      if (!el) return out;
      for (const n of names) {
        const v = el.getAttribute(n);
        if (v !== null && v !== '') out[n] = v;
      }
      return out;
    };

    const splitIds = (v) =>
      String(v || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    const resolveIdsWithin = (host, ids) => {
      const res = {};
      for (const id of ids) {
        const safe = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        res[id] = !!host.querySelector(`[id="${safe}"]`);
      }
      return res;
    };

    const collect = (host) => {
      const ids = Array.from(host.querySelectorAll('[id]'))
        .map((n) => n.id)
        .filter(Boolean);
      const counts = new Map();
      for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
      const duplicates = Array.from(counts.entries())
        .filter(([, c]) => c > 1)
        .map(([id, count]) => ({ id, count }));
      return { total: ids.length, unique: counts.size, duplicates };
    };

    const snapshotDRPA11y = (host) => {
      const input = host.querySelector('input.form-control');
      const label = host.querySelector('label.form-control-label');
      const group = host.querySelector('.input-group');
      const toggle = host.querySelector('.calendar-button, button.btn.input-group-text');
      const dialog = host.querySelector('.dropdown-content[role="dialog"], .dropdown-content');
      const validation = host.querySelector('.invalid-feedback.validation, .invalid-feedback.warning, .invalid-feedback');

      const describedByIds = input ? splitIds(input.getAttribute('aria-describedby')) : [];
      const labelledByIds = input ? splitIds(input.getAttribute('aria-labelledby')) : [];

      return {
        host: {
          tag: host.tagName.toLowerCase(),
          id: host.id || null,
          role: host.getAttribute('role') || null,
          ...pickAttrs(host, ['aria-label', 'aria-labelledby', 'aria-describedby']),
        },
        input: input
          ? {
              tag: input.tagName.toLowerCase(),
              id: input.id || null,
              role: input.getAttribute('role') || null,
              ...pickAttrs(input, ['name', 'type', 'autocomplete', 'required', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid']),
              resolves: {
                'aria-labelledby': resolveIdsWithin(host, labelledByIds),
                'aria-describedby': resolveIdsWithin(host, describedByIds),
              },
            }
          : null,
        label: label
          ? {
              tag: label.tagName.toLowerCase(),
              id: label.id || null,
              for: label.getAttribute('for') || null,
            }
          : null,
        group: group
          ? {
              tag: group.tagName.toLowerCase(),
              id: group.id || null,
              role: group.getAttribute('role') || null,
              ...pickAttrs(group, ['aria-label', 'aria-labelledby', 'aria-describedby']),
            }
          : null,
        toggle: toggle
          ? {
              tag: toggle.tagName.toLowerCase(),
              id: toggle.id || null,
              role: toggle.getAttribute('role') || null,
              ...pickAttrs(toggle, ['aria-label', 'aria-haspopup', 'aria-expanded', 'aria-controls', 'disabled']),
            }
          : null,
        dialog: dialog
          ? {
              tag: dialog.tagName.toLowerCase(),
              id: dialog.id || null,
              role: dialog.getAttribute('role') || null,
              ...pickAttrs(dialog, ['aria-modal', 'aria-labelledby', 'aria-describedby']),
            }
          : null,
        validation: validation
          ? {
              tag: validation.tagName.toLowerCase(),
              id: validation.id || null,
              ...pickAttrs(validation, ['aria-live', 'aria-atomic']),
              text: validation.textContent?.trim() || null,
            }
          : null,
        ids: collect(host),
      };
    };

    const renderRow = ({ title, build }) => {
      const wrap = document.createElement('div');
      wrap.style.border = '1px solid #ddd';
      wrap.style.borderRadius = '12px';
      wrap.style.padding = '12px';
      wrap.style.display = 'grid';
      wrap.style.gap = '10px';

      const heading = document.createElement('div');
      heading.style.fontWeight = '700';
      heading.textContent = title;

      const stage = document.createElement('div');
      stage.style.maxWidth = '560px';

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.background = '#f6f8fa';
      pre.style.borderRadius = '10px';
      pre.style.overflowX = 'auto';
      pre.style.fontSize = '12px';
      pre.textContent = 'Collecting aria/role/id…';

      const comp = build();
      stage.appendChild(comp);

      wrap.appendChild(heading);
      wrap.appendChild(stage);
      wrap.appendChild(pre);

      const update = () => {
        const host = stage.querySelector('date-range-picker-component');
        pre.textContent = host ? JSON.stringify(snapshotDRPA11y(host), null, 2) : 'No host found';
      };

      requestAnimationFrame(() => requestAnimationFrame(update));
      return wrap;
    };

    const base = { ...args };

    const cases = [
      {
        title: 'Default',
        build: () =>
          Template({
            ...base,
            formLayout: '',
            labelHidden: false,
            disabled: false,
            required: false,
            validation: false,
            inputId: 'drp-a11y-default',
            label: 'Default DRP',
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
            required: false,
            validation: false,
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
            required: false,
            validation: false,
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
            required: true,
            validation: true,
            validationMessage: 'Please enter a valid date range.',
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
            required: false,
            validation: false,
            inputId: 'drp-a11y-disabled',
            label: 'Disabled DRP',
          }),
      },
    ];

    cases.forEach((c) => root.appendChild(renderRow(c)));
    return root;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Matrix of common Date Range Picker states with computed roles, aria-* attributes, and IDs.',
      },
      story: { height: '1200px' },
    },
  },
};
