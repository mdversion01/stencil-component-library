// src/stories/progress-display-component.stories.js

export default {
  title: 'Components/Progress',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A versatile progress display component supporting linear and circular styles, with options for single or multiple bars, animations, custom labels, and accessibility overrides.',
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
      description: 'ARIA override for the progressbar/group accessible name. Ignored if aria-labelledby is provided.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ARIA override for the progressbar/group accessible name (space-separated ids).',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'ARIA override for additional description ids (space-separated).',
      table: { category: 'Accessibility' },
    },

    /* -----------------------------
     Mode & Structure
  ------------------------------ */
    circular: {
      control: 'boolean',
      description: 'Renders a circular progress indicator.',
      table: { category: 'Mode & Structure', defaultValue: { summary: false } },
    },
    multi: {
      control: 'boolean',
      description: 'Renders multiple stacked progress bars (linear only).',
      table: { category: 'Mode & Structure', defaultValue: { summary: false } },
    },
    bars: {
      control: 'object',
      description: 'Array of bar objects for multi progress bars.',
      table: { category: 'Mode & Structure' },
    },

    /* -----------------------------
     Value & Formatting (Common)
  ------------------------------ */
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Current value of the progress.',
      table: { category: 'Value & Formatting' },
    },
    max: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Maximum value of the progress.',
      table: { category: 'Value & Formatting' },
    },
    precision: {
      control: { type: 'number', min: 0, max: 4, step: 1 },
      description: 'Number of decimal places to show in progress text.',
      table: { category: 'Value & Formatting' },
    },

    /* -----------------------------
     Labels & Slot Demo (Linear stories)
  ------------------------------ */
    label: {
      control: 'text',
      description: "Optional label text. This can be used on it's own or with the `use-named-bar-0` option. Leave empty for no label.",
      table: { category: 'Labels & Slot Demo' },
    },
    useNamedBar0: {
      control: 'boolean',
      name: 'use-named-bar-0',
      description:
        'When used with `label`, wraps the label as an internal `<span slot="bar-0">...` (single-bar compatibility with multi-bar markup).',
      table: { category: 'Labels & Slot Demo', defaultValue: { summary: false } },
    },
    slotText: {
      control: 'text',
      name: 'slot-text',
      description:
        'Storybook-only: injects default slot content (text/markup) between the component tags. In real usage, just place content between `<progress-display-component>...</progress-display-component>`.',
      table: { category: 'Labels & Slot Demo' },
    },
    progressAlign: {
      control: { type: 'select' },
      options: ['', 'left', 'right'],
      name: 'progress-align',
      description: 'Alignment of label vs progress text within the bar when both are present (e.g., with `label` or slot content).',
      table: { category: 'Labels & Slot Demo' },
    },

    /* -----------------------------
     Display Toggles (Common)
  ------------------------------ */
    showProgress: {
      control: 'boolean',
      name: 'show-progress',
      description: 'If true, shows the progress text.',
      table: { category: 'Display Toggles', defaultValue: { summary: false } },
    },
    showValue: {
      control: 'boolean',
      name: 'show-value',
      description: 'If true, shows the numeric value.',
      table: { category: 'Display Toggles', defaultValue: { summary: false } },
    },

    /* -----------------------------
     Styling (Common / Linear)
  ------------------------------ */
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      description: 'Visual variant for the progress bar.',
      table: { category: 'Styling' },
    },

    /* -----------------------------
     Linear Options
  ------------------------------ */
    height: {
      control: { type: 'number', min: 4, step: 1 },
      description: 'Height of the progress bar in pixels (linear only).',
      table: { category: 'Linear Options' },
    },
    striped: {
      control: 'boolean',
      description: 'Enables striped styling for the progress bar (linear only).',
      table: { category: 'Linear Options', defaultValue: { summary: false } },
    },
    animated: {
      control: 'boolean',
      description: 'Enables animation for striped bars.',
      table: { category: 'Linear Options', defaultValue: { summary: false } },
    },
    styles: {
      control: 'text',
      description: 'Custom CSS styles to apply to the progress bar (linear only).',
      table: { category: 'Linear Options' },
    },

    /* -----------------------------
     Circular Options
  ------------------------------ */
    size: {
      control: { type: 'number', min: 32, step: 1 },
      description: 'Diameter of the circular progress indicator in pixels (circular only).',
      table: { category: 'Circular Options' },
    },
    rotate: {
      control: { type: 'number', step: 1 },
      description: 'Rotation angle in degrees for circular progress.',
      table: { category: 'Circular Options' },
    },
    strokeWidth: {
      control: { type: 'number', min: 1, step: 1 },
      name: 'width',
      description: 'Width of the circular progress stroke in pixels (circular only).',
      table: { category: 'Circular Options' },
    },
    indeterminate: {
      control: 'boolean',
      description: 'If true, shows an indeterminate loading state (circular only).',
      table: { category: 'Circular Options', defaultValue: { summary: false } },
    },
    lineCap: {
      control: 'boolean',
      name: 'line-cap',
      description: 'If true, uses rounded line caps for circular progress.',
      table: { category: 'Circular Options', defaultValue: { summary: false } },
    },

    /** Storybook only **/
    children: {
      control: false,
      table: { disable: true },
      description: 'Storybook-only slot markup helper. Not a component prop.',
    },
  },
  controls: {
    exclude: ['children'],
  },
};

