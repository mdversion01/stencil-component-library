// src/stories/table-component.stories.js

export default {
  title: 'Components/Table',
  tags: ['autodocs'],
  args: {
    // Styling
    addBorder: false,
    removeBorder: false,
    darkTableTheme: false,
    darkHeader: false,
    lightHeader: false,
    rowHover: false,
    noBorderCollapsed: false,
    plumage: false,
    striped: false,

    selectedVariant: 'table-active',
    size: '',
    tableVariant: 'table',

    // Layout
    caption: '',
    cloneFooter: false,
    fixedTableHeader: false,
    responsive: false,
    stacked: false,
    sticky: false,

    // Data / sorting / filtering
    filterText: '',
    sortField: 'none',
    sortOrder: 'asc',
    sortable: false,

    // Selection
    selectMode: '',

    // Pagination
    goToButtons: '',
    hideEllipsis: false,
    hideGotoEndButtons: false,
    paginationLayout: '',
    paginationLimit: 5,
    paginationPosition: 'bottom',
    paginationSize: '',
    paginationVariantColor: '',
    rowsPerPage: 10,
    showDisplayRange: false,
    showSizeChanger: false,

    // ✅ New API
    paginationEnabled: false,
    paginationVariant: 'standard',

    // Legacy
    usePagination: false,
  },

  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        // Show rendered output as HTML (string OR HTMLElement)
        transform: (_code, ctx) => normalizeHtml(toHtml(ctx.originalStoryFn(ctx.args))),
      },
      description: {
        component: 'A flexible and customizable table component with support for sorting, filtering, selection, pagination, and various styling options.',
      },
    },
  },

  argTypes: {
    /* -----------------------------
     Styling
  ------------------------------ */
    addBorder: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Adds borders to all table cells when true.',
      name: 'add-border',
    },
    removeBorder: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Removes all borders from the table when true.',
      name: 'remove-border',
    },
    darkTableTheme: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Applies a dark theme to the table when true.',
      name: 'dark-table-theme',
    },
    darkHeader: {
      control: 'boolean',
      name: 'dark-header',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Applies a dark theme to the table header when true.',
    },
    lightHeader: {
      control: 'boolean',
      name: 'light-header',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Applies a light theme to the table header when true.',
    },
    rowHover: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Enables hover effect on table rows when true.',
      name: 'row-hover',
    },
    noBorderCollapsed: {
      control: 'boolean',
      name: 'no-border-collapsed',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Removes borders when the table is collapsed.',
    },
    plumage: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Enables plumage style when true.',
    },
    striped: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Enables striped rows when true.',
    },
    selectedVariant: {
      control: 'text',
      name: 'selected-variant',
      description: 'Variant color for selected rows.',
      table: { category: 'Styling' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm'],
      description: 'Size of the table.',
      table: { category: 'Styling' },
    },
    tableVariant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark', 'light'],
      name: 'table-variant',
      description: 'Visual variant of the table.',
      table: { category: 'Styling' },
    },

    /* -----------------------------
     Layout
  ------------------------------ */
    caption: {
      control: { type: 'select' },
      options: ['', 'top', 'bottom'],
      description: 'Position of the table caption.',
      table: { category: 'Layout' },
    },
    cloneFooter: {
      control: 'boolean',
      name: 'clone-footer',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Clones the footer row when true.',
    },
    fixedTableHeader: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Enables fixed header and/or columns when true.',
      name: 'fixed-table-header',
    },
    responsive: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Enables responsive behavior when true.',
    },
    stacked: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Stacks the table vertically on smaller screens when true.',
    },
    sticky: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Makes the table header sticky when true.',
    },

    /* -----------------------------
     Data (Story-controlled)
  ------------------------------ */
    fields: {
      table: { disable: true, category: 'Data (Story-controlled)' },
      description: 'Fields configuration for the table (set via story code).',
    },
    items: {
      table: { disable: true, category: 'Data (Story-controlled)' },
      description: 'Items data for the table (set via story code).',
    },

    /* -----------------------------
     Sorting & Filtering
  ------------------------------ */
    sortable: {
      control: 'boolean',
      description: 'Enables sorting when true.',
      table: { category: 'Sorting & Filtering' },
    },
    sortField: {
      control: 'text',
      name: 'sort-field',
      description: 'Field name to sort by.',
      table: { category: 'Sorting & Filtering' },
    },
    sortOrder: {
      control: { type: 'select' },
      options: ['asc', 'desc'],
      name: 'sort-order',
      description: 'Sort order: ascending or descending.',
      table: { category: 'Sorting & Filtering' },
    },
    filterText: {
      control: 'text',
      name: 'filter-text',
      description: 'Text to filter the table rows.',
      table: { category: 'Sorting & Filtering' },
    },

    /* -----------------------------
     Selection
  ------------------------------ */
    selectMode: {
      control: { type: 'select' },
      options: ['', 'single', 'multi', 'range'],
      name: 'select-mode',
      description: 'For selection mode of rows with checkboxes. single = only one row can be selected at a time, multi = multiple rows can be selected independently, range = allows shift-click to select a range of rows.',
      table: { category: 'Selection' },
    },

    /* -----------------------------
     Pagination (Recommended)
  ------------------------------ */
    paginationEnabled: {
      control: 'boolean',
      name: 'pagination-enabled',
      table: { defaultValue: { summary: false }, category: 'Pagination (Recommended)' },
      description: 'Enables pagination UI + slicing (recommended new API).',
    },
    paginationVariant: {
      control: { type: 'select' },
      options: ['standard', 'minimize', 'by-page'],
      name: 'pagination-variant',
      table: { defaultValue: { summary: 'standard' }, category: 'Pagination (Recommended)' },
      description: 'Which pagination UI variant to use (recommended new API).',
    },

    /* -----------------------------
     Pagination (Controls)
  ------------------------------ */
    paginationPosition: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'both'],
      name: 'pagination-position',
      description: 'Position of the pagination controls.',
      table: { category: 'Pagination (Controls)' },
    },
    paginationLayout: {
      control: 'text',
      name: 'pagination-layout',
      description: 'Layout template for pagination controls.',
      table: { category: 'Pagination (Controls)' },
    },
    paginationSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'pagination-size',
      description: 'Size of the pagination controls.',
      table: { category: 'Pagination (Controls)' },
    },
    paginationLimit: {
      control: { type: 'number', min: 1, step: 1 },
      name: 'pagination-limit',
      description: 'Number of page buttons to show in pagination.',
      table: { category: 'Pagination (Controls)' },
    },
    rowsPerPage: {
      control: { type: 'number', min: 1, step: 1 },
      name: 'rows-per-page',
      description: 'Number of rows per page.',
      table: { category: 'Pagination (Controls)' },
    },
    showDisplayRange: {
      control: 'boolean',
      name: 'show-display-range',
      table: { defaultValue: { summary: false }, category: 'Pagination (Controls)' },
      description: 'Shows the display range when true.',
    },
    showSizeChanger: {
      control: 'boolean',
      name: 'show-size-changer',
      table: { defaultValue: { summary: false }, category: 'Pagination (Controls)' },
      description: 'Shows the size changer when true.',
    },
    hideGotoEndButtons: {
      control: 'boolean',
      name: 'hide-goto-end-buttons',
      table: { defaultValue: { summary: false }, category: 'Pagination (Controls)' },
      description: 'Hides Go To First/Last buttons in pagination when true.',
    },
    hideEllipsis: {
      control: 'boolean',
      name: 'hide-ellipsis',
      table: { defaultValue: { summary: false }, category: 'Pagination (Controls)' },
      description: 'Hides ellipsis in pagination when true.',
    },
    goToButtons: {
      control: { type: 'select' },
      options: ['', 'text'],
      name: 'go-to-buttons',
      description: 'Type of Go To buttons in pagination.',
      table: { category: 'Pagination (Controls)' },
    },
    paginationVariantColor: {
      control: 'text',
      name: 'pagination-variant-color',
      description: 'Variant color of the pagination controls.',
      table: { category: 'Pagination (Controls)' },
    },

    /* -----------------------------
     Pagination (Legacy)
  ------------------------------ */
    usePagination: {
      control: 'boolean',
      name: 'use-pagination',
      table: { defaultValue: { summary: false }, category: 'Pagination (Legacy)' },
      description: 'Legacy: enables pagination when true (kept for backward compatibility).',
    },
  },
};

