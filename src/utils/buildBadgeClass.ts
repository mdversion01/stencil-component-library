export function buildBadgeClass({
  base,
  backgroundColor,
  elevation,
  variant,
  size,
  shape,
  outlined,
  pulse,
  bordered,
  classNames
}: {
  base?: string;
  backgroundColor?: string;
  elevation?: string;
  variant?: string;
  size?: string;
  shape?: string;
  outlined?: boolean;
  pulse?: boolean;
  bordered?: boolean;
  classNames?: string;
}): string {
  return [
    base,
    backgroundColor && `bg-${backgroundColor}`,
    elevation && `elevated-${elevation}`,
    variant,
    size,
    shape,
    outlined && `outlined`,
    pulse && 'pulse',
    bordered && 'token-bordered',
    classNames
  ].filter(Boolean).join(' ');
}
