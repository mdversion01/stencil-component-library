// src/components/sliders/discrete-slider-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { DiscreteSliderComponent } from './discrete-slider-component';

// ---- helpers ---------------------------------------------------------------

function getContainer(root: HTMLElement) {
  return root.querySelector('.slider-container') as HTMLDivElement | null;
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
  test('renders with defaults (snapshot)', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component />,
    });

    expect(getContainer(page.root as any)).toBeTruthy();
    expect(getMovingTrack(page.root as any)).toBeTruthy();
    // defaults show right textbox (empty value string)
    expect(getRightTextbox(page.root as any)).toBeTruthy();

    expect(page.root).toMatchSnapshot('default-render');
  });

  test('parses stringValues from JSON attribute and respects selectedIndex', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["Low","Med","High","Ultra"]' selected-index={2} label="Quality" tick-labels={true} />,
    });

    // Verify ticks & labels
    const ticks = getTicks(page.root as any);
    const labels = getTickLabels(page.root as any);
    expect(ticks.length).toBe(4);
    expect(labels.length).toBe(4);
    expect(labels.map(l => l.textContent?.trim())).toEqual(['Low', 'Med', 'High', 'Ultra']);

    // Right text box shows selected value
    expect(getRightTextbox(page.root as any)?.textContent?.trim()).toBe('High');

    expect(page.root).toMatchSnapshot('json-values-and-selected-index');
  });

  test('keyboard navigation changes selectedIndex and emits events', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["A","B","C","D"]' selected-index={1} />,
    });

    const host = page.root as HTMLElement;
    const controls = host.querySelector('.slider-controls') as HTMLElement;
    const indexSpy = jest.fn();
    const valueSpy = jest.fn();

    host.addEventListener('indexChange', (e: any) => indexSpy(e.detail?.index));
    host.addEventListener('valueChange', (e: any) => valueSpy(e.detail?.value));

    // ArrowRight -> index 2 ("C")
    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(indexSpy).toHaveBeenLastCalledWith(2);
    expect(valueSpy).toHaveBeenLastCalledWith('C');
    expect(getRightTextbox(host)?.textContent?.trim()).toBe('C');

    // Home -> index 0 ("A")
    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await page.waitForChanges();
    expect(indexSpy).toHaveBeenLastCalledWith(0);
    expect(valueSpy).toHaveBeenLastCalledWith('A');

    // End -> index 3 ("D")
    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await page.waitForChanges();
    expect(indexSpy).toHaveBeenLastCalledWith(3);
    expect(valueSpy).toHaveBeenLastCalledWith('D');

    expect(page.root).toMatchSnapshot('keyboard-nav');
  });

  test('drag updates index based on position', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["A","B","C","D","E"]' selected-index={0} />,
    });

    const teardown = mockContainerRects(page, { left: 0, width: 200 });
    const host = page.root as HTMLElement;
    const thumb = getThumbContainer(host)!;

    // mousedown starts drag
    thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));

    // move near 50% (~index 2)
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100 }));
    await page.waitForChanges();
    expect(getRightTextbox(host)?.textContent?.trim()).toBe('C');

    // move to end (~index 4)
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 200 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();
    expect(getRightTextbox(host)?.textContent?.trim()).toBe('E');

    expect(page.root).toMatchSnapshot('drag-behavior');
    teardown();
  });

  test('variant class is applied to moving track and thumb container', async () => {
    const page = await newSpecPage({
      components: [DiscreteSliderComponent],
      template: () => <discrete-slider-component string-values='["X","Y","Z"]' selected-index={1} variant="warning" />,
    });

    const track = getMovingTrack(page.root as any)!;
    const thumb = getThumbContainer(page.root as any)!;

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
});
