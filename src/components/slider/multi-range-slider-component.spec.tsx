// File: src/components/slider/multi-range-slider-component.spec.tsx

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { MultiRangeSliderComponent } from './multi-range-slider-component';

// ---------- helpers ----------------------------------------------------------

const qs = (
  root: Element | null,
  selector: string,
): HTMLElement | null =>
  root
    ? (root.querySelector(selector) as HTMLElement | null)
    : null;

function getRoot(page: any): HTMLElement {
  return page.root as HTMLElement;
}

function getControls(
  root: HTMLElement,
): HTMLDivElement | null {
  return qs(
    root,
    '.slider-controls',
  ) as HTMLDivElement | null;
}

function getMovingTracks(
  root: HTMLElement,
): HTMLElement[] {
  return Array.from(
    root.querySelectorAll(
      '.slider-track.multi',
    ),
  ) as HTMLElement[];
}

function getLowerThumb(
  root: HTMLElement,
): HTMLElement | null {
  return qs(
    root,
    '.slider-thumb-container.lower-thumb',
  );
}

function getUpperThumb(
  root: HTMLElement,
): HTMLElement | null {
  return qs(
    root,
    '.slider-thumb-container.upper-thumb',
  );
}

function getLeftTextbox(
  root: HTMLElement,
): HTMLElement | null {
  return qs(
    root,
    '.slider-value-left',
  );
}

function getRightTextbox(
  root: HTMLElement,
): HTMLElement | null {
  return qs(
    root,
    '.slider-value-right',
  );
}

function getMinValueLabel(
  root: HTMLElement,
): HTMLElement | null {
  return qs(
    root,
    '.slider-min-value',
  );
}

