// src/stories/modal-component.stories.js

// ---------- Docs-only portal decorator for fixed overlays ----------
const portalizeModalInDocs = (root) => {
  // No-op outside the Docs page
  const inDocs = !!document.querySelector('.sbdocs, .docs-story');
  if (!inDocs) return { destroy: () => {} };

  // Track anything we re-parent so we can clean it up later
  const portedNodes = new Set();

  // Move a node to <body> and tag it for cleanup
  const portToBody = (el, zIndex) => {
    if (!el || el.__ported_to_body__) return;
    el.__ported_to_body__ = true;
    el.style.position = 'fixed';
    if (zIndex != null) el.style.zIndex = String(zIndex);
    document.body.appendChild(el);
    portedNodes.add(el);
  };

  // Try to find the live modal/backdrop inside the story’s markup
  const syncNow = () => {
    // Story content root (this decorator wraps the story in wrapEl)
    const hostScope = root;
    // Your component renders with *light DOM* (shadow: false), so direct query is fine
    const modalEls = hostScope.querySelectorAll('.modal');
    const backdropEls = hostScope.querySelectorAll('.modal-backdrop');

    modalEls.forEach((m) => portToBody(m, 1060));      // ensure modal above backdrop
    backdropEls.forEach((b) => portToBody(b, 1050));   // backdrop just below modal
  };

  // Observe changes while users open/close the modal
  const mo = new MutationObserver(() => syncNow());
  mo.observe(root, { childList: true, subtree: true, attributes: true });

  // Initial pass in case story renders open by default
  // (or the trigger opens immediately)
  queueMicrotask(syncNow);

  return {
    destroy: () => {
      mo.disconnect();
      // Remove or restore all ported nodes on unmount
      portedNodes.forEach((el) => {
        try {
          el.remove(); // most robust for Storybook; your component will re-create on next open
        } catch (_) {}
      });
      portedNodes.clear();
    },
  };
};

// Global (for this file) decorator that wraps each story result
const docsPortalDecorator = (Story) => {
  // Story may return a string (web-components style) or a Node.
  const wrapEl = document.createElement('div');

  const out = Story();
  if (typeof out === 'string') {
    wrapEl.innerHTML = out;
  } else if (out instanceof Node) {
    wrapEl.appendChild(out);
  }

  // Portal modal/backdrop to body when they appear
  const control = portalizeModalInDocs(wrapEl);

  // Clean up if Storybook removes our wrapper from the DOM
  const removalObserver = new MutationObserver(() => {
    if (!document.body.contains(wrapEl)) {
      removalObserver.disconnect();
      control.destroy();
    }
  });
  removalObserver.observe(document.body, { childList: true, subtree: true });

  return wrapEl;
};

export default {
  title: 'Components/Modal',
  tags: ['autodocs'],
  // Apply ONLY to this story file; safe for both Canvas and Docs
  decorators: [docsPortalDecorator],
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'dynamic' },
    },
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
const Template = (args) => `
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
  ${Array.from({ length: 20 }, (_, i) => `<p>Scrollable content line ${i + 1}</p>`).join('')}
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
