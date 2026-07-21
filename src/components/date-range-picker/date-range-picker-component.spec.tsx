// File: src/components/date-range-picker/date-range-picker-component.spec.tsx
import { newSpecPage, SpecPage } from '@stencil/core/testing';

const globalObject = globalThis as any;

if (!globalObject.CSS) {
  globalObject.CSS = {};
}

if (typeof globalObject.CSS.escape !== 'function') {
  globalObject.CSS.escape = (value: string) => String(value ?? '').replace(/[^a-zA-Z0-9_-]/g, character => `\\${character}`);
}

if (typeof globalObject.window !== 'undefined') {
  const windowObject = globalObject.window as any;

  if (!windowObject.CSS) {
    windowObject.CSS = globalObject.CSS;
  }

  if (typeof windowObject.CSS.escape !== 'function') {
    windowObject.CSS.escape = globalObject.CSS.escape;
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DateRangePickerComponent } = require('./date-range-picker-component') as {
  DateRangePickerComponent: any;
};

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

let originalRequestAnimationFrame: typeof global.requestAnimationFrame;
let originalCancelAnimationFrame: typeof global.cancelAnimationFrame;
let originalFocus: typeof HTMLElement.prototype.focus;
let originalMathRandom: typeof Math.random;
let activeElement: Element | null = null;

const documentPrototype: any = Object.getPrototypeOf(document) || Document.prototype;

const existingActiveElementDescriptor = Object.getOwnPropertyDescriptor(documentPrototype, 'activeElement') ?? Object.getOwnPropertyDescriptor(document, 'activeElement');

beforeAll(() => {
  originalRequestAnimationFrame = global.requestAnimationFrame;
  originalCancelAnimationFrame = global.cancelAnimationFrame;
  originalFocus = HTMLElement.prototype.focus;
  originalMathRandom = Math.random;

  Math.random = jest.fn(() => 0.123456789);

  (global as any).requestAnimationFrame = (callback: FrameRequestCallback): number => {
    callback(0);
    return 0;
  };

  (global as any).cancelAnimationFrame = jest.fn();

  HTMLElement.prototype.focus = function patchedFocus(): void {
    activeElement = this;
  };

  Object.defineProperty(documentPrototype, 'activeElement', {
    configurable: true,
    enumerable: true,
    get() {
      return activeElement;
    },
  });
});

afterAll(() => {
  global.requestAnimationFrame = originalRequestAnimationFrame;
  global.cancelAnimationFrame = originalCancelAnimationFrame;
  HTMLElement.prototype.focus = originalFocus;
  Math.random = originalMathRandom;

  if (existingActiveElementDescriptor) {
    Object.defineProperty(documentPrototype, 'activeElement', existingActiveElementDescriptor);
  } else {
    delete documentPrototype.activeElement;
  }

  activeElement = null;
});

beforeEach(() => {
  activeElement = null;
  jest.clearAllMocks();
});

const createPage = async (html = '<date-range-picker-component></date-range-picker-component>'): Promise<SpecPage> => {
  const page = await newSpecPage({
    components: [DateRangePickerComponent],
    html,
  });

  await page.waitForChanges();

  return page;
};

const flush = async (page: SpecPage): Promise<void> => {
  await page.waitForChanges();
};

const rootOf = (page: SpecPage): HTMLElement => {
  if (!page.root) {
    throw new Error('Expected the component root to be rendered.');
  }

  return page.root as HTMLElement;
};

const queryRequired = <T extends Element>(root: ParentNode, selector: string): T => {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`Expected element matching selector: ${selector}`);
  }

  return element as T;
};

const dispatchInput = (input: HTMLInputElement, value: string): void => {
  input.value = value;
  input.dispatchEvent(
    new Event('input', {
      bubbles: true,
      composed: true,
    }),
  );
};

const keyDownOn = (element: Element, key: string): void => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
    }),
  );
};

