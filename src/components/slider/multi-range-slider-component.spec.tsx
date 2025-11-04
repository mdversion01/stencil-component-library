// src/components/sliders/multi-range-slider-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { MultiRangeSliderComponent } from './multi-range-slider-component';

// ---------- helpers ----------------------------------------------------------

const qs = (root: Element | null, sel: string) => (root ? (root.querySelector(sel) as HTMLElement | null) : null);

function getContainer(root: HTMLElement) {
  return qs(root, '.slider-container') as HTMLDivElement | null;
}
function getMovingTracks(root: HTMLElement) {
  return Array.from(root.querySelectorAll('.slider-track.multi')) as HTMLElement[];
}
function getLowerThumb(root: HTMLElement) {
  return qs(root, '.slider-thumb-container.lower-thumb');
}
function getUpperThumb(root: HTMLElement) {
  return qs(root, '.slider-thumb-container.upper-thumb');
}
function getLeftTextbox(root: HTMLElement) {
  return qs(root, '.slider-value-left');
}
function getRightTextbox(root: HTMLElement) {
  return qs(root, '.slider-value-right');
}
function getTicks(root: HTMLElement) {
  return Array.from(root.querySelectorAll('.slider-tick')) as HTMLElement[];
}
function getTickLabels(root: HTMLElement) {
  return Array.from(root.querySelectorAll('.slider-tick-label')) as HTMLElement[];
}

// Mock a deterministic bounding rect for the slider container so drag math is stable
function mockContainerRects(page: any, { left = 0, width = 200 }: { left?: number; width?: number } = {}) {
  const container = getContainer(page.root as HTMLElement)!;
  const original = container.getBoundingClientRect;
  (container as any).getBoundingClientRect = () =>
    ({
      left,
      right: left + width,
      width,
      top: 0,
      bottom: 0,
      height: 20,
      x: left,
      y: 0,
      toJSON() {},
    } as any);

  return () => {
    (container as any).getBoundingClientRect = original;
  };
}

// ---------- tests ------------------------------------------------------------

