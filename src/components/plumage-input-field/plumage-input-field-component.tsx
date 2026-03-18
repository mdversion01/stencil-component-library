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
  @Prop() readOnly: boolean = false;
  @Prop() required: boolean = false;
  @Prop() type: string = 'text';
  @Prop() validation: boolean = false;
  @Prop() validationMessage: string = '';
  @Prop() value: string = '';
  @Prop() placeholder?: string;

  /** Standard ARIA naming hooks (recommended) */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  /**
   * Legacy: matches other components in this library.
   * @deprecated Prefer `ariaLabelledby` (mapped to aria-labelledby).
   */
  @Prop() arialabelledBy: string = '';

  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ----- Internal state -----
  @State() private validationState: boolean = false;
  @State() private valueState: string = '';
  @State() private _resolvedFormId: string = '';

  private inputEl?: HTMLInputElement;

  // Stable fallback id for ARIA wiring (prevents collisions)
  private _fallbackId: string = `plumage-if-${Math.random().toString(36).slice(2, 10)}`;

  // Let parents observe user edits
  @Event() valueChange!: EventEmitter<string>;

  // ---------- watchers ----------
  @Watch('value')
  syncValue(v: string) {
    this.valueState = v ?? '';
    if (this.inputEl && this.inputEl.value !== this.valueState) {
      this.inputEl.value = this.valueState;
    }
  }

  @Watch('validation')
  syncValidation(newVal: boolean) {
    this.validationState = !!newVal;
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._resolvedFormId = newVal || '';
    this.applyFormAttribute();
  }

  // ---------- lifecycle ----------
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

    // Seed mirrors
    this.valueState = this.value ?? '';
    this.validationState = !!this.validation;

    // collapse underline on outside click (capture)
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  componentDidLoad() {
    this._resolvedFormId = this.formId || '';
    this.applyFormAttribute();
  }

  // ---------- Form attribute ----------
  private applyFormAttribute() {
    if (!this.inputEl) return;
    if (this._resolvedFormId) this.inputEl.setAttribute('form', this._resolvedFormId);
    else this.inputEl.removeAttribute('form');
  }

  // ---------- underline helpers ----------
  private expandUnderline() {
    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (!bFocusDiv) return;
    bFocusDiv.style.width = '100%';
    bFocusDiv.style.left = '0';
  }

  private collapseUnderline() {
    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (!bFocusDiv) return;
    bFocusDiv.style.width = '0';
    bFocusDiv.style.left = '50%';
  }

  private handleInteraction = (event: Event) => {
    event.stopPropagation();
    this.expandUnderline();
  };

  private handleDocumentClick = (ev: Event) => {
    const path = (ev as any)?.composedPath?.() ?? [];
    if (path.includes(this.host)) return;
    this.collapseUnderline();
  };

  // ---------- utils ----------
  private camelCase(str: string) {
    if (!str) return '';
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
      .replace(/\s+/g, '');
  }

  private resolveIds() {
    const raw = (this.inputId || '').trim();
    const base = this.camelCase(raw).replace(/ /g, '') || this._fallbackId;

    return {
      base,
      inputId: base,
      labelId: `${base}-label`,
      validationId: `${base}-validation`,
      helpId: `${base}-help`,
    };
  }

  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    let v = value.replace(/[<>]/g, '');
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    v = v.replace(/\s+/g, ' ').trim();
    const MAX_LEN = 512;
    if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);
    return v;
  }

  private sanitizeIdRefList(v?: string | null): string | undefined {
    const raw = String(v ?? '').trim();
    if (!raw) return undefined;
    const tokens = raw.split(/\s+/).map((t) => t.trim()).filter(Boolean);
    const valid = tokens.filter((t) => /^[A-Za-z_][\w:\-\.]*$/.test(t));
    return valid.length ? valid.join(' ') : undefined;
  }

  private joinIdRefLists(...vals: Array<string | undefined | null>) {
    const tokens: string[] = [];
    for (const v of vals) {
      const cleaned = this.sanitizeIdRefList(v);
      if (cleaned) tokens.push(...cleaned.split(/\s+/));
    }
    const seen = new Set<string>();
    const out = tokens.filter((t) => (seen.has(t) ? false : (seen.add(t), true)));
    return out.length ? out.join(' ') : undefined;
  }

  // ---------- validation ----------
  private meetsTypingThreshold() {
    return (this.valueState || '').trim().length >= 3;
  }

  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  // ---------- input handlers ----------
  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;

    if (this._resolvedFormId) target.setAttribute('form', this._resolvedFormId);
    else target.removeAttribute('form');

    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;

    this.valueState = clean;
    this.valueChange.emit(this.valueState);

    if (this.meetsTypingThreshold() && this.validationState) this.validationState = false;
    if (this.required && this.valueState.trim() === '') this.validationState = true;
  };

  private handleBlur = () => {
    // ✅ fixed: don't synthesize Event; just collapse underline directly
    this.collapseUnderline();

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
      if (kind === 'input' && this.labelHidden) return this.inputCols ? this.parseColsSpec(this.inputCols) : 'col-12';

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
        '[plumage-input-field-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  // ---------- render bits ----------
  private renderInputLabel(ids: ReturnType<typeof this.resolveIds>, labelColClass?: string) {
    const labelText = (this.label || '').trim() || 'Input';

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

    const text = this.isHorizontal() || this.isInline() ? `${labelText}:` : labelText;

    return (
      <label class={classes} id={ids.labelId} htmlFor={ids.inputId || undefined}>
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : null}
      </label>
    );
  }

  private buildDescribedBy(ids: ReturnType<typeof this.resolveIds>) {
    const external = this.sanitizeIdRefList(this.ariaDescribedby);
    const validation = this.validationState && this.validationMessage ? ids.validationId : undefined;
    return this.joinIdRefLists(external, validation);
  }

  private renderInput(ids: ReturnType<typeof this.resolveIds>) {
    const sizeClass = this.size === 'sm' ? 'form-control-sm' : this.size === 'lg' ? 'form-control-lg' : '';
    const classes = ['form-control', this.validationState ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');

    const labelText = (this.label || '').trim();
    const placeholder = (this.placeholder || '').trim() || labelText || 'Enter text';

    const describedBy = this.buildDescribedBy(ids);

    // ✅ fixed: support both ariaLabelledby + legacy arialabelledBy
    const externalLabelledby =
      this.sanitizeIdRefList(this.ariaLabelledby) ||
      this.sanitizeIdRefList(this.arialabelledBy);

    const computedLabelledby = externalLabelledby || ids.labelId;

    // aria-label only when aria-labelledby absent
    const computedAriaLabel = computedLabelledby ? undefined : (this.ariaLabel || placeholder || 'Input').trim();

    return (
      <div class="input-container" role="presentation" onClick={this.handleInteraction} onMouseDown={this.handleInteraction}>
        <input
          ref={(el) => (this.inputEl = el as HTMLInputElement)}
          id={ids.inputId || undefined}
          name={ids.inputId || undefined}
          type={this.type || 'text'}
          class={classes}
          placeholder={placeholder}
          value={this.valueState || ''}
          aria-labelledby={computedLabelledby}
          aria-label={computedAriaLabel}
          aria-describedby={describedBy}
          aria-required={this.required ? 'true' : undefined}
          aria-invalid={this.validationState ? 'true' : 'false'}
          aria-disabled={this.disabled ? 'true' : undefined}
          aria-readonly={this.readOnly ? 'true' : undefined}
          disabled={this.disabled}
          readOnly={this.readOnly}
          required={this.required}
          onInput={this.handleInput}
          onFocus={this.handleInteraction}
          onBlur={this.handleBlur}
          form={this._resolvedFormId || undefined}
          autoComplete="off"
          spellcheck={false}
          inputMode="text"
        />

        <div class={`b-underline${this.validationState ? ' invalid' : ''}`} role="presentation" aria-hidden="true">
          <div
            class={`b-focus${this.disabled ? ' disabled' : ''}${this.validationState ? ' invalid' : ''}`}
            role="presentation"
            aria-hidden="true"
            style={{ width: '0', left: '50%' } as any}
          />
        </div>

        {this.validationState && this.validationMessage ? (
          <div id={ids.validationId} class="invalid-feedback form-text" aria-live="polite">
            {this.validationMessage}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const ids = this.resolveIds();
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const groupClasses = ['form-group'];
    if (this.isHorizontal()) groupClasses.push('row');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    this.getComputedCols();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal()
      ? this.buildColClass('input') || undefined
      : this.isInline()
        ? this.buildColClass('input') || undefined
        : undefined;

    return (
      <div class={`plumage${outerClass}`}>
        <div class={groupClasses.join(' ')}>
          {this.renderInputLabel(ids, labelColClass)}
          {this.isHorizontal() ? <div class={inputColClass}>{this.renderInput(ids)}</div> : this.renderInput(ids)}
        </div>
      </div>
    );
  }
}
