// stories/accordion.stories.js
import DocsPage from './accordion.docs.mdx';

const TAG = 'accordion-component';

// helper: presence boolean -> attribute presence; strings -> attribute values
function setAttr(el, name, v) {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
}

/** Make a per-render unique id so multiple previews never collide. */
function makeUniqueTargetId(base, context) {
  const b = base && String(base).trim() ? base.trim() : 'acc';
  // viewMode is usually "docs" or "story"
  const scope = context?.viewMode || 'story';
  // context.id is stable per story; add a tiny random so multiple instances on same page won’t collide
  const rnd = Math.random().toString(36).slice(2, 6);
  return `${b}-${scope}-${context?.id || 'sb'}-${rnd}`;
}

/** Build a host with proper slotted children (header/content). */
function buildAccordion(args, context) {
  const host = document.createElement(TAG);

  // IMPORTANT: use a unique target-id for this render instance
  const uniqueTargetId = makeUniqueTargetId(args.targetId, context);

  // attributes
  setAttr(host, 'accordion', args.accordion);
  setAttr(host, 'content-txt-size', args.contentTxtSize);
  setAttr(host, 'target-id', uniqueTargetId);
  setAttr(host, 'class-names', args.classNames);
  setAttr(host, 'flush', args.flush);
  setAttr(host, 'outlined', args.outlined);
  setAttr(host, 'block', args.block);
  setAttr(host, 'variant', args.variant);
  setAttr(host, 'size', args.size);
  setAttr(host, 'disabled', args.disabled);
  setAttr(host, 'ripple', args.ripple);
  setAttr(host, 'link', args.link);
  setAttr(host, 'icon', args.icon);

  // slots (HEADER)
  const header = document.createElement('span');
  header.slot = args.accordion ? 'accordion-header' : 'button-text';
  header.textContent = args.headerText;

  // slots (CONTENT)
  const content = document.createElement('div');
  content.slot = 'content';
  const p1 = document.createElement('p');
  p1.textContent = args.contentLine1;
  const p2 = document.createElement('p');
  p2.textContent = args.contentLine2;
  content.append(p1, p2);

  host.append(header, content);

  // open after children are in place so height measuring works
  if (args.isOpen) requestAnimationFrame(() => host.setAttribute('is-open', ''));

  return host;
}

