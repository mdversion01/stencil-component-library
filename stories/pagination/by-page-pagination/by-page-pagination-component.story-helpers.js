// File: src/stories/by-page-pagination-component.story-helpers.js

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
    attrLine('page-input-help-text', a.pageInputHelpText),
    attrLine('current-page', a.currentPage),
    attrLine('page-size', a.pageSize),
    attrLine('total-rows', a.totalRows),
    boolLine('display-total-number-of-pages', a.displayTotalNumberOfPages),
    attrLine('go-to-buttons', a.goToButtons),
    boolLine('items-per-page', a.itemsPerPage),
    attrLine('pagination-layout', a.paginationLayout),
    boolLine('plumage', a.plumage),
    attrLine('size', a.size),
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

  const buildByPageDefaultCode = (a) => {
    const needsArray = shouldIncludeItemsPerPageOptions(a);
    const hostId = 'bypage-default';
    const tag = buildComponentTag('by-page-pagination-component', a, { id: needsArray ? hostId : '' });

    if (!needsArray) return normalizeHtml(tag);

    return normalizeHtml(`${tag}\n${buildItemsPerPageOptionsScript(hostId, a.itemsPerPageOptions)}`);
  };

  switch (storyName) {
    case 'ByPageDefault':
      return buildByPageDefaultCode(args);

    case 'StandaloneRangeAndSizer':
      return src;

    default:
      return src;
  }
};

export const template = (args) => {
  const hostId = `bypage-${Math.random().toString(36).slice(2, 9)}`;

  const tag = buildComponentTag('by-page-pagination-component', args, { id: hostId });

  const arrayScript = shouldIncludeItemsPerPageOptions(args) ? buildItemsPerPageOptionsScript(hostId, args.itemsPerPageOptions) : '';

  const eventScript = `
<script>
  (() => {
    const el = document.getElementById('${hostId}');
    if (!el) return;
    el.addEventListener('change-page', e => {
      console.log('[by-page-pagination change-page]', e.detail);
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
  const range = host.querySelector('[id^="bppc-range-"]');
  const pageInput = host.querySelector('input.page-input');
  const pageLabel = pageInput ? host.querySelector(`[id="${pageInput.getAttribute('aria-labelledby') || ''}"]`) : null;

  const sizeLabel = host.querySelector('.size-changer label');
  const sizeSelect = host.querySelector('.size-changer select');

  const pageDescIds = pageInput ? splitIds(pageInput.getAttribute('aria-describedby')) : [];
  const sizeDescIds = sizeSelect ? splitIds(sizeSelect.getAttribute('aria-describedby')) : [];

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
          ...pickAttrs(ul, ['class']),
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
    pageInput: pageInput
      ? {
          id: pageInput.getAttribute('id') || '',
          tag: pageInput.tagName.toLowerCase(),
          type: pageInput.getAttribute('type') || '',
          min: pageInput.getAttribute('min') || '',
          max: pageInput.getAttribute('max') || '',
          ...pickAttrs(pageInput, ['aria-labelledby', 'aria-describedby']),
          labelNodeExists: !!pageLabel,
          resolves: {
            'aria-describedby': resolveIdsWithin(host, pageDescIds),
          },
        }
      : null,
    pageSize: sizeSelect
      ? {
          label: sizeLabel
            ? {
                text: (sizeLabel.textContent || '').trim(),
                for: sizeLabel.getAttribute('for') || '',
              }
            : null,
          select: {
            id: sizeSelect.getAttribute('id') || '',
            tag: sizeSelect.tagName.toLowerCase(),
            ...pickAttrs(sizeSelect, ['aria-describedby']),
            resolves: {
              'aria-describedby': resolveIdsWithin(host, sizeDescIds),
            },
          },
        }
      : null,
  };
}

export function buildMatrixEl(args) {
  const el = document.createElement('by-page-pagination-component');

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
  stage.style.maxWidth = '860px';

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
    controlId: `bppc-matrix-${idSuffix}`,
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
