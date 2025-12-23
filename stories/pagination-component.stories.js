// src/stories/pagination-component.stories.js

export default {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { source: { type: 'dynamic' } },
  },
  argTypes: {
    // Core paging
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    totalRows: { control: { type: 'number', min: 0 } },
    pageSize: { control: { type: 'number', min: 1 } },

    // Behavior/appearance
    limit: { control: { type: 'number', min: 1 }, description: 'Max numeric page buttons shown (standard variant).' },
    goToButtons: { control: 'text', description: 'Comma list of go-to labels, e.g. "first,last".' },
    hideEllipsis: { control: 'boolean' },
    hideGotoEndButtons: { control: 'boolean' },
    showDisplayRange: { control: 'boolean' },
    showSizeChanger: { control: 'boolean' },
    size: { control: { type: 'radio' }, options: ['', 'sm', 'lg'] },
    paginationLayout: {
      control: { type: 'radio' },
      options: ['', 'start', 'center', 'end', 'fill', 'fill-left', 'fill-right'],
    },
    paginationVariantColor: { control: 'text' },
    plumage: { control: 'boolean' },

    // Variants (mutually exclusive)
    useMinimizePagination: { control: 'boolean' },
    useByPagePagination: { control: 'boolean' },

    // Advanced
    tableId: { control: 'text' },
    position: { control: { type: 'radio' }, options: ['top', 'bottom', 'both'] },

    // Size changer options (array)
    pageSizeOptions: {
      control: 'object',
      description: 'Array of numbers or "All", e.g. [10,20,50,100,"All"]',
    },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) =>
  val === undefined || val === null || val === '' ? '' : ` ${name}="${String(val)}"`;

// Because pageSizeOptions is an Array prop, we apply it via script property assignment.
const applyArrayPropScript = (args, hostId) => {
  if (!args?.pageSizeOptions) return '';
  const json = JSON.stringify(args.pageSizeOptions);
  return `
<script>
  (() => {
    const el = document.getElementById('${hostId}');
    if (el) el.pageSizeOptions = ${json};
  })();
</script>`;
};

/* ============================== Playground ============================== */

const Template = args => {
  const hostId = `pagination-${Math.random().toString(36).slice(2, 9)}`;

  return `
<pagination-component
  id="${hostId}"
  ${attr('current-page', args.currentPage)}
  ${attr('total-pages', args.totalPages)}
  ${attr('total-rows', args.totalRows)}
  ${attr('page-size', args.pageSize)}

  ${attr('limit', args.limit)}
  ${attr('go-to-buttons', args.goToButtons)}
  ${boolAttr('hide-ellipsis', args.hideEllipsis)}
  ${boolAttr('hide-goto-end-buttons', args.hideGotoEndButtons)}
  ${boolAttr('show-display-range', args.showDisplayRange)}
  ${boolAttr('show-size-changer', args.showSizeChanger)}
  ${attr('size', args.size)}
  ${attr('pagination-layout', args.paginationLayout)}
  ${attr('pagination-variant-color', args.paginationVariantColor)}
  ${boolAttr('plumage', args.plumage)}

  ${boolAttr('use-minimize-pagination', args.useMinimizePagination)}
  ${boolAttr('use-by-page-pagination', args.useByPagePagination)}

  ${attr('table-id', args.tableId)}
  ${attr('position', args.position)}
></pagination-component>

${applyArrayPropScript(args, hostId)}

<script>
  // Log events for demo purposes
  (() => {
    const el = document.getElementById('${hostId}');
    if (!el) return;
    const log = (type, detail) => console.log('[pagination event]', type, detail);

    el.addEventListener('page-changed', e => log('page-changed', e.detail));
    el.addEventListener('page-size-changed', e => log('page-size-changed', e.detail));
  })();
</script>
`;
};

export const Playground = Template.bind({});
Playground.args = {
  // Data
  currentPage: 1,
  totalPages: 12,
  totalRows: 240,
  pageSize: 10,

  // Behavior/appearance
  limit: 5,
  goToButtons: '',
  hideEllipsis: false,
  hideGotoEndButtons: false,
  showDisplayRange: true,
  showSizeChanger: true,
  size: '',
  paginationLayout: 'start',
  paginationVariantColor: '',
  plumage: false,

  // Variants
  useMinimizePagination: false,
  useByPagePagination: false,

  // Advanced
  tableId: 'orders',
  position: 'bottom',

  // Array prop
  pageSizeOptions: [10, 20, 50, 100, 'All'],
};

/* ============================== Focused examples ============================== */

export const Standard = () => `
<pagination-component
  current-page="3"
  total-pages="15"
  total-rows="300"
  page-size="20"
  show-display-range
  pagination-layout="start"
></pagination-component>
`;

export const WithSizeChanger = () => {
  const id = 'pg-sizechanger';
  return `
<pagination-component
  id="${id}"
  current-page="1"
  total-rows="420"
  page-size="20"
  show-size-changer
  show-display-range
  pagination-layout="end"
></pagination-component>
<script>
  // Provide custom options including "All"
  document.getElementById('${id}').pageSizeOptions = [10, 20, 50, 100, 'All'];
</script>
`;
};

export const DisplayRangeOnlyFill = () => `
<pagination-component
  current-page="7"
  total-rows="750"
  page-size="25"
  show-display-range
  pagination-layout="fill"
></pagination-component>
`;

export const Layouts = () => `
<div style="display:grid; gap:16px;">
  <pagination-component current-page="2" total-pages="9" pagination-layout="start"></pagination-component>
  <pagination-component current-page="2" total-pages="9" pagination-layout="center"></pagination-component>
  <pagination-component current-page="2" total-pages="9" pagination-layout="end"></pagination-component>
  <pagination-component current-page="2" total-pages="9" pagination-layout="fill-left" show-display-range></pagination-component>
  <pagination-component current-page="2" total-pages="9" pagination-layout="fill-right" show-display-range></pagination-component>
</div>
`;

export const LimitAndGoto = () => `
<pagination-component
  current-page="5"
  total-pages="30"
  limit="3"
  go-to-buttons="first,last"
  hide-ellipsis="false"
  hide-goto-end-buttons="false"
></pagination-component>
`;

export const MinimizeVariant = () => `
<pagination-component
  current-page="4"
  total-pages="18"
  use-minimize-pagination
  show-display-range
></pagination-component>
`;

export const ByPageVariant = () => `
<pagination-component
  current-page="10"
  total-pages="24"
  use-by-page-pagination
  size="sm"
></pagination-component>
`;

export const PlumageStyle = () => {
  const id = 'pg-plumage';
  return `
<pagination-component
  id="${id}"
  current-page="1"
  total-rows="260"
  page-size="20"
  show-size-changer
  show-display-range
  pagination-layout="start"
  plumage
></pagination-component>
<script>
  document.getElementById('${id}').pageSizeOptions = [10, 20, 50, 100, 'All'];
</script>
`;
};

export const SmallAndLarge = () => `
<div style="display:grid; gap:16px;">
  <pagination-component current-page="1" total-pages="8" size="sm"></pagination-component>
  <pagination-component current-page="6" total-pages="12" size="lg"></pagination-component>
</div>
`;

export const ColorVariants = () => `
<div style="display:grid; gap:16px;">
  <pagination-component current-page="3" total-pages="12" pagination-variant-color="primary"></pagination-component>
  <pagination-component current-page="3" total-pages="12" pagination-variant-color="success"></pagination-component>
  <pagination-component current-page="3" total-pages="12" pagination-variant-color="danger"></pagination-component>
</div>
`;
