// File: src/stories/plumage-textarea-component.stories.js

import DocsPage from './plumage-textarea-component.docs.mdx';
import {
  buildDocsHtml,
  buildEl,
  renderMatrixRow,
} from './plumage-textarea-component.story-helpers.js';

export default {
  title: 'Form/Plumage Textarea Component',
  tags: ['autodocs'],
  render: args => buildEl(args),
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'The `plumage-textarea-component` is a Plumage-styled multiline text field with support for validation, character counting, read-only mode, responsive form layouts, and emitted value/blur events.',
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
      description: 'Disables the textarea and applies disabled styling.',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      table: { defaultValue: { summary: false }, category: 'Input Attributes' },
      description: 'Makes the textarea read-only while still focusable.',
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Input Attributes' },
      description: 'Marks the field as required.',
    },
    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Input Attributes' },
      description: 'Associates the textarea with an external form by ID.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes', defaultValue: { summary: 'message-play' } },
      description: 'ID for the textarea element.',
    },
    placeholder: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Placeholder text for the textarea.',
    },
    value: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Current value of the textarea.',
    },
    rows: {
      control: 'number',
      min: 1,
      max: 20,
      step: 1,
      table: { category: 'Input Attributes' },
      description: 'Visible row count for the textarea.',
    },
    maxLength: {
      control: 'number',
      min: 1,
      max: 2000,
      step: 1,
      name: 'max-length',
      table: { category: 'Input Attributes' },
      description: 'Maximum character length. Also shows the counter when set.',
    },
    textareaTextSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'textarea-text-size',
      table: { category: 'Appearance' },
      description: 'Applies textarea sizing classes.',
    },
    label: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Label text for the textarea.',
    },
    labelSize: {
      control: { type: 'select' },
      options: ['base', 'xs', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
      description: 'Size variant for the label.',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Alignment for the label text.',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Visually hides the label but keeps it accessible.',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description: 'Form layout variant.',
    },
    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'label-col',
      table: { category: 'Layout' },
      description: 'Grid columns for the label in horizontal layout.',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'input-col',
      table: { category: 'Layout' },
      description: 'Grid columns for the textarea wrapper in horizontal layout.',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout' },
      description: 'Responsive label columns, e.g. "xs-12 sm-4".',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout' },
      description: 'Responsive input columns, e.g. "xs-12 sm-8".',
    },
    validation: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      description: 'Turns on the validation state.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'Validation message shown when invalid.',
    },
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Accessible label fallback when aria-labelledby is not used.',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'External accessible labelling ID reference(s).',
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      table: { category: 'Accessibility' },
      description: 'External accessible description ID reference(s).',
    },
    arialabelledBy: {
      control: 'text',
      name: 'arialabelled-by',
      table: { category: 'Accessibility' },
      description: 'Legacy labelled-by prop supported by the component.',
    },
  },
  args: {
    disabled: false,
    readOnly: false,
    required: false,
    validation: false,
    validationMessage: 'Please enter at least 3 characters.',
    formId: '',
    formLayout: '',
    inputId: 'message-play',
    textareaTextSize: '',
    label: 'Message',
    labelSize: 'sm',
    labelAlign: '',
    labelHidden: false,
    value: '',
    placeholder: 'Enter your message',
    rows: 4,
    maxLength: 250,
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
    arialabelledBy: '',
    labelCol: 2,
    inputCol: 10,
    labelCols: '',
    inputCols: '',
  },
};

export const Basic = {
  name: 'Basic Usage',
  args: {
    label: 'Message',
    inputId: 'message-play',
    placeholder: 'Enter your message',
    rows: 4,
    value: '',
    disabled: false,
    readOnly: false,
    required: false,
    validation: false,
    validationMessage: 'Please enter at least 3 characters.',
    textareaTextSize: '',
    formLayout: '',
    labelAlign: '',
    labelHidden: false,
    labelSize: 'sm',
    labelCol: 2,
    inputCol: 10,
    labelCols: '',
    inputCols: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic Plumage textarea with label and placeholder.',
      },
    },
  },
};

