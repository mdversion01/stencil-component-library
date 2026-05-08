// File: src/stories/icon-component/icon-component.story-helpers.js

export const normalize = (value) => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const buildDocsHtml = (args) => {
  const a = { ...args };

  delete a.storyLabel;
  delete a.showAsRow;
  delete a.matrixMode;

  const attrs = [
    ['icon', normalize(a.icon)],
    ['icon-margin', normalize(a.iconMargin)],
    ['size', normalize(a.size)],
    ['icon-size', typeof a.iconSize === 'number' ? a.iconSize : undefined],
    ['color', normalize(a.color)],
    ['icon-aria-label', normalize(a.iconAriaLabel)],
    ['token-icon', !!a.tokenIcon],
    ['icon-aria-hidden', a.iconAriaHidden === false ? 'false' : undefined],
  ];

  const attrStr = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  return attrStr ? `<icon-component ${attrStr}></icon-component>` : '<icon-component></icon-component>';
};

export function buildIcon(args = {}) {
  const el = document.createElement('icon-component');

  if (args.icon) el.icon = args.icon;
  if (args.iconMargin) el.iconMargin = args.iconMargin;
  if (args.size) el.size = args.size;
  el.tokenIcon = !!args.tokenIcon;

  if (typeof args.iconSize === 'number') {
    el.iconSize = args.iconSize;
  }

  if (args.color) {
    el.color = args.color;
  }

  if (typeof args.iconAriaHidden === 'boolean') {
    el.iconAriaHidden = args.iconAriaHidden;
  }

  if (args.iconAriaLabel) {
    el.iconAriaLabel = args.iconAriaLabel;
  }

  if (args.icon) el.setAttribute('icon', args.icon);
  if (args.iconMargin) el.setAttribute('icon-margin', args.iconMargin);
  if (args.size) el.setAttribute('size', args.size);
  if (args.tokenIcon) el.setAttribute('token-icon', '');
  if (typeof args.iconSize === 'number') el.setAttribute('icon-size', String(args.iconSize));
  if (args.color) el.setAttribute('color', args.color);
  if (typeof args.iconAriaHidden === 'boolean' && args.iconAriaHidden === false) {
    el.setAttribute('icon-aria-hidden', 'false');
  }
  if (args.iconAriaLabel) el.setAttribute('icon-aria-label', args.iconAriaLabel);

  return el;
}

export function buildIconRow(items) {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.gap = '16px';
  wrap.style.alignItems = 'center';
  wrap.style.flexWrap = 'wrap';

  items.forEach((item) => wrap.appendChild(buildIcon(item)));
  return wrap;
}

export function pickAttrs(el, names) {
  const out = {};
  if (!el) return out;

  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }

  return out;
}

export function snapshotA11y(host) {
  const icon = host.querySelector('i');

  return {
    host: {
      tag: host.tagName.toLowerCase(),
    },
    icon: icon
      ? {
          tag: icon.tagName.toLowerCase(),
          class: icon.className,
          ...pickAttrs(icon, ['aria-hidden', 'aria-label', 'role', 'style']),
        }
      : null,
  };
}

export function renderMatrixRow({ title, args }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const stage = document.createElement('div');
  stage.style.display = 'flex';
  stage.style.alignItems = 'center';
  stage.style.minHeight = '28px';

  const el = buildIcon(args);
  stage.appendChild(el);

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role…';

  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  const update = () => {
    pre.textContent = JSON.stringify(snapshotA11y(el), null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}
