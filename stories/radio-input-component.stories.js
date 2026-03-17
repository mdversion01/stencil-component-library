// src/stories/radio-input-component.stories.js
// UPDATED: include aria-describedby support (ariaDescribedby prop) in single + group templates + docs

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
    basicRadio: { control: 'boolean', name: 'basic-radio', table: { category: 'Input Attributes', defaultValue: { summary: false } }, description: 'Single radio input with basic styling.' },
    basicRadioGroup: { control: 'boolean', name: 'basic-radio-group', table: { category: 'Input Attributes', defaultValue: { summary: false } }, description: 'Group of radio inputs with basic styling.' },
    bsRadio: { control: 'boolean', name: 'bs-radio', table: { category: 'Input Attributes', defaultValue: { summary: false } }, description: 'Single Bootstrap radio input.' },
    bsRadioGroup: { control: 'boolean', name: 'bs-radio-group', table: { category: 'Input Attributes', defaultValue: { summary: false } }, description: 'Group of Bootstrap radios.' },
    disabled: { control: 'boolean', table: { category: 'Input Attributes', defaultValue: { summary: false } }, description: 'Disables the input element.' },
    inputId: { control: 'text', name: 'input-id', table: { category: 'Input Attributes' }, description: 'ID for the input element (single radio).' },
    labelTxt: { control: 'text', name: 'label-txt', table: { category: 'Input Attributes' }, description: 'Label text for the input element.' },
    name: { control: 'text', table: { category: 'Input Attributes' }, description: 'Name attribute for the input element.' },
    size: { control: { type: 'select' }, options: ['', 'sm', 'lg'], table: { category: 'Input Attributes' }, description: 'Label size class applied to the label element.' },
    value: { control: 'text', table: { category: 'Input Attributes' }, description: 'Value attribute for the input element.' },

    /* Accessibility */
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

/* Stories (unchanged except templates now include aria-describedby) */
export const SingleBasic = SingleTemplate.bind({});
SingleBasic.args = {
  bsRadio: true,
  basicRadio: false,
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
  docs: {
    description: {
      story: 'A single radio input with Bootstrap styling.',
    },
  },
};

export const SingleRequiredInvalid = SingleTemplate.bind({});
SingleRequiredInvalid.args = {
  bsRadio: true,
  basicRadio: false,
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
  docs: {
    description: {
      story: 'A single required radio input with validation enabled.',
    },
  },
};

// SINGLE — Basic style
export const SingleBasicStyled = SingleTemplate.bind({});
SingleBasicStyled.args = {
  basicRadio: true,
  bsRadio: false,
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
  docs: {
    description: {
      story: 'A single radio input with basic styling.',
    },
  },
};

const LABEL_SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm' },
  { key: 'default', label: 'Default', size: '' },
  { key: 'lg', label: 'Large', size: 'lg' },
];

