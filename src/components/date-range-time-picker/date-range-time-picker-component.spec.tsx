import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { DateRangeTimePickerComponent } from './date-range-time-picker-component';


// ---- Mock Popper (no-op) ----
jest.mock('@popperjs/core', () => ({
  createPopper: jest.fn(() => ({
    destroy: jest.fn(),
    update: jest.fn(),
    state: {},
  })),
}));

// ---- Freeze time so snapshots & calendars are stable ----
// We'll pretend "today" is Jan 15, 2025 (UTC).
const FIXED_NOW = new Date(Date.UTC(2025, 0, 15, 12, 0, 0));
const RealDate = Date;

beforeAll(() => {
  // Minimal Date shim that preserves Date.UTC/parse and new Date(args)
  // but returns FIXED_NOW for zero-arg constructor / Date.now().
  // @ts-ignore
  global.Date = class extends RealDate {
    constructor(...args: any[]) {
      if (args.length === 0) return new RealDate(FIXED_NOW) as any;
      return new RealDate(...args) as any;
    }
    static now() {
      return FIXED_NOW.getTime();
    }
    static UTC(...args: any[]) {
      return RealDate.UTC(...args);
    }
    static parse(str: string) {
      return RealDate.parse(str);
    }
  };
});

afterAll(() => {
  // @ts-ignore
  global.Date = RealDate;
});

const queryByDataDate = (root: HTMLElement, ymd: string) =>
  root.querySelector(`.calendar-grid-item[data-date="${ymd}"]`) as HTMLElement;

const getExternalInput = (root: HTMLElement) =>
  root.querySelector('.drp-input-field input.form-control') as HTMLInputElement;

const getStartTimeInput = (root: HTMLElement) =>
  root.querySelector('input.time-input[data-type="start"]') as HTMLInputElement;

const getEndTimeInput = (root: HTMLElement) =>
  root.querySelector('input.time-input[data-type="end"]') as HTMLInputElement;

