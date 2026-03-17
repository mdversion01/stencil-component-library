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
    const hostScope = root;
    const modalEls = hostScope.querySelectorAll('.modal');
    const backdropEls = hostScope.querySelectorAll('.modal-backdrop');

    modalEls.forEach((m) => portToBody(m, 1060)); // modal above backdrop
    backdropEls.forEach((b) => portToBody(b, 1050)); // backdrop below modal
  };

  // Observe changes while users open/close the modal
  const mo = new MutationObserver(() => syncNow());
  mo.observe(root, { childList: true, subtree: true, attributes: true });

  queueMicrotask(syncNow);

  return {
    destroy: () => {
      mo.disconnect();
      portedNodes.forEach((el) => {
        try {
          el.remove(); // most robust for Storybook; component re-creates next open
        } catch (_) {}
      });
      portedNodes.clear();
    },
  };
};

// Global (for this file) decorator that wraps each story result
const docsPortalDecorator = (Story) => {
  const wrapEl = document.createElement('div');

  const out = Story();
  if (typeof out === 'string') {
    wrapEl.innerHTML = out;
  } else if (out instanceof Node) {
    wrapEl.appendChild(out);
  }

  const control = portalizeModalInDocs(wrapEl);

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
  decorators: [docsPortalDecorator],
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args, ctx?.name),
      },
      description: {
        component:
          'The <modal-component> is a customizable modal dialog that can be triggered by a button. It supports configuring the trigger button, modal size/fullscreen behavior, scrollability, and slots for body and footer. Includes required ARIA relationships for 508/axe.',
      },
    },
  },
  argTypes: {
    /* -----------------------------
     * Trigger button props
     * ------------------------------ */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'ARIA label for the modal trigger button.',
    },

    titleAttr: {
      control: 'text',
      name: 'title-attr',
      table: { category: 'Trigger Button' },
      description: 'Title attribute for the modal trigger button.',
    },

    btnText: {
      control: 'text',
      name: 'btn-text',
      table: { category: 'Trigger Button' },
      description: 'Text content of the modal trigger button.',
    },

    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'danger'],
      name: 'variant',
      table: { category: 'Trigger Button' },
      description: 'Variant style of the modal trigger button.',
    },

    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: { category: 'Trigger Button' },
      description: 'Size of the modal trigger button.',
    },

    shape: {
      control: { type: 'select' },
      options: ['', 'square', 'pill', 'circle'],
      name: 'shape',
      table: { category: 'Trigger Button' },
      description: 'Shape of the modal trigger button.',
    },

    outlined: {
      control: 'boolean',
      name: 'outlined',
      table: { defaultValue: { summary: false }, category: 'Trigger Button' },
      description: 'Whether the trigger button has an outlined style.',
    },

    block: {
      control: 'boolean',
      name: 'block',
      table: { defaultValue: { summary: false }, category: 'Trigger Button' },
      description: 'Whether the trigger button is block-level.',
    },

    link: {
      control: 'boolean',
      name: 'link',
      table: { defaultValue: { summary: false }, category: 'Trigger Button' },
      description: 'Whether the trigger button is styled as a link.',
    },

    ripple: {
      control: 'boolean',
      name: 'ripple',
      table: { defaultValue: { summary: false }, category: 'Trigger Button' },
      description: 'Whether the trigger button has a ripple effect.',
    },

    classNames: {
      control: 'text',
      name: 'class-names',
      table: { category: 'Trigger Button' },
      description: 'Additional CSS classes for the trigger button.',
    },

    disabled: {
      control: 'boolean',
      name: 'disabled',
      table: { defaultValue: { summary: false }, category: 'State' },
      description: 'Whether the trigger button is disabled.',
    },

    /* -----------------------------
     * Modal props
     * ------------------------------ */
    modalId: {
      control: 'text',
      name: 'modal-id',
      table: { category: 'Modal' },
      description:
        'Optional id for the modal. If omitted, the component generates a stable id per instance. Useful when you need to reference the modal from outside.',
    },

    modalTitle: {
      control: 'text',
      name: 'modal-title',
      table: { category: 'Modal' },
      description: 'Title text of the modal.',
    },

    modalSize: {
      control: { type: 'select' },
      options: [undefined, 'sm', 'lg', 'xl'],
      name: 'modal-size',
      table: { category: 'Modal' },
      description: 'Size of the modal.',
    },

    modalFullScreen: {
      control: { type: 'select' },
      options: [undefined, 'fullscreen', 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'],
      name: 'modal-full-screen',
      table: { category: 'Modal' },
      description: 'Fullscreen behavior of the modal.',
    },

    scrollableBody: {
      control: 'boolean',
      name: 'scrollable-body',
      table: { defaultValue: { summary: false }, category: 'Modal' },
      description: 'Whether the modal body is scrollable (Bootstrap modal-dialog-scrollable).',
    },

    scrollLongContent: {
      control: 'boolean',
      name: 'scroll-long-content',
      table: { defaultValue: { summary: false }, category: 'Modal' },
      description: 'Whether the modal has long content that requires window scrolling.',
    },

    verticallyCentered: {
      control: 'boolean',
      name: 'vertically-centered',
      table: { defaultValue: { summary: false }, category: 'Modal' },
      description: 'Whether the modal is vertically centered.',
    },

    cancelCloseBtn: {
      control: 'text',
      name: 'cancel-close-btn',
      table: { category: 'Modal' },
      description: 'Text for the modal cancel/close button.',
    },

    /* -----------------------------
     * Slots (HTML strings)
     * ------------------------------ */
    bodyHtml: {
      control: 'text',
      name: 'body-html',
      table: { category: 'Slots' },
      description: 'HTML content for the modal body.',
    },

    footerHtml: {
      control: 'text',
      name: 'footer-html',
      table: { category: 'Slots' },
      description: 'HTML content for the modal footer.',
    },
  },
  args: {
    // Trigger
    ariaLabel: '',
    block: false,
    btnText: 'Launch demo modal',
    classNames: '',
    disabled: false,
    link: false,
    outlined: false,
    ripple: false,
    size: '',
    shape: '',
    titleAttr: '',
    variant: 'primary',

    // Modal
    modalId: '',
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
  },
};

