// src/components/popover/popover-component.tsx
import { Component, Prop, Element, Listen } from '@stencil/core';

// Local aliases for internal use only (not used in @Prop types)
type PlacementU = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'topright' | 'topleft' | 'bottomright' | 'bottomleft' | 'lefttop' | 'leftbottom' | 'righttop' | 'rightbottom';

// type FallbackU = 'flip' | 'clockwise' | 'counterclockwise';

@Component({
  tag: 'popover-component',
  shadow: false,
})
export class PopoverComponent {
  @Element() el!: HTMLElement;

  // Public API — use inline unions directly in @Prop types (no aliases)
  @Prop() arrowOff: boolean = false;
  @Prop() customClass: string = '';
  /** Keep external attribute name `title`, but avoid reserved prop name. */
  @Prop({ attribute: 'title' }) popoverTitle: string = '';
  @Prop() content: string = `Default popover content. Use the 'content' attribute to change this text.`;

  // Inline union here (no alias usage)
  @Prop() placement: 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'topright' | 'topleft' | 'bottomright' | 'bottomleft' | 'lefttop' | 'leftbottom' | 'righttop' | 'rightbottom' =
    'auto';

  @Prop() plumage: boolean = false;
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';
  @Prop({ mutable: true, reflect: true }) visible: boolean = false;
  /** Lit's `super` -> internal `superTooltip`, attribute remains `super`. */
  @Prop({ attribute: 'super' }) superTooltip: boolean = false;

  @Prop() trigger: 'click' | 'hover' | 'focus' | `${'click' | 'hover' | 'focus'} ${'click' | 'hover' | 'focus'}` = 'click';

  // Inline unions (and inline array) here as well
  @Prop() fallbackPlacement:
    | 'flip'
    | 'clockwise'
    | 'counterclockwise'
    | 'auto'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'topright'
    | 'topleft'
    | 'bottomright'
    | 'bottomleft'
    | 'lefttop'
    | 'leftbottom'
    | 'righttop'
    | 'rightbottom'
    | Array<
        | 'flip'
        | 'clockwise'
        | 'counterclockwise'
        | 'auto'
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'topright'
        | 'topleft'
        | 'bottomright'
        | 'bottomleft'
        | 'lefttop'
        | 'leftbottom'
        | 'righttop'
        | 'rightbottom'
      > = 'flip';

  @Prop() offset: number = 0;
  @Prop() yOffset: number = 0;
  /** String id or direct HTMLElement */
  @Prop() target?: string | HTMLElement;

  private popoverId = `popover_${Math.random().toString(36).slice(2, 11)}`;
  private popoverEl: HTMLDivElement | null = null;
  private triggerEl: HTMLElement | null = null;
  private originatingTrigger: HTMLElement | null = null;

