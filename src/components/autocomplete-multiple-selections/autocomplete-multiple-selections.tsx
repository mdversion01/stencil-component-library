// src/components/autocomplete-multiple-selections/autocomplete-multiple-selections.tsx
import { Component, h, Prop, State, Element, Event, EventEmitter, Watch, Method } from '@stencil/core';
import { logInfo, logWarn, logError } from '../../utils/log-debug';

@Component({
  tag: 'autocomplete-multiple-selections',
  styleUrls: [
    '../layout-styles.scss',
    '../form-styles.scss',
    '../input-field/input-field-styles.scss',
    '../input-group/input-group-styles.scss',
    '../autocomplete-single/autocomplete-input.scss',
    '../autocomplete-multiselect/autocomplete-multiselect.scss',
    './autocomplete-multiple-selections.scss',
  ],
  shadow: false,
})
export class AutocompleteMultipleSelections {
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
  @Prop() inputId: string = '';
  @Prop() label: string = '';
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() removeClearBtn: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() removeBtnBorder: boolean = false;
  @Prop() required: boolean = false;
  @Prop() type = '';
  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';

  // Badge Props
  @Prop() badgeVariant: string = ''; // 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  @Prop() badgeShape: string = ''; // 'rounded' | 'circle' | 'square' | 'pill'
  @Prop() badgeInlineStyles: string = ''; // 'width: 100px; height: 100px;' | 'color: red; background-color: blue;' | 'font-size: 16px; font-weight: bold;'

  /** Bootstrap grid columns for label when formLayout="horizontal" (default 2) */
  @Prop() labelCol: number = 2;
  /** Bootstrap grid columns for input when formLayout="horizontal" (default 10) */
  @Prop() inputCol: number = 10;

