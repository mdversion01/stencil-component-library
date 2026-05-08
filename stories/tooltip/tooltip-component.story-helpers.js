export const normalize = (txt) => {
  const lines = String(txt ?? '')
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

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

export const uid = () => `${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

export const attrs = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n    ');

export const buildTooltipMarkup = (args, id) => {
  const htmlFlag = !!args.htmlContent;
  const dataTitle = String(args.tooltipTitle || args.message || 'Tooltip content').replaceAll('"', '&quot;');

  const attributeBlock = attrs([
    ['id', id],
    ['tooltip-id', args.tooltipId],
    ['position', args.position],
    ['trigger', args.trigger],
    ['custom-class', args.customClass],
    ['variant', args.variant],
    ['container', args.container],
    ['message', args.message],
    ['animation', args.animation],
    ['html-content', htmlFlag],
    ['data-original-title', dataTitle],
    ['data-html', htmlFlag ? true : null],
  ]);

  return normalize(`
<div style="display:inline-block">
  <tooltip-component
    ${attributeBlock}
  >
    <button-component
      btn-text="${args.btnText}"
      size="sm"
      variant="${args.btnVariant}"
    ></button-component>
  </tooltip-component>
</div>
  `);
};

export const manualTriggerDocsHtml = (ids) =>
  normalize(`
<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
  <tooltip-component id="${ids.tip}" trigger="manual click" position="bottom" data-original-title="Manually controlled tooltip">
    <button-component btn-text="Target" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <button-component btn-text="Show" size="sm" variant="primary" id="${ids.show}"></button-component>
  <button-component btn-text="Hide" size="sm" variant="danger" id="${ids.hide}"></button-component>
  <button-component btn-text="Toggle" size="sm" variant="info" id="${ids.toggle}"></button-component>
</div>
`);

export const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

export const getTrigger = (host) => (host?.firstElementChild ? host.firstElementChild : null);

export const snapshotA11y = (host) => {
  const trigger = getTrigger(host);

  const describedby = trigger?.getAttribute('aria-describedby') || '';
  const describedIds = splitIds(describedby);
  const inferredTooltipId =
    describedIds.find((t) => /__tip_\d+$/.test(t)) || describedIds[describedIds.length - 1] || null;

  const tooltipEl = inferredTooltipId ? document.getElementById(inferredTooltipId) : null;

  return {
    host: {
      tag: host?.tagName?.toLowerCase?.() ?? null,
      id: host?.getAttribute?.('id') ?? null,
      tooltipIdProp: host?.getAttribute?.('tooltip-id') ?? null,
      positionProp: host?.getAttribute?.('position') ?? null,
      triggerProp: host?.getAttribute?.('trigger') ?? null,
      variantProp: host?.getAttribute?.('variant') ?? null,
      htmlContentProp: host?.hasAttribute?.('html-content') ?? false,
      containerProp: host?.getAttribute?.('container') ?? null,
    },
    trigger: trigger
      ? {
          tag: trigger.tagName.toLowerCase(),
          disabled: trigger.disabled === true,
          tabindex: trigger.getAttribute('tabindex'),
          ariaDescribedby: describedby || null,
          ariaHaspopup: trigger.getAttribute('aria-haspopup'),
          ariaExpanded: trigger.getAttribute('aria-expanded'),
          dataToggle: trigger.getAttribute('data-toggle'),
          dataPlacement: trigger.getAttribute('data-placement'),
        }
      : null,
    tooltip: {
      inferredId: inferredTooltipId,
      presentInDom: !!tooltipEl,
      role: tooltipEl?.getAttribute?.('role') ?? 'tooltip',
      ariaHidden: tooltipEl?.getAttribute?.('aria-hidden') ?? '(not in DOM)',
      contentId: inferredTooltipId ? `${inferredTooltipId}-content` : null,
    },
    notes: [
      'Tooltips are not forced to show in this matrix to avoid overlays blocking the page.',
      'If you hover/focus the trigger, the tooltip element should be created with role="tooltip".',
    ],
  };
};

export const whenDefined = async () => {
  try {
    await customElements.whenDefined('tooltip-component');
  } catch {
    // no-op
  }
};

export const onReady = async (host) => {
  await whenDefined();
  try {
    await host?.componentOnReady?.();
  } catch {
    // no-op
  }
};

export const createExample = (title, makeHostFn) => {
  const card = document.createElement('div');
  card.style.border = '1px solid #ddd';
  card.style.borderRadius = '12px';
  card.style.padding = '12px';
  card.style.display = 'grid';
  card.style.gap = '10px';

  const h = document.createElement('div');
  h.style.fontWeight = '700';
  h.textContent = title;

  const demoRow = document.createElement('div');
  demoRow.style.display = 'flex';
  demoRow.style.alignItems = 'center';
  demoRow.style.gap = '12px';
  demoRow.style.flexWrap = 'wrap';

  const demo = document.createElement('div');
  demo.style.display = 'inline-flex';
  demo.style.alignItems = 'center';
  demo.style.gap = '10px';

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.borderRadius = '10px';
  pre.style.overflow = 'auto';
  pre.style.border = '1px solid #eee';
  pre.style.background = '#fafafa';
  pre.style.maxHeight = '240px';
  pre.textContent = 'Loading…';

  const hint = document.createElement('div');
  hint.style.fontSize = '0.8rem';
  hint.style.opacity = '0.85';
  hint.innerHTML =
    'Hover or focus the trigger to create the tooltip element. Press <kbd>Escape</kbd> while focused to close (when visible).';

  const host = makeHostFn();
  demo.appendChild(host);
  demoRow.appendChild(demo);
  card.appendChild(h);
  card.appendChild(demoRow);
  card.appendChild(hint);
  card.appendChild(pre);

  const update = () => {
    pre.textContent = JSON.stringify(snapshotA11y(host), null, 2);
  };

  queueMicrotask(() =>
    requestAnimationFrame(async () => {
      await onReady(host);
      requestAnimationFrame(() => update());
    }),
  );

  host.addEventListener('mouseenter', () => setTimeout(update, 0), true);
  host.addEventListener('focus', () => setTimeout(update, 0), true);
  host.addEventListener('click', () => setTimeout(update, 0), true);
  document.addEventListener('click', () => setTimeout(update, 0), true);

  return card;
};

export const makeTooltipHost = (context, overrides = {}, child = null) => {
  const id = `mx-${(context?.id || 'sb').split('--').pop()}-${uid()}`;
  const host = document.createElement('tooltip-component');
  host.setAttribute('id', id);

  host.setAttribute('position', 'top');
  host.setAttribute('trigger', 'hover focus');
  host.setAttribute('data-original-title', 'Tooltip content');

  Object.entries(overrides).forEach(([k, v]) => {
    if (v === null || v === undefined || v === false || v === '') host.removeAttribute(k);
    else if (v === true) host.setAttribute(k, '');
    else host.setAttribute(k, String(v));
  });

  host.appendChild(child || makeButton('Trigger'));
  return host;
};

export const makeButton = (text, disabled = false) => {
  const btn = document.createElement('button-component');
  btn.setAttribute('btn-text', text);
  btn.setAttribute('size', 'sm');
  btn.setAttribute('variant', 'secondary');
  if (disabled) btn.disabled = true;
  return btn;
};

export const POSITIONS_GRID_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component position="top" data-original-title="Tooltip on top" trigger="hover focus">
    <button-component btn-text="Top" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="right" data-original-title="Tooltip on right" trigger="hover focus">
    <button-component btn-text="Right" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="left" data-original-title="Tooltip on left" trigger="hover focus">
    <button-component btn-text="Left" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="bottom" data-original-title="Tooltip on bottom" trigger="hover focus">
    <button-component btn-text="Bottom" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="auto" data-original-title="Placement auto" trigger="hover focus">
    <button-component btn-text="Auto" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const WITH_HTML_CONTENT_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component
    position="top"
    data-original-title="<strong>HTML</strong> tooltip"
    trigger="hover focus"
    html-content
    data-html
  >
    <button-component btn-text="HTML Content" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const VARIANTS_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component position="top" data-original-title="Primary" trigger="hover focus" variant="primary">
    <button-component btn-text="Primary" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Secondary" trigger="hover focus" variant="secondary">
    <button-component btn-text="Secondary" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Info" trigger="hover focus" variant="info">
    <button-component btn-text="Info" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Danger" trigger="hover focus" variant="danger">
    <button-component btn-text="Danger" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Warning" trigger="hover focus" variant="warning">
    <button-component btn-text="Warning" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Success" trigger="hover focus" variant="success">
    <button-component btn-text="Success" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Dark" trigger="hover focus" variant="dark">
    <button-component btn-text="Dark" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const INLINE_LINKS_HTML = normalize(`
<p style="max-width:680px; line-height:1.6">
  Placeholder text to demonstrate some
  <tooltip-component position="top" data-original-title="Default tooltip" trigger="hover focus">
    <a href="javascript:void(0)">inline links</a>
  </tooltip-component>
  with tooltips.
</p>
`);

export const CUSTOM_CONTAINER_HTML = normalize(`
<div>
  <div id="sb-tooltip-container" style="position:relative; border:1px dashed #ccc; padding:20px; height:160px; overflow:auto">
    <div style="height:320px; margin-top:80px">
      <tooltip-component
        container="#sb-tooltip-container"
        position="right"
        data-original-title="Inside scrollable container"
        trigger="hover focus"
      >
        <button-component btn-text="Hover me" size="sm" variant="secondary"></button-component>
      </tooltip-component>
    </div>
  </div>
  <small style="color:#666">Tooltip stays inside container.</small>
</div>
`);
