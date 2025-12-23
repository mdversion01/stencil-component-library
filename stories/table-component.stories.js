export default {
  title: 'Components/Table',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    // Styling
    border: { control: 'boolean' },
    bordered: { control: 'boolean' },
    borderless: { control: 'boolean' },
    dark: { control: 'boolean' },
    headerDark: { control: 'boolean', name: 'header-dark' },
    headerLight: { control: 'boolean', name: 'header-light' },
    hover: { control: 'boolean' },
    plumage: { control: 'boolean' },
    noBorderCollapsed: { control: 'boolean', name: 'no-border-collapsed' },
    selectedVariant: { control: 'text', name: 'selected-variant' },
    size: { control: { type: 'radio' }, options: ['', 'sm'] },
    striped: { control: 'boolean' },
    tableVariant: {
      control: { type: 'select' },
      options: ['table', '', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark', 'light'],
      name: 'table-variant',
    },

    // Layout
    caption: { control: { type: 'radio' }, options: ['', 'top', 'bottom'] },
    cloneFooter: { control: 'boolean', name: 'clone-footer' },
    fields: { table: { disable: true } }, // set via script
    fixed: { control: 'boolean' },
    responsive: { control: 'boolean' },
    stacked: { control: 'boolean' },
    sticky: { control: 'boolean' },

    // Data / sorting / filtering
    items: { table: { disable: true } }, // set via script
    sortable: { control: 'boolean' },
    sortField: { control: 'text', name: 'sort-field' },
    sortOrder: { control: { type: 'radio' }, options: ['asc', 'desc'], name: 'sort-order' },
    filterText: { control: 'text', name: 'filter-text' },

    // Selection
    selectMode: { control: { type: 'select' }, options: ['', 'single', 'multi', 'range'], name: 'select-mode' },

    // Pagination
    usePagination: { control: 'boolean', name: 'use-pagination' },
    paginationPosition: { control: { type: 'radio' }, options: ['top', 'bottom', 'both'], name: 'pagination-position' },
    paginationLayout: { control: 'text', name: 'pagination-layout' },
    paginationSize: { control: { type: 'radio' }, options: ['', 'sm', 'lg'], name: 'pagination-size' },
    paginationLimit: { control: { type: 'number', min: 1, step: 1 }, name: 'pagination-limit' },
    rowsPerPage: { control: { type: 'number', min: 1, step: 1 }, name: 'rows-per-page' },
    showDisplayRange: { control: 'boolean', name: 'show-display-range' },
    showSizeChanger: { control: 'boolean', name: 'show-size-changer' },
    hideGotoEndButtons: { control: 'boolean', name: 'hide-goto-end-buttons' },
    hideEllipsis: { control: 'boolean', name: 'hide-ellipsis' },
    goToButtons: { control: { type: 'radio' }, options: ['', 'text'], name: 'go-to-buttons' },
    paginationVariantColor: { control: 'text', name: 'pagination-variant-color' },
  },
};

/* ---------------------------------------------
   Shared demo data + tiny helpers (inline-safe)
---------------------------------------------- */

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
  { name: 'John', age: 30, city: 'New York', _showDetails: true, _additionalInfo: '<p>Hello ${this.name}, Age: ${this.age}</p><p>${this.name} is a software engineer.</p>' },
  { name: 'Anna', age: 25, city: 'London', _showDetails: true, _additionalInfo: '<p>Hello ${this.name}, Age: ${this.age}</p><p>${this.name} is a software engineer.</p>' },
  { name: 'Mike', age: 32, city: 'Chicago', _showDetails: true, _additionalInfo: '<p>Hello ${this.name}, Age: ${this.age}</p><p>${this.name} is a software engineer.</p>' },
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

const deriveFieldsFromFirstItem = (items) => {
  if (!Array.isArray(items) || !items.length) return [];
  const ignore = new Set(['_cellVariants', '_rowVariant', '_showDetails', '_additionalInfo']);
  return Object.keys(items[0])
    .filter(k => !ignore.has(k))
    .map(k => ({ key: k, label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), sortable: true }));
};

