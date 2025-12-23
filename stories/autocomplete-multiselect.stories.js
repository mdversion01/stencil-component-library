// stories/autocomplete-multiselect.stories.js

// tiny helpers
const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const setOptionsWhenReady = async (el, options) => {
  const safe = Array.isArray(options) ? options : [];
  // Prefer Stencil's componentOnReady if present, otherwise whenDefined
  if (typeof el.componentOnReady === 'function') {
    await el.componentOnReady();
    await el.setOptions(safe);
  } else {
    await customElements.whenDefined('autocomplete-multiselect');
    await el.setOptions(safe);
  }
};

export default {
  title: 'Form/Autocomplete Multiselect',
  tags: ['autodocs'],
  render: (args) => {
    const el = document.createElement('autocomplete-multiselect');

    // string/enum attributes
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
    setAttr(el, 'validation-message', args.validationMessage);
    setAttr(el, 'clear-icon', args.clearIcon);
    setAttr(el, 'add-icon', args.addIcon);
    setAttr(el, 'name', args.name);
    setAttr(el, 'raw-input-name', args.rawInputName);
    setAttr(el, 'badge-variant', args.badgeVariant);
    setAttr(el, 'badge-shape', args.badgeShape);
    setAttr(el, 'badge-inline-styles', args.badgeInlineStyles);

    // booleans
    args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
    args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
    args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
    args.labelHidden ? el.setAttribute('label-hidden', '') : el.removeAttribute('label-hidden');
    args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
    args.addBtn ? el.setAttribute('add-btn', '') : el.removeAttribute('add-btn');
    args.editable ? el.setAttribute('editable', '') : el.removeAttribute('editable');
    args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');
    args.clearInputOnBlurOutside ? el.setAttribute('clear-input-on-blur-outside', '') : el.removeAttribute('clear-input-on-blur-outside');

    // behavior toggles as attributes (they’re props internally)
    setAttr(el, 'auto-sort', args.autoSort);
    setAttr(el, 'add-new-on-enter', args.addNewOnEnter);
    setAttr(el, 'preserve-input-on-select', args.preserveInputOnSelect);

    // wire events for quick sanity logs
    el.addEventListener('multiSelectChange', (e) => console.log('[autocomplete-multiselect] selectionChange', e.detail));
    el.addEventListener('optionsChange', (e) => console.log('[autocomplete-multiselect] optionsChange', e.detail));
    el.addEventListener('optionDelete', (e) => console.log('[autocomplete-multiselect] optionDelete', e.detail));
    el.addEventListener('clear', () => console.log('[autocomplete-multiselect] clear'));

    // provide options via PUBLIC API (property set won’t trigger setOptions hooks)
    const fallback = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];
    setOptionsWhenReady(el, (Array.isArray(args.options) && args.options.length) ? args.options : fallback);

    // little layout nicety
    el.style.display = 'block';
    el.style.margin = '16px 0';
    return el;
  },

  argTypes: {
    // enums
    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'] },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'] },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'] },
    labelSize: { control: { type: 'select' }, options: ['xs', 'sm', 'base', 'lg'] },

    // strings
    id: { control: 'text' },
    inputId: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    labelCols: { control: 'text' },
    inputCols: { control: 'text' },
    validationMessage: { control: 'text' },
    clearIcon: { control: 'text' },
    addIcon: { control: 'text' },
    name: { control: 'text' },
    rawInputName: { control: 'text' },
    badgeVariant: { control: 'text' },
    badgeShape: { control: 'text' },
    badgeInlineStyles: { control: 'text' },

    // booleans
    required: { control: 'boolean' },
    validation: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelHidden: { control: 'boolean' },
    devMode: { control: 'boolean' },
    addBtn: { control: 'boolean' },
    editable: { control: 'boolean' },
    removeClearBtn: { control: 'boolean' },
    clearInputOnBlurOutside: { control: 'boolean' },

    // behavior flags
    autoSort: { control: 'boolean' },
    addNewOnEnter: { control: 'boolean' },
    preserveInputOnSelect: { control: 'boolean' },

    // data
    options: { control: 'object' },
  },

  args: {
    id: 'aci-multi',
    inputId: 'ac-multi',
    label: 'Autocomplete Multiselect',
    placeholder: 'Type to search/filter...',
    formLayout: '',
    labelAlign: '',
    labelSize: '',
    size: '',
    labelCols: '',
    inputCols: '',

    required: false,
    validation: false,
    validationMessage: 'Please fill in',
    disabled: false,
    labelHidden: false,
    devMode: false,

    addBtn: false,
    addIcon: 'fas fa-plus',
    editable: false,
    removeClearBtn: false,
    clearIcon: 'fa-solid fa-xmark',
    clearInputOnBlurOutside: false,

    autoSort: true,
    addNewOnEnter: true,
    preserveInputOnSelect: false,

    name: '',
    rawInputName: '',

    badgeVariant: '',
    badgeShape: '',
    badgeInlineStyles: '',

    options: ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'],
  },
};

// ------- Stories -------

export const Basic = {
  args: {
    formLayout: '',
    labelAlign: '',
  },
};

export const EditableWithAddButton = {
  name: 'Editable + Add Button',
  args: {
    editable: true,
    addBtn: true,
    preserveInputOnSelect: false,
    clearInputOnBlurOutside: false,
  },
};

export const HorizontalGrid = {
  args: {
    formLayout: 'horizontal',
    labelAlign: 'right',
   },
};

export const InlineLayout = {
  args: {
    formLayout: 'inline',
    labelAlign: '',
  },
};
