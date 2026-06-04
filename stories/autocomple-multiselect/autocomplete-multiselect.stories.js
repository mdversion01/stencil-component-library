// File: src/stories/autocomplete-multiselect/autocomplete-multiselect.stories.js

import DocsPage from './autocomplete-multiselect.docs.mdx';
import {
  DocsWrapStyles,
  FRUIT,
  SIZE_VARIANTS,
  buildDocsHtml,
  buildDocsHtmlMany,
  renderComponent,
  wrapDocsHtml,
} from './autocomplete-multiselect.story-helpers.js';

export default {
  title: 'Form/Autocomplete Multiselect',
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
    docs: {
      page: DocsPage,
      description: {
        component: ['Autocomplete Multiselect component for selecting multiple options from a list with autocomplete functionality.', ''].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsHtml(ctx.args)),
      },
    },
  },

  render: (args) => renderComponent(args),

  argTypes: {
    addNewOnEnter: {
      control: 'boolean',
      name: 'add-new-on-enter',
      table: { category: 'Attributes', defaultValue: { summary: true } },
      description: 'Adds a new option when the Enter key is pressed (editable mode).',
    },
    autoSort: {
      control: 'boolean',
      name: 'auto-sort',
      table: { category: 'Attributes', defaultValue: { summary: true } },
      description: 'Automatically sorts the options array when inserting new values.',
    },
    clearInputOnBlurOutside: {
      control: 'boolean',
      name: 'clear-input-on-blur-outside',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Clears the input when clicking outside the component.',
    },
    editable: {
      control: 'boolean',
      name: 'editable',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Allows adding/removing options at runtime.',
    },
    id: {
      control: 'text',
      name: 'id',
      table: { category: 'Attributes' },
      description: 'The unique identifier for the component instance.',
    },
    preserveInputOnSelect: {
      control: 'boolean',
      name: 'preserve-input-on-select',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Preserves the typed input value after selecting an option.',
    },
    rawInputName: {
      control: 'text',
      name: 'raw-input-name',
      table: { category: 'Attributes' },
      description: 'The name attribute for the raw input hidden field.',
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional accessible name for the combobox (used only when aria-labelledby is not set).',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'Optional external id reference used to label the combobox (preferred).',
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      table: { category: 'Accessibility' },
      description: 'Optional helper text id reference. Component appends validation/error ids when present.',
    },
    arialabelledBy: {
      control: 'text',
      name: 'arialabelled-by',
      table: { category: 'Accessibility' },
      description:
        'Legacy: id(s) of label(s) that label this input (space-separated). If empty, component falls back to its internal <label> id.',
    },

    badgeInlineStyles: {
      control: 'text',
      name: 'badge-inline-styles',
      table: { category: 'Badge Attributes' },
      description: 'Inline styles for the badge.',
    },
    badgeShape: {
      control: 'text',
      name: 'badge-shape',
      table: { category: 'Badge Attributes' },
      description: 'The shape of the badge.',
    },
    badgeVariant: {
      control: 'text',
      name: 'badge-variant',
      table: { category: 'Badge Attributes' },
      description: 'The variant style for the badge.',
    },

    addBtn: {
      control: 'boolean',
      name: 'add-btn',
      table: { category: 'Button Attributes', defaultValue: { summary: false } },
      description: 'Displays the add button for adding new items.',
    },
    addIcon: {
      control: 'text',
      name: 'add-icon',
      table: { category: 'Button Attributes' },
      description: 'The icon to use for the add button.',
    },
    clearIcon: {
      control: 'text',
      name: 'clear-icon',
      table: { category: 'Button Attributes' },
      description: 'The icon to use for the clear button.',
    },
    removeBtnBorder: {
      control: 'boolean',
      name: 'remove-btn-border',
      table: { category: 'Button Attributes', defaultValue: { summary: false } },
      description: 'Removes the border from the action button(s).',
    },
    removeClearBtn: {
      control: 'boolean',
      name: 'remove-clear-btn',
      table: { category: 'Button Attributes', defaultValue: { summary: false } },
      description: 'Removes the clear button from the input field.',
    },

    options: {
      control: 'object',
      name: 'options',
      table: { category: 'Data' },
      description: 'Options array (applied at runtime via setOptions/property).',
    },
    value: {
      control: 'object',
      name: 'value',
      table: { category: 'Data' },
      description: 'Controlled selected values (array). Applied via property at runtime.',
    },

    devMode: {
      control: 'boolean',
      name: 'dev-mode',
      table: { category: 'Dev Mode', defaultValue: { summary: false } },
      description: 'Enables developer mode (extra logging).',
    },

    disabled: {
      control: 'boolean',
      name: 'disabled',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Disables the input field, preventing user interaction.',
    },
    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Layout' },
      description: 'The id of the parent form element to associate with when using form layouts.',
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
      description: 'Numeric column width for input (horizontal).',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout' },
      description: 'Responsive input col classes, e.g. "xs-12 sm-8".',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes' },
      description: 'Identifier used as the base for internal ids (deduped when needed).',
    },
    label: {
      control: 'text',
      name: 'label',
      table: { category: 'Input Attributes' },
      description: 'Visible label text (still rendered as sr-only when labelHidden).',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Align label text (useful in horizontal layout).',
    },
    labelCol: {
      control: 'text',
      name: 'label-col',
      table: { category: 'Layout', defaultValue: { summary: 2 } },
      description: 'Numeric column width for label (horizontal).',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout' },
      description: 'Responsive label col classes, e.g. "xs-12 sm-4".',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Hide the label visually (kept for screen readers).',
    },
    labelSize: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'base', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
      description: 'Label size.',
    },
    name: {
      control: 'text',
      name: 'name',
      table: { category: 'Input Attributes' },
      description: 'Name for selected values hidden inputs.',
    },
    placeholder: {
      control: 'text',
      name: 'placeholder',
      table: { category: 'Input Attributes' },
      description: 'Placeholder text for the input element.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: { category: 'Layout' },
      description: 'Input size.',
    },
    type: {
      control: 'text',
      name: 'type',
      table: { category: 'Input Attributes' },
      description: 'Input type (default "text").',
    },

    error: {
      control: 'boolean',
      name: 'error',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks error state.',
    },
    errorMessage: {
      control: 'text',
      name: 'error-message',
      table: { category: 'Validation', defaultValue: { summary: '' } },
      description: 'Error message text.',
    },
    required: {
      control: 'boolean',
      name: 'required',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks input required.',
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
      description: 'Validation message text.',
    },
  },

  args: {
    addBtn: false,
    addIcon: 'fas fa-plus',
    addNewOnEnter: true,
    arialabelledBy: '',
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
    autoSort: true,
    badgeInlineStyles: '',
    badgeShape: '',
    badgeVariant: '',
    clearIcon: 'fa-solid fa-xmark',
    clearInputOnBlurOutside: false,
    devMode: false,
    disabled: false,
    editable: false,
    error: false,
    errorMessage: '',
    formId: '',
    formLayout: '',
    id: 'acm-story',
    inputCol: '',
    inputCols: '',
    inputId: 'acm-2',
    label: 'Autocomplete Multiselect',
    labelAlign: '',
    labelCol: '',
    labelCols: '',
    labelHidden: false,
    labelSize: '',
    name: '',
    options: FRUIT,
    placeholder: '',
    preserveInputOnSelect: false,
    rawInputName: '',
    removeBtnBorder: false,
    removeClearBtn: false,
    required: false,
    size: '',
    type: 'text',
    validation: false,
    validationMessage: 'Please fill in',
    value: [],
  },
};

