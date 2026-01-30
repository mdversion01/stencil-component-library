import { Component, Prop, State, Watch, Event, EventEmitter, h, Fragment, Element } from '@stencil/core';

@Component({
  tag: 'standard-pagination-component',
  styleUrls: ['./pagination-styles.scss'],
  shadow: false,
})
export class StandardPagination {
  @Element() el!: HTMLElement;

  // Data-driven inputs
  @Prop({ mutable: true, reflect: true }) currentPage: number = 1;
  @Prop({ mutable: true, reflect: true }) pageSize: number = 10;
  @Prop() totalRows: number = 0;

  // Options / layout
  @Prop() itemsPerPageOptions: Array<number | 'All'> = [10, 20, 50, 100, 'All'];
  @Prop() itemsPerPage: boolean = false;                // standalone only
  @Prop() displayTotalNumberOfPages: boolean = false;   // standalone only
  @Prop() hideGoToButtons: boolean = false;
  @Prop() goToButtons: string = 'icon';
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() paginationLayout: '' | 'start' | 'fill' | 'center' | 'end' | 'fill-left' | 'fill-right' = '';
  @Prop() hideEllipsis: boolean = false;
  @Prop() limit: number = 5;
  @Prop() paginationVariantColor: string = '';
  @Prop() plumage: boolean = false;

  @State() private page: number = 1;

  private get isManagedByParent() {
    return !!this.el.closest('pagination-component');
  }

  private get maxPages(): number {
    const rows = Math.max(0, this.totalRows);
    const size = Math.max(1, this.pageSize || 1);
    return Math.max(1, Math.ceil(rows / size));
  }

  @Watch('currentPage')
  onCurrentPageChanged(nv: number) {
    const next = Math.max(1, Math.floor(Number(nv) || 1));
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
    this.onCurrentPageChanged(this.currentPage);
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

  private nextPage = () => {
    if (this.page < this.maxPages) this.setPageAndEmit(this.page + 1);
  };
  private prevPage = () => this.setPageAndEmit(this.page - 1);
  private firstPage = () => this.setPageAndEmit(1);
  private lastPage = () => this.setPageAndEmit(this.maxPages);

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
    const newSize = val === 'All' ? this.totalRows : parseInt(val || '10', 10);
    this.pageSize = Number.isFinite(newSize) && newSize > 0 ? newSize : 10;
    this.setPageAndEmit(1);
    this.clampToBounds();
  };

  private renderEllipsis() {
    if (this.hideEllipsis || this.maxPages <= 1) return null;
    const flexLi = ['fill', 'fill-left', 'fill-right'].includes(this.paginationLayout) ? ' flex-fill d-flex' : '';
    const flexA  = ['fill', 'fill-left', 'fill-right'].includes(this.paginationLayout) ? ' flex-fill d-flex' : '';
    return (
      <li role="separator" class={`page-item disabled bv-d-xs-down-none${flexLi}`}>
        <span class={`page-link${flexA}`}>...</span>
      </li>
    );
  }

  private renderPageButton(page: number) {
    const liFlex = ['fill', 'fill-left', 'fill-right'].includes(this.paginationLayout) ? ' flex-fill d-flex' : '';
    const aFlex  = ['fill', 'fill-left', 'fill-right'].includes(this.paginationLayout) ? ' flex-grow-1' : '';
    const active = this.page === page;
    return (
      <li role="presentation" class={`page-item${active ? ' active' : ''}${liFlex}`}>
        <button
          role="menuitemradio"
          type="button"
          aria-controls="pagination"
          aria-label={`Go to page ${page}`}
          aria-checked={active ? ('true' as any) : ('false' as any)}
          tabIndex={active ? -1 : 0}
          class={`page-link${aFlex}`}
          onClick={() => this.setPageAndEmit(page)}
          disabled={active}
        >
          {page}
        </button>
      </li>
    );
  }

  private generatePageButtons() {
    if (this.maxPages <= 1) return [this.renderPageButton(1)];

    const buttons: any[] = [];
    const limit = Math.max(1, Math.floor(this.limit || 1));
    const half = Math.floor((limit - 1) / 2);

    let start = Math.max(1, this.page - half);
    let end = Math.min(this.maxPages, start + limit - 1);
    if (end - start < limit - 1) start = Math.max(1, end - limit + 1);

    if (start > 1) {
      buttons.push(this.renderPageButton(1));
      if (start > 2) buttons.push(this.renderEllipsis());
    }
    for (let i = start; i <= end; i++) buttons.push(this.renderPageButton(i));
    if (end < this.maxPages) {
      if (end < this.maxPages - 1) buttons.push(this.renderEllipsis());
      buttons.push(this.renderPageButton(this.maxPages));
    }
    return buttons;
  }

