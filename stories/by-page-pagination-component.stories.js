// src/stories/by-page-pagination-component.stories.js

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
  title: 'Components/Pagination/By Page',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (src, context) => {
          const { name: storyName, args } = context;

          const buildByPageDefaultCode = a => {
            const needsArray = shouldIncludeItemsPerPageOptions(a);
            const hostId = 'bypage-default';
            const tag = buildComponentTag('by-page-pagination-component', a, { id: needsArray ? hostId : '' });

            if (!needsArray) return normalizeHtml(tag);

            return normalizeHtml(`${tag}\n${buildItemsPerPageOptionsScript(hostId, a.itemsPerPageOptions)}`);
          };

          switch (storyName) {
            case 'ByPageDefault':
              return buildByPageDefaultCode(args);

            // Exact literal code is provided for this one
            case 'StandaloneRangeAndSizer':
              return src;

            default:
              return src;
          }
        },
      },
      description: {
        component: ['The By Page pagination component provides a user interface for navigating through pages of content.', ''].join('\n'),
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

    /* -----------------------------
   Data & Paging
  ------------------------------ */
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

    /* -----------------------------
   Display Options
  ------------------------------ */
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
      description: 'Go-to buttons are the First/Previous/Next/Last buttons that are displayed by setting `go-to-buttons` to "icon" or "text". Omit to use component default.',
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

    /* -----------------------------
   Layout & Styling
  ------------------------------ */
    paginationLayout: {
      control: { type: 'select' },
      options: ['', 'start', 'center', 'end'],
      name: 'pagination-layout',
      description: 'Pagination layout/alignment by setting the `pagination-layout` attribute to "start", "center", or "end". Defaults to "start".',
      table: { category: 'Layout & Styling' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the pagination component. You can set the `size` attribute to "sm" for small or "lg" for large. Omit to use default size.',
      table: { category: 'Layout & Styling' },
    },
    plumage: {
      control: 'boolean',
      description: 'If true, applies plumage styling to the pagination component.',
      table: { category: 'Layout & Styling', defaultValue: { summary: false } },
    },
  },
};

/* ============================== Template (normalized output) ============================== */

const Template = args => {
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

export const ByPageDefault = Template.bind({});
ByPageDefault.args = {
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
};
ByPageDefault.parameters = {
  docs: { source: { code: Template(ByPageDefault.args), language: 'html' } },
  description: {
    story: 'Default By Page pagination component with center alignment.',
  },
};

/* ============================== Focused Examples ============================== */

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
  <by-page-pagination-component current-page="1" total-rows="100" page-size="10"  pagination-layout="start" display-total-number-of-pages></by-page-pagination-component>
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

/* ============================== Optional standalone-only demo ============================== */

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
