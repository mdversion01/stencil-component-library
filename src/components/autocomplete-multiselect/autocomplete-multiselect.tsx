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
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden = false;
  @Prop() removeClearBtn = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() required = false;
  @Prop() type = '';
  @Prop({ mutable: true }) validation = false;
  @Prop() validationMessage = '';
  @Prop() clearInputOnBlurOutside: boolean = false;

  // Which field name to submit selected items under. If it ends with [] we’ll emit one hidden input per item.
  @Prop() name?: string;

  // Also submit whatever the user has typed (verbatim) under this field name.
  // Useful for comma-separated free text when editable=false.
  @Prop() rawInputName?: string;

  // Optional: whether selecting items clears the input.
  // Default: keep input when NOT editable; clear when editable.
  @Prop() preserveInputOnSelect?: boolean;

  // Add/Sort behavior
  @Prop() addNewOnEnter: boolean = true;
  @Prop() autoSort: boolean = true;

  // Master switch — can users add/delete options at runtime?
  @Prop() editable: boolean = false;

  // Badge Props
  @Prop() badgeVariant = '';
  @Prop() badgeShape = '';
  @Prop() badgeInlineStyles = '';

  // Horizontal layout columns (legacy numeric fallback)
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs (e.g., "col", "col-sm-3 col-md-4", or "xs-12 sm-6 md-4") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // State
  @State() inputValue = '';
  @State() filteredOptions: string[] = [];
  @State() selectedItems: string[] = [];
  @State() focusedOptionIndex = -1;
  @State() isFocused = false;
  @State() hasBeenInteractedWith = false;
  @State() dropdownOpen = false;

  // track which sub-control is virtually focused in the list
  @State() focusedPart: 'option' | 'delete' = 'option';

  // prevent blur-then-close when clicking inside dropdown
  private suppressBlur = false;
  private closeTimer: number | null = null;

  // track user-added options (predefined options cannot be deleted)
  private userAddedOptions: Set<string> = new Set();

  // Events (props-down, events-up)
  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange: EventEmitter<string[]>;
  /** 🔔 Hook for hosts to mirror/persist options */
  @Event({ eventName: 'optionsChange' })
  optionsChange!: EventEmitter<{
    options: string[];
    reason: 'add' | 'delete' | 'replace';
    value?: string; // the added/removed item, if applicable
  }>;
  // emit when a user-added option is deleted
  @Event({ eventName: 'optionDelete' }) optionDelete: EventEmitter<string>;

  // ---------------- Lifecycle / watchers ----------------

  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'AutocompleteMultiselect', `'options' should be an array`, { receivedType: typeof newVal });
      return;
    }
    // Anything provided via props is considered predefined (not tracked as user-added).
    this.filterOptions();
  }

  // Internal computed flag (don’t mutate the @Prop)
  private _preserveInputOnSelect = false;

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

  private showAsRequired(): boolean {
    return this.required && !this.isSatisfiedNow();
  }

  /** Case-insensitive exact-equality check. */
  private hasOptionCi(value: string): boolean {
    const t = value.trim().toLowerCase();
    return (this.options || []).some(o => o.trim().toLowerCase() === t);
  }

  /** Insert value into options (no-dup, optional sort). Respects editable=false. */
  private upsertOption(raw: string): void {
    const value = raw.trim();
    if (!value) return;
    if (!this.editable) {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Refused upsert: editable=false', { value });
      return;
    }
    if (!Array.isArray(this.options)) this.options = [];
    if (this.hasOptionCi(value)) return;

    const next = [...this.options, value];
    this.options = this.autoSort ? next.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })) : next;

    this.userAddedOptions.add(value);

    // 🔔 notify host (hook)
    this.optionsChange.emit({ options: [...this.options], reason: 'add', value });

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Inserted new option', { value, autoSort: this.autoSort });
  }

  /** Remove a user-added option (and unselect if selected). */
  private deleteUserOption(option: string) {
    if (!this.editable) return;
    if (!this.userAddedOptions.has(option)) {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Refused delete: not a user-added option', { option });
      return;
    }

    this.options = (this.options || []).filter(o => o !== option);

    const wasSelected = this.selectedItems.includes(option);
    if (wasSelected) {
      this.selectedItems = this.selectedItems.filter(s => s !== option);
      this.selectionChange.emit(this.selectedItems);
    }

    this.userAddedOptions.delete(option);
    this.filterOptions();

    this.optionDelete.emit(option);

    // 🔔 notify host (hook)
    this.optionsChange.emit({ options: [...this.options], reason: 'delete', value: option });

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Deleted user-added option', { option, wasSelected });
  }

  /** Parse responsive column spec into Bootstrap classes. */
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

  private labelClasses(labelColClass?: string) {
    return [
      'form-control-label',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validation ? 'invalid' : '',
      this.labelHidden ? 'sr-only' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    const sizeClass = this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '';
    return ['form-control', sizeClass].filter(Boolean).join(' ');
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

  private getAvailableOptions(): string[] {
    return (this.options || []).filter(opt => !this.selectedItems.includes(opt));
  }

  // ---------------- Handlers ----------------

  private handleFocus = () => {
    this.isFocused = true;
  };

  private handleBlur = () => {
    this.isFocused = false;
    if (this.suppressBlur) return;

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    this.closeTimer = window.setTimeout(() => {
      const ae = (document.activeElement as HTMLElement) || null;
      const stillInComponent = !!ae && this.el.contains(ae);

      if (stillInComponent) {
        // Close dropdown but DO NOT clear input
        this.filteredOptions = [];
        this.focusedOptionIndex = -1;
        this.focusedPart = 'option';
        this.dropdownOpen = false;
      } else {
        // Left the component: close, optionally clear input
        this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      }

      this.closeTimer = null;
    }, 120);

    if (this.required) this.validation = !this.isSatisfiedNow();
  };

  private handleClickOutside = (e: MouseEvent) => {
    const path = e.composedPath();
    if (!path.includes(this.el)) {
      this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      logInfo(this.devMode, 'AutocompleteMultiselect', 'Click outside - dropdown closed');
    }
  };

  // Keyboard input on the text field
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
      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        if (this.dropdownOpen && this.focusedOptionIndex >= 0) {
          const opt = this.filteredOptions[this.focusedOptionIndex];
          const canDelete = this.editable && this.userAddedOptions.has(opt);
          if (key === 'ArrowRight' && canDelete) {
            this.focusedPart = 'delete';
            event.preventDefault();
            return;
          }
          if (key === 'ArrowLeft') {
            this.focusedPart = 'option';
            event.preventDefault();
            return;
          }
        }
      }
      if (key === 'Enter') {
        event.preventDefault();

        // If virtually focused on delete, perform delete
        if (this.dropdownOpen && this.focusedOptionIndex >= 0 && this.focusedPart === 'delete') {
          const opt = this.filteredOptions[this.focusedOptionIndex];
          if (this.editable && this.userAddedOptions.has(opt)) {
            this.deleteUserOption(opt);
            return;
          }
        }

        const typedRaw = (this.inputValue || '').trim();
        const typed = typedRaw.toLowerCase();
        const hasFocusedPick = this.focusedOptionIndex >= 0 && this.filteredOptions[this.focusedOptionIndex];
        const exactMatch = this.filteredOptions.find(opt => opt.toLowerCase() === typed);

        if (hasFocusedPick) {
          this.toggleItem(this.filteredOptions[this.focusedOptionIndex]); // closes dropdown
          return;
        }
        if (exactMatch) {
          this.toggleItem(exactMatch); // closes dropdown
          return;
        }

        // Add brand-new value only if editable=true
        if (this.editable && this.addNewOnEnter && typedRaw) {
          this.upsertOption(typedRaw);
          this.toggleItem(typedRaw); // closes dropdown
          return;
        }

        logInfo(this.devMode, 'AutocompleteMultiselect', 'Enter ignored — no match and add disabled', {
          editable: this.editable,
          addNewOnEnter: this.addNewOnEnter,
        });
        return;
      }

      if (key === 'Escape') {
        this.closeDropdown({ clearInput: true });
        return;
      }
    } else {
      this.inputValue = this.sanitizeInput(input.value);
      this.filterOptions();
      this.hasBeenInteractedWith = true;
      if (this.required) this.validation = !this.isSatisfiedNow();
    }
  };

  // Buttons inside the dropdown — separate controls for option & delete

  private onOptionButtonMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
  };

  private onOptionButtonClick = (e: MouseEvent, option: string) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleItem(option);

    setTimeout(() => {
      this.suppressBlur = false;
      this.el.querySelector('input')?.focus();
    }, 0);
  };

  private onDeleteButtonMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
  };

  private onDeleteButtonClick = (e: MouseEvent, option: string) => {
    e.preventDefault();
    e.stopPropagation();
    this.deleteUserOption(option);

    setTimeout(() => {
      this.suppressBlur = false;
      this.el.querySelector('input')?.focus();
    }, 0);
  };

  private onRowMouseDown = (e: MouseEvent) => {
    // Keep focus inside if user presses in the row padding
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
    // We do NOT toggle here; the real toggle happens on the button click
  };

  // ---------------- Core Behavior ----------------

  @Method()
  public async navigateOptions(direction: number): Promise<void> {
    const newIndex = this.focusedOptionIndex + direction;
    if (!Array.isArray(this.filteredOptions)) return;

    if (newIndex >= 0 && newIndex < this.filteredOptions.length) {
      this.focusedOptionIndex = newIndex;
      this.focusedPart = 'option';
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
      this.dropdownOpen = false;
      return;
    }

    const v = this.inputValue.trim().toLowerCase();
    const available = this.getAvailableOptions();

    if (v.length === 0) {
      // No typing -> keep it closed
      this.filteredOptions = [];
      this.dropdownOpen = false;
      return;
    }

    this.filteredOptions = available.filter(opt => opt.toLowerCase().includes(v));
    this.dropdownOpen = this.filteredOptions.length > 0;
    this.focusedOptionIndex = 0;
    this.focusedPart = 'option';
  }

  /** 🔎 Read current options from the component (for hosts). */
  @Method()
  async getOptions(): Promise<string[]> {
    return [...(this.options || [])];
  }

  /** 🔧 Replace options from the host (for hosts). Also emits optionsChange('replace'). */
  @Method()
  async setOptions(next: string[]): Promise<void> {
    this.options = Array.isArray(next) ? [...next] : [];
    // optional: if you want to “forget” which ones were user-added
    this.userAddedOptions.clear();
    // re-run filter so UI reflects changes
    this.filterOptions();
    // notify host if they rely on one-way events only
    this.optionsChange.emit({ options: [...this.options], reason: 'replace' });
  }

  private toggleItem(option: string) {
    const updated = new Set(this.selectedItems);
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = Array.from(updated);
    this.selectionChange.emit(this.selectedItems);

    // clear typing so the next character doesn’t stick
    if (!this._preserveInputOnSelect) {
      this.inputValue = '';
    }

    // keep validation up-to-date
    this.validation = this.required && !this.isSatisfiedNow();

    // Close the dropdown after each pick
    this.closeDropdown({ clearInput: false });

    // keep focus in the input for quick next selection
    setTimeout(() => {
      const input = this.el.querySelector('input');
      input?.focus();
    }, 0);

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Toggled item (dropdown closed)', {
      selected: option,
      currentSelections: this.selectedItems,
    });
  }

  private closeDropdown(opts?: { clearInput?: boolean }) {
    const clear = opts?.clearInput ?? false;
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.focusedPart = 'option';
    this.dropdownOpen = false;
    if (clear) this.inputValue = '';
    logInfo(this.devMode, 'AutocompleteMultiselect', 'Dropdown closed');
  }

  private removeItem(item: string) {
    this.selectedItems = this.selectedItems.filter(i => i !== item);
    this.filterOptions();
    this.selectionChange.emit(this.selectedItems);

    if (this.required) this.validation = !this.isSatisfiedNow();
  }

  // When the add button is shown and clicked, also add to options and select
  private handleAddItem = () => {
    const value = this.inputValue.trim();
    if (!value) return;

    if (!this.editable) {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Add ignored: editable=false');
      return;
    }

    // Back-compat event
    this.itemSelect.emit(value);

    // Insert into options and select (toggleItem closes dropdown)
    this.upsertOption(value);
    this.toggleItem(value);

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Add button added new option (dropdown closed)', { value });
  };

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.dropdownOpen = false;
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
        <div class={classMap} style={this.parseInlineStyles(this.badgeInlineStyles)} key={item}>
          <span>{item}</span>
          <button onClick={() => this.removeItem(item)} aria-label={`Remove ${item}`} data-tag={item} role="button" class="remove-btn" title="Remove Tag">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9z" />
            </svg>
          </button>
        </div>
      );
    });
  }

  private renderDeleteIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9z" />
      </svg>
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
    // Show Add button only when user has typed something
    const shouldShow = this.editable && this.addBtn && this.inputValue.trim().length > 0;

    if (!shouldShow) return null;

    return (
      <button
        type="button"
        class={{
          'input-group-btn': true,
          'add': true,
          'add-btn': true,
        }}
        role="button"
        disabled={this.disabled}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          this.suppressBlur = true;
        }}
        onClick={e => {
          e.preventDefault();
          this.handleAddItem();
          setTimeout(() => {
            this.suppressBlur = false;
            this.el.querySelector('input')?.focus();
          }, 0);
        }}
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
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s-12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    );
  }

  private renderClearButton() {
    const hasInputOrSelection = this.inputValue.trim().length > 0 || this.selectedItems.length > 0;
    if (this.removeClearBtn || !hasInputOrSelection) return null;

    return (
      <button
        type="button"
        class="input-group-btn clear clear-btn"
        aria-label="Clear input"
        disabled={this.disabled}
        title="Clear input"
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          this.suppressBlur = true;
        }}
        onClick={e => {
          e.preventDefault();
          this.clearAll();
          setTimeout(() => {
            this.suppressBlur = false;
            this.el.querySelector('input')?.focus();
          }, 0);
        }}
      >
        {this.clearIcon ? <i class={this.clearIcon} /> : this.renderClearIcon()}
      </button>
    );
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
    const placeholder = this.labelHidden ? this.label || this.placeholder || 'Placeholder Text' : this.label || this.placeholder || 'Placeholder Text';

    return (
      <input
        id={ids || null}
        name={this.rawInputName || null}
        role="combobox"
        aria-label={this.labelHidden ? names : null}
        aria-labelledby={this.arialabelledBy}
        aria-describedby={this.validation ? `${ids}-validation` : this.error ? `${ids}-error` : null}
        aria-autocomplete="list"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        aria-controls={`${ids}-listbox`}
        aria-activedescendant={this.focusedOptionIndex >= 0 ? `${ids}-${this.focusedPart}-${this.focusedOptionIndex}` : undefined}
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
    return (
      <ul role="listbox" id={`${ids}-listbox`} tabindex="-1">
        {this.filteredOptions.map((option, i) => {
          const isUserAdded = this.userAddedOptions.has(option);
          const showDelete = this.editable && isUserAdded;
          return (
            <li
              id={`${ids}-row-${i}`}
              role="option"
              aria-selected={this.focusedOptionIndex === i ? 'true' : 'false'}
              class={{
                'autocomplete-dropdown-item': true,
                'focused': this.focusedOptionIndex === i,
                [`${this.size}`]: !!this.size,
                'deletable': showDelete,
              }}
              onMouseDown={this.onRowMouseDown}
              tabindex="-1"
            >
              {/* OPTION BUTTON */}
              <button
                id={`${ids}-option-${i}`}
                type="button"
                class={{
                  'option-btn': true,
                  'virtually-focused': this.focusedOptionIndex === i && this.focusedPart === 'option',
                }}
                onMouseDown={e => this.onOptionButtonMouseDown(e)}
                onClick={e => this.onOptionButtonClick(e, option)}
                aria-label={`Select ${option}`}
                tabIndex={-1}
              >
                <span innerHTML={option.replace(/</g, '&lt;').replace(/>/g, '&gt;')} />
              </button>

              {/* DELETE BUTTON (only for user-added options when editable) */}
              {showDelete ? (
                <button
                  type="button"
                  id={`${ids}-delete-${i}`}
                  class={{
                    'delete-btn': true,
                    'virtually-focused': this.focusedOptionIndex === i && this.focusedPart === 'delete',
                  }}
                  aria-label={`Delete ${option}`}
                  title={`Delete ${option}`}
                  onMouseDown={this.onDeleteButtonMouseDown}
                  onClick={e => this.onDeleteButtonClick(e, option)}
                  tabIndex={-1}
                >
                  {this.renderDeleteIcon()}
                </button>
              ) : null}
            </li>
          );
        })}
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

  private renderMessage(kind: 'validation' | 'error', ids: string) {
    const active = kind === 'validation' ? this.validation && !!this.validationMessage : this.error && !!this.errorMessage;
    if (!active) return null;

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

  /** Hidden inputs for form submission (selected items + raw typed text). */
  private renderFormFields() {
    const selected = this.name ? this.selectedItems.map(v => <input type="hidden" name={this.name!.endsWith('[]') ? this.name! : `${this.name}[]`} value={v} />) : null;

    // If rawInputName is provided, you can either:
    //  (1) put the name on the visible <input>, OR
    //  (2) emit a hidden input here.
    // We'll do (2) only if we are NOT putting name on the visible input.
    const raw = this.rawInputName ? <input type="hidden" name={this.rawInputName} value={this.inputValue} /> : null;

    return [...(selected ?? []), ...(raw ? [raw] : [])];
  }

  private renderFieldArea(ids: string, names: string) {
    return (
      <div class={this.containerClasses()}>
        <div class="ac-selected-items">{this.renderSelectedItems()}</div>
        <div class="ac-input-container">
          <div class={{ 'input-group': true, 'is-invalid': this.validation || this.error }}>
            {this.renderInputField(ids, names)}
            {this.renderAddButton()}
            {this.renderClearButton()}
          </div>

          {this.renderFormFields()}
        </div>
      </div>
    );
  }

  private renderLayout(ids: string, names: string) {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';

    // Build grid classes from new props (or numeric fallbacks)
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
              {this.isInline() ? this.renderMessage('validation', ids) : null}
              {this.isInline() ? this.renderMessage('error', ids) : null}
              {this.isHorizontal() ? this.renderMessage('validation', ids) : null}
              {this.isHorizontal() ? this.renderMessage('error', ids) : null}
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
