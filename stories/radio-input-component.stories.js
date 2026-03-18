// src/stories/radio-input-component.stories.js
// UPDATED: include aria-label / aria-labelledby / aria-describedby support in single + group templates + docs,
// and add Accessibility Matrix (computed) with default / inline / horizontal / validation / disabled.

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

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const serialize = (v) => {
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v ?? []);
  } catch {
    return '[]';
  }
};

const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${esc(v)}"`))
    .join('\n  ');

const groupOptionsAttrLine = (groupOptions) => {
  const json = serialize(groupOptions).replace(/'/g, '&#39;');
  return `group-options='${json}'`;
};

const buildDocsHtml = (args) => {
  const isGroup = !!(args.bsRadioGroup || args.basicRadioGroup);

  if (!isGroup) {
    return normalize(`
<radio-input-component
  ${attrLines([
    ['basic-radio', !!args.basicRadio],
    ['bs-radio', !!args.bsRadio && !args.basicRadio],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['disabled', !!args.disabled],
    ['input-id', args.inputId],
    ['label-txt', args.labelTxt],
    ['name', args.name],
    ['required', !!args.required],
    ['size', args.size],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
    ['value', args.value],
  ])}
></radio-input-component>
`);
  }

  return normalize(`
<radio-input-component
  ${attrLines([
    ['basic-radio-group', !!args.basicRadioGroup],
    ['bs-radio-group', !!args.bsRadioGroup && !args.basicRadioGroup],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['group-title', args.groupTitle],
    ['group-title-size', args.groupTitleSize],
    ['inline', !!args.inline],
    ['name', args.name],
    ['required', !!args.required],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
  ])}
  ${groupOptionsAttrLine(args.groupOptions)}
></radio-input-component>
`);
};

const SingleTemplate = (args) =>
  normalize(`
<radio-input-component
  ${attrLines([
    ['basic-radio', !!args.basicRadio],
    ['bs-radio', !!args.bsRadio && !args.basicRadio],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['disabled', !!args.disabled],
    ['input-id', args.inputId],
    ['label-txt', args.labelTxt],
    ['name', args.name],
    ['required', !!args.required],
    ['size', args.size],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
    ['value', args.value],
  ])}
></radio-input-component>
`);

const GroupTemplate = (args) =>
  normalize(`
<radio-input-component
  ${attrLines([
    ['basic-radio-group', !!args.basicRadioGroup],
    ['bs-radio-group', !!args.bsRadioGroup && !args.basicRadioGroup],

    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],

    ['group-title', args.groupTitle],
    ['group-title-size', args.groupTitleSize],
    ['inline', !!args.inline],
    ['name', args.name],
    ['required', !!args.required],
    ['validation', !!args.validation],
    ['validation-msg', args.validationMsg],
  ])}
  ${groupOptionsAttrLine(args.groupOptions)}
></radio-input-component>
`);

export default {
  title: 'Form/Radio Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A Bootstrap radio or basic radio input component that supports both single and grouped radios with various styling options. Includes radiogroup semantics and validation ARIA wiring.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  argTypes: {
    groupChange: {
      action: 'groupChange',
      name: 'group-change',
      table: { category: 'Events' },
      description: 'Emitted when a radio in the group is selected (group mode). Detail contains the selected value.',
    },

    /* Group Attributes */
    groupOptions: {
      control: 'object',
      name: 'group-options',
      table: { category: 'Group Attributes' },
      description: 'Array or JSON string of group options ({ inputId, value, labelTxt, checked, disabled }).',
    },
    groupTitle: { control: 'text', name: 'group-title', table: { category: 'Group Attributes' }, description: 'Title for the radio group.' },
    groupTitleSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg', 'h6'],
      name: 'group-title-size',
      table: { category: 'Group Attributes' },
      description: 'Size class for the radio group title.',
    },

    /* Input Attributes */
    basicRadio: {
      control: 'boolean',
      name: 'basic-radio',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Single radio input with basic styling.',
    },
    basicRadioGroup: {
      control: 'boolean',
      name: 'basic-radio-group',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Group of radio inputs with basic styling.',
    },
    bsRadio: {
      control: 'boolean',
      name: 'bs-radio',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Single Bootstrap radio input.',
    },
    bsRadioGroup: {
      control: 'boolean',
      name: 'bs-radio-group',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Group of Bootstrap radios.',
    },
    disabled: { control: 'boolean', table: { category: 'Input Attributes', defaultValue: { summary: false } }, description: 'Disables the input element.' },
    inputId: { control: 'text', name: 'input-id', table: { category: 'Input Attributes' }, description: 'ID for the input element (single radio).' },
    labelTxt: { control: 'text', name: 'label-txt', table: { category: 'Input Attributes' }, description: 'Label text for the input element.' },
    name: { control: 'text', table: { category: 'Input Attributes' }, description: 'Name attribute for the input element.' },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], table: { category: 'Input Attributes' }, description: 'Label size class applied to the label element.' },
    value: { control: 'text', table: { category: 'Input Attributes' }, description: 'Value attribute for the input element.' },

    /* Accessibility */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional ARIA label override (used when aria-labelledby is not provided / auto-wired).',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'Optional ARIA labelledby override (space-separated ids). Takes precedence over aria-label.',
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      table: { category: 'Accessibility' },
      description: 'Optional external description element id(s). Component also appends validation error id when invalid.',
    },

    /* Layout */
    inline: { control: 'boolean', table: { category: 'Layout', defaultValue: { summary: false } }, description: 'Display radio buttons inline (group mode).' },

    /* Validation */
    required: { control: 'boolean', table: { category: 'Validation', defaultValue: { summary: false } }, description: 'Marks the input as required.' },
    validation: { control: 'boolean', table: { category: 'Validation', defaultValue: { summary: false } }, description: 'Enables validation logic and ARIA wiring.' },
    validationMsg: { control: 'text', name: 'validation-msg', table: { category: 'Validation' }, description: 'Validation message shown when invalid.' },
  },
};

