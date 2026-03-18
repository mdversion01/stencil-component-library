// stories/plumage-input-field.stories.js

/* ------------------------------------------------------------------
 * Storybook: Plumage Input Field (Web Component)
 * Component tag: <plumage-input-field-component>
 * ------------------------------------------------------------------ */

const TAG = 'plumage-input-field-component';

/* ---------------- Docs helpers ---------------- */

const normalizeArg = (value) => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Put each attribute on its own line (for Docs code previews) */
const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${esc(String(v))}"`))
    .join('\n  ');

/** Build docs HTML from CURRENT args (including controls changes) */
const buildDocsHtml = (args) => {
  const a = { ...args };

  // Story-only args should not appear in the component tag preview
  delete a.wrapWithForm;

  const attrs = [
    // core
    ['label', normalizeArg(a.label)],
    ['input-id', normalizeArg(a.inputId)],
    ['type', normalizeArg(a.type)],
    ['value', normalizeArg(a.value)],
    ['placeholder', normalizeArg(a.placeholder)],
    ['size', normalizeArg(a.size)],
    ['label-size', normalizeArg(a.labelSize)],
    ['label-align', normalizeArg(a.labelAlign)],
    ['form-layout', normalizeArg(a.formLayout)],
    ['form-id', normalizeArg(a.formId)],

    // cols
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['label-cols', normalizeArg(a.labelCols)],
    ['input-cols', normalizeArg(a.inputCols)],

    // validation
    ['validation-message', normalizeArg(a.validationMessage)],

    // ✅ standard a11y
    ['aria-label', normalizeArg(a.ariaLabel)],
    ['aria-labelledby', normalizeArg(a.ariaLabelledby)],
    ['aria-describedby', normalizeArg(a.ariaDescribedby)],

    // ✅ legacy a11y (kept for parity w/ component)
    ['arialabelled-by', normalizeArg(a.arialabelledBy)],

    // boolean attrs (presence-based)
    ['label-hidden', !!a.labelHidden],
    ['disabled', !!a.disabled],
    ['read-only', !!a.readOnly],
    ['required', !!a.required],
    ['validation', !!a.validation],
  ];

  const openTag = `<${TAG}\n  ${attrLines(attrs)}\n></${TAG}>`;

  // If the story is wrapped in a form (story-only behavior), reflect that in docs
  if (args.wrapWithForm) {
    const formAttrs = [
      ['form-id', normalizeArg(args.formId || 'demo-form')],
      ['form-layout', normalizeArg(args.formLayout)],
    ]
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => `${k}="${esc(String(v))}"`)
      .join(' ');

    const formOpen = formAttrs ? `<form-component ${formAttrs}>` : `<form-component form-id="${esc(args.formId || 'demo-form')}">`;

    // add slot in docs if wrapped
    const slotted = openTag.replace(`<${TAG}`, `<${TAG} slot="formField"`);

    return [formOpen, `  ${slotted.replace(/\n/g, '\n  ')}`, `</form-component>`].join('\n');
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
    `  <${TAG} label="Default" input-id="size-default"></${TAG}>`,
    `  <${TAG} label="Small" input-id="size-sm" size="sm"></${TAG}>`,
    `  <${TAG} label="Large" input-id="size-lg" size="lg"></${TAG}>`,
    '</div>',
  ].join('\n');
};

const buildDocsHtmlInlineLayout = () => {
  return [
    '<form-component form-layout="inline" form-id="inline-form">',
    `  <${TAG}`,
    '    slot="formField"',
    '    label="City"',
    '    input-id="city"',
    '    form-layout="inline"',
    `  ></${TAG}>`,
    `  <${TAG}`,
    '    slot="formField"',
    '    label="State"',
    '    input-id="state"',
    '    form-layout="inline"',
    `  ></${TAG}>`,
    '</form-component>',
  ].join('\n');
};

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

/* ---------------- Runtime helpers ---------------- */

const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

