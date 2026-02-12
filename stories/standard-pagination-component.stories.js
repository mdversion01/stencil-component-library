// src/stories/standard-pagination-component.stories.js

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
  title: 'Components/Pagination/Standard',
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
            const hostId = 'stdpg-playground';

            const tag = buildComponentTag('standard-pagination-component', a, { id: needsArray ? hostId : '' });

            if (!needsArray) return normalizeHtml(tag);

            return normalizeHtml(`${tag}\n${buildItemsPerPageOptionsScript(hostId, a.itemsPerPageOptions)}`);
          };

          const buildStandardCode = a => normalizeHtml(buildComponentTag('standard-pagination-component', a));

          switch (storyName) {
            case 'Playground':
              return buildPlaygroundCode(args);

            case 'Standard':
              return buildStandardCode(args);

            // these provide exact literal code (scripts / multiple blocks)
            case 'StandaloneRangeAndSizer':
            case 'Items Per Page':
            case 'With Display Range':
            case 'Layouts':
            case 'LimitAndGoTo':
            case 'VariantColors':
              return src;

            default:
              return src;
          }
        },
      },
      description: {
        component: 'The Standard pagination component provides a user interface for navigating through pages of content.',
      },
    },
  },
  argTypes: {
    /* -----------------------------
     Paging State
  ------------------------------ */
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

    /* -----------------------------
     Display & Layout
  ------------------------------ */
    paginationLayout: {
      control: { type: 'select' },
      options: ['', 'start', 'center', 'end', 'fill', 'fill-left', 'fill-right'],
      name: 'pagination-layout',
      description: 'Pagination layout/alignment by setting the `pagination-layout` attribute to "start", "center", "end", "fill", "fill-left", or "fill-right".',
      table: { category: 'Display & Layout' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the pagination component. You can set the `size` attribute to "sm" for small or "lg" for large. Omit to use default size.',
      name: 'size',
      table: { category: 'Display & Layout' },
    },
    paginationVariantColor: {
      control: 'text',
      name: 'pagination-variant-color',
      description: 'Color variant for pagination buttons.',
      table: { category: 'Display & Layout' },
    },

    /* -----------------------------
     Go-To Buttons
  ------------------------------ */
    goToButtons: {
      control: { type: 'select' },
      options: ['', 'icon', 'text'],
      description: 'Go-to buttons are the First/Previous/Next/Last buttons that are displayed by setting `go-to-buttons` to "icon" or "text". Omit to use component default.',
      name: 'go-to-buttons',
      table: { category: 'Go-To Buttons' },
    },
    hideGoToButtons: {
      control: 'boolean',
      name: 'hide-go-to-buttons',
      description: 'Hide the go-to first/last buttons.',
      table: { category: 'Go-To Buttons', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Page Buttons & Ellipsis
  ------------------------------ */
    limit: {
      control: { type: 'number', min: 1 },
      description: 'Limit the number of numeric page buttons displayed.',
      name: 'limit',
      table: { category: 'Page Buttons & Ellipsis' },
    },
    hideEllipsis: {
      control: 'boolean',
      name: 'hide-ellipsis',
      description: 'Hide the ellipsis (...) when limiting numeric page buttons.',
      table: { category: 'Page Buttons & Ellipsis', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Standalone Features (Range / Sizer)
  ------------------------------ */
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

    /* -----------------------------
     Styling Mode
  ------------------------------ */
    plumage: {
      control: 'boolean',
      description: 'If true, applies plumage styling to the pagination component.',
      table: { category: 'Styling Mode', defaultValue: { summary: false } },
    },
  },
};

/* ============================== Playground + Standard ============================== */

const Template = args => {
  const hostId = `stdpg-${Math.random().toString(36).slice(2, 9)}`;

  const needsArray = shouldIncludeItemsPerPageOptions(args);
  const id = needsArray ? hostId : hostId; // keep id for event wiring
  const tag = buildComponentTag('standard-pagination-component', args, { id });

  const arrayScript = needsArray ? buildItemsPerPageOptionsScript(id, args.itemsPerPageOptions) : '';

  const eventScript = `
<script>
  (() => {
    const el = document.getElementById('${id}');
    if (!el) return;
    el.addEventListener('change-page', e => {
      console.log('[standard-pagination change-page]', e.detail);
      if (e?.detail?.page != null) el.setAttribute('current-page', String(e.detail.page));
    });
  })();
</script>`;

  return normalizeHtml(`${tag}${arrayScript ? `\n${arrayScript}` : ''}\n${eventScript}`);
};

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
  size: '',
  totalRows: 100,
};
Standard.parameters = {
  docs: {
    description: {
      story: 'Standard pagination component with numeric page buttons along with First/Previous/Next/Last go-to buttons.',
    },
  },
};

/* ============================== Focused Examples (unchanged except corrected attr) ============================== */

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
    description: { story: 'Pagination component showing different layout options including start, center, end, fill-left, fill-right, and fill.' },
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
      story: 'Pagination component demonstrating small (`size="sm"`) and large (`size="lg"`) sizes. If the size is not set, the default size is used.',
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
    description: { story: 'Pagination component demonstrating different `pagination-variant-color` options like "primary", "success", "danger", and so on.' },
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
