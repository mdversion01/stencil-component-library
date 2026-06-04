// File: src/stories/minimize-pagination-component.stories.js

import DocsPage from './minimize-pagination-component.docs.mdx';
import {
  buildDocsTransform,
  normalizeHtml,
  renderMatrixRow,
  template,
} from './minimize-pagination-component.story-helpers.js';

const minimizedArgs = {
  controlId: 'orders-table',
  currentPage: 1,
  displayTotalNumberOfPages: false,
  goToButtons: '',
  itemsPerPage: false,
  itemsPerPageOptions: [10, 20, 50, 100, 'All'],
  pageSize: 10,
  paginationLayout: 'center',
  plumage: false,
  size: '',
  totalRows: 100,
  paginationAriaLabel: 'Pagination',
  pageSizeLabel: 'Items per page:',
  pageSizeHelpText: 'Use this control to change how many items are shown per page.',
};

export default {
  title: 'Components/Pagination/Minimized',
  tags: ['autodocs'],
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
        component: ['The Minimized pagination component provides a user interface for navigating through pages of content.', ''].join('\n'),
      },
    },
  },
  argTypes: {
    controlId: {
      control: 'text',
      name: 'control-id',
      description: 'Sets aria-controls target; defaults to host id.',
      table: { category: 'Accessibility' },
    },

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
        icon: 'Icon',
        text: 'Text',
      },
      name: 'go-to-buttons',
      description: 'Go-to buttons. Omit to use component default.',
      table: { category: 'Display' },
    },

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

    plumage: {
      control: 'boolean',
      description: 'Enable Plumage styling.',
      table: { category: 'Styling', defaultValue: { summary: false } },
    },
  },
};

export const Minimized = {
  name: 'Minimized',
  render: args => template(args),
  args: {
    ...minimizedArgs,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Minimized pagination component with default settings. This example shows basic usage and configuration options. It does not display page number buttons, focusing instead on essential navigation controls, such as first/previous/next/last buttons.',
      },
    },
  },
};

export const GoToButtonsText = {
  name: 'Go-To Buttons: Text',
  render: () =>
    normalizeHtml(`
<minimize-pagination-component
  current-page="6"
  total-rows="200"
  page-size="10"
  go-to-buttons="text"
  pagination-layout="center"
></minimize-pagination-component>
`),
  parameters: {
    docs: {
      description: {
        story: 'Minimized pagination component with "text" go-to buttons and centered layout. "icon" is the default if go-to-buttons is omitted.',
      },
    },
  },
};

export const Layouts = {
  name: 'Layouts',
  render: () =>
    normalizeHtml(`
<div style="display:grid; gap:16px;">
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="start"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="center"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="start" display-total-number-of-pages></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end" display-total-number-of-pages></minimize-pagination-component>
</div>
`),
  parameters: {
    docs: {
      source: {
        code: normalizeHtml(`
<div style="display:grid; gap:16px;">
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="start"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="center"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="start" display-total-number-of-pages></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end" display-total-number-of-pages></minimize-pagination-component>
</div>
`),
        language: 'html',
      },
      description: {
        story: 'Pagination component showing different layout options including start, center, and end.',
      },
    },
  },
};

export const SmallAndLargeSizes = {
  name: 'Small and Large Sizes',
  render: () =>
    normalizeHtml(`
<div style="display:grid; gap:16px;">
  <minimize-pagination-component current-page="1" total-rows="80" page-size="10" size="sm"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="120" page-size="10" size="lg"></minimize-pagination-component>
</div>
`),
  parameters: {
    docs: {
      source: {
        code: normalizeHtml(`
<div style="display:grid; gap:16px;">
  <minimize-pagination-component current-page="1" total-rows="80" page-size="10" size="sm"></minimize-pagination-component>
  <minimize-pagination-component current-page="1" total-rows="120" page-size="10" size="lg"></minimize-pagination-component>
</div>
`),
        language: 'html',
      },
      description: {
        story: 'Pagination component demonstrating small (`size="sm"`) and large (`size="lg"`) sizes. If the size is not set, the default size is used.',
      },
    },
  },
};

export const PlumageStyling = {
  name: 'Plumage Styling',
  render: () =>
    normalizeHtml(`
<minimize-pagination-component
  current-page="8"
  total-rows="250"
  page-size="10"
  size="lg"
  plumage
></minimize-pagination-component>
`),
  parameters: {
    docs: {
      source: {
        code: normalizeHtml(`
<minimize-pagination-component
  current-page="8"
  total-rows="250"
  page-size="10"
  size="lg"
  plumage
></minimize-pagination-component>
`),
        language: 'html',
      },
      description: {
        story: 'Pagination component with Plumage styling enabled (`plumage` attribute set). This applies the Plumage design system styles to the component.',
      },
    },
  },
};

export const WithControlId = {
  name: 'With Control Id',
  render: () =>
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
`),
  parameters: {
    docs: {
      source: {
        code: normalizeHtml(`
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
`),
        language: 'html',
      },
      description: {
        story: 'Pagination component with `control-id` set to link it to a specific results region for accessibility.',
      },
    },
  },
};

export const ItemsPerPage = {
  name: 'Items Per Page',
  render: () => {
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
  },
  parameters: {
    docs: {
      source: {
        code: (() => {
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
        })(),
        language: 'html',
      },
      description: {
        story: 'Pagination component with an items-per-page dropdown. Adding `items-per-page` allows users to select how many rows are displayed per page.',
      },
    },
  },
};

export const WithRangeOnly = {
  name: 'With Range Only',
  render: () =>
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
`),
  parameters: {
    docs: {
      source: {
        code: normalizeHtml(`
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
`),
        language: 'html',
      },
      description: {
        story: 'Minimized pagination component in range-only mode (no size changer) with total number of pages displayed and layout aligned to the end.',
      },
    },
  },
};

export const StandaloneRangeAndSizer = {
  name: 'Standalone Range and Items Per Page selector',
  render: () => {
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
  },
  parameters: {
    docs: {
      source: {
        code: (() => {
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
        })(),
        language: 'html',
      },
      description: {
        story: 'Pagination component demonstrating both range display and items-per-page selector.',
      },
    },
  },
};

export const Playground = {
  name: 'Playground',
  render: args => template(args),
  args: {
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
    paginationAriaLabel: 'Pagination',
    pageSizeLabel: 'Items per page:',
    pageSizeHelpText: 'Use this control to change how many items are shown per page.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground. itemsPerPageOptions is applied via property assignment in the docs source transform.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
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
  },
  parameters: {
    docs: {
      description: {
        story:
          'Matrix of key states (default/inline/horizontal, no-rows “validation-ish”, at-start disabled-ish). Each row prints computed role/aria/ids and whether aria-describedby resolves.',
      },
      story: { height: '1400px' },
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
  },
};
