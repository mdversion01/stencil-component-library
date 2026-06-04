// File: src/stories/select-field-component.stories.js

import SelectFieldDocs from './select-field-component.docs.mdx';
import { normalize, buildDocsHtml, Template, SIZE_VARIANTS, getSnapshot } from './select-field-component.story-helpers';

export default {
  title: 'Form/Select Field',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: SelectFieldDocs,
      description: {
        component: 'A customizable select field component with various props for label, size, validation, layout, and accessibility overrides.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  argTypes: {
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      table: { category: 'Accessibility' },
      description:
        'ARIA override: additional element id(s) describing the select (space-separated). When validation is shown, the component merges this with its validation message id.',
    },
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'ARIA override: label for the select. Ignored if aria-labelledby is provided. Recommended when label is hidden.',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description:
        'ARIA override: element id(s) that label the select (space-separated). Takes precedence over aria-label and component-generated label id.',
    },

    classes: { control: 'text', table: { category: 'Layout' }, description: 'Additional CSS classes' },
    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Layout' },
      description: 'ID of the parent form element, used for accessibility and form association',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description:
        'Sets the form layout style. "horizontal" applies a two-column grid layout, while "inline" arranges elements in a single row.',
    },
    inputCol: {
      control: 'text',
      name: 'input-col',
      table: { category: 'Layout', defaultValue: { summary: 10 } },
      description: 'Used with horizontal form layouts. Single numeric column for the input in a grid. Default is 10 (col-10).',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive input column classes.',
    },
    label: { control: 'text', table: { category: 'Layout' }, description: 'Label text for the select field' },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Alignment of the label',
    },
    labelCol: {
      control: 'text',
      name: 'label-col',
      table: { category: 'Layout', defaultValue: { summary: 2 } },
      description: 'Used with horizontal form layouts. Single numeric column for the label in a grid. Default is 2 (col-2).',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive label column classes.',
    },
    labelHidden: { control: 'boolean', name: 'label-hidden', table: { category: 'Layout' }, description: 'Hide the label' },
    labelSize: {
      control: { type: 'select' },
      options: ['', 'xs', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
      description: 'Size variant of the label',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description: 'Size variant of the select field',
    },

    multiple: { control: 'boolean', table: { category: 'Options', defaultValue: false }, description: 'Enable multiple selection mode' },
    options: { control: 'object', description: 'Array of { value, name } or JSON string', table: { category: 'Options' } },

    withTable: {
      control: 'boolean',
      name: 'with-table',
      table: { category: 'Other', defaultValue: { summary: false } },
      description: 'This associates the select field with a table for synchronized behavior.',
    },

    custom: {
      control: 'boolean',
      table: { category: 'Select Field Attributes', defaultValue: false },
      description: 'Enable custom styling for the select field',
    },
    defaultOptionTxt: {
      control: 'text',
      name: 'default-option-txt',
      table: { category: 'Select Field Attributes' },
      description: 'Text for the default (unselected) option',
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Select Field Attributes', defaultValue: false },
      description: 'Disable the select field',
    },
    fieldHeight: {
      control: { type: 'number', min: 2, step: 1 },
      name: 'field-height',
      table: { category: 'Select Field Attributes' },
      description: "Number for the Select Field's height when used with the `multiple` attribute for multiple selection.",
    },
    selectFieldId: {
      control: 'text',
      name: 'select-field-id',
      table: { category: 'Select Field Attributes' },
      description: 'ID of the select field, used for accessibility and form association',
    },
    value: {
      control: 'text',
      table: { category: 'Select Field Attributes' },
      description: 'For single select; in multiple mode prefer selection via UI',
    },

    required: { control: 'boolean', table: { category: 'Validation', defaultValue: false }, description: 'Mark the field as required' },
    validation: { control: 'boolean', table: { category: 'Validation', defaultValue: false }, description: 'Enable validation' },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'Validation message to display',
    },
  },
};

