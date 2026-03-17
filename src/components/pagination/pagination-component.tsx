// src/components/pagination/pagination-component.tsx
import { Component, Prop, State, Event, EventEmitter, h, Element, Watch, Listen } from '@stencil/core';

@Component({
  tag: 'pagination-component',
  styleUrls: [
    './pagination-styles.scss',
    '../input-field/input-field-styles.scss',
    '../plumage-select-field/plumage-select-field-styles.scss',
    '../form-styles.scss',
  ],
  shadow: false,
})
export class PaginationComponent {
  @Element() el!: HTMLElement;

  // Data-driven inputs
  @Prop({ mutable: true, reflect: true }) currentPage: number = 1;
  @Prop({ mutable: true, reflect: true }) pageSize: number = 10;
  @Prop() totalRows: number = 0;

  // UI / behavior
  @Prop() limit: number = 5;
  @Prop() goToButtons: string = 'icon';
  @Prop() hideEllipsis: boolean = false;
  @Prop() hideGoToButtons: boolean = false;

  @Prop() itemsPerPageOptions: Array<number | 'All'> = [10, 20, 50, 100, 'All'];
  @Prop() itemsPerPage: boolean = false; // parent renders size-changer
  @Prop() displayTotalNumberOfPages: boolean = false; // parent renders range ("1-10 of 123")

  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() paginationLayout: '' | 'start' | 'center' | 'end' | 'fill' | 'fill-left' | 'fill-right' = '';
  @Prop() paginationVariantColor: string = '';
  @Prop() plumage: boolean = false;
  @Prop() tableId: string = '';
  @Prop() position: 'top' | 'bottom' | 'both' = 'bottom';

  // ✅ New: Single variant selector (preferred)
  @Prop() variant: 'standard' | 'minimize' | 'by-page' = 'standard';

  // Legacy booleans (kept for backwards compatibility)
  /** @deprecated use variant="minimize" */
  @Prop() useMinimizePagination: boolean = false;
  /** @deprecated use variant="by-page" */
  @Prop() useByPagePagination: boolean = false;

  // ----------------------------
  // Accessibility / labeling
  // ----------------------------

  /** Accessible label for the pagination navigation region */
  @Prop() paginationAriaLabel: string = 'Pagination';

  /** Accessible label for the page-size selector group (visible label text) */
  @Prop() pageSizeLabel: string = 'Items per page:';

  /** Optional SR-only help text appended to the page-size selector */
  @Prop() pageSizeHelpText: string = 'Use this control to change how many items are shown per page.';

  @State() private isSelectFocused = false;

  @Event({ eventName: 'page-changed' }) pageChanged!: EventEmitter<{ page: number; pageSize: number }>;
  @Event({ eventName: 'page-size-changed' }) pageSizeChanged!: EventEmitter<{ pageSize: number }>;

