// File: stories/date-range-time-picker-component.story-helpers.js

import { action } from '@storybook/addon-actions';

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

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

export const attrs = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

export const asNumOrUndef = (v) => {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const buildDocsHtml = (args) => {
  const attributeBlock = attrs([
    ['plumage', !!args.plumage],
    ['range-time-picker', !!args.rangeTimePicker],
    ['disabled', !!args.disabled],
    ['required', !!args.required],

    ['date-format', args.dateFormat],
    ['is-twenty-four-hour-format', !!args.isTwentyFourHourFormat],
    ['show-duration', !!args.showDuration],
    ['show-ymd', !!args.showYmd],
    ['show-long', !!args.showLong],
    ['show-iso', !!args.showIso],

    ['placeholder', args.placeholder],
    ['join-by', args.joinBy],
    ['icon', args.icon],
    ['input-id', args.inputId],
    ['append-prop', !!args.appendProp],
    ['prepend-prop', !!args.prependProp],
    ['append-id', args.appendId],
    ['prepend-id', args.prependId],

    ['label', args.label],
    ['label-align', args.labelAlign],
    ['label-hidden', !!args.labelHidden],
    ['form-layout', args.formLayout],
    ['size', args.size],

    ['label-col', asNumOrUndef(args.labelCol)],
    ['input-col', asNumOrUndef(args.inputCol)],
    ['label-cols', args.labelCols],
    ['input-cols', args.inputCols],

    ['validation', !!args.validation],
    ['validation-message', args.validationMessage],
    ['warning-message', args.warningMessage],

    ['show-ok-button', !!args.showOkButton],
    ['aria-label', args.ariaLabel],
  ]);

  return normalize(`
<date-range-time-picker-component
  ${attributeBlock}
></date-range-time-picker-component>
`);
};

export const pickAttrs = (el, names) => {
  const out = {};
  if (!el) return out;
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
};

export const splitIds = (v) =>
  String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export const resolveIdsWithin = (host, ids) => {
  const res = {};
  for (const id of ids) {
    const safe = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    res[id] = !!host.querySelector(`[id="${safe}"]`);
  }
  return res;
};

export const collectIds = (root) => {
  const ids = Array.from(root.querySelectorAll('[id]'))
    .map((n) => n.id)
    .filter(Boolean);

  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);

  const duplicates = Array.from(counts.entries())
    .filter(([, c]) => c > 1)
    .map(([id, count]) => ({ id, count }));

  return { total: ids.length, unique: counts.size, duplicates };
};

export const buildDateRangeTimePickerEl = (args) => {
  const el = document.createElement('date-range-time-picker-component');

  el.plumage = !!args.plumage;
  el.rangeTimePicker = !!args.rangeTimePicker;
  el.disabled = !!args.disabled;
  el.required = !!args.required;

  el.dateFormat = args.dateFormat || 'YYYY-MM-DD';
  el.isTwentyFourHourFormat = !!args.isTwentyFourHourFormat;
  el.showDuration = !!args.showDuration;
  el.showYmd = !!args.showYmd;
  el.showLong = !!args.showLong;
  el.showIso = !!args.showIso;

  if (args.placeholder) el.placeholder = args.placeholder;
  el.joinBy = args.joinBy || ' - ';
  el.icon = args.icon || 'fas fa-calendar-alt';
  el.inputId = args.inputId || 'date-range-time';
  el.appendProp = !!args.appendProp;
  el.prependProp = !!args.prependProp;
  el.appendId = args.appendId || '';
  el.prependId = args.prependId || '';

  el.label = args.label || 'Date and Time Picker';
  el.labelAlign = args.labelAlign || '';
  el.labelHidden = !!args.labelHidden;
  el.formLayout = args.formLayout || '';
  el.size = args.size || '';

  if (asNumOrUndef(args.labelCol) !== undefined) el.labelCol = Number(args.labelCol);
  if (asNumOrUndef(args.inputCol) !== undefined) el.inputCol = Number(args.inputCol);
  el.labelCols = args.labelCols || '';
  el.inputCols = args.inputCols || '';

  el.validation = !!args.validation;
  el.validationMessage = args.validationMessage || 'Required field';
  el.warningMessage = args.warningMessage || '';

  el.showOkButton = !!args.showOkButton;
  el.ariaLabel = args.ariaLabel || '';
  el.value = args.value || '';

  el.addEventListener('date-time-updated', (e) => action('date-time-updated')(e.detail));

  return el;
};

export const Template = (args) => buildDateRangeTimePickerEl(args);

export const snapshotDRTPA11y = (host) => {
  const input = host.querySelector('input.form-control');
  const label = host.querySelector('label.form-control-label');
  const toggle = host.querySelector('.calendar-button, button.btn.input-group-text');
  const dialog = host.querySelector('.dropdown-content');
  const validation = host.querySelector('.invalid-feedback.validation, .invalid-feedback.warning, .invalid-feedback');

  const describedByIds = input ? splitIds(input.getAttribute('aria-describedby')) : [];
  const labelledByIds = input ? splitIds(input.getAttribute('aria-labelledby')) : [];

  return {
    host: {
      tag: host.tagName.toLowerCase(),
      id: host.id || null,
      role: host.getAttribute('role') || null,
      ...pickAttrs(host, ['aria-label', 'aria-labelledby', 'aria-describedby']),
    },
    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.id || null,
          role: input.getAttribute('role') || null,
          ...pickAttrs(input, ['name', 'type', 'autocomplete', 'required', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledByIds),
            'aria-describedby': resolveIdsWithin(host, describedByIds),
          },
        }
      : null,
    label: label
      ? {
          tag: label.tagName.toLowerCase(),
          id: label.id || null,
          for: label.getAttribute('for') || null,
        }
      : null,
    toggle: toggle
      ? {
          tag: toggle.tagName.toLowerCase(),
          id: toggle.id || null,
          role: toggle.getAttribute('role') || null,
          ...pickAttrs(toggle, ['aria-label', 'aria-haspopup', 'aria-expanded', 'aria-controls', 'disabled']),
        }
      : null,
    dialog: dialog
      ? {
          tag: dialog.tagName.toLowerCase(),
          id: dialog.id || null,
          role: dialog.getAttribute('role') || null,
          ...pickAttrs(dialog, ['aria-modal', 'aria-labelledby', 'aria-describedby']),
        }
      : null,
    validation: validation
      ? {
          tag: validation.tagName.toLowerCase(),
          id: validation.id || null,
          ...pickAttrs(validation, ['aria-live', 'aria-atomic']),
          text: validation.textContent?.trim() || null,
        }
      : null,
    ids: collectIds(host),
  };
};

export const renderDRTPMatrixRow = ({ title, args, idSuffix }) => {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const el = buildDateRangeTimePickerEl({
    ...args,
    inputId: `drtp-matrix-${idSuffix}`,
  });

  const stage = document.createElement('div');
  stage.style.maxWidth = '560px';

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
    pre.textContent = JSON.stringify(snapshotDRTPA11y(el), null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));
  return wrap;
};
