// stories/accordion.stories.js
import DocsPage from './accordion.docs.mdx';

const TAG = 'accordion-component';

function setAttr(el, name, v) {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
}

function makeUniqueTargetId(base, context) {
  const b = base && String(base).trim() ? base.trim() : 'acc';
  const scope = context?.viewMode || 'story';
  const rnd = Math.random().toString(36).slice(2, 6);
  return `${b}-${scope}-${context?.id || 'sb'}-${rnd}`;
}

function buildAccordion(args, context) {
  const host = document.createElement(TAG);

  const uniqueTargetId = makeUniqueTargetId(args.targetId, context);

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
  setAttr(host, 'is-open', args.isOpen);

  const header = document.createElement('span');
  header.slot = args.accordion ? 'accordion-header' : 'button-text';
  header.textContent = args.headerText;

  const content = document.createElement('div');
  content.slot = 'content';
  const p1 = document.createElement('p');
  p1.textContent = args.contentLine1;
  const p2 = document.createElement('p');
  p2.textContent = args.contentLine2;
  content.append(p1, p2);

  host.append(header, content);
  return host;
}

export default {
  title: 'Components/Accordion Container/Accordion',
  tags: ['autodocs'],
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
          '',
          '**Accessibility:**',
          '- Toggle exposes `aria-expanded` and `aria-controls`.',
          '- Panel uses `role="region"` and `aria-labelledby` tied to the toggle id.',
          '- Collapsed panels are `aria-hidden`, `hidden`, and `inert` to prevent focus.',
        ].join('\n'),
      },
    },
  },

  argTypes: {
    accordion: {
      control: 'boolean',
      description:
        'If true, renders as an accordion item within an accordion container. If false, renders as a standalone button toggle.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },
    isOpen: {
      control: 'boolean',
      description: 'If true, the accordion item is expanded (open) by default when rendered.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },

    variant: { control: 'text', description: 'Applies pre-defined styling to the accordion header/button.', table: { category: 'Appearance' } },
    outlined: { control: 'boolean', description: 'If true, trigger button renders outlined.', table: { category: 'Appearance', defaultValue: { summary: false } } },
    flush: { control: 'boolean', description: 'If true, removes outer borders/rounded corners when used in a container.', table: { category: 'Appearance', defaultValue: { summary: false } } },
    size: { control: { type: 'select' }, options: ['', 'xs', 'sm', 'lg', 'plumage-size'], description: 'Sets trigger button size.', table: { category: 'Appearance' } },
    contentTxtSize: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'default', 'lg', 'xl', 'xxl', ''],
      description: 'Change text size in content area.',
      table: { category: 'Appearance' },
    },
    icon: { control: 'text', description: 'Icon class(es). Comma-separated pair: closed, open.', table: { category: 'Appearance' } },

    block: { control: 'boolean', description: 'If true, trigger takes full width.', table: { category: 'Layout', defaultValue: { summary: false } } },
    classNames: { control: 'text', description: 'Additional custom class names for the accordion container.', table: { category: 'Layout' } },

    disabled: { control: 'boolean', description: 'Disables interaction.', table: { category: 'State', defaultValue: { summary: false } } },
    ripple: { control: 'boolean', description: 'Enables ripple effect on trigger.', table: { category: 'Interaction', defaultValue: { summary: false } } },
    link: { control: 'boolean', description: 'If true, renders trigger as a link.', table: { category: 'Interaction', defaultValue: { summary: false } } },

    targetId: {
      control: 'text',
      description: 'Base id for the collapsible region; Storybook will uniquify it per render.',
      table: { category: 'Targeting' },
    },

    headerText: { table: { disable: true }, control: 'false' },
    contentLine1: { table: { disable: true }, control: 'false' },
    contentLine2: { table: { disable: true }, control: 'false' },
  },

  controls: { exclude: ['headerText', 'contentLine1', 'contentLine2'] },

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
    targetId: 'acc-1',
    variant: '',
    icon: 'fas fa-angle-down',

    headerText: 'Toggle section.',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
};

// Stories (kept; none removed)
export const Accordion = {
  args: { accordion: true, headerText: 'Accordion header', targetId: 'accordion-1', contentLine1: 'This is the collapsible content area.', contentLine2: 'Put any markup here.' },
  parameters: { docs: { description: { story: 'Basic accordion item that can be used on its own or as part of an accordion container. Each item can be opened or closed independently.' } } },
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
  parameters: { docs: { description: { story: 'Accordion item using custom icons for open/closed states.' } } },
};

