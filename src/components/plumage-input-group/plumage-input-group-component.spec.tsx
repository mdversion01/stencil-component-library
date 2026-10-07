// File: src/components/plumage-input-group/plumage-input-group-component.spec.tsx

import { Component, Prop, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PlumageInputGroupComponent } from './plumage-input-group-component';

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

function normalize(html: string) {
  return html
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function q<T extends Element = HTMLElement>(root: ParentNode, selectors: string[]): T | null {
  for (const selector of selectors) {
    const node = root.querySelector(selector);

    if (node) {
      return node as T;
    }
  }

  return null;
}

function qa<T extends Element = HTMLElement>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll(selector)) as T[];
}

function getHost(page: any): HTMLElement {
  const root = page.root as HTMLElement | null;

  if (root && root.tagName?.toLowerCase() === 'plumage-input-group-component') {
    return root;
  }

  const host = page.body.querySelector('plumage-input-group-component') as HTMLElement | null;

  if (!host) {
    throw new Error('plumage-input-group-component host not found');
  }

  return host;
}

function getStencilContainer(page: any): HTMLElement {
  const container = getHost(page).querySelector('.stencil-component') as HTMLElement | null;

  if (!container) {
    throw new Error('.stencil-component not found');
  }

  return container;
}

function getFormGroup(page: any): HTMLElement {
  const formGroup = getHost(page).querySelector('.form-group') as HTMLElement | null;

  if (!formGroup) {
    throw new Error('.form-group not found');
  }

  return formGroup;
}

function getInputGroup(page: any): HTMLElement {
  const inputGroup = getHost(page).querySelector('.input-group') as HTMLElement | null;

  if (!inputGroup) {
    throw new Error('.input-group not found');
  }

  return inputGroup;
}

function getInputWrapper(page: any): HTMLElement {
  const wrapper = getHost(page).querySelector('.ig-wrapper') as HTMLElement | null;

  if (!wrapper) {
    throw new Error('.ig-wrapper not found');
  }

  return wrapper;
}

function getInput(page: any): HTMLInputElement {
  const input = getHost(page).querySelector('input.form-control') as HTMLInputElement | null;

  if (!input) {
    throw new Error('input.form-control not found');
  }

  return input;
}

function getSearchInput(page: any): HTMLInputElement {
  const input = getHost(page).querySelector('input.search-bar') as HTMLInputElement | null;

  if (!input) {
    throw new Error('input.search-bar not found');
  }

  return input;
}

function getLabel(page: any): HTMLLabelElement {
  const label = getHost(page).querySelector('label') as HTMLLabelElement | null;

  if (!label) {
    throw new Error('label not found');
  }

  return label;
}

function getUnderline(page: any): HTMLDivElement {
  const underline = getHost(page).querySelector('.b-underline') as HTMLDivElement | null;

  if (!underline) {
    throw new Error('.b-underline not found');
  }

  return underline;
}

function getFocusBar(page: any): HTMLDivElement {
  const focusBar = getHost(page).querySelector('.b-focus') as HTMLDivElement | null;

  if (!focusBar) {
    throw new Error('.b-focus not found');
  }

  return focusBar;
}

function getLabelFor(label: HTMLLabelElement) {
  return label.getAttribute('for') || (label as any).htmlFor || label.getAttribute('htmlfor') || '';
}

function idRefs(value: string | null | undefined): string[] {
  return String(value || '')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean);
}

function escapeAttrValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function byId(root: ParentNode, id: string): Element | null {
  return root.querySelector(`[id="${escapeAttrValue(id)}"]`);
}

