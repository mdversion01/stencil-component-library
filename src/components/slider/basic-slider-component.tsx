// src/components/sliders/basic-slider-component.tsx
import { Component, Prop, Event, EventEmitter, h, State, Watch, Element } from '@stencil/core';

@Component({
  tag: 'basic-slider-component',
  shadow: false,
})
export class BasicSliderComponent {
  @Element() host!: HTMLElement;

  // Public API
  @Prop() label: string = '';
  @Prop({ mutable: true }) value: number = 0;
  @Prop() disabled: boolean = false;

  @Prop() hideTextBoxes: boolean = false;
  @Prop() hideLeftTextBox: boolean = false;
  @Prop() hideRightTextBox: boolean = false;

  @Prop() min: number = 0;
  @Prop() max: number = 100;

  @Prop() plumage: boolean = false;
  @Prop() sliderThumbLabel: boolean = false;

  @Prop() snapToTicks: boolean = false;
  /** Accepts array or JSON string in HTML */
  @Prop() tickValues: number[] | string = [];
  @Prop() tickLabels: boolean = false; // renders labels under ticks
  @Prop() ticks: number | '' = ''; // not used directly for math, but parity kept

  @Prop() unit: string = '';
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';

  // ----------------- a11y override props -----------------
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  // Internal
  @State() private _ticks: number[] = [];

  private containerEl?: HTMLDivElement;
  private dragging = false;
  private a11yBaseId = `slider_${Math.random().toString(36).slice(2, 11)}`;

  // Events
  @Event() valueChange: EventEmitter<{ value: number }>;

  // Lifecycle
  componentWillLoad() {
    this._ticks = this.normalizeTicks(this.tickValues);
    this.value = this.clamp(this.value, this.min, this.max);
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
    this.value = this.clamp(this.value, this.min, this.max);
  }

