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
          "An Accordion Component belongs to the Accordion Container but can also be used on its own.\n",
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
};

export const ButtonToggle = {
  args: {
    headerText: 'Button toggle',
    targetId: 'accordion-3',
    variant: 'primary',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
};

export const ButtonToggleDisabled = {
  args: {
    disabled: true,
    headerText: 'Disabled control',
    targetId: 'accordion-4',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
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
};
