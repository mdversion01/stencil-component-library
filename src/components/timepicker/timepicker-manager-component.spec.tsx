// src/components/timepicker/timepicker-manager-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { Component, Prop, h, Method, Event, EventEmitter, Element } from '@stencil/core';
import { TimepickerManagerComponent } from './timepicker-manager-component';
import type { TimeChangeDetail, TimeInputDetail } from './timepicker-component';

/**
 * NOTE:
 * Use lightweight stubs instead of importing real child components.
 * Focus tests on manager forwarding + a11y precedence/merging behavior + method/event bridging.
 */

@Component({ tag: 'timepicker-component', shadow: false })
class TimepickerStub {
  @Element() host!: HTMLElement;

  @Prop() ariaLabel?: string;
  @Prop() ariaLabelledby?: string;
  @Prop() ariaDescribedby?: string;

  @Prop() showLabel?: boolean;
  @Prop() labelText?: string;
  @Prop() inputId?: string;
  @Prop() inputName?: string;

  @Prop() value?: string;

  @Prop() isTwentyFourHourFormat?: boolean;
  @Prop() size?: string;

  @Prop() validationMessage?: string;
  @Prop() validation?: boolean;
  @Prop() isValid?: boolean;

  @Prop() twentyFourHourOnly?: boolean;
  @Prop() twelveHourOnly?: boolean;
  @Prop() hideTimepickerBtn?: boolean;
  @Prop() hideSeconds?: boolean;
  @Prop() inputWidth?: any;
  @Prop() required?: boolean;

  @Prop() timeInputThrottleMs?: number;

  @Prop() disableTimepicker?: boolean;

  @Method()
  async focusInput(options?: { open?: boolean }): Promise<void> {
    this.host.setAttribute('data-focus-called', '1');
    this.host.setAttribute('data-focus-open', options?.open ? '1' : '0');
  }

  @Method()
  async open(): Promise<void> {
    this.host.setAttribute('data-open-called', '1');
  }

  @Method()
  async close(): Promise<void> {
    this.host.setAttribute('data-close-called', '1');
  }

  @Event({ eventName: 'timeChange' }) timeChange!: EventEmitter<TimeChangeDetail>;
  @Event({ eventName: 'timeInput' }) timeInput!: EventEmitter<TimeInputDetail>;

  render() {
    return (
      <pre class="stub-props">
        {JSON.stringify(
          {
            kind: 'classic',
            ariaLabel: this.ariaLabel ?? null,
            ariaLabelledby: this.ariaLabelledby ?? null,
            ariaDescribedby: this.ariaDescribedby ?? null,

            showLabel: !!this.showLabel,
            labelText: this.labelText ?? null,
            inputId: this.inputId ?? null,
            inputName: this.inputName ?? null,

            value: this.value ?? null,

            isTwentyFourHourFormat: this.isTwentyFourHourFormat ?? null,
            size: this.size ?? null,
            inputWidth: this.inputWidth ?? null,

            validationMessage: this.validationMessage ?? null,
            validation: this.validation ?? null,
            isValid: this.isValid ?? null,

            twentyFourHourOnly: this.twentyFourHourOnly ?? null,
            twelveHourOnly: this.twelveHourOnly ?? null,
            hideTimepickerBtn: this.hideTimepickerBtn ?? null,
            hideSeconds: this.hideSeconds ?? null,
            required: this.required ?? null,

            timeInputThrottleMs: this.timeInputThrottleMs ?? null,

            disableTimepicker: this.disableTimepicker ?? null,
          },
          null,
          2,
        )}
      </pre>
    );
  }
}

@Component({ tag: 'plumage-timepicker-component', shadow: false })
class PlumageTimepickerStub {
  @Element() host!: HTMLElement;

  @Prop() ariaLabel?: string;
  @Prop() ariaLabelledby?: string;
  @Prop() ariaDescribedby?: string;

  @Prop() showLabel?: boolean;
  @Prop() labelText?: string;

  @Prop() inputId?: string;
  @Prop() inputName?: string;

  @Prop() value?: string;

  @Prop() isTwentyFourHourFormat?: boolean;
  @Prop() size?: string;

  @Prop() validationMessage?: string;
  @Prop() validation?: boolean;
  @Prop() isValid?: boolean;

  @Prop() twentyFourHourOnly?: boolean;
  @Prop() twelveHourOnly?: boolean;
  @Prop() hideTimepickerBtn?: boolean;
  @Prop() hideSeconds?: boolean;
  @Prop() inputWidth?: any;
  @Prop() required?: boolean;

  @Prop() timeInputThrottleMs?: number;

  @Prop() disabled?: boolean;

  @Method()
  async focusInput(options?: { open?: boolean }): Promise<void> {
    this.host.setAttribute('data-focus-called', '1');
    this.host.setAttribute('data-focus-open', options?.open ? '1' : '0');
  }

  @Method()
  async open(): Promise<void> {
    this.host.setAttribute('data-open-called', '1');
  }

