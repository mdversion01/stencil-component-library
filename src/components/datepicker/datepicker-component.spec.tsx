/**
 * src/components/datepicker/datepicker-component.spec.tsx
 *
 * Coverage includes:
 * - Works without global CSS.escape
 * - Resolves aria-labelledby / aria-describedby safely via [id="..."]
 * - Asserts help text (__desc) is always present and outside the dialog
 * - Asserts validation message (__validation) is added only when validation
 *   is enabled and the field is invalid
 * - Accepts the current label strategy:
 *   - visible label uses aria-labelledby
 *   - hidden label uses aria-label
 * - Matches current horizontal / inline grid behavior
 * - Verifies externally controlled value synchronization
 * - Verifies externally clearing value resets selected calendar state
 * - Verifies timezone-safe parsing for YYYY-MM-DD and MM-DD-YYYY
 * - Verifies impossible controlled values do not mutate calendar state
 * - Matches current validation behavior for non-empty invalid values
 * - Verifies leap-year handling
 * - Verifies the structured date-selected event payload
 */

import { newSpecPage } from '@stencil/core/testing';
import { Datepicker } from './datepicker-component';

type ControlledDatepickerInstance = Datepicker & {
  selectedDate: Date | null;
  selectedMonth: number | null;
  selectedYear: number | null;
  currentMonth: number;
  currentYear: number;
};

function find<T extends Element = HTMLElement>(
  root: Element | ShadowRoot,
  selector: string,
): T | null {
  return root.querySelector(selector) as T | null;
}

function findAll<T extends Element = HTMLElement>(
  root: Element | ShadowRoot,
  selector: string,
): T[] {
  return Array.from(root.querySelectorAll(selector)) as T[];
}

function firstChildDiv<T extends HTMLElement = HTMLElement>(
  element: Element,
): T | null {
  return (
    Array.from(element.children).find(
      child => (child as HTMLElement).tagName === 'DIV',
    ) ?? null
  ) as T | null;
}

function escapeAttrValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function queryById(
  root: Element | ShadowRoot,
  id: string,
): Element | null {
  return root.querySelector(`[id="${escapeAttrValue(id)}"]`);
}

