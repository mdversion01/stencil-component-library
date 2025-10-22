// src/components/autocomplete-multiselect/autocomplete-multiselect.tsx
import { Component, h, Prop, State, Element, Event, EventEmitter, Watch, Method } from '@stencil/core';
import { logInfo, logWarn, logError } from '../../utils/log-debug';

@Component({
  tag: 'autocomplete-multiselect',
  styleUrls: [
    '../layout-styles.scss',
    '../form-styles.scss',
    '../input-field/input-field-styles.scss',
    '../input-group/input-group-styles.scss',
    '../autocomplete-single/autocomplete-input.scss',
    '../badge/badge.scss',
    './autocomplete-multiselect.scss',
  ],
  shadow: false,
})
export class AutocompleteMultiselect {
  @Element() el: HTMLElement;

  // Props
  @Prop({ mutable: true }) options: string[] = [];
  @Prop() addBtn = false;
  @Prop() addIcon = '';
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

  // Badge Props
  @Prop() badgeVariant = '';
  @Prop() badgeShape = '';
  @Prop() badgeInlineStyles = '';

  // Horizontal layout columns (legacy numeric fallback)
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** NEW: responsive column class specs (e.g., "col", "col-sm-3 col-md-4", or "xs-12 sm-6 md-4") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // State
  @State() inputValue = '';
  @State() filteredOptions: string[] = [];
  @State() selectedItems: string[] = [];
  @State() focusedOptionIndex = -1;
  @State() isFocused = false;
  @State() hasBeenInteractedWith = false;

  // Events
  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange: EventEmitter<string[]>;

  // prevent blur-then-close when clicking inside dropdown
  private suppressBlur = false;

