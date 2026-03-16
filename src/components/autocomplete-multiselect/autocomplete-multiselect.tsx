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

  /**
   * @deprecated Use `ariaLabelledby` (mapped to `aria-labelledby`) instead.
   * Kept for backward compatibility.
   */
  @Prop() arialabelledBy: string = '';

  /** Standard ARIA naming hooks */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

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
  @Prop() type = 'text';
  @Prop({ mutable: true }) validation = false;
  @Prop() validationMessage = '';
  @Prop() clearInputOnBlurOutside: boolean = false;

  /** Selected items hidden inputs name; if it ends with [] one input per item is emitted. */
  @Prop() name?: string;

  /** Also submit whatever the user typed under this name (verbatim). */
  @Prop() rawInputName?: string;

  /** Keep the typed text after a selection? Default false (clear). */
  @Prop() preserveInputOnSelect?: boolean;

  // Add/Sort behavior
  @Prop() addNewOnEnter: boolean = true;
  @Prop() autoSort: boolean = true;

  /** Can users add/delete options at runtime? */
  @Prop() editable: boolean = false;

  /** Controlled selections (external source of truth; do not mutate the prop) */
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

  /** which sub-control is virtually focused in the list (only affects aria-activedescendant) */
  @State() focusedPart: 'option' | 'delete' = 'option';

  /** becomes true only after ArrowDown */
  @State() listEntered = false;

  // Mirrors
  @State() private valueState: string[] = [];

  private suppressBlur = false;
  private closeTimer: number | null = null;
  private userAddedOptions: Set<string> = new Set();

  // Internal computed flag (don’t mutate the @Prop)
  private _preserveInputOnSelect = false;

  // ---------- Unique ID protection (prevents ARIA collisions) ----------
  private static _seq = 0;
  private _baseId = '';

  // Events
  @Event({ eventName: 'itemSelect' }) itemSelect: EventEmitter<string>;
  @Event() clear: EventEmitter<void>;
  @Event() componentError: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange: EventEmitter<string[]>;
  @Event({ eventName: 'valueChange' }) valueChange!: EventEmitter<string[]>;
  @Event({ eventName: 'optionsChange' })
  optionsChange!: EventEmitter<{ options: string[]; reason: 'add' | 'delete' | 'replace'; value?: string }>;
  @Event({ eventName: 'optionDelete' }) optionDelete: EventEmitter<string>;

  // ---------------- Lifecycle / watchers ----------------

  @Watch('value')
  onValuePropChange(v: string[]) {
    const next = this.sanitizeSelectionList(v);
    this.valueState = next;
    this.selectedItems = next;

    if (this.required) this.validation = !this.isSatisfiedNow();

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
    this.filterOptions();
  }

  connectedCallback() {
    this.valueState = this.sanitizeSelectionList(this.value);
    this.selectedItems = [...this.valueState];
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'AutocompleteMultiselect', `Expected 'options' to be an array, got ${typeof this.options}`);
    }

    // Resolve stable, unique ids for this instance first
    this.resolveBaseId();

    // 508 / WCAG: form elements must have labels.
    if (!this.label && !this.ariaLabel && !this.ariaLabelledby && !this.arialabelledBy) {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Missing label/aria-label/aria-labelledby; accessibility may be impacted');
    }

    // seed from controlled value prop (covers SSR / early set)
    this.valueState = this.sanitizeSelectionList(this.value);
    this.selectedItems = [...this.valueState];
    this._preserveInputOnSelect = !!this.preserveInputOnSelect;
  }

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside);
    this._preserveInputOnSelect = !!this.preserveInputOnSelect;
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  // ---------------- IDs / ARIA helpers ----------------

  private resolveBaseId() {
    const raw = (this.inputId || this.label || '').trim();
    let base = raw ? this.camelCase(raw) : '';

    if (!base) {
      AutocompleteMultiselect._seq += 1;
      const rnd = Math.random().toString(36).slice(2, 6);
      base = `acms-${AutocompleteMultiselect._seq}-${rnd}`;
    }

    // If an element already exists with this id, suffix it (avoid collisions)
    const existing = document.getElementById(base);
    if (existing && !this.el.contains(existing)) {
      AutocompleteMultiselect._seq += 1;
      const rnd = Math.random().toString(36).slice(2, 6);
      const unique = `${base}-${AutocompleteMultiselect._seq}-${rnd}`;
      logWarn(this.devMode, 'AutocompleteMultiselect', `Resolved duplicate id "${base}". Using "${unique}".`);
      base = unique;
    }

    this._baseId = base;
  }

  private get ids(): string {
    return this._baseId;
  }
  private get labelId(): string {
    return `${this.ids}-label`;
  }
  private get listboxId(): string {
    return `${this.ids}-listbox`;
  }
  private get validationId(): string {
    return `${this.ids}-validation`;
  }
  private get errorId(): string {
    return `${this.ids}-error`;
  }

  /** Sanitize an IDREF list (space-separated). Returns only valid ID tokens. */
  private sanitizeIdRefList(v?: string | null): string | undefined {
    const raw = String(v ?? '').trim();
    if (!raw) return undefined;
    const tokens = raw.split(/\s+/).map(t => t.trim()).filter(Boolean);
    const valid = tokens.filter(t => /^[A-Za-z_][\w:\-\.]*$/.test(t));
    return valid.length ? valid.join(' ') : undefined;
  }

  /** Join multiple IDREF lists into a single de-duped, valid list. */
  private joinIdRefLists(...vals: Array<string | undefined | null>) {
    const tokens: string[] = [];
    for (const v of vals) {
      const cleaned = this.sanitizeIdRefList(v);
      if (cleaned) tokens.push(...cleaned.split(/\s+/));
    }
    const seen = new Set<string>();
    const out = tokens.filter(t => (seen.has(t) ? false : (seen.add(t), true)));
    return out.length ? out.join(' ') : undefined;
  }

  /** aria-activedescendant must reference an element that exists in the DOM. */
  private activeDescendantId(): string | undefined {
    if (!this.dropdownOpen) return undefined;
    if (!this.listEntered) return undefined;
    const i = this.focusedOptionIndex;
    if (i < 0 || i >= this.filteredOptions.length) return undefined;
    return this.focusedPart === 'delete' ? `${this.ids}-delete-${i}` : `${this.ids}-option-${i}`;
  }

  // ---------------- Utilities ----------------

  private camelCase(str: string): string {
    return (str || '')
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
      .replace(/[\s-]+/g, '');
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

  /** sanitize + de-dupe selection list (case-insensitive), preserve first occurrence */
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
      this.selectedItems = this.sanitizeSelectionList(this.selectedItems);
      this.emitSelections(this.selectedItems);
    }

    this.userAddedOptions.delete(option);
    this.filterOptions();

    this.optionDelete.emit(option);
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

  private inputClasses() {
    const sizeClass = this.size === 'sm' ? 'form-control-sm' : this.size === 'lg' ? 'form-control-lg' : '';
    return ['form-control', sizeClass, this.validation || this.error ? 'is-invalid' : ''].filter(Boolean).join(' ');
  }

  private groupClasses() {
    const sizeClass = this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
    return [
      'input-group',
      this.validation || this.error ? 'is-invalid' : '',
      this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '',
      sizeClass,
    ]
      .filter(Boolean)
      .join(' ');
  }

  private containerClasses() {
    return [
      'ac-multi-select-container',
      this.disabled ? 'disabled' : '',
      this.validation || this.error ? 'is-invalid' : '',
      this.validation && this.isFocused ? 'is-invalid-focused' : this.isFocused ? 'ac-focused' : '',
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
      if (stillInComponent) return;

      this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      this.closeTimer = null;
    }, 120);

    if (this.required) this.validation = !this.isSatisfiedNow();
  };

  private handleClickOutside = (e: MouseEvent) => {
    const path = (e.composedPath && e.composedPath()) || [];
    if (!path.includes(this.el)) {
      this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      logInfo(this.devMode, 'AutocompleteMultiselect', 'Click outside - dropdown closed');
    }
  };

  // Keyboard + input on the text field
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
          if (this.editable && this.userAddedOptions.has(opt)) this.deleteUserOption(opt);
          return;
        }

        const typedRaw = (this.inputValue || '').trim();
        const typed = typedRaw.toLowerCase();

        const hasFocusedPick =
          this.listEntered && this.dropdownOpen && this.focusedOptionIndex >= 0 && !!this.filteredOptions[this.focusedOptionIndex];
        if (hasFocusedPick) {
          this.toggleItem(this.filteredOptions[this.focusedOptionIndex]);
          return;
        }

        const pool = this.getAvailableOptions();
        const exactMatch = pool.find(opt => (opt || '').toLowerCase() === typed);
        if (exactMatch) {
          this.toggleItem(exactMatch);
          return;
        }

        if (typedRaw) {
          if (this.editable && this.addNewOnEnter) {
            this.upsertOption(typedRaw);
            this.toggleItem(this.sanitizeInput(typedRaw));
          } else {
            // select ephemerally without mutating options
            this.toggleItem(this.sanitizeInput(typedRaw));
          }
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

  private ensureOptionInView(index: number) {
    requestAnimationFrame(() => {
      const items = this.el.querySelectorAll('.autocomplete-dropdown-item');
      if (items && index >= 0 && index < items.length) (items[index] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  private setFocusIndex(index: number) {
    if (!Array.isArray(this.filteredOptions) || this.filteredOptions.length === 0) return;
    const len = this.filteredOptions.length;
    const clamped = Math.max(0, Math.min(len - 1, index));
    this.focusedOptionIndex = clamped;
    this.focusedPart = 'option';
    this.ensureOptionInView(clamped);
  }

  private getPageSize(): number {
    const dropdown = this.el.querySelector('.autocomplete-dropdown') as HTMLElement | null;
    const item = this.el.querySelector('.autocomplete-dropdown-item') as HTMLElement | null;
    const visible = dropdown && item ? Math.floor(dropdown.clientHeight / Math.max(1, item.clientHeight)) : 0;
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

  private toggleItem(rawOption: string) {
    const option = this.sanitizeInput(rawOption).trim();
    if (!option) return;

    const updated = new Set(this.selectedItems.map(s => this.sanitizeInput(s).trim()));
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = this.sanitizeSelectionList(Array.from(updated));
    this.emitSelections(this.selectedItems);

    if (!this._preserveInputOnSelect) this.inputValue = '';

    this.validation = this.required && !this.isSatisfiedNow();

    // keep behavior consistent with existing component: close after selection
    this.closeDropdown({ clearInput: false });

    setTimeout(() => this.el.querySelector('input')?.focus(), 0);

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

  private removeItemAt(index: number) {
    if (index < 0 || index >= this.selectedItems.length) return;
    const removed = this.selectedItems[index];
    this.selectedItems = [...this.selectedItems.slice(0, index), ...this.selectedItems.slice(index + 1)];
    this.selectedItems = this.sanitizeSelectionList(this.selectedItems);
    this.emitSelections(this.selectedItems);

    if (this.required) this.validation = !this.isSatisfiedNow();

    logInfo(this.devMode, 'AutocompleteMultiselect', 'Removed single badge', { removed, index });
  }

  @Method()
  async removeItem(value: string): Promise<void> {
    const idx = this.selectedItems.indexOf(value);
    if (idx !== -1) this.removeItemAt(idx);
  }

  private handleAddItem = () => {
    const value = this.sanitizeInput(this.inputValue || '').trim();
    if (!value) return;

    if (!this.editable) {
      logWarn(this.devMode, 'AutocompleteMultiselect', 'Add ignored: editable=false');
      return;
    }

    this.itemSelect.emit(value);

    if (!this.hasOptionCi(value)) this.upsertOption(value);
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

    const out: { [k: string]: string } = {};
    const rules = styles.split(';');

    for (const rule of rules) {
      const r = rule.trim();
      if (!r) continue;
      const idx = r.indexOf(':');
      if (idx === -1) continue;

      const rawKey = r.slice(0, idx).trim();
      const rawVal = r.slice(idx + 1).trim();
      if (!rawKey || !rawVal) continue;

      const key = rawKey.replace(/-([a-z])/g, (_, c) => String(c).toUpperCase());
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      out[key] = rawVal;
    }

    return out;
  }

  private renderSelectedItems() {
    return this.selectedItems.map((item, index) => {
      const classMap: { [k: string]: boolean } = { badge: true };
      if (this.badgeVariant) classMap[`text-bg-${this.badgeVariant}`] = true;
      if (this.badgeShape) classMap[this.badgeShape] = true;
      if (this.size) classMap[this.size] = true;

      return (
        <div class={classMap} style={this.parseInlineStyles(this.badgeInlineStyles)} key={`${item}-${index}`}>
          <span>{item}</span>

          {!this.disabled ? (
            <button
              type="button"
              onClick={() => this.removeItemAt(index)}
              aria-label={`Remove ${item}`}
              data-tag={item}
              class="remove-btn"
              title="Remove Tag"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      );
    });
  }

  private renderInputLabel(labelColClass?: string) {
    // 508: must have a label. Always render one; sr-only when labelHidden=true.
    const labelText = (this.label || '').trim() || 'Autocomplete';

    const classes = [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.labelHidden ? 'sr-only' : '',
      this.validation || this.error ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const text = this.isRowLayout() ? `${labelText}:` : labelText;

    // Exactly ONE label element for the input.
    return (
      <label class={classes} id={this.labelId} htmlFor={this.ids || undefined}>
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : ''}
      </label>
    );
  }

  private renderAddButton() {
    const shouldShow = this.editable && this.addBtn && this.inputValue.trim().length > 0;
    if (!shouldShow) return null;

    return (
      <button
        type="button"
        class={{ 'add-btn': true, 'no-border': this.removeBtnBorder }}
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
        <i class={this.addIcon || 'fas fa-plus'} aria-hidden="true" />
      </button>
    );
  }

  private renderClearButton() {
    const hasInputOrSelection = this.inputValue.trim().length > 0 || this.selectedItems.length > 0;
    if (this.removeClearBtn || this.disabled || !hasInputOrSelection) return null;

    return (
      <button
        type="button"
        class="clear-btn"
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
        <i class={this.clearIcon || 'fa-solid fa-xmark'} aria-hidden="true" />
      </button>
    );
  }

  private renderInputField() {
    const labelText = (this.label || '').trim();
    const placeholder = ((this.placeholder || '').trim() || labelText || 'Autocomplete');

    // external aria-labelledby wins; legacy prop also supported
    const externalLabelledby = this.sanitizeIdRefList(this.ariaLabelledby) || this.sanitizeIdRefList(this.arialabelledBy) || undefined;
    const externalLabel = (this.ariaLabel || '').trim() || undefined;

    const computedLabelledby = externalLabelledby || this.labelId;

    // aria-label only when aria-labelledby is absent (per spec)
    const computedAriaLabel = computedLabelledby ? undefined : (this.sanitizeInput(externalLabel || '') || placeholder);

    const describedby = this.joinIdRefLists(
      this.ariaDescribedby,
      this.validation && this.validationMessage ? this.validationId : undefined,
      this.error && this.errorMessage ? this.errorId : undefined,
    );

    return (
      <input
        id={this.ids || undefined}
        // do not use the input name for submission; hidden inputs carry values
        name={undefined}
        role="combobox"
        aria-label={computedAriaLabel}
        aria-labelledby={computedLabelledby}
        aria-describedby={describedby}
        aria-autocomplete="list"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        aria-controls={this.listboxId}
        aria-activedescendant={this.activeDescendantId()}
        aria-required={this.required ? 'true' : undefined}
        aria-invalid={this.validation || this.error ? 'true' : undefined}
        aria-haspopup="listbox"
        aria-disabled={this.disabled ? 'true' : undefined}
        class={this.inputClasses()}
        type={this.type || 'text'}
        placeholder={placeholder}
        value={this.inputValue}
        disabled={this.disabled}
        onInput={this.handleInput}
        onKeyDown={this.handleInput}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        inputmode="text"
        // correct usage: token (not boolean)
        autocomplete="off"
        spellcheck="false"
      />
    );
  }

  private renderDropdownList() {
    return (
      <ul role="listbox" id={this.listboxId} aria-multiselectable="true" tabIndex={-1}>
        {this.filteredOptions.map((option, i) => {
          const isUserAdded = this.userAddedOptions.has(option);
          const showDelete = this.editable && isUserAdded;

          return (
            <li
              id={`${this.ids}-row-${i}`}
              role="option"
              // aria-selected reflects selection state (not focus)
              aria-selected={this.selectedItems.includes(option) ? 'true' : 'false'}
              class={{
                'autocomplete-dropdown-item': true,
                focused: this.listEntered && this.focusedOptionIndex === i,
                [`${this.size}`]: !!this.size,
                deletable: showDelete,
              }}
              onMouseDown={this.onRowMouseDown}
            >
              <button
                id={`${this.ids}-option-${i}`}
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
                  id={`${this.ids}-delete-${i}`}
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
                  <i class="fa-solid fa-circle-xmark" aria-hidden="true" />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  private renderDropdown() {
    if (!this.dropdownOpen) return null;
    return (
      <div class="autocomplete-dropdown" aria-live="polite">
        {this.renderDropdownList()}
      </div>
    );
  }

  private renderMessage(kind: 'validation' | 'error') {
    const active = kind === 'validation' ? this.validation && !!this.validationMessage : this.error && !!this.errorMessage;
    if (!active) return null;

    const message = kind === 'validation' ? this.validationMessage : this.errorMessage;
    const id = kind === 'validation' ? this.validationId : this.errorId;
    const cls = kind === 'validation' ? 'invalid-feedback' : 'error-message';

    return (
      <div id={id} class={cls} aria-live="polite">
        {message}
      </div>
    );
  }

  /** Hidden inputs for form submission (selected items + raw typed text). */
  private renderFormFields() {
    const selected = this.name
      ? this.selectedItems.map(v => (
          <input type="hidden" name={this.name!.endsWith('[]') ? this.name! : `${this.name}[]`} value={v} />
        ))
      : null;

    const raw = this.rawInputName ? <input type="hidden" name={this.rawInputName} value={this.inputValue} /> : null;

    return [...(selected ?? []), ...(raw ? [raw] : [])];
  }

  private renderFieldArea() {
    return (
      <div class={this.containerClasses()}>
        <div class="ac-selected-items">{this.renderSelectedItems()}</div>
        <div class="ac-input-container-multi">
          <div class={this.groupClasses()}>
            {this.renderInputField()}
            {this.renderAddButton()}
            {this.renderClearButton()}
          </div>
          {this.renderFormFields()}
        </div>
      </div>
    );
  }

  private renderLayout() {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';

    const labelColClass = this.isHorizontal() ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    if (this.isRowLayout()) {
      return (
        <div class={outerClass}>
          <div class={`row form-group ${this.isInline() ? 'inline' : this.isHorizontal() ? 'horizontal' : ''}`}>
            {this.renderInputLabel(labelColClass)}
            <div class={inputColClass}>
              {this.renderFieldArea()}
              {this.renderDropdown()}
              {this.renderMessage('validation')}
              {this.renderMessage('error')}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div class={outerClass}>
        {this.renderInputLabel()}
        <div>
          {this.renderFieldArea()}
          {this.renderDropdown()}
          {this.renderMessage('validation')}
          {this.renderMessage('error')}
        </div>
      </div>
    );
  }

  // ---------------- Public API ----------------

  public validate(): boolean {
    this.validation = this.required && !this.isSatisfiedNow();
    return !this.validation;
  }

  /** Replace options from the host (and clear "user-added" tracking). Emits optionsChange('replace'). */
  @Method()
  async setOptions(next: string[]): Promise<void> {
    this.options = Array.isArray(next) ? [...next] : [];
    this.userAddedOptions.clear();
    await this.filterOptions();
    this.optionsChange.emit({ options: [...this.options], reason: 'replace' });
  }

  /** Read current options (for hosts). */
  @Method()
  async getOptions(): Promise<string[]> {
    return [...(this.options || [])];
  }

  render() {
    // NOTE: We intentionally do NOT set aria-hidden anywhere (some tooling checks aria-hidden on body).
    // Text spacing + color contrast are theme/CSS concerns; component uses semantic elements and no fixed text spacing.
    return <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout()}</div>;
  }
}
