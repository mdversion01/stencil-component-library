// src/components/svg/svg-component.tsx
import { Component, Prop, Watch, Element, h } from '@stencil/core';

@Component({
  tag: 'svg-component',
  shadow: false,
})
export class SvgComponent {
  @Element() host!: HTMLElement;

  /** Fill color applied to the rendered <svg>. Defaults to 'currentColor'. */
  @Prop() fill: string = 'currentColor';

  /** Width in px. Default 24. */
  @Prop() width: number = 24;

  /** Height in px. Default 24. */
  @Prop() height: number = 24;

  /** SVG viewBox. MUST match the coordinate system of `path`. */
  @Prop() viewBox: string = '0 0 640 640';

  /**
   * Raw SVG markup (e.g. `<path d="..." />`).
   * Injected into the <svg> via innerHTML.
   */
  @Prop() path: string = '';

  /**
   * Optional margin applied inline to the <svg>.
   * - 'left'  => margin-left: 10px;
   * - 'right' => margin-right: 10px;
   * - 'both'  => both left and right 10px
   */
  @Prop() svgMargin: '' | 'left' | 'right' | 'both' = '';

  /**
   * Forwarded as aria-hidden on the <svg>.
   * Use: svg-aria-hidden="true" | "false"
   * If omitted, aria-hidden is not set.
   */
  @Prop() svgAriaHidden?: 'true' | 'false';

  /** Forwarded as aria-label on the <svg>. If omitted/empty, not set. */
  @Prop() svgAriaLabel?: string;

  private svgEl?: SVGSVGElement;

  // ---------------- watchers ----------------

  @Watch('fill')
  @Watch('width')
  @Watch('height')
  @Watch('viewBox')
  @Watch('svgMargin')
  @Watch('svgAriaHidden')
  @Watch('svgAriaLabel')
  syncAttrs() {
    this.applyAll();
  }

  @Watch('path')
  onPathChange() {
    this.applyPath();
  }

  // ---------------- apply helpers ----------------

  private applyPath() {
    if (!this.svgEl) return;
    this.svgEl.innerHTML = this.path || '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
  }

  private applyAll() {
    if (!this.svgEl) return;

    // fill + size + viewBox
    this.svgEl.setAttribute('fill', this.fill || 'currentColor');
    this.svgEl.setAttribute('width', String(this.width ?? 16));
    this.svgEl.setAttribute('height', String(this.height ?? 16));
    this.svgEl.setAttribute('viewBox', this.viewBox || '0 0 16 16');

    // margin
    this.svgEl.style.marginLeft = '';
    this.svgEl.style.marginRight = '';

    if (this.svgMargin === 'left' || this.svgMargin === 'both') {
      this.svgEl.style.marginLeft = '10px';
    }
    if (this.svgMargin === 'right' || this.svgMargin === 'both') {
      this.svgEl.style.marginRight = '10px';
    }

    // aria-hidden
    if (this.svgAriaHidden === 'true' || this.svgAriaHidden === 'false') {
      this.svgEl.setAttribute('aria-hidden', this.svgAriaHidden);
    } else {
      this.svgEl.removeAttribute('aria-hidden');
    }

    // aria-label (+ role for accessibility)
    const label = (this.svgAriaLabel ?? '').trim();
    if (label) {
      this.svgEl.setAttribute('aria-label', label);
      this.svgEl.setAttribute('role', 'img');
    } else {
      this.svgEl.removeAttribute('aria-label');
      this.svgEl.removeAttribute('role');
    }
  }

  componentDidLoad() {
    this.applyPath();
    this.applyAll();
  }

  render() {
    return <svg ref={el => (this.svgEl = el as SVGSVGElement)} xmlns="http://www.w3.org/2000/svg"></svg>;
  }
}