const inMonthCells = (root: HTMLElement): HTMLElement[] => Array.from(root.querySelectorAll('.calendar-grid-item:not(.previous-month-day):not(.next-month-day)')) as HTMLElement[];

const focusedCell = (root: HTMLElement): HTMLElement | null => {
  const focusedSpan = root.querySelector('.calendar-grid-item span.focus') as HTMLElement | null;

  return focusedSpan ? (focusedSpan.parentElement as HTMLElement) : null;
};

const clickInMonthCell = async (page: SpecPage, index: number): Promise<void> => {
  const cells = inMonthCells(rootOf(page));

  if (!cells[index]) {
    throw new Error(`No in-month calendar cell exists at index ${index}.`);
  }

  cells[index].click();
  await flush(page);
};

const selectRange = async (page: SpecPage, startIndex = 1, endIndex = 7): Promise<void> => {
  await clickInMonthCell(page, startIndex);
  await clickInMonthCell(page, endIndex);
};

const getStartLabel = (root: HTMLElement): string => queryRequired<HTMLElement>(root, '.start-date').textContent?.trim() ?? '';

const getEndLabel = (root: HTMLElement): string => queryRequired<HTMLElement>(root, '.end-date').textContent?.trim() ?? '';

const getOkButton = (root: HTMLElement): HTMLButtonElement => queryRequired<HTMLButtonElement>(root, '.ok-button button');

const getOkButtonLabel = (root: HTMLElement): string => getOkButton(root).textContent?.trim() ?? '';

const getInput = (root: HTMLElement): HTMLInputElement => queryRequired<HTMLInputElement>(root, 'input.form-control');

const getDropdown = (root: HTMLElement): HTMLElement => queryRequired<HTMLElement>(root, '.dropdown');

const formatRangeValue = (startDate: string, endDate: string, joinBy = ' - '): string => `${startDate}${joinBy}${endDate}`;

describe('date-range-picker-component shared rendering', () => {
  test('renders two accessible calendar grids with weekday rows above them', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);
    const calendars = Array.from(root.querySelectorAll('.dp-calendar')) as HTMLElement[];

    expect(calendars).toHaveLength(2);

    calendars.forEach(calendar => {
      const caption = queryRequired<HTMLElement>(calendar, '.calendar-grid-caption');
      const weekdays = queryRequired<HTMLElement>(calendar, '.calendar-grid-weekdays');
      const grid = queryRequired<HTMLElement>(calendar, '.calendar-grid');
      const children = Array.from(calendar.children);

      expect(caption.id).toBeTruthy();
      expect(grid.getAttribute('role')).toBe('grid');
      expect(grid.getAttribute('aria-labelledby')).toBe(caption.id);
      expect(weekdays.getAttribute('role')).toBe('row');
      expect(weekdays.querySelectorAll('[role="columnheader"]')).toHaveLength(7);
      expect(children.indexOf(weekdays)).toBeLessThan(children.indexOf(grid));
    });
  });

  test('renders 42 grid cells per calendar in seven-day rows', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);
    const grids = Array.from(root.querySelectorAll('.calendar-grid')) as HTMLElement[];

    expect(grids).toHaveLength(2);

    grids.forEach(grid => {
      expect(grid.querySelectorAll('[role="row"]')).toHaveLength(6);
      expect(grid.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    });
  });

  test('generates unique selector-safe IDs for multiple component instances', async () => {
    const page = await createPage(`
      <div>
        <date-range-picker-component
          input-id="date picker ! one"
        ></date-range-picker-component>
        <date-range-picker-component
          input-id="date picker ! one"
        ></date-range-picker-component>
      </div>
    `);

    const components = Array.from(page.body.querySelectorAll('date-range-picker-component')) as HTMLElement[];

    expect(components).toHaveLength(2);

    const firstDialog = queryRequired<HTMLElement>(components[0], '.dropdown-content');
    const secondDialog = queryRequired<HTMLElement>(components[1], '.dropdown-content');

    const firstLabelledBy = firstDialog.getAttribute('aria-labelledby');
    const secondLabelledBy = secondDialog.getAttribute('aria-labelledby');

    expect(firstLabelledBy).toBeTruthy();
    expect(secondLabelledBy).toBeTruthy();
    expect(firstLabelledBy).not.toBe(secondLabelledBy);
    expect(firstLabelledBy).toMatch(/^[A-Za-z_][\w:.-]*$/);
    expect(secondLabelledBy).toMatch(/^[A-Za-z_][\w:.-]*$/);

    expect(components[0].querySelector(`#${firstLabelledBy}`)).toBeTruthy();
    expect(components[1].querySelector(`#${secondLabelledBy}`)).toBeTruthy();
  });
});

