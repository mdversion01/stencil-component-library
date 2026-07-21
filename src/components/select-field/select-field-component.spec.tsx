// src/components/select-field/select-field-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { SelectFieldComponent } from './select-field-component';

function getSelect(page: any): HTMLSelectElement {
  const sel = page.root?.querySelector('select') as HTMLSelectElement | null;
  if (!sel) throw new Error('select element not found');
  return sel;
}

function getAllOptions(page: any): HTMLOptionElement[] {
  return Array.from(getSelect(page).querySelectorAll('option')) as HTMLOptionElement[];
}

describe('select-field-component', () => {
  it('sanitizes defaultOptionTxt and uses it when attribute present', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        default-option-txt="<Pick one>"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const options = getAllOptions(page);
    expect(options.length).toBeGreaterThan(0);

    const firstOpt = options[0];
    expect(firstOpt.getAttribute('value')).toBe('');
    expect(firstOpt.textContent?.trim()).toBe('Pick one');

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('selectField-label');
    expect(sel.getAttribute('aria-readonly')).toBeNull();
    expect(sel.getAttribute('aria-disabled')).toBeNull();
    expect(sel.classList.contains('read-only')).toBe(false);
    expect(sel.classList.contains('is-invalid')).toBe(false);
  });

  it('parses options JSON and selects matching value', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        value="banana"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"},
          {"value":"cherry","name":"Cherry"}
        ]'
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const options = getAllOptions(page);
    const banana = options.find(o => o.getAttribute('value') === 'banana');
    expect(banana).toBeTruthy();
    expect(banana?.hasAttribute('selected')).toBe(true);

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('selectField-label');
    expect(sel.classList.contains('read-only')).toBe(false);
    expect(sel.classList.contains('is-invalid')).toBe(false);
  });

  it('renders legacy "--none--" when id includes sortField; blank default is NOT rendered; none not selected for value=""', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        id="user-sortField"
        value=""
        default-option-txt="Choose…"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const options = Array.from(page.root!.querySelectorAll('option')) as HTMLOptionElement[];
    const blank = options.find(o => o.getAttribute('value') === '');
    const legacyNone = options.find(o => o.getAttribute('value') === 'none');

    expect(blank).toBeUndefined();
    expect(legacyNone).toBeTruthy();
    expect(legacyNone?.textContent?.trim()).toBe('--none--');
    expect(legacyNone?.hasAttribute('selected')).toBe(false);

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('user-sortField-label');
    expect(sel.classList.contains('read-only')).toBe(false);
    expect(sel.classList.contains('is-invalid')).toBe(false);
  });

  it('with value="none" and sortField id, legacy none is selected; blank default still NOT rendered', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        id="user-sortField"
        value="none"
        default-option-txt="Choose…"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const options = Array.from(page.root!.querySelectorAll('option')) as HTMLOptionElement[];
    const blank = options.find(o => o.getAttribute('value') === '');
    const legacyNone = options.find(o => o.getAttribute('value') === 'none');

    expect(blank).toBeUndefined();
    expect(legacyNone).toBeTruthy();
    expect(legacyNone?.hasAttribute('selected')).toBe(true);

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-labelledby')).toBe('user-sortField-label');
    expect(sel.classList.contains('read-only')).toBe(false);
    expect(sel.classList.contains('is-invalid')).toBe(false);
  });

  it('marks label as required when value is blank and clears after selection', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        required
        label="Favorite Fruit"
        select-field-id="fruit"
        value=""
        default-option-txt="Pick one"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></select-field-component>`,
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
    expect(sel.classList.contains('read-only')).toBe(false);
    expect(sel.classList.contains('is-invalid')).toBe(false);
  });

  it('shows validation message when required and value is cleared to blank', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        required
        validation
        validation-message="Please fill in"
        value="banana"
        default-option-txt="Pick one"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></select-field-component>`,
    });

    await page.waitForChanges();

    (page.rootInstance as SelectFieldComponent).value = '';
    await page.waitForChanges();

    const msg = page.root!.querySelector('#selectField-validation');
    expect(msg?.textContent?.trim()).toBe('Please fill in');

    const sel = getSelect(page);
    expect(sel.getAttribute('aria-describedby')).toBe('selectField-validation');
    expect(sel.getAttribute('aria-invalid')).toBe('true');
    expect(sel.classList.contains('read-only')).toBe(false);
    expect(sel.classList.contains('is-invalid')).toBe(true);

    const labelSpan = page.root!.querySelector('label > span');
    expect(labelSpan?.classList.contains('required')).toBe(true);
  });

  it('supports readOnly by disabling the select and setting aria-readonly/aria-disabled', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        label="Favorite Fruit"
        select-field-id="fruit-readonly"
        read-only
        value="banana"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const sel = getSelect(page);
    expect(sel.hasAttribute('disabled')).toBe(true);
    expect(sel.getAttribute('aria-readonly')).toBe('true');
    expect(sel.getAttribute('aria-disabled')).toBe('true');
    expect(sel.classList.contains('read-only')).toBe(true);
    expect(sel.classList.contains('is-invalid')).toBe(false);
    expect(sel.getAttribute('aria-invalid')).toBeNull();
  });

  it('suppresses invalid UI when readOnly and validation is true', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
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
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const sel = getSelect(page);
    const msg = page.root!.querySelector('#fruitReadonlyInvalid-validation');

    expect(sel.hasAttribute('disabled')).toBe(true);
    expect(sel.classList.contains('read-only')).toBe(true);
    expect(sel.classList.contains('is-invalid')).toBe(false);
    expect(sel.getAttribute('aria-readonly')).toBe('true');
    expect(sel.getAttribute('aria-disabled')).toBe('true');
    expect(sel.getAttribute('aria-invalid')).toBeNull();
    expect(sel.getAttribute('aria-describedby')).toBeNull();
    expect(msg).toBeNull();
  });

  it('supports disabled without adding read-only or invalid classes', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
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
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const sel = getSelect(page);
    const msg = page.root!.querySelector('#fruitDisabled-validation');

    expect(sel.hasAttribute('disabled')).toBe(true);
    expect(sel.getAttribute('aria-disabled')).toBe('true');
    expect(sel.getAttribute('aria-readonly')).toBeNull();
    expect(sel.classList.contains('read-only')).toBe(false);
    expect(sel.classList.contains('is-invalid')).toBe(false);
    expect(sel.getAttribute('aria-invalid')).toBeNull();
    expect(sel.getAttribute('aria-describedby')).toBeNull();
    expect(msg).toBeNull();
  });

  it('supports a11y override props: aria-labelledby wins over aria-label and aria-describedby is forwarded', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `
        <div>
          <div id="external-label">External label</div>
          <div id="external-help">External help</div>
          <select-field-component
            label="Internal Label"
            select-field-id="a11y-select"
            aria-label="Fallback label"
            aria-labelledby="external-label"
            aria-describedby="external-help"
            options='[
              {"value":"apple","name":"Apple"},
              {"value":"banana","name":"Banana"}
            ]'
          ></select-field-component>
        </div>
      `,
    });

    await page.waitForChanges();

    const host = page.body.querySelector('select-field-component') as HTMLElement;
    const sel = host.querySelector('select') as HTMLSelectElement;

    expect(sel.getAttribute('aria-labelledby')).toBe('external-label');
    expect(sel.getAttribute('aria-label')).toBeNull();
    expect(sel.getAttribute('aria-describedby')).toBe('external-help');
  });

  it('supports multiple selection and emits array valueChange payload', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        label="Fruits"
        select-field-id="fruits"
        multiple
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"},
          {"value":"cherry","name":"Cherry"}
        ]'
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as SelectFieldComponent;
    const emitSpy = jest.fn();
    (comp as any).valueChange = { emit: emitSpy };

    const hostChangeSpy = jest.fn();
    page.root!.addEventListener('change', hostChangeSpy as any);

    (comp as any).selectEl = {
      options: [
        { value: 'apple', selected: false },
        { value: 'banana', selected: false },
        { value: 'cherry', selected: false },
      ],
      selectedOptions: [{ value: 'banana' }, { value: 'cherry' }],
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      classList: { toggle: jest.fn() },
    } as any;

    (comp as any).handleChange({ target: (comp as any).selectEl });
    await page.waitForChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith({ value: ['banana', 'cherry'] });
    expect(comp.value).toEqual(['banana', 'cherry']);
    expect(hostChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('multiple mode clears to [] when only the empty default option is selected', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
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
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as SelectFieldComponent;
    const emitSpy = jest.fn();
    (comp as any).valueChange = { emit: emitSpy };

    const hostChangeSpy = jest.fn();
    page.root!.addEventListener('change', hostChangeSpy as any);

    const mockSelectEl = {
      options: [
        { value: '', selected: true },
        { value: 'ux', selected: false },
        { value: 'web', selected: false },
        { value: 'mobile', selected: false },
      ],
      selectedOptions: [{ value: '' }],
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      classList: { toggle: jest.fn() },
    } as any;

    (comp as any).selectEl = mockSelectEl;

    const applySpy = jest.spyOn(comp as any, 'applyMultiSelection');

    (comp as any).handleChange({ target: mockSelectEl });
    await page.waitForChanges();

    expect(comp.value).toEqual([]);
    expect(emitSpy).toHaveBeenCalledWith({ value: [] });
    expect(applySpy).toHaveBeenLastCalledWith(mockSelectEl, []);
    expect(hostChangeSpy).toHaveBeenCalledTimes(1);
    expect(comp.validation).toBe(true);
  });

  it('normalizes external multiple value [""] to [] via value watcher', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        label="Tags"
        select-field-id="tags-external"
        multiple
        options='[
          {"value":"ux","name":"UX"},
          {"value":"web","name":"Web"}
        ]'
      ></select-field-component>`,
    });

    await page.waitForChanges();

    const comp = page.rootInstance as SelectFieldComponent;

    (comp as any).selectEl = {
      options: [],
      classList: { toggle: jest.fn() },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    } as any;

    comp.value = [''];
    await page.waitForChanges();

    expect(comp.value).toEqual([]);
  });

  it('can parse options from array via watcher helper', async () => {
    const page = await newSpecPage({
      components: [SelectFieldComponent],
      html: `<select-field-component
        label="Fruit"
        select-field-id="fruit-array"
        value="apple"
      ></select-field-component>`,
    });

    const comp = page.rootInstance as SelectFieldComponent;

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
