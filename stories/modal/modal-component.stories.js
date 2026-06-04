// File: src/stories/modal-component.stories.js

import DocsPage from './modal-component.docs.mdx';
import {
  DOCS_FULLSCREEN,
  DOCS_LONG_SCROLL,
  DOCS_MATRIX,
  DOCS_SCROLLABLE_BODY,
  DOCS_SIZES,
  buildDocsHtml,
  buildMatrixRow,
  docsPortalDecorator,
  template,
} from './modal-component.story-helpers.js';

const basicArgs = {
  ariaLabel: '',
  block: false,
  btnText: 'Open modal',
  classNames: '',
  disabled: false,
  link: false,
  outlined: false,
  ripple: false,
  size: '',
  shape: '',
  titleAttr: '',
  variant: 'primary',

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

const playgroundArgs = {
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

export default {
  title: 'Components/Modal',
  tags: ['autodocs'],
  decorators: [docsPortalDecorator],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
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
  },
};

export const Basic = {
  name: 'Basic modal',
  render: args => template(args),
  args: {
    ...basicArgs,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A basic modal wired to Controls. Component supplies required ARIA attributes (role="dialog", aria-modal="true", aria-labelledby + aria-describedby that resolve).',
      },
    },
  },
};

export const Sizes = {
  name: 'Modal sizes',
  render: () => DOCS_SIZES,
  parameters: {
    docs: {
      source: { code: DOCS_SIZES, language: 'html' },
      description: { story: 'Demonstrates modal sizes: sm, lg, xl.' },
    },
  },
};

export const FullscreenVariants = {
  name: 'Fullscreen variants',
  render: () => DOCS_FULLSCREEN,
  parameters: {
    docs: {
      source: { code: DOCS_FULLSCREEN, language: 'html' },
      description: { story: 'Demonstrates fullscreen variants.' },
    },
  },
};

export const VerticallyCentered = {
  name: 'Vertically centered modal',
  render: () => `
<modal-component variant="success" btn-text="Centered modal" vertically-centered>
  <p>This modal is vertically centered.</p>
</modal-component>
`,
  parameters: {
    docs: {
      description: { story: 'A vertically centered modal.' },
    },
  },
};

export const ScrollableBody = {
  name: 'Scrollable body modal',
  render: () => DOCS_SCROLLABLE_BODY,
  parameters: {
    docs: {
      source: { code: DOCS_SCROLLABLE_BODY, language: 'html' },
      description: { story: 'Modal with a scrollable body (modal-dialog-scrollable).' },
    },
  },
};

export const LongContentScroll = {
  name: 'Long content (window scroll)',
  render: () => DOCS_LONG_SCROLL,
  parameters: {
    docs: {
      source: { code: DOCS_LONG_SCROLL, language: 'html' },
      description: { story: 'Modal with long content that scrolls the window.' },
    },
  },
};

export const OutlinedTrigger = {
  name: 'Outlined trigger button',
  render: () => `
<modal-component variant="primary" outlined btn-text="Outlined trigger">
  <p>Modal opened by an outlined button.</p>
</modal-component>
`,
  parameters: {
    docs: {
      description: { story: 'A modal triggered by an outlined button.' },
    },
  },
};

export const LinkTrigger = {
  name: 'Link trigger button',
  render: () => `
<modal-component link btn-text="Open as link">
  <p>Trigger is styled like a link.</p>
</modal-component>
`,
  parameters: {
    docs: {
      description: { story: 'A modal triggered by a link-styled button.' },
    },
  },
};

export const CustomFooter = {
  name: 'Custom footer content',
  render: () => `
<modal-component variant="primary" btn-text="Custom footer">
  <p>Add any controls to the footer slot.</p>
  <div slot="footer" style="display:flex; gap:8px;">
    <button-component variant="secondary">Secondary</button-component>
    <button-component variant="primary">Primary Action</button-component>
  </div>
</modal-component>
`,
  parameters: {
    docs: {
      description: { story: 'Custom footer content using the footer slot.' },
    },
  },
};

export const Playground = {
  name: 'Playground',
  render: args => template(args),
  args: {
    ...playgroundArgs,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground. Modal includes ARIA labelling/description ids and trigger aria-haspopup/controls/expanded.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
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
  },
  parameters: {
    docs: {
      description: {
        story:
          'Matrix of key states. Prints computed role/aria/ids and whether ARIA references resolve to real elements.',
      },
      source: { code: DOCS_MATRIX, language: 'html' },
      story: { height: '1200px' },
    },
    controls: { disable: true },
  },
};
