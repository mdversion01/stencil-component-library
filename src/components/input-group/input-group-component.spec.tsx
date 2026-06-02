// File: src/components/input-group/input-group-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { InputGroupComponent } from './input-group-component';

// ---------------------------- small DOM helpers -----------------------------

function q<T extends Element = HTMLElement>(root: ParentNode, sel: string): T | null {
  return root.querySelector(sel) as T | null;
}

function qa<T extends Element = HTMLElement>(root: ParentNode, sel: string): T[] {
  return Array.from(root.querySelectorAll(sel)) as T[];
}

/**
 * Escape for attribute selector value: [id="..."].
 * Minimal escaping for quotes and backslashes so querySelector stays valid.
 */
function escapeAttrValue(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function byId(root: ParentNode, id: string): Element | null {
  return root.querySelector(`[id="${escapeAttrValue(id)}"]`);
}

function splitIds(v: string | null | undefined): string[] {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function expectIdRefsResolve(host: HTMLElement, attrValue: string | null | undefined) {
  const ids = splitIds(attrValue);
  expect(ids.length).toBeGreaterThan(0);
  ids.forEach(id => expect(byId(host, id)).toBeTruthy());
}

// ---------------------------------- specs ----------------------------------

describe('<input-group-component>', () => {
  it('renders (stacked) with default props and keeps aria-describedby resolvable', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `<input-group-component label="Username" input-id="user"></input-group-component>`,
    });

    const root = page.root as HTMLElement;
    expect(root).toBeTruthy();

    const label = q<HTMLLabelElement>(root, 'label')!;
    const input = q<HTMLInputElement>(root, 'input')!;
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    expect(label.textContent || '').toContain('Username');
    expect(input.placeholder).toBe('Username');

    expect(input.getAttribute('aria-labelledby')).toBe('user__label');
    expect(byId(root, 'user__label')).toBeTruthy();

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('user__desc');
    expect(byId(root, 'user__desc')).toBeTruthy();
    expectIdRefsResolve(root, describedBy);

    expect(page.root).toMatchSnapshot();
  });

  it('renders horizontal layout with responsive cols, prepend text and append icon', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Amount"
          input-id="amount"
          form-layout="horizontal"
          label-cols="xs-12 sm-4"
          input-cols="xs-12 sm-8"
          has-prepend
          prepend-text="Total"
          has-append
          append-icon="fa-solid fa-dollar-sign"
        ></input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const input = q<HTMLInputElement>(root, 'input')!;
    expect(input).toBeTruthy();

    expect(input.id).toBe('amount');
    expect(input.getAttribute('aria-labelledby')).toBe('amount__label');
    expect(byId(root, 'amount__label')).toBeTruthy();

    expect(input.getAttribute('aria-describedby')).toContain('amount__desc');
    expect(byId(root, 'amount__desc')).toBeTruthy();

    const row = q<HTMLElement>(root, '.form-group.row.horizontal')!;
    expect(row).toBeTruthy();

    const labelEl = q<HTMLLabelElement>(row, 'label')!;
    expect(labelEl.className).toContain('col-12');
    expect(labelEl.className).toContain('col-sm-4');

    const inputCol = labelEl.nextElementSibling as HTMLElement | null;
    expect(inputCol).toBeTruthy();
    expect((inputCol as HTMLElement).className).toContain('col-12');
    expect((inputCol as HTMLElement).className).toContain('col-sm-8');

    const textAffixes = qa<HTMLElement>(root, '.input-group-text');
    expect(textAffixes.length).toBeGreaterThanOrEqual(2);
    expect(root.textContent || '').toContain('Total');

    const dollarIcon = q(root, '.fa-dollar-sign, .fa-solid.fa-dollar-sign, i[class*="fa-dollar-sign"]');
    expect(dollarIcon).toBeTruthy();

    expect(page.root).toMatchSnapshot();
  });

  it('mixes append button and prepend icon using side-specific props', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Search"
          input-id="q"
          has-prepend
          has-append
          prepend-icon="fa-solid fa-magnifying-glass"
          append-button
          append-text="Go"
          append-button-variant="secondary"
        ></input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;

    const searchIcon = q(root, '.fa-magnifying-glass, .fa-solid.fa-magnifying-glass, i[class*="fa-magnifying-glass"]');
    expect(searchIcon).toBeTruthy();

    const appendButton = q<HTMLButtonElement>(root, '.append-btn button');
    expect(appendButton).toBeTruthy();
    expect(appendButton?.getAttribute('type')).toBe('button');
    expect(appendButton?.className).toContain('btn');
    expect(appendButton?.className).toContain('btn-secondary');
    expect((appendButton?.textContent || '').trim()).toBe('Go');

    const input = q<HTMLInputElement>(root, 'input')!;
    expect(input.getAttribute('aria-describedby')).toContain('q__desc');
    expectIdRefsResolve(root, input.getAttribute('aria-describedby'));

    expect(page.root).toMatchSnapshot();
  });

  it('shows validation message and invalid classes when validation=true', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Email"
          input-id="email"
          validation
          validation-message="Required field."
        ></input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const input = q<HTMLInputElement>(root, 'input')!;
    expect(input).toBeTruthy();

    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const validationEl = byId(root, 'email__validation') as HTMLElement | null;
    expect(validationEl).toBeTruthy();
    expect(validationEl?.textContent || '').toContain('Required field.');
    expect((validationEl?.getAttribute('aria-live') || '').toLowerCase()).toBe('polite');
    expect((validationEl?.getAttribute('aria-atomic') || '').toLowerCase()).toBe('true');

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('email__desc');
    expect(describedBy).toContain('email__validation');
    expectIdRefsResolve(root, describedBy);
  });

  it('disables the native input when disabled=true', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `<input-group-component label="Disabled" input-id="d" disabled></input-group-component>`,
    });

    const input = (page.root as HTMLElement).querySelector('input')!;
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('disables native affix buttons when disabled=true', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Search"
          input-id="search"
          has-prepend
          has-append
          prepend-button
          prepend-text="Go"
          append-button
          append-text="Go"
          disabled
        ></input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const buttons = qa<HTMLButtonElement>(root, '.prepend-btn button, .append-btn button');
    expect(buttons.length).toBe(2);
    buttons.forEach(btn => expect(btn.hasAttribute('disabled')).toBe(true));
  });

  it('emits valueChange and bubbles "change" CustomEvent on input', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `<input-group-component label="City" input-id="city"></input-group-component>`,
    });

    const comp = page.rootInstance as InputGroupComponent;
    const spyStencil = jest.fn();
    const spyDom = jest.fn();

    page.root!.addEventListener('valueChange', spyStencil as any);
    page.root!.addEventListener('change', spyDom as any);

    const input = page.root!.querySelector('input') as HTMLInputElement;
    input.value = 'Berlin';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect((comp as any).value).toBe('Berlin');
    expect(spyStencil).toHaveBeenCalled();
    expect(spyDom).toHaveBeenCalled();
  });

  it('applies form attribute directly when formId is set', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `<input-group-component label="Zip" input-id="zip" form-id="formA"></input-group-component>`,
    });

    const input = (page.root as HTMLElement).querySelector('input')!;
    expect(input.getAttribute('form')).toBe('formA');
  });

  it('inherits formId and formLayout from nearest <form-component> via connectedCallback()', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `<div id="wrap"></div>`,
    });

    const parent = page.doc.createElement('form-component') as any;
    (parent as any).formId = 'outerForm';
    (parent as any).formLayout = 'horizontal';

    const child = page.doc.createElement('input-group-component');
    child.setAttribute('label', 'Phone');
    child.setAttribute('input-id', 'phone');
    parent.appendChild(child);
    page.doc.getElementById('wrap')!.appendChild(parent);

    await page.waitForChanges();

    const input = child.querySelector('input')!;
    expect(input.getAttribute('form')).toBe('outerForm');

    const row = child.querySelector('.row.horizontal');
    expect(row).toBeTruthy();
  });

  it('horizontal with numeric fallback cols and prop-driven text affixes snapshots correctly', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Code"
          input-id="code"
          form-layout="horizontal"
          label-col="3"
          input-col="9"
          has-prepend
          prepend-text="#"
          has-append
          append-text=".js"
        ></input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const input = q<HTMLInputElement>(root, 'input')!;
    expect(input.getAttribute('aria-labelledby')).toBe('code__label');
    expect(input.getAttribute('aria-describedby')).toContain('code__desc');
    expectIdRefsResolve(root, input.getAttribute('aria-describedby'));

    const affixes = qa<HTMLElement>(root, '.input-group-text');
    expect(affixes.length).toBeGreaterThanOrEqual(2);
    expect(root.textContent || '').toContain('#');
    expect(root.textContent || '').toContain('.js');

    expect(page.root).toMatchSnapshot();
  });

  it('renders prepend and append native buttons from props', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Search"
          input-id="search"
          has-prepend
          has-append
          prepend-button
          prepend-text="Go"
          prepend-button-variant="secondary"
          append-button
          append-text="Go"
          append-button-variant="secondary"
        ></input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;

    const prependButton = q<HTMLButtonElement>(root, '.prepend-btn button');
    const appendButton = q<HTMLButtonElement>(root, '.append-btn button');

    expect(prependButton).toBeTruthy();
    expect(appendButton).toBeTruthy();

    expect(prependButton?.className).toContain('btn');
    expect(prependButton?.className).toContain('btn-secondary');
    expect(appendButton?.className).toContain('btn');
    expect(appendButton?.className).toContain('btn-secondary');

    expect((prependButton?.textContent || '').trim()).toBe('Go');
    expect((appendButton?.textContent || '').trim()).toBe('Go');

    expect(page.root).toMatchSnapshot();
  });

  it('renders custom native button type and aria-label from props', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Search"
          input-id="search-advanced"
          has-append
          append-button
          append-text="Run"
          append-button-type="submit"
          append-button-variant="primary"
          append-aria-label="Run search"
        ></input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const appendButton = q<HTMLButtonElement>(root, '.append-btn button');

    expect(appendButton).toBeTruthy();
    expect(appendButton?.getAttribute('type')).toBe('submit');
    expect(appendButton?.className).toContain('btn-primary');
    expect(appendButton?.getAttribute('aria-label')).toBe('Run search');
    expect((appendButton?.textContent || '').trim()).toBe('Run');
  });

  it('does not render empty affix wrappers when side is enabled but no content props are provided', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Empty"
          input-id="empty"
          has-prepend
          has-append
        ></input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    expect(q(root, '.prepend-btn')).toBeNull();
    expect(q(root, '.append-btn')).toBeNull();
    expect(qa(root, '.input-group-text').length).toBe(0);
  });
});
