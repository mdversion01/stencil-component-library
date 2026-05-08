import DocsPage from './plumage-autocomplete-multiple-selections.docs.mdx';
import {
  DocsWrapStyles,
  FRUIT,
  SIZE_VARIANTS,
  buildDocsComponentHtml,
  buildDocsHtmlMany,
  mkMatrixCellA11y,
  normalize,
  renderComponent,
  setOptionsWhenReady,
  setValueWhenReady,
  wrapDocsHtml,
} from './plumage-autocomplete-multiple-selections.story-helpers.js';

const TAG = 'plumage-autocomplete-multiple-selections-component';

export default {
  title: 'Form/Plumage Autocomplete Multiple Selections',
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
          'Plumage-styled Autocomplete Multiple Selections component with badges, fast keyboard navigation (arrows/Home/End/PageUp/PageDown/Escape), optional add/delete of user options, responsive layouts (stacked, horizontal, inline), and keep-open-after-select UX.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsComponentHtml(ctx.args)),
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
    value: {
      control: 'object',
      name: 'value',
      table: { category: 'Attributes' },
      description: 'Controlled selected items (string[]). Set as a property at runtime (not as an attribute).',
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
      description: 'The array of options available for selection in the autocomplete.',
    },

    devMode: {
      control: 'boolean',
      name: 'dev-mode',
      table: { category: 'Dev Mode', defaultValue: { summary: false } },
      description: 'Enables developer mode (extra logging).',
    },

    arialabelledBy: {
      control: 'text',
      name: 'arialabelled-by',
      table: { category: 'Input Attributes' },
      description: 'The id of the element that labels the input for accessibility purposes.',
    },
    disabled: {
      control: 'boolean',
      name: 'disabled',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Disables the input field, preventing user interaction.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes' },
      description: 'The unique identifier for the input element within the component. This is used for accessibility and form association.',
    },
    label: {
      control: 'text',
      name: 'label',
      table: { category: 'Input Attributes' },
      description: 'The text label for the component. This is used for accessibility and user guidance.',
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
    type: {
      control: 'text',
      name: 'type',
      table: { category: 'Input Attributes' },
      description: 'The type attribute for the input element. This can be used to specify the type of data expected (e.g., "text", "email", "number").',
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
      description: 'Used with horizontal form layouts. Single numeric column for the input in a grid. Default is 10 (col-10).',
    },
    inputCols: {
      control: 'text',
      name: 'input-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive input column classes, e.g. "col", "col-sm-9 col-md-8".',
    },
    labelAlign: {
      control: { type: 'select' },
      options: ['', 'right'],
      name: 'label-align',
      table: { category: 'Layout' },
      description: 'Aligns the label text. "right" aligns the label to the right, which is typically used in horizontal form layouts.',
    },
    labelCol: {
      control: 'text',
      name: 'label-col',
      table: { category: 'Layout', defaultValue: { summary: 2 } },
      description: 'Used with horizontal form layouts. Single numeric column for the label in a grid. Default is 2 (col-2).',
    },
    labelCols: {
      control: 'text',
      name: 'label-cols',
      table: { category: 'Layout' },
      description: 'Used with horizontal form layouts. Responsive label column classes, e.g. "col", "col-sm-3 col-md-4", "xs-12 sm-6 md-4".',
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
      description: 'Sets the size of the label text. Options include "xs" (extra small), "sm" (small), "base" (default), and "lg" (large).',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'size',
      table: { category: 'Layout' },
      description: 'Sets the size of the input field. Options include "sm" (small) and "lg" (large). Not adding any size will use the default.',
    },

    error: {
      control: 'boolean',
      name: 'error',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the input as having an error state, which will typically apply error styling to the component.',
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
      description: 'Marks the input as required, which will trigger validation if the field is left empty.',
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
    editable: true,
    error: false,
    errorMessage: '',
    formId: '',
    formLayout: '',
    id: 'aci4',
    inputCol: '',
    inputCols: '',
    inputId: 'acms-basic',
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
    validationMessage: 'Pick at least one item or type 3+ characters.',
    value: [],
  },
};

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
      story: 'The default configuration of the component with no specific layout applied. Note: options are set via the `options` property after hydration.',
    },
    story: { height: '300px' },
  },
};

