// File: src/stories/input-group-component/input-group-component.stories.js

import DocsPage from './input-group-component.docs.mdx';
import {
  buildDocsHtml,
  buildDocsHtmlExternalValue,
  buildDocsHtmlValueProp,
  buildEl,
  renderMatrixRow,
} from './input-group-component.story-helpers.js';

export default {
  title: 'Form/Input Group',
  tags: ['autodocs'],
  render: args => buildEl(args),
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'The `input-group-component` is a wrapper for an input field that allows you to add prepend and append content such as icons, text, or native buttons. It also supports various form layouts, affix button IDs, emitted click events, validation states, read-only mode, and external value syncing.',
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
      description:
        'When enabled, the input group and its child input field will be disabled, preventing user interaction and applying appropriate disabled styles.',
    },
    readOnly: {
      control: 'boolean',
      name: 'read-only',
      table: { defaultValue: { summary: false }, category: 'Input Attributes' },
      description:
        'When enabled, the input field is read-only. Users can focus and select text, but cannot modify the value.',
    },
    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Input Attributes' },
      description: 'Associates the internal input with an external form element by ID.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes', defaultValue: { summary: 'amount-play' } },
      description:
        'ID for the input field, used to associate the label with the input for accessibility. This should be unique on the page.',
    },
    placeholder: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Placeholder text for the input field.',
    },
    type: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Type of the input field (e.g., "text", "password", "email").',
    },
    value: {
      control: 'text',
      description: 'The value of the input field.',
      table: { category: 'Input Attributes' },
    },

    append: {
      control: 'boolean',
      name: 'has-append',
      table: { category: 'Layout', defaultValue: { summary: true } },
      description: 'When enabled, renders content after the input field.',
    },
    appendIcon: {
      control: 'text',
      name: 'append-icon',
      table: { category: 'Layout' },
      description: 'Specify an icon class to display an icon on the append side.',
    },
    appendId: {
      control: 'text',
      name: 'append-id',
      table: { category: 'Layout' },
      description: 'ID for the append wrapper element.',
    },
    appendButtonId: {
      control: 'text',
      name: 'append-button-id',
      table: { category: 'Layout' },
      description: 'ID applied directly to the native append button when append-button is enabled.',
    },
    appendText: {
      control: 'text',
      name: 'append-text',
      table: { category: 'Layout' },
      description: 'Text content rendered on the append side when no icon is used.',
    },
    appendButton: {
      control: 'boolean',
      name: 'append-button',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Render the append side as a native button.',
    },
    appendButtonType: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      name: 'append-button-type',
      table: { category: 'Layout' },
      description: 'Native button type used when append-button is enabled.',
    },
    appendButtonVariant: {
      control: 'text',
      name: 'append-button-variant',
      table: { category: 'Layout' },
      description: 'Bootstrap-style button variant used when append-button is enabled.',
    },
    appendAriaLabel: {
      control: 'text',
      name: 'append-aria-label',
      table: { category: 'Layout' },
      description: 'Accessible label applied to the append button when rendered as a button.',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      description:
        'Form layout variant. "horizontal" uses a grid layout with label and input side by side. "inline" is similar but uses auto-width columns for a more compact display.',
      table: { category: 'Layout' },
    },
    icon: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Global icon class used as a fallback on prepend/append when side-specific icons are not provided.',
    },
    prepend: {
      control: 'boolean',
      name: 'has-prepend',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'When enabled, renders content before the input field.',
    },
    prependIcon: {
      control: 'text',
      name: 'prepend-icon',
      table: { category: 'Layout' },
      description: 'Specify an icon class to display an icon on the prepend side.',
    },
    prependId: {
      control: 'text',
      name: 'prepend-id',
      table: { category: 'Layout' },
      description: 'ID for the prepend wrapper element.',
    },
    prependButtonId: {
      control: 'text',
      name: 'prepend-button-id',
      table: { category: 'Layout' },
      description: 'ID applied directly to the native prepend button when prepend-button is enabled.',
    },
    prependText: {
      control: 'text',
      name: 'prepend-text',
      table: { category: 'Layout' },
      description: 'Text content rendered on the prepend side when no icon is used.',
    },
    prependButton: {
      control: 'boolean',
      name: 'prepend-button',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Render the prepend side as a native button.',
    },
    prependButtonType: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      name: 'prepend-button-type',
      table: { category: 'Layout' },
      description: 'Native button type used when prepend-button is enabled.',
    },
    prependButtonVariant: {
      control: 'text',
      name: 'prepend-button-variant',
      table: { category: 'Layout' },
      description: 'Bootstrap-style button variant used when prepend-button is enabled.',
    },
    prependAriaLabel: {
      control: 'text',
      name: 'prepend-aria-label',
      table: { category: 'Layout' },
      description: 'Accessible label applied to the prepend button when rendered as a button.',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'input-col',
      table: { category: 'Layout' },
      description: 'Number of grid columns for the input (horizontal layout only).',
    },
    inputCols: {
      control: 'text',
      table: { category: 'Layout' },
      name: 'input-cols',
      description: 'For example: "col-sm-9 col-md-8" or "xs-12 sm-6 md-8".',
    },
    label: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Label text for the input.',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Alignment for the label text when the label is visible.',
    },
    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'label-col',
      table: { category: 'Layout' },
      description: 'Number of grid columns for the label (horizontal layout only).',
    },
    labelCols: {
      control: 'text',
      table: { category: 'Layout' },
      name: 'label-cols',
      description: 'For example: "col-sm-3 col-md-4" or "xs-12 sm-6 md-4".',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Visually hide the label while keeping it accessible to screen readers.',
    },
    labelSize: {
      control: { type: 'select' },
      options: ['base', 'xs', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description: 'Size variant.',
    },

    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      description: 'Mark the input as required.',
    },
    validation: {
      control: 'boolean',
      name: 'validation',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Enable or disable validation state.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'Message to display when validation fails.',
    },
  },
  args: {
    label: 'Amount',
    inputId: 'amount-play',
    placeholder: 'Enter amount',
    type: 'text',
    value: '',
    disabled: false,
    readOnly: false,
    formId: '',

    formLayout: '',
    size: '',
    labelHidden: false,
    labelAlign: '',
    labelSize: 'sm',
    labelCols: '',
    inputCols: '',
    labelCol: 2,
    inputCol: 10,

    prepend: false,
    append: true,
    icon: '',
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
    prependText: '',
    appendText: '',
    prependButton: false,
    appendButton: false,
    prependButtonType: 'button',
    appendButtonType: 'button',
    prependButtonVariant: 'secondary',
    appendButtonVariant: 'secondary',
    prependAriaLabel: '',
    appendAriaLabel: '',
    appendId: '',
    prependId: '',
    appendButtonId: '',
    prependButtonId: '',

    required: false,
    validation: false,
    validationMessage: 'Please provide a value.',
  },
};