  @State() inputValue: string = '';
  @State() filteredOptions: string[] = [];
  @State() selectedItems: string[] = [];
  @State() focusedOptionIndex: number = -1;
  @State() isFocused: boolean = false;
  @State() hasBeenInteractedWith: boolean = false;
  @State() satisfied: boolean = false; // true when selected OR input length >= 3

  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange: EventEmitter<string[]>;

  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `'options' should be an array`, { receivedType: typeof newVal });
      return;
    }
    this.filterOptions();
  }

  private camelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');
  }

  private sanitizeInput(value: string): string {
    return value.replace(/[<>]/g, '');
  }

  private suppressBlur = false;

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside);
    this.hasBeenInteractedWith = false;
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `Expected 'options' to be an array, got ${typeof this.options}`);
    }

    if (!this.label) {
      logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Missing label prop; accessibility may be impacted');
    }
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  private handleFocus = () => {
    this.isFocused = true;
  };

  private handleBlur = () => {
    this.isFocused = false;

    // If blur was caused by clicking inside the dropdown, skip closing now.
    if (this.suppressBlur) {
      return;
    }

    // Let any pending interactions settle, then close
    setTimeout(() => this.closeDropdown(), 0);

    if (this.required) {
      this.validation = !this.isSatisfiedNow();
    }
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

    if (!Array.isArray(this.filteredOptions)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `'filteredOptions' is not an array`, {
        receivedType: typeof this.filteredOptions,
      });
      return;
    }

    if (newIndex >= 0 && newIndex < this.filteredOptions.length) {
      this.focusedOptionIndex = newIndex;
      this.ensureOptionInView(newIndex);
    } else {
      logWarn(this.devMode, 'AutocompleteMultipleSelections', `Navigation index out of bounds`, {
        attemptedIndex: newIndex,
        totalOptions: this.filteredOptions.length,
      });
    }
  }

  private isSatisfiedNow(): boolean {
    const typedEnough = this.inputValue.trim().length >= 3;
    const hasSelection = this.selectedItems.length > 0;
    return typedEnough || hasSelection;
  }

  private showRequiredMark(): boolean {
    return this.required && !this.isSatisfiedNow();
  }

  private renderInputLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;

    const classes = [
      'form-control-label',
      this.showRequiredMark() ? 'required' : '',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.formLayout === 'horizontal' ? `${labelColClass} no-padding col-form-label` : '',
      this.validation ? 'invalid' : '',
      this.labelHidden ? 'sr-only' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.formLayout === 'horizontal' || this.formLayout === 'inline' ? `${this.label}:` : this.label;

    return (
      <label class={classes} htmlFor={ids || undefined}>
        {text}{this.showRequiredMark() ? '*' : ''}
      </label>
    );
  }

  private renderInputField(ids: string, names: string) {
    const sizeClass = this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '';
    const classes = ['form-control', this.validation || this.error ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');

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
        inputmode="text"
        autocomplete="off"
        spellcheck="false"
      />
    );
  }

  private renderAddIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
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

    this.itemSelect.emit(value);
    this.inputValue = '';
    this.validation = false;
    this.filterOptions();
    this.focusedOptionIndex = -1;

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Add item clicked', { value });
  };

  private renderClearIcon() {
    return (
      <svg class="fa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z" />
      </svg>
    );
  }

  private renderClearButton() {
    const hasInputOrSelection = this.inputValue.trim().length > 0 || this.selectedItems.length > 0;
    if (this.removeClearBtn || !hasInputOrSelection) return null;
    return (
      <button class="input-group-btn clear clear-btn" disabled={this.disabled} onClick={this.clearAll} aria-label="Clear input" title="Clear input">
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
      this.closeDropdown();
      this.inputValue = '';
      logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Click outside - dropdown closed');
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
      } else if (key === 'Enter') {
        event.preventDefault();

        const trimmed = this.inputValue.trim().toLowerCase();
        const exactMatch = this.filteredOptions.find(opt => opt.toLowerCase() === trimmed);

        if (this.focusedOptionIndex >= 0 && this.filteredOptions[this.focusedOptionIndex]) {
          this.toggleItem(this.filteredOptions[this.focusedOptionIndex]);
        } else if (exactMatch) {
          this.toggleItem(exactMatch);
        } else if (this.filteredOptions.length > 0) {
          logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Enter ignored — not exact match');
        } else {
          // No options matched, do nothing
          logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Enter key ignored — no filtered options');
        }
      } else if (key === 'Escape') {
        this.closeDropdown();
      }
    } else {
      this.inputValue = this.sanitizeInput(input.value);
      this.filterOptions();
      this.hasBeenInteractedWith = true;
      if (this.required) {
        this.validation = !this.isSatisfiedNow();
      }
    }
  };

  /** Compute safe label/input col classes without mutating props. */
  private getComputedCols() {
    // Defaults for horizontal layout
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;

    // If the label is visually hidden and layout is horizontal, use full-width input
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

  public filterOptions() {
    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `'options' must be an array`, {
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
        {this.filteredOptions.length === 0 ? (
          <li class={{ 'autocomplete-dropdown-no-results': true, [`${this.size}`]: !!this.size }} aria-disabled="true">
            No results found
          </li>
        ) : (
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
              onMouseDown={e => this.onOptionMouseDown(e, option)}
              tabindex="-1"
            >
              <span innerHTML={option.replace(/</g, '&lt;').replace(/>/g, '&gt;')} />
            </li>
          ))
        )}
      </ul>
    );
  }

  private renderDropdown(ids: string) {
    if (!this.inputValue.trim()) return null;

    return (
      <div class="autocomplete-dropdown" aria-live="polite">
        {this.renderDropdownList(ids)}
      </div>
    );
  }

  private onOptionMouseDown = (e: MouseEvent, option: string) => {
    // prevent the input from losing focus before we handle selection
    e.preventDefault();
    e.stopPropagation();

    this.suppressBlur = true; // tell onBlur not to close
    this.toggleItem(option); // add/remove selection right away

    // allow blur handling to resume after the current tick
    setTimeout(() => {
      this.suppressBlur = false;
      // put focus back to the input for continuous typing
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);
  };

  private toggleItem(option: string) {
    const updated = new Set(this.selectedItems);
    if (updated.has(option)) {
      updated.delete(option);
    } else {
      updated.add(option);
    }

    this.selectedItems = Array.from(updated);
    this.selectionChange.emit(this.selectedItems);

    this.validation = this.required && !this.isSatisfiedNow();
    this.filterOptions();

    // ⏱ restore input focus after selecting an item
    setTimeout(() => {
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Toggled item', {
      selected: option,
      currentSelections: this.selectedItems,
    });
  }

  private closeDropdown() {
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Dropdown closed');
  }

  private removeItem(item: string) {
    this.selectedItems = this.selectedItems.filter(i => i !== item);
    this.filterOptions();
    this.selectionChange.emit(this.selectedItems);

    if (this.selectedItems.length === 0 && this.required) {
      this.validation = this.required && !this.isSatisfiedNow(); // ✅ triggers reactive re-render
    }
  }

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.selectionChange.emit([]);

    this.hasBeenInteractedWith = true;
    if (this.required && this.hasBeenInteractedWith) {
      this.validation = this.required && !this.isSatisfiedNow();
    }

    this.clear.emit();
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Input cleared');
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

    // Build grid classes
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
                  'ac-multi-select-container': true,
                  'is-invalid': this.validation,
                  [`${this.size}`]: !!this.size,
                  [this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '']: true,
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
              {this.formLayout === 'inline' ? this.renderValidationMessages(ids) : ''}
              {this.formLayout === 'inline' ? this.renderErrorMessages(ids) : ''}
            </div>
          </div>
        ) : (
          // Non-row layout (stacked)
          <div>
            {this.renderInputLabel(ids)}
            <div>
              <div
                class={{
                  'ac-multi-select-container': true,
                  'is-invalid': this.validation,
                  [`${this.size}`]: !!this.size,
                  [this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '']: true,
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
        )}
      </div>
    );
  };

  public validate(): boolean {
    this.validation = this.required && !this.isSatisfiedNow();
    return !this.validation;
  }

  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    return (
      <div class="form-group">
        {this.renderLayout(ids, names)}
        {this.formLayout === 'horizontal' ? this.renderValidationMessages(ids) : ''}
        {this.formLayout === 'horizontal' ? this.renderErrorMessages(ids) : ''}
      </div>
    );
  }
}
