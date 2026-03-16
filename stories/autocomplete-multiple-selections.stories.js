// stories/autocomplete-multiple-selections.stories.js

// (removed unused) import { auto } from '@popperjs/core';

// ======================================================
// Docs: wrap long code lines + show formatted HTML
// ======================================================

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

/** Collapse extra blank lines + trim edges (keeps intentional line breaks) */
const normalize = (txt) => {
  const lines = String(txt)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      prevBlank = true;
      out.push('');
      continue;
    }
    prevBlank = false;
    out.push(line);
  }

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

/** Put each attribute on its own line (for Docs code previews) */
const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

/** HTML shown in Docs "Code" panel (component only; wrapped elsewhere) */
const buildDocsComponentHtml = (args) =>
  normalize(`
<autocomplete-multiple-selections
  ${attrLines([
    // ids/labels
    ['id', args.id],
    ['input-id', args.inputId],
    ['label', args.label],
    ['placeholder', args.placeholder],

    // NEW standard a11y
    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    // legacy a11y
    ['arialabelled-by', args.arialabelledBy],

    // layout
    ['form-id', args.formId],
    ['form-layout', args.formLayout],
    ['label-align', args.labelAlign],
    ['label-size', args.labelSize],
    ['size', args.size],

    // legacy numeric columns (horizontal)
    ['label-col', args.labelCol],
    ['input-col', args.inputCol],

    // responsive cols
    ['label-cols', args.labelCols],
    ['input-cols', args.inputCols],

    // validation / state
    ['required', args.required],
    ['validation', args.validation],
    ['validation-message', args.validationMessage],
    ['error', args.error],
    ['error-message', args.errorMessage],
    ['disabled', args.disabled],
    ['label-hidden', args.labelHidden],
    ['dev-mode', args.devMode],

    // actions / icons
    ['add-btn', args.addBtn],
    ['editable', args.editable],
    ['add-icon', args.addIcon],
    ['remove-clear-btn', args.removeClearBtn],
    ['remove-btn-border', args.removeBtnBorder],
    ['clear-icon', args.clearIcon],
    ['clear-input-on-blur-outside', args.clearInputOnBlurOutside],

    // behavior
    ['auto-sort', args.autoSort],
    ['add-new-on-enter', args.addNewOnEnter],
    ['preserve-input-on-select', args.preserveInputOnSelect],

    // controlled selection (Docs-only)
    ['value', Array.isArray(args.value) ? JSON.stringify(args.value) : ''],

    // form names
    ['name', args.name],
    ['raw-input-name', args.rawInputName],
    ['type', args.type],

    // badge display
    ['badge-variant', args.badgeVariant],
    ['badge-shape', args.badgeShape],
    ['badge-inline-styles', args.badgeInlineStyles],
  ])}
></autocomplete-multiple-selections>
`);

/** Docs wrapper */
const wrapDocsHtml = (innerHtml) =>
  normalize(`
<div style="max-width:680px;">
  ${String(innerHtml).replace(/\n/g, '\n  ')}
</div>
`);

/** Multi-snippet docs helper (single wrapper, multiple components) */
const buildDocsHtmlMany = (snippets) =>
  wrapDocsHtml(
    normalize(`
<div style="display:grid; gap:14px;">
${snippets.map((s) => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`),
  );

// --- tiny helpers (DOM render path) ---
const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const setOptionsWhenReady = async (el, options) => {
  const safe = Array.isArray(options) ? options.slice() : [];
  if (typeof el.componentOnReady === 'function') await el.componentOnReady();
  else if (window.customElements?.whenDefined) await customElements.whenDefined('autocomplete-multiple-selections');
  el.options = safe;
};

const setValueWhenReady = async (el, value) => {
  const safe = Array.isArray(value) ? value.slice() : [];
  if (typeof el.componentOnReady === 'function') await el.componentOnReady();
  else if (window.customElements?.whenDefined) await customElements.whenDefined('autocomplete-multiple-selections');
  el.value = safe;
};

