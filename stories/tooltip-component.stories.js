// stories/tooltip-component.stories.js

export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Light-DOM tooltip wrapper. Place your trigger element inside the component. Supports placement, HTML content (trusted), variants, custom classes, manual control, and custom container.',
      },
    },
  },

  argTypes: {
    // Component props
    message: {
      control: 'text',
      table: { category: 'Tooltip Options' },
      description: 'Message fallback when no title/data-original-title supplied.',
    },

    tooltipTitle: {
      control: 'text',
      name: 'tooltip-title',
      table: { category: 'Tooltip Options' },
      description:
        'Title/content string; if empty, falls back to `title`/`data-original-title` attributes or `message` prop. Recommended for use with `html-content` to avoid escaping. Overrides `message` if both present.',
    },

    htmlContent: {
      control: 'boolean',
      name: 'html-content',
      table: { category: 'Tooltip Options', defaultValue: { summary: false } },
      description: 'Treat tooltip content as trusted HTML. "tooltipTitle" recommended.',
    },

    position: {
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right'],
      table: { category: 'Tooltip Options' },
      description: 'Tooltip placement, top, bottom, left, right, relative to trigger element.',
    },

    trigger: {
      control: 'text',
      table: { category: 'Tooltip Options' },
      description: 'Space-separated: "hover focus click manual"',
    },

    animation: {
      control: 'boolean',
      table: { category: 'Tooltip Options', defaultValue: { summary: true } },
      description: 'Enable or disable tooltip animation.',
    },

    container: {
      control: 'text',
      table: { category: 'Tooltip Options' },
      description: 'CSS selector or element reference for custom tooltip container. Defaults to body.',
    },

    customClass: {
      control: 'text',
      name: 'custom-class',
      table: { category: 'Tooltip Options' },
      description: 'Custom class(es) can be added to the tooltip element for custom styling.',
    },

    variant: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      table: { category: 'Tooltip Options' },
      description: 'Applies Bootstrap color variants, primary, secondary, success, danger, info, warning, dark, to the tooltip.',
    },

    visible: {
      control: 'boolean',
      table: { category: 'Tooltip Options', defaultValue: { summary: false } },
      description: 'Used only with manual trigger (wired in ManualTrigger story).',
    },

    // Demo helpers
    btnText: {
      control: 'text',
      name: 'btn-text',
      table: { category: 'Demo Helpers' },
      description: 'Text for the internal demo trigger button only.',
    },

    btnVariant: {
      control: 'select',
      options: ['secondary', 'primary', 'success', 'danger', 'info', 'warning', 'dark'],
      name: 'btn-variant',
      table: { category: 'Demo Helpers' },
      description: 'Variant for the internal demo trigger button only.',
    },
  },
};

// ======================================================
// Helpers
// ======================================================

/** Collapse blank lines + trim edges */
const normalize = txt => {
  const lines = String(txt ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      prevBlank = true;
      out.push('');
      continue;
    }
    prevBlank = false;
    out.push(line);
  }

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

const uid = () => `${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

/** Build clean attribute block */
const attrs = pairs =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v)}"`))
    .join('\n    ');

/** Generate markup from args */
const buildTooltipMarkup = (args, id) => {
  const htmlFlag = !!args.htmlContent;
  const dataTitle = (args.tooltipTitle || args.message || 'Tooltip content').replaceAll('"', '&quot;');

  const attributeBlock = attrs([
    ['id', id],
    ['position', args.position],
    ['trigger', args.trigger],
    ['custom-class', args.customClass],
    ['variant', args.variant],
    ['container', args.container],
    ['message', args.message],
    ['animation', args.animation],
    ['html-content', htmlFlag],
    ['data-original-title', dataTitle],
    ['data-html', htmlFlag ? true : null],
  ]);

  return normalize(`
<div style="display:inline-block">
  <tooltip-component
    ${attributeBlock}
  >
    <button-component
      btn-text="${args.btnText}"
      size="sm"
      variant="${args.btnVariant}"
    ></button-component>
  </tooltip-component>
</div>
  `);
};

// ======================================================
// Playground (Controls-enabled)
// ======================================================

