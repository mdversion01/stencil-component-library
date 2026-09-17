// File: src/stories/modal-component.stories.js

// import DocsPage from './modal-component.docs.mdx';
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
  title: 'Bootstrap or Plumage/Modal',

  decorators: [docsPortalDecorator],

  parameters: {
    layout: 'padded',
     themeFamily: 'allthemes',
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_src, ctx) =>
          buildDocsHtml(ctx.args, ctx?.name),
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
      table: {
        category: 'Accessibility',
      },
      description:
        'ARIA label for the modal trigger button.',
    },

    titleAttr: {
      control: 'text',
      name: 'title-attr',
      table: {
        category: 'Trigger Button',
      },
      description:
        'Title attribute for the modal trigger button.',
    },

    btnText: {
      control: 'text',
      name: 'btn-text',
      table: {
        category: 'Trigger Button',
      },
      description:
        'Text content of the modal trigger button.',
    },

    variant: {
      control: {
        type: 'select',
      },
      options: [
        'default',
        'primary',
        'secondary',
        'danger',
      ],
      name: 'variant',
      table: {
        category: 'Trigger Button',
      },
      description:
        'Variant style of the modal trigger button.',
    },

    size: {
      control: {
        type: 'select',
      },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: {
        category: 'Trigger Button',
      },
      description:
        'Size of the modal trigger button.',
    },

    shape: {
      control: {
        type: 'select',
      },
      options: [
        '',
        'square',
        'pill',
        'circle',
      ],
      name: 'shape',
      table: {
        category: 'Trigger Button',
      },
      description:
        'Shape of the modal trigger button.',
    },

    outlined: {
      control: 'boolean',
      name: 'outlined',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Trigger Button',
      },
      description:
        'Whether the trigger button has an outlined style.',
    },

    block: {
      control: 'boolean',
      name: 'block',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Trigger Button',
      },
      description:
        'Whether the trigger button is block-level.',
    },

    link: {
      control: 'boolean',
      name: 'link',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Trigger Button',
      },
      description:
        'Whether the trigger button is styled as a link.',
    },

    ripple: {
      control: 'boolean',
      name: 'ripple',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Trigger Button',
      },
      description:
        'Whether the trigger button has a ripple effect.',
    },

    classNames: {
      control: 'text',
      name: 'class-names',
      table: {
        category: 'Trigger Button',
      },
      description:
        'Additional CSS classes for the trigger button.',
    },

    disabled: {
      control: 'boolean',
      name: 'disabled',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'State',
      },
      description:
        'Whether the trigger button is disabled.',
    },

    modalId: {
      control: 'text',
      name: 'modal-id',
      table: {
        category: 'Modal',
      },
      description:
        'Optional id for the modal. If omitted, the component generates a stable id per instance. Useful when you need to reference the modal from outside.',
    },

    modalTitle: {
      control: 'text',
      name: 'modal-title',
      table: {
        category: 'Modal',
      },
      description:
        'Title text of the modal.',
    },

    modalSize: {
      control: {
        type: 'select',
      },
      options: [
        undefined,
        'sm',
        'lg',
        'xl',
      ],
      name: 'modal-size',
      table: {
        category: 'Modal',
      },
      description:
        'Size of the modal.',
    },

    modalFullScreen: {
      control: {
        type: 'select',
      },
      options: [
        undefined,
        'fullscreen',
        'fullscreen-sm-down',
        'fullscreen-md-down',
        'fullscreen-lg-down',
        'fullscreen-xl-down',
        'fullscreen-xxl-down',
      ],
      name: 'modal-full-screen',
      table: {
        category: 'Modal',
      },
      description:
        'Fullscreen behavior of the modal.',
    },

    scrollableBody: {
      control: 'boolean',
      name: 'scrollable-body',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Modal',
      },
      description:
        'Whether the modal body is scrollable (Bootstrap modal-dialog-scrollable).',
    },

    scrollLongContent: {
      control: 'boolean',
      name: 'scroll-long-content',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Modal',
      },
      description:
        'Whether the modal has long content that requires window scrolling.',
    },

    verticallyCentered: {
      control: 'boolean',
      name: 'vertically-centered',
      table: {
        defaultValue: {
          summary: false,
        },
        category: 'Modal',
      },
      description:
        'Whether the modal is vertically centered.',
    },

    cancelCloseBtn: {
      control: 'text',
      name: 'cancel-close-btn',
      table: {
        category: 'Modal',
      },
      description:
        'Text for the modal cancel/close button.',
    },

    bodyHtml: {
      control: 'text',
      name: 'body-html',
      table: {
        category: 'Slots',
      },
      description:
        'HTML content for the modal body.',
    },

    footerHtml: {
      control: 'text',
      name: 'footer-html',
      table: {
        category: 'Slots',
      },
      description:
        'HTML content for the modal footer.',
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

  render: args =>
    template(args),

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

  render: () =>
    DOCS_SIZES,

  parameters: {
    docs: {
      source: {
        code: DOCS_SIZES,
        language: 'html',
      },

      description: {
        story:
          'Demonstrates modal sizes: sm, lg, xl.',
      },
    },
  },
};

export const FullscreenVariants = {
  name: 'Fullscreen variants',

  render: () =>
    DOCS_FULLSCREEN,

  parameters: {
    docs: {
      source: {
        code: DOCS_FULLSCREEN,
        language: 'html',
      },

      description: {
        story: `
Demonstrates all supported fullscreen modal variants.

| Class | Availability |
| --- | --- |
| \`.modal-fullscreen\` | Always |
| \`.modal-fullscreen-sm-down\` | \`576px\` |
| \`.modal-fullscreen-md-down\` | \`768px\` |
| \`.modal-fullscreen-lg-down\` | \`992px\` |
| \`.modal-fullscreen-xl-down\` | \`1200px\` |
| \`.modal-fullscreen-xxl-down\` | \`1400px\` |

The \`modal-full-screen\` property maps to the corresponding fullscreen modal class.
        `.trim(),
      },
    },
  },
};

