// src/stories/minimize-pagination-component.stories.js

const boolLine = (name, on) => (on ? `  ${name}` : null);
const attrLine = (name, val) => (val === undefined || val === null || val === '' ? null : `  ${name}="${String(val)}"`);

const normalizeHtml = html => {
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

const shouldIncludeItemsPerPageOptions = a => Array.isArray(a?.itemsPerPageOptions) && a.itemsPerPageOptions.length > 0;

const buildAttrsBlock = a => {
  const lines = [
    attrLine('control-id', a.controlId),
    attrLine('current-page', a.currentPage),
    boolLine('display-total-number-of-pages', a.displayTotalNumberOfPages),
    attrLine('go-to-buttons', a.goToButtons),
    boolLine('items-per-page', a.itemsPerPage),
    attrLine('page-size', a.pageSize),
    attrLine('pagination-layout', a.paginationLayout),
    boolLine('plumage', a.plumage),
    attrLine('size', a.size),
    attrLine('total-rows', a.totalRows),

    // ✅ NEW a11y props
    attrLine('pagination-aria-label', a.paginationAriaLabel),
    attrLine('page-size-label', a.pageSizeLabel),
    attrLine('page-size-help-text', a.pageSizeHelpText),
  ].filter(Boolean);

  return lines.length ? `\n${lines.join('\n')}` : '';
};

const buildComponentTag = (tagName, a, { id } = {}) => {
  const idAttr = id ? ` id="${id}"` : '';
  const attrs = buildAttrsBlock(a);
  return `<${tagName}${idAttr}${attrs}\n></${tagName}>`;
};

const buildItemsPerPageOptionsScript = (hostId, itemsPerPageOptions) => {
  const json = JSON.stringify(itemsPerPageOptions);
  return `
<script>
  (() => {
    const el = document.getElementById('${hostId}');
    if (el) el.itemsPerPageOptions = ${json};
  })();
</script>`;
};

export default {
  title: 'Components/Pagination/Minimized',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (src, context) => {
          const { name: storyName, args } = context;

          const buildPlaygroundCode = a => {
            const needsArray = shouldIncludeItemsPerPageOptions(a);
            const hostId = 'minipg-playground';
            const tag = buildComponentTag('minimize-pagination-component', a, { id: needsArray ? hostId : '' });

            if (!needsArray) return normalizeHtml(tag);

            return normalizeHtml(`${tag}\n${buildItemsPerPageOptionsScript(hostId, a.itemsPerPageOptions)}`);
          };

          switch (storyName) {
            case 'Playground':
              return buildPlaygroundCode(args);

            // Exact literal code is provided for these (scripts)
            case 'StandaloneRangeAndSizer':
            case 'Range Only':
            case 'AccessibilityMatrix':
              return src;

            default:
              return src;
          }
        },
      },
      description: {
        component: ['The Minimized pagination component provides a user interface for navigating through pages of content.', ''].join('\n'),
      },
    },
  },
  argTypes: {
    /* -----------------------------
     Accessibility
    ------------------------------ */
    controlId: {
      control: 'text',
      name: 'control-id',
      description: 'Sets aria-controls target; defaults to host id.',
      table: { category: 'Accessibility' },
    },

    // ✅ NEW a11y props
    paginationAriaLabel: {
      control: 'text',
      name: 'pagination-aria-label',
      description: 'ARIA label for the <nav> landmark.',
      table: { category: 'Accessibility' },
    },
    pageSizeLabel: {
      control: 'text',
      name: 'page-size-label',
      description: 'Visible label text for the page-size <select> (standalone items-per-page).',
      table: { category: 'Accessibility' },
    },
    pageSizeHelpText: {
      control: 'text',
      name: 'page-size-help-text',
      description: 'SR-only help text referenced by aria-describedby on the page-size <select>.',
      table: { category: 'Accessibility' },
    },

    /* -----------------------------
     Data / Paging
    ------------------------------ */
    currentPage: {
      control: { type: 'number', min: 1 },
      name: 'current-page',
      description: 'Current page (1-based).',
      table: { category: 'Data / Paging' },
    },

    pageSize: {
      control: { type: 'number', min: 1 },
      name: 'page-size',
      description: 'Rows per page.',
      table: { category: 'Data / Paging' },
    },

    totalRows: {
      control: { type: 'number', min: 0 },
      name: 'total-rows',
      description: 'Total rows; max pages derived from total-rows / page-size.',
      table: { category: 'Data / Paging' },
    },

    limit: {
      control: { type: 'number', min: 1 },
      name: 'limit',
      description: 'Limit the number of numeric page buttons displayed.',
      table: { category: 'Data / Paging' },
    },

    /* -----------------------------
     Display
    ------------------------------ */
    displayTotalNumberOfPages: {
      control: 'boolean',
      name: 'display-total-number-of-pages',
      description: 'Show the display range text (e.g., "1-10 of 123").',
      table: { category: 'Display', defaultValue: { summary: false } },
    },

    hideEllipsis: {
      control: 'boolean',
      name: 'hide-ellipsis',
      description: 'Hide the ellipsis (...) when limiting numeric page buttons.',
      table: { category: 'Display', defaultValue: { summary: false } },
    },

    hideGoToButtons: {
      control: 'boolean',
      name: 'hide-go-to-buttons',
      description: 'Hide the go-to first/last buttons.',
      table: { category: 'Display', defaultValue: { summary: false } },
    },

    goToButtons: {
      control: { type: 'select' },
      options: ['', 'icon', 'text'],
      labels: {
        '': '(default / omit)',
        'icon': 'Icon',
        'text': 'Text',
      },
      name: 'go-to-buttons',
      description: 'Go-to buttons. Omit to use component default.',
      table: { category: 'Display' },
    },

    /* -----------------------------
     Items Per Page
    ------------------------------ */
    itemsPerPage: {
      control: 'boolean',
      name: 'items-per-page',
      description: 'Render the items-per-page size changer inside this component.',
      table: { category: 'Items Per Page', defaultValue: { summary: false } },
    },

    itemsPerPageOptions: {
      control: 'object',
      name: 'items-per-page-options',
      description: 'Options array (applied via property assignment). Example: [10,20,50,100,"All"].',
      table: { category: 'Items Per Page' },
    },

    /* -----------------------------
     Layout & Sizing
    ------------------------------ */
    paginationLayout: {
      control: { type: 'select' },
      options: ['', 'start', 'center', 'end'],
      name: 'pagination-layout',
      description: 'Pagination alignment: start, center, or end. Defaults to "start".',
      table: { category: 'Layout & Sizing' },
    },

    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      description: 'Size of the pagination component. Omit for default.',
      table: { category: 'Layout & Sizing' },
    },

    /* -----------------------------
     Styling
    ------------------------------ */
    plumage: {
      control: 'boolean',
      description: 'Enable Plumage styling.',
      table: { category: 'Styling', defaultValue: { summary: false } },
    },
  },
};

