// File: src/stories/divider-component/divider-component.stories.js

import DocsPage from './divider-component.docs.mdx';
import { buildDocsHtml, buildDocsHtmlMany, buildDivider, makeParagraph } from './divider-component.story-helpers.js';

export default {
  title: 'Components/Divider',
  tags: ['autodocs'],

  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component: ['Divider component for separating content with optional text or styling.', ''].join('\n'),
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
      table: { category: 'Appearance', defaultValue: { summary: false } },
    },
    plain: {
      control: 'boolean',
      description: 'Removes default typography weight from text divider',
      table: { category: 'Appearance', defaultValue: { summary: false } },
    },
    styles: {
      control: 'text',
      description: 'Inline styles for inner text (e.g. "color:#666; font-weight:600")',
      table: { category: 'Appearance' },
    },

    /* -----------------------------
     Layout
    ------------------------------ */
    direction: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Divider direction',
      table: { category: 'Layout' },
    },
    orientation: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Sets the position of the text within the divider',
      table: { category: 'Layout' },
    },
    removeOrientationMargin: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Removes default side margin on the text divider',
      name: 'remove-orientation-margin',
      table: { category: 'Layout' },
    },

    /* -----------------------------
     Accessibility
    ------------------------------ */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible name for the divider when it includes visible text. If not provided, it is derived from the slotted text.',
      table: { category: 'Accessibility' },
    },

    /* -----------------------------
     Storybook Only / Internal
    ------------------------------ */
    slotText: {
      table: { category: 'Storybook Only', disable: true },
      control: false,
      description: 'Text content for the slot (used only in this Storybook preview).',
      name: 'slot text',
    },
    sbId: {
      control: 'text',
      name: 'sb-id',
      description: 'Storybook-only: set an id attribute on the rendered divider element (for debug output).',
      table: { category: 'Storybook Only' },
    },
    sbAriaDisabled: {
      control: 'boolean',
      name: 'sb-aria-disabled',
      description: 'Storybook-only: set aria-disabled="true" on the divider element (audit/debug only; aria-disabled is a global ARIA state).',
      table: { category: 'Storybook Only', defaultValue: { summary: false } },
    },
  },

  controls: {
    exclude: ['slotText', 'sbId', 'sbAriaDisabled'],
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
  const wrap = document.createElement('div');
  const divider = buildDivider({ ...args, direction: 'horizontal' });
  wrap.append(makeParagraph(), divider, makeParagraph());
  return wrap;
};

export const Horizontal = Template.bind({});
Horizontal.parameters = {
  docs: {
    description: {
      story: 'A basic horizontal divider between two paragraphs.',
    },
  },
};

export const HorizontalDashed = Template.bind({});
HorizontalDashed.args = {
  dashed: true,
};
HorizontalDashed.parameters = {
  docs: {
    description: {
      story: 'A dashed horizontal divider between two paragraphs.',
    },
  },
};

export const PlainText = Template.bind({});
PlainText.args = {
  plain: true,
  orientation: 'center',
  slotText: 'Plain Text',
};
PlainText.parameters = {
  docs: {
    description: {
      story: 'If using a text divider, setting `plain` removes default typography weight.',
    },
  },
};

export const TextCentered = Template.bind({});
TextCentered.args = {
  orientation: 'center',
  slotText: 'Center Title',
};
TextCentered.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with centered text.',
    },
  },
};

export const TextLeftStyled = Template.bind({});
TextLeftStyled.args = {
  orientation: 'left',
  slotText: 'Left Aligned Text',
  styles: 'color:#096ac1; font-size:0.875rem; letter-spacing:0.02em;',
};
TextLeftStyled.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with left-aligned text and custom styles.',
    },
  },
};

export const TextRightStyled = Template.bind({});
TextRightStyled.args = {
  orientation: 'right',
  slotText: 'Right Aligned Text',
  styles: 'color:#0d9312; font-size:0.875rem; letter-spacing:0.02em;',
};
TextRightStyled.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with right-aligned text and custom styles.',
    },
  },
};

export const TextLeftWithNoLeftMargin = Template.bind({});
TextLeftWithNoLeftMargin.args = {
  orientation: 'left',
  removeOrientationMargin: 'left',
  slotText: 'Left Aligned Text',
};
TextLeftWithNoLeftMargin.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with left-aligned text and default left margin.',
    },
  },
};

export const TextRightWithNoRightMargin = Template.bind({});
TextRightWithNoRightMargin.args = {
  orientation: 'right',
  removeOrientationMargin: 'right',
  slotText: 'Right Aligned Text',
};
TextRightWithNoRightMargin.parameters = {
  docs: {
    description: {
      story: 'A horizontal divider with right-aligned text and default right margin.',
    },
  },
};

export const Vertical = args => {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '12px';
  wrap.style.height = '48px';

  const left = document.createElement('div');
  left.textContent = 'Left';
  const right = document.createElement('div');
  right.textContent = 'Right';

  const divider = buildDivider({ ...args, direction: 'vertical', orientation: undefined, slotText: '' });

  wrap.append(left, divider, right);
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
      story: 'A vertical divider between two items in a flex row.',
    },
  },
};