  // ---- Stable per-instance ids (avoid duplicate-id violations) ----
  private uid = `pgc-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;

  private getSelectId(): string {
    // Keep existing behavior (tableId + position), but ensure uniqueness if omitted.
    if (this.tableId) return `pageSize-${this.tableId}-${this.position}`;
    return `pageSize-${this.uid}`;
  }

  private getSelectHelpId(): string {
    return `${this.getSelectId()}__help`;
  }

  private getRangeId(): string {
    return `pageRange-${this.tableId || this.uid}-${this.position}`;
  }

  // ---- Derived (data-driven) ----
  private get maxPages(): number {
    const rows = Math.max(0, this.totalRows);
    const size = Math.max(1, this.pageSize || 1);
    return Math.max(1, Math.ceil(rows / size));
  }

  // ✅ Determine which variant to render
  private get effectiveVariant(): 'standard' | 'minimize' | 'by-page' {
    if (this.variant && this.variant !== 'standard') return this.variant;

    // legacy fallback if variant left default
    const legacyCount = Number(!!this.useMinimizePagination) + Number(!!this.useByPagePagination);
    if (legacyCount > 1) {
      // eslint-disable-next-line no-console
      console.warn('[pagination] Both legacy variants set; using minimize by precedence.');
      return 'minimize';
    }
    if (this.useMinimizePagination) return 'minimize';
    if (this.useByPagePagination) return 'by-page';
    return 'standard';
  }

  @Watch('totalRows')
  @Watch('pageSize')
  protected clampAndSync() {
    const max = this.maxPages;
    if (this.currentPage > max) this.currentPage = max;
    if (this.currentPage < 1) this.currentPage = 1;
  }

  @Watch('variant')
  @Watch('useMinimizePagination')
  @Watch('useByPagePagination')
  validateVariant() {
    // Soft warnings to help catch mixed usage
    if (this.variant !== 'standard' && (this.useMinimizePagination || this.useByPagePagination)) {
      // eslint-disable-next-line no-console
      console.warn('[pagination] Both `variant` and legacy variant booleans are set; `variant` wins.');
    }
    const legacyCount = Number(!!this.useMinimizePagination) + Number(!!this.useByPagePagination);
    if (legacyCount > 1) {
      // eslint-disable-next-line no-console
      console.warn('[pagination] Both legacy variants set; minimize wins.');
    }
  }

  connectedCallback() {
    if (this.itemsPerPage) {
      const numericOptions = this.itemsPerPageOptions
        .filter((s): s is number => s !== 'All')
        .sort((a, b) => a - b);
      if (numericOptions.length > 0) this.pageSize = numericOptions[0];
    }
    this.clampAndSync();
    document.addEventListener('click', this.onDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  /** Bubble from child variants */
  @Listen('change-page')
  onChangePage(e: CustomEvent<{ page: number }>) {
    if (e?.detail?.page != null) this._changePage(e);
  }

  private onDocumentClick = () => {
    if (!this.isSelectFocused) {
      const bFocusDiv = this.el?.querySelector('.b-focus') as HTMLElement | null;
      if (bFocusDiv) {
        bFocusDiv.style.width = '0';
        bFocusDiv.style.left = '50%';
      }
    }
  };

  private handleFocus = () => {
    this.isSelectFocused = true;
    const bFocusDiv = this.el?.querySelector('.b-focus') as HTMLElement | null;
    if (bFocusDiv) {
      bFocusDiv.style.width = '100%';
      bFocusDiv.style.left = '0';
    }
  };

  private handleBlur = () => {
    this.isSelectFocused = false;
    setTimeout(() => {
      if (!this.isSelectFocused) {
        const bFocusDiv = this.el?.querySelector('.b-focus') as HTMLElement | null;
        if (bFocusDiv) {
          bFocusDiv.style.width = '0';
          bFocusDiv.style.left = '50%';
        }
      }
    }, 100);
  };

  // Consistent range logic
  private get displayRange(): string {
    const rows = Math.max(0, this.totalRows);
    const size = Math.max(1, this.pageSize || 1);
    if (rows === 0) return '0-0 of 0';

    let start = (this.currentPage - 1) * size + 1;
    let end = this.currentPage * size;
    if (start > rows) start = rows;
    if (start < 1) start = 1;
    if (end < start) end = start;
    if (end > rows) end = rows;

    return `${start}-${end} of ${rows}`;
  }

  private _changePage = (e: CustomEvent<{ page: number }>) => {
    const { page } = e.detail;
    this.currentPage = Math.min(Math.max(1, page), this.maxPages);
    this.pageChanged.emit({ page: this.currentPage, pageSize: this.pageSize });
  };

  private _handlePageSizeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const raw = target?.value;
    const newSize = raw === 'All' ? this.totalRows : parseInt(raw || '10', 10);
    this.pageSize = Number.isFinite(newSize) && newSize > 0 ? newSize : 10;

    this.currentPage = 1;
    this.clampAndSync();
    this.pageSizeChanged.emit({ pageSize: this.pageSize });
    this._changePage(new CustomEvent('change-page', { detail: { page: 1 } }) as any);
  };

  /**
   * A11y note:
   * - Native <select> already exposes correct semantics. Do NOT add role="listbox".
   * - Do NOT set aria-multiselectable/aria-invalid for a select unless needed.
   * - Use a real <label for="..."> association.
   */
  private renderSizeChanger() {
    const sizeCls = this.size === 'sm' ? 'select-sm' : this.size === 'lg' ? 'select-lg' : '';
    const wrapperCls =
      'size-changer' + (this.size === 'sm' ? ' size-changer-sm' : this.size === 'lg' ? ' size-changer-lg' : '');
    const selectId = this.getSelectId();
    const helpId = this.getSelectHelpId();

    return (
      <div class={wrapperCls}>
        <label htmlFor={selectId}>{this.pageSizeLabel || 'Items per page:'} </label>

        {/* SR-only help to ensure aria-describedby always resolves and stays stable */}
        <div id={helpId} class="sr-only">
          {this.pageSizeHelpText}
        </div>

        <select
          id={selectId}
          onChange={this._handlePageSizeChange}
          class={`form-select form-control ${sizeCls}`}
          aria-describedby={helpId}
        >
          {this.itemsPerPageOptions.map(opt => {
            const isNum = typeof opt === 'number';
            const isAll = opt === 'All';
            const disable = (isNum && this.totalRows > 0 && opt > this.totalRows) || (isAll && this.totalRows === 0);
            return (
              <option value={String(opt)} selected={this.pageSize === (opt as any)} disabled={disable}>
                {String(opt)}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  private renderPlumageStyleSizeChanger() {
    const sizeCls = this.size === 'sm' ? 'select-sm' : this.size === 'lg' ? 'select-lg' : '';
    const wrapperCls =
      'size-changer' + (this.size === 'sm' ? ' size-changer-sm' : this.size === 'lg' ? ' size-changer-lg' : '');
    const selectId = this.getSelectId();
    const helpId = this.getSelectHelpId();

    return (
      <div class={wrapperCls}>
        <label htmlFor={selectId}>{this.pageSizeLabel || 'Items per page:'} </label>

        <div id={helpId} class="sr-only">
          {this.pageSizeHelpText}
        </div>

        <div class="input-container" role="presentation">
          <select
            id={selectId}
            class={`form-select form-control ${sizeCls}`}
            aria-describedby={helpId}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this._handlePageSizeChange}
          >
            {this.itemsPerPageOptions.map(opt => {
              const isNum = typeof opt === 'number';
              const isAll = opt === 'All';
              const disable = (isNum && this.totalRows > 0 && opt > this.totalRows) || (isAll && this.totalRows === 0);
              return (
                <option value={String(opt)} selected={this.pageSize === (opt as any)} disabled={disable}>
                  {String(opt)}
                </option>
              );
            })}
          </select>

          <div class="b-underline" role="presentation">
            <div class="b-focus" role="presentation" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  private renderPaginatorBody() {
    const Tag =
      this.effectiveVariant === 'minimize'
        ? ('minimize-pagination-component' as any)
        : this.effectiveVariant === 'by-page'
        ? ('by-page-pagination-component' as any)
        : ('standard-pagination-component' as any);

    // NOTE: We *do not* pass itemsPerPage / displayTotalNumberOfPages to children.
    // Parent renders those. Children keep them for standalone usage only.
    const props = {
      currentPage: this.currentPage,
      totalRows: this.totalRows,
      pageSize: this.pageSize,
      goToButtons: this.goToButtons,
      size: this.size,
      paginationLayout: this.paginationLayout,
      paginationVariantColor: this.paginationVariantColor,
      plumage: this.plumage,
      hideGoToButtons: this.hideGoToButtons,
      hideEllipsis: this.hideEllipsis,
      limit: this.limit,
    };

    // Wrap the actual paginator controls in a <nav> landmark for SR users.
    // Children should still implement their own button semantics and keyboard nav.
    return (
      <nav aria-label={this.paginationAriaLabel || 'Pagination'}>
        <Tag {...(props as any)} />
      </nav>
    );
  }

  render() {
    const rootCls =
      'pagination-layout' + (this.plumage ? ' plumage' : '') + (this.paginationLayout === 'fill' ? '' : ' d-flex');
    const splitRootCls = 'pagination-split-layout' + (this.plumage ? ' plumage' : '');

    // Announce range updates politely when page/pageSize changes (helps SR users).
    const rowDisplay = (extra = '') => (
      <div
        id={this.getRangeId()}
        class={'pagination-cell row-display' + (this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : '') + extra}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {this.displayRange}
      </div>
    );

    if (this.itemsPerPage && this.paginationLayout === 'start') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.renderPaginatorBody()}</div>
          {this.displayTotalNumberOfPages ? rowDisplay('') : null}
          <div class="pagination-cell end">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
        </div>
      );
    } else if (this.itemsPerPage && this.paginationLayout === 'center') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell center">{this.renderPaginatorBody()}</div>
          {this.displayTotalNumberOfPages ? rowDisplay('') : null}
          <div class="pagination-cell center">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
        </div>
      );
    } else if (this.itemsPerPage && this.paginationLayout === 'end') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
          {this.displayTotalNumberOfPages ? rowDisplay('') : null}
          <div class="pagination-cell end">{this.renderPaginatorBody()}</div>
        </div>
      );
    } else if (this.itemsPerPage && this.paginationLayout === 'fill-left') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell fill">{this.renderPaginatorBody()}</div>
          {this.displayTotalNumberOfPages ? rowDisplay('') : null}
          <div class="pagination-cell end">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
        </div>
      );
    } else if (this.itemsPerPage && this.paginationLayout === 'fill-right') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
          {this.displayTotalNumberOfPages ? rowDisplay('') : null}
          <div class="pagination-cell fill end">{this.renderPaginatorBody()}</div>
        </div>
      );
    }

    if (this.displayTotalNumberOfPages && this.paginationLayout === 'start' && !this.itemsPerPage) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell start">{this.renderPaginatorBody()}</div>
          {rowDisplay(' end')}
        </div>
      );
    } else if (this.displayTotalNumberOfPages && this.paginationLayout === 'center' && !this.itemsPerPage) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell center">{this.renderPaginatorBody()}</div>
          {rowDisplay(' justify-content-center flex-fill50')}
        </div>
      );
    } else if (this.displayTotalNumberOfPages && this.paginationLayout === 'end' && !this.itemsPerPage) {
      return (
        <div class={rootCls}>
          {rowDisplay(' start')}
          <div class="pagination-cell end">{this.renderPaginatorBody()}</div>
        </div>
      );
    } else if (this.displayTotalNumberOfPages && this.paginationLayout === 'fill-left' && !this.itemsPerPage) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell fill">{this.renderPaginatorBody()}</div>
          {rowDisplay(' end')}
        </div>
      );
    } else if (this.displayTotalNumberOfPages && this.paginationLayout === 'fill-right' && !this.itemsPerPage) {
      return (
        <div class={rootCls}>
          {rowDisplay(' start')}
          <div class="pagination-cell fill">{this.renderPaginatorBody()}</div>
        </div>
      );
    }

    const cellPosCls =
      this.paginationLayout === 'start'
        ? 'pagination-cell start'
        : this.paginationLayout === 'center'
        ? 'pagination-cell center'
        : this.paginationLayout === 'end'
        ? 'pagination-cell end'
        : '';

    return (
      <div class={rootCls}>
        <div class={cellPosCls}>{this.renderPaginatorBody()}</div>
        {this.displayTotalNumberOfPages ? (
          <div
            id={this.getRangeId()}
            class={
              'pagination-cell row-display' +
              (this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : '') +
              (this.paginationLayout === 'fill'
                ? ' fill'
                : this.paginationLayout === 'center'
                ? ' justify-content-center flex-fill50'
                : this.paginationLayout === 'end' || this.paginationLayout
                ? ' justify-content-end'
                : '')
            }
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {this.displayRange}
          </div>
        ) : null}
      </div>
    );
  }
}
