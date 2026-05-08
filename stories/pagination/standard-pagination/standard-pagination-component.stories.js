import DocsPage from './standard-pagination-component.docs.mdx';
import {
  buildDocsTransform,
  normalizeHtml,
  renderMatrixRow,
  template,
} from './standard-pagination-component.story-helpers.js';

export default {
  title: 'Components/Pagination/Standard',
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
        component: 'The Standard pagination component provides a user interface for navigating through pages of content.',
      },
    },
  },
  argTypes: {
    controlId: {
      control: 'text',
      name: 'control-id',
      description: 'Optional id of the region this pagination controls. Used for aria-controls on nav buttons.',
      table: { category: 'Accessibility' },
    },
    paginationAriaLabel: {
      control: 'text',
      name: 'pagination-aria-label',
      description: 'ARIA label for the pagination <nav> landmark.',
      table: { category: 'Accessibility' },
    },
    pageSizeLabel: {
      control: 'text',
      name: 'page-size-label',
      description: 'Visible label text for the standalone items-per-page select.',
      table: { category: 'Accessibility' },
    },
    pageSizeHelpText: {
      control: 'text',
      name: 'page-size-help-text',
      description: 'Screen-reader-only help text referenced by aria-describedby for the standalone items-per-page select.',
      table: { category: 'Accessibility' },
    },

    currentPage: {
      control: { type: 'number', min: 1 },
      name: 'current-page',
      description: 'Current page (1-based).',
      table: { category: 'Paging State' },
    },
    totalRows: {
      control: { type: 'number', min: 0 },
      name: 'total-rows',
      description: 'Total rows; max pages derived from total-rows / page-size.',
      table: { category: 'Paging State' },
    },
    pageSize: {
      control: { type: 'number', min: 1 },
      name: 'page-size',
      description: 'Total number of rows per page.',
      table: { category: 'Paging State' },
    },

    paginationLayout: {
      control: { type: 'select' },
      options: ['', 'start', 'center', 'end', 'fill', 'fill-left', 'fill-right'],
      name: 'pagination-layout',
      description:
        'Pagination layout/alignment by setting the `pagination-layout` attribute to "start", "center", "end", "fill", "fill-left", or "fill-right".',
      table: { category: 'Display & Layout' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the pagination component. Omit to use default size.',
      name: 'size',
      table: { category: 'Display & Layout' },
    },
    paginationVariantColor: {
      control: 'text',
      name: 'pagination-variant-color',
      description: 'Color variant for pagination buttons.',
      table: { category: 'Display & Layout' },
    },

    goToButtons: {
      control: { type: 'select' },
      options: ['', 'icon', 'text'],
      description:
        'Go-to buttons are the First/Previous/Next/Last buttons. Set `go-to-buttons` to "icon" or "text". Omit to use component default.',
      name: 'go-to-buttons',
      table: { category: 'Go-To Buttons' },
    },
    hideGoToButtons: {
      control: 'boolean',
      name: 'hide-go-to-buttons',
      description: 'Hide the go-to first/prev/next/last buttons.',
      table: { category: 'Go-To Buttons', defaultValue: { summary: false } },
    },

    limit: {
      control: { type: 'number', min: 1 },
      description: 'Limit the number of numeric page buttons displayed.',
      name: 'limit',
      table: { category: 'Page Buttons & Ellipsis' },
    },
    hideEllipsis: {
      control: 'boolean',
      name: 'hide-ellipsis',
      description: 'Hide the ellipsis (…) when limiting numeric page buttons.',
      table: { category: 'Page Buttons & Ellipsis', defaultValue: { summary: false } },
    },

    displayTotalNumberOfPages: {
      control: 'boolean',
      name: 'display-total-number-of-pages',
      description: 'Standalone only: render range text (e.g., "1-10 of 123").',
      table: { category: 'Standalone Features', defaultValue: { summary: false } },
    },
    itemsPerPage: {
      control: 'boolean',
      name: 'items-per-page',
      description: 'Standalone only: render size changer inside this component.',
      table: { category: 'Standalone Features', defaultValue: { summary: false } },
    },
    itemsPerPageOptions: {
      control: 'object',
      description: 'Standalone only: options array (applied via property assignment).',
      name: 'items-per-page-options',
      table: { category: 'Standalone Features' },
    },

    plumage: {
      control: 'boolean',
      description: 'If true, applies plumage styling to the pagination component.',
      table: { category: 'Styling Mode', defaultValue: { summary: false } },
    },
  },
};