export const BasicSingle = Template.bind({});
BasicSingle.args = {
  label: 'Fruits',
  labelSize: 'sm',
  labelAlign: '',
  labelHidden: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  size: '',
  custom: false,
  classes: '',

  multiple: false,
  required: false,
  disabled: false,

  validation: false,
  validationMessage: '',

  defaultOptionTxt: 'Select a fruit',
  value: '',
  options: [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ],

  formId: '',
  formLayout: '',
  selectFieldId: 'fruit',

  fieldHeight: null,

  labelCol: '',
  inputCol: '',
  labelCols: '',
  inputCols: '',

  withTable: false,
};
BasicSingle.storyName = 'Basic (single select)';
BasicSingle.parameters = {
  docs: {
    description: {
      story: 'A basic single-select example with default args. Use Controls to customize and explore different configurations.',
    },
  },
};

export const WithSelection = Template.bind({});
WithSelection.args = {
  ...BasicSingle.args,
  value: 'banana',
};
WithSelection.storyName = 'With Selection';
WithSelection.parameters = {
  docs: {
    description: {
      story: 'A single-select example with a pre-selected value.',
    },
  },
};

export const MultipleSelection = Template.bind({});
MultipleSelection.args = {
  ...BasicSingle.args,
  label: 'Tags',
  multiple: true,
  defaultOptionTxt: 'Choose tags',
  options: [
    { value: 'ux', name: 'UX' },
    { value: 'web', name: 'Web' },
    { value: 'mobile', name: 'Mobile' },
    { value: 'data', name: 'Data' },
  ],
  fieldHeight: 6,
};
MultipleSelection.storyName = 'Multiple Selections';
MultipleSelection.parameters = {
  docs: {
    description: {
      story: 'An example of the select field in multiple selection mode. The `field-height` attribute can be used to control the height of the select box when `multiple` is enabled.',
    },
  },
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  ...BasicSingle.args,
  formLayout: 'horizontal',
  labelCols: 'col-sm-3',
  inputCols: 'col-sm-9',
  value: 'cherry',
};
HorizontalLayout.storyName = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'The select field can be used within a horizontal form layout. Use the `form-layout` prop set to "horizontal" and specify column widths for the label and input using `label-cols` and `input-cols`.',
    },
  },
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  ...BasicSingle.args,
  formLayout: 'inline',
  value: 'apple',
};
InlineLayout.storyName = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    description: {
      story: 'The select field can also be used within an inline form layout. Set the `form-layout` prop to "inline" to arrange the label and select field in a single row.',
    },
  },
};

export const WithValidationRequired = Template.bind({});
WithValidationRequired.args = {
  ...BasicSingle.args,
  required: true,
  validation: true,
  validationMessage: 'Please select an option.',
  defaultOptionTxt: 'Please choose…',
};
WithValidationRequired.storyName = 'With Validation (Required)';
WithValidationRequired.parameters = {
  docs: {
    description: {
      story: 'An example of the select field with validation enabled and a required selection.',
    },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...BasicSingle.args,
  disabled: true,
  defaultOptionTxt: 'Not available',
};
Disabled.storyName = 'Disabled';
Disabled.parameters = {
  docs: {
    description: {
      story: 'An example of the select field in a disabled state.',
    },
  },
};

export const SizeVariants = {
  name: 'Size Variants',
  render: args => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '12px';
    container.style.maxWidth = '680px';

    SIZE_VARIANTS.forEach(v => {
      const block = document.createElement('div');
      block.style.display = 'grid';
      block.style.gap = '6px';

      const markup = Template({
        ...args,
        label: v.label,
        labelSize: v.labelSize,
        size: v.size,
        selectFieldId: v.selectFieldId,
      });

      const mount = document.createElement('div');
      mount.innerHTML = markup.trim();

      block.appendChild(mount.firstElementChild);
      container.appendChild(block);
    });

    return container;
  },

  args: {
    ...BasicSingle.args,
  },

  parameters: {
    docs: {
      description: {
        story: 'Shows the three supported sizes by setting `size` to `sm`, empty string (default), and `lg`.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) =>
          [
            '<div style="display:grid; gap:12px; max-width:680px;">',
            ...SIZE_VARIANTS.map(v =>
              [
                `  <!-- ${v.label} -->`,
                `  ${Template({
                  ...ctx.args,
                  label: v.label,
                  labelSize: v.labelSize,
                  size: v.size,
                  selectFieldId: v.selectFieldId,
                })
                  .trim()
                  .replace(/\n/g, '\n  ')}`,
              ].join('\n'),
            ),
            '</div>',
          ].join('\n'),
      },
    },
  },
};

