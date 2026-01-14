// stories/icon-component.stories.js

import { FALSE } from "sass";

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

          // Defaults used by <icon-component> stories (for reference only)
          const DEFAULTS = {
            color: '',
            icon: 'fa-solid fa-star',
            iconAriaHidden: false,
            iconAriaLabel: '',
            iconMargin: '',
            iconSize: undefined,
            size: '',
            tokenIcon: false,
          };

          // camelCase -> kebab-case
          const toAttr = (k) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

          // Serialize props -> HTML attributes
          // RULE: if a prop is false or "", do NOT print it.
          // - Booleans: print presence-only when true; omit when false
          // - Strings: omit when empty
          // - Numbers: print when not undefined
          const attrsToString = (props) =>
            Object.entries(props)
              .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
              .map(([k, v]) => {
                const attr = toAttr(k);
                if (v === true) return attr; // presence-only for true booleans
                return `${attr}="${String(v)}"`;
              })
              .join(' ');

          const iconTag = (props = {}) => `<icon-component ${attrsToString(props)}></icon-component>`;
          const wrap = (inner, style) => `<div style="${style}">\n  ${inner}\n</div>`;

          switch (storyName) {
            case 'Basic': {
              // Print ONLY props actually used (after filtering) so false/"" are omitted
              const used = {
                icon: args?.icon,
                size: args?.size,
                color: args?.color,
                iconSize: args?.iconSize,
                tokenIcon: !!args?.tokenIcon,
                iconMargin: args?.iconMargin,
                iconAriaHidden: args?.iconAriaHidden, // will be omitted if false per rule
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
              const html = items
                .map(({ comment, props }) => `<!-- ${comment} -->\n${iconTag(props)}`)
                .join('\n');
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
          'The <icon-component> renders Font Awesome / Material Design icons by class name. It supports size, color, accessibility, and margin props.',
      },
    },
  },
  argTypes: {
    color: { control: 'color', description: 'Adds inline color style' },
    icon: {
      control: 'text',
      description:
        'Add icon class string (e.g., "fa-solid fa-user"). Uses either Font Awesome or Material Design Icons',
    },
    iconAriaHidden: {
      control: 'boolean',
      description: 'Whether the icon is hidden from assistive tech (aria-hidden)',
    },
    iconAriaLabel: { control: 'text', description: 'Accessible label (sets aria-label)' },
    iconMargin: {
      control: { type: 'select' },
      options: ['', 'left', 'right'],
      description: 'Applies spacing utility (ms-1 or me-1)',
    },
    iconSize: { control: 'number', description: 'Inline font-size in px' },
    size: {
      control: 'text',
      description: 'Extra size class (e.g., "fa-lg", "fa-2x", or a custom utility)',
    },
    tokenIcon: { control: 'boolean', description: 'Adds "token-icon" class' },
  },
  args: {
    color: '',
    icon: 'fa-solid fa-star',
    iconAriaHidden: false,
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
  if (args.tokenIcon === true) el.setAttribute('token-icon', ''); // presence-only when true
  if (typeof args.iconSize === 'number') el.setAttribute('icon-size', String(args.iconSize));
  if (args.color) el.setAttribute('color', String(args.color));
  if (args.iconAriaLabel) el.setAttribute('icon-aria-label', String(args.iconAriaLabel));
  // Do NOT print icon-aria-hidden when false per rule (still set property above)

  return el;
};

const Template = (args) => makeIcon(args);

/** ------------ Stories ------------ */

export const Basic = Template.bind({});
Basic.args = {
  icon: 'fa-solid fa-star',
};
Basic.parameters = {
  docs: {
    description: {
      story:
        'Basic icon. Docs code omits any props that are false or empty strings.',
    },
  },
};

export const Sizes = () => {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.gap = '16px';
  [
    { label: 'Default', props: { icon: 'fa-solid fa-user' } },
    { label: 'fa-lg', props: { icon: 'fa-solid fa-user', size: 'fa-lg' } },
    { label: 'fa-2x', props: { icon: 'fa-solid fa-user', size: 'fa-2x' } },
    { label: 'inline 28px', props: { icon: 'fa-solid fa-user', iconSize: 28 } },
    { label: 'inline 40px', props: { icon: 'fa-solid fa-user', iconSize: 40 } },
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
      story:
        'Examples using FA size classes (`size`) and inline pixel sizing (`iconSize`).',
    },
  },
};