/* --------------------------------------------- Demo data ---------------------------------------------- */

const basicItems = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Anna', age: 25, city: 'London' },
  { name: 'Mike', age: 32, city: 'Chicago' },
  { name: 'Terry', age: 21, city: 'Augusta' },
  { name: 'Clark', age: 56, city: 'Tucson' },
];

const basicItemsLong = [
  ...basicItems,
  { name: 'Seth', age: 31, city: 'Pittsburgh' },
  { name: 'Sean', age: 18, city: 'Tampa' },
  { name: 'Sally', age: 47, city: 'Suffolk' },
  { name: 'Pete', age: 60, city: 'Detroit' },
  { name: 'Tom', age: 51, city: 'Green Bay' },
  { name: 'Veronica', age: 23, city: 'Red Bank' },
];

const colorVariationsItems = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Anna', age: 25, city: 'London', _cellVariants: { age: 'info', city: 'warning' } },
  { name: 'Mike', age: 32, city: 'Chicago', _cellVariants: { age: 'success', city: 'danger' } },
  { name: 'Terry', age: 21, city: 'Augusta', _rowVariant: 'primary' },
  { name: 'Clark', age: 56, city: 'Tucson', _rowVariant: 'secondary' },
];

const detailRowItems = [
  {
    name: 'John',
    age: 30,
    city: 'New York',
    _showDetails: true,
    _additionalInfo: '<p>Hello ${this.name}, Age: ${this.age}</p><p>${this.name} is a software engineer.</p>',
  },
  {
    name: 'Anna',
    age: 25,
    city: 'London',
    _showDetails: true,
    _additionalInfo: '<p>Hello ${this.name}, Age: ${this.age}</p><p>${this.name} is a software engineer.</p>',
  },
  {
    name: 'Mike',
    age: 32,
    city: 'Chicago',
    _showDetails: true,
    _additionalInfo: '<p>Hello ${this.name}, Age: ${this.age}</p><p>${this.name} is a software engineer.</p>',
  },
  {
    name: 'Terry',
    age: 21,
    city: 'Augusta',
    _showDetails: true,
    _additionalInfo: '<p>Hello ${this.name}, Age: ${this.age}</p><p>${this.name} is a software engineer.</p>',
  },
  {
    name: 'Clark',
    age: 56,
    city: 'Tucson',
    _showDetails: true,
    _additionalInfo: '<p>Hello ${this.name}, Age: ${this.age}</p><p>${this.name} is a software engineer.</p>',
  },
];

