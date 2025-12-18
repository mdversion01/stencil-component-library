// src/components/autocomplete-single/autocomplete-single.tsx
import { Component, h, Prop, State, Element, EventEmitter, Event, Watch } from '@stencil/core';
import { logInfo, logWarn, logError } from '../../utils/log-debug';

@Component({
  tag: 'autocomplete-single',
  styleUrls: ['../layout-styles.scss', '../form-styles.scss', '../input-field/input-field-styles.scss', '../input-group/input-group-styles.scss', './autocomplete-input.scss'],
  shadow: false,
})
export class AutocompleteSingle {
  @Element() el: HTMLElement;

  // Props
  @Prop({ mutable: true }) options: string[] = [];
  @Prop() autoSort: boolean = true;
  @Prop() arialabelledBy: string = '';
  @Prop() clearIcon = '';
  @Prop() placeholder = 'Type to search/filter...';
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
  @Prop() type = '';
  @Prop({ mutable: true }) validation = false;
  @Prop() validationMessage = '';

  /** Back-compat numeric columns */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // State
  @State() inputValue = '';
  @State() filteredOptions: string[] = [];
  @State() focusedOptionIndex = -1; // no virtual focus until user navigates
  @State() selectedOptionIndex = -1;
  @State() isFocused = false;
  @State() hasBeenInteractedWith = false;
  @State() dropdownOpen = false;

  private suppressBlur = false;

  // Events
  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;

  // --- Lifecycle / watchers ---
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

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside, true);
    this.hasBeenInteractedWith = false;
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;
    if (!Array.isArray(this.options)) logError(this.devMode, 'AutocompleteSingle', `Expected 'options' to be an array, got ${typeof this.options}`);
    if (!this.label) logWarn(this.devMode, 'AutocompleteSingle', 'Missing label prop; accessibility may be impacted');
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  // --- Utils ---
  private camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
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

  // --- Handlers ---
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
        this.pageNavigate(1); // wrap
        return;
      }

      if (key === 'PageUp') {
        event.preventDefault();
        if (!this.dropdownOpen && this.filteredOptions.length > 0) this.openDropdown({ withFocus: false });
        this.pageNavigate(-1); // wrap
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
      // Sanitize user-typed value on every input
      this.inputValue = this.sanitizeInput(input.value);
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

  // --- Core behavior ---
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

    // filter against sanitized query
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
      this.openDropdown({ withFocus: false }); // open without virtual focus
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
    return visible > 0 ? visible : 5; // fallback
  }

  private pageNavigate(direction: 1 | -1) {
    if (!this.dropdownOpen || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    const page = this.getPageSize();

    let idx = this.focusedOptionIndex;
    if (idx < 0) {
      // first page nav enters the list
      idx = direction > 0 ? 0 : len - 1;
    } else {
      const delta = direction > 0 ? page : -page;
      // wrap using modulo
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
    newIndex = newIndex < 0 ? (direction > 0 ? 0 : len - 1) : (newIndex + direction + len) % len; // wrap for arrows
    this.setFocusIndex(newIndex);
  }

  private selectOption(option: string) {
    if (typeof option !== 'string' || option.trim() === '') {
      logError(this.devMode, 'AutocompleteSingle', 'Invalid option selected', { option });
      return;
    }

    // Options come from dev-provided list; assign as text (input value is not HTML)
    this.inputValue = this.sanitizeInput(option);
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.selectedOptionIndex = this.options.indexOf(option);
    this.validation = false;

    // Emit the (sanitized) selection for safety
    this.itemSelect.emit(this.inputValue);

    this.dropdownOpen = false;
    this.suppressBlur = false;

    setTimeout(() => this.el.querySelector('input')?.focus(), 0);

    logInfo(this.devMode, 'AutocompleteSingle', 'Item selected', { selected: this.inputValue });
  }

  private closeDropdown() {
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.dropdownOpen = false;
    logInfo(this.devMode, 'AutocompleteSingle', 'Dropdown closed');
  }

  private clearInput = () => {
    this.inputValue = '';
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.selectedOptionIndex = -1;
    this.hasBeenInteractedWith = true;
    this.dropdownOpen = false;
    if (this.required && this.hasBeenInteractedWith) this.validation = true;

    this.clear.emit();
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

  // --- Render helpers ---
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
    // const sizeClass = this.size === 'sm' ? 'form-control-sm' : this.size === 'lg' ? 'form-control-lg' : '';
    return ['form-control', this.validation || this.error ? 'is-invalid' : ''].filter(Boolean).join(' '); // , sizeClass
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
        id={ids || null}
        name={names || null}
        role="combobox"
        aria-label={this.labelHidden ? names : null}
        aria-labelledby={this.arialabelledBy}
        aria-describedby={this.validation ? `${ids}-validation` : this.error ? `${ids}-error` : null}
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
        onBlur={this.handleBlur}
        inputMode="text"
        autoComplete="off"
        spellcheck="false"
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
            {/* SAFE: render as text node; no innerHTML */}
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
    const active = kind === 'validation' ? this.validation && !!this.validationMessage : this.error && !!this.errorMessage;
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
      <div class={this.groupClasses()}>
        {this.renderInputField(ids, names)}
        {this.renderClearButton()}
      </div>
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
              {/* this.isHorizontal() ? this.renderMessage('validation', ids) : ''}
              {this.isHorizontal() ? this.renderMessage('error', ids) : ''} */}
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

  // --- Render root ---
  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    return <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(ids, names)}</div>;
  }
}
