// src/stories/plumage-select-field.story-helpers.js
export const TAG = 'plumage-select-field-component';

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

export const normalize = txt => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      prevBlank = true;
      out.push('');
      continue;
    }
    prevBlank = false;
    out.push(line);
  }

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const normalizeAttrValue = value => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

export const serializeOptions = opts => {
  if (!opts) return '';
  if (typeof opts === 'string') return opts;
  try {
    return JSON.stringify(opts);
  } catch {
    return '[]';
  }
};

export const buildDocsHtml = args => {
  const a = { ...args };
  const valueAttr = !a.multiple ? normalizeAttrValue(a.value) : undefined;

  const attrs = [
    ['aria-label', normalizeAttrValue(a.ariaLabel)],
    ['aria-labelledby', normalizeAttrValue(a.ariaLabelledby)],
    ['aria-describedby', normalizeAttrValue(a.ariaDescribedby)],

    ['classes', normalizeAttrValue(a.classes)],
    ['form-id', normalizeAttrValue(a.formId)],
    ['form-layout', normalizeAttrValue(a.formLayout)],
    ['input-col', normalizeAttrValue(a.inputCol)],
    ['input-cols', normalizeAttrValue(a.inputCols)],
    ['label', normalizeAttrValue(a.label)],
    ['label-align', normalizeAttrValue(a.labelAlign)],
    ['label-col', normalizeAttrValue(a.labelCol)],
    ['label-cols', normalizeAttrValue(a.labelCols)],
    ['label-size', normalizeAttrValue(a.labelSize)],
    ['size', normalizeAttrValue(a.size)],

    ['default-option-txt', normalizeAttrValue(a.defaultOptionTxt)],
    ['field-height', normalizeAttrValue(a.fieldHeight)],
    ['select-field-id', normalizeAttrValue(a.selectFieldId)],
    ['value', valueAttr],

    ['options', normalizeAttrValue(serializeOptions(a.options))],

    ['validation-message', normalizeAttrValue(a.validationMessage)],

    ['custom', !!a.custom],
    ['disabled', !!a.disabled],
    ['read-only', !!a.readOnly],
    ['label-hidden', !!a.labelHidden],
    ['multiple', !!a.multiple],
    ['required', !!a.required],
    ['validation', !!a.validation],
    ['with-table', !!a.withTable],
  ];

  const attrLines = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? `  ${k}` : `  ${k}="${esc(v)}"`))
    .join('\n');

  const open = attrLines ? `<${TAG}\n${attrLines}\n></${TAG}>` : `<${TAG}></${TAG}>`;

  return normalize(open);
};

export const boolAttr = (name, on) => (on ? ` ${name}` : '');

export const attr = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

