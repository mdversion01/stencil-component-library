import SliderManagerDocs from './slider-manager-component.docs.mdx';
import { Template, normalizeHtml, getSnapshot } from './slider-manager-component.story-helpers';

export default {
  title: 'Components/Slider/Slider Manager',
  tags: ['autodocs'],
  args: {
    disabled: false,
    hideLeftTextBox: false,
    hideRightTextBox: false,
    hideTextBoxes: false,

    label: 'Range',

    min: 0,
    max: 100,

    value: 42,

    lowerValue: 25,
    upperValue: 75,
    rangeFillMode: 'inside',

    selectedIndex: 0,
    stringValues: ['XS', 'S', 'M', 'L', 'XL'],

    snapToTicks: false,
    tickLabels: false,
    tickValues: [],

    plumage: false,
    sliderThumbLabel: false,
    unit: '',
    type: 'basic',
    variant: 'primary',
    orientation: 'horizontal',

    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
  },

  parameters: {
    layout: 'padded',
    docs: {
      page: SliderManagerDocs,
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => Template(ctx.args),
      },
      description: {
        component:
          'A slider manager component that can render basic, multi-range, or discrete sliders based on the provided type, with support for horizontal and vertical orientation.',
      },
    },
  },

  argTypes: {
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Optional ARIA label override forwarded to the underlying slider component.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'Optional ARIA labelledby override forwarded to the underlying slider component.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'Optional ARIA describedby override forwarded to the underlying slider component.',
      table: { category: 'Accessibility' },
    },

    disabled: {
      control: 'boolean',
      description: 'Disables the slider when true.',
      table: { category: 'State', defaultValue: { summary: false } },
    },

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

    type: {
      control: { type: 'select' },
      options: ['basic', 'multi', 'discrete'],
      description: 'Type of the slider: basic, multi-range, or discrete.',
      table: { category: 'Type & Values' },
    },

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

    value: {
      control: { type: 'number', step: 1 },
      description: 'Current value of the slider.',
      table: { category: 'Type & Values' },
      if: { arg: 'type', eq: 'basic' },
    },

    lowerValue: {
      control: { type: 'number', step: 1 },
      name: 'lower-value',
      description: 'The lower value for multi-range sliders.',
      table: { category: 'Type & Values' },
      if: { arg: 'type', eq: 'multi' },
    },
    upperValue: {
      control: { type: 'number', step: 1 },
      name: 'upper-value',
      description: 'The upper value for multi-range sliders.',
      table: { category: 'Type & Values' },
      if: { arg: 'type', eq: 'multi' },
    },
    rangeFillMode: {
      control: { type: 'select' },
      options: ['inside', 'outside'],
      name: 'range-fill-mode',
      description: 'For multi-range sliders, controls whether the colored range is inside the thumbs or outside them.',
      table: { category: 'Type & Values' },
      if: { arg: 'type', eq: 'multi' },
    },

    selectedIndex: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'selected-index',
      description: 'Selected index for discrete sliders.',
      table: { category: 'Type & Values' },
      if: { arg: 'type', eq: 'discrete' },
    },
    stringValues: {
      control: 'object',
      name: 'string-values',
      description: 'Array of string values for discrete sliders.',
      table: { category: 'Type & Values' },
      if: { arg: 'type', eq: 'discrete' },
    },

    snapToTicks: {
      control: 'boolean',
      name: 'snap-to-ticks',
      description: 'Snaps the slider to tick marks when true.',
      table: { category: 'Ticks & Snapping', defaultValue: { summary: false } },
      if: { arg: 'type', neq: 'discrete' },
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
      if: { arg: 'type', neq: 'discrete' },
    },

    sliderThumbLabel: {
      control: 'boolean',
      name: 'slider-thumb-label',
      description: 'Shows label on the slider thumb when true.',
      table: { category: 'Thumb', defaultValue: { summary: false } },
    },

    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Controls whether the slider is rendered horizontally or vertically.',
      table: { category: 'Layout' },
    },

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

