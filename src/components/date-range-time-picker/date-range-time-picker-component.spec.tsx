// File: src/components/date-range-time-picker/date-range-time-picker-component.spec.tsx

import { newSpecPage } from '@stencil/core/testing';

const globalObject: any = globalThis as any;

if (!globalObject.CSS) {
  globalObject.CSS = {};
}

if (typeof globalObject.CSS.escape !== 'function') {
  globalObject.CSS.escape = (value: string) =>
    String(value ?? '').replace(
      /[^a-zA-Z0-9_-]/g,
      character => `\\${character}`,
    );
}

if (typeof (globalThis as any).window !== 'undefined') {
  const windowObject: any = (globalThis as any).window;

  if (!windowObject.CSS) {
    windowObject.CSS = globalObject.CSS;
  }

  if (typeof windowObject.CSS.escape !== 'function') {
    windowObject.CSS.escape = globalObject.CSS.escape;
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  DateRangeTimePickerComponent,
} = require('./date-range-time-picker-component') as {
  DateRangeTimePickerComponent: any;
};

jest.mock('@popperjs/core', () => ({
  createPopper: () => ({
    destroy: jest.fn(),
  }),
}));

jest.setTimeout(60000);

type ControlledDateRangeTimePickerInstance = {
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
  clear: () => Promise<void>;
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

beforeAll(() => {
  originalRequestAnimationFrame = global.requestAnimationFrame;

  (global as any).requestAnimationFrame = (
    callback: FrameRequestCallback,
  ) => {
    callback(0 as any);
    return 0 as any;
  };
});

afterAll(() => {
  (global as any).requestAnimationFrame =
    originalRequestAnimationFrame;
});

let activeElement: Element | null = null;

const originalFocus = HTMLElement.prototype.focus;

const documentPrototype: any =
  Object.getPrototypeOf(document) || Document.prototype;

const existingActiveElementDescriptor =
  Object.getOwnPropertyDescriptor(
    documentPrototype,
    'activeElement',
  ) ??
  Object.getOwnPropertyDescriptor(
    document,
    'activeElement',
  );

beforeAll(() => {
  (HTMLElement.prototype as any).focus =
    function patchedFocus() {
      activeElement = this as Element;
    };

  Object.defineProperty(
    documentPrototype,
    'activeElement',
    {
      configurable: true,
      enumerable: true,
      get() {
        return activeElement ?? null;
      },
    },
  );
});

afterAll(() => {
  (HTMLElement.prototype as any).focus = originalFocus;

  if (existingActiveElementDescriptor) {
    Object.defineProperty(
      documentPrototype,
      'activeElement',
      existingActiveElementDescriptor,
    );
  } else {
    delete documentPrototype.activeElement;
  }

  activeElement = null;
});

const flush = async (page: any): Promise<void> => {
  await page.waitForChanges();
};

const keyDownOn = (
  element: Element,
  key: string,
): void => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
    }),
  );
};

const inMonthCells = (
  root: HTMLElement,
): HTMLElement[] =>
  Array.from(
    root.querySelectorAll(
      '.calendar-grid-item:not(.previous-month-day):not(.next-month-day)',
    ),
  ) as HTMLElement[];

const focusedCell = (
  root: HTMLElement,
): HTMLElement | null => {
  const focusedSpan = root.querySelector(
    '.calendar-grid-item span.focus',
  ) as HTMLElement | null;

  return focusedSpan
    ? (focusedSpan.parentElement as HTMLElement)
    : null;
};

const getOpenDropdown = (
  root: HTMLElement,
): HTMLElement | null =>
  root.querySelector(
    '.dropdown.open',
  ) as HTMLElement | null;

const getOkButton = (
  root: HTMLElement,
): HTMLButtonElement | null =>
  root.querySelector(
    '.ok-button button',
  ) as HTMLButtonElement | null;

const getToggleButtons = (
  root: HTMLElement,
): HTMLButtonElement[] =>
  Array.from(
    root.querySelectorAll('.calendar-button'),
  ) as HTMLButtonElement[];