/* Stories (unchanged except templates now include aria-label/labelledby/describedby) */
export const SingleBasic = SingleTemplate.bind({});
SingleBasic.args = {
  bsRadio: true,
  basicRadio: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  inputId: 'r-basic',
  name: 'newsletter',
  labelTxt: 'Subscribe to newsletter',
  value: 'yes',
  required: false,
  disabled: false,
  size: '',
  validation: false,
  validationMsg: '',
};
SingleBasic.storyName = 'Single (Bootstrap styling)';
SingleBasic.parameters = {
  docs: { description: { story: 'A single radio input with Bootstrap styling.' } },
};

export const SingleRequiredInvalid = SingleTemplate.bind({});
SingleRequiredInvalid.args = {
  bsRadio: true,
  basicRadio: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  inputId: 'r-required',
  name: 'tos',
  labelTxt: 'I agree to Terms',
  value: 'agree',
  required: true,
  disabled: false,
  size: '',
  validation: true,
  validationMsg: 'You must agree before continuing.',
};
SingleRequiredInvalid.storyName = 'Single Required with Validation (Bootstrap styling)';
SingleRequiredInvalid.parameters = {
  docs: { description: { story: 'A single required radio input with validation enabled.' } },
};

// SINGLE — Basic style
export const SingleBasicStyled = SingleTemplate.bind({});
SingleBasicStyled.args = {
  basicRadio: true,
  bsRadio: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  inputId: 'r-basic-basic',
  name: 'marketing',
  labelTxt: 'Email me product updates',
  value: 'optin',
  required: false,
  disabled: false,
  size: '',
  validation: false,
  validationMsg: '',
};
SingleBasicStyled.storyName = 'Single (Basic styling)';
SingleBasicStyled.parameters = {
  docs: { description: { story: 'A single radio input with basic styling.' } },
};

const LABEL_SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm' },
  { key: 'default', label: 'Default', size: '' },
  { key: 'lg', label: 'Large', size: 'lg' },
];

