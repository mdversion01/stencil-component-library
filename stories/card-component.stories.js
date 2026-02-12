// stories/card-component.stories.js
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Card',
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component: ['Card component for displaying content in a card layout.', ''].join('\n'),
      },
      // Show the rendered HTML of the element in the Code block
      source: { type: 'dynamic', language: 'html' },
    },
  },

  argTypes: {
    /* -----------------------------
   Accessibility
  ------------------------------ */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'ARIA label for the card section.',
      table: { category: 'Accessibility' },
    },

    /* -----------------------------
   State
  ------------------------------ */
    actions: {
      control: 'boolean',
      description: 'If true, displays the actions slot.',
      table: { category: 'State', defaultValue: { summary: false } },
    },
    img: {
      control: 'boolean',
      description: 'If true, displays an image in the card.',
      table: { category: 'State', defaultValue: { summary: false } },
    },
    noFooter: {
      control: 'boolean',
      name: 'no-footer',
      description: 'If true, hides the footer slot.',
      table: { category: 'State', defaultValue: { summary: false } },
    },
    noHeader: {
      control: 'boolean',
      name: 'no-header',
      description: 'If true, hides the header slot.',
      table: { category: 'State', defaultValue: { summary: false } },
    },

    /* -----------------------------
   Layout & Styling
  ------------------------------ */
    cardMaxWidth: {
      control: 'text',
      name: 'card-max-width',
      description: 'Maximum width of the card in rem units.',
      table: { category: 'Layout & Styling' },
    },
    classNames: {
      control: 'text',
      name: 'class-names',
      description: 'Additional CSS class names to apply to the card component.',
      table: { category: 'Layout & Styling' },
    },
    elevation: {
      control: 'text',
      description: 'Applies a shadow elevation to the card component (0-24) with CSS.',
      table: { category: 'Layout & Styling' },
    },
    inlineStyles: {
      control: 'text',
      name: 'inline-styles',
      description: 'Inline styles to apply to the card component.',
      table: { category: 'Layout & Styling' },
    },
    tab: {
      control: 'text',
      description: 'Optional tab index for the card component.',
      table: { category: 'Layout & Styling' },
    },

    /* -----------------------------
   Image
  ------------------------------ */
    imgSrc: {
      control: 'text',
      name: 'img-src',
      description: 'Source URL of the card image.',
      table: { category: 'Image' },
    },
    imgHeight: {
      control: 'text',
      name: 'img-height',
      description: 'Height of the card image.',
      table: { category: 'Image' },
    },
    altText: {
      control: 'text',
      name: 'alt-text',
      description: 'Alt text for the card image.',
      table: { category: 'Image' },
    },

    /* -----------------------------
   Slots
  ------------------------------ */
    slotHeader: {
      control: 'text',
      description: 'Content for the header slot.',
      name: 'slot-header',
      table: { category: 'Slots' },
    },
    slotTitle: {
      control: 'text',
      description: 'Content for the title slot.',
      name: 'slot-title',
      table: { category: 'Slots' },
    },
    slotText: {
      control: 'text',
      description: 'Content for the text slot.',
      name: 'slot-text',
      table: { category: 'Slots' },
    },
    slotFooter: {
      control: 'text',
      description: 'Content for the footer slot.',
      name: 'slot-footer',
      table: { category: 'Slots' },
    },
    slotActions: {
      control: 'text',
      description: 'Content for the actions slot.',
      name: 'slot-actions',
      table: { category: 'Slots' },
    },
  },

  // Minimal defaults: undefined for optional strings so *nothing* appears unless a story opts-in
  args: {
    actions: false,
    altText: undefined,
    ariaLabel: undefined,
    cardMaxWidth: undefined,
    classNames: undefined,
    elevation: undefined,
    img: false,
    imgHeight: undefined,
    imgSrc: undefined,
    inlineStyles: undefined,
    noFooter: false,
    noHeader: false,
    tab: undefined,

    // default slot content
    slotActions: '<button class="btn btn-primary btn-sm" type="button">Action</button>',
    slotFooter: 'Card footer',
    slotHeader: 'Card header',
    slotText: 'This is some quick example text to build on the card title and make up the bulk of the card content.',
    slotTitle: 'Card title',
  },
};

// Helper: only set an attribute when the value is meaningful; otherwise remove it
const setAttr = (el, name, value) => {
  const isEmpty = value === false || value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

  if (isEmpty) el.removeAttribute(name);
  else if (value === true) el.setAttribute(name, '');
  else el.setAttribute(name, String(value));
};

