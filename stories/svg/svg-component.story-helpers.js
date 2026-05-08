// src/stories/svg-component.story-helpers.js
export const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return null;

  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');

  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

export const boolLine = (name, on) => (on ? `${name}` : null);

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

export const DEFAULT_VIEWBOX = '0 0 640 640';

export const DEFAULT_PATH = `<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />`;

export const Template = args => {
  const attrs = [
    attrLine('fill', args.fill),
    attrLine('height', args.height),
    attrLine('path', args.path),
    attrLine('svg-margin', args.svgMargin),
    attrLine('view-box', args.viewBox),
    attrLine('width', args.width),

    typeof args.decorative === 'boolean' ? boolLine('decorative', args.decorative) : null,
    args.focusable === true ? attrLine('focusable', 'true') : args.focusable === false ? attrLine('focusable', 'false') : null,
    attrLine('svg-aria-hidden', args.svgAriaHidden),
    attrLine('svg-aria-label', args.svgAriaLabel),
    attrLine('svg-aria-labelledby', normalizeIdList(args.svgAriaLabelledby)),
    attrLine('svg-aria-describedby', normalizeIdList(args.svgAriaDescribedby)),
    attrLine('svg-title', args.svgTitle),
    attrLine('svg-desc', args.svgDesc),
  ]
    .filter(Boolean)
    .join('\n  ');

  return normalizeHtml(`
<svg-component
  ${attrs}
></svg-component>`);
};

export const InlineWithTextTemplate = args => {
  const attrs = [
    attrLine('fill', args.fill),
    attrLine('height', args.height),
    attrLine('path', args.path),
    attrLine('svg-margin', args.svgMargin),
    attrLine('view-box', args.viewBox),
    attrLine('width', args.width),

    typeof args.decorative === 'boolean' ? boolLine('decorative', args.decorative) : null,
    args.focusable === true ? attrLine('focusable', 'true') : args.focusable === false ? attrLine('focusable', 'false') : null,
    attrLine('svg-aria-hidden', args.svgAriaHidden),
    attrLine('svg-aria-label', args.svgAriaLabel),
    attrLine('svg-aria-labelledby', normalizeIdList(args.svgAriaLabelledby)),
    attrLine('svg-aria-describedby', normalizeIdList(args.svgAriaDescribedby)),
    attrLine('svg-title', args.svgTitle),
    attrLine('svg-desc', args.svgDesc),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(`
<div style="display:flex;align-items:center;gap:8px;font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
  <span>Inline text</span>
  <svg-component
    ${attrs}
  ></svg-component>
  <span>Inline text</span>
</div>`);
};

const splitIds = v => String(v || '').trim().split(/\s+/).filter(Boolean);

export const getSnapshot = (host, scopeRoot) => {
  const svg = host?.querySelector('svg');

  const labelledby = (svg?.getAttribute('aria-labelledby') || '').trim();
  const describedby = (svg?.getAttribute('aria-describedby') || '').trim();

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
    role: svg?.getAttribute('role') ?? null,
    tabIndex: svg?.getAttribute('tabindex') ?? null,
    focusable: svg?.getAttribute('focusable') ?? null,
    'aria-hidden': svg?.getAttribute('aria-hidden') ?? null,
    'aria-label': svg?.getAttribute('aria-label') ?? null,
    'aria-labelledby': labelledby || null,
    'aria-describedby': describedby || null,
    hasTitle: !!svg?.querySelector('title'),
    hasDesc: !!svg?.querySelector('desc'),
    titleId: svg?.querySelector('title')?.getAttribute('id') ?? null,
    descId: svg?.querySelector('desc')?.getAttribute('id') ?? null,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolve),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
  };
};
