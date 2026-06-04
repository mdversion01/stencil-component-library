import DocsPage from './toggle-switch-component.docs.mdx';
import {
  sampleMulti,
  buildDocsHtml,
  renderToggle,
  snapshotA11y,
  mountToggle,
} from './toggle-switch-component.story-helpers';

export default {
  title: 'Form/Toggle Switch',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'A single or multi toggle (Bootstrap-style or custom) with validation, sizes, inline layout, and event emission (`checkedChanged`).\n\n' +
          'Accessibility notes:\n' +
          '- Single switch uses native <input type="checkbox"> with role="switch" and label association via htmlFor/id.\n' +
          '- If label text is empty (single mode), set `aria-label` (prop) for an accessible name.\n' +
          '- Multi-switch group uses role="group"; you can label it via `aria-labelledby` (attribute) pointing to external label element(s).\n' +
          '- Invalid state uses aria-invalid and aria-describedby -> validation message ids derived from input ids.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    demoWidth: {
      control: { type: 'number', min: 180, step: 10 },
      name: 'demo-width',
      table: { category: 'Storybook Only' },
      description: 'Wrapper width (px). Used for displaying in Storybook.',
    },
    showEventLog: {
      control: 'boolean',
      name: 'show-event-log',
      table: { category: 'Storybook Only', defaultValue: { summary: false } },
      description: 'Show live event log for checkedChanged. Used for displaying in Storybook.',
    },

    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Single mode only: fallback accessible name when `label-txt` is empty. (Prop: `ariaLabel` on the component.)',
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'Multi mode only: label the group wrapper by id(s) of external elements (space-separated).',
    },

    inline: {
      control: 'boolean',
      table: { category: 'Layout', defaultValue: { summary: false } },
      description: 'Inline layout (multi mode only).',
    },

    checked: {
      control: 'boolean',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Checked state (single mode) or initial checked state (multi mode).',
    },
    customSwitch: {
      control: 'boolean',
      name: 'custom-switch',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Use custom switch style.',
    },
    disabled: {
      control: 'boolean',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Disable the toggle switch.',
    },
    inputId: { control: 'text', name: 'input-id', table: { category: 'Toggle Switch Attribute' }, description: 'ID for the input element.' },
    labelTxt: { control: 'text', name: 'label-txt', table: { category: 'Toggle Switch Attribute' }, description: 'Label text for the toggle switch.' },
    newToggleTxt: {
      control: 'object',
      name: 'new-toggle-txt',
      table: { category: 'Toggle Switch Attribute' },
      description: 'Toggle text to show changes when toggling. Also supported as attribute via `new-toggle-txt` (JSON).',
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      table: { category: 'Toggle Switch Attribute' },
      description: 'Size of the toggle switch (`sm`, `lg`, or blank for default).',
    },
    switches: {
      control: 'boolean',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Multi mode (array of toggle switches). If false, renders a single toggle switch.',
    },
    switchesArray: {
      control: 'object',
      name: 'switches-array',
      table: { category: 'Toggle Switch Attribute' },
      description: 'Multi mode items (property-only; set in JS).',
    },
    toggleTxt: {
      control: 'boolean',
      name: 'toggle-txt',
      table: { category: 'Toggle Switch Attribute', defaultValue: { summary: false } },
      description: 'Show toggle text (on/off) based on checked state.',
    },
    value: { control: 'text', table: { category: 'Toggle Switch Attribute' }, description: 'Value of the toggle switch (single mode) or value prefix for multi mode (optional).' },

    required: { control: 'boolean', table: { category: 'Validation', defaultValue: { summary: false } }, description: 'Mark the toggle switch as required.' },
    validation: { control: 'boolean', table: { category: 'Validation', defaultValue: { summary: false } }, description: 'Enable validation for the toggle switch.' },
    validationMessage: { control: 'text', name: 'validation-message', table: { category: 'Validation' }, description: 'Validation message to display when the toggle switch is invalid.' },
  },
};

export const Single_Bootstrap = {
  render: (args) => renderToggle(args),
  args: {
    demoWidth: 420,
    showEventLog: true,
    inputId: 'demo-toggle-single',
    labelTxt: 'Enable notifications',
    checked: false,
    customSwitch: false,
    disabled: false,
    inline: false,
    required: false,
    size: '',
    switches: false,
    switchesArray: [],
    toggleTxt: true,
    newToggleTxt: { on: 'On', off: 'Off' },
    validation: false,
    validationMessage: '',
    value: 'notifications',
    ariaLabel: 'Toggle',
    ariaLabelledby: '',
  },
};
Single_Bootstrap.name = 'Single Toggle Switch (Bootstrap)';
Single_Bootstrap.parameters = {
  docs: { description: { story: 'A single toggle switch using the default Bootstrap styles.' } },
};

