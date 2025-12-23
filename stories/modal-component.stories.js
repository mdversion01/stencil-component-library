// src/stories/modal-component.stories.js

export default {
  title: 'Components/Modal',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { source: { type: 'dynamic' } },
  },
  argTypes: {
    // Trigger button props
    btnText: { control: 'text' },
    variant: { control: 'text' },
    size: { control: 'text' }, // '', 'sm', 'lg'
    shape: { control: 'text' },
    outlined: { control: 'boolean' },
    block: { control: 'boolean' },
    link: { control: 'boolean' },
    ripple: { control: 'boolean' },
    classNames: { control: 'text' },
    disabled: { control: 'boolean' },
    titleAttr: { control: 'text' },
    ariaLabel: { control: 'text' },

    // Modal props
    modalTitle: { control: 'text' },
    modalSize: { control: { type: 'radio' }, options: [undefined, 'sm', 'lg', 'xl'] },
    modalFullScreen: {
      control: { type: 'radio' },
      options: [undefined, 'fullscreen', 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'],
    },
    scrollableBody: { control: 'boolean' },
    scrollLongContent: { control: 'boolean' },
    verticallyCentered: { control: 'boolean' },

    cancelCloseBtn: { control: 'text' },

    // Slots (HTML strings)
    bodyHtml: { control: 'text' },
    footerHtml: { control: 'text' },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) =>
  val === undefined || val === null || val === '' ? '' : ` ${name}="${String(val)}"`;

/** Interactive base */
const Template = args => `
<modal-component
  ${attr('btn-text', args.btnText)}
  ${attr('variant', args.variant)}
  ${attr('size', args.size)}
  ${attr('shape', args.shape)}
  ${boolAttr('outlined', args.outlined)}
  ${boolAttr('block', args.block)}
  ${boolAttr('link', args.link)}
  ${boolAttr('ripple', args.ripple)}
  ${attr('class-names', args.classNames)}
  ${boolAttr('disabled', args.disabled)}
  ${attr('title-attr', args.titleAttr)}
  ${attr('aria-label', args.ariaLabel)}

  ${attr('modal-title', args.modalTitle)}
  ${attr('modal-size', args.modalSize)}
  ${attr('modal-full-screen', args.modalFullScreen)}
  ${boolAttr('scrollable-body', args.scrollableBody)}
  ${boolAttr('scroll-long-content', args.scrollLongContent)}
  ${boolAttr('vertically-centered', args.verticallyCentered)}

  ${attr('cancel-close-btn', args.cancelCloseBtn)}
>
  ${args.bodyHtml || `
  <p>Woohoo, you're reading this text in a modal!</p>
  <p>This is the modal body. Add any markup you like here.</p>`}

  ${args.footerHtml
    ? `<span slot="footer">${args.footerHtml}</span>`
    : `<button-component slot="footer" variant="primary">Save changes</button-component>`}
</modal-component>
`;

export const Playground = Template.bind({});
Playground.args = {
  // Button
  btnText: 'Launch demo modal',
  variant: 'primary',
  size: '',
  shape: '',
  outlined: false,
  block: false,
  link: false,
  ripple: false,
  classNames: '',
  disabled: false,
  titleAttr: '',
  ariaLabel: '',

  // Modal
  modalTitle: 'Modal title',
  modalSize: undefined,
  modalFullScreen: undefined,
  scrollableBody: false,
  scrollLongContent: false,
  verticallyCentered: false,

  cancelCloseBtn: 'Close',

  // Slots
  bodyHtml: '',
  footerHtml: '',
};

/* ------------------------- Focused Examples ------------------------- */

export const Basic = () => `
<modal-component variant="primary" btn-text="Open modal">
  <p>Basic modal content.</p>
  <button-component slot="footer" variant="primary">Save changes</button-component>
</modal-component>
`;

export const Sizes = () => `
<div style="display:grid; gap:16px;">
  <modal-component variant="secondary" btn-text="Small (sm)" modal-size="sm">
    <p>Small modal.</p>
    <button-component slot="footer" variant="primary">OK</button-component>
  </modal-component>

  <modal-component variant="secondary" btn-text="Large (lg)" modal-size="lg">
    <p>Large modal.</p>
    <button-component slot="footer" variant="primary">OK</button-component>
  </modal-component>

  <modal-component variant="secondary" btn-text="Extra Large (xl)" modal-size="xl">
    <p>Extra large modal.</p>
    <button-component slot="footer" variant="primary">OK</button-component>
  </modal-component>
</div>
`;

export const FullscreenVariants = () => `
<div style="display:grid; gap:16px;">
  <modal-component variant="dark" btn-text="Fullscreen" modal-full-screen="fullscreen">
    <p>Always fullscreen.</p>
  </modal-component>

  <modal-component variant="dark" btn-text="md-down fullscreen" modal-full-screen="md-down">
    <p>Fullscreen at md and below.</p>
  </modal-component>
</div>
`;

export const VerticallyCentered = () => `
<modal-component variant="success" btn-text="Centered modal" vertically-centered>
  <p>This modal is vertically centered.</p>
</modal-component>
`;

export const ScrollableBody = () => `
<modal-component variant="info" btn-text="Scrollable body" scrollable-body modal-size="lg">
  ${Array.from({ length: 14 }, (_, i) => `<p>Scrollable content line ${i + 1}</p>`).join('')}
</modal-component>
`;

export const LongContentScroll = () => `
<modal-component variant="secondary" btn-text="Long content (window scroll)" scroll-long-content>
  ${Array.from({ length: 30 }, (_, i) => `<p>Long content ${i + 1}</p>`).join('')}
</modal-component>
`;

export const OutlinedTrigger = () => `
<modal-component variant="primary" outlined btn-text="Outlined trigger">
  <p>Modal opened by an outlined button.</p>
</modal-component>
`;

export const LinkTrigger = () => `
<modal-component link btn-text="Open as link">
  <p>Trigger is styled like a link.</p>
</modal-component>
`;

export const CustomFooter = () => `
<modal-component variant="primary" btn-text="Custom footer">
  <p>Add any controls to the footer slot.</p>
  <div slot="footer" style="display:flex; gap:8px;">
    <button-component variant="secondary">Secondary</button-component>
    <button-component variant="primary">Primary Action</button-component>
  </div>
</modal-component>
`;
