import { newSpecPage } from '@stencil/core/testing';
import { PlumageTimepickerComponent } from './plumage-timepicker-component';

// helper: split aria-describedby tokens
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

    // Visible label when show-label is present
    expect(label.classList.contains('sr-only')).toBe(false);
    expect(label.textContent).toContain('Pick a time');

    // ✅ updated plumage behavior (match timepicker-component):
    // label id derived from inputId
    expect(label.id).toBe('my-time-label');
    expect(input.id).toBe('my-time');
    expect(input.getAttribute('aria-labelledby')).toBe('my-time-label');

    // ✅ dropdown id derived from inputId and aria-controls points to it
    expect(dropdown.getAttribute('id')).toBe('my-time-dropdown');
    expect(input.getAttribute('aria-controls')).toBe('my-time-dropdown');
    expect(iconBtn.getAttribute('aria-controls')).toBe('my-time-dropdown');

    // Popup semantics
    expect(iconBtn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(iconBtn.getAttribute('aria-expanded')).toBe('false');

    expect(input.getAttribute('aria-haspopup')).toBe('dialog');
    expect(input.getAttribute('aria-expanded')).toBe('false');

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

    // Hidden visually, available to AT
    expect(label.classList.contains('sr-only')).toBe(true);
    expect(label.textContent).toContain('Hidden label test');

    // ✅ updated behavior:
    // no auto aria-labelledby when showLabel is omitted
    expect(input.id).toBe('a1');
    expect(input.getAttribute('aria-labelledby')).toBeNull();
    expect(input.getAttribute('aria-label')).toBe('Time Picker');

    expect(root).toMatchSnapshot();
  });

  it('a11y overrides: uses consumer aria-labelledby when provided (even if showLabel omitted), and merges aria-describedby with validation/warning ids', async () => {
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

    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);

    // consumer aria-labelledby wins
    expect(input.getAttribute('aria-labelledby')).toBe('ext-label');

    // and aria-label should be omitted when aria-labelledby is present
    expect(input.getAttribute('aria-label')).toBeNull();

    const described = splitIds(input.getAttribute('aria-describedby'));
    expect(described).toContain('ext-help');

    // not shown by default => not included
    expect(described).not.toContain('tp3-validation');
    expect(described).not.toContain('tp3-warning');
  });

  it('required + invalid: sets aria-required + required, sets aria-invalid only when invalid, and wires validation message id', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp4" required validation validation-message="Bad time" is-valid="false"></plumage-timepicker-component>`,
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
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component input-id="tp5" disabled></plumage-timepicker-component>`,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    const clearBtn = root.querySelector('button.clear-button') as HTMLElement | null;
    const iconBtn = root.querySelector('button.time-icon-btn') as HTMLElement | null;
    const dropdown = root.querySelector('.time-dropdown') as HTMLElement | null;

    expect(input).toBeTruthy();
    expect(clearBtn).toBeTruthy();
    expect(dropdown).toBeTruthy();

    // input disabled
    expect(input.disabled).toBe(true);

    // buttons: assert disabled via attribute (Stencil mock DOM reliability)
    expect(clearBtn!.hasAttribute('disabled')).toBe(true);
    if (iconBtn) expect(iconBtn.hasAttribute('disabled')).toBe(true);

    // dropdown hidden + inert when disabled
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

    expect(hour).toBeTruthy();
    expect(minute).toBeTruthy();

    expect(hour.getAttribute('role')).toBe('spinbutton');
    expect(minute.getAttribute('role')).toBe('spinbutton');

    // closed => roving tabindex should be -1 for all parts
    expect(hour.getAttribute('tabindex')).toBe('-1');
    expect(minute.getAttribute('tabindex')).toBe('-1');
  });
});