const getMainInput = (
  root: HTMLElement,
): HTMLInputElement | null =>
  root.querySelector(
    'input.form-control',
  ) as HTMLInputElement | null;

const getTimeInputs = (
  root: HTMLElement,
): {
  start: HTMLInputElement | null;
  end: HTMLInputElement | null;
} => {
  const inputs = Array.from(
    root.querySelectorAll('input.time-input'),
  ) as HTMLInputElement[];

  return {
    start: inputs[0] ?? null,
    end: inputs[1] ?? null,
  };
};

const getStartDateLabel = (
  root: HTMLElement,
): HTMLElement | null =>
  root.querySelector(
    '.start-date',
  ) as HTMLElement | null;

const getEndDateLabel = (
  root: HTMLElement,
): HTMLElement | null =>
  root.querySelector(
    '.end-date',
  ) as HTMLElement | null;

const getInstance = (
  page: any,
): ControlledDateRangeTimePickerInstance =>
  page.rootInstance as ControlledDateRangeTimePickerInstance;

const expectUtcDate = (
  date: Date | null,
  year: number,
  monthIndex: number,
  day: number,
): void => {
  expect(date).toBeTruthy();
  expect(date!.getUTCFullYear()).toBe(year);
  expect(date!.getUTCMonth()).toBe(monthIndex);
  expect(date!.getUTCDate()).toBe(day);
};

const parseIdReferences = (
  value: string | null,
): string[] =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const escapeAttributeValue = (
  value: string,
): string =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

const queryById = (
  root: HTMLElement,
  id: string,
): HTMLElement | null =>
  root.querySelector(
    `[id="${escapeAttributeValue(id)}"]`,
  ) as HTMLElement | null;

const expectAriaReferencesResolve = (
  root: HTMLElement,
  element: HTMLElement,
  attributeName:
    | 'aria-labelledby'
    | 'aria-describedby'
    | 'aria-controls',
): void => {
  const ids = parseIdReferences(
    element.getAttribute(attributeName),
  );

  ids.forEach(id => {
    expect(queryById(root, id)).toBeTruthy();
  });
};

