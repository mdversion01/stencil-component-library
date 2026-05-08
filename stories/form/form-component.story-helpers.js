// File: src/stories/form-component/form-component.story-helpers.js

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

  delete a.numFields;
  delete a.showValidation;
  delete a.validationText;
  delete a.disabledDemo;

  const attrs = [
    ['action', normalize(a.action)],
    ['method', normalize(a.method)],
    ['form-layout', normalize(a.formLayout)],
    ['form-id', normalize(a.formId)],

    ['form-aria-label', normalize(a.formAriaLabel)],
    ['form-aria-labelledby', normalize(a.formAriaLabelledby)],
    ['form-aria-describedby', normalize(a.formAriaDescribedby)],
    ['fieldset-aria-label', normalize(a.fieldsetAriaLabel)],
    ['fieldset-aria-labelledby', normalize(a.fieldsetAriaLabelledby)],
    ['fieldset-aria-describedby', normalize(a.fieldsetAriaDescribedby)],

    ['legend-position', normalize(a.legendPosition)],
    ['legend-size', normalize(a.legendSize)],
    ['legend-txt', normalize(a.legendTxt)],

    ['bcolor', normalize(a.bcolor)],
    ['bradius', typeof a.bradius === 'number' ? a.bradius : undefined],
    ['bstyle', normalize(a.bstyle)],
    ['bwidth', typeof a.bwidth === 'number' ? a.bwidth : undefined],
    ['styles', normalize(a.styles)],

    ['fieldset', !!a.fieldset],
    ['legend', !!a.legend],
    ['outside-of-form', !!a.outsideOfForm],
  ];

  const attrStr = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  const openTag = attrStr ? `<form-component ${attrStr}>` : '<form-component>';

  return [
    openTag,
    '  <!-- slot="formField" children are rendered in the Canvas for this story -->',
    '</form-component>',
  ].join('\n');
};

