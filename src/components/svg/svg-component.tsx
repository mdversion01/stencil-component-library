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
   * Optional explicit aria-hidden forwarded to <svg>.
   * Use: svg-aria-hidden="true" | "false"
   * If omitted, component computes aria-hidden based on `decorative` + labeling.
   */
  @Prop() svgAriaHidden?: 'true' | 'false';

  /** Optional accessible name: aria-label on the <svg>. */
  @Prop() svgAriaLabel?: string;

  /** Optional accessible name: aria-labelledby on the <svg> (space-separated ids). Takes precedence over aria-label. */
  @Prop({ attribute: 'svg-aria-labelledby' }) svgAriaLabelledby?: string;

  /** Optional description: aria-describedby on the <svg> (space-separated ids). */
  @Prop({ attribute: 'svg-aria-describedby' }) svgAriaDescribedby?: string;

  /**
   * Optional <title> element content for the SVG.
   * Use attribute: svg-title="Settings"
   */
  @Prop({ attribute: 'svg-title' }) svgTitle?: string;

  /**
   * Optional <desc> element content for the SVG.
   * Use attribute: svg-desc="Opens settings"
   */
  @Prop({ attribute: 'svg-desc' }) svgDesc?: string;

  /**
   * When true, forces decorative behavior: aria-hidden="true" and removes accessible name wiring.
   * If not set, component defaults to decorative when no accessible name is provided.
   */
  @Prop() decorative?: boolean;

  /**
   * Optional focus override.
   * - When true: sets tabindex="0" (keyboard focusable)
   * - When false: sets tabindex="-1"
   * - When omitted: decorative => -1, meaningful => no tabindex
   */
  @Prop() focusable?: boolean;

  private svgEl?: SVGSVGElement;
  private a11yBaseId = `svg_${Math.random().toString(36).slice(2, 11)}`;

  // ---------------- watchers ----------------

  @Watch('fill')
  @Watch('width')
  @Watch('height')
  @Watch('viewBox')
  @Watch('svgMargin')
  @Watch('svgAriaHidden')
  @Watch('svgAriaLabel')
  @Watch('svgAriaLabelledby')
  @Watch('svgAriaDescribedby')
  @Watch('svgTitle')
  @Watch('svgDesc')
  @Watch('decorative')
  @Watch('focusable')
  syncAttrs() {
    this.applyAll();
  }

  @Watch('path')
  onPathChange() {
    this.applyPathAndText();
  }

  // ---------------- helpers ----------------

  private static escapeText(s: string): string {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }

  private getTitleId(): string {
    return `${this.a11yBaseId}-title`;
  }

  private getDescId(): string {
    return `${this.a11yBaseId}-desc`;
  }

  private getDefaultPath(): string {
    return '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
  }

  private hasAccessibleName(): boolean {
    const labelledby = this.normalizeIdList(this.svgAriaLabelledby);
    if (labelledby) return true;

    const label = (this.svgAriaLabel ?? '').trim();
    if (label) return true;

    const title = (this.svgTitle ?? '').trim();
    if (title) return true;

    return false;
  }

  private computeDecorative(): boolean {
    // Explicit aria-hidden wins if present (compat).
    if (this.svgAriaHidden === 'true') return true;
    if (this.svgAriaHidden === 'false') return false;

    // Explicit decorative wins if provided.
    if (typeof this.decorative === 'boolean') return this.decorative;

    // Default: decorative when unnamed (icon-only).
    return !this.hasAccessibleName();
  }

  private applyPathAndText() {
    if (!this.svgEl) return;

    const titleText = (this.svgTitle ?? '').trim();
    const descText = (this.svgDesc ?? '').trim();

    const titleHtml = titleText ? `<title id="${this.getTitleId()}">${SvgComponent.escapeText(titleText)}</title>` : '';
    const descHtml = descText ? `<desc id="${this.getDescId()}">${SvgComponent.escapeText(descText)}</desc>` : '';

    const p = (this.path || '').trim() || this.getDefaultPath();
    this.svgEl.innerHTML = `${titleHtml}${descHtml}${p}`;
  }

  private applyAll() {
    if (!this.svgEl) return;

    // fill + size + viewBox
    this.svgEl.setAttribute('fill', this.fill || 'currentColor');
    this.svgEl.setAttribute('width', String(this.width ?? 24));
    this.svgEl.setAttribute('height', String(this.height ?? 24));
    this.svgEl.setAttribute('viewBox', this.viewBox || '0 0 640 640');
    this.svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // margin
    this.svgEl.style.marginLeft = '';
    this.svgEl.style.marginRight = '';
    if (this.svgMargin === 'left' || this.svgMargin === 'both') this.svgEl.style.marginLeft = '10px';
    if (this.svgMargin === 'right' || this.svgMargin === 'both') this.svgEl.style.marginRight = '10px';

    // Ensure content includes title/desc/path
    this.applyPathAndText();

    const isDecorative = this.computeDecorative();

    // Normalize user-provided ARIA
    const userLabelledBy = this.normalizeIdList(this.svgAriaLabelledby);
    const userLabel = (this.svgAriaLabel ?? '').trim() || undefined;
    const userDescribedBy = this.normalizeIdList(this.svgAriaDescribedby);

    const titleText = (this.svgTitle ?? '').trim();
    const descText = (this.svgDesc ?? '').trim();

    const titleId = titleText ? this.getTitleId() : undefined;
    const descId = descText ? this.getDescId() : undefined;

    // aria-hidden / role / name wiring
    if (isDecorative) {
      this.svgEl.setAttribute('aria-hidden', 'true');
      this.svgEl.removeAttribute('role');
      this.svgEl.removeAttribute('aria-label');
      this.svgEl.removeAttribute('aria-labelledby');
      this.svgEl.removeAttribute('aria-describedby');
      this.svgEl.setAttribute('focusable', 'false');
      this.svgEl.setAttribute('tabindex', '-1');
      return;
    }

    // meaningful
    this.svgEl.removeAttribute('aria-hidden');
    this.svgEl.setAttribute('role', 'img');

    // Accessible name precedence:
    // 1) aria-labelledby (user)
    // 2) aria-label (user)
    // 3) svgTitle (component-generated)
    if (userLabelledBy) {
      this.svgEl.setAttribute('aria-labelledby', userLabelledBy);
      this.svgEl.removeAttribute('aria-label');
    } else if (userLabel) {
      this.svgEl.setAttribute('aria-label', userLabel);
      this.svgEl.removeAttribute('aria-labelledby');
    } else if (titleId) {
      this.svgEl.setAttribute('aria-labelledby', titleId);
      this.svgEl.removeAttribute('aria-label');
    } else {
      // Last resort stable name to avoid unnamed graphics.
      this.svgEl.setAttribute('aria-label', 'Icon');
      this.svgEl.removeAttribute('aria-labelledby');
    }

    // Description precedence:
    // 1) user aria-describedby
    // 2) svgDesc id
    if (userDescribedBy) {
      this.svgEl.setAttribute('aria-describedby', userDescribedBy);
    } else if (descId) {
      this.svgEl.setAttribute('aria-describedby', descId);
    } else {
      this.svgEl.removeAttribute('aria-describedby');
    }

    // Focus
    this.svgEl.setAttribute('focusable', 'false');
    if (typeof this.focusable === 'boolean') {
      this.svgEl.setAttribute('tabindex', this.focusable ? '0' : '-1');
    } else {
      this.svgEl.removeAttribute('tabindex');
    }
  }

  componentDidLoad() {
    this.applyAll();
  }

  render() {
    return <svg ref={el => (this.svgEl = el as SVGSVGElement)} />;
  }
}
