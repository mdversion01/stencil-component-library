// src/components/timepicker/timepicker-manager-component.tsx
import { Component, h, Prop, Element, Event, EventEmitter, Watch, Method } from '@stencil/core';
import type { TimeChangeDetail, TimeInputDetail } from './timepicker-component';

export type ManagerTimeChangeDetail = TimeChangeDetail & {
  managerInputId: string;
  impl: 'timepicker-component' | 'plumage-timepicker-component';
};

export type ManagerTimeInputDetail = TimeInputDetail & {
  managerInputId: string;
  impl: 'timepicker-component' | 'plumage-timepicker-component';
};

export type FocusOptions = {
  open?: boolean;
};

@Component({
  tag: 'timepicker-manager',
  shadow: false,
})
export class TimepickerManagerComponent {
  @Element() host!: HTMLElement;

  /* -----------------------------
   Events (re-emitted)
  ------------------------------ */
  @Event({ eventName: 'timeChange' }) timeChange!: EventEmitter<TimeChangeDetail>;
  @Event({ eventName: 'timeInput' }) timeInput!: EventEmitter<TimeInputDetail>;

  /** Namespaced events to avoid collisions */
  @Event({ eventName: 'managerTimeChange' }) managerTimeChange!: EventEmitter<ManagerTimeChangeDetail>;
  @Event({ eventName: 'managerTimeInput' }) managerTimeInput!: EventEmitter<ManagerTimeInputDetail>;

  /* -----------------------------
   Accessibility (Overrides)
  ------------------------------ */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  /* -----------------------------
   Label UI (delegated to children)
  ------------------------------ */
  @Prop() showLabel?: boolean;
  @Prop() labelText: string = 'Enter Time';

  @Prop() inputId: string = 'time-input';
  @Prop() inputName: string = 'time';

  /* -----------------------------
   Controlled Value
  ------------------------------ */
  @Prop({ mutable: true }) value: string = '';

  /* -----------------------------
   Behavior / Display
 ------------------------------ */
  @Prop({ mutable: true }) isTwentyFourHourFormat: boolean = true;

  @Prop() size: string = '';

  @Prop({ mutable: true }) twentyFourHourOnly: boolean = false;
  @Prop({ mutable: true }) twelveHourOnly: boolean = false;
  @Prop() hideTimepickerBtn: boolean = false;

  @Prop({ mutable: true }) hideSeconds: boolean = false;

  @Prop() usePlTimepicker: boolean = false;

  @Prop() inputWidth: number | string = null;
  @Prop() required: boolean = false;

  @Prop() disableTimepicker: boolean = false;

  @Prop() timeInputThrottleMs: number = 50;

  /* -----------------------------
   Validation
 ------------------------------ */
  @Prop({ mutable: true }) validationMessage: string = '';
  @Prop({ mutable: true }) validation?: boolean = false;
  @Prop({ mutable: true }) isValid: boolean = true;

  /* -----------------------------
   Internal
 ------------------------------ */
  private _syncingFromChild = false;
  private _syncingFromChildProps = false;

  private _childEl: HTMLElement | null = null;

  @Watch('value')
  onValueChange(next: string, prev: string) {
    if (this._syncingFromChild) return;
    if ((next ?? '') === (prev ?? '')) return;
  }

  @Watch('isTwentyFourHourFormat')
  onFormatChange(next: boolean, prev: boolean) {
    if (this._syncingFromChildProps) return;
    if (next === prev) return;
  }

  @Watch('hideSeconds')
  onHideSecondsChange(next: boolean, prev: boolean) {
    if (this._syncingFromChildProps) return;
    if (next === prev) return;
  }

  private _impl(): 'timepicker-component' | 'plumage-timepicker-component' {
    return this.usePlTimepicker ? 'plumage-timepicker-component' : 'timepicker-component';
  }

  private normalizeIdList(value?: string): string | undefined {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return undefined;
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    return tokens.length ? tokens.join(' ') : undefined;
  }