/* ============================== Template (normalized output) ============================== */

const Template = args => {
  const hostId = `minipg-${Math.random().toString(36).slice(2, 9)}`;

  const tag = buildComponentTag('minimize-pagination-component', args, { id: hostId });

  const arrayScript = shouldIncludeItemsPerPageOptions(args)
    ? buildItemsPerPageOptionsScript(hostId, args.itemsPerPageOptions)
    : '';

  const eventScript = `
<script>
  (() => {
    const el = document.getElementById('${hostId}');
    if (!el) return;
    el.addEventListener('change-page', e => {
      console.log('[minimize-pagination change-page]', e.detail);
      if (e?.detail?.page != null) el.setAttribute('current-page', String(e.detail.page));
    });
  })();
</script>`;

  return normalizeHtml(`${tag}${arrayScript ? `\n${arrayScript}` : ''}\n${eventScript}`);
};

export const Minimized = Template.bind({});
Minimized.args = {
  controlId: 'orders-table',
  currentPage: 1,
  displayTotalNumberOfPages: false,
  goToButtons: '', // omit for default
  itemsPerPage: false,
  itemsPerPageOptions: [10, 20, 50, 100, 'All'],
  pageSize: 10,
  paginationLayout: 'center',
  plumage: false,
  size: '',
  totalRows: 100,

  // ✅ new props defaulted
  paginationAriaLabel: 'Pagination',
  pageSizeLabel: 'Items per page:',
  pageSizeHelpText: 'Use this control to change how many items are shown per page.',
};
Minimized.parameters = {
  docs: {
    description: {
      story:
        'Minimized pagination component with default settings. This example shows basic usage and configuration options. It does not display page number buttons, focusing instead on essential navigation controls, such as first/previous/next/last buttons.',
    },
  },
};

