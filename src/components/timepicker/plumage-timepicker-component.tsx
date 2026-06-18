// src/components/timepicker/plumage-timepicker-component.tsx

import { Component, h, Prop, Element, State, Method, Fragment, Listen, Watch, Event, EventEmitter } from '@stencil/core';

type TimePart = 'hour' | 'minute' | 'second' | 'ampm';
type AmPm = 'AM' | 'PM';

type TimeParts = {
  hour: number;
  minute: number;
  second: number;
  ampm: AmPm;
};

type NormalizeOk = { ok: true; normalized: string; parts: TimeParts };
type NormalizeErr = { ok: false; normalized: string; reason: 'pattern' | 'range' };
type NormalizeResult = NormalizeOk | NormalizeErr;

const isNormalizeErr = (r: NormalizeResult): r is NormalizeErr => r.ok === false;

export type TimeChangeDetail = {
  value: string;
  parts: TimeParts;
  isValid: boolean;
  source: 'commit' | 'spinner' | 'clear' | 'format' | 'external' | 'inputName' | 'inputId' | 'constraints' | 'hideSeconds';
};

export type TimeInputDetail = {
  raw: string;
  normalized: string;
  isValid: boolean;
  parts?: TimeParts;
  reason?: 'pattern' | 'range';
  caretStart: number | null;
  caretEnd: number | null;
  inputType: string | null;
};

@Component({
  tag: 'plumage-timepicker-component',
  styleUrls: ['./timepicker-styles.scss', '../button/button.scss', '../plumage-input-field/plumage-input-field-styles.scss', '../form-styles.scss'],
  shadow: false,
})
export class PlumageTimepickerComponent {
  @Element() host!: HTMLElement;

  @Event({ eventName: 'timeChange' }) timeChange!: EventEmitter<TimeChangeDetail>;
  @Event({ eventName: 'timeInput' }) timeInput!: EventEmitter<TimeInputDetail>;

  @Prop() ariaLabel: string = 'Time Picker';
  @Prop() ariaLabelledby: string = '';
  @Prop() ariaDescribedby: string = '';

  @Prop() showLabel?: boolean;
  @Prop() labelText: string = 'Enter Time';

  @Prop() inputId: string = 'time-input';
  @Prop() inputName: string = 'time';

  @Prop({ mutable: true }) value: string = '';
  @Prop({ mutable: true }) isTwentyFourHourFormat: boolean = true;

  @Prop() size: string = '';

  @Prop() timeValidation: boolean = true;
  @Prop({ mutable: true }) timeValidationMessage: string = '';

  @Prop() validationMessage: string = '';
  @Prop() twentyFourHourOnly: boolean = false;
  @Prop() twelveHourOnly: boolean = false;
  @Prop() hideTimepickerBtn: boolean = false;
  @Prop({ mutable: true }) isValid: boolean = true;
  @Prop() hideSeconds: boolean = false;
  @Prop() inputWidth?: number | string;
  @Prop() required: boolean = false;
  @Prop() validation: boolean = false;
  @Prop() disabled?: boolean = false;
  @Prop() readOnly: boolean = false;
  @Prop() timeInputThrottleMs: number = 50;

  @State() private _open: boolean = false;
  @State() private _activePart: TimePart = 'hour';
  @State() private _warningVisible: boolean = false;
  @State() private _parts: TimeParts = { hour: 0, minute: 0, second: 0, ampm: 'AM' };
  @State() private _userValidationActive: boolean = false;

  private _returnFocusEl?: HTMLElement | null;
  private _inputEl?: HTMLInputElement;
  private _inputValue: string = '';
  private _isInputFocused: boolean = false;
  private _didUserChangeTime: boolean = false;
  private _emitSuppressionDepth = 0;

  private _timeInputLastEmitTs = 0;
  private _timeInputTimer: number | undefined;
  private _timeInputPending: TimeInputDetail | null = null;

  connectedCallback() {
    this._userValidationActive = !!this.validation;
    this._withEmitSuppressed(() => this._applyFormatConstraints());
  }

  disconnectedCallback() {
    if (this._timeInputTimer !== undefined) {
      clearTimeout(this._timeInputTimer);
      this._timeInputTimer = undefined;
    }
    this._timeInputPending = null;
  }

  componentWillLoad() {
    this._userValidationActive = !!this.validation;

    const initial = (this.value ?? '').trim();
    if (initial) {
      this._withEmitSuppressed(() => {
        const ok = this._applyExternalValue(initial);
        if (!ok) this._resetToDefault();
      });
      return;
    }
    this._resetToDefault();
  }

 @Method()
   async forceTimeUpdate(): Promise<void> {
     if (this._isInteractionLocked) return;
     this._commitFromInput();
   }

  @Watch('disabled')
  onDisabledChange(next: boolean | undefined, prev: boolean | undefined) {
    if (!!next === !!prev) return;
    if (!!next && this._open) this._setDropdownVisibility(false);
    if (!next && !this._isPartEnabled(this._activePart)) this._activePart = 'hour';
  }

