// File: src/stories/checkbox-component/checkbox-component.stories.js

import DocsPage from './checkbox-component.docs.mdx';
import { buildDocsHtml, Template } from './checkbox-component.story-helpers.js';

export default {
  title: 'Form/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
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
    checkboxGroup: {
      control: 'boolean',
      name: 'checkbox-group',
      table: { category: 'Modes', defaultValue: { summary: false } },
      description: 'Render a group of checkboxes.',
    },
    customCheckboxGroup: {
      control: 'boolean',
      name: 'custom-checkbox-group',
      table: { category: 'Modes', defaultValue: { summary: false } },
      description: 'Render a group with custom styles.',
    },
    customCheckbox: {
      control: 'boolean',
      name: 'custom-checkbox',
      table: { category: 'Modes', defaultValue: { summary: false } },
      description: 'Render a single checkbox with custom styles.',
    },

    groupOptions: {
      control: 'object',
      name: 'group-options',
      table: { category: 'Group Attributes' },
      description: 'Array of { inputId, value, labelTxt, disabled?, checked? } (assigned as a PROPERTY).',
    },
    groupTitle: {
      control: 'text',
      name: 'group-title',
      table: { category: 'Group Attributes' },
      description: 'Title for the checkbox group.',
    },
    groupTitleSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'group-title-size',
      table: { category: 'Group Attributes' },
      description: 'Size modifier for the group title.',
    },

    checked: {
      control: 'boolean',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Whether the single checkbox is checked.',
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Whether the checkbox (single) is disabled.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes' },
      description: 'ID for the single input (and id for toggle event).',
    },
    labelTxt: {
      control: 'text',
      name: 'label-txt',
      table: { category: 'Input Attributes' },
      description: 'Label text for single checkbox. For groups, labels come from groupOptions.',
    },
    name: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Name attribute for the input(s).',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Input Attributes' },
      description: 'Size modifier class applied to inputs/labels.',
    },
    value: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Value attribute for single checkbox and emitted in toggle event.',
    },

    inline: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Whether to display group checkboxes inline.',
    },

    required: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the checkbox as required.',
    },
    validation: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Turns on validation styling/logic (shows message when required + not satisfied).',
    },
    validationMsg: {
      control: 'text',
      name: 'validation-msg',
      table: { category: 'Validation' },
      description: 'Validation message to display when invalid.',
    },
  },

  args: {
    checkboxGroup: false,
    customCheckbox: false,
    customCheckboxGroup: false,

    inputId: 'agree-1',
    labelTxt: 'I agree to the terms',
    name: 'agree',
    value: 'agree',
    size: '',
    inline: false,

    checked: false,
    disabled: false,

    required: false,
    validation: false,
    validationMsg: '',

    groupTitle: 'Pick one or more',
    groupTitleSize: '',
    groupOptions: [
      { inputId: 'opt-1', value: 'alpha', labelTxt: 'Alpha' },
      { inputId: 'opt-2', value: 'beta', labelTxt: 'Beta' },
      { inputId: 'opt-3', value: 'gamma', labelTxt: 'Gamma', disabled: false },
    ],
  },

  render: (args) => Template(args),
};

export const SingleBasic = Template.bind({});
SingleBasic.args = {
  customCheckbox: false,
  checkboxGroup: false,
  customCheckboxGroup: false,
  inputId: 'agree-1',
  labelTxt: 'I agree to the terms',
  value: 'agree',
  size: 'lg',
};
SingleBasic.storyName = 'Single Checkbox';
SingleBasic.parameters = {
  docs: { description: { story: 'A single checkbox with default styling.' } },
};

export const SingleRequired = Template.bind({});
SingleRequired.args = {
  required: true,
  validation: true,
  validationMsg: 'Please agree before continuing.',
};
SingleRequired.storyName = 'Single Required';
SingleRequired.parameters = {
  docs: { description: { story: 'A single checkbox that is required and includes validation.' } },
};

export const SingleCustom = Template.bind({});
SingleCustom.args = {
  customCheckbox: true,
  inputId: 'custom-1',
  labelTxt: 'Custom styled checkbox',
  size: 'lg',
};
SingleCustom.storyName = 'Single Custom';
SingleCustom.parameters = {
  docs: { description: { story: 'A single checkbox with custom styling.' } },
};

