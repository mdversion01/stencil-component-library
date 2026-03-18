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

function getLabelFor(label: HTMLLabelElement) {
  // Stencil snapshots can serialize htmlFor as htmlfor
  return label.getAttribute('for') || (label as any).htmlFor || label.getAttribute('htmlfor') || '';
}

function idRefs(v: string | null | undefined): string[] {
  return String(v || '')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
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

    // visible text / base wiring
    expect((label.textContent || '').trim()).toContain('Username');
    expect(input.id).toBe('user');
    expect(input.placeholder).toBe('Username');

    // label association (native)
    expect(label.id).toBe('user-label');
    expect(getLabelFor(label)).toBe('user');

    // a11y wiring (new)
    expect(input.getAttribute('aria-labelledby')).toBe('user-label');
    // aria-label should be absent because aria-labelledby exists (spec)
    expect(input.getAttribute('aria-label')).toBeNull();

    // state wiring defaults
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('aria-required')).toBeNull();
    expect(input.getAttribute('aria-disabled')).toBeNull();

    expect(normalize(root.outerHTML)).toMatchSnapshot('stacked-default');
  });

  it('renders horizontal layout with responsive cols, prepend slot + append icon (snapshot) and describes prepend/append', async () => {
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

    // responsive cols converted to bootstrap-like cols
    const horizontalLabel = root.querySelector('label.col-12.col-sm-4') as HTMLElement | null;
    const horizontalInputWrap = root.querySelector('.col-12.col-sm-8') as HTMLElement | null;
    expect(horizontalLabel).toBeTruthy();
    expect(horizontalInputWrap).toBeTruthy();

    // prepend slot should render
    const prepend = q(root, [
      '.input-group [slot="prepend"]',
      '.input-group .input-group-text',
      '.input-group-text',
    ]);
    expect(prepend).toBeTruthy();

    // append icon should exist
    const dollarIcon = q(root, ['.fa-dollar-sign', '.fa-solid.fa-dollar-sign', 'i[class*="fa-dollar-sign"]']);
    expect(dollarIcon).toBeTruthy();

    // a11y describedby should include prepend + append ids when those regions exist
    const described = idRefs(input.getAttribute('aria-describedby'));
    expect(described).toEqual(expect.arrayContaining(['amount-prepend', 'amount-append']));

    // ids exist
    expect(root.querySelector('#amount-prepend')).toBeTruthy();
    expect(root.querySelector('#amount-append')).toBeTruthy();

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

  it('shows validation UI and message when validation=true; wires aria-describedby + aria-invalid', async () => {
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

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;
    expect(input).toBeTruthy();

    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    // validation id is computed off input-id now
    const described = idRefs(input.getAttribute('aria-describedby'));
    expect(described).toContain('email-validation');

    const feedback = root.querySelector('#email-validation') as HTMLElement | null;
    expect(feedback).toBeTruthy();
    expect(feedback!.className).toContain('invalid-feedback');
    expect(feedback!.textContent).toContain('Required field.');

    // polite live region for validation
    expect((feedback!.getAttribute('aria-live') || '').toLowerCase()).toBe('polite');
  });

  it('underline expands on focus/click and collapses on outside click', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="Phone" input-id="phone" prepend><span slot="prepend">+1</span></plumage-input-group-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;
    const focusBar = root.querySelector('.b-focus') as HTMLDivElement;
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
    let input = root.querySelector('input.form-control') as HTMLInputElement;
    expect(input).toBeTruthy();

    expect(input.getAttribute('form')).toBeNull();

    root.setAttribute('form-id', 'formA');
    await page.waitForChanges();
    // Stencil may re-render; re-query
    input = root.querySelector('input.form-control') as HTMLInputElement;
    expect(input.getAttribute('form')).toBe('formA');

    root.setAttribute('form-id', 'formB');
    await page.waitForChanges();
    input = root.querySelector('input.form-control') as HTMLInputElement;
    expect(input.getAttribute('form')).toBe('formB');
  });

  it('emits valueChange and DOM "change" on input; sanitizes angle brackets', async () => {
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

    input.value = 'U<S>A';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(stencilSpy).toHaveBeenCalled();
    expect(domSpy).toHaveBeenCalled();

    // sanitized
    expect((root.querySelector('input.form-control') as HTMLInputElement).value).toBe('USA');
  });

  it('search variant renders and clear button clears value + emits change', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component plumage-search input-id="search" label="Search" placeholder="Search users" value="ann"></plumage-input-group-component>`,
    });

    const root = page.root!;
    let input = root.querySelector('input.search-bar') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe('ann');

    const domSpy = jest.fn();
    root.addEventListener('change', domSpy as any);

    // clear icon is now a button.clear-icon
    const clearBtn = root.querySelector('button.clear-icon') as HTMLButtonElement | null;
    expect(clearBtn).toBeTruthy();

    clearBtn!.click();
    await page.waitForChanges();

    input = root.querySelector('input.search-bar') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(domSpy).toHaveBeenCalled();
  });
});
