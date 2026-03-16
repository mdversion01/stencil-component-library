// stories/accordion-container.stories.js
// Ensures unique parent-id (and thus unique collapse IDs/targets) per render,
// so the Docs preview and the Canvas instance never collide.

const TAG = 'accordion-container';

// Helpers
const setAttr = (el, name, v) => {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
};

// Per-render unique token
const uid = () => Math.random().toString(36).slice(2, 8) + '-' + Date.now().toString(36);

// Build the element with a unique parent-id every time render() is called
function buildContainer(args, baseId = 'acc') {
  const el = document.createElement(TAG);

  // Unique token per instance (Docs preview & Canvas get their own)
  const token = uid();

  // Compose a truly unique parent-id for this instance
  const parentId = `${baseId}-${token}`;

  // Assign data as a property (not attribute)
  el.data = Array.isArray(args.data) ? args.data : [];

  // Optional container labelling (new a11y support)
  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);

  // Attributes
  setAttr(el, 'parent-id', parentId);
  setAttr(el, 'flush', args.flush);
  setAttr(el, 'variant', args.variant);
  setAttr(el, 'size', args.size);
  setAttr(el, 'outlined', args.outlined);
  setAttr(el, 'block', args.block);
  setAttr(el, 'disabled', args.disabled);
  setAttr(el, 'ripple', args.ripple);
  setAttr(el, 'class-names', args.classNames);
  setAttr(el, 'content-txt-size', args.contentTxtSize);
  setAttr(el, 'icon', args.icon);
  setAttr(el, 'single-open', args.singleOpen);

  return el;
}