describe('date-range-picker-component rangePicker mode', () => {
  test('renders and matches the initial snapshot', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');

    expect(page.root).toMatchSnapshot();
  });

  test('renders the picker directly without an input group', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);

    expect(root.querySelector('.date-picker')).toBeTruthy();
    expect(root.querySelector('input.form-control')).toBeNull();
    expect(root.querySelector('.dropdown')).toBeNull();
    expect(root.querySelector('.ok-button')).toBeNull();
  });

  test('does not render the OK button when rangePicker is true', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true" show-ok-button="true"></date-range-picker-component>');

    expect(rootOf(page).querySelector('.ok-button')).toBeNull();
  });

  test('moves visual focus by one day and one week with arrow keys', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);
    const wrapper = queryRequired<HTMLElement>(root, '.calendar-wrapper');

    wrapper.focus();

    expect(document.activeElement).toBe(wrapper);

    keyDownOn(wrapper, 'ArrowRight');
    await flush(page);

    const firstFocusedCell = focusedCell(root);
    const firstCells = inMonthCells(root);

    expect(firstFocusedCell).toBeTruthy();

    const firstIndex = firstCells.indexOf(firstFocusedCell!);

    expect(firstIndex).toBeGreaterThanOrEqual(0);

    keyDownOn(wrapper, 'ArrowRight');
    await flush(page);

    const secondCells = inMonthCells(root);
    const secondIndex = secondCells.indexOf(focusedCell(root)!);

    expect(secondIndex).toBe(firstIndex + 1);

    keyDownOn(wrapper, 'ArrowDown');
    await flush(page);

    const thirdCells = inMonthCells(root);
    const thirdIndex = thirdCells.indexOf(focusedCell(root)!);

    expect(thirdIndex).toBe(Math.min(secondIndex + 7, thirdCells.length - 1));

    keyDownOn(wrapper, 'ArrowUp');
    await flush(page);

    const fourthCells = inMonthCells(root);
    const fourthIndex = fourthCells.indexOf(focusedCell(root)!);

    expect(fourthIndex).toBe(Math.max(thirdIndex - 7, 0));

    keyDownOn(wrapper, 'ArrowLeft');
    await flush(page);

    const fifthCells = inMonthCells(root);
    const fifthIndex = fifthCells.indexOf(focusedCell(root)!);

    expect(fifthIndex).toBe(Math.max(fourthIndex - 1, 0));
  });

  test('selects the visually focused date with Enter', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);
    const wrapper = queryRequired<HTMLElement>(root, '.calendar-wrapper');

    wrapper.focus();
    keyDownOn(wrapper, 'ArrowRight');
    await flush(page);

    const selectedCell = focusedCell(root);

    expect(selectedCell).toBeTruthy();

    const selectedDate = selectedCell!.getAttribute('data-date');

    keyDownOn(wrapper, 'Enter');
    await flush(page);

    expect(getStartLabel(root)).toBe(selectedDate);
    expect(getEndLabel(root)).toBe('N/A');
  });

  test('selects a complete range and marks the selected cells', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);

    await selectRange(page, 0, 10);

    expect(getStartLabel(root)).not.toBe('N/A');
    expect(getEndLabel(root)).not.toBe('N/A');
    expect(root.querySelectorAll('.calendar-grid-item.selected-range').length).toBeGreaterThan(0);
    expect(root.querySelectorAll('.calendar-grid-item.selected-range-active')).toHaveLength(2);
  });

  test('starts a new range after a complete range is already selected', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);

    await selectRange(page, 1, 7);
    await clickInMonthCell(page, 12);

    const expectedStart = inMonthCells(root)[12].getAttribute('data-date');

    expect(getStartLabel(root)).toBe(expectedStart);
    expect(getEndLabel(root)).toBe('N/A');
  });

  test('moves the start date when the second selected date is earlier', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);
    const cells = inMonthCells(root);
    const earlierDate = cells[2].getAttribute('data-date');

    await clickInMonthCell(page, 8);
    await clickInMonthCell(page, 2);

    expect(getStartLabel(root)).toBe(earlierDate);
    expect(getEndLabel(root)).toBe('N/A');
  });

  test('reset clears selection and removes visual focus', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);

    await selectRange(page, 0, 10);

    queryRequired<HTMLButtonElement>(root, '.reset-btn').click();
    await flush(page);

    expect(getStartLabel(root)).toBe('N/A');
    expect(getEndLabel(root)).toBe('N/A');
    expect(root.querySelector('.calendar-grid-item span.focus')).toBeNull();
    expect(root.querySelector('.calendar-grid-item.selected-range')).toBeNull();
  });

  test('responds to the reset-picker custom event', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);

    await selectRange(page, 2, 8);

    root.dispatchEvent(
      new CustomEvent('reset-picker', {
        bubbles: true,
        composed: true,
      }),
    );
    await flush(page);

    expect(getStartLabel(root)).toBe('N/A');
    expect(getEndLabel(root)).toBe('N/A');
  });

  test('formats selected labels as long dates', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true" show-long="true"></date-range-picker-component>');
    const root = rootOf(page);

    await selectRange(page, 3, 6);

    expect(getStartLabel(root)).toMatch(/^\w+,\s\w+\s\d{1,2},\s\d{4}$/);
    expect(getEndLabel(root)).toMatch(/^\w+,\s\w+\s\d{1,2},\s\d{4}$/);
    expect(queryRequired<HTMLElement>(root, '.start-end-ranges').classList.contains('long')).toBe(true);
  });

  test('formats selected labels as ISO timestamps', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true" show-iso="true"></date-range-picker-component>');
    const root = rootOf(page);

    await selectRange(page, 4, 9);

    expect(getStartLabel(root)).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
    expect(getEndLabel(root)).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
    expect(queryRequired<HTMLElement>(root, '.start-end-ranges').classList.contains('iso')).toBe(true);
  });

  test('changes both displayed months with navigation buttons', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);
    const captionsBefore = Array.from(root.querySelectorAll('.calendar-grid-caption')).map(element => element.textContent?.trim());

    const nextButton = queryRequired<HTMLButtonElement>(root, '[aria-label="Next month"]');

    nextButton.click();
    await flush(page);

    const captionsAfterNext = Array.from(root.querySelectorAll('.calendar-grid-caption')).map(element => element.textContent?.trim());

    expect(captionsAfterNext).not.toEqual(captionsBefore);

    const previousButton = queryRequired<HTMLButtonElement>(root, '[aria-label="Previous month"]');

    previousButton.click();
    await flush(page);

    const captionsAfterPrevious = Array.from(root.querySelectorAll('.calendar-grid-caption')).map(element => element.textContent?.trim());

    expect(captionsAfterPrevious).toEqual(captionsBefore);
  });

  test('updates the consecutive calendars when month and year change', async () => {
    const page = await createPage('<date-range-picker-component range-picker="true"></date-range-picker-component>');
    const root = rootOf(page);
    const monthSelect = queryRequired<HTMLSelectElement>(root, 'select.months');
    const yearSelect = queryRequired<HTMLSelectElement>(root, 'select.years');

    monthSelect.value = '11';
    monthSelect.dispatchEvent(
      new Event('change', {
        bubbles: true,
        composed: true,
      }),
    );

    yearSelect.value = '2028';
    yearSelect.dispatchEvent(
      new Event('change', {
        bubbles: true,
        composed: true,
      }),
    );

    await flush(page);

    const captions = Array.from(root.querySelectorAll('.calendar-grid-caption')).map(element => element.textContent?.trim());

    expect(captions).toEqual(['December 2028', 'January 2029']);
  });
});

