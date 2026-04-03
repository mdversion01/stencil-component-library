// stories/dropdown-component.stories.js

export default {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
  args: {
    alignMenuRight: false,
    autoFocusSubmenu: false,
    buttonText: 'Dropdown',
    disabled: false,
    icon: 'fa-solid fa-ellipsis-vertical',
    iconDropdown: false,
    iconSize: 16,
    id: '',
    inputId: '',
    name: '',
    value: '',
    listType: 'default',
    menuOffsetY: 0,
    outlined: false,
    ripple: false,
    shape: '',
    size: '',
    subMenuListType: 'default',
    submenuOffsetX: 0,
    tableId: 'demo-table',
    titleAttr: '',
    variant: 'default',
    withSubmenu: true,

    // ✅ NEW Storybook-only helpers for the Accessibility Matrix
    formLayout: '', // '', 'inline', 'horizontal' (Storybook layout only)
    validation: false, // Storybook-only "error/invalid" visuals wrapper
    validationMessage: 'Required field', // Storybook-only text for error block
  },
  parameters: {
    actions: {
      handles: ['itemSelected', 'items-changed', 'selection-changed'],
    },
    docs: {
      description: {
        component: [
          'Dropdown component for selecting from a list of options.',
          'Supports various list types and submenu configurations.',
          '',
        ].join('\n'),
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (src, context) => {
          const { args } = context;
          const storyName = String(context?.name ?? '').replace(/\s+/g, '');

          const DEFAULTS = {
            'align-menu-right': false,
            'auto-focus-submenu': false,
            'button-text': 'Dropdown',
            'disabled': false,
            'icon': 'fa-solid fa-ellipsis-vertical',
            'icon-dropdown': false,
            'icon-size': 16,
            'list-type': 'default',
            'menu-offset-y': 0,
            'outlined': false,
            'ripple': false,
            'shape': '',
            'size': '',
            'sub-menu-list-type': 'default',
            'submenu-offset-x': 0,
            'table-id': 'demo-table',
            'title-attr': '',
            'variant': 'default',
            'input-id': '',
            'name': '',
            'value': '',
          };

          const attrsToString = attrs =>
            Object.entries(attrs)
              .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== '')
              .map(([k, v]) => (v === true ? k : `${k}="${String(v)}"`))
              .join(' ');

          const onlyNonDefault = all => {
            const out = {};
            for (const [k, v] of Object.entries(all)) {
              if (v === undefined || v === null) continue;
              if (JSON.stringify(v) !== JSON.stringify(DEFAULTS[k])) {
                if (typeof v === 'string' && v.trim() === '') continue;
                out[k] = v;
              }
            }
            return out;
          };

          // ---- Item factories shown in docs (same as runtime) ----
          const src_baseItems = `
function baseItems() {
  return [
    { name: 'Action', value: 'action' },
    { name: 'Another action', value: 'another' },
    { name: 'Something else here', value: 'else' },
  ];
}`;
          const src_checkboxItems = `
function checkboxItems() {
  return [
    { name: 'Apples', value: 'apples', checked: true },
    { name: 'Bananas', value: 'bananas' },
    { name: 'Cherries', value: 'cherries' },
    { isDivider: true },
    { name: 'Dates', value: 'dates' },
  ];
}`;
          const src_toggleItems = `
function toggleItems() {
  return [
    { name: 'Email alerts', value: 'email', checked: true },
    { name: 'Push notifications', value: 'push' },
    { name: 'SMS', value: 'sms' },
  ];
}`;
          const src_submenuItems = `
function submenuItems(subListType = 'default') {
  return [
    {
      name: 'File',
      submenu: [
        { name: 'New', value: 'new' },
        { name: 'Open…', value: 'open' },
        { isDivider: true },
        { name: 'Recent', value: 'recent' }
      ],
    },
    {
      name: 'View',
      submenu: [
        { name: 'Zoom In', value: 'zin' },
        { name: 'Zoom Out', value: 'zout' },
        { name: 'Reset Zoom', value: 'zreset' },
      ],
    },
    {
      name: 'Filters',
      submenu: [
        { name: 'Show completed', value: 'done', customListType: subListType, checked: true },
        { name: 'Only mine', value: 'mine', customListType: subListType },
        { name: 'High priority', value: 'hi', customListType: subListType },
      ],
    },
  ];
}`;

          const makeOptionsScript = (id, factories = [], itemsExpr = '[]') => {
            const factorySrc = factories
              .map(f => (f && f.src ? f.src.trim() : ''))
              .filter(Boolean)
              .join('\n\n  ');

            return [
              '<script>',
              '  // ---- JavaScript used in this example ----',
              '  // Factory functions that create the dropdown items:',
              factorySrc ? '  ' + factorySrc.replace(/\n/g, '\n  ') : '  // (no factories needed for this example)',
              '',
              '  // Helper: clone array (preserve object identity immutably)',
              '  const cloneItems = (arr) => (Array.isArray(arr) ? arr.map(i => ({ ...i })) : []);',
              '',
              `  (function setup_${id.replace(/[^a-z0-9_]/gi, '_')}(){`,
              `    const el = document.getElementById('${id}');`,
              '    if (!el) return;',
              `    const initialItems = ${itemsExpr};`,
              '    el.options = cloneItems(initialItems);',
              '',
              '    // Keep the component’s internal state mirrored back to the prop',
              '    el.addEventListener("items-changed", (e) => {',
              '      el.options = cloneItems(e?.detail?.items || []);',
              '    });',
              '',
              '    // Example logging',
              '    el.addEventListener("itemSelected", (e) => console.log("[itemSelected]", e.detail));',
              '    el.addEventListener("selection-changed", (e) => console.log("[selection-changed]", e.detail));',
              '  })();',
              '</script>',
            ].join('\n');
          };

          // Default docs example should reflect current args (non-defaults)
          const baseAttrs = onlyNonDefault({
            id: args.id || '',
            'align-menu-right': !!args.alignMenuRight,
            'auto-focus-submenu': !!args.autoFocusSubmenu,
            'button-text': args.buttonText,
            'disabled': !!args.disabled,
            'icon-dropdown': !!args.iconDropdown,
            icon: args.icon,
            'icon-size': typeof args.iconSize === 'number' ? args.iconSize : DEFAULTS['icon-size'],
            outlined: !!args.outlined,
            ripple: !!args.ripple,
            shape: args.shape,
            size: args.size,
            variant: args.variant,
            'list-type': args.listType,
            'sub-menu-list-type': args.subMenuListType,
            'menu-offset-y': args.menuOffsetY,
            'submenu-offset-x': args.submenuOffsetX,
            'table-id': args.tableId,
            'title-attr': args.titleAttr,
            'input-id': args.inputId,
            name: args.name,
            value: args.value,
          });

          switch (storyName) {
            case 'Basic': {
              const id = 'dropdown-basic';
              const attrs = onlyNonDefault({ ...baseAttrs, id, variant: 'primary' });
              const html = `<dropdown-component ${attrsToString(attrs)}></dropdown-component>`;
              const js = makeOptionsScript(id, [{ name: 'baseItems', src: src_baseItems }], 'baseItems()');
              return `${html}\n\n${js}`;
            }

            case 'RightAligned': {
              const id = 'ddRightAlign';
              const attrs = onlyNonDefault({ ...baseAttrs, id, 'align-menu-right': true, variant: 'primary' });
              const html = [
                `<!-- Layout container is Storybook-only -->`,
                `<div style="padding-left: 40px; box-sizing: border-box; min-height: 220px;">`,
                `  <dropdown-component ${attrsToString(attrs)}></dropdown-component>`,
                `</div>`,
              ].join('\n');
              const js = makeOptionsScript(id, [{ name: 'baseItems', src: src_baseItems }], 'baseItems()');
              return `${html}\n\n${js}`;
            }

            case 'WithSubmenu': {
              const leftId = 'dropdown-submenu-left';
              const rightId = 'dropdown-submenu-right';

              const attrsLeft = onlyNonDefault({
                ...baseAttrs,
                id: leftId,
                variant: 'secondary',
              });

              const attrsRight = onlyNonDefault({
                ...baseAttrs,
                id: rightId,
                variant: 'secondary',
                'align-menu-right': true,
              });

              const subType = JSON.stringify(args.subMenuListType || 'default');

              const html = [
                `<!-- Side-by-side preview is Storybook-only -->`,
                `<div style="display:flex; gap:24px; align-items:center">`,
                `  <div>`,
                `    <div style="font-size:12px;color:#666;margin-bottom:8px;">Default (submenus open to the right)</div>`,
                `    <dropdown-component ${attrsToString(attrsLeft)}></dropdown-component>`,
                `  </div>`,
                `  <div>`,
                `    <div style="font-size:12px;color:#666;margin-bottom:8px;">Right-aligned (submenus open to the left)</div>`,
                `    <dropdown-component ${attrsToString(attrsRight)}></dropdown-component>`,
                `  </div>`,
                `</div>`,
              ].join('\n');

              const itemsExpr = `[
  ...baseItems(),
  { isDivider: true },
  ...submenuItems(${subType})
]`;

              const factories = [
                { name: 'baseItems', src: src_baseItems },
                { name: 'submenuItems', src: src_submenuItems },
              ];

              const jsLeft = makeOptionsScript(leftId, factories, itemsExpr);
              const jsRight = makeOptionsScript(rightId, factories, itemsExpr);

              return [html, jsLeft, jsRight].join('\n\n');
            }

            case 'IconOnly': {
              const id = 'dropdown-icon';
              const attrs = onlyNonDefault({
                ...baseAttrs,
                id,
                'icon-dropdown': true,
                'title-attr': 'More actions',
                icon: args.icon ?? DEFAULTS.icon,
                'icon-size': typeof args.iconSize === 'number' ? args.iconSize : DEFAULTS['icon-size'],
                variant: 'primary',
              });
              const html = `<dropdown-component ${attrsToString(attrs)}></dropdown-component>`;
              const js = makeOptionsScript(id, [{ name: 'baseItems', src: src_baseItems }], 'baseItems()');
              return `${html}\n\n${js}`;
            }

            case 'CheckboxVariants': {
              const idLeft = 'dropdown-checkboxes';
              const idRight = 'dropdown-custom-checkboxes';

              const attrsLeft = onlyNonDefault({
                ...baseAttrs,
                id: idLeft,
                'list-type': 'checkboxes',
                variant: 'secondary',
              });

              const attrsRight = onlyNonDefault({
                ...baseAttrs,
                id: idRight,
                'list-type': 'customCheckboxes',
                variant: 'secondary',
              });

              const html = [
                `<!-- Side-by-side preview is Storybook-only -->`,
                `<div style="display:flex; gap:24px; align-items:center">`,
                `  <div>`,
                `    <div style="font-size:12px;color:#666;margin-bottom:8px;">Standard checkboxes</div>`,
                `    <dropdown-component ${attrsToString(attrsLeft)}></dropdown-component>`,
                `  </div>`,
                `  <div>`,
                `    <div style="font-size:12px;color:#666;margin-bottom:8px;">Custom checkboxes</div>`,
                `    <dropdown-component ${attrsToString(attrsRight)}></dropdown-component>`,
                `  </div>`,
                `</div>`,
              ].join('\n');

              const factories = [{ name: 'checkboxItems', src: src_checkboxItems }];
              const itemsExpr = 'checkboxItems()';

              const jsLeft = makeOptionsScript(idLeft, factories, itemsExpr);
              const jsRight = makeOptionsScript(idRight, factories, itemsExpr);

              return [html, jsLeft, jsRight].join('\n\n');
            }

            case 'ToggleSwitches': {
              const id = 'dropdown-toggles';
              const attrs = onlyNonDefault({ ...baseAttrs, id, 'list-type': 'toggleSwitches', variant: 'secondary' });
              const html = `<dropdown-component ${attrsToString(attrs)}></dropdown-component>`;
              const js = makeOptionsScript(id, [{ name: 'toggleItems', src: src_toggleItems }], 'toggleItems()');
              return `${html}\n\n${js}`;
            }

            case 'Sizes': {
              const sm = { id: 'dropdown-size-sm', attrs: onlyNonDefault({ ...baseAttrs, id: 'dropdown-size-sm', 'button-text': 'Small', size: 'sm', variant: 'primary' }) };
              const md = { id: 'dropdown-size-md', attrs: onlyNonDefault({ ...baseAttrs, id: 'dropdown-size-md', 'button-text': 'Default', variant: 'primary' }) };
              const lg = { id: 'dropdown-size-lg', attrs: onlyNonDefault({ ...baseAttrs, id: 'dropdown-size-lg', 'button-text': 'Large', size: 'lg', variant: 'primary' }) };

              const html = [
                `<!-- Three side-by-side buttons (Storybook-only layout) -->`,
                `<div style="display:flex; gap:12px; align-items:center">`,
                `  <dropdown-component ${attrsToString(sm.attrs)}></dropdown-component>`,
                `  <dropdown-component ${attrsToString(md.attrs)}></dropdown-component>`,
                `  <dropdown-component ${attrsToString(lg.attrs)}></dropdown-component>`,
                `</div>`,
              ].join('\n');

              const factories = [{ name: 'baseItems', src: src_baseItems }];
              const jsSm = makeOptionsScript(sm.id, factories, 'baseItems()');
              const jsMd = makeOptionsScript(md.id, factories, 'baseItems()');
              const jsLg = makeOptionsScript(lg.id, factories, 'baseItems()');

              return [html, jsSm, jsMd, jsLg].join('\n\n');
            }

            case 'AccessibilityMatrix': {
              // Keep docs code lightweight for matrix
              return `<!-- See the Canvas for the live Accessibility Matrix output -->\n<div>(Accessibility Matrix)</div>`;
            }

            default:
              return src;
          }
        },
      },
    },
  },
  argTypes: {
    /* -----------------------------
   Behavior
  ------------------------------ */
    alignMenuRight: {
      control: 'boolean',
      description: 'Align the dropdown menu to the right edge of the button',
      name: 'align-menu-right',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },
    autoFocusSubmenu: {
      control: 'boolean',
      description: 'Automatically focus the first submenu item when a submenu is opened',
      name: 'auto-focus-submenu',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the dropdown',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },
    menuOffsetY: {
      control: 'number',
      description: 'Vertical offset for the dropdown menu in pixels',
      name: 'menu-offset-y',
      table: { category: 'Behavior' },
    },
    submenuOffsetX: {
      control: 'number',
      description: 'Horizontal offset for submenus in pixels',
      name: 'submenu-offset-x',
      table: { category: 'Behavior' },
    },

    /* -----------------------------
   Trigger Button
  ------------------------------ */
    buttonText: {
      control: 'text',
      description: 'Text label for the dropdown trigger button',
      name: 'button-text',
      table: { category: 'Trigger Button' },
    },
    outlined: {
      control: 'boolean',
      description: 'Use outlined button style',
      table: { category: 'Trigger Button', defaultValue: { summary: false } },
    },
    ripple: {
      control: 'boolean',
      description: 'Enable ripple effect on the dropdown button',
      table: { category: 'Trigger Button', defaultValue: { summary: false } },
    },
    shape: {
      control: { type: 'select' },
      options: ['', 'square', 'pill', 'circle'],
      description: 'Shape of the dropdown button',
      table: { category: 'Trigger Button' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'xs', 'sm', 'lg', 'plumage-size'],
      description:
        'Sets the size of the button, e.g., extra small (xs), small (sm), large (lg), or plumage-size. If not set, default size is used.',
      table: { category: 'Trigger Button' },
    },
    titleAttr: {
      control: 'text',
      description: 'Title attribute for the dropdown button (used for accessibility and tooltips)',
      name: 'title-attr',
      table: { category: 'Trigger Button' },
    },

    /* -----------------------------
   Icon
  ------------------------------ */
    iconDropdown: {
      control: 'boolean',
      description: 'Use an icon-only trigger',
      name: 'icon-dropdown',
      table: { category: 'Icon', defaultValue: { summary: false } },
    },
    icon: {
      control: 'text',
      description: 'Icon class for the dropdown trigger button (e.g., FontAwesome classes)',
      table: { category: 'Icon' },
    },
    iconSize: {
      control: 'number',
      description: 'Size of the icon in pixels',
      name: 'icon-size',
      table: { category: 'Icon' },
    },

    /* -----------------------------
   Items & Lists
  ------------------------------ */
    listType: {
      control: { type: 'select' },
      options: ['default', 'checkboxes', 'customCheckboxes', 'toggleSwitches'],
      description: 'Type of list to display in the dropdown',
      name: 'list-type',
      table: { category: 'Items & Lists' },
    },
    subMenuListType: {
      control: { type: 'select' },
      options: ['default', 'checkboxes', 'customCheckboxes', 'toggleSwitches'],
      description: 'Type of list to use in submenus',
      name: 'sub-menu-list-type',
      table: { category: 'Items & Lists' },
    },

    /* -----------------------------
   Forms
  ------------------------------ */
    inputId: {
      control: 'text',
      description: 'ID attribute for the hidden input element',
      name: 'input-id',
      table: { category: 'Forms' },
    },
    name: {
      control: 'text',
      description: 'Name attribute for the hidden input element',
      table: { category: 'Forms' },
    },
    value: {
      control: 'text',
      description: 'Value attribute for the hidden input element',
      table: { category: 'Forms' },
    },

    /* -----------------------------
   Integration
  ------------------------------ */
    id: {
      control: 'text',
      description:
        'ID attribute for the dropdown component to uniquely identify it and use with other elements or scripts, such as labels or JavaScript',
      name: 'id',
      table: { category: 'Integration' },
    },
    tableId: {
      control: 'text',
      description: 'ID of the table to associate with for table-specific actions. Use with table-component.',
      name: 'table-id',
      table: { category: 'Integration' },
    },

    /* -----------------------------
   Appearance
  ------------------------------ */
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'danger'],
      description: 'Variant style of the dropdown button',
      table: { category: 'Appearance' },
    },

    /* -----------------------------
   Storybook-only (Accessibility Matrix helpers)
  ------------------------------ */
    formLayout: {
      control: { type: 'select' },
      options: ['', 'inline', 'horizontal'],
      description: 'Storybook-only layout wrapper for matrix (does not affect component).',
      table: { category: 'Storybook Only', disable: true },
    },
    validation: {
      control: 'boolean',
      description: 'Storybook-only invalid wrapper for matrix (does not affect component).',
      table: { category: 'Storybook Only', disable: true },
    },
    validationMessage: {
      control: 'text',
      description: 'Storybook-only message shown in invalid wrapper for matrix.',
      table: { category: 'Storybook Only', disable: true },
    },

    /* -----------------------------
   Storybook Only / Internal
  ------------------------------ */
    withSubmenu: {
      control: 'boolean',
      table: { category: 'Storybook Only', disable: true },
      description: 'Internal helper to include submenu items in the dropdown',
      name: 'with-submenu',
    },
  },
};

