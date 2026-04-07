// File: src/stories/autocomplete-single/autocomplete-single.story-helpers.js

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

export const normalize = (txt) => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

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

export const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

export const buildDocsHtml = (args) =>
  normalize(`
<autocomplete-single
  ${attrLines([
    ['id', args.id],
    ['input-id', args.inputId],
    ['label', args.label],
    ['placeholder', args.placeholder],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['arialabelled-by', args.arialabelledBy],

    ['form-id', args.formId],
    ['form-layout', args.formLayout],
    ['label-align', args.labelAlign],
    ['label-size', args.labelSize],
    ['size', args.size],

    ['label-col', args.labelCol],
    ['input-col', args.inputCol],

    ['label-cols', args.labelCols],
    ['input-cols', args.inputCols],

    ['required', args.required],
    ['validation', args.validation],
    ['validation-message', args.validationMessage],
    ['error', args.error],
    ['error-message', args.errorMessage],
    ['disabled', args.disabled],
    ['label-hidden', args.labelHidden],
    ['dev-mode', args.devMode],

    ['auto-sort', args.autoSort],
    ['remove-clear-btn', args.removeClearBtn],
    ['clear-icon', args.clearIcon],
    ['type', args.type],

    ['value', args.value],
  ])}
></autocomplete-single>
`);

export const wrapDocsHtml = (innerHtml) =>
  normalize(`
<div style="max-width:680px;">
  ${String(innerHtml).replace(/\n/g, '\n  ')}
</div>
`);

export const buildDocsHtmlMany = (snippets) =>
  wrapDocsHtml(
    normalize(`
<div style="display:grid; gap:14px;">
${snippets.map((s) => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`),
  );

export const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export const whenReady = async (el, tagName) => {
  if (typeof el?.componentOnReady === 'function') {
    await el.componentOnReady();
    return;
  }
  if (window.customElements?.whenDefined) {
    await customElements.whenDefined(tagName);
  }
};

export const setOptionsWhenReady = async (el, options) => {
  const safe = Array.isArray(options) ? options.slice() : [];
  await whenReady(el, 'autocomplete-single');
  el.options = safe;
};

export const setValueWhenReady = async (el, value) => {
  await whenReady(el, 'autocomplete-single');
  el.value = typeof value === 'string' ? value : '';
};

export const setAutoSortWhenReady = async (el, autoSort) => {
  await whenReady(el, 'autocomplete-single');
  el.autoSort = !!autoSort;
};

export const updateArgsBestEffort = (ctx, updatedArgs) => {
  if (typeof ctx?.updateArgs === 'function') {
    try {
      ctx.updateArgs(updatedArgs);
      return;
    } catch (_e) {}
  }

  try {
    const channel =
      window.__STORYBOOK_ADDONS_CHANNEL__ ||
      window.__STORYBOOK_PREVIEW__?.addons?.getChannel?.() ||
      window.__STORYBOOK_ADDONS?.getChannel?.();

    const storyId = ctx?.id;
    if (!channel || !storyId) return;

    channel.emit('updateStoryArgs', { storyId, updatedArgs });
    channel.emit('UPDATE_STORY_ARGS', { storyId, updatedArgs });
  } catch (_e) {}
};

export const DEFAULT_OPTIONS = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];

const __renderSeqByStory = Object.create(null);

const safeStoryKey = (ctx) => String(ctx?.id || 'story').replace(/[^a-z0-9_-]/gi, '_');

const nextMountSuffix = (ctx) => {
  const k = safeStoryKey(ctx);
  __renderSeqByStory[k] = (__renderSeqByStory[k] || 0) + 1;
  return `${k}_${__renderSeqByStory[k]}`;
};

const withUniqueId = (base, suffix) => {
  const b = String(base || '').trim() || 'acSingle';
  return `${b}__${suffix}`;
};

const getMountSuffix = (ctx) => {
  if (!ctx) return 'mount';
  if (!ctx.__acSingleMountSuffix) ctx.__acSingleMountSuffix = nextMountSuffix(ctx);
  if (!ctx.__acSingleLocalSeq) ctx.__acSingleLocalSeq = 0;
  return ctx.__acSingleMountSuffix;
};

const nextLocalSeq = (ctx) => {
  if (!ctx) return 1;
  ctx.__acSingleLocalSeq = (ctx.__acSingleLocalSeq || 0) + 1;
  return ctx.__acSingleLocalSeq;
};

export const SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm', inputId: 'acSingle_sm', id: 'acSingle_sm' },
  { key: 'default', label: 'Default', size: '', inputId: 'acSingle_md', id: 'acSingle_md' },
  { key: 'lg', label: 'Large', size: 'lg', inputId: 'acSingle_lg', id: 'acSingle_lg' },
];

export const renderComponent = (args, ctx) => {
  const el = document.createElement('autocomplete-single');

  const mountSuffix = getMountSuffix(ctx);
  const local = nextLocalSeq(ctx);
  const uniq = `${mountSuffix}_${local}`;

  const hostId = withUniqueId(args.id, uniq);
  const inputId = withUniqueId(args.inputId, uniq);

  setAttr(el, 'id', hostId);
  setAttr(el, 'input-id', inputId);
  setAttr(el, 'label', args.label);
  setAttr(el, 'placeholder', args.placeholder);
  setAttr(el, 'form-id', args.formId);
  setAttr(el, 'form-layout', args.formLayout);
  setAttr(el, 'label-align', args.labelAlign);
  setAttr(el, 'label-size', args.labelSize);
  setAttr(el, 'size', args.size);
  setAttr(el, 'type', args.type || 'text');

  setAttr(el, 'label-col', args.labelCol);
  setAttr(el, 'input-col', args.inputCol);
  setAttr(el, 'label-cols', args.labelCols);
  setAttr(el, 'input-cols', args.inputCols);

  setAttr(el, 'validation-message', args.validationMessage);
  setAttr(el, 'error-message', args.errorMessage);
  setAttr(el, 'clear-icon', args.clearIcon);

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  setAttr(el, 'arialabelled-by', args.arialabelledBy);

  args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
  args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
  args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
  args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
  args.labelHidden ? el.setAttribute('label-hidden', '') : el.removeAttribute('label-hidden');
  args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
  args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');

  setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : DEFAULT_OPTIONS);
  setAutoSortWhenReady(el, args.autoSort);
  setValueWhenReady(el, args.value);

  el.addEventListener('itemSelect', (e) => console.log('[autocomplete-single] itemSelect', e.detail));
  el.addEventListener('valueChange', (e) => console.log('[autocomplete-single] valueChange', e.detail));
  el.addEventListener('clear', () => console.log('[autocomplete-single] clear'));

  el.addEventListener('itemSelect', (e) => {
    const next = String(e?.detail ?? '');
    updateArgsBestEffort(ctx, { value: next });
  });

  el.addEventListener('clear', () => {
    updateArgsBestEffort(ctx, { value: '' });
  });

  return el;
};
