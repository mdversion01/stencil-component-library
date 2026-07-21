// File: stories/plumage/plumage-autocomplete-multiple-selections/plumage-autocomplete-multiple-selections.story-helpers.js

export const TAG = 'plumage-autocomplete-multiple-selections-component';

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
  const lines = String(txt ?? '')
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

export const wrapDocsHtml = (innerHtml) =>
  normalize(`
<div style="max-width:680px;">
  ${String(innerHtml).replace(/\n/g, '\n  ')}
</div>
`);

export const buildDocsComponentHtml = (args) =>
  normalize(`
<${TAG}
  ${attrLines([
    ['id', args.id],
    ['input-id', args.inputId],
    ['label', args.label],
    ['placeholder', args.placeholder],

    ['value', Array.isArray(args.value) ? JSON.stringify(args.value) : args.value],

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
    ['clear-icon', args.clearIcon],
    ['clear-input-on-blur-outside', args.clearInputOnBlurOutside],

    ['auto-sort', args.autoSort],
    ['add-new-on-enter', args.addNewOnEnter],
    ['preserve-input-on-select', args.preserveInputOnSelect],

    ['badge-variant', args.badgeVariant],
    ['badge-shape', args.badgeShape],
    ['badge-inline-styles', args.badgeInlineStyles],

    ['name', args.name],
    ['raw-input-name', args.rawInputName],

    ['type', args.type],
    ['form-id', args.formId],
    ['arialabelled-by', args.arialabelledBy],
  ])}
></${TAG}>
`);

