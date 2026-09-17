// ============================================================================
// File: src/stories/plumage-accordion-container/plumage-accordion-container.stories.js
// ============================================================================

import { buildPlumageAccordionContainer } from './plumage-accordion-container.story-helpers.js';

export default {
  title: 'Plumage/Plumage Accordion Container',

  render: (args, context = {}) => {
    const base = (context.id || 'plumage-accordion').split('--').pop() || 'plumage-accordion';

    return buildPlumageAccordionContainer(args, base);
  },

  parameters: {
    themeFamily: 'plumage',

    docs: {
      description: {
        component: [
          'The Plumage Accordion Container renders multiple accordion items from a data array.',
          'Each story instance uses a unique `parent-id`, ensuring that generated `id` and `data-bs-target` values remain unique in both Docs and Canvas.',
          '',
          '**Accessibility:**',
          '- Each panel uses `role="region"` and is labelled by its interactive trigger.',
          '- The panel uses `aria-labelledby="${parentId}-trigger-${index}"`.',
          '- The trigger exposes `aria-controls` and `aria-expanded`.',
          '- Collapsed panels use `aria-hidden`, `hidden`, and `inert` to prevent focus.',
          '- When `single-open` is enabled, panels include `data-bs-parent="#${parentId}"`.',
        ].join('\n'),
      },
    },
  },

  argTypes: {
    block: {
      control: 'boolean',
      description: 'Makes accordion trigger buttons full width.',
      table: {
        category: 'Layout',
        defaultValue: {
          summary: false,
        },
      },
    },

    classNames: {
      control: 'text',
      name: 'class-names',
      description: 'Additional classes applied to accordion trigger buttons.',
      table: {
        category: 'Layout',
      },
    },

    data: {
      control: 'object',
      description: 'Array of items shaped as `{ header: string, content: string }`.',
      table: {
        category: 'Data',
      },
    },

    contentTxtSize: {
      control: {
        type: 'select',
      },
      options: ['', 'xs', 'sm', 'default', 'lg', 'xl', 'xxl'],
      name: 'content-txt-size',
      description: 'Changes the content/body text size inside accordion items.',
      table: {
        category: 'Data',
      },
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Optional accessible name for the accordion container. When supplied, the internal accordion receives `role="region"`.',
      table: {
        category: 'Accessibility',
      },
    },

    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'Optional id reference for an external element that labels the accordion container.',
      table: {
        category: 'Accessibility',
      },
    },

    singleOpen: {
      control: 'boolean',
      name: 'single-open',
      description: 'Allows only one accordion item to remain open at a time.',
      table: {
        category: 'Behavior',
        defaultValue: {
          summary: false,
        },
      },
    },

    variant: {
      control: 'text',
      description: 'Visual variant applied to accordion trigger buttons.',
      table: {
        category: 'Appearance',
      },
    },

    outlined: {
      control: 'boolean',
      description: 'Uses outlined styling for accordion trigger buttons.',
      table: {
        category: 'Appearance',
        defaultValue: {
          summary: false,
        },
      },
    },

    flush: {
      control: 'boolean',
      description: 'Removes outer borders and rounded corners for a flush accordion appearance.',
      table: {
        category: 'Appearance',
        defaultValue: {
          summary: false,
        },
      },
    },

    size: {
      control: {
        type: 'select',
      },
      options: ['', 'xs', 'sm', 'lg', 'plumage-size'],
      description: 'Sets the accordion trigger button size.',
      table: {
        category: 'Appearance',
      },
    },

    icon: {
      control: 'text',
      description: 'Icon class. Pass two comma-separated values to provide closed/open icons.',
      table: {
        category: 'Appearance',
        defaultValue: {
          summary: 'fas fa-angle-down',
        },
      },
    },

    disabled: {
      control: 'boolean',
      description: 'Disables interaction for all accordion items.',
      table: {
        category: 'State',
        defaultValue: {
          summary: false,
        },
      },
    },

    ripple: {
      control: 'boolean',
      description: 'Enables the ripple effect on accordion trigger interaction.',
      table: {
        category: 'Interaction',
        defaultValue: {
          summary: false,
        },
      },
    },

    parentId: {
      control: false,
      name: 'parent-id',
      description: 'Generated uniquely for each Storybook render to prevent id collisions.',
      table: {
        disable: true,
      },
    },
  },

  args: {
    block: false,

    classNames: '',

    contentTxtSize: '',

    data: [
      {
        header: 'Accordion 1',
        content: 'Content 1',
      },
      {
        header: 'Accordion 2',
        content: 'Content 2',
      },
      {
        header: 'Accordion 3',
        content: 'Content 3',
      },
      {
        header: 'Accordion 4',
        content: 'Content 4',
      },
    ],

    disabled: false,

    flush: false,

    icon: '',

    outlined: false,

    ripple: false,

    singleOpen: false,

    size: '',

    variant: '',

    ariaLabel: '',

    ariaLabelledby: '',
  },
};

