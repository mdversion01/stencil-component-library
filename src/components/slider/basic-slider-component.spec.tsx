// src/components/slider/basic-slider-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core'; // <-- needed when using JSX in template
import { BasicSliderComponent } from './basic-slider-component';

// helpers
function getThumbContainer(root: HTMLElement) {
  return root.querySelector('.slider-thumb-container') as HTMLElement | null;
}
function getMovingTrack(root: HTMLElement) {
  return root.querySelector('.slider-moving-track') as HTMLElement | null;
}
function getLeftTextbox(root: HTMLElement) {
  return root.querySelector('.slider-value-left') as HTMLElement | null;
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
function getContainer(root: HTMLElement) {
  return root.querySelector('.slider-container') as HTMLDivElement | null;
}

// crude bbox mock for slider container
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

describe('basic-slider-component', () => {
  test('renders with defaults (snapshot)', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component />,
    });

    expect(getThumbContainer(page.root as any)).toBeTruthy();
    expect(getMovingTrack(page.root as any)).toBeTruthy();

    expect(getLeftTextbox(page.root as any)).toBeTruthy();
    expect(getRightTextbox(page.root as any)).toBeTruthy();

    expect(page.root).toMatchSnapshot('default-render');
  });

  test('parses tickValues from JSON attribute and shows tick labels', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component min={0} max={100} value={50} unit="%" tick-values="[0,25,50,75,100]" tick-labels={true} ticks={5} />,
    });

    const ticks = getTicks(page.root as any);
    expect(ticks.length).toBe(5);

    const labels = getTickLabels(page.root as any);
    expect(labels.length).toBe(5);
    expect(labels.map(el => el.textContent?.trim())).toEqual(['0%', '25%', '50%', '75%', '100%']);

    expect(page.root).toMatchSnapshot('ticks-with-labels');
  });

  test('keyboard ArrowRight/ArrowLeft without snapToTicks increments by 1 step', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component min={0} max={10} value={5} />,
    });

    const host = page.root as HTMLElement;
    const controls = host.querySelector('.slider-controls') as HTMLElement;

    const spy = jest.fn();
    host.addEventListener('valueChange', (e: any) => spy(e.detail?.value));

    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(6);

    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(5);

    expect(page.root).toMatchSnapshot('keyboard-no-snap');
  });

  test('keyboard snapping to tickValues goes to next/prev tick', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component min={0} max={60} value={20} snap-to-ticks={true} tick-values="[0,20,40,60]" />,
    });

    const host = page.root as HTMLElement;
    const controls = host.querySelector('.slider-controls') as HTMLElement;
    const spy = jest.fn();
    host.addEventListener('valueChange', (e: any) => spy(e.detail?.value));

    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(40);

    controls.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(20);

    expect(page.root).toMatchSnapshot('keyboard-with-snap');
  });

  test('drag changes value (no snap), and snapToTicks snaps to nearest', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component min={0} max={100} value={0} />,
    });

    const teardown = mockContainerRects(page, { left: 0, width: 200 });
    const host = page.root as HTMLElement;
    const thumb = getThumbContainer(host)!;

    thumb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 100 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();

    const valueText = getRightTextbox(host)?.textContent?.trim();
    expect(Number(valueText)).toBeGreaterThanOrEqual(49);
    expect(Number(valueText)).toBeLessThanOrEqual(51);
    teardown();

    const page2 = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component min={0} max={100} value={0} snap-to-ticks={true} tick-values="[0,25,50,75,100]" />,
    });

    const teardown2 = mockContainerRects(page2, { left: 0, width: 200 });
    const host2 = page2.root as HTMLElement;
    const thumb2 = getThumbContainer(host2)!;

    thumb2.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 90 })); // ~45% -> 50 tick
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page2.waitForChanges();

    const valueText2 = getRightTextbox(host2)?.textContent?.trim();
    expect(valueText2).toBe('50');

    expect(page2.root).toMatchSnapshot('drag-with-snap');
    teardown2();
  });

  test('hideTextBoxes hides both; individual flags hide respective side', async () => {
    const pageA = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component value={33} hide-text-boxes={true} />,
    });
    expect(getLeftTextbox(pageA.root as any)).toBeNull();
    expect(getRightTextbox(pageA.root as any)).toBeNull();
    expect(pageA.root).toMatchSnapshot('hidden-both');

    const pageB = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component value={33} hide-left-text-box={true} />,
    });
    expect(getLeftTextbox(pageB.root as any)).toBeNull();
    expect(getRightTextbox(pageB.root as any)).toBeTruthy();
    expect(pageB.root).toMatchSnapshot('hidden-left');

    const pageC = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component value={33} hide-right-text-box={true} />,
    });
    expect(getLeftTextbox(pageC.root as any)).toBeTruthy();
    expect(getRightTextbox(pageC.root as any)).toBeNull();
    expect(pageC.root).toMatchSnapshot('hidden-right');
  });

  test('applies variant class to moving track and thumb container', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component value={20} variant="danger" />,
    });

    const track = getMovingTrack(page.root as any)!;
    const thumb = getThumbContainer(page.root as any)!;

    expect(track.className).toContain('danger');
    expect(thumb.className).toContain('danger');

    expect(page.root).toMatchSnapshot('variant-danger');
  });

  test('renders label and sliderThumbLabel modes', async () => {
    const pageA = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component label="Volume" value={7} unit="%" />,
    });
    expect(pageA.root?.querySelector('#slider-input-label')?.textContent).toContain('Volume');
    expect(pageA.root?.querySelector('.slider-thumb-label')).toBeNull();
    expect(pageA.root).toMatchSnapshot('label-no-thumb');

    const pageB = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component value={7} unit="%" slider-thumb-label={true} />,
    });
    expect(pageB.root?.querySelector('#slider-input-label')).toBeNull();
    expect(pageB.root?.querySelector('.slider-thumb-label')).toBeTruthy();
    expect(pageB.root).toMatchSnapshot('thumb-label');
  });
});
