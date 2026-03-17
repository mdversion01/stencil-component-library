// stories/icon-component.stories.js

export default {
  title: 'Components/Icon',
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (src, context) => {
          const { name: storyName, args } = context;

          // camelCase -> kebab-case
          const toAttr = k => k.replace(/[A-Z]/g, m => '-' + m.toLowerCase());

          // Serialize props -> HTML attributes
          // RULE: if a prop is false or "", do NOT print it.
          // - Booleans: print presence-only when true; omit when false
          // - Strings: omit when empty
          // - Numbers: print when not undefined
          const attrsToString = props =>
            Object.entries(props)
              .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
              .map(([k, v]) => {
                const attr = toAttr(k);
                if (v === true) return attr;
                return `${attr}="${String(v)}"`;
              })
              .join(' ');

          const iconTag = (props = {}) => `<icon-component ${attrsToString(props)}></icon-component>`;
          const wrap = (inner, style) => `<div style="${style}">\n  ${inner}\n</div>`;

          switch (storyName) {
            case 'Basic': {
              const used = {
                icon: args?.icon,
                size: args?.size,
                color: args?.color,
                iconSize: args?.iconSize,
                tokenIcon: !!args?.tokenIcon,
                iconMargin: args?.iconMargin,
                iconAriaHidden: args?.iconAriaHidden, // printed only when true (decorative)
                iconAriaLabel: args?.iconAriaLabel,
              };
              return iconTag(used);
            }

            case 'Sizes': {
              const items = [
                { comment: 'Default', props: { icon: 'fa-solid fa-user' } },
                { comment: 'fa-lg', props: { icon: 'fa-solid fa-user', size: 'fa-lg' } },
                { comment: 'fa-2x', props: { icon: 'fa-solid fa-user', size: 'fa-2x' } },
                { comment: 'inline 28px', props: { icon: 'fa-solid fa-user', iconSize: 28 } },
                { comment: 'inline 40px', props: { icon: 'fa-solid fa-user', iconSize: 40 } },
              ];
              const html = items.map(({ comment, props }) => `<!-- ${comment} -->\n${iconTag(props)}`).join('\n');
              return wrap(html, 'display:flex; gap:16px; align-items:center;');
            }

            // These return explicit code via story-level parameters below
            case 'WithColor':
            case 'TokenIcon':
            case 'AccessibleLabel':
            case 'IconGallery':
              return src;

            case 'Margins': {
              const left = `<span>Left margin ${iconTag({ icon: 'fa-solid fa-circle-info', iconMargin: 'left' })}</span>`;
              const right = `<span>${iconTag({ icon: 'fa-solid fa-circle-info', iconMargin: 'right' })} Right margin</span>`;
              const html = [left, right].join('\n');
              return wrap(html, 'display:flex; align-items:center; gap:12px;');
            }

            case 'Playground': {
              const used = {
                icon: args?.icon,
                size: args?.size,
                color: args?.color,
                iconSize: args?.iconSize,
                tokenIcon: !!args?.tokenIcon,
                iconMargin: args?.iconMargin,
                iconAriaHidden: args?.iconAriaHidden,
                iconAriaLabel: args?.iconAriaLabel,
              };
              return iconTag(used);
            }

            default:
              return src;
          }
        },
      },
      description: {
        component:
          'The <icon-component> renders Font Awesome / Material Design icons by class name. It supports size, color, spacing, and accessibility.\n\nAccessibility:\n- Decorative by default (aria-hidden="true")\n- Meaningful icon: set icon-aria-hidden="false" AND provide icon-aria-label (role="img" is applied)',
      },
    },
  },
  argTypes: {
    /* -----------------------------
     Content
    ------------------------------ */
    icon: {
      control: 'text',
      description: 'Add icon class string (e.g., "fa-solid fa-user"). Uses either Font Awesome or Material Design Icons',
      table: { category: 'Content' },
    },

    /* -----------------------------
     Styling
    ------------------------------ */
    color: {
      control: 'color',
      description: 'Adds inline color style',
      name: 'color',
      table: { category: 'Styling' },
    },

    size: {
      control: 'text',
      description: 'Extra size class (e.g., "fa-lg", "fa-2x", or a custom utility)',
      table: { category: 'Styling' },
    },

    iconSize: {
      control: 'number',
      description: 'Inline font-size in px',
      name: 'icon-size',
      table: { category: 'Styling' },
    },

    tokenIcon: {
      control: 'boolean',
      description: 'Adds "token-icon" class',
      name: 'token-icon',
      table: { category: 'Styling', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Layout
    ------------------------------ */
    iconMargin: {
      control: { type: 'select' },
      options: ['', 'left', 'right'],
      description: 'Applies spacing utility (ms-1 or me-1)',
      name: 'icon-margin',
      table: { category: 'Layout' },
    },

    /* -----------------------------
     Accessibility
    ------------------------------ */
    iconAriaHidden: {
      control: 'boolean',
      description:
        'Whether the icon is hidden from assistive tech (aria-hidden). Default is true (decorative). If set to false, you MUST provide icon-aria-label.',
      name: 'icon-aria-hidden',
      table: { category: 'Accessibility', defaultValue: { summary: true } },
    },

    iconAriaLabel: {
      control: 'text',
      description: 'Accessible label (sets aria-label when icon-aria-hidden=false)',
      name: 'icon-aria-label',
      table: { category: 'Accessibility' },
    },
  },

  args: {
    color: '',
    icon: 'fa-solid fa-star',
    // ✅ Updated defaults to match component (decorative)
    iconAriaHidden: true,
    iconAriaLabel: '',
    iconMargin: '',
    iconSize: undefined,
    size: '',
    tokenIcon: false,
  },
};

/** ------------ Helpers ------------ */
// IMPORTANT: Set properties for correct runtime behavior,
// and set attributes ONLY when they should appear in the HTML (omit false/"").
const makeIcon = (args = {}) => {
  const el = document.createElement('icon-component');

  // Always set properties (Stencil props)
  if (args.icon !== undefined) el.icon = args.icon;
  if (args.iconMargin !== undefined) el.iconMargin = args.iconMargin;
  if (args.size !== undefined) el.size = args.size;
  if (args.tokenIcon !== undefined) el.tokenIcon = !!args.tokenIcon;
  if (args.iconSize !== undefined) el.iconSize = args.iconSize;
  if (args.color !== undefined) el.color = args.color;
  if (args.iconAriaLabel !== undefined) el.iconAriaLabel = args.iconAriaLabel;
  if (args.iconAriaHidden !== undefined) el.iconAriaHidden = args.iconAriaHidden;

  // Mirror to attributes ONLY when they should be printed
  if (args.icon) el.setAttribute('icon', String(args.icon));
  if (args.iconMargin) el.setAttribute('icon-margin', String(args.iconMargin));
  if (args.size) el.setAttribute('size', String(args.size));
  if (args.tokenIcon === true) el.setAttribute('token-icon', '');
  if (typeof args.iconSize === 'number') el.setAttribute('icon-size', String(args.iconSize));
  if (args.color) el.setAttribute('color', String(args.color));
  if (args.iconAriaLabel) el.setAttribute('icon-aria-label', String(args.iconAriaLabel));

  // ✅ For Docs correctness: only print icon-aria-hidden when TRUE (decorative)
  // (When false, we omit it per your Docs rule. Runtime behavior still uses the property above.)
  if (args.iconAriaHidden === true) el.setAttribute('icon-aria-hidden', 'true');
  else el.removeAttribute('icon-aria-hidden');

  return el;
};

const Template = args => makeIcon(args);

/** ------------ Stories ------------ */

export const Basic = Template.bind({});
Basic.args = {
  icon: 'fa-solid fa-star',
  iconAriaHidden: true,
};
Basic.parameters = {
  docs: {
    description: {
      story: 'Basic icon. Decorative by default (`aria-hidden="true"`). Docs code omits any props that are false or empty strings.',
    },
  },
};

export const Sizes = () => {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.gap = '16px';
  [
    { label: 'Default', props: { icon: 'fa-solid fa-user', iconAriaHidden: true } },
    { label: 'fa-lg', props: { icon: 'fa-solid fa-user', size: 'fa-lg', iconAriaHidden: true } },
    { label: 'fa-2x', props: { icon: 'fa-solid fa-user', size: 'fa-2x', iconAriaHidden: true } },
    { label: 'inline 28px', props: { icon: 'fa-solid fa-user', iconSize: 28, iconAriaHidden: true } },
    { label: 'inline 40px', props: { icon: 'fa-solid fa-user', iconSize: 40, iconAriaHidden: true } },
  ].forEach(({ label, props }) => {
    const col = document.createElement('div');
    col.style.display = 'flex';
    col.style.flexDirection = 'column';
    col.style.alignItems = 'center';
    col.style.gap = '8px';
    col.appendChild(makeIcon(props));
    const cap = document.createElement('small');
    cap.textContent = label;
    col.appendChild(cap);
    wrapper.appendChild(col);
  });
  return wrapper;
};
Sizes.parameters = {
  docs: {
    description: {
      story: 'Examples using FA size classes (`size`) and inline pixel sizing (`iconSize`).',
    },
  },
};

export const WithColor = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '16px';
  container.append(
    makeIcon({ icon: 'fa-solid fa-heart', color: '#ef4444', iconSize: 28, iconAriaHidden: true }),
    makeIcon({ icon: 'fa-solid fa-bolt', color: '#f59e0b', iconSize: 28, iconAriaHidden: true }),
    makeIcon({ icon: 'fa-solid fa-leaf', color: '#10b981', iconSize: 28, iconAriaHidden: true }),
    makeIcon({ icon: 'fa-solid fa-water', color: '#3b82f6', iconSize: 28, iconAriaHidden: true }),
  );
  return container;
};
WithColor.parameters = {
  docs: {
    source: {
      code: [
        '<div style="display:flex; gap:16px;">',
        '  <icon-component icon="fa-solid fa-heart" color="#ef4444" icon-size="28" icon-aria-hidden="true"></icon-component>',
        '  <icon-component icon="fa-solid fa-bolt"  color="#f59e0b" icon-size="28" icon-aria-hidden="true"></icon-component>',
        '  <icon-component icon="fa-solid fa-leaf"  color="#10b981" icon-size="28" icon-aria-hidden="true"></icon-component>',
        '  <icon-component icon="fa-solid fa-water" color="#3b82f6" icon-size="28" icon-aria-hidden="true"></icon-component>',
        '</div>',
      ].join('\n'),
    },
    description: {
      story: 'Colored icons with inline pixel sizing (decorative).',
    },
  },
};

