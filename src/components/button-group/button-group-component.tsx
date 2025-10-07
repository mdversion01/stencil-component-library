// src/components/button-group/button-group.tsx
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'button-group',
  styleUrl: 'button-group.scss',
  // shadow: false,
})
export class ButtonGroup {
  @Prop() ariaLabel: string = '';
  @Prop() classNames: string = '';
  @Prop() vertical: boolean = false;

  private getClassAttribute(): string {
    const baseClass = this.vertical ? 'btn-group-vertical' : 'btn-group';
    return [baseClass, this.classNames].filter(Boolean).join(' ');
  }

  render() {
    const classAttribute = this.getClassAttribute();

    return (
      <div
        role="group"
        aria-label={this.ariaLabel || 'Button Group'}
        class={classAttribute}
      >
        <slot />
      </div>
    );
  }
}