export const Playground = {
  render: args => {
    const id = `tt-${uid()}`;
    return buildTooltipMarkup(args, id);
  },

  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_code, ctx) => {
          const id = `tt-doc-${uid()}`;
          return buildTooltipMarkup(ctx.args, id);
        },
      },
      description: {
        story:
          'Use the controls to customize the tooltip. Note: `tooltip-title` is used for the tooltip content in this demo to avoid escaping issues. In practice, you would typically use one content source (message OR tooltip-title OR data-original-title).',
      },
    },
  },
};

Playground.args = {
  message: '',
  tooltipTitle: 'Hello from tooltip!',
  htmlContent: false,
  position: 'top',
  trigger: 'hover focus',
  animation: true,
  container: '',
  customClass: '',
  variant: '',
  visible: false,

  btnText: 'Hover me',
  btnVariant: 'secondary',
};

// ======================================================
// Static Examples (Docs code preview forced to HTML)
// ======================================================

const POSITIONS_GRID_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component position="top" data-original-title="Tooltip on top" trigger="hover focus">
    <button-component btn-text="Top" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="right" data-original-title="Tooltip on right" trigger="hover focus">
    <button-component btn-text="Right" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="left" data-original-title="Tooltip on left" trigger="hover focus">
    <button-component btn-text="Left" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="bottom" data-original-title="Tooltip on bottom" trigger="hover focus">
    <button-component btn-text="Bottom" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="auto" data-original-title="Placement auto" trigger="hover focus">
    <button-component btn-text="Auto" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const PositionsGrid = {
  render: () => POSITIONS_GRID_HTML,
  parameters: {
    docs: {
      source: { language: 'html', code: POSITIONS_GRID_HTML },
      description: {
        story: 'Use the `position` prop to specify tooltip placement: top, right, bottom, left, or auto.',
      },
    },
  },
};

const WITH_HTML_CONTENT_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component
    position="top"
    data-original-title="<strong>HTML</strong> tooltip"
    trigger="hover focus"
    html-content
    data-html
  >
    <button-component btn-text="HTML Content" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const WithHTMLContent = {
  render: () => WITH_HTML_CONTENT_HTML,
  parameters: {
    docs: {
      source: { language: 'html', code: WITH_HTML_CONTENT_HTML },
      description: {
        story:
          'Set `html-content` (or `data-html`) to treat the tooltip content as trusted HTML. Use `tooltip-title` in apps when you want to avoid attribute escaping.',
      },
    },
  },
};

const VARIANTS_HTML = normalize(`
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component position="top" data-original-title="Primary" trigger="hover focus" variant="primary">
    <button-component btn-text="Primary" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Secondary" trigger="hover focus" variant="secondary">
    <button-component btn-text="Secondary" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Info" trigger="hover focus" variant="info">
    <button-component btn-text="Info" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Danger" trigger="hover focus" variant="danger">
    <button-component btn-text="Danger" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Warning" trigger="hover focus" variant="warning">
    <button-component btn-text="Warning" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Success" trigger="hover focus" variant="success">
    <button-component btn-text="Success" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component position="top" data-original-title="Dark" trigger="hover focus" variant="dark">
    <button-component btn-text="Dark" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`);

export const Variants = {
  render: () => VARIANTS_HTML,
  parameters: {
    docs: {
      source: { language: 'html', code: VARIANTS_HTML },
      description: {
        story: 'Use the `variant` prop to apply visual styles: primary, secondary, success, danger, warning, info, or dark.',
      },
    },
  },
};

const INLINE_LINKS_HTML = normalize(`
<p style="max-width:680px; line-height:1.6">
  Placeholder text to demonstrate some
  <tooltip-component position="top" data-original-title="Default tooltip" trigger="hover focus">
    <a href="javascript:void(0)">inline links</a>
  </tooltip-component>
  with tooltips.
</p>
`);

export const InlineLinks = {
  render: () => INLINE_LINKS_HTML,
  parameters: {
    docs: {
      source: { language: 'html', code: INLINE_LINKS_HTML },
      description: {
        story: 'Tooltips can be used on inline elements like links without disrupting text flow.',
      },
    },
  },
};

// ======================================================
// Manual Trigger (rendered with JS wiring, docs show HTML)
// ======================================================

