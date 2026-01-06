// stories/card-component.stories.js
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Card',
  tags: ['autodocs'],
  argTypes: {
    altText: { control: 'text', name: 'alt-text', description: 'Alt text for the card image.' },
    ariaLabel: { control: 'text', name: 'aria-label', description: 'ARIA label for the card section.' },
    actions: { control: 'boolean', description: 'If true, displays the actions slot.' },
    cardMaxWidth: { control: 'text', name: 'card-max-width', description: 'Maximum width of the card in rem units.' },
    classNames: { control: 'text', name: 'class-names', description: 'Additional CSS class names to apply to the card component.' },
    elevation: { control: 'text', description: 'Applies a shadow elevation to the card component (0-24) with CSS.' },
    img: { control: 'boolean', description: 'If true, displays an image in the card.' },
    imgHeight: { control: 'text', name: 'img-height', description: 'Height of the card image.' },
    imgSrc: { control: 'text', name: 'img-src', description: 'Source URL of the card image.' },
    inlineStyles: { control: 'text', name: 'inline-styles', description: 'Inline styles to apply to the card component.' },
    noFooter: { control: 'boolean', name: 'no-footer', description: 'If true, hides the footer slot.' },
    noHeader: { control: 'boolean', name: 'no-header', description: 'If true, hides the header slot.' },
    tab: { control: 'text', description: 'Optional tab index for the card component.' },

    // Slot content (for convenience in SB)
    slotHeader: { control: 'text', table: { category: 'slots' }, description: 'Content for the header slot.' },
    slotTitle: { control: 'text', table: { category: 'slots' }, description: 'Content for the title slot.' },
    slotText: { control: 'text', table: { category: 'slots' }, description: 'Content for the text slot.' },
    slotFooter: { control: 'text', table: { category: 'slots' }, description: 'Content for the footer slot.' },
    slotActions: { control: 'text', table: { category: 'slots' }, description: 'Content for the actions slot.' },
  },
  args: {
    actions: false,
    altText: 'Card image',
    ariaLabel: 'Card section',
    cardMaxWidth: '20',
    classNames: '',
    elevation: '',
    img: false,
    imgHeight: '11.25rem',
    imgSrc: 'https://picsum.photos/640/360',
    inlineStyles: '',
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
  parameters: {
    docs: {
      description: {
        component: ['Card component for displaying content in a card layout.', ''].join('\n'),
      },
    },
  },
};

const Template = args => {
  const el = document.createElement('card-component');

  // Map Stencil props (camelCase) from args
  el.actions = args.actions;
  el.img = args.img;
  el.noFooter = args.noFooter;
  el.noHeader = args.noHeader;

  el.ariaLabel = args.ariaLabel;
  el.altText = args.altText;
  el.classNames = args.classNames;
  el.elevation = args.elevation;
  el.inlineStyles = args.inlineStyles;
  el.imgSrc = args.imgSrc;
  el.imgHeight = args.imgHeight;
  el.cardMaxWidth = args.cardMaxWidth;
  if (args.tab !== undefined && args.tab !== null && args.tab !== '') {
    el.tab = String(args.tab);
  }

  // Slots
  el.innerHTML = `
    ${args.img ? '' : ''}
    ${args.noHeader ? '' : `<div slot="header">${args.slotHeader}</div>`}
    <span slot="title">${args.slotTitle}</span>
    <span slot="text">${args.slotText}</span>
    ${args.actions ? `<span slot="actions">${args.slotActions}</span>` : ''}
    ${args.noFooter ? '' : `<div slot="footer"><p>${args.slotFooter}</p></div>`}
  `;

  // Wire the Stencil custom event to SB actions
  el.addEventListener('customClick', action('customClick'));

  return el;
};

// Stories
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

export const Playground = Template.bind({});
Playground.args = {};