const wrapEl = (childEl) => {
  const wrap = document.createElement('div');
  wrap.style.maxWidth = '680px';
  wrap.appendChild(childEl);
  return wrap;
};

// ✅ sample data used by all stories
const FRUIT = [
  'Apple',
  'Apparatus',
  'Apple Pie',
  'Applegate',
  'Banana',
  'Orange',
  'Mango',
  'Bet',
  'Betty',
  'Bobby',
  'Bob',
  'Bobby Brown',
  'Bobby Blue',
  'Bobby Green',
];

// ✅ extract render logic so stories can reuse it (no duplication)
const renderComponent = (args) => {
  const el = document.createElement('autocomplete-multiple-selections');

  // string/enum attrs
  setAttr(el, 'id', args.id);
  setAttr(el, 'input-id', args.inputId);
  setAttr(el, 'label', args.label);
  setAttr(el, 'placeholder', args.placeholder);
  setAttr(el, 'form-id', args.formId);
  setAttr(el, 'form-layout', args.formLayout);
  setAttr(el, 'label-align', args.labelAlign);
  setAttr(el, 'label-size', args.labelSize);
  setAttr(el, 'size', args.size);

  // NEW standard a11y attrs
  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  // legacy a11y
  setAttr(el, 'arialabelled-by', args.arialabelledBy);

  setAttr(el, 'label-col', args.labelCol);
  setAttr(el, 'input-col', args.inputCol);
  setAttr(el, 'label-cols', args.labelCols);
  setAttr(el, 'input-cols', args.inputCols);

  setAttr(el, 'validation-message', args.validationMessage);
  setAttr(el, 'clear-icon', args.clearIcon);
  setAttr(el, 'add-icon', args.addIcon);
  setAttr(el, 'name', args.name);
  setAttr(el, 'raw-input-name', args.rawInputName);
  setAttr(el, 'badge-variant', args.badgeVariant);
  setAttr(el, 'badge-shape', args.badgeShape);
  setAttr(el, 'badge-inline-styles', args.badgeInlineStyles);
  setAttr(el, 'type', args.type || 'text');
  setAttr(el, 'error-message', args.errorMessage);

  // booleans
  args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
  args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
  args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
  args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
  args.labelHidden ? el.setAttribute('label-hidden', '') : el.removeAttribute('label-hidden');
  args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
  args.addBtn ? el.setAttribute('add-btn', '') : el.removeAttribute('add-btn');
  args.editable ? el.setAttribute('editable', '') : el.removeAttribute('editable');
  args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');
  args.removeBtnBorder ? el.setAttribute('remove-btn-border', '') : el.removeAttribute('remove-btn-border');
  args.clearInputOnBlurOutside ? el.setAttribute('clear-input-on-blur-outside', '') : el.removeAttribute('clear-input-on-blur-outside');

  // behavior
  setAttr(el, 'auto-sort', args.autoSort);
  setAttr(el, 'add-new-on-enter', args.addNewOnEnter);
  setAttr(el, 'preserve-input-on-select', args.preserveInputOnSelect);

  // quick event logs
  el.addEventListener('multiSelectChange', (e) => console.log('[ams] selectionChange', e.detail));
  el.addEventListener('valueChange', (e) => console.log('[ams] valueChange', e.detail));
  el.addEventListener('optionDelete', (e) => console.log('[ams] optionDelete', e.detail));
  el.addEventListener('clear', () => console.log('[ams] clear'));

  // provide options after hydration (this component expects prop assignment)
  const fallback = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];
  setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : fallback);

  // ✅ controlled selections (value prop) via property
  setValueWhenReady(el, Array.isArray(args.value) ? args.value : []);

  return wrapEl(el);
};

