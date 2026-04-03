// stories/form-component.stories.js

export default {
  title: 'Form/Form Wrapper',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible wrapper for forms that can render with or without a native `<form>` element. Supports fieldsets, legends, and various layout and styling options.',
      },
      source: {
        language: 'html',
        // IMPORTANT: docs preview must reflect CURRENT args (including Controls changes)
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    // Native form attributes
    action: {
      control: 'text',
      table: { category: 'Form Attributes' },
      description: 'The URL where the form data will be sent on submit.',
    },
    method: {
      control: 'text',
      table: { category: 'Form Attributes' },
      description: 'The HTTP method to use when submitting the form.',
    },

    // NEW: optional ARIA hooks for <form>
    formAriaLabel: {
      control: 'text',
      name: 'form-aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional aria-label applied to the native <form> (only when outsideOfForm=false).',
    },
    formAriaLabelledby: {
      control: 'text',
      name: 'form-aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'Optional aria-labelledby applied to the native <form> (only when outsideOfForm=false).',
    },
    formAriaDescribedby: {
      control: 'text',
      name: 'form-aria-describedby',
      table: { category: 'Accessibility' },
      description: 'Optional aria-describedby applied to the native <form> (only when outsideOfForm=false).',
    },

    // NEW: optional ARIA hooks for <fieldset>
    fieldsetAriaLabel: {
      control: 'text',
      name: 'fieldset-aria-label',
      table: { category: 'Accessibility' },
      description:
        'Optional aria-label applied to <fieldset>. Useful when fieldset=true but legend=false so the group still has a name.',
    },
    fieldsetAriaLabelledby: {
      control: 'text',
      name: 'fieldset-aria-labelledby',
      table: { category: 'Accessibility' },
      description:
        'Optional aria-labelledby applied to <fieldset>. If legend=true and these are empty, component auto-wires to legend id.',
    },
    fieldsetAriaDescribedby: {
      control: 'text',
      name: 'fieldset-aria-describedby',
      table: { category: 'Accessibility' },
      description: 'Optional aria-describedby applied to <fieldset>.',
    },

    // Fieldset + legend
    fieldset: {
      control: 'boolean',
      table: { category: 'Fieldset & Legend', defaultValue: false },
      description: 'Whether to wrap the form fields in a `<fieldset>` element.',
    },
    legend: {
      control: 'boolean',
      table: { category: 'Fieldset & Legend', defaultValue: false },
      description: 'Whether to display a `<legend>` element for the fieldset.',
    },
    legendPosition: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      table: { category: 'Fieldset & Legend', defaultValue: 'left' },
      description: 'The position of the legend text within the fieldset.',
    },
    legendSize: {
      control: { type: 'select' },
      options: ['small', 'base', 'large', 'xlarge'],
      table: { category: 'Fieldset & Legend', defaultValue: 'base' },
      description: 'The size of the legend text.',
    },
    legendTxt: {
      control: 'text',
      table: { category: 'Fieldset & Legend' },
      description: 'The text content of the legend.',
    },

    // Layout + id
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      table: { category: 'Layout' },
      description:
        'The layout style for the form fields. "horizontal" typically means labels and inputs are side by side, while "inline" means fields flow horizontally like text.',
    },
    formId: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'The id attribute for the form, useful for associating external buttons/inputs when outsideOfForm is true.',
    },

    // Rendering mode
    outsideOfForm: {
      control: 'boolean',
      table: { category: 'Rendering Mode', defaultValue: false },
      description:
        'If true, the component will render without a native `<form>` element. Useful for custom layouts or when using with frameworks that handle forms differently.',
    },

    // Border/box styles
    bcolor: {
      control: 'text',
      table: { category: 'Styles' },
      description: 'Border color for the fieldset (if fieldset=true).',
    },
    bradius: {
      control: 'number',
      table: { category: 'Styles' },
      description: 'Border radius for the fieldset (if fieldset=true).',
    },
    bstyle: {
      control: 'text',
      table: { category: 'Styles' },
      description: 'Border style for the fieldset (if fieldset=true).',
    },
    bwidth: {
      control: 'number',
      table: { category: 'Styles' },
      description: 'Border width for the fieldset (if fieldset=true).',
    },

    // Extra CSS text
    styles: {
      control: 'text',
      table: { category: 'Styles' },
      description: 'Additional CSS styles to apply to the fieldset or form wrapper.',
    },

    // Story-only
    numFields: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
      table: { disable: true },
    },

    // Story-only: pseudo “validation/error” state for accessibility matrix
    showValidation: {
      control: 'boolean',
      name: 'show-validation',
      table: { disable: true },
      description: 'Story-only helper used by Accessibility matrix to render an error block.',
    },
    validationText: {
      control: 'text',
      name: 'validation-text',
      table: { disable: true },
      description: 'Story-only helper message used by Accessibility matrix.',
    },
    disabledDemo: {
      control: 'boolean',
      name: 'disabled-demo',
      table: { disable: true },
      description: 'Story-only helper to disable child fields/buttons in Accessibility matrix.',
    },
  },
  args: {
    action: '',
    bcolor: '',
    bradius: undefined,
    bstyle: '',
    bwidth: undefined,
    fieldset: false,
    formId: 'demo-form',
    formLayout: '',
    legend: false,
    legendPosition: 'left',
    legendSize: 'base',
    legendTxt: 'Add Title Here',
    method: '',
    numFields: 2,
    outsideOfForm: false,
    styles: '',

    // NEW ARIA hooks
    formAriaLabel: '',
    formAriaLabelledby: '',
    formAriaDescribedby: '',
    fieldsetAriaLabel: '',
    fieldsetAriaLabelledby: '',
    fieldsetAriaDescribedby: '',

    // Story-only helpers
    showValidation: false,
    validationText: 'Please fix the errors above.',
    disabledDemo: false,
  },
};

