// src/components/plumage-autocomplete-single/plumage-autocomplete-single-component.tsx
import { Component, h, Prop, State, Element, EventEmitter, Event, Watch, Fragment } from '@stencil/core';
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
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
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

  private inputEl?: HTMLInputElement;
  private suppressBlur = false;

  // ---------------- Events ----------------
  @Event({ eventName: 'itemSelect' }) itemSelect!: EventEmitter<string>;
  @Event() clear!: EventEmitter<void>;
  @Event() componentError!: EventEmitter<{ message: string; stack?: string }>;
  @Event() valueChange!: EventEmitter<string>;

  // ---------------- Watchers --------------
  @Watch('value')
  onValuePropChange(v: string) {
    this.valueState = v ?? '';
    // Keep input visual in sync if external code drives value
    this.inputValue = this.sanitizeInput(this.valueState);
    if (this.inputEl) this.inputEl.value = this.inputValue;
    // Clear dropdown on programmatic value changes
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.dropdownOpen = false;
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
        // Mutate (prop is mutable) to keep future diffs stable
        this.options = sorted;
        return;
      }
    }
    this.filterOptions();
  }

  // ---------------- Lifecycle -------------
  connectedCallback() {
    // Inherit from nearest <form-component> if present and not already set
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

    // Seed mirrors
    this.valueState = this.value ?? '';
    this.inputValue = this.sanitizeInput(this.valueState);
    this.validationState = !!this.validation;

    // Outside click collapses underline — bubble phase (matches input-group)
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
    // Also watch capture to close dropdown when clicking outside fast
    document.addEventListener('click', this.handleClickOutside, true);
    this.hasBeenInteractedWith = false;

    this.applyFormAttribute();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside, true);
    document.removeEventListener('click', this.handleDocumentClick);
  }

  // ---------------- Form attribute --------
  private applyFormAttribute() {
    if (!this.inputEl) return;
    if (this._resolvedFormId) this.inputEl.setAttribute('form', this._resolvedFormId);
    else this.inputEl.removeAttribute('form');
  }

  // ---------------- Focus underline -------
  private handleInteraction = (event: Event) => {
    // prevent outside-click handler from running
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
    // If the click occurred inside this component, ignore it
    const path = (ev as any).composedPath ? (ev as any).composedPath() : [];
    if (path && path.includes(this.el)) return;

    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  // ---------------- Utils -----------------
  private camelCase(str: string): string {
    return (str || '').replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }

  /** Sanitize user-typed input: strip tags, remove control chars, trim, cap length. */
  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    // remove HTML tags
    let v = value.replace(/<[^>]*>/g, '');
    // remove control characters (except common whitespace)
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    // collapse whitespace
    v = v.replace(/\s+/g, ' ').trim();
    // cap length
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
        '[plumage-autocomplete-single] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }
    return { label, input };
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

    // Collapse underline on blur
    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  private handleInput = (event: InputEvent | KeyboardEvent) => {
    const input = event.target as HTMLInputElement;

    // Sync form attribute
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
      // Input event: sanitize + filter + emit
      const next = this.sanitizeInput(input.value);
      if (next !== input.value) input.value = next;

      this.inputValue = next;
      this.valueState = next; // keep mirror in sync for consumers
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

    const nextFiltered = this.options.filter(opt => (opt || '').toLowerCase().includes(v));
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
      idx = (((idx + delta) % len) + len) % len; // wrap
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

    // Assign sanitized text; never HTML
    this.inputValue = this.sanitizeInput(option);
    this.valueState = this.inputValue; // keep mirror in sync for consumers
    if (this.inputEl) this.inputEl.value = this.inputValue;

    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.selectedOptionIndex = this.options.indexOf(option);
    this.validationState = false;
    this.validation = false;

    // Emit selection (sanitized)
    this.itemSelect.emit(this.inputValue);
    this.valueChange.emit(this.inputValue);
    this.el.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.inputValue } }));

    this.dropdownOpen = false;
    this.suppressBlur = false;

    setTimeout(() => this.el.querySelector('input')?.focus(), 0);

    logInfo(this.devMode, 'PlumageAutocompleteSingle', 'Item selected', { selected: this.inputValue });
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

    logInfo(this.devMode, 'PlumageAutocompleteSingle', 'Input cleared');
  };

  public validate(): boolean {
    const invalid = this.required && this.inputValue.trim() === '';
    this.validationState = invalid;
    this.validation = invalid;
    return !invalid;
  }

  // ---------------- Render helpers --------
  private labelClasses(labelColClass?: string) {
    return [
      'form-control-label',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validationState ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    const sizeClass = this.size === 'sm' ? 'form-control-sm' : this.size === 'lg' ? 'form-control-lg' : '';
    // Match input-group: reflect validationState for visual invalid
    return ['form-control', this.validationState || this.error ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
  }

  private groupClasses() {
    return ['input-group', 'autocomplete-single-select', this.validationState ? 'is-invalid' : '', this.size || ''].filter(Boolean).join(' ');
  }

  private renderInputLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;
    const text = this.isRowLayout() ? `${this.label}:` : this.label;
    return (
      <label class={this.labelClasses(labelColClass)} htmlFor={ids || undefined}>
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : ''}
      </label>
    );
  }

  private renderInputField(ids: string, names: string) {
    const placeholder = this.label || this.placeholder || 'Placeholder Text';
    return (
      <input
        ref={el => (this.inputEl = el as HTMLInputElement)}
        id={ids || null}
        name={names || null}
        role="combobox"
        aria-label={this.labelHidden ? names : null}
        aria-labelledby={this.arialabelledBy || undefined}
        aria-describedby={this.validationState ? `${ids}-validation` : this.error ? `${ids}-error` : null}
        aria-autocomplete="list"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        aria-controls={`${ids}-listbox`}
        aria-activedescendant={this.focusedOptionIndex >= 0 ? `${ids}-option-${this.focusedOptionIndex}` : undefined}
        aria-required={this.required ? 'true' : 'false'}
        aria-haspopup="listbox"
        class={this.inputClasses()}
        type={this.type}
        placeholder={this.labelHidden ? placeholder : placeholder}
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
    if (this.removeClearBtn || !this.inputValue) return null;
    return (
      <button class="clear-btn" role="button" onClick={this.clearInput} aria-label="Clear input" title="Clear input" disabled={this.disabled}>
        <i class={this.clearIcon || 'fas fa-times'} />
      </button>
    );
  }

  private renderDropdownList(ids: string) {
    return (
      <ul role="listbox" id={`${ids}-listbox`} tabIndex={-1}>
        {this.filteredOptions.map((option, index) => (
          <li
            id={`${ids}-option-${index}`}
            role="option"
            aria-selected={this.focusedOptionIndex === index ? 'true' : 'false'}
            class={{
              'autocomplete-dropdown-item': true,
              'focused': this.focusedOptionIndex === index,
              'virtually-focused': this.focusedOptionIndex === index,
              [`${this.size}`]: !!this.size,
            }}
            onMouseDown={this.onDropdownMouseDown}
            onClick={() => this.selectOption(option)}
            tabIndex={-1}
          >
            <span>{option}</span>
          </li>
        ))}
      </ul>
    );
  }

  private renderDropdown(ids: string) {
    if (!this.dropdownOpen) return null;
    return (
      <div class="autocomplete-dropdown single" aria-live="polite" onMouseDown={this.onDropdownMouseDown}>
        {this.renderDropdownList(ids)}
      </div>
    );
  }

  private renderMessage(kind: 'validation' | 'error', ids: string) {
    // Keep stacked/row messages; drive visibility from state for validation
    const active = kind === 'validation' ? this.validationState && !!this.validationMessage : this.error && !!this.errorMessage;
    if (!active) return '';
    const message = kind === 'validation' ? this.validationMessage : this.errorMessage;
    const baseId = kind === 'validation' ? `${ids}-validation` : `${ids}-error`;
    const baseClass = kind === 'validation' ? 'invalid-feedback' : 'error-message';

    if (this.isHorizontal()) {
      return (
        <div id={baseId} class={baseClass} aria-live="polite">
          {message}
        </div>
      );
    }

    if (this.isInline()) {
      return (
        <div id={baseId} class={baseClass} aria-live="polite">
          {message}
        </div>
      );
    }

    return (
      <div id={baseId} class={baseClass} aria-live="polite">
        {message}
      </div>
    );
  }

  private renderFieldArea(ids: string, names: string) {
    return (
      <Fragment>
        <div class={this.groupClasses()} onClick={this.handleInteraction}>
          {this.renderInputField(ids, names)}
          {this.renderClearButton()}
        </div>
        {/* Underline/focus bar (exactly the same as input-group) */}
        <div class={`b-underline${this.validationState ? ' invalid' : ''}`} role="presentation">
          <div
            class={`b-focus${this.disabled ? ' disabled' : ''}${this.validationState ? ' invalid' : ''}`}
            role="presentation"
            aria-hidden="true"
            style={{ width: '0', left: '50%' } as any}
          />
        </div>

        {/* Inline validation inside group (parity with input-group) */}
        {/* {this.validationState && this.validationMessage ? (
          <div id="validationMessage" class="invalid-feedback form-text">
            {this.validationMessage}
          </div>
        ) : null} */}
      </Fragment>
    );
  }

  private renderLayout(ids: string, names: string) {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    if (this.isRowLayout()) {
      return (
        <div class={outerClass}>
          <div class={`row form-group ${this.isInline() ? 'inline' : this.isHorizontal() ? 'horizontal' : ''}`}>
            {this.renderInputLabel(ids, labelColClass)}
            <div class={inputColClass}>
              {this.renderFieldArea(ids, names)}
              {this.renderDropdown(ids)}
              {this.renderMessage('validation', ids)}
              {this.renderMessage('error', ids)}
            </div>
          </div>
        </div>
      );
    }

    // Stacked
    return (
      <div class={outerClass}>
        {this.renderInputLabel(ids)}
        <div>
          {this.renderFieldArea(ids, names)}
          {this.renderDropdown(ids)}
          {this.renderMessage('validation', ids)}
          {this.renderMessage('error', ids)}
        </div>
      </div>
    );
  }

  // ---------------- Render root -----------
  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    // numeric fallback validation (parity with input-group)
    this.getComputedCols();

    return (
      <div class="plumage">
        <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(ids, names)}</div>
      </div>
    );
  }
}
