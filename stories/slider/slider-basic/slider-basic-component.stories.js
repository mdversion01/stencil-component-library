// src/stories/slider-basic-component.stories.js
import SliderBasicDocs from './slider-basic-component.docs.mdx';
import { Template, normalizeHtml, getSnapshot } from './slider-basic-component.story-helpers';

export default {
  title: 'Components/Slider/Basic',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: SliderBasicDocs,
      description: {
        component: 'A basic slider component allowing selection of a single value within a range.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Optional ARIA label override. Used when aria-labelledby is not provided.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'Optional ARIA labelledby override (space-separated ids). Takes precedence over aria-label.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'Optional ARIA describedby override (space-separated ids).',
      table: { category: 'Accessibility' },
    },

    disabled: {
      control: 'boolean',
      description: 'Disables the slider when true.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },
    plumage: {
      control: 'boolean',
      description: 'Enables plumage style when true.',
      table: { category: 'Behavior', defaultValue: { summary: false } },
    },

    label: {
      control: 'text',
      description: 'Label for the slider.',
      table: { category: 'Content' },
    },
    unit: {
      control: 'text',
      description: 'Unit to display with values.',
      table: { category: 'Content' },
    },

    value: {
      control: { type: 'number', step: 1 },
      description: 'Current value of the slider.',
      table: { category: 'Value & Range' },
    },
    min: {
      control: { type: 'number', step: 1 },
      description: 'The minimum value of the slider.',
      table: { category: 'Value & Range' },
    },
    max: {
      control: { type: 'number', step: 1 },
      description: 'The maximum value of the slider.',
      table: { category: 'Value & Range' },
    },

    snapToTicks: {
      control: 'boolean',
      name: 'snap-to-ticks',
      description: 'Snaps the slider to tick marks when true.',
      table: { category: 'Ticks', defaultValue: { summary: false } },
    },
    tickLabels: {
      control: 'boolean',
      name: 'tick-labels',
      description: 'Shows labels for tick marks when true.',
      table: { category: 'Ticks', defaultValue: { summary: false } },
    },
    tickValues: {
      control: 'object',
      name: 'tick-values',
      description: 'Array of numeric values for tick marks.',
      table: { category: 'Ticks' },
    },
    sliderThumbLabel: {
      control: 'boolean',
      name: 'slider-thumb-label',
      description: 'Shows the slider thumb label when true.',
      table: { category: 'Ticks', defaultValue: { summary: false } },
    },

    hideLeftTextBox: {
      control: 'boolean',
      name: 'hide-left-text-box',
      description: 'Hides the left text box when true.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },
    hideRightTextBox: {
      control: 'boolean',
      name: 'hide-right-text-box',
      description: 'Hides the right text box when true.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },
    hideTextBoxes: {
      control: 'boolean',
      name: 'hide-text-boxes',
      description: 'Hides both text boxes when true.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Controls whether the slider is rendered horizontally or vertically.',
      table: { category: 'Layout', defaultValue: { summary: 'horizontal' } },
    },

    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      description: 'Visual variant of the slider.',
      table: { category: 'Appearance' },
    },
  },
};

const templateStoryParameters = {
  docs: {
    source: {
      type: 'dynamic',
      language: 'html',
      transform: (_src, ctx) => Template(ctx.args),
    },
  },
};

export const Basic = Template.bind({});
Basic.args = {
  disabled: false,
  hideLeftTextBox: false,
  hideRightTextBox: false,
  hideTextBoxes: false,
  label: 'Volume',
  max: 100,
  min: 0,
  plumage: false,
  sliderThumbLabel: false,
  snapToTicks: false,
  tickLabels: false,
  tickValues: [],
  unit: '',
  value: 30,
  variant: 'primary',
  orientation: 'horizontal',

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
};
Basic.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'The basic slider with default settings.' },
  },
};

export const Vertical = Template.bind({});
Vertical.args = {
  ...Basic.args,
  label: 'Volume',
  value: 30,
  orientation: 'vertical',
};
Vertical.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A vertical basic slider.' },
  },
};

export const WithTicks = Template.bind({});
WithTicks.args = {
  ...Basic.args,
  label: 'Brightness',
  value: 50,
  tickValues: [0, 25, 50, 75, 100],
  tickLabels: true,
  variant: 'info',
};
WithTicks.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A slider with tick marks and labels.' },
  },
};

