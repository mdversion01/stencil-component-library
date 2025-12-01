// src/components/plumage-input-field/plumage-input-field-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { PlumageInputFieldComponent } from './plumage-input-field-component';

// Small helper to make snapshots stable (strip inline style noise if any)
function normalize(html: string) {
  return html.replace(/\sstyle="[^"]*"/g, '');
}

describe('<plumage-input-field-component>', () => {
  it('renders with defaults and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="Username" input-id="user"></plumage-input-field-component>`,
    });

    const root = page.root!;
    expect(root).toBeTruthy();

    // Basic checks without relying on the 'for' attribute quirks in test env
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();
    expect(input.id).toBe('user'); // ID is the important linkage

    // Snapshot of core structure
    expect(normalize(root.outerHTML)).toMatchInlineSnapshot(
      `"<plumage-input-field-component label="Username" input-id="user"><div class="plumage"><div class="form-group"><label class="form-control-label" htmlfor="user"><span>Username</span></label><div class="input-container" role="presentation" aria-labelledby="username"><input id="user" name="username" type="text" class="form-control" placeholder="Username" aria-labelledby="username"><div class="b-underline" role="presentation"><div class="b-focus" role="presentation" aria-hidden="true"></div></div></div></div></div></plumage-input-field-component>"`,
    );
  });

  it('applies horizontal layout with responsive cols and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `
        <plumage-input-field-component
          label="Amount"
          input-id="amount"
          form-layout="horizontal"
          label-cols="sm-3"
          input-cols="sm-9"
          size="lg"
        ></plumage-input-field-component>
      `,
    });

    const root = page.root!;
    expect(root).toBeTruthy();

    // Label should receive horizontal classes + parsed col class
    const label = root.querySelector('label')!;
    expect(label.className).toContain('col-form-label');
    expect(label.className).toMatch(/col-sm-3/);

    // Input wrapper should have parsed input col classes
    const inputWrapper = root.querySelector('.form-group .col-sm-9');
    expect(inputWrapper).toBeTruthy();

    // Snapshot of horizontal version (structure)
    expect(normalize(root.outerHTML)).toMatchInlineSnapshot(
      `"<plumage-input-field-component label="Amount" input-id="amount" form-layout="horizontal" label-cols="sm-3" input-cols="sm-9" size="lg"><div class="plumage horizontal"><div class="form-group row"><label class="form-control-label col-sm-3 no-padding col-form-label" htmlfor="amount"><span>Amount</span></label><div class="col-sm-9"><div class="input-container" role="presentation" aria-labelledby="amount"><input id="amount" name="amount" type="text" class="form-control input-lg" placeholder="Amount" aria-labelledby="amount"><div class="b-underline" role="presentation"><div class="b-focus" role="presentation" aria-hidden="true"></div></div></div></div></div></div></plumage-input-field-component>"`,
    );
  });

  it('shows validation UI when validation=true', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `
        <plumage-input-field-component
          label="Email"
          input-id="email"
          validation
          validation-message="Required field."
        ></plumage-input-field-component>
      `,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control')!;
    const feedback = root.querySelector('#validationMessage');

    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(feedback).toBeTruthy();
    expect(feedback!.textContent).toContain('Required field.');
  });

  it('emits valueChange and sanitizes input on user typing', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="City" input-id="city"></plumage-input-field-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    const spy = jest.fn();
    root.addEventListener('valueChange', (ev: any) => spy(ev.detail));

    input.value = 'Ber<lin>';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    // Should have emitted sanitized "Berlin"
    expect(spy).toHaveBeenCalledWith('Berlin');
    // DOM value should reflect sanitized string
    expect((root.querySelector('input') as HTMLInputElement).value).toBe('Berlin');
  });

  it('underline expands on focus and collapses on outside click', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="Focus" input-id="f"></plumage-input-field-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;
    const focusBar = root.querySelector('.b-focus') as HTMLDivElement;

    // Focus triggers underline expansion
    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await page.waitForChanges();
    expect(focusBar.style.width).toBe('100%');
    // JSDOM can return "0" or "0px" depending on version – accept both
    expect(['0', '0px']).toContain(focusBar.style.left);

    // Outside click collapses underline
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    // After outside click the underline should collapse to 0 width and center (50%)
    expect(['0', '0px', '']).toContain(focusBar.style.width);
    expect(['50%', '50']).toContain(focusBar.style.left);
  });

  it('applies/updates the form attribute when formId is set (watcher path)', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="Zip" input-id="zip"></plumage-input-field-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    // Initially no "form" since watcher hasn't run
    expect(input.getAttribute('form')).toBeNull();

    // Update form-id to trigger @Watch('formId') and re-apply
    root.setAttribute('form-id', 'formB');
    await page.waitForChanges();
    expect(input.getAttribute('form')).toBe('formB');
  });

  it('required + blur toggles validation when threshold not met', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="Name" input-id="nm" required></plumage-input-field-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    // Type fewer than 3 chars -> below threshold
    input.value = 'Al';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    // Blur should mark invalid (threshold not met)
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(input.classList.contains('is-invalid')).toBe(true);

    // Now meet threshold
    input.value = 'Alex';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    // Should clear invalid state due to live validation
    expect(input.classList.contains('is-invalid')).toBe(false);
  });

  it('horizontal layout falls back to numeric cols when string specs not provided', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `
        <plumage-input-field-component
          label="Code"
          input-id="code"
          form-layout="horizontal"
          label-col="3"
          input-col="9"
        ></plumage-input-field-component>
      `,
    });

    const root = page.root!;
    const label = root.querySelector('label')!;
    expect(label.className).toContain('col-3');
    const inputCol = root.querySelector('.col-9');
    expect(inputCol).toBeTruthy();

    // Just a light snapshot to lock structural intent
    expect(normalize(root.outerHTML)).toMatchSnapshot();
  });
});
