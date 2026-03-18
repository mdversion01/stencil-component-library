// src/components/plumage-input-field/plumage-input-field-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { PlumageInputFieldComponent } from './plumage-input-field-component';

// Small helper to make snapshots stable (strip inline style noise if any)
function normalize(html: string) {
  return html.replace(/\sstyle="[^"]*"/g, '');
}

// Minimal CSS.escape polyfill for test envs where it doesn't exist (JSDOM)
function cssEscapeIdent(value: string): string {
  // Good enough for ids produced by this library (letters, numbers, dashes/underscores).
  // If an id contains special CSS selector characters, escape them.
  return String(value).replace(/([ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

function getInput(root: HTMLElement): HTMLInputElement {
  const input = root.querySelector('input.form-control') as HTMLInputElement | null;
  if (!input) throw new Error('input not found');
  return input;
}

function idRefs(v: string | null | undefined): string[] {
  return String(v ?? '')
    .trim()
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function typeIn(page: any, root: HTMLElement, value: string) {
  const input = getInput(root);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await page.waitForChanges();
}

describe('<plumage-input-field-component>', () => {
  it('renders with defaults and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="Username" input-id="user"></plumage-input-field-component>`,
    });

    const root = page.root!;
    expect(root).toBeTruthy();

    const label = root.querySelector('label') as HTMLLabelElement | null;
    const input = getInput(root);

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // ID is the important linkage
    expect(input.id).toBe('user');

    // a11y wiring: label has stable id; input references it via aria-labelledby
    expect(label!.id).toBe('user-label');
    expect(input.getAttribute('aria-labelledby')).toBe('user-label');

    expect(normalize(root.outerHTML)).toMatchInlineSnapshot(`"<plumage-input-field-component label="Username" input-id="user"><div class="plumage"><div class="form-group"><label class="form-control-label label-sm" id="user-label" htmlfor="user"><span>Username</span></label><div class="input-container" role="presentation"><input id="user" name="user" type="text" class="form-control" placeholder="Username" value="" aria-labelledby="user-label" aria-invalid="false" autocomplete="off" inputmode="text"><div class="b-underline" role="presentation" aria-hidden="true"><div class="b-focus" role="presentation" aria-hidden="true"></div></div></div></div></div></plumage-input-field-component>"`);
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

    const label = root.querySelector('label')!;
    expect(label.className).toContain('col-form-label');
    expect(label.className).toMatch(/col-sm-3/);

    const inputWrapper = root.querySelector('.form-group .col-sm-9');
    expect(inputWrapper).toBeTruthy();

    const input = getInput(root);
    expect(input.className).toContain('form-control-lg');

    expect(normalize(root.outerHTML)).toMatchInlineSnapshot(`"<plumage-input-field-component label="Amount" input-id="amount" form-layout="horizontal" label-cols="sm-3" input-cols="sm-9" size="lg"><div class="plumage horizontal"><div class="form-group row"><label class="form-control-label label-sm col-sm-3 no-padding col-form-label" id="amount-label" htmlfor="amount"><span>Amount:</span></label><div class="col-sm-9"><div class="input-container" role="presentation"><input id="amount" name="amount" type="text" class="form-control form-control-lg" placeholder="Amount" value="" aria-labelledby="amount-label" aria-invalid="false" autocomplete="off" inputmode="text"><div class="b-underline" role="presentation" aria-hidden="true"><div class="b-focus" role="presentation" aria-hidden="true"></div></div></div></div></div></div></plumage-input-field-component>"`);
  });

  it('shows validation UI when validation=true (computed ids) and sets aria-describedby/aria-invalid', async () => {
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
    const input = getInput(root);

    const feedback = root.querySelector('#email-validation') as HTMLElement | null;
    expect(feedback).toBeTruthy();
    expect(feedback!.textContent).toContain('Required field.');

    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const describedIds = idRefs(input.getAttribute('aria-describedby'));
    expect(describedIds).toContain('email-validation');

    // all aria-describedby references resolve (no CSS.escape)
    describedIds.forEach((id) => {
      const sel = `#${cssEscapeIdent(id)}`;
      expect(root.querySelector(sel)).toBeTruthy();
    });
  });

  it('emits valueChange and sanitizes input on user typing', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="City" input-id="city"></plumage-input-field-component>`,
    });

    const root = page.root!;
    const input = getInput(root);

    const spy = jest.fn();
    root.addEventListener('valueChange', (ev: any) => spy(ev.detail));

    input.value = 'Ber<lin>';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith('Berlin');
    expect(getInput(root).value).toBe('Berlin');
  });

  it('underline expands on focus and collapses on outside click', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="Focus" input-id="f"></plumage-input-field-component>`,
    });

    const root = page.root!;
    const input = getInput(root);
    const focusBar = root.querySelector('.b-focus') as HTMLDivElement;

    input.dispatchEvent(new Event('focus', { bubbles: true, composed: true }));
    await page.waitForChanges();
    expect(focusBar.style.width).toBe('100%');
    expect(['0', '0px']).toContain(focusBar.style.left);

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    expect(['0', '0px', '']).toContain(focusBar.style.width);
    expect(['50%', '50']).toContain(focusBar.style.left);
  });

  it('applies/updates the form attribute when formId is set (watcher path)', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `<plumage-input-field-component label="Zip" input-id="zip"></plumage-input-field-component>`,
    });

    const root = page.root!;
    const input = getInput(root);

    expect(input.getAttribute('form')).toBeNull();

    root.setAttribute('form-id', 'formB');
    await page.waitForChanges();

    expect(getInput(root).getAttribute('form')).toBe('formB');
  });

  it('required validation wiring: invalid state renders message + describedby wiring; typing >= 3 clears invalid', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `
        <plumage-input-field-component
          label="Name"
          input-id="nm"
          required
          validation
          validation-message="Need 3+ chars"
        ></plumage-input-field-component>
      `,
    });

    const root = page.root!;
    let input = getInput(root);

    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const described = idRefs(input.getAttribute('aria-describedby'));
    expect(described).toContain('nm-validation');

    const msg = root.querySelector('#nm-validation') as HTMLDivElement | null;
    expect(msg).toBeTruthy();
    expect(msg!.textContent || '').toContain('Need 3+ chars');

    await typeIn(page, root, 'Alex');

    input = getInput(root);
    expect(input.classList.contains('is-invalid')).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('false');

    expect(root.querySelector('#nm-validation')).toBeNull();
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

    expect(normalize(root.outerHTML)).toMatchSnapshot();
  });

  it('uses standard aria-* props when provided (aria-labelledby / aria-describedby)', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent],
      html: `
        <div>
          <span id="externalLabel">External Label</span>
          <span id="externalHelp">Helper text</span>
          <plumage-input-field-component
            label="Ignored label for naming"
            input-id="std"
            aria-labelledby="externalLabel"
            aria-describedby="externalHelp"
          ></plumage-input-field-component>
        </div>
      `,
    });

    const host = page.body.querySelector('plumage-input-field-component') as HTMLElement;
    const input = host.querySelector('input.form-control') as HTMLInputElement;

    expect(input.getAttribute('aria-labelledby')).toBe('externalLabel');
    expect(idRefs(input.getAttribute('aria-describedby'))).toContain('externalHelp');

    const label = host.querySelector('label')!;
    expect(label.id).toBe('std-label');
  });
});