  // Handlers (arrows so add/remove match)
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
      const first = f[0],
        last = f[f.length - 1];
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

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.adjustPopoverPosition();
  }

  componentDidLoad() {
    this.setTriggerElement();
    if (this.triggerEl) this.applyTriggers();
    else console.error('Trigger element not found');
  }

  disconnectedCallback() {
    this.removeTriggers();
    this.removePopover();
    document.removeEventListener('click', this.onOutsideClick, true);
  }

  // Trigger resolution
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

  // Show / hide
  private togglePopover() {
    this.visible = !this.visible;
    this.visible ? this.showPopover() : this.hidePopover();
  }

  private showPopover() {
    this.visible = true;
    this.createPopoverElement();
    requestAnimationFrame(() => {
      this.adjustPopoverPosition();
      if (this.trigger === 'click' && this.popoverEl) {
        this.popoverEl.focus({ preventScroll: true });
      }
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
    this.removePopover();
    document.removeEventListener('click', this.onOutsideClick, true);
    this.originatingTrigger?.focus({ preventScroll: true });
  }

  // DOM
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
  private getPopoverContent() {
    return this.popoverTitle;
  }

  private createPopoverElement() {
    if (this.popoverEl) return;
    const el = document.createElement('div');
    el.id = this.popoverId;
    el.classList.add('popover', `popover-${this.placement}`, 'fade', 'show');
    if (this.plumage) el.classList.add('plumage');
    if (this.superTooltip) el.classList.add('super-tooltip');
    el.setAttribute('role', 'tooltip');
    el.setAttribute('data-popover-placement', this.placement);
    if (!(this.trigger.includes('hover') || this.trigger.includes('focus'))) el.setAttribute('tabindex', '-1');

    const arrowHtml = this.arrowOff ? '' : '<div class="popover-arrow"></div>';
    const headerHtml = this.popoverTitle ? `<h3 class="popover-header">${this.getPopoverContent()}</h3>` : '';
    const bodyTab = !(this.trigger.includes('hover') || this.trigger.includes('focus')) ? 'tabindex="0"' : '';
    el.innerHTML = `
      ${arrowHtml}
      ${headerHtml}
      <div class="popover-body" ${bodyTab}>${this.content}</div>
    `;
    document.body.appendChild(el);
    this.popoverEl = el;
  }

  private removePopover() {
    if (!this.popoverEl) return;
    this.popoverEl.removeEventListener('keydown', this.onKeyDown);
    this.popoverEl.parentNode?.removeChild(this.popoverEl);
    this.popoverEl = null;
  }

  // Positioning
  // Positioning
  private adjustPopoverPosition() {
    if (!this.triggerEl || !this.popoverEl || !this.visible) return;

    const triggerRect = this.triggerEl.getBoundingClientRect();
    const popRect = this.popoverEl.getBoundingClientRect();
    const arrow = this.popoverEl.querySelector('.popover-arrow') as HTMLElement | null;
    const baseOffset = 10 + this.offset;
    let top = 0,
      left = 0;

    const setClassForPlacement = (placement: PlacementU) => {
      const map: Record<PlacementU | 'auto', string> = {
        top: 'popover-top',
        bottom: 'popover-bottom',
        left: 'popover-left',
        right: 'popover-right',
        topright: 'popover-topright',
        topleft: 'popover-topleft',
        bottomright: 'popover-bottomright',
        bottomleft: 'popover-bottomleft',
        lefttop: 'popover-lefttop',
        leftbottom: 'popover-leftbottom',
        righttop: 'popover-righttop',
        rightbottom: 'popover-rightbottom',
        auto: 'popover-bottom',
      };
      const v = this.getColor(this.variant);
      this.popoverEl!.className =
        `popover fade show ${map[placement]}${this.plumage ? ' plumage' : ''}${this.superTooltip ? ' super-tooltip' : ''}` +
        `${v ? ` ${v}` : ''}${this.customClass ? ` ${this.customClass}` : ''}`;
      this.popoverEl!.setAttribute('data-popover-placement', placement);
    };

    const compute = (p: PlacementU) => {
      setClassForPlacement(p);
      switch (p) {
        case 'top':
          top = triggerRect.top - popRect.height - baseOffset;
          left = triggerRect.left + (triggerRect.width - popRect.width) / 2;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow top';
          break;
        case 'bottom':
          top = triggerRect.bottom + baseOffset;
          left = triggerRect.left + (triggerRect.width - popRect.width) / 2;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow bottom';
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - popRect.height) / 2;
          left = triggerRect.left - popRect.width - baseOffset;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow left';
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - popRect.height) / 2;
          left = triggerRect.right + baseOffset;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow right';
          break;
        case 'topright':
          top = triggerRect.top - popRect.height - baseOffset;
          left = triggerRect.left - popRect.width + triggerRect.width;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow topright';
          break;
        case 'topleft':
          top = triggerRect.top - popRect.height - baseOffset;
          left = triggerRect.left;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow topleft';
          break;
        case 'bottomright':
          top = triggerRect.bottom + baseOffset;
          left = triggerRect.left - popRect.width + triggerRect.width;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow bottomright';
          break;
        case 'bottomleft':
          top = triggerRect.bottom + baseOffset;
          left = triggerRect.left;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow bottomleft';
          break;
        case 'lefttop':
          top = triggerRect.bottom - popRect.height + this.yOffset;
          left = triggerRect.left - popRect.width - baseOffset;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow lefttop';
          break;
        case 'leftbottom':
          top = triggerRect.top + this.yOffset;
          left = triggerRect.left - popRect.width - baseOffset;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow leftbottom';
          break;
        case 'righttop':
          top = triggerRect.bottom - popRect.height + this.yOffset;
          left = triggerRect.right + baseOffset;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow righttop';
          break;
        case 'rightbottom':
          top = triggerRect.top + this.yOffset;
          left = triggerRect.right + baseOffset;
          if (!this.arrowOff && arrow) arrow.className = 'popover-arrow rightbottom';
          break;
        case 'auto':
        default:
          // handled below; leave values as-is
          break;
      }
    };

    const inViewport = (t: number, l: number) => {
      const vw = window.innerWidth,
        vh = window.innerHeight;
      return t >= 0 && l >= 0 && t + popRect.height <= vh && l + popRect.width <= vw;
    };

    const tryAuto = () => {
      const vw = window.innerWidth,
        vh = window.innerHeight;
      const spaces = {
        top: triggerRect.top,
        bottom: vh - triggerRect.bottom,
        left: triggerRect.left,
        right: vw - triggerRect.right,
      };
      // Sort sides by available space (desc)
      const sides = (Object.keys(spaces) as Array<'top' | 'bottom' | 'left' | 'right'>).sort((a, b) => spaces[b] - spaces[a]);

      // Expand each side with its corner variants (most forgiving first)
      const expand = (side: 'top' | 'bottom' | 'left' | 'right'): PlacementU[] => {
        switch (side) {
          case 'top':
            return ['top', 'topleft', 'topright'];
          case 'bottom':
            return ['bottom', 'bottomleft', 'bottomright'];
          case 'left':
            return ['left', 'lefttop', 'leftbottom'];
          case 'right':
            return ['right', 'righttop', 'rightbottom'];
        }
      };

      const candidates: PlacementU[] = [];
      for (const s of sides) candidates.push(...expand(s));

      // Try candidates until one fully fits
      for (const c of candidates) {
        compute(c);
        if (inViewport(top, left)) return true;
      }
      // Fallback to the side with maximum space
      compute(expand(sides[0])[0]);
      return false;
    };

    if (this.placement === 'auto') {
      tryAuto();
    } else {
      // base placement as requested
      compute(this.placement as PlacementU);

      // fallback logic if clipped
      if (!inViewport(top, left)) {
        const list = Array.isArray(this.fallbackPlacement) ? this.fallbackPlacement : [this.fallbackPlacement];
        const seq: PlacementU[] = ['top', 'topright', 'righttop', 'right', 'rightbottom', 'bottomright', 'bottom', 'bottomleft', 'leftbottom', 'left', 'lefttop', 'topleft'];
        for (const fb of list) {
          if (fb === 'flip') {
           const opposite: Record<Exclude<PlacementU, 'auto'>, Exclude<PlacementU, 'auto'>> = {
              top: 'bottom',
              bottom: 'top',
              left: 'right',
              right: 'left',
              topleft: 'bottomleft',
              topright: 'bottomright',
              bottomleft: 'topleft',
              bottomright: 'topright',
              lefttop: 'righttop',
              leftbottom: 'rightbottom',
              righttop: 'lefttop',
              rightbottom: 'leftbottom',
             } as any;
            // we're in the non-`auto` branch, so this cast is safe
            const p = this.placement as Exclude<PlacementU, 'auto'>;
            compute(opposite[p] || 'bottom');
            if (inViewport(top, left)) break;
          } else if (fb === 'clockwise' || fb === 'counterclockwise') {
            const start = Math.max(0, seq.indexOf(this.placement as PlacementU));
            const dir = fb === 'clockwise' ? 1 : -1;
            for (let i = 1; i < seq.length; i++) {
              const next = seq[(start + i * dir + seq.length) % seq.length]!;
              compute(next);
              if (inViewport(top, left)) break;
            }
          } else {
            compute(fb as PlacementU);
            if (inViewport(top, left)) break;
          }
        }
      }
    }

    this.popoverEl.style.top = `${top + window.scrollY}px`;
    this.popoverEl.style.left = `${left + window.scrollX}px`;
  }

  // light DOM only
  render() {
    return null;
  }
}