/** ---------- Runtime Helpers (used by the actual stories) ---------- */

const slug = s =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const withIds = (items, prefix = 'dd') =>
  (items || []).map((it, i) => {
    const key = it.value ?? it.name ?? i;
    const inputId = it.inputId || `${prefix}-input-${slug(key)}`;
    return { ...it, inputId };
  });

const baseItems = () => [
  { name: 'Action', value: 'action' },
  { name: 'Another action', value: 'another' },
  { name: 'Something else here', value: 'else' },
];

const checkboxItems = () => [
  { name: 'Apples', value: 'apples', checked: true },
  { name: 'Bananas', value: 'bananas' },
  { name: 'Cherries', value: 'cherries' },
  { isDivider: true },
  { name: 'Dates', value: 'dates' },
];

const toggleItems = () => [
  { name: 'Email alerts', value: 'email', checked: true },
  { name: 'Push notifications', value: 'push' },
  { name: 'SMS', value: 'sms' },
];

const submenuItems = (subListType = 'default') => [
  {
    name: 'File',
    submenu: [
      { name: 'New', value: 'new' },
      { name: 'Open…', value: 'open' },
      { isDivider: true },
      { name: 'Recent', value: 'recent' },
    ],
  },
  {
    name: 'View',
    submenu: [
      { name: 'Zoom In', value: 'zin' },
      { name: 'Zoom Out', value: 'zout' },
      { name: 'Reset Zoom', value: 'zreset' },
    ],
  },
  {
    name: 'Filters',
    submenu: [
      { name: 'Show completed', value: 'done', customListType: subListType, checked: true },
      { name: 'Only mine', value: 'mine', customListType: subListType },
      { name: 'High priority', value: 'hi', customListType: subListType },
    ],
  },
];

