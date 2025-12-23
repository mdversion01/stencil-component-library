// src/stories/popover-component.stories.js

export default {
  title: 'Components/Popover',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { source: { type: 'dynamic' } },
  },
  argTypes: {
    // Booleans
    arrowOff: { control: 'boolean', name: 'arrow-off' },
    plumage: { control: 'boolean' },
    visible: { control: 'boolean' },
    superTooltip: { control: 'boolean', name: 'super' },

    // Text
    popoverTitle: { control: 'text', name: 'title' },
    content: { control: 'text' },
    customClass: { control: 'text', name: 'custom-class' },
    target: { control: 'text', description: 'id of external trigger element (optional)' },

    // Selects
    placement: {
      control: { type: 'select' },
      options: ['auto', 'top', 'bottom', 'left', 'right', 'topright', 'topleft', 'bottomright', 'bottomleft', 'lefttop', 'leftbottom', 'righttop', 'rightbottom'],
    },
    variant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
    },
    trigger: {
      control: { type: 'select' },
      options: ['click', 'hover', 'focus', 'click hover', 'click focus', 'hover focus'],
    },

    // Fallback placement – keep simple as text (accepts single value or CSV)
    fallbackPlacement: {
      control: 'text',
      name: 'fallback-placement',
      description: 'e.g. "flip" or "clockwise" or "top, right, bottom"',
    },

    // Numbers
    offset: { control: { type: 'number', min: 0, step: 1 } },
    yOffset: { control: { type: 'number', step: 1 }, name: 'y-offset' },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) => (val === undefined || val === null || val === '' ? '' : ` ${name}="${String(val)}"`);

const normalizeFallback = v => {
  if (!v) return '';
  if (Array.isArray(v)) return v.join(',');
  return String(v);
};

/* ============================== Playground ============================== */

const Template = args => {
  // If user supplied a CSV list, pass it as a string; component supports arrays too,
  // but attributes are strings — fine for demo purposes.
  const fallback = normalizeFallback(args.fallbackPlacement);

  const id = `popover-${Math.random().toString(36).slice(2, 9)}`;
  const triggerId = args.target?.trim() ? args.target.trim() : `${id}-btn`;

  // If args.target provided, we’ll render a separate external trigger and set target=<id>.
  const useExternalTarget = !!args.target?.trim();

  return `
<div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
  ${
    useExternalTarget
      ? `
    <button id="${triggerId}" class="btn btn-primary">External trigger</button>
    <popover-component
      ${boolAttr('arrow-off', args.arrowOff)}
      ${attr('custom-class', args.customClass)}
      ${attr('title', args.popoverTitle)}
      ${attr('content', args.content)}
      ${attr('placement', args.placement)}
      ${boolAttr('plumage', args.plumage)}
      ${attr('variant', args.variant)}
      ${boolAttr('visible', args.visible)}
      ${boolAttr('super', args.superTooltip)}
      ${attr('trigger', args.trigger)}
      ${attr('fallback-placement', fallback)}
      ${attr('offset', args.offset)}
      ${attr('y-offset', args.yOffset)}
      ${attr('target', triggerId)}
    ></popover-component>
  `
      : `
    <popover-component
      ${boolAttr('arrow-off', args.arrowOff)}
      ${attr('custom-class', args.customClass)}
      ${attr('title', args.popoverTitle)}
      ${attr('content', args.content)}
      ${attr('placement', args.placement)}
      ${boolAttr('plumage', args.plumage)}
      ${attr('variant', args.variant)}
      ${boolAttr('visible', args.visible)}
      ${boolAttr('super', args.superTooltip)}
      ${attr('trigger', args.trigger)}
      ${attr('fallback-placement', fallback)}
      ${attr('offset', args.offset)}
      ${attr('y-offset', args.yOffset)}
      id="${id}"
    >
      <button class="btn btn-primary">Popover trigger</button>
    </popover-component>
  `
  }
</div>
`;
};