export default {
  title: 'Form/Autocomplete Multiple Selections',
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
      description: {
        component: [
          'Autocomplete Multiselect component with badges, fast keyboard navigation (arrows/Home/End/PageUp/PageDown/Escape), optional add/delete of user options, responsive layouts (stacked, horizontal, inline), and keep-open-after-select UX.',
          '',
        ].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsComponentHtml(ctx.args)),
      },
    },
  },

  render: (args) => renderComponent(args),

  argTypes: {
    /* =========================
     * Attributes
     * ========================= */
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
      description:
        'The unique identifier for the component instance. This is used to associate the component with the javascript API and for accessibility purposes.',
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

    /* =========================
     * Badge Attributes
     * ========================= */
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

    /* =========================
     * Button Attributes
     * ========================= */
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

    /* =========================
     * Data
     * ========================= */
    options: {
      control: 'object',
      name: 'options',
      table: { category: 'Data' },
      description:
        'The array of options available for selection in the autocomplete. Note: options must be set at runtime (not via attribute) for the autocomplete to work properly.',
    },
    value: {
      control: 'object',
      name: 'value',
      table: { category: 'Data' },
      description:
        'Controlled selected values (array). Applied via property at runtime (not as an attribute). Use this to preselect items or drive selections externally.',
    },

    /* =========================
     * Dev Mode
     * ========================= */
    devMode: {
      control: 'boolean',
      name: 'dev-mode',
      table: { category: 'Dev Mode', defaultValue: { summary: false } },
      description: 'Enables developer mode (extra logging).',
    },

    /* =========================
     * Input Attributes
     * ========================= */
    // NEW standard a11y
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
      description: 'Optional helper text id reference. Component also appends validation/error ids when present.',
    },

    // legacy
    arialabelledBy: {
      control: 'text',
      name: 'arialabelled-by',
      table: { category: 'Input Attributes' },
      description: 'Legacy: The id of the element that labels the input for accessibility purposes.',
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
      description:
        'The id of the parent form element to associate with when using form layouts. This is necessary when the component is not a direct child of the form element.',
    },
    formLayout: {
      control: { type: 'select' },
      options: ['', 'horizontal', 'inline'],
      name: 'form-layout',
      table: { category: 'Layout' },
      description:
        'Sets the form layout style. "horizontal" applies a two-column grid layout, while "inline" arranges elements in a single row.',
    },
    inputCol: {
      control: 'text',
      name: 'input-col',
      table: { category: 'Layout', defaultValue: { summary: 10 } },
      description:
        'Used with horizontal form layouts. Single numeric column for the input in a grid. Default is 10 (col-10).',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive input column classes, e.g. "col", "col-sm-9 col-md-8".',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes' },
      description:
        'The unique identifier for the input element within the component. This is used for accessibility and form association.',
    },
    label: {
      control: 'text',
      name: 'label',
      table: { category: 'Input Attributes' },
      description: 'The text label for the component. This is used for accessibility and user guidance.',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description:
        'Aligns the label text. "right" aligns the label to the right, which is typically used in horizontal form layouts.',
    },
    labelCol: {
      control: 'text',
      name: 'label-col',
      table: { category: 'Layout', defaultValue: { summary: 2 } },
      description:
        'Used with horizontal form layouts. Single numeric column for the label in a grid. Default is 2 (col-2).',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout' },
      description:
        'Used with horizontal form layouts. Responsive label column classes, e.g. "col", "col-sm-3 col-md-4", "xs-12 sm-6 md-4".',
    },
    labelHidden: {
      control: 'boolean',
      name: 'label-hidden',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Hides the label visually while keeping it accessible for screen readers.',
    },
    labelSize: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'base', 'lg'],
      name: 'label-size',
      table: { category: 'Layout' },
      description:
        'Sets the size of the label text. Options include "xs" (extra small), "sm" (small), "base" (default), and "lg" (large).',
    },
    name: {
      control: 'text',
      name: 'name',
      table: { category: 'Input Attributes' },
      description: 'The name attribute for the selected items hidden inputs.',
    },
    placeholder: {
      control: 'text',
      name: 'placeholder',
      table: { category: 'Input Attributes' },
      description: 'The placeholder text for the input element. This provides a hint to the user about what to enter.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: { category: 'Layout' },
      description:
        'Sets the size of the input field. Options include "sm" (small) and "lg" (large). Not adding any size will use the default.',
    },
    type: {
      control: 'text',
      name: 'type',
      table: { category: 'Input Attributes' },
      description:
        'The type attribute for the input element. This can be used to specify the type of data expected (e.g., "text", "email", "number").',
    },

    /* =========================
     * Validation
     * ========================= */
    error: {
      control: 'boolean',
      name: 'error',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description:
        'Marks the input as having an error state, which will typically apply error styling to the component.',
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
      description:
        'Marks the input as required, which will trigger validation if the field is left empty.',
    },
    validation: {
      control: 'boolean',
      name: 'validation',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Enables validation for the input field.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      table: { category: 'Validation' },
      description: 'The validation message to display when the input is invalid.',
    },
  },

  args: {
    addBtn: false,
    addIcon: 'fas fa-plus',
    addNewOnEnter: true,
    arialabelledBy: '',
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
    id: 'aci4',
    inputCol: '',
    inputCols: '',
    inputId: 'ac-2',
    label: 'Autocomplete Multiple Selections',
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

    // NEW standard a11y args
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
  },
};