export default {
  title: 'Components/Accordion Container/Accordion',
  tags: ['autodocs'],
  // NOTE: Storybook passes (args, context) — we use context to make a unique id.
  render: (args, context) => buildAccordion(args, context),

  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component: [
          "An Accordion Component belongs to the Accordion Container but can also be use on it's own.\n",
          'Use the `accordion-header` and `content` slots to provide header and body content.\n',
          '```html',
          '<accordion-component target-id="accordion-section-3">',
          '  <span slot="accordion-header">Header Text</span>',
          '  <div slot="content">Body content</div>',
          '</accordion-component>',
          '```',
        ].join('\n'),
      },
    },
  },

  argTypes: {
    accordion: { control: 'boolean', description: 'If true, renders as an accordion item within an accordion container. If false, renders as a standalone button toggle.' },
    block: { control: 'boolean', description: 'If true, the accordion item will take up the full width of its container.' },
    classNames: { control: 'text', description: 'Additional custom class names to apply to the accordion component container.' },
    contentTxtSize: {
      control: { type: 'select' },
      description: 'This property allows you to change the overall size of the text (xs, sm, default, lg, xl, or xxl) that is in the content area of the collapse component.',
      options: ['xs', 'sm', 'default', 'lg', 'xl', 'xxl'],
    },
    disabled: { control: 'boolean', description: 'If present, sets a disabled state on this accordion item, indicating it cannot be selected by user action.' },
    flush: { control: 'boolean', description: 'If true, removes the default outer borders and rounded corners to create a flush appearance when used in an accordion container.' },
    icon: {
      control: 'text',
      description:
        'This property uses the Font Awesome fa-angle-down(caret down) icon by default. It rotates the icon 180 degrees when the collapse component opens and again when it closes. You can pass in an array of two icons to change the icon when the collapse component is open and closed. The first icon in the array is the icon when the collapse component is closed, and the second icon is the icon when it is open. Ex: icon="fas fa-minus-circle, fas fa-plus-circle"',
    },
    isOpen: { control: 'boolean', description: 'If true, the accordion item is expanded (open) by default when rendered.' },
    link: { control: 'boolean', description: 'If true, renders the accordion header as a link.' },
    outlined: { control: 'boolean', description: 'If true, the accordion item will have an outlined style.' },
    ripple: { control: 'boolean', description: 'If true, enables a ripple effect on user interaction.' },
    size: {
      control: { type: 'select' },
      options: ['', 'xs', 'sm', 'lg', 'plumage-size'],
      description: 'Sets the size of the button, e.g., extra small (xs), small (sm), large (lg), or plumage-size. If not set, default size is used.',
    },
    targetId: { description: 'ID of the collapsible region this control toggles. Must be unique per story.', control: 'text' },
    variant: {
      control: 'text',
      description:
        'Applies pre-defined styling to the accordion header/button. Common variants include "primary", "secondary", "success", "danger", "warning", "info", "light", and "dark".',
    },

    // slotted text (for preview building only)
    headerText: { table: { disable: true }, control: 'false', description: 'Text content for the header slot (used only in this Storybook preview).' },
    contentLine1: { table: { disable: true }, control: 'false', description: 'Text content for the first line of the content slot (used only in this Storybook preview).' },
    contentLine2: { table: { disable: true }, control: 'false', description: 'Text content for the second line of the content slot (used only in this Storybook preview).' },
  },

  controls: {
    exclude: ['headerText', 'contentLine1', 'contentLine2'], // belt & suspenders for Controls panel
  },

  args: {
    accordion: false,
    block: false,
    classNames: '',
    contentTxtSize: '',
    disabled: false,
    flush: false,
    isOpen: false,
    link: false,
    outlined: false,
    ripple: false,
    size: '',
    targetId: 'acc-1', // base; will be uniquified per render
    variant: '',

    // headerText: 'Toggle section.',
    // contentLine1: 'This is the collapsible content area.',
    // contentLine2: 'Put any markup here.',
  },
};

// Stories (each with its own base target-id)
export const Accordion = {
  args: { accordion: true, headerText: 'Accordion header', targetId: 'accordion-1', contentLine1: 'This is the collapsible content area.', contentLine2: 'Put any markup here.' },
  parameters: {
    docs: {
      description: {
        story: 'Basic accordion item that can be used on its own or as part of an accordion container. Each item can be opened or closed independently.',
      },
    },
  },
};

export const AccordionWithCustomIcon = {
  args: {
    accordion: true,
    headerText: 'Custom icon',
    icon: 'fa-solid fa-plus, fa-solid fa-minus',
    targetId: 'accordion-2',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Accordion item using custom icons for open/closed states.',
      },
    },
  },
};

export const ButtonToggle = {
  args: { headerText: 'Button toggle', targetId: 'accordion-3', variant: 'primary', contentLine1: 'This is the collapsible content area.', contentLine2: 'Put any markup here.' },
  parameters: {
    docs: {
      description: {
        story: 'Standalone button toggle that can be used outside of an accordion container.',
      },
    },
  },
};

export const ButtonToggleDisabled = {
  args: { disabled: true, headerText: 'Disabled control', targetId: 'accordion-4', contentLine1: 'This is the collapsible content area.', contentLine2: 'Put any markup here.' },
  parameters: {
    docs: {
      description: {
        story: 'Standalone button toggle in a disabled state, indicating it cannot be interacted with.',
      },
    },
  },
};

export const ButtonToggleOpenByDefault = {
  args: {
    headerText: 'Button toggle',
    isOpen: true,
    targetId: 'accordion-5',
    variant: 'success',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standalone button toggle that is expanded (open) by default when rendered.',
      },
    },
  },
};

export const LinkToggle = {
  args: {
    link: true,
    variant: 'link',
    headerText: 'Open via link',
    targetId: 'accordion-6',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standalone toggle rendered as a link.',
      },
    },
  },
};
