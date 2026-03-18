// src/components/slider/basic-slider-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { BasicSliderComponent } from './basic-slider-component';

// helpers
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
function splitIds(v: string | null): string[] {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
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
  test('renders with defaults (snapshot) + a11y slider element', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component />,
    });

    const root = page.root as HTMLElement;

    expect(getThumbContainer(root)).toBeTruthy();
    expect(getMovingTrack(root)).toBeTruthy();
    expect(getLeftTextbox(root)).toBeTruthy();
    expect(getRightTextbox(root)).toBeTruthy();

    const sliders = getAllSliders(root);
    expect(sliders.length).toBe(1);

    const slider = getSliderEl(root)!;
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('100');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');
    expect(slider.getAttribute('aria-valuetext')).toBe('0');

    expect(slider.getAttribute('aria-label') || slider.getAttribute('aria-labelledby')).toBeTruthy();

    expect(page.root).toMatchSnapshot('default-render');
  });

  test('parses tickValues from JSON attribute and shows tick labels', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => (
        <basic-slider-component min={0} max={100} value={50} unit="%" tick-values="[0,25,50,75,100]" tick-labels={true} ticks={5} />
      ),
    });

    const root = page.root as HTMLElement;

    const ticks = getTicks(root);
    expect(ticks.length).toBe(5);

    const labels = getTickLabels(root);
    expect(labels.length).toBe(5);
    expect(labels.map(el => el.textContent?.trim())).toEqual(['0%', '25%', '50%', '75%', '100%']);

    const slider = getSliderEl(root)!;
    expect(slider.getAttribute('aria-valuenow')).toBe('50');
    expect(slider.getAttribute('aria-valuetext')).toBe('50%');

    expect(page.root).toMatchSnapshot('ticks-with-labels');
  });

  test('keyboard ArrowRight/ArrowLeft without snapToTicks increments by 1 step', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component min={0} max={10} value={5} />,
    });

    const host = page.root as HTMLElement;
    const slider = getSliderEl(host)!;

    const spy = jest.fn();
    host.addEventListener('valueChange', (e: any) => spy(e.detail?.value));

    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(6);

    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
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
    const slider = getSliderEl(host)!;

    const spy = jest.fn();
    host.addEventListener('valueChange', (e: any) => spy(e.detail?.value));

    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(40);

    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
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
    const slider = getSliderEl(host)!;

    slider.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));
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
    const slider2 = getSliderEl(host2)!;

    slider2.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 0 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 90 }));
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

    const root = page.root as HTMLElement;
    const track = getMovingTrack(root)!;
    const thumb = getThumbContainer(root)!;

    expect(track.className).toContain('danger');
    expect(thumb.className).toContain('danger');

    expect(page.root).toMatchSnapshot('variant-danger');
  });

  test('renders label and sliderThumbLabel modes (label id changed)', async () => {
    const pageA = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component label="Volume" value={7} unit="%" />,
    });

    const rootA = pageA.root as HTMLElement;
    const labelEl = rootA.querySelector('label.form-control-label') as HTMLElement | null;
    expect(labelEl).toBeTruthy();
    expect(labelEl!.textContent).toContain('Volume');

    expect(rootA.querySelector('.slider-thumb-label')).toBeNull();

    const sliderA = getSliderEl(rootA)!;
    const labelledby = sliderA.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();
    expect(labelledby && !!rootA.querySelector(`#${labelledby}`)).toBe(true);

    expect(pageA.root).toMatchSnapshot('label-no-thumb');

    const pageB = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component value={7} unit="%" slider-thumb-label={true} />,
    });

    const rootB = pageB.root as HTMLElement;
    expect(rootB.querySelector('label.form-control-label')).toBeNull();
    expect(rootB.querySelector('.slider-thumb-label')).toBeTruthy();

    const sliderB = getSliderEl(rootB)!;
    expect(sliderB.getAttribute('aria-label')).toBeTruthy();

    expect(pageB.root).toMatchSnapshot('thumb-label');
  });

  test('a11y overrides: aria-labelledby wins over aria-label; describedby is forwarded', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => (
        <div>
          <div id="ext-label">External label</div>
          <div id="ext-help">External help</div>
          <basic-slider-component value={10} min={0} max={20} aria-label="Ignored" aria-labelledby="ext-label" aria-describedby="ext-help" />
        </div>
      ),
    });

    // The first root can be the wrapper; safest is to resolve slider from page.body.
    const slider = page.body.querySelector('basic-slider-component')!.querySelector('[role="slider"]') as HTMLElement;

    expect(slider.getAttribute('aria-labelledby')).toBe('ext-label');
    expect(slider.getAttribute('aria-label')).toBeNull();

    const described = splitIds(slider.getAttribute('aria-describedby'));
    expect(described).toContain('ext-help');

    // ✅ external ids are siblings in page.body
    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);
  });

  test('disabled: slider is not focusable and sets aria-disabled', async () => {
    const page = await newSpecPage({
      components: [BasicSliderComponent],
      template: () => <basic-slider-component disabled={true} value={5} />,
    });

    const slider = getSliderEl(page.root as HTMLElement)!;
    expect(slider.getAttribute('aria-disabled')).toBe('true');
    expect(slider.getAttribute('tabindex')).toBe('-1');

    expect(page.root).toMatchSnapshot('disabled');
  });
});