export const Basic = {
  name: 'Basic Usage',
  args: {
    label: 'Amount',
    inputId: 'amount-play',
    placeholder: 'Enter amount',
    size: '',
    formLayout: '',
    labelHidden: false,
    labelAlign: '',
    required: false,
    disabled: false,
    readOnly: false,
    formId: '',

    prepend: false,
    append: true,

    icon: '',
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
    prependText: '',
    appendText: '',
    prependButton: false,
    appendButton: false,
    prependButtonType: 'button',
    appendButtonType: 'button',
    prependButtonVariant: 'secondary',
    appendButtonVariant: 'secondary',
    prependAriaLabel: '',
    appendAriaLabel: '',
    appendId: '',
    prependId: '',
    appendButtonId: '',
    prependButtonId: '',

    validation: false,
    validationMessage: 'Please provide a value.',
    value: '',

    labelCols: '',
    inputCols: '',
    labelCol: 2,
    inputCol: 10,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the input group component with an append icon. You can customize the label, placeholder, and affix content using the controls.',
      },
    },
  },
};

export const ValueProp = {
  name: 'Value Prop',
  args: {
    ...Basic.args,
    inputId: 'amount-value',
    label: 'Amount',
    value: '123.45',
    placeholder: 'Enter amount',
    prepend: false,
    append: true,
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () => buildDocsHtmlValueProp(),
      },
      description: {
        story:
          'This example demonstrates setting the initial input value with the `value` prop.',
      },
    },
  },
};

