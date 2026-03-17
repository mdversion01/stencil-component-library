// stories/input-field-component.stories.js

export default {
  title: 'Form/Input Field',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A customizable input field component with various props for label, size, validation, and layout. ' +
          'Updated to always render help text (sr-only) and keep aria-describedby resolvable; validation is announced via aria-live.',
      },
      source: {
        language: 'html',
        // IMPORTANT: docs preview must reflect CURRENT args (including Controls changes)
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    /* =========================
     * Input Attributes
     * ========================= */
    disabled: {
      control: 'boolean',
      name: 'disabled',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Disables the input field, preventing user interaction.',
    },
    placeholder: {
      control: 'text',
      name: 'placeholder',
      table: { category: 'Input Attributes' },
      description: 'The placeholder text for the input element. This provides a hint to the user about what to enter.',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      description: 'Whether the input field is read-only',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
    },
    type: {
      control: 'text',
      description: 'The type of the input field',
      table: { category: 'Input Attributes' },
    },
    value: {
      control: 'text',
      description: 'The value of the input field',
      table: { category: 'Input Attributes' },
    },

    /* =========================
     * Layout
     * ========================= */
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description: 'Sets the form layout style. "horizontal" applies a two-column grid layout, while "inline" arranges elements in a single row.',
    },
    inputCol: {
      control: 'text',
      name: 'input-col',
      table: { category: 'Layout', defaultValue: { summary: 10 } },
      description: 'Used with horizontal form layouts. Single numeric column for the input in a grid. Default is 10 (col-10).',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive input column classes.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Layout' },
      description: 'The unique identifier for the input element within the component. This is used for accessibility and form association.',
    },
    label: {
      control: 'text',
      name: 'label',
      table: { category: 'Layout' },
      description: 'The text label for the component. This is used for accessibility and user guidance.',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Aligns the label text. "right" aligns the label to the right, which is typically used in horizontal form layouts.',
    },
    labelCol: {
      control: 'text',
      name: 'label-col',
      table: { category: 'Layout', defaultValue: { summary: 2 } },
      description: 'Used with horizontal form layouts. Single numeric column for the label in a grid. Default is 2 (col-2).',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive label column classes.',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Hides the label visually while keeping it accessible for screen readers.',
    },
    labelSize: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
      description: 'Sets the size of the label text. Options include "xs" (extra small), "sm" (small), and "lg" (large).',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: { category: 'Layout' },
      description: 'Sets the size of the input field. Options include "sm" (small) and "lg" (large). Not adding any size will use the default.',
    },

    /* =========================
     * Storybook Only
     * ========================= */
    wrapWithForm: {
      control: 'boolean',
      description:
        'When enabled, the input field will be wrapped in a `<form-component>` and `slot="formField"` is added to the `<input-field-component>` in the docs preview. ' +
        'This allows you to test form-related props like formLayout and see how the input behaves within a form context. This is a story-only control and does not affect the actual component props.',
      table: { category: 'Storybook Only', defaultValue: { summary: false } },
    },

    /* =========================
     * Validation
     * ========================= */
    required: {
      control: 'boolean',
      name: 'required',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the input as required, which will trigger validation if the field is left empty.',
    },
    validation: {
      control: 'boolean',
      name: 'validation',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Enables validation for the input field.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'The validation message to display when the input is invalid.',
    },
  },
  args: {
    disabled: false,
    formLayout: '',
    inputCol: 10,
    inputCols: '',
    inputId: 'first-name',
    label: 'First Name',
    labelAlign: '',
    labelCol: 2,
    labelCols: '',
    labelHidden: false,
    labelSize: 'xs',
    placeholder: '',
    readOnly: false,
    required: false,
    size: '',
    type: 'text',
    validation: false,
    validationMessage: 'This field is required.',
    value: '',
    wrapWithForm: false,
  },
};

/** ---------------- Docs helpers ---------------- */