  // Helpers
  private normalizeTicks(input: number[] | string): number[] {
    if (Array.isArray(input)) return input.map(n => Number(n)).filter(n => Number.isFinite(n));
    if (typeof input === 'string' && input.trim()) {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed.map(n => Number(n)).filter(n => Number.isFinite(n)) : [];
      } catch {
        // eslint-disable-next-line no-console
        console.warn('[basic-slider-component] Invalid JSON for tickValues');
      }
    }
    return [];
  }

  private clamp(v: number, a: number, b: number) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.max(min, Math.min(max, v));
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

  private ratio(): number {
    const span = Math.max(1e-9, this.max - this.min);
    return (this.value - this.min) / span;
  }

  private percent(): number {
    return Math.round(this.ratio() * 100);
  }

  /**
   * Format numeric values with unit.
   * If unit is "$", prefix it (e.g. $42). Otherwise suffix (e.g. 42°F).
   */
  private formatWithUnit(n: number): string {
    const unit = String(this.unit ?? '').trim();
    const rounded = Math.round(n);

    if (!unit) return String(rounded);
    if (unit === '$') return `${unit}${rounded}`;

    return `${rounded}${unit}`;
  }

  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }

  private getA11yLabelId(): string {
    const base = (this.host?.id || '').trim() || this.a11yBaseId;
    return `${base}-label`;
  }

  private getA11yValueId(): string {
    const base = (this.host?.id || '').trim() || this.a11yBaseId;
    return `${base}-value`;
  }

  private computeA11y() {
    const userLabel = (this.ariaLabel ?? '').trim() || undefined;
    const userLabelledBy = this.normalizeIdList(this.ariaLabelledby);
    const userDescribedBy = this.normalizeIdList(this.ariaDescribedby);

    const hasVisibleLabel = !!(this.label ?? '').trim() && !this.sliderThumbLabel;
    const autoLabelId = hasVisibleLabel ? this.getA11yLabelId() : undefined;

    const ariaLabelledBy = userLabelledBy ?? autoLabelId;

    // If aria-labelledby exists, do NOT set aria-label.
    // Otherwise: aria-label = (user aria-label) OR (label prop) OR fallback
    const ariaLabel =
      ariaLabelledBy ? undefined : userLabel ?? ((this.label ?? '').trim() ? (this.label ?? '').trim() : 'Slider');

    const ariaDescribedBy = userDescribedBy;

    return { ariaLabel, ariaLabelledBy, ariaDescribedBy };
  }

  // Keyboard (attach to the element that has role="slider" + tabindex)
  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    let inc = 0;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        inc = this.findNearestTick(this.value, +1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        inc = this.findNearestTick(this.value, -1);
        break;
      case 'Home':
        this.setValue(this.min);
        event.preventDefault();
        return;
      case 'End':
        this.setValue(this.max);
        event.preventDefault();
        return;
      default:
        return;
    }

    if (inc !== 0) this.setValue(this.value + inc);
    event.preventDefault();

    const el = this.host.querySelector('.slider-thumb-container');
    el?.classList.add('slider-thumb-container-active');
  };

  private handleKeyUp = () => {
    const el = this.host.querySelector('.slider-thumb-container');
    el?.classList.remove('slider-thumb-container-active');
  };

  private findNearestTick(currentValue: number, direction: 1 | -1): number {
    if (!this.snapToTicks || this._ticks.length === 0) return direction; // step 1

    const idx = this._ticks.indexOf(currentValue);
    if (idx >= 0) {
      const next = idx + direction;
      if (next >= 0 && next < this._ticks.length) return this._ticks[next] - currentValue;
      return 0;
    }

    const sorted = [...this._ticks].sort((a, b) => a - b);
    const greater = sorted.find(t => t > currentValue);
    const lesser = [...sorted].reverse().find(t => t < currentValue);

    if (direction > 0 && greater != null) return greater - currentValue;
    if (direction < 0 && lesser != null) return lesser - currentValue;
    return 0;
  }

  // Drag
  private addDragListeners() {
    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragStop);
  }
  private removeDragListeners() {
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragStop);
  }

  private onDragStart = (e: MouseEvent) => {
    if (this.disabled) return;
    e.preventDefault();
    this.dragging = true;
    this.addDragListeners();
    const el = this.host.querySelector('.slider-thumb-container');
    el?.classList.add('slider-thumb-container-active');
  };

  private onDragMove = (e: MouseEvent) => {
    if (!this.dragging || !this.containerEl) return;

    const rect = this.containerEl.getBoundingClientRect();
    const x = this.clamp(e.clientX - rect.left, 0, rect.width);
    const pct = x / Math.max(1, rect.width);
    let newValue = this.min + pct * (this.max - this.min);

    if (this.snapToTicks && this._ticks.length > 0) {
      let nearest = this._ticks[0];
      let best = Infinity;
      for (const t of this._ticks) {
        const d = Math.abs(t - newValue);
        if (d < best) {
          best = d;
          nearest = t;
        }
      }
      newValue = nearest;
    }

    this.setValue(newValue);
  };

  private onDragStop = () => {
    this.dragging = false;
    this.removeDragListeners();
    const el = this.host.querySelector('.slider-thumb-container');
    el?.classList.remove('slider-thumb-container-active');
  };

  private setValue(v: number) {
    const next = this.clamp(v, this.min, this.max);
    if (next !== this.value) {
      this.value = next;
      this.valueChange.emit({ value: this.value });
    }
  }

  render() {
    const pct = this.percent();
    const color = this.getColor(this.variant);
    const showTicks = Array.isArray(this._ticks) && this._ticks.length > 0 && (Number(this.ticks) || this.tickLabels);
    const hideLeft = this.hideTextBoxes || this.hideLeftTextBox;
    const hideRight = this.hideTextBoxes || this.hideRightTextBox;

    const labelId = this.getA11yLabelId();
    const valueId = this.getA11yValueId();

    const { ariaLabel, ariaLabelledBy, ariaDescribedBy } = this.computeA11y();

    const thumbContainerClass = ['slider-thumb-container', color, this.disabled ? 'slider-thumb-container-disabled' : '']
      .filter(Boolean)
      .join(' ');

    const valueText = this.formatWithUnit(this.value);

    return (
      <div class="slider-wrapper">
        <div dir="ltr" class="slider" role="presentation">
          {/* Visible label (also becomes aria-labelledby target) */}
          {this.sliderThumbLabel || !this.label ? null : (
            <label id={labelId} class="form-control-label">
              {this.label} <span id={valueId}>{valueText}</span>
            </label>
          )}

          <div class="slider-container" ref={el => (this.containerEl = el as HTMLDivElement)}>
            {!hideLeft && (
              <div role="textbox" aria-readonly="true" aria-labelledby={labelId} class="slider-value-left">
                {valueText}
              </div>
            )}

            <div class="slider-min-value" aria-hidden="true">
              {this.formatWithUnit(this.min)}
            </div>

            <div class="slider-controls" role="presentation">
              <div class="slider-background-track" style={{ width: '100%' }} aria-hidden="true" />
              <div class={`slider-moving-track ${color}`} style={{ width: `${pct}%` }} aria-hidden="true" />

              {/* ✅ THIS is the one and only slider element for AT + keyboard focus */}
              <div
                class={thumbContainerClass}
                style={{ left: `${pct}%`, transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) 0s' }}
                onMouseDown={this.disabled ? undefined : this.onDragStart}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                role="slider"
                tabIndex={this.disabled ? -1 : 0}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
                aria-valuemin={String(this.min)}
                aria-valuemax={String(this.max)}
                aria-valuenow={String(Math.round(this.value))}
                aria-valuetext={valueText}
                aria-orientation="horizontal"
                aria-disabled={this.disabled ? 'true' : undefined}
              >
                {/* purely visual thumb */}
                {this.plumage ? (
                  <div class={`slider-handle ${color}`} role="presentation" aria-hidden="true" />
                ) : (
                  <div class={`slider-thumb ${color}`} role="presentation" aria-hidden="true" />
                )}

                {this.sliderThumbLabel ? (
                  <div
                    class={`slider-thumb-label ${color}`}
                    style={{
                      position: 'absolute',
                      left: `${pct}%`,
                      transform: 'translateX(-50%) translateY(30%) translateY(-100%) rotate(45deg)',
                    }}
                    aria-hidden="true"
                  >
                    <div>
                      <span>{valueText}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {showTicks ? (
                <div class="slider-ticks" aria-hidden="true">
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

            <div class="slider-max-value" aria-hidden="true">
              {this.formatWithUnit(this.max)}
            </div>

            {!hideRight && (
              <div role="textbox" aria-readonly="true" aria-labelledby={labelId} class="slider-value-right">
                {valueText}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
