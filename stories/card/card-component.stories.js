// stories/card-component.stories.js
import { action } from '@storybook/addon-actions';

// ======================================================
// Helpers (Docs formatting + HTML source generation)
// ======================================================

// Inject CSS so Docs code blocks wrap instead of one long line.
const DocsWrapStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .sbdocs pre,
    .sbdocs pre code {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-x: auto !important;
    }
  `;
  return style;
};

/** Collapse extra blank lines + trim edges */
const normalize = (txt) => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      prevBlank = true;
      out.push('');
      continue;
    }
    prevBlank = false;
    out.push(line);
  }

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

const buildDocsHtml = (args) =>
  normalize(`
<card-component
  ${attrLines([
    // a11y / landmark
    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],
    ['landmark', args.landmark],

    // heading
    ['heading-level', args.headingLevel],

    // interactivity
    ['clickable', args.clickable],
    ['disabled', args.disabled],

    // state
    ['actions', args.actions],
    ['img', args.img],
    ['no-footer', args.noFooter],
    ['no-header', args.noHeader],

    // styling
    ['card-max-width', args.cardMaxWidth],
    ['class-names', args.classNames],
    ['elevation', args.elevation],
    ['inline-styles', args.inlineStyles],

    // image
    ['img-src', args.imgSrc],
    ['img-height', args.imgHeight],
    ['alt-text', args.altText],
    ['decorative-image', args.decorativeImage],
  ])}
>
  ${args.noHeader ? '' : `<div slot="header">${args.slotHeader}</div>`}
  <span slot="title">${args.slotTitle}</span>
  <span slot="text">${args.slotText}</span>
  ${args.actions ? `<span slot="actions">${args.slotActions}</span>` : ''}
  ${args.noFooter ? '' : `<div slot="footer"><p>${args.slotFooter}</p></div>`}
</card-component>
`);

const wrapDocsHtml = (innerHtml) =>
  normalize(`
<div style="max-width:680px;">
  ${String(innerHtml).replace(/\n/g, '\n  ')}
