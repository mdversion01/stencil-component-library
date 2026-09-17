// File: src/components/date-range-time-picker/date-range-time-picker-component.spec.tsx

import {
  newSpecPage,
  SpecPage,
} from '@stencil/core/testing';

import { DateRangeTimePickerComponent } from './date-range-time-picker-component';

jest.mock('@popperjs/core', () => ({
  createPopper: jest.fn(() => ({
    destroy: jest.fn(),
  })),
}));

jest.setTimeout(60000);

type ControlledDateRangeTimePickerInstance =
  DateRangeTimePickerComponent & {
    value: string;
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
    startAmPm: 'AM' | 'PM';
    endAmPm: 'AM' | 'PM';
    durationText: string;
    currentStartMonth: number;
    currentStartYear: number;
    currentEndMonth: number;
    currentEndYear: number;
    validation: boolean;
    validationMessage: string;
    warningMessage: string;
  };

type DateTimeUpdatedDetail = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  startDateIso?: string;
  endDateIso?: string;
  startDateTimeIso?: string;
  endDateTimeIso?: string;
};

let originalRequestAnimationFrame:
  | typeof global.requestAnimationFrame
  | undefined;

let originalCancelAnimationFrame:
  | typeof global.cancelAnimationFrame
  | undefined;

let originalFocus:
  typeof HTMLElement.prototype.focus;

let activeElement: Element | null = null;

const documentPrototype =
  Object.getPrototypeOf(document) ||
  Document.prototype;

const activeElementDescriptor =
  Object.getOwnPropertyDescriptor(
    documentPrototype,
    'activeElement',
  ) ??
  Object.getOwnPropertyDescriptor(
    document,
    'activeElement',
  );

beforeAll(() => {
  originalRequestAnimationFrame =
    global.requestAnimationFrame;

  originalCancelAnimationFrame =
    global.cancelAnimationFrame;

  originalFocus =
    HTMLElement.prototype.focus;

  (
    global as typeof global & {
      requestAnimationFrame:
        typeof requestAnimationFrame;
    }
  ).requestAnimationFrame = (
    callback: FrameRequestCallback,
  ): number => {
    callback(0);

    return 0;
  };

  (
    global as typeof global & {
      cancelAnimationFrame:
        typeof cancelAnimationFrame;
    }
  ).cancelAnimationFrame =
    jest.fn();

  HTMLElement.prototype.focus =
    function patchedFocus(): void {
      activeElement = this;
    };

  Object.defineProperty(
    documentPrototype,
    'activeElement',
    {
      configurable: true,
      enumerable: true,
      get() {
        return activeElement;
      },
    },
  );
});

afterAll(() => {
  (
    global as typeof global & {
      requestAnimationFrame?:
        typeof requestAnimationFrame;
    }
  ).requestAnimationFrame =
    originalRequestAnimationFrame;

  (
    global as typeof global & {
      cancelAnimationFrame?:
        typeof cancelAnimationFrame;
    }
  ).cancelAnimationFrame =
    originalCancelAnimationFrame;

  HTMLElement.prototype.focus =
    originalFocus;

  if (activeElementDescriptor) {
    Object.defineProperty(
      documentPrototype,
      'activeElement',
      activeElementDescriptor,
    );
  } else {
    delete documentPrototype.activeElement;
  }

  activeElement = null;
});

beforeEach(() => {
  activeElement = null;

  jest.clearAllMocks();
});

async function createPage(
  html =
    '<date-range-time-picker-component></date-range-time-picker-component>',
): Promise<SpecPage> {
  const page = await newSpecPage({
    components: [
      DateRangeTimePickerComponent,
    ],
    html,
  });

  await page.waitForChanges();

  return page;
}

async function flush(
  page: SpecPage,
): Promise<void> {
  await page.waitForChanges();
}

function rootOf(
  page: SpecPage,
): HTMLElement {
  if (!page.root) {
    throw new Error(
      'Expected component root.',
    );
  }

  return page.root as HTMLElement;
}

function queryRequired<
  T extends Element,
>(
  root: ParentNode,
  selector: string,
): T {
  const element =
    root.querySelector(selector);

  if (!element) {
    throw new Error(
      `Expected element matching: ${selector}`,
    );
  }

  return element as T;
}

function normalizeSnapshotIds(
  root: HTMLElement,
): void {
  const elements: Element[] = [
    root,
    ...Array.from(
      root.querySelectorAll('*'),
    ),
  ];

  const replacements =
    new Map<string, string>();

  let nextId = 1;

  elements.forEach(element => {
    const id =
      element.getAttribute('id');

    if (!id) {
      return;
    }

    if (
      root.hasAttribute('input-id') &&
      id === root.getAttribute('input-id')
    ) {
      return;
    }

    replacements.set(
      id,
      `snapshot-id-${nextId}`,
    );

    nextId += 1;
  });

  if (
    replacements.size === 0
  ) {
    return;
  }

  elements.forEach(element => {
    Array.from(
      element.attributes,
    ).forEach(attribute => {
      let normalizedValue =
        attribute.value;

      replacements.forEach(
        (
          stableId,
          generatedId,
        ) => {
          normalizedValue =
            normalizedValue
              .split(generatedId)
              .join(stableId);
        },
      );

      if (
        normalizedValue !==
        attribute.value
      ) {
        element.setAttribute(
          attribute.name,
          normalizedValue,
        );
      }
    });
  });
}

