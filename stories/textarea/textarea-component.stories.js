// File: src/stories/textarea-component.stories.js
import DocsPage from './textarea-component.docs.mdx';
import {
  buildDocsHtml,
  buildDocsHtmlExternalValue,
  buildTextarea,
  snapshotTextareaA11y,
} from './textarea-component.story-helpers';

const baseArgs = {
  disabled: false,
  formId: '',
  formLayout: '',
  inputId: 'textarea',
  textareaTextSize: '',
  label: 'Message',
  labelSize: 'sm',
  labelAlign: '',
  labelHidden: false,
  readOnly: false,
  required: false,
  validation: false,
  validationMessage: 'Please enter at least 3 characters.',
  value: '',
  placeholder: 'Enter your message',
  rows: 3,
  maxLength: undefined,

  labelCol: 2,
  inputCol: 10,
  labelCols: '',
  inputCols: '',
};

const storyWithRender = {
  render: args => buildTextarea(args),
};

export default {
  title: 'Form/Textarea',
  tags: ['autodocs'],
  render: args => buildTextarea(args),

  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component:
          'A textarea web component with Bootstrap-style layout, validation support, optional max-length counter, and form-friendly valueChange / blurChange events.',
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
      table: { defaultValue: { summary: false }, category: 'Core' },
      description: 'Disable the textarea.',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      table: { defaultValue: { summary: false }, category: 'Core' },
      description: 'Render the textarea as read-only.',
    },
    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Core' },
      description: 'Optional form id to associate the textarea with an external form.',
    },

    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description: 'Layout variant for the field wrapper.',
    },
    textareaTextSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'textarea-text-size',
      table: { category: 'Layout' },
      description: 'Textarea sizing class.',
    },
    rows: {
      control: 'number',
      min: 1,
      step: 1,
      table: { category: 'Layout', defaultValue: { summary: 3 } },
      description: 'Visible number of text rows.',
    },

    label: {
      control: 'text',
      table: { category: 'Label' },
      description: 'Visible label text.',
    },
    labelSize: {
      control: { type: 'select' },
      options: ['', 'xs', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Label', defaultValue: { summary: 'sm' } },
      description: 'Label size modifier.',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Label' },
      description: 'Alignment for the label text.',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Label', defaultValue: { summary: false } },
      description: 'Visually hides the label while keeping it accessible.',
    },

    placeholder: {
      control: 'text',
      table: { category: 'Textarea' },
      description: 'Placeholder text shown when empty.',
    },
    value: {
      control: 'text',
      table: { category: 'Textarea' },
      description: 'Initial textarea value.',
    },
    maxLength: {
      control: 'number',
      min: 1,
      step: 1,
      name: 'max-length',
      table: { category: 'Textarea' },
      description: 'Maximum character length. Also enables the visible counter.',
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      description: 'Marks the textarea as required.',
    },
    validation: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Externally controlled validation state.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'Validation message shown when invalid.',
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Identity' },
      description: 'Explicit textarea id. If omitted, the component generates one.',
    },

    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'label-col',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Label columns for horizontal layout.',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'input-col',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Input columns for horizontal layout.',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Responsive label column classes.',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout', subcategory: 'Grid' },
      description: 'Responsive input column classes.',
    },
  },

  args: {
    ...baseArgs,
  },
};

export const Basic = {
  ...storyWithRender,
  name: 'Basic',
  args: {
    ...baseArgs,
    label: 'Example textarea',
    placeholder: 'Enter your message',
    rows: 3,
    inputId: 'textarea-basic',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic textarea with label and placeholder.',
      },
    },
  },
};

export const ValueFromExternalSource = {
  name: 'Value From External Source',
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '12px';
    root.style.maxWidth = '640px';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.flexWrap = 'wrap';
    controls.style.gap = '8px';

    const status = document.createElement('div');
    status.style.fontSize = '14px';
    status.style.color = '#444';

    const textarea = buildTextarea({
      ...baseArgs,
      label: 'Message',
      inputId: 'textarea-external-value',
      placeholder: 'Load prefilled content',
      rows: 5,
      value: '',
    });

    const updateStatus = () => {
      status.textContent = `Current external value: ${JSON.stringify(textarea.value || '')}`;
    };

    const makeButton = (label, value) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => {
        textarea.value = value;
        updateStatus();
      });
      return button;
    };

    const loadDraft = makeButton(
      'Load Draft',
      'Hello team,\n\nHere is the latest draft message loaded from an outside source.\n\nThanks.'
    );

    const loadApi = makeButton(
      'Load API Response',
      'This textarea was populated from preloaded data or an API response.'
    );

    const clear = makeButton('Clear', '');

    textarea.addEventListener('valueChange', updateStatus);
    textarea.addEventListener('blurChange', updateStatus);

    controls.append(loadDraft, loadApi, clear);
    root.append(controls, textarea, status);

    updateStatus();
    return root;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates setting the `value` prop from someplace else, such as preloaded data, an API response, or another UI action.',
      },
      source: {
        language: 'html',
        transform: () => buildDocsHtmlExternalValue(),
      },
    },
  },
};

