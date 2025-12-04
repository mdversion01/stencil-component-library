// src/components/date-picker/datepicker-component.tsx
import { Component, Prop, State, h, Element, Event, EventEmitter, Listen, Watch, Fragment } from '@stencil/core';
import { createPopper, Instance as PopperInstance } from '@popperjs/core';

@Component({
  tag: 'datepicker-component',
  styleUrls: [
    '../form-styles.scss',
    '../layout-styles.scss',
    '../input-field/input-field-styles.scss',
    '../input-group/input-group-styles.scss',
    '../plumage-input-field/plumage-input-field-styles.scss',
    '../plumage-input-group/plumage-input-group-styles.scss',
    './datepicker-styles.scss',
  ],
  shadow: false, // light DOM
})
export class Datepicker {
  @Element() host!: HTMLElement;

  private inputElement?: HTMLInputElement | null;
  private calendarButton?: HTMLButtonElement | null;
  private popperInstance: PopperInstance | null = null;
  private preventClose = false;

  // Track whether user explicitly provided these attributes
  private userProvidedPlaceholder = false;
  private userProvidedDateFormat = false;

  /** Query helpers (work with shadow or light DOM) */
  private root(): DocumentFragment | HTMLElement {
    return this.host.shadowRoot ?? this.host;
  }
  private qs<T extends Element = Element>(sel: string): T | null {
    return this.root().querySelector(sel) as T | null;
  }
  private qsa<T extends Element = Element>(sel: string): NodeListOf<T> {
    return this.root().querySelectorAll(sel) as NodeListOf<T>;
  }

  /** Reserved-name fixes kept */
  @Prop({ attribute: 'append', mutable: true, reflect: true }) appendProp: boolean = true;
  @Prop({ mutable: true, reflect: true }) appendId: string = '';
  @Prop({ mutable: true, reflect: true }) calendar: boolean = false;

  @Prop({ mutable: true, reflect: true }) currentMonth: number = new Date().getMonth();
  @Prop({ mutable: true, reflect: true }) currentYear: number = new Date().getFullYear();
  @Prop({ mutable: true, reflect: true }) dateFormat: 'YYYY-MM-DD' | 'MM-DD-YYYY' = 'YYYY-MM-DD';
  @Prop({ mutable: true, reflect: true }) disabled: boolean = false;
  @Prop({ mutable: true, reflect: true }) displayContextExamples: boolean = false;
  @Prop({ mutable: true, reflect: true }) dropdownOpen: boolean = false;

  /** Layout & sizing */
  @Prop({ mutable: true, reflect: true }) formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop({ mutable: true, reflect: true }) size: '' | 'sm' | 'lg' = '';

  /** Icon & ids */
  @Prop({ mutable: true, reflect: true }) icon: string = 'fas fa-calendar-alt';
  @Prop({ mutable: true, reflect: true }) inputId: string = 'datepicker';

  /** Label & placeholder */
  @Prop({ mutable: true, reflect: true }) label: string = 'Date Picker';
  @Prop({ mutable: true, reflect: true }) labelHidden: boolean = false;
  @Prop() labelSize: '' | 'sm' | 'lg' = '';
  @Prop({ mutable: true, reflect: true }) placeholder: string = 'YYYY-MM-DD';

  /** Visual theme */
  @Prop({ mutable: true, reflect: true }) plumage: boolean = false;

  /** Prepend/append */
  @Prop({ attribute: 'prepend', mutable: true, reflect: true }) prependProp: boolean = false;
  @Prop({ mutable: true, reflect: true }) prependId: string = '';

  /** Validation */
  @Prop({ mutable: true, reflect: true }) required: boolean = false;
  @Prop({ mutable: true, reflect: true }) validation: boolean = false;
  @Prop({ mutable: true, reflect: true }) validationMessage: string = '';
  @Prop({ mutable: true, reflect: true }) warningMessage: string = '';

  /** Value (kept for API parity) */
  @Prop({ mutable: true, reflect: true }) value: string = '';

  /** NEW: configurable Bootstrap grid like other inputs */
  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** NEW: responsive column class specs (e.g., "col-sm-3 col-md-4" or "xs-12 sm-8") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  @State() selectedDate: Date | null = null;
  @State() selectedMonth: number | null = null;
  @State() selectedYear: number | null = null;

  @Prop({ mutable: true, reflect: true }) isCalendarFocused: boolean = false;

  @Event({ eventName: 'date-selected' }) dateSelected!: EventEmitter<{ formattedDate: string }>;

  /** === Watchers === */
  @Watch('dateFormat')
  onDateFormatChange() {
    if (!this.userProvidedPlaceholder) {
      this.placeholder = this.dateFormat;
    }
    this.updateInputFormat();
  }

  @Watch('placeholder')
  onPlaceholderChange() {
    this.userProvidedPlaceholder = this.host.hasAttribute('placeholder');
    if (!this.userProvidedPlaceholder) {
      this.placeholder = this.dateFormat;
    }
  }

  /** === Lifecycle === */
  componentWillLoad() {
    this.userProvidedPlaceholder = this.host.hasAttribute('placeholder');
    this.userProvidedDateFormat = this.host.hasAttribute('date-format');

    if (this.userProvidedPlaceholder && this.userProvidedDateFormat) {
      console.warn(
        '[datepicker-component] You provided both `placeholder` and `dateFormat`. ' +
          'The custom `placeholder` will be used for the input hint, and `dateFormat` will be used for parsing/formatting. ' +
          'Provide only one to silence this warning.',
      );
    }

    if (!this.userProvidedPlaceholder) {
      this.placeholder = this.dateFormat;
    }

    // Validate numeric fallbacks early (no-op if string specs used)
    this.getComputedCols();
  }

  componentDidLoad() {
    this.renderCalendar(this.currentMonth, this.currentYear);
    this.updateSelectedDateDisplay('No date selected');

    if (this.displayContextExamples) {
      this.updateInitialContext();
    }

    this.inputElement = this.qs<HTMLInputElement>('.form-control');
    this.calendarButton = this.qs<HTMLButtonElement>('.calendar-button');

    if (this.inputElement) {
      this.inputElement.addEventListener('focus', this._addFocusClass);
      this.inputElement.addEventListener('blur', this._removeFocusClass);
      this.inputElement.addEventListener('keydown', this.handleKeyDown);
      this.inputElement.placeholder = this.placeholder;
    }

    if (this.calendarButton) {
      this.calendarButton.addEventListener('focus', this._addFocusClass);
      this.calendarButton.addEventListener('blur', this._removeFocusClass);
    }

    document.addEventListener('click', this.handleOutsideClick, true);
  }

