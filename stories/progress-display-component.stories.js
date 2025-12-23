// src/stories/progress-display-component.stories.js

export default {
  title: 'Components/Progress',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    // Shared flags
    circular: { control: 'boolean' },
    multi: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    animated: { control: 'boolean' },
    striped: { control: 'boolean' },
    lineCap: { control: 'boolean', name: 'line-cap' },

    // Linear props
    value: { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max: { control: { type: 'number', min: 1, step: 1 } },
    height: { control: { type: 'number', min: 4, step: 1 } },
    precision: { control: { type: 'number', min: 0, max: 4, step: 1 } },
    progressAlign: {
      control: { type: 'select' },
      options: ['', 'left', 'right'],
      name: 'progress-align',
    },
    showProgress: { control: 'boolean', name: 'show-progress' },
    showValue: { control: 'boolean', name: 'show-value' },
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
    },
    styles: { control: 'text' },

    // Circular props
    size: { control: { type: 'number', min: 32, step: 1 } },
    rotate: { control: { type: 'number', step: 1 } },
    strokeWidth: { control: { type: 'number', min: 1, step: 1 }, name: 'width' },

    // Multi-bar
    bars: { control: 'object' },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  const s = String(v);
  // Prefer single quotes if value contains double quotes (like JSON)
  const useSingle = s.includes('"');
  const escaped =
    useSingle
      ? s.replace(/'/g, '&#39;')   // escape single quotes when using single-quoted attr
      : s.replace(/"/g, '&quot;'); // otherwise escape double quotes
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const serializeBars = (bars) => {
  if (!bars) return '';
  try {
    return JSON.stringify(bars);
  } catch {
    return '';
  }
};

const LinearTemplate = (args) => `
<progress-display-component
  ${attr('value', args.value)}
  ${attr('max', args.max)}
  ${attr('height', args.height)}
  ${attr('precision', args.precision)}
  ${attr('progress-align', args.progressAlign)}
  ${boolAttr('show-progress', args.showProgress)}
  ${boolAttr('show-value', args.showValue)}
  ${boolAttr('animated', args.animated)}
  ${boolAttr('striped', args.striped)}
  ${attr('variant', args.variant)}
  ${args.styles ? attr('styles', args.styles) : ''}
>
  <span slot="">Label</span>
</progress-display-component>
`;

const CircularTemplate = (args) => `
<progress-display-component
  circular
  ${attr('value', args.value)}
  ${attr('max', args.max)}
  ${attr('size', args.size)}
  ${attr('precision', args.precision)}
  ${attr('rotate', args.rotate)}
  ${attr('width', args.strokeWidth)}
  ${boolAttr('indeterminate', args.indeterminate)}
  ${boolAttr('line-cap', args.lineCap)}
  ${boolAttr('show-progress', args.showProgress)}
  ${boolAttr('show-value', args.showValue)}
  ${attr('variant', args.variant)}
></progress-display-component>
`;

const MultiTemplate = (args) => `
<progress-display-component
  multi
  ${attr('height', args.height)}
  ${attr('bars', serializeBars(args.bars))}
></progress-display-component>
`;

/* ===========================
   Stories
   =========================== */

export const LinearBasic = LinearTemplate.bind({});
LinearBasic.args = {
  value: 45,
  max: 100,
  height: 16,
  precision: 0,
  progressAlign: '',
  showProgress: true,
  showValue: false,
  animated: false,
  striped: false,
  variant: 'primary',
  styles: '',
};

export const LinearStripedAnimated = LinearTemplate.bind({});
LinearStripedAnimated.args = {
  value: 72,
  max: 100,
  height: 18,
  precision: 0,
  progressAlign: 'right',
  showProgress: true,
  showValue: false,
  animated: true,
  striped: true,
  variant: 'success',
  styles: '',
};

export const LinearWithCustomStyles = LinearTemplate.bind({});
LinearWithCustomStyles.args = {
  value: 30,
  max: 100,
  height: 12,
  precision: 0,
  progressAlign: 'left',
  showProgress: false,
  showValue: true,
  animated: false,
  striped: false,
  variant: 'warning',
  styles: 'border-radius:8px; overflow:hidden; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08);',
};

export const CircularBasic = CircularTemplate.bind({});
CircularBasic.args = {
  value: 64,
  max: 100,
  size: 96,
  rotate: 0,
  strokeWidth: 6,
  precision: 0,
  lineCap: false,
  showProgress: true,
  showValue: false,
  indeterminate: false,
  variant: 'primary',
};

export const CircularRotatedWide = CircularTemplate.bind({});
CircularRotatedWide.args = {
  value: 80,
  max: 100,
  size: 120,
  rotate: -90,
  strokeWidth: 10,
  precision: 0,
  lineCap: true,
  showProgress: true,
  showValue: false,
  indeterminate: false,
  variant: 'info',
};

export const CircularIndeterminate = CircularTemplate.bind({});
CircularIndeterminate.args = {
  value: 0,
  max: 100,
  size: 80,
  rotate: 0,
  strokeWidth: 4,
  precision: 0,
  lineCap: false,
  showProgress: false,
  showValue: false,
  indeterminate: true,
  variant: 'secondary',
};

export const MultiStacked = MultiTemplate.bind({});
MultiStacked.args = {
  height: 18,
  bars: [
    { value: 20, variant: 'primary', striped: false, animated: false, showProgress: true, precision: 0, progressAlign: '' },
    { value: 35, variant: 'success', striped: true, animated: true, showProgress: true, precision: 0, progressAlign: '' },
    { value: 15, variant: 'danger', striped: false, animated: false, showProgress: true, precision: 0, progressAlign: '' },
  ],
};

export const MultiWithLeftRightText = MultiTemplate.bind({});
MultiWithLeftRightText.args = {
  height: 20,
  bars: [
    { value: 40, variant: 'info', showProgress: true, progressAlign: 'left', precision: 0 },
    { value: 25, variant: 'warning', showProgress: true, progressAlign: 'right', precision: 0 },
  ],
};

export const MultiJSONAttribute = () => `
<progress-display-component
  multi
  height="18"
  bars='[
    { "value": 30, "variant": "primary", "striped": true, "animated": true, "showProgress": true, "precision": 0 },
    { "value": 20, "variant": "dark", "showProgress": true, "precision": 0 }
  ]'
></progress-display-component>
`;
