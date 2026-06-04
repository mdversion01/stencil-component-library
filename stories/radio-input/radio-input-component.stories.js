// src/stories/radio-input-component.stories.js

import RadioInputDocs from './radio-input-component.docs.mdx';
import {
  normalize,
  buildDocsHtml,
  SingleTemplate,
  GroupTemplate,
  getSnapshot,
} from './radio-input-component.story-helpers';

const LABEL_SIZE_VARIANTS = [
  { key: 'sm', label: 'Small', size: 'sm' },
  { key: 'default', label: 'Default', size: '' },
  { key: 'lg', label: 'Large', size: 'lg' },
];

const defaultArgs = {
  basicRadio: false,
  bsRadio: false,
  basicRadioGroup: false,
  bsRadioGroup: false,

  inputId: '',
  labelTxt: '',
  value: '',

  name: '',
  size: '',
  disabled: false,
  required: false,

  groupTitle: '',
  groupTitleSize: '',
  inline: false,

  validation: false,
  validationMsg: '',

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',

  groupOptions: '[]',
};

const groupPlay = async ({ canvasElement, args }) => {
  const el = canvasElement.querySelector('radio-input-component');
  if (el) {
    el.addEventListener('groupChange', e => args.groupChange?.(e.detail));
  }
};

export default {
  title: 'Form/Radio Input',
  tags: ['autodocs'],

  args: defaultArgs,

  parameters: {
    docs: {
      page: RadioInputDocs,
      description: {
        component:
          'A Bootstrap radio or basic radio input component that supports both single and grouped radios with various styling options. Includes radiogroup semantics and validation ARIA wiring.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  argTypes: {
    groupChange: {
      action: 'groupChange',
      name: 'group-change',
      table: { category: 'Events', disable: true },
      control: false,
      description: 'Emitted when a radio in the group is selected (group mode). Detail contains the selected value.',
    },

    groupOptions: {
      control: 'text',
      name: 'group-options',
      table: { category: 'Group Attributes' },
      description:
        'JSON string for group options: [{"inputId":"x","value":"y","labelTxt":"Label","checked":true,"disabled":false}]',
    },
    groupTitle: {
      control: 'text',
      name: 'group-title',
      table: { category: 'Group Attributes' },
      description: 'Title for the radio group.',
    },
    groupTitleSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'group-title-size',
      table: { category: 'Group Attributes' },
      description: 'Size class for the radio group title.',
    },

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
    disabled: {
      control: 'boolean',
      table: { category: 'Input Attributes', defaultValue: { summary: false } },
      description: 'Disables the input element.',
    },
    inputId: {
      control: 'text',
      name: 'input-id',
      table: { category: 'Input Attributes' },
      description: 'ID for the input element (single radio).',
    },
    labelTxt: {
      control: 'text',
      name: 'label-txt',
      table: { category: 'Input Attributes' },
      description: 'Label text for the input element.',
    },
    name: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Name attribute for the input element.',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Input Attributes' },
      description: 'Label size class applied to the label element.',
    },
    value: {
      control: 'text',
      table: { category: 'Input Attributes' },
      description: 'Value attribute for the input element.',
    },

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

    inline: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Display radio buttons inline (group mode).',
    },

    required: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Marks the input as required.',
    },
    validation: {
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: false } },
      description: 'Enables validation logic and ARIA wiring.',
    },
    validationMsg: {
      control: 'text',
      name: 'validation-msg',
      table: { category: 'Validation' },
      description: 'Validation message shown when invalid.',
    },
  },
};

export const SingleBasic = {
  name: 'Single (Bootstrap styling)',
  render: args => SingleTemplate(args),
  args: {
    bsRadio: true,
    basicRadio: false,
    bsRadioGroup: false,
    basicRadioGroup: false,

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

    groupTitle: '',
    groupTitleSize: '',
    inline: false,
    groupOptions: '[]',
  },
  parameters: {
    docs: { description: { story: 'A single radio input with Bootstrap styling.' } },
  },
};

export const SingleRequiredInvalid = {
  name: 'Single Required with Validation (Bootstrap styling)',
  render: args => SingleTemplate(args),
  args: {
    bsRadio: true,
    basicRadio: false,
    bsRadioGroup: false,
    basicRadioGroup: false,

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

    groupTitle: '',
    groupTitleSize: '',
    inline: false,
    groupOptions: '[]',
  },
  parameters: {
    docs: { description: { story: 'A single required radio input with validation enabled.' } },
  },
};

