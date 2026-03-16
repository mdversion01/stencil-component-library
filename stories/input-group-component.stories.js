// src/stories/input-group-component.stories.js

export default {
  title: 'Form/Input Group',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The `input-group-component` is a wrapper for an input field that allows you to easily add prepend and append content, such as icons or buttons. It also supports various form layouts and validation states.',
      },
      source: {
        language: 'html',
        // IMPORTANT: docs preview must reflect CURRENT args (including Controls changes)
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    // =========================
    // Input Attributes (A–Z)
    // =========================
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Input Attributes' },
      description: 'When enabled, the input group and its child input field will be disabled, preventing user interaction and applying appropriate disabled styles.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes', defaultValue: { summary: 'amount-play' } },
      description: 'ID for the input field, used to associate the label with the input for accessibility. This should be unique on the page.',
    },
    placeholder: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Placeholder text for the input field.',
    },
    type: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Type of the input field (e.g., "text", "password", "email").',
    },
    value: {
      control: 'text',
      description: 'The value of the input field',
      table: { category: 'Input Attributes' },
    },

    // =========================
    // Layout (A–Z)
    // =========================
    append: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: true } },
      description:
        'When enabled, the append slot is available for adding content after the input field. This can be used for buttons, icons, or other elements that should appear on the right side of the input.',
    },
    appendIcon: {
      control: 'text',
      name: 'append-icon',
      table: { category: 'Layout' },
      description:
        'Specify an icon class (e.g., from Font Awesome) to display an icon on the right side of the input field. This is a quick way to add an icon without needing to use the append slot.',
    },
    appendId: {
      control: 'text',
      name: 'append-id',
      table: { category: 'Layout' },
      description: 'ID for the append element, used for accessibility or targeting with JavaScript.',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      description:
        'Form layout variant. "Horizontal" uses a grid layout with label and input side by side. "Inline" is similar but uses auto-width columns for a more compact display.',
      table: { category: 'Layout' },
    },
    icon: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Specify an icon class (e.g., from Font Awesome) to display an icon inside the input group.',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'input-col',
      table: { category: 'Layout' },
      description: 'Number of grid columns for the input (horizontal layout only)',
    },
    inputCols: {
      control: 'text',
      table: { category: 'Layout' },
      name: 'input-cols',
      description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8"',
    },
    label: { control: 'text', table: { category: 'Layout' }, description: 'Label text for the input' },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Alignment for the label text (only applies when label is visible)',
    },
    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'label-col',
      table: { category: 'Layout' },
      description: 'Number of grid columns for the label (horizontal layout only)',
    },
    labelCols: {
      control: 'text',
      table: { category: 'Layout' },
      name: 'label-cols',
      description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4"',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Visually hide the label (but keep it accessible to screen readers)',
    },
    labelSize: { control: { type: 'select' }, options: ['base', 'xs', 'sm', 'lg'], table: { category: 'Layout' } },
    otherContent: {
      control: 'boolean',
      name: 'other-content',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'When enabled, the story will include example content in the prepend and append slots to demonstrate how they work.',
    },
    prepend: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'When enabled, the prepend slot is available for adding content before the input field.',
    },
    prependIcon: {
      control: 'text',
      name: 'prepend-icon',
      table: { category: 'Layout' },
      description: 'Specify an icon class to display an icon inside the prepend slot.',
    },
    prependId: {
      control: 'text',
      name: 'prepend-id',
      table: { category: 'Layout' },
      description: 'ID for the prepend element, used for accessibility or targeting with JavaScript.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description: 'Size variant.',
    },

    // =========================
    // Validation (A–Z)
    // =========================
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      description: 'Mark the input as required',
    },
    validation: {
      control: 'boolean',
      name: 'validation',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Enable or disable validation state',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'Message to display when validation fails',
    },
  },
};

/** ---------------- Docs helpers ---------------- */

