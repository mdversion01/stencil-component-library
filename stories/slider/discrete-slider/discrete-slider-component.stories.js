// File: src/stories/slider/discrete-slider/discrete-slider-component.stories.js

import { Template, normalizeHtml, getSnapshot } from './discrete-slider-component.story-helpers';

export default {
  title: 'Components/Slider/Discrete Slider',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A discrete slider component allowing selection from predefined string values, with support for horizontal and vertical orientation.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => Template(ctx.args),
      },
    },
  },
  args: {
    disabled: false,
    hideTextBoxes: false,
    hideLeftTextBox: false,
    hideRightTextBox: false,
    orientation: 'horizontal',

    label: 'Rating',
    plumage: false,
    sliderThumbLabel: false,

    selectedIndex: 2,
    stringValues: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],

    tickLabels: true,
    unit: '',
    variant: 'primary',

    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
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
      table: { category: 'State', defaultValue: { summary: false } },
    },

    label: {
      control: 'text',
      description: 'Label for the slider.',
      table: { category: 'Layout & Labeling' },
    },
    hideTextBoxes: {
      control: 'boolean',
      name: 'hide-text-boxes',
      description: 'Hides both value text boxes when true.',
      table: { category: 'Layout & Labeling', defaultValue: { summary: false } },
    },
    hideLeftTextBox: {
      control: 'boolean',
      name: 'hide-left-text-box',
      description: 'Hides the left text box when true.',
      table: { category: 'Layout & Labeling', defaultValue: { summary: false } },
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
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Controls whether the slider is rendered horizontally or vertically.',
      table: { category: 'Layout & Labeling' },
    },

    selectedIndex: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'selected-index',
      description: 'Index of the selected value.',
      table: { category: 'Data & Selection' },
    },
    stringValues: {
      control: 'object',
      description: 'Array of string values for the discrete slider.',
      name: 'string-values',
      table: { category: 'Data & Selection' },
    },

    tickLabels: {
      control: 'boolean',
      name: 'tick-labels',
      description: 'Shows labels for tick marks when true.',
      table: { category: 'Ticks & Labels', defaultValue: { summary: false } },
    },

    sliderThumbLabel: {
      control: 'boolean',
      name: 'slider-thumb-label',
      description: 'Shows the selected value in a label attached to the thumb.',
      table: { category: 'Thumb', defaultValue: { summary: false } },
    },

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
  hideTextBoxes: false,
  hideLeftTextBox: false,
  hideRightTextBox: false,
  orientation: 'horizontal',
  label: 'Rating',
  plumage: false,
  sliderThumbLabel: false,
  selectedIndex: 2,
  stringValues: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  tickLabels: true,
  unit: '',
  variant: 'primary',
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
};
Basic.parameters = {
  ...templateStoryParameters,
  docs: {
    description: {
      story: 'A basic discrete slider allowing selection from predefined string values.',
    },
  },
};

export const Vertical = Template.bind({});
Vertical.args = {
  ...Basic.args,
  label: 'Rating',
  orientation: 'vertical',
  sliderThumbLabel: true,
};
Vertical.parameters = {
  ...templateStoryParameters,
  docs: {
    description: {
      story: 'A vertical discrete slider using `orientation="vertical"`.',
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
      story: 'Demonstrates passing `string-values` as a JSON string attribute in plain HTML.',
    },
  },
};

export const LongList = Template.bind({});
LongList.args = {
  ...Basic.args,
  label: 'Months',
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

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',

  render: () => {
    const wrap = document.createElement('div');
    wrap.className = 'discrete-slider-accessibility-matrix';

    const header = document.createElement('div');

    const headerTitle = document.createElement('strong');
    headerTitle.textContent = 'Accessibility matrix';

    const headerDescription = document.createElement('div');
    headerDescription.className =
      'discrete-slider-accessibility-matrix__description';
    headerDescription.innerHTML =
      'Prints computed <code>role</code> + <code>aria-*</code> + ids for ' +
      'default / inline / horizontal / vertical / validation / disabled.';

    header.appendChild(headerTitle);
    header.appendChild(headerDescription);
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '') => {
      const box = document.createElement('div');
      box.className = 'discrete-slider-accessibility-matrix__card';

      const cardTitle = document.createElement('div');
      cardTitle.className =
        'discrete-slider-accessibility-matrix__card-title';
      cardTitle.textContent = title;

      const demo = document.createElement('div');
      demo.className =
        'discrete-slider-accessibility-matrix__demo';

      const pre = document.createElement('pre');
      pre.className =
        'discrete-slider-accessibility-matrix__output';
      pre.textContent = 'Loading…';

      const mount = document.createElement('div');
      mount.innerHTML = normalizeHtml(`
        ${extraHtml}
        ${Template({ ...Basic.args, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        const host = mount.querySelector(
          'discrete-slider-component',
        );

        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_error) {
            // Continue so the matrix can report available DOM state.
          }
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined(
              'discrete-slider-component',
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
      card('Default', {
        label: 'Default',
        stringValues: ['Low', 'Med', 'High'],
        selectedIndex: 1,
        tickLabels: true,
      }),
    );

    wrap.appendChild(
      card(
        'Inline (simulated, aria-labelledby external)',
        {
          label: '',
          stringValues: ['XS', 'S', 'M', 'L', 'XL'],
          selectedIndex: 2,
          ariaLabelledby: 'mx-inline-label',
        },
        `
<div
  id="mx-inline-label"
  class="discrete-slider-accessibility-matrix__external-label"
>
  Inline label (external)
</div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal (simulated)',
        {
          label: '',
          stringValues: ['A', 'B', 'C', 'D'],
          selectedIndex: 3,
          orientation: 'horizontal',
          ariaLabelledby: 'mx-horizontal-label',
        },
        `
<div class="discrete-slider-accessibility-matrix__horizontal">
  <div
    id="mx-horizontal-label"
    class="discrete-slider-accessibility-matrix__horizontal-label"
  >
    Horizontal label area
  </div>
</div>
        `,
      ),
    );

    wrap.appendChild(
      card('Vertical', {
        label: 'Vertical discrete',
        stringValues: ['A', 'B', 'C', 'D'],
        selectedIndex: 2,
        orientation: 'vertical',
        sliderThumbLabel: true,
        ariaLabel: 'Vertical discrete slider',
      }),
    );

    wrap.appendChild(
      card(
        'Error / validation (simulated via aria-describedby)',
        {
          label: 'Validation',
          stringValues: ['One', 'Two', 'Three'],
          selectedIndex: 0,
          ariaDescribedby: 'mx-error',
        },
        `
<div
  id="mx-error"
  class="discrete-slider-accessibility-matrix__validation"
>
  Error: selection required.
</div>
        `,
      ),
    );

    wrap.appendChild(
      card('Disabled', {
        label: 'Disabled',
        stringValues: ['Low', 'Med', 'High'],
        selectedIndex: 1,
        disabled: true,
        ariaLabel: 'Disabled discrete slider',
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
          'Prints computed accessibility wiring for the discrete slider: the focused element has `role="slider"` with `aria-valuemin/max/now/text`, optional `aria-label` / `aria-labelledby` / `aria-describedby`, and orientation support for horizontal and vertical layouts.',
      },

      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
};

