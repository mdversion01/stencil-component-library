// src/components/plumage-input-group/plumage-input-group-component.tsx
import { Component, h, Prop, Element, State, Watch, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'plumage-input-group-component',
  styleUrls: [
    '../layout-styles.scss',
    '../plumage-input-field/plumage-input-field-styles.scss',
    './plumage-input-group-styles.scss',
    '../form-styles.scss',
  ],
  shadow: false,
})
export class PlumageInputGroupComponent {
  @Element() host!: HTMLElement;

  // ----- Public props -----
  @Prop() disabled: boolean = false;

  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';

  @Prop() inputId: string = '';
  @Prop() label: string = '';
  @Prop() labelHidden: boolean = false;
  @Prop() labelSize: 'base' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() required: boolean = false;

  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() type: string = 'text';
  @Prop() placeholder?: string;

  /** Validation controlled externally (don’t mutate) */
  @Prop() validation: boolean = false;
  @Prop() validationMessage: string = '';

  /** Value controlled externally (don’t mutate) */
  @Prop() value: string = '';

  /** Side options */
  @Prop() icon: string = ''; // e.g. "fa-solid fa-dollar-sign"
  @Prop() otherContent: boolean = false; // when true, raw slot is used without wrapper span

  @Prop({ attribute: 'append' }) appendField: boolean = false;
  @Prop({ attribute: 'prepend' }) prependField: boolean = false;

  @Prop() appendId: string = '';
  @Prop() prependId: string = '';
  @Prop() appendIcon?: string;
  @Prop() prependIcon?: string;

  /** Search variant */
  @Prop() plumageSearch: boolean = false;

  /** ✅ Standard ARIA naming hooks (recommended) */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

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

  // ✅ Stable fallback id for ARIA wiring (prevents collisions)
  private _fallbackId: string = `plumage-ig-${Math.random().toString(36).slice(2, 10)}`;

  // Events
  @Event() valueChange!: EventEmitter<string>;

  // ----- Watchers -----
  @Watch('value')
  onValuePropChange(v: string) {
    this.valueState = v ?? '';
    if (this.inputEl && this.inputEl.value !== this.valueState) {
      this.inputEl.value = this.valueState;
    }
  }

  @Watch('validation')
  onValidationPropChange(v: boolean) {
    this.validationState = !!v;
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._resolvedFormId = newVal || '';
    this.applyFormAttribute();
  }

