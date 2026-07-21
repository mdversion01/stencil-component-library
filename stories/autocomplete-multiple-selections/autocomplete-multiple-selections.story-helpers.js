// File: src/stories/autocomplete-multiple-selections/autocomplete-multiple-selections.story-helpers.js

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
  const lines = String(txt)
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

export const attrLines = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

export const buildDocsComponentHtml = args =>
  normalize(`
<autocomplete-multiple-selections
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
    ['read-only', args.readOnly],
    ['label-hidden', args.labelHidden],
    ['dev-mode', args.devMode],

    ['add-btn', args.addBtn],
    ['editable', args.editable],
    ['add-icon', args.addIcon],
    ['remove-clear-btn', args.removeClearBtn],
    ['remove-btn-border', args.removeBtnBorder],
    ['clear-icon', args.clearIcon],
    ['clear-input-on-blur-outside', args.clearInputOnBlurOutside],

    ['auto-sort', args.autoSort],
    ['add-new-on-enter', args.addNewOnEnter],
    ['preserve-input-on-select', args.preserveInputOnSelect],

    ['value', Array.isArray(args.value) ? JSON.stringify(args.value) : ''],

    ['name', args.name],
    ['raw-input-name', args.rawInputName],
    ['type', args.type],

    ['badge-variant', args.badgeVariant],
    ['badge-shape', args.badgeShape],
    ['badge-inline-styles', args.badgeInlineStyles],
  ])}
></autocomplete-multiple-selections>
`);

export const buildDocsHtmlControlledValue = () =>
  normalize(`
<div style="max-width:760px; display:grid; gap:12px;">
  <div id="acms-controlled-value-state" style="opacity:.75;">
    External controlled value: ["Apple"]
  </div>

  <div style="display:flex; flex-wrap:wrap; gap:8px;">
    <button type="button" id="acms-set-apple-mango">Set: ["Apple","Mango"]</button>
    <button type="button" id="acms-add-banana">Add "Banana"</button>
    <button type="button" id="acms-clear-all">Clear []</button>
  </div>

  <autocomplete-multiple-selections
    id="acms_controlled"
    input-id="acms-controlled"
    label="Controlled Value"
    value='["Apple"]'
  ></autocomplete-multiple-selections>

  <script>
    let controlledValue = ['Apple'];

    const host = document.querySelector('autocomplete-multiple-selections');
    const state = document.querySelector('#acms-controlled-value-state');

    const renderState = () => {
      state.textContent = 'External controlled value: ' + JSON.stringify(controlledValue);
    };

    const applyValue = next => {
      controlledValue = Array.isArray(next) ? next.slice() : [];
      host.value = controlledValue.slice();
      renderState();
    };

    document.querySelector('#acms-set-apple-mango').addEventListener('click', () => {
      applyValue(['Apple', 'Mango']);
    });

    document.querySelector('#acms-add-banana').addEventListener('click', () => {
      const cur = controlledValue.slice();
      if (!cur.includes('Banana')) cur.push('Banana');
      applyValue(cur);
    });

    document.querySelector('#acms-clear-all').addEventListener('click', () => {
      applyValue([]);
    });

    host.addEventListener('multiSelectChange', e => {
      const next = Array.isArray(e.detail) ? e.detail : Array.isArray(e.detail?.value) ? e.detail.value : [];
      applyValue(next);
    });

    host.addEventListener('clear', () => {
      applyValue([]);
    });

    renderState();
  </script>
</div>
`);

export const wrapDocsHtml = innerHtml =>
  normalize(`
<div style="max-width:680px;">
  ${String(innerHtml).replace(/\n/g, '\n  ')}
</div>
`);

export const buildDocsHtmlMany = snippets =>
  wrapDocsHtml(
    normalize(`
<div style="display:grid; gap:14px;">
${snippets.map(s => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`),
  );

export const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export const whenReady = async el => {
  if (typeof el.componentOnReady === 'function') {
    await el.componentOnReady();
    return;
  }
  if (window.customElements?.whenDefined) {
    await customElements.whenDefined('autocomplete-multiple-selections');
  }
};

