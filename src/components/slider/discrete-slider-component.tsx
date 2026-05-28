// src/components/sliders/discrete-slider-component.tsx
import { Component, Prop, Event, EventEmitter, h, Element, State, Watch } from '@stencil/core';

@Component({
  tag: 'discrete-slider-component',
  styleUrl: 'slider-component-styles.scss',
  shadow: false,
})
export class DiscreteSliderComponent {
  @Element() host!: HTMLElement;

  @Prop() disabled: boolean = false;
  @Prop() hideTextBoxes: boolean = false;
  @Prop() hideLeftTextBox: boolean = false;
  @Prop() hideRightTextBox: boolean = false;
  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Prop() label: string = '';
  @Prop() plumage: boolean = false;
  @Prop() sliderThumbLabel: boolean = false;

  @Prop({ mutable: true }) selectedIndex: number = 0;
  @Prop() stringValues: string[] | string = [];

  @Prop() tickLabels: boolean = false;
  @Prop() unit: string = '';
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';

  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  @State() private _values: string[] = [];

  private controlsEl?: HTMLDivElement;
  private dragging = false;
  private a11yBaseId = `dslider_${Math.random().toString(36).slice(2, 11)}`;

  @Event() indexChange!: EventEmitter<{ index: number }>;
  @Event() valueChange!: EventEmitter<{ value: string }>;

  componentWillLoad() {
    this._values = this.normalize(this.stringValues);
    this.selectedIndex = this.clampIndex(this.selectedIndex);
  }

