import DocsPage from './plumage-input-group.docs.mdx';
import {
  DocsWrapStyles,
  buildDocsHtml,
  getSnapshot,
  renderComponent as Template,
} from './plumage-input-group.story-helpers.js';

/* ------------------------------------------------------------------
 * Storybook: Plumage Input Group (Web Component)
 * Goal: Match input-group-component.stories.js exactly (same props,
 *       same args, same stories) — only the tag + styling differ.
 * Component tag: <plumage-input-group-component>
 * ------------------------------------------------------------------ */

export default {
  title: 'Form/Plumage Input Group',
  tags: ['autodocs'],

  decorators: [
    Story => {
      const wrap = document.createElement('div');
      wrap.appendChild(DocsWrapStyles());

      const out = Story();

      if (typeof out === 'string') {
        const mount = document.createElement('div');
        mount.innerHTML = out;
        wrap.appendChild(mount);
      } else if (out instanceof Node) {
        wrap.appendChild(out);
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
          'The `plumage-input-group-component` is a Plumage-styled wrapper for an input field that allows you to easily add prepend and append content, such as icons or buttons. It also supports various form layouts and validation states.',
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
      description: 'The value of the input field',
      table: { category: 'Input Attributes' },
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional accessible name (used only when aria-labelledby is not set).',
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
        'Optional external description idref(s). Component appends prepend/append ids (when used) and validation id (when invalid).',
    },

    append: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: true } },
      description:
        'When enabled, the append slot is available for adding content after the input field. This can be used for buttons, icons, or other elements that should appear on the right side of the input.',
    },
    appendIcon: {
      control: 'text',
      name: 'append-icon',
      table: { category: 'Layout' },
      description:
        'Specify an icon class (e.g., from Font Awesome) to display an icon on the right side of the input field. This is a quick way to add an icon without needing to use the append slot.',
    },
    appendId: {
      control: 'text',
      name: 'append-id',
      table: { category: 'Layout' },
      description: 'ID for the append element, used for accessibility or targeting with JavaScript.',
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
        'Form layout variant. "Horizontal" uses a grid layout with label and input side by side. "Inline" is similar but uses auto-width columns for a more compact display.',
      table: { category: 'Layout' },
    },
    icon: {
      control: 'text',
      table: { category: 'Layout' },
      description: 'Specify an icon class (e.g., from Font Awesome) to display an icon inside the input group.',
    },
    inputCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'input-col',
      table: { category: 'Layout' },
      description: 'Number of grid columns for the input (horizontal layout only)',
    },
    inputCols: {
      control: 'text',
      table: { category: 'Layout' },
      name: 'input-cols',
      description: 'e.g. "col-sm-9 col-md-8" or "xs-12 sm-6 md-8"',
    },
    label: { control: 'text', table: { category: 'Layout' }, description: 'Label text for the input' },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Alignment for the label text (only applies when label is visible)',
    },
    labelCol: {
      control: 'number',
      min: 0,
      max: 12,
      step: 1,
      name: 'label-col',
      table: { category: 'Layout' },
      description: 'Number of grid columns for the label (horizontal layout only)',
    },
    labelCols: {
      control: 'text',
      table: { category: 'Layout' },
      name: 'label-cols',
      description: 'e.g. "col-sm-3 col-md-4" or "xs-12 sm-6 md-4"',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Visually hide the label (but keep it accessible to screen readers)',
    },
    labelSize: { control: { type: 'select' }, options: ['base', 'xs', 'sm', 'lg'], table: { category: 'Layout' } },
    otherContent: {
      control: 'boolean',
      name: 'other-content',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description:
        'When enabled, the story will include example content in the prepend and append slots to demonstrate how they work.',
    },
    prepend: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'When enabled, the prepend slot is available for adding content before the input field.',
    },
    prependIcon: {
      control: 'text',
      name: 'prepend-icon',
      table: { category: 'Layout' },
      description: 'Specify an icon class to display an icon inside the prepend slot.',
    },
    prependId: {
      control: 'text',
      name: 'prepend-id',
      table: { category: 'Layout' },
      description: 'ID for the prepend element, used for accessibility or targeting with JavaScript.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Layout' },
      description: 'Size variant.',
    },

    plumageSearch: { control: 'boolean', table: { category: 'Plumage Specific' } },

    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      description: 'Mark the input as required',
    },
    validation: {
      control: 'boolean',
      name: 'validation',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Enable or disable validation state',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'Message to display when validation fails',
    },
  },
};

export const Basic = Template.bind({});
Basic.args = {
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

  prepend: false,
  append: true,
  otherContent: false,
  icon: '',
  prependIcon: '',
  appendIcon: 'fa-solid fa-dollar-sign',
  appendId: '',
  prependId: '',

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  validation: false,
  validationMessage: '',
  value: '',

  labelCols: '',
  inputCols: '',
  labelCol: '',
  inputCol: '',
  type: 'text',
};
Basic.storyName = 'Basic Usage';
Basic.parameters = {
  docs: {
    description: {
      story: 'This is a basic example of the input group component with an append icon. You can customize the label, placeholder, and icons using the controls.',
    },
  },
};

