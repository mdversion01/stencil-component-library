// File: src/stories/input-field-component/input-field-component.stories.js

import DocsPage from './input-field-component.docs.mdx';
import {
  buildDocsHtml,
  buildDocsHtmlInlineLayout,
  buildDocsHtmlReadOnlyAndDisabled,
  buildDocsHtmlSizes,
  makeInput,
  renderMatrixRow,
  template,
  wrapInForm,
} from './input-field-component.story-helpers.js';

const baseArgs = {
  disabled: false,
  formLayout: '',
  inputCol: 10,
  inputCols: '',
  inputId: 'first-name',
  label: 'First Name',
  labelAlign: '',
  labelCol: 2,
  labelCols: '',
  labelHidden: false,
  labelSize: 'xs',
  placeholder: '',
  readOnly: false,
  required: false,
  size: '',
  type: 'text',
  validation: false,
  validationMessage: 'This field is required.',
  value: '',
  wrapWithForm: false,
};

const renderTemplate = args => template(args);

export default {
  title: 'Form/Input Field',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component:
          'A customizable input field component with various props for label, size, validation, and layout. ' +
          'Updated to always render help text (sr-only) and keep aria-describedby resolvable; validation is announced via aria-live.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    /* =========================
     * Input Attributes
     * ========================= */
    disabled: {
      control: 'boolean',
      name: 'disabled',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Disables the input field, preventing user interaction.',
    },
    placeholder: {
      control: 'text',
      name: 'placeholder',
      table: { category: 'Input Attributes' },
      description: 'The placeholder text for the input element. This provides a hint to the user about what to enter.',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      description: 'Whether the input field is read-only',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
    },
    type: {
      control: 'text',
      description: 'The type of the input field',
      table: { category: 'Input Attributes' },
    },
    value: {
      control: 'text',
      description: 'The value of the input field',
      table: { category: 'Input Attributes' },
    },

    /* =========================
     * Layout
     * ========================= */
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description: 'Sets the form layout style. "horizontal" applies a two-column grid layout, while "inline" arranges elements in a single row.',
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
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Layout' },
      description: 'The unique identifier for the input element within the component. This is used for accessibility and form association.',
    },
    label: {
      control: 'text',
      name: 'label',
      table: { category: 'Layout' },
      description: 'The text label for the component. This is used for accessibility and user guidance.',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Aligns the label text. "right" aligns the label to the right, which is typically used in horizontal form layouts.',
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
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Hides the label visually while keeping it accessible for screen readers.',
    },
    labelSize: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
      description: 'Sets the size of the label text. Options include "xs" (extra small), "sm" (small), and "lg" (large).',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: { category: 'Layout' },
      description: 'Sets the size of the input field. Options include "sm" (small) and "lg" (large). Not adding any size will use the default.',
    },

    /* =========================
     * Storybook Only
     * ========================= */
    wrapWithForm: {
      control: 'boolean',
      description:
        'When enabled, the input field will be wrapped in a `<form-component>` and `slot="formField"` is added to the `<input-field-component>` in the docs preview. ' +
        'This allows you to test form-related props like formLayout and see how the input behaves within a form context. This is a story-only control and does not affect the actual component props.',
      table: { category: 'Storybook Only', defaultValue: { summary: false } },
    },

    /* =========================
     * Validation
     * ========================= */
    required: {
      control: 'boolean',
      name: 'required',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the input as required, which will trigger validation if the field is left empty.',
    },
    validation: {
      control: 'boolean',
      name: 'validation',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Enables validation for the input field.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'The validation message to display when the input is invalid.',
    },
  },
  args: {
    ...baseArgs,
  },
};

export const Basic = {
  name: 'Basic',
  render: renderTemplate,
  args: {
    ...baseArgs,
    label: 'First Name',
    inputId: 'firstName',
    placeholder: 'Enter your first name',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
    labelSize: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic input field with a label and placeholder.',
      },
    },
  },
};

export const Sizes = {
  name: 'Sizes',
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '12px';

    container.append(
      renderTemplate({ ...baseArgs, label: 'Default', inputId: 'size-default', size: '' }),
      renderTemplate({ ...baseArgs, label: 'Small', inputId: 'size-sm', size: 'sm' }),
      renderTemplate({ ...baseArgs, label: 'Large', inputId: 'size-lg', size: 'lg' }),
    );
    return container;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () => buildDocsHtmlSizes(),
      },
      description: {
        story: 'Input fields with different sizes, demonstrating small, default, and large options.',
      },
    },
  },
};

export const HorizontalLayout = {
  name: 'Horizontal Layout',
  args: {
    ...baseArgs,
    formLayout: 'horizontal',
    label: 'Email',
    inputId: 'email',
    type: 'email',
    labelCol: 3,
    inputCol: 9,
    validationMessage: '',
  },
  render: renderTemplate,
  parameters: {
    docs: {
      description: {
        story: 'An input field within a horizontal form layout, using labelCol and inputCol for grid sizing.',
      },
    },
  },
};