export const HorizontalLayout = {
  args: {
    inputId: 'acms-horizontal',
    label: 'Organizations',
    formLayout: 'horizontal',
    labelAlign: 'right',
    labelSize: 'lg',
    labelCol: 3,
    inputCol: 9,
    placeholder: 'Start typing...',
    size: '',
    editable: false,
    addBtn: false,
    addIcon: '',
    validationMessage: '',
    autoSort: false,
    addNewOnEnter: false,
    options: ['Acme, Inc.', 'Acme Labs', 'Alpha Co', 'Beta Corp', 'Delta Systems', 'Epsilon Partners', 'Gamma Group'],
    value: [],
  },
};
HorizontalLayout.storyName = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'Applies a horizontal Bootstrap layout with the label aligned to the right. This layout is suitable for forms where labels and inputs are arranged in a two-column format.',
    },
    story: { height: '300px' },
  },
};

export const InlineLayout = {
  args: {
    inputId: 'acms-inline-1',
    label: 'Cities',
    formLayout: 'inline',
    editable: false,
    size: '',
    addBtn: false,
    addIcon: '',
    validationMessage: '',
    autoSort: false,
    addNewOnEnter: false,
    options: ['Austin', 'Boston', 'Chicago', 'Denver', 'Los Angeles', 'New York', 'Portland', 'Seattle', 'San Francisco'],
    value: [],
  },
  render: (args) => renderComponent(args, { idOverride: 'acms_inline1' }),
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

export const EditableKeepOpenRapidPick = {
  name: 'Adding new items to the dropdown list (Editable)',
  args: {
    inputId: 'acms-editable',
    label: 'Tags',
    editable: true,
    addBtn: true,
    addIcon: 'fas fa-plus',
    preserveInputOnSelect: false,
    badgeVariant: 'success',
    badgeShape: 'rounded-pill',
    placeholder: 'Type to add/select…',
    validationMessage: '',
    devMode: true,
    options: ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Data', 'Design', 'QA', 'Product'],
    value: ['Frontend', 'DevOps'],
  },
  render: (args) => renderComponent(args, { idOverride: 'acms_edit' }),
};
EditableKeepOpenRapidPick.parameters = {
  docs: {
    description: {
      story:
        'When "editable" is enabled, users can type new items/options into the field and those items will appear in the dropdown list if removed from the input. This also allows users to delete the added item by clicking the "x" from the dropdown list.',
    },
    story: { height: '300px' },
  },
};

export const ControlledValue = {
  name: 'Controlled Value (array)',
  args: {
    inputId: 'acms-controlled',
    label: 'Controlled selections',
    editable: false,
    addBtn: false,
    addIcon: '',
    placeholder: 'Type to filter…',
    options: FRUIT,
    value: ['Apple', 'Mango'],
    validationMessage: '',
  },
  render: (args) => {
    const wrap = document.createElement('div');
    wrap.style.maxWidth = '760px';

    const elWrap = renderComponent(args, { idOverride: 'acms_controlled' });
    const el = elWrap.querySelector(TAG);

    const buttons = document.createElement('div');
    buttons.style.marginTop = '12px';
    buttons.style.display = 'flex';
    buttons.style.gap = '8px';
    buttons.style.flexWrap = 'wrap';

    const mkBtn = (label) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-sm btn-secondary';
      b.textContent = label;
      return b;
    };

    const btnAppleMango = mkBtn('Set: Apple + Mango');
    const btnCitrus = mkBtn('Set: Orange + Lemon + Lime');
    const btnClear = mkBtn('Clear');
    const btnWeird = mkBtn('Set: (sanitization demo)');

    buttons.appendChild(btnAppleMango);
    buttons.appendChild(btnCitrus);
    buttons.appendChild(btnClear);
    buttons.appendChild(btnWeird);

    const setVal = async (next) => {
      if (!el) return;
      await (typeof el.componentOnReady === 'function' ? el.componentOnReady() : customElements.whenDefined(TAG));
      el.value = Array.isArray(next) ? next : [];
      args.value = Array.isArray(next) ? next : [];
    };

    btnAppleMango.addEventListener('click', () => setVal(['Apple', 'Mango']));
    btnCitrus.addEventListener('click', () => setVal(['Orange', 'Lemon', 'Lime']));
    btnClear.addEventListener('click', () => setVal([]));
    btnWeird.addEventListener('click', () => setVal(['  <b>Apple</b>  ', 'MANGO', 'mango', '\u0007Bad\u0000', '']));

    wrap.appendChild(elWrap);
    wrap.appendChild(buttons);
    return wrap;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_src, ctx) =>
          wrapDocsHtml(
            normalize(`
${buildDocsComponentHtml(ctx.args)}
<!-- Value is a string[] prop; in real usage you typically set it as a property:
<script>
  const el = document.querySelector('${TAG}');
  el.value = ${JSON.stringify(ctx.args.value || [])};
</script>
-->
`),
          ),
      },
      description: {
        story:
          'Demonstrates the controlled `value` prop (string[]). Buttons set `el.value` as a property to update selected items programmatically (and shows sanitization behavior).',
      },
      story: { height: '380px' },
    },
  },
};