const boolLine = (name, on) => (on ? name : null);

const attrLine = (name, v) => {
  if (v === undefined || v === null || v === '') return null;
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const serializeBars = bars => {
  if (!bars) return '';
  try {
    return JSON.stringify(bars);
  } catch {
    return '';
  }
};

const LinearTemplate = args => {
  const labelText = String(args.label ?? '').trim();
  const useNamed = !!labelText && !!args.useNamedBar0;

  const slotText = String(args.slotText ?? '').trim();

  const attrs = [
    // a11y overrides
    attrLine('aria-label', args.ariaLabel),
    attrLine('aria-labelledby', args.ariaLabelledby),
    attrLine('aria-describedby', args.ariaDescribedby),

    boolLine('animated', args.animated),
    attrLine('height', args.height),
    attrLine('label', labelText),
    boolLine('use-named-bar-0', useNamed),
    attrLine('max', args.max),
    attrLine('precision', args.precision),
    attrLine('progress-align', args.progressAlign),
    args.styles ? attrLine('styles', args.styles) : null,
    boolLine('show-progress', args.showProgress),
    boolLine('show-value', args.showValue),
    boolLine('striped', args.striped),
    attrLine('value', args.value),
    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('\n  ');

  if (slotText) {
    return `<progress-display-component
  ${attrs}
>${slotText}</progress-display-component>`;
  }

  return `<progress-display-component
  ${attrs}
></progress-display-component>`;
};

const CircularTemplate = args => {
  const labelText = String(args.label ?? '').trim();

  const attrs = [
    // a11y overrides
    attrLine('aria-label', args.ariaLabel),
    attrLine('aria-labelledby', args.ariaLabelledby),
    attrLine('aria-describedby', args.ariaDescribedby),

    'circular',
    attrLine('label', labelText),
    attrLine('value', args.value),
    attrLine('max', args.max),
    attrLine('size', args.size),
    attrLine('precision', args.precision),
    attrLine('rotate', args.rotate),
    attrLine('width', args.strokeWidth),
    boolLine('indeterminate', args.indeterminate),
    boolLine('line-cap', args.lineCap),
    boolLine('show-progress', args.showProgress),
    boolLine('show-value', args.showValue),
    attrLine('variant', args.variant),
  ]
    .filter(Boolean)
    .join('\n  ');

  return `<progress-display-component
  ${attrs}
></progress-display-component>`;
};

const MultiTemplate = args => {
  const labelText = String(args.label ?? '').trim();

  const attrs = [
    // a11y overrides (apply to group)
    attrLine('aria-label', args.ariaLabel),
    attrLine('aria-labelledby', args.ariaLabelledby),
    attrLine('aria-describedby', args.ariaDescribedby),

    'multi',
    attrLine('label', labelText),
    attrLine('height', args.height),
    attrLine('bars', serializeBars(args.bars)),
  ]
    .filter(Boolean)
    .join('\n  ');

  const children = (args.children || '').trim();
  if (children) {
    return `<progress-display-component
  ${attrs}
>
  ${children}
</progress-display-component>`;
  }

  return `<progress-display-component
  ${attrs}
></progress-display-component>`;
};

/* ===========================
   Stories
   =========================== */

export const LinearBasic = {
  name: 'Linear Basic',
  render: LinearTemplate,
  args: {
    // mode toggles
    circular: false,
    multi: false,

    // a11y overrides
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',

    // linear
    animated: false,
    striped: false,
    height: 16,
    styles: '',
    progressAlign: '',
    label: '',
    useNamedBar0: false,
    slotText: 'Loading',

    // common
    value: 45,
    max: 100,
    precision: 0,
    showProgress: true,
    showValue: false,
    variant: 'primary',

    // circular-only
    size: 96,
    rotate: 0,
    strokeWidth: 6,
    indeterminate: false,
    lineCap: false,

    // multi-only
    bars: [],
    children: '',
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_code, storyContext) => LinearTemplate(storyContext.args),
      },
      description: {
        story:
          'A basic linear progress bar. Default slot content (e.g., "Loading") can be provided between the tags. `slotText` is a Storybook-only control to demonstrate that behavior from Controls.',
      },
    },
  },
};

