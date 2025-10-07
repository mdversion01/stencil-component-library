import { Component, Prop, h, State, Element } from '@stencil/core';

@Component({
  tag: 'accordion-container',
  styleUrl: '../accordion/accordion.scss',
  shadow: false,
})
export class AccordionContainer {
  @Element() hostElement: HTMLElement;

  @Prop() data: Array<{ header: string; content: string }> = [];
  @Prop({ attribute: 'parent-id' }) parentId: string = '';
  @Prop({ reflect: true }) flush: boolean = false;
  @Prop() variant: string = '';
  @Prop() size: string = '';
  @Prop() outlined: boolean = false;
  @Prop() block: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() ripple: boolean = false;
  @Prop() classNames: string = '';
  @Prop() contentTxtSize: string = '';
  @Prop({ reflect: true }) icon: string = 'fas fa-angle-down';
  @Prop() singleOpen: boolean = false;

  @State() openIndexes: Set<number> = new Set();
  @State() normalizedData: Array<{ header: string; content: string }> = [];

  componentWillLoad() {
    // Check icon explicitly passed empty
    const iconAttr = this.hostElement?.getAttribute('icon');
    const iconExplicitlyEmpty = iconAttr !== null && iconAttr.trim() === '';

    if (iconExplicitlyEmpty) {
      console.warn('[accordion-container] "icon" prop is empty. Falling back to default icon: "fas fa-angle-down".');
    }

    // ✅ Silently fallback if invalid data
    this.normalizedData = Array.isArray(this.data) ? this.data : [];

    // Still warn if icon array is too long
    const iconList = this.iconArray;
    if (iconList.length > 2) {
      console.warn('[accordion-container] "icon" prop has more than 2 values. Only the first two will be used.', iconList);
    }
  }

  private toggle(index: number) {
    const isOpen = this.openIndexes.has(index);
    const targetEl = document.getElementById(`collapse${index}`) as HTMLElement;
    if (!targetEl) return;

    if (isOpen) {
      this.openIndexes.delete(index);
      this.openIndexes = new Set(this.openIndexes);
      targetEl.style.height = `${targetEl.scrollHeight}px`;
      requestAnimationFrame(() => {
        targetEl.style.height = '0px';
      });
      const onTransitionEnd = () => {
        targetEl.style.display = 'none';
        targetEl.removeEventListener('transitionend', onTransitionEnd);
      };
      targetEl.addEventListener('transitionend', onTransitionEnd);
    } else {
      if (this.singleOpen) {
        this.normalizedData.forEach((_item, i) => {
          if (this.openIndexes.has(i)) {
            const otherEl = document.getElementById(`collapse${i}`) as HTMLElement;
            if (otherEl) {
              this.openIndexes.delete(i);
              otherEl.style.height = `${otherEl.scrollHeight}px`;
              requestAnimationFrame(() => {
                otherEl.style.height = '0px';
              });
              const onTransitionEnd = () => {
                otherEl.style.display = 'none';
                otherEl.removeEventListener('transitionend', onTransitionEnd);
              };
              otherEl.addEventListener('transitionend', onTransitionEnd);
            }
          }
        });
      }
      this.openIndexes.add(index);
      this.openIndexes = new Set(this.openIndexes);
      targetEl.style.display = 'block';
      targetEl.style.height = '0px';
      requestAnimationFrame(() => {
        targetEl.style.height = `${targetEl.scrollHeight}px`;
      });
      const onTransitionEnd = () => {
        targetEl.style.height = 'auto';
        targetEl.removeEventListener('transitionend', onTransitionEnd);
      };
      targetEl.addEventListener('transitionend', onTransitionEnd);
    }
  }

  get iconArray(): string[] {
    const icons =
      this.icon
        ?.split(',')
        .map(i => i.trim())
        .filter(Boolean) ?? [];
    return icons.length > 0 ? icons.slice(0, 2) : ['fas fa-angle-down'];
  }

  private textSizing() {
    switch (this.contentTxtSize) {
      case 'lg':
        return 'text-large';
      case 'default':
        return 'text-default';
      case 'sm':
        return 'text-small';
      case 'xs':
        return 'text-xsmall';
      case 'xl':
        return 'text-xlarge';
      case 'xxl':
        return 'text-xxlarge';
      default:
        return '';
    }
  }

  private handleKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle(index);
    }
  }

  render() {
    return (
      <div class={`accordion ${this.flush ? 'accordion-flush' : ''}`} id={this.parentId} role="presentation">
        {this.normalizedData.map((item, index) => {
          const isOpen = this.openIndexes.has(index);
          const displayIcon = this.iconArray.length === 1 ? this.iconArray[0] : isOpen ? this.iconArray[1] : this.iconArray[0];

          return (
            <div class="accordion-item">
              <h2 class="accordion-header" id={`header-${index}`}>
                <button-component
                  classNames={`${this.classNames} accordion-button ${!isOpen ? 'collapsed' : ''}`}
                  aria-expanded={isOpen ? 'true' : 'false'}
                  aria-controls={`collapse${index}`}
                  role="button"
                  tabindex="0"
                  variant={this.variant}
                  size={this.size}
                  outlined={this.outlined}
                  block={this.block}
                  disabled={this.disabled}
                  ripple={this.ripple}
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  onCustomClick={() => this.toggle(index)}
                  onKeyDown={(e: KeyboardEvent) => this.handleKeyDown(e, index)}
                >
                  {item.header}
                  {displayIcon && (
                    <span class={isOpen ? 'rotate-down' : 'rotate-up'}>
                      <icon-component icon={displayIcon}></icon-component>
                    </span>
                  )}
                </button-component>
              </h2>
              <div
                id={`collapse${index}`}
                aria-labelledby={`header-${index}`}
                role="region"
                class="accordion-collapse collapse"
                data-bs-parent={`#${this.parentId}`}
                style={{
                  overflow: 'hidden',
                  transition: 'height 0.35s ease',
                }}
              >
                <div
                  class={{
                    'accordion-body': true,
                    [this.textSizing()]: true,
                  }}
                >
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