const normalize = value => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const buildDocsHtml = args => {
  const a = { ...args };

  const attrs = [
    ['append', !!a.append],
    ['append-icon', normalize(a.appendIcon)],
    ['append-id', normalize(a.appendId)],
    ['disabled', !!a.disabled],
    ['form-layout', normalize(a.formLayout)],
    ['icon', normalize(a.icon)],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['input-cols', normalize(a.inputCols)],
    ['input-id', normalize(a.inputId)],
    ['label', normalize(a.label)],
    ['label-align', normalize(a.labelAlign)],
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['label-cols', normalize(a.labelCols)],
    ['label-hidden', !!a.labelHidden],
    ['other-content', !!a.otherContent],
    ['placeholder', normalize(a.placeholder)],
    ['prepend', !!a.prepend],
    ['prepend-icon', normalize(a.prependIcon)],
    ['prepend-id', normalize(a.prependId)],
    ['required', !!a.required],
    ['size', normalize(a.size)],
    ['validation', !!a.validation],
    ['validation-message', normalize(a.validationMessage)],
    ['value', normalize(a.value)],
  ];

  const attrStr = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  const openTag = attrStr ? `<input-group-component ${attrStr}>` : '<input-group-component>';

  const slotLines = [];
  if (a.otherContent && a.prepend) {
    slotLines.push(`  <button-component slot="prepend" type="button" variant="secondary">Go</button-component>`);
  }
  if (a.otherContent && a.append) {
    slotLines.push(`  <button-component slot="append" type="button" variant="secondary">Go</button-component>`);
  }

  return [openTag, ...slotLines, '</input-group-component>'].join('\n');
};

/** ---------------- Render (string markup so slots render correctly) ---------------- */

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) => {
  const v = normalize(val);
  return v === undefined || v === false ? '' : v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
};

const Template = args => {
  const usePrependSlot = !!args.otherContent && !!args.prepend;
  const useAppendSlot = !!args.otherContent && !!args.append;

  return `
<input-group-component
${boolAttr('append', !!args.append)}
 ${useAppendSlot ? '' : attr('append-icon', args.appendIcon)}
 ${attr('append-id', args.appendId)}
 ${boolAttr('disabled', !!args.disabled)}
 ${attr('form-layout', args.formLayout)}
 ${attr('icon', args.icon)}
 ${attr('input-col', args.inputCol)}
 ${attr('input-cols', args.inputCols)}
 ${attr('input-id', args.inputId)}
 ${attr('label', args.label)}
 ${attr('label-align', args.labelAlign)}
 ${attr('label-col', args.labelCol)}
 ${attr('label-cols', args.labelCols)}
 ${boolAttr('label-hidden', !!args.labelHidden)}
 ${boolAttr('other-content', !!args.otherContent)}
 ${attr('placeholder', args.placeholder)}
 ${boolAttr('prepend', !!args.prepend)}
 ${usePrependSlot ? '' : attr('prepend-icon', args.prependIcon)}
 ${attr('prepend-id', args.prependId)}
 ${boolAttr('required', !!args.required)}
 ${attr('size', args.size)}
 ${boolAttr('validation', !!args.validation)}
 ${attr('validation-message', args.validationMessage)}
 ${attr('value', args.value)}
>
 ${usePrependSlot ? `<button-component slot="prepend" type="button" variant="secondary">Go</button-component>` : ''}
 ${useAppendSlot ? `<button-component slot="append" type="button" variant="secondary">Go</button-component>` : ''}
</input-group-component>
`;
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Amount',
  inputId: 'amount-play',
  placeholder: 'Enter amount',
  size: '',
  formLayout: '',
  labelHidden: false,
  labelAlign: '',
  required: false,
  disabled: false,

  prepend: false,
  append: true,
  // otherContent: true,
  icon: '',
  prependIcon: 'fa-solid fa-dollar-sign',
  appendIcon: 'fa-solid fa-dollar-sign',
  appendId: '',
  prependId: '',

  validation: false,
  validationMessage: 'Please provide a value.',
  value: '',

  labelCols: '',
  inputCols: '',
  labelCol: 2,
  inputCol: 10,
};
Basic.storyName = 'Basic Usage';
Basic.parameters = {
  docs: {
    description: {
      story: 'This is a basic example of the input group component with an append icon. You can customize the label, placeholder, and icons using the controls.',
    },
  },
};

