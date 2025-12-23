// stories/checkbox-component.stories.js
import { action } from '@storybook/addon-actions';

export default {
  title: 'Form/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    // Rendering modes
    checkbox: { control: 'boolean', description: 'Single checkbox (classic)' },
    customCheckbox: { control: 'boolean', description: 'Single checkbox (custom styles)' },
    checkboxGroup: { control: 'boolean', description: 'Render a group of checkboxes' },
    customCheckboxGroup: { control: 'boolean', description: 'Group with custom styles' },

    // Shared props
    inputId: { control: 'text', name: 'input-id' },
    name: { control: 'text' },
    labelTxt: { control: 'text', name: 'label-txt' },
    value: { control: 'text' },
    size: { control: 'text' },
    inline: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    validation: { control: 'boolean' },
    validationMsg: { control: 'text', name: 'validation-msg' },

    // Single checkbox state
    checked: { control: 'boolean' },

    // Group props
    groupOptions: {
      control: 'object',
      description:
        'Array of { inputId, value, labelTxt, disabled?, checked? } or JSON string',
    },
    groupTitle: { control: 'text', name: 'group-title' },
    groupTitleSize: { control: 'text', name: 'group-title-size' },
  },
  args: {
    // defaults lean toward single checkbox
    checkbox: true,
    customCheckbox: false,
    checkboxGroup: false,
    customCheckboxGroup: false,

    inputId: 'agree-1',
    name: 'agree',
    labelTxt: 'I agree to the terms',
    value: 'agree',
    size: '',
    inline: false,
    required: false,
    disabled: false,
    validation: false,
    validationMsg: 'This field is required.',

    checked: false,

    groupOptions: [
      { inputId: 'opt-1', value: 'alpha', labelTxt: 'Alpha' },
      { inputId: 'opt-2', value: 'beta', labelTxt: 'Beta' },
      { inputId: 'opt-3', value: 'gamma', labelTxt: 'Gamma', disabled: false },
    ],
    groupTitle: 'Pick one or more',
    groupTitleSize: 'text-sm',
  },
};

const buildEl = (args) => {
  const el = document.createElement('checkbox-component');

  // Mode flags
  el.checkbox = !!args.checkbox;
  el.customCheckbox = !!args.customCheckbox;
  el.checkboxGroup = !!args.checkboxGroup;
  el.customCheckboxGroup = !!args.customCheckboxGroup;

  // Common props
  el.inputId = args.inputId;
  el.name = args.name;
  el.labelTxt = args.labelTxt;
  el.value = args.value;
  el.size = args.size;
  el.inline = !!args.inline;
  el.required = !!args.required;
  el.disabled = !!args.disabled;
  el.validation = !!args.validation;
  el.validationMsg = args.validationMsg;

  // Single
  el.checked = !!args.checked;

  // Group
  el.groupTitle = args.groupTitle;
  el.groupTitleSize = args.groupTitleSize;

  // Accept array or JSON string for groupOptions
  el.groupOptions = Array.isArray(args.groupOptions)
    ? args.groupOptions
    : (() => {
        try {
          return JSON.parse(args.groupOptions || '[]');
        } catch {
          return [];
        }
      })();

  // Events -> SB Actions
  el.addEventListener('groupChange', (e) => action('groupChange')(e.detail));
  el.addEventListener('toggle', (e) => action('toggle')(e.detail));

  return el;
};

const Template = (args) => buildEl(args);

// ===== Stories =====

export const SingleBasic = Template.bind({});
SingleBasic.args = {
  checkbox: true,
  customCheckbox: false,
  checkboxGroup: false,
  customCheckboxGroup: false,
  inputId: 'agree-1',
  labelTxt: 'I agree to the terms',
  value: 'agree',
};

export const SingleRequired = Template.bind({});
SingleRequired.args = {
  checkbox: true,
  required: true,
  validation: true,
  validationMsg: 'Please agree before continuing.',
};

export const SingleCustom = Template.bind({});
SingleCustom.args = {
  checkbox: false,
  customCheckbox: true,
  inputId: 'custom-1',
  labelTxt: 'Custom styled checkbox',
};

export const GroupInline = Template.bind({});
GroupInline.args = {
  checkbox: false,
  customCheckbox: false,
  checkboxGroup: true,
  customCheckboxGroup: false,
  name: 'flavors',
  inline: true,
  groupTitle: 'Flavors (inline)',
  groupOptions: [
    { inputId: 'fl-1', value: 'vanilla', labelTxt: 'Vanilla' },
    { inputId: 'fl-2', value: 'chocolate', labelTxt: 'Chocolate', checked: true },
    { inputId: 'fl-3', value: 'strawberry', labelTxt: 'Strawberry', disabled: false },
  ],
};

export const GroupCustomStyled = Template.bind({});
GroupCustomStyled.args = {
  checkbox: false,
  checkboxGroup: false,
  customCheckboxGroup: true,
  name: 'letters',
  groupTitle: 'Custom group',
  groupTitleSize: 'text-sm',
  groupOptions: [
    { inputId: 'cg-1', value: 'A', labelTxt: 'Option A' },
    { inputId: 'cg-2', value: 'B', labelTxt: 'Option B', checked: true },
    { inputId: 'cg-3', value: 'C', labelTxt: 'Option C' },
  ],
};

export const GroupWithValidation = Template.bind({});
GroupWithValidation.args = {
  checkbox: false,
  checkboxGroup: true,
  name: 'features',
  required: true,
  validation: true,
  validationMsg: 'Select at least one option.',
  groupTitle: 'Required group',
  groupOptions: [
    { inputId: 'ft-1', value: 'sync', labelTxt: 'Sync' },
    { inputId: 'ft-2', value: 'backup', labelTxt: 'Backup' },
    { inputId: 'ft-3', value: 'share', labelTxt: 'Share' },
  ],
};
