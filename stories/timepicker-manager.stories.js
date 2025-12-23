// src/stories/timepicker-manager.stories.js

export default {
  title: 'Components/Timepicker/Timepicker Manager',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    // Visual wrapper (for demo only)
    wrapperWidth: { control: { type: 'number', min: 120, step: 10 }, description: 'Demo wrapper width (px)' },

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
      description: 'Initial format preference (24h)',
    },

    size: { control: { type: 'radio' }, options: ['', 'sm', 'lg'] },

    validationMessage: { control: 'text', name: 'validation-message' },
    twentyFourHourOnly: { control: 'boolean', name: 'twenty-four-hour-only' },
    twelveHourOnly: { control: 'boolean', name: 'twelve-hour-only' },
    hideTimepickerBtn: { control: 'boolean', name: 'hide-timepicker-btn' },
    isValid: { control: 'boolean', name: 'is-valid' },
    hideSeconds: { control: 'boolean', name: 'hide-seconds' },

    usePlTimepicker: {
      control: 'boolean',
      name: 'use-pl-timepicker',
      description: 'Render <plumage-timepicker-component> instead of <timepicker-component>',
    },

    inputWidth: { control: { type: 'number', min: 0, step: 1 }, name: 'input-width' },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, v) =>
  v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`;

const Template = (args) => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';
  return `
  <div class="timepicker-wrapper" style="${width ? `width:${width};` : ''}">
    <timepicker-manager
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
      ${boolAttr('use-pl-timepicker', args.usePlTimepicker)}
      ${attr('input-width', args.inputWidth)}
    ></timepicker-manager>
  </div>`;
};

/* =========================
   Stories
   ========================= */

export const PlumageLargeWithLabel = Template.bind({});
PlumageLargeWithLabel.args = {
  wrapperWidth: 500,
  usePlTimepicker: true,
  size: 'lg',
  inputId: 'one',
  showLabel: true,
  labelText: 'Add Time',
  // other defaults
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  inputName: 'time',
  isTwentyFourHourFormat: true,
  validationMessage: '',
  twentyFourHourOnly: false,
  twelveHourOnly: false,
  hideTimepickerBtn: false,
  isValid: true,
  hideSeconds: false,
  inputWidth: null,
};

export const SmallDefault = Template.bind({});
SmallDefault.args = {
  wrapperWidth: 210,
  size: 'sm',
  usePlTimepicker: false,
  showLabel: false,
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
  inputId: 'time-input',
  inputName: 'time',
  isTwentyFourHourFormat: true,
  validationMessage: '',
  twentyFourHourOnly: false,
  twelveHourOnly: false,
  hideTimepickerBtn: false,
  isValid: true,
  hideSeconds: false,
  inputWidth: null,
};

export const LargeWithLabel = Template.bind({});
LargeWithLabel.args = {
  wrapperWidth: 210,
  size: 'lg',
  showLabel: true,
  usePlTimepicker: false,
  ariaLabel: 'Time Picker',
  ariaLabelledby: 'time-label',
};

export const DefaultMedium = Template.bind({});
DefaultMedium.args = {
  wrapperWidth: 210,
  size: '',
  showLabel: false,
  usePlTimepicker: false,
};

export const TwelveHourOnly = Template.bind({});
TwelveHourOnly.args = {
  wrapperWidth: 320,
  twelveHourOnly: true,
  twentyFourHourOnly: false,
  isTwentyFourHourFormat: false,
  showLabel: true,
  labelText: '12-hour Time',
  size: 'sm',
};

export const TwentyFourHourOnlyHideSeconds = Template.bind({});
TwentyFourHourOnlyHideSeconds.args = {
  wrapperWidth: 320,
  twentyFourHourOnly: true,
  twelveHourOnly: false,
  isTwentyFourHourFormat: true,
  hideSeconds: true,
  showLabel: true,
  labelText: '24-hour (HH:mm)',
  size: 'sm',
};

export const CustomInputWidth = Template.bind({});
CustomInputWidth.args = {
  wrapperWidth: 400,
  inputWidth: 260,
  size: '',
  showLabel: true,
  labelText: 'Custom Width',
};
