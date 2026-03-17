// src/components/input-group/input-group-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { InputGroupComponent } from './input-group-component';

// ---------------------------- small DOM helpers -----------------------------

function q<T extends Element = HTMLElement>(root: ParentNode, sel: string): T | null {
  return root.querySelector(sel) as T | null;
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

    // Stacked label has no trailing colon
    expect(label.textContent || '').toContain('Username');

    // Placeholder falls back to label when placeholder not provided
    expect(input.placeholder).toBe('Username');

    // A11y: input is labelled by the label element id
    expect(input.getAttribute('aria-labelledby')).toBe('user__label');
    expect(byId(root, 'user__label')).toBeTruthy();

    // A11y: aria-describedby always includes help text (__desc) and resolves
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toContain('user__desc');
    expect(byId(root, 'user__desc')).toBeTruthy();
    expectIdRefsResolve(root, describedBy);

    expect(page.root).toMatchSnapshot();
  });

  it('renders horizontal layout with responsive cols, prepend slot and append icon', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
      <input-group-component
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
      </input-group-component>
    `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const input = q<HTMLInputElement>(root, 'input')!;
    expect(input).toBeTruthy();

    // ID strategy: uses input-id as base
    expect(input.id).toBe('amount');

    // A11y: labelled by label id
    expect(input.getAttribute('aria-labelledby')).toBe('amount__label');
    expect(byId(root, 'amount__label')).toBeTruthy();

    // A11y: described by always includes help text
    expect(input.getAttribute('aria-describedby')).toContain('amount__desc');
    expect(byId(root, 'amount__desc')).toBeTruthy();

    // Horizontal layout: label + input col classes applied
    const row = q<HTMLElement>(root, '.form-group.row.horizontal')!;
    expect(row).toBeTruthy();

    const labelEl = q<HTMLLabelElement>(row, 'label')!;
    expect(labelEl.className).toContain('col-12');
    expect(labelEl.className).toContain('col-sm-4');

    // input column wrapper is the next element sibling of the label in horizontal render
    const inputCol = labelEl.nextElementSibling as HTMLElement | null;
    expect(inputCol).toBeTruthy();
    expect((inputCol as HTMLElement).className).toContain('col-12');
    expect((inputCol as HTMLElement).className).toContain('col-sm-8');

    // Accept either a wrapper OR the slotted node itself (depending on implementation)
    const prependWrapper = q(root, '.input-group-prepend, .pl-input-group-prepend, .prepend, [data-prepend]');
    const prependSlotEl = q(root, '[slot="prepend"]');
    expect(!!(prependWrapper || prependSlotEl)).toBe(true);

    // Icon may appear anywhere on the append side; just ensure it exists
    const dollarIcon = q(root, '.fa-dollar-sign, .fa-solid.fa-dollar-sign, i[class*="fa-dollar-sign"]');
    expect(dollarIcon).toBeTruthy();

    expect(page.root).toMatchSnapshot();
  });

  it('mixes slot on append and icon on prepend using side-specific props', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Search"
          input-id="q"
          prepend
          append
          prepend-icon="fa-solid fa-magnifying-glass"
          other-content
        >
          <button slot="append" type="button" class="btn btn-outline-secondary">Go</button>
        </input-group-component>
      `,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;

    // Prepend icon (don’t over-constrain the container class)
    const searchIcon = q(root, '.fa-magnifying-glass, .fa-solid.fa-magnifying-glass, i[class*="fa-magnifying-glass"]');
    expect(searchIcon).toBeTruthy();

    // Append slot content should be projected
    const appendButton = q(root, 'button[slot="append"]');
    expect(appendButton).toBeTruthy();

    // A11y: describedby includes help id and resolves
    const input = q<HTMLInputElement>(root, 'input')!;
    expect(input.getAttribute('aria-describedby')).toContain('q__desc');
    expectIdRefsResolve(root, input.getAttribute('aria-describedby'));

    expect(page.root).toMatchSnapshot();
  });

  it('shows validation message and invalid classes when validation=true (uses __validation id, live region, describedby includes it)', async () => {
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

    // Since value is empty, meetsTypingThreshold=false -> invalid
    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    // Validation element should exist and be referenced by aria-describedby
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

  it('horizontal with numeric fallback cols (labelCol/inputCol) snapshots correctly', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `
        <input-group-component
          label="Code"
          input-id="code"
          form-layout="horizontal"
          label-col="3"
          input-col="9"
          prepend
          append
        >
          <span slot="prepend">#</span>
          <span slot="append">.js</span>
        </input-group-component>
      `,
    });

    await page.waitForChanges();

    // Sanity: a11y ids exist
    const root = page.root as HTMLElement;
    const input = q<HTMLInputElement>(root, 'input')!;
    expect(input.getAttribute('aria-labelledby')).toBe('code__label');
    expect(input.getAttribute('aria-describedby')).toContain('code__desc');
    expectIdRefsResolve(root, input.getAttribute('aria-describedby'));

    expect(page.root).toMatchSnapshot();
  });
});
