// ========================================
// File: src/components/progress/progress-display-component.tsx
// ========================================
import { Component, Prop, State, Watch, h, Element } from '@stencil/core';

type BarItem = {
  value: number;
  max?: number;
  variant?: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark';
  striped?: boolean;
  animated?: boolean;
  precision?: number;
  progressAlign?: '' | 'left' | 'right';
  showProgress?: boolean;
  showValue?: boolean;
};

@Component({
  tag: 'progress-display-component',
  shadow: false,
})
export class ProgressDisplayComponent {
  @Element() el!: HTMLElement;

  /** Immutable public API */
  @Prop() animated: boolean = false;

  /** Accepts JSON string (HTML attr) or array (JS) */
  @Prop() bars:
    | Array<{
        value: number;
        max?: number;
        variant?: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark';
        striped?: boolean;
        animated?: boolean;
        precision?: number;
        progressAlign?: '' | 'left' | 'right';
        showProgress?: boolean;
        showValue?: boolean;
      }>
    | string = [];

  @Prop() circular: boolean = false;
  @Prop() height: number = 20;

  /** NEW: optional label text (single bar primarily) */
  @Prop() label: string = '';

  @Prop() lineCap: boolean = false;
  @Prop() max: number = 100;
  @Prop() multi: boolean = false;
  @Prop() precision: number = 0;
  @Prop() progressAlign: '' | 'left' | 'right' = '';
  @Prop() rotate?: number;
  @Prop() showProgress: boolean = false;
  @Prop() showValue: boolean = false;
  @Prop() size: number = 80;
  @Prop() indeterminate: boolean = false;
  @Prop() striped: boolean = false;
  @Prop() styles: string = '';

  /**
   * When true (and no user-provided slots), the component will emit label
   * as an internal <span slot="bar-0">...</span> nested inside .progress-label.
   * This is only for markup compatibility with multi-bar examples.
   */
  @Prop() useNamedBar0: boolean = false;

  @Prop() value: number = 0;
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';
  @Prop({ attribute: 'width' }) strokeWidth: number = 4;

  /** Internal mirror of `bars` to avoid mutating props */
  @State() private normalizedBars: BarItem[] = [];

  componentWillLoad() {
    this.normalizedBars = this.normalizeBars(this.bars);
  }

  @Watch('bars')
  onBarsChange(newVal: BarItem[] | string) {
    this.normalizedBars = this.normalizeBars(newVal);
  }

