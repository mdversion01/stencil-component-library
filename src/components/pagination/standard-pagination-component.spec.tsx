// File: src/components/pagination/standard-pagination-component.spec.tsx

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { StandardPagination } from './standard-pagination-component';

function normalizeDynamicIds(
  root: HTMLElement,
): void {
  const rangeStatus =
    root.querySelector(
      '[role="status"][id^="spc-range-spc-"]',
    ) as HTMLElement | null;

  if (!rangeStatus) {
    return;
  }

  const originalId =
    rangeStatus.id;

  const stableId =
    'spc-range-test';

  rangeStatus.id =
    stableId;

  Array.from(
    root.querySelectorAll(
      '[aria-describedby]',
    ),
  ).forEach(element => {
    const describedBy =
      element.getAttribute(
        'aria-describedby',
      );

    if (!describedBy) {
      return;
    }

    const ids =
      describedBy
        .split(/\s+/)
        .filter(Boolean)
        .map(id =>
          id === originalId
            ? stableId
            : id,
        );

    element.setAttribute(
      'aria-describedby',
      ids.join(' '),
    );
  });
}

function getPageButtons(
  root: HTMLElement,
): HTMLButtonElement[] {
  return Array.from(
    root.querySelectorAll(
      'button.page-link',
    ),
  ) as HTMLButtonElement[];
}

function getAriaLabels(
  buttons: HTMLButtonElement[],
): string[] {
  return buttons.map(
    button =>
      button.getAttribute(
        'aria-label',
      ) || '',
  );
}

function getButtonText(
  buttons: HTMLButtonElement[],
): string[] {
  return buttons
    .map(
      button =>
        (
          button.textContent ||
          ''
        ).trim(),
    )
    .filter(Boolean);
}

describe(
  'standard-pagination-component',
  () => {
    it(
      'default snapshot with first/prev/next/last (text goToButtons)',
      async () => {
        const page =
          await newSpecPage({
            components: [
              StandardPagination,
            ],
            template: () => (
              <standard-pagination-component
                currentPage={3}
                totalRows={90}
                pageSize={10}
                limit={5}
                paginationLayout="center"
                goToButtons="text"
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const status =
          root.querySelector(
            '[role="status"]',
          ) as HTMLElement | null;

        expect(
          status,
        ).toBeTruthy();

        expect(
          status?.textContent?.trim(),
        ).toBe(
          '21-30 of 90',
        );

        const pagination =
          root.querySelector(
            'ul.pagination',
          ) as HTMLElement | null;

        expect(
          pagination,
        ).toBeTruthy();

        expect(
          pagination?.getAttribute(
            'aria-describedby',
          ),
        ).toBe(
          status?.id,
        );

        const buttons =
          getPageButtons(root);

        const ariaLabels =
          getAriaLabels(
            buttons,
          );

        expect(
          ariaLabels,
        ).toContain(
          'Go to first page',
        );

        expect(
          ariaLabels,
        ).toContain(
          'Go to previous page',
        );

        expect(
          ariaLabels,
        ).toContain(
          'Go to next page',
        );

        expect(
          ariaLabels,
        ).toContain(
          'Go to last page',
        );

        normalizeDynamicIds(
          root,
        );

        expect(
          page.root,
        ).toMatchSnapshot(
          'default-with-text-go-to-buttons',
        );
      },
    );

    it(
      'does not render <undefined> wrapper (Fragments handled)',
      async () => {
        const page =
          await newSpecPage({
            components: [
              StandardPagination,
            ],
            template: () => (
              <standard-pagination-component
                currentPage={1}
                totalRows={30}
                pageSize={10}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        expect(
          root.querySelector(
            'undefined',
          ),
        ).toBeNull();

        expect(
          root.querySelector(
            'nav[aria-label="Pagination"]',
          ),
        ).toBeTruthy();
      },
    );

    it(
      'hideGoToButtons removes first/prev/next/last controls',
      async () => {
        const page =
          await newSpecPage({
            components: [
              StandardPagination,
            ],
            template: () => (
              <standard-pagination-component
                currentPage={2}
                totalRows={50}
                pageSize={10}
                hideGoToButtons
                goToButtons="text"
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const buttons =
          getPageButtons(root);

        const ariaLabels =
          getAriaLabels(
            buttons,
          );

        expect(
          ariaLabels.some(
            label =>
              label.includes(
                'Go to first page',
              ),
          ),
        ).toBe(false);

        expect(
          ariaLabels.some(
            label =>
              label.includes(
                'Go to previous page',
              ),
          ),
        ).toBe(false);

        expect(
          ariaLabels.some(
            label =>
              label.includes(
                'Go to next page',
              ),
          ),
        ).toBe(false);

        expect(
          ariaLabels.some(
            label =>
              label.includes(
                'Go to last page',
              ),
          ),
        ).toBe(false);

        const numericText =
          getButtonText(
            buttons,
          );

        expect(
          numericText.some(
            text =>
              /^\d+$/.test(
                text,
              ),
          ),
        ).toBe(true);

        const status =
          root.querySelector(
            '[role="status"]',
          ) as HTMLElement | null;

        expect(
          status,
        ).toBeTruthy();

        expect(
          status?.textContent?.trim(),
        ).toBe(
          '11-20 of 50',
        );

        normalizeDynamicIds(
          root,
        );

        expect(
          page.root,
        ).toMatchSnapshot(
          'hide-go-to-buttons',
        );
      },
    );
  },
);
