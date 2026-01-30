// src/stories/pagination-component.stories.js
import { useArgs } from '@storybook/preview-api';

let __isSyncingVariants = false;

const sanitizeArgs = (args = {}) => {
  const next = { ...args };

  if (next.useMinimizePagination && next.useByPagePagination) {
    // Match component precedence (minimize wins)
    next.useByPagePagination = false;
    return next;
  }

  if (next.useMinimizePagination) next.useByPagePagination = false;
  if (next.useByPagePagination) next.useMinimizePagination = false;

  return next;
};

const withExclusiveVariants = Story => {
  const [args, updateArgs] = useArgs();

  if (__isSyncingVariants) return Story();

  const { useMinimizePagination, useByPagePagination } = args || {};

  // Only patch when BOTH are true (i.e., an invalid state)
  if (useMinimizePagination && useByPagePagination) {
    __isSyncingVariants = true;

    // Match component precedence: minimize wins
    updateArgs({ useByPagePagination: false });

    // release lock next tick
    setTimeout(() => {
      __isSyncingVariants = false;
    }, 0);
  }

  return Story();
};

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
    boolLine('display-total-number-of-pages', a.displayTotalNumberOfPages),
    attrLine('go-to-buttons', a.goToButtons),
    boolLine('hide-ellipsis', a.hideEllipsis),
    boolLine('hide-go-to-buttons', a.hideGoToButtons),
    boolLine('items-per-page', a.itemsPerPage),
    attrLine('limit', a.limit),
    attrLine('page-size', a.pageSize),
    attrLine('pagination-layout', a.paginationLayout),
    attrLine('pagination-variant-color', a.paginationVariantColor),
    boolLine('plumage', a.plumage),
    attrLine('position', a.position),
    attrLine('size', a.size),
    attrLine('table-id', a.tableId),
    attrLine('total-rows', a.totalRows),
    boolLine('use-by-page-pagination', a.useByPagePagination),
    boolLine('use-minimize-pagination', a.useMinimizePagination),
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
        component: ['We use pagination to indicate a series of related content exists across multiple pages.', ''].join('\n'),
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'The current page number (1-based).',
      name: 'current-page',
    },
    displayTotalNumberOfPages: {
      control: 'boolean',
      description: 'Show the display range ("1-10 of 123"). Attribute: `display-total-number-of-pages`.',
      name: 'display-total-number-of-pages',
    },
    goToButtons: {
      control: { type: 'select' },
      options: ['', 'icon', 'text'],
      labels: {
        '': '(default / omit)',
        'icon': 'Icon (default behavior)',
        'text': 'Text',
      },
      description: 'Go-to buttons are the First/Previous/Next/Last buttons that are displayed by setting `go-to-buttons` to "icon" or "text". Omit to use component default.',
      name: 'go-to-buttons',
    },
    hideEllipsis: {
      control: 'boolean',
      description: 'Hide the ellipsis (...) when limiting numeric page buttons.',
      name: 'hide-ellipsis',
    },
    hideGoToButtons: {
      control: 'boolean',
      description: 'Hide the go-to first/last buttons.',
      name: 'hide-go-to-buttons',
    },
    itemsPerPage: {
      control: 'boolean',
      description: 'Show the items-per-page dropdown.',
      name: 'items-per-page',
    },
    itemsPerPageOptions: {
      control: 'object',
      description: 'Array of numbers or "All", e.g. [10,20,50,100,"All"] (applied via property assignment).',
      name: 'items-per-page-options',
    },
    limit: {
      control: { type: 'number', min: 1 },
      description: 'Maximum number of numeric page buttons to display.',
    },
    pageSize: {
      control: { type: 'number', min: 1 },
      description: 'Number of rows per page.',
      name: 'page-size',
    },
    paginationLayout: {
      control: { type: 'select' },
      options: ['', 'start', 'center', 'end', 'fill', 'fill-left', 'fill-right'],
      description: 'Pagination layout/alignment by setting the `pagination-layout` attribute to "start", "center", "end", "fill", "fill-left", or "fill-right".',
      name: 'pagination-layout',
    },
    paginationVariantColor: {
      control: 'text',
      description: 'Color variant for pagination buttons.',
      name: 'pagination-variant-color',
    },
    plumage: {
      control: 'boolean',
      description: 'Use Plumage styling.',
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'both'],
      description:
        "Position placement of the pagination component when used with the table component's `table-id`. It creates an id associated with the table for select id construction.",
    },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], description: 'Size of the pagination component. You can set the `size` attribute to "sm" for small or "lg" for large. Omit to use default size.' },
    tableId: {
      control: 'text',
      description: 'Associated table id (used for select id construction).',
      name: 'table-id',
    },
    totalRows: {
      control: { type: 'number', min: 0 },
      description: 'Total number of rows.',
      name: 'total-rows',
    },
    useByPagePagination: {
      control: 'boolean',
      description: 'Use "by page" variation (mutually exclusive, cannot be used with minimize).',
      name: 'use-by-page-pagination',
    },
    useMinimizePagination: {
      control: 'boolean',
      description: 'Use "minimize" variation (mutually exclusive, cannot be used with by page).',
      name: 'use-minimize-pagination',
    },
  },
};

