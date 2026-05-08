export const boolAttr = (name, on) => (on ? name : null);

export const attr = (name, v) => {
  if (v === undefined || v === null || v === '') return null;
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

export const serializeBars = (bars) => {
  if (!bars) return null;
  try {
    const s = JSON.stringify(bars);
    return s && s !== '[]' ? s : null;
  } catch {
    return null;
  }
};

export const resolveMode = (args) => (args.multi ? 'multi' : args.circular ? 'circular' : 'linear');

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

export const buildAttrsForMarkup = (args) => {
  const labelText = String(args.label ?? '').trim();
  const useNamed = !!labelText && !!args.useNamedBar0;

  const mode = resolveMode(args);
  const isLinear = mode === 'linear';
  const isCircular = mode === 'circular';
  const isMulti = mode === 'multi';

  return [
    isCircular ? 'circular' : null,
    isMulti ? 'multi' : null,

    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', args.ariaLabelledby),
    attr('aria-describedby', args.ariaDescribedby),

    attr('label', labelText),
    attr('value', args.value),
    attr('max', args.max),
    attr('precision', args.precision),
    boolAttr('show-progress', args.showProgress),
    boolAttr('show-value', args.showValue),
    attr('variant', args.variant),

    isLinear || isMulti ? attr('height', args.height) : null,
    isLinear ? boolAttr('striped', args.striped) : null,
    isLinear ? boolAttr('animated', args.animated) : null,
    isLinear ? attr('progress-align', args.progressAlign) : null,
    isLinear ? attr('styles', args.styles) : null,
    isLinear ? boolAttr('use-named-bar-0', useNamed) : null,

    isMulti ? attr('bars', serializeBars(args.bars)) : null,

    isCircular ? attr('size', args.size) : null,
    isCircular ? attr('rotate', args.rotate) : null,
    isCircular ? attr('width', args.strokeWidth) : null,
    isCircular ? boolAttr('indeterminate', args.indeterminate) : null,
    isCircular ? boolAttr('line-cap', args.lineCap) : null,
  ]
    .filter(Boolean)
    .join('\n  ');
};

export const toMarkup = (args) => {
  const mode = resolveMode(args);
  const attrsList = buildAttrsForMarkup(args);

  const slotText = String(args.slotText ?? '').trim();
  const children = String(args.children ?? '').trim();

  const inner = mode === 'multi' ? children : slotText;

  if (inner) {
    return `<progress-display-component
  ${attrsList}
>
  ${inner}
</progress-display-component>`;
  }

  return `<progress-display-component
  ${attrsList}
></progress-display-component>`;
};

const setBoolAttr = (el, name, on) => (on ? el.setAttribute(name, '') : el.removeAttribute(name));

const setAttr = (el, name, v) => {
  if (v === undefined || v === null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
};

const setMaybeProp = (el, name, v) => {
  try {
    el[name] = v;
  } catch {}
};

export const applyArgsToElement = (el, args) => {
  const mode = resolveMode(args);

  setBoolAttr(el, 'circular', mode === 'circular');
  setBoolAttr(el, 'multi', mode === 'multi');

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  const labelText = String(args.label ?? '').trim();
  setAttr(el, 'label', labelText);
  setMaybeProp(el, 'label', labelText);

  setAttr(el, 'value', args.value);
  setAttr(el, 'max', args.max);
  setAttr(el, 'precision', args.precision);
  setBoolAttr(el, 'show-progress', !!args.showProgress);
  setBoolAttr(el, 'show-value', !!args.showValue);
  setAttr(el, 'variant', args.variant);

  if (mode === 'linear') {
    setAttr(el, 'height', args.height);
    setBoolAttr(el, 'striped', !!args.striped);
    setBoolAttr(el, 'animated', !!args.animated);
    setAttr(el, 'progress-align', args.progressAlign);
    setAttr(el, 'styles', args.styles);

    const useNamed = !!labelText && !!args.useNamedBar0;
    setBoolAttr(el, 'use-named-bar-0', useNamed);

    el.innerHTML = String(args.slotText ?? '').trim();
  }

  if (mode === 'multi') {
    setAttr(el, 'height', args.height);

    const bars = (() => {
      if (!args.bars) return '';
      try {
        return JSON.stringify(args.bars);
      } catch {
        return '';
      }
    })();
    setAttr(el, 'bars', bars);

    el.innerHTML = String(args.children ?? '').trim();
  }

  if (mode === 'circular') {
    setAttr(el, 'size', args.size);
    setAttr(el, 'rotate', args.rotate);
    setAttr(el, 'width', args.strokeWidth);
    setBoolAttr(el, 'indeterminate', !!args.indeterminate);
    setBoolAttr(el, 'line-cap', !!args.lineCap);
    el.innerHTML = '';
  }
};

export const renderElement = (args) => {
  const wrap = document.createElement('div');
  const key = btoa(unescape(encodeURIComponent(JSON.stringify(args)))).slice(0, 32);

  const el = document.createElement('progress-display-component');
  el.setAttribute('data-sb-key', key);

  applyArgsToElement(el, args);

  wrap.appendChild(el);
  return wrap;
};

export const getSnapshot = (host) => {
  const root = host;
  const group = root?.querySelector?.('[role="group"]');
  const bars = Array.from(root?.querySelectorAll?.('[role="progressbar"]') || []);

  const resolveIn = (scope, id) => {
    if (!id) return false;
    return !!scope?.querySelector?.(`#${CSS.escape(id)}`);
  };

  const snapEl = (el) => {
    if (!el) return null;

    const describedby = (el.getAttribute('aria-describedby') || '').trim();
    const describedIds = describedby ? describedby.split(/\s+/).filter(Boolean) : [];

    const labelledby = (el.getAttribute('aria-labelledby') || '').trim();
    const labelledIds = labelledby ? labelledby.split(/\s+/).filter(Boolean) : [];

    return {
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role'),
      id: el.getAttribute('id'),
      class: el.getAttribute('class'),
      'aria-label': el.getAttribute('aria-label'),
      'aria-labelledby': labelledby || null,
      'aria-describedby': describedby || null,
      'aria-valuemin': el.getAttribute('aria-valuemin'),
      'aria-valuemax': el.getAttribute('aria-valuemax'),
      'aria-valuenow': el.getAttribute('aria-valuenow'),
      'aria-valuetext': el.getAttribute('aria-valuetext'),
      'aria-busy': el.getAttribute('aria-busy'),
      labelledbyIds: labelledIds,
      labelledbyAllResolve: labelledIds.every((x) => resolveIn(root, x)),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every((x) => resolveIn(root, x)),
    };
  };

  return {
    host: host?.tagName?.toLowerCase() ?? null,
    mode: group ? 'multi' : 'single',
    group: snapEl(group),
    bars: bars.map(snapEl),
    labelElId: root?.querySelector?.('[id$="-label"]')?.getAttribute?.('id') ?? null,
  };
};
