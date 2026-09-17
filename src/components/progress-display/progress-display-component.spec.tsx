// File: src/components/progress-display/progress-display-component.spec.tsx

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { ProgressDisplayComponent } from './progress-display-component';

function getFirstProgressbar(
  root: HTMLElement,
): HTMLElement {
  const element =
    root.querySelector(
      '[role="progressbar"]',
    ) as HTMLElement | null;

  if (!element) {
    throw new Error(
      'progressbar element not found',
    );
  }

  return element;
}

function normalizeGeneratedProgressIds(
  root: HTMLElement,
): void {
  const elementsWithIds = Array.from(
    root.querySelectorAll('[id]'),
  ) as HTMLElement[];

  const replacements =
    new Map<string, string>();

  elementsWithIds.forEach(element => {
    const id =
      element.id;

    if (
      /^progress_[A-Za-z0-9]+-group$/.test(
        id,
      )
    ) {
      replacements.set(
        id,
        'progress-test-group',
      );
    }

    if (
      /^progress_[A-Za-z0-9]+-label$/.test(
        id,
      )
    ) {
      replacements.set(
        id,
        'progress-test-label',
      );
    }
  });

  if (
    replacements.size === 0
  ) {
    return;
  }

  const allElements: Element[] = [
    root,
    ...Array.from(
      root.querySelectorAll('*'),
    ),
  ];

  const referenceAttributes = [
    'id',
    'aria-labelledby',
    'aria-describedby',
    'aria-controls',
    'for',
  ];

  allElements.forEach(element => {
    referenceAttributes.forEach(
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

        replacements.forEach(
          (
            stableId,
            generatedId,
          ) => {
            normalizedValue =
              normalizedValue
                .split(generatedId)
                .join(stableId);
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
  normalizeGeneratedProgressIds(
    root,
  );

  expect(
    root,
  ).toMatchSnapshot(
    hint,
  );
}

describe(
  'progress-display-component',
  () => {
    it(
      'linear (default) snapshot + a11y basics',
      async () => {
        const page =
          await newSpecPage({
            components: [
              ProgressDisplayComponent,
            ],
            template: () => (
              <progress-display-component
                value={35}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const progressbar =
          getFirstProgressbar(
            root,
          );

        expect(
          progressbar.getAttribute(
            'role',
          ),
        ).toBe(
          'progressbar',
        );

        expect(
          progressbar.getAttribute(
            'aria-valuemin',
          ),
        ).toBe('0');

        expect(
          progressbar.getAttribute(
            'aria-valuemax',
          ),
        ).toBe('100');

        expect(
          progressbar.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('35');

        const ariaLabel =
          progressbar.getAttribute(
            'aria-label',
          );

        const ariaLabelledBy =
          progressbar.getAttribute(
            'aria-labelledby',
          );

        expect(
          ariaLabel ||
            ariaLabelledBy,
        ).toBeTruthy();

        expectStableSnapshot(
          root,
          'linear-default',
        );
      },
    );

    it(
      'linear with showProgress + striped + animated + variant (adds aria-valuetext)',
      async () => {
        const page =
          await newSpecPage({
            components: [
              ProgressDisplayComponent,
            ],
            template: () => (
              <progress-display-component
                value={50}
                showProgress
                striped
                animated
                variant="success"
                precision={1}
                height={16}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const progressbar =
          getFirstProgressbar(
            root,
          );

        expect(
          progressbar.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('50');

        expect(
          progressbar.getAttribute(
            'aria-valuetext',
          ),
        ).toBe(
          '50.0%',
        );

        expectStableSnapshot(
          root,
          'linear-show-progress-striped-animated',
        );
      },
    );

    it(
      'circular snapshot (showProgress) + a11y basics',
      async () => {
        const page =
          await newSpecPage({
            components: [
              ProgressDisplayComponent,
            ],
            template: () => (
              <progress-display-component
                circular
                value={25}
                showProgress
                size={60}
                width={6}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const progressbar =
          getFirstProgressbar(
            root,
          );

        expect(
          progressbar.getAttribute(
            'role',
          ),
        ).toBe(
          'progressbar',
        );

        expect(
          progressbar.getAttribute(
            'aria-valuemin',
          ),
        ).toBe('0');

        expect(
          progressbar.getAttribute(
            'aria-valuemax',
          ),
        ).toBe('100');

        expect(
          progressbar.getAttribute(
            'aria-valuenow',
          ),
        ).toBe('25');

        expect(
          progressbar.getAttribute(
            'aria-valuetext',
          ),
        ).toBe(
          '25%',
        );

        expectStableSnapshot(
          root,
          'circular-show-progress',
        );
      },
    );

    it(
      'indeterminate progress omits aria-valuenow/max and sets aria-busy',
      async () => {
        const page =
          await newSpecPage({
            components: [
              ProgressDisplayComponent,
            ],
            template: () => (
              <progress-display-component
                indeterminate
                value={50}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const progressbar =
          getFirstProgressbar(
            root,
          );

        expect(
          progressbar.getAttribute(
            'role',
          ),
        ).toBe(
          'progressbar',
        );

        expect(
          progressbar.getAttribute(
            'aria-busy',
          ),
        ).toBe(
          'true',
        );

        expect(
          progressbar.getAttribute(
            'aria-valuenow',
          ),
        ).toBeNull();

        expect(
          progressbar.getAttribute(
            'aria-valuemax',
          ),
        ).toBeNull();

        expect(
          progressbar.getAttribute(
            'aria-valuemin',
          ),
        ).toBeNull();

        expectStableSnapshot(
          root,
          'indeterminate',
        );
      },
    );

    it(
      'multi bars from JSON attribute snapshot + a11y group',
      async () => {
        const barsJson =
          JSON.stringify([
            {
              value: 25,
              variant:
                'primary',
              showProgress:
                true,
            },
            {
              value: 15,
              variant:
                'success',
              striped:
                true,
            },
            {
              value: 10,
              variant:
                'danger',
              animated:
                true,
              progressAlign:
                'right',
            },
          ]);

        const page =
          await newSpecPage({
            components: [
              ProgressDisplayComponent,
            ],
            template: () => (
              <progress-display-component
                multi
                height={22}
                bars={barsJson}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const group =
          root.querySelector(
            '[role="group"]',
          ) as HTMLElement | null;

        expect(
          group,
        ).toBeTruthy();

        expect(
          group?.getAttribute(
            'aria-label',
          ),
        ).toBe(
          'Progress',
        );

        const bars =
          root.querySelectorAll(
            '[role="progressbar"]',
          );

        expect(
          bars.length,
        ).toBe(3);

        expect(
          (
            bars[0] as HTMLElement
          ).getAttribute(
            'aria-valuetext',
          ),
        ).toBe(
          '25%',
        );

        expectStableSnapshot(
          root,
          'multi-bars',
        );
      },
    );

    it(
      'bars watcher: update via attribute re-renders',
      async () => {
        const initial =
          JSON.stringify([
            {
              value: 30,
              variant:
                'info',
            },
          ]);

        const updated =
          JSON.stringify([
            {
              value: 40,
              variant:
                'warning',
              showProgress:
                true,
            },
            {
              value: 10,
              variant:
                'dark',
              progressAlign:
                'right',
            },
          ]);

        const page =
          await newSpecPage({
            components: [
              ProgressDisplayComponent,
            ],
            template: () => (
              <progress-display-component
                multi
                bars={initial}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        expect(
          root.querySelectorAll(
            '.progress-bar',
          ).length,
        ).toBe(1);

        root.setAttribute(
          'bars',
          updated,
        );

        await page.waitForChanges();

        const bars =
          root.querySelectorAll(
            '.progress-bar',
          );

        expect(
          bars.length,
        ).toBe(2);

        expect(
          (
            bars[0] as HTMLElement
          ).getAttribute(
            'aria-valuenow',
          ),
        ).toBe(
          '40',
        );

        expect(
          (
            bars[0] as HTMLElement
          ).getAttribute(
            'aria-valuetext',
          ),
        ).toBe(
          '40%',
        );

        expect(
          (
            bars[1] as HTMLElement
          ).getAttribute(
            'aria-valuenow',
          ),
        ).toBe(
          '10',
        );

        expectStableSnapshot(
          root,
          'bars-watcher-updated',
        );
      },
    );

    it(
      'label prop wires aria-labelledby to a real label id (single)',
      async () => {
        const page =
          await newSpecPage({
            components: [
              ProgressDisplayComponent,
            ],
            template: () => (
              <progress-display-component
                value={10}
                label="Loading widgets"
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const progressbar =
          getFirstProgressbar(
            root,
          );

        const labelledBy =
          progressbar.getAttribute(
            'aria-labelledby',
          );

        expect(
          labelledBy,
        ).toBeTruthy();

        const labelElement =
          labelledBy
            ? (root.querySelector(
                `[id="${labelledBy}"]`,
              ) as HTMLElement | null)
            : null;

        expect(
          labelElement,
        ).toBeTruthy();

        expect(
          labelElement!
            .textContent,
        ).toBe(
          'Loading widgets',
        );

        expect(
          progressbar.getAttribute(
            'aria-label',
          ),
        ).toBeNull();

        expectStableSnapshot(
          root,
          'labelled-progress',
        );
      },
    );
  },
);