export function makeInput(label, id, disabled = false) {
  const el = document.createElement('input-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  el.setAttribute('value', '');
  if (disabled) el.setAttribute('disabled', '');
  return el;
}

export function makeTextarea(label, id, disabled = false) {
  const el = document.createElement('textarea-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  el.setAttribute('value', '');
  if (disabled) el.setAttribute('disabled', '');
  return el;
}

export function makeSelect(label, id, disabled = false) {
  const el = document.createElement('select-field-component');
  el.setAttribute('label', label);
  el.setAttribute('input-id', id);
  el.setAttribute('slot', 'formField');
  if (disabled) el.setAttribute('disabled', '');
  return el;
}

export const applyHorizontalRowMargins = (formEl, leftPx = 10) => {
  if (!formEl) return;

  const apply = () => {
    const root = formEl.shadowRoot ?? formEl;

    const rows = root.querySelectorAll(
      '.form-group.row, .form-group-row, .row.form-group, [data-form-group-row="true"]',
    );

    rows.forEach((row) => {
      row.style.marginLeft = `${leftPx}px`;
    });
  };

  requestAnimationFrame(() => requestAnimationFrame(apply));
};

export function buildForm(args, fields) {
  const form = document.createElement('form-component');

  if (args.action) form.action = args.action;
  if (args.method) form.method = args.method;
  form.fieldset = !!args.fieldset;
  form.legend = !!args.legend;
  form.legendPosition = args.legendPosition;
  form.legendSize = args.legendSize;
  form.legendTxt = args.legendTxt;
  form.formLayout = args.formLayout;
  form.formId = args.formId;
  form.outsideOfForm = !!args.outsideOfForm;
  form.bcolor = args.bcolor;
  if (typeof args.bradius === 'number') form.bradius = args.bradius;
  form.bstyle = args.bstyle;
  if (typeof args.bwidth === 'number') form.bwidth = args.bwidth;
  form.styles = args.styles || '';

  if (args.formAriaLabel) form.formAriaLabel = args.formAriaLabel;
  if (args.formAriaLabelledby) form.formAriaLabelledby = args.formAriaLabelledby;
  if (args.formAriaDescribedby) form.formAriaDescribedby = args.formAriaDescribedby;

  if (args.fieldsetAriaLabel) form.fieldsetAriaLabel = args.fieldsetAriaLabel;
  if (args.fieldsetAriaLabelledby) form.fieldsetAriaLabelledby = args.fieldsetAriaLabelledby;
  if (args.fieldsetAriaDescribedby) form.fieldsetAriaDescribedby = args.fieldsetAriaDescribedby;

  fields.forEach((f) => form.appendChild(f));

  if (args.showValidation) {
    const msg = document.createElement('div');
    msg.id = `${args.formId || 'demo-form'}__validation`;
    msg.setAttribute('slot', 'formField');
    msg.className = 'invalid-feedback validation';
    msg.setAttribute('aria-live', 'polite');
    msg.setAttribute('aria-atomic', 'true');
    msg.style.display = 'block';
    msg.style.marginTop = '10px';
    msg.textContent = args.validationText || 'Please fix the errors above.';
    form.appendChild(msg);
  }

  const submit = document.createElement('button-component');
  submit.setAttribute('variant', 'primary');
  submit.textContent = 'Submit';
  submit.setAttribute('slot', 'formField');
  submit.style.display = 'inline-block';
  submit.style.marginLeft = '15px';
  submit.style.marginTop = '15px';
  submit.style.marginBottom = '15px';

  if (args.disabledDemo) {
    submit.setAttribute('disabled', '');
  }

  form.appendChild(submit);

  if (args.formLayout === 'horizontal') {
    applyHorizontalRowMargins(form, 10);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('[form submit]', { action: form.action, method: form.method });
  });

  return form;
}

export function template(args) {
  const fields = [];
  const n = Math.max(1, Math.min(6, Number(args.numFields) || 2));
  const labels = ['First Name', 'Last Name', 'Email', 'Company', 'Role', 'City'];

  for (let i = 0; i < n; i++) {
    fields.push(makeInput(labels[i] || `Field ${i + 1}`, `input-${i + 1}`, !!args.disabledDemo));
  }

  return buildForm(args, fields);
}

export function pickAttrs(el, names) {
  const out = {};
  if (!el) return out;
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

export function safeQueryById(root, id) {
  const safe = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return root.querySelector(`[id="${safe}"]`);
}

export function resolveIdsWithin(root, ids) {
  const res = {};
  for (const id of ids) {
    res[id] = !!safeQueryById(root, id);
  }
  return res;
}

export function collectIds(root) {
  const ids = Array.from(root.querySelectorAll('[id]'))
    .map((n) => n.id)
    .filter(Boolean);

  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);

  const dups = Array.from(counts.entries())
    .filter(([, c]) => c > 1)
    .map(([id, c]) => ({ id, count: c }));

  return { total: ids.length, unique: counts.size, duplicates: dups };
}

export function snapshotA11y(host) {
  const form = host.querySelector('form');
  const fieldset = host.querySelector('fieldset');
  const legend = host.querySelector('legend');
  const slotNodes = host.querySelectorAll('[slot="formField"]');
  const validation = host.querySelector('.invalid-feedback.validation, .invalid-feedback.warning, [id$="__validation"]');

  const labelledbyForm = form ? splitIds(form.getAttribute('aria-labelledby')) : [];
  const describedbyForm = form ? splitIds(form.getAttribute('aria-describedby')) : [];
  const labelledbyFs = fieldset ? splitIds(fieldset.getAttribute('aria-labelledby')) : [];
  const describedbyFs = fieldset ? splitIds(fieldset.getAttribute('aria-describedby')) : [];

  return {
    host: {
      tag: host.tagName.toLowerCase(),
      id: host.id || '',
    },
    structure: {
      hasForm: !!form,
      hasFieldset: !!fieldset,
      hasLegend: !!legend,
      slotCount: slotNodes.length,
    },
    form: form
      ? {
          tag: form.tagName.toLowerCase(),
          id: form.getAttribute('id') || '',
          class: form.getAttribute('class') || '',
          ...pickAttrs(form, ['aria-label', 'aria-labelledby', 'aria-describedby']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledbyForm),
            'aria-describedby': resolveIdsWithin(host, describedbyForm),
          },
        }
      : null,
    fieldset: fieldset
      ? {
          tag: fieldset.tagName.toLowerCase(),
          ...pickAttrs(fieldset, ['aria-label', 'aria-labelledby', 'aria-describedby']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledbyFs),
            'aria-describedby': resolveIdsWithin(host, describedbyFs),
          },
        }
      : null,
    legend: legend
      ? {
          tag: legend.tagName.toLowerCase(),
          id: legend.getAttribute('id') || '',
          class: legend.getAttribute('class') || '',
          text: (legend.textContent || '').trim(),
        }
      : null,
    validation: validation
      ? {
          tag: validation.tagName.toLowerCase(),
          id: validation.getAttribute('id') || '',
          ...pickAttrs(validation, ['aria-live', 'aria-atomic', 'role']),
          text: (validation.textContent || '').trim(),
        }
      : null,
    ids: collectIds(host),
  };
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

  const el = template({
    ...args,
    formId: `form-matrix-${idSuffix}`,
  });

  const stage = document.createElement('div');
  stage.style.maxWidth = '860px';

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
    const host = stage.querySelector('form-component') || el;
    const snap = snapshotA11y(host);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}