/** ---------- Element Builder (with stable IDs) ---------- */
function buildDropdown(args, items, idPrefix = 'dd') {
  const el = document.createElement('dropdown-component');

  if (args.id) el.id = String(args.id);

  el.buttonText = args.buttonText;
  el.disabled = args.disabled;
  el.iconDropdown = args.iconDropdown;
  el.icon = args.icon;
  if (typeof args.iconSize === 'number') el.iconSize = args.iconSize;
  el.alignMenuRight = args.alignMenuRight;
  el.shape = args.shape;
  el.size = args.size;
  el.outlined = args.outlined;
  el.ripple = args.ripple;
  el.variant = args.variant;
  el.listType = args.listType;
  el.subMenuListType = args.subMenuListType;
  el.autoFocusSubmenu = args.autoFocusSubmenu;
  el.menuOffsetY = args.menuOffsetY;
  el.submenuOffsetX = args.submenuOffsetX;
  el.titleAttr = args.titleAttr;
  el.tableId = args.tableId;
  el.inputId = args.inputId;
  el.name = args.name;
  el.value = args.value;

  const itemsWithIds = withIds(items, idPrefix);
  el.options = itemsWithIds.map(i => ({ ...i }));

  el.addEventListener('itemSelected', e => console.log('[itemSelected]', e.detail));
  el.addEventListener('selection-changed', e => console.log('[selection-changed]', e.detail));
  el.addEventListener('items-changed', e => {
    const next = (e?.detail?.items || []).map(i => ({ ...i }));
    el.options = next;
  });

  return el;
}

