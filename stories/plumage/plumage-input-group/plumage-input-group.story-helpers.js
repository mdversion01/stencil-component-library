// File: src/stories/plumage-input-group.story-helpers.js

export const TAG = 'plumage-input-group-component';

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

const getStorySafeArgs = rawArgs => {
  const args = { ...rawArgs };

  if (args.prependButton) {
    args.prependIcon = '';
    if (!String(args.prependText ?? '').trim()) args.prependText = 'Go';
  }

  if (args.appendButton) {
    args.appendIcon = '';
    if (!String(args.appendText ?? '').trim()) args.appendText = 'Go';
  }

  return args;
};

export const buildDocsHtml = rawArgs => {
  const a = getStorySafeArgs(rawArgs);

  const attrs = [
    ['has-append', !!a.append],
    ['append-icon', normalize(a.appendIcon)],
    ['append-id', normalize(a.appendId)],
    ['append-button-id', normalize(a.appendButtonId)],
    ['append-text', normalize(a.appendText)],
    ['append-button', !!a.appendButton],
    ['append-button-type', normalize(a.appendButtonType)],
    ['append-button-variant', normalize(a.appendButtonVariant)],
    ['append-aria-label', normalize(a.appendAriaLabel)],

    ['disabled', !!a.disabled],
    ['read-only', !!a.readOnly],
    ['form-id', normalize(a.formId)],
    ['form-layout', normalize(a.formLayout)],
    ['icon', normalize(a.icon)],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['input-cols', normalize(a.inputCols)],
    ['input-id', normalize(a.inputId)],
    ['label', normalize(a.label)],
    ['label-align', normalize(a.labelAlign)],
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['label-cols', normalize(a.labelCols)],
    ['label-hidden', !!a.labelHidden],
    ['label-size', normalize(a.labelSize)],
    ['placeholder', normalize(a.placeholder)],
    ['plumage-search', !!a.plumageSearch],

    ['has-prepend', !!a.prepend],
    ['prepend-icon', normalize(a.prependIcon)],
    ['prepend-id', normalize(a.prependId)],
    ['prepend-button-id', normalize(a.prependButtonId)],
    ['prepend-text', normalize(a.prependText)],
    ['prepend-button', !!a.prependButton],
    ['prepend-button-type', normalize(a.prependButtonType)],
    ['prepend-button-variant', normalize(a.prependButtonVariant)],
    ['prepend-aria-label', normalize(a.prependAriaLabel)],

    ['required', !!a.required],
    ['size', normalize(a.size)],
    ['type', normalize(a.type)],
    ['aria-label', normalize(a.ariaLabel)],
    ['aria-labelledby', normalize(a.ariaLabelledby)],
    ['aria-describedby', normalize(a.ariaDescribedby)],
    ['validation', !!a.validation],
    ['validation-message', normalize(a.validationMessage)],
    ['value', normalize(a.value)],
  ];

  const attrStr = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  return attrStr ? `<${TAG} ${attrStr}></${TAG}>` : `<${TAG}></${TAG}>`;
};

export const boolAttr = (name, on) => (on ? ` ${name}` : '');

export const attr = (name, val) => {
  const v = normalize(val);
  return v === undefined || v === false ? '' : v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
};

export const renderComponent = rawArgs => {
  const args = getStorySafeArgs(rawArgs);

  return `
<${TAG}
${boolAttr('has-append', !!args.append)}
${attr('append-icon', args.appendIcon)}
${attr('append-id', args.appendId)}
${attr('append-button-id', args.appendButtonId)}
${attr('append-text', args.appendText)}
${boolAttr('append-button', !!args.appendButton)}
${attr('append-button-type', args.appendButtonType)}
${attr('append-button-variant', args.appendButtonVariant)}
${attr('append-aria-label', args.appendAriaLabel)}
${boolAttr('disabled', !!args.disabled)}
${boolAttr('read-only', !!args.readOnly)}
${attr('form-id', args.formId)}
${attr('form-layout', args.formLayout)}
${attr('icon', args.icon)}
${attr('input-col', args.inputCol)}
${attr('input-cols', args.inputCols)}
${attr('input-id', args.inputId)}
${attr('label', args.label)}
${attr('label-align', args.labelAlign)}
${attr('label-col', args.labelCol)}
${attr('label-cols', args.labelCols)}
${boolAttr('label-hidden', !!args.labelHidden)}
${attr('label-size', args.labelSize)}
${attr('placeholder', args.placeholder)}
${boolAttr('plumage-search', !!args.plumageSearch)}
${boolAttr('has-prepend', !!args.prepend)}
${attr('prepend-icon', args.prependIcon)}
${attr('prepend-id', args.prependId)}
${attr('prepend-button-id', args.prependButtonId)}
${attr('prepend-text', args.prependText)}
${boolAttr('prepend-button', !!args.prependButton)}
${attr('prepend-button-type', args.prependButtonType)}
${attr('prepend-button-variant', args.prependButtonVariant)}
${attr('prepend-aria-label', args.prependAriaLabel)}
${boolAttr('required', !!args.required)}
${attr('size', args.size)}
${attr('type', args.type)}
${attr('aria-label', args.ariaLabel)}
${attr('aria-labelledby', args.ariaLabelledby)}
${attr('aria-describedby', args.ariaDescribedby)}
${boolAttr('validation', !!args.validation)}
${attr('validation-message', args.validationMessage)}
${attr('value', args.value)}
>
</${TAG}>
`;
};