/* ============================== Focused Examples ============================== */

export const GoToButtonsText = () =>
  normalizeHtml(`
<minimize-pagination-component
  current-page="6"
  total-rows="200"
  page-size="10"
  go-to-buttons="text"
  pagination-layout="center"
></minimize-pagination-component>
`);
GoToButtonsText.storyName = 'Go-To Buttons: Text';
GoToButtonsText.parameters = {
  docs: {
    description: {
      story: 'Minimized pagination component with "text" go-to buttons and centered layout. "icon" is the default if go-to-buttons is omitted.',
    },
  },
};

export const Layouts = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="start"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="center"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10"  pagination-layout="start" display-total-number-of-pages></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end" display-total-number-of-pages></minimize-pagination-component>
</div>
`);
Layouts.parameters = {
  docs: {
    source: { code: Layouts(), language: 'html' },
    description: { story: 'Pagination component showing different layout options including start, center, and end.' },
  },
};

export const SmallAndLargeSizes = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <minimize-pagination-component current-page="1" total-rows="80" page-size="10" size="sm"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="120" page-size="10" size="lg"></minimize-pagination-component>
</div>
`);
SmallAndLargeSizes.storyName = 'Small and Large Sizes';
SmallAndLargeSizes.parameters = {
  docs: {
    source: { code: SmallAndLargeSizes(), language: 'html' },
    description: {
      story: 'Pagination component demonstrating small (`size="sm"`) and large (`size="lg"`) sizes. If the size is not set, the default size is used.',
    },
  },
};

export const PlumageStyling = () =>
  normalizeHtml(`
<minimize-pagination-component
  current-page="8"
  total-rows="250"
  page-size="10"
  size="lg"
  plumage
></minimize-pagination-component>
`);
PlumageStyling.parameters = {
  docs: {
    source: { code: PlumageStyling(), language: 'html' },
    description: {
      story: 'Pagination component with Plumage styling enabled (`plumage` attribute set). This applies the Plumage design system styles to the component.',
    },
  },
};

export const WithControlId = () =>
  normalizeHtml(`
<div>
  <div id="results-region" style="margin-bottom: 8px; font: 14px/1.2 system-ui;">
    Results region controlled by the paginator below.
  </div>

  <minimize-pagination-component
    current-page="10"
    total-rows="400"
    page-size="10"
    go-to-buttons="text"
    control-id="results-region"
  ></minimize-pagination-component>
</div>
`);
WithControlId.parameters = {
  docs: {
    source: { code: WithControlId(), language: 'html' },
    description: {
      story: 'Pagination component with `control-id` set to link it to a specific results region for accessibility.',
    },
  },
};