/** ---------- Templates ---------- */

const BasicTemplate = args => {
  const id = args.id || 'dropdown-basic';
  return buildDropdown({ ...args, id }, baseItems());
};

/** ---------- Stories ---------- */

export const Basic = BasicTemplate.bind({});
Basic.args = {
  id: 'dropdown-basic',
  variant: 'primary',
};
Basic.parameters = {
  docs: {
    description: { story: 'A basic dropdown with default settings.' },
    story: { height: '220px' },
  },
};

export const RightAligned = BasicTemplate.bind({});
RightAligned.args = {
  id: 'ddRightAlign',
  alignMenuRight: true,
  variant: 'primary',
};
RightAligned.decorators = [
  Story => {
    const wrap = document.createElement('div');
    wrap.style.paddingLeft = '40px';
    wrap.style.boxSizing = 'border-box';
    wrap.style.minHeight = '220px';
    const node = Story();
    wrap.appendChild(node);
    return wrap;
  },
];
RightAligned.parameters = {
  docs: {
    story: { height: '220px' },
    description: { story: 'A right-aligned dropdown (menu opens to the left).' },
  },
};

export const WithSubmenu = args => {
  const items = [...baseItems(), { isDivider: true }, ...submenuItems(args.subMenuListType || 'default')];

  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.gap = '24px';
  wrap.style.alignItems = 'center';

  const left = buildDropdown(
    { ...args, id: 'dropdown-submenu-left', withSubmenu: true, alignMenuRight: false, variant: 'secondary' },
    items,
    'dd-sub-left',
  );

  const right = buildDropdown(
    { ...args, id: 'dropdown-submenu-right', withSubmenu: true, alignMenuRight: true, variant: 'secondary' },
    items,
    'dd-sub-right',
  );

  const label = text => {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.fontSize = '12px';
    el.style.color = '#666';
    el.style.marginBottom = '8px';
    return el;
  };

  const leftWrap = document.createElement('div');
  leftWrap.append(label('Default (submenus open to the right)'), left);

  const rightWrap = document.createElement('div');
  rightWrap.append(label('Right-aligned (submenus open to the left)'), right);

  wrap.append(leftWrap, rightWrap);
  return wrap;
};
WithSubmenu.args = {
  withSubmenu: true,
  variant: 'secondary',
  id: 'dropdown-submenu',
};
WithSubmenu.parameters = {
  docs: {
    story: { height: '260px' },
    description: { story: 'Dropdown with submenu items. Two examples shown: default (left) and right-aligned (right).' },
  },
};

