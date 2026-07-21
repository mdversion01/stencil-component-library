// File: src/stories/plumage-input-group.stories.js

import DocsPage from './plumage-input-group.docs.mdx';
import {
  DocsWrapStyles,
  buildDocsHtml,
  buildDocsHtmlValueProp,
  buildDocsHtmlExternalValue,
  buildEl,
  getSnapshot,
} from './plumage-input-group.story-helpers.js';

export default {
  title: 'Form/Plumage Input Group',
  tags: ['autodocs'],
  render: args => buildEl(args),

  decorators: [
    Story => {
      const wrap = document.createElement('div');
      wrap.appendChild(DocsWrapStyles());

      const out = Story();

      if (out instanceof Node) {
        wrap.appendChild(out);
      } else if (typeof out === 'string') {
        const mount = document.createElement('div');
        mount.innerHTML = out;
        wrap.appendChild(mount);
      } else {
        const mount = document.createElement('div');
        mount.textContent = String(out ?? '');
        wrap.appendChild(mount);
      }

      return wrap;
    },
  ],

  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'The `plumage-input-group-component` is a Plumage-styled wrapper for an input field that allows you to add prepend and append content such as icons, text, or native buttons. It also supports various form layouts, accessibility hooks, validation states, read-only mode, and emitted append/prepend button click events.',
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
        'Makes the input read-only. The user can focus and select text but cannot edit the value. Native prepend/append buttons are disabled when used with readOnly.',
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

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional accessible name. Used only when aria-labelledby is not set.',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'Optional external labelling idref(s). If absent, component uses its internal label id.',
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      table: { category: 'Accessibility' },
      description:
        'Optional external description idref(s). Component appends prepend/append ids and validation id when applicable.',
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
      description: 'Variant prop for the append button. Plumage native buttons currently render with Plumage button styling.',
    },
    appendAriaLabel: {
      control: 'text',
      name: 'append-aria-label',
      table: { category: 'Layout' },
      description: 'Accessible label applied to the append button when rendered as a button.',
    },

    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Layout' },
      description: 'Associates the underlying input with a form by id.',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      description:
        'Form layout variant. "horizontal" uses a grid layout with label and input side by side. "inline" uses compact inline spacing.',
      table: { category: 'Layout' },
    },
    icon: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Global icon class used as a fallback on prepend/append when side-specific icons are not provided.',
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
      description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8".',
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
      description: 'Alignment for the label text (only applies when label is visible).',
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
      description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4".',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Visually hide the label while keeping it accessible to screen readers.',
    },
    labelSize: {
      control: { type: 'select' },
      name: 'label-size',
      options: ['base', 'xs', 'sm', 'lg'],
      table: { category: 'Layout' },
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
      description: 'Variant prop for the prepend button. Plumage native buttons currently render with Plumage button styling.',
    },
    prependAriaLabel: {
      control: 'text',
      name: 'prepend-aria-label',
      table: { category: 'Layout' },
      description: 'Accessible label applied to the prepend button when rendered as a button.',
    },

    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description: 'Size variant.',
    },

    plumageSearch: {
      control: 'boolean',
      name: 'plumage-search',
      table: { category: 'Plumage Specific' },
    },

    required: {
      control: 'boolean',
      name: 'required',
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
    size: '',
    formId: '',
    formLayout: '',
    labelHidden: false,
    labelAlign: '',
    labelSize: 'sm',
    required: false,
    disabled: false,
    readOnly: false,

    prepend: false,
    append: true,
    icon: '',
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
    prependId: '',
    appendId: '',
    prependButtonId: '',
    appendButtonId: '',
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

    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',

    validation: false,
    validationMessage: '',
    value: '',

    labelCols: '',
    inputCols: '',
    labelCol: 2,
    inputCol: 10,
    type: 'text',
    plumageSearch: false,
  },
};

