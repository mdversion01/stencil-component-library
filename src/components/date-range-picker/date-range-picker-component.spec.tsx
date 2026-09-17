// File: src/components/date-range-picker-component/date-range-picker-component.spec.tsx

import {
  newSpecPage,
  SpecPage,
} from '@stencil/core/testing';

import { DateRangePickerComponent } from './date-range-picker-component';

jest.mock('@popperjs/core', () => ({
  createPopper: jest.fn(() => ({
    destroy: jest.fn(),
  })),
}));

jest.setTimeout(60000);

type DateRangeUpdatedDetail = {
  startDate: string;
  endDate: string;
  startDateIso: string;
  endDateIso: string;
};

type ControlledInstance = DateRangePickerComponent & {
  startDate: Date | null;
  endDate: Date | null;
  selectedStartDate: string;
  selectedEndDate: string;
  currentStartMonth: number;
  currentStartYear: number;
  currentEndMonth: number;
  currentEndYear: number;
  validation: boolean;
  validationMessage: string;
};

let originalRequestAnimationFrame:
  | typeof global.requestAnimationFrame
  | undefined;

let originalCancelAnimationFrame:
  | typeof global.cancelAnimationFrame
  | undefined;

let originalFocus:
  typeof HTMLElement.prototype.focus;

let originalMathRandom:
  typeof Math.random;

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

  originalMathRandom =
    Math.random;

  Math.random = jest.fn(
    () => 0.123456789,
  );

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

  Math.random =
    originalMathRandom;

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
    '<date-range-picker-component></date-range-picker-component>',
): Promise<SpecPage> {
  const page = await newSpecPage({
    components: [
      DateRangePickerComponent,
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

function normalizeGeneratedDateRangePickerIds(
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

  elements.forEach(element => {
    const id =
      element.getAttribute('id');

    if (!id) {
      return;
    }

    if (
      /^date-range-picker-[A-Za-z0-9_-]+$/i.test(id)
    ) {
      replacements.set(
        id,
        'date-range-picker-test',
      );

      return;
    }

    if (
      /^drp-[A-Za-z0-9_-]+$/i.test(id)
    ) {
      replacements.set(
        id,
        'drp-test',
      );
    }
  });

  const input =
    root.querySelector<HTMLInputElement>(
      'input.form-control',
    );

  if (
    input &&
    !root.hasAttribute('input-id')
  ) {
    const inputId =
      input.getAttribute('id');

    if (inputId) {
      replacements.set(
        inputId,
        'date-range-input-test',
      );
    }
  }

  if (
    replacements.size === 0
  ) {
    return;
  }

  elements.forEach(element => {
    Array.from(
      element.attributes,
    ).forEach(attribute => {
      let value =
        attribute.value;

      replacements.forEach(
        (
          stableId,
          generatedId,
        ) => {
          value =
            value
              .split(generatedId)
              .join(stableId);
        },
      );

      if (
        value !==
        attribute.value
      ) {
        element.setAttribute(
          attribute.name,
          value,
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

  normalizeGeneratedDateRangePickerIds(
    snapshotRoot,
  );

  expect(
    snapshotRoot,
  ).toMatchSnapshot(
    hint,
  );
}

function dispatchInput(
  input: HTMLInputElement,
  value: string,
): void {
  input.value = value;

  input.dispatchEvent(
    new Event('input', {
      bubbles: true,
      composed: true,
    }),
  );
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

function getInput(
  root: HTMLElement,
): HTMLInputElement {
  return queryRequired<HTMLInputElement>(
    root,
    'input.form-control',
  );
}

function getDropdown(
  root: HTMLElement,
): HTMLElement {
  return queryRequired<HTMLElement>(
    root,
    '.dropdown',
  );
}

function getStartLabel(
  root: HTMLElement,
): string {
  return (
    queryRequired<HTMLElement>(
      root,
      '.start-date',
    ).textContent?.trim() ?? ''
  );
}

function getEndLabel(
  root: HTMLElement,
): string {
  return (
    queryRequired<HTMLElement>(
      root,
      '.end-date',
    ).textContent?.trim() ?? ''
  );
}

function getOkButton(
  root: HTMLElement,
): HTMLButtonElement {
  return queryRequired<HTMLButtonElement>(
    root,
    '.ok-button button',
  );
}

function getOkButtonLabel(
  root: HTMLElement,
): string {
  return (
    getOkButton(root)
      .textContent
      ?.trim() ?? ''
  );
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

async function clickInMonthCell(
  page: SpecPage,
  index: number,
): Promise<void> {
  const cells =
    inMonthCells(rootOf(page));

  if (!cells[index]) {
    throw new Error(
      `Missing in-month cell at ${index}.`,
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

function parseIdRefs(
  value: string | null,
): string[] {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

describe(
  'date-range-picker-component rendering',
  () => {
    test(
      'renders two accessible calendar grids',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const calendars =
          Array.from(
            root.querySelectorAll(
              '.dp-calendar',
            ),
          ) as HTMLElement[];

        expect(calendars).toHaveLength(
          2,
        );

        calendars.forEach(
          calendar => {
            const caption =
              queryRequired<HTMLElement>(
                calendar,
                '.calendar-grid-caption',
              );

            const weekdays =
              queryRequired<HTMLElement>(
                calendar,
                '.calendar-grid-weekdays',
              );

            const grid =
              queryRequired<HTMLElement>(
                calendar,
                '.calendar-grid',
              );

            expect(
              caption.id,
            ).toBeTruthy();

            expect(
              grid.getAttribute('role'),
            ).toBe('grid');

            expect(
              grid.getAttribute(
                'aria-labelledby',
              ),
            ).toBe(caption.id);

            expect(
              weekdays.getAttribute(
                'role',
              ),
            ).toBe('row');

            expect(
              weekdays.querySelectorAll(
                '[role="columnheader"]',
              ),
            ).toHaveLength(7);
          },
        );

        expectStableSnapshot(
          root,
          'range-picker-default',
        );
      },
    );

    test(
      'renders six weeks and 42 cells per calendar',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
          `);

        const grids =
          Array.from(
            rootOf(page)
              .querySelectorAll(
                '.calendar-grid',
              ),
          ) as HTMLElement[];

        expect(grids).toHaveLength(2);

        grids.forEach(grid => {
          expect(
            grid.querySelectorAll(
              '[role="row"]',
            ),
          ).toHaveLength(6);

          expect(
            grid.querySelectorAll(
              '[role="gridcell"]',
            ),
          ).toHaveLength(42);
        });
      },
    );

    test(
      'generates unique selector-safe ARIA IDs',
      async () => {
        const page =
          await createPage(`
            <div>
              <date-range-picker-component
                input-id="date picker ! one"
              ></date-range-picker-component>

              <date-range-picker-component
                input-id="date picker ! one"
              ></date-range-picker-component>
            </div>
          `);

        const components =
          Array.from(
            page.body.querySelectorAll(
              'date-range-picker-component',
            ),
          ) as HTMLElement[];

        expect(
          components,
        ).toHaveLength(2);

        const ids =
          components.map(component => {
            const dialog =
              queryRequired<HTMLElement>(
                component,
                '.dropdown-content',
              );

            return dialog.getAttribute(
              'aria-labelledby',
            );
          });

        expect(ids[0]).toBeTruthy();
        expect(ids[1]).toBeTruthy();

        expect(ids[0]).not.toBe(
          ids[1],
        );

        ids.forEach(id => {
          expect(id).toMatch(
            /^[A-Za-z_][\w:.-]*$/,
          );
        });
      },
    );

    test(
      'does not depend on CSS.escape',
      async () => {
        const globalObject =
          globalThis as {
            CSS?: typeof CSS;
          };

        const originalCss =
          globalObject.CSS;

        try {
          Object.defineProperty(
            globalObject,
            'CSS',
            {
              configurable: true,
              writable: true,
              value: undefined,
            },
          );

          const page =
            await createPage(`
              <date-range-picker-component
                input-id="unsafe id !"
              ></date-range-picker-component>
            `);

          const root =
            rootOf(page);

          const dialog =
            queryRequired<HTMLElement>(
              root,
              '.dropdown-content',
            );

          const labelledBy =
            dialog.getAttribute(
              'aria-labelledby',
            );

          expect(
            labelledBy,
          ).toBeTruthy();

          expect(
            root.querySelector(
              `#${labelledBy}`,
            ),
          ).toBeTruthy();
        } finally {
          Object.defineProperty(
            globalObject,
            'CSS',
            {
              configurable: true,
              writable: true,
              value: originalCss,
            },
          );
        }
      },
    );
  },
);

describe(
  'date-range-picker-component rangePicker mode',
  () => {
    test(
      'renders picker directly without input, dropdown, or OK button',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        expect(
          root.querySelector(
            '.date-picker',
          ),
        ).toBeTruthy();

        expect(
          root.querySelector(
            'input.form-control',
          ),
        ).toBeNull();

        expect(
          root.querySelector(
            '.dropdown',
          ),
        ).toBeNull();

        expect(
          root.querySelector(
            '.ok-button',
          ),
        ).toBeNull();
      },
    );

    test(
      'moves visual focus with arrow keys',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
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

        const firstCells =
          inMonthCells(root);

        const firstIndex =
          firstCells.indexOf(
            first!,
          );

        expect(
          firstIndex,
        ).toBeGreaterThanOrEqual(0);

        keyDownOn(
          wrapper,
          'ArrowRight',
        );

        await flush(page);

        const secondCells =
          inMonthCells(root);

        expect(
          secondCells.indexOf(
            focusedCell(root)!,
          ),
        ).toBe(
          firstIndex + 1,
        );
      },
    );

    test(
      'selects focused date with Enter',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
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
          getStartLabel(root),
        ).toBe(expected);

        expect(
          getEndLabel(root),
        ).toBe('N/A');
      },
    );

    test(
      'selects and marks a complete range',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        await selectRange(
          page,
          0,
          10,
        );

        expect(
          getStartLabel(root),
        ).not.toBe('N/A');

        expect(
          getEndLabel(root),
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
          'range-picker-complete-range',
        );
      },
    );

    test(
      'starts a new range after completing one',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        await selectRange(
          page,
          1,
          7,
        );

        const cells =
          inMonthCells(root);

        const expected =
          cells[12].getAttribute(
            'data-date',
          );

        await clickInMonthCell(
          page,
          12,
        );

        expect(
          getStartLabel(root),
        ).toBe(expected);

        expect(
          getEndLabel(root),
        ).toBe('N/A');
      },
    );

    test(
      'moves start date when second click is earlier',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const cells =
          inMonthCells(root);

        const expected =
          cells[2].getAttribute(
            'data-date',
          );

        await clickInMonthCell(
          page,
          8,
        );

        await clickInMonthCell(
          page,
          2,
        );

        expect(
          getStartLabel(root),
        ).toBe(expected);

        expect(
          getEndLabel(root),
        ).toBe('N/A');
      },
    );

    test(
      'reset clears selected range and focus',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        await selectRange(
          page,
          0,
          10,
        );

        queryRequired<HTMLButtonElement>(
          root,
          '.reset-btn',
        ).click();

        await flush(page);

        expect(
          getStartLabel(root),
        ).toBe('N/A');

        expect(
          getEndLabel(root),
        ).toBe('N/A');

        expect(
          root.querySelector(
            '.calendar-grid-item span.focus',
          ),
        ).toBeNull();

        expect(
          root.querySelector(
            '.calendar-grid-item.selected-range',
          ),
        ).toBeNull();
      },
    );

    test(
      'formats labels as long dates',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
              show-long="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        await selectRange(
          page,
          3,
          6,
        );

        expect(
          getStartLabel(root),
        ).toMatch(
          /^\w+,\s\w+\s\d{1,2},\s\d{4}$/,
        );

        expect(
          getEndLabel(root),
        ).toMatch(
          /^\w+,\s\w+\s\d{1,2},\s\d{4}$/,
        );

        expect(
          queryRequired<HTMLElement>(
            root,
            '.start-end-ranges',
          ).classList.contains(
            'long',
          ),
        ).toBe(true);
      },
    );

    test(
      'formats labels as ISO timestamps',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
              show-iso="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        await selectRange(
          page,
          4,
          9,
        );

        expect(
          getStartLabel(root),
        ).toMatch(
          /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/,
        );

        expect(
          getEndLabel(root),
        ).toMatch(
          /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/,
        );
      },
    );

    test(
      'updates consecutive months from selectors',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              range-picker="true"
            ></date-range-picker-component>
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

        month.value = '11';

        month.dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );

        year.value = '2028';

        year.dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );

        await flush(page);

        const captions =
          Array.from(
            root.querySelectorAll(
              '.calendar-grid-caption',
            ),
          ).map(
            element =>
              element.textContent?.trim(),
          );

        expect(captions).toEqual([
          'December 2028',
          'January 2029',
        ]);
      },
    );
  },
);

