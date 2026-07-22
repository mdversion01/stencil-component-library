// File: src/stories/date-range-picker-component/date-range-picker-component.story-helpers.js

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
      if (previousBlank) {
        continue;
      }

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
    .filter(([, value]) => value !== undefined && value !== null && value !== '' && value !== false)
    .map(([key, value]) => (value === true ? key : `${key}="${String(value).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

export const asNumOrUndef = value => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
};

export const buildDocsHtml = args => {
  const attributeBlock = attrs([
    ['plumage', !!args.plumage],
    ['range-picker', !!args.rangePicker],
    ['disabled', !!args.disabled],
    ['read-only', !!args.readOnly],
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

export const buildDocsHtmlControlledValue = () =>
  normalize(`
<date-range-picker-component
  id="controlled-drp"
  input-id="controlled-drp"
  label="Controlled Date Range"
  date-format="YYYY-MM-DD"
  join-by=" - "
  value="2026-07-20 - 2026-07-25"
></date-range-picker-component>

<div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
  <button type="button" id="set-july-range">
    Set July Range
  </button>

  <button type="button" id="set-august-range">
    Set August Range
  </button>

  <button type="button" id="clear-range">
    Clear
  </button>
</div>

<script>
  const picker = document.querySelector(
    '#controlled-drp'
  );

  const valueState = {
    value: '2026-07-20 - 2026-07-25',
  };

  const getJoinBy = () =>
    picker.joinBy || ' - ';

  const eventDetailToValue = (detail) => {
    if (typeof detail === 'string') {
      return detail;
    }

    if (!detail || typeof detail !== 'object') {
      return '';
    }

    if (
      picker.showIso &&
      typeof detail.startDateIso === 'string' &&
      typeof detail.endDateIso === 'string'
    ) {
      return (
        detail.startDateIso +
        getJoinBy() +
        detail.endDateIso
      );
    }

    if (
      typeof detail.startDate !== 'string' ||
      typeof detail.endDate !== 'string'
    ) {
      return '';
    }

    return (
      detail.startDate +
      getJoinBy() +
      detail.endDate
    );
  };

  const sync = () => {
    picker.value = valueState.value;
  };

  document
    .querySelector('#set-july-range')
    .addEventListener('click', () => {
      valueState.value =
        '2026-07-20 - 2026-07-25';

      sync();
    });

  document
    .querySelector('#set-august-range')
    .addEventListener('click', () => {
      valueState.value =
        '2026-08-01 - 2026-08-10';

      sync();
    });

  document
    .querySelector('#clear-range')
    .addEventListener('click', () => {
      valueState.value = '';
      sync();
    });

  picker.addEventListener(
    'date-range-updated',
    (event) => {
      const nextValue = eventDetailToValue(
        event.detail
      );

      if (!nextValue) {
        return;
      }

      valueState.value = nextValue;
      sync();
    }
  );
</script>
`);

export const setAttr = (element, name, value) => {
  if (value === true) {
    element.setAttribute(name, '');
    return;
  }

  if (value === false || value === null || value === undefined || value === '') {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, String(value));
};

export const setDateRangeValueWhenReady = async (element, value) => {
  if (typeof element?.componentOnReady === 'function') {
    await element.componentOnReady();
  } else if (window.customElements?.whenDefined) {
    await customElements.whenDefined('date-range-picker-component');
  }

  element.value = typeof value === 'string' ? value : '';
};

export const updateArgsBestEffort = (ctx, updatedArgs) => {
  if (typeof ctx?.updateArgs === 'function') {
    try {
      ctx.updateArgs(updatedArgs);
      return;
    } catch (_e) {}
  }

  try {
    const channel =
      window.__STORYBOOK_ADDONS_CHANNEL__ ||
      window.__STORYBOOK_PREVIEW__?.addons?.getChannel?.() ||
      window.__STORYBOOK_ADDONS?.getChannel?.();

    const storyId = ctx?.id;
    if (!channel || !storyId) return;

    channel.emit('updateStoryArgs', { storyId, updatedArgs });
    channel.emit('UPDATE_STORY_ARGS', { storyId, updatedArgs });
  } catch (_e) {}
};

export const buildDateRangePickerEl = args => {
  const element = document.createElement('date-range-picker-component');

  element.plumage = !!args.plumage;
  element.rangePicker = !!args.rangePicker;
  element.disabled = !!args.disabled;
  element.readOnly = !!args.readOnly;
  element.required = !!args.required;

  element.dateFormat = args.dateFormat || 'YYYY-MM-DD';

  element.showYmd = !!args.showYmd;
  element.showLong = !!args.showLong;
  element.showIso = !!args.showIso;

  if (args.placeholder) {
    element.placeholder = args.placeholder;
  }

  element.joinBy = args.joinBy || ' - ';
  element.icon = args.icon || 'fas fa-calendar-alt';

  element.inputId = args.inputId || 'drp';
  element.value = args.value || '';

  element.appendProp = !!args.appendProp;
  element.prependProp = !!args.prependProp;
  element.appendId = args.appendId || '';
  element.prependId = args.prependId || '';

  element.label = args.label || 'Date Range Picker';

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

  element.validationMessage = args.validationMessage || 'Required field';

  element.warningMessage = args.warningMessage || '';

  element.showOkButton = !!args.showOkButton;

  element.ariaLabel = args.ariaLabel || '';

  setAttr(element, 'plumage', !!args.plumage);
  setAttr(element, 'range-picker', !!args.rangePicker);
  setAttr(element, 'disabled', !!args.disabled);
  setAttr(element, 'read-only', !!args.readOnly);
  setAttr(element, 'required', !!args.required);

  setAttr(element, 'date-format', args.dateFormat);
  setAttr(element, 'show-ymd', !!args.showYmd);
  setAttr(element, 'show-long', !!args.showLong);
  setAttr(element, 'show-iso', !!args.showIso);

  setAttr(element, 'placeholder', args.placeholder);
  setAttr(element, 'join-by', args.joinBy);
  setAttr(element, 'icon', args.icon);
  setAttr(element, 'input-id', args.inputId);
  setAttr(element, 'value', args.value);

  setAttr(element, 'append-prop', !!args.appendProp);
  setAttr(element, 'prepend-prop', !!args.prependProp);
  setAttr(element, 'append-id', args.appendId);
  setAttr(element, 'prepend-id', args.prependId);

  setAttr(element, 'label', args.label);
  setAttr(element, 'label-align', args.labelAlign);
  setAttr(element, 'label-hidden', !!args.labelHidden);
  setAttr(element, 'form-layout', args.formLayout);
  setAttr(element, 'size', args.size);

  setAttr(element, 'label-col', asNumOrUndef(args.labelCol));
  setAttr(element, 'input-col', asNumOrUndef(args.inputCol));
  setAttr(element, 'label-cols', args.labelCols);
  setAttr(element, 'input-cols', args.inputCols);

  setAttr(element, 'validation', !!args.validation);
  setAttr(element, 'validation-message', args.validationMessage);
  setAttr(element, 'warning-message', args.warningMessage);

  setAttr(element, 'show-ok-button', !!args.showOkButton);
  setAttr(element, 'aria-label', args.ariaLabel);

  element.addEventListener('date-range-updated', event => action('date-range-updated')(event.detail));

  return element;
};

export const Template = args => buildDateRangePickerEl(args);
