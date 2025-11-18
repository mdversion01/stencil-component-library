// src/components/svg/svg-component.tsx
import { Component, h, Prop, Element, Watch } from '@stencil/core';

@Component({
  tag: 'svg-component',
  shadow: true,
})
export class SvgComponent {
  @Element() host!: HTMLElement;

  /** Fill color applied to slotted <svg>. Defaults to 'currentColor'. */
  @Prop() fill: string = 'currentColor';

  /** Width applied to slotted <svg> (px). Omit/0 to leave as-is. */
  @Prop() width?: number;

  /** Height applied to slotted <svg> (px). Omit/0 to leave as-is. */
  @Prop() height?: number;

  /**
   * Forwarded to the slotted <svg> as aria-hidden.
   * Use "true" or "false". Using a different prop name avoids clashing with HTMLElement.ariaHidden.
   */
  @Prop() svgAriaHidden?: 'true' | 'false';

  /** Forwarded to the slotted <svg> as aria-label (avoids clashing with HTMLElement.ariaLabel). */
  @Prop() svgAriaLabel?: string;

  /** Optional margin wrapper around the slotted <svg>: '', 'left', or 'right'. */
  @Prop() svgMargin: '' | 'left' | 'right' = '';

  // ---- watchers -------------------------------------------------------------

  @Watch('fill')
  onFill() {
    this.updateFill();
  }

  @Watch('width')
  @Watch('height')
  onDim() {
    this.updateDimensions();
  }

  @Watch('svgAriaHidden')
  @Watch('svgAriaLabel')
  onAria() {
    this.updateAria();
  }

  @Watch('svgMargin')
  onMargin() {
    this.wrapSvgWithSpan();
  }

  // ---- DOM helpers ----------------------------------------------------------

  private getSlot(): HTMLSlotElement | null {
    return this.host.shadowRoot?.querySelector('slot') as HTMLSlotElement | null;
  }

  // private getAssignedSvgs(): SVGElement[] {
  //   const slot = this.getSlot();
  //   if (!slot) return [];
  //   const nodes = slot.assignedNodes({ flatten: true }) as Node[];
  //   return nodes.filter((n): n is SVGElement => (n as Element)?.tagName?.toLowerCase() === 'svg');
  // }

  private getFirstSlottedSvg(): SVGElement | null {
    const slot = this.getSlot();
    if (!slot) return null;

    const nodes = slot.assignedNodes({ flatten: true }) as Node[];

    // 1) direct svg node
    const direct = nodes.find((n): n is SVGElement => (n as Element)?.tagName?.toLowerCase() === 'svg');
    if (direct) return direct;

    // 2) svg inside assigned element (e.g., our span wrapper)
    for (const n of nodes) {
      if ((n as Element)?.nodeType === 1) {
        const found = (n as Element).querySelector('svg');
        if (found) return found as SVGElement;
      }
    }
    return null;
  }

  private updateFill() {
    const svg = this.getFirstSlottedSvg();
    if (!svg) return;
    svg.setAttribute('fill', this.fill ?? 'currentColor');
  }

  private updateDimensions() {
    const svg = this.getFirstSlottedSvg();
    if (!svg) return;
    if (this.width && this.width > 0) svg.setAttribute('width', String(this.width));
    if (this.height && this.height > 0) svg.setAttribute('height', String(this.height));
  }

  private updateAria() {
    const svg = this.getFirstSlottedSvg();
    if (!svg) return;

    if (this.svgAriaHidden === 'true' || this.svgAriaHidden === 'false') {
      svg.setAttribute('aria-hidden', this.svgAriaHidden);
    } else {
      svg.removeAttribute('aria-hidden');
    }

    const label = (this.svgAriaLabel ?? '').trim();
    if (label) svg.setAttribute('aria-label', label);
    else svg.removeAttribute('aria-label');
  }

  /** Idempotently wraps the first slotted <svg> in a margin span if requested. */
  private wrapSvgWithSpan() {
    const slot = this.getSlot();
    if (!slot) return;

    const applyWrap = () => {
      const svg = this.getFirstSlottedSvg();
      if (!svg) return;

      const parent = svg.parentElement;

      // No margin requested: unwrap if wrapped
      if (!this.svgMargin) {
        if (parent && (parent.classList.contains('mr-1') || parent.classList.contains('ml-1'))) {
          const gp = parent.parentNode;
          if (gp) {
            gp.insertBefore(svg, parent);
            parent.remove();
          }
        }
        return;
      }

      const wantClass = this.svgMargin === 'left' ? 'mr-1' : 'ml-1';

      // Already wrapped: flip class in place
      if (parent && (parent.classList.contains('mr-1') || parent.classList.contains('ml-1'))) {
        parent.classList.remove('mr-1', 'ml-1');
        parent.classList.add(wantClass);
        return;
      }

      // Not wrapped: wrap now
      const span = document.createElement('span');
      span.classList.add(wantClass);
      const p = svg.parentNode!;
      p.insertBefore(span, svg);
      span.appendChild(svg);
    };

    applyWrap();
    slot.removeEventListener('slotchange', applyWrap);
    slot.addEventListener('slotchange', applyWrap);
  }

  // ---- lifecycle ------------------------------------------------------------

  componentDidLoad() {
    this.updateFill();
    this.updateDimensions();
    this.updateAria();
    this.wrapSvgWithSpan();
  }

  render() {
    // no internal styles needed; margin classes assumed globally (e.g. Tailwind ml-1/mr-1)
    return <slot />;
  }
}
