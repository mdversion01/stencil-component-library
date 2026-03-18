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
function getAllSliders(root: HTMLElement) {
  return Array.from(root.querySelectorAll('[role="slider"]')) as HTMLElement[];
}
function getLowerSlider(root: HTMLElement) {
  return qs(root, '.slider-thumb-container.lower-thumb[role="slider"]');
}
function getUpperSlider(root: HTMLElement) {
  return qs(root, '.slider-thumb-container.upper-thumb[role="slider"]');
}
function splitIds(v: string | null): string[] {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
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
  test('renders with defaults (snapshot) + two slider roles', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component />,
    });

    const root = page.root as HTMLElement;

    expect(getContainer(root)).toBeTruthy();
    expect(getMovingTracks(root).length).toBeGreaterThan(0);
    expect(getLowerThumb(root)).toBeTruthy();
    expect(getUpperThumb(root)).toBeTruthy();

    expect(getLeftTextbox(root)).toBeTruthy();
    expect(getRightTextbox(root)).toBeTruthy();

    const sliders = getAllSliders(root);
    expect(sliders.length).toBe(2);

    const lower = getLowerSlider(root)!;
    const upper = getUpperSlider(root)!;

    expect(lower.getAttribute('aria-valuemin')).toBe('0');
    expect(lower.getAttribute('aria-valuemax')).toBe('100');
    expect(lower.getAttribute('aria-valuenow')).toBe('25');

    expect(upper.getAttribute('aria-valuemin')).toBe('0');
    expect(upper.getAttribute('aria-valuemax')).toBe('100');
    expect(upper.getAttribute('aria-valuenow')).toBe('75');

    expect(page.root).toMatchSnapshot('default-render');
  });

  test('parses tickValues JSON and renders tick labels', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => (
        <multi-range-slider-component
          min={0}
          max={100}
          lower-value={20}
          upper-value={80}
          unit="%"
          tick-values="[0,25,50,75,100]"
          tick-labels={true}
        />
      ),
    });

    const ticks = getTicks(page.root as any);
    const labels = getTickLabels(page.root as any);
    expect(ticks.length).toBe(5);
    expect(labels.length).toBe(5);

    expect(page.root).toMatchSnapshot('ticks-and-labels');
  });

  test('keyboard arrows/Home/End adjust the focused thumb and emit rangeChange', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component min={0} max={10} lower-value={2} upper-value={8} />,
    });

    const host = page.root as HTMLElement;
    const lower = getLowerSlider(host)!;
    const upper = getUpperSlider(host)!;

    const spy = jest.fn();
    host.addEventListener('rangeChange', (e: any) => spy(e.detail));

    // ✅ Focus LOWER thumb (this should set activeThumb='lower')
    lower.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    // ArrowRight on LOWER => lower becomes 3
    lower.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ lowerValue: 3, upperValue: 8 });
    expect(lower.getAttribute('aria-valuenow')).toBe('3');
    expect(upper.getAttribute('aria-valuenow')).toBe('8');

    // ✅ Focus UPPER thumb (this should set activeThumb='upper')
    upper.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    // ArrowDown on UPPER => upper becomes 7 (lower stays 3)
    upper.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith({ lowerValue: 3, upperValue: 7 });
    expect(upper.getAttribute('aria-valuenow')).toBe('7');
    expect(lower.getAttribute('aria-valuenow')).toBe('3');

    // Home on LOWER -> lower to min, upper >= lower+inc
    lower.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    lower.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await page.waitForChanges();
    const homeDetail = spy.mock.calls.at(-1)[0];
    expect(homeDetail.lowerValue).toBe(0);
    expect(homeDetail.upperValue).toBeGreaterThan(homeDetail.lowerValue);

    // End on UPPER -> upper to max, lower <= upper-inc
    upper.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    upper.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
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

    lower.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 50 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();

    upper.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 200 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 150 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();

    const leftTxt = getLeftTextbox(host)?.textContent?.trim()!;
    const rightTxt = getRightTextbox(host)?.textContent?.trim()!;
    expect(Number(leftTxt)).toBeGreaterThanOrEqual(24);
    expect(Number(leftTxt)).toBeLessThanOrEqual(26);
    expect(Number(rightTxt)).toBeGreaterThanOrEqual(74);
    expect(Number(rightTxt)).toBeLessThanOrEqual(76);

    const lowerSlider = getLowerSlider(host)!;
    const upperSlider = getUpperSlider(host)!;
    expect(lowerSlider.getAttribute('aria-valuetext')).toBe(leftTxt);
    expect(upperSlider.getAttribute('aria-valuetext')).toBe(rightTxt);

    expect(page.root).toMatchSnapshot('drag-both-thumbs');
    teardown();
  });

  test('snapToTicks snaps to nearest tick on drag', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => (
        <multi-range-slider-component min={0} max={100} lower-value={10} upper-value={90} snap-to-ticks={true} tick-values="[0,20,40,60,80,100]" />
      ),
    });

    const teardown = mockContainerRects(page, { left: 0, width: 200 });
    const host = page.root as HTMLElement;
    const lower = getLowerThumb(host)!;

    lower.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 66 })); // ~33% => 40
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();

    const leftTxt = getLeftTextbox(host)?.textContent?.trim()!;
    expect(Number(leftTxt)).toBe(40);
    expect(getLowerSlider(host)!.getAttribute('aria-valuenow')).toBe('40');

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
    expect(tracks.some(t => t.className.includes('info'))).toBe(true);

    expect(page.root).toMatchSnapshot('variant-info');
  });

  test('hideTextBoxes hides both; individual flags hide respective side', async () => {
    const pageBoth = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component hide-text-boxes={true} />,
    });
    expect(getLeftTextbox(pageBoth.root as any)).toBeNull();
    expect(getRightTextbox(pageBoth.root as any)).toBeNull();
    expect(pageBoth.root).toMatchSnapshot('hide-both-textboxes');

    const pageLeft = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component hide-left-text-box={true} />,
    });
    expect(getLeftTextbox(pageLeft.root as any)).toBeNull();
    expect(getRightTextbox(pageLeft.root as any)).toBeTruthy();
    expect(pageLeft.root).toMatchSnapshot('hide-left-textbox');

    const pageRight = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component hide-right-text-box={true} />,
    });
    expect(getLeftTextbox(pageRight.root as any)).toBeTruthy();
    expect(getRightTextbox(pageRight.root as any)).toBeNull();
    expect(pageRight.root).toMatchSnapshot('hide-right-textbox');
  });

  test('label vs sliderThumbLabel rendering (label id changed)', async () => {
    const pageA = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component label="Range" lower-value={10} upper-value={20} />,
    });

    const labelEl = pageA.root?.querySelector('label.form-control-label') as HTMLElement | null;
    expect(labelEl?.textContent).toContain('Range');
    expect(pageA.root?.querySelector('.slider-thumb-label')).toBeNull();
    expect(pageA.root).toMatchSnapshot('label-mode');

    const pageB = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component label="Range" slider-thumb-label={true} />,
    });

    expect(pageB.root?.querySelector('label.form-control-label')).toBeNull();
    expect(pageB.root).toMatchSnapshot('thumb-label-mode');
  });

  test('a11y overrides: aria-labelledby wins over aria-label; describedby forwarded to both sliders', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => (
        <div>
          <div id="ext-label">External label</div>
          <div id="ext-help">External help</div>

          <multi-range-slider-component
            min={0}
            max={100}
            lower-value={10}
            upper-value={90}
            aria-label="Ignored"
            aria-labelledby="ext-label"
            aria-describedby="ext-help"
          />
        </div>
      ),
    });

    const host = page.body.querySelector('multi-range-slider-component') as HTMLElement;
    const sliders = Array.from(host.querySelectorAll('[role="slider"]')) as HTMLElement[];
    expect(sliders.length).toBe(2);

    for (const s of sliders) {
      expect(s.getAttribute('aria-labelledby')).toBe('ext-label');
      expect(s.getAttribute('aria-label')).toBeNull();
      expect(splitIds(s.getAttribute('aria-describedby'))).toContain('ext-help');
    }

    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);
  });

  test('disabled: sliders not focusable and set aria-disabled', async () => {
    const page = await newSpecPage({
      components: [MultiRangeSliderComponent],
      template: () => <multi-range-slider-component disabled={true} />,
    });

    const host = page.root as HTMLElement;
    const sliders = getAllSliders(host);
    expect(sliders.length).toBe(2);

    sliders.forEach(s => {
      expect(s.getAttribute('aria-disabled')).toBe('true');
      expect(s.getAttribute('tabindex')).toBe('-1');
    });

    expect(page.root).toMatchSnapshot('disabled');
  });
});
