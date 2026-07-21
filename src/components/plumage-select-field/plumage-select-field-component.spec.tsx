// src/components/plumage-select-field/plumage-select-field-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PlumageSelectFieldComponent } from './plumage-select-field-component';

function getSelect(page: any): HTMLSelectElement {
  const sel = page.root!.querySelector('select') as HTMLSelectElement | null;
  if (!sel) throw new Error('select element not found');
  return sel;
}

function getAllOptions(page: any): HTMLOptionElement[] {
  return Array.from(getSelect(page).querySelectorAll('option')) as HTMLOptionElement[];
}

function makeMockSelect(optionValues: string[], selectedValues: string[] = []) {
  const selectedSet = new Set(selectedValues);
  const options = optionValues.map(value => ({
    value,
    selected: selectedSet.has(value),
  }));

  return {
    options,
    querySelectorAll: () => options,
    classList: { toggle: jest.fn() },
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    value: selectedValues[0] ?? '',
  } as any;
}

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
    expect(first.textContent?.trim()).toBe('Pick one');

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('plumageSelect-label');
    expect(sel.getAttribute('aria-readonly')).toBeNull();
    expect(sel.getAttribute('aria-disabled')).toBeNull();
    expect(sel.classList.contains('read-only')).toBe(false);
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

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('plumageSelect-label');
    expect(sel.classList.contains('read-only')).toBe(false);
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
    expect(legacyNone!.textContent?.trim()).toBe('--none--');
    expect(legacyNone!.hasAttribute('selected')).toBe(false);

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('some-sortField-label');
    expect(sel.classList.contains('read-only')).toBe(false);
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

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('some-sortField-label');
    expect(sel.classList.contains('read-only')).toBe(false);
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

    expect(sel.getAttribute('aria-labelledby')).toBe('fruit-label');
    expect(sel.getAttribute('aria-required')).toBe('true');
    expect(sel.hasAttribute('required')).toBe(true);
    expect(sel.classList.contains('read-only')).toBe(false);
  });

  it('does not apply invalid styling when required is true but validation is false', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        required
        label="Favorite Fruit"
        select-field-id="fruit-required-only"
        value=""
        default-option-txt="Pick one"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;
    const toggleSpy = jest.fn();
    (comp as any).selectEl = {
      options: [{ value: '', selected: true }, { value: 'apple', selected: false }, { value: 'banana', selected: false }],
      querySelectorAll: () => [{ value: '', selected: true }, { value: 'apple', selected: false }, { value: 'banana', selected: false }],
      classList: { toggle: toggleSpy },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    } as any;

    (comp as any).handleChange({ target: (comp as any).selectEl });
    await page.waitForChanges();

    expect(comp.validation).toBe(false);
    expect((comp as any).validationState).toBe(false);
    expect(toggleSpy).toHaveBeenLastCalledWith('is-invalid', false);

    const label = page.root!.querySelector('label');
    const msg = page.root!.querySelector('#fruitRequiredOnly-validation');
    expect(label?.classList.contains('invalid')).toBe(false);
    expect(msg).toBeNull();
  });

  it('multiple + validation: selecting only default keeps invalid state and clears to []', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        multiple
        validation
        validation-message="Please choose at least one"
        default-option-txt="Pick one"
        options='[
          {"value":"a","name":"A"},
          {"value":"b","name":"B"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;
    const mockSelectEl = makeMockSelect(['', 'a', 'b'], ['']);
    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({ target: mockSelectEl });
    await page.waitForChanges();

    expect((comp as any).valueState).toEqual([]);
    expect(comp.value).toEqual([]);
    expect((comp as any).validationState).toBe(true);
    expect(comp.validation).toBe(true);
  });

  it('multiple + validation accepts a real selection event payload', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        multiple
        validation
        validation-message="Please choose at least one"
        default-option-txt="Pick one"
        options='[
          {"value":"a","name":"A"},
          {"value":"b","name":"B"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;
    const emitSpy = jest.fn();
    (comp as any).valueChange = { emit: emitSpy };

    const hostChangeSpy = jest.fn();
    page.root!.addEventListener('change', hostChangeSpy as any);

    const mockSelectEl = makeMockSelect(['', 'a', 'b'], ['b']);
    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({ target: mockSelectEl });
    await page.waitForChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(['b']);
    expect(hostChangeSpy).toHaveBeenCalledTimes(1);
    expect(comp.value).toEqual(['b']);
    expect((comp as any).valueState).toEqual(['b']);
  });

  it('multiple mode clears to [] when only the empty default option is selected', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        label="Tags"
        select-field-id="tags"
        multiple
        validation
        validation-message="Please choose at least one"
        default-option-txt="Choose tags"
        options='[
          {"value":"ux","name":"UX"},
          {"value":"web","name":"Web"},
          {"value":"mobile","name":"Mobile"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;
    const emitSpy = jest.fn();
    (comp as any).valueChange = { emit: emitSpy };

    const hostChangeSpy = jest.fn();
    page.root!.addEventListener('change', hostChangeSpy as any);

    const mockSelectEl = makeMockSelect(['', 'ux', 'web', 'mobile'], ['']);
    (comp as any).selectEl = mockSelectEl;

    const applySpy = jest.spyOn(comp as any, 'applyMultiSelection');

    (comp as any).handleChange({ target: mockSelectEl });
    await page.waitForChanges();

    expect((comp as any).valueState).toEqual([]);
    expect(comp.value).toEqual([]);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith([]);
    expect(applySpy).toHaveBeenLastCalledWith(mockSelectEl, []);
    expect(hostChangeSpy).toHaveBeenCalledTimes(1);
    expect((comp as any).validationState).toBe(true);
    expect(comp.validation).toBe(true);
  });

  it('normalizes external multiple value [""] to [] via value watcher', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        label="Tags"
        select-field-id="tags-external"
        multiple
        options='[
          {"value":"ux","name":"UX"},
          {"value":"web","name":"Web"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    (comp as any).selectEl = {
      options: [],
      querySelectorAll: () => [],
      classList: { toggle: jest.fn() },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    } as any;

    comp.value = [''];
    await page.waitForChanges();

    expect((comp as any).valueState).toEqual([]);
    expect(comp.value).toEqual([]);
  });

  it('does not apply invalid styling in multiple mode when validation is false', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        label="Tags"
        select-field-id="tags-no-validation"
        multiple
        required
        default-option-txt="Choose tags"
        options='[
          {"value":"ux","name":"UX"},
          {"value":"web","name":"Web"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;
    const mockSelectEl = makeMockSelect(['', 'ux', 'web'], ['']);
    const toggleSpy = jest.fn();
    mockSelectEl.classList.toggle = toggleSpy;
    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({ target: mockSelectEl });
    await page.waitForChanges();

    expect((comp as any).valueState).toEqual([]);
    expect(comp.value).toEqual([]);
    expect((comp as any).validationState).toBe(false);
    expect(comp.validation).toBe(false);
    expect(toggleSpy).toHaveBeenLastCalledWith('is-invalid', false);
  });

  it('adds read-only class when readOnly is true', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      template: () => (
        <plumage-select-field-component
          label="Favorite Fruit"
          select-field-id="fruit-readonly"
          read-only
          value="banana"
          options='[
            {"value":"apple","name":"Apple"},
            {"value":"banana","name":"Banana"}
          ]'
        />
      ),
    });

    await page.waitForChanges();

    const sel = getSelect(page);
    expect(sel.hasAttribute('disabled')).toBe(true);
    expect(sel.getAttribute('aria-readonly')).toBe('true');
    expect(sel.getAttribute('aria-disabled')).toBe('true');
    expect(sel.classList.contains('read-only')).toBe(true);
  });

  it('suppresses validation message when readOnly and validation is true', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        label="Favorite Fruit"
        select-field-id="fruit-readonly-invalid"
        read-only
        required
        validation
        validation-message="Please fill in"
        value=""
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;
    const toggleSpy = jest.fn();
    (comp as any).selectEl = {
      options: [{ value: '', selected: true }, { value: 'apple', selected: false }, { value: 'banana', selected: false }],
      querySelectorAll: () => [{ value: '', selected: true }, { value: 'apple', selected: false }, { value: 'banana', selected: false }],
      classList: { toggle: toggleSpy },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    } as any;

    (comp as any).handleChange({ target: (comp as any).selectEl });
    await page.waitForChanges();

    const sel = getSelect(page);
    const msg = page.root!.querySelector('#fruitReadonlyInvalid-validation') as HTMLElement | null;

    expect(sel.hasAttribute('disabled')).toBe(true);
    expect(sel.classList.contains('read-only')).toBe(true);
    expect(sel.getAttribute('aria-readonly')).toBe('true');
    expect(sel.getAttribute('aria-disabled')).toBe('true');
    expect(toggleSpy).toHaveBeenLastCalledWith('is-invalid', false);
    expect(msg).toBeNull();
  });

  it('supports disabled without adding read-only class', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        label="Favorite Fruit"
        select-field-id="fruit-disabled"
        disabled
        required
        validation
        validation-message="Please fill in"
        value=""
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;
    const toggleSpy = jest.fn();
    (comp as any).selectEl = {
      options: [{ value: '', selected: true }, { value: 'apple', selected: false }, { value: 'banana', selected: false }],
      querySelectorAll: () => [{ value: '', selected: true }, { value: 'apple', selected: false }, { value: 'banana', selected: false }],
      classList: { toggle: toggleSpy },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    } as any;

    (comp as any).handleChange({ target: (comp as any).selectEl });
    await page.waitForChanges();

    const sel = getSelect(page);
    const msg = page.root!.querySelector('#fruitDisabled-validation') as HTMLElement | null;

    expect(sel.hasAttribute('disabled')).toBe(true);
    expect(sel.getAttribute('aria-disabled')).toBe('true');
    expect(sel.getAttribute('aria-readonly')).toBeNull();
    expect(sel.classList.contains('read-only')).toBe(false);
    expect(toggleSpy).toHaveBeenLastCalledWith('is-invalid', false);
    expect(msg).toBeNull();
  });

  it('supports a11y override props: aria-labelledby wins over aria-label and aria-describedby is forwarded', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      template: () => (
        <div>
          <div id="external-label">External label</div>
          <div id="external-help">External help</div>
          <plumage-select-field-component
            label="Internal Label"
            select-field-id="a11y-select"
            aria-label="Fallback label"
            aria-labelledby="external-label"
            aria-describedby="external-help"
            options='[
              {"value":"apple","name":"Apple"},
              {"value":"banana","name":"Banana"}
            ]'
          />
        </div>
      ),
    });

    await page.waitForChanges();

    const host = page.body.querySelector('plumage-select-field-component') as HTMLElement;
    const sel = host.querySelector('select') as HTMLSelectElement;

    expect(sel.getAttribute('aria-labelledby')).toBe('external-label');
    expect(sel.getAttribute('aria-label')).toBeNull();
    expect(sel.getAttribute('aria-describedby')).toBe('external-help');
  });

  it('supports multiple selection and emits array payload', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        label="Fruits"
        select-field-id="fruits"
        multiple
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"},
          {"value":"cherry","name":"Cherry"}
        ]'
      ></plumage-select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;
    const emitSpy = jest.fn();
    (comp as any).valueChange = { emit: emitSpy };

    const hostChangeSpy = jest.fn();
    page.root!.addEventListener('change', hostChangeSpy as any);

    const mockSelectEl = makeMockSelect(['', 'apple', 'banana', 'cherry'], ['banana', 'cherry']);
    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({ target: mockSelectEl });
    await page.waitForChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(['banana', 'cherry']);
    expect(comp.value).toEqual(['banana', 'cherry']);
    expect((comp as any).valueState).toEqual(['banana', 'cherry']);
    expect(hostChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('can parse options from array via watcher helper', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent],
      html: `<plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-array"
        value="apple"
      ></plumage-select-field-component>`,
    });

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    (comp as any).onOptionsChange([
      { value: 'apple', name: 'Apple' },
      { value: 'banana', name: 'Banana' },
    ]);

    await page.waitForChanges();

    const opts = getAllOptions(page);
    expect(opts.map(o => o.getAttribute('value'))).toEqual(['', 'apple', 'banana']);
    expect(opts[1].hasAttribute('selected')).toBe(true);
  });
});
