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

  /** Native <select size>; useful for visually taller lists (single or multiple) */
  @Prop() fieldHeight: number = null;

  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop({ mutable: true }) formId: string = '';

  /** ID attribute for the <select> (Lit: selectFieldId) */
  @Prop() selectFieldId: string = '';

  @Prop() options: Array<{ value: string; name: string }> | string = [];
  @Prop() selected: boolean = false; // kept for parity (not used directly)
  @Prop() size: '' | 'sm' | 'lg' = '';

  @Prop() label: string = '';
  @Prop() labelSize: '' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden: boolean = false;

  @Prop() multiple: boolean = false;
  @Prop() required: boolean = false;

  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';

  /** Single: string; Multiple: string[] */
  @Prop({ mutable: true }) value: string | string[] = 'none';

  /** When used with a table, sync with external sort events */
  @Prop() withTable: boolean = false;

  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs (e.g., "col", "col-sm-3 col-md-4", "xs-12 sm-6 md-4") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ----------------- a11y override props -----------------
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  // ----- Internal -----
  @State() _resolvedFormId: string = '';
  @State() private _options: _SelectOption[] = [];
  @State() private _safeDefaultOptionTxt: string = 'Select an option';

  private selectEl?: HTMLSelectElement;
  private sortFieldHandler = (e: any) => this.updateSortField(e);
  private sortOrderHandler = (e: any) => this.updateSortOrder(e);

  // Avoid native "change" event name for Stencil Event; we still dispatch a DOM CustomEvent('change') for back-compat.
  @Event() valueChange: EventEmitter<{ value: string | string[] }>;

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

    if (this.withTable) {
      window.addEventListener('sort-field-updated', this.sortFieldHandler);
      window.addEventListener('sort-order-updated', this.sortOrderHandler);
    }

    this._resolvedFormId = this.formId || '';
  }

  componentWillLoad() {
    this._options = this.normalizeOptions(this.options);
    this.onDefaultOptionTxtChange(this.defaultOptionTxt);
  }

  componentDidLoad() {
    this.applyFormAttribute();
    if (!this.selectEl) return;

    if (this.multiple && Array.isArray(this.value)) {
      this.applyMultiSelection(this.selectEl, this.value);
    } else if (!this.multiple && typeof this.value === 'string') {
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
  onValueChange(newVal: string | string[]) {
    if (!this.selectEl) return;

    if (this.multiple && Array.isArray(newVal)) {
      this.applyMultiSelection(this.selectEl, newVal);
    } else if (!this.multiple && typeof newVal === 'string') {
      this.selectEl.value = newVal;
      this.selectEl.selectedIndex = this.selectEl.selectedIndex;
    }

    this.clearValidationIfSatisfied(this.selectEl);
    if (this.required && this.isEmptySelection(this.selectEl)) this.validation = true;

    if (this.multiple && this.validation && this.isDefaultOnlySelected(this.selectEl)) {
      this.validation = true;
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
      // eslint-disable-next-line no-console
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

  private applyMultiSelection(sel?: HTMLSelectElement, v?: string[] | string) {
    if (!sel || !Array.isArray(v)) return;
    const set = new Set(v);
    for (const opt of Array.from(sel.options)) {
      opt.selected = set.has(opt.value);
    }
  }

  /** Multiple mode helper: is the *only* selected option the default blank ""? */
  private isDefaultOnlySelected(el?: HTMLSelectElement): boolean {
    if (!this.multiple) return false;
    if (el) {
      const selected = Array.from(el.selectedOptions);
      return selected.length === 1 && selected[0].value === '';
    }
    if (Array.isArray(this.value)) {
      return this.value.length === 1 && this.value[0] === '';
    }
    return false;
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
      // eslint-disable-next-line no-console
      console.error(
        '[select-field-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }
    return { label, input };
  }

  // ----- Satisfaction helpers (state-safe) -----
  private isDefaultOnlyInArray(arr: string[]): boolean {
    return Array.isArray(arr) && arr.length === 1 && arr[0] === '';
  }

  private isSatisfiedByState(value: string | string[]): boolean {
    if (this.multiple) {
      if (!Array.isArray(value)) return false;
      if (value.length === 0) return false;
      if (this.isDefaultOnlyInArray(value)) return false;
      return true;
    }
    return typeof value === 'string' && value !== '' && value !== 'none';
  }

  private isRequirementSatisfied(value: string | string[], el?: HTMLSelectElement) {
    if (!this.required && !this.validation) return true;

    if (this.multiple) {
      if (el) {
        const selected = Array.from(el.selectedOptions).map(o => o.value);
        if (selected.length === 0) return false;
        if (this.isDefaultOnlyInArray(selected)) return false;
        return true;
      }
      return this.isSatisfiedByState(value);
    }

    return typeof value === 'string' && value !== '' && value !== 'none';
  }

  private clearValidationIfSatisfied(el?: HTMLSelectElement) {
    if (this.validation && this.isRequirementSatisfied(this.value, el)) {
      this.validation = false;
    }
  }

  private isEmptySelection(el?: HTMLSelectElement) {
    if (this.multiple) {
      if (el) {
        const selected = Array.from(el.selectedOptions).map(o => o.value);
        if (selected.length === 0) return true;
        if (this.isDefaultOnlyInArray(selected)) return true;
        return false;
      }
      if (Array.isArray(this.value)) return this.value.length === 0 || this.isDefaultOnlyInArray(this.value);
      return true;
    }
    return typeof this.value === 'string' && (this.value === '' || this.value === 'none');
  }

  /** Should the label show as required *right now*? */
  private showAsRequired(el?: HTMLSelectElement) {
    return !!this.required && this.isEmptySelection(el);
  }

  // ----------------- a11y id helpers -----------------
  private buildA11yBaseId(selectId: string, nameId: string): string {
    const fallback = this.host?.id || 'selectField';
    return selectId || nameId || fallback;
  }

  private buildLabelId(selectId: string, nameId: string): string {
    return `${this.buildA11yBaseId(selectId, nameId)}-label`;
  }

  private buildValidationId(selectId: string, nameId: string): string {
    return `${this.buildA11yBaseId(selectId, nameId)}-validation`;
  }

  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }

  private mergeDescribedBy(existing?: string, extra?: string): string | undefined {
    const a = this.normalizeIdList(existing);
    const b = this.normalizeIdList(extra);
    if (!a && !b) return undefined;
    if (a && !b) return a;
    if (!a && b) return b;
    const merged = `${a} ${b}`.trim().split(/\s+/);
    return Array.from(new Set(merged)).join(' ');
  }

  // ----- Handlers -----
  private handleChange = (ev: Event) => {
    const sel = ev.target as HTMLSelectElement;

    if (this._resolvedFormId) sel.setAttribute('form', this._resolvedFormId);
    else sel.removeAttribute('form');

    if (this.multiple) {
      const vals = Array.from(sel.selectedOptions).map(o => o.value);
      this.value = vals;
      this.valueChange.emit({ value: vals });

      if (this.validation || this.required) {
        this.validation = !this.isRequirementSatisfied(vals, sel);
      }
    } else {
      this.value = sel.value;
      this.valueChange.emit({ value: this.value });

      if (this.validation || this.required) {
        this.validation = !this.isRequirementSatisfied(this.value, sel);
      }
    }

    this.host.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
  };

  // ----- Render pieces -----
  private renderSelectLabel(selectId: string, nameId: string, labelColClass?: string) {
    if (this.labelHidden) return null;

    const invalidNow = !!this.validation && !this.isSatisfiedByState(this.value as any);

    const classes = [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding` : '',
      invalidNow ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;
    const requiredNow = this.showAsRequired(this.selectEl);
    const labelId = this.buildLabelId(selectId, nameId);

    return (
      <label id={labelId} class={classes} htmlFor={selectId || undefined}>
        <span class={requiredNow ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : null}
      </label>
    );
  }

  private renderSelectField(selectId: string, nameId: string) {
    const invalidNow = !!this.validation && !this.isSatisfiedByState(this.value as any);

    const selectClassParts = [
      this.custom ? 'custom-select' : 'form-select',
      invalidNow ? 'is-invalid' : '',
      this.size === 'sm' ? 'form-select-sm' : this.size === 'lg' ? 'form-select-lg' : '',
      this.classes || '',
    ].filter(Boolean);

    const hasPlaceholder = (this.defaultOptionTxt ?? '').trim().length > 0;
    const defaultLabel = hasPlaceholder ? this._safeDefaultOptionTxt : '';
    const showDefaultOption = hasPlaceholder && !(this.host.id && this.host.id.includes('sortField'));

    const labelId = this.buildLabelId(selectId, nameId);
    const validationId = this.buildValidationId(selectId, nameId);

    const userLabel = (this.ariaLabel ?? '').trim() || undefined;
    const userLabelledBy = this.normalizeIdList(this.ariaLabelledby);
    const userDescribedBy = this.normalizeIdList(this.ariaDescribedby);

    const defaultAriaLabel = this.labelHidden ? (this.label || this.defaultOptionTxt || 'Select') : undefined;
    const defaultAriaLabelledBy = this.labelHidden ? undefined : labelId;

    const ariaLabel = userLabelledBy ? undefined : userLabel ?? defaultAriaLabel;
    const ariaLabelledBy = userLabelledBy ?? (ariaLabel ? undefined : defaultAriaLabelledBy);

    const describedByWithValidation =
      invalidNow && this.validationMessage ? this.mergeDescribedBy(userDescribedBy, validationId) : userDescribedBy;

    return (
      <div>
        <select
          ref={el => (this.selectEl = el as HTMLSelectElement)}
          id={selectId || undefined}
          class={selectClassParts.join(' ')}
          multiple={this.multiple}
          disabled={this.disabled}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedByWithValidation}
          aria-required={this.required ? 'true' : null}
          required={this.required}
          aria-invalid={invalidNow ? 'true' : null}
          size={this.fieldHeight || undefined}
          form={this._resolvedFormId || undefined}
          onChange={this.handleChange}
        >
          {this.host.id && this.host.id.includes('sortField') ? (
            <option value="none" aria-label="none" selected={typeof this.value === 'string' && this.value === 'none'}>
              --none--
            </option>
          ) : null}

          {showDefaultOption ? (
            <option value="" selected={!this.multiple && typeof this.value === 'string' && (this.value === '' || this.value === 'none')}>
              {defaultLabel}
            </option>
          ) : null}

          {(this._options || []).map(opt => {
            const selected = this.multiple
              ? Array.isArray(this.value) && this.value.includes(opt.value)
              : typeof this.value === 'string' && opt.value === this.value;

            return (
              <option value={opt.value} aria-label={opt.name} selected={selected}>
                {opt.name}
              </option>
            );
          })}
        </select>

        {invalidNow && this.validationMessage ? (
          <div id={validationId} class="invalid-feedback form-text" aria-live="polite">
            {this.validationMessage}
          </div>
        ) : null}
      </div>
    );
  }

  // ----- Render root -----
  render() {
    const selectId = this.camelCase(this.selectFieldId).replace(/ /g, '');
    const nameId = this.camelCase(this.label).replace(/ /g, '');

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
          {this.renderSelectLabel(selectId, nameId, labelColClass)}
          {this.isHorizontal() ? <div class={inputColClass}>{this.renderSelectField(selectId, nameId)}</div> : this.renderSelectField(selectId, nameId)}
        </div>
      </div>
    );
  }
}
