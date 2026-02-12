// src/components/sliders/multi-range-slider-component.tsx
import { Component, Prop, Event, EventEmitter, h, Element, State, Watch } from '@stencil/core';

@Component({
  tag: 'multi-range-slider-component',
  shadow: false,
})
export class MultiRangeSliderComponent {
  @Element() host!: HTMLElement;

  @Prop() disabled: boolean = false;
  @Prop() hideTextBoxes: boolean = false;
  @Prop() hideLeftTextBox: boolean = false;
  @Prop() hideRightTextBox: boolean = false;

  @Prop() label: string = '';
  @Prop({ mutable: true }) lowerValue: number = 25;
  @Prop({ mutable: true }) upperValue: number = 75;

  @Prop() min: number = 0;
  @Prop() max: number = 100;

  @Prop() plumage: boolean = false;
  @Prop() sliderThumbLabel: boolean = false;

  @Prop() snapToTicks: boolean = false;
  /** Accepts array or JSON string in HTML */
  @Prop() tickValues: number[] | string = [];
  @Prop() tickLabels: boolean = false;

  @Prop() unit: string = '';
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';

  @State() private _ticks: number[] = [];

  private containerEl?: HTMLDivElement;
  private dragging: 'lower' | 'upper' | 'track' | null = null;

  @Event() rangeChange: EventEmitter<{ lowerValue: number; upperValue: number }>;

  componentWillLoad() {
    this._ticks = this.normalizeTicks(this.tickValues);
    this.enforceOrder();
  }

  disconnectedCallback() {
    this.removeDragListeners();
  }

  @Watch('tickValues')
  onTickValuesChange(v: number[] | string) {
    this._ticks = this.normalizeTicks(v);
  }

  @Watch('min')
  @Watch('max')
  onBoundsChange() {
    this.lowerValue = this.clamp(this.lowerValue, this.min, this.max);
    this.upperValue = this.clamp(this.upperValue, this.min, this.max);
    this.enforceOrder();
  }

