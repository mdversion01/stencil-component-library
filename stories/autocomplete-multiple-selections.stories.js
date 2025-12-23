// stories/autocomplete-multiple-selections.stories.js

// --- tiny helpers ---
const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const setOptionsWhenReady = async (el, options) => {
  const safe = Array.isArray(options) ? options.slice() : [];
  // This component watches the `options` PROP, so assign after it's defined/hydrated
  if (typeof el.componentOnReady === 'function') {
    await el.componentOnReady();
  } else if (window.customElements?.whenDefined) {
    await customElements.whenDefined('autocomplete-multiple-selections');
  }
  el.options = safe;
};

export default {
  title: 'Form/Autocomplete Multiple Selections',
  tags: ['autodocs'],

  render: (args) => {
    const el = document.createElement('autocomplete-multiple-selections');

    // string/enum attrs
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
    args.removeBtnBorder ? el.setAttribute('remove-btn-border', '') : el.removeAttribute('remove-btn-border');
    args.clearInputOnBlurOutside ? el.setAttribute('clear-input-on-blur-outside', '') : el.removeAttribute('clear-input-on-blur-outside');

    // behavior flags (mapped to attributes; component reads as props)
    setAttr(el, 'auto-sort', args.autoSort);
    setAttr(el, 'add-new-on-enter', args.addNewOnEnter);
    setAttr(el, 'preserve-input-on-select', args.preserveInputOnSelect);

    // quick event logs
    el.addEventListener('multiSelectChange', (e) => console.log('[ams] selectionChange', e.detail));
    el.addEventListener('optionDelete', (e) => console.log('[ams] optionDelete', e.detail));
    el.addEventListener('clear', () => console.log('[ams] clear'));

    // provide options after hydration (this component expects prop assignment)
    const fallback = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];
    setOptionsWhenReady(el, (Array.isArray(args.options) && args.options.length) ? args.options : fallback);

    el.style.display = 'block';
    el.style.margin = '16px 0';
    return el;
  },

  argTypes: {
    // enums
    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'] },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'] },
    labelSize: { control: { type: 'select' }, options: ['xs', 'sm', 'base', 'lg'] },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'] },

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
    removeBtnBorder: { control: 'boolean' },
    clearInputOnBlurOutside: { control: 'boolean' },

    // behavior flags
    autoSort: { control: 'boolean' },
    addNewOnEnter: { control: 'boolean' },
    preserveInputOnSelect: { control: 'boolean' },

    // data
    options: { control: 'object' },
  },

  args: {
    id: 'aci4',
    inputId: 'ac-2',
    label: 'Autocomplete Multiple Selections',
    placeholder: 'Type to search/filter...',
    formLayout: '',
    labelAlign: '',
    labelSize: '',
    size: '',
    slot: '',
    labelCol: '',
    inputCol: '',
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
    removeBtnBorder: false,
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

    options: ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango', 'Bet', 'Betty', 'Bobby', 'Bob', 'Bobby Brown', 'Bobby Blue', 'Bobby Green'],
  },
};

// --- Variants ---
export const Basic = {
  args: {
    formLayout: '',
    labelAlign: '',
  },
};

export const HorizontalGrid = {
  args: {
    formLayout: 'horizontal',
    labelAlign: 'right',
  },
};

export const EditableKeepOpen = {
  name: 'Editable (Add + Keep Open)',
  args: {
    editable: true,
    addBtn: true,
    preserveInputOnSelect: true,
    clearInputOnBlurOutside: false,
  },
};

export const InlineLayout = {
  args: {
    formLayout: 'inline',
    labelAlign: '',
  },
};
