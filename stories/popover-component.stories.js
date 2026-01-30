// src/stories/popover-component.stories.js

export default {
  title: 'Components/Popover',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'dynamic', language: 'html' },
      description: {
        component: 'A popover component that displays contextual information when triggered by user interaction.',
      },
    },
  },
  argTypes: {
    arrowOff: { control: 'boolean', name: 'arrow-off', description: 'Disable popover arrow.' },
    content: { control: 'text', description: 'Popover content.' },
    customClass: { control: 'text', name: 'custom-class', description: 'Additional CSS class for custom styling.' },

    fallbackPlacement: {
      control: 'text',
      name: 'fallback-placement',
      description: 'e.g. "flip" or "clockwise" or a CSV list like "top, right, bottom".',
    },

    offset: { control: { type: 'number', min: 0, step: 1 }, description: 'Distance in pixels between popover and target.' },

    placement: {
      control: { type: 'select' },
      options: ['auto', 'top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'],
      description: 'Preferred popover placement.',
    },

    plumage: { control: 'boolean', description: 'Use plumage (alternative) styling.' },

    // attribute is `title` (prop is popoverTitle internally)
    popoverTitle: { control: 'text', name: 'title', description: 'Popover title.' },

    // attribute is `super`
    superTooltip: { control: 'boolean', name: 'super', description: 'Enable super tooltip mode.' },

    target: {
      control: 'text',
      description: 'If set, popover is triggered by external element with this id.',
    },

    trigger: {
      control: { type: 'select' },
      options: ['click', 'hover', 'focus', 'click hover', 'click focus', 'hover focus'],
      description: 'Event(s) that trigger the popover.',
    },

    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
      description: 'Color variant for the popover.',
    },

    visible: { control: 'boolean', description: 'Force popover to be visible.' },

    yOffset: { control: { type: 'number', step: 1 }, name: 'y-offset', description: 'Cross-axis nudge in pixels.' },
  },
};

const boolLine = (name, on) => (on ? `  ${name}` : null);
const attrLine = (name, val) => (val === undefined || val === null || val === '' ? null : `  ${name}="${String(val)}"`);

const normalizeHtml = html => {
  const lines = String(html ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''));

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

const normalizeFallback = v => {
  if (!v) return '';
  if (Array.isArray(v)) return v.join(',');
  return String(v);
};

const buildPopoverAttrsBlock = a => {
  const fallback = normalizeFallback(a.fallbackPlacement);

  const lines = [
    boolLine('arrow-off', a.arrowOff),
    attrLine('content', a.content),
    attrLine('custom-class', a.customClass),
    attrLine('fallback-placement', fallback),
    attrLine('offset', a.offset),
    attrLine('placement', a.placement),
    boolLine('plumage', a.plumage),
    boolLine('super', a.superTooltip),
    attrLine('target', a.target),
    attrLine('title', a.popoverTitle),
    attrLine('trigger', a.trigger),
    attrLine('variant', a.variant),
    boolLine('visible', a.visible),
    attrLine('y-offset', a.yOffset),
  ].filter(Boolean);

  return lines.length ? `\n${lines.join('\n')}` : '';
};

const buildPopoverTagWithChild = (a, { id } = {}) => {
  const idAttr = id ? ` id="${id}"` : '';
  const attrs = buildPopoverAttrsBlock(a);
  return `<popover-component${idAttr}${attrs}\n>
  <button class="btn btn-primary">Popover trigger</button>
</popover-component>`;
};

const buildPopoverTagExternal = (a, triggerId) => {
  const patch = { ...a, target: triggerId };
  const attrs = buildPopoverAttrsBlock(patch);
  return `<popover-component${attrs}\n></popover-component>`;
};

/* ============================== BasicPopover ============================== */

const Template = args => {
  const id = `popover-${Math.random().toString(36).slice(2, 9)}`;
  const triggerId = args.target?.trim() ? args.target.trim() : `${id}-btn`;
  const useExternalTarget = !!args.target?.trim();

  const html = `
<div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
  ${
    useExternalTarget
      ? `
  <button id="${triggerId}" class="btn btn-primary">External trigger</button>
  ${buildPopoverTagExternal(args, triggerId)}
  `
      : `
  ${buildPopoverTagWithChild(args, { id })}
  `
  }
</div>
`;

  return normalizeHtml(html);
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
  superTooltip: false,
  target: '',
  trigger: 'click',
  variant: 'primary',
  visible: false,
  yOffset: 0,
};
BasicPopover.storyName = 'Basic Popover';
BasicPopover.parameters = {
  docs: {
    source: { code: Template(BasicPopover.args), language: 'html' },
    description: {
      story: 'A basic popover example. Use the controls to customize its behavior and appearance. You can change the trigger event, placement, content, and more.',
    },
  },
};

/* ============================== Focused Examples ============================== */

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
  <popover-component title="danger" content="Color: danger" variant="danger" trigger="hover" placement="auto">
    <button-component variant="danger">danger</button-component>
  </popover-component>
  <popover-component title="info" content="Color: info" variant="info" trigger="hover" placement="auto">
    <button-component variant="info">info</button-component>
  </popover-component>
  <popover-component title="dark" content="Color: dark" variant="dark" trigger="hover" placement="auto">
    <button-component variant="dark">dark</button-component>
  </popover-component>
  <popover-component title="light" content="Color: light" variant="light" trigger="hover" placement="auto">
    <button-component variant="light">light</button-component>
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

      <popover-component title="Plumage Super tooltip" content="Plumage styled Super tooltip" plumage super placement="auto">
        <button-component id="btn-super-2" size="plumage-size"variant="primary">Plumage Styled Super tooltip</button-component>
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

/* ============================== NEW: Slot Content Example ============================== */

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
  <button class="btn btn-outline-primary">Offset Popover</button>
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
<button id="ext-popover-trigger" class="btn btn-primary">External trigger</button>

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