export const LabelSizes = {
  name: 'Label Sizes (Basic + Bootstrap)',
  render: (args) => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '16px';
    container.style.maxWidth = '760px';

    const section = (title) => {
      const wrap = document.createElement('div');
      const h = document.createElement('div');
      h.textContent = title;
      h.style.fontWeight = '600';
      h.style.margin = '0 0 6px';
      wrap.appendChild(h);
      return wrap;
    };

    const mk = (storyArgs) => {
      const host = document.createElement('div');
      host.innerHTML = SingleTemplate(storyArgs);
      return host.firstElementChild;
    };

    const basicWrap = section('Basic radio (basic-radio)');
    const basicGrid = document.createElement('div');
    basicGrid.style.display = 'grid';
    basicGrid.style.gap = '10px';

    for (const v of LABEL_SIZE_VARIANTS) {
      basicGrid.appendChild(
        mk({
          ...args,
          basicRadio: true,
          bsRadio: false,
          inputId: `basic_${v.key}`,
          name: 'labelSizeBasic',
          labelTxt: `Basic — ${v.label}`,
          value: v.key,
          size: v.size,
        }),
      );
    }
    basicWrap.appendChild(basicGrid);

    const bsWrap = section('Bootstrap radio (bs-radio)');
    const bsGrid = document.createElement('div');
    bsGrid.style.display = 'grid';
    bsGrid.style.gap = '10px';

    for (const v of LABEL_SIZE_VARIANTS) {
      bsGrid.appendChild(
        mk({
          ...args,
          basicRadio: false,
          bsRadio: true,
          inputId: `bs_${v.key}`,
          name: 'labelSizeBs',
          labelTxt: `Bootstrap — ${v.label}`,
          value: v.key,
          size: v.size,
        }),
      );
    }
    bsWrap.appendChild(bsGrid);

    container.appendChild(basicWrap);
    container.appendChild(bsWrap);
    return container;
  },

  args: {
    basicRadio: false,
    bsRadio: false,

    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',

    disabled: false,
    required: false,
    validation: false,
    validationMsg: '',
    size: '',
    name: '',
    labelTxt: '',
    inputId: '',
    value: '',
  },

  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Shows label size variants (`sm`, default `""`, `lg`) for both Basic and Bootstrap radio styles.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) =>
          normalize(`
<div style="display:grid; gap:16px; max-width:760px;">
  <div>
    <div style="font-weight:600; margin:0 0 6px;">Basic radio (basic-radio)</div>
    <div style="display:grid; gap:10px;">
${LABEL_SIZE_VARIANTS.map((v) =>
  normalize(
    SingleTemplate({
      ...ctx.args,
      basicRadio: true,
      bsRadio: false,
      inputId: `basic_${v.key}`,
      name: 'labelSizeBasic',
      labelTxt: `Basic — ${v.label}`,
      value: v.key,
      size: v.size,
    }),
  )
    .split('\n')
    .map((line) => `      ${line}`)
    .join('\n'),
).join('\n')}
    </div>
  </div>

  <div>
    <div style="font-weight:600; margin:0 0 6px;">Bootstrap radio (bs-radio)</div>
    <div style="display:grid; gap:10px;">
${LABEL_SIZE_VARIANTS.map((v) =>
  normalize(
    SingleTemplate({
      ...ctx.args,
      basicRadio: false,
      bsRadio: true,
      inputId: `bs_${v.key}`,
      name: 'labelSizeBs',
      labelTxt: `Bootstrap — ${v.label}`,
      value: v.key,
      size: v.size,
    }),
  )
    .split('\n')
    .map((line) => `      ${line}`)
    .join('\n'),
).join('\n')}
    </div>
  </div>
</div>
          `),
      },
      story: { height: '340px' },
    },
  },
};

export const GroupBasic = GroupTemplate.bind({});
GroupBasic.args = {
  bsRadioGroup: true,
  basicRadioGroup: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  name: 'color',
  groupTitle: 'Favorite Color',
  groupTitleSize: 'h6',
  inline: false,
  required: false,
  validation: false,
  validationMsg: '',
  groupOptions: [
    { inputId: 'color-red', value: 'red', labelTxt: 'Red', checked: true },
    { inputId: 'color-green', value: 'green', labelTxt: 'Green' },
    { inputId: 'color-blue', value: 'blue', labelTxt: 'Blue' },
  ],
};
GroupBasic.storyName = 'Group (Bootstrap styling)';
GroupBasic.parameters = {
  docs: { description: { story: 'A group of radio inputs with Bootstrap styling.' } },
};

