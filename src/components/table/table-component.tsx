// src/components/table/table-component.tsx
import { Component, h, Prop, State, Element, Event, EventEmitter, Watch, Listen, Method, Fragment } from '@stencil/core';

// 👇 make these exported so components.d.ts can see them
export type SortOrder = 'asc' | 'desc';
export type SelectMode = '' | 'single' | 'multi' | 'range';
export type Variant = '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' | 'light';

export type Field =
  | string
  | {
      key?: string;
      label?: string;
      sortable?: boolean;
      variant?: Variant | '';
    };

@Component({
  tag: 'table-component',
  styleUrl: 'table-component-styles.scss',
  shadow: false,
})
export class TableComponent {
  @Element() host!: HTMLElement;

  // ----- Styling props -----
  @Prop() addBorder: boolean = false;
  @Prop() removeBorder: boolean = false;
  @Prop() darkTableTheme: boolean = false;
  @Prop() darkHeader: boolean = false;
  @Prop() lightHeader: boolean = false;
  @Prop() rowHover: boolean = false;
  @Prop() plumage: boolean = false;
  @Prop() noBorderCollapsed: boolean = false;
  @Prop() selectedVariant: string = 'table-active';
  @Prop() size: '' | 'sm' = '';
  @Prop() striped: boolean = false;
  @Prop() tableVariant: Variant | 'table' = 'table';

  // ----- Layout props -----
  @Prop() caption: '' | 'top' | 'bottom' = '';
  @Prop() cloneFooter: boolean = false;
  @Prop({ mutable: true }) expandedRows: number[] = [];
  @Prop() fields: Field[] = [];
  @Prop() fixedTableHeader: boolean = false;
  @Prop() responsive: boolean = false;
  @Prop() stacked: boolean = false;
  @Prop() sticky: boolean = false;

  // ----- Data -----
  @Prop({ mutable: true }) items: any[] = [];
  @Prop({ mutable: true }) originalItems: any[] = [];

  // ----- Sorting & Filtering -----
  @Prop() dropdownId: string = '';
  @Prop({ mutable: true }) filterText: string = '';
  @Prop({ mutable: true }) sortCriteria: Array<{ key: string; order: SortOrder | 'none' }> = [];
  @Prop({ mutable: true }) sortField: string = 'none';
  @Prop() sortable: boolean = false;
  @Prop({ mutable: true }) sortOrder: SortOrder = 'asc';
  @Prop({ mutable: true }) sortOrderDisabled: boolean = true;

  // ----- Selection -----
  @Prop({ mutable: true }) selectedFilterFields: string[] = [];
  @Prop({ mutable: true }) selectedRows: any[] = [];
  @Prop() selectMode: SelectMode = '';
  @Prop() tableId: string = '';

  // ----- Pagination -----
  @Prop({ mutable: true }) currentPage: number = 1;
  @Prop() goToButtons: string = '';
  @Prop() hideEllipsis: boolean = false;
  @Prop() hideGotoEndButtons: boolean = false;
  @Prop() paginationLayout: string = '';
  @Prop() paginationSize: '' | 'sm' | 'lg' = '';
  @Prop() paginationLimit: number = 5;
  @Prop() paginationPosition: 'top' | 'bottom' | 'both' = 'bottom';
  @Prop() paginationVariantColor: string = '';
  @Prop() pageSizeOptions: Array<number | 'All'> = [10, 20, 50, 100, 'All'];
  @Prop({ mutable: true }) rowsPerPage: number = 10;
  @Prop() showDisplayRange: boolean = false;
  @Prop() showSizeChanger: boolean = false;
  @Prop({ mutable: true }) totalRows: number = 0;

  /**
   * ✅ New API (recommended)
   * Enables pagination UI + slicing.
   */
  @Prop() paginationEnabled: boolean = false;

  /**
   * ✅ New API (recommended)
   * Which paginator UI to use.
   */
  @Prop() paginationVariant: 'standard' | 'minimize' | 'by-page' = 'standard';

  /**
   * Legacy props (kept for backwards compatibility)
   * @deprecated use paginationEnabled + paginationVariant instead
   */
  @Prop() usePagination: boolean = false;
  /** @deprecated */
  @Prop() useByPagePagination: boolean = false;
  /** @deprecated */
  @Prop() useMinimizePagination: boolean = false;

