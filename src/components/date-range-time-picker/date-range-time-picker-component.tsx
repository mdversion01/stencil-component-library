import { Component, Prop, State, h, Element, Event, EventEmitter, Watch, Method, Fragment } from '@stencil/core';
import { createPopper, Instance as PopperInstance } from '@popperjs/core';

/**
 * <date-range-time-picker-component>
 *
 * Date+time range picker with free-typing, calendar navigation,
 * ISO / numeric / long display modes, and synchronized dropdown.
 */
@Component({
  tag: 'date-range-time-picker-component',
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
export class DateRangeTimePickerComponent {
  @Element() el!: HTMLElement;

  private inputEl?: HTMLInputElement;
  private dropdownEl?: HTMLDivElement;
  private dropdownContentEl?: HTMLDivElement;
  private popper?: PopperInstance;

  private draftSnapshot: {
    value: string;
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
    startAmPm: 'AM' | 'PM';
    endAmPm: 'AM' | 'PM';
    durationText: string;
    currentStartMonth: number;
    currentStartYear: number;
    currentEndMonth: number;
    currentEndYear: number;
    validation: boolean;
    validationMessage: string;
  } | null = null;

  @Prop() ariaLabel: string = '';
  @Prop() dateFormat: 'YYYY-MM-DD' | 'MM-DD-YYYY' = 'YYYY-MM-DD';
  @Prop() plumage: boolean = false;

  @Prop({ mutable: true }) value: string = '';
  @Prop() joinBy: string = '-';

  @Prop() inputId: string = 'date-range-time';

  @Prop() appendProp: boolean = true;
  @Prop() appendId: string = '';
  @Prop() prependProp: boolean = false;
  @Prop() prependId: string = '';

  @Prop() disabled: boolean = false;
  @Prop() readOnly: boolean = false;

  @Prop() label: string = 'Date and Time Picker';
  @Prop() labelAlign: '' | 'right' = '';
  @Prop() labelHidden: boolean = false;
  @Prop() formLayout: '' | 'horizontal' | 'inline' = '';
  @Prop() icon: string = 'fas fa-calendar-alt';

  @Prop() placeholder?: string;

  @Prop() required: boolean = false;
  @Prop() size: '' | 'sm' | 'lg' = '';

  @Prop({ mutable: true }) validation: boolean = false;
  @Prop({ mutable: true }) validationMessage: string = 'Required field';
  @Prop({ mutable: true }) warningMessage: string = '';

  @Prop() rangeTimePicker: boolean = false;
  @Prop({ mutable: true }) showOkButton: boolean = true;

  @Prop() isTwentyFourHourFormat: boolean = true;
  @Prop() showDuration: boolean = false;

  @Prop() labelCol: number = 2;
  @Prop() inputCol: number = 10;
  @Prop() labelCols: string = '';
  @Prop() inputCols: string = '';

  @Prop() showYmd: boolean = false;
  @Prop() showLong: boolean = false;
  @Prop() showIso: boolean = false;

  @State() dropdownOpen: boolean = false;

  @State() startDate: Date | null = null;
  @State() endDate: Date | null = null;

  @State() currentStartMonth: number = new Date().getMonth();
  @State() currentStartYear: number = new Date().getFullYear();
  @State() currentEndMonth: number = (this.currentStartMonth + 1) % 12;
  @State() currentEndYear: number = this.currentStartMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;

  @State() focusedDate: Date = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
  @State() userNavigated: boolean = false;

  @State() placeholderText: string = '';

  @State() startTime: string = '';
  @State() endTime: string = '';
  @State() startAmPm: 'AM' | 'PM' = 'PM';
  @State() endAmPm: 'AM' | 'PM' = 'PM';
  @State() durationText: string = '';

  private okButtonLabel: 'OK' | 'Close' = 'Close';

  @Event({ eventName: 'date-time-updated' })
  dateTimeUpdated!: EventEmitter<{
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    duration: string;
    startDateIso?: string;
    endDateIso?: string;
    startDateTimeIso?: string;
    endDateTimeIso?: string;
  }>;

  private static _seq = 0;
  private _baseId = '';

  private resolveBaseId() {
    if (this._baseId) return;
    DateRangeTimePickerComponent._seq += 1;
    const rnd = Math.random().toString(36).slice(2, 6);
    const raw = (this.inputId || 'date-range-time').trim().replace(/\s+/g, '');
    this._baseId = `${raw}-${DateRangeTimePickerComponent._seq}-${rnd}`;
  }

  private get ids() {
    this.resolveBaseId();
    return this._baseId;
  }

  private get labelId() {
    return `${this.ids}-label`;
  }
  private get validationId() {
    return `${this.ids}-validation`;
  }
  private get dialogTitleId() {
    return `${this.ids}-dialog-title`;
  }
  private get dialogDescId() {
    return `${this.ids}-dialog-desc`;
  }
  private get dropdownId() {
    return `${this.ids}-dropdown`;
  }

  private get monthSelectId() {
    return `${this.ids}-months`;
  }
  private get yearSelectId() {
    return `${this.ids}-year`;
  }
  private get monthLabelId() {
    return `${this.ids}-month-label`;
  }
  private get yearLabelId() {
    return `${this.ids}-year-label`;
  }

  private get dateRangesTitleId() {
    return `${this.ids}-date-ranges-title`;
  }
  private get startTimeId() {
    return `${this.ids}-start-time`;
  }
  private get endTimeId() {
    return `${this.ids}-end-time`;
  }
  private get startTimeLabelId() {
    return `${this.ids}-start-time-label`;
  }
  private get endTimeLabelId() {
    return `${this.ids}-end-time-label`;
  }
  private get warningId() {
    return `${this.ids}-warning`;
  }

  componentWillLoad() {
    this.resolveBaseId();
    this.placeholderText = this.computePlaceholder();

    if (this.currentEndMonth > 11) {
      this.currentEndMonth = 0;
      this.currentEndYear += 1;
    }
    this._setDefaultTimes();
    this.setDefaultWarningMessage();

    if ((this.value || '').trim()) {
      this.applyInitialValue(this.value);
    }
  }

  componentDidLoad() {
    if (!this.rangeTimePicker) {
      this.inputEl = (this.el.querySelector(`#${this.inputId}`) as HTMLInputElement) || undefined;
    }

    this.dropdownEl = this.el.querySelector('.dropdown') as HTMLDivElement | undefined;

    if (this.inputEl) {
      this.inputEl.addEventListener('focus', this.addFocusClass);
      this.inputEl.addEventListener('blur', this.removeFocusClass);
      this.syncInputValue(this.value || '');
    }
    const calendarButtons = Array.from(this.el.querySelectorAll('.calendar-button'));
    calendarButtons.forEach(btn => {
      btn.addEventListener('focus', this.addFocusClass);
      btn.addEventListener('blur', this.removeFocusClass);
    });

    const calendarWrapper = this.el.querySelector('.calendar-wrapper');
    if (calendarWrapper) {
      calendarWrapper.addEventListener('keydown', this.handleKeyDown as any);
      calendarWrapper.addEventListener('focus', this.handleWrapperFocus as any);
      Array.from(this.el.querySelectorAll('.dp-calendar')).forEach(cal => {
        cal.addEventListener('focus', this.handleCalendarFocus as any);
        cal.addEventListener('focusout', this.handleCalendarFocusOut as any);
      });
    }

    document.addEventListener('click', this.handleOutsideClick, { capture: true });
    this.el.addEventListener('reset-picker', this.resetCalendar as EventListener);

    this.syncMonthYearSelectors();
    this.setDefaultWarningMessage();
    this.updateOkButtonState();
    this.syncInputAndPanelFromState();
    this.updateSelectedRange();
    this.updateDisplayedDateRange();
    this.syncWarningMessage();
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
      Array.from(this.el.querySelectorAll('.dp-calendar')).forEach(cal => {
        cal.removeEventListener('focus', this.handleCalendarFocus as any);
        cal.removeEventListener('focusout', this.handleCalendarFocusOut as any);
      });
    }

    this.destroyPopper();
  }

  @Watch('isTwentyFourHourFormat')
  onFormatChange() {
    this._setDefaultTimes();
    this._updateDuration();
    this.updateOkButtonState();
    this.syncInputAndPanelFromState();
    this.refreshPlaceholder();
  }

  @Watch('showIso')
  @Watch('showLong')
  @Watch('showYmd')
  @Watch('dateFormat')
  @Watch('joinBy')
  refreshPlaceholder() {
    this.placeholderText = this.computePlaceholder();
  }

  @Method()
  async clear() {
    this.clearInputField();
  }

  private applyInitialValue(rawValue: string) {
  const next = String(rawValue ?? '').trim();
  if (!next) return;

  const parsed = this.parseIncomingPreloadedValue(next);
  if (!parsed) return;

  this.startDate = this.normalizeDate(parsed.startDate);
  this.endDate = this.normalizeDate(parsed.endDate);

  if (this.isTwentyFourHourFormat) {
    this.startTime = this.formatTimeForStorage(parsed.startTime, parsed.startAmPm);
    this.endTime = this.formatTimeForStorage(parsed.endTime, parsed.endAmPm);
    this.startAmPm = this.startTime >= '12:00' ? 'PM' : 'AM';
    this.endAmPm = this.endTime >= '12:00' ? 'PM' : 'AM';
  } else {
    this.startTime = parsed.startTime;
    this.endTime = parsed.endTime;
    this.startAmPm = parsed.startAmPm || 'AM';
    this.endAmPm = parsed.endAmPm || 'AM';
  }

  this.currentStartMonth = this.startDate.getUTCMonth();
  this.currentStartYear = this.startDate.getUTCFullYear();
  this.currentEndMonth = this.endDate.getUTCMonth();
  this.currentEndYear = this.endDate.getUTCFullYear();

  if (this.currentStartMonth === this.currentEndMonth && this.currentStartYear === this.currentEndYear) {
    this.currentEndMonth = (this.currentStartMonth + 1) % 12;
    this.currentEndYear = this.currentStartMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;
  }

  this.durationText = this.showDuration ? this.durationFromParts() : '';
  this.validation = false;
  this.validationMessage = '';
  this.warningMessage = '';
  this.updateOkButtonState();
  this.syncInputAndPanelFromState();
  this.updateSelectedRange();
  this.updateDisplayedDateRange();
  this.syncWarningMessage();
}

private splitIncomingPreloadedRange(rawValue: string): [string, string] | null {
  const cleaned = String(rawValue ?? '').trim().replace(/\s*\([^)]*\)\s*$/, '');
  if (!cleaned) return null;

  if (this.joinBy && cleaned.includes(this.joinBy)) {
    const parts = cleaned.split(this.joinBy).map(part => part.trim()).filter(Boolean);
    if (parts.length === 2) return [parts[0], parts[1]];
  }

  const toParts = cleaned.split(/\s+to\s+/i).map(part => part.trim()).filter(Boolean);
  if (toParts.length === 2) return [toParts[0], toParts[1]];

  return null;
}

private parseFlexibleTimePiece(timeStr: string): { time: string; ampm?: 'AM' | 'PM' } | null {
  const t = String(timeStr ?? '').trim().toUpperCase();
  if (!t) return null;

  const m24 = /^([0-1]?\d|2[0-3]):([0-5]\d)$/.exec(t);
  if (m24) {
    return { time: `${m24[1].padStart(2, '0')}:${m24[2]}` };
  }

  const m12 = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/.exec(t);
  if (m12) {
    return { time: `${String(parseInt(m12[1], 10)).padStart(2, '0')}:${m12[2]}`, ampm: m12[3] as 'AM' | 'PM' };
  }

  return null;
}

private normalizeIncomingTimeForDisplay(parsed: { time: string; ampm?: 'AM' | 'PM' } | null): { time: string; ampm: 'AM' | 'PM' } | null {
  if (!parsed) return null;

  if (parsed.ampm) {
    const hhmm24 = this.formatTimeForStorage(parsed.time, parsed.ampm);
    const [hhRaw, mm] = hhmm24.split(':');
    const hh = parseInt(hhRaw, 10);

    if (this.isTwentyFourHourFormat) {
      return { time: `${String(hh).padStart(2, '0')}:${mm}`, ampm: hh >= 12 ? 'PM' : 'AM' };
    }

    const hh12 = ((hh + 11) % 12) + 1;
    return { time: `${String(hh12).padStart(2, '0')}:${mm}`, ampm: parsed.ampm };
  }

  const [hhRaw, mm] = parsed.time.split(':');
  const hh = parseInt(hhRaw, 10);
  if (Number.isNaN(hh)) return null;

  if (this.isTwentyFourHourFormat) {
    return { time: `${String(hh).padStart(2, '0')}:${mm}`, ampm: hh >= 12 ? 'PM' : 'AM' };
  }

  const hh12 = ((hh + 11) % 12) + 1;
  return { time: `${String(hh12).padStart(2, '0')}:${mm}`, ampm: hh >= 12 ? 'PM' : 'AM' };
}

private parseIncomingPreloadedSide(part: string): { date: Date; time: string; ampm: 'AM' | 'PM' } | null {
  const trimmed = String(part ?? '').trim();
  if (!trimmed) return null;

  const isoMatch = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)$/i.exec(trimmed);
  if (isoMatch) {
    const dt = new Date(isoMatch[1]);
    if (isNaN(dt.getTime())) return null;

    const date = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
    const hhmm = dt.toISOString().slice(11, 16);
    const normalized = this.normalizeIncomingTimeForDisplay({ time: hhmm });
    if (!normalized) return null;

    return {
      date,
      time: normalized.time,
      ampm: normalized.ampm,
    };
  }

  const longMatch = /^(?:[A-Za-z]+\s*,\s*)?[A-Za-z]+\s+\d{1,2}\s*,\s*\d{4}\s+(.+)$/i.exec(trimmed);
  if (longMatch) {
    const timeText = longMatch[1].trim();
    const dateText = trimmed.slice(0, trimmed.length - timeText.length).trim();
    const date = this.parseLongDate(dateText);
    const parsedTime = this.normalizeIncomingTimeForDisplay(this.parseFlexibleTimePiece(timeText));
    if (!date || !parsedTime) return null;
    return {
      date,
      time: parsedTime.time,
      ampm: parsedTime.ampm,
    };
  }

  const numericMatch = /^(\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4})\s+(.+)$/i.exec(trimmed);
  if (numericMatch) {
    const date = this.parseNumericDate(numericMatch[1]);
    const parsedTime = this.normalizeIncomingTimeForDisplay(this.parseFlexibleTimePiece(numericMatch[2]));
    if (!date || !parsedTime) return null;
    return {
      date,
      time: parsedTime.time,
      ampm: parsedTime.ampm,
    };
  }

  return null;
}

