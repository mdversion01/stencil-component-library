// File: src/components/plumage-input-group/plumage-input-group-component.spec.tsx
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

function q<T extends Element = HTMLElement>(root: ParentNode, selectors: string[]): T | null {
  for (const s of selectors) {
    const n = root.querySelector(s);
    if (n) return n as T;
  }
  return null;
}

function qa<T extends Element = HTMLElement>(root: ParentNode, sel: string): T[] {
  return Array.from(root.querySelectorAll(sel)) as T[];
}

function getLabelFor(label: HTMLLabelElement) {
  return label.getAttribute('for') || (label as any).htmlFor || label.getAttribute('htmlfor') || '';
}

function idRefs(v: string | null | undefined): string[] {
  return String(v || '')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);
}

function escapeAttrValue(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function byId(root: ParentNode, id: string): Element | null {
  return root.querySelector(`[id="${escapeAttrValue(id)}"]`);
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

    expect((label.textContent || '').trim()).toContain('Username');
    expect(input.id).toBe('user');
    expect(input.placeholder).toBe('Username');

    expect(label.id).toBe('user-label');
    expect(getLabelFor(label)).toBe('user');

    expect(input.getAttribute('aria-labelledby')).toBe('user-label');
    expect(input.getAttribute('aria-label')).toBeNull();

    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('aria-required')).toBeNull();
    expect(input.getAttribute('aria-disabled')).toBeNull();

    expect(normalize(root.outerHTML)).toMatchSnapshot('stacked-default');
  });

  it('renders horizontal layout with responsive cols, prepend text and append icon', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Amount"
          input-id="amount"
          form-layout="horizontal"
          label-cols="xs-12 sm-4"
          input-cols="xs-12 sm-8"
          has-prepend
          prepend-text="Total"
          has-append
          append-icon="fa-solid fa-dollar-sign"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.id).toBe('amount');

    const label = root.querySelector('label') as HTMLLabelElement;
    expect(label).toBeTruthy();
    expect((label.textContent || '').trim()).toContain('Amount:');

    const horizontalLabel = root.querySelector('label.col-12.col-sm-4') as HTMLElement | null;
    const horizontalInputWrap = root.querySelector('.col-12.col-sm-8') as HTMLElement | null;
    expect(horizontalLabel).toBeTruthy();
    expect(horizontalInputWrap).toBeTruthy();

    const prepend = q(root, ['#amount-prepend.input-group-text', '#amount-prepend']);
    expect(prepend).toBeTruthy();
    expect((prepend?.textContent || '').trim()).toContain('Total');

    const dollarIcon = q(root, ['.fa-dollar-sign', '.fa-solid.fa-dollar-sign', 'i[class*="fa-dollar-sign"]']);
    expect(dollarIcon).toBeTruthy();

    const described = idRefs(input.getAttribute('aria-describedby'));
    expect(described).toEqual(expect.arrayContaining(['amount-prepend', 'amount-append']));
    expect(byId(root, 'amount-prepend')).toBeTruthy();
    expect(byId(root, 'amount-append')).toBeTruthy();

    expect(normalize(root.outerHTML)).toMatchSnapshot('horizontal-prepend-text-append-icon');
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

    const described = idRefs(input.getAttribute('aria-describedby'));
    expect(described).toContain('email-validation');

    const feedback = root.querySelector('#email-validation') as HTMLElement | null;
    expect(feedback).toBeTruthy();
    expect(feedback!.className).toContain('invalid-feedback');
    expect(feedback!.textContent).toContain('Required field.');
    expect((feedback!.getAttribute('aria-live') || '').toLowerCase()).toBe('polite');
  });

  it('underline expands on focus/click and collapses on outside click', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="Phone" input-id="phone" has-prepend prepend-text="+1"></plumage-input-group-component>`,
    });

    const root = page.root!;
    const input = root.querySelector('input.form-control') as HTMLInputElement;
    const focusBar = root.querySelector('.b-focus') as HTMLDivElement;
    expect(focusBar).toBeTruthy();

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(['100%', '100']).toContain(focusBar.style.width);
    expect(['0', '0px']).toContain(focusBar.style.left);

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
    expect((root.querySelector('input.form-control') as HTMLInputElement).value).toBe('USA');
  });

  it('syncs native input when value prop changes externally', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component label="Country" input-id="country-external" value="Start"></plumage-input-group-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageInputGroupComponent;
    let input = page.root!.querySelector('input.form-control') as HTMLInputElement;

    expect(input.value).toBe('Start');

    comp.value = 'Updated externally';
    await page.waitForChanges();

    input = page.root!.querySelector('input.form-control') as HTMLInputElement;
    expect(input.value).toBe('Updated externally');
  });

  it('syncs search input when value prop changes externally', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `<plumage-input-group-component plumage-search input-id="search-sync" label="Search" value="ann"></plumage-input-group-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageInputGroupComponent;
    let input = page.root!.querySelector('input.search-bar') as HTMLInputElement;

    expect(input.value).toBe('ann');

    comp.value = 'beth';
    await page.waitForChanges();

    input = page.root!.querySelector('input.search-bar') as HTMLInputElement;
    expect(input.value).toBe('beth');
  });

  it('renders append native button from props with ids and emits appendClick', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Search"
          input-id="search"
          has-append
          append-button
          append-text="Go"
          append-button-variant="secondary"
          append-id="search-append-wrap"
          append-button-id="search-append-btn"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const appendWrap = root.querySelector('#search-append-wrap') as HTMLElement | null;
    const appendButton = root.querySelector('#search-append-btn') as HTMLButtonElement | null;
    const appendSpy = jest.fn();

    root.addEventListener('appendClick', appendSpy as any);

    expect(appendWrap).toBeTruthy();
    expect(appendButton).toBeTruthy();
    expect(appendButton?.className).toContain('input-group-btn');
    expect(appendButton?.className).not.toContain('btn-secondary');
    expect(appendButton?.getAttribute('type')).toBe('button');
    expect((appendButton?.textContent || '').trim()).toBe('Go');
    expect(appendButton?.hasAttribute('disabled')).toBe(false);

    appendButton!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(appendSpy).toHaveBeenCalled();
  });

  it('renders prepend native button from props with ids and emits prependClick', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Search"
          input-id="search-prepend"
          has-prepend
          prepend-button
          prepend-text="Back"
          prepend-button-variant="primary"
          prepend-id="search-prepend-wrap"
          prepend-button-id="search-prepend-btn"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const prependWrap = root.querySelector('#search-prepend-wrap') as HTMLElement | null;
    const prependButton = root.querySelector('#search-prepend-btn') as HTMLButtonElement | null;
    const prependSpy = jest.fn();

    root.addEventListener('prependClick', prependSpy as any);

    expect(prependWrap).toBeTruthy();
    expect(prependButton).toBeTruthy();
    expect(prependButton?.className).toContain('input-group-btn');
    expect(prependButton?.className).not.toContain('btn-primary');
    expect((prependButton?.textContent || '').trim()).toBe('Back');
    expect(prependButton?.hasAttribute('disabled')).toBe(false);

    prependButton!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(prependSpy).toHaveBeenCalled();
  });

  it('does not treat affix button click as generic group interaction', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
      <plumage-input-group-component
        label="Search"
        input-id="search-click-scope"
        has-append
        append-button
        append-text="Go"
        append-button-id="search-click-scope-btn"
      ></plumage-input-group-component>
    `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const appendButton = root.querySelector('#search-click-scope-btn') as HTMLButtonElement;
    const focusBar = root.querySelector('.b-focus') as HTMLDivElement;

    expect(appendButton).toBeTruthy();
    expect(focusBar).toBeTruthy();

    expect(['0', '0px']).toContain(focusBar.style.width);
    expect(['50%', '50']).toContain(focusBar.style.left);

    appendButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(['0', '0px']).toContain(focusBar.style.width);
    expect(['50%', '50']).toContain(focusBar.style.left);
  });

  it('renders readOnly + append/prepend buttons and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Readonly Search"
          input-id="readonly-search"
          read-only
          has-prepend
          prepend-button
          prepend-text="Back"
          prepend-button-id="readonly-prepend-btn"
          has-append
          append-button
          append-text="Go"
          append-button-id="readonly-append-btn"
          value="Locked value"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    expect(normalize(page.root!.outerHTML)).toMatchSnapshot('readonly-prepend-append-buttons');
  });

  it('disables affix buttons when readOnly is true', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Readonly Search"
          input-id="readonly-search"
          read-only
          has-prepend
          prepend-button
          prepend-text="Back"
          prepend-button-id="readonly-prepend-btn"
          has-append
          append-button
          append-text="Go"
          append-button-id="readonly-append-btn"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const prependButton = root.querySelector('#readonly-prepend-btn') as HTMLButtonElement | null;
    const appendButton = root.querySelector('#readonly-append-btn') as HTMLButtonElement | null;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    expect(input.hasAttribute('readonly')).toBe(true);
    expect(prependButton).toBeTruthy();
    expect(appendButton).toBeTruthy();
    expect(prependButton?.hasAttribute('disabled')).toBe(true);
    expect(appendButton?.hasAttribute('disabled')).toBe(true);
  });

  it('does not emit affix click events when readOnly is true', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Readonly Search"
          input-id="readonly-search-events"
          read-only
          has-prepend
          prepend-button
          prepend-text="Back"
          prepend-button-id="readonly-search-events-prepend-btn"
          has-append
          append-button
          append-text="Go"
          append-button-id="readonly-search-events-append-btn"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const prependButton = root.querySelector('#readonly-search-events-prepend-btn') as HTMLButtonElement;
    const appendButton = root.querySelector('#readonly-search-events-append-btn') as HTMLButtonElement;
    const prependSpy = jest.fn();
    const appendSpy = jest.fn();

    root.addEventListener('prependClick', prependSpy as any);
    root.addEventListener('appendClick', appendSpy as any);

    prependButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    appendButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(prependSpy).not.toHaveBeenCalled();
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('disables affix buttons when disabled is true', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Disabled Search"
          input-id="disabled-search"
          disabled
          has-prepend
          prepend-button
          prepend-text="Back"
          prepend-button-id="disabled-prepend-btn"
          has-append
          append-button
          append-text="Go"
          append-button-id="disabled-append-btn"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const prependButton = root.querySelector('#disabled-prepend-btn') as HTMLButtonElement | null;
    const appendButton = root.querySelector('#disabled-append-btn') as HTMLButtonElement | null;
    const input = root.querySelector('input.form-control') as HTMLInputElement;

    expect(input.hasAttribute('disabled')).toBe(true);
    expect(prependButton?.hasAttribute('disabled')).toBe(true);
    expect(appendButton?.hasAttribute('disabled')).toBe(true);
  });

  it('does not emit affix click events when disabled is true', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Disabled Search"
          input-id="disabled-search-events"
          disabled
          has-prepend
          prepend-button
          prepend-text="Back"
          prepend-button-id="disabled-search-events-prepend-btn"
          has-append
          append-button
          append-text="Go"
          append-button-id="disabled-search-events-append-btn"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    const prependButton = root.querySelector('#disabled-search-events-prepend-btn') as HTMLButtonElement;
    const appendButton = root.querySelector('#disabled-search-events-append-btn') as HTMLButtonElement;
    const prependSpy = jest.fn();
    const appendSpy = jest.fn();

    root.addEventListener('prependClick', prependSpy as any);
    root.addEventListener('appendClick', appendSpy as any);

    prependButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    appendButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(prependSpy).not.toHaveBeenCalled();
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('renders plain text affixes without button wrappers', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent],
      html: `
        <plumage-input-group-component
          label="Code"
          input-id="code"
          has-prepend
          prepend-text="#"
          has-append
          append-text=".js"
        ></plumage-input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root!;
    expect(root.querySelector('.prepend-btn')).toBeNull();
    expect(root.querySelector('.append-btn')).toBeNull();

    const affixes = qa<HTMLElement>(root, '.input-group-text');
    expect(affixes.length).toBe(2);
    expect(root.textContent || '').toContain('#');
    expect(root.textContent || '').toContain('.js');
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

    const clearBtn = root.querySelector('button.clear-icon') as HTMLButtonElement | null;
    expect(clearBtn).toBeTruthy();

    clearBtn!.click();
    await page.waitForChanges();

    input = root.querySelector('input.search-bar') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(domSpy).toHaveBeenCalled();
  });
});