export default {
  title: 'Components/Accordion Container',
  tags: ['autodocs'],

  render: (args, { id } = {}) => {
    const base = (id || 'acc').split('--').pop() || 'acc';
    return buildContainer(args, base);
  },

  parameters: {
    docs: {
      description: {
        component: [
          'The Accordion Container renders multiple accordion items from a data array. ',
          'Each story instance uses a unique `parent-id`, ensuring that the generated ',
          '`id`/`data-bs-target` values are unique in both the Docs preview and the Canvas.',
          'Accordions can be set up with data as shown below.\n',
          '```html',
          '<accordion-container id="accordion-1" parent-id="accordion-example"></accordion-container>',
          '<script>',
          'const collapseData = [',
          "  { header: 'Accordion 1', content: 'Content 1' },",
          "  { header: 'Accordion 2', content: 'Content 2' },",
          "  { header: 'Accordion 3', content: 'Content 3' },",
          "  { header: 'Accordion 4', content: 'Content 4' },",
          '];',
          "document.getElementById('accordion-1').data = collapseData;",
          '</script>',
          '```',
          '',
          '**Tip:** Make sure your component prefixes each item’s `id`/`data-bs-target` ',
          'with the `parent-id` (e.g., `id="${parentId}-collapse-${index}"`).',
          '',
          '**Accessibility:** Each panel uses `role="region"` and is labelled by the interactive trigger: ',
          '`aria-labelledby="${parentId}-trigger-${index}"`. The trigger uses `aria-controls` and `aria-expanded`.',
          'Collapsed panels are `aria-hidden`, `hidden`, and `inert` to prevent focus.',
          'When `single-open` is enabled, panels include `data-bs-parent="#${parentId}"`.',
        ].join('\n'),
      },
    },
  },

  argTypes: {
    // -------- Layout --------
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

    // -------- Data / Content --------
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

    // -------- Accessibility --------
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

    // -------- Behavior --------
    singleOpen: {
      control: 'boolean',
      name: 'single-open',
      description: 'Allows only one item open at a time.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },

    // -------- Appearance --------
    variant: {
      control: 'text',
      description: 'Visual variant for headers/buttons (e.g., primary, secondary, etc.).',
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
      description:
        'Sets the size of the button, e.g., extra small (xs), small (sm), large (lg), or plumage-size. If not set, default size is used.',
      table: { category: 'Appearance' },
    },
    icon: {
      control: 'text',
      description:
        'Default `fas fa-angle-down`. You can pass two icons separated by a comma for closed/open: `"fa-solid fa-plus, fa-solid fa-minus"`.',
      table: { category: 'Appearance' },
    },

    // -------- State / Interaction --------
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

    // -------- Internal / Story-only (hidden) --------
    parentId: {
      control: false,
      name: 'parent-id',
      description: 'Computed uniquely per render to avoid collisions (not set manually by the story).',
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

    // Accessibility
    ariaLabel: '',
    ariaLabelledby: '',
  },
};

// ——— Stories ———

export const Basic = {
  name: 'Basic',
  render: (args, ctx) => buildContainer(args, 'basic'),
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
  render: (args, ctx) => buildContainer(args, 'single'),
  parameters: {
    docs: {
      description: {
        story: 'Accordion container that enforces a single expanded item at a time (opening one item closes the previously open item).',
      },
    },
  },
};

export const Flush = {
  name: 'Flush',
  args: { flush: true },
  render: (args, ctx) => buildContainer(args, 'flush'),
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
  render: (args, ctx) => buildContainer(args, 'disabled'),
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
  render: (args, ctx) => buildContainer(args, 'icons'),
  parameters: {
    docs: {
      description: {
        story: 'Accordion container using custom icons for open/closed states.',
      },
    },
  },
};

// --- Accessibility matrix story ---
export const AccessibilityMatrix = {
  name: 'Accessibility matrix (computed)',
  render: (args, ctx) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML =
      `<strong>Accessibility matrix</strong>` +
      `<div style="opacity:.8">Prints per-item toggle + region ARIA + ids; also verifies singleOpen closes others.</div>`;
    wrap.appendChild(title);

    const mkRow = (labelText, build, afterMount) => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '280px 1fr';
      row.style.gap = '12px';
      row.style.alignItems = 'start';
      row.style.border = '1px solid #ddd';
      row.style.borderRadius = '8px';
      row.style.padding = '12px';

      const left = document.createElement('div');
      left.innerHTML = `<div style="font-weight:600">${labelText}</div>`;

      const right = document.createElement('div');
      right.style.display = 'grid';
      right.style.gap = '8px';

      const demo = document.createElement('div');
      demo.style.display = 'grid';
      demo.style.gap = '8px';

      const host = build();
      demo.appendChild(host);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading computed attributes…';

      right.appendChild(demo);
      right.appendChild(pre);

      row.appendChild(left);
      row.appendChild(right);

      const snapshot = () => {
        const items = Array.from(host.querySelectorAll('.accordion-item')).map((item, i) => {
          const btnHost = item.querySelector('button-component');
          const inner = item.querySelector('button-component button, button-component a');
          const region = item.querySelector('.accordion-collapse[role="region"]');

          return {
            index: i,
            headerId: item.querySelector('.accordion-header')?.getAttribute('id') ?? null,
            triggerId: btnHost?.getAttribute('id') ?? null,
            innerTag: inner?.tagName ?? null,
            'aria-expanded': inner?.getAttribute('aria-expanded') ?? null,
            'aria-controls': inner?.getAttribute('aria-controls') ?? null,
            regionId: region?.getAttribute('id') ?? null,
            'region aria-labelledby': region?.getAttribute('aria-labelledby') ?? null,
            'aria-hidden': region?.getAttribute('aria-hidden') ?? null,
            hidden: region?.hasAttribute('hidden') ?? null,
            inert: region?.hasAttribute('inert') ?? null,
            'data-bs-parent': region?.getAttribute('data-bs-parent') ?? null,
            display: region?.style.display ?? null,
            height: region?.style.height ?? null,
          };
        });

        pre.textContent = JSON.stringify(
          {
            parentId: host.getAttribute('parent-id'),
            singleOpen: host.hasAttribute('single-open'),
            containerRole: host.getAttribute('role'),
            containerAriaLabel: host.getAttribute('aria-label'),
            containerAriaLabelledby: host.getAttribute('aria-labelledby'),
            items,
          },
          null,
          2,
        );
      };

      queueMicrotask(() =>
        requestAnimationFrame(async () => {
          snapshot();
          if (afterMount) await afterMount(host, snapshot);
        }),
      );

      return row;
    };

    const build = (storyArgs, base) => buildContainer(storyArgs, base);

    wrap.appendChild(
      mkRow(
        'Default (multi-open)',
        () =>
          build(
            {
              ...args,
              singleOpen: false,
              data: [
                { header: 'One', content: 'Body 1' },
                { header: 'Two', content: 'Body 2' },
              ],
            },
            'mx-default',
          ),
        async (host, snapshot) => {
          const inners = host.querySelectorAll('button-component button, button-component a');
          inners[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          inners[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          await new Promise(r => requestAnimationFrame(r));
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
                { header: 'Alpha', content: 'A' },
                { header: 'Beta', content: 'B' },
              ],
            },
            'mx-single',
          ),
        async (host, snapshot) => {
          const inners = host.querySelectorAll('button-component button, button-component a');
          inners[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          await new Promise(r => requestAnimationFrame(r));
          inners[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          await new Promise(r => requestAnimationFrame(r));
          snapshot();
        },
      ),
    );

    wrap.appendChild(
      mkRow(
        'Container labelled (role=region)',
        () => {
          const outer = document.createElement('div');
          outer.style.display = 'grid';
          outer.style.gap = '6px';

          const label = document.createElement('div');
          label.id = 'acc-container-label';
          label.textContent = 'Account settings accordion';
          outer.appendChild(label);

          const host = build(
            {
              ...args,
              data: [
                { header: 'Security', content: 'Security body' },
                { header: 'Privacy', content: 'Privacy body' },
              ],
            },
            'mx-labelled',
          );
          host.setAttribute('aria-labelledby', 'acc-container-label');
          outer.appendChild(host);

          return outer;
        },
        async (_outer, snapshot) => snapshot(),
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Shows computed accessibility wiring per item (toggle + region): `aria-expanded`, `aria-controls`, region `role="region"`, `aria-labelledby`, and generated ids. Also demonstrates `singleOpen` closing behavior.',
      },
    },
  },
};
