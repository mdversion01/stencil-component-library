// src/components/sliders/basic-slider-component.tsx
import { Component, Prop, Event, EventEmitter, h, State, Watch, Element } from '@stencil/core';

// type Variant = '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark';

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

  // Internal
  @State() private _ticks: number[] = [];

  private containerEl?: HTMLDivElement;
  private dragging = false;

  // Events
  @Event() valueChange: EventEmitter<{ value: number }>;

  // Lifecycle
  componentWillLoad() {
    this._ticks = this.normalizeTicks(this.tickValues);
    this.value = this.clamp(this.value, this.min, this.max);
  }

  componentDidLoad() {
    // nothing special; all DOM refs from render
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
    if (Array.isArray(input)) return input.filter(n => typeof n === 'number');
    if (typeof input === 'string' && input.trim()) {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed.map(n => Number(n)).filter(n => !Number.isNaN(n)) : [];
      } catch {
        console.warn('[basic-slider-component] Invalid JSON for tickValues');
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

  private ratio(): number {
    const span = Math.max(1e-9, this.max - this.min);
    return (this.value - this.min) / span;
  }

  private percent(): number {
    return Math.round(this.ratio() * 100);
  }

  // Keyboard
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
        break;
      case 'End':
        this.setValue(this.max);
        break;
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
      if (next >= 0 && next < this._ticks.length) {
        return this._ticks[next] - currentValue;
      }
      return 0;
    }
    // move to the nearest tick in the given direction
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
    let pct = x / Math.max(1, rect.width);
    let newValue = this.min + pct * (this.max - this.min);

    if (this.snapToTicks && this._ticks.length > 0) {
      // snap to nearest tick by distance
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

    return (
      <div
        dir="ltr"
        class="slider"
        aria-label={this.label || undefined}
        role="slider"
        aria-valuemin={String(this.min)}
        aria-valuemax={String(this.max)}
        aria-valuenow={String(Math.round(this.value))}
        aria-orientation="horizontal"
        aria-disabled={this.disabled ? 'true' : 'false'}
      >
        {this.sliderThumbLabel || !this.label ? null : (
          <label id="slider-input-label" class="form-control-label">
            {this.label} {Math.round(this.value)}
            {this.unit}
          </label>
        )}

        <div class="slider-container" ref={el => (this.containerEl = el as HTMLDivElement)}>
          {!hideLeft && (
            <div role="textbox" aria-readonly="true" aria-labelledby="slider-input-label" class="slider-value-left">
              {Math.round(this.value)}
            </div>
          )}

          <div class="slider-min-value">
            {this.min}
            {this.unit}
          </div>

          <div class="slider-controls" onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
            <div class="slider-background-track" style={{ width: '100%' }} />
            <div class={`slider-moving-track ${color}`} style={{ width: `${pct}%` }} />
            <div
              class={`${this.disabled ? '' : 'slider-thumb-container'} ${color}`}
              style={{ left: `${pct}%`, transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) 0s' }}
              onMouseDown={this.onDragStart}
              role="presentation"
              tabIndex={this.disabled ? -1 : 0}
            >
              {this.plumage ? (
                <div class={`slider-handle ${color}`} role="slider" aria-label="Slider thumb" tabIndex={-1} />
              ) : (
                <div class={`slider-thumb ${color}`} role="slider" aria-label="Slider thumb" tabIndex={-1} />
              )}

              {this.sliderThumbLabel ? (
                <div
                  class={`slider-thumb-label ${color}`}
                  style={{ position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%) translateY(30%) translateY(-100%) rotate(45deg)' }}
                >
                  <div>
                    <span>
                      {Math.round(this.value)}
                      {this.unit}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {showTicks ? (
              <div class="slider-ticks">
                {this._ticks.map(tick => {
                  const pos = ((tick - this.min) / Math.max(1e-9, this.max - this.min)) * 100;
                  return (
                    <div>
                      <div class="slider-tick" style={{ left: `${pos}%`, top: 'calc(50% - 10px)' }} />
                      {this.tickLabels ? (
                        <div class="slider-tick-label" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
                          {tick}
                          {typeof tick === 'number' ? this.unit : ''}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div class="slider-max-value">
            {this.max}
            {this.unit}
          </div>

          {!hideRight && (
            <div role="textbox" aria-readonly="true" aria-labelledby="slider-input-label" class="slider-value-right">
              {Math.round(this.value)}
            </div>
          )}
        </div>
      </div>
    );
  }
}
