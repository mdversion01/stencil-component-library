// stories/checkbox-component.stories.js
import { action } from '@storybook/addon-actions';

// ======================================================
// Helpers (normalize + docs HTML builder)
// ======================================================

/** Collapse blank lines + trim edges */
const normalize = (txt) => {
  const lines = String(txt || '')
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

/** Build clean attribute block (skips undefined/null/''/false; boolean true -> attribute only) */
const attrs = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replaceAll('"', '&quot;')}"`))
    .join('\n  ');

/** Pretty JSON for docs (multi-line, stable-ish) */
const prettyJson = (v) => {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return '[]';
  }
};

/**
 * Build the docs preview HTML for the "Source" panel.
 * Note: groupOptions is assigned as a PROPERTY (array), not an HTML attribute, for reliability.
 */
const buildDocsHtml = (args) => {
  const isGroup = !!args.checkboxGroup || !!args.customCheckboxGroup;

  const effectiveGroupTitle = args.groupTitle || args.labelTxt || '';

  const attributeBlock = attrs([
    // mode flags
    ['custom-checkbox', !!args.customCheckbox],
    ['checkbox-group', !!args.checkboxGroup],
    ['custom-checkbox-group', !!args.customCheckboxGroup],

    // common
    ['input-id', args.inputId],
    ['name', args.name],
    ['label-txt', args.labelTxt],
    ['value', args.value],
    ['size', args.size],
    ['inline', !!args.inline],
    ['required', !!args.required],
    ['disabled', !!args.disabled],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],

    // single-specific (prop is "checked")
    ['checked', !isGroup ? !!args.checked : false],

    // group-specific
    ['group-title', isGroup ? effectiveGroupTitle : ''],
    ['group-title-size', isGroup ? args.groupTitleSize : ''],
  ]);

  const groupOptions =
    Array.isArray(args.groupOptions)
      ? args.groupOptions
      : (() => {
          try {
            return JSON.parse(args.groupOptions || '[]');
          } catch {
            return [];
          }
        })();

  const groupOptionsJs = isGroup
    ? normalize(`
<script>
  // groupOptions is assigned as a PROPERTY (array), not an HTML attribute
  const groupOptions = ${prettyJson(groupOptions)};
</script>
`)
    : '';

  return normalize(`
<checkbox-component
  ${attributeBlock}
></checkbox-component>
${groupOptionsJs}
`);
};

// ======================================================
// Runtime helpers
// ======================================================

const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const toArrayOptions = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const buildEl = (args) => {
  const el = document.createElement('checkbox-component');

  // Mode flags (NOTE: component no longer has a "checkbox" prop; default path is single checkbox)
  el.customCheckbox = !!args.customCheckbox;
  el.checkboxGroup = !!args.checkboxGroup;
  el.customCheckboxGroup = !!args.customCheckboxGroup;

  // Common props
  el.inputId = args.inputId || '';
  el.name = args.name || '';
  el.labelTxt = args.labelTxt || '';
  el.value = args.value || '';
  el.size = args.size || '';
  el.inline = !!args.inline;
  el.required = !!args.required;
  el.disabled = !!args.disabled;
  el.validation = !!args.validation;
  el.validationMsg = args.validationMsg || '';

  // Single
  el.checked = !!args.checked;

  // Group
  el.groupTitle = args.groupTitle || '';
  el.groupTitleSize = args.groupTitleSize || '';
  el.groupOptions = toArrayOptions(args.groupOptions);

  // Also set attributes for docs parity (kebab-case)
  setAttr(el, 'custom-checkbox', !!args.customCheckbox);
  setAttr(el, 'checkbox-group', !!args.checkboxGroup);
  setAttr(el, 'custom-checkbox-group', !!args.customCheckboxGroup);

  setAttr(el, 'input-id', args.inputId);
  setAttr(el, 'name', args.name);
  setAttr(el, 'label-txt', args.labelTxt);
  setAttr(el, 'value', args.value);
  setAttr(el, 'size', args.size);
  setAttr(el, 'inline', !!args.inline);
  setAttr(el, 'required', !!args.required);
  setAttr(el, 'disabled', !!args.disabled);
  setAttr(el, 'validation', !!args.validation);
  setAttr(el, 'validation-msg', args.validationMsg);
  setAttr(el, 'checked', !!args.checked);
  setAttr(el, 'group-title', args.groupTitle);
  setAttr(el, 'group-title-size', args.groupTitleSize);

  // Events -> SB Actions
  el.addEventListener('groupChange', (e) => action('groupChange')(e.detail));
  el.addEventListener('toggle', (e) => action('toggle')(e.detail));
  el.addEventListener('change', (e) => action('change')(e?.detail));

  return el;
};

