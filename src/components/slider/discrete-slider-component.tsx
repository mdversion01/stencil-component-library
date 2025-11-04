// src/components/sliders/discrete-slider-component.tsx
import { Component, Prop, Event, EventEmitter, h, Element, State, Watch } from '@stencil/core';

@Component({
  tag: 'discrete-slider-component',
  shadow: false,
})
export class DiscreteSliderComponent {
  @Element() host!: HTMLElement;

  @Prop() disabled: boolean = false;
  @Prop() hideRightTextBox: boolean = false;

  @Prop() label: string = '';
  @Prop() plumage: boolean = false;

  @Prop({ mutable: true }) selectedIndex: number = 0;
  /** Accepts array or JSON string in HTML */
  @Prop() stringValues: string[] | string = [];

  @Prop() tickLabels: boolean = false;
  @Prop() unit: string = '';
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';

  @State() private _values: string[] = [];

  private containerEl?: HTMLDivElement;
  private dragging = false;

  @Event() indexChange: EventEmitter<{ index: number }>;
  @Event() valueChange: EventEmitter<{ value: string }>;

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
    return Math.round((this.selectedIndex / len) * 100);
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

  // Keyboard
  private onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || this._values.length === 0) return;
    let idx = this.selectedIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        idx = Math.min(this.selectedIndex + 1, this._values.length - 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        idx = Math.max(this.selectedIndex - 1, 0);
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

  // Drag
  private onDragStart = (e: MouseEvent) => {
    if (this.disabled || !this.containerEl || this._values.length === 0) return;
    e.preventDefault();
    this.dragging = true;
    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('mouseup', this.onDragStop);
    const el = this.host.querySelector('.slider-thumb-container');
    el?.classList.add('slider-thumb-container-active');
  };

  private onDragMove = (e: MouseEvent) => {
    if (!this.dragging || !this.containerEl || this._values.length === 0) return;
    const rect = this.containerEl.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const pct = x / Math.max(1, rect.width);
    const idx = Math.round(pct * (this._values.length - 1));
    this.setIndex(idx);
  };

  private onDragStop = () => {
    this.dragging = false;
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragStop);
    const el = this.host.querySelector('.slider-thumb-container');
    el?.classList.remove('slider-thumb-container-active');
  };

  render() {
    const color = this.getColor(this.variant);
    const pct = this.pct();
    const val = this._values[this.selectedIndex] ?? '';

    return (
      <div dir="ltr" class="slider" role="slider" aria-label={this.label || undefined} aria-orientation="horizontal" aria-disabled={this.disabled ? 'true' : 'false'}>
        {this.label ? (
          <label id="slider-input-label" class="form-control-label">
            {this.label} {val}
          </label>
        ) : null}

        <div class="slider-container" ref={el => (this.containerEl = el as HTMLDivElement)}>
          <div class="slider-controls" onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}>
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
            </div>

            <div class="slider-ticks">
              {this._values.map((tick, index) => {
                const pos = (index / Math.max(1, this._values.length - 1)) * 100;
                return (
                  <div>
                    <div class="slider-tick" style={{ left: `${pos}%`, top: 'calc(50% - 10px)' }} onClick={() => this.setIndex(index)} />
                    {this.tickLabels ? (
                      <div class="slider-tick-label" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
                        {tick}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {!this.hideRightTextBox && (
            <div role="textbox" aria-readonly="true" aria-labelledby="slider-input-label" class="slider-value-right">
              {val}
            </div>
          )}
        </div>
      </div>
    );
  }
}
