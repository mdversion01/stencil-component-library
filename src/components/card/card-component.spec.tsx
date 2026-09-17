// File: src/components/card/card-component.spec.tsx

import { newSpecPage } from '@stencil/core/testing';

import { CardComponent } from './card-component';

function normalizeGeneratedCardIds(
  root: HTMLElement,
): void {
  const titleElements =
    Array.from(
      root.querySelectorAll(
        '.card-title[id]',
      ),
    ) as HTMLElement[];

  titleElements.forEach(
    (
      title,
      index,
    ) => {
      const originalId =
        title.id;

      if (
        !/^card-\d+-[A-Za-z0-9]+-title$/.test(
          originalId,
        )
      ) {
        return;
      }

      const stableId =
        titleElements.length === 1
          ? 'card-test-title'
          : `card-test-title-${index + 1}`;

      title.id =
        stableId;

      const elements: Element[] = [
        root,
        ...Array.from(
          root.querySelectorAll('*'),
        ),
      ];

      const referenceAttributes = [
        'aria-labelledby',
        'aria-describedby',
        'aria-controls',
        'for',
      ];

      elements.forEach(
        element => {
          referenceAttributes.forEach(
            attribute => {
              const value =
                element.getAttribute(
                  attribute,
                );

              if (
                !value ||
                !value.includes(
                  originalId,
                )
              ) {
                return;
              }

              element.setAttribute(
                attribute,
                value
                  .split(originalId)
                  .join(stableId),
              );
            },
          );
        },
      );
    },
  );
}

function expectStableSnapshot(
  root: HTMLElement,
  hint: string,
): void {
  normalizeGeneratedCardIds(
    root,
  );

  expect(
    root,
  ).toMatchSnapshot(
    hint,
  );
}

