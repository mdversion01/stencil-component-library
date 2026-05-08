// src/stories/multi-range-slider-component.stories.js
import MultiRangeSliderDocs from './multi-range-slider-component.docs.mdx';
import { Template, normalizeHtml, getSnapshot } from './multi-range-slider-component.story-helpers';

export default {
  title: 'Components/Slider/Multi Range Slider',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: MultiRangeSliderDocs,
      description: {
        component:
          'A multi-range slider component allowing selection of a range between two values, with support for horizontal and vertical orientation.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => Template(ctx.args),
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional ARIA label override. Used when aria-labelledby is not provided.',
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
      description: 'Optional ARIA describedby override (space-separated ids).',
    },

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

    rangeFillMode: {
      control: { type: 'select' },
      options: ['inside', 'outside'],
      name: 'range-fill-mode',
      table: { defaultValue: { summary: 'inside' }, category: 'Range Fill' },
      description: 'Controls whether the colored range is inside the thumbs or outside them.',
    },

    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      name: 'orientation',
      table: { defaultValue: { summary: 'horizontal' }, category: 'Layout' },
      description: 'Controls whether the slider is rendered horizontally or vertically.',
    },
  },
};

const templateStoryParameters = {
  docs: {
    source: {
      type: 'dynamic',
      language: 'html',
      transform: (_code, ctx) => Template(ctx.args),
    },
  },
};

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
  rangeFillMode: 'inside',
  orientation: 'horizontal',

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
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

export const Vertical = Template.bind({});
Vertical.args = {
  ...Basic.args,
  label: 'Vertical price range',
  lowerValue: 20,
  upperValue: 80,
  orientation: 'vertical',
};
Vertical.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A vertical multi-range slider allowing selection of a range between two values.',
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
WithThumbLabels.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A multi-range slider that shows the current values on the slider thumbs.',
    },
  },
};

export const VerticalWithThumbLabels = Template.bind({});
VerticalWithThumbLabels.args = {
  ...WithThumbLabels.args,
  label: 'Vertical temperature',
  orientation: 'vertical',
};
VerticalWithThumbLabels.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A vertical multi-range slider that shows the current values on the slider thumbs.',
    },
  },
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
WithTicksAndSnapping.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A multi-range slider with tick marks and snapping functionality.',
    },
  },
};

export const VerticalWithTicksAndSnapping = Template.bind({});
VerticalWithTicksAndSnapping.args = {
  ...WithTicksAndSnapping.args,
  label: 'Vertical steps',
  orientation: 'vertical',
};
VerticalWithTicksAndSnapping.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A vertical multi-range slider with tick marks and snapping functionality.',
    },
  },
};

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
PlumageStyle.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A multi-range slider with a plumage style applied.',
    },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  label: 'Disabled range',
  disabled: true,
  variant: '',
};
Disabled.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A multi-range slider that is disabled.',
    },
  },
};

export const OutsideFill = Template.bind({});
OutsideFill.args = {
  ...Basic.args,
  label: 'Outside fill range',
  rangeFillMode: 'outside',
};
OutsideFill.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A multi-range slider using `range-fill-mode="outside"` so the colored segments appear outside the two thumbs.',
    },
  },
};

