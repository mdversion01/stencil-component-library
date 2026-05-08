import DocsPage from './by-page-pagination-component.docs.mdx';
import {
  buildDocsTransform,
  normalizeHtml,
  renderMatrixRow,
  template,
} from './by-page-pagination-component.story-helpers.js';

export default {
  title: 'Components/Pagination/By Page',
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
        component: ['The By Page pagination component provides a user interface for navigating through pages of content.', ''].join('\n'),
      },
    },
  },
  argTypes: {
    controlId: {
      control: 'text',
      name: 'control-id',
      description: 'Sets aria-controls target and stabilizes generated ids; defaults to host id.',
      table: { category: 'Accessibility' },
    },
    paginationAriaLabel: {
      control: 'text',
      name: 'pagination-aria-label',
      description: 'aria-label for the pagination nav landmark.',
      table: { category: 'Accessibility' },
    },
    pageSizeLabel: {
      control: 'text',
      name: 'page-size-label',
      description: 'Visible label text for the items-per-page select (standalone only).',
      table: { category: 'Accessibility' },
    },
    pageSizeHelpText: {
      control: 'text',
      name: 'page-size-help-text',
      description: 'SR-only help text announced via aria-describedby for the items-per-page select (standalone only).',
      table: { category: 'Accessibility' },
    },
    pageInputHelpText: {
      control: 'text',
      name: 'page-input-help-text',
      description: 'SR-only help text announced for the page number input.',
      table: { category: 'Accessibility' },
    },

    currentPage: {
      control: { type: 'number', min: 1 },
      name: 'current-page',
      description: 'Current page (1-based).',
      table: { category: 'Data & Paging' },
    },
    pageSize: {
      control: { type: 'number', min: 1 },
      name: 'page-size',
      description: 'Rows per page.',
      table: { category: 'Data & Paging' },
    },
    totalRows: {
      control: { type: 'number', min: 0 },
      name: 'total-rows',
      description: 'Total rows; max pages derived from total-rows / page-size.',
      table: { category: 'Data & Paging' },
    },

    displayTotalNumberOfPages: {
      control: 'boolean',
      name: 'display-total-number-of-pages',
      description: 'Standalone only: render range text (e.g., "1-10 of 123").',
      table: { category: 'Display Options', defaultValue: { summary: false } },
    },
    goToButtons: {
      control: { type: 'select' },
      options: ['', 'icon', 'text'],
      name: 'go-to-buttons',
      description:
        'Go-to buttons are the First/Previous/Next/Last buttons displayed by setting `go-to-buttons` to "icon" or "text". Omit to use default.',
      table: { category: 'Display Options' },
    },
    itemsPerPage: {
      control: 'boolean',
      name: 'items-per-page',
      description: 'Standalone only: render size changer inside this component.',
      table: { category: 'Display Options', defaultValue: { summary: false } },
    },
    itemsPerPageOptions: {
      control: 'object',
      name: 'items-per-page-options',
      description: 'Standalone only: options array (applied via property assignment).',
      table: { category: 'Display Options' },
    },

    paginationLayout: {
      control: { type: 'select' },
      options: ['', 'start', 'center', 'end'],
      name: 'pagination-layout',
      description:
        'Pagination layout/alignment by setting `pagination-layout` to "start", "center", or "end". Defaults to "start".',
      table: { category: 'Layout & Styling' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the pagination component. Set `size="sm"` or `size="lg"`, or omit for default.',
      table: { category: 'Layout & Styling' },
    },
    plumage: {
      control: 'boolean',
      description: 'If true, applies plumage styling to the pagination component.',
      table: { category: 'Layout & Styling', defaultValue: { summary: false } },
    },
  },
};

const Template = (args) => template(args);

export const ByPageDefault = Template.bind({});
ByPageDefault.args = {
  controlId: 'orders-table',
  paginationAriaLabel: 'Pagination',
  pageSizeLabel: 'Items per page:',
  pageSizeHelpText: 'Use this control to change how many items are shown per page.',
  pageInputHelpText: 'Type a page number and press Enter, or use the navigation buttons.',
  currentPage: 1,
  pageSize: 10,
  totalRows: 100,
  displayTotalNumberOfPages: false,
  goToButtons: '',
  itemsPerPage: false,
  itemsPerPageOptions: [10, 20, 50, 100, 'All'],
  paginationLayout: 'center',
  plumage: false,
  size: '',
};
ByPageDefault.parameters = {
  docs: { source: { code: Template(ByPageDefault.args), language: 'html' } },
  description: {
    story: 'Default By Page pagination component with center alignment.',
  },
};