export const GroupInline = GroupTemplate.bind({});
GroupInline.args = {
  bsRadioGroup: true,
  basicRadioGroup: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  name: 'size',
  groupTitle: 'T-Shirt Size',
  groupTitleSize: '',
  inline: true,
  required: false,
  validation: false,
  validationMsg: '',
  groupOptions: [
    { inputId: 'sz-s', value: 'S', labelTxt: 'Small' },
    { inputId: 'sz-m', value: 'M', labelTxt: 'Medium', checked: true },
    { inputId: 'sz-l', value: 'L', labelTxt: 'Large' },
  ],
};
GroupInline.storyName = 'Group Inline (Bootstrap styling)';
GroupInline.parameters = {
  docs: { description: { story: 'A group of inline radio inputs with Bootstrap styling.' } },
};

// GROUP — Basic style
export const GroupBasicStyled = GroupTemplate.bind({});
GroupBasicStyled.args = {
  basicRadioGroup: true,
  bsRadioGroup: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  name: 'delivery',
  groupTitle: 'Delivery Method',
  groupTitleSize: 'h6',
  inline: false,
  groupOptions: [
    { inputId: 'del-standard', value: 'standard', labelTxt: 'Standard (3–5 days)', checked: true },
    { inputId: 'del-express', value: 'express', labelTxt: 'Express (1–2 days)' },
  ],
};
GroupBasicStyled.storyName = 'Group (Basic styling)';
GroupBasicStyled.parameters = {
  docs: { description: { story: 'A group of radio inputs with Basic styling.' } },
};

export const GroupWithValidation = GroupTemplate.bind({});
GroupWithValidation.args = {
  bsRadioGroup: true,
  basicRadioGroup: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  name: 'contact',
  groupTitle: 'Preferred Contact',
  groupTitleSize: '',
  inline: false,
  required: true,
  validation: true,
  validationMsg: 'Select one contact method.',
  groupOptions: [
    { inputId: 'ct-email', value: 'email', labelTxt: 'Email' },
    { inputId: 'ct-sms', value: 'sms', labelTxt: 'SMS' },
    { inputId: 'ct-call', value: 'call', labelTxt: 'Phone Call' },
  ],
};
GroupWithValidation.storyName = 'Group with Validation (Bootstrap styling)';
GroupWithValidation.parameters = {
  docs: { description: { story: 'A group of radio inputs with validation (Bootstrap styling).' } },
};

export const GroupDisabledOptions = GroupTemplate.bind({});
GroupDisabledOptions.args = {
  bsRadioGroup: true,
  basicRadioGroup: false,

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  name: 'seat',
  groupTitle: 'Seat Preference',
  groupTitleSize: '',
  inline: true,
  required: false,
  validation: false,
  validationMsg: '',
  groupOptions: [
    { inputId: 'seat-window', value: 'window', labelTxt: 'Window', disabled: true },
    { inputId: 'seat-middle', value: 'middle', labelTxt: 'Middle' },
    { inputId: 'seat-aisle', value: 'aisle', labelTxt: 'Aisle', checked: true },
  ],
};
GroupDisabledOptions.storyName = 'Group with Disabled Options (Bootstrap styling)';
GroupDisabledOptions.parameters = {
  docs: { description: { story: 'A group of radio inputs with some options disabled (Bootstrap styling).' } },
};

/* Optional: wire Storybook action to the custom event for docs demo */
GroupBasic.play = async ({ canvasElement, args }) => {
  const el = canvasElement.querySelector('radio-input-component');
  if (el) el.addEventListener('groupChange', (e) => args.groupChange?.(e.detail));
};
GroupInline.play = GroupBasic.play;
GroupBasicStyled.play = GroupBasic.play;
GroupWithValidation.play = GroupBasic.play;
GroupDisabledOptions.play = GroupBasic.play;

/* ============================== Accessibility Matrix (computed) ============================== */