const normalize = value => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const buildDocsHtml = args => {
  const a = { ...args };

  // Story-only args should not appear in the component tag preview
  delete a.wrapWithForm;

  const attrs = [
    ['label', normalize(a.label)],
    ['input-id', normalize(a.inputId)],
    ['type', normalize(a.type)],
    ['value', normalize(a.value)],
    ['placeholder', normalize(a.placeholder)],
    ['size', normalize(a.size)],
    ['label-size', normalize(a.labelSize)],
    ['label-align', normalize(a.labelAlign)],
    ['form-layout', normalize(a.formLayout)],
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['label-cols', normalize(a.labelCols)],
    ['input-cols', normalize(a.inputCols)],
    ['validation-message', normalize(a.validationMessage)],

    // boolean attrs (presence-based)
    ['label-hidden', !!a.labelHidden],
    ['disabled', !!a.disabled],
    ['read-only', !!a.readOnly],
    ['required', !!a.required],
    ['validation', !!a.validation],
  ];

  const attrStr = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  const openTag = attrStr
    ? `<input-field-component ${attrStr}></input-field-component>`
    : '<input-field-component></input-field-component>';

  // If the story is wrapped in a form (story-only behavior), reflect that in docs
  if (args.wrapWithForm) {
    const formAttrs = [['form-layout', normalize(args.formLayout)]]
      .filter(([_, v]) => v !== undefined && v !== false)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(' ');

    const formOpen = formAttrs
      ? `<form-component form-id="${esc(args.formId || 'demo-form')}" ${formAttrs}>`
      : `<form-component form-id="${esc(args.formId || 'demo-form')}">`;

    return [
      formOpen,
      `  ${openTag.replace('<input-field-component', '<input-field-component slot="formField"')}`,
      '</form-component>',
    ].join('\n');
  }

  return openTag;
};

/**
 * Multi-render stories output more than one component,
 * so we override docs.source.transform per-story.
 */
const buildDocsHtmlSizes = () => {
  return [
    '<div>',
    '  <input-field-component label="Default" input-id="size-default"></input-field-component>',
    '  <input-field-component label="Small" input-id="size-sm" size="sm"></input-field-component>',
    '  <input-field-component label="Large" input-id="size-lg" size="lg"></input-field-component>',
    '</div>',
  ].join('\n');
};

const buildDocsHtmlInlineLayout = () => {
  return [
    '<form-component form-layout="inline">',
    '  <input-field-component',
    '    slot="formField"',
    '    label="City"',
    '    input-id="city"',
    '    form-layout="inline"',
    '    input-cols="col-12 md-6"',
    '  ></input-field-component>',
    '  <input-field-component',
    '    slot="formField"',
    '    label="State"',
    '    input-id="state"',
    '    form-layout="inline"',
    '    input-cols="col-12 md-6"',
    '  ></input-field-component>',
    '</form-component>',
  ].join('\n');
};

// ✅ build docs HTML for ReadOnly + Disabled from the SAME args we render with
const buildDocsHtmlReadOnlyAndDisabled = () => {
  const roArgs = {
    label: 'Read-only',
    inputId: 'ro',
    readOnly: true,
    value: 'Read only value',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
    wrapWithForm: false,
  };

  const disArgs = {
    label: 'Disabled',
    inputId: 'dis',
    disabled: true,
    value: 'Disabled value',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
    wrapWithForm: false,
  };

  return [
    '<div>',
    `  ${buildDocsHtml(roArgs).replace(/\n/g, '\n  ')}`,
    `  ${buildDocsHtml(disArgs).replace(/\n/g, '\n  ')}`,
    '</div>',
  ].join('\n');
};

/* ----------------------- Helpers ----------------------- */

const makeInput = (args = {}) => {
  const el = document.createElement('input-field-component');

  // Assign props as properties (Stencil)
  el.disabled = !!args.disabled;
  el.formId = args.formId || '';
  el.formLayout = args.formLayout || '';
  el.inputId = args.inputId || '';
  el.size = args.size || '';
  el.label = args.label || '';
  el.labelSize = args.labelSize || 'xs';
  el.labelAlign = args.labelAlign || '';
  el.labelHidden = !!args.labelHidden;
  el.readOnly = !!args.readOnly;
  el.required = !!args.required;
  el.type = args.type || 'text';
  el.validation = !!args.validation;
  el.validationMessage = args.validationMessage || '';
  el.value = args.value ?? '';
  if (args.placeholder !== undefined) el.placeholder = args.placeholder;

  el.labelCol = Number.isFinite(args.labelCol) ? args.labelCol : 2;
  el.inputCol = Number.isFinite(args.inputCol) ? args.inputCol : 10;
  el.labelCols = args.labelCols || '';
  el.inputCols = args.inputCols || '';

  // Storybook action wiring
  el.addEventListener('valueChange', e => {
    // eslint-disable-next-line no-console
    console.log('[valueChange]', e.detail);
  });

  return el;
};

