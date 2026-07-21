// File: src/components/date-range-time-picker/date-range-time-picker-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';

const g: any = globalThis as any;

if (!g.CSS) g.CSS = {};

if (typeof g.CSS.escape !== 'function') {
  g.CSS.escape = (value: string) =>
    String(value ?? '').replace(
      /[^a-zA-Z0-9_-]/g,
      character => `\\${character}`,
    );
}

if (typeof (globalThis as any).window !== 'undefined') {
  const w: any = (globalThis as any).window;

  if (!w.CSS) w.CSS = g.CSS;
  if (typeof w.CSS.escape !== 'function') {
    w.CSS.escape = g.CSS.escape;
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

let originalRAF: typeof global.requestAnimationFrame;

beforeAll(() => {
  originalRAF = global.requestAnimationFrame;

  (global as any).requestAnimationFrame = (
    callback: FrameRequestCallback,
  ) => {
    callback(0 as any);
    return 0 as any;
  };
});

afterAll(() => {
  (global as any).requestAnimationFrame = originalRAF;
});

let activeEl: Element | null = null;

const originalFocus = HTMLElement.prototype.focus;
const docProto: any =
  Object.getPrototypeOf(document) || Document.prototype;

const existingActiveDescriptor =
  Object.getOwnPropertyDescriptor(docProto, 'activeElement') ??
  Object.getOwnPropertyDescriptor(document, 'activeElement');

beforeAll(() => {
  (HTMLElement.prototype as any).focus = function patchedFocus() {
    activeEl = this as Element;
  };

  Object.defineProperty(docProto, 'activeElement', {
    configurable: true,
    enumerable: true,
    get() {
      return activeEl ?? null;
    },
  });
});

afterAll(() => {
  (HTMLElement.prototype as any).focus = originalFocus;

  if (existingActiveDescriptor) {
    Object.defineProperty(
      docProto,
      'activeElement',
      existingActiveDescriptor,
    );
  } else {
    delete docProto.activeElement;
  }

  activeEl = null;
});

const flush = async (page: any) => {
  await page.waitForChanges();
};

const keyDownOn = (element: Element, key: string) => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
    }),
  );
};

const inMonthCells = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll(
      '.calendar-grid-item:not(.previous-month-day):not(.next-month-day)',
    ),
  ) as HTMLElement[];

const focusedCell = (root: HTMLElement) => {
  const span = root.querySelector(
    '.calendar-grid-item span.focus',
  ) as HTMLElement | null;

  return span ? (span.parentElement as HTMLElement) : null;
};

const getOpenDropdown = (root: HTMLElement) =>
  root.querySelector('.dropdown.open') as HTMLElement | null;

const getOkButton = (root: HTMLElement) =>
  root.querySelector(
    '.ok-button button',
  ) as HTMLButtonElement | null;

const getToggleButtons = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll('.calendar-button'),
  ) as HTMLButtonElement[];

const getMainInput = (root: HTMLElement) =>
  root.querySelector(
    'input.form-control',
  ) as HTMLInputElement | null;

const getTimeInputs = (root: HTMLElement) => {
  const inputs = Array.from(
    root.querySelectorAll('input.time-input'),
  ) as HTMLInputElement[];

  return {
    start: inputs[0] ?? null,
    end: inputs[1] ?? null,
  };
};

describe('date-range-time-picker-component (rangeTimePicker mode)', () => {
  test('renders and matches snapshot (initial)', async () => {
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
  });

  test('renders calendars with weekday row above grid (regression)', async () => {
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

    expect(children.indexOf(weekdays!)).toBeGreaterThanOrEqual(0);
    expect(children.indexOf(grid!)).toBeGreaterThanOrEqual(0);
    expect(children.indexOf(weekdays!)).toBeLessThan(
      children.indexOf(grid!),
    );
  });

  test('does not render OK/Close button in rangeTimePicker-only mode', async () => {
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

    expect(root.querySelector('.ok-button')).toBeNull();
  });

  test('renders start/end time inputs in rangeTimePicker-only mode', async () => {
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
  });

  test('arrow-key navigation moves by one day / one week without skipping', async () => {
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

    const cells0 = inMonthCells(root);
    const focusedCell0 = focusedCell(root);

    expect(focusedCell0).toBeTruthy();

    const index0 = cells0.indexOf(focusedCell0!);

    expect(index0).toBeGreaterThanOrEqual(0);

    keyDownOn(wrapper!, 'ArrowRight');
    await flush(page);

    const index1 = inMonthCells(root).indexOf(focusedCell(root)!);

    expect(index1).toBe(index0 + 1);

    keyDownOn(wrapper!, 'ArrowDown');
    await flush(page);

    const cells2 = inMonthCells(root);
    const index2 = cells2.indexOf(focusedCell(root)!);

    expect(index2).toBe(
      Math.min(index1 + 7, cells2.length - 1),
    );

    keyDownOn(wrapper!, 'ArrowUp');
    await flush(page);

    const index3 = inMonthCells(root).indexOf(
      focusedCell(root)!,
    );

    expect(index3).toBe(Math.max(index2 - 7, 0));

    keyDownOn(wrapper!, 'ArrowLeft');
    await flush(page);

    const index4 = inMonthCells(root).indexOf(
      focusedCell(root)!,
    );

    expect(index4).toBe(Math.max(index3 - 1, 0));
  });

  test('click selects a range, reset clears selection and removes visual focus', async () => {
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

    const startLabel = root.querySelector(
      '.start-date',
    ) as HTMLElement | null;

    const endLabel = root.querySelector(
      '.end-date',
    ) as HTMLElement | null;

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
      root.querySelector('.calendar-grid-item span.focus'),
    ).toBeNull();
  });

  test('show-long formats selected labels as long dates', async () => {
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

    const startLabel = root.querySelector(
      '.start-date',
    ) as HTMLElement | null;

    const endLabel = root.querySelector(
      '.end-date',
    ) as HTMLElement | null;

    expect(startLabel).toBeTruthy();
    expect(endLabel).toBeTruthy();

    expect(startLabel!.textContent || '').toMatch(
      /\w+,\s\w+\s\d{1,2},\s\d{4}/,
    );

    expect(endLabel!.textContent || '').toMatch(
      /\w+,\s\w+\s\d{1,2},\s\d{4}/,
    );
  });

  test('clearing a time field shows warning state without requiring visible warning text', async () => {
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

    const okButton = root.querySelector(
      '.ok-button button',
    ) as HTMLButtonElement | null;

    if (okButton) {
      expect(okButton.disabled).toBe(true);
    }
  });
});