describe(
  'date-range-time-picker-component (rangeTimePicker mode)',
  () => {
    test(
      'renders and matches snapshot (initial)',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        expect(page.root).toMatchSnapshot();
      },
    );

    test(
      'renders calendars with weekday row above grid',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;

        const calendar = root.querySelector(
          '.dp-calendar',
        ) as HTMLElement | null;

        expect(calendar).toBeTruthy();

        const weekdays = calendar!.querySelector(
          '.calendar-grid-weekdays',
        ) as HTMLElement | null;

        const grid = calendar!.querySelector(
          '.calendar-grid',
        ) as HTMLElement | null;

        expect(weekdays).toBeTruthy();
        expect(grid).toBeTruthy();

        const children = Array.from(calendar!.children);

        expect(
          children.indexOf(weekdays!),
        ).toBeGreaterThanOrEqual(0);

        expect(
          children.indexOf(grid!),
        ).toBeGreaterThanOrEqual(0);

        expect(
          children.indexOf(weekdays!),
        ).toBeLessThan(
          children.indexOf(grid!),
        );
      },
    );

    test(
      'does not render OK/Close button in rangeTimePicker-only mode',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;

        expect(
          root.querySelector('.ok-button'),
        ).toBeNull();
      },
    );

    test(
      'renders start/end time inputs in rangeTimePicker-only mode',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const { start, end } = getTimeInputs(root);

        expect(start).toBeTruthy();
        expect(end).toBeTruthy();
        expect(start!.value).toBe('00:00');
        expect(end!.value).toBe('00:00');
      },
    );

    test(
      'arrow-key navigation moves by one day and one week without skipping',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;

        const wrapper = root.querySelector(
          '.calendar-wrapper',
        ) as HTMLElement | null;

        expect(wrapper).toBeTruthy();

        wrapper!.setAttribute('tabindex', '0');
        wrapper!.focus();

        keyDownOn(wrapper!, 'ArrowRight');
        await flush(page);

        const initialCells = inMonthCells(root);
        const initialFocusedCell = focusedCell(root);

        expect(initialFocusedCell).toBeTruthy();

        const initialIndex = initialCells.indexOf(
          initialFocusedCell!,
        );

        expect(initialIndex).toBeGreaterThanOrEqual(0);

        keyDownOn(wrapper!, 'ArrowRight');
        await flush(page);

        const rightIndex = inMonthCells(root).indexOf(
          focusedCell(root)!,
        );

        expect(rightIndex).toBe(initialIndex + 1);

        keyDownOn(wrapper!, 'ArrowDown');
        await flush(page);

        const downCells = inMonthCells(root);
        const downIndex = downCells.indexOf(
          focusedCell(root)!,
        );

        expect(downIndex).toBe(
          Math.min(
            rightIndex + 7,
            downCells.length - 1,
          ),
        );

        keyDownOn(wrapper!, 'ArrowUp');
        await flush(page);

        const upIndex = inMonthCells(root).indexOf(
          focusedCell(root)!,
        );

        expect(upIndex).toBe(
          Math.max(downIndex - 7, 0),
        );

        keyDownOn(wrapper!, 'ArrowLeft');
        await flush(page);

        const leftIndex = inMonthCells(root).indexOf(
          focusedCell(root)!,
        );

        expect(leftIndex).toBe(
          Math.max(upIndex - 1, 0),
        );
      },
    );

    test(
      'click selects a range and reset clears selection and visual focus',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const cells = inMonthCells(root);

        expect(cells.length).toBeGreaterThan(10);

        cells[0].click();
        await flush(page);

        cells[10].click();
        await flush(page);

        const startLabel = getStartDateLabel(root);
        const endLabel = getEndDateLabel(root);

        expect(startLabel).toBeTruthy();
        expect(endLabel).toBeTruthy();
        expect(startLabel!.textContent).not.toBe('N/A');
        expect(endLabel!.textContent).not.toBe('N/A');

        const resetButton = root.querySelector(
          '.reset-btn',
        ) as HTMLButtonElement | null;

        expect(resetButton).toBeTruthy();

        resetButton!.click();
        await flush(page);

        expect(startLabel!.textContent).toBe('N/A');
        expect(endLabel!.textContent).toBe('N/A');

        expect(
          root.querySelector(
            '.calendar-grid-item span.focus',
          ),
        ).toBeNull();
      },
    );

    test(
      'show-long formats selected labels as long dates',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              range-time-picker="true"
              show-long="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const cells = inMonthCells(root);

        cells[3].click();
        await flush(page);

        cells[6].click();
        await flush(page);

        const startLabel = getStartDateLabel(root);
        const endLabel = getEndDateLabel(root);

        expect(startLabel).toBeTruthy();
        expect(endLabel).toBeTruthy();

        expect(
          startLabel!.textContent || '',
        ).toMatch(
          /\w+,\s\w+\s\d{1,2},\s\d{4}/,
        );

        expect(
          endLabel!.textContent || '',
        ).toMatch(
          /\w+,\s\w+\s\d{1,2},\s\d{4}/,
        );
      },
    );

    test(
      'clearing a time field shows warning state',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              range-time-picker="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const cells = inMonthCells(root);

        expect(cells.length).toBeGreaterThan(7);

        cells[1].click();
        await flush(page);

        cells[5].click();
        await flush(page);

        const { start, end } = getTimeInputs(root);

        expect(start).toBeTruthy();
        expect(end).toBeTruthy();

        start!.value = '';

        start!.dispatchEvent(
          new Event('input', {
            bubbles: true,
          }),
        );

        await flush(page);

        const warning = root.querySelector(
          '.warning-message',
        ) as HTMLElement | null;

        expect(warning).toBeTruthy();
        expect(start!.value).toBe('');

        const okButton = getOkButton(root);

        if (okButton) {
          expect(okButton.disabled).toBe(true);
        }
      },
    );
  },
);