export const TokenIcon = Template.bind({});
TokenIcon.args = {
  icon: 'fa-solid fa-shield',
  tokenIcon: true,
  iconSize: 10,
  color: '#0ea5e9',
  iconAriaHidden: true,
};
TokenIcon.parameters = {
  docs: {
    source: {
      code: '<icon-component icon="fa-solid fa-shield" color="#0ea5e9" icon-size="10" token-icon icon-aria-hidden="true"></icon-component>',
    },
    description: {
      story: 'Token-style icon (adds "token-icon" class) with custom color and size (decorative).',
    },
  },
};

export const Margins = () => {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '12px';

  const left = document.createElement('span');
  left.textContent = 'Left margin';
  left.appendChild(makeIcon({ icon: 'fa-solid fa-circle-info', iconMargin: 'left', iconAriaHidden: true }));

  const right = document.createElement('span');
  right.appendChild(makeIcon({ icon: 'fa-solid fa-circle-info', iconMargin: 'right', iconAriaHidden: true }));
  right.appendChild(document.createTextNode('Right margin'));

  row.append(left, right);
  return row;
};
Margins.parameters = {
  docs: {
    description: {
      story: 'Apply left/right spacing via `iconMargin` (decorative).',
    },
  },
};

export const AccessibleLabel = Template.bind({});
AccessibleLabel.args = {
  icon: 'fa-solid fa-bell',
  iconAriaHidden: false,
  iconAriaLabel: 'Notifications',
  iconSize: 24,
};
AccessibleLabel.parameters = {
  docs: {
    source: {
      // NOTE: We omit icon-aria-hidden="false" to follow your docs rule (omit false/empty),
      // but runtime behavior is set via the property.
      code: '<icon-component icon="fa-solid fa-bell" icon-aria-label="Notifications" icon-size="24"></icon-component>',
    },
    description: {
      story: 'Meaningful icon: icon-aria-hidden=false + icon-aria-label. Component applies role="img".',
    },
  },
};