function expectStableSnapshot(
  root: HTMLElement,
  hint: string,
): void {
  const snapshotRoot =
    root.cloneNode(
      true,
    ) as HTMLElement;

  normalizeSnapshotIds(
    snapshotRoot,
  );

  expect(
    snapshotRoot,
  ).toMatchSnapshot(
    hint,
  );
}

function getInstance(
  page: SpecPage,
): ControlledDateRangeTimePickerInstance {
  return page.rootInstance as
    ControlledDateRangeTimePickerInstance;
}

function getMainInput(
  root: HTMLElement,
): HTMLInputElement | null {
  return root.querySelector(
    'input.form-control:not(.time-input)',
  ) as HTMLInputElement | null;
}

function getToggleButtons(
  root: HTMLElement,
): HTMLButtonElement[] {
  return Array.from(
    root.querySelectorAll(
      '.calendar-button',
    ),
  ) as HTMLButtonElement[];
}

function getDropdown(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.dropdown',
  ) as HTMLElement | null;
}

function getOpenDropdown(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.dropdown.open',
  ) as HTMLElement | null;
}

function getOkButton(
  root: HTMLElement,
): HTMLButtonElement | null {
  return root.querySelector(
    '.ok-button button',
  ) as HTMLButtonElement | null;
}

function getStartDateLabel(
  root: HTMLElement,
): HTMLElement {
  return queryRequired<HTMLElement>(
    root,
    '.start-date',
  );
}

function getEndDateLabel(
  root: HTMLElement,
): HTMLElement {
  return queryRequired<HTMLElement>(
    root,
    '.end-date',
  );
}

function getTimeInputs(
  root: HTMLElement,
): {
  start: HTMLInputElement;
  end: HTMLInputElement;
} {
  const inputs = Array.from(
    root.querySelectorAll(
      'input.time-input',
    ),
  ) as HTMLInputElement[];

  if (!inputs[0] || !inputs[1]) {
    throw new Error(
      'Expected start and end time inputs.',
    );
  }

  return {
    start: inputs[0],
    end: inputs[1],
  };
}

function inMonthCells(
  root: HTMLElement,
): HTMLElement[] {
  return Array.from(
    root.querySelectorAll(
      '.calendar-grid-item:not(.previous-month-day):not(.next-month-day)',
    ),
  ) as HTMLElement[];
}

function focusedCell(
  root: HTMLElement,
): HTMLElement | null {
  const span =
    root.querySelector(
      '.calendar-grid-item span.focus',
    ) as HTMLElement | null;

  return span
    ? (span.parentElement as HTMLElement)
    : null;
}

function keyDownOn(
  element: Element,
  key: string,
): void {
  element.dispatchEvent(
    new KeyboardEvent(
      'keydown',
      {
        key,
        bubbles: true,
        composed: true,
      },
    ),
  );
}

function dispatchInput(
  input: HTMLInputElement,
  value: string,
): void {
  input.value = value;

  input.dispatchEvent(
    new Event(
      'input',
      {
        bubbles: true,
        composed: true,
      },
    ),
  );
}

function dispatchChange(
  element:
    | HTMLInputElement
    | HTMLSelectElement,
  value: string,
): void {
  element.value = value;

  element.dispatchEvent(
    new Event(
      'change',
      {
        bubbles: true,
        composed: true,
      },
    ),
  );
}

async function clickInMonthCell(
  page: SpecPage,
  index: number,
): Promise<void> {
  const cells =
    inMonthCells(rootOf(page));

  if (!cells[index]) {
    throw new Error(
      `Missing in-month cell at index ${index}.`,
    );
  }

  cells[index].click();

  await flush(page);
}

async function selectRange(
  page: SpecPage,
  startIndex = 1,
  endIndex = 7,
): Promise<void> {
  await clickInMonthCell(
    page,
    startIndex,
  );

  await clickInMonthCell(
    page,
    endIndex,
  );
}

function expectUtcDate(
  date: Date | null,
  year: number,
  monthIndex: number,
  day: number,
): void {
  expect(date).toBeTruthy();

  expect(
    date!.getUTCFullYear(),
  ).toBe(year);

  expect(
    date!.getUTCMonth(),
  ).toBe(monthIndex);

  expect(
    date!.getUTCDate(),
  ).toBe(day);
}

