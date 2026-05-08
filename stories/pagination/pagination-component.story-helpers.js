// File: src/stories/pagination-component.story-helpers.js

import { useArgs } from '@storybook/preview-api';

let __isSyncingVariants = false;

export const sanitizeArgs = (args = {}) => {
  const next = { ...args };

  if (next.variant && next.variant !== 'standard') {
    next.useMinimizePagination = false;
    next.useByPagePagination = false;
    return next;
  }

  if (next.useMinimizePagination && next.useByPagePagination) {
    next.useByPagePagination = false;
  }
  if (next.useMinimizePagination) next.useByPagePagination = false;
  if (next.useByPagePagination) next.useMinimizePagination = false;

  return next;
};

export const withExclusiveVariants = (Story) => {
  const [args, updateArgs] = useArgs();

  if (__isSyncingVariants) return Story();

  const { variant, useMinimizePagination, useByPagePagination } = args || {};

  if (variant && variant !== 'standard' && (useMinimizePagination || useByPagePagination)) {
    __isSyncingVariants = true;
    updateArgs({ useMinimizePagination: false, useByPagePagination: false });
    setTimeout(() => {
      __isSyncingVariants = false;
    }, 0);
    return Story();
  }

  if (useMinimizePagination && useByPagePagination) {
    __isSyncingVariants = true;
    updateArgs({ useByPagePagination: false });
    setTimeout(() => {
      __isSyncingVariants = false;
    }, 0);
  }

  return Story();
};

export const boolLine = (name, on) => (on ? `  ${name}` : null);
export const attrLine = (name, val) => (val === undefined || val === null || val === '' ? null : `  ${name}="${String(val)}"`);

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

export const shouldIncludeItemsPerPageOptions = (a) => Array.isArray(a?.itemsPerPageOptions) && a.itemsPerPageOptions.length > 0;

export const buildAttrsBlock = (a) => {
  const lines = [
    attrLine('current-page', a.currentPage),
    attrLine('page-size', a.pageSize),
    attrLine('total-rows', a.totalRows),
    attrLine('variant', a.variant && a.variant !== 'standard' ? a.variant : ''),
    boolLine('use-by-page-pagination', a.useByPagePagination),
    boolLine('use-minimize-pagination', a.useMinimizePagination),
    attrLine('limit', a.limit),
    attrLine('go-to-buttons', a.goToButtons),
    boolLine('hide-ellipsis', a.hideEllipsis),
    boolLine('hide-go-to-buttons', a.hideGoToButtons),
    boolLine('items-per-page', a.itemsPerPage),
    boolLine('display-total-number-of-pages', a.displayTotalNumberOfPages),
    attrLine('pagination-layout', a.paginationLayout),
    attrLine('pagination-variant-color', a.paginationVariantColor),
    boolLine('plumage', a.plumage),
    attrLine('size', a.size),
    attrLine('table-id', a.tableId),
    attrLine('position', a.position),
    attrLine('pagination-aria-label', a.paginationAriaLabel),
    attrLine('page-size-label', a.pageSizeLabel),
    attrLine('page-size-help-text', a.pageSizeHelpText),
  ].filter(Boolean);

  return lines.length ? `\n${lines.join('\n')}` : '';
};

export const buildComponentTag = (tagName, a, { id } = {}) => {
  const idAttr = id ? ` id="${id}"` : '';
  const attrs = buildAttrsBlock(a);
  return `<${tagName}${idAttr}${attrs}\n></${tagName}>`;
};

export const buildItemsPerPageOptionsScript = (hostId, itemsPerPageOptions) => {
  const json = JSON.stringify(itemsPerPageOptions);
  return `
<script>
  (() => {
    const el = document.getElementById('${hostId}');
    if (el) el.itemsPerPageOptions = ${json};
  })();
</script>`;
};

