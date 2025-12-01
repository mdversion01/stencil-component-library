import { newSpecPage } from '@stencil/core/testing';
import { TimepickerManagerComponent } from './timepicker-manager-component';
import { TimePickerComponent } from './timepicker-component';
import { PlumageTimepickerComponent } from './plumage-timepicker-component';

describe('timepicker-manager', () => {
  it('renders classic path and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimePickerComponent],
      html: `<timepicker-manager></timepicker-manager>`,
    });

    const child = page.root!.querySelector('timepicker-component') as any;
    expect(child).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('renders plumage path and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, PlumageTimepickerComponent],
      html: `<timepicker-manager use-pl-timepicker></timepicker-manager>`,
    });

    const child = page.root!.querySelector('plumage-timepicker-component') as any;
    expect(child).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('forwards props to classic child (check properties, not attributes)', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, TimePickerComponent],
      html: `
        <timepicker-manager
          show-label
          label-text="Pick a time"
          input-id="my-input"
          size="sm"
        ></timepicker-manager>
      `,
    });

    const child = page.root!.querySelector('timepicker-component') as any;
    expect(child).toBeTruthy();

    // boolean prop (no reflect expected)
    expect(child.showLabel).toBe(true);

    // string props
    expect(child.labelText).toBe('Pick a time');
    expect(child.inputId).toBe('my-input');
    expect(child.size).toBe('sm');
  });

  it('forwards props to plumage child (check properties, not attributes)', async () => {
    const page = await newSpecPage({
      components: [TimepickerManagerComponent, PlumageTimepickerComponent],
      html: `
        <timepicker-manager
          use-pl-timepicker
          show-label
          label-text="Pick a time"
          input-id="my-input"
          size="sm"
        ></timepicker-manager>
      `,
    });

    const child = page.root!.querySelector('plumage-timepicker-component') as any;
    expect(child).toBeTruthy();

    expect(child.showLabel).toBe(true);
    expect(child.labelText).toBe('Pick a time');
    expect(child.inputId).toBe('my-input');
    expect(child.size).toBe('sm');
  });
});
