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
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() removeClearBtn: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() removeBtnBorder: boolean = false;
  @Prop() required: boolean = false;
  @Prop() type = '';
  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';
  @Prop() clearInputOnBlurOutside: boolean = false;

  // New: optional hidden-input support for forms
  /** Field name for selected items; if it ends with [] one input per item is emitted. */
  @Prop() name?: string;
  /** Also submit whatever the user typed under this name (verbatim). */
  @Prop() rawInputName?: string;

  // New: optional preserve/clear input-on-select (we keep current behavior: clear)
  @Prop() preserveInputOnSelect?: boolean;

  // Allow adding new values + sorting
  @Prop() addNewOnEnter: boolean = true;
  @Prop() autoSort: boolean = true;

  // Master switch: can users add/delete options at runtime?
  @Prop() editable: boolean = false;

  // Badge Props
  @Prop() badgeVariant: string = '';
  @Prop() badgeShape: string = '';
  @Prop() badgeInlineStyles: string = '';

  // Legacy numeric cols (fallback)
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive columns (e.g., "col", "col-sm-3 col-md-4", "xs-12 sm-6 md-4") */
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
  @State() focusedPart: 'option' | 'delete' = 'option';

  /** prevent blur -> close when clicking inside dropdown */
  private suppressBlur = false;
  private closeTimer: number | null = null;

  // Track user-added options
  private userAddedOptions: Set<string> = new Set();

  // Events
  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange: EventEmitter<string[]>;
  @Event({ eventName: 'optionDelete' }) optionDelete: EventEmitter<string>;

  // Watchers
  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `'options' should be an array`, { receivedType: typeof newVal });
      return;
    }
    // props -> predefined; do not modify userAddedOptions
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

  private showAsRequired(): boolean {
    return this.required && !this.isSatisfiedNow();
  }

  /** Search query = entire input (commas are treated as normal characters). */
  private getActiveQuery(): string {
    return (this.inputValue || '').trim().toLowerCase();
  }

  /** Case-insensitive option existence check (exact equality). */
  private hasOptionCi(value: string): boolean {
    const t = value.trim().toLowerCase();
    return (this.options || []).some(o => o.trim().toLowerCase() === t);
  }

  /** Insert a new option if missing; optionally sort case-insensitively. */
  private upsertOption(raw: string): void {
    const value = raw.trim();
    if (!value) return;
    if (!this.editable) {
      logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Refused upsert: editable=false', { value });
      return;
    }
    if (!Array.isArray(this.options)) this.options = [];
    if (this.hasOptionCi(value)) return;

    const next = [...this.options, value];
    this.options = this.autoSort ? next.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })) : next;

    // Track as user-added
    this.userAddedOptions.add(value);
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Inserted new option', { value, autoSort: this.autoSort });
  }

  /** Remove a user-added option (and from selectedItems if present) */
  private deleteUserOption(option: string) {
    if (!this.editable) return;
    if (!this.userAddedOptions.has(option)) {
      logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Refused delete: not a user-added option', { option });
      return;
    }

    // Remove from options
    this.options = (this.options || []).filter(o => o !== option);
    // Unselect if selected
    const wasSelected = this.selectedItems.includes(option);
    if (wasSelected) {
      this.selectedItems = this.selectedItems.filter(s => s !== option);
      this.selectionChange.emit(this.selectedItems);
    }

    // Stop tracking as user-added
    this.userAddedOptions.delete(option);

    // Refilter to refresh dropdown
    this.filterOptions();

    // Emit event for hosts
    this.optionDelete.emit(option);

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Deleted user-added option', { option, wasSelected });
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

  // ---------- Focus / Blur ----------
  private handleFocus = () => {
    this.isFocused = true;
  };

  // blur
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
        this.filteredOptions = [];
        this.focusedOptionIndex = -1;
        this.dropdownOpen = false;
      } else {
        // ← was: clearInput: true
        this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      }

      this.closeTimer = null;
    }, 120);

    if (this.required) this.validation = !this.isSatisfiedNow();
  };

  // ---------- Keyboard nav ----------
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
      this.focusedPart = 'option';
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

    const q = this.getActiveQuery();
    const pool = this.getAvailableOptions();

    if (q.length === 0) {
      this.filteredOptions = [];
      this.dropdownOpen = false;
      return;
    }

    this.filteredOptions = pool.filter(opt => opt.toLowerCase().includes(q));
    this.dropdownOpen = this.filteredOptions.length > 0;
  }

  private getAvailableOptions(): string[] {
    return (this.options || []).filter(opt => !this.selectedItems.includes(opt));
  }

  // ---------- Input typing + keys ----------
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

        // If a list item is focused, selecting it ALWAYS takes priority
        const hasFocusedPick = this.dropdownOpen && this.focusedOptionIndex >= 0 && !!this.filteredOptions[this.focusedOptionIndex];
        if (hasFocusedPick) {
          this.toggleItem(this.filteredOptions[this.focusedOptionIndex]);
          return;
        }

        // Exact match (check against available options, not just filtered list)
        const typed = typedRaw.toLowerCase();
        const pool = this.getAvailableOptions();
        const exactMatch = pool.find(opt => opt.toLowerCase() === typed);
        if (exactMatch) {
          this.toggleItem(exactMatch);
          return;
        }

        // Allow ephemeral additions even when editable=false.
        // - If editable=true: upsert into options, then select
        // - If editable=false: DO NOT modify options; just add to selectedItems (ephemeral)
        if (typedRaw) {
          if (this.editable && this.addNewOnEnter) {
            this.upsertOption(typedRaw); // adds to options and marks as user-added
            this.toggleItem(typedRaw);
          } else {
            // Ephemeral selection only (exists until removed or form submitted)
            this.toggleItem(typedRaw);
          }
          return;
        }

        // Otherwise ignore
        logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Enter ignored — no match and add disabled', {
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

  // ---------- Click outside ----------
  private handleClickOutside = (e: MouseEvent) => {
    const path = (e.composedPath && e.composedPath()) || [];
    if (!path.includes(this.el)) {
      // ← was: clearInput: true
      this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Click outside - dropdown closed');
    }
  };

  // ---------- Selection toggling ----------
  private toggleItem(option: string) {
    const updated = new Set(this.selectedItems);
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = Array.from(updated);
    this.selectionChange.emit(this.selectedItems);

    // After any pick, clear the visible input (commas are just text now)
    this.inputValue = '';

    // keep validation up-to-date
    this.validation = this.required && !this.isSatisfiedNow();

    // Close the dropdown after each pick (no input clearing again)
    this.closeDropdown({ clearInput: false });

    // keep focus in the input for quick next selection
    setTimeout(() => {
      this.el.querySelector('input')?.focus();
    }, 0);

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Toggled item', {
      selected: option,
      currentSelections: this.selectedItems,
      inputValue: this.inputValue,
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
    const value = (this.inputValue || '').trim();
    if (!value) return;

    if (!this.editable) {
      // When not editable, the add button is hidden, but guard anyway.
      logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Add ignored: editable=false');
      return;
    }

    // Back-compat event (emit the raw input once)
    this.itemSelect.emit(value);

    // Upsert/select exactly one value — the entire text as typed
    if (!this.hasOptionCi(value)) this.upsertOption(value);
    this.toggleItem(value);

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Add item clicked (single full input)', { value });
  };

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.dropdownOpen = false;
    this.selectionChange.emit([]);

    this.hasBeenInteractedWith = true;
    if (this.required && this.hasBeenInteractedWith) {
      this.validation = this.required && !this.isSatisfiedNow();
    }

    this.clear.emit();
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Input cleared');
  };

  // ---------- Dropdown UI ----------
  private renderDeleteIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9z" />
      </svg>
    );
  }

  // Row padding guard (prevents blur when clicking row bg)
  private onRowMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
  };

  // Separate button handlers (option & delete)
  private onOptionButtonMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
  };

  private onOptionButtonClick = (e: MouseEvent, option: string) => {
    e.preventDefault();
    e.stopPropagation();
    // perform selection toggle
    this.toggleItem(option);

    // re-enable blur after this tick & restore input focus
    setTimeout(() => {
      this.suppressBlur = false;
      this.el.querySelector('input')?.focus();
    }, 0);
  };

  private onDeleteButtonMouseDown = (e: MouseEvent) => {
    // prevent option selection; keep focus inside
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

  // Make closeDropdown optionally clear the input
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

  private renderInputLabel(ids: string, labelColClass?: string) {
    if (this.labelHidden) return null;

    const classes = [
      'form-control-label',
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validation ? 'invalid' : '',
      this.labelHidden ? 'sr-only' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isRowLayout() ? `${this.label}:` : this.label;

    return (
      <label class={classes} htmlFor={ids || undefined}>
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : ''}
      </label>
    );
  }

  private renderInputField(ids: string, names: string) {
    const sizeClass = this.size === 'sm' ? 'basic-input-sm' : this.size === 'lg' ? 'basic-input-lg' : '';
    const classes = ['form-control', sizeClass].filter(Boolean).join(' ');
    const placeholder = this.labelHidden ? this.label || this.placeholder || 'Placeholder Text' : this.label || this.placeholder || 'Placeholder Text';

    return (
      <input
        id={ids || null}
        // NOTE: do not use the visible input's `name` for form submission; we emit hidden inputs instead
        name={null}
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
          'no-border': this.removeBtnBorder,
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
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s-12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
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
        disabled={this.disabled}
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
        aria-label="Clear input"
        title="Clear input"
      >
        {this.clearIcon ? <i class={this.clearIcon} /> : this.renderClearIcon()}
      </button>
    );
  }

  // Hidden inputs for forms (selected items + raw typed text)
  private renderFormFields() {
    const selected = this.name ? this.selectedItems.map(v => <input type="hidden" name={this.name!.endsWith('[]') ? this.name! : `${this.name}[]`} value={v} />) : null;

    const raw = this.rawInputName ? <input type="hidden" name={this.rawInputName} value={this.inputValue} /> : null;

    return [...(selected ?? []), ...(raw ? [raw] : [])];
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

    this.getComputedCols();

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
          <div class={{ 'input-group': true, 'is-invalid': this.validation || this.error }}>
            {this.renderInputField(ids, names)}
            {this.renderAddButton()}
            {this.renderClearButton()}
          </div>

          {/* Hidden form fields */}
          {this.renderFormFields()}
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
