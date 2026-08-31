// File: src/stories/checkbox-component/checkbox-component.stories.js

// import DocsPage from './checkbox-component.docs.mdx';
import { buildDocsHtml, Template } from './checkbox-component.story-helpers.js';

const baseArgs = {
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
};

const renderTemplate = args => Template(args);

export default {
  title: 'Form/Checkbox'
  ,
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
    ...baseArgs,
  },

  render: renderTemplate,
};

export const SingleBasic = {
  name: 'Single Checkbox',
  render: renderTemplate,
  args: {
    ...baseArgs,
    customCheckbox: false,
    checkboxGroup: false,
    customCheckboxGroup: false,
    inputId: 'agree-1',
    labelTxt: 'I agree to the terms',
    value: 'agree',
    size: 'lg',
  },
  parameters: {
    docs: { description: { story: 'A single checkbox with default styling.' } },
  },
};

export const SingleRequired = {
  name: 'Single Required',
  render: renderTemplate,
  args: {
    ...baseArgs,
    required: true,
    validation: true,
    validationMsg: 'Please agree before continuing.',
  },
  parameters: {
    docs: { description: { story: 'A single checkbox that is required and includes validation.' } },
  },
};

export const SingleCustom = {
  name: 'Single Custom',
  render: renderTemplate,
  args: {
    ...baseArgs,
    customCheckbox: true,
    inputId: 'custom-1',
    labelTxt: 'Custom styled checkbox',
    size: 'lg',
  },
  parameters: {
    docs: { description: { story: 'A single checkbox with custom styling.' } },
  },
};

export const GroupInline = {
  name: 'Group Inline Layout',
  render: renderTemplate,
  args: {
    ...baseArgs,
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
  },
  parameters: {
    docs: { description: { story: 'A group of checkboxes displayed inline.' } },
  },
};

export const GroupCustomStyled = {
  name: 'Group with Custom Styling',
  render: renderTemplate,
  args: {
    ...baseArgs,
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
  },
  parameters: {
    docs: { description: { story: 'A group of checkboxes with custom styling.' } },
  },
};

export const GroupWithValidation = {
  name: 'Group with Validation',
  render: renderTemplate,
  args: {
    ...baseArgs,
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
  },
  parameters: {
    docs: { description: { story: 'A group of checkboxes that is required and includes validation.' } },
  },
};

export const SingleDisabled = {
  name: 'Single Disabled Checkbox',
  render: renderTemplate,
  args: {
    ...baseArgs,
    disabled: true,
    inputId: 'disabled-1',
    labelTxt: 'Disabled checkbox',
    value: 'disabled',
  },
  parameters: {
    docs: { description: { story: 'A single checkbox that is disabled.' } },
  },
};

