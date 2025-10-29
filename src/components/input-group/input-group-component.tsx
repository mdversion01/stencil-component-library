// src/components/input-group/input-group-component.tsx
import { Component, h, Prop, Element, State, Event, EventEmitter, Watch } from '@stencil/core';

@Component({
  tag: 'input-group-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', '../input-field/input-field-styles.scss', './input-group-styles.scss'],
  shadow: false,
})
export class InputGroupComponent {
  @Element() el!: HTMLElement;

  // ----- Props -----
  // Reserved attribute names mapped to safe prop names
  @Prop({ attribute: 'append' }) hasAppend: boolean = false;
  @Prop() appendId: string = '';

  @Prop() disabled: boolean = false;

  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';

  @Prop() icon: string = '';
  // props (add these)
  @Prop() prependIcon?: string;
  @Prop() appendIcon?: string;

  @Prop() inputId: string = '';

  /** Kept for API parity; use `size` for visual sizing */
  @Prop() inputSize: string = '';

  @Prop() label: string = '';
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() otherContent: boolean = false;
  @Prop() placeholder: string = '';

  @Prop({ attribute: 'prepend' }) hasPrepend: boolean = false;
  @Prop() prependId: string = '';

  @Prop() required: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() type: string = '';

  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';

  @Prop({ mutable: true }) value: string = '';

  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** NEW: responsive column class specs (e.g., "col", "col-sm-3 col-md-4", or "xs-12 sm-6 md-4") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  @State() _computedFormId: string = '';

  private inputEl?: HTMLInputElement;

  // Avoid event name collision with native "change"
  @Event() valueChange: EventEmitter<{ value: string }>;

  // ----- Form-component interop (mirrors input-field-component) -----
  connectedCallback() {
    const formComponent = this.el.closest('form-component') as any;

    const fcFormId = formComponent?.formId;
    const fcLayout = formComponent?.formLayout;

    // Inherit only if not explicitly set
    if (!this.formId && typeof fcFormId === 'string') this.formId = fcFormId;

    if (!this.formLayout && typeof fcLayout === 'string') {
      const allowed = ['', 'horizontal', 'inline'] as const;
      if ((allowed as readonly string[]).includes(fcLayout)) {
        this.formLayout = fcLayout as '' | 'horizontal' | 'inline';
      }
    }

    // Cache for render bindings (kept for compatibility with previous version)
    this._computedFormId = this.formId || '';
  }

  componentDidLoad() {
    this.applyFormAttribute();
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._computedFormId = newVal || '';
    this.applyFormAttribute();
  }

  private applyFormAttribute() {
    if (!this.inputEl) return;
    if (this._computedFormId) this.inputEl.setAttribute('form', this._computedFormId);
    else this.inputEl.removeAttribute('form');
  }

  // ----- Handlers -----
  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;

    // Keep the real input’s form association in sync (like input-field-component)
    if (this._computedFormId) {
      const form = (target as any).form || document.getElementById(this._computedFormId);
      if (form) (target as any).form = form;
    } else {
      (target as any).form = null;
    }

    this.value = target.value;

    // Stencil event
    this.valueChange.emit({ value: this.value });

