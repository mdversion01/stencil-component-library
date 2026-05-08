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

export const normalizeHtml = (html) => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

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

export const normalizeIdList = (v) => {
  const s = String(v ?? '').trim();
  if (!s) return '';
  return s.split(/\s+/).filter(Boolean).join(' ');
};

export const boolAttr = (name, on) => (on ? name : null);
export const attr = (name, v) => (v === undefined || v === null || v === '' ? null : `${name}="${String(v)}"`);

export const buildDocsHtml = (args) => Template(args);

export const Template = (args) => {
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
    boolAttr('is-twenty-four-hour-format', args.isTwentyFourHourFormat),
    boolAttr('is-valid', args.isValid),
    attr('label-text', args.labelText),
    boolAttr('required', args.required),
    boolAttr('show-label', args.showLabel),
    attr('size', args.size),
    boolAttr('twelve-hour-only', args.twelveHourOnly),
    boolAttr('twenty-four-hour-only', args.twentyFourHourOnly),
    boolAttr('validation', args.validation),
    attr('validation-message', args.validationMessage),
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

export const splitIds = (v) =>
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
  const input = host?.querySelector?.('input.time-input');
  const label = host?.querySelector?.('label');
  const trigger = host?.querySelector?.('button.time-icon-btn');
  const dropdown = host?.querySelector?.('.time-dropdown');
  const validation = host?.querySelector?.('.validation-message');
  const warning = host?.querySelector?.('.warning-message');

  const hour = host?.querySelector?.('.hour-display');
  const minute = host?.querySelector?.('.minute-display');
  const second = host?.querySelector?.('.second-display');
  const ampm = host?.querySelector?.('.ampm-display');

  const labelledbyIds = splitIds(input?.getAttribute?.('aria-labelledby'));
  const describedbyIds = splitIds(input?.getAttribute?.('aria-describedby'));

  return {
    hostTag: host?.tagName?.toLowerCase?.() ?? null,
    ids: {
      inputId: input?.getAttribute?.('id') ?? null,
      labelId: label?.getAttribute?.('id') ?? null,
      dropdownId: dropdown?.getAttribute?.('id') ?? null,
      validationId: validation?.getAttribute?.('id') ?? null,
      warningId: warning?.getAttribute?.('id') ?? null,
    },
    input: input
      ? {
          role: input.getAttribute('role') ?? null,
          disabled: input.hasAttribute('disabled'),
          required: input.hasAttribute('required'),
          ariaLabel: input.getAttribute('aria-label'),
          ariaLabelledby: input.getAttribute('aria-labelledby'),
          ariaDescribedby: input.getAttribute('aria-describedby'),
          ariaControls: input.getAttribute('aria-controls'),
          ariaExpanded: input.getAttribute('aria-expanded'),
          ariaHaspopup: input.getAttribute('aria-haspopup'),
          ariaInvalid: input.getAttribute('aria-invalid'),
          ariaRequired: input.getAttribute('aria-required'),
        }
      : null,
    trigger: trigger
      ? {
          disabled: trigger.hasAttribute('disabled'),
          ariaControls: trigger.getAttribute('aria-controls'),
          ariaExpanded: trigger.getAttribute('aria-expanded'),
          ariaHaspopup: trigger.getAttribute('aria-haspopup'),
        }
      : null,
    dropdown: dropdown
      ? {
          role: dropdown.getAttribute('role'),
          hiddenClass: dropdown.classList.contains('hidden'),
          inert: dropdown.hasAttribute('inert'),
          ariaLabelledby: dropdown.getAttribute('aria-labelledby'),
          ariaDescribedby: dropdown.getAttribute('aria-describedby'),
        }
      : null,
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
      labelledbyAllResolve: labelledbyIds.every((id) => resolveId(scopeRoot, id)),
      describedbyIds,
      describedbyAllResolve: describedbyIds.every((id) => resolveId(scopeRoot, id)),
    },
  };
};