export const LinearSingleNamedSlotBar0 = () => `
<progress-display-component use-named-bar-0 label="Uploading" show-progress value="75" variant="primary">
</progress-display-component>
`;
LinearSingleNamedSlotBar0.storyName = 'Linear (Single) — use-named-bar-0 + label';
LinearSingleNamedSlotBar0.parameters = {
  controls: { disable: true },
  docs: {
    source: { code: LinearSingleNamedSlotBar0(), language: 'html' },
    description: {
      story:
        'Uses `label` plus `use-named-bar-0` to wrap the label as an internal `<span slot="bar-0">…</span>` for single-bar compatibility with multi-bar markup.',
    },
  },
};

export const LinearLabelAttr = () => `
<progress-display-component label="Progress" show-progress value="50" variant="primary">
</progress-display-component>
`;
LinearLabelAttr.storyName = 'Linear (Single) — label attribute';
LinearLabelAttr.parameters = {
  controls: { disable: true },
  docs: {
    source: { code: LinearLabelAttr(), language: 'html' },
    description: { story: 'Using the `label` attribute wires aria-labelledby to a real label id and renders a visible label.' },
  },
};

export const LinearStripedAnimated = LinearTemplate.bind({});
LinearStripedAnimated.args = {
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
  animated: true,
  height: 18,
  label: '',
  useNamedBar0: false,
  slotText: '',
  max: 100,
  precision: 0,
  progressAlign: '',
  showProgress: true,
  showValue: false,
  striped: true,
  styles: '',
  value: 72,
  variant: 'success',
};
LinearStripedAnimated.storyName = 'Linear Striped & Animated';
LinearStripedAnimated.parameters = {
  docs: {
    source: { code: LinearTemplate(LinearStripedAnimated.args), language: 'html' },
    description: { story: 'A linear progress bar with striped styling and animation enabled.' },
  },
};

export const LinearWithCustomStyles = LinearTemplate.bind({});
LinearWithCustomStyles.args = {
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
  animated: false,
  height: 12,
  label: '',
  useNamedBar0: false,
  slotText: '',
  max: 100,
  precision: 0,
  progressAlign: 'left',
  showProgress: false,
  showValue: true,
  striped: false,
  styles: 'border-radius:8px; overflow:hidden; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08);',
  value: 30,
  variant: 'warning',
};
LinearWithCustomStyles.storyName = 'Linear With Custom Styles';
LinearWithCustomStyles.parameters = {
  docs: {
    source: { code: LinearTemplate(LinearWithCustomStyles.args), language: 'html' },
    description: { story: 'A linear progress bar with custom CSS styles applied.' },
  },
};

export const AnimatedValueViaJS = () => {
  const id = `progressBarComp-${Math.random().toString(36).slice(2, 9)}`;

  setTimeout(() => {
    const el = document.getElementById(id);
    if (!el) return;

    if (el.__progressInterval) clearInterval(el.__progressInterval);

    let value1 = 0;
    const interval1 = setInterval(() => {
      value1 = value1 >= 100 ? 0 : value1 + 10;
      el.setAttribute('value', String(value1));
    }, 1000);

    el.__progressInterval = interval1;
  }, 0);

  return `
<progress-display-component
  id="${id}"
  value="45"
  max="100"
  variant="primary"
  show-progress
  progress-align="right"
></progress-display-component>
`;
};
AnimatedValueViaJS.storyName = 'Animated Value (JS)';
AnimatedValueViaJS.parameters = {
  controls: { disable: true },
  docs: {
    source: { code: AnimatedValueViaJS(), language: 'html' },
    description: { story: 'Demonstrates animating the progress bar by updating the `value` attribute via JavaScript.' },
  },
};

