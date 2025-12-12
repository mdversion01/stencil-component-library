import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PlumageSelectFieldComponent } from './plumage-select-field-component';

// ---- helpers --------------------------------------------------------------

function getSelect(page: any): HTMLSelectElement {
  const sel = page.root!.querySelector('select') as HTMLSelectElement | null;
  if (!sel) throw new Error('select element not found');
  return sel;
}

function getAllOptions(page: any): HTMLOptionElement[] {
  return Array.from(getSelect(page).querySelectorAll('option')) as HTMLOptionElement[];
}

/**
 * Robustly set multiple selection in JSDOM and browsers:
 * - toggles option.selected via querySelectorAll (avoids sel.options undefined cases)
 * - syncs select.value to first chosen value (JSDOM quirk)
 * - fires input + change to mimic real interaction
 */
function setMultiple(sel: HTMLSelectElement | null, values: string[]) {
  if (!sel) throw new Error('select element not found (setMultiple)');
  const options = Array.from(sel.querySelectorAll('option')) as HTMLOptionElement[];
  const set = new Set(values || []);
  options.forEach(o => (o.selected = set.has(o.value)));
  sel.value = values && values.length ? values[0] : '';
  sel.dispatchEvent(new Event('input', { bubbles: true }));
  sel.dispatchEvent(new Event('change', { bubbles: true }));
}

// ---- tests ----------------------------------------------------------------

