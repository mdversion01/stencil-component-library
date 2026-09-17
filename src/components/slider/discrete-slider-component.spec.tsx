// File: src/components/slider/discrete-slider-component.spec.tsx

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { DiscreteSliderComponent } from './discrete-slider-component';

let originalMathRandom: typeof Math.random;

beforeAll(() => {
  originalMathRandom = Math.random;

  Math.random = jest.fn(
    () => 0.123456789,
  );
});

afterAll(() => {
  Math.random = originalMathRandom;
});

function getRoot(page: any): HTMLElement {
  return page.root as HTMLElement;
}

function getControls(
  root: HTMLElement,
): HTMLDivElement | null {
  return root.querySelector(
    '.slider-controls',
  ) as HTMLDivElement | null;
}

function getSliderEl(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '[role="slider"]',
  ) as HTMLElement | null;
}

function getAllSliders(
  root: HTMLElement,
): HTMLElement[] {
  return Array.from(
    root.querySelectorAll(
      '[role="slider"]',
    ),
  ) as HTMLElement[];
}

function getThumbContainer(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-thumb-container',
  ) as HTMLElement | null;
}

function getMovingTrack(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-moving-track',
  ) as HTMLElement | null;
}

function getRightTextbox(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-value-right',
  ) as HTMLElement | null;
}

function getLeftTextbox(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-value-left',
  ) as HTMLElement | null;
}

function getTicks(
  root: HTMLElement,
): HTMLElement[] {
  return Array.from(
    root.querySelectorAll(
      '.slider-tick',
    ),
  ) as HTMLElement[];
}

function getTickLabels(
  root: HTMLElement,
): HTMLElement[] {
  return Array.from(
    root.querySelectorAll(
      '.slider-tick-label',
    ),
  ) as HTMLElement[];
}

function getThumbLabel(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-thumb-label',
  ) as HTMLElement | null;
}

function getStyleAttr(
  element: Element | null,
): string {
  return (
    element?.getAttribute(
      'style',
    ) || ''
  );
}

function splitIds(
  value: string | null,
): string[] {
  return String(value || '')
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
    height = 200,
  }: {
    left?: number;
    width?: number;
    top?: number;
    height?: number;
  } = {},
): () => void {
  const controls =
    getControls(
      getRoot(page),
    )!;

  const original =
    controls.getBoundingClientRect;

  (
    controls as HTMLElement & {
      getBoundingClientRect:
        () => DOMRect;
    }
  ).getBoundingClientRect = () =>
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
    }) as DOMRect;

  return () => {
    (
      controls as HTMLElement & {
        getBoundingClientRect:
          () => DOMRect;
      }
    ).getBoundingClientRect =
      original;
  };
}

