// src/components/autocomplete-multiple-selections/autocomplete-multiple-selections.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteMultipleSelections } from './autocomplete-multiple-selections';

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

    // placeholder prefers the label
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
    expect((comp as any)['dropdownOpen']).toBe(false);
    expect(page.root!.querySelector('[role="listbox"]')).toBeNull();

    // With matches => open
    comp.inputValue = 'an'; // Banana, Orange
    comp.filterOptions();
    await page.waitForChanges();
    expect(comp.filteredOptions).toEqual(['Banana', 'Orange']);
    expect((comp as any)['dropdownOpen']).toBe(true);

    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(page.root!.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it('selects multiple items (dropdown closes or stays open per API; this component keeps it open on Enter path)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="tags"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Alpha', 'Beta', 'Gamma'];

    // Select "Alpha" via direct toggle (this closes dropdown)
    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();
    (comp as any).toggleItem('Alpha');
    await page.waitForChanges();

    expect(comp.selectedItems).toEqual(['Alpha']);
    expect((comp as any)['dropdownOpen']).toBe(false);

    // Re-open for next pick and select "Gamma"
    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();
    (comp as any).toggleItem('Gamma');
    await page.waitForChanges();

    expect(comp.selectedItems).toEqual(['Alpha', 'Gamma']);
    expect((comp as any)['dropdownOpen']).toBe(false);
  });

  it('sanitizes typed input (strips tags & control chars; collapses whitespace; caps to 512) and mirrors rawInputName hidden field', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections raw-input-name="raw"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    const input = page.root!.querySelector('input') as HTMLInputElement;

    input.value = '  <b>  A \t B </b> \n  C  ';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.inputValue).toBe('A B C');
    const hiddenRaw = page.root!.querySelector('input[type="hidden"][name="raw"]') as HTMLInputElement;
    expect(hiddenRaw).toBeTruthy();
    expect(hiddenRaw.value).toBe('A B C');

    // length cap
    input.value = 'x'.repeat(600);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();
    expect(comp.inputValue.length).toBe(512);
  });

  it('renders option text safely as text nodes (no HTML injection)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="safe" label="Safe"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['<b>Bold</b>', '<img src=x onerror=alert(1)>', 'Okay'];
    comp.inputValue = '<'; // match first two
    comp.filterOptions();
    await page.waitForChanges();

    const list = page.root!.querySelector('#safe-listbox')!;
    // Should NOT render real <b> or <img> tags inside options
    expect(list.querySelector('b')).toBeNull();
    expect(list.querySelector('img')).toBeNull();

    const texts = Array.from(list.querySelectorAll('li span')).map(n => n.textContent);
    expect(texts).toEqual(['<b>Bold</b>', '<img src=x onerror=alert(1)>']);
  });

  it('clicking the input closes an open dropdown without clearing input or losing focus', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="clicker"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['One', 'Two', 'Three'];
    comp.inputValue = 'o';
    comp.filterOptions();
    await page.waitForChanges();

    expect((comp as any).dropdownOpen).toBe(true);

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect((comp as any).dropdownOpen).toBe(false);
    expect(comp.inputValue).toBe('o');
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

  it('handles keyboard navigation: ArrowDown enters list and Enter toggles selection (keeps dropdown open on Enter path)', async () => {
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
    // Enter path uses keepDropdownOpen: true
    expect((comp as any).dropdownOpen).toBe(true);
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

  it('Escape closes the dropdown and clears the input (clearInput=true path)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['One', 'Two'];
    comp.inputValue = 'o';
    comp.filterOptions();
    await page.waitForChanges();
    expect((comp as any)['dropdownOpen']).toBe(true);

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect((comp as any)['dropdownOpen']).toBe(false);
    expect(comp.filteredOptions.length).toBe(0);
    expect(comp.inputValue).toBe('');
  });

  it('aria-activedescendant updates after ArrowDown (listEntered=true, focus first option)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="id"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Apple', 'Banana', 'Cherry'];
    comp.inputValue = 'a'; // Apple, Banana
    comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    // Use ArrowDown to enter the list; programmatic navigateOptions doesn't flip listEntered
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.focusedOptionIndex).toBe(0);
    expect(input.getAttribute('aria-activedescendant')).toBe('id-option-0');
  });

  it('disables input and add/clear buttons when disabled', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections disabled add-btn editable></autocomplete-multiple-selections>`,
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

  // ---------- Enter adds even when editable=false (ephemeral), upserts only when editable=true ----------

  it('adds a new value on Enter when there is no match (editable=true) and sorts when autoSort=true', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="words" editable></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Orange', 'banana'];
    await page.waitForChanges();

    comp.inputValue = 'Apple';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.selectedItems).toContain('Apple');
    expect(comp.options).toEqual(['Apple', 'banana', 'Orange']);
  });

  it('respects autoSort=false (no resort after insert) when editable', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="nosort" auto-sort="false" editable></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Orange', 'Banana'];
    await page.waitForChanges();

    comp.inputValue = 'Apple';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Orange', 'Banana', 'Apple']);
    expect(comp.selectedItems).toContain('Apple');
  });

  it('does not create a duplicate when the typed value already exists (case-insensitive)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="dedupe"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Apple', 'Banana'];
    await page.waitForChanges();

    // Type existing option in different case and press Enter
    comp.inputValue = 'apple';
    comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Apple', 'Banana']);
    expect(comp.selectedItems.some(s => s.toLowerCase() === 'apple')).toBe(true);
  });

  it('Add button upserts new value and selects it (and sorts by default) when editable', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections add-btn editable input-id="adder"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Beta'];
    comp.inputValue = 'Alpha';
    await page.waitForChanges();

    const addBtn = page.root!.querySelector('button.add-btn') as HTMLButtonElement;
    expect(addBtn).toBeTruthy(); // visible because editable && input has text
    addBtn.click();
    await page.waitForChanges();

    expect(comp.selectedItems).toContain('Alpha');
    expect(comp.options).toEqual(['Alpha', 'Beta']);
  });

  it('when editable=false: Add button is hidden; Enter selects ephemerally but DOES NOT mutate options', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections add-btn input-id="noedit"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Beta'];
    await page.waitForChanges();

    // Add button should not render
    expect(page.root!.querySelector('button.add-btn')).toBeNull();

    // Enter on unknown value should NOT insert into options, but should select ephemerally
    comp.inputValue = 'Alpha';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Beta']);              // unchanged
    expect(comp.selectedItems).toEqual(['Alpha']);       // ephemeral selection
  });

  // ---------- NEW: keyboard virtual focus to delete and delete action ----------

  it('ArrowRight moves virtual focus to delete button (for user-added option) and Enter deletes it', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="id" editable></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;

    comp.options = ['Predef'];
    await page.waitForChanges();

    // Add a new user option (this also selects it)
    comp.inputValue = 'Zeta';
    await page.waitForChanges();
    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    // Unselect so it can appear in filteredOptions
    (comp as any).toggleItem('Zeta');
    await page.waitForChanges();

    // Now filter so Zeta is visible (and user-added)
    comp.inputValue = 'z';
    comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Zeta']);
    expect(comp.focusedOptionIndex).toBe(-1); // not set until nav

    // Enter list and focus first item
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();
    expect(input.getAttribute('aria-activedescendant')).toBe('id-option-0');

    // Move virtual focus to delete
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true }));
    await page.waitForChanges();
    expect(input.getAttribute('aria-activedescendant')).toBe('id-delete-0');

    // Press Enter to delete
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options.includes('Zeta')).toBe(false);
    expect(comp.filteredOptions.includes('Zeta')).toBe(false);
  });

  // ---------- Blur / outside click behavior ----------

  it('tabbing to Add button does NOT clear the typed input; clicking Add then inserts & selects it', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections add-btn editable input-id="keep"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Beta'];
    comp.inputValue = 'Alpha';
    await page.waitForChanges();

    const input = page.root!.querySelector('input') as HTMLInputElement;
    const addBtn = page.root!.querySelector('button.add-btn') as HTMLButtonElement;

    // Simulate tab from input -> Add button
    input.focus?.();
    addBtn.focus?.();

    // Make the blur timeout run immediately AND force activeElement to be the Add button.
    const stSpy = jest.spyOn(window, 'setTimeout').mockImplementation((fn: any) => {
      try { fn(); } catch {}
      return 0 as unknown as number;
    });

    const originalActive = Object.getOwnPropertyDescriptor(document, 'activeElement');
    Object.defineProperty(document, 'activeElement', { configurable: true, get: () => addBtn });

    try {
      (comp as any).handleBlur();
      await page.waitForChanges();

      expect(comp.inputValue).toBe('Alpha');

      addBtn.click();
      await page.waitForChanges();

      expect(comp.selectedItems).toContain('Alpha');
      expect(comp.options).toEqual(['Alpha', 'Beta']);
    } finally {
      stSpy.mockRestore();
      if (originalActive) Object.defineProperty(document, 'activeElement', originalActive);
      else delete (document as any).activeElement;
    }
  });

  it('clicking outside closes the dropdown and (by default) does NOT clear the input', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultipleSelections],
      html: `<autocomplete-multiple-selections input-id="outside"></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['One', 'Two'];
    comp.inputValue = 'o';
    comp.filterOptions();
    await page.waitForChanges();

    expect((comp as any)['dropdownOpen']).toBe(true);
    expect(comp.inputValue).toBe('o');

    // Simulate an outside click: composedPath does NOT include the component root
    const fakeEvent = { composedPath: () => [document.body] } as any as MouseEvent;
    (comp as any).handleClickOutside(fakeEvent);
    await page.waitForChanges();

    expect((comp as any)['dropdownOpen']).toBe(false);
    expect(comp.filteredOptions.length).toBe(0);
    expect(comp.inputValue).toBe('o'); // default behavior now preserves input
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
               editable
             ></autocomplete-multiple-selections>`,
    });

    const comp = page.rootInstance as AutocompleteMultipleSelections;
    comp.options = ['Alpha', 'Beta', 'Gamma', 'Delta'];

    // Make two selections (dropdown closes each time for toggleItem)
    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();
    (comp as any).toggleItem('Alpha');
    await page.waitForChanges();

    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();
    (comp as any).toggleItem('Gamma');
    await page.waitForChanges();

    expect(comp.selectedItems).toEqual(['Alpha', 'Gamma']);

    // Re-open to capture "open with matches" snapshot
    comp.inputValue = 'a';
    comp.filterOptions();
    await page.waitForChanges();
    expect((comp as any)['dropdownOpen']).toBe(true);

    expect(page.root).toMatchSnapshot();
  });
});
