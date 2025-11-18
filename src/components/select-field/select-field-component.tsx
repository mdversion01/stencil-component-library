// src/components/select-field/select-field-component.tsx
import { Component, h, Prop, State, Element, Event, EventEmitter, Watch } from '@stencil/core';

type _SelectOption = { value: string; name: string };

@Component({
  tag: 'select-field-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', '../input-field/input-field-styles.scss', './select-field-styles.scss'],
  shadow: false,
})
export class SelectFieldComponent {
  @Element() host!: HTMLElement;

  // ----- Public API (parity with Lit) -----
  @Prop() classes: string = '';
  @Prop() custom: boolean = false;
  @Prop() defaultTxt: string = '';
  @Prop() defaultOptionTxt: string = 'Select an option';

  @Prop() disabled: boolean = false;

  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop({ mutable: true }) formId: string = '';

  /** ID attribute for the <select> (Lit: selectFieldId) */
  @Prop() selectFieldId: string = '';

  @Prop() options: Array<{ value: string; name: string }> | string = [];
  @Prop() selected: boolean = false; // kept for parity (not used directly)
  @Prop() size: '' | 'sm' | 'lg' = '';

  @Prop() label: string = '';
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden: boolean = false;

  @Prop() multiple: boolean = false;
  @Prop() required: boolean = false;

  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';

  @Prop({ mutable: true }) value: string = 'none';

  /** When used with a table, sync with external sort events */
  @Prop() withTable: boolean = false;

  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs (e.g., "col", "col-sm-3 col-md-4", "xs-12 sm-6 md-4") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ----- Internal -----
  @State() _resolvedFormId: string = '';
  @State() private _options: _SelectOption[] = [];
  @State() private _safeDefaultOptionTxt: string = 'Select an option';

  private selectEl?: HTMLSelectElement;
  private sortFieldHandler = (e: any) => this.updateSortField(e);
  private sortOrderHandler = (e: any) => this.updateSortOrder(e);

  // Avoid native "change" event name for Stencil Event; we still dispatch a DOM CustomEvent('change') for back-compat.
  @Event() valueChange: EventEmitter<{ value: string }>;

  // ----- Lifecycle / Interop with <form-component> -----
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

    // With-table sync listeners
    if (this.withTable) {
      window.addEventListener('sort-field-updated', this.sortFieldHandler);
      window.addEventListener('sort-order-updated', this.sortOrderHandler);
    }