describe(
  '<card-component>',
  () => {
    it(
      'renders basic card (non-landmark, non-clickable) with no role by default',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        expect(
          root,
        ).toBeTruthy();

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article,
        ).toBeTruthy();

        expect(
          article.getAttribute(
            'role',
          ),
        ).toBeNull();

        expect(
          article.getAttribute(
            'aria-label',
          ),
        ).toBeNull();

        expect(
          article.getAttribute(
            'aria-labelledby',
          ),
        ).toBeNull();

        expect(
          article.getAttribute(
            'aria-describedby',
          ),
        ).toBeNull();

        expect(
          article.querySelector(
            '.card-header',
          ),
        ).toBeTruthy();

        expect(
          article.querySelector(
            '.card-body',
          ),
        ).toBeTruthy();

        expect(
          article.querySelector(
            '.card-footer',
          ),
        ).toBeTruthy();

        const heading =
          article.querySelector(
            '.card-title',
          ) as HTMLElement;

        expect(
          heading,
        ).toBeTruthy();

        expect(
          heading.tagName.toLowerCase(),
        ).toBe('h5');

        expectStableSnapshot(
          root,
          'basic-card',
        );
      },
    );

    it(
      'renders landmark region with aria-label when landmark=true and aria-label is provided',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component
                landmark
                aria-label="Profile Card"
              >
                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article,
        ).toBeTruthy();

        expect(
          article.getAttribute(
            'role',
          ),
        ).toBe(
          'region',
        );

        expect(
          article.getAttribute(
            'aria-label',
          ),
        ).toBe(
          'Profile Card',
        );

        expect(
          article.getAttribute(
            'aria-labelledby',
          ),
        ).toBeNull();

        expectStableSnapshot(
          root,
          'landmark-with-aria-label',
        );
      },
    );

    it(
      'renders landmark region with aria-labelledby when provided (preferred over aria-label)',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <div id="ext-label">
                External Label
              </div>

              <card-component
                landmark
                aria-labelledby="ext-label"
                aria-label="Ignored Label"
              >
                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const body =
          page.body as HTMLElement;

        const card =
          body.querySelector(
            'card-component',
          ) as HTMLElement;

        expect(
          card,
        ).toBeTruthy();

        const article =
          card.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article,
        ).toBeTruthy();

        expect(
          article.getAttribute(
            'role',
          ),
        ).toBe(
          'region',
        );

        expect(
          article.getAttribute(
            'aria-labelledby',
          ),
        ).toBe(
          'ext-label',
        );

        expect(
          article.getAttribute(
            'aria-label',
          ),
        ).toBeNull();

        expectStableSnapshot(
          card,
          'landmark-with-aria-labelledby',
        );
      },
    );

    it(
      'renders card with header and footer slots (wrapper elements always present unless noHeader/noFooter)',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component>
                <div slot="header">
                  Header Content
                </div>

                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Main text content
                </div>

                <div slot="footer">
                  Footer Content
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article,
        ).toBeTruthy();

        const header =
          article.querySelector(
            '.card-header',
          ) as HTMLElement;

        const footer =
          article.querySelector(
            '.card-footer',
          ) as HTMLElement;

        expect(
          header,
        ).toBeTruthy();

        expect(
          footer,
        ).toBeTruthy();

        expect(
          header.textContent || '',
        ).toContain(
          'Header Content',
        );

        expect(
          footer.textContent || '',
        ).toContain(
          'Footer Content',
        );

        expectStableSnapshot(
          root,
          'header-and-footer-slots',
        );
      },
    );

    it(
      'renders card with image (non-decorative) and preserves alt text',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component
                img
                img-src="https://example.com/image.jpg"
                alt-text="Sample Image"
              >
                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const img =
          root.querySelector(
            'img',
          ) as HTMLImageElement;

        expect(
          img,
        ).toBeTruthy();

        expect(
          img.getAttribute(
            'alt',
          ),
        ).toBe(
          'Sample Image',
        );

        expect(
          img.getAttribute(
            'aria-hidden',
          ),
        ).toBeNull();

        expectStableSnapshot(
          root,
          'non-decorative-image',
        );
      },
    );

    it(
      'renders decorative image with alt="" and aria-hidden="true"',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component
                img
                decorative-image
                img-src="https://example.com/image.jpg"
                alt-text="Ignored"
              >
                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const img =
          root.querySelector(
            'img',
          ) as HTMLImageElement;

        expect(
          img,
        ).toBeTruthy();

        expect(
          img.getAttribute(
            'alt',
          ),
        ).toBe('');

        expect(
          img.getAttribute(
            'aria-hidden',
          ),
        ).toBe(
          'true',
        );

        expectStableSnapshot(
          root,
          'decorative-image',
        );
      },
    );

    it(
      'renders actions wrapper only when actions=true',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component actions>
                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Text
                </div>

                <div slot="actions">
                  Action Button
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article,
        ).toBeTruthy();

        const actions =
          article.querySelector(
            '.card-actions',
          ) as HTMLElement;

        expect(
          actions,
        ).toBeTruthy();

        expect(
          actions.textContent || '',
        ).toContain(
          'Action Button',
        );

        expectStableSnapshot(
          root,
          'actions',
        );
      },
    );

    it(
      'applies elevation and custom classes to the article element',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component
                elevation="2"
                class-names="custom-card"
              >
                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article.classList.contains(
            'elevated-2',
          ),
        ).toBe(true);

        expect(
          article.classList.contains(
            'custom-card',
          ),
        ).toBe(true);

        expectStableSnapshot(
          root,
          'elevation-and-custom-class',
        );
      },
    );

    it(
      'heading-level attribute changes the title heading tag',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component
                heading-level="2"
              >
                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        const heading =
          article.querySelector(
            '.card-title',
          ) as HTMLElement;

        expect(
          heading,
        ).toBeTruthy();

        expect(
          heading.tagName.toLowerCase(),
        ).toBe('h2');

        expectStableSnapshot(
          root,
          'heading-level-2',
        );
      },
    );

    it(
      'clickable=true sets role="button" and tabIndex=0; Enter/Space emit customClick',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component clickable>
                <div slot="title">
                  Clickable Card
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article.getAttribute(
            'role',
          ),
        ).toBe(
          'button',
        );

        expect(
          article.getAttribute(
            'tabindex',
          ),
        ).toBe('0');

        const clickSpy =
          jest.fn();

        root.addEventListener(
          'customClick',
          clickSpy,
        );

        article.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'Enter',
              bubbles: true,
            },
          ),
        );

        article.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: ' ',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          clickSpy,
        ).toHaveBeenCalledTimes(
          2,
        );
      },
    );

    it(
      'clickable + disabled removes from tab order, sets aria-disabled, and does not emit on keys',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component
                clickable
                disabled
              >
                <div slot="title">
                  Disabled Clickable
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article.getAttribute(
            'role',
          ),
        ).toBe(
          'button',
        );

        expect(
          article.getAttribute(
            'tabindex',
          ),
        ).toBeNull();

        expect(
          article.getAttribute(
            'aria-disabled',
          ),
        ).toBe(
          'true',
        );

        const clickSpy =
          jest.fn();

        root.addEventListener(
          'customClick',
          clickSpy,
        );

        article.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: 'Enter',
              bubbles: true,
            },
          ),
        );

        article.dispatchEvent(
          new KeyboardEvent(
            'keydown',
            {
              key: ' ',
              bubbles: true,
            },
          ),
        );

        await page.waitForChanges();

        expect(
          clickSpy,
        ).toHaveBeenCalledTimes(
          0,
        );
      },
    );

    it(
      'noHeader/noFooter remove their wrappers entirely',
      async () => {
        const page =
          await newSpecPage({
            components: [
              CardComponent,
            ],
            html: `
              <card-component
                no-header
                no-footer
              >
                <div slot="title">
                  Card Title
                </div>

                <div slot="text">
                  Text
                </div>
              </card-component>
            `,
          });

        const root =
          page.root as HTMLElement;

        const article =
          root.querySelector(
            'article',
          ) as HTMLElement;

        expect(
          article.querySelector(
            '.card-header',
          ),
        ).toBeNull();

        expect(
          article.querySelector(
            '.card-footer',
          ),
        ).toBeNull();

        expectStableSnapshot(
          root,
          'no-header-no-footer',
        );
      },
    );
  },
);
