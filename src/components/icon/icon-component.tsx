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

  @Prop() iconAriaLabel?: string;          // ✅ renamed
  @Prop() iconAriaHidden: boolean = true;  // ✅ renamed

  private getDynamicStyle(): { [key: string]: string } | undefined {
    const styleObj: { [key: string]: string } = {};
    if (this.iconSize) {
      styleObj['font-size'] = `${this.iconSize}px`;
    }
    if (this.color) {
      styleObj['color'] = this.color;
    }
    return Object.keys(styleObj).length > 0 ? styleObj : undefined;
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

    return (
      <i
        class={baseClasses}
        aria-hidden={this.iconAriaHidden ? 'true' : 'false'}
        aria-label={this.iconAriaLabel || undefined}
        style={dynamicStyle}
      ></i>
    );
  }
}
