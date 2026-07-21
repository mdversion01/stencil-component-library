// File: src/stories/timepicker-component.story-helpers.js

export const TAG = 'timepicker-component';

export const DocsWrapStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .sbdocs pre,
    .sbdocs pre code {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-x: auto !important;
    }
  `;
  return style;
};

export const normalizeHtml = html => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      out.push('');
      prevBlank = true;
      continue;
    }
    out.push(line);
    prevBlank = false;
  }

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

export const normalizeIdList = v => {
  const s = String(v ?? '').trim();
  if (!s) return '';
  return s.split(/\s+/).filter(Boolean).join(' ');
};

export const boolAttr = (name, on) => (on ? name : null);
export const boolStrAttr = (name, v) => (typeof v === 'boolean' ? `${name}="${v ? 'true' : 'false'}"` : null);
export const attr = (name, v) => (v === undefined || v === null || v === '' ? null : `${name}="${String(v)}"`);

export const buildDocsHtml = args => Template(args);

export const Template = args => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';

  const attrs = [
    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attr('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    boolAttr('disable-timepicker', args.disableTimepicker),
    boolAttr('hide-seconds', args.hideSeconds),
    boolAttr('hide-timepicker-btn', args.hideTimepickerBtn),

    attr('input-id', args.inputId),
    attr('input-name', args.inputName),
    attr('input-width', args.inputWidth),

    attr('value', args.value),

    boolStrAttr('is-twenty-four-hour-format', !!args.isTwentyFourHourFormat),
    boolStrAttr('is-valid', !!args.isValid),
    boolStrAttr('read-only', !!args.readOnly),
    boolStrAttr('time-validation', !!args.timeValidation),

    attr('label-text', args.labelText),
    boolStrAttr('required', !!args.required),
    boolAttr('show-label', args.showLabel),
    attr('size', args.size),
    boolAttr('twelve-hour-only', args.twelveHourOnly),
    boolAttr('twenty-four-hour-only', args.twentyFourHourOnly),
    boolStrAttr('validation', !!args.validation),
    attr('validation-message', args.validationMessage),
    attr('time-input-throttle-ms', args.timeInputThrottleMs),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(`
<div class="timepicker-wrapper"${width ? ` style="width:${width};"` : ''}>
  <${TAG}
    ${attrs}
  ></${TAG}>
</div>
`);
};

export const splitIds = v =>
  String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export const resolveId = (scopeRoot, id) => {
  if (!id) return false;
  try {
    return !!scopeRoot.querySelector(`#${CSS.escape(id)}`);
  } catch {
    return false;
  }
};