/* ============================== Playground / Standard ============================== */

const Template = rawArgs => {
  const args = sanitizeArgs(rawArgs);
  const hostId = `pagination-${Math.random().toString(36).slice(2, 9)}`;

  const tag = buildComponentTag('pagination-component', args, { id: hostId });

  const arrayScript = shouldIncludeItemsPerPageOptions(args) ? buildItemsPerPageOptionsScript(hostId, args.itemsPerPageOptions) : '';

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

/* ============================== Focused examples ============================== */

export const Standard = Template.bind({});
Standard.args = {
  currentPage: 1,
  displayTotalNumberOfPages: false,
  goToButtons: '',
  hideEllipsis: false,
  hideGoToButtons: false,
  itemsPerPage: false,
  itemsPerPageOptions: [10, 20, 50, 100, 'All'],
  limit: 3,
  pageSize: 10,
  paginationLayout: 'center',
  paginationVariantColor: '',
  plumage: false,
  position: '',
  size: '',
  tableId: '',
  totalRows: 100, // 10 pages @ pageSize 10
  useByPagePagination: false,
  useMinimizePagination: false,
};
Standard.parameters = {
  docs: {
    source: { code: Template(Standard.args), language: 'html' },
    description: {
      story: 'Standard pagination component with numeric page buttons along with First/Previous/Next/Last go-to buttons.',
    },
  },
};

export const ItemsPerPage = () => {
  const id = 'pg-sizechanger';
  return normalizeHtml(`
<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Pagination on the end.</div>
  <pagination-component
    id="${id}"
    current-page="1"
    total-rows="420"
    page-size="20"
    items-per-page
    pagination-layout="end"
  ></pagination-component>
</div>

<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Pagination at the start.</div>
  <pagination-component
    id="${id}"
    current-page="1"
    total-rows="420"
    page-size="20"
    items-per-page
    pagination-layout="start"
  ></pagination-component>
</div>

<script>
  document.getElementById('${id}').itemsPerPageOptions = [10, 20, 50, 100, 'All'];
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
      story: 'Pagination component showing the display range of items (e.g. "151-175 of 750"), useful when you want range info without enabling items-per-page.',
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
    description: { story: 'Pagination component showing different layout options including start, center, end, fill-left, and fill-right.' },
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
        'Pagination component demonstrating `limit` (restrict numeric buttons) along with `go-to-buttons="text"`, which displays "First/Previous/Next/Last" as text buttons. "icon" displays icons instead.',
    },
  },
};

export const MinimizeComponent = () =>
  normalizeHtml(`
<pagination-component
  current-page="1"
  total-rows="180"
  page-size="10"
  use-minimize-pagination
></pagination-component>
`);
MinimizeComponent.parameters = {
  docs: {
    source: { code: MinimizeComponent(), language: 'html' },
    description: {
      story:
        'Pagination component using the minimize component via the `use-minimize-pagination` attribute. This displays only the "First/Previous/Next/Last" text or icon buttons.',
    },
  },
};

export const ByPageComponent = () =>
  normalizeHtml(`
<pagination-component
  current-page="10"
  total-rows="240"
  page-size="10"
  use-by-page-pagination
  size="sm"
  pagination-layout="center"
></pagination-component>

<pagination-component
  use-by-page-pagination
  current-page="5"
  total-rows="420"
  page-size="10"
  pagination-layout="center"
  go-to-buttons="text"
></pagination-component>

<pagination-component
  use-by-page-pagination
  current-page="5"
  total-rows="420"
  page-size="10"
  pagination-layout="center"
  go-to-buttons="text"
  size="lg"
></pagination-component>
`);
ByPageComponent.parameters = {
  docs: {
    source: { code: ByPageComponent(), language: 'html' },
    description: {
      story: 'Pagination component using the "by page" component via the `use-by-page-pagination` attribute. This displays a page input for direct navigation.',
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
  use-by-page-pagination
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
    description: {
      story: 'Pagination component using the "plumage" style variant via the `plumage` attribute. This displays pagination with additional styling and features.',
    },
  },
};

export const SmallAndLarge = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <pagination-component current-page="1" total-rows="80" page-size="10" size="sm"></pagination-component>
  <pagination-component current-page="6" total-rows="120" page-size="10" size="lg"></pagination-component>
</div>
`);
SmallAndLarge.storyName = 'Small and Large Sizes';
SmallAndLarge.parameters = {
  docs: {
    source: { code: SmallAndLarge(), language: 'html' },
    description: {
      story: 'Pagination component demonstrating small (`size="sm"`) and large (`size="lg"`) sizes. If the size is not set, the default size is used.',
    },
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
ColorVariants.parameters = {
  docs: { source: { code: ColorVariants(), language: 'html' } },
};

export const Playground = Template.bind({});
Playground.args = {
  currentPage: 1,
  totalRows: 240,
  pageSize: 10,

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

  useMinimizePagination: false,
  useByPagePagination: false,

  tableId: 'orders',
  position: 'bottom',
};
Playground.parameters = {
  docs: { source: { code: Template(Playground.args), language: 'html' } },
};