export const Playground = Template.bind({});
Playground.args = {
  icon: 'fa-solid fa-gear',
  size: 'fa-lg',
  color: '#111827',
  iconSize: undefined,
  tokenIcon: false,
  iconMargin: '',
  iconAriaHidden: true,
  iconAriaLabel: '',
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Adjust controls to experiment. Docs code hides any false/empty props.',
    },
  },
};

/**
 * Optional: a small grid to preview multiple FA icons at once.
 */
export const IconGallery = () => {
  const icons = [
    'fa-solid fa-star',
    'fa-solid fa-user',
    'fa-solid fa-bell',
    'fa-solid fa-gear',
    'fa-solid fa-house',
    'fa-solid fa-heart',
    'fa-solid fa-arrow-right',
    'fa-solid fa-check',
    'fa-solid fa-xmark',
  ];

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
  grid.style.gap = '12px';

  icons.forEach(ic => {
    const cell = document.createElement('div');
    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.alignItems = 'center';
    cell.style.gap = '8px';
    cell.appendChild(makeIcon({ icon: ic, iconSize: 24, iconAriaHidden: true }));
    const cap = document.createElement('small');
    cap.style.textAlign = 'center';
    cap.textContent = ic.replace('fa-solid ', '');
    cell.appendChild(cap);
    grid.appendChild(cell);
  });

  return grid;
};
IconGallery.parameters = {
  docs: {
    source: {
      code: [
        '<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap:12px;">',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-star" icon-size="24" icon-aria-hidden="true"></icon-component>',
        '    <small style="text-align:center;">fa-star</small>',
        '  </div>',
        '  <!-- ... -->',
        '</div>',
      ].join('\n'),
    },
    description: {
      story: 'A small gallery of icons (decorative).',
    },
  },
};