function parseIdReferences(
  value: string | null,
): string[] {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function escapeAttributeValue(
  value: string,
): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

function queryById(
  root: HTMLElement,
  id: string,
): HTMLElement | null {
  return root.querySelector(
    `[id="${escapeAttributeValue(id)}"]`,
  ) as HTMLElement | null;
}

function expectAriaReferencesResolve(
  root: HTMLElement,
  element: HTMLElement,
  attribute:
    | 'aria-labelledby'
    | 'aria-describedby'
    | 'aria-controls',
): void {
  const ids =
    parseIdReferences(
      element.getAttribute(attribute),
    );

  expect(
    ids.length,
  ).toBeGreaterThan(0);

  ids.forEach(id => {
    expect(
      queryById(root, id),
    ).toBeTruthy();
  });
}

describe(
  'date-range-time-picker-component rendering',
  () => {
    test(
      'renders input mode by default',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        expect(
          getMainInput(root),
        ).toBeTruthy();

        expect(
          getDropdown(root),
        ).toBeTruthy();

        expect(
          getToggleButtons(root).length,
        ).toBeGreaterThan(0);

        expect(
          getOkButton(root),
        ).toBeTruthy();

        expectStableSnapshot(
          root,
          'input-mode-default',
        );
      },
    );

    test(
      'renders rangeTimePicker mode without the main input group, dropdown, or OK button',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        expect(
          getMainInput(root),
        ).toBeNull();

        expect(
          root.querySelector(
            '.input-group',
          ),
        ).toBeNull();

        expect(
          getDropdown(root),
        ).toBeNull();

        expect(
          getOkButton(root),
        ).toBeNull();

        expect(
          root.querySelector(
            '.calendar-wrapper',
          ),
        ).toBeTruthy();

        expect(
          root.querySelectorAll(
            '.dp-calendar',
          ),
        ).toHaveLength(2);

        const {
          start,
          end,
        } = getTimeInputs(root);

        expect(
          start.value,
        ).toBe('00:00');

        expect(
          end.value,
        ).toBe('00:00');

        expectStableSnapshot(
          root,
          'standalone-range-time-picker',
        );
      },
    );

    test(
      'renders start and end time inputs in standalone mode',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const {
          start,
          end,
        } = getTimeInputs(
          rootOf(page),
        );

        expect(start).toBeTruthy();
        expect(end).toBeTruthy();

        expect(
          start.value,
        ).toBe('00:00');

        expect(
          end.value,
        ).toBe('00:00');
      },
    );

    test(
      'renders Plumage input variant',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              plumage="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        expect(
          root.querySelector(
            '.plumage',
          ),
        ).toBeTruthy();

        expect(
          root.querySelector(
            '.form-input-group',
          ),
        ).toBeTruthy();

        expect(
          root.querySelector(
            '.b-underline',
          ),
        ).toBeTruthy();

        expectStableSnapshot(
          root,
          'plumage-input-variant',
        );
      },
    );

    test(
      'renders classic input variant by default',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        expect(
          root.querySelector(
            '.form-input-group-basic',
          ),
        ).toBeTruthy();

        expect(
          root.querySelector(
            ':scope > .plumage',
          ),
        ).toBeNull();
      },
    );

    test(
      'derives 24-hour placeholder',
      async () => {
        const page =
          await createPage();

        expect(
          getMainInput(
            rootOf(page),
          )!.placeholder,
        ).toBe(
          'YYYY-MM-DD HH:MM - YYYY-MM-DD HH:MM',
        );
      },
    );

    test(
      'derives 12-hour placeholder',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              is-twenty-four-hour-format="false"
            ></date-range-time-picker-component>
          `);

        expect(
          getMainInput(
            rootOf(page),
          )!.placeholder,
        ).toBe(
          'YYYY-MM-DD HH:MM AM/PM - YYYY-MM-DD HH:MM AM/PM',
        );
      },
    );

    test(
      'uses custom placeholder',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              placeholder="Choose a maintenance window"
            ></date-range-time-picker-component>
          `);

        expect(
          getMainInput(
            rootOf(page),
          )!.placeholder,
        ).toBe(
          'Choose a maintenance window',
        );
      },
    );
  },
);

