// slider-manager-component.tsx
import { Component, Prop, h, Host } from '@stencil/core';

@Component({
  tag: 'slider-manager-component',
  shadow: false,
})
export class SliderManagerComponent {
  /** 'basic' | 'multi' | 'discrete' */
  @Prop({ reflect: true }) type: 'basic' | 'multi' | 'discrete' = 'basic';

  // Shared-ish props (expose only what you need; keep it lean)
  @Prop() label = '';
  @Prop() variant: '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' = '';
  @Prop() plumage = false;
  @Prop() disabled = false;
  @Prop() hideTextBoxes = false;
  @Prop() hideLeftTextBox = false;
  @Prop() hideRightTextBox = false;

  // Basic + multi
  @Prop() min = 0;
  @Prop() max = 100;
  @Prop() unit = '';
  @Prop() sliderThumbLabel = false;
  @Prop() snapToTicks = false;
  @Prop() tickLabels = false;
  @Prop() tickValues: number[] = [];

  // Basic
  @Prop() value = 0;

  // Multi
  @Prop() lowerValue = 25;
  @Prop() upperValue = 75;

  // Discrete
  @Prop() selectedIndex = 0;
  @Prop() stringValues: string[] = [];

  render() {
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
            tickValues={this.tickValues}
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
            tickValues={this.tickValues}
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
            stringValues={this.stringValues}
            plumage={this.plumage}
            tickLabels={this.tickLabels}
            variant={this.variant}
            disabled={this.disabled}
            hideRightTextBox={this.hideRightTextBox}
          />
        )}
      </Host>
    );
  }
}
