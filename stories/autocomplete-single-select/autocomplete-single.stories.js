// File: src/stories/autocomplete-single/autocomplete-single.stories.js

import DocsPage from './autocomplete-single.docs.mdx';
import {
  DocsWrapStyles,
  DEFAULT_OPTIONS,
  SIZE_VARIANTS,
  buildDocsHtml,
  buildDocsHtmlControlledValue,
  buildDocsHtmlMany,
  renderComponent,
  setValueWhenReady,
  updateArgsBestEffort,
  wrapDocsHtml,
} from './autocomplete-single.story-helpers.js';

export default {
  title: 'Form/Autocomplete Single',
  tags: ['autodocs'],
  decorators: [
    Story => {
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
        component: [
          'Autocomplete Single component for selecting a single option from a list with autocomplete functionality.',
          '',
          'Supports external `value`, validation/error messaging, accessibility wiring, disabled state, and read-only mode.',
        ].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsHtml(ctx.args)),
      },
    },
  },

  render: (args, ctx) => renderComponent(args, ctx),

  argTypes: {
    autoSort: {
      control: 'boolean',
      name: 'auto-sort',
      table: { category: 'Attributes', defaultValue: { summary: true } },
      description: 'Auto-sort options alphabetically (case-insensitive).',
    },
    devMode: {
      control: 'boolean',
      name: 'dev-mode',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Enables developer mode (extra logging).',
    },
    disabled: {
      control: 'boolean',
      name: 'disabled',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Disables the input field, preventing user interaction.',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Makes the input read-only. The input remains focusable, but typing, clearing, and dropdown interaction are disabled.',
    },
    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Attributes' },
      description: 'Associates the input with a form element by its id.',
    },
    id: {
      control: 'text',
      name: 'id',
      table: { category: 'Attributes' },
      description:
        'Base id for the host element. Storybook will suffix it per-mount to prevent duplicate ids when Docs mounts stories multiple times.',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Hides the label visually while keeping it accessible for screen readers.',
    },
    removeClearBtn: {
      control: 'boolean',
      name: 'remove-clear-btn',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Hide the clear button.',
    },

    clearIcon: {
      control: 'text',
      name: 'clear-icon',
      table: { category: 'Button Attributes' },
      description: 'The icon to use for the clear button.',
    },

    options: {
      control: 'object',
      name: 'options',
      table: { category: 'Data' },
      description: 'The array of options available for selection in the autocomplete. Applied at runtime via prop assignment.',
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
      table: { category: 'Input Attributes' },
      description: 'Legacy: The id(s) of the element(s) that label the input.',
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes' },
      description:
        'Base input-id used to derive internal ARIA ids. Storybook will suffix it per-mount to prevent collisions when Docs mounts twice.',
    },
    label: {
      control: 'text',
      name: 'label',
      table: { category: 'Input Attributes' },
      description: 'The text label for the component.',
    },
    placeholder: {
      control: 'text',
      name: 'placeholder',
      table: { category: 'Input Attributes' },
      description: 'The placeholder text for the input element.',
    },
    type: {
      control: 'text',
      name: 'type',
      table: { category: 'Input Attributes' },
      description: 'The type attribute for the input element.',
    },
    value: {
      control: 'text',
      name: 'value',
      table: { category: 'Input Attributes' },
      description: 'Controlled value (external source of truth). The component sanitizes and mirrors this into its input.',
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
      description: 'Used with horizontal form layouts. Single numeric column for the input in a grid.',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive input column classes.',
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
      description: 'Used with horizontal form layouts. Single numeric column for the label in a grid.',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive label column classes.',
    },
    labelSize: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'base', 'lg'],
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

    error: {
      control: 'boolean',
      name: 'error',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the input as having an error state.',
    },
    errorMessage: {
      control: 'text',
      name: 'error-message',
      table: { category: 'Validation', defaultValue: { summary: '' } },
      description: 'The error message to display when the input is in an error state.',
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
      description: 'The validation message to display when the input is invalid.',
    },
  },

  args: {
    arialabelledBy: '',
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
    autoSort: true,
    clearIcon: 'fa-solid fa-xmark',
    devMode: false,
    disabled: false,
    readOnly: false,
    error: false,
    errorMessage: '',
    formId: '',
    formLayout: '',
    id: 'acSingle_story',
    inputCol: 10,
    inputCols: '',
    inputId: 'acSingle',
    label: 'Autocomplete Single',
    labelAlign: '',
    labelCol: 2,
    labelCols: '',
    labelHidden: false,
    labelSize: 'sm',
    options: DEFAULT_OPTIONS,
    placeholder: 'Type to search/filter...',
    removeClearBtn: false,
    required: false,
    size: '',
    type: 'text',
    validation: false,
    validationMessage: 'Please fill in',
    value: '',
  },
};

export const Basic = {
  args: {
    id: 'acSingle_basic',
    inputId: 'acSingle_basic',
    value: '',
  },
};
Basic.name = 'Basic';
Basic.parameters = {
  docs: { description: { story: 'Default single-select autocomplete.' }, story: { height: '300px' } },
};

