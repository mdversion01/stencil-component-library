// File: src/components/accordion-container/accordion-container.spec.tsx

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { AccordionContainer } from './accordion-container';
import { Button as ButtonComponent } from '../button/button-component';

const click = (
  element: Element | null,
): void => {
  if (!element) {
    throw new Error(
      'Expected element to click, got null',
    );
  }

  element.dispatchEvent(
    new MouseEvent(
      'click',
      {
        bubbles: true,
        cancelable: true,
      },
    ),
  );
};

const firstHostBtn = (
  root: HTMLElement,
): HTMLElement | null =>
  (
    root.querySelectorAll(
      'button-component',
    )[0] as HTMLElement | null
  ) ?? null;

const innerButtonOf = (
  hostBtn: HTMLElement | null,
): HTMLButtonElement | null =>
  hostBtn
    ? (
        hostBtn.querySelector(
          'button',
        ) as HTMLButtonElement | null
      )
    : null;

const panelAt = (
  root: HTMLElement,
  index: number,
): HTMLElement | null =>
  (
    root.querySelectorAll<HTMLElement>(
      '.accordion-collapse',
    )[index] as HTMLElement | null
  ) ?? null;

const fireTransitionEnd = async (
  element: HTMLElement,
  page: {
    waitForChanges: () => Promise<void>;
  },
): Promise<void> => {
  element.dispatchEvent(
    new Event(
      'transitionend',
    ),
  );

  await page.waitForChanges();
};

// File: src/components/accordion-container/accordion-container.spec.tsx