export const RequiredWithValidation = Template.bind({});
RequiredWithValidation.storyName = 'Required + Validation';
RequiredWithValidation.args = {
  ...Basic.args,
  required: true,
  validation: true,
  validationMessage: 'Please provide a value.',
  value: '',
  appendIcon: 'fa-solid fa-dollar-sign',
  append: true,
  prependIcon: '',
  prepend: false,
};
RequiredWithValidation.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates the required and validation states. The input is marked as required, and validation is enabled. If you try to submit without entering a value, the validation message will appear.',
    },
  },
};

export const DisabledState = Template.bind({});
DisabledState.storyName = 'Disabled';
DisabledState.args = {
  ...Basic.args,
  inputId: 'amount-disabled',
  label: 'Amount',
  disabled: true,
  prepend: false,
  append: true,
  otherContent: false,
  prependIcon: '',
  appendIcon: 'fa-solid fa-dollar-sign',
};
DisabledState.parameters = {
  docs: {
    description: {
      story:
        'This example shows the disabled state of the input group. When disabled, the input and any content in the prepend and append slots will be non-interactive and styled accordingly.',
    },
  },
};

export const AppendAndPrependWithSlots = Template.bind({});
AppendAndPrependWithSlots.storyName = 'Append + Prepend (Slots)';
AppendAndPrependWithSlots.args = {
  ...Basic.args,
  inputId: 'amount1',
  label: 'Amount',
  prepend: true,
  append: true,
  otherContent: true,
  prependIcon: 'fa-solid fa-dollar-sign',
  appendIcon: '',
};
AppendAndPrependWithSlots.parameters = {
  docs: {
    description: {
      story:
        'This example shows both prepend and append content using slots. The prepend slot contains a dollar sign icon, and the append slot contains a button. This demonstrates how you can use the slots to add more complex content on either side of the input.',
    },
  },
};

export const AppendSlotOnly = Template.bind({});
AppendSlotOnly.storyName = 'Append Slot Only';
AppendSlotOnly.args = {
  ...Basic.args,
  inputId: 'amount-append',
  prepend: false,
  append: true,
  otherContent: true,
};
AppendSlotOnly.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates using only the append slot. The append slot contains a button, while the prepend side is left empty. This shows how you can choose to use only one of the slots if needed.',
    },
  },
};

export const PrependSlotOnly = Template.bind({});
PrependSlotOnly.storyName = 'Prepend Slot Only';
PrependSlotOnly.args = {
  ...Basic.args,
  inputId: 'amount-prepend',
  prepend: true,
  append: false,
  otherContent: true,
  icon: '',
  prependIcon: '',
  appendIcon: '',
};
PrependSlotOnly.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates using only the prepend slot. The prepend slot contains a dollar sign icon, while the append side is left empty. This shows how you can choose to use only one of the slots if needed.',
    },
  },
};

export const IconsBothSides = Template.bind({});
IconsBothSides.storyName = 'Icons on Both Sides (No Slots)';
IconsBothSides.args = {
  ...Basic.args,
  inputId: 'amount2',
  otherContent: false,
  prepend: true,
  append: true,
  prependIcon: 'fa-solid fa-dollar-sign',
  appendIcon: 'fa-solid fa-dollar-sign',
};
IconsBothSides.parameters = {
  docs: {
    description: {
      story:
        'This example shows how to use icons on both sides of the input without using the slots. By setting the prependIcon and appendIcon properties, you can easily add icons to either side of the input field.',
    },
  },
};

export const PlumageSearchField = Template.bind({});
PlumageSearchField.storyName = 'Plumage Search Field';
PlumageSearchField.args = {
  ...Basic.args,
  inputId: 'search1',
  plumageSearch: true,
  placeholder: 'Search datasets',
  prependIcon: '',
  appendIcon: '',
  label: '',
  labelCols: '',
  inputCols: '',
  labelCol: '',
  inputCol: '',
  validationMessage: '',
};
PlumageSearchField.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates the "plumage-search" variant of the input group. When the "plumage-search" attribute is set to true, the component applies specific styles to create a search field appearance, which may include rounded edges and a different background color. This variant is ideal for search inputs.',
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
      mount.innerHTML = Template({ ...Basic.args, ...args, ...storyArgs });
      const host = mount.querySelector('plumage-input-group-component');

      demo.appendChild(mount);

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
        otherContent: false,
        validation: false,
        disabled: false,
        value: '',
      }),
    );

    wrap.appendChild(
      card('Inline layout', {
        inputId: 'mx-ig-inline',
        label: 'Inline A11y',
        formLayout: 'inline',
        prepend: false,
        append: true,
        otherContent: false,
        validation: false,
        disabled: false,
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
        otherContent: false,
        prependIcon: 'fa-solid fa-dollar-sign',
        append: true,
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        disabled: false,
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
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the input: `role` (when present), `aria-labelledby`, `aria-describedby` (including prepend/append ids and validation id), `aria-required`, `aria-invalid`, and `aria-disabled` across default / inline / horizontal, validation, and disabled.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
};
