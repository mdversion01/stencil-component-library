// File: src/stories/checkbox-component/checkbox-component.story-helpers.js

import { action } from '@storybook/addon-actions';

export const normalize = (txt) => {
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

export const attrs = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replaceAll('"', '&quot;')}"`))
    .join('\n  ');

export const prettyJson = (v) => {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return '[]';
  }
};

export const buildDocsHtml = (args) => {
  const isGroup = !!args.checkboxGroup || !!args.customCheckboxGroup;
  const effectiveGroupTitle = args.groupTitle || args.labelTxt || '';

  const attributeBlock = attrs([
    ['custom-checkbox', !!args.customCheckbox],
    ['checkbox-group', !!args.checkboxGroup],
    ['custom-checkbox-group', !!args.customCheckboxGroup],
    ['input-id', args.inputId],
    ['name', args.name],
    ['label-txt', args.labelTxt],
    ['value', args.value],
    ['size', args.size],
    ['inline', !!args.inline],
    ['required', !!args.required],
    ['disabled', !!args.disabled],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
    ['checked', !isGroup ? !!args.checked : false],
    ['group-title', isGroup ? effectiveGroupTitle : ''],
    ['group-title-size', isGroup ? args.groupTitleSize : ''],
  ]);

  const groupOptions =
    Array.isArray(args.groupOptions)
      ? args.groupOptions
      : (() => {
          try {
            return JSON.parse(args.groupOptions || '[]');
          } catch {
            return [];
          }
        })();

  const groupOptionsJs = isGroup
    ? normalize(`
<script>
  const groupOptions = ${prettyJson(groupOptions)};
  document.querySelector('checkbox-component').groupOptions = groupOptions;
</script>
`)
    : '';

  return normalize(`
<checkbox-component
  ${attributeBlock}
></checkbox-component>
${groupOptionsJs}
`);
};

export const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export const toArrayOptions = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const buildCheckboxEl = (args) => {
  const el = document.createElement('checkbox-component');

  el.customCheckbox = !!args.customCheckbox;
  el.checkboxGroup = !!args.checkboxGroup;
  el.customCheckboxGroup = !!args.customCheckboxGroup;

  el.inputId = args.inputId || '';
  el.name = args.name || '';
  el.labelTxt = args.labelTxt || '';
  el.value = args.value || '';
  el.size = args.size || '';
  el.inline = !!args.inline;
  el.required = !!args.required;
  el.disabled = !!args.disabled;
  el.validation = !!args.validation;
  el.validationMsg = args.validationMsg || '';

  el.checked = !!args.checked;

  el.groupTitle = args.groupTitle || '';
  el.groupTitleSize = args.groupTitleSize || '';
  el.groupOptions = toArrayOptions(args.groupOptions);

  setAttr(el, 'custom-checkbox', !!args.customCheckbox);
  setAttr(el, 'checkbox-group', !!args.checkboxGroup);
  setAttr(el, 'custom-checkbox-group', !!args.customCheckboxGroup);
  setAttr(el, 'input-id', args.inputId);
  setAttr(el, 'name', args.name);
  setAttr(el, 'label-txt', args.labelTxt);
  setAttr(el, 'value', args.value);
  setAttr(el, 'size', args.size);
  setAttr(el, 'inline', !!args.inline);
  setAttr(el, 'required', !!args.required);
  setAttr(el, 'disabled', !!args.disabled);
  setAttr(el, 'validation', !!args.validation);
  setAttr(el, 'validation-msg', args.validationMsg);
  setAttr(el, 'checked', !!args.checked);
  setAttr(el, 'group-title', args.groupTitle);
  setAttr(el, 'group-title-size', args.groupTitleSize);

  el.addEventListener('groupChange', (e) => action('groupChange')(e.detail));
  el.addEventListener('toggle', (e) => action('toggle')(e.detail));
  el.addEventListener('change', (e) => action('change')(e?.detail));

  return el;
};

export const Template = (args) => buildCheckboxEl(args);
