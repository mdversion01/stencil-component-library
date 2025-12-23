export default {
  title: 'Components/SVG',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    fill: { control: 'color' },
    width: { control: { type: 'number', min: 0, step: 1 } },
    height: { control: { type: 'number', min: 0, step: 1 } },
    svgAriaHidden: {
      control: { type: 'radio' },
      options: [undefined, 'true', 'false'],
      name: 'svg-aria-hidden',
    },
    svgAriaLabel: { control: 'text', name: 'svg-aria-label' },
    svgMargin: {
      control: { type: 'radio' },
      options: ['', 'left', 'right'],
      name: 'svg-margin',
    },
  },
};

/* helpers */
const boolishAttr = (name, v) => (v === undefined || v === null ? '' : ` ${name}="${String(v)}"`);
const attr = (name, v) => (v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`);

/* a tiny inline SVG to slot into the component */
const ICON = `
  <svg viewBox="0 0 576 512" role="img">
            <path
              d="M320 33.9c-10.5-1.2-21.2-1.9-32-1.9-99.8 0-187.8 50.8-239.4 128H320V33.9zM96 192H30.3C11.1 230.6 0 274 0 320h96V192zM352 39.4V160h175.4C487.2 99.9 424.8 55.9 352 39.4zM480 320h96c0-46-11.1-89.4-30.3-128H480v128zm-64 64v96h128c17.7 0 32-14.3 32-32v-96H411.5c2.6 10.3 4.5 20.9 4.5 32zm32-192H128v128h49.8c22.2-38.1 63-64 110.2-64s88 25.9 110.2 64H448V192zM0 448c0 17.7 14.3 32 32 32h128v-96c0-11.1 1.9-21.7 4.5-32H0v96zm288-160c-53 0-96 43-96 96v96h192v-96c0-53-43-96-96-96z"
            />
          </svg>
`;

/* base template: renders just the icon wrapper */
const Template = args => `
<svg-component
  ${attr('fill', args.fill)}
  ${attr('width', args.width)}
  ${attr('height', args.height)}
  ${boolishAttr('svg-aria-hidden', args.svgAriaHidden)}
  ${attr('svg-aria-label', args.svgAriaLabel)}
  ${attr('svg-margin', args.svgMargin)}
>
  ${ICON}
</svg-component>
`;

/* an inline-with-text template to demo svg-margin behavior */
const InlineWithTextTemplate = args => `
<div style="display:flex;align-items:center;font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
  <svg-component
    ${attr('fill', args.fill)}
    ${attr('width', args.width)}
    ${attr('height', args.height)}
    ${boolishAttr('svg-aria-hidden', args.svgAriaHidden)}
    ${attr('svg-aria-label', args.svgAriaLabel)}
    ${attr('svg-margin', args.svgMargin)}
  >
    ${ICON}
  </svg-component>
  <span>Icon next to text</span>
</div>
`;

/* -----------------
   Stories
   ----------------- */

export const Basic = Template.bind({});
Basic.args = {
  fill: '#3B82F6', // Tailwind-ish blue-500
  width: 32,
  height: 32,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: '',
};

export const WithDimensions = Template.bind({});
WithDimensions.args = {
  fill: '#10B981', // green-500
  width: 48,
  height: 24,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: '',
};

export const WithAriaLabel = Template.bind({});
WithAriaLabel.args = {
  fill: '#111827',
  width: 24,
  height: 24,
  svgAriaHidden: 'false',
  svgAriaLabel: 'Status: online',
  svgMargin: '',
};

export const InlineMarginLeft = InlineWithTextTemplate.bind({});
InlineMarginLeft.args = {
  fill: '#EF4444', // red-500
  width: 20,
  height: 20,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: 'left', // adds right margin to the icon wrapper
};

export const InlineMarginRight = InlineWithTextTemplate.bind({});
InlineMarginRight.args = {
  fill: '#6366F1', // indigo-500
  width: 20,
  height: 20,
  svgAriaHidden: 'true',
  svgAriaLabel: '',
  svgMargin: 'right', // adds left margin to the icon wrapper
};