export const KitchenSink = args => {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gap = '16px';

  const aWrap = document.createElement('div');
  aWrap.append(makeParagraph(), buildDivider({ ...args, dashed: true, orientation: undefined, direction: 'horizontal' }), makeParagraph());

  const bWrap = document.createElement('div');
  bWrap.append(makeParagraph(), buildDivider({ ...args, orientation: 'center', slotText: 'Overview', direction: 'horizontal' }), makeParagraph());

  const cWrap = document.createElement('div');
  cWrap.append(
    makeParagraph(),
    buildDivider({
      ...args,
      orientation: 'left',
      removeOrientationMargin: 'left',
      plain: true,
      slotText: 'Details',
      styles: 'color:#555; font-weight:600;',
      direction: 'horizontal',
    }),
    makeParagraph(),
  );

  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '8px';
  row.style.height = '40px';
  row.append(
    document.createTextNode('Alpha'),
    buildDivider({ ...args, direction: 'vertical' }),
    document.createTextNode('Beta'),
    buildDivider({ ...args, direction: 'vertical', dashed: true }),
    document.createTextNode('Gamma'),
  );

  container.append(aWrap, bWrap, cWrap, row);
  return container;
};
KitchenSink.args = {};
KitchenSink.parameters = {
  docs: {
    description: {
      story: 'A collection of various divider examples in one view.',
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

function pickAriaAndCoreAttrs(el) {
  const out = {};
  const names = ['id', 'role', 'aria-orientation', 'aria-label', 'aria-disabled'];
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

function snapshotDividerA11y(host) {
  const dividerEl = host.querySelector('.divider');
  if (!dividerEl) return { error: 'divider element not found' };

  return {
    tag: dividerEl.tagName.toLowerCase(),
    className: dividerEl.className,
    attrs: pickAriaAndCoreAttrs(dividerEl),
  };
}

function renderMatrixRow({ title, build, idSuffix }) {
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

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role/id…';

  const content = build(idSuffix);
  stage.appendChild(content);

  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const host = stage.querySelector('divider-component');
      if (!host) {
        pre.textContent = JSON.stringify({ error: 'divider-component not found' }, null, 2);
        return;
      }
      pre.textContent = JSON.stringify(snapshotDividerA11y(host), null, 2);
    });
  });

  return wrap;
}

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
        Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + <code>id</code> and divider <code>className</code>.
        For divider, "inline" is represented as the <em>vertical</em> variant inside an inline row. "Validation" and "Disabled" rows are audit demos only.
      </div>
    `;
    root.appendChild(intro);

    const rows = [
      {
        title: 'Default (horizontal)',
        build: n => {
          const wrap = document.createElement('div');
          wrap.append(makeParagraph(), buildDivider({ direction: 'horizontal', sbId: `divider-a11y-${n}` }), makeParagraph());
          return wrap;
        },
      },
      {
        title: 'Inline (vertical separator in a row)',
        build: n => {
          const wrap = document.createElement('div');
          wrap.style.display = 'inline-flex';
          wrap.style.alignItems = 'center';
          wrap.style.gap = '10px';
          wrap.append(document.createTextNode('Alpha'), buildDivider({ direction: 'vertical', sbId: `divider-a11y-${n}` }), document.createTextNode('Beta'));
          return wrap;
        },
      },
      {
        title: 'Horizontal (with text + aria-label)',
        build: n => {
          const wrap = document.createElement('div');
          wrap.append(
            makeParagraph(),
            buildDivider({
              direction: 'horizontal',
              orientation: 'center',
              slotText: 'Section',
              ariaLabel: 'Section divider',
              sbId: `divider-a11y-${n}`,
            }),
            makeParagraph(),
          );
          return wrap;
        },
      },
      {
        title: 'Error / Validation (audit demo)',
        build: n => {
          const wrap = document.createElement('div');
          const note = document.createElement('div');
          note.style.fontSize = '12px';
          note.style.color = '#444';
          note.textContent = 'Divider has no validation state; this row demonstrates a dashed divider with text as a visual separator in an error section.';
          wrap.append(note);

          wrap.append(
            buildDivider({
              direction: 'horizontal',
              dashed: true,
              orientation: 'left',
              slotText: 'Error section',
              ariaLabel: 'Error section divider',
              sbId: `divider-a11y-${n}`,
            }),
          );
          return wrap;
        },
      },
      {
        title: 'Disabled (audit demo via aria-disabled)',
        build: n => {
          const wrap = document.createElement('div');
          const note = document.createElement('div');
          note.style.fontSize = '12px';
          note.style.color = '#444';
          note.textContent = 'Divider is non-interactive; this row sets aria-disabled="true" for audit only and dims the wrapper visually.';
          wrap.append(note);

          const holder = document.createElement('div');
          holder.style.opacity = '0.55';
          holder.append(
            buildDivider({
              direction: 'horizontal',
              sbId: `divider-a11y-${n}`,
              sbAriaDisabled: true,
            }),
          );
          wrap.append(holder);
          return wrap;
        },
      },
    ];

    rows.forEach((r, idx) => root.appendChild(renderMatrixRow({ ...r, idSuffix: String(idx + 1) })));

    return root;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Matrix of key divider variants and a live readout of computed role/aria/id/className to help verify ARIA/508 expectations.',
      },
      source: {
        language: 'html',
        code: `<!-- Default (horizontal) -->
<div>
  <p>Content above</p>
  <divider-component id="divider-a11y-1"></divider-component>
  <p>Content below</p>
</div>

<!-- Inline (vertical separator in a row) -->
<div style="display:inline-flex; align-items:center; gap:10px;">
  Alpha
  <divider-component id="divider-a11y-2" direction="vertical"></divider-component>
  Beta
</div>

<!-- Horizontal (with text + aria-label) -->
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

<!-- Error / Validation (audit demo) -->
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

<!-- Disabled (audit demo via aria-disabled) -->
<div>
  <divider-component
    id="divider-a11y-5"
    aria-disabled="true"
  ></divider-component>
</div>`,
      },
    },
  },
};