export const Sizes = {
  render: (args) => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '14px';
    container.style.maxWidth = '760px';

    for (const v of SIZE_VARIANTS) {
      const elWrap = renderComponent({ ...args, ...v }, { idOverride: v.id });
      container.appendChild(elWrap);

      const el = elWrap.querySelector(TAG);
      if (el) {
        setOptionsWhenReady(el, FRUIT);
        setValueWhenReady(el, Array.isArray(v.value) ? v.value : []);
      }
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
                ...v,
                options: undefined,
              }),
            ),
          ),
      },
      description: {
        story: 'Shows the three supported sizes by setting the `size` arg to `sm`, empty string (default), and `lg`. Options/value are applied at runtime as properties.',
      },
      story: { height: '480px' },
    },
  },
};

export const FieldValidation = {
  args: {
    inputId: 'acms-required',
    label: 'Favorite Fruits',
    required: true,
    validation: true,
    validationMessage: 'Pick at least one fruit or type 3+ characters',
    editable: false,
    addBtn: false,
    addIcon: '',
    badgeVariant: 'secondary',
    badgeShape: 'rounded-pill',
    options: FRUIT,
    value: [],
  },
};
FieldValidation.storyName = 'Required with Validation Message';
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
    inputId: 'acms-disabled',
    label: 'Disabled',
    disabled: true,
    badgeVariant: '',
    options: FRUIT,
    validationMessage: '',
    addBtn: false,
    addIcon: '',
    editable: false,
    autoSort: false,
    addNewOnEnter: false,
    clearIcon: '',
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
    options: FRUIT,
    value: ['Apple', 'Orange'],
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

