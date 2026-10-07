// File: src/components/plumage-date-range-picker/plumage-date-range-picker-component.spec.tsx

import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { PlumageDateRangePickerComponent } from './plumage-date-range-picker-component';

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

type ControlledInstance = PlumageDateRangePickerComponent & {
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

  dropdownOpen: boolean;
};

let originalRequestAnimationFrame: typeof global.requestAnimationFrame | undefined;

let originalCancelAnimationFrame: typeof global.cancelAnimationFrame | undefined;

let originalFocus: typeof HTMLElement.prototype.focus;

let originalMathRandom: typeof Math.random;

let activeElement: Element | null = null;

const documentPrototype = Object.getPrototypeOf(document) || Document.prototype;

const activeElementDescriptor = Object.getOwnPropertyDescriptor(documentPrototype, 'activeElement') ?? Object.getOwnPropertyDescriptor(document, 'activeElement');

beforeAll(() => {
  originalRequestAnimationFrame = global.requestAnimationFrame;

  originalCancelAnimationFrame = global.cancelAnimationFrame;

  originalFocus = HTMLElement.prototype.focus;

  originalMathRandom = Math.random;

  Math.random = jest.fn(() => 0.123456789);

  (
    global as typeof global & {
      requestAnimationFrame: typeof requestAnimationFrame;
    }
  ).requestAnimationFrame = (callback: FrameRequestCallback): number => {
    callback(0);

    return 0;
  };

  (
    global as typeof global & {
      cancelAnimationFrame: typeof cancelAnimationFrame;
    }
  ).cancelAnimationFrame = jest.fn();

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
  (
    global as typeof global & {
      requestAnimationFrame?: typeof requestAnimationFrame;
    }
  ).requestAnimationFrame = originalRequestAnimationFrame;

  (
    global as typeof global & {
      cancelAnimationFrame?: typeof cancelAnimationFrame;
    }
  ).cancelAnimationFrame = originalCancelAnimationFrame;

  HTMLElement.prototype.focus = originalFocus;

  Math.random = originalMathRandom;

  if (activeElementDescriptor) {
    Object.defineProperty(documentPrototype, 'activeElement', activeElementDescriptor);
  } else {
    delete documentPrototype.activeElement;
  }

  activeElement = null;
});

beforeEach(() => {
  activeElement = null;

  jest.clearAllMocks();
});

async function createPage(html = '<plumage-date-range-picker-component></plumage-date-range-picker-component>'): Promise<SpecPage> {
  const page = await newSpecPage({
    components: [PlumageDateRangePickerComponent],
    html,
  });

  await page.waitForChanges();

  return page;
}

async function flush(page: SpecPage): Promise<void> {
  await page.waitForChanges();
}

function rootOf(page: SpecPage): HTMLElement {
  if (!page.root) {
    throw new Error('Expected component root.');
  }

  return page.root as HTMLElement;
}

function queryRequired<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`Expected element matching: ${selector}`);
  }

  return element as T;
}

function getInput(root: HTMLElement): HTMLInputElement {
  return queryRequired<HTMLInputElement>(root, 'input.form-control');
}

function getDropdown(root: HTMLElement): HTMLElement {
  return queryRequired<HTMLElement>(root, '.dropdown');
}

function getStartLabel(root: HTMLElement): string {
  return queryRequired<HTMLElement>(root, '.start-date').textContent?.trim() ?? '';
}

function getEndLabel(root: HTMLElement): string {
  return queryRequired<HTMLElement>(root, '.end-date').textContent?.trim() ?? '';
}

function getOkButton(root: HTMLElement): HTMLButtonElement {
  return queryRequired<HTMLButtonElement>(root, '.ok-button button');
}

function getOkButtonLabel(root: HTMLElement): string {
  return getOkButton(root).textContent?.trim() ?? '';
}

function getCalendarWrapper(root: HTMLElement): HTMLElement {
  return queryRequired<HTMLElement>(root, '.calendar-wrapper');
}

