// src/components/tooltip/tooltip-component.tsx
import { Component, h, Prop, Element, Method } from '@stencil/core';

export type TooltipPosition = 'auto' | 'top' | 'bottom' | 'left' | 'right';
export type TooltipVariant = '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark';

@Component({
  tag: 'tooltip-component',
  styleUrls: ['./tooltip-styles.scss', '../utilities-styles.scss'],
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

  /** Additional classes to apply to tooltip; can be a string */
  @Prop() customClass: string = '';

  /** Contextual color variant */
  @Prop() variant: TooltipVariant = '';

  // ------- internals -------
  private tooltipId = `tooltip_${Math.random().toString(36).substr(2, 9)}`;
  private tooltipEl: HTMLDivElement | null = null;
  private arrowEl: HTMLDivElement | null = null;

  private outsideClickHandler = (ev: Event) => this.handleOutsideClick(ev);
  private scrollHandler = () => this.handleScroll();
  private mo?: MutationObserver;

  // ---------- resolver helpers (Option A) ----------
  private resolvePosition(): TooltipPosition {
    return (this.host.getAttribute('data-placement') as TooltipPosition) || this.position;
  }
  private resolveHtml(): boolean {
    return this.host.hasAttribute('data-html') || this.htmlContent;
  }
  private resolveTitle(): string {
    return this.host.getAttribute('title') || this.host.getAttribute('data-original-title') || this.tooltipTitle || this.message || '';
  }
  private resolveTrigger(): string {
    return this.host.getAttribute('data-trigger') || this.trigger;
  }
  private resolveAnimation(): boolean {
    return this.host.hasAttribute('data-animation') ? this.host.getAttribute('data-animation') !== 'false' : this.animation;
  }
  private resolveContainer(): string | null | undefined {
    const v = this.host.getAttribute('data-container');
    return v !== null ? v : this.container ?? null;
  }
  private resolveCustomClass(): string {
    return this.host.getAttribute('data-custom-class') || this.customClass || '';
  }
  private resolveVariant(): TooltipVariant {
    return (this.host.getAttribute('data-variant') as TooltipVariant) || this.variant || '';
  }

  connectedCallback() {
    window.addEventListener('scroll', this.scrollHandler, true);
  }

  componentDidLoad() {
  this.applyTriggers();
  if (typeof MutationObserver !== 'undefined') {
    this.mo = new MutationObserver(() => this.applyTriggers());
    this.mo.observe(this.host, { childList: true, subtree: false });
  }
}

  disconnectedCallback() {
    window.removeEventListener('scroll', this.scrollHandler, true);
    document.removeEventListener('click', this.outsideClickHandler, true);
    this.removeTooltipElement();
    this.mo?.disconnect();
  }

  // ---------- public (manual) ----------
  @Method() async show(): Promise<void> {
    if (this.resolveTrigger().includes('manual')) this.showTooltip();
  }
  @Method() async hide(): Promise<void> {
    if (this.resolveTrigger().includes('manual')) this.hideTooltip();
  }

  // ---------- helpers ----------
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

    if (!triggerEl.hasAttribute('tabindex')) triggerEl.setAttribute('tabindex', '0');
    triggerEl.setAttribute('data-toggle', 'tooltip');
    triggerEl.setAttribute('data-placement', this.resolvePosition());
    triggerEl.setAttribute('aria-describedby', this.tooltipId);

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

  private handleScroll() {
    if (this.resolveTrigger().includes('click') && this.visible) this.hideTooltip();
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
    requestAnimationFrame(() => this.adjustTooltipPosition());
  }

  private hideTooltip() {
    this.visible = false;
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

    // Heuristic: auto-enable HTML if the content looks like markup
    const rawContent = this.getTooltipContent();
    const looksLikeHtml = /<[^>]+>/.test(rawContent.trim());
    const useHtml = this.resolveHtml() || looksLikeHtml;

    const tooltip = document.createElement('div');
    tooltip.id = this.tooltipId;
    tooltip.classList.add('tooltip', `tooltip-${position}`, 'fade', 'show');
    if (animate) tooltip.classList.add('animated');

    // absolute positioning
    tooltip.style.position = 'absolute';
    tooltip.style.top = '0px';
    tooltip.style.left = '0px';

    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-live', 'assertive');

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
    inner.id = `${this.tooltipId}-content`;
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

    // Match arrow color to inner background (if any)
    try {
      const bg = getComputedStyle(inner).backgroundColor || getComputedStyle(inner).color;
      if (bg) {
        arrow.style.backgroundColor = bg;
      }
    } catch {
      // ignore
    }
  }

  private removeTooltipElement() {
    if (!this.tooltipEl) return;
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
    const TARGET_SIDE_GAP = 8; // exact desired gap for left/right

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
      // Place flush (no gap), then normalize to TARGET_SIDE_GAP
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
        // center arrow horizontally
        const desiredLeft = tRect.left + tRect.width / 2 - tipNow.left - ARROW_HALF;
        const clamped = Math.max(6, Math.min(desiredLeft, tipNow.width - 6 - ARROW_HALF * 2));
        this.arrowEl.style.left = `${clamped}px`;
        this.arrowEl.style.top = pos === 'top' ? `${tipNow.height - ARROW_HALF}px` : `${-ARROW_HALF}px`;
      } else {
        // center arrow vertically
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