  private normalizeTicks(input: number[] | string): number[] {
    if (Array.isArray(input)) return input.filter(n => typeof n === 'number');
    if (typeof input === 'string' && input.trim()) {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed.map(n => Number(n)).filter(n => !Number.isNaN(n)) : [];
      } catch {
        console.warn('[multi-range-slider-component] Invalid JSON for tickValues');
      }
    }
    return [];
  }

  private clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
  }

  private getColor(variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark') {
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

  private pctFromValue(v: number) {
    return Math.round(((v - this.min) / Math.max(1e-9, this.max - this.min)) * 100);
  }

  private enforceOrder() {
    if (this.lowerValue > this.upperValue) {
      const mid = (this.lowerValue + this.upperValue) / 2;
      this.lowerValue = mid;
      this.upperValue = mid;
    }
  }

  /**
   * Format numeric values with unit.
   * If unit is "$", prefix it (e.g. $125). Otherwise suffix (e.g. 125°F).
   */
  private formatWithUnit(n: number): string {
    const unit = String(this.unit ?? '').trim();
    const rounded = Math.round(n);

    if (!unit) return String(rounded);
    if (unit === '$') return `${unit}${rounded}`;

    return `${rounded}${unit}`;
  }

  // Keyboard
  private calculateIncrement(): number {
    if (this.snapToTicks && this._ticks.length > 1) {
      return Math.abs(this._ticks[1] - this._ticks[0]);
    }
    return 1;
  }

  private snapValueToTick(value: number): number {
    if (!this.snapToTicks || this._ticks.length === 0) return value;
    return this._ticks.reduce(
      (prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev),
      this._ticks[0] ?? this.min
    );
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) return;

    const inc = this.calculateIncrement();
    let changed = false;

    switch (event.key) {
      case 'ArrowUp':
        this.upperValue = this.clamp(this.upperValue + inc, this.min, this.max);
        this.upperValue = this.snapValueToTick(this.upperValue);
        if (this.upperValue <= this.lowerValue) this.upperValue = Math.min(this.max, this.lowerValue + inc);
        changed = true;
        break;
      case 'ArrowDown':
        this.upperValue = this.clamp(this.upperValue - inc, this.min, this.max);
        this.upperValue = this.snapValueToTick(this.upperValue);
        if (this.upperValue <= this.lowerValue) this.upperValue = Math.min(this.max, this.lowerValue + inc);
        changed = true;
        break;
      case 'ArrowRight':
        this.lowerValue = this.clamp(this.lowerValue + inc, this.min, this.max);
        this.lowerValue = this.snapValueToTick(this.lowerValue);
        if (this.lowerValue >= this.upperValue) this.lowerValue = Math.max(this.min, this.upperValue - inc);
        changed = true;
        break;
      case 'ArrowLeft':
        this.lowerValue = this.clamp(this.lowerValue - inc, this.min, this.max);
        this.lowerValue = this.snapValueToTick(this.lowerValue);
        if (this.lowerValue >= this.upperValue) this.lowerValue = Math.max(this.min, this.upperValue - inc);
        changed = true;
        break;
      case 'Home':
        this.lowerValue = this.min;
        this.upperValue = Math.max(this.min + inc, this.lowerValue + inc);
        changed = true;
        break;
      case 'End':
        this.upperValue = this.max;
        this.lowerValue = Math.min(this.max - inc, this.upperValue - inc);
        changed = true;
        break;
      default:
        return;
    }

    if (changed) {
      event.preventDefault();
      this.emitRange();
      const sel = event.key.startsWith('Arrow')
        ? event.key === 'ArrowLeft' || event.key === 'ArrowRight'
          ? '.slider-thumb-container.lower-thumb'
          : '.slider-thumb-container.upper-thumb'
        : null;
      if (sel) {
        const el = this.host.querySelector(sel);
        el?.classList.add('slider-thumb-container-active');
        setTimeout(() => el?.classList.remove('slider-thumb-container-active'), 120);
      }
    }
  };

  // Drag
  private addDragListeners() {
    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragStop);
  }
  private removeDragListeners() {
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragStop);
  }

  private onThumbMouseDown = (e: MouseEvent, which: 'lower' | 'upper') => {
    if (this.disabled) return;
    e.preventDefault();
    this.dragging = which;
    this.addDragListeners();
    const el = this.host.querySelector(`.slider-thumb-container.${which}-thumb`);
    el?.classList.add('slider-thumb-container-active');
  };

  private onDragMove = (e: MouseEvent) => {
    if (!this.dragging || !this.containerEl) return;
    const rect = this.containerEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const pct = x / Math.max(1, rect.width);
    let value = this.min + pct * (this.max - this.min);
    if (this.snapToTicks) value = this.snapValueToTick(value);

    if (this.dragging === 'lower') {
      this.lowerValue = this.clamp(Math.min(value, this.upperValue), this.min, this.max);
    } else if (this.dragging === 'upper') {
      this.upperValue = this.clamp(Math.max(value, this.lowerValue), this.min, this.max);
    }
    this.emitRange();
  };

  private onDragStop = () => {
    const lower = this.host.querySelector('.slider-thumb-container.lower-thumb');
    const upper = this.host.querySelector('.slider-thumb-container.upper-thumb');
    lower?.classList.remove('slider-thumb-container-active');
    upper?.classList.remove('slider-thumb-container-active');
    this.dragging = null;
    this.removeDragListeners();
  };

  private emitRange() {
    this.rangeChange.emit({ lowerValue: this.lowerValue, upperValue: this.upperValue });
  }

  render() {
    const color = this.getColor(this.variant);
    const lowerPct = this.pctFromValue(this.lowerValue);
    const upperPct = this.pctFromValue(this.upperValue);
    const hideLeft = this.hideTextBoxes || this.hideLeftTextBox;
    const hideRight = this.hideTextBoxes || this.hideRightTextBox;

    // ✅ Keep positioning class even when disabled
    const lowerThumbContainerClass = [
      'slider-thumb-container',
      'lower-thumb',
      color,
      this.disabled ? 'slider-thumb-container-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const upperThumbContainerClass = [
      'slider-thumb-container',
      'upper-thumb',
      color,
      this.disabled ? 'slider-thumb-container-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div class="slider-wrapper">
        <div
          dir="ltr"
          class="slider"
          role="slider"
          aria-label={this.label || undefined}
          aria-orientation="horizontal"
          aria-disabled={this.disabled ? 'true' : 'false'}
          onKeyDown={this.onKeyDown}
          {...(this.disabled && { disabled: true })}
        >
          {this.sliderThumbLabel || !this.label ? null : (
            <label id="slider-input-label" class="form-control-label">
              {this.label} {(upperPct - lowerPct).toFixed(0)}
              {this.unit}
            </label>
          )}

          <div class="slider-container" ref={el => (this.containerEl = el as HTMLDivElement)}>
            {!hideLeft && (
              <div role="textbox" aria-readonly="true" aria-labelledby="slider-input-label" class="slider-value-left">
                {this.formatWithUnit(this.lowerValue)}
              </div>
            )}

            <div class="slider-min-value">{this.formatWithUnit(this.min)}</div>

            <div class="slider-controls">
              {/* Lower thumb */}
              <div
                class={lowerThumbContainerClass}
                style={{ left: `calc(${lowerPct}% - 5px)`, transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) 0s' }}
                onMouseDown={this.disabled ? undefined : e => this.onThumbMouseDown(e, 'lower')}
              >
                {this.plumage ? (
                  <div
                    class={`slider-handle ${color}`}
                    style={{ left: `${lowerPct}%` }}
                    role="slider"
                    aria-valuemin={String(this.min)}
                    aria-valuemax={String(this.max)}
                    aria-valuenow={String(this.lowerValue)}
                    aria-label="Lower value"
                    tabIndex={this.disabled ? -1 : 0}
                  />
                ) : (
                  <div
                    class={`slider-thumb ${color}`}
                    style={{ left: `${lowerPct}%` }}
                    role="slider"
                    aria-valuemin={String(this.min)}
                    aria-valuemax={String(this.max)}
                    aria-valuenow={String(this.lowerValue)}
                    aria-label="Lower value"
                    tabIndex={this.disabled ? -1 : 0}
                  />
                )}

                {this.sliderThumbLabel ? (
                  <div
                    class={`slider-thumb-label ${color}`}
                    style={{
                      position: 'absolute',
                      left: `${lowerPct}%`,
                      transform: 'translateX(-30%) translateY(30%) translateY(-100%) rotate(45deg)',
                    }}
                  >
                    <div>
                      <span>{this.formatWithUnit(this.lowerValue)}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Tracks */}
              <div class={`slider-track multi ${color}`} style={{ width: `${lowerPct}%` }} />
              <div class={`slider-track multi ${color}`} style={{ left: `${lowerPct}%`, right: `${100 - upperPct}%` }} />
              <div class="slider-track multi" style={{ width: `${100 - upperPct}%` }} />

              {/* Upper thumb */}
              <div
                class={upperThumbContainerClass}
                style={{ left: `calc(${upperPct}% - 8px)`, transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) 0s' }}
                onMouseDown={this.disabled ? undefined : e => this.onThumbMouseDown(e, 'upper')}
              >
                {this.plumage ? (
                  <div
                    class={`slider-handle ${color}`}
                    style={{ left: `calc(${upperPct}% + 3px)` }}
                    role="slider"
                    aria-valuemin={String(this.min)}
                    aria-valuemax={String(this.max)}
                    aria-valuenow={String(this.upperValue)}
                    aria-label="Upper value"
                    tabIndex={this.disabled ? -1 : 0}
                  />
                ) : (
                  <div
                    class={`slider-thumb ${color}`}
                    style={{ left: `calc(${upperPct}% + 3px)` }}
                    role="slider"
                    aria-valuemin={String(this.min)}
                    aria-valuemax={String(this.max)}
                    aria-valuenow={String(this.upperValue)}
                    aria-label="Upper value"
                    tabIndex={this.disabled ? -1 : 0}
                  />
                )}

                {this.sliderThumbLabel ? (
                  <div
                    class={`slider-thumb-label ${color}`}
                    style={{
                      position: 'absolute',
                      left: `calc(${upperPct}% + 3px)`,
                      transform: 'translateX(-30%) translateY(30%) translateY(-100%) rotate(45deg)',
                    }}
                  >
                    <div>
                      <span>{this.formatWithUnit(this.upperValue)}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Optional ticks */}
              {this._ticks.length > 0 ? (
                <div class="slider-ticks">
                  {this._ticks.map(tick => {
                    const pos = ((tick - this.min) / Math.max(1e-9, this.max - this.min)) * 100;
                    return (
                      <div>
                        <div class="slider-tick" style={{ left: `${pos}%`, top: 'calc(50% - 10px)' }} />
                        {this.tickLabels ? (
                          <div class="slider-tick-label" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
                            {this.formatWithUnit(tick)}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div class="slider-max-value">{this.formatWithUnit(this.max)}</div>

            {!hideRight && (
              <div role="textbox" aria-readonly="true" aria-labelledby="slider-input-label" class="slider-value-right">
                {this.formatWithUnit(this.upperValue)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
