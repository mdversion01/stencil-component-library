// File: src/components/plumage-input-field/plumage-input-field-component.spec.tsx

import { Component, Prop, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { PlumageInputFieldComponent } from './plumage-input-field-component';

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
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\s+</g, '<')
    .replace(/>\s+/g, '>')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cssEscapeIdent(value: string): string {
  return String(value).replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

function getHost(page: any): HTMLElement {
  const root = page.root as HTMLElement | null;

  if (root && root.tagName?.toLowerCase() === 'plumage-input-field-component') {
    return root;
  }

  const host = page.body.querySelector('plumage-input-field-component') as HTMLElement | null;

  if (!host) {
    throw new Error('plumage-input-field-component host not found');
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

function getOuter(page: any): HTMLElement {
  const outer = getHost(page).querySelector('.stencil-component > div') as HTMLElement | null;

  if (!outer) {
    throw new Error('layout container not found');
  }

  return outer;
}

function getFormGroup(page: any): HTMLElement {
  const group = getHost(page).querySelector('.form-group') as HTMLElement | null;

  if (!group) {
    throw new Error('.form-group not found');
  }

  return group;
}

function getInputContainer(page: any): HTMLElement {
  const container = getHost(page).querySelector('.input-container') as HTMLElement | null;

  if (!container) {
    throw new Error('.input-container not found');
  }

  return container;
}

function getInput(root: HTMLElement): HTMLInputElement {
  const input = root.querySelector('input.form-control') as HTMLInputElement | null;

  if (!input) {
    throw new Error('input not found');
  }

  return input;
}

function getPageInput(page: any): HTMLInputElement {
  return getInput(getHost(page));
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

function getValidation(page: any): HTMLElement | null {
  return getHost(page).querySelector('.invalid-feedback') as HTMLElement | null;
}

function idRefs(value: string | null | undefined): string[] {
  return String(value ?? '')
    .trim()
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean);
}

async function typeIn(page: any, root: HTMLElement, value: string) {
  const input = getInput(root);

  input.value = value;

  input.dispatchEvent(
    new Event('input', {
      bubbles: true,
      composed: true,
    }),
  );

  await page.waitForChanges();
}

describe('<plumage-input-field-component>', () => {
  const setup = async (html: string) => {
    return newSpecPage({
      components: [PlumageInputFieldComponent, MockFormComponent],
      html,
    });
  };

  it('renders with defaults and matches snapshot', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Username"
        input-id="user"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);
    const stencilContainer = getStencilContainer(page);
    const outer = getOuter(page);
    const formGroup = getFormGroup(page);
    const inputContainer = getInputContainer(page);
    const label = getLabel(page);
    const input = getPageInput(page);
    const underline = getUnderline(page);
    const focusBar = getFocusBar(page);

    expect(root).toBeTruthy();

    expect(stencilContainer.classList.contains('stencil-component')).toBe(true);

    expect(outer.classList.contains('horizontal')).toBe(false);

    expect(outer.classList.contains('inline')).toBe(false);

    expect(formGroup.className).toBe('form-group');

    expect(inputContainer).toBeTruthy();

    expect(label).toBeTruthy();

    expect(input).toBeTruthy();

    expect(input.id).toBe('user');

    expect(input.name).toBe('user');

    expect(input.type).toBe('text');

    expect(input.placeholder).toBe('Username');

    expect(label.id).toBe('user-label');

    expect(label.getAttribute('for')).toBe('user');

    expect(input.getAttribute('aria-labelledby')).toBe('user-label');

    expect(input.getAttribute('aria-label')).toBeNull();

    expect(input.getAttribute('aria-invalid')).toBe('false');

    expect(input.getAttribute('aria-required')).toBeNull();

    expect(input.getAttribute('aria-disabled')).toBeNull();

    expect(input.getAttribute('aria-readonly')).toBeNull();

    expect(input.hasAttribute('disabled')).toBe(false);

    expect(input.hasAttribute('readonly')).toBe(false);

    expect(input.hasAttribute('required')).toBe(false);

    expect(underline.className).toBe('b-underline');

    expect(focusBar.className).toBe('b-focus');

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');

    expect(normalize(root.outerHTML)).toMatchSnapshot('stacked-default');
  });

  it('applies horizontal layout with responsive cols and matches snapshot', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Amount"
        input-id="amount"
        form-layout="horizontal"
        label-cols="sm-3"
        input-cols="sm-9"
        size="lg"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);
    const outer = getOuter(page);
    const formGroup = getFormGroup(page);
    const label = getLabel(page);
    const input = getPageInput(page);

    expect(outer.className).toContain('horizontal');

    expect(formGroup.classList.contains('row')).toBe(true);

    expect(label.className).toContain('col-form-label');

    expect(label.className).toContain('col-sm-3');

    expect(label.textContent).toContain('Amount:');

    const inputWrapper = root.querySelector('.form-group .col-sm-9');

    expect(inputWrapper).toBeTruthy();

    expect(input.className).toContain('form-control-lg');

    expect(normalize(root.outerHTML)).toMatchSnapshot('horizontal-responsive-layout');
  });

  it('renders inline layout classes', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Username"
        input-id="inline-user"
        form-layout="inline"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const outer = getOuter(page);

    const formGroup = getFormGroup(page);

    const label = getLabel(page);

    expect(outer.className).toContain('inline');

    expect(formGroup.classList.contains('row')).toBe(true);

    expect(formGroup.classList.contains('inline')).toBe(true);

    expect(label.textContent).toContain('Username:');
  });

  it('horizontal layout falls back to numeric cols when string specs are not provided', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Code"
        input-id="code"
        form-layout="horizontal"
        label-col="3"
        input-col="9"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    const inputCol = label.nextElementSibling as HTMLElement;

    expect(label.className).toContain('col-3');

    expect(inputCol).toBeTruthy();

    expect(inputCol.className).toContain('col-9');

    expect(normalize(getHost(page).outerHTML)).toMatchSnapshot('horizontal-numeric-cols');
  });

  it('uses full-width input column when label is hidden in horizontal layout', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Secret"
        input-id="hidden-field"
        form-layout="horizontal"
        label-hidden
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    const inputCol = label.nextElementSibling as HTMLElement;

    expect(label.classList.contains('sr-only')).toBe(true);

    expect(inputCol.classList.contains('col-12')).toBe(true);
  });

  it('applies label size and alignment classes', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Amount"
        input-id="amount-label-style"
        label-size="lg"
        label-align="right"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    expect(label.classList.contains('label-lg')).toBe(true);

    expect(label.classList.contains('align-right')).toBe(true);
  });

  it('renders small input size class', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Small"
        input-id="small-input"
        size="sm"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    expect(getPageInput(page).classList.contains('form-control-sm')).toBe(true);
  });

  it('renders large input size class', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Large"
        input-id="large-input"
        size="lg"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    expect(getPageInput(page).classList.contains('form-control-lg')).toBe(true);
  });

  it('uses explicit placeholder when provided', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Username"
        input-id="user-placeholder"
        placeholder="Enter username"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    expect(getPageInput(page).placeholder).toBe('Enter username');
  });

  it('falls back to Enter text when label and placeholder are missing', async () => {
    const page = await setup(`
      <plumage-input-field-component
        input-id="fallback-placeholder"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    expect(getPageInput(page).placeholder).toBe('Enter text');

    expect(getLabel(page).textContent).toContain('Input');
  });

  it('renders supplied native input type', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Email"
        input-id="typed-input"
        type="email"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    expect(getPageInput(page).type).toBe('email');
  });

  it('shows validation UI when validation=true and sets aria-describedby/aria-invalid', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Email"
        input-id="email"
        validation
        validation-message="Required field."
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const input = getPageInput(page);

    const feedback = root.querySelector('#email-validation') as HTMLElement | null;

    expect(feedback).toBeTruthy();

    expect(feedback!.textContent).toContain('Required field.');

    expect(feedback!.classList.contains('invalid-feedback')).toBe(true);

    expect(feedback!.getAttribute('aria-live')).toBe('polite');

    expect(input.classList.contains('is-invalid')).toBe(true);

    expect(input.getAttribute('aria-invalid')).toBe('true');

    expect(getLabel(page).classList.contains('invalid')).toBe(true);

    expect(getUnderline(page).classList.contains('invalid')).toBe(true);

    expect(getFocusBar(page).classList.contains('invalid')).toBe(true);

    const describedIds = idRefs(input.getAttribute('aria-describedby'));

    expect(describedIds).toContain('email-validation');

    describedIds.forEach(id => {
      const selector = `#${cssEscapeIdent(id)}`;

      expect(root.querySelector(selector)).toBeTruthy();
    });
  });

  it('updates validation UI when validation prop changes', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Email"
        input-id="validation-watch"
        validation-message="Invalid value."
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputFieldComponent;

    expect(getValidation(page)).toBeNull();

    component.validation = true;

    await page.waitForChanges();

    expect((component as any).validationState).toBe(true);

    expect(getPageInput(page).classList.contains('is-invalid')).toBe(true);

    expect(getValidation(page)?.textContent).toContain('Invalid value.');

    component.validation = false;

    await page.waitForChanges();

    expect((component as any).validationState).toBe(false);

    expect(getPageInput(page).classList.contains('is-invalid')).toBe(false);

    expect(getValidation(page)).toBeNull();
  });

  it('required validation wiring clears invalid after typing at least 3 characters', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Name"
        input-id="nm"
        required
        validation
        validation-message="Need 3+ chars"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    let input = getPageInput(page);

    expect(input.classList.contains('is-invalid')).toBe(true);

    expect(input.getAttribute('aria-invalid')).toBe('true');

    expect(input.getAttribute('aria-required')).toBe('true');

    expect(input.hasAttribute('required')).toBe(true);

    const described = idRefs(input.getAttribute('aria-describedby'));

    expect(described).toContain('nm-validation');

    const msg = root.querySelector('#nm-validation') as HTMLDivElement | null;

    expect(msg).toBeTruthy();

    expect(msg!.textContent || '').toContain('Need 3+ chars');

    await typeIn(page, root, 'Alex');

    input = getPageInput(page);

    expect(input.classList.contains('is-invalid')).toBe(false);

    expect(input.getAttribute('aria-invalid')).toBe('false');

    expect(root.querySelector('#nm-validation')).toBeNull();
  });

  it('required field becomes invalid on blur when below typing threshold', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Name"
        input-id="blur-required"
        required
        validation-message="Need 3+ chars"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const input = getPageInput(page);

    input.value = 'Hi';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    );

    input.dispatchEvent(
      new Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(getPageInput(page).getAttribute('aria-invalid')).toBe('true');

    expect(getValidation(page)?.textContent).toContain('Need 3+ chars');
  });

  it('renders required markers while the required field is below threshold', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Name"
        input-id="required-marker"
        required
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    const requiredElements = Array.from(label.querySelectorAll('.required'));

    expect(requiredElements.length).toBeGreaterThan(0);

    expect(label.textContent).toContain('*');
  });

  it('does not render required marker for disabled field', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Name"
        input-id="required-disabled"
        required
        disabled
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    expect(label.textContent).not.toContain('*');
  });

  it('does not render required marker for readonly field', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Name"
        input-id="required-readonly"
        required
        read-only
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    expect(label.textContent).not.toContain('*');
  });

  it('emits valueChange and sanitizes input on user typing', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="City"
        input-id="city"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const root = getHost(page);

    const input = getPageInput(page);

    const spy = jest.fn();

    root.addEventListener('valueChange', (event: any) => {
      spy(event.detail);
    });

    input.value = 'Ber<lin>';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith('Berlin');

    expect(getPageInput(page).value).toBe('Berlin');
  });

  it('sanitizes control characters and collapses whitespace', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Name"
        input-id="sanitized"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const input = getPageInput(page);

    input.value = '  John\u0007   Smith  ';

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(getPageInput(page).value).toBe('John Smith');
  });

  it('limits sanitized input to 512 characters', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Long Value"
        input-id="long-value"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const input = getPageInput(page);

    input.value = 'a'.repeat(600);

    input.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(getPageInput(page).value.length).toBe(512);
  });

  it('syncs the native input when value prop changes externally', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Email"
        input-id="email-sync"
        value="start"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputFieldComponent;

    expect(getPageInput(page).value).toBe('start');

    component.value = 'updated@site.com';

    await page.waitForChanges();

    expect(getPageInput(page).value).toBe('updated@site.com');
  });

  it('underline expands on focus and collapses on blur', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Focus"
        input-id="focus-field"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const input = getPageInput(page);

    const focusBar = getFocusBar(page);

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');

    input.dispatchEvent(
      new Event('focus', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    expect(focusBar.style.left).toBe('0');

    input.dispatchEvent(
      new Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');
  });

  it('underline expands on input-container interaction', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Focus"
        input-id="container-focus"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const container = getInputContainer(page);

    const focusBar = getFocusBar(page);

    container.dispatchEvent(
      new MouseEvent('mousedown', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    expect(focusBar.style.left).toBe('0');
  });

  it('underline collapses on outside document click', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Focus"
        input-id="outside-focus"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const input = getPageInput(page);

    const focusBar = getFocusBar(page);

    input.dispatchEvent(
      new Event('focus', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    page.doc.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');

    expect(focusBar.style.left).toBe('50%');
  });

  it('renders disabled state on input and underline', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Disabled"
        input-id="disabled-field"
        disabled
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const input = getPageInput(page);

    expect(input.hasAttribute('disabled')).toBe(true);

    expect(input.hasAttribute('readonly')).toBe(false);

    expect(input.getAttribute('aria-disabled')).toBe('true');

    expect(input.getAttribute('aria-readonly')).toBeNull();

    expect(input.classList.contains('read-only')).toBe(false);

    expect(getUnderline(page).classList.contains('disabled')).toBe(true);

    expect(getFocusBar(page).classList.contains('disabled')).toBe(true);
  });

  it('renders readonly state on input, label and underline', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Readonly"
        input-id="readonly-field"
        read-only
        value="Locked"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const input = getPageInput(page);

    const label = getLabel(page);

    expect(input.hasAttribute('readonly')).toBe(true);

    expect(input.hasAttribute('disabled')).toBe(false);

    expect(input.getAttribute('aria-readonly')).toBe('true');

    expect(input.getAttribute('aria-disabled')).toBeNull();

    expect(input.classList.contains('read-only')).toBe(true);

    expect(label.classList.contains('read-only')).toBe(true);

    expect(getUnderline(page).classList.contains('disabled')).toBe(true);

    expect(getFocusBar(page).classList.contains('disabled')).toBe(true);
  });

  it('applies explicit formId to the native input', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Zip"
        input-id="zip-form"
        form-id="external-form"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputFieldComponent;

    expect(component.formId).toBe('external-form');

    expect((component as any)._resolvedFormId).toBe('external-form');

    expect(getPageInput(page).getAttribute('form')).toBe('external-form');
  });

  it('applies and updates form attribute when formId changes', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Zip"
        input-id="zip"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const component = page.rootInstance as PlumageInputFieldComponent;

    expect(getPageInput(page).getAttribute('form')).toBeNull();

    component.formId = 'formA';

    await page.waitForChanges();

    expect((component as any)._resolvedFormId).toBe('formA');

    expect(getPageInput(page).getAttribute('form')).toBe('formA');

    component.formId = 'formB';

    await page.waitForChanges();

    expect((component as any)._resolvedFormId).toBe('formB');

    expect(getPageInput(page).getAttribute('form')).toBe('formB');

    component.formId = '';

    await page.waitForChanges();

    expect(getPageInput(page).hasAttribute('form')).toBe(false);
  });

  it('inherits formId and horizontal formLayout from parent form-component', async () => {
    const page = await setup(`
      <form-component
        form-id="parent-form"
        form-layout="horizontal"
      >
        <plumage-input-field-component
          label="Username"
          input-id="parent-user"
        ></plumage-input-field-component>
      </form-component>
    `);

    await page.waitForChanges();

    const host = page.body.querySelector('plumage-input-field-component') as any;

    const input = host.querySelector('input.form-control') as HTMLInputElement;

    const stencilContainer = host.querySelector('.stencil-component') as HTMLElement;

    const outer = stencilContainer.firstElementChild as HTMLElement;

    const formGroup = host.querySelector('.form-group') as HTMLElement;

    expect(host.formId).toBe('parent-form');

    expect(host.formLayout).toBe('horizontal');

    expect(input.getAttribute('form')).toBe('parent-form');

    expect(outer.classList.contains('horizontal')).toBe(true);

    expect(formGroup.classList.contains('row')).toBe(true);
  });

  it('uses standard aria-labelledby and aria-describedby props when provided', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent, MockFormComponent],
      template: () => (
        <div>
          <span id="externalLabel">External Label</span>

          <span id="externalHelp">Helper text</span>

          <plumage-input-field-component label="Ignored label for naming" input-id="std" aria-labelledby="externalLabel" aria-describedby="externalHelp" />
        </div>
      ),
    });

    await page.waitForChanges();

    const host = page.body.querySelector('plumage-input-field-component') as HTMLElement;

    const input = host.querySelector('input.form-control') as HTMLInputElement;

    const label = host.querySelector('label') as HTMLLabelElement;

    expect(input.getAttribute('aria-labelledby')).toBe('externalLabel');

    expect(idRefs(input.getAttribute('aria-describedby'))).toContain('externalHelp');

    expect(input.getAttribute('aria-label')).toBeNull();

    expect(label.id).toBe('std-label');
  });

  it('uses legacy arialabelledBy prop when provided', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Legacy"
        input-id="legacy-input"
        arialabelled-by="legacy-label"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    expect(getPageInput(page).getAttribute('aria-labelledby')).toBe('legacy-label');
  });

  it('merges external aria-describedby with validation id', async () => {
    const page = await newSpecPage({
      components: [PlumageInputFieldComponent, MockFormComponent],
      template: () => (
        <div>
          <span id="external-help">External help</span>

          <plumage-input-field-component label="Email" input-id="email" aria-describedby="external-help" validation validation-message="Invalid email." />
        </div>
      ),
    });

    await page.waitForChanges();

    const describedBy = idRefs(getPageInput(page).getAttribute('aria-describedby'));

    expect(describedBy).toEqual(expect.arrayContaining(['external-help', 'email-validation']));
  });

  it('removes duplicate aria-describedby ids', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Email"
        input-id="email"
        aria-describedby="external-help external-help"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    expect(idRefs(getPageInput(page).getAttribute('aria-describedby'))).toEqual(['external-help']);
  });

  it('sanitizes invalid aria-labelledby idrefs and falls back to internal label', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Username"
        input-id="safe-user"
        aria-labelledby="123-invalid"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    expect(getPageInput(page).getAttribute('aria-labelledby')).toBe('safe-User-label');
  });

  it('renders hidden label as sr-only and keeps it as accessible name source', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Hidden Username"
        input-id="hidden-user"
        label-hidden
        aria-label="Fallback label"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const label = getLabel(page);

    const input = getPageInput(page);

    expect(label.classList.contains('sr-only')).toBe(true);

    expect(input.getAttribute('aria-labelledby')).toBe(label.id);

    expect(input.getAttribute('aria-label')).toBeNull();
  });

  it('generates ids from space-separated inputId', async () => {
    const page = await setup(`
      <plumage-input-field-component
        label="Mailing Address"
        input-id="Mailing Address"
      ></plumage-input-field-component>
    `);

    await page.waitForChanges();

    const input = getPageInput(page);

    const label = getLabel(page);

    expect(input.id).toBe('mailingAddress');

    expect(label.id).toBe('mailingAddress-label');

    expect(label.getAttribute('for')).toBe('mailingAddress');
  });
});
