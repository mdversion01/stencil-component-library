// stories/tooltip-component.stories.js

export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Light-DOM tooltip wrapper. Place your trigger element inside the component. Supports placement, HTML content (trusted), variants, custom classes, manual control, and custom container.',
      },
    },
  },

  argTypes: {
    // Component props
    message: { control: 'text', table: { category: 'Tooltip Options' }, description: 'Message fallback when no title/data-original-title supplied.' },

    tooltipTitle: {
      control: 'text',
      name: 'tooltip-title',
      table: { category: 'Tooltip Options' },
      description:
        'Title/content string; if empty, falls back to `title`/`data-original-title` attributes or `message` prop. Recommended for use with `html-content` to avoid escaping. Overrides `message` if both present.',
    },

    htmlContent: {
      control: 'boolean',
      name: 'html-content',
      table: { category: 'Tooltip Options', defaultValue: { summary: false } },
      description: 'Treat tooltip content as trusted HTML. "tooltipTitle" recommended.',
    },

    position: {
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right'],
      table: { category: 'Tooltip Options' },
      description: 'Tooltip placement, top, bottom, left, right, relative to trigger element.',
    },

    trigger: {
      control: 'text',
      table: { category: 'Tooltip Options' },
      description: 'Space-separated: "hover focus click manual"',
    },

    animation: {
      control: 'boolean',
      table: { category: 'Tooltip Options', defaultValue: { summary: true } },
      description: 'Enable or disable tooltip animation.',
    },

    container: {
      control: 'text',
      table: { category: 'Tooltip Options' },
      description: 'CSS selector or element reference for custom tooltip container. Defaults to body.',
    },

    customClass: {
      control: 'text',
      name: 'custom-class',
      table: { category: 'Tooltip Options' },
      description: 'Custom class(es) can be added to the tooltip element for custom styling.',
    },

    variant: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      table: { category: 'Tooltip Options' },
      description: 'Applies Bootstrap color variants, primary, secondary, success, danger, info, warning, dark, to the tooltip.',
    },

    visible: {
      control: 'boolean',
      table: { category: 'Tooltip Options', defaultValue: { summary: false } },
      description: 'Used only with manual trigger (not wired here).',
    },

    // Demo helpers
    btnText: {
      control: 'text',
      name: 'btn-text',
      table: { category: 'Demo Helpers' },
      description: 'Text for the internal demo trigger button only.',
    },

    btnVariant: {
      control: 'select',
      options: ['secondary', 'primary', 'success', 'danger', 'info', 'warning', 'dark'],
      name: 'btn-variant',
      table: { category: 'Demo Helpers' },
      description: 'Variant for the internal demo trigger button only.',
    },
  },
};

// ======================================================
// Helpers
// ======================================================

/** Collapse blank lines + trim edges */
const normalize = txt => {
  const lines = txt
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

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

/** Build clean attribute block */
const attrs = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v)}"`))
    .join('\n    ');

/** Generate markup from args */
const buildTooltipMarkup = (args, id) => {
  const htmlFlag = !!args.htmlContent;

  const dataTitle = (args.tooltipTitle || args.message || 'Tooltip content').replaceAll('"', '&quot;');

  const attributeBlock = attrs([
    ['id', id],
    ['position', args.position],
    ['trigger', args.trigger],
    ['custom-class', args.customClass],
    ['variant', args.variant],
    ['container', args.container],
    ['message', args.message],
    ['animation', args.animation],
    ['html-content', htmlFlag],
    ['data-original-title', dataTitle],
    ['data-html', htmlFlag ? true : null],
  ]);

  return normalize(`
<div style="display:inline-block">
  <tooltip-component
    ${attributeBlock}
  >
    <button-component
      btn-text="${args.btnText}"
      size="sm"
      variant="${args.btnVariant}"
    ></button-component>
  </tooltip-component>
</div>
  `);
};

// ======================================================
// Playground (Controls-enabled)
// ======================================================

// export const Playground = {
//   render: args => {
//     const id = `tt-${Math.random().toString(36).slice(2)}`;
//     return buildTooltipMarkup(args, id);
//   },

//   parameters: {
//     docs: {
//       source: {
//         language: 'html',
//         transform: (_, ctx) => {
//           const id = `tt-doc-${Math.random().toString(36).slice(2)}`;
//           return buildTooltipMarkup(ctx.args, id);
//         },
//       },
//       description: {
//         story:
//           'Use the controls to customize the tooltip. Note: "tooltip-title" is used for the tooltip content in this demo to avoid escaping issues with the default "title" attribute. In practice, you would typically use one or the other, not both.',
//       },
//     },
//   },
// };