const wrapInForm = (inputEl, { formLayout = '', formId = 'demo-form' } = {}) => {
  const form = document.createElement('form-component');
  form.setAttribute('style', 'display:block; padding:12px;');
  form.formLayout = formLayout || '';
  form.formId = formId;
  // must use the named slot to render in the form
  inputEl.setAttribute('slot', 'formField');
  form.appendChild(inputEl);
  return form;
};

const Template = args => {
  const input = makeInput(args);
  return args.wrapWithForm ? wrapInForm(input, { formLayout: args.formLayout }) : input;
};

/* ----------------------- Stories ----------------------- */

export const Basic = Template.bind({});
Basic.args = {
  label: 'First Name',
  inputId: 'firstName',
  placeholder: 'Enter your first name',
  validationMessage: '',
  labelCol: '',
  inputCol: '',
  labelSize: 'sm',
};
Basic.storyName = 'Basic';
Basic.parameters = {
  docs: {
    description: {
      story: 'A basic input field with a label and placeholder.',
    },
  },
};

export const Sizes = () => {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gap = '12px';

  container.append(
    Template({ label: 'Default', inputId: 'size-default', size: '' }),
    Template({ label: 'Small', inputId: 'size-sm', size: 'sm' }),
    Template({ label: 'Large', inputId: 'size-lg', size: 'lg' }),
  );
  return container;
};
Sizes.parameters = {
  docs: {
    source: {
      language: 'html',
      transform: () => buildDocsHtmlSizes(),
    },
    description: {
      story: 'Input fields with different sizes, demonstrating small, default, and large options.',
    },
  },
};

export const HorizontalLayout = {
  args: {
    formLayout: 'horizontal',
    label: 'Email',
    inputId: 'email',
    type: 'email',
    labelCol: 3,
    inputCol: 9,
    validationMessage: '',
  },
  render: args => Template(args),
};
HorizontalLayout.storyName = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'An input field within a horizontal form layout, using labelCol and inputCol for grid sizing.',
    },
  },
};

export const InlineLayout = () => {
  const row = document.createElement('form-component');
  row.formLayout = 'inline';
  row.setAttribute('style', 'display:block; padding:12px; gap:12px;');

  const first = makeInput({
    label: 'City',
    inputId: 'city',
    formLayout: 'inline',
    labelCols: '',
    inputCols: '',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
  });
  first.setAttribute('slot', 'formField');

  const second = makeInput({
    label: 'State',
    inputId: 'state',
    formLayout: 'inline',
    labelCols: '',
    inputCols: '',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
  });
  second.setAttribute('slot', 'formField');

  row.append(first, second);
  return row;
};
InlineLayout.storyName = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    source: {
      language: 'html',
      transform: () => buildDocsHtmlInlineLayout(),
    },
    description: {
      story: 'An input field within an inline form layout, demonstrating responsive column sizing.',
    },
  },
};

export const RequiredWithValidation = Template.bind({});
RequiredWithValidation.args = {
  label: 'Username',
  inputId: 'username',
  required: true,
  validation: true,
  validationMessage: 'Please enter at least 3 characters.',
  formLayout: '',
  labelCol: '',
  inputCol: '',
};
RequiredWithValidation.storyName = 'Required with Validation';
RequiredWithValidation.parameters = {
  docs: {
    description: {
      story: 'A required input field with validation enabled. The validation message will display if the field is left empty or does not meet the criteria.',
    },
  },
};

export const LabelHidden = Template.bind({});
LabelHidden.args = {
  label: 'Search',
  inputId: 'search',
  labelHidden: true,
  placeholder: 'Search…',
  validationMessage: '',
  labelCol: '',
  inputCol: '',
  labelSize: '',
};
LabelHidden.storyName = 'Label Hidden';
LabelHidden.parameters = {
  docs: {
    description: {
      story: 'An input field with the label visually hidden but still accessible to screen readers.',
    },
  },
};

export const ReadOnlyAndDisabled = {
  render: () => {
    const stack = document.createElement('div');
    stack.style.display = 'grid';
    stack.style.gap = '12px';

    stack.append(
      Template({
        label: 'Read-only',
        inputId: 'ro',
        readOnly: true,
        value: 'Read only value',
        validationMessage: '',
        labelCol: '',
        inputCol: '',
      }),
      Template({
        label: 'Disabled',
        inputId: 'dis',
        disabled: true,
        value: 'Disabled value',
        validationMessage: '',
        labelCol: '',
        inputCol: '',
      }),
    );

    return stack;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () => buildDocsHtmlReadOnlyAndDisabled(),
      },
      description: {
        story:
          'Two input fields demonstrating read-only and disabled states. The read-only field can be focused and its value can be selected, but not edited. The disabled field is non-interactive.',
      },
    },
  },
};
ReadOnlyAndDisabled.storyName = 'Read-Only and Disabled';

