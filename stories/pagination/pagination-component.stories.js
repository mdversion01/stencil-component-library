// File: src/stories/pagination-component.stories.js

import DocsPage from './pagination-component.docs.mdx';
import {
  buildDocsTransform,
  normalizeHtml,
  renderMatrixRow,
  sanitizeArgs,
  template,
  withExclusiveVariants,
} from './pagination-component.story-helpers.js';

export default {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  decorators: [withExclusiveVariants],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (src, context) => buildDocsTransform(src, context),
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

    variant: {
      control: { type: 'select' },
      options: ['standard', 'minimize', 'by-page'],
      description:
        'Preferred API: choose which paginator variant to render. If set to "minimize" or "by-page", legacy flags are ignored.',
      name: 'variant',
      table: { category: 'Variants', defaultValue: { summary: 'standard' } },
    },

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

const Template = (rawArgs) => template(rawArgs);

export const Standard = Template.bind({});
Standard.args = {
  currentPage: 1,
  pageSize: 10,
  totalRows: 100,
  variant: 'standard',
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
  paginationAriaLabel: 'Pagination',
  pageSizeLabel: 'Items per page:',
  pageSizeHelpText: 'Use this control to change how many items are shown per page.',
};
Standard.parameters = {
  docs: {
    source: { code: Template(Standard.args), language: 'html' },
    description: {
      story:
        'Standard pagination with numeric page buttons and optional go-to controls. Wrapped in a `<nav>` landmark with an accessible label.',
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
MinimizeComponent.storyName = 'Minimize Component';
MinimizeComponent.parameters = {
  docs: {
    source: { code: MinimizeComponent(), language: 'html' },
    description: {
      story:
        'Minimize variant: shows only go-to controls. First example uses `variant="minimize"` (preferred). Second shows the legacy attribute for backwards compatibility.',
    },
  },
};

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
ByPageComponent.storyName = 'By Page Component';
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
SmallAndLarge.storyName = 'Small And Large Sizes';
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
ColorVariants.storyName = 'Color Variants';
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
