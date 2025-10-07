import { newSpecPage } from '@stencil/core/testing';
import { RadioComponent } from './radio-input-component';

describe('radio-input-component', () => {
  it('renders single radio input', async () => {
    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component radio input-id="single-radio" name="test" label-txt="Single Radio"></radio-input-component>`,
    });
    const input = page.root.querySelector('input');
    expect(input.getAttribute('type')).toBe('radio');
    expect(input.getAttribute('name')).toBe('test');
    expect(page.root).toMatchSnapshot();
  });

  it('renders single custom radio input', async () => {
    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component custom-radio input-id="custom-radio" name="custom" label-txt="Custom Radio"></radio-input-component>`,
    });
    expect(page.root.querySelector('.custom-control')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('renders radio group with options', async () => {
    const options = JSON.stringify([
      { value: 'one', labelTxt: 'Option One', inputId: 'radio-one', checked: false, disabled: false },
      { value: 'two', labelTxt: 'Option Two', inputId: 'radio-two', checked: true, disabled: false },
      { value: 'three', labelTxt: 'Option Three', inputId: 'radio-three', checked: false, disabled: true },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component radio-group name="group" group-title="Select Option" group-options='${options}'></radio-input-component>`,
    });

    const inputs = page.root.querySelectorAll('input[type="radio"]');
    expect(inputs.length).toBe(3);
    expect(inputs[1].checked).toBe(true);
    expect(inputs[2].disabled).toBe(true);
    expect(page.root).toMatchSnapshot();
  });

  it('renders custom radio group with options', async () => {
    const options = JSON.stringify([
      { value: 'alpha', labelTxt: 'Alpha', inputId: 'radio-alpha', checked: false, disabled: false },
      { value: 'beta', labelTxt: 'Beta', inputId: 'radio-beta', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component custom-radio-group name="customGroup" group-title="Custom Group" group-options='${options}'></radio-input-component>`,
    });

    expect(page.root.querySelectorAll('input[type="radio"]').length).toBe(2);
    expect(page.root.querySelector('.custom-control')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('shows validation message when no selection is made and required', async () => {
    const options = JSON.stringify([
      { value: 'x', labelTxt: 'X', inputId: 'radio-x', checked: false, disabled: false },
      { value: 'y', labelTxt: 'Y', inputId: 'radio-y', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component radio-group name="group1" group-title="Validation Test" required validation validation-msg="Please select one" group-options='${options}'></radio-input-component>`,
    });

    expect(page.root.querySelector('.invalid-feedback')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('removes validation message when an option is selected', async () => {
    const options = JSON.stringify([
      { value: 'x', labelTxt: 'X', inputId: 'radio-x', checked: false, disabled: false },
      { value: 'y', labelTxt: 'Y', inputId: 'radio-y', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component radio-group name="group2" group-title="Validation Clear" required validation validation-msg="Please select one" group-options='${options}'></radio-input-component>`,
    });

    const inputs = page.root.querySelectorAll('input[type="radio"]');
    inputs[0].checked = true;
    inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root.querySelector('.invalid-feedback')).toBeFalsy();
    expect(page.root).toMatchSnapshot();
  });

  it('emits groupChange event when selection changes', async () => {
    const options = JSON.stringify([
      { value: 'apple', labelTxt: 'Apple', inputId: 'radio-apple', checked: false, disabled: false },
      { value: 'banana', labelTxt: 'Banana', inputId: 'radio-banana', checked: false, disabled: false },
    ]);

    const page = await newSpecPage({
      components: [RadioComponent],
      html: `<radio-input-component radio-group name="fruits" group-title="Choose Fruit" group-options='${options}'></radio-input-component>`,
    });

    const spy = jest.fn();
    page.root.addEventListener('groupChange', spy);

    const inputs = page.root.querySelectorAll('input[type="radio"]');
    inputs[0].checked = true;
    inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalled();
  });
});