  // ---------------- Lifecycle / watchers ----------------

  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'AutocompleteMultiselect', `'options' should be an array`, { receivedType: typeof newVal });
      return;
    }
    this.filterOptions();
  }

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside);
    this.hasBeenInteractedWith = false;
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultiselect', `Expected 'options' to be an array, got ${typeof this.options}`);
    }
    if (!this.label) {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Missing label prop; accessibility may be impacted');
    }
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  // ---------------- Utilities ----------------

  private camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/[\s-]+/g, '');
  }

  private sanitizeInput(v: string) {
    return v.replace(/[<>]/g, '');
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

  private isSatisfiedNow(): boolean {
    return this.inputValue.trim().length >= 3 || this.selectedItems.length > 0;
  }

  private showRequiredMark(): boolean {
    return this.required && !this.isSatisfiedNow();
  }

  /** Parse responsive column spec into Bootstrap classes. */
  private parseColsSpec(spec?: string): string {
    if (!spec) return '';
    const tokens = spec.trim().split(/\s+/);
    const out: string[] = [];

    for (const t of tokens) {
      if (!t) continue;

      // already a bootstrap class
      if (/^col(-\w+)?(-\d+)?$/.test(t)) {
        out.push(t);
        continue;
      }
      // number only -> col-N
      if (/^\d{1,2}$/.test(t)) {
        const n = Math.max(1, Math.min(12, parseInt(t, 10)));
        out.push(`col-${n}`);
        continue;
      }
      // breakpoint-number -> col-bp-n (xs means no bp)
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

      if (this.devMode) console.warn('[autocomplete-multiselect] Unknown cols token:', t);
    }

    return Array.from(new Set(out)).join(' ');
  }

  /** Build final col class (string spec > numeric fallback > special cases). */
  private buildColClass(kind: 'label' | 'input'): string {
    const spec = (kind === 'label' ? this.labelCols : this.inputCols)?.trim();
    const num = kind === 'label' ? this.labelCol : this.inputCol;

    if (this.isHorizontal()) {
      if (spec) return this.parseColsSpec(spec);

      // if label is hidden, input should span full width unless overridden
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

    // Inline layout: respect user spec if provided, else none.
    if (this.isInline()) {
      return spec ? this.parseColsSpec(spec) : '';
    }

    // Stacked layout: no grid classes
    return '';
  }

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

  private containerClasses() {
    return [
      'ac-multi-select-container',
      this.validation ? 'is-invalid' : '',
      this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '',
      this.size || '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  // ---------------- Handlers ----------------

  private handleFocus = () => {
    this.isFocused = true;
  };

  private handleBlur = () => {
    this.isFocused = false;
    if (this.suppressBlur) return;

    setTimeout(() => this.closeDropdown(), 0);
    if (this.required) this.validation = !this.isSatisfiedNow();
  };

  private handleClickOutside = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this.el)) {
      this.closeDropdown();
      this.inputValue = '';
      logInfo(this.devMode, 'AutocompleteMultiselect', 'Click outside - dropdown closed');
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
      if (key === 'Enter' && this.focusedOptionIndex >= 0) {
        this.selectOption(this.filteredOptions[this.focusedOptionIndex]);
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
      if (this.required) this.validation = !this.isSatisfiedNow();
    }
  };

  private handleAddItem = () => {
    const value = this.inputValue.trim();
    if (!value) return;

    this.itemSelect.emit(value); // let the host handle the add
    this.inputValue = '';
    this.validation = false;
    this.filterOptions(); // refresh dropdown after clearing
    this.focusedOptionIndex = -1;

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Add button clicked', { value });
  };

  // keep dropdown open when mousedown inside
  private onOptionMouseDown = (e: MouseEvent, option: string) => {
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
    this.toggleItem(option);

    setTimeout(() => {
      this.suppressBlur = false;
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);
  };

  // ---------------- Core Behavior ----------------

  @Method()
  public async navigateOptions(direction: number): Promise<void> {
    const newIndex = this.focusedOptionIndex + direction;
    if (!Array.isArray(this.filteredOptions)) return;

    if (newIndex >= 0 && newIndex < this.filteredOptions.length) {
      this.focusedOptionIndex = newIndex;
      setTimeout(() => {
        const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
        if (items[newIndex]) (items[newIndex] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 0);
    } else {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Navigation index out of bounds', {
        attemptedIndex: newIndex,
        totalOptions: this.filteredOptions.length,
      });
    }
  }

  @Method()
  public async filterOptions(): Promise<void> {
    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultiselect', `'options' must be an array`, {
        receivedType: typeof this.options,
        value: this.options,
      });
      this.filteredOptions = [];
      return;
    }

    const v = this.inputValue.trim().toLowerCase();
    const available = this.options.filter(opt => !this.selectedItems.includes(opt));
    this.filteredOptions = v.length > 0 ? available.filter(opt => opt.toLowerCase().includes(v)) : available;
  }

  private toggleItem(option: string) {
    const updated = new Set(this.selectedItems);
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = Array.from(updated);
    this.inputValue = '';
    this.selectionChange.emit(this.selectedItems);

    this.validation = this.required && !this.isSatisfiedNow();
    this.filterOptions();

    // restore focus for continued typing
    setTimeout(() => {
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Toggled item', {
      selected: option,
      currentSelections: this.selectedItems,
    });
  }

  private selectOption(option: string) {
    if (typeof option !== 'string' || option.trim() === '') {
      logError(this.devMode, 'AutocompleteMultiselect', 'Invalid option selected', { option });
      return;
    }

    if (!this.selectedItems.includes(option)) {
      this.selectedItems = [...this.selectedItems, option];
      this.selectionChange.emit(this.selectedItems);
    }

    this.inputValue = '';
    this.validation = false;
    this.filterOptions();
    this.focusedOptionIndex = -1;

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Item selected', { selected: option });
  }

  private closeDropdown() {
    this.filteredOptions = [];
       this.focusedOptionIndex = -1;
    logInfo(this.devMode, 'AutocompleteMultiselect', 'Dropdown closed');
  }

  private removeItem(item: string) {
    this.selectedItems = this.selectedItems.filter(i => i !== item);
    this.filterOptions();
    this.selectionChange.emit(this.selectedItems);

    if (this.required) this.validation = !this.isSatisfiedNow();
  }

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.selectionChange.emit([]);

    this.hasBeenInteractedWith = true;
    if (this.required && this.hasBeenInteractedWith) this.validation = !this.isSatisfiedNow();

    this.clear.emit();
    logInfo(this.devMode, 'AutocompleteMultiselect', 'Input cleared');
  };

  // ---------------- Render helpers ----------------

  private parseInlineStyles(styles: string): { [k: string]: string } | undefined {
    if (!styles || typeof styles !== 'string') return undefined;
    return styles.split(';').reduce((acc, rule) => {
      const [key, value] = rule.split(':').map(s => s.trim());
      if (key && value) acc[key.replace(/-([a-z])/g, g => g[1].toUpperCase())] = value;
      return acc;
    }, {} as { [k: string]: string });
  }

  private renderSelectedItems() {
    return this.selectedItems.map(item => {
      const classMap: { [k: string]: boolean } = {
        badge: true,
        [`text-bg-${this.badgeVariant}`]: !!this.badgeVariant,
        [this.badgeShape]: !!this.badgeShape,
        [this.size]: !!this.size,
      };

      return (
        <span class={classMap} style={this.parseInlineStyles(this.badgeInlineStyles)} key={item}>
          <span>{item}</span>
          <button onClick={() => this.removeItem(item)} aria-label={`Remove ${item}`} data-tag={item} role="button" class="remove-btn" title="Remove Tag">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9z" />
            </svg>
          </button>
        </span>
      );
    });
  }

  private renderAddIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
      </svg>
    );
  }

  private renderAddButton() {
    if (!this.addBtn) return null;
    return (
      <button class="input-group-btn add add-btn" role="button" disabled={this.disabled} onClick={this.handleAddItem} aria-label="Add item" title="Add item">
        {this.addIcon ? <i class={this.addIcon} /> : this.renderAddIcon()}
      </button>
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
    const hasInputOrSelection = this.inputValue.trim().length > 0 || this.selectedItems.length > 0;
    if (this.removeClearBtn || !hasInputOrSelection) return null;

    return (
      <button class="input-group-btn clear clear-btn" aria-label="Clear input" disabled={this.disabled} title="Clear input" onClick={this.clearAll}>
        {this.clearIcon ? <i class={this.clearIcon} /> : this.renderClearIcon()}
      </button>
    );
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
    const placeholder = this.labelHidden ? this.label || this.placeholder || 'Placeholder Text' : this.label || this.placeholder || 'Placeholder Text';

    return (
      <input
        id={ids || null}
        name={names || null}
        role="combobox"
        aria-label={this.labelHidden ? names : null}
        aria-labelledby={this.arialabelledBy}
        aria-describedby={this.validation ? `${ids}-validation` : this.error ? `${ids}-error` : null}
        aria-autocomplete="list"
        aria-expanded={this.filteredOptions.length > 0 ? 'true' : 'false'}
        aria-controls={`${ids}-listbox`}
        aria-activedescendant={this.focusedOptionIndex >= 0 ? `${ids}-option-${this.focusedOptionIndex}` : undefined}
        aria-required={this.required ? 'true' : 'false'}
        aria-haspopup="listbox"
        class={this.inputClasses()}
        type={this.type}
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

  private renderDropdownList(ids: string) {
    if (this.filteredOptions.length === 0) {
      return this.inputValue.trim().length > 0 ? (
        <ul role="listbox" id={`${ids}-listbox`} tabindex="-1">
          <li class={{ 'autocomplete-dropdown-no-results': true, [`${this.size}`]: !!this.size }} aria-disabled="true">
            No results found
          </li>
        </ul>
      ) : null;
    }

    return (
      <ul role="listbox" id={`${ids}-listbox`} tabindex="-1">
        {this.filteredOptions.map((option, i) => (
          <li
            id={`${ids}-option-${i}`}
            role="option"
            aria-selected={this.focusedOptionIndex === i ? 'true' : 'false'}
            class={{
              'autocomplete-dropdown-item': true,
              focused: this.focusedOptionIndex === i,
              [`${this.size}`]: !!this.size,
            }}
            onMouseDown={e => this.onOptionMouseDown(e, option)}
            tabindex="-1"
          >
            <span innerHTML={option.replace(/</g, '&lt;').replace(/>/g, '&gt;')} />
          </li>
        ))}
      </ul>
    );
  }

  private renderDropdown(ids: string) {
    if (!this.inputValue.trim()) return null;
    logInfo(this.devMode, 'AutocompleteMultiselect', 'Dropdown opened', { optionsCount: this.filteredOptions.length });

    return (
      <div class="autocomplete-dropdown" aria-live="polite">
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
      <div class={this.containerClasses()}>
        <div class="ac-selected-items">{this.renderSelectedItems()}</div>
        <div class="ac-input-container">
          <div class={{ 'input-group': true }}>
            {this.renderInputField(ids, names)}
            {this.renderAddButton()}
            {this.renderClearButton()}
          </div>
        </div>
      </div>
    );
  }

  private renderLayout(ids: string, names: string) {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';

    // Build grid classes from new props (or numeric fallbacks)
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

    // Stacked layout
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

  // ---------------- Public API ----------------

  public validate(): boolean {
    this.validation = this.required && !this.isSatisfiedNow();
    return !this.validation;
  }

  // ---------------- Render root ----------------

  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    return <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(ids, names)}</div>;
  }
}
