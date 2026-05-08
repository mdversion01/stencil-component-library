// src/components/sliders/slider-basic-component.tsx
import { Component, Prop, Event, EventEmitter, h, State, Watch, Element } from '@stencil/core';

@Component({
  tag: 'slider-basic-component',
  shadow: false,
})
export class SliderBasicComponent {
  @Element() host!: HTMLElement;

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
  @Prop() tickValues: number[] | string = [];
  @Prop() tickLabels: boolean = false;
  @Prop() ticks: number | '' = '';

  @Prop() unit: string = '';
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';
  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  @State() private _ticks: number[] = [];

  private controlsEl?: HTMLDivElement;
  private dragging = false;
  private a11yBaseId = `slider_${Math.random().toString(36).slice(2, 11)}`;

  @Event() valueChange!: EventEmitter<{ value: number }>;

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

  private normalizeTicks(input: number[] | string): number[] {
    if (Array.isArray(input)) return input.map(n => Number(n)).filter(n => Number.isFinite(n));
    if (typeof input === 'string' && input.trim()) {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed.map(n => Number(n)).filter(n => Number.isFinite(n)) : [];
      } catch {
        console.warn('[slider-basic-component] Invalid JSON for tickValues');
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
    return this.ratio() * 100;
  }

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
    const ariaLabel = ariaLabelledBy ? undefined : (userLabel ?? ((this.label ?? '').trim() ? (this.label ?? '').trim() : 'Slider'));
    const ariaDescribedBy = userDescribedBy;

    return { ariaLabel, ariaLabelledBy, ariaDescribedBy };
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) return;
    let inc = 0;
    const isVertical = this.orientation === 'vertical';

    switch (event.key) {
      case 'ArrowUp':
        inc = this.findNearestTick(this.value, +1);
        break;
      case 'ArrowDown':
        inc = this.findNearestTick(this.value, -1);
        break;
      case 'ArrowRight':
        if (!isVertical) inc = this.findNearestTick(this.value, +1);
        else return;
        break;
      case 'ArrowLeft':
        if (!isVertical) inc = this.findNearestTick(this.value, -1);
        else return;
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
    if (!this.snapToTicks || this._ticks.length === 0) return direction;

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

  private getValueFromPointer(e: MouseEvent): number | null {
    if (!this.controlsEl) return null;

    const rect = this.controlsEl.getBoundingClientRect();

    if (this.orientation === 'vertical') {
      const y = this.clamp(e.clientY - rect.top, 0, rect.height);
      const pct = 1 - y / Math.max(1, rect.height);
      return this.min + pct * (this.max - this.min);
    }

    const x = this.clamp(e.clientX - rect.left, 0, rect.width);
    const pct = x / Math.max(1, rect.width);
    return this.min + pct * (this.max - this.min);
  }

  private onDragMove = (e: MouseEvent) => {
    if (!this.dragging || !this.controlsEl) return;

    let newValue = this.getValueFromPointer(e);
    if (newValue == null) return;

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

  private getThumbPositionStyle(pct: number) {
    if (this.orientation === 'vertical') {
      return {
        bottom: `${pct}%`,
        left: '50%',
        transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) 0s',
      };
    }

    return {
      left: `${pct}%`,
      transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) 0s',
    };
  }

  private getMovingTrackStyle(pct: number) {
    if (this.orientation === 'vertical') {
      return {
        bottom: '0',
        height: `${pct}%`,
      };
    }

    return { width: `${pct}%` };
  }

  private getThumbLabelStyle(pct: number) {
    if (this.orientation === 'vertical') {
      return {
        position: 'absolute',
        bottom: `calc(${pct}% - 18px)`,
        left: 'calc(100% + 18px)',
        transform: 'translateY(50%) translateY(-50%) rotate(140deg)',
      };
    }

    return {
      position: 'absolute',
      left: `${pct}%`,
      transform: 'translateX(-50%) translateY(30%) translateY(-100%) rotate(45deg)',
    };
  }