export const ExternalValue = {
  name: 'External Value',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';
    wrap.style.maxWidth = '640px';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.flexWrap = 'wrap';
    controls.style.gap = '8px';

    const output = document.createElement('div');
    output.style.fontSize = '14px';
    output.style.color = '#444';

    const host = buildEl({
      ...Basic.args,
      inputId: 'amount-external',
      label: 'Amount',
      placeholder: 'Enter amount',
      prepend: false,
      append: true,
      prependIcon: '',
      appendIcon: 'fa-solid fa-dollar-sign',
      value: '',
    });

    const update = () => {
      output.textContent = `Current external value: ${JSON.stringify(host.value ?? '')}`;
    };

    const makeButton = (label, nextValue) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        host.value = nextValue;
        update();
      });
      return btn;
    };

    host.addEventListener('valueChange', e => {
      output.textContent = `Current external value: ${JSON.stringify(e.detail?.value ?? '')}`;
    });

    controls.append(
      makeButton('Load 123.45', '123.45'),
      makeButton('Load 999.00', '999.00'),
      makeButton('Load 42.00', '42.00'),
      makeButton('Clear', ''),
    );

    update();
    wrap.append(controls, host, output);
    return wrap;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () => buildDocsHtmlExternalValue(),
      },
      description: {
        story:
          'Demonstrates updating the component from an external source after render by assigning to the `value` property. The native input stays synced with external value changes.',
      },
    },
  },
};

export const RequiredWithValidation = {
  name: 'Required + Validation',
  args: {
    ...Basic.args,
    required: true,
    validation: true,
    validationMessage: 'Please provide a value.',
    value: '',
    appendIcon: 'fa-solid fa-dollar-sign',
    append: true,
    prependIcon: '',
    prepend: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates the required and validation states. The input is marked as required, and validation is enabled.',
      },
    },
  },
};

export const DisabledState = {
  name: 'Disabled',
  args: {
    ...Basic.args,
    inputId: 'amount-disabled',
    label: 'Amount',
    disabled: true,
    prepend: false,
    append: true,
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example shows the disabled state of the input group. When disabled, the input and any prepend/append content will be non-interactive and styled accordingly.',
      },
    },
  },
};

export const ReadOnlyState = {
  name: 'Read Only',
  args: {
    ...Basic.args,
    inputId: 'amount-readonly',
    label: 'Amount',
    value: '123.45',
    readOnly: true,
    prepend: false,
    append: true,
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example shows the read-only state. The field can receive focus and its value can be selected, but the user cannot edit it.',
      },
    },
  },
};

export const AppendAndPrependButtons = {
  name: 'Append + Prepend Buttons',
  args: {
    ...Basic.args,
    inputId: 'amount1',
    label: 'Amount',
    prepend: true,
    append: true,
    prependIcon: '',
    appendIcon: '',
    prependText: 'Go',
    appendText: 'Go',
    prependButton: true,
    appendButton: true,
    prependButtonVariant: 'secondary',
    appendButtonVariant: 'secondary',
    prependButtonId: 'amount1-prepend-btn',
    appendButtonId: 'amount1-append-btn',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example shows both prepend and append rendered as native buttons using the prop-driven API.',
      },
    },
  },
};

