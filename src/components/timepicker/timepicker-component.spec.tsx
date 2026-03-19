// src/components/timepicker/timepicker-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { TimePickerComponent as TimepickerComponent } from './timepicker-component';

// helper: split aria-describedby tokens
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

    // Visible label when show-label is present
    expect(label.classList.contains('sr-only')).toBe(false);
    expect(label.textContent).toContain('Pick a time');

    // label id derived from inputId and aria-labelledby points to it when showLabel=true
    expect(label.id).toBe('my-time-label');
    expect(input.id).toBe('my-time');
    expect(input.getAttribute('aria-labelledby')).toBe('my-time-label');

    // dropdown id derived from inputId and input/icon button aria-controls points to it
    expect(dropdown.getAttribute('id')).toBe('my-time-dropdown');
    expect(input.getAttribute('aria-controls')).toBe('my-time-dropdown');
    expect(iconBtn.getAttribute('aria-controls')).toBe('my-time-dropdown');

    // Trigger should expose popover semantics
    expect(iconBtn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(iconBtn.getAttribute('aria-expanded')).toBe('false');

    // Input also has popover semantics
    expect(input.getAttribute('aria-haspopup')).toBe('dialog');
    expect(input.getAttribute('aria-expanded')).toBe('false');

    expect(root).toMatchSnapshot();
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

    // Hidden for sighted users but present for screen readers
    expect(label.classList.contains('sr-only')).toBe(true);
    expect(label.textContent).toContain('Hidden label test');

    // When showLabel is not set, we do NOT auto-wire aria-labelledby; we fall back to aria-label.
    expect(input.id).toBe('a1');
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    expect(input.getAttribute('aria-label')).toBe('Time Picker');

    expect(root).toMatchSnapshot();
  });

  it('a11y overrides: uses consumer aria-labelledby when provided (even if showLabel omitted), and keeps aria-describedby external-only when no validation/warning shown', async () => {
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

    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);

    // consumer aria-labelledby wins
    expect(input.getAttribute('aria-labelledby')).toBe('ext-label');

    // and aria-label should be omitted when aria-labelledby is present
    expect(input.getAttribute('aria-label')).toBeNull();

    // describedby includes ext-help, and should NOT include validation/warning ids when not shown
    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('ext-help');
    expect(described).not.toContain('tp3-validation');
    expect(described).not.toContain('tp3-warning');
  });

  it('required + invalid: sets aria-required + required, sets aria-invalid only when invalid, and wires validation message id', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp4" required validation validation-message="Bad time" is-valid="false"></timepicker-component>`,
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

    expect(root).toMatchSnapshot();
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

    // input: property is fine in Stencil mock DOM
    expect(input.disabled).toBe(true);

    // buttons: assert disabled via attribute (more reliable in Stencil mock DOM)
    expect(clearBtn!.hasAttribute('disabled')).toBe(true);
    if (iconBtn) expect(iconBtn.hasAttribute('disabled')).toBe(true);

    // dropdown remains hidden and inert
    expect(dropdown!.classList.contains('hidden')).toBe(true);
    expect(dropdown!.hasAttribute('inert')).toBe(true);

    expect(root).toMatchSnapshot();
  });

  it('spinbutton semantics: hour/minute(/second) render role=spinbutton with aria-valuemin/max/now and roving tabindex defaults to -1 when closed', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component input-id="tp6"></timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const hour = root.querySelector('.hour-display') as HTMLElement;
    const minute = root.querySelector('.minute-display') as HTMLElement;

    expect(hour).toBeTruthy();
    expect(minute).toBeTruthy();

    expect(hour.getAttribute('role')).toBe('spinbutton');
    expect(minute.getAttribute('role')).toBe('spinbutton');

    // 24h default -> hour 0..23, minute 0..59
    expect(hour.getAttribute('aria-valuemin')).toBe('0');
    expect(hour.getAttribute('aria-valuemax')).toBe('23');

    expect(minute.getAttribute('aria-valuemin')).toBe('0');
    expect(minute.getAttribute('aria-valuemax')).toBe('59');

    // closed => roving tabindex should be -1 (component sets 0 only when popover open)
    expect(hour.getAttribute('tabindex')).toBe('-1');
    expect(minute.getAttribute('tabindex')).toBe('-1');
  });
});
