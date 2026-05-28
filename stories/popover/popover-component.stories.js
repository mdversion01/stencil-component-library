import PopoverDocs from './popover-component.docs.mdx';
import {
  normalizeHtml,
  buildBasicPopoverHtml,
  buildRenderMarkup,
  getSnapshot,
} from './popover-component.story-helpers';

const Template = args => buildRenderMarkup(args);

export default {
  title: 'Components/Popover',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: PopoverDocs,
      source: { type: 'dynamic', language: 'html' },
      description: {
        component: 'A popover component that displays contextual information when triggered by user interaction.',
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description:
        'ARIA override for the popover in click (dialog) mode. Ignored when aria-labelledby is provided. Also ignored when a header is present; use `no-header` to suppress the header.',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'ARIA override for the popover in click (dialog) mode. Space-separated ids.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'ARIA override for the popover in click (dialog) mode. Merged with the body id.',
      table: { category: 'Accessibility' },
    },

    popoverTitle: {
      control: 'text',
      name: 'title',
      description: 'Popover title.',
      table: { category: 'Content' },
    },
    noHeader: {
      control: 'boolean',
      name: 'no-header',
      description: 'When true, the popover header is not rendered even if `title` is provided.',
      table: { category: 'Content', defaultValue: { summary: false } },
    },
    content: {
      control: 'text',
      description: 'Popover content.',
      table: { category: 'Content' },
    },

    trigger: {
      control: { type: 'select' },
      options: ['click', 'hover', 'focus', 'click hover', 'click focus', 'hover focus'],
      description: 'Event(s) that trigger the popover.',
      table: { category: 'Trigger & Targeting' },
    },
    target: {
      control: 'text',
      description: 'If set, popover is triggered by external element with this id.',
      table: { category: 'Trigger & Targeting' },
    },
    visible: {
      control: 'boolean',
      description: 'Force popover to be visible.',
      table: { category: 'Trigger & Targeting', defaultValue: { summary: false } },
    },
    superTooltip: {
      control: 'boolean',
      name: 'super',
      description: 'Enable super tooltip mode.',
      table: { category: 'Trigger & Targeting', defaultValue: { summary: false } },
    },

    placement: {
      control: {
        type: 'select',
      },
      options: [
        'auto',
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'left-end',
        'right-start',
        'right-end',
      ],
      description: 'Preferred popover placement.',
      table: { category: 'Positioning' },
    },
    fallbackPlacement: {
      control: 'text',
      name: 'fallback-placement',
      description: 'e.g. "flip" or "clockwise" or a CSV list like "top, right, bottom".',
      table: { category: 'Positioning' },
    },
    offset: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Distance in pixels between popover and target.',
      table: { category: 'Positioning' },
    },
    yOffset: {
      control: { type: 'number', step: 1 },
      name: 'y-offset',
      description: 'Cross-axis nudge in pixels.',
      table: { category: 'Positioning' },
    },

    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      description: 'Color variant for the popover.',
      table: { category: 'Styling' },
    },
    plumage: {
      control: 'boolean',
      description: 'Use plumage (alternative) styling.',
      table: { category: 'Styling', defaultValue: { summary: false } },
    },
    customClass: {
      control: 'text',
      name: 'custom-class',
      description: 'Additional CSS class for custom styling.',
      table: { category: 'Styling' },
    },

    arrowOff: {
      control: 'boolean',
      name: 'arrow-off',
      description: 'Disable popover arrow.',
      table: { category: 'Chrome', defaultValue: { summary: false } },
    },
  },
};

export const BasicPopover = Template.bind({});
BasicPopover.args = {
  arrowOff: false,
  content: 'This is a popover. Use controls to change me!',
  customClass: '',
  fallbackPlacement: 'flip',
  offset: 0,
  placement: 'bottom',
  plumage: false,
  popoverTitle: 'Popover title',
  noHeader: false,
  superTooltip: false,
  target: '',
  trigger: 'click',
  variant: 'primary',
  visible: false,
  yOffset: 0,
  ariaLabel: '',
  ariaLabelledby: '',
  ariaDescribedby: '',
};
BasicPopover.storyName = 'Basic Popover';
BasicPopover.parameters = {
  docs: {
    source: {
      type: 'dynamic',
      language: 'html',
      transform: (_src, ctx) =>
        buildBasicPopoverHtml(
          {
            ...ctx.args,
            target: ctx.args.target?.trim() ? ctx.args.target.trim() : '',
          },
          {
            id: 'basic-popover',
            triggerId: 'basic-popover-btn',
          },
        ),
    },
    description: {
      story:
        'A basic popover example. Use the controls to customize its behavior and appearance. You can change the trigger event, placement, content, and more.',
    },
  },
};