export const IconOnly = args =>
  buildDropdown({ ...args, id: 'dropdown-icon', iconDropdown: true, buttonText: '', titleAttr: 'More actions' }, baseItems(), 'dd-icon');
IconOnly.args = {
  icon: 'fa-solid fa-ellipsis-vertical',
  iconSize: 18,
  variant: 'primary',
};
IconOnly.parameters = {
  docs: {
    story: { height: '220px' },
    description: { story: 'Dropdown using an icon-only trigger button.' },
  },
};

export const CheckboxVariants = args => {
  const items = checkboxItems();

  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.gap = '24px';
  wrap.style.alignItems = 'center';

  const left = buildDropdown({ ...args, id: 'dropdown-checkboxes', variant: 'secondary', listType: 'checkboxes', withSubmenu: false }, items, 'dd-chk');

  const right = buildDropdown(
    { ...args, id: 'dropdown-custom-checkboxes', variant: 'secondary', listType: 'customCheckboxes', withSubmenu: false },
    items,
    'dd-cchk',
  );

  const label = text => {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.fontSize = '12px';
    el.style.color = '#666';
    el.style.marginBottom = '8px';
    return el;
  };

  const leftWrap = document.createElement('div');
  leftWrap.append(label('Standard checkboxes'), left);

  const rightWrap = document.createElement('div');
  rightWrap.append(label('Custom checkboxes'), right);

  wrap.append(leftWrap, rightWrap);
  return wrap;
};
CheckboxVariants.args = {};
CheckboxVariants.parameters = {
  docs: {
    story: { height: '260px' },
    description: { story: 'Dropdown with checkbox items. Two examples shown: standard and custom checkboxes.' },
  },
};

