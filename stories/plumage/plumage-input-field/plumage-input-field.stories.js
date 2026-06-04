import DocsPage from './plumage-input-field.docs.mdx';
import {
  TAG,
  DocsWrapStyles,
  buildDocsHtml,
  buildDocsHtmlInlineLayout,
  buildDocsHtmlReadOnlyAndDisabled,
  buildDocsHtmlSizes,
  cssEscapeIdent,
  makeInput,
  renderComponent,
  wrapInForm,
} from './plumage-input-field.story-helpers.js';

/* ------------------------------------------------------------------
 * Storybook: Plumage Input Field (Web Component)
 * Component tag: <plumage-input-field-component>
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Plumage Input Field',
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      const wrap = document.createElement('div');
      wrap.appendChild(DocsWrapStyles());
      wrap.appendChild(Story());
      return wrap;
    },
  ],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'A customizable single Plumage-styled text input field component with various props for label, size, validation, layout, and standard ARIA naming hooks (aria-label/aria-labelledby/aria-describedby).',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  render: (args) => renderComponent(args),

  argTypes: {
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
      description: 'The placeholder text for the input element.',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      description: 'Whether the input field is read-only.',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
    },
    type: {
      control: 'text',
      name: 'type',
      description: 'The type of the input field.',
      table: { category: 'Input Attributes' },
    },
    value: {
      control: 'text',
      name: 'value',
      description: 'Controlled value (external source of truth).',
      table: { category: 'Input Attributes' },
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional accessible name for the input (used only when aria-labelledby is not set).',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'Optional external id reference used to label the input (preferred).',
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      table: { category: 'Accessibility' },
      description: 'Optional helper text id reference. Component appends validation id when invalid.',
    },
    arialabelledBy: {
      control: 'text',
      name: 'arialabelled-by',
      table: { category: 'Accessibility' },
      description: 'Legacy: id(s) of external label(s). Prefer aria-labelledby.',
    },

    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Layout' },
      description: 'Associates the input with a form element by its id.',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description: 'Sets the form layout style.',
    },
    inputCol: {
      control: 'text',
      name: 'input-col',
      table: { category: 'Layout', defaultValue: { summary: 10 } },
      description: 'Used with horizontal form layouts. Numeric column for the input.',
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
      description: 'The unique identifier for the input (also becomes the input id used for a11y wiring).',
    },
    label: {
      control: 'text',
      name: 'label',
      table: { category: 'Layout' },
      description: 'The text label for the component.',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Aligns the label text.',
    },
    labelCol: {
      control: 'text',
      name: 'label-col',
      table: { category: 'Layout', defaultValue: { summary: 2 } },
      description: 'Used with horizontal form layouts. Numeric column for the label.',
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
      description: 'Sets the size of the label text.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: { category: 'Layout' },
      description: 'Sets the size of the input field.',
    },

    wrapWithForm: {
      control: 'boolean',
      name: 'wrap-with-form',
      description: 'When enabled, wraps the input in a <form-component> and slots it as formField. Story-only control.',
      table: { category: 'Storybook Only', defaultValue: { summary: false } },
    },

    required: {
      control: 'boolean',
      name: 'required',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the input as required.',
    },
    validation: {
      control: 'boolean',
      name: 'validation',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Externally toggled invalid state.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'The validation message to display when invalid.',
    },
  },

  args: {
    disabled: false,
    placeholder: '',
    readOnly: false,
    type: 'text',
    value: '',

    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
    arialabelledBy: '',

    formId: '',
    formLayout: '',
    inputCol: 10,
    inputCols: '',
    inputId: 'plumage-if-default',
    label: 'First Name',
    labelAlign: '',
    labelCol: 2,
    labelCols: '',
    labelHidden: false,
    labelSize: 'xs',
    size: '',

    required: false,
    validation: false,
    validationMessage: 'This field is required.',

    wrapWithForm: false,
  },
};

/* ------------------------------------------------------------------
 * Stories
 * ------------------------------------------------------------------ */

export const Basic = {
  args: {
    label: 'First Name',
    inputId: 'plumage-if-basic',
    placeholder: 'Enter your first name',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
    labelSize: 'sm',
  },
};
Basic.name = 'Basic';
Basic.parameters = {
  docs: {
    description: {
      story: 'A basic input field with a label and placeholder.',
    },
  },
};