  disconnectedCallback() {
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragStop);
  }

  @Watch('stringValues')
  onValuesChange(v: string[] | string) {
    this._values = this.normalize(v);
    this.selectedIndex = this.clampIndex(this.selectedIndex);
  }

  private normalize(input: string[] | string): string[] {
    if (Array.isArray(input)) return input.map(v => String(v));
    if (typeof input === 'string' && input.trim()) {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed.map(String) : [];
      } catch {
        console.warn('[discrete-slider-component] Invalid JSON for stringValues');
      }
    }
    return [];
  }

  private clampIndex(i: number) {
    if (this._values.length === 0) return 0;
    return Math.max(0, Math.min(this._values.length - 1, Math.round(i)));
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

  private pct(): number {
    const len = Math.max(1, this._values.length - 1);
    return (this.selectedIndex / len) * 100;
  }

  private setIndex(index: number) {
    const next = this.clampIndex(index);
    if (next !== this.selectedIndex) {
      this.selectedIndex = next;
      const val = this._values[this.selectedIndex] ?? '';
      this.indexChange.emit({ index: this.selectedIndex });
      this.valueChange.emit({ value: val });
    }
  }

  private formatWithUnit(v: string): string {
    const unit = String(this.unit ?? '').trim();
    const s = String(v ?? '');

    if (!unit) return s;
    if (unit === '$') return `${unit}${s}`;
    return `${s}${unit}`;
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

  private computeA11y(hasVisibleLabel: boolean) {
    const userLabel = (this.ariaLabel ?? '').trim() || undefined;
    const userLabelledBy = this.normalizeIdList(this.ariaLabelledby);
    const userDescribedBy = this.normalizeIdList(this.ariaDescribedby);

    const autoLabelId = hasVisibleLabel ? this.getA11yLabelId() : undefined;
    const ariaLabelledBy = userLabelledBy ?? autoLabelId;

    const ariaLabel = ariaLabelledBy
      ? undefined
      : userLabel ?? ((this.label ?? '').trim() ? (this.label ?? '').trim() : 'Slider');

    return { ariaLabel, ariaLabelledBy, ariaDescribedBy: userDescribedBy };
  }

  private getValueFromPointer(e: MouseEvent): number | null {
    if (!this.controlsEl || this._values.length === 0) return null;

    const rect = this.controlsEl.getBoundingClientRect();

    if (this.orientation === 'vertical') {
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      const pct = 1 - y / Math.max(1, rect.height);
      return pct;
    }

    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    return x / Math.max(1, rect.width);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || this._values.length === 0) return;
    let idx = this.selectedIndex;
    const isVertical = this.orientation === 'vertical';

    switch (event.key) {
      case 'ArrowUp':
        idx = Math.min(this.selectedIndex + 1, this._values.length - 1);
        break;
      case 'ArrowDown':
        idx = Math.max(this.selectedIndex - 1, 0);
        break;
      case 'ArrowRight':
        if (!isVertical) idx = Math.min(this.selectedIndex + 1, this._values.length - 1);
        else return;
        break;
      case 'ArrowLeft':
        if (!isVertical) idx = Math.max(this.selectedIndex - 1, 0);
        else return;
        break;
      case 'Home':
        idx = 0;
        break;
      case 'End':
        idx = this._values.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.setIndex(idx);

    const el = this.host.querySelector('.slider-thumb-container');
    el?.classList.add('slider-thumb-container-active');
  };

  private onKeyUp = () => {
    const el = this.host.querySelector('.slider-thumb-container');
    el?.classList.remove('slider-thumb-container-active');
  };

  private onDragStart = (e: MouseEvent) => {
    if (this.disabled || !this.controlsEl || this._values.length === 0) return;
    e.preventDefault();
    this.dragging = true;
    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragStop);
    this.host.querySelector('.slider-thumb-container')?.classList.add('slider-thumb-container-active');
  };

  private onDragMove = (e: MouseEvent) => {
    if (!this.dragging || !this.controlsEl || this._values.length === 0) return;

    const pct = this.getValueFromPointer(e);
    if (pct == null) return;

    const idx = Math.round(pct * (this._values.length - 1));
    this.setIndex(idx);
  };

  private onDragStop = () => {
    this.dragging = false;
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragStop);
    this.host.querySelector('.slider-thumb-container')?.classList.remove('slider-thumb-container-active');
  };

  private getThumbPositionStyle(pctCss: string) {
    if (this.orientation === 'vertical') {
      return {
        bottom: pctCss,
        left: '50%',
        transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) 0s',
      };
    }

    return {
      left: pctCss,
      transition: 'all 0.1s cubic-bezier(0.25, 0.8, 0.5, 1) 0s',
    };
  }

  private getMovingTrackStyle(pctCss: string) {
    if (this.orientation === 'vertical') {
      return {
        bottom: '0',
        height: pctCss,
      };
    }

    return { width: pctCss };
  }

  private getTickStyle(posCss: string) {
    if (this.orientation === 'vertical') {
      return { bottom: posCss, left: '50%' };
    }

    return { left: posCss, top: 'calc(50% - 10px)' };
  }

  private getTickLabelStyle(posCss: string) {
    if (this.orientation === 'vertical') {
      return { bottom: posCss, left: 'calc(50% + 8px)', transform: 'translateY(50%)' };
    }

    return { left: posCss, transform: 'translateX(-50%)' };
  }

  private getThumbLabelStyle(pctCss: string) {
    if (this.orientation === 'vertical') {
      return {
        position: 'absolute',
        bottom: `calc(${pctCss} - 18px)`,
        left: 'calc(100% + 16px)',
        transform: 'translateY(50%) translateY(-50%) rotate(140deg)',
      };
    }

    return {
      position: 'absolute',
      left: pctCss,
      transform: 'translateX(-50%) translateY(30%) translateY(-100%) rotate(45deg)',
    };
  }

  render() {
    const color = this.getColor(this.variant);
    const pct = this.pct();
    const pctCss = `${pct.toFixed(4)}%`;

    const rawVal = this._values[this.selectedIndex] ?? '';
    const val = this.formatWithUnit(rawVal);

    const hasValues = this._values.length > 0;
    const minIndex = 0;
    const maxIndex = Math.max(0, this._values.length - 1);

    const hideLeft = this.hideTextBoxes || this.hideLeftTextBox;
    const hideRight = this.hideTextBoxes || this.hideRightTextBox;

    const hasVisibleLabel = !!(this.label ?? '').trim() && !this.sliderThumbLabel;
    const labelId = this.getA11yLabelId();
    const valueId = this.getA11yValueId();

    const { ariaLabel, ariaLabelledBy, ariaDescribedBy } = this.computeA11y(hasVisibleLabel);

    const isEffectivelyDisabled = this.disabled || !hasValues;
    const isVertical = this.orientation === 'vertical';

    const thumbContainerClass = [
      'slider-thumb-container',
      color,
      isEffectivelyDisabled ? 'slider-thumb-container-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const sliderClass = ['slider', isVertical ? 'slider-vertical' : 'slider-horizontal'].filter(Boolean).join(' ');
    const sliderContainerClass = ['slider-container', isVertical ? 'slider-container-vertical' : 'slider-container-horizontal']
      .filter(Boolean)
      .join(' ');
    const sliderControlsClass = ['slider-controls', isVertical ? 'slider-controls-vertical' : 'slider-controls-horizontal']
      .filter(Boolean)
      .join(' ');

    return (
      <div class="sc-slider">
        <div class="slider-wrapper">
          <div dir="ltr" class={sliderClass} role="presentation">
            {hasVisibleLabel ? (
              <label id={labelId} class="form-control-label">
                {this.label} <span id={valueId}>{val}</span>
              </label>
            ) : null}

            <div class={sliderContainerClass}>
              {!hideLeft && (
                <div role="textbox" aria-readonly="true" aria-labelledby={hasVisibleLabel ? labelId : undefined} class="slider-value-left">
                  {val}
                </div>
              )}

              <div class={sliderControlsClass} role="presentation" ref={el => (this.controlsEl = el as HTMLDivElement)}>
                <div class="slider-background-track" aria-hidden="true" />
                <div class={`slider-moving-track ${color}`} style={this.getMovingTrackStyle(pctCss)} aria-hidden="true" />

                <div
                  class={thumbContainerClass}
                  style={this.getThumbPositionStyle(pctCss)}
                  onMouseDown={isEffectivelyDisabled ? undefined : this.onDragStart}
                  onKeyDown={this.onKeyDown}
                  onKeyUp={this.onKeyUp}
                  role="slider"
                  tabIndex={isEffectivelyDisabled ? -1 : 0}
                  aria-label={ariaLabel}
                  aria-labelledby={ariaLabelledBy}
                  aria-describedby={ariaDescribedBy}
                  aria-orientation={this.orientation}
                  aria-disabled={isEffectivelyDisabled ? 'true' : undefined}
                  aria-valuemin={String(minIndex)}
                  aria-valuemax={String(maxIndex)}
                  aria-valuenow={String(this.selectedIndex)}
                  aria-valuetext={val}
                >
                  {this.plumage ? (
                    <div class={`slider-handle ${color}`} role="presentation" aria-hidden="true" />
                  ) : (
                    <div class={`slider-thumb ${color}`} role="presentation" aria-hidden="true" />
                  )}

                  {this.sliderThumbLabel ? (
                    <div class={`slider-thumb-label ${color}`} style={this.getThumbLabelStyle(pctCss)} aria-hidden="true">
                      <div>
                        <span>{val}</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div class="slider-ticks" aria-hidden="true">
                  {this._values.map((tick, index) => {
                    const pos = (index / Math.max(1, this._values.length - 1)) * 100;
                    const posCssTick = `${pos.toFixed(4)}%`;

                    return (
                      <div>
                        <div
                          class="slider-tick"
                          style={this.getTickStyle(posCssTick)}
                          onClick={isEffectivelyDisabled ? undefined : () => this.setIndex(index)}
                        />
                        {this.tickLabels ? (
                          <div class="slider-tick-label" style={this.getTickLabelStyle(posCssTick)}>
                            {this.formatWithUnit(tick)}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {!hideRight && (
                <div role="textbox" aria-readonly="true" aria-labelledby={hasVisibleLabel ? labelId : undefined} class="slider-value-right">
                  {val}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