export const LabelSizes = {
  name: 'Label Sizes (Basic + Bootstrap)',
  render: args => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '16px';
    container.style.maxWidth = '760px';

    const section = title => {
      const wrap = document.createElement('div');
      const h = document.createElement('div');
      h.textContent = title;
      h.style.fontWeight = '600';
      h.style.margin = '0 0 6px';
      wrap.appendChild(h);
      return wrap;
    };

    const mk = storyArgs => {
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
${LABEL_SIZE_VARIANTS.map(v =>
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
    .map(line => `      ${line}`)
    .join('\n'),
).join('\n')}
    </div>
  </div>

  <div>
    <div style="font-weight:600; margin:0 0 6px;">Bootstrap radio (bs-radio)</div>
    <div style="display:grid; gap:10px;">
${LABEL_SIZE_VARIANTS.map(v =>
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
    .map(line => `      ${line}`)
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
  docs: {
    description: {
      story: 'A group of radio inputs with Bootstrap styling.',
    },
  },
};

export const GroupInline = GroupTemplate.bind({});
GroupInline.args = {
  bsRadioGroup: true,
  basicRadioGroup: false,
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
  docs: {
    description: {
      story: 'A group of inline radio inputs with Bootstrap styling.',
    },
  },
};

// GROUP — Basic style
export const GroupBasicStyled = GroupTemplate.bind({});
GroupBasicStyled.args = {
  basicRadioGroup: true,
  bsRadioGroup: false,
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
  docs: {
    description: {
      story: 'A group of radio inputs with Basic styling.',
    },
  },
};

export const GroupWithValidation = GroupTemplate.bind({});
GroupWithValidation.args = {
  bsRadioGroup: true,
  basicRadioGroup: false,
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
  docs: {
    description: {
      story: 'A group of radio inputs with validation (Bootstrap styling).',
    },
  },
};

export const GroupDisabledOptions = GroupTemplate.bind({});
GroupDisabledOptions.args = {
  bsRadioGroup: true,
  basicRadioGroup: false,
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
  docs: {
    description: {
      story: 'A group of radio inputs with some options disabled (Bootstrap styling).',
    },
  },
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

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML = `<strong>Accessibility matrix</strong><div style="opacity:.8">Shows computed <code>role</code>, <code>aria-*</code>, and generated ids (title/error) for single + group modes.</div>`;
    wrap.appendChild(title);

    const mkRow = (labelText, makeHost, pickAttrs) => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '260px 1fr';
      row.style.gap = '12px';
      row.style.alignItems = 'start';
      row.style.border = '1px solid #ddd';
      row.style.borderRadius = '8px';
      row.style.padding = '12px';

      const left = document.createElement('div');
      left.innerHTML = `<div style="font-weight:600">${labelText}</div>`;

      const right = document.createElement('div');
      right.style.display = 'grid';
      right.style.gap = '8px';

      const demo = document.createElement('div');
      demo.style.display = 'inline-flex';
      demo.style.alignItems = 'center';
      demo.style.gap = '12px';
      demo.style.flexWrap = 'wrap';

      const host = makeHost();
      demo.appendChild(host);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading computed attributes…';

      right.appendChild(demo);
      right.appendChild(pre);

      row.appendChild(left);
      row.appendChild(right);

      const update = () => {
        const attrs = pickAttrs(host);
        pre.textContent = JSON.stringify(attrs, null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));
      return row;
    };

    // Helpers to extract computed a11y
    const pickSingle = (host) => {
      const input = host.querySelector('input[type="radio"]');
      const label = host.querySelector('label');
      const error = host.querySelector('.invalid-feedback');
      return {
        mode: 'single',
        inputId: input?.getAttribute('id') ?? null,
        name: input?.getAttribute('name') ?? null,
        required: input?.hasAttribute('required') ?? null,
        disabled: input?.hasAttribute('disabled') ?? null,
        'aria-labelledby': input?.getAttribute('aria-labelledby') ?? null,
        'aria-describedby': input?.getAttribute('aria-describedby') ?? null,
        'aria-invalid': input?.getAttribute('aria-invalid') ?? null,
        labelId: label?.getAttribute('id') ?? null,
        errorId: error?.getAttribute('id') ?? null,
        errorRole: error?.getAttribute('role') ?? null,
        errorLive: error?.getAttribute('aria-live') ?? null,
      };
    };

    const pickGroup = (host) => {
      const group = host.querySelector('[role="radiogroup"]');
      const titleEl = host.querySelector('.group-title[id]');
      const error = host.querySelector('.invalid-feedback');
      const inputs = Array.from(host.querySelectorAll('input[type="radio"]'));
      return {
        mode: 'group',
        role: group?.getAttribute('role') ?? null,
        'aria-labelledby': group?.getAttribute('aria-labelledby') ?? null,
        'aria-describedby': group?.getAttribute('aria-describedby') ?? null,
        'aria-required': group?.getAttribute('aria-required') ?? null,
        'aria-invalid': group?.getAttribute('aria-invalid') ?? null,
        titleId: titleEl?.getAttribute('id') ?? null,
        errorId: error?.getAttribute('id') ?? null,
        errorRole: error?.getAttribute('role') ?? null,
        errorLive: error?.getAttribute('aria-live') ?? null,
        radios: inputs.map((i) => ({
          id: i.getAttribute('id'),
          name: i.getAttribute('name'),
          checked: i.checked,
          disabled: i.disabled,
          'aria-invalid': i.getAttribute('aria-invalid'),
          'aria-describedby': i.getAttribute('aria-describedby'),
        })),
      };
    };

    // Row 1: Single (text label -> aria-labelledby, not invalid)
    wrap.appendChild(
      mkRow(
        'Single (named, valid)',
        () => {
          const el = document.createElement('radio-input-component');
          el.setAttribute('bs-radio', '');
          el.setAttribute('input-id', 'r-matrix-single');
          el.setAttribute('name', 'matrixSingle');
          el.setAttribute('label-txt', 'Single option');
          el.setAttribute('value', 'yes');
          return el;
        },
        pickSingle,
      ),
    );

    // Row 2: Single required + validation -> invalid + error describedby
    wrap.appendChild(
      mkRow(
        'Single (required + invalid)',
        () => {
          const el = document.createElement('radio-input-component');
          el.setAttribute('bs-radio', '');
          el.setAttribute('input-id', 'r-matrix-single-req');
          el.setAttribute('name', 'matrixSingleReq');
          el.setAttribute('label-txt', 'Agree');
          el.setAttribute('required', '');
          el.setAttribute('validation', '');
          el.setAttribute('validation-msg', 'Required');
          return el;
        },
        pickSingle,
      ),
    );

    // Row 3: Group valid (has title, selected option)
    wrap.appendChild(
      mkRow(
        'Group (valid selection)',
        () => {
          const el = document.createElement('radio-input-component');
          el.setAttribute('bs-radio-group', '');
          el.setAttribute('name', 'matrixGroup');
          el.setAttribute('group-title', 'Choose one');
          el.setAttribute(
            'group-options',
            JSON.stringify([
              { inputId: 'mg-a', value: 'a', labelTxt: 'Alpha', checked: true },
              { inputId: 'mg-b', value: 'b', labelTxt: 'Beta' },
            ]),
          );
          return el;
        },
        pickGroup,
      ),
    );

    // Row 4: Group required + validation invalid (no selection)
    wrap.appendChild(
      mkRow(
        'Group (required + invalid)',
        () => {
          const el = document.createElement('radio-input-component');
          el.setAttribute('bs-radio-group', '');
          el.setAttribute('name', 'matrixGroupReq');
          el.setAttribute('group-title', 'Pick a value');
          el.setAttribute('required', '');
          el.setAttribute('validation', '');
          el.setAttribute('validation-msg', 'Please select one');
          el.setAttribute(
            'group-options',
            JSON.stringify([
              { inputId: 'mgr-x', value: 'x', labelTxt: 'X' },
              { inputId: 'mgr-y', value: 'y', labelTxt: 'Y' },
            ]),
          );
          return el;
        },
        pickGroup,
      ),
    );

    // Row 5: Group with external describedby + invalid (should include both ids)
    wrap.appendChild(
      mkRow(
        'Group (external describedby + invalid)',
        () => {
          const outer = document.createElement('div');
          outer.style.display = 'grid';
          outer.style.gap = '8px';

          const help = document.createElement('div');
          help.id = 'matrix-help';
          help.textContent = 'Help text: choose the best option.';
          outer.appendChild(help);

          const el = document.createElement('radio-input-component');
          el.setAttribute('bs-radio-group', '');
          el.setAttribute('name', 'matrixGroupHelp');
          el.setAttribute('group-title', 'With help text');
          el.setAttribute('aria-describedby', 'matrix-help');
          el.setAttribute('required', '');
          el.setAttribute('validation', '');
          el.setAttribute('validation-msg', 'Select one');
          el.setAttribute(
            'group-options',
            JSON.stringify([
              { inputId: 'mgh-1', value: '1', labelTxt: 'One' },
              { inputId: 'mgh-2', value: '2', labelTxt: 'Two' },
            ]),
          );
          outer.appendChild(el);

          return outer;
        },
        (outerHost) => {
          const innerHost = outerHost.querySelector('radio-input-component');
          return pickGroup(innerHost);
        },
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders multiple configurations and prints computed accessibility attributes for single + group radios: `role="radiogroup"`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, and generated title/error ids.',
      },
    },
  },
};