const fullDataItems = [
  { age: 40, first_name: 'Thor', last_name: 'MacDonald', _showDetails: true, _additionalInfo: '<p>Hello ${this.first_name}, Age: ${this.age}</p>' },
  { age: 20, first_name: 'Pete', last_name: 'MacDonald', _showDetails: true, _additionalInfo: '<p>Hello ${this.first_name}, Age: ${this.age}</p>' },
  { age: 25, first_name: 'Anna', last_name: 'Smith', _showDetails: true, _additionalInfo: '<p>Hello ${this.first_name}, Age: ${this.age}</p>' },
  { age: 36, first_name: 'Zachary', last_name: 'Peterson' },
  { age: 21, first_name: 'Ralph', last_name: 'MacDonald' },
  { age: 34, first_name: 'Norma', last_name: 'MacDonald' },
  { age: 25, first_name: 'Emily', last_name: 'Larson' },
  { age: 49, first_name: 'Clark', last_name: 'Griswald' },
  { age: 37, first_name: 'George', last_name: 'Jefferson' },
  { age: 30, first_name: 'Patrick', last_name: 'Adams' },
  { age: 19, first_name: 'Keith', last_name: 'Ericksen' },
  { age: 28, first_name: 'Kelly', last_name: 'Parker' },
  { age: 87, first_name: 'Robert', last_name: 'Mitchell' },
  { age: 30, first_name: 'Derrick', last_name: 'Clark' },
  { age: 54, first_name: 'Rosa', last_name: 'Gonzalez' },
];

const tableFields = [
  { key: 'last_name', label: 'Last Name', sortable: true },
  { key: 'first_name', label: 'First Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
];

/* --------------------------------------------- Helpers ---------------------------------------------- */

function toHtml(out) {
  if (typeof out === 'string') return out;
  if (out && typeof out === 'object' && 'outerHTML' in out) {
    // If we return a wrapper div, prefer its innerHTML so preview isn't wrapped.
    if (out instanceof HTMLElement && out.tagName.toLowerCase() === 'div') return out.innerHTML;
    return out.outerHTML;
  }
  return String(out ?? '');
}

// Collapses multiple blank lines + trims leading/trailing blanks
function normalizeHtml(html) {
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
}

function normalizeJs(js) {
  return String(js ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''))
    .join('\n')
    .trim();
}

/**
 * ✅ Docs-only helper: emit a single HTML preview including minimal JS wiring.
 * Use ONLY for stories whose behavior depends on external wiring.
 */
function buildDocsHtmlJsSource({ html, js }) {
  const cleanHtml = normalizeHtml(html);
  const cleanJs = normalizeJs(js);

  if (!cleanJs) return cleanHtml;

  return normalizeHtml(`
<!-- Markup -->
${cleanHtml}

<!-- Minimal wiring (illustrative) -->
<script>
${cleanJs}
</script>
`);
}

const deriveFieldsFromFirstItem = items => {
  if (!Array.isArray(items) || !items.length) return [];
  const ignore = new Set(['_cellVariants', '_rowVariant', '_showDetails', '_additionalInfo']);
  return Object.keys(items[0])
    .filter(k => !ignore.has(k))
    .map(k => ({
      key: k,
      label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      sortable: true,
    }));
};

const isNone = v => {
  const t = (v ?? '').toString().trim().toLowerCase();
  return t === '' || t === 'none';
};

async function whenReady(tagName, el) {
  await customElements.whenDefined(tagName);
  await el?.componentOnReady?.();
}

function ensureGlobalHelpers() {
  if (window.__tableStoryHelpersInstalled) return;
  window.__tableStoryHelpersInstalled = true;

  window.resetTableSort = async (tableId, dropdownId) => {
    await customElements.whenDefined('table-component');
    const table = document.getElementById(tableId);
    await table?.componentOnReady?.();
    await table?.resetSort?.();

    if (dropdownId) {
      const drop = document.getElementById(dropdownId);
      if (typeof drop?.clearSelections === 'function') await drop.clearSelections();

      document.dispatchEvent(new CustomEvent('filter-fields-changed', { detail: { tableId, items: [] } }));
      table?.dispatchEvent(new CustomEvent('filter-changed', { detail: { value: '' } }));

      const input = document.querySelector(`[data-filter-input-for="${tableId}"]`);
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new CustomEvent('valueChange', { detail: { value: '' }, bubbles: true }));
      }
    }
  };

  window.clearFilter = async dropdownId => {
    const drop = document.getElementById(dropdownId);
    const tableId = drop?.getAttribute?.('table-id') || drop?.tableId;
    if (!tableId) return;

    const input = document.querySelector(`[data-filter-input-for="${tableId}"]`);
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new CustomEvent('valueChange', { detail: { value: '' }, bubbles: true }));
    }

    if (typeof drop?.clearSelections === 'function') await drop.clearSelections();
    document.dispatchEvent(new CustomEvent('filter-fields-changed', { detail: { tableId, items: [] } }));

    const table = document.getElementById(tableId);
    table?.dispatchEvent(new CustomEvent('filter-changed', { detail: { value: '' } }));
  };
}

