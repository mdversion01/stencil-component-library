// src/components/accordion-container/accordion-container.tsx
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

  /** Optional: accessible name for the container (use when it stands alone) */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  /** Optional: external label element id for the container */
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;

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

  private static _seq = 0;
  private _baseId!: string;

  private baseId() {
    return this._baseId;
  }
  private headerId(i: number) {
    return `${this.baseId()}-header-${i}`;
  }
  /** ID for the interactive control (preferred aria-labelledby target) */
  private triggerId(i: number) {
    return `${this.baseId()}-trigger-${i}`;
  }
  private collapseId(i: number) {
    return `${this.baseId()}-collapse-${i}`;
  }

  private joinIds(...ids: Array<string | undefined>) {
    const cleaned = ids
      .map(s => (s || '').trim())
      .filter(Boolean);
    return cleaned.length ? cleaned.join(' ') : undefined;
  }

  private makeUniqueBaseId(raw: string) {
    const normalized = raw.replace(/\s+/g, '-');
    if (!normalized) return normalized;

    const existing = document.getElementById(normalized);
    if (!existing) return normalized;
    if (existing === this.hostElement) return normalized;

    const suffix = Math.random().toString(36).slice(2, 6);
    const unique = `${normalized}-${suffix}`;
    // eslint-disable-next-line no-console
    console.warn(`[accordion-container] parent-id "${normalized}" already exists in DOM. Using "${unique}" to keep ARIA IDs unique.`);
    return unique;
  }

  private setPanelA11y(panel: HTMLElement, isOpen: boolean) {
    if (isOpen) {
      panel.removeAttribute('aria-hidden');
      panel.removeAttribute('hidden');
      panel.removeAttribute('inert');
      panel.style.display = 'block';
    } else {
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('hidden', '');
      panel.setAttribute('inert', '');
    }
  }

  componentWillLoad() {
    const provided = (this.parentId || '').trim();
    if (provided) {
      this._baseId = this.makeUniqueBaseId(provided);
    } else {
      AccordionContainer._seq += 1;
      const rand = Math.random().toString(36).slice(2, 7);
      this._baseId = `acc-${AccordionContainer._seq}-${rand}`;
    }

    const iconAttr = this.hostElement?.getAttribute('icon');
    const iconExplicitlyEmpty = iconAttr !== null && iconAttr.trim() === '';
    if (iconExplicitlyEmpty) {
      // eslint-disable-next-line no-console
      console.warn('[accordion-container] "icon" prop is empty. Falling back to default "fas fa-angle-down".');
    }

    this.normalizedData = Array.isArray(this.data) ? this.data : [];

    const iconList = this.iconArray;
    if (iconList.length > 2) {
      // eslint-disable-next-line no-console
      console.warn('[accordion-container] "icon" prop has more than 2 values. Only the first two will be used.', iconList);
    }
  }

  componentDidLoad() {
    this.normalizedData.forEach((_item, i) => {
      const panel = document.getElementById(this.collapseId(i)) as HTMLElement | null;
      if (!panel) return;

      const isOpen = this.openIndexes.has(i);
      this.setPanelA11y(panel, isOpen);

      if (isOpen) {
        panel.style.height = 'auto';
      } else {
        panel.style.display = 'none';
        panel.style.height = '0px';
      }
    });
  }

  private toggle(index: number) {
    const isOpen = this.openIndexes.has(index);
    const cid = this.collapseId(index);
    const targetEl = document.getElementById(cid) as HTMLElement | null;
    if (!targetEl) return;

    if (isOpen) {
      this.openIndexes.delete(index);
      this.openIndexes = new Set(this.openIndexes);

      this.setPanelA11y(targetEl, false);

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

              this.setPanelA11y(otherEl, false);

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

      this.setPanelA11y(targetEl, true);

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
    const containerLabelledby = (this.ariaLabelledby || '').trim() || undefined;
    const containerLabel = (this.ariaLabel || '').trim() || undefined;

    const containerIsNamed = !!this.joinIds(containerLabelledby, containerLabel);

    return (
      <div
        class={`accordion ${this.flush ? 'accordion-flush' : ''}`}
        id={parentId}
        data-variant={this.variant || undefined}
        role={containerIsNamed ? 'region' : undefined}
        aria-label={containerLabelledby ? undefined : containerLabel}
        aria-labelledby={containerLabelledby}
      >
        {this.normalizedData.map((item, index) => {
          const isOpen = this.openIndexes.has(index);
          const displayIcon =
            this.iconArray.length === 1 ? this.iconArray[0] : isOpen ? this.iconArray[1] : this.iconArray[0];

          const hid = this.headerId(index);
          const tid = this.triggerId(index);
          const cid = this.collapseId(index);
          const bsTarget = `#${cid}`;

          return (
            <div class="accordion-item">
              <h2 class="accordion-header" id={hid}>
                <button-component
                  id={tid}
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
                    <span class={isOpen ? 'rotate-down' : 'rotate-up'} aria-hidden="true">
                      <icon-component icon={displayIcon}></icon-component>
                    </span>
                  )}
                </button-component>
              </h2>

              <div
                id={cid}
                role="region"
                aria-labelledby={tid}
                aria-hidden={isOpen ? undefined : 'true'}
                hidden={!isOpen}
                inert={!isOpen}
                class="accordion-collapse collapse"
                data-bs-parent={this.singleOpen ? `#${parentId}` : undefined}
                style={{
                  overflow: 'hidden',
                  transition: 'height 0.35s ease',
                  display: isOpen ? 'block' : 'none',
                  height: isOpen ? 'auto' : '0px',
                }}
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