export const Basic = {
  name: 'Basic Usage',
  args: {
    label: 'Amount',
    inputId: 'amount-play',
    placeholder: 'Enter amount',
    size: '',
    formId: '',
    formLayout: '',
    labelHidden: false,
    labelAlign: '',
    labelSize: 'sm',
    required: false,
    disabled: false,
    readOnly: false,

    prepend: false,
    append: true,
    icon: '',
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
    prependId: '',
    appendId: '',
    prependButtonId: '',
    appendButtonId: '',
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

    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',

    validation: false,
    validationMessage: '',
    value: '',

    labelCols: '',
    inputCols: '',
    labelCol: 2,
    inputCol: 10,
    type: 'text',
    plumageSearch: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the Plumage input group component with an append icon.',
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
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';
    wrap.style.maxWidth = '640px';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.flexWrap = 'wrap';
    controls.style.gap = '8px';

    const host = buildEl({
      ...Basic.args,
      ...args,
      label: args.label || 'Amount',
      inputId: args.inputId || 'amount-external',
      placeholder: args.placeholder || 'Enter amount',
      append: true,
      appendIcon: 'fa-solid fa-dollar-sign',
      prepend: false,
      value: '',
    });

    const output = document.createElement('div');
    output.style.fontSize = '14px';
    output.style.color = '#444';

    const updateDisplay = () => {
      output.textContent = `Current external value: ${JSON.stringify(host.value ?? '')}`;
    };

    const makeButton = (label, nextValue) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        host.value = nextValue;
        updateDisplay();
      });
      return btn;
    };

    host.addEventListener('valueChange', event => {
      output.textContent = `Current typed value: ${JSON.stringify(event.detail ?? '')}`;
    });

    controls.append(
      makeButton('Load 123.45', '123.45'),
      makeButton('Load 999.99', '999.99'),
      makeButton('Clear', ''),
    );

    updateDisplay();
    wrap.append(controls, host, output);
    return wrap;
  },
  args: {
    ...Basic.args,
    inputId: 'amount-external',
    label: 'Amount',
    placeholder: 'Enter amount',
    prepend: false,
    append: true,
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
    value: '',
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () => buildDocsHtmlExternalValue(),
      },
      description: {
        story:
          'Demonstrates updating the component from an external source after render by assigning to the `value` property. This should stay in sync with the inner native input.',
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
          'This example demonstrates the required and validation states.',
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
          'This example shows the disabled state of the Plumage input group.',
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
    readOnly: true,
    value: '12345',
    prepend: false,
    append: true,
    appendIcon: 'fa-solid fa-dollar-sign',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example shows the read-only state. The input can be focused and selected, but the value cannot be edited.',
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

export const PlumageSearchField = {
  name: 'Plumage Search Field',
  args: {
    ...Basic.args,
    inputId: 'search1',
    plumageSearch: true,
    placeholder: 'Search datasets',
    prepend: false,
    append: false,
    prependIcon: '',
    appendIcon: '',
    prependText: '',
    appendText: '',
    prependButton: false,
    appendButton: false,
    label: '',
    labelCols: '',
    inputCols: '',
    labelCol: 2,
    inputCol: 10,
    validationMessage: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates the `plumage-search` variant of the input group.',
      },
    },
  },
};

