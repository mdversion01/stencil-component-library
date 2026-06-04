import DocsPage from './plumage-autocomplete-single.docs.mdx';
import {
  DocsWrapStyles,
  DEFAULT_OPTIONS,
  SIZE_VARIANTS,
  buildDocsComponentHtml,
  buildDocsHtmlMany,
  mkMatrixCellSingle,
  normalize,
  renderComponent,
  setAttr,
  setAutoSortWhenReady,
  setOptionsWhenReady,
  setValueWhenReady,
  TAG,
  updateArgsBestEffort,
  withUniqueId,
  nextMountSuffix,
  wrapDocsHtml,
} from './plumage-autocomplete-single.story-helpers.js';

export default {
  title: 'Form/Plumage Autocomplete Single',
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const wrap = document.createElement('div');
      wrap.appendChild(DocsWrapStyles());
      wrap.appendChild(Story());
      return wrap;
    },
  ],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'A Plumage-styled single-select autocomplete with focus underline, keyboard navigation, validation, responsive layouts (stacked, horizontal, inline), and optional clear action.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsComponentHtml(ctx.args)),
      },
    },
  },

  render: (args, ctx) => renderComponent(args, ctx),

  argTypes: {
    arialabelledBy: { control: 'text', name: 'arialabelled-by', table: { category: 'Input Attributes' } },
    autoSort: { control: 'boolean', name: 'auto-sort', table: { category: 'Attributes', defaultValue: { summary: true } } },
    clearIcon: { control: 'text', name: 'clear-icon', table: { category: 'Button Attributes' } },
    devMode: { control: 'boolean', name: 'dev-mode', table: { category: 'Attributes', defaultValue: { summary: false } } },
    disabled: { control: 'boolean', name: 'disabled', table: { category: 'Attributes', defaultValue: { summary: false } } },
    error: { control: 'boolean', name: 'error', table: { category: 'Attributes', defaultValue: { summary: false } } },
    errorMessage: { control: 'text', name: 'error-message', table: { category: 'Attributes' } },
    formId: { control: 'text', name: 'form-id', table: { category: 'Attributes' } },
    formLayout: { control: { type: 'select' }, options: ['', 'horizontal', 'inline'], name: 'form-layout', table: { category: 'Layout' } },
    id: { control: 'text', name: 'id', table: { category: 'Attributes' } },
    inputId: { control: 'text', name: 'input-id', table: { category: 'Input Attributes' } },
    label: { control: 'text', name: 'label', table: { category: 'Input Attributes' } },
    labelAlign: { control: { type: 'select' }, options: ['', 'right'], name: 'label-align', table: { category: 'Layout' } },
    labelCol: { control: 'text', name: 'label-col', table: { category: 'Layout' } },
    inputCol: { control: 'text', name: 'input-col', table: { category: 'Layout' } },
    labelCols: { control: 'text', name: 'label-cols', table: { category: 'Layout' } },
    inputCols: { control: 'text', name: 'input-cols', table: { category: 'Layout' } },
    labelHidden: { control: 'boolean', name: 'label-hidden', table: { category: 'Attributes' } },
    labelSize: { control: { type: 'select' }, options: ['xs', 'sm', 'base', 'lg'], name: 'label-size', table: { category: 'Layout' } },
    options: { control: 'object', name: 'options', table: { category: 'Data' } },
    placeholder: { control: 'text', name: 'placeholder', table: { category: 'Input Attributes' } },
    removeClearBtn: { control: 'boolean', name: 'remove-clear-btn', table: { category: 'Attributes' } },
    required: { control: 'boolean', name: 'required', table: { category: 'Validation' } },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], name: 'size', table: { category: 'Layout' } },
    type: { control: 'text', name: 'type', table: { category: 'Input Attributes' } },
    validation: { control: 'boolean', name: 'validation', table: { category: 'Validation' } },
    validationMessage: { control: 'text', name: 'validation-message', table: { category: 'Validation' } },
    value: { control: 'text', name: 'value', table: { category: 'Input Attributes' } },
  },

  args: {
    arialabelledBy: '',
    autoSort: true,
    clearIcon: 'fa-solid fa-xmark',
    devMode: false,
    disabled: false,
    error: false,
    errorMessage: '',
    formId: '',
    formLayout: '',
    id: 'plumageAcSingle',
    inputCol: 10,
    inputCols: '',
    inputId: 'plumageAcSingle',
    label: 'Autocomplete Single',
    labelAlign: '',
    labelCol: 2,
    labelCols: '',
    labelHidden: false,
    labelSize: 'sm',
    options: DEFAULT_OPTIONS,
    placeholder: 'Type to search/filter...',
    removeClearBtn: false,
    required: false,
    size: '',
    type: 'text',
    validation: false,
    validationMessage: 'Please fill in',
    value: '',
  },
};

