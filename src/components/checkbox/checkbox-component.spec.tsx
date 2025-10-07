import { newSpecPage } from '@stencil/core/testing';
import { CheckboxComponent } from './checkbox-component';

describe('checkbox-component', () => {
  it('renders single standard checkbox', async () => {
    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component checkbox input-id="check1" name="test" label-txt="Accept terms"></checkbox-component>`,
    });
    const input = page.root.querySelector('input');
    expect(input.getAttribute('type')).toBe('checkbox');
    expect(input.getAttribute('name')).toBe('test');
    expect(input.getAttribute('id')).toBe('check1');
    expect(page.root).toMatchSnapshot();
  });

  it('renders single custom checkbox', async () => {
    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component custom-checkbox input-id="check2" name="custom" label-txt="Custom Option"></checkbox-component>`,
    });
    expect(page.root.querySelector('.custom-control')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('renders checkbox group with options', async () => {
    const groupOptions = JSON.stringify([
      { value: 'opt1', labelTxt: 'Option 1', inputId: 'opt1', disabled: false, checked: true },
      { value: 'opt2', labelTxt: 'Option 2', inputId: 'opt2', disabled: false, checked: false },
    ]);

    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component checkbox-group name="group1" group-title="Choose Options" group-options='${groupOptions}' required validation validation-msg="Please select at least one"></checkbox-component>`,
    });

    const inputs = page.root.querySelectorAll('input[type="checkbox"]');
    expect(inputs.length).toBe(2);
    expect(inputs[0].checked).toBe(true);
    expect(inputs[1].checked).toBe(false);
    expect(page.root).toMatchSnapshot();
  });

  it('renders custom checkbox group with options', async () => {
    const groupOptions = JSON.stringify([
      { value: 'optA', labelTxt: 'Custom A', inputId: 'optA', disabled: false, checked: false },
      { value: 'optB', labelTxt: 'Custom B', inputId: 'optB', disabled: true, checked: false },
    ]);

    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component custom-checkbox-group name="group2" group-title="Custom Group" group-options='${groupOptions}'></checkbox-component>`,
    });

    const inputs = page.root.querySelectorAll('input[type="checkbox"]');
    expect(inputs.length).toBe(2);
    expect(inputs[1].disabled).toBe(true);
    expect(page.root).toMatchSnapshot();
  });

  it('shows validation message when no group option is selected and required', async () => {
    const groupOptions = JSON.stringify([
      { value: 'val1', labelTxt: 'Val 1', inputId: 'val1', disabled: false, checked: false },
      { value: 'val2', labelTxt: 'Val 2', inputId: 'val2', disabled: false, checked: false },
    ]);

    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component checkbox-group name="group3" group-title="Validation Test" group-options='${groupOptions}' required validation validation-msg="Please select an option"></checkbox-component>`,
    });

    expect(page.root.querySelector('.invalid-feedback')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('removes validation message when at least one group option is checked', async () => {
    const groupOptions = JSON.stringify([
      { value: 'val1', labelTxt: 'Val 1', inputId: 'val1', disabled: false, checked: false },
      { value: 'val2', labelTxt: 'Val 2', inputId: 'val2', disabled: false, checked: false },
    ]);

    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component checkbox-group name="group4" group-title="Validation Clear" group-options='${groupOptions}' required validation validation-msg="Select one"></checkbox-component>`,
    });

    const secondInput = page.root.querySelectorAll('input')[1];
    secondInput.checked = true;
    secondInput.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(page.root.querySelector('.invalid-feedback')).toBeFalsy();
    expect(page.root).toMatchSnapshot();
  });

  it('emits groupChange event on group change', async () => {
    const groupOptions = JSON.stringify([
      { value: 'x', labelTxt: 'X', inputId: 'x', disabled: false },
      { value: 'y', labelTxt: 'Y', inputId: 'y', disabled: false },
    ]);

    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component checkbox-group name="group5" group-title="Emit Test" group-options='${groupOptions}'></checkbox-component>`,
    });

    const spy = jest.fn();
    page.root.addEventListener('groupChange', spy);

    const secondInput = page.root.querySelectorAll('input')[1];
    secondInput.checked = true;
    secondInput.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalled();
  });
});
