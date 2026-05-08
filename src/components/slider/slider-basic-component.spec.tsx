// src/components/sliders/slider-basic-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { SliderBasicComponent } from './slider-basic-component';

function getRoot(page: any) {
  return page.root as HTMLElement;
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

function getLeftTextbox(root: HTMLElement) {
  return root.querySelector('.slider-value-left') as HTMLElement | null;
}

function getRightTextbox(root: HTMLElement) {
  return root.querySelector('.slider-value-right') as HTMLElement | null;
}

function getMinValueLabel(root: HTMLElement) {
  return root.querySelector('.slider-min-value') as HTMLElement | null;
}

function getMaxValueLabel(root: HTMLElement) {
  return root.querySelector('.slider-max-value') as HTMLElement | null;
}

function getTicks(root: HTMLElement) {
  return Array.from(root.querySelectorAll('.slider-tick')) as HTMLElement[];
}

function getTickLabels(root: HTMLElement) {
  return Array.from(root.querySelectorAll('.slider-tick-label')) as HTMLElement[];
}

function getControls(root: HTMLElement) {
  return root.querySelector('.slider-controls') as HTMLDivElement | null;
}

function getThumbLabel(root: HTMLElement) {
  return root.querySelector('.slider-thumb-label') as HTMLElement | null;
}

function getStyleAttr(el: Element | null) {
  return el?.getAttribute('style') || '';
}

function splitIds(v: string | null): string[] {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function mockControlsRects(
  page: any,
  {
    left = 0,
    width = 200,
    top = 0,
    height = 20,
  }: { left?: number; width?: number; top?: number; height?: number } = {},
) {
  const controls = getControls(getRoot(page))!;
  const original = controls.getBoundingClientRect;

  (controls as any).getBoundingClientRect = () =>
    ({
      left,
      right: left + width,
      width,
      top,
      bottom: top + height,
      height,
      x: left,
      y: top,
      toJSON() {},
    } as any);

  return () => {
    (controls as any).getBoundingClientRect = original;
  };
}

describe('slider-basic-component', () => {
  test('renders with defaults (snapshot) + a11y slider element', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component />,
    });

    const root = getRoot(page);

    expect(getThumbContainer(root)).toBeTruthy();
    expect(getMovingTrack(root)).toBeTruthy();
    expect(getLeftTextbox(root)).toBeTruthy();
    expect(getRightTextbox(root)).toBeTruthy();
    expect(getMinValueLabel(root)?.textContent?.trim()).toBe('0');
    expect(getMaxValueLabel(root)?.textContent?.trim()).toBe('100');

    const sliders = getAllSliders(root);
    expect(sliders.length).toBe(1);

    const slider = getSliderEl(root)!;
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('100');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');
    expect(slider.getAttribute('aria-valuetext')).toBe('0');
    expect(slider.getAttribute('aria-orientation')).toBe('horizontal');

    expect(slider.getAttribute('aria-label') || slider.getAttribute('aria-labelledby')).toBeTruthy();

    expect(page.root).toMatchSnapshot('default-render');
  });

  test('parses tickValues from JSON attribute and shows tick labels', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => (
        <slider-basic-component min={0} max={100} value={50} unit="%" tick-values="[0,25,50,75,100]" tick-labels={true} ticks={5} />
      ),
    });

    const root = getRoot(page);

    const ticks = getTicks(root);
    expect(ticks.length).toBe(5);

    const labels = getTickLabels(root);
    expect(labels.length).toBe(5);
    expect(labels.map(el => el.textContent?.trim())).toEqual(['0%', '25%', '50%', '75%', '100%']);

    expect(getMinValueLabel(root)).toBeNull();
    expect(getMaxValueLabel(root)).toBeNull();

    const slider = getSliderEl(root)!;
    expect(slider.getAttribute('aria-valuenow')).toBe('50');
    expect(slider.getAttribute('aria-valuetext')).toBe('50%');

    expect(page.root).toMatchSnapshot('ticks-with-labels');
  });

  test('hides min/max labels when tickValues are provided even if tick labels are off', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component min={0} max={100} value={50} tick-values="[0,25,50,75,100]" />,
    });

    const root = getRoot(page);

    expect(getMinValueLabel(root)).toBeNull();
    expect(getMaxValueLabel(root)).toBeNull();
  });

  test('keyboard ArrowRight/ArrowLeft without snapToTicks increments by 1 step', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component min={0} max={10} value={5} />,
    });

    const host = getRoot(page);
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

  test('vertical keyboard navigation ignores left/right and uses up/down', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component min={0} max={10} value={5} orientation="vertical" />,
    });

    const host = getRoot(page);
    const slider = getSliderEl(host)!;

    const spy = jest.fn();
    host.addEventListener('valueChange', (e: any) => spy(e.detail?.value));

    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await page.waitForChanges();
    expect(spy).not.toHaveBeenCalled();
    expect(slider.getAttribute('aria-valuenow')).toBe('5');

    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(6);
    expect(slider.getAttribute('aria-valuenow')).toBe('6');

    slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(5);
    expect(slider.getAttribute('aria-valuenow')).toBe('5');

    expect(page.root).toMatchSnapshot('keyboard-vertical');
  });

  test('keyboard snapping to tickValues goes to next/prev tick', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component min={0} max={60} value={20} snap-to-ticks={true} tick-values="[0,20,40,60]" />,
    });

    const host = getRoot(page);
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

  test('horizontal drag changes value (no snap), and snapToTicks snaps to nearest', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component min={0} max={100} value={0} />,
    });

    const teardown = mockControlsRects(page, { left: 0, width: 200, top: 0, height: 20 });
    const host = getRoot(page);
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
      components: [SliderBasicComponent],
      template: () => <slider-basic-component min={0} max={100} value={0} snap-to-ticks={true} tick-values="[0,25,50,75,100]" />,
    });

    const teardown2 = mockControlsRects(page2, { left: 0, width: 200, top: 0, height: 20 });
    const host2 = getRoot(page2);
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

  test('vertical drag changes value and moving track grows from bottom', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component min={0} max={100} value={0} orientation="vertical" />,
    });

    const teardown = mockControlsRects(page, { left: 0, width: 20, top: 0, height: 200 });
    const host = getRoot(page);
    const slider = getSliderEl(host)!;

    slider.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientY: 200 }));
    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 100 }));
    await page.waitForChanges();

    expect(slider.getAttribute('aria-valuenow')).toBe('50');
    expect(slider.getAttribute('aria-valuetext')).toBe('50');

    let movingTrack = getMovingTrack(host)!;
    let style = getStyleAttr(movingTrack);
    expect(style).toContain('bottom: 0');
    expect(style).toContain('height: 50%');

    window.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 0 }));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await page.waitForChanges();

    expect(slider.getAttribute('aria-valuenow')).toBe('100');
    expect(slider.getAttribute('aria-valuetext')).toBe('100');

    movingTrack = getMovingTrack(host)!;
    style = getStyleAttr(movingTrack);
    expect(style).toContain('bottom: 0');
    expect(style).toContain('height: 100%');

    expect(page.root).toMatchSnapshot('drag-vertical');
    teardown();
  });

  test('hideTextBoxes hides both; individual flags hide respective side', async () => {
    const pageA = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component value={33} hide-text-boxes={true} />,
    });
    expect(getLeftTextbox(getRoot(pageA))).toBeNull();
    expect(getRightTextbox(getRoot(pageA))).toBeNull();
    expect(pageA.root).toMatchSnapshot('hidden-both');

    const pageB = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component value={33} hide-left-text-box={true} />,
    });
    expect(getLeftTextbox(getRoot(pageB))).toBeNull();
    expect(getRightTextbox(getRoot(pageB))).toBeTruthy();
    expect(pageB.root).toMatchSnapshot('hidden-left');

    const pageC = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component value={33} hide-right-text-box={true} />,
    });
    expect(getLeftTextbox(getRoot(pageC))).toBeTruthy();
    expect(getRightTextbox(getRoot(pageC))).toBeNull();
    expect(pageC.root).toMatchSnapshot('hidden-right');
  });

  test('applies variant class to moving track and thumb container', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component value={20} variant="danger" />,
    });

    const root = getRoot(page);
    const track = getMovingTrack(root)!;
    const thumb = getThumbContainer(root)!;

    expect(track.className).toContain('danger');
    expect(thumb.className).toContain('danger');

    expect(page.root).toMatchSnapshot('variant-danger');
  });

  test('renders label and sliderThumbLabel modes', async () => {
    const pageA = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component label="Volume" value={7} unit="%" />,
    });

    const rootA = getRoot(pageA);
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
      components: [SliderBasicComponent],
      template: () => <slider-basic-component value={7} unit="%" slider-thumb-label={true} />,
    });

    const rootB = getRoot(pageB);
    expect(rootB.querySelector('label.form-control-label')).toBeNull();
    expect(getThumbLabel(rootB)).toBeTruthy();

    const sliderB = getSliderEl(rootB)!;
    expect(sliderB.getAttribute('aria-label')).toBeTruthy();

    expect(pageB.root).toMatchSnapshot('thumb-label');
  });

  test('sliderThumbLabel renders in vertical orientation', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component value={70} label="Volume" slider-thumb-label={true} orientation="vertical" />,
    });

    const root = getRoot(page);
    const thumbLabel = getThumbLabel(root);

    expect(root.querySelector('label.form-control-label')).toBeNull();
    expect(thumbLabel).toBeTruthy();
    expect(thumbLabel?.textContent?.trim()).toBe('70');
    expect(getSliderEl(root)?.getAttribute('aria-orientation')).toBe('vertical');

    expect(page.root).toMatchSnapshot('thumb-label-vertical');
  });

  test('a11y overrides: aria-labelledby wins over aria-label; describedby is forwarded', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => (
        <div>
          <div id="ext-label">External label</div>
          <div id="ext-help">External help</div>
          <slider-basic-component value={10} min={0} max={20} aria-label="Ignored" aria-labelledby="ext-label" aria-describedby="ext-help" />
        </div>
      ),
    });

    const slider = page.body.querySelector('slider-basic-component')!.querySelector('[role="slider"]') as HTMLElement;

    expect(slider.getAttribute('aria-labelledby')).toBe('ext-label');
    expect(slider.getAttribute('aria-label')).toBeNull();

    const described = splitIds(slider.getAttribute('aria-describedby'));
    expect(described).toContain('ext-help');

    expect(!!page.body.querySelector('#ext-label')).toBe(true);
    expect(!!page.body.querySelector('#ext-help')).toBe(true);
  });

  test('disabled: slider is not focusable and sets aria-disabled', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component disabled={true} value={5} />,
    });

    const slider = getSliderEl(getRoot(page))!;
    expect(slider.getAttribute('aria-disabled')).toBe('true');
    expect(slider.getAttribute('tabindex')).toBe('-1');

    expect(page.root).toMatchSnapshot('disabled');
  });

  test('vertical orientation sets vertical classes, aria-orientation, and bottom-anchored moving track', async () => {
    const page = await newSpecPage({
      components: [SliderBasicComponent],
      template: () => <slider-basic-component value={50} orientation="vertical" />,
    });

    const root = getRoot(page);
    const slider = getSliderEl(root)!;
    const sliderShell = root.querySelector('.slider') as HTMLElement;
    const controls = root.querySelector('.slider-controls') as HTMLElement;
    const movingTrack = getMovingTrack(root)!;
    const style = getStyleAttr(movingTrack);

    expect(sliderShell.className).toContain('slider-vertical');
    expect(controls.className).toContain('slider-controls-vertical');
    expect(slider.getAttribute('aria-orientation')).toBe('vertical');
    expect(style).toContain('bottom: 0');
    expect(style).toContain('height: 50%');

    expect(page.root).toMatchSnapshot('vertical-orientation');
  });
});