function getMaxValueLabel(
  root: HTMLElement,
): HTMLElement | null {
  return qs(
    root,
    '.slider-max-value',
  );
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

function getAllSliders(
  root: HTMLElement,
): HTMLElement[] {
  return Array.from(
    root.querySelectorAll(
      '[role="slider"]',
    ),
  ) as HTMLElement[];
}

function getLowerSlider(
  root: HTMLElement,
): HTMLElement | null {
  return qs(
    root,
    '.slider-thumb-container.lower-thumb[role="slider"]',
  );
}

function getUpperSlider(
  root: HTMLElement,
): HTMLElement | null {
  return qs(
    root,
    '.slider-thumb-container.upper-thumb[role="slider"]',
  );
}

function getThumbLabels(
  root: HTMLElement,
): HTMLElement[] {
  return Array.from(
    root.querySelectorAll(
      '.slider-thumb-label',
    ),
  ) as HTMLElement[];
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

function normalizeGeneratedMultiSliderIds(
  root: HTMLElement,
): void {
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

  const generatedBases =
    new Set<string>();

  elements.forEach(element => {
    inspectedAttributes.forEach(
      attribute => {
        const value =
          element.getAttribute(
            attribute,
          );

        if (!value) {
          return;
        }

        const matches =
          value.match(
            /mslider_[A-Za-z0-9]+(?=-(?:label|value)\b)/g,
          );

        matches?.forEach(
          match => {
            generatedBases.add(
              match,
            );
          },
        );
      },
    );
  });

  if (
    generatedBases.size === 0
  ) {
    return;
  }

  elements.forEach(element => {
    inspectedAttributes.forEach(
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
                  'mslider-test',
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

  normalizeGeneratedMultiSliderIds(
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
      getBoundingClientRect: () => DOMRect;
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
        getBoundingClientRect: () => DOMRect;
      }
    ).getBoundingClientRect =
      original;
  };
}

// ---------- tests ------------------------------------------------------------

describe(
  'multi-range-slider-component',
  () => {
    test(
      'renders with defaults (snapshot) + two slider roles',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component />
            ),
          });

        const root =
          getRoot(page);

        expect(
          getControls(root),
        ).toBeTruthy();

        expect(
          getMovingTracks(root)
            .length,
        ).toBeGreaterThan(0);

        expect(
          getLowerThumb(root),
        ).toBeTruthy();

        expect(
          getUpperThumb(root),
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
        ).toBe(2);

        const lower =
          getLowerSlider(
            root,
          )!;

        const upper =
          getUpperSlider(
            root,
          )!;

        expect(
          lower.getAttribute(
            'aria-valuemin',
          ),
        ).toBe('0');

        expect(
          lower.getAttribute(
            'aria-valuemax',
          ),
        ).toBe('100');

        expect(
          lower.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('25');

        expect(
          lower.getAttribute(
            'aria-orientation',
          ),
        ).toBe(
          'horizontal',
        );

        expect(
          upper.getAttribute(
            'aria-valuemin',
          ),
        ).toBe('0');

        expect(
          upper.getAttribute(
            'aria-valuemax',
          ),
        ).toBe('100');

        expect(
          upper.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('75');

        expect(
          upper.getAttribute(
            'aria-orientation',
          ),
        ).toBe(
          'horizontal',
        );

        expectStableSnapshot(
          root,
          'default-render',
        );
      },
    );

    test(
      'parses tickValues JSON and renders tick labels',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
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

        const root =
          getRoot(page);

        const ticks =
          getTicks(root);

        const labels =
          getTickLabels(root);

        expect(
          ticks.length,
        ).toBe(5);

        expect(
          labels.length,
        ).toBe(5);

        expect(
          getMinValueLabel(root),
        ).toBeNull();

        expect(
          getMaxValueLabel(root),
        ).toBeNull();

        expectStableSnapshot(
          root,
          'ticks-and-labels',
        );
      },
    );

    test(
      'hides min/max labels when tickValues are provided even if tickLabels are false',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                min={0}
                max={100}
                lower-value={20}
                upper-value={80}
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
      'keyboard arrows/Home/End adjust the focused thumb and emit rangeChange',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                min={0}
                max={10}
                lower-value={2}
                upper-value={8}
              />
            ),
          });

        const host =
          getRoot(page);

        const lower =
          getLowerSlider(
            host,
          )!;

        const upper =
          getUpperSlider(
            host,
          )!;

        const spy =
          jest.fn();

        host.addEventListener(
          'rangeChange',
          (
            event: CustomEvent<{
              lowerValue: number;
              upperValue: number;
            }>,
          ) =>
            spy(
              event.detail,
            ),
        );

        lower.dispatchEvent(
          new FocusEvent(
            'focus',
            {
              bubbles: true,
            },
          ),
        );

        lower.dispatchEvent(
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
        ).toHaveBeenLastCalledWith({
          lowerValue: 3,
          upperValue: 8,
        });

        expect(
          lower.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('3');

        expect(
          upper.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('8');

        upper.dispatchEvent(
          new FocusEvent(
            'focus',
            {
              bubbles: true,
            },
          ),
        );

        upper.dispatchEvent(
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
        ).toHaveBeenLastCalledWith({
          lowerValue: 3,
          upperValue: 7,
        });

        expect(
          upper.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('7');

        expect(
          lower.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('3');

        lower.dispatchEvent(
          new FocusEvent(
            'focus',
            {
              bubbles: true,
            },
          ),
        );

        lower.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'Home',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        const homeDetail =
          spy.mock.calls[
            spy.mock.calls.length - 1
          ][0];

        expect(
          homeDetail.lowerValue,
        ).toBe(0);

        expect(
          homeDetail.upperValue,
        ).toBeGreaterThan(
          homeDetail.lowerValue,
        );

        upper.dispatchEvent(
          new FocusEvent(
            'focus',
            {
              bubbles: true,
            },
          ),
        );

        upper.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'End',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        const endDetail =
          spy.mock.calls[
            spy.mock.calls.length - 1
          ][0];

        expect(
          endDetail.upperValue,
        ).toBe(10);

        expect(
          endDetail.lowerValue,
        ).toBeLessThan(
          endDetail.upperValue,
        );

        expectStableSnapshot(
          host,
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
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                min={0}
                max={10}
                lower-value={2}
                upper-value={8}
                orientation="vertical"
              />
            ),
          });

        const host =
          getRoot(page);

        const lower =
          getLowerSlider(
            host,
          )!;

        const upper =
          getUpperSlider(
            host,
          )!;

        lower.dispatchEvent(
          new FocusEvent(
            'focus',
            {
              bubbles: true,
            },
          ),
        );

        lower.dispatchEvent(
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
          lower.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('2');

        lower.dispatchEvent(
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
          lower.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('3');

        upper.dispatchEvent(
          new FocusEvent(
            'focus',
            {
              bubbles: true,
            },
          ),
        );

        upper.dispatchEvent(
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
          upper.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('8');

        upper.dispatchEvent(
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
          upper.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('7');

        expectStableSnapshot(
          host,
          'keyboard-nav-vertical',
        );
      },
    );

    test(
      'drag lower and upper thumbs updates values (no snap)',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                min={0}
                max={100}
                lower-value={20}
                upper-value={80}
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

          const lower =
            getLowerThumb(
              host,
            )!;

          const upper =
            getUpperThumb(
              host,
            )!;

          lower.dispatchEvent(
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
                clientX: 50,
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

          upper.dispatchEvent(
            new MouseEvent(
              'mousedown',
              {
                bubbles: true,
                clientX: 200,
              },
            ),
          );

          window.dispatchEvent(
            new MouseEvent(
              'mousemove',
              {
                bubbles: true,
                clientX: 150,
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

          const leftText =
            getLeftTextbox(
              host,
            )?.textContent
              ?.trim() || '';

          const rightText =
            getRightTextbox(
              host,
            )?.textContent
              ?.trim() || '';

          expect(
            Number(
              leftText,
            ),
          ).toBeGreaterThanOrEqual(
            24,
          );

          expect(
            Number(
              leftText,
            ),
          ).toBeLessThanOrEqual(
            26,
          );

          expect(
            Number(
              rightText,
            ),
          ).toBeGreaterThanOrEqual(
            74,
          );

          expect(
            Number(
              rightText,
            ),
          ).toBeLessThanOrEqual(
            76,
          );

          const lowerSlider =
            getLowerSlider(
              host,
            )!;

          const upperSlider =
            getUpperSlider(
              host,
            )!;

          expect(
            lowerSlider.getAttribute(
              'aria-valuetext',
            ),
          ).toBe(
            leftText,
          );

          expect(
            upperSlider.getAttribute(
              'aria-valuetext',
            ),
          ).toBe(
            rightText,
          );

          expectStableSnapshot(
            host,
            'drag-both-thumbs',
          );
        } finally {
          teardown();
        }
      },
    );

    test(
      'vertical drag updates lower and upper thumbs',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                min={0}
                max={100}
                lower-value={20}
                upper-value={80}
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

          const lower =
            getLowerThumb(
              host,
            )!;

          const upper =
            getUpperThumb(
              host,
            )!;

          lower.dispatchEvent(
            new MouseEvent(
              'mousedown',
              {
                bubbles: true,
                clientY: 160,
              },
            ),
          );

          window.dispatchEvent(
            new MouseEvent(
              'mousemove',
              {
                bubbles: true,
                clientY: 120,
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

          upper.dispatchEvent(
            new MouseEvent(
              'mousedown',
              {
                bubbles: true,
                clientY: 40,
              },
            ),
          );

          window.dispatchEvent(
            new MouseEvent(
              'mousemove',
              {
                bubbles: true,
                clientY: 60,
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

          const lowerNow =
            Number(
              getLowerSlider(
                host,
              )!.getAttribute(
                'aria-valuenow',
              ),
            );

          const upperNow =
            Number(
              getUpperSlider(
                host,
              )!.getAttribute(
                'aria-valuenow',
              ),
            );

          expect(
            lowerNow,
          ).toBeGreaterThanOrEqual(
            39,
          );

          expect(
            lowerNow,
          ).toBeLessThanOrEqual(
            41,
          );

          expect(
            upperNow,
          ).toBeGreaterThanOrEqual(
            69,
          );

          expect(
            upperNow,
          ).toBeLessThanOrEqual(
            71,
          );

          expect(
            getLowerSlider(
              host,
            )?.getAttribute(
              'aria-orientation',
            ),
          ).toBe(
            'vertical',
          );

          expect(
            getUpperSlider(
              host,
            )?.getAttribute(
              'aria-orientation',
            ),
          ).toBe(
            'vertical',
          );

          expectStableSnapshot(
            host,
            'drag-both-thumbs-vertical',
          );
        } finally {
          teardown();
        }
      },
    );

    test(
      'snapToTicks snaps to nearest tick on drag',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                min={0}
                max={100}
                lower-value={10}
                upper-value={90}
                snap-to-ticks={true}
                tick-values="[0,20,40,60,80,100]"
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

          const lower =
            getLowerThumb(
              host,
            )!;

          lower.dispatchEvent(
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
                clientX: 66,
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

          const leftText =
            getLeftTextbox(
              host,
            )?.textContent
              ?.trim() || '';

          expect(
            Number(
              leftText,
            ),
          ).toBe(40);

          expect(
            getLowerSlider(
              host,
            )!.getAttribute(
              'aria-valuenow',
            ),
          ).toBe('40');

          expectStableSnapshot(
            host,
            'snap-to-ticks',
          );
        } finally {
          teardown();
        }
      },
    );

    test(
      'variant class applied to thumbs/tracks',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                variant="info"
              />
            ),
          });

        const host =
          getRoot(page);

        const lower =
          getLowerThumb(
            host,
          )!;

        const upper =
          getUpperThumb(
            host,
          )!;

        const tracks =
          getMovingTracks(
            host,
          );

        expect(
          lower.className,
        ).toContain(
          'info',
        );

        expect(
          upper.className,
        ).toContain(
          'info',
        );

        expect(
          tracks.some(
            track =>
              track.className.includes(
                'info',
              ),
          ),
        ).toBe(true);

        expectStableSnapshot(
          host,
          'variant-info',
        );
      },
    );

    test(
      'rangeFillMode inside renders one colored segment; outside renders two',
      async () => {
        const pageInside =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                lower-value={20}
                upper-value={80}
                range-fill-mode="inside"
              />
            ),
          });

        const insideRoot =
          getRoot(
            pageInside,
          );

        expect(
          getMovingTracks(
            insideRoot,
          ).length,
        ).toBe(1);

        expect(
          getMovingTracks(
            insideRoot,
          )[0].className,
        ).toContain(
          'slider-track-inside',
        );

        expectStableSnapshot(
          insideRoot,
          'range-fill-inside',
        );

        const pageOutside =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                lower-value={20}
                upper-value={80}
                range-fill-mode="outside"
              />
            ),
          });

        const outsideRoot =
          getRoot(
            pageOutside,
          );

        expect(
          getMovingTracks(
            outsideRoot,
          ).length,
        ).toBe(2);

        expect(
          getMovingTracks(
            outsideRoot,
          ).some(
            track =>
              track.className.includes(
                'slider-track-outside-left',
              ),
          ),
        ).toBe(true);

        expect(
          getMovingTracks(
            outsideRoot,
          ).some(
            track =>
              track.className.includes(
                'slider-track-outside-right',
              ),
          ),
        ).toBe(true);

        expectStableSnapshot(
          outsideRoot,
          'range-fill-outside',
        );
      },
    );

    test(
      'vertical inside range fill uses bottom + height styles',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                min={0}
                max={100}
                lower-value={20}
                upper-value={80}
                orientation="vertical"
                range-fill-mode="inside"
              />
            ),
          });

        const root =
          getRoot(page);

        const tracks =
          getMovingTracks(
            root,
          );

        expect(
          tracks.length,
        ).toBe(1);

        const style =
          getStyleAttr(
            tracks[0],
          );

        expect(
          style,
        ).toContain(
          'bottom: 20%',
        );

        expect(
          style,
        ).toContain(
          'height: 60%',
        );

        expectStableSnapshot(
          root,
          'vertical-inside-fill',
        );
      },
    );

    test(
      'vertical outside range fill uses bottom + height styles for both segments',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                min={0}
                max={100}
                lower-value={20}
                upper-value={80}
                orientation="vertical"
                range-fill-mode="outside"
              />
            ),
          });

        const root =
          getRoot(page);

        const tracks =
          getMovingTracks(
            root,
          );

        expect(
          tracks.length,
        ).toBe(2);

        const leftTrack =
          tracks.find(
            track =>
              track.className.includes(
                'slider-track-outside-left',
              ),
          )!;

        const rightTrack =
          tracks.find(
            track =>
              track.className.includes(
                'slider-track-outside-right',
              ),
          )!;

        expect(
          getStyleAttr(
            leftTrack,
          ),
        ).toContain(
          'bottom: 0%',
        );

        expect(
          getStyleAttr(
            leftTrack,
          ),
        ).toContain(
          'height: 20%',
        );

        expect(
          getStyleAttr(
            rightTrack,
          ),
        ).toContain(
          'bottom: 80%',
        );

        expect(
          getStyleAttr(
            rightTrack,
          ),
        ).toContain(
          'height: 20%',
        );

        expectStableSnapshot(
          root,
          'vertical-outside-fill',
        );
      },
    );

    test(
      'hideTextBoxes hides both; individual flags hide respective side',
      async () => {
        const pageBoth =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                hide-text-boxes={true}
              />
            ),
          });

        const rootBoth =
          getRoot(
            pageBoth,
          );

        expect(
          getLeftTextbox(
            rootBoth,
          ),
        ).toBeNull();

        expect(
          getRightTextbox(
            rootBoth,
          ),
        ).toBeNull();

        expectStableSnapshot(
          rootBoth,
          'hide-both-textboxes',
        );

        const pageLeft =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                hide-left-text-box={true}
              />
            ),
          });

        const rootLeft =
          getRoot(
            pageLeft,
          );

        expect(
          getLeftTextbox(
            rootLeft,
          ),
        ).toBeNull();

        expect(
          getRightTextbox(
            rootLeft,
          ),
        ).toBeTruthy();

        expectStableSnapshot(
          rootLeft,
          'hide-left-textbox',
        );

        const pageRight =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                hide-right-text-box={true}
              />
            ),
          });

        const rootRight =
          getRoot(
            pageRight,
          );

        expect(
          getLeftTextbox(
            rootRight,
          ),
        ).toBeTruthy();

        expect(
          getRightTextbox(
            rootRight,
          ),
        ).toBeNull();

        expectStableSnapshot(
          rootRight,
          'hide-right-textbox',
        );
      },
    );

    test(
      'label vs sliderThumbLabel rendering',
      async () => {
        const pageA =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                label="Range"
                lower-value={10}
                upper-value={20}
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
          labelEl?.textContent,
        ).toContain(
          'Range',
        );

        expect(
          rootA.querySelector(
            '.slider-thumb-label',
          ),
        ).toBeNull();

        expectStableSnapshot(
          rootA,
          'label-mode',
        );

        const pageB =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                label="Range"
                lower-value={10}
                upper-value={20}
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
          getThumbLabels(
            rootB,
          ).length,
        ).toBe(2);

        expectStableSnapshot(
          rootB,
          'thumb-label-mode',
        );
      },
    );

    test(
      'sliderThumbLabel renders in vertical orientation',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                label="Range"
                lower-value={10}
                upper-value={90}
                orientation="vertical"
                slider-thumb-label={true}
              />
            ),
          });

        const root =
          getRoot(page);

        expect(
          root.querySelector(
            'label.form-control-label',
          ),
        ).toBeNull();

        expect(
          getThumbLabels(
            root,
          ).length,
        ).toBe(2);

        expect(
          getLowerSlider(
            root,
          )?.getAttribute(
            'aria-orientation',
          ),
        ).toBe(
          'vertical',
        );

        expect(
          getUpperSlider(
            root,
          )?.getAttribute(
            'aria-orientation',
          ),
        ).toBe(
          'vertical',
        );

        expectStableSnapshot(
          root,
          'thumb-label-mode-vertical',
        );
      },
    );

    test(
      'a11y overrides: aria-labelledby wins over aria-label; describedby forwarded to both sliders',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <div>
                <div id="ext-label">
                  External label
                </div>

                <div id="ext-help">
                  External help
                </div>

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

        const host =
          page.body.querySelector(
            'multi-range-slider-component',
          ) as HTMLElement;

        const sliders =
          Array.from(
            host.querySelectorAll(
              '[role="slider"]',
            ),
          ) as HTMLElement[];

        expect(
          sliders.length,
        ).toBe(2);

        sliders.forEach(
          slider => {
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

            expect(
              splitIds(
                slider.getAttribute(
                  'aria-describedby',
                ),
              ),
            ).toContain(
              'ext-help',
            );
          },
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
      'disabled: sliders not focusable and set aria-disabled',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                disabled={true}
              />
            ),
          });

        const host =
          getRoot(page);

        const sliders =
          getAllSliders(
            host,
          );

        expect(
          sliders.length,
        ).toBe(2);

        sliders.forEach(
          slider => {
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
          },
        );

        expectStableSnapshot(
          host,
          'disabled',
        );
      },
    );

    test(
      'vertical orientation sets vertical classes and aria-orientation',
      async () => {
        const page =
          await newSpecPage({
            components: [
              MultiRangeSliderComponent,
            ],
            template: () => (
              <multi-range-slider-component
                lower-value={20}
                upper-value={80}
                orientation="vertical"
              />
            ),
          });

        const root =
          getRoot(page);

        const sliderShell =
          root.querySelector(
            '.slider',
          ) as HTMLElement;

        const controls =
          root.querySelector(
            '.slider-controls',
          ) as HTMLElement;

        const lower =
          getLowerSlider(
            root,
          )!;

        const upper =
          getUpperSlider(
            root,
          )!;

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
          lower.getAttribute(
            'aria-orientation',
          ),
        ).toBe(
          'vertical',
        );

        expect(
          upper.getAttribute(
            'aria-orientation',
          ),
        ).toBe(
          'vertical',
        );

        expectStableSnapshot(
          root,
          'vertical-orientation',
        );
      },
    );
  },
);
