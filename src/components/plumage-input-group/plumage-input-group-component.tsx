// src/components/plumage-input-group/plumage-input-group-component.tsx
import { Component, h, Prop, Element, State, Watch, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'plumage-input-group-component',
  styleUrls: ['../layout-styles.scss', '../plumage-input-field/plumage-input-field-styles.scss', './plumage-input-group-styles.scss', '../form-styles.scss'],
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
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
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

  /** NEW names replacing append/prepend */
  @Prop() appendField: boolean = false;
  @Prop() prependField: boolean = false;
  @Prop() appendId: string = '';
  @Prop() prependId: string = '';
  @Prop() appendIcon?: string;
  @Prop() prependIcon?: string;

  /** Search variant */
  @Prop() plumageSearch: boolean = false;

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

  // Events
  @Event() valueChange!: EventEmitter<string>;

  // ----- Watchers -----
  @Watch('value')
  onValuePropChange(v: string) {
    this.valueState = v ?? '';
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

    // Outside click collapses underline — listen on **bubble** phase
    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  componentDidLoad() {
    this.applyFormAttribute();
  }

  private applyFormAttribute() {
    if (!this.inputEl) return;
    if (this._resolvedFormId) this.inputEl.setAttribute('form', this._resolvedFormId);
    else this.inputEl.removeAttribute('form');
  }

  // ----- Focus underline interactions -----
  private handleInteraction = (event: Event) => {
    // prevent outside-click handler from running
    event.stopPropagation();

    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    const input = this.host.querySelector<HTMLInputElement>('input.form-control');
    const isInputFocused = event.target === input;

    if (bFocusDiv) {
      if (isInputFocused) {
        // focus: expand underline from left
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      } else {
        // any interaction inside -> show underline as focused
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      }
    }
  };

  private handleDocumentClick = (ev: Event) => {
    // If the click occurred inside this component, ignore it
    const path = (ev as any).composedPath ? (ev as any).composedPath() : [];
    if (path && path.includes(this.host)) return;

    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  // ----- Utils -----
  private camelCase(str: string) {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }

  private sanitizeInput(value: string): string {
    return value.replace(/[<>]/g, '');
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

    // form attribute linkage
    if (this._resolvedFormId) target.setAttribute('form', this._resolvedFormId);
    else target.removeAttribute('form');

    // sanitize
    const clean = this.sanitizeInput(target.value);
    if (clean !== target.value) target.value = clean;

    // update state mirrors
    this.valueState = clean;

    // emit Stencil event + DOM CustomEvent for compatibility
    this.valueChange.emit(this.valueState);
    this.host.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }));

    // live validation UX
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

  /** Legacy numeric validation helper (only used when no string specs provided). */
  private getComputedCols() {
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;

    if (this.isHorizontal() && this.labelHidden) return { label: 0, input: 12 };

    const lbl = Number(this.labelCol);
    const inp = Number(this.inputCol);
    const label = Number.isFinite(lbl) ? Math.max(1, Math.min(11, lbl)) : DEFAULT_LABEL;
    const input = Number.isFinite(inp) ? Math.max(1, Math.min(11, inp)) : DEFAULT_INPUT;

    // Only enforce 12 if string specs are not provided
    if (this.isHorizontal() && !this.labelCols && !this.inputCols && label + input !== 12) {
      console.error(
        '[plumage-input-group-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  // ----- Render bits -----
  private renderLabel(ids: string, labelColClass?: string) {
    const classes = [
      'form-control-label',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
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

  private renderPrepend() {
    if (!this.prependField) return null;

    const classes = [this.validationState ? 'is-invalid' : ''].filter(Boolean).join(' ');
    if (this.prependIcon) {
      return (
        <span class={`input-group-text ${classes}`}>
          <i class={this.prependIcon} />
        </span>
      );
    }
    if (this.otherContent) {
      return (
        <div class={classes}>
          <slot name="prepend" />
        </div>
      );
    }
    return (
      <div class={classes}>
        <span class="input-group-text" id={this.prependId || undefined}>
          <slot name="prepend" />
        </span>
      </div>
    );
  }

  private renderAppend() {
    if (!this.appendField) return null;

    const classes = [this.validationState ? 'is-invalid' : ''].filter(Boolean).join(' ');
    if (this.appendIcon) {
      return (
        <span class={`input-group-text ${classes}`}>
          <i class={this.appendIcon} />
        </span>
      );
    }
    if (this.otherContent) {
      return <slot name="append" />;
    }
    return <slot name="append" />;
  }

  private renderInput(ids: string, names: string) {
    const sizeClass = this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
    const groupClasses = ['input-group', sizeClass, this.disabled ? 'disabled' : ''].filter(Boolean).join(' ');
    const inputClasses = ['form-control', this.validationState ? 'is-invalid' : ''].filter(Boolean).join(' ');

    const placeholder = this.labelHidden ? this.label || this.placeholder || 'Placeholder Text' : this.label || this.placeholder || 'Placeholder Text';

    return (
      <div class={groupClasses} onClick={this.handleInteraction}>
        {this.renderPrepend()}
        <input
          ref={el => (this.inputEl = el as HTMLInputElement)}
          type={this.type || 'text'}
          class={inputClasses}
          placeholder={placeholder}
          id={ids || undefined}
          name={names || undefined}
          value={this.valueState || undefined}
          aria-label={this.label ? this.label : undefined}
          aria-labelledby={names || undefined}
          aria-describedby={this.validationState ? 'validationMessage' : undefined}
          disabled={this.disabled}
          onInput={this.handleInput}
          onFocus={this.handleInteraction}
          onClick={this.handleInteraction}
          onMouseDown={this.handleInteraction}
          onBlur={this.handleBlur}
        />
        {this.renderAppend()}

        {/* Underline/focus bar */}
        <div class={`b-underline${this.validationState ? ' invalid' : ''}`} role="presentation">
          <div
            class={`b-focus${this.disabled ? ' disabled' : ''}${this.validationState ? ' invalid' : ''}`}
            role="presentation"
            aria-hidden="true"
            // initial collapsed state; JS will expand on focus/click
            style={{ width: '0', left: '50%' } as any}
          />
        </div>

        {this.validationState && this.validationMessage ? (
          <div id="validationMessage" class="invalid-feedback form-text">
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

  private renderPlumageSearch(ids: string, names: string) {
    return (
      <div class="input-group search-bar-container mb-3" onClick={this.handleInteraction}>
        <div class="input-group-prepend" id="prepend-search">
          <span class="search-bar-icon">
            <i class="fas fa-search" />
          </span>
        </div>
        <input
          type="text"
          class="form-control search-bar"
          placeholder={this.placeholder || 'Search'}
          id={ids || undefined}
          name={names || undefined}
          value={this.valueState || undefined}
          aria-label={this.label || 'Search'}
          aria-describedby="prepend-search"
          onInput={this.handleInputChange}
          onFocus={this.handleInteraction}
          onClick={this.handleInteraction}
          onMouseDown={this.handleInteraction}
          onBlur={this.handleBlur}
        />
        {this.valueState && !this.disabled ? (
          <span class="clear-icon" onClick={this.clearInput}>
            <i class="fas fa-times" />
          </span>
        ) : null}

        {/* Underline/focus bar for search variant */}
        <div class={`b-underline${this.validationState ? ' invalid' : ''}`} role="presentation">
          <div
            class={`b-focus${this.disabled ? ' disabled' : ''}${this.validationState ? ' invalid' : ''}`}
            role="presentation"
            aria-hidden="true"
            style={{ width: '0', left: '50%' } as any}
          />
        </div>
      </div>
    );
  }

  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    if (this.plumageSearch) {
      return this.renderPlumageSearch(ids, names);
    }

    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const groupClasses = ['form-group', 'form-input-group'];
    if (this.isHorizontal()) groupClasses.push('row');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    // numeric validation fallback if no string specs
    this.getComputedCols();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    return (
      <div class={`plumage${outerClass}`}>
        <div class={groupClasses.join(' ')}>
          {this.renderLabel(ids, labelColClass)}
          {this.isHorizontal() ? <div class={inputColClass}>{this.renderInput(ids, names)}</div> :  this.isInline() ? <div>{this.renderInput(ids, names)}</div> : this.renderInput(ids, names)}
        </div>
      </div>
    );
  }
}
