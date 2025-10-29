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
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
  @Prop() labelHidden = false;
  @Prop() removeClearBtn = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() required = false;
  @Prop() type = '';
  @Prop({ mutable: true }) validation = false;
  @Prop() validationMessage = '';

  /** Back-compat numeric columns (used only if labelCols/inputCols are not provided) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs (e.g., "col", "col-sm-3 col-md-4", or "xs-12 sm-6 md-4") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // State
  @State() inputValue = '';
  @State() filteredOptions: string[] = [];
  @State() focusedOptionIndex = -1;
  @State() selectedOptionIndex = -1;
  @State() isFocused = false;
  @State() hasBeenInteractedWith = false;
  @State() dropdownOpen = false;

  /** while clicking inside the dropdown, don't let input blur close it */
  private suppressBlur = false;

  // Events
  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;

  // --- Lifecycle / watchers ---------------------------------------------------

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

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteSingle', `Expected 'options' to be an array, got ${typeof this.options}`);
    }

    if (!this.label) {
      logWarn(this.devMode, 'AutocompleteSingle', 'Missing label prop; accessibility may be impacted');
    }
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  // --- Utils -----------------------------------------------------------------

  private camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, '');
  }

  private sanitizeInput(value: string): string {
    return value.replace(/[<>]/g, '');
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

  /** Convert a compact responsive spec to Bootstrap classes. */
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

      if (kind === 'input' && this.labelHidden) {
        return this.inputCols ? this.parseColsSpec(this.inputCols) : 'col-12';
      }

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

  private meetsTypingThreshold() {
    return this.inputValue.trim().length >= 3;
  }

  private showRequiredMark() {
    return this.required && !this.meetsTypingThreshold();
  }

  // --- Handlers --------------------------------------------------------------

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

    if (this.required) {
      this.validation = !this.meetsTypingThreshold();
    }
  };

  private handleInput = (event: InputEvent | KeyboardEvent) => {
    const input = event.target as HTMLInputElement;

    if (event.type === 'keydown') {
      const key = (event as KeyboardEvent).key;

      if (key === 'ArrowDown') {
        event.preventDefault();
        this.navigateOptions(1);
        return;
      }

      if (key === 'ArrowUp') {
        event.preventDefault();
        this.navigateOptions(-1);
        return;
      }

      if (key === 'Enter') {
        event.preventDefault();

        // If a dropdown option is focused, select it and emit.
        if (this.focusedOptionIndex >= 0 && this.filteredOptions[this.focusedOptionIndex]) {
          this.selectOption(this.filteredOptions[this.focusedOptionIndex]);
          return;
        }

        // No focused option: accept the free text as-is (do NOT mutate options).
        // Leave value in the input so forms can submit it via the input's name.
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

  // --- Core behavior ---------------------------------------------------------

  private filterOptions() {
    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteSingle', `'options' must be an array`, {
        receivedType: typeof this.options,
        value: this.options,
      });
      this.filteredOptions = [];
      this.dropdownOpen = false;
      return;
    }

    const v = this.inputValue.trim().toLowerCase();

    if (v.length === 0) {
      this.filteredOptions = [];
      this.dropdownOpen = false;
      return;
    }

    this.filteredOptions = this.options.filter(opt => opt.toLowerCase().includes(v));
    this.dropdownOpen = this.filteredOptions.length > 0;
  }

  private ensureOptionInView(index: number) {
    setTimeout(() => {
      const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
      if (items && index >= 0 && index < items.length) {
        (items[index] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  private navigateOptions(direction: number) {
    const newIndex = this.focusedOptionIndex + direction;
    if (!Array.isArray(this.filteredOptions)) return;

    if (newIndex >= 0 && newIndex < this.filteredOptions.length) {
      this.focusedOptionIndex = newIndex;
      this.ensureOptionInView(newIndex);
    } else {
      logWarn(this.devMode, 'AutocompleteSingle', 'Navigation index out of bounds', {
        attemptedIndex: newIndex,
        totalOptions: this.filteredOptions.length,
      });
    }
  }

  private selectOption(option: string) {
    if (typeof option !== 'string' || option.trim() === '') {
      logError(this.devMode, 'AutocompleteSingle', 'Invalid option selected', { option });
      return;
    }

    this.inputValue = option;
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.selectedOptionIndex = this.options.indexOf(option);
    this.validation = false;
    this.itemSelect.emit(option);
    this.dropdownOpen = false;

    this.suppressBlur = false;

    setTimeout(() => {
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);

    logInfo(this.devMode, 'AutocompleteSingle', 'Item selected', { selected: option });
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

  // --- Render helpers --------------------------------------------------------

  private labelClasses(labelColClass?: string) {
    return [
      'form-control-label',
      this.showRequiredMark() ? 'required' : '',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validation ? 'invalid' : '',
      this.labelHidden ? 'sr-only' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    const sizeClass = this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '';
    return ['form-control', this.validation || this.error ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
  }

  private groupClasses() {
    return [
      'input-group',
      'autocomplete-single-select',
      this.validation ? 'is-invalid' : '',
      this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '',
      this.size || '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private renderInputLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;
    const text = this.isRowLayout() ? `${this.label}:` : this.label;
    return (
      <label class={this.labelClasses(labelColClass)} htmlFor={ids || undefined}>
        {text}
        {this.showRequiredMark() ? '*' : ''}
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

  private renderClearIcon() {
    return (
      <svg class="fa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s-12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    );
  }

  private renderClearButton() {
    if (this.removeClearBtn || !this.inputValue) return null;

    return (
      <button
        class="input-group-btn clear clear-btn"
        role="button"
        onClick={this.clearInput}
        aria-label="Clear input"
        title="Clear input"
        disabled={this.disabled}
      >
        {this.clearIcon ? <i class={this.clearIcon} /> : this.renderClearIcon()}
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
              focused: this.focusedOptionIndex === index,
              [`${this.size}`]: !!this.size,
            }}
            onMouseDown={this.onDropdownMouseDown}
            onClick={() => this.selectOption(option)}
            tabIndex={-1}
          >
            <span innerHTML={option.replace(/</g, '&lt;').replace(/>/g, '&gt;')} />
          </li>
        ))}
      </ul>
    );
  }

  private renderDropdown(ids: string) {
    if (!this.dropdownOpen) return null;
    return (
      <div class="autocomplete-dropdown" aria-live="polite" onMouseDown={this.onDropdownMouseDown}>
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
        <div class="row">
          <div></div>
          <div>
            <div id={baseId} class={baseClass} aria-live="polite">
              {message}
            </div>
          </div>
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
    const inputColClass =
      this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    if (this.isRowLayout()) {
      return (
        <div class={outerClass}>
          <div class={`row form-group ${this.isInline() ? 'inline' : this.isHorizontal() ? 'horizontal' : ''}`}>
            {this.renderInputLabel(ids, labelColClass)}
            <div class={inputColClass}>
              {this.renderFieldArea(ids, names)}
              {this.renderDropdown(ids)}
              {this.isInline() ? this.renderMessage('validation', ids) : ''}
              {this.isInline() ? this.renderMessage('error', ids) : ''}
              {this.isHorizontal() ? this.renderMessage('validation', ids) : ''}
              {this.isHorizontal() ? this.renderMessage('error', ids) : ''}
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

  // --- Render root -----------------------------------------------------------

  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    return <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(ids, names)}</div>;
  }
}