describe('date-range-picker-component input-group mode', () => {
  test('renders and matches the initial snapshot', async () => {
    const page = await createPage();

    expect(page.root).toMatchSnapshot();
  });

  test('renders an input, toggle button, dropdown, and Close button', async () => {
    const page = await createPage();
    const root = rootOf(page);

    expect(getInput(root)).toBeTruthy();
    expect(root.querySelector('.calendar-button')).toBeTruthy();
    expect(getDropdown(root)).toBeTruthy();
    expect(getOkButtonLabel(root)).toBe('Close');
  });

  test('uses the configured input ID and custom placeholder', async () => {
    const page = await createPage(`
      <date-range-picker-component
        input-id="custom-date-input"
        placeholder="Choose a reporting period"
      ></date-range-picker-component>
    `);
    const root = rootOf(page);
    const input = getInput(root);
    const label = queryRequired<HTMLLabelElement>(root, 'label.form-control-label');

    expect(input.id).toBe('custom-date-input');
    expect(input.placeholder).toBe('Choose a reporting period');
    expect(label.htmlFor).toBe('custom-date-input');
  });

  test('derives the default placeholder from dateFormat and joinBy', async () => {
    const page = await createPage(`
      <date-range-picker-component
        date-format="MM-DD-YYYY"
        join-by=" to "
      ></date-range-picker-component>
    `);

    expect(getInput(rootOf(page)).placeholder).toBe('MM-DD-YYYY  to  MM-DD-YYYY');
  });

  test('opens and closes the dropdown with the calendar toggle', async () => {
    const page = await createPage();
    const root = rootOf(page);
    const toggle = queryRequired<HTMLButtonElement>(root, '.calendar-button');

    expect(getDropdown(root).classList.contains('open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    await flush(page);

    expect(getDropdown(root).classList.contains('open')).toBe(true);
    expect(queryRequired<HTMLButtonElement>(root, '.calendar-button').getAttribute('aria-expanded')).toBe('true');

    queryRequired<HTMLButtonElement>(root, '.calendar-button').click();
    await flush(page);

    expect(getDropdown(root).classList.contains('open')).toBe(false);
    expect(queryRequired<HTMLButtonElement>(root, '.calendar-button').getAttribute('aria-expanded')).toBe('false');
  });

  test('clicking Close closes the dropdown without a full selection', async () => {
    const page = await createPage();
    const root = rootOf(page);

    queryRequired<HTMLButtonElement>(root, '.calendar-button').click();
    await flush(page);

    expect(getDropdown(root).classList.contains('open')).toBe(true);
    expect(getOkButtonLabel(root)).toBe('Close');

    getOkButton(root).click();
    await flush(page);

    expect(getDropdown(root).classList.contains('open')).toBe(false);
  });

  test('changes the button from Close to OK only after a complete range', async () => {
    const page = await createPage();
    const root = rootOf(page);

    expect(getOkButtonLabel(root)).toBe('Close');

    await clickInMonthCell(page, 0);

    expect(getOkButtonLabel(root)).toBe('Close');

    await clickInMonthCell(page, 8);

    expect(getOkButtonLabel(root)).toBe('OK');
  });

  test('updates the input after a complete calendar range is selected', async () => {
    const page = await createPage();
    const root = rootOf(page);

    await selectRange(page, 1, 7);

    expect(getInput(root).value).toMatch(/^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/);
    expect((root as any).value).toBe(getInput(root).value);
  });

  test('emits date-range-updated when OK confirms a complete selection', async () => {
    const page = await createPage();
    const root = rootOf(page);
    const listener = jest.fn();

    root.addEventListener('date-range-updated', listener);

    queryRequired<HTMLButtonElement>(root, '.calendar-button').click();
    await flush(page);

    await selectRange(page, 2, 9);

    const expectedStart = getStartLabel(root);
    const expectedEnd = getEndLabel(root);

    getOkButton(root).click();
    await flush(page);

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

    expect(event.detail).toEqual({
      startDate: expectedStart,
      endDate: expectedEnd,
      startDateIso: expectedStart,
      endDateIso: expectedEnd,
    });
    expect(getInput(root).value).toBe(formatRangeValue(expectedStart, expectedEnd));
    expect(getDropdown(root).classList.contains('open')).toBe(false);
  });

  test('accepts and normalizes a valid typed date range', async () => {
    const page = await createPage();
    const root = rootOf(page);
    const input = getInput(root);
    const listener = jest.fn();

    root.addEventListener('date-range-updated', listener);

    dispatchInput(input, '2026-01-10 - 2026-01-20');
    await flush(page);

    expect(getInput(root).value).toBe('2026-01-10-2026-01-20');
    expect(getStartLabel(root)).toBe('2026-01-10');
    expect(getEndLabel(root)).toBe('2026-01-20');
    expect(root.querySelector('.invalid-feedback')).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

    expect(event.detail).toEqual({
      startDate: '2026-01-10',
      endDate: '2026-01-20',
      startDateIso: '2026-01-10',
      endDateIso: '2026-01-20',
    });
  });

  test('accepts MM-DD-YYYY input and emits ISO submission values', async () => {
    const page = await createPage(`
    <date-range-picker-component
      date-format="MM-DD-YYYY"
    ></date-range-picker-component>
  `);
    const root = rootOf(page);
    const listener = jest.fn();

    root.addEventListener('date-range-updated', listener);

    dispatchInput(getInput(root), '01-10-2026 - 01-20-2026');
    await flush(page);

    expect(getInput(root).value).toBe('01-10-2026-01-20-2026');

    expect(getStartLabel(root)).toBe('01-10-2026');
    expect(getEndLabel(root)).toBe('01-20-2026');
    expect(root.querySelector('.invalid-feedback')).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

    expect(event.detail).toEqual({
      startDate: '01-10-2026',
      endDate: '01-20-2026',
      startDateIso: '2026-01-10',
      endDateIso: '2026-01-20',
    });
  });

  test('shows validation feedback for an invalid typed range', async () => {
    const page = await createPage();
    const root = rootOf(page);

    dispatchInput(getInput(root), 'not a date range');
    await flush(page);

    const input = getInput(root);
    const feedback = queryRequired<HTMLElement>(root, '.invalid-feedback.validation');

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.classList.contains('is-invalid')).toBe(true);
    expect(feedback.textContent).toContain('Invalid date range');
  });

  test('rejects a range whose end date occurs before its start date', async () => {
    const page = await createPage();
    const root = rootOf(page);

    dispatchInput(getInput(root), '2026-01-20 - 2026-01-10');
    await flush(page);

    expect(queryRequired<HTMLElement>(root, '.invalid-feedback.validation').textContent).toContain('Please enter a valid date range');
    expect(getStartLabel(root)).toBe('N/A');
    expect(getEndLabel(root)).toBe('N/A');
  });

  test('loads and displays a valid initial value', async () => {
    const page = await createPage(`
      <date-range-picker-component
        value="2026-03-05 - 2026-03-15"
      ></date-range-picker-component>
    `);
    const root = rootOf(page);

    expect(getInput(root).value).toBe(formatRangeValue('2026-03-05', '2026-03-15'));
    expect(getStartLabel(root)).toBe('2026-03-05');
    expect(getEndLabel(root)).toBe('2026-03-15');
    expect(getOkButtonLabel(root)).toBe('OK');
    expect(root.querySelectorAll('.calendar-grid-item.selected-range-active')).toHaveLength(2);
  });

  test('updates the rendered range when the value property changes', async () => {
    const page = await createPage();
    const root = rootOf(page);

    (root as any).value = '2026-04-02 - 2026-04-09';
    await flush(page);

    expect(getInput(root).value).toBe(formatRangeValue('2026-04-02', '2026-04-09'));
    expect(getStartLabel(root)).toBe('2026-04-02');
    expect(getEndLabel(root)).toBe('2026-04-09');
    expect(getOkButtonLabel(root)).toBe('OK');

    (root as any).value = '';
    await flush(page);

    expect(getInput(root).value).toBe('');
    expect(getStartLabel(root)).toBe('N/A');
    expect(getEndLabel(root)).toBe('N/A');
    expect(getOkButtonLabel(root)).toBe('Close');
  });

  test('clear button resets the selection and returns the button to Close', async () => {
    const page = await createPage();
    const root = rootOf(page);

    await selectRange(page, 1, 7);

    expect(getInput(root).value.length).toBeGreaterThan(0);
    expect(getOkButtonLabel(root)).toBe('OK');

    queryRequired<HTMLButtonElement>(root, '.clear-input-button').click();
    await flush(page);

    expect(getInput(root).value).toBe('');
    expect(getStartLabel(root)).toBe('N/A');
    expect(getEndLabel(root)).toBe('N/A');
    expect(getOkButtonLabel(root)).toBe('Close');
    expect(root.querySelector('.clear-input-button')).toBeNull();
  });

  test('public clear method resets the component', async () => {
    const page = await createPage(`
      <date-range-picker-component
        value="2026-05-01 - 2026-05-08"
      ></date-range-picker-component>
    `);
    const root = rootOf(page);

    expect(getInput(root).value).not.toBe('');

    await (root as any).clear();
    await flush(page);

    expect(getInput(root).value).toBe('');
    expect(getStartLabel(root)).toBe('N/A');
    expect(getEndLabel(root)).toBe('N/A');
    expect(getOkButtonLabel(root)).toBe('Close');
  });

  test('clearing a required input shows required validation', async () => {
    const page = await createPage(`
      <date-range-picker-component
        required="true"
        value="2026-06-01 - 2026-06-10"
      ></date-range-picker-component>
    `);
    const root = rootOf(page);

    queryRequired<HTMLButtonElement>(root, '.clear-input-button').click();
    await flush(page);

    expect(getInput(root).getAttribute('aria-required')).toBe('true');
    expect(getInput(root).getAttribute('aria-invalid')).toBe('true');
    expect(queryRequired<HTMLElement>(root, '.invalid-feedback.validation').textContent).toBe('This field is required.');
  });

  test('does not render the OK button when showOkButton is false', async () => {
    const page = await createPage();
    const root = rootOf(page);

    (root as any).showOkButton = false;
    await flush(page);

    expect(root.querySelector('.ok-button')).toBeNull();
  });

  test('readOnly makes the input read-only and removes interactive controls', async () => {
    const page = await createPage('<date-range-picker-component read-only="true"></date-range-picker-component>');
    const root = rootOf(page);
    const input = getInput(root);

    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);
    expect(input.hasAttribute('readonly')).toBe(true);
    expect(input.getAttribute('aria-readonly')).toBe('true');

    expect(root.querySelectorAll('.calendar-button')).toHaveLength(0);
    expect(root.querySelector('.clear-input-button')).toBeNull();

    expect(queryRequired<HTMLElement>(root, '.input-group').classList.contains('read-only')).toBe(true);
  });

  test('disabled disables the input and rendered calendar toggles', async () => {
    const page = await createPage('<date-range-picker-component disabled="true"></date-range-picker-component>');
    const root = rootOf(page);
    const input = getInput(root);
    const buttons = Array.from(root.querySelectorAll('.calendar-button')) as HTMLButtonElement[];

    expect(input.hasAttribute('disabled')).toBe(true);
    expect(input.getAttribute('aria-disabled')).toBe('true');

    expect(buttons.length).toBeGreaterThan(0);

    buttons.forEach(button => {
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    expect(root.querySelector('.clear-input-button')).toBeNull();

    expect(queryRequired<HTMLElement>(root, '.input-group').classList.contains('disabled')).toBe(true);
  });

  test('renders prepend and append buttons from their props', async () => {
    const page = await createPage();
    const root = rootOf(page);

    (root as any).prependProp = true;
    (root as any).appendProp = true;
    await flush(page);

    const buttons = Array.from(root.querySelectorAll('.calendar-button')) as HTMLButtonElement[];

    expect(buttons).toHaveLength(2);
    expect(buttons[0].classList.contains('pp-left')).toBe(true);

    (root as any).appendProp = false;
    await flush(page);

    expect(root.querySelectorAll('.calendar-button')).toHaveLength(1);
    expect(queryRequired<HTMLButtonElement>(root, '.calendar-button').classList.contains('pp-left')).toBe(true);
  });

  test('renders responsive horizontal label and input columns', async () => {
    const page = await createPage();
    const root = rootOf(page);

    (root as any).formLayout = 'horizontal';
    (root as any).labelCols = 'sm-4 lg-3';
    (root as any).inputCols = 'sm-8 lg-9';
    await flush(page);

    const formGroup = queryRequired<HTMLElement>(root, '.form-group');
    const label = queryRequired<HTMLLabelElement>(root, 'label.form-control-label');
    const inputColumn = queryRequired<HTMLElement>(root, '.input-group').parentElement as HTMLElement;

    expect(formGroup.classList.contains('horizontal')).toBe(true);
    expect(formGroup.classList.contains('row')).toBe(true);
    expect(label.classList.contains('col-sm-4')).toBe(true);
    expect(label.classList.contains('col-lg-3')).toBe(true);
    expect(inputColumn.classList.contains('col-sm-8')).toBe(true);
    expect(inputColumn.classList.contains('col-lg-9')).toBe(true);
    expect(label.textContent).toContain('Date Range Picker:');
  });

  test('uses a full-width input column when the horizontal label is hidden', async () => {
    const page = await createPage();
    const root = rootOf(page);

    (root as any).formLayout = 'horizontal';
    (root as any).labelHidden = true;
    await flush(page);

    const inputColumn = queryRequired<HTMLElement>(root, '.input-group').parentElement as HTMLElement;

    expect(root.querySelector('label.form-control-label')).toBeNull();
    expect(inputColumn.classList.contains('col-12')).toBe(true);
    expect(getInput(root).getAttribute('aria-label')).toBe('Date Range Picker');
  });

  test('renders Plumage markup and focus bars', async () => {
    const page = await createPage('<date-range-picker-component plumage="true"></date-range-picker-component>');
    const root = rootOf(page);

    expect(root.querySelector('.plumage')).toBeTruthy();
    expect(root.querySelector('.b-underline .b-focus')).toBeTruthy();
    expect(root.querySelectorAll('.selectors .input-container')).toHaveLength(2);
  });

  test('links the input to dialog instructions and validation feedback', async () => {
    const page = await createPage('<date-range-picker-component required="true"></date-range-picker-component>');
    const root = rootOf(page);

    dispatchInput(getInput(root), 'invalid');
    await flush(page);

    const describedBy = getInput(root).getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean);

    expect(describedBy).toBeDefined();
    expect(describedBy!.length).toBeGreaterThanOrEqual(2);

    describedBy!.forEach(id => {
      expect(root.querySelector(`#${id}`)).toBeTruthy();
    });
  });
});