export const ItemsPerPage = () => {
  const idEnd = 'minipg-sizechanger-end';
  const idStart = 'minipg-sizechanger-start';
  return normalizeHtml(`
<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Pagination on the end.</div>
  <minimize-pagination-component
    id="${idEnd}"
    current-page="1"
    total-rows="420"
    page-size="20"
    items-per-page
    pagination-layout="end"
  ></minimize-pagination-component>
</div>

<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Pagination at the start.</div>
  <minimize-pagination-component
    id="${idStart}"
    current-page="1"
    total-rows="420"
    page-size="20"
    items-per-page
    pagination-layout="start"
  ></minimize-pagination-component>
</div>

<script>
  document.getElementById('${idEnd}').itemsPerPageOptions = [10, 20, 50, 100, 'All'];
  document.getElementById('${idStart}').itemsPerPageOptions = [10, 20, 50, 100, 'All'];
</script>
`);
};
ItemsPerPage.storyName = 'Items Per Page';
ItemsPerPage.parameters = {
  docs: {
    source: { code: ItemsPerPage(), language: 'html' },
    description: {
      story: 'Pagination component with an items-per-page dropdown. Adding `items-per-page` allows users to select how many rows are displayed per page.',
    },
  },
};

/* ============================== New: Range-only mode (no sizer) ============================== */

export const WithRangeOnly = () =>
  normalizeHtml(`
<div style="margin-bottom: 20px">
  <minimize-pagination-component
    current-page="1"
    total-rows="100"
    page-size="10"
    display-total-number-of-pages
    pagination-layout="start"
  ></minimize-pagination-component>
</div>

<div style="margin-bottom: 20px">
  <minimize-pagination-component
    current-page="1"
    total-rows="100"
    page-size="10"
    display-total-number-of-pages
    pagination-layout="end"
  ></minimize-pagination-component>
</div>
`);
WithRangeOnly.storyName = 'With Range Only';
WithRangeOnly.parameters = {
  docs: {
    source: { code: WithRangeOnly(), language: 'html' },
    description: {
      story: 'Minimized pagination component in range-only mode (no size changer) with total number of pages displayed and layout aligned to the end.',
    },
  },
};

/* ============================== Optional standalone-only demo ============================== */

export const StandaloneRangeAndSizer = () => {
  const id = 'minipg-standalone';
  return normalizeHtml(`
<minimize-pagination-component
  id="${id}"
  current-page="1"
  total-rows="420"
  page-size="10"
  items-per-page
  display-total-number-of-pages
  pagination-layout="start"
></minimize-pagination-component>

<script>
  document.getElementById('${id}').itemsPerPageOptions = [10, 20, 50, 100, 'All'];
</script>
`);
};
StandaloneRangeAndSizer.storyName = 'Standalone Range and Items Per Page selector';
StandaloneRangeAndSizer.parameters = {
  docs: {
    source: { code: StandaloneRangeAndSizer(), language: 'html' },
    description: { story: 'Pagination component demonstrating both range display and items-per-page selector.' },
  },
};

/* ============================== Playground (existing behavior) ============================== */

export const Playground = Template.bind({});
Playground.args = {
  controlId: 'orders-table',
  currentPage: 1,
  displayTotalNumberOfPages: true,
  goToButtons: '',
  itemsPerPage: true,
  itemsPerPageOptions: [10, 20, 50, 100, 'All'],
  pageSize: 10,
  paginationLayout: 'center',
  plumage: false,
  size: '',
  totalRows: 420,

  // ✅ new props
  paginationAriaLabel: 'Pagination',
  pageSizeLabel: 'Items per page:',
  pageSizeHelpText: 'Use this control to change how many items are shown per page.',
};
Playground.storyName = 'Playground';
Playground.parameters = {
  docs: {
    description: { story: 'Interactive playground. itemsPerPageOptions is applied via property assignment in the docs source transform.' },
  },
};

/* =============================================================================
   Accessibility Matrix
   - Same “other stories” layout: returns normalized HTML string markup.
   - Renders common variants (default/inline/horizontal, error/validation, disabled)
   - Prints computed role + aria-* + ids into <pre> blocks
   - Validates aria-describedby references exist
============================================================================= */

