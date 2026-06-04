// File: src/components/textarea/textarea-component.spec.tsx

import { Component, h, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { TextareaComponent } from './textarea-component';

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

describe('textarea-component', () => {
  const setup = async (html: string) => {
    return newSpecPage({
      components: [TextareaComponent, MockFormComponent],
      html,
    });
  };

  const getTextareaValue = (textarea: HTMLTextAreaElement) => {
    return textarea.value ?? textarea.textContent ?? textarea.getAttribute('value') ?? '';
  };

  const getOuter = (root: HTMLElement) => root.firstElementChild as HTMLElement;
  const getInputColumn = (root: HTMLElement) => root.querySelector('.form-group > div:last-child') as HTMLElement;

  it('renders with default props', async () => {
    const page = await setup(`<textarea-component label="Comments"></textarea-component>`);

    expect(page.root).toMatchSnapshot();

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const label = root.querySelector('label') as HTMLLabelElement;

    expect(root).toBeTruthy();
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Comments');
    expect(textarea).toBeTruthy();
    expect(textarea.getAttribute('rows')).toBe('3');
    expect(textarea.className).toContain('form-control');
    expect(textarea.getAttribute('placeholder')).toBe('Comments');
  });

  it('renders validation + counter snapshot', async () => {
    const page = await setup(`
      <textarea-component
        label="Description"
        required
        validation
        validation-message="Please enter a description."
        value="Hello"
        max-length="20"
        rows="4"
      ></textarea-component>
    `);

    expect(page.root).toMatchSnapshot();
  });

  it('renders horizontal layout snapshot', async () => {
    const page = await setup(`
      <textarea-component
        label="Address"
        form-layout="horizontal"
        label-col="3"
        input-col="9"
        value="123 Main St"
      ></textarea-component>
    `);

    expect(page.root).toMatchSnapshot();
  });

  it('renders fallback placeholder when label and placeholder are missing', async () => {
    const page = await setup(`<textarea-component></textarea-component>`);

    const textarea = page.root?.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('placeholder')).toBe('Enter text');
  });

  it('applies disabled, readonly, required, rows, and maxlength props', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        disabled
        read-only
        required
        rows="5"
        max-length="120"
      ></textarea-component>
    `);

    const textarea = page.root?.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea.hasAttribute('disabled')).toBe(true);
    expect(textarea.hasAttribute('readonly')).toBe(true);
    expect(textarea.hasAttribute('required')).toBe(true);
    expect(textarea.getAttribute('rows')).toBe('5');
    expect(textarea.getAttribute('maxlength')).toBe('120');
  });

  it('renders textarea text size classes', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        textarea-text-size="lg"
      ></textarea-component>
    `);

    const textarea = page.root?.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.className).toContain('form-control-lg');
  });

  it('renders label hidden class when labelHidden is true', async () => {
    const page = await setup(`
      <textarea-component
        label="Hidden Label"
        label-hidden
      ></textarea-component>
    `);

    const label = page.root?.querySelector('label') as HTMLLabelElement;
    expect(label.className).toContain('sr-only');
  });

  it('renders label right alignment class', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        label-align="right"
      ></textarea-component>
    `);

    const label = page.root?.querySelector('label') as HTMLLabelElement;
    expect(label.className).toContain('align-right');
  });

  it('renders label size class', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        label-size="lg"
      ></textarea-component>
    `);

    const label = page.root?.querySelector('label') as HTMLLabelElement;
    expect(label.className).toContain('label-lg');
  });

  it('uses explicit inputId for textarea and label for/htmlFor wiring', async () => {
    const page = await setup(`
      <textarea-component
        label="Description"
        input-id="custom-textarea-id"
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const label = root.querySelector('label') as HTMLLabelElement;

    expect(textarea.getAttribute('id')).toBe('custom-textarea-id');
    expect(label.getAttribute('for')).toBe('custom-textarea-id');
    expect(label.getAttribute('id')).toBe('custom-textarea-id__label');
  });

  it('generates ids from label when inputId is not provided', async () => {
    const page = await setup(`
      <textarea-component
        label="Mailing Address"
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const label = root.querySelector('label') as HTMLLabelElement;
    const describedBy = textarea.getAttribute('aria-describedby') || '';

    expect(textarea.getAttribute('id')).toBe('mailingAddress');
    expect(label.getAttribute('id')).toBe('mailingAddress__label');
    expect(describedBy).toContain('mailingAddress__desc');
  });

  it('renders help text and connects it with aria-describedby', async () => {
    const page = await setup(`<textarea-component label="Summary"></textarea-component>`);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const help = root.querySelector('.sr-only') as HTMLElement;
    const describedBy = textarea.getAttribute('aria-describedby') || '';

    expect(help).toBeTruthy();
    expect(help.id).toBeTruthy();
    expect(describedBy).toContain(help.id);
  });

  it('renders validation message when validation is true', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        validation
        validation-message="Please enter comments."
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const feedback = root.querySelector('.invalid-feedback') as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;

    expect(feedback).toBeTruthy();
    expect(feedback.textContent).toContain('Please enter comments.');
    expect(textarea.className).toContain('is-invalid');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(textarea.getAttribute('aria-describedby')).toContain(feedback.id);
  });

  it('renders character counter when maxLength is provided', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        max-length="20"
        value="Hello"
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const counter = root.querySelector('.textarea-counter') as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const describedBy = textarea.getAttribute('aria-describedby') || '';

    expect(counter).toBeTruthy();
    expect(counter.textContent?.trim()).toBe('5 / 20');
    expect(describedBy).toContain(counter.id);
  });

  it('does not render counter when maxLength is missing or invalid', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        max-length="0"
      ></textarea-component>
    `);

    const counter = page.root?.querySelector('.textarea-counter');
    expect(counter).toBeNull();
  });

  it('sanitizes input by stripping tags and control characters while preserving line breaks', async () => {
    const page = await setup(`<textarea-component label="Comments"></textarea-component>`);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const spy = jest.fn();

    root.addEventListener('valueChange', (ev: Event) => {
      spy((ev as CustomEvent<string>).detail);
    });

    textarea.value = 'Hello<script>alert(1)</script>\nWorld\u0007';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(getTextareaValue(textarea)).toBe('Helloalert(1)\nWorld');
    expect(spy).toHaveBeenCalledWith('Helloalert(1)\nWorld');
  });

  it('truncates input to maxLength during sanitization', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        max-length="5"
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = '123456789';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(getTextareaValue(textarea)).toBe('12345');
    expect(root.querySelector('.textarea-counter')?.textContent?.trim()).toBe('5 / 5');
  });

  it('emits valueChange on input', async () => {
    const page = await setup(`<textarea-component label="Comments"></textarea-component>`);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const spy = jest.fn();

    root.addEventListener('valueChange', (ev: Event) => {
      spy((ev as CustomEvent<string>).detail);
    });

    textarea.value = 'Updated value';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Updated value');
  });

  it('emits blurChange on blur', async () => {
    const page = await setup(`<textarea-component label="Comments" value="Blur text"></textarea-component>`);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const spy = jest.fn();

    root.addEventListener('blurChange', (ev: Event) => {
      spy((ev as CustomEvent<string>).detail);
    });

    textarea.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Blur text');
  });

  it('shows validation message on blur when required and below threshold', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        required
        validation-message="Please enter at least 3 characters."
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;

    textarea.value = 'Hi';
    textarea.dispatchEvent(new Event('input'));
    textarea.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    const feedback = root.querySelector('.invalid-feedback') as HTMLElement;
    expect(feedback).toBeTruthy();
    expect(feedback.textContent).toContain('Please enter at least 3 characters.');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('clears validation output once required threshold is met', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        required
        validation
        validation-message="Please enter comments."
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;

    expect(root.querySelector('.invalid-feedback')).toBeTruthy();

    textarea.value = 'Valid text';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(root.querySelector('.invalid-feedback')).toBeNull();
    expect(textarea.getAttribute('aria-invalid')).toBeNull();
  });

  it('updates internal value state when value prop changes', async () => {
    const page = await newSpecPage({
      components: [TextareaComponent, MockFormComponent],
      html: `<textarea-component label="Notes"></textarea-component>`,
    });

    const root = page.root as HTMLStencilElement;
    const instance = page.rootInstance as TextareaComponent;

    root.setAttribute('value', 'first');
    root.value = 'first';
    await page.waitForChanges();

    expect(instance['valueState']).toBe('first');
    expect(page.root).toMatchSnapshot();

    root.setAttribute('value', 'second');
    root.value = 'second';
    await page.waitForChanges();

    expect(instance['valueState']).toBe('second');
    expect(page.root).toMatchSnapshot();
  });

  it('updates rendered validation state when validation prop changes', async () => {
    const page = await newSpecPage({
      components: [TextareaComponent, MockFormComponent],
      html: `<textarea-component label="Notes"></textarea-component>`,
    });

    const root = page.root as any;

    root.validation = true;
    root.validationMessage = 'Invalid textarea';
    await page.waitForChanges();

    const textarea = root.querySelector('textarea') as HTMLTextAreaElement;
    const feedback = root.querySelector('.invalid-feedback') as HTMLElement;

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(feedback.textContent).toContain('Invalid textarea');
  });

  it('applies external form id to textarea', async () => {
    const page = await setup(`
      <form id="external-form"></form>
      <textarea-component
        label="Comments"
        form-id="external-form"
      ></textarea-component>
    `);

    const textarea = page.doc.querySelector('textarea-component textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('form')).toBe('external-form');
  });

  it('inherits formId and formLayout from parent form-component', async () => {
    const page = await setup(`
      <form-component form-id="parent-form" form-layout="horizontal">
        <textarea-component label="Comments"></textarea-component>
      </form-component>
    `);

    const host = page.doc.querySelector('textarea-component') as any;
    const textarea = host.querySelector('textarea') as HTMLTextAreaElement;
    const outer = getOuter(host);

    expect(host.formId).toBe('parent-form');
    expect(host.formLayout).toBe('horizontal');
    expect(textarea.getAttribute('form')).toBe('parent-form');
    expect(outer.className).toContain('horizontal');
  });

  it('renders horizontal layout classes', async () => {
    const page = await setup(`
      <textarea-component
        label="Address"
        form-layout="horizontal"
        label-col="3"
        input-col="9"
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const outer = getOuter(root);
    const formGroup = root.querySelector('.form-group');
    const label = root.querySelector('label');
    const inputCol = label?.nextElementSibling as HTMLElement;

    expect(outer.className).toContain('horizontal');
    expect(formGroup?.classList.contains('row')).toBe(true);
    expect(label?.className).toContain('col-3');
    expect(inputCol?.className).toContain('col-9');
  });

  it('renders inline layout classes', async () => {
    const page = await setup(`
      <textarea-component
        label="Address"
        form-layout="inline"
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const outer = getOuter(root);
    const formGroup = root.querySelector('.form-group');

    expect(outer.className).toContain('inline');
    expect(formGroup?.classList.contains('row')).toBe(true);
    expect(formGroup?.classList.contains('inline')).toBe(true);
  });

  it('renders responsive column classes when provided', async () => {
    const page = await setup(`
      <textarea-component
        label="Address"
        form-layout="horizontal"
        label-cols="xs-12 sm-4"
        input-cols="xs-12 sm-8"
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const label = root.querySelector('label') as HTMLLabelElement;
    const inputCol = label.nextElementSibling as HTMLElement;

    expect(label.className).toContain('col-12');
    expect(label.className).toContain('col-sm-4');
    expect(inputCol.className).toContain('col-12');
    expect(inputCol.className).toContain('col-sm-8');
  });

  it('uses full-width input column when label is hidden in horizontal layout', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        form-layout="horizontal"
        label-hidden
      ></textarea-component>
    `);

    const root = page.root as HTMLElement;
    const inputCol = getInputColumn(root);

    expect(inputCol.className).toContain('col-12');
  });

  it('falls back to default rows when rows is invalid', async () => {
    const page = await setup(`
      <textarea-component
        label="Comments"
        rows="-1"
      ></textarea-component>
    `);

    const textarea = page.root?.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('rows')).toBe('3');
  });
});
