// File: src/stories/accordion/accordion.stories.js
import DocsPage from './accordion.docs.mdx';
import { buildAccordion } from './accordion.story-helpers';

export default {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  render: (args, context) => buildAccordion(args, context),

  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component: [
          'An Accordion Component belongs to the Accordion Container but can also be used on its own.\n',
          'Use the `accordion-header` and `content` slots to provide header and body content.\n',
          '',
          '**Accessibility:**',
          '- Toggle exposes `aria-expanded` and `aria-controls`.',
          '- Panel uses `role="region"` and `aria-labelledby` tied to the toggle id.',
          '- Collapsed panels are `aria-hidden` and `inert` (do not use `hidden`/`display:none` so the height transition can animate).',
          '',
          '**Animation model (Bootstrap-like):**',
          '- Resting closed: `class="collapse"` (CSS height: 0).',
          '- Resting open: `class="collapse show"` (CSS height: auto).',
          '- During transition: `class="collapsing"` with an inline `height` set imperatively only while animating.',
        ].join('\n'),
      },
    },
  },

  argTypes: {
    accordion: {
      control: 'boolean',
      description: 'If true, renders as an accordion item within an accordion container. If false, renders as a standalone button toggle.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },
    isOpen: {
      control: 'boolean',
      description: 'If true, the accordion item is expanded by default when rendered.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },
    variant: {
      control: 'text',
      description: 'Applies pre-defined styling to the accordion header/button.',
      table: { category: 'Appearance' },
    },
    outlined: {
      control: 'boolean',
      description: 'If true, trigger button renders outlined.',
      table: { category: 'Appearance', defaultValue: { summary: false } },
    },
    flush: {
      control: 'boolean',
      description: 'If true, removes outer borders/rounded corners when used in a container.',
      table: { category: 'Appearance', defaultValue: { summary: false } },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'xs', 'sm', 'lg', 'plumage-size'],
      description: 'Sets trigger button size.',
      table: { category: 'Appearance' },
    },
    contentTxtSize: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'default', 'lg', 'xl', 'xxl', ''],
      description: 'Change text size in content area.',
      table: { category: 'Appearance' },
    },
    icon: {
      control: 'text',
      description: 'Icon class(es). Comma-separated pair: closed, open.',
      table: { category: 'Appearance' },
    },
    block: {
      control: 'boolean',
      description: 'If true, trigger takes full width.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },
    classNames: {
      control: 'text',
      description: 'Additional custom class names for the accordion container.',
      table: { category: 'Layout' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction.',
      table: { category: 'State', defaultValue: { summary: false } },
    },
    ripple: {
      control: 'boolean',
      description: 'Enables ripple effect on trigger.',
      table: { category: 'Interaction', defaultValue: { summary: false } },
    },
    link: {
      control: 'boolean',
      description: 'If true, renders trigger as a link.',
      table: { category: 'Interaction', defaultValue: { summary: false } },
    },
    targetId: {
      control: 'text',
      description: 'Base id for the collapsible region; Storybook will uniquify it per render.',
      table: { category: 'Targeting' },
    },
    regionLabelledby: {
      control: 'text',
      name: 'region-labelledby',
      description: 'Optional external label element id for the region.',
      table: { category: 'Accessibility' },
    },
    headerText: { table: { disable: true }, control: false },
    contentLine1: { table: { disable: true }, control: false },
    contentLine2: { table: { disable: true }, control: false },
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
    regionLabelledby: '',
    headerText: 'Toggle section.',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
};

export const Accordion = {
  args: {
    accordion: true,
    headerText: 'Accordion header',
    targetId: 'accordion-1',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default accordion item with basic header and content.',
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
  parameters: { docs: { description: { story: 'Accordion item using custom icons for open/closed states.' } } },
};

export const ButtonToggle = {
  args: {
    headerText: 'Button toggle',
    targetId: 'accordion-3',
    variant: 'primary',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
  parameters: { docs: { description: { story: 'Accordion item with a button toggle.' } } },
};

export const ButtonToggleDisabled = {
  args: {
    disabled: true,
    headerText: 'Disabled control',
    targetId: 'accordion-4',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
  parameters: { docs: { description: { story: 'Button toggle in a disabled state.' } } },
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
  parameters: { docs: { description: { story: 'Button toggle open by default.' } } },
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
  parameters: { docs: { description: { story: 'Accordion item with a link toggle.' } } },
};

// Accessibility matrix story (UPDATED for class-driven collapse + no hidden/display:none)
export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (_args, context) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML =
      `<strong>Accessibility matrix</strong>` +
      `<div style="opacity:.8">Shows computed toggle + region ARIA, ids, expanded state, and collapse classes (collapse/show/collapsing).</div>`;
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
      // demo.style.display = 'inline-flex';
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

        const cls = region ? Array.from(region.classList).join(' ') : null;

        const attrs = {
          mode: host.getAttribute('accordion') != null ? 'accordion' : host.getAttribute('link') != null ? 'link' : 'button',
          regionId: region?.getAttribute('id') ?? host.getAttribute('target-id'),
          toggleHostId: bc?.getAttribute('id') ?? null,
          innerTag: inner?.tagName ?? null,
          innerRole: inner?.getAttribute('role') ?? null,
          'aria-expanded': inner?.getAttribute('aria-expanded') ?? null,
          'aria-controls': inner?.getAttribute('aria-controls') ?? null,
          regionRole: region?.getAttribute('role') ?? null,
          'region aria-labelledby': region?.getAttribute('aria-labelledby') ?? null,
          'aria-hidden': region?.getAttribute('aria-hidden') ?? null,
          inert: region?.hasAttribute('inert') ?? null,
          class: cls,
          inlineHeight: region?.style?.height ?? null, // set only during transitions
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
          variant: 'primary',
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
          variant: 'primary',
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
          'Renders multiple configurations and prints computed accessibility attributes for the toggle + region: `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`, ids, and collapse state via classes (`collapse`/`show`/`collapsing`).',
      },
    },
  },
};
