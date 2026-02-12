// slider-manager-component.tsx
import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'slider-manager-component',
  shadow: false,
})
export class SliderManagerComponent {
  @Prop({ reflect: true }) type: 'basic' | 'multi' | 'discrete' = 'basic';

  @Prop() label = '';
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';
  @Prop() plumage = false;
  @Prop() disabled = false;
  @Prop() hideTextBoxes = false;
  @Prop() hideLeftTextBox = false;
  @Prop() hideRightTextBox = false;

  @Prop() min = 0;
  @Prop() max = 100;
  @Prop() unit = '';
  @Prop() sliderThumbLabel = false;
  @Prop() snapToTicks = false;
  @Prop() tickLabels = false;

  // ✅ allow JSON string OR array
  @Prop() tickValues: number[] | string = [];

  @Prop() value = 0;

  @Prop() lowerValue = 25;
  @Prop() upperValue = 75;

  @Prop() selectedIndex = 0;

  // ✅ allow JSON string OR array
  @Prop() stringValues: string[] | string = [];

  private normalizeNumberArray(input: number[] | string): number[] {
    if (Array.isArray(input)) return input.map(n => Number(n)).filter(n => Number.isFinite(n));
    if (typeof input === 'string' && input.trim()) {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed.map(n => Number(n)).filter(n => Number.isFinite(n)) : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private normalizeStringArray(input: string[] | string): string[] {
    if (Array.isArray(input)) return input.map(v => String(v));
    if (typeof input === 'string' && input.trim()) {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed.map(v => String(v)) : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  render() {
    const tickValues = this.normalizeNumberArray(this.tickValues);
    const stringValues = this.normalizeStringArray(this.stringValues);

    return (
      <Host>
        {this.type === 'basic' && (
          <basic-slider-component
            label={this.label}
            value={this.value}
            min={this.min}
            max={this.max}
            unit={this.unit}
            plumage={this.plumage}
            sliderThumbLabel={this.sliderThumbLabel}
            snapToTicks={this.snapToTicks}
            tickLabels={this.tickLabels}
            tickValues={tickValues}
            variant={this.variant}
            hideTextBoxes={this.hideTextBoxes}
            hideLeftTextBox={this.hideLeftTextBox}
            hideRightTextBox={this.hideRightTextBox}
            disabled={this.disabled}
          />
        )}

        {this.type === 'multi' && (
          <multi-range-slider-component
            label={this.label}
            lowerValue={this.lowerValue}
            upperValue={this.upperValue}
            min={this.min}
            max={this.max}
            unit={this.unit}
            plumage={this.plumage}
            sliderThumbLabel={this.sliderThumbLabel}
            snapToTicks={this.snapToTicks}
            tickLabels={this.tickLabels}
            tickValues={tickValues}
            variant={this.variant}
            hideTextBoxes={this.hideTextBoxes}
            hideLeftTextBox={this.hideLeftTextBox}
            hideRightTextBox={this.hideRightTextBox}
            disabled={this.disabled}
          />
        )}

        {this.type === 'discrete' && (
          <discrete-slider-component
            label={this.label}
            selectedIndex={this.selectedIndex}
            stringValues={stringValues}   // ✅ now guaranteed array
            plumage={this.plumage}
            tickLabels={this.tickLabels}
            unit={this.unit}              // ✅ forward if you want it
            variant={this.variant}
            disabled={this.disabled}
            hideRightTextBox={this.hideRightTextBox}
          />
        )}
      </Host>
    );
  }
}
