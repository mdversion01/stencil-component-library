// File: src/stories/dropdown-component/dropdown-component.stories.js

import DocsPage from './dropdown-component.docs.mdx';
import {
  baseItems,
  buildCard,
  buildDocsSource,
  buildDropdown,
  checkboxItems,
  submenuItems,
  toggleItems,
} from './dropdown-component.story-helpers.js';

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

    // Storybook-only helpers for the Accessibility Matrix
    formLayout: '',
    validation: false,
    validationMessage: 'Required field',
  },
  parameters: {
    actions: {
      handles: ['itemSelected', 'items-changed', 'selection-changed'],
    },
    docs: {
      page: DocsPage,
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
        transform: (_src, context) => buildDocsSource(context),
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
      name: 'form-layout',
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
      name: 'validation-message',
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

/** ---------- Templates ---------- */

const BasicTemplate = (args) => {
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
  (Story) => {
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

export const WithSubmenu = (args) => {
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

  const label = (text) => {
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

export const IconOnly = (args) =>
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

export const CheckboxVariants = (args) => {
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

  const label = (text) => {
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

export const ToggleSwitches = (args) =>
  buildDropdown({ ...args, id: 'dropdown-toggles', variant: 'secondary', listType: 'toggleSwitches', withSubmenu: false }, toggleItems(), 'dd-tgsw');
ToggleSwitches.args = {};
ToggleSwitches.parameters = {
  docs: { story: { height: '220px' }, description: { story: 'Dropdown with toggle switch items.' } },
};

export const Sizes = (args) => {
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

export const AccessibilityMatrix = (args) => {
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