export const AppendButtonOnly = {
  name: 'Append Button Only',
  args: {
    ...Basic.args,
    inputId: 'amount-append',
    prepend: false,
    append: true,
    appendIcon: '',
    appendText: 'Go',
    appendButton: true,
    appendButtonVariant: 'secondary',
    appendButtonId: 'amount-append-btn',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates using only the append side as a native button.',
      },
    },
  },
};

export const PrependButtonOnly = {
  name: 'Prepend Button Only',
  args: {
    ...Basic.args,
    inputId: 'amount-prepend',
    prepend: true,
    append: false,
    icon: '',
    prependIcon: '',
    appendIcon: '',
    prependText: 'Go',
    prependButton: true,
    prependButtonVariant: 'secondary',
    prependButtonId: 'amount-prepend-btn',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates using only the prepend side as a native button.',
      },
    },
  },
};

export const ButtonClickEvents = {
  name: 'Button Click Events',
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';
    wrap.style.maxWidth = '640px';

    const helperText = document.createElement('div');
    helperText.style.fontSize = '14px';
    helperText.style.color = '#444';
    helperText.innerHTML =
      'Use <code>appendClick</code> and <code>prependClick</code> on the component host to respond to native affix button clicks.';

    const output = document.createElement('div');
    output.style.padding = '10px 12px';
    output.style.border = '1px solid #ddd';
    output.style.borderRadius = '8px';
    output.style.background = '#fafafa';
    output.textContent = 'Click an affix button to see the event output.';

    const el = buildEl({
      ...args,
      inputId: args.inputId || 'igc-button-events',
      label: args.label || 'Search',
      prepend: true,
      append: true,
      prependButton: true,
      appendButton: true,
      prependIcon: '',
      appendIcon: '',
      prependText: args.prependText || 'Back',
      appendText: args.appendText || 'Go',
      prependButtonId: args.prependButtonId || 'igc-button-events-prepend-btn',
      appendButtonId: args.appendButtonId || 'igc-button-events-append-btn',
      placeholder: args.placeholder || 'Enter a value',
    });

    const updateOutput = side => {
      const input = el.querySelector('input');
      const value = input ? input.value : '';
      output.textContent = `${side} button clicked. Current value: ${value || '(empty)'}`;
    };

    el.addEventListener('prependClick', () => updateOutput('Prepend'));
    el.addEventListener('appendClick', () => updateOutput('Append'));

    wrap.appendChild(helperText);
    wrap.appendChild(el);
    wrap.appendChild(output);

    return wrap;
  },
  args: {
    ...Basic.args,
    label: 'Search',
    inputId: 'igc-button-events',
    prepend: true,
    append: true,
    prependButton: true,
    appendButton: true,
    prependText: 'Back',
    appendText: 'Go',
    prependButtonId: 'igc-button-events-prepend-btn',
    appendButtonId: 'igc-button-events-append-btn',
    prependIcon: '',
    appendIcon: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example shows the correct event pattern for native affix buttons. Listen for `prependClick` or `appendClick` on the component host instead of attaching a generic click handler to the whole component.',
      },
    },
  },
};

export const IconsBothSides = {
  name: 'Icons on Both Sides',
  args: {
    ...Basic.args,
    inputId: 'amount2',
    prepend: true,
    append: true,
    prependIcon: 'fa-solid fa-dollar-sign',
    appendIcon: 'fa-solid fa-dollar-sign',
    prependText: '',
    appendText: '',
    prependButton: false,
    appendButton: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example shows how to use icons on both sides of the input without rendering button content.',
      },
    },
  },
};

export const SearchWithAppendButton = {
  name: 'Search + Append Button',
  args: {
    ...Basic.args,
    label: 'Search',
    inputId: 'q',
    placeholder: '',
    prepend: false,
    append: true,
    prependIcon: '',
    appendIcon: '',
    appendText: 'Go',
    appendButton: true,
    appendButtonVariant: 'secondary',
    appendButtonId: 'search-append-btn',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates a common use case for input groups: a search field with an append button.',
      },
    },
  },
};