  @Method()
  async close(): Promise<void> {
    this.host.setAttribute('data-close-called', '1');
  }

  @Event({ eventName: 'timeChange' }) timeChange!: EventEmitter<TimeChangeDetail>;
  @Event({ eventName: 'timeInput' }) timeInput!: EventEmitter<TimeInputDetail>;

  render() {
    return (
      <pre class="stub-props">
        {JSON.stringify(
          {
            kind: 'plumage',
            ariaLabel: this.ariaLabel ?? null,
            ariaLabelledby: this.ariaLabelledby ?? null,
            ariaDescribedby: this.ariaDescribedby ?? null,

            showLabel: !!this.showLabel,
            labelText: this.labelText ?? null,
            inputId: this.inputId ?? null,
            inputName: this.inputName ?? null,

            value: this.value ?? null,

            isTwentyFourHourFormat: this.isTwentyFourHourFormat ?? null,
            size: this.size ?? null,
            inputWidth: this.inputWidth ?? null,

            validationMessage: this.validationMessage ?? null,
            validation: this.validation ?? null,
            isValid: this.isValid ?? null,

            twentyFourHourOnly: this.twentyFourHourOnly ?? null,
            twelveHourOnly: this.twelveHourOnly ?? null,
            hideTimepickerBtn: this.hideTimepickerBtn ?? null,
            hideSeconds: this.hideSeconds ?? null,
            required: this.required ?? null,

            timeInputThrottleMs: this.timeInputThrottleMs ?? null,

            disabled: this.disabled ?? null,
          },
          null,
          2,
        )}
      </pre>
    );
  }
}

function readStubJSON(root: HTMLElement) {
  const pre = root.querySelector('pre.stub-props');
  if (!pre) return null;
  try {
    return JSON.parse(pre.textContent || '{}');
  } catch {
    return null;
  }
}