export const ToggleSwitches = args =>
  buildDropdown({ ...args, id: 'dropdown-toggles', variant: 'secondary', listType: 'toggleSwitches', withSubmenu: false }, toggleItems(), 'dd-tgsw');
ToggleSwitches.args = {};
ToggleSwitches.parameters = {
  docs: { story: { height: '220px' }, description: { story: 'Dropdown with toggle switch items.' } },
};

export const Sizes = args => {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.gap = '12px';
  wrap.style.alignItems = 'center';

  const sm = buildDropdown({ ...args, id: 'dropdown-size-sm', size: 'sm', variant: 'primary', buttonText: 'Small' }, baseItems(), 'dd-size-sm');
  const md = buildDropdown({ ...args, id: 'dropdown-size-md', size: '', variant: 'primary', buttonText: 'Default' }, baseItems(), 'dd-size-md');
  const lg = buildDropdown({ ...args, id: 'dropdown-size-lg', size: 'lg', variant: 'primary', buttonText: 'Large' }, baseItems(), 'dd-size-lg');

  wrap.append(sm, md, lg);
  return wrap;
};
Sizes.args = {};
Sizes.parameters = {
  docs: {
    story: { height: '220px' },
    description: { story: 'Dropdown examples in different button sizes: small, default, and large.' },
  },
};

