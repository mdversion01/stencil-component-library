import { Component, Prop, State, h, Element, Event, EventEmitter, Watch, Method, Fragment } from '@stencil/core';
import { createPopper, Instance as PopperInstance } from '@popperjs/core';

@Component({
  tag: 'date-range-picker-component',
  styleUrls: [
    '../form-styles.scss',
    '../layout-styles.scss',
    '../select-field/select-field-styles.scss',
    '../input-field/input-field-styles.scss',
    '../input-group/input-group-styles.scss',
    '../plumage-select-field/plumage-select-field-styles.scss',
    '../plumage-input-field/plumage-input-field-styles.scss',
    '../plumage-input-group/plumage-input-group-styles.scss',
    '../datepicker/datepicker-styles.scss',
  ],
  shadow: false,
})
export class DateRangePickerComponent {
  // -------------------- element + refs --------------------
  @Element() el!: HTMLElement;

  private inputEl?: HTMLInputElement;
  private dropdownEl?: HTMLDivElement;
  private dropdownContentEl?: HTMLDivElement;
  private popper?: PopperInstance;

  // -------------------- public API (props) ----------------
  @Prop() ariaLabel: string = '';
  @Prop() dateFormat: 'YYYY-MM-DD' | 'MM-DD-YYYY' = 'YYYY-MM-DD';
  @Prop() plumage: boolean = false;

  @Prop({ mutable: true }) value: string = ''; // reflects selection (start joinBy end)
  @Prop() joinBy: string = ' - ';

  @Prop() inputId: string = 'drp';

  /** was `append`, renamed to avoid reserved name */
  @Prop() appendProp: boolean = true;
  @Prop() appendId: string = '';

  /** was `prepend`, renamed to avoid reserved name */
  @Prop() prependProp: boolean = false;
  @Prop() prependId: string = '';

  @Prop() disabled: boolean = false;
  @Prop() label: string = 'Date Range Picker';
  @Prop() labelHidden: boolean = false;

  /** '', 'horizontal', or 'inline' */
  @Prop() formLayout: '' | 'horizontal' | 'inline' = '';

  @Prop() icon: string = 'fas fa-calendar-alt';

  /** External placeholder prop (immutable). We derive a default into state. */
  @Prop() placeholder?: string;

  @Prop() required: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';

  @Prop({ mutable: true }) validation: boolean = false;
  @Prop({ mutable: true }) validationMessage: string = 'Required field';
  @Prop({ mutable: true }) warningMessage: string = '';

  /** Render only the picker (no input group); disables OK button */
  @Prop() rangePicker: boolean = false;

  /** Allow host to control the OK/Close button; we'll mask it off when rangePicker = true */
  @Prop({ mutable: true }) showOkButton: boolean = true;

  /** Use these to control output format of start/end labels (display only) */
  @Prop() showYmd: boolean = false; // display YYYY-MM-DD
  @Prop() showLong: boolean = false; // display "Wednesday, January 1, 2025"
  @Prop() showIso: boolean = false; // display ISO string (toISOString)

  /** NEW: configurable Bootstrap grid like other inputs */
  /** Legacy numeric cols (fallback) */
  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;

  /** NEW: responsive column class specs (e.g., "col-sm-3 col-md-4" or "xs-12 sm-8") */
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  // -------------------- internal state --------------------
  @State() dropdownOpen: boolean = false;

  @State() selectedStartDate: string = '';
  @State() selectedEndDate: string = '';

  @State() startDate: Date | null = null;
  @State() endDate: Date | null = null;

  @State() currentStartMonth: number = new Date().getMonth();
  @State() currentStartYear: number = new Date().getFullYear();
  @State() currentEndMonth: number = (this.currentStartMonth + 1) % 12;
  @State() currentEndYear: number = this.currentStartMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;

  // focusedDate drives the *visual* .focus ring only when userNavigated = true
  @State() focusedDate: Date = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
  @State() userNavigated: boolean = false;

  /** Derived default placeholder kept in state to avoid mutating the @Prop */
  @State() placeholderText: string = '';

  private okButtonLabel: 'OK' | 'Close' = 'Close';

  // -------------------- events ----------------------------
  /** Emits both human-readable (matches input/display) and ISO (YYYY-MM-DD) values */
  @Event({ eventName: 'date-range-updated' })
  dateRangeUpdated!: EventEmitter<{
    startDate: string; // display string (same as input)
    endDate: string; // display string (same as input)
    startDateIso: string; // YYYY-MM-DD
    endDateIso: string; // YYYY-MM-DD
  }>;

  // -------------------- lifecycle -------------------------
  componentWillLoad() {
    // placeholder reflects *display* format example
    this.placeholderText = this.placeholder ?? `${this.displayFormatExample()} ${this.joinBy} ${this.displayFormatExample()}`;

    if (this.currentEndMonth > 11) {
      this.currentEndMonth = 0;
      this.currentEndYear += 1;
    }
    this.setDefaultWarningMessage();
  }

  componentDidLoad() {
    // With shadow: false, query from host element directly
    this.inputEl = this.el.querySelector('input.form-control') || undefined;
    this.dropdownEl = this.el.querySelector('.dropdown') as HTMLDivElement | undefined;

    // focus styling
    if (this.inputEl) {
      this.inputEl.addEventListener('focus', this.addFocusClass);
      this.inputEl.addEventListener('blur', this.removeFocusClass);
    }
    const calendarButtons = Array.from(this.el.querySelectorAll('.calendar-button'));
    calendarButtons.forEach(btn => {
      btn.addEventListener('focus', this.addFocusClass);
      btn.addEventListener('blur', this.removeFocusClass);
    });

    // keyboard navigation (delegated to wrapper) + wrapper focus management
    const calendarWrapper = this.el.querySelector('.calendar-wrapper');
    if (calendarWrapper) {
      calendarWrapper.addEventListener('keydown', this.handleKeyDown as any);
      calendarWrapper.addEventListener('focus', this.handleWrapperFocus as any);
      // IMPORTANT: per-calendar focus listeners (non-bubbling) to avoid resetting on child focus
      Array.from(this.el.querySelectorAll('.dp-calendar')).forEach(cal => {
        cal.addEventListener('focus', this.handleCalendarFocus as any);
        cal.addEventListener('focusout', this.handleCalendarFocusOut as any);
      });
    }

    // outside clicks
    document.addEventListener('click', this.handleOutsideClick, { capture: true });

    // reset events
    this.el.addEventListener('reset-picker', this.resetCalendar as EventListener);

    this.syncMonthYearSelectors();
    this.setDefaultWarningMessage();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick, true as any);
    this.el.removeEventListener('reset-picker', this.resetCalendar as EventListener);

