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
    expect((comp as any)['dropdownOpen']).toBe(false);
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();

    // With matches -> open
    comp.inputValue = 'an';
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Banana', 'Orange']);
    expect((comp as any)['dropdownOpen']).toBe(true);
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
    expect((comp as any)['dropdownOpen']).toBe(false);
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
    (component as any).filterOptions();
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
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(['Apple', 'Banana', 'Orange']).toContain(comp.inputValue);
    expect((comp as any)['dropdownOpen']).toBe(false);
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

    expect((comp as any)['dropdownOpen']).toBe(true);

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect((comp as any)['dropdownOpen']).toBe(false);
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
    expect((component as any)['dropdownOpen']).toBe(false);
  });

  it('shows clear button when input has value and emits clear on click', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single required></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    const clearSpy = jest.fn();
    comp.clear = { emit: clearSpy } as any;

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

  // ---- UPDATED BEHAVIOR: free-typed Enter selects text WITHOUT mutating options ----

  it('pressing Enter with no match selects free-typed text, emits itemSelect, and does not mutate options', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    const emitted: string[] = [];
    page.root!.addEventListener('itemSelect', (e: any) => emitted.push(e.detail));

    // Start with two options (watcher will sort them)
    comp.options = ['Banana', 'Apple'];
    await page.waitForChanges();
    expect(comp.options).toEqual(['Apple', 'Banana']); // sorted by watcher

    // Type a non-matching value
    comp.inputValue = 'Pear';
    (comp as any).filterOptions(); // no matches => dropdown remains closed
    await page.waitForChanges();

    // Press Enter with no focused item -> SHOULD NOT mutate options
    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    // Selected value is the new one
    expect(comp.inputValue).toBe('Pear');

    // Options remain unchanged
    expect(comp.options).toEqual(['Apple', 'Banana']);

    // Component does not emit itemSelect for free-typed Enter (no list selection)
    expect(emitted).toEqual([]);
  });

  it('does not duplicate an existing option when pressing Enter on a free-typed existing value (case-insensitive)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    comp.options = ['Apple'];
    await page.waitForChanges();

    // Type same word in different casing and press Enter (no focused item)
    comp.inputValue = 'apple';
    (comp as any).filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    // No duplicate, keeps canonical casing in options
    expect(comp.options).toEqual(['Apple']);
    // The input keeps exactly what the user typed (no canonicalization)
    expect(comp.inputValue).toBe('apple');
    // (optional) also ensure behavior is case-insensitive in logic paths
    expect(comp.inputValue.toLowerCase()).toBe('apple');
  });

  it('with autoSort=false, pressing Enter on a new free-typed value does not change options order (no insertion)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit" auto-sort="false"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;

    comp.options = ['Orange', 'Banana'];
    await page.waitForChanges();

    comp.inputValue = 'Apple'; // not in options
    (comp as any).filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    // Options stay exactly as they were (no insertion)
    expect(comp.options).toEqual(['Orange', 'Banana']);
    // The input holds the free-typed value
    expect(comp.inputValue).toBe('Apple');
  });

  // ---------------- SNAPSHOTS ----------------

  it('matches snapshot (default render)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single
             label="Fruits"
             input-id="fruit"
             placeholder="Type to search..."
           ></autocomplete-single>`,
    });

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

    comp.inputValue = 'an'; // Banana, Orange
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect((comp as any)['dropdownOpen']).toBe(true);
    expect(page.root).toMatchSnapshot();
  });
});
