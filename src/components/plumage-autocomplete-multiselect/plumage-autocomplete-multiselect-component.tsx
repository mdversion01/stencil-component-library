// src/components/plumage-autocomplete-multiselect/plumage-autocomplete-multiselect-component.tsx
import { Component, h, Prop, State, Element, Event, EventEmitter, Watch, Method, Fragment } from '@stencil/core';
import { logInfo, logWarn, logError } from '../../utils/log-debug';

@Component({
  tag: 'plumage-autocomplete-multiselect-component',
  styleUrls: [
    '../layout-styles.scss',
    '../form-styles.scss',
    '../plumage-input-field/plumage-input-field-styles.scss',
    '../plumage-input-group/plumage-input-group-styles.scss',
    '../plumage-autocomplete-single/plumage-autocomplete-styles.scss',
    '../badge/badge.scss',
  ],
  shadow: false,
})
export class PlumageAutocompleteMultiselectComponent {
  @Element() el!: HTMLElement;

  // ---------------- Props ----------------
  @Prop({ mutable: true }) options: string[] = [];
  @Prop() addBtn = false;
  @Prop() addIcon = '';
  @Prop() arialabelledBy: string = '';
  @Prop() clearIcon = '';
  @Prop() placeholder = 'Type to search/filter...';
  @Prop() devMode = false;
  @Prop() disabled = false;

  @Prop({ mutable: true }) formId = '';
  @Prop({ mutable: true }) formLayout: '' | 'horizontal' | 'inline' = '';

  @Prop({ mutable: true }) error = false;
  @Prop({ mutable: true }) errorMessage = '';

  @Prop() inputId = '';
  @Prop() label = '';
  @Prop() labelSize: 'base' | 'xs' | 'sm' | 'lg' = 'sm';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden = false;

  @Prop() removeClearBtn = false;
  @Prop() size: '' | 'sm' | 'lg' = '';
  @Prop() required = false;
  @Prop() type = '';

  /** Validation controlled externally; mirrored to state for visuals. */
  @Prop({ mutable: true }) validation = false;
  @Prop() validationMessage = '';

  /** ✅ Controlled selected values (external source of truth). Do NOT mutate this prop. */
  @Prop() value: string[] = [];

  /** Submit names */
  @Prop() name?: string; // selected items
  @Prop() rawInputName?: string; // raw typed text

  /** Behavior switches */
  @Prop() preserveInputOnSelect?: boolean; // optional override
  @Prop() clearInputOnBlurOutside: boolean = false;

  // Add/Sort behavior
  @Prop() addNewOnEnter: boolean = true;
  @Prop() autoSort: boolean = true;
  @Prop() editable: boolean = false;

  // Badge Props
  @Prop() badgeVariant = '';
  @Prop() badgeShape = '';
  @Prop() badgeInlineStyles = '';

  // Legacy numeric fallback
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive column class specs */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ---------------- State ----------------
  @State() inputValue = '';
  @State() filteredOptions: string[] = [];
  @State() selectedItems: string[] = [];
  @State() focusedOptionIndex = -1;
  @State() isFocused = false;
  @State() hasBeenInteractedWith = false;
  @State() dropdownOpen = false;

  @State() focusedPart: 'option' | 'delete' = 'option';
  @State() listEntered = false;

  // Mirrors
  @State() private validationState: boolean = false;
  @State() private _resolvedFormId: string = '';
  @State() private valueState: string[] = [];

  // a11y announcements
  @State() private liveMessage: string = '';

  private _preserveInputOnSelect = false;

  // internals
  private suppressBlur = false;
  private closeTimer: number | null = null;
  private userAddedOptions: Set<string> = new Set();

  // Stable fallback id for ARIA wiring
  private _fallbackId: string = `plumage-acms-${Math.random().toString(36).slice(2, 10)}`;