    if (this.inputEl) {
      this.inputEl.removeEventListener('focus', this.addFocusClass);
      this.inputEl.removeEventListener('blur', this.removeFocusClass);
    }
    const calendarButtons = Array.from(this.el.querySelectorAll('.calendar-button'));
    calendarButtons.forEach(btn => {
      btn.removeEventListener('focus', this.addFocusClass);
      btn.removeEventListener('blur', this.removeFocusClass);
    });

    const calendarWrapper = this.el.querySelector('.calendar-wrapper');
    if (calendarWrapper) {
      calendarWrapper.removeEventListener('keydown', this.handleKeyDown as any);
      calendarWrapper.removeEventListener('focus', this.handleWrapperFocus as any);
      // remove per-calendar listeners
      Array.from(this.el.querySelectorAll('.dp-calendar')).forEach(cal => {
        cal.removeEventListener('focus', this.handleCalendarFocus as any);
        cal.removeEventListener('focusout', this.handleCalendarFocusOut as any);
      });
    }

    this.destroyPopper();
  }

  // -------------------- watchers --------------------------
  @Watch('currentStartMonth')
  @Watch('currentStartYear')
  syncMonthYearSelectors() {
    const root = this.el;
    if (!root) return;
    const monthSelect = root.querySelector('#months') as HTMLSelectElement | null;
    const yearSelect = root.querySelector('#year') as HTMLSelectElement | null;
    if (monthSelect) monthSelect.value = String(this.currentStartMonth);
    if (yearSelect) yearSelect.value = String(this.currentStartYear);
  }

  // -------------------- public method ---------------------
  /** Programmatically clear the selection and reset */
  @Method() async clear() {
    this.clearInputField();
  }

  // -------------------- helpers ---------------------------
  private waitForRender() {
    return new Promise<void>(resolve => {
      requestAnimationFrame(() => resolve());
    });
  }

  private escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /** Example for placeholder based on current display mode */
  private displayFormatExample(): string {
    if (this.showIso) return 'YYYY-MM-DDTHH:mm:ss.sssZ';
    if (this.showLong) return 'Day, Month Date, Year - (or) Day, Month Date, Year';
    if (this.showYmd) return 'YYYY-MM-DD';
    return this.dateFormat === 'MM-DD-YYYY' ? 'MM-DD-YYYY' : 'YYYY-MM-DD';
  }

  // -------------------- dropdown & popper -----------------
  private openDropdown = () => {
    this.dropdownOpen = true;
    this.userNavigated = false; // opening fresh; don't auto-apply focusedDate visually
    this.createPopperInstance();
    const calendarWrapper = this.el.querySelector('.calendar-wrapper');
    if (calendarWrapper) {
      calendarWrapper.addEventListener('keydown', this.handleKeyDown as any);
      calendarWrapper.addEventListener('focus', this.handleWrapperFocus as any);
      // per-calendar focus listeners (if added later)
      Array.from(this.el.querySelectorAll('.dp-calendar')).forEach(cal => {
        cal.addEventListener('focus', this.handleCalendarFocus as any);
        cal.addEventListener('focusout', this.handleCalendarFocusOut as any);
      });
    }
    // Focus the dialog container (NOT a day cell)
    setTimeout(() => this.dropdownContentEl?.focus(), 0);
  };

  private closeDropdown = () => {
    this.dropdownOpen = false;
    this.destroyPopper();
  };

  private toggleDropdown = (e: Event) => {
    e.stopPropagation();

    if (this.dropdownOpen) {
      this.closeDropdown();
    } else {
      // Ensure months are aligned to selection if present
      if (this.startDate) {
        this.currentStartMonth = this.startDate.getUTCMonth();
        this.currentStartYear = this.startDate.getUTCFullYear();
        const end = this.endDate ?? new Date(Date.UTC(this.currentStartYear, (this.currentStartMonth + 1) % 12, 1));
        this.currentEndMonth = end.getUTCMonth();
        this.currentEndYear = end.getUTCFullYear();

        // same month -> force consecutive
        if (this.currentStartMonth === this.currentEndMonth && this.currentStartYear === this.currentEndYear) {
          this.currentEndMonth = (this.currentStartMonth + 1) % 12;
          this.currentEndYear = this.currentStartMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;
        }
      } else {
        const today = new Date();
        this.currentStartMonth = today.getMonth();
        this.currentStartYear = today.getFullYear();
        this.currentEndMonth = (this.currentStartMonth + 1) % 12;
        this.currentEndYear = this.currentStartMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;
      }
      this.openDropdown();
      this.updateSelectedRange();
    }
  };

  private createPopperInstance() {
    if (!this.inputEl || !this.dropdownEl) return;
    if (this.popper) return;
    this.popper = createPopper(this.inputEl, this.dropdownEl, {
      placement: 'bottom-start',
      modifiers: [
        { name: 'offset', options: { offset: [0, 4] } },
        { name: 'preventOverflow', options: { boundary: 'viewport' } },
      ],
    });
  }

  private destroyPopper() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = undefined;
    }
  }

  private handleOutsideClick = (ev: MouseEvent) => {
    const root = this.el;
    if (!root) return;
    const okButton = root.querySelector('.ok-button button');
    const path = (ev.composedPath && ev.composedPath()) || [];
    const clickInside = path.includes(this.el);
    if (!clickInside || (okButton && ev.target === okButton)) {
      this.closeDropdown();
    }
  };

  // -------------------- calendar helpers -----------------
  private getFirstDayOfMonth(year: number, month0b: number) {
    return new Date(Date.UTC(year, month0b, 1)).getUTCDay();
  }

  // Ensure calendar has a visually focused cell (first day of left calendar) — visual only
  private setVisualFocusFirstDayOfStartMonth = () => {
    const firstDaySpan = this.el.querySelector('.dp-calendar:first-child .calendar-grid-item.csm-first-day span') as HTMLElement | null;

    this.clearAllFocus();

    if (firstDaySpan) {
      firstDaySpan.classList.add('focus');
      const dateStr = (firstDaySpan.parentElement as HTMLElement).getAttribute('data-date');
      if (dateStr) {
        this.focusedDate = new Date(`${dateStr}T00:00:00Z`);
      }
      this.updateActiveDateElements();
    }
  };

  private activateFirstFocusableCell = () => {
    const firstDaySpan = this.el.querySelector('.dp-calendar:first-child .calendar-grid-item.csm-first-day span') as HTMLElement | null;
    if (firstDaySpan) {
      this.clearAllFocus();
      firstDaySpan.classList.add('focus');
      (firstDaySpan.parentElement as HTMLElement).focus();
      const dd = (firstDaySpan.parentElement as HTMLElement).getAttribute('data-date');
      if (dd) this.focusedDate = new Date(`${dd}T00:00:00Z`);
      this.userNavigated = true;
      this.updateActiveDateElements();
    }
  };

  private isToday(date: Date) {
    const today = new Date();
    return date.getUTCFullYear() === today.getUTCFullYear() && date.getUTCMonth() === today.getUTCMonth() && date.getUTCDate() === today.getUTCDate();
  }

  private normalizeDate(date: Date | null) {
    if (!date) return null;
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  private isDateInRange = (date: Date) => {
    const s = this.normalizeDate(this.startDate);
    const e = this.normalizeDate(this.endDate);
    return !!(s && e && date >= s && date <= e);
  };

  private isStartOrEndDate = (date: Date) => {
    const s = this.normalizeDate(this.startDate);
    const e = this.normalizeDate(this.endDate);
    return (!!s && date.getTime() === s.getTime()) || (!!e && date.getTime() === e.getTime());
  };

  private formatDate(date: Date, format: 'YYYY-MM-DD' | 'MM-DD-YYYY'): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    if (format === 'MM-DD-YYYY') return `${m}-${d}-${y}`;
    return `${y}-${m}-${d}`;
  }

  private formatDateYmd(date: Date) {
    return date.toISOString().split('T')[0];
  }
  private formatDateLong(date: Date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    } as const);
  }
  private formatISODate(date: Date) {
    return date.toISOString();
  }

  /** Pick the output format for input/display based on flags */
  private formatForOutput(date: Date | null): string {
    if (!date) return 'N/A';
    if (this.showIso) return this.formatISODate(date);
    if (this.showLong) return this.formatDateLong(date);
    if (this.showYmd) return this.formatDateYmd(date);
    return this.formatDate(date, this.dateFormat);
  }

  // ----------- parsing + validation for the *current* display format ----------
  private buildRangePattern(): RegExp {
    const sep = this.escapeRegex(this.joinBy.trim());
    const altSep = '\\s*(?:' + sep + '|to|-)\\s*';

    // date token patterns
    const ymd = '\\d{4}-\\d{2}-\\d{2}';
    const mdy = '\\d{2}-\\d{2}-\\d{4}';
    const iso = '\\d{4}-\\d{2}-\\d{2}(?:[T\\s]\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,3})?Z)?';
    const long = '[A-Za-z]+,?\\s+[A-Za-z]+\\s+\\d{1,2},\\s+\\d{4}';

    let single: string;
    if (this.showIso) single = iso;
    else if (this.showLong) single = long;
    else if (this.showYmd) single = ymd;
    else single = this.dateFormat === 'MM-DD-YYYY' ? mdy : ymd;

    // be a little permissive: also accept the other numeric variant as fallback
    const numericEither = `(?:${ymd}|${mdy})`;
    const left = this.showLong || this.showIso ? single : numericEither;
    const right = left;

    return new RegExp(`^\\s*(${left})${altSep}(${right})\\s*$`);
  }

  /** Try to parse a single date string according to current display mode (with fallbacks) */
  private parseDate(dateStr: string): Date | null {
    const s = dateStr.trim();
    if (!s) return null;

    const tryYmd = () => {
      const parts = s.split('-');
      if (parts.length !== 3) return null;
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if ([y, m, d].some(n => Number.isNaN(n))) return null;
      return new Date(Date.UTC(y, m, d));
    };

    const tryMdy = () => {
      const parts = s.split('-');
      if (parts.length !== 3) return null;
      const m = parseInt(parts[0], 10) - 1;
      const d = parseInt(parts[1], 10);
      const y = parseInt(parts[2], 10);
      if ([y, m, d].some(n => Number.isNaN(n))) return null;
      return new Date(Date.UTC(y, m, d));
    };

    // Primary format based on flags
    if (this.showIso) {
      // allow full ISO or YYYY-MM-DD
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      const short = tryYmd();
      if (short) return short;
    } else if (this.showLong) {
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    } else if (this.showYmd) {
      const d = tryYmd();
      if (d) return d;
    } else {
      if (this.dateFormat === 'YYYY-MM-DD') {
        const d = tryYmd() ?? tryMdy();
        if (d) return d;
      } else {
        const d = tryMdy() ?? tryYmd();
        if (d) return d;
      }
    }

    // Last resort fallback: Date.parse
    const any = new Date(s);
    if (!Number.isNaN(any.getTime())) {
      return new Date(Date.UTC(any.getUTCFullYear(), any.getUTCMonth(), any.getUTCDate()));
    }
    return null;
  }

  // -------------------- selection & nav ------------------
  private selectDate(date: Date) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = this.normalizeDate(date);
      this.endDate = null;
    } else {
      if (date >= this.startDate) {
        this.endDate = this.normalizeDate(date);
      } else {
        this.startDate = this.normalizeDate(date);
        this.endDate = null;
      }
    }
    this.updateSelectedRange();
    this.updateDisplayedDateRange();
    this.updateOkButtonState();
    this.updateActiveDateElements(); // no-op now

    // keep the input text in sync with display as the user clicks
    if (this.startDate && this.endDate) {
      const sLabel = this.formatForOutput(this.startDate);
      const eLabel = this.formatForOutput(this.endDate);
      this.value = `${sLabel} ${this.joinBy} ${eLabel}`;
      if (this.inputEl) this.inputEl.value = this.value;
    }
  }

  private updateOkButtonState() {
    const startValid = !!this.startDate;
    const endValid = !!this.endDate;
    this.okButtonLabel = startValid && endValid ? 'OK' : 'Close';
  }

  /** NOTE: these no longer set focusedDate; boundary handlers do after re-render */
  private async prevMonth() {
    this.currentStartMonth--;
    this.currentEndMonth--;

    if (this.currentStartMonth < 0) {
      this.currentStartMonth = 11;
      this.currentStartYear--;
    }
    if (this.currentEndMonth < 0) {
      this.currentEndMonth = 11;
      this.currentEndYear--;
    }

    this.userNavigated = true;
    this.syncMonthYearSelectors();
    this.updateSelectedRange();
    await this.waitForRender();
  }

  private async nextMonth() {
    this.currentStartMonth++;
    this.currentEndMonth++;

    if (this.currentStartMonth > 11) {
      this.currentStartMonth = 0;
      this.currentStartYear++;
    }
    if (this.currentEndMonth > 11) {
      this.currentEndMonth = 0;
      this.currentEndYear++;
    }

    this.userNavigated = true;
    this.syncMonthYearSelectors();
    this.updateSelectedRange();
    await this.waitForRender();
  }

  // -------------------- input & validation ---------------
  private validateInput = (val: string) => {
    if (!val) {
      this.validation = this.required;
      this.validationMessage = this.required ? 'This field is required.' : '';
      return;
    }

    const pattern = this.buildRangePattern();
    const ok = pattern.test(val);
    if (!ok) {
      this.validation = true;
      this.validationMessage = `Invalid date range. Use ${this.displayFormatExample()} ${this.joinBy} ${this.displayFormatExample()}.`;
    } else {
      this.validation = false;
      this.validationMessage = '';
    }
  };

  private handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const inputValue = target.value.trim();

    if (inputValue === '') {
      this.clearInputField();
      this.validation = this.required;
      this.validationMessage = this.required ? 'This field is required.' : '';
      this.value = '';
      this.el.setAttribute('value', this.value);
      return;
    }

    this.validateInput(inputValue);
    if (this.validation) return;

    // split by preferred joinBy, with friendly fallback to " to " or "-"
    const parts = inputValue.includes(this.joinBy) ? inputValue.split(this.joinBy) : /\sto\s/i.test(inputValue) ? inputValue.split(/\sto\s/i) : inputValue.split('-'); // last resort

    if (parts.length !== 2) {
      this.validation = true;
      this.validationMessage = 'Please enter a valid date range.';
      return;
    }

    const [s, eStr] = parts.map(p => p.trim());
    const sDate = this.parseDate(s);
    const eDate = this.parseDate(eStr);

    if (!sDate || !eDate || sDate > eDate) {
      this.validation = true;
      this.validationMessage = 'Please enter a valid date range.';
      return;
    }

    this.startDate = this.normalizeDate(sDate);
    this.endDate = this.normalizeDate(eDate);

    // **Display** exactly as preview:
    const sLabel = this.formatForOutput(this.startDate);
    const eLabel = this.formatForOutput(this.endDate);
    this.value = `${sLabel} ${this.joinBy} ${eLabel}`;
    target.value = this.value;
    this.el.setAttribute('value', this.value);

    // keep the inline preview in sync
    this.updateSelectedRange();
    this.updateDisplayedDateRange();

    // emit with ISO for submission
    const sIso = this.startDate.toISOString().split('T')[0];
    const eIso = this.endDate.toISOString().split('T')[0];
    this.dateRangeUpdated.emit({
      startDate: sLabel,
      endDate: eLabel,
      startDateIso: sIso,
      endDateIso: eIso,
    });
  };

  private _handleOkClick = () => {
    const s = this.startDate ? this.formatForOutput(this.startDate) : null;
    const e = this.endDate ? this.formatForOutput(this.endDate) : null;

    if (s && e) {
      const selectedRange = `${s} ${this.joinBy} ${e}`;
      if (this.inputEl) this.inputEl.value = selectedRange;
      this.value = selectedRange;

      // emit human + ISO
      const sIso = this.startDate!.toISOString().split('T')[0];
      const eIso = this.endDate!.toISOString().split('T')[0];
      this.dateRangeUpdated.emit({ startDate: s, endDate: e, startDateIso: sIso, endDateIso: eIso });

      // clear validation
      this.validation = false;
      this.validationMessage = '';

      this.closeDropdown();
      this.syncMonthYearSelectors();
    } else {
      this.closeDropdown();
    }
  };

  // -------------------- reset & clear --------------------
  private setDefaultWarningMessage() {
    this.validation = this.validation; // no-op
  }

  private clearInputField = () => {
    // 1) Clear any existing visual focus ring(s)
    this.clearAllFocus();
    // 2) Reset dates and input value
    this.startDate = null;
    this.endDate = null;
    if (this.inputEl) this.inputEl.value = '';
    this.value = '';
    // 3) Reset validation
    if (this.required) {
      this.validation = true;
      this.validationMessage = 'This field is required.';
    } else {
      this.validation = false;
      this.validationMessage = '';
    }
    // 4) Reset months to current and next
    const now = new Date();
    this.currentStartMonth = now.getMonth();
    this.currentStartYear = now.getFullYear();
    this.currentEndMonth = (this.currentStartMonth + 1) % 12;
    this.currentEndYear = this.currentStartMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;
    // 5) Make sure no render-time focus is applied after reset
    this.userNavigated = false;

    this.syncMonthYearSelectors();
    this.updateSelectedRange();
    this.updateDisplayedDateRange();
    this.updateActiveDateElements(); // no-op now
  };

  /** Public reset via event (kept for parity with Lit) */
  private resetCalendar = () => {
    this.clearInputField();
  };

  // -------------------- UI updates -----------------------
  private updateSelectedRange() {
    // purely class-driven via render; no direct DOM mutation needed here
  }

  private updateDisplayedDateRange() {
    const root = this.el;
    if (!root) return;
    const sEl = root.querySelector('.start-date') as HTMLElement | null;
    const eEl = root.querySelector('.end-date') as HTMLElement | null;

    if (sEl) sEl.textContent = this.formatForOutput(this.startDate);
    if (eEl) eEl.textContent = this.formatForOutput(this.endDate);
  }

  /** No-op (preview UI removed in Option B) */
  private updateActiveDateElements() {
    return;
  }

  // -------------------- focus styling (ported from Lit) ---
  private addFocusClass = () => {
    const grp = this.el.querySelector('.input-group');
    if (grp) grp.classList.add('focus');
  };

  private removeFocusClass = () => {
    const grp = this.el.querySelector('.input-group');
    if (grp) grp.classList.remove('focus');
  };

  // -------------------- layout helpers & grid utils -------
  /** Only show “required” visuals when required==true AND the range isn’t fully selected. */
  private showAsRequired() {
    return this.required && !(this.startDate && this.endDate);
  }

  private isHorizontal() {
    return this.formLayout === 'horizontal';
  }
  private isInline() {
    return this.formLayout === 'inline';
  }

  private labelClassBase() {
    return ['form-control-label', this.showAsRequired() ? 'required' : '', this.labelHidden ? 'sr-only' : '', this.validation ? 'invalid' : ''].filter(Boolean).join(' ');
  }
  private labelClassHorizontal(labelColClass: string) {
    return [this.labelClassBase(), labelColClass, 'no-padding', 'col-form-label'].filter(Boolean).join(' ');
  }
  private groupSizeClass() {
    return this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
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
        '[date-range-picker-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  // -------------------- keyboard navigation ---------------
  private handleDayPointer = (ev: MouseEvent) => {
    const cell = ev.currentTarget as HTMLElement | null;
    if (!cell) return;

    // ignore off-month cells
    if (cell.classList.contains('previous-month-day') || cell.classList.contains('next-month-day')) return;

    const dataDate = cell.getAttribute('data-date');
    if (!dataDate) return;

    const date = new Date(`${dataDate}T00:00:00Z`);

    // move visual focus to this cell
    this.clearAllFocus();
    const span = cell.querySelector('span') as HTMLElement | null;
    if (span) span.classList.add('focus');
    cell.focus();

    // keep state + previews in sync
    this.focusedDate = date;
    this.userNavigated = true;
    this.updateActiveDateElements();

    // finally apply selection logic
    this.selectDate(date);
  };

  private handleKeyDown = async (event: KeyboardEvent) => {
    const inputField = this.el.querySelector('input.form-control') as HTMLInputElement | null;

    if (event.key === 'Backspace' && inputField) {
      if (inputField.value.trim() === '') {
        this.clearInputField();
        return;
      }
    }

    const calendarWrapper = this.el.querySelector('.calendar-wrapper') as HTMLElement | null;
    const active = (this.el.getRootNode() as Document | ShadowRoot)['activeElement'] as HTMLElement | null;
    const isWrapperFocused = active === calendarWrapper;

    // If wrapper is focused and an Arrow is pressed: activate first cell AND apply the movement just pressed
    if (isWrapperFocused && event.key.startsWith('Arrow')) {
      event.preventDefault();
      if (!this.el.querySelector('.calendar-grid-item span.focus')) {
        this.setVisualFocusFirstDayOfStartMonth();
      }
      this.activateFirstFocusableCell();

      // After activation, apply one step in the pressed direction
      const gridsNow = this.el.querySelectorAll('.calendar-grid');
      const cellsNow = Array.from(gridsNow).flatMap(g => Array.from(g.querySelectorAll('.calendar-grid-item:not(.previous-month-day):not(.next-month-day)')) as HTMLElement[]);
      const focusEl = (this.el.getRootNode() as Document | ShadowRoot)['activeElement'] as HTMLElement | null;
      const startIndex = focusEl ? cellsNow.indexOf(focusEl) : -1;
      if (startIndex >= 0) {
        const delta = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? +1 : event.key === 'ArrowUp' ? -7 : event.key === 'ArrowDown' ? +7 : 0;
        const nextIndex = Math.max(0, Math.min(cellsNow.length - 1, startIndex + delta));
        if (nextIndex !== startIndex) this.moveFocusToNewIndex(cellsNow, nextIndex);
      }
      return;
    }

    const calendarGrids = this.el.querySelectorAll('.calendar-grid');
    let currentFocus = active;
    if (!currentFocus || !this.el.contains(currentFocus)) {
      currentFocus = null;
    }

    const calendarCells = Array.from(calendarGrids).flatMap(
      grid => Array.from(grid.querySelectorAll('.calendar-grid-item:not(.previous-month-day):not(.next-month-day)')) as HTMLElement[],
    );

    // NOTE: Do not intercept Tab; allow native focus flow
    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
      let index = currentFocus ? calendarCells.indexOf(currentFocus) : -1;

      // if the activeElement was replaced by a re-render, use the visual ring as the source of truth
      if (index === -1) {
        const spanFocus = this.el.querySelector('.calendar-grid-item span.focus') as HTMLElement | null;
        const cellFromSpan = spanFocus ? (spanFocus.parentElement as HTMLElement) : null;
        if (cellFromSpan) {
          index = calendarCells.indexOf(cellFromSpan);
        }
      }

      if (index !== -1) {
        if (event.key === 'ArrowUp') {
          this.moveFocusToNewIndex(calendarCells, Math.max(index - 7, 0));
        } else if (event.key === 'ArrowDown') {
          this.moveFocusToNewIndex(calendarCells, Math.min(index + 7, calendarCells.length - 1));
        } else if (event.key === 'ArrowLeft') {
          if (calendarCells[index].classList.contains('csm-first-day')) {
            await this.prevMonth();
            const lastDayElement = this.el.querySelector('.calendar-grid-item.csm-last-day span') as HTMLElement | null;
            if (lastDayElement) {
              this.clearAllFocus();
              lastDayElement.classList.add('focus');
              (lastDayElement.parentElement as HTMLElement).focus();
              const dd = (lastDayElement.parentElement as HTMLElement).getAttribute('data-date');
              if (dd) this.focusedDate = new Date(`${dd}T00:00:00Z`);
              this.updateActiveDateElements();
            }
          } else {
            this.moveFocusToNewIndex(calendarCells, Math.max(index - 1, 0));
          }
        } else if (event.key === 'ArrowRight') {
          if (calendarCells[index].classList.contains('cem-last-day')) {
            await this.nextMonth();
            const firstDayElement = this.el.querySelector('.calendar-grid-item.cem-first-day span') as HTMLElement | null;
            if (firstDayElement) {
              this.clearAllFocus();
              firstDayElement.classList.add('focus');
              (firstDayElement.parentElement as HTMLElement).focus();
              const dd = (firstDayElement.parentElement as HTMLElement).getAttribute('data-date');
              if (dd) this.focusedDate = new Date(`${dd}T00:00:00Z`);
              this.updateActiveDateElements();
            }
          } else {
            this.moveFocusToNewIndex(calendarCells, Math.min(index + 1, calendarCells.length - 1));
          }
        }
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleEnterKeyPress(event as any);
    }
  };

  private moveFocusToNewIndex(calendarCells: HTMLElement[], newIndex: number) {
    this.clearAllFocus();

    const targetCell = calendarCells[newIndex];
    if (!targetCell) return;
    if (targetCell.classList.contains('previous-month-day') || targetCell.classList.contains('next-month-day')) {
      return;
    }

    const targetSpan = targetCell.querySelector('span') as HTMLElement | null;
    if (targetSpan) {
      targetSpan.classList.add('focus');
      targetCell.focus();

      // sync focusedDate so render-time adds .focus consistently (only when userNavigated)
      const dd = targetCell.getAttribute('data-date');
      if (dd) this.focusedDate = new Date(`${dd}T00:00:00Z`);
      this.userNavigated = true;

      this.updateActiveDateElements();
    }
  }

  private clearAllFocus() {
    const focused = this.el.querySelectorAll('.calendar-grid-item span.focus');
    focused.forEach(el => el.classList.remove('focus'));
  }

  private handleEnterKeyPress = (_event: KeyboardEvent) => {
    const focusedElement = this.el.querySelector('.calendar-grid-item span.focus') as HTMLElement | null;
    if (focusedElement) {
      const parent = focusedElement.parentElement as HTMLElement;
      const dataDate = parent.getAttribute('data-date');
      if (dataDate) {
        const date = new Date(`${dataDate}T00:00:00Z`);
        this.selectDate(date);
      }
    }
  };

  /** When the *wrapper* gets focused via Tab/Shift+Tab, DO NOT move real focus; just set visual ring */
  private handleWrapperFocus = (event: FocusEvent) => {
    if (event.target !== event.currentTarget) return; // only when wrapper itself gains focus
    this.userNavigated = false; // entering fresh; don't prefer focusedDate automatically
    // Visual cue only; do not call .focus() on any cell
    this.setVisualFocusFirstDayOfStartMonth();
  };

  /** Only fire when the calendar itself receives focus; don’t reset on child focus.
      Prefer startDate; only use focusedDate if user has navigated before. */
  private handleCalendarFocus = (event: FocusEvent) => {
    const calendarEl = event.currentTarget as HTMLElement | null;
    if (!calendarEl) return;
    if (event.target !== calendarEl) return; // only when calendar node itself gains focus
    if (calendarEl.querySelector('.calendar-grid-item span.focus')) return;

    const prefer = this.startDate ?? (this.userNavigated ? this.focusedDate : null);
    let targetSpan: HTMLElement | null = null;

    if (prefer) {
      const y = prefer.getUTCFullYear();
      const m = String(prefer.getUTCMonth() + 1).padStart(2, '0');
      const d = String(prefer.getUTCDate()).padStart(2, '0');
      targetSpan = calendarEl.querySelector(`.calendar-grid-item[data-date="${y}-${m}-${d}"] span`) as HTMLElement | null;
    }

    if (!targetSpan) {
      targetSpan =
        (calendarEl.querySelector('.calendar-grid-item.csm-first-day span') as HTMLElement | null) ||
        (calendarEl.querySelector('.calendar-grid-item.cem-first-day span') as HTMLElement | null);
    }

    this.clearAllFocus();
    if (targetSpan) {
      targetSpan.classList.add('focus');
      // NOTE: do not move DOM focus here; let arrows activate it
      const dataDate = (targetSpan.parentElement as HTMLElement).getAttribute('data-date');
      if (dataDate) this.focusedDate = new Date(`${dataDate}T00:00:00Z`);
      this.updateActiveDateElements();
    }
  };

  /** Do not clear focus when moving inside; only update preview when leaving entirely */
  private handleCalendarFocusOut = (event: FocusEvent) => {
    const calendarDiv = event.currentTarget as HTMLElement | null;
    const related = event.relatedTarget as Node | null;
    if (calendarDiv && related && calendarDiv.contains(related)) {
      return; // still inside this calendar
    }
    this.updateActiveDateElements();
  };

  // -------------------- selects change -------------------
  private handleMonthChange = (ev: Event) => {
    const sel = ev.target as HTMLSelectElement;
    const selectedMonth = parseInt(sel.value, 10);
    this.currentStartMonth = selectedMonth;
    this.currentEndMonth = (selectedMonth + 1) % 12;
    this.currentEndYear = selectedMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;
    this.userNavigated = false; // layout change
    this.syncMonthYearSelectors();
    // keep visual cue but no DOM focus jump
    setTimeout(this.setVisualFocusFirstDayOfStartMonth, 0);
  };

  private handleYearChange = (ev: Event) => {
    const sel = ev.target as HTMLSelectElement;
    const selectedYear = parseInt(sel.value, 10);
    this.currentStartYear = selectedYear;
    this.currentEndYear = this.currentStartMonth === 11 ? selectedYear + 1 : selectedYear;
    this.userNavigated = false; // layout change
    this.syncMonthYearSelectors();
    // keep visual cue but no DOM focus jump
    setTimeout(this.setVisualFocusFirstDayOfStartMonth, 0);
  };

  private handleFocus = () => {
    this.addFocusClass();
  };
  private handleBlur = () => {
    this.removeFocusClass();
  };

  // -------------------- calendar rendering ----------------
  private renderSelects(plumage = false) {
    const monthSelectEl = (
      <select
        id="months"
        class="form-select form-control select-sm months"
        aria-label="Select Month"
        aria-labelledby="monthSelectField"
        role="listbox"
        onChange={this.handleMonthChange}
        onFocus={plumage ? this.handleInputFocusStyle : this.handleFocus}
        onBlur={plumage ? this.handleInputBlurStyle : this.handleBlur}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const month = new Date(0, i).toLocaleString('en-US', { month: 'long' });
          return (
            <option value={String(i)} selected={i === this.currentStartMonth}>
              {month}
            </option>
          );
        })}
      </select>
    );

    const yearSelectEl = (
      <select
        id="year"
        class="form-select form-control select-sm years"
        aria-label="Select Year"
        aria-labelledby="yearSelectField"
        role="listbox"
        onChange={this.handleYearChange}
        onFocus={plumage ? this.handleInputFocusStyle : this.handleFocus}
        onBlur={plumage ? this.handleInputBlurStyle : this.handleBlur}
      >
        {Array.from({ length: 21 }, (_, i) => {
          const year = i + 2014;
          return (
            <option value={String(year)} selected={year === this.currentStartYear}>
              {year}
            </option>
          );
        })}
      </select>
    );

    if (!plumage) {
      return (
        <Fragment>
          <label id="monthSelectField" class="sr-only visually-hidden" htmlFor="months">
            Select Month
          </label>
          {monthSelectEl}
          <label id="yearSelectField" class="sr-only visually-hidden" htmlFor="year">
            Select Year
          </label>
          {yearSelectEl}
        </Fragment>
      );
    }

    // Plumage framing (underline/focus bar)
    return (
      <Fragment>
        <label id="monthSelectField" class="sr-only visually-hidden" htmlFor="months">
          Select Month
        </label>
        <div class="input-container me-2" role="presentation" aria-labelledby="monthSelectField">
          {monthSelectEl}
          <div class="b-underline" role="presentation">
            <div class="b-focus" role="presentation" aria-hidden="true" />
          </div>
        </div>

        <label id="yearSelectField" class="sr-only visually-hidden" htmlFor="year">
          Select Year
        </label>
        <div class="input-container me-2" role="presentation" aria-labelledby="yearSelectField">
          {yearSelectEl}
          <div class="b-underline" role="presentation">
            <div class="b-focus" role="presentation" aria-hidden="true" />
          </div>
        </div>
      </Fragment>
    );
  }

  // Replace your current handlers with these
  private handleInputFocusStyle = (ev: FocusEvent) => {
    const target = ev.currentTarget as HTMLElement | null;
    // 1) Prefer the inline plumage underline next to this control
    const container = target?.closest('.input-container') as HTMLElement | null;
    let bf: HTMLElement | null =
      (container && (container.querySelector('.b-focus') as HTMLElement | null)) ||
      // 2) Fallback to the group-level underline (input group plumage)
      ((target?.closest('.plumage') as HTMLElement | null)?.querySelector('.b-underline .b-focus') as HTMLElement | null) ||
      // 3) Last resort: first one in the component
      (this.el.querySelector('.b-underline .b-focus') as HTMLElement | null);

    if (bf) {
      bf.style.width = '100%';
      bf.style.left = '0';
    }
  };

  private handleInputBlurStyle = (ev: FocusEvent) => {
    const target = ev.currentTarget as HTMLElement | null;
    const container = target?.closest('.input-container') as HTMLElement | null;
    let bf: HTMLElement | null =
      (container && (container.querySelector('.b-focus') as HTMLElement | null)) ||
      ((target?.closest('.plumage') as HTMLElement | null)?.querySelector('.b-underline .b-focus') as HTMLElement | null) ||
      (this.el.querySelector('.b-underline .b-focus') as HTMLElement | null);

    if (bf) {
      bf.style.width = '0';
      bf.style.left = '50%';
    }
  };

  private renderCalendar(month0b: number, year: number) {
    const formattedMonthYear = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(new Date(year, month0b, 1));

    return (
      <div
        class="calendar dp-calendar form-control h-auto text-center pt-2"
        role="grid"
        aria-roledescription="Calendar"
        aria-label={`Calendar for ${formattedMonthYear}`}
        tabindex={0}
      >
        <div aria-live="polite" aria-atomic="true" class="calendar-grid-caption text-center font-weight-bold" id="calendar-grid-caption">
          {formattedMonthYear}
        </div>

        <div aria-hidden="true" class="calendar-grid-weekdays" role="row">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
            <small
              aria-label={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]}
              title={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]}
              class={`calendar-grid-day col${this.plumage ? ' text-truncate' : ''}`}
              role="columnheader"
            >
              {d}
            </small>
          ))}
        </div>

        <div class="calendar-grid" role="grid">
          {this.renderCalendarDays(month0b, year)}
        </div>
      </div>
    );
  }

  private renderCalendarDays(month0b: number, year: number) {
    const prevMonthLastDate = new Date(Date.UTC(year, month0b, 0)).getUTCDate();
    const firstDay = this.getFirstDayOfMonth(year, month0b);
    const daysInMonth = new Date(Date.UTC(year, month0b + 1, 0)).getUTCDate();
    const firstDayOfWeek = firstDay === 0 ? 0 : firstDay;

    // Always render a 6-row grid (42 cells)
    let date = 1;
    let nextMonthDay = 1;
    const rows: any[] = [];
    let currentRow: any[] = [];

    for (let idx = 0; idx < 42; idx++) {
      let day: number | null = null;
      let dataMonth = month0b + 1;
      let dataYear = year;

      const itemClasses = ['calendar-grid-item'];
      const spanClasses = ['btn', 'border-0', 'rounded-circle', 'text-nowrap'];
      let ariaLabel = '';

      if (idx < firstDayOfWeek) {
        // leading days from previous month
        day = prevMonthLastDate - firstDayOfWeek + idx + 1;
        dataMonth = month0b === 0 ? 12 : month0b;
        dataYear = month0b === 0 ? year - 1 : year;
        itemClasses.push('previous-month-day');
        spanClasses.push('text-muted');
      } else if (date <= daysInMonth) {
        // in-month days
        day = date++;
        const currentDate = new Date(Date.UTC(year, month0b, day));
        spanClasses.push('text-dark', 'font-weight-bold');

        if (day === 1) itemClasses.push(month0b === this.currentStartMonth ? 'csm-first-day' : 'cem-first-day');
        if (day === daysInMonth) itemClasses.push(month0b === this.currentStartMonth ? 'csm-last-day' : 'cem-last-day');

        if (this.isToday(currentDate)) spanClasses.push('current-day');
        if (this.isDateInRange(currentDate)) itemClasses.push('selected-range');
        if (this.isStartOrEndDate(currentDate)) itemClasses.push('selected-range-active');

        // render-time focus only after user navigated
        const fd = this.focusedDate;
        if (this.userNavigated && fd && currentDate.getTime() === Date.UTC(fd.getUTCFullYear(), fd.getUTCMonth(), fd.getUTCDate())) {
          spanClasses.push('focus');
        }
      } else {
        // trailing days from next month
        day = nextMonthDay++;
        dataMonth = month0b === 11 ? 1 : month0b + 2;
        dataYear = month0b === 11 ? year + 1 : year;
        itemClasses.push('next-month-day');
        spanClasses.push('text-muted');
      }

      if (!itemClasses.includes('selected-range') && !itemClasses.includes('selected-range-active')) {
        spanClasses.push('btn-outline-light');
      }

      ariaLabel = day ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dataYear, dataMonth - 1, day)) : '';

      const dataDate = day ? `${dataYear}-${String(dataMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';

      const cell = (
        <div
          class={itemClasses.join(' ')}
          role="gridcell"
          tabindex={-1}
          data-month={String(dataMonth)}
          data-year={String(dataYear)}
          data-day={String(day ?? '')}
          data-date={dataDate}
          aria-label={ariaLabel}
          onClick={this.handleDayPointer}
        >
          <span class={spanClasses.join(' ')}>{day ?? ''}</span>
        </div>
      );

      currentRow.push(cell);

      if (currentRow.length === 7) {
        // Always push the row, even if it's all next-month days (fixes trailing days e.g. after February)
        rows.push(<Fragment>{currentRow}</Fragment>);
        currentRow = [];
      }
    }

    return <Fragment>{rows}</Fragment>;
  }

  // -------------------- picker markup --------------------
  private renderDateRangePicker() {
    const sm = this.currentStartMonth;
    const sy = this.currentStartYear;
    const nm = (sm + 1) % 12;
    const ny = sm === 11 ? sy + 1 : sy;

    const showOk = !this.rangePicker && this.showOkButton;

    return (
      <div class="date-picker">
        <div class="range-picker-wrapper" role="region" aria-label={this.ariaLabel || 'Date Range Picker'}>
          <div class="range-picker-nav mb-1" aria-label="Navigation Controls">
            <button onClick={() => this.prevMonth()} class="range-picker-nav-btn btn-outline-secondary" aria-label="Previous Month">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c-12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
              </svg>
            </button>

            <div class="selectors">
              {this.renderSelects(this.plumage)}

              <button onClick={() => this.el.dispatchEvent(new CustomEvent('reset-picker', { bubbles: true, composed: true }))} class="reset-btn" aria-label="Reset Calendar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"></path>
                </svg>
              </button>
            </div>

            <button onClick={() => this.nextMonth()} class="range-picker-nav-btn btn-outline-secondary" aria-label="Next Month">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s-32.8-12.5 45.3 0l160 160z"></path>
              </svg>
            </button>
          </div>

          <div class="range-picker">
            <div class="calendar-wrapper" role="application" aria-label="Calendars" tabindex={0}>
              {this.renderCalendar(sm, sy)}
              {this.renderCalendar(nm, ny)}
            </div>

            <footer class="border-top small text-center">
              <div class="small" aria-live="polite">
                Use cursor keys to navigate calendar dates
              </div>
            </footer>

            <div class="date-range-display" role="region" aria-labelledby="date-ranges" tabIndex={0}>
              <div id="date-ranges" class="date-ranges">
                <span class={`start-end-ranges${this.showIso ? ' iso' : this.showLong ? ' long' : ''}`}>
                  <span class="start-date">N/A</span>
                  <span class="to-spacing">{this.joinBy}</span>
                  <span class="end-date">N/A</span>
                </span>
              </div>
            </div>
          </div>

          {showOk ? (
            <div class="ok-button">
              <button onClick={this._handleOkClick} class="btn btn-primary" aria-label="Confirm or close date picker">
                {this.okButtonLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  private renderDropdown() {
    return (
      <div class={`dropdown${this.dropdownOpen ? ' open' : ''}`} ref={el => (this.dropdownEl = el as HTMLDivElement)}>
        <div
          class="dropdown-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="datepicker-desc"
          tabindex={-1}
          ref={el => (this.dropdownContentEl = el as HTMLDivElement)}
          onClick={e => e.stopPropagation()}
        >
          {this.renderDateRangePicker()}
        </div>
      </div>
    );
  }

  // ------------- UPDATED: Classic input group with responsive cols -------------
  private renderInputGroupClassic() {
    const isRow = this.isHorizontal() || this.isInline();

    // Compute col classes
    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    // Validate numeric fallbacks if needed (no-op when string specs provided)
    this.getComputedCols();

    const groupClass = ['input-group', this.groupSizeClass(), this.validation ? ' is-invalid' : ''].filter(Boolean).join(' ');

    return (
      <div class={this.formLayout || undefined}>
        <div class={['form-group', 'form-input-group-basic', this.formLayout, isRow ? 'row' : ''].filter(Boolean).join(' ')}>
          {/* Label */}
          {this.labelHidden ? null : (
            <label
              id={`${this.inputId}-label`}
              class={this.isHorizontal() ? this.labelClassHorizontal(labelColClass) : this.labelClassBase()}
              htmlFor={this.inputId}
              aria-hidden="true"
            >
              <span class={this.showAsRequired() ? 'required' : ''}>{text}</span>
              {this.required ? <span class="required">*</span> : null}
            </label>
          )}

          {/* Input column */}
          <div class={this.isHorizontal() ? inputColClass : undefined}>
            <div class={groupClass} role="group" aria-label="Date Picker Group">
              {this.prependProp ? (
                <div class="input-group-prepend">
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
                </div>
              ) : null}

              <div class="drp-input-field">
                <input
                  id={this.inputId}
                  ref={el => (this.inputEl = el as HTMLInputElement)}
                  type="text"
                  class={`form-control${this.validation ? ' is-invalid' : ''}`}
                  placeholder={this.placeholderText}
                  value={this.value}
                  onInput={this.handleInputChange}
                  disabled={this.disabled}
                  aria-label={this.labelHidden ? this.label : undefined}
                  aria-labelledby={!this.labelHidden ? `${this.inputId}-label` : undefined}
                  aria-describedby="datepicker-desc"
                />
                {this.value ? (
                  <button onClick={() => this.clearInputField()} class="clear-input-button" aria-label="Clear Field" role="button">
                    <i class="fas fa-times-circle" />
                  </button>
                ) : null}
              </div>

              {this.appendProp ? (
                <div class="input-group-append">
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
                </div>
              ) : null}
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

  // ------------- UPDATED: Plumage input group with responsive cols -------------
  private renderInputGroupPlumage() {
    const isRow = this.isHorizontal() || this.isInline();

    // Compute col classes
    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    // Validate numeric fallbacks if needed (no-op when string specs provided)
    this.getComputedCols();

    const groupClass = ['input-group', 'nowrap', this.groupSizeClass(), this.disabled ? 'disabled' : ''].filter(Boolean).join(' ');

    return (
      <div class={this.formLayout ? this.formLayout : ''}>
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
            <div class={groupClass} role="group" aria-label="Date Picker Group" tabIndex={0}>
              {this.prependProp ? (
                <button
                  onClick={this.toggleDropdown}
                  class={`calendar-button btn input-group-text${this.validation ? ' is-invalid' : ''}`}
                  aria-label="Toggle Calendar Picker"
                  aria-haspopup="dialog"
                  aria-expanded={this.dropdownOpen ? 'true' : 'false'}
                  disabled={this.disabled}
                  onFocus={this.handleInputFocusStyle}
                  onBlur={this.handleInputBlurStyle}
                >
                  <i class={this.icon} />
                </button>
              ) : null}

              <div class="drp-input-field">
                <input
                  id={this.inputId}
                  ref={el => (this.inputEl = el as HTMLInputElement)}
                  type="text"
                  class={`form-control${this.validation ? ' is-invalid' : ''}`}
                  placeholder={this.placeholderText}
                  value={this.value}
                  onInput={this.handleInputChange}
                  aria-label={this.labelHidden ? this.label : undefined}
                  aria-labelledby={!this.labelHidden ? `${this.inputId}-label` : undefined}
                  name="selectedDate"
                  aria-describedby="datepicker-desc"
                  disabled={this.disabled}
                  onFocus={this.handleInputFocusStyle}
                />
                {this.value ? (
                  <button onClick={() => this.clearInputField()} class="clear-input-button" aria-label="Clear Field" role="button">
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
                  onFocus={this.handleInputFocusStyle}
                  onBlur={this.handleInputBlurStyle}
                >
                  <i class={this.icon} />
                </button>
              ) : null}
            </div>

            <div class={`b-underline${this.validation ? ' invalid' : ''}`} role="presentation">
              <div class={`b-focus${this.disabled ? ' disabled' : ''}${this.validation ? ' invalid' : ''}`} role="presentation" aria-hidden="true" />
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

  // -------------------- render ---------------------------
  render() {
    if (this.rangePicker) {
      return ( this.plumage ? <div class="plumage">{this.renderDateRangePicker()}</div> : this.renderDateRangePicker() );
    }
    return (
      this.plumage ? <div class="plumage">{this.renderInputs()}</div> : this.renderInputs()
    );
  }
}
