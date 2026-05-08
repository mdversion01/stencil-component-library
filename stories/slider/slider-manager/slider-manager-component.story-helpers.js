export const boolLine = (name, on) => (on ? name : null);

export const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return null;
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
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
    attrLine('label', args.label),
    boolLine('hide-left-text-box', args.hideLeftTextBox),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    boolLine('hide-text-boxes', args.hideTextBoxes),

    attrLine('max', args.max),
    attrLine('min', args.min),

    boolLine('plumage', args.plumage),

    args.type === 'multi' ? attrLine('lower-value', args.lowerValue) : null,
    args.type === 'multi' ? attrLine('upper-value', args.upperValue) : null,
    args.type === 'multi' ? attrLine('range-fill-mode', args.rangeFillMode) : null,

    args.type === 'discrete' ? attrLine('selected-index', args.selectedIndex) : null,
    args.type === 'discrete' ? attrLine('string-values', serializeArray(args.stringValues)) : null,

    boolLine('slider-thumb-label', args.sliderThumbLabel),
    args.type !== 'discrete' ? boolLine('snap-to-ticks', args.snapToTicks) : null,
    boolLine('tick-labels', args.tickLabels),
    args.type !== 'discrete' ? attrLine('tick-values', serializeArray(args.tickValues)) : null,

    attrLine('type', args.type),
    attrLine('unit', args.unit),
    attrLine('orientation', args.orientation),

    args.type === 'basic' ? attrLine('value', args.value) : null,

    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('\n  ');

  return normalizeHtml(`
<div style="margin-top: 40px; margin-bottom: 40px;">
  <!-- div wrapper is for better appearance in Storybook -->
  <slider-manager-component
    ${attrs}
  ></slider-manager-component>
</div>
`);
};

const splitIds = v => String(v || '').trim().split(/\s+/).filter(Boolean);

export const getSnapshot = host => {
  const manager = host?.querySelector?.('slider-manager-component') || host;

  const basic = manager?.querySelector?.('slider-basic-component');
  const multi = manager?.querySelector?.('multi-range-slider-component');
  const discrete = manager?.querySelector?.('discrete-slider-component');
  const child = basic || multi || discrete;

  const managerType = manager?.getAttribute?.('type') ?? null;
  const managerOrientation = manager?.getAttribute?.('orientation') ?? null;
  const managerRangeFillMode = manager?.getAttribute?.('range-fill-mode') ?? null;

  const childTag = child?.tagName?.toLowerCase?.() ?? null;
  const childAriaLabel = child?.getAttribute?.('aria-label') ?? null;
  const childAriaLabelledby = child?.getAttribute?.('aria-labelledby') ?? null;
  const childAriaDescribedby = child?.getAttribute?.('aria-describedby') ?? null;
  const childOrientation = child?.getAttribute?.('orientation') ?? null;
  const childRangeFillMode = child?.getAttribute?.('range-fill-mode') ?? null;

  const resolveIn = id => {
    if (!id) return false;
    try {
      return !!host?.querySelector?.(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  const labelledIds = splitIds(childAriaLabelledby);
  const describedIds = splitIds(childAriaDescribedby);

  return {
    host: manager?.tagName?.toLowerCase?.() ?? null,
    managerType,
    managerOrientation,
    managerRangeFillMode,
    managerDisabled: manager?.hasAttribute?.('disabled') ?? null,
    childTag,
    childOrientation,
    childRangeFillMode,
    'child aria-label': childAriaLabel,
    'child aria-labelledby': childAriaLabelledby,
    'child aria-describedby': childAriaDescribedby,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolveIn),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolveIn),
    note:
      'This matrix validates manager→child forwarding. Actual slider role/aria-valuenow keyboard behavior must be implemented inside the child slider components.',
  };
};