export const getSnapshot = (host, scopeRoot) => {
  const input = host?.querySelector?.('input.time-input') || null;
  const label = host?.querySelector?.('label') || null;
  const clearBtn = host?.querySelector?.('button.clear-button') || null;
  const trigger = host?.querySelector?.('button.time-icon-btn') || null;
  const toggleFormatBtn = host?.querySelector?.('button.toggle-format-btn') || null;
  const closeBtn = host?.querySelector?.('button.close-button') || null;
  const dropdown = host?.querySelector?.('.time-dropdown') || null;

  const inputId = host?.inputId ?? host?.getAttribute?.('input-id') ?? null;
  const derived = inputId
    ? {
        label: `${inputId}-label`,
        dropdown: `${inputId}-dropdown`,
        timeValidation: `${inputId}-time-validation`,
        validation: `${inputId}-validation`,
        warning: `${inputId}-warning`,
      }
    : null;

  const timeValidation = derived ? host?.querySelector?.(`#${CSS.escape(derived.timeValidation)}`) || null : null;
  const validation = derived ? host?.querySelector?.(`#${CSS.escape(derived.validation)}`) || null : null;
  const warning = derived ? host?.querySelector?.(`#${CSS.escape(derived.warning)}`) || null : null;

  const hour = host?.querySelector?.('.hour-display') || null;
  const minute = host?.querySelector?.('.minute-display') || null;
  const second = host?.querySelector?.('.second-display') || null;
  const ampm = host?.querySelector?.('.ampm-display') || null;

  const labelledbyIds = splitIds(input?.getAttribute?.('aria-labelledby'));
  const describedbyIds = splitIds(input?.getAttribute?.('aria-describedby'));

  return {
    component: {
      tag: host?.tagName?.toLowerCase?.() ?? null,
      inputId,
      value: host?.value ?? host?.getAttribute?.('value') ?? null,
      isOpen: host?._open ?? null,
      activePart: host?._activePart ?? null,
      isTwentyFourHourFormat: host?.isTwentyFourHourFormat ?? null,
      hideSeconds: host?.hideSeconds ?? null,
      readOnly: host?.readOnly ?? null,
      disableTimepicker: host?.disableTimepicker ?? null,
      isValid: host?.isValid ?? null,
      validation: host?.validation ?? null,
      timeValidation: host?.timeValidation ?? null,
    },
    ids: {
      inputId: input?.getAttribute?.('id') ?? null,
      labelId: label?.getAttribute?.('id') ?? null,
      dropdownId: dropdown?.getAttribute?.('id') ?? null,
      timeValidationId: timeValidation?.getAttribute?.('id') ?? null,
      validationId: validation?.getAttribute?.('id') ?? null,
      warningId: warning?.getAttribute?.('id') ?? null,
    },
    dom: {
      hasLabel: !!label,
      hasInput: !!input,
      hasDropdown: !!dropdown,
      hasClearButton: !!clearBtn,
      hasTriggerButton: !!trigger,
      hasToggleFormatButton: !!toggleFormatBtn,
      hasCloseButton: !!closeBtn,
      hasTimeValidationEl: !!timeValidation,
      hasValidationEl: !!validation,
      hasWarningEl: !!warning,
    },
    input: input
      ? {
          role: input.getAttribute('role') || 'textbox (implicit)',
          disabled: input.hasAttribute('disabled'),
          readOnly: input.hasAttribute('readonly'),
          required: input.hasAttribute('required'),
          ariaLabel: input.getAttribute('aria-label'),
          ariaLabelledby: input.getAttribute('aria-labelledby'),
          ariaDescribedby: input.getAttribute('aria-describedby'),
          ariaControls: input.getAttribute('aria-controls'),
          ariaExpanded: input.getAttribute('aria-expanded'),
          ariaHaspopup: input.getAttribute('aria-haspopup'),
          ariaInvalid: input.getAttribute('aria-invalid'),
          ariaRequired: input.getAttribute('aria-required'),
          ariaReadonly: input.getAttribute('aria-readonly'),
        }
      : null,
    controls: {
      clearButton: clearBtn
        ? {
            disabled: clearBtn.hasAttribute('disabled'),
            invalidClass: clearBtn.classList.contains('invalid'),
          }
        : null,
      trigger: trigger
        ? {
            disabled: trigger.hasAttribute('disabled'),
            invalidClass: trigger.classList.contains('invalid'),
            ariaControls: trigger.getAttribute('aria-controls'),
            ariaExpanded: trigger.getAttribute('aria-expanded'),
            ariaHaspopup: trigger.getAttribute('aria-haspopup'),
          }
        : null,
      toggleFormatButton: toggleFormatBtn
        ? {
            disabled: toggleFormatBtn.hasAttribute('disabled'),
            ariaLabel: toggleFormatBtn.getAttribute('aria-label'),
          }
        : null,
      closeButton: closeBtn
        ? {
            disabled: closeBtn.hasAttribute('disabled'),
            ariaLabel: closeBtn.getAttribute('aria-label'),
          }
        : null,
    },
    dropdown: dropdown
      ? {
          role: dropdown.getAttribute('role'),
          id: dropdown.getAttribute('id'),
          hiddenClass: dropdown.classList.contains('hidden'),
          inert: dropdown.hasAttribute('inert'),
          ariaLabelledby: dropdown.getAttribute('aria-labelledby'),
          ariaDescribedby: dropdown.getAttribute('aria-describedby'),
        }
      : null,
    messages: {
      timeValidation: timeValidation
        ? {
            hiddenClass: timeValidation.classList.contains('hidden'),
            text: (timeValidation.textContent || '').trim(),
          }
        : null,
      validation: validation
        ? {
            hiddenClass: validation.classList.contains('hidden'),
            text: (validation.textContent || '').trim(),
          }
        : null,
      warning: warning
        ? {
            hiddenClass: warning.classList.contains('hidden'),
            text: (warning.textContent || '').trim(),
          }
        : null,
    },
    spinbuttons: {
      hour: hour
        ? {
            role: hour.getAttribute('role'),
            tabIndex: hour.getAttribute('tabindex'),
            ariaValueMin: hour.getAttribute('aria-valuemin'),
            ariaValueMax: hour.getAttribute('aria-valuemax'),
            ariaValueNow: hour.getAttribute('aria-valuenow'),
            ariaValueText: hour.getAttribute('aria-valuetext'),
          }
        : null,
      minute: minute
        ? {
            role: minute.getAttribute('role'),
            tabIndex: minute.getAttribute('tabindex'),
            ariaValueMin: minute.getAttribute('aria-valuemin'),
            ariaValueMax: minute.getAttribute('aria-valuemax'),
            ariaValueNow: minute.getAttribute('aria-valuenow'),
            ariaValueText: minute.getAttribute('aria-valuetext'),
          }
        : null,
      second: second
        ? {
            role: second.getAttribute('role'),
            tabIndex: second.getAttribute('tabindex'),
            ariaValueMin: second.getAttribute('aria-valuemin'),
            ariaValueMax: second.getAttribute('aria-valuemax'),
            ariaValueNow: second.getAttribute('aria-valuenow'),
            ariaValueText: second.getAttribute('aria-valuetext'),
          }
        : null,
      ampm: ampm
        ? {
            role: ampm.getAttribute('role'),
            tabIndex: ampm.getAttribute('tabindex'),
            ariaValueMin: ampm.getAttribute('aria-valuemin'),
            ariaValueMax: ampm.getAttribute('aria-valuemax'),
            ariaValueNow: ampm.getAttribute('aria-valuenow'),
            ariaValueText: ampm.getAttribute('aria-valuetext'),
          }
        : null,
    },
    resolves: {
      labelledbyIds,
      labelledbyAllResolve: labelledbyIds.every(id => resolveId(scopeRoot, id)),
      describedbyIds,
      describedbyAllResolve: describedbyIds.every(id => resolveId(scopeRoot, id)),
      derivedResolves: derived
        ? {
            label: resolveId(scopeRoot, derived.label),
            dropdown: resolveId(scopeRoot, derived.dropdown),
            timeValidation: resolveId(scopeRoot, derived.timeValidation),
            validation: resolveId(scopeRoot, derived.validation),
            warning: resolveId(scopeRoot, derived.warning),
          }
        : null,
    },
  };
};
