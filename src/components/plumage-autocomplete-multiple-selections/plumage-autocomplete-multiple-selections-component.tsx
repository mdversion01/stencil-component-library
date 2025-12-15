// src/components/plumage-autocomplete-multiple-selects/plumage-autocomplete-multiple-selects-component.tsx
import { Component, h, Prop, State, Element, Event, EventEmitter, Watch, Method, Fragment } from '@stencil/core';
import { logInfo, logWarn, logError } from '../../utils/log-debug';

@Component({
  tag: 'plumage-autocomplete-multiple-selections-component',
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
export class PlumageAutocompleteMultipleSelectionsComponent {
  @Element() el!: HTMLElement;

  // ---------------- Props ----------------
  @Prop({ mutable: true }) options: string[] = [];
  @Prop() addBtn = false;
  @Prop() addIcon = '';
  @Prop() arialabelledBy: string = '';
  @Prop() clearIcon = '';
  @Prop() placeholder: string = 'Type to search/filter...';
  @Prop() devMode: boolean = false;
  @Prop() disabled: boolean = false;

  @Prop({ mutable: true }) formId: string = '';
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

  /** Validation controlled externally; mirrored to state for visuals. */
  @Prop({ mutable: true }) validation: boolean = false;
  @Prop() validationMessage: string = '';

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

  // Badge props
  @Prop() badgeVariant: string = '';
  @Prop() badgeShape: string = '';
  @Prop() badgeInlineStyles: string = '';

  // Legacy numeric cols
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** Responsive columns */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // ---------------- State ----------------
  @State() inputValue: string = '';
  @State() filteredOptions: string[] = [];
  @State() selectedItems: string[] = [];
  @State() focusedOptionIndex: number = -1;
  @State() isFocused: boolean = false;
  @State() hasBeenInteractedWith: boolean = false;
  @State() dropdownOpen: boolean = false;

  // virtual focus: option vs delete button
  @State() focusedPart: 'option' | 'delete' = 'option';
  @State() listEntered: boolean = false;

  // Plumage mirrors
  @State() private validationState: boolean = false;
  @State() private _resolvedFormId: string = '';
  private _preserveInputOnSelect = false;

  // internals
  private suppressBlur = false;
  private closeTimer: number | null = null;
  private userAddedOptions: Set<string> = new Set();

  // Keep-open mode after a selection (even with empty query) until next typing.
  private forceKeepOpenUntilNextInput = false;

  // ---------------- Events ----------------
  @Event({ eventName: 'itemSelect' }) itemSelect!: EventEmitter<string>;
  @Event() clear!: EventEmitter<void>;
  @Event() componentError!: EventEmitter<{ message: string; stack?: string }>;
  @Event({ eventName: 'multiSelectChange' }) selectionChange!: EventEmitter<string[]>;
  @Event({ eventName: 'optionsChange' }) optionsChange!: EventEmitter<{
    options: string[];
    reason: 'add' | 'delete' | 'replace';
    value?: string;
  }>;
  @Event({ eventName: 'optionDelete' }) optionDelete!: EventEmitter<string>;

  // ---------------- Watchers ----------------
  @Watch('options')
  handleOptionsChange(newVal: string[]) {
    if (!Array.isArray(newVal)) {
      logError(this.devMode, 'PlumageAutocompleteMultipleSelects', `'options' should be an array`, { receivedType: typeof newVal });
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

  // ---------------- Lifecycle -------------
  connectedCallback() {
    // inherit layout/formId from nearest <form-component>
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

    // seed mirrors
    this.validationState = !!this.validation;

    // Outside click collapses underline — bubble phase (same as other plumage inputs)
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillLoad() {
    this.hasBeenInteractedWith = false;

    if (!Array.isArray(this.options)) {
      logError(this.devMode, 'PlumageAutocompleteMultipleSelects', `Expected 'options' to be an array, got ${typeof this.options}`);
    }
    if (!this.label) {
      logWarn(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Missing label prop; accessibility may be impacted');
    }

    // resolve preserve flag
    this._preserveInputOnSelect = !!this.preserveInputOnSelect;
  }

  componentDidLoad() {
    // Use BUBBLE phase for outside clicks (robust across browsers and retargeting)
    document.addEventListener('click', this.handleClickOutside);
    this.applyFormAttribute();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleClickOutside);
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
    // prevent outside-click underline collapse
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
    // Ignore clicks inside the component
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
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/[\s-]+/g, '');
  }

  /** Sanitize user-typed input */
  private sanitizeInput(value: string): string {
    if (typeof value !== 'string') return '';
    let v = value.replace(/<[^>]*>/g, '');
    v = v.replace(/[\u0000-\u001F\u007F]/g, '');
    v = v.replace(/\s+/g, ' ').trim();
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

  /** Case-insensitive exact-equality check. */
  private hasOptionCi(value: string): boolean {
    const t = (value || '').trim().toLowerCase();
    return (this.options || []).some(o => (o || '').trim().toLowerCase() === t);
  }

  private upsertOption(raw: string): void {
    const cleaned = this.sanitizeInput(raw);
    const value = cleaned.trim();
    if (!value) return;
    if (!this.editable) {
      logWarn(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Refused upsert: editable=false', { value });
      return;
    }
    if (!Array.isArray(this.options)) this.options = [];
    if (this.hasOptionCi(value)) return;

    const next = [...this.options, value];
    this.options = this.autoSort ? next.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })) : next;

    this.userAddedOptions.add(value);
    this.optionsChange.emit({ options: [...this.options], reason: 'add', value });
    logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Inserted new option', { value, autoSort: this.autoSort });
  }

  private deleteUserOption(option: string) {
    if (!this.editable) return;
    if (!this.userAddedOptions.has(option)) {
      logWarn(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Refused delete: not a user-added option', { option });
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
    this.optionsChange.emit({ options: [...this.options], reason: 'delete', value: option });

    logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Deleted user-added option', { option, wasSelected });
  }

  /** Col specs parsing (Bootstrap-like) */
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

      if (this.devMode) console.warn('[plumage-autocomplete-multiple-selects] Unknown cols token:', t);
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
      this.labelSize === 'sm' ? 'label-sm' : this.labelSize === 'lg' ? 'label-lg' : '',
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
    return ['form-control', this.validationState || this.error ? 'is-invalid' : '', sizeClass].filter(Boolean).join(' ');
  }

  private containerClasses() {
    return ['ac-multi-select-container', this.validationState ? 'is-invalid' : '', this.size || ''].filter(Boolean).join(' ');
  }

  private getAvailableOptions(): string[] {
    return (this.options || []).filter(opt => !this.selectedItems.includes(opt));
  }

  // ---------------- Handlers ----------------
  private handleFocus = (e: Event) => {
    this.isFocused = true;
    this.handleInteraction(e);
  };

  private handleBlur = () => {
    this.isFocused = false;

    // If a mouse interaction from inside is happening, ignore this blur.
    if (this.suppressBlur) return;

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }

    // Defer to allow focus to settle on clicked element
    this.closeTimer = window.setTimeout(() => {
      const ae = (document.activeElement as HTMLElement) || null;
      const stillInComponent = !!ae && this.el.contains(ae);

      if (stillInComponent) {
        // DO NOT force-close while focus moved inside the component.
        this.listEntered = false;
        this.focusedPart = 'option';
      } else {
        // Left the component entirely: close, optionally clear input
        this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      }

      this.closeTimer = null;
    }, 120);

    if (this.required) {
      const invalidNow = !this.isSatisfiedNow();
      this.validationState = invalidNow;
      this.validation = invalidNow;
    }

    // Collapse underline on blur
    const bFocusDiv = this.el.querySelector<HTMLDivElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  private handleClickOutside = (e: MouseEvent) => {
    // If we're in the middle of an internal click (row/option/delete), never treat as outside
    if (this.suppressBlur) return;

    // Robust inside detection: composedPath when available, else contains fallback
    const path = typeof (e as any).composedPath === 'function' ? ((e as any).composedPath() as EventTarget[]) : null;
    const clickedInside = path ? path.indexOf(this.el) !== -1 : this.el.contains(e.target as Node);

    if (!clickedInside) {
      this.closeDropdown({ clearInput: this.clearInputOnBlurOutside });
      logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Click outside - dropdown closed');
    }
  };

  // Keyboard & input
  private handleInput = (event: InputEvent | KeyboardEvent) => {
    const input = event.target as HTMLInputElement;

    // keep "form" attribute linked
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

        // Exact match from available pool (not just filtered), case-insensitive
        const typed = typedRaw.toLowerCase();
        const pool = this.getAvailableOptions();
        const exactMatch = pool.find(opt => (opt || '').toLowerCase() === typed);
        if (exactMatch) {
          this.toggleItem(exactMatch, { keepDropdownOpen: true });
          return;
        }

        // Add new / ephemeral — sanitize before toggling
        if (typedRaw) {
          const cleaned = this.sanitizeInput(typedRaw);
          if (this.editable && this.addNewOnEnter) {
            this.upsertOption(cleaned);
            this.toggleItem(cleaned, { keepDropdownOpen: true });
          } else {
            this.toggleItem(cleaned, { keepDropdownOpen: true });
          }
          return;
        }

        logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Enter ignored — no match and add disabled', {
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
      // sanitize + filter + validation
      this.inputValue = this.sanitizeInput(input.value);

      // typing cancels the post-selection keep-open mode
      this.forceKeepOpenUntilNextInput = false;

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
    this.toggleItem(option, { keepDropdownOpen: true });
    setTimeout(() => {
      // refocus input for rapid next selection; then allow blur again
      this.el.querySelector('input')?.focus();
      this.suppressBlur = false;
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
      this.el.querySelector('input')?.focus();
      this.suppressBlur = false;
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
      logError(this.devMode, 'PlumageAutocompleteMultipleSelects', `'options' must be an array`, {
        receivedType: typeof this.options,
        value: this.options,
      });
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
      if (this.forceKeepOpenUntilNextInput) {
        // After a selection: keep it open, show all remaining choices
        this.filteredOptions = available;
        this.dropdownOpen = this.filteredOptions.length > 0;
        this.focusedOptionIndex = -1;
        this.focusedPart = 'option';
        this.listEntered = false;
        return;
      }

      // Normal behavior (no keep-open request): closed on empty query
      this.filteredOptions = [];
      this.dropdownOpen = false;
      this.focusedOptionIndex = -1;
      this.focusedPart = 'option';
      this.listEntered = false;
      return;
    }

    this.filteredOptions = available.filter(opt => (opt || '').toLowerCase().includes(v));
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

  /** Keep suggestions in sync after selection/removal. */
  private recomputeSuggestionsAfterSelection(keepOpen: boolean = true) {
    const v = (this.inputValue || '').trim().toLowerCase();
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

  private toggleItem(option: string, opts?: { keepDropdownOpen?: boolean }) {
    const updated = new Set(this.selectedItems);
    updated.has(option) ? updated.delete(option) : updated.add(option);

    this.selectedItems = Array.from(updated);
    this.selectionChange.emit(this.selectedItems);

    // honor preserveInputOnSelect; default is to clear
    if (!this._preserveInputOnSelect) this.inputValue = '';

    // keep validation mirrors up-to-date
    const invalidNow = this.required && !this.isSatisfiedNow();
    this.validationState = invalidNow;
    this.validation = invalidNow;

    if (opts?.keepDropdownOpen) {
      // mark that we want to keep it open even if the query is empty
      this.forceKeepOpenUntilNextInput = true;

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

    // Keep focus for quick next selection
    setTimeout(() => {
      this.el.querySelector('input')?.focus();
    }, 0);

    logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Toggled item', {
      selected: option,
      currentSelections: this.selectedItems,
      dropdownOpen: this.dropdownOpen,
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
    logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Dropdown closed');
  }

  private removeItemAt(index: number) {
    if (index < 0 || index >= this.selectedItems.length) return;
    const removed = this.selectedItems[index];
    this.selectedItems = [...this.selectedItems.slice(0, index), ...this.selectedItems.slice(index + 1)];
    this.selectionChange.emit(this.selectedItems);

    // Keep suggestions in sync but (here) keep it closed
    this.recomputeSuggestionsAfterSelection(false);

    const invalidNow = this.required && !this.isSatisfiedNow();
    this.validationState = invalidNow;
    this.validation = invalidNow;

    logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Removed single badge', { removed, index });
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
      logWarn(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Add ignored: editable=false');
      return;
    }

    this.itemSelect.emit(value);
    if (!this.hasOptionCi(value)) this.upsertOption(value);
    // Keep dropdown open for rapid multi-adding
    this.toggleItem(value, { keepDropdownOpen: true });
    logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Add button added new option (dropdown kept open)', { value });
  };

  private clearAll = () => {
    this.selectedItems = [];
    this.inputValue = '';
    this.filteredOptions = [];
    this.dropdownOpen = false;
    this.selectionChange.emit([]);

    this.hasBeenInteractedWith = true;
    this.listEntered = false;

    const invalidNow = this.required && !this.isSatisfiedNow();
    this.validationState = invalidNow;
    this.validation = invalidNow;

    this.clear.emit();
    logInfo(this.devMode, 'PlumageAutocompleteMultipleSelects', 'Input cleared');
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
          <button type="button" onClick={() => this.removeItemAt(index)} aria-label={`Remove ${item}`} data-tag={item} role="button" class="remove-btn" title="Remove Tag">
            <i class="fa-solid fa-circle-xmark" />
          </button>
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
            this.el.querySelector('input')?.focus();
            this.suppressBlur = false;
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
            this.el.querySelector('input')?.focus();
            this.suppressBlur = false;
          }, 0);
        }}
      >
        <i class={this.clearIcon || 'fas fa-times'} />
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
        aria-labelledby={this.arialabelledBy || undefined}
        aria-describedby={this.validationState ? `${ids}-validation` : this.error ? `${ids}-error` : null}
        aria-autocomplete="list"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        aria-controls={`${ids}-listbox`}
        aria-activedescendant={this.listEntered && this.focusedOptionIndex >= 0 ? `${ids}-${this.focusedPart}-${this.focusedOptionIndex}` : undefined}
        aria-required={this.required ? 'true' : 'false'}
        aria-haspopup="listbox"
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

  private renderDropdownList(ids: string) {
    return (
      <ul role="listbox" id={`${ids}-listbox`} tabIndex={-1}>
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
              tabIndex={-1}
            >
              {/* OPTION BUTTON */}
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

              {/* DELETE BUTTON (only for user-added options when editable) */}
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
    const active = kind === 'validation' ? this.validationState && !!this.validationMessage : this.error && !!this.errorMessage;
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

  private renderFormFields() {
    const selected = this.name ? this.selectedItems.map(v => <input type="hidden" name={this.name!.endsWith('[]') ? this.name! : `${this.name}[]`} value={v} />) : null;

    const raw = this.rawInputName ? <input type="hidden" name={this.rawInputName} value={this.inputValue} /> : null;

    return [...(selected ?? []), ...(raw ? [raw] : [])];
  }

  private renderFieldArea(ids: string, names: string) {
    return (
      <Fragment>
        <div class={this.containerClasses()}>
          <div class="ac-selected-items">{this.renderSelectedItems()}</div>
          <div class="ac-input-container">
            <div class={{ 'input-group': true, 'is-invalid': this.validationState || this.error }}>
              {this.renderInputField(ids, names)}
              {this.renderAddButton()}
              {this.renderClearButton()}
            </div>

            {this.renderFormFields()}
          </div>
        </div>

        {/* Underline/focus bar (parity with plumage inputs) */}
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

    // Stacked
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
    const invalid = this.required && !this.isSatisfiedNow();
    this.validationState = invalid;
    this.validation = invalid;
    return !invalid;
  }

  // ---------------- Render root ----------------
  render() {
    const ids = this.camelCase(this.inputId).replace(/ /g, '');
    const names = this.camelCase(this.label).replace(/ /g, '');
    return (
      <div class="plumage">
        <div class={{ 'autocomplete-container': true, 'form-group': true }}>{this.renderLayout(ids, names)}</div>
      </div>
    );
  }
}
