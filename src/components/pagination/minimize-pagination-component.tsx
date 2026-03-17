// src/components/pagination/minimize-pagination-component.tsx
import { Component, Prop, State, Watch, Event, EventEmitter, h, Element } from '@stencil/core';

@Component({
  tag: 'minimize-pagination-component',
  styleUrls: ['./pagination-styles.scss'],
  shadow: false,
})
export class MinimizePagination {
  @Element() el!: HTMLElement;

  // Data-driven inputs
  @Prop({ mutable: true, reflect: true }) currentPage: number = 1;
  @Prop({ mutable: true, reflect: true }) pageSize: number = 10;
  @Prop() totalRows: number = 0;

  // Standalone options
  @Prop() itemsPerPageOptions: Array<number | 'All'> = [10, 20, 50, 100, 'All'];
  @Prop() itemsPerPage: boolean = false; // standalone only
  @Prop() displayTotalNumberOfPages: boolean = false; // standalone only

  @Prop() goToButtons: string = '';
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() paginationLayout: '' | 'start' | 'center' | 'end' = '';
  @Prop() plumage: boolean = false;

  /**
   * Optional external id of a region that this pagination controls.
   * Used for aria-controls on the nav buttons when provided.
   */
  @Prop({ attribute: 'control-id' }) controlId?: string;

  /**
   * Optional aria-label for the pagination nav landmark.
   * Keep short and specific to the collection being paged.
   */
  @Prop() paginationAriaLabel: string = 'Pagination';

  /** Label text for the page-size select (standalone) */
  @Prop() pageSizeLabel: string = 'Items per page:';

  /** SR-only helper text for the page-size select (standalone) */
  @Prop() pageSizeHelpText: string = 'Use this control to change how many items are shown per page.';

  /** Internal page for standalone behavior */
  @State() private page: number = 1;

  private get isManagedByParent() {
    return !!this.el.closest('pagination-component');
  }

