// src/components/autocomplete-single/autocomplete-single.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteSingle } from './autocomplete-single';

describe('<autocomplete-single>', () => {
  it('renders correctly with default props', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Test Label" input-id="test"></autocomplete-single>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input') as HTMLInputElement;

    expect(root).toBeTruthy();
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // label text & updated class
    expect(label.textContent).toContain('Test Label');
    expect(label.className).toContain('form-control-label');

    // placeholder now prefers the label
    expect(input.placeholder).toBe('Test Label');

    // a11y basics unchanged
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-controls')).toBe('test-listbox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });


  it('filters options based on input', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Fruits" input-id="fruit" placeholder="Type fruit..."></autocomplete-single>`,
    });

    const component = page.rootInstance;
    component.options = ['Apple', 'Banana', 'Orange'];
    component.inputValue = 'Ap';
    component['filterOptions'](); // invoke private method
    await page.waitForChanges();

    expect(component.filteredOptions).toEqual(['Apple']);
  });

  it('emits itemSelect event on selecting option', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single></autocomplete-single>`,
    });

    const component = page.rootInstance;
    const spy = jest.fn();
    component.options = ['One', 'Two', 'Three'];
    component.itemSelect = { emit: spy } as any;
    component.selectOption('Two');
    expect(spy).toHaveBeenCalledWith('Two');
  });

  it('emits clear event on clearInput', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single required></autocomplete-single>`,
    });

    const component = page.rootInstance;
    const spy = jest.fn();
    component.clear = { emit: spy } as any;
    component.inputValue = 'Some text';
    component.clearInput();
    expect(component.inputValue).toBe('');
    expect(spy).toHaveBeenCalled();
  });

  it('sanitizes input to prevent HTML injection', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single></autocomplete-single>`,
    });

    const component = page.rootInstance;
    const malicious = '<script>alert("XSS")</script>';
    const sanitized = component['sanitizeInput'](malicious);
    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
  });
});