// ======================================================
// NEW: Accessibility Matrix story
// - default / inline / horizontal (storybook wrappers)
// - error/validation (storybook wrapper)
// - disabled
// - prints computed role + aria-* + ids (trigger + menu + first item)
// ======================================================

const pickAttrs = (el, names) => {
  const out = {};
  if (!el) return out;
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
};

const snapshotA11y = host => {
  const triggerRoot = host.querySelector('[id$="-toggle-button"]');
  const innerButton = triggerRoot?.querySelector('button');
  const menu = host.querySelector('.dropdown-menu');
  const firstItem = host.querySelector('.dropdown-item');

  const triggerId = triggerRoot?.getAttribute('id') || '';
  const menuId = menu?.getAttribute('id') || '';
  const labelledby = menu?.getAttribute('aria-labelledby') || '';
  const labelledbyResolves = labelledby ? !!host.querySelector(`#${CSS?.escape ? CSS.escape(labelledby) : labelledby}`) : null;

  return {
    host: {
      tag: host.tagName.toLowerCase(),
      id: host.getAttribute('id') || '',
    },
    triggerRoot: triggerRoot
      ? {
          tag: triggerRoot.tagName.toLowerCase(),
          id: triggerId,
        }
      : null,
    triggerButton: innerButton
      ? {
          tag: innerButton.tagName.toLowerCase(),
          id: innerButton.getAttribute('id') || '',
          ...pickAttrs(innerButton, ['aria-haspopup', 'aria-expanded', 'aria-controls', 'disabled', 'title']),
        }
      : null,
    menu: menu
      ? {
          tag: menu.tagName.toLowerCase(),
          id: menuId,
          role: menu.getAttribute('role') || '',
          class: menu.className,
          ...pickAttrs(menu, ['aria-labelledby', 'aria-activedescendant', 'aria-owns', 'tabindex']),
          resolves: {
            'aria-labelledby': labelledbyResolves,
          },
        }
      : null,
    firstItem: firstItem
      ? {
          tag: firstItem.tagName.toLowerCase(),
          id: firstItem.getAttribute('id') || '',
          role: firstItem.getAttribute('role') || '',
          tabIndex: firstItem.getAttribute('tabindex') || '',
          class: firstItem.className,
        }
      : null,
  };
};