export const AccessibilityMatrix = {
  name: 'Accessibility matrix',
  args: {
    options: FRUIT,
    value: [],
    editable: false,
    addBtn: false,
    addIcon: '',
    clearIcon: 'fa-solid fa-xmark',
    removeClearBtn: false,
    removeBtnBorder: false,
    preserveInputOnSelect: false,
    clearInputOnBlurOutside: false,
    autoSort: true,
    addNewOnEnter: true,
    devMode: false,
    labelHidden: false,
    labelAlign: '',
    labelSize: 'sm',
    size: '',
    formId: '',
    name: '',
    rawInputName: '',
    type: 'text',
    arialabelledBy: '',
    placeholder: 'Type to search...',
  },
  render: (args) => {
    const outer = document.createElement('div');

    const note = document.createElement('div');
    note.style.maxWidth = '1100px';
    note.style.marginBottom = '10px';
    note.style.color = '#444';
    note.innerHTML = `
      <div style="font-weight:700; margin-bottom:4px;">What this shows</div>
      <div style="font-size:13px; line-height:1.4;">
        Each variant prints a JSON snapshot of the computed <code>role</code>, <code>aria-*</code> attributes, and key ids
        (<code>inputId</code> / <code>-listbox</code> / <code>-live</code>).
        For required+validation states, the story calls <code>el.validate()</code> to force <code>aria-invalid</code> + message wiring.
      </div>
    `;
    outer.appendChild(note);

    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(360px, 1fr))';
    container.style.gap = '14px';
    container.style.maxWidth = '1100px';
    outer.appendChild(container);

    const variants = [
      { __title: 'Default / normal', inputId: 'acms-a11y-default', label: 'Default', formLayout: '', disabled: false, error: false, errorMessage: '', required: false, validation: false, validationMessage: '', value: [] },
      { __title: 'Default / validation (required)', inputId: 'acms-a11y-default-validation', label: 'Default + validation', formLayout: '', disabled: false, error: false, errorMessage: '', required: true, validation: true, validationMessage: 'Pick at least one item.', value: [] },
      { __title: 'Default / error', inputId: 'acms-a11y-default-error', label: 'Default + error', formLayout: '', disabled: false, error: true, errorMessage: 'Something went wrong.', required: false, validation: false, validationMessage: '', value: [] },
      { __title: 'Default / disabled', inputId: 'acms-a11y-default-disabled', label: 'Default disabled', formLayout: '', disabled: true, error: false, errorMessage: '', required: false, validation: false, validationMessage: '', value: ['Apple', 'Mango'] },

      { __title: 'Inline / normal', inputId: 'acms-a11y-inline', label: 'Inline', formLayout: 'inline', disabled: false, error: false, errorMessage: '', required: false, validation: false, validationMessage: '', value: [] },
      { __title: 'Inline / validation (required)', inputId: 'acms-a11y-inline-validation', label: 'Inline + validation', formLayout: 'inline', disabled: false, error: false, errorMessage: '', required: true, validation: true, validationMessage: 'Pick at least one item.', value: [] },
      { __title: 'Inline / error', inputId: 'acms-a11y-inline-error', label: 'Inline + error', formLayout: 'inline', disabled: false, error: true, errorMessage: 'Something went wrong.', required: false, validation: false, validationMessage: '', value: [] },
      { __title: 'Inline / disabled', inputId: 'acms-a11y-inline-disabled', label: 'Inline disabled', formLayout: 'inline', disabled: true, error: false, errorMessage: '', required: false, validation: false, validationMessage: '', value: ['Banana', 'Orange'] },

      { __title: 'Horizontal / normal', inputId: 'acms-a11y-horizontal', label: 'Horizontal', formLayout: 'horizontal', labelAlign: 'right', labelSize: 'lg', labelCol: 3, inputCol: 9, disabled: false, error: false, errorMessage: '', required: false, validation: false, validationMessage: '', value: [] },
      { __title: 'Horizontal / validation (required)', inputId: 'acms-a11y-horizontal-validation', label: 'Horizontal + validation', formLayout: 'horizontal', labelAlign: 'right', labelSize: 'lg', labelCol: 3, inputCol: 9, disabled: false, error: false, errorMessage: '', required: true, validation: true, validationMessage: 'Pick at least one item.', value: [] },
      { __title: 'Horizontal / error', inputId: 'acms-a11y-horizontal-error', label: 'Horizontal + error', formLayout: 'horizontal', labelAlign: 'right', labelSize: 'lg', labelCol: 3, inputCol: 9, disabled: false, error: true, errorMessage: 'Something went wrong.', required: false, validation: false, validationMessage: '', value: [] },
      { __title: 'Horizontal / disabled', inputId: 'acms-a11y-horizontal-disabled', label: 'Horizontal disabled', formLayout: 'horizontal', labelAlign: 'right', labelSize: 'lg', labelCol: 3, inputCol: 9, disabled: true, error: false, errorMessage: '', required: false, validation: false, validationMessage: '', value: ['Strawberry'] },
    ];

    for (let i = 0; i < variants.length; i += 1) {
      const v = variants[i];
      const cell = mkMatrixCellA11y(
        {
          ...args,
          ...v,
          options: Array.isArray(v.options) ? v.options : args.options,
        },
        { idOverride: `acms_a11y_${i}` },
      );
      container.appendChild(cell);
    }

    return outer;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Renders a matrix of layout + state combinations (default/inline/horizontal × error/validation/disabled). Each cell prints computed role/ARIA attributes/ids to support accessibility reviews and 508 checks.',
      },
      story: { height: '1400px' },
      source: {
        language: 'html',
        transform: (_src, ctx) =>
          wrapDocsHtml(
            normalize(`
<!-- Accessibility Matrix renders multiple instances; see Canvas for printed computed role + aria-* + ids. -->

${buildDocsComponentHtml({
  ...ctx.args,
  inputId: 'acms-a11y-default',
  label: 'Default',
})}
`),
          ),
      },
    },
  },
};