export const ResponsiveCols = {
  args: {
    wrapWithForm: true,
    formLayout: 'horizontal',
    label: 'Company',
    inputId: 'company',
    labelCols: 'sm-3 md-4',
    inputCols: 'sm-9 md-8',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
  },
  render: args => Template(args),
};
ResponsiveCols.storyName = 'Responsive Columns';
ResponsiveCols.parameters = {
  docs: {
    description: {
      story:
        'An input field demonstrating responsive column sizing using `labelCols` and `inputCols` within a horizontal form layout. Displayed using the `form-component` wrapper.',
    },
  },
};

// ======================================================
// Accessibility matrix (default/inline/horizontal, error/validation, disabled)
// Prints computed role + aria-* + ids AND validates aria-describedby/labelledby resolve
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

function resolveIdsWithin(host, ids) {
  const res = {};
  for (const id of ids) {
    const node = host.querySelector(`[id="${String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`);
    res[id] = !!node;
  }
  return res;
}

function snapshotA11y(host) {
  const label = host.querySelector('label.form-control-label');
  const input = host.querySelector('input.form-control');
  const help = host.querySelector('[id$="__desc"]');
  const validation = host.querySelector('[id$="__validation"]');

  const describedByIds = input ? splitIds(input.getAttribute('aria-describedby')) : [];
  const labelledByIds = input ? splitIds(input.getAttribute('aria-labelledby')) : [];

  return {
    label: label
      ? {
          tag: label.tagName.toLowerCase(),
          id: label.getAttribute('id') || '',
          for: label.getAttribute('for') || '', // may be empty in light DOM; we still print it
          class: label.className || '',
        }
      : null,
    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.getAttribute('id') || '',
          role: input.getAttribute('role') || '',
          class: input.className || '',
          ...pickAttrs(input, [
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
            'aria-invalid',
            'required',
            'readonly',
            'disabled',
            'type',
            'name',
            'placeholder',
            'form',
          ]),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledByIds),
            'aria-describedby': resolveIdsWithin(host, describedByIds),
          },
        }
      : null,
    helpText: help
      ? {
          id: help.getAttribute('id') || '',
          class: help.className || '',
        }
      : null,
    validation: validation
      ? {
          id: validation.getAttribute('id') || '',
          class: validation.className || '',
          ...pickAttrs(validation, ['aria-live', 'aria-atomic']),
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

  // Ensure stable, unique id base so the component’s __desc/__validation are deterministic per row
  const el = makeInput({
    ...args,
    inputId: `ifc-matrix-${idSuffix}`,
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
      Also reports whether <code>aria-labelledby</code> / <code>aria-describedby</code> resolve to real elements.
      Help text (<code>__desc</code>) is expected to always exist; validation (<code>__validation</code>) is expected only when invalid.
    </div>
  `;
  root.appendChild(intro);

  const rows = [
    {
      title: 'Default (stacked)',
      args: { label: 'First Name', formLayout: '', disabled: false, required: false, validation: false, validationMessage: '' },
      forceInvalid: false,
    },
    {
      title: 'Inline',
      args: { label: 'City', formLayout: 'inline', disabled: false, required: false, validation: false, validationMessage: '' },
      forceInvalid: false,
    },
    {
      title: 'Horizontal (responsive cols)',
      args: {
        label: 'Email',
        formLayout: 'horizontal',
        labelCols: 'xs-12 sm-3',
        inputCols: 'xs-12 sm-9',
        disabled: false,
        required: false,
        validation: false,
        validationMessage: '',
      },
      forceInvalid: false,
    },
    {
      title: 'Error / Validation (required + validation=true)',
      args: {
        label: 'Username',
        formLayout: '',
        required: true,
        validation: true,
        validationMessage: 'Please enter at least 3 characters.',
        value: '',
      },
      forceInvalid: true,
    },
    {
      title: 'Disabled',
      args: { label: 'Company', formLayout: '', disabled: true, required: false, validation: false, validationMessage: '', value: 'Disabled value' },
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
