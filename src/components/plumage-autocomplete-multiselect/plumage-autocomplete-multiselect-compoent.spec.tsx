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
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await page.waitForChanges();
}

async function keydown(page: any, root: HTMLElement, key: string) {
  const input = getInput(root);
  input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
  await page.waitForChanges();
}

function getDropdownItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll('.autocomplete-dropdown-item')) as HTMLElement[];
}

describe('plumage-autocomplete-multiselect-component', () => {
  test('renders (stacked) and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `
        <plumage-autocomplete-multiselect-component
          input-id="Fruits"
          label="Fruits"
        ></plumage-autocomplete-multiselect-component>
      `,
    });

    expect(page.root).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  test('filters, navigates, selects via keyboard; badges render; dropdown closes', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `
        <plumage-autocomplete-multiselect-component
          input-id="Fruit"
          label="Fruit"
        ></plumage-autocomplete-multiselect-component>
      `,
    });

    const inst = page.rootInstance as PlumageAutocompleteMultiselectComponent;
    inst.options = ['Apple', 'Apricot', 'Banana', 'Grape'];
    await page.waitForChanges();

    await typeIn(page, page.root!, 'ap');

    let input = getInput(page.root!);
    expect(input.value).toBe('ap');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-controls')).toBe('fruit-listbox');

    let list = page.root!.querySelector('#fruit-listbox') as HTMLElement | null;
    expect(list).toBeTruthy();
    expect(list!.getAttribute('role')).toBe('listbox');
    expect(list!.getAttribute('aria-multiselectable')).toBe('true');

    let items = getDropdownItems(page.root!);
    expect(items.length).toBe(3);
    expect(items[0].textContent || '').toContain('Apple');
    expect(items[1].textContent || '').toContain('Apricot');
    expect(items.some(item => (item.textContent || '').includes('Banana'))).toBe(false);

    await keydown(page, page.root!, 'ArrowDown');

    input = getInput(page.root!);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe('fruit-opt-0');

    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
    expect(page.root!.querySelector('.ac-selected-items')!.textContent).toContain('Apple');
    expect(getInput(page.root!).value).toBe('');

    await typeIn(page, page.root!, 'gr');

    items = getDropdownItems(page.root!);
    expect(items.length).toBe(1);
    expect(items[0].textContent || '').toContain('Grape');

    await keydown(page, page.root!, 'ArrowDown');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    const selected = page.root!.querySelector('.ac-selected-items')!;
    expect(selected.textContent).toContain('Apple');
    expect(selected.textContent).toContain('Grape');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
    expect(getInput(page.root!).value).toBe('');

    const clearBtn = page.root!.querySelector('.clear-btn') as HTMLButtonElement | null;
    expect(clearBtn).toBeTruthy();
    expect(clearBtn!.getAttribute('type')).toBe('button');

    expect(page.root).toMatchSnapshot();
  });

  test('Enter on typed text adds a badge even when not editable; does not mutate options', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `
        <plumage-autocomplete-multiselect-component
          input-id="Tags"
          label="Tags"
        ></plumage-autocomplete-multiselect-component>
      `,
    });

    const inst = page.rootInstance as PlumageAutocompleteMultiselectComponent;
    const initialOptions = ['Apple', 'Apricot', 'Banana'];
    inst.options = initialOptions.slice();
    await page.waitForChanges();

    await typeIn(page, page.root!, 'My Custom Tag');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    expect(page.root!.querySelector('.ac-selected-items')!.textContent).toContain('My Custom Tag');
    expect(inst.options).toEqual(initialOptions);
  });

  test('Enter on typed text adds badge AND persists into options when editable + addNewOnEnter=true', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `
        <plumage-autocomplete-multiselect-component
          input-id="Tags2"
          label="Tags2"
          editable
          add-new-on-enter
        ></plumage-autocomplete-multiselect-component>
      `,
    });

    const inst = page.rootInstance as PlumageAutocompleteMultiselectComponent;
    inst.options = ['One', 'Two'];
    await page.waitForChanges();

    await typeIn(page, page.root!, 'Three');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    expect(page.root!.querySelector('.ac-selected-items')!.textContent).toContain('Three');
    expect(inst.options.some(o => o.toLowerCase() === 'three')).toBe(true);
  });

  test('required validation mirror toggles validationState and ARIA', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultiselectComponent],
      html: `
        <plumage-autocomplete-multiselect-component
          input-id="Pets"
          label="Pets"
          required
          validation-message="Please select or type 3+ chars"
        ></plumage-autocomplete-multiselect-component>
      `,
    });

    let input = getInput(page.root!);
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root!.querySelector('.b-underline')!.classList.contains('invalid')).toBe(true);
    expect(getInput(page.root!).classList.contains('is-invalid')).toBe(true);
    expect(getInput(page.root!).getAttribute('aria-invalid')).toBe('true');

    const describedBy = getInput(page.root!).getAttribute('aria-describedby') || '';
    expect(describedBy).toContain('pets-validation');

    await typeIn(page, page.root!, 'cat');

    input = getInput(page.root!);
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
      html: `
        <plumage-autocomplete-multiselect-component
          input-id="Tags"
          label="Tags"
        ></plumage-autocomplete-multiselect-component>
      `,
    });

    const changeSpy = jest.fn();
    page.root!.addEventListener('change', changeSpy);

    const inst = page.rootInstance as PlumageAutocompleteMultiselectComponent;
    inst.options = ['Red', 'Green', 'Blue'];
    await page.waitForChanges();

    await typeIn(page, page.root!, 're');
    await keydown(page, page.root!, 'ArrowDown');
    await keydown(page, page.root!, 'Enter');

    await typeIn(page, page.root!, 'bl');
    await keydown(page, page.root!, 'ArrowDown');
    await keydown(page, page.root!, 'Enter');
    await page.waitForChanges();

    const selectedBefore = page.root!.querySelector('.ac-selected-items')!;
    expect(selectedBefore.textContent).toContain('Red');
    expect(selectedBefore.textContent).toContain('Blue');

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
      html: `
        <plumage-autocomplete-multiselect-component
          input-id="Colors"
          label="Colors"
        ></plumage-autocomplete-multiselect-component>
      `,
    });

    const inst = page.rootInstance as PlumageAutocompleteMultiselectComponent;
    inst.options = ['Red', 'Green', 'Blue'];
    await page.waitForChanges();

    await typeIn(page, page.root!, 'r');

    const list = page.root!.querySelector('[role="listbox"]') as HTMLElement | null;
    expect(list).toBeTruthy();
    expect(list!.getAttribute('aria-multiselectable')).toBe('true');
  });
});
