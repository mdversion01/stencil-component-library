// src/components/pagination/by-page-pagination-component.tsx
 import { Component, Prop, Event, EventEmitter, h, Element, Fragment } from '@stencil/core';

@Component({
  tag: 'by-page-pagination-component',
  styleUrls: ['./pagination-styles.scss', '../input-field/input-field-styles.scss', '../plumage-input-field/plumage-input-field-styles.scss', '../form-styles.scss'],
  shadow: false,
})
export class ByPagePagination {
  @Element() el!: HTMLElement;

  @Prop() currentPage: number = 1;
  @Prop() totalPages: number = 1;
  @Prop() goToButtons: string = '';
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() paginationLayout: '' | 'center' | 'end' = '';
  @Prop() plumage: boolean = false;
  @Prop({ attribute: 'control-id' }) controlId?: string;

  @Event({ eventName: 'change-page' }) changePage!: EventEmitter<{ page: number }>;

  private isInputFocused = false;

  connectedCallback() {
    document.addEventListener('click', this.onDocumentClick);
  }
  disconnectedCallback() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  private onDocumentClick = () => {
    if (!this.isInputFocused) {
      const bFocusDiv = this.el?.querySelector('.b-focus') as HTMLElement | null;
      if (bFocusDiv) {
        bFocusDiv.style.width = '0';
        bFocusDiv.style.left = '50%';
      }
    }
  };

  private firstPage = () => this.changePage.emit({ page: 1 });
  private prevPage = () => {
    if (this.currentPage > 1) this.changePage.emit({ page: this.currentPage - 1 });
  };
  private nextPage = () => {
    if (this.currentPage < this.totalPages) this.changePage.emit({ page: this.currentPage + 1 });
  };
  private lastPage = () => this.changePage.emit({ page: this.totalPages });

  private onInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newPage = parseInt(target?.value || '', 10);
    if (!Number.isNaN(newPage) && newPage >= 1 && newPage <= this.totalPages) this.changePage.emit({ page: newPage });
  };

  private onFocus = () => {
    this.isInputFocused = true;
    const bFocusDiv = this.el?.querySelector('.b-focus') as HTMLElement | null;
    if (bFocusDiv) {
      bFocusDiv.style.width = '100%';
      bFocusDiv.style.left = '0';
    }
  };

  private onBlur = () => {
    this.isInputFocused = false;
    setTimeout(() => {
      if (!this.isInputFocused) {
        const bFocusDiv = this.el?.querySelector('.b-focus') as HTMLElement | null;
        if (bFocusDiv) {
          bFocusDiv.style.width = '0';
          bFocusDiv.style.left = '50%';
        }
      }
    }, 100);
  };

  render() {
    const sizeCls = this.size === 'sm' ? ' pagination-sm' : this.size === 'lg' ? ' pagination-lg' : '';
    const layoutCls = this.paginationLayout === 'center' ? ' justify-content-center' : this.paginationLayout === 'end' ? ' justify-content-end' : '';
    const plumageCls = this.plumage ? ' plumage' : '';
    const basicInputSize = this.size === 'sm' ? ' basic-input-sm' : this.size === 'lg' ? ' basic-input-lg' : '';
    const plInputSize = this.size === 'sm' ? ' pl-input-sm' : this.size === 'lg' ? ' pl-input-lg' : '';
    const controls = this.controlId ?? this.el.id;

    return (
      <ul role="menubar" aria-disabled="false" aria-label="Pagination" class={`pagination by-page b-pagination${sizeCls}${layoutCls}${plumageCls}`}>
        <li role="presentation" aria-hidden={this.currentPage === 1} class={`page-item${this.currentPage === 1 ? ' disabled' : ''}`}>
          <button
            role="menuitem"
            type="button"
            tabIndex={this.currentPage === 1 ? -1 : 0}
            aria-label="Go to first page"
            aria-controls={controls}
            class="page-link"
            onClick={this.firstPage}
            disabled={this.currentPage === 1}
          >
            {this.goToButtons === 'text' ? 'First' : '«'}
          </button>
        </li>

        <li role="presentation" aria-hidden={this.currentPage === 1} class={`page-item${this.currentPage === 1 ? ' disabled' : ''}`}>
          <button
            role="menuitem"
            type="button"
            tabIndex={this.currentPage === 1 ? -1 : 0}
            aria-label="Go to previous page"
            aria-controls={controls}
            class="page-link"
            onClick={this.prevPage}
            disabled={this.currentPage === 1}
          >
            {this.goToButtons === 'text' ? 'Prev' : '‹'}
          </button>
        </li>

        <li role="presentation" aria-hidden="true" class="page-item">
          <div class="pages">
            Page{' '}
            {this.plumage ? (
              <div class="pl-input-container page-input-wrapper" role="presentation" aria-labelledby="pageNumberField">
                <label class="sr-only" htmlFor="pageNumberField">
                  Page number
                </label>
                <input
                  type="text"
                  class={`pl-form-control page-input${plInputSize}`}
                  aria-label="Page number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="paginationInput"
                  aria-labelledby="paginationInputLabel paginationDescription"
                  value={String(this.currentPage)}
                  onChange={this.onInputChange}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                />
                <div class="b-underline" role="presentation">
                  <div class="b-focus" role="presentation" aria-hidden="true" />
                </div>
              </div>
             ) : (
              <Fragment>
                <label class="sr-only" htmlFor="pageNumberField">
                  Page number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id="paginationInput"
                  aria-label="Page number"
                  aria-labelledby="paginationInputLabel paginationDescription"
                  class={`form-control page-input${basicInputSize}`}
                  value={String(this.currentPage)}
                  onChange={this.onInputChange}
                />
              </Fragment>
            )}{' '}
            of {this.totalPages}
          </div>
        </li>

        <li role="presentation" aria-hidden={this.currentPage === this.totalPages} class={`page-item${this.currentPage === this.totalPages ? ' disabled' : ''}`}>
          <button
            role="menuitem"
            type="button"
            tabIndex={this.currentPage === this.totalPages ? -1 : 0}
            aria-label="Go to next page"
            aria-controls={controls}
            class="page-link"
            onClick={this.nextPage}
            disabled={this.currentPage === this.totalPages}
          >
            {this.goToButtons === 'text' ? 'Next' : '›'}
          </button>
        </li>

        <li role="presentation" aria-hidden={this.currentPage === this.totalPages} class={`page-item${this.currentPage === this.totalPages ? ' disabled' : ''}`}>
          <button
            role="menuitem"
            type="button"
            tabIndex={this.currentPage === this.totalPages ? -1 : 0}
            aria-label="Go to last page"
            aria-controls={controls}
            class="page-link"
            onClick={this.lastPage}
            disabled={this.currentPage === this.totalPages}
          >
            {this.goToButtons === 'text' ? 'Last' : '»'}
          </button>
        </li>
      </ul>
    );
  }
}
