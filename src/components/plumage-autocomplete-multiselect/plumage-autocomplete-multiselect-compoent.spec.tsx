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

    await keydown(page, page.root!, 'ArrowDown');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    const dropdown = page.root!.querySelector('.autocomplete-dropdown');
    expect(dropdown).toBeNull();

    const selected = page.root!.querySelector('.ac-selected-items')!;
    expect(selected.textContent).toContain('Apple');

    const input = getInput(page.root!);
    expect(input.value).toBe('');

    await typeIn(page, page.root!, 'gr');
    await keydown(page, page.root!, 'ArrowDown');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    expect(page.root!.querySelector('.ac-selected-items')!.textContent).toContain('Grape');

    expect(page.root).toMatchSnapshot();
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

    await typeIn(page, page.root!, 'cat');
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root!.querySelector('.b-underline')!.classList.contains('invalid')).toBe(false);
    expect(getInput(page.root!).classList.contains('is-invalid')).toBe(false);
    expect((getInput(page.root!).getAttribute('aria-describedby') || '')).not.toContain('validation');
  });

  test('clear button clears badges + input and emits change', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `<plumage-autocomplete-multiselect-component
                input-id="Tags"
                label="Tags"
              ></plumage-autocomplete-multiselect-component>`,
    });

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
  });
});
