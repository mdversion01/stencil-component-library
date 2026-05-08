export const normalize = txt => {
  const lines = String(txt || '')
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

export const attrs = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replaceAll('"', '&quot;')}"`))
    .join('\n  ');

export const buildDocsHtml = args => {
  const labelCol = Number.isFinite(Number(args.labelCol)) ? Number(args.labelCol) : 2;
  const inputCol = Number.isFinite(Number(args.inputCol)) ? Number(args.inputCol) : 10;

  const placeholder = (args.placeholder && String(args.placeholder).trim()) || args.dateFormat || 'YYYY-MM-DD';
  const icon = (args.icon && String(args.icon).trim()) || 'fas fa-calendar-alt';
  const shouldPrintInputId = args.inputId !== undefined && args.inputId !== null && String(args.inputId).trim() !== '';

  const attributeBlock = attrs(
    [
      ['calendar', !!args.calendar],
      ['plumage', !!args.plumage],
      ['disabled', !!args.disabled],
      ['required', !!args.required],
      ['validation', !!args.validationAttr],
      ['prepend', !!args.prepend],
      ['append', !!args.append],

      ['form-layout', args.formLayout],
      ['size', args.size],
      ['label-align', args.labelAlign],
      ['label-hidden', !!args.labelHidden],
      ['label', args.label],
      ['label-size', args.labelSize],

      ['label-col', args.formLayout === 'horizontal' ? labelCol : args.labelCol],
      ['input-col', args.formLayout === 'horizontal' ? inputCol : args.inputCol],
      ['label-cols', args.labelCols],
      ['input-cols', args.inputCols],

      ['date-format', args.dateFormat],
      ['placeholder', placeholder],
      ['autocomplete', args.autocomplete],
      [shouldPrintInputId ? 'input-id' : '', shouldPrintInputId ? args.inputId : ''],
      ['icon', icon],

      ['validation-message', args.validationMessage],
      ['warning-message', args.warningMessage],

      ['display-context-examples', !!args.displayContextExamples],
    ].filter(([k]) => !!k),
  );

  return normalize(`
<datepicker-component
  ${attributeBlock}
></datepicker-component>
`);
};

export const setBoolAttr = (el, name, on) => {
  if (on) el.setAttribute(name, '');
  else el.removeAttribute(name);
};

export const buildEl = (args, action) => {
  const el = document.createElement('datepicker-component');

  setBoolAttr(el, 'calendar', !!args.calendar);
  setBoolAttr(el, 'plumage', !!args.plumage);
  setBoolAttr(el, 'disabled', !!args.disabled);
  setBoolAttr(el, 'required', !!args.required);
  setBoolAttr(el, 'validation', !!args.validationAttr);
  setBoolAttr(el, 'prepend', !!args.prepend);
  setBoolAttr(el, 'append', !!args.append);

  if (typeof args.formLayout === 'string') el.formLayout = args.formLayout;
  if (typeof args.size === 'string') el.size = args.size;

  if (args.inputId !== undefined && args.inputId !== null && String(args.inputId).trim() !== '') {
    el.inputId = args.inputId;
  }

  el.label = args.label;
  el.labelHidden = !!args.labelHidden;
  el.labelAlign = args.labelAlign || '';
  el.labelSize = args.labelSize || '';
  el.icon = args.icon || 'fas fa-calendar-alt';

  el.dateFormat = args.dateFormat;
  el.placeholder = args.placeholder;
  el.autocomplete = args.autocomplete || 'off';

  el.labelCol = Number(args.labelCol ?? 2);
  el.inputCol = Number(args.inputCol ?? 10);
  el.labelCols = args.labelCols || '';
  el.inputCols = args.inputCols || '';

  el.validationMessage = args.validationMessage || '';
  el.warningMessage = args.warningMessage || '';

  el.displayContextExamples = !!args.displayContextExamples;

  if (typeof args.dropdownOpen === 'boolean') {
    el.dropdownOpen = args.dropdownOpen;
  }

  if (typeof action === 'function') {
    el.addEventListener('date-selected', e => action('date-selected')(e.detail));
  }

  return el;
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

export function safeAttrSelectorValue(v) {
  return String(v || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function resolveIdsWithin(host, ids) {
  const res = {};
  for (const id of ids) {
    const node = host.querySelector(`[id="${safeAttrSelectorValue(id)}"]`);
    res[id] = !!node;
  }
  return res;
}

export function snapshotA11y(host) {
  const input = host.querySelector('input.form-control');
  const label = host.querySelector('label.form-control-label');
  const toggle = host.querySelector('button.calendar-button');
  const dialog = host.querySelector('.dropdown-content');
  const grid = host.querySelector('.calendar-grid');
  const help = host.querySelector('[id$="__desc"]');
  const validation = host.querySelector('[id$="__validation"]');

  const describedByIds = input ? splitIds(input.getAttribute('aria-describedby')) : [];
  const labelledByIds = input ? splitIds(input.getAttribute('aria-labelledby')) : [];

  return {
    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.getAttribute('id') || '',
          role: input.getAttribute('role') || '',
          ...pickAttrs(input, ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid', 'required', 'autocomplete']),
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
          role: label.getAttribute('role') || '',
        }
      : null,
    helpText: help
      ? {
          id: help.getAttribute('id') || '',
          insideDialog: !!(dialog && dialog.contains(help)),
        }
      : null,
    validation: validation
      ? {
          id: validation.getAttribute('id') || '',
          ...pickAttrs(validation, ['aria-live', 'aria-atomic']),
          text: (validation.textContent || '').trim(),
        }
      : null,
    toggle: toggle
      ? {
          tag: toggle.tagName.toLowerCase(),
          id: toggle.getAttribute('id') || '',
          role: toggle.getAttribute('role') || '',
          ...pickAttrs(toggle, ['aria-label', 'aria-haspopup', 'aria-expanded', 'aria-controls', 'disabled']),
        }
      : null,
    dialog: dialog
      ? {
          tag: dialog.tagName.toLowerCase(),
          id: dialog.getAttribute('id') || '',
          role: dialog.getAttribute('role') || '',
          ...pickAttrs(dialog, ['aria-modal', 'aria-labelledby']),
        }
      : null,
    calendarGrid: grid
      ? {
          tag: grid.tagName.toLowerCase(),
          id: grid.getAttribute('id') || '',
          role: grid.getAttribute('role') || '',
          ...pickAttrs(grid, ['aria-label']),
        }
      : null,
  };
}

export function renderMatrixRow({ title, args, idSuffix, forceInvalid = false, buildEl, action }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const el = buildEl(
    {
      ...args,
      inputId: `datepicker-matrix-${idSuffix}`,
    },
    action,
  );

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
    const snap = snapshotA11y(el);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (forceInvalid) {
        const input = el.querySelector('input.form-control');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('blur', { bubbles: true }));
        }
      }
      requestAnimationFrame(update);
    });
  });

  return wrap;
}
