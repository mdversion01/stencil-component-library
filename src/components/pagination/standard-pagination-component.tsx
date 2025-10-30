// src/components/pagination/standard-pagination-component.tsx
import { Component, Prop, Event, EventEmitter, h, Fragment } from '@stencil/core';

@Component({
  tag: 'standard-pagination-component',
  styleUrls: ['./pagination-styles.scss'],
  shadow: false,
})
export class StandardPagination {
  @Prop() currentPage: number = 1;
  @Prop() totalPages: number = 1;
  @Prop() hideGotoEndButtons: boolean = false;
  @Prop() goToButtons: string = '';
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() paginationLayout: '' | 'center' | 'end' | 'fill' | 'fill-left' | 'fill-right' = '';
  @Prop() hideEllipsis: boolean = false;
  @Prop() limit: number = 3;
  @Prop() paginationVariantColor: string = '';
  @Prop() plumage: boolean = false;

  @Event({ eventName: 'change-page' }) changePage!: EventEmitter<{ page: number }>;

  private emitChange(page: number) {
    this.changePage.emit({ page });
  }

  private nextPage = () => {
    if (this.currentPage < this.totalPages) this.emitChange(this.currentPage + 1);
  };
  private prevPage = () => {
    if (this.currentPage > 1) this.emitChange(this.currentPage - 1);
  };
  private firstPage = () => this.emitChange(1);
  private lastPage = () => this.emitChange(this.totalPages);

  private renderEllipsis() {
    if (this.hideEllipsis) return null;
    const liFlex =
      this.paginationLayout === 'fill' ||
      this.paginationLayout === 'fill-left' ||
      this.paginationLayout === 'fill-right'
        ? ' flex-fill d-flex'
        : '';
    const aFlex =
      this.paginationLayout === 'fill' ||
      this.paginationLayout === 'fill-left' ||
      this.paginationLayout === 'fill-right'
        ? ' flex-fill d-flex'
        : '';
    return (
      <li role="separator" class={`page-item disabled bv-d-xs-down-none${liFlex}`}>
        <span class={`page-link${aFlex}`}>...</span>
      </li>
    );
  }

  private renderPageButton(page: number) {
    const liFlex =
      this.paginationLayout === 'fill' ||
      this.paginationLayout === 'fill-left' ||
      this.paginationLayout === 'fill-right'
        ? ' flex-fill d-flex'
        : '';
    const aFlex =
      this.paginationLayout === 'fill' ||
      this.paginationLayout === 'fill-left' ||
      this.paginationLayout === 'fill-right'
        ? ' flex-grow-1'
        : '';
    const active = this.currentPage === page;
    return (
      <li
        role="presentation"
        class={`page-item${active ? ' active' : ''}${liFlex}`}
      >
        <button
          role="menuitemradio"
          type="button"
          aria-controls="pagination"
          aria-label={`Go to page ${page}`}
          aria-checked={active ? ('true' as any) : ('false' as any)}
          tabIndex={active ? -1 : 0}
          class={`page-link${aFlex}`}
          onClick={() => this.emitChange(page)}
          disabled={active}
        >
          {page}
        </button>
      </li>
    );
  }

  private generatePageButtons() {
    const buttons: any[] = [];
    const halfLimit = Math.floor((this.limit - 1) / 2);

    let startPage = Math.max(1, this.currentPage - halfLimit);
    let endPage = Math.min(this.totalPages, startPage + this.limit - 1);

    if (endPage - startPage < this.limit - 1) {
      startPage = Math.max(1, endPage - this.limit + 1);
    }

    if (startPage > 1) {
      buttons.push(this.renderPageButton(1));
      if (startPage > 2) buttons.push(this.renderEllipsis());
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(this.renderPageButton(i));
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) buttons.push(this.renderEllipsis());
      buttons.push(this.renderPageButton(this.totalPages));
    }

    return buttons;
  }

  render() {
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

    const liFlex =
      this.paginationLayout === 'fill' ||
      this.paginationLayout === 'fill-left' ||
      this.paginationLayout === 'fill-right'
        ? ' flex-fill d-flex'
        : '';
    const aFlex =
      this.paginationLayout === 'fill' ||
      this.paginationLayout === 'fill-left' ||
      this.paginationLayout === 'fill-right'
        ? ' flex-grow-1'
        : '';

    return (
      <ul
        role="menubar"
        aria-disabled="false"
        aria-label="Pagination"
        class={`pagination b-pagination${sizeCls}${layoutCls}${colorCls}${plumageCls}`}
      >
        {!this.hideGotoEndButtons ? (
           <Fragment>
            <li
              role="presentation"
              aria-hidden={this.currentPage === 1 ? ('true' as any) : ('false' as any)}
              class={`page-item${this.currentPage === 1 ? ' disabled' : ''}${liFlex}`}
            >
              <button
                role="menuitem"
                type="button"
                tabIndex={this.currentPage === 1 ? -1 : 0}
                aria-label="Go to first page"
                aria-controls="pagination"
                class={`page-link${aFlex}`}
                onClick={this.firstPage}
                disabled={this.currentPage === 1}
              >
                {this.goToButtons === 'text' ? 'First' : '«'}
              </button>
            </li>
            <li
              role="presentation"
              aria-hidden={this.currentPage === 1 ? ('true' as any) : ('false' as any)}
              class={`page-item${this.currentPage === 1 ? ' disabled' : ''}${liFlex}`}
            >
              <button
                role="menuitem"
                type="button"
                tabIndex={this.currentPage === 1 ? -1 : 0}
                aria-label="Go to previous page"
                aria-controls="pagination"
                class={`page-link${aFlex}`}
                onClick={this.prevPage}
                disabled={this.currentPage === 1}
              >
                {this.goToButtons === 'text' ? 'Prev' : '‹'}
              </button>
            </li>
          </Fragment>
        ) : null}

        {this.generatePageButtons()}

        {!this.hideGotoEndButtons ? (
          <Fragment>
            <li
              role="presentation"
              aria-hidden={this.currentPage === this.totalPages ? ('true' as any) : ('false' as any)}
              class={`page-item${this.currentPage === this.totalPages ? ' disabled' : ''}${liFlex}`}
            >
              <button
                role="menuitem"
                type="button"
                tabIndex={this.currentPage === this.totalPages ? -1 : 0}
                aria-label="Go to next page"
                aria-controls="pagination"
                class={`page-link${aFlex}`}
                onClick={this.nextPage}
                disabled={this.currentPage === this.totalPages}
              >
                {this.goToButtons === 'text' ? 'Next' : '›'}
              </button>
            </li>
            <li
              role="presentation"
              aria-hidden={this.currentPage === this.totalPages ? ('true' as any) : ('false' as any)}
              class={`page-item${this.currentPage === this.totalPages ? ' disabled' : ''}${liFlex}`}
            >
              <button
                role="menuitem"
                type="button"
                tabIndex={this.currentPage === this.totalPages ? -1 : 0}
                aria-label="Go to last page"
                aria-controls="pagination"
                class={`page-link${aFlex}`}
                onClick={this.lastPage}
                disabled={this.currentPage === this.totalPages}
              >
                {this.goToButtons === 'text' ? 'Last' : '»'}
              </button>
            </li>
          </Fragment>
        ) : null}
      </ul>
    );
  }
}
