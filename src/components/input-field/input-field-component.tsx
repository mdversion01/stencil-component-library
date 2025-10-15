// src/components/input-field/input-field-component.tsx
import { Component, h, Prop, Element, State, Watch } from '@stencil/core';

@Component({
  tag: 'input-field-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', './input-field-styles.scss'],
  shadow: false,
})
export class InputFieldComponent {
  @Element() host!: HTMLElement;

  // ----- Props -----
  @Prop() disabled: boolean = false;
  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop() inputId: string = '';
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() label: string = '';
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() required: boolean = false;
  @Prop() type: string = 'text';
  @Prop() validation: boolean = false;
  @Prop() validationMessage: string = '';
  @Prop() value: string = '';
  @Prop() placeholder?: string;

  /** Bootstrap grid columns for label when formLayout="horizontal" (default 2) */
  @Prop() labelCol: number = 2;
  /** Bootstrap grid columns for input when formLayout="horizontal" (default 10) */
  @Prop() inputCol: number = 10;

  // Internal
  @State() _resolvedFormId: string = '';
  private inputEl?: HTMLInputElement;

  connectedCallback() {
    const formComponent = this.host.closest('form-component') as any;
    const fcFormId = formComponent?.formId;
    const fcLayout = formComponent?.formLayout;

    if (!this.formId && typeof fcFormId === 'string') this.formId = fcFormId;

    if (!this.formLayout && typeof fcLayout === 'string') {
      const allowed = ['', 'horizontal', 'inline'] as const;
      if ((allowed as readonly string[]).includes(fcLayout)) {
        this.formLayout = fcLayout as '' | 'horizontal' | 'inline';
      }
    }
  }

  componentDidLoad() {
    this.applyFormAttribute();
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._resolvedFormId = newVal || '';
    this.applyFormAttribute();
  }

  private applyFormAttribute() {
    if (!this.inputEl) return;
    if (this._resolvedFormId) this.inputEl.setAttribute('form', this._resolvedFormId);
    else this.inputEl.removeAttribute('form');
  }

  private camelCase(str: string) {
    if (!str) return '';
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
      .replace(/\s+/g, '');
  }

  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    if (this._resolvedFormId) {
      const form = (target as any).form || document.getElementById(this._resolvedFormId);
      if (form) (target as any).form = form;
    } else {
      (target as any).form = null;
    }
    this.value = target.value;
  };

  /** Compute safe label/input col classes without mutating props. */
  private getComputedCols() {
    // Defaults
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;

    // Parse numbers + clamp to [1..11] for label and input
    const lbl = Number(this.labelCol);
    const inp = Number(this.inputCol);
    const label = Number.isFinite(lbl) ? Math.max(1, Math.min(11, lbl)) : DEFAULT_LABEL;
    const input = Number.isFinite(inp) ? Math.max(1, Math.min(11, inp)) : DEFAULT_INPUT;

    if (this.formLayout === 'horizontal') {
      if (label + input !== 12) {
        // ❗ Do NOT mutate props; just log and fall back to defaults
        console.error(
          '[input-field-component] For formLayout="horizontal", label-col + input-col must equal 12 exactly. ' +
            `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. ` +
            'Falling back to 2/10.'
        );
        return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
      }
    }

    return { label, input };
  }

  private renderInputLabel(ids: string, labelColClass?: string) {
    const classes = [
      'form-control-label',
      this.required ? 'required' : '',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.formLayout === 'horizontal' ? `${labelColClass} no-padding col-form-label` : '',
      this.validation ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.formLayout === 'horizontal' || this.formLayout === 'inline' ? `${this.label}:` : this.label;

    return (
      <label class={classes} htmlFor={ids || undefined}>
        {text}
      </label>
    );
  }

  private renderInput(ids: string, names: string) {
    const sizeClass = this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '';
    const classes = ['form-control', this.validation ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');

    const placeholder = this.labelHidden
      ? this.label || this.placeholder || 'Placeholder Text'
      : this.label || this.placeholder || 'Placeholder Text';

    return (
      <div>
        <input
          ref={el => (this.inputEl = el as HTMLInputElement)}
          id={ids || undefined}
          name={names || undefined}
          type={this.type || 'text'}
          class={classes}
          placeholder={placeholder}
          value={this.value || undefined}
          aria-label={this.labelHidden ? names : undefined}
          aria-labelledby={names || undefined}
          aria-describedby={this.validation ? 'validationMessage' : undefined}
          disabled={this.disabled}
          required={this.required}
          onInput={this.handleInput}
        />
        {this.validation && this.validationMessage ? (
          <div id="validationMessage" class="invalid-feedback form-text">
            {this.validationMessage}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';

    const groupClasses = ['form-group'];
    if (this.formLayout === 'horizontal') groupClasses.push('row');
    else if (this.formLayout === 'inline') groupClasses.push('row', 'inline');

    const { label, input } = this.getComputedCols();
    const labelColClass = `col-${label}`;
    const inputColClass = `col-${input}`;

    return (
      <div class={outerClass}>
        <div class={groupClasses.join(' ')}>
          {this.renderInputLabel(ids, labelColClass)}
          {this.formLayout === 'horizontal' ? (
            <div class={inputColClass}>{this.renderInput(ids, names)}</div>
          ) : (
            this.renderInput(ids, names)
          )}
        </div>
      </div>
    );
  }
}
