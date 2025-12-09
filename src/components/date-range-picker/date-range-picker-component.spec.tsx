// File: src/components/datepicker/date-range-picker-componet.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { DateRangePickerComponent } from './date-range-picker-component';

// ---- Popper mock ----
jest.mock('@popperjs/core', () => ({
  createPopper: () => ({ destroy: jest.fn() }),
}));

jest.setTimeout(60000);

// ---- requestAnimationFrame -> immediate ----
let originalRAF: typeof global.requestAnimationFrame;
beforeAll(() => {
  originalRAF = global.requestAnimationFrame;
  (global as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(0 as any);
    return 0 as any;
  };
});
afterAll(() => {
  (global as any).requestAnimationFrame = originalRAF;
});

// ---- Focus + activeElement patch (prototype-safe) ----
let _activeEl: Element | null = null;

const docProto: any =
  Object.getPrototypeOf(document) || (document as any).__proto__ || Document.prototype;
const existingActiveDescriptor =
  (Object.getOwnPropertyDescriptor(docProto, 'activeElement') as PropertyDescriptor | undefined) ??
  (Object.getOwnPropertyDescriptor(document, 'activeElement') as PropertyDescriptor | undefined);

const originalFocus = HTMLElement.prototype.focus;

beforeAll(() => {
  (HTMLElement.prototype as any).focus = function patchedFocus() {
    _activeEl = this as Element;
  };

  Object.defineProperty(docProto, 'activeElement', {
    configurable: true,
    enumerable: true,
    get() {
      return _activeEl ?? null;
    },
  });
});

afterAll(() => {
  (HTMLElement.prototype as any).focus = originalFocus;
  if (existingActiveDescriptor) {
    Object.defineProperty(docProto, 'activeElement', existingActiveDescriptor);
  } else {
    delete (docProto as any).activeElement;
  }
  _activeEl = null;
});

// ---- helpers ----
const flush = async (page: any) => {
  await page.waitForChanges();
};

const keyDownOn = (el: Element, key: string) => {
  const evt = new KeyboardEvent('keydown', { key, bubbles: true });
  el.dispatchEvent(evt);
};

describe('date-range-picker-component (rangePicker mode)', () => {
  test('renders and matches snapshot (initial)', async () => {
    const page = await newSpecPage({
      components: [DateRangePickerComponent],
      html: `<date-range-picker-component rangePicker="true"></date-range-picker-component>`,
    });
    await flush(page);
    expect(page.root).toMatchSnapshot();
  });

  test('arrow-key navigation moves by one day (no skipping)', async () => {
    const page = await newSpecPage({
      components: [DateRangePickerComponent],
      html: `<date-range-picker-component rangePicker="true"></date-range-picker-component>`,
    });
    await flush(page);

    const root = page.root as HTMLElement;
    const wrapper = root.querySelector('.calendar-wrapper') as HTMLElement;
    expect(wrapper).toBeTruthy();

    const cells = () =>
      Array.from(
        root.querySelectorAll('.calendar-grid-item:not(.previous-month-day):not(.next-month-day)'),
      ) as HTMLElement[];

    const focusedCell = () => {
      const span = root.querySelector('.calendar-grid-item span.focus') as HTMLElement | null;
      return span ? (span.parentElement as HTMLElement) : null;
    };

    const focusedIndex = () => {
      const list = cells();
      const fc = focusedCell();
      return fc ? list.indexOf(fc) : -1;
    };

    // 1) Seed: focus wrapper and press ArrowRight once.
    wrapper.setAttribute('tabindex', '0');
    wrapper.focus();
    keyDownOn(wrapper, 'ArrowRight'); // wrapper listener activates first cell & applies +1
    await flush(page);

    // Sanity: we should have a focused cell now
    expect(focusedCell()).toBeTruthy();
    let idx0 = focusedIndex();
    expect(idx0).toBeGreaterThanOrEqual(0);

    // 2) Press ArrowRight again on WRAPPER (do NOT refocus the cell in-between)
    keyDownOn(wrapper, 'ArrowRight');
    await flush(page);
    let idx1 = focusedIndex();
    expect(idx1).toBe(idx0 + 1); // move +1

    // 3) ArrowDown = +7 (clamped) on WRAPPER
    keyDownOn(wrapper, 'ArrowDown');
    await flush(page);
    const idxDown = focusedIndex();
    expect(idxDown).toBe(Math.min(idx1 + 7, cells().length - 1));

    // 4) ArrowUp = -7 (clamped) on WRAPPER
    keyDownOn(wrapper, 'ArrowUp');
    await flush(page);
    const idxUp = focusedIndex();
    expect(idxUp).toBe(Math.max(idxDown - 7, 0));

    // 5) ArrowLeft = -1 (clamped) on WRAPPER
    keyDownOn(wrapper, 'ArrowLeft');
    await flush(page);
    const idxLeft = focusedIndex();
    expect(idxLeft).toBe(Math.max(idxUp - 1, 0));
  });

  test('click selects a range, reset clears selection and removes any .focus', async () => {
    const page = await newSpecPage({
      components: [DateRangePickerComponent],
      html: `<date-range-picker-component rangePicker="true"></date-range-picker-component>`,
    });
    await flush(page);

    const root = page.root as HTMLElement;

    const inMonthCells = Array.from(
      root.querySelectorAll('.calendar-grid-item:not(.previous-month-day):not(.next-month-day)'),
    ) as HTMLElement[];

    const startCell = inMonthCells[0];
    const endCell = inMonthCells[10];

    startCell.click();
    await flush(page);
    endCell.click();
    await flush(page);

    const startLabel = root.querySelector('.start-date') as HTMLElement;
    const endLabel = root.querySelector('.end-date') as HTMLElement;
    expect(startLabel.textContent).not.toBe('N/A');
    expect(endLabel.textContent).not.toBe('N/A');

    const resetBtn = root.querySelector('.reset-btn') as HTMLButtonElement;
    resetBtn.click();
    await flush(page);

    expect(startLabel.textContent).toBe('N/A');
    expect(endLabel.textContent).toBe('N/A');
    expect(root.querySelector('.calendar-grid-item span.focus')).toBeNull();
  });

  test('output formatting flags (showLong) change labels', async () => {
    const page = await newSpecPage({
      components: [DateRangePickerComponent],
      html: `<date-range-picker-component rangePicker="true" show-long="true"></date-range-picker-component>`,
    });
    await flush(page);

    const root = page.root as HTMLElement;
    const inMonthCells = Array.from(
      root.querySelectorAll('.calendar-grid-item:not(.previous-month-day):not(.next-month-day)'),
    ) as HTMLElement[];

    inMonthCells[3].click();
    await flush(page);
    inMonthCells[6].click();
    await flush(page);

    const startLabel = root.querySelector('.start-date') as HTMLElement;
    const endLabel = root.querySelector('.end-date') as HTMLElement;

    expect(startLabel.textContent).toMatch(/\w+,\s\w+\s\d{1,2},\s\d{4}/);
    expect(endLabel.textContent).toMatch(/\w+,\s\w+\s\d{1,2},\s\d{4}/);
  });

  test('final snapshot (input-group mode) still renders correctly with dropdown wrapper', async () => {
    const page = await newSpecPage({
      components: [DateRangePickerComponent],
      html: `<date-range-picker-component></date-range-picker-component>`,
    });
    await flush(page);
    expect(page.root).toMatchSnapshot();
  });
});
