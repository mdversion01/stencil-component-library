// src/stories/input-group-component.stories.js

export default {
  title: 'Form/Input Group',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The `input-group-component` is a wrapper for an input field that allows you to easily add prepend and append content, such as icons or buttons. It also supports various form layouts and validation states.',
      },
      source: {
        language: 'html',
        // IMPORTANT: docs preview must reflect CURRENT args (including Controls changes)
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
      description:
        'Global icon class used as a fallback on prepend/append when side-specific icons are not provided.',
    },
    prependIcon: {
      control: 'text',
      name: 'prepend-icon',
      table: { category: 'Layout' },
      description: 'Specify an icon class to display an icon inside the prepend side.',
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
    labelSize: {
      control: { type: 'select' },
      options: ['base', 'xs', 'sm', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
    },
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
  args: {
    label: 'Amount',
    inputId: 'amount-play',
    placeholder: 'Enter amount',
    type: 'text',
    value: '',
    disabled: false,

    // layout
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
    otherContent: false,
    icon: '',
    prependIcon: '',
    appendIcon: 'fa-solid fa-dollar-sign',
    appendId: '',
    prependId: '',

    // validation
    required: false,
    validation: false,
    validationMessage: 'Please provide a value.',
  },
};

/** ---------------- Docs helpers ---------------- */

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

  const usePrependSlot = !!a.otherContent && !!a.prepend;
  const useAppendSlot = !!a.otherContent && !!a.append;

  const attrs = [
    // presence attrs
    ['append', !!a.append],
    ['prepend', !!a.prepend],
    ['disabled', !!a.disabled],
    ['label-hidden', !!a.labelHidden],
    ['other-content', !!a.otherContent],
    ['required', !!a.required],
    ['validation', !!a.validation],

    // strings/numbers
    ['append-icon', useAppendSlot ? undefined : normalize(a.appendIcon)],
    ['append-id', normalize(a.appendId)],
    ['prepend-icon', usePrependSlot ? undefined : normalize(a.prependIcon)],
    ['prepend-id', normalize(a.prependId)],
    ['form-layout', normalize(a.formLayout)],
    ['size', normalize(a.size)],
    ['type', normalize(a.type)],
    ['value', normalize(a.value)],
    ['placeholder', normalize(a.placeholder)],
    ['input-id', normalize(a.inputId)],
    ['label', normalize(a.label)],
    ['label-align', normalize(a.labelAlign)],
    ['label-size', normalize(a.labelSize)],
    ['label-col', Number.isFinite(a.labelCol) ? a.labelCol : undefined],
    ['input-col', Number.isFinite(a.inputCol) ? a.inputCol : undefined],
    ['label-cols', normalize(a.labelCols)],
    ['input-cols', normalize(a.inputCols)],
    ['icon', normalize(a.icon)],
    ['validation-message', normalize(a.validationMessage)],
  ];

  const attrStr = attrs
    .filter(([k, v]) => k && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

  const openTag = attrStr ? `<input-group-component ${attrStr}>` : '<input-group-component>';

  const slotLines = [];
  if (usePrependSlot) {
    slotLines.push(`  <button-component slot="prepend" type="button" variant="secondary">Go</button-component>`);
  }
  if (useAppendSlot) {
    slotLines.push(`  <button-component slot="append" type="button" variant="secondary">Go</button-component>`);
  }

  return [openTag, ...slotLines, '</input-group-component>'].join('\n');
};

/** ---------------- Render (string markup so slots render correctly) ---------------- */

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) => {
  const v = normalize(val);
  return v === undefined || v === false ? '' : v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
};