export const VerticalOutsideFill = Template.bind({});
VerticalOutsideFill.args = {
  ...Basic.args,
  label: 'Vertical outside fill',
  lowerValue: 20,
  upperValue: 80,
  orientation: 'vertical',
  rangeFillMode: 'outside',
};
VerticalOutsideFill.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: {
      story: 'A vertical multi-range slider using `range-fill-mode="outside"` so the colored segments appear outside the two thumbs.',
    },
  },
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
        Prints computed <code>role</code> + <code>aria-*</code> + ids for default / inline / horizontal / vertical / validation / disabled,
        and includes a keyboard focus demo (Tab + Arrow keys).
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '', { keyboardDemo = false } = {}) => {
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

      const mount = document.createElement('div');
      mount.innerHTML = normalizeHtml(`
        ${extraHtml}
        ${Template({ ...Basic.args, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        const host = mount.querySelector('multi-range-slider-component');

        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('multi-range-slider-component');
          } catch (_e) {}
        }

        const renderSnapshot = () => {
          pre.textContent = JSON.stringify(getSnapshot(host, mount), null, 2);
        };

        renderSnapshot();

        if (keyboardDemo) {
          const sliders = Array.from(host.querySelectorAll('[role="slider"]'));
          sliders.forEach(s => {
            s.addEventListener('focus', renderSnapshot);
            s.addEventListener('blur', renderSnapshot);
            s.addEventListener('keydown', renderSnapshot);
          });

          const hint = document.createElement('div');
          hint.style.opacity = '.85';
          hint.innerHTML =
            'Tip: click a thumb, then press <kbd>Tab</kbd> to move focus to the other thumb. Use <kbd>Arrow</kbd> keys to change the focused thumb.';
          box.insertBefore(hint, pre);
        }
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    wrap.appendChild(
      card('Default', {
        label: 'Default range',
        min: 0,
        max: 100,
        lowerValue: 25,
        upperValue: 75,
        unit: '$',
        tickValues: [0, 25, 50, 75, 100],
        tickLabels: true,
      }),
    );

    wrap.appendChild(
      card(
        'Inline (simulated, aria-labelledby external)',
        {
          label: '',
          min: 0,
          max: 100,
          lowerValue: 20,
          upperValue: 80,
          ariaLabelledby: 'mx-inline-label',
          ariaDescribedby: 'mx-inline-help',
        },
        `
        <div id="mx-inline-label" style="font-weight:600; margin-bottom:6px;">Inline label (external)</div>
        <div id="mx-inline-help" style="opacity:.8; margin-bottom:8px;">Help text for range selection.</div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal (simulated)',
        {
          label: '',
          min: 0,
          max: 200,
          lowerValue: 50,
          upperValue: 150,
          unit: 'Mbps',
          ariaLabelledby: 'mx-horizontal-label',
        },
        `
        <div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px;">
          <div id="mx-horizontal-label" style="font-weight:600;">Horizontal label area</div>
        </div>
        `,
      ),
    );

    wrap.appendChild(
      card('Vertical', {
        label: 'Vertical range',
        min: 0,
        max: 100,
        lowerValue: 20,
        upperValue: 80,
        unit: '$',
        orientation: 'vertical',
        ariaLabel: 'Vertical range slider',
      }),
    );

    wrap.appendChild(
      card(
        'Error / validation (simulated via aria-describedby)',
        {
          label: 'Validation',
          min: 0,
          max: 100,
          lowerValue: 0,
          upperValue: 0,
          ariaDescribedby: 'mx-error',
        },
        `<div id="mx-error" style="color:#a00; font-size:12px; margin-bottom:8px;">Error: choose a valid range.</div>`,
      ),
    );

    wrap.appendChild(
      card('Disabled', {
        label: 'Disabled',
        min: 0,
        max: 100,
        lowerValue: 25,
        upperValue: 75,
        disabled: true,
        ariaLabel: 'Disabled range slider',
      }),
    );

    wrap.appendChild(
      card(
        'Keyboard focus demo (Tab switches thumb)',
        {
          label: 'Keyboard demo',
          min: 0,
          max: 10,
          lowerValue: 2,
          upperValue: 8,
          unit: '',
          tickValues: [],
          tickLabels: false,
        },
        '',
        { keyboardDemo: true },
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the multi-range slider: two focusable `role="slider"` thumbs with `aria-valuemin/max/now/text`, optional `aria-label` / `aria-labelledby` / `aria-describedby`, plus simulated inline/horizontal/vertical layouts, simulated error describedby, disabled state, and a keyboard demo where focus determines which thumb arrow keys modify.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
};