export const Basic = {
  args: {
    id: 'plumageAcSingle_basic',
    inputId: 'plumageAcSingle_basic',
    value: '',
  },
};
Basic.name = 'Basic';
Basic.parameters = {
  docs: { description: { story: 'Default Plumage single-select autocomplete.' }, story: { height: '300px' } },
};

export const HorizontalLayout = {
  args: {
    id: 'plumageAcSingle_horizontal',
    inputId: 'plumageAcSingle_horizontal',
    formLayout: 'horizontal',
    labelAlign: 'right',
    labelCol: 4,
    inputCol: 8,
  },
};
HorizontalLayout.name = 'Horizontal Layout';

export const InlineLayout = {
  args: {
    id: 'plumageAcSingle_inline',
    inputId: 'plumageAcSingle_inline',
    formLayout: 'inline',
    size: 'sm',
  },
};
InlineLayout.name = 'Inline Layout';

export const Sizes = {
  render: (args, ctx) => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '14px';
    container.style.maxWidth = '760px';

    const suffix = nextMountSuffix(ctx);

    for (const v of SIZE_VARIANTS) {
      const el = document.createElement(TAG);

      setAttr(el, 'id', withUniqueId(v.id, suffix));
      setAttr(el, 'input-id', withUniqueId(v.inputId, suffix));
      setAttr(el, 'label', `${args.label || 'Autocomplete Single'} — ${v.label}`);
      setAttr(el, 'size', v.size);

      setAttr(el, 'auto-sort', args.autoSort);
      setAttr(el, 'arialabelled-by', args.arialabelledBy);
      setAttr(el, 'clear-icon', args.clearIcon);
      setAttr(el, 'form-layout', args.formLayout);
      setAttr(el, 'label-size', args.labelSize);
      setAttr(el, 'placeholder', args.placeholder);
      setAttr(el, 'type', args.type || 'text');
      setAttr(el, 'validation-message', args.validationMessage);

      args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
      args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
      args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
      args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
      args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');

      setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : DEFAULT_OPTIONS);
      setAutoSortWhenReady(el, args.autoSort);
      setValueWhenReady(el, args.value);

      container.appendChild(el);
    }

    return container;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) =>
          buildDocsHtmlMany(
            SIZE_VARIANTS.map((v) =>
              buildDocsComponentHtml({
                ...ctx.args,
                id: v.id,
                inputId: v.inputId,
                label: `${ctx.args.label || 'Autocomplete Single'} — ${v.label}`,
                size: v.size,
                options: undefined,
              }),
            ),
          ),
      },
    },
  },
};
Sizes.name = 'Sizes';

export const ControlledValue = {
  args: {
    id: 'plumageAcSingle_controlled',
    inputId: 'plumageAcSingle_controlled',
    value: 'Apple',
  },
  render: (args, ctx) => {
    const wrap = document.createElement('div');
    wrap.style.maxWidth = '680px';
    wrap.style.display = 'grid';
    wrap.style.gap = '10px';

    const suffix = nextMountSuffix(ctx);
    const el = document.createElement(TAG);

    setAttr(el, 'id', withUniqueId(args.id, suffix));
    setAttr(el, 'input-id', withUniqueId(args.inputId, suffix));
    setAttr(el, 'label', args.label);
    setAttr(el, 'placeholder', args.placeholder);
    setAttr(el, 'auto-sort', args.autoSort);
    setAttr(el, 'clear-icon', args.clearIcon);
    setAttr(el, 'type', args.type || 'text');

    setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : DEFAULT_OPTIONS);
    setAutoSortWhenReady(el, args.autoSort);
    setValueWhenReady(el, args.value);

    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '8px';
    buttons.style.flexWrap = 'wrap';

    const mkBtn = (label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-sm btn-secondary';
      b.textContent = label;
      return b;
    };

    const btnApple = mkBtn('Set "Apple"');
    const btnMango = mkBtn('Set "Mango"');
    const btnClear = mkBtn('Clear value');

    const applyValue = (next) => {
      const v = typeof next === 'string' ? next : '';
      setValueWhenReady(el, v);
      updateArgsBestEffort(ctx, { value: v });
    };

    btnApple.addEventListener('click', () => applyValue('Apple'));
    btnMango.addEventListener('click', () => applyValue('Mango'));
    btnClear.addEventListener('click', () => applyValue(''));

    el.addEventListener('itemSelect', (e) => applyValue(String(e?.detail ?? '')));
    el.addEventListener('clear', () => applyValue(''));

    buttons.appendChild(btnApple);
    buttons.appendChild(btnMango);
    buttons.appendChild(btnClear);

    wrap.appendChild(el);
    wrap.appendChild(buttons);
    return wrap;
  },
};
ControlledValue.name = 'Controlled Value (args.value)';

export const FieldValidation = {
  args: {
    id: 'plumageAcSingle_validation',
    inputId: 'plumageAcSingle_validation',
    validation: true,
    validationMessage: 'This field is required.',
    required: true,
  },
};
FieldValidation.name = 'Field Validation';

