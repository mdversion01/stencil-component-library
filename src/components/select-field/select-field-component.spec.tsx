// src/components/select-field/select-field-component.spec.tsx
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
          // no explicit value -> component should render a blank default option (selected because value defaults to "none")
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

    const firstOpt = options[0];
    expect(firstOpt.getAttribute('value')).toBe('');
    expect(firstOpt.textContent).toBe('Pick one');

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('selectField-label');

    expect(page.root).toMatchInlineSnapshot(`
<select-field-component default-option-txt="<Pick one>">
  <div>
    <div class="form-group">
      <label class="form-control-label label-sm" id="selectField-label">
        <span></span>
      </label>
      <div>
        <select aria-labelledby="selectField-label" class="form-select">
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
      </div>
    </div>
  </div>
</select-field-component>
`);
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
    expect(banana!.hasAttribute('selected')).toBe(true);

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('selectField-label');

    expect(page.root).toMatchInlineSnapshot(`
<select-field-component>
  <div>
    <div class="form-group">
      <label class="form-control-label label-sm" id="selectField-label">
        <span></span>
      </label>
      <div>
        <select aria-labelledby="selectField-label" class="form-select">
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
      </div>
    </div>
  </div>
</select-field-component>
`);
  });

  it('renders legacy "--none--" when id includes sortField; blank default is NOT rendered; none not selected for value=""', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      template: () => (
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

    expect(blank).toBeUndefined();
    expect(legacyNone).toBeTruthy();

    expect(legacyNone!.textContent).toBe('--none--');
    expect(legacyNone!.hasAttribute('selected')).toBe(false);

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('user-sortField-label');

    expect(page.root).toMatchInlineSnapshot(`
<select-field-component default-option-txt="Choose…" id="user-sortField">
  <div>
    <div class="form-group">
      <label class="form-control-label label-sm" id="user-sortField-label">
        <span></span>
      </label>
      <div>
        <select aria-labelledby="user-sortField-label" class="form-select">
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
      </div>
    </div>
  </div>
</select-field-component>
`);
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

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('user-sortField-label');

    expect(page.root).toMatchInlineSnapshot(`
<select-field-component default-option-txt="Choose…" id="user-sortField">
  <div>
    <div class="form-group">
      <label class="form-control-label label-sm" id="user-sortField-label">
        <span></span>
      </label>
      <div>
        <select aria-labelledby="user-sortField-label" class="form-select">
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
      </div>
    </div>
  </div>
</select-field-component>
`);
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

    const labelSpanBefore = page.root!.querySelector('label > span');
    expect(labelSpanBefore?.classList.contains('required')).toBe(true);

    const sel = getSelect(page);
    sel.value = 'apple';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    const labelSpanAfter = page.root!.querySelector('label > span');
    expect(labelSpanAfter?.classList.contains('required')).toBe(false);

    expect(sel.getAttribute('aria-labelledby')).toBe('fruit-label');
    expect(sel.getAttribute('aria-required')).toBe('true');
    expect(sel.hasAttribute('required')).toBe(true);

    expect(page.root).toMatchInlineSnapshot(`
<select-field-component default-option-txt="Pick one" select-field-id="fruit">
  <div>
    <div class="form-group">
      <label class="form-control-label label-sm" htmlfor="fruit" id="fruit-label">
        <span>
          Favorite Fruit
        </span>
        <span class="required">
          *
        </span>
      </label>
      <div>
        <select aria-labelledby="fruit-label" aria-required="true" class="form-select" id="fruit" required="">
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
      </div>
    </div>
  </div>
</select-field-component>
`);
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

    const msg = page.root!.querySelector('#selectField-validation');
    expect(msg?.textContent).toBe('Please fill in');

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-describedby')).toBe('selectField-validation');
    expect(sel.getAttribute('aria-invalid')).toBe('true');

    const labelSpan = page.root!.querySelector('label > span');
    expect(labelSpan?.classList.contains('required')).toBe(true);

    expect(page.root).toMatchInlineSnapshot(`
<select-field-component default-option-txt="Pick one" validation-message="Please fill in">
  <div>
    <div class="form-group">
      <label class="form-control-label invalid label-sm" id="selectField-label">
        <span class="required"></span>
        <span class="required">
          *
        </span>
      </label>
      <div>
        <select aria-describedby="selectField-validation" aria-invalid="true" aria-labelledby="selectField-label" aria-required="true" class="form-select is-invalid" required="">
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
        <div aria-live="polite" class="form-text invalid-feedback" id="selectField-validation">
          Please fill in
        </div>
      </div>
    </div>
  </div>
</select-field-component>
`);
  });
});
