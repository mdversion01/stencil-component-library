// File: src/components/plumage-date-picker/plumage-datepicker-component.spec.tsx

import { newSpecPage } from '@stencil/core/testing';

import { PlumageDatepicker } from './plumage-datepicker-component';

type ControlledDatepickerInstance = PlumageDatepicker & {
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
  return root.querySelector(
    `[id="${escapeAttrValue(id)}"]`,
  );
}

function parseIdRefs(
  value: string | null | undefined,
): string[] {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeGeneratedDatepickerIds(
  root: HTMLElement,
): void {
  if (root.hasAttribute('input-id')) {
    return;
  }

  const input = find<HTMLInputElement>(
    root,
    'input.form-control',
  );

  const generatedId = input?.getAttribute('id') || '';

  if (!generatedId) {
    return;
  }

  const stableId = 'datepicker-test-id';

  const elements: Element[] = [
    root,
    ...Array.from(root.querySelectorAll('*')),
  ];

  elements.forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      if (!attribute.value.includes(generatedId)) {
        return;
      }

      element.setAttribute(
        attribute.name,
        attribute.value
          .split(generatedId)
          .join(stableId),
      );
    });
  });
}

function expectStableSnapshot(
  root: HTMLElement,
  hint: string,
): void {
  const snapshotRoot = root.cloneNode(true) as HTMLElement;

  normalizeGeneratedDatepickerIds(snapshotRoot);

  expect(snapshotRoot).toMatchSnapshot(hint);
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

  const labelledIds = parseIdRefs(
    input.getAttribute('aria-labelledby'),
  );

  const labelledByResolves = labelledIds.some(id =>
    Boolean(queryById(host, id)),
  );

  return (
    forMatches ||
    hasAriaLabel ||
    labelledByResolves
  );
}

