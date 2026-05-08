// src/stories/table-component.story-helpers.js
export const basicItems = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Anna', age: 25, city: 'London' },
  { name: 'Mike', age: 32, city: 'Chicago' },
  { name: 'Terry', age: 21, city: 'Augusta' },
  { name: 'Clark', age: 56, city: 'Tucson' },
];

export const basicItemsLong = [
  ...basicItems,
  { name: 'Seth', age: 31, city: 'Pittsburgh' },
  { name: 'Sean', age: 18, city: 'Tampa' },
  { name: 'Sally', age: 47, city: 'Suffolk' },
  { name: 'Pete', age: 60, city: 'Detroit' },
  { name: 'Tom', age: 51, city: 'Green Bay' },
  { name: 'Veronica', age: 23, city: 'Red Bank' },
];

export const colorVariationsItems = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Anna', age: 25, city: 'London', _cellVariants: { age: 'info', city: 'warning' } },
  { name: 'Mike', age: 32, city: 'Chicago', _cellVariants: { age: 'success', city: 'danger' } },
  { name: 'Terry', age: 21, city: 'Augusta', _rowVariant: 'primary' },
  { name: 'Clark', age: 56, city: 'Tucson', _rowVariant: 'secondary' },
];

export const detailRowItems = [
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

export const fullDataItems = [
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

export const tableFields = [
  { key: 'last_name', label: 'Last Name', sortable: true },
  { key: 'first_name', label: 'First Name', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
];

export function toHtml(out) {
  if (typeof out === 'string') return out;
  if (out && typeof out === 'object' && 'outerHTML' in out) {
    if (out instanceof HTMLElement && out.tagName.toLowerCase() === 'div') return out.innerHTML;
    return out.outerHTML;
  }
  return String(out ?? '');
}

export function normalizeHtml(html) {
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

export function normalizeJs(js) {
  return String(js ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''))
    .join('\n')
    .trim();
}

export function buildDocsHtmlJsSource({ html, js }) {
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

export const deriveFieldsFromFirstItem = items => {
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

export const isNone = v => {
  const t = (v ?? '').toString().trim().toLowerCase();
  return t === '' || t === 'none';
};

export async function whenReady(tagName, el) {
  await customElements.whenDefined(tagName);
  await el?.componentOnReady?.();
}

export function ensureGlobalHelpers() {
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

export function runWhenConnected(rootEl, fn, timeoutMs = 1500) {
  const start = performance.now();

  const tick = () => {
    if (!rootEl || rootEl.isConnected) {
      try {
        fn();
      } catch {
        // no-op
      }
      return;
    }

    if (performance.now() - start > timeoutMs) return;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export function buildTableAttrs(args, id, extraAttrs = '') {
  const attrs = [
    id ? `id="${id}"` : null,
    `table-id="${id || args.tableId || 'table'}"`,

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

    args.paginationEnabled ? 'pagination-enabled' : null,
    args.paginationVariant ? `pagination-variant="${args.paginationVariant}"` : null,

    args.usePagination ? 'use-pagination' : null,

    args.paginationPosition ? `pagination-position="${args.paginationPosition}"` : null,
    args.paginationLayout ? `pagination-layout="${args.paginationLayout}"` : null,
    args.paginationSize ? `pagination-size="${args.paginationSize}"` : null,
    args.paginationLimit != null ? `pagination-limit="${args.paginationLimit}"` : null,
    args.rowsPerPage != null ? `rows-per-page="${args.rowsPerPage}"` : null,

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

export function Template(args) {
  return normalizeHtml(renderTableStory(args, { id: 'table-docs', items: basicItems }).innerHTML);
}

export function renderTableStory(args, { id, items, fields, extraAttrs = '' } = {}) {
  const wrapper = document.createElement('div');
  wrapper.style.margin = '24px 0';

  const attrs = buildTableAttrs(args, id, extraAttrs);
  const captionSlot =
    args.caption === 'top' || args.caption === 'bottom' ? `<span slot="caption">This is an Example Caption</span>` : '';

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

    if (!isNone(args.sortField)) {
      table.sortable = !!args.sortable;
      table.dispatchEvent(new CustomEvent('sort-field-changed', { detail: { value: args.sortField } }));
      table.dispatchEvent(new CustomEvent('sort-order-changed', { detail: { value: args.sortOrder || 'asc' } }));
    }

    if ((args.filterText || '').trim()) {
      table.dispatchEvent(new CustomEvent('filter-changed', { detail: { value: args.filterText } }));
    }
  }

  return wrapper;
}

export function renderSectionStory(args, { html, tableId, items, fields } = {}) {
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

export async function wireSortControls({ root, tableId, sortFieldId, sortOrderId }) {
  ensureGlobalHelpers();

  const q = sel => (root?.querySelector ? root.querySelector(sel) : null) || document.querySelector(sel);

  const table = q(`#${CSS.escape(tableId)}`);
  const selField = q(`#${CSS.escape(sortFieldId)}`);
  const selOrder = q(`#${CSS.escape(sortOrderId)}`);
  if (!table || !selField || !selOrder) return;

  await Promise.all([
    whenReady('table-component', table),
    whenReady('select-field-component', selField),
    whenReady('select-field-component', selOrder),
  ]);

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

export async function wireFilterControls({ root, tableId, inputId, dropdownId }) {
  ensureGlobalHelpers();

  const q = sel => (root?.querySelector ? root.querySelector(sel) : null) || document.querySelector(sel);

  const table = q(`#${CSS.escape(tableId)}`);
  const input = q(`#${CSS.escape(inputId)}`);
  const dropdown = q(`#${CSS.escape(dropdownId)}`);
  if (!table || !input || !dropdown) return;

  await Promise.all([
    whenReady('table-component', table),
    whenReady('input-group-component', input),
    whenReady('dropdown-component', dropdown),
  ]);

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

export const SORT_RESET_STORY = {
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
})();
`;
  },
};

export const FILTER_RESET_STORY = {
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
})();
`;
  },
};

export const PLAYGROUND_STORY = {
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
})();
`;
  },
};

const splitIds = v => String(v || '').trim().split(/\s+/).filter(Boolean);

export const pickTableA11y = (host, scopeRoot) => {
  const table = host?.querySelector('table') || null;
  const thead = table?.querySelector('thead') || null;
  const headers = Array.from(table?.querySelectorAll('th[role="columnheader"]') || []);
  const firstRow = table?.querySelector('tbody tr[role="row"]') || null;

  const labelledby = (table?.getAttribute('aria-labelledby') || '').trim();
  const describedby = (table?.getAttribute('aria-describedby') || '').trim();

  const resolve = id => {
    if (!id) return false;
    try {
      return !!scopeRoot.querySelector(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  const labelledIds = splitIds(labelledby);
  const describedIds = splitIds(describedby);

  return {
    host: host?.tagName?.toLowerCase?.() ?? null,
    tableId: table?.getAttribute('id') ?? null,
    role: table?.getAttribute('role') ?? '(native)',
    'aria-colcount': table?.getAttribute('aria-colcount') ?? null,
    'aria-rowcount': table?.getAttribute('aria-rowcount') ?? null,
    'aria-multiselectable': table?.getAttribute('aria-multiselectable') ?? null,
    'aria-labelledby': labelledby || null,
    'aria-describedby': describedby || null,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolve),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
    headerThemeClass: thead?.getAttribute('class') ?? null,
    headers: headers.slice(0, 6).map(h => ({
      text: (h.textContent || '').trim().replace(/\s+/g, ' '),
      tabIndex: h.getAttribute('tabindex'),
      'aria-sort': h.getAttribute('aria-sort'),
      'aria-colindex': h.getAttribute('aria-colindex'),
      'aria-label': h.getAttribute('aria-label'),
    })),
    firstRow: firstRow
      ? {
          id: firstRow.getAttribute('id'),
          tabIndex: firstRow.getAttribute('tabindex'),
          'aria-selected': firstRow.getAttribute('aria-selected'),
        }
      : null,
  };
};
