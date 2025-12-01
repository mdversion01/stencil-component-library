import { newSpecPage } from '@stencil/core/testing';
import { PlumageTimepickerComponent as PlumageTimepickerComponent } from './plumage-timepicker-component'; // file exports plumage component

describe('plumage-timepicker-component', () => {
  it('shows the label when "show-label" is present and respects label text/id', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component show-label label-text="Pick a time" input-id="my-time"></plumage-timepicker-component>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // Visible label when show-label is present
    expect(label.classList.contains('sr-only')).toBe(false);
    expect(label.textContent).toContain('Pick a time');

    // Association via aria-labelledby (robust across environments)
    expect(label.id).toBe('time-label');
    expect(input.id).toBe('my-time');
    expect(input.getAttribute('aria-labelledby')).toBe('time-label');

    expect(root).toMatchSnapshot();
  });

  it('hides the label (sr-only) when "show-label" is omitted', async () => {
    const page = await newSpecPage({
      components: [PlumageTimepickerComponent],
      html: `<plumage-timepicker-component label-text="Hidden label test" input-id="a1"></plumage-timepicker-component>`,
    });

    const root = page.root!;
    const label = root.querySelector('label') as HTMLLabelElement;
    const input = root.querySelector('input.time-input') as HTMLInputElement;

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();

    // Hidden visually, available to AT
    expect(label.classList.contains('sr-only')).toBe(true);
    expect(label.textContent).toContain('Hidden label test');

    // Still correctly associated
    expect(label.id).toBe('time-label');
    expect(input.id).toBe('a1');
    expect(input.getAttribute('aria-labelledby')).toBe('time-label');

    expect(root).toMatchSnapshot();
  });
});
