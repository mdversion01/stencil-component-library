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

  // Optional styling if desired
  // el.style.display = 'block';
  // el.style.margin = '16px 0';

  return el;
}

export default {
  title: 'Components/Accordion Container',
  tags: ['autodocs'],

  // The base render creates a unique instance every time it’s called.
  render: (args, { id } = {}) => {
    // Use the story id as a stable base and still add a per-render uid
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
        ].join('\n'),
      },
    },
  },

  argTypes: {
    block: {
      control: 'boolean',
      description: 'Full width container.',
    },
    classNames: {
      control: 'text',
      name: 'class-names',
      description: 'Additional classes applied to the container.',
    },
    contentTxtSize: {
      control: { type: 'select' },
      options: ['', 'xs', 'sm', 'default', 'lg', 'xl', 'xxl'],
      name: 'content-txt-size',
      description: 'Changes the content/body text sizing inside items.',
    },
    data: {
      control: 'object',
      description: 'Array of items: `{ header: string, content: string }` used to render each accordion section.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction.',
    },
    flush: {
      control: 'boolean',
      description: 'Removes outer borders and rounded corners for a flush appearance.',
    },
    icon: {
      control: 'text',
      description: 'Default `fas fa-angle-down`. You can pass two icons separated by a comma for closed/open: ' + '`"fa-solid fa-plus, fa-solid fa-minus"`.',
    },
    outlined: {
      control: 'boolean',
      description: 'Outlined style for accordion items.',
    },
    parentId: {
      control: false,
      name: 'parent-id',
      description: 'Computed uniquely per render to avoid collisions (not set manually by the story).',
      table: { disable: true },
    },
    ripple: {
      control: 'boolean',
      description: 'Enables ripple effect on interaction.',
    },
    singleOpen: {
      control: 'boolean',
      name: 'single-open',
      description: 'Allows only one item open at a time.',
    },
    size: { control: { type: 'select' }, options: ['', 'xs',  'sm', 'lg', 'plumage-size'], description: 'Sets the size of the button, e.g., extra small (xs), small (sm), large (lg), or plumage-size. If not set, default size is used.' },
    variant: {
      control: 'text',
      description: 'Visual variant for headers/buttons (e.g., primary, secondary, etc.).',
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
    // parent-id is generated; do not set here
    icon: '',
    outlined: false,
    ripple: false,
    singleOpen: false,
    size: '',
    variant: '',
  },
};

// ——— Stories ———
// Each story gets its own base (used in the unique parent-id that’s generated per render)

export const Basic = {
  name: 'Basic',
  render: (args, ctx) => buildContainer(args, 'basic'),
  parameters: {
    docs: {
      description: {
        story:
          'A default accordion container rendering multiple items. Each item can be opened or closed independently.',
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
        story:
          'Accordion container that enforces a single expanded item at a time (opening one item closes the previously open item).',
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
        story:
          'Accordion container that removes outer borders and rounded corners for a flush appearance.',
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
        story:
          'Accordion container that disables interaction for all items.',
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
        story:
          'Accordion container using custom icons for open/closed states.',
      },
    },
  },
};