function getCalendars(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll('.dp-calendar')) as HTMLElement[];
}

function inMonthCells(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll('.calendar-grid-item:not(.previous-month-day):not(.next-month-day)')) as HTMLElement[];
}

function focusedCell(root: HTMLElement): HTMLElement | null {
  const span = root.querySelector('.calendar-grid-item span.focus') as HTMLElement | null;

  return span ? (span.parentElement as HTMLElement) : null;
}

function dispatchInput(input: HTMLInputElement, value: string): void {
  input.value = value;

  input.dispatchEvent(
    new Event('input', {
      bubbles: true,
      composed: true,
    }),
  );
}

function keyDownOn(element: Element, key: string): void {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      composed: true,
    }),
  );
}

function parseIdRefs(value: string | null): string[] {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeGeneratedDateRangePickerIds(root: HTMLElement): void {
  const elements: Element[] = [root, ...Array.from(root.querySelectorAll('*'))];

  const generatedBases = new Set<string>();

  elements.forEach(element => {
    const id = element.getAttribute('id');

    if (!id) {
      return;
    }

    const match = id.match(/^(.+?-\d+-[a-z0-9]{4})(?:-|$)/i);

    if (match?.[1]) {
      generatedBases.add(match[1]);
    }
  });

  const replacements = Array.from(generatedBases)
    .sort((a, b) => b.length - a.length)
    .map((generatedBase, index) => ({
      generatedBase,
      stableBase: generatedBases.size === 1 ? 'drp-test' : `drp-test-${index + 1}`,
    }));

  if (replacements.length === 0) {
    return;
  }

  elements.forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      let value = attribute.value;

      replacements.forEach(({ generatedBase, stableBase }) => {
        value = value.split(generatedBase).join(stableBase);
      });

      if (value !== attribute.value) {
        element.setAttribute(attribute.name, value);
      }
    });
  });
}

function expectStableSnapshot(root: HTMLElement, hint: string): void {
  const snapshotRoot = root.cloneNode(true) as HTMLElement;

  normalizeGeneratedDateRangePickerIds(snapshotRoot);

  expect(snapshotRoot).toMatchSnapshot(hint);
}

async function clickInMonthCell(page: SpecPage, index: number): Promise<void> {
  const cells = inMonthCells(rootOf(page));

  const cell = cells[index];

  if (!cell) {
    throw new Error(`Missing in-month cell at ${index}.`);
  }

  cell.click();

  await flush(page);
}

async function selectRange(page: SpecPage, startIndex = 1, endIndex = 7): Promise<void> {
  await clickInMonthCell(page, startIndex);

  await clickInMonthCell(page, endIndex);
}

