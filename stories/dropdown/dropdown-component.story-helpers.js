// File: src/stories/dropdown-component/dropdown-component.story-helpers.js

export const DEFAULTS = {
  'align-menu-right': false,
  'auto-focus-submenu': false,
  'button-text': 'Dropdown',
  disabled: false,
  icon: 'fa-solid fa-ellipsis-vertical',
  'icon-dropdown': false,
  'icon-size': 16,
  'list-type': 'default',
  'menu-offset-y': 0,
  outlined: false,
  ripple: false,
  shape: '',
  size: '',
  'sub-menu-list-type': 'default',
  'submenu-offset-x': 0,
  'table-id': 'demo-table',
  'title-attr': '',
  variant: 'default',
  'input-id': '',
  name: '',
  value: '',
};

export const normalize = txt => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.replace(/[ \t]+$/g, ''));

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

export const attrsToString = attrs =>
  Object.entries(attrs)
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== false &&
        value !== '',
    )
    .map(([key, value]) =>
      value === true
        ? key
        : `${key}="${String(value)}"`,
    )
    .join(' ');

export const onlyNonDefault = all => {
  const out = {};

  for (const [key, value] of Object.entries(all)) {
    if (value === undefined || value === null) continue;

    if (
      JSON.stringify(value) !==
      JSON.stringify(DEFAULTS[key])
    ) {
      if (
        typeof value === 'string' &&
        value.trim() === ''
      ) {
        continue;
      }

      out[key] = value;
    }
  }

  return out;
};

export const slug = value =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const withIds = (
  items,
  prefix = 'dd',
) =>
  (items || []).map((item, index) => {
    const key =
      item.value ??
      item.name ??
      index;

    const inputId =
      item.inputId ||
      `${prefix}-input-${slug(key)}`;

    return {
      ...item,
      inputId,
    };
  });

export const baseItems = () => [
  {
    name: 'Action',
    value: 'action',
  },
  {
    name: 'Another action',
    value: 'another',
  },
  {
    name: 'Something else here',
    value: 'else',
  },
];

export const checkboxItems = () => [
  {
    name: 'Apples',
    value: 'apples',
    checked: true,
  },
  {
    name: 'Bananas',
    value: 'bananas',
  },
  {
    name: 'Cherries',
    value: 'cherries',
  },
  {
    isDivider: true,
  },
  {
    name: 'Dates',
    value: 'dates',
  },
];

export const toggleItems = () => [
  {
    name: 'Email alerts',
    value: 'email',
    checked: true,
  },
  {
    name: 'Push notifications',
    value: 'push',
  },
  {
    name: 'SMS',
    value: 'sms',
  },
];

