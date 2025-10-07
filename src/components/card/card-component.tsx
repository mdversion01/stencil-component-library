import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'card-component',
  styleUrl: 'card.scss',
  shadow: false,
})
export class CardComponent {
  @Prop() actions = false;
  @Prop() altText = '';
  @Prop() ariaLabel: string = 'Card section';
  @Prop() cardMaxWidth = '20';
  @Prop() classNames = '';
  @Prop() elevation = '';
  @Prop() img = false;
  @Prop() imgSrc = '';
  @Prop() inlineStyles = '';
  @Prop() noFooter = false;
  @Prop() noHeader = false;
  @Prop() imgHeight = '11.25rem';
  @Prop() tab?: string;

  @Event() customClick: EventEmitter;

  private parseStyleString(styleStr: string): { [key: string]: string } {
    return styleStr.split(';').map(s => s.trim()).filter(s => s).reduce((acc, item) => {
      const [key, value] = item.split(':').map(x => x.trim());
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as { [key: string]: string });
  }

  // private handleKeyDown(event: KeyboardEvent) {
  //   if ((event.key === 'Enter' || event.key === ' ') && this.tabIndexs !== undefined) {
  //     event.preventDefault();
  //     this.customClick.emit();
  //   }
  // }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.customClick.emit();
    }
  }

  render() {
    const baseClasses = ['card', this.classNames];
    if (this.elevation) baseClasses.push(`elevated-${this.elevation}`);

    const classAttribute = baseClasses.filter(Boolean).join(' ');

    const combinedStyle = `${this.inlineStyles}; max-width: ${this.cardMaxWidth}rem;`;
    const divStyle = this.parseStyleString(combinedStyle);

    const imgStyles = {
      height: this.imgHeight,
      width: '100%',
      display: 'block',
    };

    return (
      <div
        class={classAttribute}
        style={divStyle}
        role="region"
        aria-label={this.ariaLabel}
        {...(this.tab ? { tabindex: this.tab } : {})}
        onKeyDown={(e) => this.handleKeyDown(e)}
      >
        {this.img && (
          <img
            src={this.imgSrc}
            class="card-img-top"
            alt={this.altText || 'Card image'}
            style={imgStyles}
          />
        )}
        {!this.noHeader && (
          <div class="card-header">
            <slot name="header" />
          </div>
        )}
        <div class="card-body">
          <h5 class="card-title">
            <slot name="title" />
          </h5>
          <div class="card-text">
            <slot name="text" />
          </div>
        </div>
        {this.actions && (
          <div class="card-actions">
            <slot name="actions" />
          </div>
        )}
        {!this.noFooter && (
          <div class="card-footer">
            <slot name="footer" />
          </div>
        )}
      </div>
    );
  }
}