describe('plumage-date-range-picker-component rendering', () => {
  test('renders Plumage wrapper and input-group structure', async () => {
    const page = await createPage();

    const root = rootOf(page);

    expect(root.querySelector('.stencil-component')).toBeTruthy();

    expect(root.querySelector('.form-input-group')).toBeTruthy();

    expect(root.querySelector('.input-group.nowrap')).toBeTruthy();

    expect(root.querySelector('.b-underline')).toBeTruthy();

    expect(root.querySelector('.b-focus')).toBeTruthy();

    expectStableSnapshot(root, 'plumage-input-mode-default');
  });

  test('renders input mode by default', async () => {
    const page = await createPage();

    const root = rootOf(page);

    expect(getInput(root)).toBeTruthy();

    expect(root.querySelector('.input-group .calendar-button')).toBeTruthy();

    expect(getDropdown(root)).toBeTruthy();

    expect(getOkButtonLabel(root)).toBe('Close');
  });

  test('renders two accessible calendars', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const calendars = getCalendars(root);

    expect(calendars).toHaveLength(2);

    calendars.forEach(calendar => {
      const caption = queryRequired<HTMLElement>(calendar, '.calendar-grid-caption');

      const weekdays = queryRequired<HTMLElement>(calendar, '.calendar-grid-weekdays');

      const grid = queryRequired<HTMLElement>(calendar, '.calendar-grid');

      expect(caption.id).toBeTruthy();

      expect(grid.getAttribute('role')).toBe('grid');

      expect(grid.getAttribute('aria-labelledby')).toBe(caption.id);

      expect(weekdays.getAttribute('role')).toBe('row');

      expect(weekdays.querySelectorAll('[role="columnheader"]')).toHaveLength(7);
    });

    expectStableSnapshot(root, 'range-picker-default');
  });

  test('renders six rows and 42 grid cells per calendar', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const grids = Array.from(root.querySelectorAll('.calendar-grid')) as HTMLElement[];

    expect(grids).toHaveLength(2);

    grids.forEach(grid => {
      expect(grid.querySelectorAll('[role="row"]')).toHaveLength(6);

      expect(grid.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    });
  });

  test('range-picker mode renders picker directly without input or dropdown', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    expect(root.querySelector('.date-picker')).toBeTruthy();

    expect(root.querySelector('input.form-control')).toBeNull();

    expect(root.querySelector('.dropdown')).toBeNull();

    expect(root.querySelector('.ok-button')).toBeNull();
  });

  test('uses custom input id and placeholder', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              input-id="custom-date-input"
              placeholder="Choose a reporting period"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const input = getInput(root);

    const label = queryRequired<HTMLLabelElement>(root, 'label.form-control-label');

    expect(input.id).toBe('custom-date-input');

    expect(input.placeholder).toBe('Choose a reporting period');

    expect(label.htmlFor).toBe('custom-date-input');

    expectStableSnapshot(root, 'custom-input-id-placeholder');
  });

  test('generates selector-safe unique ARIA ids', async () => {
    const page = await createPage(`
            <div>
              <plumage-date-range-picker-component
                input-id="date picker ! one"
              ></plumage-date-range-picker-component>

              <plumage-date-range-picker-component
                input-id="date picker ! one"
              ></plumage-date-range-picker-component>
            </div>
          `);

    const components = Array.from(page.body.querySelectorAll('plumage-date-range-picker-component')) as HTMLElement[];

    expect(components).toHaveLength(2);

    const ids = components.map(component => {
      const dialog = queryRequired<HTMLElement>(component, '.dropdown-content');

      return dialog.getAttribute('aria-labelledby');
    });

    expect(ids[0]).toBeTruthy();

    expect(ids[1]).toBeTruthy();

    expect(ids[0]).not.toBe(ids[1]);

    ids.forEach(id => {
      expect(id).toMatch(/^[A-Za-z_][\w:.-]*$/);
    });
  });

  test('does not require CSS.escape for generated ids', async () => {
    const globalObject = globalThis as {
      CSS?: typeof CSS;
    };

    const originalCss = globalObject.CSS;

    try {
      Object.defineProperty(globalObject, 'CSS', {
        configurable: true,
        writable: true,
        value: undefined,
      });

      const page = await createPage(`
              <plumage-date-range-picker-component
                input-id="unsafe id !"
              ></plumage-date-range-picker-component>
            `);

      const root = rootOf(page);

      const dialog = queryRequired<HTMLElement>(root, '.dropdown-content');

      const labelledBy = dialog.getAttribute('aria-labelledby');

      expect(labelledBy).toBeTruthy();

      expect(root.querySelector(`#${labelledBy}`)).toBeTruthy();
    } finally {
      Object.defineProperty(globalObject, 'CSS', {
        configurable: true,
        writable: true,
        value: originalCss,
      });
    }
  });
});

