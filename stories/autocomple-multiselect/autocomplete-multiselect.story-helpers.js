// File: src/stories/autocomplete-multiselect/autocomplete-multiselect.story-helpers.js

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

export const buildDocsHtml = args =>
  normalize(`
<autocomplete-multiselect
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
></autocomplete-multiselect>
`);

export const buildDocsHtmlControlledValue = () =>
  wrapDocsHtml(
    normalize(`
<div style="max-width:760px; display:grid; gap:12px;">
  <div id="acm-controlled-state" style="opacity:.75;">
    External controlled value: ["Apple"]
  </div>

  <div style="display:flex; flex-wrap:wrap; gap:8px;">
    <button type="button" id="acm-set-apple-mango">Set: ["Apple","Mango"]</button>
    <button type="button" id="acm-add-banana">Add "Banana"</button>
    <button type="button" id="acm-clear">Clear []</button>
    <button type="button" id="acm-sanitize">Set: sanitization demo</button>
  </div>

  <autocomplete-multiselect
    id="acm_controlled"
    input-id="acm-controlled"
    label="Controlled Value"
  ></autocomplete-multiselect>

  <script>
    let controlledValue = ['Apple'];

    const host = document.querySelector('autocomplete-multiselect');
    const state = document.querySelector('#acm-controlled-state');

    const renderState = (source) => {
      state.textContent = 'External controlled value (' + source + '): ' + JSON.stringify(controlledValue);
    };

    const applyValue = (next, source) => {
      controlledValue = Array.isArray(next) ? next.slice() : [];
      host.value = controlledValue.slice();
      renderState(source);
    };

    document.querySelector('#acm-set-apple-mango').addEventListener('click', () => {
      applyValue(['Apple', 'Mango'], 'button click');
    });

    document.querySelector('#acm-add-banana').addEventListener('click', () => {
      const next = controlledValue.slice();
      if (!next.includes('Banana')) next.push('Banana');
      applyValue(next, 'button click');
    });

    document.querySelector('#acm-clear').addEventListener('click', () => {
      applyValue([], 'button click');
    });

    document.querySelector('#acm-sanitize').addEventListener('click', () => {
      applyValue(['  <b>Apple</b>  ', 'MANGO', 'mango', '\\u0007Bad\\u0000', ''], 'button click');
    });

    host.addEventListener('multiSelectChange', (e) => {
      const next = Array.isArray(e.detail) ? e.detail : Array.isArray(e.detail?.value) ? e.detail.value : [];
      applyValue(next, 'multiSelectChange event');
    });

    host.addEventListener('clear', () => {
      applyValue([], 'clear event');
    });

    applyValue(controlledValue, 'initial value');
  </script>
</div>
`),
  );

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
  await whenReady(el, 'autocomplete-multiselect');
  if (typeof el.setOptions === 'function') await el.setOptions(safe);
  else el.options = safe;
};

export const setValueWhenReady = async (el, value) => {
  const safe = Array.isArray(value) ? value.slice() : [];
  await whenReady(el, 'autocomplete-multiselect');
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

export const SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm', inputId: 'acm-sm', id: 'acm_sm' },
  { key: 'default', label: 'Default', size: '', inputId: 'acm-md', id: 'acm_md' },
  { key: 'lg', label: 'Large', size: 'lg', inputId: 'acm-lg', id: 'acm_lg' },
];

const __renderSeqByStory = Object.create(null);

const safeStoryKey = ctx => String(ctx?.id || 'story').replace(/[^a-z0-9_-]/gi, '_');

const nextMountSuffix = ctx => {
  const k = safeStoryKey(ctx);
  __renderSeqByStory[k] = (__renderSeqByStory[k] || 0) + 1;
  return `${k}_${__renderSeqByStory[k]}`;
};

const withUniqueId = (base, suffix) => {
  const b = String(base || '').trim() || 'acm';
  return `${b}__${suffix}`;
};

const getMountSuffix = ctx => {
  if (!ctx) return 'mount';
  if (!ctx.__acmMountSuffix) ctx.__acmMountSuffix = nextMountSuffix(ctx);
  if (!ctx.__acmLocalSeq) ctx.__acmLocalSeq = 0;
  return ctx.__acmMountSuffix;
};

const nextLocalSeq = ctx => {
  if (!ctx) return 1;
  ctx.__acmLocalSeq = (ctx.__acmLocalSeq || 0) + 1;
  return ctx.__acmLocalSeq;
};

export const renderComponent = (args, ctx) => {
  const el = document.createElement('autocomplete-multiselect');

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

  el.addEventListener('multiSelectChange', e => console.log('[acm] selectionChange', e.detail));
  el.addEventListener('valueChange', e => console.log('[acm] valueChange', e.detail));
  el.addEventListener('optionsChange', e => console.log('[acm] optionsChange', e.detail));
  el.addEventListener('optionDelete', e => console.log('[acm] optionDelete', e.detail));
  el.addEventListener('clear', () => console.log('[acm] clear'));

  const fallback = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];
  setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : fallback);
  setValueWhenReady(el, Array.isArray(args.value) ? args.value : []);

  return wrapEl(el);
};