const Template = args => {
  const el = document.createElement('card-component');

  // ----- PROPERTIES (runtime behavior) -----
  el.actions = !!args.actions;
  el.img = !!args.img;
  el.noFooter = !!args.noFooter;
  el.noHeader = !!args.noHeader;

  // Only set non-empty/meaningful props
  if (args.ariaLabel) el.ariaLabel = args.ariaLabel;
  if (args.classNames) el.classNames = args.classNames;
  if (args.elevation) el.elevation = args.elevation;
  if (args.inlineStyles) el.inlineStyles = args.inlineStyles;
  if (args.cardMaxWidth) el.cardMaxWidth = args.cardMaxWidth;
  if (args.tab !== undefined && args.tab !== null && String(args.tab).trim() !== '') el.tab = String(args.tab);

  // Image props only when img is enabled
  if (args.img) {
    if (args.altText) el.altText = args.altText;
    if (args.imgSrc) el.imgSrc = args.imgSrc;
    if (args.imgHeight) el.imgHeight = args.imgHeight;
  }

  // ----- ATTRIBUTES (so Docs code shows only what a story actually *uses*) -----
  setAttr(el, 'actions', !!args.actions);
  setAttr(el, 'img', !!args.img);
  setAttr(el, 'no-footer', !!args.noFooter);
  setAttr(el, 'no-header', !!args.noHeader);

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'class-names', args.classNames);
  setAttr(el, 'elevation', args.elevation);
  setAttr(el, 'inline-styles', args.inlineStyles);
  setAttr(el, 'card-max-width', args.cardMaxWidth);
  setAttr(el, 'tab', args.tab);

  // Image-related only if img is true
  if (args.img) {
    setAttr(el, 'alt-text', args.altText);
    setAttr(el, 'img-src', args.imgSrc);
    setAttr(el, 'img-height', args.imgHeight);
  } else {
    el.removeAttribute('alt-text');
    el.removeAttribute('img-src');
    el.removeAttribute('img-height');
  }

  // ----- Slots -----
  el.innerHTML = `
    ${args.noHeader ? '' : `<div slot="header">${args.slotHeader}</div>`}
    <span slot="title">${args.slotTitle}</span>
    <span slot="text">${args.slotText}</span>
    ${args.actions ? `<span slot="actions">${args.slotActions}</span>` : ''}
    ${args.noFooter ? '' : `<div slot="footer"><p>${args.slotFooter}</p></div>`}
  `;

  // Event for SB Actions panel
  el.addEventListener('customClick', action('customClick'));

  return el;
};

// ----- Stories -----

export const Basic = Template.bind({});
Basic.args = {};
Basic.parameters = {
  docs: {
    description: {
      story: 'A basic card with title and text slots. No header/footer or image.',
    },
  },
};

export const WithImage = Template.bind({});
WithImage.args = {
  img: true,
  imgSrc: 'https://picsum.photos/800/450',
  imgHeight: '11.25rem',
  altText: 'Card image',
  slotHeader: 'Card header',
  slotTitle: 'Card with image',
};
WithImage.parameters = {
  docs: {
    description: {
      story: 'Adds a media section above the content using the `img` and `img-src` props.',
    },
  },
};

export const WithActions = Template.bind({});
WithActions.args = {
  actions: true,
  slotActions: `
    <button class="btn btn-primary btn-sm" type="button">Save</button>
    <button class="btn btn-outline-secondary btn-sm" type="button" style="margin-left:.5rem;">Cancel</button>
  `,
};
WithActions.parameters = {
  docs: {
    description: {
      story: 'Includes an actions slot at the bottom of the card for action buttons.',
    },
  },
};

export const NoFooter = Template.bind({});
NoFooter.args = {
  noFooter: true,
  slotTitle: 'No footer card',
  slotText: 'Only a header, title, and body text are shown.',
  slotHeader: 'Card Header',
};
NoFooter.parameters = {
  docs: {
    description: {
      story: 'A more compact card without the footer sections.',
    },
  },
};

export const NoHeader = Template.bind({});
NoHeader.args = {
  noHeader: true,
  slotTitle: 'No header card',
  slotText: 'Only a title, body text, and footer are shown.',
  slotFooter: 'Card Footer',
};
NoHeader.parameters = {
  docs: {
    description: {
      story: 'A more compact card without the header sections.',
    },
  },
};

export const NoHeaderNoFooter = Template.bind({});
NoHeaderNoFooter.args = {
  noHeader: true,
  noFooter: true,
  slotTitle: 'Compact card',
  slotText: 'Only a title and body text are shown.',
};
NoHeaderNoFooter.parameters = {
  docs: {
    description: {
      story: 'A more compact card without header and footer sections.',
    },
  },
};

export const Elevated = Template.bind({});
Elevated.args = {
  elevation: '5',
  slotTitle: 'Elevated (elevated-5)',
  slotText: 'Uses the `elevated-5` class your CSS provides.',
};
Elevated.parameters = {
  docs: {
    description: {
      story: 'Card with shadow elevation applied using the `elevation` prop with 0-24.',
    },
  },
};