  @Watch('validation')
  onValidationChange(next: boolean, prev: boolean) {
    if (next === prev) return;
    this._userValidationActive = !!next;
  }

  @Watch('readOnly')
  onReadOnlyChange(next: boolean, prev: boolean) {
    if (next === prev) return;
    if (next && this._open) this._setDropdownVisibility(false);
  }

  @Watch('value')
  onValueChange(next: string, prev: string) {
    const n = (next ?? '').trim();
    const p = (prev ?? '').trim();
    if (n === p) return;

    this._withEmitSuppressed(() => {
      if (!n) {
        this._resetToDefault();
        return;
      }
      const ok = this._applyExternalValue(n);
      if (!ok) this.isValid = false;
    });
  }

  @Watch('isTwentyFourHourFormat')
  onFormatChange(next: boolean, prev: boolean) {
    if (next === prev) return;

    if (!this._formatAllowed(next)) {
      this.isTwentyFourHourFormat = this._coerceAllowedFormat();
      return;
    }

    this._withEmitSuppressed(() => {
      this._convertTimeFormatInState();
      if (!this._isPartEnabled(this._activePart)) this._activePart = 'hour';

      if (!this._isInputFocused) this._setInputValue(this._partsToInput(this._parts), { writeToDom: true });

      this._recomputeValidityFromState();
      this._syncValuePropFromState();
    });

    this._emitTimeChange('external');
  }

  @Watch('hideSeconds')
  onHideSecondsChange(next: boolean, prev: boolean) {
    if (next === prev) return;

    this._withEmitSuppressed(() => {
      if (next && this._activePart === 'second') this._activePart = 'minute';

      if (!this._isInputFocused) this._setInputValue(this._partsToInput(this._parts), { writeToDom: true });

      this._recomputeValidityFromState();
      this._syncValuePropFromState();
    });

    this._emitTimeChange('hideSeconds');
  }

  @Watch('twentyFourHourOnly')
  onTwentyFourOnlyChange(next: boolean, prev: boolean) {
    if (next === prev) return;
    this._withEmitSuppressed(() => {
      this._applyFormatConstraints();
      if (!this._isInputFocused) this._setInputValue(this._partsToInput(this._parts), { writeToDom: true });
      this._syncValuePropFromState();
    });
    this._emitTimeChange('constraints');
  }

  @Watch('twelveHourOnly')
  onTwelveOnlyChange(next: boolean, prev: boolean) {
    if (next === prev) return;
    this._withEmitSuppressed(() => {
      this._applyFormatConstraints();
      if (!this._isInputFocused) this._setInputValue(this._partsToInput(this._parts), { writeToDom: true });
      this._syncValuePropFromState();
    });
    this._emitTimeChange('constraints');
  }

  @Watch('inputId')
  onInputIdChange(next: string, prev: string) {
    const n = (next ?? '').trim();
    const p = (prev ?? '').trim();
    if (n === p) return;

    if (this._open) this._setDropdownVisibility(false);
    if (!n) this.inputId = 'time-input';

    this._returnFocusEl = null;
    this._emitTimeChange('inputId');
  }

  @Watch('inputName')
  onInputNameChange(next: string, prev: string) {
    const n = (next ?? '').trim();
    const p = (prev ?? '').trim();
    if (n === p) return;
    this._emitTimeChange('inputName');
  }

  private qs<T extends Element = Element>(sel: string): T | null {
    return (this.host.querySelector(sel) as T) || null;
  }

  private get _isDisabled(): boolean {
    return !!this.disabled;
  }

  private get _isReadOnly(): boolean {
    return !!this.readOnly;
  }

  private get _isInteractionLocked(): boolean {
    return this._isDisabled || this._isReadOnly;
  }

  private get _hasTimeValidationError(): boolean {
    return !!this.timeValidation && !this.isValid;
  }

  private get _hasUserValidationError(): boolean {
    return !!this._userValidationActive && !!(this.validationMessage ?? '').trim();
  }

  private get _isInvalid(): boolean {
    return this._hasTimeValidationError || this._hasUserValidationError;
  }

  private _setInputValue(next: string, opts?: { writeToDom?: boolean }) {
    this._inputValue = next;
    if (opts?.writeToDom !== false) {
      if (this._inputEl && this._inputEl.value !== next) {
        this._inputEl.value = next;
      }
    }
  }

  private _readInputValue(): string {
    return this._inputEl?.value ?? this._inputValue ?? '';
  }

  private _syncValuePropFromState() {
    const next = this._partsToInput(this._parts);
    if (this.value !== next) this.value = next;
  }

  private _withEmitSuppressed(fn: () => void) {
    this._emitSuppressionDepth++;
    try {
      fn();
    } finally {
      this._emitSuppressionDepth--;
    }
  }

  private _emitTimeChange(source: TimeChangeDetail['source']) {
    if (this._emitSuppressionDepth > 0) return;
    this.timeChange.emit({
      value: this._partsToInput(this._parts),
      parts: { ...this._parts },
      isValid: this.isValid,
      source,
    });
  }

