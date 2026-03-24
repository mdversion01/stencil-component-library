// src/components/toggle-switch/toggle-switch-component.spec.tsx

import { newSpecPage } from '@stencil/core/testing';
import { ToggleSwitchComponent } from './toggle-switch-component';

const createWithSwitchesArray = async (switchesArray: any[], extraHtml = '') => {
  const page = await newSpecPage({
    components: [ToggleSwitchComponent],
    html: `<toggle-switch-component switches="true" ${extraHtml}></toggle-switch-component>`,
  });

  // Use the component's watcher entrypoint (keeps intent explicit)
  (page.rootInstance as any).syncSwitchesArray(switchesArray);
  await page.waitForChanges();
  return page;
};

describe('toggle-switch-component', () => {
  it('renders a single toggle with toggleTxt and newToggleTxt attribute JSON (attribute wins)', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component
              input-id="txt-toggle"
              label-txt="Power"
              toggle-txt="true"
              checked="true"
              new-toggle-txt='{ "on": "Enabled", "off": "Disabled" }'>
            </toggle-switch-component>`,
    });

    await page.waitForChanges();

    // Snapshot covers the rendered "Enabled" toggle text when checked=true.
    expect(page.root).toMatchSnapshot();
  });

  it('renders multiple switches from switchesArray', async () => {
    const page = await createWithSwitchesArray([
      { id: 'one', label: 'First', checked: false },
      { id: 'two', label: 'Second', checked: true },
    ]);

    expect(page.root!.querySelectorAll('input[type="checkbox"]').length).toBe(2);
    expect(page.root).toMatchSnapshot();
  });

  it('emits checkedChanged on single toggle', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component input-id="single-toggle" label-txt="Toggle Me"></toggle-switch-component>`,
    });

    await page.waitForChanges();

    const spy = jest.fn();
    page.win.addEventListener('checkedChanged', spy);

    const input = page.root!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { id: 'single-toggle', checked: true },
      }),
    );
  });

  it('applies correct aria-* attributes on single toggle input', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component input-id="aria-toggle" checked="false" disabled="true"></toggle-switch-component>`,
    });

    await page.waitForChanges();

    const input = page.root!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input).toBeTruthy();

    // role="switch" + aria-checked/aria-disabled as strings
    expect(input.getAttribute('role')).toBe('switch');
    expect(input.getAttribute('aria-checked')).toBe('false');
    expect(input.getAttribute('aria-disabled')).toBe('true');

    // Native disabled should also be applied
    expect(input.disabled).toBe(true);
  });

  it('shows validation error when required + validation and unchecked (single)', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component
              input-id="val-toggle"
              required="true"
              validation="true"
              label-txt="Terms"
              validation-message="Required field.">
            </toggle-switch-component>`,
    });

    await page.waitForChanges();

    const error = page.root!.querySelector('.invalid-feedback') as HTMLElement | null;
    expect(error).toBeTruthy();
    expect(error!.textContent!.trim()).toBe('Required field.');
  });

  it('sets keyboardFocused true on Tab press (document listener)', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component input-id="tab-toggle"></toggle-switch-component>`,
    });

    await page.waitForChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    await page.waitForChanges();

    expect((page.rootInstance as any).keyboardFocused).toBe(true);
  });

  it('toggles switchesArray item and emits event', async () => {
    const page = await createWithSwitchesArray([
      { id: 'item1', label: 'Wi-Fi', checked: false },
      { id: 'item2', label: 'Bluetooth', checked: true },
    ]);

    const spy = jest.fn();
    page.win.addEventListener('checkedChanged', spy);

    const inputs = page.root!.querySelectorAll('input[type="checkbox"]');
    (inputs[0] as HTMLInputElement).dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { id: 'item1', checked: true },
      }),
    );
  });

  it('renders inline + size class combinations (default BS5 switch)', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component
              input-id="styled-toggle"
              label-txt="Wi-Fi"
              size="lg"
              inline="true">
            </toggle-switch-component>`,
    });

    await page.waitForChanges();

    // Default = Bootstrap 5 switch
    const wrapper = page.root!.querySelector('.form-check.form-switch') as HTMLElement;
    expect(wrapper).toBeTruthy();

    // Inline uses BS5 class
    expect(wrapper.classList.contains('form-check-inline')).toBe(true);

    // Default path uses ts-size-* mapping for size (not the old custom-control-lg)
    expect(wrapper.classList.contains('ts-size-lg')).toBe(true);
    expect(wrapper.classList.contains('custom-control-lg')).toBe(false);
  });

  it('renders inline and size class combinations when customSwitch is true', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component
              custom-switch="true"
              input-id="styled-toggle"
              label-txt="Wi-Fi"
              size="lg"
              inline="true">
            </toggle-switch-component>`,
    });

    await page.waitForChanges();

    // Custom = your legacy/custom classes
    const wrapper = page.root!.querySelector('.custom-control.custom-switch') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.classList.contains('custom-control-lg')).toBe(true);
    expect(wrapper.classList.contains('custom-control-inline')).toBe(true);
  });

  it('emits events for multiple switches toggled in quick succession', async () => {
    const page = await createWithSwitchesArray([
      { id: 'wifi', label: 'Wi-Fi', checked: false },
      { id: 'bt', label: 'Bluetooth', checked: false },
      { id: 'gps', label: 'GPS', checked: false },
    ]);

    const spy = jest.fn();
    page.win.addEventListener('checkedChanged', spy);

    const inputs = page.root!.querySelectorAll('input[type="checkbox"]');
    inputs.forEach((input) => input.dispatchEvent(new Event('change')));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, expect.objectContaining({ detail: { id: 'wifi', checked: true } }));
    expect(spy).toHaveBeenNthCalledWith(2, expect.objectContaining({ detail: { id: 'bt', checked: true } }));
    expect(spy).toHaveBeenNthCalledWith(3, expect.objectContaining({ detail: { id: 'gps', checked: true } }));
  });

  it('toggles each switchesArray item twice and verifies emitted states', async () => {
    const page = await createWithSwitchesArray([
      { id: 'wifi', label: 'Wi-Fi', checked: false },
      { id: 'bt', label: 'Bluetooth', checked: true },
    ]);

    const spy = jest.fn();
    page.win.addEventListener('checkedChanged', spy);

    const inputs = page.root!.querySelectorAll('input[type="checkbox"]');

    inputs[0].dispatchEvent(new Event('change'));
    inputs[1].dispatchEvent(new Event('change'));
    await page.waitForChanges();

    inputs[0].dispatchEvent(new Event('change'));
    inputs[1].dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenNthCalledWith(1, expect.objectContaining({ detail: { id: 'wifi', checked: true } }));
    expect(spy).toHaveBeenNthCalledWith(2, expect.objectContaining({ detail: { id: 'bt', checked: false } }));
    expect(spy).toHaveBeenNthCalledWith(3, expect.objectContaining({ detail: { id: 'wifi', checked: false } }));
    expect(spy).toHaveBeenNthCalledWith(4, expect.objectContaining({ detail: { id: 'bt', checked: true } }));
  });

  it('renders no switches when switchesArray is empty', async () => {
    const page = await createWithSwitchesArray([]);
    const inputs = page.root!.querySelectorAll('input[type="checkbox"]');
    expect(inputs.length).toBe(0);
    expect(page.root).toMatchSnapshot();
  });

  it('does not emit event when switch item is disabled', async () => {
    const page = await createWithSwitchesArray([{ id: 'wifi', label: 'Wi-Fi', checked: false, disabled: true }]);

    const spy = jest.fn();
    page.win.addEventListener('checkedChanged', spy);

    const input = page.root!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  it('multi-switch group: sets aria-invalid + aria-describedby when inline and any item invalid', async () => {
    const page = await createWithSwitchesArray(
      [
        { id: 'one', label: 'One', checked: false, required: true, validation: true, validationMessage: 'One required.' },
        { id: 'two', label: 'Two', checked: true, required: false, validation: false },
      ],
      `input-id="group-a" inline="true"`,
    );

    const group = page.root!.querySelector('#group-a[role="group"]') as HTMLElement;
    expect(group).toBeTruthy();

    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-describedby')).toBe('group-a-validation');

    const inlineErrors = page.root!.querySelector('#group-a-validation.ts-inline.invalid-feedback') as HTMLElement;
    expect(inlineErrors).toBeTruthy();
    expect(inlineErrors.textContent).toContain('One required.');
  });
});
