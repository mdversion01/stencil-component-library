// src/stories/basic-slider-component.stories.js
// UPDATED: adds aria-label / aria-labelledby / aria-describedby controls + Accessibility Matrix (computed)

export default {
  title: 'Components/Slider/Basic Slider',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: { component: 'A basic slider component allowing selection of a single value within a range.' },
      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
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

    // -------- Behavior / State --------
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

    // -------- Content --------
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

    // -------- Value & Range --------
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

    // -------- Tick Marks --------
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

    // -------- Layout / Text Boxes --------
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

    // -------- Appearance --------
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      description: 'Visual variant of the slider.',
      table: { category: 'Appearance' },
    },
  },
};

/* helpers */
const boolLine = (name, on) => (on ? ` ${name}` : '');
const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return '';
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return ` ${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const serializeArray = (val) => {
  if (!val) return '';
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
    // a11y
    attrLine('aria-label', args.ariaLabel),
    attrLine('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attrLine('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    // flags
    boolLine('disabled', args.disabled),
    boolLine('hide-left-text-box', args.hideLeftTextBox),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    boolLine('hide-text-boxes', args.hideTextBoxes),

    // content/range
    attrLine('label', args.label),
    attrLine('max', args.max),
    attrLine('min', args.min),

    // appearance/behavior
    boolLine('plumage', args.plumage),
    boolLine('slider-thumb-label', args.sliderThumbLabel),

    // ticks
    boolLine('snap-to-ticks', args.snapToTicks),
    boolLine('tick-labels', args.tickLabels),
    attrLine('tick-values', serializeArray(args.tickValues)),

    // other
    attrLine('unit', args.unit),
    attrLine('value', args.value),
    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('');

  return normalizeHtml(`
<div style="margin-top: 40px; margin-bottom: 40px;">
  <!-- div wrapper is for better appearance in Storybook -->
  <basic-slider-component${attrs}></basic-slider-component>
</div>
  `);
};

/* stories */
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

  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
};
Basic.parameters = {
  docs: {
    description: { story: 'The basic slider with default settings.' },
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
  docs: {
    description: { story: 'A slider with tick marks and labels.' },
  },
};

export const SnapToTicks = Template.bind({});
SnapToTicks.args = {
  ...Basic.args,
  label: 'Opacity',
  value: 75,
  snapToTicks: true,
  tickValues: [0, 20, 40, 60, 80, 100],
  tickLabels: true,
  variant: 'secondary',
};
SnapToTicks.parameters = {
  docs: {
    description: { story: 'A slider that snaps to predefined tick values.' },
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
  docs: {
    description: { story: 'A slider with a label displayed on the thumb.' },
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
  docs: {
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
  docs: {
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
  docs: {
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
  docs: {
    description: { story: 'A disabled slider.' },
  },
};

/* ============================== Accessibility Matrix (computed) ============================== */

const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

const getSnapshot = (root) => {
  const host = root?.querySelector?.('basic-slider-component') || root;
  const slider = host?.querySelector?.('[role="slider"]') || null;

  const resolve = (id) => {
    if (!id) return false;
    try {
      return !!root?.querySelector?.(`#${CSS.escape(id)}`);
    } catch {
      return false;
    }
  };

  const labelledby = (slider?.getAttribute?.('aria-labelledby') || '').trim();
  const describedby = (slider?.getAttribute?.('aria-describedby') || '').trim();

  const labelledIds = splitIds(labelledby);
  const describedIds = splitIds(describedby);

  return {
    host: host?.tagName?.toLowerCase?.() ?? null,
    sliderRole: slider?.getAttribute?.('role') ?? null,
    tabIndex: slider?.getAttribute?.('tabindex') ?? null,
    disabled: slider?.getAttribute?.('aria-disabled') ?? null,
    'aria-label': slider?.getAttribute?.('aria-label') ?? null,
    'aria-labelledby': labelledby || null,
    'aria-describedby': describedby || null,
    'aria-valuemin': slider?.getAttribute?.('aria-valuemin') ?? null,
    'aria-valuemax': slider?.getAttribute?.('aria-valuemax') ?? null,
    'aria-valuenow': slider?.getAttribute?.('aria-valuenow') ?? null,
    'aria-valuetext': slider?.getAttribute?.('aria-valuetext') ?? null,
    labelledbyIds: labelledIds,
    labelledbyAllResolve: labelledIds.every(resolve),
    describedbyIds: describedIds,
    describedbyAllResolve: describedIds.every(resolve),
    labelElId: host?.querySelector?.('label.form-control-label')?.getAttribute?.('id') ?? null,
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
        const host = mount.querySelector('basic-slider-component');

        if (host?.componentOnReady) {
          try { await host.componentOnReady(); } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try { await customElements.whenDefined('basic-slider-component'); } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(mount), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    // Default
    wrap.appendChild(
      card('Default', {
        label: 'Default',
        value: 30,
        ariaLabel: '',
        ariaLabelledby: '',
        ariaDescribedby: '',
      }),
    );

    // Inline (simulated): external label id
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

    // Horizontal (simulated): grid label left + slider right
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

    // Error/validation (simulated): describedby points to error/help
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

    // Disabled
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
          'Prints computed accessibility wiring for the slider: the focused element has `role="slider"` with `aria-valuemin/max/now/text`, and optional `aria-label` / `aria-labelledby` / `aria-describedby`. Includes simulated inline/horizontal layouts, simulated error describedby, and disabled state.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
};