/** ---------------- Docs helpers ---------------- */

const normalize = (value) => {
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

const buildDocsHtml = (args) => {
  const a = { ...args };

  // Remove story-only args from preview
  delete a.numFields;
  delete a.showValidation;
  delete a.validationText;
  delete a.disabledDemo;

  const attrs = [
    ['action', normalize(a.action)],
    ['method', normalize(a.method)],
    ['form-layout', normalize(a.formLayout)],
    ['form-id', normalize(a.formId)],

    // NEW: ARIA hooks
    ['form-aria-label', normalize(a.formAriaLabel)],
    ['form-aria-labelledby', normalize(a.formAriaLabelledby)],
    ['form-aria-describedby', normalize(a.formAriaDescribedby)],
    ['fieldset-aria-label', normalize(a.fieldsetAriaLabel)],
    ['fieldset-aria-labelledby', normalize(a.fieldsetAriaLabelledby)],
    ['fieldset-aria-describedby', normalize(a.fieldsetAriaDescribedby)],

    // Fieldset/legend
    ['legend-position', normalize(a.legendPosition)],
    ['legend-size', normalize(a.legendSize)],
    ['legend-txt', normalize(a.legendTxt)],

    // Styles
    ['bcolor', normalize(a.bcolor)],
    ['bradius', typeof a.bradius === 'number' ? a.bradius : undefined],
    ['bstyle', normalize(a.bstyle)],
    ['bwidth', typeof a.bwidth === 'number' ? a.bwidth : undefined],
    ['styles', normalize(a.styles)],

    // boolean attrs (presence-based)
    ['fieldset', !!a.fieldset],
    ['legend', !!a.legend],
    ['outside-of-form', !!a.outsideOfForm],
  ];

  const attrStr = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  const openTag = attrStr ? `<form-component ${attrStr}>` : '<form-component>';

  return [
    openTag,
    '  <!-- slot="formField" children are rendered in the Canvas for this story -->',
    '</form-component>',
  ].join('\n');
};

/** ---------------- Helpers ---------------- */

function makeInput(label, id, disabled = false) {
  const el = document.createElement('input-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  el.setAttribute('value', '');
  if (disabled) el.setAttribute('disabled', '');
  return el;
}

function makeTextarea(label, id, disabled = false) {
  const el = document.createElement('textarea-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  el.setAttribute('value', '');
  if (disabled) el.setAttribute('disabled', '');
  return el;
}

function makeSelect(label, id, disabled = false) {
  const el = document.createElement('select-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  if (disabled) el.setAttribute('disabled', '');
  return el;
}

const applyHorizontalRowMargins = (formEl, leftPx = 10) => {
  if (!formEl) return;

  const apply = () => {
    const root = formEl.shadowRoot ?? formEl;

    const rows = root.querySelectorAll(
      '.form-group.row, .form-group-row, .row.form-group, [data-form-group-row="true"]',
    );

    rows.forEach((row) => {
      row.style.marginLeft = `${leftPx}px`;
    });
  };

  requestAnimationFrame(() => requestAnimationFrame(apply));
};

function buildForm(args, fields) {
  const form = document.createElement('form-component');

  // Props
  if (args.action) form.action = args.action;
  if (args.method) form.method = args.method;
  form.fieldset = !!args.fieldset;
  form.legend = !!args.legend;
  form.legendPosition = args.legendPosition;
  form.legendSize = args.legendSize;
  form.legendTxt = args.legendTxt;
  form.formLayout = args.formLayout;
  form.formId = args.formId;
  form.outsideOfForm = !!args.outsideOfForm;
  form.bcolor = args.bcolor;
  if (typeof args.bradius === 'number') form.bradius = args.bradius;
  form.bstyle = args.bstyle;
  if (typeof args.bwidth === 'number') form.bwidth = args.bwidth;
  form.styles = args.styles || '';

  // NEW ARIA hooks
  if (args.formAriaLabel) form.formAriaLabel = args.formAriaLabel;
  if (args.formAriaLabelledby) form.formAriaLabelledby = args.formAriaLabelledby;
  if (args.formAriaDescribedby) form.formAriaDescribedby = args.formAriaDescribedby;

  if (args.fieldsetAriaLabel) form.fieldsetAriaLabel = args.fieldsetAriaLabel;
  if (args.fieldsetAriaLabelledby) form.fieldsetAriaLabelledby = args.fieldsetAriaLabelledby;
  if (args.fieldsetAriaDescribedby) form.fieldsetAriaDescribedby = args.fieldsetAriaDescribedby;

  // Add sample fields (to the named slot="formField")
  fields.forEach((f) => form.appendChild(f));

  // Optional “validation” block (Story-only helper)
  if (args.showValidation) {
    const msg = document.createElement('div');
    msg.id = `${args.formId || 'demo-form'}__validation`;
    msg.setAttribute('slot', 'formField');
    msg.className = 'invalid-feedback validation';
    msg.setAttribute('aria-live', 'polite');
    msg.setAttribute('aria-atomic', 'true');
    msg.style.display = 'block';
    msg.style.marginTop = '10px';
    msg.textContent = args.validationText || 'Please fix the errors above.';
    form.appendChild(msg);
  }

  // Primary submit button + spacing
  const submit = document.createElement('button-component');
  submit.setAttribute('variant', 'primary');
  submit.textContent = 'Submit';
  submit.setAttribute('slot', 'formField');

  // IMPORTANT: custom elements are display:inline by default -> vertical margins won't show
  submit.style.display = 'inline-block';
  submit.style.marginLeft = '15px';
  submit.style.marginTop = '15px';
  submit.style.marginBottom = '15px';

  if (args.disabledDemo) {
    submit.setAttribute('disabled', '');
  }

  form.appendChild(submit);

  // Horizontal layout row left margin
  if (args.formLayout === 'horizontal') {
    applyHorizontalRowMargins(form, 10);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('[form submit]', { action: form.action, method: form.method });
  });

  return form;
}

const Template = (args) => {
  const fields = [];
  const n = Math.max(1, Math.min(6, Number(args.numFields) || 2));
  const labels = ['First Name', 'Last Name', 'Email', 'Company', 'Role', 'City'];

  for (let i = 0; i < n; i++) {
    fields.push(makeInput(labels[i] || `Field ${i + 1}`, `input-${i + 1}`, !!args.disabledDemo));
  }
  return buildForm(args, fields);
};

export const Basic = Template.bind({});
Basic.args = {
  formLayout: '',
  fieldset: false,
  legend: false,
};
Basic.storyName = 'Basic Setup';
Basic.parameters = {
  docs: {
    description: {
      story: 'A simple form wrapper with no fieldset or legend, and default layout.',
    },
  },
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  numFields: 3,
};
HorizontalLayout.storyName = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'Fields are arranged in a horizontal layout, typically with labels and inputs side by side.',
    },
  },
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  numFields: 3,
};
InlineLayout.storyName = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    description: {
      story: 'Fields flow horizontally like text, wrapping to new lines as needed.',
    },
  },
};