    // Back-compat: also dispatch a native "change" CustomEvent like the Lit version did
    this.el.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
  };

  // ----- Utils -----
  private camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }

  // ----- Layout helpers (ported from input-field-component) -----
  private isHorizontal() {
    return this.formLayout === 'horizontal';
  }
  private isInline() {
    return this.formLayout === 'inline';
  }

  /** Parse responsive column spec into Bootstrap classes. */
  private parseColsSpec(spec?: string): string {
    if (!spec) return '';
    const tokens = spec.trim().split(/\s+/);
    const out: string[] = [];

    for (const t of tokens) {
      if (!t) continue;

      // Already a bootstrap col class
      if (/^col(-\w+)?(-\d+)?$/.test(t)) {
        out.push(t);
        continue;
      }
      // Number only -> col-N
      if (/^\d{1,2}$/.test(t)) {
        const n = Math.max(1, Math.min(12, parseInt(t, 10)));
        out.push(`col-${n}`);
        continue;
      }
      // breakpoint-number -> col-bp-n (xs means no bp prefix)
      const m = /^(xs|sm|md|lg|xl|xxl)-(\d{1,2})$/.exec(t);
      if (m) {
        const bp = m[1];
        const n = Math.max(1, Math.min(12, parseInt(m[2], 10)));
        out.push(bp === 'xs' ? `col-${n}` : `col-${bp}-${n}`);
        continue;
      }
      if (t === 'col') {
        out.push('col');
        continue;
      }
      // Unknown token -> ignore
    }

    return Array.from(new Set(out)).join(' ');
  }

  /** Build final col class (string spec > numeric fallback > special cases). */
  private buildColClass(kind: 'label' | 'input'): string {
    const spec = (kind === 'label' ? this.labelCols : this.inputCols)?.trim();

    if (this.isHorizontal()) {
      if (spec) return this.parseColsSpec(spec);

      // If label is visually hidden, default input to full width (unless user provides inputCols)
      if (kind === 'input' && this.labelHidden) {
        return this.inputCols ? this.parseColsSpec(this.inputCols) : 'col-12';
      }

      // Fallback to numeric cols
      const num = kind === 'label' ? this.labelCol : this.inputCol;
      if (Number.isFinite(num)) {
        const n = Math.max(0, Math.min(12, Number(num)));
        if (n === 0) return '';
        return `col-${n}`;
      }
      return '';
    }

    // Inline layout: allow user-provided classes, else no grid class
    if (this.isInline()) {
      return spec ? this.parseColsSpec(spec) : '';
    }

    // Stacked layout: no grid classes
    return '';
  }

  /** Legacy numeric validation helper (used only when string specs are not provided). */
  private getComputedCols() {
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;

    if (this.isHorizontal() && this.labelHidden) return { label: 0, input: 12 };

    const lbl = Number(this.labelCol);
    const inp = Number(this.inputCol);
    const label = Number.isFinite(lbl) ? Math.max(1, Math.min(11, lbl)) : DEFAULT_LABEL;
    const input = Number.isFinite(inp) ? Math.max(1, Math.min(11, inp)) : DEFAULT_INPUT;

    if (this.isHorizontal() && !this.labelCols && !this.inputCols && label + input !== 12) {
      console.error(
        '[input-group-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  // ----- Classes -----
  private labelClasses(labelColClass?: string) {
    return [
      'form-control-label',
      this.required ? 'required' : '',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validation ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    const sizeClass = this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '';
    return ['form-control', this.validation ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
  }

  private groupSizeClass() {
    return this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
  }

  // ----- Render pieces -----
  private renderInputLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    return (
      <label class={this.labelClasses(labelColClass)} htmlFor={ids || undefined}>
        {text}
        {this.required ? '*' : ''}
      </label>
    );
  }

  private renderInputBlock(ids: string, names: string) {
    const placeholder = this.labelHidden ? this.placeholder || this.label || 'Placeholder Text' : this.placeholder || this.label || 'Placeholder Text';

    const ariaDescribedBy = this.validation ? `${ids}-validation` : undefined;

    return (
      <div class={{ 'input-group': true, [this.groupSizeClass()]: !!this.groupSizeClass(), 'is-invalid': this.validation }}>
        {/* Prepend */}
        {this.hasPrepend ? (
          <div class={{ 'input-group-prepend': true, 'is-invalid': this.validation }}>
            {(() => {
              const sideIcon = this.prependIcon ?? this.icon; // ← side-specific wins, then global, else slot
              if (sideIcon) {
                return (
                  <span class="input-group-text">
                    <i class={sideIcon} />
                  </span>
                );
              }
              return this.otherContent ? (
                <slot name="prepend" />
              ) : (
                <span class="input-group-text" id={this.prependId || undefined}>
                  <slot name="prepend" />
                </span>
              );
            })()}
          </div>
        ) : null}

        {/* Input */}
        <input
          ref={el => (this.inputEl = el as HTMLInputElement)}
          type={this.type || 'text'}
          class={this.inputClasses()}
          placeholder={placeholder}
          id={ids || undefined}
          name={names || undefined}
          value={this.value}
          aria-label={this.labelHidden ? names || undefined : undefined}
          aria-labelledby={names || undefined}
          aria-describedby={ariaDescribedBy}
          disabled={this.disabled}
          form={this._computedFormId || undefined}
          onInput={this.handleInput}
        />

        {/* Append */}
        {this.hasAppend ? (
          <div class={{ 'input-group-append': true, 'is-invalid': this.validation }}>
            {(() => {
              const sideIcon = this.appendIcon ?? this.icon; // ← side-specific wins, then global, else slot
              if (sideIcon) {
                return (
                  <span class="input-group-text">
                    <i class={sideIcon} />
                  </span>
                );
              }
              return this.otherContent ? (
                <slot name="append" />
              ) : (
                <span class="input-group-text" id={this.appendId || undefined}>
                  <slot name="append" />
                </span>
              );
            })()}
          </div>
        ) : null}
      </div>
    );
  }

  private renderValidation(ids: string) {
    if (!this.validation || !this.validationMessage) return null;
    return (
      <div id={`${ids}-validation`} class="invalid-feedback" aria-live="polite">
        {this.validationMessage}
      </div>
    );
  }

  // ----- Render root -----
  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const groupClasses = ['form-group', 'form-input-group-basic'];

    if (this.isHorizontal()) groupClasses.push('row', 'horizontal');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    // Numeric validation (kept for parity when string specs not used)
    this.getComputedCols();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    return (
      <div class={outerClass}>
        <div class={groupClasses.join(' ')}>
          {this.renderInputLabel(ids, labelColClass)}
          {this.isHorizontal() ? (
            <div class={inputColClass}>
              {this.renderInputBlock(ids, names)}
              {this.renderValidation(ids)}
            </div>
          ) : (
            <div>
              {this.renderInputBlock(ids, names)}
              {this.renderValidation(ids)}
            </div>
          )}
        </div>
      </div>
    );
  }
}
