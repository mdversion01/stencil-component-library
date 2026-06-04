// File: src/stories/plumage-textarea-component.story-helpers.js

export const TAG = 'plumage-textarea-component';

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
    ['disabled', !!a.disabled],
    ['read-only', !!a.readOnly],
    ['required', !!a.required],
    ['validation', !!a.validation],
    ['label-hidden', !!a.labelHidden],

    ['form-id', normalize(a.formId)],
    ['form-layout', normalize(a.formLayout)],
    ['input-id', normalize(a.inputId)],
    ['textarea-text-size', normalize(a.textareaTextSize)],
    ['label', normalize(a.label)],
    ['label-size', normalize(a.labelSize)],
    ['label-align', normalize(a.labelAlign)],
    ['validation-message', normalize(a.validationMessage)],
    ['value', normalize(a.value)],
    ['placeholder', normalize(a.placeholder)],
    ['rows', Number.isFinite(Number(a.rows)) ? Number(a.rows) : undefined],
    ['max-length', Number.isFinite(Number(a.maxLength)) ? Number(a.maxLength) : undefined],

    ['aria-label', normalize(a.ariaLabel)],
    ['aria-labelledby', normalize(a.ariaLabelledby)],
    ['aria-describedby', normalize(a.ariaDescribedby)],
    ['arialabelled-by', normalize(a.arialabelledBy)],

    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['label-cols', normalize(a.labelCols)],
    ['input-cols', normalize(a.inputCols)],
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

export const renderComponent = args => {
  return `
<${TAG}
${boolAttr('disabled', !!args.disabled)}
${boolAttr('read-only', !!args.readOnly)}
${boolAttr('required', !!args.required)}
${boolAttr('validation', !!args.validation)}
${boolAttr('label-hidden', !!args.labelHidden)}
${attr('form-id', args.formId)}
${attr('form-layout', args.formLayout)}
${attr('input-id', args.inputId)}
${attr('textarea-text-size', args.textareaTextSize)}
${attr('label', args.label)}
${attr('label-size', args.labelSize)}
${attr('label-align', args.labelAlign)}
${attr('validation-message', args.validationMessage)}
${attr('value', args.value)}
${attr('placeholder', args.placeholder)}
${attr('rows', args.rows)}
${attr('max-length', args.maxLength)}
${attr('aria-label', args.ariaLabel)}
${attr('aria-labelledby', args.ariaLabelledby)}
${attr('aria-describedby', args.ariaDescribedby)}
${attr('arialabelled-by', args.arialabelledBy)}
${attr('label-col', args.labelCol)}
${attr('input-col', args.inputCol)}
${attr('label-cols', args.labelCols)}
${attr('input-cols', args.inputCols)}
>
</${TAG}>
`;
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

export function escAttr(v) {
  return String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function resolveIdsWithin(host, ids) {
  const res = {};
  ids.forEach(id => {
    const node = host.querySelector(`[id="${escAttr(id)}"]`);
    res[id] = !!node;
  });
  return res;
}

export function getSnapshot(host) {
  const textarea = host?.querySelector('textarea');
  const label = host?.querySelector('label');
  const feedback = host?.querySelector('.invalid-feedback');
  const counter = host?.querySelector('.textarea-counter');
  const underline = host?.querySelector('.b-underline');
  const focusBar = host?.querySelector('.b-focus');

  const describedByIds = textarea ? splitIds(textarea.getAttribute('aria-describedby')) : [];
  const labelledByIds = textarea ? splitIds(textarea.getAttribute('aria-labelledby')) : [];

  return {
    host: host?.tagName?.toLowerCase() ?? null,
    textarea: textarea
      ? {
          tag: textarea.tagName.toLowerCase(),
          id: textarea.getAttribute('id') || '',
          name: textarea.getAttribute('name') || '',
          class: textarea.getAttribute('class') || '',
          value: textarea.value ?? '',
          textContent: textarea.textContent ?? '',
          ...pickAttrs(textarea, [
            'placeholder',
            'rows',
            'maxlength',
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
            'aria-required',
            'aria-invalid',
            'aria-disabled',
            'aria-readonly',
            'disabled',
            'readonly',
            'required',
            'form',
          ]),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledByIds),
            'aria-describedby': resolveIdsWithin(host, describedByIds),
          },
        }
      : null,
    label: label
      ? {
          tag: label.tagName.toLowerCase(),
          id: label.getAttribute('id') || '',
          for: label.getAttribute('for') || '',
          class: label.getAttribute('class') || '',
          text: (label.textContent || '').trim(),
        }
      : null,
    counter: counter
      ? {
          id: counter.getAttribute('id') || '',
          class: counter.getAttribute('class') || '',
          text: (counter.textContent || '').trim(),
        }
      : null,
    validation: feedback
      ? {
          id: feedback.getAttribute('id') || '',
          class: feedback.getAttribute('class') || '',
          text: (feedback.textContent || '').trim(),
          ...pickAttrs(feedback, ['aria-live']),
        }
      : null,
    underline: underline
      ? {
          class: underline.getAttribute('class') || '',
        }
      : null,
    focusBar: focusBar
      ? {
          class: focusBar.getAttribute('class') || '',
          width: focusBar.style.width || '',
          left: focusBar.style.left || '',
        }
      : null,
  };
}

export function buildEl(args) {
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

  setBool('disabled', !!args.disabled);
  setBool('read-only', !!args.readOnly);
  setBool('required', !!args.required);
  setBool('validation', !!args.validation);
  setBool('label-hidden', !!args.labelHidden);

  set('form-id', args.formId);
  set('form-layout', args.formLayout);
  set('input-id', args.inputId);
  set('textarea-text-size', args.textareaTextSize);
  set('label', args.label);
  set('label-size', args.labelSize);
  set('label-align', args.labelAlign);
  set('validation-message', args.validationMessage);
  set('value', args.value);
  set('placeholder', args.placeholder);
  set('rows', args.rows);
  set('max-length', args.maxLength);

  set('aria-label', args.ariaLabel);
  set('aria-labelledby', args.ariaLabelledby);
  set('aria-describedby', args.ariaDescribedby);
  set('arialabelled-by', args.arialabelledBy);

  set('label-col', args.labelCol);
  set('input-col', args.inputCol);
  set('label-cols', args.labelCols);
  set('input-cols', args.inputCols);

  return el;
}

export function renderMatrixRow({ title, args, idSuffix }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const el = buildEl({
    ...args,
    inputId: args.inputId || `plumage-textarea-matrix-${idSuffix}`,
  });

  const stage = document.createElement('div');
  stage.style.maxWidth = '720px';

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

  const update = async () => {
    if (el?.componentOnReady) {
      try {
        await el.componentOnReady();
      } catch (_e) {}
    }
    pre.textContent = JSON.stringify(getSnapshot(el), null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}
