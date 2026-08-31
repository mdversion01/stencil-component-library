// import DocsPage from './accordion-container.docs.mdx';
import { buildContainer } from './accordion-container.story-helpers.js';

export default {
  title: 'Components/Accordion Container'
  ,

  render: (args, { id } = {}) => {
    const base = (id || 'acc').split('--').pop() || 'acc';
    return buildContainer(args, base);
  },

  parameters: {
    docs: {
      description: {
        component: [
          'The Accordion Container renders multiple accordion items from a data array.',
          'Each story instance uses a unique `parent-id`, ensuring that the generated',
          '`id`/`data-bs-target` values are unique in both the Docs preview and the Canvas.',
          '',
          '**Accessibility:** Each panel uses `role="region"` and is labelled by the interactive trigger:',
          '`aria-labelledby="${parentId}-trigger-${index}"`. The trigger uses `aria-controls` and `aria-expanded`.',
          'Collapsed panels are `aria-hidden`, `hidden`, and `inert` to prevent focus.',
          'When `single-open` is enabled, panels include `data-bs-parent="#${parentId}"`.',
        ].join('\n'),
      },
    },
  },

  argTypes: {
    block: {
      control: 'boolean',
      description: 'Full width container.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },
    classNames: {
      control: 'text',
      name: 'class-names',
      description: 'Additional classes applied to the container.',
      table: { category: 'Layout' },
    },

    data: {
      control: 'object',
      description: 'Array of items: `{ header: string, content: string }` used to render each accordion section.',
      table: { category: 'Data' },
    },
    contentTxtSize: {
      control: { type: 'select' },
      options: ['', 'xs', 'sm', 'default', 'lg', 'xl', 'xxl'],
      name: 'content-txt-size',
      description: 'Changes the content/body text sizing inside items.',
      table: { category: 'Data' },
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Optional accessible name for the accordion container (sets role="region" internally when provided).',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'Optional id reference for an external label element for the accordion container.',
      table: { category: 'Accessibility' },
    },

    singleOpen: {
      control: 'boolean',
      name: 'single-open',
      description: 'Allows only one item open at a time.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },

    variant: {
      control: 'text',
      description: 'Visual variant for headers/buttons.',
      table: { category: 'Appearance' },
    },
    outlined: {
      control: 'boolean',
      description: 'Outlined style for accordion items.',
      table: { category: 'Appearance', defaultValue: { summary: false } },
    },
    flush: {
      control: 'boolean',
      description: 'Removes outer borders and rounded corners for a flush appearance.',
      table: { category: 'Appearance', defaultValue: { summary: false } },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'xs', 'sm', 'lg', 'plumage-size'],
      description: 'Sets the size of the button.',
      table: { category: 'Appearance' },
    },
    icon: {
      control: 'text',
      description: 'Default `fas fa-angle-down`. You can pass two icons separated by a comma for closed/open.',
      table: { category: 'Appearance' },
    },

    disabled: {
      control: 'boolean',
      description: 'Disables interaction.',
      table: { category: 'State', defaultValue: { summary: false } },
    },
    ripple: {
      control: 'boolean',
      description: 'Enables ripple effect on interaction.',
      table: { category: 'Interaction', defaultValue: { summary: false } },
    },

    parentId: {
      control: false,
      name: 'parent-id',
      description: 'Computed uniquely per render to avoid collisions.',
      table: { disable: true },
    },
  },

  args: {
    block: false,
    classNames: '',
    contentTxtSize: '',
    data: [
      { header: 'Accordion 1', content: 'Content 1' },
      { header: 'Accordion 2', content: 'Content 2' },
      { header: 'Accordion 3', content: 'Content 3' },
      { header: 'Accordion 4', content: 'Content 4' },
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
  render: args => buildContainer(args, 'basic'),
  parameters: {
    docs: {
      description: {
        story: 'A default accordion container rendering multiple items. Each item can be opened or closed independently.',
      },
    },
  },
};

export const SingleOpen = {
  name: 'Single Open',
  args: { singleOpen: true },
  render: args => buildContainer(args, 'single'),
  parameters: {
    docs: {
      description: {
        story: 'Accordion container that enforces a single expanded item at a time.',
      },
    },
  },
};

export const Flush = {
  name: 'Flush',
  args: { flush: true },
  render: args => buildContainer(args, 'flush'),
  parameters: {
    docs: {
      description: {
        story: 'Accordion container that removes outer borders and rounded corners for a flush appearance.',
      },
    },
  },
};

export const Disabled = {
  name: 'Disabled',
  args: { disabled: true },
  render: args => buildContainer(args, 'disabled'),
  parameters: {
    docs: {
      description: {
        story: 'Accordion container that disables interaction for all items.',
      },
    },
  },
};

export const CustomIcons = {
  name: 'Custom Icons',
  args: { icon: 'fa-solid fa-plus, fa-solid fa-minus' },
  render: args => buildContainer(args, 'icons'),
  parameters: {
    docs: {
      description: {
        story: 'Accordion container using custom icons for open/closed states.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: (args, ctx) => {
    const wrap = document.createElement('div');
    wrap.className = 'accordion-container-accessibility-matrix';

    const title = document.createElement('div');

    const heading = document.createElement('strong');
    heading.textContent = 'Accessibility matrix';

    const description = document.createElement('div');
    description.className =
      'accordion-container-accessibility-matrix__description';
    description.textContent =
      'Prints per-item toggle + region ARIA + ids; also verifies singleOpen closes others.';

    title.appendChild(heading);
    title.appendChild(description);
    wrap.appendChild(title);

    const mkRow = (labelText, build, afterMount) => {
      const row = document.createElement('div');
      row.className = 'accordion-container-accessibility-matrix__row';

      const left = document.createElement('div');
      left.className = 'accordion-container-accessibility-matrix__label';
      left.textContent = labelText;

      const right = document.createElement('div');
      right.className = 'accordion-container-accessibility-matrix__content';

      const demo = document.createElement('div');
      demo.className = 'accordion-container-accessibility-matrix__demo';

      const host = build();
      demo.appendChild(host);

      const pre = document.createElement('pre');
      pre.className = 'accordion-container-accessibility-matrix__output';
      pre.textContent = 'Loading computed attributes…';

      right.appendChild(demo);
      right.appendChild(pre);

      row.appendChild(left);
      row.appendChild(right);

      const snapshot = () => {
        const hostContainer = demo.querySelector('accordion-container');
        const root = hostContainer || host;

        const items = Array.from(
          root.querySelectorAll('.accordion-item'),
        ).map((item, i) => {
          const btnHost = item.querySelector('button-component');
          const inner = item.querySelector(
            'button-component button, button-component a',
          );
          const region = item.querySelector(
            '.accordion-collapse[role="region"]',
          );

          return {
            index: i,
            headerId:
              item
                .querySelector('.accordion-header')
                ?.getAttribute('id') ?? null,
            triggerId: btnHost?.getAttribute('id') ?? null,
            innerTag: inner?.tagName ?? null,
            'aria-expanded':
              inner?.getAttribute('aria-expanded') ?? null,
            'aria-controls':
              inner?.getAttribute('aria-controls') ?? null,
            regionId: region?.getAttribute('id') ?? null,
            'region aria-labelledby':
              region?.getAttribute('aria-labelledby') ?? null,
            'aria-hidden':
              region?.getAttribute('aria-hidden') ?? null,
            hidden: region?.hasAttribute('hidden') ?? null,
            inert: region?.hasAttribute('inert') ?? null,
            'data-bs-parent':
              region?.getAttribute('data-bs-parent') ?? null,
            className:
              region?.getAttribute('class') ?? null,
            height:
              region?.style.height ?? null,
          };
        });

        pre.textContent = JSON.stringify(
          {
            parentId:
              hostContainer?.getAttribute('parent-id') ?? null,
            singleOpen:
              hostContainer?.hasAttribute('single-open') ?? null,
            containerRole:
              root
                .querySelector('.accordion')
                ?.getAttribute('role') ?? null,
            containerAriaLabel:
              root
                .querySelector('.accordion')
                ?.getAttribute('aria-label') ?? null,
            containerAriaLabelledby:
              root
                .querySelector('.accordion')
                ?.getAttribute('aria-labelledby') ?? null,
            items,
          },
          null,
          2,
        );
      };

      queueMicrotask(() =>
        requestAnimationFrame(async () => {
          snapshot();

          if (afterMount) {
            await afterMount(host, snapshot);
          }
        }),
      );

      return row;
    };

    const build = (storyArgs, base) =>
      buildContainer(storyArgs, base, ctx);

    wrap.appendChild(
      mkRow(
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
          const inners = host.querySelectorAll(
            'button-component button, button-component a',
          );

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

          await new Promise(resolve =>
            requestAnimationFrame(resolve),
          );

          snapshot();
        },
      ),
    );

    wrap.appendChild(
      mkRow(
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
          const inners = host.querySelectorAll(
            'button-component button, button-component a',
          );

          inners[0]?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            }),
          );

          await new Promise(resolve =>
            requestAnimationFrame(resolve),
          );

          inners[1]?.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            }),
          );

          await new Promise(resolve =>
            requestAnimationFrame(resolve),
          );

          snapshot();
        },
      ),
    );

    wrap.appendChild(
      mkRow(
        'Container labelled (role=region)',
        () => {
          const outer = document.createElement('div');
          outer.className =
            'accordion-container-accessibility-matrix__labelled';

          const label = document.createElement('div');
          label.id = 'acc-container-label';
          label.textContent = 'Account settings accordion';

          outer.appendChild(label);

          const host = build(
            {
              ...args,
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

          host.setAttribute(
            'aria-labelledby',
            'acc-container-label',
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
          'Shows computed accessibility wiring per item (toggle + region): `aria-expanded`, `aria-controls`, region `role="region"`, `aria-labelledby`, and generated ids. Also demonstrates `singleOpen` closing behavior.',
      },
    },
  },
};