describe(
  'date-range-time-picker-component (input-group mode)',
  () => {
    test(
      'renders and matches snapshot',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component>
            </date-range-time-picker-component>
          `,
        });

        await flush(page);

        expect(page.root).toMatchSnapshot();
      },
    );

    test(
      'renders OK/Close button and defaults to Close',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component>
            </date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const okButton = getOkButton(root);

        expect(okButton).toBeTruthy();

        expect(
          okButton!.textContent?.trim(),
        ).toBe('Close');
      },
    );

    test(
      'opens dropdown from calendar toggle',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component>
            </date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const toggle = getToggleButtons(root)[0];

        expect(toggle).toBeTruthy();

        toggle.click();
        await flush(page);

        expect(getOpenDropdown(root)).toBeTruthy();
      },
    );

    test(
      'button changes to OK only after full range selection with valid times',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component>
            </date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const toggle = getToggleButtons(root)[0];

        toggle.click();
        await flush(page);

        const cells = inMonthCells(root);
        const okButton = getOkButton(root);

        expect(okButton).toBeTruthy();

        expect(
          okButton!.textContent?.trim(),
        ).toBe('Close');

        cells[0].click();
        await flush(page);

        expect(
          okButton!.textContent?.trim(),
        ).toBe('Close');

        cells[8].click();
        await flush(page);

        expect(
          okButton!.textContent?.trim(),
        ).toBe('OK');
      },
    );

    test(
      'clicking Close closes dropdown without requiring a full selection',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component>
            </date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const toggle = getToggleButtons(root)[0];

        expect(toggle).toBeTruthy();

        toggle.click();
        await flush(page);

        expect(getOpenDropdown(root)).toBeTruthy();

        const okButton = getOkButton(root);

        expect(okButton).toBeTruthy();

        expect(
          okButton!.textContent?.trim(),
        ).toBe('Close');

        okButton!.click();
        await flush(page);

        expect(getOpenDropdown(root)).toBeNull();
      },
    );

    test(
      'clicking OK closes dropdown after full selection',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component>
            </date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;

        getToggleButtons(root)[0].click();
        await flush(page);

        const cells = inMonthCells(root);

        cells[1].click();
        await flush(page);

        cells[7].click();
        await flush(page);

        const okButton = getOkButton(root);

        expect(okButton).toBeTruthy();

        expect(
          okButton!.textContent?.trim(),
        ).toBe('OK');

        okButton!.click();
        await flush(page);

        expect(getOpenDropdown(root)).toBeNull();
      },
    );

    test(
      'clear button resets selection, input, and button label',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component>
            </date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;

        getToggleButtons(root)[0].click();
        await flush(page);

        const cells = inMonthCells(root);
        const okButton = getOkButton(root);

        cells[1].click();
        await flush(page);

        cells[7].click();
        await flush(page);

        expect(okButton).toBeTruthy();

        expect(
          okButton!.textContent?.trim(),
        ).toBe('OK');

        const input = getMainInput(root);

        expect(input).toBeTruthy();

        okButton!.click();
        await flush(page);

        expect(
          input!.value.trim().length,
        ).toBeGreaterThan(0);

        const clearButton = root.querySelector(
          '.clear-input-button',
        ) as HTMLButtonElement | null;

        expect(clearButton).toBeTruthy();

        clearButton!.click();
        await flush(page);

        expect(input!.value).toBe('');

        expect(
          getStartDateLabel(root)!.textContent,
        ).toBe('N/A');

        expect(
          getEndDateLabel(root)!.textContent,
        ).toBe('N/A');

        expect(
          okButton!.textContent?.trim(),
        ).toBe('Close');
      },
    );

    test(
      'invalid time keeps button label at Close',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component>
            </date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;

        getToggleButtons(root)[0].click();
        await flush(page);

        const cells = inMonthCells(root);

        cells[0].click();
        await flush(page);

        cells[3].click();
        await flush(page);

        const { start } = getTimeInputs(root);
        const okButton = getOkButton(root);

        expect(start).toBeTruthy();
        expect(okButton).toBeTruthy();

        expect(
          okButton!.textContent?.trim(),
        ).toBe('OK');

        start!.value = '99:99';

        start!.dispatchEvent(
          new Event('input', {
            bubbles: true,
          }),
        );

        await flush(page);

        expect(
          okButton!.textContent?.trim(),
        ).toBe('Close');
      },
    );

    test(
      'main input and toggle buttons are disabled when disabled=true',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              disabled="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const input = getMainInput(root);
        const buttons = getToggleButtons(root);

        expect(input).toBeTruthy();

        expect(
          input!.hasAttribute('disabled'),
        ).toBe(true);

        expect(
          buttons.length,
        ).toBeGreaterThan(0);

        buttons.forEach(button => {
          expect(
            button.hasAttribute('disabled'),
          ).toBe(true);
        });
      },
    );

    test(
      'readOnly makes input read-only and removes interactive controls',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              read-only="true"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const input = getMainInput(root);

        expect(input).toBeTruthy();

        expect(
          input!.hasAttribute('disabled'),
        ).toBe(false);

        expect(input!.readOnly).toBe(true);

        expect(
          input!.hasAttribute('readonly'),
        ).toBe(true);

        expect(
          input!.getAttribute('aria-readonly'),
        ).toBe('true');

        expect(
          getToggleButtons(root),
        ).toHaveLength(0);

        expect(
          root.querySelector('.clear-input-button'),
        ).toBeNull();

        const inputGroup = root.querySelector(
          '.input-group',
        ) as HTMLElement | null;

        expect(inputGroup).toBeTruthy();

        expect(
          inputGroup!.classList.contains('read-only'),
        ).toBe(true);
      },
    );
  },
);

describe(
  'date-range-time-picker-component (controlled value)',
  () => {
    test(
      'hydrates input, dates, times, calendar months, and labels from initial value',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="controlled-initial"
              date-format="YYYY-MM-DD"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const instance = getInstance(page);
        const input = getMainInput(root);
        const { start, end } = getTimeInputs(root);

        expect(input).toBeTruthy();

        expect(input!.value).toBe(
          '2026-07-20 09:00  -  2026-08-20 17:00',
        );

        expect(instance.value).toBe(
          '2026-07-20 09:00  -  2026-08-20 17:00',
        );

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

        expect(instance.startTime).toBe('09:00');
        expect(instance.endTime).toBe('17:00');

        expect(instance.currentStartMonth).toBe(6);
        expect(instance.currentStartYear).toBe(2026);
        expect(instance.currentEndMonth).toBe(7);
        expect(instance.currentEndYear).toBe(2026);

        expect(start).toBeTruthy();
        expect(end).toBeTruthy();
        expect(start!.value).toBe('09:00');
        expect(end!.value).toBe('17:00');

        expect(
          getStartDateLabel(root)!.textContent,
        ).toContain('2026-07-20');

        expect(
          getEndDateLabel(root)!.textContent,
        ).toContain('2026-08-20');
      },
    );

    test(
      'synchronizes an externally updated value with all picker state',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="controlled-update"
              date-format="YYYY-MM-DD"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 12:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const instance = getInstance(page);
        const input = getMainInput(root);

        expect(input).toBeTruthy();

        instance.value =
          '2026-09-10 13:15 - 2026-10-12 18:45';

        await flush(page);

        expect(instance.value).toBe(
          '2026-09-10 13:15  -  2026-10-12 18:45',
        );

        expect(input!.value).toBe(
          '2026-09-10 13:15  -  2026-10-12 18:45',
        );

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

        expect(instance.startTime).toBe('13:15');
        expect(instance.endTime).toBe('18:45');

        expect(instance.currentStartMonth).toBe(8);
        expect(instance.currentStartYear).toBe(2026);
        expect(instance.currentEndMonth).toBe(9);
        expect(instance.currentEndYear).toBe(2026);

        const { start, end } = getTimeInputs(root);

        expect(start!.value).toBe('13:15');
        expect(end!.value).toBe('18:45');

        expect(
          getStartDateLabel(root)!.textContent,
        ).toContain('2026-09-10');

        expect(
          getEndDateLabel(root)!.textContent,
        ).toContain('2026-10-12');
      },
    );

    test(
      'externally clearing value resets picker state without immediate required validation',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="controlled-clear"
              date-format="YYYY-MM-DD"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
              required
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const instance = getInstance(page);
        const input = getMainInput(root);

        expect(input).toBeTruthy();

        instance.value = '';

        await flush(page);

        expect(instance.value).toBe('');
        expect(input!.value).toBe('');
        expect(instance.startDate).toBeNull();
        expect(instance.endDate).toBeNull();
        expect(instance.startTime).toBe('00:00');
        expect(instance.endTime).toBe('00:00');
        expect(instance.durationText).toBe('');
        expect(instance.validation).toBe(false);
        expect(instance.validationMessage).toBe('');

        expect(
          getStartDateLabel(root)!.textContent,
        ).toBe('N/A');

        expect(
          getEndDateLabel(root)!.textContent,
        ).toBe('N/A');

        expect(
          root.querySelector(
            '.calendar-grid-item span.focus',
          ),
        ).toBeNull();

        expect(
          root.querySelector(
            '.calendar-grid-item span.active',
          ),
        ).toBeNull();

        expect(
          input!.getAttribute('aria-invalid'),
        ).not.toBe('true');
      },
    );

    test(
      'public clear method resets controlled state',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="method-clear"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const instance = getInstance(page);
        const input = getMainInput(root);

        await instance.clear();
        await flush(page);

        expect(instance.value).toBe('');
        expect(input!.value).toBe('');
        expect(instance.startDate).toBeNull();
        expect(instance.endDate).toBeNull();
      },
    );

    test(
      'preserves last valid state when an impossible external date is supplied',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="controlled-invalid"
              date-format="YYYY-MM-DD"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const instance = getInstance(page);
        const input = getMainInput(root);

        instance.value =
          '2026-02-30 09:00 - 2026-03-05 17:00';

        await flush(page);

        expect(instance.value).toBe(
          '2026-02-30 09:00 - 2026-03-05 17:00',
        );

        expect(input!.value).toBe(
          '2026-02-30 09:00 - 2026-03-05 17:00',
        );

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

        expect(instance.startTime).toBe('09:00');
        expect(instance.endTime).toBe('17:00');
      },
    );

    test(
      'preserves last valid state when external end occurs before start',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="controlled-reversed"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const instance = getInstance(page);

        instance.value =
          '2026-09-20 17:00 - 2026-09-20 09:00';

        await flush(page);

        expect(instance.value).toBe(
          '2026-09-20 17:00 - 2026-09-20 09:00',
        );

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

        expect(instance.startTime).toBe('09:00');
        expect(instance.endTime).toBe('17:00');
      },
    );

    test(
      'hydrates and updates MM-DD-YYYY controlled values',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="controlled-mdy"
              date-format="MM-DD-YYYY"
              join-by=" - "
              value="07-20-2026 09:00 - 08-20-2026 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const instance = getInstance(page);

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

        instance.value =
          '09-10-2026 13:30 - 10-15-2026 18:45';

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
          15,
        );

        expect(instance.startTime).toBe('13:30');
        expect(instance.endTime).toBe('18:45');
      },
    );

    test(
      'rejects February 29 in a non-leap year without rolling into March',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="non-leap"
              join-by=" - "
              value="2026-02-28 09:00 - 2026-03-05 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const instance = getInstance(page);

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
      'accepts February 29 during a leap year',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="leap-year"
              join-by=" - "
              value="2028-02-28 09:00 - 2028-03-05 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const instance = getInstance(page);

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
      'hydrates 12-hour controlled values and preserves AM/PM state',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="controlled-12-hour"
              date-format="MM-DD-YYYY"
              is-twenty-four-hour-format="false"
              join-by=" - "
              value="07-20-2026 09:15 AM - 08-20-2026 05:45 PM"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const instance = getInstance(page);

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

        expect(instance.startTime).toBe('09:15');
        expect(instance.endTime).toBe('05:45');
        expect(instance.startAmPm).toBe('AM');
        expect(instance.endAmPm).toBe('PM');

        const toggles = Array.from(
          root.querySelectorAll('.am-pm-toggle'),
        ) as HTMLButtonElement[];

        expect(toggles).toHaveLength(2);

        expect(
          toggles[0].textContent?.trim(),
        ).toBe('AM');

        expect(
          toggles[1].textContent?.trim(),
        ).toBe('PM');
      },
    );

    test(
      'computes duration for a complete controlled value',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="controlled-duration"
              show-duration="true"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-07-20 17:30"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const instance = getInstance(page);

        expect(
          instance.durationText.length,
        ).toBeGreaterThan(0);

        const duration = root.querySelector(
          '.duration',
        ) as HTMLElement | null;

        expect(duration).toBeTruthy();

        expect(
          duration!.textContent?.trim().length,
        ).toBeGreaterThan(0);

        expect(
          getMainInput(root)!.value,
        ).toContain(instance.durationText);
      },
    );
  },
);

describe(
  'date-range-time-picker-component (events)',
  () => {
    test(
      'emits structured date-time-updated detail when OK confirms a complete range',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="event-payload"
              date-format="YYYY-MM-DD"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const handler = jest.fn();

        root.addEventListener(
          'date-time-updated',
          handler,
        );

        getToggleButtons(root)[0].click();
        await flush(page);

        const okButton = getOkButton(root);

        expect(okButton).toBeTruthy();

        expect(
          okButton!.textContent?.trim(),
        ).toBe('OK');

        handler.mockClear();

        okButton!.click();
        await flush(page);

        expect(handler).toHaveBeenCalledTimes(1);

        const event = handler.mock
          .calls[0][0] as CustomEvent<DateTimeUpdatedDetail>;

        expect(event.detail).toEqual({
          startDate: '2026-07-20',
          endDate: '2026-08-20',
          startTime: '09:00',
          endTime: '17:00',
          duration: '',
          startDateIso: '2026-07-20',
          endDateIso: '2026-08-20',
          startDateTimeIso: expect.any(String),
          endDateTimeIso: expect.any(String),
        });

        expect(
          event.detail.startDateTimeIso,
        ).toContain('2026-07-20T09:00');

        expect(
          event.detail.endDateTimeIso,
        ).toContain('2026-08-20T17:00');
      },
    );

    test(
      'does not emit date-time-updated when range is incomplete',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="incomplete-event"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const handler = jest.fn();

        root.addEventListener(
          'date-time-updated',
          handler,
        );

        getToggleButtons(root)[0].click();
        await flush(page);

        const cells = inMonthCells(root);

        cells[0].click();
        await flush(page);

        const closeButton = getOkButton(root);

        expect(
          closeButton!.textContent?.trim(),
        ).toBe('Close');

        closeButton!.click();
        await flush(page);

        expect(handler).not.toHaveBeenCalled();
      },
    );

    test(
      'does not emit another date-time-updated event when confirmation occurs with an invalid time',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="invalid-time-event"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const handler = jest.fn();

        root.addEventListener(
          'date-time-updated',
          handler,
        );

        getToggleButtons(root)[0].click();
        await flush(page);

        const cells = inMonthCells(root);

        cells[0].click();
        await flush(page);

        cells[5].click();
        await flush(page);

        expect(handler).toHaveBeenCalled();

        handler.mockClear();

        const { start } = getTimeInputs(root);

        expect(start).toBeTruthy();

        start!.value = '99:99';

        start!.dispatchEvent(
          new Event('input', {
            bubbles: true,
          }),
        );

        await flush(page);

        const closeButton = getOkButton(root);

        expect(closeButton).toBeTruthy();

        expect(
          closeButton!.textContent?.trim(),
        ).toBe('Close');

        closeButton!.click();
        await flush(page);

        expect(handler).not.toHaveBeenCalled();
      },
    );
  },
);

describe(
  'date-range-time-picker-component (accessibility and identity)',
  () => {
    test(
      'keeps a preloaded value visible in disabled mode',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="disabled-controlled"
              disabled="true"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const input = getMainInput(root);

        expect(input).toBeTruthy();
        expect(input!.disabled).toBe(true);

        expect(input!.value).toBe(
          '2026-07-20 09:00  -  2026-08-20 17:00',
        );

        expectUtcDate(
          getInstance(page).startDate,
          2026,
          6,
          20,
        );

        expectUtcDate(
          getInstance(page).endDate,
          2026,
          7,
          20,
        );
      },
    );

    test(
      'keeps a preloaded value visible in read-only mode',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="readonly-controlled"
              read-only="true"
              join-by=" - "
              value="2026-07-20 09:00 - 2026-08-20 17:00"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const input = getMainInput(root);

        expect(input).toBeTruthy();
        expect(input!.readOnly).toBe(true);

        expect(input!.value).toBe(
          '2026-07-20 09:00  -  2026-08-20 17:00',
        );

        expect(
          getToggleButtons(root),
        ).toHaveLength(0);

        expect(
          root.querySelector('.clear-input-button'),
        ).toBeNull();
      },
    );

    test(
      'generates unique internal IDs for multiple instances',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <div>
              <date-range-time-picker-component
                input-id="range-a"
              ></date-range-time-picker-component>

              <date-range-time-picker-component
                input-id="range-b"
              ></date-range-time-picker-component>
            </div>
          `,
        });

        await flush(page);

        const components = Array.from(
          page.body.querySelectorAll(
            'date-range-time-picker-component',
          ),
        ) as HTMLElement[];

        expect(components).toHaveLength(2);

        const firstIds = new Set(
          Array.from(
            components[0].querySelectorAll('[id]'),
          ).map(element => element.id),
        );

        const secondIds = new Set(
          Array.from(
            components[1].querySelectorAll('[id]'),
          ).map(element => element.id),
        );

        const duplicates = Array.from(
          firstIds,
        ).filter(id => secondIds.has(id));

        expect(duplicates).toEqual([]);
      },
    );

    test(
      'main input ARIA references resolve to rendered elements',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="aria-controlled"
              label="Maintenance Window"
              required
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;
        const input = getMainInput(root);

        expect(input).toBeTruthy();

        expectAriaReferencesResolve(
          root,
          input!,
          'aria-labelledby',
        );

        expectAriaReferencesResolve(
          root,
          input!,
          'aria-describedby',
        );

        const toggles = getToggleButtons(root);

        toggles.forEach(toggle => {
          expectAriaReferencesResolve(
            root,
            toggle,
            'aria-controls',
          );
        });
      },
    );

    test(
      'dialog exposes accessible name, description, and modal semantics',
      async () => {
        const page = await newSpecPage({
          components: [DateRangeTimePickerComponent],
          html: `
            <date-range-time-picker-component
              input-id="dialog-accessibility"
              label="Maintenance Window"
            ></date-range-time-picker-component>
          `,
        });

        await flush(page);

        const root = page.root as HTMLElement;

        getToggleButtons(root)[0].click();
        await flush(page);

        const dialog = root.querySelector(
          '.dropdown-content',
        ) as HTMLElement | null;

        expect(dialog).toBeTruthy();

        expect(
          dialog!.getAttribute('role'),
        ).toBe('dialog');

        expect(
          dialog!.getAttribute('aria-modal'),
        ).toBe('true');

        expectAriaReferencesResolve(
          root,
          dialog!,
          'aria-labelledby',
        );

        expectAriaReferencesResolve(
          root,
          dialog!,
          'aria-describedby',
        );
      },
    );
  },
);
