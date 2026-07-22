// File: src/stories/datepicker-component.story-helpers.js

export const normalize = txt => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.replace(/[ \t]+$/g, ''));

  const output = [];
  let previousBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';

    if (blank) {
      if (previousBlank) continue;

      previousBlank = true;
      output.push('');
      continue;
    }

    previousBlank = false;
    output.push(line);
  }

  while (output[0] === '') output.shift();
  while (output[output.length - 1] === '') output.pop();

  return output.join('\n');
};

export const attrs = pairs =>
  pairs
    .filter(([, value]) => value !== undefined && value !== null && value !== '' && value !== false)
    .map(([key, value]) => (value === true ? key : `${key}="${String(value).replaceAll('"', '&quot;')}"`))
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
      ['read-only', !!args.readOnly],
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
      ['value', args.value],
      ['autocomplete', args.autocomplete],
      [shouldPrintInputId ? 'input-id' : '', shouldPrintInputId ? args.inputId : ''],
      ['icon', icon],

      ['validation-message', args.validationMessage],
      ['warning-message', args.warningMessage],

      ['display-context-examples', !!args.displayContextExamples],
    ].filter(([key]) => !!key),
  );

  return normalize(`
<datepicker-component
  ${attributeBlock}
></datepicker-component>
`);
};

export const buildDocsHtmlControlledValue = () =>
  normalize(`
<datepicker-component
  id="controlled-datepicker"
  input-id="datepicker-controlled"
  label="Controlled Date"
  date-format="YYYY-MM-DD"
  placeholder="YYYY-MM-DD"
  value="2026-07-20"
></datepicker-component>

<div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
  <button type="button" id="load-july-20">
    Set 2026-07-20
  </button>

  <button type="button" id="load-aug-15">
    Set 2026-08-15
  </button>

  <button type="button" id="clear-date">
    Clear
  </button>
</div>

<script>
  const datepicker = document.querySelector(
    '#controlled-datepicker'
  );

  const valueState = {
    value: '2026-07-20',
  };

  const eventDetailToValue = (detail) => {
    if (typeof detail === 'string') {
      return detail;
    }

    if (!detail || typeof detail !== 'object') {
      return '';
    }

    if (typeof detail.value === 'string') {
      return detail.value;
    }

    if (typeof detail.date === 'string') {
      return detail.date;
    }

    return '';
  };

  const sync = () => {
    datepicker.value = valueState.value;
  };

  document
    .querySelector('#load-july-20')
    .addEventListener('click', () => {
      valueState.value = '2026-07-20';
      sync();
    });

  document
    .querySelector('#load-aug-15')
    .addEventListener('click', () => {
      valueState.value = '2026-08-15';
      sync();
    });

  document
    .querySelector('#clear-date')
    .addEventListener('click', () => {
      valueState.value = '';
      sync();
    });

  datepicker.addEventListener(
    'date-selected',
    (event) => {
      const emittedValue =
        eventDetailToValue(event.detail);

      const nextValue =
        emittedValue ||
        String(datepicker.value || '').trim();

      if (!nextValue) {
        return;
      }

      valueState.value = nextValue;
      sync();
    }
  );
</script>
`);

export const setBoolAttr = (element, name, on) => {
  if (on) {
    element.setAttribute(name, '');
  } else {
    element.removeAttribute(name);
  }
};

export const setAttr = (element, name, value) => {
  if (value === undefined || value === null || value === '') {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, String(value));
};

export const setDateValueWhenReady = async (element, value) => {
  if (typeof element?.componentOnReady === 'function') {
    await element.componentOnReady();
  } else if (window.customElements?.whenDefined) {
    await customElements.whenDefined('datepicker-component');
  }

  element.value = typeof value === 'string' ? value : '';
};

export const updateArgsBestEffort = (ctx, updatedArgs) => {
  if (typeof ctx?.updateArgs === 'function') {
    try {
      ctx.updateArgs(updatedArgs);
      return;
    } catch (_error) {}
  }

  try {
    const channel = window.__STORYBOOK_ADDONS_CHANNEL__ || window.__STORYBOOK_PREVIEW__?.addons?.getChannel?.() || window.__STORYBOOK_ADDONS?.getChannel?.();

    const storyId = ctx?.id;
    if (!channel || !storyId) return;

    channel.emit('updateStoryArgs', { storyId, updatedArgs });
    channel.emit('UPDATE_STORY_ARGS', { storyId, updatedArgs });
  } catch (_error) {}
};