export const SingleBasicStyled = {
  name: 'Single (Basic styling)',
  render: args => SingleTemplate(args),
  args: {
    basicRadio: true,
    bsRadio: false,
    bsRadioGroup: false,
    basicRadioGroup: false,

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

    groupTitle: '',
    groupTitleSize: '',
    inline: false,
    groupOptions: '[]',
  },
  parameters: {
    docs: { description: { story: 'A single radio input with basic styling.' } },
  },
};

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
    basicRadioGroup: false,
    bsRadioGroup: false,

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

    groupTitle: '',
    groupTitleSize: '',
    inline: false,
    groupOptions: '[]',
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

export const GroupBasic = {
  name: 'Group (Bootstrap styling)',
  render: args => GroupTemplate(args),
  args: {
    bsRadioGroup: true,
    basicRadioGroup: false,
    bsRadio: false,
    basicRadio: false,

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

    groupOptions: JSON.stringify(
      [
        { inputId: 'color-red', value: 'red', labelTxt: 'Red', checked: true },
        { inputId: 'color-green', value: 'green', labelTxt: 'Green' },
        { inputId: 'color-blue', value: 'blue', labelTxt: 'Blue' },
      ],
      null,
      0,
    ),

    inputId: '',
    labelTxt: '',
    value: '',
    size: '',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: 'A group of radio inputs with Bootstrap styling.' } },
  },
  play: groupPlay,
};

export const GroupInline = {
  name: 'Group Inline (Bootstrap styling)',
  render: args => GroupTemplate(args),
  args: {
    bsRadioGroup: true,
    basicRadioGroup: false,
    bsRadio: false,
    basicRadio: false,

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

    groupOptions: JSON.stringify(
      [
        { inputId: 'sz-s', value: 'S', labelTxt: 'Small' },
        { inputId: 'sz-m', value: 'M', labelTxt: 'Medium', checked: true },
        { inputId: 'sz-l', value: 'L', labelTxt: 'Large' },
      ],
      null,
      0,
    ),

    inputId: '',
    labelTxt: '',
    value: '',
    size: '',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: 'A group of inline radio inputs with Bootstrap styling.' } },
  },
  play: groupPlay,
};

export const GroupBasicStyled = {
  name: 'Group (Basic styling)',
  render: args => GroupTemplate(args),
  args: {
    basicRadioGroup: true,
    bsRadioGroup: false,
    bsRadio: false,
    basicRadio: false,

    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',

    name: 'delivery',
    groupTitle: 'Delivery Method',
    groupTitleSize: 'h6',
    inline: false,
    required: false,
    validation: false,
    validationMsg: '',

    groupOptions: JSON.stringify(
      [
        { inputId: 'del-standard', value: 'standard', labelTxt: 'Standard (3–5 days)', checked: true },
        { inputId: 'del-express', value: 'express', labelTxt: 'Express (1–2 days)' },
      ],
      null,
      0,
    ),

    inputId: '',
    labelTxt: '',
    value: '',
    size: '',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: 'A group of radio inputs with Basic styling.' } },
  },
  play: groupPlay,
};

export const GroupWithValidation = {
  name: 'Group with Validation (Bootstrap styling)',
  render: args => GroupTemplate(args),
  args: {
    bsRadioGroup: true,
    basicRadioGroup: false,
    bsRadio: false,
    basicRadio: false,

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

    groupOptions: JSON.stringify(
      [
        { inputId: 'ct-email', value: 'email', labelTxt: 'Email' },
        { inputId: 'ct-sms', value: 'sms', labelTxt: 'SMS' },
        { inputId: 'ct-call', value: 'call', labelTxt: 'Phone Call' },
      ],
      null,
      0,
    ),

    inputId: '',
    labelTxt: '',
    value: '',
    size: '',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: 'A group of radio inputs with validation (Bootstrap styling).' } },
  },
  play: groupPlay,
};

export const GroupDisabledOptions = {
  name: 'Group with Disabled Options (Bootstrap styling)',
  render: args => GroupTemplate(args),
  args: {
    bsRadioGroup: true,
    basicRadioGroup: false,
    bsRadio: false,
    basicRadio: false,

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

    groupOptions: JSON.stringify(
      [
        { inputId: 'seat-window', value: 'window', labelTxt: 'Window', disabled: true },
        { inputId: 'seat-middle', value: 'middle', labelTxt: 'Middle' },
        { inputId: 'seat-aisle', value: 'aisle', checked: true, disabled: true },
      ],
      null,
      0,
    ),

    inputId: '',
    labelTxt: '',
    value: '',
    size: '',
    disabled: false,
  },
  parameters: {
    docs: { description: { story: 'A group of radio inputs with some options disabled (Bootstrap styling).' } },
  },
  play: groupPlay,
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
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('radio-input-component');
          } catch (_e) {}
        }
        pre.textContent = JSON.stringify(getSnapshot(outer), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

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
        left.innerHTML =
          '<div style="font-weight:600">Horizontal label area</div><div style="opacity:.8; font-size:12px;">Simulates a horizontal form row.</div>';

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