const normalize = (v) => {
  if (v === '' || v == null) return undefined;
  if (v === true) return true;
  if (v === false) return false;
  return v;
};

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) => {
  const v = normalize(val);
  return v === undefined || v === false ? '' : v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
};

const buildDocsHtml = (args, storyName = '') => {
  // For multi-instance stories, preserve their custom code blocks (defined below).
  // For others, render an args-driven single instance.
  const n = String(storyName || '').replace(/\s+/g, '');

  if (n === 'ModalSizes') return DOCS_SIZES;
  if (n === 'Fullscreenvariants') return DOCS_FULLSCREEN;
  if (n === 'Scrollablebodymodal') return DOCS_SCROLLABLE_BODY;
  if (n === 'Longcontent(windowscroll)') return DOCS_LONG_SCROLL;
  if (n === 'AccessibilityMatrix') return DOCS_MATRIX;

  return [
    `<modal-component`,
    `  ${attr('btn-text', args.btnText)}`,
    `  ${attr('variant', args.variant)}`,
    `  ${attr('size', args.size)}`,
    `  ${attr('shape', args.shape)}`,
    `  ${boolAttr('outlined', !!args.outlined)}`,
    `  ${boolAttr('block', !!args.block)}`,
    `  ${boolAttr('link', !!args.link)}`,
    `  ${boolAttr('ripple', !!args.ripple)}`,
    `  ${attr('class-names', args.classNames)}`,
    `  ${boolAttr('disabled', !!args.disabled)}`,
    `  ${attr('title-attr', args.titleAttr)}`,
    `  ${attr('aria-label', args.ariaLabel)}`,
    ``,
    `  ${attr('modal-id', args.modalId)}`,
    `  ${attr('modal-title', args.modalTitle)}`,
    `  ${attr('modal-size', args.modalSize)}`,
    `  ${attr('modal-full-screen', args.modalFullScreen)}`,
    `  ${boolAttr('scrollable-body', !!args.scrollableBody)}`,
    `  ${boolAttr('scroll-long-content', !!args.scrollLongContent)}`,
    `  ${boolAttr('vertically-centered', !!args.verticallyCentered)}`,
    ``,
    `  ${attr('cancel-close-btn', args.cancelCloseBtn)}`,
    `>`,
    `  ${args.bodyHtml || `<p>Woohoo, you're reading this text in a modal!</p>\n  <p>This is the modal body. Add any markup you like here.</p>`}`,
    ``,
    `  ${
      args.footerHtml
        ? `<span slot="footer">${args.footerHtml}</span>`
        : `<button-component slot="footer" variant="primary">Save changes</button-component>`
    }`,
    `</modal-component>`,
  ]
    .filter((l) => l.trim() !== '')
    .join('\n');
};

