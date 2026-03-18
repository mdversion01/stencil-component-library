// src/components/radio-input/radio-input-component.spec.ts
import { newSpecPage } from '@stencil/core/testing';
import { RadioComponent } from './radio-input-component';

const getLabelFor = (label: Element) => label.getAttribute('for') ?? label.getAttribute('htmlfor') ?? (label as any).htmlFor ?? label.getAttribute('htmlFor');

function splitIds(v: string | null): string[] {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

describe('radio-input-component', () => {
  it('renders single radio (Bootstrap styling) with accessible label wiring', async () => {
    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component bs-radio input-id="single-radio" name="test" label-txt="Single Radio"></radio-input-component>`,
    });

    const input = page.root.querySelector('input[type="radio"]') as HTMLInputElement;
    const label = page.root.querySelector('label') as Element;

    expect(input).toBeTruthy();
    expect(label).toBeTruthy();

    expect(page.root.querySelector('.form-check')).toBeTruthy();

    expect(input.getAttribute('type')).toBe('radio');
    expect(input.getAttribute('name')).toBe('test');
    expect(input.getAttribute('id')).toBe('single-radio');

    expect(getLabelFor(label)).toBe('single-radio');

    expect((label as any).id).toBe('radio-single-label-test');
    expect(input.getAttribute('aria-labelledby')).toBe('radio-single-label-test');

    expect(input.getAttribute('aria-label')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('renders single radio (Basic styling)', async () => {
    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component basic-radio input-id="basic-radio" name="basic" label-txt="Basic Radio"></radio-input-component>`,
    });

    expect(page.root.querySelector('.basic-control.basic-radio')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('renders radio group with options (Bootstrap styling) and radiogroup semantics', async () => {
    const options = JSON.stringify([
      { value: 'one', labelTxt: 'Option One', inputId: 'radio-one', checked: false, disabled: false },
      { value: 'two', labelTxt: 'Option Two', inputId: 'radio-two', checked: true, disabled: false },
      { value: 'three', labelTxt: 'Option Three', inputId: 'radio-three', checked: false, disabled: true },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component bs-radio-group name="group" group-title="Select Option" group-options='${options}'></radio-input-component>`,
    });

    const group = page.root.querySelector('[role="radiogroup"]') as HTMLElement;
    const title = page.root.querySelector('#radio-group-title-group') as HTMLElement;

    expect(group).toBeTruthy();
    expect(title).toBeTruthy();

    expect(group.getAttribute('aria-labelledby')).toBe('radio-group-title-group');
    expect(group.getAttribute('aria-label')).toBeNull();
    expect(group.getAttribute('aria-required')).toBeNull();
    expect(group.getAttribute('aria-invalid')).toBeNull();

    const inputs = page.root.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(inputs.length).toBe(3);

    expect(inputs[1].checked).toBe(true);
    expect(inputs[2].disabled).toBe(true);

    expect(page.root).toMatchSnapshot();
  });

  it('renders radio group with options (Basic styling)', async () => {
    const options = JSON.stringify([
      { value: 'alpha', labelTxt: 'Alpha', inputId: 'radio-alpha', checked: false, disabled: false },
      { value: 'beta', labelTxt: 'Beta', inputId: 'radio-beta', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component basic-radio-group name="customGroup" group-title="Custom Group" group-options='${options}'></radio-input-component>`,
    });

    expect(page.root.querySelectorAll('input[type="radio"]').length).toBe(2);
    expect(page.root.querySelector('.basic-control.basic-radio')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('shows validation message when no selection is made and required (group)', async () => {
    const options = JSON.stringify([
      { value: 'x', labelTxt: 'X', inputId: 'radio-x', checked: false, disabled: false },
      { value: 'y', labelTxt: 'Y', inputId: 'radio-y', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component bs-radio-group name="group1" group-title="Validation Test" required validation validation-msg="Please select one" group-options='${options}'></radio-input-component>`,
    });

    const group = page.root.querySelector('[role="radiogroup"]') as HTMLElement;
    const error = page.root.querySelector('#radio-group-error-group1') as HTMLElement;

    expect(error).toBeTruthy();
    expect(group.getAttribute('aria-invalid')).toBe('true');
    expect(group.getAttribute('aria-required')).toBe('true');

    const describedBy = splitIds(group.getAttribute('aria-describedby'));
    expect(describedBy).toContain('radio-group-error-group1');

    expect(page.root).toMatchSnapshot();
  });

  it('removes validation message when an option is selected (group)', async () => {
    const options = JSON.stringify([
      { value: 'x', labelTxt: 'X', inputId: 'radio-x', checked: false, disabled: false },
      { value: 'y', labelTxt: 'Y', inputId: 'radio-y', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component bs-radio-group name="group2" group-title="Validation Clear" required validation validation-msg="Please select one" group-options='${options}'></radio-input-component>`,
    });

    expect(page.root.querySelector('#radio-group-error-group2')).toBeTruthy();
    expect((page.root.querySelector('[role="radiogroup"]') as HTMLElement).getAttribute('aria-invalid')).toBe('true');

    const inputs = page.root.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    inputs[0].checked = true;
    inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    const groupAfter = page.root.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(page.root.querySelector('#radio-group-error-group2')).toBeFalsy();
    expect(groupAfter.getAttribute('aria-invalid')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('emits groupChange event with selected value when selection changes', async () => {
    const options = JSON.stringify([
      { value: 'apple', labelTxt: 'Apple', inputId: 'radio-apple', checked: false, disabled: false },
      { value: 'banana', labelTxt: 'Banana', inputId: 'radio-banana', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component bs-radio-group name="fruits" group-title="Choose Fruit" group-options='${options}'></radio-input-component>`,
    });

    const spy = jest.fn();
    page.root.addEventListener('groupChange', (e: CustomEvent<string>) => spy(e.detail));

    const inputs = page.root.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    inputs[0].checked = true;
    inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith('apple');
  });

  it('single required validation: sets aria-invalid + connects error via aria-describedby', async () => {
    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component bs-radio input-id="single-required" name="singleReq" label-txt="Agree" required validation validation-msg="Required"></radio-input-component>`,
    });

    let input = page.root.querySelector('input[type="radio"]') as HTMLInputElement;
    const error = page.root.querySelector('#radio-single-error-singleReq') as HTMLElement;

    expect(error).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const describedBy = splitIds(input.getAttribute('aria-describedby'));
    expect(describedBy).toContain('radio-single-error-singleReq');

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    input = page.root.querySelector('input[type="radio"]') as HTMLInputElement;

    expect(page.root.querySelector('#radio-single-error-singleReq')).toBeFalsy();
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('a11y overrides: aria-label used when no labelTxt and aria-labelledby not provided (single)', async () => {
    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component bs-radio input-id="single-a11y" name="singleA11y" aria-label="Accept terms"></radio-input-component>`,
    });

    const input = page.root.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Accept terms');
    expect(input.getAttribute('aria-labelledby')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('a11y overrides: aria-labelledby takes precedence over aria-label (group)', async () => {
    const options = JSON.stringify([
      { value: 'a', labelTxt: 'A', inputId: 'radio-a', checked: false, disabled: false },
      { value: 'b', labelTxt: 'B', inputId: 'radio-b', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `
        <div id="external-title">External Group Label</div>
        <radio-input-component
          bs-radio-group
          name="g3"
          aria-label="Ignored"
          aria-labelledby="external-title"
          group-options='${options}'
        ></radio-input-component>
      `,
    });

    const group = page.root.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group.getAttribute('aria-labelledby')).toBe('external-title');
    expect(group.getAttribute('aria-label')).toBeNull();

    // ✅ external id is outside the component host, so query the page body/doc
    expect(!!page.body.querySelector('#external-title')).toBe(true);
  });
});
