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

  @Prop({ mutable: true }) options: string[] = [];
  @Prop() addBtn = false;
  @Prop() addIcon = '';
  @Prop() arialabelledBy: string = '';
  @Prop() clearIcon = '';
  @Prop() placeholder: string = 'Type to search/filter...';
  @Prop() devMode: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() formId: string = '';
  @Prop() formLayout: string = ''; // 'horizontal'
  @Prop({ mutable: true }) error = false;
  @Prop({ mutable: true }) errorMessage = '';
  @Prop() inputId = '';
  @Prop() label: string = '';
  @Prop() labelHidden: boolean = false;
  @Prop() removeClearBtn: boolean = false;
  @Prop() size: string = ''; // 'sm' | 'lg'
  @Prop() required: boolean = false;
  @Prop() type = '';
  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';

  // Badge Props
  @Prop() badgeVariant: string = ''; // 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  @Prop() badgeShape: string = ''; // 'rounded' | 'circle' | 'square' | 'pill'
  @Prop() badgeInlineStyles: string = ''; // 'width: 100px; height: 100px;' | 'color: red; background-color: blue;' | 'font-size: 16px; font-weight: bold;'

  @State() inputValue: string = '';
  @State() filteredOptions: string[] = [];
  @State() selectedItems: string[] = [];
  @State() focusedOptionIndex: number = -1;
  @State() selectedOptionIndex: number = -1;
  @State() isFocused: boolean = false;
  @State() hasBeenInteractedWith: boolean = false;

  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange: EventEmitter<string[]>;

  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'AutocompleteMultiselect', `'options' should be an array`, { receivedType: typeof newVal });
      return;
    }
    this.filterOptions();
  }

  private camelCase(str: string): string {
    return (
      str
        // uppercase each word‑start (but lowercase the very first char)
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
        // remove spaces *and* hyphens
        .replace(/[\s-]+/g, '')
    );
  }

  private sanitizeInput(value: string): string {
    return value.replace(/[<>]/g, '');
  }

  private suppressBlur = false;

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside);
    this.validation = false;
    this.hasBeenInteractedWith = false;
  }

  componentWillLoad() {
    this.validation = false;
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

  private handleFocus = () => {
    this.isFocused = true;
  };

  private handleBlur = () => {
    if (this.suppressBlur) return; // 👈 Prevent blur side effects during selection
    this.isFocused = false;
  };

  private ensureOptionInView(index: number) {
    setTimeout(() => {
      const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
      if (items && index >= 0 && index < items.length) {
        const item = items[index] as HTMLElement;
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  @Method()
  public async navigateOptions(direction: number): Promise<void> {
    const newIndex = this.focusedOptionIndex + direction;

    if (!Array.isArray(this.filteredOptions)) return;

    if (newIndex >= 0 && newIndex < this.filteredOptions.length) {
      this.focusedOptionIndex = newIndex;
      this.ensureOptionInView(newIndex); // trigger scrollIntoView
    } else {
      logWarn(this.devMode, 'AutocompleteMultiselect', `Navigation index out of bounds`, {
        attemptedIndex: newIndex,
        totalOptions: this.filteredOptions.length,
      });
    }
  }

  private renderLabel(ids: string) {
    if (!this.label) return null;
    return (
      <label
        htmlFor={ids}
        class={{
          'form-label': true,
          'sr-only': this.labelHidden,
          'invalid': this.validation,
          'required-text': this.validation,
          'col-sm-2 col-form-label': this.formLayout === 'horizontal' || this.formLayout === 'inline',
        }}
      >
        <span>
          {this.label}
          {this.required ? <span class="required">*</span> : ''}
        </span>
      </label>
    );
  }

  private renderInputField(ids: string, names: string) {
    return (
      <input
        id={ids ? ids : null}
        name={names ? names : null}
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
        class={{
          'form-control': true,
          'is-invalid': this.validation,
          [`input-${this.size}`]: !!this.size,
        }}
        type={this.type}
        placeholder={this.placeholder}
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

  private handleAddItem = () => {
    const value = this.inputValue.trim();
    if (!value) return;

    this.itemSelect.emit(value); // 👉 user handles custom adding logic outside
    this.inputValue = '';
    this.validation = false;
    this.filterOptions(); // re-filter after clearing
    this.focusedOptionIndex = -1;

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Add button clicked', { value });
  };

  private renderClearIcon() {
    return (
      <svg class="fa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
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

  private parseInlineStyles(styles: string): { [key: string]: string } | undefined {
    if (!styles || typeof styles !== 'string') return undefined;

    return styles.split(';').reduce((acc, rule) => {
      const [key, value] = rule.split(':').map(s => s.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc[camelKey] = value;
      }
      return acc;
    }, {} as { [key: string]: string });
  }

  private renderSelectedItems() {
    return this.selectedItems.map(item => {
      const classMap: { [key: string]: boolean } = { badge: true };

      if (typeof this.badgeVariant === 'string') {
        classMap[`text-bg-${this.badgeVariant}`] = true;
      }

      if (typeof this.badgeShape === 'string') {
        classMap[this.badgeShape] = true;
      }

      if (typeof this.size === 'string') {
        classMap[this.size] = true;
      }

      return (
        <span class={classMap} style={this.parseInlineStyles(this.badgeInlineStyles)} key={item}>
          <span>{item}</span>
          <button onClick={() => this.removeItem(item)} aria-label={`Remove ${item}`} data-tag={item} role="button" class="remove-btn" title="Remove Tag">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>
          </button>
        </span>
      );
    });
  }

  private handleClickOutside = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this.el)) {
      this.filteredOptions = [];
      this.focusedOptionIndex = -1;
      // Clear input when dropdown closes
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
      } else if (key === 'ArrowUp') {
        event.preventDefault();
        this.navigateOptions(-1);
      } else if (key === 'Enter' && this.focusedOptionIndex >= 0) {
        this.selectOption(this.filteredOptions[this.focusedOptionIndex]);
      } else if (key === 'Escape') {
        this.closeDropdown();
      }
    } else {
      this.inputValue = this.sanitizeInput(input.value);
      this.filterOptions();
      this.hasBeenInteractedWith = true; // ✅ mark as touched
    }
  };

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
    if (this.inputValue.length > 0) {
      this.filteredOptions = this.options.filter(opt => opt.toLowerCase().includes(this.inputValue.toLowerCase()) && !this.selectedItems.includes(opt));
    } else {
      this.filteredOptions = this.options.filter(opt => !this.selectedItems.includes(opt));
    }
  }

  private renderDropdownList(ids: string) {
    return (
      <ul role="listbox" id={`${ids}-listbox`} tabindex="-1">
        {this.filteredOptions.length > 0 ? (
          this.filteredOptions.map((option, i) => (
            <li
              id={`${ids}-option-${i}`}
              role="option"
              aria-selected={this.focusedOptionIndex === i ? 'true' : 'false'}
              class={{
                'autocomplete-dropdown-item': true,
                'focused': this.focusedOptionIndex === i,
                [`${this.size}`]: !!this.size,
              }}
              onClick={() => this.toggleItem(option)}
              tabindex="-1"
            >
              <span innerHTML={option.replace(/</g, '&lt;').replace(/>/g, '&gt;')} />
            </li>
          ))
        ) : this.inputValue.trim().length > 0 ? (
          <li class={{ 'autocomplete-dropdown-no-results': true, [`${this.size}`]: !!this.size }} aria-disabled="true">
            No results found
          </li>
        ) : null}
      </ul>
    );
  }

  private renderDropdown(ids: string) {
    if (!this.inputValue.trim()) return null; // only check input presence

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Dropdown opened', {
      optionsCount: this.filteredOptions.length,
    });

    return (
      <div class="autocomplete-dropdown" aria-live="polite">
        {this.renderDropdownList(ids)}
      </div>
    );
  }

  private toggleItem(option: string) {
    this.suppressBlur = true;

    const updated = new Set(this.selectedItems);
    if (updated.has(option)) {
      updated.delete(option);
    } else {
      updated.add(option);
    }

    this.selectedItems = Array.from(updated);
    this.inputValue = '';
    this.filterOptions();
    this.validation = this.required && this.selectedItems.length === 0;
    this.selectionChange.emit(this.selectedItems);

    setTimeout(() => {
      this.suppressBlur = false;
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);
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
    this.validation = false; // ✅ Clear validation
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

    if (this.selectedItems.length === 0 && this.required) {
      this.validation = true; // ✅ triggers reactive re-render
    }
  }

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.selectionChange.emit([]);

    this.hasBeenInteractedWith = true;
    if (this.required && this.hasBeenInteractedWith) {
      this.validation = true;
    }

    this.clear.emit();
    logInfo(this.devMode, 'AutocompleteMultiselect', 'Input cleared');
  };

  private renderValidationMessages = (ids: string) => {
    if (this.validation && this.validationMessage) {
      if (this.formLayout === 'horizontal' || this.formLayout === 'inline') {
        return (
          <div class="row">
            <div class={{ 'col-sm-2': true, 'col': this.formLayout === 'inline' }}></div>
            <div class={{ 'col-sm-10': true, 'col': this.formLayout === 'inline' }}>
              <div id={`${ids}-validation`} class="invalid-feedback" aria-live="polite">
                {this.validationMessage}
              </div>
            </div>
          </div>
        );
      }
      return <div class="invalid-feedback">{this.validationMessage}</div>;
    }
    return '';
  };

  private renderErrorMessages = (ids: string) => {
    if (this.error && this.errorMessage) {
      if (this.formLayout === 'horizontal' || this.formLayout === 'inline') {
        return (
          <div class="row">
            <div class={{ 'col-sm-2': true, 'col': this.formLayout === 'inline' }}></div>
            <div class={{ 'col-sm-10': true, 'col': this.formLayout === 'inline' }}>
              <div id={`${ids}-error`} class="error-message" aria-live="polite">
                {this.errorMessage}
              </div>
            </div>
          </div>
        );
      }
      return <div class="error-message">{this.errorMessage}</div>;
    }
    return '';
  };

  private renderLayout = (ids: string, names: string) => {
    const isHorizontalOrInline = this.formLayout === 'horizontal' || this.formLayout === 'inline';

    return (
      <div class={{ row: isHorizontalOrInline, [this.formLayout]: isHorizontalOrInline }}>
        {this.renderLabel(ids)}
        <div class={isHorizontalOrInline ? 'col-sm-10' : null}>
          <div
            class={{
              'ac-multi-select-container': true,
              'is-invalid': this.validation,
              [`${this.size}`]: !!this.size,
              [this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '']: true, // ✅ highlights on input focus
            }}
          >
            <div class="ac-selected-items">{this.renderSelectedItems()}</div>
            <div class="ac-input-container">
              <div class={{ 'input-group': true }}>
                {this.renderInputField(ids, names)}
                {this.renderAddButton()}
                {this.renderClearButton()}
              </div>
            </div>
          </div>
          {this.renderDropdown(ids)}
        </div>
      </div>
    );
  };

  public validate(): boolean {
    if (this.required && this.inputValue.trim() === '') {
      this.validation = true;
      return false;
    }
    this.validation = false;
    return true;
  }

  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    return (
      <div class="form-group">
        {this.renderLayout(ids, names)}
        {this.renderValidationMessages(ids)}
        {this.renderErrorMessages(ids)}
      </div>
    );
  }
}