// minimal CSS selector escaping for ids (avoid CSS.escape in JSDOM/SB envs)
const cssEscapeIdent = (value) => String(value).replace(/([ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');

const makeInput = (args = {}) => {
  const el = document.createElement(TAG);

  // Props as properties (Stencil)
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

  // ✅ standard a11y attrs (attribute-mapped props)
  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  // ✅ legacy a11y attr
  setAttr(el, 'arialabelled-by', args.arialabelledBy);

  // Storybook action wiring
  el.addEventListener('valueChange', (e) => {
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

  inputEl.setAttribute('slot', 'formField');
  form.appendChild(inputEl);
  return form;
};

const Template = (args) => {
  const input = makeInput(args);
  return args.wrapWithForm ? wrapInForm(input, { formLayout: args.formLayout, formId: args.formId || 'demo-form' }) : input;
};

/* ------------------------------------------------------------------
 * Default export
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Plumage Input Field',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A customizable single Plumage-styled text input field component with various props for label, size, validation, layout, and standard ARIA naming hooks (aria-label/aria-labelledby/aria-describedby).',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  render: (args) => Template(args),

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
      description: 'The placeholder text for the input element.',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      description: 'Whether the input field is read-only.',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
    },
    type: {
      control: 'text',
      name: 'type',
      description: 'The type of the input field.',
      table: { category: 'Input Attributes' },
    },
    value: {
      control: 'text',
      name: 'value',
      description: 'Controlled value (external source of truth).',
      table: { category: 'Input Attributes' },
    },

    /* =========================
     * Accessibility
     * ========================= */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional accessible name for the input (used only when aria-labelledby is not set).',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'Optional external id reference used to label the input (preferred).',
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      table: { category: 'Accessibility' },
      description: 'Optional helper text id reference. Component appends validation id when invalid.',
    },
    arialabelledBy: {
      control: 'text',
      name: 'arialabelled-by',
      table: { category: 'Accessibility' },
      description: 'Legacy: id(s) of external label(s). Prefer aria-labelledby.',
    },

    /* =========================
     * Layout
     * ========================= */
    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Layout' },
      description: 'Associates the input with a form element by its id.',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description: 'Sets the form layout style.',
    },
    inputCol: {
      control: 'text',
      name: 'input-col',
      table: { category: 'Layout', defaultValue: { summary: 10 } },
      description: 'Used with horizontal form layouts. Numeric column for the input.',
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
      description: 'The unique identifier for the input (also becomes the input id used for a11y wiring).',
    },
    label: {
      control: 'text',
      name: 'label',
      table: { category: 'Layout' },
      description: 'The text label for the component.',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Aligns the label text.',
    },
    labelCol: {
      control: 'text',
      name: 'label-col',
      table: { category: 'Layout', defaultValue: { summary: 2 } },
      description: 'Used with horizontal form layouts. Numeric column for the label.',
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
      description: 'Sets the size of the label text.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: { category: 'Layout' },
      description: 'Sets the size of the input field.',
    },

    /* =========================
     * Storybook Only
     * ========================= */
    wrapWithForm: {
      control: 'boolean',
      description: 'When enabled, wraps the input in a <form-component> and slots it as formField. Story-only control.',
      table: { category: 'Storybook Only', defaultValue: { summary: false } },
    },

    /* =========================
     * Validation
     * ========================= */
    required: {
      control: 'boolean',
      name: 'required',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the input as required.',
    },
    validation: {
      control: 'boolean',
      name: 'validation',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Externally toggled invalid state.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'The validation message to display when invalid.',
    },
  },

  // ✅ IMPORTANT: default (Primary) must NOT share ids with any story shown on the same docs page.
  args: {
    // input
    disabled: false,
    placeholder: '',
    readOnly: false,
    type: 'text',
    value: '',

    // a11y
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
    arialabelledBy: '',

    // layout
    formId: '',
    formLayout: '',
    inputCol: 10,
    inputCols: '',
    inputId: 'plumage-if-default', // unique for the Primary/Default render
    label: 'First Name',
    labelAlign: '',
    labelCol: 2,
    labelCols: '',
    labelHidden: false,
    labelSize: 'xs',
    size: '',

    // validation
    required: false,
    validation: false,
    validationMessage: 'This field is required.',

    // storybook only
    wrapWithForm: false,
  },
};

/* ------------------------------------------------------------------
 * Stories
 * ------------------------------------------------------------------ */

export const Basic = Template.bind({});
Basic.args = {
  label: 'First Name',
  inputId: 'plumage-if-basic', // ✅ unique vs default args
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
    formId: 'demo-form',
    wrapWithForm: true,
  },
  render: (args) => Template(args),
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
  row.formId = 'inline-form';
  row.setAttribute('style', 'display:block; padding:12px; gap:12px;');

  const first = makeInput({
    label: 'City',
    inputId: 'city',
    formLayout: 'inline',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
  });
  first.setAttribute('slot', 'formField');

  const second = makeInput({
    label: 'State',
    inputId: 'state',
    formLayout: 'inline',
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
      story: 'An input field within an inline form layout.',
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
      story: 'A required input field with validation enabled.',
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
  // optional override name; component will still aria-labelledby to sr-only label unless external aria-labelledby set
  ariaLabel: '',
};
LabelHidden.storyName = 'Label Hidden';
LabelHidden.parameters = {
  docs: {
    description: {
      story: 'An input field with the label visually hidden but still accessible (sr-only label + aria-labelledby).',
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
          'Two input fields demonstrating read-only and disabled states. Read-only can be focused/selected but not edited; disabled is non-interactive.',
      },
    },
  },
};
ReadOnlyAndDisabled.storyName = 'Read-Only and Disabled';

export const ResponsiveCols = {
  args: {
    wrapWithForm: true,
    formLayout: 'horizontal',
    formId: 'demo-form',
    label: 'Company',
    inputId: 'company',
    labelCols: 'sm-3 md-4',
    inputCols: 'sm-9 md-8',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
  },
  render: (args) => Template(args),
};
ResponsiveCols.storyName = 'Responsive Columns';
ResponsiveCols.parameters = {
  docs: {
    description: {
      story: 'Demonstrates responsive column sizing using `labelCols` and `inputCols` within a horizontal form layout (via form-component wrapper).',
    },
  },
};

/* ------------------------------------------------------------------
 * NEW: Accessibility matrix story
 * ------------------------------------------------------------------ */

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML = `<strong>Accessibility matrix</strong>
<div style="opacity:.8">Prints computed label/input wiring: tag + ids + aria-* across default/inline/horizontal, validation, and disabled.</div>`;
    wrap.appendChild(title);

    const cardRow = (labelText, buildEl) => {
      const card = document.createElement('div');
      card.style.display = 'grid';
      card.style.alignItems = 'start';
      card.style.border = '1px solid #ddd';
      card.style.borderRadius = '8px';
      card.style.padding = '12px';

      const left = document.createElement('div');
      left.innerHTML = `<div style="font-weight:600">${labelText}</div>`;

      const right = document.createElement('div');
      right.style.display = 'grid';
      right.style.gap = '8px';

      const demo = document.createElement('div');
      const el = buildEl();
      demo.appendChild(el);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      right.appendChild(demo);
      right.appendChild(pre);

      card.appendChild(left);
      card.appendChild(right);

      const snapshot = () => {
        const host = demo.querySelector(TAG);

        const input = host?.querySelector('input') || null;
        const label = host?.querySelector('label') || null;

        const described = (input?.getAttribute('aria-describedby') || '').trim();
        const describedIds = described ? described.split(/\s+/).filter(Boolean) : [];
        const resolved = describedIds.map((id) => {
          const sel = `#${cssEscapeIdent(id)}`;
          return { id, exists: !!host?.querySelector(sel) };
        });

        pre.textContent = JSON.stringify(
          {
            hostTag: host?.tagName?.toLowerCase() ?? null,
            inputTag: input?.tagName?.toLowerCase() ?? null,
            inputId: input?.getAttribute('id') ?? null,
            inputName: input?.getAttribute('name') ?? null,
            labelId: label?.getAttribute('id') ?? null,
            labelFor: label?.getAttribute('for') ?? label?.getAttribute('htmlfor') ?? null,
            role: input?.getAttribute('role') ?? null,
            type: input?.getAttribute('type') ?? null,
            'aria-labelledby': input?.getAttribute('aria-labelledby') ?? null,
            'aria-label': input?.getAttribute('aria-label') ?? null,
            'aria-describedby': input?.getAttribute('aria-describedby') ?? null,
            'aria-required': input?.getAttribute('aria-required') ?? null,
            'aria-invalid': input?.getAttribute('aria-invalid') ?? null,
            'aria-disabled': input?.getAttribute('aria-disabled') ?? null,
            'aria-readonly': input?.getAttribute('aria-readonly') ?? null,
            disabled: input?.hasAttribute('disabled') ?? null,
            readOnly: input?.hasAttribute('readonly') ?? null,
            hasValidationMessage: !!host?.querySelector('.invalid-feedback'),
            describedbyResolves: resolved,
          },
          null,
          2,
        );
      };

      queueMicrotask(() => requestAnimationFrame(snapshot));
      return card;
    };

    // Default (stacked)
    wrap.appendChild(
      cardRow('Default (stacked)', () =>
        Template({
          label: 'Default A11y',
          inputId: 'mx-default',
          formLayout: '',
          validation: false,
          disabled: false,
          readOnly: false,
          required: false,
          validationMessage: '',
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: '',
          arialabelledBy: '',
        }),
      ),
    );

    // Inline
    wrap.appendChild(
      cardRow('Inline layout', () => {
        const input = makeInput({
          label: 'Inline A11y',
          inputId: 'mx-inline',
          formLayout: 'inline',
          validationMessage: '',
        });
        return wrapInForm(input, { formLayout: 'inline', formId: 'mx-form-inline' });
      }),
    );

    // Horizontal
    wrap.appendChild(
      cardRow('Horizontal layout', () =>
        Template({
          wrapWithForm: true,
          formId: 'mx-form-horizontal',
          formLayout: 'horizontal',
          label: 'Horizontal A11y',
          inputId: 'mx-horizontal',
          labelCol: 4,
          inputCol: 8,
          validationMessage: '',
        }),
      ),
    );

    // Validation
    wrap.appendChild(
      cardRow('Validation (aria-invalid + describedby)', () =>
        Template({
          label: 'Messages',
          inputId: 'mx-msg',
          required: true,
          validation: true,
          validationMessage: 'This is required.',
          value: '',
        }),
      ),
    );

    // Disabled
    wrap.appendChild(
      cardRow('Disabled (aria-disabled)', () =>
        Template({
          label: 'Disabled',
          inputId: 'mx-disabled',
          disabled: true,
          value: 'Disabled value',
          validationMessage: '',
        }),
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the input: ids + label association + aria-* (aria-labelledby/aria-label/aria-describedby/aria-invalid/aria-disabled/aria-readonly) across default/inline/horizontal, validation, and disabled.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
};
