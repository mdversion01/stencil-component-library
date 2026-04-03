// src/stories/svg-component.stories.js
// UPDATED: uses svg-title / svg-desc (NOT title/desc) to avoid reserved prop name warnings
// + Accessibility Matrix (computed)

export default {
  title: 'Components/SVG',
  tags: ['autodocs'],
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
    /* -----------------------------
     Appearance
  ------------------------------ */
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
    // IMPORTANT: use svg-title/svg-desc, not title/desc
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
      description: 'Optional <desc> content. If no aria-describedby is provided, desc is used as describedby.',
      table: { category: 'Accessibility' },
    },
  },
};

/* ---------------- helpers ---------------- */

const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return null;

  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');

  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const boolLine = (name, on) => (on ? `${name}` : null);

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

const normalizeIdList = v => {
  const s = String(v ?? '').trim();
  if (!s) return '';
  return s.split(/\s+/).filter(Boolean).join(' ');
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
    attrLine('svg-margin', args.svgMargin),
    attrLine('view-box', args.viewBox),
    attrLine('width', args.width),

    // a11y
    typeof args.decorative === 'boolean' ? boolLine('decorative', args.decorative) : null,
    args.focusable === true ? attrLine('focusable', 'true') : args.focusable === false ? attrLine('focusable', 'false') : null,
    attrLine('svg-aria-hidden', args.svgAriaHidden),
    attrLine('svg-aria-label', args.svgAriaLabel),
    attrLine('svg-aria-labelledby', normalizeIdList(args.svgAriaLabelledby)),
    attrLine('svg-aria-describedby', normalizeIdList(args.svgAriaDescribedby)),
    // IMPORTANT: svg-title/svg-desc
    attrLine('svg-title', args.svgTitle),
    attrLine('svg-desc', args.svgDesc),
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
    attrLine('svg-margin', args.svgMargin),
    attrLine('view-box', args.viewBox),
    attrLine('width', args.width),

    // a11y
    typeof args.decorative === 'boolean' ? boolLine('decorative', args.decorative) : null,
    args.focusable === true ? attrLine('focusable', 'true') : args.focusable === false ? attrLine('focusable', 'false') : null,
    attrLine('svg-aria-hidden', args.svgAriaHidden),
    attrLine('svg-aria-label', args.svgAriaLabel),
    attrLine('svg-aria-labelledby', normalizeIdList(args.svgAriaLabelledby)),
    attrLine('svg-aria-describedby', normalizeIdList(args.svgAriaDescribedby)),
    // IMPORTANT: svg-title/svg-desc
    attrLine('svg-title', args.svgTitle),
    attrLine('svg-desc', args.svgDesc),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(
    `<div style="display:flex;align-items:center;gap:8px;font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
  <span>Inline text</span>
  <svg-component
    ${attrs}
  ></svg-component>
  <span>Inline text</span>
</div>`,
  );
};

/* ---------------- stories ---------------- */

export const Basic = Template.bind({});
Basic.args = {
  fill: 'currentColor',
  height: 32,
  path: DEFAULT_PATH,
  svgMargin: '',
  viewBox: DEFAULT_VIEWBOX,
  width: 32,

  // default behavior: unnamed => decorative
  decorative: undefined,
  focusable: undefined,
  svgAriaHidden: undefined,
  svgAriaLabel: '',
  svgAriaLabelledby: '',
  svgAriaDescribedby: '',
  svgTitle: '',
  svgDesc: '',
};
Basic.parameters = {
  docs: {
    description: {
      story: 'A basic SVG icon. With no accessible name, the component defaults to decorative (aria-hidden="true").',
    },
  },
};

export const WithDimensions = Template.bind({});
WithDimensions.args = {
  ...Basic.args,
  fill: '#10B981',
  height: 48,
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
  ...Basic.args,
  fill: '#111827',
  height: 24,
  width: 24,
  svgAriaHidden: 'false',
  svgAriaLabel: 'Status: online',
};
WithAriaLabel.parameters = {
  docs: {
    description: {
      story: 'A meaningful SVG icon with an aria-label (role="img", not aria-hidden).',
    },
  },
};

