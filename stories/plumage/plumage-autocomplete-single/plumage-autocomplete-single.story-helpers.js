export const TAG = 'plumage-autocomplete-single';

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

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

export const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

export const buildDocsComponentHtml = (args) =>
  normalize(`
<plumage-autocomplete-single
  ${attrLines([
    ['arialabelled-by', args.arialabelledBy],
    ['auto-sort', args.autoSort],
    ['clear-icon', args.clearIcon],
    ['dev-mode', args.devMode],
    ['disabled', args.disabled],
    ['error', args.error],
    ['error-message', args.errorMessage],
    ['form-id', args.formId],
    ['form-layout', args.formLayout],
    ['id', args.id],
    ['input-col', args.inputCol],
    ['input-cols', args.inputCols],
    ['input-id', args.inputId],
    ['label', args.label],
    ['label-align', args.labelAlign],
    ['label-col', args.labelCol],
    ['label-cols', args.labelCols],
    ['label-hidden', args.labelHidden],
    ['label-size', args.labelSize],
    ['placeholder', args.placeholder],
    ['remove-clear-btn', args.removeClearBtn],
    ['required', args.required],
    ['size', args.size],
    ['type', args.type],
    ['validation', args.validation],
    ['validation-message', args.validationMessage],
    ['value', args.value],
  ])}
></plumage-autocomplete-single>
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

export const whenReady = async (el, tagName = TAG) => {
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
  await whenReady(el, TAG);
  el.options = safe;
};

export const setValueWhenReady = async (el, value) => {
  await whenReady(el, TAG);
  el.value = typeof value === 'string' ? value : '';
};

export const setAutoSortWhenReady = async (el, autoSort) => {
  await whenReady(el, TAG);
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

export const nextMountSuffix = (ctx) => {
  const k = safeStoryKey(ctx);
  __renderSeqByStory[k] = (__renderSeqByStory[k] || 0) + 1;
  return `${k}_${__renderSeqByStory[k]}`;
};

export const withUniqueId = (base, suffix) => {
  const b = String(base || '').trim() || 'plumageAcSingle';
  return `${b}__${suffix}`;
};

export const SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm', inputId: 'plumageAcSingle_sm', id: 'plumageAcSingle_sm' },
  { key: 'default', label: 'Default', size: '', inputId: 'plumageAcSingle_md', id: 'plumageAcSingle_md' },
  { key: 'lg', label: 'Large', size: 'lg', inputId: 'plumageAcSingle_lg', id: 'plumageAcSingle_lg' },
];

export const renderComponent = (args, ctx, overrides = {}) => {
  const el = document.createElement(TAG);
  const mountSuffix = nextMountSuffix(ctx);

  const hostId = withUniqueId(overrides.id || args.id || 'plumageAcSingle', mountSuffix);
  const inputId = withUniqueId(overrides.inputId || args.inputId || 'plumageAcSingle', mountSuffix);

  setAttr(el, 'arialabelled-by', overrides.arialabelledBy ?? args.arialabelledBy);
  setAttr(el, 'auto-sort', overrides.autoSort ?? args.autoSort);
  setAttr(el, 'clear-icon', overrides.clearIcon ?? args.clearIcon);
  setAttr(el, 'dev-mode', overrides.devMode ?? args.devMode);
  setAttr(el, 'error-message', overrides.errorMessage ?? args.errorMessage);
  setAttr(el, 'form-id', overrides.formId ?? args.formId);
  setAttr(el, 'form-layout', overrides.formLayout ?? args.formLayout);
  setAttr(el, 'id', hostId);
  setAttr(el, 'input-col', overrides.inputCol ?? args.inputCol);
  setAttr(el, 'input-cols', overrides.inputCols ?? args.inputCols);
  setAttr(el, 'input-id', inputId);
  setAttr(el, 'label', overrides.label ?? args.label);
  setAttr(el, 'label-align', overrides.labelAlign ?? args.labelAlign);
  setAttr(el, 'label-col', overrides.labelCol ?? args.labelCol);
  setAttr(el, 'label-cols', overrides.labelCols ?? args.labelCols);
  setAttr(el, 'label-hidden', overrides.labelHidden ?? args.labelHidden);
  setAttr(el, 'label-size', overrides.labelSize ?? args.labelSize);
  setAttr(el, 'placeholder', overrides.placeholder ?? args.placeholder);
  setAttr(el, 'size', overrides.size ?? args.size);
  setAttr(el, 'type', (overrides.type ?? args.type) || 'text');
  setAttr(el, 'validation-message', overrides.validationMessage ?? args.validationMessage);

  (overrides.required ?? args.required) ? el.setAttribute('required', '') : el.removeAttribute('required');
  (overrides.validation ?? args.validation) ? el.setAttribute('validation', '') : el.removeAttribute('validation');
  (overrides.error ?? args.error) ? el.setAttribute('error', '') : el.removeAttribute('error');
  (overrides.disabled ?? args.disabled) ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
  (overrides.devMode ?? args.devMode) ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
  (overrides.removeClearBtn ?? args.removeClearBtn) ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');

  setOptionsWhenReady(
    el,
    Array.isArray(overrides.options ?? args.options) && (overrides.options ?? args.options).length
      ? (overrides.options ?? args.options)
      : DEFAULT_OPTIONS,
  );
  setAutoSortWhenReady(el, overrides.autoSort ?? args.autoSort);
  setValueWhenReady(el, overrides.value ?? args.value);

  el.addEventListener('itemSelect', (e) => console.log('[plumage-autocomplete-single] itemSelect', e.detail));
  el.addEventListener('valueChange', (e) => console.log('[plumage-autocomplete-single] valueChange', e.detail));
  el.addEventListener('clear', () => console.log('[plumage-autocomplete-single] clear'));

  return el;
};

const escapeHtmlA11ySingle = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const readA11ySnapshotSingle = (hostEl) => {
  const input = hostEl?.querySelector?.('input') || null;

  const keys = [
    'role',
    'id',
    'type',
    'placeholder',
    'aria-autocomplete',
    'aria-expanded',
    'aria-controls',
    'aria-activedescendant',
    'aria-haspopup',
    'aria-required',
    'aria-invalid',
    'aria-disabled',
    'aria-describedby',
    'aria-labelledby',
    'aria-label',
  ];

  const inputAttrs = {};
  for (const k of keys) inputAttrs[k] = input ? input.getAttribute(k) : null;

  const listboxId = inputAttrs['aria-controls'] || null;
  const listbox = listboxId ? hostEl.querySelector(`#${listboxId}`) : null;

  const listboxAttrs = {};
  if (listbox) {
    for (const k of ['id', 'role']) listboxAttrs[k] = listbox.getAttribute(k);
  }

  const live = input?.id ? hostEl.querySelector(`#${input.id}-live`) : hostEl.querySelector('.sr-only[aria-live]');
  const messages = hostEl.querySelectorAll('[role="alert"], .invalid-feedback, .error-message');
  const msgTexts = Array.from(messages)
    .map((n) => (n.textContent || '').trim())
    .filter(Boolean);

  return {
    ids: {
      inputId: input?.id || null,
      listboxId,
      liveId: live?.getAttribute?.('id') || null,
    },
    input: inputAttrs,
    listbox: listboxAttrs,
    liveRegion: live
      ? {
          id: live.getAttribute('id'),
          'aria-live': live.getAttribute('aria-live'),
          'aria-atomic': live.getAttribute('aria-atomic'),
          text: (live.textContent || '').trim(),
        }
      : null,
    messages: msgTexts,
  };
};