export const submenuItems = (
  subListType = 'default',
) => [
  {
    name: 'File',
    submenu: [
      {
        name: 'New',
        value: 'new',
      },
      {
        name: 'Open…',
        value: 'open',
      },
      {
        isDivider: true,
      },
      {
        name: 'Recent',
        value: 'recent',
      },
    ],
  },
  {
    name: 'View',
    submenu: [
      {
        name: 'Zoom In',
        value: 'zin',
      },
      {
        name: 'Zoom Out',
        value: 'zout',
      },
      {
        name: 'Reset Zoom',
        value: 'zreset',
      },
    ],
  },
  {
    name: 'Filters',
    submenu: [
      {
        name: 'Show completed',
        value: 'done',
        customListType: subListType,
        checked: true,
      },
      {
        name: 'Only mine',
        value: 'mine',
        customListType: subListType,
      },
      {
        name: 'High priority',
        value: 'hi',
        customListType: subListType,
      },
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

export const makeOptionsScript = (
  id,
  factories = [],
  itemsExpr = '[]',
) => {
  const factorySrc = factories
    .map(factory =>
      factory && factory.src
        ? factory.src.trim()
        : '',
    )
    .filter(Boolean)
    .join('\n\n  ');

  return [
    '<script>',
    '  // ---- JavaScript used in this example ----',
    '  // Factory functions that create the dropdown items:',
    factorySrc
      ? '  ' +
        factorySrc.replace(
          /\n/g,
          '\n  ',
        )
      : '  // (no factories needed for this example)',
    '',
    '  // Helper: clone array (preserve object identity immutably)',
    '  const cloneItems = (arr) => (Array.isArray(arr) ? arr.map(i => ({ ...i })) : []);',
    '',
    `  (function setup_${id.replace(
      /[^a-z0-9_]/gi,
      '_',
    )}(){`,
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

export const buildDocsSource = context => {
  const { args } = context;
  const storyName = String(
    context?.name ?? '',
  ).replace(/\s+/g, '');

  const baseAttrs = onlyNonDefault({
    id: args.id || '',
    'align-menu-right':
      !!args.alignMenuRight,
    'auto-focus-submenu':
      !!args.autoFocusSubmenu,
    'button-text':
      args.buttonText,
    disabled:
      !!args.disabled,
    'icon-dropdown':
      !!args.iconDropdown,
    icon:
      args.icon,
    'icon-size':
      typeof args.iconSize === 'number'
        ? args.iconSize
        : DEFAULTS['icon-size'],
    outlined:
      !!args.outlined,
    ripple:
      !!args.ripple,
    shape:
      args.shape,
    size:
      args.size,
    variant:
      args.variant,
    'list-type':
      args.listType,
    'sub-menu-list-type':
      args.subMenuListType,
    'menu-offset-y':
      args.menuOffsetY,
    'submenu-offset-x':
      args.submenuOffsetX,
    'table-id':
      args.tableId,
    'title-attr':
      args.titleAttr,
    'input-id':
      args.inputId,
    name:
      args.name,
    value:
      args.value,
  });

  switch (storyName) {
    case 'Basic': {
      const id =
        'dropdown-basic';

      const attrs =
        onlyNonDefault({
          ...baseAttrs,
          id,
          variant: 'primary',
        });

      const html =
        `<dropdown-component ${attrsToString(
          attrs,
        )}></dropdown-component>`;

      const js =
        makeOptionsScript(
          id,
          [
            {
              name: 'baseItems',
              src: src_baseItems,
            },
          ],
          'baseItems()',
        );

      return `${html}\n\n${js}`;
    }

    case 'RightAligned': {
      const id =
        'ddRightAlign';

      const attrs =
        onlyNonDefault({
          ...baseAttrs,
          id,
          'align-menu-right': true,
          variant: 'primary',
        });

      const html = [
        '<!-- Layout container is Storybook-only -->',
        '<div style="padding-left: 40px; box-sizing: border-box; min-height: 220px;">',
        `  <dropdown-component ${attrsToString(
          attrs,
        )}></dropdown-component>`,
        '</div>',
      ].join('\n');

      const js =
        makeOptionsScript(
          id,
          [
            {
              name: 'baseItems',
              src: src_baseItems,
            },
          ],
          'baseItems()',
        );

      return `${html}\n\n${js}`;
    }

    case 'WithSubmenu': {
      const leftId =
        'dropdown-submenu-left';

      const rightId =
        'dropdown-submenu-right';

      const attrsLeft =
        onlyNonDefault({
          ...baseAttrs,
          id: leftId,
          variant: 'secondary',
        });

      const attrsRight =
        onlyNonDefault({
          ...baseAttrs,
          id: rightId,
          variant: 'secondary',
          'align-menu-right': true,
        });

      const subType =
        JSON.stringify(
          args.subMenuListType ||
          'default',
        );

      const html = [
        '<!-- Side-by-side preview is Storybook-only -->',
        '<div style="display:flex; gap:24px; align-items:center">',
        '  <div>',
        '    <div style="font-size:12px;color:#666;margin-bottom:8px;">Default (submenus open to the right)</div>',
        `    <dropdown-component ${attrsToString(
          attrsLeft,
        )}></dropdown-component>`,
        '  </div>',
        '  <div>',
        '    <div style="font-size:12px;color:#666;margin-bottom:8px;">Right-aligned (submenus open to the left)</div>',
        `    <dropdown-component ${attrsToString(
          attrsRight,
        )}></dropdown-component>`,
        '  </div>',
        '</div>',
      ].join('\n');

      const itemsExpr = `[
  ...baseItems(),
  { isDivider: true },
  ...submenuItems(${subType})
]`;

      const factories = [
        {
          name: 'baseItems',
          src: src_baseItems,
        },
        {
          name: 'submenuItems',
          src: src_submenuItems,
        },
      ];

      const jsLeft =
        makeOptionsScript(
          leftId,
          factories,
          itemsExpr,
        );

      const jsRight =
        makeOptionsScript(
          rightId,
          factories,
          itemsExpr,
        );

      return [
        html,
        jsLeft,
        jsRight,
      ].join('\n\n');
    }

    case 'IconOnly': {
      const id =
        'dropdown-icon';

      const attrs =
        onlyNonDefault({
          ...baseAttrs,
          id,
          'icon-dropdown': true,
          'title-attr': 'More actions',
          icon:
            args.icon ??
            DEFAULTS.icon,
          'icon-size':
            typeof args.iconSize === 'number'
              ? args.iconSize
              : DEFAULTS['icon-size'],
          variant: 'primary',
        });

      const html =
        `<dropdown-component ${attrsToString(
          attrs,
        )}></dropdown-component>`;

      const js =
        makeOptionsScript(
          id,
          [
            {
              name: 'baseItems',
              src: src_baseItems,
            },
          ],
          'baseItems()',
        );

      return `${html}\n\n${js}`;
    }

    case 'CheckboxVariants': {
      const idLeft =
        'dropdown-checkboxes';

      const idRight =
        'dropdown-custom-checkboxes';

      const attrsLeft =
        onlyNonDefault({
          ...baseAttrs,
          id: idLeft,
          'list-type': 'checkboxes',
          variant: 'secondary',
        });

      const attrsRight =
        onlyNonDefault({
          ...baseAttrs,
          id: idRight,
          'list-type': 'customCheckboxes',
          variant: 'secondary',
        });

      const html = [
        '<!-- Side-by-side preview is Storybook-only -->',
        '<div style="display:flex; gap:24px; align-items:center">',
        '  <div>',
        '    <div style="font-size:12px;color:#666;margin-bottom:8px;">Standard checkboxes</div>',
        `    <dropdown-component ${attrsToString(
          attrsLeft,
        )}></dropdown-component>`,
        '  </div>',
        '  <div>',
        '    <div style="font-size:12px;color:#666;margin-bottom:8px;">Custom checkboxes</div>',
        `    <dropdown-component ${attrsToString(
          attrsRight,
        )}></dropdown-component>`,
        '  </div>',
        '</div>',
      ].join('\n');

      const factories = [
        {
          name: 'checkboxItems',
          src: src_checkboxItems,
        },
      ];

      const itemsExpr =
        'checkboxItems()';

      const jsLeft =
        makeOptionsScript(
          idLeft,
          factories,
          itemsExpr,
        );

      const jsRight =
        makeOptionsScript(
          idRight,
          factories,
          itemsExpr,
        );

      return [
        html,
        jsLeft,
        jsRight,
      ].join('\n\n');
    }

    case 'ToggleSwitches': {
      const id =
        'dropdown-toggles';

      const attrs =
        onlyNonDefault({
          ...baseAttrs,
          id,
          'list-type':
            'toggleSwitches',
          variant: 'secondary',
        });

      const html =
        `<dropdown-component ${attrsToString(
          attrs,
        )}></dropdown-component>`;

      const js =
        makeOptionsScript(
          id,
          [
            {
              name: 'toggleItems',
              src: src_toggleItems,
            },
          ],
          'toggleItems()',
        );

      return `${html}\n\n${js}`;
    }

    case 'Sizes': {
      const sm = {
        id: 'dropdown-size-sm',
        attrs:
          onlyNonDefault({
            ...baseAttrs,
            id:
              'dropdown-size-sm',
            'button-text':
              'Small',
            size: 'sm',
            variant: 'primary',
          }),
      };

      const md = {
        id: 'dropdown-size-md',
        attrs:
          onlyNonDefault({
            ...baseAttrs,
            id:
              'dropdown-size-md',
            'button-text':
              'Default',
            variant: 'primary',
          }),
      };

      const lg = {
        id: 'dropdown-size-lg',
        attrs:
          onlyNonDefault({
            ...baseAttrs,
            id:
              'dropdown-size-lg',
            'button-text':
              'Large',
            size: 'lg',
            variant: 'primary',
          }),
      };

      const html = [
        '<!-- Three side-by-side buttons (Storybook-only layout) -->',
        '<div style="display:flex; gap:12px; align-items:center">',
        `  <dropdown-component ${attrsToString(
          sm.attrs,
        )}></dropdown-component>`,
        `  <dropdown-component ${attrsToString(
          md.attrs,
        )}></dropdown-component>`,
        `  <dropdown-component ${attrsToString(
          lg.attrs,
        )}></dropdown-component>`,
        '</div>',
      ].join('\n');

      const factories = [
        {
          name: 'baseItems',
          src: src_baseItems,
        },
      ];

      const jsSm =
        makeOptionsScript(
          sm.id,
          factories,
          'baseItems()',
        );

      const jsMd =
        makeOptionsScript(
          md.id,
          factories,
          'baseItems()',
        );

      const jsLg =
        makeOptionsScript(
          lg.id,
          factories,
          'baseItems()',
        );

      return [
        html,
        jsSm,
        jsMd,
        jsLg,
      ].join('\n\n');
    }

    case 'AccessibilityMatrix':
      return [
        '<!-- See the Canvas for the live Accessibility Matrix output -->',
        '<div>(Accessibility Matrix)</div>',
      ].join('\n');

    default:
      return (
        context?.originalSource ||
        ''
      );
  }
};

export function buildDropdown(
  args,
  items,
  idPrefix = 'dd',
) {
  const el =
    document.createElement(
      'dropdown-component',
    );

  if (args.id) {
    el.id =
      String(args.id);
  }

  el.buttonText =
    args.buttonText;

  el.disabled =
    args.disabled;

  el.iconDropdown =
    args.iconDropdown;

  el.icon =
    args.icon;

  if (
    typeof args.iconSize === 'number'
  ) {
    el.iconSize =
      args.iconSize;
  }

  el.alignMenuRight =
    args.alignMenuRight;

  el.shape =
    args.shape;

  el.size =
    args.size;

  el.outlined =
    args.outlined;

  el.ripple =
    args.ripple;

  el.variant =
    args.variant;

  el.listType =
    args.listType;

  el.subMenuListType =
    args.subMenuListType;

  el.autoFocusSubmenu =
    args.autoFocusSubmenu;

  el.menuOffsetY =
    args.menuOffsetY;

  el.submenuOffsetX =
    args.submenuOffsetX;

  el.titleAttr =
    args.titleAttr;

  el.tableId =
    args.tableId;

  el.inputId =
    args.inputId;

  el.name =
    args.name;

  el.value =
    args.value;

  const itemsWithIds =
    withIds(
      items,
      idPrefix,
    );

  el.options =
    itemsWithIds.map(item => ({
      ...item,
    }));

  el.addEventListener(
    'itemSelected',
    event => {
      console.log(
        '[itemSelected]',
        event.detail,
      );
    },
  );

  el.addEventListener(
    'selection-changed',
    event => {
      console.log(
        '[selection-changed]',
        event.detail,
      );
    },
  );

  el.addEventListener(
    'items-changed',
    event => {
      const next =
        (
          event?.detail?.items ||
          []
        ).map(item => ({
          ...item,
        }));

      el.options =
        next;
    },
  );

  return el;
}

export const pickAttrs = (
  el,
  names,
) => {
  const out = {};

  if (!el) {
    return out;
  }

  for (const name of names) {
    const value =
      el.getAttribute(name);

    if (value !== null) {
      out[name] = value;
    }
  }

  return out;
};

const waitForDropdownReady =
  async host => {
    if (!host) {
      return;
    }

    if (
      typeof host.componentOnReady ===
      'function'
    ) {
      await host.componentOnReady();
    } else if (
      window.customElements?.whenDefined
    ) {
      await customElements.whenDefined(
        'dropdown-component',
      );
    }

    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(
          resolve,
        );
      });
    });
  };

const escapeSelectorAttributeValue =
  value =>
    String(value)
      .replace(
        /\\/g,
        '\\\\',
      )
      .replace(
        /"/g,
        '\\"',
      );

const resolveIdWithin = (
  host,
  id,
) => {
  if (!host || !id) {
    return null;
  }

  const escapedId =
    escapeSelectorAttributeValue(
      id,
    );

  return Boolean(
    host.querySelector(
      `[id="${escapedId}"]`,
    ),
  );
};

const splitIds = value =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const resolveIdListWithin = (
  host,
  value,
) => {
  const ids =
    splitIds(value);

  const result = {};

  for (const id of ids) {
    result[id] =
      resolveIdWithin(
        host,
        id,
      );
  }

  return result;
};

const findTriggerButton = host => {
  if (!host) {
    return null;
  }

  const selectors = [
    'button-component button',
    '.dropdown-button button',
    'button.dropdown-toggle',
    '[aria-haspopup="menu"]',
    '[aria-haspopup="true"]',
    'button[aria-expanded]',
    'button[aria-controls]',
    'button',
  ];

  for (const selector of selectors) {
    const element =
      host.querySelector(
        selector,
      );

    if (element) {
      return element;
    }
  }

  return null;
};

const snapshotMenuItem = (
  host,
  item,
  index,
) => {
  const ariaControls =
    item.getAttribute(
      'aria-controls',
    ) || '';

  const ariaOwns =
    item.getAttribute(
      'aria-owns',
    ) || '';

  const ariaLabelledBy =
    item.getAttribute(
      'aria-labelledby',
    ) || '';

  const ariaDescribedBy =
    item.getAttribute(
      'aria-describedby',
    ) || '';

  return {
    index,

    tag:
      item.tagName.toLowerCase(),

    id:
      item.getAttribute('id') ||
      '',

    text:
      (
        item.textContent ||
        ''
      )
        .replace(
          /\s+/g,
          ' ',
        )
        .trim(),

    role:
      item.getAttribute(
        'role',
      ) || '',

    tabIndex:
      item.getAttribute(
        'tabindex',
      ),

    class:
      item.getAttribute(
        'class',
      ) || '',

    ...pickAttrs(
      item,
      [
        'aria-haspopup',
        'aria-expanded',
        'aria-controls',
        'aria-owns',
        'aria-checked',
        'aria-selected',
        'aria-disabled',
        'aria-label',
        'aria-labelledby',
        'aria-describedby',
        'disabled',
      ],
    ),

    resolves: {
      'aria-controls':
        ariaControls
          ? resolveIdListWithin(
              host,
              ariaControls,
            )
          : {},

      'aria-owns':
        ariaOwns
          ? resolveIdListWithin(
              host,
              ariaOwns,
            )
          : {},

      'aria-labelledby':
        ariaLabelledBy
          ? resolveIdListWithin(
              host,
              ariaLabelledBy,
            )
          : {},

      'aria-describedby':
        ariaDescribedBy
          ? resolveIdListWithin(
              host,
              ariaDescribedBy,
            )
          : {},
    },
  };
};

export const snapshotA11y =
  host => {
    const triggerButton =
      findTriggerButton(host);

    const menu =
      host?.querySelector(
        '.dropdown-menu, [role="menu"], [role="listbox"]',
      ) || null;

    const menuItems =
      host
        ? Array.from(
            host.querySelectorAll(
              [
                '.dropdown-item',
                '[role="menuitem"]',
                '[role="menuitemcheckbox"]',
                '[role="menuitemradio"]',
                '[role="option"]',
              ].join(','),
            ),
          )
        : [];

    const hiddenInputs =
      host
        ? Array.from(
            host.querySelectorAll(
              'input[type="hidden"]',
            ),
          )
        : [];

    const triggerControls =
      triggerButton?.getAttribute(
        'aria-controls',
      ) || '';

    const triggerLabelledBy =
      triggerButton?.getAttribute(
        'aria-labelledby',
      ) || '';

    const triggerDescribedBy =
      triggerButton?.getAttribute(
        'aria-describedby',
      ) || '';

    const menuLabelledBy =
      menu?.getAttribute(
        'aria-labelledby',
      ) || '';

    const menuDescribedBy =
      menu?.getAttribute(
        'aria-describedby',
      ) || '';

    return {
      host: host
        ? {
            tag:
              host.tagName.toLowerCase(),

            id:
              host.getAttribute(
                'id',
              ) || '',

            ...pickAttrs(
              host,
              [
                'aria-label',
                'aria-labelledby',
                'aria-describedby',
                'aria-disabled',
                'role',
              ],
            ),
          }
        : null,

      triggerButton:
        triggerButton
          ? {
              tag:
                triggerButton.tagName.toLowerCase(),

              id:
                triggerButton.getAttribute(
                  'id',
                ) || '',

              text:
                (
                  triggerButton.textContent ||
                  ''
                )
                  .replace(
                    /\s+/g,
                    ' ',
                  )
                  .trim(),

              class:
                triggerButton.getAttribute(
                  'class',
                ) || '',

              ...pickAttrs(
                triggerButton,
                [
                  'type',
                  'title',
                  'role',
                  'aria-label',
                  'aria-labelledby',
                  'aria-describedby',
                  'aria-haspopup',
                  'aria-expanded',
                  'aria-controls',
                  'aria-disabled',
                  'disabled',
                ],
              ),

              resolves: {
                'aria-controls':
                  triggerControls
                    ? resolveIdListWithin(
                        host,
                        triggerControls,
                      )
                    : {},

                'aria-labelledby':
                  triggerLabelledBy
                    ? resolveIdListWithin(
                        host,
                        triggerLabelledBy,
                      )
                    : {},

                'aria-describedby':
                  triggerDescribedBy
                    ? resolveIdListWithin(
                        host,
                        triggerDescribedBy,
                      )
                    : {},
              },
            }
          : null,

      menu:
        menu
          ? {
              tag:
                menu.tagName.toLowerCase(),

              id:
                menu.getAttribute(
                  'id',
                ) || '',

              role:
                menu.getAttribute(
                  'role',
                ) || '',

              class:
                menu.getAttribute(
                  'class',
                ) || '',

              visible:
                menu.classList.contains(
                  'show',
                ),

              ...pickAttrs(
                menu,
                [
                  'tabindex',
                  'aria-label',
                  'aria-labelledby',
                  'aria-describedby',
                  'aria-activedescendant',
                  'aria-owns',
                  'aria-multiselectable',
                  'aria-hidden',
                ],
              ),

              resolves: {
                'aria-labelledby':
                  menuLabelledBy
                    ? resolveIdListWithin(
                        host,
                        menuLabelledBy,
                      )
                    : {},

                'aria-describedby':
                  menuDescribedBy
                    ? resolveIdListWithin(
                        host,
                        menuDescribedBy,
                      )
                    : {},
              },
            }
          : null,

      menuItems:
        menuItems.map(
          (
            item,
            index,
          ) =>
            snapshotMenuItem(
              host,
              item,
              index,
            ),
        ),

      formInputs:
        hiddenInputs.map(
          input => ({
            tag:
              input.tagName.toLowerCase(),

            id:
              input.getAttribute(
                'id',
              ) || '',

            name:
              input.getAttribute(
                'name',
              ) || '',

            value:
              input.value ?? '',

            ...pickAttrs(
              input,
              [
                'type',
                'aria-label',
                'aria-labelledby',
                'aria-describedby',
                'disabled',
              ],
            ),
          }),
        ),

      summary: {
        triggerFound:
          Boolean(
            triggerButton,
          ),

        menuFound:
          Boolean(menu),

        menuItemCount:
          menuItems.length,

        hiddenInputCount:
          hiddenInputs.length,

        triggerControlsMenu:
          Boolean(
            triggerControls &&
              menu?.id &&
              splitIds(
                triggerControls,
              ).includes(
                menu.id,
              ),
          ),
      },
    };
  };

export function buildCard({
  title,
  layout = '',
  invalid = false,
  invalidText = '',
  args,
  items = baseItems(),
  idSuffix,
}) {
  const wrapper =
    document.createElement(
      'div',
    );

  wrapper.className =
    'dropdown-matrix-card';

  const heading =
    document.createElement(
      'div',
    );

  heading.className =
    'dropdown-matrix-card__heading';

  heading.textContent =
    title;

  const row =
    document.createElement(
      'div',
    );

  if (
    layout === 'inline'
  ) {
    row.className =
      'dropdown-matrix-card__row--inline';
  } else if (
    layout === 'horizontal'
  ) {
    row.className =
      'dropdown-matrix-card__row--horizontal';
  }

  const label =
    document.createElement(
      'div',
    );

  label.className =
    'dropdown-matrix-card__label';

  label.textContent =
    layout === 'horizontal'
      ? 'Label'
      : '';

  if (
    layout === 'horizontal'
  ) {
    label.classList.add(
      'dropdown-matrix-card__label--visible',
    );
  }

  const stage =
    document.createElement(
      'div',
    );

  stage.className =
    'dropdown-matrix-card__stage';

  const host =
    buildDropdown(
      {
        ...args,
        id:
          `dropdown-matrix-${idSuffix}`,
      },
      items,
      `dd-matrix-${idSuffix}`,
    );

  stage.appendChild(
    host,
  );

  if (
    layout === 'horizontal'
  ) {
    row.appendChild(
      label,
    );
  }

  row.appendChild(
    stage,
  );

  const validation =
    document.createElement(
      'div',
    );

  if (invalid) {
    validation.className =
      'dropdown-matrix-card__validation';

    validation.textContent =
      invalidText;
  }

  const status =
    document.createElement(
      'div',
    );

  status.className =
    'dropdown-matrix-card__status';

  status.textContent =
    'Inspecting rendered accessibility attributes…';

  const output =
    document.createElement(
      'pre',
    );

  output.className =
    'dropdown-matrix-card__output';

  output.textContent =
    'Loading computed attributes…';

  wrapper.appendChild(
    heading,
  );

  wrapper.appendChild(
    row,
  );

  if (invalid) {
    wrapper.appendChild(
      validation,
    );
  }

  wrapper.appendChild(
    status,
  );

  wrapper.appendChild(
    output,
  );

  const update =
    async () => {
      try {
        await waitForDropdownReady(
          host,
        );

        const snapshot =
          snapshotA11y(
            host,
          );

        output.textContent =
          JSON.stringify(
            snapshot,
            null,
            2,
          );

        const {
          triggerFound,
          menuFound,
          menuItemCount,
        } =
          snapshot.summary;

        status.textContent =
          [
            `Trigger: ${
              triggerFound
                ? 'found'
                : 'missing'
            }`,
            `Menu: ${
              menuFound
                ? 'found'
                : 'missing'
            }`,
            `Items: ${menuItemCount}`,
          ].join(
            ' · ',
          );
      } catch (error) {
        status.textContent =
          'Accessibility snapshot failed.';

        output.textContent =
          String(
            error?.stack ||
              error,
          );
      }
    };

  void update();

  return wrapper;
}
