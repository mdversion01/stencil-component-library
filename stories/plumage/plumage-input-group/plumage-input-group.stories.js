// src/stories/plumage-input-group-component.stories.js

/* ------------------------------------------------------------------
 * Storybook: Plumage Input Group (Web Component)
 * Goal: Match input-group-component.stories.js exactly (same props,
 *       same args, same stories) — only the tag + styling differ.
 * Component tag: <plumage-input-group-component>
 * ------------------------------------------------------------------ */

// ======================================================
// Docs helpers
// ======================================================

// Inject CSS so Docs code blocks wrap instead of one long line.
const DocsWrapStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .sbdocs pre,
    .sbdocs pre code {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-x: auto !important;
    }
  `;
  return style;
};

const normalize = value => {
  if (value === '' || value == null) return undefined;
  if (value === true) return true;
  if (value === false) return false;
  return value;
};

const esc = s =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const buildDocsHtml = args => {
  const a = { ...args };

  const attrs = [
    ['append', !!a.append],
    ['append-icon', normalize(a.appendIcon)],
    ['append-id', normalize(a.appendId)],
    ['disabled', !!a.disabled],
    ['form-id', normalize(a.formId)],
    ['form-layout', normalize(a.formLayout)],
    ['icon', normalize(a.icon)],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['input-cols', normalize(a.inputCols)],
    ['input-id', normalize(a.inputId)],
    ['label', normalize(a.label)],
    ['label-align', normalize(a.labelAlign)],
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['label-cols', normalize(a.labelCols)],
    ['label-hidden', !!a.labelHidden],
    ['other-content', !!a.otherContent],
    ['placeholder', normalize(a.placeholder)],
    ['plumage-search', !!a.plumageSearch],
    ['prepend', !!a.prepend],
    ['prepend-icon', normalize(a.prependIcon)],
    ['prepend-id', normalize(a.prependId)],
    ['required', !!a.required],
    ['size', normalize(a.size)],
    ['type', normalize(a.type)],

    // ✅ a11y (new)
    ['aria-label', normalize(a.ariaLabel)],
    ['aria-labelledby', normalize(a.ariaLabelledby)],
    ['aria-describedby', normalize(a.ariaDescribedby)],

    ['validation', !!a.validation],
    ['validation-message', normalize(a.validationMessage)],
    ['value', normalize(a.value)],
  ];

  const attrStr = attrs
    .filter(([_, v]) => v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  const openTag = attrStr ? `<plumage-input-group-component ${attrStr}>` : '<plumage-input-group-component>';

  const slotLines = [];
  if (a.otherContent && a.prepend) {
    slotLines.push(`  <button-component slot="prepend" type="button" variant="secondary">Go</button-component>`);
  }
  if (a.otherContent && a.append) {
    slotLines.push(`  <button-component slot="append" type="button" variant="secondary">Go</button-component>`);
  }

  return [openTag, ...slotLines, '</plumage-input-group-component>'].join('\n');
};

// ======================================================
// Render helpers (string markup so slots render correctly)
// ======================================================

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) => {
  const v = normalize(val);
  return v === undefined || v === false ? '' : v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
};

const Template = args => {
  const usePrependSlot = !!args.otherContent && !!args.prepend;
  const useAppendSlot = !!args.otherContent && !!args.append;

  return `
