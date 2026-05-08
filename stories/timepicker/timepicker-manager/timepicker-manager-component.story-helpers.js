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

export const attr = (name, v) => {
  if (v === undefined || v === null || v === '') return null;
  return `${name}="${String(v).replace(/"/g, '&quot;')}"`;
};

export const buildDocsHtml = (args) => {
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
    boolAttr('use-pl-timepicker', args.usePlTimepicker),
    boolAttr('validation', args.validation),
    attr('validation-message', args.validationMessage),
    attr('value', args.value),
    attr('time-input-throttle-ms', args.timeInputThrottleMs),
  ]
    .filter(Boolean)
    .map((line) => `  ${line}`)
    .join('\n');

  return normalizeHtml(`
<timepicker-manager
${attrs}
></timepicker-manager>
`);
};

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
    boolAttr('use-pl-timepicker', args.usePlTimepicker),
    boolAttr('validation', args.validation),
    attr('validation-message', args.validationMessage),
    attr('value', args.value),
    attr('time-input-throttle-ms', args.timeInputThrottleMs),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(`
<div class="timepicker-wrapper"${width ? ` style="width:${width};"` : ''}>
  <timepicker-manager
    ${attrs}
  ></timepicker-manager>
</div>
`);
};

export const getChild = (mgr) =>
  mgr?.querySelector('plumage-timepicker-component') ||
  mgr?.querySelector('timepicker-component') ||
  null;

const splitIds = (v) =>
  String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const safeCssEscape = (value) =>
  typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
    ? CSS.escape(value)
    : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');

const resolveId = (scopeRoot, id) => {
  if (!id) return false;
  try {
    return !!scopeRoot.querySelector(`#${safeCssEscape(id)}`);
  } catch {
    return false;
  }
};

export const getSnapshot = (mgr, scopeRoot) => {
  const child = getChild(mgr);
  const childTag = child?.tagName?.toLowerCase?.() ?? null;

  const childProps = child
    ? {
        tag: childTag,
        ariaLabel: child.ariaLabel ?? null,
        ariaLabelledby: child.ariaLabelledby ?? null,
        ariaDescribedby: child.ariaDescribedby ?? null,
        disableTimepicker:
          childTag === 'plumage-timepicker-component'
            ? child.disabled ?? null
            : child.disableTimepicker ?? null,
        showLabel: child.showLabel ?? null,
        inputId: child.inputId ?? null,
      }
    : null;

  const labelledIds = splitIds(childProps?.ariaLabelledby);
  const describedIds = splitIds(childProps?.ariaDescribedby);

  const mgrInputId = mgr?.getAttribute?.('input-id') || '';
  const inferredValidationId = mgrInputId ? `${mgrInputId}-validation` : null;

  return {
    managerTag: mgr?.tagName?.toLowerCase?.() ?? null,
    managerAttrs: {
      'aria-label': mgr?.getAttribute?.('aria-label') ?? null,
      'aria-labelledby': mgr?.getAttribute?.('aria-labelledby') ?? null,
      'aria-describedby': mgr?.getAttribute?.('aria-describedby') ?? null,
      'input-id': mgrInputId || null,
      'validation-message': mgr?.getAttribute?.('validation-message') ?? null,
      validation: mgr?.hasAttribute?.('validation') ?? null,
      'is-valid': mgr?.getAttribute?.('is-valid') ?? null,
      'use-pl-timepicker': mgr?.hasAttribute?.('use-pl-timepicker') ?? null,
      'disable-timepicker': mgr?.hasAttribute?.('disable-timepicker') ?? null,
    },
    child: childProps,
    resolved: {
      labelledbyIds: labelledIds,
      labelledbyAllResolve: labelledIds.every((id) => resolveId(scopeRoot, id)),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every((id) => resolveId(scopeRoot, id)),
      inferredValidationId,
      inferredValidationResolves: inferredValidationId
        ? resolveId(scopeRoot, inferredValidationId)
        : false,
    },
  };
};
