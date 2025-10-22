// src/components/autocomplete-multiple-selections/autocomplete-multiple-selections.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteMultipleSelections } from './autocomplete-multiple-selections';

// If your Jest config doesn't already include the Stencil serializer, ensure:
// preset: '@stencil/core/testing',
// snapshotSerializers: ['@stencil/core/testing'],

describe('<autocomplete-multiple-selections>', () => {
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

  it('opens dropdown only when there are matches (and renders listbox)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections label="Fruit" input-id="fruit"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Apple', 'Banana', 'Orange'];

    // No query => closed
    comp.inputValue = '';
    comp.filterOptions();
    await page.waitForChanges();
    expect(comp.filteredOptions).toEqual([]);
    expect(comp['dropdownOpen']).toBe(false);
    expect(page.root!.querySelector('[role="listbox"]')).toBeNull();

    // With matches => open
    comp.inputValue = 'an'; // Banana, Orange
    comp.filterOptions();
    await page.waitForChanges();
    expect(comp.filteredOptions).toEqual(['Banana', 'Orange']);
    expect(comp['dropdownOpen']).toBe(true);

    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(page.root!.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it('selects multiple items and keeps dropdown open with remaining options', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="tags"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Alpha', 'Beta', 'Gamma'];
    comp.inputValue = 'a'; // matches all three
    comp.filterOptions();
    await page.waitForChanges();

    // Select "Alpha"
    (comp as any).toggleItem('Alpha');
    await page.waitForChanges();
    expect(comp.selectedItems).toEqual(['Alpha']);

    // Dropdown should still be open, filtered by the last query ('a') but excluding selected
    expect(comp['dropdownOpen']).toBe(true);
    expect(comp.filteredOptions).toEqual(['Beta', 'Gamma']);

    // Select "Gamma"
    (comp as any).toggleItem('Gamma');
    await page.waitForChanges();
    expect(comp.selectedItems).toEqual(['Alpha', 'Gamma']);

    // Still open, showing remaining option(s)
    expect(comp['dropdownOpen']).toBe(true);
    expect(comp.filteredOptions).toEqual(['Beta']);
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

  it('handles keyboard navigation and Enter toggling selection', async () => {
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
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.selectedItems.length).toBe(1);
    expect(['Alpha', 'Beta', 'Gamma']).toContain(comp.selectedItems[0]);
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

  it('Escape closes the dropdown and clears first-typed char fix', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['One', 'Two'];
    comp.inputValue = 'o';
    comp.filterOptions();
    await page.waitForChanges();
    expect(comp['dropdownOpen']).toBe(true);

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp['dropdownOpen']).toBe(false);
    expect(comp.filteredOptions.length).toBe(0);
    expect(comp.inputValue).toBe(''); // first-char persistence fix
  });

  it('programmatic navigateOptions updates aria-activedescendant', async () => {
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

  it('disables input and add/clear buttons when disabled', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections disabled add-btn></autocomplete-multiple-selections>`,
    });

    // give it some state so clear button is rendered
    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.inputValue = 'x';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    const addBtn = page.root!.querySelector('button.add-btn')!;
    const clearBtn = page.root!.querySelector('button.clear-btn')!;
    expect(input).toHaveAttribute('disabled');
    expect(addBtn).toHaveAttribute('disabled');
    expect(clearBtn).toHaveAttribute('disabled');
  });

  it('supports compact responsive col specs', async () => {
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

    const row = page.root!.querySelector('.row.form-group') as HTMLElement;
    const labelEl = row.querySelector('label') as HTMLLabelElement;
    const inputWrapper = labelEl.nextElementSibling as HTMLElement;

    expect(inputWrapper.className).toMatch(/(^|\s)col-12(\s|$)/);
    expect(inputWrapper.className).toMatch(/(^|\s)col-sm-8(\s|$)/);
  });

  // ---------------- SNAPSHOTS ----------------

  it('matches snapshot (default render)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections
               label="Tags"
               input-id="tags"
             ></autocomplete-multiple-selections>`,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('matches snapshot (open with matches and two selections made)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections
               label="Tags"
               input-id="tags"
               add-btn
             ></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Alpha', 'Beta', 'Gamma', 'Delta'];
    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();

    // Select two items programmatically (runtime can access "private")
    (comp as any).toggleItem('Alpha');
    (comp as any).toggleItem('Gamma');
    await page.waitForChanges();

    // Should still be open and show remaining matches
    expect(comp['dropdownOpen']).toBe(true);
    expect(comp.selectedItems).toEqual(['Alpha', 'Gamma']);

    expect(page.root).toMatchSnapshot();
  });
});