  private normalizeBars(input: BarItem[] | string): BarItem[] {
    if (Array.isArray(input)) return input;
    if (typeof input !== 'string') return [];
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.warn('[progress-display] Invalid JSON for "bars" attribute.');
      return [];
    }
  }

  private getColorBg(variant: BarItem['variant']): string {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary';
      case 'success':
        return 'bg-success';
      case 'danger':
        return 'bg-danger';
      case 'info':
        return 'bg-info';
      case 'warning':
        return 'bg-warning';
      case 'dark':
        return 'bg-dark';
      default:
        return 'bg-primary';
    }
  }

  private getColorText(variant: BarItem['variant']): string {
    switch (variant) {
      case 'primary':
        return 'primary-text';
      case 'secondary':
        return 'secondary-text';
      case 'success':
        return 'success-text';
      case 'danger':
        return 'danger-text';
      case 'info':
        return 'info-text';
      case 'warning':
        return 'warning-text';
      case 'dark':
        return 'dark-text';
      default:
        return 'primary-text';
    }
  }

  /** Default slot content exists (no slot attr) */
  private hasDefaultSlotContent(): boolean {
    const nodes = Array.from(this.el.childNodes) as ChildNode[];
    return nodes.some((n: ChildNode) => {
      if (n.nodeType === Node.TEXT_NODE) return !!n.textContent?.trim();
      if (n.nodeType !== Node.ELEMENT_NODE) return false;

      const el = n as HTMLElement;
      const slotName = el.getAttribute('slot');
      return slotName === null || slotName === '';
    });
  }

  /** Named slot content exists (slot="bar-0", slot="bar-1", etc.) */
  private hasNamedSlotContent(name: string): boolean {
    return !!this.el.querySelector(`[slot="${name}"]`);
  }

  /**
   * Linear mode compatibility:
   * If consumer uses <span slot="bar-0">...</span> (common if they share markup with multi),
   * render that named slot inside the single bar.
   */
  private getLinearSlotName(): string | null {
    return this.hasNamedSlotContent('bar-0') ? 'bar-0' : null;
  }

  private renderCircular() {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const safeMax = this.max > 0 ? this.max : 1;
    const ratio = Math.min(Math.max(this.value / safeMax, 0), 1);
    const offset = circumference - ratio * circumference;
    const cxCy = radius + this.strokeWidth / 2;
    const viewBox = cxCy * 2;

    const styleSize = this.size ? { height: `${this.size}px`, width: `${this.size}px` } : undefined;
    const rotateStyle = { transform: `rotate(${this.rotate ?? 0}deg)` };
    const blackText = this.variant === 'warning' ? { color: '#000' } : undefined;

    const infoText = this.showProgress
      ? `${(ratio * 100).toFixed(this.precision)}%`
      : this.showValue && this.value > 0 && this.value < safeMax
      ? `${(this.value / 2).toFixed(this.precision)}%`
      : '';

    return (
      <div
        class={
          'progress-circular ' +
          (this.indeterminate ? 'progress-circular-spin progress-circular-visible ' : '') +
          this.getColorText(this.variant)
        }
        style={styleSize}
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax={String(this.max)}
        aria-valuenow={String(this.value)}
      >
        {this.indeterminate ? (
          <svg viewBox={`0 0 ${viewBox} ${viewBox}`} style={rotateStyle as any}>
            <circle
              fill="transparent"
              cx={cxCy}
              cy={cxCy}
              r={radius}
              class="progress-circular-overlay"
              stroke-width={this.strokeWidth}
              stroke-dasharray={String(circumference)}
              stroke-dashoffset={String(offset)}
            />
          </svg>
        ) : (
          <svg viewBox={`0 0 ${viewBox} ${viewBox}`} style={rotateStyle as any}>
            <circle
              fill="transparent"
              cx={cxCy}
              cy={cxCy}
              r={radius}
              stroke-width={this.strokeWidth}
              stroke-dasharray={String(circumference)}
              stroke-dashoffset="0"
              class="progress-circular-underlay"
            />
            <circle
              cx={cxCy}
              cy={cxCy}
              r={radius}
              class="progress-circular-overlay"
              stroke-width={this.strokeWidth}
              stroke-dasharray={String(circumference)}
              stroke-dashoffset={String(offset)}
              style={{ 'stroke-linecap': this.lineCap ? 'square' : 'round' } as any}
            />
          </svg>
        )}
        <div class="progress-circular-info" style={blackText as any}>
          {infoText}
        </div>
      </div>
    );
  }

  private renderMulti() {
    const bars = this.normalizedBars;

    return (
      <div class="linear-progress" style={{ height: `${this.height}px` }}>
        {bars.map((bar, index) => {
          const barMax = bar.max ?? this.max;
          const liRatio = barMax > 0 ? Math.min(Math.max(bar.value / barMax, 0), 1) : 0;

          const barCls =
            `progress-bar ${this.getColorBg(bar.variant ?? '')}` +
            (bar.striped ? ' progress-bar-striped' : '') +
            (bar.animated ? ' progress-bar-animated' : '');

          const text =
            bar.showProgress
              ? `${(liRatio * 100).toFixed(bar.precision ?? this.precision)}%`
              : bar.showValue && bar.value > 0 && bar.value < barMax
              ? `${(bar.value / 2).toFixed(bar.precision ?? this.precision)}%`
              : null;

          const slotName = `bar-${index}`;
          const hasSlot = this.hasNamedSlotContent(slotName);
          const showSideBySide = hasSlot && text !== null;

          const order: Array<'slot' | 'text'> = bar.progressAlign === 'right' ? ['text', 'slot'] : ['slot', 'text'];

          return (
            <div
              class={barCls}
              style={{ width: `${bar.value}%` }}
              role="progressbar"
              aria-valuenow={String(bar.value)}
              aria-valuemin="0"
              aria-valuemax={String(barMax)}
            >
              {showSideBySide ? (
                <span class="progress-inline">
                  {order.map(part =>
                    part === 'slot' ? (
                      <span class="progress-label">
                        <slot name={slotName} />
                      </span>
                    ) : (
                      <span class="progress-text">{text}</span>
                    )
                  )}
                </span>
              ) : (
                [
                  bar.progressAlign === 'left' ? <slot name={slotName} /> : null,
                  text !== null ? <span class="progress-text">{text}</span> : <slot name={slotName} />,
                  bar.progressAlign === 'right' ? <slot name={slotName} /> : null,
                ]
              )}
            </div>
          );
        })}
      </div>
    );
  }

  private renderLinear() {
    const safeMax = this.max > 0 ? this.max : 1;
    const ratio = Math.min(Math.max(this.value / safeMax, 0), 1);

    const cls =
      `progress-bar ${this.getColorBg(this.variant)}` +
      (this.striped ? ' progress-bar-striped' : '') +
      (this.animated ? ' progress-bar-animated' : '');

    const text =
      this.showProgress
        ? `${(ratio * 100).toFixed(this.precision)}%`
        : this.showValue && this.value > 0 && this.value < safeMax
        ? `${(this.value / 2).toFixed(this.precision)}%`
        : null;

    const containerStyle: any = { height: `${this.height}px` };
    if (this.styles) {
      this.styles.split(';').forEach(pair => {
        const [k, v] = pair.split(':').map(s => s && s.trim());
        if (k && v) containerStyle[k as any] = v;
      });
    }

    const labelText = (this.label ?? '').trim();

    // Slot precedence:
    // 1) explicit bar-0
    // 2) default slot (including text nodes)
    // 3) label prop
    const linearNamed = this.getLinearSlotName(); // 'bar-0' | null
    const hasDefault = this.hasDefaultSlotContent();

    const shouldInjectNamedFromLabel = !!labelText && this.useNamedBar0 && !linearNamed && !hasDefault;

    const hasAnyLabel = !!linearNamed || hasDefault || !!labelText;

    const LabelNode = () => {
      if (linearNamed) return <slot name={linearNamed} />;
      if (hasDefault) return <slot />;
      if (shouldInjectNamedFromLabel) return <span slot="bar-0">{labelText}</span>;
      if (labelText) return labelText;
      return null;
    };

    const showSideBySide = hasAnyLabel && text !== null;
    const order: Array<'label' | 'text'> = this.progressAlign === 'right' ? ['text', 'label'] : ['label', 'text'];

    return (
      <div class="linear-progress" style={containerStyle}>
        <div
          class={cls}
          role="progressbar"
          style={{ width: `${this.value}%` }}
          aria-valuenow={String(this.value)}
          aria-valuemin="0"
          aria-valuemax={String(this.max)}
        >
          {showSideBySide ? (
            <span class="progress-inline">
              {order.map(part =>
                part === 'label' ? (
                  <span class="progress-label">
                    <LabelNode />
                  </span>
                ) : (
                  <span class="progress-text">{text}</span>
                )
              )}
            </span>
          ) : (
            [
              // if no % text, just render label if present
              hasAnyLabel ? (
                <span class="progress-label">
                  <LabelNode />
                </span>
              ) : null,
              // if no label, but we *do* have text, render text
              !hasAnyLabel && text !== null ? <span class="progress-text">{text}</span> : null,
            ]
          )}
        </div>
      </div>
    );
  }

  render() {
    if (this.circular) return this.renderCircular();
    if (this.multi) return this.renderMulti();
    return this.renderLinear();
  }
}
