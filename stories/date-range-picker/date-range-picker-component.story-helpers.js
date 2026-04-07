// File: src/stories/date-range-picker-component/date-range-picker-component.story-helpers.js

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

export const buildDocsHtml = (args) => {
  const attributeBlock = attrs([
    ['plumage', !!args.plumage],
    ['range-picker', !!args.rangePicker],
    ['disabled', !!args.disabled],
    ['required', !!args.required],

    ['date-format', args.dateFormat],
    ['show-ymd', !!args.showYmd],
    ['show-long', !!args.showLong],
    ['show-iso', !!args.showIso],

    ['placeholder', args.placeholder],
    ['join-by', args.joinBy],
    ['icon', args.icon],
    ['input-id', args.inputId],
    ['value', args.value],

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
<date-range-picker-component
  ${attributeBlock}
></date-range-picker-component>
`);
};

export const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export const buildDateRangePickerEl = (args) => {
  const el = document.createElement('date-range-picker-component');

  el.plumage = !!args.plumage;
  el.rangePicker = !!args.rangePicker;
  el.disabled = !!args.disabled;
  el.required = !!args.required;

  el.dateFormat = args.dateFormat || 'YYYY-MM-DD';
  el.showYmd = !!args.showYmd;
  el.showLong = !!args.showLong;
  el.showIso = !!args.showIso;

  if (args.placeholder) el.placeholder = args.placeholder;
  el.joinBy = args.joinBy || ' - ';
  el.icon = args.icon || 'fas fa-calendar-alt';
  el.inputId = args.inputId || 'drp';
  el.value = args.value || '';

  el.appendProp = !!args.appendProp;
  el.prependProp = !!args.prependProp;
  el.appendId = args.appendId || '';
  el.prependId = args.prependId || '';

  el.label = args.label || 'Date Range Picker';
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

  setAttr(el, 'plumage', !!args.plumage);
  setAttr(el, 'range-picker', !!args.rangePicker);
  setAttr(el, 'disabled', !!args.disabled);
  setAttr(el, 'required', !!args.required);

  setAttr(el, 'date-format', args.dateFormat);
  setAttr(el, 'show-ymd', !!args.showYmd);
  setAttr(el, 'show-long', !!args.showLong);
  setAttr(el, 'show-iso', !!args.showIso);

  setAttr(el, 'placeholder', args.placeholder);
  setAttr(el, 'join-by', args.joinBy);
  setAttr(el, 'icon', args.icon);
  setAttr(el, 'input-id', args.inputId);
  setAttr(el, 'value', args.value);

  setAttr(el, 'append-prop', !!args.appendProp);
  setAttr(el, 'prepend-prop', !!args.prependProp);
  setAttr(el, 'append-id', args.appendId);
  setAttr(el, 'prepend-id', args.prependId);

  setAttr(el, 'label', args.label);
  setAttr(el, 'label-align', args.labelAlign);
  setAttr(el, 'label-hidden', !!args.labelHidden);
  setAttr(el, 'form-layout', args.formLayout);
  setAttr(el, 'size', args.size);

  setAttr(el, 'label-col', asNumOrUndef(args.labelCol));
  setAttr(el, 'input-col', asNumOrUndef(args.inputCol));
  setAttr(el, 'label-cols', args.labelCols);
  setAttr(el, 'input-cols', args.inputCols);

  setAttr(el, 'validation', !!args.validation);
  setAttr(el, 'validation-message', args.validationMessage);
  setAttr(el, 'warning-message', args.warningMessage);

  setAttr(el, 'show-ok-button', !!args.showOkButton);
  setAttr(el, 'aria-label', args.ariaLabel);

  el.addEventListener('date-range-updated', (e) => action('date-range-updated')(e.detail));

  return el;
};

export const Template = (args) => buildDateRangePickerEl(args);
