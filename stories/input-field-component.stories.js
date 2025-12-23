// stories/input-field-component.stories.js

export default {
  title: 'Form/Input Field',
  tags: ['autodocs'],
  argTypes: {
    // Component props
    label: { control: 'text' },
    inputId: { control: 'text' },
    type: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    size: { control: { type: 'inline-radio' }, options: ['', 'sm', 'lg'] },
    labelSize: { control: { type: 'inline-radio' }, options: ['xs', 'sm', 'lg', ''] },
    labelAlign: { control: { type: 'inline-radio' }, options: ['', 'right'] },
    labelHidden: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    required: { control: 'boolean' },
    validation: { control: 'boolean' },
    validationMessage: { control: 'text' },
    // Layout (component-level)
    formLayout: { control: { type: 'inline-radio' }, options: ['', 'horizontal', 'inline'] },
    labelCol: { control: 'number' },
    inputCol: { control: 'number' },
    labelCols: { control: 'text' },
    inputCols: { control: 'text' },

    // Story-only helpers
    wrapWithForm: { control: 'boolean', description: 'Wrap with <form-component> to inherit layout/formId' },
  },
  args: {
    label: 'First Name',
    inputId: 'first-name',
    type: 'text',
    value: '',
    placeholder: '',
    size: '',
    labelSize: 'sm',
    labelAlign: '',
    labelHidden: false,
    disabled: false,
    readOnly: false,
    required: false,
    validation: false,
    validationMessage: 'This field is required.',
    formLayout: '',
    labelCol: 2,
    inputCol: 10,
    labelCols: '',
    inputCols: '',
    wrapWithForm: false,
  },
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
  el.labelSize = args.labelSize || 'sm';
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
  // must use the named slot to render in the form
  inputEl.setAttribute('slot', 'formField');
  form.appendChild(inputEl);
  return form;
};

const Template = (args) => {
  const input = makeInput(args);
  return args.wrapWithForm ? wrapInForm(input, { formLayout: args.formLayout }) : input;
};

/* ----------------------- Stories ----------------------- */

export const Basic = Template.bind({});
Basic.args = {
  label: 'First Name',
  inputId: 'firstName',
  placeholder: 'Enter your first name',
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

export const HorizontalLayout = () => {
  const input = makeInput({
    label: 'Email',
    inputId: 'email',
    type: 'email',
    formLayout: 'horizontal',
    labelCol: 3,
    inputCol: 9,
  });
  return wrapInForm(input, { formLayout: 'horizontal' });
};

export const InlineLayout = () => {
  const row = document.createElement('form-component');
  row.formLayout = 'inline';
  row.setAttribute('style', 'display:block; padding:12px; gap:12px;');

  const first = makeInput({ label: 'City', inputId: 'city', formLayout: 'inline', labelCols: '', inputCols: 'col-12 md-6' });
  first.setAttribute('slot', 'formField');
  const second = makeInput({ label: 'State', inputId: 'state', formLayout: 'inline', labelCols: '', inputCols: 'col-12 md-6' });
  second.setAttribute('slot', 'formField');

  row.append(first, second);
  return row;
};

export const RequiredWithValidation = Template.bind({});
RequiredWithValidation.args = {
  label: 'Username',
  inputId: 'username',
  required: true,
  validation: true,
  validationMessage: 'Please enter at least 3 characters.',
  wrapWithForm: true,
  formLayout: '',
};

export const LabelHidden = Template.bind({});
LabelHidden.args = {
  label: 'Search',
  inputId: 'search',
  labelHidden: true,
  placeholder: 'Search…',
};

export const ReadOnlyAndDisabled = () => {
  const stack = document.createElement('div');
  stack.style.display = 'grid';
  stack.style.gap = '12px';

  stack.append(
    Template({ label: 'Read-only', inputId: 'ro', readOnly: true, value: 'Read only value' }),
    Template({ label: 'Disabled', inputId: 'dis', disabled: true, value: 'Disabled value' }),
  );
  return stack;
};

export const CustomResponsiveCols = () => {
  const input = makeInput({
    label: 'Company',
    inputId: 'company',
    formLayout: 'horizontal',
    // Use responsive string specs instead of numeric 2/10
    labelCols: 'sm-3 md-2',
    inputCols: 'sm-9 md-10',
  });
  return wrapInForm(input, { formLayout: 'horizontal' });
};

export const Playground = Template.bind({});
Playground.args = {
  label: 'Playground',
  inputId: 'playground',
  placeholder: 'Try different controls',
  wrapWithForm: false,
};
