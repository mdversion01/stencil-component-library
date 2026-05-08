export const normalizeHtml = html => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.replace(/[ \t]+$/g, ''));

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

export const normalizeIdList = value => {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return '';
  return trimmed.split(/\s+/).filter(Boolean).join(' ');
};

export const boolLine = (name, enabled) => (enabled ? `  ${name}` : null);

export const attrLine = (name, value) =>
  value === undefined || value === null || value === ''
    ? null
    : `  ${name}="${String(value).replace(/"/g, '&quot;')}"`;

export const normalizeFallback = value => {
  if (!value) return '';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
};

export const buildPopoverAttrsBlock = args => {
  const fallback = normalizeFallback(args.fallbackPlacement);

  const lines = [
    attrLine('aria-label', args.ariaLabel),
    attrLine('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attrLine('aria-describedby', normalizeIdList(args.ariaDescribedby)),
    boolLine('arrow-off', args.arrowOff),
    attrLine('content', args.content),
    attrLine('custom-class', args.customClass),
    attrLine('fallback-placement', fallback),
    attrLine('offset', args.offset),
    attrLine('placement', args.placement),
    boolLine('plumage', args.plumage),
    boolLine('super', args.superTooltip),
    attrLine('target', args.target),
    attrLine('title', args.popoverTitle),
    boolLine('no-header', args.noHeader),
    attrLine('trigger', args.trigger),
    attrLine('variant', args.variant),
    boolLine('visible', args.visible),
    attrLine('y-offset', args.yOffset),
  ].filter(Boolean);

  return lines.length ? `\n${lines.join('\n')}` : '';
};

export const buildPopoverTagWithChild = (args, { id } = {}) => {
  const idAttr = id ? ` id="${id}"` : '';
  const attrs = buildPopoverAttrsBlock(args);

  return `<popover-component${idAttr}${attrs}
>
  <button class="btn btn-primary" type="button">Popover trigger</button>
</popover-component>`;
};

export const buildPopoverTagExternal = (args, triggerId) => {
  const nextArgs = { ...args, target: triggerId };
  const attrs = buildPopoverAttrsBlock(nextArgs);

  return `<popover-component${attrs}
></popover-component>`;
};

export const buildBasicPopoverHtml = (args, options = {}) => {
  const stableId = options.id || 'basic-popover';
  const fallbackTriggerId = options.triggerId || 'basic-popover-btn';
  const useExternalTarget = !!String(args.target ?? '').trim();
  const triggerId = useExternalTarget ? String(args.target).trim() : fallbackTriggerId;

  return normalizeHtml(`
<div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
  ${
    useExternalTarget
      ? `
  <button id="${triggerId}" class="btn btn-primary" type="button">External trigger</button>
  ${buildPopoverTagExternal(args, triggerId)}
  `
      : `
  ${buildPopoverTagWithChild(args, { id: stableId })}
  `
  }
</div>
`);
};

export const buildRenderMarkup = args => {
  const id = `popover-${Math.random().toString(36).slice(2, 9)}`;
  const useExternalTarget = !!String(args.target ?? '').trim();
  const triggerId = useExternalTarget ? String(args.target).trim() : `${id}-btn`;

  return buildBasicPopoverHtml(args, {
    id,
    triggerId,
  });
};

export const getSnapshot = host => {
  const trigger =
    host?.querySelector('button') ||
    host?.querySelector('button-component') ||
    host?.querySelector('[role="button"]') ||
    host?.querySelector('[tabindex]');

  const describedby = (trigger?.getAttribute?.('aria-describedby') || '').trim();
  const describedIds = describedby ? describedby.split(/\s+/).filter(Boolean) : [];

  const resolve = id => {
    if (!id) return false;
    try {
      return !!document.querySelector(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  const popoverId = trigger?.getAttribute?.('aria-controls') || describedIds[0] || null;
  const pop = popoverId ? document.getElementById(popoverId) : document.body.querySelector('.popover');

  const popLabelledby = (pop?.getAttribute?.('aria-labelledby') || '').trim();
  const popLabelledbyIds = popLabelledby ? popLabelledby.split(/\s+/).filter(Boolean) : [];

  const popDescribedby = (pop?.getAttribute?.('aria-describedby') || '').trim();
  const popDescribedbyIds = popDescribedby ? popDescribedby.split(/\s+/).filter(Boolean) : [];

  return {
    host: host?.tagName?.toLowerCase() ?? null,
    triggerTag: trigger?.tagName?.toLowerCase() ?? null,
    triggerTabindex: trigger?.getAttribute?.('tabindex') ?? null,
    triggerAriaHaspopup: trigger?.getAttribute?.('aria-haspopup') ?? null,
    triggerAriaExpanded: trigger?.getAttribute?.('aria-expanded') ?? null,
    triggerAriaControls: trigger?.getAttribute?.('aria-controls') ?? null,
    triggerAriaDescribedby: describedby || null,
    triggerDescribedbyIds: describedIds,
    triggerDescribedbyAllResolve: describedIds.every(resolve),
    popoverFound: !!pop,
    popoverId: pop?.getAttribute?.('id') ?? null,
    popoverRole: pop?.getAttribute?.('role') ?? null,
    popoverTabindex: pop?.getAttribute?.('tabindex') ?? null,
    popoverAriaHidden: pop?.getAttribute?.('aria-hidden') ?? null,
    popoverAriaModal: pop?.getAttribute?.('aria-modal') ?? null,
    popoverAriaLabel: pop?.getAttribute?.('aria-label') ?? null,
    popoverAriaLabelledby: popLabelledby || null,
    popoverAriaDescribedby: popDescribedby || null,
    popoverLabelledbyIds: popLabelledbyIds,
    popoverLabelledbyAllResolve: popLabelledbyIds.every(resolve),
    popoverDescribedbyIds: popDescribedbyIds,
    popoverDescribedbyAllResolve: popDescribedbyIds.every(resolve),
    hasHeader: !!pop?.querySelector?.('.popover-header'),
    headerId: pop?.querySelector?.('.popover-header')?.getAttribute?.('id') ?? null,
    hasBody: !!pop?.querySelector?.('.popover-body'),
    bodyId: pop?.querySelector?.('.popover-body')?.getAttribute?.('id') ?? null,
  };
};