const Template = (args) => template(args);

export const Standard = Template.bind({});
Standard.args = {
  controlId: '',
  paginationAriaLabel: 'Pagination',
  pageSizeLabel: 'Items per page:',
  pageSizeHelpText: 'Use this control to change how many items are shown per page.',
  currentPage: 1,
  totalRows: 100,
  pageSize: 10,
  paginationLayout: 'center',
  size: '',
  paginationVariantColor: '',
  goToButtons: '',
  hideGoToButtons: false,
  limit: 3,
  hideEllipsis: false,
  displayTotalNumberOfPages: false,
  itemsPerPage: false,
  itemsPerPageOptions: [10, 20, 50, 100, 'All'],
  plumage: false,
};
Standard.parameters = {
  docs: {
    description: {
      story: 'Standard pagination component with numeric page buttons along with First/Previous/Next/Last go-to buttons.',
    },
  },
};

export const ItemsPerPage = () => {
  const idEnd = 'stdpg-sizechanger-end';
  const idStart = 'stdpg-sizechanger-start';
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
        'Pagination component with an items-per-page dropdown. Adding `items-per-page` allows users to select how many rows are displayed per page.',
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
        'Pagination component showing the display range of items (e.g. "151-175 of 750"), useful when you want range info without enabling items-per-page.',
    },
  },
};

export const Layouts = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="start" limit="3"></standard-pagination-component>
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="center" limit="3"></standard-pagination-component>
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="end" limit="3"></standard-pagination-component>
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="fill-left" display-total-number-of-pages limit="3"></standard-pagination-component>
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="fill-right" display-total-number-of-pages limit="3"></standard-pagination-component>
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-layout="fill" limit="3"></standard-pagination-component>
</div>
`);
Layouts.parameters = {
  docs: {
    source: { code: Layouts(), language: 'html' },
    description: {
      story: 'Pagination component showing different layout options including start, center, end, fill-left, fill-right, and fill.',
    },
  },
};

export const LimitAndGoTo = () =>
  normalizeHtml(`
<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Displays icon buttons for First/Previous/Next/Last.</div>
  <pagination-component
    current-page="1"
    total-rows="100"
    page-size="10"
    limit="3"
  ></pagination-component>
</div>

<div style="margin-bottom: 20px">
  <div style="font-size: 12px">Displays text buttons for First/Previous/Next/Last.</div>
  <pagination-component
    current-page="1"
    total-rows="100"
    page-size="10"
    limit="3"
    go-to-buttons="text"
  ></pagination-component>
</div>
`);
LimitAndGoTo.parameters = {
  docs: {
    source: { code: LimitAndGoTo(), language: 'html' },
    description: {
      story:
        'Pagination component demonstrating `limit` (restrict numeric buttons) along with `go-to-buttons="text"`, which displays "First/Previous/Next/Last" as text buttons. "icon" displays icons instead.',
    },
  },
};

export const hideGoToButtons = () =>
  normalizeHtml(`
<standard-pagination-component
  current-page="5"
  total-rows="150"
  page-size="10"
  hide-go-to-buttons
></standard-pagination-component>
`);
hideGoToButtons.parameters = {
  docs: {
    source: { code: hideGoToButtons(), language: 'html' },
    description: { story: 'This hides the go-to First/Previous/Next/Last buttons via the `hide-go-to-buttons` attribute.' },
  },
};

export const Plumage = () =>
  normalizeHtml(`
