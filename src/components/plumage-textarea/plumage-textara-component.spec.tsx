// File: src/components/plumage-textarea/plumage-textara-component.spec.tsx

import { Component, Prop, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PlumageTextareaComponent } from './plumage-textarea-component';

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

describe('plumage-textarea-component', () => {
  const setup = async (html: string) => {
    return newSpecPage({
      components: [PlumageTextareaComponent, MockFormComponent],
      html,
    });
  };

  const getHost = (page: Awaited<ReturnType<typeof setup>>) => page.root as HTMLStencilElement;
  const getOuter = (host: HTMLElement) => host.firstElementChild as HTMLElement;
  const getFormGroup = (host: HTMLElement) => host.querySelector('.form-group') as HTMLElement;
  const getLabel = (host: HTMLElement) => host.querySelector('label') as HTMLLabelElement;
  const getTextarea = (host: HTMLElement) => host.querySelector('textarea') as HTMLTextAreaElement;
  const getValidation = (host: HTMLElement) => host.querySelector('.invalid-feedback') as HTMLElement | null;
  const getCounter = (host: HTMLElement) => host.querySelector('.textarea-counter') as HTMLElement | null;
  const getUnderline = (host: HTMLElement) => host.querySelector('.b-underline') as HTMLElement | null;
  const getFocusBar = (host: HTMLElement) => host.querySelector('.b-focus') as HTMLDivElement | null;
  const getRenderedValue = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return '';
    return textarea.value || textarea.textContent || '';
  };

  it('renders default markup', async () => {
    const page = await setup(`<plumage-textarea-component label="Comments"></plumage-textarea-component>`);

    expect(page.root).toMatchSnapshot();

    const host = getHost(page);
    const textarea = getTextarea(host);
    const label = getLabel(host);
    const underline = getUnderline(host);

    expect(host).toBeTruthy();
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Comments');
    expect(textarea).toBeTruthy();
    expect(textarea.getAttribute('rows')).toBe('3');
    expect(textarea.className).toContain('form-control');
    expect(textarea.getAttribute('placeholder')).toBe('Comments');
    expect(underline).toBeTruthy();
  });

  it('renders validation + counter snapshot', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Description"
        required
        validation
        validation-message="Please enter a description."
        value="Hello"
        max-length="20"
        rows="4"
      ></plumage-textarea-component>
    `);

    expect(page.root).toMatchSnapshot();
  });

  it('renders horizontal layout snapshot', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Address"
        form-layout="horizontal"
        label-col="3"
        input-col="9"
        value="123 Main St"
      ></plumage-textarea-component>
    `);

    expect(page.root).toMatchSnapshot();
  });

  it('renders fallback placeholder when label and placeholder are missing', async () => {
    const page = await setup(`<plumage-textarea-component></plumage-textarea-component>`);

    const textarea = getTextarea(getHost(page));
    expect(textarea.getAttribute('placeholder')).toBe('Enter text');
  });

  it('applies disabled, readonly, required, rows, and maxlength props', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        disabled
        read-only
        required
        rows="5"
        max-length="120"
      ></plumage-textarea-component>
    `);

    const textarea = getTextarea(getHost(page));
    const focusBar = getFocusBar(getHost(page));

    expect(textarea.hasAttribute('disabled')).toBe(true);
    expect(textarea.hasAttribute('readonly')).toBe(true);
    expect(textarea.hasAttribute('required')).toBe(true);
    expect(textarea.getAttribute('rows')).toBe('5');
    expect(textarea.getAttribute('maxlength')).toBe('120');
    expect(textarea.getAttribute('aria-disabled')).toBe('true');
    expect(textarea.getAttribute('aria-readonly')).toBe('true');
    expect(focusBar?.className).toContain('disabled');
  });

  it('renders textarea text size classes', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        textarea-text-size="lg"
      ></plumage-textarea-component>
    `);

    const textarea = getTextarea(getHost(page));
    expect(textarea.className).toContain('form-control-lg');
  });

  it('renders readonly class on textarea', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        read-only
      ></plumage-textarea-component>
    `);

    const textarea = getTextarea(getHost(page));
    expect(textarea.className).toContain('readonly');
  });

  it('renders label hidden class when labelHidden is true', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Hidden Label"
        label-hidden
      ></plumage-textarea-component>
    `);

    const label = getLabel(getHost(page));
    expect(label.className).toContain('sr-only');
  });

  it('renders label right alignment class', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        label-align="right"
      ></plumage-textarea-component>
    `);

    const label = getLabel(getHost(page));
    expect(label.className).toContain('align-right');
  });

  it('renders label size class', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        label-size="lg"
      ></plumage-textarea-component>
    `);

    const label = getLabel(getHost(page));
    expect(label.className).toContain('label-lg');
  });

  it('uses explicit inputId for textarea and label wiring', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Description"
        input-id="custom-Textarea-Id"
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const label = getLabel(host);

    expect(textarea.getAttribute('id')).toBe('custom-Textarea-Id');
    expect(label.getAttribute('for')).toBe('custom-Textarea-Id');
    expect(label.getAttribute('id')).toBe('custom-Textarea-Id-label');
  });

  it('generates ids from inputId camel-casing', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Mailing Address"
        input-id="Mailing Address"
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const label = getLabel(host);

    expect(textarea.getAttribute('id')).toBe('mailingAddress');
    expect(label.getAttribute('id')).toBe('mailingAddress-label');
  });

  it('renders help text and connects it with aria-describedby', async () => {
    const page = await setup(`<plumage-textarea-component label="Summary"></plumage-textarea-component>`);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const help = host.querySelector('.sr-only[id$="-help"]') as HTMLElement;
    const describedBy = textarea.getAttribute('aria-describedby') || '';

    expect(help).toBeTruthy();
    expect(help.id).toBeTruthy();
    expect(describedBy).toContain(help.id);
  });

  it('renders validation message when validation is true', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        validation
        validation-message="Please enter comments."
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const feedback = getValidation(host) as HTMLElement;
    const textarea = getTextarea(host);

    expect(feedback).toBeTruthy();
    expect(feedback.textContent).toContain('Please enter comments.');
    expect(textarea.className).toContain('is-invalid');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(textarea.getAttribute('aria-describedby')).toContain(feedback.id);
  });

  it('renders character counter when maxLength is provided', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        max-length="20"
        value="Hello"
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const counter = getCounter(host) as HTMLElement;
    const textarea = getTextarea(host);
    const describedBy = textarea.getAttribute('aria-describedby') || '';

    expect(counter).toBeTruthy();
    expect(counter.textContent?.trim()).toBe('5 / 20');
    expect(describedBy).toContain(counter.id);
  });

  it('does not render counter when maxLength is missing or invalid', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        max-length="0"
      ></plumage-textarea-component>
    `);

    expect(getCounter(getHost(page))).toBeNull();
  });

  it('sanitizes input by stripping tags and control characters while preserving line breaks', async () => {
    const page = await setup(`<plumage-textarea-component label="Comments"></plumage-textarea-component>`);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const spy = jest.fn();

    host.addEventListener('valueChange', (ev: Event) => {
      spy((ev as CustomEvent<string>).detail);
    });

    textarea.value = 'Hello<script>alert(1)</script>\nWorld\u0007';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(getRenderedValue(textarea)).toBe('Helloalert(1)\nWorld');
    expect(spy).toHaveBeenCalledWith('Helloalert(1)\nWorld');
    expect(getCounter(host)?.textContent || '').not.toContain('/');
  });

  it('truncates input to maxLength during sanitization', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        max-length="5"
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const textarea = getTextarea(host);

    textarea.value = '123456789';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(getRenderedValue(textarea)).toBe('12345');
    expect(getCounter(host)?.textContent?.trim()).toBe('5 / 5');
  });

  it('emits valueChange on input', async () => {
    const page = await setup(`<plumage-textarea-component label="Comments"></plumage-textarea-component>`);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const spy = jest.fn();

    host.addEventListener('valueChange', (ev: Event) => {
      spy((ev as CustomEvent<string>).detail);
    });

    textarea.value = 'Updated value';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Updated value');
  });

  it('emits blurChange on blur', async () => {
    const page = await setup(`<plumage-textarea-component label="Comments" value="Blur text"></plumage-textarea-component>`);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const spy = jest.fn();

    host.addEventListener('blurChange', (ev: Event) => {
      spy((ev as CustomEvent<string>).detail);
    });

    textarea.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Blur text');
  });

  it('sets validation feedback on blur when required and below threshold', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        required
        validation-message="Please enter at least 3 characters."
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const textarea = getTextarea(host);

    textarea.value = 'Hi';
    textarea.dispatchEvent(new Event('input'));
    textarea.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(getValidation(host)?.textContent).toContain('Please enter at least 3 characters.');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('clears validation feedback once required threshold is met', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        required
        validation
        validation-message="Please enter comments."
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const textarea = getTextarea(host);

    expect(getValidation(host)?.textContent).toContain('Please enter comments.');

    textarea.value = 'Valid text';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(getValidation(host)).toBeNull();
    expect(textarea.getAttribute('aria-invalid')).toBe('false');
  });

  it('updates internal validation state when validation prop changes', async () => {
    const page = await newSpecPage({
      components: [PlumageTextareaComponent, MockFormComponent],
      html: `<plumage-textarea-component label="Notes"></plumage-textarea-component>`,
    });

    const root = page.root as any;

    root.validation = true;
    root.validationMessage = 'Invalid textarea';
    await page.waitForChanges();

    const textarea = getTextarea(root);
    const feedback = getValidation(root) as HTMLElement;

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(feedback.textContent).toContain('Invalid textarea');
  });

  it('updates internal value state when value prop changes', async () => {
    const page = await newSpecPage({
      components: [PlumageTextareaComponent, MockFormComponent],
      html: `<plumage-textarea-component label="Notes"></plumage-textarea-component>`,
    });

    const root = page.root as HTMLStencilElement;
    const instance = page.rootInstance as PlumageTextareaComponent;

    root.setAttribute('value', 'first');
    (root as any).value = 'first';
    await page.waitForChanges();

    expect(instance['valueState']).toBe('first');
    expect(page.root).toMatchSnapshot();

    root.setAttribute('value', 'second');
    (root as any).value = 'second';
    await page.waitForChanges();

    expect(instance['valueState']).toBe('second');
    expect(page.root).toMatchSnapshot();
  });

  it('applies external form id to textarea', async () => {
    const page = await setup(`
      <form id="external-form"></form>
      <plumage-textarea-component
        label="Comments"
        form-id="external-form"
      ></plumage-textarea-component>
    `);

    const textarea = page.doc.querySelector('plumage-textarea-component textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('form')).toBe('external-form');
  });

  it('inherits formId and formLayout from parent form-component', async () => {
    const page = await setup(`
      <form-component form-id="parent-form" form-layout="horizontal">
        <plumage-textarea-component label="Comments"></plumage-textarea-component>
      </form-component>
    `);

    const host = page.doc.querySelector('plumage-textarea-component') as any;
    const textarea = getTextarea(host);
    const outer = getOuter(host);

    expect(textarea.getAttribute('form')).toBe('parent-form');
    expect(outer.className).toContain('horizontal');
  });

  it('renders horizontal layout classes', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Address"
        form-layout="horizontal"
        label-col="3"
        input-col="9"
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const outer = getOuter(host);
    const formGroup = getFormGroup(host);
    const label = getLabel(host);
    const inputCol = label?.nextElementSibling as HTMLElement;

    expect(outer.className).toContain('horizontal');
    expect(formGroup?.classList.contains('row')).toBe(true);
    expect(label?.className).toContain('col-3');
    expect(inputCol?.className).toContain('col-9');
  });

  it('renders inline layout classes', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Address"
        form-layout="inline"
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const outer = getOuter(host);
    const formGroup = getFormGroup(host);

    expect(outer.className).toContain('inline');
    expect(formGroup?.classList.contains('row')).toBe(true);
    expect(formGroup?.classList.contains('inline')).toBe(true);
  });

  it('renders responsive column classes when provided', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Address"
        form-layout="horizontal"
        label-cols="xs-12 sm-4"
        input-cols="xs-12 sm-8"
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const label = getLabel(host);
    const inputCol = label.nextElementSibling as HTMLElement;

    expect(label.className).toContain('col-12');
    expect(label.className).toContain('col-sm-4');
    expect(inputCol.className).toContain('col-12');
    expect(inputCol.className).toContain('col-sm-8');
  });

  it('uses full-width input column when label is hidden in horizontal layout', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        form-layout="horizontal"
        label-hidden
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const inputCol = host.querySelector('.form-group > div:last-child') as HTMLElement;

    expect(inputCol.className).toContain('col-12');
  });

  it('falls back to default rows when rows is invalid', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label="Comments"
        rows="-1"
      ></plumage-textarea-component>
    `);

    const textarea = getTextarea(getHost(page));
    expect(textarea.getAttribute('rows')).toBe('3');
  });

  it('uses external aria-labelledby when provided', async () => {
    const page = await setup(`
      <div id="external-label">External label</div>
      <plumage-textarea-component
        input-id="notes-field"
        aria-labelledby="external-label"
      ></plumage-textarea-component>
    `);

    const textarea = page.doc.querySelector('plumage-textarea-component textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('aria-labelledby')).toBe('external-label');
    expect(textarea.hasAttribute('aria-label')).toBe(false);
  });

  it('uses legacy arialabelledBy prop when provided', async () => {
    const page = await setup(`
      <div id="legacy-label">Legacy label</div>
      <plumage-textarea-component
        input-id="notes-field"
        arialabelled-by="legacy-label"
      ></plumage-textarea-component>
    `);

    const textarea = page.doc.querySelector('plumage-textarea-component textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('aria-labelledby')).toBe('legacy-label');
  });

  it('does not use aria-label when internal label id is available', async () => {
    const page = await setup(`
      <plumage-textarea-component
        label-hidden
        aria-label="Custom notes"
      ></plumage-textarea-component>
    `);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const label = getLabel(host);

    expect(label).toBeTruthy();
    expect(textarea.getAttribute('aria-labelledby')).toBe(label.getAttribute('id'));
    expect(textarea.getAttribute('aria-label')).toBeNull();
  });

  it('expands underline on focus and collapses on blur', async () => {
    const page = await setup(`<plumage-textarea-component label="Comments"></plumage-textarea-component>`);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const focusBar = getFocusBar(host) as HTMLDivElement;

    expect(focusBar.style.width).toBe('0');
    expect(focusBar.style.left).toBe('50%');

    textarea.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');
    expect(focusBar.style.left).toBe('0');

    textarea.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');
    expect(focusBar.style.left).toBe('50%');
  });

  it('keeps underline interaction available from underline element', async () => {
    const page = await setup(`<plumage-textarea-component label="Comments"></plumage-textarea-component>`);

    const host = getHost(page);
    const underline = getUnderline(host) as HTMLElement;
    const focusBar = getFocusBar(host) as HTMLDivElement;

    underline.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');
    expect(focusBar.style.left).toBe('0');
  });

  it('collapses underline on outside document click', async () => {
    const page = await setup(`<plumage-textarea-component label="Comments"></plumage-textarea-component>`);

    const host = getHost(page);
    const textarea = getTextarea(host);
    const focusBar = getFocusBar(host) as HTMLDivElement;

    textarea.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    expect(focusBar.style.width).toBe('100%');

    page.doc.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(focusBar.style.width).toBe('0');
    expect(focusBar.style.left).toBe('50%');
  });
});
