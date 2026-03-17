// src/components/divider/divider-component.tsx
import { Component, Prop, h, Element } from '@stencil/core';

@Component({
  tag: 'divider-component',
  styleUrl: 'divider.scss',
  shadow: false,
})
export class DividerComponent {
  @Element() host!: HTMLElement;

  @Prop() dashed: boolean = false;
  @Prop() plain: boolean = false;
  @Prop() orientation?: 'left' | 'right' | 'center';
  @Prop() removeOrientationMargin?: string;
  @Prop() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Prop() styles?: string;

  /**
   * Optional accessible label for the divider when it includes visible text.
   * If omitted, we derive it from the slotted text content.
   */
  @Prop() ariaLabel?: string;

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

  private getAriaOrientation(): 'horizontal' | 'vertical' {
    return this.direction === 'vertical' ? 'vertical' : 'horizontal';
  }

  private getSlottedText(): string {
    // Light DOM; slot content contributes to host.textContent.
    return (this.host.textContent || '').replace(/\s+/g, ' ').trim();
  }

  private getSeparatorA11yProps(withText: boolean): { [key: string]: any } {
    const props: { [key: string]: any } = {
      role: 'separator',
      'aria-orientation': this.getAriaOrientation(),
    };

    // Only name it when there is visible text.
    if (withText) {
      const name = (this.ariaLabel || this.getSlottedText() || '').trim();
      if (name) props['aria-label'] = name;
    }

    return props;
  }

  private renderWithText() {
    return (
      <div class={this.getClassNames('divider-horizontal')} {...this.getSeparatorA11yProps(true)}>
        <span class="divider-inner-text" style={this.getTextStyle()}>
          <slot></slot>
        </span>
      </div>
    );
  }

  private renderHorizontal() {
    return <div class={this.getClassNames('divider-horizontal')} {...this.getSeparatorA11yProps(false)}></div>;
  }

  private renderVertical() {
    // Keep your original class signature for vertical
    return <div class="divider divider-vertical" {...this.getSeparatorA11yProps(false)}></div>;
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
