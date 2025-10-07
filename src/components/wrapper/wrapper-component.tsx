// src/components/wrapper/wrapper.tsx
import { Component, h, Prop, Element } from '@stencil/core';

@Component({
  tag: 'app-wrapper',
  styleUrl: 'wrapper.scss',
  shadow: false, // ✅ important so global.scss works inside
})
export class AppWrapper {
  @Element() el: HTMLElement;

  /**
   * Optional classNames (e.g. bg-primary, p-4)
   */
  @Prop() classNames: string = '';

  render() {
    return (
      <div class={`app-wrapper ${this.classNames}`}>
        <slot />
      </div>
    );
  }
}