export const Playground = Template.bind({});
Playground.args = {
  arrowOff: false,
  customClass: '',
  popoverTitle: 'Popover title',
  content: 'This is a popover. Use controls to change me!',
  placement: 'auto',
  plumage: false,
  variant: '',
  visible: false,
  superTooltip: false,
  trigger: 'click',
  fallbackPlacement: 'flip',
  offset: 8,
  yOffset: 0,
  target: '',
};

/* ============================== Focused Examples ============================== */

export const ClickTrigger = () => `
<popover-component title="Hello" content="This pops on click." placement="auto">
  <button-component id="btn-a" variant="primary" btn-text="Click me"></button-component>
</popover-component>
`;

export const HoverTrigger = () => `
<popover-component trigger="hover" title="Hover title" content="Shown while hovering." placement="auto">
  <button-component id="btn-b" variant="secondary">Hover me</button-component>
</popover-component>
`;

export const FocusTrigger = () => `
<popover-component title="Focus trap" content="Appears on focus; Tab to close or blur" trigger="focus" placement="auto">
  <button-component id="btn-c" variant="secondary">Tab to me</button-component>
</popover-component>
`;

export const Variants = () => `
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <popover-component title="Primary" content="Color: primary" variant="primary" trigger="hover" >
    <button class="btn btn-light">primary</button>
  </popover-component>
  <popover-component title="Success" content="Color: success" variant="success" trigger="hover" >
    <button class="btn btn-light">success</button>
  </popover-component>
  <popover-component title="Danger" content="Color: danger" variant="danger" trigger="hover"  >
    <button class="btn btn-light">danger</button>
  </popover-component>
  <popover-component title="Dark" content="Color: dark" variant="dark" trigger="hover" >
    <button class="btn btn-light">dark</button>
  </popover-component>
</div>
`;

export const SuperTooltipMode = () => `
<popover-component title="Super tooltip" content="Denser visual style" super placement="top">
  <button class="btn btn-info">Super tooltip</button>
</popover-component>
`;

export const PositionsGrid = () => `
<div style="display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:16px;">
  <popover-component title="top" content="top" placement="top"><button class="btn btn-outline-secondary">top</button></popover-component>
  <popover-component title="topleft" content="topleft" placement="topleft"><button class="btn btn-outline-secondary">topleft</button></popover-component>
  <popover-component title="topright" content="topright" placement="topright"><button class="btn btn-outline-secondary">topright</button></popover-component>
  <popover-component title="left" content="left" placement="left"><button class="btn btn-outline-secondary">left</button></popover-component>

  <popover-component title="lefttop" content="lefttop" placement="lefttop"><button class="btn btn-outline-secondary">lefttop</button></popover-component>
  <popover-component title="leftbottom" content="leftbottom" placement="leftbottom"><button class="btn btn-outline-secondary">leftbottom</button></popover-component>
  <popover-component title="righttop" content="righttop" placement="righttop"><button class="btn btn-outline-secondary">righttop</button></popover-component>
  <popover-component title="rightbottom" content="rightbottom" placement="rightbottom"><button class="btn btn-outline-secondary">rightbottom</button></popover-component>

  <popover-component title="bottom" content="bottom" placement="bottom"><button class="btn btn-outline-secondary">bottom</button></popover-component>
  <popover-component title="bottomleft" content="bottomleft" placement="bottomleft"><button class="btn btn-outline-secondary">bottomleft</button></popover-component>
  <popover-component title="bottomright" content="bottomright" placement="bottomright"><button class="btn btn-outline-secondary">bottomright</button></popover-component>
  <popover-component title="right" content="right" placement="right"><button class="btn btn-outline-secondary">right</button></popover-component>
</div>
`;

export const OffsetAndY = () => `
<popover-component title="Offset demo" content="offset=16, y-offset=8" placement="right" offset="16" y-offset="8">
  <button class="btn btn-outline-primary">Offsetted</button>
</popover-component>
`;

export const ExternalTarget = () => `
<button id="ext-popover-trigger" class="btn btn-primary">External trigger</button>

<popover-component
  title="External"
  content="I am attached via target id"
  placement="bottom"
  trigger="click"
  target="ext-popover-trigger"
></popover-component>
`;