export const mkMatrixCellSingle = (args, { idOverride, inputIdOverride, title } = {}) => {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '10px';
  wrap.style.padding = '12px';
  wrap.style.background = 'white';

  const head = document.createElement('div');
  head.style.fontWeight = '700';
  head.style.marginBottom = '8px';
  head.textContent = title || 'Variant';

  const el = document.createElement(TAG);

  setAttr(el, 'arialabelled-by', args.arialabelledBy);
  setAttr(el, 'auto-sort', args.autoSort);
  setAttr(el, 'clear-icon', args.clearIcon);
  setAttr(el, 'error-message', args.errorMessage);
  setAttr(el, 'form-id', args.formId);
  setAttr(el, 'form-layout', args.formLayout);
  setAttr(el, 'id', idOverride || args.id);
  setAttr(el, 'input-col', args.inputCol);
  setAttr(el, 'input-cols', args.inputCols);
  setAttr(el, 'input-id', inputIdOverride || args.inputId);
  setAttr(el, 'label', args.label);
  setAttr(el, 'label-align', args.labelAlign);
  setAttr(el, 'label-col', args.labelCol);
  setAttr(el, 'label-cols', args.labelCols);
  setAttr(el, 'label-size', args.labelSize);
  setAttr(el, 'placeholder', args.placeholder);
  setAttr(el, 'size', args.size);
  setAttr(el, 'type', (args.type) || 'text');
  setAttr(el, 'validation-message', args.validationMessage);

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

  const status = document.createElement('div');
  status.style.fontSize = '12px';
  status.style.color = '#666';
  status.style.marginTop = '8px';
  status.textContent = 'Computing ARIA snapshot…';

  const pre = document.createElement('pre');
  pre.style.marginTop = '10px';
  pre.style.background = '#f8f9fa';
  pre.style.borderRadius = '8px';
  pre.style.padding = '10px';
  pre.style.fontSize = '12px';
  pre.style.lineHeight = '1.35';
  pre.style.whiteSpace = 'pre-wrap';

  wrap.appendChild(head);
  wrap.appendChild(el);
  wrap.appendChild(status);
  wrap.appendChild(pre);

  whenReady(el, TAG)
    .then(() => {
      if (args.required && typeof el.validate === 'function') {
        try {
          el.validate();
        } catch (_) {}
      }
      return new Promise((r) => setTimeout(r, 0));
    })
    .then(() => {
      const snap = readA11ySnapshotSingle(el);
      pre.innerHTML = escapeHtmlA11ySingle(JSON.stringify(snap, null, 2));
      status.textContent = 'Snapshot ready.';
    })
    .catch((err) => {
      status.textContent = 'Snapshot error.';
      pre.innerHTML = escapeHtmlA11ySingle(String(err?.stack || err));
    });

  return wrap;
};