describe(
  'date-range-time-picker-component keyboard and calendar selection',
  () => {
    test(
      'moves focus one day with ArrowRight',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const wrapper =
          queryRequired<HTMLElement>(
            root,
            '.calendar-wrapper',
          );

        wrapper.focus();

        keyDownOn(
          wrapper,
          'ArrowRight',
        );

        await flush(page);

        const first =
          focusedCell(root);

        expect(first).toBeTruthy();

        const cells =
          inMonthCells(root);

        const firstIndex =
          cells.indexOf(first!);

        expect(
          firstIndex,
        ).toBeGreaterThanOrEqual(0);

        keyDownOn(
          wrapper,
          'ArrowRight',
        );

        await flush(page);

        const secondIndex =
          inMonthCells(root).indexOf(
            focusedCell(root)!,
          );

        expect(
          secondIndex,
        ).toBe(
          firstIndex + 1,
        );
      },
    );

    test(
      'moves focus one week with ArrowDown',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const wrapper =
          queryRequired<HTMLElement>(
            root,
            '.calendar-wrapper',
          );

        wrapper.focus();

        keyDownOn(
          wrapper,
          'ArrowRight',
        );

        await flush(page);

        const firstIndex =
          inMonthCells(root).indexOf(
            focusedCell(root)!,
          );

        keyDownOn(
          wrapper,
          'ArrowDown',
        );

        await flush(page);

        const cells =
          inMonthCells(root);

        const secondIndex =
          cells.indexOf(
            focusedCell(root)!,
          );

        expect(
          secondIndex,
        ).toBe(
          Math.min(
            firstIndex + 7,
            cells.length - 1,
          ),
        );
      },
    );

    test(
      'moves focus back with ArrowUp and ArrowLeft',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const wrapper =
          queryRequired<HTMLElement>(
            root,
            '.calendar-wrapper',
          );

        wrapper.focus();

        keyDownOn(
          wrapper,
          'ArrowRight',
        );

        await flush(page);

        keyDownOn(
          wrapper,
          'ArrowRight',
        );

        await flush(page);

        const beforeDownIndex =
          inMonthCells(root).indexOf(
            focusedCell(root)!,
          );

        keyDownOn(
          wrapper,
          'ArrowDown',
        );

        await flush(page);

        const downIndex =
          inMonthCells(root).indexOf(
            focusedCell(root)!,
          );

        expect(
          downIndex,
        ).toBeGreaterThanOrEqual(
          beforeDownIndex,
        );

        keyDownOn(
          wrapper,
          'ArrowUp',
        );

        await flush(page);

        const upIndex =
          inMonthCells(root).indexOf(
            focusedCell(root)!,
          );

        expect(
          upIndex,
        ).toBeLessThanOrEqual(
          downIndex,
        );

        keyDownOn(
          wrapper,
          'ArrowLeft',
        );

        await flush(page);

        const leftIndex =
          inMonthCells(root).indexOf(
            focusedCell(root)!,
          );

        expect(
          leftIndex,
        ).toBeLessThanOrEqual(
          upIndex,
        );
      },
    );

    test(
      'selects focused date with Enter',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const wrapper =
          queryRequired<HTMLElement>(
            root,
            '.calendar-wrapper',
          );

        wrapper.focus();

        keyDownOn(
          wrapper,
          'ArrowRight',
        );

        await flush(page);

        const cell =
          focusedCell(root);

        expect(cell).toBeTruthy();

        const expected =
          cell!.getAttribute(
            'data-date',
          );

        keyDownOn(
          wrapper,
          'Enter',
        );

        await flush(page);

        expect(
          getStartDateLabel(root)
            .textContent,
        ).toBe(expected);

        expect(
          getEndDateLabel(root)
            .textContent,
        ).toBe('N/A');
      },
    );

    test(
      'selects complete calendar range',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        await selectRange(
          page,
          1,
          8,
        );

        expect(
          getStartDateLabel(root)
            .textContent,
        ).not.toBe('N/A');

        expect(
          getEndDateLabel(root)
            .textContent,
        ).not.toBe('N/A');

        expect(
          root.querySelectorAll(
            '.calendar-grid-item.selected-range',
          ).length,
        ).toBeGreaterThan(0);

        expect(
          root.querySelectorAll(
            '.calendar-grid-item.selected-range-active',
          ),
        ).toHaveLength(2);

        expectStableSnapshot(
          root,
          'complete-calendar-range',
        );
      },
    );

    test(
      'reset clears range and visual focus',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        await selectRange(
          page,
          1,
          8,
        );

        queryRequired<HTMLButtonElement>(
          root,
          '.reset-btn',
        ).click();

        await flush(page);

        expect(
          getStartDateLabel(root)
            .textContent,
        ).toBe('N/A');

        expect(
          getEndDateLabel(root)
            .textContent,
        ).toBe('N/A');

        expect(
          root.querySelector(
            '.calendar-grid-item span.focus',
          ),
        ).toBeNull();
      },
    );
  },
);

describe(
  'date-range-time-picker-component dropdown draft behavior',
  () => {
    test(
      'opening and closing without changes preserves committed value',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const committed =
          getMainInput(root)!.value;

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        expect(
          getOpenDropdown(root),
        ).toBeTruthy();

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        expect(
          getOpenDropdown(root),
        ).toBeNull();

        expect(
          getMainInput(root)!.value,
        ).toBe(committed);
      },
    );

    test(
      'Close restores draft state instead of committing incomplete selection',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          getInstance(page);

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        const previousValue =
          instance.value;

        await clickInMonthCell(
          page,
          2,
        );

        expect(
          getOkButton(root)
            ?.textContent
            ?.trim(),
        ).toBe('Close');

        getOkButton(root)!.click();

        await flush(page);

        expect(
          instance.value,
        ).toBe(previousValue);

        expectUtcDate(
          instance.startDate,
          2026,
          6,
          20,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          7,
          20,
        );
      },
    );

    test(
      'clicking outside restores draft state',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          getInstance(page);

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        await clickInMonthCell(
          page,
          2,
        );

        document.body.dispatchEvent(
          new MouseEvent(
            'click',
            {
              bubbles: true,
              composed: true,
            },
          ),
        );

        await flush(page);

        expect(
          getOpenDropdown(root),
        ).toBeNull();

        expectUtcDate(
          instance.startDate,
          2026,
          6,
          20,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          7,
          20,
        );
      },
    );

    test(
      'OK commits complete draft state',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        await selectRange(
          page,
          2,
          9,
        );

        expect(
          getOkButton(root)
            ?.textContent
            ?.trim(),
        ).toBe('OK');

        getOkButton(root)!.click();

        await flush(page);

        expect(
          getOpenDropdown(root),
        ).toBeNull();

        expect(
          getMainInput(root)!
            .value
            .trim()
            .length,
        ).toBeGreaterThan(0);

        expect(
          getInstance(page)
            .startDate,
        ).toBeTruthy();

        expect(
          getInstance(page)
            .endDate,
        ).toBeTruthy();
      },
    );
  },
);