  private getTickStyle(pos: number) {
    if (this.orientation === 'vertical') {
      return { bottom: `${pos}%`, left: '50%' };
    }

    return { left: `${pos}%`, top: 'calc(50% - 10px)' };
  }

  private getTickLabelStyle(pos: number) {
    if (this.orientation === 'vertical') {
      return { bottom: `${pos}%`, left: 'calc(50% + 8px)', transform: 'translateY(50%)' };
    }

    return { left: `${pos}%`, transform: 'translateX(-50%)' };
  }

  render() {
    const pct = this.percent();
    const color = this.getColor(this.variant);
    const showTicks = Array.isArray(this._ticks) && this._ticks.length > 0 && (Number(this.ticks) || this.tickLabels);
    const showMinMaxLabels = this._ticks.length === 0;
    const hideLeft = this.hideTextBoxes || this.hideLeftTextBox;
    const hideRight = this.hideTextBoxes || this.hideRightTextBox;
    const isVertical = this.orientation === 'vertical';

    const labelId = this.getA11yLabelId();
    const valueId = this.getA11yValueId();

    const { ariaLabel, ariaLabelledBy, ariaDescribedBy } = this.computeA11y();

    const thumbContainerClass = ['slider-thumb-container', color, this.disabled ? 'slider-thumb-container-disabled' : ''].filter(Boolean).join(' ');
    const valueText = this.formatWithUnit(this.value);
    const sliderClass = ['slider', isVertical ? 'slider-vertical' : 'slider-horizontal'].filter(Boolean).join(' ');
    const sliderContainerClass = ['slider-container', isVertical ? 'slider-container-vertical' : 'slider-container-horizontal'].filter(Boolean).join(' ');
    const sliderControlsClass = ['slider-controls', isVertical ? 'slider-controls-vertical' : 'slider-controls-horizontal'].filter(Boolean).join(' ');

    return (
      <div class="sc-slider">
        <div class="slider-wrapper">
          <div dir="ltr" class={sliderClass} role="presentation">
            {this.sliderThumbLabel || !this.label ? null : (
              <label id={labelId} class="form-control-label">
                {this.label} <span id={valueId}>{valueText}</span>
              </label>
            )}

            <div class={sliderContainerClass}>
              {!hideLeft && (
                <div role="textbox" aria-readonly="true" aria-labelledby={labelId} class="slider-value-left">
                  {valueText}
                </div>
              )}

              {showMinMaxLabels ? (
                <div class="slider-min-value" aria-hidden="true">
                  {this.formatWithUnit(this.min)}
                </div>
              ) : null}

              <div class={sliderControlsClass} role="presentation" ref={el => (this.controlsEl = el as HTMLDivElement)}>
                <div class="slider-background-track" aria-hidden="true" />
                <div class={`slider-moving-track ${color}`} style={this.getMovingTrackStyle(pct)} aria-hidden="true" />

                <div
                  class={thumbContainerClass}
                  style={this.getThumbPositionStyle(pct)}
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
                  aria-orientation={this.orientation}
                  aria-disabled={this.disabled ? 'true' : undefined}
                >
                  {this.plumage ? (
                    <div class={`slider-handle ${color}`} role="presentation" aria-hidden="true" />
                  ) : (
                    <div class={`slider-thumb ${color}`} role="presentation" aria-hidden="true" />
                  )}

                  {this.sliderThumbLabel ? (
                    <div class={`slider-thumb-label ${color}`} style={this.getThumbLabelStyle(pct)} aria-hidden="true">
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
                          <div class="slider-tick" style={this.getTickStyle(pos)} />
                          {this.tickLabels ? (
                            <div class="slider-tick-label" style={this.getTickLabelStyle(pos)}>
                              {this.formatWithUnit(tick)}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {showMinMaxLabels ? (
                <div class="slider-max-value" aria-hidden="true">
                  {this.formatWithUnit(this.max)}
                </div>
              ) : null}

              {!hideRight && (
                <div role="textbox" aria-readonly="true" aria-labelledby={labelId} class="slider-value-right">
                  {valueText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