export const WithFieldset = Template.bind({});
WithFieldset.args = {
  fieldset: true,
  legend: false,
  legendPosition: '',
  legendTxt: '',
  legendSize: '',
};
WithFieldset.storyName = 'Using a Fieldset';
WithFieldset.parameters = {
  docs: {
    description: {
      story: 'A form wrapper that includes a fieldset but no legend.',
    },
  },
};

export const WithLegendCentered = Template.bind({});
WithLegendCentered.args = {
  fieldset: true,
  legend: true,
  legendPosition: 'left',
  legendTxt: 'Profile Details',
  bstyle: 'solid',
  bwidth: 1,
  bradius: 8,
  bcolor: '#1b2af5 !important',
  styles: 'padding: 12px;',
};
WithLegendCentered.storyName = 'Fieldset with Legend';
WithLegendCentered.parameters = {
  docs: {
    description: {
      story: 'A form wrapper that includes a fieldset and a left-aligned legend.',
    },
  },
};

export const StyledFieldsetBorders = Template.bind({});
StyledFieldsetBorders.args = {
  fieldset: true,
  legend: true,
  legendTxt: 'Contact',
  legendPosition: 'left',
  bstyle: 'dashed',
  bwidth: 2,
  bradius: 10,
  bcolor: '#94a3b8',
  styles: 'padding: 16px; background: #fafafa;',
  numFields: 2,
};
StyledFieldsetBorders.storyName = 'Styled Fieldset Borders';
StyledFieldsetBorders.parameters = {
  docs: {
    description: {
      story: 'A form wrapper that includes a fieldset with custom border styles.',
    },
  },
};