export const Basic = {
  name: 'Basic',

  render: args => buildPlumageAccordionContainer(args, 'basic'),

  parameters: {
    docs: {
      description: {
        story: 'A default Plumage Accordion Container rendering multiple independently expandable items.',
      },
    },
  },
};

export const SingleOpen = {
  name: 'Single Open',

  args: {
    singleOpen: true,
  },

  render: args => buildPlumageAccordionContainer(args, 'single'),

  parameters: {
    docs: {
      description: {
        story: 'Allows only one Plumage Accordion item to remain expanded at a time.',
      },
    },
  },
};

export const Flush = {
  name: 'Flush',

  args: {
    flush: true,
  },

  render: args => buildPlumageAccordionContainer(args, 'flush'),

  parameters: {
    docs: {
      description: {
        story: 'Removes outer borders and rounded corners for a flush appearance.',
      },
    },
  },
};

export const Disabled = {
  name: 'Disabled',

  args: {
    disabled: true,
  },

  render: args => buildPlumageAccordionContainer(args, 'disabled'),

  parameters: {
    docs: {
      description: {
        story: 'Disables interaction for every item in the Plumage Accordion Container.',
      },
    },
  },
};

export const CustomIcons = {
  name: 'Custom Icons',

  args: {
    icon: 'fa-solid fa-plus, fa-solid fa-minus',
  },

  render: args => buildPlumageAccordionContainer(args, 'icons'),

  parameters: {
    docs: {
      description: {
        story: 'Uses custom closed and open icons for each Plumage Accordion item.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: args => {
    const wrap = document.createElement('div');

    wrap.className = 'plumage-accordion-container-accessibility-matrix';

    const title = document.createElement('div');

    const heading = document.createElement('strong');

    heading.textContent = 'Accessibility matrix';

    const description = document.createElement('div');

    description.className = 'plumage-accordion-container-accessibility-matrix__description';

    description.textContent = 'Prints per-item toggle and region ARIA attributes, generated ids, and single-open state.';

    title.appendChild(heading);

    title.appendChild(description);

    wrap.appendChild(title);

    const makeRow = (labelText, build, afterMount) => {
      const row = document.createElement('div');

      row.className = 'plumage-accordion-container-accessibility-matrix__row';

      const left = document.createElement('div');

      left.className = 'plumage-accordion-container-accessibility-matrix__label';

      left.textContent = labelText;

      const right = document.createElement('div');

      right.className = 'plumage-accordion-container-accessibility-matrix__content';

      const demo = document.createElement('div');

      demo.className = 'plumage-accordion-container-accessibility-matrix__demo';

      const rendered = build();

      demo.appendChild(rendered);

      const pre = document.createElement('pre');

      pre.className = 'plumage-accordion-container-accessibility-matrix__output';

      pre.textContent = 'Loading computed attributes…';

      right.appendChild(demo);

      right.appendChild(pre);

      row.appendChild(left);

      row.appendChild(right);

      const snapshot = () => {
        const hostContainer = demo.querySelector('plumage-accordion-container');

        const root = hostContainer || rendered;

        const items = Array.from(root.querySelectorAll('.accordion-item')).map((item, index) => {
          const buttonHost = item.querySelector('button-component');

          const inner = item.querySelector('button-component button, button-component a');

          const region = item.querySelector('.accordion-collapse[role="region"]');

          return {
            index,

            'headerId': item.querySelector('.accordion-header')?.getAttribute('id') ?? null,

            'triggerId': buttonHost?.getAttribute('id') ?? null,

            'innerTag': inner?.tagName ?? null,

            'aria-expanded': inner?.getAttribute('aria-expanded') ?? null,

            'aria-controls': inner?.getAttribute('aria-controls') ?? null,

            'regionId': region?.getAttribute('id') ?? null,

            'region aria-labelledby': region?.getAttribute('aria-labelledby') ?? null,

            'aria-hidden': region?.getAttribute('aria-hidden') ?? null,

            'hidden': region?.hasAttribute('hidden') ?? null,

            'inert': region?.hasAttribute('inert') ?? null,

            'data-bs-parent': region?.getAttribute('data-bs-parent') ?? null,

            'className': region?.getAttribute('class') ?? null,

            'height': region?.style.height ?? null,
          };
        });

        const accordion = root.querySelector('.accordion');

        pre.textContent = JSON.stringify(
          {
            component: 'plumage-accordion-container',

            parentId: hostContainer?.getAttribute('parent-id') ?? null,

            singleOpen: hostContainer?.hasAttribute('single-open') ?? null,

            containerRole: accordion?.getAttribute('role') ?? null,

            containerAriaLabel: accordion?.getAttribute('aria-label') ?? null,

            containerAriaLabelledby: accordion?.getAttribute('aria-labelledby') ?? null,

            items,
          },
          null,
          2,
        );
      };

      queueMicrotask(() => {
        requestAnimationFrame(async () => {
          snapshot();

          if (afterMount) {
            await afterMount(rendered, snapshot);
          }
        });
      });

      return row;
    };

    const build = (storyArgs, base) => buildPlumageAccordionContainer(storyArgs, base);

    wrap.appendChild(
      makeRow(
        'Default (multi-open)',
        () =>
          build(
            {
              ...args,

              singleOpen: false,

              data: [
                {
                  header: 'One',
                  content: 'Body 1',
                },
                {
                  header: 'Two',
                  content: 'Body 2',
                },
              ],
            },
            'mx-default',
          ),
        async (host, snapshot) => {
          const inners = host.querySelectorAll('button-component button, button-component a');

          inners[0]?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            }),
          );

          inners[1]?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            }),
          );

          await new Promise(resolve => requestAnimationFrame(resolve));

          snapshot();
        },
      ),
    );

    wrap.appendChild(
      makeRow(
        'singleOpen (second closes first)',
        () =>
          build(
            {
              ...args,

              singleOpen: true,

              data: [
                {
                  header: 'Alpha',
                  content: 'A',
                },
                {
                  header: 'Beta',
                  content: 'B',
                },
              ],
            },
            'mx-single',
          ),
        async (host, snapshot) => {
          const inners = host.querySelectorAll('button-component button, button-component a');

          inners[0]?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            }),
          );

          await new Promise(resolve => requestAnimationFrame(resolve));

          inners[1]?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            }),
          );

          await new Promise(resolve => requestAnimationFrame(resolve));

          snapshot();
        },
      ),
    );

    wrap.appendChild(
      makeRow(
        'Container labelled (role=region)',
        () => {
          const outer = document.createElement('div');

          outer.className = 'plumage-accordion-container-accessibility-matrix__labelled';

          const label = document.createElement('div');

          label.id = 'plumage-acc-container-label';

          label.textContent = 'Account settings accordion';

          outer.appendChild(label);

          const host = build(
            {
              ...args,

              ariaLabelledby: 'plumage-acc-container-label',

              data: [
                {
                  header: 'Security',
                  content: 'Security body',
                },
                {
                  header: 'Privacy',
                  content: 'Privacy body',
                },
              ],
            },
            'mx-labelled',
          );

          outer.appendChild(host);

          return outer;
        },
        async (_outer, snapshot) => {
          snapshot();
        },
      ),
    );

    return wrap;
  },

  parameters: {
    controls: {
      disable: true,
    },

    docs: {
      description: {
        story:
          'Shows computed accessibility wiring for each Plumage Accordion item: `aria-expanded`, `aria-controls`, region `role="region"`, `aria-labelledby`, generated ids, and `singleOpen` behavior.',
      },
    },
  },
};
