// src/components/icon/icon-component.tsx

import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'icon-component',
  styleUrl: 'icon.scss',
  shadow: false,
})
export class IconComponent {
  @Prop() icon: string = '';
  @Prop() iconMargin: string = '';
  @Prop() size: string = '';
  @Prop() tokenIcon: boolean = false;
  @Prop() iconSize?: number;
  @Prop() color?: string;

  /**
   * Accessibility:
   * - Decorative by default: aria-hidden="true"
   * - Meaningful icon: set iconAriaHidden={false} AND provide iconAriaLabel
   */
  @Prop() iconAriaLabel?: string;
  @Prop() iconAriaHidden: boolean = true;

  private warnedMissingLabel = false;

  private getDynamicStyle(): { [key: string]: string } | undefined {
    const styleObj: { [key: string]: string } = {};
    if (this.iconSize != null && !Number.isNaN(this.iconSize)) {
      styleObj['font-size'] = `${this.iconSize}px`;
    }
    if (this.color) {
      styleObj['color'] = this.color;
    }
    return Object.keys(styleObj).length > 0 ? styleObj : undefined;
  }

  private getA11y() {
    const label = (this.iconAriaLabel || '').trim();

    // Default: decorative
    if (this.iconAriaHidden) {
      return {
        ariaHidden: 'true' as const,
        ariaLabel: undefined as string | undefined,
        role: undefined as string | undefined,
      };
    }

    // Author explicitly wants an exposed (non-hidden) icon.
    // For 508/axe: ensure it has an accessible name.
    if (!label) {
      if (!this.warnedMissingLabel) {
        this.warnedMissingLabel = true;
        // eslint-disable-next-line no-console
        console.warn(
          '[icon-component] iconAriaHidden=false requires a non-empty iconAriaLabel. Falling back to aria-hidden="true".',
        );
      }
      return {
        ariaHidden: 'true' as const,
        ariaLabel: undefined as string | undefined,
        role: undefined as string | undefined,
      };
    }

    return {
      ariaHidden: 'false' as const,
      ariaLabel: label,
      role: 'img' as const,
    };
  }

  render() {
    const dynamicStyle = this.getDynamicStyle();

    const baseClasses = [
      this.icon,
      this.size,
      this.tokenIcon ? 'token-icon' : '',
      this.iconMargin === 'left' ? 'ms-1' : '',
      this.iconMargin === 'right' ? 'me-1' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const a11y = this.getA11y();

    return (
      <i
        class={baseClasses}
        // Accessibility rules:
        // - If decorative: aria-hidden="true" and no aria-label/role
        // - If meaningful: aria-hidden="false", role="img", aria-label="..."
        aria-hidden={a11y.ariaHidden}
        aria-label={a11y.ariaLabel}
        role={a11y.role}
        style={dynamicStyle}
      ></i>
    );
  }
}
