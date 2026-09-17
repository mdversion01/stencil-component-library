// File: src/stories/dropdown-component/dropdown-component.stories.js

// import DocsPage from './dropdown-component.docs.mdx';
import {
  baseItems,
  buildCard,
  buildDocsSource,
  buildDropdown,
  checkboxItems,
  submenuItems,
  toggleItems,
} from './dropdown-component.story-helpers.js';

const defaultArgs = {
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
  variant: '',
  withSubmenu: true,

  formLayout: '',
  validation: false,
  validationMessage: 'Required field',
};

const renderBasicTemplate = args => {
  const id = args.id || 'dropdown-basic';
  return buildDropdown({ ...args, id }, baseItems());
};

export default {
  title: 'Bootstrap or Plumage/Dropdown'
  ,
  args: {
    ...defaultArgs,
  },
  parameters: {
    actions: {
      handles: ['itemSelected', 'items-changed', 'selection-changed'],
    },
    themeFamily: 'allthemes',
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
        transform: (_src, context) => buildDocsSource(context),
      },
    },
  },
  argTypes: {
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

    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'danger'],
      description: 'Variant style of the dropdown button',
      table: { category: 'Appearance' },
    },

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

    withSubmenu: {
      control: 'boolean',
      table: { category: 'Storybook Only', disable: true },
      description: 'Internal helper to include submenu items in the dropdown',
      name: 'with-submenu',
    },
  },
};

export const Basic = {
  name: 'Basic',
  render: args => renderBasicTemplate(args),
  args: {
    id: 'dropdown-basic',
    variant: 'primary',
  },
  decorators: [
    Story => {
      const wrap = document.createElement('div');
      wrap.style.padding = '5px 15px';
      const node = Story();
      wrap.appendChild(node);
      return wrap;
    },
  ],
  parameters: {
    docs: {
      description: { story: 'A basic dropdown with default settings.' },
      story: { height: '125px' },
    },
  },
};

export const RightAligned = {
  name: 'RightAligned',
  render: args => renderBasicTemplate(args),
  args: {
    id: 'ddRightAlign',
    alignMenuRight: true,
    variant: 'primary',
  },
  decorators: [
    Story => {
      const wrap = document.createElement('div');
      wrap.style.padding = '5px 15px 0 60px';
      wrap.style.boxSizing = 'border-box';
      wrap.style.minHeight = '125px';
      const node = Story();
      wrap.appendChild(node);
      return wrap;
    },
  ],
  parameters: {
    docs: {
      story: { height: '125px' },
      description: { story: 'A right-aligned dropdown (menu opens to the left).' },
    },
  },
};

export const WithSubmenu = {
  name: 'WithSubmenu',
  render: args => {
    const items = [...baseItems(), { isDivider: true }, ...submenuItems(args.subMenuListType || 'default')];

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '24px';
    wrap.style.alignItems = 'center';
    wrap.style.padding = '5px 15px';

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
  },
  args: {
    withSubmenu: true,
    variant: 'secondary',
    id: 'dropdown-submenu',
  },
  parameters: {
    docs: {
      story: { height: '260px' },
      description: { story: 'Dropdown with submenu items. Two examples shown: default (left) and right-aligned (right).' },
    },
  },
};

export const IconOnly = {
  name: 'IconOnly',
  render: args =>
    buildDropdown({ ...args, id: 'dropdown-icon', iconDropdown: true, buttonText: '', titleAttr: 'More actions' }, baseItems(), 'dd-icon'),
  args: {
    icon: 'fa-solid fa-ellipsis-vertical',
    iconSize: 18,
  },
  decorators: [
    Story => {
      const wrap = document.createElement('div');
      wrap.style.padding = '5px 15px';
      const node = Story();
      wrap.appendChild(node);
      return wrap;
    },
  ],
  parameters: {
    docs: {
      story: { height: '125px' },
      description: { story: 'Dropdown using an icon-only trigger button.' },
    },
  },
};

export const CheckboxVariants = {
  name: 'CheckboxVariants',
  render: args => {
    const items = checkboxItems();

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '24px';
    wrap.style.alignItems = 'center';
    wrap.style.padding = '5px 15px';

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
  },
  args: {},
  parameters: {
    docs: {
      story: { height: '220px' },
      description: { story: 'Dropdown with checkbox items. Two examples shown: standard and custom checkboxes.' },
    },
  },
};

export const ToggleSwitches = {
  name: 'ToggleSwitches',
  render: args =>
    buildDropdown({ ...args, id: 'dropdown-toggles', variant: 'secondary', listType: 'toggleSwitches', withSubmenu: false }, toggleItems(), 'dd-tgsw'),
   decorators: [
    Story => {
      const wrap = document.createElement('div');
      wrap.style.padding = '5px 15px';
      wrap.style.boxSizing = 'border-box';
      wrap.style.minHeight = '125px';
      const node = Story();
      wrap.appendChild(node);
      return wrap;
    },
  ],
  args: {},
  parameters: {
    docs: {
      story: { height: '150px' },
      description: { story: 'Dropdown with toggle switch items.' },
    },
  },
};