// --- Variants (kept; none removed) ---
export const Basic = {
  args: {
    addBtn: false,
    addIcon: '',
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
    labelCol: '',
    labelCols: '',
    labelHidden: false,
    labelSize: '',
    preserveInputOnSelect: false,
    removeBtnBorder: false,
    removeClearBtn: false,
    required: false,
    size: '',
    validation: false,
    validationMessage: '',
    value: [],
  },
};
Basic.storyName = 'Basic';
Basic.parameters = {
  docs: {
    description: {
      story:
        'The default configuration of the component with no specific layout applied. Note: options must be set at runtime (not via attribute) for the autocomplete to work properly, so the "Options" control here is an array that gets passed in after hydration.',
    },
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
HorizontalLayout.storyName = 'Horizontal Layout';
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
InlineLayout.storyName = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    description: {
      story: 'Applies an inline layout where the label and input are displayed in a single line.',
    },
    story: { height: '300px' },
  },
};

export const EditableKeepOpen = {
  args: {
    editable: true,
    addBtn: true,
    clearInputOnBlurOutside: false,
    arialabelledBy: '',
  },
};
EditableKeepOpen.storyName = 'Adding new items to the dropdown list (Editable)';
EditableKeepOpen.parameters = {
  docs: {
    description: {
      story:
        'When "editable" is enabled, users can type new items/options into the field and those items will appear in the dropdown list if removed from the input. This also allows users to delete the added item by clicking the "x" from the dropdown list.',
    },
    story: { height: '300px' },
  },
};

// ✅ Controlled Value story (array) — single source of truth is args.value
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
      id: args.id || 'acms_controlled',
      inputId: args.inputId || 'acms-controlled',
      label: args.label || 'Controlled Value',
    });

    const el = elWrap.querySelector('autocomplete-multiple-selections');

    const setNext = (next) => {
      const safe = Array.isArray(next) ? next.slice() : [];
      // update Storybook args (Docs code + Controls reflect)
      ctx.updateArgs?.({ value: safe });
      // update live element immediately (avoid waiting for re-render)
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
        transform: (_src, ctx) => wrapDocsHtml(buildDocsComponentHtml(ctx.args)),
      },
      description: {
        story:
          'Demonstrates the controlled `value` prop (array). Buttons call `updateArgs({ value })` and also set the element property immediately so the UI updates without waiting for a Storybook re-render.',
      },
      story: { height: '420px' },
    },
  },
};
ControlledValue.storyName = 'Controlled Value (array)';