export const InlineLayout = {
  name: 'Inline Layout',
  render: () => {
    const row = document.createElement('form-component');
    row.formLayout = 'inline';
    row.setAttribute('style', 'display:block; padding:12px; gap:12px;');

    const first = makeInput({
      label: 'City',
      inputId: 'city',
      formLayout: 'inline',
      labelCols: '',
      inputCols: '',
      validationMessage: '',
      labelCol: '',
      inputCol: '',
    });
    first.setAttribute('slot', 'formField');

    const second = makeInput({
      label: 'State',
      inputId: 'state',
      formLayout: 'inline',
      labelCols: '',
      inputCols: '',
      validationMessage: '',
      labelCol: '',
      inputCol: '',
    });
    second.setAttribute('slot', 'formField');

    row.append(first, second);
    return row;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () => buildDocsHtmlInlineLayout(),
      },
      description: {
        story: 'An input field within an inline form layout, demonstrating responsive column sizing.',
      },
    },
  },
};

export const RequiredWithValidation = {
  name: 'Required with Validation',
  render: renderTemplate,
  args: {
    ...baseArgs,
    label: 'Username',
    inputId: 'username',
    required: true,
    validation: true,
    validationMessage: 'Please enter at least 3 characters.',
    formLayout: '',
    labelCol: '',
    inputCol: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'A required input field with validation enabled. The validation message will display if the field is left empty or does not meet the criteria.',
      },
    },
  },
};

export const LabelHidden = {
  name: 'Label Hidden',
  render: renderTemplate,
  args: {
    ...baseArgs,
    label: 'Search',
    inputId: 'search',
    labelHidden: true,
    placeholder: 'Search…',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
    labelSize: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'An input field with the label visually hidden but still accessible to screen readers.',
      },
    },
  },
};

export const ReadOnlyAndDisabled = {
  name: 'Read-Only and Disabled',
  render: () => {
    const stack = document.createElement('div');
    stack.style.display = 'grid';
    stack.style.gap = '12px';

    stack.append(
      renderTemplate({
        ...baseArgs,
        label: 'Read-only',
        inputId: 'ro',
        readOnly: true,
        value: 'Read only value',
        validationMessage: '',
        labelCol: '',
        inputCol: '',
      }),
      renderTemplate({
        ...baseArgs,
        label: 'Disabled',
        inputId: 'dis',
        disabled: true,
        value: 'Disabled value',
        validationMessage: '',
        labelCol: '',
        inputCol: '',
      }),
    );

    return stack;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () => buildDocsHtmlReadOnlyAndDisabled(),
      },
      description: {
        story:
          'Two input fields demonstrating read-only and disabled states. The read-only field can be focused and its value can be selected, but not edited. The disabled field is non-interactive.',
      },
    },
  },
};

export const ResponsiveCols = {
  name: 'Responsive Columns',
  args: {
    ...baseArgs,
    wrapWithForm: true,
    formLayout: 'horizontal',
    label: 'Company',
    inputId: 'company',
    labelCols: 'sm-3 md-4',
    inputCols: 'sm-9 md-8',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
  },
  render: renderTemplate,
  parameters: {
    docs: {
      description: {
        story:
          'An input field demonstrating responsive column sizing using `labelCols` and `inputCols` within a horizontal form layout. Displayed using the `form-component` wrapper.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '16px';

    const intro = document.createElement('div');
    intro.innerHTML = `
      <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
      <div style="font-size:13px; color:#444;">
        Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + IDs.
        Also reports whether <code>aria-labelledby</code> / <code>aria-describedby</code> resolve to real elements.
        Help text (<code>__desc</code>) is expected to always exist; validation (<code>__validation</code>) is expected only when invalid.
      </div>
    `;
    root.appendChild(intro);

    const rows = [
      {
        title: 'Default (stacked)',
        args: { label: 'First Name', formLayout: '', disabled: false, required: false, validation: false, validationMessage: '' },
        forceInvalid: false,
      },
      {
        title: 'Inline',
        args: { label: 'City', formLayout: 'inline', disabled: false, required: false, validation: false, validationMessage: '' },
        forceInvalid: false,
      },
      {
        title: 'Horizontal (responsive cols)',
        args: {
          label: 'Email',
          formLayout: 'horizontal',
          labelCols: 'xs-12 sm-3',
          inputCols: 'xs-12 sm-9',
          disabled: false,
          required: false,
          validation: false,
          validationMessage: '',
        },
        forceInvalid: false,
      },
      {
        title: 'Error / Validation (required + validation=true)',
        args: {
          label: 'Username',
          formLayout: '',
          required: true,
          validation: true,
          validationMessage: 'Please enter at least 3 characters.',
          value: '',
        },
        forceInvalid: true,
      },
      {
        title: 'Disabled',
        args: { label: 'Company', formLayout: '', disabled: true, required: false, validation: false, validationMessage: '', value: 'Disabled value' },
        forceInvalid: false,
      },
    ];

    rows.forEach((r, idx) =>
      root.appendChild(
        renderMatrixRow({
          ...r,
          idSuffix: String(idx + 1),
        }),
      ),
    );

    return root;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Matrix of key states (default/inline/horizontal, validation/error, disabled). Each row prints computed role/aria/ids and whether ARIA references resolve.',
      },
      story: { height: '1100px' },
    },
    controls: { disable: true },
  },
};
