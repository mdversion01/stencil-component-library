// src/stories/slider-basic-component.story-helpers.js
export const boolLine = (name, on) => (on ? ` ${name}` : '');

export const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

export const serializeArray = val => {
  if (val === undefined || val === null) return '';
  try {
    return JSON.stringify(val);
  } catch {
    return '';
  }
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

export const Template = args => {
  const attrs = [
    attrLine('aria-label', args.ariaLabel),
    attrLine('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attrLine('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    boolLine('disabled', args.disabled),
    boolLine('hide-left-text-box', args.hideLeftTextBox),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    boolLine('hide-text-boxes', args.hideTextBoxes),

    attrLine('label', args.label),
    attrLine('max', args.max),
    attrLine('min', args.min),

    boolLine('plumage', args.plumage),
    boolLine('slider-thumb-label', args.sliderThumbLabel),

    boolLine('snap-to-ticks', args.snapToTicks),
    boolLine('tick-labels', args.tickLabels),
    attrLine('tick-values', serializeArray(args.tickValues)),

    attrLine('orientation', args.orientation),
    attrLine('unit', args.unit),
    attrLine('value', args.value),
    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('');

  return normalizeHtml(`
<div style="margin-top: 40px; margin-bottom: 40px;">
  <!-- div wrapper is for better appearance in Storybook -->
  <slider-basic-component${attrs}></slider-basic-component>
</div>
  `);
};

const splitIds = v => String(v || '').trim().split(/\s+/).filter(Boolean);

export const getSnapshot = root => {
  const host = root?.querySelector?.('slider-basic-component') || root;
  const slider = host?.querySelector?.('[role="slider"]') || null;

  const resolve = id => {
    if (!id) return false;
    try {
      return !!root?.querySelector?.(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  const labelledby = (slider?.getAttribute?.('aria-labelledby') || '').trim();
  const describedby = (slider?.getAttribute?.('aria-describedby') || '').trim();

  const labelledIds = splitIds(labelledby);
  const describedIds = splitIds(describedby);

  return {
    host: host?.tagName?.toLowerCase?.() ?? null,
    sliderRole: slider?.getAttribute?.('role') ?? null,
    tabIndex: slider?.getAttribute?.('tabindex') ?? null,
    disabled: slider?.getAttribute?.('aria-disabled') ?? null,
    orientation: slider?.getAttribute?.('aria-orientation') ?? null,
    'aria-label': slider?.getAttribute?.('aria-label') ?? null,
    'aria-labelledby': labelledby || null,
    'aria-describedby': describedby || null,
    'aria-valuemin': slider?.getAttribute?.('aria-valuemin') ?? null,
    'aria-valuemax': slider?.getAttribute?.('aria-valuemax') ?? null,
    'aria-valuenow': slider?.getAttribute?.('aria-valuenow') ?? null,
    'aria-valuetext': slider?.getAttribute?.('aria-valuetext') ?? null,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolve),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
    labelElId: host?.querySelector?.('label.form-control-label')?.getAttribute?.('id') ?? null,
  };
};
