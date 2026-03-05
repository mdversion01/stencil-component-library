// stories/autocomplete-single.stories.js

// ======================================================
// Helpers (Docs formatting + HTML source generation)
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

/** Collapse blank lines + trim edges (keeps docs code previews clean) */
const normalize = txt => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

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
const attrLines = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

/** Build docs HTML for the component (options applied at runtime, not as attribute) */
const buildDocsHtml = args =>
  normalize(`
  <autocomplete-single ${attrLines([
    // ✅ alphabetized (kebab-case)
    ['arialabelled-by', args.arialabelledBy],
    ['auto-sort', args.autoSort],
    ['clear-icon', args.clearIcon],
    ['dev-mode', args.devMode],
    ['disabled', args.disabled],
    ['error', args.error],
    ['error-message', args.errorMessage],
    ['form-id', args.formId],
    ['form-layout', args.formLayout],
    ['id', args.id],
    ['input-col', args.inputCol],
    ['input-cols', args.inputCols],
    ['input-id', args.inputId],
    ['label', args.label],
    ['label-align', args.labelAlign],
    ['label-col', args.labelCol],
    ['label-cols', args.labelCols],
    ['label-hidden', args.labelHidden],
    ['label-size', args.labelSize],
    ['placeholder', args.placeholder],
    ['remove-clear-btn', args.removeClearBtn],
    ['required', args.required],
    ['size', args.size],
    ['type', args.type],
    ['validation', args.validation],
    ['validation-message', args.validationMessage],
    ['value', args.value],
  ])}>
  </autocomplete-single>
`);

/** Docs wrapper */
const wrapDocsHtml = innerHtml =>
  normalize(`
<div style="max-width:680px;">
  ${String(innerHtml).replace(/\n/g, '\n  ')}
</div>
`);

/** Multi-snippet docs helper (single wrapper, multiple components) */
const buildDocsHtmlMany = snippets =>
  wrapDocsHtml(
    normalize(`
<div style="display:grid; gap:14px;">
${snippets.map(s => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`),
  );

// ======================================================
// Runtime helpers (DOM render path)
// ======================================================

const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const whenReady = async (el, tagName) => {
  if (typeof el?.componentOnReady === 'function') {
    await el.componentOnReady();
    return;
  }
  if (window.customElements?.whenDefined) {
    await customElements.whenDefined(tagName);
  }
};

const setOptionsWhenReady = async (el, options) => {
  const safe = Array.isArray(options) ? options.slice() : [];
  await whenReady(el, 'autocomplete-single');
  el.options = safe;
};

const setValueWhenReady = async (el, value) => {
  await whenReady(el, 'autocomplete-single');
  el.value = typeof value === 'string' ? value : '';
};

const setAutoSortWhenReady = async (el, autoSort) => {
  await whenReady(el, 'autocomplete-single');
  el.autoSort = !!autoSort;
};

// best-effort Storybook args syncing (Canvas), while still working in Docs/static
const updateArgsBestEffort = (ctx, updatedArgs) => {
  // Storybook 7+ provides updateArgs on context
  if (typeof ctx?.updateArgs === 'function') {
    try {
      ctx.updateArgs(updatedArgs);
      return;
    } catch (_e) {
      // fall through
    }
  }

  // Older/best-effort channel emit (harmless if unsupported)
  try {
    const channel =
      window.__STORYBOOK_ADDONS_CHANNEL__ ||
      window.__STORYBOOK_PREVIEW__?.addons?.getChannel?.() ||
      window.__STORYBOOK_ADDONS?.getChannel?.();

    const storyId = ctx?.id;
    if (!channel || !storyId) return;

    channel.emit('updateStoryArgs', { storyId, updatedArgs });
    channel.emit('UPDATE_STORY_ARGS', { storyId, updatedArgs });
  } catch (_e) {
    // no-op
  }
};

// ======================================================
// Sample data
// ======================================================

const DEFAULT_OPTIONS = ['Apple', 'Apparatus', 'Apple Pie', 'Applegate', 'Banana', 'Orange', 'Mango'];

