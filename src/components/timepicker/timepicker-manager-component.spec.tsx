// src/components/timepicker/timepicker-manager-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { Component, Prop, h } from '@stencil/core';
import { TimepickerManagerComponent } from './timepicker-manager-component';

/**
 * NOTE:
 * Use lightweight stubs instead of importing real child components.
 * Focus tests on manager forwarding + a11y precedence/merging behavior.
 */

@Component({ tag: 'timepicker-component', shadow: false })
class TimepickerStub {
  // a11y props the manager forwards (aligned to updated manager)
  @Prop() ariaLabel?: string;
  @Prop() ariaLabelledby?: string;
  @Prop() ariaDescribedby?: string;

  // forwarded UI/behavior props
  @Prop() showLabel?: boolean;
  @Prop() labelText?: string;
  @Prop() inputId?: string;
  @Prop() inputName?: string;
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

  // Standard child uses disableTimepicker
  @Prop() disableTimepicker?: boolean;

  render() {
    return (
      <pre class="stub-props">
        {JSON.stringify(
          {
            kind: 'classic',

            // a11y
            ariaLabel: this.ariaLabel ?? null,
            ariaLabelledby: this.ariaLabelledby ?? null,
            ariaDescribedby: this.ariaDescribedby ?? null,

            // identity
            showLabel: !!this.showLabel,
            labelText: this.labelText ?? null,
            inputId: this.inputId ?? null,
            inputName: this.inputName ?? null,

            // behavior/layout
            isTwentyFourHourFormat: this.isTwentyFourHourFormat ?? null,
            size: this.size ?? null,
            inputWidth: this.inputWidth ?? null,

            // validation/state
            validationMessage: this.validationMessage ?? null,
            validation: this.validation ?? null,
            isValid: this.isValid ?? null,

            // toggles
            twentyFourHourOnly: this.twentyFourHourOnly ?? null,
            twelveHourOnly: this.twelveHourOnly ?? null,
            hideTimepickerBtn: this.hideTimepickerBtn ?? null,
            hideSeconds: this.hideSeconds ?? null,
            required: this.required ?? null,

            // disabled (classic)
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
  @Prop() ariaLabel?: string;
  @Prop() ariaLabelledby?: string;
  @Prop() ariaDescribedby?: string;

  @Prop() showLabel?: boolean;
  @Prop() labelText?: string;

  @Prop() inputId?: string;
  @Prop() inputName?: string;

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

  // Plumage child uses disabled
  @Prop() disabled?: boolean;

  render() {
    return (
      <pre class="stub-props">
        {JSON.stringify(
          {
            kind: 'plumage',

            // a11y
            ariaLabel: this.ariaLabel ?? null,
            ariaLabelledby: this.ariaLabelledby ?? null,
            ariaDescribedby: this.ariaDescribedby ?? null,

            // identity
            showLabel: !!this.showLabel,
            labelText: this.labelText ?? null,
            inputId: this.inputId ?? null,
            inputName: this.inputName ?? null,

            // behavior/layout
            isTwentyFourHourFormat: this.isTwentyFourHourFormat ?? null,
            size: this.size ?? null,
            inputWidth: this.inputWidth ?? null,

            // validation/state
            validationMessage: this.validationMessage ?? null,
            validation: this.validation ?? null,
            isValid: this.isValid ?? null,

            // toggles
            twentyFourHourOnly: this.twentyFourHourOnly ?? null,
            twelveHourOnly: this.twelveHourOnly ?? null,
            hideTimepickerBtn: this.hideTimepickerBtn ?? null,
            hideSeconds: this.hideSeconds ?? null,
            required: this.required ?? null,

            // disabled (plumage)
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

    // classic disabled wiring
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

    // plumage disabled wiring
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

    // precedence: aria-labelledby wins, ariaLabel should be undefined on child
    expect(child.ariaLabelledby).toBe('ext-label');
    expect(child.ariaLabel).toBeUndefined();

    // describedby forwarded
    expect(child.ariaDescribedby).toBe('ext-help');

    // ids exist in DOM
    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);
  });

  it('a11y: validationMessage causes manager to merge child validation id into aria-describedby (no ariaInvalid/validationMessageId forwarded)', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimepickerStub, PlumageTimepickerStub],
      html: `
        <timepicker-manager
          input-id="tp-a"
          validation
          is-valid="false"
          validation-message="Time is required"
          aria-describedby="ext-help"
        ></timepicker-manager>
      `,
    });

    const mgr = page.root as HTMLElement;
    const child = mgr.querySelector('timepicker-component') as any;
    expect(child).toBeTruthy();

    // updated manager does NOT forward ariaInvalid or validationMessageId
    expect((child as any).ariaInvalid).toBeUndefined();
    expect((child as any).validationMessageId).toBeUndefined();

    // describedby merges external + `${inputId}-validation` when validationMessage exists
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
          is-valid="false"
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
});
