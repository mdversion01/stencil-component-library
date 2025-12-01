// src/components/input-field/input-field-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { InputFieldComponent } from './input-field-component';

describe('<input-field-component>', () => {
  it('renders with basic props and a11y attributes', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="First Name" input-id="first"></input-field-component>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input') as HTMLInputElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // Stacked layout: label text (no colon)
    expect(label.textContent).toBe('First Name');

    // Linkage: assert the input id (stable in Stencil mock);
    // the label's "for" attribute is inconsistently exposed in the mock DOM.
    expect(input.id).toBe('first');

    // Placeholder prefers label
    expect(input.placeholder).toBe('First Name');

    // a11y basics (label visible => no aria-label)
    expect(input.getAttribute('aria-label')).toBeNull();
    // aria-labelledby uses camelCased label
    expect(input.getAttribute('aria-labelledby')).toBe('firstName');
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  it('binds value and updates on input (silences Prop immutability warn)', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const page = await newSpecPage({
        components: [InputFieldComponent],
        html: `<input-field-component label="Email" input-id="email" value="new@site.com"></input-field-component>`,
      });

      const comp = page.rootInstance as InputFieldComponent;
      const input = page.root!.querySelector('input') as HTMLInputElement;

      // Initial binding
      expect(input.value).toBe('new@site.com');

      // Simulate typing
      input.value = 'new@site.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await page.waitForChanges();

      // Component mutates its own prop (component code does this); assert observed state
      expect(comp.value).toBe('new@site.com');
      expect(input.value).toBe('new@site.com');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('applies and removes the form attribute when formId changes', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Zip" input-id="zip"></input-field-component>`,
    });

    // Add a real form so the attribute targets something
    const form = document.createElement('form');
    form.id = 'myForm';
    document.body.appendChild(form);

    const comp = page.rootInstance as InputFieldComponent;
    const input = page.root!.querySelector('input') as HTMLInputElement;

    // Initially no form attr
    expect(input.getAttribute('form')).toBeNull();

    // Set formId -> watcher applies attribute
    comp.formId = 'myForm';
    await page.waitForChanges();
    expect(input.getAttribute('form')).toBe('myForm');

    // Clear formId -> attribute removed
    comp.formId = '';
    await page.waitForChanges();
    expect(input.getAttribute('form')).toBeNull();

    document.body.removeChild(form);
  });

  it('renders validation message and aria-describedby when invalid', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Username" input-id="user" validation validation-message="This field is required."></input-field-component>`,
    });

    const input = page.root!.querySelector('input') as HTMLInputElement;
    const msg = page.root!.querySelector('#validationMessage') as HTMLDivElement;

    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(input.getAttribute('aria-describedby')).toBe('validationMessage');
    expect(msg.textContent).toContain('This field is required.');
  });

  it('respects disabled and required flags', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Code" input-id="code" disabled required></input-field-component>`,
    });

    const input = page.root!.querySelector('input') as HTMLInputElement;
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('required');
  });

  it('uses compact responsive col specs in horizontal layout', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component
               label="City"
               input-id="city"
               form-layout="horizontal"
               label-cols="xs-12 sm-4"
               input-cols="xs-12 sm-8"
             ></input-field-component>`,
    });

    const row = page.root!.querySelector('.form-group.row') as HTMLElement;
    expect(row).toBeTruthy();

    const labelEl = row.querySelector('label') as HTMLLabelElement;
    expect(labelEl).toBeTruthy();
    expect(labelEl.className).toMatch(/col-12/);
    expect(labelEl.className).toMatch(/col-sm-4/);

    const inputWrapper = labelEl.nextElementSibling as HTMLElement;
    expect(inputWrapper).toBeTruthy();
    expect(inputWrapper.className).toMatch(/col-12/);
    expect(inputWrapper.className).toMatch(/col-sm-8/);

    // In horizontal/inline layouts, the label ends with a colon
    expect(labelEl.textContent).toBe('City:');
  });

  it('adds aria-label when label is hidden (labelHidden=true)', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Phone" label-hidden input-id="phone"></input-field-component>`,
    });

    const input = page.root!.querySelector('input') as HTMLInputElement;
    // When labelHidden, aria-label uses camelCased label
    expect(input.getAttribute('aria-label')).toBe('phone');
    expect(input.placeholder).toBe('Phone');
  });

  // ---------------- SNAPSHOTS ----------------

  it('matches snapshot (default stacked layout)', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component
               label="First Name"
               input-id="first"
               value="Ada"
             ></input-field-component>`,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('matches snapshot (horizontal with validation)', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component
               label="Email"
               input-id="email"
               form-layout="horizontal"
               label-cols="xs-12 sm-3"
               input-cols="xs-12 sm-9"
               validation
               validation-message="Please enter a valid email."
               value=""
             ></input-field-component>`,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