const Template = (args) => buildEl(args);

// ======================================================
// Default export
// ======================================================

export default {
  title: 'Form/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: ['Checkbox component for single or multiple selections with optional custom styles.', ''].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    /* =========================
     * Modes
     * ========================= */
    checkboxGroup: {
      control: 'boolean',
      name: 'checkbox-group',
      table: { category: 'Modes', defaultValue: { summary: false } },
      description: 'Render a group of checkboxes.',
    },
    customCheckboxGroup: {
      control: 'boolean',
      name: 'custom-checkbox-group',
      table: { category: 'Modes', defaultValue: { summary: false } },
      description: 'Render a group with custom styles.',
    },
    customCheckbox: {
      control: 'boolean',
      name: 'custom-checkbox',
      table: { category: 'Modes', defaultValue: { summary: false } },
      description: 'Render a single checkbox with custom styles.',
    },

    /* =========================
     * Group Attributes
     * ========================= */
    groupOptions: {
      control: 'object',
      name: 'group-options',
      table: { category: 'Group Attributes' },
      description: 'Array of { inputId, value, labelTxt, disabled?, checked? } (assigned as a PROPERTY).',
    },
    groupTitle: {
      control: 'text',
      name: 'group-title',
      table: { category: 'Group Attributes' },
      description: 'Title for the checkbox group.',
    },
    groupTitleSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'group-title-size',
      table: { category: 'Group Attributes' },
      description: 'Size modifier for the group title.',
    },

    /* =========================
     * Input Attributes
     * ========================= */
    checked: {
      control: 'boolean',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Whether the single checkbox is checked.',
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Whether the checkbox (single) is disabled.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes' },
      description: 'ID for the single input (and id for toggle event).',
    },
    labelTxt: {
      control: 'text',
      name: 'label-txt',
      table: { category: 'Input Attributes' },
      description: 'Label text for single checkbox. For groups, labels come from groupOptions.',
    },
    name: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Name attribute for the input(s).',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Input Attributes' },
      description: 'Size modifier class applied to inputs/labels.',
    },
    value: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Value attribute for single checkbox and emitted in toggle event.',
    },

    /* =========================
     * Layout
     * ========================= */
    inline: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Whether to display group checkboxes inline.',
    },

    /* =========================
     * Validation
     * ========================= */
    required: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the checkbox as required.',
    },
    validation: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Turns on validation styling/logic (shows message when required + not satisfied).',
    },
    validationMsg: {
      control: 'text',
      name: 'validation-msg',
      table: { category: 'Validation' },
      description: 'Validation message to display when invalid.',
    },
  },

  args: {
    // modes
    checkboxGroup: false,
    customCheckbox: false,
    customCheckboxGroup: false,

    // common
    inputId: 'agree-1',
    labelTxt: 'I agree to the terms',
    name: 'agree',
    value: 'agree',
    size: '',
    inline: false,

    // state
    checked: false,
    disabled: false,

    // validation
    required: false,
    validation: false,
    validationMsg: '',

    // group
    groupTitle: 'Pick one or more',
    groupTitleSize: '',
    groupOptions: [
      { inputId: 'opt-1', value: 'alpha', labelTxt: 'Alpha' },
      { inputId: 'opt-2', value: 'beta', labelTxt: 'Beta' },
      { inputId: 'opt-3', value: 'gamma', labelTxt: 'Gamma', disabled: false },
    ],
  },

  render: (args) => Template(args),
};

// ===== Stories =====

export const SingleBasic = Template.bind({});
SingleBasic.args = {
  customCheckbox: false,
  checkboxGroup: false,
  customCheckboxGroup: false,
  inputId: 'agree-1',
  labelTxt: 'I agree to the terms',
  value: 'agree',
  size: 'lg',
};
SingleBasic.storyName = 'Single Checkbox';
SingleBasic.parameters = {
  docs: { description: { story: 'A single checkbox with default styling.' } },
};

export const SingleRequired = Template.bind({});
SingleRequired.args = {
  required: true,
  validation: true,
  validationMsg: 'Please agree before continuing.',
};
SingleRequired.storyName = 'Single Required';
SingleRequired.parameters = {
  docs: { description: { story: 'A single checkbox that is required and includes validation.' } },
};

