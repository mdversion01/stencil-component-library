// File: src/stories/input-group-component/input-group-component.story-helpers.js

export const normalize = (value) => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const buildDocsHtml = (args) => {
  const a = { ...args };

  const usePrependSlot = !!a.otherContent && !!a.prepend;
  const useAppendSlot = !!a.otherContent && !!a.append;

  const attrs = [
    ['append', !!a.append],
    ['prepend', !!a.prepend],
    ['disabled', !!a.disabled],
    ['label-hidden', !!a.labelHidden],
    ['other-content', !!a.otherContent],
    ['required', !!a.required],
    ['validation', !!a.validation],

    ['append-icon', useAppendSlot ? undefined : normalize(a.appendIcon)],
    ['append-id', normalize(a.appendId)],
    ['prepend-icon', usePrependSlot ? undefined : normalize(a.prependIcon)],
    ['prepend-id', normalize(a.prependId)],
    ['form-layout', normalize(a.formLayout)],
    ['size', normalize(a.size)],
    ['type', normalize(a.type)],
    ['value', normalize(a.value)],
    ['placeholder', normalize(a.placeholder)],
    ['input-id', normalize(a.inputId)],
    ['label', normalize(a.label)],
    ['label-align', normalize(a.labelAlign)],
    ['label-size', normalize(a.labelSize)],
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['label-cols', normalize(a.labelCols)],
    ['input-cols', normalize(a.inputCols)],
    ['icon', normalize(a.icon)],
    ['validation-message', normalize(a.validationMessage)],
  ];

  const attrStr = attrs
    .filter(([k, v]) => k && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  const openTag = attrStr ? `<input-group-component ${attrStr}>` : '<input-group-component>';

  const slotLines = [];
  if (usePrependSlot) {
    slotLines.push(`  <button-component slot="prepend" type="button" variant="secondary">Go</button-component>`);
  }
  if (useAppendSlot) {
    slotLines.push(`  <button-component slot="append" type="button" variant="secondary">Go</button-component>`);
  }

  return [openTag, ...slotLines, '</input-group-component>'].join('\n');
};

export const boolAttr = (name, on) => (on ? ` ${name}` : '');

export const attr = (name, val) => {
  const v = normalize(val);
  return v === undefined || v === false ? '' : v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
};

export const template = (args) => {
  const usePrependSlot = !!args.otherContent && !!args.prepend;
  const useAppendSlot = !!args.otherContent && !!args.append;

  return `
<input-group-component
${boolAttr('append', !!args.append)}
${boolAttr('prepend', !!args.prepend)}
${boolAttr('disabled', !!args.disabled)}
${boolAttr('label-hidden', !!args.labelHidden)}
${boolAttr('other-content', !!args.otherContent)}
${boolAttr('required', !!args.required)}
${boolAttr('validation', !!args.validation)}
${useAppendSlot ? '' : attr('append-icon', args.appendIcon)}
${attr('append-id', args.appendId)}
${usePrependSlot ? '' : attr('prepend-icon', args.prependIcon)}
${attr('prepend-id', args.prependId)}
${attr('form-layout', args.formLayout)}
${attr('size', args.size)}
${attr('type', args.type)}
${attr('value', args.value)}
${attr('placeholder', args.placeholder)}
${attr('input-id', args.inputId)}
${attr('label', args.label)}
${attr('label-align', args.labelAlign)}
${attr('label-size', args.labelSize)}
${attr('label-col', args.labelCol)}
${attr('input-col', args.inputCol)}
${attr('label-cols', args.labelCols)}
${attr('input-cols', args.inputCols)}
${attr('icon', args.icon)}
${attr('validation-message', args.validationMessage)}
>
${usePrependSlot ? `<button-component slot="prepend" type="button" variant="secondary">Go</button-component>` : ''}
${useAppendSlot ? `<button-component slot="append" type="button" variant="secondary">Go</button-component>` : ''}
</input-group-component>
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
  ids.forEach((id) => {
    const node = host.querySelector(`[id="${escAttr(id)}"]`);
    res[id] = !!node;
  });
  return res;
}

export function snapshotA11y(host) {
  const input = host.querySelector('input');
  const label = host.querySelector('label');
  const feedback = host.querySelector('.invalid-feedback');
  const group = host.querySelector('.input-group');

  const describedByIds = input ? splitIds(input.getAttribute('aria-describedby')) : [];
  const labelledByIds = input ? splitIds(input.getAttribute('aria-labelledby')) : [];

  return {
    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.getAttribute('id') || '',
          role: input.getAttribute('role') || '',
          class: input.getAttribute('class') || '',
          ...pickAttrs(input, ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid', 'disabled', 'required', 'type', 'name', 'form']),
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
        }
      : null,
    inputGroup: group
      ? {
          tag: group.tagName.toLowerCase(),
          class: group.getAttribute('class') || '',
          role: group.getAttribute('role') || '',
        }
      : null,
    validation: feedback
      ? {
          tag: feedback.tagName.toLowerCase(),
          id: feedback.getAttribute('id') || '',
          class: feedback.getAttribute('class') || '',
          ...pickAttrs(feedback, ['aria-live', 'aria-atomic']),
          text: (feedback.textContent || '').trim(),
        }
      : null,
  };
}

export function buildEl(args) {
  const el = document.createElement('input-group-component');

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

  setBool('append', !!args.append);
  setBool('prepend', !!args.prepend);
  setBool('disabled', !!args.disabled);
  setBool('label-hidden', !!args.labelHidden);
  setBool('other-content', !!args.otherContent);
  setBool('required', !!args.required);
  setBool('validation', !!args.validation);

  set('append-icon', args.appendIcon);
  set('append-id', args.appendId);
  set('prepend-icon', args.prependIcon);
  set('prepend-id', args.prependId);
  set('form-layout', args.formLayout);
  set('size', args.size);
  set('type', args.type);
  set('value', args.value);
  set('placeholder', args.placeholder);
  set('input-id', args.inputId);
  set('label', args.label);
  set('label-align', args.labelAlign);
  set('label-size', args.labelSize);
  set('label-col', args.labelCol);
  set('input-col', args.inputCol);
  set('label-cols', args.labelCols);
  set('input-cols', args.inputCols);
  set('icon', args.icon);
  set('validation-message', args.validationMessage);

  if (args.otherContent && args.prepend) {
    const btn = document.createElement('button-component');
    btn.setAttribute('slot', 'prepend');
    btn.setAttribute('type', 'button');
    btn.setAttribute('variant', 'secondary');
    btn.textContent = 'Go';
    el.appendChild(btn);
  }

  if (args.otherContent && args.append) {
    const btn = document.createElement('button-component');
    btn.setAttribute('slot', 'append');
    btn.setAttribute('type', 'button');
    btn.setAttribute('variant', 'secondary');
    btn.textContent = 'Go';
    el.appendChild(btn);
  }

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
    inputId: args.inputId || `igc-matrix-${idSuffix}`,
  });

  const stage = document.createElement('div');
  stage.style.maxWidth = '640px';

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

  const update = () => {
    const snap = snapshotA11y(el);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}