  // ----- Lifecycle -----
  connectedCallback() {
    // Inherit from nearest <form-component> if present and not already set
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

    // Outside click collapses underline — bubble phase
    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  componentDidLoad() {
    this._resolvedFormId = this.formId || '';
    this.applyFormAttribute();
  }

  private applyFormAttribute() {
    if (!this.inputEl) return;
    if (this._resolvedFormId) this.inputEl.setAttribute('form', this._resolvedFormId);
    else this.inputEl.removeAttribute('form');
  }

  // ----- Focus underline interactions -----
  private handleInteraction = (event: Event) => {
    event.stopPropagation();

    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (!bFocusDiv) return;

    bFocusDiv.style.width = '100%';
    bFocusDiv.style.left = '0';
  };

  private handleDocumentClick = (ev: Event) => {
    const path = (ev as any)?.composedPath?.() ?? [];
    if (path.includes(this.host)) return;

    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (!bFocusDiv) return;

    bFocusDiv.style.width = '0';
    bFocusDiv.style.left = '50%';
  };

  // ----- Utils -----
  private camelCase(str: string) {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }

  private resolveIds() {
    const raw = (this.inputId || '').trim();
    const base = this.camelCase(raw).replace(/ /g, '') || this._fallbackId;

    // reserve stable ids for wiring
    return {
      base,
      inputId: base,
      labelId: `${base}-label`,
      validationId: `${base}-validation`,
      prependId: (this.prependId || `${base}-prepend`).trim(),
      appendId: (this.appendId || `${base}-append`).trim(),
    };
  }

  /** Sanitize user-typed input: strip tags, remove control chars, trim, cap length. */
  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    let v = value.replace(/[<>]/g, '');
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    v = v.replace(/\s+/g, ' ').trim();
    const MAX_LEN = 512;
    if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);
    return v;
  }

  /** Sanitize an IDREF list (space-separated). Keeps only valid ID tokens. */
  private sanitizeIdRefList(v?: string | null): string | undefined {
    const raw = String(v ?? '').trim();
    if (!raw) return undefined;
    const tokens = raw.split(/\s+/).map((t) => t.trim()).filter(Boolean);
    const valid = tokens.filter((t) => /^[A-Za-z_][\w:\-\.]*$/.test(t));
    return valid.length ? valid.join(' ') : undefined;
  }

  /** Join multiple IDREF lists into a single de-duped list. */
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

  private meetsTypingThreshold() {
    return (this.valueState || '').trim().length >= 3;
  }

  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  // ----- Input handlers (mutate *state*, not @Prop) -----
  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;

    if (this._resolvedFormId) target.setAttribute('form', this._resolvedFormId);
    else target.removeAttribute('form');

    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;

    this.valueState = clean;

    this.valueChange.emit(this.valueState);
    this.host.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }));

    if (this.meetsTypingThreshold() && this.validationState) this.validationState = false;
    if (this.required && this.valueState.trim() === '') this.validationState = true;
  };

  private handleBlur = () => {
    // collapse underline on blur
    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }

    // required/threshold validation on blur (parity with input-field)
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

  /** Parse responsive column spec into Bootstrap-like classes. */
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

  /** Build final col class (string spec > numeric fallback > special cases). */
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
        '[plumage-input-group-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  // ----- A11y builders -----
  private buildLabelledBy(ids: ReturnType<typeof this.resolveIds>) {
    // external wins; otherwise connect to our label
    const external = this.sanitizeIdRefList(this.ariaLabelledby);
    return external || ids.labelId;
  }

  private buildDescribedBy(ids: ReturnType<typeof this.resolveIds>) {
    const external = this.sanitizeIdRefList(this.ariaDescribedby);

    const validation = this.validationState && this.validationMessage ? ids.validationId : undefined;

    // If prepend/append have ids, include them so SR announces extra context
    const prepend = this.prependField ? ids.prependId : undefined;
    const append = this.appendField ? ids.appendId : undefined;

    return this.joinIdRefLists(external, prepend, append, validation);
  }

  // ----- Render bits -----
  private renderLabel(ids: ReturnType<typeof this.resolveIds>, labelColClass?: string) {
    // Always render a label (sr-only if hidden) to guarantee native label association.
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

  private renderPrepend(ids: ReturnType<typeof this.resolveIds>) {
    if (!this.prependField) return null;

    const invalidClass = this.validationState ? 'is-invalid' : '';

    if (this.prependIcon) {
      return (
        <span class={`input-group-text ${invalidClass}`} id={ids.prependId}>
          <i class={this.prependIcon} aria-hidden="true" />
        </span>
      );
    }

    if (this.otherContent) {
      // if consumer provides their own accessible content, still wrap with an id so we can reference it
      return (
        <div id={ids.prependId} class={invalidClass}>
          <slot name="prepend" />
        </div>
      );
    }

    return (
      <span class={`input-group-text ${invalidClass}`} id={ids.prependId}>
        <slot name="prepend" />
      </span>
    );
  }

  private renderAppend(ids: ReturnType<typeof this.resolveIds>) {
    if (!this.appendField) return null;

    const invalidClass = this.validationState ? 'is-invalid' : '';

    if (this.appendIcon) {
      return (
        <span class={`input-group-text ${invalidClass}`} id={ids.appendId}>
          <i class={this.appendIcon} aria-hidden="true" />
        </span>
      );
    }

    if (this.otherContent) {
      return (
        <div id={ids.appendId} class={invalidClass}>
          <slot name="append" />
        </div>
      );
    }

    return (
      <span id={ids.appendId} class={invalidClass}>
        <slot name="append" />
      </span>
    );
  }

  private renderInput(ids: ReturnType<typeof this.resolveIds>) {
    const sizeClass = this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
    const groupClasses = ['input-group', sizeClass, this.disabled ? 'disabled' : ''].filter(Boolean).join(' ');
    const inputClasses = ['form-control', this.validationState ? 'is-invalid' : ''].filter(Boolean).join(' ');

    const labelText = (this.label || '').trim();
    const placeholder = (this.placeholder || '').trim() || labelText || 'Enter text';

    const labelledBy = this.buildLabelledBy(ids);
    const describedBy = this.buildDescribedBy(ids);

    // aria-label only when aria-labelledby absent (spec)
    const computedAriaLabel = labelledBy ? undefined : (this.ariaLabel || placeholder || 'Input').trim();

    return (
      <div class={groupClasses} onClick={this.handleInteraction} onMouseDown={this.handleInteraction}>
        {this.renderPrepend(ids)}

        <input
          ref={(el) => (this.inputEl = el as HTMLInputElement)}
          type={this.type || 'text'}
          class={inputClasses}
          placeholder={placeholder}
          id={ids.inputId || undefined}
          name={ids.inputId || undefined}
          value={this.valueState || ''}
          aria-labelledby={labelledBy}
          aria-label={computedAriaLabel}
          aria-describedby={describedBy}
          aria-required={this.required ? 'true' : undefined}
          aria-invalid={this.validationState ? 'true' : 'false'}
          aria-disabled={this.disabled ? 'true' : undefined}
          disabled={this.disabled}
          onInput={this.handleInput}
          onFocus={this.handleInteraction}
          onClick={this.handleInteraction}
          onMouseDown={this.handleInteraction}
          onBlur={this.handleBlur}
          form={this._resolvedFormId || undefined}
          autoComplete="off"
          spellcheck={false}
          inputMode="text"
        />

        {this.renderAppend(ids)}

        {/* Underline/focus bar */}
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

  // ----- Search variant -----
  private handleInputChange = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;
    this.valueState = clean;
    this.valueChange.emit(this.valueState);
    this.host.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }));
  };

  private clearInput = () => {
    this.valueState = '';
    const inputEl = this.host.querySelector<HTMLInputElement>('.search-bar');
    if (inputEl) inputEl.value = '';
    this.valueChange.emit(this.valueState);
    this.host.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }));
  };

  private renderPlumageSearch(ids: ReturnType<typeof this.resolveIds>) {
    const labelText = (this.label || '').trim() || 'Search';
    const placeholder = (this.placeholder || '').trim() || 'Search';

    // search icon id so aria-describedby can reference it
    const searchIconId = `${ids.base}-search-icon`;

    // aria-labelledby: external wins, else label id
    const labelledBy = this.sanitizeIdRefList(this.ariaLabelledby) || ids.labelId;

    // described: external + icon + validation
    const describedBy = this.joinIdRefLists(
      this.ariaDescribedby,
      searchIconId,
      this.validationState && this.validationMessage ? ids.validationId : undefined,
    );

    // aria-label only when aria-labelledby absent
    const computedAriaLabel = labelledBy ? undefined : (this.ariaLabel || labelText).trim();

    return (
      <div class="plumage">
        {/* still render label for native association (sr-only if hidden) */}
        {this.renderLabel(ids, '')}

        <div class="input-group search-bar-container mb-3" onClick={this.handleInteraction} onMouseDown={this.handleInteraction}>
          <span class="search-bar-icon" id={searchIconId}>
            <i class="fas fa-search" aria-hidden="true" />
          </span>

          <input
            type="text"
            class="form-control search-bar"
            placeholder={placeholder}
            id={ids.inputId || undefined}
            name={ids.inputId || undefined}
            value={this.valueState || ''}
            aria-labelledby={labelledBy}
            aria-label={computedAriaLabel}
            aria-describedby={describedBy}
            aria-required={this.required ? 'true' : undefined}
            aria-invalid={this.validationState ? 'true' : 'false'}
            aria-disabled={this.disabled ? 'true' : undefined}
            disabled={this.disabled}
            onInput={this.handleInputChange}
            onFocus={this.handleInteraction}
            onClick={this.handleInteraction}
            onMouseDown={this.handleInteraction}
            onBlur={this.handleBlur}
            autoComplete="off"
            spellcheck={false}
            inputMode="text"
          />

          {this.valueState && !this.disabled ? (
            <button type="button" class="clear-icon" onClick={this.clearInput} aria-label="Clear search" title="Clear search">
              <i class="fas fa-times" aria-hidden="true" />
            </button>
          ) : null}

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
      </div>
    );
  }

  render() {
    const ids = this.resolveIds();

    if (this.plumageSearch) {
      return this.renderPlumageSearch(ids);
    }

    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const groupClasses = ['form-group', 'form-input-group'];
    if (this.isHorizontal()) groupClasses.push('row');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    // numeric validation fallback if no string specs
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
          {this.renderLabel(ids, labelColClass)}
          {this.isHorizontal() ? (
            <div class={inputColClass}>{this.renderInput(ids)}</div>
          ) : this.isInline() ? (
            <div>{this.renderInput(ids)}</div>
          ) : (
            this.renderInput(ids)
          )}
        </div>
      </div>
    );
  }
}
