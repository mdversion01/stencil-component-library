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

  /** Field name for selected items; if it ends with [] one input per item is emitted. */
  @Prop() name?: string;
  /** Also submit whatever the user typed under this name (verbatim). */
  @Prop() rawInputName?: string;

  /** Keep the typed text after a selection? Default false (clear). */
  @Prop() preserveInputOnSelect?: boolean;

  // Add/Sort
  @Prop() addNewOnEnter: boolean = true;
  @Prop() autoSort: boolean = true;

  /** Can users add/delete options at runtime? */
  @Prop() editable: boolean = false;

  // Badge props
  @Prop() badgeVariant: string = '';
  @Prop() badgeShape: string = '';
  @Prop() badgeInlineStyles: string = '';

  // Legacy numeric cols
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
  /** Entered the list (via ArrowDown)? If false, no highlight/aria-activedescendant. */
  @State() listEntered: boolean = false;

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
    this.filterOptions();
  }

  // Lifecycle
  componentWillLoad() {
    this.hasBeenInteractedWith = false;
    if (!Array.isArray(this.options)) logError(this.devMode, 'AutocompleteMultipleSelections', `Expected 'options' to be an array, got ${typeof this.options}`);
    if (!this.label) logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Missing label prop; accessibility may be impacted');
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

  /** Sanitize user-typed input: strip tags, remove control chars, collapse whitespace, cap length. */
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

  private getActiveQuery(): string {
    return (this.inputValue || '').trim().toLowerCase();
  }
  private hasOptionCi(value: string): boolean {
    const t = (value || '').trim().toLowerCase();
    return (this.options || []).some(o => (o || '').trim().toLowerCase() === t);
  }

  private upsertOption(raw: string): void {
    const cleaned = this.sanitizeInput(raw);
    const value = cleaned.trim();
    if (!value) return;
    if (!this.editable) {
      logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Refused upsert: editable=false', { value });
      return;
    }
    if (!Array.isArray(this.options)) this.options = [];
    if (this.hasOptionCi(value)) return;
    const next = [...this.options, value];
    this.options = this.autoSort ? next.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })) : next;
    this.userAddedOptions.add(value);
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Inserted new option', { value, autoSort: this.autoSort });
  }

  private deleteUserOption(option: string) {
    if (!this.editable) return;
    if (!this.userAddedOptions.has(option)) {
      logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Refused delete: not a user-added option', { option });
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
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Deleted user-added option', { option, wasSelected });
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
      if (this.devMode) console.warn('[autocomplete-multiple-selections] Unknown cols token:', t);
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

  private getComputedCols() {
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;
    if (this.isHorizontal() && this.labelHidden) return { label: 0, input: 12 };
    const lbl = Number(this.labelCol);
    const inp = Number(this.inputCol);
    const label = Number.isFinite(lbl) ? Math.max(0, Math.min(12, lbl)) : DEFAULT_LABEL;
    const input = Number.isFinite(inp) ? Math.max(0, Math.min(12, inp)) : DEFAULT_INPUT;
    if (this.isHorizontal() && !this.labelCols && !this.inputCols && label + input !== 12) {
      console.error('[autocomplete-multiple-selections] For formLayout="horizontal", labelCol + inputCol must equal 12. Falling back to 2/10.');
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }
    return { label, input };
  }

  // ---------- Focus / Blur ----------
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
        this.filteredOptions = [];
        this.focusedOptionIndex = -1;
        this.focusedPart = 'option';
        this.dropdownOpen = false;
        this.listEntered = false;
      } else {
        this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      }
      this.closeTimer = null;
    }, 120);
    if (this.required) this.validation = !this.isSatisfiedNow();
  };

  // ---------- Keyboard nav & helpers ----------
  private ensureOptionInView(index: number) {
    requestAnimationFrame(() => {
      const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
      if (items && index >= 0 && index < items.length) (items[index] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  private getPageSize(): number {
    const dropdown = this.el.querySelector('.autocomplete-dropdown') as HTMLElement | null;
    const item = this.el.querySelector('.autocomplete-dropdown-item') as HTMLElement | null;
    const visible = dropdown && item ? Math.floor(dropdown.clientHeight / Math.max(1, item.clientHeight)) : 0;
    return visible > 0 ? visible : 5;
  }

  private setFocusIndex(index: number) {
    if (!Array.isArray(this.filteredOptions) || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    const clamped = Math.max(0, Math.min(len - 1, index));
    this.focusedOptionIndex = clamped;
    this.focusedPart = 'option';
    this.ensureOptionInView(clamped);
  }

  private pageNavigate(direction: 1 | -1) {
    if (!this.dropdownOpen || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    const page = this.getPageSize();
    let idx = this.focusedOptionIndex < 0 ? (direction > 0 ? 0 : len - 1) : this.focusedOptionIndex;
    const delta = direction > 0 ? page : -page;
    idx = (((idx + delta) % len) + len) % len;
    this.setFocusIndex(idx);
  }

  @Method()
  public async navigateOptions(direction: number): Promise<void> {
    if (!Array.isArray(this.filteredOptions) || this.filteredOptions.length === 0 || !this.dropdownOpen) return;
    const len = this.filteredOptions.length;
    let newIndex = this.focusedOptionIndex;
    newIndex = newIndex < 0 ? (direction > 0 ? 0 : len - 1) : (newIndex + direction + len) % len;
    this.setFocusIndex(newIndex);
  }

  // ---------- Filtering ----------
  public filterOptions() {
    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultipleSelections', `'options' must be an array`, { receivedType: typeof this.options, value: this.options });
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      this.listEntered = false;
      return;
    }

    const q = this.getActiveQuery();
    const pool = this.getAvailableOptions();

    if (q.length === 0) {
      // Default behavior when typing (not during selection): keep closed on empty query
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      this.listEntered = false;
      return;
    }

    const next = pool.filter(opt => (opt || '').toLowerCase().includes(q));
    const opening = !this.dropdownOpen && next.length > 0;

    this.filteredOptions = next;
    this.dropdownOpen = next.length > 0;

    if (!this.dropdownOpen) {
      this.focusedOptionIndex = -1;
      this.listEntered = false;
      return;
    }

    if (opening) {
      this.focusedOptionIndex = -1; // no focus until ArrowDown
      this.listEntered = false;
    } else if (this.focusedOptionIndex >= next.length) {
      this.focusedOptionIndex = -1;
      this.listEntered = false;
    }
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
        if (!this.dropdownOpen && this.filteredOptions.length > 0) this.dropdownOpen = true;
        if (!this.listEntered) {
          if (this.filteredOptions.length > 0) {
            this.focusedOptionIndex = 0;
            this.listEntered = true;
            this.ensureOptionInView(0);
          }
          return;
        }
        this.navigateOptions(1);
        return;
      }

      if (key === 'ArrowUp') {
        if (!this.listEntered) return;
        event.preventDefault();
        this.navigateOptions(-1);
        return;
      }

      if (key === 'Home') {
        if (!this.listEntered) return;
        event.preventDefault();
        if (this.filteredOptions.length > 0) this.setFocusIndex(0);
        return;
      }

      if (key === 'End') {
        if (!this.listEntered) return;
        event.preventDefault();
        const len = this.filteredOptions.length;
        if (len > 0) this.setFocusIndex(len - 1);
        return;
      }

      if (key === 'PageDown') {
        if (!this.listEntered) return;
        event.preventDefault();
        this.pageNavigate(1);
        return;
      }

      if (key === 'PageUp') {
        if (!this.listEntered) return;
        event.preventDefault();
        this.pageNavigate(-1);
        return;
      }

      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        if (!this.listEntered) return;
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

        // Delete button action
        if (this.listEntered && this.dropdownOpen && this.focusedOptionIndex >= 0 && this.focusedPart === 'delete') {
          const opt = this.filteredOptions[this.focusedOptionIndex];
          if (this.editable && this.userAddedOptions.has(opt)) {
            this.deleteUserOption(opt);
          }
          return;
        }

        const typedRaw = (this.inputValue || '').trim();

        // Focused pick has priority
        const hasFocusedPick = this.listEntered && this.dropdownOpen && this.focusedOptionIndex >= 0 && !!this.filteredOptions[this.focusedOptionIndex];
        if (hasFocusedPick) {
          this.toggleItem(this.filteredOptions[this.focusedOptionIndex], { keepDropdownOpen: true });
          return;
        }

        // Exact match from available pool
        const typed = typedRaw.toLowerCase();
        const pool = this.getAvailableOptions();
        const exactMatch = pool.find(opt => (opt || '').toLowerCase() === typed);
        if (exactMatch) {
          this.toggleItem(exactMatch, { keepDropdownOpen: true });
          return;
        }

        // Add new/ephemeral (sanitize in upsert)
        if (typedRaw) {
          if (this.editable && this.addNewOnEnter) {
            this.upsertOption(typedRaw);
            this.toggleItem(this.sanitizeInput(typedRaw), { keepDropdownOpen: true });
          } else {
            this.toggleItem(this.sanitizeInput(typedRaw), { keepDropdownOpen: true });
          }
          return;
        }

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
      // Typing path — sanitize every keystroke
      this.inputValue = this.sanitizeInput(input.value);
      this.filterOptions();
      this.hasBeenInteractedWith = true;
      this.listEntered = false; // typing resets virtual focus
      if (this.required) this.validation = !this.isSatisfiedNow();
    }
  };

  // NEW: clicking the input should close the dropdown (without losing focus)
  private onInputMouseDown = () => {
    if (this.dropdownOpen) {
      this.closeDropdown({ clearInput: false });
    }
  };

  // ---------- Click outside ----------
  private handleClickOutside = (e: MouseEvent) => {
    const path = (e.composedPath && e.composedPath()) || [];
    if (!path.includes(this.el)) {
      this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Click outside - dropdown closed');
    }
  };

  // ---------- Selection toggling ----------
  private recomputeSuggestionsAfterSelection(keepOpen: boolean = true) {
    const q = this.getActiveQuery();
    const pool = this.getAvailableOptions();
    const next = q.length > 0 ? pool.filter(opt => (opt || '').toLowerCase().includes(q)) : pool;

    this.filteredOptions = next;

    if (keepOpen) {
      this.dropdownOpen = next.length > 0;
    } else {
      this.dropdownOpen = false;
      this.listEntered = false;
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
    }
  }

  private toggleItem(option: string, opts?: { keepDropdownOpen?: boolean }) {
    const updated = new Set(this.selectedItems);
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = Array.from(updated);
    this.selectionChange.emit(this.selectedItems);

    // honor preserveInputOnSelect; default is to clear
    if (!this.preserveInputOnSelect) this.inputValue = '';

    // keep validation up-to-date
    this.validation = this.required && !this.isSatisfiedNow();

    if (opts?.keepDropdownOpen) {
      this.recomputeSuggestionsAfterSelection(true);

      if (this.dropdownOpen) {
        const len = this.filteredOptions.length;
        if (len === 0) {
          this.focusedOptionIndex = -1;
          this.listEntered = false;
        } else {
          const nextIndex = Math.min(this.focusedOptionIndex, len - 1);
          this.focusedOptionIndex = nextIndex;
          this.listEntered = true;
          this.ensureOptionInView(nextIndex);
        }
      } else {
        this.listEntered = false;
        this.focusedOptionIndex = -1;
      }
    } else {
      this.closeDropdown({ clearInput: false });
    }

    // keep focus in the input for quick next selection
    setTimeout(() => {
      this.el.querySelector('input')?.focus();
    }, 0);

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Toggled item', {
      selected: option,
      currentSelections: this.selectedItems,
      dropdownOpen: this.dropdownOpen,
    });
  }

  // FIX: remove a single badge by index (supports duplicates) — and do NOT open the dropdown
  private removeItemAt(index: number) {
    if (index < 0 || index >= this.selectedItems.length) return;
    const removed = this.selectedItems[index];
    this.selectedItems = [...this.selectedItems.slice(0, index), ...this.selectedItems.slice(index + 1)];
    this.selectionChange.emit(this.selectedItems);

    // Keep suggestions in sync, but force dropdown to remain closed
    this.recomputeSuggestionsAfterSelection(false);

    if (this.selectedItems.length === 0 && this.required) {
      this.validation = this.required && !this.isSatisfiedNow();
    }

    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Removed single badge', { removed, index });
  }

  // ---------- Add / Clear ----------
  private handleAddItem = () => {
    const value = this.sanitizeInput(this.inputValue || '').trim();
    if (!value) return;
    if (!this.editable) {
      logWarn(this.devMode, 'AutocompleteMultipleSelections', 'Add ignored: editable=false');
      return;
    }
    this.itemSelect.emit(value);
    if (!this.hasOptionCi(value)) this.upsertOption(value);
    this.toggleItem(value, { keepDropdownOpen: true });
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Add item clicked', { value });
  };

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.dropdownOpen = false;
    this.selectionChange.emit([]);
    this.hasBeenInteractedWith = true;
    this.listEntered = false;
    if (this.required && this.hasBeenInteractedWith) this.validation = this.required && !this.isSatisfiedNow();
    this.clear.emit();
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Input cleared');
  };

  // ---------- Dropdown UI ----------
  private renderDeleteIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s-9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9z" />
      </svg>
    );
  }

  private onRowMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
  };
  private onOptionButtonMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
  };

  private onOptionButtonClick = (e: MouseEvent, option: string) => {
    e.preventDefault();
    e.stopPropagation();
    this.toggleItem(option, { keepDropdownOpen: true });
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
              aria-selected={this.listEntered && this.focusedOptionIndex === i ? 'true' : 'false'}
              class={{
                'autocomplete-dropdown-item': true,
                'focused': this.listEntered && this.focusedOptionIndex === i,
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
                  'virtually-focused': this.listEntered && this.focusedOptionIndex === i && this.focusedPart === 'option',
                }}
                onMouseDown={e => this.onOptionButtonMouseDown(e)}
                onClick={e => this.onOptionButtonClick(e, option)}
                aria-label={`Select ${option}`}
                tabIndex={-1}
              >
                {/* SAFE: render as text node; no innerHTML */}
                <span>{option}</span>
              </button>

              {showDelete ? (
                <button
                  type="button"
                  id={`${ids}-delete-${i}`}
                  class={{
                    'delete-btn': true,
                    'virtually-focused': this.listEntered && this.focusedOptionIndex === i && this.focusedPart === 'delete',
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
    this.listEntered = false;
    if (clear) this.inputValue = '';
    logInfo(this.devMode, 'AutocompleteMultipleSelections', 'Dropdown closed');
  }

  // ---------- UI bits ----------
  private parseInlineStyles(styles: string): { [key: string]: string } | undefined {
    if (!styles || typeof styles !== 'string') return undefined;
    return styles.split(';').reduce((acc, rule) => {
      const [key, value] = rule.split(':').map(s => s.trim());
      if (key && value) acc[key.replace(/-([a-z])/g, g => g[1].toUpperCase())] = value;
      return acc;
    }, {} as { [key: string]: string });
  }

  private renderSelectedItems() {
    return this.selectedItems.map((item, index) => {
      const classMap: { [key: string]: boolean } = { badge: true };
      if (this.badgeVariant) classMap[`text-bg-${this.badgeVariant}`] = true;
      if (this.badgeShape) classMap[this.badgeShape] = true;
      if (this.size) classMap[this.size] = true;

      return (
        <div class={classMap} style={this.parseInlineStyles(this.badgeInlineStyles)} key={`${item}-${index}`}>
          <span>{item}</span>
          <button type="button" onClick={() => this.removeItemAt(index)} aria-label={`Remove ${item}`} data-tag={item} role="button" class="remove-btn" title="Remove Tag">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s-9.4 24.6 0 33.9l-47 47 47 47c-9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9z" />
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
    const sizeClass = this.size === 'sm' ? 'form-control-sm' : this.size === 'lg' ? 'form-control-lg' : '';
    const classes = ['form-control', this.validation || this.error ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
    const placeholder = this.labelHidden ? this.label || this.placeholder || 'Placeholder Text' : this.label || this.placeholder || 'Placeholder Text';

    return (
      <input
        id={ids || null}
        name={null}
        role="combobox"
        aria-label={this.labelHidden ? names : null}
        aria-labelledby={this.arialabelledBy}
        aria-describedby={this.validation ? `${ids}-validation` : this.error ? `${ids}-error` : null}
        aria-autocomplete="list"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        aria-controls={`${ids}-listbox`}
        aria-activedescendant={this.listEntered && this.focusedOptionIndex >= 0 ? `${ids}-${this.focusedPart}-${this.focusedOptionIndex}` : undefined}
        aria-required={this.required ? 'true' : 'false'}
        aria-haspopup="listbox"
        class={classes}
        type={this.type}
        placeholder={placeholder}
        value={this.inputValue}
        disabled={this.disabled}
        onInput={this.handleInput}
        onKeyDown={this.handleInput}
        onMouseDown={this.onInputMouseDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        inputmode="text"
        autocomplete="off"
        spellcheck="false"
      />
    );
  }

  private renderAddIcon() {
    return <i class={this.addIcon || 'fas fa-plus'} />;
  }

  private renderAddButton() {
    const shouldShow = this.editable && this.addBtn && this.inputValue.trim().length > 0;
    if (!shouldShow) return null;
    return (
      <button
        type="button"
        class={{ 'add-btn': true, 'no-border': this.removeBtnBorder }}
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
    return <i class={this.clearIcon || 'fas fa-times'} />;
  }

  private renderClearButton() {
    const hasInputOrSelection = this.inputValue.trim().length > 0 || this.selectedItems.length > 0;
    if (this.removeClearBtn || !hasInputOrSelection) return null;
    return (
      <button
        type="button"
        class="clear-btn"
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

  // Hidden inputs for forms
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
    return <div class="autocomplete-container form-group">{this.renderLayout(ids, names)}</div>;
  }
}
