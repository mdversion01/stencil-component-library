import { Component, Prop, State, h, Event, EventEmitter, Watch } from '@stencil/core';

/**
 * @slot accordion-header - Header content when `accordion` is true.
 * @slot button-text - Header content when used as a button/link toggle.
 * @slot content - Collapsible body content.
 */

@Component({
  tag: 'accordion-component',
  styleUrl: 'accordion.scss',
  shadow: false,
})
export class AccordionComponent {
  @Prop() accordion = false;
  @Prop() contentTxtSize = '';
  @Prop() targetId = '';
  @Prop() classNames = '';
  @Prop({ reflect: true }) flush: boolean = false;
  @Prop() outlined = false;
  @Prop() block = false;
  @Prop() variant = '';
  @Prop() size = '';
  @Prop() disabled = false;
  @Prop() ripple = false;
  @Prop() link = false;
  @Prop() icon: string = 'fas fa-angle-down';
  @Prop() isOpen: boolean = false;

  @State() internalOpen = false;

  @Event() toggleEvent: EventEmitter<boolean>;

  @Watch('isOpen')
  watchIsOpen(newVal: boolean) {
    this.internalOpen = newVal;
    this.setInitialAccordionState();
  }

  componentWillLoad() {
    this.internalOpen = this.isOpen;
  }

  componentDidLoad() {
    this.setInitialAccordionState();
  }

  private setInitialAccordionState() {
    const targetEl = document.querySelector(`#${this.targetId}`) as HTMLElement;
    if (targetEl) {
      if (this.internalOpen) {
        targetEl.style.display = 'block';
        targetEl.style.height = 'auto';
      } else {
        targetEl.style.display = 'none';
        targetEl.style.height = '0px';
      }
    }
  }

  private getComputedClassAttribute() {
    let cls = this.classNames ? `${this.classNames}` : '';
    if (this.accordion) cls += ' accordion-button';
    if (this.ripple) cls += ' btn-ripple';
    if (this.size) cls += ` ${this.size}`;
    return cls.trim();
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

  private toggleCollapse() {
    const targetEl = document.querySelector(`#${this.targetId}`) as HTMLElement;
    if (!targetEl) return;

    const isOpening = !this.internalOpen;
    this.internalOpen = isOpening;
    this.toggleEvent.emit(this.internalOpen);

    if (isOpening) {
      targetEl.style.display = 'block';
      targetEl.style.height = '0px';
      requestAnimationFrame(() => {
        targetEl.style.height = `${targetEl.scrollHeight}px`;
      });
    } else {
      targetEl.style.height = `${targetEl.scrollHeight}px`;
      requestAnimationFrame(() => {
        targetEl.style.height = '0px';
      });
    }

    const onTransitionEnd = () => {
      if (this.internalOpen) {
        targetEl.style.height = 'auto';
      } else {
        targetEl.style.display = 'none';
      }
      targetEl.removeEventListener('transitionend', onTransitionEnd);
    };
    targetEl.addEventListener('transitionend', onTransitionEnd);
  }

  get iconArray(): string[] {
    return this.icon ? this.icon.split(',').map(i => i.trim()) : [];
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleCollapse();
    }
  }

  private renderExpansionContentArea() {
    return (
      <div
        id={this.targetId}
        role="region"
        aria-labelledby={`${this.targetId}-header`}
        class="collapse"
        style={{
          height: '0px',
          overflow: 'hidden',
          transition: 'height 0.35s ease',
        }}
      >
        <div class={`${this.accordion ? 'accordion-body' : 'accordion-card accordion-body'} ${this.textSizing()}`}>
          <slot name="content"></slot>
        </div>
      </div>
    );
  }

  private renderAccordionButton() {
    const displayIcon = this.iconArray.length === 1 ? this.iconArray[0] : this.internalOpen ? this.iconArray[1] : this.iconArray[0];

    return (
      <button-component
        accordion
        targetId={this.targetId}
        isOpen={this.internalOpen}
        onCustomClick={() => this.toggleCollapse()}
        classNames={`single ${this.getComputedClassAttribute()} ${!this.internalOpen ? 'collapsed' : ''}`}
        data-toggle="collapse"
        data-target={this.targetId}
        variant={this.variant}
        size={this.size}
        disabled={this.disabled}
        block={this.block}
      >
        <span class="accordion-label">
          <slot name="accordion-header"></slot>
          <span class={this.internalOpen ? 'rotate-down' : 'rotate-up'}>
            <icon-component icon={displayIcon}></icon-component>
          </span>
        </span>
      </button-component>
    );
  }

  private renderAccordionExpansionCard() {
    return (
      <div class={`accordion ${this.flush ? 'accordion-flush' : ''}`} role="presentation">
        <div class="accordion-item">
          {this.renderAccordionButton()}
          {this.renderExpansionContentArea()}
        </div>
      </div>
    );
  }

  private renderToggleButton() {
    return (
      <button-component
        accordion
        targetId={this.targetId}
        isOpen={this.internalOpen}
        onCustomClick={() => this.toggleCollapse()}
        onKeyDown={(e: KeyboardEvent) => this.handleKeyDown(e)}
        role="button"
        tabindex="0"
        classNames={`${this.getComputedClassAttribute()} ${!this.internalOpen ? 'collapsed' : ''}`}
        data-toggle="collapse"
        data-target={this.targetId}
        variant={this.variant}
        size={this.size}
        disabled={this.disabled}
        outlined={this.outlined}
        block={this.block}
      >
        <slot name="button-text"></slot>
      </button-component>
    );
  }

  private renderToggleLink() {
    return (
      <button-component
        link
        accordion
        targetId={this.targetId}
        isOpen={this.internalOpen}
        data-toggle="collapse"
        data-target={this.targetId}
        onCustomClick={() => this.toggleCollapse()}
        onKeyDown={(e: KeyboardEvent) => this.handleKeyDown(e)}
        url={`#${this.targetId}`}
        role="button"
        tabindex="0"
        variant={this.variant}
      >
        <slot name="button-text"></slot>
      </button-component>
    );
  }

  render() {
    if (this.accordion) {
      return this.renderAccordionExpansionCard();
    } else if (this.link) {
      return (
        <div class="accordion-wrapper">
          {this.renderToggleLink()}
          {this.renderExpansionContentArea()}
        </div>
      );
    } else {
      return (
        <div class="accordion-wrapper">
          {this.renderToggleButton()}
          {this.renderExpansionContentArea()}
        </div>
      );
    }
  }
}