describe('plumage-select-field-component', () => {
  it('sanitizes defaultOptionTxt and shows a blank default when provided (non-sortField)', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      template: () => (
        <plumage-select-field-component
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

    const first = options[0];
    expect(first.getAttribute('value')).toBe('');
    // angle brackets stripped by sanitizer
    expect(first.textContent).toBe('Pick one');

    expect(page.root).toMatchInlineSnapshot(`
<plumage-select-field-component default-option-txt="<Pick one>">
  <div class="plumage">
    <div class="form-group">
      <label class="form-control-label">
        <span></span>
      </label>
      <div class="input-container" role="presentation">
        <select class="form-select is-invalid" role="listbox">
          <option selected="" value="">
            Pick one
          </option>
          <option aria-label="Apple" value="apple">
            Apple
          </option>
          <option aria-label="Banana" value="banana">
            Banana
          </option>
        </select>
        <div class="b-underline" role="presentation">
          <div aria-hidden="true" class="b-focus" role="presentation"></div>
        </div>
      </div>
    </div>
  </div>
</plumage-select-field-component>
`);
  });

  it('parses options JSON and selects matching value (single)', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      template: () => (
        <plumage-select-field-component
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
    expect(banana!.hasAttribute('selected')).toBe(true);

    expect(page.root).toMatchInlineSnapshot(`
<plumage-select-field-component>
  <div class="plumage">
    <div class="form-group">
      <label class="form-control-label">
        <span></span>
      </label>
      <div class="input-container" role="presentation">
        <select class="form-select is-invalid" role="listbox">
          <option value="">
            Select an option
          </option>
          <option aria-label="Apple" value="apple">
            Apple
          </option>
          <option aria-label="Banana" selected="" value="banana">
            Banana
          </option>
          <option aria-label="Cherry" value="cherry">
            Cherry
          </option>
        </select>
        <div class="b-underline" role="presentation">
          <div aria-hidden="true" class="b-focus" role="presentation"></div>
        </div>
      </div>
    </div>
  </div>
</plumage-select-field-component>
`);
  });

  it('when id includes sortField: renders legacy "--none--", suppresses blank default, and none is not selected for value=""', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      template: () => (
        <plumage-select-field-component
          id="some-sortField"
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

    const options = getAllOptions(page);
    const blank = options.find(o => o.getAttribute('value') === '');
    const legacyNone = options.find(o => o.getAttribute('value') === 'none');

    expect(blank).toBeUndefined();
    expect(legacyNone).toBeTruthy();
    expect(legacyNone!.textContent).toBe('--none--');
    expect(legacyNone!.hasAttribute('selected')).toBe(false);

    expect(page.root).toMatchInlineSnapshot(`
<plumage-select-field-component default-option-txt="Choose…" id="some-sortField">
  <div class="plumage">
    <div class="form-group">
      <label class="form-control-label">
        <span></span>
      </label>
      <div class="input-container" role="presentation">
        <select class="form-select is-invalid" role="listbox">
          <option aria-label="none" value="none">
            --none--
          </option>
          <option aria-label="Apple" value="apple">
            Apple
          </option>
          <option aria-label="Banana" value="banana">
            Banana
          </option>
        </select>
        <div class="b-underline" role="presentation">
          <div aria-hidden="true" class="b-focus" role="presentation"></div>
        </div>
      </div>
    </div>
  </div>
</plumage-select-field-component>
`);
  });

  it('with value="none" and sortField: legacy none is selected', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      template: () => (
        <plumage-select-field-component
          id="some-sortField"
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

    const options = getAllOptions(page);
    const blank = options.find(o => o.getAttribute('value') === '');
    const legacyNone = options.find(o => o.getAttribute('value') === 'none');

    expect(blank).toBeUndefined();
    expect(legacyNone).toBeTruthy();
    expect(legacyNone!.hasAttribute('selected')).toBe(true);

    expect(page.root).toMatchInlineSnapshot(`
<plumage-select-field-component default-option-txt="Choose…" id="some-sortField">
  <div class="plumage">
    <div class="form-group">
      <label class="form-control-label">
        <span></span>
      </label>
      <div class="input-container" role="presentation">
        <select class="form-select is-invalid" role="listbox">
          <option aria-label="none" selected="" value="none">
            --none--
          </option>
          <option aria-label="Apple" value="apple">
            Apple
          </option>
          <option aria-label="Banana" value="banana">
            Banana
          </option>
        </select>
        <div class="b-underline" role="presentation">
          <div aria-hidden="true" class="b-focus" role="presentation"></div>
        </div>
      </div>
    </div>
  </div>
</plumage-select-field-component>
`);
  });

  it('marks label as required when blank and clears after a valid selection (single)', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      template: () => (
        <plumage-select-field-component
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

    const before = page.root!.querySelector('label > span');
    expect(before?.classList.contains('required')).toBe(true);

    const sel = getSelect(page);
    sel.value = 'apple';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    const after = page.root!.querySelector('label > span');
    expect(after?.classList.contains('required')).toBe(false);

    expect(page.root).toMatchInlineSnapshot(`
<plumage-select-field-component default-option-txt="Pick one" select-field-id="fruit">
  <div class="plumage">
    <div class="form-group">
      <label class="form-control-label" htmlfor="fruit">
        <span>
          Favorite Fruit
        </span>
        <span class="required">
          *
        </span>
      </label>
      <div aria-labelledby="favoriteFruit" class="input-container" role="presentation">
        <select aria-label="favoriteFruit" aria-labelledby="favoriteFruit" class="form-select" id="fruit" required="" role="listbox">
          <option value="">
            Pick one
          </option>
          <option aria-label="Apple" selected="" value="apple">
            Apple
          </option>
          <option aria-label="Banana" value="banana">
            Banana
          </option>
        </select>
        <div class="b-underline" role="presentation">
          <div aria-hidden="true" class="b-focus" role="presentation"></div>
        </div>
      </div>
    </div>
  </div>
</plumage-select-field-component>
`);
  });

  it('multiple + validation: selecting only default keeps invalid; selecting real option clears invalid', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      template: () => (
        <plumage-select-field-component
          multiple
          validation
          validation-message="Please choose at least one"
          default-option-txt="Pick one"
          options='[
            {"value":"a","name":"A"},
            {"value":"b","name":"B"}
          ]'
        />
      ),
    });

    await page.waitForChanges();

    const sel = getSelect(page);
    const opts = getAllOptions(page);

    // Ensure default exists (non-sortField)
    const blank = opts.find(o => o.getAttribute('value') === '');
    expect(blank).toBeTruthy();

    // --- Select ONLY the blank default in multiple mode
    setMultiple(sel, ['']); // helper ensures events + select.value sync
    await page.waitForChanges();

    // Should be invalid
    expect(page.root!.querySelector('select')!.classList.contains('is-invalid')).toBe(true);
    const msg = page.root!.querySelector('#validationMessage');
    expect(msg?.textContent).toBe('Please choose at least one');

    // --- Now select a real option (e.g., "b"); blank should be ignored by component
    setMultiple(sel, ['b']);
    await page.waitForChanges();

    // Invalid should clear
    expect(page.root!.querySelector('select')!.classList.contains('is-invalid')).toBe(false);

    // Snapshot after valid selection
    expect(page.root).toMatchInlineSnapshot(`
<plumage-select-field-component default-option-txt="Pick one" validation-message="Please choose at least one">
  <div class="plumage">
    <div class="form-group">
      <label class="form-control-label invalid">
        <span></span>
      </label>
      <div class="input-container" role="presentation">
        <select aria-describedby="validationMessage" aria-invalid="true" aria-multiselectable="true" class="form-select" multiple="" role="combobox">
          <option value="">
            Pick one
          </option>
          <option aria-label="A" value="a">
            A
          </option>
          <option aria-label="B" value="b">
            B
          </option>
        </select>
        <div class="b-underline invalid" role="presentation">
          <div aria-hidden="true" class="b-focus invalid" role="presentation"></div>
        </div>
        <div class="form-text invalid-feedback" id="validationMessage">
          Please choose at least one
        </div>
      </div>
    </div>
  </div>
</plumage-select-field-component>
`);
  });
});
