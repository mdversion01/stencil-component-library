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

  // Props
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
  @Prop() badgeVariant: string = '';
  @Prop() badgeShape: string = '';
  @Prop() badgeInlineStyles: string = '';

  // Legacy numeric cols (fallback)
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** NEW: responsive column class specs (e.g., "col", "col-sm-3 col-md-4", or "xs-12 sm-6 md-4") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // State
  @State() inputValue: string = '';
  @State() filteredOptions: string[] = [];
  @State() selectedItems: string[] = [];
  @State() focusedOptionIndex: number = -1;
  @State() isFocused: boolean = false;
  @State() hasBeenInteractedWith: boolean = false;
  @State() dropdownOpen: boolean = false;

  /** prevent blur -> close when clicking inside dropdown */
  private suppressBlur = false;

  // Events
  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange: EventEmitter<string[]>;

  // Watchers
  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `'options' should be an array`, { receivedType: typeof newVal });
      return;
    }
    this.filterOptions();
  }

  // Lifecycle
  componentWillLoad() {
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `Expected 'options' to be an array, got ${typeof this.options}`);
    }
    if (!this.label) {
      logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Missing label prop; accessibility may be impacted');
    }
  }

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  // ---------- Helpers / Utilities ----------

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

      // already a bootstrap col class
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

      if (this.devMode) console.warn('[autocomplete-multiple-selections] Unknown cols token:', t);
    }

    return Array.from(new Set(out)).join(' ');
  }

  /** Build final col class (string spec > numeric fallback > special cases). */
  private buildColClass(kind: 'label' | 'input'): string {
    const spec = (kind === 'label' ? this.labelCols : this.inputCols)?.trim();
    const num = kind === 'label' ? this.labelCol : this.inputCol;

    if (this.isHorizontal()) {
      if (spec) return this.parseColsSpec(spec);

      // label hidden -> input spans full width unless overridden
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

    // Inline: allow user-provided classes if any
    if (this.isInline()) {
      return spec ? this.parseColsSpec(spec) : '';
    }

    // Stacked: no grid classes
    return '';
  }

  /** Legacy numeric validation helper (still used when no string specs provided). */
  private getComputedCols() {
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;

    if (this.isHorizontal() && this.labelHidden) return { label: 0, input: 12 };

    const lbl = Number(this.labelCol);
    const inp = Number(this.inputCol);
    const label = Number.isFinite(lbl) ? Math.max(0, Math.min(12, lbl)) : DEFAULT_LABEL;
    const input = Number.isFinite(inp) ? Math.max(0, Math.min(12, inp)) : DEFAULT_INPUT;

    if (this.isHorizontal() && !this.labelCols && !this.inputCols && label + input !== 12) {
      console.error(
        '[autocomplete-multiple-selections] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }
    return { label, input };
  }

  // ---------- Input focus/blur ----------
  private handleFocus = () => {
    this.isFocused = true;
  };

  private closeTimer: number | null = null;

  private handleBlur = () => {
    this.isFocused = false;
    if (this.suppressBlur) return;

    // Clear any prior close attempt
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    // Delay the close slightly; if focus returns, skip closing
    this.closeTimer = window.setTimeout(() => {
      if (!this.isFocused) {
        this.closeDropdown();
      }
      this.closeTimer = null;
    }, 120);

    if (this.required) this.validation = !this.isSatisfiedNow();
  };

  // ---------- Keyboard navigation ----------
  private ensureOptionInView(index: number) {
    setTimeout(() => {
      const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
      if (items && index >= 0 && index < items.length) {
        (items[index] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  @Method()
  public async navigateOptions(direction: number): Promise<void> {
    const newIndex = this.focusedOptionIndex + direction;
    if (!Array.isArray(this.filteredOptions)) return;

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

  // ---------- Filtering ----------
  public filterOptions() {
    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `'options' must be an array`, {
        receivedType: typeof this.options,
        value: this.options,
      });
      this.filteredOptions = [];
      this.dropdownOpen = false;
      return;
    }

    const q = this.inputValue.trim().toLowerCase();
    const pool = this.options.filter(opt => !this.selectedItems.includes(opt));

    if (q.length === 0) {
      this.filteredOptions = [];
      this.dropdownOpen = false;
      return;
    }

    this.filteredOptions = pool.filter(opt => opt.toLowerCase().includes(q));
    this.dropdownOpen = this.filteredOptions.length > 0; // open only if there are matches
  }

  private getAvailableOptions(): string[] {
    return this.options.filter(opt => !this.selectedItems.includes(opt));
  }

  /** Recompute filteredOptions from a specific query (does not read inputValue). */
  private filterFromQuery(query: string): boolean {
    const q = query.trim().toLowerCase();
    const pool = this.getAvailableOptions();
    const next = q ? pool.filter(opt => opt.toLowerCase().includes(q)) : [];
    this.filteredOptions = next;
    this.dropdownOpen = next.length > 0;
    this.focusedOptionIndex = next.length ? 0 : -1;
    return next.length > 0;
  }

  // ---------- Input handling (typing + keys) ----------
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
        const trimmed = this.inputValue.trim().toLowerCase();
        const exactMatch = this.filteredOptions.find(opt => opt.toLowerCase() === trimmed);

        if (this.focusedOptionIndex >= 0 && this.filteredOptions[this.focusedOptionIndex]) {
          this.toggleItem(this.filteredOptions[this.focusedOptionIndex]);
        } else if (exactMatch) {
          this.toggleItem(exactMatch);
        } else if (this.filteredOptions.length === 0) {
          logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Enter ignored — no filtered options');
        } else {
          logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Enter ignored — not exact match');
        }
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

  // ---------- Click outside ----------
  private handleClickOutside = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this.el)) {
      this.closeDropdown();
      this.inputValue = '';
      logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Click outside - dropdown closed');
    }
  };

  // ---------- Selection toggling ----------
  private onOptionMouseDown = (e: MouseEvent, option: string) => {
    e.preventDefault();
    e.stopPropagation();

    this.suppressBlur = true;

    // ⛔ Cancel any scheduled close from a previous blur
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.toggleItem(option);

    setTimeout(() => {
      this.suppressBlur = false;
      const input = this.el.querySelector('input');
      input?.focus(); // will set isFocused = true
    }, 0);
  };

  private toggleItem(option: string) {
    const lastQuery = this.inputValue;

    const updated = new Set(this.selectedItems);
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = Array.from(updated);
    this.selectionChange.emit(this.selectedItems);

    // clear typing so the first character doesn’t “stick”
    this.inputValue = '';

    // keep validation up-to-date
    this.validation = this.required && !this.isSatisfiedNow();

    // Try to keep the dropdown filtered by the last query…
    const stillHasMatches = this.filterFromQuery(lastQuery);

    // …but if that query now has no matches, show ALL remaining options instead
    if (!stillHasMatches) {
      const available = this.getAvailableOptions();
      this.filteredOptions = available;
      this.dropdownOpen = available.length > 0;
      this.focusedOptionIndex = available.length ? 0 : -1;
    }

    // keep focus for fast multi-select
    setTimeout(() => {
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Toggled item', {
      selected: option,
      currentSelections: this.selectedItems,
    });
  }

  private removeItem(item: string) {
    this.selectedItems = this.selectedItems.filter(i => i !== item);
    this.filterOptions();
    this.selectionChange.emit(this.selectedItems);

    if (this.selectedItems.length === 0 && this.required) {
      this.validation = this.required && !this.isSatisfiedNow();
    }
  }

  // ---------- Add / Clear ----------
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

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.dropdownOpen = false; // ← keep signals consistent
    this.selectionChange.emit([]);

    this.hasBeenInteractedWith = true;
    if (this.required && this.hasBeenInteractedWith) {
      this.validation = this.required && !this.isSatisfiedNow();
    }

    this.clear.emit();
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Input cleared');
  };

  // ---------- Dropdown ----------
  private renderDropdownList(ids: string) {
    return (
      <ul role="listbox" id={`${ids}-listbox`} tabindex="-1">
        {this.filteredOptions.map((option, i) => (
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
        ))}
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

  private closeDropdown() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.dropdownOpen = false;
    this.inputValue = ''; // keep the “don’t leave first char” fix
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Dropdown closed');
  }

  // ---------- UI bits ----------
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
      if (this.badgeVariant) classMap[`text-bg-${this.badgeVariant}`] = true;
      if (this.badgeShape) classMap[this.badgeShape] = true;
      if (this.size) classMap[this.size] = true;

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

  private renderInputLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;

    const classes = [
      'form-control-label',
      this.showRequiredMark() ? 'required' : '',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validation ? 'invalid' : '',
      this.labelHidden ? 'sr-only' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isRowLayout() ? `${this.label}:` : this.label;

    return (
      <label class={classes} htmlFor={ids || undefined}>
        {text}
        {this.showRequiredMark() ? '*' : ''}
      </label>
    );
  }

  private renderInputField(ids: string, names: string) {
    const sizeClass = this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '';
    const classes = ['form-control', this.validation || this.error ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
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
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
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
      <button
        class={{
          'input-group-btn': true,
          'add': true,
          'add-btn': true,
          'no-border': this.removeBtnBorder,
        }}
        role="button"
        disabled={this.disabled}
        onClick={this.handleAddItem}
        aria-label="Add item"
        title="Add item"
      >
        {this.addIcon ? <i class={this.addIcon} /> : this.renderAddIcon()}
      </button>
    );
  }

  private renderClearIcon() {
    return (
      <svg class="fa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s-12.5-32.8 0-45.3L237.3 256l105.3-105.4z" />
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

  // ---------- Messages ----------
  private renderValidationMessages(ids: string) {
    if (!(this.validation && this.validationMessage)) return '';
    return (
      <div id={`${ids}-validation`} class="invalid-feedback" aria-live="polite">
        {this.validationMessage}
      </div>
    );
  }

  private renderErrorMessages(ids: string) {
    if (!(this.error && this.errorMessage)) return '';
    return (
      <div id={`${ids}-error`} class="error-message" aria-live="polite">
        {this.errorMessage}
      </div>
    );
  }

  // ---------- Layout ----------
  private renderLayout(ids: string, names: string) {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';
    const isRowLayout = this.isRowLayout();

    // (Numeric fallback kept for validation error logging only)
    this.getComputedCols();

    // Build grid classes from new props (or numeric fallbacks)
    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    const fieldBlock = (
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
    );

    return (
      <div class={outerClass}>
        {isRowLayout ? (
          <div class={`row form-group ${this.isInline() ? 'inline' : this.isHorizontal() ? 'horizontal' : ''}`}>
            {this.renderInputLabel(ids, labelColClass)}
            <div class={inputColClass}>
              {fieldBlock}
              {this.renderDropdown(ids)}
              {this.renderValidationMessages(ids)}
              {this.renderErrorMessages(ids)}
            </div>
          </div>
        ) : (
          // stacked
          <div>
            {this.renderInputLabel(ids)}
            <div>
              {fieldBlock}
              {this.renderDropdown(ids)}
              {this.renderValidationMessages(ids)}
              {this.renderErrorMessages(ids)}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- Public API ----------
  public validate(): boolean {
    this.validation = this.required && !this.isSatisfiedNow();
    return !this.validation;
  }

  // ---------- Render ----------
  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    return <div class="form-group">{this.renderLayout(ids, names)}</div>;
  }
}
