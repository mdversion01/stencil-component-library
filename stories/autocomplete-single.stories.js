// stories/autocomplete-single.stories.js

// small helpers
const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const setOptionsSafely = (el, options) => {
  customElements.whenDefined('autocomplete-single').then(() => {
    requestAnimationFrame(() => {
      el.options = Array.isArray(options) ? options : [];
    });
  });
};

export default {
  title: 'Form/Autocomplete Single',
  tags: ['autodocs'],
  render: (args) => {
    const el = document.createElement('autocomplete-single');

    // attributes
    setAttr(el, 'id', args.id);
    setAttr(el, 'input-id', args.inputId);
    setAttr(el, 'label', args.label);
    setAttr(el, 'placeholder', args.placeholder);
    setAttr(el, 'form-layout', args.formLayout);
    setAttr(el, 'label-align', args.labelAlign);
    setAttr(el, 'label-size', args.labelSize);
    setAttr(el, 'size', args.size);
    setAttr(el, 'label-cols', args.labelCols);
    setAttr(el, 'input-cols', args.inputCols);
    setAttr(el, 'clear-icon', args.clearIcon);
    setAttr(el, 'validation-message', args.validationMessage);

    // booleans
    args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
    args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
    args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
    args.labelHidden ? el.setAttribute('label-hidden', '') : el.removeAttribute('label-hidden');
    args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');

    // options as a PROPERTY
    const fallback = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];
    setOptionsSafely(el, Array.isArray(args.options) && args.options.length ? args.options : fallback);

    el.addEventListener('itemSelect', (e) => console.log('[autocomplete-single] itemSelect', e.detail));
    el.addEventListener('clear', () => console.log('[autocomplete-single] clear'));

    el.style.display = 'block';
    el.style.margin = '16px 0';
    return el;
  },
  argTypes: {
    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'] },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'] },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'] },
    labelSize: { control: { type: 'select' }, options: ['xs', 'sm', 'base', 'lg'] },

    id: { control: 'text' },
    inputId: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    labelCols: { control: 'text' },
    inputCols: { control: 'text' },
    validationMessage: { control: 'text' },
    clearIcon: { control: 'text' },

    required: { control: 'boolean' },
    validation: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelHidden: { control: 'boolean' },
    devMode: { control: 'boolean' },

    options: { control: 'object' },
  },
  args: {
    id: 'aci-story',
    inputId: 'ac-single',
    label: 'Autocomplete Single',
    placeholder: 'Type to search/filter...',
    formLayout: 'horizontal',
    labelAlign: 'right',
    // labelSize: 'sm',
    // size: 'sm',
    labelCols: '',
    inputCols: '',
    // required: true,
    // validation: true,
    // validationMessage: 'Please fill in',
    disabled: false,
    labelHidden: false,
    devMode: false,
    clearIcon: 'fa-solid fa-xmark',
    options: ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'],
  },
};

export const Basic = {
  args: {
    formLayout: '',
    labelAlign: '',
    labelCols: '',
    inputCols: '',
    size: '',
    labelSize: '',
  },
};

export const HorizontalGrid = {
  args: {
    formLayout: 'horizontal',
    // size: 'sm',
    // labelSize: 'sm',
  },
};

export const InlineGrid = {
  args: {
    formLayout: 'inline',
    // size: 'sm',
    // labelSize: 'sm',
  },
};