export const Sizes = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '12px';

    container.append(
      renderComponent({ label: 'Default', inputId: 'size-default', size: '' }),
      renderComponent({ label: 'Small', inputId: 'size-sm', size: 'sm' }),
      renderComponent({ label: 'Large', inputId: 'size-lg', size: 'lg' }),
    );
    return container;
  },
};
Sizes.parameters = {
  docs: {
    source: {
      language: 'html',
      transform: () => buildDocsHtmlSizes(),
    },
    description: {
      story: 'Input fields with different sizes, demonstrating small, default, and large options.',
    },
  },
};

export const HorizontalLayout = {
  args: {
    formLayout: 'horizontal',
    label: 'Email',
    inputId: 'email',
    type: 'email',
    labelCol: 3,
    inputCol: 9,
    validationMessage: '',
    formId: 'demo-form',
    wrapWithForm: true,
  },
  render: (args) => renderComponent(args),
};
HorizontalLayout.name = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'An input field within a horizontal form layout, using labelCol and inputCol for grid sizing.',
    },
  },
};

export const InlineLayout = {
  render: () => {
    const row = document.createElement('form-component');
    row.formLayout = 'inline';
    row.formId = 'inline-form';
    row.setAttribute('style', 'display:block; padding:12px; gap:12px;');

    const first = makeInput({
      label: 'City',
      inputId: 'city',
      formLayout: 'inline',
      validationMessage: '',
      labelCol: '',
      inputCol: '',
    });
    first.setAttribute('slot', 'formField');

    const second = makeInput({
      label: 'State',
      inputId: 'state',
      formLayout: 'inline',
      validationMessage: '',
      labelCol: '',
      inputCol: '',
    });
    second.setAttribute('slot', 'formField');

    row.append(first, second);
    return row;
  },
};
InlineLayout.name = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    source: {
      language: 'html',
      transform: () => buildDocsHtmlInlineLayout(),
    },
    description: {
      story: 'An input field within an inline form layout.',
    },
  },
};

export const RequiredWithValidation = {
  args: {
    label: 'Username',
    inputId: 'username',
    required: true,
    validation: true,
    validationMessage: 'Please enter at least 3 characters.',
    formLayout: '',
    labelCol: '',
    inputCol: '',
  },
};
RequiredWithValidation.name = 'Required with Validation';
RequiredWithValidation.parameters = {
  docs: {
    description: {
      story: 'A required input field with validation enabled.',
    },
  },
};

export const LabelHidden = {
  args: {
    label: 'Search',
    inputId: 'search',
    labelHidden: true,
    placeholder: 'Search…',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
    labelSize: '',
    ariaLabel: '',
  },
};
LabelHidden.name = 'Label Hidden';
LabelHidden.parameters = {
  docs: {
    description: {
      story: 'An input field with the label visually hidden but still accessible (sr-only label + aria-labelledby).',
    },
  },
};

