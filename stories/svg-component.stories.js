// src/stories/svg-component.stories.js

export default {
  title: 'Components/SVG',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An SVG component for rendering inline SVG icons with accessibility and styling options. Uses `path` + `viewBox` to render the SVG markup.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        // Keep Docs "Source" synced with Controls
        transform: (_code, ctx) => Template(ctx.args),
      },
    },
  },
  argTypes: {
    /* -----------------------------
     Appearance
  ------------------------------ */
    fill: {
      control: 'color',
      description: 'Fill color for the SVG icon.',
      table: { defaultValue: { summary: '#3c83f6' }, category: 'Appearance' },
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
      description: 'Applies inline margin to the rendered `<svg>`. left => margin-left:10px, right => margin-right:10px, both => both sides.',
      table: { category: 'Appearance' },
    },

    /* -----------------------------
     SVG Content
  ------------------------------ */
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

    /* -----------------------------
     Accessibility
  ------------------------------ */
    svgAriaHidden: {
      control: { type: 'select' },
      options: [undefined, 'true', 'false'],
      name: 'svg-aria-hidden',
      description: 'Sets the aria-hidden attribute on the SVG element.',
      table: { category: 'Accessibility' },
    },
    svgAriaLabel: {
      control: 'text',
      name: 'svg-aria-label',
      description: 'Sets the aria-label attribute on the SVG element for accessibility.',
      table: { category: 'Accessibility' },
    },
  },
};

/* ---------------- helpers ---------------- */

const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return null;

  const s = String(v);

  // If value contains a double quote, use single quotes and escape any single quotes
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');

  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const boolishAttrLine = (name, v) => {
  if (v === undefined || v === null) return null;
  return `${name}="${String(v)}"`;
};

// Collapses empty lines + trims leading/trailing blank space
const normalizeHtml = html => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      out.push('');
      prevBlank = true;
      continue;
    }
    out.push(line);
    prevBlank = false;
  }

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

/* ---------------- defaults ---------------- */

const DEFAULT_VIEWBOX = '0 0 640 640';
const DEFAULT_PATH = `<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />`;

/* ---------------- templates ---------------- */

const Template = args => {
  const attrs = [
    attrLine('fill', args.fill),
    attrLine('height', args.height),
    attrLine('path', args.path),
    boolishAttrLine('svg-aria-hidden', args.svgAriaHidden),
    attrLine('svg-aria-label', args.svgAriaLabel),
    attrLine('svg-margin', args.svgMargin),
    attrLine('view-box', args.viewBox),
    attrLine('width', args.width),
  ]
    .filter(Boolean)
    .join('\n  ');

  return normalizeHtml(
    `<svg-component
       ${attrs}
     ></svg-component>`,
  );
};

const InlineWithTextTemplate = args => {
  const attrs = [
    attrLine('fill', args.fill),
    attrLine('height', args.height),
    attrLine('path', args.path),
    boolishAttrLine('svg-aria-hidden', args.svgAriaHidden),
    attrLine('svg-aria-label', args.svgAriaLabel),
    attrLine('svg-margin', args.svgMargin),
    attrLine('view-box', args.viewBox),
    attrLine('width', args.width),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(
    `<div style="display:flex;align-items:center;font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
    ${args.svgMargin === 'left' || args.svgMargin === 'both' ? '<span>Icon next to text</span>' : ''}
  <svg-component
    ${attrs}
  ></svg-component>
  ${args.svgMargin === 'right' || args.svgMargin === 'both' ? '<span>Icon next to text</span>' : ''}
</div>`,
  );
};

/* ---------------- stories ---------------- */

export const Basic = Template.bind({});
Basic.args = {
  fill: '#3B82F6',
  height: 32,
  path: DEFAULT_PATH,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: '',
  viewBox: DEFAULT_VIEWBOX,
  width: 32,
};
Basic.parameters = {
  docs: {
    description: {
      story: 'A basic SVG icon with default size and color.',
    },
  },
};

export const WithDimensions = Template.bind({});
WithDimensions.args = {
  fill: '#10B981',
  height: 48,
  path: DEFAULT_PATH,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: '',
  viewBox: DEFAULT_VIEWBOX,
  width: 48,
};
WithDimensions.parameters = {
  docs: {
    description: {
      story: 'An SVG icon with custom width and height.',
    },
  },
};

export const WithAriaLabel = Template.bind({});
WithAriaLabel.args = {
  fill: '#111827',
  height: 24,
  path: DEFAULT_PATH,
  svgAriaHidden: 'false',
  svgAriaLabel: 'Status: online',
  svgMargin: '',
  viewBox: DEFAULT_VIEWBOX,
  width: 24,
};
WithAriaLabel.parameters = {
  docs: {
    description: {
      story: 'An SVG icon with an aria-label for accessibility.',
    },
  },
};

export const InlineMarginLeft = InlineWithTextTemplate.bind({});
InlineMarginLeft.args = {
  fill: '#EF4444',
  height: 20,
  path: DEFAULT_PATH,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: 'left',
  viewBox: DEFAULT_VIEWBOX,
  width: 20,
};
InlineMarginLeft.parameters = {
  docs: {
    description: {
      story: 'An SVG icon with margin on the left side, displayed inline with text.',
    },
  },
};

export const InlineMarginRight = InlineWithTextTemplate.bind({});
InlineMarginRight.args = {
  fill: '#6366F1',
  height: 20,
  path: DEFAULT_PATH,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: 'right',
  viewBox: DEFAULT_VIEWBOX,
  width: 20,
};
InlineMarginRight.parameters = {
  docs: {
    description: {
      story: 'An SVG icon with margin on the right side, displayed inline with text.',
    },
  },
};

export const InlineMarginBoth = InlineWithTextTemplate.bind({});
InlineMarginBoth.args = {
  fill: '#111827',
  height: 20,
  path: DEFAULT_PATH,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: 'both',
  viewBox: DEFAULT_VIEWBOX,
  width: 20,
};
InlineMarginBoth.parameters = {
  docs: {
    description: {
      story: 'An SVG icon with margin on both sides, displayed inline with text.',
    },
  },
};
