// src/components/divider/divider-component.tsx
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'divider-component',
  styleUrl: 'divider.scss',
  shadow: false,
})
export class DividerComponent {
  @Prop() dashed: boolean = false;
  @Prop() plain: boolean = false;
  @Prop() orientation?: 'left' | 'right' | 'center';
  @Prop() removeOrientationMargin?: string;
  @Prop() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Prop() styles?: string;

  private getTextStyle(): { [key: string]: string } | undefined {
    if (!this.styles) return undefined;

    return this.styles.split(';').reduce((acc, pair) => {
      const [key, value] = pair.split(':');
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {} as { [key: string]: string });
  }


  private getClassNames(base: string) {
    return [
      'divider',
      base,
      this.dashed && 'divider-dashed',
      this.plain && 'divider-plain',
      this.orientation === 'left' && 'divider-with-text-left',
      this.orientation === 'right' && 'divider-with-text-right',
      this.orientation === 'center' && 'divider-with-text-center',
      this.orientation && 'divider-with-text',
      this.removeOrientationMargin === 'left' && 'divider-no-default-orientation-margin-left',
      this.removeOrientationMargin === 'right' && 'divider-no-default-orientation-margin-right',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private renderWithText() {
    return (
      <div
        class={this.getClassNames('divider-horizontal')}
        role="separator"
      >
        <span class="divider-inner-text" style={this.getTextStyle()}>
          <slot></slot>
        </span>
      </div>
    );
  }

  private renderHorizontal() {
    return (
      <div
        class={this.getClassNames('divider-horizontal')}
        role="separator"
      ></div>
    );
  }

  private renderVertical() {
    return (
      <div
        class="divider divider-vertical"
        role="separator"
      ></div>
    );
  }

  render() {
    if (this.orientation === 'left' || this.orientation === 'right' || this.orientation === 'center') {
      return this.renderWithText();
    }

    if (this.direction === 'vertical') {
      return this.renderVertical();
    }

    return this.renderHorizontal();
  }
}
