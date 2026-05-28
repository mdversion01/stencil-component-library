import DocsPage from './plumage-timepicker-component.docs.mdx';
import { DocsWrapStyles, Template, buildDocsHtml, getComputedSnapshot, normalizeHtml } from './plumage-timepicker-component.story-helpers.js';

export default {
  title: 'Components/Timepicker/Plumage Timepicker',
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
The **Plumage Timepicker Component** is a time selection input field styled to match the Plumage design system.

## Controlled value + events
This component supports a controlled (or semi-controlled) \`value\` prop:

- \`value\` (mutable): when set (non-empty), the component parses/displays it.
- On **commit-like actions** (blur/enter/spinner/clear/format toggle), the component updates \`value\` and emits:

### \`timeChange\` (commit)
Emitted on committed changes:
- \`source\`: \`commit\` | \`spinner\` | \`clear\` | \`format\` | \`external\` | \`inputName\` | \`inputId\` | \`constraints\` | \`hideSeconds\`
- \`value\`: formatted value
- \`parts\`: { hour, minute, second, ampm }
- \`isValid\`

### \`timeInput\` (typing)
Emitted on keystrokes (throttled with \`time-input-throttle-ms\`):
- \`raw\`: raw input string
- \`normalized\`: normalized-for-typing string (does **not** pad segments)
- \`caretStart\` / \`caretEnd\`
- \`inputType\` (from InputEvent.inputType)
- \`isValid\`, \`reason\` (pattern/range) and optional \`parts\` (only when complete+valid)

## Accessibility + derived IDs (recommended)
This component derives stable IDs from \`input-id\`:

- **Label id**: \`\${inputId}-label\` (used when \`show-label\` is true)
- **Popover id**: \`\${inputId}-dropdown\`
- **Validation message id**: \`\${inputId}-validation\` (present in DOM; shown when \`validation-message\` has content)
- **Warning message id**: \`\${inputId}-warning\` (present in DOM; shown when time limits are exceeded)

### Accessible name precedence
- If \`show-label\` is true: the input is labelled by \`\${inputId}-label\`.
- Otherwise: if \`aria-labelledby\` is provided, it is used.
- Otherwise: falls back to \`aria-label\`.

### \`aria-describedby\` composition
\`aria-describedby\` merges:
- external ids provided via \`aria-describedby\`
- \`\${inputId}-validation\` when a validation message exists
- \`\${inputId}-warning\` when the warning is visible

## Keyboard model for the popover/spinners
When the popover is open:

- **Tab / Shift+Tab**: focus is trapped within the popover
- **Escape**: closes the popover and returns focus
- **Left / Right**: roving focus between parts (Hour → Minute → Second → AM/PM)
- **Up / Down**: increment/decrement active part
- **PageUp / PageDown**: increment/decrement by 10
- **Home / End**: jump to min/max for that part
- **Enter**: commits the value

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
    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      description: 'Demo wrapper width (px)',
      name: 'wrapper-width',
      table: { category: 'Storybook Only' },
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible label for the timepicker input (used when aria-labelledby is not provided and no visible label).',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ID(s) of element(s) that label the timepicker input (space-separated).',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'ID(s) of external description/help elements (space-separated). Component may append -validation/-warning ids when shown.',
      table: { category: 'Accessibility' },
    },

    showLabel: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'show-label',
      description: 'Whether to show the label visually. If false, label is sr-only (still available to AT).',
    },
    labelText: {
      control: 'text',
      name: 'label-text',
      description: 'Text for the label associated with the timepicker input.',
      table: { category: 'Labeling' },
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'required',
      description: 'Show required indicator (label asterisk).',
    },

    inputId: {
      control: 'text',
      name: 'input-id',
      description: 'ID for the timepicker input element. Used as the base for derived ids: -label/-dropdown/-validation/-warning.',
      table: { category: 'Input Attributes' },
    },
    inputName: {
      control: 'text',
      name: 'input-name',
      description: 'Name attribute for the timepicker input element.',
      table: { category: 'Input Attributes' },
    },

    value: {
      control: 'text',
      name: 'value',
      description: 'Controlled value (optional). If non-empty, component parses/displays it. Updated on commits (blur/enter/spinner/clear/format).',
      table: { category: 'Controlled Value' },
    },

    inputWidth: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'input-width',
      description: 'Custom width for the timepicker input (px). If not set, defaults to auto width.',
      table: { category: 'Layout & Sizing' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the timepicker input. Options are small (sm), large (lg), or default (empty).',
      name: 'size',
      table: { category: 'Layout & Sizing' },
    },

    isTwentyFourHourFormat: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'Format & Options' },
      name: 'is-twenty-four-hour-format',
      description: 'Initial preference (24h). Component may toggle internally.',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'If true, restricts time selection to 24-hour format only.',
    },
    twelveHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twelve-hour-only',
      description: 'If true, restricts time selection to 12-hour format only.',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'If true, hides the seconds spinner/part.',
    },

    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'If true, the button to open the timepicker dropdown is hidden (manual input only).',
    },

    timeInputThrottleMs: {
      control: { type: 'number', min: 0, step: 10 },
      name: 'time-input-throttle-ms',
      description: 'Throttle window for timeInput events (ms). Set 0 to disable throttling.',
      table: { category: 'Events' },
    },

    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disabled',
      description: 'If true, disables the entire timepicker (input + buttons + popover).',
    },
    isValid: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'State' },
      name: 'is-valid',
      description: 'Indicates whether the current input value is valid (component updates this internally).',
    },

    validation: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      name: 'validation',
      description: 'If true, applies Plumage underline styles to indicate validation state.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'Validation message to display below the timepicker input.',
      table: { category: 'Validation' },
    },
  },

  args: {
    wrapperWidth: 280,
    ariaLabel: 'Time Picker',
    ariaLabelledby: '',
    ariaDescribedby: '',
    showLabel: false,
    labelText: 'Enter Time',
    inputId: 'time-input',
    inputName: 'time',
    value: '',
    isTwentyFourHourFormat: true,
    required: false,
    size: '',
    validationMessage: '',
    twentyFourHourOnly: false,
    twelveHourOnly: false,
    hideTimepickerBtn: false,
    isValid: true,
    hideSeconds: false,
    inputWidth: null,
    validation: false,
    disabled: false,
    timeInputThrottleMs: 50,
  },
};

export const Default = Template.bind({});
Default.args = {
  wrapperWidth: 280,
  ariaLabel: 'Time Picker',
  ariaLabelledby: '',
  ariaDescribedby: '',
  showLabel: false,
  labelText: 'Enter Time',
  inputId: 'time-input',
  inputName: 'time',
  value: '',
  isTwentyFourHourFormat: true,
  required: false,
  size: '',
  validationMessage: '',
  twentyFourHourOnly: false,
  twelveHourOnly: false,
  hideTimepickerBtn: false,
  isValid: true,
  hideSeconds: false,
  inputWidth: null,
  validation: false,
  disabled: false,
  timeInputThrottleMs: 50,
};
Default.storyName = 'Default Plumage Styled Timepicker';
Default.parameters = {
  docs: {
    description: { story: 'Default configuration of the Plumage Timepicker.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const Small = Template.bind({});
Small.args = {
  ...Default.args,
  wrapperWidth: 220,
  size: 'sm',
};
Small.storyName = 'Small Size (no label)';
Small.parameters = {
  docs: {
    description: { story: 'Small size variant (`size="sm"`). Label remains sr-only unless `show-label` is enabled.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const LargeWithVisibleLabel = Template.bind({});
LargeWithVisibleLabel.args = {
  ...Default.args,
  wrapperWidth: 340,
  size: 'lg',
  showLabel: true,
  labelText: 'Enter Time',
  inputId: 'pl-lg',
};
LargeWithVisibleLabel.storyName = 'Large Size (with label)';
LargeWithVisibleLabel.parameters = {
  docs: {
    description: { story: 'Large size variant (`size="lg"`) with visible label (`show-label`).' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const TwentyFourHourOnly = Template.bind({});
TwentyFourHourOnly.args = {
  ...Default.args,
  wrapperWidth: 320,
  twentyFourHourOnly: true,
  twelveHourOnly: false,
  isTwentyFourHourFormat: true,
  showLabel: true,
  labelText: '24-hour Time',
  inputId: 'pl-24h',
};
TwentyFourHourOnly.storyName = '24-Hour Format Only';
TwentyFourHourOnly.parameters = {
  docs: {
    description: { story: 'Restricts to 24-hour format only (`twenty-four-hour-only`).' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const TwelveHourOnly = Template.bind({});
TwelveHourOnly.args = {
  ...Default.args,
  wrapperWidth: 320,
  twentyFourHourOnly: false,
  twelveHourOnly: true,
  isTwentyFourHourFormat: false,
  showLabel: true,
  labelText: '12-hour Time',
  inputId: 'pl-12h',
};
TwelveHourOnly.storyName = '12-Hour Format Only';
TwelveHourOnly.parameters = {
  docs: {
    description: { story: 'Restricts to 12-hour format only (`twelve-hour-only`).' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const HideSeconds = Template.bind({});
HideSeconds.args = {
  ...Default.args,
  wrapperWidth: 280,
  hideSeconds: true,
  showLabel: true,
  labelText: 'HH:mm (no seconds)',
  inputId: 'pl-nosec',
};
HideSeconds.storyName = 'Hide Seconds';
HideSeconds.parameters = {
  docs: {
    description: { story: 'Hides the seconds spinner/part (`hide-seconds`).' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const NoDropdownButton = Template.bind({});
NoDropdownButton.args = {
  ...Default.args,
  wrapperWidth: 260,
  hideTimepickerBtn: true,
  showLabel: true,
  labelText: 'Manual Entry Only',
  inputId: 'pl-nodrop',
};
NoDropdownButton.storyName = 'No Dropdown Button';
NoDropdownButton.parameters = {
  docs: {
    description: { story: 'Hides the dropdown trigger button (`hide-timepicker-btn`) so users type time manually.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const WithValidationMessage = Template.bind({});
WithValidationMessage.args = {
  ...Default.args,
  wrapperWidth: 320,
  showLabel: true,
  labelText: 'Time with Validation',
  required: true,
  inputId: 'pl-validation',
  isValid: false,
  validation: true,
  validationMessage: 'Please enter a valid time.',
};
WithValidationMessage.storyName = 'With Validation Message';
WithValidationMessage.parameters = {
  docs: {
    description: {
      story: 'Shows Plumage invalid underline styling + a validation message. Clears when the user clears, types, or uses spinners. Format toggle does not clear validation.',
    },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const CustomInputWidth = Template.bind({});
CustomInputWidth.args = {
  ...Default.args,
  wrapperWidth: 460,
  inputWidth: 320,
  showLabel: true,
  labelText: 'Custom Width',
  inputId: 'pl-width',
};
CustomInputWidth.storyName = 'Custom Input Width';
CustomInputWidth.parameters = {
  docs: {
    description: { story: 'Custom input width via `input-width`.' },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
  },
};

export const ControlledValueExample = Template.bind({});
ControlledValueExample.args = {
  ...Default.args,
  wrapperWidth: 320,
  showLabel: true,
  labelText: 'Controlled Value',
  inputId: 'pl-controlled',
  value: '13:05:09',
  isTwentyFourHourFormat: true,
};
ControlledValueExample.storyName = 'Controlled Value (value="13:05:09")';
ControlledValueExample.parameters = {
  docs: {
    description: {
      story: 'Demonstrates initializing the component with a controlled value. On commit actions, the component updates its mutable `value` prop and emits `timeChange`.',
    },
    story: { height: '200px' },
    source: { transform: (_code, ctx) => buildDocsHtml(ctx.args) },
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
        Renders multiple configurations and prints computed <code>role</code>, <code>aria-*</code>, and derived ids for
        <code>&lt;plumage-timepicker-component&gt;</code>.
      </div>
    `;
    wrap.appendChild(header);

    const waitFor = async (fn, timeoutMs = 2500, intervalMs = 50) => {
      const start = performance.now();
      return new Promise((resolve, reject) => {
        const tick = async () => {
          try {
            const val = await fn();
            if (val) return resolve(val);
          } catch {
            // keep retrying
          }
          if (performance.now() - start > timeoutMs) return reject(new Error('Timed out waiting for component'));
          setTimeout(tick, intervalMs);
        };
        tick();
      });
    };

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
        try {
          if (window.customElements?.whenDefined) {
            await customElements.whenDefined('plumage-timepicker-component');
          }

          const cmp = await waitFor(() => mount.querySelector('plumage-timepicker-component'));
          if (cmp?.componentOnReady) await cmp.componentOnReady();

          await waitFor(() => cmp.querySelector('input.time-input'));

          pre.textContent = JSON.stringify(getComputedSnapshot(cmp, mount), null, 2);
        } catch (err) {
          pre.textContent = `Accessibility Matrix error:\n${String(err?.stack || err)}`;
        }
      };

      setTimeout(() => requestAnimationFrame(update), 0);

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    wrap.appendChild(
      card('Default (sr-only label, aria-label fallback)', {
        showLabel: false,
        labelText: 'Enter time',
        inputId: 'mx-pl-default',
        inputName: 'time',
        ariaLabel: 'Time Picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
        disabled: false,
      }),
    );

    wrap.appendChild(
      card(
        'Inline (external aria-labelledby + aria-describedby)',
        {
          showLabel: false,
          labelText: '',
          inputId: 'mx-pl-inline',
          ariaLabel: 'Ignored',
          ariaLabelledby: 'mx-pl-inline-label',
          ariaDescribedby: 'mx-pl-inline-help',
          isValid: true,
          validation: false,
          disabled: false,
        },
        `
        <div id="mx-pl-inline-label" style="font-weight:600; margin-bottom:6px;">External label for time</div>
        <div id="mx-pl-inline-help" style="opacity:.8; margin-bottom:8px;">Help: enter time in HH:mm.</div>
        `,
      ),
    );

    wrap.appendChild(
      card(
        'Error / validation (aria-describedby should include -validation)',
        {
          showLabel: true,
          labelText: 'Add time',
          inputId: 'mx-pl-error',
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: 'mx-pl-error-help',
          validation: true,
          isValid: false,
          validationMessage: 'Time is required.',
          disabled: false,
        },
        `
        <div id="mx-pl-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: When a validation message exists, aria-describedby should include <code>mx-pl-error-validation</code>.
        </div>
        `,
      ),
    );

    wrap.appendChild(
      card('Disabled (popover should remain inert/hidden)', {
        disabled: true,
        showLabel: true,
        labelText: 'Disabled time',
        inputId: 'mx-pl-disabled',
        ariaLabel: 'Disabled time picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders multiple configurations and prints computed accessibility wiring: aria-label/labelledby/describedby, derived ids (-label/-dropdown/-validation/-warning), popover role + inert/hidden state, and spinbutton semantics (role + aria-value*).',
      },
    },
  },
};
