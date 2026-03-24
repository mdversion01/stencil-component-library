// src/components/tooltip/tooltip-component.tsx
import { Component, h, Prop, Element, Method, Listen } from '@stencil/core';

export type TooltipPosition = 'auto' | 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark';

@Component({
  tag: 'tooltip-component',
  styleUrls: ['./tooltip-styles.scss'],
  shadow: false, // light DOM
})
export class TooltipComponent {
  @Element() host!: HTMLElement;

  /** Message fallback when no title/data-original-title supplied */
  @Prop() message: string = '';

  /** Initial/forced placement; use "auto" to choose best fit */
  @Prop() position: TooltipPosition = 'top';

  /** If true, the tooltip is currently visible (manual control) */
  @Prop({ mutable: true, reflect: true }) visible: boolean = false;

  /** If true, treat content as HTML and use innerHTML (TRUSTED CONTENT ONLY) */
  @Prop() htmlContent: boolean = false;

  /** Title/content string; if empty, falls back to `title`/`data-original-title` attributes or `message` */
  @Prop() tooltipTitle?: string; // renamed from reserved "title"

  /** Space-separated triggers: "hover", "focus", "click", "manual" */
  @Prop() trigger: string = 'hover focus';

  /** Enable/disable fade animation class */
  @Prop() animation: boolean = true;

  /** Optional CSS selector to append tooltip into (defaults to body) */
  @Prop() container?: string | null;

  /** Additional classes to apply to tooltip */
  @Prop() customClass: string = '';

  /** Contextual color variant */
  @Prop() variant: TooltipVariant = '';

  /**
   * Optional stable id for the tooltip element (recommended for tests/SSR).
   * If omitted, a deterministic-ish id is generated.
   */
  @Prop() tooltipId?: string;

  // ------- internals -------
  private static _uid = 0;

  private _tooltipId!: string;
  private tooltipEl: HTMLDivElement | null = null;
  private arrowEl: HTMLDivElement | null = null;

  private outsideClickHandler = (ev: Event) => this.handleOutsideClick(ev);
  private scrollHandler = () => this.handleScroll();

  private mo?: MutationObserver;
  private ro?: ResizeObserver;

  // ---------- resolver helpers ----------
  private resolvePosition(): TooltipPosition {
    // allow data-placement on host OR trigger element; prefer host attribute if set
    return (this.host.getAttribute('data-placement') as TooltipPosition) || this.position;
  }
  private resolveHtml(): boolean {
    return this.host.hasAttribute('data-html') || this.htmlContent;
  }
  private resolveTitle(): string {
    // Prefer data-original-title if present (since we may move `title` into it)
    return this.host.getAttribute('data-original-title') || this.host.getAttribute('title') || this.tooltipTitle || this.message || '';
  }
  private resolveTrigger(): string {
    return this.host.getAttribute('data-trigger') || this.trigger;
  }
  private resolveAnimation(): boolean {
    return this.host.hasAttribute('data-animation') ? this.host.getAttribute('data-animation') !== 'false' : this.animation;
  }
  private resolveContainer(): string | null | undefined {
    const v = this.host.getAttribute('data-container');
    return v !== null ? v : (this.container ?? null);
  }
  private resolveCustomClass(): string {
    return this.host.getAttribute('data-custom-class') || this.customClass || '';
  }
  private resolveVariant(): TooltipVariant {
    return (this.host.getAttribute('data-variant') as TooltipVariant) || this.variant || '';
  }