const pushItemsScript = (id, items, fields) => `
<script type="module">
  (async () => {
    await customElements.whenDefined('table-component');
    const el = document.getElementById('${id}');
    if (!el) return;
    await el.componentOnReady?.();
    const data = ${JSON.stringify(items)};
    el.items = [...data];
    el.originalItems = [...data];
    el.fields = ${fields ? JSON.stringify(fields) : '(() => { const f = (' + JSON.stringify(items) + '); return (' + deriveFieldsFromFirstItem.toString() + ')(f); })()'};
  })();
</script>
`;

/* ---------------------------------------------
   Base template for a single table instance
---------------------------------------------- */
const TableTemplate = (args, id, attrs = '', after = '') => `
<table-component
  id="${id}"
  ${args.border ? 'border' : ''}
  ${args.bordered ? 'bordered' : ''}
  ${args.borderless ? 'borderless' : ''}
  ${args.dark ? 'dark' : ''}
  ${args.headerDark ? 'header-dark' : ''}
  ${args.headerLight ? 'header-light' : ''}
  ${args.hover ? 'hover' : ''}
  ${args.plumage ? 'plumage' : ''}
  ${args.noBorderCollapsed ? 'no-border-collapsed' : ''}
  ${args.size ? `size="${args.size}"` : ''}
  ${args.striped ? 'striped' : ''}
  ${args.tableVariant ? `table-variant="${args.tableVariant}"` : ''}
  ${args.caption ? `caption="${args.caption}"` : ''}
  ${args.cloneFooter ? 'cloneFooter' : ''}
  ${args.fixed ? 'fixed' : ''}
  ${args.responsive ? 'responsive' : ''}
  ${args.sticky ? 'sticky' : ''}
  ${args.sortable ? 'sortable' : ''}
  ${args.selectMode ? `select-mode="${args.selectMode}"` : ''}
  ${args.usePagination ? 'use-pagination' : ''}
  ${args.paginationPosition ? `pagination-position="${args.paginationPosition}"` : ''}
  ${args.paginationLayout ? `pagination-layout="${args.paginationLayout}"` : ''}
  ${args.paginationSize ? `pagination-size="${args.paginationSize}"` : ''}
  ${args.paginationLimit ? `pagination-limit="${args.paginationLimit}"` : ''}
  ${args.rowsPerPage ? `rows-per-page="${args.rowsPerPage}"` : ''}
  ${args.showDisplayRange ? 'show-display-range' : ''}
  ${args.showSizeChanger ? 'show-size-changer' : ''}
  ${args.hideGotoEndButtons ? 'hide-goto-end-buttons' : ''}
  ${args.hideEllipsis ? 'hide-ellipsis' : ''}
  ${args.goToButtons ? `go-to-buttons="${args.goToButtons}"` : ''}
  ${args.paginationVariantColor ? `pagination-variant-color="${args.paginationVariantColor}"` : ''}
  ${attrs}
>
  ${args.caption === 'top' || args.caption === 'bottom' ? '<span slot="caption">This is an Example Caption</span>' : ''}
</table-component>
${after}
`;

/* ---------------------------------------------
   Stories
---------------------------------------------- */

export const Basic = (args) =>
  TableTemplate(args, 'table-basic', '', pushItemsScript('table-basic', basicItems));
Basic.args = {
  bordered: false,
  responsive: false,
  striped: false,
  hover: false,
  size: '',
  caption: '',
  tableVariant: 'table',
};

export const StickyNoBorderCollapsed = (args) =>
  TableTemplate(args, 'table-sticky', '', pushItemsScript('table-sticky', basicItemsLong));
StickyNoBorderCollapsed.args = {
  sticky: true,
  noBorderCollapsed: true,
};

export const ResponsiveBordered = (args) =>
  TableTemplate(args, 'table-resp-bordered', '', pushItemsScript('table-resp-bordered', basicItems));
ResponsiveBordered.args = {
  responsive: true,
  bordered: true,
};

export const ResponsiveBorderless = (args) =>
  TableTemplate(args, 'table-resp-borderless', '', pushItemsScript('table-resp-borderless', basicItems));
ResponsiveBorderless.args = {
  responsive: true,
  borderless: true,
};

export const StripedHoverBordered = (args) =>
  TableTemplate(args, 'table-striped-hover', '', pushItemsScript('table-striped-hover', basicItems));
StripedHoverBordered.args = {
  responsive: true,
  striped: true,
  hover: true,
  bordered: true,
};

export const CaptionTopCloneFooterFixed = (args) =>
  TableTemplate(args, 'table-caption-top', '', pushItemsScript('table-caption-top', basicItems));