const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

const getSnapshot = (hostOrOuter) => {
  const host = hostOrOuter?.querySelector?.('radio-input-component') || hostOrOuter;
  const group = host?.querySelector?.('[role="radiogroup"]') || null;
  const isGroup = !!group;

  const resolveInOuter = (id) => {
    if (!id) return false;
    // ids generated here are safe tokens, but external ids may include hyphens etc.
    try {
      return !!hostOrOuter?.querySelector?.(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  if (!isGroup) {
    const input = host?.querySelector?.('input[type="radio"]') || null;
    const label = host?.querySelector?.('label') || null;
    const error = host?.querySelector?.('.invalid-feedback') || null;

    const describedby = (input?.getAttribute?.('aria-describedby') || '').trim();
    const describedIds = splitIds(describedby);
    const labelledby = (input?.getAttribute?.('aria-labelledby') || '').trim();
    const labelledIds = splitIds(labelledby);

    return {
      mode: 'single',
      host: host?.tagName?.toLowerCase?.() ?? null,
      inputId: input?.getAttribute?.('id') ?? null,
      name: input?.getAttribute?.('name') ?? null,
      required: input?.hasAttribute?.('required') ?? null,
      disabled: input?.hasAttribute?.('disabled') ?? null,
      'aria-label': input?.getAttribute?.('aria-label') ?? null,
      'aria-labelledby': labelledby || null,
      'aria-describedby': describedby || null,
      'aria-invalid': input?.getAttribute?.('aria-invalid') ?? null,
      labelId: label?.getAttribute?.('id') ?? null,
      labelFor: label?.getAttribute?.('for') ?? label?.getAttribute?.('htmlfor') ?? null,
      errorId: error?.getAttribute?.('id') ?? null,
      errorRole: error?.getAttribute?.('role') ?? null,
      errorLive: error?.getAttribute?.('aria-live') ?? null,
      labelledbyIds: labelledIds,
      labelledbyAllResolve: labelledIds.every(resolveInOuter),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every(resolveInOuter),
    };
  }

  const titleEl = host?.querySelector?.('.group-title[id]') || null;
  const error = host?.querySelector?.('.invalid-feedback') || null;
  const radios = Array.from(host?.querySelectorAll?.('input[type="radio"]') || []);

  const describedby = (group?.getAttribute?.('aria-describedby') || '').trim();
  const describedIds = splitIds(describedby);
  const labelledby = (group?.getAttribute?.('aria-labelledby') || '').trim();
  const labelledIds = splitIds(labelledby);

  return {
    mode: 'group',
    host: host?.tagName?.toLowerCase?.() ?? null,
    role: group?.getAttribute?.('role') ?? null,
    'aria-label': group?.getAttribute?.('aria-label') ?? null,
    'aria-labelledby': labelledby || null,
    'aria-describedby': describedby || null,
    'aria-required': group?.getAttribute?.('aria-required') ?? null,
    'aria-invalid': group?.getAttribute?.('aria-invalid') ?? null,
    titleId: titleEl?.getAttribute?.('id') ?? null,
    errorId: error?.getAttribute?.('id') ?? null,
    errorRole: error?.getAttribute?.('role') ?? null,
    errorLive: error?.getAttribute?.('aria-live') ?? null,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolveInOuter),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolveInOuter),
    radios: radios.map((i) => ({
      id: i.getAttribute('id'),
      name: i.getAttribute('name'),
      checked: i.checked,
      disabled: i.disabled,
      'aria-invalid': i.getAttribute('aria-invalid'),
      'aria-describedby': i.getAttribute('aria-describedby'),
    })),
  };
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
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

    const card = (title, makeOuter) => {
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

      const outer = makeOuter();
      demo.appendChild(outer);

      const update = async () => {
        const host = outer.querySelector?.('radio-input-component') || outer;
        if (host?.componentOnReady) {
          try { await host.componentOnReady(); } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try { await customElements.whenDefined('radio-input-component'); } catch (_e) {}
        }
        pre.textContent = JSON.stringify(getSnapshot(outer), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    // Default (stacked group)
    wrap.appendChild(
      card('Default (group stacked)', () => {
        const el = document.createElement('radio-input-component');
        el.setAttribute('bs-radio-group', '');
        el.setAttribute('name', 'mxDefault');
        el.setAttribute('group-title', 'Default group');
        el.setAttribute(
          'group-options',
          JSON.stringify([
            { inputId: 'mx-d-a', value: 'a', labelTxt: 'Alpha', checked: true },
            { inputId: 'mx-d-b', value: 'b', labelTxt: 'Beta' },
          ]),
        );
        return el;
      }),
    );

    // Inline layout
    wrap.appendChild(
      card('Inline layout', () => {
        const el = document.createElement('radio-input-component');
        el.setAttribute('bs-radio-group', '');
        el.setAttribute('inline', '');
        el.setAttribute('name', 'mxInline');
        el.setAttribute('group-title', 'Inline group');
        el.setAttribute(
          'group-options',
          JSON.stringify([
            { inputId: 'mx-i-s', value: 'S', labelTxt: 'Small' },
            { inputId: 'mx-i-m', value: 'M', labelTxt: 'Medium', checked: true },
            { inputId: 'mx-i-l', value: 'L', labelTxt: 'Large' },
          ]),
        );
        return el;
      }),
    );

    // Horizontal (simulated): grid layout wrapper around a group
    wrap.appendChild(
      card('Horizontal layout (simulated)', () => {
        const outer = document.createElement('div');
        outer.style.display = 'grid';
        outer.style.gridTemplateColumns = '220px 1fr';
        outer.style.gap = '12px';
        outer.style.alignItems = 'start';
        outer.style.maxWidth = '780px';

        const left = document.createElement('div');
        left.id = 'mx-horizontal-label';
        left.innerHTML = `<div style="font-weight:600">Horizontal label area</div><div style="opacity:.8; font-size:12px;">Simulates a horizontal form row.</div>`;

        const el = document.createElement('radio-input-component');
        el.setAttribute('bs-radio-group', '');
        el.setAttribute('name', 'mxHorizontal');
        el.setAttribute('aria-labelledby', 'mx-horizontal-label');
        el.setAttribute(
          'group-options',
          JSON.stringify([
            { inputId: 'mx-h-1', value: '1', labelTxt: 'One', checked: true },
            { inputId: 'mx-h-2', value: '2', labelTxt: 'Two' },
          ]),
        );

        outer.appendChild(left);
        outer.appendChild(el);
        return outer;
      }),
    );

    // Error / validation
    wrap.appendChild(
      card('Error / validation (required + invalid)', () => {
        const el = document.createElement('radio-input-component');
        el.setAttribute('bs-radio-group', '');
        el.setAttribute('name', 'mxValidation');
        el.setAttribute('group-title', 'Validation');
        el.setAttribute('required', '');
        el.setAttribute('validation', '');
        el.setAttribute('validation-msg', 'Select one');
        el.setAttribute(
          'group-options',
          JSON.stringify([
            { inputId: 'mx-v-a', value: 'a', labelTxt: 'Alpha' },
            { inputId: 'mx-v-b', value: 'b', labelTxt: 'Beta' },
          ]),
        );
        return el;
      }),
    );

    // Disabled
    wrap.appendChild(
      card('Disabled (single disabled)', () => {
        const el = document.createElement('radio-input-component');
        el.setAttribute('bs-radio', '');
        el.setAttribute('input-id', 'mx-disabled');
        el.setAttribute('name', 'mxDisabled');
        el.setAttribute('label-txt', 'Disabled option');
        el.setAttribute('disabled', '');
        el.setAttribute('value', 'x');
        return el;
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for radios. Covers group default/inline/horizontal (simulated), validation, and disabled states: `role="radiogroup"`, `aria-labelledby`, `aria-describedby`, `aria-required`, `aria-invalid`, and generated title/error ids.',
      },
      source: {
        language: 'html',
        transform: () =>
          normalize(`
<!-- Accessibility Matrix renders multiple live variants and prints computed aria-* in a JSON block. -->
<!-- Use the story to inspect output. -->
          `),
      },
    },
  },
};