export const Disabled = {
  args: {
    id: 'plumageAcSingle_disabled',
    inputId: 'plumageAcSingle_disabled',
    disabled: true,
    value: 'Banana',
    placeholder: '',
    validationMessage: '',
  },
};
Disabled.name = 'Disabled';

export const AccessibilityMatrix = {
  name: 'Accessibility matrix',
  args: {
    options: DEFAULT_OPTIONS,
    value: '',
    autoSort: true,
    clearIcon: 'fa-solid fa-xmark',
    removeClearBtn: false,
    devMode: false,
    labelHidden: false,
    labelAlign: '',
    labelSize: 'sm',
    size: '',
    formId: '',
    type: 'text',
    arialabelledBy: '',
    placeholder: 'Type to search/filter...',
    validationMessage: 'Please fill in',
  },
  render: (args, ctx) => {
    const outer = document.createElement('div');

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(360px, 1fr))';
    grid.style.gap = '14px';
    grid.style.maxWidth = '1100px';
    outer.appendChild(grid);

    const suffix = nextMountSuffix(ctx);

    const variants = [
      { title: 'Default / normal', base: 'acs_a11y_default', inputBase: 'acs-a11y-default', label: 'Default', formLayout: '', disabled: false, error: false, errorMessage: '', required: false, validation: false, value: '' },
      { title: 'Default / validation', base: 'acs_a11y_default_validation', inputBase: 'acs-a11y-default-validation', label: 'Default + validation', formLayout: '', disabled: false, error: false, errorMessage: '', required: true, validation: true, value: '' },
      { title: 'Default / error', base: 'acs_a11y_default_error', inputBase: 'acs-a11y-default-error', label: 'Default + error', formLayout: '', disabled: false, error: true, errorMessage: 'Something went wrong.', required: false, validation: false, value: '' },
      { title: 'Default / disabled', base: 'acs_a11y_default_disabled', inputBase: 'acs-a11y-default-disabled', label: 'Default disabled', formLayout: '', disabled: true, error: false, errorMessage: '', required: false, validation: false, value: 'Apple' },

      { title: 'Inline / normal', base: 'acs_a11y_inline', inputBase: 'acs-a11y-inline', label: 'Inline', formLayout: 'inline', disabled: false, error: false, errorMessage: '', required: false, validation: false, value: '' },
      { title: 'Inline / validation', base: 'acs_a11y_inline_validation', inputBase: 'acs-a11y-inline-validation', label: 'Inline + validation', formLayout: 'inline', disabled: false, error: false, errorMessage: '', required: true, validation: true, value: '' },
      { title: 'Inline / error', base: 'acs_a11y_inline_error', inputBase: 'acs-a11y-inline-error', label: 'Inline + error', formLayout: 'inline', disabled: false, error: true, errorMessage: 'Something went wrong.', required: false, validation: false, value: '' },
      { title: 'Inline / disabled', base: 'acs_a11y_inline_disabled', inputBase: 'acs-a11y-inline-disabled', label: 'Inline disabled', formLayout: 'inline', disabled: true, error: false, errorMessage: '', required: false, validation: false, value: 'Banana' },

      { title: 'Horizontal / normal', base: 'acs_a11y_horizontal', inputBase: 'acs-a11y-horizontal', label: 'Horizontal', formLayout: 'horizontal', labelAlign: 'right', labelCol: 4, inputCol: 8, disabled: false, error: false, errorMessage: '', required: false, validation: false, value: '' },
      { title: 'Horizontal / validation', base: 'acs_a11y_horizontal_validation', inputBase: 'acs-a11y-horizontal-validation', label: 'Horizontal + validation', formLayout: 'horizontal', labelAlign: 'right', labelCol: 4, inputCol: 8, disabled: false, error: false, errorMessage: '', required: true, validation: true, value: '' },
      { title: 'Horizontal / error', base: 'acs_a11y_horizontal_error', inputBase: 'acs-a11y-horizontal-error', label: 'Horizontal + error', formLayout: 'horizontal', labelAlign: 'right', labelCol: 4, inputCol: 8, disabled: false, error: true, errorMessage: 'Something went wrong.', required: false, validation: false, value: '' },
      { title: 'Horizontal / disabled', base: 'acs_a11y_horizontal_disabled', inputBase: 'acs-a11y-horizontal-disabled', label: 'Horizontal disabled', formLayout: 'horizontal', labelAlign: 'right', labelCol: 4, inputCol: 8, disabled: true, error: false, errorMessage: '', required: false, validation: false, value: 'Mango' },
    ];

    for (const v of variants) {
      const cell = mkMatrixCellSingle(
        {
          ...args,
          ...v,
          id: withUniqueId(v.base, suffix),
          inputId: withUniqueId(v.inputBase, suffix),
        },
        {
          idOverride: withUniqueId(v.base, suffix),
          inputIdOverride: withUniqueId(v.inputBase, suffix),
          title: v.title,
        },
      );
      grid.appendChild(cell);
    }

    return outer;
  },
};
