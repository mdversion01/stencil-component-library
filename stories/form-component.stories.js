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
      description:
        'The id attribute for the form, useful for associating external buttons/inputs when outsideOfForm is true.',
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
      description:
        'Additional CSS styles to apply to the fieldset or form wrapper. Use with caution as it may override other styles.',
    },

    // Story-only
    numFields: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
      table: { disable: true },
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

  const attrs = [
    ['action', normalize(a.action)],
    ['method', normalize(a.method)],
    ['form-layout', normalize(a.formLayout)],
    ['form-id', normalize(a.formId)],
    ['legend-position', normalize(a.legendPosition)],
    ['legend-size', normalize(a.legendSize)],
    ['legend-txt', normalize(a.legendTxt)],
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

function makeInput(label, id) {
  const el = document.createElement('input-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  el.setAttribute('value', '');
  return el;
}

function makeTextarea(label, id) {
  const el = document.createElement('textarea-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  el.setAttribute('value', '');
  return el;
}

function makeSelect(label, id) {
  const el = document.createElement('select-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  return el;
}

const applyHorizontalRowMargins = (formEl, leftPx = 10) => {
  if (!formEl) return;

  const apply = () => {
    const root = formEl.shadowRoot ?? formEl;

    // try a couple common patterns
    const rows = root.querySelectorAll(
      '.form-group.row, .form-group-row, .row.form-group, [data-form-group-row="true"]',
    );

    rows.forEach((row) => {
      row.style.marginLeft = `${leftPx}px`;
    });
  };

  // wait for render + layout
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

  // Add sample fields (to the named slot="formField")
  fields.forEach((f) => form.appendChild(f));

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
    fields.push(makeInput(labels[i] || `Field ${i + 1}`, `input-${i + 1}`));
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
  // bstyle: 'solid',
  // bwidth: 1,
  // bradius: 6,
  // bcolor: '#d8dee4',
  // styles: 'padding: 12px;',
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
    makeInput('Tag', 'tag'),
    makeSelect('Category', 'cat'),
    makeTextarea('Notes', 'notes'),
  ];

  const el = buildForm(
    { ...args, outsideOfForm: true, fieldset: true, legend: true, legendTxt: 'Detached Layout', styles: 'padding: 16px 16px 16px 32px !important;', },
    fields,
  );

  const externalSubmit = document.createElement('button-component');
  externalSubmit.textContent = 'Submit (external)';
  externalSubmit.setAttribute('variant', 'secondary');

  // IMPORTANT: same display inline issue here
  externalSubmit.style.display = 'inline-block';
  externalSubmit.style.marginTop = '15px';

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
      story: 'The form wrapper can render without a native `<form>` element, allowing for custom layouts or integration with frameworks that handle forms differently.',
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
    makeInput('First Name', 'first'),
    makeInput('Last Name', 'last'),
    makeInput('Email', 'email'),
    makeSelect('Role', 'role'),
    makeTextarea('About You', 'about'),
  ];

  // IMPORTANT: merge defaults first, then controls/story args override
  return buildForm(
    {
      ...kitchenSinkDefaults,
      ...args,
    },
    fields
  );
};

// Make docs preview correct by putting the defaults here (NOT in render-only overrides)
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