// Docs preview MUST be HTML only (per your requirement).
// The story itself wires button handlers in JS (no <script> tag needed).
const manualTriggerDocsHtml = ids =>
  normalize(`
<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
  <tooltip-component id="${ids.tip}" trigger="manual click" position="bottom" data-original-title="Manually controlled tooltip">
    <button-component btn-text="Target" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <button-component btn-text="Show" size="sm" variant="primary" id="${ids.show}"></button-component>
  <button-component btn-text="Hide" size="sm" variant="danger" id="${ids.hide}"></button-component>
  <button-component btn-text="Toggle" size="sm" variant="info" id="${ids.toggle}"></button-component>
</div>
`);

export const ManualTrigger = {
  render: () => {
    const token = `manual-${uid()}`;
    const ids = {
      tip: token,
      show: `${token}-show`,
      hide: `${token}-hide`,
      toggle: `${token}-toggle`,
    };

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '10px';
    wrap.style.alignItems = 'center';
    wrap.style.flexWrap = 'wrap';

    const tip = document.createElement('tooltip-component');
    tip.setAttribute('id', ids.tip);
    tip.setAttribute('trigger', 'manual click');
    tip.setAttribute('position', 'bottom');
    tip.setAttribute('data-original-title', 'Manually controlled tooltip');

    const targetBtn = document.createElement('button-component');
    targetBtn.setAttribute('btn-text', 'Target');
    targetBtn.setAttribute('size', 'sm');
    targetBtn.setAttribute('variant', 'secondary');
    tip.appendChild(targetBtn);

    const showBtn = document.createElement('button-component');
    showBtn.setAttribute('id', ids.show);
    showBtn.setAttribute('btn-text', 'Show');
    showBtn.setAttribute('size', 'sm');
    showBtn.setAttribute('variant', 'primary');

    const hideBtn = document.createElement('button-component');
    hideBtn.setAttribute('id', ids.hide);
    hideBtn.setAttribute('btn-text', 'Hide');
    hideBtn.setAttribute('size', 'sm');
    hideBtn.setAttribute('variant', 'danger');

    const toggleBtn = document.createElement('button-component');
    toggleBtn.setAttribute('id', ids.toggle);
    toggleBtn.setAttribute('btn-text', 'Toggle');
    toggleBtn.setAttribute('size', 'sm');
    toggleBtn.setAttribute('variant', 'info');

    wrap.append(tip, showBtn, hideBtn, toggleBtn);

    // ✅ Wire up the tooltip API (no <script> injection)
    // IMPORTANT: Don't rely on tip.visible staying in sync.
    // Track state locally so Toggle truly toggles.
    let isOpen = false;

    const safeShow = () => {
      isOpen = true;
      if (typeof tip.show === 'function') tip.show();
      else tip.setAttribute('visible', ''); // fallback if boolean attr is supported
    };

    const safeHide = () => {
      isOpen = false;
      if (typeof tip.hide === 'function') tip.hide();
      else tip.removeAttribute('visible'); // fallback
    };

    showBtn.addEventListener('click', () => safeShow());
    hideBtn.addEventListener('click', () => safeHide());

    toggleBtn.addEventListener('click', () => {
      if (isOpen) safeHide();
      else safeShow();
    });

    return wrap;
  },

  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: () =>
          manualTriggerDocsHtml({
            tip: 'manual-tooltip',
            show: 'manual-tooltip-show',
            hide: 'manual-tooltip-hide',
            toggle: 'manual-tooltip-toggle',
          }),
      },
      description: {
        story: 'Tooltips can be manually controlled via API (show/hide), with external buttons wired in JS.',
      },
    },
  },
};

const CUSTOM_CONTAINER_HTML = normalize(`
<div>
  <div id="sb-tooltip-container" style="position:relative; border:1px dashed #ccc; padding:20px; height:160px; overflow:auto">
    <div style="height:320px; margin-top:80px">
      <tooltip-component
        container="#sb-tooltip-container"
        position="right"
        data-original-title="Inside scrollable container"
        trigger="hover focus"
      >
        <button-component btn-text="Hover me" size="sm" variant="secondary"></button-component>
      </tooltip-component>
    </div>
  </div>
  <small style="color:#666">Tooltip stays inside container.</small>
</div>
`);

export const CustomContainer = {
  render: () => CUSTOM_CONTAINER_HTML,
  parameters: {
    docs: {
      source: { language: 'html', code: CUSTOM_CONTAINER_HTML },
      description: {
        story: 'Tooltips can be contained within a custom container. Useful for scrollable or constrained areas.',
      },
    },
  },
};
