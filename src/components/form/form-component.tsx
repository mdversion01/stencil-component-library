// src/components/form/form-component.tsx
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'form-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss'],
  shadow: false,
})
export class FormComponent {
  /** Native form attributes */
  @Prop() action: string = '';
  @Prop() method: string = '';

  /** Render a fieldset wrapper (with optional legend) */
  @Prop() fieldset: boolean = false;
  @Prop() legend: boolean = false;

  // ⚠ Use inline union types so components.d.ts doesn’t reference unknown names
  @Prop() legendPosition: 'left' | 'center' | 'right' | string = 'left';
  @Prop() legendTxt: string = 'Add Title Here';

  /** Layout + identity used by slotted children */
  @Prop() formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop() formId: string = '';

  /**
   * If true, do not render a <form>. Inputs placed outside the form can still
   * read formId via closest('form-component') and set their own form attribute.
   */
  @Prop() outsideOfForm: boolean = false;

  /** Optional border/box styling */
  @Prop() bcolor: string = '';
  @Prop() bradius?: number;
  @Prop() bstyle: string = '';
  @Prop() bwidth?: number;

  /** Additional inline styles to append (CSS string) */
  @Prop() styles: string = '';

  private computedCssText(): string {
    const parts: string[] = [];
    if (this.bcolor) parts.push(`border-color:${this.bcolor};`);
    if (this.bstyle) parts.push(`border-style:${this.bstyle};`);
    if (this.bwidth != null && !Number.isNaN(this.bwidth)) parts.push(`border-width:${this.bwidth}px;`);
    if (this.bradius != null && !Number.isNaN(this.bradius)) parts.push(`border-radius:${this.bradius}px;`);
    const dynamic = parts.join(' ');
    const extra = (this.styles || '').trim();
    return [extra, dynamic].filter(Boolean).join(' ');
  }

  private layoutClass(): string | undefined {
    if (this.formLayout === 'horizontal') return 'horizontal';
    if (this.formLayout === 'inline') return 'inline';
    return undefined;
  }

  private renderSlot() {
    // Children use closest('form-component') to read formId/formLayout.
    return <slot name="formField"></slot>;
  }

  private renderBase() {
    if (this.outsideOfForm) {
      // No invalid <div form="...">; optionally expose a data attribute if you want a hook.
      return <div data-form-id={this.formId || undefined}>{this.renderSlot()}</div>;
    }
    return (
      <form
        class={this.layoutClass()}
        action={this.action || undefined}
        id={this.formId || undefined}
        method={this.method || undefined}
      >
        {this.renderSlot()}
      </form>
    );
    }

  private renderWithFieldset(cssText: string) {
    if (this.outsideOfForm) {
      return (
        <fieldset style={{ cssText }}>
          {this.legend ? <legend class={this.legendPosition || 'left'}>{this.legendTxt || 'Add Title Here'}</legend> : null}
          {this.renderSlot()}
        </fieldset>
      );
    }
    return (
      <form
        class={this.layoutClass()}
        action={this.action || undefined}
        id={this.formId || undefined}
        method={this.method || undefined}
      >
        <fieldset style={{ cssText }}>
          {this.legend ? <legend class={this.legendPosition || 'left'}>{this.legendTxt || 'Add Title Here'}</legend> : null}
          {this.renderSlot()}
        </fieldset>
      </form>
    );
  }

  render() {
    const cssText = this.computedCssText();
    return this.fieldset ? this.renderWithFieldset(cssText) : this.renderBase();
  }
}
