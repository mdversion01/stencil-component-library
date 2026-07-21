// File: src/components/textarea-component/textarea-component.tsx
import { Component, h, Prop, Element, State, Watch, Event, EventEmitter, Fragment } from '@stencil/core';

@Component({
  tag: 'textarea-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', '../input-field/input-field-styles.scss', './textarea-component-styles.scss'],
  shadow: false,
})
export class TextareaComponent {
  @Element() host!: HTMLElement;

  // ----- Props -----
  @Prop() disabled: boolean = false;
  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop() inputId: string = '';
  @Prop() textareaTextSize: '' | 'sm' | 'lg' = '';
  @Prop() label: string = '';
  @Prop() labelSize: '' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() readOnly: boolean = false;
  @Prop() required: boolean = false;
  @Prop() validation: boolean = false;
  @Prop() validationMessage: string = '';
  @Prop({ mutable: true }) value: string = '';
  @Prop() placeholder?: string;
  @Prop() rows: number = 3;
  @Prop() maxLength?: number;

  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ----- Internal state mirrors -----
  @State() private valueState: string = '';
  @State() private validationState: boolean = false;
  @State() private _resolvedFormId: string = '';

  private textareaEl?: HTMLTextAreaElement;

  // Stable per-instance uid
  private uid = `tac-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
  private ids = {
    textarea: '',
    label: '',
    desc: '',
    validation: '',
    counter: '',
  };

  @Event() valueChange!: EventEmitter<string>;
  @Event() blurChange!: EventEmitter<string>;

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

    this._resolvedFormId = this.formId || '';
    this.valueState = this.value ?? '';
    this.validationState = !!this.validation;

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
    const base =
      (this.inputId && String(this.inputId).trim()) ||
      (this.label && this.camelCase(this.label)) ||
      this.uid;

    const safeBase = String(base).replace(/\s+/g, '').replace(/[^A-Za-z0-9\-_:.]/g, '');
    this.ids.textarea = safeBase;
    this.ids.label = `${safeBase}__label`;
    this.ids.desc = `${safeBase}__desc`;
    this.ids.validation = `${safeBase}__validation`;
    this.ids.counter = `${safeBase}__counter`;
  }

  private applyFormAttribute() {
    if (!this.textareaEl) return;
    if (this._resolvedFormId) this.textareaEl.setAttribute('form', this._resolvedFormId);
    else this.textareaEl.removeAttribute('form');
  }

  private camelCase(str: string) {
    if (!str) return '';
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
      .replace(/\s+/g, '');
  }

  /** Keep line breaks for textarea; only strip tags/control chars and cap length. */
  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';

    let v = value.replace(/<[^>]*>/g, '');
    v = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    v = v.replace(/\r\n/g, '\n');

    const max = this.getNormalizedMaxLength();
    if (max !== undefined && v.length > max) v = v.slice(0, max);

    return v;
  }

  private meetsTypingThreshold() {
    return (this.valueState || '').trim().length >= 3;
  }

  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  private getNormalizedMaxLength(): number | undefined {
    const max = Number(this.maxLength);
    if (!Number.isFinite(max) || max <= 0) return undefined;
    return Math.trunc(max);
  }

  private getCurrentLength(): number {
    return (this.valueState || '').length;
  }

  private shouldShowCounter(): boolean {
    return this.getNormalizedMaxLength() !== undefined;
  }

  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLTextAreaElement;

    if (this._resolvedFormId) target.setAttribute('form', this._resolvedFormId);
    else target.removeAttribute('form');

    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;

    this.valueState = clean;
    this.value = clean;
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

    this.blurChange.emit(this.valueState);
  };

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
      console.error(
        '[textarea-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  private renderHelpText() {
    const labelText = (this.label || 'this field').trim();
    const msg = `Enter ${labelText}. This is a multiline text area.`;

    return (
      <div id={this.ids.desc} class="sr-only">
        {msg}
      </div>
    );
  }

  private renderValidation() {
    if (!this.validationState || !this.validationMessage) return null;

    return (
      <div id={this.ids.validation} class="invalid-feedback form-text" aria-live="polite" aria-atomic="true">
        {this.validationMessage}
      </div>
    );
  }

  private renderCounter() {
    const max = this.getNormalizedMaxLength();
    if (max === undefined) return null;

    return (
      <div id={this.ids.counter} class="form-text textarea-counter" aria-live="polite" aria-atomic="true">
        {this.getCurrentLength()} / {max}
      </div>
    );
  }

  private renderTextareaLabel(labelColClass?: string) {
    const classes = [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.isInline() ? 'col-form-label' : '',
      this.readOnly || this.disabled ? null : this.validationState ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    return (
      <label id={this.ids.label} class={classes} htmlFor={this.ids.textarea || undefined}>
        <span class={this.readOnly || this.disabled ? '' : this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.readOnly || this.disabled ? null : this.required ? <span class="required">*</span> : null}
      </label>
    );
  }

  private renderTextarea() {
    const sizeClass = this.textareaTextSize === 'sm' ? 'form-control-sm' : this.textareaTextSize === 'lg' ? 'form-control-lg' : '';
    const classes = ['form-control', this.readOnly ? 'read-only' : this.disabled ? null : this.validationState ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');

    const placeholder =
      (this.placeholder && this.placeholder.trim().length > 0 ? this.placeholder : this.label) || 'Enter text';

    const safeRows = Number.isFinite(Number(this.rows)) && Number(this.rows) > 0 ? Number(this.rows) : 3;
    const max = this.getNormalizedMaxLength();

    const describedBy = [
      this.ids.desc,
      this.validationState && this.validationMessage ? this.ids.validation : '',
      this.shouldShowCounter() ? this.ids.counter : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Fragment>
        {this.renderHelpText()}

        <textarea
          ref={el => {
            this.textareaEl = el as HTMLTextAreaElement;
            this.applyFormAttribute();
          }}
          id={this.ids.textarea || undefined}
          name={(this.label && this.camelCase(this.label)) || undefined}
          class={classes}
          placeholder={placeholder}
          value={this.valueState || ''}
          rows={safeRows}
          maxLength={max}
          aria-labelledby={this.ids.label}
          aria-describedby={describedBy || undefined}
          aria-invalid={this.validationState ? 'true' : undefined}
          aria-disabled={this.disabled ? 'true' : undefined}
          aria-readonly={this.readOnly ? 'true' : undefined}
          disabled={this.disabled}
          required={this.required}
          readOnly={this.readOnly}
          onInput={this.handleInput}
          onBlur={this.handleBlur}
        />

        {this.readOnly ? '' : this.renderCounter()}
        {this.renderValidation()}
      </Fragment>
    );
  }

  render() {
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
          {this.renderTextareaLabel(labelColClass)}

          {this.isHorizontal() ? <div class={inputColClass}>{this.renderTextarea()}</div> : <div>{this.renderTextarea()}</div>}
        </div>
      </div>
    );
  }
}
