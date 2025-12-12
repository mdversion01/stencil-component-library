// src/components/plumage-select-field/plumage-select-field-component.tsx
import { Component, h, Prop, State, Element, Watch, Event, EventEmitter } from '@stencil/core';

type _SelectOption = { value: string; name: string };

@Component({
  tag: 'plumage-select-field-component',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', './plumage-select-field-styles.scss'],
  shadow: false,
})
export class PlumageSelectFieldComponent {
  @Element() host!: HTMLElement;

  // ----------------- props (unchanged) -----------------
  @Prop() classes: string = '';
  @Prop() custom: boolean = false;
  @Prop() defaultTxt: string = '';
  @Prop() defaultOptionTxt: string = 'Select an option';
  @Prop() disabled: boolean = false;
  @Prop() fieldHeight: number = null;
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop({ mutable: true }) formId: string = '';
  @Prop() selectFieldId: string = '';
  @Prop() options: Array<{ value: string; name: string }> | string = [];
  @Prop() selected: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() label: string = '';
  @Prop() labelSize: '' | 'sm' | 'default' | 'lg' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() multiple: boolean = false;
  @Prop() required: boolean = false;
  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';
  @Prop() value: string | string[] = '';
  @Prop() withTable: boolean = false;
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ----------------- state -----------------
  @State() private valueState: string | string[] = '';
  @State() private validationState: boolean = false;
  @State() private _resolvedFormId: string = '';
  @State() private _options: _SelectOption[] = [];
  @State() private _safeDefaultOptionTxt: string = 'Select an option';

  private selectEl?: HTMLSelectElement;

  @Event() valueChange!: EventEmitter<string | string[]>;

  // ----------------- watchers (unchanged except reflectInvalidClass uses state-only) -----------------
  @Watch('value')
  onValuePropChange(v: string | string[]) {
    this.valueState = v ?? (this.multiple ? [] : '');
    if (!this.selectEl) return;

    if (this.multiple && Array.isArray(this.valueState)) {
      this.applyMultiSelection(this.selectEl, this.valueState);
      const cleaned = this.stripDefaultIfOthersSelected(this.selectEl, this.valueState);
      this.valueState = cleaned as any;
    } else if (!this.multiple && typeof this.valueState === 'string') {
      this.selectEl.value = this.valueState;
      this.selectEl.selectedIndex = this.selectEl.selectedIndex;
    }

    // recompute validation from state only
    const satisfied = this.isSatisfiedByState(this.valueState);
    this.validationState = !satisfied;
    if (satisfied && this.validation) this.validation = false;
    this.reflectInvalidClass();
  }

  @Watch('validation')
  onValidationPropChange(v: boolean) {
    this.validationState = !!v;
    this.reflectInvalidClass();
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._resolvedFormId = newVal || '';
    this.applyFormAttribute();
  }

  @Watch('options')
  onOptionsChange(newVal: Array<{ value: string; name: string }> | string) {
    this._options = this.normalizeOptions(newVal);
  }

  @Watch('defaultOptionTxt')
  onDefaultOptionTxtChange(v: string) {
    const trimmed = (v ?? '').trim();
    this._safeDefaultOptionTxt = this.sanitizeText(trimmed || 'Select an option');
  }

  // ----------------- lifecycle (unchanged except reflectInvalidClass uses state-only) -----------------
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

    this.valueState = this.value ?? (this.multiple ? [] : '');
    this.validationState = !!this.validation;

    document.addEventListener('click', this.handleDocumentClick, true);