export const VerticalWithTicks = Template.bind({});
VerticalWithTicks.args = {
  ...WithTicks.args,
  orientation: 'vertical',
};
VerticalWithTicks.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A vertical slider with tick marks and labels.' },
  },
};

export const SnapToTicks = Template.bind({});
SnapToTicks.args = {
  ...Basic.args,
  label: 'Opacity',
  value: 60,
  snapToTicks: true,
  tickValues: [0, 20, 40, 60, 80, 100],
  tickLabels: true,
  variant: 'secondary',
};
SnapToTicks.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A slider that snaps to predefined tick values.' },
  },
};

export const VerticalSnapToTicks = Template.bind({});
VerticalSnapToTicks.args = {
  ...SnapToTicks.args,
  orientation: 'vertical',
};
VerticalSnapToTicks.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A vertical slider that snaps to predefined tick values.' },
  },
};

export const ThumbLabel = Template.bind({});
ThumbLabel.args = {
  ...Basic.args,
  label: 'Temperature',
  unit: '°F',
  value: 68,
  sliderThumbLabel: true,
  variant: 'success',
};
ThumbLabel.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A slider with a label displayed on the thumb.' },
  },
};

export const VerticalThumbLabel = Template.bind({});
VerticalThumbLabel.args = {
  ...ThumbLabel.args,
  orientation: 'vertical',
};
VerticalThumbLabel.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A vertical slider with a label displayed on the thumb.' },
  },
};

export const PlumageVariant = Template.bind({});
PlumageVariant.args = {
  ...Basic.args,
  label: 'Speed',
  value: 70,
  plumage: true,
  variant: 'primary',
};
PlumageVariant.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A slider with the plumage variant.' },
  },
};

export const HideTextBoxes = Template.bind({});
HideTextBoxes.args = {
  ...Basic.args,
  label: 'Gain',
  value: 42,
  hideTextBoxes: true,
};
HideTextBoxes.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A slider with hidden text boxes.' },
  },
};

export const HideLeftOrRight = Template.bind({});
HideLeftOrRight.args = {
  ...Basic.args,
  label: 'Balance',
  value: 55,
  hideLeftTextBox: true,
  hideRightTextBox: false,
};
HideLeftOrRight.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A slider with only the left text box hidden.' },
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  label: 'Disabled',
  value: 35,
  disabled: true,
  variant: '',
};
Disabled.parameters = {
  ...templateStoryParameters,
  docs: {
    ...templateStoryParameters.docs,
    description: { story: 'A disabled slider.' },
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
        Prints computed <code>role</code> + <code>aria-*</code> + ids for default / inline / horizontal / vertical / validation / disabled.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '') => {
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
        const host = mount.querySelector('slider-basic-component');

        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('slider-basic-component');
          } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(mount), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    wrap.appendChild(
      card('Default', {
        label: 'Default',
        value: 30,
        ariaLabel: '',
        ariaLabelledby: '',
        ariaDescribedby: '',
      }),
    );

    wrap.appendChild(
      card(
        'Inline (simulated, aria-labelledby external)',
        {
          label: 'Inline',
          value: 40,
          ariaLabelledby: 'mx-inline-label',
        },
        `<div id="mx-inline-label" style="font-weight:600; margin-bottom:8px;">Inline label (external)</div>`,
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal (simulated)',
        {
          label: '',
          value: 55,
          ariaLabelledby: 'mx-horizontal-label',
        },
        `<div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px;">
           <div id="mx-horizontal-label" style="font-weight:600;">Horizontal label area</div>
         </div>`,
      ),
    );

    wrap.appendChild(
      card('Vertical', {
        label: 'Vertical',
        value: 45,
        orientation: 'vertical',
        ariaLabel: 'Vertical slider',
      }),
    );

    wrap.appendChild(
      card(
        'Error / validation (simulated via aria-describedby)',
        {
          label: 'Validation',
          value: 10,
          ariaDescribedby: 'mx-error',
        },
        `<div id="mx-error" style="color:#a00; font-size:12px; margin-bottom:8px;">Error: invalid value.</div>`,
      ),
    );

    wrap.appendChild(
      card('Disabled', {
        label: 'Disabled',
        value: 35,
        disabled: true,
        ariaLabel: 'Disabled slider',
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the slider: the focused element has `role="slider"` with `aria-valuemin/max/now/text`, and optional `aria-label` / `aria-labelledby` / `aria-describedby`. Includes simulated inline/horizontal/vertical layouts, simulated error describedby, and disabled state.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
};
