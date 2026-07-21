// src/components/autocomplete-multiselect/autocomplete-multiselect.spec.tsx
import { h } from '@stencil/core';
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

  it('renders with default props and basic a11y wiring', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="fruit" label="Fruits"></autocomplete-multiselect>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input[role="combobox"]') as HTMLInputElement;

    expect(root).toBeTruthy();
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    expect(label.textContent || '').toContain('Fruits');
    expect(label.className).toContain('form-control-label');

    expect(input.getAttribute('id')).toBe('fruit');
    expect(input.getAttribute('aria-controls')).toBe('fruit-listbox');
    expect(input.getAttribute('aria-expanded')).toBe('false');

    expect(label.getAttribute('id')).toBe('fruit-label');

    const labelFor = label.getAttribute('for') || label.getAttribute('htmlfor') || (label as any).htmlFor || (label as any).htmlfor;
    expect(labelFor).toBe('fruit');

    expect(input.getAttribute('aria-labelledby')).toBe('fruit-label');
    expect(input.getAttribute('aria-label')).toBeNull();
    expect(input.getAttribute('aria-required')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
    expect(input.getAttribute('aria-readonly')).toBeNull();
    expect(input.readOnly).toBe(false);
  });

  it('opens dropdown only when there are matches; stays closed when no input', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="fruit" label="Fruits"></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana', 'Orange'];

    comp.inputValue = '';
    await comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual([]);
    expect((comp as any).dropdownOpen).toBe(false);
    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();

    comp.inputValue = 'an';
    await comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Banana', 'Orange']);
    expect((comp as any).dropdownOpen).toBe(true);
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
    expect((comp as any).dropdownOpen).toBe(false);
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

  it('sanitizes typed input on input event (strips tags, control chars; collapses whitespace; caps length)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect raw-input-name="raw"></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    const inputEl = page.root!.querySelector('input') as HTMLInputElement;

    inputEl.value = '  <b>  A \t B </b> \n  C  ';
    inputEl.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.inputValue).toBe('A B C');

    const hiddenRaw = page.root!.querySelector('input[type="hidden"][name="raw"]') as HTMLInputElement;
    expect(hiddenRaw).toBeTruthy();
    expect(hiddenRaw.value).toBe('A B C');
  });

  it('selects an exact existing option on Enter and clears the typed input', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana', 'Orange'];
    comp.inputValue = 'Apple';
    await comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Apple', 'Banana', 'Orange']);
    expect(comp.selectedItems).toContain('Apple');
    expect(comp.inputValue).toBe('');
  });

  it('sanitizes value before upsert when adding new option on Enter', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect editable></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Banana', 'Orange'];

    const inputEl = page.root!.querySelector('input') as HTMLInputElement;
    inputEl.value = '  <b>  Kiwi\u0007 </b> ';
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();

    expect(comp.options).toContain('Kiwi');
    expect(comp.options.find(o => /</.test(o))).toBeUndefined();
  });

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

  it('does not duplicate existing options (case-insensitive) when pressing Enter', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana'];
    comp.inputValue = 'Apple';
    await comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Apple', 'Banana']);
    expect(comp.selectedItems).toContain('Apple');
  });

  it('respects add-new-on-enter="false" (does not upsert new values on Enter; may still select ephemerally)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect editable add-new-on-enter="false" input-id="ane" label="ANE"></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Banana', 'Orange'];

    const input = page.root!.querySelector('input') as HTMLInputElement;

    input.value = 'Kiwi';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await page.waitForChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Banana', 'Orange']);
    expect(comp.selectedItems).toContain('Kiwi');
  });

  it('shows addBtn only when input has text (editable & add-btn)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect add-btn editable></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;

    comp.inputValue = '';
    await page.waitForChanges();
    expect(page.root!.querySelector('button.add-btn')).toBeNull();

    comp.inputValue = 'Cherry';
    await page.waitForChanges();
    expect(page.root!.querySelector('button.add-btn')).toBeTruthy();
  });

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
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.selectedItems).toContain('Two');
    expect(comp.inputValue).toBe('');
  });

  it('aria-activedescendant updates after ArrowDown to enter list & focus first item', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="letters" label="Letters"></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;

    comp.options = ['A', 'B'];
    comp.inputValue = 'b';
    await comp.filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(input.getAttribute('aria-activedescendant')).toBe('letters-option-0');
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

    const originalRAF = (global as any).requestAnimationFrame;
    (global as any).requestAnimationFrame = (cb: Function) => {
      cb();
      return 1;
    };

    try {
      await comp.navigateOptions(1);
      await page.waitForChanges();
      expect(fakeItems[0].scrollIntoView as any).toHaveBeenCalled();
    } finally {
      HTMLElement.prototype.querySelectorAll = originalQS as any;
      (global as any).requestAnimationFrame = originalRAF;
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
    (comp as any).toggleItem('A');
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
    (comp as any).clearAll();
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

    comp.options = ['a', 'b'];
    comp.inputValue = 'a';
    await comp.filterOptions();
    await page.waitForChanges();
    expect((comp as any).dropdownOpen).toBe(true);

    const fakeEvent = {
      composedPath: () => [document.body],
    } as unknown as MouseEvent;

    (comp as any).handleClickOutside(fakeEvent);
    await page.waitForChanges();

    expect(comp.isFocused).toBe(false);
    expect((comp as any).dropdownOpen).toBe(false);
  });

  it('disables input and add button when disabled is true; clear button is not rendered', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect disabled add-btn editable></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;

    comp.inputValue = 'foo';
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    const addBtn = page.root!.querySelector('button.add-btn')!;

    expect(input).toHaveAttribute('disabled');
    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(addBtn).toBeNull();
    expect(page.root!.querySelector('button.clear-btn')).toBeNull();
  });

  it('sets correct ARIA attributes when required and invalid', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect required validation-message="Required field."></autocomplete-multiselect>`,
    });
    const comp = page.rootInstance as AutocompleteMultiselect;
    (comp as any).validate?.();
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
    (comp as any).clearAll();
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

  it('dedupes ids when two instances use the same input-id (unique IDs used in aria and labels)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      template: () => (
        <div>
          <autocomplete-multiselect input-id="dup" label="First"></autocomplete-multiselect>
          <autocomplete-multiselect input-id="dup" label="Second"></autocomplete-multiselect>
        </div>
      ),
    });

    const comps = page.doc.querySelectorAll('autocomplete-multiselect');
    expect(comps.length).toBe(2);

    const firstInput = comps[0].querySelector('input')!;
    const secondInput = comps[1].querySelector('input')!;

    expect(firstInput.getAttribute('id')).toBeTruthy();
    expect(secondInput.getAttribute('id')).toBeTruthy();
    expect(firstInput.getAttribute('id')).not.toBe(secondInput.getAttribute('id'));

    const firstControls = firstInput.getAttribute('aria-controls');
    const secondControls = secondInput.getAttribute('aria-controls');
    expect(firstControls).toBeTruthy();
    expect(secondControls).toBeTruthy();
    expect(firstControls).not.toBe(secondControls);
  });

  it('readOnly: sets input readonly + aria-readonly and hides add/clear buttons', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="tags" label="Tags" read-only add-btn editable></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.inputValue = 'Cherry';
    comp.selectedItems = ['Apple'];
    await page.waitForChanges();

    const input = page.root!.querySelector('input[role="combobox"]') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(input.classList.contains('read-only')).toBe(true);

    expect(page.root!.querySelector('button.add-btn')).toBeNull();
    expect(page.root!.querySelector('button.clear-btn')).toBeNull();
  });

  it('readOnly: keeps selected badges visible but hides remove buttons', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="tags" label="Tags" read-only></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.selectedItems = ['Apple', 'Orange'];
    await page.waitForChanges();

    const badges = page.root!.querySelectorAll('.badge');
    expect(badges.length).toBe(2);
    expect(page.root!.querySelector('.remove-btn')).toBeNull();
  });

  it('readOnly: does not open dropdown when filtering finds matches', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="fruit" label="Fruits" read-only></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana', 'Orange'];
    comp.inputValue = 'an';
    await comp.filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual([]);
    expect((comp as any).dropdownOpen).toBe(false);

    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
  });

  it('readOnly: keyboard navigation does not focus options or open dropdown', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="letters" label="Letters" read-only></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['A', 'B'];
    comp.inputValue = 'b';
    (comp as any).filteredOptions = ['B'];
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect((comp as any).dropdownOpen).toBe(false);
    expect(comp.focusedOptionIndex).toBe(-1);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('readOnly: programmatic toggle/remove/clear paths are ignored', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="ro" label="RO" read-only></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Apple', 'Banana'];
    comp.selectedItems = ['Apple'];
    comp.inputValue = 'Banana';
    await page.waitForChanges();

    (comp as any).toggleItem('Banana');
    await page.waitForChanges();
    expect(comp.selectedItems).toEqual(['Apple']);

    (comp as any).removeItemAt(0);
    await page.waitForChanges();
    expect(comp.selectedItems).toEqual(['Apple']);

    (comp as any).clearAll();
    await page.waitForChanges();
    expect(comp.selectedItems).toEqual(['Apple']);
    expect(comp.inputValue).toBe('Banana');
  });

  it('readOnly: add button click path does nothing when button is absent', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect input-id="ro-add" label="RO Add" read-only add-btn editable></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.options = ['Banana'];
    comp.inputValue = 'Cherry';
    await page.waitForChanges();

    expect(page.root!.querySelector('button.add-btn')).toBeNull();
    expect(comp.options).toEqual(['Banana']);
    expect(comp.selectedItems).toEqual([]);
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

  it('matches snapshot (readOnly render)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteMultiselect],
      html: `<autocomplete-multiselect
               label="Tags"
               input-id="tag-readonly"
               read-only
             ></autocomplete-multiselect>`,
    });

    const comp = page.rootInstance as AutocompleteMultiselect;
    comp.selectedItems = ['Apple', 'Orange'];
    comp.inputValue = 'Locked';
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });
});
