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
      source: { type: 'dynamic' },
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
      description:
        "Optional label text. This can be used on it's own or with the `use-named-bar-0` option. Leave empty for no label.",
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
      description: 'Alignment of label vs progress text within the bar when both are present.',
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

const boolAttr = (name, on) => (on ? name : null);

const attr = (name, v) => {
  if (v === undefined || v === null || v === '') return null;
  const s = String(v);
  const useSingle = s.includes('"');
  const escaped = useSingle ? s.replace(/'/g, '&#39;') : s.replace(/"/g, '&quot;');
  return `${name}=${useSingle ? `'${escaped}'` : `"${escaped}"`}`;
};

const serializeBars = (bars) => {
  if (!bars) return null;
  try {
    const s = JSON.stringify(bars);
    return s && s !== '[]' ? s : null;
  } catch {
    return null;
  }
};

const resolveMode = (args) => (args.multi ? 'multi' : args.circular ? 'circular' : 'linear');

/* -------------------------------------------------------------------------- */
/* Docs source: single serializer (code preview)                               */
/* -------------------------------------------------------------------------- */
const buildAttrsForMarkup = (args) => {
  const labelText = String(args.label ?? '').trim();
  const useNamed = !!labelText && !!args.useNamedBar0;

  const mode = resolveMode(args);
  const isLinear = mode === 'linear';
  const isCircular = mode === 'circular';
  const isMulti = mode === 'multi';

  return [
    // mode
    isCircular ? 'circular' : null,
    isMulti ? 'multi' : null,

    // a11y overrides
    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', args.ariaLabelledby),
    attr('aria-describedby', args.ariaDescribedby),

    // common
    attr('label', labelText),
    attr('value', args.value),
    attr('max', args.max),
    attr('precision', args.precision),
    boolAttr('show-progress', args.showProgress),
    boolAttr('show-value', args.showValue),
    attr('variant', args.variant),

    // linear-only
    isLinear || isMulti ? attr('height', args.height) : null,
    isLinear ? boolAttr('striped', args.striped) : null,
    isLinear ? boolAttr('animated', args.animated) : null,
    isLinear ? attr('progress-align', args.progressAlign) : null,
    isLinear ? attr('styles', args.styles) : null,
    isLinear ? boolAttr('use-named-bar-0', useNamed) : null,

    // multi-only
    isMulti ? attr('bars', serializeBars(args.bars)) : null,

    // circular-only
    isCircular ? attr('size', args.size) : null,
    isCircular ? attr('rotate', args.rotate) : null,
    isCircular ? attr('width', args.strokeWidth) : null,
    isCircular ? boolAttr('indeterminate', args.indeterminate) : null,
    isCircular ? boolAttr('line-cap', args.lineCap) : null,
  ]
    .filter(Boolean)
    .join('\n  ');
};

const toMarkup = (args) => {
  const mode = resolveMode(args);
  const attrsList = buildAttrsForMarkup(args);

  const slotText = String(args.slotText ?? '').trim();
  const children = String(args.children ?? '').trim();

  const inner = mode === 'multi' ? children : slotText;

  if (inner) {
    return `<progress-display-component
  ${attrsList}
>
  ${inner}
</progress-display-component>`;
  }

  return `<progress-display-component
  ${attrsList}
></progress-display-component>`;
};

/* -------------------------------------------------------------------------- */
/* Canvas render: create element + apply args (fixes label not updating)       */
/* -------------------------------------------------------------------------- */
const setBoolAttr = (el, name, on) => (on ? el.setAttribute(name, '') : el.removeAttribute(name));

const setAttr = (el, name, v) => {
  if (v === undefined || v === null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
};

const setMaybeProp = (el, name, v) => {
  try {
    // eslint-disable-next-line no-param-reassign
    el[name] = v;
  } catch {}
};

const applyArgsToElement = (el, args) => {
  const mode = resolveMode(args);

  // mode flags
  setBoolAttr(el, 'circular', mode === 'circular');
  setBoolAttr(el, 'multi', mode === 'multi');

  // a11y
  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  // common
  const labelText = String(args.label ?? '').trim();
  setAttr(el, 'label', labelText);
  setMaybeProp(el, 'label', labelText); // ✅ covers components that only react to prop changes

  setAttr(el, 'value', args.value);
  setAttr(el, 'max', args.max);
  setAttr(el, 'precision', args.precision);
  setBoolAttr(el, 'show-progress', !!args.showProgress);
  setBoolAttr(el, 'show-value', !!args.showValue);
  setAttr(el, 'variant', args.variant);

  // linear-only
  if (mode === 'linear') {
    setAttr(el, 'height', args.height);
    setBoolAttr(el, 'striped', !!args.striped);
    setBoolAttr(el, 'animated', !!args.animated);
    setAttr(el, 'progress-align', args.progressAlign);
    setAttr(el, 'styles', args.styles);

    const useNamed = !!labelText && !!args.useNamedBar0;
    setBoolAttr(el, 'use-named-bar-0', useNamed);

    const slotText = String(args.slotText ?? '').trim();
    el.innerHTML = slotText;
  }

  // multi-only
  if (mode === 'multi') {
    setAttr(el, 'height', args.height);

    const bars = (() => {
      if (!args.bars) return '';
      try {
        return JSON.stringify(args.bars);
      } catch {
        return '';
      }
    })();
    setAttr(el, 'bars', bars);

    const children = String(args.children ?? '').trim();
    el.innerHTML = children;
  }

  // circular-only
  if (mode === 'circular') {
    setAttr(el, 'size', args.size);
    setAttr(el, 'rotate', args.rotate);
    setAttr(el, 'width', args.strokeWidth);
    setBoolAttr(el, 'indeterminate', !!args.indeterminate);
    setBoolAttr(el, 'line-cap', !!args.lineCap);
    el.innerHTML = '';
  }
};

const RenderElement = (args) => {
  const wrap = document.createElement('div');

  // ✅ remount on arg change (covers read-once components)
  const key = btoa(unescape(encodeURIComponent(JSON.stringify(args)))).slice(0, 32);

  const el = document.createElement('progress-display-component');
  el.setAttribute('data-sb-key', key);

  applyArgsToElement(el, args);

  wrap.appendChild(el);
  return wrap;
};

/* ===========================
   Stories
   =========================== */

export const Default = {
  name: 'Default',
  render: RenderElement,
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
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => toMarkup(ctx.args),
      },
      description: {
        story:
          'One story that can switch between linear, circular, and multi via Controls. The Docs source and the rendered example stay in sync.',
      },
    },
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

/* ============================== Accessibility Matrix (computed) ============================== */

const getSnapshot = (host) => {
  const root = host;
  const group = root?.querySelector?.('[role="group"]');
  const bars = Array.from(root?.querySelectorAll?.('[role="progressbar"]') || []);

  const resolveIn = (scope, id) => {
    if (!id) return false;
    return !!scope?.querySelector?.(`#${CSS.escape(id)}`);
  };

  const snapEl = (el) => {
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
      labelledbyAllResolve: labelledIds.every((x) => resolveIn(root, x)),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every((x) => resolveIn(root, x)),
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
  render: (args) => {
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
          } catch {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('progress-display-component');
          } catch {}
        }
        pre.textContent = JSON.stringify(getSnapshot(host), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    const helpId = `mx-help-${Math.random().toString(36).slice(2, 7)}`;
    const helpText = `<div id="${helpId}" style="font-size:12px; opacity:.85;">Help text describing this progress indicator.</div>`;

    wrap.appendChild(
      card(
        'Default (linear determinate)',
        `
        ${helpText}
        ${toMarkup({ ...Default.args, ...args, circular: false, multi: false, ariaDescribedby: helpId, value: 35, slotText: '' })}
      `,
      ),
    );

    wrap.appendChild(
      card(
        'Inline (compact)',
        `
        ${toMarkup({ ...Default.args, ...args, circular: false, multi: false, height: 10, value: 60, showProgress: true, progressAlign: 'right', slotText: 'Loading' })}
      `,
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal (multi stacked)',
        `
        ${toMarkup({
          ...Default.args,
          ...args,
          circular: false,
          multi: true,
          label: 'Stacked segments',
          bars: [
            { value: 20, variant: 'primary', showProgress: true },
            { value: 35, variant: 'success', showProgress: true },
            { value: 15, variant: 'warning', showProgress: true },
          ],
          children: `
<span slot="bar-0">Primary chunk</span>
<span slot="bar-1">Success chunk</span>
<span slot="bar-2">Warn chunk</span>
          `.trim(),
        })}
      `,
      ),
    );

    wrap.appendChild(
      card(
        'Error / validation (danger + describedby)',
        `
        ${helpText}
        ${toMarkup({ ...Default.args, ...args, circular: false, multi: false, ariaDescribedby: helpId, variant: 'danger', value: 15, showProgress: true, slotText: '' })}
      `,
      ),
    );

    wrap.appendChild(
      card(
        'Disabled / busy (indeterminate)',
        `
        ${toMarkup({ ...Default.args, ...args, circular: true, multi: false, indeterminate: true, variant: 'secondary', label: 'Loading', showProgress: false, slotText: '' })}
      `,
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: { language: 'html', type: 'dynamic' },
      description: {
        story:
          'Prints computed accessibility wiring for progress. Shows `role="progressbar"` (and `role="group"` for multi) plus `aria-valuenow/max/min` or indeterminate `aria-busy`, and validates that `aria-labelledby` / `aria-describedby` ids resolve.',
      },
    },
  },
};