export const buildEl = (args, action) => {
  const element = document.createElement('datepicker-component');

  setBoolAttr(element, 'calendar', !!args.calendar);
  setBoolAttr(element, 'plumage', !!args.plumage);
  setBoolAttr(element, 'disabled', !!args.disabled);
  setBoolAttr(element, 'read-only', !!args.readOnly);
  setBoolAttr(element, 'required', !!args.required);
  setBoolAttr(element, 'validation', !!args.validationAttr);
  setBoolAttr(element, 'prepend', !!args.prepend);
  setBoolAttr(element, 'append', !!args.append);

  if (typeof args.formLayout === 'string') {
    element.formLayout = args.formLayout;
  }

  if (typeof args.size === 'string') {
    element.size = args.size;
  }

  if (args.inputId !== undefined && args.inputId !== null && String(args.inputId).trim() !== '') {
    element.inputId = args.inputId;
  }

  element.label = args.label;
  element.labelHidden = !!args.labelHidden;
  element.labelAlign = args.labelAlign || '';
  element.labelSize = args.labelSize || '';
  element.icon = args.icon || 'fas fa-calendar-alt';

  element.dateFormat = args.dateFormat;
  element.placeholder = args.placeholder;
  element.value = args.value || '';
  element.autocomplete = args.autocomplete || 'off';

  element.labelCol = Number(args.labelCol ?? 2);
  element.inputCol = Number(args.inputCol ?? 10);
  element.labelCols = args.labelCols || '';
  element.inputCols = args.inputCols || '';

  element.validationMessage = args.validationMessage || '';

  element.warningMessage = args.warningMessage || '';

  element.displayContextExamples = !!args.displayContextExamples;

  if (typeof args.dropdownOpen === 'boolean') {
    element.dropdownOpen = args.dropdownOpen;
  }

  setAttr(element, 'value', args.value);

  if (typeof action === 'function') {
    element.addEventListener('date-selected', event => action('date-selected')(event.detail));
  }

  return element;
};

export function pickAttrs(element, names) {
  const output = {};

  for (const name of names) {
    const value = element.getAttribute(name);

    if (value !== null && value !== '') {
      output[name] = value;
    }
  }

  return output;
}

export function splitIds(value) {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function safeAttrSelectorValue(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

export function resolveIdsWithin(host, ids) {
  const result = {};

  for (const id of ids) {
    const node = host.querySelector(`[id="${safeAttrSelectorValue(id)}"]`);

    result[id] = !!node;
  }

  return result;
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
    host: {
      tag: host.tagName.toLowerCase(),
      value: host.value || '',
      ...pickAttrs(host, ['value', 'disabled', 'read-only']),
      properties: {
        value: host.value || '',
        disabled: !!host.disabled,
        readOnly: !!host.readOnly,
      },
    },

    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.getAttribute('id') || '',
          role: input.getAttribute('role') || '',
          value: input.value || '',
          ...pickAttrs(input, [
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
            'aria-invalid',
            'aria-disabled',
            'aria-readonly',
            'required',
            'autocomplete',
            'readonly',
            'disabled',
          ]),
          properties: {
            value: input.value || '',
            disabled: input.disabled,
            readOnly: input.readOnly,
          },
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
  const wrapper = document.createElement('div');

  wrapper.style.border = '1px solid #ddd';
  wrapper.style.borderRadius = '12px';
  wrapper.style.padding = '12px';
  wrapper.style.display = 'grid';
  wrapper.style.gap = '10px';

  const heading = document.createElement('div');

  heading.style.fontWeight = '700';
  heading.textContent = title;

  const element = buildEl(
    {
      ...args,
      inputId: `datepicker-matrix-${idSuffix}`,
    },
    action,
  );

  const stage = document.createElement('div');

  stage.style.maxWidth = '560px';

  const output = document.createElement('pre');

  output.style.margin = '0';
  output.style.padding = '10px';
  output.style.background = '#f6f8fa';
  output.style.borderRadius = '10px';
  output.style.overflowX = 'auto';
  output.style.fontSize = '12px';
  output.textContent = 'Collecting aria/role/id…';

  stage.appendChild(element);
  wrapper.appendChild(heading);
  wrapper.appendChild(stage);
  wrapper.appendChild(output);

  const update = () => {
    const snapshot = snapshotA11y(element);

    output.textContent = JSON.stringify(snapshot, null, 2);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (forceInvalid) {
        const input = element.querySelector('input.form-control');

        if (input) {
          input.value = '';
          input.dispatchEvent(
            new Event('blur', {
              bubbles: true,
            }),
          );
        }
      }

      requestAnimationFrame(update);
    });
  });

  return wrapper;
}
