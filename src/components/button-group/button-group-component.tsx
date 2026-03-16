// src/components/button-group/button-group.tsx
import { Component, Prop, h, Element } from '@stencil/core';

@Component({
  tag: 'button-group',
  styleUrl: 'button-group.scss',
  shadow: false,
})
export class ButtonGroup {
  @Element() hostEl!: HTMLElement;

  /** Accessible name via aria-label (used only if ariaLabelledby is not provided). */
  @Prop() ariaLabel: string = '';

  /** Accessible name via element id(s). Preferred when a visible label exists. */
  @Prop() ariaLabelledby?: string;

  /** Optional additional description id(s). */
  @Prop() ariaDescribedby?: string;

  /** Communicates a disabled state for the group (does not automatically disable children). */
  @Prop() disabled: boolean = false;

  @Prop() classNames: string = '';
  @Prop() vertical: boolean = false;

  private attr(v?: string) {
    return v && v.trim() ? v.trim() : undefined;
  }

  private getClassAttribute(): string {
    const baseClass = this.vertical ? 'btn-group-vertical' : 'btn-group';
    return [baseClass, this.classNames].filter(Boolean).join(' ');
  }

  render() {
    const classAttribute = this.getClassAttribute();

    const labelledby = this.attr(this.ariaLabelledby);
    const describedby = this.attr(this.ariaDescribedby);
    const label = this.attr(this.ariaLabel);

    // If consumer did not provide any labeling, provide a safe fallback name.
    // (Keeps SR output meaningful, avoids unlabeled group.)
    const effectiveAriaLabel = labelledby ? undefined : label || 'Button Group';

    return (
      <div
        role="group"
        class={classAttribute}
        aria-label={effectiveAriaLabel}
        aria-labelledby={labelledby}
        aria-describedby={describedby}
        aria-disabled={this.disabled ? 'true' : undefined}
      >
        <slot />
      </div>
    );
  }
}
