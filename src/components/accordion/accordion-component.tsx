// src/components/accordion/accordion-component.tsx
import { Component, Prop, State, h, Event, EventEmitter, Watch, Element } from '@stencil/core';

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
  @Element() hostEl!: HTMLElement;

  @Prop() accordion = false;
  @Prop() contentTxtSize = '';
  @Prop() targetId = '';
  @Prop() classNames = '';
  @Prop({ reflect: true }) flush: boolean = false;
  @Prop() outlined = false;
  @Prop() block = false;
  @Prop() variant = '';
  @Prop() size: '' | 'xs' | 'plumage-size' | 'sm' | 'lg' = '';
  @Prop() disabled = false;
  @Prop() ripple = false;
  @Prop() link = false;
  @Prop() icon: string = 'fas fa-angle-down';
  @Prop() isOpen: boolean = false;

  /** Optional: allow an external label for the region instead of the toggle text */
  @Prop() regionLabelledby?: string;

  @State() internalOpen = false;

  @Event() toggleEvent: EventEmitter<boolean>;

  // ------- unique id protection (prevents ARIA/label collisions) -------
  private static _seq = 0;
  private _resolvedTargetId = '';
  private _resolvedHeaderId = '';

  @Watch('isOpen')
  watchIsOpen(newVal: boolean) {
    this.internalOpen = newVal;
    this.setInitialAccordionState();
  }

  componentWillLoad() {
    this.internalOpen = this.isOpen;
    this.resolveIds();
  }

  componentDidLoad() {
    this.setInitialAccordionState();
  }

  private resolveIds() {
    const raw = (this.targetId || '').trim();

    if (!raw) {
      this._resolvedTargetId = '';
      this._resolvedHeaderId = '';
      return;
    }

    let resolved = raw.replace(/\s+/g, '-');

    const existing = document.getElementById(resolved);
    if (existing && existing !== this.hostEl) {
      AccordionComponent._seq += 1;
      const suffix = `${AccordionComponent._seq}-${Math.random().toString(36).slice(2, 6)}`;
      const unique = `${resolved}-${suffix}`;
      // eslint-disable-next-line no-console
      console.warn(
        `[accordion-component] targetId "${resolved}" already exists in DOM. Using "${unique}" to keep IDs unique.`,
      );
      resolved = unique;
    }

    this._resolvedTargetId = resolved;
    this._resolvedHeaderId = `${resolved}-header`;
  }

  private get resolvedTargetId(): string {
    return this._resolvedTargetId || '';
  }

  private get headerId(): string {
    return this._resolvedHeaderId || '';
  }

  private setPanelA11y(targetEl: HTMLElement, isOpen: boolean) {
    if (isOpen) {
      targetEl.removeAttribute('aria-hidden');
      targetEl.removeAttribute('hidden');
      targetEl.removeAttribute('inert');
      targetEl.style.display = 'block';
    } else {
      targetEl.setAttribute('aria-hidden', 'true');
      targetEl.setAttribute('hidden', '');
      targetEl.setAttribute('inert', '');
    }
  }

  private setInitialAccordionState() {
    const id = this.resolvedTargetId;
    if (!id) return;

    const targetEl = document.getElementById(id) as HTMLElement | null;
    if (!targetEl) return;

    if (this.internalOpen) {
      this.setPanelA11y(targetEl, true);
      targetEl.style.height = 'auto';
    } else {
      this.setPanelA11y(targetEl, false);
      targetEl.style.display = 'none';
      targetEl.style.height = '0px';
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
    const id = this.resolvedTargetId;
    if (!id) return;

    const targetEl = document.getElementById(id) as HTMLElement | null;
    if (!targetEl) return;

    const isOpening = !this.internalOpen;
    this.internalOpen = isOpening;
    this.toggleEvent.emit(this.internalOpen);

    if (isOpening) {
      this.setPanelA11y(targetEl, true);
      targetEl.style.height = '0px';
      requestAnimationFrame(() => {
        targetEl.style.height = `${targetEl.scrollHeight}px`;
      });
    } else {
      this.setPanelA11y(targetEl, false);
      targetEl.style.height = `${targetEl.scrollHeight}px`;
      requestAnimationFrame(() => {
        targetEl.style.height = '0px';
      });
    }

    const onTransitionEnd = () => {
      if (this.internalOpen) targetEl.style.height = 'auto';
      else targetEl.style.display = 'none';
      targetEl.removeEventListener('transitionend', onTransitionEnd);
    };
    targetEl.addEventListener('transitionend', onTransitionEnd);
  }

  get iconArray(): string[] {
    const icons =
      this.icon
        ?.split(',')
        .map(i => i.trim())
        .filter(Boolean) ?? [];
    return icons.length > 0 ? icons.slice(0, 2) : ['fas fa-angle-down'];
  }

  private renderExpansionContentArea() {
    const id = this.resolvedTargetId;
    const labelledby = this.regionLabelledby?.trim() || this.headerId;
    const isOpen = this.internalOpen;

    return (
      <div
        id={id}
        role="region"
        aria-labelledby={labelledby}
        aria-hidden={isOpen ? undefined : 'true'}
        hidden={!isOpen}
        inert={!isOpen}
        class="collapse"
        style={{
          height: isOpen ? 'auto' : '0px',
          overflow: 'hidden',
          transition: 'height 0.35s ease',
          display: isOpen ? 'block' : 'none',
        }}
      >
        <div class={`${this.accordion ? 'accordion-body' : 'accordion-card accordion-body'} ${this.textSizing()}`}>
          <slot name="content"></slot>
        </div>
      </div>
    );
  }

  private renderAccordionButton() {
    const id = this.resolvedTargetId;

    const displayIcon =
      this.iconArray.length === 1 ? this.iconArray[0] : this.internalOpen ? this.iconArray[1] : this.iconArray[0];

    return (
      <button-component
        accordion
        target-id={id}
        is-open={this.internalOpen}
        onCustomClick={() => this.toggleCollapse()}
        class-names={`single ${this.getComputedClassAttribute()} ${!this.internalOpen ? 'collapsed' : ''}`}
        data-toggle="collapse"
        data-target={id}
        variant={this.variant}
        size={this.size}
        disabled={this.disabled}
        block={this.block}
        id={this.headerId}
        aria-expanded={String(!!this.internalOpen)}
        aria-controls={id}
      >
        <span class="accordion-label">
          <slot name="accordion-header"></slot>
          {displayIcon ? (
            <span class={this.internalOpen ? 'rotate-down' : 'rotate-up'} aria-hidden="true">
              <icon-component icon={displayIcon}></icon-component>
            </span>
          ) : null}
        </span>
      </button-component>
    );
  }

  private renderAccordionExpansionCard() {
    return (
      <div class={`accordion ${this.flush ? 'accordion-flush' : ''}`}>
        <div class="accordion-item">
          {this.renderAccordionButton()}
          {this.renderExpansionContentArea()}
        </div>
      </div>
    );
  }

  private renderToggleButton() {
    const id = this.resolvedTargetId;

    return (
      <button-component
        accordion
        target-id={id}
        is-open={this.internalOpen}
        onCustomClick={() => this.toggleCollapse()}
        class-names={`${this.getComputedClassAttribute()} ${!this.internalOpen ? 'collapsed' : ''}`}
        data-toggle="collapse"
        data-target={id}
        variant={this.variant}
        size={this.size}
        disabled={this.disabled}
        outlined={this.outlined}
        block={this.block}
        id={this.headerId}
        aria-expanded={String(!!this.internalOpen)}
        aria-controls={id}
      >
        <slot name="button-text"></slot>
      </button-component>
    );
  }

  private renderToggleLink() {
    const id = this.resolvedTargetId;

    return (
      <button-component
        link
        accordion
        target-id={id}
        is-open={this.internalOpen}
        data-toggle="collapse"
        data-target={id}
        onCustomClick={() => this.toggleCollapse()}
        url={`#${id}`}
        variant={this.variant}
        id={this.headerId}
        aria-expanded={String(!!this.internalOpen)}
        aria-controls={id}
        aria-disabled={this.disabled ? 'true' : undefined}
      >
        <slot name="button-text"></slot>
      </button-component>
    );
  }

  render() {
    if (!this.targetId || !this.targetId.trim()) {
      return (
        <div class="accordion-wrapper">
          <div>
            <slot name={this.accordion ? 'accordion-header' : 'button-text'}></slot>
          </div>
          <div class="collapse">
            <slot name="content"></slot>
          </div>
        </div>
      );
    }

    if (this.accordion) return this.renderAccordionExpansionCard();

    return (
      <div class="accordion-wrapper">
        {this.link ? this.renderToggleLink() : this.renderToggleButton()}
        {this.renderExpansionContentArea()}
      </div>
    );
  }
}