function parseIdRefs(
  value: string | null | undefined,
): string[] {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function hasUsableAssociation(
  host: Element | ShadowRoot,
): boolean {
  const input = find<HTMLInputElement>(
    host,
    'input.form-control',
  );

  const label = find<HTMLLabelElement>(
    host,
    'label.form-control-label',
  );

  if (!input) {
    return false;
  }

  const forId = label?.getAttribute('for') ?? null;
  const inputId = input.getAttribute('id');

  const forMatches = Boolean(
    forId &&
      inputId &&
      forId === inputId,
  );

  const ariaLabel = (
    input.getAttribute('aria-label') || ''
  ).trim();

  const hasAriaLabel = ariaLabel.length > 0;

  const ariaLabelledby = (
    input.getAttribute('aria-labelledby') || ''
  ).trim();

  const labelledIds = parseIdRefs(ariaLabelledby);

  const labelledByResolves = labelledIds.some(
    id => Boolean(queryById(host, id)),
  );

  return (
    forMatches ||
    hasAriaLabel ||
    labelledByResolves
  );
}

async function makePage(html: string) {
  const page = await newSpecPage({
    components: [Datepicker],
    html,
  });

  const htmlElementPrototype =
    page.win.HTMLElement.prototype as {
      __datepickerPatchedFocus?: boolean;
      focus: () => void;
      blur: () => void;
    };

  if (
    !htmlElementPrototype.__datepickerPatchedFocus
  ) {
    htmlElementPrototype.__datepickerPatchedFocus = true;

    htmlElementPrototype.focus =
      function focus() {};

    htmlElementPrototype.blur =
      function blur() {};
  }

  const inputPrototype =
    page.win.HTMLInputElement.prototype as {
      setSelectionRange?: (
        start: number,
        end: number,
      ) => void;
    };

  if (!inputPrototype.setSelectionRange) {
    inputPrototype.setSelectionRange =
      function setSelectionRange(
        _start: number,
        _end: number,
      ) {};
  }

  await page.waitForChanges();

  return page;
}

function expectDescribedByResolves(
  host: HTMLElement,
  input: HTMLInputElement,
): void {
  const ids = parseIdRefs(
    input.getAttribute('aria-describedby'),
  );

  expect(ids.length).toBeGreaterThan(0);

  ids.forEach(id => {
    expect(queryById(host, id)).toBeTruthy();
  });
}

function expectHelpTextOutsideDialog(
  host: HTMLElement,
  input: HTMLInputElement,
): void {
  const ids = parseIdRefs(
    input.getAttribute('aria-describedby'),
  );

  const helpId = ids.find(id =>
    id.endsWith('__desc'),
  );

  expect(helpId).toBeTruthy();

  const helpElement = helpId
    ? queryById(host, helpId)
    : null;

  expect(helpElement).toBeTruthy();

  const dialog = find<HTMLElement>(
    host,
    '.dropdown-content',
  );

  if (dialog && helpElement) {
    expect(
      dialog.contains(helpElement),
    ).toBe(false);
  }
}

function expectNoInvalidState(
  host: HTMLElement,
  input: HTMLInputElement,
): void {
  expect(
    input.classList.contains('is-invalid'),
  ).toBe(false);

  expect(
    input.getAttribute('aria-invalid'),
  ).not.toBe('true');

  const describedByIds = parseIdRefs(
    input.getAttribute('aria-describedby'),
  );

  expect(
    describedByIds.some(id =>
      id.endsWith('__validation'),
    ),
  ).toBe(false);

  expect(
    find<HTMLElement>(
      host,
      '[id$="__validation"]',
    ),
  ).toBeNull();
}

function expectInvalidState(
  host: HTMLElement,
  input: HTMLInputElement,
): void {
  expect(
    input.classList.contains('is-invalid') ||
      input.getAttribute('aria-invalid') === 'true',
  ).toBe(true);

  expect(
    input.getAttribute('aria-invalid'),
  ).toBe('true');

  const describedByIds = parseIdRefs(
    input.getAttribute('aria-describedby'),
  );

  const validationId = describedByIds.find(id =>
    id.endsWith('__validation'),
  );

  expect(validationId).toBeTruthy();

  const validationElement = validationId
    ? (queryById(
        host,
        validationId,
      ) as HTMLElement | null)
    : null;

  expect(validationElement).toBeTruthy();

  if (validationElement) {
    expect(
      validationElement.getAttribute('aria-live'),
    ).toBe('polite');

    expect(
      validationElement.getAttribute('aria-atomic'),
    ).toBe('true');
  }
}

describe('datepicker-component', () => {
  it('renders', async () => {
    const page = await makePage(
      `<datepicker-component></datepicker-component>`,
    );

    expect(page.root).toBeTruthy();
  });

  it('horizontal layout (numeric fallback): applies label/input col classes and labelSize', async () => {
    const page = await makePage(`
      <datepicker-component
        form-layout="horizontal"
        label="Birthday"
        label-size="lg"
        label-col="3"
        input-col="9"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const groups = findAll(
      host,
      '.form-group',
    );

    expect(
      groups.length,
    ).toBeGreaterThan(0);

    const group = groups[0];

    const inputCol = firstChildDiv(group);

    expect(inputCol).toBeTruthy();

    expect(
      inputCol!.className,
    ).toContain('col-9');

    const label = find<HTMLLabelElement>(
      host,
      'label.form-control-label',
    );

    expect(label).toBeTruthy();

    expect(
      label!.className,
    ).toContain('col-3');

    expect(
      label!.className,
    ).toContain('form-control-label');

    expect(
      label!.className,
    ).toMatch(
      /\blg\b|label-lg|col-form-label-lg/,
    );
  });

  it('horizontal + labelHidden: expands input to col-12 and still has usable accessible naming', async () => {
    const page = await makePage(`
      <datepicker-component
        form-layout="horizontal"
        label="Start date"
        label-hidden
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    expect(
      hasUsableAssociation(host),
    ).toBe(true);

    const groups = findAll(
      host,
      '.form-group',
    );

    expect(
      groups.length,
    ).toBeGreaterThan(0);

    const group = groups[0];

    const inputCol = firstChildDiv(group);

    expect(inputCol).toBeTruthy();

    expect(
      inputCol!.className,
    ).toContain('col-12');
  });

  it('horizontal layout with string specs: parses labelCols/inputCols properly', async () => {
    const page = await makePage(`
      <datepicker-component
        form-layout="horizontal"
        label="When?"
        label-cols="sm-4 md-3"
        input-cols="sm-8 md-9"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const groups = findAll(
      host,
      '.form-group',
    );

    expect(
      groups.length,
    ).toBeGreaterThan(0);

    const group = groups[0];

    const inputCol = firstChildDiv(group);

    expect(inputCol).toBeTruthy();

    expect(
      inputCol!.className,
    ).toContain('col-sm-8');

    expect(
      inputCol!.className,
    ).toContain('col-md-9');

    const label = find<HTMLLabelElement>(
      host,
      'label.form-control-label',
    );

    expect(label).toBeTruthy();

    expect(
      label!.className,
    ).toContain('col-sm-4');

    expect(
      label!.className,
    ).toContain('col-md-3');
  });

  it('inline layout: does not apply grid classes by default, even if numeric widths are provided', async () => {
    const page1 = await makePage(`
      <datepicker-component
        form-layout="inline"
        label="Date"
      ></datepicker-component>
    `);

    const host1 = page1.root as HTMLElement;

    const label1 = find<HTMLLabelElement>(
      host1,
      'label.form-control-label',
    );

    expect(label1).toBeTruthy();

    expect(
      label1!.className,
    ).not.toMatch(/\bcol-\w+/);

    const inputGroup1 = find<HTMLElement>(
      host1,
      '.form-group .input-group',
    );

    expect(inputGroup1).toBeTruthy();

    const inputWrap1 =
      inputGroup1!.parentElement as HTMLElement;

    expect(
      inputWrap1.className,
    ).not.toMatch(/\bcol-\w+/);

    const page2 = await makePage(`
      <datepicker-component
        form-layout="inline"
        label="Date"
        input-col="6"
      ></datepicker-component>
    `);

    const host2 = page2.root as HTMLElement;

    const label2 = find<HTMLLabelElement>(
      host2,
      'label.form-control-label',
    );

    expect(label2).toBeTruthy();

    expect(
      label2!.className,
    ).not.toMatch(/\bcol-\w+/);

    const inputGroup2 = find<HTMLElement>(
      host2,
      '.form-group .input-group',
    );

    expect(inputGroup2).toBeTruthy();

    const inputWrap2 =
      inputGroup2!.parentElement as HTMLElement;

    expect(
      inputWrap2.className,
    ).not.toMatch(/\bcol-\w+/);
  });

  it('always renders help text id and keeps aria-describedby resolvable', async () => {
    const page = await makePage(`
      <datepicker-component
        label="Birthday"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

    expectDescribedByResolves(
      host,
      input!,
    );

    expectHelpTextOutsideDialog(
      host,
      input!,
    );
  });

  it('input -> clear -> blur becomes invalid when required + validation are enabled', async () => {
    const page = await makePage(`
      <datepicker-component
        required
        validation
        label="Date"
        validation-message="Date is required."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

    input!.value = '2022-01-02';

    input!.dispatchEvent(
      new page.win.Event('input', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    input!.value = '';

    input!.dispatchEvent(
      new page.win.Event('input', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    input!.dispatchEvent(
      new page.win.Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expectInvalidState(
      host,
      input!,
    );

    const describedByIds = parseIdRefs(
      input!.getAttribute('aria-describedby'),
    );

    const validationId = describedByIds.find(id =>
      id.endsWith('__validation'),
    );

    const validationElement = validationId
      ? (queryById(
          host,
          validationId,
        ) as HTMLElement | null)
      : null;

    expect(
      (
        validationElement?.textContent ||
        ''
      ).trim(),
    ).toBe('Please select a date.');

    expectDescribedByResolves(
      host,
      input!,
    );
  });

  it('does not show invalid state on blur when validation attribute is absent', async () => {
    const page = await makePage(`
      <datepicker-component
        required
        label="Date"
        validation-message="Date is required."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

    input!.value = '';

    input!.dispatchEvent(
      new page.win.Event('input', {
        bubbles: true,
      }),
    );

    input!.dispatchEvent(
      new page.win.Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expectNoInvalidState(
      host,
      input!,
    );
  });

  it('warns once when both placeholder and dateFormat are provided', async () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    await makePage(`
      <datepicker-component
        date-format="YYYY-MM-DD"
        placeholder="Pick a date"
      ></datepicker-component>
    `);

    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('associates label with input via for=id or ARIA naming', async () => {
    const page = await makePage(`
      <datepicker-component
        label="Birthday"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    expect(
      hasUsableAssociation(host),
    ).toBe(true);
  });

  it('labelHidden uses aria-label instead of aria-labelledby', async () => {
    const page = await makePage(`
      <datepicker-component
        label="Birthday"
        label-hidden
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

    expect(
      (
        input!.getAttribute('aria-label') || ''
      ).trim(),
    ).toBe('Birthday');

    expect(
      input!.getAttribute('aria-labelledby'),
    ).toBeNull();
  });

  it('visible label uses aria-labelledby and that id resolves', async () => {
    const page = await makePage(`
      <datepicker-component
        label="Birthday"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

    const ids = parseIdRefs(
      input!.getAttribute('aria-labelledby'),
    );

    expect(ids.length).toBeGreaterThan(0);

    ids.forEach(id => {
      expect(
        queryById(host, id),
      ).toBeTruthy();
    });

    expect(
      input!.getAttribute('aria-label'),
    ).toBeNull();
  });

  it('synchronizes an externally updated YYYY-MM-DD value with the input and calendar state', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="controlled-datepicker"
        date-format="YYYY-MM-DD"
        value="2026-07-20"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();
    expect(input!.value).toBe('2026-07-20');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(6);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(20);

    instance.value = '2026-08-15';

    await page.waitForChanges();

    expect(input!.value).toBe('2026-08-15');
    expect(instance.value).toBe('2026-08-15');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(7);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(15);

    expect(instance.selectedMonth).toBe(8);
    expect(instance.selectedYear).toBe(2026);
    expect(instance.currentMonth).toBe(7);
    expect(instance.currentYear).toBe(2026);
  });

  it('clears the input and selected calendar state when value is externally cleared', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="controlled-datepicker-clear"
        date-format="YYYY-MM-DD"
        value="2026-07-20"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();
    expect(input!.value).toBe('2026-07-20');
    expect(instance.selectedDate).toBeTruthy();

    instance.value = '';

    await page.waitForChanges();

    expect(instance.value).toBe('');
    expect(input!.value).toBe('');

    expect(instance.selectedDate).toBeNull();
    expect(instance.selectedMonth).toBeNull();
    expect(instance.selectedYear).toBeNull();

    const activeDate = find<HTMLElement>(
      host,
      '.calendar-grid-item span.active',
    );

    expect(activeDate).toBeNull();
  });

  it('parses an externally controlled MM-DD-YYYY value without shifting the local calendar date', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="controlled-datepicker-us-format"
        date-format="MM-DD-YYYY"
        placeholder="MM-DD-YYYY"
        value="07-20-2026"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();
    expect(input!.value).toBe('07-20-2026');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(6);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(20);

    instance.value = '08-15-2026';

    await page.waitForChanges();

    expect(input!.value).toBe('08-15-2026');
    expect(instance.value).toBe('08-15-2026');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(7);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(15);

    expect(instance.selectedMonth).toBe(8);
    expect(instance.selectedYear).toBe(2026);
    expect(instance.currentMonth).toBe(7);
    expect(instance.currentYear).toBe(2026);
  });

  it('emits a structured date-selected payload after selecting a calendar date', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="datepicker-event"
        date-format="YYYY-MM-DD"
        value="2026-07-20"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

    const selectedHandler = jest.fn();

    host.addEventListener(
      'date-selected',
      selectedHandler,
    );

    const dateCell = find<HTMLElement>(
      host,
      '.calendar-grid-item[data-date="2026-07-21"]',
    );

    expect(dateCell).toBeTruthy();

    const clickableDate =
      dateCell?.querySelector<HTMLElement>('span');

    expect(clickableDate).toBeTruthy();

    clickableDate!.dispatchEvent(
      new page.win.MouseEvent('click', {
        bubbles: true,
        composed: true,
      }),
    );

    await page.waitForChanges();

    expect(
      selectedHandler,
    ).toHaveBeenCalledTimes(1);

    const event = selectedHandler.mock
      .calls[0][0] as CustomEvent<{
      value: string;
      formattedDate: string;
      date: string;
    }>;

    expect(event.detail).toEqual({
      value: '2026-07-21',
      formattedDate: expect.any(String),
      date: '2026-07-21',
    });

    expect(
      event.detail.formattedDate.length,
    ).toBeGreaterThan(0);

    expect(input!.value).toBe('2026-07-21');

    expect(
      (page.rootInstance as Datepicker).value,
    ).toBe('2026-07-21');
  });

  it('preserves the last valid selection for an impossible MM-DD-YYYY controlled value', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="controlled-datepicker-invalid"
        date-format="MM-DD-YYYY"
        placeholder="MM-DD-YYYY"
        value="02-28-2026"
        required
        validation
        validation-message="Please enter a valid date."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();
    expect(input!.value).toBe('02-28-2026');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    instance.value = '02-30-2026';

    await page.waitForChanges();

    expect(instance.value).toBe('02-30-2026');
    expect(input!.value).toBe('02-30-2026');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    expect(instance.selectedMonth).toBe(2);
    expect(instance.selectedYear).toBe(2026);
    expect(instance.currentMonth).toBe(1);
    expect(instance.currentYear).toBe(2026);

    input!.dispatchEvent(
      new page.win.Event('input', {
        bubbles: true,
      }),
    );

    input!.dispatchEvent(
      new page.win.Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expectNoInvalidState(
      host,
      input!,
    );
  });

  it('preserves the last valid selection for an impossible YYYY-MM-DD controlled value', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="controlled-datepicker-invalid-ymd"
        date-format="YYYY-MM-DD"
        placeholder="YYYY-MM-DD"
        value="2026-02-28"
        required
        validation
        validation-message="Please enter a valid date."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();
    expect(input!.value).toBe('2026-02-28');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    instance.value = '2026-02-30';

    await page.waitForChanges();

    expect(instance.value).toBe('2026-02-30');
    expect(input!.value).toBe('2026-02-30');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    expect(instance.selectedMonth).toBe(2);
    expect(instance.selectedYear).toBe(2026);
    expect(instance.currentMonth).toBe(1);
    expect(instance.currentYear).toBe(2026);

    input!.dispatchEvent(
      new page.win.Event('input', {
        bubbles: true,
      }),
    );

    input!.dispatchEvent(
      new page.win.Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expectNoInvalidState(
      host,
      input!,
    );
  });

  it('does not immediately trigger required validation when value is externally cleared', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="controlled-datepicker-required-clear"
        date-format="YYYY-MM-DD"
        value="2026-07-20"
        required
        validation
        validation-message="Date is required."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();
    expect(input!.value).toBe('2026-07-20');
    expect(instance.selectedDate).toBeTruthy();

    expectNoInvalidState(
      host,
      input!,
    );

    instance.value = '';

    await page.waitForChanges();

    expect(input!.value).toBe('');
    expect(instance.selectedDate).toBeNull();
    expect(instance.selectedMonth).toBeNull();
    expect(instance.selectedYear).toBeNull();

    expectNoInvalidState(
      host,
      input!,
    );

    input!.dispatchEvent(
      new page.win.Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expectInvalidState(
      host,
      input!,
    );
  });

  it('rejects 2026-02-29 as a calendar selection because 2026 is not a leap year', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="controlled-datepicker-non-leap-year"
        date-format="YYYY-MM-DD"
        placeholder="YYYY-MM-DD"
        value="2026-02-28"
        required
        validation
        validation-message="Please enter a valid date."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();
    expect(input!.value).toBe('2026-02-28');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    instance.value = '2026-02-29';

    await page.waitForChanges();

    expect(instance.value).toBe('2026-02-29');
    expect(input!.value).toBe('2026-02-29');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    expect(instance.selectedMonth).toBe(2);
    expect(instance.selectedYear).toBe(2026);
    expect(instance.currentMonth).toBe(1);
    expect(instance.currentYear).toBe(2026);

    input!.dispatchEvent(
      new page.win.Event('input', {
        bubbles: true,
      }),
    );

    input!.dispatchEvent(
      new page.win.Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expectNoInvalidState(
      host,
      input!,
    );
  });

  it('accepts 2028-02-29 because 2028 is a leap year', async () => {
    const page = await makePage(`
      <datepicker-component
        input-id="controlled-datepicker-leap-year"
        date-format="YYYY-MM-DD"
        placeholder="YYYY-MM-DD"
        value="2028-02-28"
        required
        validation
        validation-message="Please enter a valid date."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();
    expect(input!.value).toBe('2028-02-28');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    instance.value = '2028-02-29';

    await page.waitForChanges();

    expect(instance.value).toBe('2028-02-29');
    expect(input!.value).toBe('2028-02-29');

    expect(instance.selectedDate).toBeTruthy();

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2028);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(29);

    expect(instance.selectedMonth).toBe(2);
    expect(instance.selectedYear).toBe(2028);
    expect(instance.currentMonth).toBe(1);
    expect(instance.currentYear).toBe(2028);

    expectNoInvalidState(
      host,
      input!,
    );

    input!.dispatchEvent(
      new page.win.Event('blur', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expectNoInvalidState(
      host,
      input!,
    );
  });
});
