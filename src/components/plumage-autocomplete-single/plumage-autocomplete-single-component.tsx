// src/components/plumage-autocomplete-single/plumage-autocomplete-single-component.tsx
import { Component, h, Prop, State, Element, EventEmitter, Event, Watch, Fragment, Method } from '@stencil/core';
import { logInfo, logWarn, logError } from '../../utils/log-debug';

@Component({
  tag: 'plumage-autocomplete-single',
  styleUrls: [
    '../layout-styles.scss',
    '../form-styles.scss',
    '../plumage-input-field/plumage-input-field-styles.scss',
    '../plumage-input-group/plumage-input-group-styles.scss',
    './plumage-autocomplete-styles.scss',
  ],
  shadow: false,
})
export class PlumageAutocompleteSingle {
  @Element() el!: HTMLElement;

  // ---------------- Props ----------------
  @Prop({ mutable: true }) options: string[] = [];
  @Prop() autoSort: boolean = true;

  /** id(s) of label(s) that label this input (space-separated). */
  @Prop() arialabelledBy: string = '';

  @Prop() clearIcon = '';
  @Prop() placeholder?: string;
  @Prop() devMode = false;
  @Prop() disabled: boolean = false;

  @Prop({ mutable: true }) formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';

  @Prop({ mutable: true }) error = false;
  @Prop({ mutable: true }) errorMessage = '';

  @Prop() inputId: string = '';
  @Prop() label: string = '';
  @Prop() labelHidden: boolean = false;
  @Prop() labelSize: 'base' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';

  @Prop() removeClearBtn = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() required = false;
  @Prop() type: string = 'text';

  /** Validation controlled externally (prop remains source of truth) */
  @Prop({ mutable: true }) validation = false;
  @Prop() validationMessage: string = '';

  /** Value controlled externally (don’t mutate the prop) */
  @Prop() value: string = '';

  /** Numeric fallback columns */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ---------------- State ----------------
  @State() inputValue = '';
  @State() filteredOptions: string[] = [];
  @State() focusedOptionIndex = -1;
  @State() selectedOptionIndex = -1;
  @State() isFocused = false;
  @State() hasBeenInteractedWith = false;
  @State() dropdownOpen = false;

  // Mirrors (parity with other components)
  @State() private validationState: boolean = false;
  @State() private valueState: string = '';
  @State() private _resolvedFormId: string = '';

  // a11y announcements
  @State() private liveMessage: string = '';

  private inputEl?: HTMLInputElement;
  private suppressBlur = false;

  // Stable fallback id for ARIA wiring
  private _fallbackId: string = `plumage-acs-${Math.random().toString(36).slice(2, 10)}`;

  // ---------------- Events ----------------
  @Event({ eventName: 'itemSelect' }) itemSelect!: EventEmitter<string>;
  @Event() clear!: EventEmitter<void>;
  @Event() componentError!: EventEmitter<{ message: string; stack?: string }>;
  @Event() valueChange!: EventEmitter<string>;

