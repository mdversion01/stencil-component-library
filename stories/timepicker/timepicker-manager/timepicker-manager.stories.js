import DocsPage from './timepicker-manager-component.docs.mdx';
import {
  DocsWrapStyles,
  Template,
  buildDocsHtml,
  getChild,
  getSnapshot,
  normalizeHtml,
} from './timepicker-manager-component.story-helpers.js';

export default {
  title: 'Components/Timepicker/Timepicker Manager',
  tags: ['autodocs'],
  decorators: [
    Story => {
      const wrap = document.createElement('div');
      wrap.appendChild(DocsWrapStyles());

      const out = Story();

      if (typeof out === 'string') {
        const mount = document.createElement('div');
        mount.innerHTML = out;
        wrap.appendChild(mount);
      } else if (out instanceof Node) {
        wrap.appendChild(out);
      } else {
        const mount = document.createElement('div');
        mount.textContent = String(out ?? '');
        wrap.appendChild(mount);
      }

      return wrap;
    },
  ],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component: `
The **Timepicker Manager** wraps a timepicker input and forwards props to either:
- \`<timepicker-component>\` (classic) or
- \`<plumage-timepicker-component>\` (plumage)

It provides a consistent API surface (a11y, value/events, methods) across both implementations.

## Controlled value + events
The manager forwards \`value\` and re-emits child events:

### Passthrough events
- \`timeChange\`
- \`timeInput\`

### Namespaced events (recommended for parent listeners)
To avoid collisions when multiple timepickers exist in the same page:
- \`managerTimeChange\` includes \`managerInputId\` + \`impl\`
- \`managerTimeInput\` includes \`managerInputId\` + \`impl\`

\`impl\` is either:
- \`timepicker-component\` or \`plumage-timepicker-component\`

## Accessibility + derived IDs (recommended)
The manager uses \`input-id\` as the stable base for relationships and forwards a11y props to the child.

### Accessible name precedence (manager-level)
- If \`aria-labelledby\` is provided: it wins and \`aria-label\` is not forwarded.
- Otherwise: \`aria-label\` is forwarded when present.

### \`aria-describedby\` composition (manager-level)
The manager forwards \`aria-describedby\` and **appends** the child validation container id when a validation message exists:
- external ids via \`aria-describedby\`
- \`\${inputId}-validation\` when \`validation-message\` has content

## Public methods
The manager exposes methods for form/keyboard-first flows:

- \`focusInput({ open: true })\`
  - focuses the child input
  - optionally opens the popover
  - when opened, focuses the Hour spinbutton so arrow keys work immediately
- \`close()\`
  - closes the popover (both implementations)

## Keyboard model
When the popover is open (both implementations), the keyboard model is consistent:
- Tab trap, Escape to close, Left/Right roving focus, Up/Down increment, PageUp/PageDown ±10, Home/End min/max, Enter commit.

> Note: 508 compliance also depends on page-level usage: unique \`input-id\` per instance, visible or programmatic labels, and consistent error messaging.
`.trim(),
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible label for the timepicker input (used when aria-labelledby not provided).',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID(s) of element(s) that label the timepicker input (space-separated). Takes precedence over aria-label.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'ID(s) of external description/help elements (space-separated). If validationMessage is present, manager appends the child validation element id.',
      table: { category: 'Accessibility' },
    },

    showLabel: {
      control: 'boolean',
      name: 'show-label',
      table: { defaultValue: { summary: true }, category: 'Labeling' },
      description: 'Whether to show the label (for demo purposes; if not showing a visible label, prefer aria-labelledby or aria-label).',
    },
    labelText: {
      control: 'text',
      name: 'label-text',
      description: 'Text for the label (if show-label is true)',
      table: { category: 'Labeling' },
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'required',
      description: 'Show required indicator (label asterisk) where supported.',
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      description: 'ID for the timepicker input (should be unique per instance).',
      table: { category: 'Input Attributes' },
    },
    inputName: {
      control: 'text',
      name: 'input-name',
      description: 'Name attribute for the timepicker input.',
      table: { category: 'Input Attributes' },
    },

    inputWidth: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'input-width',
      description: 'Custom width for the timepicker input (px).',
      table: { category: 'Layout & Sizing' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the timepicker input.',
      table: { category: 'Layout & Sizing' },
    },

    isTwentyFourHourFormat: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'Format & Options' },
      name: 'is-twenty-four-hour-format',
      description: 'Initial format preference (24h).',
    },
    twelveHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twelve-hour-only',
      description: 'Only allow 12-hour format.',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'Only allow 24-hour format.',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'Hide seconds UI.',
    },

    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'Hide the timepicker toggle button.',
    },

    disableTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disable-timepicker',
      description: 'Disable the timepicker (input + buttons + dropdown). Passed to child as disableTimepicker or disabled (Plumage).',
    },
    isValid: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'State' },
      name: 'is-valid',
      description: 'Whether the current value is considered valid.',
    },

    validation: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      name: 'validation',
      description:
        'Apply invalid styling (drives invalid/is-invalid inside the rendered timepicker). Manager will also append the child validation element id to aria-describedby when validationMessage is present.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'Validation message to display (if any).',
      table: { category: 'Validation' },
    },

    usePlTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Rendering Mode' },
      name: 'use-pl-timepicker',
      description: 'Render <plumage-timepicker-component> instead of <timepicker-component>.',
    },

    value: {
      control: 'text',
      table: { category: 'Controlled Value' },
      description: 'Controlled time value forwarded to the child timepicker.',
    },
    timeInputThrottleMs: {
      control: { type: 'number', min: 0, step: 10 },
      name: 'time-input-throttle-ms',
      description: 'Throttle window for timeInput events (ms).',
      table: { category: 'Controlled Value' },
    },

    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      name: 'wrapper-width',
      description: 'Demo wrapper width (px), for Storybook only.',
      table: { category: 'Storybook Only' },
    },
  },
  args: {
    ariaLabel: 'Time Picker',
    ariaLabelledby: '',
    ariaDescribedby: '',
    disableTimepicker: false,
    hideSeconds: false,
    hideTimepickerBtn: false,
    inputId: 'default-time-input',
    inputName: 'time',
    inputWidth: null,
    isTwentyFourHourFormat: true,
    isValid: true,
    labelText: 'Add Time',
    required: false,
    showLabel: true,
    size: '',
    twelveHourOnly: false,
    twentyFourHourOnly: false,
    usePlTimepicker: false,
    validation: false,
    validationMessage: '',
    value: '',
    timeInputThrottleMs: 50,
    wrapperWidth: 240,
  },
};