export const RequiredWithValidation = Template.bind({});
RequiredWithValidation.storyName = 'Required + Validation';
RequiredWithValidation.args = {
  ...Basic.args,
  required: true,
  validation: true,
  validationMessage: 'Please provide a value.',
  value: '',
  appendIcon: 'fa-solid fa-dollar-sign',
  append: true,
  prependIcon: '',
  prepend: false,
};
RequiredWithValidation.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates the required and validation states. The input is marked as required, and validation is enabled. If you try to submit without entering a value, the validation message will appear.',
    },
  },
};

export const DisabledState = Template.bind({});
DisabledState.storyName = 'Disabled';
DisabledState.args = {
  ...Basic.args,
  inputId: 'amount-disabled',
  label: 'Amount',
  disabled: true,
  prepend: false,
  append: true,
  otherContent: false,
  prependIcon: '',
  appendIcon: 'fa-solid fa-dollar-sign',
};
DisabledState.parameters = {
  docs: {
    description: {
      story:
        'This example shows the disabled state of the input group. When disabled, the input and any content in the prepend and append slots will be non-interactive and styled accordingly.',
    },
  },
};

export const AppendAndPrependWithSlots = Template.bind({});
AppendAndPrependWithSlots.storyName = 'Append + Prepend (Slots)';
AppendAndPrependWithSlots.args = {
  ...Basic.args,
  inputId: 'amount1',
  label: 'Amount',
  prepend: true,
  append: true,
  otherContent: true,
  prependIcon: 'fa-solid fa-dollar-sign',
  appendIcon: '',
};
AppendAndPrependWithSlots.parameters = {
  docs: {
    description: {
      story:
        'This example shows both prepend and append content using slots. The prepend slot contains a dollar sign icon, and the append slot contains a button. This demonstrates how you can use the slots to add more complex content on either side of the input.',
    },
  },
};

export const AppendSlotOnly = Template.bind({});
AppendSlotOnly.storyName = 'Append Slot Only';
AppendSlotOnly.args = {
  ...Basic.args,
  inputId: 'amount-append',
  prepend: false,
  append: true,
  otherContent: true,
};
AppendSlotOnly.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates using only the append slot. The append slot contains a button, while the prepend side is left empty. This shows how you can choose to use only one of the slots if needed.',
    },
  },
};

export const PrependSlotOnly = Template.bind({});
PrependSlotOnly.storyName = 'Prepend Slot Only';
PrependSlotOnly.args = {
  ...Basic.args,
  inputId: 'amount-prepend',
  prepend: true,
  append: false,
  otherContent: true,

  // IMPORTANT: clear icons so the component uses the SLOT path
  icon: '',
  prependIcon: '',
  appendIcon: '',
};
PrependSlotOnly.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates using only the prepend slot. The prepend slot contains a dollar sign icon, while the append side is left empty. This shows how you can choose to use only one of the slots if needed.',
    },
  },
};

export const IconsBothSides = Template.bind({});
IconsBothSides.storyName = 'Icons on Both Sides (No Slots)';
IconsBothSides.args = {
  ...Basic.args,
  inputId: 'amount2',
  otherContent: false,
  prepend: true,
  append: true,
  prependIcon: 'fa-solid fa-dollar-sign',
  appendIcon: 'fa-solid fa-dollar-sign',
};
IconsBothSides.parameters = {
  docs: {
    description: {
      story:
        'This example shows how to use icons on both sides of the input without using the slots. By setting the prependIcon and appendIcon properties, you can easily add icons to either side of the input field.',
    },
  },
};

export const SearchWithAppendButton = Template.bind({});
SearchWithAppendButton.storyName = 'Search + Append Slot Button';
SearchWithAppendButton.args = {
  ...Basic.args,
  label: 'Search',
  inputId: 'q',
  placeholder: '',
  prepend: false,
  append: true,
  otherContent: true,
  prependIcon: '',
  appendIcon: '',
};
SearchWithAppendButton.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates a common use case for input groups: a search field with an append button. The append slot contains a "Go" button, allowing users to submit their search query.',
    },
  },
};