  private _emitTimeInputNow(detail: TimeInputDetail) {
    if (this._emitSuppressionDepth > 0) return;
    this.timeInput.emit(detail);
  }

  private _scheduleTimeInput(detail: TimeInputDetail) {
    if (this._emitSuppressionDepth > 0) return;

    const throttle = Math.max(0, Number(this.timeInputThrottleMs) || 0);
    if (throttle === 0) {
      this._emitTimeInputNow(detail);
      return;
    }

    const now = Date.now();
    const elapsed = now - this._timeInputLastEmitTs;

    if (elapsed >= throttle && this._timeInputTimer === undefined) {
      this._timeInputLastEmitTs = now;
      this._emitTimeInputNow(detail);
      return;
    }

    this._timeInputPending = detail;

    if (this._timeInputTimer !== undefined) return;

    const wait = Math.max(0, throttle - elapsed);
    this._timeInputTimer = window.setTimeout(() => {
      this._timeInputTimer = undefined;
      this._timeInputLastEmitTs = Date.now();

      if (this._timeInputPending) {
        const pending = this._timeInputPending;
        this._timeInputPending = null;
        this._emitTimeInputNow(pending);
      }
    }, wait);
  }

  private _flushTimeInput() {
    if (this._timeInputTimer !== undefined) {
      clearTimeout(this._timeInputTimer);
      this._timeInputTimer = undefined;
    }

    if (this._timeInputPending) {
      this._timeInputLastEmitTs = Date.now();
      const pending = this._timeInputPending;
      this._timeInputPending = null;
      this._emitTimeInputNow(pending);
    }
  }

  private _pad2(n: number): string {
    return String(Math.max(0, Math.trunc(n))).padStart(2, '0');
  }

  private _partsToInput(parts: TimeParts): string {
    const hh = this._pad2(parts.hour);
    const mm = this._pad2(parts.minute);
    const ss = this._pad2(parts.second);

    if (this.isTwentyFourHourFormat || this.twentyFourHourOnly) {
      return this.hideSeconds ? `${hh}:${mm}` : `${hh}:${mm}:${ss}`;
    }

    return this.hideSeconds ? `${hh}:${mm} ${parts.ampm}` : `${hh}:${mm}:${ss} ${parts.ampm}`;
  }

  private _normalizeForTyping(raw: string): string {
    return (raw ?? '').replace(/\s+/g, ' ').toUpperCase();
  }

  private _pattern(): RegExp {
    if (this.isTwentyFourHourFormat || this.twentyFourHourOnly) {
      return this.hideSeconds ? /^(\d{1,2}):(\d{1,2})$/ : /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    }

    return this.hideSeconds ? /^(\d{1,2}):(\d{1,2})\s?(AM|PM)$/ : /^(\d{1,2}):(\d{1,2}):(\d{1,2})\s?(AM|PM)$/;
  }