export const SingleCustom = Template.bind({});
SingleCustom.args = {
  customCheckbox: true,
  inputId: 'custom-1',
  labelTxt: 'Custom styled checkbox',
  size: 'lg',
};
SingleCustom.storyName = 'Single Custom';
SingleCustom.parameters = {
  docs: { description: { story: 'A single checkbox with custom styling.' } },
};

export const GroupInline = Template.bind({});
GroupInline.args = {
  checkboxGroup: true,
  customCheckbox: false,
  customCheckboxGroup: false,
  name: 'flavors',
  inline: true,
  groupTitle: 'Flavors (inline)',
  groupOptions: [
    { inputId: 'fl-1', value: 'vanilla', labelTxt: 'Vanilla' },
    { inputId: 'fl-2', value: 'chocolate', labelTxt: 'Chocolate', checked: true },
    { inputId: 'fl-3', value: 'strawberry', labelTxt: 'Strawberry', disabled: false },
  ],
};
GroupInline.storyName = 'Group Inline Layout';
GroupInline.parameters = {
  docs: { description: { story: 'A group of checkboxes displayed inline.' } },
};

export const GroupCustomStyled = Template.bind({});
GroupCustomStyled.args = {
  checkboxGroup: false,
  customCheckboxGroup: true,
  name: 'letters',
  groupTitle: 'Custom group',
  groupTitleSize: '',
  size: 'lg',
  groupOptions: [
    { inputId: 'cg-1', value: 'A', labelTxt: 'Option A' },
    { inputId: 'cg-2', value: 'B', labelTxt: 'Option B', checked: true },
    { inputId: 'cg-3', value: 'C', labelTxt: 'Option C' },
  ],
};
GroupCustomStyled.storyName = 'Group with Custom Styling';
GroupCustomStyled.parameters = {
  docs: { description: { story: 'A group of checkboxes with custom styling.' } },
};

export const GroupWithValidation = Template.bind({});
GroupWithValidation.args = {
  checkboxGroup: true,
  name: 'features',
  required: true,
  validation: true,
  validationMsg: 'Select at least one option.',
  groupTitle: 'Required group',
  size: 'lg',
  groupOptions: [
    { inputId: 'ft-1', value: 'sync', labelTxt: 'Sync' },
    { inputId: 'ft-2', value: 'backup', labelTxt: 'Backup' },
    { inputId: 'ft-3', value: 'share', labelTxt: 'Share' },
  ],
};
GroupWithValidation.storyName = 'Group with Validation';
GroupWithValidation.parameters = {
  docs: { description: { story: 'A group of checkboxes that is required and includes validation.' } },
};

export const SingleDisabled = Template.bind({});
SingleDisabled.args = {
  disabled: true,
  inputId: 'disabled-1',
  labelTxt: 'Disabled checkbox',
  value: 'disabled',
};
SingleDisabled.storyName = 'Single Disabled Checkbox';
SingleDisabled.parameters = {
  docs: { description: { story: 'A single checkbox that is disabled.' } },
};