export const ReadOnlyAndDisabled = {
  render: () => {
    const stack = document.createElement('div');
    stack.style.display = 'grid';
    stack.style.gap = '12px';

    stack.append(
      renderComponent({
        label: 'Read-only',
        inputId: 'ro',
        readOnly: true,
        value: 'Read only value',
        validationMessage: '',
        labelCol: '',
        inputCol: '',
      }),
      renderComponent({
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
          'Two input fields demonstrating read-only and disabled states. Read-only can be focused/selected but not edited; disabled is non-interactive.',
      },
    },
  },
};
ReadOnlyAndDisabled.name = 'Read-Only and Disabled';

export const ResponsiveCols = {
  args: {
    wrapWithForm: true,
    formLayout: 'horizontal',
    formId: 'demo-form',
    label: 'Company',
    inputId: 'company',
    labelCols: 'sm-3 md-4',
    inputCols: 'sm-9 md-8',
    validationMessage: '',
    labelCol: '',
    inputCol: '',
  },
  render: (args) => renderComponent(args),
};
ResponsiveCols.name = 'Responsive Columns';
ResponsiveCols.parameters = {
  docs: {
    description: {
      story: 'Demonstrates responsive column sizing using `labelCols` and `inputCols` within a horizontal form layout (via form-component wrapper).',
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML = `<strong>Accessibility matrix</strong>
<div style="opacity:.8">Prints computed label/input wiring: tag + ids + aria-* across default/inline/horizontal, validation, and disabled.</div>`;
    wrap.appendChild(title);

    const cardRow = (labelText, buildEl) => {
      const card = document.createElement('div');
      card.style.display = 'grid';
      card.style.alignItems = 'start';
      card.style.border = '1px solid #ddd';
      card.style.borderRadius = '8px';
      card.style.padding = '12px';

      const left = document.createElement('div');
      left.innerHTML = `<div style="font-weight:600">${labelText}</div>`;

      const right = document.createElement('div');
      right.style.display = 'grid';
      right.style.gap = '8px';

      const demo = document.createElement('div');
      const el = buildEl();
      demo.appendChild(el);

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

      card.appendChild(left);
      card.appendChild(right);

      const snapshot = () => {
        const host = demo.querySelector(TAG);
        const input = host?.querySelector('input') || null;
        const label = host?.querySelector('label') || null;

        const described = (input?.getAttribute('aria-describedby') || '').trim();
        const describedIds = described ? described.split(/\s+/).filter(Boolean) : [];
        const resolved = describedIds.map((id) => {
          const sel = `#${cssEscapeIdent(id)}`;
          return { id, exists: !!host?.querySelector(sel) };
        });

        pre.textContent = JSON.stringify(
          {
            hostTag: host?.tagName?.toLowerCase() ?? null,
            inputTag: input?.tagName?.toLowerCase() ?? null,
            inputId: input?.getAttribute('id') ?? null,
            inputName: input?.getAttribute('name') ?? null,
            labelId: label?.getAttribute('id') ?? null,
            labelFor: label?.getAttribute('for') ?? label?.getAttribute('htmlfor') ?? null,
            role: input?.getAttribute('role') ?? null,
            type: input?.getAttribute('type') ?? null,
            'aria-labelledby': input?.getAttribute('aria-labelledby') ?? null,
            'aria-label': input?.getAttribute('aria-label') ?? null,
            'aria-describedby': input?.getAttribute('aria-describedby') ?? null,
            'aria-required': input?.getAttribute('aria-required') ?? null,
            'aria-invalid': input?.getAttribute('aria-invalid') ?? null,
            'aria-disabled': input?.getAttribute('aria-disabled') ?? null,
            'aria-readonly': input?.getAttribute('aria-readonly') ?? null,
            disabled: input?.hasAttribute('disabled') ?? null,
            readOnly: input?.hasAttribute('readonly') ?? null,
            hasValidationMessage: !!host?.querySelector('.invalid-feedback'),
            describedbyResolves: resolved,
          },
          null,
          2,
        );
      };

      queueMicrotask(() => requestAnimationFrame(snapshot));
      return card;
    };

    wrap.appendChild(
      cardRow('Default (stacked)', () =>
        renderComponent({
          label: 'Default A11y',
          inputId: 'mx-default',
          formLayout: '',
          validation: false,
          disabled: false,
          readOnly: false,
          required: false,
          validationMessage: '',
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: '',
          arialabelledBy: '',
        }),
      ),
    );

    wrap.appendChild(
      cardRow('Inline layout', () => {
        const input = makeInput({
          label: 'Inline A11y',
          inputId: 'mx-inline',
          formLayout: 'inline',
          validationMessage: '',
        });
        return wrapInForm(input, { formLayout: 'inline', formId: 'mx-form-inline' });
      }),
    );

    wrap.appendChild(
      cardRow('Horizontal layout', () =>
        renderComponent({
          wrapWithForm: true,
          formId: 'mx-form-horizontal',
          formLayout: 'horizontal',
          label: 'Horizontal A11y',
          inputId: 'mx-horizontal',
          labelCol: 4,
          inputCol: 8,
          validationMessage: '',
        }),
      ),
    );

    wrap.appendChild(
      cardRow('Validation (aria-invalid + describedby)', () =>
        renderComponent({
          label: 'Messages',
          inputId: 'mx-msg',
          required: true,
          validation: true,
          validationMessage: 'This is required.',
          value: '',
        }),
      ),
    );

    wrap.appendChild(
      cardRow('Disabled (aria-disabled)', () =>
        renderComponent({
          label: 'Disabled',
          inputId: 'mx-disabled',
          disabled: true,
          value: 'Disabled value',
          validationMessage: '',
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
          'Prints computed accessibility wiring for the input: ids + label association + aria-* (aria-labelledby/aria-label/aria-describedby/aria-invalid/aria-disabled/aria-readonly) across default/inline/horizontal, validation, and disabled.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
};
