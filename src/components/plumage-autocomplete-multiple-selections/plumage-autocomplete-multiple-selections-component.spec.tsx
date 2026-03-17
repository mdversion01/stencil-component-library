// src/components/plumage-autocomplete-multiple-selects/plumage-autocomplete-multiple-selections-component.spec.tsx
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PlumageAutocompleteMultipleSelectionsComponent } from './plumage-autocomplete-multiple-selections-component';

const sleep = (ms = 0) => new Promise((res) => setTimeout(res, ms));

describe('plumage-autocomplete-multiple-selections-component', () => {
  /**
   * Setup helper
   * - Use `attrs` to set host attributes (kebab-case in HTML)
   * - Only set *mutable* instance fields directly (e.g. `options`)
   */
  async function setup(attrs?: { preserveInputOnSelect?: boolean; inputId?: string; labelHidden?: boolean; label?: string }) {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultipleSelectionsComponent],
      template: () => (
        <plumage-autocomplete-multiple-selections-component
          input-id={attrs?.inputId ?? 'pets'}
          label={attrs?.label ?? 'Pets'}
          placeholder="Type to search..."
          label-hidden={attrs?.labelHidden ? true : undefined}
        />
      ),
    });

    // Set host attributes instead of mutating non-mutable @Prop()s
    if (attrs?.preserveInputOnSelect === true) {
      page.root!.setAttribute('preserve-input-on-select', '');
    }

    // Assign only mutable props/fields on the instance
    const inst = page.rootInstance as PlumageAutocompleteMultipleSelectionsComponent;
    inst.options = ['Ant', 'Ape', 'Bear', 'Bee', 'Cat', 'Dog', 'Eagle'];

    await page.waitForChanges();
    return page;
  }

  it('renders and matches snapshot (initial)', async () => {
    const page = await setup();
    expect(page.root).toBeTruthy();
    expect(page.root).toMatchSnapshot('initial-render');
  });

  it('is an ARIA combobox wired to a listbox (508 essentials)', async () => {
    const page = await setup({ inputId: 'pets' });

    const input = page.root!.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();

    // Combobox essentials
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
    expect(input.getAttribute('aria-expanded')).toBe('false');

    // Stable IDs and controls wiring
    expect(input.id).toBe('pets');
    expect(input.getAttribute('aria-controls')).toBe('pets-listbox');

    // listbox exists in DOM even when closed (rendered inside dropdown; our component renders listbox only when open)
    // So here we just assert the id string is consistent; listbox existence is tested when open.
    expect(input.getAttribute('aria-activedescendant')).toBeNull();

    // no errors/validation by default
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('provides an accessible name via aria-label when label is hidden', async () => {
    const page = await setup({ labelHidden: true, label: 'Pets' });
    const input = page.root!.querySelector('input') as HTMLInputElement;

    // When labelHidden and no aria-labelledby override, aria-label should be present
    expect(input.getAttribute('aria-label')).toBeTruthy();
    expect((input.getAttribute('aria-label') || '').toLowerCase()).toContain('pets');
  });

  it('opens dropdown on typing and filters options (snapshot) + listbox semantics', async () => {
    const page = await setup();
    const input = page.root!.querySelector('input') as HTMLInputElement;

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const dropdown = page.root!.querySelector('.autocomplete-dropdown');
    expect(dropdown).not.toBeNull();

    // listbox + multiselect
    const listbox = page.root!.querySelector('#pets-listbox') as HTMLElement;
    expect(listbox).toBeTruthy();
    expect(listbox.getAttribute('role')).toBe('listbox');
    expect(listbox.getAttribute('aria-multiselectable')).toBe('true');

    const items = page.root!.querySelectorAll('.autocomplete-dropdown-item');
    expect(items.length).toBeGreaterThan(0);

    expect(page.root).toMatchSnapshot('after-typing-a-dropdown-open');
  });

  it('updates aria-activedescendant to a role="option" element when navigating', async () => {
    const page = await setup();
    const input = page.root!.querySelector('input') as HTMLInputElement;

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    // ArrowDown enters list and focuses first option
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();

    expect(input.getAttribute('aria-expanded')).toBe('true');

    const activeId = input.getAttribute('aria-activedescendant');
    expect(activeId).toBe('pets-opt-0');

    const activeEl = page.root!.querySelector(`#${activeId}`) as HTMLElement;
    expect(activeEl).toBeTruthy();
    expect(activeEl.getAttribute('role')).toBe('option');
  });

  it('keeps dropdown open after selecting an item via mouse (mousedown + click)', async () => {
    const page = await setup();

    const input = page.root!.querySelector('input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const firstBtn = page.root!.querySelector('.autocomplete-dropdown-item .option-btn') as HTMLButtonElement;
    expect(firstBtn).toBeTruthy();

    firstBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await page.waitForChanges();

    firstBtn.click();
    await page.waitForChanges();
    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.autocomplete-dropdown')).not.toBeNull();

    const badges = page.root!.querySelectorAll('.ac-selected-items .badge');
    expect(badges.length).toBe(1);

    const selectedText = (badges[0].querySelector('span')?.textContent || '').trim();
    const listItems = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item span')).map((n) => (n.textContent || '').trim());
    expect(listItems).not.toContain(selectedText);

    expect(page.root).toMatchSnapshot('after-selection-dropdown-stays-open');
  });

  it('announces selection changes in the live region', async () => {
    const page = await setup();

    const input = page.root!.querySelector('input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const firstBtn = page.root!.querySelector('.autocomplete-dropdown-item .option-btn') as HTMLButtonElement;
    firstBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await page.waitForChanges();
    firstBtn.click();
    await sleep(0);
    await page.waitForChanges();

    const live = page.root!.querySelector('#pets-live') as HTMLElement;
    expect(live).toBeTruthy();
    expect(live.getAttribute('aria-live')).toBe('polite');
    expect(live.getAttribute('aria-atomic')).toBe('true');

    const msg = (live.textContent || '').trim().toLowerCase();
    expect(msg).toContain('added');
  });

  it('closes dropdown on outside click', async () => {
    const page = await setup();

    const input = page.root!.querySelector('input') as HTMLInputElement;
    input.value = 'e';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root!.querySelector('.autocomplete-dropdown')).not.toBeNull();

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
    expect(page.root).toMatchSnapshot('after-outside-click-dropdown-closed');
  });

  it('typing after a selection cancels the keep-open mode and re-filters', async () => {
    const page = await setup();

    const input = page.root!.querySelector('input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const firstBtn = page.root!.querySelector('.autocomplete-dropdown-item .option-btn') as HTMLButtonElement;
    firstBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await page.waitForChanges();
    firstBtn.click();
    await sleep(0);
    await page.waitForChanges();

    // Type again -> cancels keep-open and re-filters
    input.value = 'be';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const items = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item span')).map((n) => (n.textContent || '').toLowerCase());
    expect(items.every((txt) => txt.includes('be'))).toBe(true);

    expect(page.root).toMatchSnapshot('after-typing-again-cancels-keep-open-and-refilters');
  });

  it('sets aria-invalid=true when required and validate() fails', async () => {
    const page = await setup();

    page.root!.setAttribute('required', '');
    await page.waitForChanges();

    const inst = page.rootInstance as PlumageAutocompleteMultipleSelectionsComponent;
    const ok = inst.validate();
    await page.waitForChanges();

    expect(ok).toBe(false);

    const input = page.root!.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
