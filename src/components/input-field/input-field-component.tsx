// src/components/input-field/input-field-component.tsx
import { Component, h, Prop, Element, State, Watch, Event, EventEmitter, Fragment } from '@stencil/core';

@Component({
  tag: 'input-field-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', './input-field-styles.scss'],
  shadow: false,
})
export class InputFieldComponent {
  @Element() host!: HTMLElement;

  // ----- Props (unchanged signatures; do NOT mutate these directly) -----
  @Prop() disabled: boolean = false;
  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop() inputId: string = '';
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() label: string = '';
  @Prop() labelSize: '' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() readOnly: boolean = false;
  @Prop() required: boolean = false;
  @Prop() type: string = 'text';
  @Prop() validation: boolean = false; // external control
  @Prop() validationMessage: string = '';
  @Prop() value: string = ''; // external value
  @Prop() placeholder?: string;

  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** NEW: responsive column class specs (e.g., "col", "col-sm-3 col-md-4", or "xs-12 sm-6 md-4") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ----- Internal state mirrors (OK to mutate) -----
  @State() private valueState: string = '';
  @State() private validationState: boolean = false;

  // Internal
  @State() _resolvedFormId: string = '';
  private inputEl?: HTMLInputElement;

  // Stable per-instance uid (prevents duplicate IDs)
  private uid = `ifc-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
  private ids = {
    input: '',
    label: '',
    desc: '',
    validation: '',
  };

  // (Optional) let parents listen for value changes
  @Event() valueChange!: EventEmitter<string>;

  // Keep state in sync when parent updates props
  @Watch('value')
  onValuePropChange(newVal: string) {
    this.valueState = newVal ?? '';
  }
  @Watch('validation')
  onValidationPropChange(newVal: boolean) {
    this.validationState = !!newVal;
  }

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

    // seed resolved form id early
    this._resolvedFormId = this.formId || '';

    // seed state from incoming props
    this.valueState = this.value ?? '';
    this.validationState = !!this.validation;

    // compute unique ids
    this.computeIds();
  }

  componentDidLoad() {
    this.applyFormAttribute();
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._resolvedFormId = newVal || '';
    this.applyFormAttribute();
  }

  @Watch('inputId')
  onInputIdChange() {
    this.computeIds();
  }

  private computeIds() {
    // Prefer explicit inputId if provided; otherwise use per-instance uid.
    const base =
      (this.inputId && String(this.inputId).trim()) ||
      (this.label && this.camelCase(this.label)) ||
      this.uid;

    // Ensure final base is selector/id safe enough
    const safeBase = String(base).replace(/\s+/g, '').replace(/[^A-Za-z0-9\-_:.]/g, '');
    this.ids.input = safeBase;
    this.ids.label = `${safeBase}__label`;
    this.ids.desc = `${safeBase}__desc`;
    this.ids.validation = `${safeBase}__validation`;
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

  /** Sanitize user-typed input: strip tags, remove control chars, trim, cap length. */
  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    let v = value.replace(/<[^>]*>/g, '');
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    v = v.replace(/\s+/g, ' ').trim();
    const MAX_LEN = 512;
    if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);
    return v;
  }

  private meetsTypingThreshold() {
    return (this.valueState || '').trim().length >= 3;
  }

  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  // ----- Input handlers: update *state*, not @Prop()s -----
  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;

    // Keep the form linkage via attribute (form property is read-only)
    if (this._resolvedFormId) target.setAttribute('form', this._resolvedFormId);
    else target.removeAttribute('form');

    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;

    this.valueState = clean;
    this.valueChange.emit(this.valueState);

    if (this.meetsTypingThreshold() && this.validationState) {
      this.validationState = false;
    }
    if (this.required && this.valueState.trim() === '') {
      this.validationState = true;
    }
  };

  private handleBlur = () => {
    if (this.required) {
      this.validationState = !this.meetsTypingThreshold();
    }
  };

  // ----- Layout helpers -----
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
        out.push(`col-${Math.max(1, Math.min(12, parseInt(t, 10)))}`);
        continue;
      }
      const m = /^(xs|sm|md|lg|xl|xxl)-(\d{1,2})$/.exec(t);
      if (m) {
        out.push(m[1] === 'xs' ? `col-${m[2]}` : `col-${m[1]}-${m[2]}`);
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

    if (this.isInline()) return spec ? this.parseColsSpec(spec) : '';
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
      // eslint-disable-next-line no-console
      console.error(
        '[input-field-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  // ---------------------------
  // Accessibility helpers
  // ---------------------------

  private renderHelpText() {
    // Always present so aria-describedby always resolves.
    const labelText = (this.label || 'this field').trim();
    const typeText = (this.type || 'text').trim();
    const msg = `Enter ${labelText}. Type: ${typeText}.`;
    return (
      <div id={this.ids.desc} class="sr-only">
        {msg}
      </div>
    );
  }

  private renderValidation() {
    if (!this.validationState || !this.validationMessage) return null;
    return (
      <div
        id={this.ids.validation}
        class="invalid-feedback form-text"
        aria-live="polite"
        aria-atomic="true"
      >
        {this.validationMessage}
      </div>
    );
  }

  // ----- Render bits -----
  private renderInputLabel(labelColClass?: string) {
    const classes = [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.isInline() ? `col-form-label` : '',
      this.validationState ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    return (
      <label
        id={this.ids.label}
        class={classes}
        htmlFor={this.ids.input || undefined}
      >
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : null}
      </label>
    );
  }

  private renderInput() {
    const sizeClass = this.size === 'sm' ? 'form-control-sm' : this.size === 'lg' ? 'form-control-lg' : '';
    const classes = ['form-control', this.validationState ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');

    const placeholder = (this.placeholder && this.placeholder.trim().length > 0 ? this.placeholder : this.label) || 'Placeholder Text';

    // aria-describedby should always include help text; include validation id when present
    const describedBy = [
      this.ids.desc,
      this.validationState && this.validationMessage ? this.ids.validation : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Fragment>
        {this.renderHelpText()}

        <input
          ref={(el) => {
            this.inputEl = el as HTMLInputElement;
            this.applyFormAttribute();
          }}
          id={this.ids.input || undefined}
          name={(this.label && this.camelCase(this.label)) || undefined}
          type={this.type || 'text'}
          class={classes}
          placeholder={placeholder}
          value={this.valueState || ''}
          // Label association: always via label/id
          aria-labelledby={this.ids.label}
          aria-describedby={describedBy || undefined}
          aria-invalid={this.validationState ? 'true' : undefined}
          disabled={this.disabled}
          required={this.required}
          readOnly={this.readOnly}
          onInput={this.handleInput}
          onBlur={this.handleBlur}
        />

        {this.renderValidation()}
      </Fragment>
    );
  }

  render() {
    // Keep numeric validation behavior if string specs not in use
    this.getComputedCols();

    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const groupClasses = ['form-group'];
    if (this.isHorizontal()) groupClasses.push('row');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal()
      ? this.buildColClass('input') || undefined
      : this.isInline()
        ? this.buildColClass('input') || undefined
        : undefined;

    return (
      <div class={outerClass}>
        <div class={groupClasses.join(' ')}>
          {this.renderInputLabel(labelColClass)}

          {this.isHorizontal() ? (
            <div class={inputColClass}>{this.renderInput()}</div>
          ) : (
            this.renderInput()
          )}
        </div>
      </div>
    );
  }
}