export const WithCharacterCounter = {
  name: 'With Character Counter',
  args: {
    ...Basic.args,
    inputId: 'message-counter',
    label: 'Description',
    value: 'Initial textarea value',
    rows: 5,
    maxLength: 250,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the built-in character counter when `max-length` is set.',
      },
    },
  },
};

export const RequiredWithValidation = {
  name: 'Required + Validation',
  args: {
    ...Basic.args,
    inputId: 'message-required',
    required: true,
    validation: true,
    value: '',
    validationMessage: 'Please enter at least 3 characters.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates required + validation behavior.',
      },
    },
  },
};

export const DisabledState = {
  name: 'Disabled',
  args: {
    ...Basic.args,
    inputId: 'message-disabled',
    disabled: true,
    value: 'Textarea is disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the disabled state of the Plumage textarea.',
      },
    },
  },
};

export const ReadOnlyState = {
  name: 'Read Only',
  args: {
    ...Basic.args,
    inputId: 'message-readonly',
    readOnly: true,
    value: 'This textarea is read only.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the read-only state. The value can be focused and selected but not edited.',
      },
    },
  },
};

export const HorizontalLayout = {
  name: 'Horizontal Layout',
  args: {
    ...Basic.args,
    inputId: 'message-horizontal',
    formLayout: 'horizontal',
    labelAlign: 'right',
    labelCols: 'xs-12 sm-4',
    inputCols: 'xs-12 sm-8',
    rows: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses responsive columns in horizontal form layout.',
      },
    },
  },
};

export const InlineLayout = {
  name: 'Inline Layout',
  args: {
    ...Basic.args,
    inputId: 'message-inline',
    formLayout: 'inline',
    rows: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Renders the component using inline form layout.',
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
        Renders common variants and prints computed <code>aria-*</code>, IDs, counter wiring, validation wiring, and readonly/disabled state.
      </div>
    `;
    root.appendChild(intro);

    const rows = [
      {
        title: 'Default',
        args: {
          label: 'Message',
          inputId: 'pta-a11y-default',
          placeholder: 'Enter your message',
          rows: 4,
          formLayout: '',
          validation: false,
          disabled: false,
          readOnly: false,
        },
      },
      {
        title: 'Horizontal',
        args: {
          label: 'Message',
          inputId: 'pta-a11y-horizontal',
          formLayout: 'horizontal',
          labelCols: 'xs-12 sm-4',
          inputCols: 'xs-12 sm-8',
          labelAlign: 'right',
          rows: 4,
          validation: false,
          disabled: false,
          readOnly: false,
        },
      },
      {
        title: 'Validation',
        args: {
          label: 'Description',
          inputId: 'pta-a11y-validation',
          required: true,
          validation: true,
          validationMessage: 'This field is required.',
          rows: 4,
          value: '',
        },
      },
      {
        title: 'Counter',
        args: {
          label: 'Description',
          inputId: 'pta-a11y-counter',
          rows: 4,
          maxLength: 50,
          value: 'Hello world',
        },
      },
      {
        title: 'Disabled',
        args: {
          label: 'Disabled',
          inputId: 'pta-a11y-disabled',
          disabled: true,
          value: 'Locked',
          rows: 4,
        },
      },
      {
        title: 'Read Only',
        args: {
          label: 'Read Only',
          inputId: 'pta-a11y-readonly',
          readOnly: true,
          value: 'Selectable but not editable',
          rows: 4,
        },
      },
    ];

    rows.forEach((r, idx) => root.appendChild(renderMatrixRow({ ...r, idSuffix: String(idx + 1) })));
    return root;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Matrix of key states including default, horizontal layout, validation, counter, disabled, and read-only. Each row prints computed accessibility wiring and related state.',
      },
      story: { height: '1400px' },
    },
    controls: { disable: true },
  },
};