export const AppendButtonAction = {
  name: 'Append Button Action',
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';
    wrap.style.maxWidth = '640px';

    const host = buildEl({
      ...Basic.args,
      ...args,
      label: args.label || 'Search Users',
      inputId: args.inputId || 'search-users',
      placeholder: args.placeholder || 'Type a username',
      append: true,
      appendButton: true,
      appendText: args.appendText || 'Search',
      appendButtonId: args.appendButtonId || 'search-users-append-btn',
      appendId: args.appendId || 'search-users-append-wrap',
      appendIcon: '',
      prepend: false,
      prependButton: false,
      prependIcon: '',
    });

    const result = document.createElement('div');
    result.style.fontSize = '14px';
    result.style.padding = '8px 0';
    result.textContent = 'Click the append button to run the action.';

    host.addEventListener('appendClick', event => {
      const input = host.querySelector('input');
      const value = input ? input.value : '';

      console.log('appendClick fired:', event.detail);
      console.log('Current input value:', value);

      result.textContent = value
        ? `Append button clicked. Current value: "${value}"`
        : 'Append button clicked. Input is empty.';
    });

    host.addEventListener('valueChange', event => {
      console.log('valueChange:', event.detail);
    });

    wrap.appendChild(host);
    wrap.appendChild(result);
    return wrap;
  },
  args: {
    ...Basic.args,
    label: 'Search Users',
    inputId: 'search-users',
    placeholder: 'Type a username',
    append: true,
    appendButton: true,
    appendText: 'Search',
    appendButtonId: 'search-users-append-btn',
    appendId: 'search-users-append-wrap',
    appendIcon: '',
    prepend: false,
    prependButton: false,
    prependIcon: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the correct event-driven pattern for appended button actions. Listen for the component `appendClick` event, then read the current inner input value from the host element.',
      },
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
        Prints computed <code>role</code> + <code>aria-*</code> + generated ids for default / inline / horizontal, validation, disabled, readOnly, and button affixes.
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

      const host = buildEl({ ...Basic.args, ...args, ...storyArgs });
      demo.appendChild(host);

      const update = async () => {
        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('plumage-input-group-component');
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
        inputId: 'mx-ig-default',
        label: 'Default A11y',
        formLayout: '',
        prepend: false,
        append: true,
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        disabled: false,
        readOnly: false,
        value: '',
      }),
    );

    wrap.appendChild(
      card('Inline layout', {
        inputId: 'mx-ig-inline',
        label: 'Inline A11y',
        formLayout: 'inline',
        prepend: true,
        append: true,
        prependIcon: 'fa-solid fa-dollar-sign',
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        disabled: false,
        readOnly: false,
        value: '',
      }),
    );

    wrap.appendChild(
      card('Horizontal layout', {
        inputId: 'mx-ig-horizontal',
        label: 'Horizontal A11y',
        formLayout: 'horizontal',
        labelAlign: 'right',
        labelCols: 'xs-12 sm-4',
        inputCols: 'xs-12 sm-8',
        prepend: true,
        prependIcon: 'fa-solid fa-dollar-sign',
        append: true,
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        disabled: false,
        readOnly: false,
        value: '',
      }),
    );

    wrap.appendChild(
      card('Validation (aria-invalid + describedby)', {
        inputId: 'mx-ig-validation',
        label: 'Validation',
        required: true,
        validation: true,
        validationMessage: 'This is required.',
        prepend: true,
        prependIcon: 'fa-solid fa-dollar-sign',
        append: true,
        appendIcon: 'fa-solid fa-dollar-sign',
        readOnly: false,
        value: '',
      }),
    );

    wrap.appendChild(
      card('Disabled (aria-disabled)', {
        inputId: 'mx-ig-disabled',
        label: 'Disabled',
        disabled: true,
        prepend: true,
        prependIcon: 'fa-solid fa-dollar-sign',
        append: true,
        appendIcon: 'fa-solid fa-dollar-sign',
        value: '123',
        validation: false,
        readOnly: false,
      }),
    );

    wrap.appendChild(
      card('Read Only', {
        inputId: 'mx-ig-readonly',
        label: 'Read Only',
        readOnly: true,
        prepend: true,
        prependIcon: 'fa-solid fa-dollar-sign',
        append: true,
        appendIcon: 'fa-solid fa-dollar-sign',
        value: '123',
        validation: false,
        disabled: false,
      }),
    );

    wrap.appendChild(
      card('Buttons Both Sides', {
        inputId: 'mx-ig-buttons',
        label: 'Buttons',
        prepend: true,
        append: true,
        prependText: 'Go',
        appendText: 'Go',
        prependButton: true,
        appendButton: true,
        prependButtonVariant: 'secondary',
        appendButtonVariant: 'secondary',
        prependButtonId: 'mx-ig-buttons-prepend-btn',
        appendButtonId: 'mx-ig-buttons-append-btn',
        validation: false,
        readOnly: false,
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the input: `aria-labelledby`, `aria-describedby`, `aria-required`, `aria-invalid`, `aria-disabled`, and `readOnly` across default / inline / horizontal, validation, disabled, readOnly, and button-affix examples.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
};
