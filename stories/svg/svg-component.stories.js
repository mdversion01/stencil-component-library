// src/stories/svg-component.stories.js
// import SvgDocs from './svg-component.docs.mdx';
import {
  Template,
  InlineWithTextTemplate,
  normalizeHtml,
  getSnapshot,
  DEFAULT_PATH,
  DEFAULT_VIEWBOX,
} from './svg-component.story-helpers';

const baseArgs = {
  fill: 'currentColor',
  height: 32,
  path: DEFAULT_PATH,
  svgMargin: '',
  viewBox: DEFAULT_VIEWBOX,
  width: 32,

  decorative: undefined,
  focusable: undefined,
  svgAriaHidden: undefined,
  svgAriaLabel: '',
  svgAriaLabelledby: '',
  svgAriaDescribedby: '',
  svgTitle: '',
  svgDesc: '',
};

const templateStoryParameters = {
  docs: {
    source: {
      type: 'dynamic',
      language: 'html',
      transform: (_code, ctx) => Template(ctx.args),
    },
  },
};

const inlineTemplateStoryParameters = {
  docs: {
    source: {
      type: 'dynamic',
      language: 'html',
      transform: (_code, ctx) => InlineWithTextTemplate(ctx.args),
    },
  },
};

export default {
  title: 'Components/SVG',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An SVG component for rendering inline SVG icons with accessibility and styling options. Uses `path` + `viewBox` to render the SVG markup. Defaults to decorative when unnamed.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => Template(ctx.args),
      },
    },
  },
  argTypes: {
    fill: {
      control: 'color',
      description: 'Fill color for the SVG icon.',
      table: { defaultValue: { summary: 'currentColor' }, category: 'Appearance' },
    },
    width: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Width of the SVG icon (px).',
      table: { defaultValue: { summary: 24 }, category: 'Appearance' },
    },
    height: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Height of the SVG icon (px).',
      table: { defaultValue: { summary: 24 }, category: 'Appearance' },
    },
    svgMargin: {
      control: { type: 'select' },
      options: ['', 'left', 'right', 'both'],
      name: 'svg-margin',
      description:
        'Applies inline margin to the rendered `<svg>`. left => margin-left:10px, right => margin-right:10px, both => both sides.',
      table: { category: 'Appearance' },
    },

    path: {
      control: 'text',
      description: 'Raw SVG markup inserted inside the `<svg>` (e.g. `<path d="..." />`).',
      table: { category: 'SVG Content' },
    },
    viewBox: {
      control: 'text',
      name: 'view-box',
      description: 'Sets the SVG viewBox. Must match the coordinate system used by the `path`.',
      table: { category: 'SVG Content' },
    },

    decorative: {
      control: 'boolean',
      description:
        'When true, forces decorative mode (aria-hidden="true" and removes accessible name wiring). If unset, defaults to decorative when no accessible name is provided.',
      table: { category: 'Accessibility' },
    },
    focusable: {
      control: { type: 'select' },
      options: [undefined, true, false],
      description:
        'Optional focus override. true => tabindex=0, false => tabindex=-1, unset => decorative:-1 meaningful:no tabindex.',
      table: { category: 'Accessibility' },
    },
    svgAriaHidden: {
      control: { type: 'select' },
      options: [undefined, 'true', 'false'],
      name: 'svg-aria-hidden',
      description:
        'Explicit aria-hidden forwarded to <svg>. If omitted, component computes based on decorative + labeling.',
      table: { category: 'Accessibility' },
    },
    svgAriaLabel: {
      control: 'text',
      name: 'svg-aria-label',
      description: 'Accessible name via aria-label. Ignored if svg-aria-labelledby is provided.',
      table: { category: 'Accessibility' },
    },
    svgAriaLabelledby: {
      control: 'text',
      name: 'svg-aria-labelledby',
      description: 'Accessible name via aria-labelledby (space-separated ids). Takes precedence over svg-aria-label.',
      table: { category: 'Accessibility' },
    },
    svgAriaDescribedby: {
      control: 'text',
      name: 'svg-aria-describedby',
      description: 'Optional description ids (space-separated).',
      table: { category: 'Accessibility' },
    },
    svgTitle: {
      control: 'text',
      name: 'svg-title',
      description:
        'Optional <title> content. If no aria-label/labelledby is provided, title becomes the accessible name.',
      table: { category: 'Accessibility' },
    },
    svgDesc: {
      control: 'text',
      name: 'svg-desc',
      description: 'Optional `<desc>` content. If no aria-describedby is provided, desc is used as describedby.',
      table: { category: 'Accessibility' },
    },
  },
};

export const Basic = {
  render: args => Template(args),
  args: {
    ...baseArgs,
  },
  parameters: {
    ...templateStoryParameters,
    docs: {
      ...templateStoryParameters.docs,
      description: {
        story: 'A basic SVG icon. With no accessible name, the component defaults to decorative (aria-hidden="true").',
      },
    },
  },
};

export const WithDimensions = {
  render: args => Template(args),
  args: {
    ...baseArgs,
    fill: '#10B981',
    height: 48,
    width: 48,
  },
  parameters: {
    ...templateStoryParameters,
    docs: {
      ...templateStoryParameters.docs,
      description: {
        story: 'An SVG icon with custom width and height.',
      },
    },
  },
};

export const WithAriaLabel = {
  render: args => Template(args),
  args: {
    ...baseArgs,
    fill: '#111827',
    height: 24,
    width: 24,
    svgAriaHidden: 'false',
    svgAriaLabel: 'Status: online',
  },
  parameters: {
    ...templateStoryParameters,
    docs: {
      ...templateStoryParameters.docs,
      description: {
        story: 'A meaningful SVG icon with an aria-label (role="img", not aria-hidden).',
      },
    },
  },
};

