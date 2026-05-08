export const TAG = 'plumage-input-field-component';

export const normalizeArg = (value) => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const DocsWrapStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .sbdocs pre,
    .sbdocs pre code {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-x: auto !important;
    }
  `;
  return style;
};

export const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${esc(String(v))}"`))
    .join('\n  ');

export const buildDocsHtml = (args) => {
  const a = { ...args };
  delete a.wrapWithForm;

  const attrs = [
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
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['label-cols', normalizeArg(a.labelCols)],
    ['input-cols', normalizeArg(a.inputCols)],
    ['validation-message', normalizeArg(a.validationMessage)],
    ['aria-label', normalizeArg(a.ariaLabel)],
    ['aria-labelledby', normalizeArg(a.ariaLabelledby)],
    ['aria-describedby', normalizeArg(a.ariaDescribedby)],
    ['arialabelled-by', normalizeArg(a.arialabelledBy)],
    ['label-hidden', !!a.labelHidden],
    ['disabled', !!a.disabled],
    ['read-only', !!a.readOnly],
    ['required', !!a.required],
    ['validation', !!a.validation],
  ];

  const openTag = `<${TAG}\n  ${attrLines(attrs)}\n></${TAG}>`;

  if (args.wrapWithForm) {
    const formAttrs = [
      ['form-id', normalizeArg(args.formId || 'demo-form')],
      ['form-layout', normalizeArg(args.formLayout)],
    ]
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => `${k}="${esc(String(v))}"`)
      .join(' ');

    const formOpen = formAttrs ? `<form-component ${formAttrs}>` : `<form-component form-id="${esc(args.formId || 'demo-form')}">`;
    const slotted = openTag.replace(`<${TAG}`, `<${TAG} slot="formField"`);

    return [formOpen, `  ${slotted.replace(/\n/g, '\n  ')}`, `</form-component>`].join('\n');
  }

  return openTag;
};

export const buildDocsHtmlSizes = () =>
  [
    '<div>',
    `  <${TAG} label="Default" input-id="size-default"></${TAG}>`,
    `  <${TAG} label="Small" input-id="size-sm" size="sm"></${TAG}>`,
    `  <${TAG} label="Large" input-id="size-lg" size="lg"></${TAG}>`,
    '</div>',
  ].join('\n');

export const buildDocsHtmlInlineLayout = () =>
  [
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

export const buildDocsHtmlReadOnlyAndDisabled = () => {
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

export const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export const cssEscapeIdent = (value) => String(value).replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^\`{|}~])/g, '\\$1');

export const makeInput = (args = {}) => {
  const el = document.createElement(TAG);

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

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);
  setAttr(el, 'arialabelled-by', args.arialabelledBy);

  el.addEventListener('valueChange', (e) => {
    console.log('[valueChange]', e.detail);
  });

  return el;
};

export const wrapInForm = (inputEl, { formLayout = '', formId = 'demo-form' } = {}) => {
  const form = document.createElement('form-component');
  form.setAttribute('style', 'display:block; padding:12px;');
  form.formLayout = formLayout || '';
  form.formId = formId;

  inputEl.setAttribute('slot', 'formField');
  form.appendChild(inputEl);
  return form;
};

export const renderComponent = (args) => {
  const input = makeInput(args);
  return args.wrapWithForm ? wrapInForm(input, { formLayout: args.formLayout, formId: args.formId || 'demo-form' }) : input;
};