  // ----- Events -----
  @Event({ eventName: 'sort-field-updated' }) sortFieldUpdated!: EventEmitter<{ value: string }>;
  @Event({ eventName: 'sort-order-updated' }) sortOrderUpdated!: EventEmitter<{ value: string }>;
  @Event({ eventName: 'sort-changed' }) sortChanged!: EventEmitter<{ field: string; order: string }>;
  @Event({ eventName: 'row-selected' }) rowSelected!: EventEmitter<any[]>;
  // pagination-component is expected to emit 'page-changed' and 'page-size-changed'

  // ----- Internal -----
  @State() _nop: boolean = false; // just to force rerender if ever needed (shouldn't)

  // ======= NEW: effective pagination resolution =======

  private get effectivePaginationEnabled(): boolean {
    // new prop wins, but keep legacy behavior
    return !!this.paginationEnabled || !!this.usePagination;
  }

  private get effectivePaginationVariant(): 'standard' | 'minimize' | 'by-page' {
    // new prop wins (unless left at default "standard", in which case legacy may pick a variant)
    if (this.paginationVariant && this.paginationVariant !== 'standard') return this.paginationVariant;

    // legacy fallback
    if (this.useMinimizePagination) return 'minimize';
    if (this.useByPagePagination) return 'by-page';
    return 'standard';
  }

  // ======= LIFECYCLE =======

  componentWillLoad() {
    // Initialize rowsPerPage from options when showSizeChanger true (mimic Lit constructor behavior)
    if (this.showSizeChanger) {
      const numeric = this.pageSizeOptions.filter((n): n is number => n !== 'All') as number[];
      const lowest = [...numeric].sort((a, b) => a - b)[0];
      this.rowsPerPage = lowest ?? (typeof this.pageSizeOptions[0] === 'number' ? (this.pageSizeOptions[0] as number) : 10);
    }
    if (this.originalItems.length === 0 && this.items.length > 0) {
      this.originalItems = [...this.items];
    }
    this.updateTotalRows();
  }

  // Document-level listener replacement for connected/disconnected add/remove
  @Listen('filter-fields-changed', { target: 'document' })
  onDropdownFilterFieldsChanged(ev: CustomEvent<{ tableId: string; items: Array<{ key: string; checked: boolean }> }>) {
    if (!ev?.detail || ev.detail.tableId !== this.tableId) return;
    const selected = ev.detail.items.filter(i => i.checked).map(i => i.key);
    this.selectedFilterFields = selected;
    this.applyFilter();
  }

  // Child event listeners (from sibling components) — these bubble, so host can listen.
  @Listen('sort-field-changed')
  handleFieldChanged(ev: CustomEvent<{ value: string }>) {
    this.sortField = ev.detail?.value ?? 'none';
    this.sortOrderDisabled = this.sortField === 'none';

    if (this.sortField !== 'none') {
      if (this.sortOrder !== 'asc' && this.sortOrder !== 'desc') {
        this.sortOrder = 'asc';
      }
      this.applySort();
    } else {
      this.resetColumnSort();
    }
  }

  @Listen('sort-order-changed')
  handleOrderChanged(ev: CustomEvent<{ value: SortOrder }>) {
    this.sortOrder = ev.detail?.value ?? 'asc';
    this.applySort();
  }

  @Listen('filter-changed')
  handleFilterChanged(ev: CustomEvent<{ value: string }>) {
    this.filterText = ev.detail?.value ?? '';
    this.applyFilter();
  }

  @Listen('page-size-changed')
  handlePageSizeChanged(ev: CustomEvent<{ pageSize: number | 'All' }>) {
    const raw = ev?.detail?.pageSize;

    if (raw === 'All') {
      // ✅ Use filtered view size, not original dataset size
      const rows = Math.max(0, Number(this.totalRows ?? this.filteredItems?.length ?? 0));
      this.rowsPerPage = rows > 0 ? rows : this.rowsPerPage;
    } else {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) {
        this.rowsPerPage = n;
      }
    }