</div>
`);

// Helper: only set an attribute when the value is meaningful; otherwise remove it
const setAttr = (el, name, value) => {
  const isEmpty =
    value === false ||
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '');

  if (isEmpty) el.removeAttribute(name);
  else if (value === true) el.setAttribute(name, '');
  else el.setAttribute(name, String(value));
};

export default {
  title: 'Components/Card',
  tags: ['autodocs'],

  decorators: [
    (Story) => {
      const wrap = document.createElement('div');
      wrap.appendChild(DocsWrapStyles());
      wrap.appendChild(Story());
      return wrap;
    },
  ],

  parameters: {
    docs: {
      description: {
        component: ['Card component for displaying content in a card layout.', ''].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsHtml(ctx.args)),
      },
    },
  },

  argTypes: {
    /* -----------------------------
     * Accessibility
     * ------------------------------ */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description:
        'Accessible name. Used when landmark=true and aria-labelledby is not set; also used for clickable cards when no title slot is present.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'IDREF(s) for an external label element (space-separated). Preferred over aria-label.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'IDREF(s) for external description/help text (space-separated).',
      table: { category: 'Accessibility' },
    },
    landmark: {
      control: 'boolean',
      description: 'Opt-in landmark: renders role="region" and requires an accessible name.',
      table: { category: 'Accessibility', defaultValue: { summary: false } },
    },
    headingLevel: {
      control: { type: 'select' },
      options: [2, 3, 4, 5, 6],
      name: 'heading-level',
      description: 'Heading level used for the title slot.',
      table: { category: 'Accessibility', defaultValue: { summary: 5 } }, // ✅ updated default
    },

    /* -----------------------------
     * Interactivity
     * ------------------------------ */
    clickable: {
      control: 'boolean',
      description: 'If true, card behaves like a button (role="button", tabindex=0, Enter/Space emit customClick).',
      table: { category: 'Interactivity', defaultValue: { summary: false } },
    },
    disabled: {
      control: 'boolean',
      description: 'If clickable, disables activation and removes from tab order.',
      table: { category: 'Interactivity', defaultValue: { summary: false } },
    },

    /* -----------------------------
     * State
     * ------------------------------ */
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
     * Layout & Styling
     * ------------------------------ */
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

    /* -----------------------------
     * Image
     * ------------------------------ */
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
    decorativeImage: {
      control: 'boolean',
      name: 'decorative-image',
      description: 'If true, image is decorative (alt="") and aria-hidden="true" is set on the image.',
      table: { category: 'Image', defaultValue: { summary: false } },
    },

    /* -----------------------------
     * Slots
     * ------------------------------ */
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
    // interactivity/a11y
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    ariaDescribedby: undefined,
    landmark: false,
    headingLevel: 5, // ✅ updated default
    clickable: false,
    disabled: false,

    // state
    actions: false,
    img: false,
    noFooter: false,
    noHeader: false,

    // styling
    altText: undefined,
    cardMaxWidth: undefined,
    classNames: undefined,
    elevation: undefined,
    imgHeight: undefined,
    imgSrc: undefined,
    inlineStyles: undefined,
    decorativeImage: false,

    // default slot content
    slotActions: '<button class="btn btn-primary btn-sm" type="button">Action</button>',
    slotFooter: 'Card footer',
    slotHeader: 'Card header',
    slotText: 'This is some quick example text to build on the card title and make up the bulk of the card content.',
    slotTitle: 'Card title',
  },
};

const Template = (args) => {
  const el = document.createElement('card-component');

  // ----- PROPERTIES (runtime behavior) -----
  el.actions = !!args.actions;
  el.img = !!args.img;
  el.noFooter = !!args.noFooter;
  el.noHeader = !!args.noHeader;

  // interactivity/a11y
  el.clickable = !!args.clickable;
  el.disabled = !!args.disabled;
  el.landmark = !!args.landmark;
  el.headingLevel = Number(args.headingLevel) || 5;
  el.decorativeImage = !!args.decorativeImage;

  // Only set non-empty/meaningful props
  if (args.ariaLabel) el.ariaLabel = args.ariaLabel;
  if (args.ariaLabelledby) el.ariaLabelledby = args.ariaLabelledby;
  if (args.ariaDescribedby) el.ariaDescribedby = args.ariaDescribedby;

  if (args.classNames) el.classNames = args.classNames;
  if (args.elevation) el.elevation = args.elevation;
  if (args.inlineStyles) el.inlineStyles = args.inlineStyles;
  if (args.cardMaxWidth) el.cardMaxWidth = args.cardMaxWidth;

  // Image props only when img is enabled
  if (args.img) {
    if (args.altText) el.altText = args.altText;
    if (args.imgSrc) el.imgSrc = args.imgSrc;
    if (args.imgHeight) el.imgHeight = args.imgHeight;
  }

  // ----- ATTRIBUTES (Docs code shows only what a story uses) -----
  setAttr(el, 'actions', !!args.actions);
  setAttr(el, 'img', !!args.img);
  setAttr(el, 'no-footer', !!args.noFooter);
  setAttr(el, 'no-header', !!args.noHeader);

  setAttr(el, 'clickable', !!args.clickable);
  setAttr(el, 'disabled', !!args.disabled);
  setAttr(el, 'landmark', !!args.landmark);
  setAttr(el, 'heading-level', args.headingLevel);
  setAttr(el, 'decorative-image', !!args.decorativeImage);

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  setAttr(el, 'class-names', args.classNames);
  setAttr(el, 'elevation', args.elevation);
  setAttr(el, 'inline-styles', args.inlineStyles);
  setAttr(el, 'card-max-width', args.cardMaxWidth);

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

// --- NEW: Accessibility matrix story ---
export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML =
      `<strong>Accessibility matrix</strong>` +
      `<div style="opacity:.8">Prints computed role + aria-* + ids. Includes default, landmark (region), clickable, disabled-clickable, and decorative image.</div>`;
    wrap.appendChild(title);

    const card = (labelText, build) => {
      const c = document.createElement('div');
      c.style.display = 'grid';
      c.style.gridTemplateColumns = '320px 1fr';
      c.style.gap = '12px';
      c.style.alignItems = 'start';
      c.style.border = '1px solid #ddd';
      c.style.borderRadius = '8px';
      c.style.padding = '12px';

      const left = document.createElement('div');
      left.innerHTML = `<div style="font-weight:600">${labelText}</div>`;

      const right = document.createElement('div');
      right.style.display = 'grid';
      right.style.gap = '8px';

      const demo = document.createElement('div');
      const built = build();
      demo.appendChild(built);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      right.appendChild(demo);
      right.appendChild(pre);

      c.appendChild(left);
      c.appendChild(right);

      const snapshot = () => {
        const host = demo.querySelector('card-component');
        const root = host?.querySelector('article') || host; // host is <card-component>; inner root is <article>

        const heading = host?.querySelector('.card-title');
        const img = host?.querySelector('img');

        pre.textContent = JSON.stringify(
          {
            hostTag: host?.tagName?.toLowerCase() ?? null,
            rootTag: root?.tagName?.toLowerCase() ?? null,

            role: root?.getAttribute('role') ?? null,
            tabIndexAttr: root?.getAttribute('tabindex') ?? null,

            'aria-label': root?.getAttribute('aria-label') ?? null,
            'aria-labelledby': root?.getAttribute('aria-labelledby') ?? null,
            'aria-describedby': root?.getAttribute('aria-describedby') ?? null,
            'aria-disabled': root?.getAttribute('aria-disabled') ?? null,

            headingTag: heading ? heading.tagName.toLowerCase() : null,
            headingId: heading?.getAttribute('id') ?? null,
            headingText: heading?.textContent?.trim() ?? null,

            imgPresent: !!img,
            imgAlt: img?.getAttribute('alt') ?? null,
            imgAriaHidden: img?.getAttribute('aria-hidden') ?? null,
          },
          null,
          2,
        );
      };

      queueMicrotask(() => requestAnimationFrame(snapshot));
      return c;
    };

    // Default (not landmark, not clickable)
    wrap.appendChild(
      card('Default (no landmark)', () =>
        Template({
          ...args,
          landmark: false,
          clickable: false,
          disabled: false,
          ariaLabel: undefined,
          ariaLabelledby: undefined,
          ariaDescribedby: undefined,
          slotTitle: 'Default card',
          slotText: 'No landmark role by default (avoids duplicate landmark checks).',
        }),
      ),
    );

    // Landmark region (named)
    wrap.appendChild(
      card('Landmark region (named)', () => {
        const outer = document.createElement('div');
        outer.style.display = 'grid';
        outer.style.gap = '6px';

        const ext = document.createElement('div');
        ext.id = 'card-ext-label';
        ext.textContent = 'External landmark label';
        ext.style.fontWeight = '600';

        outer.appendChild(ext);

        const el = Template({
          ...args,
          landmark: true,
          clickable: false,
          ariaLabelledby: 'card-ext-label',
          ariaLabel: undefined,
          slotTitle: 'Landmark card title',
          slotText: 'role="region" + aria-labelledby points to external label.',
        });

        outer.appendChild(el);
        return outer;
      }),
    );

    // Clickable
    wrap.appendChild(
      card('Clickable (role=button)', () =>
        Template({
          ...args,
          clickable: true,
          disabled: false,
          landmark: false,
          slotTitle: 'Clickable card',
          slotText: 'Keyboard: Enter/Space emits customClick.',
        }),
      ),
    );

    // Clickable disabled
    wrap.appendChild(
      card('Clickable + disabled', () =>
        Template({
          ...args,
          clickable: true,
          disabled: true,
          landmark: false,
          slotTitle: 'Disabled clickable',
          slotText: 'aria-disabled should be true and tabindex should be absent.',
        }),
      ),
    );

    // Decorative image example
    wrap.appendChild(
      card('Decorative image', () =>
        Template({
          ...args,
          img: true,
          imgSrc: 'https://picsum.photos/800/450',
          imgHeight: '11.25rem',
          decorativeImage: true,
          altText: 'Should be ignored',
          slotTitle: 'Decorative image',
          slotText: 'Image rendered with alt="" and aria-hidden="true".',
        }),
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed role + `aria-*` attributes + ids for common configurations. Useful for verifying 508/WCAG tooling expectations (no landmark by default, named landmarks when enabled, correct interactive roles, and decorative images).',
      },
    },
  },
};