describe('date-range-time-picker-component (input-group mode)', () => {
  test('renders and matches snapshot (input-group mode)', async () => {
    const page = await newSpecPage({
      components: [DateRangeTimePickerComponent],
      html: `
        <date-range-time-picker-component>
        </date-range-time-picker-component>
      `,
    });

    await flush(page);

    expect(page.root).toMatchSnapshot();
  });

  test('renders OK/Close button and defaults to Close', async () => {
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
    expect(okButton!.textContent?.trim()).toBe('Close');
  });

  test('opens dropdown from calendar toggle', async () => {
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
  });

  test('button changes to OK only after full range selection with default valid times', async () => {
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
    expect(okButton!.textContent?.trim()).toBe('Close');

    cells[0].click();
    await flush(page);

    expect(okButton!.textContent?.trim()).toBe('Close');

    cells[8].click();
    await flush(page);

    expect(okButton!.textContent?.trim()).toBe('OK');
  });

  test('clicking Close button closes dropdown without needing a full selection', async () => {
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

    const dropdown = getOpenDropdown(root);

    expect(dropdown).toBeTruthy();

    const okButton = getOkButton(root);

    expect(okButton).toBeTruthy();
    expect(okButton!.textContent?.trim()).toBe('Close');

    okButton!.click();
    await flush(page);

    expect(getOpenDropdown(root)).toBeNull();
  });

  test('clicking OK closes dropdown after full selection', async () => {
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
    expect(okButton!.textContent?.trim()).toBe('OK');

    okButton!.click();
    await flush(page);

    expect(getOpenDropdown(root)).toBeNull();
  });

  test('clear button resets selection, clears input, and returns button label to Close', async () => {
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
    expect(okButton!.textContent?.trim()).toBe('OK');

    const input = getMainInput(root);

    expect(input).toBeTruthy();

    okButton!.click();
    await flush(page);

    expect((input!.value || '').trim().length).toBeGreaterThan(0);

    const clearButton = root.querySelector(
      '.clear-input-button',
    ) as HTMLButtonElement | null;

    expect(clearButton).toBeTruthy();

    clearButton!.click();
    await flush(page);

    const startLabel = root.querySelector(
      '.start-date',
    ) as HTMLElement | null;

    const endLabel = root.querySelector(
      '.end-date',
    ) as HTMLElement | null;

    expect(input!.value).toBe('');
    expect(startLabel!.textContent).toBe('N/A');
    expect(endLabel!.textContent).toBe('N/A');
    expect(okButton!.textContent?.trim()).toBe('Close');
  });

  test('invalid time keeps button label at Close', async () => {
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
    expect(okButton!.textContent?.trim()).toBe('OK');

    start!.value = '99:99';
    start!.dispatchEvent(
      new Event('input', {
        bubbles: true,
      }),
    );

    await flush(page);

    expect(okButton!.textContent?.trim()).toBe('Close');
  });

  test('main input and toggle buttons are disabled when disabled=true', async () => {
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
    expect(input!.hasAttribute('disabled')).toBe(true);

    expect(buttons.length).toBeGreaterThan(0);

    buttons.forEach(button => {
      expect(button.hasAttribute('disabled')).toBe(true);
    });
  });

  test('readOnly makes the input read-only and removes interactive controls', async () => {
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
    expect(input!.hasAttribute('disabled')).toBe(false);
    expect(input!.readOnly).toBe(true);
    expect(input!.hasAttribute('readonly')).toBe(true);
    expect(input!.getAttribute('aria-readonly')).toBe('true');

    expect(getToggleButtons(root)).toHaveLength(0);
    expect(root.querySelector('.clear-input-button')).toBeNull();

    const inputGroup = root.querySelector(
      '.input-group',
    ) as HTMLElement | null;

    expect(inputGroup).toBeTruthy();
    expect(inputGroup!.classList.contains('read-only')).toBe(true);
  });
});
