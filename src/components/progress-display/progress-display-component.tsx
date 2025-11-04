// ========================================
// File: src/components/progress/progress-display-component.tsx
// ========================================
import { Component, Prop, State, Watch, h } from '@stencil/core';

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
  @Prop() value: number = 0;
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';
  @Prop({ attribute: 'width' }) strokeWidth: number = 4;

  /** Internal mirror of `bars` to avoid mutating props */
  @State() private normalizedBars: BarItem[] = [];

  // lifecycle
  componentWillLoad() {
    this.normalizedBars = this.normalizeBars(this.bars);
  }

  @Watch('bars')
  onBarsChange(newVal: BarItem[] | string) {
    this.normalizedBars = this.normalizeBars(newVal);
  }

  // helpers
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
      case 'primary': return 'bg-primary';
      case 'secondary': return 'bg-secondary';
      case 'success': return 'bg-success';
      case 'danger': return 'bg-danger';
      case 'info': return 'bg-info';
      case 'warning': return 'bg-warning';
      case 'dark': return 'bg-dark';
      default: return 'bg-primary';
    }
  }

  private getColorText(variant: BarItem['variant']): string {
    switch (variant) {
      case 'primary': return 'primary-text';
      case 'secondary': return 'secondary-text';
      case 'success': return 'success-text';
      case 'danger': return 'danger-text';
      case 'info': return 'info-text';
      case 'warning': return 'warning-text';
      case 'dark': return 'dark-text';
      default: return 'primary-text';
    }
  }

  // renders
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

    const infoText =
      this.showProgress ? `${(ratio * 100).toFixed(this.precision)}%`
      : this.showValue && this.value > 0 && this.value < safeMax ? `${(this.value / 2).toFixed(this.precision)}%`
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
        <div class="progress-circular-info" style={blackText as any}>{infoText}</div>
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
            bar.showProgress ? `${(liRatio * 100).toFixed(bar.precision ?? this.precision)}%`
            : bar.showValue && bar.value > 0 && bar.value < barMax
            ? `${(bar.value / 2).toFixed(bar.precision ?? this.precision)}%`
            : null;

          return (
            <div
              class={barCls}
              style={{ width: `${bar.value}%` }}
              role="progressbar"
              aria-valuenow={String(bar.value)}
              aria-valuemin="0"
              aria-valuemax={String(barMax)}
            >
              {bar.progressAlign === 'left' ? <slot name={`bar-${index}`} /> : null}
              {text !== null ? <span class="progress-text">{text}</span> : <slot name={`bar-${index}`} />}
              {bar.progressAlign === 'right' ? <slot name={`bar-${index}`} /> : null}
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
      this.showProgress ? `${(ratio * 100).toFixed(this.precision)}%`
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
          {this.progressAlign === 'right' ? <slot /> : null}
          {text !== null ? <span class="progress-text">{text}</span> : <slot />}
          {this.progressAlign === 'left' ? <slot /> : null}
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