export const OutsideOfForm = (args) => {
  const fields = [
    makeInput('Tag', 'tag', !!args.disabledDemo),
    makeSelect('Category', 'cat', !!args.disabledDemo),
    makeTextarea('Notes', 'notes', !!args.disabledDemo),
  ];

  const el = buildForm(
    {
      ...args,
      outsideOfForm: true,
      fieldset: true,
      legend: true,
      legendTxt: 'Detached Layout',
      styles: 'padding: 16px 16px 16px 32px !important;',
    },
    fields,
  );

  const externalSubmit = document.createElement('button-component');
  externalSubmit.textContent = 'Submit (external)';
  externalSubmit.setAttribute('variant', 'secondary');

  externalSubmit.style.display = 'inline-block';
  externalSubmit.style.marginTop = '15px';

  if (args.disabledDemo) externalSubmit.setAttribute('disabled', '');

  const wrapper = document.createElement('div');
  wrapper.appendChild(el);
  wrapper.appendChild(externalSubmit);
  return wrapper;
};
OutsideOfForm.args = {
  formLayout: 'horizontal',
  formId: 'detached-form',
};
OutsideOfForm.storyName = 'Rendering Outside of a Native Form';
OutsideOfForm.parameters = {
  docs: {
    description: {
      story:
        'The form wrapper can render without a native `<form>` element, allowing for custom layouts or integration with frameworks that handle forms differently.',
    },
  },
};