export const ClickTrigger = () =>
  normalizeHtml(`
<popover-component title="Hello" content="This pops on click." placement="auto">
  <button-component id="btn-a" variant="primary" btn-text="Click me"></button-component>
</popover-component>
`);
ClickTrigger.storyName = 'Click Trigger';
ClickTrigger.parameters = {
  docs: {
    source: { code: ClickTrigger(), language: 'html' },
    description: { story: 'A popover that appears when the button is clicked. This is the default trigger behavior.' },
  },
};

export const HoverTrigger = () =>
  normalizeHtml(`
<popover-component trigger="hover" title="Hover title" content="Shown while hovering." placement="auto">
  <button-component id="btn-b" variant="secondary">Hover Over Me</button-component>
</popover-component>
`);
HoverTrigger.storyName = 'Hover Over Trigger';
HoverTrigger.parameters = {
  docs: {
    source: { code: HoverTrigger(), language: 'html' },
    description: { story: 'A popover that appears when the button is hovered over with the mouse.' },
  },
};

export const FocusTrigger = () =>
  normalizeHtml(`
<popover-component title="Focus trap" content="Appears on focus; Tab to close or blur" trigger="focus" placement="auto">
  <button-component id="btn-c" variant="secondary">Tab to me</button-component>
</popover-component>
`);
FocusTrigger.storyName = 'Tab to Focus Trigger';
FocusTrigger.parameters = {
  docs: {
    source: { code: FocusTrigger(), language: 'html' },
    description: { story: 'A popover that appears when the button receives focus (e.g., via keyboard navigation).' },
  },
};

export const Variants = () =>
  normalizeHtml(`
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <popover-component title="primary" content="Color: primary" variant="primary" trigger="hover" placement="auto">
    <button-component variant="primary">primary</button-component>
  </popover-component>
  <popover-component title="secondary" content="Color: secondary" variant="secondary" trigger="hover" placement="auto">
    <button-component variant="secondary">secondary</button-component>
  </popover-component>
  <popover-component title="success" content="Color: success" variant="success" trigger="hover" placement="auto">
    <button-component variant="success">success</button-component>
  </popover-component>
  <popover-component title="warning" content="Color: warning" variant="warning" trigger="hover" placement="auto">
    <button-component variant="warning">warning</button-component>
  </popover-component>
  <popover-component popover-title="danger" content="Color: danger" variant="danger" trigger="hover" placement="auto">
    <button-component variant="danger">danger</button-component>
  </popover-component>
  <popover-component title="info" content="Color: info" variant="info" trigger="hover" placement="auto">
    <button-component variant="info">info</button-component>
  </popover-component>
  <popover-component title="dark" content="Color: dark" variant="dark" trigger="hover" placement="auto">
    <button-component variant="dark">dark</button-component>
  </popover-component>
</div>
`);
Variants.storyName = 'Color Variants';
Variants.parameters = {
  docs: {
    source: { code: Variants(), language: 'html' },
    description: { story: 'Popovers can have different color variants. Hover over the buttons to see them in action.' },
  },
};

export const SuperTooltipMode = () =>
  normalizeHtml(`
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <popover-component title="Super tooltip" content="Denser visual style" super placement="auto">
    <button-component id="btn-super-1" variant="primary">Super tooltip</button-component>
  </popover-component>

  <popover-component title="Plumage Super tooltip" content="Plumage styled Super tooltip" plumage super placement="right">
    <button-component id="btn-super-2" size="plumage-size" variant="primary">Plumage Styled Super tooltip</button-component>
  </popover-component>
</div>
`);
SuperTooltipMode.storyName = 'Super Tooltip';
SuperTooltipMode.parameters = {
  docs: {
    source: { code: SuperTooltipMode(), language: 'html' },
    description: { story: 'Popover in super tooltip mode via the `super` attribute.' },
  },
};

