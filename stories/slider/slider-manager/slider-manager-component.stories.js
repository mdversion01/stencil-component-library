// File: src/stories/slider/slider-manager/slider-manager-component.stories.js

import { Template, normalizeHtml, getSnapshot } from './slider-manager-component.story-helpers';

export default {
  title: 'Components/Slider/Slider Manager',
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
    wrap.className = 'slider-manager-accessibility-matrix';

    const header = document.createElement('div');

    const headerTitle = document.createElement('strong');
    headerTitle.textContent = 'Accessibility matrix';

    const headerDescription = document.createElement('div');
    headerDescription.className =
      'slider-manager-accessibility-matrix__description';
    headerDescription.innerHTML =
      'Prints computed <code>role</code> + <code>aria-*</code> + ids for ' +
      'default / inline / horizontal / vertical / validation / disabled.';

    const headerNote = document.createElement('div');
    headerNote.className =
      'slider-manager-accessibility-matrix__note';
    headerNote.innerHTML =
      'Note: Slider semantics (<code>role="slider"</code>, ' +
      '<code>aria-valuenow</code>, keyboard) live in the child slider components. ' +
      'This story validates manager→child aria forwarding.';

    headerDescription.appendChild(headerNote);
    header.appendChild(headerTitle);
    header.appendChild(headerDescription);
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '') => {
      const box = document.createElement('div');
      box.className = 'slider-manager-accessibility-matrix__card';

      const cardTitle = document.createElement('div');
      cardTitle.className =
        'slider-manager-accessibility-matrix__card-title';
      cardTitle.textContent = title;

      const demo = document.createElement('div');
      demo.className =
        'slider-manager-accessibility-matrix__demo';

      const pre = document.createElement('pre');
      pre.className =
        'slider-manager-accessibility-matrix__output';
      pre.textContent = 'Loading…';

      const mount = document.createElement('div');
      mount.innerHTML = normalizeHtml(`
        ${extraHtml}
        ${Template({ ...Basic.args, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        const manager =
          mount.querySelector('slider-manager-component');

        if (manager?.componentOnReady) {
          try {
            await manager.componentOnReady();
          } catch (_error) {
            // Continue so the matrix can report available DOM state.
          }
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined(
              'slider-manager-component',
            );
          } catch (_error) {
            // Continue so the matrix can report available DOM state.
          }
        }

        pre.textContent = JSON.stringify(
          getSnapshot(mount),
          null,
          2,
        );
      };

      queueMicrotask(() =>
        requestAnimationFrame(update),
      );

      box.appendChild(cardTitle);
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
        `
<div
  id="mx-inline-label"
  class="slider-manager-accessibility-matrix__external-label"
>
  Inline label (external)
</div>
        `,
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
        `
<div class="slider-manager-accessibility-matrix__horizontal">
  <div
    id="mx-horizontal-label"
    class="slider-manager-accessibility-matrix__horizontal-label"
  >
    Horizontal label area
  </div>
</div>
        `,
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
        `
<div
  id="mx-error"
  class="slider-manager-accessibility-matrix__validation"
>
  Error: selection required.
</div>
        `,
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
    controls: {
      disable: true,
    },

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
