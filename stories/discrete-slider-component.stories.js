export default {
  title: 'Components/Slider/Discrete Slider',
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A discrete slider component allowing selection from predefined string values.' } } },
  argTypes: {
    /* -----------------------------
   State
  ------------------------------ */
    disabled: {
      control: 'boolean',
      description: 'Disables the slider when true.',
      table: { category: 'State', defaultValue: { summary: false } },
    },

    /* -----------------------------
   Layout & Labeling
  ------------------------------ */
    label: {
      control: 'text',
      description: 'Label for the slider.',
      table: { category: 'Layout & Labeling' },
    },
    hideRightTextBox: {
      control: 'boolean',
      name: 'hide-right-text-box',
      description: 'Hides the right text box when true.',
      table: { category: 'Layout & Labeling', defaultValue: { summary: false } },
    },
    unit: {
      control: 'text',
      description: 'Unit to display with values.',
      table: { category: 'Layout & Labeling' },
    },

    /* -----------------------------
   Data & Selection
  ------------------------------ */
    selectedIndex: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'selected-index',
      description: 'Index of the selected value.',
      table: { category: 'Data & Selection' },
    },
    stringValues: {
      control: 'object',
      description: 'Array of string values for discrete sliders.',
      name: 'string-values',
      table: { category: 'Data & Selection' },
    },

    /* -----------------------------
   Ticks & Labels
  ------------------------------ */
    tickLabels: {
      control: 'boolean',
      name: 'tick-labels',
      description: 'Shows labels for tick marks when true.',
      table: { category: 'Ticks & Labels', defaultValue: { summary: false } },
    },

    /* -----------------------------
   Styling
  ------------------------------ */
    plumage: {
      control: 'boolean',
      description: 'Enables plumage style when true.',
      table: { category: 'Styling', defaultValue: { summary: false } },
    },
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      description: 'Visual variant of the slider.',
      table: { category: 'Styling' },
    },
  },
};

/* helpers */
const boolLine = (name, on) => (on ? ` ${name}` : '');
const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const serializeArray = val => {
  if (!val) return '';
  try {
    return JSON.stringify(val);
  } catch {
    return '';
  }
};

const normalizeHtml = html => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      out.push('');
      prevBlank = true;
      continue;
    }
    out.push(line);
    prevBlank = false;
  }

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

/* template */
const Template = args => {
  const attrs = [
    boolLine('disabled', args.disabled),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    attrLine('label', args.label),
    boolLine('plumage', args.plumage),
    attrLine('selected-index', args.selectedIndex),
    attrLine('string-values', serializeArray(args.stringValues)),
    boolLine('tick-labels', args.tickLabels),
    attrLine('unit', args.unit),
    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('');
  return normalizeHtml(`
  <div style="margin-top: 40px; margin-bottom: 40px;">
  <!-- div wrapper is for better appearance in Storybook -->
    <discrete-slider-component${attrs}>
    </discrete-slider-component>
  </div>
`);
};

/**
 * Apply “dynamic source” ONLY to Template-driven stories
 * so Docs Source stays in sync with Controls.
 */
const templateStoryParameters = {
  docs: {
    source: {
      type: 'dynamic',
      language: 'html',
      transform: (_code, ctx) => Template(ctx.args),
    },
  },
};

/* stories */
export const Basic = Template.bind({});
Basic.args = {
  disabled: false,
  hideRightTextBox: false,
  label: 'Rating',
  plumage: false,
  selectedIndex: 2,
  stringValues: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  tickLabels: true,
  unit: '',
  variant: 'primary',
};
Basic.parameters = {
  ...templateStoryParameters,
  docs: {
    description: {
      story: 'A basic discrete slider allowing selection from predefined string values.',
    },
  },
};

export const WithTickLabels = Template.bind({});
WithTickLabels.args = {
  ...Basic.args,
  label: 'Size',
  stringValues: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  selectedIndex: 3,
  tickLabels: true,
  variant: 'info',
};
WithTickLabels.parameters = {
  ...templateStoryParameters,
  docs: {
    description: {
      story: 'A discrete slider with tick labels enabled.',
    },
  },
};

export const PlumageStyle = Template.bind({});
PlumageStyle.args = {
  ...Basic.args,
  label: 'Priority',
  plumage: true,
  variant: 'primary',
  stringValues: ['Low', 'Normal', 'High', 'Critical'],
  selectedIndex: 1,
};
PlumageStyle.parameters = {
  ...templateStoryParameters,
  docs: {
    description: {
      story: 'A discrete slider with a plumage style applied.',
    },
  },
};

export const JSONAttributeValues = () => `
<discrete-slider-component
  label="Stages"
  selected-index="1"
  tick-labels
  string-values='["Backlog","In Progress","Review","Done"]'
></discrete-slider-component>
`;
JSONAttributeValues.parameters = {
  controls: { disable: true },
  docs: {
    source: {
      type: 'code',
      language: 'html',
      code: `
<discrete-slider-component
  label="Stages"
  selected-index="1"
  tick-labels
  string-values='["Backlog","In Progress","Review","Done"]'
></discrete-slider-component>
`.trim(),
    },
    description: {
      story: 'Demonstrates passing `string-values` as a JSON string attribute (plain HTML usage).',
    },
  },
};

export const LongList = Template.bind({});
LongList.args = {
  ...Basic.args,
  label: 'Months',
  variant: 'secondary',
  tickLabels: true,
  hideRightTextBox: false,
  stringValues: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  selectedIndex: 5,
  variant: 'success',
};
LongList.parameters = {
  ...templateStoryParameters,
  docs: {
    description: {
      story: 'A discrete slider with a longer list of string values.',
    },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  label: 'Disabled',
  disabled: true,
  variant: '',
  selectedIndex: 0,
};
Disabled.parameters = {
  ...templateStoryParameters,
  docs: {
    description: {
      story: 'A discrete slider that is disabled.',
    },
  },
};