export const VerticallyCentered = {
  name: 'Vertically centered modal',

  render: () => `
<modal-component
  variant="success"
  btn-text="Centered modal"
  vertically-centered
>
  <p>This modal is vertically centered.</p>
</modal-component>
`,

  parameters: {
    docs: {
      description: {
        story:
          'A vertically centered modal.',
      },
    },
  },
};

export const ScrollableBody = {
  name: 'Scrollable body modal',

  render: () =>
    DOCS_SCROLLABLE_BODY,

  parameters: {
    docs: {
      source: {
        code: DOCS_SCROLLABLE_BODY,
        language: 'html',
      },

      description: {
        story:
          'Modal with a scrollable body (modal-dialog-scrollable).',
      },
    },
  },
};

export const LongContentScroll = {
  name: 'Long content (window scroll)',

  render: () =>
    DOCS_LONG_SCROLL,

  parameters: {
    docs: {
      source: {
        code: DOCS_LONG_SCROLL,
        language: 'html',
      },

      description: {
        story:
          'Modal with long content that scrolls the window.',
      },
    },
  },
};

export const LinkTrigger = {
  name: 'Link trigger button',

  render: () => `
<modal-component
  link
  btn-text="Open as link"
>
  <p>Trigger is styled like a link.</p>
</modal-component>
`,

  parameters: {
    docs: {
      description: {
        story:
          'A modal triggered by a link-styled button.',
      },
    },
  },
};

export const CustomFooter = {
  name: 'Custom footer content',

  render: () => `
<modal-component
  variant="primary"
  btn-text="Custom footer"
>
  <p>Add any controls to the footer slot.</p>

  <div
    slot="footer"
    style="display:flex; gap:8px;"
  >
    <button-component variant="secondary">
      Secondary
    </button-component>

    <button-component variant="primary">
      Primary Action
    </button-component>
  </div>
</modal-component>
`,

  parameters: {
    docs: {
      description: {
        story:
          'Custom footer content using the footer slot.',
      },
    },
  },
};

export const Playground = {
  name: 'Playground',

  render: args =>
    template(args),

  args: {
    ...playgroundArgs,
  },

  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground. Modal includes ARIA labelling/description ids and trigger aria-haspopup/controls/expanded.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: () => {
    const root =
      document.createElement('div');

    root.className =
      'modal-accessibility-matrix';

    const intro =
      document.createElement('div');

    const introTitle =
      document.createElement('div');

    introTitle.className =
      'modal-accessibility-matrix__intro-title';

    introTitle.textContent =
      'Accessibility matrix';

    const introDescription =
      document.createElement('div');

    introDescription.className =
      'modal-accessibility-matrix__intro-description';

    introDescription.innerHTML =
      'Inspects the rendered trigger and modal dialog and prints computed ' +
      '<code>role</code>, <code>aria-*</code>, IDs, and whether ID-based ' +
      'ARIA relationships resolve. The modal may be portaled to ' +
      '<code>document.body</code>, so the audit resolves dialog references document-wide.';

    intro.appendChild(
      introTitle,
    );

    intro.appendChild(
      introDescription,
    );

    root.appendChild(
      intro,
    );

    const rows = [
      {
        title: 'Default modal',

        args: {
          btnText:
            'Open modal',
          variant:
            'primary',
          modalTitle:
            'Default Dialog',
          bodyHtml:
            '<p>Default modal content.</p>',
          footerHtml:
            '',
          disabled:
            false,
        },
      },

      {
        title: 'Explicit trigger accessible name',

        args: {
          btnText:
            'Open details',
          ariaLabel:
            'Open account details dialog',
          variant:
            'secondary',
          modalTitle:
            'Account details',
          bodyHtml:
            '<p>Account details content.</p>',
          footerHtml:
            '',
          disabled:
            false,
        },
      },

      {
        title: 'Explicit modal ID',

        args: {
          btnText:
            'Open custom ID modal',
          variant:
            'secondary',
          modalId:
            'modal-a11y-custom',
          modalTitle:
            'Custom ID Dialog',
          bodyHtml:
            '<p>This dialog uses an explicit modal id.</p>',
          footerHtml:
            '',
          disabled:
            false,
        },
      },

      {
        title: 'Disabled trigger',

        args: {
          btnText:
            'Disabled modal trigger',
          variant:
            'secondary',
          modalTitle:
            'Disabled Dialog',
          bodyHtml:
            '<p>This modal should not open because its trigger is disabled.</p>',
          footerHtml:
            '',
          disabled:
            true,
        },
      },
    ];

    rows.forEach(
      (row, index) => {
        root.appendChild(
          buildMatrixRow({
            ...row,
            idSuffix:
              String(index + 1),
          }),
        );
      },
    );

    return root;
  },

  parameters: {
    docs: {
      description: {
        story:
          'Accessibility-focused matrix covering a default modal, an explicitly named trigger, explicit modal ID relationships, and a disabled trigger. Each row prints computed trigger/dialog ARIA and whether referenced IDs resolve.',
      },

      source: {
        code: DOCS_MATRIX,
        language: 'html',
      },

      story: {
        height: '1500px',
      },
    },

    controls: {
      disable: true,
    },
  },
};