export const Default = Template.bind({});
Default.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: '',
  ariaDescribedby: '',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'default-time-input',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: true,
  labelText: 'Add Time',
  required: false,
  showLabel: true,
  size: '',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  value: '',
  timeInputThrottleMs: 50,
  wrapperWidth: 240,
};
Default.storyName = 'Default Timepicker Manager';
Default.parameters = {
  docs: {
    description: {
      story: 'Default configuration with a visible label. For best accessibility, prefer a visible label or external aria-labelledby.',
    },
    story: { height: '220px' },
  },
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  ...Default.args,
  showLabel: false,
  size: 'sm',
  inputId: 'time-input-sm',
};
SmallSize.storyName = 'Small Size (no Label)';
SmallSize.parameters = {
  docs: {
    description: {
      story: 'Small input with no visible label. In real usage, provide aria-labelledby to an external label or aria-label.',
    },
    story: { height: '220px' },
  },
};

export const LargeWithLabel = Template.bind({});
LargeWithLabel.args = {
  ...Default.args,
  size: 'lg',
  showLabel: true,
  inputId: 'time-input-lg',
};
LargeWithLabel.storyName = 'Large Size with Label';
LargeWithLabel.parameters = {
  docs: {
    description: { story: 'Large input with a visible label.' },
    story: { height: '220px' },
  },
};

export const TwelveHourOnly = Template.bind({});
TwelveHourOnly.args = {
  ...Default.args,
  isTwentyFourHourFormat: false,
  twelveHourOnly: true,
  twentyFourHourOnly: false,
  labelText: '12-hour Time',
  inputId: 'time-12h-only',
  wrapperWidth: 340,
};
TwelveHourOnly.storyName = '12-Hour Only';
TwelveHourOnly.parameters = {
  docs: {
    description: { story: 'Only allow 12-hour format.' },
    story: { height: '220px' },
  },
};

export const TwentyFourHourOnlyHideSeconds = Template.bind({});
TwentyFourHourOnlyHideSeconds.args = {
  ...Default.args,
  twentyFourHourOnly: true,
  twelveHourOnly: false,
  hideSeconds: true,
  labelText: '24-hour (HH:mm)',
  inputId: 'time-24h-only',
  wrapperWidth: 340,
};
TwentyFourHourOnlyHideSeconds.storyName = '24-Hour Only (with Seconds Hidden)';
TwentyFourHourOnlyHideSeconds.parameters = {
  docs: {
    description: { story: 'Only allow 24-hour format and hide seconds.' },
    story: { height: '220px' },
  },
};

