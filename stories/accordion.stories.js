// FILE: stories/accordion.stories.js
// Works with @storybook/web-components-vite. JS-only to avoid TS friction.
const TAG = 'accordion-component';

// Helper: boolean props -> presence; strings -> values.
function setAttr(el, name, v) {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
}

export default {
  title: 'Components/Accordion',
  render: (args) => {
    const host = document.createElement(TAG);

    // attributes (names must match component's kebab-case props)
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
    setAttr(host, 'is-open', args.isOpen);

    // slots
    const header = document.createElement('span');
    header.slot = args.accordion ? 'accordion-header' : 'button-text';
    header.textContent = args.headerText;

    const content = document.createElement('div');
    content.slot = 'content';
    content.innerHTML = args.contentHtml;

    host.append(header, content);

    // optional: see state changes in console
    host.addEventListener('toggleEvent', (e) => {
      // why: verify events flow without Actions addon
      console.info('[accordion] toggleEvent', e.detail);
    });

    host.style.display = 'block';
    host.style.margin = '16px 0';
    return host;
  },
  argTypes: {
    accordion: { control: 'boolean' },
    link: { control: 'boolean' },
    flush: { control: 'boolean' },
    outlined: { control: 'boolean' },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
    ripple: { control: 'boolean' },
    isOpen: { control: 'boolean' },
    contentTxtSize: { control: { type: 'select' }, options: ['', 'xs', 'sm', 'default', 'lg', 'xl', 'xxl'] },
    targetId: { control: 'text' },
    classNames: { control: 'text' },
    variant: { control: 'text' },
    size: { control: { type: 'select' }, options: ['', 'sm', 'md', 'lg'] },
    icon: { control: 'text' },
    headerText: { control: 'text' },
    contentHtml: { control: 'text' },
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
    size: 'md',
    icon: 'fas fa-angle-down',

    headerText: 'Toggle section',
    contentHtml: `<p>This is the collapsible content area.</p>
<p>Put any markup here.</p>`,
  },
};

export const ButtonToggle = {};
export const LinkToggle = { args: { link: true, variant: 'link', headerText: 'Open via link' } };
export const AccordionFlush = { args: { accordion: true, flush: true, headerText: 'Accordion header' } };
export const OpenByDefault = { args: { isOpen: true } };
export const Disabled = { args: { disabled: true, headerText: 'Disabled control' } };