describe('<date-range-time-picker-component>', () => {
  test('renders picker-only (rangeTimePicker=true) and does NOT have external input [snapshot]', async () => {
    const page = await newSpecPage({
      components: [DateRangeTimePickerComponent],
      template: () => (
        <date-range-time-picker-component
          rangeTimePicker={true}
          isTwentyFourHourFormat={true}
          showDuration={true}
        />
      ),
    });

    // No external input in picker-only mode
    expect(getExternalInput(page.root as HTMLElement)).toBeNull();

    // Snapshot of initial DOM in picker-only layout
    expect(page.root).toMatchInlineSnapshot(`
<date-range-time-picker-component>
  <div class="date-picker">
    <div aria-label="Date Range Picker" class="range-picker-wrapper" role="region">
      <div aria-label="Navigation Controls" class="mb-1 range-picker-nav">
        <button aria-label="Previous Month" class="btn-outline-secondary range-picker-nav-btn">
          <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c-12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
          </svg>
        </button>
        <div class="selectors">
          <label class="sr-only visually-hidden" htmlfor="months" id="monthSelectField">
            Select Month
          </label>
          <select aria-label="Select Month" aria-labelledby="monthSelectField" class="form-control form-select months select-sm" id="months" role="listbox">
            <option selected="" value="0">
              January
            </option>
            <option value="1">
              February
            </option>
            <option value="2">
              March
            </option>
            <option value="3">
              April
            </option>
            <option value="4">
              May
            </option>
            <option value="5">
              June
            </option>
            <option value="6">
              July
            </option>
            <option value="7">
              August
            </option>
            <option value="8">
              September
            </option>
            <option value="9">
              October
            </option>
            <option value="10">
              November
            </option>
            <option value="11">
              December
            </option>
          </select>
          <label class="sr-only visually-hidden" htmlfor="year" id="yearSelectField">
            Select Year
          </label>
          <select aria-label="Select Year" aria-labelledby="yearSelectField" class="form-control form-select select-sm years" id="year" role="listbox">
            <option value="2014">
              2014
            </option>
            <option value="2015">
              2015
            </option>
            <option value="2016">
              2016
            </option>
            <option value="2017">
              2017
            </option>
            <option value="2018">
              2018
            </option>
            <option value="2019">
              2019
            </option>
            <option value="2020">
              2020
            </option>
            <option value="2021">
              2021
            </option>
            <option value="2022">
              2022
            </option>
            <option value="2023">
              2023
            </option>
            <option value="2024">
              2024
            </option>
            <option selected="" value="2025">
              2025
            </option>
            <option value="2026">
              2026
            </option>
            <option value="2027">
              2027
            </option>
            <option value="2028">
              2028
            </option>
            <option value="2029">
              2029
            </option>
            <option value="2030">
              2030
            </option>
            <option value="2031">
              2031
            </option>
            <option value="2032">
              2032
            </option>
            <option value="2033">
              2033
            </option>
            <option value="2034">
              2034
            </option>
          </select>
          <button aria-label="Reset Calendar" class="reset-btn">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"></path>
            </svg>
          </button>
        </div>
        <button aria-label="Next Month" class="btn-outline-secondary range-picker-nav-btn">
          <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s-32.8-12.5 45.3 0l160 160z"></path>
          </svg>
        </button>
      </div>
      <div class="range-picker">
        <div aria-label="Calendars" class="calendar-wrapper" role="application" tabindex="0">
          <div aria-label="Calendar for January 2025" aria-roledescription="Calendar" class="calendar dp-calendar form-control h-auto pt-2 text-center" role="grid" tabindex="0">
            <div aria-atomic="true" aria-live="polite" class="calendar-grid-caption font-weight-bold text-center" id="calendar-grid-caption">
              January 2025
            </div>
            <div aria-hidden="true" class="calendar-grid-weekdays" role="row">
              <small aria-label="Sunday" class="calendar-grid-day col" role="columnheader" title="Sunday">
                Sun
              </small>
              <small aria-label="Monday" class="calendar-grid-day col" role="columnheader" title="Monday">
                Mon
              </small>
              <small aria-label="Tuesday" class="calendar-grid-day col" role="columnheader" title="Tuesday">
                Tue
              </small>
              <small aria-label="Wednesday" class="calendar-grid-day col" role="columnheader" title="Wednesday">
                Wed
              </small>
              <small aria-label="Thursday" class="calendar-grid-day col" role="columnheader" title="Thursday">
                Thu
              </small>
              <small aria-label="Friday" class="calendar-grid-day col" role="columnheader" title="Friday">
                Fri
              </small>
              <small aria-label="Saturday" class="calendar-grid-day col" role="columnheader" title="Saturday">
                Sat
              </small>
            </div>
            <div class="calendar-grid" role="grid">
              <div aria-label="December 29, 2024" class="calendar-grid-item previous-month-day" data-date="2024-12-29" data-day="29" data-month="12" data-year="2024" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  29
                </span>
              </div>
              <div aria-label="December 30, 2024" class="calendar-grid-item previous-month-day" data-date="2024-12-30" data-day="30" data-month="12" data-year="2024" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  30
                </span>
              </div>
              <div aria-label="December 31, 2024" class="calendar-grid-item previous-month-day" data-date="2024-12-31" data-day="31" data-month="12" data-year="2024" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  31
                </span>
              </div>
              <div aria-label="January 1, 2025" class="calendar-grid-item csm-first-day" data-date="2025-01-01" data-day="1" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  1
                </span>
              </div>
              <div aria-label="January 2, 2025" class="calendar-grid-item" data-date="2025-01-02" data-day="2" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  2
                </span>
              </div>
              <div aria-label="January 3, 2025" class="calendar-grid-item" data-date="2025-01-03" data-day="3" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  3
                </span>
              </div>
              <div aria-label="January 4, 2025" class="calendar-grid-item" data-date="2025-01-04" data-day="4" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  4
                </span>
              </div>
              <div aria-label="January 5, 2025" class="calendar-grid-item" data-date="2025-01-05" data-day="5" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  5
                </span>
              </div>
              <div aria-label="January 6, 2025" class="calendar-grid-item" data-date="2025-01-06" data-day="6" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  6
                </span>
              </div>
              <div aria-label="January 7, 2025" class="calendar-grid-item" data-date="2025-01-07" data-day="7" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  7
                </span>
              </div>
              <div aria-label="January 8, 2025" class="calendar-grid-item" data-date="2025-01-08" data-day="8" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  8
                </span>
              </div>
              <div aria-label="January 9, 2025" class="calendar-grid-item" data-date="2025-01-09" data-day="9" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  9
                </span>
              </div>
              <div aria-label="January 10, 2025" class="calendar-grid-item" data-date="2025-01-10" data-day="10" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  10
                </span>
              </div>
              <div aria-label="January 11, 2025" class="calendar-grid-item" data-date="2025-01-11" data-day="11" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  11
                </span>
              </div>
              <div aria-label="January 12, 2025" class="calendar-grid-item" data-date="2025-01-12" data-day="12" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  12
                </span>
              </div>
              <div aria-label="January 13, 2025" class="calendar-grid-item" data-date="2025-01-13" data-day="13" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  13
                </span>
              </div>
              <div aria-label="January 14, 2025" class="calendar-grid-item" data-date="2025-01-14" data-day="14" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  14
                </span>
              </div>
              <div aria-label="January 15, 2025" class="calendar-grid-item" data-date="2025-01-15" data-day="15" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light current-day font-weight-bold rounded-circle text-dark text-nowrap">
                  15
                </span>
              </div>
              <div aria-label="January 16, 2025" class="calendar-grid-item" data-date="2025-01-16" data-day="16" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  16
                </span>
              </div>
              <div aria-label="January 17, 2025" class="calendar-grid-item" data-date="2025-01-17" data-day="17" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  17
                </span>
              </div>
              <div aria-label="January 18, 2025" class="calendar-grid-item" data-date="2025-01-18" data-day="18" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  18
                </span>
              </div>
              <div aria-label="January 19, 2025" class="calendar-grid-item" data-date="2025-01-19" data-day="19" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  19
                </span>
              </div>
              <div aria-label="January 20, 2025" class="calendar-grid-item" data-date="2025-01-20" data-day="20" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  20
                </span>
              </div>
              <div aria-label="January 21, 2025" class="calendar-grid-item" data-date="2025-01-21" data-day="21" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  21
                </span>
              </div>
              <div aria-label="January 22, 2025" class="calendar-grid-item" data-date="2025-01-22" data-day="22" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  22
                </span>
              </div>
              <div aria-label="January 23, 2025" class="calendar-grid-item" data-date="2025-01-23" data-day="23" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  23
                </span>
              </div>
              <div aria-label="January 24, 2025" class="calendar-grid-item" data-date="2025-01-24" data-day="24" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  24
                </span>
              </div>
              <div aria-label="January 25, 2025" class="calendar-grid-item" data-date="2025-01-25" data-day="25" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  25
                </span>
              </div>
              <div aria-label="January 26, 2025" class="calendar-grid-item" data-date="2025-01-26" data-day="26" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  26
                </span>
              </div>
              <div aria-label="January 27, 2025" class="calendar-grid-item" data-date="2025-01-27" data-day="27" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  27
                </span>
              </div>
              <div aria-label="January 28, 2025" class="calendar-grid-item" data-date="2025-01-28" data-day="28" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  28
                </span>
              </div>
              <div aria-label="January 29, 2025" class="calendar-grid-item" data-date="2025-01-29" data-day="29" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  29
                </span>
              </div>
              <div aria-label="January 30, 2025" class="calendar-grid-item" data-date="2025-01-30" data-day="30" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  30
                </span>
              </div>
              <div aria-label="January 31, 2025" class="calendar-grid-item csm-last-day" data-date="2025-01-31" data-day="31" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  31
                </span>
              </div>
              <div aria-label="February 1, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-01" data-day="1" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  1
                </span>
              </div>
              <div aria-label="February 2, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-02" data-day="2" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  2
                </span>
              </div>
              <div aria-label="February 3, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-03" data-day="3" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  3
                </span>
              </div>
              <div aria-label="February 4, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-04" data-day="4" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  4
                </span>
              </div>
              <div aria-label="February 5, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-05" data-day="5" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  5
                </span>
              </div>
              <div aria-label="February 6, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-06" data-day="6" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  6
                </span>
              </div>
              <div aria-label="February 7, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-07" data-day="7" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  7
                </span>
              </div>
              <div aria-label="February 8, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-08" data-day="8" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  8
                </span>
              </div>
            </div>
          </div>
          <div aria-label="Calendar for February 2025" aria-roledescription="Calendar" class="calendar dp-calendar form-control h-auto pt-2 text-center" role="grid" tabindex="0">
            <div aria-atomic="true" aria-live="polite" class="calendar-grid-caption font-weight-bold text-center" id="calendar-grid-caption">
              February 2025
            </div>
            <div aria-hidden="true" class="calendar-grid-weekdays" role="row">
              <small aria-label="Sunday" class="calendar-grid-day col" role="columnheader" title="Sunday">
                Sun
              </small>
              <small aria-label="Monday" class="calendar-grid-day col" role="columnheader" title="Monday">
                Mon
              </small>
              <small aria-label="Tuesday" class="calendar-grid-day col" role="columnheader" title="Tuesday">
                Tue
              </small>
              <small aria-label="Wednesday" class="calendar-grid-day col" role="columnheader" title="Wednesday">
                Wed
              </small>
              <small aria-label="Thursday" class="calendar-grid-day col" role="columnheader" title="Thursday">
                Thu
              </small>
              <small aria-label="Friday" class="calendar-grid-day col" role="columnheader" title="Friday">
                Fri
              </small>
              <small aria-label="Saturday" class="calendar-grid-day col" role="columnheader" title="Saturday">
                Sat
              </small>
            </div>
            <div class="calendar-grid" role="grid">
              <div aria-label="January 26, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-26" data-day="26" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  26
                </span>
              </div>
              <div aria-label="January 27, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-27" data-day="27" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  27
                </span>
              </div>
              <div aria-label="January 28, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-28" data-day="28" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  28
                </span>
              </div>
              <div aria-label="January 29, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-29" data-day="29" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  29
                </span>
              </div>
              <div aria-label="January 30, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-30" data-day="30" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  30
                </span>
              </div>
              <div aria-label="January 31, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-31" data-day="31" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  31
                </span>
              </div>
              <div aria-label="February 1, 2025" class="calendar-grid-item cem-first-day" data-date="2025-02-01" data-day="1" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  1
                </span>
              </div>
              <div aria-label="February 2, 2025" class="calendar-grid-item" data-date="2025-02-02" data-day="2" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  2
                </span>
              </div>
              <div aria-label="February 3, 2025" class="calendar-grid-item" data-date="2025-02-03" data-day="3" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  3
                </span>
              </div>
              <div aria-label="February 4, 2025" class="calendar-grid-item" data-date="2025-02-04" data-day="4" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  4
                </span>
              </div>
              <div aria-label="February 5, 2025" class="calendar-grid-item" data-date="2025-02-05" data-day="5" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  5
                </span>
              </div>
              <div aria-label="February 6, 2025" class="calendar-grid-item" data-date="2025-02-06" data-day="6" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  6
                </span>
              </div>
              <div aria-label="February 7, 2025" class="calendar-grid-item" data-date="2025-02-07" data-day="7" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  7
                </span>
              </div>
              <div aria-label="February 8, 2025" class="calendar-grid-item" data-date="2025-02-08" data-day="8" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  8
                </span>
              </div>
              <div aria-label="February 9, 2025" class="calendar-grid-item" data-date="2025-02-09" data-day="9" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  9
                </span>
              </div>
              <div aria-label="February 10, 2025" class="calendar-grid-item" data-date="2025-02-10" data-day="10" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  10
                </span>
              </div>
              <div aria-label="February 11, 2025" class="calendar-grid-item" data-date="2025-02-11" data-day="11" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  11
                </span>
              </div>
              <div aria-label="February 12, 2025" class="calendar-grid-item" data-date="2025-02-12" data-day="12" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  12
                </span>
              </div>
              <div aria-label="February 13, 2025" class="calendar-grid-item" data-date="2025-02-13" data-day="13" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  13
                </span>
              </div>
              <div aria-label="February 14, 2025" class="calendar-grid-item" data-date="2025-02-14" data-day="14" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  14
                </span>
              </div>
              <div aria-label="February 15, 2025" class="calendar-grid-item" data-date="2025-02-15" data-day="15" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  15
                </span>
              </div>
              <div aria-label="February 16, 2025" class="calendar-grid-item" data-date="2025-02-16" data-day="16" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  16
                </span>
              </div>
              <div aria-label="February 17, 2025" class="calendar-grid-item" data-date="2025-02-17" data-day="17" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  17
                </span>
              </div>
              <div aria-label="February 18, 2025" class="calendar-grid-item" data-date="2025-02-18" data-day="18" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  18
                </span>
              </div>
              <div aria-label="February 19, 2025" class="calendar-grid-item" data-date="2025-02-19" data-day="19" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  19
                </span>
              </div>
              <div aria-label="February 20, 2025" class="calendar-grid-item" data-date="2025-02-20" data-day="20" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  20
                </span>
              </div>
              <div aria-label="February 21, 2025" class="calendar-grid-item" data-date="2025-02-21" data-day="21" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  21
                </span>
              </div>
              <div aria-label="February 22, 2025" class="calendar-grid-item" data-date="2025-02-22" data-day="22" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  22
                </span>
              </div>
              <div aria-label="February 23, 2025" class="calendar-grid-item" data-date="2025-02-23" data-day="23" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  23
                </span>
              </div>
              <div aria-label="February 24, 2025" class="calendar-grid-item" data-date="2025-02-24" data-day="24" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  24
                </span>
              </div>
              <div aria-label="February 25, 2025" class="calendar-grid-item" data-date="2025-02-25" data-day="25" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  25
                </span>
              </div>
              <div aria-label="February 26, 2025" class="calendar-grid-item" data-date="2025-02-26" data-day="26" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  26
                </span>
              </div>
              <div aria-label="February 27, 2025" class="calendar-grid-item" data-date="2025-02-27" data-day="27" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  27
                </span>
              </div>
              <div aria-label="February 28, 2025" class="calendar-grid-item cem-last-day" data-date="2025-02-28" data-day="28" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                  28
                </span>
              </div>
              <div aria-label="March 1, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-01" data-day="1" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  1
                </span>
              </div>
              <div aria-label="March 2, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-02" data-day="2" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  2
                </span>
              </div>
              <div aria-label="March 3, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-03" data-day="3" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  3
                </span>
              </div>
              <div aria-label="March 4, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-04" data-day="4" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  4
                </span>
              </div>
              <div aria-label="March 5, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-05" data-day="5" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  5
                </span>
              </div>
              <div aria-label="March 6, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-06" data-day="6" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  6
                </span>
              </div>
              <div aria-label="March 7, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-07" data-day="7" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  7
                </span>
              </div>
              <div aria-label="March 8, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-08" data-day="8" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                  8
                </span>
              </div>
            </div>
          </div>
        </div>
        <footer class="border-top small text-center">
          <div aria-live="polite" class="small">
            Use cursor keys to navigate calendar dates
          </div>
        </footer>
        <div aria-labelledby="date-ranges" class="date-range-display" role="region" tabindex="0">
          <div class="date-ranges" id="date-ranges">
            <span class="start-end-ranges">
              <span class="start-date">
                N/A
              </span>
              <input aria-label="Start Time" class="form-control time-input" data-type="start" maxlength="5" type="text" value="00:00">
              <span class="to-spacing">
                -
              </span>
              <span class="end-date">
                N/A
              </span>
              <input aria-label="End Time" class="form-control time-input" data-type="end" maxlength="5" type="text" value="00:00">
            </span>
            <span class="duration"></span>
          </div>
          <div aria-live="assertive" class="hide warning-message"></div>
        </div>
      </div>
    </div>
  </div>
</date-range-time-picker-component>
`);
  });

  test('renders dropdown (rangeTimePicker=false) with external input [snapshot]', async () => {
    const page = await newSpecPage({
      components: [DateRangeTimePickerComponent],
      template: () => (<date-range-time-picker-component inputId="date-range-time" />),
    });

    const ext = getExternalInput(page.root as HTMLElement);
    expect(ext).not.toBeNull();
    expect(ext!.getAttribute('id')).toBe('date-range-time');

    // Collapsed dropdown exists but closed by default
    const dropdown = page.root!.querySelector('.dropdown')!;
    expect(dropdown.classList.contains('open')).toBe(false);

    // Snapshot (top-level structure; keeps inline for portability)
    expect(page.root).toMatchInlineSnapshot(`
<date-range-time-picker-component>
  <div class="date-picker">
    <div class="dropdown-wrapper">
      <div>
        <div class="form-group form-input-group-basic">
          <label aria-hidden="true" class="form-control-label" htmlfor="date-range-time" id="date-range-time-label">
            <span>
              Date and Time Picker
            </span>
          </label>
          <div>
            <div aria-label="Date Picker Group" class="input-group" role="group">
              <div class="drp-input-field">
                <input aria-describedby="datepicker-desc" aria-labelledby="date-range-time-label" class="form-control" id="date-range-time" placeholder="YYYY-MM-DD HH:MM  -  YYYY-MM-DD HH:MM" type="text" value="">
              </div>
              <div class="input-group-append">
                <button aria-expanded="false" aria-haspopup="dialog" aria-label="Toggle Calendar Picker" class="btn calendar-button input-group-text">
                  <i class="fa-calendar-alt fas"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dropdown">
        <div aria-labelledby="datepicker-desc" aria-modal="true" class="dropdown-content" role="dialog" tabindex="-1">
          <div class="date-picker">
            <div aria-label="Date Range Picker" class="range-picker-wrapper" role="region">
              <div aria-label="Navigation Controls" class="mb-1 range-picker-nav">
                <button aria-label="Previous Month" class="btn-outline-secondary range-picker-nav-btn">
                  <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c-12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"></path>
                  </svg>
                </button>
                <div class="selectors">
                  <label class="sr-only visually-hidden" htmlfor="months" id="monthSelectField">
                    Select Month
                  </label>
                  <select aria-label="Select Month" aria-labelledby="monthSelectField" class="form-control form-select months select-sm" id="months" role="listbox">
                    <option selected="" value="0">
                      January
                    </option>
                    <option value="1">
                      February
                    </option>
                    <option value="2">
                      March
                    </option>
                    <option value="3">
                      April
                    </option>
                    <option value="4">
                      May
                    </option>
                    <option value="5">
                      June
                    </option>
                    <option value="6">
                      July
                    </option>
                    <option value="7">
                      August
                    </option>
                    <option value="8">
                      September
                    </option>
                    <option value="9">
                      October
                    </option>
                    <option value="10">
                      November
                    </option>
                    <option value="11">
                      December
                    </option>
                  </select>
                  <label class="sr-only visually-hidden" htmlfor="year" id="yearSelectField">
                    Select Year
                  </label>
                  <select aria-label="Select Year" aria-labelledby="yearSelectField" class="form-control form-select select-sm years" id="year" role="listbox">
                    <option value="2014">
                      2014
                    </option>
                    <option value="2015">
                      2015
                    </option>
                    <option value="2016">
                      2016
                    </option>
                    <option value="2017">
                      2017
                    </option>
                    <option value="2018">
                      2018
                    </option>
                    <option value="2019">
                      2019
                    </option>
                    <option value="2020">
                      2020
                    </option>
                    <option value="2021">
                      2021
                    </option>
                    <option value="2022">
                      2022
                    </option>
                    <option value="2023">
                      2023
                    </option>
                    <option value="2024">
                      2024
                    </option>
                    <option selected="" value="2025">
                      2025
                    </option>
                    <option value="2026">
                      2026
                    </option>
                    <option value="2027">
                      2027
                    </option>
                    <option value="2028">
                      2028
                    </option>
                    <option value="2029">
                      2029
                    </option>
                    <option value="2030">
                      2030
                    </option>
                    <option value="2031">
                      2031
                    </option>
                    <option value="2032">
                      2032
                    </option>
                    <option value="2033">
                      2033
                    </option>
                    <option value="2034">
                      2034
                    </option>
                  </select>
                  <button aria-label="Reset Calendar" class="reset-btn">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"></path>
                    </svg>
                  </button>
                </div>
                <button aria-label="Next Month" class="btn-outline-secondary range-picker-nav-btn">
                  <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s-32.8-12.5 45.3 0l160 160z"></path>
                  </svg>
                </button>
              </div>
              <div class="range-picker">
                <div aria-label="Calendars" class="calendar-wrapper" role="application" tabindex="0">
                  <div aria-label="Calendar for January 2025" aria-roledescription="Calendar" class="calendar dp-calendar form-control h-auto pt-2 text-center" role="grid" tabindex="0">
                    <div aria-atomic="true" aria-live="polite" class="calendar-grid-caption font-weight-bold text-center" id="calendar-grid-caption">
                      January 2025
                    </div>
                    <div aria-hidden="true" class="calendar-grid-weekdays" role="row">
                      <small aria-label="Sunday" class="calendar-grid-day col" role="columnheader" title="Sunday">
                        Sun
                      </small>
                      <small aria-label="Monday" class="calendar-grid-day col" role="columnheader" title="Monday">
                        Mon
                      </small>
                      <small aria-label="Tuesday" class="calendar-grid-day col" role="columnheader" title="Tuesday">
                        Tue
                      </small>
                      <small aria-label="Wednesday" class="calendar-grid-day col" role="columnheader" title="Wednesday">
                        Wed
                      </small>
                      <small aria-label="Thursday" class="calendar-grid-day col" role="columnheader" title="Thursday">
                        Thu
                      </small>
                      <small aria-label="Friday" class="calendar-grid-day col" role="columnheader" title="Friday">
                        Fri
                      </small>
                      <small aria-label="Saturday" class="calendar-grid-day col" role="columnheader" title="Saturday">
                        Sat
                      </small>
                    </div>
                    <div class="calendar-grid" role="grid">
                      <div aria-label="December 29, 2024" class="calendar-grid-item previous-month-day" data-date="2024-12-29" data-day="29" data-month="12" data-year="2024" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          29
                        </span>
                      </div>
                      <div aria-label="December 30, 2024" class="calendar-grid-item previous-month-day" data-date="2024-12-30" data-day="30" data-month="12" data-year="2024" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          30
                        </span>
                      </div>
                      <div aria-label="December 31, 2024" class="calendar-grid-item previous-month-day" data-date="2024-12-31" data-day="31" data-month="12" data-year="2024" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          31
                        </span>
                      </div>
                      <div aria-label="January 1, 2025" class="calendar-grid-item csm-first-day" data-date="2025-01-01" data-day="1" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          1
                        </span>
                      </div>
                      <div aria-label="January 2, 2025" class="calendar-grid-item" data-date="2025-01-02" data-day="2" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          2
                        </span>
                      </div>
                      <div aria-label="January 3, 2025" class="calendar-grid-item" data-date="2025-01-03" data-day="3" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          3
                        </span>
                      </div>
                      <div aria-label="January 4, 2025" class="calendar-grid-item" data-date="2025-01-04" data-day="4" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          4
                        </span>
                      </div>
                      <div aria-label="January 5, 2025" class="calendar-grid-item" data-date="2025-01-05" data-day="5" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          5
                        </span>
                      </div>
                      <div aria-label="January 6, 2025" class="calendar-grid-item" data-date="2025-01-06" data-day="6" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          6
                        </span>
                      </div>
                      <div aria-label="January 7, 2025" class="calendar-grid-item" data-date="2025-01-07" data-day="7" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          7
                        </span>
                      </div>
                      <div aria-label="January 8, 2025" class="calendar-grid-item" data-date="2025-01-08" data-day="8" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          8
                        </span>
                      </div>
                      <div aria-label="January 9, 2025" class="calendar-grid-item" data-date="2025-01-09" data-day="9" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          9
                        </span>
                      </div>
                      <div aria-label="January 10, 2025" class="calendar-grid-item" data-date="2025-01-10" data-day="10" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          10
                        </span>
                      </div>
                      <div aria-label="January 11, 2025" class="calendar-grid-item" data-date="2025-01-11" data-day="11" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          11
                        </span>
                      </div>
                      <div aria-label="January 12, 2025" class="calendar-grid-item" data-date="2025-01-12" data-day="12" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          12
                        </span>
                      </div>
                      <div aria-label="January 13, 2025" class="calendar-grid-item" data-date="2025-01-13" data-day="13" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          13
                        </span>
                      </div>
                      <div aria-label="January 14, 2025" class="calendar-grid-item" data-date="2025-01-14" data-day="14" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          14
                        </span>
                      </div>
                      <div aria-label="January 15, 2025" class="calendar-grid-item" data-date="2025-01-15" data-day="15" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light current-day font-weight-bold rounded-circle text-dark text-nowrap">
                          15
                        </span>
                      </div>
                      <div aria-label="January 16, 2025" class="calendar-grid-item" data-date="2025-01-16" data-day="16" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          16
                        </span>
                      </div>
                      <div aria-label="January 17, 2025" class="calendar-grid-item" data-date="2025-01-17" data-day="17" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          17
                        </span>
                      </div>
                      <div aria-label="January 18, 2025" class="calendar-grid-item" data-date="2025-01-18" data-day="18" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          18
                        </span>
                      </div>
                      <div aria-label="January 19, 2025" class="calendar-grid-item" data-date="2025-01-19" data-day="19" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          19
                        </span>
                      </div>
                      <div aria-label="January 20, 2025" class="calendar-grid-item" data-date="2025-01-20" data-day="20" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          20
                        </span>
                      </div>
                      <div aria-label="January 21, 2025" class="calendar-grid-item" data-date="2025-01-21" data-day="21" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          21
                        </span>
                      </div>
                      <div aria-label="January 22, 2025" class="calendar-grid-item" data-date="2025-01-22" data-day="22" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          22
                        </span>
                      </div>
                      <div aria-label="January 23, 2025" class="calendar-grid-item" data-date="2025-01-23" data-day="23" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          23
                        </span>
                      </div>
                      <div aria-label="January 24, 2025" class="calendar-grid-item" data-date="2025-01-24" data-day="24" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          24
                        </span>
                      </div>
                      <div aria-label="January 25, 2025" class="calendar-grid-item" data-date="2025-01-25" data-day="25" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          25
                        </span>
                      </div>
                      <div aria-label="January 26, 2025" class="calendar-grid-item" data-date="2025-01-26" data-day="26" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          26
                        </span>
                      </div>
                      <div aria-label="January 27, 2025" class="calendar-grid-item" data-date="2025-01-27" data-day="27" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          27
                        </span>
                      </div>
                      <div aria-label="January 28, 2025" class="calendar-grid-item" data-date="2025-01-28" data-day="28" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          28
                        </span>
                      </div>
                      <div aria-label="January 29, 2025" class="calendar-grid-item" data-date="2025-01-29" data-day="29" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          29
                        </span>
                      </div>
                      <div aria-label="January 30, 2025" class="calendar-grid-item" data-date="2025-01-30" data-day="30" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          30
                        </span>
                      </div>
                      <div aria-label="January 31, 2025" class="calendar-grid-item csm-last-day" data-date="2025-01-31" data-day="31" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          31
                        </span>
                      </div>
                      <div aria-label="February 1, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-01" data-day="1" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          1
                        </span>
                      </div>
                      <div aria-label="February 2, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-02" data-day="2" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          2
                        </span>
                      </div>
                      <div aria-label="February 3, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-03" data-day="3" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          3
                        </span>
                      </div>
                      <div aria-label="February 4, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-04" data-day="4" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          4
                        </span>
                      </div>
                      <div aria-label="February 5, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-05" data-day="5" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          5
                        </span>
                      </div>
                      <div aria-label="February 6, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-06" data-day="6" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          6
                        </span>
                      </div>
                      <div aria-label="February 7, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-07" data-day="7" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          7
                        </span>
                      </div>
                      <div aria-label="February 8, 2025" class="calendar-grid-item next-month-day" data-date="2025-02-08" data-day="8" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          8
                        </span>
                      </div>
                    </div>
                  </div>
                  <div aria-label="Calendar for February 2025" aria-roledescription="Calendar" class="calendar dp-calendar form-control h-auto pt-2 text-center" role="grid" tabindex="0">
                    <div aria-atomic="true" aria-live="polite" class="calendar-grid-caption font-weight-bold text-center" id="calendar-grid-caption">
                      February 2025
                    </div>
                    <div aria-hidden="true" class="calendar-grid-weekdays" role="row">
                      <small aria-label="Sunday" class="calendar-grid-day col" role="columnheader" title="Sunday">
                        Sun
                      </small>
                      <small aria-label="Monday" class="calendar-grid-day col" role="columnheader" title="Monday">
                        Mon
                      </small>
                      <small aria-label="Tuesday" class="calendar-grid-day col" role="columnheader" title="Tuesday">
                        Tue
                      </small>
                      <small aria-label="Wednesday" class="calendar-grid-day col" role="columnheader" title="Wednesday">
                        Wed
                      </small>
                      <small aria-label="Thursday" class="calendar-grid-day col" role="columnheader" title="Thursday">
                        Thu
                      </small>
                      <small aria-label="Friday" class="calendar-grid-day col" role="columnheader" title="Friday">
                        Fri
                      </small>
                      <small aria-label="Saturday" class="calendar-grid-day col" role="columnheader" title="Saturday">
                        Sat
                      </small>
                    </div>
                    <div class="calendar-grid" role="grid">
                      <div aria-label="January 26, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-26" data-day="26" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          26
                        </span>
                      </div>
                      <div aria-label="January 27, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-27" data-day="27" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          27
                        </span>
                      </div>
                      <div aria-label="January 28, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-28" data-day="28" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          28
                        </span>
                      </div>
                      <div aria-label="January 29, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-29" data-day="29" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          29
                        </span>
                      </div>
                      <div aria-label="January 30, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-30" data-day="30" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          30
                        </span>
                      </div>
                      <div aria-label="January 31, 2025" class="calendar-grid-item previous-month-day" data-date="2025-01-31" data-day="31" data-month="1" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          31
                        </span>
                      </div>
                      <div aria-label="February 1, 2025" class="calendar-grid-item cem-first-day" data-date="2025-02-01" data-day="1" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          1
                        </span>
                      </div>
                      <div aria-label="February 2, 2025" class="calendar-grid-item" data-date="2025-02-02" data-day="2" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          2
                        </span>
                      </div>
                      <div aria-label="February 3, 2025" class="calendar-grid-item" data-date="2025-02-03" data-day="3" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          3
                        </span>
                      </div>
                      <div aria-label="February 4, 2025" class="calendar-grid-item" data-date="2025-02-04" data-day="4" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          4
                        </span>
                      </div>
                      <div aria-label="February 5, 2025" class="calendar-grid-item" data-date="2025-02-05" data-day="5" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          5
                        </span>
                      </div>
                      <div aria-label="February 6, 2025" class="calendar-grid-item" data-date="2025-02-06" data-day="6" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          6
                        </span>
                      </div>
                      <div aria-label="February 7, 2025" class="calendar-grid-item" data-date="2025-02-07" data-day="7" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          7
                        </span>
                      </div>
                      <div aria-label="February 8, 2025" class="calendar-grid-item" data-date="2025-02-08" data-day="8" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          8
                        </span>
                      </div>
                      <div aria-label="February 9, 2025" class="calendar-grid-item" data-date="2025-02-09" data-day="9" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          9
                        </span>
                      </div>
                      <div aria-label="February 10, 2025" class="calendar-grid-item" data-date="2025-02-10" data-day="10" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          10
                        </span>
                      </div>
                      <div aria-label="February 11, 2025" class="calendar-grid-item" data-date="2025-02-11" data-day="11" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          11
                        </span>
                      </div>
                      <div aria-label="February 12, 2025" class="calendar-grid-item" data-date="2025-02-12" data-day="12" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          12
                        </span>
                      </div>
                      <div aria-label="February 13, 2025" class="calendar-grid-item" data-date="2025-02-13" data-day="13" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          13
                        </span>
                      </div>
                      <div aria-label="February 14, 2025" class="calendar-grid-item" data-date="2025-02-14" data-day="14" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          14
                        </span>
                      </div>
                      <div aria-label="February 15, 2025" class="calendar-grid-item" data-date="2025-02-15" data-day="15" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          15
                        </span>
                      </div>
                      <div aria-label="February 16, 2025" class="calendar-grid-item" data-date="2025-02-16" data-day="16" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          16
                        </span>
                      </div>
                      <div aria-label="February 17, 2025" class="calendar-grid-item" data-date="2025-02-17" data-day="17" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          17
                        </span>
                      </div>
                      <div aria-label="February 18, 2025" class="calendar-grid-item" data-date="2025-02-18" data-day="18" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          18
                        </span>
                      </div>
                      <div aria-label="February 19, 2025" class="calendar-grid-item" data-date="2025-02-19" data-day="19" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          19
                        </span>
                      </div>
                      <div aria-label="February 20, 2025" class="calendar-grid-item" data-date="2025-02-20" data-day="20" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          20
                        </span>
                      </div>
                      <div aria-label="February 21, 2025" class="calendar-grid-item" data-date="2025-02-21" data-day="21" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          21
                        </span>
                      </div>
                      <div aria-label="February 22, 2025" class="calendar-grid-item" data-date="2025-02-22" data-day="22" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          22
                        </span>
                      </div>
                      <div aria-label="February 23, 2025" class="calendar-grid-item" data-date="2025-02-23" data-day="23" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          23
                        </span>
                      </div>
                      <div aria-label="February 24, 2025" class="calendar-grid-item" data-date="2025-02-24" data-day="24" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          24
                        </span>
                      </div>
                      <div aria-label="February 25, 2025" class="calendar-grid-item" data-date="2025-02-25" data-day="25" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          25
                        </span>
                      </div>
                      <div aria-label="February 26, 2025" class="calendar-grid-item" data-date="2025-02-26" data-day="26" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          26
                        </span>
                      </div>
                      <div aria-label="February 27, 2025" class="calendar-grid-item" data-date="2025-02-27" data-day="27" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          27
                        </span>
                      </div>
                      <div aria-label="February 28, 2025" class="calendar-grid-item cem-last-day" data-date="2025-02-28" data-day="28" data-month="2" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light font-weight-bold rounded-circle text-dark text-nowrap">
                          28
                        </span>
                      </div>
                      <div aria-label="March 1, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-01" data-day="1" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          1
                        </span>
                      </div>
                      <div aria-label="March 2, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-02" data-day="2" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          2
                        </span>
                      </div>
                      <div aria-label="March 3, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-03" data-day="3" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          3
                        </span>
                      </div>
                      <div aria-label="March 4, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-04" data-day="4" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          4
                        </span>
                      </div>
                      <div aria-label="March 5, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-05" data-day="5" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          5
                        </span>
                      </div>
                      <div aria-label="March 6, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-06" data-day="6" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          6
                        </span>
                      </div>
                      <div aria-label="March 7, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-07" data-day="7" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          7
                        </span>
                      </div>
                      <div aria-label="March 8, 2025" class="calendar-grid-item next-month-day" data-date="2025-03-08" data-day="8" data-month="3" data-year="2025" role="gridcell" tabindex="-1">
                        <span class="border-0 btn btn-outline-light rounded-circle text-muted text-nowrap">
                          8
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <footer class="border-top small text-center">
                  <div aria-live="polite" class="small">
                    Use cursor keys to navigate calendar dates
                  </div>
                </footer>
                <div aria-labelledby="date-ranges" class="date-range-display" role="region" tabindex="0">
                  <div class="date-ranges" id="date-ranges">
                    <span class="start-end-ranges">
                      <span class="start-date">
                        N/A
                      </span>
                      <input aria-label="Start Time" class="form-control time-input" data-type="start" maxlength="5" type="text" value="00:00">
                      <span class="to-spacing">
                        -
                      </span>
                      <span class="end-date">
                        N/A
                      </span>
                      <input aria-label="End Time" class="form-control time-input" data-type="end" maxlength="5" type="text" value="00:00">
                    </span>
                  </div>
                  <div aria-live="assertive" class="hide warning-message"></div>
                </div>
              </div>
              <div class="ok-button">
                <button aria-label="Confirm or close date picker" class="btn btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</date-range-time-picker-component>
`);
  });

  test('REGRESSION: picker-only should not shove summary into Start Time input', async () => {
    const page = await newSpecPage({
      components: [DateRangeTimePickerComponent],
      template: () => (
        <date-range-time-picker-component
          rangeTimePicker={true}
          isTwentyFourHourFormat={true}
          showDuration={true}
        />
      ),
    });

    const root = page.root as HTMLElement;

    // Select a start & end date in January 2025
    queryByDataDate(root, '2025-01-10')!.click();
    await page.waitForChanges();
    queryByDataDate(root, '2025-01-12')!.click();
    await page.waitForChanges();

    // Enter times directly into the time inputs
    const startTime = getStartTimeInput(root)!;
    const endTime = getEndTimeInput(root)!;
    startTime.value = '08:15';
    startTime.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    endTime.value = '12:45';
    endTime.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    // Assert the time inputs still hold ONLY time values (no summary string leaked)
    expect(startTime.value).toBe('08:15');
    expect(endTime.value).toBe('12:45');

    // Ensure there is no external input field at all
    expect(getExternalInput(root)).toBeNull();

    // The live range labels reflect formatted dates (not required to be asserted fully here)
    const startLabel = root.querySelector('.start-date')!.textContent!;
    const endLabel = root.querySelector('.end-date')!.textContent!;
    expect(startLabel).toMatch(/2025-01-10|January/);
    expect(endLabel).toMatch(/2025-01-12|January/);
  });

  test('dropdown mode: summary goes to external input; time inputs stay time-only; emits event', async () => {
    const page = await newSpecPage({
      components: [DateRangeTimePickerComponent],
      template: () => (<date-range-time-picker-component inputId="date-range-time" isTwentyFourHourFormat={true} showDuration={true} />),
    });

    const root = page.root as HTMLElement;

    // Open dropdown
    const toggleBtn = root.querySelector('.calendar-button') as HTMLButtonElement;
    toggleBtn.click();
    await page.waitForChanges();

    // a11y sanity when open
    const dropdown = root.querySelector('.dropdown')!;
    expect(dropdown.classList.contains('open')).toBe(true);
    const dialog = dropdown.querySelector('.dropdown-content')!;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');

    // Select dates
    queryByDataDate(root, '2025-01-05')!.click();
    await page.waitForChanges();
    queryByDataDate(root, '2025-01-06')!.click();
    await page.waitForChanges();

    // Enter times
    const startTime = getStartTimeInput(root)!;
    const endTime = getEndTimeInput(root)!;
    startTime.value = '09:00';
    startTime.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    endTime.value = '11:00';
    endTime.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    // Should emit after both complete
    const spy = jest.fn();
    (page.win as any).addEventListener('date-time-updated', spy);
    // trigger one more change to ensure emit happened via live path
    endTime.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    // External input should contain summary with joiner " - "
    const ext = getExternalInput(root)!;
    expect(ext.value).toContain(' - ');
    expect(ext.value).toMatch(/09:00/);
    expect(ext.value).toMatch(/11:00/);

    // Time inputs remain just time
    expect(startTime.value).toBe('09:00');
    expect(endTime.value).toBe('11:00');

    // Event payload sanity (we can't read detail off window listener directly,
    // so we attach to element emitter instead)
    const comp = page.rootInstance as any;
    const eventSpy = jest.fn();
    comp.el.addEventListener('date-time-updated', (e: CustomEvent) => eventSpy(e.detail));
    // re-dispatch by touching time again
    startTime.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
    const detail = eventSpy.mock.calls.at(-1)[0];
    expect(detail.startDateTimeIso).toMatch(/^2025-01-05T09:00:00\.000Z$/);
    expect(detail.endDateTimeIso).toMatch(/^2025-01-06T11:00:00\.000Z$/);
    expect(detail.duration).toBe('1d 2h');
  });

  test('OK button label switches to OK when both date+time complete', async () => {
    const page = await newSpecPage({
      components: [DateRangeTimePickerComponent],
      template: () => (<date-range-time-picker-component />),
    });

    const root = page.root as HTMLElement;

    // Open the dropdown to show OK button
    (root.querySelector('.calendar-button') as HTMLButtonElement).click();
    await page.waitForChanges();

    // Initially Close
    expect(root.querySelector('.ok-button button')!.textContent!.trim()).toBe('Close');

    // Select range
    queryByDataDate(root, '2025-01-02')!.click();
    await page.waitForChanges();
    queryByDataDate(root, '2025-01-03')!.click();
    await page.waitForChanges();

    // Times default to 00:00 (valid), so OK should now show
    expect(root.querySelector('.ok-button button')!.textContent!.trim()).toBe('OK');
  });
});
