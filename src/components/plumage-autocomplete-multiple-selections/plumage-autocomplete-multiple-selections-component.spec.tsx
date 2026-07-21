// src/components/plumage-autocomplete-multiple-selects/plumage-autocomplete-multiple-selections-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { PlumageAutocompleteMultipleSelectionsComponent } from './plumage-autocomplete-multiple-selections-component';

const sleep = (ms = 0) => new Promise((res) => setTimeout(res, ms));

function getInput(root: HTMLElement): HTMLInputElement {
  const input = root.querySelector('input.form-control') as HTMLInputElement | null;
  if (!input) throw new Error('input.form-control not found');
  return input;
}

function getDropdown(root: HTMLElement): HTMLElement | null {
  return root.querySelector('.autocomplete-dropdown') as HTMLElement | null;
}

function getListbox(root: HTMLElement): HTMLElement | null {
  return root.querySelector('[role="listbox"]') as HTMLElement | null;
}

function getBadgeTexts(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('.ac-selected-items .badge span')).map((n) => (n.textContent || '').trim());
}

function getOptionTexts(root: HTMLElement): string[] {
  return Array.from(root.querySelectorAll('.autocomplete-dropdown-item .option-btn span')).map((n) => (n.textContent || '').trim());
}

describe('plumage-autocomplete-multiple-selections-component', () => {
  /**
   * Setup helper
   * - host attributes are applied through HTML/kebab-case
   * - mutable props are assigned on the instance after creation
   */
  async function setup(attrs?: {
    preserveInputOnSelect?: boolean;
    inputId?: string;
    labelHidden?: boolean;
    label?: string;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
  }) {
    const html = `
      <plumage-autocomplete-multiple-selections-component
        input-id="${attrs?.inputId ?? 'pets'}"
        label="${attrs?.label ?? 'Pets'}"
        placeholder="Type to search..."
        ${attrs?.labelHidden ? 'label-hidden' : ''}
        ${attrs?.preserveInputOnSelect ? 'preserve-input-on-select' : ''}
        ${attrs?.required ? 'required' : ''}
        ${attrs?.readOnly ? 'read-only' : ''}
        ${attrs?.disabled ? 'disabled' : ''}
      ></plumage-autocomplete-multiple-selections-component>
    `;

    const page = await newSpecPage({
      components: [PlumageAutocompleteMultipleSelectionsComponent],
      html,
    });

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
    const input = getInput(page.root!);

    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
    expect(input.getAttribute('aria-expanded')).toBe('false');

    expect(input.id).toBe('pets');
    expect(input.getAttribute('aria-controls')).toBe('pets-listbox');
    expect(input.getAttribute('aria-activedescendant')).toBeNull();

    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('aria-disabled')).toBe('false');
    expect(input.getAttribute('aria-readonly')).toBeNull();
  });

  it('provides an accessible name via aria-label when label is hidden', async () => {
    const page = await setup({ labelHidden: true, label: 'Pets' });
    const input = getInput(page.root!);

    expect(input.getAttribute('aria-label')).toBeTruthy();
    expect((input.getAttribute('aria-label') || '').toLowerCase()).toContain('pets');
  });

  it('opens dropdown on typing and filters options + listbox semantics', async () => {
    const page = await setup();
    const input = getInput(page.root!);

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const dropdown = getDropdown(page.root!);
    expect(dropdown).not.toBeNull();

    const listbox = page.root!.querySelector('#pets-listbox') as HTMLElement | null;
    expect(listbox).toBeTruthy();
    expect(listbox!.getAttribute('role')).toBe('listbox');
    expect(listbox!.getAttribute('aria-multiselectable')).toBe('true');

    const items = getOptionTexts(page.root!);
    expect(items.length).toBeGreaterThan(0);
    expect(items).toContain('Ant');
    expect(items).toContain('Ape');
    expect(items).toContain('Bear');
    expect(items).not.toContain('Bee');
    expect(items).not.toContain('Dog');

    expect(page.root).toMatchSnapshot('after-typing-a-dropdown-open');
  });

  it('updates aria-activedescendant to a role="option" element when navigating', async () => {
    const page = await setup();
    const input = getInput(page.root!);

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();

    expect(input.getAttribute('aria-expanded')).toBe('true');

    const activeId = input.getAttribute('aria-activedescendant');
    expect(activeId).toBe('pets-opt-0');

    const activeEl = page.root!.querySelector(`#${activeId}`) as HTMLElement | null;
    expect(activeEl).toBeTruthy();
    expect(activeEl!.getAttribute('role')).toBe('option');
  });

  it('keeps dropdown open after selecting an item via mouse (mousedown + click)', async () => {
    const page = await setup();
    const input = getInput(page.root!);

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const firstBtn = page.root!.querySelector('.autocomplete-dropdown-item .option-btn') as HTMLButtonElement | null;
    expect(firstBtn).toBeTruthy();

    firstBtn!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await page.waitForChanges();

    firstBtn!.click();
    await page.waitForChanges();
    await sleep(0);
    await page.waitForChanges();

    expect(getDropdown(page.root!)).not.toBeNull();

    const badges = page.root!.querySelectorAll('.ac-selected-items .badge');
    expect(badges.length).toBe(1);

    const selectedText = (badges[0].querySelector('span')?.textContent || '').trim();
    expect(selectedText.length).toBeGreaterThan(0);

    const listItems = getOptionTexts(page.root!);
    expect(listItems).not.toContain(selectedText);

    expect(page.root).toMatchSnapshot('after-selection-dropdown-stays-open');
  });

  it('announces selection changes in the live region', async () => {
    const page = await setup();
    const input = getInput(page.root!);

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const firstBtn = page.root!.querySelector('.autocomplete-dropdown-item .option-btn') as HTMLButtonElement;
    firstBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await page.waitForChanges();

    firstBtn.click();
    await sleep(0);
    await page.waitForChanges();

    const live = page.root!.querySelector('#pets-live') as HTMLElement | null;
    expect(live).toBeTruthy();
    expect(live!.getAttribute('aria-live')).toBe('polite');
    expect(live!.getAttribute('aria-atomic')).toBe('true');

    const msg = (live!.textContent || '').trim().toLowerCase();
    expect(msg).toContain('added');
  });

  it('closes dropdown on outside click', async () => {
    const page = await setup();
    const input = getInput(page.root!);

    input.value = 'e';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    expect(getDropdown(page.root!)).not.toBeNull();

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(getDropdown(page.root!)).toBeNull();
    expect(page.root).toMatchSnapshot('after-outside-click-dropdown-closed');
  });

  it('typing after a selection cancels the keep-open mode and re-filters', async () => {
    const page = await setup();
    const input = getInput(page.root!);

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const firstBtn = page.root!.querySelector('.autocomplete-dropdown-item .option-btn') as HTMLButtonElement;
    firstBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await page.waitForChanges();

    firstBtn.click();
    await sleep(0);
    await page.waitForChanges();

    input.value = 'be';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const items = getOptionTexts(page.root!).map((txt) => txt.toLowerCase());
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((txt) => txt.includes('be'))).toBe(true);

    expect(page.root).toMatchSnapshot('after-typing-again-cancels-keep-open-and-refilters');
  });

  it('sets aria-invalid=true when required and validate() fails', async () => {
    const page = await setup({ required: true });

    const inst = page.rootInstance as PlumageAutocompleteMultipleSelectionsComponent;
    const ok = inst.validate();
    await page.waitForChanges();

    expect(ok).toBe(false);

    const input = getInput(page.root!);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('mirrors controlled value into badges and sanitizes duplicates/markup', async () => {
    const page = await setup();

    const inst = page.rootInstance as PlumageAutocompleteMultipleSelectionsComponent;
    inst.value = ['  <b>Ant</b> ', 'Ant', 'Bee', '', '  Bee  '];
    await page.waitForChanges();

    expect(getBadgeTexts(page.root!)).toEqual(['Ant', 'Bee']);

    const input = getInput(page.root!);
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('read-only disables interaction, closes dropdown, keeps badges visible, and sets aria-readonly', async () => {
    const page = await setup({ readOnly: true });

    const inst = page.rootInstance as PlumageAutocompleteMultipleSelectionsComponent;
    inst.value = ['Ant', 'Bee'];
    await page.waitForChanges();

    const input = getInput(page.root!);
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(input.getAttribute('aria-disabled')).toBe('false');

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    expect(getDropdown(page.root!)).toBeNull();
    expect(getBadgeTexts(page.root!)).toEqual(['Ant', 'Bee']);
  });

  it('disabled prevents interaction and sets aria-disabled', async () => {
    const page = await setup({ disabled: true });

    const inst = page.rootInstance as PlumageAutocompleteMultipleSelectionsComponent;
    inst.value = ['Cat'];
    await page.waitForChanges();

    const input = getInput(page.root!);
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(input.getAttribute('aria-readonly')).toBeNull();

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    expect(getDropdown(page.root!)).toBeNull();
    expect(getBadgeTexts(page.root!)).toEqual(['Cat']);
  });

  it('preserve-input-on-select keeps typed value after selecting', async () => {
    const page = await setup({ preserveInputOnSelect: true });
    const input = getInput(page.root!);

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    const firstBtn = page.root!.querySelector('.autocomplete-dropdown-item .option-btn') as HTMLButtonElement;
    firstBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await page.waitForChanges();

    firstBtn.click();
    await sleep(0);
    await page.waitForChanges();

    expect(getInput(page.root!).value).toBe('a');
    expect(getDropdown(page.root!)).not.toBeNull();
    expect(getBadgeTexts(page.root!).length).toBe(1);
  });
});
