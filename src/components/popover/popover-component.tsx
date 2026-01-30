// src/components/popover/popover-component.tsx
import { Component, Prop, Element, Listen } from '@stencil/core';
import type { Instance as PopperInstance, Placement as PopperPlacement, Modifier, VirtualElement } from '@popperjs/core';
import { createPopper } from '@popperjs/core';

// Local alias for internal use only (not used in @Prop types)
type PlacementU = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start' | 'left-start' | 'left-end' | 'right-start' | 'right-end';

@Component({
  tag: 'popover-component',
  shadow: false,
})
export class PopoverComponent {
  @Element() el!: HTMLElement;

  @Prop() arrowOff: boolean = false;
  @Prop() customClass: string = '';
  @Prop({ attribute: 'title' }) popoverTitle: string = '';
  @Prop() content: string = `Default popover content. Use the 'content' attribute to change this text.`;

  @Prop() placement:
    | 'auto'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end' = 'auto';

  @Prop() plumage: boolean = false;
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';
  @Prop({ mutable: true, reflect: true }) visible: boolean = false;
  @Prop({ attribute: 'super' }) superTooltip: boolean = false;

  @Prop() trigger: 'click' | 'hover' | 'focus' | `${'click' | 'hover' | 'focus'} ${'click' | 'hover' | 'focus'}` = 'click';

  @Prop() fallbackPlacement:
    | 'flip'
    | 'clockwise'
    | 'counterclockwise'
    | 'auto'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'bottom-end'
    | 'bottom-start'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end'
    | Array<
        | 'flip'
        | 'clockwise'
        | 'counterclockwise'
        | 'auto'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-end'
        | 'top-start'
        | 'bottom-end'
        | 'bottom-start'
        | 'left-start'
        | 'left-end'
        | 'right-start'
        | 'right-end'
      > = 'flip';

  /** Extra distance away from trigger (main axis). */
  @Prop() offset: number = 0;

  /**
   * Cross-axis nudge.
   * Note: Popper uses "skidding" (cross-axis). This is not strictly "Y" for top/bottom.
   */
  @Prop() yOffset: number = 0;

  /** String id or direct HTMLElement */
  @Prop() target?: string | HTMLElement;

  private popoverId = `popover_${Math.random().toString(36).slice(2, 11)}`;
  private popoverEl: HTMLDivElement | null = null;
  private triggerEl: HTMLElement | null = null;
  private originatingTrigger: HTMLElement | null = null;

  private popper: PopperInstance | null = null;

  // -----------------------------
  // Events / triggers
  // -----------------------------
  private onTriggerClick = (ev: Event) => {
    ev.preventDefault();
    this.originatingTrigger = ev.currentTarget as HTMLElement;
    this.togglePopover();
    if (this.visible && this.popoverEl) this.popoverEl.focus({ preventScroll: true });
  };