// ✅ Sizes story (sm, default "", lg) using the `size` arg values
const SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm', inputId: 'acms-sm', id: 'acms_sm' },
  { key: 'default', label: 'Default', size: '', inputId: 'acms-md', id: 'acms_md' },
  { key: 'lg', label: 'Large', size: 'lg', inputId: 'acms-lg', id: 'acms_lg' },
];

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
              buildDocsComponentHtml({
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
          'Shows the three supported sizes by setting the `size` arg to `sm`, empty string (default), and `lg`. Note: options are set at runtime (not via attribute) for the autocomplete to work properly, so the "Options" control here is an array that gets passed in after hydration.',
      },
      story: { height: '480px' },
    },
  },
};
Sizes.storyName = 'Sizes';

export const FieldValidation = {
  args: {
    validation: true,
    validationMessage: 'This field is required.',
    required: true,
  },
};
FieldValidation.storyName = 'Required with Validation Message';
FieldValidation.parameters = {
  docs: {
    description: {
      story:
        'Enables validation for the input field. When the field is left empty and loses focus, the specified validation message will be displayed.',
    },
    story: { height: '300px' },
  },
};

export const Disabled = {
  args: {
    inputId: 'acms-disabled',
    label: 'Disabled',
    disabled: true,
    validationMessage: '',
    addBtn: false,
    addIcon: '',
    clearIcon: '',
    autoSort: false,
    addNewOnEnter: false,
    badgeVariant: '',
    value: ['Banana', 'Mango'],
  },
};
Disabled.storyName = 'Disabled';
Disabled.parameters = {
  docs: {
    description: {
      story: 'Disables the input field, preventing user interaction.',
    },
  },
};

export const BadgeStyling = {
  args: {
    inputId: 'acms-badges',
    label: 'With custom badge style',
    editable: true,
    addBtn: true,
    badgeVariant: 'info',
    badgeShape: 'rounded-pill',
    badgeInlineStyles: 'border-radius:14px; font-weight:600;',
  },
};
BadgeStyling.storyName = 'Custom Badge Styling';
BadgeStyling.parameters = {
  docs: {
    description: {
      story:
        'Use the "Badge Variant" control to apply Bootstrap text-bg color classes (e.g. "primary", "success", "danger") or your own CSS class for custom colors. The "Badge Shape" control can be used to apply a custom class for pill/rounded styling. For full control, use the "Badge Inline Styles" to add any CSS properties you want directly to each badge (e.g. "border-radius:12px; font-weight:600;").',
    },
    story: { height: '300px' },
  },
};

