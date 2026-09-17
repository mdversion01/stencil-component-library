// File: src/components/slider/slider-basic-component.spec.tsx

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { SliderBasicComponent } from './slider-basic-component';

function getRoot(
  page: any,
): HTMLElement {
  return page.root as HTMLElement;
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

function getLeftTextbox(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-value-left',
  ) as HTMLElement | null;
}

function getRightTextbox(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-value-right',
  ) as HTMLElement | null;
}

function getMinValueLabel(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-min-value',
  ) as HTMLElement | null;
}

function getMaxValueLabel(
  root: HTMLElement,
): HTMLElement | null {
  return root.querySelector(
    '.slider-max-value',
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

function getControls(
  root: HTMLElement,
): HTMLDivElement | null {
  return root.querySelector(
    '.slider-controls',
  ) as HTMLDivElement | null;
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
  return String(
    value || '',
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeGeneratedSliderIds(
  root: HTMLElement,
): void {
  const values: string[] = [];

  const elements: Element[] = [
    root,
    ...Array.from(
      root.querySelectorAll('*'),
    ),
  ];

  const inspectedAttributes = [
    'id',
    'aria-labelledby',
    'aria-describedby',
    'aria-controls',
    'for',
  ];

  elements.forEach(element => {
    inspectedAttributes.forEach(
      attribute => {
        const value =
          element.getAttribute(
            attribute,
          );

        if (value) {
          values.push(value);
        }
      },
    );
  });

  const generatedBases =
    new Set<string>();

  values.forEach(value => {
    const matches =
      value.match(
        /slider_[A-Za-z0-9]+(?=-(?:label|value)\b)/g,
      );

    matches?.forEach(
      match => {
        generatedBases.add(
          match,
        );
      },
    );
  });

  if (
    generatedBases.size === 0
  ) {
    return;
  }

  const attributesToNormalize = [
    'id',
    'aria-labelledby',
    'aria-describedby',
    'aria-controls',
    'for',
  ];

  elements.forEach(element => {
    attributesToNormalize.forEach(
      attribute => {
        const value =
          element.getAttribute(
            attribute,
          );

        if (!value) {
          return;
        }

        let normalizedValue =
          value;

        generatedBases.forEach(
          generatedBase => {
            normalizedValue =
              normalizedValue
                .split(
                  generatedBase,
                )
                .join(
                  'slider-test',
                );
          },
        );

        if (
          normalizedValue !==
          value
        ) {
          element.setAttribute(
            attribute,
            normalizedValue,
          );
        }
      },
    );
  });
}

function expectStableSnapshot(
  root: HTMLElement,
  hint: string,
): void {
  const snapshotRoot =
    root.cloneNode(
      true,
    ) as HTMLElement;

  normalizeGeneratedSliderIds(
    snapshotRoot,
  );

  expect(
    snapshotRoot,
  ).toMatchSnapshot(
    hint,
  );
}

function mockControlsRects(
  page: any,
  {
    left = 0,
    width = 200,
    top = 0,
    height = 20,
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
  'slider-basic-component',
  () => {
    test(
      'renders with defaults (snapshot) + a11y slider element',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component />
            ),
          });

        const root =
          getRoot(page);

        expect(
          getThumbContainer(root),
        ).toBeTruthy();

        expect(
          getMovingTrack(root),
        ).toBeTruthy();

        expect(
          getLeftTextbox(root),
        ).toBeTruthy();

        expect(
          getRightTextbox(root),
        ).toBeTruthy();

        expect(
          getMinValueLabel(root)
            ?.textContent
            ?.trim(),
        ).toBe('0');

        expect(
          getMaxValueLabel(root)
            ?.textContent
            ?.trim(),
        ).toBe('100');

        const sliders =
          getAllSliders(root);

        expect(
          sliders.length,
        ).toBe(1);

        const slider =
          getSliderEl(root)!;

        expect(
          slider.getAttribute(
            'aria-valuemin',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-valuemax',
          ),
        ).toBe('100');

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe('0');

        expect(
          slider.getAttribute(
            'aria-orientation',
          ),
        ).toBe(
          'horizontal',
        );

        expect(
          slider.getAttribute(
            'aria-label',
          ) ||
            slider.getAttribute(
              'aria-labelledby',
            ),
        ).toBeTruthy();

        expectStableSnapshot(
          root,
          'default-render',
        );
      },
    );

    test(
      'parses tickValues from JSON attribute and shows tick labels',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                min={0}
                max={100}
                value={50}
                unit="%"
                tick-values="[0,25,50,75,100]"
                tick-labels={true}
                ticks={5}
              />
            ),
          });

        const root =
          getRoot(page);

        const ticks =
          getTicks(root);

        expect(
          ticks.length,
        ).toBe(5);

        const labels =
          getTickLabels(root);

        expect(
          labels.length,
        ).toBe(5);

        expect(
          labels.map(
            element =>
              element.textContent
                ?.trim(),
          ),
        ).toEqual([
          '0%',
          '25%',
          '50%',
          '75%',
          '100%',
        ]);

        expect(
          getMinValueLabel(root),
        ).toBeNull();

        expect(
          getMaxValueLabel(root),
        ).toBeNull();

        const slider =
          getSliderEl(root)!;

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('50');

        expect(
          slider.getAttribute(
            'aria-valuetext',
          ),
        ).toBe(
          '50%',
        );

        expectStableSnapshot(
          root,
          'ticks-with-labels',
        );
      },
    );

    test(
      'hides min/max labels when tickValues are provided even if tick labels are off',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                min={0}
                max={100}
                value={50}
                tick-values="[0,25,50,75,100]"
              />
            ),
          });

        const root =
          getRoot(page);

        expect(
          getMinValueLabel(root),
        ).toBeNull();

        expect(
          getMaxValueLabel(root),
        ).toBeNull();
      },
    );

    test(
      'keyboard ArrowRight/ArrowLeft without snapToTicks increments by 1 step',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                min={0}
                max={10}
                value={5}
              />
            ),
          });

        const host =
          getRoot(page);

        const slider =
          getSliderEl(host)!;

        const spy =
          jest.fn();

        host.addEventListener(
          'valueChange',
          (
            event: CustomEvent<{
              value: number;
            }>,
          ) =>
            spy(
              event.detail?.value,
            ),
        );

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key:
                'ArrowRight',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          spy,
        ).toHaveBeenLastCalledWith(
          6,
        );

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key:
                'ArrowLeft',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          spy,
        ).toHaveBeenLastCalledWith(
          5,
        );

        expectStableSnapshot(
          host,
          'keyboard-no-snap',
        );
      },
    );

    test(
      'vertical keyboard navigation ignores left/right and uses up/down',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                min={0}
                max={10}
                value={5}
                orientation="vertical"
              />
            ),
          });

        const host =
          getRoot(page);

        const slider =
          getSliderEl(host)!;

        const spy =
          jest.fn();

        host.addEventListener(
          'valueChange',
          (
            event: CustomEvent<{
              value: number;
            }>,
          ) =>
            spy(
              event.detail?.value,
            ),
        );

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key:
                'ArrowRight',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          spy,
        ).not.toHaveBeenCalled();

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('5');

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key:
                'ArrowUp',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          spy,
        ).toHaveBeenLastCalledWith(
          6,
        );

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('6');

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key:
                'ArrowDown',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          spy,
        ).toHaveBeenLastCalledWith(
          5,
        );

        expect(
          slider.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('5');

        expectStableSnapshot(
          host,
          'keyboard-vertical',
        );
      },
    );

    test(
      'keyboard snapping to tickValues goes to next/prev tick',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                min={0}
                max={60}
                value={20}
                snap-to-ticks={true}
                tick-values="[0,20,40,60]"
              />
            ),
          });

        const host =
          getRoot(page);

        const slider =
          getSliderEl(host)!;

        const spy =
          jest.fn();

        host.addEventListener(
          'valueChange',
          (
            event: CustomEvent<{
              value: number;
            }>,
          ) =>
            spy(
              event.detail?.value,
            ),
        );

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key:
                'ArrowRight',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          spy,
        ).toHaveBeenLastCalledWith(
          40,
        );

        slider.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key:
                'ArrowLeft',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          spy,
        ).toHaveBeenLastCalledWith(
          20,
        );

        expectStableSnapshot(
          host,
          'keyboard-with-snap',
        );
      },
    );

    test(
      'horizontal drag changes value (no snap), and snapToTicks snaps to nearest',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                min={0}
                max={100}
                value={0}
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

          window.dispatchEvent(
            new MouseEvent(
              'mouseup',
              {
                bubbles: true,
              },
            ),
          );

          await page.waitForChanges();

          const valueText =
            getRightTextbox(
              host,
            )?.textContent
              ?.trim();

          expect(
            Number(
              valueText,
            ),
          ).toBeGreaterThanOrEqual(
            49,
          );

          expect(
            Number(
              valueText,
            ),
          ).toBeLessThanOrEqual(
            51,
          );
        } finally {
          teardown();
        }

        const page2 =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                min={0}
                max={100}
                value={0}
                snap-to-ticks={true}
                tick-values="[0,25,50,75,100]"
              />
            ),
          });

        const teardown2 =
          mockControlsRects(
            page2,
            {
              left: 0,
              width: 200,
              top: 0,
              height: 20,
            },
          );

        try {
          const host2 =
            getRoot(page2);

          const slider2 =
            getSliderEl(
              host2,
            )!;

          slider2.dispatchEvent(
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
                clientX: 90,
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

          await page2.waitForChanges();

          const valueText2 =
            getRightTextbox(
              host2,
            )?.textContent
              ?.trim();

          expect(
            valueText2,
          ).toBe('50');

          expectStableSnapshot(
            host2,
            'drag-with-snap',
          );
        } finally {
          teardown2();
        }
      },
    );

    test(
      'vertical drag changes value and moving track grows from bottom',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                min={0}
                max={100}
                value={0}
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
          ).toBe('50');

          expect(
            slider.getAttribute(
              'aria-valuetext',
            ),
          ).toBe('50');

          let movingTrack =
            getMovingTrack(
              host,
            )!;

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
            'height: 50%',
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
          ).toBe('100');

          expect(
            slider.getAttribute(
              'aria-valuetext',
            ),
          ).toBe('100');

          movingTrack =
            getMovingTrack(
              host,
            )!;

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
            'height: 100%',
          );

          expectStableSnapshot(
            host,
            'drag-vertical',
          );
        } finally {
          teardown();
        }
      },
    );

    test(
      'hideTextBoxes hides both; individual flags hide respective side',
      async () => {
        const pageA =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                value={33}
                hide-text-boxes={true}
              />
            ),
          });

        const rootA =
          getRoot(pageA);

        expect(
          getLeftTextbox(
            rootA,
          ),
        ).toBeNull();

        expect(
          getRightTextbox(
            rootA,
          ),
        ).toBeNull();

        expectStableSnapshot(
          rootA,
          'hidden-both',
        );

        const pageB =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                value={33}
                hide-left-text-box={true}
              />
            ),
          });

        const rootB =
          getRoot(pageB);

        expect(
          getLeftTextbox(
            rootB,
          ),
        ).toBeNull();

        expect(
          getRightTextbox(
            rootB,
          ),
        ).toBeTruthy();

        expectStableSnapshot(
          rootB,
          'hidden-left',
        );

        const pageC =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                value={33}
                hide-right-text-box={true}
              />
            ),
          });

        const rootC =
          getRoot(pageC);

        expect(
          getLeftTextbox(
            rootC,
          ),
        ).toBeTruthy();

        expect(
          getRightTextbox(
            rootC,
          ),
        ).toBeNull();

        expectStableSnapshot(
          rootC,
          'hidden-right',
        );
      },
    );

    test(
      'applies variant class to moving track and thumb container',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                value={20}
                variant="danger"
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
          'danger',
        );

        expect(
          thumb.className,
        ).toContain(
          'danger',
        );

        expectStableSnapshot(
          root,
          'variant-danger',
        );
      },
    );

    test(
      'renders label and sliderThumbLabel modes',
      async () => {
        const pageA =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                label="Volume"
                value={7}
                unit="%"
              />
            ),
          });

        const rootA =
          getRoot(pageA);

        const labelEl =
          rootA.querySelector(
            'label.form-control-label',
          ) as HTMLElement | null;

        expect(
          labelEl,
        ).toBeTruthy();

        expect(
          labelEl!
            .textContent,
        ).toContain(
          'Volume',
        );

        expect(
          rootA.querySelector(
            '.slider-thumb-label',
          ),
        ).toBeNull();

        const sliderA =
          getSliderEl(
            rootA,
          )!;

        const labelledBy =
          sliderA.getAttribute(
            'aria-labelledby',
          );

        expect(
          labelledBy,
        ).toBeTruthy();

        expect(
          labelledBy &&
            !!rootA.querySelector(
              `#${labelledBy}`,
            ),
        ).toBe(true);

        expectStableSnapshot(
          rootA,
          'label-no-thumb',
        );

        const pageB =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                value={7}
                unit="%"
                slider-thumb-label={true}
              />
            ),
          });

        const rootB =
          getRoot(pageB);

        expect(
          rootB.querySelector(
            'label.form-control-label',
          ),
        ).toBeNull();

        expect(
          getThumbLabel(
            rootB,
          ),
        ).toBeTruthy();

        const sliderB =
          getSliderEl(
            rootB,
          )!;

        expect(
          sliderB.getAttribute(
            'aria-label',
          ),
        ).toBeTruthy();

        expectStableSnapshot(
          rootB,
          'thumb-label',
        );
      },
    );

    test(
      'sliderThumbLabel renders in vertical orientation',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                value={70}
                label="Volume"
                slider-thumb-label={true}
                orientation="vertical"
              />
            ),
          });

        const root =
          getRoot(page);

        const thumbLabel =
          getThumbLabel(
            root,
          );

        expect(
          root.querySelector(
            'label.form-control-label',
          ),
        ).toBeNull();

        expect(
          thumbLabel,
        ).toBeTruthy();

        expect(
          thumbLabel
            ?.textContent
            ?.trim(),
        ).toBe('70');

        expect(
          getSliderEl(
            root,
          )?.getAttribute(
            'aria-orientation',
          ),
        ).toBe(
          'vertical',
        );

        expectStableSnapshot(
          root,
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
              SliderBasicComponent,
            ],
            template: () => (
              <div>
                <div id="ext-label">
                  External label
                </div>

                <div id="ext-help">
                  External help
                </div>

                <slider-basic-component
                  value={10}
                  min={0}
                  max={20}
                  aria-label="Ignored"
                  aria-labelledby="ext-label"
                  aria-describedby="ext-help"
                />
              </div>
            ),
          });

        const slider =
          page.body
            .querySelector(
              'slider-basic-component',
            )!
            .querySelector(
              '[role="slider"]',
            ) as HTMLElement;

        expect(
          slider.getAttribute(
            'aria-labelledby',
          ),
        ).toBe(
          'ext-label',
        );

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
          !!page.body.querySelector(
            '#ext-label',
          ),
        ).toBe(true);

        expect(
          !!page.body.querySelector(
            '#ext-help',
          ),
        ).toBe(true);
      },
    );

    test(
      'disabled: slider is not focusable and sets aria-disabled',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                disabled={true}
                value={5}
              />
            ),
          });

        const root =
          getRoot(page);

        const slider =
          getSliderEl(
            root,
          )!;

        expect(
          slider.getAttribute(
            'aria-disabled',
          ),
        ).toBe(
          'true',
        );

        expect(
          slider.getAttribute(
            'tabindex',
          ),
        ).toBe('-1');

        expectStableSnapshot(
          root,
          'disabled',
        );
      },
    );

    test(
      'vertical orientation sets vertical classes, aria-orientation, and bottom-anchored moving track',
      async () => {
        const page =
          await newSpecPage({
            components: [
              SliderBasicComponent,
            ],
            template: () => (
              <slider-basic-component
                value={50}
                orientation="vertical"
              />
            ),
          });

        const root =
          getRoot(page);

        const slider =
          getSliderEl(
            root,
          )!;

        const sliderShell =
          root.querySelector(
            '.slider',
          ) as HTMLElement;

        const controls =
          root.querySelector(
            '.slider-controls',
          ) as HTMLElement;

        const movingTrack =
          getMovingTrack(
            root,
          )!;

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
        ).toBe(
          'vertical',
        );

        expect(
          style,
        ).toContain(
          'bottom: 0',
        );

        expect(
          style,
        ).toContain(
          'height: 50%',
        );

        expectStableSnapshot(
          root,
          'vertical-orientation',
        );
      },
    );
  },
);
