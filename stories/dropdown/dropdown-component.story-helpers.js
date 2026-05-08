// File: src/stories/dropdown-component/dropdown-component.story-helpers.js

export const DEFAULTS = {
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

export const normalize = (txt) => {
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

export const attrsToString = (attrs) =>
  Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== '')
    .map(([k, v]) => (v === true ? k : `${k}="${String(v)}"`))
    .join(' ');

export const onlyNonDefault = (all) => {
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

export const slug = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const withIds = (items, prefix = 'dd') =>
  (items || []).map((it, i) => {
    const key = it.value ?? it.name ?? i;
    const inputId = it.inputId || `${prefix}-input-${slug(key)}`;
    return { ...it, inputId };
  });

export const baseItems = () => [
  { name: 'Action', value: 'action' },
  { name: 'Another action', value: 'another' },
  { name: 'Something else here', value: 'else' },
];

export const checkboxItems = () => [
  { name: 'Apples', value: 'apples', checked: true },
  { name: 'Bananas', value: 'bananas' },
  { name: 'Cherries', value: 'cherries' },
  { isDivider: true },
  { name: 'Dates', value: 'dates' },
];

export const toggleItems = () => [
  { name: 'Email alerts', value: 'email', checked: true },
  { name: 'Push notifications', value: 'push' },
  { name: 'SMS', value: 'sms' },
];

export const submenuItems = (subListType = 'default') => [
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

export const src_baseItems = `
function baseItems() {
  return [
    { name: 'Action', value: 'action' },
    { name: 'Another action', value: 'another' },
    { name: 'Something else here', value: 'else' },
  ];
}`.trim();

export const src_checkboxItems = `
function checkboxItems() {
  return [
    { name: 'Apples', value: 'apples', checked: true },
    { name: 'Bananas', value: 'bananas' },
    { name: 'Cherries', value: 'cherries' },
    { isDivider: true },
    { name: 'Dates', value: 'dates' },
  ];
}`.trim();

export const src_toggleItems = `
function toggleItems() {
  return [
    { name: 'Email alerts', value: 'email', checked: true },
    { name: 'Push notifications', value: 'push' },
    { name: 'SMS', value: 'sms' },
  ];
}`.trim();

export const src_submenuItems = `
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
}`.trim();

export const makeOptionsScript = (id, factories = [], itemsExpr = '[]') => {
  const factorySrc = factories
    .map((f) => (f && f.src ? f.src.trim() : ''))
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

export const buildDocsSource = (context) => {
  const { args } = context;
  const storyName = String(context?.name ?? '').replace(/\s+/g, '');

  const baseAttrs = onlyNonDefault({
    id: args.id || '',
    'align-menu-right': !!args.alignMenuRight,
    'auto-focus-submenu': !!args.autoFocusSubmenu,
    'button-text': args.buttonText,
    disabled: !!args.disabled,
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
      const sm = {
        id: 'dropdown-size-sm',
        attrs: onlyNonDefault({ ...baseAttrs, id: 'dropdown-size-sm', 'button-text': 'Small', size: 'sm', variant: 'primary' }),
      };
      const md = {
        id: 'dropdown-size-md',
        attrs: onlyNonDefault({ ...baseAttrs, id: 'dropdown-size-md', 'button-text': 'Default', variant: 'primary' }),
      };
      const lg = {
        id: 'dropdown-size-lg',
        attrs: onlyNonDefault({ ...baseAttrs, id: 'dropdown-size-lg', 'button-text': 'Large', size: 'lg', variant: 'primary' }),
      };

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

    case 'AccessibilityMatrix':
      return `<!-- See the Canvas for the live Accessibility Matrix output -->\n<div>(Accessibility Matrix)</div>`;

    default:
      return context?.originalSource || '';
  }
};

export function buildDropdown(args, items, idPrefix = 'dd') {
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
  el.options = itemsWithIds.map((i) => ({ ...i }));

  el.addEventListener('itemSelected', (e) => console.log('[itemSelected]', e.detail));
  el.addEventListener('selection-changed', (e) => console.log('[selection-changed]', e.detail));
  el.addEventListener('items-changed', (e) => {
    const next = (e?.detail?.items || []).map((i) => ({ ...i }));
    el.options = next;
  });

  return el;
}

export const pickAttrs = (el, names) => {
  const out = {};
  if (!el) return out;
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
};

export const snapshotA11y = (host) => {
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

export function buildCard({ title, layout = '', invalid = false, invalidText = '', args, idSuffix }) {
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

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrapper;
}
