// File: stories/date-range-time-picker-component.story-helpers.js

import { action } from '@storybook/addon-actions';

export const normalize = txt => {
  const lines = String(txt ?? '')
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

  while (output[0] === '') {
    output.shift();
  }

  while (output[output.length - 1] === '') {
    output.pop();
  }

  return output.join('\n');
};

export const attrs = pairs =>
  pairs
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== false,
    )
    .map(([key, value]) =>
      value === true
        ? key
        : `${key}="${String(value).replace(
            /"/g,
            '&quot;',
          )}"`,
    )
    .join('\n  ');

export const asNumOrUndef = value => {
  if (
    value === '' ||
    value === null ||
    value === undefined
  ) {
    return undefined;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue)
    ? numericValue
    : undefined;
};

export const esc = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const buildDocsHtml = args => {
  const attributeBlock = attrs([
    ['plumage', !!args.plumage],
    ['range-time-picker', !!args.rangeTimePicker],
    ['disabled', !!args.disabled],
    ['read-only', !!args.readOnly],
    ['required', !!args.required],

    ['date-format', args.dateFormat],
    [
      'is-twenty-four-hour-format',
      !!args.isTwentyFourHourFormat,
    ],
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
    ['value', args.value],
  ]);

  return normalize(`
<date-range-time-picker-component
  ${attributeBlock}
></date-range-time-picker-component>
`);
};

export const pickAttrs = (element, names) => {
  const output = {};

  if (!element) {
    return output;
  }

  for (const name of names) {
    const value = element.getAttribute(name);

    if (value !== null && value !== '') {
      output[name] = value;
    }
  }

  return output;
};

export const splitIds = value =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export const resolveIdsWithin = (host, ids) => {
  const result = {};

  for (const id of ids) {
    const safe = String(id)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"');

    result[id] = !!host.querySelector(
      `[id="${safe}"]`,
    );
  }

  return result;
};

export const collectIds = root => {
  const ids = Array.from(root.querySelectorAll('[id]'))
    .map(node => node.id)
    .filter(Boolean);

  const counts = new Map();

  for (const id of ids) {
    counts.set(id, (counts.get(id) || 0) + 1);
  }

  const duplicates = Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({
      id,
      count,
    }));

  return {
    total: ids.length,
    unique: counts.size,
    duplicates,
  };
};

export const buildDateRangeTimePickerEl = args => {
  const element = document.createElement(
    'date-range-time-picker-component',
  );

  element.plumage = !!args.plumage;
  element.rangeTimePicker = !!args.rangeTimePicker;
  element.disabled = !!args.disabled;
  element.readOnly = !!args.readOnly;
  element.required = !!args.required;

  element.dateFormat =
    args.dateFormat || 'YYYY-MM-DD';

  element.isTwentyFourHourFormat =
    !!args.isTwentyFourHourFormat;

  element.showDuration = !!args.showDuration;
  element.showYmd = !!args.showYmd;
  element.showLong = !!args.showLong;
  element.showIso = !!args.showIso;

  if (args.placeholder) {
    element.placeholder = args.placeholder;
  }

  element.joinBy = args.joinBy || ' - ';
  element.icon =
    args.icon || 'fas fa-calendar-alt';

  element.inputId =
    args.inputId || 'date-range-time';

  element.appendProp = !!args.appendProp;
  element.prependProp = !!args.prependProp;
  element.appendId = args.appendId || '';
  element.prependId = args.prependId || '';

  element.label =
    args.label || 'Date and Time Picker';

  element.labelAlign = args.labelAlign || '';
  element.labelHidden = !!args.labelHidden;
  element.formLayout = args.formLayout || '';
  element.size = args.size || '';

  if (asNumOrUndef(args.labelCol) !== undefined) {
    element.labelCol = Number(args.labelCol);
  }

  if (asNumOrUndef(args.inputCol) !== undefined) {
    element.inputCol = Number(args.inputCol);
  }

  element.labelCols = args.labelCols || '';
  element.inputCols = args.inputCols || '';

  element.validation = !!args.validation;

  element.validationMessage =
    args.validationMessage || 'Required field';

  element.warningMessage =
    args.warningMessage || '';

  element.showOkButton = !!args.showOkButton;
  element.ariaLabel = args.ariaLabel || '';
  element.value = args.value || '';

  element.addEventListener(
    'date-time-updated',
    event =>
      action('date-time-updated')(event.detail),
  );

  return element;
};