export const buildDocsTransform = (src, context) => {
  const { name: storyName, args } = context;
  const safeArgs = sanitizeArgs(args);

  const buildInlineCode = (a) => normalizeHtml(buildComponentTag('pagination-component', a));

  const buildPlaygroundCode = (a) => {
    const needsArray = shouldIncludeItemsPerPageOptions(a);
    const hostId = 'pagination-playground';
    const tag = buildComponentTag('pagination-component', a, { id: needsArray ? hostId : '' });

    if (!needsArray) return normalizeHtml(tag);

    return normalizeHtml(`${tag}\n${buildItemsPerPageOptionsScript(hostId, a.itemsPerPageOptions)}`);
  };

  switch (storyName) {
    case 'Items Per Page':
    case 'Plumage Styling':
    case 'Layouts':
    case 'LimitAndGoto':
    case 'MinimizeComponent':
    case 'ByPageComponent':
    case 'SmallAndLarge':
    case 'ColorVariants':
    case 'With Display Range':
    case 'AccessibilityMatrix':
      return src;

    case 'Playground':
      return buildPlaygroundCode(safeArgs);

    case 'Standard':
      return buildInlineCode(safeArgs);

    default:
      return src;
  }
};

export const template = (rawArgs) => {
  const args = sanitizeArgs(rawArgs);
  const hostId = `pagination-${Math.random().toString(36).slice(2, 9)}`;

  const tag = buildComponentTag('pagination-component', args, { id: hostId });

  const arrayScript = shouldIncludeItemsPerPageOptions(args)
    ? buildItemsPerPageOptionsScript(hostId, args.itemsPerPageOptions)
    : '';

  const eventScript = `
  <!-- For Storybook Playground: log pagination events to console. -->
<script>
  (() => {
    const el = document.getElementById('${hostId}');
    if (!el) return;
    const log = (type, detail) => console.log('[pagination event]', type, detail);

    el.addEventListener('page-changed', e => log('page-changed', e.detail));
    el.addEventListener('page-size-changed', e => log('page-size-changed', e.detail));
  })();
</script>`;

  return normalizeHtml(`${tag}${arrayScript ? `\n${arrayScript}` : ''}\n${eventScript}`);
};

export function pickAttrs(el, names) {
  const out = {};
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

export function splitIds(v) {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function resolveIdsWithin(host, ids) {
  const res = {};
  for (const id of ids) {
    const safe = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const node = host.querySelector(`[id="${safe}"]`);
    res[id] = !!node;
  }
  return res;
}

export function snapshotA11y(host) {
  const nav = host.querySelector('nav');
  const ul = host.querySelector('ul.pagination');
  const range = host.querySelector('[id^="pageRange-"]');
  const label = host.querySelector('.size-changer label');
  const select = host.querySelector('.size-changer select');

  const describedByIds = select ? splitIds(select.getAttribute('aria-describedby')) : [];

  return {
    nav: nav
      ? {
          tag: nav.tagName.toLowerCase(),
          ...pickAttrs(nav, ['aria-label']),
        }
      : null,
    paginationList: ul
      ? {
          tag: ul.tagName.toLowerCase(),
          role: ul.getAttribute('role') || '',
          ...pickAttrs(ul, ['aria-label', 'aria-disabled']),
        }
      : null,
    range: range
      ? {
          id: range.getAttribute('id') || '',
          role: range.getAttribute('role') || '',
          ...pickAttrs(range, ['aria-live', 'aria-atomic']),
          text: (range.textContent || '').trim(),
        }
      : null,
    pageSize: select
      ? {
          label: label
            ? {
                text: (label.textContent || '').trim(),
                for: label.getAttribute('for') || '',
              }
            : null,
          select: {
            id: select.getAttribute('id') || '',
            tag: select.tagName.toLowerCase(),
            ...pickAttrs(select, ['aria-describedby']),
            resolves: {
              'aria-describedby': resolveIdsWithin(host, describedByIds),
            },
          },
        }
      : null,
  };
}

export function buildMatrixEl(args) {
  const el = document.createElement('pagination-component');
  Object.assign(el, args);

  if (!el.tableId) el.tableId = args.tableId || 'matrix';
  if (!el.position) el.position = args.position || 'bottom';

  if (Array.isArray(args.itemsPerPageOptions)) {
    el.itemsPerPageOptions = args.itemsPerPageOptions;
  }

  el.addEventListener('page-changed', (e) => console.log('[page-changed]', e.detail));
  el.addEventListener('page-size-changed', (e) => console.log('[page-size-changed]', e.detail));

  return el;
}

export function renderMatrixRow({ title, args, idSuffix }) {
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
  stage.style.maxWidth = '720px';

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role/id…';

  const el = buildMatrixEl({
    ...args,
    tableId: `pg-matrix-${idSuffix}`,
    position: 'bottom',
  });

  stage.appendChild(el);

  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  const update = () => {
    const snap = snapshotA11y(el);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}