<standard-pagination-component
  current-page="3"
  total-rows="100"
  page-size="10"
  plumage
  pagination-layout="center"
></standard-pagination-component>
`);
Plumage.storyName = 'Plumage Styling';
Plumage.parameters = {
  docs: {
    source: { code: Plumage(), language: 'html' },
    description: { story: 'Pagination component with Plumage styling enabled via the `plumage` attribute.' },
  },
};

export const HideEllipsis = () =>
  normalizeHtml(`
<standard-pagination-component
  current-page="9"
  total-rows="120"
  page-size="10"
  hide-ellipsis
  limit="3"
  pagination-layout="center"
></standard-pagination-component>
`);
HideEllipsis.parameters = {
  docs: {
    source: { code: HideEllipsis(), language: 'html' },
    description: { story: 'Pagination component with ellipsis hidden via the `hide-ellipsis` attribute.' },
  },
};

export const SmallAndLarge = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <standard-pagination-component current-page="1" total-rows="80" page-size="10" size="sm"></standard-pagination-component>
  <standard-pagination-component current-page="6" total-rows="120" page-size="10" size="lg"></standard-pagination-component>
</div>
`);
SmallAndLarge.storyName = 'Small and Large Sizes';
SmallAndLarge.parameters = {
  docs: {
    source: { code: SmallAndLarge(), language: 'html' },
    description: {
      story:
        'Pagination component demonstrating small (`size="sm"`) and large (`size="lg"`) sizes. If the size is not set, the default size is used.',
    },
  },
};

export const VariantColors = () =>
  normalizeHtml(`
<div style="display:grid; gap:16px;">
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-variant-color="primary"></standard-pagination-component>
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-variant-color="success"></standard-pagination-component>
  <standard-pagination-component current-page="1" total-rows="100" page-size="10" pagination-variant-color="danger"></standard-pagination-component>
</div>
`);
VariantColors.parameters = {
  docs: {
    source: { code: VariantColors(), language: 'html' },
    description: {
      story:
        'Pagination component demonstrating different `pagination-variant-color` options like "primary", "success", "danger", and so on.',
    },
  },
};

export const StandaloneRangeAndSizer = () => {
  const id = 'stdpg-standalone';
  return normalizeHtml(`
<standard-pagination-component
  id="${id}"
  current-page="1"
  total-rows="420"
  page-size="10"
  items-per-page
  display-total-number-of-pages
  pagination-layout="start"
></standard-pagination-component>

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
      Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + IDs.
      Also reports whether <code>aria-describedby</code> resolves to real elements (range + select help text).
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
        limit: 5,
        goToButtons: 'icon',
        hideGoToButtons: false,
        hideEllipsis: false,
        displayTotalNumberOfPages: false,
        itemsPerPage: false,
        plumage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: '“Inline” (fill layout)',
      args: {
        currentPage: 2,
        totalRows: 90,
        pageSize: 10,
        paginationLayout: 'fill',
        limit: 5,
        goToButtons: 'icon',
        displayTotalNumberOfPages: false,
        itemsPerPage: false,
        plumage: false,
        paginationAriaLabel: 'Pagination',
      },
    },
    {
      title: '“Horizontal” (items-per-page + range, start)',
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
      title: 'Error/Validation-ish (no rows; sizer present)',
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
      title: 'Disabled-ish (at start; first/prev disabled)',
      args: {
        currentPage: 1,
        totalRows: 120,
        pageSize: 10,
        paginationLayout: 'center',
        goToButtons: 'text',
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
        'Matrix of key states (default/inline-ish/horizontal-ish, no-rows state, start-disabled state). Each row prints computed role/aria/ids and whether aria-describedby resolves.',
    },
    story: { height: '1400px' },
  },
  controls: { disable: true },
};