CaptionTopCloneFooterFixed.args = {
  caption: 'top',
  cloneFooter: true,
  fixed: true,
};

export const StackedCaptionBottom = (args) =>
  TableTemplate(args, 'table-stacked', '', pushItemsScript('table-stacked', basicItems));
StackedCaptionBottom.args = {
  stacked: true,
  caption: 'bottom',
};

export const WithDetailsAndVariants = (args) =>
  TableTemplate(args, 'table-details', '', pushItemsScript('table-details', colorVariationsItems));
WithDetailsAndVariants.args = {
  responsive: true,
};

export const SelectableMultiSmall = (args) =>
  TableTemplate(args, 'table-select-multi', 'table-id="table-select-multi"', pushItemsScript('table-select-multi', basicItems));
SelectableMultiSmall.args = {
  responsive: true,
  striped: true,
  size: 'sm',
  selectMode: 'multi',
};

export const SortableSimple = (args) => {
  const after = `
<script type="module">
  window.resetTableSort = async (tableId) => {
    await customElements.whenDefined('table-component');
    const el = document.getElementById(tableId);
    await el?.componentOnReady?.();
    await el?.resetSort?.();
  };
</script>
<section class="display-box-demo">
  <button class="reset-sort-icon" onclick="resetTableSort('table-sortable')"></button>
</section>
`;
  return TableTemplate(args, 'table-sortable', '', pushItemsScript('table-sortable', fullDataItems, tableFields) + after);
};
SortableSimple.args = {
  striped: true,
  sortable: true,
  responsive: true,
  size: 'sm',
};

export const ExternalSortControls = (args) => {
  const controls = `
<div style="display:flex;gap:12px;margin-bottom:8px">
  <select-field-component id="sortField-ext" label="Sort Field" with-table size="sm"></select-field-component>
  <select-field-component id="sortOrder-ext" label="Sort Order" with-table value="asc" disabled size="sm"></select-field-component>
</div>
`;
  const wiring = `
<script type="module">
(async () => {
  const tableId = 'table-ext-sort';
  const fieldSelId = 'sortField-ext';
  const orderSelId = 'sortOrder-ext';

  const derive = ${deriveFieldsFromFirstItem.toString()};
  await Promise.all([
    customElements.whenDefined('table-component'),
    customElements.whenDefined('select-field-component')
  ]);

  const table = document.getElementById(tableId);
  const selField = document.getElementById(fieldSelId);
  const selOrder = document.getElementById(orderSelId);

  await table?.componentOnReady?.();
  await selField?.componentOnReady?.();
  await selOrder?.componentOnReady?.();

  const fields = derive(table.items || []);
  selField.defaultOptionTxt = '';
  selField.options = fields.map(f => ({ value: f.key, name: f.label || f.key }));
  selOrder.options = [{ value: 'asc', name: 'Ascending' }, { value: 'desc', name: 'Descending' }];

  const isNone = (v) => (v ?? '').toString().trim().toLowerCase() === '' || (v ?? '').toString().trim().toLowerCase() === 'none';
  selField.value = isNone(table.sortField) ? '' : table.sortField;
  selOrder.value = table.sortOrder ?? 'asc';
  selOrder.disabled = isNone(selField.value);

  const onFieldChange = (ev) => {
    const raw = ev?.detail?.value ?? ev?.target?.value ?? '';
    selOrder.disabled = isNone(raw);
    table.dispatchEvent(new CustomEvent('sort-field-changed', { detail: { value: isNone(raw) ? 'none' : raw } }));
  };
  selField.addEventListener('valueChange', onFieldChange);
  selField.addEventListener('change', onFieldChange);

  selOrder.addEventListener('change', (ev) => {
    const value = ev?.detail?.value ?? ev?.target?.value ?? 'asc';
    table.dispatchEvent(new CustomEvent('sort-order-changed', { detail: { value } }));
  });

  table.addEventListener('sort-field-updated', (ev) => {
    const value = ev.detail?.value ?? 'none';
    selField.value = isNone(value) ? '' : value;
    selOrder.disabled = isNone(value);
  });
  table.addEventListener('sort-order-updated', (ev) => {
    const value = ev.detail?.value ?? 'asc';
    selOrder.value = value;
    if (!isNone(selField.value)) selOrder.disabled = false;
  });
})();
</script>
`;
  return controls + TableTemplate(args, 'table-ext-sort', 'table-id="table-ext-sort"', pushItemsScript('table-ext-sort', fullDataItems, tableFields) + wiring);
};
ExternalSortControls.args = {
  striped: true,
  sortable: true,
  responsive: true,
  size: 'sm',
};

