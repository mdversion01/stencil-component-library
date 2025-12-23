// stories/accordion-container.stories.js
const TAG = 'accordion-container';

function setAttr(el, name, v) {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
}

export default {
  title: 'Components/Accordion Container',
  render: (args) => {
    const el = document.createElement(TAG);

    // Assign complex prop as a property (not an attribute)
    el.data = Array.isArray(args.data) ? args.data : [];

    setAttr(el, 'parent-id', args.parentId);
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

    el.style.display = 'block';
    el.style.margin = '16px 0';
    return el;
  },
  argTypes: {
    data: { control: 'object' },
    parentId: { control: 'text', name: 'parent-id' },
    flush: { control: 'boolean' },
    variant: { control: 'text' },
    size: { control: { type: 'select' }, options: ['', 'sm', 'md', 'lg'] },
    outlined: { control: 'boolean' },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
    ripple: { control: 'boolean' },
    classNames: { control: 'text', name: 'class-names' },
    contentTxtSize: { control: { type: 'select' }, options: ['', 'xs', 'sm', 'default', 'lg', 'xl', 'xxl'], name: 'content-txt-size' },
    icon: { control: 'text' },
    singleOpen: { control: 'boolean', name: 'single-open' },
  },
  args: {
    data: [
      { header: 'Accordion 1', content: 'Content 1' },
      { header: 'Accordion 2', content: 'Content 2' },
      { header: 'Accordion 3', content: 'Content 3' },
      { header: 'Accordion 4', content: 'Content 4' },
    ],
    parentId: 'accordion-example',
    flush: false,
    variant: 'primary',
    size: 'md',
    outlined: false,
    block: false,
    disabled: false,
    ripple: false,
    classNames: '',
    contentTxtSize: 'sm',
    icon: 'fas fa-angle-down', // or 'fa-chevron-down,fa-chevron-up'
    singleOpen: false,
  },
};

export const Basic = {};
export const SingleOpen = { args: { singleOpen: true } };
export const Flush = { args: { flush: true } };
export const Disabled = { args: { disabled: true } };
export const CustomIcons = { args: { icon: 'fas fa-chevron-down,fas fa-chevron-up' } };
