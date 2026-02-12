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

  /**
   * Validation message to show (if any).
   * NOTE: children now clear this internally on clear/typing/spinner interaction.
   */
  @Prop() validationMessage: string = '';

  /**
   * External invalid/validation styling flag (drives `invalid` / `is-invalid` styling in children).
   * NOTE: children now clear this internally on clear/typing/spinner interaction.
   */
  @Prop() validation?: boolean = false;

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
  @Prop() inputWidth: number | string = null;

  /** Required indicator (Plumage label asterisk, etc.) */
  @Prop() required: boolean = false;

  /**
   * Disable the timepicker.
   * - For <timepicker-component>: passed as `disableTimepicker`
   * - For <plumage-timepicker-component>: passed as `disabled`
   */
  @Prop() disableTimepicker: boolean = false;

  private commonProps() {
    // Use camelCase keys so Stencil sets component properties (not just attributes)
    return {
      ariaLabel: this.ariaLabel,
      ariaLabelledby: this.ariaLabelledby,
      showLabel: this.showLabel,
      labelText: this.labelText,
      inputId: this.inputId,
      inputName: this.inputName,
      isTwentyFourHourFormat: this.isTwentyFourHourFormat,
      size: this.size,

      // validation
      validationMessage: this.validationMessage,
      validation: this.validation,

      twentyFourHourOnly: this.twentyFourHourOnly,
      twelveHourOnly: this.twelveHourOnly,
      hideTimepickerBtn: this.hideTimepickerBtn,
      isValid: this.isValid,
      hideSeconds: this.hideSeconds,
      inputWidth: this.inputWidth,

      required: this.required,
    };
  }

  render() {
    const props = this.commonProps();

    if (this.usePlTimepicker) {
      // Plumage component uses `disabled` (not `disableTimepicker`)
      return <plumage-timepicker-component {...({ ...(props as any), disabled: this.disableTimepicker } as any)} />;
    }

    // Standard component uses `disableTimepicker`
    return <timepicker-component {...({ ...(props as any), disableTimepicker: this.disableTimepicker } as any)} />;
  }
}
