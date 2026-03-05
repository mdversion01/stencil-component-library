// stories/checkbox-component.stories.js
import { action } from '@storybook/addon-actions';

// ======================================================
// Helpers (normalize + docs HTML builder)
// ======================================================

/** Collapse blank lines + trim edges */
const normalize = txt => {
  const lines = txt
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

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

/** Build clean attribute block (skips undefined/null/''/false; boolean true -> attribute only) */
const attrs = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v)}"`))
    .join('\n  ');

const escapeAttr = v => String(v).replaceAll('"', '&quot;');

/** Pretty JSON for docs (multi-line, stable-ish) */
const prettyJson = v => {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return '[]';
  }
};

/**
 * Build the docs preview HTML for the "Source" panel.
 * - Shows explicit props/attrs for the chosen mode
 * - Wraps long output nicely (multi-line attrs + multi-line groupOptions when relevant)
 */
const buildDocsHtml = args => {
  const mode = {
    customCheckbox: !!args.customCheckbox,
    checkboxGroup: !!args.checkboxGroup,
    customCheckboxGroup: !!args.customCheckboxGroup,
  };

  const isGroup = mode.checkboxGroup || mode.customCheckboxGroup;
  const isSingle = mode.checkbox || mode.customCheckbox;

  // Prefer group title labelTxt only if groupTitle missing (per your argType comment)
  const effectiveGroupTitle = args.groupTitle || args.labelTxt || '';

  const attributeBlock = attrs([
    // Mode flags (explicit)
    ['checkbox', mode.checkbox],
    ['custom-checkbox', mode.customCheckbox],
    ['checkbox-group', mode.checkboxGroup],
    ['custom-checkbox-group', mode.customCheckboxGroup],

    // Common/shared (as attributes for docs readability)
    ['input-id', args.inputId],
    ['name', args.name],
    ['label-txt', args.labelTxt],
    ['value', args.value],
    ['size', args.size],
    ['inline', !!args.inline],
    ['required', !!args.required],
    ['disabled', !!args.disabled],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],

    // Single-specific
    ['checked', isSingle ? !!args.checked : false],

    // Group-specific
    ['group-title', isGroup ? effectiveGroupTitle : ''],
    ['group-title-size', isGroup ? args.groupTitleSize : ''],
  ]);

  // Group options are a PROPERTY in your template, so show it as JS assignment in docs.
  // (This keeps the docs accurate while still being readable.)
  const groupOptions = Array.isArray(args.groupOptions)
    ? args.groupOptions
    : (() => {
        try {
          return JSON.parse(args.groupOptions || '[]');
        } catch {
          return [];
        }
      })();

  const groupOptionsJs = isGroup
    ? normalize(`
<script>
  // groupOptions is assigned as a PROPERTY (array), not an HTML attribute
  const groupOptions = ${prettyJson(groupOptions)};
</script>
`)
    : '';

  // Render a concise wrapper so the docs snippet is not a single mega-line.
  return normalize(`
<checkbox-component
    ${attributeBlock}
  ></checkbox-component>
${groupOptionsJs}
`);
};

export default {
  title: 'Form/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: ['Checkbox component for single or multiple selections with optional custom styles.', ''].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    // Rendering modes
    customCheckbox: { control: 'boolean', table: { category: 'Rendering Modes', defaultValue: { summary: false } }, description: 'Single checkbox (custom styles)' },
    checkboxGroup: { control: 'boolean', table: { category: 'Rendering Modes', defaultValue: { summary: false } }, description: 'Render a group of checkboxes' },
    customCheckboxGroup: { control: 'boolean', table: { category: 'Rendering Modes', defaultValue: { summary: false } }, description: 'Group with custom styles' },

    // Shared props
    inputId: { control: 'text', name: 'input-id', description: 'ID for the input element (single) or prefix for group inputs', table: { category: 'Shared Props' } },
    name: { control: 'text', table: { category: 'Shared Props' }, description: 'Name attribute for the input(s), important for grouping and form submission' },
    labelTxt: { control: 'text', name: 'label-txt', table: { category: 'Shared Props' }, description: 'Label text for single checkbox or group title (if groupTitle not used)' },
    value: { control: 'text', table: { category: 'Shared Props' }, description: 'Value attribute for the input(s), important for form submission and events' },
    size: { control: 'text', table: { category: 'Shared Props' }, description: 'Size modifier for the checkbox (e.g., "sm", "lg")' },
    inline: { control: 'boolean', table: { category: 'Shared Props' }, description: 'Whether to display checkboxes inline (only applies to groups)' },
    required: { control: 'boolean', table: { category: 'Shared Props' }, description: 'Whether the checkbox is required' },
    disabled: { control: 'boolean', table: { category: 'Shared Props' }, description: 'Whether the checkbox is disabled' },
    validation: { control: 'boolean', table: { category: 'Shared Props' }, description: 'Whether to enable validation' },
    validationMsg: { control: 'text', name: 'validation-msg', table: { category: 'Shared Props' }, description: 'Validation message to display' },

    // Single checkbox state
    checked: { control: 'boolean', table: { category: 'Single Checkbox Props', defaultValue: { summary: false } }, description: 'Whether the single checkbox is checked' },

    // Group props
    groupOptions: {
      control: 'object',
      description: 'Array of { inputId, value, labelTxt, disabled?, checked? } or JSON string',
      table: { category: 'Group Props' },
      name: 'group-options',
    },
    groupTitle: { control: 'text', name: 'group-title', table: { category: 'Group Props' }, description: 'Title for the checkbox group' },
    groupTitleSize: { control: 'text', name: 'group-title-size', table: { category: 'Group Props' }, description: 'Size modifier for the group title' },
  },
  args: {
    // defaults lean toward single checkbox
    checked: false,
    checkboxGroup: false,
    customCheckbox: false,
    customCheckboxGroup: false,
    disabled: false,
    groupOptions: [
      { inputId: 'opt-1', value: 'alpha', labelTxt: 'Alpha' },
      { inputId: 'opt-2', value: 'beta', labelTxt: 'Beta' },
      { inputId: 'opt-3', value: 'gamma', labelTxt: 'Gamma', disabled: false },
    ],
    groupTitle: 'Pick one or more',
    groupTitleSize: 'text-sm',
    inline: false,
    inputId: 'agree-1',
    labelTxt: 'I agree to the terms',
    name: 'agree',
    required: false,
    size: '',
    validation: false,
    validationMsg: '',
    value: 'agree',
  },
};

const buildEl = args => {
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
  el.addEventListener('groupChange', e => action('groupChange')(e.detail));
  el.addEventListener('toggle', e => action('toggle')(e.detail));

  return el;
};

const Template = args => buildEl(args);

// ===== Stories =====

export const SingleBasic = Template.bind({});
SingleBasic.args = {
  customCheckbox: false,
  checkboxGroup: false,
  customCheckboxGroup: false,
  inputId: 'agree-1',
  labelTxt: 'I agree to the terms',
  value: 'agree',
};

export const SingleRequired = Template.bind({});
SingleRequired.args = {
  required: true,
  validation: true,
  validationMsg: 'Please agree before continuing.',
};

export const SingleCustom = Template.bind({});
SingleCustom.args = {
  customCheckbox: true,
  inputId: 'custom-1',
  labelTxt: 'Custom styled checkbox',
};

export const GroupInline = Template.bind({});
GroupInline.args = {
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
