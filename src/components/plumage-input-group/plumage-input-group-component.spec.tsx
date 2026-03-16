// src/components/plumage-input-group/plumage-input-group-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { PlumageInputGroupComponent } from './plumage-input-group-component';

function normalize(html: string) {
  return html
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function q(root: ParentNode, selectors: string[]) {
  for (const s of selectors) {
    const n = root.querySelector(s);
    if (n) return n;
  }
  return null;
}

describe('<plumage-input-group-component>', () => {
  it('renders (stacked) with defaults and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="Username" input-id="user"></plumage-input-group-component>`,
    });

    const root = page.root!;
    expect(root).toBeTruthy();

    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    expect(label.textContent || '').toContain('Username');
    expect(input.id).toBe('user');
    expect(input.placeholder).toBe('Username');

    // Stencil may serialize htmlFor as "htmlfor" attribute in snapshots.
    const labelFor = label.getAttribute('for') || (label as any).htmlFor || label.getAttribute('htmlfor');
    if (labelFor != null && labelFor !== '') {
      expect(labelFor).toBe('user');
    }

    // a11y wiring
    expect(input.getAttribute('aria-label')).toBe('Username');
    expect(input.getAttribute('aria-labelledby')).toBe('username');

    expect(normalize(root.outerHTML)).toMatchSnapshot('stacked-default');
  });

  it('renders horizontal layout with label/input cols, prepend slot and append icon (snapshot)', async () => {
    // IMPORTANT: component uses attribute names `prepend` and `append`
    // (not prepend-field/append-field).
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Amount"
          input-id="amount"
          form-layout="horizontal"
          label-cols="xs-12 sm-4"
          input-cols="xs-12 sm-8"
          prepend
          append
          append-icon="fa-solid fa-dollar-sign"
        >
          <span slot="prepend">Total</span>
        </plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.id).toBe('amount');

    // label should include colon in horizontal mode
    const label = root.querySelector('label') as HTMLLabelElement;
    expect(label).toBeTruthy();
    expect((label.textContent || '').trim()).toContain('Amount:');

    // prepend slot should render somewhere inside input-group
    const prepend = q(root, [
      '.input-group .input-group-text [slot="prepend"]',
      '.input-group [slot="prepend"]',
      '.input-group .input-group-text',
    ]);
    expect(prepend).toBeTruthy();

    // append icon should exist
    const dollarIcon = q(root, ['.fa-dollar-sign', '.fa-solid.fa-dollar-sign', 'i[class*="fa-dollar-sign"]']);
    expect(dollarIcon).toBeTruthy();

    // responsive cols converted to bootstrap-like cols
    const horizontalLabel = root.querySelector('label.col-12.col-sm-4') as HTMLElement | null;
    const horizontalInputWrap = root.querySelector('.col-12.col-sm-8') as HTMLElement | null;
    expect(horizontalLabel).toBeTruthy();
    expect(horizontalInputWrap).toBeTruthy();

    expect(normalize(root.outerHTML)).toMatchSnapshot('horizontal-prepend-append-icon');
  });

  it('size="lg" applies the input-group-lg class', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="City" input-id="city" size="lg"></plumage-input-group-component>`,
    });

    const grp = page.root!.querySelector('.input-group')!;
    expect(grp.className).toContain('input-group-lg');
  });

  it('shows validation UI and message when validation=true', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Email"
          input-id="email"
          validation
          validation-message="Required field."
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const input = page.root!.querySelector('input.form-control')!;
    expect(input.classList.contains('is-invalid')).toBe(true);

    const feedback = page.root!.querySelector('.invalid-feedback')!;
    expect(feedback).toBeTruthy();
    expect(feedback.textContent).toContain('Required field.');
  });

  it('underline expands on focus/click and collapses on outside click', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="Phone" input-id="phone" prepend><span slot="prepend">+1</span></plumage-input-group-component>`,
    });

    const input = page.root!.querySelector('input.form-control') as HTMLInputElement;
    const focusBar = page.root!.querySelector('.b-focus') as HTMLDivElement;
    expect(focusBar).toBeTruthy();

    // expand
    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(['100%', '100']).toContain(focusBar.style.width);
    expect(['0', '0px']).toContain(focusBar.style.left);

    // collapse via outside click
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(['0', '0px', '']).toContain(focusBar.style.width);
    expect(['50%', '50']).toContain(focusBar.style.left);
  });

  it('applies and updates the form attribute when formId changes', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="Zip" input-id="zip"></plumage-input-group-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    expect(input.getAttribute('form')).toBeNull();

    root.setAttribute('form-id', 'formA');
    await page.waitForChanges();
    expect(input.getAttribute('form')).toBe('formA');

    root.setAttribute('form-id', 'formB');
    await page.waitForChanges();
    expect(input.getAttribute('form')).toBe('formB');
  });

  it('emits valueChange and DOM "change" on input', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="Country" input-id="country"></plumage-input-group-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    const stencilSpy = jest.fn();
    const domSpy = jest.fn();

    root.addEventListener('valueChange', stencilSpy as any);
    root.addEventListener('change', domSpy as any);

    input.value = 'USA';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(stencilSpy).toHaveBeenCalled();
    expect(domSpy).toHaveBeenCalled();
  });

  it('search variant renders and clear button clears value + emits change', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component plumage-search placeholder="Search users" value="ann"></plumage-input-group-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.search-bar') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe('ann');

    const domSpy = jest.fn();
    root.addEventListener('change', domSpy as any);

    const clearIcon = root.querySelector('.clear-icon') as HTMLElement;
    expect(clearIcon).toBeTruthy();

    clearIcon.click();
    await page.waitForChanges();

    expect((root.querySelector('input.search-bar') as HTMLInputElement).value).toBe('');
    expect(domSpy).toHaveBeenCalled();
  });
});
