// src/components/timepicker/timepicker-manager-component.tsx
import { Component, h, Prop, Element } from '@stencil/core';

/**
 * Timepicker Manager
 * - Forwards props to either <timepicker-component> or <plumage-timepicker-component>
 * - a11y precedence: aria-labelledby (if provided) > aria-label
 * - Forwards aria-describedby to child; optionally merges in the child's validation message id
 *
 * NOTE:
 * 508 compliance depends primarily on the child component’s semantics/keyboard behavior.
 */
@Component({
  tag: 'timepicker-manager',
  shadow: false,
})
export class TimepickerManagerComponent {
  @Element() host!: HTMLElement;

  /* -----------------------------
   Accessibility (Overrides)
  ------------------------------ */

  /** Accessible name override via aria-label (used only when ariaLabelledby is NOT provided). */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;

  /** Accessible name override via aria-labelledby (space-separated ids). Takes precedence over aria-label. */
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;

  /** Optional description ids (space-separated). */
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  /* -----------------------------
   Label UI (delegated to children)
  ------------------------------ */

  @Prop() showLabel?: boolean;
  @Prop() labelText: string = 'Enter Time';

  /** ID to pass to inner input(s). Should be unique per instance. */
  @Prop() inputId: string = 'time-input';

  /** Name attribute for the inner input */
  @Prop() inputName: string = 'time';

  /* -----------------------------
   Behavior / Display
  ------------------------------ */

  @Prop() isTwentyFourHourFormat: boolean = true;
  @Prop() size: string = '';

  @Prop() twentyFourHourOnly: boolean = false;
  @Prop() twelveHourOnly: boolean = false;
  @Prop() hideTimepickerBtn: boolean = false;
  @Prop() hideSeconds: boolean = false;

  /** Choose which implementation to render */
  @Prop() usePlTimepicker: boolean = false;

  /** Width (px) for the input element */
  @Prop() inputWidth: number | string = null;

  /** Required indicator */
  @Prop() required: boolean = false;

  /**
   * Disable the timepicker.
   * - For <timepicker-component>: passed as `disableTimepicker`
   * - For <plumage-timepicker-component>: passed as `disabled`
   */
  @Prop() disableTimepicker: boolean = false;

  /* -----------------------------
   Validation
  ------------------------------ */

  @Prop() validationMessage: string = '';
  @Prop() validation?: boolean = false;
  @Prop() isValid: boolean = true;

  /* -----------------------------
   Internal helpers
  ------------------------------ */

  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }

  private joinIds(...ids: Array<string | undefined>): string | undefined {
    const tokens = ids
      .map(v => this.normalizeIdList(v))
      .filter(Boolean)
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!tokens.length) return undefined;

    const out: string[] = [];
    for (const t of tokens) if (!out.includes(t)) out.push(t);
    return out.join(' ');
  }

  /** Child component uses `${inputId}-validation` for its validation message container. */
  private getChildValidationId(): string {
    const base = (this.inputId || '').trim() || 'time-input';
    return `${base}-validation`;
  }

  private computeA11y() {
    const labelledBy = this.normalizeIdList(this.ariaLabelledby);
    const label = (this.ariaLabel ?? '').trim() || undefined;

    // Only add the child's validation id to describedby when we actually have a message to announce.
    const hasMsg = !!(this.validationMessage ?? '').trim();
    const validationId = hasMsg ? this.getChildValidationId() : undefined;

    const describedBy = this.joinIds(this.ariaDescribedby, validationId);

    return {
      ariaLabel: labelledBy ? undefined : label,
      ariaLabelledby: labelledBy,
      ariaDescribedby: describedBy,
    };
  }

  private commonProps() {
    const a11y = this.computeA11y();

    return {
      // a11y (forwarded to child props)
      ariaLabel: a11y.ariaLabel,
      ariaLabelledby: a11y.ariaLabelledby,
      ariaDescribedby: a11y.ariaDescribedby,

      // label+input identity
      showLabel: this.showLabel,
      labelText: this.labelText,
      inputId: this.inputId,
      inputName: this.inputName,

      // format/layout
      isTwentyFourHourFormat: this.isTwentyFourHourFormat,
      size: this.size,
      inputWidth: this.inputWidth,

      // validation flags
      validationMessage: this.validationMessage,
      validation: this.validation,
      isValid: this.isValid,

      // mode toggles
      twentyFourHourOnly: this.twentyFourHourOnly,
      twelveHourOnly: this.twelveHourOnly,
      hideTimepickerBtn: this.hideTimepickerBtn,
      hideSeconds: this.hideSeconds,

      required: this.required,
    };
  }

  render() {
    const props = this.commonProps();

    if (this.usePlTimepicker) {
      // Plumage component uses `disabled` (not `disableTimepicker`)
      return <plumage-timepicker-component {...({ ...(props as any), disabled: this.disableTimepicker } as any)} />;
    }

    return <timepicker-component {...({ ...(props as any), disableTimepicker: this.disableTimepicker } as any)} />;
  }
}