describe(
  'date-range-picker-component input mode',
  () => {
    test(
      'renders input, toggle, dropdown, and Close button',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        expect(
          getInput(root),
        ).toBeTruthy();

        expect(
          root.querySelector(
            '.calendar-button',
          ),
        ).toBeTruthy();

        expect(
          getDropdown(root),
        ).toBeTruthy();

        expect(
          getOkButtonLabel(root),
        ).toBe('Close');

        expectStableSnapshot(
          root,
          'input-mode-default',
        );
      },
    );

    test(
      'uses custom input ID and placeholder',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              input-id="custom-date-input"
              placeholder="Choose a reporting period"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const input =
          getInput(root);

        const label =
          queryRequired<HTMLLabelElement>(
            root,
            'label.form-control-label',
          );

        expect(input.id).toBe(
          'custom-date-input',
        );

        expect(
          input.placeholder,
        ).toBe(
          'Choose a reporting period',
        );

        expect(
          label.htmlFor,
        ).toBe(
          'custom-date-input',
        );

        expectStableSnapshot(
          root,
          'custom-input-id-placeholder',
        );
      },
    );

    test(
      'opens and closes the dropdown',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        let toggle =
          queryRequired<HTMLButtonElement>(
            root,
            '.calendar-button',
          );

        expect(
          toggle.getAttribute(
            'aria-expanded',
          ),
        ).toBe('false');

        toggle.click();

        await flush(page);

        expect(
          getDropdown(root)
            .classList
            .contains('open'),
        ).toBe(true);

        toggle =
          queryRequired<HTMLButtonElement>(
            root,
            '.calendar-button',
          );

        expect(
          toggle.getAttribute(
            'aria-expanded',
          ),
        ).toBe('true');

        toggle.click();

        await flush(page);

        expect(
          getDropdown(root)
            .classList
            .contains('open'),
        ).toBe(false);
      },
    );

    test(
      'changes Close to OK after complete range',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        expect(
          getOkButtonLabel(root),
        ).toBe('Close');

        await clickInMonthCell(
          page,
          1,
        );

        expect(
          getOkButtonLabel(root),
        ).toBe('Close');

        await clickInMonthCell(
          page,
          7,
        );

        expect(
          getOkButtonLabel(root),
        ).toBe('OK');
      },
    );

    test(
      'updates input after calendar range selection',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        await selectRange(
          page,
          1,
          7,
        );

        expect(
          getInput(root).value,
        ).toBe(
          `${getStartLabel(root)} - ${getEndLabel(root)}`,
        );
      },
    );

    test(
      'emits date-range-updated when OK confirms range',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const listener =
          jest.fn();

        root.addEventListener(
          'date-range-updated',
          listener,
        );

        await selectRange(
          page,
          2,
          9,
        );

        const start =
          getStartLabel(root);

        const end =
          getEndLabel(root);

        getOkButton(root).click();

        await flush(page);

        expect(
          listener,
        ).toHaveBeenCalledTimes(1);

        const event =
          listener.mock
            .calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

        expect(
          event.detail,
        ).toEqual({
          startDate: start,
          endDate: end,
          startDateIso: start,
          endDateIso: end,
        });
      },
    );

    test(
      'accepts and normalizes valid typed YYYY-MM-DD range',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const listener =
          jest.fn();

        root.addEventListener(
          'date-range-updated',
          listener,
        );

        dispatchInput(
          getInput(root),
          '2026-01-10 - 2026-01-20',
        );

        await flush(page);

        expect(
          getInput(root).value,
        ).toBe(
          '2026-01-10-2026-01-20',
        );

        expect(
          getStartLabel(root),
        ).toBe('2026-01-10');

        expect(
          getEndLabel(root),
        ).toBe('2026-01-20');

        expect(
          listener,
        ).toHaveBeenCalledTimes(1);
      },
    );

    test(
      'accepts MM-DD-YYYY and emits ISO dates',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              date-format="MM-DD-YYYY"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const listener =
          jest.fn();

        root.addEventListener(
          'date-range-updated',
          listener,
        );

        dispatchInput(
          getInput(root),
          '01-10-2026 - 01-20-2026',
        );

        await flush(page);

        expect(
          getInput(root).value,
        ).toBe(
          '01-10-2026-01-20-2026',
        );

        const event =
          listener.mock
            .calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

        expect(
          event.detail,
        ).toEqual({
          startDate: '01-10-2026',
          endDate: '01-20-2026',
          startDateIso: '2026-01-10',
          endDateIso: '2026-01-20',
        });
      },
    );

    test(
      'rejects invalid typed range syntax',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        dispatchInput(
          getInput(root),
          'not a date range',
        );

        await flush(page);

        expect(
          getInput(root).getAttribute(
            'aria-invalid',
          ),
        ).toBe('true');

        expect(
          queryRequired<HTMLElement>(
            root,
            '.invalid-feedback.validation',
          ).textContent,
        ).toContain(
          'Invalid date range.',
        );

        expectStableSnapshot(
          root,
          'invalid-range',
        );
      },
    );

    test(
      'rejects reversed typed range',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        dispatchInput(
          getInput(root),
          '2026-02-20 - 2026-02-10',
        );

        await flush(page);

        expect(
          getInput(root).getAttribute(
            'aria-invalid',
          ),
        ).toBe('true');

        expect(
          queryRequired<HTMLElement>(
            root,
            '.invalid-feedback.validation',
          ).textContent?.trim(),
        ).toBe(
          'Please enter a valid date range.',
        );
      },
    );

    test(
      'clearing required input shows required validation',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              required="true"
              value="2026-06-01 - 2026-06-10"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        dispatchInput(
          getInput(root),
          '',
        );

        await flush(page);

        expect(
          getInput(root).getAttribute(
            'aria-invalid',
          ),
        ).toBe('true');

        expect(
          queryRequired<HTMLElement>(
            root,
            '.invalid-feedback.validation',
          ).textContent?.trim(),
        ).toBe(
          'This field is required.',
        );
      },
    );

    test(
      'readOnly removes interactive controls',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              read-only="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const input =
          getInput(root);

        expect(
          input.readOnly,
        ).toBe(true);

        expect(
          input.getAttribute(
            'aria-readonly',
          ),
        ).toBe('true');

        expect(
          root.querySelector(
            '.calendar-button',
          ),
        ).toBeNull();

        expect(
          root.querySelector(
            '.clear-input-button',
          ),
        ).toBeNull();
      },
    );

    test(
      'disabled disables the input and rendered calendar controls',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              disabled="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        expect(
          getInput(root).disabled,
        ).toBe(true);

        const controls =
          Array.from(
            root.querySelectorAll(
              '.calendar-button',
            ),
          ) as HTMLElement[];

        expect(
          controls.length,
        ).toBeGreaterThan(0);

        controls.forEach(control => {
          expect(
            control.hasAttribute(
              'disabled',
            ) ||
              control.getAttribute(
                'aria-disabled',
              ) === 'true',
          ).toBe(true);
        });

        expectStableSnapshot(
          root,
          'disabled',
        );
      },
    );

    test(
      'renders responsive horizontal columns',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              form-layout="horizontal"
              label-cols="sm-4 md-3"
              input-cols="sm-8 md-9"
            ></date-range-picker-component>
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
        ).toContain('col-sm-4');

        expect(
          label.className,
        ).toContain('col-md-3');

        const group =
          queryRequired<HTMLElement>(
            root,
            '.input-group',
          );

        const inputColumn =
          group.parentElement as HTMLElement;

        expect(
          inputColumn.className,
        ).toContain('col-sm-8');

        expect(
          inputColumn.className,
        ).toContain('col-md-9');

        expectStableSnapshot(
          root,
          'responsive-horizontal',
        );
      },
    );

    test(
      'horizontal hidden label uses col-12 and aria-label',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              form-layout="horizontal"
              label-hidden="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const group =
          queryRequired<HTMLElement>(
            root,
            '.input-group',
          );

        const inputColumn =
          group.parentElement as HTMLElement;

        expect(
          inputColumn.className,
        ).toContain('col-12');

        expect(
          getInput(root).getAttribute(
            'aria-label',
          ),
        ).toBe(
          'Date Range Picker',
        );

        expect(
          getInput(root).getAttribute(
            'aria-labelledby',
          ),
        ).toBeNull();
      },
    );

    test(
      'renders Plumage input styling',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              plumage="true"
            ></date-range-picker-component>
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
          'plumage-input',
        );
      },
    );

    test(
      'aria-describedby references rendered elements',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              input-id="accessible-range"
              required="true"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const input =
          getInput(root);

        parseIdRefs(
          input.getAttribute(
            'aria-describedby',
          ),
        ).forEach(id => {
          expect(
            root.querySelector(
              `[id="${id}"]`,
            ),
          ).toBeTruthy();
        });

        dispatchInput(
          input,
          '',
        );

        await flush(page);

        const updated =
          getInput(root);

        parseIdRefs(
          updated.getAttribute(
            'aria-describedby',
          ),
        ).forEach(id => {
          expect(
            root.querySelector(
              `[id="${id}"]`,
            ),
          ).toBeTruthy();
        });
      },
    );
  },
);

