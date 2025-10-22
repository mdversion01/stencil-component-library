// src/components/autocomplete-single/autocomplete-single.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteSingle } from './autocomplete-single';

describe('<autocomplete-single>', () => {
  it('renders correctly with default props', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Test Label" input-id="test"></autocomplete-single>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input') as HTMLInputElement;

    expect(root).toBeTruthy();
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // label text & class
    expect(label.textContent).toContain('Test Label');
    expect(label.className).toContain('form-control-label');

    // placeholder prefers label
    expect(input.placeholder).toBe('Test Label');

    // a11y basics
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-controls')).toBe('test-listbox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens dropdown only when there are matches', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    comp.options = ['Apple', 'Banana', 'Orange'];

    // No input -> closed
    comp.inputValue = '';
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual([]);
    expect(comp['dropdownOpen']).toBe(false);
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();

    // With matches -> open
    comp.inputValue = 'an';
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Banana', 'Orange']);
    expect(comp['dropdownOpen']).toBe(true);
    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeTruthy();
  });

  it('keeps dropdown closed when there are no matches', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    comp.options = ['Apple', 'Banana', 'Orange'];

    comp.inputValue = 'zzz';
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual([]);
    expect(comp['dropdownOpen']).toBe(false);
    expect(page.root!.querySelector('[role="listbox"]')).toBeNull();

    const input = page.root!.querySelector('input')!;
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('filters options based on input (case-insensitive)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const component = page.rootInstance as AutocompleteSingle;
    component.options = ['Apple', 'Banana', 'Orange'];
    component.inputValue = 'Ap';
    (component as any).filterOptions(); // call internal method
    await page.waitForChanges();

    expect(component.filteredOptions).toEqual(['Apple']);
  });

  it('keyboard selection: ArrowDown + Enter selects option and closes dropdown', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    comp.options = ['Apple', 'Banana', 'Orange'];

    // type so it opens
    comp.inputValue = 'a';
    (comp as any).filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    // navigate to first item and select
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    // Selected value is one of the filtered options starting with 'a'
    expect(['Apple', 'Banana', 'Orange']).toContain(comp.inputValue);
    expect(comp['dropdownOpen']).toBe(false);
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
  });

  it('Escape closes the dropdown', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    comp.options = ['Apple', 'Banana', 'Orange'];
    comp.inputValue = 'a';
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect(comp['dropdownOpen']).toBe(true);

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp['dropdownOpen']).toBe(false);
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
  });

  it('emits itemSelect event on selecting option (programmatic selectOption)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single></autocomplete-single>`,
    });

    const component = page.rootInstance as AutocompleteSingle;
    const spy = jest.fn();
    component.options = ['One', 'Two', 'Three'];
    component.itemSelect = { emit: spy } as any;

    (component as any).selectOption('Two');
    expect(spy).toHaveBeenCalledWith('Two');
    expect(component['dropdownOpen']).toBe(false);
  });

  it('shows clear button when input has value and emits clear on click', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single required></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    const clearSpy = jest.fn();
    comp.clear = { emit: clearSpy } as any;

    // give it a value so clear button renders
    comp.inputValue = 'Some text';
    await page.waitForChanges();

    const btn = page.root!.querySelector('button.clear-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    btn.click();
    await page.waitForChanges();

    expect(comp.inputValue).toBe('');
    expect(clearSpy).toHaveBeenCalled();
  });

  it('sanitizes input to prevent HTML injection', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single></autocomplete-single>`,
    });

    const component = page.rootInstance as AutocompleteSingle;
    const malicious = '<script>alert("XSS")</script>';
    const sanitized = (component as any)['sanitizeInput'](malicious);

    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
  });

  it('matches snapshot (default render)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single
             label="Fruits"
             input-id="fruit"
             placeholder="Type to search..."
           ></autocomplete-single>`,
    });

    // Default state (closed dropdown)
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('matches snapshot (dropdown open with matches)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single
             label="Fruits"
             input-id="fruit"
           ></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    comp.options = ['Apple', 'Banana', 'Orange'];

    // Type a query that yields matches and open the dropdown
    comp.inputValue = 'an'; // Banana, Orange
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect(comp['dropdownOpen']).toBe(true);
    expect(page.root).toMatchSnapshot();
  });
});
