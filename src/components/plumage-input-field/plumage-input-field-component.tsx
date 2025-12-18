// src/components/plumage-input-field/plumage-input-field-component.tsx
import { Component, h, Prop, Element, State, Watch, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'plumage-input-field-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', './plumage-input-field-styles.scss'],
  shadow: false,
})
export class PlumageInputFieldComponent {
  @Element() host!: HTMLElement;

  // ----- Public props -----
  @Prop() disabled: boolean = false;
  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop() inputId: string = '';
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() label: string = '';
  @Prop() labelSize: 'base' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() required: boolean = false;
  @Prop() type: string = 'text';
  @Prop() validation: boolean = false;
  @Prop() validationMessage: string = '';
  @Prop() value: string = '';
  @Prop() placeholder?: string;

  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** NEW: responsive column class specs (e.g., "col-sm-3 col-md-4" or "xs-12 sm-8") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ----- Internal state -----
  @State() private validationState: boolean = false;
  @State() private valueState: string = '';
  @State() _resolvedFormId: string = '';
  private inputEl?: HTMLInputElement;

  // Let parents observe user edits (optional but handy)
  @Event() valueChange!: EventEmitter<string>;

  // ---------- watchers ----------
  @Watch('value')
  syncValue(v: string) {
    this.valueState = v ?? '';
  }

  @Watch('validation')
  syncValidation(newVal: boolean) {
    this.validationState = !!newVal;
  }

  // ---------- lifecycle ----------
  connectedCallback() {
    // Inherit from nearest <form-component> once (if not already set)
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

    // Seed internal mirrors from incoming props
    this.valueState = this.value ?? '';
    this.validationState = !!this.validation;

    // Restore underline behavior: collapse on outside click
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick, true);
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

  // ---------- underline/focus interactions ----------
  private handleInteraction = (event: Event) => {
    // avoid bubbling to the document’s outside-click handler
    event.stopPropagation();

    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    const input = this.host.querySelector<HTMLInputElement>('input.form-control');
    const isInputFocused = event.target === input;

    if (bFocusDiv) {
      if (isInputFocused) {
        // focused: expand underline from left
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      } else {
        // any other interaction inside container: still show focus bar
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      }
    }
  };