export const SlotContent = () =>
  normalizeHtml(`
<popover-component title="Title" placement="bottom">
  <button-component id="btn-slot-content" variant="primary">Slotted Popover Content</button-component>

  <template slot="content">
    <p><strong>Rich</strong> content with HTML.</p>
    <a href="#">Focusable link</a>
  </template>
</popover-component>
`);
SlotContent.storyName = 'Slot Content';
SlotContent.parameters = {
  docs: {
    source: { code: SlotContent(), language: 'html' },
    description: {
      story:
        'Use a `<template slot="content">` to provide rich HTML content for the popover body. Using `<template>` avoids rendering the content in the page while still allowing the component to inject it into the popover.',
    },
  },
};

export const NoHeader = () =>
  normalizeHtml(`
<div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
  <popover-component
    title="Header suppressed"
    no-header
    content="This popover has no header (even though title is set)."
    placement="bottom"
  >
    <button-component id="btn-no-header" variant="primary">No Header</button-component>
  </popover-component>

  <popover-component
    title="Plumage + Super (no header)"
    no-header
    plumage
    super
    content="No header + plumage styling + super mode."
    placement="right"
  >
    <button-component id="btn-no-header-plumage-super" variant="primary" size="plumage-size">
      No Header (Plumage + Super)
    </button-component>
  </popover-component>
</div>
`);
NoHeader.storyName = 'No Header';
NoHeader.parameters = {
  docs: {
    source: { code: NoHeader(), language: 'html' },
    description: {
      story:
        'Demonstrates `no-header` which suppresses rendering `.popover-header` even when `title` is set. Includes a second example using `plumage` + `super`.',
    },
  },
};

export const PositionsGrid = () =>
  normalizeHtml(`
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <popover-component title="top" content="This is the top position" placement="top"><button-component variant="secondary" outlined>Top position</button-component></popover-component>
  <popover-component title="top-start" content="This is the top-start position" placement="top-start"><button-component variant="secondary" outlined>Top-start position</button-component></popover-component>
  <popover-component title="top-end" content="This is the top-end position" placement="top-end"><button-component variant="secondary" outlined>Top-end position</button-component></popover-component>
  <popover-component title="left" content="This is the left position" placement="left"><button-component variant="secondary" outlined>Left position</button-component></popover-component>
  <popover-component title="left-start" content="This is the left-start position" placement="left-start"><button-component variant="secondary" outlined>Left-start position</button-component></popover-component>
  <popover-component title="left-end" content="This is the left-end position" placement="left-end"><button-component variant="secondary" outlined>Left-end position</button-component></popover-component>
  <popover-component title="right-start" content="This is the right-start position" placement="right-start"><button-component variant="secondary" outlined>Right-start position</button-component></popover-component>
  <popover-component title="right-end" content="This is the right-end position" placement="right-end"><button-component variant="secondary" outlined>Right-end position</button-component></popover-component>
  <popover-component title="bottom" content="This is the bottom position" placement="bottom"><button-component variant="secondary" outlined>Bottom position</button-component></popover-component>
  <popover-component title="bottom-start" content="This is the bottom-start position" placement="bottom-start"><button-component variant="secondary" outlined>Bottom-start position</button-component></popover-component>
  <popover-component title="bottom-end" content="This is the bottom-end position" placement="bottom-end"><button-component variant="secondary" outlined>Bottom-end position</button-component></popover-component>
  <popover-component title="right" content="This is the right position" placement="right"><button-component variant="secondary" outlined>Right position</button-component></popover-component>
</div>
`);
PositionsGrid.storyName = 'Placements Grid';
PositionsGrid.parameters = {
  docs: {
    source: { code: PositionsGrid(), language: 'html' },
    description: { story: 'Quick visual grid of supported Popper-style placements (start/end).' },
  },
};

