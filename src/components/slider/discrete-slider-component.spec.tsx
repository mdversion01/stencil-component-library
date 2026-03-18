// src/components/sliders/discrete-slider-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { DiscreteSliderComponent } from './discrete-slider-component';

// ---- helpers ---------------------------------------------------------------

function getContainer(root: HTMLElement) {
  return root.querySelector('.slider-container') as HTMLDivElement | null;
}
function getSliderEl(root: HTMLElement) {
  return root.querySelector('[role="slider"]') as HTMLElement | null;
}
function getAllSliders(root: HTMLElement) {
  return Array.from(root.querySelectorAll('[role="slider"]')) as HTMLElement[];
}
function getThumbContainer(root: HTMLElement) {
  return root.querySelector('.slider-thumb-container') as HTMLElement | null;
}
function getMovingTrack(root: HTMLElement) {
  return root.querySelector('.slider-moving-track') as HTMLElement | null;
}
function getRightTextbox(root: HTMLElement) {
  return root.querySelector('.slider-value-right') as HTMLElement | null;
}
function getTicks(root: HTMLElement) {
  return Array.from(root.querySelectorAll('.slider-tick')) as HTMLElement[];
}
function getTickLabels(root: HTMLElement) {
  return Array.from(root.querySelectorAll('.slider-tick-label')) as HTMLElement[];
}
function splitIds(v: string | null): string[] {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

// crude bbox mock for slider container (so drag math works deterministically)
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

// ---- tests -----------------------------------------------------------------

describe('discrete-slider-component', () => {
  test('renders with defaults (snapshot) + a11y slider element', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component />,
    });

    const root = page.root as HTMLElement;

    expect(getContainer(root)).toBeTruthy();
    expect(getMovingTrack(root)).toBeTruthy();
    expect(getRightTextbox(root)).toBeTruthy();

    // ✅ exactly one slider role
    const sliders = getAllSliders(root);
    expect(sliders.length).toBe(1);

    const slider = getSliderEl(root)!;
    expect(slider.getAttribute('aria-disabled')).toBe('true'); // no values => effectively disabled
    expect(slider.getAttribute('tabindex')).toBe('-1');
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('0');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');
    expect(slider.getAttribute('aria-valuetext')).toBe(''); // empty selected value

    expect(page.root).toMatchSnapshot('default-render');
  });

  test('parses stringValues from JSON attribute and respects selectedIndex + a11y value text', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => (
        <discrete-slider-component
          string-values='["Low","Med","High","Ultra"]'
          selected-index={2}
          label="Quality"
          tick-labels={true}
        />
      ),
    });

    const root = page.root as HTMLElement;

    const ticks = getTicks(root);
    const labels = getTickLabels(root);
    expect(ticks.length).toBe(4);
    expect(labels.length).toBe(4);
    expect(labels.map(l => l.textContent?.trim())).toEqual(['Low', 'Med', 'High', 'Ultra']);

    expect(getRightTextbox(root)?.textContent?.trim()).toBe('High');

    const slider = getSliderEl(root)!;
    expect(slider.getAttribute('aria-disabled')).toBeNull();
    expect(slider.getAttribute('tabindex')).toBe('0');
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('3');
    expect(slider.getAttribute('aria-valuenow')).toBe('2');
    expect(slider.getAttribute('aria-valuetext')).toBe('High');

    // label present => aria-labelledby points to rendered label id
    expect(slider.getAttribute('aria-label')).toBeNull();
    expect(slider.getAttribute('aria-labelledby')).toBeTruthy();

    expect(page.root).toMatchSnapshot('json-values-and-selected-index');
  });

  test('keyboard navigation changes selectedIndex and emits events', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["A","B","C","D"]' selected-index={1} />,
    });

    const host = page.root as HTMLElement;
    const slider = getSliderEl(host)!;

    const indexSpy = jest.fn();
    const valueSpy = jest.fn();

    host.addEventListener('indexChange', (e: any) => indexSpy(e.detail?.index));
    host.addEventListener('valueChange', (e: any) => valueSpy(e.detail?.value));

    // ArrowRight -> index 2 ("C")
    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(indexSpy).toHaveBeenLastCalledWith(2);
    expect(valueSpy).toHaveBeenLastCalledWith('C');
    expect(getRightTextbox(host)?.textContent?.trim()).toBe('C');
    expect(slider.getAttribute('aria-valuenow')).toBe('2');
    expect(slider.getAttribute('aria-valuetext')).toBe('C');

    // Home -> index 0 ("A")
    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await page.waitForChanges();
    expect(indexSpy).toHaveBeenLastCalledWith(0);
    expect(valueSpy).toHaveBeenLastCalledWith('A');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');
    expect(slider.getAttribute('aria-valuetext')).toBe('A');

    // End -> index 3 ("D")
    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await page.waitForChanges();
    expect(indexSpy).toHaveBeenLastCalledWith(3);
    expect(valueSpy).toHaveBeenLastCalledWith('D');
    expect(slider.getAttribute('aria-valuenow')).toBe('3');
    expect(slider.getAttribute('aria-valuetext')).toBe('D');

    expect(page.root).toMatchSnapshot('keyboard-nav');
  });

  test('drag updates index based on position', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["A","B","C","D","E"]' selected-index={0} />,
    });

    const teardown = mockContainerRects(page, { left: 0, width: 200 });
    const host = page.root as HTMLElement;
    const slider = getSliderEl(host)!;

    slider.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));

    // move near 50% (~index 2)
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100 }));
    await page.waitForChanges();
    expect(getRightTextbox(host)?.textContent?.trim()).toBe('C');
    expect(slider.getAttribute('aria-valuenow')).toBe('2');
    expect(slider.getAttribute('aria-valuetext')).toBe('C');

    // move to end (~index 4)
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 200 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();
    expect(getRightTextbox(host)?.textContent?.trim()).toBe('E');
    expect(slider.getAttribute('aria-valuenow')).toBe('4');
    expect(slider.getAttribute('aria-valuetext')).toBe('E');

    expect(page.root).toMatchSnapshot('drag-behavior');
    teardown();
  });

  test('variant class is applied to moving track and thumb container', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["X","Y","Z"]' selected-index={1} variant="warning" />,
    });

    const root = page.root as HTMLElement;
    const track = getMovingTrack(root)!;
    const thumb = getThumbContainer(root)!;

    expect(track.className).toContain('warning');
    expect(thumb.className).toContain('warning');

    expect(page.root).toMatchSnapshot('variant-warning');
  });

  test('hideRightTextBox hides the right value output', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["Red","Green","Blue"]' selected-index={2} hide-right-text-box={true} />,
    });

    expect(getRightTextbox(page.root as any)).toBeNull();
    expect(page.root).toMatchSnapshot('hide-right-textbox');
  });

  test('a11y overrides: aria-labelledby wins over aria-label; describedby is forwarded', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => (
        <div>
          <div id="ext-label">External label</div>
          <div id="ext-help">External help</div>

          <discrete-slider-component
            string-values='["Low","Med","High"]'
            selected-index={1}
            aria-label="Ignored"
            aria-labelledby="ext-label"
            aria-describedby="ext-help"
          />
        </div>
      ),
    });

    const slider = page.body
      .querySelector('discrete-slider-component')!
      .querySelector('[role="slider"]') as HTMLElement;

    expect(slider.getAttribute('aria-labelledby')).toBe('ext-label');
    expect(slider.getAttribute('aria-label')).toBeNull();

    const described = splitIds(slider.getAttribute('aria-describedby'));
    expect(described).toContain('ext-help');

    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);
  });

  test('disabled: slider not focusable and sets aria-disabled', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["A","B"]' selected-index={0} disabled={true} />,
    });

    const slider = getSliderEl(page.root as HTMLElement)!;
    expect(slider.getAttribute('aria-disabled')).toBe('true');
    expect(slider.getAttribute('tabindex')).toBe('-1');

    expect(page.root).toMatchSnapshot('disabled');
  });
});