  private handleDocumentClick = () => {
    // clicked outside: collapse underline to center
    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  // ---------- utils ----------
  private camelCase(str: string) {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }

  /** Sanitize user-typed input: strip tags, remove control chars, trim, cap length. */
  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    // keep inner text, remove only angle brackets (so "Ber<lin>" → "Berlin")
    let v = value.replace(/[<>]/g, '');
    // remove control characters (except common whitespace)
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    // collapse whitespace
    v = v.replace(/\s+/g, ' ').trim();
    // cap length
    const MAX_LEN = 512;
    if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);
    return v;
  }

  // ---------- input/validation ----------
  private meetsTypingThreshold() {
    return (this.valueState || '').trim().length >= 3;
  }

  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  // Update *state* not the @Prop()s
  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;

    // Keep the form linkage via attribute (the DOM property is not meant to be assigned directly)
    if (this._resolvedFormId) target.setAttribute('form', this._resolvedFormId);
    else target.removeAttribute('form');

    // Sanitize and reflect sanitized text in UI
    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;

    // Update internal value mirror (NOT the @Prop())
    this.valueState = clean;
    this.valueChange.emit(this.valueState);

    // Live validation behavior
    if (this.meetsTypingThreshold() && this.validationState) {
      this.validationState = false;
    }
    if (this.required && this.valueState.trim() === '') {
      this.validationState = true;
    }
  };

  private handleBlur = () => {
    this.handleDocumentClick(); // collapse underline
    if (this.required) {
      this.validationState = !this.meetsTypingThreshold();
    }
  };

  // ---------- layout helpers ----------
  private isHorizontal() {
    return this.formLayout === 'horizontal';
  }
  private isInline() {
    return this.formLayout === 'inline';
  }

  private parseColsSpec(spec?: string): string {
    if (!spec) return '';
    const tokens = spec.trim().split(/\s+/);
    const out: string[] = [];

    for (const t of tokens) {
      if (!t) continue;
      if (/^col(-\w+)?(-\d+)?$/.test(t)) {
        out.push(t);
        continue;
      }
      if (/^\d{1,2}$/.test(t)) {
        const n = Math.max(1, Math.min(12, parseInt(t, 10)));
        out.push(`col-${n}`);
        continue;
      }
      const m = /^(xs|sm|md|lg|xl|xxl)-(\d{1,2})$/.exec(t);
      if (m) {
        const bp = m[1];
        const n = Math.max(1, Math.min(12, parseInt(m[2], 10)));
        out.push(bp === 'xs' ? `col-${n}` : `col-${bp}-${n}`);
        continue;
      }
      if (t === 'col') out.push('col');
    }
    return Array.from(new Set(out)).join(' ');
  }

  private buildColClass(kind: 'label' | 'input'): string {
    const spec = (kind === 'label' ? this.labelCols : this.inputCols)?.trim();

    if (this.isHorizontal()) {
      if (spec) return this.parseColsSpec(spec);
      if (kind === 'input' && this.labelHidden) {
        return this.inputCols ? this.parseColsSpec(this.inputCols) : 'col-12';
      }
      const num = kind === 'label' ? this.labelCol : this.inputCol;
      if (Number.isFinite(num)) {
        const n = Math.max(0, Math.min(12, Number(num)));
        if (n === 0) return '';
        return `col-${n}`;
      }
      return '';
    }

    if (this.isInline()) {
      return spec ? this.parseColsSpec(spec) : '';
    }

    return '';
  }

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
        '[plumage-input-field-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  // ---------- render bits ----------
  private renderInputLabel(ids: string, labelColClass?: string) {
    const classes = [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validationState ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    return (
      <label class={classes} htmlFor={ids || undefined}>
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : null}
      </label>
    );
  }

  private renderInput(ids: string, names: string) {
    const sizeClass = this.size === 'sm' ? 'form-control-sm' : this.size === 'lg' ? 'form-control-lg' : '';
    const classes = ['form-control', this.validationState ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');

    const placeholder = this.labelHidden ? this.label || this.placeholder || 'Placeholder Text' : this.label || this.placeholder || 'Placeholder Text';

    return (
      <div class="input-container" role="presentation" aria-labelledby={names || undefined} onClick={this.handleInteraction}>
        <input
          ref={el => (this.inputEl = el as HTMLInputElement)}
          id={ids || undefined}
          name={names || undefined}
          type={this.type || 'text'}
          class={classes}
          placeholder={placeholder}
          value={this.valueState || undefined}
          aria-label={this.labelHidden ? names : undefined}
          aria-labelledby={names || undefined}
          aria-describedby={this.validationState ? 'validationMessage' : undefined}
          disabled={this.disabled}
          required={this.required}
          onInput={this.handleInput}
          onFocus={this.handleInteraction}
          onBlur={this.handleBlur}
        />
        {/* Underline/focus bar */}
        <div class={`b-underline${this.validationState ? ' invalid' : ''}`} role="presentation">
          <div class={`b-focus${this.disabled ? ' disabled' : ''}${this.validationState ? ' invalid' : ''}`} role="presentation" aria-hidden="true" />
        </div>

        {this.validationState && this.validationMessage ? (
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
    if (this.isHorizontal()) groupClasses.push('row');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    // keep numeric validation behavior if string specs not in use
    this.getComputedCols();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    return (
      <div class={`plumage${outerClass}`}>
        <div class={groupClasses.join(' ')}>
          {this.renderInputLabel(ids, labelColClass)}
          {this.isHorizontal() ? <div class={inputColClass}>{this.renderInput(ids, names)}</div> : this.renderInput(ids, names)}
        </div>
      </div>
    );
  }
}