export const FilteringWithDropdown = (args) => {
  const ui = `
<div style="display:flex;gap:12px;margin-bottom:8px;align-items:flex-end">
  <input-group-component
    id="filterInput-demo"
    label="Filter"
    placeholder="Type to Filter..."
    name="filter"
    value=""
    append
    append-id="append-1"
    other-content
    size="sm"
  >
    <button-component btn-text="Clear" variant="secondary" slot="append" size="sm" onclick="window.clearFilter?.('filterBy-demo')"></button-component>
  </input-group-component>

  <dropdown-component
    button-text="Filter By"
    variant="secondary"
    id="filterBy-demo"
    table-id="table-filter-drop"
    size="sm"
    input-id="filterby"
    list-type="checkboxes"
  ></dropdown-component>
</div>
`;
  const wiring = `
<script type="module">
(async () => {
  const tableId = 'table-filter-drop';
  const inputId = 'filterInput-demo';
  const dropdownId = 'filterBy-demo';
  const derive = ${deriveFieldsFromFirstItem.toString()};

  await Promise.all([
    customElements.whenDefined('table-component'),
    customElements.whenDefined('dropdown-component'),
    customElements.whenDefined('input-group-component')
  ]);

  const table = document.getElementById(tableId);
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  await table?.componentOnReady?.();

  // prime dropdown options from fields
  const fields = (Array.isArray(table.fields) && table.fields.length ? table.fields : derive(table.items || [])) || [];
  const options = fields.map((f, i) => ({ key: f.key, name: f.label, value: f.key, label: f.label, checked: false, index: i }));
  if (typeof dropdown?.setOptions === 'function') dropdown.setOptions(options); else if (dropdown) dropdown.options = options;

  // typing -> filter event
  const forward = (val) => table.dispatchEvent(new CustomEvent('filter-changed', { detail: { value: String(val ?? '') } }));
  input?.addEventListener('input', (e) => forward(e?.detail?.value ?? e?.target?.value ?? ''));
  input?.addEventListener('change', (e) => forward(e?.detail?.value ?? e?.target?.value ?? ''));

  // dropdown -> document event table listens for
  dropdown?.addEventListener('selection-changed', (ev) => {
    const checked = Array.isArray(ev?.detail?.items) ? ev.detail.items : [];
    const payload = checked.map(o => ({ key: (o.key || o.value || o.name) ?? '', checked: true }));
    document.dispatchEvent(new CustomEvent('filter-fields-changed', { detail: { tableId, items: payload } }));
  });

  // clear helper (also exported on window for Clear button)
  window.clearFilter = async (dropId) => {
    const d = document.getElementById(dropId);
    const inputEl = document.getElementById('filterInput-demo');
    if (inputEl) {
      inputEl.value = '';
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.dispatchEvent(new CustomEvent('valueChange', { detail: { value: '' }, bubbles: true }));
    }
    if (typeof d?.clearSelections === 'function') await d.clearSelections();
    document.dispatchEvent(new CustomEvent('filter-fields-changed', { detail: { tableId, items: [] } }));
    table.dispatchEvent(new CustomEvent('filter-changed', { detail: { value: '' } }));
  };
})();
</script>
`;
  return ui + TableTemplate(args, 'table-filter-drop', 'table-id="table-filter-drop"', pushItemsScript('table-filter-drop', fullDataItems, tableFields) + wiring);
};
FilteringWithDropdown.args = {
  striped: true,
  responsive: true,
  size: 'sm',
};

export const WithPagination = (args) =>
  TableTemplate(
    args,
    'table-paged',
    'table-id="table-paged"',
    pushItemsScript('table-paged', fullDataItems, tableFields)
  );
WithPagination.args = {
  striped: true,
  responsive: true,
  usePagination: true,
  paginationPosition: 'both',
  paginationLayout: 'start',
  showDisplayRange: true,
  showSizeChanger: true,
  size: 'sm',
  paginationLimit: 3,
  goToButtons: 'text',
  rowsPerPage: 10,
};
