// File: src/stories/divider-component/divider-component.story-helpers.js

export const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.';

export const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export const normalize = (txt) => {
  const lines = String(txt || '')
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

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

export const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

export const buildDividerHtml = (args = {}) => {
  const attrs = attrLines([
    ['id', args.sbId],
    ['dashed', args.dashed],
    ['plain', args.plain],
    ['orientation', args.orientation],
    ['remove-orientation-margin', args.removeOrientationMargin],
    ['direction', args.direction === 'vertical' ? 'vertical' : undefined],
    ['styles', args.styles],
    ['aria-label', args.ariaLabel],
    ['aria-disabled', args.sbAriaDisabled ? 'true' : undefined],
  ]);

  const slotText = args.slotText ? `\n  ${args.slotText}\n` : '\n';

  return normalize(`
<divider-component${attrs ? `\n  ${attrs}` : ''}>
${slotText}</divider-component>
`);
};

export const buildDocsHtml = (args = {}) => {
  const dividerHtml = buildDividerHtml(args);

  if (args.direction === 'vertical') {
    return normalize(`
<div style="display:flex; align-items:center; gap:12px; height:48px;">
  <div>Left</div>
  ${dividerHtml.replace(/\n/g, '\n  ')}
  <div>Right</div>
</div>
`);
  }

  return normalize(`
<div>
  <p>${LOREM}</p>
  ${dividerHtml.replace(/\n/g, '\n  ')}
  <p>${LOREM}</p>
</div>
`);
};

export const buildDocsHtmlMany = (snippets) =>
  normalize(`
<div style="display:grid; gap:14px;">
${snippets.map((s) => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`);

export const buildDivider = (args = {}) => {
  const el = document.createElement('divider-component');

  if (args.direction === 'vertical') el.direction = 'vertical';
  else delete el.direction;

  el.dashed = !!args.dashed;
  el.plain = !!args.plain;

  if (args.orientation === undefined) delete el.orientation;
  else el.orientation = args.orientation;

  if (args.removeOrientationMargin === undefined) delete el.removeOrientationMargin;
  else el.removeOrientationMargin = args.removeOrientationMargin;

  if (args.styles && String(args.styles).trim().length) el.styles = args.styles;
  else el.removeAttribute('styles');

  if (args.ariaLabel && String(args.ariaLabel).trim().length) {
    el.ariaLabel = String(args.ariaLabel).trim();
  } else {
    el.ariaLabel = undefined;
  }

  setAttr(el, 'direction', args.direction === 'vertical' ? 'vertical' : undefined);
  setAttr(el, 'dashed', !!args.dashed);
  setAttr(el, 'plain', !!args.plain);
  setAttr(el, 'orientation', args.orientation);
  setAttr(el, 'remove-orientation-margin', args.removeOrientationMargin);
  setAttr(el, 'styles', args.styles);
  setAttr(el, 'aria-label', args.ariaLabel && String(args.ariaLabel).trim().length ? String(args.ariaLabel).trim() : '');
  setAttr(el, 'id', args.sbId);
  setAttr(el, 'aria-disabled', args.sbAriaDisabled ? 'true' : undefined);

  el.textContent = args.slotText || '';

  return el;
};

export const renderDivider = (args) => buildDivider(args);

export const makeParagraph = (text = LOREM) => {
  const p = document.createElement('p');
  p.textContent = text;
  return p;
};
