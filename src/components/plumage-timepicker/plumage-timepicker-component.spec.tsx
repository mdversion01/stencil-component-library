// src/components/timepicker/plumage-timepicker-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { PlumageTimepickerComponent } from './plumage-timepicker-component';

const splitIds = (v: string | null) =>
  String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

describe('plumage-timepicker-component', () => {
  it('shows the label when "show-label" is present and wires label/id a11y (auto label id + dropdown id)', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component show-label label-text="Pick a time" input-id="my-time"></plumage-timepicker-component>`,
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

    expect(root).toMatchSnapshot();
  });

  it('hides the label (sr-only) when "show-label" is omitted, and uses aria-label (no aria-labelledby)', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component label-text="Hidden label test" input-id="a1"></plumage-timepicker-component>`,
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

    expect(root).toMatchSnapshot();
  });

  it('a11y overrides: uses consumer aria-labelledby when provided, and keeps aria-describedby external-only when no validation/warning shown', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `
        <div>
          <div id="ext-label">External Label</div>
          <div id="ext-help">External Help</div>
          <plumage-timepicker-component
            input-id="tp3"
            label-text="Ignored visually"
            aria-labelledby="ext-label"
            aria-describedby="ext-help"
          ></plumage-timepicker-component>
        </div>
      `,
    });

    await page.waitForChanges();

    const host = page.body.querySelector('plumage-timepicker-component') as HTMLElement;
    const input = host.querySelector('input.time-input') as HTMLInputElement;

    expect(page.body.querySelector('#ext-label')).toBeTruthy();
    expect(page.body.querySelector('#ext-help')).toBeTruthy();

    expect(input.getAttribute('aria-labelledby')).toBe('ext-label');
    expect(input.getAttribute('aria-label')).toBeNull();

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('ext-help');
    expect(described).not.toContain('tp3-time-validation');
    expect(described).not.toContain('tp3-validation');
    expect(described).not.toContain('tp3-warning');
  });

  it('required + invalid user validation: sets aria-required + required, sets aria-invalid only when invalid, and wires user validation message id', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp4" required validation validation-message="Bad time"></plumage-timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const msg = root.querySelector('#tp4-validation') as HTMLElement;

    expect(input).toBeTruthy();
    expect(msg).toBeTruthy();

    expect(input.hasAttribute('required')).toBe(true);
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('tp4-validation');

    expect(msg.getAttribute('role')).toBe('alert');
    expect(msg.textContent).toContain('Bad time');
    expect(msg.classList.contains('hidden')).toBe(false);

    expect(root).toMatchSnapshot();
  });

  it('disabled: disables input/buttons and dropdown stays hidden/inert', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp5" disabled></plumage-timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const clearBtn = root.querySelector('button.clear-button') as HTMLButtonElement | null;
    const iconBtn = root.querySelector('button.time-icon-btn') as HTMLButtonElement | null;
    const dropdown = root.querySelector('.time-dropdown') as HTMLElement | null;
    const toggleFormatBtn = root.querySelector('button.toggle-format-btn') as HTMLButtonElement | null;

    expect(input).toBeTruthy();
    expect(clearBtn).toBeTruthy();
    expect(dropdown).toBeTruthy();
    expect(toggleFormatBtn).toBeTruthy();

    expect(input.disabled).toBe(true);
    expect(clearBtn!.hasAttribute('disabled')).toBe(true);
    expect(iconBtn!.hasAttribute('disabled')).toBe(true);
    expect(toggleFormatBtn!.hasAttribute('disabled')).toBe(true);

    expect(dropdown!.classList.contains('hidden')).toBe(true);
    expect(dropdown!.hasAttribute('inert')).toBe(true);

    expect(root).toMatchSnapshot();
  });

  it('popover parts use spinbutton semantics + roving tabindex defaults (closed)', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp6"></plumage-timepicker-component>`,
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

    expect(hour.getAttribute('tabindex')).toBe('-1');
    expect(minute.getAttribute('tabindex')).toBe('-1');
    expect(second.getAttribute('tabindex')).toBe('-1');
  });

  it('readOnly: makes input readonly and hides clear, icon, and format toggle controls', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp-readonly" read-only show-label label-text="Read only time"></plumage-timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const clearBtn = root.querySelector('button.clear-button');
    const iconBtn = root.querySelector('button.time-icon-btn');
    const toggleFormatBtn = root.querySelector('button.toggle-format-btn');
    const label = root.querySelector('label') as HTMLLabelElement;
    const dropdown = root.querySelector('.time-dropdown') as HTMLElement;
    const closeBtn = root.querySelector('button.close-button') as HTMLButtonElement;

    expect(input).toBeTruthy();
    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(input.classList.contains('read-only')).toBe(true);

    expect(clearBtn).toBeNull();
    expect(iconBtn).toBeNull();
    expect(toggleFormatBtn).toBeNull();

    expect(label).toBeTruthy();
    expect(label.classList.contains('is-invalid')).toBe(false);

    expect(dropdown).toBeTruthy();
    expect(dropdown.classList.contains('hidden')).toBe(true);
    expect(dropdown.hasAttribute('inert')).toBe(true);
    expect(closeBtn).toBeTruthy();
    expect(closeBtn.hasAttribute('disabled')).toBe(false);
  });

  it('clears the user validation-message as soon as the user enters a valid time', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp7" validation validation-message="Please enter a valid time."></plumage-timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;
    const userValidation = root.querySelector('#tp7-validation') as HTMLElement;
    const clearBtn = root.querySelector('button.clear-button') as HTMLButtonElement;
    const iconBtn = root.querySelector('button.time-icon-btn') as HTMLButtonElement | null;

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(userValidation.classList.contains('hidden')).toBe(false);
    expect(userValidation.textContent).toContain('Please enter a valid time.');
    expect(clearBtn.classList.contains('invalid')).toBe(true);
    if (iconBtn) expect(iconBtn.classList.contains('invalid')).toBe(true);

    input.value = '13:05:09';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(input.getAttribute('aria-invalid')).toBeNull();

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).not.toContain('tp7-validation');

    expect(userValidation.classList.contains('hidden')).toBe(true);
    expect(clearBtn.classList.contains('invalid')).toBe(false);
    if (iconBtn) expect(iconBtn.classList.contains('invalid')).toBe(false);
  });

  it('resets user validation so the validation-message shows again when clear is clicked', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp8" validation validation-message="Please enter a valid time."></plumage-timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    let input = root.querySelector('input.time-input') as HTMLInputElement;
    const clearBtn = root.querySelector('button.clear-button') as HTMLButtonElement;
    const userValidation = root.querySelector('#tp8-validation') as HTMLElement;
    const iconBtn = root.querySelector('button.time-icon-btn') as HTMLButtonElement | null;

    input.value = '13:05:09';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(userValidation.classList.contains('hidden')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(clearBtn.classList.contains('invalid')).toBe(false);
    if (iconBtn) expect(iconBtn.classList.contains('invalid')).toBe(false);

    clearBtn.click();
    await page.waitForChanges();

    input = root.querySelector('input.time-input') as HTMLInputElement;

    expect(userValidation.classList.contains('hidden')).toBe(false);
    expect(userValidation.textContent).toContain('Please enter a valid time.');
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('tp8-validation');
    expect(clearBtn.classList.contains('invalid')).toBe(true);
    if (iconBtn) expect(iconBtn.classList.contains('invalid')).toBe(true);
  });

  it('keeps time-validation separate from user validation and wires its own id when shown', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp9"></plumage-timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    input.value = '99';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    const timeValidation = root.querySelector('#tp9-time-validation') as HTMLElement;
    const userValidation = root.querySelector('#tp9-validation') as HTMLElement;

    expect(timeValidation).toBeTruthy();
    expect(userValidation).toBeTruthy();

    expect(timeValidation.classList.contains('hidden')).toBe(false);
    expect((timeValidation.textContent || '').trim().length).toBeGreaterThan(0);

    expect(userValidation.classList.contains('hidden')).toBe(true);

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('tp9-time-validation');
    expect(described).not.toContain('tp9-validation');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