// Playground.args = {
//   message: '',
//   tooltipTitle: 'Hello from tooltip!',
//   htmlContent: false,
//   position: 'top',
//   trigger: 'hover focus',
//   animation: true,
//   container: '',
//   customClass: '',
//   variant: '',
//   visible: false,

//   btnText: 'Hover me',
//   btnVariant: 'secondary',
// };

// ======================================================
// Static Examples (Docs code preview forced to HTML)
// ======================================================

const POSITIONS_GRID_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component position="top" data-original-title="Tooltip on top" trigger="hover focus">
    <button-component btn-text="Top" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="right" data-original-title="Tooltip on right" trigger="hover focus">
    <button-component btn-text="Right" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="left" data-original-title="Tooltip on left" trigger="hover focus">
    <button-component btn-text="Left" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="bottom" data-original-title="Tooltip on bottom" trigger="hover focus">
    <button-component btn-text="Bottom" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="auto" data-original-title="Placement auto" trigger="hover focus">
    <button-component btn-text="Auto" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const PositionsGrid = {
  render: () => POSITIONS_GRID_HTML,
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: POSITIONS_GRID_HTML,
      },
      description: {
        story: 'Use the `position` prop to specify tooltip placement, top, right, bottom, left, or auto, relative to the trigger element.',
      },
    },
  },
};

const WITH_HTML_CONTENT_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component
    position="top"
    data-original-title="<strong>HTML</strong> tooltip"
    trigger="hover focus"
    html-content
    data-html
  >
    <button-component btn-text="HTML Content" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const WithHTMLContent = {
  render: () => WITH_HTML_CONTENT_HTML,
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: WITH_HTML_CONTENT_HTML,
      },
      description: {
        story:
          'Set the `html-content` prop (or `data-html` attribute) to treat the tooltip content as trusted HTML. The `tooltip-title` prop is recommended for use with this option to avoid escaping issues.',
      },
    },
  },
};

const VARIANTS_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component position="top" data-original-title="Primary" trigger="hover focus" variant="primary">
    <button-component btn-text="Primary" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Secondary" trigger="hover focus" variant="secondary">
    <button-component btn-text="Secondary" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Info" trigger="hover focus" variant="info">
    <button-component btn-text="Info" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Danger" trigger="hover focus" variant="danger">
    <button-component btn-text="Danger" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Warning" trigger="hover focus" variant="warning">
    <button-component btn-text="Warning" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Success" trigger="hover focus" variant="success">
    <button-component btn-text="Success" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Dark" trigger="hover focus" variant="dark">
    <button-component btn-text="Dark" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const Variants = {
  render: () => VARIANTS_HTML,
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: VARIANTS_HTML,
      },
      description: {
        story: 'Use the `variant` prop to apply different visual styles, primary, secondary, success, danger, warning, info, or dark, to the tooltip.',
      },
    },
  },
};

const INLINE_LINKS_HTML = normalize(`
<p style="max-width:680px; line-height:1.6">
  This paragraph contains
  <tooltip-component position="top" data-original-title="Inline tooltip" trigger="hover focus">
    <a href="javascript:void(0)">inline links</a>
  </tooltip-component>
  with tooltips for demonstration.
</p>
`);

export const InlineLinks = {
  render: () => INLINE_LINKS_HTML,
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: INLINE_LINKS_HTML,
      },
      description: {
        story: 'Tooltips can be used on inline elements like links. The tooltip will be positioned relative to the link and will not disrupt the flow of the text.',
      },
    },
  },
};

const CUSTOM_CONTAINER_HTML = normalize(`
<div>
  <div id="sb-tooltip-container" style="position:relative; border:1px dashed #ccc; padding:20px; height:160px; overflow:auto">
    <div style="height:320px; margin-top:80px">
      <tooltip-component
        container="#sb-tooltip-container"
        position="right"
        data-original-title="Inside scrollable container"
        trigger="hover focus"
      >
        <button-component btn-text="Hover me" size="sm" variant="secondary"></button-component>
      </tooltip-component>
    </div>
  </div>
  <small style="color:#666">Tooltip stays inside container.</small>
</div>
`);

export const CustomContainer = {
  render: () => CUSTOM_CONTAINER_HTML,
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: CUSTOM_CONTAINER_HTML,
      },
      description: {
        story: 'Tooltips can be contained within a custom container. This is useful for scrollable or constrained areas.',
      },
    },
  },
};