   private _validationMessageForPattern(): string {
    if (this.isTwentyFourHourFormat) {
      return this.hideSeconds ? 'Invalid time format. Correct format is HH:mm' : 'Invalid time format. Correct format is HH:mm:ss';
    }
    return this.hideSeconds ? 'Invalid time format. Correct format is hh:mm AM/PM' : 'Invalid time format. Correct format is hh:mm:ss AM/PM';
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

  private getTimeValidationId(): string {
    return `${this.inputId}-time-validation`;
  }

  private getValidationId(): string {
    return `${this.inputId}-validation`;
  }

  private getWarningId(): string {
    return `${this.inputId}-warning`;
  }

  private computeNameAttrs() {
    const hasVisibleLabel = !!this.showLabel;
    const userLabelledby = this.normalizeIdList(this.ariaLabelledby);

    const autoLabelId = hasVisibleLabel ? this.getLabelId() : undefined;
    const ariaLabelledby = autoLabelId ?? userLabelledby;

    const ariaLabel = ariaLabelledby ? undefined : (this.ariaLabel ?? '').trim() || (this.labelText ?? '').trim() || 'Time Picker';

    return { hasVisibleLabel, ariaLabelledby, ariaLabel };
  }

  private computeDescribedByAttrs() {
    const external = this.normalizeIdList(this.ariaDescribedby);
    const timeValidationId = this.timeValidation && (this.timeValidationMessage ?? '').trim() ? this.getTimeValidationId() : undefined;
    const validationId = this._userValidationActive && (this.validationMessage ?? '').trim() ? this.getValidationId() : undefined;
    const warningId = this._warningVisible ? this.getWarningId() : undefined;
    return this.mergeIdLists(external, this.mergeIdLists(timeValidationId, this.mergeIdLists(validationId, warningId)));
  }

  private _formatAllowed(nextIs24: boolean): boolean {
    if (this.twentyFourHourOnly && !nextIs24) return false;
    if (this.twelveHourOnly && nextIs24) return false;
    return true;
  }

  private _coerceAllowedFormat(): boolean {
    if (this.twentyFourHourOnly) return true;
    if (this.twelveHourOnly) return false;
    return this.isTwentyFourHourFormat;
  }

  private _applyFormatConstraints() {
    const coerced = this._coerceAllowedFormat();
    if (this.isTwentyFourHourFormat !== coerced) {
      this.isTwentyFourHourFormat = coerced;
      return;
    }

    if (this.isTwentyFourHourFormat || this.twentyFourHourOnly) {
      if (this._parts.ampm !== 'AM') this._parts = { ...this._parts, ampm: 'AM' };
      if (this._activePart === 'ampm') this._activePart = 'hour';
    }

    this._recomputeValidityFromState();
  }

  private _defaultTimeForFormat(): { parts: TimeParts; inputValue: string } {
    if (this.isTwentyFourHourFormat) {
      return this.hideSeconds
        ? { parts: { hour: 0, minute: 0, second: 0, ampm: 'AM' }, inputValue: '00:00' }
        : { parts: { hour: 0, minute: 0, second: 0, ampm: 'AM' }, inputValue: '00:00:00' };
    }
    return this.hideSeconds
      ? { parts: { hour: 12, minute: 0, second: 0, ampm: 'AM' }, inputValue: '12:00 AM' }
      : { parts: { hour: 12, minute: 0, second: 0, ampm: 'AM' }, inputValue: '12:00:00 AM' };
  }

  private _resetToDefault() {
    const { parts, inputValue } = this._defaultTimeForFormat();
    this._parts = parts;

    this._setInputValue(inputValue, { writeToDom: true });

    if (this.isTwentyFourHourFormat || this.twentyFourHourOnly) {
      this._parts = { ...this._parts, ampm: 'AM' };
      this._setInputValue(this._partsToInput(this._parts), { writeToDom: true });
    }

    this.isValid = true;
    this._warningVisible = false;
    if (this.timeValidationMessage) this.timeValidationMessage = '';

    this._syncValuePropFromState();
    this._recomputeValidityFromState();
  }

  private _isPartsRangeValid(parts: TimeParts): boolean {
    const { hour: h, minute: m, second: s } = parts;

    if (this.isTwentyFourHourFormat || this.twentyFourHourOnly) {
      if (h < 0 || h > 23) return false;
    } else {
      if (h < 1 || h > 12) return false;
      if (parts.ampm !== 'AM' && parts.ampm !== 'PM') return false;
    }

    if (m < 0 || m > 59) return false;
    if (!this.hideSeconds && (s < 0 || s > 59)) return false;

    return true;
  }

  private _normalizeAndParse(raw: string): NormalizeResult {
    const normalized = (raw ?? '')
      .trim()
      .toUpperCase()
      .split(':')
      .map(part => part.trim().padStart(2, '0'))
      .join(':')
      .replace(/\s+/g, ' ')
      .trim();

    const m = normalized.match(this._pattern());
    if (!m) return { ok: false, normalized, reason: 'pattern' };

    const hour = Number.parseInt(m[1], 10);
    const minute = Number.parseInt(m[2], 10);
    const second = this.hideSeconds ? this._parts.second : Number.parseInt(m[3], 10);

    const ampm = this.isTwentyFourHourFormat || this.twentyFourHourOnly ? 'AM' : ((this.hideSeconds ? m[3] : m[4]) as AmPm);

    const parts: TimeParts = { hour, minute, second, ampm };

    if (!this._isPartsRangeValid(parts)) {
      return { ok: false, normalized, reason: 'range' };
    }

    return { ok: true, normalized, parts };
  }

  private _tryParseComplete(raw: string): NormalizeResult {
    const typed = this._normalizeForTyping(raw);
    return this._normalizeAndParse(typed);
  }

  private _applyExternalValue(raw: string): boolean {
    const res = this._normalizeAndParse(raw);

    if (isNormalizeErr(res)) {
      this.isValid = false;
      if (res.reason === 'pattern') {
        this.timeValidationMessage = this._validationMessageForPattern();
        this._warningVisible = false;
      } else {
        this.timeValidationMessage = '';
        this._warningVisible = true;
      }
      return false;
    }

    this._parts = res.parts;
    this._setInputValue(res.normalized, { writeToDom: true });

    this.isValid = true;
    this._warningVisible = false;
    if (this.timeValidationMessage) this.timeValidationMessage = '';
    return true;
  }

  private _recomputeValidityFromState() {
    const res = this._normalizeAndParse(this._partsToInput(this._parts));
    this.isValid = res.ok;

    if (!isNormalizeErr(res)) {
      this._warningVisible = false;
      if (this.timeValidationMessage) this.timeValidationMessage = '';
      return;
    }

    if (res.reason === 'pattern') {
      this.timeValidationMessage = this._validationMessageForPattern();
      this._warningVisible = false;
    } else {
      this.timeValidationMessage = '';
      this._warningVisible = true;
    }
  }

  private _handleFocusAndInteraction = (event: Event) => {
    if ((event as any).stopPropagation) (event as any).stopPropagation();

    const bFocusDiv = this.qs<HTMLDivElement>('.b-focus');
    const input = this._inputEl;
    const isInputFocused = event.target === input;

    if (!bFocusDiv) return;
    if (isInputFocused) {
      bFocusDiv.style.width = '100%';
      bFocusDiv.style.left = '0';
    } else {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  @Listen('click', { target: 'document', capture: true })
  onDocClickForUnderline(event: Event) {
    const bFocusDiv = this.qs<HTMLDivElement>('.b-focus');
    if (!bFocusDiv) return;

    const input = this._inputEl;
    const iconBtn = this.qs<HTMLButtonElement>('.time-icon-btn');

    const path = (event as any).composedPath ? (event as any).composedPath() : [];
    const clickedInput = input ? (path?.includes?.(input) ?? this.host.contains(event.target as Node)) : false;
    const clickedIcon = iconBtn ? (path?.includes?.(iconBtn) ?? this.host.contains(event.target as Node)) : false;

    if (!clickedInput && !clickedIcon) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  }

  private _getFocusableInDropdown(): HTMLElement[] {
    const dd = this.qs<HTMLDivElement>('.time-dropdown');
    if (!dd || !this._open) return [];

    const nodes = Array.from(
      dd.querySelectorAll<HTMLElement>('[role="spinbutton"][tabindex], button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    );

    return nodes.filter(el => {
      if (el.closest('.hidden')) return false;
      if ((el as any).disabled) return false;
      return true;
    });
  }

  private _trapTab(ev: KeyboardEvent) {
    const focusables = this._getFocusableInDropdown();
    if (focusables.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const idx = active ? focusables.indexOf(active) : -1;

    const forward = !ev.shiftKey;
    const next = forward ? (idx >= 0 ? (idx + 1) % focusables.length : 0) : idx >= 0 ? (idx - 1 + focusables.length) % focusables.length : focusables.length - 1;

    ev.preventDefault();
    focusables[next]?.focus();
  }

  private _setDropdownVisibility(show: boolean) {
    if (show && this._isInteractionLocked) return;

    const trigger = this.qs<HTMLButtonElement>('.time-icon-btn');
    const input = this._inputEl;

    if (show) {
      this._returnFocusEl = trigger || input || (this.host as unknown as HTMLElement);
      this._open = true;
      this._activePart = 'hour';

      requestAnimationFrame(() => this._focusActivePart());
    } else {
      this._open = false;

      const toFocus = this._returnFocusEl || input || trigger || (this.host as unknown as HTMLElement);
      toFocus?.focus();
    }
  }

  private _toggleDropdown = () => {
    if (this._isInteractionLocked) return;

    if (!this._isInputFocused) this._commitFromInput();
    this._setDropdownVisibility(!this._open);
  };

  private _hideDropdown = () => {
    if (this._isDisabled) return;
    this._setDropdownVisibility(false);
  };

  @Listen('keydown', { target: 'document' })
  onDocKeydown(ev: KeyboardEvent) {
    if (!this._open) return;
    if (this._isDisabled) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this._hideDropdown();
      return;
    }

    if (ev.key === 'Tab') {
      this._trapTab(ev);
    }
  }

  private _orderedParts(): TimePart[] {
    const parts: TimePart[] = ['hour', 'minute'];
    if (!this.hideSeconds) parts.push('second');
    if (!(this.isTwentyFourHourFormat || this.twentyFourHourOnly)) parts.push('ampm');
    return parts;
  }

  private _isPartEnabled(part: TimePart): boolean {
    if (part === 'second') return !this.hideSeconds;
    if (part === 'ampm') return !(this.isTwentyFourHourFormat || this.twentyFourHourOnly);
    return true;
  }

  private _moveActivePart(dir: -1 | 1) {
    const parts = this._orderedParts();
    const idx = parts.indexOf(this._activePart);
    if (idx < 0) this._activePart = parts[0] || 'hour';
    else this._activePart = parts[(idx + dir + parts.length) % parts.length];

    requestAnimationFrame(() => this._focusActivePart());
  }

  private _focusActivePart() {
    this._getPartEl(this._activePart)?.focus();
  }

  private _getPartEl(part: TimePart): HTMLElement | null {
    const sel = part === 'hour' ? '.hour-display' : part === 'minute' ? '.minute-display' : part === 'second' ? '.second-display' : '.ampm-display';
    return this.qs<HTMLElement>(sel);
  }

  private _setActivePart(part: TimePart) {
    if (!this._isPartEnabled(part)) return;
    this._activePart = part;
  }

  private _getSpinMeta(part: TimePart) {
    const p = this._parts;
    if (part === 'hour') {
      const min = this.isTwentyFourHourFormat ? 0 : 1;
      const max = this.isTwentyFourHourFormat ? 23 : 12;
      const now = p.hour;
      return { min, max, now, text: this._pad2(now), label: 'Hour' };
    }
    if (part === 'minute') {
      const now = p.minute;
      return { min: 0, max: 59, now, text: this._pad2(now), label: 'Minute' };
    }
    if (part === 'second') {
      const now = p.second;
      return { min: 0, max: 59, now, text: this._pad2(now), label: 'Second' };
    }
    const now = p.ampm === 'PM' ? 1 : 0;
    return { min: 0, max: 1, now, text: now === 0 ? 'AM' : 'PM', label: 'AM/PM' };
  }

  private _applySpinDelta(part: TimePart, delta: number) {
     if (this._isInteractionLocked) return;

    this._didUserChangeTime = true;

    this._userValidationActive = false;
    if (this.timeValidationMessage) this.timeValidationMessage = '';
    this.isValid = true;
    this._warningVisible = false;

    const meta = this._getSpinMeta(part);

    if (part === 'ampm') {
      this._parts = { ...this._parts, ampm: meta.now === 0 ? 'PM' : 'AM' };
    } else {
      let next = meta.now + delta;
      if (next > meta.max) next = meta.min;
      if (next < meta.min) next = meta.max;

      this._parts = part === 'hour' ? { ...this._parts, hour: next } : part === 'minute' ? { ...this._parts, minute: next } : { ...this._parts, second: next };
    }

    const formatted = this._partsToInput(this._parts);
    this._setInputValue(formatted, { writeToDom: true });
    this._syncValuePropFromState();

    this._emitTimeChange('spinner');
  }

  private _onSpinKeyDown = (part: TimePart, ev: KeyboardEvent) => {
    if (this._isInteractionLocked) return;
    if (!this._open) return;

    const key = ev.key;

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
      this._applySpinDelta(part, meta.min - meta.now);
      return;
    }
    if (key === 'End') {
      ev.preventDefault();
      const meta = this._getSpinMeta(part);
      this._applySpinDelta(part, meta.max - meta.now);
      return;
    }
    if (key === 'Enter') {
      ev.preventDefault();
      this._commitFromInput();
    }
  };

  private _toggleFormat = () => {
    if (this._isDisabled) return;
    if (this.twentyFourHourOnly || this.twelveHourOnly) return;

    this.isTwentyFourHourFormat = !this.isTwentyFourHourFormat;
    this._emitTimeChange('format');
  };

  private _convertTimeFormatInState() {
    const p = this._parts;

    if (this.isTwentyFourHourFormat) {
      let h = Math.min(12, Math.max(1, p.hour));
      if (p.ampm === 'PM' && h < 12) h += 12;
      if (p.ampm === 'AM' && h === 12) h = 0;

      this._parts = { ...p, hour: h, ampm: 'AM' };
      return;
    }

    let h = Math.min(23, Math.max(0, p.hour));
    let ampm: AmPm = 'AM';

    if (h === 0) {
      h = 12;
      ampm = 'AM';
    } else if (h === 12) {
      ampm = 'PM';
    } else if (h > 12) {
      h -= 12;
      ampm = 'PM';
    } else {
      ampm = 'AM';
    }

    this._parts = { ...p, hour: h, ampm };
  }

  private _commitFromInput() {
    if (this._isInteractionLocked) return;

    this._flushTimeInput();

    const raw = this._readInputValue();
    const res = this._normalizeAndParse(raw);

    if (isNormalizeErr(res)) {
      this.isValid = false;

      if (res.reason === 'pattern') {
        this.timeValidationMessage = this._validationMessageForPattern();
        this._warningVisible = false;
      } else {
        this.timeValidationMessage = '';
        this._warningVisible = true;
      }
      return;
    }

    this._parts = res.parts;
    this._setInputValue(res.normalized, { writeToDom: true });

    this.isValid = true;
    this._userValidationActive = false;
    this._warningVisible = false;
    if (this.timeValidationMessage) this.timeValidationMessage = '';

    this._syncValuePropFromState();

    if (this._didUserChangeTime) {
      this._emitTimeChange('commit');

      this._didUserChangeTime = false;
    }
  }

  private _validateTimeInput = (ev: Event) => {
    if (this._isInteractionLocked) return;

    this._didUserChangeTime = true;

    const input = ev.target as HTMLInputElement | null;
    const raw = input?.value ?? this._readInputValue();

    this._setInputValue(raw, { writeToDom: false });

    const caretStart = input?.selectionStart ?? null;
    const caretEnd = input?.selectionEnd ?? null;

    const ie = ev as InputEvent;
    const inputType = typeof ie?.inputType === 'string' ? ie.inputType : null;

    const normalizedForTyping = this._normalizeForTyping(raw);
    const parsed = this._tryParseComplete(raw);

    if (isNormalizeErr(parsed)) {
      this.isValid = false;
      if (parsed.reason === 'pattern') {
        this.timeValidationMessage = this._validationMessageForPattern();
        this._warningVisible = false;
      } else {
        this.timeValidationMessage = '';
        this._warningVisible = true;
      }

      this._scheduleTimeInput({
        raw,
        normalized: normalizedForTyping,
        isValid: false,
        reason: parsed.reason,
        caretStart,
        caretEnd,
        inputType,
      });

      return;
    }

    this.isValid = true;
    this._userValidationActive = false;
    this._warningVisible = false;
    if (this.timeValidationMessage) this.timeValidationMessage = '';

    this._parts = parsed.parts;

    this._scheduleTimeInput({
      raw,
      normalized: normalizedForTyping,
      isValid: true,
      parts: parsed.parts,
      caretStart,
      caretEnd,
      inputType,
    });
  };

  private _handleEnterKeyOnly = (e: KeyboardEvent) => {
    if (this._isInteractionLocked) return;
    if (e.key === 'Enter') this._commitFromInput();
  };

  private _preventInvalidPaste = (_event: ClipboardEvent) => {
    return;
  };

  private _clearTime = () => {
    if (this._isInteractionLocked) return;

    this._flushTimeInput();
    this._didUserChangeTime = true;

    this._resetToDefault();
    this._userValidationActive = !!this.validation && !!(this.validationMessage ?? '').trim();
    this._emitTimeChange('clear');
    this._didUserChangeTime = false;

    this._scheduleTimeInput({
      raw: '',
      normalized: this._normalizeForTyping(this._readInputValue()),
      isValid: true,
      parts: { ...this._parts },
      caretStart: null,
      caretEnd: null,
      inputType: 'deleteContentBackward',
    });
  };

  render() {
    const disabledAll = this._isDisabled;
    const readOnly = this._isReadOnly;
    const isPopoverOpen = this._open && !disabledAll && !readOnly;
    const disableInteractive = disabledAll || readOnly || !this.isValid;

    const groupSize = this.size === 'sm' ? ' input-group-sm' : this.size === 'lg' ? ' input-group-lg' : '';
    const ddSize = this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : '';
    const maxLength = this.isTwentyFourHourFormat ? (this.hideSeconds ? 5 : 8) : this.hideSeconds ? 8 : 11;

    const inputInlineStyle = this.inputWidth !== undefined && this.inputWidth !== null && this.inputWidth !== '' ? { width: `${this.inputWidth}px` } : {};

    const dropdownId = this.getDropdownId();
    const timeValidationId = this.getTimeValidationId();
    const validationId = this.getValidationId();
    const warningId = this.getWarningId();

    const { hasVisibleLabel, ariaLabelledby, ariaLabel } = this.computeNameAttrs();
    const describedBy = this.computeDescribedByAttrs();

    const isInvalid = this._isInvalid;
    const dropdownClass = `time-dropdown${ddSize}${isPopoverOpen ? '' : ' hidden'}`;

    const hourMeta = this._getSpinMeta('hour');
    const minMeta = this._getSpinMeta('minute');
    const secMeta = this._getSpinMeta('second');
    const ampmMeta = this._getSpinMeta('ampm');

    const tabFor = (part: TimePart) => (isPopoverOpen && this._activePart === part ? 0 : -1);
    const labelIdToUse = hasVisibleLabel ? this.getLabelId() : this.normalizeIdList(this.ariaLabelledby);

    return (
      <div class="plumage">
        <div class="time-picker-container">
          <div class={`time-picker ${!this.twentyFourHourOnly && !this.twelveHourOnly ? 'mr-2' : ''}`}>
            <label
              htmlFor={this.inputId}
              id={hasVisibleLabel ? this.getLabelId() : undefined}
              class={`${this.showLabel ? '' : 'sr-only'}${this.readOnly || this._isDisabled ? '' : isInvalid ? ' is-invalid' : ''}`}
            >
              {this.labelText}
              {this.readOnly || this._isDisabled ? null : this.required ? <span class="required">*</span> : null}
            </label>

            <div class="timepicker-group">
              <div class="dd-position">
                <div class={`input-group${groupSize}${this._isDisabled ? ' disabled' : ''}`}>
                  <input
                    ref={el => {
                      this._inputEl = el as HTMLInputElement;
                      if (this._inputEl && this._inputEl.value !== this._inputValue) {
                        this._inputEl.value = this._inputValue;
                      }
                    }}
                    type="text"
                    id={this.inputId}
                    name={this.inputName}
                    class={`form-control time-input${this.readOnly ? ' read-only' : this._isDisabled ? '' : isInvalid ? ' is-invalid' : ''}`}
                    style={inputInlineStyle as any}
                    placeholder="Enter Time"
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby || (hasVisibleLabel ? this.getLabelId() : undefined)}
                    aria-controls={dropdownId}
                    aria-expanded={isPopoverOpen ? 'true' : 'false'}
                    aria-haspopup="dialog"
                    aria-invalid={isInvalid ? 'true' : undefined}
                    aria-required={this.required ? 'true' : undefined}
                    required={this.required}
                    aria-describedby={describedBy}
                    maxLength={maxLength}
                    disabled={disabledAll}
                    readOnly={readOnly}
                    aria-readonly={readOnly ? 'true' : undefined}
                    onFocus={e => {
                      this._isInputFocused = true;
                      this._handleFocusAndInteraction(e);
                    }}
                    onBlur={e => {
                      this._isInputFocused = false;
                      this._handleFocusAndInteraction(e);
                      this._flushTimeInput();
                      if (!disabledAll) this._commitFromInput();
                    }}
                    onInput={this._validateTimeInput}
                    onPaste={this._preventInvalidPaste}
                    onKeyDown={this._handleEnterKeyOnly}
                  />

                  {readOnly ? null : (
                    <button
                      type="button"
                      class={`clear-button${this.readOnly ? '' : this._isDisabled ? '' : isInvalid ? ' invalid' : ''}`}
                      aria-label="Clear time"
                      onClick={this._clearTime}
                      disabled={disabledAll}
                    >
                      <i class="fas fa-times-circle" />
                    </button>
                  )}

                  {this.hideTimepickerBtn || this.readOnly ? null : (
                    <button
                      type="button"
                      class={`time-icon input-group-text time-icon-btn${this.readOnly ? '' : this._isDisabled ? '' : isInvalid ? ' invalid' : ''}`}
                      aria-label="Open time picker"
                      aria-controls={dropdownId}
                      aria-expanded={isPopoverOpen ? 'true' : 'false'}
                      aria-haspopup="dialog"
                      tabIndex={0}
                      onClick={this._toggleDropdown}
                      disabled={disableInteractive}
                    >
                      <i class="fa fa-clock" />
                    </button>
                  )}
                </div>

                <div class={`b-underline${readOnly ? ' disabled' : isInvalid ? ' invalid' : ''}`} role="presentation">
                  <div
                    class={`b-focus${disabledAll || readOnly ? ' disabled' : isInvalid ? ' invalid' : ''}`}
                    role="presentation"
                    aria-hidden="true"
                    style={{ width: '0', left: '50%' } as any}
                  />
                </div>

                <div
                  id={dropdownId}
                  class={dropdownClass}
                  role="dialog"
                  aria-modal="false"
                  aria-labelledby={labelIdToUse || undefined}
                  aria-describedby={describedBy}
                  tabIndex={-1}
                  inert={!isPopoverOpen}
                  style={!isPopoverOpen ? ({ pointerEvents: 'none' } as any) : undefined}
                >
                  <div class="time-spinner-wrapper">
                    <div class="time-spinner">
                      <button type="button" class="arrow up" aria-label="Increment hour" onClick={() => this._applySpinDelta('hour', +1)} disabled={disabledAll}>
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

                      <button type="button" class="arrow down" aria-label="Decrement hour" onClick={() => this._applySpinDelta('hour', -1)} disabled={disabledAll}>
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

                    <div class="time-spinner">
                      <button type="button" class="arrow up" aria-label="Increment minute" onClick={() => this._applySpinDelta('minute', +1)} disabled={disabledAll}>
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

                      <button type="button" class="arrow down" aria-label="Decrement minute" onClick={() => this._applySpinDelta('minute', -1)} disabled={disabledAll}>
                        <i class="fas fa-chevron-down" />
                      </button>
                    </div>

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
                          <button type="button" class="arrow up" aria-label="Increment second" onClick={() => this._applySpinDelta('second', +1)} disabled={disabledAll}>
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

                          <button type="button" class="arrow down" aria-label="Decrement second" onClick={() => this._applySpinDelta('second', -1)} disabled={disabledAll}>
                            <i class="fas fa-chevron-down" />
                          </button>
                        </div>
                      </Fragment>
                    )}

                    {this.isTwentyFourHourFormat || this.twentyFourHourOnly ? null : (
                      <div class="time-spinner am-pm-spinner" aria-hidden="false">
                        <button type="button" class="arrow up" aria-label="Toggle AM/PM" onClick={() => this._applySpinDelta('ampm', +1)} disabled={disabledAll}>
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

                        <button type="button" class="arrow down" aria-label="Toggle AM/PM" onClick={() => this._applySpinDelta('ampm', -1)} disabled={disabledAll}>
                          <i class="fas fa-chevron-down" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div class="time-spinner-close">
                    <button type="button" class="btn btn-outline-primary btn-sm btntext close-button" aria-label="Close" onClick={this._hideDropdown} disabled={disabledAll}>
                      Close
                    </button>
                  </div>
                </div>
              </div>

              {!readOnly && !this.twentyFourHourOnly && !this.twelveHourOnly ? (
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

            <div
              id={timeValidationId}
              class={`validation-message ${this.readOnly || this._isDisabled ? 'hidden' : this.timeValidation && this.timeValidationMessage ? '' : 'hidden'}`}
              role="alert"
              aria-live="polite"
            >
              {this.timeValidation && this.timeValidationMessage ? this.timeValidationMessage : ''}
            </div>

            <div
              id={validationId}
              class={`validation-message ${this.readOnly || this._isDisabled ? 'hidden' : this._userValidationActive && this.validationMessage ? '' : 'hidden'}`}
              role="alert"
              aria-live="polite"
            >
              {this._userValidationActive && this.validationMessage ? this.validationMessage : ''}
            </div>

            <div id={warningId} class={`warning-message ${this.readOnly || this._isDisabled ? 'hidden' : this._warningVisible ? '' : 'hidden'}`} role="alert" aria-live="polite">
              <i class="fa fa-exclamation-triangle" aria-hidden="true" /> Time values cannot exceed the limits.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
