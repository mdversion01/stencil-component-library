// src/stories/discrete-slider-component.stories.js
// UPDATED: adds aria-label / aria-labelledby / aria-describedby controls + Accessibility Matrix (computed)

export default {
  title: 'Components/Slider/Discrete Slider',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: { component: 'A discrete slider component allowing selection from predefined string values.' },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => Template(ctx.args),
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

    /* -----------------------------
     State
  ------------------------------ */
    disabled: {
      control: 'boolean',
      description: 'Disables the slider when true.',
      table: { category: 'State', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Layout & Labeling
  ------------------------------ */
    label: {
      control: 'text',
      description: 'Label for the slider.',
      table: { category: 'Layout & Labeling' },
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

    /* -----------------------------
     Data & Selection
  ------------------------------ */
    selectedIndex: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'selected-index',
      description: 'Index of the selected value.',
      table: { category: 'Data & Selection' },
    },
    stringValues: {
      control: 'object',
      description: 'Array of string values for discrete sliders.',
      name: 'string-values',
      table: { category: 'Data & Selection' },
    },

    /* -----------------------------
     Ticks & Labels
  ------------------------------ */
    tickLabels: {
      control: 'boolean',
      name: 'tick-labels',
      description: 'Shows labels for tick marks when true.',
      table: { category: 'Ticks & Labels', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Styling
  ------------------------------ */
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

/* template */
const Template = (args) => {
  const attrs = [
    // a11y
    attrLine('aria-label', args.ariaLabel),
    attrLine('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attrLine('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    // state/layout
    boolLine('disabled', args.disabled),
    boolLine('hide-right-text-box', args.hideRightTextBox),
    attrLine('label', args.label),
    boolLine('plumage', args.plumage),

    // data
    attrLine('selected-index', args.selectedIndex),
    attrLine('string-values', serializeArray(args.stringValues)),
    boolLine('tick-labels', args.tickLabels),

    // styling
    attrLine('unit', args.unit),
    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('');

  return normalizeHtml(`
  <div style="margin-top: 40px; margin-bottom: 40px;">
    <!-- div wrapper is for better appearance in Storybook -->
    <discrete-slider-component${attrs}>
    </discrete-slider-component>
  </div>
`);
};

/**
 * Apply “dynamic source” ONLY to Template-driven stories
 * so Docs Source stays in sync with Controls.
 */
const templateStoryParameters = {
  docs: {
    source: {
      type: 'dynamic',
      language: 'html',
      transform: (_code, ctx) => Template(ctx.args),
    },
  },
};

/* stories */
export const Basic = Template.bind({});
Basic.args = {
  disabled: false,
  hideRightTextBox: false,
  label: 'Rating',
  plumage: false,
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
      story: 'Demonstrates passing `string-values` as a JSON string attribute (plain HTML usage).',
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

/* ============================== Accessibility Matrix (computed) ============================== */

const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

const getSnapshot = (root) => {
  const host = root?.querySelector?.('discrete-slider-component') || root;
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
        const host = mount.querySelector('discrete-slider-component');

        if (host?.componentOnReady) {
          try { await host.componentOnReady(); } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try { await customElements.whenDefined('discrete-slider-component'); } catch (_e) {}
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
        stringValues: ['Low', 'Med', 'High'],
        selectedIndex: 1,
        tickLabels: true,
      }),
    );

    // Inline (simulated): external label id
    wrap.appendChild(
      card(
        'Inline (simulated, aria-labelledby external)',
        {
          label: '',
          stringValues: ['XS', 'S', 'M', 'L', 'XL'],
          selectedIndex: 2,
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
          stringValues: ['A', 'B', 'C', 'D'],
          selectedIndex: 3,
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
          stringValues: ['One', 'Two', 'Three'],
          selectedIndex: 0,
          ariaDescribedby: 'mx-error',
        },
        `<div id="mx-error" style="color:#a00; font-size:12px; margin-bottom:8px;">Error: selection required.</div>`,
      ),
    );

    // Disabled
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
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the discrete slider: the focused element has `role="slider"` with `aria-valuemin/max/now/text`, and optional `aria-label` / `aria-labelledby` / `aria-describedby`. Includes simulated inline/horizontal layouts, simulated error describedby, and disabled state.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => Template(ctx.args),
      },
    },
  },
};