// ======================================================
// Default export
// ======================================================

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
      description: {
        component: ['Autocomplete Single component for selecting a single option from a list with autocomplete functionality.', ''].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => wrapDocsHtml(buildDocsHtml(ctx.args)),
      },
    },
  },

  render: (args, ctx) => {
    const el = document.createElement('autocomplete-single');

    // attributes (kebab-case)
    setAttr(el, 'arialabelled-by', args.arialabelledBy);
    setAttr(el, 'auto-sort', args.autoSort);
    setAttr(el, 'clear-icon', args.clearIcon);
    setAttr(el, 'error-message', args.errorMessage);
    setAttr(el, 'form-id', args.formId);
    setAttr(el, 'form-layout', args.formLayout);
    setAttr(el, 'id', args.id);
    setAttr(el, 'input-col', args.inputCol);
    setAttr(el, 'input-cols', args.inputCols);
    setAttr(el, 'input-id', args.inputId);
    setAttr(el, 'label', args.label);
    setAttr(el, 'label-align', args.labelAlign);
    setAttr(el, 'label-col', args.labelCol);
    setAttr(el, 'label-cols', args.labelCols);
    setAttr(el, 'label-size', args.labelSize);
    setAttr(el, 'placeholder', args.placeholder);
    setAttr(el, 'size', args.size);
    setAttr(el, 'type', args.type || 'text');
    setAttr(el, 'validation-message', args.validationMessage);

    // booleans
    args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
    args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
    args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
    args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
    args.labelHidden ? el.setAttribute('label-hidden', '') : el.removeAttribute('label-hidden');
    args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
    args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');

    // options + autoSort + value (props; apply post-hydration)
    setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : DEFAULT_OPTIONS);
    setAutoSortWhenReady(el, args.autoSort);
    setValueWhenReady(el, args.value);

    // logs
    el.addEventListener('itemSelect', e => console.log('[autocomplete-single] itemSelect', e.detail));
    el.addEventListener('valueChange', e => console.log('[autocomplete-single] valueChange', e.detail));
    el.addEventListener('clear', () => console.log('[autocomplete-single] clear'));

    // (optional) reflect emitted changes back into args (Canvas)
    el.addEventListener('valueChange', e => {
      const next = e?.detail ?? '';
      updateArgsBestEffort(ctx, { value: String(next) });
    });
    el.addEventListener('change', e => {
      const next = e?.detail?.value;
      if (next !== undefined) updateArgsBestEffort(ctx, { value: String(next) });
    });

    return el;
  },

  argTypes: {
    /* =========================
     * Attributes
     * ========================= */
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
    error: {
      control: 'boolean',
      name: 'error',
      table: { category: 'Attributes', defaultValue: { summary: false } },
      description: 'Marks the input as having an error state.',
    },
    errorMessage: {
      control: 'text',
      name: 'error-message',
      table: { category: 'Attributes', defaultValue: { summary: '' } },
      description: 'The error message to display when the input is in an error state.',
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
      description: 'The unique identifier for the component instance.',
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

    /* =========================
     * Button Attributes
     * ========================= */
    clearIcon: {
      control: 'text',
      name: 'clear-icon',
      table: { category: 'Button Attributes' },
      description: 'The icon to use for the clear button.',
    },

    /* =========================
     * Data
     * ========================= */
    options: {
      control: 'object',
      name: 'options',
      table: { category: 'Data' },
      description: 'The array of options available for selection in the autocomplete. (Applied at runtime via prop assignment.)',
    },

    /* =========================
     * Input Attributes
     * ========================= */
    arialabelledBy: {
      control: 'text',
      name: 'arialabelled-by',
      table: { category: 'Input Attributes' },
      description: 'The id(s) of the element(s) that label the input.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes' },
      description: 'The unique identifier for the input element within the component.',
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

    /* =========================
     * Layout
     * ========================= */
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

    /* =========================
     * Validation
     * ========================= */
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

  // ✅ Keep defaults aligned with plumage story
  args: {
    arialabelledBy: '',
    autoSort: true,
    clearIcon: 'fa-solid fa-xmark',
    devMode: false,
    disabled: false,
    error: false,
    errorMessage: '',
    formId: '',
    formLayout: '',
    id: 'aci-story',
    inputCol: 10,
    inputCols: '',
    inputId: 'ac-single',
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

// ======================================================
// Stories (match plumage-autocomplete-single)
// ======================================================

export const Basic = {
  args: {
    value: '',
  },
};
Basic.storyName = 'Basic';
Basic.parameters = {
  docs: { description: { story: 'Default single-select autocomplete.' }, story: { height: '300px' } },
};

export const HorizontalLayout = {
  args: {
    formLayout: 'horizontal',
    labelAlign: 'right',
    labelCol: 4,
    inputCol: 8,
  },
};
HorizontalLayout.storyName = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: { description: { story: 'Horizontal form layout with right-aligned label.' }, story: { height: '300px' } },
};

export const InlineLayout = {
  args: {
    formLayout: 'inline',
    labelAlign: '',
    size: 'sm',
  },
};
InlineLayout.storyName = 'Inline Layout';
InlineLayout.parameters = {
  docs: { description: { story: 'Inline layout where label + input sit in a single row.' }, story: { height: '300px' } },
};

// Sizes (sm, default "", lg)
const SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm', inputId: 'ac-single-sm', id: 'ac_single_sm' },
  { key: 'default', label: 'Default', size: '', inputId: 'ac-single-md', id: 'ac_single_md' },
  { key: 'lg', label: 'Large', size: 'lg', inputId: 'ac-single-lg', id: 'ac_single_lg' },
];

export const Sizes = {
  render: args => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '14px';
    container.style.maxWidth = '760px';

    for (const v of SIZE_VARIANTS) {
      const el = document.createElement('autocomplete-single');

      setAttr(el, 'arialabelled-by', args.arialabelledBy);
      setAttr(el, 'auto-sort', args.autoSort);
      setAttr(el, 'clear-icon', args.clearIcon);
      setAttr(el, 'error-message', args.errorMessage);
      setAttr(el, 'form-id', args.formId);
      setAttr(el, 'form-layout', args.formLayout);

      setAttr(el, 'id', v.id);
      setAttr(el, 'input-col', args.inputCol);
      setAttr(el, 'input-cols', args.inputCols);
      setAttr(el, 'input-id', v.inputId);

      setAttr(el, 'label', `${args.label || 'Autocomplete Single'} — ${v.label}`);
      setAttr(el, 'label-align', args.labelAlign);
      setAttr(el, 'label-col', args.labelCol);
      setAttr(el, 'label-cols', args.labelCols);
      setAttr(el, 'label-hidden', args.labelHidden);
      setAttr(el, 'label-size', args.labelSize);

      setAttr(el, 'placeholder', args.placeholder);
      setAttr(el, 'size', v.size);
      setAttr(el, 'type', args.type || 'text');
      setAttr(el, 'validation-message', args.validationMessage);

      args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
      args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
      args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
      args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
      args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
      args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');

      setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : DEFAULT_OPTIONS);
      setAutoSortWhenReady(el, args.autoSort);
      setValueWhenReady(el, args.value);

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
                options: undefined, // runtime-only
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
Sizes.storyName = 'Sizes';

// Controlled Value (buttons always work; args sync when possible)
export const ControlledValue = {
  args: {
    placeholder: 'Type to search/filter...',
    value: 'Apple',
  },
  render: (args, ctx) => {
    const wrap = document.createElement('div');
    wrap.style.maxWidth = '680px';
    wrap.style.display = 'grid';
    wrap.style.gap = '10px';

    const el = document.createElement('autocomplete-single');

    // apply attrs (same as default render)
    setAttr(el, 'arialabelled-by', args.arialabelledBy);
    setAttr(el, 'auto-sort', args.autoSort);
    setAttr(el, 'clear-icon', args.clearIcon);
    setAttr(el, 'error-message', args.errorMessage);
    setAttr(el, 'form-id', args.formId);
    setAttr(el, 'form-layout', args.formLayout);
    setAttr(el, 'id', args.id);
    setAttr(el, 'input-col', args.inputCol);
    setAttr(el, 'input-cols', args.inputCols);
    setAttr(el, 'input-id', args.inputId);
    setAttr(el, 'label', args.label);
    setAttr(el, 'label-align', args.labelAlign);
    setAttr(el, 'label-col', args.labelCol);
    setAttr(el, 'label-cols', args.labelCols);
    setAttr(el, 'label-hidden', args.labelHidden);
    setAttr(el, 'label-size', args.labelSize);
    setAttr(el, 'placeholder', args.placeholder);
    setAttr(el, 'size', args.size);
    setAttr(el, 'type', args.type || 'text');
    setAttr(el, 'validation-message', args.validationMessage);

    args.required ? el.setAttribute('required', '') : el.removeAttribute('required');
    args.validation ? el.setAttribute('validation', '') : el.removeAttribute('validation');
    args.error ? el.setAttribute('error', '') : el.removeAttribute('error');
    args.disabled ? el.setAttribute('disabled', '') : el.removeAttribute('disabled');
    args.devMode ? el.setAttribute('dev-mode', '') : el.removeAttribute('dev-mode');
    args.removeClearBtn ? el.setAttribute('remove-clear-btn', '') : el.removeAttribute('remove-clear-btn');

    setOptionsWhenReady(el, Array.isArray(args.options) && args.options.length ? args.options : DEFAULT_OPTIONS);
    setAutoSortWhenReady(el, args.autoSort);
    setValueWhenReady(el, args.value);

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

    const applyValue = next => {
      const v = typeof next === 'string' ? next : '';
      // always update component UI
      setValueWhenReady(el, v);
      // try to sync Storybook args
      updateArgsBestEffort(ctx, { value: v });
    };

    btnApple.addEventListener('click', () => applyValue('Apple'));
    btnMango.addEventListener('click', () => applyValue('Mango'));
    btnClear.addEventListener('click', () => applyValue(''));

    // reflect emitted changes back into args (Canvas)
    el.addEventListener('valueChange', e => applyValue(String(e?.detail ?? '')));
    el.addEventListener('change', e => {
      const next = e?.detail?.value;
      if (next !== undefined) applyValue(String(next));
    });

    wrap.appendChild(el);
    wrap.appendChild(buttons);
    return wrap;
  },
};
ControlledValue.storyName = 'Controlled Value (args.value)';
ControlledValue.parameters = {
  docs: {
    description: {
      story: 'Demonstrates the `value` prop as the external source of truth.',
    },
    story: { height: '380px' },
  },
};

export const FieldValidation = {
  args: {
    validation: true,
    validationMessage: 'This field is required.',
    required: true,
  },
};
FieldValidation.storyName = 'Field Validation';
FieldValidation.parameters = {
  docs: {
    description: { story: 'Shows external validation state + validation message.' },
    story: { height: '300px' },
  },
};

export const Disabled = {
  args: {
    disabled: true,
    value: 'Banana',
    placeholder: '',
    validationMessage: '',
  },
};
Disabled.storyName = 'Disabled';
Disabled.parameters = {
  docs: { description: { story: 'Disabled state example (with a preset value).' } },
};
