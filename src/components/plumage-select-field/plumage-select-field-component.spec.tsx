// File: src/components/plumage-select-field/plumage-select-field-component.spec.tsx

import { Component, Prop, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PlumageSelectFieldComponent } from './plumage-select-field-component';

@Component({
  tag: 'form-component',
  shadow: false,
})
class MockFormComponent {
  @Prop() formId: string = '';
  @Prop() formLayout: '' | 'horizontal' | 'inline' = '';

  render() {
    return <slot />;
  }
}

function getHost(page: any): HTMLElement {
  const root = page.root as HTMLElement | null;

  if (root && root.tagName?.toLowerCase() === 'plumage-select-field-component') {
    return root;
  }

  const host = page.body.querySelector('plumage-select-field-component') as HTMLElement | null;

  if (!host) {
    throw new Error('plumage-select-field-component host not found');
  }

  return host;
}

function getSelect(page: any): HTMLSelectElement {
  const host = getHost(page);

  const select = host.querySelector('select') as HTMLSelectElement | null;

  if (!select) {
    throw new Error('select element not found');
  }

  return select;
}

function getAllOptions(page: any): HTMLOptionElement[] {
  return Array.from(getSelect(page).querySelectorAll('option')) as HTMLOptionElement[];
}

function getStencilContainer(page: any): HTMLElement {
  const host = getHost(page);

  const container = host.querySelector('.stencil-component') as HTMLElement | null;

  if (!container) {
    throw new Error('.stencil-component not found');
  }

  return container;
}

function getFormGroup(page: any): HTMLElement {
  const host = getHost(page);

  const group = host.querySelector('.form-group') as HTMLElement | null;

  if (!group) {
    throw new Error('.form-group not found');
  }

  return group;
}

function getLabel(page: any): HTMLLabelElement | null {
  return getHost(page).querySelector('label') as HTMLLabelElement | null;
}

function getInputContainer(page: any): HTMLElement {
  const host = getHost(page);

  const container = host.querySelector('.input-container') as HTMLElement | null;

  if (!container) {
    throw new Error('.input-container not found');
  }

  return container;
}

function getUnderline(page: any): HTMLDivElement {
  const host = getHost(page);

  const underline = host.querySelector('.b-underline') as HTMLDivElement | null;

  if (!underline) {
    throw new Error('.b-underline not found');
  }

  return underline;
}

function getFocusBar(page: any): HTMLDivElement {
  const host = getHost(page);

  const focusBar = host.querySelector('.b-focus') as HTMLDivElement | null;

  if (!focusBar) {
    throw new Error('.b-focus not found');
  }

  return focusBar;
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
    classList: {
      toggle: jest.fn(),
    },
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    value: selectedValues[0] ?? '',
  } as any;
}

