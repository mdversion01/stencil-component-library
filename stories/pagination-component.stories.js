// src/stories/pagination-component.stories.js
import { useArgs } from '@storybook/preview-api';

let __isSyncingVariants = false;

/**
 * Normalize variant + legacy flags so the Controls panel can’t put the component
 * into an invalid mixed state.
 */
const sanitizeArgs = (args = {}) => {
  const next = { ...args };

  // If the new variant prop is set (non-standard), it wins and legacy flags should be off.
  if (next.variant && next.variant !== 'standard') {
    next.useMinimizePagination = false;
    next.useByPagePagination = false;
    return next;
  }

  // Legacy mutual exclusion (minimize wins by precedence, matching component)
  if (next.useMinimizePagination && next.useByPagePagination) {
    next.useByPagePagination = false;
  }
  if (next.useMinimizePagination) next.useByPagePagination = false;
  if (next.useByPagePagination) next.useMinimizePagination = false;

  return next;
};

const withExclusiveVariants = Story => {
  const [args, updateArgs] = useArgs();

  if (__isSyncingVariants) return Story();

  const { variant, useMinimizePagination, useByPagePagination } = args || {};

  // If new variant is set, force legacy off
  if (variant && variant !== 'standard' && (useMinimizePagination || useByPagePagination)) {
    __isSyncingVariants = true;
    updateArgs({ useMinimizePagination: false, useByPagePagination: false });
    setTimeout(() => {
      __isSyncingVariants = false;
    }, 0);
    return Story();
  }

  // Legacy mutual exclusion
  if (useMinimizePagination && useByPagePagination) {
    __isSyncingVariants = true;
    updateArgs({ useByPagePagination: false });
    setTimeout(() => {
      __isSyncingVariants = false;
    }, 0);
  }

  return Story();
};

// ----------------------------- docs helpers ---------------------------------

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
    attrLine('current-page', a.currentPage),
    attrLine('page-size', a.pageSize),
    attrLine('total-rows', a.totalRows),

    // New variant API (preferred)
    attrLine('variant', a.variant && a.variant !== 'standard' ? a.variant : ''),

    // Legacy flags (still supported)
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

    // A11y / labeling
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

// ----------------------------- story meta -----------------------------------