describe('multi-range-slider-component', () => {
  test('renders with defaults (snapshot)', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component />,
    });

    expect(getContainer(page.root as any)).toBeTruthy();
    expect(getMovingTracks(page.root as any).length).toBeGreaterThan(0);
    expect(getLowerThumb(page.root as any)).toBeTruthy();
    expect(getUpperThumb(page.root as any)).toBeTruthy();

    // default textboxes visible
    expect(getLeftTextbox(page.root as any)).toBeTruthy();
    expect(getRightTextbox(page.root as any)).toBeTruthy();

    expect(page.root).toMatchSnapshot('default-render');
  });

  test('parses tickValues JSON and renders tick labels', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component min={0} max={100} lower-value={20} upper-value={80} unit="%" tick-values="[0,25,50,75,100]" tick-labels={true} />,
    });

    const ticks = getTicks(page.root as any);
    const labels = getTickLabels(page.root as any);
    expect(ticks.length).toBe(5);
    expect(labels.length).toBe(5);
    expect(page.root).toMatchSnapshot('ticks-and-labels');
  });

  test('keyboard arrows/Home/End adjust lower/upper values and emit rangeChange', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component min={0} max={10} lower-value={2} upper-value={8} />,
    });

    const host = page.root as HTMLElement;
    const controls = host.querySelector('.slider') as HTMLElement; // keydown attached at slider root
    const spy = jest.fn();
    host.addEventListener('rangeChange', (e: any) => spy(e.detail));

    // ArrowRight adjusts LOWER thumb
    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ lowerValue: 3, upperValue: 8 });

    // ArrowDown adjusts UPPER thumb (down)
    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ lowerValue: 3, upperValue: 7 });

    // Home -> lower to min, upper >= lower+inc
    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await page.waitForChanges();
    const homeDetail = spy.mock.calls.at(-1)[0];
    expect(homeDetail.lowerValue).toBe(0);
    expect(homeDetail.upperValue).toBeGreaterThan(homeDetail.lowerValue);

    // End -> upper to max, lower <= upper-inc
    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await page.waitForChanges();
    const endDetail = spy.mock.calls.at(-1)[0];
    expect(endDetail.upperValue).toBe(10);
    expect(endDetail.lowerValue).toBeLessThan(endDetail.upperValue);

    expect(page.root).toMatchSnapshot('keyboard-nav');
  });

  test('drag lower and upper thumbs updates values (no snap)', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component min={0} max={100} lower-value={20} upper-value={80} />,
    });

    const teardown = mockContainerRects(page, { left: 0, width: 200 });
    const host = page.root as HTMLElement;
    const lower = getLowerThumb(host)!;
    const upper = getUpperThumb(host)!;

    // Start drag lower at 0 -> move to 25% (50px)
    lower.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 50 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();

    // Start drag upper at 200 -> move to 75% (150px)
    upper.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 200 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 150 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();

    // Check textboxes reflect new values (approx ~25 and ~75)
    const leftTxt = getLeftTextbox(host)?.textContent?.trim()!;
    const rightTxt = getRightTextbox(host)?.textContent?.trim()!;
    expect(Number(leftTxt)).toBeGreaterThanOrEqual(24);
    expect(Number(leftTxt)).toBeLessThanOrEqual(26);
    expect(Number(rightTxt)).toBeGreaterThanOrEqual(74);
    expect(Number(rightTxt)).toBeLessThanOrEqual(76);

    expect(page.root).toMatchSnapshot('drag-both-thumbs');
    teardown();
  });

  test('snapToTicks snaps to nearest tick on drag', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component min={0} max={100} lower-value={10} upper-value={90} snap-to-ticks={true} tick-values="[0,20,40,60,80,100]" />,
    });

    const teardown = mockContainerRects(page, { left: 0, width: 200 });
    const host = page.root as HTMLElement;
    const lower = getLowerThumb(host)!;

    // move lower near 33% -> should snap to 40
    lower.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 66 })); // ~33%
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();

    const leftTxt = getLeftTextbox(host)?.textContent?.trim()!;
    expect(Number(leftTxt)).toBe(40);

    expect(page.root).toMatchSnapshot('snap-to-ticks');
    teardown();
  });

  test('variant class applied to thumbs/tracks', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component variant="info" />,
    });

    const host = page.root as HTMLElement;
    const lower = getLowerThumb(host)!;
    const upper = getUpperThumb(host)!;
    const tracks = getMovingTracks(host);

    expect(lower.className).toContain('info');
    expect(upper.className).toContain('info');
    // middle track should also carry the variant class
    expect(tracks.some(t => t.className.includes('info'))).toBe(true);

    expect(page.root).toMatchSnapshot('variant-info');
  });

  test('hideTextBoxes hides both; individual flags hide respective side', async () => {
    // both hidden
    const pageBoth = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component hide-text-boxes={true} />,
    });
    expect(getLeftTextbox(pageBoth.root as any)).toBeNull();
    expect(getRightTextbox(pageBoth.root as any)).toBeNull();
    expect(pageBoth.root).toMatchSnapshot('hide-both-textboxes');

    // left only hidden
    const pageLeft = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component hide-left-text-box={true} />,
    });
    expect(getLeftTextbox(pageLeft.root as any)).toBeNull();
    expect(getRightTextbox(pageLeft.root as any)).toBeTruthy();
    expect(pageLeft.root).toMatchSnapshot('hide-left-textbox');

    // right only hidden
    const pageRight = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component hide-right-text-box={true} />,
    });
    expect(getLeftTextbox(pageRight.root as any)).toBeTruthy();
    expect(getRightTextbox(pageRight.root as any)).toBeNull();
    expect(pageRight.root).toMatchSnapshot('hide-right-textbox');
  });

  test('label vs sliderThumbLabel rendering', async () => {
    const pageA = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component label="Range" lower-value={10} upper-value={20} />,
    });
    expect(pageA.root?.querySelector('#slider-input-label')?.textContent).toContain('Range');
    expect(pageA.root?.querySelector('.slider-thumb-label')).toBeNull();
    expect(pageA.root).toMatchSnapshot('label-mode');

    const pageB = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component label="Range" slider-thumb-label={true} />,
    });
    // label element is omitted when sliderThumbLabel is true
    expect(pageB.root?.querySelector('#slider-input-label')).toBeNull();
    // per-component logic: thumb labels appear only if sliderThumbLabel=true (both thumbs render labels)
    // We won't assert exact markup count (depends on code paths).
    expect(pageB.root).toMatchSnapshot('thumb-label-mode');
  });
});