export const Single_WithValidation = {
  render: (args) => renderToggle(args),
  args: {
    ...Single_Bootstrap.args,
    inputId: 'demo-toggle-required',
    required: true,
    validation: true,
    validationMessage: 'This switch is required.',
    labelTxt: 'Accept terms',
  },
};
Single_WithValidation.name = 'Single Toggle Switch, with Required and Validation (Bootstrap)';
Single_WithValidation.parameters = {
  docs: { description: { story: 'A single toggle switch using with `required` and `validation` enabled.' } },
};

export const Single_Custom = {
  render: (args) => renderToggle(args),
  args: {
    ...Single_Bootstrap.args,
    inputId: 'demo-toggle-custom',
    customSwitch: true,
    disabled: false,
    size: '',
    labelTxt: 'Use custom theme',
    toggleTxt: true,
    newToggleTxt: { on: 'Enabled', off: 'Disabled' },
    required: false,
    validation: false,
    validationMessage: '',
  },
};
Single_Custom.name = 'Single Toggle Switch (Custom)';
Single_Custom.parameters = { docs: { description: { story: 'A single custom toggle switch.' } } };

export const Single_Custom_Required = {
  render: (args) => renderToggle(args),
  args: {
    ...Single_Bootstrap.args,
    inputId: 'demo-toggle-custom-required',
    customSwitch: true,
    disabled: false,
    size: '',
    labelTxt: 'Use custom theme',
    toggleTxt: true,
    newToggleTxt: { on: 'Enabled', off: 'Disabled' },
    required: true,
    validation: true,
    validationMessage: 'Please enable this switch.',
  },
};
Single_Custom_Required.name = 'Single Toggle Switch, with Required and Validation (Custom)';
Single_Custom_Required.parameters = {
  docs: { description: { story: 'A single custom toggle switch using with `required` and `validation` enabled.' } },
};

export const Multi_Bootstrap = {
  render: (args) => renderToggle(args),
  args: {
    demoWidth: 520,
    showEventLog: true,
    switches: true,
    switchesArray: sampleMulti,
    inputId: 'settings-group',
    customSwitch: false,
    inline: true,
    size: '',
    toggleTxt: false,
    newToggleTxt: { on: 'On', off: 'Off' },
    required: false,
    validation: false,
    validationMessage: '',
    value: '',
    checked: false,
    disabled: false,
    labelTxt: '',
    ariaLabel: 'Toggle',
    ariaLabelledby: '',
  },
};
Multi_Bootstrap.name = 'Multiple Inline Toggle Switches (Bootstrap)';
Multi_Bootstrap.parameters = { docs: { description: { story: 'A group of toggle switches using the default Bootstrap styles.' } } };

export const Multi_Custom_Inline_Sizes = {
  render: (args) => renderToggle(args),
  args: {
    ...Multi_Bootstrap.args,
    inputId: 'settings-inline-sizes',
    customSwitch: true,
    inline: true,
    size: '',
    switchesArray: [
      { id: 'loc', label: 'Location', value: 'loc', checked: true, size: 'sm', toggleTxt: true },
      {
        id: 'cam',
        label: 'Camera',
        value: 'cam',
        checked: false,
        size: '',
        toggleTxt: true,
        newToggleTxt: { on: 'Yes', off: 'No' },
        required: true,
        validation: true,
        validationMessage: 'Please enable.',
      },
      { id: 'mic', label: 'Microphone', value: 'mic', checked: false, size: 'lg', disabled: true },
    ],
  },
};
Multi_Custom_Inline_Sizes.name = 'Multiple Switches, Inline, Sizes and Disabled (Custom)';
Multi_Custom_Inline_Sizes.parameters = {
  docs: { description: { story: 'A group of custom toggle switches in inline layout with different sizes and a disabled switch.' } },
};

