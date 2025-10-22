// src/components/autocomplete-multiselect/autocomplete-multiselect.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteMultiselect } from './autocomplete-multiselect';

// Import Jest globals
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
    expect(comp['dropdownOpen']).toBe(false);
    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();

    // With matches -> open
    comp.inputValue = 'an'; // Banana, Orange
    await comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Banana', 'Orange']);
    expect(comp['dropdownOpen']).toBe(true);
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
    expect(comp['dropdownOpen']).toBe(false);
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

  it('emits itemSelect on addBtn click', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect add-btn></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    const spy = jest.fn();
    page.root!.addEventListener('itemSelect', spy);
    comp.inputValue = 'NewTag';
    await page.waitForChanges();
    const btn = page.root!.querySelector('button.add-btn') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: 'NewTag' }));
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
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.selectedItems).toContain('Two');
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
      const li = document.createElement('li');
      li.scrollIntoView = jest.fn();
      return li;
    });
    (HTMLElement.prototype.querySelectorAll as any) = jest.fn(() => fakeItems as any);

    try {
      jest.useFakeTimers();
      comp.navigateOptions(1);
      jest.runAllTimers();
      expect((fakeItems[0].scrollIntoView as any)).toHaveBeenCalled();
    } finally {
      HTMLElement.prototype.querySelectorAll = originalQS;
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

  it('handles blur correctly (closes dropdown via closeDropdown path)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    // simulate open state, then blur:
    comp.inputValue = 'a';
    comp.options = ['a'];
    await comp.filterOptions();
    await page.waitForChanges();
    expect(comp['dropdownOpen']).toBe(true);

    comp['handleBlur']();
    await page.waitForChanges();

    // allow setTimeout(0) pathway to run:
    await new Promise(r => setTimeout(r, 1));

    expect(comp.isFocused).toBe(false);
    expect(comp['dropdownOpen']).toBe(false);
  });

  it('disables input and add & clear buttons when disabled is true', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect disabled add-btn></autocomplete-multiselect>`,
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
    expect(input.classList.contains('is-invalid')).toBe(true);
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