export const WithCounter = {
  ...storyWithRender,
  name: 'With Counter',
  args: {
    ...baseArgs,
    label: 'Textarea with counter',
    placeholder: 'Write up to 250 characters',
    rows: 4,
    maxLength: 250,
    inputId: 'textarea-counter',
  },
  parameters: {
    docs: {
      description: {
        story: 'Setting `maxLength` automatically displays the live character counter.',
      },
    },
  },
};

export const WithValidation = {
  ...storyWithRender,
  name: 'With Validation',
  args: {
    ...baseArgs,
    label: 'Required textarea',
    placeholder: 'Enter at least 3 characters',
    required: true,
    validation: true,
    validationMessage: 'Please enter at least 3 characters.',
    rows: 4,
    inputId: 'textarea-validation',
  },
  parameters: {
    docs: {
      description: {
        story: 'Textarea with required and validation state enabled.',
      },
    },
  },
};

export const HorizontalLayout = {
  ...storyWithRender,
  name: 'Horizontal Layout',
  args: {
    ...baseArgs,
    label: 'Description',
    formLayout: 'horizontal',
    labelAlign: 'right',
    labelCol: 3,
    inputCol: 9,
    rows: 4,
    inputId: 'textarea-horizontal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout with label and textarea aligned side by side.',
      },
    },
  },
};

export const InlineLayout = {
  ...storyWithRender,
  name: 'Inline Layout',
  args: {
    ...baseArgs,
    label: 'Notes',
    formLayout: 'inline',
    rows: 3,
    inputId: 'textarea-inline',
  },
  parameters: {
    docs: {
      description: {
        story: 'Inline layout variant for compact form rows.',
      },
    },
  },
};

export const Disabled = {
  ...storyWithRender,
  name: 'Disabled',
  args: {
    ...baseArgs,
    label: 'Disabled textarea',
    disabled: true,
    value: 'This field is disabled.',
    rows: 3,
    inputId: 'textarea-disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled textarea state.',
      },
    },
  },
};

export const ReadOnly = {
  ...storyWithRender,
  name: 'Read Only',
  args: {
    ...baseArgs,
    label: 'Read only textarea',
    readOnly: true,
    value: 'This value can be read but not edited.',
    rows: 3,
    inputId: 'textarea-readonly',
  },
  parameters: {
    docs: {
      description: {
        story: 'Read-only textarea state.',
      },
    },
  },
};

export const TextSizeLarge = {
  ...storyWithRender,
  name: 'Text Size Large',
  args: {
    ...baseArgs,
    label: 'Large textarea',
    textareaTextSize: 'lg',
    rows: 4,
    inputId: 'textarea-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Textarea using the large text size modifier.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: args => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '16px';

    const intro = document.createElement('div');
    intro.innerHTML = `
      <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
      <div style="font-size:13px; color:#444;">
        Textarea variants with computed label/help/counter/validation wiring.
      </div>
    `;
    root.appendChild(intro);

    const renderRow = ({ title, build }) => {
      const wrap = document.createElement('div');
      wrap.style.border = '1px solid #ddd';
      wrap.style.borderRadius = '12px';
      wrap.style.padding = '12px';
      wrap.style.display = 'grid';
      wrap.style.gap = '10px';

      const heading = document.createElement('div');
      heading.style.fontWeight = '700';
      heading.textContent = title;

      const stage = document.createElement('div');
      stage.style.maxWidth = '560px';

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.background = '#f6f8fa';
      pre.style.borderRadius = '10px';
      pre.style.overflowX = 'auto';
      pre.style.fontSize = '12px';
      pre.textContent = 'Collecting aria/role/id…';

      const comp = build();
      stage.appendChild(comp);

      wrap.appendChild(heading);
      wrap.appendChild(stage);
      wrap.appendChild(pre);

      const update = () => {
        pre.textContent = JSON.stringify(snapshotTextareaA11y(comp), null, 2);
      };

      requestAnimationFrame(() => requestAnimationFrame(update));
      return wrap;
    };

    const base = { ...args };

    const rows = [
      {
        title: 'Default',
        build: () =>
          buildTextarea({
            ...base,
            inputId: 'textarea-a11y-default',
            label: 'Message',
            rows: 3,
            required: false,
            validation: false,
            maxLength: undefined,
          }),
      },
      {
        title: 'With counter',
        build: () =>
          buildTextarea({
            ...base,
            inputId: 'textarea-a11y-counter',
            label: 'Summary',
            rows: 4,
            maxLength: 120,
          }),
      },
      {
        title: 'Validation',
        build: () =>
          buildTextarea({
            ...base,
            inputId: 'textarea-a11y-validation',
            label: 'Required message',
            required: true,
            validation: true,
            validationMessage: 'Please enter at least 3 characters.',
          }),
      },
      {
        title: 'Disabled',
        build: () =>
          buildTextarea({
            ...base,
            inputId: 'textarea-a11y-disabled',
            label: 'Disabled message',
            disabled: true,
            value: 'Disabled value',
          }),
      },
    ];

    rows.forEach(row => root.appendChild(renderRow(row)));
    return root;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Shows computed label, help text, validation, and max-length counter accessibility wiring.',
      },
    },
  },
};
