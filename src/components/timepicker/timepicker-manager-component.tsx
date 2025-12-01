// src/components/timepicker/timepicker-manager-component.tsx
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'timepicker-manager',
  // styleUrl removed to fix unresolved import error
  shadow: false,
})
export class TimepickerManagerComponent {
  /** Accessible label for the input */
  @Prop() ariaLabel: string = 'Time Picker';

  /** ID of the external label element (for aria-labelledby) */
  @Prop() ariaLabelledby: string = 'time-label';

  @Prop() showLabel?: boolean;

  @Prop() labelText: string = 'Enter Time';

  /** ID to pass to inner input(s) */
  @Prop() inputId: string = 'time-input';

  /** Name attribute for the inner input */
  @Prop() inputName: string = 'time';

  /** Use 24-hour format by default */
  @Prop() isTwentyFourHourFormat: boolean = true;

  /** Optional size variant (e.g., 'sm', 'lg') */
  @Prop() size: string = '';

  /** Validation message to show (if any) */
  @Prop() validationMessage: string = '';

  /** Force show only 24-hour controls/options */
  @Prop() twentyFourHourOnly: boolean = false;

  /** Force show only 12-hour controls/options */
  @Prop() twelveHourOnly: boolean = false;

  /** Hide the toggle/launch button for the timepicker popover */
  @Prop() hideTimepickerBtn: boolean = false;

  /** Whether the current value is considered valid */
  @Prop() isValid: boolean = true;

  /** Hide seconds UI / value */
  @Prop() hideSeconds: boolean = false;

  /** Choose which implementation to render: false = <timepicker-component>, true = <plumage-timepicker-component> */
  @Prop() usePlTimepicker: boolean = false;

  /** Width (px) for the input element */
  @Prop() inputWidth: number = null;

  private commonProps() {
    // Use camelCase keys so Stencil sets component properties (not just attributes)
    return {
      ariaLabel: this.ariaLabel,
      ariaLabelledby: this.ariaLabelledby,
      showLabel: this.showLabel,
      labelText: this.labelText,
      inputId: this.inputId, // maps to child @Prop() inputId
      inputName: this.inputName,
      isTwentyFourHourFormat: this.isTwentyFourHourFormat,
      size: this.size,
      validationMessage: this.validationMessage,
      twentyFourHourOnly: this.twentyFourHourOnly,
      twelveHourOnly: this.twelveHourOnly,
      hideTimepickerBtn: this.hideTimepickerBtn,
      isValid: this.isValid,
      hideSeconds: this.hideSeconds,
      inputWidth: this.inputWidth,
    };
  }

  render() {
    const props = this.commonProps();

    return this.usePlTimepicker ? <plumage-timepicker-component {...(props as any)} /> : <timepicker-component {...(props as any)} />;
  }
}