export const GroupDisabledOptions = {
  name: 'Group with Disabled Options',
  render: renderTemplate,
  args: {
    ...baseArgs,
    checkboxGroup: true,
    name: 'seating',
    groupTitle: 'Seating Preferences',
    groupOptions: [
      { inputId: 'seat-window', value: 'window', labelTxt: 'Window' },
      { inputId: 'seat-middle', value: 'middle', labelTxt: 'Middle', disabled: true },
      { inputId: 'seat-aisle', value: 'aisle', labelTxt: 'Aisle' },
    ],
  },
  parameters: {
    docs: { description: { story: 'A group of checkboxes with some options disabled.' } },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: args => {
    const wrap = document.createElement('div');
    wrap.className = 'checkbox-accessibility-matrix';

    const title = document.createElement('div');

    const titleHeading = document.createElement('strong');
    titleHeading.textContent = 'Accessibility matrix';

    const titleDescription = document.createElement('div');
    titleDescription.className =
      'checkbox-accessibility-matrix__description';
    titleDescription.innerHTML =
      'Default vs group inline. Validation + disabled. Prints computed ids and ' +
      '<code>aria-*</code> (fieldset/legend when group, label/for when single).';

    title.appendChild(titleHeading);
    title.appendChild(titleDescription);
    wrap.appendChild(title);

    const card = (labelText, build) => {
      const row = document.createElement('div');
      row.className = 'checkbox-accessibility-matrix__row';

      const left = document.createElement('div');
      left.className = 'checkbox-accessibility-matrix__label';
      left.textContent = labelText;

      const right = document.createElement('div');
      right.className = 'checkbox-accessibility-matrix__content';

      const demo = document.createElement('div');
      demo.className = 'checkbox-accessibility-matrix__demo';

      const built = build();
      demo.appendChild(built);

      const pre = document.createElement('pre');
      pre.className = 'checkbox-accessibility-matrix__output';
      pre.textContent = 'Loading…';

      right.appendChild(demo);
      right.appendChild(pre);

      row.appendChild(left);
      row.appendChild(right);

      const snapshot = () => {
        const host = demo.querySelector('checkbox-component');

        const fieldset = host?.querySelector(
          'fieldset.checkbox-group',
        );
        const legend = host?.querySelector(
          'legend.group-title',
        );
        const groupInputs = host
          ? Array.from(
              host.querySelectorAll('input[type="checkbox"]'),
            )
          : [];

        const singleInput = host?.querySelector(
          '.form-check-input, .custom-control-input',
        );
        const singleLabel = host?.querySelector('label');

        const invalidFeedback = host?.querySelector(
          '.invalid-feedback',
        );

        pre.textContent = JSON.stringify(
          {
            mode: fieldset ? 'group' : 'single',
            fieldsetRole:
              fieldset?.getAttribute('role') ?? null,
            fieldsetAriaLabelledby:
              fieldset?.getAttribute('aria-labelledby') ??
              null,
            fieldsetAriaDescribedby:
              fieldset?.getAttribute('aria-describedby') ??
              null,
            fieldsetAriaInvalid:
              fieldset?.getAttribute('aria-invalid') ?? null,
            legendId:
              legend?.getAttribute('id') ?? null,
            legendText:
              legend?.textContent?.trim() ?? null,
            inputId:
              singleInput?.getAttribute('id') ?? null,
            inputName:
              singleInput?.getAttribute('name') ?? null,
            labelFor:
              singleLabel?.getAttribute('for') ||
              singleLabel?.getAttribute('htmlfor') ||
              (singleLabel ? singleLabel.htmlFor : null) ||
              null,
            labelText:
              singleLabel?.textContent?.trim() ?? null,
            disabledAttr:
              singleInput?.hasAttribute('disabled') ?? null,
            requiredAttr:
              singleInput?.hasAttribute('required') ?? null,
            options: groupInputs.map(input => ({
              id: input.getAttribute('id'),
              name: input.getAttribute('name'),
              checked: input.checked,
              disabled: input.hasAttribute('disabled'),
              ariaChecked:
                input.getAttribute('aria-checked'),
              ariaDisabled:
                input.getAttribute('aria-disabled'),
              ariaInvalid:
                input.getAttribute('aria-invalid'),
              ariaDescribedby:
                input.getAttribute('aria-describedby'),
            })),
            invalidId:
              invalidFeedback?.getAttribute('id') ?? null,
            invalidText:
              invalidFeedback?.textContent?.trim() ?? null,
          },
          null,
          2,
        );
      };

      queueMicrotask(() =>
        requestAnimationFrame(snapshot),
      );

      return row;
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
            {
              inputId: 'mx-g-1',
              value: 'a',
              labelTxt: 'A',
            },
            {
              inputId: 'mx-g-2',
              value: 'b',
              labelTxt: 'B',
              checked: true,
            },
          ],
          required: false,
          validation: false,
          disabled: false,
        }),
      ),
    );

    wrap.appendChild(
      card(
        'Validation (group required, none checked)',
        () =>
          Template({
            ...args,
            checkboxGroup: true,
            name: 'mxReq',
            groupTitle: 'Required group',
            required: true,
            validation: true,
            validationMsg:
              'Select at least one option.',
            groupOptions: [
              {
                inputId: 'mx-r-1',
                value: 'x',
                labelTxt: 'X',
                checked: false,
              },
              {
                inputId: 'mx-r-2',
                value: 'y',
                labelTxt: 'Y',
                checked: false,
              },
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
    controls: {
      disable: true,
    },

    docs: {
      description: {
        story:
          'Prints computed accessibility wiring: single input/label linkage and group fieldset/legend linkage, plus aria-invalid/describedby when validation is shown. Includes default, inline group, validation, and disabled examples.',
      },
    },
  },
};
