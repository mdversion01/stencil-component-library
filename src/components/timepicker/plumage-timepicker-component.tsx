// src/components/timepicker/timepicker-component.tsx
import { Component, h, Prop, Element, State, Method, Fragment } from '@stencil/core';

@Component({
  tag: 'plumage-timepicker-component',
  styleUrls: [
    './timepicker-styles.scss',
    '../utilities-styles.scss',
    '../button/button.scss',
    '../plumage-input-field/plumage-input-field-styles.scss',
    '../plumage-input-group/plumage-input-group-styles.scss',
  ],
  shadow: false,
})
export class PlumageTimepickerComponent {
  @Element() host!: HTMLElement;

  /** Accessible label for the input */
  @Prop() ariaLabel: string = 'Time Picker';

  /** ID of the external label element (for aria-labelledby) */
  @Prop() ariaLabelledby: string = 'time-label';

  @Prop() showLabel?: boolean;

  @Prop() labelText: string = 'Enter Time';

  /** (Renamed from reserved `id`) ID passed to the internal input */
  @Prop() inputId: string = 'time-input';

  /** Name attribute for the inner input */
  @Prop() inputName: string = 'time';

  /** Use 24-hour format by default (mutable: toggled by the component) */
  @Prop({ mutable: true }) isTwentyFourHourFormat: boolean = true;

  /** Optional size variant: '', 'sm', 'lg' */
  @Prop() size: string = '';

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

  /** (Used in Lit markup for underline states) */
  @Prop() validation?: boolean = false;

  /** (Used in Lit markup for underline states) */
  @Prop() disabled?: boolean = false;

  @State() _tick = 0;