export const WithTitleAndDesc = {
  name: 'With Title + Desc',
  render: args => Template(args),
  args: {
    ...baseArgs,
    svgAriaHidden: 'false',
    svgTitle: 'Settings',
    svgDesc: 'Opens settings',
  },
  parameters: {
    ...templateStoryParameters,
    docs: {
      ...templateStoryParameters.docs,
      description: {
        story: 'Uses `<title>/<desc>`. When no aria-label/labelledby is provided, title becomes the accessible name.',
      },
    },
  },
};

export const InlineMarginLeft = {
  render: args => InlineWithTextTemplate(args),
  args: {
    ...baseArgs,
    fill: '#EF4444',
    height: 20,
    width: 20,
    svgMargin: 'left',
    svgAriaHidden: 'true',
  },
  parameters: {
    ...inlineTemplateStoryParameters,
    docs: {
      ...inlineTemplateStoryParameters.docs,
      description: {
        story: 'An SVG icon with margin on the left side, displayed inline with text (decorative).',
      },
    },
  },
};

export const InlineMarginRight = {
  render: args => InlineWithTextTemplate(args),
  args: {
    ...baseArgs,
    fill: '#6366F1',
    height: 20,
    width: 20,
    svgMargin: 'right',
    svgAriaHidden: 'true',
  },
  parameters: {
    ...inlineTemplateStoryParameters,
    docs: {
      ...inlineTemplateStoryParameters.docs,
      description: {
        story: 'An SVG icon with margin on the right side, displayed inline with text (decorative).',
      },
    },
  },
};

export const InlineMarginBoth = {
  render: args => InlineWithTextTemplate(args),
  args: {
    ...baseArgs,
    fill: '#111827',
    height: 20,
    width: 20,
    svgMargin: 'both',
    svgAriaHidden: 'true',
  },
  parameters: {
    ...inlineTemplateStoryParameters,
    docs: {
      ...inlineTemplateStoryParameters.docs,
      description: {
        story: 'An SVG icon with margin on both sides, displayed inline with text (decorative).',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'svg-accessibility-matrix';

    const header = document.createElement('div');

    const headerTitle = document.createElement('strong');
    headerTitle.textContent = 'Accessibility matrix';

    const headerDescription = document.createElement('div');
    headerDescription.className =
      'svg-accessibility-matrix__description';
    headerDescription.innerHTML =
      'Prints computed <code>role</code> + <code>aria-*</code> + generated ids for ' +
      'default / inline / horizontal, error/validation, and disabled.';

    header.appendChild(headerTitle);
    header.appendChild(headerDescription);
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '') => {
      const box = document.createElement('div');
      box.className = 'svg-accessibility-matrix__card';

      const cardTitle = document.createElement('div');
      cardTitle.className = 'svg-accessibility-matrix__card-title';
      cardTitle.textContent = title;

      const demo = document.createElement('div');
      demo.className = 'svg-accessibility-matrix__demo';

      const pre = document.createElement('pre');
      pre.className = 'svg-accessibility-matrix__output';
      pre.textContent = 'Loading…';

      const mount = document.createElement('div');
      mount.innerHTML = normalizeHtml(`
        ${extraHtml}
        ${Template({ ...baseArgs, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        const host = mount.querySelector('svg-component');

        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_error) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('svg-component');
          } catch (_error) {}
        }

        pre.textContent = JSON.stringify(
          getSnapshot(host, mount),
          null,
          2,
        );
      };

      queueMicrotask(() =>
        requestAnimationFrame(update),
      );

      box.appendChild(cardTitle);
      box.appendChild(demo);
      box.appendChild(pre);

      return box;
    };

    wrap.appendChild(
      card('Default (decorative, unnamed)', {
        fill: 'currentColor',
        width: 28,
        height: 28,
        path: DEFAULT_PATH,
      }),
    );

    wrap.appendChild(
      card(
        'Inline (simulated, aria-labelledby external)',
        {
          svgAriaHidden: 'false',
          svgAriaLabelledby: 'mx-inline-label',
          svgAriaDescribedby: 'mx-inline-help',
        },
        `
<div
  id="mx-inline-label"
  class="svg-accessibility-matrix__external-label"
>
  Inline label (external)
</div>

<div
  id="mx-inline-help"
  class="svg-accessibility-matrix__help"
>
  Help text for the icon meaning.
</div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal (simulated)',
        {
          svgAriaHidden: 'false',
          svgAriaLabelledby: 'mx-horizontal-label',
        },
        `
<div class="svg-accessibility-matrix__horizontal">
  <div
    id="mx-horizontal-label"
    class="svg-accessibility-matrix__horizontal-label"
  >
    Horizontal label area
  </div>
</div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'Error / validation (simulated via aria-describedby)',
        {
          svgAriaHidden: 'false',
          svgAriaLabel: 'Error icon',
          svgAriaDescribedby: 'mx-error',
        },
        `
<div
  id="mx-error"
  class="svg-accessibility-matrix__validation"
>
  Error: action required.
</div>
        `,
      ),
    );

    wrap.appendChild(
      card('Disabled (simulated, non-focusable)', {
        svgAriaHidden: 'false',
        svgAriaLabel: 'Disabled state icon',
        focusable: false,
      }),
    );

    return wrap;
  },

  parameters: {
    controls: {
      disable: true,
    },

    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the SVG: decorative default (aria-hidden), meaningful mode (role="img" with aria-label/labelledby), describedby wiring, title/desc ids, plus simulated inline/horizontal layouts and simulated error describedby.',
      },

      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
};