export const ButtonToggle = {
  args: { headerText: 'Button toggle', targetId: 'accordion-3', variant: 'primary', contentLine1: 'This is the collapsible content area.', contentLine2: 'Put any markup here.' },
  parameters: { docs: { description: { story: 'Standalone button toggle that can be used outside of an accordion container.' } } },
};

export const ButtonToggleDisabled = {
  args: { disabled: true, headerText: 'Disabled control', targetId: 'accordion-4', contentLine1: 'This is the collapsible content area.', contentLine2: 'Put any markup here.' },
  parameters: { docs: { description: { story: 'Standalone button toggle in a disabled state, indicating it cannot be interacted with.' } } },
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
  parameters: { docs: { description: { story: 'Standalone button toggle that is expanded (open) by default when rendered.' } } },
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
  parameters: { docs: { description: { story: 'Standalone toggle rendered as a link.' } } },
};

// NEW: Accessibility matrix story (updated to include hidden/inert)
export const AccessibilityMatrix = {
  name: 'Accessibility matrix (computed)',
  render: (_args, context) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML = `<strong>Accessibility matrix</strong><div style="opacity:.8">Shows computed toggle + region ARIA, ids, expanded state, and hidden/inert.</div>`;
    wrap.appendChild(title);

    const mkRow = (labelText, makeHost) => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '260px 1fr';
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
      demo.style.display = 'inline-flex';
      demo.style.alignItems = 'center';
      demo.style.gap = '12px';
      demo.style.flexWrap = 'wrap';

      const host = makeHost();
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

      const update = () => {
        const bc = host.querySelector('button-component');
        const inner = host.querySelector('button-component button, button-component a');
        const region = host.querySelector('[role="region"]');

        const attrs = {
          mode: host.getAttribute('accordion') != null ? 'accordion' : host.getAttribute('link') != null ? 'link' : 'button',
          targetId: region?.getAttribute('id') ?? host.getAttribute('target-id'),
          headerId: bc?.getAttribute('id') ?? null,
          innerTag: inner?.tagName ?? null,
          innerRole: inner?.getAttribute('role') ?? null,
          'aria-expanded': inner?.getAttribute('aria-expanded') ?? null,
          'aria-controls': inner?.getAttribute('aria-controls') ?? null,
          regionId: region?.getAttribute('id') ?? null,
          regionRole: region?.getAttribute('role') ?? null,
          'region aria-labelledby': region?.getAttribute('aria-labelledby') ?? null,
          'aria-hidden': region?.getAttribute('aria-hidden') ?? null,
          hidden: region?.hasAttribute('hidden') ?? null,
          inert: region?.hasAttribute('inert') ?? null,
          display: region?.style.display ?? null,
          height: region?.style.height ?? null,
        };
        pre.textContent = JSON.stringify(attrs, null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));
      return row;
    };

    const mk = (args) => buildAccordion(args, context);

    wrap.appendChild(
      mkRow('Button toggle (closed)', () =>
        mk({
          accordion: false,
          link: false,
          isOpen: false,
          targetId: 'mx-btn',
          headerText: 'Toggle section',
          contentLine1: 'Body',
          contentLine2: 'More',
        }),
      ),
    );

    wrap.appendChild(
      mkRow('Button toggle (open)', () =>
        mk({
          accordion: false,
          link: false,
          isOpen: true,
          targetId: 'mx-btn-open',
          headerText: 'Toggle section',
          contentLine1: 'Body',
          contentLine2: 'More',
        }),
      ),
    );

    wrap.appendChild(
      mkRow('Accordion mode (with icon)', () =>
        mk({
          accordion: true,
          icon: 'fa-solid fa-plus, fa-solid fa-minus',
          isOpen: false,
          targetId: 'mx-acc',
          headerText: 'Accordion header',
          contentLine1: 'Body',
          contentLine2: 'More',
        }),
      ),
    );

    wrap.appendChild(
      mkRow('Link mode', () =>
        mk({
          link: true,
          variant: 'link',
          isOpen: false,
          targetId: 'mx-link',
          headerText: 'Open via link',
          contentLine1: 'Body',
          contentLine2: 'More',
        }),
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders multiple configurations and prints computed accessibility attributes for the inner toggle and the region: `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`, ids, expanded state, and hidden/inert behavior.',
      },
    },
  },
};