export const TextAffixes = {
  name: 'Text Affixes',
  args: {
    ...Basic.args,
    label: 'Code',
    inputId: 'code',
    prepend: true,
    append: true,
    prependIcon: '',
    appendIcon: '',
    prependText: '#',
    appendText: '.js',
    prependButton: false,
    appendButton: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates plain text affixes rendered with the standard input-group-text styling.',
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
      </div>
    `;
    root.appendChild(intro);

    const rows = [
      {
        title: 'Default',
        args: {
          label: 'Amount',
          inputId: 'igc-a11y-default',
          placeholder: 'Enter amount',
          type: 'text',
          formLayout: '',
          prepend: false,
          append: true,
          appendIcon: 'fa-solid fa-dollar-sign',
          appendText: '',
          appendButton: false,
          validation: false,
          validationMessage: 'Please provide a value.',
        },
      },
      {
        title: 'Inline',
        args: {
          label: 'Amount',
          inputId: 'igc-a11y-inline',
          formLayout: 'inline',
          prepend: true,
          append: true,
          prependIcon: 'fa-solid fa-dollar-sign',
          appendIcon: 'fa-solid fa-dollar-sign',
          prependText: '',
          appendText: '',
          prependButton: false,
          appendButton: false,
          validation: false,
          validationMessage: 'Please provide a value.',
        },
      },
      {
        title: 'Horizontal (responsive cols)',
        args: {
          label: 'Amount',
          inputId: 'igc-a11y-horizontal',
          formLayout: 'horizontal',
          labelCols: 'xs-12 sm-4',
          inputCols: 'xs-12 sm-8',
          prepend: true,
          append: true,
          prependIcon: 'fa-solid fa-dollar-sign',
          appendIcon: 'fa-solid fa-dollar-sign',
          prependText: '',
          appendText: '',
          prependButton: false,
          appendButton: false,
          validation: false,
          validationMessage: 'Please provide a value.',
        },
      },
      {
        title: 'Error / Validation',
        args: {
          label: 'Email',
          inputId: 'igc-a11y-error',
          type: 'email',
          formLayout: '',
          prepend: false,
          append: true,
          appendIcon: 'fa-solid fa-envelope',
          appendText: '',
          appendButton: false,
          required: true,
          validation: true,
          validationMessage: 'Required field.',
          value: '',
        },
      },
      {
        title: 'Disabled',
        args: {
          label: 'Amount',
          inputId: 'igc-a11y-disabled',
          disabled: true,
          formLayout: '',
          prepend: false,
          append: true,
          appendIcon: 'fa-solid fa-dollar-sign',
          appendText: '',
          appendButton: false,
          validation: false,
          validationMessage: 'Please provide a value.',
        },
      },
      {
        title: 'Read Only',
        args: {
          label: 'Amount',
          inputId: 'igc-a11y-readonly',
          readOnly: true,
          value: '123.45',
          formLayout: '',
          prepend: false,
          append: true,
          appendIcon: 'fa-solid fa-dollar-sign',
          appendText: '',
          appendButton: false,
          validation: false,
          validationMessage: 'Please provide a value.',
        },
      },
      {
        title: 'Buttons Both Sides',
        args: {
          label: 'Search',
          inputId: 'igc-a11y-buttons',
          formLayout: '',
          prepend: true,
          append: true,
          prependText: 'Go',
          appendText: 'Go',
          prependButton: true,
          appendButton: true,
          prependButtonVariant: 'secondary',
          appendButtonVariant: 'secondary',
          prependButtonId: 'igc-a11y-buttons-prepend-btn',
          appendButtonId: 'igc-a11y-buttons-append-btn',
          validation: false,
          validationMessage: 'Please provide a value.',
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
          'Matrix of key states (default/inline/horizontal, error/validation, disabled, read-only, button affixes). Each row prints computed role/aria/ids and whether ARIA references resolve.',
      },
      story: { height: '1400px' },
    },
    controls: { disable: true },
  },
};
