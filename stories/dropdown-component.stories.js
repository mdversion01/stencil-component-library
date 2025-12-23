// stories/dropdown-component.stories.js

export default {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
  parameters: {
    actions: {
      handles: ['itemSelected', 'items-changed', 'selection-changed'],
    },
  },
  argTypes: {
    // visual/behavior props
    buttonText: { control: 'text' },
    disabled: { control: 'boolean' },
    iconDropdown: { control: 'boolean', description: 'Use an icon-only trigger' },
    icon: { control: 'text' },
    iconSize: { control: 'number' },
    alignMenuRight: { control: 'boolean' },
    shape: { control: { type: 'inline-radio' }, options: ['', 'rounded', 'pill'] },
    size: { control: { type: 'inline-radio' }, options: ['', 'sm', 'lg'] },
    outlined: { control: 'boolean' },
    ripple: { control: 'boolean' },
    variant: { control: { type: 'inline-radio' }, options: ['default', 'primary', 'secondary', 'danger'] },

    // list behavior/formatting
    listType: {
      control: { type: 'inline-radio' },
      options: ['default', 'checkboxes', 'customCheckboxes', 'toggleSwitches'],
    },
    subMenuListType: {
      control: { type: 'inline-radio' },
      options: ['default', 'checkboxes', 'customCheckboxes', 'toggleSwitches'],
    },
    autoFocusSubmenu: { control: 'boolean' },
    menuOffsetY: { control: 'number' },
    submenuOffsetX: { control: 'number' },

    // misc
    titleAttr: { control: 'text' },
    tableId: { control: 'text' },
    inputId: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },

    // story-only control to tweak items
    withSubmenu: { control: 'boolean', table: { disable: true } },
  },
  args: {
    buttonText: 'Dropdown',
    disabled: false,
    iconDropdown: false,
    icon: 'fa-solid fa-ellipsis-vertical',
    iconSize: 16,
    alignMenuRight: false,
    shape: '',
    size: '',
    outlined: false,
    ripple: false,
    variant: 'default',
    listType: 'default',
    subMenuListType: 'default',
    autoFocusSubmenu: false,
    menuOffsetY: 0,
    submenuOffsetX: 0,
    titleAttr: '',
    tableId: 'demo-table',
    withSubmenu: true,
  },
};

/** ---------- Helpers ---------- */

const baseItems = () => ([
  { name: 'Action', value: 'action' },
  { name: 'Another action', value: 'another' },
  { isDivider: true },
  { name: 'Something else here', value: 'else' },
]);

const checkboxItems = () => ([
  { name: 'Apples', value: 'apples', checked: true },
  { name: 'Bananas', value: 'bananas' },
  { name: 'Cherries', value: 'cherries', disabled: true },
  { isDivider: true },
  { name: 'Dates', value: 'dates' },
]);

const toggleItems = () => ([
  { name: 'Email alerts', value: 'email', checked: true },
  { name: 'Push notifications', value: 'push' },
  { name: 'SMS', value: 'sms', disabled: true },
]);

const submenuItems = (subListType = 'default') => ([
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
      // demonstrate per-item custom list type in submenu
      { name: 'Show completed', value: 'done', customListType: subListType, checked: true },
      { name: 'Only mine', value: 'mine', customListType: subListType },
      { name: 'High priority', value: 'hi', customListType: subListType },
    ],
  },
]);

const kitchenSinkItems = () => ([
  ...baseItems(),
  {
    isDivider: true,
  },
  {
    name: 'More',
    submenu: [
      { name: 'About', value: 'about' },
      { name: 'Keyboard Shortcuts', value: 'keys' },
      { isDivider: true },
      { name: 'Experimental', value: 'exp' },
      {
        name: 'Notifications',
        submenu: [
          { name: 'Email', value: 'email', customListType: 'toggleSwitches', checked: true },
          { name: 'Push', value: 'push', customListType: 'toggleSwitches' },
          { name: 'SMS', value: 'sms', customListType: 'toggleSwitches', disabled: true },
        ],
      },
    ],
  },
]);

function buildDropdown(args, items) {
  const el = document.createElement('dropdown-component');

  // core props
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

  // options (Prop is mutable, so direct assignment is fine)
  el.options = items;

  // helpful logging
  el.addEventListener('itemSelected', (e) => console.log('[itemSelected]', e.detail));
  el.addEventListener('items-changed', (e) => console.log('[items-changed]', e.detail));
  el.addEventListener('selection-changed', (e) => console.log('[selection-changed]', e.detail));

  return el;
}

const Template = (args) => {
  const items = args.withSubmenu
    ? [...baseItems(), { isDivider: true }, ...submenuItems(args.subMenuListType)]
    : baseItems();

  return buildDropdown(args, items);
};

/** ---------- Stories ---------- */

export const Basic = Template.bind({});

export const RightAligned = Template.bind({});
RightAligned.args = {
  alignMenuRight: true,
};

export const WithSubmenu = Template.bind({});
WithSubmenu.args = {
  withSubmenu: true,
};

export const IconOnly = (args) => buildDropdown(
  { ...args, iconDropdown: true, buttonText: '', titleAttr: 'More actions' },
  baseItems()
);
IconOnly.args = {
  icon: 'fa-solid fa-ellipsis-vertical',
  iconSize: 18,
};

export const Checkboxes = (args) =>
  buildDropdown({ ...args, listType: 'checkboxes', withSubmenu: false }, checkboxItems());
Checkboxes.args = {};

export const CustomCheckboxes = (args) =>
  buildDropdown({ ...args, listType: 'customCheckboxes', withSubmenu: false }, checkboxItems());
CustomCheckboxes.args = {};

export const ToggleSwitches = (args) =>
  buildDropdown({ ...args, listType: 'toggleSwitches', withSubmenu: false }, toggleItems());
ToggleSwitches.args = {};

export const SubmenuWithToggles = (args) => {
  const items = [
    ...baseItems(),
    { isDivider: true },
    ...submenuItems('toggleSwitches'),
  ];
  return buildDropdown({ ...args, withSubmenu: true }, items);
};
SubmenuWithToggles.args = { autoFocusSubmenu: true };

export const Sizes = (args) => {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.gap = '12px';
  wrap.style.alignItems = 'center';

  const sm = buildDropdown({ ...args, size: 'sm', buttonText: 'Small' }, baseItems());
  const md = buildDropdown({ ...args, size: '', buttonText: 'Default' }, baseItems());
  const lg = buildDropdown({ ...args, size: 'lg', buttonText: 'Large' }, baseItems());

  wrap.append(sm, md, lg);
  return wrap;
};
Sizes.args = {};

export const OffsetsAndFlip = (args) =>
  buildDropdown({ ...args, menuOffsetY: 8, submenuOffsetX: 8 }, kitchenSinkItems());
OffsetsAndFlip.args = {
  alignMenuRight: false,
};

export const KitchenSink = (args) => buildDropdown(args, kitchenSinkItems());
KitchenSink.args = {
  withSubmenu: true,
  subMenuListType: 'toggleSwitches',
  iconDropdown: false,
  variant: 'primary',
};
