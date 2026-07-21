// File: src/stories/input-field-component/input-field-component.story-helpers.js

export const normalize = value => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

export const esc = s =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const buildDocsHtml = args => {
  const a = { ...args };

  delete a.wrapWithForm;

  const attrs = [
    ['label', normalize(a.label)],
    ['input-id', normalize(a.inputId)],
    ['type', normalize(a.type)],
    ['value', normalize(a.value)],
    ['placeholder', normalize(a.placeholder)],
    ['size', normalize(a.size)],
    ['label-size', normalize(a.labelSize)],
    ['label-align', normalize(a.labelAlign)],
    ['form-layout', normalize(a.formLayout)],
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['label-cols', normalize(a.labelCols)],
    ['input-cols', normalize(a.inputCols)],
    ['validation-message', normalize(a.validationMessage)],
    ['label-hidden', !!a.labelHidden],
    ['disabled', !!a.disabled],
    ['read-only', !!a.readOnly],
    ['required', !!a.required],
    ['validation', !!a.validation],
  ];

  const attrStr = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  const openTag = attrStr
    ? `<input-field-component ${attrStr}></input-field-component>`
    : '<input-field-component></input-field-component>';

  if (args.wrapWithForm) {
    const formAttrs = [['form-layout', normalize(args.formLayout)]]
      .filter(([_, v]) => v !== undefined && v !== false)
      .map(([k, v]) => `${k}="${esc(v)}"`)
      .join(' ');

    const formOpen = formAttrs
      ? `<form-component form-id="${esc(args.formId || 'demo-form')}" ${formAttrs}>`
      : `<form-component form-id="${esc(args.formId || 'demo-form')}">`;

    return [
      formOpen,
      `  ${openTag.replace('<input-field-component', '<input-field-component slot="formField"')}`,
      '</form-component>',
    ].join('\n');
  }

  return openTag;
};

export const buildDocsHtmlValueProp = () =>
  '<input-field-component label="First Name" input-id="first-name-value" value="Ada" placeholder="Enter your first name"></input-field-component>';

export const buildDocsHtmlExternalValue = () =>
  [
    '<div>',
    '  <button type="button" id="load-ada">Load Ada</button>',
    '  <button type="button" id="load-grace">Load Grace</button>',
    '  <button type="button" id="load-katherine">Load Katherine</button>',
    '  <button type="button" id="clear-value">Clear</button>',
    '',
    '  <input-field-component',
    '    label="First Name"',
    '    input-id="first-name-external"',
    '    placeholder="Enter your first name"',
    '  ></input-field-component>',
    '</div>',
    '',
    '<script>',
    "  const host = document.querySelector('input-field-component');",
    "  document.querySelector('#load-ada').addEventListener('click', () => {",
    "    host.value = 'Ada';",
    '  });',
    "  document.querySelector('#load-grace').addEventListener('click', () => {",
    "    host.value = 'Grace';",
    '  });',
    "  document.querySelector('#load-katherine').addEventListener('click', () => {",
    "    host.value = 'Katherine';",
    '  });',
    "  document.querySelector('#clear-value').addEventListener('click', () => {",
    "    host.value = '';",
    '  });',
    '</script>',
  ].join('\n');

export const buildDocsHtmlSizes = () =>
  [
    '<div>',
    '  <input-field-component label="Default" input-id="size-default"></input-field-component>',
    '  <input-field-component label="Small" input-id="size-sm" size="sm"></input-field-component>',
    '  <input-field-component label="Large" input-id="size-lg" size="lg"></input-field-component>',
    '</div>',
  ].join('\n');

export const buildDocsHtmlInlineLayout = () =>
  [
    '<form-component form-layout="inline">',
    '  <input-field-component',
    '    slot="formField"',
    '    label="City"',
    '    input-id="city"',
    '    form-layout="inline"',
    '    input-cols="col-12 md-6"',
    '  ></input-field-component>',
    '  <input-field-component',
    '    slot="formField"',
    '    label="State"',
    '    input-id="state"',
    '    form-layout="inline"',
    '    input-cols="col-12 md-6"',
    '  ></input-field-component>',
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

export const makeInput = (args = {}) => {
  const el = document.createElement('input-field-component');

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

  el.addEventListener('valueChange', e => {
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

export const template = args => {
  const input = makeInput(args);
  return args.wrapWithForm ? wrapInForm(input, { formLayout: args.formLayout, formId: args.formId }) : input;
};

export function pickAttrs(el, names) {
  const out = {};
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

export function splitIds(v) {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function resolveIdsWithin(host, ids) {
  const res = {};
  for (const id of ids) {
    const node = host.querySelector(`[id="${String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"]`);
    res[id] = !!node;
  }
  return res;
}

export function snapshotA11y(host) {
  const label = host.querySelector('label.form-control-label');
  const input = host.querySelector('input.form-control');
  const help = host.querySelector('[id$="__desc"]');
  const validation = host.querySelector('[id$="__validation"]');

  const describedByIds = input ? splitIds(input.getAttribute('aria-describedby')) : [];
  const labelledByIds = input ? splitIds(input.getAttribute('aria-labelledby')) : [];

  return {
    label: label
      ? {
          tag: label.tagName.toLowerCase(),
          id: label.getAttribute('id') || '',
          for: label.getAttribute('for') || '',
          class: label.className || '',
        }
      : null,
    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.getAttribute('id') || '',
          role: input.getAttribute('role') || '',
          class: input.className || '',
          value: input.value ?? '',
          ...pickAttrs(input, [
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
            'aria-invalid',
            'required',
            'readonly',
            'disabled',
            'type',
            'name',
            'placeholder',
            'form',
          ]),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledByIds),
            'aria-describedby': resolveIdsWithin(host, describedByIds),
          },
        }
      : null,
    helpText: help
      ? {
          id: help.getAttribute('id') || '',
          class: help.className || '',
        }
      : null,
    validation: validation
      ? {
          id: validation.getAttribute('id') || '',
          class: validation.className || '',
          ...pickAttrs(validation, ['aria-live', 'aria-atomic']),
        }
      : null,
  };
}

export function renderMatrixRow({ title, args, idSuffix, forceInvalid = false }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const el = makeInput({
    ...args,
    inputId: `ifc-matrix-${idSuffix}`,
  });

  const stage = document.createElement('div');
  stage.style.maxWidth = '560px';

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
    const snap = snapshotA11y(el);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (forceInvalid) {
        const input = el.querySelector('input.form-control');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('blur', { bubbles: true }));
        }
      }
      requestAnimationFrame(update);
    });
  });

  return wrap;
}
