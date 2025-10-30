// src/components/pagination/minimize-pagination-component.tsx
import { Component, Prop, Event, EventEmitter, h, Element } from '@stencil/core';

@Component({
  tag: 'minimize-pagination-component',
  styleUrls: ['./pagination-styles.scss'],
  shadow: false,
})
export class MinimizePagination {
  @Element() el!: HTMLElement;

  @Prop() currentPage: number = 1;
  @Prop() totalPages: number = 1;
  @Prop() goToButtons: string = '';
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() paginationLayout: '' | 'center' | 'end' = '';
  @Prop() plumage: boolean = false;
  // DO NOT use `id` here; use a different prop/attribute
  @Prop({ attribute: 'control-id' }) controlId?: string;

  @Event({ eventName: 'change-page' }) changePage!: EventEmitter<{ page: number }>;

  private firstPage = () => this.changePage.emit({ page: 1 });
  private prevPage = () => { if (this.currentPage > 1) this.changePage.emit({ page: this.currentPage - 1 }); };
  private nextPage = () => { if (this.currentPage < this.totalPages) this.changePage.emit({ page: this.currentPage + 1 }); };
  private lastPage = () => this.changePage.emit({ page: this.totalPages });

  render() {
    const sizeCls = this.size === 'sm' ? ' pagination-sm' : this.size === 'lg' ? ' pagination-lg' : '';
    const layoutCls = this.paginationLayout === 'center' ? ' justify-content-center'
                     : this.paginationLayout === 'end' ? ' justify-content-end' : '';
    const plumageCls = this.plumage ? ' plumage' : '';
    const controls = this.controlId ?? this.el.id; // fallback to host id

    return (
      <ul role="menubar" aria-disabled="false" aria-label="Pagination"
          class={`pagination b-pagination${sizeCls}${layoutCls}${plumageCls}`}>
        <li role="presentation" aria-hidden={this.currentPage === 1 as any}
            class={`page-item${this.currentPage === 1 ? ' disabled' : ''}`}>
          <button role="menuitem" type="button" tabIndex={0}
                  aria-label="Go to first page" aria-controls={controls}
                  class="page-link" onClick={this.firstPage}
                  disabled={this.currentPage === 1}>
            {this.goToButtons === 'text' ? 'First' : '«'}
          </button>
        </li>

        <li role="presentation" aria-hidden={this.currentPage === 1 as any}
            class={`page-item${this.currentPage === 1 ? ' disabled' : ''}`}>
          <button role="menuitem" type="button" tabIndex={0}
                  aria-label="Go to previous page" aria-controls={controls}
                  class="page-link" onClick={this.prevPage}
                  disabled={this.currentPage === 1}>
            {this.goToButtons === 'text' ? 'Prev' : '‹'}
          </button>
        </li>

        <li role="presentation" aria-hidden={this.currentPage === this.totalPages as any}
            class={`page-item${this.currentPage === this.totalPages ? ' disabled' : ''}`}>
          <button role="menuitem" type="button" tabIndex={0}
                  aria-label="Go to next page" aria-controls={controls}
                  class="page-link" onClick={this.nextPage}
                  disabled={this.currentPage === this.totalPages}>
            {this.goToButtons === 'text' ? 'Next' : '›'}
          </button>
        </li>

        <li role="presentation" aria-hidden={this.currentPage === this.totalPages as any}
            class={`page-item${this.currentPage === this.totalPages ? ' disabled' : ''}`}>
          <button role="menuitem" type="button" tabIndex={0}
                  aria-label="Go to last page" aria-controls={controls}
                  class="page-link" onClick={this.lastPage}
                  disabled={this.currentPage === this.totalPages}>
            {this.goToButtons === 'text' ? 'Last' : '»'}
          </button>
        </li>
      </ul>
    );
  }
}
