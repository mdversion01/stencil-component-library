// src/stories/slider-manager-component.stories.js

export default {
  title: 'Components/Slider/Slider Manager',
  tags: ['autodocs'],
  args: {
    disabled: false,
    hideLeftTextBox: false,
    hideRightTextBox: false,
    hideTextBoxes: false,

    label: 'Range',

    // range
    min: 0,
    max: 100,

    // basic
    value: 42,

    // multi
    lowerValue: 25,
    upperValue: 75,

    // discrete
    selectedIndex: 0,
    stringValues: ['XS', 'S', 'M', 'L', 'XL'],

    // ticks
    snapToTicks: false,
    tickLabels: false,
    tickValues: [],

    // misc
    plumage: false,
    sliderThumbLabel: false,
    unit: '',
    type: 'basic',
    variant: 'primary',
  },

  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
        language: 'html',
        // IMPORTANT: this keeps Source in sync with Controls
        transform: (_code, ctx) => Template(ctx.args),
      },
      description: {
        component: 'A slider manager component that can render basic, multi-range, or discrete sliders based on the provided type.',
      },
    },
  },

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
     Labeling
  ------------------------------ */
    label: {
      control: 'text',
      description: 'Label for the slider.',
      table: { category: 'Labeling' },
    },
    unit: {
      control: 'text',
      description: 'Unit to display alongside the slider values.',
      table: { category: 'Labeling' },
    },

    /* -----------------------------
     Text Boxes
  ------------------------------ */
    hideLeftTextBox: {
      control: 'boolean',
      name: 'hide-left-text-box',
      description: 'Hides the left text box when true.',
      table: { category: 'Text Boxes', defaultValue: { summary: false } },
    },
    hideRightTextBox: {
      control: 'boolean',
      name: 'hide-right-text-box',
      description: 'Hides the right text box when true.',
      table: { category: 'Text Boxes', defaultValue: { summary: false } },
    },
    hideTextBoxes: {
      control: 'boolean',
      name: 'hide-text-boxes',
      description: 'Hides both text boxes when true.',
      table: { category: 'Text Boxes', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Type & Values
  ------------------------------ */
    type: {
      control: { type: 'select' },
      options: ['basic', 'multi', 'discrete'],
      description: 'Type of the slider: basic, multi-range, or discrete.',
      table: { category: 'Type & Values' },
    },

    // range (shared)
    min: {
      control: { type: 'number', step: 1 },
      description: 'Minimum value of the slider.',
      table: { category: 'Type & Values' },
    },
    max: {
      control: { type: 'number', step: 1 },
      description: 'Maximum value of the slider.',
      table: { category: 'Type & Values' },
    },

    // basic
    value: {
      control: { type: 'number', step: 1 },
      description: 'Current value of the slider.',
      table: { category: 'Type & Values' },
    },

    // multi
    lowerValue: {
      control: { type: 'number', step: 1 },
      name: 'lower-value',
      description: 'The lower value for multi-range sliders.',
      table: { category: 'Type & Values' },
    },
    upperValue: {
      control: { type: 'number', step: 1 },
      name: 'upper-value',
      description: 'The upper value for multi-range sliders.',
      table: { category: 'Type & Values' },
    },

    // discrete
    selectedIndex: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'selected-index',
      description: 'Selected index for discrete sliders.',
      table: { category: 'Type & Values' },
    },
    stringValues: {
      control: 'object',
      name: 'string-values',
      description: 'Array of string values for discrete sliders.',
      table: { category: 'Type & Values' },
    },

    /* -----------------------------
     Ticks & Snapping
  ------------------------------ */
    snapToTicks: {
      control: 'boolean',
      name: 'snap-to-ticks',
      description: 'Snaps the slider to tick marks when true.',
      table: { category: 'Ticks & Snapping', defaultValue: { summary: false } },
    },
    tickLabels: {
      control: 'boolean',
      name: 'tick-labels',
      description: 'Shows labels for tick marks when true.',
      table: { category: 'Ticks & Snapping', defaultValue: { summary: false } },
    },
    tickValues: {
      control: 'object',
      description: 'Array of numeric values for tick marks.',
      name: 'tick-values',
      table: { category: 'Ticks & Snapping' },
    },

    /* -----------------------------
     Thumb
  ------------------------------ */
    sliderThumbLabel: {
      control: 'boolean',
      name: 'slider-thumb-label',
      description: 'Shows label on the slider thumb when true.',
      table: { category: 'Thumb', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Styling
  ------------------------------ */
    plumage: {
      control: 'boolean',
      description: 'Enables plumage style for the slider thumb.',
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
const boolLine = (name, on) => (on ? name : null);
const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return null;
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const serializeArray = val => {
  if (val === undefined || val === null) return '';
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

/* base template */
const Template = args => {
  const attrs = [
    boolLine('disabled', args.disabled),
    attrLine('label', args.label),
    boolLine('hide-left-text-box', args.hideLeftTextBox),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    boolLine('hide-text-boxes', args.hideTextBoxes),

    attrLine('max', args.max),
    attrLine('min', args.min),

    boolLine('plumage', args.plumage),

    // type-specific
    args.type === 'multi' ? attrLine('lower-value', args.lowerValue) : null,
    args.type === 'multi' ? attrLine('upper-value', args.upperValue) : null,

    args.type === 'discrete' ? attrLine('selected-index', args.selectedIndex) : null,
    args.type === 'discrete' ? attrLine('string-values', serializeArray(args.stringValues)) : null,

    boolLine('slider-thumb-label', args.sliderThumbLabel),
    boolLine('snap-to-ticks', args.snapToTicks),
    boolLine('tick-labels', args.tickLabels),
    attrLine('tick-values', serializeArray(args.tickValues)),

    attrLine('type', args.type),
    attrLine('unit', args.unit),

    args.type === 'basic' ? attrLine('value', args.value) : null,

    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('\n  ');

  return normalizeHtml(`
<div style="margin-top: 40px; margin-bottom: 40px;">
  <!-- div wrapper is for better appearance in Storybook -->
  <slider-manager-component
    ${attrs}
  ></slider-manager-component>
</div>
`);
};

/* stories */
export const Basic = {
  render: Template,
  args: {
    disabled: false,
    hideLeftTextBox: false,
    hideRightTextBox: false,
    hideTextBoxes: false,
    label: 'Range',
    max: 100,
    min: 0,
    plumage: false,
    sliderThumbLabel: false,
    snapToTicks: false,
    tickLabels: false,
    tickValues: [],
    type: 'basic',
    unit: '',
    value: 42,
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic slider, `type="basic"`, allows selection of a single value within a range.',
      },
    },
  },
};

export const BasicWithTicks = {
  render: Template,
  args: {
    ...Basic.args,
    snapToTicks: true,
    tickLabels: true,
    tickValues: [0, 25, 50, 75, 100],
    value: 50,
    variant: 'info',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic slider with tick marks and snapping functionality.',
      },
    },
  },
};

export const BasicWithSliderThumbLabel = {
  render: Template,
  args: {
    ...Basic.args,
    sliderThumbLabel: true,
    tickLabels: true,
    tickValues: [0, 25, 50, 75, 100],
    value: 50,
    variant: 'info',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic slider can show the current value on the slider thumb when `slider-thumb-label` is true.',
      },
    },
  },
};

