// src/components/timepicker/timepicker-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { TimePickerComponent as TimepickerComponent } from './timepicker-component';

const splitIds = (v: string | null) =>
  String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

describe('timepicker-component', () => {
  it('shows the label when "show-label" is present and wires label/id a11y (auto label id + dropdown id)', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component show-label label-text="Pick a time" input-id="my-time"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const dropdown = root.querySelector('.time-dropdown') as HTMLElement;
    const iconBtn = root.querySelector('button.time-icon-btn') as HTMLButtonElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();
    expect(dropdown).toBeTruthy();
    expect(iconBtn).toBeTruthy();

    expect(label.classList.contains('sr-only')).toBe(false);
    expect(label.textContent).toContain('Pick a time');

    expect(label.id).toBe('my-time-label');
    expect(input.id).toBe('my-time');
    expect(input.getAttribute('aria-labelledby')).toBe('my-time-label');

    expect(dropdown.getAttribute('id')).toBe('my-time-dropdown');
    expect(input.getAttribute('aria-controls')).toBe('my-time-dropdown');
    expect(iconBtn.getAttribute('aria-controls')).toBe('my-time-dropdown');

    expect(iconBtn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(iconBtn.getAttribute('aria-expanded')).toBe('false');

    expect(input.getAttribute('aria-haspopup')).toBe('dialog');
    expect(input.getAttribute('aria-expanded')).toBe('false');

    expect(dropdown.classList.contains('hidden')).toBe(true);
    expect(dropdown.hasAttribute('inert')).toBe(true);
  });

  it('hides the label (sr-only) when "show-label" is omitted, and uses aria-label (no aria-labelledby)', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component label-text="Hidden label test" input-id="a1"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    expect(label.classList.contains('sr-only')).toBe(true);
    expect(label.textContent).toContain('Hidden label test');

    expect(input.id).toBe('a1');
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    expect(input.getAttribute('aria-label')).toBe('Time Picker');
  });

  it('a11y overrides: uses consumer aria-labelledby when provided, and keeps aria-describedby external-only when no validation/warning shown', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `
        <div>
          <div id="ext-label">External Label</div>
          <div id="ext-help">External Help</div>
          <timepicker-component
            input-id="tp3"
            label-text="Ignored visually"
            aria-labelledby="ext-label"
            aria-describedby="ext-help"
          ></timepicker-component>
        </div>
      `,
    });

    await page.waitForChanges();

    const host = page.body.querySelector('timepicker-component') as HTMLElement;
    const input = host.querySelector('input.time-input') as HTMLInputElement;

    expect(page.body.querySelector('#ext-label')).toBeTruthy();
    expect(page.body.querySelector('#ext-help')).toBeTruthy();

    expect(input.getAttribute('aria-labelledby')).toBe('ext-label');
    expect(input.getAttribute('aria-label')).toBeNull();

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('ext-help');
    expect(described).not.toContain('tp3-validation');
    expect(described).not.toContain('tp3-time-validation');
    expect(described).not.toContain('tp3-warning');
  });

  it('user validation wires the user validation message id and not the built-in time validation id when user validation is enabled', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp4" required validation validation-message="Bad time"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const userMsg = root.querySelector('#tp4-validation') as HTMLElement | null;
    const timeMsg = root.querySelector('#tp4-time-validation') as HTMLElement | null;

    expect(input).toBeTruthy();
    expect(userMsg).toBeTruthy();
    expect(timeMsg).toBeTruthy();

    expect(input.hasAttribute('required')).toBe(true);
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('tp4-validation');
    expect(described).not.toContain('tp4-time-validation');

    expect(userMsg!.getAttribute('role')).toBe('alert');
    expect(userMsg!.textContent).toContain('Bad time');
    expect(userMsg!.classList.contains('hidden')).toBe(false);
    expect(timeMsg!.classList.contains('hidden')).toBe(true);
  });

  it('built-in time validation uses the time-validation id/message for malformed non-transient time input', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp-time-validation"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    input.value = 'ab';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    const timeMsg = root.querySelector('#tp-time-validation-time-validation') as HTMLElement | null;
    const userMsg = root.querySelector('#tp-time-validation-validation') as HTMLElement | null;

    expect(input.getAttribute('aria-invalid')).toBe('true');

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('tp-time-validation-time-validation');
    expect(described).not.toContain('tp-time-validation-validation');

    expect(timeMsg).toBeTruthy();
    expect(timeMsg!.getAttribute('role')).toBe('alert');
    expect(timeMsg!.classList.contains('hidden')).toBe(false);
    expect((timeMsg!.textContent || '').trim().length).toBeGreaterThan(0);

    expect(userMsg).toBeTruthy();
    expect(userMsg!.classList.contains('hidden')).toBe(true);
  });

  it('transient partial input does not trigger built-in validation', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp-transient"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    input.value = '99';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    const timeMsg = root.querySelector('#tp-transient-time-validation') as HTMLElement | null;
    const warningMsg = root.querySelector('#tp-transient-warning') as HTMLElement | null;

    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(timeMsg).toBeTruthy();
    expect(timeMsg!.classList.contains('hidden')).toBe(true);
    if (warningMsg) expect(warningMsg.classList.contains('hidden')).toBe(true);
  });

  it('disabled: disables input/buttons and dropdown stays hidden/inert', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp5" disable-timepicker></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const clearBtn = root.querySelector('button.clear-button') as HTMLButtonElement | null;
    const iconBtn = root.querySelector('button.time-icon-btn') as HTMLButtonElement | null;
    const dropdown = root.querySelector('.time-dropdown') as HTMLElement | null;

    expect(input).toBeTruthy();
    expect(clearBtn).toBeTruthy();
    expect(dropdown).toBeTruthy();

    expect(input.disabled).toBe(true);
    expect(clearBtn!.hasAttribute('disabled')).toBe(true);
    if (iconBtn) expect(iconBtn.hasAttribute('disabled')).toBe(true);

    expect(dropdown!.classList.contains('hidden')).toBe(true);
    expect(dropdown!.hasAttribute('inert')).toBe(true);
  });

  it('readOnly: makes input readonly and hides clear and icon controls', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp-readonly" read-only show-label label-text="Read only time"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const clearBtn = root.querySelector('button.clear-button');
    const iconBtn = root.querySelector('button.time-icon-btn');
    const label = root.querySelector('label') as HTMLLabelElement;
    const dropdown = root.querySelector('.time-dropdown') as HTMLElement;

    expect(input).toBeTruthy();
    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(input.classList.contains('read-only')).toBe(true);

    expect(clearBtn).toBeNull();
    expect(iconBtn).toBeNull();

    expect(label).toBeTruthy();
    expect(label.classList.contains('is-invalid')).toBe(false);

    expect(dropdown).toBeTruthy();
    expect(dropdown.classList.contains('hidden')).toBe(true);
    expect(dropdown.hasAttribute('inert')).toBe(true);
  });

  it('spinbutton semantics: hour/minute/second render role=spinbutton with aria-valuemin/max/now and roving tabindex defaults to -1 when closed', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp6"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const hour = root.querySelector('.hour-display') as HTMLElement;
    const minute = root.querySelector('.minute-display') as HTMLElement;
    const second = root.querySelector('.second-display') as HTMLElement;

    expect(hour).toBeTruthy();
    expect(minute).toBeTruthy();
    expect(second).toBeTruthy();

    expect(hour.getAttribute('role')).toBe('spinbutton');
    expect(minute.getAttribute('role')).toBe('spinbutton');
    expect(second.getAttribute('role')).toBe('spinbutton');

    expect(hour.getAttribute('aria-valuemin')).toBe('0');
    expect(hour.getAttribute('aria-valuemax')).toBe('23');

    expect(minute.getAttribute('aria-valuemin')).toBe('0');
    expect(minute.getAttribute('aria-valuemax')).toBe('59');

    expect(second.getAttribute('aria-valuemin')).toBe('0');
    expect(second.getAttribute('aria-valuemax')).toBe('59');

    expect(hour.getAttribute('tabindex')).toBe('-1');
    expect(minute.getAttribute('tabindex')).toBe('-1');
    expect(second.getAttribute('tabindex')).toBe('-1');
  });

  it('clear button removes built-in time validation, restores user validation, and keeps field invalid state while buttons are not marked invalid', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp-clear" validation validation-message="Please enter a time"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const clearBtn = root.querySelector('button.clear-button') as HTMLButtonElement;
    const iconBtn = root.querySelector('button.time-icon-btn') as HTMLButtonElement | null;
    const label = root.querySelector('label') as HTMLLabelElement;

    input.value = 'ab';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    let userMsg = root.querySelector('#tp-clear-validation') as HTMLElement | null;
    let timeMsg = root.querySelector('#tp-clear-time-validation') as HTMLElement | null;

    expect(timeMsg).toBeTruthy();
    expect(timeMsg!.classList.contains('hidden')).toBe(false);
    expect(userMsg).toBeTruthy();
    expect(userMsg!.classList.contains('hidden')).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    clearBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await page.waitForChanges();

    userMsg = root.querySelector('#tp-clear-validation') as HTMLElement | null;
    timeMsg = root.querySelector('#tp-clear-time-validation') as HTMLElement | null;

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('tp-clear-validation');
    expect(described).not.toContain('tp-clear-time-validation');

    expect(timeMsg).toBeTruthy();
    expect(timeMsg!.classList.contains('hidden')).toBe(true);
    expect(userMsg).toBeTruthy();
    expect(userMsg!.classList.contains('hidden')).toBe(false);

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(label.classList.contains('is-invalid')).toBe(true);
    expect(clearBtn.classList.contains('invalid')).toBe(false);
    if (iconBtn) expect(iconBtn.classList.contains('invalid')).toBe(false);
  });

  it('typing a valid time clears user validation, removes describedby id, and removes invalid class from clear/icon buttons', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp-valid" validation validation-message="Please enter a time"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const clearBtn = root.querySelector('button.clear-button') as HTMLButtonElement;
    const iconBtn = root.querySelector('button.time-icon-btn') as HTMLButtonElement | null;
    const userMsg = root.querySelector('#tp-valid-validation') as HTMLElement | null;
    const timeMsg = root.querySelector('#tp-valid-time-validation') as HTMLElement | null;

    expect(userMsg).toBeTruthy();
    expect(userMsg!.classList.contains('hidden')).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(clearBtn.classList.contains('invalid')).toBe(true);
    if (iconBtn) expect(iconBtn.classList.contains('invalid')).toBe(true);

    input.value = '13:05:09';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).not.toContain('tp-valid-validation');

    expect(root.querySelector('#tp-valid-validation')).toBeTruthy();
    expect((root.querySelector('#tp-valid-validation') as HTMLElement).classList.contains('hidden')).toBe(true);
    expect(timeMsg).toBeTruthy();
    expect((root.querySelector('#tp-valid-time-validation') as HTMLElement).classList.contains('hidden')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(clearBtn.classList.contains('invalid')).toBe(false);
    if (iconBtn) expect(iconBtn.classList.contains('invalid')).toBe(false);
  });
});
