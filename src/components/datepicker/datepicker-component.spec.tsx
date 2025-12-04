// src/components/datepicker/datepicker-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { Datepicker } from './datepicker-component';

// ---- Mocks & polyfills that the component expects in the env ----
jest.mock('@popperjs/core', () => ({
  createPopper: jest.fn(() => ({ destroy: jest.fn() })),
}));

// JSDOM/Stencil mock window exposes CSS as a read-only getter.
// Define (or extend) it without assigning directly.
beforeAll(() => {
  const g = globalThis as any;

  if (!g.CSS) {
    Object.defineProperty(g, 'CSS', {
      value: {},
      configurable: true,
    });
  }

  if (!g.CSS.escape) {
    Object.defineProperty(g.CSS, 'escape', {
      value: (sel: string) => sel,
      configurable: true,
    });
  }
});

const find = (root: HTMLElement, selector: string) => root.querySelector(selector) as HTMLElement | null;
const findAll = (root: HTMLElement, selector: string) => Array.from(root.querySelectorAll(selector)) as HTMLElement[];

describe('datepicker-component', () => {
  it('renders (light DOM) and matches initial snapshot', async () => {
    const page = await newSpecPage({
      components: [Datepicker],
      html: `<datepicker-component required></datepicker-component>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('shows label as required before selection, removes required class after selecting a date', async () => {
    const page = await newSpecPage({
      components: [Datepicker],
      html: `<datepicker-component required></datepicker-component>`,
    });

    const host = page.root as HTMLElement;

    // Initially shows required (no date selected)
    expect(find(host, 'label.form-control-label.required')).toBeTruthy();

    // Select first visible day
    const firstDaySpan = find(host, '.calendar-grid .calendar-grid-item span');
    expect(firstDaySpan).toBeTruthy();
    firstDaySpan!.click();
    await page.waitForChanges();

    // Required class removed after real selection
    expect(find(host, 'label.form-control-label.required')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('clear button clears the input and re-applies invalid classes', async () => {
    const page = await newSpecPage({
      components: [Datepicker],
      html: `<datepicker-component required></datepicker-component>`,
    });

    const host = page.root as HTMLElement;

    // Select a date to expose the clear button
    const day = find(host, '.calendar-grid .calendar-grid-item span');
    day!.click();
    await page.waitForChanges();

    const clearBtn = find(host, '.clear-input-button');
    expect(clearBtn).toBeTruthy();

    clearBtn!.click();
    await page.waitForChanges();

    const input = find(host, 'input.form-control');
    const group = find(host, '.input-group');
    const calendarBtn = find(host, '.calendar-button.btn.input-group-text');

    expect(input?.classList.contains('is-invalid')).toBe(true);
    expect(group?.classList.contains('is-invalid')).toBe(true);
    if (calendarBtn) {
      expect(calendarBtn.classList.contains('is-invalid')).toBe(true);
    }
    expect(find(host, 'label.form-control-label.required')).toBeTruthy();

    expect(page.root).toMatchSnapshot();
  });

  it('typing to empty (Backspace flow) re-applies invalid classes', async () => {
    const page = await newSpecPage({
      components: [Datepicker],
      html: `<datepicker-component required></datepicker-component>`,
    });

    const host = page.root as HTMLElement;

    // 1) Pick a day to clear any invalid state first
    const firstDay = host.querySelector('.calendar-grid .calendar-grid-item span') as HTMLElement;
    firstDay.click();
    await page.waitForChanges();

    // 2) Re-query the fresh input after selection
    let input = host.querySelector('input.form-control') as HTMLInputElement;
    expect(input).toBeTruthy();

    // 3) Clear to empty via input event, then blur to trigger the "empty => invalid" path
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await page.waitForChanges();

    // blur seals the state in both handleInputBlur (empty => invalid) and keeps parity with user behavior
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await page.waitForChanges();

    // 4) Re-query after render (nodes can be replaced)
    input = host.querySelector('input.form-control') as HTMLInputElement;
    const group = host.querySelector('.input-group') as HTMLElement;
    const calendarBtn = host.querySelector('.calendar-button.btn.input-group-text') as HTMLElement | null;

    // 5) Assert invalid classes are back
    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(group?.classList.contains('is-invalid')).toBe(true);
    if (calendarBtn) {
      expect(calendarBtn.classList.contains('is-invalid')).toBe(true);
    }

    // label shows required again when no date is selected
    expect(host.querySelector('label.form-control-label.required')).toBeTruthy();

    expect(page.root).toMatchSnapshot();
  });

  it('clicking the calendar button does NOT clear invalid state; only selecting a day does', async () => {
    const page = await newSpecPage({
      components: [Datepicker],
      html: `<datepicker-component required></datepicker-component>`,
    });

    const host = page.root as HTMLElement;

    // Force invalid state
    (page.rootInstance as Datepicker).validation = true;
    await page.waitForChanges();

    const calendarButton = find(host, '.calendar-button.btn.input-group-text')!;
    expect(calendarButton).toBeTruthy();

    // Open dropdown (should not clear invalid)
    calendarButton.click();
    await page.waitForChanges();

    const input = find(host, 'input.form-control')!;
    const group = find(host, '.input-group')!;
    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(group.classList.contains('is-invalid')).toBe(true);

    // Now pick a day -> clears invalid
    const day = find(host, '.calendar-grid .calendar-grid-item span')!;
    day.click();
    await page.waitForChanges();

    expect(input.classList.contains('is-invalid')).toBe(false);
    expect(group.classList.contains('is-invalid')).toBe(false);
  });

  it('respects placeholder/dateFormat interaction (no user placeholder -> placeholder mirrors format)', async () => {
    const page = await newSpecPage({
      components: [Datepicker],
      html: `<datepicker-component date-format="MM-DD-YYYY"></datepicker-component>`,
    });
    const host = page.root as HTMLElement;
    const input = find(host, 'input.form-control') as HTMLInputElement;
    expect(input.placeholder).toBe('MM-DD-YYYY');

    (page.rootInstance as Datepicker).dateFormat = 'YYYY-MM-DD';
    await page.waitForChanges();
    expect((find(host, 'input.form-control') as HTMLInputElement).placeholder).toBe('YYYY-MM-DD');
  });

  it('when user provides placeholder, it is not overridden by dateFormat changes', async () => {
    const page = await newSpecPage({
      components: [Datepicker],
      html: `<datepicker-component date-format="YYYY-MM-DD" placeholder="Pick a date"></datepicker-component>`,
    });
    const host = page.root as HTMLElement;
    const input = find(host, 'input.form-control') as HTMLInputElement;

    expect(input.placeholder).toBe('Pick a date');

    (page.rootInstance as Datepicker).dateFormat = 'MM-DD-YYYY';
    await page.waitForChanges();
    expect((find(host, 'input.form-control') as HTMLInputElement).placeholder).toBe('Pick a date');
  });
});