describe(
  'date-range-picker-component controlled values and edge cases',
  () => {
    test(
      'loads valid initial value',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              value="2026-03-05 - 2026-03-15"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        expect(
          getInput(root).value,
        ).toBe(
          '2026-03-05 - 2026-03-15',
        );

        expect(
          getStartLabel(root),
        ).toBe('2026-03-05');

        expect(
          getEndLabel(root),
        ).toBe('2026-03-15');

        expect(
          getOkButtonLabel(root),
        ).toBe('OK');

        expectStableSnapshot(
          root,
          'controlled-initial-value',
        );
      },
    );

    test(
      'updates rendered range when value changes externally',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const instance =
          page.rootInstance as ControlledInstance;

        instance.value =
          '2026-04-02 - 2026-04-09';

        await flush(page);

        expect(
          getInput(root).value,
        ).toBe(
          '2026-04-02 - 2026-04-09',
        );

        expect(
          getStartLabel(root),
        ).toBe('2026-04-02');

        expect(
          getEndLabel(root),
        ).toBe('2026-04-09');
      },
    );

    test(
      'externally clearing required value does not immediately validate',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              required="true"
              value="2026-07-10 - 2026-07-20"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          page.rootInstance as ControlledInstance;

        instance.value = '';

        await flush(page);

        expect(
          instance.startDate,
        ).toBeNull();

        expect(
          instance.endDate,
        ).toBeNull();

        expect(
          instance.validation,
        ).toBe(false);

        expect(
          getInput(root).value,
        ).toBe('');

        expect(
          root.querySelector(
            '.invalid-feedback',
          ),
        ).toBeNull();
      },
    );

    test(
      'normalizes an impossible external date using JavaScript date rollover',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              value="2026-02-20 - 2026-02-28"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          page.rootInstance as ControlledInstance;

        instance.value =
          '2026-02-30 - 2026-03-05';

        await flush(page);

        expect(
          instance.value,
        ).toBe(
          '2026-03-02 - 2026-03-05',
        );

        expect(
          getInput(root).value,
        ).toBe(
          '2026-03-02 - 2026-03-05',
        );

        expect(
          instance.startDate
            ?.toISOString()
            .slice(0, 10),
        ).toBe(
          '2026-03-02',
        );

        expect(
          instance.endDate
            ?.toISOString()
            .slice(0, 10),
        ).toBe(
          '2026-03-05',
        );

        expect(
          getStartLabel(root),
        ).toBe(
          '2026-03-02',
        );

        expect(
          getEndLabel(root),
        ).toBe(
          '2026-03-05',
        );
      },
    );

    test(
      'rejects reversed external range and preserves last valid calendar state',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              value="2026-04-01 - 2026-04-10"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          page.rootInstance as ControlledInstance;

        instance.value =
          '2026-05-10 - 2026-05-01';

        await flush(page);

        expect(
          instance.startDate
            ?.toISOString()
            .slice(0, 10),
        ).toBe('2026-04-01');

        expect(
          instance.endDate
            ?.toISOString()
            .slice(0, 10),
        ).toBe('2026-04-10');

        expect(
          getStartLabel(root),
        ).toBe('2026-04-01');

        expect(
          getEndLabel(root),
        ).toBe('2026-04-10');
      },
    );

    test(
      'normalizes an impossible typed YYYY-MM-DD date using JavaScript rollover',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const listener =
          jest.fn();

        root.addEventListener(
          'date-range-updated',
          listener,
        );

        dispatchInput(
          getInput(root),
          '2026-02-30 - 2026-03-05',
        );

        await flush(page);

        expect(
          listener,
        ).toHaveBeenCalledTimes(1);

        expect(
          getStartLabel(root),
        ).toBe(
          '2026-03-02',
        );

        expect(
          getEndLabel(root),
        ).toBe(
          '2026-03-05',
        );

        expect(
          getInput(root).value,
        ).toBe(
          '2026-03-02-2026-03-05',
        );

        expect(
          getInput(root).getAttribute(
            'aria-invalid',
          ),
        ).not.toBe('true');

        expect(
          root.querySelector(
            '.invalid-feedback.validation',
          ),
        ).toBeNull();

        const event =
          listener.mock
            .calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

        expect(
          event.detail,
        ).toEqual({
          startDate:
            '2026-03-02',
          endDate:
            '2026-03-05',
          startDateIso:
            '2026-03-02',
          endDateIso:
            '2026-03-05',
        });
      },
    );

    test(
      'normalizes February 29 in a non-leap year to March 1',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const listener =
          jest.fn();

        root.addEventListener(
          'date-range-updated',
          listener,
        );

        dispatchInput(
          getInput(root),
          '2026-02-29 - 2026-03-05',
        );

        await flush(page);

        expect(
          listener,
        ).toHaveBeenCalledTimes(1);

        expect(
          getStartLabel(root),
        ).toBe(
          '2026-03-01',
        );

        expect(
          getEndLabel(root),
        ).toBe(
          '2026-03-05',
        );

        expect(
          getInput(root).value,
        ).toBe(
          '2026-03-01-2026-03-05',
        );

        expect(
          getInput(root).getAttribute(
            'aria-invalid',
          ),
        ).not.toBe('true');

        expect(
          root.querySelector(
            '.invalid-feedback.validation',
          ),
        ).toBeNull();

        const event =
          listener.mock
            .calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

        expect(
          event.detail,
        ).toEqual({
          startDate:
            '2026-03-01',
          endDate:
            '2026-03-05',
          startDateIso:
            '2026-03-01',
          endDateIso:
            '2026-03-05',
        });
      },
    );

    test(
      'accepts February 29 in a leap year',
      async () => {
        const page =
          await createPage();

        const root =
          rootOf(page);

        const listener =
          jest.fn();

        root.addEventListener(
          'date-range-updated',
          listener,
        );

        dispatchInput(
          getInput(root),
          '2028-02-29 - 2028-03-05',
        );

        await flush(page);

        expect(
          getStartLabel(root),
        ).toBe('2028-02-29');

        expect(
          getEndLabel(root),
        ).toBe('2028-03-05');

        expect(
          getInput(root).getAttribute(
            'aria-invalid',
          ),
        ).not.toBe('true');

        expect(
          listener,
        ).toHaveBeenCalledTimes(1);

        const event =
          listener.mock
            .calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

        expect(
          event.detail,
        ).toEqual({
          startDate: '2028-02-29',
          endDate: '2028-03-05',
          startDateIso: '2028-02-29',
          endDateIso: '2028-03-05',
        });
      },
    );

    test(
      'supports regex-special custom separator',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              join-by=" | "
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        dispatchInput(
          getInput(root),
          '2026-08-01 | 2026-08-15',
        );

        await flush(page);

        expect(
          getStartLabel(root),
        ).toBe('2026-08-01');

        expect(
          getEndLabel(root),
        ).toBe('2026-08-15');

        expect(
          getInput(root).value,
        ).toContain('|');
      },
    );

    test(
      'keeps calendars consecutive for same-month controlled range',
      async () => {
        const page =
          await createPage(`
            <date-range-picker-component
              value="2026-12-05 - 2026-12-20"
            ></date-range-picker-component>
          `);

        const root =
          rootOf(page);

        const instance =
          page.rootInstance as ControlledInstance;

        expect(
          instance.currentStartMonth,
        ).toBe(11);

        expect(
          instance.currentStartYear,
        ).toBe(2026);

        expect(
          instance.currentEndMonth,
        ).toBe(0);

        expect(
          instance.currentEndYear,
        ).toBe(2027);

        const captions =
          Array.from(
            root.querySelectorAll(
              '.calendar-grid-caption',
            ),
          ).map(
            element =>
              element.textContent?.trim(),
          );

        expect(captions).toEqual([
          'December 2026',
          'January 2027',
        ]);
      },
    );
  },
);