export const WithTitleAndDesc = Template.bind({});
WithTitleAndDesc.args = {
  ...Basic.args,
  svgAriaHidden: 'false',
  svgTitle: 'Settings',
  svgDesc: 'Opens settings',
};
WithTitleAndDesc.storyName = 'With Title + Desc';
WithTitleAndDesc.parameters = {
  docs: {
    description: {
      story: 'Uses <title>/<desc>. When no aria-label/labelledby is provided, title becomes the accessible name.',
    },
  },
};

export const InlineMarginLeft = InlineWithTextTemplate.bind({});
InlineMarginLeft.args = {
  ...Basic.args,
  fill: '#EF4444',
  height: 20,
  width: 20,
  svgMargin: 'left',
  svgAriaHidden: 'true',
};
InlineMarginLeft.parameters = {
  docs: {
    description: {
      story: 'An SVG icon with margin on the left side, displayed inline with text (decorative).',
    },
  },
};

export const InlineMarginRight = InlineWithTextTemplate.bind({});
InlineMarginRight.args = {
  ...Basic.args,
  fill: '#6366F1',
  height: 20,
  width: 20,
  svgMargin: 'right',
  svgAriaHidden: 'true',
};
InlineMarginRight.parameters = {
  docs: {
    description: {
      story: 'An SVG icon with margin on the right side, displayed inline with text (decorative).',
    },
  },
};

export const InlineMarginBoth = InlineWithTextTemplate.bind({});
InlineMarginBoth.args = {
  ...Basic.args,
  fill: '#111827',
  height: 20,
  width: 20,
  svgMargin: 'both',
  svgAriaHidden: 'true',
};
InlineMarginBoth.parameters = {
  docs: {
    description: {
      story: 'An SVG icon with margin on both sides, displayed inline with text (decorative).',
    },
  },
};

/* ============================== Accessibility Matrix (computed) ============================== */

const splitIds = v => String(v || '').trim().split(/\s+/).filter(Boolean);

const getSnapshot = (host, scopeRoot) => {
  const svg = host?.querySelector('svg');

  const labelledby = (svg?.getAttribute('aria-labelledby') || '').trim();
  const describedby = (svg?.getAttribute('aria-describedby') || '').trim();

  const resolve = id => {
    if (!id) return false;
    try {
      return !!scopeRoot.querySelector(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  const labelledIds = splitIds(labelledby);
  const describedIds = splitIds(describedby);

  return {
    host: host?.tagName?.toLowerCase?.() ?? null,
    role: svg?.getAttribute('role') ?? null,
    tabIndex: svg?.getAttribute('tabindex') ?? null,
    focusable: svg?.getAttribute('focusable') ?? null,
    'aria-hidden': svg?.getAttribute('aria-hidden') ?? null,
    'aria-label': svg?.getAttribute('aria-label') ?? null,
    'aria-labelledby': labelledby || null,
    'aria-describedby': describedby || null,
    hasTitle: !!svg?.querySelector('title'),
    hasDesc: !!svg?.querySelector('desc'),
    titleId: svg?.querySelector('title')?.getAttribute('id') ?? null,
    descId: svg?.querySelector('desc')?.getAttribute('id') ?? null,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolve),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
  };
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Prints computed <code>role</code> + <code>aria-*</code> + generated ids for default / inline / horizontal, error/validation, and disabled.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '') => {
      const box = document.createElement('div');
      box.style.border = '1px solid #ddd';
      box.style.borderRadius = '10px';
      box.style.padding = '12px';
      box.style.display = 'grid';
      box.style.gap = '10px';

      const t = document.createElement('div');
      t.style.fontWeight = '600';
      t.textContent = title;

      const demo = document.createElement('div');
      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      const mount = document.createElement('div');
      mount.innerHTML = normalizeHtml(`
        ${extraHtml}
        ${Template({ ...Basic.args, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        const host = mount.querySelector('svg-component');

        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('svg-component');
          } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(host, mount), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
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
        <div id="mx-inline-label" style="font-weight:600; margin-bottom:6px;">Inline label (external)</div>
        <div id="mx-inline-help" style="opacity:.8; margin-bottom:8px;">Help text for the icon meaning.</div>
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
        <div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px;">
          <div id="mx-horizontal-label" style="font-weight:600;">Horizontal label area</div>
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
        `<div id="mx-error" style="color:#a00; font-size:12px; margin-bottom:8px;">Error: action required.</div>`,
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
    controls: { disable: true },
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
