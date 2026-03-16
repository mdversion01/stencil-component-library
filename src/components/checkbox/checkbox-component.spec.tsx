// src/components/checkbox-component/checkbox-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { CheckboxComponent } from './checkbox-component';

describe('<checkbox-component>', () => {
  it('renders single standard checkbox', async () => {
    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component input-id="check1" name="test" label-txt="Accept terms"></checkbox-component>`,
    });

    const input = page.root!.querySelector('input') as HTMLInputElement;
    const label = page.root!.querySelector('label') as HTMLLabelElement;

    expect(input).toBeTruthy();
    expect(label).toBeTruthy();

    expect(input.getAttribute('type')).toBe('checkbox');
    expect(input.getAttribute('name')).toBe('test');
    expect(input.getAttribute('id')).toBe('check1');
    expect(label.getAttribute('for') || label.getAttribute('htmlfor') || (label as any).htmlFor).toBe('check1');

    // no redundant aria-* on native checkbox
    expect(input.getAttribute('aria-checked')).toBeNull();
    expect(input.getAttribute('aria-disabled')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('renders single custom checkbox', async () => {
    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component custom-checkbox input-id="check2" name="custom" label-txt="Custom Option"></checkbox-component>`,
    });

    expect(page.root!.querySelector('.custom-control.custom-checkbox')).toBeTruthy();
    const input = page.root!.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('id')).toBe('check2');

    expect(page.root).toMatchSnapshot();
  });

  it('renders checkbox group with options (fieldset/legend + correct initial checked)', async () => {
    const groupOptions = JSON.stringify([
      { value: 'opt1', labelTxt: 'Option 1', inputId: 'opt1', disabled: false, checked: true },
      { value: 'opt2', labelTxt: 'Option 2', inputId: 'opt2', disabled: false, checked: false },
    ]);

    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component checkbox-group name="group1" group-title="Choose Options" group-options='${groupOptions}' required validation validation-msg="Please select at least one"></checkbox-component>`,
    });

    const fieldset = page.root!.querySelector('fieldset.checkbox-group') as HTMLFieldSetElement;
    const legend = page.root!.querySelector('legend.group-title') as HTMLElement;
    expect(fieldset).toBeTruthy();
    expect(legend).toBeTruthy();
    expect(legend.textContent || '').toContain('Choose Options');

    const inputs = page.root!.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    expect(inputs.length).toBe(2);
    expect(inputs[0].checked).toBe(true);
    expect(inputs[1].checked).toBe(false);

    // labels wired
    const labels = page.root!.querySelectorAll('label') as NodeListOf<HTMLLabelElement>;
    expect(labels.length).toBe(2);
    expect(labels[0].getAttribute('for') || labels[0].getAttribute('htmlfor') || (labels[0] as any).htmlFor).toBe('opt1');
    expect(labels[1].getAttribute('for') || labels[1].getAttribute('htmlfor') || (labels[1] as any).htmlFor).toBe('opt2');

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

    const inputs = page.root!.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    expect(inputs.length).toBe(2);
    expect(inputs[1].disabled).toBe(true);

    // wrapper class for custom group
    expect(page.root!.querySelectorAll('.custom-control.custom-checkbox').length).toBe(2);

    expect(page.root).toMatchSnapshot();
  });

  it('shows validation message when no group option is selected and required+validation', async () => {
    const groupOptions = JSON.stringify([
      { value: 'val1', labelTxt: 'Val 1', inputId: 'val1', disabled: false, checked: false },
      { value: 'val2', labelTxt: 'Val 2', inputId: 'val2', disabled: false, checked: false },
    ]);

    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component checkbox-group name="group3" group-title="Validation Test" group-options='${groupOptions}' required validation validation-msg="Please select an option"></checkbox-component>`,
    });

    const feedback = page.root!.querySelector('.invalid-feedback') as HTMLElement;
    expect(feedback).toBeTruthy();
    expect(feedback.textContent || '').toContain('Please select an option');

    // fieldset should be aria-invalid and describe itself by feedback id
    const fieldset = page.root!.querySelector('fieldset.checkbox-group') as HTMLElement;
    expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    const describedBy = fieldset.getAttribute('aria-describedby') || '';
    expect(describedBy.length).toBeGreaterThan(0);

    // each input should also reference feedback when invalid
    const inputs = page.root!.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    expect(inputs[0].getAttribute('aria-invalid')).toBe('true');
    expect(inputs[0].getAttribute('aria-describedby') || '').toBe(describedBy);

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

    // initially invalid
    expect(page.root!.querySelector('.invalid-feedback')).toBeTruthy();

    const secondInput = page.root!.querySelectorAll('input[type="checkbox"]')[1] as HTMLInputElement;
    secondInput.checked = true;
    secondInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await page.waitForChanges();

    // invalid feedback should disappear (because checkedValues updated)
    expect(page.root!.querySelector('.invalid-feedback')).toBeNull();

    const fieldset = page.root!.querySelector('fieldset.checkbox-group') as HTMLElement;
    expect(fieldset.getAttribute('aria-invalid')).toBeNull();
    expect(fieldset.getAttribute('aria-describedby')).toBeNull();

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
    page.root!.addEventListener('groupChange', spy);

    const secondInput = page.root!.querySelectorAll('input[type="checkbox"]')[1] as HTMLInputElement;
    secondInput.checked = true;
    secondInput.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalled();
    // detail should be array of selected values
    expect(spy.mock.calls[0][0].detail).toEqual(['y']);
  });

  it('single checkbox reflects controlled checked prop and emits toggle on change', async () => {
    const page = await newSpecPage({
      components: [CheckboxComponent],
      html: `<checkbox-component input-id="single" name="s" label-txt="Single" value="v" checked></checkbox-component>`,
    });

    const input = page.root!.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBe(true);

    const spy = jest.fn();
    page.root!.addEventListener('toggle', spy);

    input.checked = false;
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          checked: false,
          value: 'v',
          inputId: 'single',
        }),
      }),
    );
  });
});