export const attrAllowEmpty = (name, v) => {
  if (v === undefined || v === null) return '';
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

export const serializeOptionsForAttr = opts => {
  if (!opts) return '';
  if (typeof opts === 'string') return opts;
  try {
    return JSON.stringify(opts);
  } catch {
    return '[]';
  }
};

export const renderComponent = args => `
<${TAG}
  ${attr('label', args.label)}
  ${attr('label-size', args.labelSize)}
  ${attr('label-align', args.labelAlign)}
  ${boolAttr('label-hidden', args.labelHidden)}

  ${attr('aria-label', args.ariaLabel)}
  ${attr('aria-labelledby', args.ariaLabelledby)}
  ${attr('aria-describedby', args.ariaDescribedby)}

  ${attr('size', args.size)}
  ${boolAttr('custom', args.custom)}
  ${attr('classes', args.classes)}

  ${boolAttr('multiple', args.multiple)}
  ${boolAttr('required', args.required)}
  ${boolAttr('disabled', args.disabled)}
  ${boolAttr('read-only', args.readOnly)}

  ${boolAttr('validation', args.validation)}
  ${attr('validation-message', args.validationMessage)}

  ${attr('default-option-txt', args.defaultOptionTxt)}
  ${!args.multiple ? attrAllowEmpty('value', args.value ?? '') : ''}

  ${attr('options', serializeOptionsForAttr(args.options))}

  ${attr('form-id', args.formId)}
  ${attr('form-layout', args.formLayout)}
  ${attr('select-field-id', args.selectFieldId)}

  ${args.fieldHeight != null && args.fieldHeight !== '' ? attr('field-height', args.fieldHeight) : ''}

  ${attr('label-col', args.labelCol)}
  ${attr('input-col', args.inputCol)}
  ${attr('label-cols', args.labelCols)}
  ${attr('input-cols', args.inputCols)}

  ${boolAttr('with-table', args.withTable)}
></${TAG}>
`;

export const SIZE_VARIANTS = [
  { key: 'sm', labelSize: 'xs', size: 'sm', selectFieldId: 'fruit-size-sm', label: 'Small field with x-small label' },
  { key: 'default', labelSize: 'sm', size: '', selectFieldId: 'fruit-size-default', label: 'Default field with sm label' },
  { key: 'lg', labelSize: 'lg', size: 'lg', selectFieldId: 'fruit-size-lg', label: 'Large field with lg label' },
];

export const buildDocsHtmlExternalValue = () =>
  normalize(`
    <div>
      <button type="button" id="load-banana">Load Banana</button>
      <button type="button" id="load-cherry">Load Cherry</button>

      <plumage-select-field-component
        label="Fruits"
        label-size="sm"
        default-option-txt="Select a fruit"
        select-field-id="plumage-fruit-external-value"
        options='[
          { "value": "apple", "name": "Apple" },
          { "value": "banana", "name": "Banana" },
          { "value": "cherry", "name": "Cherry" }
        ]'
      ></plumage-select-field-component>
    </div>

    <script>
      const host = document.querySelector('plumage-select-field-component');
      document.querySelector('#load-banana').addEventListener('click', () => {
        host.value = 'banana';
      });
      document.querySelector('#load-cherry').addEventListener('click', () => {
        host.value = 'cherry';
      });
    </script>
  `);

export const buildDocsHtmlExternalMultiValue = () =>
  normalize(`
    <div>
      <button type="button" id="load-ux-web">Load UX + Web</button>
      <button type="button" id="load-mobile-data">Load Mobile + Data</button>
      <button type="button" id="load-all">Load All</button>
      <button type="button" id="load-empty-default">Load Empty Default</button>
      <button type="button" id="clear-tags">Clear</button>

      <plumage-select-field-component
        label="Tags"
        label-size="sm"
        multiple
        field-height="6"
        default-option-txt="Choose tags"
        select-field-id="plumage-tags-external-value"
        options='[
          { "value": "ux", "name": "UX" },
          { "value": "web", "name": "Web" },
          { "value": "mobile", "name": "Mobile" },
          { "value": "data", "name": "Data" }
        ]'
      ></plumage-select-field-component>
    </div>

    <script>
      const host = document.querySelector('plumage-select-field-component');
      document.querySelector('#load-ux-web').addEventListener('click', () => {
        host.value = ['ux', 'web'];
      });
      document.querySelector('#load-mobile-data').addEventListener('click', () => {
        host.value = ['mobile', 'data'];
      });
      document.querySelector('#load-all').addEventListener('click', () => {
        host.value = ['ux', 'web', 'mobile', 'data'];
      });
      document.querySelector('#load-empty-default').addEventListener('click', () => {
        host.value = [''];
      });
      document.querySelector('#clear-tags').addEventListener('click', () => {
        host.value = [];
      });
    </script>
  `);

export const getSnapshot = host => {
  const select = host?.querySelector('select');
  const label = host?.querySelector('label');
  const describedby = (select?.getAttribute('aria-describedby') || '').trim();
  const describedIds = describedby ? describedby.split(/\s+/).filter(Boolean) : [];

  const resolve = id => {
    if (!id) return false;
    return !!host?.querySelector(`#${id}`);
  };

  const labelledby = (select?.getAttribute('aria-labelledby') || '').trim();
  const labelledIds = labelledby ? labelledby.split(/\s+/).filter(Boolean) : [];

  return {
    host: host?.tagName?.toLowerCase() ?? null,
    selectId: select?.getAttribute('id') ?? null,
    labelId: label?.getAttribute('id') ?? null,
    labelFor: label?.getAttribute('for') ?? label?.getAttribute('htmlfor') ?? null,
    role: select?.getAttribute('role') ?? null,
    sizeAttr: select?.getAttribute('size') ?? null,
    multiple: select?.hasAttribute('multiple') ?? false,
    disabled: select?.hasAttribute('disabled') ?? false,
    required: select?.hasAttribute('required') ?? false,
    value: host?.value ?? null,
    'aria-label': select?.getAttribute('aria-label') ?? null,
    'aria-labelledby': labelledby || null,
    'aria-describedby': describedby || null,
    'aria-required': select?.getAttribute('aria-required') ?? null,
    'aria-invalid': select?.getAttribute('aria-invalid') ?? null,
    'aria-disabled': select?.getAttribute('aria-disabled') ?? null,
    'aria-readonly': select?.getAttribute('aria-readonly') ?? null,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolve),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
    hasValidationMessage: !!host?.querySelector('.invalid-feedback'),
    validationId: host?.querySelector('.invalid-feedback')?.getAttribute('id') ?? null,
  };
};