export const MultiStacked = MultiTemplate.bind({});
MultiStacked.args = {
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
  height: 18,
  label: '',
  bars: [
    { value: 20, variant: 'primary', striped: false, animated: false, showProgress: true, precision: 0, progressAlign: '' },
    { value: 35, variant: 'success', striped: true, animated: true, showProgress: true, precision: 0, progressAlign: '' },
    { value: 15, variant: 'danger', striped: false, animated: false, showProgress: true, precision: 0, progressAlign: '' },
  ],
  children: '',
};
MultiStacked.storyName = 'Multi Stacked';
MultiStacked.parameters = {
  docs: {
    source: { code: MultiTemplate(MultiStacked.args), language: 'html' },
    description: { story: 'A multi-segment linear progress bar with stacked bars.' },
  },
};

export const MultiWithLeftRightText = MultiTemplate.bind({});
MultiWithLeftRightText.args = {
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
  height: 20,
  label: '',
  bars: [
    { value: 40, variant: 'info', showProgress: true, progressAlign: 'left', precision: 0 },
    { value: 25, variant: 'warning', showProgress: true, progressAlign: 'right', precision: 0 },
  ],
  children: `
<span slot="bar-0">Info chunk</span>
<span slot="bar-1">Warn chunk</span>
`,
};
MultiWithLeftRightText.storyName = 'Multi With Left/Right Labels';
MultiWithLeftRightText.parameters = {
  docs: {
    source: { code: MultiTemplate(MultiWithLeftRightText.args), language: 'html' },
    description: { story: 'A multi-segment linear progress bar with left/right aligned text in each bar.' },
  },
};

export const CircularBasic = CircularTemplate.bind({});
CircularBasic.args = {
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
  label: '',
  value: 64,
  max: 100,
  size: 96,
  rotate: 0,
  strokeWidth: 6,
  precision: 0,
  lineCap: false,
  showProgress: true,
  showValue: false,
  indeterminate: false,
  variant: 'primary',
};
CircularBasic.storyName = 'Circular Basic';
CircularBasic.parameters = {
  docs: {
    source: { code: CircularTemplate(CircularBasic.args), language: 'html' },
    description: { story: 'A basic circular progress bar.' },
  },
};

export const CircularRotatedWide = CircularTemplate.bind({});
CircularRotatedWide.args = {
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
  label: '',
  value: 80,
  max: 100,
  size: 120,
  rotate: -90,
  strokeWidth: 10,
  precision: 0,
  lineCap: true,
  showProgress: true,
  showValue: false,
  indeterminate: false,
  variant: 'info',
};
CircularRotatedWide.storyName = 'Circular Rotated + Wide';
CircularRotatedWide.parameters = {
  docs: {
    source: { code: CircularTemplate(CircularRotatedWide.args), language: 'html' },
    description: { story: 'A circular progress bar with rotation and wider stroke.' },
  },
};

export const CircularIndeterminate = CircularTemplate.bind({});
CircularIndeterminate.args = {
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
  label: '',
  value: 0,
  max: 100,
  size: 80,
  rotate: 0,
  strokeWidth: 4,
  precision: 0,
  lineCap: false,
  showProgress: false,
  showValue: false,
  indeterminate: true,
  variant: 'secondary',
};
CircularIndeterminate.storyName = 'Circular Indeterminate';
CircularIndeterminate.parameters = {
  docs: {
    source: { code: CircularTemplate(CircularIndeterminate.args), language: 'html' },
    description: { story: 'A circular progress bar in indeterminate state.' },
  },
};

/* ============================== Accessibility Matrix (computed) ============================== */

