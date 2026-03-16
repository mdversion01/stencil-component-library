// src/components/autocomplete-single/autocomplete-single.tsx

import { Component, h, Prop, State, Element, EventEmitter, Event, Watch } from '@stencil/core';
import { logInfo, logWarn, logError } from '../../utils/log-debug';

@Component({
  tag: 'autocomplete-single',
  styleUrls: [
    '../layout-styles.scss',
    '../form-styles.scss',
    '../input-field/input-field-styles.scss',
    '../input-group/input-group-styles.scss',
    './autocomplete-input.scss',
  ],
  shadow: false,
})
export class AutocompleteSingle {
  @Element() el: HTMLElement;

  // ---------------- Props ----------------
  @Prop({ mutable: true }) options: string[] = [];
  @Prop() autoSort: boolean = true;

  /**
   * @deprecated Use `ariaLabelledby` (mapped to `aria-labelledby`) instead.
   * Kept for backward compatibility.
   */
  @Prop() arialabelledBy: string = '';

  /** Standard ARIA naming hooks */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  @Prop() clearIcon = '';
  @Prop() placeholder = '';
  @Prop() devMode = false;
  @Prop() disabled = false;

  @Prop() formId = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';

  @Prop({ mutable: true }) error = false;
  @Prop({ mutable: true }) errorMessage = '';

  @Prop() inputId = '';
  @Prop() label = '';
  @Prop() labelSize: 'base' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden = false;

  @Prop() removeClearBtn = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() required = false;
  @Prop() type: string = 'text';

  /** Validation controlled externally (prop remains source of truth) */
  @Prop({ mutable: true }) validation = false;
  @Prop() validationMessage = '';

  /** Value controlled externally (don’t mutate the prop) */
  @Prop() value: string = '';

  /** Back-compat numeric columns */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ---------------- State ----------------
  @State() inputValue = '';
  @State() filteredOptions: string[] = [];
  @State() focusedOptionIndex = -1; // no virtual focus until user navigates
  @State() selectedOptionIndex = -1;
  @State() isFocused = false;
  @State() hasBeenInteractedWith = false;
  @State() dropdownOpen = false;

  // Mirrors
  @State() private valueState: string = '';

  private suppressBlur = false;
  private inputEl?: HTMLInputElement;

  // ---------------- Events ----------------
  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;
  @Event() valueChange: EventEmitter<string>;

  // ---------- Unique ID protection (prevents ARIA collisions) ----------
  private static _seq = 0;
  private _baseId = '';

  private resolveBaseId() {
    const raw = (this.inputId || this.label || '').trim();
    let base = raw ? this.camelCase(raw).replace(/ /g, '') : '';

    if (!base) {
      AutocompleteSingle._seq += 1;
      const rnd = Math.random().toString(36).slice(2, 6);
      base = `acs-${AutocompleteSingle._seq}-${rnd}`;
    }

    // If an element already exists with this id, suffix it (avoid collisions)
    const existing = document.getElementById(base);
    if (existing && !this.el.contains(existing)) {
      AutocompleteSingle._seq += 1;
      const rnd = Math.random().toString(36).slice(2, 6);
      base = `${base}-${AutocompleteSingle._seq}-${rnd}`;
      logWarn(this.devMode, 'AutocompleteSingle', `Resolved duplicate id. Using "${base}".`);
    }

    this._baseId = base;
  }

  private get ids(): string {
    return this._baseId;
  }
  private get labelId(): string {
    return `${this.ids}-label`;
  }
  private get listboxId(): string {
    return `${this.ids}-listbox`;
  }
  private get validationId(): string {
    return `${this.ids}-validation`;
  }
  private get errorId(): string {
    return `${this.ids}-error`;
  }

  private joinIds(...ids: Array<string | undefined | null>) {
    const cleaned = ids
      .map((s) => String(s || '').trim())
      .filter(Boolean);
    return cleaned.length ? cleaned.join(' ') : undefined;
  }

