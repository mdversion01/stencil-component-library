// src/components/button/button-component.tsx
import { Component, Prop, Event, EventEmitter, h, Element, Watch } from '@stencil/core';
import { logInfo } from '../../utils/log-debug';

type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  tag: 'button-component',
  styleUrl: 'button.scss',
  shadow: false,
})
export class Button {
  @Element() hostEl!: HTMLElement;

  // ---- existing props ----
  @Prop() absolute = false;
  @Prop() active = false;

  /** Prefer using aria-labelledby when the label exists elsewhere in DOM. */
  @Prop() ariaLabel = '';
  @Prop() ariaLabelledby?: string;
  @Prop() ariaDescribedby?: string;

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

  /** Inline CSS styles for the inner <button> or <a> element. */
  @Prop() styles = '';

  @Prop() left = '';
  @Prop() link = false;
  @Prop() outlined = false;

  /** Enable toggle-button behavior. */
  @Prop() toggle = false;

  /** Current pressed state (for toggle buttons). */
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

  /** Native button type (ignored for link mode). */
  @Prop() type: ButtonType = 'button';

  // Accordion helpers (unchanged)
  @Prop({ mutable: true }) isOpen = false;
  @Prop() targetId = '';
  @Prop() accordion = false;

  @Prop() allowFocusableChildren = false;
  @Prop() devMode = false;

  @Event() customClick!: EventEmitter<void>;
  @Event({ eventName: 'pressedChange' }) pressedChange!: EventEmitter<boolean>;

  @Watch('pressed')
  onPressedChanged(v: boolean) {
    this.pressedChange.emit(!!v);
  }

  componentDidLoad() {
    this.neutralizeNestedInteractivesIfNeeded();
  }
  componentDidUpdate() {
    this.neutralizeNestedInteractivesIfNeeded();
  }

  private handleClick() {
    if (this.toggle && !this.disabled) {
      this.pressed = !this.pressed;
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

  private parseInlineStyles(styles: string): { [k: string]: string } {
    const out: { [k: string]: string } = {};
    if (!styles || typeof styles !== 'string') return out;

    const rules = styles.split(';');
    for (const rule of rules) {
      const r = rule.trim();
      if (!r) continue;

      const idx = r.indexOf(':');
      if (idx === -1) continue;

      const rawKey = r.slice(0, idx).trim();
      const rawVal = r.slice(idx + 1).trim();
      if (!rawKey || !rawVal) continue;

      const key = rawKey.replace(/-([a-z])/g, (_, c) => String(c).toUpperCase());
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;

      out[key] = rawVal;
    }
    return out;
  }

  private neutralizeNestedInteractivesIfNeeded() {
    if (this.allowFocusableChildren) return;

    const inner = this.hostEl.querySelector('button.btn, a.btn');
    if (!inner) return;

    const focusableSel =
      'a[href],area[href],button,details,[tabindex]:not([tabindex="-1"]),input,select,textarea,[contenteditable=""],[contenteditable="true"]';

    const descendants = Array.from(inner.querySelectorAll<HTMLElement>(focusableSel)).filter(n => n !== inner);

    descendants.forEach(el => {
      if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
        el.setAttribute('aria-hidden', 'true');
        if (el.tagName === 'A') el.removeAttribute('href');
        el.removeAttribute('role');
        if (this.devMode) {
          // eslint-disable-next-line no-console
          console.warn('[button-component] Nested focusable child neutralized:', el);
        }
      }
      if (el.tagName === 'SVG') {
        el.setAttribute('focusable', 'false');
        el.setAttribute('aria-hidden', 'true');
      }
    });
  }

  private renderButtonContent() {
    const hasLeft = this.slotSide === 'left';
    const hasRight = this.slotSide === 'right';

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

  private computeA11y(passthrough: Record<string, any>) {
    const hasVisibleText = !!(this.btnText && this.btnText.trim().length);
    const iconOnly = this.btnIcon || this.iconBtn;

    const propLabel = (this.ariaLabel || '').trim();
    const propLabelledby = (this.ariaLabelledby || '').trim();
    const propDescribedby = (this.ariaDescribedby || '').trim();

    const hostLabel = typeof passthrough['aria-label'] === 'string' ? passthrough['aria-label'].trim() : '';
    const hostLabelledby = typeof passthrough['aria-labelledby'] === 'string' ? passthrough['aria-labelledby'].trim() : '';
    const hostDescribedby = typeof passthrough['aria-describedby'] === 'string' ? passthrough['aria-describedby'].trim() : '';

    const labelledby = propLabelledby || hostLabelledby || undefined;
    const describedby = propDescribedby || hostDescribedby || undefined;

    // Prefer labelledby over label. Only apply aria-label when necessary.
    let ariaLabel: string | undefined;
    if (!labelledby) {
      if (propLabel) ariaLabel = propLabel;
      else if (hostLabel) ariaLabel = hostLabel;
      else if (!hasVisibleText || iconOnly) {
        const t = (this.titleAttr || '').trim();
        ariaLabel = t || 'Button';
      }
    }

    return { ariaLabel, labelledby, describedby };
  }

  render() {
    const dynamicStyles = this.getDynamicStyles();
    const userStyles = this.parseInlineStyles(this.styles);
    const mergedStyles = { ...userStyles, ...dynamicStyles };

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
      this.toggle && 'btn--toggle',
      this.toggle && this.pressed && 'pressed',
    ]
      .filter(Boolean)
      .join(' ');

    const ariaForAccordion: Record<string, any> = {};
    if (this.accordion && this.targetId) {
      ariaForAccordion['aria-expanded'] = String(!!this.isOpen);
      ariaForAccordion['aria-controls'] = this.targetId;
    }

    const passthrough = this.collectHostA11yAndData();
    const { ariaLabel, labelledby, describedby } = this.computeA11y(passthrough);

    const consumerRole = passthrough['role']; // if present, honor it (but don't force role on <button>)
    const consumerTabIndex = passthrough['tabindex'];

    const isDisabledLink = this.link && this.disabled;
    const href = !this.link
      ? undefined
      : isDisabledLink
        ? undefined
        : this.url && this.url.trim() !== '' && this.url !== '#'
          ? this.url
          : undefined;

    const common = {
      ...passthrough,
      ...ariaForAccordion,
      ...(labelledby ? { 'aria-labelledby': labelledby } : { 'aria-labelledby': undefined }),
      ...(describedby ? { 'aria-describedby': describedby } : { 'aria-describedby': undefined }),
      ...(ariaLabel ? { 'aria-label': ariaLabel } : { 'aria-label': undefined }),
      ...(this.toggle ? { 'aria-pressed': String(!!this.pressed) } : { 'aria-pressed': undefined }),
      style: mergedStyles,
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

    if (this.link) {
      return (
        <a
          {...(common as any)}
          href={href}
          role={consumerRole || 'button'}
          tabindex={isDisabledLink ? '-1' : consumerTabIndex ?? '0'}
          aria-disabled={isDisabledLink ? 'true' : undefined}
        >
          {this.renderButtonContent()}
        </a>
      );
    }

    // Native button: do NOT force role unless consumer explicitly provided one.
    return (
      <button
        {...(common as any)}
        type={this.type}
        disabled={this.disabled}
        role={consumerRole || undefined}
        tabindex={consumerTabIndex ?? undefined}
      >
        {this.renderButtonContent()}
      </button>
    );
  }
}