export const Sizes = {
  name: 'Sizes',
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';
    wrap.style.alignItems = 'center';
    wrap.style.padding = '5px 15px';

    const sm = buildDropdown({ ...args, id: 'dropdown-size-sm', size: 'sm', variant: 'primary', buttonText: 'Small' }, baseItems(), 'dd-size-sm');
    const md = buildDropdown({ ...args, id: 'dropdown-size-md', size: '', variant: 'primary', buttonText: 'Default' }, baseItems(), 'dd-size-md');
    const lg = buildDropdown({ ...args, id: 'dropdown-size-lg', size: 'lg', variant: 'primary', buttonText: 'Large' }, baseItems(), 'dd-size-lg');

    wrap.append(sm, md, lg);
    return wrap;
  },
  args: {},
  parameters: {
    docs: {
      story: { height: '220px' },
      description: { story: 'Dropdown examples in different button sizes: small, default, and large.' },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: args => {
    const root = document.createElement('div');
    root.className = 'dropdown-accessibility-matrix';

    const intro = document.createElement('div');

    const introTitle = document.createElement('div');
    introTitle.className =
      'dropdown-accessibility-matrix__intro-title';
    introTitle.textContent = 'Accessibility matrix';

    const introDescription = document.createElement('div');
    introDescription.className =
      'dropdown-accessibility-matrix__intro-description';
    introDescription.innerHTML =
      'Renders common dropdown variants and prints the computed accessibility structure from the rendered light DOM, including the native trigger button, menu role, menu items, ARIA relationships, hidden form input, disabled state, and submenu controls.';

    intro.appendChild(introTitle);
    intro.appendChild(introDescription);
    root.appendChild(intro);

    const cases = [
      {
        title: 'Default',
        args: {
          ...args,
          disabled: false,
          iconDropdown: false,
          alignMenuRight: false,
          buttonText: 'Dropdown',
          titleAttr: '',
          variant: 'primary',
          listType: 'default',
        },
        items: baseItems(),
      },

      {
        title: 'Icon-only trigger',
        args: {
          ...args,
          disabled: false,
          iconDropdown: true,
          icon: 'fa-solid fa-ellipsis-vertical',
          buttonText: '',
          titleAttr: 'More actions',
          alignMenuRight: false,
          variant: 'secondary',
          listType: 'default',
        },
        items: baseItems(),
      },

      {
        title: 'Right aligned',
        args: {
          ...args,
          disabled: false,
          iconDropdown: false,
          alignMenuRight: true,
          buttonText: 'Actions',
          variant: 'secondary',
          listType: 'default',
        },
        items: baseItems(),
      },

      {
        title: 'With submenu',
        args: {
          ...args,
          disabled: false,
          iconDropdown: false,
          alignMenuRight: false,
          buttonText: 'Menu',
          variant: 'secondary',
          listType: 'default',
          withSubmenu: true,
        },
        items: [
          ...baseItems(),
          { isDivider: true },
          ...submenuItems(args.subMenuListType || 'default'),
        ],
      },

      {
        title: 'Checkbox items',
        args: {
          ...args,
          disabled: false,
          iconDropdown: false,
          buttonText: 'Fruit',
          variant: 'secondary',
          listType: 'checkboxes',
          withSubmenu: false,
        },
        items: checkboxItems(),
      },

      {
        title: 'Toggle switch items',
        args: {
          ...args,
          disabled: false,
          iconDropdown: false,
          buttonText: 'Notifications',
          variant: 'secondary',
          listType: 'toggleSwitches',
          withSubmenu: false,
        },
        items: toggleItems(),
      },

      {
        title: 'Disabled',
        args: {
          ...args,
          disabled: true,
          iconDropdown: false,
          buttonText: 'Disabled dropdown',
          variant: 'primary',
          listType: 'default',
        },
        items: baseItems(),
      },
    ];

    cases.forEach((caseConfig, index) => {
      root.appendChild(
        buildCard({
          title: caseConfig.title,
          args: caseConfig.args,
          items: caseConfig.items,
          idSuffix: String(index + 1),
        }),
      );
    });

    return root;
  },

  parameters: {
    docs: {
      description: {
        story:
          'Computed accessibility matrix for standard, icon-only, right-aligned, submenu, checkbox, toggle-switch, and disabled dropdowns. Each card reports the rendered native trigger, menu, menu items, form input, ARIA attributes, and whether ID-based ARIA relationships resolve.',
      },

      story: {
        height: '2200px',
      },
    },

    controls: {
      disable: true,
    },
  },
};
