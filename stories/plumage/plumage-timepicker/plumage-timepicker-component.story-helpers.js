export const TAG = 'plumage-timepicker-component';

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

export const attr = (name, v) => (v === undefined || v === null || v === '' ? null : `${name}="${String(v)}"`);

export const boolStrAttr = (name, v) => (typeof v === 'boolean' ? `${name}="${v ? 'true' : 'false'}"` : null);

export const boolPresenceAttr = (name, on) => (on ? name : null);

export const buildDocsHtml = (args) => Template(args);

export const Template = (args) => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';

  const attrs = [
    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attr('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    boolPresenceAttr('show-label', args.showLabel),
    attr('label-text', args.labelText),
    attr('input-id', args.inputId),
    attr('input-name', args.inputName),

    attr('value', args.value),

    boolStrAttr('is-twenty-four-hour-format', !!args.isTwentyFourHourFormat),
    boolPresenceAttr('twenty-four-hour-only', args.twentyFourHourOnly),
    boolPresenceAttr('twelve-hour-only', args.twelveHourOnly),
    boolPresenceAttr('hide-seconds', args.hideSeconds),
    boolPresenceAttr('hide-timepicker-btn', args.hideTimepickerBtn),

    boolStrAttr('is-valid', !!args.isValid),
    attr('validation-message', args.validationMessage),
    boolStrAttr('validation', !!args.validation),
    boolStrAttr('required', !!args.required),
    boolStrAttr('disabled', !!args.disabled),

    attr('input-width', args.inputWidth),
    attr('size', args.size),

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

export const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

export const resolveId = (scopeRoot, id) => {
  if (!id) return false;
  try {
    return !!scopeRoot.querySelector(`#${CSS.escape(id)}`);
  } catch {
    return false;
  }
};

export const getComputedSnapshot = (cmp, scopeRoot) => {
  const input = cmp?.querySelector?.('input.time-input') || null;
  const label = cmp?.querySelector?.('label') || null;
  const dropdown = cmp?.querySelector?.('.time-dropdown') || null;

  const inputId = cmp?.inputId ?? cmp?.getAttribute?.('input-id') ?? null;
  const derived = inputId
    ? {
        label: `${inputId}-label`,
        dropdown: `${inputId}-dropdown`,
        validation: `${inputId}-validation`,
        warning: `${inputId}-warning`,
      }
    : null;

  const validation = derived
    ? cmp?.querySelector?.(`#${CSS.escape(derived.validation)}`) || null
    : null;
  const warning = derived
    ? cmp?.querySelector?.(`#${CSS.escape(derived.warning)}`) || null
    : null;

  const ariaLabelledby = input?.getAttribute?.('aria-labelledby') ?? null;
  const ariaDescribedby = input?.getAttribute?.('aria-describedby') ?? null;

  const labelledIds = splitIds(ariaLabelledby);
  const describedIds = splitIds(ariaDescribedby);

  return {
    component: {
      tag: cmp?.tagName?.toLowerCase?.() ?? null,
      inputId,
      value: cmp?.value ?? cmp?.getAttribute?.('value') ?? null,
      isOpen: cmp?._open ?? null,
      activePart: cmp?._activePart ?? null,
    },
    derivedIds: derived,
    dom: {
      hasLabel: !!label,
      hasInput: !!input,
      hasDropdown: !!dropdown,
      hasValidationEl: !!validation,
      hasWarningEl: !!warning,
    },
    input: input
      ? {
          id: input.getAttribute('id'),
          name: input.getAttribute('name'),
          disabled: input.hasAttribute('disabled'),
          role: input.getAttribute('role') || 'textbox (implicit)',
          ariaLabel: input.getAttribute('aria-label'),
          ariaLabelledby,
          ariaDescribedby,
          ariaControls: input.getAttribute('aria-controls'),
          ariaExpanded: input.getAttribute('aria-expanded'),
          ariaHaspopup: input.getAttribute('aria-haspopup'),
          ariaInvalid: input.getAttribute('aria-invalid'),
          ariaRequired: input.getAttribute('aria-required'),
          required: input.hasAttribute('required'),
        }
      : null,
    dropdown: dropdown
      ? {
          id: dropdown.getAttribute('id'),
          role: dropdown.getAttribute('role'),
          ariaLabelledby: dropdown.getAttribute('aria-labelledby'),
          ariaDescribedby: dropdown.getAttribute('aria-describedby'),
          hiddenClass: dropdown.classList.contains('hidden'),
          inertAttr: dropdown.hasAttribute('inert'),
          tabIndex: dropdown.getAttribute('tabindex'),
        }
      : null,
    resolved: {
      labelledbyIds: labelledIds,
      labelledbyAllResolve: labelledIds.every((id) => resolveId(scopeRoot, id)),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every((id) => resolveId(scopeRoot, id)),
      derivedResolves: derived
        ? {
            label: resolveId(scopeRoot, derived.label),
            dropdown: resolveId(scopeRoot, derived.dropdown),
            validation: resolveId(scopeRoot, derived.validation),
            warning: resolveId(scopeRoot, derived.warning),
          }
        : null,
    },
    spinbuttons: (() => {
      if (!dropdown) return null;
      return Array.from(dropdown.querySelectorAll('[role="spinbutton"]')).map((el) => ({
        class: el.getAttribute('class'),
        tabIndex: el.getAttribute('tabindex'),
        ariaLabel: el.getAttribute('aria-label'),
        ariaValueNow: el.getAttribute('aria-valuenow'),
        ariaValueText: el.getAttribute('aria-valuetext'),
        ariaValueMin: el.getAttribute('aria-valuemin'),
        ariaValueMax: el.getAttribute('aria-valuemax'),
      }));
    })(),
  };
};