export const HorizontalLayout = {
  args: {
    id: 'acSingle_horizontal',
    inputId: 'acSingle_horizontal',
    formLayout: 'horizontal',
    labelAlign: 'right',
    labelCol: 4,
    inputCol: 8,
  },
};
HorizontalLayout.name = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: { description: { story: 'Horizontal form layout with right-aligned label.' }, story: { height: '300px' } },
};

export const InlineLayout = {
  args: {
    id: 'acSingle_inline',
    inputId: 'acSingle_inline',
    formLayout: 'inline',
    labelAlign: '',
    size: 'sm',
  },
};
InlineLayout.name = 'Inline Layout';
InlineLayout.parameters = {
  docs: { description: { story: 'Inline layout where label + input sit in a single row.' }, story: { height: '300px' } },
};

export const Sizes = {
  render: (args, ctx) => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '14px';
    container.style.maxWidth = '760px';

    for (const v of SIZE_VARIANTS) {
      const nextArgs = {
        ...args,
        id: v.id,
        inputId: v.inputId,
        label: `${args.label || 'Autocomplete Single'} — ${v.label}`,
        size: v.size,
      };
      const el = renderComponent(nextArgs, ctx);
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
            SIZE_VARIANTS.map(v =>
              buildDocsHtml({
                ...ctx.args,
                id: v.id,
                inputId: v.inputId,
                label: `${ctx.args.label || 'Autocomplete Single'} — ${v.label}`,
                size: v.size,
                options: undefined,
              }),
            ),
          ),
      },
      description: {
        story: 'Shows sizes by setting `size` to `sm`, empty string (default), and `lg`.',
      },
      story: { height: '480px' },
    },
  },
};
Sizes.name = 'Sizes';

export const ControlledValue = {
  args: {
    id: 'acSingle_controlled',
    inputId: 'acSingle_controlled',
    placeholder: 'Type to search/filter...',
    value: 'Apple',
  },
  render: (args, ctx) => {
    const wrap = document.createElement('div');
    wrap.style.maxWidth = '680px';
    wrap.style.display = 'grid';
    wrap.style.gap = '10px';

    let controlledValue = typeof args.value === 'string' ? args.value : 'Apple';

    const stateBox = document.createElement('div');
    stateBox.style.fontSize = '14px';
    stateBox.style.color = '#444';
    stateBox.style.padding = '8px 0';

    const el = renderComponent({ ...args, value: controlledValue }, ctx);

    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '8px';
    buttons.style.flexWrap = 'wrap';

    const mkBtn = label => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-sm btn-secondary';
      b.textContent = label;
      return b;
    };

    const btnApple = mkBtn('Set "Apple"');
    const btnMango = mkBtn('Set "Mango"');
    const btnClear = mkBtn('Clear value');

    buttons.appendChild(btnApple);
    buttons.appendChild(btnMango);
    buttons.appendChild(btnClear);

    const renderState = source => {
      stateBox.textContent = `External controlled value (${source}): ${JSON.stringify(controlledValue)}`;
    };

    const applyValue = (next, source) => {
      controlledValue = typeof next === 'string' ? next : '';
      setValueWhenReady(el, controlledValue);
      updateArgsBestEffort(ctx, { value: controlledValue });
      renderState(source);
    };

    btnApple.addEventListener('click', () => applyValue('Apple', 'button click'));
    btnMango.addEventListener('click', () => applyValue('Mango', 'button click'));
    btnClear.addEventListener('click', () => applyValue('', 'button click'));

    el.addEventListener('itemSelect', e => applyValue(String(e?.detail ?? ''), 'itemSelect event'));
    el.addEventListener('clear', () => applyValue('', 'clear event'));

    renderState('initial args.value');

    wrap.appendChild(el);
    wrap.appendChild(buttons);
    wrap.appendChild(stateBox);
    return wrap;
  },
};
ControlledValue.name = 'Controlled Value (args.value)';
ControlledValue.parameters = {
  docs: {
    source: {
      language: 'html',
      transform: () => wrapDocsHtml(buildDocsHtmlControlledValue()),
    },
    description: {
      story: 'Demonstrates the `value` prop as the external source of truth, including the external state that drives the component.',
    },
    story: { height: '380px' },
  },
};

export const FieldValidation = {
  args: {
    id: 'acSingle_validation',
    inputId: 'acSingle_validation',
    validation: true,
    validationMessage: 'This field is required.',
    required: true,
  },
};
FieldValidation.name = 'Field Validation';
FieldValidation.parameters = {
  docs: {
    description: { story: 'Shows external validation state + validation message.' },
    story: { height: '300px' },
  },
};

export const Disabled = {
  args: {
    id: 'acSingle_disabled',
    inputId: 'acSingle_disabled',
    disabled: true,
    value: 'Banana',
    placeholder: '',
    validationMessage: '',
  },
};
Disabled.name = 'Disabled';
Disabled.parameters = {
  docs: { description: { story: 'Disabled state example (with a preset value).' } },
};

