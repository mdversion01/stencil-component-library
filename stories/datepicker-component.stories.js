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

    // Autocomplete
    autocomplete: {
      control: { type: 'select' },
      options: ['off', 'bday', 'bday-day', 'bday-month', 'bday-year'],
      table: { defaultValue: { summary: 'off' }, category: 'Core' },
      description:
        'HTML autocomplete value for the input. Use "bday" / "bday-*" when the date represents a birthday. Default is "off".',
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
      description: 'Date format used for parsing and displaying the selected date.',
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
      description:
        'ID for the input element. If you omit the input-id attribute entirely, the component will generate a unique ID per instance.',
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
};

// ======================================================
// Helpers (normalize + docs builder)
// ======================================================

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

const attrs = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replaceAll('"', '&quot;')}"`))
    .join('\n  ');

const buildDocsHtml = args => {
  const labelCol = Number.isFinite(Number(args.labelCol)) ? Number(args.labelCol) : 2;
  const inputCol = Number.isFinite(Number(args.inputCol)) ? Number(args.inputCol) : 10;

  const placeholder = (args.placeholder && String(args.placeholder).trim()) || args.dateFormat || 'YYYY-MM-DD';
  const icon = (args.icon && String(args.icon).trim()) || 'fas fa-calendar-alt';

  // Prefer showing explicit input-id only when the user set it or story provides it.
  // (Leaving it out demonstrates the component’s auto-generated unique IDs.)
  const shouldPrintInputId = args.inputId !== undefined && args.inputId !== null && String(args.inputId).trim() !== '';

  const attributeBlock = attrs(
    [
      ['calendar', !!args.calendar],
      ['plumage', !!args.plumage],
      ['disabled', !!args.disabled],
      ['required', !!args.required],
      ['validation', !!args.validationAttr],
      ['prepend', !!args.prepend],
      ['append', !!args.append],

      ['form-layout', args.formLayout],
      ['size', args.size],
      ['label-align', args.labelAlign],
      ['label-hidden', !!args.labelHidden],
      ['label', args.label],
      ['label-size', args.labelSize],

      ['label-col', args.formLayout === 'horizontal' ? labelCol : args.labelCol],
      ['input-col', args.formLayout === 'horizontal' ? inputCol : args.inputCol],
      ['label-cols', args.labelCols],
      ['input-cols', args.inputCols],

      ['date-format', args.dateFormat],
      ['placeholder', placeholder],
      ['autocomplete', args.autocomplete],
      [shouldPrintInputId ? 'input-id' : '', shouldPrintInputId ? args.inputId : ''],
      ['icon', icon],

      ['validation-message', args.validationMessage],
      ['warning-message', args.warningMessage],

      ['display-context-examples', !!args.displayContextExamples],
    ].filter(([k]) => !!k),
  );

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

  setBoolAttr(el, 'calendar', !!args.calendar);
  setBoolAttr(el, 'plumage', !!args.plumage);
  setBoolAttr(el, 'disabled', !!args.disabled);
  setBoolAttr(el, 'required', !!args.required);
  setBoolAttr(el, 'validation', !!args.validationAttr);
  setBoolAttr(el, 'prepend', !!args.prepend);
  setBoolAttr(el, 'append', !!args.append);

  if (typeof args.formLayout === 'string') el.formLayout = args.formLayout;
  if (typeof args.size === 'string') el.size = args.size;

  // Only set inputId if provided; otherwise let component generate unique IDs.
  if (args.inputId !== undefined && args.inputId !== null && String(args.inputId).trim() !== '') {
    el.inputId = args.inputId;
  }

  el.label = args.label;
  el.labelHidden = !!args.labelHidden;
  el.labelAlign = args.labelAlign || '';
  el.labelSize = args.labelSize || '';
  el.icon = args.icon || 'fas fa-calendar-alt';

  el.dateFormat = args.dateFormat;
  el.placeholder = args.placeholder;
  el.autocomplete = args.autocomplete || 'off';

  el.labelCol = Number(args.labelCol ?? 2);
  el.inputCol = Number(args.inputCol ?? 10);
  el.labelCols = args.labelCols || '';
  el.inputCols = args.inputCols || '';

  el.validationMessage = args.validationMessage || '';
  el.warningMessage = args.warningMessage || '';

  el.displayContextExamples = !!args.displayContextExamples;

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

// ======================================================
// Accessibility matrix (updated for new structure)
//  - help text is outside dialog
//  - calendar grid role is "group" (not "grid")
//  - validation feedback is aria-live polite + atomic
//  - prints computed role + aria-* + ids AND validates aria-describedby references exist
// ======================================================

function pickAttrs(el, names) {
  const out = {};
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

function splitIds(v) {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function safeAttrSelectorValue(v) {
  return String(v || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function resolveIdsWithin(host, ids) {
  const res = {};
  for (const id of ids) {
    const node = host.querySelector(`[id="${safeAttrSelectorValue(id)}"]`);
    res[id] = !!node;
  }
  return res;
}

function snapshotA11y(host) {
  const input = host.querySelector('input.form-control');
  const label = host.querySelector('label.form-control-label');
  const toggle = host.querySelector('button.calendar-button');
  const dialog = host.querySelector('.dropdown-content');
  const grid = host.querySelector('.calendar-grid');
  const help = host.querySelector('[id$="__desc"]');
  const validation = host.querySelector('[id$="__validation"]');

  const describedByIds = input ? splitIds(input.getAttribute('aria-describedby')) : [];
  const labelledByIds = input ? splitIds(input.getAttribute('aria-labelledby')) : [];

  return {
    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.getAttribute('id') || '',
          role: input.getAttribute('role') || '',
          ...pickAttrs(input, ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid', 'required', 'autocomplete']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledByIds),
            'aria-describedby': resolveIdsWithin(host, describedByIds),
          },
        }
      : null,
    label: label
      ? {
          tag: label.tagName.toLowerCase(),
          id: label.getAttribute('id') || '',
          for: label.getAttribute('for') || '',
          role: label.getAttribute('role') || '',
        }
      : null,
    helpText: help
      ? {
          id: help.getAttribute('id') || '',
          insideDialog: !!(dialog && dialog.contains(help)),
        }
      : null,
    validation: validation
      ? {
          id: validation.getAttribute('id') || '',
          ...pickAttrs(validation, ['aria-live', 'aria-atomic']),
          text: (validation.textContent || '').trim(),
        }
      : null,
    toggle: toggle
      ? {
          tag: toggle.tagName.toLowerCase(),
          id: toggle.getAttribute('id') || '',
          role: toggle.getAttribute('role') || '',
          ...pickAttrs(toggle, ['aria-label', 'aria-haspopup', 'aria-expanded', 'aria-controls', 'disabled']),
        }
      : null,
    dialog: dialog
      ? {
          tag: dialog.tagName.toLowerCase(),
          id: dialog.getAttribute('id') || '',
          role: dialog.getAttribute('role') || '',
          ...pickAttrs(dialog, ['aria-modal', 'aria-labelledby']),
        }
      : null,
    calendarGrid: grid
      ? {
          tag: grid.tagName.toLowerCase(),
          id: grid.getAttribute('id') || '',
          role: grid.getAttribute('role') || '',
          ...pickAttrs(grid, ['aria-label']),
        }
      : null,
  };
}

function renderMatrixRow({ title, args, idSuffix, forceInvalid = false }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const el = buildEl({
    ...args,
    inputId: `datepicker-matrix-${idSuffix}`,
  });

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

  stage.appendChild(el);
  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  const update = () => {
    const snap = snapshotA11y(el);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (forceInvalid) {
        const input = el.querySelector('input.form-control');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('blur', { bubbles: true }));
        }
      }
      requestAnimationFrame(update);
    });
  });

  return wrap;
}

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

  rows.forEach((r, idx) =>
    root.appendChild(
      renderMatrixRow({
        ...r,
        idSuffix: String(idx + 1),
      }),
    ),
  );

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