describe('plumage-date-range-picker-component range selection', () => {
  test('selects a start date', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const cells = inMonthCells(root);

    const expected = cells[1].getAttribute('data-date');

    await clickInMonthCell(page, 1);

    expect(getStartLabel(root)).toBe(expected);

    expect(getEndLabel(root)).toBe('N/A');
  });

  test('selects and marks a complete range', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    await selectRange(page, 0, 10);

    expect(getStartLabel(root)).not.toBe('N/A');

    expect(getEndLabel(root)).not.toBe('N/A');

    expect(root.querySelectorAll('.calendar-grid-item.selected-range').length).toBeGreaterThan(0);

    expect(root.querySelectorAll('.calendar-grid-item.selected-range-active')).toHaveLength(2);

    expectStableSnapshot(root, 'range-picker-complete-range');
  });

  test('starts a new range after a complete range', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    await selectRange(page, 1, 7);

    const cells = inMonthCells(root);

    const expected = cells[12].getAttribute('data-date');

    await clickInMonthCell(page, 12);

    expect(getStartLabel(root)).toBe(expected);

    expect(getEndLabel(root)).toBe('N/A');
  });

  test('moves start date when second selected date is earlier', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const cells = inMonthCells(root);

    const expected = cells[2].getAttribute('data-date');

    await clickInMonthCell(page, 8);

    await clickInMonthCell(page, 2);

    expect(getStartLabel(root)).toBe(expected);

    expect(getEndLabel(root)).toBe('N/A');
  });

  test('reset clears selected range and visual focus', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    await selectRange(page, 0, 10);

    queryRequired<HTMLButtonElement>(root, '.reset-btn').click();

    await flush(page);

    expect(getStartLabel(root)).toBe('N/A');

    expect(getEndLabel(root)).toBe('N/A');

    expect(root.querySelector('.calendar-grid-item span.focus')).toBeNull();

    expect(root.querySelector('.calendar-grid-item.selected-range')).toBeNull();
  });

  test('does not select previous-month or next-month cells', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const offMonthCell = root.querySelector('.calendar-grid-item.previous-month-day, .calendar-grid-item.next-month-day') as HTMLElement | null;

    if (!offMonthCell) {
      return;
    }

    offMonthCell.click();

    await flush(page);

    expect(getStartLabel(root)).toBe('N/A');

    expect(getEndLabel(root)).toBe('N/A');
  });
});

describe('plumage-date-range-picker-component keyboard navigation', () => {
  test('moves visual focus with arrow keys', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const wrapper = getCalendarWrapper(root);

    wrapper.focus();

    keyDownOn(wrapper, 'ArrowRight');

    await flush(page);

    const first = focusedCell(root);

    expect(first).toBeTruthy();

    const cells = inMonthCells(root);

    const firstIndex = cells.indexOf(first!);

    expect(firstIndex).toBeGreaterThanOrEqual(0);

    keyDownOn(wrapper, 'ArrowRight');

    await flush(page);

    expect(inMonthCells(root).indexOf(focusedCell(root)!)).toBe(firstIndex + 1);
  });

  test('selects focused date with Enter', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const wrapper = getCalendarWrapper(root);

    wrapper.focus();

    keyDownOn(wrapper, 'ArrowRight');

    await flush(page);

    const cell = focusedCell(root);

    expect(cell).toBeTruthy();

    const expected = cell!.getAttribute('data-date');

    keyDownOn(wrapper, 'Enter');

    await flush(page);

    expect(getStartLabel(root)).toBe(expected);

    expect(getEndLabel(root)).toBe('N/A');
  });
});