  private uid = `mpc-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;

  private get maxPages(): number {
    const rows = Math.max(0, this.totalRows);
    const size = Math.max(1, this.pageSize || 1);
    return Math.max(1, Math.ceil(rows / size));
  }

  private get controlsId(): string | undefined {
    const v = (this.controlId || '').trim();
    return v ? v : undefined;
  }

  private get rangeId(): string {
    return `mpc-range-${this.controlsId || this.el.id || this.uid}`;
  }

  private get selectId(): string {
    return `mpc-pageSize-${this.controlsId || this.el.id || this.uid}`;
  }

  private get selectHelpId(): string {
    return `${this.selectId}__help`;
  }

  @Watch('currentPage')
  onCurrentChanged(v: number) {
    const next = Math.max(1, Math.floor(Number(v) || 1));
    this.page = Math.min(Math.max(1, next), this.maxPages);
  }

  @Watch('totalRows')
  @Watch('pageSize')
  clampToBounds() {
    const max = this.maxPages;
    if (this.page > max) this.page = max;
    if (this.page < 1) this.page = 1;
    if (this.currentPage !== this.page) this.currentPage = this.page;
  }

  componentWillLoad() {
    if (!this.isManagedByParent && this.itemsPerPage) {
      const numeric = this.itemsPerPageOptions.filter((o): o is number => o !== 'All').sort((a, b) => a - b);
      if (numeric.length) this.pageSize = numeric[0];
    }
    this.onCurrentChanged(this.currentPage);
    this.clampToBounds();
  }

  @Event({ eventName: 'change-page', bubbles: true, composed: true })
  changePage!: EventEmitter<{ page: number }>;

  private setPageAndEmit = (page: number) => {
    const max = this.maxPages;
    const next = Math.min(Math.max(1, Math.floor(page || 1)), max);
    this.page = next;
    this.currentPage = next;
    this.changePage.emit({ page: next });
  };

  private firstPage = () => this.setPageAndEmit(1);
  private prevPage = () => this.setPageAndEmit(Math.max(1, this.page - 1));
  private nextPage = () => {
    if (this.page < this.maxPages) this.setPageAndEmit(this.page + 1);
  };
  private lastPage = () => this.setPageAndEmit(this.maxPages);

  /** Same display range as parent */
  private get displayRange(): string {
    const rows = Math.max(0, this.totalRows);
    const size = Math.max(1, this.pageSize || 1);
    if (rows === 0) return '0-0 of 0';

    let start = (this.page - 1) * size + 1;
    let end = this.page * size;

    if (start > rows) start = rows;
    if (start < 1) start = 1;
    if (end < start) end = start;
    if (end > rows) end = rows;

    return `${start}-${end} of ${rows}`;
  }

  private onItemsPerPageChange = (e: Event) => {
    const val = (e.target as HTMLSelectElement)?.value;

    // If totalRows===0, "All" is disabled, but guard anyway.
    const newSize = val === 'All' ? this.totalRows : parseInt(val || '10', 10);

    this.pageSize = Number.isFinite(newSize) && newSize > 0 ? newSize : 10;
    this.setPageAndEmit(1);
    this.clampToBounds();
  };

  /**
   * A11y note:
   * - Native <select> already exposes correct semantics. Do NOT add role="listbox".
   * - Use a real <label for="..."> association.
   * - Keep aria-describedby resolvable via a stable help node.
   */
  private renderSizeChanger() {
    const sizeCls = this.size === 'sm' ? 'select-sm' : this.size === 'lg' ? 'select-lg' : '';
    const wrap = 'size-changer' + (this.size === 'sm' ? ' size-changer-sm' : this.size === 'lg' ? ' size-changer-lg' : '');
    const disableAll = this.totalRows === 0;

    const selectId = this.selectId;
    const helpId = this.selectHelpId;

    return (
      <div class={wrap}>
        <label htmlFor={selectId}>{this.pageSizeLabel || 'Items per page:'} </label>

        <div id={helpId} class="sr-only">
          {this.pageSizeHelpText}
        </div>

        <select
          id={selectId}
          class={`form-select form-control ${sizeCls}`}
          aria-describedby={helpId}
          onChange={this.onItemsPerPageChange}
        >
          {this.itemsPerPageOptions.map(opt => {
            const isAll = opt === 'All';
            const isNum = typeof opt === 'number';

            const disabled = isAll ? disableAll : isNum && this.totalRows > 0 && opt > this.totalRows;
            const selected = isAll ? this.totalRows > 0 && this.pageSize === this.totalRows : this.pageSize === (opt as any);

            return (
              <option value={String(opt)} selected={selected} disabled={disabled}>
                {String(opt)}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  private rowDisplay = (extra = '') => (
    <div
      id={this.rangeId}
      class={'pagination-cell row-display' + (this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : '') + extra}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {this.displayRange}
    </div>
  );

  private renderBar() {
    const sizeCls = this.size === 'sm' ? ' pagination-sm' : this.size === 'lg' ? ' pagination-lg' : '';
    const layoutCls =
      this.paginationLayout === 'center' ? ' justify-content-center' : this.paginationLayout === 'end' ? ' justify-content-end' : '';
    const plumageCls = this.plumage ? ' plumage' : '';

    const atStart = this.page <= 1;
    const atEnd = this.page >= this.maxPages;

    const ariaControls = this.controlsId; // only if provided

    // ✅ Use nav landmark + standard list semantics (NOT menubar/menuitem)
    return (
      <nav aria-label={this.paginationAriaLabel || 'Pagination'}>
        <ul class={`pagination b-pagination${sizeCls}${layoutCls}${plumageCls}`}>
          <li class={`page-item${atStart ? ' disabled' : ''}`}>
            <button
              type="button"
              class="page-link"
              onClick={this.firstPage}
              disabled={atStart}
              aria-disabled={atStart ? 'true' : undefined}
              aria-label="Go to first page"
              aria-controls={ariaControls}
              tabIndex={atStart ? -1 : 0}
            >
              {this.goToButtons === 'text' ? (
                'First'
              ) : (
                <i class="fa-solid fa-angles-left" aria-hidden="true"></i>
              )}
            </button>
          </li>

          <li class={`page-item${atStart ? ' disabled' : ''}`}>
            <button
              type="button"
              class="page-link"
              onClick={this.prevPage}
              disabled={atStart}
              aria-disabled={atStart ? 'true' : undefined}
              aria-label="Go to previous page"
              aria-controls={ariaControls}
              tabIndex={atStart ? -1 : 0}
            >
              {this.goToButtons === 'text' ? (
                'Prev'
              ) : (
                <i class="fa-solid fa-angle-left" aria-hidden="true"></i>
              )}
            </button>
          </li>

          <li class={`page-item${atEnd ? ' disabled' : ''}`}>
            <button
              type="button"
              class="page-link"
              onClick={this.nextPage}
              disabled={atEnd}
              aria-disabled={atEnd ? 'true' : undefined}
              aria-label="Go to next page"
              aria-controls={ariaControls}
              tabIndex={atEnd ? -1 : 0}
            >
              {this.goToButtons === 'text' ? (
                'Next'
              ) : (
                <i class="fa-solid fa-angle-right" aria-hidden="true"></i>
              )}
            </button>
          </li>

          <li class={`page-item${atEnd ? ' disabled' : ''}`}>
            <button
              type="button"
              class="page-link"
              onClick={this.lastPage}
              disabled={atEnd}
              aria-disabled={atEnd ? 'true' : undefined}
              aria-label="Go to last page"
              aria-controls={ariaControls}
              tabIndex={atEnd ? -1 : 0}
            >
              {this.goToButtons === 'text' ? (
                'Last'
              ) : (
                <i class="fa-solid fa-angles-right" aria-hidden="true"></i>
              )}
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  render() {
    const rootCls = 'pagination-layout' + (this.plumage ? ' plumage' : '');
    const splitRootCls = 'pagination-split-layout' + (this.plumage ? ' plumage' : '');

    const showChildSizer = this.itemsPerPage && !this.isManagedByParent;
    const showChildRange = this.displayTotalNumberOfPages && !this.isManagedByParent;

    if (showChildSizer && this.paginationLayout === 'start') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.renderBar()}</div>
          {showChildRange ? this.rowDisplay('') : null}
          <div class="pagination-cell end">{this.renderSizeChanger()}</div>
        </div>
      );
    } else if (showChildSizer && this.paginationLayout === 'center') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell center">{this.renderBar()}</div>
          {showChildRange ? this.rowDisplay('') : null}
          <div class="pagination-cell center">{this.renderSizeChanger()}</div>
        </div>
      );
    } else if (showChildSizer && this.paginationLayout === 'end') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.renderSizeChanger()}</div>
          {showChildRange ? this.rowDisplay('') : null}
          <div class="pagination-cell end">{this.renderBar()}</div>
        </div>
      );
    }

    if (showChildRange && this.paginationLayout === 'start' && !showChildSizer) {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.renderBar()}</div>
          {this.rowDisplay(' end')}
        </div>
      );
    } else if (showChildRange && this.paginationLayout === 'center' && !showChildSizer) {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell center">{this.renderBar()}</div>
          {this.rowDisplay(' justify-content-center flex-fill50')}
        </div>
      );
    } else if (showChildRange && this.paginationLayout === 'end' && !showChildSizer) {
      return (
        <div class={splitRootCls}>
          {this.rowDisplay(' start')}
          <div class="pagination-cell end">{this.renderBar()}</div>
        </div>
      );
    }

    return <div class={rootCls}>{this.renderBar()}</div>;
  }
}