  disconnectedCallback() {
    if (this.inputElement) {
      this.inputElement.removeEventListener('focus', this._addFocusClass);
      this.inputElement.removeEventListener('blur', this._removeFocusClass);
      this.inputElement.removeEventListener('keydown', this.handleKeyDown);
    }
    if (this.calendarButton) {
      this.calendarButton.removeEventListener('focus', this._addFocusClass);
      this.calendarButton.removeEventListener('blur', this._removeFocusClass);
    }
    document.removeEventListener('click', this.handleOutsideClick, true);
    this.destroyPopper();
  }

  /** === UI helpers === */
  private _addFocusClass = () => {
    this.qs('.input-group')?.classList.add('focus');
  };
  private _removeFocusClass = () => {
    this.qs('.input-group')?.classList.remove('focus');
  };

  private handleOutsideClick = (ev: MouseEvent) => {
    const dropdown = this.qs('.dropdown');
    if (!this.preventClose && dropdown && !dropdown.contains(ev.target as Node)) {
      this.dropdownOpen = false;
      this.destroyPopper();
    }
    this.preventClose = false;
  };

  /** Only show “required” visuals when required==true AND no date is selected. */
  private showAsRequired() {
    return this.required && !this.selectedDate;
  }

  /** Layout helpers (match other components) */
  private isHorizontal() {
    return this.formLayout === 'horizontal';
  }
  private isInline() {
    return this.formLayout === 'inline';
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
      // unknown token -> ignore
    }