export const GoToButtonsText = () =>
  normalizeHtml(`
<by-page-pagination-component
  current-page="6"
  total-rows="200"
  page-size="10"
  go-to-buttons="text"
  pagination-layout="center"
></by-page-pagination-component>
`);
GoToButtonsText.storyName = 'Go-To Buttons: Text';
GoToButtonsText.parameters = {
  docs: {
    description: {
      story: 'By Page pagination component with "text" go-to buttons and centered layout. "icon" is the default if go-to-buttons is omitted.',
    },
  },
};

export const Layouts = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <by-page-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="start"></by-page-pagination-component>
  <by-page-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="center"></by-page-pagination-component>
  <by-page-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end"></by-page-pagination-component>
  <by-page-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="start" display-total-number-of-pages></by-page-pagination-component>
  <by-page-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end" display-total-number-of-pages></by-page-pagination-component>
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
  <by-page-pagination-component current-page="1" total-rows="80" page-size="10" size="sm"></by-page-pagination-component>
  <by-page-pagination-component current-page="1" total-rows="120" page-size="10" size="lg"></by-page-pagination-component>
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
<by-page-pagination-component
  current-page="8"
  total-rows="100"
  page-size="10"
  size="lg"
  plumage
></by-page-pagination-component>
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

  <by-page-pagination-component
    current-page="10"
    total-rows="100"
    page-size="10"
    go-to-buttons="text"
    control-id="results-region"
  ></by-page-pagination-component>
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
  const idEnd = 'bypage-sizechanger-end';
  const idStart = 'bypage-sizechanger-start';
  return normalizeHtml(`
<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Pagination on the end.</div>
  <by-page-pagination-component
    id="${idEnd}"
    current-page="1"
    total-rows="100"
    page-size="20"
    items-per-page
    pagination-layout="end"
  ></by-page-pagination-component>
</div>

<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Pagination at the start.</div>
  <by-page-pagination-component
    id="${idStart}"
    current-page="1"
    total-rows="100"
    page-size="20"
    items-per-page
    pagination-layout="start"
  ></by-page-pagination-component>
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

export const WithRangeOnly = () =>
  normalizeHtml(`
<div style="margin-bottom: 20px">
  <by-page-pagination-component
    current-page="1"
    total-rows="100"
    page-size="10"
    display-total-number-of-pages
    pagination-layout="start"
  ></by-page-pagination-component>
</div>
<div style="margin-bottom: 20px">
  <by-page-pagination-component
    current-page="1"
    total-rows="100"
    page-size="10"
    display-total-number-of-pages
    pagination-layout="end"
  ></by-page-pagination-component>
</div>
`);
WithRangeOnly.storyName = 'With Range Only';
WithRangeOnly.parameters = {
  docs: {
    source: { code: WithRangeOnly(), language: 'html' },
    description: {
      story: 'By-page pagination component in range-only mode (no size changer) with total number of pages displayed and layout aligned to the end.',
    },
  },
};

export const StandaloneRangeAndSizer = () => {
  const id = 'bypage-standalone';
  return normalizeHtml(`
<by-page-pagination-component
  id="${id}"
  current-page="1"
  total-rows="420"
  page-size="10"
  items-per-page
  display-total-number-of-pages
  pagination-layout="start"
></by-page-pagination-component>

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

export const AccessibilityMatrix = () => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Renders common states and prints computed <code>role</code> + <code>aria-*</code> + IDs.
      Also reports whether <code>aria-describedby</code> resolves to real elements.
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
        plumage: false,
        size: '',
        goToButtons: '',
        displayTotalNumberOfPages: false,
        itemsPerPage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: '“Inline” (center + range enabled)',
      args: {
        currentPage: 2,
        totalRows: 90,
        pageSize: 10,
        paginationLayout: 'center',
        plumage: false,
        displayTotalNumberOfPages: true,
        itemsPerPage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: '“Horizontal” (start + items-per-page + range)',
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
      title: 'Error/Validation-ish (no rows: “All” disabled)',
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
      title: 'Disabled-ish (single page: nav buttons disabled by bounds)',
      args: {
        currentPage: 1,
        totalRows: 5,
        pageSize: 10,
        paginationLayout: 'center',
        displayTotalNumberOfPages: true,
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
        'Matrix of key states (default/inline-ish/range, items-per-page + range, no-rows, single-page bounds). Each row prints computed aria/role/ids and whether aria-describedby resolves.',
    },
    story: { height: '1400px' },
  },
  controls: { disable: true },
};