export const GroupDisabledOptions = Template.bind({});
GroupDisabledOptions.args = {
  checkboxGroup: true,
  name: 'seating',
  groupTitle: 'Seating Preferences',
  groupOptions: [
    { inputId: 'seat-window', value: 'window', labelTxt: 'Window' },
    { inputId: 'seat-middle', value: 'middle', labelTxt: 'Middle', disabled: true },
    { inputId: 'seat-aisle', value: 'aisle', labelTxt: 'Aisle' },
  ],
};
GroupDisabledOptions.storyName = 'Group with Disabled Options';
GroupDisabledOptions.parameters = {
  docs: { description: { story: 'A group of checkboxes with some options disabled.' } },
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
    title.innerHTML =
      `<strong>Accessibility matrix</strong>` +
      `<div style="opacity:.8">Default vs group inline. Validation + disabled. Prints computed ids and aria-* (fieldset/legend when group, label/for when single).</div>`;
    wrap.appendChild(title);

    const card = (labelText, build) => {
      const c = document.createElement('div');
      c.style.display = 'grid';
      c.style.gridTemplateColumns = '320px 1fr';
      c.style.gap = '12px';
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
        const host = demo.querySelector('checkbox-component');

        const fieldset = host?.querySelector('fieldset.checkbox-group');
        const legend = host?.querySelector('legend.group-title');
        const groupInputs = host ? Array.from(host.querySelectorAll('input[type="checkbox"]')) : [];

        const singleInput = host?.querySelector('.form-check-input, .custom-control-input');
        const singleLabel = host?.querySelector('label');

        const invalidFeedback = host?.querySelector('.invalid-feedback');

        pre.textContent = JSON.stringify(
          {
            mode: fieldset ? 'group' : 'single',

            // group wiring
            fieldsetRole: fieldset?.getAttribute('role') ?? null,
            fieldsetAriaLabelledby: fieldset?.getAttribute('aria-labelledby') ?? null,
            fieldsetAriaDescribedby: fieldset?.getAttribute('aria-describedby') ?? null,
            fieldsetAriaInvalid: fieldset?.getAttribute('aria-invalid') ?? null,
            legendId: legend?.getAttribute('id') ?? null,
            legendText: legend?.textContent?.trim() ?? null,

            // single wiring
            inputId: singleInput?.getAttribute('id') ?? null,
            inputName: singleInput?.getAttribute('name') ?? null,
            labelFor: singleLabel?.getAttribute('for') || singleLabel?.getAttribute('htmlfor') || (singleLabel ? singleLabel.htmlFor : null) || null,
            labelText: singleLabel?.textContent?.trim() ?? null,

            // state
            disabledAttr: singleInput?.hasAttribute('disabled') ?? null,
            requiredAttr: singleInput?.hasAttribute('required') ?? null,

            // group option summary
            options: groupInputs.map((i) => ({
              id: i.getAttribute('id'),
              name: i.getAttribute('name'),
              checked: (i).checked,
              disabled: i.hasAttribute('disabled'),
              // component intentionally avoids aria-checked/aria-disabled on native checkboxes
              ariaChecked: i.getAttribute('aria-checked'),
              ariaDisabled: i.getAttribute('aria-disabled'),
              ariaInvalid: i.getAttribute('aria-invalid'),
              ariaDescribedby: i.getAttribute('aria-describedby'),
            })),

            // validation block
            invalidId: invalidFeedback?.getAttribute('id') ?? null,
            invalidText: invalidFeedback?.textContent?.trim() ?? null,
          },
          null,
          2,
        );
      };

      queueMicrotask(() => requestAnimationFrame(snapshot));
      return c;
    };

    // Default single
    wrap.appendChild(
      card('Default (single)', () =>
        Template({
          ...args,
          checkboxGroup: false,
          customCheckboxGroup: false,
          customCheckbox: false,
          inputId: 'mx-single',
          name: 'mxSingle',
          labelTxt: 'Single checkbox',
          value: 'one',
          required: false,
          validation: false,
          disabled: false,
          checked: false,
        }),
      ),
    );

    // Group inline
    wrap.appendChild(
      card('Group (inline)', () =>
        Template({
          ...args,
          checkboxGroup: true,
          customCheckboxGroup: false,
          customCheckbox: false,
          inline: true,
          name: 'mxGroup',
          groupTitle: 'Group inline',
          groupOptions: [
            { inputId: 'mx-g-1', value: 'a', labelTxt: 'A' },
            { inputId: 'mx-g-2', value: 'b', labelTxt: 'B', checked: true },
          ],
          required: false,
          validation: false,
          disabled: false,
        }),
      ),
    );

    // Error/validation (group required with none checked)
    wrap.appendChild(
      card('Validation (group required, none checked)', () =>
        Template({
          ...args,
          checkboxGroup: true,
          name: 'mxReq',
          groupTitle: 'Required group',
          required: true,
          validation: true,
          validationMsg: 'Select at least one option.',
          groupOptions: [
            { inputId: 'mx-r-1', value: 'x', labelTxt: 'X', checked: false },
            { inputId: 'mx-r-2', value: 'y', labelTxt: 'Y', checked: false },
          ],
        }),
      ),
    );

    // Disabled (single)
    wrap.appendChild(
      card('Disabled (single)', () =>
        Template({
          ...args,
          checkboxGroup: false,
          customCheckboxGroup: false,
          customCheckbox: true,
          inputId: 'mx-disabled',
          name: 'mxDisabled',
          labelTxt: 'Disabled checkbox',
          value: 'd',
          disabled: true,
          checked: true,
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
          'Prints computed accessibility wiring: single input/label linkage and group fieldset/legend linkage, plus aria-invalid/describedby when validation is shown. Includes default, inline group, validation, and disabled examples.',
      },
    },
  },
};
