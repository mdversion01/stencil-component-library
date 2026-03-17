// src/components/plumage-autocomplete-multiselect/plumage-autocomplete-multiselect-component.spec.ts
import { newSpecPage } from '@stencil/core/testing';
import { PlumageAutocompleteMultiselectComponent } from './plumage-autocomplete-multiselect-component';

function getInput(root: HTMLElement): HTMLInputElement {
  const input = root.querySelector('input.form-control') as HTMLInputElement | null;
  if (!input) throw new Error('Input not found');
  return input;
}

async function typeIn(page: any, root: HTMLElement, value: string) {
  const input = getInput(root);
  input.value = value;
  // Avoid InputEvent (not defined in JSDOM)
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await page.waitForChanges();
}

async function keydown(page: any, root: HTMLElement, key: string) {
  const input = getInput(root);
  input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
  await page.waitForChanges();
}

describe('plumage-autocomplete-multiselect-component', () => {
  test('renders (stacked) and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `<plumage-autocomplete-multiselect-component
                input-id="Fruits"
                label="Fruits"
              ></plumage-autocomplete-multiselect-component>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  test('filters, navigates, selects via keyboard; badges render; dropdown closes', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `<plumage-autocomplete-multiselect-component
              input-id="Fruit"
              label="Fruit"
            ></plumage-autocomplete-multiselect-component>`,
    });

    page.root!.options = ['Apple', 'Apricot', 'Banana', 'Grape'];
    await page.waitForChanges();

    await typeIn(page, page.root!, 'ap');

    const list = page.root!.querySelector('[role="listbox"]') as HTMLElement | null;
    expect(list).toBeTruthy();
    expect(list!.textContent).toContain('Apple');
    expect(list!.textContent).toContain('Apricot');
    expect(list!.textContent).not.toContain('Banana');

    // ArrowDown enters list and sets aria-activedescendant to role=option node id
    await keydown(page, page.root!, 'ArrowDown');
    const input = getInput(page.root!);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe('fruit-opt-0');

    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    const dropdown = page.root!.querySelector('.autocomplete-dropdown');
    expect(dropdown).toBeNull();

    const selected = page.root!.querySelector('.ac-selected-items')!;
    expect(selected.textContent).toContain('Apple');

    expect(getInput(page.root!).value).toBe('');

    await typeIn(page, page.root!, 'gr');
    await keydown(page, page.root!, 'ArrowDown');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    expect(page.root!.querySelector('.ac-selected-items')!.textContent).toContain('Grape');

    expect(page.root).toMatchSnapshot();
  });

  test('Enter on typed text adds a badge even when not editable; does not mutate options', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `<plumage-autocomplete-multiselect-component
              input-id="Tags"
              label="Tags"
            ></plumage-autocomplete-multiselect-component>`,
    });

    // editable defaults to false
    const initialOptions = ['Apple', 'Apricot', 'Banana'];
    page.root!.options = initialOptions.slice();
    await page.waitForChanges();

    await typeIn(page, page.root!, 'My Custom Tag');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    expect(page.root!.querySelector('.ac-selected-items')!.textContent).toContain('My Custom Tag');

    // should NOT persist into options when editable=false
    const inst = page.rootInstance as PlumageAutocompleteMultiselectComponent;
    expect(inst.options).toEqual(initialOptions);
  });

  test('Enter on typed text adds badge AND persists into options when editable + addNewOnEnter=true', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `<plumage-autocomplete-multiselect-component
              input-id="Tags2"
              label="Tags2"
              editable
              add-new-on-enter
            ></plumage-autocomplete-multiselect-component>`,
    });

    const inst = page.rootInstance as PlumageAutocompleteMultiselectComponent;
    inst.options = ['One', 'Two'];
    await page.waitForChanges();

    await typeIn(page, page.root!, 'Three');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    expect(page.root!.querySelector('.ac-selected-items')!.textContent).toContain('Three');
    expect(inst.options.some((o) => o.toLowerCase() === 'three')).toBe(true);
  });

  test('required validation mirror toggles validationState and ARIA', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `<plumage-autocomplete-multiselect-component
                input-id="Pets"
                label="Pets"
                required
                validation-message="Please select or type 3+ chars"
              ></plumage-autocomplete-multiselect-component>`,
    });

    const input = getInput(page.root!);
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root!.querySelector('.b-underline')!.classList.contains('invalid')).toBe(true);
    expect(getInput(page.root!).classList.contains('is-invalid')).toBe(true);

    const ariadesc = getInput(page.root!).getAttribute('aria-describedby') || '';
    expect(ariadesc).toContain('pets-validation');

    // aria-invalid should reflect invalid state
    expect(getInput(page.root!).getAttribute('aria-invalid')).toBe('true');

    await typeIn(page, page.root!, 'cat');
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root!.querySelector('.b-underline')!.classList.contains('invalid')).toBe(false);
    expect(getInput(page.root!).classList.contains('is-invalid')).toBe(false);
    expect((getInput(page.root!).getAttribute('aria-describedby') || '')).not.toContain('validation');
    expect(getInput(page.root!).getAttribute('aria-invalid')).toBe('false');
  });

  test('clear button clears badges + input and emits change', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `<plumage-autocomplete-multiselect-component
                input-id="Tags"
                label="Tags"
              ></plumage-autocomplete-multiselect-component>`,
    });

    const changeSpy = jest.fn();
    page.root!.addEventListener('change', changeSpy);

    page.root!.options = ['Red', 'Green', 'Blue'];
    await page.waitForChanges();

    await typeIn(page, page.root!, 're');
    await keydown(page, page.root!, 'ArrowDown');
    await keydown(page, page.root!, 'Enter');

    await typeIn(page, page.root!, 'bl');
    await keydown(page, page.root!, 'ArrowDown');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    const clearBtn = page.root!.querySelector('.clear-btn') as HTMLButtonElement | null;
    expect(clearBtn).toBeTruthy();
    clearBtn!.click();
    await page.waitForChanges();

    expect(page.root!.querySelector('.ac-selected-items')!.textContent).toBe('');
    expect(getInput(page.root!).value).toBe('');
    expect(changeSpy).toHaveBeenCalled();
  });

  test('listbox has aria-multiselectable=true when open', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `<plumage-autocomplete-multiselect-component
              input-id="Colors"
              label="Colors"
            ></plumage-autocomplete-multiselect-component>`,
    });

    page.root!.options = ['Red', 'Green', 'Blue'];
    await page.waitForChanges();

    await typeIn(page, page.root!, 'r');

    const list = page.root!.querySelector('[role="listbox"]') as HTMLElement | null;
    expect(list).toBeTruthy();
    expect(list!.getAttribute('aria-multiselectable')).toBe('true');
  });
});
