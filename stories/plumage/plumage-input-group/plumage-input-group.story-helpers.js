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

export const buildDocsHtml = args => {
  const a = { ...args };

  const attrs = [
    ['append', !!a.append],
    ['append-icon', normalize(a.appendIcon)],
    ['append-id', normalize(a.appendId)],
    ['disabled', !!a.disabled],
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
    ['other-content', !!a.otherContent],
    ['placeholder', normalize(a.placeholder)],
    ['plumage-search', !!a.plumageSearch],
    ['prepend', !!a.prepend],
    ['prepend-icon', normalize(a.prependIcon)],
    ['prepend-id', normalize(a.prependId)],
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

  const openTag = attrStr ? `<${TAG} ${attrStr}>` : `<${TAG}>`;

  const slotLines = [];
  if (a.otherContent && a.prepend) {
    slotLines.push(`  <button-component slot="prepend" type="button" variant="secondary">Go</button-component>`);
  }
  if (a.otherContent && a.append) {
    slotLines.push(`  <button-component slot="append" type="button" variant="secondary">Go</button-component>`);
  }

  return [openTag, ...slotLines, `</${TAG}>`].join('\n');
};

export const boolAttr = (name, on) => (on ? ` ${name}` : '');

export const attr = (name, val) => {
  const v = normalize(val);
  return v === undefined || v === false ? '' : v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
};

export const renderComponent = args => {
  const usePrependSlot = !!args.otherContent && !!args.prepend;
  const useAppendSlot = !!args.otherContent && !!args.append;

  return `
<${TAG}
${boolAttr('append', !!args.append)}
${useAppendSlot ? '' : attr('append-icon', args.appendIcon)}
${attr('append-id', args.appendId)}
${boolAttr('disabled', !!args.disabled)}
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
${boolAttr('other-content', !!args.otherContent)}
${attr('placeholder', args.placeholder)}
${boolAttr('plumage-search', !!args.plumageSearch)}
${boolAttr('prepend', !!args.prepend)}
${usePrependSlot ? '' : attr('prepend-icon', args.prependIcon)}
${attr('prepend-id', args.prependId)}
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
${usePrependSlot ? `<button-component slot="prepend" type="button" text styles="margin-right: 10px;" variant="secondary">Go</button-component>` : ''}
${useAppendSlot ? `<button-component slot="append" type="button" text styles="margin-left: 10px;" variant="secondary">Go</button-component>` : ''}
</${TAG}>
`;
};

export const getSnapshot = host => {
  const input = host?.querySelector('input.form-control') || host?.querySelector('input.search-bar') || host?.querySelector('input');
  const label = host?.querySelector('label');
  const describedby = (input?.getAttribute('aria-describedby') || '').trim();
  const describedIds = describedby ? describedby.split(/\s+/).filter(Boolean) : [];

  const resolve = id => {
    if (!id) return false;
    return !!host?.querySelector(`#${id}`);
  };

  return {
    host: host?.tagName?.toLowerCase() ?? null,
    inputId: input?.getAttribute('id') ?? null,
    labelId: label?.getAttribute('id') ?? null,
    labelFor: label?.getAttribute('for') ?? label?.getAttribute('htmlfor') ?? null,
    role: input?.getAttribute('role') ?? null,
    type: input?.getAttribute('type') ?? null,
    'aria-label': input?.getAttribute('aria-label') ?? null,
    'aria-labelledby': input?.getAttribute('aria-labelledby') ?? null,
    'aria-describedby': describedby || null,
    'aria-required': input?.getAttribute('aria-required') ?? null,
    'aria-invalid': input?.getAttribute('aria-invalid') ?? null,
    'aria-disabled': input?.getAttribute('aria-disabled') ?? null,
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
    hasValidationMessage: !!host?.querySelector('.invalid-feedback'),
    prependElId: host?.querySelector('[id$="-prepend"]')?.getAttribute('id') ?? null,
    appendElId: host?.querySelector('[id$="-append"]')?.getAttribute('id') ?? null,
    isSearchVariant: !!host?.querySelector('input.search-bar'),
  };
};
