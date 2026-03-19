// src/components/timepicker/timepicker-component.tsx
import { Component, h, Prop, Element, State, Method, Fragment, Listen } from '@stencil/core';

type TimePart = 'hour' | 'minute' | 'second' | 'ampm';

@Component({
  tag: 'timepicker-component',
  styleUrls: [
    './timepicker-styles.scss',
    '../utilities-styles.scss',
    '../button/button.scss',
    '../input-group/input-group-styles.scss',
    '../input-group/input-group-styles.scss',
    '../input-field/input-field-styles.scss',
  ],
  shadow: false,
})
export class TimePickerComponent {
  @Element() host!: HTMLElement;

  /** Accessible label for the input (used when no aria-labelledby is provided and no visible label). */
  @Prop() ariaLabel: string = 'Time Picker';

  /**
   * ID(s) of the element(s) that label the timepicker input (space-separated).
   * If omitted, component will auto-generate an internal label id when showLabel=true.
   */
  @Prop() ariaLabelledby: string = '';

  /** Optional: external description/help ids (space-separated). */
  @Prop() ariaDescribedby: string = '';

  @Prop() showLabel?: boolean;
  @Prop() labelText: string = 'Enter Time';

  /** ID passed to the internal input */
  @Prop() inputId: string = 'time-input';

  /** Name attribute for the inner input */
  @Prop() inputName: string = 'time';

  /** Use 24-hour format by default (mutable: toggled by the component) */
  @Prop({ mutable: true }) isTwentyFourHourFormat: boolean = true;

  /** Optional size variant: '', 'sm', 'lg' */
  @Prop() size: string = '';

  /** External invalid styling hook (kept for compatibility) */
  @Prop() validation?: boolean = false;

  /** Validation message to show (mutable: set/cleared by the component) */
  @Prop({ mutable: true }) validationMessage: string = '';

  /** Force show only 24-hour controls/options */
  @Prop() twentyFourHourOnly: boolean = false;

  /** Force show only 12-hour controls/options */
  @Prop() twelveHourOnly: boolean = false;

  /** Hide the toggle/launch button for the timepicker popover */
  @Prop() hideTimepickerBtn: boolean = false;

  /** Whether the current value is considered valid (mutable: set by validation) */
  @Prop({ mutable: true }) isValid: boolean = true;

  /** Hide seconds UI / value */
  @Prop() hideSeconds: boolean = false;

  /** Width (px) for the input element */
  @Prop() inputWidth?: number | string;

  @Prop() required: boolean = false;

  /** ✅ Disable the entire timepicker (input + buttons + dropdown) */
  @Prop() disableTimepicker: boolean = false;

  // Internal state trigger (used only to re-render when needed)
  @State() _tick: number = 0;

  // Tracks whether the user actually changed the time (typing / clear / spinner)
  private _didUserChangeTime: boolean = false;

  // Popover state + focus management (best-practice improvements)
  @State() private _open: boolean = false;
  @State() private _activePart: TimePart = 'hour';
  private _returnFocusEl?: HTMLElement | null;

  // ---------- lifecycle ----------
  connectedCallback() {
    if (this.twentyFourHourOnly) {
      this.isTwentyFourHourFormat = true;
    } else if (this.twelveHourOnly) {
      this.isTwentyFourHourFormat = false;
    }
  }

  componentDidLoad() {
    this._setDefaultTime();
    const dd = this.qs<HTMLDivElement>(`.time-dropdown`);
    if (dd) this._disablePanel(dd);
  }

  // ---------- utilities ----------
  private qs<T extends Element = Element>(sel: string): T | null {
    return (this.host.querySelector(sel) as T) || null;
  }

  private forceUpdate() {
    this._tick++;
  }

