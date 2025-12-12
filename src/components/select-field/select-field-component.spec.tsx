import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { SelectFieldComponent } from './select-field-component';

// --- helpers --------------------------------------------------------------

function getSelect(page: any): HTMLSelectElement {
  const sel = page.root!.querySelector('select') as HTMLSelectElement | null;
  if (!sel) throw new Error('select element not found');
  return sel;
}

function getAllOptions(page: any): HTMLOptionElement[] {
  return Array.from(getSelect(page).querySelectorAll('option')) as HTMLOptionElement[];
}

// --- tests ----------------------------------------------------------------

describe('select-field-component', () => {
  it('sanitizes defaultOptionTxt and uses it when attribute present', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      template: () => (
        <select-field-component
          // no explicit value -> component should render a blank default option
          default-option-txt={'<Pick one>'}
          options='[
            {"value":"apple","name":"Apple"},
            {"value":"banana","name":"Banana"}
          ]'
        />
      ),
    });

    await page.waitForChanges();

    const options = getAllOptions(page);
    expect(options.length).toBeGreaterThan(0);

    // first option should be the blank default
    const firstOpt = options[0];
    expect(firstOpt.getAttribute('value')).toBe('');
    // sanitizer strips angle brackets, so rendered text should not include them
    expect(firstOpt.textContent).toBe('Pick one');

    expect(page.root).toMatchSnapshot();
  });

  it('parses options JSON and selects matching value', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      template: () => (
        <select-field-component
          value="banana"
          options='[
            {"value":"apple","name":"Apple"},
            {"value":"banana","name":"Banana"},
            {"value":"cherry","name":"Cherry"}
          ]'
        />
      ),
    });

    await page.waitForChanges();

    const options = getAllOptions(page);
    const banana = options.find(o => o.getAttribute('value') === 'banana');
    expect(banana).toBeTruthy();
    // In JSDOM, rely on the presence of the `selected` attribute rather than `.selected`
    expect(banana!.hasAttribute('selected')).toBe(true);

    expect(page.root).toMatchSnapshot();
  });

  it('renders legacy "--none--" when id includes sortField; blank default is NOT rendered; none not selected for value=""', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      template: () => (
        // id includes "sortField" => legacy "--none--" option appears
        // IMPORTANT: value="" => legacy none should not be selected
        <select-field-component
          id="user-sortField"
          value=""
          default-option-txt="Choose…"
          options='[
            {"value":"apple","name":"Apple"},
            {"value":"banana","name":"Banana"}
          ]'
        />
      ),
    });

    await page.waitForChanges();

    const options = Array.from(page.root!.querySelectorAll('option')) as HTMLOptionElement[];
    expect(options.length).toBeGreaterThan(0);

    const blank = options.find(o => o.getAttribute('value') === '');
    const legacyNone = options.find(o => o.getAttribute('value') === 'none');

    // blank default is suppressed for sortField
    expect(blank).toBeUndefined();
    expect(legacyNone).toBeTruthy();

    expect(legacyNone!.textContent).toBe('--none--');
    expect(legacyNone!.hasAttribute('selected')).toBe(false);

    expect(page.root).toMatchSnapshot();
  });

  it('with value="none" and sortField id, legacy none is selected; blank default still NOT rendered', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      template: () => (
        <select-field-component
          id="user-sortField"
          value="none"
          default-option-txt="Choose…"
          options='[
            {"value":"apple","name":"Apple"},
            {"value":"banana","name":"Banana"}
          ]'
        />
      ),
    });

    await page.waitForChanges();

    const options = Array.from(page.root!.querySelectorAll('option')) as HTMLOptionElement[];
    const blank = options.find(o => o.getAttribute('value') === '');
    const legacyNone = options.find(o => o.getAttribute('value') === 'none');

    expect(blank).toBeUndefined();
    expect(legacyNone).toBeTruthy();
    expect(legacyNone!.hasAttribute('selected')).toBe(true);

    expect(page.root).toMatchSnapshot();
  });

  it('marks label as required when value is blank and clears after selection', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      template: () => (
        <select-field-component
          required
          label="Favorite Fruit"
          select-field-id="fruit"
          value=""
          default-option-txt="Pick one"
          options='[
            {"value":"apple","name":"Apple"},
            {"value":"banana","name":"Banana"}
          ]'
        />
      ),
    });

    await page.waitForChanges();

    // Initially blank -> label shows required class on inner span
    const labelSpanBefore = page.root!.querySelector('label > span');
    expect(labelSpanBefore?.classList.contains('required')).toBe(true);

    // Simulate user choosing "apple"
    const sel = getSelect(page);
    sel.value = 'apple';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    const labelSpanAfter = page.root!.querySelector('label > span');
    expect(labelSpanAfter?.classList.contains('required')).toBe(false);

    expect(page.root).toMatchSnapshot();
  });

  it('shows validation message when required and value is cleared to blank', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      template: () => (
        <select-field-component
          required
          validation
          validation-message="Please fill in"
          value="banana"
          default-option-txt="Pick one"
          options='[
            {"value":"apple","name":"Apple"},
            {"value":"banana","name":"Banana"}
          ]'
        />
      ),
    });

    await page.waitForChanges();

    // Simulate "clearing" the selection (controller sets value to '')
    page.rootInstance.value = '';
    await page.waitForChanges();

    // Should display validation message again
    const msg = page.root!.querySelector('#validationMessage');
    expect(msg?.textContent).toBe('Please fill in');

    // And label should show required class again
    const labelSpan = page.root!.querySelector('label > span');
    expect(labelSpan?.classList.contains('required')).toBe(true);

    expect(page.root).toMatchSnapshot();
  });
});