    this.currentPage = 1;
  }

  // ✅ Accept { page, pageSize } payload emitted by pagination-component
  @Listen('page-changed')
  onPageChanged(ev: CustomEvent<{ page: number; pageSize?: number }>) {
    this.currentPage = Math.max(1, Number(ev.detail?.page ?? 1));
  }

  // ======= WATCHERS =======
  @Watch('items')
  onItemsChange(newVal: any[]) {
    if (!Array.isArray(this.originalItems) || this.originalItems.length === 0) {
      this.originalItems = Array.isArray(newVal) ? [...newVal] : [];
    }
    this.updateTotalRows();
  }

  @Watch('originalItems')
  onOriginalItemsChange() {
    this.updateTotalRows();
  }

  @Watch('filterText')
  onFilterTextChange() {
    this.updateTotalRows();
  }

  // ======== METHODS =======

  @Method()
  async resetSort(): Promise<void> {
    this.sortCriteria = [];
    this.sortField = 'none';
    this.sortOrder = 'asc';
    this.sortOrderDisabled = true;
    this.clearSelection();
    this.items = [...this.originalItems];
    this.expandedRows = [];

    // parity events
    this.sortFieldUpdated.emit({ value: 'none' });
    this.sortOrderUpdated.emit({ value: 'asc' });

    // Clear filters
    this.filterText = '';
    this.selectedFilterFields = [];
    this.applyFilter();

    // (optional) clear linked dropdown if present
    const dropdown = document.getElementById(this.tableId + '-dropdown') as any;
    dropdown?.clearSelections?.();
  }

  // ======= HELPERS =======

  private cx(map: Record<string, any>) {
    return Object.keys(map)
      .filter(k => !!map[k])
      .join(' ');
  }

  private tableVariantColor(variant: Variant | ''): string {
    const map: Record<string, string> = {
      primary: 'table-primary',
      secondary: 'table-secondary',
      success: 'table-success',
      danger: 'table-danger',
      info: 'table-info',
      warning: 'table-warning',
      dark: 'table-dark',
      light: 'table-light',
    };
    return map[variant || ''] || '';
  }

  private headerTheme(): string {
    return this.darkHeader ? 'thead-dark' : this.lightHeader ? 'thead-light' : '';
  }

  private formatHeader(key: string): string {
    return key
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private get normalizedFields(): Array<{ key: string; label: string; sortable: boolean; variant: Variant | '' }> {
    if (this.fields && this.fields.length > 0) {
      return this.fields.map((f: Field) => {
        if (typeof f === 'string') {
          return { key: f, label: this.formatHeader(f), sortable: this.sortable, variant: '' as Variant | '' };
        }
        const key = f.key || (f as any).key || '';
        return {
          key,
          label: f.label || this.formatHeader(key),
          sortable: typeof f.sortable === 'boolean' ? f.sortable : this.sortable,
          variant: (f.variant || '') as Variant | '',
        };
      });
    }

    if (this.items && this.items.length > 0) {
      const ignore = new Set(['_cellVariants', '_rowVariant', '_showDetails', '_additionalInfo']);
      return Object.keys(this.items[0])
        .filter(k => !ignore.has(k))
        .map(k => ({ key: k, label: this.formatHeader(k), sortable: this.sortable, variant: '' as Variant | '' }));
    }

    return [];
  }

  private evaluateTemplateLiteral(template: string, data: any) {
    // Parity with Lit version. Be cautious with untrusted templates.
    return new Function('return `' + template + '`;').call(data);
  }

  // ======= SORT / FILTER =======

  private applySort() {
    if (!this.sortField || this.sortField === 'none') {
      this.resetColumnSort();
      return;
    }

    const first = this.sortCriteria[0];
    if (!first || first.key !== this.sortField) {
      this.sortCriteria = [{ key: this.sortField, order: this.sortOrder }];
    } else {
      this.sortCriteria = [{ key: this.sortField, order: this.sortOrder }, ...this.sortCriteria.slice(1)];
    }

    const expandedRowRefs = this.expandedRows.map(idx => this.items[idx]);

    this.items = this.sortByCriteria(this.originalItems, this.sortCriteria);

    this.expandedRows = expandedRowRefs.map(row => this.items.indexOf(row)).filter(i => i >= 0);

    this.clearSelection();
    this.updateTotalRows();

    this.sortFieldUpdated.emit({ value: this.sortField });
    this.sortOrderUpdated.emit({ value: this.sortOrder });
    this.sortChanged.emit({ field: this.sortField, order: this.sortOrder });
  }

  private applyFilter() {
    const ft = (this.filterText ?? '').trim().toLowerCase();

    // 1) No text → show everything
    if (ft === '') {
      this.items = [...this.originalItems];
      this.clearSelection();
      this.updateTotalRows();
      this.currentPage = 1;
      return;
    }

    // 2) Determine which columns to search
    const ignore = new Set(['_cellVariants', '_rowVariant', '_showDetails', '_additionalInfo']);
    const allKeys = this.originalItems.length > 0 ? Object.keys(this.originalItems[0]).filter(k => !ignore.has(k)) : [];

    const keysToSearch = Array.isArray(this.selectedFilterFields) && this.selectedFilterFields.length > 0 ? this.selectedFilterFields : allKeys;

    // 3) Filter rows
    const filtered = this.originalItems.filter(row =>
      keysToSearch.some(k => {
        const v = row?.[k];
        return v != null && String(v).toLowerCase().includes(ft);
      }),
    );

    this.items = filtered;
    this.clearSelection();
    this.updateTotalRows();
    this.currentPage = 1;
  }

  private clearSelection() {
    this.selectedRows = [];
    this.rowSelected.emit([]);
  }

  private resetColumnSort() {
    this.sortCriteria = [];
    this.items = [...this.originalItems];
    this.clearSelection();
    this.updateTotalRows();
  }

  updateTotalRows() {
    this.totalRows = this.filteredItems.length;
  }

  get sortedItems(): any[] {
    if (this.sortCriteria && this.sortCriteria.length > 0) {
      return this.sortByCriteria(this.originalItems, this.sortCriteria);
    }
    if (this.sortField && this.sortField !== 'none') {
      return this.sortByCriteria(this.originalItems, [{ key: this.sortField, order: this.sortOrder }]);
    }
    return this.originalItems;
  }

  get filteredItems(): any[] {
    const ft = (this.filterText ?? '').trim().toLowerCase();
    if (!ft) return this.sortedItems;

    if (this.selectedFilterFields.length > 0) {
      return this.sortedItems.filter(item =>
        this.selectedFilterFields.some(field => {
          const v = item[field];
          return v && String(v).toLowerCase().includes(ft);
        }),
      );
    }

    return this.sortedItems.filter(item => JSON.stringify(item).toLowerCase().includes(ft));
  }

  get paginatedItems(): any[] {
    if (!this.effectivePaginationEnabled) return this.filteredItems;
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredItems.slice(start, end);
  }

  // ======= UI helpers =======

  private getAriaSort(key: string): 'ascending' | 'descending' | 'none' | null {
    if (!this.sortable) return null;
    const c = this.sortCriteria.find(sc => sc.key === key);
    if (c) {
      return c.order === 'asc' ? 'ascending' : c.order === 'desc' ? 'descending' : 'none';
    }
    return 'none';
  }

  private renderSortIndicator(key: string) {
    if (!this.sortable) return null;
    const c = this.sortCriteria.find(sc => sc.key === key);
    if (c) {
      const orderClass = c.order === 'asc' ? 'ascending' : c.order === 'desc' ? 'descending' : 'none';
      const indexSup = this.sortCriteria.length > 1 ? <sup>{this.sortCriteria.indexOf(c) + 1}</sup> : null;
      return (
        <Fragment>
          <i class={`sort-icon ${orderClass}`} />
          {indexSup}
        </Fragment>
      );
    }
    return <i class="sort-icon none" />;
  }

  /** Normalize a value for comparison. Numbers stay numbers; strings compare case-insensitively; null/undefined sort last. */
  private normalizeForSort(v: any): { type: number; val: any } {
    if (v === null || v === undefined) return { type: 2, val: null }; // put nullish last
    if (typeof v === 'number') return { type: 0, val: v };
    const s = String(v);
    return { type: 1, val: s.toLowerCase() };
  }

  /** Compare two rows using multi-criteria (stable within this comparator). */
  private multiCompare(a: any, b: any, criteria: Array<{ key: string; order: SortOrder | 'none' }>): number {
    if (!criteria || criteria.length === 0) return 0;
    for (const c of criteria) {
      if (!c || c.order === 'none') continue;
      const av = this.normalizeForSort(a?.[c.key]);
      const bv = this.normalizeForSort(b?.[c.key]);

      // First compare by type bucket (numbers before strings before nulls)
      if (av.type !== bv.type) {
        return av.type < bv.type ? (c.order === 'asc' ? -1 : 1) : c.order === 'asc' ? 1 : -1;
      }
      // Same type: compare raw normalized values
      if (av.val < bv.val) return c.order === 'asc' ? -1 : 1;
      if (av.val > bv.val) return c.order === 'asc' ? 1 : -1;
    }
    return 0;
  }

  /** Return a new array sorted by current criteria (or identity when none). */
  private sortByCriteria(items: any[], criteria: Array<{ key: string; order: SortOrder | 'none' }>): any[] {
    if (!Array.isArray(items) || items.length < 2 || !criteria || criteria.length === 0) return Array.isArray(items) ? [...items] : [];
    // Decorate with original index to keep stable order for perfect ties
    return items
      .map((row, idx) => ({ row, idx }))
      .sort((A, B) => {
        const cmp = this.multiCompare(A.row, B.row, criteria);
        if (cmp !== 0) return cmp;
        // full tie on all criteria -> preserve original order
        return A.idx - B.idx;
      })
      .map(x => x.row);
  }

  private renderDetails(row: any) {
    const content = row._additionalInfo ? this.evaluateTemplateLiteral(row._additionalInfo, row) : 'No additional information';
    return <div class="details" innerHTML={content} />;
  }

  private handleHeaderKeyDown = (ev: KeyboardEvent, key: string) => {
    if (!this.sortable) return;
    const keys = ['Enter', ' ', 'Spacebar', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(ev.key)) return;
    ev.preventDefault();
    this.sortItems(ev as any, key);
  };

  private sortItems(ev: MouseEvent | KeyboardEvent, key: string) {
    if (!this.sortable) return;
    const existing = this.sortCriteria.find(c => c.key === key);

    const isMulti = (ev as KeyboardEvent).ctrlKey || (ev as KeyboardEvent).metaKey;

    if (isMulti) {
      if (existing) {
        existing.order = existing.order === 'asc' ? 'desc' : ((existing.order === 'desc' ? 'none' : 'asc') as any);
        if (existing.order === 'none') {
          this.sortCriteria = this.sortCriteria.filter(c => c.key !== key);
        } else {
          this.sortCriteria = [...this.sortCriteria];
        }
      } else {
        this.sortCriteria = [...this.sortCriteria, { key, order: 'asc' }];
      }
    } else {
      if (existing) {
        if (existing.order === 'asc') this.sortCriteria = [{ key, order: 'desc' }];
        else if (existing.order === 'desc') this.sortCriteria = [];
        else this.sortCriteria = [{ key, order: 'asc' }];
      } else {
        this.sortCriteria = [{ key, order: 'asc' }];
      }
    }

    if (this.sortCriteria.length === 0) {
      this.sortField = 'none';
      this.sortOrder = 'asc';
      this.sortOrderDisabled = true;
    } else {
      this.sortField = this.sortCriteria[0].key;
      this.sortOrder = (this.sortCriteria[0].order as SortOrder) || 'asc';
      this.sortOrderDisabled = false;
    }

    // inside sortItems after computing this.sortCriteria, before emitting events
    const expandedRowRefs = this.expandedRows.map(idx => this.items[idx]);

    this.items = this.sortByCriteria(this.originalItems, this.sortCriteria);

    this.expandedRows = expandedRowRefs.map(row => this.items.indexOf(row)).filter(i => i >= 0);
    this.clearSelection();
    this.updateTotalRows();

    this.sortFieldUpdated.emit({ value: this.sortField || 'none' });
    this.sortOrderUpdated.emit({ value: this.sortOrder });
    this.sortChanged.emit({ field: this.sortField, order: this.sortOrder });
  }

  toggleDetails(rowIndex: number) {
    const idx = this.expandedRows.indexOf(rowIndex);
    if (idx === -1) this.expandedRows = [...this.expandedRows, rowIndex];
    else this.expandedRows = this.expandedRows.filter(i => i !== rowIndex);
  }

  private selectRow = (ev: MouseEvent, pageIndex: number) => {
    const globalIndex = (this.currentPage - 1) * this.rowsPerPage + pageIndex;
    const row = this.filteredItems[globalIndex];

    if (this.selectMode === 'single') {
      this.selectedRows = this.selectedRows.includes(row) ? [] : [row];
    } else if (this.selectMode === 'multi') {
      this.selectedRows = this.selectedRows.includes(row) ? this.selectedRows.filter(r => r !== row) : [...this.selectedRows, row];
    } else if (this.selectMode === 'range') {
      if ((ev as MouseEvent).shiftKey) {
        const lastIdx = this.filteredItems.indexOf(this.selectedRows[this.selectedRows.length - 1]);
        const start = Math.min(lastIdx, globalIndex);
        const end = Math.max(lastIdx, globalIndex);
        const rangeRows = this.filteredItems.slice(start, end + 1);
        this.selectedRows = Array.from(new Set([...this.selectedRows, ...rangeRows]));
      } else if (ev.ctrlKey || (ev as any).metaKey) {
        this.selectedRows = this.selectedRows.includes(row) ? this.selectedRows.filter(r => r !== row) : [...this.selectedRows, row];
      } else {
        this.selectedRows = [row];
      }
    }

    this.rowSelected.emit(this.selectedRows);
  };

  private selectAllRows = () => {
    this.selectedRows = this.selectedRows.length === this.items.length || this.selectedRows.length > 0 ? [] : [...this.items];
    this.rowSelected.emit(this.selectedRows);
  };

  // ======= RENDER =======

  private renderTableHeader() {
    const hasDetailsRows = (this.items || []).some(r => r?._showDetails);

    let headerIconClass = 'square-outline-icon';
    if (this.selectedRows.length === this.items.length && this.items.length > 0) headerIconClass = 'check-icon';
    else if (this.selectedRows.length > 0) headerIconClass = 'partial-icon';

    return (
      <tr role="row">
        {['single', 'multi', 'range'].includes(this.selectMode) ? (
          <th class="select-col" onClick={this.selectAllRows}>
            {this.items.length === 0 ? null : <button class={`${headerIconClass} select-row-btns`} />}
          </th>
        ) : null}

        {hasDetailsRows ? <th class="toggle-col" /> : null}

        {this.normalizedFields.map(({ key, label, sortable, variant }, index) =>
          sortable && this.sortable ? (
            <th
              role="columnheader"
              scope="col"
              tabIndex={0}
              aria-colindex={index + 1}
              aria-sort={this.getAriaSort(key)}
              class={this.tableVariantColor(variant)}
              data-field={key}
              onClick={ev => this.sortItems(ev as any, key)}
              onKeyDown={ev => this.handleHeaderKeyDown(ev, key)}
              style={{ cursor: 'pointer' }}
            >
              {label} {this.renderSortIndicator(key)}
            </th>
          ) : (
            <th role="columnheader" scope="col" aria-colindex={index + 1} class={this.tableVariantColor(variant)}>
              {label}
            </th>
          ),
        )}
      </tr>
    );
  }

  // ✅ Updated: pagination-component now uses `variant`
  private renderPagination(position: 'top' | 'bottom') {
    const Paginator = 'pagination-component' as any;

    return (
      <Paginator
        // identity / wiring
        id={this.tableId}
        tableId={this.tableId}
        position={position}
        plumage={this.plumage}
        size={this.paginationSize || (this.size as any)}
        // data
        currentPage={this.currentPage}
        pageSize={this.rowsPerPage}
        totalRows={this.totalRows}
        // options / UI
        limit={this.paginationLimit}
        goToButtons={this.goToButtons}
        hideEllipsis={this.hideEllipsis}
        hideGoToButtons={this.hideGotoEndButtons}
        paginationLayout={(this.paginationLayout as any) || ''}
        paginationVariantColor={this.paginationVariantColor}
        // size changer + range display
        itemsPerPage={this.showSizeChanger}
        itemsPerPageOptions={this.pageSizeOptions as any}
        displayTotalNumberOfPages={this.showDisplayRange}
        // ✅ single variant
        variant={this.effectivePaginationVariant}
      />
    );
  }

  private renderTable() {
    const tableVariantColor = this.tableVariantColor(this.tableVariant as Variant);
    const hasDetailsRows = (this.items || []).some(r => r?._showDetails);

    const selectableClasses = {
      'table-select-single': this.selectMode === 'single',
      'table-select-multi': this.selectMode === 'multi',
      'table-select-range': this.selectMode === 'range',
      'table-selecting': this.selectedRows.length > 0,
    };

    const baseClasses = {
      'table': true,
      'table-hover': this.rowHover,
      'table-striped': this.striped,
      'table-bordered': this.addBorder,
      'table-borderless': this.removeBorder,
      'table-sm': this.size === 'sm',
      'table-dark': this.darkTableTheme,
      'table-fixed': this.fixedTableHeader,
      'table-no-border-collapse': this.noBorderCollapsed,
      'table-caption-top': this.caption === 'top',
      'table-stacked': this.stacked,
    };

    const className = this.cx({ ...baseClasses, ...selectableClasses, [tableVariantColor]: !!tableVariantColor });

    let logicalRowIndex = 0;

    return (
      <table
        role="table"
        id={this.tableId}
        aria-colcount={this.normalizedFields.length + (hasDetailsRows ? 1 : 0) + (['single', 'multi', 'range'].includes(this.selectMode) ? 1 : 0)}
        aria-multiselectable={String(this.selectMode !== 'single')}
        class={className}
      >
        {this.caption === 'top' ? (
          <caption>
            <slot name="caption" />
          </caption>
        ) : null}

        <thead role="rowgroup" class={this.headerTheme()}>
          {this.renderTableHeader()}
        </thead>

        <tbody role="rowgroup">
          {this.paginatedItems.flatMap((row, pageIndex) => {
            const rowVariantClass = row._rowVariant ? this.tableVariantColor(row._rowVariant) : '';
            const isSelected = this.selectedRows.includes(row);
            const isExpanded = this.expandedRows.includes(pageIndex);

            const isStriped = this.striped && logicalRowIndex % 2 === 1;
            const stripeClass = this.darkTableTheme ? 'striped-row-dark' : 'striped-row';
            const mainRowClass = isStriped ? '' : stripeClass;

            const mainRow = (
              <tr
                role="row"
                class={`${mainRowClass} ${rowVariantClass} ${isSelected ? `table-row-selected ${this.selectedVariant}` : ''}`}
                tabIndex={0}
                aria-selected={isSelected ? 'true' : 'false'}
              >
                {['single', 'multi', 'range'].includes(this.selectMode) ? (
                  <td class="select-col" onClick={ev => this.selectRow(ev, pageIndex)}>
                    {isSelected ? <button class="check-icon select-row-btns" /> : <button class="square-outline-icon select-row-btns" />}
                  </td>
                ) : null}

                {row._showDetails ? (
                  <td onClick={() => this.toggleDetails(pageIndex)} style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
                    <button class="btn-stripped">
                      <i class={`caret-icon ${isExpanded ? 'rotate-down' : 'rotate-up'}`} />
                    </button>
                  </td>
                ) : hasDetailsRows ? (
                  <td />
                ) : null}

                {this.normalizedFields.map(({ key, variant }, index) => {
                  const cell = row[key];
                  const cellVariant = (row._cellVariants && row._cellVariants[key] ? this.tableVariantColor(row._cellVariants[key]) : this.tableVariantColor(variant)) || '';
                  return (
                    <td aria-colindex={index + 1} role="cell" class={cellVariant}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            );

            logicalRowIndex++;

            const detailRow = row._showDetails ? (
              <tr role="row" class="details-row" data-expanded={isExpanded ? 'true' : 'false'}>
                <td colSpan={this.normalizedFields.length + 1 + (['single', 'multi', 'range'].includes(this.selectMode) ? 1 : 0)}>
                  <div>{this.renderDetails(row)}</div>
                </td>
              </tr>
            ) : null;

            return [mainRow, detailRow];
          })}

          {this.paginatedItems.length === 0 ? (
            <tr>
              <td colSpan={this.normalizedFields.length + 1}>There are no records matching your request</td>
            </tr>
          ) : null}
        </tbody>

        {this.caption === 'bottom' ? (
          <caption>
            <slot name="caption" />
          </caption>
        ) : null}

        {this.cloneFooter ? (
          <tfoot role="rowgroup" class={this.headerTheme()}>
            {this.renderTableHeader()}
          </tfoot>
        ) : null}
      </table>
    );
  }

  render() {
    const topPaginate = this.effectivePaginationEnabled && (this.paginationPosition === 'top' || this.paginationPosition === 'both');
    const bottomPaginate = this.effectivePaginationEnabled && (this.paginationPosition === 'bottom' || this.paginationPosition === 'both');

    const tableBody = this.responsive ? (
      <div class="table-responsive">{this.renderTable()}</div>
    ) : this.sticky ? (
      <div class="table-sticky-header">{this.renderTable()}</div>
    ) : (
      this.renderTable()
    );

    return (
      <div class={this.plumage ? 'plumage' : undefined}>
        {topPaginate ? this.renderPagination('top') : null}
        {tableBody}
        {bottomPaginate ? this.renderPagination('bottom') : null}
      </div>
    );
  }
}
