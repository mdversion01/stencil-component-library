export const boolLine = (name, on) => (on ? name : null);

export const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return null;

  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  const quoted = useSingle ? `'${escaped}'` : `"${escaped}"`;

  return `${name}=${quoted}`;
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
    attrLine('lower-value', args.lowerValue),
    attrLine('upper-value', args.upperValue),
    attrLine('min', args.min),
    attrLine('max', args.max),
    attrLine('unit', args.unit),

    boolLine('plumage', args.plumage),
    boolLine('slider-thumb-label', args.sliderThumbLabel),
    boolLine('snap-to-ticks', args.snapToTicks),
    boolLine('tick-labels', args.tickLabels),

    attrLine('tick-values', serializeArray(args.tickValues)),
    attrLine('variant', args.variant),
    attrLine('orientation', args.orientation),
    attrLine('range-fill-mode', args.rangeFillMode),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(`
<div style="margin-top: 40px; margin-bottom: 40px;">
  <multi-range-slider-component
    ${attrs}
  ></multi-range-slider-component>
</div>
`);
};

const splitIds = v => String(v || '').trim().split(/\s+/).filter(Boolean);

export const getSnapshot = (host, scopeRoot) => {
  const sliders = Array.from(host.querySelectorAll('[role="slider"]'));
  const labelEl = host.querySelector('label.form-control-label');
  const labelledby = (sliders[0]?.getAttribute('aria-labelledby') || '').trim();
  const describedby = (sliders[0]?.getAttribute('aria-describedby') || '').trim();

  const resolve = id => {
    if (!id) return false;
    try {
      return !!scopeRoot.querySelector(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  const labelledIds = splitIds(labelledby);
  const describedIds = splitIds(describedby);

  return {
    host: host?.tagName?.toLowerCase?.() ?? null,
    hostOrientation: host?.getAttribute?.('orientation') ?? null,
    sliderCount: sliders.length,
    labelElId: labelEl?.getAttribute('id') ?? null,
    activeElementTag: document.activeElement?.tagName?.toLowerCase?.() ?? null,
    sliders: sliders.map((slider, index) => ({
      index,
      role: slider.getAttribute('role'),
      tabIndex: slider.getAttribute('tabindex'),
      isFocused: document.activeElement === slider,
      'aria-disabled': slider.getAttribute('aria-disabled'),
      'aria-orientation': slider.getAttribute('aria-orientation'),
      'aria-label': slider.getAttribute('aria-label'),
      'aria-labelledby': slider.getAttribute('aria-labelledby'),
      'aria-describedby': slider.getAttribute('aria-describedby'),
      'aria-valuemin': slider.getAttribute('aria-valuemin'),
      'aria-valuemax': slider.getAttribute('aria-valuemax'),
      'aria-valuenow': slider.getAttribute('aria-valuenow'),
      'aria-valuetext': slider.getAttribute('aria-valuetext'),
    })),
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolve),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
  };
};

export const templateStoryParameters = {
  docs: {
    source: {
      type: 'dynamic',
      language: 'html',
      transform: (_code, ctx) => Template(ctx.args),
    },
  },
};