export const OffsetAndY = () =>
  normalizeHtml(`
<popover-component title="Offset demo" content="offset=16, y-offset=0" placement="auto" offset="16" y-offset="0">
  <button class="btn btn-outline-primary" type="button">Offset Popover</button>
</popover-component>
`);
OffsetAndY.storyName = 'Offset + Y Offset';
OffsetAndY.parameters = {
  docs: {
    source: { code: OffsetAndY(), language: 'html' },
    description: { story: 'Demonstrates main-axis offset and cross-axis y-offset.' },
  },
};

export const ExternalTarget = () =>
  normalizeHtml(`
<button id="ext-popover-trigger" class="btn btn-primary" type="button">External trigger</button>

<popover-component
  title="External"
  content="I am attached via target id"
  placement="bottom"
  trigger="click"
  target="ext-popover-trigger"
></popover-component>
`);
ExternalTarget.storyName = 'External Target';
ExternalTarget.parameters = {
  docs: {
    source: { code: ExternalTarget(), language: 'html' },
    description: { story: 'Attach the popover to an external trigger element via `target`.' },
  },
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
        Prints computed <code>role</code> + <code>aria-*</code> + generated ids.
        For popover: <em>click</em> behaves as a non-modal <code>dialog</code>; <em>hover/focus</em> behaves as a <code>tooltip</code>.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs, openAction) => {
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
      mount.innerHTML = Template({ ...BasicPopover.args, ...args, ...storyArgs });
      const host = mount.querySelector('popover-component');

      demo.appendChild(mount);

      const update = async () => {
        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('popover-component');
          } catch (_e) {}
        }

        if (typeof openAction === 'function') {
          try {
            await openAction(host);
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

    const openClick = async host => {
      const trigger =
        host?.querySelector('button') ||
        host?.querySelector('button-component') ||
        host?.querySelector('[role="button"]') ||
        host?.querySelector('[tabindex]');

      trigger?.dispatchEvent?.(new MouseEvent('click', { bubbles: true }));
      await new Promise(resolve => requestAnimationFrame(resolve));
    };

    const openHover = async host => {
      const trigger =
        host?.querySelector('button') ||
        host?.querySelector('button-component') ||
        host?.querySelector('[role="button"]') ||
        host?.querySelector('[tabindex]');

      trigger?.dispatchEvent?.(new MouseEvent('mouseenter', { bubbles: true }));
      await new Promise(resolve => requestAnimationFrame(resolve));
    };

    wrap.appendChild(
      card(
        'Default (click → dialog)',
        {
          trigger: 'click',
          popoverTitle: 'Default dialog',
          content: 'Click-triggered popover.',
          placement: 'auto',
          noHeader: false,
        },
        openClick,
      ),
    );

    wrap.appendChild(
      card(
        'No header (click → dialog, aria-label fallback)',
        {
          trigger: 'click',
          popoverTitle: 'Hidden header title',
          noHeader: true,
          content: 'Header suppressed; title should become aria-label.',
          placement: 'auto',
        },
        openClick,
      ),
    );

    wrap.appendChild(
      card(
        'Tooltip mode (hover → tooltip)',
        {
          trigger: 'hover',
          popoverTitle: 'Tooltip title',
          content: 'Hover-triggered tooltip popover.',
          placement: 'top',
        },
        openHover,
      ),
    );

    wrap.appendChild(
      card(
        'Validation / error style (danger variant)',
        {
          trigger: 'click',
          variant: 'danger',
          popoverTitle: 'Error',
          content: 'Example error/help message content.',
        },
        openClick,
      ),
    );

    wrap.appendChild(
      card(
        'Disabled trigger (button disabled)',
        {
          trigger: 'click',
          popoverTitle: 'Disabled',
          content: 'If the trigger is disabled, click will not open in most browsers.',
        },
        async host => {
          const btn = host?.querySelector('button');
          if (btn) btn.setAttribute('disabled', '');
          await new Promise(resolve => requestAnimationFrame(resolve));
        },
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for popover triggers and the rendered popover element. Click-triggered popovers behave as non-modal dialogs (`aria-controls`, `aria-expanded`, `role="dialog"`). Hover/focus behaves as a tooltip (`aria-describedby`, `role="tooltip"`).',
      },
      source: { language: 'html', type: 'dynamic' },
    },
  },
};
