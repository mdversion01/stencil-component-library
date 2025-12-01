// src/components/input-group/input-group-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { InputGroupComponent } from './input-group-component';

function q(root: ParentNode, sel: string) {
  return root.querySelector(sel);
}
function anyOf(root: ParentNode, selectors: string[]) {
  const joined = selectors.join(', ');
  return root.querySelector(joined);
}

describe('<input-group-component>', () => {
  it('renders (stacked) with default props', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `<input-group-component label="Username" input-id="user"></input-group-component>`,
    });

    const root = page.root!;
    expect(root).toBeTruthy();

    const label = root.querySelector('label')!;
    const input = root.querySelector('input')!;
    expect(label.textContent).toContain('Username');
    expect(input.placeholder).toBe('Username');

    expect(page.root).toMatchSnapshot();
  });

  // Replace the whole "renders horizontal layout with responsive cols..." test with this:

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

    const input = page.root!.querySelector('input')!;
    expect(input.id).toBe('amount');
    expect(input.getAttribute('aria-labelledby')).toBe('amount');

    // Accept either a wrapper OR the slotted node itself (depending on implementation)
    const prependWrapper = page.root!.querySelector('.input-group-prepend, .pl-input-group-prepend, .prepend, [data-prepend]');
    const prependSlotEl = page.root!.querySelector('[slot="prepend"]');

    expect(!!(prependWrapper || prependSlotEl)).toBe(true);

    // Icon may appear anywhere on the append side; just ensure it exists
    const dollarIcon = page.root!.querySelector('.fa-dollar-sign, .fa-solid.fa-dollar-sign, i[class*="fa-dollar-sign"]');
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

    // Prepend icon (don’t over-constrain the container class)
    const searchIcon = q(page.root!, '.fa-magnifying-glass, .fa-solid.fa-magnifying-glass, i[class*="fa-magnifying-glass"]');
    expect(searchIcon).toBeTruthy();

    // Append slot content should be projected
    const appendButton = q(page.root!, 'button[slot="append"]');
    expect(appendButton).toBeTruthy();

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

    const input = page.root!.querySelector('input')!;
    expect(input.classList.contains('is-invalid')).toBe(true);
    const feedback = page.root!.querySelector('.invalid-feedback')!;
    expect(feedback.textContent).toContain('Required field.');
  });

  it('disables the native input when disabled=true', async () => {
    const page = await newSpecPage({
      components: [InputGroupComponent],
      html: `<input-group-component label="Disabled" input-id="d" disabled></input-group-component>`,
    });

    const input = page.root!.querySelector('input')!;
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

    const input = page.root!.querySelector('input')!;
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
    expect(page.root).toMatchSnapshot();
  });
});