export const Basic = {
  args: {
    addBtn: false,
    addIcon: 'fas fa-plus',
    addNewOnEnter: true,
    badgeInlineStyles: '',
    badgeShape: '',
    badgeVariant: '',
    clearIcon: 'fa-solid fa-xmark',
    clearInputOnBlurOutside: false,
    devMode: false,
    disabled: false,
    editable: false,
    formLayout: '',
    labelAlign: '',
    labelCols: '',
    labelCol: '',
    inputCol: '',
    labelHidden: false,
    labelSize: '',
    preserveInputOnSelect: false,
    removeClearBtn: false,
    required: false,
    size: '',
    validation: false,
    validationMessage: 'Please fill in',
    value: [],
  },
};
Basic.name = 'Basic';
Basic.parameters = {
  docs: {
    description: { story: 'The default configuration of the component with basic args.' },
    story: { height: '300px' },
  },
};

export const HorizontalLayout = {
  args: {
    formLayout: 'horizontal',
    labelAlign: 'right',
    labelCol: '4',
    inputCol: '8',
  },
};
HorizontalLayout.name = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story:
        'Applies a horizontal Bootstrap layout with the label aligned to the right. This layout is suitable for forms where labels and inputs are arranged in a two-column format.',
    },
    story: { height: '300px' },
  },
};

export const InlineLayout = {
  args: {
    formLayout: 'inline',
    labelAlign: '',
  },
};
InlineLayout.name = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    description: { story: 'Applies an inline layout where the label and input are displayed in a single line.' },
    story: { height: '300px' },
  },
};

