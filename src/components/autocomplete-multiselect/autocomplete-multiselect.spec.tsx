// src/components/autocomplete-multiselect/autocomplete-multiselect.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteMultiselect } from './autocomplete-multiselect';
import { describe, it, expect, jest } from '@jest/globals';

describe('autocomplete-multiselect', () => {
  it('renders component', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });
    expect(page.root).toBeTruthy();
  });

  it('opens dropdown only when there are matches; stays closed when no input', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="fruit" label="Fruits"></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana', 'Orange'];

    // No input -> closed
    comp.inputValue = '';
    await comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual([]);
    expect((comp as any)['dropdownOpen']).toBe(false);
    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();

    // With matches -> open
    comp.inputValue = 'an'; // Banana, Orange
    await comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Banana', 'Orange']);
    expect((comp as any)['dropdownOpen']).toBe(true);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeTruthy();
  });

  it('stays closed when there is input but no matches', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="fruit" label="Fruits"></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana', 'Orange'];

    comp.inputValue = 'zzz';
    await comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual([]);
    expect((comp as any)['dropdownOpen']).toBe(false);
    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
  });

  it('filters options based on input (case-insensitive)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana', 'Orange'];
    comp.inputValue = 'ap';
    await comp.filterOptions();
    await page.waitForChanges();
    expect(comp.filteredOptions).toEqual(['Apple']);
  });

  it('selects and toggles item correctly', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['One', 'Two'];

    comp.toggleItem('One');
    await page.waitForChanges();
    expect(comp.selectedItems).toContain('One');

    comp.toggleItem('One');
    await page.waitForChanges();
    expect(comp.selectedItems).not.toContain('One');
  });

  it('validate returns false when required and nothing selected', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect required></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    const valid = comp.validate();
    await page.waitForChanges();
    expect(valid).toBe(false);
    expect(comp.validation).toBe(true);
  });

  it('validate returns true when required and item selected', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect required></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.selectedItems = ['One'];
    comp.inputValue = 'dummy';
    await page.waitForChanges();
    const valid = comp.validate();
    expect(valid).toBe(true);
    expect(comp.validation).toBe(false);
  });

  // Enter adds brand-new value (editable=true) and selects it; autoSort default true
  it('adds brand-new value on Enter, upserts into options and selects it (sorted by default)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect editable></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Banana', 'Orange'];
    comp.inputValue = 'Apple';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Apple', 'Banana', 'Orange']);
    expect(comp.selectedItems).toContain('Apple');
    expect(comp.inputValue).toBe('');
  });

  // auto-sort disabled preserves insertion order
  it('preserves insertion order when auto-sort is false', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect editable auto-sort="false"></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Orange', 'Banana'];
    comp.inputValue = 'Apple';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Orange', 'Banana', 'Apple']);
    expect(comp.selectedItems).toContain('Apple');
  });

  // does not add duplicate (case-insensitive)
  it('does not duplicate existing options (case-insensitive) when pressing Enter', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana'];
    comp.inputValue = 'Apple';
    await comp.filterOptions(); // ensure filtered includes 'Apple'
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Apple', 'Banana']);
    expect(comp.selectedItems).toContain('Apple');
  });

  // add-new-on-enter can be disabled
  it('respects add-new-on-enter="false" (does not upsert new values on Enter)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect editable add-new-on-enter="false"></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Banana', 'Orange'];
    comp.inputValue = 'Kiwi';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Banana', 'Orange']);
    expect(comp.selectedItems).not.toContain('Kiwi');
  });

  // addBtn visibility: shown only when editable && addBtn && input has text
  it('shows addBtn only when input has text (editable & add-btn)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect add-btn editable></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;

    // empty -> hidden
    comp.inputValue = '';
    await page.waitForChanges();
    expect(page.root!.querySelector('button.add-btn')).toBeNull();

    // text -> visible
    comp.inputValue = 'Cherry';
    await page.waitForChanges();
    expect(page.root!.querySelector('button.add-btn')).toBeTruthy();

    // disabled -> still rendered but disabled
    page.root!.setAttribute('disabled', '');
    await page.waitForChanges();
    const btn = page.root!.querySelector('button.add-btn')!;
    expect(btn).toHaveAttribute('disabled');
  });

  // add button upserts + selects (and emits itemSelect)
  it('emits itemSelect and upserts + selects on addBtn click', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect add-btn editable></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Banana', 'Orange'];

    const spy = jest.fn();
    page.root!.addEventListener('itemSelect', spy);

    comp.inputValue = 'Cherry';
    await page.waitForChanges();

    const btn = page.root!.querySelector('button.add-btn') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Cherry' }));
    expect(comp.options).toEqual(['Banana', 'Cherry', 'Orange']);
    expect(comp.selectedItems).toContain('Cherry');
    expect(comp.inputValue).toBe('');
  });

  it('handles arrow key navigation and enter selection', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['One', 'Two', 'Three'];
    comp.inputValue = 'T';
    await comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    // Enter should pick the first filtered option ('Two')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.selectedItems).toContain('Two');
    expect(comp.inputValue).toBe('');
  });

  it('aria-activedescendant updates on focus change', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect options='["A", "B"]' input-id="letters"></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.inputValue = 'B';
    await comp.filterOptions();
    comp.focusedOptionIndex = 0;
    await page.waitForChanges();
    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-activedescendant')).toContain('letters-option-0');
  });

  it('scrolls focused item into view', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;

    comp.options = ['One', 'Two', 'Three'];
    comp.inputValue = 'o';
    await comp.filterOptions();
    comp.focusedOptionIndex = -1;
    await page.waitForChanges();

    const originalQS = HTMLElement.prototype.querySelectorAll;
    const fakeItems = ['One', 'Two', 'Three'].map(() => {
      const li = document.createElement('li') as any;
      li.scrollIntoView = jest.fn();
      return li;
    });
    (HTMLElement.prototype.querySelectorAll as any) = jest.fn(() => fakeItems as any);

    try {
      jest.useFakeTimers();
      await comp.navigateOptions(1);
      jest.runAllTimers();
      expect(fakeItems[0].scrollIntoView as any).toHaveBeenCalled();
    } finally {
      HTMLElement.prototype.querySelectorAll = originalQS as any;
      jest.useRealTimers();
    }
  });

  it('renders badges with class and styles', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect badge-variant="success" badge-shape="rounded" badge-inline-styles="color: white;"></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.selectedItems = ['Item'];
    await page.waitForChanges();

    const badge = page.root!.querySelector('.badge')!;
    expect(badge.classList.contains('text-bg-success')).toBe(true);
    expect(badge.classList.contains('rounded')).toBe(true);
    expect(badge.getAttribute('style')!).toContain('color: white');
  });

  it('emits multiSelectChange on selection', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });

    const spy = jest.fn();
    page.root!.addEventListener('multiSelectChange', spy);
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['A'];
    comp.toggleItem('A');
    await page.waitForChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('clears input and items with clearAll()', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.selectedItems = ['A'];
    comp.inputValue = 'text';
    comp.clearAll();
    await page.waitForChanges();

    expect(comp.selectedItems.length).toBe(0);
    expect(comp.inputValue).toBe('');
  });

  it('closes dropdown when clicking outside (closeDropdown path)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;

    // Open the dropdown
    comp.options = ['a', 'b'];
    comp.inputValue = 'a';
    await comp.filterOptions();
    await page.waitForChanges();
    expect((comp as any)['dropdownOpen']).toBe(true);

    // Simulate a click outside the component
    const fakeEvent = {
      composedPath: () => [document.body],
    } as unknown as MouseEvent;

    (comp as any).handleClickOutside(fakeEvent);
    await page.waitForChanges();

    expect(comp.isFocused).toBe(false);
    expect((comp as any)['dropdownOpen']).toBe(false);
  });

  it('disables input and add & clear buttons when disabled is true', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect disabled add-btn editable></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;

    comp.inputValue = 'foo';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    const addBtn = page.root!.querySelector('button.add-btn')!;
    const clearBtn = page.root!.querySelector('button.clear-btn')!;

    expect(input).toHaveAttribute('disabled');
    expect(addBtn).toHaveAttribute('disabled');
    expect(clearBtn).toHaveAttribute('disabled');
  });

  it('sets correct ARIA attributes when required and invalid', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect required validation-message="Required field."></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.validate();
    await page.waitForChanges();
    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-required')).toBe('true');
    const group = page.root!.querySelector('.input-group')!;
    expect(group.classList.contains('is-invalid')).toBe(true);
  });

  it('emits clear event when cleared', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    const clearSpy = jest.fn();
    page.root!.addEventListener('clear', clearSpy);

    comp.selectedItems = ['A'];
    comp.inputValue = 'test';
    comp.clearAll();
    await page.waitForChanges();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('renders error message when error is true', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect error error-message="Something went wrong"></autocomplete-multiselect>`,
    });
    await page.waitForChanges();
    const msg = page.root!.querySelector('.error-message')!;
    expect(msg.textContent).toContain('Something went wrong');
  });

  it('parses kebab-case badge styles to camelCase', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect badge-inline-styles="font-size: 14px;"></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.selectedItems = ['Styled'];
    await page.waitForChanges();
    const badge = page.root!.querySelector('.badge')!;
    expect(badge.getAttribute('style')!).toContain('font-size: 14px');
  });

  it('uses inputId and label for accessibility linkage', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="fruit-input" label="Fruits" arialabelled-by="label-id"></autocomplete-multiselect>`,
    });

    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-controls')).toContain('fruitInput-listbox');
    expect(input.getAttribute('aria-labelledby')).toBe('label-id');
  });

  // ---- New: optionsChange hook + setOptions/getOptions API ----

  it('emits optionsChange on add (reason="add") and delete (reason="delete")', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect editable></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Banana'];

    const events: any[] = [];
    page.root!.addEventListener('optionsChange', (e: any) => events.push(e.detail));

    // Add via Enter
    comp.inputValue = 'Apple';
    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    // Delete via internal method (simpler than UI path in unit test)
    (comp as any).deleteUserOption('Apple');
    await page.waitForChanges();

    // Validate events
    const addEvt = events.find(e => e?.reason === 'add');
    const delEvt = events.find(e => e?.reason === 'delete');

    expect(addEvt).toBeTruthy();
    expect(addEvt.value).toBe('Apple');
    expect(Array.isArray(addEvt.options)).toBe(true);

    expect(delEvt).toBeTruthy();
    expect(delEvt.value).toBe('Apple');
    expect(Array.isArray(delEvt.options)).toBe(true);
  });

  it('setOptions replaces options and emits optionsChange with reason="replace"; getOptions returns a copy', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;

    const spy = jest.fn();
    page.root!.addEventListener('optionsChange', spy);

    await comp.setOptions(['X', 'Y']);
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          reason: 'replace',
          options: ['X', 'Y'],
        }),
      }),
    );

    const got = await comp.getOptions();
    expect(got).toEqual(['X', 'Y']);

    // ensure it’s a copy
    got.push('Z');
    const got2 = await comp.getOptions();
    expect(got2).toEqual(['X', 'Y']);
  });

  it('renders full DOM output snapshot for given props', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect
               badge-variant="danger"
               required
               label="Tags"
               input-id="tag-input"
               badge-shape="rounded"
               badge-inline-styles="background-color: red; color: white;"
               error
               error-message="Invalid input"
               validation-message="Required field."
               add-btn
               editable
             ></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['One', 'Two'];
    comp.selectedItems = ['Two'];
    comp.inputValue = 'T';
    await comp.filterOptions();
    comp.validation = true;
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
