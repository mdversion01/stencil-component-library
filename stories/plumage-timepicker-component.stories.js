// src/stories/plumage-timepicker-component.stories.js

export default {
  title: 'Components/Timepicker/Plumage Timepicker',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    // Demo-only wrapper
    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      description: 'Demo wrapper width (px)',
    },

    // Component props
    ariaLabel: { control: 'text', name: 'aria-label' },
    ariaLabelledby: { control: 'text', name: 'aria-labelledby' },
    showLabel: { control: 'boolean', name: 'show-label' },
    labelText: { control: 'text', name: 'label-text' },

    inputId: { control: 'text', name: 'input-id' },
    inputName: { control: 'text', name: 'input-name' },

    isTwentyFourHourFormat: {
      control: 'boolean',
      name: 'is-twenty-four-hour-format',
      description: 'Initial preference (24h). Component may toggle internally.',
    },

    size: { control: { type: 'radio' }, options: ['', 'sm', 'lg'] },

    validationMessage: { control: 'text', name: 'validation-message' },

    twentyFourHourOnly: { control: 'boolean', name: 'twenty-four-hour-only' },
    twelveHourOnly: { control: 'boolean', name: 'twelve-hour-only' },

    hideTimepickerBtn: { control: 'boolean', name: 'hide-timepicker-btn' },
    isValid: { control: 'boolean', name: 'is-valid' },

    hideSeconds: { control: 'boolean', name: 'hide-seconds' },

    inputWidth: { control: { type: 'number', min: 0, step: 1 }, name: 'input-width' },

    // Plumage underline helpers
    validation: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, v) =>
  v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`;

// Base template
const Template = (args) => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';
  return `
  <div class="timepicker-wrapper" style="${width ? `width:${width};` : ''}">
    <plumage-timepicker-component
      ${attr('aria-label', args.ariaLabel)}
      ${attr('aria-labelledby', args.ariaLabelledby)}
      ${boolAttr('show-label', args.showLabel)}
      ${attr('label-text', args.labelText)}
      ${attr('input-id', args.inputId)}
      ${attr('input-name', args.inputName)}
      ${boolAttr('is-twenty-four-hour-format', args.isTwentyFourHourFormat)}
      ${attr('size', args.size)}
      ${attr('validation-message', args.validationMessage)}
      ${boolAttr('twenty-four-hour-only', args.twentyFourHourOnly)}
      ${boolAttr('twelve-hour-only', args.twelveHourOnly)}
      ${boolAttr('hide-timepicker-btn', args.hideTimepickerBtn)}
      ${boolAttr('is-valid', args.isValid)}
      ${boolAttr('hide-seconds', args.hideSeconds)}
      ${attr('input-width', args.inputWidth)}
      ${boolAttr('validation', args.validation)}
      ${boolAttr('disabled', args.disabled)}
    ></plumage-timepicker-component>
  </div>`;
};

/* =========================
   Stories
   ========================= */

export const Default = Template.bind({});
Default.args = {
  wrapperWidth: 280,
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  showLabel: false,
  labelText: 'Enter Time',
  inputId: 'time-input',
  inputName: 'time',
  isTwentyFourHourFormat: true,
  size: '',
  validationMessage: '',
  twentyFourHourOnly: false,
  twelveHourOnly: false,
  hideTimepickerBtn: false,
  isValid: true,
  hideSeconds: false,
  inputWidth: null,
  validation: false,
  disabled: false,
};

export const Small = Template.bind({});
Small.args = {
  ...Default.args,
  wrapperWidth: 220,
  size: 'sm',
};

export const LargeWithVisibleLabel = Template.bind({});
LargeWithVisibleLabel.args = {
  ...Default.args,
  wrapperWidth: 340,
  size: 'lg',
  showLabel: true,
  labelText: 'Enter Time',
};

export const TwentyFourHourOnly = Template.bind({});
TwentyFourHourOnly.args = {
  ...Default.args,
  wrapperWidth: 320,
  twentyFourHourOnly: true,
  twelveHourOnly: false,
  isTwentyFourHourFormat: true,
  showLabel: true,
  labelText: '24-hour Time',
};

export const TwelveHourOnly = Template.bind({});
TwelveHourOnly.args = {
  ...Default.args,
  wrapperWidth: 320,
  twentyFourHourOnly: false,
  twelveHourOnly: true,
  isTwentyFourHourFormat: false,
  showLabel: true,
  labelText: '12-hour Time',
};

export const HideSeconds = Template.bind({});
HideSeconds.args = {
  ...Default.args,
  wrapperWidth: 280,
  hideSeconds: true,
  showLabel: true,
  labelText: 'HH:mm (no seconds)',
};

export const NoPopoverButton = Template.bind({});
NoPopoverButton.args = {
  ...Default.args,
  wrapperWidth: 260,
  hideTimepickerBtn: true,
  showLabel: true,
  labelText: 'Manual Entry Only',
};

export const WithValidationMessage = Template.bind({});
WithValidationMessage.args = {
  ...Default.args,
  wrapperWidth: 320,
  validationMessage: 'Please enter a valid time.',
  // keep enabled, just demo the message:
  isValid: true,
};

export const CustomInputWidth = Template.bind({});
CustomInputWidth.args = {
  ...Default.args,
  wrapperWidth: 460,
  inputWidth: 320,
  showLabel: true,
  labelText: 'Custom Width',
};

export const PlumageUnderlineStates = Template.bind({});
PlumageUnderlineStates.args = {
  ...Default.args,
  wrapperWidth: 300,
  showLabel: true,
  validation: true, // shows underline invalid state
  validationMessage: 'Example invalid state',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  wrapperWidth: 300,
  showLabel: true,
  disabled: true,
  validation: false,
};
