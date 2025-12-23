// stories/form-component.stories.js

export default {
  title: 'Form/Form Wrapper',
  tags: ['autodocs'],
  argTypes: {
    // Native form attributes
    action: { control: 'text' },
    method: { control: 'text' },

    // Fieldset + legend
    fieldset: { control: 'boolean' },
    legend: { control: 'boolean' },
    legendPosition: {
      control: { type: 'inline-radio' },
      options: ['left', 'center', 'right'],
    },
    legendTxt: { control: 'text' },

    // Layout + id
    formLayout: {
      control: { type: 'inline-radio' },
      options: ['', 'horizontal', 'inline'],
    },
    formId: { control: 'text' },

    // Rendering mode
    outsideOfForm: { control: 'boolean' },

    // Border/box styles
    bcolor: { control: 'text' },
    bradius: { control: 'number' },
    bstyle: { control: 'text' },
    bwidth: { control: 'number' },

    // Extra CSS text
    styles: { control: 'text' },

    // Story-only
    numFields: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
      table: { disable: true },
    },
  },
  args: {
    action: '',
    method: '',
    fieldset: false,
    legend: false,
    legendPosition: 'left',
    legendTxt: 'Add Title Here',
    formLayout: '',
    formId: 'demo-form',
    outsideOfForm: false,
    bcolor: '',
    bradius: undefined,
    bstyle: '',
    bwidth: undefined,
    styles: '',
    numFields: 2,
  },
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
  // optionally add <option> children if your select component uses light DOM
  return el;
}

function buildForm(args, fields) {
  const form = document.createElement('form-component');

  // Props
  if (args.action) form.action = args.action;
  if (args.method) form.method = args.method;
  form.fieldset = !!args.fieldset;
  form.legend = !!args.legend;
  form.legendPosition = args.legendPosition;
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
  fields.forEach(f => form.appendChild(f));

  // A submit button (can be your own button component if preferred)
  const submit = document.createElement('button-component');
  submit.setAttribute('variant', 'primary');
  submit.textContent = 'Submit';
  submit.setAttribute('slot', 'formField');
  // If outsideOfForm=true, you could set submit.setAttribute('form', args.formId)
  // but your inputs/buttons may auto-wire using closest('form-component').

  form.appendChild(submit);

  // Log actual form submissions for demo
  // (only fires when a real <form> is rendered)
  form.addEventListener('submit', e => {
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

/** ---------------- Stories ---------------- */

export const Basic = Template.bind({});
Basic.args = {
  formLayout: '',
  fieldset: false,
  legend: false,
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  numFields: 3,
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  numFields: 3,
};

export const WithFieldset = Template.bind({});
WithFieldset.args = {
  fieldset: true,
  legend: false,
  formLayout: '',
  bstyle: 'solid',
  bwidth: 1,
  bradius: 6,
  bcolor: '#d8dee4',
  styles: 'padding: 12px;',
};

export const WithLegendCentered = Template.bind({});
WithLegendCentered.args = {
  fieldset: true,
  legend: true,
  legendPosition: 'center',
  legendTxt: 'Profile Details',
  bstyle: 'solid',
  bwidth: 1,
  bradius: 8,
  bcolor: '#cbd5e1',
  styles: 'padding: 12px;',
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

export const OutsideOfForm = (args) => {
  // Demonstrates rendering without a native <form>.
  // Consumers can still read formId via closest('form-component') and set
  // their own 'form' attribute on submit buttons/inputs if needed.
  const fields = [
    makeInput('Tag', 'tag'),
    makeSelect('Category', 'cat'),
    makeTextarea('Notes', 'notes'),
  ];
  const el = buildForm(
    { ...args, outsideOfForm: true, fieldset: true, legend: true, legendTxt: 'Detached Layout' },
    fields
  );

  // Example: custom submit button that targets the external form id
  const externalSubmit = document.createElement('button-component');
  externalSubmit.textContent = 'Submit (external)';
  externalSubmit.setAttribute('variant', 'secondary');
  externalSubmit.style.marginTop = '12px';

  // If you were using a real <form> elsewhere, you could set:
  // externalSubmit.setAttribute('form', args.formId);

  const wrapper = document.createElement('div');
  wrapper.appendChild(el);
  wrapper.appendChild(externalSubmit);
  return wrapper;
};
OutsideOfForm.args = {
  formLayout: 'horizontal',
  formId: 'detached-form',
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

export const KitchenSink = (args) => {
  const fields = [
    makeInput('First Name', 'first'),
    makeInput('Last Name', 'last'),
    makeInput('Email', 'email'),
    makeSelect('Role', 'role'),
    makeTextarea('About You', 'about'),
  ];
  return buildForm(
    {
      ...args,
      fieldset: true,
      legend: true,
      legendTxt: 'All Props Demo',
      bstyle: 'solid',
      bwidth: 1,
      bradius: 12,
      bcolor: '#e5e7eb',
      styles: 'padding: 16px;',
      formLayout: 'horizontal',
      method: 'post',
      action: '/fake-endpoint',
    },
    fields
  );
};
KitchenSink.args = {};