/** Interactive base */
const Template = (args) => `
<modal-component
  ${attr('btn-text', args.btnText)}
  ${attr('variant', args.variant)}
  ${attr('size', args.size)}
  ${attr('shape', args.shape)}
  ${boolAttr('outlined', !!args.outlined)}
  ${boolAttr('block', !!args.block)}
  ${boolAttr('link', !!args.link)}
  ${boolAttr('ripple', !!args.ripple)}
  ${attr('class-names', args.classNames)}
  ${boolAttr('disabled', !!args.disabled)}
  ${attr('title-attr', args.titleAttr)}
  ${attr('aria-label', args.ariaLabel)}

  ${attr('modal-id', args.modalId)}
  ${attr('modal-title', args.modalTitle)}
  ${attr('modal-size', args.modalSize)}
  ${attr('modal-full-screen', args.modalFullScreen)}
  ${boolAttr('scrollable-body', !!args.scrollableBody)}
  ${boolAttr('scroll-long-content', !!args.scrollLongContent)}
  ${boolAttr('vertically-centered', !!args.verticallyCentered)}

  ${attr('cancel-close-btn', args.cancelCloseBtn)}
>
  ${
    args.bodyHtml ||
    `
  <p>Woohoo, you're reading this text in a modal!</p>
  <p>This is the modal body. Add any markup you like here.</p>`
  }

  ${
    args.footerHtml
      ? `<span slot="footer">${args.footerHtml}</span>`
      : `<button-component slot="footer" variant="primary">Save changes</button-component>`
  }
</modal-component>
`;

/* ------------------------- Stories ------------------------- */

export const Basic = Template.bind({});
Basic.storyName = 'Basic modal';
Basic.args = {
  btnText: 'Open modal',
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

  modalId: '',
  modalTitle: 'Modal title',
  modalSize: undefined,
  modalFullScreen: undefined,
  scrollableBody: false,
  scrollLongContent: false,
  verticallyCentered: false,
  cancelCloseBtn: 'Close',

  bodyHtml: '<p>Basic modal content.</p>',
  footerHtml: '',
};
Basic.parameters = {
  docs: {
    description: {
      story:
        'A basic modal wired to Controls. Component supplies required ARIA attributes (role="dialog", aria-modal="true", aria-labelledby + aria-describedby that resolve).',
    },
  },
};

const DOCS_SIZES = [
  '<div style="display:grid; gap:16px;">',
  '  <modal-component variant="secondary" btn-text="Small (sm)" modal-size="sm">',
  '    <p>Small modal.</p>',
  '    <button-component slot="footer" variant="primary">OK</button-component>',
  '  </modal-component>',
  '',
  '  <modal-component variant="secondary" btn-text="Large (lg)" modal-size="lg">',
  '    <p>Large modal.</p>',
  '    <button-component slot="footer" variant="primary">OK</button-component>',
  '  </modal-component>',
  '',
  '  <modal-component variant="secondary" btn-text="Extra Large (xl)" modal-size="xl">',
  '    <p>Extra large modal.</p>',
  '    <button-component slot="footer" variant="primary">OK</button-component>',
  '  </modal-component>',
  '</div>',
].join('\n');

export const Sizes = () => DOCS_SIZES;
Sizes.storyName = 'Modal sizes';
Sizes.parameters = {
  docs: {
    source: { code: DOCS_SIZES, language: 'html' },
    description: { story: 'Demonstrates modal sizes: sm, lg, xl.' },
  },
};

const DOCS_FULLSCREEN = [
  '<div style="display:grid; gap:16px;">',
  '  <modal-component variant="dark" btn-text="Fullscreen" modal-full-screen="fullscreen">',
  '    <p>Always fullscreen.</p>',
  '  </modal-component>',
  '',
  '  <modal-component variant="dark" btn-text="md-down fullscreen" modal-full-screen="md-down">',
  '    <p>Fullscreen at md and below.</p>',
  '  </modal-component>',
  '</div>',
].join('\n');

export const FullscreenVariants = () => DOCS_FULLSCREEN;
FullscreenVariants.storyName = 'Fullscreen variants';
FullscreenVariants.parameters = {
  docs: {
    source: { code: DOCS_FULLSCREEN, language: 'html' },
    description: { story: 'Demonstrates fullscreen variants.' },
  },
};

export const VerticallyCentered = () => `
<modal-component variant="success" btn-text="Centered modal" vertically-centered>
  <p>This modal is vertically centered.</p>
</modal-component>
`;
VerticallyCentered.storyName = 'Vertically centered modal';
VerticallyCentered.parameters = {
  docs: { description: { story: 'A vertically centered modal.' } },
};

