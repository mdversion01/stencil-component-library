import { newSpecPage } from '@stencil/core/testing';
import { TimePickerComponent as TimepickerComponent } from './timepicker-component';

describe('timepicker-component', () => {
  it('shows the label when "show-label" is present and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component show-label label-text="Pick a time" input-id="my-time"></timepicker-component>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // Visible label when show-label is present
    expect(label.classList.contains('sr-only')).toBe(false);
    expect(label.textContent).toContain('Pick a time');

    // Robust association check via aria-labelledby instead of .htmlFor/.getAttribute('for')
    expect(label.id).toBe('time-label');
    expect(input.id).toBe('my-time');
    expect(input.getAttribute('aria-labelledby')).toBe('time-label');

    expect(root).toMatchSnapshot();
  });

  it('hides the label (sr-only) when "show-label" is omitted', async () => {
    const page = await newSpecPage({
      components: [TimepickerComponent],
      html: `<timepicker-component label-text="Hidden label test" input-id="a1"></timepicker-component>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // Hidden for sighted users but present for screen readers
    expect(label.classList.contains('sr-only')).toBe(true);
    expect(label.textContent).toContain('Hidden label test');

    // Still correctly associated via aria-labelledby
    expect(label.id).toBe('time-label');
    expect(input.id).toBe('a1');
    expect(input.getAttribute('aria-labelledby')).toBe('time-label');

    expect(root).toMatchSnapshot();
  });
});