// ======================================================
// NEW: Accessibility matrix (for quick auditing)
// - default (decorative)
// - meaningful (label + not hidden)
// - invalid config (not hidden but missing label -> should fall back to decorative)
// - disabled/error/inline/horizontal: N/A for icon (still included as rows to match your standard matrix pattern)
// - prints computed role + aria-* + ids + class/style
// ======================================================

function pickAttrs(el, names) {
  const out = {};
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

function snapshotA11y(host) {
  const i = host.querySelector('i');
  return {
    host: { tag: host.tagName.toLowerCase(), id: host.getAttribute('id') || '' },
    icon: i
      ? {
          tag: 'i',
          id: i.getAttribute('id') || '',
          class: i.getAttribute('class') || '',
          style: i.getAttribute('style') || '',
          role: i.getAttribute('role') || '',
          ...pickAttrs(i, ['aria-hidden', 'aria-label']),
        }
      : null,
  };
}

function renderMatrixRow({ title, args, idSuffix }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const el = makeIcon({
    ...args,
  });
  el.id = `icon-matrix-${idSuffix}`;

  const stage = document.createElement('div');
  stage.style.display = 'flex';
  stage.style.alignItems = 'center';
  stage.style.gap = '12px';
  stage.style.maxWidth = '560px';

  // little label for the visual
  const caption = document.createElement('div');
  caption.style.fontSize = '12px';
  caption.style.color = '#444';
  caption.textContent = 'Rendered icon:';

  stage.appendChild(caption);
  stage.appendChild(el);

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role/id…';

  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  requestAnimationFrame(() => {
    pre.textContent = JSON.stringify(snapshotA11y(el), null, 2);
  });

  return wrap;
}

export const AccessibilityMatrix = () => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Prints computed <code>role</code> + <code>aria-*</code> + IDs from the rendered <code>&lt;i&gt;</code>.
      Note: layout/validation/disabled are not applicable to icons; included as placeholders to keep a consistent audit pattern.
    </div>
  `;
  root.appendChild(intro);

  const rows = [
    {
      title: 'Default (decorative)',
      args: { icon: 'fa-solid fa-star', iconAriaHidden: true, iconAriaLabel: '', iconSize: 24 },
    },
    {
      title: 'Meaningful (role="img", aria-label, aria-hidden="false")',
      args: { icon: 'fa-solid fa-circle-info', iconAriaHidden: false, iconAriaLabel: 'Information', iconSize: 24 },
    },
    {
      title: 'Invalid authoring (aria-hidden=false, missing label) → fallback to decorative',
      args: { icon: 'fa-solid fa-circle-info', iconAriaHidden: false, iconAriaLabel: '   ', iconSize: 24 },
    },
    {
      title: 'Inline (N/A placeholder)',
      args: { icon: 'fa-solid fa-user', iconAriaHidden: true, iconSize: 20, size: '' },
    },
    {
      title: 'Horizontal (N/A placeholder)',
      args: { icon: 'fa-solid fa-arrow-right', iconAriaHidden: true, iconSize: 20 },
    },
    {
      title: 'Error/Validation (N/A placeholder)',
      args: { icon: 'fa-solid fa-triangle-exclamation', iconAriaHidden: true, color: '#b91c1c', iconSize: 20 },
    },
    {
      title: 'Disabled (N/A placeholder)',
      args: { icon: 'fa-solid fa-ban', iconAriaHidden: true, color: '#6b7280', iconSize: 20 },
    },
  ];

  rows.forEach((r, idx) => root.appendChild(renderMatrixRow({ ...r, idSuffix: String(idx + 1) })));

  return root;
};
AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of key accessibility states for the icon component (decorative vs meaningful, fallback behavior). Includes placeholder rows for layout/validation/disabled to match standard audit format.',
    },
    story: { height: '1150px' },
  },
  controls: { disable: true },
};