describe(
  'date-range-time-picker-component times',
  () => {
    test(
      'defaults to 00:00 in 24-hour mode',
      async () => {
        const page =
          await createPage();

        const instance =
          getInstance(page);

        expect(
          instance.startTime,
        ).toBe('00:00');

        expect(
          instance.endTime,
        ).toBe('00:00');
      },
    );

    test(
      'defaults to 12:00 in 12-hour mode',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              is-twenty-four-hour-format="false"
            ></date-range-time-picker-component>
          `);

        const instance =
          getInstance(page);

        expect(
          instance.startTime,
        ).toBe('12:00');

        expect(
          instance.endTime,
        ).toBe('12:00');
      },
    );

    test(
      'invalid time changes OK back to Close',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        await selectRange(
          page,
          1,
          7,
        );

        expect(
          getOkButton(root)
            ?.textContent
            ?.trim(),
        ).toBe('OK');

        const {
          start,
        } = getTimeInputs(root);

        dispatchInput(
          start,
          '99:99',
        );

        await flush(page);

        expect(
          getOkButton(root)
            ?.textContent
            ?.trim(),
        ).toBe('Close');
      },
    );

    test(
      'empty time shows warning while dropdown is open',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        await selectRange(
          page,
          1,
          7,
        );

        const {
          start,
        } = getTimeInputs(root);

        dispatchInput(
          start,
          '',
        );

        await flush(page);

        const warning =
          queryRequired<HTMLElement>(
            root,
            '.warning-message',
          );

        expect(
          warning.textContent,
        ).toContain(
          'Times cannot be empty.',
        );
      },
    );

    test(
      'invalid time shows warning while dropdown is open',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        await selectRange(
          page,
          1,
          7,
        );

        const {
          start,
        } = getTimeInputs(root);

        dispatchInput(
          start,
          '25:00',
        );

        await flush(page);

        const warning =
          queryRequired<HTMLElement>(
            root,
            '.warning-message',
          );

        expect(
          warning.textContent,
        ).toContain(
          'Invalid time.',
        );
      },
    );

    test(
      'hydrates 12-hour controlled values with AM/PM',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              is-twenty-four-hour-format="false"
              join-by=" - "
              value="2026-07-20 09:15 AM - 2026-07-20 05:45 PM"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          getInstance(page);

        expect(
          instance.startTime,
        ).toBe('09:15');

        expect(
          instance.endTime,
        ).toBe('05:45');

        expect(
          instance.startAmPm,
        ).toBe('AM');

        expect(
          instance.endAmPm,
        ).toBe('PM');

        const toggles =
          Array.from(
            root.querySelectorAll(
              '.am-pm-toggle',
            ),
          ) as HTMLButtonElement[];

        expect(
          toggles,
        ).toHaveLength(2);

        expect(
          toggles[0].textContent
            ?.trim(),
        ).toBe('AM');

        expect(
          toggles[1].textContent
            ?.trim(),
        ).toBe('PM');
      },
    );

    test(
      'computes duration for controlled range',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              show-duration="true"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-07-21 17:00"
            ></date-range-time-picker-component>
          `);

        expect(
          getInstance(page)
            .durationText,
        ).toBe('1d 8h');
      },
    );
  },
);

