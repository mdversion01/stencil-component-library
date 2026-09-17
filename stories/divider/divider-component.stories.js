// File: src/stories/divider-component/divider-component.stories.js

// import DocsPage from './divider-component.docs.mdx';
import {
  buildDocsHtml,
  buildDocsHtmlMany,
  buildDivider,
  makeParagraph,
  renderDividerMatrixRow,
} from './divider-component.story-helpers.js';

export default {
  title: 'Bootstrap or Plumage/Divider',

  parameters: {
    themeFamily: 'allthemes',
    docs: {
      description: {
        component: [
          'Divider component for separating content with optional text or styling.',
          '',
        ].join('\n'),
      },

      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  argTypes: {
    /* -----------------------------
     Appearance
    ------------------------------ */

    dashed: {
      control: 'boolean',
      description: 'Use a dashed line style',
      table: {
        category: 'Appearance',
        defaultValue: {
          summary: false,
        },
      },
    },

    plain: {
      control: 'boolean',
      description:
        'Removes default typography weight from text divider',
      table: {
        category: 'Appearance',
        defaultValue: {
          summary: false,
        },
      },
    },

    styles: {
      control: 'text',
      description:
        'Inline styles for inner text (e.g. "color:#666; font-weight:600")',
      table: {
        category: 'Appearance',
      },
    },

    /* -----------------------------
     Layout
    ------------------------------ */

    direction: {
      control: {
        type: 'select',
      },
      options: [
        'horizontal',
        'vertical',
      ],
      description: 'Divider direction',
      table: {
        category: 'Layout',
      },
    },

    orientation: {
      control: {
        type: 'select',
      },
      options: [
        'left',
        'center',
        'right',
      ],
      description:
        'Sets the position of the text within the divider',
      table: {
        category: 'Layout',
      },
    },

    removeOrientationMargin: {
      control: {
        type: 'select',
      },
      options: [
        'left',
        'right',
      ],
      description:
        'Removes default side margin on the text divider',
      name: 'remove-orientation-margin',
      table: {
        category: 'Layout',
      },
    },

    /* -----------------------------
     Accessibility
    ------------------------------ */

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description:
        'Accessible name for the divider when it includes visible text. If not provided, it is derived from the slotted text.',
      table: {
        category: 'Accessibility',
      },
    },

    /* -----------------------------
     Storybook Only / Internal
    ------------------------------ */

    slotText: {
      table: {
        category: 'Storybook Only',
        disable: true,
      },
      control: false,
      description:
        'Text content for the slot (used only in this Storybook preview).',
      name: 'slot-text',
    },

    sbId: {
      control: 'text',
      name: 'sb-id',
      description:
        'Storybook-only: set an id attribute on the rendered divider element (for debug output).',
      table: {
        category: 'Storybook Only',
      },
    },

    sbAriaDisabled: {
      control: 'boolean',
      name: 'sb-aria-disabled',
      description:
        'Storybook-only: set aria-disabled="true" on the divider element (audit/debug only; aria-disabled is a global ARIA state).',
      table: {
        category: 'Storybook Only',
        defaultValue: {
          summary: false,
        },
      },
    },
  },

  controls: {
    exclude: [
      'slotText',
      'sbId',
      'sbAriaDisabled',
    ],
  },

  args: {
    dashed: false,
    direction: 'horizontal',
    orientation: undefined,
    plain: false,
    removeOrientationMargin: undefined,
    styles: '',
    ariaLabel: '',
    slotText: '',
    sbId: '',
    sbAriaDisabled: false,
  },
};


// ===== Stories =====

const Template = args => {
  const wrap =
    document.createElement('div');

  const divider =
    buildDivider({
      ...args,
      direction: 'horizontal',
    });

  wrap.append(
    makeParagraph(),
    divider,
    makeParagraph(),
  );

  return wrap;
};


export const Horizontal =
  Template.bind({});

Horizontal.parameters = {
  docs: {
    description: {
      story:
        'A basic horizontal divider between two paragraphs.',
    },
  },
};


export const HorizontalDashed =
  Template.bind({});

HorizontalDashed.args = {
  dashed: true,
};

HorizontalDashed.parameters = {
  docs: {
    description: {
      story:
        'A dashed horizontal divider between two paragraphs.',
    },
  },
};


export const PlainText =
  Template.bind({});

PlainText.args = {
  plain: true,
  orientation: 'center',
  slotText: 'Plain Text',
};

PlainText.parameters = {
  docs: {
    description: {
      story:
        'If using a text divider, setting `plain` removes default typography weight.',
    },
  },
};


export const TextCentered =
  Template.bind({});

TextCentered.args = {
  orientation: 'center',
  slotText: 'Center Title',
};

TextCentered.parameters = {
  docs: {
    description: {
      story:
        'A horizontal divider with centered text.',
    },
  },
};


export const TextLeftStyled =
  Template.bind({});

TextLeftStyled.args = {
  orientation: 'left',
  slotText: 'Left Aligned Text',
  styles:
    'color:#096ac1; font-size:0.875rem; letter-spacing:0.02em;',
};

TextLeftStyled.parameters = {
  docs: {
    description: {
      story:
        'A horizontal divider with left-aligned text and custom styles.',
    },
  },
};


export const TextRightStyled =
  Template.bind({});

TextRightStyled.args = {
  orientation: 'right',
  slotText: 'Right Aligned Text',
  styles:
    'color:#0d9312; font-size:0.875rem; letter-spacing:0.02em;',
};

TextRightStyled.parameters = {
  docs: {
    description: {
      story:
        'A horizontal divider with right-aligned text and custom styles.',
    },
  },
};


export const TextLeftWithNoLeftMargin =
  Template.bind({});

TextLeftWithNoLeftMargin.args = {
  orientation: 'left',
  removeOrientationMargin: 'left',
  slotText: 'Left Aligned Text',
};

TextLeftWithNoLeftMargin.parameters = {
  docs: {
    description: {
      story:
        'A horizontal divider with left-aligned text and no default left orientation margin.',
    },
  },
};


export const TextRightWithNoRightMargin =
  Template.bind({});

TextRightWithNoRightMargin.args = {
  orientation: 'right',
  removeOrientationMargin: 'right',
  slotText: 'Right Aligned Text',
};

TextRightWithNoRightMargin.parameters = {
  docs: {
    description: {
      story:
        'A horizontal divider with right-aligned text and no default right orientation margin.',
    },
  },
};


export const Vertical = args => {
  const wrap =
    document.createElement('div');

  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '12px';
  wrap.style.height = '48px';

  const left =
    document.createElement('div');

  left.textContent = 'Left';

  const right =
    document.createElement('div');

  right.textContent = 'Right';

  const divider =
    buildDivider({
      ...args,
      direction: 'vertical',
      orientation: undefined,
      slotText: '',
    });

  wrap.append(
    left,
    divider,
    right,
  );

  return wrap;
};

Vertical.args = {
  dashed: false,
  plain: false,
  styles: '',
  ariaLabel: '',
};

Vertical.parameters = {
  docs: {
    description: {
      story:
        'A vertical divider between two items in a flex row.',
    },
  },
};


export const KitchenSink = args => {
  const container =
    document.createElement('div');

  container.style.display = 'grid';
  container.style.gap = '16px';

  const aWrap =
    document.createElement('div');

  aWrap.append(
    makeParagraph(),
    buildDivider({
      ...args,
      dashed: true,
      orientation: undefined,
      direction: 'horizontal',
    }),
    makeParagraph(),
  );

  const bWrap =
    document.createElement('div');

  bWrap.append(
    makeParagraph(),
    buildDivider({
      ...args,
      orientation: 'center',
      slotText: 'Overview',
      direction: 'horizontal',
    }),
    makeParagraph(),
  );

  const cWrap =
    document.createElement('div');

  cWrap.append(
    makeParagraph(),

    buildDivider({
      ...args,
      orientation: 'left',
      removeOrientationMargin: 'left',
      plain: true,
      slotText: 'Details',
      styles:
        'color:#555; font-weight:600;',
      direction: 'horizontal',
    }),

    makeParagraph(),
  );

  const row =
    document.createElement('div');

  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '8px';
  row.style.height = '40px';

  row.append(
    document.createTextNode('Alpha'),

    buildDivider({
      ...args,
      direction: 'vertical',
    }),

    document.createTextNode('Beta'),

    buildDivider({
      ...args,
      direction: 'vertical',
      dashed: true,
    }),

    document.createTextNode('Gamma'),
  );

  container.append(
    aWrap,
    bWrap,
    cWrap,
    row,
  );

  return container;
};

KitchenSink.args = {};

KitchenSink.parameters = {
  docs: {
    description: {
      story:
        'A collection of various divider examples in one view.',
    },

    source: {
      language: 'html',

      code: buildDocsHtmlMany([
        `<div>
  <p>Content above</p>
  <divider-component dashed></divider-component>
  <p>Content below</p>
</div>`,

        `<div>
  <p>Content above</p>
  <divider-component orientation="center">Overview</divider-component>
  <p>Content below</p>
</div>`,

        `<div>
  <p>Content above</p>
  <divider-component
    orientation="left"
    remove-orientation-margin="left"
    plain
    styles="color:#555; font-weight:600;"
  >
    Details
  </divider-component>
  <p>Content below</p>
</div>`,

        `<div style="display:flex; align-items:center; gap:8px; height:40px;">
  Alpha
  <divider-component direction="vertical"></divider-component>
  Beta
  <divider-component direction="vertical" dashed></divider-component>
  Gamma
</div>`,
      ]),
    },
  },
};


export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: () => {
    const root =
      document.createElement('div');

    root.className =
      'divider-accessibility-matrix';

    const intro =
      document.createElement('div');

    const introTitle =
      document.createElement('div');

    introTitle.className =
      'divider-accessibility-matrix__intro-title';

    introTitle.textContent =
      'Accessibility matrix';

    const introDescription =
      document.createElement('div');

    introDescription.className =
      'divider-accessibility-matrix__intro-description';

    introDescription.innerHTML =
      'Renders key divider variants and prints computed accessibility information from both the <code>divider-component</code> host and its rendered divider element. ' +
      'The matrix reports <code>role</code>, <code>aria-orientation</code>, accessible naming, IDs, classes, and core component properties.';

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
        title:
          'Horizontal separator',

        build: n => {
          const wrap =
            document.createElement(
              'div',
            );

          wrap.append(
            makeParagraph(),

            buildDivider({
              direction:
                'horizontal',
              sbId:
                `divider-a11y-${n}`,
            }),

            makeParagraph(),
          );

          return wrap;
        },
      },

      {
        title:
          'Vertical separator',

        build: n => {
          const wrap =
            document.createElement(
              'div',
            );

          wrap.className =
            'divider-accessibility-matrix__inline';

          wrap.append(
            document.createTextNode(
              'Alpha',
            ),

            buildDivider({
              direction:
                'vertical',
              sbId:
                `divider-a11y-${n}`,
            }),

            document.createTextNode(
              'Beta',
            ),
          );

          return wrap;
        },
      },

      {
        title:
          'Text divider with accessible name',

        build: n => {
          const wrap =
            document.createElement(
              'div',
            );

          wrap.append(
            makeParagraph(),

            buildDivider({
              direction:
                'horizontal',
              orientation:
                'center',
              slotText:
                'Section',
              ariaLabel:
                'Section divider',
              sbId:
                `divider-a11y-${n}`,
            }),

            makeParagraph(),
          );

          return wrap;
        },
      },

      {
        title:
          'Dashed text divider',

        build: n => {
          const wrap =
            document.createElement(
              'div',
            );

          wrap.append(
            buildDivider({
              direction:
                'horizontal',
              dashed: true,
              orientation:
                'left',
              slotText:
                'Error section',
              ariaLabel:
                'Error section divider',
              sbId:
                `divider-a11y-${n}`,
            }),
          );

          return wrap;
        },
      },

      {
        title:
          'aria-disabled audit',

        build: n => {
          const wrap =
            document.createElement(
              'div',
            );

          const note =
            document.createElement(
              'div',
            );

          note.className =
            'divider-accessibility-matrix__note';

          note.textContent =
            'aria-disabled is shown only as an audit/debug example; a divider is normally non-interactive.';

          wrap.append(
            note,

            buildDivider({
              direction:
                'horizontal',
              sbId:
                `divider-a11y-${n}`,
              sbAriaDisabled:
                true,
            }),
          );

          return wrap;
        },
      },
    ];

    rows.forEach(
      (row, index) => {
        root.appendChild(
          renderDividerMatrixRow({
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
    controls: {
      disable: true,
    },

    docs: {
      description: {
        story:
          'Computed accessibility matrix for horizontal, vertical, named text, dashed, and aria-disabled audit variants. Each row reports the host and rendered divider accessibility semantics.',
      },

      source: {
        language: 'html',

        code: `<!-- Horizontal separator -->
<div>
  <p>Content above</p>
  <divider-component id="divider-a11y-1"></divider-component>
  <p>Content below</p>
</div>

<!-- Vertical separator -->
<div class="divider-accessibility-matrix__inline">
  Alpha
  <divider-component
    id="divider-a11y-2"
    direction="vertical"
  ></divider-component>
  Beta
</div>

<!-- Text divider with accessible name -->
<div>
  <p>Content above</p>
  <divider-component
    id="divider-a11y-3"
    orientation="center"
    aria-label="Section divider"
  >
    Section
  </divider-component>
  <p>Content below</p>
</div>

<!-- Dashed text divider -->
<div>
  <divider-component
    id="divider-a11y-4"
    dashed
    orientation="left"
    aria-label="Error section divider"
  >
    Error section
  </divider-component>
</div>

<!-- aria-disabled audit -->
<div>
  <divider-component
    id="divider-a11y-5"
    aria-disabled="true"
  ></divider-component>
</div>`,
      },

      story: {
        height: '1600px',
      },
    },
  },
};