  // ---------- lifecycle ----------
  connectedCallback() {
    document.addEventListener('click', this._handleDocumentClick, true);

    if (this.twentyFourHourOnly) {
      this.isTwentyFourHourFormat = true;
    } else if (this.twelveHourOnly) {
      this.isTwentyFourHourFormat = false;
    }
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._handleDocumentClick, true);
  }

  componentDidLoad() {
    this._setDefaultTime();
  }

  // ---------- helpers ----------
  private qs<T extends Element = Element>(sel: string): T | null {
    // ⬅️ query light DOM
    return (this.host.querySelector(sel) as T) || null;
  }

  private forceUpdate() {
    this._tick++;
  }

  // ---------- public API ----------
  /** Force-validate and sync input -> dropdown */
  @Method()
  async forceTimeUpdate(): Promise<void> {
    this._updateTimeFromInput();
  }

  // ---------- focus underline + doc click ----------
  private _handleFocusAndInteraction = (event: Event) => {
    if ((event as any).stopPropagation) {
      (event as any).stopPropagation();
    }
    const bFocusDiv = this.qs<HTMLDivElement>('.b-focus');
    const input = this.qs<HTMLInputElement>('input');

    const isInputFocused = event.target === input;

    if (bFocusDiv) {
      if (isInputFocused) {
        bFocusDiv.style.width = '100%';
        bFocusDiv.style.left = '0';
      } else {
        bFocusDiv.style.width = '0';
        bFocusDiv.style.left = '50%';
      }
    }
  };

  private _handleDocumentClick = (event: Event) => {
    const bFocusDiv = this.qs<HTMLDivElement>('.b-focus');
    const input = this.qs<HTMLInputElement>('input');
    const iconBtn = this.qs<HTMLButtonElement>('.time-icon-btn');

    const path = (event as any).composedPath ? (event as any).composedPath() : [];
    const clickedInput =
      (path && input ? path.includes(input) : false) || (!!input && this.host.contains(event.target as Node) && (event.target === input || input.contains(event.target as Node)));
    const clickedIcon = (path && iconBtn ? path.includes(iconBtn) : false) || (!!iconBtn && (event.target === iconBtn || iconBtn.contains(event.target as Node)));

    if (!clickedInput && !clickedIcon && bFocusDiv) {
      bFocusDiv.style.width = '0';
      bFocusDiv.style.left = '50%';
    }
  };

  // ---------- dropdown visibility helpers ----------
  private _returnFocusEl?: HTMLElement | null;

  private _enablePanel(dd: HTMLElement) {
    dd.classList.remove('hidden');
    dd.removeAttribute('inert');
    // Important: drop aria-hidden entirely while visible
    dd.removeAttribute('aria-hidden');
    dd.style.pointerEvents = 'auto';
  }

  private _disablePanel(dd: HTMLElement) {
    dd.classList.add('hidden');
    dd.setAttribute('inert', '');
    // Keep aria-hidden off; rely on hidden+inert to avoid AT/focus traps
    dd.removeAttribute('aria-hidden');
    dd.style.pointerEvents = 'none';
  }

  private _setDropdownVisibility(show: boolean) {
    const dd = this.qs<HTMLDivElement>('.time-dropdown');
    if (!dd) return;

    if (show) {
      // Ensure no stray hidden attribute
      dd.removeAttribute('hidden');

      // Remember where to return focus when closing
      this._returnFocusEl = this.qs<HTMLButtonElement>('.time-icon-btn') || this.qs<HTMLInputElement>('.time-input') || (this.host as unknown as HTMLElement);

      // Make it operable
      this._enablePanel(dd);

      // Focus something inside the panel
      const firstFocus = dd.querySelector<HTMLElement>('.hour-display') || dd.querySelector<HTMLElement>('button, [tabindex]:not([tabindex="-1"])') || dd;
      firstFocus?.focus();
    } else {
      // Move focus OUT before hiding (avoid "aria-hidden ancestor has focus")
      const toFocus =
        this._returnFocusEl ||
        this.qs<HTMLInputElement>('.time-input') || // prefer input
        this.qs<HTMLButtonElement>('.time-icon-btn') ||
        (this.host as unknown as HTMLElement);
      toFocus?.focus();

      // Then hide on the next frame
      requestAnimationFrame(() => this._disablePanel(dd));
    }
  }

  // ---------- dropdown + format ----------
  private _toggleDropdown = () => {
    this._formatTime();

    const dd = this.qs<HTMLDivElement>('.time-dropdown');
    if (!dd) return;

    const willShow = dd.classList.contains('hidden');
    this._setDropdownVisibility(willShow);

    // simulate focus underline on open
    if (willShow) {
      const fakeEvent = { target: this.qs<HTMLInputElement>('.time-input') } as unknown as Event;
      this._handleFocusAndInteraction(fakeEvent);
    }
  };

  private _hideDropdown = (ev?: Event) => {
    ev?.preventDefault();
    ev?.stopPropagation();
    this._setDropdownVisibility(false);
  };

  private _toggleFormat = () => {
    if (this.twentyFourHourOnly || this.twelveHourOnly) return;

    this._updateTimeFromInput();
    this.isTwentyFourHourFormat = !this.isTwentyFourHourFormat;
    this._convertTimeFormat();
    this._toggleAMPMSpinner();
    this._hideValidationMessage();
    this._hideWarningMessage();
    this._updateInput();
  };

  private _convertTimeFormat() {
    const input = this.qs<HTMLInputElement>('.time-input');
    if (!input) return;

    const timeInput = input.value;
    let [hoursStr, minutesStr, secondsStr] = timeInput.split(/[: ]/);
    const isPM = /PM$/.test(timeInput);
    let ampm = '';

    let hours = parseInt(hoursStr || '0', 10);
    const minutes = parseInt(minutesStr || '0', 10);
    const seconds = this.hideSeconds ? 0 : parseInt(secondsStr || '0', 10);

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

  // ---------- formatting / validation ----------
  private _formatTime() {
    const input = this.qs<HTMLInputElement>('.time-input');
    if (!input) return;

    const timePattern = this.isTwentyFourHourFormat
      ? this.hideSeconds
        ? /^(\d{1,2}):(\d{2})$/
        : /^(\d{1,2}):(\d{2}):(\d{2})$/
      : this.hideSeconds
      ? /^(\d{1,2}):(\d{2}) (AM|PM)$/
      : /^(\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/;

    const matches = input.value.match(timePattern);
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

  private _increment = (ev: Event) => {
    this._incrementDecrement(ev, true);
  };

  private _decrement = (ev: Event) => {
    this._incrementDecrement(ev, false);
  };

  private _incrementDecrement(ev: Event, increment: boolean) {
    const arrow = (ev.currentTarget as HTMLElement) || (ev.target as HTMLElement);
    if (!arrow) return;

    const wrapper = arrow.closest('.time-spinner') as HTMLElement | null;
    const arrowBtn = arrow.closest('.arrow') as HTMLElement | null; // ← removed the stray "the:" line
    const type = arrowBtn?.dataset.type;
    if (!wrapper || !type) return;

    const target = wrapper.querySelector<HTMLElement>(`.${type}-display`);
    if (!target) return;

    const isHour = target.classList.contains('hour-display');
    const isMinute = target.classList.contains('minute-display');
    const isSecond = target.classList.contains('second-display');
    const isAMPM = target.classList.contains('ampm-display');

    let value: number | string = isAMPM ? target.textContent || 'AM' : parseInt(target.textContent || '0', 10);

    if (isAMPM) {
      value = increment ? (value === 'AM' ? 'PM' : 'AM') : value === 'AM' ? 'PM' : 'AM';
    } else if (isHour || isMinute || isSecond) {
      if (increment) {
        value = (value as number) + 1;
        if (isHour) {
          if (this.isTwentyFourHourFormat) {
            if (value === 24) value = 0;
          } else {
            if (value > 12) value = 1;
          }
        } else if ((isMinute || isSecond) && (value as number) > 59) {
          value = 0;
        }
      } else {
        value = (value as number) - 1;
        if (isHour) {
          if (this.isTwentyFourHourFormat) {
            if (value < 0) value = 23;
          } else {
            if (value < 1) value = 12;
          }
        } else if ((isMinute || isSecond) && (value as number) < 0) {
          value = 59;
        }
      }
    }

    target.textContent = isAMPM ? (value as string) : String(value as number).padStart(2, '0');
    this._updateInput();
  }

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

    const formattedHours = this.isTwentyFourHourFormat ? String(hours).padStart(2, '0') : String(hours % 12 || 12).padStart(2, '0');

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
      } else if (hours === 12 && ampm === 'PM') {
        ampm = 'PM';
      } else if (hours === 12 && ampm === 'AM') {
        ampm = 'AM';
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

    const ampmSpinner = this.qs<HTMLDivElement>('.am-pm-spinner');
    if (ampmSpinner) {
      if (this.isTwentyFourHourFormat || this.twentyFourHourOnly) {
        ampmSpinner.classList.add('hidden');
        ampmSpinner.setAttribute('aria-hidden', 'true');
      } else {
        ampmSpinner.classList.remove('hidden');
        ampmSpinner.setAttribute('aria-hidden', 'false');
      }
    }
  }

  private _updateTimeFromInput() {
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
      this.forceUpdate();
      return;
    }

    input.value = value;

    this.isValid = true;
    this._toggleButtons();
    this._hideValidationMessage();
    this._hideWarningMessage();
    this._updateDropdown();

    const ampmMatch = value.match(/(AM|PM)$/);
    const ampmDisp = this.qs<HTMLElement>('.ampm-display');
    if (ampmMatch && ampmDisp) {
      ampmDisp.textContent = ampmMatch[1];
    }

    this._updateInput();
  }

  @Method()
  async forceTimeUpdatePublic(): Promise<void> {
    // alias if you want an exact API match with the Lit method name
    this._updateTimeFromInput();
  }

  private _validateTimeInput = () => {
    const input = this.qs<HTMLInputElement>('.time-input');
    const raw = (input?.value || '').trim();

    this.isValid = this._isValidInput(raw);
    this._toggleButtons();

    if (this.isValid) {
      this._updateDropdown();
    }
  };

  private _handleEnterKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && this.isValid) {
      this._updateTimeFromInput();
    }
  };

  private _handleEnterKeyOnly = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && this.isValid) {
      this._updateTimeFromInput();
    }
  };

  private _preventInvalidPaste = (_event: ClipboardEvent) => {
    // No-op: validation occurs on input
    return;
  };

  private _clearTime = () => {
    const timeInput = this.qs<HTMLInputElement>('.time-input');
    if (!timeInput) return;

    timeInput.value = this.isTwentyFourHourFormat ? (this.hideSeconds ? '00:00' : '00:00:00') : this.hideSeconds ? '12:00 AM' : '12:00:00 AM';

    this._updateDropdown();
    this._hideValidationMessage();
    this._hideWarningMessage();
    this.isValid = true;
    this._toggleButtons();

    const hourDisp = this.qs<HTMLElement>('.hour-display');
    const ampmDisp = this.qs<HTMLElement>('.ampm-display');
    const secDisp = this.qs<HTMLElement>('.second-display');

    if (hourDisp) hourDisp.textContent = this.isTwentyFourHourFormat ? '00' : '12';
    if (ampmDisp) ampmDisp.textContent = this.isTwentyFourHourFormat ? '' : 'AM';
    if (!this.hideSeconds && secDisp) secDisp.textContent = '00';
  };

  private _showValidationMessage(message: string) {
    this.validationMessage = message;
    this.forceUpdate();
  }

  private _hideValidationMessage() {
    this.validationMessage = '';
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

    this._hideValidationMessage();
    this._hideWarningMessage();
    return true;
  }

  private _showWarningMessage() {
    const warning = this.qs<HTMLDivElement>('.warning-message');
    if (!warning) return;
    warning.classList.remove('hidden');
  }

  private _hideWarningMessage() {
    const warning = this.qs<HTMLDivElement>('.warning-message');
    if (!warning) return;
    warning.classList.add('hidden');
  }

  private _setDefaultTime() {
    const input = this.qs<HTMLInputElement>('.time-input');
    if (!input) return;

    input.value = this.isTwentyFourHourFormat ? (this.hideSeconds ? '00:00' : '00:00:00') : this.hideSeconds ? '12:00 AM' : '12:00:00 AM';

    this._updateDropdown();
  }

  private _toggleButtons() {
    const toggleButton = this.qs<HTMLButtonElement>('.toggle-format-btn, .toggle-button'); // support both class names seen in Lit code
    const timeIconBtn = this.qs<HTMLButtonElement>('.time-icon-btn');

    if (toggleButton) {
      if (this.isValid) toggleButton.removeAttribute('disabled');
      else toggleButton.setAttribute('disabled', 'disabled');
    }

    if (timeIconBtn) {
      if (this.isValid) timeIconBtn.removeAttribute('disabled');
      else timeIconBtn.setAttribute('disabled', 'disabled');
    }
  }

  // ---------- render ----------
  render() {
    const groupSize = this.size === 'sm' ? ' input-group-sm' : this.size === 'lg' ? ' input-group-lg' : '';
    const ddSize = this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : '';

    const maxLength = this.isTwentyFourHourFormat ? (this.hideSeconds ? 5 : 8) : this.hideSeconds ? 8 : 11;

    const inputInlineStyle = this.inputWidth !== undefined && this.inputWidth !== null && this.inputWidth !== '' ? { width: `${this.inputWidth}px` } : {};

    return (
      <div class="plumage">
        <div class="time-picker-container">
          <div class={`time-picker ${!this.twentyFourHourOnly && !this.twelveHourOnly ? 'mr-2' : ''}`}>
            <label htmlFor={this.inputId} id={this.ariaLabelledby} class={this.showLabel ? undefined : 'sr-only'}>
              {this.labelText}
            </label>
            <div class="timepicker-group">
              <div class="dd-position">
                <div class={`input-group${groupSize}`}>
                  <input
                    type="text"
                    id={this.inputId}
                    name={this.inputName}
                    class="form-control time-input"
                    style={inputInlineStyle as any}
                    placeholder="Enter Time"
                    role="textbox"
                    aria-label={this.ariaLabel}
                    aria-labelledby={this.ariaLabelledby}
                    aria-controls="time-dropdown"
                    aria-invalid={(!this.isValid).toString()}
                    aria-describedby="validation-message"
                    maxLength={maxLength}
                    onFocus={this._handleFocusAndInteraction}
                    onBlur={this._handleFocusAndInteraction}
                    onInput={this._validateTimeInput}
                    onPaste={this._preventInvalidPaste}
                    onKeyPress={this._handleEnterKey}
                    onKeyDown={this._handleEnterKeyOnly}
                  />

                  {/* <div class="input-group-append"> */}
                    <button class="clear-button" aria-label="Clear Time" role="button" onClick={this._clearTime}>
                      <i class="fas fa-times-circle" />
                    </button>

                    {this.hideTimepickerBtn ? null : (
                      <button
                        class="time-icon input-group-text btn time-icon-btn"
                        aria-label="Open Timepicker"
                        role="button"
                        tabIndex={0}
                        onClick={this._toggleDropdown}
                        disabled={!this.isValid}
                      >
                        <i class="fa fa-clock" />
                      </button>
                    )}
                  {/* </div> */}
                </div>
                {/* underline / focus bar group */}
                <div class={`b-underline${this.validation ? ' invalid' : ''}`} role="presentation">
                  <div
                    class={`b-focus${this.disabled ? ' disabled' : ''}${this.validation ? ' invalid' : ''}`}
                    role="presentation"
                    aria-hidden="true"
                    style={{ width: '0', left: '50%' } as any}
                  />
                </div>
                {/* NOTE: no aria-hidden on initial markup; use class="hidden" + inert when closed */}
                <div class={`time-dropdown${ddSize} hidden`} role="listbox" aria-labelledby="time-label" tabIndex={0}>
                  <div class="time-spinner-wrapper">
                    {/* Hours */}
                    <div class="time-spinner">
                      <button class="arrow up" data-type="hour" aria-label="Increment Hour" role="button" onClick={this._increment}>
                        <i class="fas fa-chevron-up" />
                      </button>
                      <span class="hour-display" role="option" aria-selected="false" aria-activedescendant="active-hour" tabIndex={0} id="active-hour">
                        00
                      </span>
                      <button class="arrow down" data-type="hour" aria-label="Decrement Hour" role="button" onClick={this._decrement}>
                        <i class="fas fa-chevron-down" />
                      </button>
                    </div>

                    {/* Colon */}
                    <div class="time-spinner-colon">
                      <div class="dot">
                        <i class="fa fa-circle" />
                      </div>
                      <div class="dot">
                        <i class="fa fa-circle" />
                      </div>
                    </div>

                    {/* Minutes */}
                    <div class="time-spinner">
                      <button class="arrow up" data-type="minute" aria-label="Increment Minute" role="button" onClick={this._increment}>
                        <i class="fas fa-chevron-up" />
                      </button>
                      <span class="minute-display" role="option" aria-selected="false" aria-activedescendant="active-minute" tabIndex={0} id="active-minute">
                        00
                      </span>
                      <button class="arrow down" data-type="minute" aria-label="Decrement Minute" role="button" onClick={this._decrement}>
                        <i class="fas fa-chevron-down" />
                      </button>
                    </div>

                    {/* Seconds (optional) */}
                    {this.hideSeconds ? null : (
                      <Fragment>
                        <div class="time-spinner-colon">
                          <div class="dot">
                            <i class="fa fa-circle" />
                          </div>
                          <div class="dot">
                            <i class="fa fa-circle" />
                          </div>
                        </div>
                        <div class="time-spinner">
                          <button class="arrow up" data-type="second" aria-label="Increment Second" role="button" onClick={this._increment}>
                            <i class="fas fa-chevron-up" />
                          </button>
                          <span class="second-display" role="option" aria-selected="false" aria-activedescendant="active-second" tabIndex={0} id="active-second">
                            00
                          </span>
                          <button class="arrow down" data-type="second" aria-label="Decrement Second" role="button" onClick={this._decrement}>
                            <i class="fas fa-chevron-down" />
                          </button>
                        </div>
                      </Fragment>
                    )}

                    {/* AM/PM */}
                    <div class="time-spinner am-pm-spinner hidden">
                      <button class="arrow up" data-type="ampm" aria-label="Increment AM/PM" role="button" onClick={this._increment}>
                        <i class="fas fa-chevron-up" />
                      </button>
                      <span class="ampm-display" role="option" aria-selected="false" tabIndex={0} id="active-ampm" aria-activedescendant="active-ampm">
                        AM
                      </span>
                      <button class="arrow down" data-type="ampm" aria-label="Decrement AM/PM" role="button" onClick={this._decrement}>
                        <i class="fas fa-chevron-down" />
                      </button>
                    </div>
                  </div>

                  <div class="time-spinner-close">
                    <button class="btn btn-outline-primary btn-sm btntext close-button" aria-label="Close" onClick={this._hideDropdown}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
              {/* Format toggle (hidden if forced) */}
              {!this.twentyFourHourOnly && !this.twelveHourOnly ? (
                <button
                  class={`toggle-format-btn btn btn--outlined${this.size === 'sm' ? ' sm' : this.size === 'lg' ? ' lg' : ''}`}
                  aria-label={this.isTwentyFourHourFormat ? 'Switch to 12 Hour Format' : 'Switch to 24 Hour Format'}
                  role="button"
                  onClick={this._toggleFormat}
                  disabled={!this.isValid}
                >
                  {this.isTwentyFourHourFormat ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="format-btn">
                      <title>Switch to 12 Hour Format</title>
                      <path d="M13 2V4C17 4.5 20 7.8 20 11.9C20 15.1 18.1 17.9 15.3 19.2L13 17V22H18L16.8 20.8C19.9 19.1 22 15.8 22 12C22 6.8 18 2.5 13 2M11 2C9.1 2.2 7.2 3 5.7 4.2L7.1 5.6C8.2 4.8 9.6 4.2 11 4V2M4.2 5.7C3 7.2 2.2 9.1 2 11H4C4.2 9.6 4.8 8.2 5.6 7.1L4.2 5.7M2 13C2.2 14.9 3 16.8 4.2 18.3L5.6 16.9C4.8 15.8 4.2 14.4 4 13H2M7.1 18.4L5.7 19.8C7.2 21 9.1 21.8 11 22V20C9.6 19.8 8.2 19.2 7.1 18.4M12 8V10H15V11H14C12.9 11 12 11.9 12 13V16H17V14H14V13H15C16.1 13 17 12.1 17 11V10C17 8.9 16.1 8 15 8H12M7 8V10H8V16H10V8H7Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="format-btn">
                      <title>Switch to 24 Hour Format</title>
                      <path d="M13 2.05V4.07C16.95 4.56 20 7.92 20 12C20 15.21 18.08 18 15.28 19.28L13 17V22H18L16.78 20.78C19.91 19.07 22 15.76 22 12C22 6.82 18.05 2.55 13 2.05M11 2C9.05 2.2 7.2 2.96 5.68 4.21L7.1 5.63C8.23 4.75 9.58 4.2 11 4V2M4.2 5.68C2.96 7.2 2.2 9.05 2 11H4C4.19 9.58 4.75 8.23 5.63 7.1L4.2 5.68M6 8V10H9V11H8C6.9 11 6 11.9 6 13V16H11V14H8V13H9C10.11 13 11 12.11 11 11V10C11 8.9 10.11 8 9 8H6M12 8V13H15V16H17V13H18V11H17V8H15V11H14V8H12M2 13C2.2 14.95 2.97 16.8 4.22 18.32L5.64 16.9C4.76 15.77 4.2 14.42 4 13H2M7.11 18.37L5.68 19.79C7.2 21.03 9.05 21.8 11 22V20C9.58 19.81 8.24 19.25 7.11 18.37Z" />
                    </svg>
                  )}
                </button>
              ) : null}
            </div>

            <div class={`validation-message ${this.validationMessage ? '' : 'hidden'}`} role="alert" id="validation-message">
              {this.validationMessage}
            </div>

            <div class="warning-message hidden" role="alert" id="warning-message">
              <i class="fa fa-exclamation-triangle" /> Time values cannot exceed the limits.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