const DOCS_SCROLLABLE_BODY = `
<modal-component variant="info" btn-text="Scrollable body" scrollable-body modal-size="lg">
  ${Array.from({ length: 20 }, (_, i) => `<p>Scrollable content line ${i + 1}</p>`).join('')}
</modal-component>
`;

export const ScrollableBody = () => DOCS_SCROLLABLE_BODY;
ScrollableBody.storyName = 'Scrollable body modal';
ScrollableBody.parameters = {
  docs: {
    source: { code: DOCS_SCROLLABLE_BODY, language: 'html' },
    description: { story: 'Modal with a scrollable body (modal-dialog-scrollable).' },
  },
};

const DOCS_LONG_SCROLL = `
<modal-component variant="secondary" btn-text="Long content (window scroll)" scroll-long-content>
  ${Array.from({ length: 30 }, (_, i) => `<p>Long content ${i + 1}</p>`).join('')}
</modal-component>
`;

export const LongContentScroll = () => DOCS_LONG_SCROLL;
LongContentScroll.storyName = 'Long content (window scroll)';
LongContentScroll.parameters = {
  docs: {
    source: { code: DOCS_LONG_SCROLL, language: 'html' },
    description: { story: 'Modal with long content that scrolls the window.' },
  },
};

export const OutlinedTrigger = () => `
<modal-component variant="primary" outlined btn-text="Outlined trigger">
  <p>Modal opened by an outlined button.</p>
</modal-component>
`;
OutlinedTrigger.storyName = 'Outlined trigger button';
OutlinedTrigger.parameters = {
  docs: { description: { story: 'A modal triggered by an outlined button.' } },
};

export const LinkTrigger = () => `
<modal-component link btn-text="Open as link">
  <p>Trigger is styled like a link.</p>
</modal-component>
`;
LinkTrigger.storyName = 'Link trigger button';
LinkTrigger.parameters = {
  docs: { description: { story: 'A modal triggered by a link-styled button.' } },
};

export const CustomFooter = () => `
<modal-component variant="primary" btn-text="Custom footer">
  <p>Add any controls to the footer slot.</p>
  <div slot="footer" style="display:flex; gap:8px;">
    <button-component variant="secondary">Secondary</button-component>
    <button-component variant="primary">Primary Action</button-component>
  </div>
</modal-component>
`;
CustomFooter.storyName = 'Custom footer content';
CustomFooter.parameters = {
  docs: { description: { story: 'Custom footer content using the footer slot.' } },
};

export const Playground = Template.bind({});
Playground.args = {
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

  modalId: '',
  modalTitle: 'Modal title',
  modalSize: undefined,
  modalFullScreen: undefined,
  scrollableBody: false,
  scrollLongContent: false,
  verticallyCentered: false,
  cancelCloseBtn: 'Close',

  bodyHtml: '',
  footerHtml: '',
};
Playground.parameters = {
  docs: {
    description: { story: 'Interactive playground. Modal includes ARIA labelling/description ids and trigger aria-haspopup/controls/expanded.' },
  },
};

/* ======================================================
 * Accessibility matrix
 *  - Renders common variants and prints computed role + aria-* + ids.
 *  - Also reports whether aria-labelledby / aria-describedby resolve.
 * NOTE: "default/inline/horizontal, error/validation, disabled" are not modal props;
 *       we still include rows to match the requested matrix format:
 *       - default (base)
 *       - "inline" and "horizontal" rows are layout wrappers only (storybook-only)
 *       - "error/validation" is represented by an error-styled footer + body message
 *       - disabled is trigger disabled
 * ====================================================== */

