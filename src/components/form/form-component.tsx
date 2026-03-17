// src/components/form/form-component.tsx
import { Component, h, Prop, Element } from '@stencil/core';

@Component({
  tag: 'form-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss'],
  shadow: false,
})
export class FormComponent {
  @Element() host!: HTMLElement;

  /** Native form attributes */
  @Prop() action: string = '';
  @Prop() method: string = '';

  /** Render a fieldset wrapper (with optional legend) */
  @Prop() fieldset: boolean = false;
  @Prop() legend: boolean = false;

  // ⚠ Use inline union types so components.d.ts doesn’t reference unknown names
  @Prop() legendPosition: 'left' | 'center' | 'right' | string = 'left';
  @Prop() legendTxt: string = 'Add Title Here';
  @Prop() legendSize: 'small' | 'base' | 'large' | 'xlarge' | string = 'base';

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

  // ----------------------------
  // Optional accessibility hooks
  // ----------------------------
  @Prop() formAriaLabel?: string;
  @Prop() formAriaLabelledby?: string;
  @Prop() formAriaDescribedby?: string;

  @Prop() fieldsetAriaLabel?: string;
  @Prop() fieldsetAriaLabelledby?: string;
  @Prop() fieldsetAriaDescribedby?: string;

  private uid = `fc-${Math.random().toString(16).slice(2)}`;

  private legendId(): string {
    const base = (this.formId && String(this.formId).trim()) || this.uid;
    return `${base}__legend`;
  }

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

  // ✅ NEW: turn "a:b; c:d;" into { a: "b", c: "d" }
  private cssTextToStyleObject(cssText?: string): { [key: string]: string } | undefined {
    const txt = String(cssText || '').trim();
    if (!txt) return undefined;

    const out: { [key: string]: string } = {};
    // split by ;, then by first :
    for (const decl of txt.split(';')) {
      const d = decl.trim();
      if (!d) continue;
      const idx = d.indexOf(':');
      if (idx === -1) continue;

      const prop = d.slice(0, idx).trim();
      const value = d.slice(idx + 1).trim();
      if (!prop || !value) continue;

      // Keep CSS property names as-is (kebab-case is fine for Stencil style objects)
      out[prop] = value;
    }

    return Object.keys(out).length ? out : undefined;
  }

  private layoutClass(): string | undefined {
    if (this.formLayout === 'horizontal') return 'horizontal';
    if (this.formLayout === 'inline') return 'inline';
    return undefined;
  }

  private renderSlot() {
    return <slot name="formField"></slot>;
  }

  private renderLegend() {
    if (!this.legend) return null;

    const pos = this.legendPosition || 'left';
    const size = this.legendSize || 'base';
    const txt = this.legendTxt || 'Add Title Here';

    return (
      <legend id={this.legendId()} class={`${pos} ${size}`}>
        {txt}
      </legend>
    );
  }

  private renderBase() {
    if (this.outsideOfForm) {
      return <div data-form-id={this.formId || undefined}>{this.renderSlot()}</div>;
    }

    return (
      <form
        class={this.layoutClass()}
        action={this.action || undefined}
        id={this.formId || undefined}
        method={this.method || undefined}
        aria-label={this.formAriaLabel || undefined}
        aria-labelledby={this.formAriaLabelledby || undefined}
        aria-describedby={this.formAriaDescribedby || undefined}
      >
        {this.renderSlot()}
      </form>
    );
  }

  private renderWithFieldset(styleObj?: { [key: string]: string }) {
    const legendNode = this.renderLegend();

    const autoLabelledby =
      legendNode && !this.fieldsetAriaLabel && !this.fieldsetAriaLabelledby ? this.legendId() : undefined;

    const fieldsetEl = (
      <fieldset
        style={styleObj}
        aria-label={this.fieldsetAriaLabel || undefined}
        aria-labelledby={this.fieldsetAriaLabelledby || autoLabelledby}
        aria-describedby={this.fieldsetAriaDescribedby || undefined}
      >
        {legendNode}
        {this.renderSlot()}
      </fieldset>
    );

    if (this.outsideOfForm) return fieldsetEl;

    return (
      <form
        class={this.layoutClass()}
        action={this.action || undefined}
        id={this.formId || undefined}
        method={this.method || undefined}
        aria-label={this.formAriaLabel || undefined}
        aria-labelledby={this.formAriaLabelledby || undefined}
        aria-describedby={this.formAriaDescribedby || undefined}
      >
        {fieldsetEl}
      </form>
    );
  }

  render() {
    const cssText = this.computedCssText();
    const styleObj = this.cssTextToStyleObject(cssText);

    return this.fieldset ? this.renderWithFieldset(styleObj) : this.renderBase();
  }
}
