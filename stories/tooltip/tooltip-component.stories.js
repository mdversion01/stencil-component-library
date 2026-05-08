import DocsPage from './tooltip-component.docs.mdx';
import {
  uid,
  buildTooltipMarkup,
  manualTriggerDocsHtml,
  snapshotA11y,
  createExample,
  makeTooltipHost,
  makeButton,
  POSITIONS_GRID_HTML,
  WITH_HTML_CONTENT_HTML,
  VARIANTS_HTML,
  INLINE_LINKS_HTML,
  CUSTOM_CONTAINER_HTML,
} from './tooltip-component.story-helpers';

export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'Light-DOM tooltip wrapper. Place your trigger element inside the component. Supports placement, HTML content (trusted), variants, custom classes, manual control, custom container, and an optional stable `tooltip-id` (recommended for tests/SSR).',
      },
      source: {
        language: 'html',
        transform: (_code, ctx) => {
          const id = `tt-doc-${uid()}`;
          return buildTooltipMarkup(ctx.args, id);
        },
      },
    },
  },

  argTypes: {
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

    tooltipId: {
      control: 'text',
      name: 'tooltip-id',
      table: { category: 'Tooltip Options' },
      description:
        'Optional stable id base for the tooltip element (recommended for tests/SSR). If omitted, a deterministic-ish id is generated.',
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
      description: 'Tooltip placement relative to trigger element.',
    },

    trigger: {
      control: 'text',
      table: { category: 'Tooltip Options' },
      description: 'Space-separated: "hover focus click manual"',
    },

    animation: {
      control: 'boolean',
      table: { category: 'Tooltip Options', defaultValue: { summary: true } },
      description: 'Enable or disable tooltip animation class.',
    },

    container: {
      control: 'text',
      table: { category: 'Tooltip Options' },
      description: 'CSS selector for custom tooltip container. Defaults to body.',
    },

    customClass: {
      control: 'text',
      name: 'custom-class',
      table: { category: 'Tooltip Options' },
      description: 'Custom class(es) applied to tooltip parts.',
    },

    variant: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      table: { category: 'Tooltip Options' },
      description: 'Bootstrap color variant applied to tooltip.',
    },

    visible: {
      control: 'boolean',
      table: { category: 'Tooltip Options', defaultValue: { summary: false } },
      description: 'Used only with manual trigger (wired in ManualTrigger story).',
    },

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
// Playground (Controls-enabled)
// ======================================================

export const Playground = {
  render: (args) => {
    const id = `tt-${uid()}`;
    return buildTooltipMarkup(args, id);
  },

  parameters: {
    docs: {
      description: {
        story:
          'Use the controls to customize the tooltip. This demo uses `data-original-title` for content so the Docs source stays readable. In apps, you would typically use one content source (message OR tooltip-title OR data-original-title).',
      },
    },
  },
};

Playground.args = {
  message: '',
  tooltipTitle: 'Hello from tooltip!',
  tooltipId: '',
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
// Static Examples
// ======================================================

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

export const WithHTMLContent = {
  render: () => WITH_HTML_CONTENT_HTML,
  parameters: {
    docs: {
      source: { language: 'html', code: WITH_HTML_CONTENT_HTML },
      description: {
        story:
          'Set `html-content` (or `data-html`) to treat the tooltip content as trusted HTML. In apps, consider using `tooltip-title` to avoid attribute escaping.',
      },
    },
  },
};

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
// Manual Trigger
// ======================================================

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

    let isOpen = false;

    const safeShow = () => {
      isOpen = true;
      if (typeof tip.show === 'function') tip.show();
      else tip.setAttribute('visible', '');
    };

    const safeHide = () => {
      isOpen = false;
      if (typeof tip.hide === 'function') tip.hide();
      else tip.removeAttribute('visible');
    };

    showBtn.addEventListener('click', () => safeShow());
    hideBtn.addEventListener('click', () => safeHide());
    toggleBtn.addEventListener('click', () => (isOpen ? safeHide() : safeShow()));

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

// ======================================================
// Accessibility Matrix
// ======================================================

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (_args, context) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Shows examples and prints computed trigger/tooltip semantics (<code>role</code>, <code>aria-*</code>, and ids).
        Tooltips are not auto-opened here to avoid overlays blocking content.
      </div>
    `;
    wrap.appendChild(header);

    wrap.appendChild(
      createExample('Default', () =>
        makeTooltipHost(
          context,
          {
            'tooltip-id': 'a11y-default',
            position: 'top',
            trigger: 'hover focus',
            'data-original-title': 'Default tooltip',
          },
          makeButton('Default trigger'),
        ),
      ),
    );

    const inlineLink = document.createElement('a');
    inlineLink.href = 'javascript:void(0)';
    inlineLink.textContent = 'inline link';
    wrap.appendChild(
      createExample('Inline', () =>
        makeTooltipHost(
          context,
          {
            'tooltip-id': 'a11y-inline',
            position: 'top',
            trigger: 'hover focus',
            'data-original-title': 'Inline tooltip',
          },
          inlineLink,
        ),
      ),
    );

    const mid = makeButton('Middle');
    wrap.appendChild(
      createExample('Horizontal (layout example)', () =>
        makeTooltipHost(
          context,
          {
            'tooltip-id': 'a11y-horizontal',
            position: 'bottom',
            trigger: 'hover focus',
            'data-original-title': 'Horizontal layout tooltip',
          },
          mid,
        ),
      ),
    );

    wrap.appendChild(
      createExample('Error / validation styling (danger variant)', () =>
        makeTooltipHost(
          context,
          {
            'tooltip-id': 'a11y-error',
            position: 'right',
            trigger: 'hover focus',
            variant: 'danger',
            'data-original-title': 'Something went wrong.',
          },
          makeButton('Danger trigger'),
        ),
      ),
    );

    wrap.appendChild(
      createExample('Disabled trigger', () =>
        makeTooltipHost(
          context,
          {
            'tooltip-id': 'a11y-disabled',
            position: 'top',
            trigger: 'hover focus',
            'data-original-title': 'Disabled trigger tooltip (should not show via user interaction).',
          },
          makeButton('Disabled', true),
        ),
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Includes example triggers for several configurations and prints the computed a11y wiring (role/aria/id). Tooltips are not auto-opened here (so overlays won’t block content). Hover/focus a trigger if you want to see the tooltip element get created in the DOM.',
      },
    },
  },
};