export const Basic = {
  render: Template,
  args: {
    disabled: false,
    hideLeftTextBox: true,
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
    orientation: 'horizontal',
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic slider, `type="basic"`, allows selection of a single value within a range.',
      },
    },
  },
};

export const BasicVertical = {
  render: Template,
  args: {
    ...Basic.args,
    max: 100,
    min: 0,
    hideLeftTextBox: false,
    label: 'Vertical Range',
    value: 60,
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'A vertical basic slider using `orientation="vertical"`.',
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
    rangeFillMode: 'inside',
    orientation: 'horizontal',
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'A multi-range slider, `type="multi"`, allows selection of a range between two values.',
      },
    },
  },
};

export const MultiRangeVertical = {
  render: Template,
  args: {
    ...MultiRange.args,
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'A vertical multi-range slider using `orientation="vertical"`.',
      },
    },
  },
};

export const MultiRangeOutsideFill = {
  render: Template,
  args: {
    ...MultiRange.args,
    rangeFillMode: 'outside',
  },
  parameters: {
    docs: {
      description: {
        story: 'A multi-range slider using `range-fill-mode="outside"` so the colored segments appear outside the two thumbs.',
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
    orientation: 'horizontal',
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'A discrete slider allows selection from a set of predefined string values.',
      },
    },
  },
};

export const DiscreteVertical = {
  render: Template,
  args: {
    ...Discrete.args,
    hideTextBoxes: false,
    orientation: 'vertical',
    sliderThumbLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A vertical discrete slider using `orientation="vertical"`.',
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
        <div style="margin-top:6px; opacity:.85; font-size:12px;">
          Note: Slider semantics (role="slider", aria-valuenow, keyboard) live in the child slider components. This story validates manager→child aria forwarding.
        </div>
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
        const host = mount;
        const mgr = host.querySelector('slider-manager-component');

        if (mgr?.componentOnReady) {
          try {
            await mgr.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('slider-manager-component');
          } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(host), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    wrap.appendChild(
      card('Default (basic)', {
        type: 'basic',
        label: 'Default slider',
        value: 42,
        ariaLabel: 'Default slider',
      }),
    );

    wrap.appendChild(
      card(
        'Inline layout (simulated, aria-labelledby)',
        {
          type: 'basic',
          value: 30,
          ariaLabelledby: 'mx-inline-label',
          label: 'Inline',
        },
        `<div id="mx-inline-label" style="font-weight:600; margin-bottom:8px;">Inline label (external)</div>`,
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal layout (simulated)',
        {
          type: 'multi',
          label: 'Horizontal range',
          lowerValue: 20,
          upperValue: 80,
          orientation: 'horizontal',
          ariaLabelledby: 'mx-horizontal-label',
        },
        `<div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px;">
           <div id="mx-horizontal-label" style="font-weight:600;">Horizontal label area</div>
         </div>`,
      ),
    );

    wrap.appendChild(
      card('Vertical layout', {
        type: 'multi',
        label: 'Vertical range',
        lowerValue: 20,
        upperValue: 80,
        orientation: 'vertical',
        ariaLabel: 'Vertical range slider',
      }),
    );

    wrap.appendChild(
      card(
        'Error / validation (simulated via aria-describedby)',
        {
          type: 'discrete',
          label: 'Validation',
          selectedIndex: 1,
          stringValues: ['Low', 'Med', 'High'],
          ariaDescribedby: 'mx-error',
        },
        `<div id="mx-error" style="color:#a00; font-size:12px; margin-bottom:8px;">Error: selection required.</div>`,
      ),
    );

    wrap.appendChild(
      card('Disabled', {
        type: 'basic',
        disabled: true,
        value: 35,
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
          'Prints computed accessibility wiring for slider-manager. Confirms forwarded `aria-label`, `aria-labelledby`, `aria-describedby`, and `orientation` land on the active child slider element for default/inline/horizontal/vertical, error, and disabled states.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
};
