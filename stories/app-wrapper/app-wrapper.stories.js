// File: src/stories/app-wrapper/app-wrapper.stories.js

import DocsPage from './app-wrapper.docs.mdx';
import {
  buildDocsHtml,
  buildLayoutExamples,
  buildNestedWrappers,
  buildPageShell,
  buildPlayground,
  buildUtilityClasses,
} from './app-wrapper.story-helpers.js';

export default {
  title: 'Layout/App Wrapper',
  tags: ['autodocs'],
  render: (args) => buildPlayground(args),
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          '`<app-wrapper>` is a super-light container that simply renders a div with the classes you pass in and a default `app-wrapper` class. It renders in the light DOM (`shadow: false`) so your global styles apply to its children.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'Playground' }),
      },
    },
  },
  argTypes: {
    classNames: {
      control: 'text',
      description: 'Space-separated utility classes applied to the outer wrapper. Examples: `p-4 bg-light`, `container mx-auto`, `d-flex gap-3`.',
      table: { category: 'Styling' },
      name: 'class-names',
    },
    contentBody: {
      control: 'text',
      table: { category: 'Storybook Demo' },
      name: 'content-body',
      description: 'Demo content body text.',
    },
    contentTitle: {
      control: 'text',
      table: { category: 'Storybook Demo' },
      name: 'content-title',
      description: 'Demo content title.',
    },
    paddedCard: {
      control: 'boolean',
      description: 'Adds inner demo card padding/border.',
      table: { category: 'Storybook Demo' },
      name: 'padded-card',
    },
  },
};

export const Playground = {
  args: {
    classNames: 'p-4 bg-light',
    contentTitle: 'App Wrapper Playground',
    contentBody:
      'Pass any utility classes to control spacing, backgrounds, layout, etc. Everything inside is rendered in light DOM so your global CSS works.',
    paddedCard: true,
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'Playground' }),
      },
    },
  },
};

export const UtilityClasses = {
  render: () => buildUtilityClasses(),
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'UtilityClasses' }),
      },
    },
  },
};

export const NestedWrappers = {
  render: () => buildNestedWrappers(),
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'NestedWrappers' }),
      },
    },
  },
};

export const LayoutExamples = {
  render: () => buildLayoutExamples(),
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'LayoutExamples' }),
      },
    },
  },
};

export const PageShell = {
  render: () => buildPageShell(),
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'PageShell' }),
      },
    },
  },
};