export const Template = args =>
  buildDateRangeTimePickerEl(args);

export const snapshotDRTPA11y = host => {
  const input = host.querySelector(
    'input.form-control',
  );

  const label = host.querySelector(
    'label.form-control-label',
  );

  const toggle = host.querySelector(
    '.calendar-button, button.btn.input-group-text',
  );

  const dialog = host.querySelector(
    '.dropdown-content',
  );

  const validation = host.querySelector(
    '.invalid-feedback.validation, .invalid-feedback.warning, .invalid-feedback',
  );

  const describedByIds = input
    ? splitIds(input.getAttribute('aria-describedby'))
    : [];

  const labelledByIds = input
    ? splitIds(input.getAttribute('aria-labelledby'))
    : [];

  return {
    host: {
      tag: host.tagName.toLowerCase(),
      id: host.id || null,
      role: host.getAttribute('role') || null,
      ...pickAttrs(host, [
        'value',
        'aria-label',
        'aria-labelledby',
        'aria-describedby',
      ]),
      properties: {
        value: host.value || '',
        readOnly: !!host.readOnly,
        disabled: !!host.disabled,
      },
    },

    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.id || null,
          role: input.getAttribute('role') || null,
          value: input.value || '',
          ...pickAttrs(input, [
            'name',
            'type',
            'autocomplete',
            'required',
            'readonly',
            'disabled',
            'aria-label',
            'aria-labelledby',
            'aria-describedby',
            'aria-invalid',
            'aria-readonly',
            'aria-disabled',
          ]),
          properties: {
            value: input.value || '',
            readOnly: input.readOnly,
            disabled: input.disabled,
          },
          resolves: {
            'aria-labelledby': resolveIdsWithin(
              host,
              labelledByIds,
            ),
            'aria-describedby': resolveIdsWithin(
              host,
              describedByIds,
            ),
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
          ...pickAttrs(toggle, [
            'aria-label',
            'aria-haspopup',
            'aria-expanded',
            'aria-controls',
            'disabled',
          ]),
        }
      : null,

    dialog: dialog
      ? {
          tag: dialog.tagName.toLowerCase(),
          id: dialog.id || null,
          role: dialog.getAttribute('role') || null,
          ...pickAttrs(dialog, [
            'aria-modal',
            'aria-labelledby',
            'aria-describedby',
          ]),
        }
      : null,

    validation: validation
      ? {
          tag: validation.tagName.toLowerCase(),
          id: validation.id || null,
          ...pickAttrs(validation, [
            'aria-live',
            'aria-atomic',
          ]),
          text:
            validation.textContent?.trim() || null,
        }
      : null,

    controls: {
      calendarToggleRendered: !!toggle,
      clearButtonRendered: !!host.querySelector(
        '.clear-input-button',
      ),
    },

    ids: collectIds(host),
  };
};

export const renderDRTPMatrixRow = ({
  title,
  args,
  idSuffix,
}) => {
  const wrapper = document.createElement('div');

  wrapper.style.border = '1px solid #ddd';
  wrapper.style.borderRadius = '12px';
  wrapper.style.padding = '12px';
  wrapper.style.display = 'grid';
  wrapper.style.gap = '10px';

  const heading = document.createElement('div');

  heading.style.fontWeight = '700';
  heading.textContent = title;

  const element = buildDateRangeTimePickerEl({
    ...args,
    inputId: `drtp-matrix-${idSuffix}`,
  });

  const stage = document.createElement('div');

  stage.style.maxWidth = '560px';

  const output = document.createElement('pre');

  output.style.margin = '0';
  output.style.padding = '10px';
  output.style.background = '#f6f8fa';
  output.style.borderRadius = '10px';
  output.style.overflowX = 'auto';
  output.style.fontSize = '12px';
  output.textContent =
    'Collecting aria/role/id…';

  stage.appendChild(element);
  wrapper.appendChild(heading);
  wrapper.appendChild(stage);
  wrapper.appendChild(output);

  const update = () => {
    output.textContent = JSON.stringify(
      snapshotDRTPA11y(element),
      null,
      2,
    );
  };

  requestAnimationFrame(() =>
    requestAnimationFrame(update),
  );

  return wrapper;
};