    if (this.withTable) {
      window.addEventListener('sort-field-updated', this.updateSortField);
      window.addEventListener('sort-order-updated', this.updateSortOrder);
    }
  }

  componentWillLoad() {
    this._options = this.normalizeOptions(this.options);
    this.onDefaultOptionTxtChange(this.defaultOptionTxt);
  }

  componentDidLoad() {
    this.applyFormAttribute();
    if (this.selectEl) {
      if (this.multiple && Array.isArray(this.valueState)) {
        this.applyMultiSelection(this.selectEl, this.valueState);
        this.valueState = this.stripDefaultIfOthersSelected(this.selectEl, this.valueState) as any;
      } else if (!this.multiple && typeof this.valueState === 'string') {
        this.selectEl.value = this.valueState;
      }
      this.reflectInvalidClass(); // state-only
    }
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick, true);
    if (this.withTable) {
      window.removeEventListener('sort-field-updated', this.updateSortField);
      window.removeEventListener('sort-order-updated', this.updateSortOrder);
    }
  }

  // ----------------- table interop (unchanged except state-only reflect) -----------------
  private updateSortField = (event: any) => {
    if ((this.host.id || '').includes('sortField')) {
      this.valueState = event?.detail?.value || 'none';
      if (this.selectEl && typeof this.valueState === 'string') this.selectEl.value = this.valueState;

      const satisfied = this.isSatisfiedByState(this.valueState);
      this.validationState = !satisfied;
      if (satisfied && this.validation) this.validation = false;
      this.reflectInvalidClass();
    }
  };

  private updateSortOrder = (event: any) => {
    if ((this.host.id || '').includes('sortOrder')) {
      this.valueState = event?.detail?.value || 'asc';
      if (this.selectEl && typeof this.valueState === 'string') this.selectEl.value = this.valueState;

      const satisfied = this.isSatisfiedByState(this.valueState);
      this.validationState = !satisfied;
      if (satisfied && this.validation) this.validation = false;
      this.reflectInvalidClass();
    }
  };

  // ----------------- interactions (unchanged) -----------------
  private expandUnderline = () => {
    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '100%';
      bFocusDiv.style.left = '0';
    }
  };
  private collapseUnderline = () => {
    const bFocusDiv = this.host.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };
  private handleInteraction = (event: Event) => {
    event.stopPropagation();
    this.expandUnderline();
  };
  private handleFocus = (e: Event) => this.handleInteraction(e);
  private handleBlur = () => this.collapseUnderline();
  private handleDocumentClick = (e: MouseEvent) => {
    if (!this.host.contains(e.target as Node)) this.collapseUnderline();
  };

  // ----------------- form attribute (unchanged) -----------------
  private applyFormAttribute() {
    if (!this.selectEl) return;
    if (this._resolvedFormId) this.selectEl.setAttribute('form', this._resolvedFormId);
    else this.selectEl.removeAttribute('form');
  }
  private handleInput = (ev: Event) => {
    const target = ev.target as HTMLSelectElement;
    if (this._resolvedFormId) target.setAttribute('form', this._resolvedFormId);
    else target.removeAttribute('form');
  };

  // ----------------- state-only validation helpers -----------------

  /** Should the label show as required right now? (state-only; no DOM reads) */
  private showAsRequired(): boolean {
    return !!this.required && this.isEmptySelection();
  }

  /** Is default-only ([""]) in array form? */
  private isDefaultOnlyInArray(arr: string[]): boolean {
    return Array.isArray(arr) && arr.length === 1 && arr[0] === '';
  }

  /** Pure state checker (no DOM). */
  private isSatisfiedByState(value: string | string[]): boolean {
    if (this.multiple) {
      if (!Array.isArray(value)) return false;
      if (value.length === 0) return false;
      if (this.isDefaultOnlyInArray(value)) return false;
      return true;
    }
    return typeof value === 'string' && value !== '' && value !== 'none';
  }

  /** DOM-aware (used during change to read current selection), falls back to state if el missing. */
  private isRequirementSatisfied(value: string | string[], el?: HTMLSelectElement): boolean {
    if (!el) return this.isSatisfiedByState(value);

    if (this.multiple) {
      const selected = Array.from(el.querySelectorAll('option'))
        .filter(o => (o as HTMLOptionElement).selected)
        .map(o => (o as HTMLOptionElement).value);
      if (selected.length === 0) return false;
      if (this.isDefaultOnlyInArray(selected)) return false;
      return true;
    }

    return typeof value === 'string' && value !== '' && value !== 'none';
  }

  private isEmptySelection(el?: HTMLSelectElement) {
    if (this.multiple) {
      if (el) {
        const selected = Array.from(el.querySelectorAll('option'))
          .filter(o => (o as HTMLOptionElement).selected)
          .map(o => (o as HTMLOptionElement).value);
        if (this.isDefaultOnlyInArray(selected)) return true;
        return selected.length === 0;
      }
      if (Array.isArray(this.valueState)) return this.valueState.length === 0 || this.isDefaultOnlyInArray(this.valueState);
      return true;
    }
    return typeof this.valueState === 'string' && (this.valueState === '' || this.valueState === 'none');
  }

  /** Toggle `is-invalid` using the *current DOM selection* as the source of truth. */
  private reflectInvalidClass() {
    if (!this.selectEl) return;

    // Read truth from the DOM (works in JSDOM and browsers)
    const satisfied = this.isRequirementSatisfied(this.valueState as any, this.selectEl);

    // Only show invalid UI if validation is active AND requirement not met
    const invalid = (this.validationState || this.validation) && !satisfied;

    this.selectEl.classList.toggle('is-invalid', invalid);
  }

  /** In multiple mode, if blank is selected with any other value, drop blank. */
  private stripDefaultIfOthersSelected(sel: HTMLSelectElement, current: string[] | string) {
    if (!this.multiple || !Array.isArray(current)) return current;
    const hasBlank = current.includes('');
    const nonEmpty = current.filter(v => v !== '');
    if (hasBlank && nonEmpty.length > 0) {
      this.applyMultiSelection(sel, nonEmpty);
      return nonEmpty;
    }
    return current;
  }

  // ----------------- change handler -----------------
  private handleChange = (ev: Event) => {
    const sel = ev.target as HTMLSelectElement;

    let next: string | string[] = this.multiple
      ? Array.from(sel.querySelectorAll('option'))
          .filter(o => (o as HTMLOptionElement).selected)
          .map(o => (o as HTMLOptionElement).value)
      : sel.value;

    if (this.multiple && Array.isArray(next)) {
      next = this.stripDefaultIfOthersSelected(sel, next) as string[];
    }

    this.valueState = next as any;
    this.valueChange.emit(this.valueState);
    this.host.dispatchEvent(new CustomEvent('change', { detail: { value: this.valueState }, bubbles: true }));

    const satisfied = this.isRequirementSatisfied(this.valueState as any, sel);
    if (this.validation || this.required || this.validationState) {
      this.validationState = !satisfied;
      this.validation = !satisfied; // keep prop and state aligned
    }

    this.reflectInvalidClass();
  };

  // ----------------- utils & layout helpers (unchanged) -----------------
  private camelCase(str: string) {
    if (!str) return '';
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }
  private sanitizeText(v: string): string {
    return (v ?? '').replace(/[<>]/g, '');
  }
  private normalizeOptions(input: Array<{ value: string; name: string }> | string): _SelectOption[] {
    if (Array.isArray(input)) return input.map(o => ({ value: String(o?.value ?? ''), name: String(o?.name ?? '') }));
    if (typeof input !== 'string') return [];
    try {
      const parsed = JSON.parse(input);
      return Array.isArray(parsed) ? parsed.map((o: any) => ({ value: String(o?.value ?? ''), name: String(o?.name ?? '') })) : [];
    } catch {
      console.warn('[plumage-select-field-component] Invalid JSON for "options" attribute.');
      return [];
    }
  }
  private applyMultiSelection(sel?: HTMLSelectElement, v?: string[] | string) {
    if (!sel || !Array.isArray(v)) return;
    const set = new Set(v);
    for (const opt of Array.from(sel.options)) (opt as HTMLOptionElement).selected = set.has((opt as HTMLOptionElement).value);
  }

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
      const n = Math.max(0, Math.min(12, Number(num)));
      return n === 0 ? '' : `col-${n}`;
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
        '[plumage-select-field-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }
    return { label, input };
  }

  // ----------------- render -----------------
  private renderSelectLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;

    const isInvalidNow = (this.validationState || this.validation) && !this.isSatisfiedByState(this.valueState as any);

    const classes = [
      'form-control-label',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'default' ? 'label-default' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.isHorizontal() ? `${labelColClass} no-padding` : '',
      isInvalidNow ? 'invalid' : '',
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

  private renderSelectField(ids: string, names: string) {
    const sizeClass = this.size === 'sm' ? 'select-sm' : this.size === 'lg' ? 'select-lg' : '';
    const baseClass = this.custom ? 'custom-select' : 'form-select';
    const role = this.multiple ? 'combobox' : 'listbox';

    const hasPlaceholder = (this.defaultOptionTxt ?? '').trim().length > 0;
    const defaultLabel = hasPlaceholder ? this._safeDefaultOptionTxt : '';
    const showDefaultOption = hasPlaceholder && !(this.host.id || '').includes('sortField');

    const isInvalidNow = (this.validationState || this.validation) && !this.isSatisfiedByState(this.valueState as any);
    const invalidClass = isInvalidNow ? ' is-invalid' : '';

    return (
      <div class="input-container" role="presentation" aria-labelledby={names || undefined} onClick={this.handleInteraction}>
        <select
          ref={el => (this.selectEl = el as HTMLSelectElement)}
          id={ids || undefined}
          class={`${baseClass}${invalidClass}${sizeClass ? ` ${sizeClass}` : ''}${this.classes ? ` ${this.classes}` : ''}`}
          multiple={this.multiple}
          disabled={this.disabled}
          aria-label={names || undefined}
          aria-labelledby={names || undefined}
          aria-describedby={isInvalidNow ? 'validationMessage' : undefined}
          required={this.required}
          aria-invalid={isInvalidNow ? 'true' : null}
          aria-multiselectable={this.multiple ? 'true' : null}
          role={role}
          size={this.fieldHeight || undefined}
          onMouseDown={e => e.stopPropagation()}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onInput={this.handleInput}
          onChange={this.handleChange}
          form={this._resolvedFormId || undefined}
        >
          {(this.host.id || '').includes('sortField') ? (
            <option value="none" aria-label="none" selected={typeof this.valueState === 'string' && this.valueState === 'none'}>
              --none--
            </option>
          ) : null}

          {showDefaultOption ? (
            <option value="" selected={!this.multiple && typeof this.valueState === 'string' && (this.valueState === '' || this.valueState === 'none')}>
              {defaultLabel}
            </option>
          ) : null}

          {(this._options || []).map(opt => {
            const selected = this.multiple
              ? Array.isArray(this.valueState) && this.valueState.includes(opt.value)
              : typeof this.valueState === 'string' && opt.value === this.valueState;

            return (
              <option value={opt.value} aria-label={opt.name} selected={selected}>
                {opt.name}
              </option>
            );
          })}
        </select>

        <div class={`b-underline${isInvalidNow ? ' invalid' : ''}`} role="presentation">
          <div class={`b-focus${this.disabled ? ' disabled' : ''}${isInvalidNow ? ' invalid' : ''}`} role="presentation" aria-hidden="true" />
        </div>

        {isInvalidNow && this.validationMessage ? (
          <div id="validationMessage" class="invalid-feedback form-text">
            {this.validationMessage}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const ids = this.camelCase(this.selectFieldId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const groupClasses = ['form-group'];
    if (this.isHorizontal()) groupClasses.push('row');
    else if (this.isInline()) groupClasses.push('row', 'inline');

    this.getComputedCols();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    return (
      <div class={`plumage${outerClass}`}>
        <div class={groupClasses.join(' ')}>
          {this.renderSelectLabel(ids, labelColClass)}
          {this.isHorizontal() ? <div class={inputColClass}>{this.renderSelectField(ids, names)}</div> : this.renderSelectField(ids, names)}
        </div>
      </div>
    );
  }
}