export const CustomStyling = Template.bind({});
CustomStyling.args = {
  ...BasicSingle.args,
  custom: true,
  classes: 'my-shadow-1',
  value: 'apple',
};
CustomStyling.storyName = 'Custom Styling';
CustomStyling.parameters = {
  docs: {
    description: {
      story: 'An example of the select field with custom styling applied.',
    },
  },
};

export const OptionsViaJSONAttribute = () => {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <select-field-component
      label="Continents"
      default-option-txt="Select continent"
      options='[
        { "value": "af", "name": "Africa" },
        { "value": "as", "name": "Asia" },
        { "value": "eu", "name": "Europe" },
        { "value": "na", "name": "North America" },
        { "value": "oc", "name": "Oceania" },
        { "value": "sa", "name": "South America" }
      ]'
    ></select-field-component>
  `;

  const el = wrap.querySelector('select-field-component');
  if (el) el.value = '';

  return wrap;
};

OptionsViaJSONAttribute.parameters = {
  docs: {
    source: {
      language: 'html',
      transform: () =>
        normalize(`
          <select-field-component
            label="Continents"
            default-option-txt="Select continent"
            options='[
              { "value": "af", "name": "Africa" },
              { "value": "as", "name": "Asia" },
              { "value": "eu", "name": "Europe" },
              { "value": "na", "name": "North America" },
              { "value": "oc", "name": "Oceania" },
              { "value": "sa", "name": "South America" }
            ]'
          ></select-field-component>
      `),
    },
    description: {
      story: 'An example of passing options as a JSON string via the `options` attribute.',
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Prints computed <code>role</code> + <code>aria-*</code> + generated ids for default / inline / horizontal, validation, and disabled.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs) => {
      const box = document.createElement('div');
      box.style.border = '1px solid #ddd';
      box.style.borderRadius = '10px';
      box.style.padding = '12px';
      box.style.display = 'grid';
      box.style.gap = '10px';

      const t = document.createElement('div');
      t.style.fontWeight = '600';
      t.textContent = title;

      const demo = document.createElement('div');
      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      const mount = document.createElement('div');
      mount.innerHTML = Template({ ...BasicSingle.args, ...args, ...storyArgs });

      const host = mount.querySelector('select-field-component');
      demo.appendChild(mount);

      const update = async () => {
        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('select-field-component');
          } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(host), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    wrap.appendChild(
      card('Default (stacked)', {
        selectFieldId: 'mx-select-default',
        label: 'Default A11y',
        formLayout: '',
        validation: false,
        disabled: false,
        value: '',
      }),
    );

    wrap.appendChild(
      card('Inline layout', {
        selectFieldId: 'mx-select-inline',
        label: 'Inline A11y',
        formLayout: 'inline',
        validation: false,
        disabled: false,
        value: '',
      }),
    );

    wrap.appendChild(
      card('Horizontal layout', {
        selectFieldId: 'mx-select-horizontal',
        label: 'Horizontal A11y',
        formLayout: 'horizontal',
        labelAlign: 'right',
        labelCols: 'xs-12 sm-4',
        inputCols: 'xs-12 sm-8',
        validation: false,
        disabled: false,
        value: '',
      }),
    );

    wrap.appendChild(
      card('Validation (aria-invalid + describedby)', {
        selectFieldId: 'mx-select-validation',
        label: 'Validation',
        required: true,
        validation: true,
        validationMessage: 'This is required.',
        value: '',
      }),
    );

    wrap.appendChild(
      card('Disabled', {
        selectFieldId: 'mx-select-disabled',
        label: 'Disabled',
        disabled: true,
        value: 'banana',
        validation: false,
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the select: `aria-labelledby`, `aria-describedby` (including validation id when present), `aria-required`, `aria-invalid` across default / inline / horizontal, validation, and disabled.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
};