  connectedCallback() {
    // generate a stable-ish id once per instance
    const base = (this.tooltipId || '').trim() || (this.host.id || '').trim() || 'tooltip';
    TooltipComponent._uid += 1;
    this._tooltipId = `${base}__tip_${TooltipComponent._uid}`;

    window.addEventListener('scroll', this.scrollHandler, true);

    // Observe size changes while visible (keeps position correct on responsive layout)
    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => {
        if (this.visible) requestAnimationFrame(() => this.adjustTooltipPosition());
      });
    }
  }

  componentDidLoad() {
    this.applyTriggers();

    // If slot content changes (new trigger element), rebind
    if (typeof MutationObserver !== 'undefined') {
      this.mo = new MutationObserver(() => this.applyTriggers());
      this.mo.observe(this.host, { childList: true, subtree: false });
    }

    // If initially visible (manual), render immediately
    if (this.visible) {
      this.createTooltipElement();
      requestAnimationFrame(() => this.adjustTooltipPosition());
    }
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.scrollHandler, true);
    document.removeEventListener('click', this.outsideClickHandler, true);
    this.removeTooltipElement();
    this.mo?.disconnect();
    this.ro?.disconnect();
  }

  // ---------- public (manual) ----------
  @Method()
  async show(): Promise<void> {
    if (this.resolveTrigger().includes('manual')) this.showTooltip();
  }

  @Method()
  async hide(): Promise<void> {
    if (this.resolveTrigger().includes('manual')) this.hideTooltip();
  }

  // ---------- accessibility helpers ----------
  private isNaturallyFocusable(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    if (tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea') return true;
    if (tag === 'a' && (el as HTMLAnchorElement).hasAttribute('href')) return true;
    return false;
  }

  private normalizeIdList(value?: string | null): string | undefined {
    const trimmed = String(value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }

  private joinIds(...ids: Array<string | undefined>): string | undefined {
    const tokens = ids
      .map(v => this.normalizeIdList(v))
      .filter(Boolean)
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!tokens.length) return undefined;

    // de-dupe, preserve order
    const out: string[] = [];
    for (const t of tokens) if (!out.includes(t)) out.push(t);
    return out.join(' ');
  }

  private syncTriggerA11y(triggerEl: HTMLElement) {
    // Prevent native browser tooltip from competing with our custom tooltip.
    // Move title -> data-original-title once.
    const title = triggerEl.getAttribute('title');
    if (title && !triggerEl.getAttribute('data-original-title')) {
      triggerEl.setAttribute('data-original-title', title);
      triggerEl.removeAttribute('title');
    }

    // Ensure focusable for keyboard if not naturally focusable
    if (!this.isNaturallyFocusable(triggerEl) && !triggerEl.hasAttribute('tabindex')) {
      triggerEl.setAttribute('tabindex', '0');
    }

    // role tooltip relationship: aria-describedby should include our tooltip id
    const existing = triggerEl.getAttribute('aria-describedby');
    const merged = this.joinIds(existing || undefined, this._tooltipId);
    if (merged) triggerEl.setAttribute('aria-describedby', merged);

    // Some AT benefit from aria-haspopup for click-triggered tips
    const triggers = this.resolveTrigger().split(/\s+/).filter(Boolean);
    const isClickLike = triggers.includes('click') || triggers.includes('manual');
    if (isClickLike) triggerEl.setAttribute('aria-haspopup', 'true');
    else triggerEl.removeAttribute('aria-haspopup');

    // aria-expanded tracks visibility when click/manual is possible (harmless otherwise)
    triggerEl.setAttribute('aria-expanded', this.visible ? 'true' : 'false');

    // data-* for debugging/compat
    triggerEl.setAttribute('data-toggle', 'tooltip');
    triggerEl.setAttribute('data-placement', this.resolvePosition());
  }

  private getColor(variant: TooltipVariant): string {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'danger':
      case 'info':
      case 'warning':
      case 'dark':
        return variant;
      default:
        return '';
    }
  }

  private getTriggerEl(): HTMLElement | null {
    return (this.host.firstElementChild as HTMLElement) || null;
  }

  private unbind(el: HTMLElement | null) {
    if (!el) return;
    el.removeEventListener('click', this.onClick);
    el.removeEventListener('mouseenter', this.onMouseEnter);
    el.removeEventListener('mouseleave', this.onMouseLeave);
    el.removeEventListener('focus', this.onFocus);
    el.removeEventListener('blur', this.onBlur);
    document.removeEventListener('click', this.outsideClickHandler, true);
  }

  private applyTriggers() {
    const triggerEl = this.getTriggerEl();
    this.unbind(triggerEl);
    if (!triggerEl) return;

    this.syncTriggerA11y(triggerEl);

    const triggers = this.resolveTrigger().split(/\s+/).filter(Boolean);

    if (triggers.includes('click')) {
      triggerEl.addEventListener('click', this.onClick);
      document.addEventListener('click', this.outsideClickHandler, true);
    }
    if (triggers.includes('hover')) {
      triggerEl.addEventListener('mouseenter', this.onMouseEnter);
      triggerEl.addEventListener('mouseleave', this.onMouseLeave);
    }
    if (triggers.includes('focus')) {
      triggerEl.addEventListener('focus', this.onFocus);
      triggerEl.addEventListener('blur', this.onBlur);
    }

    // Keep RO observing both trigger and tooltip when visible
    this.ro?.disconnect();
    this.ro?.observe(triggerEl);

    if (this.visible) {
      this.createTooltipElement();
      requestAnimationFrame(() => this.adjustTooltipPosition());
    }
  }

  private onClick = (ev: Event) => {
    if (this.resolveTrigger().includes('manual')) return;
    const target = this.getTriggerEl();
    if (ev.currentTarget !== target) return;
    this.visible ? this.hideTooltip() : this.showTooltip();
  };

  private onMouseEnter = (ev: Event) => {
    if (this.resolveTrigger().includes('manual')) return;
    const target = this.getTriggerEl();
    if (ev.currentTarget !== target) return;
    this.showTooltip();
  };

  private onMouseLeave = () => {
    if (this.resolveTrigger().includes('manual')) return;
    this.hideTooltip();
  };

  private onFocus = (ev: Event) => {
    if (this.resolveTrigger().includes('manual')) return;
    const target = this.getTriggerEl();
    if (ev.currentTarget !== target) return;
    this.showTooltip();
  };

  private onBlur = () => {
    if (this.resolveTrigger().includes('manual')) return;
    this.hideTooltip();
  };

  @Listen('keydown', { target: 'document' })
  onDocumentKeydown(ev: KeyboardEvent) {
    if (!this.visible) return;
    if (ev.key !== 'Escape') return;

    // Only close if focus/click originated within this tooltip/trigger
    const trigger = this.getTriggerEl();
    const tip = this.tooltipEl;
    const path = (ev.composedPath?.() as any[]) || [];
    const within =
      (trigger && path.includes(trigger)) ||
      (tip && path.includes(tip)) ||
      (trigger && document.activeElement && trigger.contains(document.activeElement)) ||
      (tip && document.activeElement && tip.contains(document.activeElement));

    if (!within) return;

    ev.preventDefault();
    this.hideTooltip();
  }

  private handleScroll() {
    // If click-triggered, scrolling should close (matches common UX)
    if (this.resolveTrigger().includes('click') && this.visible) this.hideTooltip();
    // For hover/focus, keep it positioned if still visible
    if (this.visible) requestAnimationFrame(() => this.adjustTooltipPosition());
  }

  private handleOutsideClick(event: Event) {
    if (!this.visible || !this.tooltipEl) return;
    const trigger = this.getTriggerEl();
    const t = event.target as Node;
    if (trigger && !trigger.contains(t) && !this.tooltipEl.contains(t)) {
      this.hideTooltip();
    }
  }

  private showTooltip() {
    this.visible = true;
    this.createTooltipElement();

    const trigger = this.getTriggerEl();
    if (trigger) trigger.setAttribute('aria-expanded', 'true');

    requestAnimationFrame(() => this.adjustTooltipPosition());
  }

  private hideTooltip() {
    this.visible = false;

    const trigger = this.getTriggerEl();
    if (trigger) trigger.setAttribute('aria-expanded', 'false');

    this.removeTooltipElement();
  }

  private getTooltipContent(): string {
    return this.resolveTitle();
  }

  private getContainer(): HTMLElement {
    const sel = this.resolveContainer();
    if (sel) {
      const found = document.querySelector(sel);
      if (found instanceof HTMLElement) return found;
    }
    return document.body;
  }

  // ---------- creation / positioning ----------
  private createTooltipElement() {
    if (this.tooltipEl) return;

    const position = this.resolvePosition();
    const animate = this.resolveAnimation();
    const custom = this.resolveCustomClass();
    const variantCls = this.getColor(this.resolveVariant());

    // Best practice: do NOT auto-enable HTML by heuristics. Only enable if explicitly requested.
    const rawContent = this.getTooltipContent();
    const useHtml = this.resolveHtml();

    const tooltip = document.createElement('div');
    tooltip.id = this._tooltipId;
    tooltip.classList.add('tooltip', `tooltip-${position}`, 'fade', 'show');
    if (animate) tooltip.classList.add('animated');

    // absolute positioning
    tooltip.style.position = 'absolute';
    tooltip.style.top = '0px';
    tooltip.style.left = '0px';
    tooltip.style.pointerEvents = 'none'; // tooltips should not steal mouse/focus

    // A11y: tooltip role. Do not use aria-live on tooltips (they aren't announcements).
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'false');

    // arrow
    const arrow = document.createElement('div');
    arrow.className = `tooltip-arrow ${variantCls} ${custom}`.trim();
    Object.assign(arrow.style, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      transform: 'rotate(45deg)',
      background: 'currentColor',
      opacity: '0',
      pointerEvents: 'none',
    } as CSSStyleDeclaration);

    // inner
    const inner = document.createElement('div');
    inner.id = `${this._tooltipId}-content`;
    inner.className = `tooltip-inner ${variantCls} ${custom}`.trim();
    inner.style.position = 'relative';

    if (useHtml) {
      inner.innerHTML = rawContent; // TRUSTED HTML ONLY
    } else {
      inner.textContent = rawContent;
    }

    tooltip.appendChild(arrow);
    tooltip.appendChild(inner);

    this.getContainer().appendChild(tooltip);
    this.tooltipEl = tooltip;
    this.arrowEl = arrow;

    // Observe tooltip size for repositioning
    if (this.ro) this.ro.observe(tooltip);

    // Match arrow color to inner background (if any)
    try {
      const bg = getComputedStyle(inner).backgroundColor || getComputedStyle(inner).color;
      if (bg) arrow.style.backgroundColor = bg;
    } catch {
      // ignore
    }
  }

  private removeTooltipElement() {
    if (!this.tooltipEl) return;

    try {
      this.tooltipEl.setAttribute('aria-hidden', 'true');
    } catch {
      // ignore
    }

    const parent = this.tooltipEl.parentElement;
    if (parent) parent.removeChild(this.tooltipEl);

    this.tooltipEl = null;
    this.arrowEl = null;
  }

  private adjustTooltipPosition() {
    const trigger = this.getTriggerEl();
    if (!trigger || !this.tooltipEl) return;

    const container = this.getContainer();
    const isBody = container === document.body;

    const tRect = trigger.getBoundingClientRect();
    const tipRect = this.tooltipEl.getBoundingClientRect();
    const cRect = isBody ? ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight } as DOMRect) : container.getBoundingClientRect();

    const scrollTop = isBody ? window.pageYOffset : container.scrollTop;
    const scrollLeft = isBody ? window.pageXOffset : container.scrollLeft;

    const baseTop = tRect.top - cRect.top + scrollTop;
    const baseLeft = tRect.left - cRect.left + scrollLeft;

    const OFFSET_TB = 10; // vertical gap for top/bottom
    const TARGET_SIDE_GAP = 8; // desired gap for left/right

    const spaceAbove = tRect.top;
    const spaceBelow = window.innerHeight - tRect.bottom;
    const spaceLeft = tRect.left;
    const spaceRight = window.innerWidth - tRect.right;

    let pos: TooltipPosition = this.resolvePosition();

    if (pos === 'auto') {
      const maxSpace = Math.max(spaceAbove, spaceBelow, spaceLeft, spaceRight);
      if (maxSpace === spaceAbove) pos = 'top';
      else if (maxSpace === spaceBelow) pos = 'bottom';
      else if (maxSpace === spaceLeft) pos = 'left';
      else pos = 'right';
    }

    // Flip if needed
    switch (pos) {
      case 'top':
        if (tipRect.height + OFFSET_TB > spaceAbove && spaceBelow > spaceAbove) pos = 'bottom';
        break;
      case 'bottom':
        if (tipRect.height + OFFSET_TB > spaceBelow && spaceAbove > spaceBelow) pos = 'top';
        break;
      case 'left':
        if (tipRect.width > spaceLeft && spaceRight > spaceLeft) pos = 'right';
        break;
      case 'right':
        if (tipRect.width > spaceRight && spaceLeft > spaceRight) pos = 'left';
        break;
    }

    let top = 0;
    let left = 0;

    // Initial placement
    if (pos === 'top') {
      top = baseTop - tipRect.height - OFFSET_TB;
      left = baseLeft + tRect.width / 2 - tipRect.width / 2;
    } else if (pos === 'bottom') {
      top = baseTop + tRect.height + OFFSET_TB;
      left = baseLeft + tRect.width / 2 - tipRect.width / 2;
    } else if (pos === 'left') {
      top = baseTop + tRect.height / 2 - tipRect.height / 2;
      left = baseLeft - tipRect.width;
    } else {
      // right
      top = baseTop + tRect.height / 2 - tipRect.height / 2;
      left = baseLeft + tRect.width;
    }

    // Write initial coords
    this.tooltipEl.style.top = `${top}px`;
    this.tooltipEl.style.left = `${left}px`;

    // Normalize the left/right gap exactly to TARGET_SIDE_GAP
    const after = this.tooltipEl.getBoundingClientRect();

    if (pos === 'left') {
      const actualGap = tRect.left - after.right;
      const delta = TARGET_SIDE_GAP - actualGap;
      if (Math.abs(delta) > 0.2) {
        left -= delta;
        this.tooltipEl.style.left = `${left}px`;
      }
    } else if (pos === 'right') {
      const actualGap = after.left - tRect.right;
      const delta = TARGET_SIDE_GAP - actualGap;
      if (Math.abs(delta) > 0.2) {
        left += delta;
        this.tooltipEl.style.left = `${left}px`;
      }
    }

    // Direction classes
    this.tooltipEl.classList.remove('tooltip-top', 'tooltip-bottom', 'tooltip-left', 'tooltip-right');
    this.tooltipEl.classList.add(`tooltip-${pos}`);

    // ---- Arrow positioning ----
    const tipNow = this.tooltipEl.getBoundingClientRect();
    const ARROW_HALF = 5;

    if (this.arrowEl) {
      this.arrowEl.style.opacity = '1';
      this.arrowEl.style.display = 'block';

      if (pos === 'top' || pos === 'bottom') {
        const desiredLeft = tRect.left + tRect.width / 2 - tipNow.left - ARROW_HALF;
        const clamped = Math.max(6, Math.min(desiredLeft, tipNow.width - 6 - ARROW_HALF * 2));
        this.arrowEl.style.left = `${clamped}px`;
        this.arrowEl.style.top = pos === 'top' ? `${tipNow.height - ARROW_HALF}px` : `${-ARROW_HALF}px`;
      } else {
        const desiredTop = tRect.top + tRect.height / 2 - tipNow.top - ARROW_HALF;
        const clamped = Math.max(6, Math.min(desiredTop, tipNow.height - 6 - ARROW_HALF * 2));
        this.arrowEl.style.top = `${clamped}px`;
        this.arrowEl.style.left = pos === 'left' ? `${tipNow.width - ARROW_HALF}px` : `${-ARROW_HALF}px`;
      }
    }
  }

  render() {
    return <slot></slot>;
  }
}