    this._resolvedFormId = this.formId || '';
  }

  componentWillLoad() {
    this._options = this.normalizeOptions(this.options);
    // prime the sanitized label
    this.onDefaultOptionTxtChange(this.defaultOptionTxt);
  }

  componentDidLoad() {
    this.applyFormAttribute();
    // Ensure initial value is reflected in the select element
    if (this.selectEl && typeof this.value === 'string') {
      this.selectEl.value = this.value;
    }
  }

  disconnectedCallback() {
    if (this.withTable) {
      window.removeEventListener('sort-field-updated', this.sortFieldHandler);
      window.removeEventListener('sort-order-updated', this.sortOrderHandler);
    }
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._resolvedFormId = newVal || '';
    this.applyFormAttribute();
  }

  @Watch('defaultOptionTxt')
  onDefaultOptionTxtChange(v: string) {
    const trimmed = (v ?? '').trim();
    this._safeDefaultOptionTxt = this.sanitizeText(trimmed || 'Select an option');
  }

  @Watch('value')
  onValueChange(newVal: string) {
    if (this.selectEl && typeof newVal === 'string') {
      this.selectEl.value = newVal;
      this.selectEl.selectedIndex = this.selectEl.selectedIndex; // nudge
      this.clearValidationIfSatisfied(this.selectEl);
      // (optional) if you want to *re-apply* validation automatically on blank:
      if (this.required && this.isEmptySelection(this.selectEl)) this.validation = true;
    }
  }

  @Watch('options')
  onOptionsChange(newVal: _SelectOption[] | string) {
    this._options = this.normalizeOptions(newVal);
  }

  private normalizeOptions(input: Array<{ value: string; name: string }> | string): _SelectOption[] {
    if (Array.isArray(input)) {
      return input.map(o => ({ value: String(o.value ?? ''), name: String(o.name ?? '') }));
    }
    if (typeof input !== 'string') return [];
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed.map((o: any) => ({ value: String(o?.value ?? ''), name: String(o?.name ?? '') })) : [];
    } catch {
      console.warn('[select-field-component] Invalid JSON for "options" attribute.');
      return [];
    }
  }

  private applyFormAttribute() {
    if (!this.selectEl) return;
    if (this._resolvedFormId) this.selectEl.setAttribute('form', this._resolvedFormId);
    else this.selectEl.removeAttribute('form');
  }

  // ----- Table sync (sort field/order) -----
  private updateSortField(event: CustomEvent<{ value: string }>) {
    if (this.host.id && this.host.id.includes('sortField')) {
      this.value = event.detail?.value ?? 'none';
      this.clearValidationIfSatisfied(this.selectEl);
    }
  }

  private updateSortOrder(event: CustomEvent<{ value: string }>) {
    if (this.host.id && this.host.id.includes('sortOrder')) {
      this.value = event.detail?.value ?? 'asc';
      this.clearValidationIfSatisfied(this.selectEl);
    }
  }

  // ----- Utils -----
  private camelCase(str: string) {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');
  }

  private sanitizeText(v: string): string {
    return (v ?? '').replace(/[<>]/g, '');
  }

  // ----- Layout helpers (mirrors input-field-component) -----
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
      if (t === 'col') {
        out.push('col');
        continue;
      }
      // Unknown token: ignore (or log in dev mode)
    }

    return Array.from(new Set(out)).join(' ');
  }

  private buildColClass(kind: 'label' | 'input'): string {
    const spec = (kind === 'label' ? this.labelCols : this.inputCols)?.trim();

    if (this.isHorizontal()) {
      if (spec) return this.parseColsSpec(spec);

      // If label is visually hidden, input defaults full width unless overridden
      if (kind === 'input' && this.labelHidden) {
        return this.inputCols ? this.parseColsSpec(this.inputCols) : 'col-12';
      }

      // Fallback numeric
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

    // Stacked
    return '';
  }

  /** Only used to keep numeric 12-column validation when string specs aren’t provided. */
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
        '[select-field-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }
    return { label, input };
  }

  // ----- Validation helper -----
  private isRequirementSatisfied(value: string, el?: HTMLSelectElement) {
    if (!this.required) return true;
    if (this.multiple) {
      // any selected option
      if (el) return el.selectedOptions && el.selectedOptions.length > 0;
      return Array.isArray(value) ? (value as any).length > 0 : !!value; // fallback
    }
    // single: treat '' and 'none' as not selected
    return value !== '' && value !== 'none';
  }

  private clearValidationIfSatisfied(el?: HTMLSelectElement) {
    if (this.validation && this.isRequirementSatisfied(this.value, el)) {
      this.validation = false; // removes classes & hides message
      // optionally keep the message text for next time; if you want to clear it too:
      // this.validationMessage = '';
    }
  }

  // ----- Validation / "required now" helpers -----
  private isEmptySelection(el?: HTMLSelectElement) {
    if (this.multiple) {
      if (el) return el.selectedOptions && el.selectedOptions.length === 0;
      // fallback if needed (value for multi may be managed elsewhere)
      return true;
    }
    // For single select, treat '' and 'none' as “no value”
    return this.value === '' || this.value === 'none';
  }

  /** Should the label show as required *right now*? */
  private showAsRequired(el?: HTMLSelectElement) {
    return !!this.required && this.isEmptySelection(el);
  }

  // ----- Handlers -----
  private handleChange = (ev: Event) => {
    const sel = ev.target as HTMLSelectElement;

    // Keep the `form` linkage via attribute only (read-only property!)
    // If you really need to update it here, just set/remove the attribute:
    if (this._resolvedFormId) sel.setAttribute('form', this._resolvedFormId);
    else sel.removeAttribute('form');

    // Update value + fire events
    this.value = sel.value;

    // ⬇️ Clear validation if now satisfied
    this.clearValidationIfSatisfied(sel);

    // Optional re-apply validation when user re-selects blank default:
    if (this.required && this.isEmptySelection(sel)) this.validation = true;

    this.valueChange.emit({ value: this.value });
    // Back-compat custom event
    this.host.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
  };

  // ----- Render pieces -----
  private renderSelectLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;

    const classes = [
      'form-control-label',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validation ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;
    const requiredNow = this.showAsRequired(this.selectEl);

    return (
      <label class={classes} htmlFor={ids || undefined}>
        <span class={requiredNow ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : ''}
      </label>
    );
  }

  private renderSelectField(ids: string, names: string) {
    const selectClassParts = [
      this.custom ? 'custom-select' : 'form-select',
      'form-control',
      this.validation ? 'is-invalid' : '',
      this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '',
      this.classes || '',
    ].filter(Boolean);

    const role = this.multiple ? 'combobox' : 'listbox';

    const hasPlaceholder = (this.defaultOptionTxt ?? '').trim().length > 0;
    // 👇 decide if we should show a default blank option + which label to use
    const includeDefaultBlank = !this.multiple && (this.value === '' || this.value === 'none') && hasPlaceholder;
    // when attribute is present with no value, fall back to built-in label
    const defaultLabel = hasPlaceholder ? this._safeDefaultOptionTxt : '';

    return (
      <div>
        <select
          ref={el => (this.selectEl = el as HTMLSelectElement)}
          id={ids || undefined}
          class={selectClassParts.join(' ')}
          multiple={this.multiple}
          disabled={this.disabled}
          aria-label={this.labelHidden ? names || undefined : undefined}
          aria-labelledby={names || undefined}
          aria-describedby={this.validation ? 'validationMessage' : undefined}
          required={this.required}
          aria-required={this.required ? 'true' : 'false'}
          aria-invalid={this.validation ? 'true' : 'false'}
          aria-multiselectable={this.multiple ? 'true' : 'false'}
          role={role}
          form={this._resolvedFormId || undefined}
          onChange={this.handleChange}
        >
          {/* legacy table "none" sentinel */}
          {this.host.id && this.host.id.includes('sortField') ? (
            <option value="none" aria-label="none" selected={this.value === 'none'}>
              --none--
            </option>
          ) : null}

          {/* ✅ default blank option driven by value/attribute */}
          {includeDefaultBlank ? (
            <option value="" selected={this.value === '' || this.value === 'none'}>
              {defaultLabel}
            </option>
          ) : null}

          {/* real options */}
          {(this._options || []).map(opt => (
            <option value={opt.value} aria-label={opt.name} selected={opt.value === this.value}>
              {opt.name}
            </option>
          ))}
        </select>

        {this.validation && this.validationMessage ? (
          <div id="validationMessage" class="invalid-feedback form-text" aria-live="polite">
            {this.validationMessage}
          </div>
        ) : null}
      </div>
    );
  }

  // ----- Render root -----
  render() {
    const ids = this.camelCase(this.selectFieldId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const groupClasses = ['form-group'];
    if (this.isHorizontal()) groupClasses.push('row', 'horizontal');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    this.getComputedCols();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    return (
      <div class={outerClass}>
        <div class={groupClasses.join(' ')}>
          {this.renderSelectLabel(ids, labelColClass)}
          {this.isHorizontal() ? <div class={inputColClass}>{this.renderSelectField(ids, names)}</div> : this.renderSelectField(ids, names)}
        </div>
      </div>
    );
  }
}