  // ---------------- Watchers --------------
  @Watch('value')
  onValuePropChange(v: string) {
    this.valueState = v ?? '';
    this.inputValue = this.sanitizeInput(this.valueState);
    if (this.inputEl) this.inputEl.value = this.inputValue;

    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.dropdownOpen = false;

    // best-effort selected index sync if the value matches an option
    const idx = (this.options || []).findIndex((o) => (o || '').trim().toLowerCase() === this.inputValue.trim().toLowerCase());
    this.selectedOptionIndex = idx >= 0 ? idx : -1;
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

  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'PlumageAutocompleteSingle', `'options' should be an array`, { receivedType: typeof newVal });
      this.options = [];
      this.filteredOptions = [];
      this.dropdownOpen = false;
      return;
    }

    if (this.autoSort) {
      const sorted = [...newVal].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      const changed = sorted.length !== newVal.length || sorted.some((v, i) => v !== newVal[i]);
      if (changed) {
        this.options = sorted;
        return;
      }
    }
    this.filterOptions();
  }

  // ---------------- Lifecycle -------------
  connectedCallback() {
    const formComponent = this.el.closest('form-component') as any;
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
    this.inputValue = this.sanitizeInput(this.valueState);
    this.validationState = !!this.validation;

    const idx = (this.options || []).findIndex((o) => (o || '').trim().toLowerCase() === this.inputValue.trim().toLowerCase());
    this.selectedOptionIndex = idx >= 0 ? idx : -1;

    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;
    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'PlumageAutocompleteSingle', `Expected 'options' to be an array, got ${typeof this.options}`);
      this.options = [];
    }
    if (!this.label) logWarn(this.devMode, 'PlumageAutocompleteSingle', 'Missing label prop; accessibility may be impacted');
  }

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside, true);
    this.hasBeenInteractedWith = false;
    this.applyFormAttribute();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside, true);
    document.removeEventListener('click', this.handleDocumentClick);
  }

  // ---------------- IDs / ARIA helpers ----
  private camelCase(str: string): string {
    return (str || '')
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
      .replace(/[\s-]+/g, '');
  }

  private resolveIds(): {
    inputId: string;
    labelId: string;
    listboxId: string;
    liveId: string;
    validationId: string;
    errorId: string;
  } {
    const raw = (this.inputId || '').trim();
    const base = this.camelCase(raw).replace(/ /g, '') || this._fallbackId;

    return {
      inputId: base,
      labelId: `${base}-label`,
      listboxId: `${base}-listbox`,
      liveId: `${base}-live`,
      validationId: `${base}-validation`,
      errorId: `${base}-error`,
    };
  }

  private buildDescribedBy(ids: ReturnType<typeof this.resolveIds>): string | undefined {
    const parts: string[] = [];
    if (this.validationState && this.validationMessage) parts.push(ids.validationId);
    if (this.error && this.errorMessage) parts.push(ids.errorId);
    return parts.length ? parts.join(' ') : undefined;
  }

  private announce(message: string) {
    this.liveMessage = message;
  }

  // ---------------- Form attribute --------
  private applyFormAttribute() {
    if (!this.inputEl) return;
    if (this._resolvedFormId) this.inputEl.setAttribute('form', this._resolvedFormId);
    else this.inputEl.removeAttribute('form');
  }

  // ---------------- Focus underline -------
  private handleInteraction = (event: Event) => {
    event.stopPropagation();

    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    const input = this.el.querySelector<HTMLInputElement>('input.form-control');
    const isInputFocused = event.target === input;

    if (bFocusDiv) {
      if (isInputFocused) {
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      } else {
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      }
    }
  };

  private handleDocumentClick = (ev: Event) => {
    const path = (ev as any).composedPath ? (ev as any).composedPath() : [];
    if (path && path.includes(this.el)) return;

    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  // ---------------- Utils -----------------
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
      if (t === 'col') {
        out.push('col');
        continue;
      }
      if (this.devMode) console.warn('[autocomplete-single] Unknown cols token:', t);
    }
    return Array.from(new Set(out)).join(' ');
  }

  private buildColClass(kind: 'label' | 'input'): string {
    const spec = (kind === 'label' ? this.labelCols : this.inputCols)?.trim();
    const num = kind === 'label' ? this.labelCol : this.inputCol;

    if (this.isHorizontal()) {
      if (spec) return this.parseColsSpec(spec);
      if (kind === 'input' && this.labelHidden) return this.inputCols ? this.parseColsSpec(this.inputCols) : 'col-12';
      if (Number.isFinite(num)) {
        const n = Math.max(0, Math.min(12, Number(num)));
        return n === 0 ? '' : `col-${n}`;
      }
      return '';
    }
    if (this.isInline()) return spec ? this.parseColsSpec(spec) : '';
    return '';
  }

  private isHorizontal() {
    return this.formLayout === 'horizontal';
  }
  private isInline() {
    return this.formLayout === 'inline';
  }
  private isRowLayout() {
    return this.isHorizontal() || this.isInline();
  }

  private meetsTypingThreshold() {
    return this.inputValue.trim().length >= 3;
  }
  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  // ---------------- Input & Dropdown ------
  private handleFocus = (e: Event) => {
    this.isFocused = true;
    this.handleInteraction(e);
  };

  private handleBlur = () => {
    this.isFocused = false;
    if (this.suppressBlur) {
      this.suppressBlur = false;
      return;
    }
    setTimeout(() => this.closeDropdown(), 0);

    if (this.required) {
      const invalidNow = !this.meetsTypingThreshold();
      this.validationState = invalidNow;
      this.validation = invalidNow;
    }

    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  private handleInput = (event: InputEvent | KeyboardEvent) => {
    const input = event.target as HTMLInputElement;

    if (this._resolvedFormId) input.setAttribute('form', this._resolvedFormId);
    else input.removeAttribute('form');

    if (event.type === 'keydown') {
      const key = (event as KeyboardEvent).key;

      if (key === 'ArrowDown') {
        event.preventDefault();
        if (!this.dropdownOpen && this.filteredOptions.length > 0) this.openDropdown({ withFocus: false });
        this.navigateOptions(1);
        return;
      }
      if (key === 'ArrowUp') {
        event.preventDefault();
        if (!this.dropdownOpen && this.filteredOptions.length > 0) this.openDropdown({ withFocus: false });
        this.navigateOptions(-1);
        return;
      }
      if (key === 'Home') {
        event.preventDefault();
        if (!this.dropdownOpen && this.filteredOptions.length > 0) this.openDropdown({ withFocus: false });
        this.setFocusIndex(0);
        return;
      }
      if (key === 'End') {
        event.preventDefault();
        const len = this.filteredOptions.length;
        if (len > 0) {
          if (!this.dropdownOpen) this.openDropdown({ withFocus: false });
          this.setFocusIndex(len - 1);
        }
        return;
      }
      if (key === 'PageDown') {
        event.preventDefault();
        if (!this.dropdownOpen && this.filteredOptions.length > 0) this.openDropdown({ withFocus: false });
        this.pageNavigate(1);
        return;
      }
      if (key === 'PageUp') {
        event.preventDefault();
        if (!this.dropdownOpen && this.filteredOptions.length > 0) this.openDropdown({ withFocus: false });
        this.pageNavigate(-1);
        return;
      }
      if (key === 'Enter') {
        event.preventDefault();
        if (this.focusedOptionIndex >= 0 && this.filteredOptions[this.focusedOptionIndex]) {
          this.selectOption(this.filteredOptions[this.focusedOptionIndex]);
          return;
        }
        this.closeDropdown();
        input.blur();
        if (this.required) {
          const invalidNow = !this.meetsTypingThreshold();
          this.validationState = invalidNow;
          this.validation = invalidNow;
        }
        return;
      }
      if (key === 'Escape') {
        this.closeDropdown();
        return;
      }
    } else {
      const next = this.sanitizeInput(input.value);
      if (next !== input.value) input.value = next;

      this.inputValue = next;
      this.valueState = next;
      this.valueChange.emit(this.valueState);
      this.el.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }));

      this.filterOptions();
      this.hasBeenInteractedWith = true;

      if (this.meetsTypingThreshold() && this.validationState) {
        this.validationState = false;
        this.validation = false;
      }
      if (this.required && this.inputValue.trim() === '') {
        this.validationState = true;
        this.validation = true;
      }
    }
  };

  private onDropdownMouseDown = () => {
    this.suppressBlur = true;
  };

  private handleClickOutside = (event: MouseEvent) => {
    const path = (event.composedPath && event.composedPath()) || [];
    if (!path.includes(this.el)) this.closeDropdown();
  };

  private openDropdown(opts?: { withFocus?: boolean }) {
    const withFocus = !!opts?.withFocus;
    const wasOpen = this.dropdownOpen;
    this.dropdownOpen = true;
    if (withFocus && (!wasOpen || this.focusedOptionIndex < 0)) {
      this.focusedOptionIndex = 0;
      requestAnimationFrame(() => this.ensureOptionInView(this.focusedOptionIndex));
    }
  }

  private filterOptions() {
    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'PlumageAutocompleteSingle', `'options' must be an array`, { receivedType: typeof this.options, value: this.options });
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      return;
    }

    const v = this.inputValue.trim().toLowerCase();

    if (v.length === 0) {
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      return;
    }

    const nextFiltered = this.options.filter((opt) => (opt || '').toLowerCase().includes(v));
    const opening = !this.dropdownOpen && nextFiltered.length > 0;

    this.filteredOptions = nextFiltered;

    if (nextFiltered.length === 0) {
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      return;
    }

    if (opening) {
      this.openDropdown({ withFocus: false });
      this.focusedOptionIndex = -1;
    } else {
      if (this.focusedOptionIndex >= nextFiltered.length) this.focusedOptionIndex = -1;
    }
  }

  private setFocusIndex(index: number) {
    if (!this.dropdownOpen || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    const clamped = Math.max(0, Math.min(len - 1, index));
    this.focusedOptionIndex = clamped;
    requestAnimationFrame(() => this.ensureOptionInView(clamped));
  }

  private getPageSize(): number {
    const dropdown = this.el.querySelector('.autocomplete-dropdown');
    const item = this.el.querySelector('.autocomplete-dropdown-item') as HTMLElement | null;
    const visible = dropdown instanceof HTMLElement && item ? Math.floor(dropdown.clientHeight / Math.max(1, item.clientHeight)) : 0;
    return visible > 0 ? visible : 5;
  }

  private pageNavigate(direction: 1 | -1) {
    if (!this.dropdownOpen || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    const page = this.getPageSize();

    let idx = this.focusedOptionIndex;
    if (idx < 0) {
      idx = direction > 0 ? 0 : len - 1;
    } else {
      const delta = direction > 0 ? page : -page;
      idx = (((idx + delta) % len) + len) % len;
    }
    this.setFocusIndex(idx);
  }

  private ensureOptionInView(index: number) {
    const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
    if (items && index >= 0 && index < items.length) {
      (items[index] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  private navigateOptions(direction: number) {
    if (!this.dropdownOpen || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    let newIndex = this.focusedOptionIndex;
    newIndex = newIndex < 0 ? (direction > 0 ? 0 : len - 1) : (newIndex + direction + len) % len;
    this.setFocusIndex(newIndex);
  }

  private selectOption(option: string) {
    if (typeof option !== 'string' || option.trim() === '') {
      logError(this.devMode, 'PlumageAutocompleteSingle', 'Invalid option selected', { option });
      return;
    }

    const cleaned = this.sanitizeInput(option);
    this.inputValue = cleaned;
    this.valueState = cleaned;
    if (this.inputEl) this.inputEl.value = cleaned;

    this.filteredOptions = [];
    this.focusedOptionIndex = -1;

    const idx = (this.options || []).findIndex((o) => (o || '').trim().toLowerCase() === cleaned.trim().toLowerCase());
    this.selectedOptionIndex = idx >= 0 ? idx : -1;

    this.validationState = false;
    this.validation = false;

    this.itemSelect.emit(cleaned);
    this.valueChange.emit(cleaned);
    this.el.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: cleaned } }));

    this.dropdownOpen = false;
    this.suppressBlur = false;

    this.announce(`Selected ${cleaned}.`);

    setTimeout(() => this.el.querySelector('input')?.focus(), 0);

    logInfo(this.devMode, 'PlumageAutocompleteSingle', 'Item selected', { selected: cleaned });
  }

  private closeDropdown() {
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.dropdownOpen = false;
    logInfo(this.devMode, 'PlumageAutocompleteSingle', 'Dropdown closed');
  }

  private clearInput = () => {
    this.inputValue = '';
    this.valueState = '';
    if (this.inputEl) this.inputEl.value = '';
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.selectedOptionIndex = -1;
    this.hasBeenInteractedWith = true;
    this.dropdownOpen = false;

    if (this.required && this.hasBeenInteractedWith) {
      this.validationState = true;
      this.validation = true;
    }

    this.clear.emit();
    this.valueChange.emit('');
    this.el.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: '' } }));

    this.announce('Cleared input.');

    logInfo(this.devMode, 'PlumageAutocompleteSingle', 'Input cleared');
  };

  @Method()
  public async validate(): Promise<boolean> {
    const invalid = this.required && this.inputValue.trim() === '';
    this.validationState = invalid;
    this.validation = invalid;
    return !invalid;
  }

  // ---------------- Render helpers --------
  private labelClasses(labelColClass?: string) {
    return [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validationState ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    return ['form-control', this.validationState || this.error ? 'is-invalid' : ''].filter(Boolean).join(' ');
  }

  private groupClasses() {
    const sizeClass = this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
    return ['input-group', 'autocomplete-single-select', this.validationState ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
  }

  private renderInputLabel(ids: ReturnType<typeof this.resolveIds>, labelColClass?: string) {
    const text = this.isRowLayout() ? `${this.label}:` : this.label;
    return (
      <label class={this.labelClasses(labelColClass)} id={ids.labelId} htmlFor={ids.inputId || undefined}>
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : ''}
      </label>
    );
  }

  private renderInputField(ids: ReturnType<typeof this.resolveIds>) {
    const placeholder = (this.placeholder && this.placeholder.trim().length > 0 ? this.placeholder : this.label) || 'Type to search';
    const describedBy = this.buildDescribedBy(ids);

    const hasVisibleLabel = !this.labelHidden && !!this.label;
    const fallbackAriaLabel = (this.label || placeholder || 'Autocomplete').trim();

    const invalid = !!(this.validationState || this.error);
    const activeOptionId = this.dropdownOpen && this.focusedOptionIndex >= 0 ? `${ids.inputId}-opt-${this.focusedOptionIndex}` : undefined;

    return (
      <input
        ref={(el) => (this.inputEl = el as HTMLInputElement)}
        id={ids.inputId}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        aria-controls={ids.listboxId}
        aria-activedescendant={activeOptionId}
        aria-haspopup="listbox"
        aria-required={this.required ? 'true' : 'false'}
        aria-invalid={invalid ? 'true' : 'false'}
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-describedby={describedBy}
        aria-labelledby={this.arialabelledBy ? this.arialabelledBy : hasVisibleLabel ? ids.labelId : undefined}
        aria-label={!hasVisibleLabel && !this.arialabelledBy ? fallbackAriaLabel : undefined}
        class={this.inputClasses()}
        type={this.type || 'text'}
        placeholder={placeholder}
        value={this.inputValue}
        disabled={this.disabled}
        onInput={this.handleInput}
        onKeyDown={this.handleInput}
        onFocus={this.handleFocus}
        onClick={this.handleInteraction}
        onMouseDown={this.handleInteraction}
        onBlur={this.handleBlur}
        inputMode="text"
        autoComplete="off"
        spellcheck={false}
        form={this._resolvedFormId || undefined}
      />
    );
  }

  private renderClearButton() {
    if (this.removeClearBtn || this.disabled || !this.inputValue) return null;
    return (
      <button
        type="button"
        class="input-group-btn clear clear-btn"
        onClick={this.clearInput}
        aria-label="Clear input"
        title="Clear input"
        disabled={this.disabled}
        aria-disabled={this.disabled ? 'true' : 'false'}
      >
        <i class={this.clearIcon || 'fas fa-times'} aria-hidden="true" />
      </button>
    );
  }

  private renderDropdownList(ids: ReturnType<typeof this.resolveIds>) {
    return (
      <ul role="listbox" id={ids.listboxId} tabIndex={-1}>
        {this.filteredOptions.map((option, index) => {
          const optId = `${ids.inputId}-opt-${index}`;
          const isFocused = this.focusedOptionIndex === index;

          // aria-selected should indicate the selected option, not the focused option
          const isSelected =
            this.selectedOptionIndex >= 0 &&
            (this.options?.[this.selectedOptionIndex] || '').trim().toLowerCase() === (option || '').trim().toLowerCase();

          return (
            <li
              id={optId}
              role="option"
              aria-selected={isSelected ? 'true' : 'false'}
              class={{
                'autocomplete-dropdown-item': true,
                focused: isFocused,
                'virtually-focused': isFocused,
                [`${this.size}`]: !!this.size,
              }}
              onMouseDown={this.onDropdownMouseDown}
              onClick={() => this.selectOption(option)}
              tabIndex={-1}
            >
              <span>{option}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  private renderDropdown(ids: ReturnType<typeof this.resolveIds>) {
    if (!this.dropdownOpen) return null;
    return (
      <div class="autocomplete-dropdown single" aria-live="polite" onMouseDown={this.onDropdownMouseDown}>
        {this.renderDropdownList(ids)}
      </div>
    );
  }

  private renderMessage(kind: 'validation' | 'error', ids: ReturnType<typeof this.resolveIds>) {
    const active = kind === 'validation' ? this.validationState && !!this.validationMessage : this.error && !!this.errorMessage;
    if (!active) return null;

    const message = kind === 'validation' ? this.validationMessage : this.errorMessage;
    const baseId = kind === 'validation' ? ids.validationId : ids.errorId;
    const baseClass = kind === 'validation' ? 'invalid-feedback' : 'error-message';

    const liveProps =
      kind === 'error'
        ? { 'aria-live': 'assertive' as const, role: 'alert' as const }
        : { 'aria-live': 'polite' as const, role: undefined as any };

    return (
      <div id={baseId} class={baseClass} {...liveProps}>
        {message}
      </div>
    );
  }

  private renderFieldArea(ids: ReturnType<typeof this.resolveIds>) {
    return (
      <Fragment>
        <div class={this.groupClasses()} onClick={this.handleInteraction}>
          {this.renderInputField(ids)}
          {this.renderClearButton()}
        </div>

        <div class={`b-underline${this.validationState ? ' invalid' : ''}`} role="presentation">
          <div
            class={`b-focus${this.disabled ? ' disabled' : ''}${this.validationState ? ' invalid' : ''}`}
            role="presentation"
            aria-hidden="true"
            style={{ width: '0', left: '50%' } as any}
          />
        </div>
      </Fragment>
    );
  }

  private renderLayout(ids: ReturnType<typeof this.resolveIds>) {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal()
      ? this.buildColClass('input') || undefined
      : this.isInline()
        ? this.buildColClass('input') || undefined
        : undefined;

    if (this.isRowLayout()) {
      return (
        <div class={outerClass}>
          <div class={`row form-group ${this.isInline() ? 'inline' : this.isHorizontal() ? 'horizontal' : ''}`}>
            {!this.labelHidden ? this.renderInputLabel(ids, labelColClass) : (
              // Still render SR-only label for 508 if labelHidden=true
              <label class={this.labelClasses(labelColClass)} id={ids.labelId} htmlFor={ids.inputId || undefined}>
                <span class="sr-only">{this.label || this.placeholder || 'Autocomplete'}</span>
              </label>
            )}
            <div class={inputColClass}>
              {this.renderFieldArea(ids)}
              {this.renderDropdown(ids)}
              {this.isInline() ? this.renderMessage('validation', ids) : null}
              {this.isInline() ? this.renderMessage('error', ids) : null}
              {this.isHorizontal() ? this.renderMessage('validation', ids) : null}
              {this.isHorizontal() ? this.renderMessage('error', ids) : null}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div class={outerClass}>
        {!this.labelHidden ? this.renderInputLabel(ids) : (
          <label class={this.labelClasses()} id={ids.labelId} htmlFor={ids.inputId || undefined}>
            <span class="sr-only">{this.label || this.placeholder || 'Autocomplete'}</span>
          </label>
        )}
        <div>
          {this.renderFieldArea(ids)}
          {this.renderDropdown(ids)}
          {this.renderMessage('validation', ids)}
          {this.renderMessage('error', ids)}
        </div>
      </div>
    );
  }

  // ---------------- Render root -----------
  render() {
    const ids = this.resolveIds();

    return (
      <div class="plumage">
        {/* SR announcements */}
        <div id={ids.liveId} class="sr-only" aria-live="polite" aria-atomic="true">
          {this.liveMessage}
        </div>

        <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(ids)}</div>
      </div>
    );
  }
}