export const MultiRange = {
  render: Template,
  args: {
    disabled: false,
    hideLeftTextBox: false,
    hideRightTextBox: false,
    hideTextBoxes: false,
    label: 'Price Range',
    lowerValue: 125,
    max: 500,
    min: 0,
    plumage: false,
    sliderThumbLabel: true,
    snapToTicks: false,
    tickLabels: true,
    tickValues: [0, 100, 200, 300, 400, 500],
    type: 'multi',
    unit: '$',
    upperValue: 375,
    variant: 'success',
  },
  parameters: {
    docs: {
      description: {
        story: 'A multi-range slider, `type="multi"`, allows selection of a range between two values.',
      },
    },
  },
};

export const Discrete = {
  render: Template,
  args: {
    disabled: false,
    hideLeftTextBox: false,
    hideRightTextBox: false,
    hideTextBoxes: true,
    label: 'T-Shirt Size',
    max: 100,
    min: 0,
    plumage: false,
    selectedIndex: 2,
    sliderThumbLabel: false,
    snapToTicks: false,
    stringValues: ['XS', 'S', 'M', 'L', 'XL'],
    tickLabels: true,
    tickValues: [],
    type: 'discrete',
    unit: '',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'A discrete slider allows selection from a set of predefined string values.',
      },
    },
  },
};

export const PlumageVariant = {
  render: Template,
  args: {
    ...Basic.args,
    hideTextBoxes: true,
    plumage: true,
    value: 70,
    variant: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'The plumage variant provides a stylized appearance for the slider.',
      },
    },
  },
};

export const DisabledState = {
  render: Template,
  args: {
    ...Basic.args,
    disabled: true,
    value: 35,
  },
  parameters: {
    docs: {
      description: {
        story: 'The disabled state prevents user interaction with the slider.',
      },
    },
  },
};
