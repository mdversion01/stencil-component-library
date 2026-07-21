// File: src/components/plumage-input-group/plumage-input-group-component.tsx
import { Component, h, Prop, Element, State, Watch, Event, EventEmitter, Fragment } from '@stencil/core';

type AffixSide = 'prepend' | 'append';
type ButtonType = 'button' | 'submit' | 'reset';

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

  @Prop() disabled: boolean = false;

  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';

  @Prop() inputId: string = '';
  @Prop() label: string = '';
  @Prop() labelHidden: boolean = false;
  @Prop() labelSize: 'base' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() required: boolean = false;
  @Prop() readOnly: boolean = false;

  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() type: string = 'text';
  @Prop() placeholder?: string;

  @Prop() validation: boolean = false;
  @Prop() validationMessage: string = '';

  @Prop({ mutable: true }) value: string = '';

  @Prop() icon: string = '';
  @Prop() otherContent: boolean = false;

  @Prop({ attribute: 'has-append' }) appendField: boolean = false;
  @Prop({ attribute: 'has-prepend' }) prependField: boolean = false;

  @Prop() appendId: string = '';
  @Prop() prependId: string = '';

  @Prop() appendButtonId: string = '';
  @Prop() prependButtonId: string = '';

  @Prop() appendIcon?: string;
  @Prop() prependIcon?: string;

  @Prop() appendText: string = '';
  @Prop() prependText: string = '';

  @Prop() appendButton: boolean = false;
  @Prop() prependButton: boolean = false;

  @Prop() appendButtonType: ButtonType = 'button';
  @Prop() prependButtonType: ButtonType = 'button';

  @Prop() appendButtonVariant: string = 'secondary';
  @Prop() prependButtonVariant: string = 'secondary';

  @Prop() appendAriaLabel: string = '';
  @Prop() prependAriaLabel: string = '';

  @Prop() plumageSearch: boolean = false;

  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  @State() private validationState: boolean = false;
  @State() private valueState: string = '';
  @State() _resolvedFormId: string = '';

  private inputEl?: HTMLInputElement;
  private _fallbackId = `plumage-ig-${Math.random().toString(36).slice(2, 10)}`;

  @Event() valueChange!: EventEmitter<string>;
  @Event() prependClick!: EventEmitter<{ originalEvent: MouseEvent }>;
  @Event() appendClick!: EventEmitter<{ originalEvent: MouseEvent }>;

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

    this.valueState = this.value ?? '';
    this.validationState = !!this.validation;

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

  private isAffixButtonTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return !!target.closest('.prepend-btn button, .append-btn button');
  }

  private isAffixButtonDisabled() {
    return this.disabled || this.readOnly;
  }

  private handleInteraction = (event: Event) => {
    if (this.isAffixButtonTarget(event.target)) return;

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

  private camelCase(str: string) {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }

  private resolveIds() {
    const raw = (this.inputId || '').trim();
    const base = this.camelCase(raw).replace(/ /g, '') || this._fallbackId;

    return {
      base,
      inputId: base,
      labelId: `${base}-label`,
      validationId: `${base}-validation`,
      prependId: (this.prependId || `${base}-prepend`).trim(),
      appendId: (this.appendId || `${base}-append`).trim(),
      prependButtonId: (this.prependButtonId || '').trim(),
      appendButtonId: (this.appendButtonId || '').trim(),
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
    const tokens = raw.split(/\s+/).map(t => t.trim()).filter(Boolean);
    const valid = tokens.filter(t => /^[A-Za-z_][\w:\-.]*$/.test(t));
    return valid.length ? valid.join(' ') : undefined;
  }

  private joinIdRefLists(...vals: Array<string | undefined | null>) {
    const tokens: string[] = [];
    for (const v of vals) {
      const cleaned = this.sanitizeIdRefList(v);
      if (cleaned) tokens.push(...cleaned.split(/\s+/));
    }
    const seen = new Set<string>();
    const out = tokens.filter(t => (seen.has(t) ? false : (seen.add(t), true)));
    return out.length ? out.join(' ') : undefined;
  }

  private meetsTypingThreshold() {
    return (this.valueState || '').trim().length >= 3;
  }

  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLInputElement;

    if (this._resolvedFormId) target.setAttribute('form', this._resolvedFormId);
    else target.removeAttribute('form');

    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;

    this.valueState = clean;
    this.value = clean;

    this.valueChange.emit(this.valueState);
    this.host.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }));

    if (this.meetsTypingThreshold() && this.validationState) this.validationState = false;
    if (this.required && this.valueState.trim() === '') this.validationState = true;
  };

  private handleBlur = () => {
    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }

    if (this.required) {
      this.validationState = !this.meetsTypingThreshold();
    }
  };

  private handleAffixClick = (side: AffixSide, ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (this.isAffixButtonDisabled()) return;

    if (side === 'prepend') this.prependClick.emit({ originalEvent: ev });
    else this.appendClick.emit({ originalEvent: ev });
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
        '[plumage-input-group-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  private buildLabelledBy(ids: ReturnType<typeof this.resolveIds>) {
    const external = this.sanitizeIdRefList(this.ariaLabelledby);
    return external || ids.labelId;
  }

  private buildDescribedBy(ids: ReturnType<typeof this.resolveIds>) {
    const external = this.sanitizeIdRefList(this.ariaDescribedby);
    const validation = this.validationState && this.validationMessage ? ids.validationId : undefined;
    const prepend = this.prependField ? ids.prependId : undefined;
    const append = this.appendField ? ids.appendId : undefined;

    return this.joinIdRefLists(external, prepend, append, validation);
  }

  private renderLabel(ids: ReturnType<typeof this.resolveIds>, labelColClass?: string) {
    const labelText = (this.label || '').trim() || 'Input';

    const classes = [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.isInline() ? 'col-form-label' : '',
      this.readOnly ? 'read-only' : this.disabled ? '' : this.validationState ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isHorizontal() || this.isInline() ? `${labelText}:` : labelText;

    return (
      <label class={classes} id={ids.labelId} htmlFor={ids.inputId || undefined}>
        <span class={this.readOnly || this.disabled ? '' : this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.readOnly || this.disabled ? null : this.required ? <span class="required">*</span> : null}
      </label>
    );
  }

  private getAffixIcon(side: AffixSide) {
    return side === 'prepend' ? this.prependIcon || this.icon : this.appendIcon || this.icon;
  }

  private getAffixText(side: AffixSide) {
    return side === 'prepend' ? this.prependText : this.appendText;
  }

  private getAffixId(side: AffixSide, ids: ReturnType<typeof this.resolveIds>) {
    return side === 'prepend' ? ids.prependId : ids.appendId;
  }

  private getAffixButtonId(side: AffixSide, ids: ReturnType<typeof this.resolveIds>) {
    return side === 'prepend' ? ids.prependButtonId || undefined : ids.appendButtonId || undefined;
  }

  private getAffixButton(side: AffixSide) {
    return side === 'prepend' ? this.prependButton : this.appendButton;
  }

  private getAffixButtonType(side: AffixSide) {
    return side === 'prepend' ? this.prependButtonType : this.appendButtonType;
  }

  private getAffixAriaLabel(side: AffixSide) {
    return side === 'prepend' ? this.prependAriaLabel : this.appendAriaLabel;
  }

  private renderAffix(side: AffixSide, ids: ReturnType<typeof this.resolveIds>) {
    const icon = this.getAffixIcon(side);
    const text = this.getAffixText(side);
    const id = this.getAffixId(side, ids);
    const buttonId = this.getAffixButtonId(side, ids);
    const isButton = this.getAffixButton(side);
    const buttonType = this.getAffixButtonType(side);
    const ariaLabel = this.getAffixAriaLabel(side);
    const invalidClass = this.validationState ? 'is-invalid' : '';

    if (icon) {
      return (
        <span class={`input-group-text ${this.readOnly ? '' : this.disabled ? '' : invalidClass}`.trim()} id={id}>
          <i class={icon} aria-hidden="true" />
        </span>
      );
    }

    if (!text) return null;

    if (isButton) {
      return (
        <span class={side === 'prepend' ? 'prepend-btn' : 'append-btn'} id={id}>
          <button
            id={buttonId}
            type={buttonType}
            class="input-group-btn"
            aria-label={ariaLabel || undefined}
            disabled={this.isAffixButtonDisabled()}
            onClick={ev => this.handleAffixClick(side, ev)}
            onMouseDown={ev => ev.stopPropagation()}
          >
            {text}
          </button>
        </span>
      );
    }

    return (
      <span class={`input-group-text ${this.readOnly ? '' : this.disabled ? '' : invalidClass}`.trim()} id={id}>
        {text}
      </span>
    );
  }

  private renderInput(ids: ReturnType<typeof this.resolveIds>) {
    const sizeClass = this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
    const groupClasses = ['input-group', this.readOnly ? '' : this.disabled ? ' disabled' : this.validationState ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
    const inputClasses = ['form-control', this.readOnly ? 'read-only' : this.disabled ? '' : this.validationState ? 'is-invalid' : ''].filter(Boolean).join(' ');

    const labelText = (this.label || '').trim();
    const placeholder = (this.placeholder || '').trim() || labelText || 'Enter text';

    const labelledBy = this.buildLabelledBy(ids);
    const describedBy = this.buildDescribedBy(ids);
    const computedAriaLabel = labelledBy ? undefined : (this.ariaLabel || placeholder || 'Input').trim();

    return (
      <Fragment>
        <div class={groupClasses} onClick={this.handleInteraction} onMouseDown={this.handleInteraction}>
          {this.prependField ? this.renderAffix('prepend', ids) : null}

          <input
            ref={el => {
              this.inputEl = el as HTMLInputElement;
              this.applyFormAttribute();
            }}
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
            aria-readonly={this.readOnly ? 'true' : undefined}
            disabled={this.disabled}
            readOnly={this.readOnly}
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

          {this.appendField ? this.renderAffix('append', ids) : null}

          <div class={`b-underline${this.disabled || this.readOnly ? ' disabled' : this.validationState ? ' invalid' : ''}`} role="presentation" aria-hidden="true">
            <div
              class={`b-focus${this.disabled || this.readOnly ? ' disabled' : this.validationState ? ' invalid' : ''}`}
              role="presentation"
              aria-hidden="true"
              style={{ width: '0', left: '50%' } as any}
            />
          </div>
        </div>

        {this.validationState && this.validationMessage ? (
          <div id={ids.validationId} class="invalid-feedback form-text" aria-live="polite">
            {this.validationMessage}
          </div>
        ) : null}
      </Fragment>
    );
  }

  private handleInputChange = (ev: Event) => {
    const target = ev.target as HTMLInputElement;
    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;
    this.valueState = clean;
    this.value = clean;
    this.valueChange.emit(this.valueState);
    this.host.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }));
  };

  private clearInput = () => {
    this.valueState = '';
    this.value = '';
    const inputEl = this.host.querySelector<HTMLInputElement>('.search-bar');
    if (inputEl) inputEl.value = '';
    this.valueChange.emit(this.valueState);
    this.host.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }));
  };

  private renderPlumageSearch(ids: ReturnType<typeof this.resolveIds>) {
    const labelText = (this.label || '').trim() || 'Search';
    const placeholder = (this.placeholder || '').trim() || 'Search';
    const searchIconId = `${ids.base}-search-icon`;

    const labelledBy = this.sanitizeIdRefList(this.ariaLabelledby) || ids.labelId;
    const describedBy = this.joinIdRefLists(
      this.ariaDescribedby,
      searchIconId,
      this.validationState && this.validationMessage ? ids.validationId : undefined,
    );
    const computedAriaLabel = labelledBy ? undefined : (this.ariaLabel || labelText).trim();

    return (
      <div class="plumage">
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
            aria-readonly={this.readOnly ? 'true' : undefined}
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
    if (this.isHorizontal()) groupClasses.push('row', 'horizontal');
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