describe('plumage-date-range-picker-component display formats', () => {
  test('formats range labels as long dates', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
              show-long="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    await selectRange(page, 3, 6);

    expect(getStartLabel(root)).toMatch(/^\w+,\s\w+\s\d{1,2},\s\d{4}$/);

    expect(getEndLabel(root)).toMatch(/^\w+,\s\w+\s\d{1,2},\s\d{4}$/);

    expect(queryRequired<HTMLElement>(root, '.start-end-ranges').classList.contains('long')).toBe(true);
  });

  test('formats range labels as ISO timestamps', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
              show-iso="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    await selectRange(page, 4, 9);

    expect(getStartLabel(root)).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);

    expect(getEndLabel(root)).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
  });

  test('formats range labels as YYYY-MM-DD when showYmd is true', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
              show-ymd="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    await selectRange(page, 2, 8);

    expect(getStartLabel(root)).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    expect(getEndLabel(root)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('plumage-date-range-picker-component calendar selectors', () => {
  test('updates consecutive months from month and year selectors', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              range-picker="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const month = queryRequired<HTMLSelectElement>(root, 'select.months');

    const year = queryRequired<HTMLSelectElement>(root, 'select.years');

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

    const captions = Array.from(root.querySelectorAll('.calendar-grid-caption')).map(element => element.textContent?.trim());

    expect(captions).toEqual(['December 2028', 'January 2029']);
  });
});

describe('plumage-date-range-picker-component input mode', () => {
  test('opens and closes the dropdown', async () => {
    const page = await createPage();

    const root = rootOf(page);

    let toggle = queryRequired<HTMLButtonElement>(root, '.input-group .calendar-button');

    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();

    await flush(page);

    expect(getDropdown(root).classList.contains('open')).toBe(true);

    toggle = queryRequired<HTMLButtonElement>(root, '.input-group .calendar-button');

    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();

    await flush(page);

    expect(getDropdown(root).classList.contains('open')).toBe(false);
  });

  test('changes Close to OK after complete range selection', async () => {
    const page = await createPage();

    const root = rootOf(page);

    expect(getOkButtonLabel(root)).toBe('Close');

    await clickInMonthCell(page, 1);

    expect(getOkButtonLabel(root)).toBe('Close');

    await clickInMonthCell(page, 7);

    expect(getOkButtonLabel(root)).toBe('OK');
  });

  test('updates input after calendar range selection', async () => {
    const page = await createPage();

    const root = rootOf(page);

    await selectRange(page, 1, 7);

    expect(getInput(root).value).toBe(`${getStartLabel(root)} - ${getEndLabel(root)}`);
  });

  test('emits date-range-updated when OK confirms range', async () => {
    const page = await createPage();

    const root = rootOf(page);

    const listener = jest.fn();

    root.addEventListener('date-range-updated', listener);

    await selectRange(page, 2, 9);

    const start = getStartLabel(root);

    const end = getEndLabel(root);

    getOkButton(root).click();

    await flush(page);

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

    expect(event.detail).toEqual({
      startDate: start,

      endDate: end,

      startDateIso: start,

      endDateIso: end,
    });
  });

  test('accepts and normalizes valid YYYY-MM-DD typed range', async () => {
    const page = await createPage();

    const root = rootOf(page);

    const listener = jest.fn();

    root.addEventListener('date-range-updated', listener);

    dispatchInput(getInput(root), '2026-01-10 - 2026-01-20');

    await flush(page);

    expect(getInput(root).value).toBe('2026-01-10-2026-01-20');

    expect(getStartLabel(root)).toBe('2026-01-10');

    expect(getEndLabel(root)).toBe('2026-01-20');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('accepts MM-DD-YYYY and emits ISO values', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              date-format="MM-DD-YYYY"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const listener = jest.fn();

    root.addEventListener('date-range-updated', listener);

    dispatchInput(getInput(root), '01-10-2026 - 01-20-2026');

    await flush(page);

    expect(getInput(root).value).toBe('01-10-2026-01-20-2026');

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

    expect(event.detail).toEqual({
      startDate: '01-10-2026',

      endDate: '01-20-2026',

      startDateIso: '2026-01-10',

      endDateIso: '2026-01-20',
    });
  });

  test('rejects invalid typed range syntax', async () => {
    const page = await createPage();

    const root = rootOf(page);

    dispatchInput(getInput(root), 'not a date range');

    await flush(page);

    expect(getInput(root).getAttribute('aria-invalid')).toBe('true');

    expect(queryRequired<HTMLElement>(root, '.invalid-feedback.validation').textContent).toContain('Invalid date range.');

    expectStableSnapshot(root, 'invalid-range');
  });

  test('rejects reversed typed range', async () => {
    const page = await createPage();

    const root = rootOf(page);

    dispatchInput(getInput(root), '2026-02-20 - 2026-02-10');

    await flush(page);

    expect(getInput(root).getAttribute('aria-invalid')).toBe('true');

    expect(queryRequired<HTMLElement>(root, '.invalid-feedback.validation').textContent?.trim()).toBe('Please enter a valid date range.');
  });

  test('clearing required input shows required validation', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              required="true"
              value="2026-06-01 - 2026-06-10"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    dispatchInput(getInput(root), '');

    await flush(page);

    expect(getInput(root).getAttribute('aria-invalid')).toBe('true');

    expect(queryRequired<HTMLElement>(root, '.invalid-feedback.validation').textContent?.trim()).toBe('This field is required.');
  });

  test('readOnly removes interactive calendar controls', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              read-only="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const input = getInput(root);

    expect(input.readOnly).toBe(true);

    expect(input.getAttribute('aria-readonly')).toBe('true');

    expect(root.querySelector('.input-group .calendar-button')).toBeNull();

    expect(root.querySelector('.clear-input-button')).toBeNull();

    expectStableSnapshot(root, 'readonly-input-mode');
  });

  test('disabled disables input and input-group calendar button', async () => {
    const page = await createPage(`
        <plumage-date-range-picker-component
          disabled="true"
        ></plumage-date-range-picker-component>
      `);

    const root = rootOf(page);

    const input = getInput(root);

    const inputGroup = queryRequired<HTMLElement>(root, '.input-group');

    const toggle = queryRequired<HTMLElement>(root, '.input-group .calendar-button');

    expect(input.disabled).toBe(true);

    expect(input.getAttribute('aria-disabled')).toBe('true');

    expect(inputGroup.classList.contains('disabled')).toBe(true);

    expect(toggle.hasAttribute('disabled')).toBe(true);

    expect(toggle.getAttribute('disabled')).not.toBeNull();

    expect(toggle.classList.contains('disabled')).toBe(true);

    expectStableSnapshot(root, 'disabled-input-mode');
  });

  test('supports custom regex-special separator', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              join-by=" | "
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    dispatchInput(getInput(root), '2026-08-01 | 2026-08-15');

    await flush(page);

    expect(getStartLabel(root)).toBe('2026-08-01');

    expect(getEndLabel(root)).toBe('2026-08-15');

    expect(getInput(root).value).toContain('|');
  });
});