export const GroupInline = Template.bind({});
GroupInline.args = {
  checkboxGroup: true,
  customCheckbox: false,
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
GroupInline.storyName = 'Group Inline Layout';
GroupInline.parameters = {
  docs: { description: { story: 'A group of checkboxes displayed inline.' } },
};

export const GroupCustomStyled = Template.bind({});
GroupCustomStyled.args = {
  checkboxGroup: false,
  customCheckboxGroup: true,
  name: 'letters',
  groupTitle: 'Custom group',
  groupTitleSize: '',
  size: 'lg',
  groupOptions: [
    { inputId: 'cg-1', value: 'A', labelTxt: 'Option A' },
    { inputId: 'cg-2', value: 'B', labelTxt: 'Option B', checked: true },
    { inputId: 'cg-3', value: 'C', labelTxt: 'Option C' },
  ],
};
GroupCustomStyled.storyName = 'Group with Custom Styling';
GroupCustomStyled.parameters = {
  docs: { description: { story: 'A group of checkboxes with custom styling.' } },
};

export const GroupWithValidation = Template.bind({});
GroupWithValidation.args = {
  checkboxGroup: true,
  name: 'features',
  required: true,
  validation: true,
  validationMsg: 'Select at least one option.',
  groupTitle: 'Required group',
  size: 'lg',
  groupOptions: [
    { inputId: 'ft-1', value: 'sync', labelTxt: 'Sync' },
    { inputId: 'ft-2', value: 'backup', labelTxt: 'Backup' },
    { inputId: 'ft-3', value: 'share', labelTxt: 'Share' },
  ],
};
GroupWithValidation.storyName = 'Group with Validation';
GroupWithValidation.parameters = {
  docs: { description: { story: 'A group of checkboxes that is required and includes validation.' } },
};

export const SingleDisabled = Template.bind({});
SingleDisabled.args = {
  disabled: true,
  inputId: 'disabled-1',
  labelTxt: 'Disabled checkbox',
  value: 'disabled',
};
SingleDisabled.storyName = 'Single Disabled Checkbox';
SingleDisabled.parameters = {
  docs: { description: { story: 'A single checkbox that is disabled.' } },
};

export const GroupDisabledOptions = Template.bind({});
GroupDisabledOptions.args = {
  checkboxGroup: true,
  name: 'seating',
  groupTitle: 'Seating Preferences',
  groupOptions: [
    { inputId: 'seat-window', value: 'window', labelTxt: 'Window' },
    { inputId: 'seat-middle', value: 'middle', labelTxt: 'Middle', disabled: true },
    { inputId: 'seat-aisle', value: 'aisle', labelTxt: 'Aisle' },
  ],
};
GroupDisabledOptions.storyName = 'Group with Disabled Options';
GroupDisabledOptions.parameters = {
  docs: { description: { story: 'A group of checkboxes with some options disabled.' } },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML =
      `<strong>Accessibility matrix</strong>` +
      `<div style="opacity:.8">Default vs group inline. Validation + disabled. Prints computed ids and aria-* (fieldset/legend when group, label/for when single).</div>`;
    wrap.appendChild(title);

    const card = (labelText, build) => {
      const c = document.createElement('div');
      c.style.display = 'grid';
      c.style.gridTemplateColumns = '320px 1fr';
      c.style.gap = '12px';
      c.style.alignItems = 'start';
      c.style.border = '1px solid #ddd';
      c.style.borderRadius = '8px';
      c.style.padding = '12px';

      const left = document.createElement('div');
      left.innerHTML = `<div style="font-weight:600">${labelText}</div>`;

      const right = document.createElement('div');
      right.style.display = 'grid';
      right.style.gap = '8px';

      const demo = document.createElement('div');
      const built = build();
      demo.appendChild(built);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      right.appendChild(demo);
      right.appendChild(pre);

      c.appendChild(left);
      c.appendChild(right);

      const snapshot = () => {
        const host = demo.querySelector('checkbox-component');

        const fieldset = host?.querySelector('fieldset.checkbox-group');
        const legend = host?.querySelector('legend.group-title');
        const groupInputs = host ? Array.from(host.querySelectorAll('input[type="checkbox"]')) : [];

        const singleInput = host?.querySelector('.form-check-input, .custom-control-input');
        const singleLabel = host?.querySelector('label');

        const invalidFeedback = host?.querySelector('.invalid-feedback');

        pre.textContent = JSON.stringify(
          {
            mode: fieldset ? 'group' : 'single',
            fieldsetRole: fieldset?.getAttribute('role') ?? null,
            fieldsetAriaLabelledby: fieldset?.getAttribute('aria-labelledby') ?? null,
            fieldsetAriaDescribedby: fieldset?.getAttribute('aria-describedby') ?? null,
            fieldsetAriaInvalid: fieldset?.getAttribute('aria-invalid') ?? null,
            legendId: legend?.getAttribute('id') ?? null,
            legendText: legend?.textContent?.trim() ?? null,
            inputId: singleInput?.getAttribute('id') ?? null,
            inputName: singleInput?.getAttribute('name') ?? null,
            labelFor: singleLabel?.getAttribute('for') || singleLabel?.getAttribute('htmlfor') || (singleLabel ? singleLabel.htmlFor : null) || null,
            labelText: singleLabel?.textContent?.trim() ?? null,
            disabledAttr: singleInput?.hasAttribute('disabled') ?? null,
            requiredAttr: singleInput?.hasAttribute('required') ?? null,
            options: groupInputs.map((i) => ({
              id: i.getAttribute('id'),
              name: i.getAttribute('name'),
              checked: i.checked,
              disabled: i.hasAttribute('disabled'),
              ariaChecked: i.getAttribute('aria-checked'),
              ariaDisabled: i.getAttribute('aria-disabled'),
              ariaInvalid: i.getAttribute('aria-invalid'),
              ariaDescribedby: i.getAttribute('aria-describedby'),
            })),
            invalidId: invalidFeedback?.getAttribute('id') ?? null,
            invalidText: invalidFeedback?.textContent?.trim() ?? null,
          },
          null,
          2,
        );
      };

      queueMicrotask(() => requestAnimationFrame(snapshot));
      return c;
    };

    wrap.appendChild(
      card('Default (single)', () =>
        Template({
          ...args,
          checkboxGroup: false,
          customCheckboxGroup: false,
          customCheckbox: false,
          inputId: 'mx-single',
          name: 'mxSingle',
          labelTxt: 'Single checkbox',
          value: 'one',
          required: false,
          validation: false,
          disabled: false,
          checked: false,
        }),
      ),
    );

    wrap.appendChild(
      card('Group (inline)', () =>
        Template({
          ...args,
          checkboxGroup: true,
          customCheckboxGroup: false,
          customCheckbox: false,
          inline: true,
          name: 'mxGroup',
          groupTitle: 'Group inline',
          groupOptions: [
            { inputId: 'mx-g-1', value: 'a', labelTxt: 'A' },
            { inputId: 'mx-g-2', value: 'b', labelTxt: 'B', checked: true },
          ],
          required: false,
          validation: false,
          disabled: false,
        }),
      ),
    );

    wrap.appendChild(
      card('Validation (group required, none checked)', () =>
        Template({
          ...args,
          checkboxGroup: true,
          name: 'mxReq',
          groupTitle: 'Required group',
          required: true,
          validation: true,
          validationMsg: 'Select at least one option.',
          groupOptions: [
            { inputId: 'mx-r-1', value: 'x', labelTxt: 'X', checked: false },
            { inputId: 'mx-r-2', value: 'y', labelTxt: 'Y', checked: false },
          ],
        }),
      ),
    );

    wrap.appendChild(
      card('Disabled (single)', () =>
        Template({
          ...args,
          checkboxGroup: false,
          customCheckboxGroup: false,
          customCheckbox: true,
          inputId: 'mx-disabled',
          name: 'mxDisabled',
          labelTxt: 'Disabled checkbox',
          value: 'd',
          disabled: true,
          checked: true,
        }),
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring: single input/label linkage and group fieldset/legend linkage, plus aria-invalid/describedby when validation is shown. Includes default, inline group, validation, and disabled examples.',
      },
    },
  },
};