export const Multi_WithValidation = {
  render: (args) => renderToggle(args),
  args: {
    ...Multi_Bootstrap.args,
    inputId: 'settings-validated',
    inline: false,
    switchesArray: [
      { id: 't1', label: 'Primary', value: 'p', checked: true, required: true, validation: true, validationMessage: 'Please enable Primary.' },
      { id: 't2', label: 'Secondary (required)', value: 's', checked: false, required: true, validation: true, validationMessage: 'Please enable Secondary.' },
      { id: 't3', label: 'Optional', value: 'o', checked: false, disabled: true },
    ],
  },
};
Multi_WithValidation.name = 'Multiple Toggle Switches using Required, Validation and Disabled (Bootstrap)';
Multi_WithValidation.parameters = { docs: { description: { story: 'A group of toggle switches with validation enabled and disabled.' } } };

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (_args, context) => {
    void context;

    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Includes examples (default/inline/horizontal/error/disabled) and prints computed <code>role</code>, <code>aria-*</code>, and derived ids.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title) => {
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

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);

      return { box, demo, pre };
    };

    const c1 = card('Default (single, labelled via <label>)');
    const c2 = card('Inline (multi, role="group", inline layout)');
    const c3 = card('Horizontal (multi, external label + aria-labelledby)');
    const c4 = card('Error / validation (single required + invalid + describedby)');
    const c5 = card('Disabled (single disabled)');

    wrap.appendChild(c1.box);
    wrap.appendChild(c2.box);
    wrap.appendChild(c3.box);
    wrap.appendChild(c4.box);
    wrap.appendChild(c5.box);

    const ex1 = mountToggle({
      inputId: 'mx-default',
      labelTxt: 'Enable notifications',
      switches: false,
      toggleTxt: true,
      newToggleTxt: { on: 'On', off: 'Off' },
      required: false,
      validation: false,
      ariaLabel: 'Toggle',
    });
    c1.demo.appendChild(ex1);

    const ex2 = mountToggle({
      inputId: 'mx-inline',
      switches: true,
      inline: true,
      customSwitch: false,
      switchesArray: [
        { id: 'a', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
        { id: 'b', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
      ],
      ariaLabelledby: '',
    });
    c2.demo.appendChild(ex2);

    const horizWrap = document.createElement('div');
    horizWrap.style.display = 'grid';
    horizWrap.style.gridTemplateColumns = '220px 1fr';
    horizWrap.style.gap = '12px';
    horizWrap.style.alignItems = 'start';
    horizWrap.style.maxWidth = '860px';

    const horizLabel = document.createElement('div');
    horizLabel.id = 'mx-horizontal-label';
    horizLabel.style.fontWeight = '600';
    horizLabel.textContent = 'Connectivity settings';

    const ex3 = mountToggle({
      inputId: 'mx-horizontal',
      switches: true,
      inline: false,
      switchesArray: [
        { id: 'w', label: 'Wi-Fi', value: 'wifi', checked: true },
        { id: 'c', label: 'Cellular', value: 'cell', checked: false },
      ],
      ariaLabelledby: 'mx-horizontal-label',
    });

    horizWrap.appendChild(horizLabel);
    horizWrap.appendChild(ex3);
    c3.demo.appendChild(horizWrap);

    const ex4 = mountToggle({
      inputId: 'mx-error',
      labelTxt: 'Accept terms',
      switches: false,
      required: true,
      validation: true,
      validationMessage: 'This switch is required.',
      checked: false,
      ariaLabel: 'Accept terms toggle',
    });
    c4.demo.appendChild(ex4);

    const ex5 = mountToggle({
      inputId: 'mx-disabled',
      labelTxt: 'Disabled toggle',
      switches: false,
      disabled: true,
      checked: true,
    });
    c5.demo.appendChild(ex5);

    queueMicrotask(() =>
      requestAnimationFrame(() => {
        try {
          c1.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex1), null, 2);
          c2.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex2), null, 2);
          c3.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex3), null, 2);
          c4.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex4), null, 2);
          c5.pre.textContent = JSON.stringify(snapshotA11y(wrap, ex5), null, 2);
        } catch (e) {
          const msg = e && e.message ? e.message : String(e);
          c1.pre.textContent = `Error: ${msg}`;
          c2.pre.textContent = `Error: ${msg}`;
          c3.pre.textContent = `Error: ${msg}`;
          c4.pre.textContent = `Error: ${msg}`;
          c5.pre.textContent = `Error: ${msg}`;
        }
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders example configurations and prints computed accessibility wiring. Includes single + multi (role="group"), external `aria-labelledby`, invalid describedby wiring, and disabled behavior.',
      },
      story: { height: '900px' },
    },
  },
};
