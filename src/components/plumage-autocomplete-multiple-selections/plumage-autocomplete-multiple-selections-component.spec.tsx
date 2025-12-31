import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PlumageAutocompleteMultipleSelectionsComponent } from './plumage-autocomplete-multiple-selections-component';

const sleep = (ms = 0) => new Promise(res => setTimeout(res, ms));

describe('plumage-autocomplete-multiple-selections-component', () => {
  /**
   * Setup helper
   * - Use `attrs` to set host attributes (kebab-case in HTML)
   * - Only set *mutable* instance fields directly (e.g. `options`)
   */
  async function setup(attrs?: { preserveInputOnSelect?: boolean }) {
    const page = await newSpecPage({
      components: [PlumageAutocompleteMultipleSelectionsComponent],
      template: () => (
        <plumage-autocomplete-multiple-selections-component
          input-id="pets"
          label="Pets"
          placeholder="Type to search..."
        />
      ),
    });

    // Set host attributes instead of mutating non-mutable @Prop()s
    if (attrs?.preserveInputOnSelect === true) {
      page.root.setAttribute('preserve-input-on-select', '');
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

  it('opens dropdown on typing and filters options (snapshot)', async () => {
    const page = await setup();
    const input = page.root!.querySelector('input') as HTMLInputElement;
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const dropdown = page.root!.querySelector('.autocomplete-dropdown');
    expect(dropdown).not.toBeNull();

    const items = page.root!.querySelectorAll('.autocomplete-dropdown-item');
    expect(items.length).toBeGreaterThan(0);

    expect(page.root).toMatchSnapshot('after-typing-a-dropdown-open');
  });

  it('keeps dropdown open after selecting an item via mouse (mousedown + click)', async () => {
    // NOTE: default is false, so no need to pass preserveInputOnSelect:false
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
    const listItems = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item span')).map(n => (n.textContent || '').trim());
    expect(listItems).not.toContain(selectedText);

    expect(page.root).toMatchSnapshot('after-selection-dropdown-stays-open');
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
    // Default is false; if you ever need TRUE, use host attribute:
    // const page = await setup({ preserveInputOnSelect: true });
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

    const items = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item span')).map(n => (n.textContent || '').toLowerCase());
    expect(items.every(txt => txt.includes('be'))).toBe(true);

    expect(page.root).toMatchSnapshot('after-typing-again-cancels-keep-open-and-refilters');
  });
});