describe(
  'date-range-time-picker-component typed input',
  () => {
    test(
      'accepts valid YYYY-MM-DD 24-hour range',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const listener =
          jest.fn();

        root.addEventListener(
          'date-time-updated',
          listener,
        );

        dispatchInput(
          getMainInput(root)!,
          '2026-01-10 09:00 - 2026-01-20 17:30',
        );

        await flush(page);

        const instance =
          getInstance(page);

        expectUtcDate(
          instance.startDate,
          2026,
          0,
          10,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          0,
          20,
        );

        expect(
          instance.startTime,
        ).toBe('09:00');

        expect(
          instance.endTime,
        ).toBe('17:30');

        expect(
          instance.validation,
        ).toBe(false);

        expect(
          listener,
        ).toHaveBeenCalled();
      },
    );

    test(
      'accepts MM-DD-YYYY range',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              date-format="MM-DD-YYYY"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        dispatchInput(
          getMainInput(root)!,
          '01-10-2026 09:00 - 01-20-2026 17:30',
        );

        await flush(page);

        const instance =
          getInstance(page);

        expectUtcDate(
          instance.startDate,
          2026,
          0,
          10,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          0,
          20,
        );

        expect(
          instance.validation,
        ).toBe(false);
      },
    );

    test(
      'accepts valid 12-hour range',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              is-twenty-four-hour-format="false"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        dispatchInput(
          getMainInput(root)!,
          '2026-01-10 09:00 AM - 2026-01-10 05:30 PM',
        );

        await flush(page);

        const instance =
          getInstance(page);

        expect(
          instance.startTime,
        ).toBe('09:00');

        expect(
          instance.endTime,
        ).toBe('05:30');

        expect(
          instance.startAmPm,
        ).toBe('AM');

        expect(
          instance.endAmPm,
        ).toBe('PM');

        expect(
          instance.validation,
        ).toBe(false);
      },
    );

    test(
      'marks incomplete typed date/time input invalid',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const input =
          getMainInput(root);

        expect(input).toBeTruthy();

        dispatchInput(
          input!,
          '2026-01',
        );

        await flush(page);

        const instance =
          getInstance(page);

        expect(
          instance.validation,
        ).toBe(true);

        expect(
          instance.validationMessage,
        ).toBe(
          'Please enter a valid date/time range.',
        );

        expect(
          getMainInput(root)!.value,
        ).toBe('2026-01');

        expect(
          getMainInput(root)!
            .getAttribute(
              'aria-invalid',
            ),
        ).toBe('true');

        expect(
          root.querySelector(
            '.invalid-feedback.validation',
          ),
        ).toBeTruthy();

        expectStableSnapshot(
          root,
          'invalid-incomplete-input',
        );
      },
    );

    test(
      'rejects invalid range syntax',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        dispatchInput(
          getMainInput(root)!,
          '2026-01-10 09:00 - garbage',
        );

        await flush(page);

        expect(
          getInstance(page)
            .validation,
        ).toBe(true);

        expect(
          getInstance(page)
            .validationMessage,
        ).toBe(
          'Please enter a valid date/time range.',
        );
      },
    );

    test(
      'rejects impossible date',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        dispatchInput(
          getMainInput(root)!,
          '2026-02-30 09:00 - 2026-03-05 17:00',
        );

        await flush(page);

        expect(
          getInstance(page)
            .validation,
        ).toBe(true);

        expect(
          getInstance(page)
            .validationMessage,
        ).toBe(
          'Please enter a valid date/time range.',
        );
      },
    );

    test(
      'rejects non-leap-year February 29',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        dispatchInput(
          getMainInput(root)!,
          '2026-02-29 09:00 - 2026-03-05 17:00',
        );

        await flush(page);

        expect(
          getInstance(page)
            .validation,
        ).toBe(true);
      },
    );

    test(
      'accepts leap-year February 29',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        dispatchInput(
          getMainInput(root)!,
          '2028-02-29 09:00 - 2028-03-05 17:00',
        );

        await flush(page);

        expect(
          getInstance(page)
            .validation,
        ).toBe(false);

        expectUtcDate(
          getInstance(page)
            .startDate,
          2028,
          1,
          29,
        );
      },
    );

    test(
      'rejects start datetime after end datetime',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        dispatchInput(
          getMainInput(root)!,
          '2026-09-20 17:00 - 2026-09-20 09:00',
        );

        await flush(page);

        expect(
          getInstance(page)
            .validation,
        ).toBe(true);

        expect(
          getInstance(page)
            .validationMessage,
        ).toBe(
          'Start must be before end.',
        );
      },
    );

    test(
      'required empty input becomes invalid',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              required
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        dispatchInput(
          getMainInput(root)!,
          '',
        );

        await flush(page);

        expect(
          getInstance(page)
            .validation,
        ).toBe(true);

        expect(
          getInstance(page)
            .validationMessage,
        ).toBe(
          'This field is required.',
        );
      },
    );
  },
);