export const WithColor = () => {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '16px';
  container.append(
    makeIcon({ icon: 'fa-solid fa-heart', color: '#ef4444', iconSize: 28 }),
    makeIcon({ icon: 'fa-solid fa-bolt', color: '#f59e0b', iconSize: 28 }),
    makeIcon({ icon: 'fa-solid fa-leaf', color: '#10b981', iconSize: 28 }),
    makeIcon({ icon: 'fa-solid fa-water', color: '#3b82f6', iconSize: 28 }),
  );
  return container;
};
WithColor.parameters = {
  docs: {
    source: {
      code: [
        '<div style="display:flex; gap:16px;">',
        '  <icon-component icon="fa-solid fa-heart" color="#ef4444" icon-size="28"></icon-component>',
        '  <icon-component icon="fa-solid fa-bolt"  color="#f59e0b" icon-size="28"></icon-component>',
        '  <icon-component icon="fa-solid fa-leaf"  color="#10b981" icon-size="28"></icon-component>',
        '  <icon-component icon="fa-solid fa-water" color="#3b82f6" icon-size="28"></icon-component>',
        '</div>',
      ].join('\n'),
    },
    description: {
      story: 'Colored icons with inline pixel sizing.',
    },
  },
};

export const TokenIcon = Template.bind({});
TokenIcon.args = {
  icon: 'fa-solid fa-shield',
  tokenIcon: true,
  iconSize: 10,
  color: '#0ea5e9',
};
TokenIcon.parameters = {
  docs: {
    source: {
      // presence-only for token-icon; omit anything false/empty
      code:
        '<icon-component icon="fa-solid fa-shield" color="#0ea5e9" icon-size="10" token-icon></icon-component>',
    },
    description: {
      story:
        'Token-style icon (adds "token-icon" class) with custom color and size.',
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
  left.appendChild(makeIcon({ icon: 'fa-solid fa-circle-info', iconMargin: 'left' }));

  const right = document.createElement('span');
  right.appendChild(makeIcon({ icon: 'fa-solid fa-circle-info', iconMargin: 'right' }));
  right.appendChild(document.createTextNode('Right margin'));

  row.append(left, right);
  return row;
};
Margins.parameters = {
  docs: {
    description: {
      story:
        'Apply left/right spacing via `iconMargin`.',
    },
  },
};

export const AccessibleLabel = Template.bind({});
AccessibleLabel.args = {
  icon: 'fa-solid fa-bell',
  iconAriaHidden: false, // property set for runtime behavior
  iconAriaLabel: 'Notifications',
  iconSize: 24,
};
AccessibleLabel.parameters = {
  docs: {
    source: {
      // Per rule, do NOT print false props — so aria-hidden="false" is omitted.
      code:
        '<icon-component icon="fa-solid fa-bell" icon-aria-label="Notifications" icon-size="24"></icon-component>',
    },
    description: {
      story:
        'Accessible icon with label. (Docs omit false props per rule.)',
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
      story:
        'Adjust controls to experiment. Docs code hides any false/empty props.',
    },
  },
};

/**
 * Optional: a small grid to preview multiple FA icons at once.
 * Adjust icon class names to match your icon set.
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

  icons.forEach((ic) => {
    const cell = document.createElement('div');
    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.alignItems = 'center';
    cell.style.gap = '8px';
    cell.appendChild(makeIcon({ icon: ic, iconSize: 24 }));
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
        '    <icon-component icon="fa-solid fa-star" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-star</small>',
        '  </div>',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-user" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-user</small>',
        '  </div>',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-bell" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-bell</small>',
        '  </div>',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-gear" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-gear</small>',
        '  </div>',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-house" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-house</small>',
        '  </div>',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-heart" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-heart</small>',
        '  </div>',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-arrow-right" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-arrow-right</small>',
        '  </div>',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-check" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-check</small>',
        '  </div>',
        '  <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">',
        '    <icon-component icon="fa-solid fa-xmark" icon-size="24"></icon-component>',
        '    <small style="text-align:center;">fa-xmark</small>',
        '  </div>',
        '</div>',
      ].join('\n'),
    },
    description: {
      story: 'A small gallery of icons. Docs code omits any false/empty props.',
    },
  },
};
