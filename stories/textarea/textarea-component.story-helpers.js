// File: src/stories/textarea-component.story-helpers.js
import { action } from '@storybook/addon-actions';

export const normalize = (txt) => {
  const lines = String(txt ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''));

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
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replaceAll('"', '&quot;')}"`))
    .join('\n  ');

export const asNumOrUndef = (v) => {
  if (v === '' || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export const buildDocsHtml = (args) => {
  const shouldPrintInputId =
    args.inputId !== undefined &&
    args.inputId !== null &&
    String(args.inputId).trim() !== '';

  const attributeBlock = attrs(
    [
      ['disabled', !!args.disabled],
      ['required', !!args.required],
      ['read-only', !!args.readOnly],
      ['label-hidden', !!args.labelHidden],

      ['form-id', args.formId],
      ['form-layout', args.formLayout],

      ['label', args.label],
      ['label-size', args.labelSize],
      ['label-align', args.labelAlign],

      ['textarea-text-size', args.textareaTextSize],
      ['rows', asNumOrUndef(args.rows)],
      ['max-length', asNumOrUndef(args.maxLength)],

      ['label-col', asNumOrUndef(args.labelCol)],
      ['input-col', asNumOrUndef(args.inputCol)],
      ['label-cols', args.labelCols],
      ['input-cols', args.inputCols],

      ['placeholder', args.placeholder],
      ['validation', !!args.validation],
      ['validation-message', args.validationMessage],
      ['value', args.value],

      [shouldPrintInputId ? 'input-id' : '', shouldPrintInputId ? args.inputId : ''],
    ].filter(([k]) => !!k),
  );

  return normalize(`
<textarea-component
  ${attributeBlock}
></textarea-component>
`);
};

export const buildDocsHtmlExternalValue = () =>
  normalize(`
<div>
  <button type="button" id="load-draft">Load Draft</button>
  <button type="button" id="load-api-response">Load API Response</button>
  <button type="button" id="clear-textarea">Clear</button>

  <textarea-component
    label="Message"
    label-size="sm"
    input-id="textarea-external-value"
    placeholder="Load prefilled content"
    rows="5"
  ></textarea-component>
</div>

<script>
  const host = document.querySelector('textarea-component');

  document.querySelector('#load-draft').addEventListener('click', () => {
    host.value = 'Hello team,\\n\\nHere is the latest draft message loaded from an outside source.\\n\\nThanks.';
  });

  document.querySelector('#load-api-response').addEventListener('click', () => {
    host.value = 'This textarea was populated from preloaded data or an API response.';
  });

  document.querySelector('#clear-textarea').addEventListener('click', () => {
    host.value = '';
  });
</script>
`);

export const setBoolAttr = (el, name, on) => {
  if (on) el.setAttribute(name, '');
  else el.removeAttribute(name);
};

export const buildTextarea = (args) => {
  const el = document.createElement('textarea-component');

  setBoolAttr(el, 'disabled', !!args.disabled);
  setBoolAttr(el, 'required', !!args.required);
  setBoolAttr(el, 'read-only', !!args.readOnly);
  setBoolAttr(el, 'label-hidden', !!args.labelHidden);
  setBoolAttr(el, 'validation', !!args.validation);

  if (typeof args.formId === 'string') el.formId = args.formId;
  if (typeof args.formLayout === 'string') el.formLayout = args.formLayout;

  if (args.inputId !== undefined && args.inputId !== null && String(args.inputId).trim() !== '') {
    el.inputId = args.inputId;
  }

  el.label = args.label || '';
  el.labelSize = args.labelSize || 'sm';
  el.labelAlign = args.labelAlign || '';
  el.textareaTextSize = args.textareaTextSize || '';
  el.placeholder = args.placeholder || '';
  el.validationMessage = args.validationMessage || '';
  el.value = args.value || '';

  if (asNumOrUndef(args.rows) !== undefined) el.rows = Number(args.rows);
  if (asNumOrUndef(args.maxLength) !== undefined) el.maxLength = Number(args.maxLength);

  el.labelCol = Number(args.labelCol ?? 2);
  el.inputCol = Number(args.inputCol ?? 10);
  el.labelCols = args.labelCols || '';
  el.inputCols = args.inputCols || '';

  el.addEventListener('valueChange', (e) => action('valueChange')(e.detail));
  el.addEventListener('blurChange', (e) => action('blurChange')(e.detail));

  return el;
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

export const snapshotTextareaA11y = (host) => {
  const textarea = host.querySelector('textarea.form-control');
  const label = host.querySelector('label.form-control-label');
  const validation = host.querySelector('.invalid-feedback');
  const counter = host.querySelector('.textarea-counter');
  const help = host.querySelector('[id$="__desc"]');

  const describedByIds = textarea ? splitIds(textarea.getAttribute('aria-describedby')) : [];
  const labelledByIds = textarea ? splitIds(textarea.getAttribute('aria-labelledby')) : [];

  return {
    host: {
      tag: host.tagName.toLowerCase(),
    },
    textarea: textarea
      ? {
          tag: textarea.tagName.toLowerCase(),
          id: textarea.id || null,
          valueLength: textarea.value.length,
          rows: textarea.getAttribute('rows') || null,
          maxLength: textarea.getAttribute('maxlength') || null,
          ...pickAttrs(textarea, [
            'name',
            'placeholder',
            'disabled',
            'readonly',
            'required',
            'aria-labelledby',
            'aria-describedby',
            'aria-invalid',
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
          id: label.id || null,
          for: label.getAttribute('for') || null,
          text: label.textContent?.trim() || null,
        }
      : null,
    helpText: help
      ? {
          id: help.id || null,
          text: help.textContent?.trim() || null,
        }
      : null,
    counter: counter
      ? {
          id: counter.id || null,
          text: counter.textContent?.trim() || null,
          ...pickAttrs(counter, ['aria-live', 'aria-atomic']),
        }
      : null,
    validation: validation
      ? {
          id: validation.id || null,
          text: validation.textContent?.trim() || null,
          ...pickAttrs(validation, ['aria-live', 'aria-atomic']),
        }
      : null,
  };
};
