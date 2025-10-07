import { h } from '@stencil/core';

export function renderTokenSpan({
  className,
  styles,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
}: {
  className: string;
  styles: { [key: string]: string };
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}) {
  return (
    <span
      class={className}
      role="status"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      aria-live="polite"
      aria-atomic="true"
      tabIndex={0}
      style={styles}
    >
      <slot name="token" />
    </span>
  );
}