const Template = args => {
  const usePrependSlot = !!args.otherContent && !!args.prepend;
  const useAppendSlot = !!args.otherContent && !!args.append;

  return `
<input-group-component
${boolAttr('append', !!args.append)}
${boolAttr('prepend', !!args.prepend)}
${boolAttr('disabled', !!args.disabled)}
${boolAttr('label-hidden', !!args.labelHidden)}
${boolAttr('other-content', !!args.otherContent)}
${boolAttr('required', !!args.required)}
${boolAttr('validation', !!args.validation)}
${useAppendSlot ? '' : attr('append-icon', args.appendIcon)}
${attr('append-id', args.appendId)}
${usePrependSlot ? '' : attr('prepend-icon', args.prependIcon)}
${attr('prepend-id', args.prependId)}
${attr('form-layout', args.formLayout)}
${attr('size', args.size)}
${attr('type', args.type)}
${attr('value', args.value)}
${attr('placeholder', args.placeholder)}
${attr('input-id', args.inputId)}
${attr('label', args.label)}
${attr('label-align', args.labelAlign)}
${attr('label-size', args.labelSize)}
${attr('label-col', args.labelCol)}
${attr('input-col', args.inputCol)}
${attr('label-cols', args.labelCols)}
${attr('input-cols', args.inputCols)}
${attr('icon', args.icon)}
${attr('validation-message', args.validationMessage)}
>
${usePrependSlot ? `<button-component slot="prepend" type="button" variant="secondary">Go</button-component>` : ''}
${useAppendSlot ? `<button-component slot="append" type="button" variant="secondary">Go</button-component>` : ''}
</input-group-component>
`;
};

/** ---------------- Stories ---------------- */