function pickAttrs(el, names) {
  const out = {};
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

function splitIds(v) {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function resolveIdsWithin(host, ids) {
  const res = {};
  for (const id of ids) {
    const safe = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const node = host.querySelector(`[id="${safe}"]`);
    res[id] = !!node;
  }
  return res;
}

function snapshotA11y(host) {
  const trigger = host.querySelector('button[type="button"]');
  const modal = host.querySelector('.modal');
  const dialog = host.querySelector('.modal-dialog');
  const title = modal ? host.querySelector(`#${modal.getAttribute('aria-labelledby') || ''}`) : null;
  const desc = modal ? host.querySelector(`#${modal.getAttribute('aria-describedby') || ''}`) : null;

  const labelledByIds = modal ? splitIds(modal.getAttribute('aria-labelledby')) : [];
  const describedByIds = modal ? splitIds(modal.getAttribute('aria-describedby')) : [];

  return {
    trigger: trigger
      ? {
          tag: trigger.tagName.toLowerCase(),
          text: (trigger.textContent || '').trim(),
          ...pickAttrs(trigger, ['aria-label', 'aria-haspopup', 'aria-controls', 'aria-expanded', 'aria-disabled', 'disabled']),
        }
      : null,
    modal: modal
      ? {
          tag: modal.tagName.toLowerCase(),
          id: modal.getAttribute('id') || '',
          ...pickAttrs(modal, ['role', 'aria-modal', 'aria-labelledby', 'aria-describedby', 'aria-hidden', 'tabindex']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledByIds),
            'aria-describedby': resolveIdsWithin(host, describedByIds),
          },
          hasTitleEl: !!title,
          hasDescEl: !!desc,
        }
      : null,
    dialog: dialog
      ? {
          tag: dialog.tagName.toLowerCase(),
          id: dialog.getAttribute('id') || '',
          ...pickAttrs(dialog, ['role', 'tabindex', 'class']),
        }
      : null,
  };
}

function buildMatrixRow({ title, args, wrapStyle = '', idSuffix }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const stage = document.createElement('div');
  stage.style.maxWidth = '720px';
  if (wrapStyle) stage.setAttribute('style', wrapStyle);

  // Build node for this row (string -> node)
  const container = document.createElement('div');
  container.innerHTML = Template({
    ...args,
    modalId: args.modalId || `modal-a11y-${idSuffix}`,
  });

  stage.appendChild(container);

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role/id…';

  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  const update = () => {
    const host = container.querySelector('modal-component');
    if (!host) return;
    pre.textContent = JSON.stringify(snapshotA11y(host), null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}

const DOCS_MATRIX = `<!-- Accessibility matrix is rendered via DOM (see Canvas). -->`;

export const AccessibilityMatrix = () => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Prints computed <code>role</code> + <code>aria-*</code> + IDs and whether <code>aria-labelledby</code> / <code>aria-describedby</code> resolve.
      (Modal opens on interaction; this matrix validates static wiring + required attributes.)
    </div>
  `;
  root.appendChild(intro);

  const rows = [
    {
      title: 'Default',
      args: {
        btnText: 'Open modal',
        variant: 'primary',
        modalTitle: 'Default Dialog',
        bodyHtml: '<p>Default modal content.</p>',
        footerHtml: '',
        disabled: false,
      },
      wrapStyle: '',
    },
    {
      title: 'Inline (layout wrapper only)',
      args: {
        btnText: 'Inline trigger',
        variant: 'secondary',
        modalTitle: 'Inline Wrapper',
        bodyHtml: '<p>Inline wrapper demonstration (storybook-only).</p>',
        footerHtml: '',
      },
      wrapStyle: 'display:flex; align-items:center; gap:12px;',
    },
    {
      title: 'Horizontal (layout wrapper only)',
      args: {
        btnText: 'Horizontal trigger',
        variant: 'secondary',
        modalTitle: 'Horizontal Wrapper',
        bodyHtml: '<p>Horizontal wrapper demonstration (storybook-only).</p>',
        footerHtml: '',
      },
      wrapStyle: 'display:flex; justify-content:space-between; align-items:center;',
    },
    {
      title: 'Error/Validation (content only)',
      args: {
        btnText: 'Open error dialog',
        variant: 'danger',
        modalTitle: 'Validation Error',
        bodyHtml:
          '<p><strong>There was a problem.</strong></p><p>Please correct the highlighted fields and try again.</p>',
        footerHtml:
          '<button class="btn btn-danger" type="button">Fix issues</button>',
      },
      wrapStyle: '',
    },
    {
      title: 'Disabled trigger',
      args: {
        btnText: 'Disabled',
        variant: 'secondary',
        modalTitle: 'Disabled',
        disabled: true,
        bodyHtml: '<p>This should not open because trigger is disabled.</p>',
        footerHtml: '',
      },
      wrapStyle: '',
    },
  ];

  rows.forEach((r, idx) => {
    root.appendChild(
      buildMatrixRow({
        ...r,
        idSuffix: String(idx + 1),
      }),
    );
  });

  return root;
};
AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of key states. Prints computed role/aria/ids and whether ARIA references resolve to real elements.',
    },
    source: { code: DOCS_MATRIX, language: 'html' },
    story: { height: '1200px' },
  },
  controls: { disable: true },
};