/**
 * ✅ Only wire controls once the returned wrapper is actually connected to the DOM.
 * Storybook calls the story function for Docs "Source" too, where it may never connect.
 */
function runWhenConnected(rootEl, fn, timeoutMs = 1500) {
  const start = performance.now();
  const tick = () => {
    if (!rootEl || rootEl.isConnected) {
      try {
        fn();
      } catch {
        // swallow wiring errors so Docs transforms never hard-fail
      }
      return;
    }
    if (performance.now() - start > timeoutMs) return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function buildTableAttrs(args, id, extraAttrs = '') {
  const attrs = [
    id ? `id="${id}"` : null,
    args.addBorder ? 'add-border' : null,
    args.removeBorder ? 'remove-border' : null,
    args.darkTableTheme ? 'dark-table-theme' : null,
    args.darkHeader ? 'dark-header' : null,
    args.lightHeader ? 'light-header' : null,
    args.rowHover ? 'row-hover' : null,
    args.noBorderCollapsed ? 'no-border-collapsed' : null,
    args.plumage ? 'plumage' : null,
    args.size ? `size="${args.size}"` : null,
    args.striped ? 'striped' : null,
    args.tableVariant ? `table-variant="${args.tableVariant}"` : null,
    args.caption ? `caption="${args.caption}"` : null,
    args.cloneFooter ? 'clone-footer' : null,
    args.fixedTableHeader ? 'fixed-table-header' : null,
    args.responsive ? 'responsive' : null,
    args.stacked ? 'stacked' : null,
    args.sticky ? 'sticky' : null,
    args.sortable ? 'sortable' : null,
    args.selectMode ? `select-mode="${args.selectMode}"` : null,

    // ✅ NEW API first
    args.paginationEnabled ? 'pagination-enabled' : null,
    args.paginationVariant ? `pagination-variant="${args.paginationVariant}"` : null,

    // legacy
    args.usePagination ? 'use-pagination' : null,

    args.paginationPosition ? `pagination-position="${args.paginationPosition}"` : null,
    args.paginationLayout ? `pagination-layout="${args.paginationLayout}"` : null,
    args.paginationSize ? `pagination-size="${args.paginationSize}"` : null,
    args.paginationLimit ? `pagination-limit="${args.paginationLimit}"` : null,
    args.rowsPerPage ? `rows-per-page="${args.rowsPerPage}"` : null,
    args.showDisplayRange ? 'show-display-range' : null,
    args.showSizeChanger ? 'show-size-changer' : null,
    args.hideGotoEndButtons ? 'hide-goto-end-buttons' : null,
    args.hideEllipsis ? 'hide-ellipsis' : null,
    args.goToButtons ? `go-to-buttons="${args.goToButtons}"` : null,
    args.paginationVariantColor ? `pagination-variant-color="${args.paginationVariantColor}"` : null,
    extraAttrs ? extraAttrs.trim() : null,
  ]
    .filter(Boolean)
    .join('\n ');

  return attrs;
}

/**
 * ✅ Renders DOM + sets items/fields via properties (no <script> tags).
 * Works in Canvas + Docs.
 */
function renderTableStory(args, { id, items, fields, extraAttrs = '' } = {}) {
  const wrapper = document.createElement('div');
  wrapper.style.margin = '24px 0';

  const attrs = buildTableAttrs(args, id, extraAttrs);
  const captionSlot = args.caption === 'top' || args.caption === 'bottom' ? `<span slot="caption">This is an Example Caption</span>` : '';

  wrapper.innerHTML = normalizeHtml(`
<table-component ${attrs}>
  ${captionSlot}
</table-component>
`);

  const table = wrapper.querySelector('table-component');
  if (table) {
    const data = Array.isArray(items) ? items : [];
    table.items = [...data];
    table.originalItems = [...data];
    table.fields = Array.isArray(fields) && fields.length ? fields : deriveFieldsFromFirstItem(data);
  }

  return wrapper;
}

/** Like renderTableStory, but allows injecting complex markup around the table. */
function renderSectionStory(args, { html, tableId, items, fields } = {}) {
  const wrapper = document.createElement('div');
  wrapper.style.margin = '24px 0';
  wrapper.innerHTML = normalizeHtml(html);

  const table = wrapper.querySelector(`#${CSS.escape(tableId)}`);
  if (table) {
    const data = Array.isArray(items) ? items : [];
    table.items = [...data];
    table.originalItems = [...data];
    table.fields = Array.isArray(fields) && fields.length ? fields : deriveFieldsFromFirstItem(data);
  }

  return wrapper;
}

/* --------------------------------------------- Wiring helpers (UPDATED) ---------------------------------------------- */

async function wireSortControls({ root, tableId, sortFieldId, sortOrderId }) {
  ensureGlobalHelpers();
  const q = sel => (root?.querySelector ? root.querySelector(sel) : null) || document.querySelector(sel);

  const table = q(`#${CSS.escape(tableId)}`);
  const selField = q(`#${CSS.escape(sortFieldId)}`);
  const selOrder = q(`#${CSS.escape(sortOrderId)}`);
  if (!table || !selField || !selOrder) return;

  await Promise.all([whenReady('table-component', table), whenReady('select-field-component', selField), whenReady('select-field-component', selOrder)]);

  const fields = Array.isArray(table.fields) && table.fields.length ? table.fields : deriveFieldsFromFirstItem(table.items || []);
  const options = fields.map(f => ({ value: f.key, name: f.label || f.key }));

  selField.defaultOptionTxt = '';
  selField.options = options;
  selOrder.options = [
    { value: 'asc', name: 'Ascending' },
    { value: 'desc', name: 'Descending' },
  ];

  selField.value = isNone(table.sortField) ? '' : table.sortField;
  selOrder.value = table.sortOrder ?? 'asc';
  selOrder.disabled = isNone(selField.value);

  const onFieldChange = ev => {
    const raw = ev?.detail?.value ?? ev?.target?.value ?? '';
    selOrder.disabled = isNone(raw);
    table.dispatchEvent(new CustomEvent('sort-field-changed', { detail: { value: isNone(raw) ? 'none' : raw } }));
  };

  selField.addEventListener('valueChange', onFieldChange);
  selField.addEventListener('change', onFieldChange);

  selOrder.addEventListener('change', ev => {
    const value = ev?.detail?.value ?? ev?.target?.value ?? 'asc';
    table.dispatchEvent(new CustomEvent('sort-order-changed', { detail: { value } }));
  });

  table.addEventListener('sort-field-updated', ev => {
    const value = ev?.detail?.value ?? 'none';
    selField.value = isNone(value) ? '' : value;
    selOrder.disabled = isNone(value);
  });

  table.addEventListener('sort-order-updated', ev => {
    const value = ev?.detail?.value ?? 'asc';
    selOrder.value = value;
    if (!isNone(selField.value)) selOrder.disabled = false;
  });
}

async function wireFilterControls({ root, tableId, inputId, dropdownId }) {
  ensureGlobalHelpers();
  const q = sel => (root?.querySelector ? root.querySelector(sel) : null) || document.querySelector(sel);

  const table = q(`#${CSS.escape(tableId)}`);
  const input = q(`#${CSS.escape(inputId)}`);
  const dropdown = q(`#${CSS.escape(dropdownId)}`);
  if (!table || !input || !dropdown) return;

  await Promise.all([whenReady('table-component', table), whenReady('input-group-component', input), whenReady('dropdown-component', dropdown)]);

  input?.setAttribute?.('data-filter-input-for', tableId);

  const fields = Array.isArray(table.fields) && table.fields.length ? table.fields : deriveFieldsFromFirstItem(table.items || []);
  const options = fields.map((f, i) => ({
    key: f.key,
    name: f.label || f.key,
    value: f.key,
    label: f.label || f.key,
    checked: false,
    index: i,
  }));

  if (typeof dropdown?.setOptions === 'function') dropdown.setOptions(options);
  else dropdown.options = options;

  const forward = val => table.dispatchEvent(new CustomEvent('filter-changed', { detail: { value: String(val ?? '') } }));
  input?.addEventListener('input', e => forward(e?.detail?.value ?? e?.target?.value ?? ''));
  input?.addEventListener('change', e => forward(e?.detail?.value ?? e?.target?.value ?? ''));
  input?.addEventListener('valueChange', e => forward(e?.detail?.value ?? ''));

  dropdown?.addEventListener('selection-changed', ev => {
    const checked = Array.isArray(ev?.detail?.items) ? ev.detail.items : [];
    const payload = checked.map(o => ({ key: (o.key || o.value || o.name) ?? '', checked: true }));
    document.dispatchEvent(new CustomEvent('filter-fields-changed', { detail: { tableId, items: payload } }));
  });
}

/* -------------------------------------------------------------------
✅ Hoisted wired story templates (Docs + story stay in sync)
-------------------------------------------------------------------- */

const SORT_RESET_STORY = {
  tableId: 'table16',
  sortFieldId: 'sortField-1',
  sortOrderId: 'sortOrder-1',
  html({ tableId, sortFieldId, sortOrderId }) {
    return `
<section class="display-box-demo">
  <button class="reset-sort-icon" onclick="resetTableSort('${tableId}')"></button>

  <div style="display:flex; width:100%; flex:1 1 auto">
    <div style="flex:1 1 auto">
      <select-field-component id="${sortFieldId}" label="Sort Field" with-table size="sm"></select-field-component>
    </div>
    <div style="flex:1 1 auto">
      <select-field-component id="${sortOrderId}" label="Sort Order" with-table value="asc" disabled size="sm"></select-field-component>
    </div>
  </div>

  <table-component id="${tableId}" table-id="${tableId}" striped sortable responsive size="sm"></table-component>
</section>
`;
  },
  docsJs({ tableId }) {
    return `
(async () => {
  await customElements.whenDefined('table-component');
  const table = document.getElementById('${tableId}');
  table.items = [
    { first_name: 'Thor', last_name: 'MacDonald', age: 40 },
    { first_name: 'Anna', last_name: 'Smith', age: 25 },
    { first_name: 'Zachary', last_name: 'Peterson', age: 36 },
  ];
  table.originalItems = [...table.items];
  table.fields = [
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ];

  // Outside Storybook, wire your selects to dispatch these events:
  // table.dispatchEvent(new CustomEvent('sort-field-changed', { detail: { value: 'age' } }));
  // table.dispatchEvent(new CustomEvent('sort-order-changed', { detail: { value: 'asc' } }));
})();
`;
  },
};

const FILTER_RESET_STORY = {
  tableId: 'table17',
  inputId: 'filterInput-table17',
  dropdownId: 'filterByItems-table17',
  html({ tableId, inputId, dropdownId }) {
    return `
<section class="display-box-demo">
  <button class="reset-sort-icon" onclick="resetTableSort('${tableId}', '${dropdownId}')"></button>

  <div style="display:flex; width:100%; flex:1 1 auto">
    <div style="flex:1 1 auto">
      <input-group-component
        id="${inputId}"
        label="Filter"
        placeholder="Type to Filter..."
        name="input-1"
        value=""
        append
        append-id="append-1"
        other-content
        size="sm"
      >
        <button-component btn-text="Clear" variant="secondary" slot="append" size="sm" onclick="clearFilter('${dropdownId}')"></button-component>
      </input-group-component>
    </div>

    <div style="flex:1 1 auto; margin-top:1.870rem">
      <dropdown-component
        button-text="Filter By"
        variant="secondary"
        id="${dropdownId}"
        table-id="${tableId}"
        size="sm"
        input-id="filterby"
        list-type="checkboxes"
      ></dropdown-component>
    </div>
  </div>

  <table-component id="${tableId}" table-id="${tableId}" striped responsive size="sm"></table-component>
</section>
`;
  },
  docsJs({ tableId }) {
    return `
(async () => {
  await customElements.whenDefined('table-component');
  const table = document.getElementById('${tableId}');
  table.items = [
    { first_name: 'Thor', last_name: 'MacDonald', age: 40 },
    { first_name: 'Pete', last_name: 'MacDonald', age: 20 },
    { first_name: 'Anna', last_name: 'Smith', age: 25 },
  ];
  table.originalItems = [...table.items];
  table.fields = [
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ];

  // Outside Storybook, drive filtering by dispatching:
  // table.dispatchEvent(new CustomEvent('filter-changed', { detail: { value: 'mac' } }));
  // And optionally the selected filter fields via:
  // document.dispatchEvent(new CustomEvent('filter-fields-changed', { detail: { tableId: '${tableId}', items: [...] } }));
})();
`;
  },
};

const PLAYGROUND_STORY = {
  tableId: 'table99',
  sortFieldId: 'sortField-2',
  sortOrderId: 'sortOrder-2',
  inputId: 'filterInput-table99',
  dropdownId: 'filterByItems-table99',
  html({ tableId, sortFieldId, sortOrderId, inputId, dropdownId }) {
    return `
<section class="display-box-demo">
  <button class="reset-sort-icon" onclick="resetTableSort('${tableId}', '${dropdownId}')"></button>

  <div style="display:flex; width:100%; flex:1 1 auto">
    <div style="flex:1 1 auto">
      <select-field-component id="${sortFieldId}" label="Sort Field" with-table size="sm"></select-field-component>
    </div>
    <div style="flex:1 1 auto">
      <select-field-component id="${sortOrderId}" label="Sort Order" with-table value="asc" disabled size="sm"></select-field-component>
    </div>
  </div>

  <div style="display:flex; width:100%; flex:1 1 auto">
    <div style="flex:1 1 auto">
      <input-group-component
        id="${inputId}"
        label="Filter"
        placeholder="Type to Filter..."
        name="input-1"
        value=""
        append
        append-id="append-1"
        other-content
        size="sm"
      >
        <button-component
          btn-text="Clear"
          variant="primary"
          slot="append"
          secondary
          styles="border-radius: 0 3px 3px 0; padding: 0 8px;"
          size="sm"
          onclick="clearFilter('${dropdownId}')"
        ></button-component>
      </input-group-component>
    </div>

    <div style="flex:1 1 auto; margin-top:1.870rem">
      <dropdown-component
        button-text="Filter By"
        variant="secondary"
        id="${dropdownId}"
        table-id="${tableId}"
        size="sm"
        input-id="filterby"
        list-type="checkboxes"
      ></dropdown-component>
    </div>
  </div>

  <table-component
    id="${tableId}"
    table-id="${tableId}"
    striped
    row-hover
    sortable
    responsive
    select-mode="multi"
    pagination-enabled
    pagination-variant="standard"
    pagination-position="both"
    pagination-limit="3"
    pagination-layout="start"
    show-size-changer
    size="sm"
    go-to-buttons="text"
    rows-per-page="10"
  ></table-component>
</section>
`;
  },
  docsJs({ tableId }) {
    return `
(async () => {
  await customElements.whenDefined('table-component');
  const table = document.getElementById('${tableId}');
  table.items = [
    { first_name: 'Thor', last_name: 'MacDonald', age: 40 },
    { first_name: 'Anna', last_name: 'Smith', age: 25 },
    { first_name: 'Zachary', last_name: 'Peterson', age: 36 },
    { first_name: 'Ralph', last_name: 'MacDonald', age: 21 },
  ];
  table.originalItems = [...table.items];
  table.fields = [
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
  ];

  // Outside Storybook, drive behavior with events like:
  // table.dispatchEvent(new CustomEvent('sort-field-changed', { detail: { value: 'age' } }));
  // table.dispatchEvent(new CustomEvent('sort-order-changed', { detail: { value: 'asc' } }));
  // table.dispatchEvent(new CustomEvent('filter-changed', { detail: { value: 'mac' } }));
})();
`;
  },
};

/* --------------------------------------------- Stories ---------------------------------------------- */

export const Basic = args =>
  renderTableStory(args, {
    id: 'table-basic',
    items: basicItems,
  });

Basic.args = {
  addBorder: false,
  responsive: false,
  striped: false,
  rowHover: false,
  size: '',
  caption: '',
  tableVariant: 'table',
};

Basic.parameters = {
  docs: { description: { story: 'A basic table with minimal configuration.' } },
};

export const StickyNoBorderCollapsed = args =>
  renderTableStory(args, {
    id: 'table-sticky',
    items: basicItemsLong,
  });

StickyNoBorderCollapsed.args = {
  sticky: true,
  noBorderCollapsed: true,
};

StickyNoBorderCollapsed.parameters = {
  docs: { description: { story: 'A table with a sticky header and no borders when collapsed.' } },
};

export const ResponsiveBordered = args =>
  renderTableStory(args, {
    id: 'table-resp-bordered',
    items: basicItems,
  });

ResponsiveBordered.args = {
  responsive: true,
  addBorder: true,
};

ResponsiveBordered.parameters = {
  docs: { description: { story: 'A responsive table with borders.' } },
};

export const ResponsiveBorderless = args =>
  renderTableStory(args, {
    id: 'table-resp-borderless',
    items: basicItems,
  });

ResponsiveBorderless.args = {
  responsive: true,
  removeBorder: true,
};

ResponsiveBorderless.parameters = {
  docs: { description: { story: 'A responsive table without borders.' } },
};

export const StripedHoverBordered = args =>
  renderTableStory(args, {
    id: 'table-striped-hover',
    items: basicItems,
  });

StripedHoverBordered.args = {
  responsive: true,
  striped: true,
  rowHover: true,
  addBorder: true,
};

StripedHoverBordered.parameters = {
  docs: { description: { story: 'A responsive table with striped rows, hover effect, and borders.' } },
};

export const CaptionTopCloneFooterFixed = args =>
  renderTableStory(args, {
    id: 'table-caption-top',
    items: basicItems,
  });

CaptionTopCloneFooterFixed.args = {
  caption: 'top',
  cloneFooter: true,
  fixedTableHeader: true,
};

CaptionTopCloneFooterFixed.parameters = {
  docs: { description: { story: 'A table with the caption at the top, a cloned footer, and fixed header.' } },
};

export const StackedCaptionBottom = args =>
  renderTableStory(args, {
    id: 'table-stacked',
    items: basicItems,
  });

StackedCaptionBottom.args = {
  stacked: true,
  caption: 'bottom',
};

StackedCaptionBottom.parameters = {
  docs: { description: { story: 'A stacked table with the caption at the bottom.' } },
};

/**
 * ✅ Renamed from "WithDetailsAndVariants"
 * This story only demonstrates row + cell variant colors (no detail rows).
 */
export const UsingVariantColorsInRowsAndCells = args =>
  renderTableStory(args, {
    id: 'table-variant-colors',
    items: colorVariationsItems,
  });

UsingVariantColorsInRowsAndCells.args = {
  responsive: true,
};

UsingVariantColorsInRowsAndCells.parameters = {
  docs: { description: { story: 'A table showcasing variant colors in rows and individual cells.' } },
};

/**
 * ✅ Detail rows only (explicit _showDetails + _additionalInfo data).
 */
export const DetailRowsOnly = args =>
  renderTableStory(args, {
    id: 'table-detail-rows',
    items: detailRowItems,
  });

DetailRowsOnly.args = {
  responsive: true,
};

DetailRowsOnly.parameters = {
  docs: { description: { story: 'A table showcasing detail rows using _showDetails and _additionalInfo.' } },
};

export const SelectableMultiSmall = args =>
  renderTableStory(args, {
    id: 'table-select-multi',
    items: basicItems,
    extraAttrs: 'table-id="table-select-multi"',
  });

SelectableMultiSmall.args = {
  responsive: true,
  striped: true,
  size: 'sm',
  selectMode: 'multi',
};

SelectableMultiSmall.parameters = {
  docs: { description: { story: 'A small, responsive table with striped rows and multi-row selection enabled.' } },
};

export const SortableSimple = args =>
  renderTableStory(args, {
    id: 'table-sortable',
    items: fullDataItems,
    fields: tableFields,
  });

SortableSimple.args = {
  striped: true,
  sortable: true,
  responsive: true,
  size: 'sm',
};

SortableSimple.parameters = {
  docs: { description: { story: 'A small, responsive, sortable table with striped rows.' } },
};

export const WithPagination = args =>
  renderTableStory(args, {
    id: 'table-paged',
    items: fullDataItems,
    fields: tableFields,
    extraAttrs: 'table-id="table-paged"',
  });

WithPagination.args = {
  striped: true,
  responsive: true,

  // ✅ new API
  paginationEnabled: true,
  paginationVariant: 'standard',

  // legacy (off in stories)
  usePagination: false,

  paginationPosition: 'both',
  paginationLayout: 'start',
  showDisplayRange: true,
  showSizeChanger: true,
  size: 'sm',
  paginationLimit: 3,
  goToButtons: 'text',
  rowsPerPage: 10,
};

WithPagination.parameters = {
  docs: {
    description: {
      story: 'A small, responsive table with pagination enabled, displaying controls at both the top and bottom.',
    },
  },
};

/* --------------------------------------------- Sort Field + Sort Order + Reset button ---------------------------------------------- */

export const SortFieldAndOrderWithReset = args => {
  const { tableId, sortFieldId, sortOrderId } = SORT_RESET_STORY;

  const wrapper = renderSectionStory(args, {
    tableId,
    items: fullDataItems,
    fields: tableFields,
    html: SORT_RESET_STORY.html({ tableId, sortFieldId, sortOrderId }),
  });

  runWhenConnected(wrapper, () => wireSortControls({ root: wrapper, tableId, sortFieldId, sortOrderId }));
  return wrapper;
};

SortFieldAndOrderWithReset.args = {
  striped: true,
  sortable: true,
  responsive: true,
  size: 'sm',
};

SortFieldAndOrderWithReset.parameters = {
  docs: {
    description: {
      story: normalizeHtml(`
This example uses **external controls** (two <select-field-component>s) to drive sorting.

**Important:** the controls are wired to the table via Storybook helper code (not table markup alone).
`),
    },
    source: {
      language: 'html',
      transform: () =>
        buildDocsHtmlJsSource({
          html: SORT_RESET_STORY.html(SORT_RESET_STORY),
          js: SORT_RESET_STORY.docsJs(SORT_RESET_STORY),
        }),
    },
  },
};

/* --------------------------------------------- Filter input + Filter By dropdown + Reset button ---------------------------------------------- */

export const FilterFieldAndDropdownWithReset = args => {
  const { tableId, inputId, dropdownId } = FILTER_RESET_STORY;

  const wrapper = renderSectionStory(args, {
    tableId,
    items: fullDataItems,
    fields: tableFields,
    html: FILTER_RESET_STORY.html({ tableId, inputId, dropdownId }),
  });

  runWhenConnected(wrapper, () => wireFilterControls({ root: wrapper, tableId, inputId, dropdownId }));
  return wrapper;
};

FilterFieldAndDropdownWithReset.args = {
  striped: true,
  responsive: true,
  size: 'sm',
};

FilterFieldAndDropdownWithReset.parameters = {
  docs: {
    description: {
      story: normalizeHtml(`
This example uses **external filter UI** (input + dropdown) to drive table filtering.

**Important:** the dropdown and input are wired via Storybook helper code (not table markup alone).
`),
    },
    source: {
      language: 'html',
      transform: () =>
        buildDocsHtmlJsSource({
          html: FILTER_RESET_STORY.html(FILTER_RESET_STORY),
          js: FILTER_RESET_STORY.docsJs(FILTER_RESET_STORY),
        }),
    },
  },
};

/* --------------------------------------------- Playground: Sort + Filter + Pagination + Selection ---------------------------------------------- */

export const Playground = args => {
  const { tableId, sortFieldId, sortOrderId, inputId, dropdownId } = PLAYGROUND_STORY;

  const wrapper = renderSectionStory(args, {
    tableId,
    items: fullDataItems,
    fields: tableFields,
    html: PLAYGROUND_STORY.html({ tableId, sortFieldId, sortOrderId, inputId, dropdownId }),
  });

  runWhenConnected(wrapper, () => {
    wireSortControls({ root: wrapper, tableId, sortFieldId, sortOrderId });
    wireFilterControls({ root: wrapper, tableId, inputId, dropdownId });
  });

  return wrapper;
};

Playground.args = {
  striped: true,
  rowHover: true,
  sortable: true,
  responsive: true,
  selectMode: 'multi',

  // ✅ new API
  paginationEnabled: true,
  paginationVariant: 'standard',

  // legacy (off in stories)
  usePagination: false,

  paginationPosition: 'both',
  paginationLayout: 'start',
  paginationLimit: 3,
  showSizeChanger: true,
  size: 'sm',
  goToButtons: 'text',
  rowsPerPage: 10,
};

Playground.parameters = {
  docs: {
    description: {
      story: normalizeHtml(`
This combines **Sort + Filter + Selection + Pagination**.

**Important:** external controls are wired via Storybook helper code; outside Storybook you’d drive the same behavior by dispatching the table’s events.
`),
    },
    source: {
      language: 'html',
      transform: () =>
        buildDocsHtmlJsSource({
          html: PLAYGROUND_STORY.html(PLAYGROUND_STORY),
          js: PLAYGROUND_STORY.docsJs(PLAYGROUND_STORY),
        }),
    },
  },
};
