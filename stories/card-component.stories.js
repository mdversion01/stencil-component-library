// stories/card-component.stories.js
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Card',
  tags: ['autodocs'],
  argTypes: {
    // Boolean props
    actions: { control: 'boolean' },
    img: { control: 'boolean' },
    noFooter: { control: 'boolean' },
    noHeader: { control: 'boolean' },

    // Strings
    ariaLabel: { control: 'text', name: 'aria-label' },
    altText: { control: 'text', name: 'alt-text' },
    classNames: { control: 'text', name: 'class-names' },
    elevation: { control: 'text' },
    inlineStyles: { control: 'text', name: 'inline-styles' },
    imgSrc: { control: 'text', name: 'img-src' },
    imgHeight: { control: 'text', name: 'img-height' },
    cardMaxWidth: { control: 'text', name: 'card-max-width' },
    tab: { control: 'text' },

    // Slot content (for convenience in SB)
    slotHeader: { control: 'text', table: { category: 'slots' } },
    slotTitle: { control: 'text', table: { category: 'slots' } },
    slotText: { control: 'text', table: { category: 'slots' } },
    slotFooter: { control: 'text', table: { category: 'slots' } },
    slotActions: { control: 'text', table: { category: 'slots' } },
  },
  args: {
    actions: false,
    img: false,
    noFooter: false,
    noHeader: false,
    ariaLabel: 'Card section',
    altText: 'Card image',
    classNames: '',
    elevation: '',
    inlineStyles: '',
    imgSrc: 'https://picsum.photos/640/360',
    imgHeight: '11.25rem',
    cardMaxWidth: '20',
    tab: undefined,

    // default slot content
    slotHeader: 'Card header',
    slotTitle: 'Card title',
    slotText:
      'This is some quick example text to build on the card title and make up the bulk of the card content.',
    slotFooter: 'Card footer',
    slotActions: '<button class="btn btn-primary btn-sm" type="button">Action</button>',
  },
};

const Template = (args) => {
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
    ${args.noFooter ? '' : `<div slot="footer">${args.slotFooter}</div>`}
  `;

  // Wire the Stencil custom event to SB actions
  el.addEventListener('customClick', action('customClick'));

  return el;
};

// Stories
export const Basic = Template.bind({});
Basic.args = {};

export const WithImage = Template.bind({});
WithImage.args = {
  img: true,
  imgSrc: 'https://picsum.photos/800/450',
  slotHeader: 'Image header',
  slotTitle: 'Card with image',
};

export const WithActions = Template.bind({});
WithActions.args = {
  actions: true,
  slotActions: `
    <button class="btn btn-primary btn-sm" type="button">Save</button>
    <button class="btn btn-outline-secondary btn-sm" type="button" style="margin-left:.5rem;">Cancel</button>
  `,
};

export const NoHeaderNoFooter = Template.bind({});
NoHeaderNoFooter.args = {
  noHeader: true,
  noFooter: true,
  slotTitle: 'Compact card',
  slotText: 'Only a title and body text are shown.',
};

export const Elevated = Template.bind({});
Elevated.args = {
  elevation: '2',
  slotTitle: 'Elevated (elevated-2)',
  slotText: 'Uses the `elevated-2` class your CSS provides.',
};

export const Playground = Template.bind({});
Playground.args = {};
