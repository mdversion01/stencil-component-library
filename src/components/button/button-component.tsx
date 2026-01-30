// src/components/button/button-component.tsx
import { Component, Prop, Event, EventEmitter, h, Element, Watch } from '@stencil/core';
import { logInfo } from '../../utils/log-debug';

@Component({
  tag: 'button-component',
  styleUrl: 'button.scss',
  shadow: false, // keep light DOM
})
export class Button {
  @Element() hostEl!: HTMLElement;

  // ---- existing props ----
  @Prop() absolute = false;
  @Prop() active = false;
  @Prop() ariaLabel = '';
  @Prop() block = false;
  @Prop() bottom = '';
  @Prop() btnIcon = false;
  @Prop() btnText = '';
  @Prop() classNames = '';
  @Prop() disabled = false;
  @Prop() end = false;
  @Prop() elevation = '';
  @Prop() fixed = false;
  @Prop() groupBtn = false;
  @Prop() iconBtn = false;
  @Prop() slotSide?: 'left' | 'right';
  @Prop() styles = '';
  @Prop() left = '';
  @Prop() link = false;
  @Prop() outlined = false;

  /**
   * Enable toggle-button behavior. When true, clicking (or keyboard activate) flips the `pressed` state.
   */
  @Prop() toggle = false;

  /**
   * Current pressed state (for toggle buttons). Reflected & mutable so markup stays clean:
   * - attribute omitted when false
   * - attribute present (empty) when true
   */
  @Prop({ reflect: true, mutable: true }) pressed = false;

  @Prop() right = '';
  @Prop() ripple = false;
  @Prop() shape = '';
  @Prop() size: '' | 'xs' | 'plumage-size' | 'sm' | 'lg' = '';
  @Prop() start = false;
  @Prop() stripped = false;
  @Prop() text = false;
  @Prop() textBtn = false;
  @Prop() titleAttr = '';
  @Prop() top = '';
  @Prop() url = '';
  @Prop() variant = '';
  @Prop() vertical = false;
  @Prop() zIndex = '';

  // Accordion helpers (unchanged)
  @Prop({ mutable: true }) isOpen = false;
  @Prop() targetId = '';
  @Prop() accordion = false;

  /**
   * Allow consumers to opt-out of nested focusable neutralization (e.g., if they need
   * an actual focusable child on purpose).
   */
  @Prop() allowFocusableChildren = false;

  @Prop() devMode = false;

  @Event() customClick!: EventEmitter<void>;

  /** Fired whenever `pressed` changes (useful for external sync / two-way binding). */
  @Event({ eventName: 'pressedChange' }) pressedChange!: EventEmitter<boolean>;

  @Watch('pressed')
  onPressedChanged(v: boolean) {
    this.pressedChange.emit(!!v);
  }

  // ---- lifecycle: neutralize nested focusables after render ----
  componentDidLoad() {
    this.neutralizeNestedInteractivesIfNeeded();
  }
  componentDidUpdate() {
    this.neutralizeNestedInteractivesIfNeeded();
  }