function buildCard({ title, layout = '', invalid = false, invalidText = '', args, idSuffix }) {
  const wrapper = document.createElement('div');
  wrapper.style.border = '1px solid #e5e7eb';
  wrapper.style.borderRadius = '12px';
  wrapper.style.padding = '12px';
  wrapper.style.background = 'white';
  wrapper.style.display = 'grid';
  wrapper.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const row = document.createElement('div');

  // Storybook-only layout wrappers
  if (layout === 'inline') {
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '12px';
  } else if (layout === 'horizontal') {
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '160px 1fr';
    row.style.alignItems = 'center';
    row.style.gap = '12px';
  }

  const label = document.createElement('div');
  label.textContent = layout === 'horizontal' ? 'Label' : '';
  label.style.fontWeight = '600';
  label.style.fontSize = '13px';
  label.style.display = layout === 'horizontal' ? 'block' : 'none';

  const stage = document.createElement('div');
  stage.style.maxWidth = '560px';

  const host = buildDropdown(
    {
      ...args,
      id: `dropdown-matrix-${idSuffix}`,
    },
    baseItems(),
    `dd-matrix-${idSuffix}`,
  );

  stage.appendChild(host);

  // Storybook-only validation message
  let validationEl = null;
  if (invalid) {
    validationEl = document.createElement('div');
    validationEl.style.marginTop = '8px';
    validationEl.style.color = '#b91c1c';
    validationEl.style.fontSize = '12px';
    validationEl.style.fontWeight = '600';
    validationEl.textContent = invalidText || 'Required field';
    stage.appendChild(validationEl);
  }

  if (layout === 'horizontal') row.append(label, stage);
  else row.append(stage);

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role/id…';

  wrapper.append(heading, row, pre);

  const update = () => {
    const snap = snapshotA11y(host);
    pre.textContent = JSON.stringify(
      {
        ...snap,
        storybookOnly: {
          layout,
          invalid,
          validationText: validationEl ? validationEl.textContent : null,
        },
      },
      null,
      2,
    );
  };

  // Defer until Stencil hydrates internal ids (componentId)
  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrapper;
}

export const AccessibilityMatrix = args => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + IDs from the light DOM.
      (Layout + validation are Storybook-only wrappers; the component output is unchanged.)
    </div>
  `;
  root.appendChild(intro);

  const cases = [
    {
      title: 'Default (valid)',
      layout: '',
      invalid: false,
      args: { ...args, disabled: false, iconDropdown: false, alignMenuRight: false },
    },
    {
      title: 'Inline wrapper (valid)',
      layout: 'inline',
      invalid: false,
      args: { ...args, disabled: false, iconDropdown: false, alignMenuRight: false },
    },
    {
      title: 'Horizontal wrapper (valid)',
      layout: 'horizontal',
      invalid: false,
      args: { ...args, disabled: false, iconDropdown: false, alignMenuRight: false },
    },
    {
      title: 'Error / validation wrapper (storybook-only)',
      layout: '',
      invalid: true,
      invalidText: args.validationMessage || 'Required field',
      args: { ...args, disabled: false, iconDropdown: false, alignMenuRight: false },
    },
    {
      title: 'Disabled',
      layout: '',
      invalid: false,
      args: { ...args, disabled: true },
    },
  ];

  cases.forEach((c, i) => {
    root.appendChild(
      buildCard({
        title: c.title,
        layout: c.layout,
        invalid: c.invalid,
        invalidText: c.invalidText,
        args: c.args,
        idSuffix: String(i + 1),
      }),
    );
  });

  return root;
};

AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of common states (default/inline/horizontal wrappers, error/validation wrapper, disabled) and a live readout of key roles, aria-* attributes, and ids to help verify 508/ARIA compliance.',
    },
    story: { height: '1150px' },
  },
  controls: { disable: true },
};