export const EditableDropdown = {
  args: {
    editable: true,
    addBtn: true,
    clearInputOnBlurOutside: false,
  },
};
EditableDropdown.name = 'Adding new items to the dropdown list (Editable)';
EditableDropdown.parameters = {
  docs: {
    description: {
      story:
        'When "editable" is enabled, users can type new items/options into the field and those items will appear in the dropdown list if removed from the input. This also allows users to delete the added item by clicking the "x" from the dropdown list.',
    },
    story: { height: '300px' },
  },
};

export const ControlledValue = {
  render: (args, ctx) => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '12px';
    container.style.maxWidth = '760px';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.flexWrap = 'wrap';
    controls.style.gap = '8px';

    const mkBtn = (label, onClick) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-sm btn-secondary';
      b.textContent = label;
      b.addEventListener('click', onClick);
      return b;
    };

    const elWrap = renderComponent({
      ...args,
      id: args.id || 'acm_controlled',
      inputId: args.inputId || 'acm-controlled',
      label: args.label || 'Controlled Value',
    });

    const el = elWrap.querySelector('autocomplete-multiselect');

    const setNext = (next) => {
      const safe = Array.isArray(next) ? next.slice() : [];
      ctx.updateArgs?.({ value: safe });
      if (el) el.value = safe;
    };

    controls.appendChild(mkBtn('Set: ["Apple","Mango"]', () => setNext(['Apple', 'Mango'])));
    controls.appendChild(
      mkBtn('Add "Banana"', () => {
        const cur = Array.isArray(args.value) ? args.value.slice() : [];
        if (!cur.includes('Banana')) cur.push('Banana');
        setNext(cur);
      }),
    );
    controls.appendChild(mkBtn('Clear []', () => setNext([])));

    const hint = document.createElement('div');
    hint.style.opacity = '0.75';
    hint.textContent = `Current args.value: ${JSON.stringify(Array.isArray(args.value) ? args.value : [])}`;

    container.appendChild(controls);
    container.appendChild(hint);
    container.appendChild(elWrap);

    return container;
  },
  args: {
    value: ['Apple'],
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsHtml(ctx.args)),
      },
      description: {
        story:
          'Demonstrates the controlled `value` prop (array). Buttons call `updateArgs({ value })` and also set the element property immediately so the UI updates without waiting for a Storybook re-render.',
      },
      story: { height: '420px' },
    },
  },
};
ControlledValue.name = 'Controlled Value (array)';

export const Sizes = {
  render: (args) => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '14px';
    container.style.maxWidth = '760px';

    for (const v of SIZE_VARIANTS) {
      const el = renderComponent({
        ...args,
        id: v.id,
        inputId: v.inputId,
        label: v.label,
        size: v.size,
      });
      container.appendChild(el);
    }

    return container;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) =>
          buildDocsHtmlMany(
            SIZE_VARIANTS.map((v) =>
              buildDocsHtml({
                ...ctx.args,
                id: v.id,
                inputId: v.inputId,
                label: v.label,
                size: v.size,
                options: undefined,
              }),
            ),
          ),
      },
      description: {
        story:
          'Shows the three supported sizes by setting the `size` arg to `sm`, empty string (default), and `lg`. Note: options are set at runtime (not via attribute).',
      },
      story: { height: '480px' },
    },
  },
};
Sizes.name = 'Sizes';

export const FieldValidation = {
  args: {
    validation: true,
    validationMessage: 'This field is required.',
    required: true,
  },
};
FieldValidation.name = 'Required with Validation Message';
FieldValidation.parameters = {
  docs: {
    description: {
      story: 'Enables validation for the input field. When the field is left empty and loses focus, the specified validation message will be displayed.',
    },
    story: { height: '300px' },
  },
};

export const Disabled = {
  args: {
    inputId: 'acm-disabled',
    label: 'Disabled',
    disabled: true,
    validationMessage: '',
    addBtn: false,
    addIcon: '',
    clearIcon: '',
    autoSort: false,
    addNewOnEnter: false,
    badgeVariant: '',
    value: ['Banana', 'Cherry'],
  },
};
Disabled.name = 'Disabled';
Disabled.parameters = {
  docs: {
    description: {
      story: 'Disables the input field, preventing user interaction.',
    },
  },
};

