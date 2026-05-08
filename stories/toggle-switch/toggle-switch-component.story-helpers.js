export const sampleMulti = [
  { id: 'wifi', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
  { id: 'bt', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
  { id: 'air', label: 'Airplane Mode', value: 'air', disabled: false },
];

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

export const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${esc(v)}"`))
    .join('\n    ');

export const jsonAttrLine = (name, obj) => {
  if (!obj || typeof obj !== 'object') return '';
  let json = '{}';

  try {
    json = JSON.stringify(obj);
  } catch (_e) {
    json = '{}';
  }

  json = json.replace(/'/g, '&#39;');
  return `${name}='${json}'`;
};

export const buildDocsHtml = (args) => {
  const id = (args.inputId && String(args.inputId).trim()) || 'toggle-demo';
  const hasNewToggleTxt = args.newToggleTxt && typeof args.newToggleTxt === 'object';
  const hasSwitchesArray = !!args.switches && Array.isArray(args.switchesArray);

  const newToggleTxtLine = hasNewToggleTxt ? jsonAttrLine('new-toggle-txt', args.newToggleTxt) : '';

  const switchesScript = hasSwitchesArray
    ? normalize(`
<script>
  (function () {
    var el = document.getElementById('${esc(id)}');
    if (!el) return;
    el.switchesArray = ${JSON.stringify(args.switchesArray || [])};
  })();
</script>
`)
    : '';

  return normalize(`
<div${Number.isFinite(args.demoWidth) ? ` style="max-width:${args.demoWidth}px"` : ''}>
  <toggle-switch-component
    ${attrLines([
      ['id', id],
      ['input-id', id],
      ['label-txt', args.labelTxt],
      ['size', args.size],
      ['value', args.value],
      ['validation-message', args.validationMessage],
      ['checked', !!args.checked],
      ['custom-switch', !!args.customSwitch],
      ['disabled', !!args.disabled],
      ['inline', !!args.inline],
      ['required', !!args.required],
      ['switches', !!args.switches],
      ['toggle-txt', !!args.toggleTxt],
      ['validation', !!args.validation],
      ['aria-label', args.ariaLabel],
      ['aria-labelledby', args.ariaLabelledby],
    ])}
    ${newToggleTxtLine ? newToggleTxtLine : ''}
  ></toggle-switch-component>
  ${switchesScript ? switchesScript.replace(/\n/g, '\n  ') : ''}
</div>
`);
};

export const renderToggle = (args) => {
  const wrap = document.createElement('div');
  if (Number.isFinite(args.demoWidth)) wrap.style.maxWidth = `${args.demoWidth}px`;

  const title = document.createElement('div');
  title.style.marginBottom = '10px';
  title.style.fontSize = '.875rem';
  title.style.color = 'var(--sbtext, #444)';
  title.textContent = `${args.customSwitch ? 'Custom switch' : 'Bootstrap switch'}${args.switches ? ' (multi)' : ' (single)'} demo`;

  const el = document.createElement('toggle-switch-component');
  const id = (args.inputId && String(args.inputId).trim()) || `toggle-${Math.random().toString(36).slice(2)}`;

  el.id = id;
  el.setAttribute('input-id', id);

  if (args.labelTxt != null) el.setAttribute('label-txt', String(args.labelTxt));
  if (args.size) el.setAttribute('size', args.size);
  if (args.value) el.setAttribute('value', args.value);
  if (args.validationMessage) el.setAttribute('validation-message', args.validationMessage);

  if (args.ariaLabel != null && String(args.ariaLabel).trim()) el.setAttribute('aria-label', String(args.ariaLabel));
  else el.removeAttribute('aria-label');

  if (args.ariaLabelledby != null && String(args.ariaLabelledby).trim()) el.setAttribute('aria-labelledby', String(args.ariaLabelledby));
  else el.removeAttribute('aria-labelledby');

  if (args.checked) el.setAttribute('checked', '');
  else el.removeAttribute('checked');

  if (args.customSwitch) el.setAttribute('custom-switch', '');
  else el.removeAttribute('custom-switch');

  if (args.disabled) el.setAttribute('disabled', '');
  else el.removeAttribute('disabled');

  if (args.inline) el.setAttribute('inline', '');
  else el.removeAttribute('inline');

  if (args.required) el.setAttribute('required', '');
  else el.removeAttribute('required');

  if (args.switches) el.setAttribute('switches', '');
  else el.removeAttribute('switches');

  if (args.toggleTxt) el.setAttribute('toggle-txt', '');
  else el.removeAttribute('toggle-txt');

  if (args.validation) el.setAttribute('validation', '');
  else el.removeAttribute('validation');

  if (args.newToggleTxt && typeof args.newToggleTxt === 'object') {
    try {
      el.setAttribute('new-toggle-txt', JSON.stringify(args.newToggleTxt));
    } catch (_e) {
      // no-op
    }
  } else {
    el.removeAttribute('new-toggle-txt');
  }

  el.switchesArray = args.switches ? (Array.isArray(args.switchesArray) ? args.switchesArray : []) : [];

  let pre = null;

  if (args.showEventLog) {
    const box = document.createElement('div');
    box.style.marginTop = '12px';

    const strong = document.createElement('strong');
    strong.textContent = 'checkedChanged event:';

    pre = document.createElement('pre');
    pre.style.background = '#f7f7f8';
    pre.style.padding = '8px';
    pre.style.borderRadius = '6px';
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.margin = '6px 0 0';
    pre.textContent = '(click toggle)';

    box.appendChild(strong);
    box.appendChild(pre);

    wrap.appendChild(title);
    wrap.appendChild(el);
    wrap.appendChild(box);
  } else {
    wrap.appendChild(title);
    wrap.appendChild(el);
  }

  if (!el._wiredStory) {
    el._wiredStory = true;

    el.addEventListener('checkedChanged', (ev) => {
      const detail = ev?.detail;

      if (pre) {
        try {
          pre.textContent = JSON.stringify(detail, null, 2);
        } catch {
          pre.textContent = String(detail);
        }
      }

      if (detail && typeof detail.checked === 'boolean') {
        el.checked = detail.checked;
        if (detail.checked) el.setAttribute('checked', '');
        else el.removeAttribute('checked');
      }
    });
  }

  return wrap;
};

export const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

export const resolveId = (root, id) => {
  if (!id) return false;
  try {
    return !!root.querySelector(`#${CSS.escape(id)}`);
  } catch {
    return false;
  }
};

export const getSingleSnapshot = (root, host) => {
  const input = host.querySelector('input[type="checkbox"]');
  const label = input ? host.querySelector(`label[for="${CSS.escape(input.id)}"]`) : null;
  const described = input?.getAttribute('aria-describedby') || null;

  return {
    mode: 'single',
    host: {
      inputIdAttr: host.getAttribute('input-id') || null,
      custom: host.hasAttribute('custom-switch'),
    },
    input: input
      ? {
          id: input.id || null,
          type: input.getAttribute('type'),
          role: input.getAttribute('role'),
          ariaLabel: input.getAttribute('aria-label'),
          ariaChecked: input.getAttribute('aria-checked'),
          ariaDisabled: input.getAttribute('aria-disabled'),
          ariaRequired: input.getAttribute('aria-required'),
          ariaInvalid: input.getAttribute('aria-invalid'),
          ariaDescribedby: described,
          describedbyIds: splitIds(described),
          describedbyAllResolve: splitIds(described).every((id) => resolveId(root, id)),
        }
      : null,
    label: label
      ? {
          text: label.textContent?.trim() || null,
          for: label.getAttribute('for') || null,
        }
      : null,
    validation: (() => {
      if (!described) return null;
      const ids = splitIds(described);
      const nodes = ids.map((id) => root.querySelector(`#${CSS.escape(id)}`)).filter(Boolean);

      return nodes.map((n) => ({
        id: n.getAttribute('id'),
        role: n.getAttribute('role'),
        ariaLive: n.getAttribute('aria-live'),
        text: (n.textContent || '').trim() || null,
      }));
    })(),
  };
};

export const getMultiSnapshot = (root, host) => {
  const group = host.querySelector('[role="group"]');
  const inputs = Array.from(host.querySelectorAll('input[type="checkbox"]'));

  const groupLabelledby = group?.getAttribute('aria-labelledby') || null;
  const groupDescribedby = group?.getAttribute('aria-describedby') || null;

  return {
    mode: 'multi',
    host: {
      inputIdAttr: host.getAttribute('input-id') || null,
      inline: host.hasAttribute('inline'),
      custom: host.hasAttribute('custom-switch'),
    },
    group: group
      ? {
          id: group.getAttribute('id') || null,
          role: group.getAttribute('role'),
          ariaLabelledby: groupLabelledby,
          ariaInvalid: group.getAttribute('aria-invalid'),
          ariaDescribedby: groupDescribedby,
          labelledbyIds: splitIds(groupLabelledby),
          labelledbyAllResolve: splitIds(groupLabelledby).every((id) => resolveId(root, id)),
          describedbyIds: splitIds(groupDescribedby),
          describedbyAllResolve: splitIds(groupDescribedby).every((id) => resolveId(root, id)),
        }
      : null,
    items: inputs.map((input) => {
      const label = host.querySelector(`label[for="${CSS.escape(input.id)}"]`);
      const described = input.getAttribute('aria-describedby') || null;

      return {
        id: input.id || null,
        role: input.getAttribute('role'),
        ariaChecked: input.getAttribute('aria-checked'),
        ariaDisabled: input.getAttribute('aria-disabled'),
        ariaRequired: input.getAttribute('aria-required'),
        ariaInvalid: input.getAttribute('aria-invalid'),
        ariaDescribedby: described,
        describedbyIds: splitIds(described),
        describedbyAllResolve: splitIds(described).every((id) => resolveId(root, id)),
        label: label ? (label.textContent || '').trim() : null,
      };
    }),
  };
};

export const snapshotA11y = (root, host) => {
  const isMulti = host.hasAttribute('switches');
  return isMulti ? getMultiSnapshot(root, host) : getSingleSnapshot(root, host);
};

export const mountToggle = (args) => {
  const el = document.createElement('toggle-switch-component');
  const id = (args.inputId && String(args.inputId).trim()) || `mx-${Math.random().toString(36).slice(2)}`;

  el.id = id;
  el.setAttribute('input-id', id);

  if (args.labelTxt != null) el.setAttribute('label-txt', String(args.labelTxt));
  if (args.size) el.setAttribute('size', args.size);
  if (args.value) el.setAttribute('value', args.value);
  if (args.validationMessage) el.setAttribute('validation-message', args.validationMessage);

  if (args.ariaLabel != null && String(args.ariaLabel).trim()) el.setAttribute('aria-label', String(args.ariaLabel));
  else el.removeAttribute('aria-label');

  if (args.ariaLabelledby != null && String(args.ariaLabelledby).trim()) el.setAttribute('aria-labelledby', String(args.ariaLabelledby));
  else el.removeAttribute('aria-labelledby');

  if (args.checked) el.setAttribute('checked', '');
  if (args.customSwitch) el.setAttribute('custom-switch', '');
  if (args.disabled) el.setAttribute('disabled', '');
  if (args.inline) el.setAttribute('inline', '');
  if (args.required) el.setAttribute('required', '');
  if (args.switches) el.setAttribute('switches', '');
  if (args.toggleTxt) el.setAttribute('toggle-txt', '');
  if (args.validation) el.setAttribute('validation', '');

  if (args.newToggleTxt && typeof args.newToggleTxt === 'object') {
    try {
      el.setAttribute('new-toggle-txt', JSON.stringify(args.newToggleTxt));
    } catch (_e) {
      // no-op
    }
  }

  el.switchesArray = args.switches ? (Array.isArray(args.switchesArray) ? args.switchesArray : []) : [];
  return el;
};