  // ---------------- Watchers --------------
  @Watch('value')
  onValuePropChange(v: string) {
    this.valueState = v ?? '';
    this.inputValue = this.sanitizeInput(this.valueState);

    if (this.inputEl) this.inputEl.value = this.inputValue;

    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.dropdownOpen = false;
  }

  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'AutocompleteSingle', `'options' should be an array`, { receivedType: typeof newVal });
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
    this.valueState = this.value ?? '';
    this.inputValue = this.sanitizeInput(this.valueState);
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteSingle', `Expected 'options' to be an array, got ${typeof this.options}`);
    }

    // Unique ids first (used everywhere in render)
    this.resolveBaseId();

    // 508 / WCAG: form elements must have a label (visible unless explicitly hidden)
    if (!this.label && !this.ariaLabel && !this.ariaLabelledby && !this.arialabelledBy) {
      logWarn(this.devMode, 'AutocompleteSingle', 'Missing label/aria-label/aria-labelledby; accessibility may be impacted');
    }

    // keep input in sync if value was set before load
    this.valueState = this.value ?? '';
    this.inputValue = this.sanitizeInput(this.valueState);
  }

  componentDidLoad() {
    // Use capture phase to catch clicks before focus moves around
    document.addEventListener('click', this.handleClickOutside, true);
    this.hasBeenInteractedWith = false;
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  // ---------------- Utils -----------------
  private camelCase(str: string): string {
    return (str || '')
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
      .replace(/\s+/g, '');
  }

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

  private meetsTypingThreshold() {
    return this.inputValue.trim().length >= 3;
  }
  private showAsRequired() {
    return this.required && !this.meetsTypingThreshold();
  }

  // ---------------- Handlers --------------
  private handleFocus = () => {
    this.isFocused = true;
  };

  private handleBlur = () => {
    this.isFocused = false;
    if (this.suppressBlur) {
      this.suppressBlur = false;
      return;
    }
    setTimeout(() => this.closeDropdown(), 0);
    if (this.required) this.validation = !this.meetsTypingThreshold();
  };

  private emitValue(next: string) {
    this.valueState = next;
    this.valueChange.emit(this.valueState);
    this.el.dispatchEvent(
      new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.valueState } }),
    );
  }

  private handleInput = (event: InputEvent | KeyboardEvent) => {
    const input = event.target as HTMLInputElement;

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
        if (this.required) this.validation = !this.meetsTypingThreshold();
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
      this.emitValue(this.inputValue);

      this.filterOptions();
      this.hasBeenInteractedWith = true;

      if (this.meetsTypingThreshold() && this.validation) this.validation = false;
      if (this.required && this.inputValue.trim() === '') this.validation = true;
    }
  };

  private onDropdownMouseDown = () => {
    this.suppressBlur = true;
  };

  private handleClickOutside = (event: MouseEvent) => {
    const path = (event.composedPath && event.composedPath()) || [];
    if (!path.includes(this.el)) this.closeDropdown();
  };

  // ---------------- Core behavior ---------
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
      logError(this.devMode, 'AutocompleteSingle', `'options' must be an array`, { receivedType: typeof this.options, value: this.options });
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
    const visible =
      dropdown instanceof HTMLElement && item ? Math.floor(dropdown.clientHeight / Math.max(1, item.clientHeight)) : 0;
    return visible > 0 ? visible : 5;
  }

  private pageNavigate(direction: 1 | -1) {
    if (!this.dropdownOpen || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    const page = this.getPageSize();

    let idx = this.focusedOptionIndex;
    if (idx < 0) idx = direction > 0 ? 0 : len - 1;
    else {
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
      logError(this.devMode, 'AutocompleteSingle', 'Invalid option selected', { option });
      return;
    }

    const next = this.sanitizeInput(option);

    this.inputValue = next;
    if (this.inputEl) this.inputEl.value = next;

    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.selectedOptionIndex = this.options.indexOf(option);
    this.validation = false;

    this.itemSelect.emit(next);
    this.emitValue(next);

    this.dropdownOpen = false;
    this.suppressBlur = false;

    setTimeout(() => this.el.querySelector('input')?.focus(), 0);

    logInfo(this.devMode, 'AutocompleteSingle', 'Item selected', { selected: next });
  }

  private closeDropdown() {
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.dropdownOpen = false;
    logInfo(this.devMode, 'AutocompleteSingle', 'Dropdown closed');
  }

  private clearInput = () => {
    this.inputValue = '';
    if (this.inputEl) this.inputEl.value = '';

    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.selectedOptionIndex = -1;
    this.hasBeenInteractedWith = true;
    this.dropdownOpen = false;
    if (this.required && this.hasBeenInteractedWith) this.validation = true;

    this.clear.emit();
    this.emitValue('');

    logInfo(this.devMode, 'AutocompleteSingle', 'Input cleared');
  };

  public validate(): boolean {
    if (this.required && this.inputValue.trim() === '') {
      this.validation = true;
      return false;
    }
    this.validation = false;
    return true;
  }

  // ---------------- Render helpers --------
  private labelClasses(labelColClass?: string) {
    return [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.isInline() ? `col-form-label` : '',
      this.validation ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    return ['form-control', this.validation || this.error ? 'is-invalid' : ''].filter(Boolean).join(' ');
  }

  private groupClasses() {
    const sizeClass = this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
    return [
      'input-group',
      'autocomplete-single-select',
      this.validation ? 'is-invalid' : '',
      this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '',
      sizeClass,
    ]
      .filter(Boolean)
      .join(' ');
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

  private renderInputLabel(labelColClass?: string) {
    // 508: always render a label element; use sr-only when labelHidden=true
    const labelText = (this.label || '').trim() || 'Autocomplete';

    const text = this.isRowLayout() ? `${labelText}:` : labelText;

    return (
      <label class={this.labelClasses(labelColClass)} id={this.labelId} htmlFor={this.ids || undefined}>
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : ''}
      </label>
    );
  }

  private renderInputField(names: string) {
    const labelText = (this.label || '').trim();
    const placeholder = ((this.placeholder || '').trim() || labelText || 'Autocomplete');

    // external aria-labelledby wins; legacy prop supported
    const externalLabelledby = (this.ariaLabelledby || '').trim() || (this.arialabelledBy || '').trim() || undefined;
    const externalLabel = (this.ariaLabel || '').trim() || undefined;

    const computedLabelledby = externalLabelledby || this.labelId;

    // Use aria-label only if aria-labelledby is absent (per spec)
    const computedAriaLabel = computedLabelledby ? undefined : (externalLabel || placeholder);

    const describedby = this.joinIds(
      this.ariaDescribedby,
      this.validation && this.validationMessage ? this.validationId : undefined,
      this.error && this.errorMessage ? this.errorId : undefined,
    );

    const activeDesc = this.focusedOptionIndex >= 0 ? `${this.ids}-option-${this.focusedOptionIndex}` : undefined;

    return (
      <input
        ref={(el) => (this.inputEl = el as HTMLInputElement)}
        id={this.ids || undefined}
        // NOTE: name for the text input isn't typically submitted; host can read `change` detail or use value prop.
        name={names || undefined}
        role="combobox"
        aria-label={computedAriaLabel}
        aria-labelledby={computedLabelledby}
        aria-describedby={describedby}
        aria-autocomplete="list"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        aria-controls={this.listboxId}
        aria-activedescendant={activeDesc}
        aria-required={this.required ? 'true' : undefined}
        aria-invalid={this.validation || this.error ? 'true' : undefined}
        aria-haspopup="listbox"
        aria-disabled={this.disabled ? 'true' : undefined}
        class={this.inputClasses()}
        type={this.type || 'text'}
        placeholder={placeholder}
        value={this.inputValue}
        disabled={this.disabled}
        onInput={this.handleInput}
        onKeyDown={this.handleInput}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        inputmode="text"
        autocomplete="off"
        spellcheck="false"
      />
    );
  }

  private renderClearButton() {
    // Avoid invalid ARIA: native button already has role=button; do not set role attribute.
    if (this.removeClearBtn || !this.inputValue || this.disabled) return null;

    return (
      <button
        class="clear-btn"
        type="button"
        onClick={this.clearInput}
        aria-label="Clear input"
        title="Clear input"
        disabled={this.disabled}
      >
        <i class={this.clearIcon || 'fas fa-times'} aria-hidden="true" />
      </button>
    );
  }

  private renderDropdownList() {
    return (
      <ul role="listbox" id={this.listboxId} tabIndex={-1}>
        {this.filteredOptions.map((option, index) => (
          <li
            id={`${this.ids}-option-${index}`}
            role="option"
            aria-selected={this.focusedOptionIndex === index ? 'true' : 'false'}
            class={{
              'autocomplete-dropdown-item': true,
              focused: this.focusedOptionIndex === index,
              'virtually-focused': this.focusedOptionIndex === index,
              [`${this.size}`]: !!this.size,
            }}
            onMouseDown={this.onDropdownMouseDown}
            onClick={() => this.selectOption(option)}
          >
            <span>{option}</span>
          </li>
        ))}
      </ul>
    );
  }

  private renderDropdown() {
    if (!this.dropdownOpen) return null;

    // Keep aria-live off the listbox itself; use a polite container.
    return (
      <div class="autocomplete-dropdown single" aria-live="polite" onMouseDown={this.onDropdownMouseDown}>
        {this.renderDropdownList()}
      </div>
    );
  }

  private renderMessage(kind: 'validation' | 'error') {
    const active = kind === 'validation' ? this.validation && !!this.validationMessage : this.error && !!this.errorMessage;
    if (!active) return null;

    const message = kind === 'validation' ? this.validationMessage : this.errorMessage;
    const baseId = kind === 'validation' ? this.validationId : this.errorId;
    const baseClass = kind === 'validation' ? 'invalid-feedback' : 'error-message';

    return (
      <div id={baseId} class={baseClass} aria-live="polite">
        {message}
      </div>
    );
  }

  private renderFieldArea(names: string) {
    return (
      <div class={this.groupClasses()}>
        {this.renderInputField(names)}
        {this.renderClearButton()}
      </div>
    );
  }

  private renderLayout(names: string) {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const labelColClass = this.isHorizontal() ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal()
      ? this.buildColClass('input') || undefined
      : this.isInline()
        ? this.buildColClass('input') || undefined
        : undefined;

    if (this.isRowLayout()) {
      return (
        <div class={outerClass}>
          <div class={`row form-group ${this.isInline() ? 'inline' : this.isHorizontal() ? 'horizontal' : ''}`}>
            {this.renderInputLabel(labelColClass)}
            <div class={inputColClass}>
              {this.renderFieldArea(names)}
              {this.renderDropdown()}
              {this.renderMessage('validation')}
              {this.renderMessage('error')}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div class={outerClass}>
        {this.renderInputLabel()}
        <div>
          {this.renderFieldArea(names)}
          {this.renderDropdown()}
          {this.renderMessage('validation')}
          {this.renderMessage('error')}
        </div>
      </div>
    );
  }

  // ---------------- Render root -----------
  render() {
    // NOTE: We intentionally do NOT set aria-hidden anywhere (tooling checks for aria-hidden on body).
    // Color contrast + text spacing are handled in CSS themes; component uses semantic elements and no fixed line-heights here.
    const names = this.camelCase(this.label).replace(/ /g, '');
    return <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(names)}</div>;
  }
}