function normalizeGeneratedAccordionIds(
  root: HTMLElement,
): void {
  const accordion =
    root.querySelector(
      '.accordion[id]',
    ) as HTMLElement | null;

  if (!accordion) {
    return;
  }

  const generatedBaseId =
    accordion.id;

  if (
    !/^acc-\d+-[A-Za-z0-9]+$/.test(
      generatedBaseId,
    )
  ) {
    return;
  }

  const stableBaseId =
    'acc-test';

  const elements: Element[] = [
    root,
    ...Array.from(
      root.querySelectorAll('*'),
    ),
  ];

  const attributes = [
    'id',
    'aria-controls',
    'aria-labelledby',
    'aria-describedby',
    'data-bs-target',
    'data-bs-parent',
    'href',
  ];

  elements.forEach(element => {
    attributes.forEach(attribute => {
      const value =
        element.getAttribute(
          attribute,
        );

      if (
        !value ||
        !value.includes(
          generatedBaseId,
        )
      ) {
        return;
      }

      element.setAttribute(
        attribute,
        value
          .split(
            generatedBaseId,
          )
          .join(
            stableBaseId,
          ),
      );
    });
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

  normalizeGeneratedAccordionIds(
    snapshotRoot,
  );

  expect(
    snapshotRoot,
  ).toMatchSnapshot(
    hint,
  );
}

describe(
  'accordion-container',
  () => {
    const sampleData = [
      {
        header: 'Header 1',
        content: 'Content 1',
      },
      {
        header: 'Header 2',
        content: 'Content 2',
      },
    ];

    it(
      'renders with given data and matches snapshot',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        expectStableSnapshot(
          page.root as HTMLElement,
          'default-data',
        );
      },
    );

    it(
      'renders outlined, block, and disabled props',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={sampleData}
                outlined
                block
                disabled
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const buttons =
          Array.from(
            root.querySelectorAll(
              'button-component',
            ),
          ) as any[];

        expect(
          buttons.length,
        ).toBe(2);

        buttons.forEach(
          (
            btnHost: any,
          ) => {
            expect(
              btnHost.outlined,
            ).toBe(true);

            expect(
              btnHost.block,
            ).toBe(true);

            expect(
              btnHost.disabled,
            ).toBe(true);

            const inner =
              btnHost.querySelector(
                'button',
              ) as HTMLButtonElement | null;

            expect(
              inner,
            ).toBeTruthy();

            expect(
              inner!.hasAttribute(
                'disabled',
              ),
            ).toBe(true);

            expect(
              inner!.classList.contains(
                'btn--block',
              ),
            ).toBe(true);
          },
        );

        expectStableSnapshot(
          root,
          'outlined-block-disabled',
        );
      },
    );

    it(
      'toggles accordion via click and matches snapshot',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const hostBtn =
          firstHostBtn(
            root,
          );

        const inner =
          innerButtonOf(
            hostBtn,
          );

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          page.rootInstance
            .openIndexes
            .has(0),
        ).toBe(true);

        expectStableSnapshot(
          root,
          'click toggle first open',
        );
      },
    );

    it(
      'handles keyboard activation (simulate click on inner button)',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const hostBtn =
          firstHostBtn(
            root,
          );

        const inner =
          innerButtonOf(
            hostBtn,
          );

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          page.rootInstance
            .openIndexes
            .has(0),
        ).toBe(true);

        expectStableSnapshot(
          root,
          'after activation open',
        );

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          page.rootInstance
            .openIndexes
            .has(0),
        ).toBe(false);

        expectStableSnapshot(
          root,
          'after activation close',
        );
      },
    );

    it(
      'icon switching with snapshot',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                icon="icon-closed,icon-open"
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        expectStableSnapshot(
          root,
          'before icon toggle',
        );

        const hostBtn =
          firstHostBtn(
            root,
          );

        const inner =
          innerButtonOf(
            hostBtn,
          );

        click(
          inner,
        );

        await page.waitForChanges();

        expectStableSnapshot(
          root,
          'after icon toggle',
        );
      },
    );

    it(
      'applies correct text size class from contentTxtSize prop',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                contentTxtSize="lg"
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const hostBtn =
          firstHostBtn(
            root,
          );

        const inner =
          innerButtonOf(
            hostBtn,
          );

        click(
          inner,
        );

        await page.waitForChanges();

        const bodies =
          root.querySelectorAll(
            '.accordion-body',
          );

        expect(
          bodies.length,
        ).toBeGreaterThan(0);

        bodies.forEach(
          body => {
            expect(
              body.classList.contains(
                'text-large',
              ),
            ).toBe(true);
          },
        );

        expectStableSnapshot(
          root,
          'text size large',
        );
      },
    );

    it(
      'renders static icon with no toggle switch',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                icon="icon-static"
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const icons =
          root.querySelectorAll(
            'icon-component',
          );

        expect(
          icons.length,
        ).toBe(2);

        icons.forEach(
          icon => {
            expect(
              icon.getAttribute(
                'icon',
              ),
            ).toBe(
              'icon-static',
            );
          },
        );

        expectStableSnapshot(
          root,
          'static icon no switch',
        );
      },
    );

    it(
      'renders gracefully when data is undefined, null, or not an array',
      async () => {
        const page1 =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={undefined}
              />
            ),
          });

        await page1.waitForChanges();

        expectStableSnapshot(
          page1.root as HTMLElement,
          'undefined data fallback',
        );

        const page2 =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={
                  null as any
                }
              />
            ),
          });

        await page2.waitForChanges();

        expectStableSnapshot(
          page2.root as HTMLElement,
          'null data fallback',
        );

        const page3 =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={
                  {} as any
                }
              />
            ),
          });

        await page3.waitForChanges();

        expectStableSnapshot(
          page3.root as HTMLElement,
          'non-array data fallback',
        );
      },
    );

    it(
      'renders correct ARIA attributes on accordion headers and panels (including hidden/inert when collapsed)',
      async () => {
        const parentId =
          'my-accordion';

        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                parentId={
                  parentId
                }
                data={[
                  {
                    header:
                      'Item 1',
                    content:
                      'Content 1',
                  },
                ]}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const expectedHeaderId =
          `${parentId}-header-0`;

        const expectedTriggerId =
          `${parentId}-trigger-0`;

        const expectedPanelId =
          `${parentId}-collapse-0`;

        const header =
          root.querySelector(
            '.accordion-header',
          )!;

        const hostBtn =
          header.querySelector(
            'button-component',
          ) as HTMLElement | null;

        const inner =
          innerButtonOf(
            hostBtn,
          );

        const panel =
          root.querySelector<HTMLElement>(
            '.accordion-collapse',
          )!;

        expect(
          header.getAttribute(
            'id',
          ),
        ).toBe(
          expectedHeaderId,
        );

        expect(
          hostBtn?.getAttribute(
            'id',
          ),
        ).toBe(
          expectedTriggerId,
        );

        expect(
          inner?.getAttribute(
            'aria-expanded',
          ),
        ).toBe(
          'false',
        );

        expect(
          inner?.getAttribute(
            'aria-controls',
          ),
        ).toBe(
          expectedPanelId,
        );

        expect(
          panel.getAttribute(
            'role',
          ),
        ).toBe(
          'region',
        );

        expect(
          panel.getAttribute(
            'aria-labelledby',
          ),
        ).toBe(
          expectedTriggerId,
        );

        expect(
          panel.getAttribute(
            'id',
          ),
        ).toBe(
          expectedPanelId,
        );

        expect(
          panel.classList.contains(
            'collapse',
          ),
        ).toBe(true);

        expect(
          panel.classList.contains(
            'show',
          ),
        ).toBe(false);

        expect(
          panel.classList.contains(
            'collapsing',
          ),
        ).toBe(false);

        expect(
          panel.getAttribute(
            'aria-hidden',
          ),
        ).toBe(
          'true',
        );

        expect(
          panel.hasAttribute(
            'hidden',
          ),
        ).toBe(true);

        expect(
          panel.hasAttribute(
            'inert',
          ),
        ).toBe(true);

        expect(
          panel.getAttribute(
            'data-bs-parent',
          ),
        ).toBeNull();

        expectStableSnapshot(
          root,
          'ARIA attributes check',
        );
      },
    );

    it(
      'closed panel becomes visible and non-inert when opened, and returns to inert when closed',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const hostBtn0 =
          firstHostBtn(
            root,
          );

        const inner0 =
          innerButtonOf(
            hostBtn0,
          );

        const panel0 =
          panelAt(
            root,
            0,
          )!;

        expect(
          panel0.classList.contains(
            'collapse',
          ),
        ).toBe(true);

        expect(
          panel0.classList.contains(
            'show',
          ),
        ).toBe(false);

        expect(
          panel0.classList.contains(
            'collapsing',
          ),
        ).toBe(false);

        expect(
          panel0.getAttribute(
            'aria-hidden',
          ),
        ).toBe(
          'true',
        );

        expect(
          panel0.hasAttribute(
            'hidden',
          ),
        ).toBe(true);

        expect(
          panel0.hasAttribute(
            'inert',
          ),
        ).toBe(true);

        click(
          inner0,
        );

        await page.waitForChanges();

        expect(
          page.rootInstance
            .openIndexes
            .has(0),
        ).toBe(true);

        expect(
          panel0.classList.contains(
            'collapsing',
          ),
        ).toBe(true);

        expect(
          panel0.getAttribute(
            'aria-hidden',
          ),
        ).toBeNull();

        expect(
          panel0.hasAttribute(
            'hidden',
          ),
        ).toBe(false);

        expect(
          panel0.hasAttribute(
            'inert',
          ),
        ).toBe(false);

        await fireTransitionEnd(
          panel0,
          page,
        );

        expect(
          panel0.classList.contains(
            'collapse',
          ),
        ).toBe(true);

        expect(
          panel0.classList.contains(
            'show',
          ),
        ).toBe(true);

        expect(
          panel0.classList.contains(
            'collapsing',
          ),
        ).toBe(false);

        expect(
          panel0.style.height,
        ).toBe('');

        click(
          inner0,
        );

        await page.waitForChanges();

        expect(
          page.rootInstance
            .openIndexes
            .has(0),
        ).toBe(false);

        expect(
          panel0.classList.contains(
            'collapsing',
          ),
        ).toBe(true);

        await fireTransitionEnd(
          panel0,
          page,
        );

        expect(
          panel0.classList.contains(
            'collapse',
          ),
        ).toBe(true);

        expect(
          panel0.classList.contains(
            'show',
          ),
        ).toBe(false);

        expect(
          panel0.classList.contains(
            'collapsing',
          ),
        ).toBe(false);

        expect(
          panel0.style.height,
        ).toBe('');

        expect(
          panel0.getAttribute(
            'aria-hidden',
          ),
        ).toBe(
          'true',
        );

        expect(
          panel0.hasAttribute(
            'hidden',
          ),
        ).toBe(true);

        expect(
          panel0.hasAttribute(
            'inert',
          ),
        ).toBe(true);
      },
    );

    it(
      'sets data-bs-parent when singleOpen=true',
      async () => {
        const parentId =
          'single-parent';

        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                parentId={
                  parentId
                }
                singleOpen
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const panels =
          root.querySelectorAll(
            '.accordion-collapse',
          );

        expect(
          panels.length,
        ).toBe(2);

        panels.forEach(
          panel => {
            expect(
              panel.getAttribute(
                'data-bs-parent',
              ),
            ).toBe(
              `#${parentId}`,
            );
          },
        );
      },
    );

    it(
      'singleOpen closes the previously open item when opening another',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                singleOpen
                data={sampleData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const btnHosts =
          Array.from(
            root.querySelectorAll(
              'button-component',
            ),
          ) as HTMLElement[];

        const inner0 =
          innerButtonOf(
            btnHosts[0],
          );

        const inner1 =
          innerButtonOf(
            btnHosts[1],
          );

        click(
          inner0,
        );

        await page.waitForChanges();

        expect(
          page.rootInstance
            .openIndexes
            .has(0),
        ).toBe(true);

        click(
          inner1,
        );

        await page.waitForChanges();

        expect(
          page.rootInstance
            .openIndexes
            .has(1),
        ).toBe(true);

        expect(
          page.rootInstance
            .openIndexes
            .has(0),
        ).toBe(false);
      },
    );

    it(
      'renders empty accordion when data is an empty array',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={[]}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const items =
          root.querySelectorAll(
            '.accordion-item',
          );

        expect(
          items.length,
        ).toBe(0);

        expectStableSnapshot(
          root,
          'empty array data',
        );
      },
    );

    it(
      'logs warning in componentWillLoad() if data is not an array',
      async () => {
        const warnSpy =
          jest
            .spyOn(
              console,
              'warn',
            )
            .mockImplementation(
              () => {},
            );

        try {
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={
                  {} as any
                }
              />
            ),
          });
        } finally {
          warnSpy.mockRestore();
        }
      },
    );

    it(
      'renders many accordion items and matches snapshot',
      async () => {
        const largeData =
          Array.from(
            {
              length: 12,
            },
            (
              _,
              index,
            ) => ({
              header:
                `Header ${index + 1}`,
              content:
                `Content ${index + 1}`,
            }),
          );

        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={largeData}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const items =
          root.querySelectorAll(
            '.accordion-item',
          );

        expect(
          items.length,
        ).toBe(12);

        expectStableSnapshot(
          root,
          'long data array (12 items)',
        );
      },
    );

    it(
      'renders an item with empty header and content strings',
      async () => {
        const emptyEntry = [
          {
            header: '',
            content: '',
          },
        ];

        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                data={
                  emptyEntry
                }
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const headers =
          root.querySelectorAll(
            '.accordion-header',
          );

        const bodies =
          root.querySelectorAll(
            '.accordion-body',
          );

        expect(
          headers.length,
        ).toBe(1);

        expect(
          headers[0]
            .textContent
            ?.trim(),
        ).toBe('');

        expect(
          bodies.length,
        ).toBe(1);

        expect(
          bodies[0]
            .textContent
            ?.trim(),
        ).toBe('');

        expectStableSnapshot(
          root,
          'empty header and content',
        );
      },
    );

    it(
      'renders fallback icon behavior for invalid or missing icon prop',
      async () => {
        const cases = [
          {
            icon: '',
            description:
              'empty string icon',
          },
          {
            icon: null,
            description:
              'null icon',
          },
          {
            icon:
              '  , , ,',
            description:
              'malformed icon string',
          },
        ];

        for (
          const {
            icon,
            description,
          } of cases
        ) {
          const page =
            await newSpecPage({
              components: [
                AccordionContainer,
                ButtonComponent,
              ],
              template: () => (
                <accordion-container
                  data={[
                    {
                      header:
                        'H',
                      content:
                        'C',
                    },
                  ]}
                  icon={
                    icon as any
                  }
                />
              ),
            });

          await page.waitForChanges();

          const root =
            page.root as HTMLElement;

          const icons =
            root.querySelectorAll(
              'icon-component',
            );

          expect(
            icons.length,
          ).toBe(1);

          expect(
            icons[0].getAttribute(
              'icon',
            ),
          ).toBe(
            'fas fa-angle-down',
          );

          expectStableSnapshot(
            root,
            description,
          );
        }
      },
    );

    it(
      'toggles icon between first and second values in icon="a,b"',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                icon="icon-collapsed,icon-expanded"
                data={[
                  {
                    header:
                      'Title',
                    content:
                      'Body',
                  },
                ]}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const getIcon =
          (): string | null =>
            root
              .querySelector(
                'icon-component',
              )
              ?.getAttribute(
                'icon',
              ) ?? null;

        expect(
          getIcon(),
        ).toBe(
          'icon-collapsed',
        );

        const hostBtn =
          root.querySelector(
            'button-component',
          ) as HTMLElement | null;

        const inner =
          innerButtonOf(
            hostBtn,
          );

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          getIcon(),
        ).toBe(
          'icon-expanded',
        );

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          getIcon(),
        ).toBe(
          'icon-collapsed',
        );
      },
    );

    it(
      'renders only first two icons from icon="a,b,c"',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                icon="a,b,c"
                data={[
                  {
                    header:
                      'H',
                    content:
                      'C',
                  },
                ]}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const hostBtn =
          root.querySelector(
            'button-component',
          ) as HTMLElement | null;

        const inner =
          innerButtonOf(
            hostBtn,
          );

        const getIcon =
          (): string | null =>
            root
              .querySelector(
                'icon-component',
              )
              ?.getAttribute(
                'icon',
              ) ?? null;

        expect(
          getIcon(),
        ).toBe('a');

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          getIcon(),
        ).toBe('b');

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          getIcon(),
        ).toBe('a');

        expectStableSnapshot(
          root,
          'icon prop with extra values (a,b,c)',
        );
      },
    );

    it(
      'renders single static icon and does not change on toggle',
      async () => {
        const page =
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                icon="only-icon"
                data={[
                  {
                    header:
                      'Static',
                    content:
                      'Content',
                  },
                ]}
              />
            ),
          });

        await page.waitForChanges();

        const root =
          page.root as HTMLElement;

        const getIcon =
          (): string | null =>
            root
              .querySelector(
                'icon-component',
              )
              ?.getAttribute(
                'icon',
              ) ?? null;

        const hostBtn =
          root.querySelector(
            'button-component',
          ) as HTMLElement | null;

        const inner =
          innerButtonOf(
            hostBtn,
          );

        expect(
          getIcon(),
        ).toBe(
          'only-icon',
        );

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          getIcon(),
        ).toBe(
          'only-icon',
        );

        click(
          inner,
        );

        await page.waitForChanges();

        expect(
          getIcon(),
        ).toBe(
          'only-icon',
        );

        expectStableSnapshot(
          root,
          'static single icon toggle does not change',
        );
      },
    );

    it(
      'renders with valid data and icon without warnings',
      async () => {
        const warnSpy =
          jest
            .spyOn(
              console,
              'warn',
            )
            .mockImplementation(
              () => {},
            );

        try {
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            template: () => (
              <accordion-container
                icon="fas fa-plus,fas fa-minus"
                parentId="test-acc"
                data={[
                  {
                    header:
                      'Test Header',
                    content:
                      'Test Content',
                  },
                ]}
              />
            ),
          });

          expect(
            warnSpy,
          ).not.toHaveBeenCalled();
        } finally {
          warnSpy.mockRestore();
        }
      },
    );

    it(
      'shows warning for explicitly empty icon attribute',
      async () => {
        const warnSpy =
          jest
            .spyOn(
              console,
              'warn',
            )
            .mockImplementation(
              () => {},
            );

        try {
          await newSpecPage({
            components: [
              AccordionContainer,
              ButtonComponent,
            ],
            html: `
              <accordion-container
                icon=""
              ></accordion-container>
            `,
          });

          expect(
            warnSpy.mock.calls.some(
              call =>
                String(
                  call[0],
                ).includes(
                  '"icon" prop is empty',
                ),
            ),
          ).toBe(true);
        } finally {
          warnSpy.mockRestore();
        }
      },
    );

    it(
      'shows warning if data is invalid (no warning expected here, component normalizes to [])',
      async () => {
        const warnSpy =
          jest
            .spyOn(
              console,
              'warn',
            )
            .mockImplementation(
              () => {},
            );

        try {
          const page =
            await newSpecPage({
              components: [
                AccordionContainer,
                ButtonComponent,
              ],
              template: () => (
                <accordion-container
                  data={
                    {} as any
                  }
                />
              ),
            });

          await page.waitForChanges();

          expect(
            warnSpy,
          ).not.toHaveBeenCalled();
        } finally {
          warnSpy.mockRestore();
        }
      },
    );
  },
);