export const Basic = Template.bind({});
Basic.args = {
  label: 'Amount',
  inputId: 'amount-play',
  placeholder: 'Enter amount',
  size: '',
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

  validation: false,
  validationMessage: 'Please provide a value.',
  value: '',

  labelCols: '',
  inputCols: '',
  labelCol: 2,
  inputCol: 10,
};
Basic.storyName = 'Basic Usage';
Basic.parameters = {
  docs: {
    description: {
      story:
        'This is a basic example of the input group component with an append icon. You can customize the label, placeholder, and icons using the controls.',
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
        'This example demonstrates the required and validation states. The input is marked as required, and validation is enabled.',
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
  // IMPORTANT: when otherContent=true we render slot buttons; clear icons so the slot path is shown
  prependIcon: '',
  appendIcon: '',
};
AppendAndPrependWithSlots.parameters = {
  docs: {
    description: {
      story:
        'This example shows both prepend and append content using slots. This demonstrates how you can use the slots to add more complex content on either side of the input.',
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
  // IMPORTANT: clear appendIcon so the append slot path is used
  appendIcon: '',
};
AppendSlotOnly.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates using only the append slot. The append slot contains a button, while the prepend side is left empty.',
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
        'This example demonstrates using only the prepend slot. The prepend slot contains a button, while the append side is left empty.',
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

export const SearchWithAppendButton = Template.bind({});
SearchWithAppendButton.storyName = 'Search + Append Slot Button';
SearchWithAppendButton.args = {
  ...Basic.args,
  label: 'Search',
  inputId: 'q',
  placeholder: '',
  prepend: false,
  append: true,
  otherContent: true,
  prependIcon: '',
  appendIcon: '',
};
SearchWithAppendButton.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates a common use case for input groups: a search field with an append button. The append slot contains a "Go" button.',
    },
  },
};

// ======================================================
// Accessibility matrix
//  - Prints computed role + aria-* + ids
//  - Validates aria-describedby / aria-labelledby references resolve
//  - Variants: default / inline / horizontal / error+validation / disabled
// ======================================================

function pickAttrs(el, names) {
  const out = {};
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

function splitIds(v) {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function escAttr(v) {
  return String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function resolveIdsWithin(host, ids) {
  const res = {};
  ids.forEach(id => {
    const node = host.querySelector(`[id="${escAttr(id)}"]`);
    res[id] = !!node;
  });
  return res;
}

function snapshotA11y(host) {
  const input = host.querySelector('input');
  const label = host.querySelector('label');
  const feedback = host.querySelector('.invalid-feedback');
  const group = host.querySelector('.input-group');

  const describedByIds = input ? splitIds(input.getAttribute('aria-describedby')) : [];
  const labelledByIds = input ? splitIds(input.getAttribute('aria-labelledby')) : [];

  return {
    input: input
      ? {
          tag: input.tagName.toLowerCase(),
          id: input.getAttribute('id') || '',
          role: input.getAttribute('role') || '',
          class: input.getAttribute('class') || '',
          ...pickAttrs(input, ['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-invalid', 'disabled', 'required', 'type', 'name', 'form']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledByIds),
            'aria-describedby': resolveIdsWithin(host, describedByIds),
          },
        }
      : null,
    label: label
      ? {
          tag: label.tagName.toLowerCase(),
          id: label.getAttribute('id') || '',
          for: label.getAttribute('for') || '',
          class: label.getAttribute('class') || '',
        }
      : null,
    inputGroup: group
      ? {
          tag: group.tagName.toLowerCase(),
          class: group.getAttribute('class') || '',
          role: group.getAttribute('role') || '',
        }
      : null,
    validation: feedback
      ? {
          tag: feedback.tagName.toLowerCase(),
          id: feedback.getAttribute('id') || '',
          class: feedback.getAttribute('class') || '',
          ...pickAttrs(feedback, ['aria-live', 'aria-atomic']),
          text: (feedback.textContent || '').trim(),
        }
      : null,
  };
}

function buildEl(args) {
  // Build an element via DOM so we can read computed attributes/ids
  const el = document.createElement('input-group-component');

  // Mirror props/attrs in the most reliable way for Stencil elements:
  // set attributes (presence for boolean) so markup reflects.
  const setBool = (name, on) => {
    if (on) el.setAttribute(name, '');
    else el.removeAttribute(name);
  };
  const set = (name, v) => {
    const n = normalize(v);
    if (n === undefined || n === false) el.removeAttribute(name);
    else if (n === true) el.setAttribute(name, '');
    else el.setAttribute(name, String(n));
  };

  setBool('append', !!args.append);
  setBool('prepend', !!args.prepend);
  setBool('disabled', !!args.disabled);
  setBool('label-hidden', !!args.labelHidden);
  setBool('other-content', !!args.otherContent);
  setBool('required', !!args.required);
  setBool('validation', !!args.validation);

  set('append-icon', args.appendIcon);
  set('append-id', args.appendId);
  set('prepend-icon', args.prependIcon);
  set('prepend-id', args.prependId);
  set('form-layout', args.formLayout);
  set('size', args.size);
  set('type', args.type);
  set('value', args.value);
  set('placeholder', args.placeholder);
  set('input-id', args.inputId);
  set('label', args.label);
  set('label-align', args.labelAlign);
  set('label-size', args.labelSize);
  set('label-col', args.labelCol);
  set('input-col', args.inputCol);
  set('label-cols', args.labelCols);
  set('input-cols', args.inputCols);
  set('icon', args.icon);
  set('validation-message', args.validationMessage);

  // Slot content for demos that need it
  if (args.otherContent && args.prepend) {
    const btn = document.createElement('button-component');
    btn.setAttribute('slot', 'prepend');
    btn.setAttribute('type', 'button');
    btn.setAttribute('variant', 'secondary');
    btn.textContent = 'Go';
    el.appendChild(btn);
  }
  if (args.otherContent && args.append) {
    const btn = document.createElement('button-component');
    btn.setAttribute('slot', 'append');
    btn.setAttribute('type', 'button');
    btn.setAttribute('variant', 'secondary');
    btn.textContent = 'Go';
    el.appendChild(btn);
  }

  return el;
}

function renderMatrixRow({ title, args, idSuffix }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const el = buildEl({
    ...args,
    inputId: args.inputId || `igc-matrix-${idSuffix}`,
  });

  const stage = document.createElement('div');
  stage.style.maxWidth = '640px';

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role/id…';

  stage.appendChild(el);
  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  const update = () => {
    const snap = snapshotA11y(el);
    pre.textContent = JSON.stringify(snap, null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}

export const AccessibilityMatrix = () => {
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
        otherContent: false,
        appendIcon: 'fa-solid fa-dollar-sign',
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
        otherContent: false,
        prependIcon: 'fa-solid fa-dollar-sign',
        appendIcon: 'fa-solid fa-dollar-sign',
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
        otherContent: false,
        prependIcon: 'fa-solid fa-dollar-sign',
        appendIcon: 'fa-solid fa-dollar-sign',
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
        otherContent: false,
        appendIcon: 'fa-solid fa-envelope',
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
        otherContent: false,
        appendIcon: 'fa-solid fa-dollar-sign',
        validation: false,
        validationMessage: 'Please provide a value.',
      },
    },
  ];

  rows.forEach((r, idx) => root.appendChild(renderMatrixRow({ ...r, idSuffix: String(idx + 1) })));

  return root;
};
AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of key states (default/inline/horizontal, error/validation, disabled). Each row prints computed role/aria/ids and whether ARIA references resolve.',
    },
    story: { height: '1200px' },
  },
  controls: { disable: true },
};