describe('plumage-date-range-picker-component layout and accessibility', () => {
  test('renders responsive horizontal columns', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              form-layout="horizontal"
              label-cols="sm-4 md-3"
              input-cols="sm-8 md-9"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const label = queryRequired<HTMLLabelElement>(root, '.form-control-label');

    expect(label.className).toContain('col-sm-4');

    expect(label.className).toContain('col-md-3');

    const group = queryRequired<HTMLElement>(root, '.input-group');

    const inputColumn = group.parentElement as HTMLElement;

    expect(inputColumn.className).toContain('col-sm-8');

    expect(inputColumn.className).toContain('col-md-9');

    expectStableSnapshot(root, 'horizontal-responsive-layout');
  });

  test('horizontal hidden label uses full width input column', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              form-layout="horizontal"
              label-hidden="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const group = queryRequired<HTMLElement>(root, '.input-group');

    const inputColumn = group.parentElement as HTMLElement;

    expect(inputColumn.className).toContain('col-12');

    expect(getInput(root).getAttribute('aria-label')).toBe('Date Range Picker');

    expect(getInput(root).getAttribute('aria-labelledby')).toBeNull();
  });

  test('aria-describedby references existing elements', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              input-id="accessible-range"
              required="true"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const input = getInput(root);

    parseIdRefs(input.getAttribute('aria-describedby')).forEach(id => {
      expect(root.querySelector(`[id="${id}"]`)).toBeTruthy();
    });

    dispatchInput(input, '');

    await flush(page);

    parseIdRefs(getInput(root).getAttribute('aria-describedby')).forEach(id => {
      expect(root.querySelector(`[id="${id}"]`)).toBeTruthy();
    });
  });
});