export const BadgeStyling = {
  args: {
    inputId: 'acm-badges',
    label: 'With custom badge style',
    editable: true,
    addBtn: true,
    badgeVariant: 'info',
    badgeShape: 'rounded-pill',
    badgeInlineStyles: 'border-radius:14px; font-weight:600;',
  },
};
BadgeStyling.name = 'Custom Badge Styling';
BadgeStyling.parameters = {
  docs: {
    description: {
      story:
        'Use the "Badge Variant" control to apply Bootstrap text-bg color classes (e.g. "primary", "success", "danger") or your own CSS class for custom colors. The "Badge Shape" control can be used to apply a custom class for pill/rounded styling. For full control, use "Badge Inline Styles".',
    },
    story: { height: '300px' },
  },
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
      '<strong>Accessibility matrix</strong>' +
      '<div style="opacity:.8">Prints computed combobox/listbox/label wiring: role + aria-* + ids (default/inline/horizontal, error/validation, disabled).</div>';
    wrap.appendChild(title);

    const card = (labelText, build) => {
      const c = document.createElement('div');
      c.style.display = 'grid';
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
        const host = demo.querySelector('autocomplete-multiselect');
        const input = host?.querySelector('input[role="combobox"]');
        const labelEl = host?.querySelector('label');

        const listboxId = input?.getAttribute('aria-controls') || null;
        const listbox = listboxId ? host?.querySelector(`#${CSS.escape(listboxId)}`) : host?.querySelector('[role="listbox"]');

        pre.textContent = JSON.stringify(
          {
            hostId: host?.getAttribute('id') ?? null,
            inputId: input?.getAttribute('id') ?? null,
            labelId: labelEl?.getAttribute('id') ?? null,
            labelFor: labelEl?.getAttribute('for') ?? labelEl?.getAttribute('htmlfor') ?? null,
            labelText: labelEl?.textContent?.trim() ?? null,
            labelCount: host ? host.querySelectorAll('label').length : null,
            role: input?.getAttribute('role') ?? null,
            'aria-labelledby': input?.getAttribute('aria-labelledby') ?? null,
            'aria-label': input?.getAttribute('aria-label') ?? null,
            'aria-describedby': input?.getAttribute('aria-describedby') ?? null,
            'aria-controls': input?.getAttribute('aria-controls') ?? null,
            'aria-expanded': input?.getAttribute('aria-expanded') ?? null,
            'aria-activedescendant': input?.getAttribute('aria-activedescendant') ?? null,
            'aria-required': input?.getAttribute('aria-required') ?? null,
            'aria-invalid': input?.getAttribute('aria-invalid') ?? null,
            'aria-disabled': input?.getAttribute('aria-disabled') ?? null,
            disabledAttr: input?.hasAttribute('disabled') ?? null,
            listboxPresent: !!listbox,
            listboxId: listbox?.getAttribute('id') ?? null,
            hasValidation: !!host?.querySelector('.invalid-feedback'),
            hasError: !!host?.querySelector('.error-message'),
          },
          null,
          2,
        );
      };

      queueMicrotask(() => requestAnimationFrame(snapshot));
      return c;
    };

    wrap.appendChild(
      card('Default (stacked)', () =>
        renderComponent({
          ...args,
          inputId: 'mx-default',
          label: 'Default A11y',
          formLayout: '',
          disabled: false,
          error: false,
          validation: false,
          value: [],
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: '',
          arialabelledBy: '',
        }),
      ),
    );

    wrap.appendChild(
      card('Inline layout', () =>
        renderComponent({
          ...args,
          inputId: 'mx-inline',
          label: 'Inline',
          formLayout: 'inline',
          labelAlign: '',
          error: false,
          validation: false,
          value: [],
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: '',
          arialabelledBy: '',
        }),
      ),
    );

    wrap.appendChild(
      card('Horizontal layout', () =>
        renderComponent({
          ...args,
          inputId: 'mx-horizontal',
          label: 'Horizontal',
          formLayout: 'horizontal',
          labelAlign: 'right',
          labelCols: 'xs-12 sm-4',
          inputCols: 'xs-12 sm-8',
          error: false,
          validation: false,
          value: [],
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: '',
          arialabelledBy: '',
        }),
      ),
    );

    wrap.appendChild(
      card('Error + Validation', () =>
        renderComponent({
          ...args,
          inputId: 'mx-ev',
          label: 'Error + Validation',
          required: true,
          validation: true,
          validationMessage: 'This is required.',
          error: true,
          errorMessage: 'Something went wrong.',
          value: [],
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: '',
          arialabelledBy: '',
        }),
      ),
    );

    wrap.appendChild(
      card('Disabled', () =>
        renderComponent({
          ...args,
          inputId: 'mx-disabled',
          label: 'Disabled',
          disabled: true,
          editable: true,
          addBtn: true,
          value: ['Banana'],
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: '',
          arialabelledBy: '',
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
          'Prints computed accessibility wiring for the combobox + listbox: role + `aria-*` attributes + ids. Includes default/inline/horizontal, error+validation, and disabled examples.',
      },
    },
  },
};