  // ---------------- Events ----------------
  @Event({ eventName: 'itemSelect' }) itemSelect!: EventEmitter<string>;
  @Event() clear!: EventEmitter<void>;
  @Event() componentError!: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange!: EventEmitter<string[]>;
  @Event({ eventName: 'valueChange' }) valueChange!: EventEmitter<string[]>;
  @Event({ eventName: 'optionsChange' })
  optionsChange!: EventEmitter<{ options: string[]; reason: 'add' | 'delete' | 'replace'; value?: string }>;
  @Event({ eventName: 'optionDelete' }) optionDelete!: EventEmitter<string>;

  // ---------------- Watchers ----------------
  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'PlumageAutocompleteMultiselect', `'options' should be an array`, { receivedType: typeof newVal });
      return;
    }
    this.filterOptions();
  }

  @Watch('validation')
  onValidationPropChange(v: boolean) {
    this.validationState = !!v;
  }

  @Watch('formId')
  onFormIdChange(newVal: string) {
    this._resolvedFormId = newVal || '';
    this.applyFormAttribute();
  }

  /** ✅ When host controls `value`, mirror it into internal selection state. */
  @Watch('value')
  onValuePropChange(v: string[]) {
    const next = this.sanitizeValueArray(v);

    this.valueState = next;
    this.selectedItems = next;

    this.filteredOptions = [];
    this.focusedOptionIndex = -1;
    this.focusedPart = 'option';
    this.listEntered = false;
    this.dropdownOpen = false;

    const invalidNow = this.required && !this.isSatisfiedNow();
    this.validationState = invalidNow;
    this.validation = invalidNow;
  }

  // ---------------- Lifecycle -------------
  connectedCallback() {
    const formComponent = this.el.closest('form-component') as any;
    const fcFormId = formComponent?.formId;
    const fcLayout = formComponent?.formLayout;

    if (!this.formId && typeof fcFormId === 'string') this.formId = fcFormId;
    if (!this.formLayout && typeof fcLayout === 'string') {
      const allowed = ['', 'horizontal', 'inline'] as const;
      if ((allowed as readonly string[]).includes(fcLayout)) {
        this.formLayout = fcLayout as '' | 'horizontal' | 'inline';
      }
    }

    this.validationState = !!this.validation;

    this.valueState = this.sanitizeValueArray(this.value);
    this.selectedItems = [...this.valueState];

    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'PlumageAutocompleteMultiselect', `Expected 'options' to be an array, got ${typeof this.options}`);
    }
    if (!this.label) {
      logWarn(this.devMode, 'PlumageAutocompleteMultiselect', 'Missing label prop; accessibility may be impacted');
    }

    this._preserveInputOnSelect = !!this.preserveInputOnSelect;
  }

  componentDidLoad() {
    document.addEventListener('click', this.handleClickOutside, true);
    this.applyFormAttribute();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside, true);
    document.removeEventListener('click', this.handleDocumentClick);
  }

  // ---------------- Form attribute --------
  private applyFormAttribute() {
    const input = this.el.querySelector('input.form-control') as HTMLInputElement | null;
    if (!input) return;
    if (this._resolvedFormId) input.setAttribute('form', this._resolvedFormId);
    else input.removeAttribute('form');
  }

  // ---------------- Underline focus UX ----
  private handleInteraction = (event: Event) => {
    event.stopPropagation();

    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    const input = this.el.querySelector<HTMLInputElement>('input.form-control');
    const isInputFocused = event.target === input;

    if (bFocusDiv) {
      if (isInputFocused) {
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      } else {
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      }
    }
  };

  private handleDocumentClick = (ev: Event) => {
    const path = (ev as any).composedPath ? (ev as any).composedPath() : [];
    if (path && path.includes(this.el)) return;

    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  // ---------------- Utilities -------------
  private camelCase(str: string): string {
    if (!str) return '';
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase()))
      .replace(/[\s-]+/g, '');
  }

  private resolveIds(): {
    inputId: string;
    listboxId: string;
    selectedListId: string;
    liveId: string;
    helpId: string;
    validationId: string;
    errorId: string;
  } {
    const raw = (this.inputId || '').trim();
    const base = this.camelCase(raw).replace(/ /g, '') || this._fallbackId;
    return {
      inputId: base,
      listboxId: `${base}-listbox`,
      selectedListId: `${base}-selected`,
      liveId: `${base}-live`,
      helpId: `${base}-help`,
      validationId: `${base}-validation`,
      errorId: `${base}-error`,
    };
  }

  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    let v = value.replace(/<[^>]*>/g, '');
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    v = v.replace(/\s+/g, ' ').trim();
    const MAX_LEN = 512;
    if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);
    return v;
  }

  /** ✅ Sanitize externally-controlled value array (strip tags, trim, drop empties, de-dupe). */
  private sanitizeValueArray(value: any): string[] {
    const arr = Array.isArray(value) ? value : [];
    const out: string[] = [];
    const seen = new Set<string>();

    for (const raw of arr) {
      const cleaned = this.sanitizeInput(String(raw ?? '')).trim();
      if (!cleaned) continue;
      const key = cleaned.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(cleaned);
    }

    return out;
  }

  private announce(message: string) {
    this.liveMessage = message;
  }

  private emitValue(next: string[]) {
    this.valueState = [...next];
    this.valueChange.emit([...this.valueState]);
    this.el.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { value: [...this.valueState] } }));
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

  private hasOptionCi(value: string): boolean {
    const t = (value || '').trim().toLowerCase();
    return (this.options || []).some((o) => (o || '').trim().toLowerCase() === t);
  }

  private upsertOption(raw: string): void {
    const cleaned = this.sanitizeInput(raw);
    const value = cleaned.trim();
    if (!value) return;
    if (!this.editable) {
      logWarn(this.devMode, 'PlumageAutocompleteMultiselect', 'Refused upsert: editable=false', { value });
      return;
    }
    if (!Array.isArray(this.options)) this.options = [];
    if (this.hasOptionCi(value)) return;

    const next = [...this.options, value];
    this.options = this.autoSort ? next.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })) : next;

    this.userAddedOptions.add(value);
    this.optionsChange.emit({ options: [...this.options], reason: 'add', value });
    logInfo(this.devMode, 'PlumageAutocompleteMultiselect', 'Inserted new option', { value, autoSort: this.autoSort });
  }

  private deleteUserOption(option: string) {
    if (!this.editable) return;
    if (!this.userAddedOptions.has(option)) {
      logWarn(this.devMode, 'PlumageAutocompleteMultiselect', 'Refused delete: not a user-added option', { option });
      return;
    }

    this.options = (this.options || []).filter((o) => o !== option);

    const wasSelected = this.selectedItems.includes(option);
    if (wasSelected) {
      const nextSel = this.selectedItems.filter((s) => s !== option);
      this.selectedItems = nextSel;
      this.selectionChange.emit(this.selectedItems);
      this.emitValue(this.selectedItems);
      this.announce(`Removed ${option}.`);
    }

    this.userAddedOptions.delete(option);
    this.filterOptions();

    this.optionDelete.emit(option);
    this.optionsChange.emit({ options: [...this.options], reason: 'delete', value: option });

    if (!wasSelected) this.announce(`Deleted option ${option}.`);
    logInfo(this.devMode, 'PlumageAutocompleteMultiselect', 'Deleted user-added option', { option, wasSelected });
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
        out.push(`col-${Math.max(1, Math.min(12, parseInt(t, 10)))}`);
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

      if (this.devMode) console.warn('[plumage-autocomplete-multiselect] Unknown cols token:', t);
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

  private labelClasses(labelColClass?: string) {
    return [
      'form-control-label',
      this.labelSize === 'xs' ? 'label-xs' : this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
      this.labelHidden ? 'sr-only' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.isHorizontal() ? `${labelColClass} no-padding col-form-label` : '',
      this.validationState ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private inputClasses() {
    const sizeClass = this.size === 'sm' ? 'form-control-sm' : this.size === 'lg' ? 'form-control-lg' : '';
    return ['form-control', sizeClass, this.validationState || this.error ? 'is-invalid' : ''].filter(Boolean).join(' ');
  }

  private groupClasses() {
    const sizeClass = this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
    return ['input-group', this.validationState ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
  }

  private containerClasses() {
    return ['ac-multi-select-container', this.disabled ? 'disabled' : '', this.validationState ? 'is-invalid' : ''].filter(Boolean).join(' ');
  }

  private getAvailableOptions(): string[] {
    return (this.options || []).filter((opt) => !this.selectedItems.includes(opt));
  }

  // ---------------- Handlers ----------------
  private handleFocus = (e: Event) => {
    this.isFocused = true;
    this.handleInteraction(e);
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

      if (!stillInComponent) {
        this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      }

      this.closeTimer = null;
    }, 120);

    if (this.required) {
      const invalidNow = !this.isSatisfiedNow();
      this.validationState = invalidNow;
      this.validation = invalidNow;
    }

    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  private handleClickOutside = (e: MouseEvent) => {
    const path = (e.composedPath && e.composedPath()) || [];
    if (!path.includes(this.el)) {
      this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      logInfo(this.devMode, 'PlumageAutocompleteMultiselect', 'Click outside - dropdown closed');
    }
  };

  private handleInput = (event: InputEvent | KeyboardEvent) => {
    const input = event.target as HTMLInputElement;

    if (this._resolvedFormId) input.setAttribute('form', this._resolvedFormId);
    else input.removeAttribute('form');

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

        // delete focused user-added option
        if (this.listEntered && this.dropdownOpen && this.focusedOptionIndex >= 0 && this.focusedPart === 'delete') {
          const opt = this.filteredOptions[this.focusedOptionIndex];
          if (this.editable && this.userAddedOptions.has(opt)) this.deleteUserOption(opt);
          return;
        }

        // select focused option
        const hasFocusedPick = this.listEntered && this.dropdownOpen && this.focusedOptionIndex >= 0 && !!this.filteredOptions[this.focusedOptionIndex];
        if (hasFocusedPick) {
          this.toggleItem(this.filteredOptions[this.focusedOptionIndex]);
          return;
        }

        // ✅ typed Enter behavior (matches autocomplete-multiselect)
        // - always add to selected items if non-empty
        // - only add to options when editable && addNewOnEnter
        const typedRaw = (this.inputValue || '').trim();
        if (typedRaw) {
          const cleaned = this.sanitizeInput(typedRaw).trim();
          if (!cleaned) return;

          if (this.editable && this.addNewOnEnter) {
            this.upsertOption(cleaned); // persists in dropdown options
          }
          this.toggleItem(cleaned); // always selects (ephemeral if not editable)
          return;
        }

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

      if (this.required) {
        this.validationState = !this.isSatisfiedNow();
        this.validation = this.validationState;
      }
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
    if (!this.dropdownOpen && this.filteredOptions.length > 0) this.dropdownOpen = true;
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
      logError(this.devMode, 'PlumageAutocompleteMultiselect', `'options' must be an array`, { receivedType: typeof this.options, value: this.options });
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
      this.listEntered = false;
      return;
    }

    const v = this.inputValue.trim().toLowerCase();
    const available = this.getAvailableOptions();

    if (v.length === 0) {
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
      this.listEntered = false;
      return;
    }

    this.filteredOptions = available.filter((opt) => (opt || '').toLowerCase().includes(v));
    this.dropdownOpen = this.filteredOptions.length > 0;

    if (this.dropdownOpen) {
      if (this.focusedOptionIndex >= this.filteredOptions.length) this.focusedOptionIndex = -1;
      this.listEntered = false;
      this.focusedPart = 'option';
    } else {
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
      this.listEntered = false;
    }
  }

  @Method()
  async getOptions(): Promise<string[]> {
    return [...(this.options || [])];
  }

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

    const updated = new Set(this.selectedItems);
    const willSelect = !updated.has(option);
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = this.sanitizeValueArray(Array.from(updated));

    this.selectionChange.emit(this.selectedItems);
    this.emitValue(this.selectedItems);

    if (!this._preserveInputOnSelect) this.inputValue = '';

    const invalidNow = this.required && !this.isSatisfiedNow();
    this.validationState = invalidNow;
    this.validation = invalidNow;

    this.announce(willSelect ? `Added ${option}.` : `Removed ${option}.`);

    this.closeDropdown({ clearInput: false });
    setTimeout(() => this.el.querySelector('input')?.focus(), 0);

    logInfo(this.devMode, 'PlumageAutocompleteMultiselect', 'Toggled item (dropdown closed)', {
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
    logInfo(this.devMode, 'PlumageAutocompleteMultiselect', 'Dropdown closed');
  }

  private removeItemAt(index: number) {
    if (index < 0 || index >= this.selectedItems.length) return;

    const removed = this.selectedItems[index];
    const next = [...this.selectedItems.slice(0, index), ...this.selectedItems.slice(index + 1)];
    this.selectedItems = next;

    this.selectionChange.emit(this.selectedItems);
    this.emitValue(this.selectedItems);

    const invalidNow = this.required && !this.isSatisfiedNow();
    this.validationState = invalidNow;
    this.validation = invalidNow;

    this.announce(`Removed ${removed}.`);
    logInfo(this.devMode, 'PlumageAutocompleteMultiselect', 'Removed single badge', { removed, index });
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
      logWarn(this.devMode, 'PlumageAutocompleteMultiselect', 'Add ignored: editable=false');
      return;
    }

    this.itemSelect.emit(value);
    if (!this.hasOptionCi(value)) this.upsertOption(value);

    this.toggleItem(value);
    logInfo(this.devMode, 'PlumageAutocompleteMultiselect', 'Add button added new option (dropdown closed)', { value });
  };

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.dropdownOpen = false;
    this.selectionChange.emit([]);

    this.emitValue([]);

    this.hasBeenInteractedWith = true;
    this.listEntered = false;

    const invalidNow = this.required && !this.isSatisfiedNow();
    this.validationState = invalidNow;
    this.validation = invalidNow;

    this.clear.emit();
    this.announce('Cleared all selections.');
    logInfo(this.devMode, 'PlumageAutocompleteMultiselect', 'Input cleared');
  };

  // ---------------- Render helpers ----------------
  private parseInlineStyles(styles: string): { [k: string]: string } | undefined {
    if (!styles || typeof styles !== 'string') return undefined;
    return styles.split(';').reduce((acc, rule) => {
      const [key, value] = rule.split(':').map((s) => s.trim());
      if (key && value) acc[key.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] = value;
      return acc;
    }, {} as { [k: string]: string });
  }

  private renderSelectedItems(selectedListId: string) {
    return (
      <div class="ac-selected-items" id={selectedListId} role="list" aria-label="Selected items">
        {this.selectedItems.map((item, index) => {
          const classMap: { [k: string]: boolean } = {
            badge: true,
            [`text-bg-${this.badgeVariant}`]: !!this.badgeVariant,
            [this.badgeShape]: !!this.badgeShape,
            [this.size]: !!this.size,
          };

          return (
            <div class={classMap} style={this.parseInlineStyles(this.badgeInlineStyles)} key={`${item}-${index}`} role="listitem">
              <span>{item}</span>
              {!this.disabled ? (
                <button type="button" onClick={() => this.removeItemAt(index)} aria-label={`Remove ${item}`} data-tag={item} class="remove-btn" title="Remove Tag">
                  <i class="fa-solid fa-xmark" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    );
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
        class="add-btn"
        disabled={this.disabled}
        aria-disabled={this.disabled ? 'true' : 'false'}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.suppressBlur = true;
        }}
        onClick={(e) => {
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
        aria-disabled={this.disabled ? 'true' : 'false'}
        title="Clear input"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.suppressBlur = true;
        }}
        onClick={(e) => {
          e.preventDefault();
          this.clearAll();
          setTimeout(() => {
            this.suppressBlur = false;
            this.el.querySelector('input')?.focus();
          }, 0);
        }}
      >
        <i class={this.clearIcon || 'fas fa-times'} />
      </button>
    );
  }

  private renderInputLabel(inputId: string, labelColClass?: string) {
    if (this.labelHidden) return null;
    const text = this.isRowLayout() ? `${this.label}:` : this.label;

    return (
      <label class={this.labelClasses(labelColClass)} htmlFor={inputId || undefined}>
        <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
        {this.required ? <span class="required">*</span> : ''}
      </label>
    );
  }

  private buildDescribedBy(ids: ReturnType<typeof this.resolveIds>): string | undefined {
    const parts: string[] = [];
    if (this.validationState && this.validationMessage) parts.push(ids.validationId);
    if (this.error && this.errorMessage) parts.push(ids.errorId);
    return parts.length ? parts.join(' ') : undefined;
  }

  private renderInputField(ids: ReturnType<typeof this.resolveIds>) {
    const placeholder = (this.placeholder && this.placeholder.trim().length > 0 ? this.placeholder : this.label) || 'Type to search';
    const describedBy = this.buildDescribedBy(ids);

    const hasVisibleLabel = !this.labelHidden && !!this.label;
    const fallbackAriaLabel = (this.label || placeholder || 'Autocomplete').trim();

    const invalid = !!(this.validationState || this.error);
    const activeOptionId = this.dropdownOpen && this.listEntered && this.focusedOptionIndex >= 0 ? `${ids.inputId}-opt-${this.focusedOptionIndex}` : undefined;

    return (
      <input
        id={ids.inputId}
        name={this.rawInputName || null}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        aria-controls={ids.listboxId}
        aria-activedescendant={activeOptionId}
        aria-haspopup="listbox"
        aria-required={this.required ? 'true' : 'false'}
        aria-invalid={invalid ? 'true' : 'false'}
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-describedby={describedBy}
        aria-labelledby={this.arialabelledBy || undefined}
        aria-label={!hasVisibleLabel && !this.arialabelledBy ? fallbackAriaLabel : undefined}
        class={this.inputClasses()}
        type={this.type || 'text'}
        placeholder={placeholder}
        value={this.inputValue}
        disabled={this.disabled}
        onInput={this.handleInput}
        onKeyDown={this.handleInput}
        onFocus={this.handleFocus}
        onClick={this.handleInteraction}
        onMouseDown={this.handleInteraction}
        onBlur={this.handleBlur}
        inputMode="text"
        autoComplete="off"
        spellcheck={false}
        form={this._resolvedFormId || undefined}
      />
    );
  }

  private renderDropdownList(ids: ReturnType<typeof this.resolveIds>) {
    return (
      <ul role="listbox" id={ids.listboxId} tabIndex={-1} aria-multiselectable="true">
        {this.filteredOptions.map((option, i) => {
          const isUserAdded = this.userAddedOptions.has(option);
          const showDelete = this.editable && isUserAdded;

          const rowFocused = this.listEntered && this.focusedOptionIndex === i;
          const rowId = `${ids.inputId}-opt-${i}`;

          return (
            <li
              id={rowId}
              role="option"
              aria-selected={this.selectedItems.includes(option) ? 'true' : 'false'}
              class={{
                'autocomplete-dropdown-item': true,
                focused: rowFocused,
                [`${this.size}`]: !!this.size,
                deletable: showDelete,
              }}
              onMouseDown={this.onRowMouseDown}
              tabIndex={-1}
            >
              <button
                type="button"
                class={{
                  'option-btn': true,
                  'virtually-focused': rowFocused && this.focusedPart === 'option',
                }}
                onMouseDown={(e) => this.onOptionButtonMouseDown(e)}
                onClick={(e) => this.onOptionButtonClick(e, option)}
                aria-label={`Select ${option}`}
                tabIndex={-1}
              >
                <span>{option}</span>
              </button>

              {showDelete ? (
                <button
                  type="button"
                  class={{
                    'delete-btn': true,
                    'virtually-focused': rowFocused && this.focusedPart === 'delete',
                  }}
                  aria-label={`Delete ${option}`}
                  title={`Delete ${option}`}
                  onMouseDown={this.onDeleteButtonMouseDown}
                  onClick={(e) => this.onDeleteButtonClick(e, option)}
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

  private renderDropdown(ids: ReturnType<typeof this.resolveIds>) {
    if (!this.dropdownOpen) return null;
    return (
      <div class="autocomplete-dropdown" aria-live="polite">
        {this.renderDropdownList(ids)}
      </div>
    );
  }

  private renderMessage(kind: 'validation' | 'error', ids: ReturnType<typeof this.resolveIds>) {
    const active = kind === 'validation' ? this.validationState && !!this.validationMessage : this.error && !!this.errorMessage;
    if (!active) return null;

    const message = kind === 'validation' ? this.validationMessage : this.errorMessage;
    const baseId = kind === 'validation' ? ids.validationId : ids.errorId;
    const baseClass = kind === 'validation' ? 'invalid-feedback' : 'error-message';

    const liveProps =
      kind === 'error'
        ? { 'aria-live': 'assertive' as const, role: 'alert' as const }
        : { 'aria-live': 'polite' as const, role: undefined as any };

    if (this.isHorizontal()) {
      return (
        <div id={baseId} class={baseClass} {...liveProps}>
          {message}
        </div>
      );
    }

    if (this.isInline()) {
      return (
        <div class="row">
          <div></div>
          <div>
            <div id={baseId} class={baseClass} {...liveProps}>
              {message}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id={baseId} class={baseClass} {...liveProps}>
        {message}
      </div>
    );
  }

  private renderFormFields() {
    const selected = this.name
      ? this.selectedItems.map((v) => <input type="hidden" name={this.name!.endsWith('[]') ? this.name! : `${this.name}[]`} value={v} />)
      : null;

    const raw = this.rawInputName ? <input type="hidden" name={this.rawInputName} value={this.inputValue} /> : null;

    return [...(selected ?? []), ...(raw ? [raw] : [])];
  }

  private renderFieldArea(ids: ReturnType<typeof this.resolveIds>) {
    return (
      <Fragment>
        <div class={this.containerClasses()}>
          {this.renderSelectedItems(ids.selectedListId)}
          <div class="ac-input-container-multi">
            <div class={this.groupClasses()}>
              {this.renderInputField(ids)}
              {this.renderAddButton()}
              {this.renderClearButton()}
            </div>

            {this.renderFormFields()}
          </div>
        </div>

        <div class={`b-underline${this.validationState ? ' invalid' : ''}`} role="presentation">
          <div
            class={`b-focus${this.disabled ? ' disabled' : ''}${this.validationState ? ' invalid' : ''}`}
            role="presentation"
            aria-hidden="true"
            style={{ width: '0', left: '50%' } as any}
          />
        </div>
      </Fragment>
    );
  }

  private renderLayout(ids: ReturnType<typeof this.resolveIds>) {
    const outerClass = this.formLayout ? ` ${this.formLayout}` : '';

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal()
      ? this.buildColClass('input') || undefined
      : this.isInline()
        ? this.buildColClass('input') || undefined
        : undefined;

    if (this.isRowLayout()) {
      return (
        <div class={outerClass}>
          <div class={`row form-group ${this.isInline() ? 'inline' : this.isHorizontal() ? 'horizontal' : ''}`}>
            {this.renderInputLabel(ids.inputId, labelColClass)}
            <div class={inputColClass}>
              {this.renderFieldArea(ids)}
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
        {this.renderInputLabel(ids.inputId)}
        <div>
          {this.renderFieldArea(ids)}
          {this.renderDropdown(ids)}
          {this.renderMessage('validation', ids)}
          {this.renderMessage('error', ids)}
        </div>
      </div>
    );
  }

  // ---------------- Public API ----------------
  public validate(): boolean {
    const invalid = this.required && !this.isSatisfiedNow();
    this.validationState = invalid;
    this.validation = invalid;
    return !invalid;
  }

  // ---------------- Render root ----------------
  render() {
    const ids = this.resolveIds();
    return (
      <div class="plumage">
        <div id={ids.liveId} class="sr-only" aria-live="polite" aria-atomic="true">
          {this.liveMessage}
        </div>

        <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(ids)}</div>
      </div>
    );
  }
}
