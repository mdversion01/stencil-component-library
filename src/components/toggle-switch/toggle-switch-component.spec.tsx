// src/components/toggle-switch/toggle-switch-component.spec.tsx

import { newSpecPage } from '@stencil/core/testing';
import { ToggleSwitchComponent } from './toggle-switch-component';

const createWithSwitchesArray = async switchesArray => {
  const page = await newSpecPage({
    components: [ToggleSwitchComponent],
    html: `<toggle-switch-component switches="true"></toggle-switch-component>`,
  });
  page.rootInstance.syncSwitchesArray(switchesArray);
  await page.waitForChanges();
  return page;
};

describe('toggle-switch-component', () => {
  it('renders a toggle with toggleTxt and newToggleTxt', async () => {
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
    expect(page.root).toMatchSnapshot();
  });

  it('renders multiple switches from switchesArray', async () => {
    const page = await createWithSwitchesArray([
      { id: 'one', label: 'First', checked: false },
      { id: 'two', label: 'Second', checked: true },
    ]);
    expect(page.root.querySelectorAll('input[type="checkbox"]').length).toBe(2);
    expect(page.root).toMatchSnapshot();
  });

  it('emits checkedChanged on single toggle', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component input-id="single-toggle" label-txt="Toggle Me"></toggle-switch-component>`,
    });

    const spy = jest.fn();
    page.win.addEventListener('checkedChanged', spy);

    const input = page.root.querySelector('input[type="checkbox"]');
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { id: 'single-toggle', checked: true },
      }),
    );
  });

  it('applies correct aria-* attributes', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component input-id="aria-toggle" checked="false" disabled="true"></toggle-switch-component>`,
    });

    const input = page.root.querySelector('input');
    expect(input.getAttribute('aria-checked')).toBe('false');
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });

  it('shows validation error when required and invalid', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component input-id="val-toggle" required="true" validation="true" label-txt="Terms" validation-message="Required field."></toggle-switch-component>`,
    });

    const error = page.root.querySelector('.invalid-feedback');
    expect(error).toBeTruthy();
    expect(error.textContent.trim()).toBe('Required field.');
  });

  it('sets keyboardFocused true on Tab press', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component input-id="tab-toggle"></toggle-switch-component>`,
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    await page.waitForChanges();

    expect(page.rootInstance.keyboardFocused).toBe(true);
  });

  it('toggles switchesArray item and emits event', async () => {
    const page = await createWithSwitchesArray([
      { id: 'item1', label: 'Wi-Fi', checked: false },
      { id: 'item2', label: 'Bluetooth', checked: true },
    ]);

    const spy = jest.fn();
    page.win.addEventListener('checkedChanged', spy);

    const inputs = page.root.querySelectorAll('input[type="checkbox"]');
    inputs[0].dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { id: 'item1', checked: true },
      }),
    );
  });

  it('renders inline and size class combinations (default BS5 switch)', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitchComponent],
      html: `<toggle-switch-component
             input-id="styled-toggle"
             label-txt="Wi-Fi"
             size="lg"
             inline="true">
           </toggle-switch-component>`,
    });

    // Default = Bootstrap 5 switch
    const wrapper = page.root.querySelector('.form-check.form-switch') as HTMLElement;
    expect(wrapper).toBeTruthy();

    // Inline uses BS5 class
    expect(wrapper.classList.contains('form-check-inline')).toBe(true);

    // BS5 doesn’t ship a built-in "lg" size class for switches.
    // If you didn’t add a custom size mapping for the default switch,
    // just assert that the old custom-control size class is NOT present.
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

    // Custom = your legacy/custom classes
    const wrapper = page.root.querySelector('.custom-control.custom-switch') as HTMLElement;
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

    const inputs = page.root.querySelectorAll('input[type="checkbox"]');
    inputs.forEach(input => input.dispatchEvent(new Event('change')));
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

    const inputs = page.root.querySelectorAll('input[type="checkbox"]');

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
    const inputs = page.root.querySelectorAll('input[type="checkbox"]');
    expect(inputs.length).toBe(0);
    expect(page.root).toMatchSnapshot();
  });

  it('does not emit event when switch is disabled', async () => {
    const page = await createWithSwitchesArray([{ id: 'wifi', label: 'Wi-Fi', checked: false, disabled: true }]);

    const spy = jest.fn();
    page.win.addEventListener('checkedChanged', spy);

    const input = page.root.querySelector('input[type="checkbox"]');
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).not.toHaveBeenCalled();
  });
});