    return Array.from(new Set(out)).join(' ');
  }

  /** Build final col class (string spec > numeric fallback > special cases). */
  private buildColClass(kind: 'label' | 'input'): string {
    const spec = (kind === 'label' ? this.labelCols : this.inputCols)?.trim();

    if (this.isHorizontal()) {
      if (spec) return this.parseColsSpec(spec);

      if (kind === 'input' && this.labelHidden) {
        return this.inputCols ? this.parseColsSpec(this.inputCols) : 'col-12';
      }

      const num = kind === 'label' ? this.labelCol : this.inputCol;
      if (Number.isFinite(num as any)) {
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

  /** Numeric validation (used only when string specs aren’t provided). */
  private getComputedCols() {
    const DEFAULT_LABEL = 2;
    const DEFAULT_INPUT = 10;

    if (this.isHorizontal() && this.labelHidden) return { label: 0, input: 12 };

    const lbl = Number(this.labelCol);
    const inp = Number(this.inputCol);
    const label = Number.isFinite(lbl) ? Math.max(1, Math.min(11, lbl)) : DEFAULT_LABEL;
    const input = Number.isFinite(inp) ? Math.max(1, Math.min(11, inp)) : DEFAULT_INPUT;

    if (this.isHorizontal() && !this.labelCols && !this.inputCols && label + input !== 12) {
      console.error(
        '[datepicker-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  private toggleDropdown = () => {
    this.preventClose = true;
    this.dropdownOpen = !this.dropdownOpen;

    if (this.dropdownOpen) {
      const inputVal = (this.inputElement?.value || '').trim();
      if (!inputVal) {
        this.clearInputField(true /* preserveValidation */, false /* markInvalid */);
        this.updateSelectedDateDisplay(null as any);
      } else {
        const parsed = this.parseDate(inputVal);
        if (parsed && !isNaN(parsed.getTime())) {
          this.updateCalendarWithParsedDate(parsed);
          this.updateSelectedDateDisplay(parsed);
        } else {
          this.updateSelectedDateDisplay(null as any);
        }
      }
      this.createPopperInstance();
    } else {
      this.destroyPopper();
    }
  };

  private createPopperInstance() {
    const dropdown = this.qs<HTMLElement>('.dropdown');
    if (!this.inputElement || !dropdown) return;
    this.popperInstance = createPopper(this.inputElement, dropdown, {
      placement: 'bottom-start',
      modifiers: [
        { name: 'offset,', options: { offset: [0, 4] } } as any, // keep config shape; TypeScript sometimes fusses in Stencil envs
        { name: 'preventOverflow', options: { boundary: 'viewport' } },
      ],
    });
  }
  private destroyPopper() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  /** === Input parsing/formatting === */
  private handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const inputValue = input.value.trim();
    let cursor = input.selectionStart ?? inputValue.length;

    let raw = inputValue.replace(/[^0-9]/g, '');
    let formatted = '';

    const isYMD = this.dateFormat === 'YYYY-MM-DD';
    if (isYMD) {
      if (raw.length <= 4) formatted = raw;
      else if (raw.length <= 6) formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
      else formatted = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
    } else {
      if (raw.length <= 2) formatted = raw;
      else if (raw.length <= 4) formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
      else formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4, 8)}`;
    }

    input.value = formatted;
    let newCursor = cursor;
    if (formatted.length > inputValue.length) newCursor++;
    else if (formatted.length < inputValue.length) newCursor--;
    input.setSelectionRange(newCursor, newCursor);

    if (formatted === '') {
      this.clearInputField(false /* preserveValidation */, true /* markInvalid */);
      return;
    }

    this.validateInput(formatted);
  };

  private handleInputBlur = (e: Event) => {
    const val = (e.target as HTMLInputElement).value.trim();
    if (!val) {
      this.clearInputField(false /* preserveValidation */, true /* markInvalid */);
      return;
    }
    this.validateInput(val);
    if (this.validation) return;

    const parsed = this.parseDate(val);
    if (parsed) {
      const formatted = this.formatDate(parsed);
      this.updateInputField(formatted);
      this.updateSelectedDateDisplay(parsed);
      this.selectedDate = parsed;

      this.validation = false;
      this.validationMessage = '';
      this.warningMessage = '';

      this.renderCalendar(this.currentMonth, this.currentYear);
    }
  };

  private parseDate(input: string): Date | null {
    if (this.dateFormat === 'YYYY-MM-DD') {
      const parts = input.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d) && parts[0].length === 4 && m >= 0 && m < 12 && d > 0 && d <= 31) {
          return new Date(y, m, d);
        }
      }
    } else {
      const parts = input.split('-');
      if (parts.length === 3) {
        const m = parseInt(parts[0], 10) - 1;
        const d = parseInt(parts[1], 10);
        const y = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d) && parts[2].length === 4 && m >= 0 && m < 12 && d > 0 && d <= 31) {
          return new Date(y, m, d);
        }
      }
    }
    return null;
  }

  private updateInputField = (val: string) => {
    const input = this.qs<HTMLInputElement>('input.form-control');
    if (input) input.value = val;
  };

  private updateInputFormat() {
    if (this.selectedDate) {
      const fmt = this.getDateFormatMethod(this.dateFormat).call(this, this.selectedDate);
      this.updateInputField(fmt);
      this.updateSelectedDateDisplay(this.formatDateLong(this.selectedDate));
    }
    if (!this.userProvidedPlaceholder) {
      this.placeholder = this.dateFormat;
    }
  }

  private getDateFormatMethod(format: string) {
    switch (format) {
      case 'YYYY-MM-DD':
        return this.formatDateYmd;
      case 'MM-DD-YYYY':
        return this.formatDateMdy;
      default:
        return this.formatDateYmd;
    }
  }
  private formatDate(dateOrYear: Date | number, month?: number | null, day?: number | null): string {
    if (month != null && day != null) {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
      const d = new Date(Date.UTC(Number(dateOrYear), month - 1, day));
      return d.toLocaleDateString(undefined, options);
    }
    const d = dateOrYear instanceof Date ? dateOrYear : new Date(dateOrYear);
    return this.dateFormat === 'MM-DD-YYYY' ? this.formatDateMdy(d) : this.formatDateYmd(d);
  }
  private formatDateForAriaLabel(date: Date | string, isCurrent = false): string {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d as any)) return 'Invalid Date';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
    const s = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toLocaleDateString('en-US', options);
    return isCurrent ? `${s} (Today)` : s;
  }
  private formatDateYmd = (d: Date) => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  private formatDateMdy = (d: Date) => {
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const y = d.getUTCFullYear();
    return `${m}-${day}-${y}`;
  };
  private formatDateLong = (d: Date | string) => {
    const date = d instanceof Date ? d : new Date(d);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options);
  };
  private formatISODate = (d: Date | string) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString();
  };

  private updateSelectedDateDisplay = (date: Date | string | null) => {
    const el = this.qs<HTMLElement>('.selected-date bdi');
    if (!el) return;
    if (!date) {
      el.textContent = 'No date selected';
      return;
    }
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!(d instanceof Date) || isNaN(d.getTime())) {
      el.textContent = 'No date selected';
      return;
    }
    el.textContent = this.formatDateLong(d);
  };

  private updateSelectedDateElements = (formattedDate: string) => {
    if (!this.displayContextExamples) return;
    const d = new Date(formattedDate);
    const selectedYmd = this.formatDateYmd(d);
    const selectedMdy = this.formatDateMdy(d);
    const selectedLong = this.formatDateLong(d);
    const selectedIso = this.formatISODate(d);

    const elY = this.qs<HTMLElement>('.selected-date-Ymd');
    if (elY) elY.textContent = selectedYmd;
    const elM = this.qs<HTMLElement>('.selected-date-Mdy');
    if (elM) elM.textContent = selectedMdy;
    const elF = this.qs<HTMLElement>('.selected-formatted-date');
    if (elF) elF.textContent = selectedLong;
    const elI = this.qs<HTMLElement>('.selected-formatted-iso');
    if (elI) elI.textContent = selectedIso;

    this.updateSelectedDateDisplay(d);
  };

  private updateActiveDateElements = () => {
    if (!this.displayContextExamples) return;
    const focusedSpan = this.qs<HTMLElement>('.calendar-grid-item span.focus');
    const ymd = this.qs<HTMLElement>('.active-date-ymd');
    const mdy = this.qs<HTMLElement>('.active-date-mdy');
    const longEl = this.qs<HTMLElement>('.active-formatted-date-long');
    const iso = this.qs<HTMLElement>('.active-formatted-iso');
    if (!ymd || !mdy || !longEl || !iso) return;

    if (focusedSpan) {
      const dataDate = (focusedSpan.parentElement as HTMLElement).getAttribute('data-date')!;
      const date = new Date(`${dataDate}T00:00:00Z`);
      ymd.textContent = this.formatDateYmd(date);
      mdy.textContent = this.formatDateMdy(date);
      longEl.textContent = this.formatDateLong(date);
      iso.textContent = this.formatISODate(date);
    } else {
      ymd.textContent = 'Date not selected';
      mdy.textContent = 'Date not selected';
      longEl.textContent = 'Date not selected';
      iso.textContent = 'Date not selected';
    }
  };

  /** === Calendar interactions === */
  private handleDayClick = (ev: Event) => {
    const clickedSpan = ev.target as HTMLElement;
    const container = clickedSpan.parentElement as HTMLElement;

    const isPrev = container.classList.contains('previous-month-day');
    const isNext = container.classList.contains('next-month-day');
    const isActive = clickedSpan.classList.contains('active');

    let formattedDate = '';

    if (!isActive) {
      this.clearActiveState();

      clickedSpan.classList.add('active', 'btn-primary', 'focus');

      const idTarget = this.qs<HTMLElement>(`#cell-${container.dataset.date}`);
      if (idTarget) {
        const prevAria = idTarget.getAttribute('aria-label') || '';
        idTarget.setAttribute('aria-label', `${prevAria} (Selected)`);
        idTarget.setAttribute('aria-selected', 'true');
        idTarget.setAttribute('aria-current', 'date');
      }

      this.selectedMonth = parseInt(container.dataset.month!, 10);
      this.selectedYear = parseInt(container.dataset.year!, 10);
      const selectedDay = parseInt(clickedSpan.textContent || '1', 10);

      this.selectedDate = new Date(this.selectedYear, (this.selectedMonth as number) - 1, selectedDay);
      if (isNaN(this.selectedDate.getTime())) return;

      const long = this.formatDateLong(this.selectedDate);
      const inputFmt = this.getDateFormatMethod(this.dateFormat).call(this, this.selectedDate);

      this.updateInputField(inputFmt);
      this.updateSelectedDateDisplay(long);
      this.updateSelectedDateElements(long);
      this.updateActiveDateElements();
      this.updateSelectedDateElements(long);

      this.validation = false;
      this.validationMessage = '';
      this.warningMessage = '';

      this.qs('.calendar')?.classList.add('focus');
      this.isCalendarFocused = true;

      formattedDate = `${this.selectedDate.getFullYear()}-${String(this.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(this.selectedDate.getDate()).padStart(2, '0')}`;
      this.qs<HTMLElement>('.calendar')?.setAttribute('aria-activedescendant', `cell-${formattedDate}`);

      this.dateSelected.emit({ formattedDate: long });
    }

    if (isActive) return;

    if (isPrev || isNext) {
      this.currentMonth += isNext ? 1 : -1;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.renderCalendar(this.currentMonth, this.currentYear);

      this.selectedDate = new Date(this.currentYear, this.currentMonth, parseInt(clickedSpan.textContent || '1', 10));
      formattedDate = `${this.selectedDate.getFullYear()}-${String(this.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(this.selectedDate.getDate()).padStart(2, '0')}`;
    }

    const newFocusCell = this.qs<HTMLElement>(`.calendar-grid-item[data-date="${formattedDate}"]`);
    newFocusCell?.querySelector('span')?.focus();

    this.setActiveState();
  };

  private setActiveState() {
    const activeSpan = this.qs('.active');
    if (activeSpan) {
      (activeSpan as HTMLElement).classList.remove('active', 'btn-primary', 'focus');
      (activeSpan as HTMLElement).classList.add('btn-outline-light', 'text-dark');
    }
    if (this.selectedDate) {
      const id = `cell-${this.selectedDate.getUTCFullYear()}-${String(this.selectedDate.getUTCMonth() + 1).padStart(2, '0')}-${String(this.selectedDate.getUTCDate()).padStart(
        2,
        '0',
      )}`;
      const el = this.qs<HTMLElement>(`#${(window as any).CSS?.escape ? (window as any).CSS.escape(id) : id}`);
      if (el) {
        const span = el.querySelector('span')!;
        span.classList.add('active', 'btn-primary', 'focus');
        span.classList.remove('btn-outline-light', 'text-dark');
      }
    }
  }

  private clearActiveState() {
    this.qsa<HTMLElement>('.calendar-grid-item span').forEach(span => {
      span.classList.remove('active', 'btn-primary', 'focus');
      span.classList.add('btn-outline-light', 'text-dark');
      const parent = span.parentElement as HTMLElement;
      const dateEl = this.qs<HTMLElement>(`#cell-${parent.dataset.date}`);
      if (dateEl) {
        const prev = dateEl.getAttribute('aria-label') || '';
        if (prev.endsWith(' (Selected)')) {
          dateEl.setAttribute('aria-label', prev.slice(0, -11));
          dateEl.removeAttribute('aria-selected');
          dateEl.removeAttribute('aria-current');
        }
      }
    });
  }

  private renderCalendar(month0b: number, year: number) {
    const grid = this.qs<HTMLElement>('.calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const displayMonth = month0b + 1;
    const previousMonthLastDate = new Date(Date.UTC(year, month0b, 0)).getUTCDate();
    const firstDay = this.getFirstDayOfMonth(year, month0b);
    const daysInMonth = new Date(Date.UTC(year, month0b + 1, 0)).getUTCDate();
    const firstDayOfWeek = firstDay === 0 ? 0 : firstDay;
    let date = 1;
    const totalWeeks = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

    const formattedMonthYear = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(new Date(year, month0b, 1));
    const cap = this.qs<HTMLElement>('#__CDID__calendar-grid-caption_');
    if (cap) cap.textContent = formattedMonthYear;

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };

    for (let i = 0; i < totalWeeks; i++) {
      for (let j = 0; j < 7; j++) {
        const item = document.createElement('div');
        item.classList.add('calendar-grid-item');
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '-1');

        const currentDate = new Date(Date.UTC(year, month0b, date));
        const today = new Date();
        item.dataset.month = String(displayMonth);
        item.dataset.year = String(currentDate.getUTCFullYear());
        item.dataset.day = String(currentDate.getUTCDate());

        const dataDate = `${year}-${String(displayMonth).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        item.dataset.date = dataDate;
        item.id = `cell-${dataDate}`;

        const isCurrentDay = today.getUTCDate() === date && today.getUTCMonth() === month0b && today.getUTCFullYear() === year;
        const isSelectedDay =
          this.selectedDate && this.selectedDate.getUTCDate() === date && this.selectedDate.getUTCMonth() === month0b && this.selectedDate.getUTCFullYear() === year;

        const span = document.createElement('span');
        span.classList.add('btn', 'btn-outline-light', 'border-0', 'rounded-circle', 'text-nowrap', 'text-dark', 'font-weight-bold');

        if (i === 0 && j < firstDayOfWeek && firstDayOfWeek > 0) {
          const prevMonthDay = previousMonthLastDate - firstDayOfWeek + j + 1;
          span.textContent = String(prevMonthDay);
          item.classList.add('previous-month-day');
          span.classList.add('text-muted');
          span.classList.remove('text-dark', 'font-weight-bold');

          const prevMonth = month0b === 0 ? 11 : month0b - 1;
          const prevYear = month0b === 0 ? year - 1 : year;
          item.dataset.month = String(prevMonth + 1);
          item.dataset.year = String(prevYear);
          item.dataset.day = String(prevMonthDay);
          const prevDataDate = `${item.dataset.year}-${String(Number(item.dataset.month)).padStart(2, '0')}-${String(prevMonthDay).padStart(2, '0')}`;
          item.dataset.date = prevDataDate;
          item.id = `cell-${prevDataDate}`;
          const formattedDate = new Date(Date.UTC(Number(item.dataset.year), Number(item.dataset.month) - 1, Number(item.dataset.day))).toLocaleDateString('en-US', options);
          item.setAttribute('aria-label', formattedDate);
        } else if (date <= daysInMonth) {
          span.textContent = String(date);
          item.dataset.month = String(displayMonth);
          item.dataset.year = String(year);
          item.dataset.day = String(date);

          const formattedDate = currentDate.toLocaleDateString('en-US', options);

          if (isCurrentDay) {
            span.classList.add('current-day');
            item.setAttribute('aria-label', this.formatDateForAriaLabel(currentDate, true));
          } else {
            item.setAttribute('aria-label', formattedDate);
          }

          if (isSelectedDay) {
            span.classList.add('active', 'btn-primary', 'focus');
            span.classList.remove('btn-outline-light', 'text-dark');
            const existing = item.getAttribute('aria-label') || '';
            item.setAttribute('aria-label', `${existing} (Selected)`);
            this.updateSelectedDateDisplay(this.formatDate(year, displayMonth, date));
            this.updateActiveDateElements();
          }

          date++;
        } else {
          const nextMonthDay = date - daysInMonth;
          span.textContent = String(nextMonthDay);
          item.classList.add('next-month-day');
          span.classList.add('text-muted');
          span.classList.remove('text-dark', 'font-weight-bold');

          item.dataset.month = String((month0b === 11 ? 0 : month0b + 1) + 1);
          item.dataset.year = String(month0b === 11 ? year + 1 : year);
          item.dataset.day = String(nextMonthDay);
          const nextDataDate = `${item.dataset.year}-${String(Number(item.dataset.month)).padStart(2, '0')}-${String(nextMonthDay).padStart(2, '0')}`;
          item.dataset.date = nextDataDate;
          const formattedDate = new Date(Date.UTC(Number(item.dataset.year), Number(item.dataset.month) - 1, Number(item.dataset.day))).toLocaleDateString('en-US', options);
          item.setAttribute('aria-label', formattedDate);
          item.id = `cell-${nextDataDate}`;
          date++;
        }

        item.appendChild(span);

        item.addEventListener('focus', () => {
          span.classList.add('focus');
          this.qs('.calendar')?.classList.add('focus');
        });

        span.addEventListener('click', this.handleDayClick);
        span.addEventListener('keydown', this.handleEnterKeyPress);

        grid.appendChild(item);
      }
    }
    this.setActiveState();
  }

  private getFirstDayOfMonth(year: number, month: number) {
    return new Date(Date.UTC(year, month, 1)).getUTCDay();
  }

  private handleEnterKeyPress = (e: KeyboardEvent) => {
    e.stopPropagation();
    const focusedSpan = this.qs<HTMLElement>('.calendar-grid-item span.focus');
    if (focusedSpan) {
      const dayContainer = focusedSpan.parentElement as HTMLElement;
      const isPrev = dayContainer.classList.contains('previous-month-day');
      const isNext = dayContainer.classList.contains('next-month-day');
      const isActive = focusedSpan.classList.contains('active');

      if (isActive && !isPrev && !isNext) return;
      this.handleDayClick({ target: focusedSpan } as any);
      this.toggleDropdown();
    }
  };

  /** Input field keyboard handler (clears with Backspace). Real grid nav is in handleCalendarKeyDown. */
  private handleKeyDown = (event: KeyboardEvent) => {
    const inputField = this.qs<HTMLInputElement>('input.form-control');

    if (event.key === 'Backspace') {
      if ((inputField?.value.trim() || '') === '') {
        this.clearInputField(false /* preserveValidation */, true /* markInvalid */);
        return;
      }
    }

    if (event.key === 'Enter' || event.key === ' ') {
      this.handleEnterKeyPress(event);
    }
  };

  /** Calendar grid keyboard navigation (arrow keys) */
  private handleCalendarKeyDown = (event: KeyboardEvent) => {
    const grid = this.qs<HTMLElement>('.calendar-grid');
    if (!grid) return;

    const currentFocus = (this.host.shadowRoot ? this.host.shadowRoot.activeElement : document.activeElement) as HTMLElement | null;
    if (!currentFocus || !grid.contains(currentFocus)) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleEnterKeyPress(event);
      return;
    }

    if (!event.key.startsWith('Arrow')) return;
    event.preventDefault();

    let cells = Array.from(this.qsa<HTMLElement>('.calendar-grid-item'));
    const index = cells.indexOf(currentFocus);
    if (index === -1) return;

    let newIndex = index;
    if (event.key === 'ArrowUp') {
      if (index < 7) {
        this.prevMonth();
        cells = Array.from(this.qsa<HTMLElement>('.calendar-grid-item'));
        newIndex = cells.length - 7 + index;
      } else newIndex = index - 7;
    } else if (event.key === 'ArrowDown') {
      if (index >= cells.length - 7) {
        this.nextMonth();
        cells = Array.from(this.qsa<HTMLElement>('.calendar-grid-item'));
        newIndex = index % 7;
      } else newIndex = index + 7;
    } else if (event.key === 'ArrowLeft') {
      newIndex = index - 1;
      if (newIndex < 0) {
        this.prevMonth();
        cells = Array.from(this.qsa<HTMLElement>('.calendar-grid-item'));
        newIndex = cells.length - 1;
      }
    } else if (event.key === 'ArrowRight') {
      newIndex = index + 1;
      if (newIndex >= cells.length) {
        this.nextMonth();
        cells = Array.from(this.qsa<HTMLElement>('.calendar-grid-item'));
        newIndex = 0;
      }
    }

    const targetCell = cells[newIndex];
    const targetSpan = targetCell.querySelector('span')!;
    this.qs<HTMLElement>('.calendar-grid-item span.focus')?.classList.remove('focus');
    targetSpan.classList.add('focus');
    targetCell.focus();
    this.updateActiveDateElements();
  };

  /** Nav button handlers */
  private prevMonth = () => {
    this.preventClose = true;
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderCalendar(this.currentMonth, this.currentYear);
  };
  private nextMonth = () => {
    this.preventClose = true;
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderCalendar(this.currentMonth, this.currentYear);
  };
  private prevYear = () => {
    this.preventClose = true;
    this.currentYear--;
    this.renderCalendar(this.currentMonth, this.currentYear);
  };
  private nextYear = () => {
    this.preventClose = true;
    this.currentYear++;
    this.renderCalendar(this.currentMonth, this.currentYear);
  };
  private currentDate = () => {
    const today = new Date();
    this.selectedDate = today;
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.renderCalendar(this.currentMonth, this.currentYear);
    const formatted = this.formatDate(today);
    this.updateInputField(formatted);
    this.updateSelectedDateDisplay(formatted);
    this.setActiveState();

    this.validation = false;
    this.validationMessage = '';
    this.warningMessage = '';
  };

  private updateInitialContext() {
    if (!this.displayContextExamples) return;
    const today = new Date();
    const a = this.qs<HTMLElement>('.active-date-ymd');
    if (a) a.textContent = this.formatDateYmd(today);
    const b = this.qs<HTMLElement>('.active-date-mdy');
    if (b) b.textContent = this.formatDateMdy(today);
    const c = this.qs<HTMLElement>('.active-formatted-date-long');
    if (c) c.textContent = this.formatDateLong(today);
    const d = this.qs<HTMLElement>('.active-formatted-iso');
    if (d) d.textContent = this.formatISODate(today);
  }

  private handleInteraction = (ev: Event) => {
    ev.stopPropagation();
    const bFocusDiv = this.qs<HTMLElement>('.b-focus');
    const isInput = ev.target === this.qs('input');
    const isBtn = ev.target === this.qs('.calendar-button');
    if (bFocusDiv) {
      if (isInput || isBtn) {
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      } else {
        bFocusDiv.style.width = '0';
        bFocusDiv.style.left = '50%';
      }
    }
  };
  private handleDocClickPlumage = () => {
    const bFocusDiv = this.qs<HTMLElement>('.b-focus');
    if (bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  private clearInputField = (preserveValidation: boolean = false, markInvalid: boolean = false) => {
    this.selectedDate = null;
    this.updateInputField('');
    this.updateSelectedDateDisplay('No date selected' as any);
    const now = new Date();
    this.currentMonth = now.getMonth();
    this.currentYear = now.getFullYear();
    this.renderCalendar(this.currentMonth, this.currentYear);

    if (markInvalid) {
      this.validation = true;
      if (!this.validationMessage) {
        this.validationMessage = 'Please select a date.';
      }
      this.warningMessage = '';
      return;
    }

    if (!preserveValidation) {
      this.validation = false;
      this.validationMessage = '';
      this.warningMessage = '';
    }
  };

  private updateCalendarWithParsedDate(date: Date) {
    if (!date || isNaN(date.getTime())) {
      this.clearInputField(false, true);
      return;
    }
    this.selectedDate = date;
    this.currentMonth = date.getMonth();
    this.currentYear = date.getFullYear();
    this.renderCalendar(this.currentMonth, this.currentYear);
    const formatted = this.formatDate(date);
    if (formatted !== 'Invalid Date') {
      this.updateInputField(formatted);
      this.updateSelectedDateDisplay(formatted);
    }

    this.validation = false;
    this.validationMessage = '';
    this.warningMessage = '';

    this.setActiveState();
  }

  private validateInput(value: string) {
    if (value.trim() === '') {
      this.validation = true;
      if (!this.validationMessage) this.validationMessage = 'Please select a date.';
      return;
    }

    this.validationMessage = '';
    this.validation = false;

    const trigger = (msg: string) => {
      this.validation = true;
      this.validationMessage = msg;
    };

    let parts: string[], y: string | null, m: number | null, d: number | null;

    if (this.dateFormat === 'YYYY-MM-DD') {
      parts = value.split('-');
      y = parts[0] || null;
      m = parts[1] ? parseInt(parts[1], 10) : null;
      d = parts[2] ? parseInt(parts[2], 10) : null;

      if (y === null || y.length < 4 || isNaN(parseInt(y, 10)) || parseInt(y, 10) < 1900) {
        trigger('Year is required, must be 4 digits, and must be greater than or equal to 1900.');
        return;
      }
      if (m === null || isNaN(m) || m < 1 || m > 12) {
        trigger('Month is required and must be between 01 and 12.');
        return;
      }
      if (d === null || isNaN(d) || d < 1 || d > 31) {
        trigger('Day is required and must be between 01 and 31.');
        return;
      }
    } else {
      parts = value.split('-');
      m = parts[0] ? parseInt(parts[0], 10) : null;
      d = parts[1] ? parseInt(parts[1], 10) : null;
      y = parts[2] || null;

      if (m === null || isNaN(m) || m < 1 || m > 12) {
        trigger('Month is required and must be between 01 and 12.');
        return;
      }
      if (d === null || isNaN(d) || d < 1 || d > 31) {
        trigger('Day is required and must be between 01 and 31.');
        return;
      }
      if (y === null || y.length < 4 || isNaN(parseInt(y, 10)) || parseInt(y, 10) < 1900) {
        trigger('Year is required, must be 4 digits, and must be greater than or equal to 1900.');
        return;
      }
    }

    this.validation = false;
    this.validationMessage = '';
  }

  /** === Views === */
  private renderDatePickerView() {
    return (
      <div class="date-picker">
        <div class={`dp-single-calendar${this.plumage ? ' plumage' : ''}`} aria-label={'Date Picker'} role="region">
          <div class="calendar-inner" dir="ltr" lang="en-US" role="group" aria-describedby="calendar-wrapper">
            <header class="datepicker" title="Selected Date">
              <output aria-live="polite" aria-atomic="true" class="selected-date form-control form-control-sm text-center" id="selected-date" role="status" tabIndex={-1}>
                <bdi>No date selected</bdi>
                <bdi class="sr-only">(Selected date)</bdi>
              </output>
            </header>

            <div class="calendar-nav d-flex" aria-label="Calendar Navigation" role="group" aria-labelledby="calendar-navigation">
              <span id="calendar-navigation" class="sr-only">
                Calendar Navigation
              </span>

              <button
                aria-label="Previous year"
                aria-keyshortcuts="Alt+PageDown"
                class="prev-year btn btn-sm border-0 flex-fill btn-outline-secondary"
                title="Previous year"
                type="button"
                onClick={this.prevYear}
              >
                <i class="fas fa-angle-double-left" aria-hidden="true" />
              </button>
              <button
                aria-label="Previous month"
                aria-keyshortcuts="PageDown"
                class="prev-month btn btn-sm border-0 flex-fill btn-outline-secondary"
                title="Previous month"
                type="button"
                onClick={this.prevMonth}
              >
                <i class="fas fa-angle-left" aria-hidden="true" />
              </button>
              <button
                aria-label="Current Day/Month/Year"
                aria-keyshortcuts="Home"
                class="current-date btn btn-sm border-0 flex-fill btn-outline-secondary"
                title="Current Day/Month/Year"
                type="button"
                onClick={this.currentDate}
              >
                <i class="fas fa-circle" aria-hidden="true" />
                <span class="sr-only">Today</span>
              </button>
              <button
                aria-label="Next month"
                aria-keyshortcuts="PageUp"
                class="next-month btn btn-sm border-0 flex-fill btn-outline-secondary"
                title="Next month"
                type="button"
                onClick={this.nextMonth}
              >
                <i class="fas fa-angle-right" aria-hidden="true" />
              </button>
              <button
                title="Next year"
                type="button"
                class="next-year btn btn-sm border-0 flex-fill btn-outline-secondary"
                aria-label="Next year"
                aria-keyshortcuts="Alt+PageUp"
                onClick={this.nextYear}
              >
                <i class="fas fa-angle-double-right" aria-hidden="true" />
              </button>
            </div>

            <div
              aria-describedby="calendar-grid"
              aria-labelledby="calendar-grid-caption"
              aria-roledescription="Calendar"
              class="calendar form-control h-auto text-center pt-2"
              role="region"
              aria-label="Calendar"
              tabIndex={0}
              onFocus={() => this.handleCalendarFocus()}
              onFocusout={(e: FocusEvent) => this.handleCalendarFocusOut(e)}
              onKeyDown={this.handleCalendarKeyDown}
            >
              <div aria-live="polite" aria-atomic="true" class="calendar-grid-caption text-center font-weight-bold" id="__CDID__calendar-grid-caption_" />
              <div aria-hidden="true" class="calendar-grid-weekdays">
                <small aria-label="Sunday" title="Sunday" class={`calendar-grid-day col${this.plumage ? ' text-truncate' : ''}`}>
                  Sun
                </small>
                <small aria-label="Monday" title="Monday" class={`calendar-grid-day col${this.plumage ? ' text-truncate' : ''}`}>
                  Mon
                </small>
                <small aria-label="Tuesday" title="Tuesday" class={`calendar-grid-day col${this.plumage ? ' text-truncate' : ''}`}>
                  Tue
                </small>
                <small aria-label="Wednesday" title="Wednesday" class={`calendar-grid-day col${this.plumage ? ' text-truncate' : ''}`}>
                  Wed
                </small>
                <small aria-label="Thursday" title="Thursday" class={`calendar-grid-day col${this.plumage ? ' text-truncate' : ''}`}>
                  Thu
                </small>
                <small aria-label="Friday" title="Friday" class={`calendar-grid-day col${this.plumage ? ' text-truncate' : ''}`}>
                  Fri
                </small>
                <small aria-label="Saturday" title="Saturday" class={`calendar-grid-day col${this.plumage ? ' text-truncate' : ''}`}>
                  Sat
                </small>
              </div>
              <div class="calendar-grid" id="calendar-grid" />
              <footer class="border-top small text-muted text-center bg-light" tabIndex={0}>
                <div class="small">Use cursor keys to navigate calendar dates</div>
              </footer>
            </div>
          </div>

          {this.displayContextExamples ? (
            <div class="context" role="region" aria-labelledby="context-title" tabIndex={0}>
              <div id="context-title">Context:</div>
              <div>
                selectedYMD: "<span class="selected-date-Ymd">Date not selected</span>"
              </div>
              <div>
                selectedMDY: "<span class="selected-date-Mdy">Date not selected</span>"
              </div>
              <div>
                selectedFormatted: "<span class="selected-formatted-date">Date not selected</span>"
              </div>
              <div>
                selectedIsoFormatted: "<span class="selected-formatted-iso">Date not selected</span>"
              </div>
              <div>
                activeYMD: "<span class="active-date-ymd"></span>"
              </div>
              <div>
                activeMDY: "<span class="active-date-mdy"></span>"
              </div>
              <div>
                activeFormatted: "<span class="active-formatted-date-long"></span>"
              </div>
              <div>
                activeIsoFormatted: "<span class="active-formatted-iso"></span>"
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  /* == RENDER helpers for label/input layout (classic & plumage) == */

  private labelClassBase() {
    return ['form-control-label', this.showAsRequired() ? 'required' : '', this.labelHidden ? 'sr-only' : '', this.validation ? 'invalid' : ''].filter(Boolean).join(' ');
  }

  private labelClassHorizontal(labelColClass: string) {
    return [this.labelClassBase(), labelColClass, 'no-padding', `col-form-label${this.labelSize === 'sm' ? '-sm' : this.labelSize === 'lg' ? '-lg' : ''}`].filter(Boolean).join(' ');
  }

  private groupSizeClass() {
    return this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
  }

  private renderAppend() {
    return (
      <button
        onClick={this.toggleDropdown}
        class={`calendar-button btn input-group-text${this.validation ? ' is-invalid' : ''}`}
        aria-label="Toggle Calendar Picker"
        aria-haspopup="dialog"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        disabled={this.disabled}
      >
        <i class={this.icon} />
      </button>
    );
  }

  private renderPrepend() {
    return (
      <button
        onClick={this.toggleDropdown}
        class={`calendar-button btn input-group-text${this.validation ? ' is-invalid' : ''}`}
        aria-label="Toggle Calendar Picker"
        aria-haspopup="dialog"
        aria-expanded={this.dropdownOpen ? 'true' : 'false'}
        disabled={this.disabled}
      >
        <i class={this.icon} />
      </button>
    );
  }

  private renderInputGroupClassic() {
    const isRow = this.isHorizontal() || this.isInline();

    // Compute col classes
    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    // Validate numeric fallbacks if needed (no-op when string specs provided)
    this.getComputedCols();

    return (
      <Fragment>
        <div class={['form-group', 'form-input-group-basic', this.formLayout || '', isRow ? 'row' : ''].filter(Boolean).join(' ')}>
          {/* Label */}
          {this.labelHidden ? null : (
            <label class={this.isHorizontal() ? this.labelClassHorizontal(labelColClass) : this.labelClassBase()} htmlFor={this.inputId} aria-hidden="true">
              <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
              {this.required ? <span class="required">*</span> : null}
            </label>
          )}

          {/* Input column */}
          <div class={this.isHorizontal() ? inputColClass : undefined}>
            <div class={['input-group', this.groupSizeClass(), this.validation ? 'is-invalid' : ''].filter(Boolean).join(' ')} role="group" aria-label="Date Picker Group">
              {this.prependProp ? this.renderPrepend() : null}

              <div class="drp-input-field">
                <input
                  id={this.inputId}
                  type="text"
                  class={`form-control${this.validation ? ' is-invalid' : ''}`}
                  placeholder={this.placeholder}
                  value={this.selectedDate ? this.formatDate(this.selectedDate) : ''}
                  onInput={this.handleInputChange}
                  onBlur={this.handleInputBlur}
                  disabled={this.disabled}
                  aria-label="Selected Date"
                  aria-describedby="datepicker-desc"
                />
                {this.selectedDate ? (
                  <button
                    onClick={() => this.clearInputField(false, true)}
                    class={`clear-input-button${this.validation ? ' is-invalid' : ''}`}
                    aria-label="Clear Field"
                    role="button"
                  >
                    <i class="fas fa-times-circle" />
                  </button>
                ) : null}
              </div>

              {this.appendProp ? this.renderAppend() : null}
            </div>

            {this.validation ? (
              this.warningMessage ? (
                <div class="invalid-feedback warning">{this.warningMessage}</div>
              ) : (
                <div class="invalid-feedback validation">{this.validationMessage}</div>
              )
            ) : null}
          </div>
        </div>
      </Fragment>
    );
  }

  private renderInputGroupPlumage() {
    const isRow = this.isHorizontal() || this.isInline();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    this.getComputedCols();

    return (
      <div class={['plumage', this.formLayout ? this.formLayout : ''].filter(Boolean).join(' ')}>
        <div class={['form-group', 'form-input-group', this.formLayout || '', isRow ? 'row' : ''].filter(Boolean).join(' ')}>
          {/* Label */}
          {this.labelHidden ? null : (
            <label class={this.isHorizontal() ? this.labelClassHorizontal(labelColClass) : this.labelClassBase()} htmlFor={this.inputId} aria-hidden="true">
              <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
              {this.required ? <span class="required">*</span> : null}
            </label>
          )}

          {/* Input column */}
          <div class={this.isHorizontal() ? inputColClass : undefined}>
            <div class={['input-group', this.groupSizeClass(), this.disabled ? 'disabled' : ''].filter(Boolean).join(' ')} role="group" aria-label="Date Picker Group">
              {this.prependProp ? (
                <button
                  onClick={this.toggleDropdown}
                  class={`calendar-button btn input-group-text${this.validation ? ' is-invalid' : ''}`}
                  aria-label="Toggle Calendar Picker"
                  aria-haspopup="dialog"
                  aria-expanded={this.dropdownOpen ? 'true' : 'false'}
                  disabled={this.disabled}
                  onFocus={this.handleInteraction}
                  onBlur={this.handleDocClickPlumage}
                >
                  <i class={this.icon} />
                </button>
              ) : null}

              <div class="drp-input-field">
                <input
                  id={this.inputId}
                  type="text"
                  class={`form-control${this.validation ? ' is-invalid' : ''}`}
                  placeholder={this.placeholder}
                  value={this.selectedDate ? this.formatDate(this.selectedDate) : ''}
                  onFocus={this.handleInteraction}
                  onBlur={this.handleDocClickPlumage}
                  onInput={this.handleInputChange}
                  name="selectedDate"
                  aria-label="Selected Date"
                  aria-describedby={this.validation ? 'validationMessage' : 'datepicker-desc'}
                  disabled={this.disabled}
                />
                {this.selectedDate ? (
                  <button onClick={() => this.clearInputField(false, true)} class="clear-input-button" aria-label="Clear Field" role="button">
                    <i class="fas fa-times-circle" />
                  </button>
                ) : null}
              </div>

              {this.appendProp ? (
                <button
                  onClick={this.toggleDropdown}
                  class={`calendar-button btn input-group-text${this.validation ? ' is-invalid' : ''}`}
                  aria-label="Toggle Calendar Picker"
                  aria-haspopup="dialog"
                  aria-expanded={this.dropdownOpen ? 'true' : 'false'}
                  disabled={this.disabled}
                  onFocus={this.handleInteraction}
                  onBlur={this.handleDocClickPlumage}
                >
                  <i class={this.icon} />
                </button>
              ) : null}
            </div>

            <div class={`b-underline${this.validation ? ' invalid' : ''}`} role="presentation">
              <div class={`b-focus${this.disabled ? ' disabled' : ''}${this.validation ? ' invalid' : ''}`} role="presentation" aria-hidden="true"></div>
            </div>

            {this.validation ? (
              this.warningMessage ? (
                <div class="invalid-feedback warning">{this.warningMessage}</div>
              ) : (
                <div class="invalid-feedback validation">{this.validationMessage}</div>
              )
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  private renderInputs() {
    return (
      <div class="date-picker">
        <div class="dropdown-wrapper">
          {this.plumage ? this.renderInputGroupPlumage() : this.renderInputGroupClassic()}
          {this.renderDropdown()}
        </div>
      </div>
    );
  }

  private renderDropdown() {
    return (
      <div class={`dropdown${this.dropdownOpen ? ' open' : ''}`}>
        <div class="dropdown-content" role="dialog" aria-modal={true as any} aria-labelledby="datepicker-desc">
          {this.renderDatePickerView()}
        </div>
      </div>
    );
  }

  private handleCalendarFocus() {
    const first = this.qs<HTMLElement>('.calendar-grid-item span');
    if (first) {
      first.classList.add('focus');
      (first.parentElement as HTMLElement).focus();
      this.qs('.calendar')?.classList.add('focus');
    }
  }

  private handleCalendarFocusOut = (e: FocusEvent) => {
    const calendarDiv = this.qs<HTMLElement>('.calendar');
    if (!calendarDiv) return;
    if (!calendarDiv.contains(e.relatedTarget as Node)) {
      this.qsa<HTMLElement>('.calendar-grid-item span.focus').forEach(span => {
        span.classList.remove('focus');
        calendarDiv.classList.remove('focus');
      });
    }
  };

  /** === Event listeners === */
  @Listen('update-calendar')
  onUpdateCalendar(ev: CustomEvent<{ date: Date }>) {
    const { date } = ev.detail;
    this.currentMonth = date.getUTCMonth();
    this.currentYear = date.getUTCFullYear();
    this.selectedDate = new Date(Date.UTC(this.currentYear, this.currentMonth, date.getUTCDate()));
    this.renderCalendar(this.currentMonth, this.currentYear);
    this.setActiveState();

    this.validation = false;
    this.validationMessage = '';
    this.warningMessage = '';
  }

  @Listen('reset-picker')
  onResetPicker() {
    this.selectedDate = null;
    this.clearActiveState();
    this.updateSelectedDateDisplay('No date selected' as any);
    this.currentDate();
  }

  render() {
    return this.calendar ? this.renderDatePickerView() : this.renderInputs();
  }
}
