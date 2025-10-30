// src/components/pagination/pagination-component.tsx
import { Component, Prop, State, Event, EventEmitter, h, Element, Watch } from '@stencil/core';

@Component({
  tag: 'pagination-component',
  styleUrls: ['./pagination-styles.scss', '../input-field/input-field-styles.scss', '../plumage-select-field/plumage-select-field-styles.scss', '../form-styles.scss'],
  shadow: false,
})
export class PaginationComponent {
  @Element() el!: HTMLElement;

  @Prop({ mutable: true, reflect: true }) currentPage: number = 1;
  @Prop({ mutable: true, reflect: true }) totalPages: number = 1;
  @Prop() limit: number = 3;
  @Prop() goToButtons: string = '';
  @Prop() hideEllipsis: boolean = false;
  @Prop() hideGotoEndButtons: boolean = false;
  @Prop({ mutable: true, reflect: true }) pageSize: number = 10;
  @Prop() pageSizeOptions: Array<number | 'All'> = [10, 20, 50, 100, 'All'];
  @Prop() showDisplayRange: boolean = false;
  @Prop() showSizeChanger: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() paginationLayout: '' | 'start' | 'center' | 'end' | 'fill' | 'fill-left' | 'fill-right' = '';
  @Prop() paginationVariantColor: string = '';
  @Prop() plumage: boolean = false;
  @Prop() totalRows: number = 0;
  @Prop() useMinimizePagination: boolean = false;
  @Prop() useByPagePagination: boolean = false;

  @State() private isSelectFocused = false;

  @Event({ eventName: 'page-changed' }) pageChanged!: EventEmitter<{ page: number; pageSize: number }>;
  @Event({ eventName: 'page-size-changed' }) pageSizeChanged!: EventEmitter<{ pageSize: number }>;

  @Watch('totalRows')
  @Watch('pageSize')
  protected recalcTotalPages() {
    const denom = this.pageSize > 0 ? this.pageSize : 1;
    this.totalPages = Math.max(Math.ceil(this.totalRows / denom), 1);
  }

  @Watch('useMinimizePagination')
  @Watch('useByPagePagination')
  validateVariant() {
    const variantCount = Number(!!this.useMinimizePagination) + Number(!!this.useByPagePagination);
    if (variantCount > 1) {
      console.warn('[pagination] Both variants set; using minimize by precedence.');
    }
  }

  connectedCallback() {
    if (this.showSizeChanger) {
      const numericOptions = this.pageSizeOptions.filter((s): s is number => s !== 'All').sort((a, b) => a - b);
      if (numericOptions.length > 0) this.pageSize = numericOptions[0];
    }
    document.addEventListener('click', this.onDocumentClick);
    this.el.addEventListener('change-page', this.onBubbleChangePage as any);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.onDocumentClick);
    this.el.removeEventListener('change-page', this.onBubbleChangePage as any);
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

  private onBubbleChangePage = (e: Event) => {
    const ce = e as CustomEvent<{ page: number }>;
    if (ce?.detail?.page != null) this._changePage(ce);
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

  private get displayRange(): string {
    const startRow = (this.currentPage - 1) * this.pageSize + 1;
    const endRow = Math.min(this.currentPage * this.pageSize, this.totalRows);
    return `${startRow}-${endRow} of ${this.totalRows}`;
  }

  private _changePage = (e: CustomEvent<{ page: number }>) => {
    const { page } = e.detail;
    this.currentPage = page;
    this.pageChanged.emit({ page, pageSize: this.pageSize });
  };

  private _handlePageSizeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const raw = target?.value;
    const newSize = raw === 'All' ? this.totalRows : parseInt(raw || '10', 10);
    this.pageSize = Number.isFinite(newSize) && newSize > 0 ? newSize : 10;

    this.currentPage = 1;
    this.recalcTotalPages();
    this.pageSizeChanged.emit({ pageSize: this.pageSize });
    this._changePage(new CustomEvent('change-page', { detail: { page: 1 } }) as any);
  };