describe(
  'discrete-slider-component',
  () => {
    test(
      'renders with defaults (snapshot) + a11y slider element',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component />
            ),
          });

        const root =
          getRoot(page);

        expect(
          getControls(root),
        ).toBeTruthy();

        expect(
          getMovingTrack(root),
        ).toBeTruthy();

        expect(
          getRightTextbox(root),
        ).toBeTruthy();

        expect(
          getLeftTextbox(root),
        ).toBeTruthy();

        const sliders =
          getAllSliders(root);

        expect(
          sliders.length,
        ).toBe(1);

        const slider =
          getSliderEl(root)!;

        expect(
          slider.getAttribute(
            'aria-disabled',
          ),
        ).toBe('true');

        expect(
          slider.getAttribute(
            'tabindex',
          ),
        ).toBe('-1');

        expect(
          slider.getAttribute(
            'aria-valuemin',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-valuemax',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe('');

        expect(
          slider.getAttribute(
            'aria-orientation',
          ),
        ).toBe('horizontal');

        expect(
          page.root,
        ).toMatchSnapshot(
          'default-render',
        );
      },
    );

    test(
      'parses stringValues from JSON attribute and respects selectedIndex + a11y value text',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["Low","Med","High","Ultra"]'
                selected-index={2}
                label="Quality"
                tick-labels={true}
              />
            ),
          });

        const root =
          getRoot(page);

        const ticks =
          getTicks(root);

        const labels =
          getTickLabels(root);

        expect(
          ticks.length,
        ).toBe(4);

        expect(
          labels.length,
        ).toBe(4);

        expect(
          labels.map(
            label =>
              label.textContent?.trim(),
          ),
        ).toEqual([
          'Low',
          'Med',
          'High',
          'Ultra',
        ]);

        expect(
          getLeftTextbox(root)
            ?.textContent
            ?.trim(),
        ).toBe('High');

        expect(
          getRightTextbox(root)
            ?.textContent
            ?.trim(),
        ).toBe('High');

        const slider =
          getSliderEl(root)!;

        expect(
          slider.getAttribute(
            'aria-disabled',
          ),
        ).toBeNull();

        expect(
          slider.getAttribute(
            'tabindex',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-valuemin',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-valuemax',
          ),
        ).toBe('3');

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('2');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe('High');

        expect(
          slider.getAttribute(
            'aria-orientation',
          ),
        ).toBe('horizontal');

        expect(
          slider.getAttribute(
            'aria-label',
          ),
        ).toBeNull();

        const labelledBy =
          slider.getAttribute(
            'aria-labelledby',
          );

        expect(
          labelledBy,
        ).toBeTruthy();

        expect(
          root.querySelector(
            `[id="${labelledBy}"]`,
          ),
        ).toBeTruthy();

        expect(
          page.root,
        ).toMatchSnapshot(
          'json-values-and-selected-index',
        );
      },
    );

    test(
      'keyboard navigation changes selectedIndex and emits events',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["A","B","C","D"]'
                selected-index={1}
              />
            ),
          });

        const host =
          getRoot(page);

        const slider =
          getSliderEl(host)!;

        const indexSpy =
          jest.fn();

        const valueSpy =
          jest.fn();

        host.addEventListener(
          'indexChange',
          (event: Event) => {
            const customEvent =
              event as CustomEvent<{
                index: number;
              }>;

            indexSpy(
              customEvent.detail
                ?.index,
            );
          },
        );

        host.addEventListener(
          'valueChange',
          (event: Event) => {
            const customEvent =
              event as CustomEvent<{
                value: string;
              }>;

            valueSpy(
              customEvent.detail
                ?.value,
            );
          },
        );

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'ArrowRight',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          indexSpy,
        ).toHaveBeenLastCalledWith(
          2,
        );

        expect(
          valueSpy,
        ).toHaveBeenLastCalledWith(
          'C',
        );

        expect(
          getRightTextbox(host)
            ?.textContent
            ?.trim(),
        ).toBe('C');

        expect(
          getLeftTextbox(host)
            ?.textContent
            ?.trim(),
        ).toBe('C');

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('2');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe('C');

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'Home',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          indexSpy,
        ).toHaveBeenLastCalledWith(
          0,
        );

        expect(
          valueSpy,
        ).toHaveBeenLastCalledWith(
          'A',
        );

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe('A');

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'End',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          indexSpy,
        ).toHaveBeenLastCalledWith(
          3,
        );

        expect(
          valueSpy,
        ).toHaveBeenLastCalledWith(
          'D',
        );

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('3');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe('D');

        expect(
          page.root,
        ).toMatchSnapshot(
          'keyboard-nav',
        );
      },
    );

    test(
      'vertical keyboard navigation ignores left/right and uses up/down',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["A","B","C","D"]'
                selected-index={1}
                orientation="vertical"
              />
            ),
          });

        const root =
          getRoot(page);

        const slider =
          getSliderEl(root)!;

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'ArrowRight',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('1');

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'ArrowUp',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('2');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe('C');

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'ArrowDown',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('1');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe('B');

        expect(
          page.root,
        ).toMatchSnapshot(
          'keyboard-nav-vertical',
        );
      },
    );

    test(
      'horizontal drag updates index based on position',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["A","B","C","D","E"]'
                selected-index={0}
              />
            ),
          });

        const teardown =
          mockControlsRects(
            page,
            {
              left: 0,
              width: 200,
              top: 0,
              height: 20,
            },
          );

        try {
          const host =
            getRoot(page);

          const slider =
            getSliderEl(host)!;

          slider.dispatchEvent(
            new MouseEvent(
              'mousedown',
              {
                bubbles: true,
                clientX: 0,
              },
            ),
          );

          window.dispatchEvent(
            new MouseEvent(
              'mousemove',
              {
                bubbles: true,
                clientX: 100,
              },
            ),
          );

          await page.waitForChanges();

          expect(
            getRightTextbox(host)
              ?.textContent
              ?.trim(),
          ).toBe('C');

          expect(
            slider.getAttribute(
              'aria-valuenow',
            ),
          ).toBe('2');

          expect(
            slider.getAttribute(
              'aria-valuetext',
            ),
          ).toBe('C');

          window.dispatchEvent(
            new MouseEvent(
              'mousemove',
              {
                bubbles: true,
                clientX: 200,
              },
            ),
          );

          window.dispatchEvent(
            new MouseEvent(
              'mouseup',
              {
                bubbles: true,
              },
            ),
          );

          await page.waitForChanges();

          expect(
            getRightTextbox(host)
              ?.textContent
              ?.trim(),
          ).toBe('E');

          expect(
            slider.getAttribute(
              'aria-valuenow',
            ),
          ).toBe('4');

          expect(
            slider.getAttribute(
              'aria-valuetext',
            ),
          ).toBe('E');

          expect(
            page.root,
          ).toMatchSnapshot(
            'drag-behavior-horizontal',
          );
        } finally {
          teardown();
        }
      },
    );

    test(
      'vertical drag updates index based on position and moving track grows from bottom',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["A","B","C","D","E"]'
                selected-index={0}
                orientation="vertical"
              />
            ),
          });

        const teardown =
          mockControlsRects(
            page,
            {
              left: 0,
              width: 20,
              top: 0,
              height: 200,
            },
          );

        try {
          const host =
            getRoot(page);

          const slider =
            getSliderEl(host)!;

          slider.dispatchEvent(
            new MouseEvent(
              'mousedown',
              {
                bubbles: true,
                clientY: 200,
              },
            ),
          );

          window.dispatchEvent(
            new MouseEvent(
              'mousemove',
              {
                bubbles: true,
                clientY: 100,
              },
            ),
          );

          await page.waitForChanges();

          expect(
            slider.getAttribute(
              'aria-valuenow',
            ),
          ).toBe('2');

          expect(
            slider.getAttribute(
              'aria-valuetext',
            ),
          ).toBe('C');

          let movingTrack =
            getMovingTrack(host)!;

          let style =
            getStyleAttr(
              movingTrack,
            );

          expect(
            style,
          ).toContain(
            'bottom: 0',
          );

          expect(
            style,
          ).toContain(
            'height: 50.0000%',
          );

          window.dispatchEvent(
            new MouseEvent(
              'mousemove',
              {
                bubbles: true,
                clientY: 0,
              },
            ),
          );

          window.dispatchEvent(
            new MouseEvent(
              'mouseup',
              {
                bubbles: true,
              },
            ),
          );

          await page.waitForChanges();

          expect(
            slider.getAttribute(
              'aria-valuenow',
            ),
          ).toBe('4');

          expect(
            slider.getAttribute(
              'aria-valuetext',
            ),
          ).toBe('E');

          movingTrack =
            getMovingTrack(host)!;

          style =
            getStyleAttr(
              movingTrack,
            );

          expect(
            style,
          ).toContain(
            'bottom: 0',
          );

          expect(
            style,
          ).toContain(
            'height: 100.0000%',
          );

          expect(
            page.root,
          ).toMatchSnapshot(
            'drag-behavior-vertical',
          );
        } finally {
          teardown();
        }
      },
    );

    test(
      'variant class is applied to moving track and thumb container',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["X","Y","Z"]'
                selected-index={1}
                variant="warning"
              />
            ),
          });

        const root =
          getRoot(page);

        const track =
          getMovingTrack(root)!;

        const thumb =
          getThumbContainer(root)!;

        expect(
          track.className,
        ).toContain(
          'warning',
        );

        expect(
          thumb.className,
        ).toContain(
          'warning',
        );

        expect(
          page.root,
        ).toMatchSnapshot(
          'variant-warning',
        );
      },
    );

    test(
      'hideRightTextBox hides the right value output',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["Red","Green","Blue"]'
                selected-index={2}
                hide-right-text-box={true}
              />
            ),
          });

        const root =
          getRoot(page);

        expect(
          getRightTextbox(root),
        ).toBeNull();

        expect(
          getLeftTextbox(root),
        ).toBeTruthy();

        expect(
          page.root,
        ).toMatchSnapshot(
          'hide-right-textbox',
        );
      },
    );

    test(
      'hideLeftTextBox hides the left value output',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["Red","Green","Blue"]'
                selected-index={2}
                hide-left-text-box={true}
              />
            ),
          });

        const root =
          getRoot(page);

        expect(
          getLeftTextbox(root),
        ).toBeNull();

        expect(
          getRightTextbox(root),
        ).toBeTruthy();

        expect(
          page.root,
        ).toMatchSnapshot(
          'hide-left-textbox',
        );
      },
    );

    test(
      'hideTextBoxes hides both value outputs',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["Red","Green","Blue"]'
                selected-index={2}
                hide-text-boxes={true}
              />
            ),
          });

        const root =
          getRoot(page);

        expect(
          getLeftTextbox(root),
        ).toBeNull();

        expect(
          getRightTextbox(root),
        ).toBeNull();

        expect(
          page.root,
        ).toMatchSnapshot(
          'hide-both-textboxes',
        );
      },
    );

    test(
      'sliderThumbLabel renders thumb label and hides visible label text row',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["Red","Green","Blue"]'
                selected-index={1}
                label="Color"
                slider-thumb-label={true}
              />
            ),
          });

        const root =
          getRoot(page);

        expect(
          root.querySelector(
            '.form-control-label',
          ),
        ).toBeNull();

        expect(
          getThumbLabel(root),
        ).toBeTruthy();

        expect(
          getThumbLabel(root)
            ?.textContent
            ?.trim(),
        ).toBe('Green');

        expect(
          page.root,
        ).toMatchSnapshot(
          'thumb-label-horizontal',
        );
      },
    );

    test(
      'sliderThumbLabel renders in vertical orientation',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["Low","Med","High"]'
                selected-index={2}
                label="Level"
                slider-thumb-label={true}
                orientation="vertical"
              />
            ),
          });

        const root =
          getRoot(page);

        const thumbLabel =
          getThumbLabel(root);

        expect(
          root.querySelector(
            '.form-control-label',
          ),
        ).toBeNull();

        expect(
          thumbLabel,
        ).toBeTruthy();

        expect(
          thumbLabel
            ?.textContent
            ?.trim(),
        ).toBe('High');

        expect(
          getSliderEl(root)
            ?.getAttribute(
              'aria-orientation',
            ),
        ).toBe('vertical');

        expect(
          page.root,
        ).toMatchSnapshot(
          'thumb-label-vertical',
        );
      },
    );

    test(
      'a11y overrides: aria-labelledby wins over aria-label; describedby is forwarded',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <div>
                <div id="ext-label">
                  External label
                </div>

                <div id="ext-help">
                  External help
                </div>

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

        const host =
          page.body.querySelector(
            'discrete-slider-component',
          ) as HTMLElement;

        const slider =
          host.querySelector(
            '[role="slider"]',
          ) as HTMLElement;

        expect(
          slider.getAttribute(
            'aria-labelledby',
          ),
        ).toBe('ext-label');

        expect(
          slider.getAttribute(
            'aria-label',
          ),
        ).toBeNull();

        const described =
          splitIds(
            slider.getAttribute(
              'aria-describedby',
            ),
          );

        expect(
          described,
        ).toContain(
          'ext-help',
        );

        expect(
          page.body.querySelector(
            '#ext-label',
          ),
        ).toBeTruthy();

        expect(
          page.body.querySelector(
            '#ext-help',
          ),
        ).toBeTruthy();
      },
    );

    test(
      'disabled: slider not focusable and sets aria-disabled',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["A","B"]'
                selected-index={0}
                disabled={true}
              />
            ),
          });

        const slider =
          getSliderEl(
            getRoot(page),
          )!;

        expect(
          slider.getAttribute(
            'aria-disabled',
          ),
        ).toBe('true');

        expect(
          slider.getAttribute(
            'tabindex',
          ),
        ).toBe('-1');

        expect(
          page.root,
        ).toMatchSnapshot(
          'disabled',
        );
      },
    );

    test(
      'vertical orientation sets vertical class, aria-orientation, and bottom-anchored moving track',
      async () => {
        const page =
          await newSpecPage({
            components: [
              DiscreteSliderComponent,
            ],
            template: () => (
              <discrete-slider-component
                string-values='["A","B","C"]'
                selected-index={1}
                orientation="vertical"
              />
            ),
          });

        const root =
          getRoot(page);

        const slider =
          getSliderEl(root)!;

        const sliderShell =
          root.querySelector(
            '.slider',
          ) as HTMLElement;

        const controls =
          root.querySelector(
            '.slider-controls',
          ) as HTMLElement;

        const movingTrack =
          getMovingTrack(root)!;

        const style =
          getStyleAttr(
            movingTrack,
          );

        expect(
          sliderShell.className,
        ).toContain(
          'slider-vertical',
        );

        expect(
          controls.className,
        ).toContain(
          'slider-controls-vertical',
        );

        expect(
          slider.getAttribute(
            'aria-orientation',
          ),
        ).toBe('vertical');

        expect(
          style,
        ).toContain(
          'bottom: 0',
        );

        expect(
          style,
        ).toContain(
          'height: 50.0000%',
        );

        expect(
          page.root,
        ).toMatchSnapshot(
          'vertical-orientation',
        );
      },
    );
  },
);