describe('<plumage-input-group-component>', () => {
  const setup = async (html: string) => {
    return newSpecPage({
      components: [PlumageInputGroupComponent, MockFormComponent],
      html,
    });
  };

  it('renders stacked defaults and matches snapshot', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Username"
        input-id="user"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);
    const stencilContainer = getStencilContainer(page);
    const formGroup = getFormGroup(page);
    const inputGroup = getInputGroup(page);
    const wrapper = getInputWrapper(page);
    const label = getLabel(page);
    const input = getInput(page);

    expect(root).toBeTruthy();

    expect(stencilContainer.classList.contains('stencil-component')).toBe(true);

    expect(stencilContainer.classList.contains('horizontal')).toBe(false);

    expect(stencilContainer.classList.contains('inline')).toBe(false);

    expect(formGroup.classList.contains('form-group')).toBe(true);

    expect(formGroup.classList.contains('form-input-group')).toBe(true);

    expect(inputGroup).toBeTruthy();

    expect(wrapper).toBeTruthy();

    expect(wrapper.contains(input)).toBe(true);

    expect((label.textContent || '').trim()).toContain('Username');

    expect(input.id).toBe('user');

    expect(input.name).toBe('user');

    expect(input.placeholder).toBe('Username');

    expect(label.id).toBe('user-label');

    expect(getLabelFor(label)).toBe('user');

    expect(input.getAttribute('aria-labelledby')).toBe('user-label');

    expect(input.getAttribute('aria-label')).toBeNull();

    expect(input.getAttribute('aria-invalid')).toBe('false');

    expect(input.getAttribute('aria-required')).toBeNull();

    expect(input.getAttribute('aria-disabled')).toBeNull();

    expect(input.getAttribute('aria-readonly')).toBeNull();

    expect(normalize(root.outerHTML)).toMatchSnapshot('stacked-default');
  });

  it('renders horizontal layout with responsive cols, prepend text and append icon', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Amount"
        input-id="amount"
        form-layout="horizontal"
        label-cols="xs-12 sm-4"
        input-cols="xs-12 sm-8"
        has-prepend
        prepend-text="Total"
        has-append
        append-icon="fa-solid fa-dollar-sign"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);
    const stencilContainer = getStencilContainer(page);
    const formGroup = getFormGroup(page);
    const input = getInput(page);
    const label = getLabel(page);

    expect(stencilContainer.classList.contains('horizontal')).toBe(true);

    expect(formGroup.classList.contains('row')).toBe(true);

    expect(formGroup.classList.contains('horizontal')).toBe(true);

    expect(input.id).toBe('amount');

    expect((label.textContent || '').trim()).toContain('Amount:');

    const horizontalLabel = root.querySelector('label.col-12.col-sm-4') as HTMLElement | null;

    const horizontalInputWrap = root.querySelector('.col-12.col-sm-8') as HTMLElement | null;

    expect(horizontalLabel).toBeTruthy();

    expect(horizontalInputWrap).toBeTruthy();

    const prepend = q(root, ['#amount-prepend.input-group-text', '#amount-prepend']);

    expect(prepend).toBeTruthy();

    expect((prepend?.textContent || '').trim()).toContain('Total');

    const dollarIcon = q(root, ['.fa-dollar-sign', '.fa-solid.fa-dollar-sign', 'i[class*="fa-dollar-sign"]']);

    expect(dollarIcon).toBeTruthy();

    const described = idRefs(input.getAttribute('aria-describedby'));

    expect(described).toEqual(expect.arrayContaining(['amount-prepend', 'amount-append']));

    expect(byId(root, 'amount-prepend')).toBeTruthy();

    expect(byId(root, 'amount-append')).toBeTruthy();

    expect(normalize(root.outerHTML)).toMatchSnapshot('horizontal-prepend-text-append-icon');
  });

  it('renders inline layout classes', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Username"
        input-id="inline-user"
        form-layout="inline"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const stencilContainer = getStencilContainer(page);

    const formGroup = getFormGroup(page);

    expect(stencilContainer.classList.contains('inline')).toBe(true);

    expect(formGroup.classList.contains('row')).toBe(true);

    expect(formGroup.classList.contains('inline')).toBe(true);

    expect(getLabel(page).textContent).toContain('Username:');
  });

  it('renders horizontal numeric columns', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Amount"
        input-id="amount-cols"
        form-layout="horizontal"
        label-col="3"
        input-col="9"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    const inputColumn = label.nextElementSibling as HTMLElement;

    expect(label.classList.contains('col-3')).toBe(true);

    expect(inputColumn.classList.contains('col-9')).toBe(true);
  });

  it('uses full-width input column when label is hidden in horizontal layout', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Amount"
        input-id="hidden-horizontal"
        form-layout="horizontal"
        label-hidden
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    const inputColumn = label.nextElementSibling as HTMLElement;

    expect(label.classList.contains('sr-only')).toBe(true);

    expect(inputColumn.classList.contains('col-12')).toBe(true);
  });

  it('applies label size and alignment classes', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Username"
        input-id="styled-label"
        label-size="lg"
        label-align="right"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    expect(label.classList.contains('label-lg')).toBe(true);

    expect(label.classList.contains('align-right')).toBe(true);
  });

  it('size="lg" applies the input-group-lg class', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="City"
        input-id="city"
        size="lg"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    expect(getInputGroup(page).className).toContain('input-group-lg');
  });

  it('size="sm" applies the input-group-sm class', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="City"
        input-id="city-small"
        size="sm"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    expect(getInputGroup(page).className).toContain('input-group-sm');
  });

  it('renders required marker and aria-required', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Username"
        input-id="required-user"
        required
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const label = getLabel(page);

    const input = getInput(page);

    const requiredMarks = qa<HTMLElement>(root, '.required');

    expect(requiredMarks.length).toBeGreaterThan(0);

    expect(label.textContent).toContain('*');

    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('shows validation UI and message when validation=true; wires aria-describedby + aria-invalid', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Email"
        input-id="email"
        validation
        validation-message="Required field."
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const input = getInput(page);

    expect(input.classList.contains('is-invalid')).toBe(true);

    expect(input.getAttribute('aria-invalid')).toBe('true');

    expect(getInputGroup(page).classList.contains('is-invalid')).toBe(true);

    expect(getUnderline(page).classList.contains('invalid')).toBe(true);

    expect(getFocusBar(page).classList.contains('invalid')).toBe(true);

    expect(getLabel(page).classList.contains('invalid')).toBe(true);

    const described = idRefs(input.getAttribute('aria-describedby'));

    expect(described).toContain('email-validation');

    const feedback = root.querySelector('#email-validation') as HTMLElement | null;

    expect(feedback).toBeTruthy();

    expect(feedback!.className).toContain('invalid-feedback');

    expect(feedback!.textContent).toContain('Required field.');

    expect((feedback!.getAttribute('aria-live') || '').toLowerCase()).toBe('polite');
  });

  it('updates validation state when validation prop changes', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Email"
        input-id="email-validation-watch"
        validation-message="Invalid email."
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputGroupComponent;

    component.validation = true;

    await page.waitForChanges();

    expect((component as any).validationState).toBe(true);

    expect(getInput(page).classList.contains('is-invalid')).toBe(true);

    component.validation = false;

    await page.waitForChanges();

    expect((component as any).validationState).toBe(false);

    expect(getInput(page).classList.contains('is-invalid')).toBe(false);
  });

  it('underline expands on focus and collapses on blur', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Phone"
        input-id="phone"
        has-prepend
        prepend-text="+1"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const input = getInput(page);

    const focusBar = getFocusBar(page);

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');

    input.dispatchEvent(
      new FocusEvent('focus', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    expect(focusBar.style.left).toBe('0');

    input.dispatchEvent(
      new FocusEvent('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');
  });

  it('underline expands on input-group interaction and collapses on outside click', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Phone"
        input-id="phone-group-click"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const inputGroup = getInputGroup(page);

    const focusBar = getFocusBar(page);

    inputGroup.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    expect(focusBar.style.left).toBe('0');

    page.doc.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');
  });

  it('applies explicit formId to the native input', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Zip"
        input-id="zip-form"
        form-id="external-form"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputGroupComponent;

    expect(component.formId).toBe('external-form');

    expect(component._resolvedFormId).toBe('external-form');

    expect(getInput(page).getAttribute('form')).toBe('external-form');
  });

  it('applies and updates the form attribute when formId changes', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Zip"
        input-id="zip"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputGroupComponent;

    expect(getInput(page).getAttribute('form')).toBeNull();

    component.formId = 'formA';

    await page.waitForChanges();

    expect(component._resolvedFormId).toBe('formA');

    expect(getInput(page).getAttribute('form')).toBe('formA');

    component.formId = 'formB';

    await page.waitForChanges();

    expect(component._resolvedFormId).toBe('formB');

    expect(getInput(page).getAttribute('form')).toBe('formB');

    component.formId = '';

    await page.waitForChanges();

    expect(getInput(page).hasAttribute('form')).toBe(false);
  });

  it('inherits formId and horizontal formLayout from parent form-component', async () => {
    const page = await setup(`
      <form-component
        form-id="parent-form"
        form-layout="horizontal"
      >
        <plumage-input-group-component
          label="Username"
          input-id="parent-user"
        ></plumage-input-group-component>
      </form-component>
    `);

    await page.waitForChanges();

    const component = page.body.querySelector('plumage-input-group-component') as any;

    const input = component.querySelector('input.form-control') as HTMLInputElement;

    const stencilContainer = component.querySelector('.stencil-component') as HTMLElement;

    const formGroup = component.querySelector('.form-group') as HTMLElement;

    expect(component.formId).toBe('parent-form');

    expect(component.formLayout).toBe('horizontal');

    expect(input.getAttribute('form')).toBe('parent-form');

    expect(stencilContainer.classList.contains('horizontal')).toBe(true);

    expect(formGroup.classList.contains('row')).toBe(true);

    expect(formGroup.classList.contains('horizontal')).toBe(true);
  });

  it('emits valueChange and DOM "change" on input; sanitizes angle brackets', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Country"
        input-id="country"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const input = getInput(page);

    const stencilSpy = jest.fn();

    const domSpy = jest.fn();

    root.addEventListener('valueChange', stencilSpy as any);

    root.addEventListener('change', domSpy as any);

    input.value = 'U<S>A';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(stencilSpy).toHaveBeenCalled();

    expect(domSpy).toHaveBeenCalled();

    expect(getInput(page).value).toBe('USA');
  });

  it('sanitizes control characters and collapses whitespace', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Name"
        input-id="sanitized-name"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const input = getInput(page);

    input.value = '  John\u0007   Smith  ';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(getInput(page).value).toBe('John Smith');
  });

  it('limits sanitized input to 512 characters', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Long Value"
        input-id="long-value"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const input = getInput(page);

    input.value = 'a'.repeat(600);

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(getInput(page).value.length).toBe(512);
  });

  it('syncs native input when value prop changes externally', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Country"
        input-id="country-external"
        value="Start"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputGroupComponent;

    expect(getInput(page).value).toBe('Start');

    component.value = 'Updated externally';

    await page.waitForChanges();

    expect(getInput(page).value).toBe('Updated externally');
  });

  it('renders readonly state on the native input and underline', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Account"
        input-id="readonly-account"
        read-only
        value="Locked"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const input = getInput(page);

    expect(input.hasAttribute('readonly')).toBe(true);

    expect(input.hasAttribute('disabled')).toBe(false);

    expect(input.classList.contains('read-only')).toBe(true);

    expect(input.getAttribute('aria-readonly')).toBe('true');

    expect(input.getAttribute('aria-disabled')).toBeNull();

    expect(getLabel(page).classList.contains('read-only')).toBe(true);

    expect(getUnderline(page).classList.contains('disabled')).toBe(true);

    expect(getFocusBar(page).classList.contains('disabled')).toBe(true);
  });

  it('renders disabled state on the native input and input group', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Account"
        input-id="disabled-account"
        disabled
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const input = getInput(page);

    expect(input.hasAttribute('disabled')).toBe(true);

    expect(input.getAttribute('aria-disabled')).toBe('true');

    expect(input.getAttribute('aria-readonly')).toBeNull();

    expect(input.classList.contains('read-only')).toBe(false);

    expect(getInputGroup(page).classList.contains('disabled')).toBe(true);

    expect(getUnderline(page).classList.contains('disabled')).toBe(true);

    expect(getFocusBar(page).classList.contains('disabled')).toBe(true);
  });

  it('supports external aria-labelledby and aria-describedby', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent, MockFormComponent],
      template: () => (
        <div>
          <div id="external-label">External label</div>

          <div id="external-help">External help</div>

          <plumage-input-group-component
            label="Internal label"
            input-id="a11y-input"
            aria-label="Fallback label"
            aria-labelledby="external-label"
            aria-describedby="external-help"
          />
        </div>
      ),
    });

    await page.waitForChanges();

    const input = getInput(page);

    expect(input.getAttribute('aria-labelledby')).toBe('external-label');

    expect(input.getAttribute('aria-label')).toBeNull();

    expect(input.getAttribute('aria-describedby')).toBe('external-help');
  });

  it('merges external aria-describedby with affix and validation ids', async () => {
    const page = await newSpecPage({
      components: [PlumageInputGroupComponent, MockFormComponent],
      template: () => (
        <div>
          <div id="external-help">External help</div>

          <plumage-input-group-component
            label="Amount"
            input-id="a11y-amount"
            aria-describedby="external-help"
            has-prepend
            prepend-text="$"
            has-append
            append-text="USD"
            validation
            validation-message="Invalid amount."
          />
        </div>
      ),
    });

    await page.waitForChanges();

    const described = idRefs(getInput(page).getAttribute('aria-describedby'));

    expect(described).toEqual(expect.arrayContaining(['external-help', 'a11y-Amount-prepend', 'a11y-Amount-append', 'a11y-Amount-validation']));
  });

  it('renders append native button from props with ids and emits appendClick', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Search"
        input-id="search"
        has-append
        append-button
        append-text="Go"
        append-button-variant="secondary"
        append-id="search-append-wrap"
        append-button-id="search-append-btn"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const appendWrap = root.querySelector('#search-append-wrap') as HTMLElement | null;

    const appendButton = root.querySelector('#search-append-btn') as HTMLButtonElement | null;

    const appendSpy = jest.fn();

    root.addEventListener('appendClick', appendSpy as any);

    expect(appendWrap).toBeTruthy();

    expect(appendWrap?.classList.contains('append-btn')).toBe(true);

    expect(appendButton).toBeTruthy();

    expect(appendButton?.className).toContain('input-group-btn');

    expect(appendButton?.className).not.toContain('btn-secondary');

    expect(appendButton?.getAttribute('type')).toBe('button');

    expect((appendButton?.textContent || '').trim()).toBe('Go');

    expect(appendButton?.hasAttribute('disabled')).toBe(false);

    appendButton!.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(appendSpy).toHaveBeenCalledTimes(1);

    expect(appendSpy.mock.calls[0][0].detail.originalEvent).toBeInstanceOf(MouseEvent);
  });

  it('renders prepend native button from props with ids and emits prependClick', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Search"
        input-id="search-prepend"
        has-prepend
        prepend-button
        prepend-text="Back"
        prepend-button-variant="primary"
        prepend-id="search-prepend-wrap"
        prepend-button-id="search-prepend-btn"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const prependWrap = root.querySelector('#search-prepend-wrap') as HTMLElement | null;

    const prependButton = root.querySelector('#search-prepend-btn') as HTMLButtonElement | null;

    const prependSpy = jest.fn();

    root.addEventListener('prependClick', prependSpy as any);

    expect(prependWrap).toBeTruthy();

    expect(prependWrap?.classList.contains('prepend-btn')).toBe(true);

    expect(prependButton).toBeTruthy();

    expect(prependButton?.className).toContain('input-group-btn');

    expect(prependButton?.className).not.toContain('btn-primary');

    expect(prependButton?.getAttribute('type')).toBe('button');

    expect((prependButton?.textContent || '').trim()).toBe('Back');

    expect(prependButton?.hasAttribute('disabled')).toBe(false);

    prependButton!.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(prependSpy).toHaveBeenCalledTimes(1);

    expect(prependSpy.mock.calls[0][0].detail.originalEvent).toBeInstanceOf(MouseEvent);
  });

  it('applies configured affix button types and aria labels', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Search"
        input-id="affix-button-options"
        has-prepend
        prepend-button
        prepend-text="Reset"
        prepend-button-type="reset"
        prepend-aria-label="Reset value"
        prepend-button-id="reset-button"
        has-append
        append-button
        append-text="Submit"
        append-button-type="submit"
        append-aria-label="Submit value"
        append-button-id="submit-button"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const prependButton = root.querySelector('#reset-button') as HTMLButtonElement;

    const appendButton = root.querySelector('#submit-button') as HTMLButtonElement;

    expect(prependButton.type).toBe('reset');

    expect(prependButton.getAttribute('aria-label')).toBe('Reset value');

    expect(appendButton.type).toBe('submit');

    expect(appendButton.getAttribute('aria-label')).toBe('Submit value');
  });

  it('does not treat affix button click as generic group interaction', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Search"
        input-id="search-click-scope"
        has-append
        append-button
        append-text="Go"
        append-button-id="search-click-scope-btn"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const appendButton = root.querySelector('#search-click-scope-btn') as HTMLButtonElement;

    const focusBar = getFocusBar(page);

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');

    appendButton.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');
  });

  it('renders readOnly + append/prepend buttons and matches snapshot', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Readonly Search"
        input-id="readonly-search"
        read-only
        has-prepend
        prepend-button
        prepend-text="Back"
        prepend-button-id="readonly-prepend-btn"
        has-append
        append-button
        append-text="Go"
        append-button-id="readonly-append-btn"
        value="Locked value"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    expect(normalize(getHost(page).outerHTML)).toMatchSnapshot('readonly-prepend-append-buttons');
  });

  it('disables affix buttons when readOnly is true', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Readonly Search"
        input-id="readonly-search-buttons"
        read-only
        has-prepend
        prepend-button
        prepend-text="Back"
        prepend-button-id="readonly-prepend-btn"
        has-append
        append-button
        append-text="Go"
        append-button-id="readonly-append-btn"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const prependButton = root.querySelector('#readonly-prepend-btn') as HTMLButtonElement | null;

    const appendButton = root.querySelector('#readonly-append-btn') as HTMLButtonElement | null;

    const input = getInput(page);

    expect(input.hasAttribute('readonly')).toBe(true);

    expect(prependButton).toBeTruthy();

    expect(appendButton).toBeTruthy();

    expect(prependButton?.hasAttribute('disabled')).toBe(true);

    expect(appendButton?.hasAttribute('disabled')).toBe(true);
  });

  it('does not emit affix click events when readOnly is true', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Readonly Search"
        input-id="readonly-search-events"
        read-only
        has-prepend
        prepend-button
        prepend-text="Back"
        prepend-button-id="readonly-search-events-prepend-btn"
        has-append
        append-button
        append-text="Go"
        append-button-id="readonly-search-events-append-btn"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const prependButton = root.querySelector('#readonly-search-events-prepend-btn') as HTMLButtonElement;

    const appendButton = root.querySelector('#readonly-search-events-append-btn') as HTMLButtonElement;

    const prependSpy = jest.fn();

    const appendSpy = jest.fn();

    root.addEventListener('prependClick', prependSpy as any);

    root.addEventListener('appendClick', appendSpy as any);

    prependButton.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        composed: true,
      }),
    );

    appendButton.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(prependSpy).not.toHaveBeenCalled();

    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('disables affix buttons when disabled is true', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Disabled Search"
        input-id="disabled-search"
        disabled
        has-prepend
        prepend-button
        prepend-text="Back"
        prepend-button-id="disabled-prepend-btn"
        has-append
        append-button
        append-text="Go"
        append-button-id="disabled-append-btn"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const prependButton = root.querySelector('#disabled-prepend-btn') as HTMLButtonElement | null;

    const appendButton = root.querySelector('#disabled-append-btn') as HTMLButtonElement | null;

    const input = getInput(page);

    expect(input.hasAttribute('disabled')).toBe(true);

    expect(prependButton?.hasAttribute('disabled')).toBe(true);

    expect(appendButton?.hasAttribute('disabled')).toBe(true);
  });

  it('does not emit affix click events when disabled is true', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Disabled Search"
        input-id="disabled-search-events"
        disabled
        has-prepend
        prepend-button
        prepend-text="Back"
        prepend-button-id="disabled-search-events-prepend-btn"
        has-append
        append-button
        append-text="Go"
        append-button-id="disabled-search-events-append-btn"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const prependButton = root.querySelector('#disabled-search-events-prepend-btn') as HTMLButtonElement;

    const appendButton = root.querySelector('#disabled-search-events-append-btn') as HTMLButtonElement;

    const prependSpy = jest.fn();

    const appendSpy = jest.fn();

    root.addEventListener('prependClick', prependSpy as any);

    root.addEventListener('appendClick', appendSpy as any);

    prependButton.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        composed: true,
      }),
    );

    appendButton.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(prependSpy).not.toHaveBeenCalled();

    expect(appendSpy).not.toHaveBeenCalled();
  });

  it('renders plain text affixes directly inside ig-wrapper', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Code"
        input-id="code"
        has-prepend
        prepend-text="#"
        has-append
        append-text=".js"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const wrapper = getInputWrapper(page);

    expect(root.querySelector('.prepend-btn')).toBeNull();

    expect(root.querySelector('.append-btn')).toBeNull();

    const affixes = qa<HTMLElement>(root, '.input-group-text');

    expect(affixes).toHaveLength(2);

    expect(wrapper.children[0].classList.contains('input-group-text')).toBe(true);

    expect(wrapper.children[1].tagName.toLowerCase()).toBe('input');

    expect(wrapper.children[2].classList.contains('input-group-text')).toBe(true);

    expect(root.textContent || '').toContain('#');

    expect(root.textContent || '').toContain('.js');
  });

  it('renders affix icons and marks them aria-hidden', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Amount"
        input-id="amount-icons"
        has-prepend
        prepend-icon="fa-solid fa-dollar-sign"
        has-append
        append-icon="fa-solid fa-circle-info"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const prependIcon = root.querySelector('#amount-Icons-prepend i') as HTMLElement | null;

    const appendIcon = root.querySelector('#amount-Icons-append i') as HTMLElement | null;

    expect(prependIcon).toBeTruthy();

    expect(appendIcon).toBeTruthy();

    expect(prependIcon!.className).toContain('fa-dollar-sign');

    expect(appendIcon!.className).toContain('fa-circle-info');

    expect(prependIcon!.getAttribute('aria-hidden')).toBe('true');

    expect(appendIcon!.getAttribute('aria-hidden')).toBe('true');
  });

  it('uses generic icon prop for affixes when side-specific icon is missing', async () => {
    const page = await setup(`
      <plumage-input-group-component
        label="Amount"
        input-id="generic-icon"
        icon="fa-solid fa-star"
        has-prepend
        has-append
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const icons = qa<HTMLElement>(getHost(page), '.input-group-text i.fa-star');

    expect(icons).toHaveLength(2);
  });

  it('search variant renders expected structure', async () => {
    const page = await setup(`
      <plumage-input-group-component
        plumage-search
        input-id="search"
        label="Search"
        placeholder="Search users"
        value="ann"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const stencilContainer = getStencilContainer(page);

    const input = getSearchInput(page);

    const icon = root.querySelector('#search-search-icon') as HTMLElement | null;

    expect(stencilContainer).toBeTruthy();

    expect(input.value).toBe('ann');

    expect(input.placeholder).toBe('Search users');

    expect(icon).toBeTruthy();

    expect(input.getAttribute('aria-labelledby')).toBe('search-label');

    expect(idRefs(input.getAttribute('aria-describedby'))).toContain('search-search-icon');
  });

  it('syncs search input when value prop changes externally', async () => {
    const page = await setup(`
      <plumage-input-group-component
        plumage-search
        input-id="search-sync"
        label="Search"
        value="ann"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputGroupComponent;

    expect(getSearchInput(page).value).toBe('ann');

    component.value = 'beth';

    await page.waitForChanges();

    expect(getSearchInput(page).value).toBe('beth');
  });

  it('search input sanitizes value and emits valueChange + change', async () => {
    const page = await setup(`
      <plumage-input-group-component
        plumage-search
        input-id="search-input"
        label="Search"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const input = getSearchInput(page);

    const valueSpy = jest.fn();

    const changeSpy = jest.fn();

    root.addEventListener('valueChange', valueSpy as any);

    root.addEventListener('change', changeSpy as any);

    input.value = '  a<b>   c  ';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(getSearchInput(page).value).toBe('ab c');

    expect(valueSpy).toHaveBeenCalled();

    expect(changeSpy).toHaveBeenCalled();
  });

  it('search variant clear button clears value and emits valueChange + change', async () => {
    const page = await setup(`
      <plumage-input-group-component
        plumage-search
        input-id="search-clear"
        label="Search"
        placeholder="Search users"
        value="ann"
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const valueSpy = jest.fn();

    const changeSpy = jest.fn();

    root.addEventListener('valueChange', valueSpy as any);

    root.addEventListener('change', changeSpy as any);

    const clearButton = root.querySelector('button.clear-icon') as HTMLButtonElement | null;

    expect(clearButton).toBeTruthy();

    expect(clearButton?.getAttribute('aria-label')).toBe('Clear search');

    clearButton!.click();

    await page.waitForChanges();

    expect(getSearchInput(page).value).toBe('');

    expect((page.rootInstance as PlumageInputGroupComponent).value).toBe('');

    expect(valueSpy).toHaveBeenCalled();

    expect(changeSpy).toHaveBeenCalled();

    expect(root.querySelector('button.clear-icon')).toBeNull();
  });

  it('does not render search clear button when value is empty', async () => {
    const page = await setup(`
      <plumage-input-group-component
        plumage-search
        input-id="empty-search"
        label="Search"
        value=""
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    expect(getHost(page).querySelector('button.clear-icon')).toBeNull();
  });

  it('does not render search clear button when disabled', async () => {
    const page = await setup(`
      <plumage-input-group-component
        plumage-search
        input-id="disabled-search-value"
        label="Search"
        value="ann"
        disabled
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    expect(getSearchInput(page).hasAttribute('disabled')).toBe(true);

    expect(getHost(page).querySelector('button.clear-icon')).toBeNull();
  });

  it('renders validation feedback in search variant', async () => {
    const page = await setup(`
      <plumage-input-group-component
        plumage-search
        input-id="invalid-search"
        label="Search"
        validation
        validation-message="Search is invalid."
      ></plumage-input-group-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const input = getSearchInput(page);

    const validation = root.querySelector('#invalid-Search-validation') as HTMLElement | null;

    expect(input.getAttribute('aria-invalid')).toBe('true');

    expect(validation).toBeTruthy();

    expect(validation?.textContent).toContain('Search is invalid.');

    expect(idRefs(input.getAttribute('aria-describedby'))).toContain('invalid-Search-validation');
  });
});