  private renderSizeChanger() {
    const sizeCls = this.size === 'sm' ? 'select-sm' : this.size === 'lg' ? 'select-lg' : '';
    const wrapperCls = 'size-changer' + (this.size === 'sm' ? ' size-changer-sm' : this.size === 'lg' ? ' size-changer-lg' : '');
    return (
      <div class={wrapperCls}>
        <label htmlFor="pageSize">Items per page: </label>
        <select
          id="pageSize"
          onChange={this._handlePageSizeChange}
          class={`form-select form-control ${sizeCls}`}
          aria-label="selectField"
          aria-labelledby="selectField"
          aria-invalid="false"
          aria-multiselectable="false"
          role="listbox"
        >
          {this.pageSizeOptions.map(opt => (
            <option value={String(opt)} selected={this.pageSize === (opt as any)}>
              {String(opt)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  private renderPlumageStyleSizeChanger() {
    const sizeCls = this.size === 'sm' ? 'select-sm' : this.size === 'lg' ? 'select-lg' : '';
    const wrapperCls = 'size-changer' + (this.size === 'sm' ? ' size-changer-sm' : this.size === 'lg' ? ' size-changer-lg' : '');
    return (
      <div class={wrapperCls}>
        <label htmlFor="pageSize">Items per page: </label>
        <div class="pl-input-container" role="presentation" aria-labelledby="selectField">
          <select
            id="pageSize"
            class={`form-select form-control ${sizeCls}`}
            aria-label="selectField"
            aria-labelledby="selectField"
            aria-invalid="false"
            aria-multiselectable="false"
            role="listbox"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this._handlePageSizeChange}
          >
            {this.pageSizeOptions.map(opt => (
              <option value={String(opt)} selected={this.pageSize === (opt as any)}>
                {String(opt)}
              </option>
            ))}
          </select>
          <div class="b-underline" role="presentation">
            <div class="b-focus" role="presentation" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  private renderPaginatorBody() {
    const Tag = this.useMinimizePagination
      ? ('minimize-pagination-component' as any)
      : this.useByPagePagination
      ? ('by-page-pagination-component' as any)
      : ('standard-pagination-component' as any);

    const props = {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      goToButtons: this.goToButtons,
      size: this.size,
      paginationLayout: this.paginationLayout,
      paginationVariantColor: this.paginationVariantColor,
      plumage: this.plumage,
      hideGotoEndButtons: this.hideGotoEndButtons,
      hideEllipsis: this.hideEllipsis,
      limit: this.limit,
    };

    return <Tag {...(props as any)} />;
  }

  render() {
    const rootCls = 'pagination-layout' + (this.plumage ? ' plumage' : '') + (this.paginationLayout === 'fill' ? '' : ' d-flex');
    const splitRootCls = 'pagination-split-layout' + (this.plumage ? ' plumage' : '');

    const rowDisplay = (extra = '') => (
      <div class={'pagination-cell row-display' + (this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : '') + extra}>{this.displayRange}</div>
    );

    if (this.showSizeChanger && this.paginationLayout === 'start') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.renderPaginatorBody()}</div>
          {this.showDisplayRange ? rowDisplay('') : null}
          <div class="pagination-cell end">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
        </div>
      );
    } else if (this.showSizeChanger && this.paginationLayout === 'center') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell center">{this.renderPaginatorBody()}</div>
          {this.showDisplayRange ? rowDisplay('') : null}
          <div class="pagination-cell center">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
        </div>
      );
    } else if (this.showSizeChanger && this.paginationLayout === 'end') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
          {this.showDisplayRange ? rowDisplay('') : null}
          <div class="pagination-cell end">{this.renderPaginatorBody()}</div>
        </div>
      );
    } else if (this.showSizeChanger && this.paginationLayout === 'fill-left') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell fill">{this.renderPaginatorBody()}</div>
          {this.showDisplayRange ? rowDisplay('') : null}
          <div class="pagination-cell end">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
        </div>
      );
    } else if (this.showSizeChanger && this.paginationLayout === 'fill-right') {
      return (
        <div class={splitRootCls}>
          <div class="pagination-cell start">{this.plumage ? this.renderPlumageStyleSizeChanger() : this.renderSizeChanger()}</div>
          {this.showDisplayRange ? rowDisplay('') : null}
          <div class="pagination-cell fill end">{this.renderPaginatorBody()}</div>
        </div>
      );
    }

    if (this.showDisplayRange && this.paginationLayout === 'start' && !this.showSizeChanger) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell start">{this.renderPaginatorBody()}</div>
          {rowDisplay(' end')}
        </div>
      );
    } else if (this.showDisplayRange && this.paginationLayout === 'center' && !this.showSizeChanger) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell center">{this.renderPaginatorBody()}</div>
          {rowDisplay(' justify-content-center flex-fill50')}
        </div>
      );
    } else if (this.showDisplayRange && this.paginationLayout === 'end' && !this.showSizeChanger) {
      return (
        <div class={rootCls}>
          {rowDisplay(' start')}
          <div class="pagination-cell end">{this.renderPaginatorBody()}</div>
        </div>
      );
    } else if (this.showDisplayRange && this.paginationLayout === 'fill-left' && !this.showSizeChanger) {
      return (
        <div class={rootCls}>
          <div class="pagination-cell fill">{this.renderPaginatorBody()}</div>
          {rowDisplay(' end')}
        </div>
      );
    } else if (this.showDisplayRange && this.paginationLayout === 'fill-right' && !this.showSizeChanger) {
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
        {this.showDisplayRange ? (
          <div
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
          >
            {this.displayRange}
          </div>
        ) : null}
      </div>
    );
  }
}