export default {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  decorators: [withExclusiveVariants],
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (src, context) => {
          const { name: storyName, args } = context;
          const safeArgs = sanitizeArgs(args);

          const buildInlineCode = a => normalizeHtml(buildComponentTag('pagination-component', a));

          const buildPlaygroundCode = a => {
            const needsArray = shouldIncludeItemsPerPageOptions(a);
            const hostId = 'pagination-playground';
            const tag = buildComponentTag('pagination-component', a, { id: needsArray ? hostId : '' });

            if (!needsArray) return normalizeHtml(tag);

            return normalizeHtml(`${tag}\n${buildItemsPerPageOptionsScript(hostId, a.itemsPerPageOptions)}`);
          };

          switch (storyName) {
            // These provide their own exact code via parameters.docs.source.code
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
        },
      },
      description: {
        component: [
          'We use pagination to indicate a series of related content exists across multiple pages.',
          'This wrapper can render Standard / Minimize / By-page variants.',
          '',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'The current page number (1-based).',
      name: 'current-page',
      table: { category: 'Pagination' },
    },

    pageSize: {
      control: { type: 'number', min: 1 },
      description: 'Number of rows per page.',
      name: 'page-size',
      table: { category: 'Pagination' },
    },

    totalRows: {
      control: { type: 'number', min: 0 },
      description: 'Total number of rows.',
      name: 'total-rows',
      table: { category: 'Pagination' },
    },

    // ✅ New preferred variant selector
    variant: {
      control: { type: 'select' },
      options: ['standard', 'minimize', 'by-page'],
      description:
        'Preferred API: choose which paginator variant to render. If set to "minimize" or "by-page", legacy flags are ignored.',
      name: 'variant',
      table: { category: 'Variants', defaultValue: { summary: 'standard' } },
    },

    // Legacy flags (kept for BC)
    useByPagePagination: {
      control: 'boolean',
      description: '(Legacy) Use "by page" variation. Deprecated: prefer `variant="by-page"`.',
      name: 'use-by-page-pagination',
      table: { category: 'Variants', defaultValue: { summary: false } },
    },

    useMinimizePagination: {
      control: 'boolean',
      description: '(Legacy) Use "minimize" variation. Deprecated: prefer `variant="minimize"`.',
      name: 'use-minimize-pagination',
      table: { category: 'Variants', defaultValue: { summary: false } },
    },

    displayTotalNumberOfPages: {
      control: 'boolean',
      description: 'Show the display range ("1-10 of 123"). Attribute: `display-total-number-of-pages`.',
      name: 'display-total-number-of-pages',
      table: { category: 'Display', defaultValue: { summary: false } },
    },

    itemsPerPage: {
      control: 'boolean',
      description: 'Show the items-per-page dropdown.',
      name: 'items-per-page',
      table: { category: 'Items Per Page', defaultValue: { summary: false } },
    },

    itemsPerPageOptions: {
      control: 'object',
      description: 'Array of numbers or "All", e.g. [10,20,50,100,"All"] (applied via property assignment).',
      name: 'items-per-page-options',
      table: { category: 'Items Per Page' },
    },

    limit: {
      control: { type: 'number', min: 1 },
      description: 'Maximum number of numeric page buttons to display.',
      name: 'limit',
      table: { category: 'Pagination' },
    },

    goToButtons: {
      control: { type: 'select' },
      options: ['', 'icon', 'text'],
      labels: {
        '': '(default / omit)',
        icon: 'Icon (default behavior)',
        text: 'Text',
      },
      description:
        'First/Previous/Next/Last buttons. Omit to use component default. "text" shows labels; "icon" shows icons.',
      name: 'go-to-buttons',
      table: { category: 'Pagination' },
    },

    hideEllipsis: {
      control: 'boolean',
      description: 'Hide the ellipsis (...) when limiting numeric page buttons.',
      name: 'hide-ellipsis',
      table: { category: 'Pagination', defaultValue: { summary: false } },
    },

    hideGoToButtons: {
      control: 'boolean',
      description: 'Hide the go-to first/last buttons.',
      name: 'hide-go-to-buttons',
      table: { category: 'Pagination', defaultValue: { summary: false } },
    },

    paginationLayout: {
      control: { type: 'select' },
      options: ['', 'start', 'center', 'end', 'fill', 'fill-left', 'fill-right'],
      description:
        'Layout/alignment of pagination and optional range/size controls. Use `pagination-layout` attribute.',
      name: 'pagination-layout',
      table: { category: 'Layout' },
    },

    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the pagination component. Omit to use default size.',
      name: 'size',
      table: { category: 'Layout' },
    },

    paginationVariantColor: {
      control: 'text',
      description: 'Color variant for pagination buttons (class token).',
      name: 'pagination-variant-color',
      table: { category: 'Styling' },
    },

    plumage: {
      control: 'boolean',
      description: 'Use Plumage styling.',
      name: 'plumage',
      table: { category: 'Styling', defaultValue: { summary: false } },
    },

    tableId: {
      control: 'text',
      description: 'Associated table id (used for select id construction).',
      name: 'table-id',
      table: { category: 'Table Integration' },
    },

    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'both'],
      description:
        'Position placement when used with table-id. Used for select/range id construction.',
      name: 'position',
      table: { category: 'Table Integration' },
    },

    // ✅ New a11y props
    paginationAriaLabel: {
      control: 'text',
      description: 'ARIA label for the pagination navigation landmark.',
      name: 'pagination-aria-label',
      table: { category: 'Accessibility', defaultValue: { summary: 'Pagination' } },
    },

    pageSizeLabel: {
      control: 'text',
      description: 'Visible label text for the page-size selector.',
      name: 'page-size-label',
      table: { category: 'Accessibility', defaultValue: { summary: 'Items per page:' } },
    },

    pageSizeHelpText: {
      control: 'text',
      description: 'SR-only help text referenced by the page-size select via aria-describedby.',
      name: 'page-size-help-text',
      table: { category: 'Accessibility' },
    },
  },
};