describe('plumage-select-field-component', () => {
  const setup = async (html: string) => {
    return newSpecPage({
      components: [PlumageSelectFieldComponent, MockFormComponent],
      html,
    });
  };

  it('renders the stencil-component wrapper and default form structure', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Favorite Fruit"
        select-field-id="fruit"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const container = getStencilContainer(page);
    const formGroup = getFormGroup(page);
    const select = getSelect(page);
    const label = getLabel(page);

    expect(container.classList.contains('stencil-component')).toBe(true);

    expect(container.classList.contains('horizontal')).toBe(false);

    expect(container.classList.contains('inline')).toBe(false);

    expect(formGroup.className).toBe('form-group');

    expect(select).toBeTruthy();

    expect(label).toBeTruthy();

    expect(label?.getAttribute('for')).toBe('fruit');

    expect(select.getAttribute('id')).toBe('fruit');
  });

  it('sanitizes defaultOptionTxt and shows a blank default when provided (non-sortField)', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent, MockFormComponent],
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

    const select = getSelect(page);

    expect(select.getAttribute('aria-labelledby')).toBe('plumageSelect-label');

    expect(select.getAttribute('aria-readonly')).toBeNull();

    expect(select.getAttribute('aria-disabled')).toBeNull();

    expect(select.classList.contains('read-only')).toBe(false);
  });

  it('parses options JSON and selects matching value (single)', async () => {
    const page = await setup(`
      <plumage-select-field-component
        value="banana"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"},
          {"value":"cherry","name":"Cherry"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const options = getAllOptions(page);

    const banana = options.find(option => option.getAttribute('value') === 'banana');

    expect(banana).toBeTruthy();

    expect(banana!.hasAttribute('selected')).toBe(true);

    const select = getSelect(page);

    expect(select.getAttribute('aria-labelledby')).toBe('plumageSelect-label');

    expect(select.classList.contains('read-only')).toBe(false);
  });

  it('when id includes sortField: renders legacy "--none--", suppresses blank default, and none is not selected for value=""', async () => {
    const page = await setup(`
      <plumage-select-field-component
        id="some-sortField"
        value=""
        default-option-txt="Choose…"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const options = getAllOptions(page);

    const blank = options.find(option => option.getAttribute('value') === '');

    const legacyNone = options.find(option => option.getAttribute('value') === 'none');

    expect(blank).toBeUndefined();

    expect(legacyNone).toBeTruthy();

    expect(legacyNone!.textContent?.trim()).toBe('--none--');

    expect(legacyNone!.hasAttribute('selected')).toBe(false);

    const select = getSelect(page);

    expect(select.getAttribute('aria-labelledby')).toBe('some-sortField-label');

    expect(select.classList.contains('read-only')).toBe(false);
  });

  it('with value="none" and sortField: legacy none is selected', async () => {
    const page = await setup(`
      <plumage-select-field-component
        id="some-sortField"
        value="none"
        default-option-txt="Choose…"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const options = getAllOptions(page);

    const blank = options.find(option => option.getAttribute('value') === '');

    const legacyNone = options.find(option => option.getAttribute('value') === 'none');

    expect(blank).toBeUndefined();

    expect(legacyNone).toBeTruthy();

    expect(legacyNone!.hasAttribute('selected')).toBe(true);
  });

  it('marks label as required when blank and clears after a valid selection (single)', async () => {
    const page = await setup(`
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
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const host = getHost(page);

    const before = host.querySelector('label > span');

    expect(before?.classList.contains('required')).toBe(true);

    const select = getSelect(page);

    select.value = 'apple';

    select.dispatchEvent(
      new Event('change', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    const after = host.querySelector('label > span');

    expect(after?.classList.contains('required')).toBe(false);

    expect(select.getAttribute('aria-labelledby')).toBe('fruit-label');

    expect(select.getAttribute('aria-required')).toBe('true');

    expect(select.hasAttribute('required')).toBe(true);

    expect(select.classList.contains('read-only')).toBe(false);
  });

  it('does not apply invalid styling when required is true but validation is false', async () => {
    const page = await setup(`
      <plumage-select-field-component
        required
        label="Favorite Fruit"
        select-field-id="fruit-required-only"
        value=""
        default-option-txt="Pick one"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const toggleSpy = jest.fn();

    (comp as any).selectEl = {
      options: [
        {
          value: '',
          selected: true,
        },
        {
          value: 'apple',
          selected: false,
        },
        {
          value: 'banana',
          selected: false,
        },
      ],
      querySelectorAll: () => [
        {
          value: '',
          selected: true,
        },
        {
          value: 'apple',
          selected: false,
        },
        {
          value: 'banana',
          selected: false,
        },
      ],
      classList: {
        toggle: toggleSpy,
      },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    } as any;

    (comp as any).handleChange({
      target: (comp as any).selectEl,
    });

    await page.waitForChanges();

    expect(comp.validation).toBe(false);

    expect((comp as any).validationState).toBe(false);

    expect(toggleSpy).toHaveBeenLastCalledWith('is-invalid', false);

    const host = getHost(page);

    const label = host.querySelector('label');

    const msg = host.querySelector('.invalid-feedback');

    expect(label?.classList.contains('invalid')).toBe(false);

    expect(msg).toBeNull();
  });

  it('renders validation message and aria-invalid when validation is active', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Favorite Fruit"
        select-field-id="fruit-validation"
        required
        validation
        validation-message="Please select a fruit"
        value=""
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const host = getHost(page);
    const select = getSelect(page);
    const label = getLabel(page);

    const message = host.querySelector('.invalid-feedback') as HTMLElement | null;

    expect(message).toBeTruthy();

    expect(message?.textContent?.trim()).toBe('Please select a fruit');

    expect(select.classList.contains('is-invalid')).toBe(true);

    expect(select.getAttribute('aria-invalid')).toBe('true');

    expect(select.getAttribute('aria-describedby')).toContain(message!.id);

    expect(label?.classList.contains('invalid')).toBe(true);

    expect(getUnderline(page).classList.contains('invalid')).toBe(true);

    expect(getFocusBar(page).classList.contains('invalid')).toBe(true);
  });

  it('multiple + validation: selecting only default keeps invalid state and clears to []', async () => {
    const page = await setup(`
      <plumage-select-field-component
        multiple
        validation
        validation-message="Please choose at least one"
        default-option-txt="Pick one"
        options='[
          {"value":"a","name":"A"},
          {"value":"b","name":"B"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const mockSelectEl = makeMockSelect(['', 'a', 'b'], ['']);

    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({
      target: mockSelectEl,
    });

    await page.waitForChanges();

    expect((comp as any).valueState).toEqual([]);

    expect(comp.value).toEqual([]);

    expect((comp as any).validationState).toBe(true);

    expect(comp.validation).toBe(true);
  });

  it('multiple + validation accepts a real selection event payload', async () => {
    const page = await setup(`
      <plumage-select-field-component
        multiple
        validation
        validation-message="Please choose at least one"
        default-option-txt="Pick one"
        options='[
          {"value":"a","name":"A"},
          {"value":"b","name":"B"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const emitSpy = jest.fn();

    (comp as any).valueChange = {
      emit: emitSpy,
    };

    const hostChangeSpy = jest.fn();

    getHost(page).addEventListener('change', hostChangeSpy as any);

    const mockSelectEl = makeMockSelect(['', 'a', 'b'], ['b']);

    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({
      target: mockSelectEl,
    });

    await page.waitForChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);

    expect(emitSpy).toHaveBeenCalledWith(['b']);

    expect(hostChangeSpy).toHaveBeenCalledTimes(1);

    expect(comp.value).toEqual(['b']);

    expect((comp as any).valueState).toEqual(['b']);
  });

  it('multiple mode clears to [] when only the empty default option is selected', async () => {
    const page = await setup(`
      <plumage-select-field-component
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
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const emitSpy = jest.fn();

    (comp as any).valueChange = {
      emit: emitSpy,
    };

    const hostChangeSpy = jest.fn();

    getHost(page).addEventListener('change', hostChangeSpy as any);

    const mockSelectEl = makeMockSelect(['', 'ux', 'web', 'mobile'], ['']);

    (comp as any).selectEl = mockSelectEl;

    const applySpy = jest.spyOn(comp as any, 'applyMultiSelection');

    (comp as any).handleChange({
      target: mockSelectEl,
    });

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
    const page = await setup(`
      <plumage-select-field-component
        label="Tags"
        select-field-id="tags-external"
        multiple
        options='[
          {"value":"ux","name":"UX"},
          {"value":"web","name":"Web"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    (comp as any).selectEl = {
      options: [],
      querySelectorAll: () => [],
      classList: {
        toggle: jest.fn(),
      },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
    } as any;

    comp.value = [''];

    await page.waitForChanges();

    expect((comp as any).valueState).toEqual([]);

    expect(comp.value).toEqual([]);
  });

  it('does not apply invalid styling in multiple mode when validation is false', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Tags"
        select-field-id="tags-no-validation"
        multiple
        required
        default-option-txt="Choose tags"
        options='[
          {"value":"ux","name":"UX"},
          {"value":"web","name":"Web"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const mockSelectEl = makeMockSelect(['', 'ux', 'web'], ['']);

    const toggleSpy = jest.fn();

    mockSelectEl.classList.toggle = toggleSpy;

    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({
      target: mockSelectEl,
    });

    await page.waitForChanges();

    expect((comp as any).valueState).toEqual([]);

    expect(comp.value).toEqual([]);

    expect((comp as any).validationState).toBe(false);

    expect(comp.validation).toBe(false);

    expect(toggleSpy).toHaveBeenLastCalledWith('is-invalid', false);
  });

  it('adds read-only class when readOnly is true', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Favorite Fruit"
        select-field-id="fruit-readonly"
        read-only
        value="banana"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    expect(select.hasAttribute('disabled')).toBe(true);

    expect(select.getAttribute('aria-readonly')).toBe('true');

    expect(select.getAttribute('aria-disabled')).toBe('true');

    expect(select.classList.contains('read-only')).toBe(true);

    expect(getUnderline(page).classList.contains('disabled')).toBe(true);

    expect(getFocusBar(page).classList.contains('disabled')).toBe(true);
  });

  it('suppresses validation message when readOnly and validation is true', async () => {
    const page = await setup(`
      <plumage-select-field-component
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
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const toggleSpy = jest.fn();

    (comp as any).selectEl = {
      options: [
        {
          value: '',
          selected: true,
        },
        {
          value: 'apple',
          selected: false,
        },
        {
          value: 'banana',
          selected: false,
        },
      ],
      querySelectorAll: () => [
        {
          value: '',
          selected: true,
        },
        {
          value: 'apple',
          selected: false,
        },
        {
          value: 'banana',
          selected: false,
        },
      ],
      classList: {
        toggle: toggleSpy,
      },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      value: '',
    } as any;

    (comp as any).handleChange({
      target: (comp as any).selectEl,
    });

    await page.waitForChanges();

    const select = getSelect(page);

    const msg = getHost(page).querySelector('.invalid-feedback') as HTMLElement | null;

    expect(select.hasAttribute('disabled')).toBe(true);

    expect(select.classList.contains('read-only')).toBe(true);

    expect(select.getAttribute('aria-readonly')).toBe('true');

    expect(select.getAttribute('aria-disabled')).toBe('true');

    expect(toggleSpy).toHaveBeenLastCalledWith('is-invalid', false);

    expect(msg).toBeNull();
  });

  it('supports disabled without adding read-only class', async () => {
    const page = await setup(`
      <plumage-select-field-component
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
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const toggleSpy = jest.fn();

    (comp as any).selectEl = {
      options: [
        {
          value: '',
          selected: true,
        },
        {
          value: 'apple',
          selected: false,
        },
        {
          value: 'banana',
          selected: false,
        },
      ],
      querySelectorAll: () => [
        {
          value: '',
          selected: true,
        },
        {
          value: 'apple',
          selected: false,
        },
        {
          value: 'banana',
          selected: false,
        },
      ],
      classList: {
        toggle: toggleSpy,
      },
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      value: '',
    } as any;

    (comp as any).handleChange({
      target: (comp as any).selectEl,
    });

    await page.waitForChanges();

    const select = getSelect(page);

    const msg = getHost(page).querySelector('.invalid-feedback') as HTMLElement | null;

    expect(select.hasAttribute('disabled')).toBe(true);

    expect(select.getAttribute('aria-disabled')).toBe('true');

    expect(select.getAttribute('aria-readonly')).toBeNull();

    expect(select.classList.contains('read-only')).toBe(false);

    expect(toggleSpy).toHaveBeenLastCalledWith('is-invalid', false);

    expect(msg).toBeNull();

    expect(getUnderline(page).classList.contains('disabled')).toBe(true);

    expect(getFocusBar(page).classList.contains('disabled')).toBe(true);
  });

  it('supports a11y override props: aria-labelledby wins over aria-label and aria-describedby is forwarded', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent, MockFormComponent],
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

    const host = getHost(page);

    const select = host.querySelector('select') as HTMLSelectElement;

    expect(select.getAttribute('aria-labelledby')).toBe('external-label');

    expect(select.getAttribute('aria-label')).toBeNull();

    expect(select.getAttribute('aria-describedby')).toBe('external-help');
  });

  it('uses aria-label instead of aria-labelledby when label is hidden', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Favorite Fruit"
        label-hidden
        select-field-id="fruit-hidden-label"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    expect(getLabel(page)).toBeNull();

    expect(select.getAttribute('aria-label')).toBe('Favorite Fruit');

    expect(select.getAttribute('aria-labelledby')).toBeNull();
  });

  it('uses explicit aria-label when no aria-labelledby override is provided', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label-hidden
        select-field-id="fruit-aria-label"
        aria-label="Custom fruit selector"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    expect(select.getAttribute('aria-label')).toBe('Custom fruit selector');

    expect(select.getAttribute('aria-labelledby')).toBeNull();
  });

  it('supports multiple selection and emits array payload', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruits"
        select-field-id="fruits"
        multiple
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"},
          {"value":"cherry","name":"Cherry"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const emitSpy = jest.fn();

    (comp as any).valueChange = {
      emit: emitSpy,
    };

    const hostChangeSpy = jest.fn();

    getHost(page).addEventListener('change', hostChangeSpy as any);

    const mockSelectEl = makeMockSelect(['', 'apple', 'banana', 'cherry'], ['banana', 'cherry']);

    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({
      target: mockSelectEl,
    });

    await page.waitForChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);

    expect(emitSpy).toHaveBeenCalledWith(['banana', 'cherry']);

    expect(comp.value).toEqual(['banana', 'cherry']);

    expect((comp as any).valueState).toEqual(['banana', 'cherry']);

    expect(hostChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('renders multiple class and multiple attribute in multiple mode', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruits"
        select-field-id="fruits-multiple"
        multiple
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    expect(select.hasAttribute('multiple')).toBe(true);

    expect(select.classList.contains('multi')).toBe(true);
  });

  it('can parse options from array via watcher helper', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-array"
        value="apple"
      ></plumage-select-field-component>
    `);

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    (comp as any).onOptionsChange([
      {
        value: 'apple',
        name: 'Apple',
      },
      {
        value: 'banana',
        name: 'Banana',
      },
    ]);

    await page.waitForChanges();

    const options = getAllOptions(page);

    expect(options.map(option => option.getAttribute('value'))).toEqual(['', 'apple', 'banana']);

    expect(options[1].hasAttribute('selected')).toBe(true);
  });

  it('renders custom select class when custom is true', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-custom"
        custom
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    expect(select.classList.contains('custom-select')).toBe(true);

    expect(select.classList.contains('form-select')).toBe(false);
  });

  it('renders default form-select class when custom is false', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-default"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    expect(select.classList.contains('form-select')).toBe(true);

    expect(select.classList.contains('custom-select')).toBe(false);
  });

  it('applies size and custom classes to the select', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-sized"
        size="lg"
        classes="extra-select-class another-class"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    expect(select.classList.contains('form-select-lg')).toBe(true);

    expect(select.classList.contains('extra-select-class')).toBe(true);

    expect(select.classList.contains('another-class')).toBe(true);
  });

  it('renders small size class', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-small"
        size="sm"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    expect(getSelect(page).classList.contains('form-select-sm')).toBe(true);
  });

  it('applies fieldHeight as the native select size attribute', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-height"
        field-height="4"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"},
          {"value":"cherry","name":"Cherry"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    expect(getSelect(page).getAttribute('size')).toBe('4');
  });

  it('applies explicit formId to the native select', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-form"
        form-id="external-form"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const host = getHost(page) as any;

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    expect(host.formId).toBe('external-form');

    expect((comp as any)._resolvedFormId).toBe('external-form');

    expect(getSelect(page).getAttribute('form')).toBe('external-form');
  });

  it('updates native select form attribute when formId changes', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-form-watch"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const host = getHost(page) as any;

    host.formId = 'updated-form';

    await page.waitForChanges();

    expect(getSelect(page).getAttribute('form')).toBe('updated-form');

    host.formId = '';

    await page.waitForChanges();

    expect(getSelect(page).hasAttribute('form')).toBe(false);
  });

  it('inherits formId and horizontal formLayout from parent form-component', async () => {
    const page = await setup(`
      <form-component
        form-id="parent-form"
        form-layout="horizontal"
      >
        <plumage-select-field-component
          label="Fruit"
          select-field-id="fruit-parent-form"
          options='[
            {"value":"apple","name":"Apple"},
            {"value":"banana","name":"Banana"}
          ]'
        ></plumage-select-field-component>
      </form-component>
    `);

    await page.waitForChanges();

    const container = getStencilContainer(page);

    const formGroup = getFormGroup(page);

    const select = getSelect(page);

    expect(select.getAttribute('form')).toBe('parent-form');

    expect(container.classList.contains('horizontal')).toBe(true);

    expect(formGroup.classList.contains('row')).toBe(true);
  });

  it('renders horizontal layout classes and numeric columns', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-horizontal"
        form-layout="horizontal"
        label-col="3"
        input-col="9"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const container = getStencilContainer(page);

    const formGroup = getFormGroup(page);

    const label = getLabel(page) as HTMLLabelElement;

    const inputCol = label.nextElementSibling as HTMLElement;

    expect(container.classList.contains('stencil-component')).toBe(true);

    expect(container.classList.contains('horizontal')).toBe(true);

    expect(formGroup.classList.contains('row')).toBe(true);

    expect(label.classList.contains('col-3')).toBe(true);

    expect(inputCol.classList.contains('col-9')).toBe(true);
  });

  it('renders responsive column classes in horizontal layout', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-responsive"
        form-layout="horizontal"
        label-cols="xs-12 sm-4"
        input-cols="xs-12 sm-8"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page) as HTMLLabelElement;

    const inputCol = label.nextElementSibling as HTMLElement;

    expect(label.classList.contains('col-12')).toBe(true);

    expect(label.classList.contains('col-sm-4')).toBe(true);

    expect(inputCol.classList.contains('col-12')).toBe(true);

    expect(inputCol.classList.contains('col-sm-8')).toBe(true);
  });

  it('uses full-width input column when label is hidden in horizontal layout', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        label-hidden
        select-field-id="fruit-hidden-horizontal"
        form-layout="horizontal"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const formGroup = getFormGroup(page);

    const inputCol = formGroup.firstElementChild as HTMLElement;

    expect(getLabel(page)).toBeNull();

    expect(inputCol.classList.contains('col-12')).toBe(true);

    expect(inputCol.querySelector('select')).toBeTruthy();
  });

  it('renders inline layout classes', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-inline"
        form-layout="inline"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const container = getStencilContainer(page);

    const formGroup = getFormGroup(page);

    expect(container.classList.contains('inline')).toBe(true);

    expect(formGroup.classList.contains('row')).toBe(true);

    expect(formGroup.classList.contains('inline')).toBe(true);
  });

  it('renders label size and alignment classes', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-label-style"
        label-size="lg"
        label-align="right"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page) as HTMLLabelElement;

    expect(label.classList.contains('label-lg')).toBe(true);

    expect(label.classList.contains('align-right')).toBe(true);
  });

  it('adds a colon to label text in horizontal layout', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-horizontal-label"
        form-layout="horizontal"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    expect(getLabel(page)?.textContent?.trim()).toContain('Fruit:');
  });

  it('expands underline focus bar on select focus and collapses it on blur', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-focus"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    const focusBar = getFocusBar(page);

    select.dispatchEvent(new Event('focus'));

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    expect(focusBar.style.left).toBe('0');

    select.dispatchEvent(new Event('blur'));

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');
  });

  it('expands underline focus bar when input-container is clicked', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-container-focus"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const container = getInputContainer(page);

    const focusBar = getFocusBar(page);

    container.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    expect(focusBar.style.left).toBe('0');
  });

  it('does not expand underline when disabled', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-disabled-focus"
        disabled
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const container = getInputContainer(page);

    const focusBar = getFocusBar(page);

    container.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).not.toBe('100%');
  });

  it('does not expand underline when read-only', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-readonly-focus"
        read-only
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const container = getInputContainer(page);

    const focusBar = getFocusBar(page);

    container.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).not.toBe('100%');
  });

  it('collapses underline on outside document click', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-outside-click"
        options='[
          {"value":"apple","name":"Apple"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const select = getSelect(page);

    const focusBar = getFocusBar(page);

    select.dispatchEvent(new Event('focus'));

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    page.doc.body.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');
  });

  it('updates single value from an external value prop change', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-external-value"
        value="apple"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const host = getHost(page) as any;

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    host.value = 'banana';

    await page.waitForChanges();

    expect((comp as any).valueState).toBe('banana');

    expect(getSelect(page).value).toBe('banana');
  });

  it('reverts attempted changes while read-only', async () => {
    const page = await setup(`
      <plumage-select-field-component
        label="Fruit"
        select-field-id="fruit-readonly-change"
        read-only
        value="apple"
        options='[
          {"value":"apple","name":"Apple"},
          {"value":"banana","name":"Banana"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    const mockSelectEl = makeMockSelect(['', 'apple', 'banana'], ['banana']);

    mockSelectEl.value = 'banana';

    (comp as any).selectEl = mockSelectEl;

    (comp as any).handleChange({
      target: mockSelectEl,
    });

    expect(mockSelectEl.value).toBe('apple');

    expect(comp.value).toBe('apple');
  });

  it('merges external aria-describedby with validation message id', async () => {
    const page = await newSpecPage({
      components: [PlumageSelectFieldComponent, MockFormComponent],
      template: () => (
        <div>
          <div id="external-help">External help</div>

          <plumage-select-field-component
            label="Fruit"
            select-field-id="fruit-described-validation"
            required
            validation
            validation-message="Please choose a fruit"
            aria-describedby="external-help"
            value=""
            options='[
              {"value":"apple","name":"Apple"},
              {"value":"banana","name":"Banana"}
            ]'
          />
        </div>
      ),
    });

    await page.waitForChanges();

    const select = getSelect(page);

    const message = getHost(page).querySelector('.invalid-feedback') as HTMLElement;

    const describedBy = select.getAttribute('aria-describedby') || '';

    expect(describedBy).toContain('external-help');

    expect(describedBy).toContain(message.id);
  });

  it('updates sortField value from sort-field-updated event when withTable is enabled', async () => {
    const page = await setup(`
      <plumage-select-field-component
        id="table-sortField"
        with-table
        value="none"
        options='[
          {"value":"name","name":"Name"},
          {"value":"date","name":"Date"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    window.dispatchEvent(
      new CustomEvent('sort-field-updated', {
        detail: {
          value: 'date',
        },
      }),
    );

    await page.waitForChanges();

    expect(comp.value).toBe('date');

    expect((comp as any).valueState).toBe('date');

    expect(getSelect(page).value).toBe('date');
  });

  it('updates sortOrder value from sort-order-updated event when withTable is enabled', async () => {
    const page = await setup(`
      <plumage-select-field-component
        id="table-sortOrder"
        with-table
        value="asc"
        options='[
          {"value":"asc","name":"Ascending"},
          {"value":"desc","name":"Descending"}
        ]'
      ></plumage-select-field-component>
    `);

    await page.waitForChanges();

    const comp = page.rootInstance as PlumageSelectFieldComponent;

    window.dispatchEvent(
      new CustomEvent('sort-order-updated', {
        detail: {
          value: 'desc',
        },
      }),
    );

    await page.waitForChanges();

    expect(comp.value).toBe('desc');

    expect((comp as any).valueState).toBe('desc');

    expect(getSelect(page).value).toBe('desc');
  });
});
