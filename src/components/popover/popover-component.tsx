// src/components/popover/popover-component.tsx
import { Component, Prop, Element, Listen, Watch } from '@stencil/core';
import type { Instance as PopperInstance, Placement as PopperPlacement, Modifier, VirtualElement } from '@popperjs/core';
import { createPopper } from '@popperjs/core';

type PlacementU =
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
  | 'right-end';

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

  /** Cross-axis nudge (Popper skidding). */
  @Prop() yOffset: number = 0;

  /** String id or direct HTMLElement */
  @Prop() target?: string | HTMLElement;

  // --- a11y overrides (consumer-controlled) ---
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  private popoverId = `popover_${Math.random().toString(36).slice(2, 11)}`;
  private popoverEl: HTMLDivElement | null = null;
  private triggerEl: HTMLElement | null = null;
  private originatingTrigger: HTMLElement | null = null;

  private popper: PopperInstance | null = null;

  private get isTooltipMode(): boolean {
    const set = this.trigger.split(' ');
    // Tooltip-like semantics only when click is NOT part of the trigger set.
    return set.includes('hover') || set.includes('focus') ? !set.includes('click') : false;
  }

  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }

  private mergeIdLists(a?: string, b?: string): string | undefined {
    const aa = this.normalizeIdList(a);
    const bb = this.normalizeIdList(b);
    if (!aa && !bb) return undefined;
    if (aa && !bb) return aa;
    if (!aa && bb) return bb;
    const merged = `${aa} ${bb}`.trim().split(/\s+/);
    return Array.from(new Set(merged)).join(' ');
  }

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
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.originatingTrigger = ev.currentTarget as HTMLElement;
      this.togglePopover();
      if (this.visible && this.popoverEl) this.popoverEl.focus({ preventScroll: true });
    }
    if (ev.key === 'Escape') {
      if (this.visible) {
        ev.preventDefault();
        this.hidePopover();
      }
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
      ev.preventDefault();
      this.hidePopover();
      return;
    }

    // Only trap Tab when in click/popover mode (interactive)
    if (!this.isTooltipMode && ev.key === 'Tab') {
      const f = Array.from(
        this.popoverEl.querySelectorAll<HTMLElement>(
          'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
        ),
      );
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

  @Watch('visible')
  onVisibleChange() {
    this.syncTriggerA11y();
    this.syncPopoverA11y();
  }

  componentDidLoad() {
    this.setTriggerElement();
    if (this.triggerEl) {
      this.applyTriggers();
      this.syncTriggerA11y();
    } else {
      // eslint-disable-next-line no-console
      console.error('Trigger element not found');
    }

    // If rendered initially visible, create and sync
    if (this.visible) {
      this.showPopover();
    }
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
      if (!this.isTooltipMode && this.popoverEl) this.popoverEl.focus({ preventScroll: true });
    });

    if (this.popoverEl) {
      // Tooltip mode: make popover non-interactive by stripping tabbables inside
      if (this.isTooltipMode) {
        this.popoverEl.querySelectorAll('[tabindex]').forEach(n => n.removeAttribute('tabindex'));
        this.popoverEl.removeEventListener('keydown', this.onKeyDown);
      } else {
        this.popoverEl.addEventListener('keydown', this.onKeyDown);
      }
    }

    document.addEventListener('click', this.onOutsideClick, true);
    this.syncTriggerA11y();
    this.syncPopoverA11y();
  }

  private hidePopover() {
    this.visible = false;
    this.destroyPopper();
    this.removePopover();
    document.removeEventListener('click', this.onOutsideClick, true);
    this.originatingTrigger?.focus({ preventScroll: true });
    this.syncTriggerA11y();
  }

  // -----------------------------
  // Content (slot/template support)
  // -----------------------------
  private getSlottedContentSource(): HTMLTemplateElement | HTMLElement | null {
    const node = this.el.querySelector('[slot="content"]') as HTMLElement | null;
    if (!node) return null;
    return node as any;
  }

  private applyBodyContent(bodyEl: HTMLElement) {
    const src = this.getSlottedContentSource();

    if (src) {
      if (src.tagName === 'TEMPLATE') {
        bodyEl.innerHTML = (src as HTMLTemplateElement).innerHTML;
        return;
      }
      bodyEl.innerHTML = (src as HTMLElement).innerHTML;
      return;
    }

    bodyEl.innerHTML = this.content ?? '';
  }

  // -----------------------------
  // A11y wiring
  // -----------------------------
  private syncTriggerA11y() {
    if (!this.triggerEl) return;

    // Always: indicate a popup relationship (popover/tooltip)
    this.triggerEl.setAttribute('aria-haspopup', this.isTooltipMode ? 'false' : 'dialog');

    // Click/popover mode: controls + expanded
    if (!this.isTooltipMode) {
      this.triggerEl.setAttribute('aria-controls', this.popoverId);
      this.triggerEl.setAttribute('aria-expanded', this.visible ? 'true' : 'false');

      // If consumer passed describedby on the trigger (rare), don't stomp it; only ensure the popover relationship via controls.
      this.triggerEl.removeAttribute('aria-describedby');
      return;
    }

    // Tooltip mode: describedby (content is the description)
    this.triggerEl.removeAttribute('aria-controls');
    this.triggerEl.removeAttribute('aria-expanded');

    const merged = this.mergeIdLists(this.triggerEl.getAttribute('aria-describedby') || undefined, this.popoverId);
    if (merged) this.triggerEl.setAttribute('aria-describedby', merged);
  }

  private syncPopoverA11y() {
    if (!this.popoverEl) return;

    const titleId = `${this.popoverId}-title`;
    const bodyId = `${this.popoverId}-body`;

    const header = this.popoverEl.querySelector('.popover-header') as HTMLElement | null;
    const body = this.popoverEl.querySelector('.popover-body') as HTMLElement | null;

    if (header) header.id = titleId;
    if (body) body.id = bodyId;

    // Tooltip vs dialog semantics
    if (this.isTooltipMode) {
      this.popoverEl.setAttribute('role', 'tooltip');
      this.popoverEl.setAttribute('aria-hidden', this.visible ? 'false' : 'true');
      this.popoverEl.removeAttribute('aria-modal');

      // Tooltip labeling: let AT announce body; title is not typically used for tooltips.
      this.popoverEl.removeAttribute('aria-label');
      this.popoverEl.removeAttribute('aria-labelledby');
      this.popoverEl.removeAttribute('aria-describedby');
      return;
    }

    // Popover (interactive): role dialog, not modal
    this.popoverEl.setAttribute('role', 'dialog');
    this.popoverEl.setAttribute('aria-modal', 'false');
    this.popoverEl.removeAttribute('aria-hidden');

    const userLabel = (this.ariaLabel ?? '').trim() || undefined;
    const userLabelledBy = this.normalizeIdList(this.ariaLabelledby);
    const userDescribedBy = this.normalizeIdList(this.ariaDescribedby);

    const autoLabelledBy = header ? titleId : undefined;
    const autoLabel = !autoLabelledBy && this.popoverTitle ? this.popoverTitle : undefined;

    const ariaLabelledBy = userLabelledBy ?? autoLabelledBy;
    const ariaLabel = ariaLabelledBy ? undefined : userLabel ?? autoLabel;

    // Describe by body (and optionally consumer extra ids)
    const describedBy = this.mergeIdLists(userDescribedBy, body ? bodyId : undefined);

    if (ariaLabelledBy) this.popoverEl.setAttribute('aria-labelledby', ariaLabelledBy);
    else this.popoverEl.removeAttribute('aria-labelledby');

    if (ariaLabel) this.popoverEl.setAttribute('aria-label', ariaLabel);
    else this.popoverEl.removeAttribute('aria-label');

    if (describedBy) this.popoverEl.setAttribute('aria-describedby', describedBy);
    else this.popoverEl.removeAttribute('aria-describedby');
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

    el.classList.add('popover', 'fade', 'show');
    if (this.plumage) el.classList.add('plumage');
    if (this.superTooltip) el.classList.add('super-tooltip');

    const v = this.getColor(this.variant);
    if (v) el.classList.add(v);
    if (this.customClass) el.classList.add(...this.customClass.split(' ').filter(Boolean));

    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.left = '0';

    // Focus target only for click/popover mode
    if (!this.isTooltipMode) el.setAttribute('tabindex', '-1');

    const arrowHtml = this.arrowOff ? '' : '<div class="popover-arrow" data-popper-arrow></div>';
    const headerHtml = this.popoverTitle ? `<h3 class="popover-header"></h3>` : '';
    const bodyTab = !this.isTooltipMode ? 'tabindex="0"' : '';

    el.innerHTML = `
      ${arrowHtml}
      ${headerHtml}
      <div class="popover-body" ${bodyTab}></div>
    `;

    // Set header text safely
    const headerEl = el.querySelector('.popover-header') as HTMLElement | null;
    if (headerEl && this.popoverTitle) headerEl.textContent = this.popoverTitle;

    document.body.appendChild(el);
    this.popoverEl = el;

    const bodyEl = this.popoverEl.querySelector('.popover-body') as HTMLElement | null;
    if (bodyEl) this.applyBodyContent(bodyEl);

    this.syncPopoverA11y();
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

    return undefined;
  }

  private getPopperReference(): HTMLElement | VirtualElement {
    const host = this.triggerEl;
    if (!host) return { getBoundingClientRect: () => new DOMRect(0, 0, 0, 0) };

    if (host instanceof HTMLButtonElement || host.tagName.toLowerCase() === 'button') return host;

    const isCustomElement = host.tagName.includes('-');
    if (!isCustomElement) return host;

    const shadow = (host as any).shadowRoot as ShadowRoot | null;
    const shadowRef =
      shadow?.querySelector<HTMLElement>('button, [part~="button"], [part~="trigger"], [role="button"], .btn') ?? null;
    if (shadowRef) return shadowRef;

    const lightRef = host.querySelector<HTMLElement>('button, [part~="button"], [role="button"], .btn') ?? null;
    if (lightRef) return lightRef;

    return host;
  }

  private createOrUpdatePopper() {
    if (!this.triggerEl || !this.popoverEl) return;

    const placement = this.toPopperPlacement(this.placement as PlacementU);

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

    if (arrowEl) modifiers.push({ name: 'arrow', options: { element: arrowEl, padding: 6 } });

    const reference = this.getPopperReference();

    if (this.popper) {
      this.popper.setOptions({ placement, modifiers: modifiers as any, strategy: 'absolute' });

      try {
        const currentRef = this.popper.state.elements.reference;
        if (currentRef !== reference) {
          this.destroyPopper();
          this.popper = createPopper(reference as any, this.popoverEl, { placement, strategy: 'absolute', modifiers: modifiers as any });
        }
      } catch {
        // ignore
      }
      return;
    }

    this.popper = createPopper(reference as any, this.popoverEl, { placement, strategy: 'absolute', modifiers: modifiers as any });
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