// -------------------------- Playground / Standard ---------------------------

const Template = rawArgs => {
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

// ----------------------------- Stories --------------------------------------

export const Standard = Template.bind({});
Standard.args = {
  currentPage: 1,
  pageSize: 10,
  totalRows: 100,

  // variant
  variant: 'standard',

  // legacy flags (kept off)
  useByPagePagination: false,
  useMinimizePagination: false,

  displayTotalNumberOfPages: false,
  itemsPerPage: false,
  itemsPerPageOptions: [10, 20, 50, 100, 'All'],

  limit: 3,
  goToButtons: '',
  hideEllipsis: false,
  hideGoToButtons: false,

  paginationLayout: 'center',
  paginationVariantColor: '',
  plumage: false,
  size: '',

  tableId: '',
  position: 'bottom',

  // a11y
  paginationAriaLabel: 'Pagination',
  pageSizeLabel: 'Items per page:',
  pageSizeHelpText: 'Use this control to change how many items are shown per page.',
};
Standard.parameters = {
  docs: {
    source: { code: Template(Standard.args), language: 'html' },
    description: {
      story:
        'Standard pagination with numeric page buttons and optional go-to controls. Wrapped in a <nav> landmark with an accessible label.',
    },
  },
};

export const ItemsPerPage = () => {
  const idEnd = 'pg-sizechanger-end';
  const idStart = 'pg-sizechanger-start';
  return normalizeHtml(`
<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Pagination on the end.</div>
  <pagination-component
    id="${idEnd}"
    current-page="1"
    total-rows="420"
    page-size="20"
    items-per-page
    pagination-layout="end"
    page-size-label="Items per page:"
    page-size-help-text="Use this control to change how many items are shown per page."
  ></pagination-component>
</div>

<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Pagination at the start.</div>
  <pagination-component
    id="${idStart}"
    current-page="1"
    total-rows="420"
    page-size="20"
    items-per-page
    pagination-layout="start"
    page-size-label="Items per page:"
    page-size-help-text="Use this control to change how many items are shown per page."
  ></pagination-component>
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
      story:
        'Pagination with items-per-page selector. The <select> uses a real <label for="..."> association plus SR-only help via aria-describedby.',
    },
  },
};

export const DisplayRangeOnly = () =>
  normalizeHtml(`
<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Display range only.</div>
  <pagination-component
    current-page="7"
    total-rows="750"
    page-size="25"
    display-total-number-of-pages
    pagination-layout="start"
  ></pagination-component>
</div>

<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Display range + go-to text.</div>
  <pagination-component
    current-page="7"
    total-rows="750"
    page-size="25"
    display-total-number-of-pages
    go-to-buttons="text"
    pagination-layout="end"
  ></pagination-component>
</div>
`);
DisplayRangeOnly.storyName = 'With Display Range';
DisplayRangeOnly.parameters = {
  docs: {
    source: { code: DisplayRangeOnly(), language: 'html' },
    description: {
      story:
        'Shows the polite live region range (role="status", aria-live="polite") so screen readers get updates when paging changes.',
    },
  },
};

export const Layouts = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <pagination-component current-page="2" total-rows="90" page-size="10" pagination-layout="start"></pagination-component>
  <pagination-component current-page="2" total-rows="90" page-size="10" pagination-layout="center"></pagination-component>
  <pagination-component current-page="2" total-rows="90" page-size="10" pagination-layout="end"></pagination-component>
  <pagination-component current-page="2" total-rows="90" page-size="10" pagination-layout="fill-left" display-total-number-of-pages></pagination-component>
  <pagination-component current-page="2" total-rows="90" page-size="10" pagination-layout="fill-right" display-total-number-of-pages></pagination-component>
</div>
`);
Layouts.parameters = {
  docs: {
    source: { code: Layouts(), language: 'html' },
    description: { story: 'Layout options: start, center, end, fill-left, fill-right.' },
  },
};

export const LimitAndGoto = () =>
  normalizeHtml(`
<pagination-component
  current-page="1"
  total-rows="100"
  page-size="10"
  limit="3"
  go-to-buttons="text"
></pagination-component>
`);
LimitAndGoto.storyName = 'Limit and Go-To Buttons';
LimitAndGoto.parameters = {
  docs: {
    source: { code: LimitAndGoto(), language: 'html' },
    description: {
      story:
        'Demonstrates `limit` (restrict numeric buttons) and `go-to-buttons="text"` for text-based navigation buttons.',
    },
  },
};

/**
 * ✅ Updated: Prefer variant="minimize" (legacy attribute still works; kept for compatibility).
 */
export const MinimizeComponent = () =>
  normalizeHtml(`
<pagination-component
  current-page="1"
  total-rows="180"
  page-size="10"
  variant="minimize"
></pagination-component>

<!-- Legacy (still supported) -->
<pagination-component
  current-page="1"
  total-rows="180"
  page-size="10"
  use-minimize-pagination
></pagination-component>
`);
MinimizeComponent.storyName = 'MinimizeComponent';
MinimizeComponent.parameters = {
  docs: {
    source: { code: MinimizeComponent(), language: 'html' },
    description: {
      story:
        'Minimize variant: shows only go-to controls. First example uses `variant="minimize"` (preferred). Second shows the legacy attribute for backwards compatibility.',
    },
  },
};

/**
 * ✅ Updated: Prefer variant="by-page" (legacy attribute still works; kept for compatibility).
 */
export const ByPageComponent = () =>
  normalizeHtml(`
<pagination-component
  variant="by-page"
  current-page="10"
  total-rows="240"
  page-size="10"
  size="sm"
  pagination-layout="center"
></pagination-component>

<pagination-component
  variant="by-page"
  current-page="5"
  total-rows="420"
  page-size="10"
  pagination-layout="center"
  go-to-buttons="text"
></pagination-component>

<pagination-component
  variant="by-page"
  current-page="5"
  total-rows="420"
  page-size="10"
  pagination-layout="center"
  go-to-buttons="text"
  size="lg"
></pagination-component>

<!-- Legacy (still supported) -->
<pagination-component
  use-by-page-pagination
  current-page="5"
  total-rows="420"
  page-size="10"
  pagination-layout="center"
></pagination-component>
`);
ByPageComponent.storyName = 'ByPageComponent';
ByPageComponent.parameters = {
  docs: {
    source: { code: ByPageComponent(), language: 'html' },
    description: {
      story:
        'By-page variant: includes a page number input for direct navigation. Preferred API is `variant="by-page"`; legacy attribute shown for compatibility.',
    },
  },
};

export const PlumageStyle = () => {
  const id = 'pg-plumage';
  return normalizeHtml(`
<pagination-component
  id="${id}"
  current-page="1"
  total-rows="260"
  page-size="20"
  items-per-page
  display-total-number-of-pages
  pagination-layout="start"
  plumage
></pagination-component>

<pagination-component
  variant="by-page"
  current-page="5"
  total-rows="420"
  page-size="10"
  pagination-layout="center"
  go-to-buttons="text"
  plumage
></pagination-component>

<script>
  document.getElementById('${id}').itemsPerPageOptions = [10, 20, 50, 100, 'All'];
</script>
`);
};
PlumageStyle.storyName = 'Plumage Styling';
PlumageStyle.parameters = {
  docs: {
    source: { code: PlumageStyle(), language: 'html' },
    description: { story: 'Plumage styling examples including items-per-page + range and by-page variant.' },
  },
};

export const SmallAndLarge = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <pagination-component current-page="1" total-rows="80" page-size="10" size="sm"></pagination-component>
  <pagination-component current-page="6" total-rows="120" page-size="10" size="lg"></pagination-component>
</div>
`);
SmallAndLarge.storyName = 'SmallAndLarge';
SmallAndLarge.parameters = {
  docs: {
    source: { code: SmallAndLarge(), language: 'html' },
    description: { story: 'Size examples for `sm` and `lg`.' },
  },
};

export const ColorVariants = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <pagination-component current-page="3" total-rows="120" page-size="10" pagination-variant-color="primary"></pagination-component>
  <pagination-component current-page="3" total-rows="120" page-size="10" pagination-variant-color="success"></pagination-component>
  <pagination-component current-page="3" total-rows="120" page-size="10" pagination-variant-color="danger"></pagination-component>
</div>
`);
ColorVariants.storyName = 'ColorVariants';
ColorVariants.parameters = {
  docs: {
    source: { code: ColorVariants(), language: 'html' },
    description: { story: 'Color variants via `pagination-variant-color`.' },
  },
};

export const Playground = Template.bind({});
Playground.args = {
  currentPage: 1,
  totalRows: 240,
  pageSize: 10,

  variant: 'standard',
  useMinimizePagination: false,
  useByPagePagination: false,

  displayTotalNumberOfPages: true,
  limit: 5,
  goToButtons: '',
  hideEllipsis: false,
  hideGoToButtons: false,
  itemsPerPage: true,
  itemsPerPageOptions: [10, 20, 50, 100, 'All'],
  size: '',
  paginationLayout: 'start',
  paginationVariantColor: '',
  plumage: false,

  tableId: 'orders',
  position: 'bottom',

  paginationAriaLabel: 'Pagination',
  pageSizeLabel: 'Items per page:',
  pageSizeHelpText: 'Use this control to change how many items are shown per page.',
};
Playground.parameters = {
  docs: {
    source: { code: Template(Playground.args), language: 'html' },
    description: { story: 'Playground for testing pagination component with controls.' },
  },
};

// ============================================================================
// Accessibility matrix
//  - Shows common variants and prints computed role + aria-* + ids
//  - Validates that aria-describedby references exist
//  - Uses stable IDs (table-id + position) so the select/range ids are predictable
// ============================================================================

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

function buildMatrixEl(args) {
  const el = document.createElement('pagination-component');

  // assign properties (Stencil runtime behavior)
  Object.assign(el, args);

  // ensure stable ids (select/range)
  if (!el.tableId) el.tableId = args.tableId || 'matrix';
  if (!el.position) el.position = args.position || 'bottom';

  // itemsPerPageOptions must be set as a property
  if (Array.isArray(args.itemsPerPageOptions)) {
    el.itemsPerPageOptions = args.itemsPerPageOptions;
  }

  // helpful: log events
  el.addEventListener('page-changed', e => console.log('[page-changed]', e.detail));
  el.addEventListener('page-size-changed', e => console.log('[page-size-changed]', e.detail));

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
    // make ids deterministic via tableId
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
      title: 'Default (Standard, center)',
      args: {
        variant: 'standard',
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
      title: '“Inline” (fill layout, range)',
      args: {
        variant: 'standard',
        currentPage: 2,
        totalRows: 90,
        pageSize: 10,
        paginationLayout: 'fill',
        displayTotalNumberOfPages: true,
        itemsPerPage: false,
        plumage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: '“Horizontal” (items-per-page + range, start)',
      args: {
        variant: 'standard',
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
      title: 'Error/Validation-ish (no rows: controls mostly disabled)',
      args: {
        variant: 'standard',
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
      title: 'Minimize variant',
      args: {
        variant: 'minimize',
        currentPage: 1,
        totalRows: 180,
        pageSize: 10,
        paginationLayout: 'center',
        displayTotalNumberOfPages: false,
        itemsPerPage: false,
        plumage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: 'By-page variant',
      args: {
        variant: 'by-page',
        currentPage: 5,
        totalRows: 420,
        pageSize: 10,
        paginationLayout: 'center',
        displayTotalNumberOfPages: false,
        itemsPerPage: false,
        plumage: true,
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
        'Matrix of key states (standard + layouts, items-per-page + range, no-rows state, minimize, by-page). Each row prints computed role/aria/ids and whether aria-describedby resolves.',
    },
    story: { height: '1400px' },
  },
  controls: { disable: true },
};