private parseIncomingPreloadedValue(rawValue: string): {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  startAmPm: 'AM' | 'PM';
  endAmPm: 'AM' | 'PM';
} | null {
  const parts = this.splitIncomingPreloadedRange(rawValue);
  if (!parts) return null;

  const left = this.parseIncomingPreloadedSide(parts[0]);
  const right = this.parseIncomingPreloadedSide(parts[1]);

  if (!left || !right) return null;

  const startIso = this.buildIsoDateTime(left.date, left.time, left.ampm);
  const endIso = this.buildIsoDateTime(right.date, right.time, right.ampm);
  if (!startIso || !endIso) return null;
  if (new Date(startIso).getTime() > new Date(endIso).getTime()) return null;

  return {
    startDate: left.date,
    endDate: right.date,
    startTime: left.time,
    endTime: right.time,
    startAmPm: left.ampm,
    endAmPm: right.ampm,
  };
}

  private waitForRender() {
    return new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }

  private cloneDate(date: Date | null): Date | null {
    return date ? new Date(date.getTime()) : null;
  }

  private captureDraftSnapshot() {
    this.draftSnapshot = {
      value: this.value,
      startDate: this.cloneDate(this.startDate),
      endDate: this.cloneDate(this.endDate),
      startTime: this.startTime,
      endTime: this.endTime,
      startAmPm: this.startAmPm,
      endAmPm: this.endAmPm,
      durationText: this.durationText,
      currentStartMonth: this.currentStartMonth,
      currentStartYear: this.currentStartYear,
      currentEndMonth: this.currentEndMonth,
      currentEndYear: this.currentEndYear,
      validation: this.validation,
      validationMessage: this.validationMessage,
    };
  }

  private clearDraftSnapshot() {
    this.draftSnapshot = null;
  }

  private restoreDraftSnapshot() {
    if (!this.draftSnapshot) return;

    this.value = this.draftSnapshot.value;
    this.startDate = this.cloneDate(this.draftSnapshot.startDate);
    this.endDate = this.cloneDate(this.draftSnapshot.endDate);
    this.startTime = this.draftSnapshot.startTime;
    this.endTime = this.draftSnapshot.endTime;
    this.startAmPm = this.draftSnapshot.startAmPm;
    this.endAmPm = this.draftSnapshot.endAmPm;
    this.durationText = this.draftSnapshot.durationText;
    this.currentStartMonth = this.draftSnapshot.currentStartMonth;
    this.currentStartYear = this.draftSnapshot.currentStartYear;
    this.currentEndMonth = this.draftSnapshot.currentEndMonth;
    this.currentEndYear = this.draftSnapshot.currentEndYear;
    this.validation = this.draftSnapshot.validation;
    this.validationMessage = this.draftSnapshot.validationMessage;

    this.syncMonthYearSelectors();
    this.syncInputAndPanelFromState();
    this.updateSelectedRange();
    this.updateDisplayedDateRange();
    this.updateOkButtonState();

    requestAnimationFrame(() => this.syncWarningMessage());
  }

  private _setDefaultTimes() {
    this.startTime = this.isTwentyFourHourFormat ? '00:00' : '12:00';
    this.endTime = this.isTwentyFourHourFormat ? '00:00' : '12:00';
    this.startAmPm = 'PM';
    this.endAmPm = 'PM';
  }

  private computePlaceholder(): string {
    if (this.placeholder) return this.placeholder;

    if (this.showIso) {
      return 'YYYY-MM-DDT00:00:00.000Z - YYYY-MM-DDT00:00:00.000Z';
    }
    if (this.showLong) {
      return 'Day, Month, Year 00:00 - Day, Month, Year 00:00';
    }
    if (this.showYmd) {
      return 'YYYY-MM-DD 00:00 - YYYY-MM-DD 00:00';
    }

    const timeMask = this.isTwentyFourHourFormat ? 'HH:MM' : 'HH:MM AM/PM';
    return `${this.dateFormat} ${timeMask} ${this.joinBy} ${this.dateFormat} ${timeMask}`;
  }

  private syncMonthYearSelectors() {
    const root = this.el;
    if (!root) return;

    const monthSelect = root.querySelector(`#${this.monthSelectId}`) as HTMLSelectElement | null;
    const yearSelect = root.querySelector(`#${this.yearSelectId}`) as HTMLSelectElement | null;

    if (monthSelect) monthSelect.value = String(this.currentStartMonth);
    if (yearSelect) yearSelect.value = String(this.currentStartYear);
  }

  private joinIdRefs(...vals: Array<string | undefined | null>) {
    const tokens: string[] = [];
    for (const v of vals) {
      const raw = String(v ?? '').trim();
      if (!raw) continue;
      tokens.push(
        ...raw
          .split(/\s+/)
          .map(t => t.trim())
          .filter(Boolean),
      );
    }
    const seen = new Set<string>();
    const out = tokens.filter(t => (seen.has(t) ? false : (seen.add(t), true)));
    return out.length ? out.join(' ') : undefined;
  }

  private syncInputValue(nextValue: string) {
    const safe = String(nextValue ?? '');
    this.value = safe;
    this.el.setAttribute('value', safe);

    if (this.inputEl) {
      this.inputEl.value = safe;
      this.inputEl.setAttribute('value', safe);
    }
  }

  private openDropdown = () => {
    this.captureDraftSnapshot();
    this.dropdownOpen = true;
    this.userNavigated = false;
    this.createPopperInstance();
    this.updateOkButtonState();

    const wrapper = this.el.querySelector('.calendar-wrapper');
    if (wrapper) {
      wrapper.addEventListener('keydown', this.handleKeyDown as any);
      wrapper.addEventListener('focus', this.handleWrapperFocus as any);
      Array.from(this.el.querySelectorAll('.dp-calendar')).forEach(cal => {
        cal.addEventListener('focus', this.handleCalendarFocus as any);
        cal.addEventListener('focusout', this.handleCalendarFocusOut as any);
      });
    }

    requestAnimationFrame(() => this.syncWarningMessage());
    setTimeout(() => this.dropdownContentEl?.focus(), 0);
  };

  private closeDropdown = (restoreDraft = true) => {
    if (restoreDraft) {
      this.restoreDraftSnapshot();
    } else {
      this.clearDraftSnapshot();
    }

    this.dropdownOpen = false;
    requestAnimationFrame(() => this.syncWarningMessage());
    this.destroyPopper();
  };

  private toggleDropdown = (e: Event) => {
    e.stopPropagation();
    if (this.disabled) return;

    if (this.dropdownOpen) {
      this.closeDropdown(true);
    } else {
      if (this.startDate) {
        this.currentStartMonth = this.startDate.getUTCMonth();
        this.currentStartYear = this.startDate.getUTCFullYear();
        const end = this.endDate ?? new Date(Date.UTC(this.currentStartYear, (this.currentStartMonth + 1) % 12, 1));
        this.currentEndMonth = end.getUTCMonth();
        this.currentEndYear = end.getUTCFullYear();
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
    const path = (ev.composedPath && ev.composedPath()) || [];
    const clickInside = path.includes(this.el);
    if (!clickInside) {
      this.closeDropdown(true);
    }
  };

  private getFirstDayOfMonth(year: number, month0b: number) {
    return new Date(Date.UTC(year, month0b, 1)).getUTCDay();
  }

  private setVisualFocusFirstDayOfStartMonth = () => {
    const firstDaySpan = this.el.querySelector('.dp-calendar:first-child .calendar-grid-item.csm-first-day span') as HTMLElement | null;
    this.clearAllFocus();
    if (firstDaySpan) {
      firstDaySpan.classList.add('focus');
      const dateStr = (firstDaySpan.parentElement as HTMLElement).getAttribute('data-date');
      if (dateStr) this.focusedDate = new Date(`${dateStr}T00:00:00Z`);
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

  private isValidTimeValue(time: string): boolean {
    if (!/^\d{2}:\d{2}$/.test(time)) return false;

    const [hhRaw, mmRaw] = time.split(':');
    const hh = parseInt(hhRaw, 10);
    const mm = parseInt(mmRaw, 10);

    if (Number.isNaN(hh) || Number.isNaN(mm)) return false;
    if (mm < 0 || mm > 59) return false;

    if (this.isTwentyFourHourFormat) {
      return hh >= 0 && hh <= 23;
    }

    return hh >= 1 && hh <= 12;
  }

  private hasInvalidTimeFields(): boolean {
    const startHasValue = this.startTime.trim().length > 0;
    const endHasValue = this.endTime.trim().length > 0;

    return (startHasValue && !this.isValidTimeValue(this.startTime)) || (endHasValue && !this.isValidTimeValue(this.endTime));
  }

  private hasEmptyTimeFields(): boolean {
    return !this.startTime || !this.endTime;
  }

  private hasBlockingTimeIssue(): boolean {
    return this.hasEmptyTimeFields() || this.hasInvalidTimeFields();
  }

  private buildIsoDateTime(date: Date | null, time: string, ampm?: 'AM' | 'PM'): string | null {
    if (!date) return null;
    if (!this.isValidTimeValue(time)) return null;

    const dateIso = date.toISOString().split('T')[0];
    const time24 = this.formatTimeForStorage(time, ampm);
    if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(time24)) return null;

    const isoString = `${dateIso}T${time24}:00Z`;
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    try {
      return d.toISOString();
    } catch {
      return null;
    }
  }

  private formatForOutput(date: Date | null, time?: string, ampm?: 'AM' | 'PM'): string {
    if (!date) return 'N/A';
    if (this.showIso) {
      const iso = this.buildIsoDateTime(date, time || '00:00', ampm);
      return iso ?? 'N/A';
    }
    if (this.showLong) return this.formatDateLong(date);
    if (this.showYmd) return this.formatDateYmd(date);
    return this.formatDate(date, this.dateFormat);
  }

  private formatTimeForDisplay(time: string, ampm: 'AM' | 'PM'): string {
    return this.isTwentyFourHourFormat ? time : `${time} ${ampm}`;
  }

  private formatTimeForStorage(time: string, ampm?: 'AM' | 'PM'): string {
    if (!time) return '';
    let [hh, mm] = time.split(':');
    let h = parseInt(hh, 10);
    if (Number.isNaN(h) || !mm) return '';
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${mm}`;
  }

  private durationFromParts(): string {
    if (!this.startDate || !this.endDate || !this.startTime || !this.endTime) return '';
    if (!this.isValidTimeValue(this.startTime) || !this.isValidTimeValue(this.endTime)) return '';
    const sIso = this.buildIsoDateTime(this.startDate, this.startTime, this.startAmPm);
    const eIso = this.buildIsoDateTime(this.endDate, this.endTime, this.endAmPm);
    if (!sIso || !eIso) return '';
    const start = new Date(sIso).getTime();
    const end = new Date(eIso).getTime();
    const diffMs = Math.max(0, end - start);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  }

  private selectDate(date: Date) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = this.normalizeDate(date);
      this.endDate = null;
    } else {
      if (date >= this.startDate) this.endDate = this.normalizeDate(date);
      else {
        this.startDate = this.normalizeDate(date);
        this.endDate = null;
      }
    }
    this.updateSelectedRange();
    this.updateDisplayedDateRange();
    this.updateOkButtonState();
    this.updateActiveDateElements();
    this._updateDuration();
    this.emitIfCompleteAndValid('calendar');
  }

  private updateOkButtonState() {
    const hasAnySelection = !!this.startDate || !!this.endDate || !!this.startTime || !!this.endTime;

    if (!hasAnySelection) {
      this.okButtonLabel = 'Close';
      return;
    }

    const startValid = !!this.startDate && !!this.startTime && this.isValidTimeValue(this.startTime);
    const endValid = !!this.endDate && !!this.endTime && this.isValidTimeValue(this.endTime);

    this.okButtonLabel = startValid && endValid ? 'OK' : 'Close';
  }

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

  private escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private monthIndex(name: string): number | null {
    const m = name.toLowerCase();
    const full = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const idx = full.indexOf(m);
    if (idx >= 0) return idx;
    const short = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'];
    const sidx = short.indexOf(m);
    if (sidx >= 0) {
      if (m === 'sept') return 8;
      const mapShort = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 } as const;
      return (mapShort as any)[m];
    }
    return null;
  }

  private parseLongDate(dateStr: string): Date | null {
    const s = dateStr.trim().replace(/\s+/g, ' ');
    const m = /^(?:[A-Za-z]+\s*,\s*)?([A-Za-z]+)\s+(\d{1,2})\s*,\s*(\d{4})$/.exec(s);
    if (!m) return null;
    const mi = this.monthIndex(m[1]);
    if (mi == null) return null;
    const day = parseInt(m[2], 10);
    const year = parseInt(m[3], 10);
    const dt = new Date(Date.UTC(year, mi, day));
    if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== mi || dt.getUTCDate() !== day) return null;
    return dt;
  }

  private parseNumericDate(dateStr: string): Date | null {
    const s = dateStr.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y, m, d] = s.split('-').map(n => parseInt(n, 10));
      const dt = new Date(Date.UTC(y, m - 1, d));
      return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d ? dt : null;
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
      const [mm, dd, yyyy] = s.split('-').map(n => parseInt(n, 10));
      const dt = new Date(Date.UTC(yyyy, mm - 1, dd));
      return dt.getUTCFullYear() === yyyy && dt.getUTCMonth() === mm - 1 && dt.getUTCDate() === dd ? dt : null;
    }
    return null;
  }

  private parseDateFromDisplayed(dateStr: string): Date | null {
    if (this.showLong) return this.parseLongDate(dateStr);
    return this.parseNumericDate(dateStr);
  }

  private buildRangePattern(): RegExp {
    const sep = this.escapeRegex(this.joinBy.trim());
    const altSep = `\\s*(?:${sep}|to|-)\\s*`;

    const iso = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}(?::\\d{2}(?:\\.\\d+)?)?(?:Z|[+-]\\d{2}:?\\d{2})?';
    const longDate = '(?:[A-Za-z]+\\s*,\\s*)?[A-Za-z]+\\s+\\d{1,2}\\s*,\\s*\\d{4}';
    const ymd = '\\d{4}-\\d{2}-\\d{2}';
    const mdy = '\\d{2}-\\d{2}-\\d{4}';

    const t24 = '(?:[0-1]?\\d|2[0-3]):[0-5]\\d';
    const t12 = '(?:0?[1-9]|1[0-2]):[0-5]\\d\\s?(?:AM|PM)';

    if (this.showIso) {
      return new RegExp(`^\\s*(${iso})${altSep}(${iso})\\s*(?:\\([^)]*\\))?\\s*$`, 'i');
    }

    if (this.showLong) {
      const time = this.isTwentyFourHourFormat ? t24 : t12;
      return new RegExp(`^\\s*(${longDate})\\s+(${time})${altSep}(${longDate})\\s+(${time})\\s*(?:\\([^)]*\\))?\\s*$`, 'i');
    }

    const numericEither = `(?:${ymd}|${mdy})`;
    const time = this.isTwentyFourHourFormat ? t24 : t12;
    return new RegExp(`^\\s*(${numericEither})\\s+(${time})${altSep}(${numericEither})\\s+(${time})\\s*(?:\\([^)]*\\))?\\s*$`, 'i');
  }

  private parseTimePiece(timeStr: string): { time: string; ampm?: 'AM' | 'PM' } | null {
    const t = timeStr.trim().toUpperCase();
    if (this.isTwentyFourHourFormat) {
      const m = /^([0-1]?\d|2[0-3]):([0-5]\d)$/.exec(t);
      if (!m) return null;
      const hh = m[1].padStart(2, '0');
      return { time: `${hh}:${m[2]}` };
    }
    const m = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/.exec(t);
    if (!m) return null;
    const hh = String(parseInt(m[1], 10)).padStart(2, '0');
    return { time: `${hh}:${m[2]}`, ampm: m[3] as 'AM' | 'PM' };
  }

  private validateInput(val: string) {
    if (!val) {
      this.validation = this.required;
      this.validationMessage = this.required ? 'This field is required.' : '';
      return;
    }
    const ok = this.buildRangePattern().test(val);
    if (!ok) {
      this.validation = true;
      this.validationMessage = 'Please enter a valid date/time range.';
    } else {
      this.validation = false;
      this.validationMessage = '';
    }
  }

  private handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const raw = target.value || '';
    const inputValue = raw.trim();

    if (inputValue === '') {
      this.clearInputField();
      this.validation = this.required;
      this.validationMessage = this.required ? 'This field is required.' : '';
      this.syncInputValue('');
      return;
    }

    const pattern = this.buildRangePattern();
    const match = pattern.exec(inputValue);

    if (!match) {
      const hasSep = inputValue.includes(this.joinBy) || /\sto\s/i.test(inputValue) || /\s-\s/.test(inputValue);
      if (!hasSep) {
        this.validation = false;
        this.validationMessage = '';
        this.syncInputValue(inputValue);
        return;
      }
      this.validateInput(inputValue);
      this.syncInputValue(inputValue);
      return;
    }

    if (this.showIso) {
      const leftIso = match[1];
      const rightIso = match[2];

      const s = new Date(leftIso);
      const eDate = new Date(rightIso);
      if (isNaN(s.getTime()) || isNaN(eDate.getTime()) || s.getTime() > eDate.getTime()) {
        this.validation = true;
        this.validationMessage = 'Please enter a valid ISO date/time range.';
        this.syncInputValue(inputValue);
        return;
      }

      this.startDate = this.normalizeDate(s);
      this.endDate = this.normalizeDate(eDate);

      const sHHMM = s.toISOString().slice(11, 16);
      const eHHMM = eDate.toISOString().slice(11, 16);

      if (this.isTwentyFourHourFormat) {
        this.startTime = sHHMM;
        this.endTime = eHHMM;
      } else {
        const [sh, sm] = sHHMM.split(':').map(n => parseInt(n, 10));
        const [eh, em] = eHHMM.split(':').map(n => parseInt(n, 10));
        const sh12 = ((sh + 11) % 12) + 1;
        const eh12 = ((eh + 11) % 12) + 1;
        this.startTime = `${String(sh12).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
        this.endTime = `${String(eh12).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
        this.startAmPm = sh >= 12 ? 'PM' : 'AM';
        this.endAmPm = eh >= 12 ? 'PM' : 'AM';
      }

      if (!this.isValidTimeValue(this.startTime) || !this.isValidTimeValue(this.endTime)) {
        this.validation = true;
        this.validationMessage = 'Invalid time.';
        this.syncInputValue(inputValue);
        return;
      }

      this.realignCalendarsToStart();
      this.validation = false;
      this.validationMessage = '';
      this.durationText = this.showDuration ? this.durationFromParts() : '';
      this.updateSelectedRange();
      this.updateDisplayedDateRange();
      this.updateOkButtonState();

      const normalized = `${s.toISOString()} ${this.joinBy} ${eDate.toISOString()}${this.durationText ? ` (${this.durationText})` : ''}`;
      this.syncInputValue(normalized);

      this.emitIfCompleteAndValid('input');
      return;
    }

    const leftDateStr = match[1];
    const leftTimeStr = match[2];
    const rightDateStr = match[3];
    const rightTimeStr = match[4];

    const sDate = this.parseDateFromDisplayed(leftDateStr);
    const eDate = this.parseDateFromDisplayed(rightDateStr);
    const sTimeParts = this.parseTimePiece(leftTimeStr);
    const eTimeParts = this.parseTimePiece(rightTimeStr);

    if (!sDate || !eDate || !sTimeParts || !eTimeParts) {
      this.validation = true;
      this.validationMessage = 'Please enter a valid date/time range.';
      this.syncInputValue(inputValue);
      return;
    }

    if (!this.isValidTimeValue(sTimeParts.time) || !this.isValidTimeValue(eTimeParts.time)) {
      this.validation = true;
      this.validationMessage = 'Invalid time.';
      this.syncInputValue(inputValue);
      return;
    }

    const sIso = this.buildIsoDateTime(sDate, sTimeParts.time, sTimeParts.ampm)!;
    const eIso = this.buildIsoDateTime(eDate, eTimeParts.time, eTimeParts.ampm)!;
    if (!sIso || !eIso || new Date(sIso).getTime() > new Date(eIso).getTime()) {
      this.validation = true;
      this.validationMessage = 'Start must be before end.';
      this.syncInputValue(inputValue);
      return;
    }

    this.startDate = this.normalizeDate(sDate);
    this.endDate = this.normalizeDate(eDate);
    this.startTime = sTimeParts.time;
    this.endTime = eTimeParts.time;
    if (!this.isTwentyFourHourFormat) {
      this.startAmPm = sTimeParts.ampm!;
      this.endAmPm = eTimeParts.ampm!;
    }

    this.realignCalendarsToStart();

    const sDateLabel = this.formatForOutput(this.startDate, this.startTime, this.startAmPm);
    const eDateLabel = this.formatForOutput(this.endDate, this.endTime, this.endAmPm);
    const sTimeDisplay = this.formatTimeForDisplay(this.startTime, this.startAmPm);
    const eTimeDisplay = this.formatTimeForDisplay(this.endTime, this.endAmPm);

    this.durationText = this.showDuration ? this.durationFromParts() : '';

    const summary = `${sDateLabel} ${sTimeDisplay} ${this.joinBy} ${eDateLabel} ${eTimeDisplay}${this.durationText ? ` (${this.durationText})` : ''}`;

    this.syncInputValue(summary);

    this.validation = false;
    this.validationMessage = '';
    this.updateSelectedRange();
    this.updateDisplayedDateRange();
    this.updateOkButtonState();

    this.emitIfCompleteAndValid('input');
  };

  private realignCalendarsToStart() {
    if (!this.startDate) return;
    this.currentStartMonth = this.startDate.getUTCMonth();
    this.currentStartYear = this.startDate.getUTCFullYear();
    const end = this.endDate ?? new Date(Date.UTC(this.currentStartYear, (this.currentStartMonth + 1) % 12, 1));
    this.currentEndMonth = end.getUTCMonth();
    this.currentEndYear = end.getUTCFullYear();
    if (this.currentStartMonth === this.currentEndMonth && this.currentStartYear === this.currentEndYear) {
      this.currentEndMonth = (this.currentStartMonth + 1) % 12;
      this.currentEndYear = this.currentStartMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;
    }
    this.syncMonthYearSelectors();
  }

  private emitIfCompleteAndValid(_source: 'time' | 'input' | 'calendar' = 'time') {
    if (!(this.startDate && this.endDate && this.startTime && this.endTime)) return;
    if (!this.isValidTimeValue(this.startTime) || !this.isValidTimeValue(this.endTime)) return;

    const startISO = this.buildIsoDateTime(this.startDate, this.startTime, this.startAmPm);
    const endISO = this.buildIsoDateTime(this.endDate, this.endTime, this.endAmPm);
    if (!startISO || !endISO) return;

    const sDateLabel = this.formatForOutput(this.startDate, this.startTime, this.startAmPm);
    const eDateLabel = this.formatForOutput(this.endDate, this.endTime, this.endAmPm);
    const sTimeDisplay = this.formatTimeForDisplay(this.startTime, this.startAmPm);
    const eTimeDisplay = this.formatTimeForDisplay(this.endTime, this.endAmPm);

    this.dateTimeUpdated.emit({
      startDate: sDateLabel,
      endDate: eDateLabel,
      startTime: sTimeDisplay,
      endTime: eTimeDisplay,
      duration: this.durationText,
      startDateIso: this.startDate.toISOString().split('T')[0],
      endDateIso: this.endDate.toISOString().split('T')[0],
      startDateTimeIso: startISO,
      endDateTimeIso: endISO,
    });

    this.syncInputFromState();
  }

  private _handleOkClick = () => {
    if (this.okButtonLabel === 'Close') {
      this.closeDropdown(true);
      return;
    }

    if (!(this.startDate && this.endDate && this.startTime && this.endTime)) {
      this.syncWarningMessage();
      return;
    }

    if (!this.isValidTimeValue(this.startTime) || !this.isValidTimeValue(this.endTime)) {
      this.validation = true;
      this.validationMessage = 'Invalid time.';
      this.syncWarningMessage();
      return;
    }

    this.durationText = this.showDuration ? this.durationFromParts() : '';
    this.syncInputFromState();
    this.emitIfCompleteAndValid('input');

    this.validation = false;
    this.validationMessage = '';

    this.clearDraftSnapshot();
    this.closeDropdown(false);
    this.syncMonthYearSelectors();
  };

  private syncInputFromState() {
    if (!(this.startDate && this.endDate)) return;
    if (!this.isValidTimeValue(this.startTime) || !this.isValidTimeValue(this.endTime)) return;

    if (this.showIso) {
      const startISO = this.buildIsoDateTime(this.startDate, this.startTime, this.startAmPm);
      const endISO = this.buildIsoDateTime(this.endDate, this.endTime, this.endAmPm);
      if (!startISO || !endISO) return;
      const summary = `${startISO} ${this.joinBy} ${endISO}${this.durationText ? ` (${this.durationText})` : ''}`;
      this.syncInputValue(summary);
      return;
    }

    const sDateLabel = this.formatForOutput(this.startDate, this.startTime, this.startAmPm);
    const eDateLabel = this.formatForOutput(this.endDate, this.endTime, this.endAmPm);
    const sTimeDisplay = this.formatTimeForDisplay(this.startTime, this.startAmPm);
    const eTimeDisplay = this.formatTimeForDisplay(this.endTime, this.endAmPm);

    const summary = `${sDateLabel} ${sTimeDisplay} ${this.joinBy} ${eDateLabel} ${eTimeDisplay}${this.durationText ? ` (${this.durationText})` : ''}`;
    this.syncInputValue(summary);
  }

  private syncInputAndPanelFromState() {
    this.updateDisplayedDateRange();
    this.syncInputFromState();
  }

  private setDefaultWarningMessage() {
    this.validation = this.validation;
  }

  private clearInputField = () => {
    this.clearAllFocus();
    this.startDate = null;
    this.endDate = null;
    this._setDefaultTimes();
    this.durationText = '';

    this.syncInputValue('');

    if (this.required) {
      this.validation = true;
      this.validationMessage = 'This field is required.';
    } else {
      this.validation = false;
      this.validationMessage = '';
    }

    const now = new Date();
    this.currentStartMonth = now.getMonth();
    this.currentStartYear = now.getFullYear();
    this.currentEndMonth = (this.currentStartMonth + 1) % 12;
    this.currentEndYear = this.currentStartMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;

    this.userNavigated = false;

    this.syncMonthYearSelectors();
    this.updateSelectedRange();
    this.updateDisplayedDateRange();
    this.updateActiveDateElements();
    this.updateOkButtonState();
    this.syncWarningMessage();
  };

  private resetCalendar = () => {
    this.clearInputField();
  };

  private updateSelectedRange() {}

  private _updateDuration() {
    if (!this.showDuration) return;
    this.durationText = this.durationFromParts();
    const dur = this.el.querySelector('.duration') as HTMLElement | null;
    if (dur) dur.textContent = this.durationText ? `(${this.durationText})` : '';
  }

  private updateDisplayedDateRange() {
    const root = this.el;
    if (!root) return;

    const sEl = root.querySelector('.start-date') as HTMLElement | null;
    const eEl = root.querySelector('.end-date') as HTMLElement | null;
    const startTimeInput = root.querySelector(`#${this.startTimeId}`) as HTMLInputElement | null;
    const endTimeInput = root.querySelector(`#${this.endTimeId}`) as HTMLInputElement | null;

    if (sEl) sEl.textContent = this.formatForOutput(this.startDate, this.startTime, this.startAmPm);
    if (eEl) eEl.textContent = this.formatForOutput(this.endDate, this.endTime, this.endAmPm);

    if (startTimeInput && startTimeInput.value !== this.startTime) {
      startTimeInput.value = this.startTime || '';
      startTimeInput.setAttribute('value', this.startTime || '');
    }
    if (endTimeInput && endTimeInput.value !== this.endTime) {
      endTimeInput.value = this.endTime || '';
      endTimeInput.setAttribute('value', this.endTime || '');
    }

    const dur = root.querySelector('.duration') as HTMLElement | null;
    if (dur) dur.textContent = this.showDuration ? (this.durationText ? `(${this.durationText})` : '') : '';
  }

  private updateActiveDateElements() {
    return;
  }

  private addFocusClass = () => {
    if (this.readOnly || this.disabled) return;
    const grp = this.el.querySelector('.input-group');
    if (grp) grp.classList.add('focus');
  };

  private removeFocusClass = () => {
    const grp = this.el.querySelector('.input-group');
    if (grp) grp.classList.remove('focus');
  };

  private showAsRequired() {
    const haveAll = !!this.startDate && !!this.endDate && !!this.startTime && !!this.endTime && this.isValidTimeValue(this.startTime) && this.isValidTimeValue(this.endTime);
    return this.required && !haveAll;
  }

  private isHorizontal() {
    return this.formLayout === 'horizontal';
  }

  private isInline() {
    return this.formLayout === 'inline';
  }

  private labelClassBase() {
    return [
      'form-control-label',
      this.readOnly ? 'read-only' : this.disabled ? '' : this.showAsRequired() ? 'required' : '',
      this.labelHidden ? 'sr-only visually-hidden' : '',
      this.labelAlign === 'right' ? 'align-right' : '',
      this.readOnly ? 'read-only' : this.disabled ? '' : this.validation ? 'invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private labelClassHorizontal(labelColClass: string) {
    return [this.labelClassBase(), labelColClass, 'no-padding', 'col-form-label'].filter(Boolean).join(' ');
  }

  private groupSizeClass() {
    return this.size === 'sm' ? 'input-group-sm' : this.size === 'lg' ? 'input-group-lg' : '';
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
      if (t === 'col') out.push('col');
    }
    return Array.from(new Set(out)).join(' ');
  }

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

    if (this.isInline()) return spec ? this.parseColsSpec(spec) : '';
    return '';
  }

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
        '[date-range-time-picker-component] For formLayout="horizontal", labelCol + inputCol must equal 12. ' +
          `Received: ${this.labelCol} + ${this.inputCol} = ${Number(this.labelCol) + Number(this.inputCol)}. Falling back to 2/10.`,
      );
      return { label: DEFAULT_LABEL, input: DEFAULT_INPUT };
    }

    return { label, input };
  }

  private handleDayPointer = (ev: MouseEvent) => {
    const cell = ev.currentTarget as HTMLElement | null;
    if (!cell) return;

    if (cell.classList.contains('previous-month-day') || cell.classList.contains('next-month-day')) return;

    const dataDate = cell.getAttribute('data-date');
    if (!dataDate) return;

    const date = new Date(`${dataDate}T00:00:00Z`);

    this.clearAllFocus();
    const span = cell.querySelector('span') as HTMLElement | null;
    if (span) span.classList.add('focus');
    cell.focus();

    this.focusedDate = date;
    this.userNavigated = true;
    this.updateActiveDateElements();

    this.selectDate(date);
  };

  private handleKeyDown = async (event: KeyboardEvent) => {
    const calendarWrapper = this.el.querySelector('.calendar-wrapper') as HTMLElement | null;
    const active = (this.el.getRootNode() as Document | ShadowRoot)['activeElement'] as HTMLElement | null;
    const isWrapperFocused = active === calendarWrapper;

    if (isWrapperFocused && event.key.startsWith('Arrow')) {
      event.preventDefault();
      if (!this.el.querySelector('.calendar-grid-item span.focus')) {
        this.setVisualFocusFirstDayOfStartMonth();
      }
      this.activateFirstFocusableCell();

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
    if (!currentFocus || !this.el.contains(currentFocus)) currentFocus = null;

    const calendarCells = Array.from(calendarGrids).flatMap(
      grid => Array.from(grid.querySelectorAll('.calendar-grid-item:not(.previous-month-day):not(.next-month-day)')) as HTMLElement[],
    );

    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
      let index = currentFocus ? calendarCells.indexOf(currentFocus) : -1;

      if (index === -1) {
        const spanFocus = this.el.querySelector('.calendar-grid-item span.focus') as HTMLElement | null;
        const cellFromSpan = spanFocus ? (spanFocus.parentElement as HTMLElement) : null;
        if (cellFromSpan) index = calendarCells.indexOf(cellFromSpan);
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
      this.handleEnterKeyPress(event);
    }
  };

  private moveFocusToNewIndex(calendarCells: HTMLElement[], newIndex: number) {
    this.clearAllFocus();
    const targetCell = calendarCells[newIndex];
    if (!targetCell) return;
    if (targetCell.classList.contains('previous-month-day') || targetCell.classList.contains('next-month-day')) return;

    const targetSpan = targetCell.querySelector('span') as HTMLElement | null;
    if (targetSpan) {
      targetSpan.classList.add('focus');
      targetCell.focus();

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

  private handleWrapperFocus = (event: FocusEvent) => {
    if (event.target !== event.currentTarget) return;
    this.userNavigated = false;
    this.setVisualFocusFirstDayOfStartMonth();
  };

  private handleCalendarFocus = (event: FocusEvent) => {
    const calendarEl = event.currentTarget as HTMLElement | null;
    if (!calendarEl) return;
    if (event.target !== calendarEl) return;
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
      const dataDate = (targetSpan.parentElement as HTMLElement).getAttribute('data-date');
      if (dataDate) this.focusedDate = new Date(`${dataDate}T00:00:00Z`);
      this.updateActiveDateElements();
    }
  };

  private handleCalendarFocusOut = (event: FocusEvent) => {
    const calendarDiv = event.currentTarget as HTMLElement | null;
    const related = event.relatedTarget as Node | null;
    if (calendarDiv && related && calendarDiv.contains(related)) return;
    this.updateActiveDateElements();
  };

  private handleMonthChange = (ev: Event) => {
    const sel = ev.target as HTMLSelectElement;
    const selectedMonth = parseInt(sel.value, 10);
    this.currentStartMonth = selectedMonth;
    this.currentEndMonth = (selectedMonth + 1) % 12;
    this.currentEndYear = selectedMonth === 11 ? this.currentStartYear + 1 : this.currentStartYear;
    this.userNavigated = false;
    this.syncMonthYearSelectors();
    setTimeout(this.setVisualFocusFirstDayOfStartMonth, 0);
  };

  private handleYearChange = (ev: Event) => {
    const sel = ev.target as HTMLSelectElement;
    const selectedYear = parseInt(sel.value, 10);
    this.currentStartYear = selectedYear;
    this.currentEndYear = this.currentStartMonth === 11 ? selectedYear + 1 : selectedYear;
    this.userNavigated = false;
    this.syncMonthYearSelectors();
    setTimeout(this.setVisualFocusFirstDayOfStartMonth, 0);
  };

  private handleFocus = () => this.addFocusClass();
  private handleBlur = () => this.removeFocusClass();

  private preserveCursorAndSetValue(target: HTMLInputElement, nextValue: string, previousSelectionStart: number) {
    target.value = nextValue;

    const digitsBeforeCaret = target.value.slice(0, Math.max(0, previousSelectionStart)).replace(/[^0-9]/g, '').length;

    let caret = 0;
    let seenDigits = 0;

    while (caret < nextValue.length && seenDigits < digitsBeforeCaret) {
      if (/\d/.test(nextValue.charAt(caret))) seenDigits += 1;
      caret += 1;
    }

    requestAnimationFrame(() => {
      try {
        target.setSelectionRange(caret, caret);
      } catch {
        return;
      }
    });
  }

  private onTimeInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const type = target.getAttribute('data-type');
    const rawValue = target.value;
    const previousSelectionStart = target.selectionStart ?? rawValue.length;

    let input = rawValue.replace(/[^0-9]/g, '');

    if (input.length === 0) {
      target.value = '';
      if (type === 'start') this.startTime = '';
      else this.endTime = '';
      this.validation = false;
      this.validationMessage = '';
      this._validateTimePresence();
      this._updateDuration();
      this.updateOkButtonState();
      return;
    }

    if (input.length >= 2) input = input.slice(0, 2) + ':' + (input.slice(2, 4) || '');
    input = input.substring(0, 5);

    this.preserveCursorAndSetValue(target, input, previousSelectionStart);

    if (type === 'start') this.startTime = input;
    else this.endTime = input;

    if (this.hasInvalidTimeFields()) {
      this.validation = true;
      this.validationMessage = 'Invalid time.';
    } else {
      this.validation = false;
      this.validationMessage = '';
    }

    this._validateTimePresence();
    this._updateDuration();
    this.updateOkButtonState();
    this.updateDisplayedDateRange();

    if (this.startDate && this.endDate && this.startTime && this.endTime && !this.hasInvalidTimeFields()) {
      this.syncInputFromState();
      this.updateDisplayedDateRange();
      this.emitIfCompleteAndValid('time');
    }
  };

  private onToggleAmPm = (e: MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const type = btn.getAttribute('data-type');
    if (type === 'start') this.startAmPm = this.startAmPm === 'AM' ? 'PM' : 'AM';
    else this.endAmPm = this.endAmPm === 'AM' ? 'PM' : 'AM';

    if (this.hasInvalidTimeFields()) {
      this.validation = true;
      this.validationMessage = 'Invalid time.';
    } else {
      this.validation = false;
      this.validationMessage = '';
    }

    this._updateDuration();
    this.updateOkButtonState();
  };

  private syncWarningMessage() {
    const warn = this.el.querySelector('.warning-message') as HTMLElement | null;
    if (!warn) return;

    let text = '';
    if (this.dropdownOpen && this.hasEmptyTimeFields()) {
      text = 'Times cannot be empty.';
    } else if (this.dropdownOpen && this.hasInvalidTimeFields()) {
      text = 'Invalid time.';
    }

    this.warningMessage = text;
    warn.textContent = text;
    warn.classList.toggle('hide', !text);
  }

  private _validateTimePresence() {
    this.syncWarningMessage();
  }

  private renderSelects(plumage = false) {
    const monthSelectEl = (
      <select
        id={this.monthSelectId}
        class="form-select form-control select-sm months"
        aria-labelledby={this.monthLabelId}
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
        id={this.yearSelectId}
        class="form-select form-control select-sm years"
        aria-labelledby={this.yearLabelId}
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
          <label id={this.monthLabelId} class="sr-only visually-hidden" htmlFor={this.monthSelectId}>
            Select month
          </label>
          {monthSelectEl}
          <label id={this.yearLabelId} class="sr-only visually-hidden" htmlFor={this.yearSelectId}>
            Select year
          </label>
          {yearSelectEl}
        </Fragment>
      );
    }

    return (
      <Fragment>
        <label id={this.monthLabelId} class="sr-only visually-hidden" htmlFor={this.monthSelectId}>
          Select month
        </label>
        <div class="input-container me-2" role="presentation">
          {monthSelectEl}
          <div class="b-underline" role="presentation">
            <div class="b-focus" role="presentation" aria-hidden="true" />
          </div>
        </div>

        <label id={this.yearLabelId} class="sr-only visually-hidden" htmlFor={this.yearSelectId}>
          Select year
        </label>
        <div class="input-container me-2" role="presentation">
          {yearSelectEl}
          <div class="b-underline" role="presentation">
            <div class="b-focus" role="presentation" aria-hidden="true" />
          </div>
        </div>
      </Fragment>
    );
  }

  private handleInputFocusStyle = (ev: FocusEvent) => {
    const target = ev.currentTarget as HTMLElement | null;
    const container = target?.closest('.input-container') as HTMLElement | null;
    const bf: HTMLElement | null =
      (container && (container.querySelector('.b-focus') as HTMLElement | null)) ||
      ((target?.closest('.plumage') as HTMLElement | null)?.querySelector('.b-underline .b-focus') as HTMLElement | null) ||
      (this.el.querySelector('.b-underline .b-focus') as HTMLElement | null);

    if (bf) {
      bf.style.width = '100%';
      bf.style.left = '0';
    }
  };

  private handleInputBlurStyle = (ev: FocusEvent) => {
    const target = ev.currentTarget as HTMLElement | null;
    const container = target?.closest('.input-container') as HTMLElement | null;
    const bf: HTMLElement | null =
      (container && (container.querySelector('.b-focus') as HTMLElement | null)) ||
      ((target?.closest('.plumage') as HTMLElement | null)?.querySelector('.b-underline .b-focus') as HTMLElement | null) ||
      (this.el.querySelector('.b-underline .b-focus') as HTMLElement | null);

    if (bf) {
      bf.style.width = '0';
      bf.style.left = '50%';
    }
  };

  private renderCalendar(month0b: number, year: number, which: 'start' | 'end') {
    const formattedMonthYear = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month0b, 1)));

    const gridId = `${this.ids}-grid-${which}`;
    const captionId = `${gridId}-caption`;

    return (
      <div class="calendar dp-calendar form-control h-auto text-center pt-2">
        <div id={captionId} aria-live="polite" aria-atomic="true" class="calendar-grid-caption text-center font-weight-bold">
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

        <div class="calendar-grid" role="grid" id={gridId} aria-roledescription="Calendar" aria-label={`Calendar for ${formattedMonthYear}`} aria-labelledby={captionId}>
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
        day = prevMonthLastDate - firstDayOfWeek + idx + 1;
        dataMonth = month0b === 0 ? 12 : month0b;
        dataYear = month0b === 0 ? year - 1 : year;
        itemClasses.push('previous-month-day');
        spanClasses.push('text-muted');
      } else if (date <= daysInMonth) {
        day = date++;
        const currentDate = new Date(Date.UTC(year, month0b, day));
        spanClasses.push('text-dark', 'font-weight-bold');

        if (day === 1) itemClasses.push(month0b === this.currentStartMonth ? 'csm-first-day' : 'cem-first-day');
        if (day === daysInMonth) itemClasses.push(month0b === this.currentStartMonth ? 'csm-last-day' : 'cem-last-day');

        if (this.isToday(currentDate)) spanClasses.push('current-day');
        if (this.isDateInRange(currentDate)) itemClasses.push('selected-range');
        if (this.isStartOrEndDate(currentDate)) itemClasses.push('selected-range-active');

        const fd = this.focusedDate;
        if (this.userNavigated && fd && currentDate.getTime() === Date.UTC(fd.getUTCFullYear(), fd.getUTCMonth(), fd.getUTCDate())) {
          spanClasses.push('focus');
        }
      } else {
        day = nextMonthDay++;
        dataMonth = month0b === 11 ? 1 : month0b + 2;
        dataYear = month0b === 11 ? year + 1 : year;
        itemClasses.push('next-month-day');
        spanClasses.push('text-muted');
      }

      if (!itemClasses.includes('selected-range') && !itemClasses.includes('selected-range-active')) {
        spanClasses.push('btn-outline-light');
      }

      ariaLabel = day
        ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(dataYear, dataMonth - 1, day)))
        : '';

      const dataDate = day ? `${dataYear}-${String(dataMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';

      const cell = (
        <div
          class={itemClasses.join(' ')}
          role="gridcell"
          tabIndex={-1}
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
        rows.push(
          <div role="row" class="calendar-grid-row" style={{ display: 'contents' }}>
            {currentRow}
          </div>,
        );
        currentRow = [];
      }
    }

    return <Fragment>{rows}</Fragment>;
  }

  private renderDateRangeTimePicker() {
    const sm = this.currentStartMonth;
    const sy = this.currentStartYear;
    const nm = (sm + 1) % 12;
    const ny = sm === 11 ? sy + 1 : sy;

    const showOk = !this.rangeTimePicker && this.showOkButton;

    return (
      <div class="date-picker">
        <div class="range-picker-wrapper">
          <div class="range-picker-nav mb-1" aria-label="Navigation controls">
            <button type="button" onClick={() => this.prevMonth()} class="range-picker-nav-btn btn-outline-secondary" aria-label="Previous month">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" aria-hidden="true" focusable="false">
                <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c-12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
              </svg>
            </button>

            <div class="selectors">
              {this.renderSelects(this.plumage)}

              <button
                type="button"
                onClick={() => this.el.dispatchEvent(new CustomEvent('reset-picker', { bubbles: true, composed: true }))}
                class="reset-btn"
                aria-label="Reset calendar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" focusable="false">
                  <path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"></path>
                </svg>
              </button>
            </div>

            <button type="button" onClick={() => this.nextMonth()} class="range-picker-nav-btn btn-outline-secondary" aria-label="Next month">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" aria-hidden="true" focusable="false">
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
              </svg>
            </button>
          </div>

          <div class="range-picker">
            <div class="calendar-wrapper" aria-label="Calendars" tabIndex={0}>
              {this.renderCalendar(sm, sy, 'start')}
              {this.renderCalendar(nm, ny, 'end')}
            </div>

            <footer class="border-top small text-center">
              <div class="small" aria-live="polite">
                Use cursor keys to navigate calendar dates
              </div>

              {this.isTwentyFourHourFormat === false && (
                <div class="small" aria-live="polite">
                  Click AM or PM to switch the time of day for each time.
                </div>
              )}
            </footer>

            <div class="date-range-display" role="region" aria-labelledby={this.dateRangesTitleId} tabIndex={0}>
              <div id={this.dateRangesTitleId} class="sr-only visually-hidden">
                Selected date and time range
              </div>

              <div class="date-ranges">
                <span class={`start-end-ranges${this.showIso ? ' iso' : this.showLong ? ' long' : ''}`}>
                  <span class="start-date">N/A</span>

                  <label id={this.startTimeLabelId} class="sr-only visually-hidden" htmlFor={this.startTimeId}>
                    Start time
                  </label>

                  {this.plumage ? (
                    <div class="input-container" role="presentation">
                      <input
                        id={this.startTimeId}
                        type="text"
                        class="form-control time-input"
                        value={this.startTime}
                        data-type="start"
                        maxLength={5}
                        inputMode="numeric"
                        autoComplete="off"
                        aria-labelledby={this.startTimeLabelId}
                        aria-describedby={this.joinIdRefs(this.warningId, this.validation ? this.validationId : undefined)}
                        aria-invalid={this.validation ? 'true' : undefined}
                        disabled={this.disabled}
                        onInput={this.onTimeInput}
                        onFocus={this.handleInputFocusStyle}
                        onBlur={this.handleInputBlurStyle}
                      />
                      <div class="b-underline" role="presentation">
                        <div class="b-focus" role="presentation" aria-hidden="true"></div>
                      </div>
                    </div>
                  ) : (
                    <input
                      id={this.startTimeId}
                      type="text"
                      class="form-control time-input"
                      value={this.startTime}
                      data-type="start"
                      maxLength={5}
                      inputMode="numeric"
                      autoComplete="off"
                      aria-labelledby={this.startTimeLabelId}
                      aria-describedby={this.joinIdRefs(this.warningId, this.validation ? this.validationId : undefined)}
                      aria-invalid={this.validation ? 'true' : undefined}
                      disabled={this.disabled}
                      onInput={this.onTimeInput}
                    />
                  )}

                  {!this.isTwentyFourHourFormat ? (
                    <button type="button" class="am-pm-toggle" onClick={this.onToggleAmPm} data-type="start" aria-label="Toggle start time AM/PM" disabled={this.disabled}>
                      {this.startAmPm}
                    </button>
                  ) : null}

                  <span class="to-spacing">{this.joinBy}</span>
                  <span class="end-date">N/A</span>

                  <label id={this.endTimeLabelId} class="sr-only visually-hidden" htmlFor={this.endTimeId}>
                    End time
                  </label>

                  {this.plumage ? (
                    <div class="input-container" role="presentation">
                      <input
                        id={this.endTimeId}
                        type="text"
                        class="form-control time-input"
                        value={this.endTime}
                        data-type="end"
                        maxLength={5}
                        inputMode="numeric"
                        autoComplete="off"
                        aria-labelledby={this.endTimeLabelId}
                        aria-describedby={this.joinIdRefs(this.warningId, this.validation ? this.validationId : undefined)}
                        aria-invalid={this.validation ? 'true' : undefined}
                        disabled={this.disabled}
                        onInput={this.onTimeInput}
                        onFocus={this.handleInputFocusStyle}
                        onBlur={this.handleInputBlurStyle}
                      />
                      <div class="b-underline" role="presentation">
                        <div class="b-focus" role="presentation" aria-hidden="true"></div>
                      </div>
                    </div>
                  ) : (
                    <input
                      id={this.endTimeId}
                      type="text"
                      class="form-control time-input"
                      value={this.endTime}
                      data-type="end"
                      maxLength={5}
                      inputMode="numeric"
                      autoComplete="off"
                      aria-labelledby={this.endTimeLabelId}
                      aria-describedby={this.joinIdRefs(this.warningId, this.validation ? this.validationId : undefined)}
                      aria-invalid={this.validation ? 'true' : undefined}
                      disabled={this.disabled}
                      onInput={this.onTimeInput}
                    />
                  )}

                  {!this.isTwentyFourHourFormat ? (
                    <button type="button" class="am-pm-toggle" onClick={this.onToggleAmPm} data-type="end" aria-label="Toggle end time AM/PM" disabled={this.disabled}>
                      {this.endAmPm}
                    </button>
                  ) : null}
                </span>

                {this.showDuration ? <span class="duration"></span> : null}
              </div>

              <div id={this.warningId} class="warning-message hide" aria-live="assertive"></div>
            </div>
          </div>

          {showOk ? (
            <div class="ok-button">
              <button
                type="button"
                onClick={this._handleOkClick}
                class="btn btn-primary"
                aria-label="Confirm or close date picker"
                disabled={this.disabled || (this.okButtonLabel === 'OK' && this.hasBlockingTimeIssue())}
              >
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
      <div id={this.dropdownId} class={`dropdown${this.dropdownOpen ? ' open' : ''}`} ref={el => (this.dropdownEl = el as HTMLDivElement)}>
        <div
          class="dropdown-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby={this.dialogTitleId}
          aria-describedby={this.dialogDescId}
          tabIndex={-1}
          ref={el => (this.dropdownContentEl = el as HTMLDivElement)}
          onClick={e => e.stopPropagation()}
        >
          <div id={this.dialogTitleId} class="sr-only visually-hidden">
            {this.ariaLabel || this.label || 'Date and time range picker'}
          </div>
          <div id={this.dialogDescId} class="sr-only visually-hidden">
            Select a start date and end date. Use arrow keys to navigate days. Press Enter to select. Enter times in HH:MM{this.isTwentyFourHourFormat ? '' : ' AM/PM'}.
          </div>

          {this.renderDateRangeTimePicker()}
        </div>
      </div>
    );
  }

  private renderInputGroupPlumage() {
    const isRow = this.isHorizontal() || this.isInline();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    this.getComputedCols();

    const groupClass = ['drtp', 'input-group', 'nowrap', this.groupSizeClass(), this.readOnly ? 'read-only' : this.disabled ? 'disabled' : this.validation ? ' is-invalid' : '']
      .filter(Boolean)
      .join(' ');
    const describedby = this.joinIdRefs(this.dialogDescId, this.validation ? this.validationId : undefined);

    return (
      <div class={this.formLayout ? this.formLayout : ''}>
        <div class={['form-group', 'form-input-group', this.formLayout || '', isRow ? 'row' : ''].filter(Boolean).join(' ')}>
          <label id={this.labelId} class={this.isHorizontal() ? this.labelClassHorizontal(labelColClass) : this.labelClassBase()} htmlFor={this.inputId}>
            <span class={this.readOnly || this.disabled ? '' : this.showAsRequired() ? 'required' : ''}>{text}</span>
            {this.readOnly || this.disabled ? null : this.required ? <span class="required">*</span> : null}
          </label>

          <div class={this.isHorizontal() ? inputColClass : undefined}>
            <div class={groupClass} role="group" aria-label="Date and time picker group" tabIndex={0}>
              {this.readOnly ? '' : this.prependProp ? (
                <button
                  type="button"
                  id={this.prependId || undefined}
                  onClick={this.toggleDropdown}
                  class={`calendar-button btn input-group-text pp-left${this.disabled ? '' : this.validation ? ' is-invalid' : ''}`}
                  aria-label="Toggle calendar picker"
                  aria-haspopup="dialog"
                  aria-expanded={this.dropdownOpen ? 'true' : 'false'}
                  aria-controls={this.dropdownId}
                  disabled={this.disabled || this.readOnly}
                  onFocus={this.handleInputFocusStyle}
                  onBlur={this.handleInputBlurStyle}
                >
                  <i class={this.icon} aria-hidden="true" />
                </button>
              ) : null}

              <div class="drp-input-field">
                <input
                  id={this.inputId}
                  ref={el => (this.inputEl = el as HTMLInputElement)}
                  type="text"
                  class={`form-control${this.readOnly ? ' read-only' : this.disabled ? '' : this.validation ? ' is-invalid' : ''}`}
                  placeholder={this.placeholderText}
                  value={this.value || ''}
                  onInput={this.handleInputChange}
                  aria-labelledby={this.labelId}
                  aria-describedby={describedby}
                  aria-required={this.required ? 'true' : undefined}
                  aria-invalid={this.validation ? 'true' : undefined}
                  aria-disabled={this.disabled ? 'true' : undefined}
                  aria-readonly={this.readOnly ? 'true' : undefined}
                  autoComplete="off"
                  disabled={this.disabled}
                  readOnly={this.readOnly}
                  onFocus={this.handleInputFocusStyle}
                />
                {this.readOnly || this.disabled ? (
                  ''
                ) : this.value ? (
                  <button type="button" onClick={() => this.clearInputField()} class="clear-input-button" aria-label="Clear date and time range" disabled={this.disabled}>
                    <i class="fas fa-times-circle" aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              {this.readOnly ? '' : this.appendProp ? (
                <button
                  type="button"
                  id={this.appendId || undefined}
                  onClick={this.toggleDropdown}
                  class={`calendar-button btn input-group-text${this.disabled ? '' : this.validation ? ' is-invalid' : ''}`}
                  aria-label="Toggle calendar picker"
                  aria-haspopup="dialog"
                  aria-expanded={this.dropdownOpen ? 'true' : 'false'}
                  aria-controls={this.dropdownId}
                  disabled={this.disabled || this.readOnly}
                  onFocus={this.handleInputFocusStyle}
                  onBlur={this.handleInputBlurStyle}
                >
                  <i class={this.icon} aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <div class={`b-underline${this.disabled || this.readOnly ? ' disabled' : this.validation ? ' invalid' : ''}`} role="presentation">
              <div class={`b-focus${this.disabled || this.readOnly ? ' disabled' : this.validation ? ' invalid' : ''}`} role="presentation" aria-hidden="true" />
            </div>

            {this.validation ? (
              this.warningMessage ? (
                <div id={this.validationId} class="invalid-feedback warning">
                  {this.warningMessage}
                </div>
              ) : (
                <div id={this.validationId} class="invalid-feedback validation">
                  {this.validationMessage}
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  private renderInputGroupClassic() {
    const isRow = this.isHorizontal() || this.isInline();

    const labelColClass = this.isHorizontal() && !this.labelHidden ? this.buildColClass('label') : '';
    const inputColClass = this.isHorizontal() ? this.buildColClass('input') || undefined : this.isInline() ? this.buildColClass('input') || undefined : undefined;

    const text = this.isHorizontal() || this.isInline() ? `${this.label}:` : this.label;

    this.getComputedCols();

    const groupClass = ['input-group', this.groupSizeClass(), this.readOnly ? 'read-only' : this.disabled ? 'disabled' : this.validation ? ' is-invalid' : ''].filter(Boolean).join(' ');
    const describedby = this.joinIdRefs(this.dialogDescId, this.validation ? this.validationId : undefined);

    return (
      <Fragment>
        <div class={['form-group', 'form-input-group-basic', this.formLayout, isRow ? 'row' : ''].filter(Boolean).join(' ')}>
          <label id={this.labelId} class={this.isHorizontal() ? this.labelClassHorizontal(labelColClass) : this.labelClassBase()} htmlFor={this.inputId}>
             <span class={this.readOnly || this.disabled ? '' : this.showAsRequired() ? 'required' : ''}>{text}</span>
              {this.readOnly || this.disabled ? null : this.required ? <span class="required">*</span> : null}
          </label>

          <div class={this.isHorizontal() ? inputColClass : undefined}>
            <div class={groupClass} role="group" aria-label="Date and time picker group">
              {this.readOnly ? '' : this.prependProp ? (
                <div class="input-group-prepend">
                  <button
                    type="button"
                    id={this.prependId || undefined}
                    onClick={this.toggleDropdown}
                    class={`calendar-button btn input-group-text${this.disabled ? 'disabled' : this.validation ? ' is-invalid' : ''}`}
                    aria-label="Toggle calendar picker"
                    aria-haspopup="dialog"
                    aria-expanded={this.dropdownOpen ? 'true' : 'false'}
                    aria-controls={this.dropdownId}
                    disabled={this.disabled || this.readOnly}
                  >
                    <i class={this.icon} aria-hidden="true" />
                  </button>
                </div>
              ) : null}

              <div class="drp-input-field">
                <input
                  id={this.inputId}
                  ref={el => (this.inputEl = el as HTMLInputElement)}
                  type="text"
                  class={`form-control${this.readOnly ? ' read-only' : this.disabled ? ' disabled' : this.validation ? ' is-invalid' : ''}`}
                  placeholder={this.placeholderText}
                  value={this.value || ''}
                  onInput={this.handleInputChange}
                  disabled={this.disabled}
                  readOnly={this.readOnly}
                  aria-labelledby={this.labelId}
                  aria-describedby={describedby}
                  aria-required={this.required ? 'true' : undefined}
                  aria-invalid={this.validation ? 'true' : undefined}
                  aria-disabled={this.disabled ? 'true' : undefined}
                  aria-readonly={this.readOnly ? 'true' : undefined}
                  autoComplete="off"
                />
                {this.readOnly || this.disabled ? (
                  ''
                ) : this.value ? (
                  <button type="button" onClick={() => this.clearInputField()} class="clear-input-button" aria-label="Clear date and time range" disabled={this.disabled}>
                    <i class="fas fa-times-circle" aria-hidden="true" />
                  </button>
                ) : null}
              </div>

              {this.readOnly ? '' : this.appendProp ? (
                <div class="input-group-append">
                  <button
                    type="button"
                    id={this.appendId || undefined}
                    onClick={this.toggleDropdown}
                    class={`calendar-button btn input-group-text${this.disabled ? 'disabled' : this.validation ? ' is-invalid' : ''}`}
                    aria-label="Toggle calendar picker"
                    aria-haspopup="dialog"
                    aria-expanded={this.dropdownOpen ? 'true' : 'false'}
                    aria-controls={this.dropdownId}
                    disabled={this.disabled || this.readOnly}
                  >
                    <i class={this.icon} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>

            {this.validation ? (
              this.warningMessage ? (
                <div id={this.validationId} class="invalid-feedback warning">
                  {this.warningMessage}
                </div>
              ) : (
                <div id={this.validationId} class="invalid-feedback validation">
                  {this.validationMessage}
                </div>
              )
            ) : null}
          </div>
        </div>
      </Fragment>
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

  render() {
    if (this.rangeTimePicker) return this.plumage ? <div class="plumage">{this.renderDateRangeTimePicker()}</div> : this.renderDateRangeTimePicker();
    return this.plumage ? <div class="plumage">{this.renderInputs()}</div> : this.renderInputs();
  }
}
