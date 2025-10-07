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

  @State() inputValue: string = '';
  @State() filteredOptions: string[] = [];
  @State() focusedOptionIndex: number = -1;
  @State() selectedOptionIndex: number = -1;
  @State() isFocused: boolean = false;
  @State() hasBeenInteractedWith: boolean = false;
  @State() dropdownOpen: boolean = false;

  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;

  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'AutocompleteSingle', `'options' should be an array`, { receivedType: typeof newVal });
      return;
    }
    this.filterOptions();
  }

  private handleFocus = () => {
    this.isFocused = true;
  };

  private handleBlur = () => {
    this.isFocused = false;
  };

  private camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');
  }

  private sanitizeInput(value: string): string {
    return value.replace(/[<>]/g, '');
  }

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

      // if (this.required && this.inputValue.trim() === '') {
      //   this.validation = true; // ✅ restore validation only if required
      // }
    }
  };

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

    if (this.inputValue.length > 0) {
      this.filteredOptions = this.options.filter(opt =>
        opt.toLowerCase().includes(this.inputValue.toLowerCase())
      );
      this.dropdownOpen = true;
    } else {
      this.filteredOptions = [];
      this.dropdownOpen = false;
    }
  }

  private ensureOptionInView(index: number) {
    setTimeout(() => {
      const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
      if (items && index >= 0 && index < items.length) {
        const item = items[index] as HTMLElement;
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  private navigateOptions(direction: number) {
    const newIndex = this.focusedOptionIndex + direction;

    if (!Array.isArray(this.filteredOptions)) {
      logError(this.devMode, 'AutocompleteSingle', `'filteredOptions' is not an array`, {
        receivedType: typeof this.filteredOptions,
      });
      return;
    }

    if (newIndex >= 0 && newIndex < this.filteredOptions.length) {
      this.focusedOptionIndex = newIndex;
      this.ensureOptionInView(newIndex);
    } else {
      logWarn(this.devMode, 'AutocompleteSingle', `Navigation index out of bounds`, {
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

  private renderDropdownList(ids: string) {
    return (
      <ul role="listbox" id={`${ids}-listbox`} tabindex="-1">
        {this.filteredOptions.length > 0 ? (
          this.filteredOptions.map((option, index) => (
            <li
              id={`${ids}-option-${index}`}
              role="option"
              aria-selected={this.focusedOptionIndex === index ? 'true' : 'false'}
              class={{
                'autocomplete-dropdown-item': true,
                'focused': this.focusedOptionIndex === index,
                [`${this.size}`]: !!this.size,
              }}
              onClick={() => this.selectOption(option)}
              tabindex="-1"
            >
              <span innerHTML={option.replace(/</g, '&lt;').replace(/>/g, '&gt;')} />
            </li>
          ))
        ) : (
          <li
            class={{
              'autocomplete-dropdown-no-results': true,
              [`${this.size}`]: !!this.size,
            }}
            aria-disabled="true"
          >
            No results found
          </li>
        )}
      </ul>
    );
  }

  private renderDropdown(ids: string) {
    if (!this.dropdownOpen) return null;

    return (
      <div class="autocomplete-dropdown" aria-live="polite">
        {this.renderDropdownList(ids)}
      </div>
    );
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

    // ✅ Restore focus to input after selecting
    setTimeout(() => {
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);

    logInfo(this.devMode, 'AutocompleteSingle', 'Item selected', { selected: option });
  }

  private closeDropdown() {
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;

    logInfo(this.devMode, 'AutocompleteSingle', 'Dropdown closed');
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
      <button class="input-group-btn add add-btn" role="button" onClick={() => this.itemSelect.emit(this.inputValue)} aria-label="Add item" title="Add item">
        {this.addIcon ? <i class={this.addIcon} /> : this.renderAddIcon()}
      </button>
    );
  }

  private renderClearIcon() {
    return (
      <svg class="fa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    );
  }

  private renderClearButton() {
    if (this.removeClearBtn || !this.inputValue) return null;

    return (
      <button class="input-group-btn clear clear-btn" role="button" onClick={this.clearInput} aria-label="Clear input" title="Clear input">
        {this.clearIcon ? <i class={this.clearIcon} /> : this.renderClearIcon()}
      </button>
    );
  }

  private clearInput = () => {
    this.inputValue = '';
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.selectedOptionIndex = -1;

    this.hasBeenInteractedWith = true;
    this.dropdownOpen = false;

    if (this.required && this.hasBeenInteractedWith) {
      this.validation = true;
    }

    this.clear.emit();
    logInfo(this.devMode, 'AutocompleteSingle', 'Input cleared');
  };

  private handleClickOutside = (event: MouseEvent) => {
    const path = event.composedPath();
    if (!path.includes(this.el)) {
      this.closeDropdown(); // ✅ closes dropdown
    }
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
              'input-group autocomplete-single-select': true,
              'is-invalid': this.validation,
              [this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '']: true, // ✅ highlights on input focus
              [`${this.size}`]: !!this.size,
            }}
          >
            {this.renderInputField(ids, names)}
            {this.renderAddButton()}
            {this.renderClearButton()}
          </div>
          {this.renderDropdown(ids)}
        </div>
      </div>
    );
  };

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside);
    this.validation = false;
    this.hasBeenInteractedWith = false;
  }

  componentWillLoad() {
    this.validation = false;
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteSingle', `Expected 'options' to be an array, got ${typeof this.options}`);
    }

    if (!this.label) {
      logWarn(this.devMode, 'AutocompleteSingle', 'Missing label prop; accessibility may be impacted');
    }
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
  }

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
      <div
        class={{
          'autocomplete-container': true,
          'form-group': true,
        }}
      >
        {this.renderLayout(ids, names)}
        {this.renderValidationMessages(ids)}
        {this.renderErrorMessages(ids)}
      </div>
    );
  }
}
