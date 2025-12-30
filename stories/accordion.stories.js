// stories/accordion.stories.js
const TAG = 'accordion-component';

// helper: presence boolean -> attribute presence; strings -> attribute values
function setAttr(el, name, v) {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
}

/** Build a host with proper slotted children (header/content). */
function buildAccordion(args) {
  const host = document.createElement(TAG);

  // attributes
  setAttr(host, 'accordion', args.accordion);
  setAttr(host, 'content-txt-size', args.contentTxtSize);
  setAttr(host, 'target-id', args.targetId);
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
  // build content as real nodes (no innerHTML)
  const p1 = document.createElement('p');
  p1.textContent = args.contentLine1;
  const p2 = document.createElement('p');
  p2.textContent = args.contentLine2;
  content.append(p1, p2);

  host.append(header, content);

  // open after children are in place so height measuring works
  if (args.isOpen) requestAnimationFrame(() => host.setAttribute('is-open', ''));

  // host.style.display = 'block';
  // host.style.margin = '16px 0';
  return host;
}

export default {
  title: 'Components/Accordion',
  tags: ['autodocs'],
  render: args => buildAccordion(args),
  parameters: {
  docs: {
    description: {
      component: [
        'Use slots to provide your header and body content:',
        '',
        '```html',
        '<accordion-component target-id="accordion-section-3">',
        '  <span slot="accordion-header">Header Text</span>',
        '  <div slot="content">Body content</div>',
        '</accordion-component>',
        '```',
        '',
        '> **Note:** The `headerText`, `contentLine1`, and `contentLine2` controls in Storybook are only used to build slotted nodes for the preview. In your app, provide content via slots as shown above.',
      ].join('\n'),
    },
  },
},
  argTypes: {
    // boolean/toggles
    accordion: { control: 'boolean' },
    link: { control: 'boolean' },
    flush: { control: 'boolean' },
    outlined: { control: 'boolean' },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
    ripple: { control: 'boolean' },
    isOpen: { control: 'boolean' },

    // strings/options
    contentTxtSize: { control: { type: 'select' }, options: ['', 'xs', 'sm', 'default', 'lg', 'xl', 'xxl'] },
    targetId: { control: 'text' },
    classNames: { control: 'text' },
    variant: { control: 'text' },
    size: { control: { type: 'select' }, options: ['', 'xs', 'sm', 'lg'] },
    icon: { control: 'text' },

    // “content” controls are only used to build slotted nodes
    headerText: { control: 'text' },
    contentLine1: { control: 'text' },
    contentLine2: { control: 'text' },
  },
  args: {
    // safe defaults
    accordion: false,
    link: false,
    flush: false,
    outlined: false,
    block: false,
    disabled: false,
    ripple: false,
    isOpen: false,

    contentTxtSize: '',
    targetId: 'acc-1',
    classNames: '',
    variant: 'primary',
    size: '',
    // icon: 'fas fa-angle-down', // default icon is built-in

    // slotted text (not props on the component)
    headerText: 'Toggle section.',
    contentLine1: 'This is the collapsible content area.',
    contentLine2: 'Put any markup here.',
  },
};

// Stories (each with its own target-id)
export const Accordion = {
  args: { accordion: true, headerText: 'Accordion header', targetId: 'accordion-1' },
};

export const AccordionWithCustomIcon = {
  args: {
    accordion: true,
    headerText: 'Custom icon',
    icon: 'fa-solid fa-plus, fa-solid fa-minus',
    targetId: 'accordion-2',
  },
};

export const ButtonToggle = {
  args: { headerText: 'Button toggle', targetId: 'accordion-3' },
};

export const ButtonToggleDisabled = {
  args: { disabled: true, headerText: 'Disabled control', targetId: 'accordion-4' },
};

export const ButtonToggleOpenByDefault = {
  args: { headerText: 'Button toggle', isOpen: true, targetId: 'accordion-5' },
};

export const LinkToggle = {
  args: { link: true, variant: 'link', headerText: 'Open via link', targetId: 'accordion-6' },
};

// component: `

//         `,
