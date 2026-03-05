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
  @Prop() placeholder = '';
  @Prop() devMode = false;
  @Prop() disabled = false;
  @Prop() formId = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop({ mutable: true }) error = false;
  @Prop({ mutable: true }) errorMessage = '';
  @Prop() inputId = '';
  @Prop() label = '';
  @Prop() labelSize: 'base' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden = false;
  @Prop() removeClearBtn = false;
  @Prop() removeBtnBorder: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() required = false;
  @Prop() type = '';
  @Prop({ mutable: true }) validation = false;
  @Prop() validationMessage = '';
  @Prop() clearInputOnBlurOutside: boolean = false;

  // Which field name to submit selected items under. If it ends with [] we’ll emit one hidden input per item.
  @Prop() name?: string;

  // Also submit whatever the user has typed (verbatim) under this field name.
  @Prop() rawInputName?: string;

  // Optional: whether selecting items clears the input.
  @Prop() preserveInputOnSelect?: boolean;

  // Add/Sort behavior
  @Prop() addNewOnEnter: boolean = true;
  @Prop() autoSort: boolean = true;

  // Master switch — can users add/delete options at runtime?
  @Prop() editable: boolean = false;

  // ✅ NEW: Controlled selections (external source of truth; do not mutate the prop)
  @Prop() value: string[] = [];

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

  // enter state — becomes true only after ArrowDown
  @State() listEntered = false; // avoid highlight until user intentionally enters

  // Mirrors (parity with autocomplete-single)
  @State() private valueState: string[] = [];

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
  /** ✅ NEW: mirror controlled value changes (array) */
  @Event({ eventName: 'valueChange' }) valueChange!: EventEmitter<string[]>;
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

  @Watch('value')
  onValuePropChange(v: string[]) {
    const next = this.sanitizeSelectionList(v);
    this.valueState = next;
    this.selectedItems = next;

    // keep validation consistent
    if (this.required) this.validation = !this.isSatisfiedNow();

    // close dropdown on programmatic changes
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.focusedPart = 'option';
    this.dropdownOpen = false;
    this.listEntered = false;
  }

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

  connectedCallback() {
    // seed from controlled value prop
    this.valueState = this.sanitizeSelectionList(this.value);
    this.selectedItems = [...this.valueState];
  }

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside);
    this.hasBeenInteractedWith = false;
    this._preserveInputOnSelect = !!this.preserveInputOnSelect;
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultiselect', `Expected 'options' to be an array, got ${typeof this.options}`);
    }
    if (!this.label) {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Missing label prop; accessibility may be impacted');
    }

    // seed from controlled value prop (covers SSR / early set)
    this.valueState = this.sanitizeSelectionList(this.value);
    this.selectedItems = [...this.valueState];
    this._preserveInputOnSelect = !!this.preserveInputOnSelect;
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  // ---------------- Utilities ----------------

  private camelCase(str: string): string {
    return (str || '').replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/[\s-]+/g, '');
  }

  /** Sanitize user-typed input: strip tags, remove control chars, collapse whitespace, cap length. */
  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    let v = value.replace(/<[^>]*>/g, '');
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    v = v.replace(/\s+/g, ' ').trim();
    const MAX_LEN = 512;
    if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);
    return v;
  }

  /** ✅ NEW: sanitize + de-dupe selection list (case-insensitive), preserve first occurrence */
  private sanitizeSelectionList(raw: any): string[] {
    const arr = Array.isArray(raw) ? raw : [];
    const out: string[] = [];
    const seen = new Set<string>();

    for (const item of arr) {
      const cleaned = this.sanitizeInput(String(item ?? '')).trim();
      if (!cleaned) continue;
      const key = cleaned.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(cleaned);
    }

    return out;
  }

  private emitSelections(next: string[]) {
    const snapshot = [...next];
    this.valueState = snapshot;

    this.selectionChange.emit(snapshot);
    this.valueChange.emit(snapshot);

    this.el.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: snapshot },
      }),
    );
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
    const t = (value || '').trim().toLowerCase();
    return (this.options || []).some(o => (o || '').trim().toLowerCase() === t);
  }

  /** Insert value into options (no-dup, optional sort). Respects editable=false. */
  private upsertOption(raw: string): void {
    const cleaned = this.sanitizeInput(raw);
    const value = cleaned.trim();
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
      this.emitSelections(this.selectedItems);
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
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.labelHidden ? 'sr-only' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    return ['form-control', this.validation || this.error ? 'is-invalid' : ''].filter(Boolean).join(' ');
  }

  private groupClasses() {
    const sizeClass = this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
    return ['input-group', this.validation ? 'is-invalid' : '', this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '', sizeClass]
      .filter(Boolean)
      .join(' ');
  }

  private containerClasses() {
    return ['ac-multi-select-container', this.disabled ? 'disabled' : '', this.validation ? 'is-invalid' : '', this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '']
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
        this.openDropdownIfPossible();
        if (!this.listEntered) {
          if (this.filteredOptions.length > 0) {
            this.focusedOptionIndex = 0;
            this.focusedPart = 'option';
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

        if (this.listEntered && this.dropdownOpen && this.focusedOptionIndex >= 0 && this.focusedPart === 'delete') {
          const opt = this.filteredOptions[this.focusedOptionIndex];
          if (this.editable && this.userAddedOptions.has(opt)) {
            this.deleteUserOption(opt);
            return;
          }
        }

        const typedRaw = (this.inputValue || '').trim();
        const typed = typedRaw.toLowerCase();
        const hasFocusedPick = this.listEntered && this.focusedOptionIndex >= 0 && this.filteredOptions[this.focusedOptionIndex];
        const exactMatch = this.filteredOptions.find(opt => (opt || '').toLowerCase() === typed);

        if (hasFocusedPick) {
          this.toggleItem(this.filteredOptions[this.focusedOptionIndex]);
          return;
        }
        if (exactMatch) {
          this.toggleItem(exactMatch);
          return;
        }

        if (this.editable && this.addNewOnEnter && typedRaw) {
          this.upsertOption(typedRaw);
          this.toggleItem(typedRaw);
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
      this.listEntered = false;
      if (this.required) this.validation = !this.isSatisfiedNow();
    }
  };

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
    e.preventDefault();
    e.stopPropagation();
    this.suppressBlur = true;
  };

  // ---------------- Core Behavior ----------------

  private openDropdownIfPossible() {
    if (!this.dropdownOpen && this.filteredOptions.length > 0) {
      this.dropdownOpen = true;
    }
  }

  private ensureOptionInView(index: number) {
    const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
    if (items && index >= 0 && index < items.length) {
      (items[index] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  private setFocusIndex(index: number) {
    if (!Array.isArray(this.filteredOptions) || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    const clamped = Math.max(0, Math.min(len - 1, index));
    this.focusedOptionIndex = clamped;
    this.focusedPart = 'option';
    requestAnimationFrame(() => this.ensureOptionInView(clamped));
  }

  private getPageSize(): number {
    const dropdown = this.el.querySelector('.autocomplete-dropdown');
    const item = this.el.querySelector('.autocomplete-dropdown-item') as HTMLElement | null;
    const visible = dropdown instanceof HTMLElement && item ? Math.floor(dropdown.clientHeight / Math.max(1, item.clientHeight)) : 0;
    return visible > 0 ? visible : 5;
  }

  private pageNavigate(direction: 1 | -1) {
    if (!Array.isArray(this.filteredOptions) || this.filteredOptions.length === 0 || !this.dropdownOpen) return;

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

  @Method()
  public async filterOptions(): Promise<void> {
    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultiselect', `'options' must be an array`, { receivedType: typeof this.options, value: this.options });
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
      this.listEntered = false;
      return;
    }

    const v = this.inputValue.trim().toLowerCase();

    if (v.length === 0) {
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
      this.listEntered = false;
      return;
    }

    const available = this.getAvailableOptions();
    const nextFiltered = available.filter(opt => (opt || '').toLowerCase().includes(v));

    this.filteredOptions = nextFiltered;
    this.dropdownOpen = nextFiltered.length > 0;

    if (!this.dropdownOpen) {
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
      this.listEntered = false;
      return;
    }

    if (this.focusedOptionIndex >= nextFiltered.length) {
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
      this.listEntered = false;
    } else {
      this.listEntered = false;
      this.focusedPart = 'option';
    }
  }

  /** Keep suggestions in sync after selection/removal. keepOpen=false forces it closed. */
  private recomputeSuggestionsAfterChange(keepOpen: boolean) {
    const v = this.inputValue.trim().toLowerCase();
    const pool = this.getAvailableOptions();
    const next = v.length > 0 ? pool.filter(opt => (opt || '').toLowerCase().includes(v)) : pool;

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

  /** 🔎 Read current options from the component (for hosts). */
  @Method()
  async getOptions(): Promise<string[]> {
    return [...(this.options || [])];
  }

  /** 🔧 Replace options from the host (for hosts). Also emits optionsChange('replace'). */
  @Method()
  async setOptions(next: string[]): Promise<void> {
    this.options = Array.isArray(next) ? [...next] : [];
    this.userAddedOptions.clear();
    this.filterOptions();
    this.optionsChange.emit({ options: [...this.options], reason: 'replace' });
  }

  private toggleItem(rawOption: string) {
    const option = this.sanitizeInput(rawOption).trim();
    if (!option) return;

    const updated = new Set(this.selectedItems.map(s => this.sanitizeInput(s).trim()));
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = this.sanitizeSelectionList(Array.from(updated));
    this.emitSelections(this.selectedItems);

    if (!this._preserveInputOnSelect) {
      this.inputValue = '';
    }

    this.validation = this.required && !this.isSatisfiedNow();

    this.closeDropdown({ clearInput: false });

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
    this.listEntered = false;
    if (clear) this.inputValue = '';
    logInfo(this.devMode, 'AutocompleteMultiselect', 'Dropdown closed');
  }

  // Remove ONE badge by index (supports duplicates) — and DO NOT open the dropdown
  private removeItemAt(index: number) {
    if (index < 0 || index >= this.selectedItems.length) return;
    const removed = this.selectedItems[index];
    this.selectedItems = [...this.selectedItems.slice(0, index), ...this.selectedItems.slice(index + 1)];
    this.selectedItems = this.sanitizeSelectionList(this.selectedItems);
    this.emitSelections(this.selectedItems);

    this.recomputeSuggestionsAfterChange(false);

    if (this.required) this.validation = !this.isSatisfiedNow();

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Removed single badge', { removed, index });
  }

  /** Back-compat: remove first match of a value (callable by hosts) */
  @Method()
  async removeItem(value: string): Promise<void> {
    const idx = this.selectedItems.indexOf(value);
    if (idx !== -1) this.removeItemAt(idx);
  }

  private handleAddItem = () => {
    const value = this.inputValue.trim();
    if (!value) return;

    if (!this.editable) {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Add ignored: editable=false');
      return;
    }

    this.itemSelect.emit(value);

    this.upsertOption(value);
    this.toggleItem(value);

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Add button added new option (dropdown closed)', { value });
  };

  private clearAll = () => {
    this.selectedItems = [];
    this.valueState = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.dropdownOpen = false;

    this.emitSelections([]);
    this.hasBeenInteractedWith = true;
    this.listEntered = false;

    if (this.required && this.hasBeenInteractedWith) this.validation = !this.isSatisfiedNow();

    this.clear.emit();
    logInfo(this.devMode, 'AutocompleteMultiselect', 'Input cleared');
  };

  // ---------------- Render helpers ----------------

  private parseInlineStyles(styles: string): { [k: string]: string } | undefined {
    if (!styles || typeof styles !== 'string') return undefined;
    return styles.split(';').reduce(
      (acc, rule) => {
        const [key, value] = rule.split(':').map(s => s.trim());
        if (key && value) acc[key.replace(/-([a-z])/g, g => g[1].toUpperCase())] = value;
        return acc;
      },
      {} as { [k: string]: string },
    );
  }

  private renderSelectedItems() {
    return this.selectedItems.map((item, index) => {
      const classMap: { [k: string]: boolean } = {
        badge: true,
        [`text-bg-${this.badgeVariant}`]: !!this.badgeVariant,
        [this.badgeShape]: !!this.badgeShape,
        [this.size]: !!this.size,
      };

      return (
        <div class={classMap} style={this.parseInlineStyles(this.badgeInlineStyles)} key={`${item}-${index}`}>
          <span>{item}</span>

          {!this.disabled ? (
            <button type="button" onClick={() => this.removeItemAt(index)} aria-label={`Remove ${item}`} data-tag={item} role="button" class="remove-btn" title="Remove Tag">
              <i class="fa-solid fa-xmark" />
            </button>
          ) : null}
        </div>
      );
    });
  }

  private renderDeleteIcon() {
    return <i class="fa-solid fa-circle-xmark" />;
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

  private renderClearButton() {
    const hasInputOrSelection = this.inputValue.trim().length > 0 || this.selectedItems.length > 0;
    if (this.removeClearBtn || this.disabled || !hasInputOrSelection) return null;

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
        <i class={this.clearIcon || 'fa-solid fa-xmark'} />
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
    const placeholder = (this.placeholder && this.placeholder.trim().length > 0 ? this.placeholder : this.label) || 'Placeholder Text';

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
        aria-activedescendant={this.listEntered && this.focusedOptionIndex >= 0 ? `${ids}-${this.focusedPart}-${this.focusedOptionIndex}` : undefined}
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

  private renderMessage(kind: 'validation' | 'error', ids: string) {
    const active = kind === 'validation' ? this.validation && !!this.validationMessage : this.error && !!this.errorMessage;
    if (!active) return null;

    const message = kind === 'validation' ? this.validationMessage : this.errorMessage;
    const baseId = kind === 'validation' ? `${ids}-validation` : `${ids}-error`;
    const baseClass = kind === 'validation' ? 'invalid-feedback' : 'error-message';

    return (
      <div id={baseId} class={baseClass} aria-live="polite">
        {message}
      </div>
    );
  }

  /** Hidden inputs for form submission (selected items + raw typed text). */
  private renderFormFields() {
    const selected = this.name ? this.selectedItems.map(v => <input type="hidden" name={this.name!.endsWith('[]') ? this.name! : `${this.name}[]`} value={v} />) : null;

    const raw = this.rawInputName ? <input type="hidden" name={this.rawInputName} value={this.inputValue} /> : null;

    return [...(selected ?? []), ...(raw ? [raw] : [])];
  }

  private renderFieldArea(ids: string, names: string) {
    return (
      <div class={this.containerClasses()}>
        <div class="ac-selected-items">{this.renderSelectedItems()}</div>
        <div class="ac-input-container-multi">
          <div class={this.groupClasses()}>
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

  public validate(): boolean {
    this.validation = this.required && !this.isSatisfiedNow();
    return !this.validation;
  }

  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');

    return <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(ids, names)}</div>;
  }
}
