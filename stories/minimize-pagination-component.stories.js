// src/stories/minimize-pagination-component.stories.js

export default {
  title: 'Components/Pagination/Minimized',
  parameters: {
    layout: 'padded',
    docs: { source: { type: 'dynamic' } },
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    goToButtons: {
      control: { type: 'radio' },
      options: ['', 'text'],
      description: 'Use "" for symbols «‹›», or "text" for First/Prev/Next/Last',
    },
    size: { control: { type: 'radio' }, options: ['', 'sm', 'lg'] },
    paginationLayout: { control: { type: 'radio' }, options: ['', 'center', 'end'] },
    plumage: { control: 'boolean' },
    controlId: { control: 'text', name: 'control-id' },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) =>
  val === undefined || val === null || val === '' ? '' : ` ${name}="${String(val)}"`;

/* ============================== Playground ============================== */

const Template = args => {
  const hostId = `minipg-${Math.random().toString(36).slice(2, 9)}`;
  return `
<minimize-pagination-component
  id="${hostId}"
  ${attr('current-page', args.currentPage)}
  ${attr('total-pages', args.totalPages)}
  ${attr('go-to-buttons', args.goToButtons)}
  ${attr('size', args.size)}
  ${attr('pagination-layout', args.paginationLayout)}
  ${boolAttr('plumage', args.plumage)}
  ${attr('control-id', args.controlId)}
></minimize-pagination-component>

<script>
  (() => {
    const el = document.getElementById('${hostId}');
    if (!el) return;
    el.addEventListener('change-page', e => {
      console.log('[minimize-pagination change-page]', e.detail);
      // Keep the displayed current-page in sync inside the story
      if (e?.detail?.page != null) el.setAttribute('current-page', String(e.detail.page));
    });
  })();
</script>
`;
};

export const Playground = Template.bind({});
Playground.args = {
  currentPage: 4,
  totalPages: 18,
  goToButtons: '',      // "" => symbols; "text" => First/Prev/Next/Last
  size: '',
  paginationLayout: '',
  plumage: false,
  controlId: 'orders-table',
};

/* ============================== Focused Examples ============================== */

export const SymbolsDefault = () => `
<minimize-pagination-component
  current-page="1"
  total-pages="12"
></minimize-pagination-component>
`;

export const TextLabelsCentered = () => `
<minimize-pagination-component
  current-page="6"
  total-pages="20"
  go-to-buttons="text"
  pagination-layout="center"
></minimize-pagination-component>
`;

export const EndAlignedSmall = () => `
<minimize-pagination-component
  current-page="3"
  total-pages="9"
  size="sm"
  pagination-layout="end"
></minimize-pagination-component>
`;

export const LargePlumage = () => `
<minimize-pagination-component
  current-page="8"
  total-pages="25"
  size="lg"
  plumage
></minimize-pagination-component>
`;

export const WithControlId = () => `
<div>
  <div id="results-region" style="margin-bottom: 8px; font: 14px/1.2 system-ui;">
    Results region controlled by the paginator below.
  </div>

  <minimize-pagination-component
    current-page="10"
    total-pages="40"
    go-to-buttons="text"
    control-id="results-region"
  ></minimize-pagination-component>
</div>
`;
