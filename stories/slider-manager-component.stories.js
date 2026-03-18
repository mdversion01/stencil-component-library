// src/stories/slider-manager-component.stories.js
// UPDATED: adds aria-label / aria-labelledby / aria-describedby props + Accessibility Matrix (computed)

export default {
  title: 'Components/Slider/Slider Manager',
  tags: ['autodocs'],
  args: {
    disabled: false,
    hideLeftTextBox: false,
    hideRightTextBox: false,
    hideTextBoxes: false,

    label: 'Range',

    // range
    min: 0,
    max: 100,

    // basic
    value: 42,

    // multi
    lowerValue: 25,
    upperValue: 75,

    // discrete
    selectedIndex: 0,
    stringValues: ['XS', 'S', 'M', 'L', 'XL'],

    // ticks
    snapToTicks: false,
    tickLabels: false,
    tickValues: [],

    // misc
    plumage: false,
    sliderThumbLabel: false,
    unit: '',
    type: 'basic',
    variant: 'primary',

    // a11y overrides
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
        component: 'A slider manager component that can render basic, multi-range, or discrete sliders based on the provided type.',
      },
    },
  },

  argTypes: {
    /* -----------------------------
     Accessibility
  ------------------------------ */
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

    /* -----------------------------
     State
  ------------------------------ */
    disabled: {
      control: 'boolean',
      description: 'Disables the slider when true.',
      table: { category: 'State', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Labeling
  ------------------------------ */
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

    /* -----------------------------
     Text Boxes
  ------------------------------ */
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

    /* -----------------------------
     Type & Values
  ------------------------------ */
    type: {
      control: { type: 'select' },
      options: ['basic', 'multi', 'discrete'],
      description: 'Type of the slider: basic, multi-range, or discrete.',
      table: { category: 'Type & Values' },
    },

    // range (shared)
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

    // basic
    value: {
      control: { type: 'number', step: 1 },
      description: 'Current value of the slider.',
      table: { category: 'Type & Values' },
    },

    // multi
    lowerValue: {
      control: { type: 'number', step: 1 },
      name: 'lower-value',
      description: 'The lower value for multi-range sliders.',
      table: { category: 'Type & Values' },
    },
    upperValue: {
      control: { type: 'number', step: 1 },
      name: 'upper-value',
      description: 'The upper value for multi-range sliders.',
      table: { category: 'Type & Values' },
    },

    // discrete
    selectedIndex: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'selected-index',
      description: 'Selected index for discrete sliders.',
      table: { category: 'Type & Values' },
    },
    stringValues: {
      control: 'object',
      name: 'string-values',
      description: 'Array of string values for discrete sliders.',
      table: { category: 'Type & Values' },
    },

    /* -----------------------------
     Ticks & Snapping
  ------------------------------ */
    snapToTicks: {
      control: 'boolean',
      name: 'snap-to-ticks',
      description: 'Snaps the slider to tick marks when true.',
      table: { category: 'Ticks & Snapping', defaultValue: { summary: false } },
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
    },

    /* -----------------------------
     Thumb
  ------------------------------ */
    sliderThumbLabel: {
      control: 'boolean',
      name: 'slider-thumb-label',
      description: 'Shows label on the slider thumb when true.',
      table: { category: 'Thumb', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Styling
  ------------------------------ */
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

/* helpers */
const boolLine = (name, on) => (on ? name : null);
const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return null;
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const serializeArray = (val) => {
  if (val === undefined || val === null) return '';
  try {
    return JSON.stringify(val);
  } catch {
    return '';
  }
};

const normalizeHtml = (html) => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      out.push('');
      prevBlank = true;
      continue;
    }
    out.push(line);
    prevBlank = false;
  }

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

const normalizeIdList = (v) => {
  const s = String(v ?? '').trim();
  if (!s) return '';
  return s.split(/\s+/).filter(Boolean).join(' ');
};

/* base template */
const Template = (args) => {
  const attrs = [
    // a11y overrides
    attrLine('aria-label', args.ariaLabel),
    attrLine('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attrLine('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    boolLine('disabled', args.disabled),
    attrLine('label', args.label),
    boolLine('hide-left-text-box', args.hideLeftTextBox),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    boolLine('hide-text-boxes', args.hideTextBoxes),

    attrLine('max', args.max),
    attrLine('min', args.min),

    boolLine('plumage', args.plumage),

    // type-specific
    args.type === 'multi' ? attrLine('lower-value', args.lowerValue) : null,
    args.type === 'multi' ? attrLine('upper-value', args.upperValue) : null,

    args.type === 'discrete' ? attrLine('selected-index', args.selectedIndex) : null,
    args.type === 'discrete' ? attrLine('string-values', serializeArray(args.stringValues)) : null,

    boolLine('slider-thumb-label', args.sliderThumbLabel),
    boolLine('snap-to-ticks', args.snapToTicks),
    boolLine('tick-labels', args.tickLabels),
    attrLine('tick-values', serializeArray(args.tickValues)),

    attrLine('type', args.type),
    attrLine('unit', args.unit),

    args.type === 'basic' ? attrLine('value', args.value) : null,

    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('\n  ');

  return normalizeHtml(`
<div style="margin-top: 40px; margin-bottom: 40px;">
  <!-- div wrapper is for better appearance in Storybook -->
  <slider-manager-component
    ${attrs}
  ></slider-manager-component>
</div>
`);
};

/* stories */
export const Basic = {
  render: Template,
  args: {
    disabled: false,
    hideLeftTextBox: false,
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

/* ============================== Accessibility Matrix (computed) ============================== */

const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

const getSnapshot = (host) => {
  const manager = host?.querySelector?.('slider-manager-component') || host;

  const basic = manager?.querySelector?.('basic-slider-component');
  const multi = manager?.querySelector?.('multi-range-slider-component');
  const discrete = manager?.querySelector?.('discrete-slider-component');
  const child = basic || multi || discrete;

  const managerType = manager?.getAttribute?.('type') ?? null;

  const childTag = child?.tagName?.toLowerCase?.() ?? null;

  // Manager forwards aria-* as attributes to the child custom element.
  const childAriaLabel = child?.getAttribute?.('aria-label') ?? null;
  const childAriaLabelledby = child?.getAttribute?.('aria-labelledby') ?? null;
  const childAriaDescribedby = child?.getAttribute?.('aria-describedby') ?? null;

  const resolveIn = (id) => {
    if (!id) return false;
    try {
      return !!host?.querySelector?.(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  const labelledIds = splitIds(childAriaLabelledby);
  const describedIds = splitIds(childAriaDescribedby);

  return {
    host: manager?.tagName?.toLowerCase?.() ?? null,
    managerType,
    managerDisabled: manager?.hasAttribute?.('disabled') ?? null,
    childTag,
    'child aria-label': childAriaLabel,
    'child aria-labelledby': childAriaLabelledby,
    'child aria-describedby': childAriaDescribedby,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolveIn),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolveIn),
    note:
      'This matrix validates manager→child forwarding. Actual slider role/aria-valuenow keyboard behavior must be implemented inside the child slider components.',
  };
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
        Prints computed <code>role</code> + <code>aria-*</code> + ids for default / inline / horizontal, validation, and disabled.
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
          try { await mgr.componentOnReady(); } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try { await customElements.whenDefined('slider-manager-component'); } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(host), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    // Default (stacked): basic slider with aria-label
    wrap.appendChild(
      card('Default (basic)', {
        type: 'basic',
        label: 'Default slider',
        value: 42,
        ariaLabel: 'Default slider',
      }),
    );

    // Inline: simulate inline form row + use aria-labelledby pointing to external label
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

    // Horizontal: simulate horizontal row grid + aria-labelledby external
    wrap.appendChild(
      card(
        'Horizontal layout (simulated)',
        {
          type: 'multi',
          label: 'Horizontal range',
          lowerValue: 20,
          upperValue: 80,
          ariaLabelledby: 'mx-horizontal-label',
        },
        `<div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px;">
           <div id="mx-horizontal-label" style="font-weight:600;">Horizontal label area</div>
         </div>`,
      ),
    );

    // Error/validation: sliders don't have built-in validation here; simulate describedby to an error/help element
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

    // Disabled
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
          'Prints computed accessibility wiring for slider-manager. Confirms forwarded `aria-label`, `aria-labelledby`, and `aria-describedby` land on the active child slider element for default/inline/horizontal (simulated), error (simulated), and disabled states.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
};