export const buildDocsHtmlControlledValue = () =>
  wrapDocsHtml(
    normalize(`
<div style="max-width:760px; display:grid; gap:12px;">
  <div id="plumage-ams-controlled-state" style="opacity:.75;">
    External controlled value: ["Apple","Mango"]
  </div>

  <div style="display:flex; flex-wrap:wrap; gap:8px;">
    <button type="button" id="plumage-ams-set-apple-mango">Set: Apple + Mango</button>
    <button type="button" id="plumage-ams-set-citrus">Set: Orange + Lemon + Lime</button>
    <button type="button" id="plumage-ams-clear">Clear</button>
    <button type="button" id="plumage-ams-weird">Set: sanitization demo</button>
  </div>

  <${TAG}
    id="ams_controlled"
    input-id="ams-controlled"
    label="Controlled selections"
    placeholder="Type to filter…"
  ></${TAG}>

  <script>
    let controlledValue = ['Apple', 'Mango'];

    const host = document.querySelector('${TAG}');
    const state = document.querySelector('#plumage-ams-controlled-state');

    const renderState = (source) => {
      state.textContent = 'External controlled value (' + source + '): ' + JSON.stringify(controlledValue);
    };

    const applyValue = (next, source) => {
      controlledValue = Array.isArray(next) ? next.slice() : [];
      host.value = controlledValue.slice();
      renderState(source);
    };

    document.querySelector('#plumage-ams-set-apple-mango').addEventListener('click', () => {
      applyValue(['Apple', 'Mango'], 'button click');
    });

    document.querySelector('#plumage-ams-set-citrus').addEventListener('click', () => {
      applyValue(['Orange', 'Lemon', 'Lime'], 'button click');
    });

    document.querySelector('#plumage-ams-clear').addEventListener('click', () => {
      applyValue([], 'button click');
    });

    document.querySelector('#plumage-ams-weird').addEventListener('click', () => {
      applyValue(['  <b>Apple</b>  ', 'MANGO', 'mango', '\\u0007Bad\\u0000', ''], 'button click');
    });

    host.addEventListener('multiSelectChange', (e) => {
      const next = Array.isArray(e.detail)
        ? e.detail
        : Array.isArray(e.detail?.value)
          ? e.detail.value
          : [];
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

export const buildDocsHtmlMany = (blocks) =>
  normalize(`
<div style="display:grid; gap:14px; max-width:760px;">
${blocks.map((b) => `  ${String(b).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`);

export const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export const setOptionsWhenReady = async (el, options) => {
  const safe = Array.isArray(options) ? options.slice() : [];

  if (typeof el.componentOnReady === 'function') {
    await el.componentOnReady();
  } else if (window.customElements?.whenDefined) {
    await customElements.whenDefined(TAG);
  }

  el.options = safe;
};

export const setValueWhenReady = async (el, value) => {
  const safe = Array.isArray(value) ? value.slice() : [];

  if (typeof el.componentOnReady === 'function') {
    await el.componentOnReady();
  } else if (window.customElements?.whenDefined) {
    await customElements.whenDefined(TAG);
  }

  el.value = safe;
};

export const wrapEl = (childEl) => {
  const wrap = document.createElement('div');
  wrap.style.maxWidth = '680px';
  wrap.appendChild(childEl);
  return wrap;
};

export const wireLogsOnce = (el) => {
  if (!el || el.__wiredLogs) return;

  el.addEventListener('multiSelectChange', (e) => console.log('[multiSelectChange]', e.detail));
  el.addEventListener('valueChange', (e) => console.log('[valueChange]', e.detail));
  el.addEventListener('itemSelect', (e) => console.log('[itemSelect]', e.detail));
  el.addEventListener('clear', () => console.log('[clear]'));

  el.__wiredLogs = true;
};

export const FRUIT = [
  'Apple',
  'Apparatus',
  'Apple Pie',
  'Applegate',
  'Apricot',
  'Banana',
  'Blackberry',
  'Blueberry',
  'Cherry',
  'Clementine',
  'Date',
  'Dragonfruit',
  'Grape',
  'Grapefruit',
  'Kiwi',
  'Lemon',
  'Lime',
  'Mango',
  'Orange',
  'Papaya',
  'Peach',
  'Pear',
  'Pineapple',
  'Plum',
  'Strawberry',
];

export const SIZE_VARIANTS = [
  { id: 'ams_sm', inputId: 'ams-sm', label: 'Small', size: 'sm' },
  { id: 'ams_md', inputId: 'ams-md', label: 'Default', size: '' },
  { id: 'ams_lg', inputId: 'ams-lg', label: 'Large', size: 'lg' },
];

export const renderComponent = (args, { idOverride } = {}) => {
  const el = document.createElement(TAG);

  const hostId = idOverride || args.id || args.inputId || 'plumage-ams-demo';
  setAttr(el, 'id', hostId);

  setAttr(el, 'input-id', args.inputId);
  setAttr(el, 'label', args.label);
  setAttr(el, 'placeholder', args.placeholder);

  setAttr(el, 'size', args.size);
  setAttr(el, 'form-layout', args.formLayout);
  setAttr(el, 'label-hidden', args.labelHidden);
  setAttr(el, 'label-align', args.labelAlign);
  setAttr(el, 'label-size', args.labelSize);
  setAttr(el, 'label-col', args.labelCol);
  setAttr(el, 'input-col', args.inputCol);
  setAttr(el, 'label-cols', args.labelCols);
  setAttr(el, 'input-cols', args.inputCols);

  args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
  args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
  setAttr(el, 'validation-message', args.validationMessage);

  args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
  setAttr(el, 'error-message', args.errorMessage);

  args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
  args.readOnly ? el.setAttribute('read-only', '') : el.removeAttribute('read-only');

  args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');
  setAttr(el, 'clear-icon', args.clearIcon);

  args.addBtn ? el.setAttribute('add-btn', '') : el.removeAttribute('add-btn');
  setAttr(el, 'add-icon', args.addIcon);
  args.editable ? el.setAttribute('editable', '') : el.removeAttribute('editable');
  setAttr(el, 'add-new-on-enter', args.addNewOnEnter);
  setAttr(el, 'auto-sort', args.autoSort);

  args.preserveInputOnSelect
    ? el.setAttribute('preserve-input-on-select', '')
    : el.removeAttribute('preserve-input-on-select');

  args.clearInputOnBlurOutside
    ? el.setAttribute('clear-input-on-blur-outside', '')
    : el.removeAttribute('clear-input-on-blur-outside');

  setAttr(el, 'badge-variant', args.badgeVariant);
  setAttr(el, 'badge-shape', args.badgeShape);
  setAttr(el, 'badge-inline-styles', args.badgeInlineStyles);

  setAttr(el, 'name', args.name);
  setAttr(el, 'raw-input-name', args.rawInputName);

  setAttr(el, 'type', args.type || 'text');
  setAttr(el, 'form-id', args.formId);

  args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
  setAttr(el, 'arialabelled-by', args.arialabelledBy);

  wireLogsOnce(el);
  setOptionsWhenReady(el, Array.isArray(args.options) ? args.options : []);
  setValueWhenReady(el, Array.isArray(args.value) ? args.value : []);

  return wrapEl(el);
};

const escapeHtmlA11y = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const whenReadyA11y = (el) => {
  if (!el) return Promise.resolve();
  if (typeof el.componentOnReady === 'function') return el.componentOnReady();
  if (window.customElements?.whenDefined) return customElements.whenDefined(TAG);
  return Promise.resolve();
};

const readA11ySnapshotA11y = (el) => {
  const input = el?.querySelector?.('input') || null;

  const keys = [
    'role',
    'id',
    'name',
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
    'aria-readonly',
    'aria-describedby',
    'aria-labelledby',
    'aria-label',
  ];

  const inputAttrs = {};
  for (const k of keys) inputAttrs[k] = input ? input.getAttribute(k) : null;

  const listboxId = inputAttrs['aria-controls'] || null;
  const listbox = listboxId ? el.querySelector(`#${listboxId}`) : null;

  const listboxAttrs = {};
  if (listbox) {
    for (const k of ['id', 'role', 'aria-multiselectable']) {
      listboxAttrs[k] = listbox.getAttribute(k);
    }
  }

  const live = input?.id ? el.querySelector(`#${input.id}-live`) : el.querySelector('.sr-only[aria-live]');
  const messages = el.querySelectorAll('[role="alert"], .invalid-feedback, .error-message');
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

export const mkMatrixCellA11y = (args, { idOverride } = {}) => {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '10px';
  wrap.style.padding = '12px';
  wrap.style.background = 'white';

  const title = document.createElement('div');
  title.style.fontWeight = '700';
  title.style.marginBottom = '8px';
  title.textContent = args.__title || 'Variant';

  const compWrap = renderComponent(args, { idOverride });
  compWrap.style.maxWidth = '100%';

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
  pre.textContent = '';

  wrap.appendChild(title);
  wrap.appendChild(compWrap);
  wrap.appendChild(status);
  wrap.appendChild(pre);

  const el = compWrap.querySelector(TAG);

  whenReadyA11y(el)
    .then(() => {
      if (el && args.required && typeof el.validate === 'function') {
        try {
          el.validate();
        } catch (_) {}
      }
      return new Promise((r) => setTimeout(r, 0));
    })
    .then(() => {
      const snap = el ? readA11ySnapshotA11y(el) : null;
      pre.innerHTML = escapeHtmlA11y(JSON.stringify(snap, null, 2));
      status.textContent = 'Snapshot ready.';
    })
    .catch((err) => {
      status.textContent = 'Snapshot error.';
      pre.innerHTML = escapeHtmlA11y(String(err?.stack || err));
    });

  return wrap;
};