  private joinIds(...ids: Array<string | undefined>): string | undefined {
    const tokens = ids
      .map(v => this.normalizeIdList(v))
      .filter(Boolean)
      .join(' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!tokens.length) return undefined;

    const out: string[] = [];
    for (const t of tokens) if (!out.includes(t)) out.push(t);
    return out.join(' ');
  }

  private getChildValidationId(): string {
    const base = (this.inputId || '').trim() || 'time-input';
    return `${base}-validation`;
  }

  private computeA11y() {
    const labelledBy = this.normalizeIdList(this.ariaLabelledby);
    const label = (this.ariaLabel ?? '').trim() || undefined;

    const hasMsg = !!(this.validationMessage ?? '').trim();
    const validationId = hasMsg ? this.getChildValidationId() : undefined;

    const describedBy = this.joinIds(this.ariaDescribedby, validationId);

    return {
      ariaLabel: labelledBy ? undefined : label,
      ariaLabelledby: labelledBy,
      ariaDescribedby: describedBy,
    };
  }

  private commonProps() {
    const a11y = this.computeA11y();

    return {
      ariaLabel: a11y.ariaLabel,
      ariaLabelledby: a11y.ariaLabelledby,
      ariaDescribedby: a11y.ariaDescribedby,

      showLabel: this.showLabel,
      labelText: this.labelText,
      inputId: this.inputId,
      inputName: this.inputName,

      value: this.value,

      isTwentyFourHourFormat: this.isTwentyFourHourFormat,
      size: this.size,
      inputWidth: this.inputWidth,

      validationMessage: this.validationMessage,
      validation: this.validation,
      isValid: this.isValid,

      twentyFourHourOnly: this.twentyFourHourOnly,
      twelveHourOnly: this.twelveHourOnly,
      hideTimepickerBtn: this.hideTimepickerBtn,
      hideSeconds: this.hideSeconds,

      timeInputThrottleMs: this.timeInputThrottleMs,

      required: this.required,
    };
  }

  /* -----------------------------
   Public method: focusInput({open})
   - Focus input
   - Optionally open popover
   - If opened, focus hour spinbutton so arrows work immediately
 ------------------------------ */
  @Method()
  async focusInput(options?: FocusOptions): Promise<void> {
    const child =
      this._childEl ??
      (this.host.querySelector('timepicker-component, plumage-timepicker-component') as HTMLElement | null);

    if (!child) return;

    // 1) Focus input
    const maybeFocus = (child as any).focusInput;
    if (typeof maybeFocus === 'function') {
      try {
        await maybeFocus.call(child, options);
        return;
      } catch {
        // fall through
      }
    }

    const input = child.querySelector('input.time-input') as HTMLInputElement | null;
    input?.focus();

    // 2) Optionally open popover
    if (!options?.open) return;

    const maybeOpen = (child as any).open;
    if (typeof maybeOpen === 'function') {
      try {
        await maybeOpen.call(child);
      } catch {
        // fall through
      }
    } else {
      const iconBtn = child.querySelector('.time-icon-btn') as HTMLButtonElement | null;
      if (iconBtn && !iconBtn.disabled) iconBtn.click();
    }

    // 3) Focus hour spinbutton after open
    requestAnimationFrame(() => {
      const hour = child.querySelector('.hour-display') as HTMLElement | null;
      hour?.focus();
    });
  }

  /* -----------------------------
   Public method: close()
   - Closes popover if open (both implementations)
 ------------------------------ */
  @Method()
  async close(): Promise<void> {
    const child =
      this._childEl ??
      (this.host.querySelector('timepicker-component, plumage-timepicker-component') as HTMLElement | null);

    if (!child) return;

    const maybeClose = (child as any).close ?? (child as any).hide ?? (child as any)._hideDropdown;
    if (typeof maybeClose === 'function') {
      try {
        await maybeClose.call(child);
        return;
      } catch {
        // fall through
      }
    }

    const btn =
      (child.querySelector('button.close-button') as HTMLButtonElement | null) ??
      (child.querySelector('.time-spinner-close button') as HTMLButtonElement | null);
    if (btn && !btn.disabled) {
      btn.click();
      return;
    }

    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true });
    child.dispatchEvent(ev);
  }

  /* -----------------------------
   Mirroring child mutable props up to manager
 ------------------------------ */
  private _mirrorFromChild() {
    const child = this._childEl;
    if (!child) return;

    const childFormat = (child as any).isTwentyFourHourFormat as boolean | undefined;
    const childHideSeconds = (child as any).hideSeconds as boolean | undefined;
    const childIsValid = (child as any).isValid as boolean | undefined;
    const childValidationMessage = (child as any).validationMessage as string | undefined;

    this._syncingFromChildProps = true;
    try {
      if (typeof childFormat === 'boolean' && childFormat !== this.isTwentyFourHourFormat) {
        this.isTwentyFourHourFormat = childFormat;
      }
      if (typeof childHideSeconds === 'boolean' && childHideSeconds !== this.hideSeconds) {
        this.hideSeconds = childHideSeconds;
      }
      if (typeof childIsValid === 'boolean' && childIsValid !== this.isValid) {
        this.isValid = childIsValid;
      }
      if (typeof childValidationMessage === 'string' && childValidationMessage !== this.validationMessage) {
        this.validationMessage = childValidationMessage;
      }
    } finally {
      this._syncingFromChildProps = false;
    }
  }

  /* -----------------------------
   Event handlers (child -> manager)
 ------------------------------ */
  private _onChildTimeChange = (ev: CustomEvent<TimeChangeDetail>) => {
    const detail = ev.detail;

    const next = detail?.value ?? '';
    if (next !== (this.value ?? '')) {
      this._syncingFromChild = true;
      try {
        this.value = next;
      } finally {
        this._syncingFromChild = false;
      }
    }

    this._mirrorFromChild();

    this.timeChange.emit(detail);

    this.managerTimeChange.emit({
      ...detail,
      managerInputId: (this.inputId || '').trim() || 'time-input',
      impl: this._impl(),
    });
  };

  private _onChildTimeInput = (ev: CustomEvent<TimeInputDetail>) => {
    const detail = ev.detail;

    this._mirrorFromChild();

    this.timeInput.emit(detail);

    this.managerTimeInput.emit({
      ...detail,
      managerInputId: (this.inputId || '').trim() || 'time-input',
      impl: this._impl(),
    });
  };

  render() {
    const props = this.commonProps();

    if (this.usePlTimepicker) {
      return (
        <plumage-timepicker-component
          ref={el => (this._childEl = el as any)}
          {...({
            ...(props as any),
            disabled: this.disableTimepicker,
            onTimeChange: this._onChildTimeChange,
            onTimeInput: this._onChildTimeInput,
          } as any)}
        />
      );
    }

    return (
      <timepicker-component
        ref={el => (this._childEl = el as any)}
        {...({
          ...(props as any),
          disableTimepicker: this.disableTimepicker,
          onTimeChange: this._onChildTimeChange,
          onTimeInput: this._onChildTimeInput,
        } as any)}
      />
    );
  }
}