export const buildEl = rawArgs => {
  const args = getStorySafeArgs(rawArgs);
  const el = document.createElement(TAG);

  const setBool = (name, on) => {
    if (on) el.setAttribute(name, '');
    else el.removeAttribute(name);
  };

  const set = (name, v) => {
    const n = normalize(v);
    if (n === undefined || n === false) el.removeAttribute(name);
    else if (n === true) el.setAttribute(name, '');
    else el.setAttribute(name, String(n));
  };

  setBool('has-append', !!args.append);
  set('append-icon', args.appendIcon);
  set('append-id', args.appendId);
  set('append-button-id', args.appendButtonId);
  set('append-text', args.appendText);
  setBool('append-button', !!args.appendButton);
  set('append-button-type', args.appendButtonType);
  set('append-button-variant', args.appendButtonVariant);
  set('append-aria-label', args.appendAriaLabel);

  setBool('disabled', !!args.disabled);
  setBool('read-only', !!args.readOnly);
  set('form-id', args.formId);
  set('form-layout', args.formLayout);
  set('icon', args.icon);
  set('input-col', args.inputCol);
  set('input-cols', args.inputCols);
  set('input-id', args.inputId);
  set('label', args.label);
  set('label-align', args.labelAlign);
  set('label-col', args.labelCol);
  set('label-cols', args.labelCols);
  setBool('label-hidden', !!args.labelHidden);
  set('label-size', args.labelSize);
  set('placeholder', args.placeholder);
  setBool('plumage-search', !!args.plumageSearch);

  setBool('has-prepend', !!args.prepend);
  set('prepend-icon', args.prependIcon);
  set('prepend-id', args.prependId);
  set('prepend-button-id', args.prependButtonId);
  set('prepend-text', args.prependText);
  setBool('prepend-button', !!args.prependButton);
  set('prepend-button-type', args.prependButtonType);
  set('prepend-button-variant', args.prependButtonVariant);
  set('prepend-aria-label', args.prependAriaLabel);

  setBool('required', !!args.required);
  set('size', args.size);
  set('type', args.type);
  set('aria-label', args.ariaLabel);
  set('aria-labelledby', args.ariaLabelledby);
  set('aria-describedby', args.ariaDescribedby);
  setBool('validation', !!args.validation);
  set('validation-message', args.validationMessage);
  set('value', args.value);

  return el;
};

export const buildDocsHtmlValueProp = () =>
  `<${TAG} has-append append-icon="fa-solid fa-dollar-sign" label="Amount" input-id="amount-value" value="123.45" placeholder="Enter amount"></${TAG}>`;

export const buildDocsHtmlExternalValue = () =>
  [
    '<div>',
    '  <button type="button" id="load-123-45">Load 123.45</button>',
    '  <button type="button" id="load-999-99">Load 999.99</button>',
    '  <button type="button" id="load-empty">Clear</button>',
    '',
    `  <${TAG}`,
    '    has-append',
    '    append-icon="fa-solid fa-dollar-sign"',
    '    label="Amount"',
    '    input-id="amount-external"',
    '    placeholder="Enter amount"',
    `  ></${TAG}>`,
    '</div>',
    '',
    '<script>',
    `  const host = document.querySelector('${TAG}');`,
    "  document.querySelector('#load-123-45').addEventListener('click', () => {",
    "    host.value = '123.45';",
    '  });',
    "  document.querySelector('#load-999-99').addEventListener('click', () => {",
    "    host.value = '999.99';",
    '  });',
    "  document.querySelector('#load-empty').addEventListener('click', () => {",
    "    host.value = '';",
    '  });',
    '</script>',
  ].join('\n');

export const getSnapshot = host => {
  const input =
    host?.querySelector('input.form-control') ||
    host?.querySelector('input.search-bar') ||
    host?.querySelector('input');
  const label = host?.querySelector('label');
  const describedby = (input?.getAttribute('aria-describedby') || '').trim();
  const describedIds = describedby ? describedby.split(/\s+/).filter(Boolean) : [];

  const resolve = id => {
    if (!id) return false;
    return !!host?.querySelector(`#${id}`);
  };

  const nativeButtons = Array.from(host?.querySelectorAll('.prepend-btn button, .append-btn button') || []);

  return {
    host: host?.tagName?.toLowerCase() ?? null,
    inputId: input?.getAttribute('id') ?? null,
    labelId: label?.getAttribute('id') ?? null,
    labelFor: label?.getAttribute('for') ?? label?.getAttribute('htmlfor') ?? null,
    role: input?.getAttribute('role') ?? null,
    type: input?.getAttribute('type') ?? null,
    value: host?.value ?? null,
    readOnly: input?.readOnly ?? null,
    'aria-label': input?.getAttribute('aria-label') ?? null,
    'aria-labelledby': input?.getAttribute('aria-labelledby') ?? null,
    'aria-describedby': describedby || null,
    'aria-required': input?.getAttribute('aria-required') ?? input?.getAttribute('required') ?? null,
    'aria-invalid': input?.getAttribute('aria-invalid') ?? null,
    'aria-disabled': input?.getAttribute('aria-disabled') ?? input?.getAttribute('disabled') ?? null,
    'aria-readonly': input?.getAttribute('aria-readonly') ?? null,
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
    hasValidationMessage: !!host?.querySelector('.invalid-feedback'),
    prependElId: host?.querySelector('.prepend-btn, [id$="-prepend"]')?.getAttribute('id') ?? null,
    appendElId: host?.querySelector('.append-btn, [id$="-append"]')?.getAttribute('id') ?? null,
    affixButtons: nativeButtons.map(button => ({
      id: button.getAttribute('id') ?? null,
      type: button.getAttribute('type') ?? null,
      class: button.getAttribute('class') ?? null,
      text: (button.textContent || '').trim(),
      ariaLabel: button.getAttribute('aria-label') ?? null,
      disabled: button.hasAttribute('disabled'),
    })),
    isSearchVariant: !!host?.querySelector('input.search-bar'),
  };
};
