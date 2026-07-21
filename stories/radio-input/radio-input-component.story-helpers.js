// src/stories/radio-input-component.story-helpers.js

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

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const serialize = (v) => {
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v ?? []);
  } catch {
    return '[]';
  }
};

export const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${esc(v)}"`))
    .join('\n  ');

export const groupOptionsAttrLine = (groupOptions) => {
  const json = serialize(groupOptions).replace(/'/g, '&#39;');
  return `group-options='${json}'`;
};

export const buildDocsHtml = (args) => {
  const isGroup = !!(args.bsRadioGroup || args.basicRadioGroup);

  if (!isGroup) {
    return normalize(`
<radio-input-component
  ${attrLines([
    ['basic-radio', !!args.basicRadio],
    ['bs-radio', !!args.bsRadio && !args.basicRadio],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['disabled', !!args.disabled],
    ['input-id', args.inputId],
    ['label-txt', args.labelTxt],
    ['name', args.name],
    ['required', !!args.required],
    ['size', args.size],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
    ['value', args.value],
  ])}
></radio-input-component>
`);
  }

  return normalize(`
<radio-input-component
  ${attrLines([
    ['basic-radio-group', !!args.basicRadioGroup],
    ['bs-radio-group', !!args.bsRadioGroup && !args.basicRadioGroup],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['disabled', !!args.disabled],
    ['group-title', args.groupTitle],
    ['group-title-size', args.groupTitleSize],
    ['inline', !!args.inline],
    ['name', args.name],
    ['required', !!args.required],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
  ])}
  ${groupOptionsAttrLine(args.groupOptions)}
></radio-input-component>
`);
};

export const SingleTemplate = (args) =>
  normalize(`
<radio-input-component
  ${attrLines([
    ['basic-radio', !!args.basicRadio],
    ['bs-radio', !!args.bsRadio && !args.basicRadio],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['disabled', !!args.disabled],
    ['input-id', args.inputId],
    ['label-txt', args.labelTxt],
    ['name', args.name],
    ['required', !!args.required],
    ['size', args.size],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
    ['value', args.value],
  ])}
></radio-input-component>
`);

export const GroupTemplate = (args) =>
  normalize(`
<radio-input-component
  ${attrLines([
    ['basic-radio-group', !!args.basicRadioGroup],
    ['bs-radio-group', !!args.bsRadioGroup && !args.basicRadioGroup],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['disabled', !!args.disabled],
    ['group-title', args.groupTitle],
    ['group-title-size', args.groupTitleSize],
    ['inline', !!args.inline],
    ['name', args.name],
    ['required', !!args.required],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
  ])}
  ${groupOptionsAttrLine(args.groupOptions)}
></radio-input-component>
`);

export const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

export const getSnapshot = (hostOrOuter) => {
  const host = hostOrOuter?.querySelector?.('radio-input-component') || hostOrOuter;
  const group = host?.querySelector?.('[role="radiogroup"]') || null;
  const isGroup = !!group;

  const resolveInOuter = (id) => {
    if (!id) return false;
    try {
      return !!hostOrOuter?.querySelector?.(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  if (!isGroup) {
    const input = host?.querySelector?.('input[type="radio"]') || null;
    const label = host?.querySelector?.('label') || null;
    const error = host?.querySelector?.('.invalid-feedback') || null;

    const describedby = (input?.getAttribute?.('aria-describedby') || '').trim();
    const describedIds = splitIds(describedby);
    const labelledby = (input?.getAttribute?.('aria-labelledby') || '').trim();
    const labelledIds = splitIds(labelledby);

    return {
      mode: 'single',
      host: host?.tagName?.toLowerCase?.() ?? null,
      inputId: input?.getAttribute?.('id') ?? null,
      name: input?.getAttribute?.('name') ?? null,
      required: input?.hasAttribute?.('required') ?? null,
      disabled: input?.hasAttribute?.('disabled') ?? null,
      'aria-label': input?.getAttribute?.('aria-label') ?? null,
      'aria-labelledby': labelledby || null,
      'aria-describedby': describedby || null,
      'aria-invalid': input?.getAttribute?.('aria-invalid') ?? null,
      labelId: label?.getAttribute?.('id') ?? null,
      labelFor: label?.getAttribute?.('for') ?? label?.getAttribute?.('htmlfor') ?? null,
      errorId: error?.getAttribute?.('id') ?? null,
      errorRole: error?.getAttribute?.('role') ?? null,
      errorLive: error?.getAttribute?.('aria-live') ?? null,
      labelledbyIds: labelledIds,
      labelledbyAllResolve: labelledIds.every(resolveInOuter),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every(resolveInOuter),
    };
  }

  const titleEl = host?.querySelector?.('.group-title[id]') || null;
  const error = host?.querySelector?.('.invalid-feedback') || null;
  const radios = Array.from(host?.querySelectorAll?.('input[type="radio"]') || []);

  const describedby = (group?.getAttribute?.('aria-describedby') || '').trim();
  const describedIds = splitIds(describedby);
  const labelledby = (group?.getAttribute?.('aria-labelledby') || '').trim();
  const labelledIds = splitIds(labelledby);

  return {
    mode: 'group',
    host: host?.tagName?.toLowerCase?.() ?? null,
    role: group?.getAttribute?.('role') ?? null,
    'aria-label': group?.getAttribute?.('aria-label') ?? null,
    'aria-labelledby': labelledby || null,
    'aria-describedby': describedby || null,
    'aria-required': group?.getAttribute?.('aria-required') ?? null,
    'aria-invalid': group?.getAttribute?.('aria-invalid') ?? null,
    titleId: titleEl?.getAttribute?.('id') ?? null,
    errorId: error?.getAttribute?.('id') ?? null,
    errorRole: error?.getAttribute?.('role') ?? null,
    errorLive: error?.getAttribute?.('aria-live') ?? null,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolveInOuter),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolveInOuter),
    radios: radios.map((i) => ({
      id: i.getAttribute('id'),
      name: i.getAttribute('name'),
      checked: i.checked,
      disabled: i.disabled,
      required: i.hasAttribute('required'),
      'aria-invalid': i.getAttribute('aria-invalid'),
      'aria-describedby': i.getAttribute('aria-describedby'),
    })),
  };
};