describe(
  'date-range-time-picker-component controlled values',
  () => {
    test(
      'hydrates initial value',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          getInstance(page);

        expectUtcDate(
          instance.startDate,
          2026,
          6,
          20,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          7,
          20,
        );

        expect(
          instance.startTime,
        ).toBe('09:00');

        expect(
          instance.endTime,
        ).toBe('17:00');

        expect(
          getMainInput(root)!
            .value,
        ).toContain(
          '2026-07-20',
        );

        expectStableSnapshot(
          root,
          'controlled-initial-value',
        );
      },
    );

    test(
      'updates when value changes externally',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const instance =
          getInstance(page);

        instance.value =
          '2026-09-10 13:15 - 2026-10-12 18:45';

        await flush(page);

        expectUtcDate(
          instance.startDate,
          2026,
          8,
          10,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          9,
          12,
        );

        expect(
          instance.startTime,
        ).toBe('13:15');

        expect(
          instance.endTime,
        ).toBe('18:45');
      },
    );

    test(
      'hydrates MM-DD-YYYY controlled value',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              date-format="MM-DD-YYYY"
              join-by=" - "
              value="07-20-2026 09:00 - 08-20-2026 17:00"
            ></date-range-time-picker-component>
          `);

        const instance =
          getInstance(page);

        expectUtcDate(
          instance.startDate,
          2026,
          6,
          20,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          7,
          20,
        );

        expect(
          instance.startTime,
        ).toBe('09:00');

        expect(
          instance.endTime,
        ).toBe('17:00');
      },
    );

    test(
      'external clear resets state without immediate required validation',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              required
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          getInstance(page);

        instance.value = '';

        await flush(page);

        expect(
          instance.startDate,
        ).toBeNull();

        expect(
          instance.endDate,
        ).toBeNull();

        expect(
          instance.startTime,
        ).toBe('00:00');

        expect(
          instance.endTime,
        ).toBe('00:00');

        expect(
          instance.validation,
        ).toBe(false);

        expect(
          instance.validationMessage,
        ).toBe('');

        expect(
          getMainInput(root)!.value,
        ).toBe('');
      },
    );

    test(
      'preserves last valid state for impossible external date',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const instance =
          getInstance(page);

        instance.value =
          '2026-02-30 09:00 - 2026-03-05 17:00';

        await flush(page);

        expectUtcDate(
          instance.startDate,
          2026,
          6,
          20,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          7,
          20,
        );

        expect(
          instance.startTime,
        ).toBe('09:00');

        expect(
          instance.endTime,
        ).toBe('17:00');
      },
    );

    test(
      'preserves last valid state for reversed external datetime',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const instance =
          getInstance(page);

        instance.value =
          '2026-09-20 17:00 - 2026-09-20 09:00';

        await flush(page);

        expectUtcDate(
          instance.startDate,
          2026,
          6,
          20,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          7,
          20,
        );

        expect(
          instance.startTime,
        ).toBe('09:00');

        expect(
          instance.endTime,
        ).toBe('17:00');
      },
    );

    test(
      'accepts leap-year external value',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2028-02-28 09:00 - 2028-03-05 17:00"
            ></date-range-time-picker-component>
          `);

        const instance =
          getInstance(page);

        instance.value =
          '2028-02-29 09:00 - 2028-03-05 17:00';

        await flush(page);

        expectUtcDate(
          instance.startDate,
          2028,
          1,
          29,
        );

        expectUtcDate(
          instance.endDate,
          2028,
          2,
          5,
        );
      },
    );

    test(
      'rejects non-leap-year external value',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-02-28 09:00 - 2026-03-05 17:00"
            ></date-range-time-picker-component>
          `);

        const instance =
          getInstance(page);

        instance.value =
          '2026-02-29 09:00 - 2026-03-05 17:00';

        await flush(page);

        expectUtcDate(
          instance.startDate,
          2026,
          1,
          28,
        );

        expectUtcDate(
          instance.endDate,
          2026,
          2,
          5,
        );
      },
    );

    test(
      'public clear resets component',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        await (
          root as HTMLElement & {
            clear:
              () => Promise<void>;
          }
        ).clear();

        await flush(page);

        const instance =
          getInstance(page);

        expect(
          instance.value,
        ).toBe('');

        expect(
          instance.startDate,
        ).toBeNull();

        expect(
          instance.endDate,
        ).toBeNull();

        expect(
          getMainInput(root)!
            .value,
        ).toBe('');
      },
    );
  },
);

describe(
  'date-range-time-picker-component events',
  () => {
    test(
      'emits structured payload for complete valid range',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const handler =
          jest.fn();

        root.addEventListener(
          'date-time-updated',
          handler,
        );

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        await selectRange(
          page,
          2,
          9,
        );

        expect(
          handler,
        ).toHaveBeenCalled();

        const event =
          handler.mock
            .calls[
              handler.mock.calls.length - 1
            ][0] as
            CustomEvent<DateTimeUpdatedDetail>;

        expect(
          event.detail.startDateIso,
        ).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );

        expect(
          event.detail.endDateIso,
        ).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );

        expect(
          event.detail.startDateTimeIso,
        ).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/,
        );

        expect(
          event.detail.endDateTimeIso,
        ).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/,
        );
      },
    );

    test(
      'does not emit when range is incomplete',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const handler =
          jest.fn();

        root.addEventListener(
          'date-time-updated',
          handler,
        );

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        await clickInMonthCell(
          page,
          2,
        );

        expect(
          handler,
        ).not.toHaveBeenCalled();
      },
    );

    test(
      'does not emit for invalid time',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const handler =
          jest.fn();

        root.addEventListener(
          'date-time-updated',
          handler,
        );

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        await selectRange(
          page,
          2,
          9,
        );

        handler.mockClear();

        const {
          start,
        } = getTimeInputs(root);

        dispatchInput(
          start,
          '99:99',
        );

        await flush(page);

        expect(
          handler,
        ).not.toHaveBeenCalled();
      },
    );

    test(
      'OK emits committed controlled range',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const handler =
          jest.fn();

        root.addEventListener(
          'date-time-updated',
          handler,
        );

        getToggleButtons(root)[0]
          .click();

        await flush(page);

        expect(
          getOkButton(root)
            ?.textContent
            ?.trim(),
        ).toBe('OK');

        handler.mockClear();

        getOkButton(root)!.click();

        await flush(page);

        expect(
          handler,
        ).toHaveBeenCalledTimes(1);

        const event =
          handler.mock
            .calls[0][0] as
            CustomEvent<DateTimeUpdatedDetail>;

        expect(
          event.detail,
        ).toEqual({
          startDate:
            '2026-07-20',
          endDate:
            '2026-08-20',
          startTime:
            '09:00',
          endTime:
            '17:00',
          duration: '',
          startDateIso:
            '2026-07-20',
          endDateIso:
            '2026-08-20',
          startDateTimeIso:
            expect.any(String),
          endDateTimeIso:
            expect.any(String),
        });
      },
    );
  },
);

describe(
  'date-range-time-picker-component layout and accessibility',
  () => {
    test(
      'disabled input remains visible and noninteractive',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              disabled="true"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const input =
          getMainInput(root);

        expect(input).toBeTruthy();

        expect(
          input!.hasAttribute(
            'disabled',
          ),
        ).toBe(true);

        expect(
          input!.getAttribute(
            'aria-disabled',
          ),
        ).toBe('true');

        expect(
          input!.value,
        ).toContain(
          '2026-07-20',
        );

        const buttons =
          getToggleButtons(root);

        expect(
          buttons.length,
        ).toBeGreaterThan(0);

        buttons.forEach(button => {
          expect(
            button.hasAttribute(
              'disabled',
            ),
          ).toBe(true);
        });

        expectStableSnapshot(
          root,
          'disabled',
        );
      },
    );

    test(
      'readOnly input remains visible and removes interactive controls',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              read-only="true"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const input =
          getMainInput(root);

        expect(input).toBeTruthy();

        expect(
          input!.readOnly,
        ).toBe(true);

        expect(
          input!.getAttribute(
            'aria-readonly',
          ),
        ).toBe('true');

        expect(
          getToggleButtons(root),
        ).toHaveLength(0);

        expect(
          root.querySelector(
            '.clear-input-button',
          ),
        ).toBeNull();

        expect(
          input!.value,
        ).toContain(
          '2026-07-20',
        );
      },
    );

    test(
      'horizontal layout uses responsive column classes',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              form-layout="horizontal"
              label-cols="sm-4 md-3"
              input-cols="sm-8 md-9"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const label =
          queryRequired<HTMLLabelElement>(
            root,
            '.form-control-label',
          );

        expect(
          label.className,
        ).toContain(
          'col-sm-4',
        );

        expect(
          label.className,
        ).toContain(
          'col-md-3',
        );

        const inputGroup =
          queryRequired<HTMLElement>(
            root,
            '.input-group',
          );

        const inputColumn =
          inputGroup.parentElement as
            HTMLElement;

        expect(
          inputColumn.className,
        ).toContain(
          'col-sm-8',
        );

        expect(
          inputColumn.className,
        ).toContain(
          'col-md-9',
        );

        expectStableSnapshot(
          root,
          'horizontal-responsive-layout',
        );
      },
    );

    test(
      'horizontal hidden label uses full-width input column',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              form-layout="horizontal"
              label-hidden="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const inputGroup =
          queryRequired<HTMLElement>(
            root,
            '.input-group',
          );

        const inputColumn =
          inputGroup.parentElement as
            HTMLElement;

        expect(
          inputColumn.className,
        ).toContain(
          'col-12',
        );
      },
    );

    test(
      'hidden label remains available as accessible name',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              label="Maintenance Window"
              label-hidden="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const label =
          queryRequired<HTMLLabelElement>(
            root,
            '.form-control-label',
          );

        expect(
          label.className,
        ).toMatch(
          /sr-only|visually-hidden/,
        );

        const input =
          getMainInput(root)!;

        expectAriaReferencesResolve(
          root,
          input,
          'aria-labelledby',
        );
      },
    );

    test(
      'main input ARIA references resolve',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              input-id="aria-range-time"
              label="Maintenance Window"
              required
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const input =
          getMainInput(root)!;

        expectAriaReferencesResolve(
          root,
          input,
          'aria-labelledby',
        );

        expectAriaReferencesResolve(
          root,
          input,
          'aria-describedby',
        );

        getToggleButtons(root)
          .forEach(button => {
            expectAriaReferencesResolve(
              root,
              button,
              'aria-controls',
            );
          });

        expectStableSnapshot(
          root,
          'main-input-aria',
        );
      },
    );

    test(
      'dialog ARIA references resolve',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const dialog =
          queryRequired<HTMLElement>(
            root,
            '.dropdown-content',
          );

        expect(
          dialog.getAttribute(
            'role',
          ),
        ).toBe('dialog');

        expectAriaReferencesResolve(
          root,
          dialog,
          'aria-labelledby',
        );

        expectAriaReferencesResolve(
          root,
          dialog,
          'aria-describedby',
        );
      },
    );

    test(
      'multiple instances do not share generated internal IDs',
      async () => {
        const page =
          await createPage(`
            <div>
              <date-range-time-picker-component
                input-id="range-time-a"
              ></date-range-time-picker-component>

              <date-range-time-picker-component
                input-id="range-time-b"
              ></date-range-time-picker-component>
            </div>
          `);

        const components =
          Array.from(
            page.body.querySelectorAll(
              'date-range-time-picker-component',
            ),
          ) as HTMLElement[];

        expect(
          components,
        ).toHaveLength(2);

        const firstIds =
          new Set(
            Array.from(
              components[0]
                .querySelectorAll(
                  '[id]',
                ),
            ).map(
              element =>
                element.id,
            ),
          );

        const secondIds =
          new Set(
            Array.from(
              components[1]
                .querySelectorAll(
                  '[id]',
                ),
            ).map(
              element =>
                element.id,
            ),
          );

        const duplicates =
          Array.from(
            firstIds,
          ).filter(
            id =>
              secondIds.has(id),
          );

        expect(
          duplicates,
        ).toEqual([]);
      },
    );

    test(
      'month and year selectors update consecutive calendars',
      async () => {
        const page =
          await createPage(`
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `);

        const root =
          rootOf(page);

        const month =
          queryRequired<HTMLSelectElement>(
            root,
            'select.months',
          );

        const year =
          queryRequired<HTMLSelectElement>(
            root,
            'select.years',
          );

        dispatchChange(
          month,
          '11',
        );

        dispatchChange(
          year,
          '2028',
        );

        await flush(page);

        const captions =
          Array.from(
            root.querySelectorAll(
              '.calendar-grid-caption',
            ),
          ).map(
            element =>
              element.textContent
                ?.trim(),
          );

        expect(
          captions,
        ).toEqual([
          'December 2028',
          'January 2029',
        ]);
      },
    );
  },
);