export const ControlledActionMethod = Template.bind({});
ControlledActionMethod.args = {
  action: '/submit-here',
  method: 'post',
  formLayout: '',
  fieldset: true,
  legend: true,
  legendTxt: 'Signup',
};
ControlledActionMethod.storyName = 'Controlled Action and Method';
ControlledActionMethod.parameters = {
  docs: {
    description: {
      story: 'A form wrapper with explicitly set action and method attributes, demonstrating how to control form submission behavior.',
    },
  },
};

const kitchenSinkDefaults = {
  fieldset: true,
  legend: true,
  legendTxt: 'All Props Demo',
  bstyle: 'solid',
  bwidth: 1,
  bradius: 12,
  bcolor: '#e5e7eb',
  styles: 'padding: 16px 16px 16px 32px !important;',
  formLayout: 'horizontal',
  method: 'post',
  action: '/fake-endpoint',
};

export const KitchenSink = (args) => {
  const fields = [
    makeInput('First Name', 'first', !!args.disabledDemo),
    makeInput('Last Name', 'last', !!args.disabledDemo),
    makeInput('Email', 'email', !!args.disabledDemo),
    makeSelect('Role', 'role', !!args.disabledDemo),
    makeTextarea('About You', 'about', !!args.disabledDemo),
  ];

  return buildForm(
    {
      ...kitchenSinkDefaults,
      ...args,
    },
    fields,
  );
};

KitchenSink.args = {
  ...kitchenSinkDefaults,
};

KitchenSink.storyName = 'Kitchen Sink';
KitchenSink.parameters = {
  docs: {
    description: {
      story: 'A comprehensive example showcasing all the main features and props of the form wrapper component.',
    },
  },
};

// ======================================================
// NEW: Accessibility matrix
//  - default / inline / horizontal
//  - error/validation (storybook-only helper)
//  - disabled (storybook-only helper disables children)
//  - prints computed role + aria-* + ids
// ======================================================

function pickAttrs(el, names) {
  const out = {};
  if (!el) return out;
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

function safeQueryById(root, id) {
  const safe = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return root.querySelector(`[id="${safe}"]`);
}

function resolveIdsWithin(root, ids) {
  const res = {};
  for (const id of ids) {
    res[id] = !!safeQueryById(root, id);
  }
  return res;
}

function collectIds(root) {
  const ids = Array.from(root.querySelectorAll('[id]'))
    .map((n) => n.id)
    .filter(Boolean);
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
  const dups = Array.from(counts.entries())
    .filter(([, c]) => c > 1)
    .map(([id, c]) => ({ id, count: c }));
  return { total: ids.length, unique: counts.size, duplicates: dups };
}

function snapshotA11y(host) {
  const form = host.querySelector('form');
  const fieldset = host.querySelector('fieldset');
  const legend = host.querySelector('legend');
  const slotNodes = host.querySelectorAll('[slot="formField"]');
  const validation = host.querySelector('.invalid-feedback.validation, .invalid-feedback.warning, [id$="__validation"]');

  const labelledbyForm = form ? splitIds(form.getAttribute('aria-labelledby')) : [];
  const describedbyForm = form ? splitIds(form.getAttribute('aria-describedby')) : [];
  const labelledbyFs = fieldset ? splitIds(fieldset.getAttribute('aria-labelledby')) : [];
  const describedbyFs = fieldset ? splitIds(fieldset.getAttribute('aria-describedby')) : [];

  return {
    host: {
      tag: host.tagName.toLowerCase(),
      id: host.id || '',
    },
    structure: {
      hasForm: !!form,
      hasFieldset: !!fieldset,
      hasLegend: !!legend,
      slotCount: slotNodes.length,
    },
    form: form
      ? {
          tag: form.tagName.toLowerCase(),
          id: form.getAttribute('id') || '',
          class: form.getAttribute('class') || '',
          ...pickAttrs(form, ['aria-label', 'aria-labelledby', 'aria-describedby']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledbyForm),
            'aria-describedby': resolveIdsWithin(host, describedbyForm),
          },
        }
      : null,
    fieldset: fieldset
      ? {
          tag: fieldset.tagName.toLowerCase(),
          ...pickAttrs(fieldset, ['aria-label', 'aria-labelledby', 'aria-describedby']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledbyFs),
            'aria-describedby': resolveIdsWithin(host, describedbyFs),
          },
        }
      : null,
    legend: legend
      ? {
          tag: legend.tagName.toLowerCase(),
          id: legend.getAttribute('id') || '',
          class: legend.getAttribute('class') || '',
          text: (legend.textContent || '').trim(),
        }
      : null,
    validation: validation
      ? {
          tag: validation.tagName.toLowerCase(),
          id: validation.getAttribute('id') || '',
          ...pickAttrs(validation, ['aria-live', 'aria-atomic', 'role']),
          text: (validation.textContent || '').trim(),
        }
      : null,
    ids: collectIds(host),
  };
}