const getSnapshot = host => {
  const root = host;
  const group = root?.querySelector?.('[role="group"]');
  const bars = Array.from(root?.querySelectorAll?.('[role="progressbar"]') || []);

  const resolveIn = (scope, id) => {
    if (!id) return false;
    return !!scope?.querySelector?.(`#${CSS.escape(id)}`);
  };

  const snapEl = el => {
    if (!el) return null;
    const describedby = (el.getAttribute('aria-describedby') || '').trim();
    const describedIds = describedby ? describedby.split(/\s+/).filter(Boolean) : [];

    const labelledby = (el.getAttribute('aria-labelledby') || '').trim();
    const labelledIds = labelledby ? labelledby.split(/\s+/).filter(Boolean) : [];

    return {
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role'),
      id: el.getAttribute('id'),
      class: el.getAttribute('class'),
      'aria-label': el.getAttribute('aria-label'),
      'aria-labelledby': labelledby || null,
      'aria-describedby': describedby || null,
      'aria-valuemin': el.getAttribute('aria-valuemin'),
      'aria-valuemax': el.getAttribute('aria-valuemax'),
      'aria-valuenow': el.getAttribute('aria-valuenow'),
      'aria-valuetext': el.getAttribute('aria-valuetext'),
      'aria-busy': el.getAttribute('aria-busy'),
      labelledbyIds: labelledIds,
      labelledbyAllResolve: labelledIds.every(id => resolveIn(root, id)),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every(id => resolveIn(root, id)),
    };
  };

  return {
    host: host?.tagName?.toLowerCase() ?? null,
    mode: group ? 'multi' : 'single',
    group: snapEl(group),
    bars: bars.map(snapEl),
    labelElId: root?.querySelector?.('[id$="-label"]')?.getAttribute?.('id') ?? null,
  };
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Prints computed <code>role</code> + <code>aria-*</code> + ids for representative configurations.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, html) => {
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
      mount.innerHTML = html.trim();
      const host = mount.querySelector('progress-display-component');

      demo.appendChild(mount);

      const update = async () => {
        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('progress-display-component');
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

    // NOTE: "default/inline/horizontal, error/validation, disabled" are not native concepts for progress.
    // We map them to representative states:
    // - default: linear determinate
    // - inline: small height + inline label/progress text
    // - horizontal: multi stacked (horizontal segments)
    // - error/validation: danger variant + describedby
    // - disabled: indeterminate/busy

    const helpId = `mx-help-${Math.random().toString(36).slice(2, 7)}`;
    const helpText = `<div id="${helpId}" style="font-size:12px; opacity:.85;">Help text describing this progress indicator.</div>`;

    wrap.appendChild(
      card(
        'Default (linear determinate)',
        `
        ${helpText}
        ${LinearTemplate({ ...LinearBasic.args, ...args, ariaDescribedby: helpId, value: 35, showProgress: true, slotText: '' })}
      `,
      ),
    );

    wrap.appendChild(
      card(
        'Inline (compact)',
        `
        ${LinearTemplate({ ...LinearBasic.args, ...args, height: 10, value: 60, showProgress: true, progressAlign: 'right', slotText: 'Loading' })}
      `,
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal (multi stacked)',
        `
        ${MultiTemplate({
          ...MultiStacked.args,
          ...args,
          label: 'Stacked segments',
          bars: [
            { value: 20, variant: 'primary', showProgress: true },
            { value: 35, variant: 'success', showProgress: true },
            { value: 15, variant: 'warning', showProgress: true },
          ],
        })}
      `,
      ),
    );

    wrap.appendChild(
      card(
        'Error / validation (danger + describedby)',
        `
        ${helpText}
        ${LinearTemplate({ ...LinearBasic.args, ...args, ariaDescribedby: helpId, variant: 'danger', value: 15, showProgress: true, slotText: '' })}
      `,
      ),
    );

    wrap.appendChild(
      card(
        'Disabled / busy (indeterminate)',
        `
        ${CircularTemplate({ ...CircularIndeterminate.args, ...args, indeterminate: true, variant: 'secondary', label: 'Loading', showProgress: false })}
      `,
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for progress. Shows `role="progressbar"` (and `role="group"` for multi) plus `aria-valuenow/max/min` or indeterminate `aria-busy`, and validates that `aria-labelledby` / `aria-describedby` ids resolve.',
      },
      source: { language: 'html', type: 'dynamic' },
    },
  },
};