export const setOptionsWhenReady = async (el, options) => {
  const safe = Array.isArray(options) ? options.slice() : [];
  await whenReady(el);
  el.options = safe;
};

export const setValueWhenReady = async (el, value) => {
  const safe = Array.isArray(value) ? value.slice() : [];
  await whenReady(el);
  el.value = safe;
};

export const wrapEl = childEl => {
  const wrap = document.createElement('div');
  wrap.style.maxWidth = '680px';
  wrap.appendChild(childEl);
  return wrap;
};

export const FRUIT = [
  'Apple',
  'Apparatus',
  'Apple Pie',
  'Applegate',
  'Banana',
  'Orange',
  'Mango',
  'Bet',
  'Betty',
  'Bobby',
  'Bob',
  'Bobby Brown',
  'Bobby Blue',
  'Bobby Green',
];

const __renderSeqByStory = Object.create(null);

const safeStoryKey = ctx => String(ctx?.id || 'story').replace(/[^a-z0-9_-]/gi, '_');

const nextMountSuffix = ctx => {
  const k = safeStoryKey(ctx);
  __renderSeqByStory[k] = (__renderSeqByStory[k] || 0) + 1;
  return `${k}_${__renderSeqByStory[k]}`;
};

const withUniqueId = (base, suffix) => {
  const b = String(base || '').trim() || 'acms';
  return `${b}__${suffix}`;
};

const getMountSuffix = ctx => {
  if (!ctx) return 'mount';
  if (!ctx.__acmsMountSuffix) ctx.__acmsMountSuffix = nextMountSuffix(ctx);
  if (!ctx.__acmsLocalSeq) ctx.__acmsLocalSeq = 0;
  return ctx.__acmsMountSuffix;
};

const nextLocalSeq = ctx => {
  if (!ctx) return 1;
  ctx.__acmsLocalSeq = (ctx.__acmsLocalSeq || 0) + 1;
  return ctx.__acmsLocalSeq;
};

export const renderComponent = (args, ctx) => {
  const el = document.createElement('autocomplete-multiple-selections');

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

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  setAttr(el, 'arialabelled-by', args.arialabelledBy);

  setAttr(el, 'label-col', args.labelCol);
  setAttr(el, 'input-col', args.inputCol);
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
  setAttr(el, 'type', args.type || 'text');
  setAttr(el, 'error-message', args.errorMessage);

  args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
  args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
  args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
  args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
  args.readOnly ? el.setAttribute('read-only', '') : el.removeAttribute('read-only');
  args.labelHidden ? el.setAttribute('label-hidden', '') : el.removeAttribute('label-hidden');
  args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
  args.addBtn ? el.setAttribute('add-btn', '') : el.removeAttribute('add-btn');
  args.editable ? el.setAttribute('editable', '') : el.removeAttribute('editable');
  args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');
  args.removeBtnBorder ? el.setAttribute('remove-btn-border', '') : el.removeAttribute('remove-btn-border');
  args.clearInputOnBlurOutside ? el.setAttribute('clear-input-on-blur-outside', '') : el.removeAttribute('clear-input-on-blur-outside');

  setAttr(el, 'auto-sort', args.autoSort);
  setAttr(el, 'add-new-on-enter', args.addNewOnEnter);
  setAttr(el, 'preserve-input-on-select', args.preserveInputOnSelect);

  el.addEventListener('multiSelectChange', e => console.log('[ams] selectionChange', e.detail));
  el.addEventListener('valueChange', e => console.log('[ams] valueChange', e.detail));
  el.addEventListener('optionDelete', e => console.log('[ams] optionDelete', e.detail));
  el.addEventListener('clear', () => console.log('[ams] clear'));

  const fallback = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];
  setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : fallback);
  setValueWhenReady(el, Array.isArray(args.value) ? args.value : []);

  return wrapEl(el);
};

export const SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm', inputId: 'acms-sm', id: 'acms_sm' },
  { key: 'default', label: 'Default', size: '', inputId: 'acms-md', id: 'acms_md' },
  { key: 'lg', label: 'Large', size: 'lg', inputId: 'acms-lg', id: 'acms_lg' },
];
