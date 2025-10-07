// src/components/autocomplete-single/autocomplete-single.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AutocompleteSingle } from './autocomplete-single';

describe('<autocomplete-single>', () => {
  it('renders correctly with default props', async () => {
    const page = await newSpecPage({
      components: [AutocompleteSingle],
      html: `<autocomplete-single label="Test Label" input-id="test"></autocomplete-single>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root.querySelector('input')).toBeTruthy();
    expect(page.root.querySelector('label')?.textContent).toContain('Test Label');

     // ✅ Snapshot rendering
     expect(page.root).toMatchSnapshot();

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
