import { Component, Prop, h, State, Element } from '@stencil/core';

@Component({
  tag: 'accordion-container',
  styleUrl: '../accordion/accordion.scss',
  shadow: false,
})
export class AccordionContainer {
  @Element() hostElement!: HTMLElement;

  @Prop() data: Array<{ header: string; content: string }> = [];
  /** A unique id for THIS accordion container. If not provided, one will be generated. */
  @Prop({ attribute: 'parent-id' }) parentId: string = '';

  @Prop({ reflect: true }) flush: boolean = false;
  @Prop() variant: string = '';
  @Prop() size: '' | 'xs' | 'plumage-size' | 'sm' | 'lg' = '';
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

  // ------- unique base id per instance -------
  private static _seq = 0;
  private _baseId!: string;

  private baseId() {
    return this._baseId;
  }
  private headerId(i: number) {
    return `${this.baseId()}-header-${i}`;
  }
  private collapseId(i: number) {
    return `${this.baseId()}-collapse-${i}`;
  }

  componentWillLoad() {
    // establish a unique base id for this instance
    const provided = (this.parentId || '').trim();
    if (provided) {
      // normalize: ensure it’s a valid id token
      this._baseId = provided.replace(/\s+/g, '-');
    } else {
      AccordionContainer._seq += 1;
      const rand = Math.random().toString(36).slice(2, 7);
      this._baseId = `acc-${AccordionContainer._seq}-${rand}`;
    }

    // Warn if empty icon explicitly set
    const iconAttr = this.hostElement?.getAttribute('icon');
    const iconExplicitlyEmpty = iconAttr !== null && iconAttr.trim() === '';
    if (iconExplicitlyEmpty) {
      console.warn('[accordion-container] "icon" prop is empty. Falling back to default "fas fa-angle-down".');
    }

    this.normalizedData = Array.isArray(this.data) ? this.data : [];

    const iconList = this.iconArray;
    if (iconList.length > 2) {
      console.warn('[accordion-container] "icon" prop has more than 2 values. Only the first two will be used.', iconList);
    }
  }

  private toggle(index: number) {
    const isOpen = this.openIndexes.has(index);
    const cid = this.collapseId(index);
    const targetEl = document.getElementById(cid) as HTMLElement | null;
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
            const otherId = this.collapseId(i);
            const otherEl = document.getElementById(otherId) as HTMLElement | null;
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

  render() {
    const parentId = this.baseId();

    return (
      <div class={`accordion ${this.flush ? 'accordion-flush' : ''}`} id={parentId} role="presentation">
        {this.normalizedData.map((item, index) => {
          const isOpen = this.openIndexes.has(index);
          const displayIcon = this.iconArray.length === 1 ? this.iconArray[0] : isOpen ? this.iconArray[1] : this.iconArray[0];

          const hid = this.headerId(index);
          const cid = this.collapseId(index);
          const bsTarget = `#${cid}`;

          return (
            <div class="accordion-item">
              <h2 class="accordion-header" id={hid}>
                <button-component
                  classNames={`${this.classNames} accordion-button ${!isOpen ? 'collapsed' : ''}`}
                  aria-expanded={isOpen ? 'true' : 'false'}
                  aria-controls={cid}
                  variant={this.variant}
                  size={this.size}
                  outlined={this.outlined}
                  block={this.block}
                  disabled={this.disabled}
                  ripple={this.ripple}
                  data-bs-toggle="collapse"
                  data-bs-target={bsTarget}
                  onCustomClick={() => this.toggle(index)}
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
                id={cid}
                aria-labelledby={hid}
                role="region"
                class="accordion-collapse collapse"
                data-bs-parent={`#${parentId}`}
                style={{ overflow: 'hidden', transition: 'height 0.35s ease' }}
              >
                <div class={{ 'accordion-body': true, [this.textSizing()]: true }}>{item.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
