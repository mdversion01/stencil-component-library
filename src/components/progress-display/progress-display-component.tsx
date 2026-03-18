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

  /** Optional visible label text */
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

  // ----------------- a11y override props -----------------
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  /** Internal mirror of `bars` to avoid mutating props */
  @State() private normalizedBars: BarItem[] = [];

  private a11yIdBase = `progress_${Math.random().toString(36).slice(2, 11)}`;

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
      // eslint-disable-next-line no-console
      console.warn('[progress-display] Invalid JSON for "bars" attribute.');
      return [];
    }
  }

  private clamp(n: number, min: number, max: number): number {
    const nn = Number.isFinite(n) ? n : 0;
    return Math.min(Math.max(nn, min), max);
  }

  private safeMax(m?: number): number {
    const mm = m ?? this.max;
    return Number.isFinite(mm) && mm > 0 ? mm : 1;
  }

  private formatPercent(ratio: number, precision: number): string {
    const p = Number.isFinite(precision) ? precision : 0;
    return `${(this.clamp(ratio, 0, 1) * 100).toFixed(p)}%`;
  }

  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
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

  private getLinearSlotName(): string | null {
    return this.hasNamedSlotContent('bar-0') ? 'bar-0' : null;
  }

  // ----------------- a11y helpers -----------------

  private getLabelId(): string {
    return `${this.a11yIdBase}-label`;
  }

  private getGroupId(): string {
    return `${this.a11yIdBase}-group`;
  }

  private computeA11yForSingle(valuenow: number, valuemax: number, valuetext?: string) {
    const userLabelledBy = this.normalizeIdList(this.ariaLabelledby);
    const userLabel = (this.ariaLabel ?? '').trim() || undefined;
    const userDescribedBy = this.normalizeIdList(this.ariaDescribedby);

    const hasVisibleLabel = !!(this.label ?? '').trim();

    const autoLabelId = hasVisibleLabel ? this.getLabelId() : undefined;
    const ariaLabelledBy = userLabelledBy ?? autoLabelId;

    const ariaLabel = ariaLabelledBy ? undefined : userLabel ?? (hasVisibleLabel ? undefined : 'Progress');

    const attrs: Record<string, any> = {
      role: 'progressbar',
      'aria-describedby': userDescribedBy,
    };

    if (ariaLabelledBy) attrs['aria-labelledby'] = ariaLabelledBy;
    if (ariaLabel) attrs['aria-label'] = ariaLabel;

    if (this.indeterminate) {
      attrs['aria-busy'] = 'true';
      if (valuetext) attrs['aria-valuetext'] = valuetext;
      return attrs;
    }

    attrs['aria-valuemin'] = '0';
    attrs['aria-valuemax'] = String(valuemax);
    attrs['aria-valuenow'] = String(valuenow);
    if (valuetext) attrs['aria-valuetext'] = valuetext;

    return attrs;
  }

  private computeA11yForMultiGroup() {
    const userLabelledBy = this.normalizeIdList(this.ariaLabelledby);
    const userLabel = (this.ariaLabel ?? '').trim() || undefined;
    const userDescribedBy = this.normalizeIdList(this.ariaDescribedby);

    const hasVisibleLabel = !!(this.label ?? '').trim();
    const autoLabelId = hasVisibleLabel ? this.getLabelId() : undefined;

    const ariaLabelledBy = userLabelledBy ?? autoLabelId;
    const ariaLabel = ariaLabelledBy ? undefined : userLabel ?? (hasVisibleLabel ? undefined : 'Progress');

    const attrs: Record<string, any> = {
      role: 'group',
      id: this.getGroupId(),
      'aria-describedby': userDescribedBy,
    };

    if (ariaLabelledBy) attrs['aria-labelledby'] = ariaLabelledBy;
    if (ariaLabel) attrs['aria-label'] = ariaLabel;

    return attrs;
  }

  // ----------------- renders -----------------

  private renderCircular() {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;

    const safeMax = this.safeMax(this.max);
    const now = this.clamp(this.value, 0, safeMax);
    const ratio = now / safeMax;

    const offset = circumference - ratio * circumference;
    const cxCy = radius + this.strokeWidth / 2;
    const viewBox = cxCy * 2;

    const styleSize = this.size ? { height: `${this.size}px`, width: `${this.size}px` } : undefined;
    const rotateStyle = { transform: `rotate(${this.rotate ?? 0}deg)` };
    const blackText = this.variant === 'warning' ? { color: '#000' } : undefined;

    const valuetext = this.showProgress ? this.formatPercent(ratio, this.precision) : undefined;

    const infoText = this.showProgress
      ? this.formatPercent(ratio, this.precision)
      : this.showValue && now > 0 && now < safeMax
      ? `${(now / 2).toFixed(this.precision)}%`
      : '';

    const a11y = this.computeA11yForSingle(now, safeMax, valuetext);

    return (
      <div class="progress-root">
        {(this.label ?? '').trim() ? (
          <span id={this.getLabelId()} class="progress-a11y-label">
            {this.label}
          </span>
        ) : null}

        <div
          class={
            'progress-circular ' +
            (this.indeterminate ? 'progress-circular-spin progress-circular-visible ' : '') +
            this.getColorText(this.variant)
          }
          style={styleSize}
          {...a11y}
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

          <div class="progress-circular-info" style={blackText as any} aria-hidden="true">
            {infoText}
          </div>
        </div>
      </div>
    );
  }

  private renderMulti() {
    const bars = this.normalizedBars;
    const groupA11y = this.computeA11yForMultiGroup();

    return (
      <div class="progress-root" {...groupA11y}>
        {(this.label ?? '').trim() ? (
          <span id={this.getLabelId()} class="progress-a11y-label">
            {this.label}
          </span>
        ) : null}

        <div class="linear-progress" style={{ height: `${this.height}px` }}>
          {bars.map((bar, index) => {
            const barMax = this.safeMax(bar.max ?? this.max);
            const now = this.clamp(bar.value, 0, barMax);
            const liRatio = now / barMax;

            const barCls =
              `progress-bar ${this.getColorBg(bar.variant ?? '')}` +
              (bar.striped ? ' progress-bar-striped' : '') +
              (bar.animated ? ' progress-bar-animated' : '');

            const text =
              bar.showProgress
                ? this.formatPercent(liRatio, bar.precision ?? this.precision)
                : bar.showValue && now > 0 && now < barMax
                ? `${(now / 2).toFixed(bar.precision ?? this.precision)}%`
                : null;

            const slotName = `bar-${index}`;
            const hasSlot = this.hasNamedSlotContent(slotName);
            const showSideBySide = hasSlot && text !== null;

            const order = bar.progressAlign === 'right' ? ['text', 'slot'] : ['slot', 'text'];
            const ariaValueText = bar.showProgress ? this.formatPercent(liRatio, bar.precision ?? this.precision) : undefined;

            return (
              <div
                class={barCls}
                style={{ width: `${(liRatio * 100).toFixed(4)}%` }}
                role="progressbar"
                aria-valuenow={String(now)}
                aria-valuemin="0"
                aria-valuemax={String(barMax)}
                aria-valuetext={ariaValueText}
              >
                {showSideBySide ? (
                  <span class="progress-inline">
                    {order.map(part =>
                      part === 'slot' ? (
                        <span class="progress-label">
                          <slot name={slotName} />
                        </span>
                      ) : (
                        <span class="progress-text" aria-hidden="true">
                          {text}
                        </span>
                      ),
                    )}
                  </span>
                ) : (
                  [
                    bar.progressAlign === 'left' ? <slot name={slotName} /> : null,
                    text !== null ? (
                      <span class="progress-text" aria-hidden="true">
                        {text}
                      </span>
                    ) : (
                      <slot name={slotName} />
                    ),
                    bar.progressAlign === 'right' ? <slot name={slotName} /> : null,
                  ]
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private renderLinear() {
    const safeMax = this.safeMax(this.max);
    const now = this.clamp(this.value, 0, safeMax);
    const ratio = now / safeMax;

    const cls =
      `progress-bar ${this.getColorBg(this.variant)}` +
      (this.striped ? ' progress-bar-striped' : '') +
      (this.animated ? ' progress-bar-animated' : '');

    const text =
      this.showProgress
        ? this.formatPercent(ratio, this.precision)
        : this.showValue && now > 0 && now < safeMax
        ? `${(now / 2).toFixed(this.precision)}%`
        : null;

    const containerStyle: any = { height: `${this.height}px` };
    if (this.styles) {
      this.styles.split(';').forEach(pair => {
        const [k, v] = pair.split(':').map(s => s && s.trim());
        if (k && v) containerStyle[k as any] = v;
      });
    }

    const labelText = (this.label ?? '').trim();

    const linearNamed = this.getLinearSlotName();
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
    const order = this.progressAlign === 'right' ? ['text', 'label'] : ['label', 'text'];

    const valuetext = this.showProgress ? this.formatPercent(ratio, this.precision) : undefined;
    const a11y = this.computeA11yForSingle(now, safeMax, valuetext);

    return (
      <div class="progress-root">
        {labelText && !linearNamed && !hasDefault ? (
          <span id={this.getLabelId()} class="progress-a11y-label">
            {labelText}
          </span>
        ) : null}

        <div class="linear-progress" style={containerStyle}>
          <div class={cls} {...a11y} style={{ width: `${(ratio * 100).toFixed(4)}%` }}>
            {showSideBySide ? (
              <span class="progress-inline">
                {order.map(part =>
                  part === 'label' ? (
                    <span class="progress-label">
                      <LabelNode />
                    </span>
                  ) : (
                    <span class="progress-text" aria-hidden="true">
                      {text}
                    </span>
                  ),
                )}
              </span>
            ) : (
              [
                hasAnyLabel ? (
                  <span class="progress-label">
                    <LabelNode />
                  </span>
                ) : null,
                !hasAnyLabel && text !== null ? (
                  <span class="progress-text" aria-hidden="true">
                    {text}
                  </span>
                ) : null,
              ]
            )}
          </div>
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
