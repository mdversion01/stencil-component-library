// stories/plumage-autocomplete-single.stories.js

/* ------------------------------------------------------------------
 * Storybook: Plumage Autocomplete (Single)
 * Component tag: <plumage-autocomplete-single>
 * ------------------------------------------------------------------ */

const TAG = 'plumage-autocomplete-single';

// ======================================================
// Helpers (Docs formatting + HTML source generation)
// ======================================================

const DocsWrapStyles = () => {
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

const normalize = (txt) => {
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

const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

const buildDocsHtml = (args) =>
  normalize(`
  <plumage-autocomplete-single ${attrLines([
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
  ])}>
  </plumage-autocomplete-single>
`);

const wrapDocsHtml = (innerHtml) =>
  normalize(`
<div style="max-width:680px;">
  ${String(innerHtml).replace(/\n/g, '\n  ')}
</div>
`);

const buildDocsHtmlMany = (snippets) =>
  wrapDocsHtml(
    normalize(`
<div style="display:grid; gap:14px;">
${snippets.map((s) => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`),
  );

// ======================================================
// Runtime helpers
// ======================================================

const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const whenReady = async (el, tagName) => {
  if (typeof el?.componentOnReady === 'function') {
    await el.componentOnReady();
    return;
  }
  if (window.customElements?.whenDefined) {
    await customElements.whenDefined(tagName);
  }
};

const setOptionsWhenReady = async (el, options) => {
  const safe = Array.isArray(options) ? options.slice() : [];
  await whenReady(el, TAG);
  el.options = safe;
};

const setValueWhenReady = async (el, value) => {
  await whenReady(el, TAG);
  el.value = typeof value === 'string' ? value : '';
};

const setAutoSortWhenReady = async (el, autoSort) => {
  await whenReady(el, TAG);
  el.autoSort = !!autoSort;
};

const updateArgsBestEffort = (ctx, updatedArgs) => {
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

// ======================================================
// Data
// ======================================================

const DEFAULT_OPTIONS = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];

// ======================================================
// ✅ Unique per-mount ids (Docs can mount twice)
// ======================================================

const __renderSeqByStory = Object.create(null);

const safeStoryKey = (ctx) => String(ctx?.id || 'story').replace(/[^a-z0-9_-]/gi, '_');

const nextMountSuffix = (ctx) => {
  const k = safeStoryKey(ctx);
  __renderSeqByStory[k] = (__renderSeqByStory[k] || 0) + 1;
  return `${k}_${__renderSeqByStory[k]}`;
};

const withUniqueId = (base, suffix) => {
  const b = String(base || '').trim() || 'plumageAcSingle';
  return `${b}__${suffix}`;
};

// ======================================================
// ✅ Accessibility matrix helpers (no redeclare)
// ======================================================

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

const mkMatrixCellSingle = (args, { idOverride, inputIdOverride, title } = {}) => {
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
  setAttr(el, 'type', args.type || 'text');
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

// ======================================================
// Default export
// ======================================================

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
      description: {
        component:
          'A Plumage-styled single-select autocomplete with focus underline, keyboard navigation, validation, responsive layouts (stacked, horizontal, inline), and optional clear action.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsHtml(ctx.args)),
      },
    },
  },

  // ✅ critical: DO NOT update args on every keystroke (valueChange fires per input)
  // Only sync args on discrete actions: itemSelect + clear.
  render: (args, ctx) => {
    const el = document.createElement(TAG);
    const mountSuffix = nextMountSuffix(ctx);

    const hostId = withUniqueId(args.id || 'plumageAcSingle', mountSuffix);
    const inputId = withUniqueId(args.inputId || 'plumageAcSingle', mountSuffix);

    setAttr(el, 'arialabelled-by', args.arialabelledBy);
    setAttr(el, 'auto-sort', args.autoSort);
    setAttr(el, 'clear-icon', args.clearIcon);
    setAttr(el, 'error-message', args.errorMessage);
    setAttr(el, 'form-id', args.formId);
    setAttr(el, 'form-layout', args.formLayout);

    setAttr(el, 'id', hostId);
    setAttr(el, 'input-col', args.inputCol);
    setAttr(el, 'input-cols', args.inputCols);
    setAttr(el, 'input-id', inputId);

    setAttr(el, 'label', args.label);
    setAttr(el, 'label-align', args.labelAlign);
    setAttr(el, 'label-col', args.labelCol);
    setAttr(el, 'label-cols', args.labelCols);
    setAttr(el, 'label-hidden', args.labelHidden);
    setAttr(el, 'label-size', args.labelSize);
    setAttr(el, 'placeholder', args.placeholder);
    setAttr(el, 'size', args.size);
    setAttr(el, 'type', args.type || 'text');
    setAttr(el, 'validation-message', args.validationMessage);

    args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
    args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
    args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
    args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
    args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
    args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');

    setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : DEFAULT_OPTIONS);
    setAutoSortWhenReady(el, args.autoSort);
    setValueWhenReady(el, args.value);

    // logs
    el.addEventListener('itemSelect', (e) => console.log('[plumage-autocomplete-single] itemSelect', e.detail));
    el.addEventListener('valueChange', (e) => console.log('[plumage-autocomplete-single] valueChange', e.detail));
    el.addEventListener('clear', () => console.log('[plumage-autocomplete-single] clear'));

    // ✅ sync args ONLY for discrete actions (prevents flicker/mirroring)
    el.addEventListener('itemSelect', (e) => {
      const next = String(e?.detail ?? '');
      updateArgsBestEffort(ctx, { value: next });
    });
    el.addEventListener('clear', () => {
      updateArgsBestEffort(ctx, { value: '' });
    });

    return el;
  },

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

// ======================================================
// Stories (do not remove any)
// ======================================================

export const Basic = {
  args: {
    id: 'plumageAcSingle_basic',
    inputId: 'plumageAcSingle_basic',
    value: '',
  },
};
Basic.storyName = 'Basic';
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
HorizontalLayout.storyName = 'Horizontal Layout';

export const InlineLayout = {
  args: {
    id: 'plumageAcSingle_inline',
    inputId: 'plumageAcSingle_inline',
    formLayout: 'inline',
    size: 'sm',
  },
};
InlineLayout.storyName = 'Inline Layout';

// Sizes
const SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm', inputId: 'plumageAcSingle_sm', id: 'plumageAcSingle_sm' },
  { key: 'default', label: 'Default', size: '', inputId: 'plumageAcSingle_md', id: 'plumageAcSingle_md' },
  { key: 'lg', label: 'Large', size: 'lg', inputId: 'plumageAcSingle_lg', id: 'plumageAcSingle_lg' },
];

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
              buildDocsHtml({
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
Sizes.storyName = 'Sizes';

// Controlled Value (keeps the interactive buttons and arg syncing)
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

    // for controlled story, syncing on select/clear is enough
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
ControlledValue.storyName = 'Controlled Value (args.value)';

export const FieldValidation = {
  args: {
    id: 'plumageAcSingle_validation',
    inputId: 'plumageAcSingle_validation',
    validation: true,
    validationMessage: 'This field is required.',
    required: true,
  },
};
FieldValidation.storyName = 'Field Validation';

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
Disabled.storyName = 'Disabled';

// ✅ NEW: Accessibility matrix
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
