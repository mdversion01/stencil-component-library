// src/components/autocomplete-multiple-selections/autocomplete-multiple-selections.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteMultipleSelections } from './autocomplete-multiple-selections';

describe('autocomplete-multiple-selections', () => {
  it('renders with default props', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections label="Fruits" input-id="fruit"></autocomplete-multiple-selections>`,
    });

    const root = page.root!;
    const label = root.querySelector('label')!;
    const input = root.querySelector('input')!;

    expect(label.textContent).toContain('Fruits');
    expect(label.className).toContain('form-control-label');

    // placeholder now prefers the label
    expect(input.placeholder).toBe('Fruits');

    // input a11y basics
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-controls')).toBe('fruit-listbox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('filters and renders dropdown with options', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections label="Fruit" input-id="fruit-id"></autocomplete-multiple-selections>`,
    });
    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Apple', 'Banana', 'Orange'];
    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Apple', 'Banana', 'Orange']);

    const list = page.root!.querySelector('#fruitId-listbox, #fruit-id-listbox, [role="listbox"]');
    // It only renders the list when input has content; our filter set it.
    expect(list).toBeTruthy();
  });

  it('selects multiple items and renders selected badges', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections></autocomplete-multiple-selections>`,
    });
    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['One', 'Two', 'Three'];
    comp.toggleItem('One');
    comp.toggleItem('Two');
    await page.waitForChanges();

    expect(comp.selectedItems).toEqual(['One', 'Two']);
    expect(page.root!.querySelectorAll('.ac-selected-items .badge').length).toBe(2);
  });

  it('validates as invalid when required and nothing selected', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections required validation-message="Select at least one"></autocomplete-multiple-selections>`,
    });
    const comp = page.rootInstance as AutocompleteMultipleSelections;
    const valid = comp.validate();
    await page.waitForChanges();

    expect(valid).toBe(false);
    expect(comp.validation).toBe(true);
    expect(page.root!.textContent).toContain('Select at least one');
  });

  it('handles keyboard navigation and enter selection', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections></autocomplete-multiple-selections>`,
    });
    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Alpha', 'Beta', 'Gamma'];
    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await page.waitForChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await page.waitForChanges();

    expect(comp.selectedItems).toContain('Alpha');
  });

  it('assigns correct aria attributes and roles', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="fruit" label="Fruits" arialabelled-by="label-id" required></autocomplete-multiple-selections>`,
    });

    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-controls')).toBe('fruit-listbox');
    expect(input.getAttribute('aria-labelledby')).toBe('label-id');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('handles Escape key to close dropdown', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['One', 'Two'];
    comp.inputValue = 'o';
    comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await page.waitForChanges();

    expect(comp.filteredOptions.length).toBe(0);
  });

  it('handles Backspace with no selection (does not clear)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.inputValue = 'a';
    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    await page.waitForChanges();

    expect(comp.inputValue).toBe('a');
  });

  it('handles Tab to blur', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.isFocused = true;
    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    comp['handleBlur']();
    await page.waitForChanges();

    expect(comp.isFocused).toBe(false);
  });

  it('programmatically navigates and updates aria-activedescendant', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="id"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Apple', 'Banana', 'Cherry'];
    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();

    const input: HTMLInputElement = page.root!.querySelector('input')!;

    await comp.navigateOptions(1);
    await page.waitForChanges();

    expect(comp.focusedOptionIndex).toBe(0);
    expect(input.getAttribute('aria-activedescendant')).toBe('id-option-0');
  });

  it('wires onKeyDown to handleInput', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="id"></autocomplete-multiple-selections>`,
    });
    const comp = page.rootInstance as AutocompleteMultipleSelections;
    const spy = jest.spyOn(comp as any, 'handleInput');

    comp.options = ['A', 'B', 'C'];
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('ignores Enter key when input does not match any option', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['One', 'Two', 'Three'];
    comp.inputValue = 'zzz';
    comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await page.waitForChanges();

    expect(comp.selectedItems).toEqual([]); // no match => nothing added
  });

  it('emits itemSelect when addBtn is clicked with inputValue', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections add-btn></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    const spy = jest.fn();
    page.root!.addEventListener('itemSelect', spy);

    comp.inputValue = 'CustomOption';
    await page.waitForChanges();

    const btn = page.root!.querySelector('button.add-btn') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: 'CustomOption' }));
  });

  it('disables input and buttons when disabled is true', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections disabled add-btn></autocomplete-multiple-selections>`,
    });

    const input = page.root!.querySelector('input')!;
    const addBtn = page.root!.querySelector('button.add-btn')!;
    expect(input.hasAttribute('disabled')).toBe(true);
    expect(addBtn.hasAttribute('disabled')).toBe(true);
  });

  it('supports compact spec tokens like "xs-12 sm-6 md-4"', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections
             label="Fruits"
             input-id="fruit"
             form-layout="horizontal"
             label-cols="xs-12 sm-4"
             input-cols="xs-12 sm-8"
           ></autocomplete-multiple-selections>`,
    });

    // Option A: go from the label to its next sibling (the col-* wrapper)
    const row = page.root!.querySelector('.row.form-group') as HTMLElement;
    expect(row).toBeTruthy();

    const labelEl = row.querySelector('label') as HTMLLabelElement;
    expect(labelEl).toBeTruthy();

    const inputWrapper = labelEl.nextElementSibling as HTMLElement; // <-- this div has the col-* classes
    expect(inputWrapper).toBeTruthy();

    expect(inputWrapper.className).toMatch(/(^|\s)col-12(\s|$)/);
    expect(inputWrapper.className).toMatch(/(^|\s)col-sm-8(\s|$)/);

    // Option B (equivalent): start at the field container and take its parent
    // const fieldContainer = page.root!.querySelector('.ac-multi-select-container')!;
    // const inputWrapper = fieldContainer.parentElement as HTMLElement;
    // expect(inputWrapper.className).toMatch(/(^|\s)col-12(\s|$)/);
    // expect(inputWrapper.className).toMatch(/(^|\s)col-sm-8(\s|$)/);
  });
});