export const ReadOnly = {
  args: {
    id: 'acSingle_readonly',
    inputId: 'acSingle_readonly',
    readOnly: true,
    value: 'Banana',
    placeholder: '',
    validationMessage: '',
  },
};
ReadOnly.name = 'Read Only';
ReadOnly.parameters = {
  docs: {
    description: {
      story: 'Read-only state. The input remains focusable and announces `aria-readonly`, but typing, clearing, and dropdown interaction are disabled.',
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (args, ctx) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML = `<strong>Accessibility matrix</strong>
<div style="opacity:.8">Prints computed label/combobox/listbox wiring: role + aria-* + ids (default/inline/horizontal, validation/error, disabled, readOnly).</div>`;
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
        const host = demo.querySelector('autocomplete-single');
        const input = host?.querySelector('input[role="combobox"]');
        const listboxId = input?.getAttribute('aria-controls');
        const listbox = listboxId ? host?.querySelector(`#${CSS.escape(listboxId)}`) : host?.querySelector('[role="listbox"]');
        const labelEl = host?.querySelector('label');

        pre.textContent = JSON.stringify(
          {
            hostTag: host?.tagName?.toLowerCase() ?? null,
            inputId: input?.getAttribute('id') ?? null,
            labelId: labelEl?.getAttribute('id') ?? null,
            labelFor: labelEl?.getAttribute('for') ?? labelEl?.getAttribute('htmlfor') ?? null,
            role: input?.getAttribute('role') ?? null,
            ariaLabelledby: input?.getAttribute('aria-labelledby') ?? null,
            ariaLabel: input?.getAttribute('aria-label') ?? null,
            ariaDescribedby: input?.getAttribute('aria-describedby') ?? null,
            ariaControls: input?.getAttribute('aria-controls') ?? null,
            ariaExpanded: input?.getAttribute('aria-expanded') ?? null,
            ariaActivedescendant: input?.getAttribute('aria-activedescendant') ?? null,
            ariaRequired: input?.getAttribute('aria-required') ?? null,
            ariaInvalid: input?.getAttribute('aria-invalid') ?? null,
            ariaDisabled: input?.getAttribute('aria-disabled') ?? null,
            ariaReadonly: input?.getAttribute('aria-readonly') ?? null,
            readonly: input?.hasAttribute('readonly') ?? false,
            disabled: input?.hasAttribute('disabled') ?? false,
            listboxPresent: !!listbox,
            listboxId: listbox?.getAttribute('id') ?? null,
            hasValidation: !!host?.querySelector('.invalid-feedback'),
            hasError: !!host?.querySelector('.error-message'),
            hasClearButton: !!host?.querySelector('button.clear-btn'),
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
        renderComponent(
          {
            ...args,
            inputId: 'mx-default',
            label: 'Default A11y',
            formLayout: '',
            validation: false,
            error: false,
            disabled: false,
            readOnly: false,
            value: '',
          },
          ctx,
        ),
      ),
    );

    wrap.appendChild(
      cardRow('Inline layout', () =>
        renderComponent(
          {
            ...args,
            inputId: 'mx-inline',
            label: 'Inline A11y',
            formLayout: 'inline',
            labelAlign: '',
            validation: false,
            error: false,
            disabled: false,
            readOnly: false,
            value: '',
          },
          ctx,
        ),
      ),
    );

    wrap.appendChild(
      cardRow('Horizontal layout', () =>
        renderComponent(
          {
            ...args,
            inputId: 'mx-horizontal',
            label: 'Horizontal A11y',
            formLayout: 'horizontal',
            labelAlign: 'right',
            labelCol: 4,
            inputCol: 8,
            validation: false,
            error: false,
            disabled: false,
            readOnly: false,
            value: '',
          },
          ctx,
        ),
      ),
    );

    wrap.appendChild(
      cardRow('Validation + Error (aria-invalid + describedby)', () =>
        renderComponent(
          {
            ...args,
            inputId: 'mx-msg',
            label: 'Messages',
            required: true,
            validation: true,
            validationMessage: 'This is required.',
            error: true,
            errorMessage: 'Something went wrong.',
            readOnly: false,
            value: '',
          },
          ctx,
        ),
      ),
    );

    wrap.appendChild(
      cardRow('Disabled (aria-disabled)', () =>
        renderComponent(
          {
            ...args,
            inputId: 'mx-disabled',
            label: 'Disabled',
            disabled: true,
            readOnly: false,
            value: 'Banana',
            validation: false,
            error: false,
          },
          ctx,
        ),
      ),
    );

    wrap.appendChild(
      cardRow('Read only (aria-readonly)', () =>
        renderComponent(
          {
            ...args,
            inputId: 'mx-readonly',
            label: 'Read only',
            disabled: false,
            readOnly: true,
            value: 'Banana',
            validation: false,
            error: false,
          },
          ctx,
        ),
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the combobox + listbox: role/aria-labelledby/aria-describedby/aria-controls/aria-expanded/aria-activedescendant plus ids across layouts and states, including disabled and readOnly.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsHtml(ctx.args)),
      },
    },
  },
};