  private get _isDisabled(): boolean {
    return !!this.disableTimepicker;
  }

  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }

  private mergeIdLists(a?: string, b?: string): string | undefined {
    const aa = this.normalizeIdList(a);
    const bb = this.normalizeIdList(b);
    if (!aa && !bb) return undefined;
    if (aa && !bb) return aa;
    if (!aa && bb) return bb;
    const merged = `${aa} ${bb}`.trim().split(/\s+/);
    return Array.from(new Set(merged)).join(' ');
  }

  private getLabelId(): string {
    return `${this.inputId}-label`;
  }

  private getDropdownId(): string {
    return `${this.inputId}-dropdown`;
  }

  private getValidationId(): string {
    return `${this.inputId}-validation`;
  }

  private getWarningId(): string {
    return `${this.inputId}-warning`;
  }

  /**
   * Compute accessible name wiring:
   * - If showLabel=true, prefer aria-labelledby to the visible label
   * - Otherwise prefer user-provided aria-labelledby
   * - Otherwise fall back to aria-label
   */
  private computeNameAttrs() {
    const hasVisibleLabel = !!this.showLabel;
    const userLabelledby = this.normalizeIdList(this.ariaLabelledby);

    const autoLabelId = hasVisibleLabel ? this.getLabelId() : undefined;
    // visible label should win; otherwise use provided ids
    const ariaLabelledby = autoLabelId ?? userLabelledby;

    const ariaLabel = ariaLabelledby
      ? undefined
      : (this.ariaLabel ?? '').trim() || (this.labelText ?? '').trim() || 'Time Picker';

    return { hasVisibleLabel, ariaLabelledby, ariaLabel };
  }

  /**
   * Compute aria-describedby:
   * - external ariaDescribedby (help text) +
   * - validation message id (only when visible) +
   * - warning message id (only when visible)
   */
  private computeDescribedByAttrs() {
    const external = this.normalizeIdList(this.ariaDescribedby);
    const validationId = this.validationMessage ? this.getValidationId() : undefined;

    const warningEl = this.qs<HTMLDivElement>('.warning-message');
    const warningShown = !!warningEl && !warningEl.classList.contains('hidden');
    const warningId = warningShown ? this.getWarningId() : undefined;

    return this.mergeIdLists(external, this.mergeIdLists(validationId, warningId));
  }

  private _clearExternalInvalidUI() {
    if (this.validationMessage) this.validationMessage = '';
    if (this.validation) this.validation = false;

    const input = this.qs<HTMLInputElement>('.time-input');
    input?.classList.remove('invalid', 'is-invalid');

    const clearBtn = this.qs<HTMLButtonElement>('.clear-button');
    clearBtn?.classList.remove('invalid', 'is-invalid');

    const iconBtn = this.qs<HTMLButtonElement>('.time-icon-btn');
    iconBtn?.classList.remove('invalid', 'is-invalid');

    const underline = this.qs<HTMLElement>('.b-underline');
    underline?.classList.remove('invalid', 'is-invalid');

    const focusBar = this.qs<HTMLElement>('.b-focus');
    focusBar?.classList.remove('invalid', 'is-invalid');

    const label = this.qs<HTMLElement>('label');
    label?.classList.remove('invalid', 'is-invalid');

    this.forceUpdate();
  }

  // ---------- public API ----------
  @Method()
  async forceTimeUpdate(): Promise<void> {
    if (this._isDisabled) return;
    this._updateTimeFromInput();
  }

  // ---------- dropdown visibility helpers ----------
  private _enablePanel(dd: HTMLElement) {
    dd.classList.remove('hidden');
    dd.removeAttribute('inert');
    dd.removeAttribute('aria-hidden');
    dd.style.pointerEvents = 'auto';
  }

  private _disablePanel(dd: HTMLElement) {
    dd.classList.add('hidden');
    dd.setAttribute('inert', '');
    dd.removeAttribute('aria-hidden');
    dd.style.pointerEvents = 'none';
  }

  private _setDropdownVisibility(show: boolean) {
    if (this._isDisabled) return;

    const dd = this.qs<HTMLDivElement>('.time-dropdown');
    if (!dd) return;

    const trigger = this.qs<HTMLButtonElement>('.time-icon-btn');
    const input = this.qs<HTMLInputElement>('.time-input');

    if (show) {
      this._returnFocusEl = trigger || input || (this.host as unknown as HTMLElement);

      this._open = true;
      this._enablePanel(dd);

      // establish roving tabindex start
      this._activePart = 'hour';
      this.forceUpdate();

      requestAnimationFrame(() => {
        this._focusActivePart();
      });
    } else {
      this._open = false;
      const toFocus = this._returnFocusEl || input || trigger || (this.host as unknown as HTMLElement);
      toFocus?.focus();

      requestAnimationFrame(() => this._disablePanel(dd));
    }

    if (trigger) trigger.setAttribute('aria-expanded', show ? 'true' : 'false');
    if (input) input.setAttribute('aria-expanded', show ? 'true' : 'false');
  }

  private _toggleDropdown = () => {
    if (this._isDisabled) return;

    this._formatTime();
    const dd = this.qs<HTMLDivElement>('.time-dropdown');
    if (!dd) return;

    const willShow = dd.classList.contains('hidden');
    this._setDropdownVisibility(willShow);
  };

  private _hideDropdown = (ev?: Event) => {
    if (this._isDisabled) return;

    ev?.preventDefault();
    ev?.stopPropagation();
    this._setDropdownVisibility(false);
  };

  // Close on Escape when open and event came from this component
  @Listen('keydown', { target: 'document' })
  onDocKeydown(ev: KeyboardEvent) {
    if (this._isDisabled) return;
    if (!this._open) return;

    const path = (ev.composedPath?.() as any[]) || [];
    const within = path.includes(this.host);
    if (!within) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this._setDropdownVisibility(false);
      return;
    }

    // Focus trap for the open popover
    if (ev.key === 'Tab') {
      this._trapTab(ev);
      return;
    }
  }

  // Close on outside click when open
  @Listen('mousedown', { target: 'document' })
  onDocMouseDown(ev: MouseEvent) {
    if (this._isDisabled) return;
    if (!this._open) return;

    const path = (ev.composedPath?.() as any[]) || [];
    const within = path.includes(this.host);
    if (within) return;

    this._setDropdownVisibility(false);
  }

  private _getFocusableInDropdown(): HTMLElement[] {
    const dd = this.qs<HTMLDivElement>('.time-dropdown');
    if (!dd || dd.classList.contains('hidden')) return [];
    // Keep it simple: include our spinbuttons (active tabindex) + all enabled buttons
    const nodes = Array.from(
      dd.querySelectorAll<HTMLElement>(
        '[role="spinbutton"][tabindex], button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    // Filter out inert/hidden etc.
    return nodes.filter(el => {
      const style = (el as any).style;
      if (el.closest('.hidden')) return false;
      if ((el as any).disabled) return false;
      if (style && style.pointerEvents === 'none') return false;
      return true;
    });
  }

  private _trapTab(ev: KeyboardEvent) {
    const dd = this.qs<HTMLDivElement>('.time-dropdown');
    if (!dd || dd.classList.contains('hidden')) return;

    const focusables = this._getFocusableInDropdown();
    if (focusables.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const idx = active ? focusables.indexOf(active) : -1;

    const forward = !ev.shiftKey;
    const next = forward
      ? idx >= 0
        ? (idx + 1) % focusables.length
        : 0
      : idx >= 0
        ? (idx - 1 + focusables.length) % focusables.length
        : focusables.length - 1;

    ev.preventDefault();
    focusables[next]?.focus();
  }

  private _focusActivePart() {
    const el = this._getPartEl(this._activePart);
    el?.focus();
  }

  private _getPartEl(part: TimePart): HTMLElement | null {
    const sel =
      part === 'hour'
        ? '.hour-display'
        : part === 'minute'
          ? '.minute-display'
          : part === 'second'
            ? '.second-display'
            : '.ampm-display';
    return this.qs<HTMLElement>(sel);
  }

  private _isPartEnabled(part: TimePart): boolean {
    if (part === 'second') return !this.hideSeconds;
    if (part === 'ampm') return !(this.isTwentyFourHourFormat || this.twentyFourHourOnly);
    return true;
  }

  private _orderedParts(): TimePart[] {
    const parts: TimePart[] = ['hour', 'minute'];
    if (!this.hideSeconds) parts.push('second');
    if (!(this.isTwentyFourHourFormat || this.twentyFourHourOnly)) parts.push('ampm');
    return parts;
  }

  private _moveActivePart(dir: -1 | 1) {
    const parts = this._orderedParts();
    const idx = parts.indexOf(this._activePart);
    if (idx < 0) {
      this._activePart = parts[0] || 'hour';
    } else {
      const next = (idx + dir + parts.length) % parts.length;
      this._activePart = parts[next];
    }
    this.forceUpdate();
    requestAnimationFrame(() => this._focusActivePart());
  }

  // ---------- format toggle ----------
  private _toggleFormat = () => {
    if (this.twentyFourHourOnly || this.twelveHourOnly) return;

    // IMPORTANT: toggling format must NOT clear validation
    this.isTwentyFourHourFormat = !this.isTwentyFourHourFormat;
    this._convertTimeFormat();
    this._toggleAMPMSpinner();

    // keep roving part valid
    if (!this._isPartEnabled(this._activePart)) {
      this._activePart = 'hour';
    }

    this._updateInput();
    this.forceUpdate();
  };

  private _convertTimeFormat() {
    const timeInputEl = this.qs<HTMLInputElement>('.time-input');
    if (!timeInputEl) return;

    const timeInput = timeInputEl.value;
    let [hoursStr, minutesStr, secondsOrAm] = timeInput.split(/[: ]/);
    const isPM = /PM$/.test(timeInput);

    let hours = parseInt(hoursStr || '0', 10);
    const minutes = parseInt(minutesStr || '0', 10);
    const seconds = this.hideSeconds ? 0 : parseInt((secondsOrAm as string) || '0', 10);
    let ampm = '';

    if (this.isTwentyFourHourFormat) {
      if (isPM && hours < 12) hours += 12;
      else if (!isPM && hours === 12) hours = 0;
      ampm = '';
    } else {
      if (hours === 0) {
        hours = 12;
        ampm = 'AM';
      } else if (hours === 12) {
        ampm = 'PM';
      } else if (hours > 12) {
        hours -= 12;
        ampm = 'PM';
      } else {
        ampm = 'AM';
      }
    }

    const hourDisp = this.qs<HTMLElement>('.hour-display');
    const minDisp = this.qs<HTMLElement>('.minute-display');
    const secDisp = this.qs<HTMLElement>('.second-display');
    const ampmDisp = this.qs<HTMLElement>('.ampm-display');

    if (hourDisp) hourDisp.textContent = String(hours).padStart(2, '0');
    if (minDisp) minDisp.textContent = String(minutes).padStart(2, '0');
    if (!this.hideSeconds && secDisp) secDisp.textContent = String(seconds).padStart(2, '0');
    if (ampmDisp) ampmDisp.textContent = ampm;

    this._updateInput();
  }

  private _toggleAMPMSpinner() {
    const ampmSpinner = this.qs<HTMLDivElement>('.am-pm-spinner');
    if (!ampmSpinner) return;

    if (this.isTwentyFourHourFormat || this.twentyFourHourOnly) {
      ampmSpinner.classList.add('hidden');
      ampmSpinner.setAttribute('aria-hidden', 'true');
    } else {
      ampmSpinner.classList.remove('hidden');
      ampmSpinner.setAttribute('aria-hidden', 'false');
    }
  }

  // ---------- parsing/format ----------
  private _formatTime() {
    const inputEl = this.qs<HTMLInputElement>('.time-input');
    if (!inputEl) return;

    const timePattern = this.isTwentyFourHourFormat
      ? this.hideSeconds
        ? /^(\d{1,2}):(\d{2})$/
        : /^(\d{1,2}):(\d{2}):(\d{2})$/
      : this.hideSeconds
        ? /^(\d{1,2}):(\d{2}) (AM|PM)$/
        : /^(\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/;

    const matches = inputEl.value.match(timePattern);
    if (!matches) return;

    const hours = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    const seconds = this.hideSeconds ? 0 : parseInt(matches[3], 10);

    const hourDisp = this.qs<HTMLElement>('.hour-display');
    const minDisp = this.qs<HTMLElement>('.minute-display');
    const secDisp = this.qs<HTMLElement>('.second-display');

    if (hourDisp) hourDisp.textContent = String(hours).padStart(2, '0');
    if (minDisp) minDisp.textContent = String(minutes).padStart(2, '0');
    if (!this.hideSeconds && secDisp) secDisp.textContent = String(seconds).padStart(2, '0');

    this._updateInput();
  }

  // ---------- spinbutton semantics + roving tabindex ----------
  private _getSpinMeta(part: TimePart) {
    if (part === 'hour') {
      const min = this.isTwentyFourHourFormat ? 0 : 1;
      const max = this.isTwentyFourHourFormat ? 23 : 12;
      const now = this._readPartNumber('hour');
      return { min, max, now, text: String(now).padStart(2, '0'), label: 'Hour' };
    }
    if (part === 'minute') {
      const now = this._readPartNumber('minute');
      return { min: 0, max: 59, now, text: String(now).padStart(2, '0'), label: 'Minute' };
    }
    if (part === 'second') {
      const now = this._readPartNumber('second');
      return { min: 0, max: 59, now, text: String(now).padStart(2, '0'), label: 'Second' };
    }
    // ampm
    const now = this._readAmPmNow();
    const text = now === 0 ? 'AM' : 'PM';
    return { min: 0, max: 1, now, text, label: 'AM/PM' };
  }

  private _readPartNumber(part: Exclude<TimePart, 'ampm'>): number {
    const el =
      part === 'hour'
        ? this.qs<HTMLElement>('.hour-display')
        : part === 'minute'
          ? this.qs<HTMLElement>('.minute-display')
          : this.qs<HTMLElement>('.second-display');
    const n = Number.parseInt((el?.textContent || '0').trim(), 10);
    return Number.isFinite(n) ? n : 0;
  }

  private _readAmPmNow(): 0 | 1 {
    const el = this.qs<HTMLElement>('.ampm-display');
    const s = (el?.textContent || 'AM').trim().toUpperCase();
    return s === 'PM' ? 1 : 0;
  }

  private _setPartValue(part: TimePart, next: number | 0 | 1) {
    const hourDisp = this.qs<HTMLElement>('.hour-display');
    const minDisp = this.qs<HTMLElement>('.minute-display');
    const secDisp = this.qs<HTMLElement>('.second-display');
    const ampmDisp = this.qs<HTMLElement>('.ampm-display');

    if (part === 'hour' && hourDisp) hourDisp.textContent = String(next).padStart(2, '0');
    if (part === 'minute' && minDisp) minDisp.textContent = String(next).padStart(2, '0');
    if (part === 'second' && secDisp) secDisp.textContent = String(next).padStart(2, '0');
    if (part === 'ampm' && ampmDisp) ampmDisp.textContent = (next as any) === 1 ? 'PM' : 'AM';

    this._updateInput();
    this.forceUpdate();
  }

  private _applySpinDelta(part: TimePart, delta: number) {
    if (this._isDisabled) return;

    // spinner change counts as user change
    this._didUserChangeTime = true;
    this._clearExternalInvalidUI();

    const meta = this._getSpinMeta(part);

    if (part === 'ampm') {
      const next = meta.now === 0 ? 1 : 0;
      this._setPartValue('ampm', next);
      return;
    }

    let next = meta.now + delta;

    // wrap behavior (matches your existing increment/decrement UX)
    if (part === 'hour') {
      if (this.isTwentyFourHourFormat) {
        if (next > meta.max) next = meta.min;
        if (next < meta.min) next = meta.max;
      } else {
        if (next > meta.max) next = meta.min;
        if (next < meta.min) next = meta.max;
      }
    } else {
      if (next > meta.max) next = meta.min;
      if (next < meta.min) next = meta.max;
    }

    this._setPartValue(part, next);
  }

  private _onSpinKeyDown = (part: TimePart, ev: KeyboardEvent) => {
    if (this._isDisabled) return;
    if (!this._open) return;

    const key = ev.key;

    // Roving focus between parts
    if (key === 'ArrowLeft') {
      ev.preventDefault();
      this._moveActivePart(-1);
      return;
    }
    if (key === 'ArrowRight') {
      ev.preventDefault();
      this._moveActivePart(1);
      return;
    }

    // Spin semantics
    if (key === 'ArrowUp') {
      ev.preventDefault();
      this._applySpinDelta(part, +1);
      return;
    }
    if (key === 'ArrowDown') {
      ev.preventDefault();
      this._applySpinDelta(part, -1);
      return;
    }
    if (key === 'PageUp') {
      ev.preventDefault();
      this._applySpinDelta(part, +10);
      return;
    }
    if (key === 'PageDown') {
      ev.preventDefault();
      this._applySpinDelta(part, -10);
      return;
    }
    if (key === 'Home') {
      ev.preventDefault();
      const meta = this._getSpinMeta(part);
      this._setPartValue(part, meta.min as any);
      return;
    }
    if (key === 'End') {
      ev.preventDefault();
      const meta = this._getSpinMeta(part);
      this._setPartValue(part, meta.max as any);
      return;
    }
    if (key === 'Enter') {
      ev.preventDefault();
      // commit + keep open (or close if you prefer)
      this._updateTimeFromInput();
      return;
    }
  };

  private _setActivePart(part: TimePart) {
    if (!this._isPartEnabled(part)) return;
    this._activePart = part;
    this.forceUpdate();
  }

  // ---------- legacy arrow button handlers (still supported) ----------
  private _increment = (ev: Event) => this._incrementDecrement(ev, true);
  private _decrement = (ev: Event) => this._incrementDecrement(ev, false);

  private _incrementDecrement(ev: Event, increment: boolean) {
    if (this._isDisabled) return;

    this._didUserChangeTime = true;
    this._clearExternalInvalidUI();

    const arrow = (ev.currentTarget as HTMLElement) || (ev.target as HTMLElement);
    if (!arrow) return;

    const wrapper = arrow.closest('.time-spinner') as HTMLElement | null;
    const arrowBtn = arrow.closest('.arrow') as HTMLElement | null;
    const type = (arrowBtn?.dataset.type || '') as TimePart;
    if (!wrapper || !type) return;

    // Keep roving focus consistent with mouse usage
    this._setActivePart(type);

    if (type === 'ampm') {
      this._applySpinDelta('ampm', 1);
      return;
    }
    this._applySpinDelta(type, increment ? +1 : -1);
  }

  // ---------- input -> dropdown sync ----------
  private _updateInput() {
    const hourDisp = this.qs<HTMLElement>('.hour-display');
    const minDisp = this.qs<HTMLElement>('.minute-display');
    const secDisp = this.qs<HTMLElement>('.second-display');
    const ampmDisp = this.qs<HTMLElement>('.ampm-display');
    const input = this.qs<HTMLInputElement>('.time-input');
    if (!hourDisp || !minDisp || !input) return;

    const hours = parseInt(hourDisp.textContent || '0', 10);
    const minutes = (minDisp.textContent || '00').padStart(2, '0');
    const seconds = this.hideSeconds ? '00' : (secDisp?.textContent || '00').padStart(2, '0');
    const ampm = this.isTwentyFourHourFormat ? '' : ampmDisp?.textContent || 'AM';

    const formattedHours = this.isTwentyFourHourFormat
      ? String(hours).padStart(2, '0')
      : String(hours % 12 || 12).padStart(2, '0');

    const selectedTime = this.isTwentyFourHourFormat
      ? this.hideSeconds
        ? `${formattedHours}:${minutes}`
        : `${formattedHours}:${minutes}:${seconds}`
      : this.hideSeconds
        ? `${formattedHours}:${minutes} ${ampm}`
        : `${formattedHours}:${minutes}:${seconds} ${ampm}`;

    input.value = selectedTime;
  }

  private _updateDropdown() {
    const input = this.qs<HTMLInputElement>('.time-input');
    if (!input) return;

    const timePattern = this.isTwentyFourHourFormat
      ? this.hideSeconds
        ? /^(\d{2}):(\d{2})$/
        : /^(\d{2}):(\d{2}):(\d{2})$/
      : this.hideSeconds
        ? /^(\d{2}):(\d{2}) (AM|PM)$/
        : /^(\d{2}):(\d{2}):(\d{2}) (AM|PM)$/;

    const matches = input.value.match(timePattern);
    if (!matches) return;

    let hours = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    const seconds = this.hideSeconds ? 0 : parseInt(matches[3], 10);
    let ampm = this.isTwentyFourHourFormat ? '' : matches[4];

    if (!this.isTwentyFourHourFormat) {
      if (hours === 0) {
        hours = 12;
        ampm = 'AM';
      } else if (hours === 12) {
        // keep ampm
      } else if (hours > 12) {
        hours -= 12;
        ampm = 'PM';
      } else {
        ampm = 'AM';
      }
    }

    const hourDisp = this.qs<HTMLElement>('.hour-display');
    const minDisp = this.qs<HTMLElement>('.minute-display');
    const secDisp = this.qs<HTMLElement>('.second-display');
    const ampmDisp = this.qs<HTMLElement>('.ampm-display');

    if (hourDisp) hourDisp.textContent = String(hours).padStart(2, '0');
    if (minDisp) minDisp.textContent = String(minutes).padStart(2, '0');
    if (!this.hideSeconds && secDisp) secDisp.textContent = String(seconds).padStart(2, '0');
    if (ampmDisp) ampmDisp.textContent = ampm as any;

    this._toggleAMPMSpinner();

    // keep active part valid after updating
    if (!this._isPartEnabled(this._activePart)) {
      this._activePart = 'hour';
    }

    this.forceUpdate();
  }

  private _updateTimeFromInput() {
    if (this._isDisabled) return;

    const input = this.qs<HTMLInputElement>('.time-input');
    if (!input) return;

    let value = input.value.trim();
    value = value
      .split(':')
      .map(part => part.padStart(2, '0'))
      .join(':');

    if (!this._isValidInput(value)) {
      this.isValid = false;
      this._toggleButtons();
      return;
    }

    input.value = value;
    this.isValid = true;
    this._toggleButtons();
    this._hideWarningMessage();

    if (this.isValid && this._didUserChangeTime) {
      this._clearExternalInvalidUI();
      this._didUserChangeTime = false;
    }

    this._updateDropdown();
    this._updateInput();
  }

  private _validateTimeInput = () => {
    if (this._isDisabled) return;

    this._didUserChangeTime = true;
    this._clearExternalInvalidUI();

    const input = this.qs<HTMLInputElement>('.time-input');
    const raw = (input?.value || '').trim();

    this.isValid = this._isValidInput(raw);
    this._toggleButtons();

    if (this.isValid) this._updateDropdown();
  };

  private _handleEnterKey = (event: KeyboardEvent) => {
    if (this._isDisabled) return;
    if (event.key === 'Enter' && this.isValid) this._updateTimeFromInput();
  };

  private _handleEnterKeyOnly = (e: KeyboardEvent) => {
    if (this._isDisabled) return;
    if (e.key === 'Enter' && this.isValid) this._updateTimeFromInput();
  };

  private _preventInvalidPaste = (_ev: ClipboardEvent) => {
    return;
  };

  private _clearTime = () => {
    if (this._isDisabled) return;

    this._didUserChangeTime = true;

    const input = this.qs<HTMLInputElement>('.time-input');
    if (!input) return;

    input.value = this.isTwentyFourHourFormat
      ? this.hideSeconds
        ? '00:00'
        : '00:00:00'
      : this.hideSeconds
        ? '12:00 AM'
        : '12:00:00 AM';

    this._clearExternalInvalidUI();

    this._updateDropdown();
    this._hideWarningMessage();
    this.isValid = true;
    this._toggleButtons();

    // keep active part sane
    this._activePart = 'hour';
    this.forceUpdate();
  };

  private _showValidationMessage(message: string) {
    this.validationMessage = message;
    this.forceUpdate();
  }

  private _isValidInput(input: string): boolean {
    const timePattern = this.isTwentyFourHourFormat
      ? this.hideSeconds
        ? /^(\d{1,2}):(\d{2})$/
        : /^(\d{1,2}):(\d{2}):(\d{2})$/
      : this.hideSeconds
        ? /^(\d{1,2}):(\d{2}) (AM|PM)$/
        : /^(\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/;

    const matches = input.match(timePattern);
    if (!matches) {
      this._showValidationMessage(
        this.isTwentyFourHourFormat
          ? this.hideSeconds
            ? 'Invalid time format. Correct format is 00:00.'
            : 'Invalid time format. Correct format is 00:00:00.'
          : this.hideSeconds
            ? 'Invalid time format. Correct format is 00:00 AM(or PM).'
            : 'Invalid time format. Correct format is 00:00:00 AM(or PM).',
      );
      return false;
    }

    const hours = parseInt(matches[1], 10);
    const minutes = parseInt(matches[2], 10);
    const seconds = this.hideSeconds ? 0 : parseInt(matches[3], 10);

    if ((this.isTwentyFourHourFormat && hours > 23) || (!this.isTwentyFourHourFormat && (hours > 12 || hours < 1))) {
      this._showWarningMessage();
      return false;
    }

    if (minutes > 59 || (!this.hideSeconds && seconds > 59)) {
      this._showWarningMessage();
      return false;
    }

    return true;
  }

  private _showWarningMessage() {
    const el = this.qs<HTMLDivElement>('.warning-message');
    if (!el) return;
    el.classList.remove('hidden');
    this.forceUpdate();
  }

  private _hideWarningMessage() {
    const el = this.qs<HTMLDivElement>('.warning-message');
    if (!el) return;
    el.classList.add('hidden');
    this.forceUpdate();
  }

  private _setDefaultTime() {
    const input = this.qs<HTMLInputElement>('.time-input');
    if (!input) return;

    input.value = this.isTwentyFourHourFormat
      ? this.hideSeconds
        ? '00:00'
        : '00:00:00'
      : this.hideSeconds
        ? '12:00 AM'
        : '12:00:00 AM';

    this._updateDropdown();
    this._toggleButtons();
  }

  private _toggleButtons() {
    const toggleButton = this.qs<HTMLButtonElement>('.toggle-format-btn');
    const timeIconBtn = this.qs<HTMLButtonElement>('.time-icon-btn');

    const shouldDisable = this._isDisabled || !this.isValid;

    if (toggleButton) {
      if (!shouldDisable) toggleButton.removeAttribute('disabled');
      else toggleButton.setAttribute('disabled', 'disabled');
    }

    if (timeIconBtn) {
      if (!shouldDisable) timeIconBtn.removeAttribute('disabled');
      else timeIconBtn.setAttribute('disabled', 'disabled');
    }
  }

  // ---------- render ----------
  render() {
    const disabledAll = this._isDisabled;

    const groupSize = this.size === 'sm' ? ' input-group-sm' : this.size === 'lg' ? ' input-group-lg' : '';
    const ddSize = this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : '';
    const maxLength = this.isTwentyFourHourFormat ? (this.hideSeconds ? 5 : 8) : this.hideSeconds ? 8 : 11;

    const inputInlineStyle =
      this.inputWidth !== undefined && this.inputWidth !== null && this.inputWidth !== ''
        ? { width: `${this.inputWidth}px` }
        : {};

    const disableInteractive = disabledAll || !this.isValid;

    const dropdownId = this.getDropdownId();
    const validationId = this.getValidationId();
    const warningId = this.getWarningId();

    const { hasVisibleLabel, ariaLabelledby, ariaLabel } = this.computeNameAttrs();
    const describedBy = this.computeDescribedByAttrs();

    const dropdownClass = `time-dropdown${ddSize} hidden`;
    const isInvalid = !this.isValid;

    // spinbutton meta (render-time)
    const hourMeta = this._getSpinMeta('hour');
    const minMeta = this._getSpinMeta('minute');
    const secMeta = this._getSpinMeta('second');
    const ampmMeta = this._getSpinMeta('ampm');

    const tabFor = (part: TimePart) => (this._open && this._activePart === part ? 0 : -1);

    const labelIdToUse = hasVisibleLabel ? this.getLabelId() : this.normalizeIdList(this.ariaLabelledby);

    return (
      <div class="time-picker-container">
        <div class={`time-picker ${!this.twentyFourHourOnly && !this.twelveHourOnly ? 'mr-1' : ''}`}>
          <label
            htmlFor={this.inputId}
            id={hasVisibleLabel ? this.getLabelId() : undefined}
            class={`${this.showLabel ? '' : 'sr-only'}${this.validation ? ' invalid' : ''}`}
          >
            {this.labelText}
            {this.required ? <span class="required">*</span> : null}
          </label>

          <div class="timepicker-group">
            <div class={`input-group${groupSize}`}>
              <input
                type="text"
                id={this.inputId}
                name={this.inputName}
                class={`time-input form-control${this.validation ? ' is-invalid' : ''}`}
                style={inputInlineStyle as any}
                placeholder="Enter Time"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby || (hasVisibleLabel ? this.getLabelId() : undefined)}
                aria-controls={dropdownId}
                aria-expanded={this._open ? 'true' : 'false'}
                aria-haspopup="dialog"
                aria-invalid={isInvalid ? 'true' : undefined}
                aria-required={this.required ? 'true' : undefined}
                required={this.required}
                aria-describedby={describedBy}
                maxLength={maxLength}
                disabled={disabledAll}
                onBlur={() => {
                  if (!disabledAll && this.isValid) this._updateTimeFromInput();
                }}
                onInput={this._validateTimeInput}
                onPaste={this._preventInvalidPaste}
                onKeyPress={this._handleEnterKey}
                onKeyDown={this._handleEnterKeyOnly}
              />

              <button
                type="button"
                class={`clear-button${this.validation ? ' invalid' : ''}`}
                aria-label="Clear time"
                onClick={this._clearTime}
                disabled={disabledAll}
              >
                <i class="fas fa-times-circle" />
              </button>

              {this.hideTimepickerBtn ? null : (
                <button
                  type="button"
                  class={`time-icon input-group-text time-icon-btn${this.validation ? ' invalid' : ''}`}
                  aria-label="Open time picker"
                  aria-controls={dropdownId}
                  aria-expanded={this._open ? 'true' : 'false'}
                  aria-haspopup="dialog"
                  tabIndex={0}
                  onClick={this._toggleDropdown}
                  disabled={disableInteractive}
                >
                  <i class="fa fa-clock" />
                </button>
              )}
            </div>

            {/* Popover/panel: dialog-like surface + focus trap + roving spinbuttons */}
            <div
              id={dropdownId}
              class={dropdownClass}
              role="dialog"
              aria-modal="false"
              aria-labelledby={labelIdToUse || undefined}
              aria-describedby={describedBy}
              tabIndex={-1}
              style={disabledAll ? ({ pointerEvents: 'none' } as any) : undefined}
            >
              <div class="time-spinner-wrapper">
                {/* HOURS */}
                <div class="time-spinner">
                  <button
                    type="button"
                    class="arrow up"
                    data-type="hour"
                    aria-label="Increment hour"
                    onClick={this._increment}
                    disabled={disabledAll}
                  >
                    <i class="fas fa-chevron-up" />
                  </button>

                  <span
                    class="hour-display"
                    role="spinbutton"
                    aria-label={hourMeta.label}
                    aria-valuemin={String(hourMeta.min)}
                    aria-valuemax={String(hourMeta.max)}
                    aria-valuenow={String(hourMeta.now)}
                    aria-valuetext={hourMeta.text}
                    tabIndex={tabFor('hour')}
                    onFocus={() => this._setActivePart('hour')}
                    onMouseDown={() => this._setActivePart('hour')}
                    onKeyDown={e => this._onSpinKeyDown('hour', e)}
                  >
                    {hourMeta.text}
                  </span>

                  <button
                    type="button"
                    class="arrow down"
                    data-type="hour"
                    aria-label="Decrement hour"
                    onClick={this._decrement}
                    disabled={disabledAll}
                  >
                    <i class="fas fa-chevron-down" />
                  </button>
                </div>

                <div class="time-spinner-colon" aria-hidden="true">
                  <div class="dot">
                    <i class="fa fa-circle" />
                  </div>
                  <div class="dot">
                    <i class="fa fa-circle" />
                  </div>
                </div>

                {/* MINUTES */}
                <div class="time-spinner">
                  <button
                    type="button"
                    class="arrow up"
                    data-type="minute"
                    aria-label="Increment minute"
                    onClick={this._increment}
                    disabled={disabledAll}
                  >
                    <i class="fas fa-chevron-up" />
                  </button>

                  <span
                    class="minute-display"
                    role="spinbutton"
                    aria-label={minMeta.label}
                    aria-valuemin={String(minMeta.min)}
                    aria-valuemax={String(minMeta.max)}
                    aria-valuenow={String(minMeta.now)}
                    aria-valuetext={minMeta.text}
                    tabIndex={tabFor('minute')}
                    onFocus={() => this._setActivePart('minute')}
                    onMouseDown={() => this._setActivePart('minute')}
                    onKeyDown={e => this._onSpinKeyDown('minute', e)}
                  >
                    {minMeta.text}
                  </span>

                  <button
                    type="button"
                    class="arrow down"
                    data-type="minute"
                    aria-label="Decrement minute"
                    onClick={this._decrement}
                    disabled={disabledAll}
                  >
                    <i class="fas fa-chevron-down" />
                  </button>
                </div>

                {/* SECONDS */}
                {this.hideSeconds ? null : (
                  <Fragment>
                    <div class="time-spinner-colon" aria-hidden="true">
                      <div class="dot">
                        <i class="fa fa-circle" />
                      </div>
                      <div class="dot">
                        <i class="fa fa-circle" />
                      </div>
                    </div>

                    <div class="time-spinner">
                      <button
                        type="button"
                        class="arrow up"
                        data-type="second"
                        aria-label="Increment second"
                        onClick={this._increment}
                        disabled={disabledAll}
                      >
                        <i class="fas fa-chevron-up" />
                      </button>

                      <span
                        class="second-display"
                        role="spinbutton"
                        aria-label={secMeta.label}
                        aria-valuemin={String(secMeta.min)}
                        aria-valuemax={String(secMeta.max)}
                        aria-valuenow={String(secMeta.now)}
                        aria-valuetext={secMeta.text}
                        tabIndex={tabFor('second')}
                        onFocus={() => this._setActivePart('second')}
                        onMouseDown={() => this._setActivePart('second')}
                        onKeyDown={e => this._onSpinKeyDown('second', e)}
                      >
                        {secMeta.text}
                      </span>

                      <button
                        type="button"
                        class="arrow down"
                        data-type="second"
                        aria-label="Decrement second"
                        onClick={this._decrement}
                        disabled={disabledAll}
                      >
                        <i class="fas fa-chevron-down" />
                      </button>
                    </div>
                  </Fragment>
                )}

                {/* AM/PM */}
                <div class="time-spinner am-pm-spinner hidden" aria-hidden="true">
                  <button
                    type="button"
                    class="arrow up"
                    data-type="ampm"
                    aria-label="Toggle AM/PM"
                    onClick={this._increment}
                    disabled={disabledAll}
                  >
                    <i class="fas fa-chevron-up" />
                  </button>

                  <span
                    class="ampm-display"
                    role="spinbutton"
                    aria-label={ampmMeta.label}
                    aria-valuemin={String(ampmMeta.min)}
                    aria-valuemax={String(ampmMeta.max)}
                    aria-valuenow={String(ampmMeta.now)}
                    aria-valuetext={ampmMeta.text}
                    tabIndex={tabFor('ampm')}
                    onFocus={() => this._setActivePart('ampm')}
                    onMouseDown={() => this._setActivePart('ampm')}
                    onKeyDown={e => this._onSpinKeyDown('ampm', e)}
                  >
                    {ampmMeta.text}
                  </span>

                  <button
                    type="button"
                    class="arrow down"
                    data-type="ampm"
                    aria-label="Toggle AM/PM"
                    onClick={this._decrement}
                    disabled={disabledAll}
                  >
                    <i class="fas fa-chevron-down" />
                  </button>
                </div>
              </div>

              <div class="time-spinner-close">
                <button
                  class="btn btn-outline-primary btntext close-button btn-sm"
                  type="button"
                  aria-label="Close"
                  onClick={this._hideDropdown}
                  disabled={disabledAll}
                >
                  Close
                </button>
              </div>
            </div>

            {!this.twentyFourHourOnly && !this.twelveHourOnly ? (
              <button
                type="button"
                class={`toggle-format-btn btn btn--outlined${this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : ''}`}
                aria-label={this.isTwentyFourHourFormat ? 'Switch to 12 hour format' : 'Switch to 24 hour format'}
                onClick={this._toggleFormat}
                disabled={disableInteractive}
              >
                {this.isTwentyFourHourFormat ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="format-btn" aria-hidden="true" focusable="false">
                    <title>Switch to 12 Hour Format</title>
                    <path d="M13 2V4C17 4.5 20 7.8 20 11.9C20 15.1 18.1 17.9 15.3 19.2L13 17V22H18L16.8 20.8C19.9 19.1 22 15.8 22 12C22 6.8 18 2.5 13 2M11 2C9.1 2.2 7.2 3 5.7 4.2L7.1 5.6C8.2 4.8 9.6 4.2 11 4V2M4.2 5.7C3 7.2 2.2 9.1 2 11H4C4.2 9.6 4.8 8.2 5.6 7.1L4.2 5.7M2 13C2.2 14.9 3 16.8 4.2 18.3L5.6 16.9C4.8 15.8 4.2 14.4 4 13H2M7.1 18.4L5.7 19.8C7.2 21 9.1 21.8 11 22V20C9.6 19.8 8.2 19.2 7.1 18.4M12 8V10H15V11H14C12.9 11 12 11.9 12 13V16H17V14H14V13H15C16.1 13 17 12.1 17 11V10C17 8.9 16.1 8 15 8H12M7 8V10H8V16H10V8H7Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="format-btn" aria-hidden="true" focusable="false">
                    <title>Switch to 24 Hour Format</title>
                    <path d="M13 2.05V4.07C16.95 4.56 20 7.92 20 12C20 15.21 18.08 18 15.28 19.28L13 17V22H18L16.78 20.78C19.91 19.07 22 15.76 22 12C22 6.82 18.05 2.55 13 2.05M11 2C9.05 2.2 7.2 2.96 5.68 4.21L7.1 5.63C8.23 4.75 9.58 4.2 11 4V2M4.2 5.68C2.96 7.2 2.2 9.05 2 11H4C4.19 9.58 4.75 8.23 5.63 7.1L4.2 5.68M6 8V10H9V11H8C6.9 11 6 11.9 6 13V16H11V14H8V13H9C10.11 13 11 12.11 11 11V10C11 8.9 10.11 8 9 8H6M12 8V13H15V16H17V13H18V11H17V8H15V11H14V8H12M2 13C2.2 14.95 2.97 16.8 4.22 18.32L5.64 16.9C4.76 15.77 4.2 14.42 4 13H2M7.11 18.37L5.68 19.79C7.2 21.03 9.05 21.8 11 22V20C9.58 19.81 8.24 19.25 7.11 18.37Z" />
                  </svg>
                )}
              </button>
            ) : null}
          </div>

          <div id={validationId} class={`validation-message ${this.validationMessage ? '' : 'hidden'}`} role="alert" aria-live="polite">
            {this.validationMessage}
          </div>

          <div id={warningId} class="warning-message hidden" role="alert" aria-live="polite">
            <i class="fa fa-exclamation-triangle" aria-hidden="true" /> Time values cannot exceed the limits.
          </div>
        </div>
      </div>
    );
  }
}