async function makePage(html: string) {
  const page = await newSpecPage({
    components: [PlumageDatepicker],
    html,
  });

  const htmlElementPrototype =
    page.win.HTMLElement.prototype as {
      __plumageDatepickerPatchedFocus?: boolean;
      focus: () => void;
      blur: () => void;
    };

  if (!htmlElementPrototype.__plumageDatepickerPatchedFocus) {
    htmlElementPrototype.__plumageDatepickerPatchedFocus = true;

    htmlElementPrototype.focus = function focus() {};
    htmlElementPrototype.blur = function blur() {};
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
    expect(dialog.contains(helpElement)).toBe(false);
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

describe('plumage-datepicker-component', () => {
  it('renders', async () => {
    const page = await makePage(`
      <plumage-datepicker-component>
      </plumage-datepicker-component>
    `);

    expect(page.root).toBeTruthy();

    expectStableSnapshot(
      page.root as HTMLElement,
      'default-render',
    );
  });

  it('renders the Plumage input group', async () => {
    const page = await makePage(`
      <plumage-datepicker-component>
      </plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    expect(
      find(host, '.form-input-group'),
    ).toBeTruthy();

    expect(
      find(host, '.b-underline'),
    ).toBeTruthy();

    expect(
      find(host, '.b-focus'),
    ).toBeTruthy();
  });

  it('horizontal layout applies numeric label and input columns and label size', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        form-layout="horizontal"
        label="Birthday"
        label-size="lg"
        label-col="3"
        input-col="9"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const groups = findAll(
      host,
      '.form-group',
    );

    expect(
      groups.length,
    ).toBeGreaterThan(0);

    const inputCol = firstChildDiv(groups[0]);

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
    ).toContain('col-form-label-lg');

    expectStableSnapshot(
      host,
      'horizontal-layout',
    );
  });

  it('horizontal + labelHidden expands input to col-12 and preserves accessible naming', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        form-layout="horizontal"
        label="Start date"
        label-hidden
      ></plumage-datepicker-component>
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

    const inputCol = firstChildDiv(groups[0]);

    expect(inputCol).toBeTruthy();

    expect(
      inputCol!.className,
    ).toContain('col-12');

    expectStableSnapshot(
      host,
      'horizontal-label-hidden',
    );
  });

  it('horizontal layout parses responsive labelCols and inputCols', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        form-layout="horizontal"
        label="When?"
        label-cols="sm-4 md-3"
        input-cols="sm-8 md-9"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const groups = findAll(
      host,
      '.form-group',
    );

    expect(
      groups.length,
    ).toBeGreaterThan(0);

    const inputCol = firstChildDiv(groups[0]);

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

  it('inline layout does not apply numeric grid classes by default', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        form-layout="inline"
        label="Date"
        input-col="6"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const label = find<HTMLLabelElement>(
      host,
      'label.form-control-label',
    );

    expect(label).toBeTruthy();

    expect(
      label!.className,
    ).not.toMatch(/\bcol-\w+/);

    const inputGroup = find<HTMLElement>(
      host,
      '.form-group .input-group',
    );

    expect(inputGroup).toBeTruthy();

    const inputWrap =
      inputGroup!.parentElement as HTMLElement;

    expect(
      inputWrap.className,
    ).not.toMatch(/\bcol-\w+/);
  });

  it('always renders help text and keeps aria-describedby resolvable', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        label="Birthday"
      ></plumage-datepicker-component>
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

  it('clearing the input becomes invalid immediately when validation is enabled', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        required
        validation
        label="Date"
        validation-message="Date is required."
      ></plumage-datepicker-component>
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

    expectNoInvalidState(
      host,
      input!,
    );

    input!.value = '';

    input!.dispatchEvent(
      new page.win.Event('input', {
        bubbles: true,
      }),
    );

    await page.waitForChanges();

    expectInvalidState(
      host,
      input!,
    );

    const validationElement =
      find<HTMLElement>(
        host,
        '[id$="__validation"]',
      );

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

    expectStableSnapshot(
      host,
      'required-validation-invalid',
    );
  });

  it('does not show invalid state when validation attribute is absent', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        required
        label="Date"
        validation-message="Date is required."
      ></plumage-datepicker-component>
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

    await page.waitForChanges();

    expectNoInvalidState(
      host,
      input!,
    );
  });

  it('does not perform validation merely because the input blurs', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        required
        validation
        label="Date"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

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

  it('warns when both placeholder and date-format attributes are provided', async () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    try {
      await makePage(`
        <plumage-datepicker-component
          date-format="YYYY-MM-DD"
          placeholder="Pick a date"
        ></plumage-datepicker-component>
      `);

      expect(
        warnSpy,
      ).toHaveBeenCalledTimes(1);

      expect(
        warnSpy.mock.calls[0][0],
      ).toContain('placeholder');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('associates visible label with the input', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        label="Birthday"
      ></plumage-datepicker-component>
    `);

    expect(
      hasUsableAssociation(
        page.root as HTMLElement,
      ),
    ).toBe(true);
  });

  it('labelHidden uses aria-label instead of aria-labelledby', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        label="Birthday"
        label-hidden
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

    expect(
      (
        input!.getAttribute('aria-label') ||
        ''
      ).trim(),
    ).toBe('Birthday');

    expect(
      input!.getAttribute('aria-labelledby'),
    ).toBeNull();

    expectStableSnapshot(
      host,
      'label-hidden-accessibility',
    );
  });

  it('visible label uses aria-labelledby and resolves the referenced id', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        label="Birthday"
      ></plumage-datepicker-component>
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

    expect(
      ids.length,
    ).toBeGreaterThan(0);

    ids.forEach(id => {
      expect(
        queryById(host, id),
      ).toBeTruthy();
    });

    expect(
      input!.getAttribute('aria-label'),
    ).toBeNull();
  });

  it('works when global CSS.escape is unavailable', async () => {
    const originalCss = (
      globalThis as {
        CSS?: typeof CSS;
      }
    ).CSS;

    try {
      Object.defineProperty(
        globalThis,
        'CSS',
        {
          configurable: true,
          writable: true,
          value: undefined,
        },
      );

      const page = await makePage(`
        <plumage-datepicker-component
          input-id="css-escape-fallback"
          value="2026-07-20"
        ></plumage-datepicker-component>
      `);

      const host =
        page.root as HTMLElement;

      expect(
        find(
          host,
          '.calendar-grid-item span.active',
        ),
      ).toBeTruthy();
    } finally {
      Object.defineProperty(
        globalThis,
        'CSS',
        {
          configurable: true,
          writable: true,
          value: originalCss,
        },
      );
    }
  });

  it('synchronizes an externally updated YYYY-MM-DD value', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="controlled-datepicker"
        date-format="YYYY-MM-DD"
        value="2026-07-20"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input).toBeTruthy();

    expect(input!.value).toBe(
      '2026-07-20',
    );

    expect(
      instance.selectedDate,
    ).toBeTruthy();

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

    expect(input!.value).toBe(
      '2026-08-15',
    );

    expect(instance.value).toBe(
      '2026-08-15',
    );

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(7);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(15);

    expect(
      instance.selectedMonth,
    ).toBe(8);

    expect(
      instance.selectedYear,
    ).toBe(2026);

    expect(
      instance.currentMonth,
    ).toBe(7);

    expect(
      instance.currentYear,
    ).toBe(2026);
  });

  it('clears input and selected calendar state when value is externally cleared', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="controlled-datepicker-clear"
        date-format="YYYY-MM-DD"
        value="2026-07-20"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input!.value).toBe(
      '2026-07-20',
    );

    instance.value = '';

    await page.waitForChanges();

    expect(instance.value).toBe('');
    expect(input!.value).toBe('');

    expect(
      instance.selectedDate,
    ).toBeNull();

    expect(
      instance.selectedMonth,
    ).toBeNull();

    expect(
      instance.selectedYear,
    ).toBeNull();

    expect(
      find(
        host,
        '.calendar-grid-item span.active',
      ),
    ).toBeNull();
  });

  it('externally clearing a required value does not immediately create an invalid state', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="controlled-required-clear"
        value="2026-07-20"
        required
        validation
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expectNoInvalidState(
      host,
      input!,
    );

    instance.value = '';

    await page.waitForChanges();

    expect(input!.value).toBe('');

    expect(
      instance.selectedDate,
    ).toBeNull();

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

  it('parses an externally controlled MM-DD-YYYY value without shifting the date', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="controlled-datepicker-us-format"
        date-format="MM-DD-YYYY"
        value="07-20-2026"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    expect(input!.value).toBe(
      '07-20-2026',
    );

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

    expect(input!.value).toBe(
      '08-15-2026',
    );

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(7);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(15);

    expect(
      instance.selectedMonth,
    ).toBe(8);

    expect(
      instance.selectedYear,
    ).toBe(2026);
  });

  it('preserves the last valid selection for an impossible MM-DD-YYYY controlled value', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="invalid-mdy"
        date-format="MM-DD-YYYY"
        value="02-28-2026"
        validation
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    instance.value = '02-30-2026';

    await page.waitForChanges();

    expect(instance.value).toBe(
      '02-30-2026',
    );

    expect(input!.value).toBe(
      '02-30-2026',
    );

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    expectNoInvalidState(
      host,
      input!,
    );
  });

  it('preserves the last valid selection for an impossible YYYY-MM-DD controlled value', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="invalid-ymd"
        date-format="YYYY-MM-DD"
        value="2026-02-28"
        validation
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

    instance.value = '2026-02-30';

    await page.waitForChanges();

    expect(instance.value).toBe(
      '2026-02-30',
    );

    expect(input!.value).toBe(
      '2026-02-30',
    );

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);

    expectNoInvalidState(
      host,
      input!,
    );
  });

  it('rejects 2026-02-29 because 2026 is not a leap year', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="non-leap-year"
        date-format="YYYY-MM-DD"
        value="2026-02-28"
      ></plumage-datepicker-component>
    `);

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      page.root as HTMLElement,
      'input.form-control',
    );

    instance.value = '2026-02-29';

    await page.waitForChanges();

    expect(input!.value).toBe(
      '2026-02-29',
    );

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2026);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(28);
  });

  it('accepts 2028-02-29 because 2028 is a leap year', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="leap-year"
        date-format="YYYY-MM-DD"
        value="2028-02-28"
      ></plumage-datepicker-component>
    `);

    const instance =
      page.rootInstance as ControlledDatepickerInstance;

    const input = find<HTMLInputElement>(
      page.root as HTMLElement,
      'input.form-control',
    );

    instance.value = '2028-02-29';

    await page.waitForChanges();

    expect(input!.value).toBe(
      '2028-02-29',
    );

    expect(
      instance.selectedDate!.getFullYear(),
    ).toBe(2028);

    expect(
      instance.selectedDate!.getMonth(),
    ).toBe(1);

    expect(
      instance.selectedDate!.getDate(),
    ).toBe(29);
  });

  it('emits structured date-selected detail after selecting a calendar date', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        input-id="datepicker-event"
        date-format="YYYY-MM-DD"
        value="2026-07-20"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const input = find<HTMLInputElement>(
      host,
      'input.form-control',
    );

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
      dateCell!.querySelector<HTMLElement>(
        'span',
      );

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

    const event =
      selectedHandler.mock
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

    expect(input!.value).toBe(
      '2026-07-21',
    );

    expect(
      (
        page.rootInstance as PlumageDatepicker
      ).value,
    ).toBe('2026-07-21');
  });

  it('adds visual focus when a calendar cell is hovered', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        value="2026-07-20"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const cell = find<HTMLElement>(
      host,
      '.calendar-grid-item[data-date="2026-07-21"]',
    );

    expect(cell).toBeTruthy();

    const span =
      cell!.querySelector<HTMLElement>(
        'span',
      );

    expect(span).toBeTruthy();

    expect(
      span!.classList.contains('focus'),
    ).toBe(false);

    cell!.dispatchEvent(
      new page.win.MouseEvent(
        'mouseenter',
      ),
    );

    expect(
      span!.classList.contains('focus'),
    ).toBe(true);
  });

  it('removes hover focus from a non-selected calendar cell on mouseleave', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        value="2026-07-20"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const cell = find<HTMLElement>(
      host,
      '.calendar-grid-item[data-date="2026-07-21"]',
    );

    const span =
      cell!.querySelector<HTMLElement>(
        'span',
      );

    cell!.dispatchEvent(
      new page.win.MouseEvent(
        'mouseenter',
      ),
    );

    expect(
      span!.classList.contains('focus'),
    ).toBe(true);

    cell!.dispatchEvent(
      new page.win.MouseEvent(
        'mouseleave',
      ),
    );

    expect(
      span!.classList.contains('focus'),
    ).toBe(false);
  });

  it('preserves visual focus styling on the selected date', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        value="2026-07-20"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const selectedCell =
      find<HTMLElement>(
        host,
        '.calendar-grid-item[data-date="2026-07-20"]',
      );

    const selectedSpan =
      selectedCell!.querySelector<HTMLElement>(
        'span',
      );

    expect(
      selectedSpan!.classList.contains(
        'active',
      ),
    ).toBe(true);

    expect(
      selectedSpan!.classList.contains(
        'focus',
      ),
    ).toBe(true);

    selectedCell!.dispatchEvent(
      new page.win.MouseEvent(
        'mouseleave',
      ),
    );

    expect(
      selectedSpan!.classList.contains(
        'active',
      ),
    ).toBe(true);

    expect(
      selectedSpan!.classList.contains(
        'focus',
      ),
    ).toBe(true);
  });

  it('adds visual focus when a calendar cell receives keyboard-style focus', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        value="2026-07-20"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const cell = find<HTMLElement>(
      host,
      '.calendar-grid-item[data-date="2026-07-21"]',
    );

    const span =
      cell!.querySelector<HTMLElement>(
        'span',
      );

    expect(
      span!.classList.contains('focus'),
    ).toBe(false);

    cell!.dispatchEvent(
      new page.win.FocusEvent(
        'focus',
      ),
    );

    expect(
      span!.classList.contains('focus'),
    ).toBe(true);

    const calendar = find<HTMLElement>(
      host,
      '.calendar',
    );

    expect(
      calendar!.classList.contains(
        'focus',
      ),
    ).toBe(true);
  });

  it('removes keyboard-style focus from a non-selected cell on blur', async () => {
    const page = await makePage(`
      <plumage-datepicker-component
        value="2026-07-20"
      ></plumage-datepicker-component>
    `);

    const host = page.root as HTMLElement;

    const cell = find<HTMLElement>(
      host,
      '.calendar-grid-item[data-date="2026-07-21"]',
    );

    const span =
      cell!.querySelector<HTMLElement>(
        'span',
      );

    cell!.dispatchEvent(
      new page.win.FocusEvent(
        'focus',
      ),
    );

    expect(
      span!.classList.contains('focus'),
    ).toBe(true);

    cell!.dispatchEvent(
      new page.win.FocusEvent(
        'blur',
      ),
    );

    expect(
      span!.classList.contains('focus'),
    ).toBe(false);
  });
});
