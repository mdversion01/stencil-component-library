// src/components/autocomplete-single/autocomplete-single.spec.tsx
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteSingle } from './autocomplete-single';

describe('<autocomplete-single>', () => {
  it('renders correctly with default props (label wiring + a11y defaults)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Test Label" input-id="test"></autocomplete-single>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input[role="combobox"]') as HTMLInputElement;

    expect(root).toBeTruthy();
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // label text & class
    expect(label.textContent || '').toContain('Test Label');
    expect(label.className).toContain('form-control-label');

    // placeholder prefers label
    expect(input.placeholder).toBe('Test Label');

    // internal ids now come from resolved base id ("test")
    expect(input.getAttribute('id')).toBe('test');
    expect(input.getAttribute('aria-controls')).toBe('test-listbox');
    expect(input.getAttribute('aria-expanded')).toBe('false');

    // label wiring defaults to internal label id
    expect(label.getAttribute('id')).toBe('test-label');

    // Stencil can serialize htmlFor as `htmlfor`
    const labelFor = label.getAttribute('for') || label.getAttribute('htmlfor') || (label as any).htmlFor || (label as any).htmlfor;

    expect(labelFor).toBe('test');

    // aria-labelledby uses internal label id by default
    expect(input.getAttribute('aria-labelledby')).toBe('test-label');

    // aria-label should NOT be present when aria-labelledby exists
    expect(input.getAttribute('aria-label')).toBeNull();

    // optional attributes should be absent when not needed
    expect(input.getAttribute('aria-required')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
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
    expect((comp as any).dropdownOpen).toBe(false);
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();

    // With matches -> open
    comp.inputValue = 'an';
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Banana', 'Orange']);
    expect((comp as any).dropdownOpen).toBe(true);

    const input = page.root!.querySelector('input[role="combobox"]')!;
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeTruthy();
    expect(page.root!.querySelector('#fruit-listbox[role="listbox"]')).toBeTruthy();
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
    expect((comp as any).dropdownOpen).toBe(false);
    expect(page.root!.querySelector('[role="listbox"]')).toBeNull();

    const input = page.root!.querySelector('input[role="combobox"]')!;
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('filters options based on input (case-insensitive)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    comp.options = ['Apple', 'Banana', 'Orange'];

    comp.inputValue = 'Ap';
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect(comp.filteredOptions).toEqual(['Apple']);
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

    const input = page.root!.querySelector('input[role="combobox"]')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();

    // should focus first option -> aria-activedescendant points at fruit-option-0
    expect(input.getAttribute('aria-activedescendant')).toBe('fruit-option-0');

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(['Apple', 'Banana', 'Orange']).toContain(comp.inputValue);
    expect((comp as any).dropdownOpen).toBe(false);
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

    expect((comp as any).dropdownOpen).toBe(true);

    const input = page.root!.querySelector('input[role="combobox"]')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect((comp as any).dropdownOpen).toBe(false);
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('emits itemSelect event on selecting option (programmatic selectOption)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single input-id="x" label="X"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;

    const spy = jest.fn();
    comp.options = ['One', 'Two', 'Three'];
    comp.itemSelect = { emit: spy } as any;

    (comp as any).selectOption('Two');

    expect(spy).toHaveBeenCalledWith('Two');
    expect((comp as any).dropdownOpen).toBe(false);
  });

  it('shows clear button when input has value and emits clear on click', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single required input-id="c" label="C"></autocomplete-single>`,
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
      html: `<autocomplete-single input-id="s" label="S"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;
    const malicious = '<script>alert("XSS")</script>';
    const sanitized = (comp as any).sanitizeInput(malicious);

    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
  });

  // ---- Enter with no focused option: keep typed value, do NOT mutate options, do NOT emit itemSelect ----

  it('pressing Enter with no focused option keeps free-typed text, does not emit itemSelect, and does not mutate options', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;

    const emitted: string[] = [];
    page.root!.addEventListener('itemSelect', (e: any) => emitted.push(e.detail));

    comp.options = ['Banana', 'Apple'];
    await page.waitForChanges();
    expect(comp.options).toEqual(['Apple', 'Banana']); // watcher sorts by default

    // Type a non-matching value
    comp.inputValue = 'Pear';
    (comp as any).filterOptions();
    await page.waitForChanges();

    // Press Enter with no focused item
    const input = page.root!.querySelector('input[role="combobox"]')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    // Input remains what user typed
    expect(comp.inputValue).toBe('Pear');

    // Options remain unchanged (no insertion)
    expect(comp.options).toEqual(['Apple', 'Banana']);

    // No itemSelect for free-typed Enter path
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

    comp.inputValue = 'apple';
    (comp as any).filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input[role="combobox"]')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Apple']);
    expect(comp.inputValue).toBe('apple');
  });

  it('with autoSort=false, pressing Enter on a new free-typed value does not change options order (no insertion)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit" auto-sort="false"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;

    comp.options = ['Orange', 'Banana'];
    await page.waitForChanges();

    comp.inputValue = 'Apple';
    (comp as any).filterOptions();
    await page.waitForChanges();

    const input = page.root!.querySelector('input[role="combobox"]')!;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(comp.options).toEqual(['Orange', 'Banana']);
    expect(comp.inputValue).toBe('Apple');
  });

  it('removes control chars (incl. tabs/newlines), collapses spaces, caps length to 512', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single input-id="u" label="U"></autocomplete-single>`,
    });

    const comp = page.rootInstance as AutocompleteSingle;

    const withControls = 'a\u0007\u0008 b\t\tc   \n d';
    const sanitized = (comp as any).sanitizeInput(withControls);

    // \t and \n are removed, whitespace collapsed
    expect(sanitized).toBe('a bc d');

    const long = 'x'.repeat(600);
    const capped = (comp as any).sanitizeInput(long);
    expect(capped.length).toBe(512);
  });

  it('dedupes ids when two instances use the same input-id (unique IDs used in aria and labels)', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      template: () => (
        <div>
          <autocomplete-single input-id="dup" label="First"></autocomplete-single>
          <autocomplete-single input-id="dup" label="Second"></autocomplete-single>
        </div>
      ),
    });

    // IMPORTANT: page.root will be the FIRST component, not the wrapper.
    const comps = page.doc.querySelectorAll('autocomplete-single');
    expect(comps.length).toBe(2);

    const firstInput = comps[0].querySelector('input[role="combobox"]') as HTMLInputElement;
    const secondInput = comps[1].querySelector('input[role="combobox"]') as HTMLInputElement;
    expect(firstInput).toBeTruthy();
    expect(secondInput).toBeTruthy();

    // ids must be unique
    const firstId = firstInput.getAttribute('id');
    const secondId = secondInput.getAttribute('id');
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);

    // aria-controls must reference unique listbox ids
    const firstControls = firstInput.getAttribute('aria-controls');
    const secondControls = secondInput.getAttribute('aria-controls');
    expect(firstControls).toBeTruthy();
    expect(secondControls).toBeTruthy();
    expect(firstControls).not.toBe(secondControls);

    // aria-labelledby must reference unique label ids
    const firstLabelledby = firstInput.getAttribute('aria-labelledby');
    const secondLabelledby = secondInput.getAttribute('aria-labelledby');
    expect(firstLabelledby).toBeTruthy();
    expect(secondLabelledby).toBeTruthy();
    expect(firstLabelledby).not.toBe(secondLabelledby);

    // the referenced label elements should exist
    const firstLabel = page.doc.getElementById(firstLabelledby!);
    const secondLabel = page.doc.getElementById(secondLabelledby!);
    expect(firstLabel).toBeTruthy();
    expect(secondLabel).toBeTruthy();
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

    comp.inputValue = 'an';
    (comp as any).filterOptions();
    await page.waitForChanges();

    expect((comp as any).dropdownOpen).toBe(true);
    expect(page.root).toMatchSnapshot();
  });
});