  private handleClick() {
    // Toggle behavior
    if (this.toggle && !this.disabled) {
      this.pressed = !this.pressed; // @Watch emits pressedChange
    }
    this.customClick.emit();
    logInfo(this.devMode, 'Button', 'Clicked');
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      this.handleClick();
    }
  };

  private getDynamicStyles(): { [k: string]: string } {
    const s: { [k: string]: string } = {};
    if (this.absolute) s.position = 'absolute';
    if (this.fixed) s.position = 'fixed';
    if (this.left) s.left = `${this.left}px`;
    if (this.right) s.right = `${this.right}px`;
    if (this.top) s.top = `${this.top}px`;
    if (this.bottom) s.bottom = `${this.bottom}px`;
    if (this.zIndex) s['z-index'] = this.zIndex;
    logInfo(this.devMode, 'Button', 'getDynamicStyles()', s);
    return s;
  }

  // Neutralize nested interactive descendants to avoid a11y failures for nested buttons/links
  private neutralizeNestedInteractivesIfNeeded() {
    if (this.allowFocusableChildren) return;

    // Find the inner interactive root we render (<button> or <a>)
    const inner = this.hostEl.querySelector('button.btn, a.btn');
    if (!inner) return;

    const focusableSel =
      'a[href],area[href],button,details,[tabindex]:not([tabindex="-1"]),input,select,textarea,[contenteditable=""],[contenteditable="true"]';

    // Any focusable descendant *inside* that is not the inner root itself gets neutralized
    const descendants = Array.from(inner.querySelectorAll<HTMLElement>(focusableSel)).filter(n => n !== inner);

    descendants.forEach(el => {
      // Demote common interactive descendants to decorative
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
        el.setAttribute('aria-hidden', 'true');
        if (el.tagName === 'A') el.removeAttribute('href');
        // If it had a role, clear it to be purely presentational
        el.removeAttribute('role');
        if (this.devMode) {
          console.warn('[button-component] Nested focusable child neutralized to avoid nested-interactive a11y issue:', el);
        }
      }
      // SVGs sometimes end up focusable; make them inert/decorative
      if (el.tagName === 'SVG') {
        el.setAttribute('focusable', 'false');
        el.setAttribute('aria-hidden', 'true');
      }
    });
  }

  private renderButtonContent() {
    const hasLeft = this.slotSide === 'left';
    const hasRight = this.slotSide === 'right';

    // In icon-only modes, the slot content is decorative; hide it from AT to avoid duplicate names
    const iconOnly = this.btnIcon || this.iconBtn;

    const content = this.btnIcon ? (
      <span aria-hidden="true">
        <slot />
      </span>
    ) : this.iconBtn ? (
      <span class="btn__content" aria-hidden="true">
        <slot />
      </span>
    ) : (
      [
        hasLeft && (
          <span class="btn__side left">
            <slot />
          </span>
        ),
        <span class={`btn__content ${hasLeft ? 'ms-1' : ''} ${hasRight ? 'me-1' : ''}`} aria-hidden={iconOnly ? 'true' : null}>
          {this.btnText}
          {!hasLeft && !hasRight && <slot />}
        </span>,
        hasRight && (
          <span class="btn__side right">
            <slot />
          </span>
        ),
      ]
    );

    logInfo(this.devMode, 'Button', 'renderButtonContent()', {
      btnText: this.btnText,
      slotSide: this.slotSide,
      btnIcon: this.btnIcon,
      iconBtn: this.iconBtn,
    });

    return content;
  }

  private collectHostA11yAndData(): Record<string, any> {
    const out: Record<string, any> = {};
    for (const attr of Array.from(this.hostEl.attributes)) {
      const n = attr.name.toLowerCase();
      if (n.startsWith('aria-') || n === 'role' || n === 'tabindex' || n.startsWith('data-')) {
        out[attr.name] = attr.value === '' ? '' : attr.value;
      }
    }
    return out;
  }

  render() {
    const dynamicStyles = this.getDynamicStyles();
    const isGroup = !!this.groupBtn;
    const buttonGroup = this.vertical ? 'btn-group-vertical' : 'btn-group';
    const placement = this.start ? `${buttonGroup}-start` : this.end ? `${buttonGroup}-end` : 'btn-group__btn';

    const classList = [
      'btn',
      this.classNames,
      this.outlined ? `btn-outline-${this.variant}` : '',
      !this.outlined && this.variant ? `btn-${this.variant}` : '',
      this.block && 'btn--block',
      this.size && `btn-${this.size}`,
      this.shape,
      this.active && 'active',
      isGroup && buttonGroup,
      isGroup && placement,
      this.ripple && 'btn-ripple',
      this.stripped && 'stripped',
      this.iconBtn && 'icon-btn',
      this.link && 'link',
      this.elevation && `elevated-${this.elevation}`,
      this.textBtn && 'text-btn',
      this.text && 'text',
      this.btnIcon && 'btn-icon',
      this.toggle && 'btn--toggle', // optional helper class for styling toggles
      this.toggle && this.pressed && 'pressed', // optional styling hook when pressed
    ]
      .filter(Boolean)
      .join(' ');

    // Accessible name (esp. for icon-only)
    const hasVisibleText = !!(this.btnText && this.btnText.trim().length);
    const computedAriaLabel =
      (this.ariaLabel && this.ariaLabel.trim()) ||
      (hasVisibleText ? this.btnText.trim() : '') ||
      (this.titleAttr && this.titleAttr.trim()) ||
      'Button';

    // ARIA for accordion toggles
    const ariaForAccordion: Record<string, any> = {};
    if (this.accordion && this.targetId) {
      ariaForAccordion['aria-expanded'] = String(!!this.isOpen);
      ariaForAccordion['aria-controls'] = this.targetId;
    }

    const passthrough = this.collectHostA11yAndData();

    const common = {
      ...passthrough,
      ...ariaForAccordion,
      // Only set aria-pressed for toggle buttons
      'aria-pressed': this.toggle ? String(!!this.pressed) : undefined,
      'aria-label': computedAriaLabel,
      'aria-disabled': this.link && this.disabled ? 'true' : undefined,
      style: dynamicStyles,
      class: classList,
      onClick: (event: MouseEvent) => {
        if (this.disabled) {
          event.preventDefault();
          return;
        }
        const shouldPrevent = !this.url || this.url === '#' || this.url.trim() === '' || this.url.startsWith('#');
        if (this.link && shouldPrevent) event.preventDefault();
        this.handleClick();
      },
      onKeyDown: this.disabled ? undefined : this.handleKeyDown,
      title: this.titleAttr,
    } as Record<string, any>;

    return this.link ? (
      <a
        {...(common as any)}
        href={this.url && this.url.trim() !== '' ? this.url : undefined}
        role={common['role'] || 'button'}
        tabindex={this.disabled ? '-1' : common['tabindex'] ?? '0'}
      >
        {this.renderButtonContent()}
      </a>
    ) : (
      <button {...(common as any)} role={common['role'] || 'button'} type="button" disabled={this.disabled}>
        {this.renderButtonContent()}
      </button>
    );
  }
}