function renderMatrixRow({ title, args, idSuffix }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  // Ensure unique formId per row (helps legend id uniqueness too)
  const el = Template({
    ...args,
    formId: `form-matrix-${idSuffix}`,
  });

  const stage = document.createElement('div');
  stage.style.maxWidth = '860px';

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
    // "el" here is the form-component instance returned by Template/buildForm
    const host = stage.querySelector('form-component') || el;
    const snap = snapshotA11y(host);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

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
      Includes Storybook-only "validation" and "disabled" demos to help audit 508/WCAG behavior.
    </div>
  `;
  root.appendChild(intro);

  const rows = [
    {
      title: 'Default',
      args: { formLayout: '', fieldset: false, legend: false, outsideOfForm: false, showValidation: false, disabledDemo: false },
    },
    {
      title: 'Inline layout',
      args: { formLayout: 'inline', fieldset: false, legend: false, outsideOfForm: false, showValidation: false, disabledDemo: false, numFields: 3 },
    },
    {
      title: 'Horizontal layout (fieldset + legend)',
      args: { formLayout: 'horizontal', fieldset: true, legend: true, legendTxt: 'Details', outsideOfForm: false, showValidation: false, disabledDemo: false, numFields: 3 },
    },
    {
      title: 'Error/validation (storybook demo block)',
      args: {
        formLayout: '',
        fieldset: true,
        legend: true,
        legendTxt: 'Validation Demo',
        outsideOfForm: false,
        showValidation: true,
        validationText: 'Please fix the errors above.',
        // example of wiring form describedby to our demo validation block (exists by id)
        formAriaDescribedby: 'form-matrix-4__validation', // gets overridden by per-row formId in renderMatrixRow
        disabledDemo: false,
        numFields: 2,
      },
    },
    {
      title: 'Disabled (storybook demo disables children)',
      args: { formLayout: '', fieldset: true, legend: true, legendTxt: 'Disabled Demo', outsideOfForm: false, showValidation: false, disabledDemo: true, numFields: 2 },
    },
  ];

  rows.forEach((r, idx) => {
    // Fix describedby for the validation row so it matches the per-row formId that renderMatrixRow sets
    const idSuffix = String(idx + 1);
    const fixedArgs =
      r.title.startsWith('Error/validation')
        ? { ...r.args, formAriaDescribedby: `form-matrix-${idSuffix}__validation` }
        : r.args;

    root.appendChild(renderMatrixRow({ title: r.title, args: fixedArgs, idSuffix }));
  });

  return root;
};

AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of key states (default/inline/horizontal, error/validation demo, disabled demo). Each row prints computed role/aria/ids and whether ARIA references resolve.',
    },
    story: { height: '1250px' },
  },
  controls: { disable: true },
};
