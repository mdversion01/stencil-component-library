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

  @Prop({ mutable: true }) options: string[] = [];
  @Prop() addBtn = false;
  @Prop() addIcon = '';
  @Prop() arialabelledBy: string = '';
  @Prop() clearIcon = '';
  @Prop() placeholder: string = 'Type to search/filter...';
  @Prop() devMode: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() formId: string = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop({ mutable: true }) error = false;
  @Prop({ mutable: true }) errorMessage = '';
  @Prop() inputId = '';
  @Prop() label: string = '';
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() removeClearBtn: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() required: boolean = false;
  @Prop() type = '';
  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';

  /** Bootstrap grid columns for label when formLayout="horizontal" (default 2) */
  @Prop() labelCol: number = 2;
  /** Bootstrap grid columns for input when formLayout="horizontal" (default 10) */
  @Prop() inputCol: number = 10;

  @State() inputValue: string = '';
  @State() filteredOptions: string[] = [];
  @State() focusedOptionIndex: number = -1;
  @State() selectedOptionIndex: number = -1;
  @State() isFocused: boolean = false;
  @State() hasBeenInteractedWith: boolean = false;
  @State() dropdownOpen: boolean = false;
  @State() satisfied: boolean = false; // true when selected OR input length >= 3

  /** while clicking inside the dropdown, don't let input blur close it */
  private suppressBlur = false;

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

    // If blur was caused by clicking inside the dropdown, skip closing now.
    if (this.suppressBlur) {
      this.suppressBlur = false;
      return;
    }

    // Let any pending interactions settle, then close
    setTimeout(() => this.closeDropdown(), 0);

    if (this.required) {
      const meetsThreshold = this.inputValue.trim().length >= 3;
      this.validation = !meetsThreshold;
    }
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
      } else if (key === 'Enter') {
        // If an option is focused, select it; otherwise close and blur
        if (this.focusedOptionIndex >= 0) {
          this.selectOption(this.filteredOptions[this.focusedOptionIndex]);
        } else {
          event.preventDefault();
          this.closeDropdown();
          input.blur();
          if (this.required) {
            const meetsThreshold = this.inputValue.trim().length >= 3;
            this.validation = !meetsThreshold;
          }
        }
        return;
      } else if (key === 'Escape') {
        this.closeDropdown();
      }
    } else {
      this.inputValue = this.sanitizeInput(input.value);
      this.filterOptions();
      this.hasBeenInteractedWith = true;

      const meetsThreshold = this.inputValue.trim().length >= 3;
      if (meetsThreshold && this.validation) this.validation = false;

      if (this.required && this.inputValue.trim() === '') {
        this.validation = true;
      }
    }
  };

  /** Compute safe label/input col classes without mutating props. */
  private getComputedCols() {
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;

    if (this.formLayout === 'horizontal' && this.labelHidden) {
      return { label: 0, input: 12 };
    }

    const lbl = Number(this.labelCol);
    const inp = Number(this.inputCol);
    const label = Number.isFinite(lbl) ? Math.max(0, Math.min(12, lbl)) : DEFAULT_LABEL;
    const input = Number.isFinite(inp) ? Math.max(0, Math.min(12, inp)) : DEFAULT_INPUT;

    if (this.formLayout === 'horizontal') {
      if (label + input !== 12) {
        console.error(
          '[autocomplete-multiselect] For formLayout="horizontal", label-col + input-col must equal 12 exactly. ' +
            `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. ` +
            'Falling back to 2/10.',
        );
        return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
      }
    }

    return { label, input };
  }

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
      this.filteredOptions = this.options.filter(opt => opt.toLowerCase().includes(this.inputValue.toLowerCase()));
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

  private showRequiredMark(): boolean {
    return this.required && this.inputValue.trim().length < 3;
  }

  private renderInputLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;

    const classes = [
      'form-control-label',
      this.showRequiredMark() ? 'required' : '',
      this.labelSize === 'sm' ? ' label-sm' : this.labelSize === 'lg' ? ' label-lg' : '',
      this.formLayout === 'horizontal' ? ` ${labelColClass} no-padding col-form-label` : '',
      this.validation ? ' invalid' : '',
      this.labelHidden ? ' sr-only' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.formLayout === 'horizontal' || this.formLayout === 'inline' ? `${this.label}:` : this.label;

    return (
      <label class={classes} htmlFor={ids || undefined}>
        {text}
      </label>
    );
  }

  private renderInputField(ids: string, names: string) {
    const sizeClass = this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '';
    const classes = ['form-control', this.validation ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');

    const placeholder = this.labelHidden ? this.label || this.placeholder || 'Placeholder Text' : this.label || this.placeholder || 'Placeholder Text';

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
        class={classes}
        type={this.type}
        placeholder={placeholder}
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

  private onDropdownMouseDown = () => {
    // prevent input blur from closing the dropdown when clicking inside it
    this.suppressBlur = true;
  };

  private renderDropdownList(ids: string) {
    return (
      <ul role="listbox" id={`${ids}-listbox`} tabIndex={-1}>
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
              onMouseDown={this.onDropdownMouseDown}
              onClick={() => this.selectOption(option)}
              tabIndex={-1}
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
      <div class="autocomplete-dropdown" aria-live="polite" onMouseDown={this.onDropdownMouseDown}>
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

    // selection finished: allow normal blur from now on
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
    const path = (event.composedPath && event.composedPath()) || [];
    if (!path.includes(this.el)) {
      this.closeDropdown();
    }
  };

  private renderValidationMessages = (ids: string) => {
    if (this.validation && this.validationMessage) {
      if (this.formLayout === 'horizontal') {
        const { label, input } = this.getComputedCols();
        const labelColClass = `col-${label}`;
        const inputColClass = `col-${input}`;

        return (
          <div class="row">
            <div class={labelColClass}></div>
            <div class={inputColClass}>
              <div id={`${ids}-validation`} class="invalid-feedback" aria-live="polite">
                {this.validationMessage}
              </div>
            </div>
          </div>
        );
      } else if (this.formLayout === 'inline') {
        return (
          <div class="row">
            <div></div>
            <div>
              <div id={`${ids}-validation`} class="invalid-feedback" aria-live="polite">
                {this.validationMessage}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div id={`${ids}-validation`} class="invalid-feedback" aria-live="polite">
            {this.validationMessage}
          </div>
        );
      }
    }
    return '';
  };

  private renderErrorMessages = (ids: string) => {
    if (this.error && this.errorMessage) {
      if (this.formLayout === 'horizontal') {
        const { label, input } = this.getComputedCols();
        const labelColClass = `col-${label}`;
        const inputColClass = `col-${input}`;

        return (
          <div class="row">
            <div class={labelColClass}></div>
            <div class={inputColClass}>
              <div id={`${ids}-error`} class="error-message" aria-live="polite">
                {this.errorMessage}
              </div>
            </div>
          </div>
        );
      } else if (this.formLayout === 'inline') {
        return (
          <div class="row">
            <div></div>
            <div>
              <div id={`${ids}-error`} class="error-message" aria-live="polite">
                {this.errorMessage}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div id={`${ids}-error`} class="error-message" aria-live="polite">
            {this.errorMessage}
          </div>
        );
      }
    }
    return '';
  };

  private renderLayout = (ids: string, names: string) => {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';

    const isRowLayout = this.formLayout === 'horizontal' || this.formLayout === 'inline';
    const { label, input } = this.getComputedCols();

    const labelColClass = this.formLayout === 'horizontal' && !this.labelHidden ? `col-${label}` : '';
    const inputColClass = this.formLayout === 'horizontal' ? `col-${this.labelHidden ? 12 : input}` : this.formLayout === 'inline' ? '' : '';

    return (
      <div class={outerClass}>
        {isRowLayout ? (
          <div class={`row form-group ${this.formLayout === 'inline' ? 'inline' : this.formLayout === 'horizontal' ? 'horizontal' : ''}`}>
            {this.renderInputLabel(ids, labelColClass)}
            <div class={inputColClass || undefined}>
              <div
                class={{
                  'input-group autocomplete-single-select': true,
                  'is-invalid': this.validation,
                  [this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '']: true,
                  [`${this.size}`]: !!this.size,
                }}
              >
                {this.renderInputField(ids, names)}
                {this.renderAddButton()}
                {this.renderClearButton()}
              </div>
              {this.renderDropdown(ids)}
              {this.formLayout === 'inline' ? this.renderValidationMessages(ids) : ''}
              {this.formLayout === 'inline' ? this.renderErrorMessages(ids) : ''}
            </div>
          </div>
        ) : (
          <div>
            {this.renderInputLabel(ids)}
            <div>
              <div
                class={{
                  'input-group autocomplete-single-select': true,
                  'is-invalid': this.validation,
                  [`${this.size}`]: !!this.size,
                  [this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '']: true,
                }}
              >
                {this.renderInputField(ids, names)}
                {this.renderAddButton()}
                {this.renderClearButton()}
              </div>
              {this.renderDropdown(ids)}
              {this.renderValidationMessages(ids)}
              {this.renderErrorMessages(ids)}
            </div>
          </div>
        )}
      </div>
    );
  };

  componentDidLoad() {
    // Use capture to ensure this fires even when clicks originate in nested portals/shadow etc.
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
        {this.formLayout === 'horizontal' ? this.renderValidationMessages(ids) : ''}
        {this.formLayout === 'horizontal' ? this.renderErrorMessages(ids) : ''}
      </div>
    );
  }
}