export const CustomInputWidth = Template.bind({});
CustomInputWidth.args = {
  ...Default.args,
  inputId: 'time-custom-width',
  labelText: 'Custom Width',
  inputWidth: 260,
  wrapperWidth: 420,
};
CustomInputWidth.storyName = 'Custom Input Width';
CustomInputWidth.parameters = {
  docs: {
    description: { story: 'Custom input width via input-width.' },
    story: { height: '220px' },
  },
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  ...Default.args,
  inputId: 'time-input-validation',
  validation: true,
  isValid: false,
  validationMessage: 'Please enter a valid time.',
  wrapperWidth: 420,
};
WithValidation.storyName = 'With Validation Message';
WithValidation.parameters = {
  docs: {
    description: {
      story: 'Invalid styling + validation message. Manager appends the child validation element id to aria-describedby when validationMessage is present.',
    },
    story: { height: '240px' },
  },
};

export const PlumageStyle = Template.bind({});
PlumageStyle.args = {
  ...Default.args,
  usePlTimepicker: true,
  inputId: 'time-plumage',
  labelText: 'Add Time',
  wrapperWidth: 520,
};
PlumageStyle.storyName = 'Plumage Style Timepicker';
PlumageStyle.parameters = {
  docs: {
    description: {
      story: 'Renders the <plumage-timepicker-component> when use-pl-timepicker is true. Disabled mapping differs (disabled vs disableTimepicker).',
    },
    story: { height: '240px' },
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
        Renders multiple configurations and prints computed labeling/description wiring for the manager + child:
        <code>aria-label</code>, <code>aria-labelledby</code>, <code>aria-describedby</code>, and inferred validation id.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '', containerStyle = '') => {
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
      if (containerStyle) demo.setAttribute('style', containerStyle);

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
        ${Template({ ...Default.args, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        const mgr = mount.querySelector('timepicker-manager');

        if (mgr?.componentOnReady) {
          try {
            await mgr.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('timepicker-manager');
          } catch (_e) {}
        }

        const child = getChild(mgr);
        if (child?.componentOnReady) {
          try {
            await child.componentOnReady();
          } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(mgr, mount), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    wrap.appendChild(
      card('Default (visible label)', {
        showLabel: true,
        labelText: 'Add time',
        inputId: 'mx-time-default',
        inputName: 'time',
        ariaLabel: 'Time Picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
        usePlTimepicker: false,
        wrapperWidth: 260,
      }),
    );

    wrap.appendChild(
      card(
        'Inline (external aria-labelledby + aria-describedby)',
        {
          showLabel: false,
          labelText: '',
          inputId: 'mx-time-inline',
          ariaLabel: 'Ignored',
          ariaLabelledby: 'mx-inline-label',
          ariaDescribedby: 'mx-inline-help',
          isValid: true,
          validation: false,
          validationMessage: '',
          usePlTimepicker: false,
          wrapperWidth: 260,
        },
        `
        <div id="mx-inline-label" style="font-weight:600; margin-bottom:6px;">External label for time</div>
        <div id="mx-inline-help" style="opacity:.8; margin-bottom:8px;">Help text: enter time in HH:mm.</div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal (simulated layout, external labelledby)',
        {
          showLabel: false,
          labelText: '',
          inputId: 'mx-time-horizontal',
          ariaLabelledby: 'mx-horizontal-label',
          ariaDescribedby: '',
          isValid: true,
          usePlTimepicker: false,
          wrapperWidth: 320,
        },
        `
        <div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px; margin-bottom:8px;">
          <div id="mx-horizontal-label" style="font-weight:600;">Time (horizontal label area)</div>
        </div>
        `,
        'max-width:860px;',
      ),
    );

    wrap.appendChild(
      card(
        'Error / validation (simulated, describedby + inferred validation id)',
        {
          showLabel: true,
          labelText: 'Add time',
          inputId: 'mx-time-error',
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: 'mx-error-help',
          validation: true,
          isValid: false,
          validationMessage: 'Time is required.',
          usePlTimepicker: false,
          wrapperWidth: 420,
        },
        `
        <div id="mx-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: required field. Manager should append <code>mx-time-error-validation</code> to aria-describedby when validationMessage exists.
        </div>
        `,
      ),
    );

    wrap.appendChild(
      card('Disabled (plumage)', {
        usePlTimepicker: true,
        disableTimepicker: true,
        showLabel: true,
        labelText: 'Disabled time',
        inputId: 'mx-time-disabled',
        ariaLabel: 'Disabled time picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
        wrapperWidth: 320,
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the timepicker manager + its child: aria precedence (labelledby > label), describedby forwarding + validation id appending, simulated inline/horizontal layouts, validation, and disabled state.',
      },
    },
  },
};