  private renderSizeChanger() {
    const sizeCls = this.size === 'sm' ? 'select-sm' : this.size === 'lg' ? 'select-lg' : '';
    const wrap = 'size-changer' + (this.size === 'sm' ? ' size-changer-sm' : this.size === 'lg' ? ' size-changer-lg' : '');
    return (
      <div class={wrap}>
        <label>Items per page: </label>
        <select class={`form-select form-control ${sizeCls}`} aria-label="selectField" onChange={this.onItemsPerPageChange}>
          {this.itemsPerPageOptions.map(opt => {
            const isNum = typeof opt === 'number';
            const disable = isNum && this.totalRows > 0 && opt > this.totalRows;
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

  private rowDisplay = (extra = '') => (
    <div class={'pagination-cell row-display' + (this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : '') + extra}>{this.displayRange}</div>
  );

  private renderBar() {
    const sizeCls =
      this.size === 'sm' ? ' pagination-sm' : this.size === 'lg' ? ' pagination-lg' : '';
    const layoutCls =
      this.paginationLayout === 'center'
        ? ' justify-content-center flex-fill50'
        : this.paginationLayout === 'end'
        ? ' justify-content-end'
        : this.paginationLayout === 'fill'
        ? ' text-center'
        : '';
    const colorCls = this.paginationVariantColor ? ` ${this.paginationVariantColor}` : '';
    const plumageCls = this.plumage ? ' plumage' : '';

    const atStart = this.page <= 1;
    const atEnd   = this.page >= this.maxPages;

    const liFlex = ['fill', 'fill-left', 'fill-right'].includes(this.paginationLayout) ? ' flex-fill d-flex' : '';
    const aFlex  = ['fill', 'fill-left', 'fill-right'].includes(this.paginationLayout) ? ' flex-grow-1' : '';

    return (
      <ul role="menubar" aria-disabled="false" aria-label="Pagination" class={`pagination b-pagination${sizeCls}${layoutCls}${colorCls}${plumageCls}`}>
        {!this.hideGoToButtons ? (
          <Fragment>
            <li role="presentation" aria-hidden={atStart as any} class={`page-item${atStart ? ' disabled' : ''}${liFlex}`}>
              <button role="menuitem" type="button" tabIndex={atStart ? -1 : 0} aria-label="Go to first page" aria-controls="pagination" class={`page-link${aFlex}`} onClick={this.firstPage} disabled={atStart}>
                {this.goToButtons === 'text' ? 'First' : <i class="fa-solid fa-angles-left"></i>}
              </button>
            </li>
            <li role="presentation" aria-hidden={atStart as any} class={`page-item${atStart ? ' disabled' : ''}${liFlex}`}>
              <button role="menuitem" type="button" tabIndex={atStart ? -1 : 0} aria-label="Go to previous page" aria-controls="pagination" class={`page-link${aFlex}`} onClick={this.prevPage} disabled={atStart}>
                {this.goToButtons === 'text' ? 'Prev' : <i class="fa-solid fa-angle-left"></i>}
              </button>
            </li>
          </Fragment>
        ) : null}

        {this.generatePageButtons()}

        {!this.hideGoToButtons ? (
          <Fragment>
            <li role="presentation" class={`page-item${atEnd ? ' disabled' : ''}${liFlex}`}>
              <button role="menuitem" type="button" tabIndex={atEnd ? -1 : 0} aria-label="Go to next page" aria-controls="pagination" class={`page-link${aFlex}`} onClick={this.nextPage} disabled={atEnd}>
                {this.goToButtons === 'text' ? 'Next' : <i class="fa-solid fa-angle-right"></i>}
              </button>
            </li>
            <li role="presentation" class={`page-item${atEnd ? ' disabled' : ''}${liFlex}`}>
              <button role="menuitem" type="button" tabIndex={atEnd ? -1 : 0} aria-label="Go to last page" aria-controls="pagination" class={`page-link${aFlex}`} onClick={this.lastPage} disabled={atEnd}>
                {this.goToButtons === 'text' ? 'Last' : <i class="fa-solid fa-angles-right"></i>}
              </button>
            </li>
          </Fragment>
        ) : null}
      </ul>
    );
  }

  render() {
    const rootCls = 'pagination-layout' + (this.plumage ? ' plumage' : '') + (this.paginationLayout === 'fill' ? '' : ' d-flex');
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
    } else if (showChildSizer && this.paginationLayout === 'fill-left') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell fill">{this.renderBar()}</div>
          {showChildRange ? this.rowDisplay('') : null}
          <div class="pagination-cell end">{this.renderSizeChanger()}</div>
        </div>
      );
    } else if (showChildSizer && this.paginationLayout === 'fill-right') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.renderSizeChanger()}</div>
          {showChildRange ? this.rowDisplay('') : null}
          <div class="pagination-cell fill end">{this.renderBar()}</div>
        </div>
      );
    }

    if (showChildRange && this.paginationLayout === 'start' && !showChildSizer) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell start">{this.renderBar()}</div>
          {this.rowDisplay(' end')}
        </div>
      );
    } else if (showChildRange && this.paginationLayout === 'center' && !showChildSizer) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell center">{this.renderBar()}</div>
          {this.rowDisplay(' justify-content-center flex-fill50')}
        </div>
      );
    } else if (showChildRange && this.paginationLayout === 'end' && !showChildSizer) {
      return (
        <div class={rootCls}>
          {this.rowDisplay(' start')}
          <div class="pagination-cell end">{this.renderBar()}</div>
        </div>
      );
    } else if (showChildRange && this.paginationLayout === 'fill-left' && !showChildSizer) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell fill">{this.renderBar()}</div>
          {this.rowDisplay(' end')}
        </div>
      );
    } else if (showChildRange && this.paginationLayout === 'fill-right' && !showChildSizer) {
      return (
        <div class={rootCls}>
          {this.rowDisplay(' start')}
          <div class="pagination-cell fill">{this.renderBar()}</div>
        </div>
      );
    }

    // default (no child sizer/range)
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
        <div class={cellPosCls}>{this.renderBar()}</div>
      </div>
    );
  }
}