function pickAttrs(el, names) {
  const out = {};
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

function splitIds(v) {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function resolveIdsWithin(host, ids) {
  const res = {};
  for (const id of ids) {
    const safe = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const node = host.querySelector(`[id="${safe}"]`);
    res[id] = !!node;
  }
  return res;
}

function snapshotA11y(host) {
  const nav = host.querySelector('nav');
  const ul = host.querySelector('ul.pagination');
  const range = host.querySelector('[id^="mpc-range-"]');
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
          ...pickAttrs(ul, ['aria-label']),
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

// Build a live instance (Node) so we can inspect computed DOM
function buildMatrixEl(args) {
  const el = document.createElement('minimize-pagination-component');

  // set properties for correct runtime behavior
  Object.assign(el, args);

  // itemsPerPageOptions must be set as a property
  if (Array.isArray(args.itemsPerPageOptions)) {
    el.itemsPerPageOptions = args.itemsPerPageOptions;
  }

  // helpful: log events
  el.addEventListener('change-page', e => console.log('[minimize change-page]', e.detail));

  return el;
}

function renderMatrixRow({ title, args, idSuffix }) {
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
  stage.style.maxWidth = '820px';

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role/id…';

  // Use stable identifiers by forcing a deterministic host id + control-id.
  // Component IDs derive from controlId || host.id || uid
  const hostId = `mpc-matrix-${idSuffix}`;
  const controlId = `mpc-results-${idSuffix}`;

  const el = buildMatrixEl({
    ...args,
    controlId,
  });
  el.id = hostId;

  // Stage content
  stage.appendChild(el);

  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  const update = () => {
    const snap = snapshotA11y(el);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  // Wait for render
  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}

export const AccessibilityMatrix = () => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + IDs.
      Also reports whether <code>aria-describedby</code> resolves to real elements and shows the live range region.
    </div>
  `;
  root.appendChild(intro);

  const rows = [
    {
      title: 'Default (center)',
      args: {
        currentPage: 1,
        totalRows: 100,
        pageSize: 10,
        paginationLayout: 'center',
        displayTotalNumberOfPages: true,
        itemsPerPage: false,
        plumage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: '“Inline” (start, no range)',
      args: {
        currentPage: 2,
        totalRows: 90,
        pageSize: 10,
        paginationLayout: 'start',
        displayTotalNumberOfPages: false,
        itemsPerPage: false,
        plumage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: '“Horizontal-ish” (items-per-page + range, start)',
      args: {
        currentPage: 1,
        totalRows: 420,
        pageSize: 20,
        paginationLayout: 'start',
        displayTotalNumberOfPages: true,
        itemsPerPage: true,
        itemsPerPageOptions: [10, 20, 50, 100, 'All'],
        plumage: true,
        pageSizeLabel: 'Items per page:',
        pageSizeHelpText: 'Use this control to change how many items are shown per page.',
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: 'Error/Validation-ish (no rows: “All” disabled, range shows 0-0 of 0)',
      args: {
        currentPage: 1,
        totalRows: 0,
        pageSize: 10,
        paginationLayout: 'end',
        displayTotalNumberOfPages: true,
        itemsPerPage: true,
        itemsPerPageOptions: [10, 20, 'All'],
        plumage: false,
        pageSizeLabel: 'Items per page:',
        pageSizeHelpText: 'Use this control to change how many items are shown per page.',
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: 'Disabled-ish (at start: First/Prev disabled)',
      args: {
        currentPage: 1,
        totalRows: 120,
        pageSize: 10,
        paginationLayout: 'center',
        displayTotalNumberOfPages: false,
        itemsPerPage: false,
        plumage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
  ];

  rows.forEach((r, idx) => {
    root.appendChild(
      renderMatrixRow({
        ...r,
        idSuffix: String(idx + 1),
      }),
    );
  });

  return root;
};

AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of key states (default/inline/horizontal, no-rows “validation-ish”, at-start disabled-ish). Each row prints computed role/aria/ids and whether aria-describedby resolves.',
    },
    story: { height: '1400px' },
    // Provide literal code for docs, like the other multi-example stories
    source: {
      code: normalizeHtml(`
<div style="display:grid; gap:16px;">
  <!-- This story renders DOM nodes (not just HTML) so it can inspect computed role/aria/ids. -->
  <!-- See Canvas for the live matrix output. -->
</div>
`),
      language: 'html',
    },
  },
  controls: { disable: true },
};
