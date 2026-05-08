// File: src/stories/input-group-component.stories.js

import DocsPage from './input-group-component.docs.mdx';
import {
  buildDocsHtml,
  buildEl,
  renderMatrixRow,
  snapshotA11y,
  template,
} from './input-group-component.story-helpers.js';

export default {
  title: 'Form/Input Group',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'The `input-group-component` is a wrapper for an input field that allows you to easily add prepend and append content, such as icons or buttons. It also supports various form layouts and validation states.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Input Attributes' },
      description:
        'When enabled, the input group and its child input field will be disabled, preventing user interaction and applying appropriate disabled styles.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes', defaultValue: { summary: 'amount-play' } },
      description:
        'ID for the input field, used to associate the label with the input for accessibility. This should be unique on the page.',
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
      description:
        'Global icon class used as a fallback on prepend/append when side-specific icons are not provided.',
    },
    prependIcon: {
      control: 'text',
      name: 'prepend-icon',
      table: { category: 'Layout' },
      description: 'Specify an icon class to display an icon inside the prepend side.',
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
    labelSize: {
      control: { type: 'select' },
      options: ['base', 'xs', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
    },
    otherContent: {
      control: 'boolean',
      name: 'other-content',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description:
        'When enabled, the story will include example content in the prepend and append slots to demonstrate how they work.',
    },
    prepend: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'When enabled, the prepend slot is available for adding content before the input field.',
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
  args: {
    label: 'Amount',
    inputId: 'amount-play',
    placeholder: 'Enter amount',
    type: 'text',
    value: '',
    disabled: false,

    formLayout: '',
    size: '',
    labelHidden: false,
    labelAlign: '',
    labelSize: 'sm',
    labelCols: '',
    inputCols: '',
    labelCol: 2,
    inputCol: 10,

    prepend: false,
    append: true,
    otherContent: false,
    icon: '',
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
    appendId: '',
    prependId: '',

    required: false,
    validation: false,
    validationMessage: 'Please provide a value.',
  },
};

const Template = (args) => template(args);

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
  otherContent: false,

  icon: '',
  prependIcon: '',
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
      story:
        'This is a basic example of the input group component with an append icon. You can customize the label, placeholder, and icons using the controls.',
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
        'This example demonstrates the required and validation states. The input is marked as required, and validation is enabled.',
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
  prependIcon: '',
  appendIcon: '',
};
AppendAndPrependWithSlots.parameters = {
  docs: {
    description: {
      story:
        'This example shows both prepend and append content using slots. This demonstrates how you can use the slots to add more complex content on either side of the input.',
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
  appendIcon: '',
};
AppendSlotOnly.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates using only the append slot. The append slot contains a button, while the prepend side is left empty.',
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
  icon: '',
  prependIcon: '',
  appendIcon: '',
};
PrependSlotOnly.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates using only the prepend slot. The prepend slot contains a button, while the append side is left empty.',
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
        'This example demonstrates a common use case for input groups: a search field with an append button. The append slot contains a "Go" button.',
    },
  },
};

export const AccessibilityMatrix = () => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + IDs.
      Also reports whether <code>aria-labelledby</code> / <code>aria-describedby</code> resolve to real elements.
    </div>
  `;
  root.appendChild(intro);

  const rows = [
    {
      title: 'Default',
      args: {
        label: 'Amount',
        inputId: 'igc-a11y-default',
        placeholder: 'Enter amount',
        type: 'text',
        formLayout: '',
        prepend: false,
        append: true,
        otherContent: false,
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        validationMessage: 'Please provide a value.',
      },
    },
    {
      title: 'Inline',
      args: {
        label: 'Amount',
        inputId: 'igc-a11y-inline',
        formLayout: 'inline',
        prepend: true,
        append: true,
        otherContent: false,
        prependIcon: 'fa-solid fa-dollar-sign',
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        validationMessage: 'Please provide a value.',
      },
    },
    {
      title: 'Horizontal (responsive cols)',
      args: {
        label: 'Amount',
        inputId: 'igc-a11y-horizontal',
        formLayout: 'horizontal',
        labelCols: 'xs-12 sm-4',
        inputCols: 'xs-12 sm-8',
        prepend: true,
        append: true,
        otherContent: false,
        prependIcon: 'fa-solid fa-dollar-sign',
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        validationMessage: 'Please provide a value.',
      },
    },
    {
      title: 'Error / Validation',
      args: {
        label: 'Email',
        inputId: 'igc-a11y-error',
        type: 'email',
        formLayout: '',
        prepend: false,
        append: true,
        otherContent: false,
        appendIcon: 'fa-solid fa-envelope',
        required: true,
        validation: true,
        validationMessage: 'Required field.',
        value: '',
      },
    },
    {
      title: 'Disabled',
      args: {
        label: 'Amount',
        inputId: 'igc-a11y-disabled',
        disabled: true,
        formLayout: '',
        prepend: false,
        append: true,
        otherContent: false,
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        validationMessage: 'Please provide a value.',
      },
    },
  ];

  rows.forEach((r, idx) => root.appendChild(renderMatrixRow({ ...r, idSuffix: String(idx + 1) })));

  return root;
};
AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of key states (default/inline/horizontal, error/validation, disabled). Each row prints computed role/aria/ids and whether ARIA references resolve.',
    },
    story: { height: '1200px' },
  },
  controls: { disable: true },
};
