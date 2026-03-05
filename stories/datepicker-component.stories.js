// stories/datepicker-component.stories.js
import { action } from '@storybook/addon-actions';

export default {
  title: 'Form/Datepicker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A datepicker input with an optional attached calendar view. Supports Bootstrap-style layout and sizing, validation states, and custom formatting.',
      },
      source: {
        language: 'html',
        // IMPORTANT: docs preview must reflect CURRENT args (including Controls changes)
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    // Core behaviour
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

    // IMPORTANT: validation visuals are gated by the *presence* of the attribute
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

    // Layout & sizing (Bootstrap-style grid + variants)
    formLayout: {
      control: { type: 'select' },
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

    // Grid cols
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

    // Input adornments
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

    // Formatting
    dateFormat: {
      control: { type: 'select' },
      options: ['YYYY-MM-DD', 'MM-DD-YYYY'],
      name: 'date-format',
      table: { category: 'Formatting', defaultValue: { summary: 'YYYY-MM-DD' } },
      description: 'Date format used for parsing and displaying the selected date. Uses dayjs formatting tokens.',
    },
    placeholder: {
      control: 'text',
      table: { category: 'Formatting', defaultValue: { summary: 'YYYY-MM-DD' } },
      description: 'Hint shown in the input (defaults to dateFormat if not provided)',
    },

    // Identity
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Identity', defaultValue: { summary: 'datepicker' } },
      description: 'ID for the input element (used for associating the label and calendar button)',
    },

    // Demo helpers
    dropdownOpen: {
      control: 'boolean',
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
    // sensible defaults
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
    validationAttr: false,
    validationMessage: 'Please select a date.',
    warningMessage: '',
  },
};

// ======================================================
// Helpers (normalize + docs builder)
// ======================================================

/** Collapse blank lines + trim edges (same helper used in your other stories) */
const normalize = txt => {
  const lines = String(txt)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      prevBlank = true;
      out.push('');
      continue;
    }
    prevBlank = false;
    out.push(line);
  }

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

/** Build clean attribute block (prints one attribute per line for readable docs) */
const attrs = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replaceAll('"', '&quot;')}"`))
    .join('\n  ');

/** Docs code preview (reflects CURRENT args, including Controls changes) */
const buildDocsHtml = args => {
  const labelCol = Number.isFinite(Number(args.labelCol)) ? Number(args.labelCol) : 2;
  const inputCol = Number.isFinite(Number(args.inputCol)) ? Number(args.inputCol) : 10;

  const placeholder = (args.placeholder && String(args.placeholder).trim()) || args.dateFormat || 'YYYY-MM-DD';
  const icon = (args.icon && String(args.icon).trim()) || 'fas fa-calendar-alt';

  const attributeBlock = attrs([
    // presence-gated attributes
    ['calendar', !!args.calendar],
    ['plumage', !!args.plumage],
    ['disabled', !!args.disabled],
    ['required', !!args.required],
    ['validation', !!args.validationAttr],
    ['prepend', !!args.prepend],
    ['append', !!args.append],

    // normal attrs / props
    ['form-layout', args.formLayout],
    ['size', args.size],
    ['label-align', args.labelAlign],
    ['label-hidden', !!args.labelHidden],
    ['label', args.label],
    ['label-size', args.labelSize],

    // grid
    ['label-col', args.formLayout === 'horizontal' ? labelCol : args.labelCol], // still print if user sets it
    ['input-col', args.formLayout === 'horizontal' ? inputCol : args.inputCol],
    ['label-cols', args.labelCols],
    ['input-cols', args.inputCols],

    // formatting / identity
    ['date-format', args.dateFormat],
    ['placeholder', placeholder],
    ['input-id', args.inputId],
    ['icon', icon],

    // validation text
    ['validation-message', args.validationMessage],
    ['warning-message', args.warningMessage],

    // demo helpers (usually omit; include only if true so docs show it)
    ['display-context-examples', !!args.displayContextExamples],
  ]);

  return normalize(`
<datepicker-component
  ${attributeBlock}
></datepicker-component>
`);
};

// ======================================================
// Runtime element builder (actual story render)
// ======================================================

const setBoolAttr = (el, name, on) => {
  if (on) el.setAttribute(name, '');
  else el.removeAttribute(name);
};

const buildEl = args => {
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
  el.labelAlign = args.labelAlign || '';
  el.labelSize = args.labelSize || '';
  el.icon = args.icon || 'fas fa-calendar-alt';

  // formatting
  el.dateFormat = args.dateFormat;
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
  el.addEventListener('date-selected', e => action('date-selected')(e.detail));

  return el;
};

const Template = args => buildEl(args);

// ===== Stories =====

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
    story: { height: '400px' },
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
    story: { height: '400px' },
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
    story: { height: '400px' },
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
    story: { height: '400px' },
  },
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  required: true,
  validationAttr: true, // attribute must be present to enable validation behavior
  validationMessage: 'Date is required.',
  placeholder: 'YYYY-MM-DD',
  labelCol: '',
  inputCol: '',
};
WithValidation.parameters = {
  docs: {
    description: {
      story: 'Datepicker with validation enabled. Try submitting without selecting a date to see the validation message.',
    },
    story: { height: '400px' },
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
    story: { height: '400px' },
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
  size: 'sm', // try '', 'sm', 'lg'
  label: 'Small Date',
  labelCol: '',
  inputCol: '',
};
Sizes.parameters = {
  docs: {
    description: {
      story: 'Datepicker with different size options. Try changing the size to see the effect.',
    },
    story: { height: '400px' },
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
    story: { height: '400px' },
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
