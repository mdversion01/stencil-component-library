// File: src/stories/standard-pagination-component.story-helpers.js

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
    attrLine('control-id', a.controlId),
    attrLine('pagination-aria-label', a.paginationAriaLabel),
    attrLine('page-size-label', a.pageSizeLabel),
    attrLine('page-size-help-text', a.pageSizeHelpText),
    attrLine('current-page', a.currentPage),
    attrLine('total-rows', a.totalRows),
    attrLine('page-size', a.pageSize),
    attrLine('pagination-layout', a.paginationLayout),
    attrLine('size', a.size),
    attrLine('pagination-variant-color', a.paginationVariantColor),
    attrLine('go-to-buttons', a.goToButtons),
    boolLine('hide-go-to-buttons', a.hideGoToButtons),
    attrLine('limit', a.limit),
    boolLine('hide-ellipsis', a.hideEllipsis),
    boolLine('display-total-number-of-pages', a.displayTotalNumberOfPages),
    boolLine('items-per-page', a.itemsPerPage),
    boolLine('plumage', a.plumage),
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

  const buildPlaygroundCode = (a) => {
    const needsArray = shouldIncludeItemsPerPageOptions(a);
    const hostId = 'stdpg-playground';

    const tag = buildComponentTag('standard-pagination-component', a, { id: needsArray ? hostId : '' });

    if (!needsArray) return normalizeHtml(tag);

    return normalizeHtml(`${tag}\n${buildItemsPerPageOptionsScript(hostId, a.itemsPerPageOptions)}`);
  };

  const buildStandardCode = (a) => normalizeHtml(buildComponentTag('standard-pagination-component', a));

  switch (storyName) {
    case 'Playground':
      return buildPlaygroundCode(args);

    case 'Standard':
      return buildStandardCode(args);

    case 'StandaloneRangeAndSizer':
    case 'Items Per Page':
    case 'With Display Range':
    case 'Layouts':
    case 'LimitAndGoTo':
    case 'VariantColors':
    case 'AccessibilityMatrix':
      return src;

    default:
      return src;
  }
};

export const template = (args) => {
  const hostId = `stdpg-${Math.random().toString(36).slice(2, 9)}`;

  const needsArray = shouldIncludeItemsPerPageOptions(args);
  const id = hostId;
  const tag = buildComponentTag('standard-pagination-component', args, { id });

  const arrayScript = needsArray ? buildItemsPerPageOptionsScript(id, args.itemsPerPageOptions) : '';

  const eventScript = `
<script>
  (() => {
    const el = document.getElementById('${id}');
    if (!el) return;
    el.addEventListener('change-page', e => {
      console.log('[standard-pagination change-page]', e.detail);
      if (e?.detail?.page != null) el.setAttribute('current-page', String(e.detail.page));
    });
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
  const range = host.querySelector('[id^="spc-range-"]');
  const label = host.querySelector('.size-changer label');
  const select = host.querySelector('.size-changer select');

  const describedByIds = select ? splitIds(select.getAttribute('aria-describedby')) : [];
  const ulDescribedByIds = ul ? splitIds(ul.getAttribute('aria-describedby')) : [];

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
          ...pickAttrs(ul, ['aria-describedby']),
          resolves: {
            'aria-describedby': resolveIdsWithin(host, ulDescribedByIds),
          },
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
  const el = document.createElement('standard-pagination-component');
  Object.assign(el, args);

  if (Array.isArray(args.itemsPerPageOptions)) {
    el.itemsPerPageOptions = args.itemsPerPageOptions;
  }

  el.addEventListener('change-page', (e) => console.log('[change-page]', e.detail));

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
  });
  el.id = `spc-matrix-${idSuffix}`;

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
