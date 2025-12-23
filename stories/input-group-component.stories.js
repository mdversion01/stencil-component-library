// src/stories/input-group-component.stories.js

export default {
  title: 'Form/Input Group',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { source: { type: 'dynamic' } },
  },
  argTypes: {
    label: { control: 'text', description: 'Label for the input field' },
    inputId: { control: 'text' },
    placeholder: { control: 'text' },
    size: { control: { type: 'radio' }, options: ['', 'sm', 'lg'] },
    formLayout: { control: { type: 'radio' }, options: ['', 'horizontal', 'inline'] },
    labelHidden: { control: 'boolean' },
    labelAlign: { control: { type: 'radio' }, options: ['', 'right'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },

    // adornments
    prepend: { control: 'boolean' },
    append: { control: 'boolean' },
    otherContent: { control: 'boolean' },
    icon: { control: 'text' },
    prependIcon: { control: 'text' },
    appendIcon: { control: 'text' },

    // validation
    validation: { control: 'boolean' },
    validationMessage: { control: 'text' },

    // value
    value: { control: 'text' },

    // grid
    labelCols: { control: 'text' },
    inputCols: { control: 'text' },
    labelCol: { control: 'number' },
    inputCol: { control: 'number' },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) => (val !== undefined && val !== null && val !== '' ? ` ${name}="${String(val)}"` : '');

/** Base, interactive story (controls) */
const Template = args => `
<input-group-component
  ${attr('label', args.label)}
  ${attr('input-id', args.inputId)}
  ${attr('placeholder', args.placeholder)}
  ${attr('size', args.size)}
  ${attr('form-layout', args.formLayout)}
  ${boolAttr('label-hidden', args.labelHidden)}
  ${attr('label-align', args.labelAlign)}
  ${boolAttr('required', args.required)}
  ${boolAttr('disabled', args.disabled)}

  ${boolAttr('prepend', args.prepend)}
  ${boolAttr('append', args.append)}
  ${boolAttr('other-content', args.otherContent)}
  ${attr('icon', args.icon)}
  ${attr('prepend-icon', args.prependIcon)}
  ${attr('append-icon', args.appendIcon)}

  ${boolAttr('validation', args.validation)}
  ${attr('validation-message', args.validationMessage)}
  ${attr('value', args.value)}

  ${attr('label-cols', args.labelCols)}
  ${attr('input-cols', args.inputCols)}
  ${attr('label-col', args.labelCol)}
  ${attr('input-col', args.inputCol)}
>
  ${args.otherContent && args.append ? `<button-component slot="append" type="button" variant="secondary">Go</button-component>` : ''}
  ${args.otherContent && args.prepend ? `<button-component slot="prepend" type="button" variant="secondary">Do</button-component>` : ''}
</input-group-component>
`;

// ---- Interactive story -------------------------------------------------------

export const Playground = Template.bind({});
Playground.args = {
  label: 'Amount',
  inputId: 'amount-play',
  placeholder: 'Enter amount',
  size: '',
  formLayout: '',
  labelHidden: false,
  labelAlign: '',
  required: false,
  disabled: false,

  prepend: true,
  append: true,
  otherContent: true,
  icon: '',
  prependIcon: 'fa-solid fa-dollar-sign',
  appendIcon: '',

  validation: false,
  validationMessage: 'Please provide a value.',
  value: '',

  labelCols: '',
  inputCols: '',
  labelCol: 2,
  inputCol: 10,
};

// ---- Exact examples you requested (literal markup) ---------------------------

/** Example 1: prepend icon, append slot button */
export const AppendAndPrependWithSlots = () => `
<input-group-component
  label="Amount"
  input-id="amount1"
  other-content
  append
  prepend
  prepend-icon="fa-solid fa-dollar-sign"
>
  <button-component slot="append" type="button" variant="secondary">Go</button-component>
</input-group-component>
`;

/** Example 2: append slot only */
export const AppendSlotOnly = () => `
<input-group-component label="Amount" input-id="amount" other-content append>
  <button-component slot="append" type="button" variant="secondary">Go</button-component>
</input-group-component>
`;

/** Example 3: icons on both sides (no slots) */
export const IconsBothSides = () => `
<input-group-component
  label="Amount"
  input-id="amount2"
  append
  append-icon="fa-solid fa-dollar-sign"
  prepend
  prepend-icon="fa-solid fa-dollar-sign"
>
</input-group-component>
`;

/** Example 4: search with append slot button */
export const SearchWithAppendButton = () => `
<input-group-component label="Search" input-id="q" append other-content>
  <button-component slot="append" type="button" variant="secondary">Go</button-component>
</input-group-component>
`;
