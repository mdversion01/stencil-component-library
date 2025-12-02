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

    const label = root.querySelector('label')!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    expect(label.textContent).toContain('Username');
    expect(input.id).toBe('user');
    expect(input.placeholder).toBe('Username');

    // If a "for"/htmlFor is present, verify it; otherwise don't fail the test
    const labelFor = label.getAttribute('for') || (label as any).htmlFor || (label as any).htmlfor;
    if (labelFor != null) {
      expect(labelFor).toBe('user');
    }

    expect(normalize(root.outerHTML)).toMatchInlineSnapshot(`"<plumage-input-group-component label="Username" input-id="user"><!----><div class="plumage"><div class="form-group form-input-group"><label class="form-control-label" htmlfor="user"><span>Username</span></label><div class="input-group"><input type="text" class="form-control" placeholder="Username" id="user" name="username" aria-label="Username" aria-labelledby="username"><div class="b-underline" role="presentation"><div class="b-focus" role="presentation" aria-hidden="true"></div></div></div></div></div></plumage-input-group-component>"`);
  });

  it('renders horizontal layout with label/input cols, prepend slot and append icon (snapshot)', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Amount"
          input-id="amount"
          form-layout="horizontal"
          label-cols="xs-12 sm-4"
          input-cols="xs-12 sm-8"
          prepend-field
          append-field
          append-icon="fa-solid fa-dollar-sign"
        >
          <span slot="prepend">Total</span>
        </plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const input = page.root!.querySelector('input.form-control') as HTMLInputElement;
    expect(input.id).toBe('amount');

    const prepend = q(page.root!, ['.input-group .input-group-text slot[name="prepend"]', '.input-group [slot="prepend"]', '.input-group .input-group-text']);
    expect(prepend).toBeTruthy();

    const dollarIcon = q(page.root!, ['.fa-dollar-sign', '.fa-solid.fa-dollar-sign', 'i[class*="fa-dollar-sign"]']);
    expect(dollarIcon).toBeTruthy();

    expect(normalize(page.root!.outerHTML)).toMatchInlineSnapshot(`"<plumage-input-group-component label="Amount" input-id="amount" form-layout="horizontal" label-cols="xs-12 sm-4" input-cols="xs-12 sm-8" prepend-field="" append-field="" append-icon="fa-solid fa-dollar-sign"><!----><div class="plumage horizontal"><div class="form-group form-input-group row"><label class="form-control-label col-12 col-sm-4 no-padding col-form-label" htmlfor="amount"><span>Amount:</span></label><div class="col-12 col-sm-8"><div class="input-group"><div><span class="input-group-text"><span slot="prepend">Total</span></span></div><input type="text" class="form-control" placeholder="Amount" id="amount" name="amount" aria-label="Amount" aria-labelledby="amount"><span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span><div class="b-underline" role="presentation"><div class="b-focus" role="presentation" aria-hidden="true"></div></div></div></div></div></div></plumage-input-group-component>"`);
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
    expect(feedback.textContent).toContain('Required field.');
  });

  it('underline expands on focus/click and collapses on outside click', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="Phone" input-id="phone" prepend-field><span slot="prepend">+1</span></plumage-input-group-component>`,
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

    // initially not applied (component uses _resolvedFormId watch to apply)
    expect(input.getAttribute('form')).toBeNull();

    // set form-id AFTER render to trigger @Watch('formId')
    root.setAttribute('form-id', 'formA');
    await page.waitForChanges();
    expect(input.getAttribute('form')).toBe('formA');

    // change again
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

    // assert the visible input value was cleared
    expect((root.querySelector('input.search-bar') as HTMLInputElement).value).toBe('');
    expect(domSpy).toHaveBeenCalled();
  });
});