<plumage-input-group-component
${boolAttr('append', !!args.append)}
${useAppendSlot ? '' : attr('append-icon', args.appendIcon)}
${attr('append-id', args.appendId)}
${boolAttr('disabled', !!args.disabled)}
${attr('form-id', args.formId)}
${attr('form-layout', args.formLayout)}
${attr('icon', args.icon)}
${attr('input-col', args.inputCol)}
${attr('input-cols', args.inputCols)}
${attr('input-id', args.inputId)}
${attr('label', args.label)}
${attr('label-align', args.labelAlign)}
${attr('label-col', args.labelCol)}
${attr('label-cols', args.labelCols)}
${boolAttr('label-hidden', !!args.labelHidden)}
${boolAttr('other-content', !!args.otherContent)}
${attr('placeholder', args.placeholder)}
${boolAttr('plumage-search', !!args.plumageSearch)}
${boolAttr('prepend', !!args.prepend)}
${usePrependSlot ? '' : attr('prepend-icon', args.prependIcon)}
${attr('prepend-id', args.prependId)}
${boolAttr('required', !!args.required)}
${attr('size', args.size)}
${attr('type', args.type)}
${attr('aria-label', args.ariaLabel)}
${attr('aria-labelledby', args.ariaLabelledby)}
${attr('aria-describedby', args.ariaDescribedby)}
${boolAttr('validation', !!args.validation)}
${attr('validation-message', args.validationMessage)}
${attr('value', args.value)}
>
${usePrependSlot ? `<button-component slot="prepend" type="button" text styles="margin-right: 10px;" variant="secondary">Go</button-component>` : ''}
${useAppendSlot ? `<button-component slot="append" type="button" text styles="margin-left: 10px;" variant="secondary">Go</button-component>` : ''}
</plumage-input-group-component>
`;
};

// ======================================================
// Default export
// ======================================================

export default {
  title: 'Form/Plumage Input Group',
  tags: ['autodocs'],

  // ✅ FIX: decorator supports Story() returning Node OR string markup
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
    // =========================
    // Input Attributes (A–Z)
    // =========================
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

    // =========================
    // Accessibility (NEW)
    // =========================
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

    // =========================
    // Layout (A–Z)
    // =========================
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

    // =========================
    // Plumage Specific (A–Z)
    // =========================
    plumageSearch: { control: 'boolean', table: { category: 'Plumage Specific' } },

    // =========================
    // Validation (A–Z)
    // =========================
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

// ======================================================
// Stories (kept; none removed)
// ======================================================

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

  // a11y (new)
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

  // IMPORTANT: clear icons so the component uses the SLOT path
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

// ======================================================
// ✅ NEW: Accessibility matrix story (computed)
// ======================================================

const getSnapshot = (host) => {
  const input =
    host?.querySelector('input.form-control') ||
    host?.querySelector('input.search-bar') ||
    host?.querySelector('input');

  const label = host?.querySelector('label');
  const describedby = (input?.getAttribute('aria-describedby') || '').trim();
  const describedIds = describedby ? describedby.split(/\s+/).filter(Boolean) : [];

  const resolve = (id) => {
    if (!id) return false;
    // ids generated here are safe tokens, so direct selector is ok
    return !!host?.querySelector(`#${id}`);
  };

  return {
    host: host?.tagName?.toLowerCase() ?? null,
    inputId: input?.getAttribute('id') ?? null,
    labelId: label?.getAttribute('id') ?? null,
    labelFor: label?.getAttribute('for') ?? label?.getAttribute('htmlfor') ?? null,
    role: input?.getAttribute('role') ?? null,
    type: input?.getAttribute('type') ?? null,
    'aria-label': input?.getAttribute('aria-label') ?? null,
    'aria-labelledby': input?.getAttribute('aria-labelledby') ?? null,
    'aria-describedby': describedby || null,
    'aria-required': input?.getAttribute('aria-required') ?? null,
    'aria-invalid': input?.getAttribute('aria-invalid') ?? null,
    'aria-disabled': input?.getAttribute('aria-disabled') ?? null,
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
    hasValidationMessage: !!host?.querySelector('.invalid-feedback'),
    prependElId: host?.querySelector('[id$="-prepend"]')?.getAttribute('id') ?? null,
    appendElId: host?.querySelector('[id$="-append"]')?.getAttribute('id') ?? null,
    isSearchVariant: !!host?.querySelector('input.search-bar'),
  };
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (args) => {
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

      // Render as actual DOM node so we can query it
      const mount = document.createElement('div');
      mount.innerHTML = Template({ ...Basic.args, ...args, ...storyArgs });
      const host = mount.querySelector('plumage-input-group-component');

      demo.appendChild(mount);

      const update = async () => {
        // wait for web component to define/hydrate
        if (host?.componentOnReady) {
          try { await host.componentOnReady(); } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try { await customElements.whenDefined('plumage-input-group-component'); } catch (_e) {}
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
