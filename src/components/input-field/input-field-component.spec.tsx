// File: src/components/input-field/input-field-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { InputFieldComponent } from './input-field-component';

const idRefs = (v: string | null) =>
  String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const escapeAttrValue = (v: string) => v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const byId = (root: Element, id: string) => root.querySelector(`[id="${escapeAttrValue(id)}"]`);

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

    expect(input.id).toBe('first');

    const labelledBy = input.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(byId(root, String(labelledBy))).toBeTruthy();

    expect(label.textContent || '').toContain('First Name');
    expect(label.textContent || '').not.toContain('First Name:');

    expect(input.placeholder).toBe('First Name');
    expect(input.getAttribute('aria-label')).toBeNull();

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const describedIds = idRefs(describedBy);
    expect(describedIds.length).toBeGreaterThan(0);
    describedIds.forEach(id => expect(byId(root, id)).toBeTruthy());

    expect(describedIds.some(id => id.endsWith('__desc'))).toBe(true);
    expect(input.getAttribute('aria-readonly')).toBeNull();
    expect(input.readOnly).toBe(false);
  });

  it('binds value prop and emits valueChange on input', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Email" input-id="email" value="new@site.com"></input-field-component>`,
    });

    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('new@site.com');

    const valueSpy = jest.fn();
    root.addEventListener('valueChange', (e: any) => valueSpy(e?.detail));

    input.value = '  <b>new@site.com</b>  ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    expect(input.value).toBe('new@site.com');
    expect(valueSpy).toHaveBeenCalled();
    expect(valueSpy.mock.calls[valueSpy.mock.calls.length - 1][0]).toBe('new@site.com');
  });

  it('syncs the native input when value prop changes externally', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Email" input-id="email-sync" value="start"></input-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as InputFieldComponent;
    let input = page.root!.querySelector('input') as HTMLInputElement;

    expect(input.value).toBe('start');

    comp.value = 'updated@site.com';
    await page.waitForChanges();

    input = page.root!.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('updated@site.com');
  });

  it('applies and removes the form attribute when formId changes', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Zip" input-id="zip"></input-field-component>`,
    });

    const form = document.createElement('form');
    form.id = 'myForm';
    document.body.appendChild(form);

    const comp = page.rootInstance as InputFieldComponent;
    const input = page.root!.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('form')).toBeNull();

    comp.formId = 'myForm';
    await page.waitForChanges();
    expect(input.getAttribute('form')).toBe('myForm');

    comp.formId = '';
    await page.waitForChanges();
    expect(input.getAttribute('form')).toBeNull();

    document.body.removeChild(form);
  });

  it('renders help text always; adds validation message + aria-describedby when invalid', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Username" input-id="user" validation validation-message="This field is required."></input-field-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input') as HTMLInputElement;

    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const describedIds = idRefs(input.getAttribute('aria-describedby'));
    expect(describedIds.some(id => id.endsWith('__desc'))).toBe(true);
    expect(describedIds.some(id => id.endsWith('__validation'))).toBe(true);

    const validationId = describedIds.find(id => id.endsWith('__validation'))!;
    const msg = byId(root, validationId) as HTMLDivElement;
    expect(msg).toBeTruthy();
    expect(msg.textContent || '').toContain('This field is required.');
    expect((msg.getAttribute('aria-live') || '').toLowerCase()).toBe('polite');
    expect((msg.getAttribute('aria-atomic') || '').toLowerCase()).toBe('true');

    describedIds.forEach(id => expect(byId(root, id)).toBeTruthy());
  });

  it('respects disabled and required flags', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Code" input-id="code" disabled required></input-field-component>`,
    });

    const input = page.root!.querySelector('input') as HTMLInputElement;
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('required');
    expect(input.getAttribute('aria-disabled')).toBe('true');
  });

  it('supports readOnly with aria-readonly and read-only styling', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Code" input-id="code" read-only value="Locked"></input-field-component>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input') as HTMLInputElement;

    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(input.classList.contains('read-only')).toBe(true);
    expect(input.classList.contains('is-invalid')).toBe(false);
    expect(label.className).not.toContain('invalid');
    expect(input.value).toBe('Locked');
  });

  it('readOnly still emits sanitized valueChange on input event but remains readonly in markup', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Email" input-id="email" read-only value="start"></input-field-component>`,
    });

    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const valueSpy = jest.fn();
    root.addEventListener('valueChange', (e: any) => valueSpy(e?.detail));

    input.value = '  <b>next</b>  ';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(input.value).toBe('next');
    expect(valueSpy).toHaveBeenCalledWith('next');
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
    expect(labelEl.className).toMatch(/\bcol-12\b/);
    expect(labelEl.className).toMatch(/\bcol-sm-4\b/);

    const inputWrapper = labelEl.nextElementSibling as HTMLElement;
    expect(inputWrapper).toBeTruthy();
    expect(inputWrapper.className).toMatch(/\bcol-12\b/);
    expect(inputWrapper.className).toMatch(/\bcol-sm-8\b/);

    expect(labelEl.textContent || '').toContain('City');
    expect(labelEl.textContent || '').toContain(':');
  });

  it('when label is hidden, it still has an accessible name (aria-labelledby resolves)', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component label="Phone" label-hidden input-id="phone"></input-field-component>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input') as HTMLInputElement;

    expect(label.className).toContain('sr-only');

    const labelledBy = input.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(byId(root, String(labelledBy))).toBeTruthy();

    expect(input.placeholder).toBe('Phone');
  });

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

  it('matches snapshot (readOnly)', async () => {
    const page = await newSpecPage({
      components: [InputFieldComponent],
      html: `<input-field-component
               label="Account ID"
               input-id="account-id"
               read-only
               value="ABC-123"
             ></input-field-component>`,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