  private onTriggerKeydown = (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.originatingTrigger = ev.currentTarget as HTMLElement;
      this.togglePopover();
      if (this.visible && this.popoverEl) this.popoverEl.focus({ preventScroll: true });
    }
  };

  private onMouseEnter = () => this.showPopover();
  private onMouseLeave = () => this.hidePopover();
  private onFocus = () => this.showPopover();
  private onBlur = () => {
    document.addEventListener('click', this.onOutsideClick, true);
  };

  private onFocusOut = (ev: FocusEvent) => {
    const rel = ev.relatedTarget as Node | null;
    if (this.triggerEl && (!rel || !this.triggerEl.contains(rel))) this.hidePopover();
  };

  private onOutsideClick = (ev: Event) => {
    if (!this.visible || !this.popoverEl || !this.triggerEl) return;
    const t = ev.target as Node;
    if (!this.popoverEl.contains(t) && !this.triggerEl.contains(t)) this.hidePopover();
  };

  private onKeyDown = (ev: KeyboardEvent) => {
    if (!this.visible || !this.popoverEl) return;

    if (ev.key === 'Escape') {
      this.hidePopover();
      return;
    }

    if (ev.key === 'Tab') {
      const f = Array.from(this.popoverEl.querySelectorAll<HTMLElement>('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'));
      if (f.length === 0) return;

      const first = f[0];
      const last = f[f.length - 1];

      if (ev.shiftKey) {
        if (document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          ev.preventDefault();
          this.originatingTrigger?.focus({ preventScroll: true });
          this.hidePopover();
        }
      }
    }
  };

  // Popper's eventListeners modifier already updates on scroll/resize.
  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.popper?.update();
  }

  componentDidLoad() {
    this.setTriggerElement();
    if (this.triggerEl) this.applyTriggers();
    else console.error('Trigger element not found');
  }

  disconnectedCallback() {
    this.removeTriggers();
    this.destroyPopper();
    this.removePopover();
    document.removeEventListener('click', this.onOutsideClick, true);
  }

  private setTriggerElement() {
    if (this.target) {
      if (typeof this.target === 'string') this.triggerEl = document.getElementById(this.target);
      else if (this.target instanceof HTMLElement) this.triggerEl = this.target;
    } else {
      this.triggerEl = (Array.from(this.el.children).find(n => n.nodeType === 1) as HTMLElement) || null;
    }
    if (!this.triggerEl) return;

    const originalTitle = this.el.getAttribute('data-original-title');
    if (originalTitle) this.popoverTitle = originalTitle;

    if (!this.triggerEl.hasAttribute('tabindex')) this.triggerEl.setAttribute('tabindex', '0');
    this.triggerEl.setAttribute('aria-describedby', this.popoverId);
  }

  private applyTriggers() {
    if (!this.triggerEl) return;
    const set = this.trigger.split(' ');

    if (set.includes('click')) {
      this.triggerEl.addEventListener('click', this.onTriggerClick);
      this.triggerEl.addEventListener('keydown', this.onTriggerKeydown);
    }
    if (set.includes('hover')) {
      this.triggerEl.addEventListener('mouseenter', this.onMouseEnter);
      this.triggerEl.addEventListener('mouseleave', this.onMouseLeave);
    }
    if (set.includes('focus')) {
      this.triggerEl.addEventListener('focus', this.onFocus);
      this.triggerEl.addEventListener('blur', this.onBlur);
    }
    if (set.includes('hover') || set.includes('focus')) {
      this.triggerEl.addEventListener('focusout', this.onFocusOut);
    }
  }

  private removeTriggers() {
    if (!this.triggerEl) return;
    this.triggerEl.removeEventListener('click', this.onTriggerClick);
    this.triggerEl.removeEventListener('keydown', this.onTriggerKeydown);
    this.triggerEl.removeEventListener('mouseenter', this.onMouseEnter);
    this.triggerEl.removeEventListener('mouseleave', this.onMouseLeave);
    this.triggerEl.removeEventListener('focus', this.onFocus);
    this.triggerEl.removeEventListener('blur', this.onBlur);
    this.triggerEl.removeEventListener('focusout', this.onFocusOut);
  }

  private togglePopover() {
    this.visible = !this.visible;
    if (this.visible) this.showPopover();
    else this.hidePopover();
  }

  private showPopover() {
    this.visible = true;
    this.createPopoverElement();
    this.createOrUpdatePopper();

    window.requestAnimationFrame(() => {
      this.popper?.update();
      if (this.trigger === 'click' && this.popoverEl) this.popoverEl.focus({ preventScroll: true });
    });

    if (this.popoverEl) {
      if (this.trigger.includes('hover') || this.trigger.includes('focus')) {
        this.popoverEl.querySelectorAll('[tabindex]').forEach(el => el.removeAttribute('tabindex'));
      } else {
        this.popoverEl.addEventListener('keydown', this.onKeyDown);
      }
    }

    document.addEventListener('click', this.onOutsideClick, true);
  }

  private hidePopover() {
    this.visible = false;
    this.destroyPopper();
    this.removePopover();
    document.removeEventListener('click', this.onOutsideClick, true);
    this.originatingTrigger?.focus({ preventScroll: true });
  }

  // -----------------------------
  // Content (Option A: template slot support)
  // -----------------------------
  /**
   * Option A: Support rich HTML content via:
   *   <template slot="content">...</template>
   * This avoids the slotted element rendering in the document.
   *
   * We also allow a non-template marker with slot="content" for compatibility,
   * but stories/docs should prefer <template>.
   */
  private getSlottedContentSource(): HTMLTemplateElement | HTMLElement | null {
    const node = this.el.querySelector('[slot="content"]') as HTMLElement | null;
    if (!node) return null;
    return node as any;
  }

  private applyBodyContent(bodyEl: HTMLElement) {
    const src = this.getSlottedContentSource();

    if (src) {
      // Prefer template (does not render visually)
      if (src.tagName === 'TEMPLATE') {
        bodyEl.innerHTML = (src as HTMLTemplateElement).innerHTML;
        return;
      }

      // Fallback: if someone uses <div slot="content">...</div>
      // (this will render in the DOM since shadow:false and render() is null)
      bodyEl.innerHTML = (src as HTMLElement).innerHTML;
      return;
    }

    // Default string prop
    bodyEl.innerHTML = this.content ?? '';
  }

  // -----------------------------
  // DOM
  // -----------------------------
  private getColor(variant: string) {
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

  private createPopoverElement() {
    if (this.popoverEl) return;

    const el = document.createElement('div');
    el.id = this.popoverId;

    // Bootstrap-like base classing. Popper will set data-popper-placement.
    el.classList.add('popover', 'fade', 'show');
    if (this.plumage) el.classList.add('plumage');
    if (this.superTooltip) el.classList.add('super-tooltip');

    const v = this.getColor(this.variant);
    if (v) el.classList.add(v);
    if (this.customClass) el.classList.add(...this.customClass.split(' ').filter(Boolean));

    el.setAttribute('role', 'tooltip');

    // Let Popper handle inline positioning.
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.left = '0';

    if (!(this.trigger.includes('hover') || this.trigger.includes('focus'))) el.setAttribute('tabindex', '-1');

    const arrowHtml = this.arrowOff ? '' : '<div class="popover-arrow" data-popper-arrow></div>';
    const headerHtml = this.popoverTitle ? `<h3 class="popover-header">${this.popoverTitle}</h3>` : '';
    const bodyTab = !(this.trigger.includes('hover') || this.trigger.includes('focus')) ? 'tabindex="0"' : '';

    // Create skeleton first, then apply content so we can pull from slot/template.
    el.innerHTML = `
      ${arrowHtml}
      ${headerHtml}
      <div class="popover-body" ${bodyTab}></div>
    `;

    document.body.appendChild(el);
    this.popoverEl = el;

    // Apply content (Option A)
    const bodyEl = this.popoverEl.querySelector('.popover-body') as HTMLElement | null;
    if (bodyEl) this.applyBodyContent(bodyEl);
  }

  private removePopover() {
    if (!this.popoverEl) return;
    this.popoverEl.removeEventListener('keydown', this.onKeyDown);
    this.popoverEl.parentNode?.removeChild(this.popoverEl);
    this.popoverEl = null;
  }

  // -----------------------------
  // Popper positioning (Bootstrap-like)
  // -----------------------------
  private toPopperPlacement(p: PlacementU): PopperPlacement {
    switch (p) {
      case 'auto':
        return 'auto';
      case 'top':
        return 'top';
      case 'bottom':
        return 'bottom';
      case 'left':
        return 'left';
      case 'right':
        return 'right';
      case 'top-start':
        return 'top-start';
      case 'top-end':
        return 'top-end';
      case 'bottom-start':
        return 'bottom-start';
      case 'bottom-end':
        return 'bottom-end';
      case 'left-start':
        return 'left-start';
      case 'left-end':
        return 'left-end';
      case 'right-start':
        return 'right-start';
      case 'right-end':
        return 'right-end';
      default:
        return 'auto';
    }
  }

  private buildFallbackPlacements(base: PopperPlacement): PopperPlacement[] | undefined {
    const raw = this.fallbackPlacement;
    const list = Array.isArray(raw) ? raw : [raw];

    const asPlacements = list.filter(v => v !== 'flip' && v !== 'clockwise' && v !== 'counterclockwise').map(v => this.toPopperPlacement(v as PlacementU));

    if (asPlacements.length) return asPlacements;

    const order: PopperPlacement[] = ['top', 'right', 'bottom', 'left', 'top-start', 'top-end', 'right-start', 'right-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end'];

    const wantsClock = list.includes('clockwise');
    const wantsCounter = list.includes('counterclockwise');

    if (wantsClock || wantsCounter) {
      const idx = Math.max(0, order.indexOf(base));
      const seq = order.slice(idx + 1).concat(order.slice(0, idx));
      return wantsCounter ? seq.reverse() : seq;
    }

    // Default Popper flip behavior when 'flip'
    return undefined;
  }

  /**
   * Popper reference resolution:
   * - If trigger is a native <button>, use it (no behavior change).
   * - If trigger is a custom element (e.g. <button-component>), try to use its
   *   internal real button/role=button element (often inside shadow DOM),
   *   so Popper positions relative to the actual visual button box.
   */
  private getPopperReference(): HTMLElement | VirtualElement {
    const host = this.triggerEl;
    if (!host) return { getBoundingClientRect: () => new DOMRect(0, 0, 0, 0) };

    // Native button: do not change anything
    if (host instanceof HTMLButtonElement || host.tagName.toLowerCase() === 'button') {
      return host;
    }

    // Only try special handling for custom elements (tag contains "-")
    const isCustomElement = host.tagName.includes('-');
    if (!isCustomElement) return host;

    // 1) Prefer an internal button inside open shadow root (Stencil components are typically open)
    const shadow = (host as any).shadowRoot as ShadowRoot | null;
    const shadowRef = shadow?.querySelector<HTMLElement>('button, [part~="button"], [part~="trigger"], [role="button"], .btn') ?? null;
    if (shadowRef) return shadowRef;

    // 2) Fallback: something in light DOM (if their component renders a real button there)
    const lightRef = host.querySelector<HTMLElement>('button, [part~="button"], [role="button"], .btn') ?? null;
    if (lightRef) return lightRef;

    // 3) Last resort: use host (current behavior)
    return host;
  }

  private createOrUpdatePopper() {
    if (!this.triggerEl || !this.popoverEl) return;

    const placement = this.toPopperPlacement(this.placement as PlacementU);

    // Offset modifier:
    // - distance (main axis): 10 + offset
    // - skidding (cross-axis): yOffset
    const distance = 10 + (Number(this.offset) || 0);
    const skidding = Number(this.yOffset) || 0;

    const fallbackPlacements = this.buildFallbackPlacements(placement);
    const arrowEl = this.arrowOff ? null : (this.popoverEl.querySelector('[data-popper-arrow]') as HTMLElement | null);

    const modifiers: Array<Partial<Modifier<string, any>>> = [
      { name: 'eventListeners', enabled: true },
      { name: 'offset', options: { offset: [skidding, distance] } },
      { name: 'flip', options: { fallbackPlacements } },
      { name: 'preventOverflow', options: { padding: 8 } },
      {
        name: 'applyPlacementAttr',
        enabled: true,
        phase: 'write',
        fn: ({ state }) => {
          state.elements.popper.setAttribute('data-popper-placement', state.placement);
        },
      },
    ];

    if (arrowEl) {
      modifiers.push({ name: 'arrow', options: { element: arrowEl, padding: 6 } });
    }

    // ✅ Use the resolved reference for Popper positioning
    const reference = this.getPopperReference();

    if (this.popper) {
      this.popper.setOptions({
        placement,
        modifiers: modifiers as any,
        strategy: 'absolute',
      });

      // If the reference element changes (e.g., upgraded component), recreate Popper
      // because Popper's reference element is fixed at creation.
      try {
        const currentRef = this.popper.state.elements.reference;
        if (currentRef !== reference) {
          this.destroyPopper();
          this.popper = createPopper(reference as any, this.popoverEl, {
            placement,
            strategy: 'absolute',
            modifiers: modifiers as any,
          });
        }
      } catch {
        // ignore
      }

      return;
    }

    this.popper = createPopper(reference as any, this.popoverEl, {
      placement,
      strategy: 'absolute',
      modifiers: modifiers as any,
    });
  }

  private destroyPopper() {
    if (!this.popper) return;
    this.popper.destroy();
    this.popper = null;
  }

  render() {
    return null;
  }
}
