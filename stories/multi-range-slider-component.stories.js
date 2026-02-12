// src/stories/multi-range-slider-component.stories.js

export default {
  title: 'Components/Slider/Multi Range Slider',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A multi-range slider component allowing selection of a range between two values.',
      },
    },
  },
  argTypes: {
  disabled: {
    control: 'boolean',
    name: 'disabled',
    table: { defaultValue: { summary: false }, category: 'State' },
    description: 'Disables the slider when true.',
  },

  hideLeftTextBox: {
    control: 'boolean',
    name: 'hide-left-text-box',
    table: { defaultValue: { summary: false }, category: 'Layout' },
    description: 'Hides the left text box when true.',
  },

  hideRightTextBox: {
    control: 'boolean',
    name: 'hide-right-text-box',
    table: { defaultValue: { summary: false }, category: 'Layout' },
    description: 'Hides the right text box when true.',
  },

  hideTextBoxes: {
    control: 'boolean',
    name: 'hide-text-boxes',
    table: { defaultValue: { summary: false }, category: 'Layout' },
    description: 'Hides both text boxes when true.',
  },

  label: {
    control: 'text',
    name: 'label',
    table: { category: 'Labeling' },
    description: 'Label for the slider.',
  },

  lowerValue: {
    control: { type: 'number', step: 1 },
    name: 'lower-value',
    table: { category: 'Values' },
    description: 'The lower value for multi-range sliders.',
  },

  upperValue: {
    control: { type: 'number', step: 1 },
    name: 'upper-value',
    table: { category: 'Values' },
    description: 'The upper value for multi-range sliders.',
  },

  min: {
    control: { type: 'number', step: 1 },
    name: 'min',
    table: { category: 'Range' },
    description: 'The minimum value of the slider.',
  },

  max: {
    control: { type: 'number', step: 1 },
    name: 'max',
    table: { category: 'Range' },
    description: 'The maximum value of the slider.',
  },

  unit: {
    control: 'text',
    name: 'unit',
    table: { category: 'Labeling' },
    description: 'Unit to display with values.',
  },

  plumage: {
    control: 'boolean',
    name: 'plumage',
    table: { defaultValue: { summary: false }, category: 'Styling' },
    description: 'Enables plumage style when true.',
  },

  variant: {
    control: { type: 'select' },
    options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
    name: 'variant',
    table: { defaultValue: { summary: 'primary' }, category: 'Styling' },
    description: 'Visual variant of the slider.',
  },

  sliderThumbLabel: {
    control: 'boolean',
    name: 'slider-thumb-label',
    table: { defaultValue: { summary: false }, category: 'Thumb' },
    description: 'Shows labels on slider thumbs when true.',
  },

  snapToTicks: {
    control: 'boolean',
    name: 'snap-to-ticks',
    table: { defaultValue: { summary: false }, category: 'Ticks & Snapping' },
    description: 'Snaps slider thumbs to tick values when true.',
  },

  tickLabels: {
    control: 'boolean',
    name: 'tick-labels',
    table: { defaultValue: { summary: false }, category: 'Ticks & Snapping' },
    description: 'Shows labels for tick marks when true.',
  },

  tickValues: {
    control: 'object',
    name: 'tick-values',
    table: { category: 'Ticks & Snapping' },
    description: 'Array of numeric values for tick marks.',
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

/* template */
const Template = args => {
  const attrs = [
    boolLine('disabled', args.disabled),
    boolLine('hide-left-text-box', args.hideLeftTextBox),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    boolLine('hide-text-boxes', args.hideTextBoxes),
    attrLine('label', args.label),
    attrLine('lower-value', args.lowerValue),
    attrLine('max', args.max),
    attrLine('min', args.min),
    boolLine('plumage', args.plumage),
    boolLine('slider-thumb-label', args.sliderThumbLabel),
    boolLine('snap-to-ticks', args.snapToTicks),
    boolLine('tick-labels', args.tickLabels),
    // IMPORTANT: for HTML attributes, arrays must be serialized to JSON strings
    attrLine('tick-values', serializeArray(args.tickValues)),
    attrLine('unit', args.unit),
    attrLine('upper-value', args.upperValue),
    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('');

  // Remove extra blank lines in the generated source by not inserting empty lines
  return normalizeHtml(`
<div style="margin-top: 40px; margin-bottom: 40px;">
  <!-- div wrapper is for better appearance in Storybook -->
  <multi-range-slider-component${attrs}></multi-range-slider-component>
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
  hideLeftTextBox: false,
  hideRightTextBox: false,
  hideTextBoxes: false,
  label: 'Price range',
  lowerValue: 20,
  max: 100,
  min: 0,
  plumage: false,
  sliderThumbLabel: false,
  snapToTicks: false,
  tickLabels: false,
  tickValues: [],
  unit: '$',
  upperValue: 80,
  variant: 'primary',
};
Basic.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A basic multi-range slider allowing selection of a range between two values.',
    },
  },
};

export const WithThumbLabels = Template.bind({});
WithThumbLabels.args = {
  ...Basic.args,
  label: 'Temperature',
  unit: '°F',
  sliderThumbLabel: true,
  variant: 'info',
};
WithThumbLabels.parameters = templateStoryParameters;
WithThumbLabels.parameters.docs.description = {
  story: 'A multi-range slider that shows the current values on the slider thumbs.',
};

export const WithTicksAndSnapping = Template.bind({});
WithTicksAndSnapping.args = {
  ...Basic.args,
  label: 'Steps',
  unit: '',
  snapToTicks: true,
  tickLabels: true,
  tickValues: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  lowerValue: 30,
  upperValue: 70,
  variant: 'success',
};
WithTicksAndSnapping.parameters = templateStoryParameters;
WithTicksAndSnapping.parameters.docs.description = {
  story: 'A multi-range slider with tick marks and snapping functionality.',
};

/**
 * This story is NOT controls-driven; it’s a specific “attribute JSON” example.
 * So we DISABLE the template transform for it and hardcode the docs source.
 */
export const JSONTickValuesAttribute = () => `
<multi-range-slider-component
  label="Snaps via JSON attr"
  lower-value="25"
  upper-value="75"
  min="0"
  max="100"
  snap-to-ticks
  tick-labels
  tick-values='[0, 25, 50, 75, 100]'
></multi-range-slider-component>
`.trim();

JSONTickValuesAttribute.parameters = {
  controls: { disable: true },
  docs: {
    source: {
      type: 'code',
      language: 'html',
      code: `
<multi-range-slider-component
  label="Snaps via JSON attr"
  lower-value="25"
  upper-value="75"
  min="0"
  max="100"
  snap-to-ticks
  tick-labels
  tick-values='[0, 25, 50, 75, 100]'
></multi-range-slider-component>
`.trim(),
    },
    description: {
      story: 'Demonstrates passing `tick-values` as a JSON string attribute (plain HTML usage).',
    },
  },
};

export const PlumageStyle = Template.bind({});
PlumageStyle.args = {
  ...Basic.args,
  label: 'Bandwidth',
  unit: 'Mbps',
  plumage: true,
  lowerValue: 50,
  upperValue: 150,
  min: 0,
  max: 200,
  variant: 'primary',
};
PlumageStyle.parameters = templateStoryParameters;
PlumageStyle.parameters.docs.description = {
  story: 'A multi-range slider with a plumage style applied.',
};


export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  label: 'Disabled range',
  disabled: true,
  variant: '',
};
Disabled.parameters = templateStoryParameters;
Disabled.parameters.docs.description = {
  story: 'A multi-range slider that is disabled.',
};