function splitIds(v: string | null | undefined): string[] {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

// ✅ TSX-safe (no generic arrow)
function dispatchChild<T>(el: HTMLElement, name: string, detail: T) {
  el.dispatchEvent(new CustomEvent<T>(name, { detail, bubbles: true, composed: true }));
}

describe('timepicker-manager', () => {
  it('renders classic path and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `<timepicker-manager></timepicker-manager>`,
    });

    const child = page.root!.querySelector('timepicker-component') as any;
    expect(child).toBeTruthy();

    const json = readStubJSON(page.root as any);
    expect(json?.kind).toBe('classic');

    expect(page.root).toMatchSnapshot();
  });

  it('renders plumage path and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `<timepicker-manager use-pl-timepicker></timepicker-manager>`,
    });

    const child = page.root!.querySelector('plumage-timepicker-component') as any;
    expect(child).toBeTruthy();

    const json = readStubJSON(page.root as any);
    expect(json?.kind).toBe('plumage');

    expect(page.root).toMatchSnapshot();
  });

  it('forwards props to classic child (check properties, not attributes)', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `
        <timepicker-manager
          show-label
          label-text="Pick a time"
          input-id="my-input"
          input-name="my-time"
          size="sm"
          disable-timepicker
          required
          value="01:02:03"
          time-input-throttle-ms="25"
        ></timepicker-manager>
      `,
    });

    const child = page.root!.querySelector('timepicker-component') as any;
    expect(child).toBeTruthy();

    expect(child.showLabel).toBe(true);
    expect(child.labelText).toBe('Pick a time');
    expect(child.inputId).toBe('my-input');
    expect(child.inputName).toBe('my-time');
    expect(child.size).toBe('sm');

    expect(child.value).toBe('01:02:03');
    expect(child.timeInputThrottleMs).toBe(25);

    expect(child.disableTimepicker).toBe(true);
    expect(page.root!.querySelector('plumage-timepicker-component')).toBeNull();
  });

  it('forwards props to plumage child (check properties, not attributes)', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `
        <timepicker-manager
          use-pl-timepicker
          show-label
          label-text="Pick a time"
          input-id="my-input"
          input-name="my-time"
          size="sm"
          disable-timepicker
          required
          value="01:02:03"
          time-input-throttle-ms="25"
        ></timepicker-manager>
      `,
    });

    const child = page.root!.querySelector('plumage-timepicker-component') as any;
    expect(child).toBeTruthy();

    expect(child.showLabel).toBe(true);
    expect(child.labelText).toBe('Pick a time');
    expect(child.inputId).toBe('my-input');
    expect(child.inputName).toBe('my-time');
    expect(child.size).toBe('sm');

    expect(child.value).toBe('01:02:03');
    expect(child.timeInputThrottleMs).toBe(25);

    expect(child.disabled).toBe(true);
    expect(page.root!.querySelector('timepicker-component')).toBeNull();
  });

  it('a11y precedence: aria-labelledby wins over aria-label; aria-describedby is forwarded', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      template: () => (
        <div>
          <div id="ext-label">External label</div>
          <div id="ext-help">External help</div>

          <timepicker-manager aria-label="Ignored" aria-labelledby="ext-label" aria-describedby="ext-help" />
        </div>
      ),
    });

    const mgr = page.body.querySelector('timepicker-manager') as HTMLElement;
    expect(mgr).toBeTruthy();

    const child = mgr.querySelector('timepicker-component') as any;
    expect(child).toBeTruthy();

    expect(child.ariaLabelledby).toBe('ext-label');
    expect(child.ariaLabel).toBeUndefined();

    expect(child.ariaDescribedby).toBe('ext-help');

    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);
  });

  it('a11y: validationMessage causes manager to merge child validation id into aria-describedby', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `
        <timepicker-manager
          input-id="tp-a"
          validation
          validation-message="Time is required"
          aria-describedby="ext-help"
        ></timepicker-manager>
      `,
    });

    const mgr = page.root as HTMLElement;
    const child = mgr.querySelector('timepicker-component') as any;
    expect(child).toBeTruthy();

    const ids = splitIds(child.ariaDescribedby);
    expect(ids).toContain('ext-help');
    expect(ids).toContain('tp-a-validation');
  });

  it('a11y: when no validationMessage, manager does not append validation id', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `
        <timepicker-manager
          input-id="tp-b"
          validation
          validation-message=""
          aria-describedby="ext-help"
        ></timepicker-manager>
      `,
    });

    const mgr = page.root as HTMLElement;
    const child = mgr.querySelector('timepicker-component') as any;
    expect(child).toBeTruthy();

    const ids = splitIds(child.ariaDescribedby);
    expect(ids).toEqual(['ext-help']);
    expect(ids).not.toContain('tp-b-validation');
  });

  it('re-emits namespaced events (managerTimeChange / managerTimeInput) and mirrors mutable props upward', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `<timepicker-manager input-id="tp-x"></timepicker-manager>`,
    });

    const mgrEl = page.root as HTMLElement;
    const mgrInst = page.rootInstance as TimepickerManagerComponent;
    const childEl = mgrEl.querySelector('timepicker-component') as any as HTMLElement;

    expect(childEl).toBeTruthy();

    const mgrChange = jest.fn();
    const mgrInput = jest.fn();
    const plainChange = jest.fn();

    mgrEl.addEventListener('managerTimeChange', mgrChange as any);
    mgrEl.addEventListener('managerTimeInput', mgrInput as any);
    mgrEl.addEventListener('timeChange', plainChange as any);

    (childEl as any).isTwentyFourHourFormat = false;
    (childEl as any).hideSeconds = true;
    (childEl as any).isValid = false;
    (childEl as any).validationMessage = 'Bad';

    const changeDetail: TimeChangeDetail = {
      value: '12:34 PM',
      parts: { hour: 12, minute: 34, second: 0, ampm: 'PM' },
      isValid: false,
      source: 'commit',
    };

    dispatchChild(childEl, 'timeChange', changeDetail);
    await page.waitForChanges();

    expect(mgrChange).toHaveBeenCalledTimes(1);
    const ev1 = (mgrChange.mock.calls[0][0] as CustomEvent).detail as any;
    expect(ev1.managerInputId).toBe('tp-x');
    expect(ev1.impl).toBe('timepicker-component');
    expect(ev1.value).toBe('12:34 PM');

    expect(mgrInst.isTwentyFourHourFormat).toBe(false);
    expect(mgrInst.hideSeconds).toBe(true);
    expect(mgrInst.isValid).toBe(false);
    expect(mgrInst.validationMessage).toBe('Bad');

    expect(plainChange).toHaveBeenCalled();

    const inputDetail: TimeInputDetail = {
      raw: '12:3',
      normalized: '12:3',
      isValid: false,
      reason: 'pattern',
      caretStart: 4,
      caretEnd: 4,
      inputType: 'insertText',
    };

    dispatchChild(childEl, 'timeInput', inputDetail);
    await page.waitForChanges();

    expect(mgrInput).toHaveBeenCalledTimes(1);
    const ev2 = (mgrInput.mock.calls[0][0] as CustomEvent).detail as any;
    expect(ev2.managerInputId).toBe('tp-x');
    expect(ev2.impl).toBe('timepicker-component');
    expect(ev2.raw).toBe('12:3');
  });

  it('focusInput({open:true}) forwards to child focusInput when available; close() forwards to child close when available', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `<timepicker-manager></timepicker-manager>`,
    });

    const mgr = page.rootInstance as TimepickerManagerComponent;
    const child = (page.root as HTMLElement).querySelector('timepicker-component') as HTMLElement;

    expect(child).toBeTruthy();

    await mgr.focusInput({ open: true });
    await page.waitForChanges();

    expect(child.getAttribute('data-focus-called')).toBe('1');
    expect(child.getAttribute('data-focus-open')).toBe('1');

    await mgr.close();
    await page.waitForChanges();

    expect(child.getAttribute('data-close-called')).toBe('1');
  });
});