describe('plumage-date-range-picker-component controlled values', () => {
  test('loads valid initial value', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              value="2026-03-05 - 2026-03-15"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    expect(getInput(root).value).toBe('2026-03-05 - 2026-03-15');

    expect(getStartLabel(root)).toBe('2026-03-05');

    expect(getEndLabel(root)).toBe('2026-03-15');

    expect(getOkButtonLabel(root)).toBe('OK');

    expectStableSnapshot(root, 'initial-controlled-range');
  });

  test('updates rendered range when value changes externally', async () => {
    const page = await createPage();

    const root = rootOf(page);

    const instance = page.rootInstance as ControlledInstance;

    instance.value = '2026-04-02 - 2026-04-09';

    await flush(page);

    expect(getInput(root).value).toBe('2026-04-02 - 2026-04-09');

    expect(getStartLabel(root)).toBe('2026-04-02');

    expect(getEndLabel(root)).toBe('2026-04-09');
  });

  test('externally clearing required value does not immediately invalidate', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              required="true"
              value="2026-07-10 - 2026-07-20"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const instance = page.rootInstance as ControlledInstance;

    instance.value = '';

    await flush(page);

    expect(instance.startDate).toBeNull();

    expect(instance.endDate).toBeNull();

    expect(instance.validation).toBe(false);

    expect(getInput(root).value).toBe('');

    expect(root.querySelector('.invalid-feedback')).toBeNull();
  });

  test('preserves last valid range when external value is reversed', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              value="2026-04-01 - 2026-04-10"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const instance = page.rootInstance as ControlledInstance;

    instance.value = '2026-05-10 - 2026-05-01';

    await flush(page);

    expect(instance.startDate?.toISOString().slice(0, 10)).toBe('2026-04-01');

    expect(instance.endDate?.toISOString().slice(0, 10)).toBe('2026-04-10');

    expect(getStartLabel(root)).toBe('2026-04-01');

    expect(getEndLabel(root)).toBe('2026-04-10');
  });

  test('accepts February 29 in leap year', async () => {
    const page = await createPage();

    const root = rootOf(page);

    const listener = jest.fn();

    root.addEventListener('date-range-updated', listener);

    dispatchInput(getInput(root), '2028-02-29 - 2028-03-05');

    await flush(page);

    expect(getStartLabel(root)).toBe('2028-02-29');

    expect(getEndLabel(root)).toBe('2028-03-05');

    expect(getInput(root).getAttribute('aria-invalid')).not.toBe('true');

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0][0] as CustomEvent<DateRangeUpdatedDetail>;

    expect(event.detail).toEqual({
      startDate: '2028-02-29',

      endDate: '2028-03-05',

      startDateIso: '2028-02-29',

      endDateIso: '2028-03-05',
    });
  });

  test('keeps calendars consecutive for same-month controlled range', async () => {
    const page = await createPage(`
            <plumage-date-range-picker-component
              value="2026-12-05 - 2026-12-20"
            ></plumage-date-range-picker-component>
          `);

    const root = rootOf(page);

    const instance = page.rootInstance as ControlledInstance;

    expect(instance.currentStartMonth).toBe(11);

    expect(instance.currentStartYear).toBe(2026);

    expect(instance.currentEndMonth).toBe(0);

    expect(instance.currentEndYear).toBe(2027);

    const captions = Array.from(root.querySelectorAll('.calendar-grid-caption')).map(element => element.textContent?.trim());

    expect(captions).toEqual(['December 2026', 'January 2027']);
  });
});