// --- NEW: Accessibility matrix story ---
export const AccessibilityMatrix = {
  name: 'Accessibility matrix (computed)',
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML = `<strong>Accessibility matrix</strong><div style="opacity:.8">Prints computed combobox/listbox/label wiring + validation/error ids. Also shows id de-dupe with two instances.</div>`;
    wrap.appendChild(title);

    const row = (labelText, build) => {
      const card = document.createElement('div');
      card.style.display = 'grid';
      card.style.gridTemplateColumns = '280px 1fr';
      card.style.gap = '12px';
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

      card.appendChild(left);
      card.appendChild(right);

      const snapshot = () => {
        const host = demo.querySelector('autocomplete-multiple-selections');
        const input = host?.querySelector('input[role="combobox"]');
        const listbox = host?.querySelector('[role="listbox"]');
        const labelEl = host?.querySelector('label');

        pre.textContent = JSON.stringify(
          {
            hostId: host?.getAttribute('id') ?? null,
            inputId: input?.getAttribute('id') ?? null,
            labelId: labelEl?.getAttribute('id') ?? null,
            'aria-labelledby': input?.getAttribute('aria-labelledby') ?? null,
            'aria-label': input?.getAttribute('aria-label') ?? null,
            'aria-describedby': input?.getAttribute('aria-describedby') ?? null,
            'aria-controls': input?.getAttribute('aria-controls') ?? null,
            'aria-expanded': input?.getAttribute('aria-expanded') ?? null,
            'aria-activedescendant': input?.getAttribute('aria-activedescendant') ?? null,
            'aria-required': input?.getAttribute('aria-required') ?? null,
            'aria-invalid': input?.getAttribute('aria-invalid') ?? null,
            listboxId: listbox?.getAttribute('id') ?? null,
            hasValidation: !!host?.querySelector('.invalid-feedback'),
            hasError: !!host?.querySelector('.error-message'),
          },
          null,
          2,
        );
      };

      queueMicrotask(() => requestAnimationFrame(snapshot));
      return card;
    };

    wrap.appendChild(
      row('Default (internal label wiring)', () =>
        renderComponent({
          ...args,
          inputId: 'mx-default',
          label: 'Default A11y',
          validation: false,
          error: false,
          value: [],
        }),
      ),
    );

    wrap.appendChild(
      row('Validation (aria-invalid + describedby)', () =>
        renderComponent({
          ...args,
          inputId: 'mx-val',
          label: 'Required',
          required: true,
          validation: true,
          validationMessage: 'This is required.',
        }),
      ),
    );

    wrap.appendChild(
      row('External aria-labelledby/aria-describedby (overrides)', () => {
        const outer = document.createElement('div');
        outer.style.display = 'grid';
        outer.style.gap = '6px';

        const lbl = document.createElement('div');
        lbl.id = 'mx-external-label';
        lbl.textContent = 'External label text';
        lbl.style.fontWeight = '600';

        const desc = document.createElement('div');
        desc.id = 'mx-external-desc';
        desc.textContent = 'External description/help.';
        desc.style.opacity = '0.85';

        outer.appendChild(lbl);
        outer.appendChild(desc);

        const wrapped = renderComponent({
          ...args,
          inputId: 'mx-ext',
          label: 'Internal label still exists',
          ariaLabelledby: 'mx-external-label',
          ariaDescribedby: 'mx-external-desc',
        });

        outer.appendChild(wrapped);
        return outer;
      }),
    );

    // ✅ UPDATED: snapshot enumerates BOTH instances to prove id de-dupe works
    wrap.appendChild(
      (() => {
        const labelText = 'ID de-dupe (two instances share same input-id)';
        const build = () => {
          const outer = document.createElement('div');
          outer.style.display = 'grid';
          outer.style.gap = '10px';

          const a = renderComponent({ ...args, inputId: 'dup', label: 'First dup' });
          const b = renderComponent({ ...args, inputId: 'dup', label: 'Second dup' });

          outer.appendChild(a);
          outer.appendChild(b);

          return outer;
        };

        const card = document.createElement('div');
        card.style.display = 'grid';
        card.style.gridTemplateColumns = '280px 1fr';
        card.style.gap = '12px';
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

        card.appendChild(left);
        card.appendChild(right);

        const snapshot = () => {
          const hosts = Array.from(demo.querySelectorAll('autocomplete-multiple-selections'));
          const instances = hosts.map((host) => {
            const input = host.querySelector('input[role="combobox"]');
            const labelEl = host.querySelector('label');
            const listboxId = input?.getAttribute('aria-controls') ?? null;
            return {
              hostId: host.getAttribute('id') ?? null,
              inputId: input?.getAttribute('id') ?? null,
              labelId: labelEl?.getAttribute('id') ?? null,
              labelledby: input?.getAttribute('aria-labelledby') ?? null,
              controls: listboxId,
            };
          });

          pre.textContent = JSON.stringify({ instances }, null, 2);
        };

        queueMicrotask(() => requestAnimationFrame(snapshot));
        return card;
      })(),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the combobox + listbox: `aria-labelledby`, `aria-describedby` (including validation/error ids), `aria-controls`, `aria-expanded`, `aria-activedescendant`, and shows id de-dupe when multiple instances use the same `input-id`.',
      },
    },
  },
};
