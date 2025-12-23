// src/stories/by-page-pagination-component.stories.js

export default {
  title: 'Components/Pagination/By Page',
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
  const hostId = `bypage-${Math.random().toString(36).slice(2, 9)}`;
  return `
<by-page-pagination-component
  id="${hostId}"
  ${attr('current-page', args.currentPage)}
  ${attr('total-pages', args.totalPages)}
  ${attr('go-to-buttons', args.goToButtons)}
  ${attr('size', args.size)}
  ${attr('pagination-layout', args.paginationLayout)}
  ${boolAttr('plumage', args.plumage)}
  ${attr('control-id', args.controlId)}
></by-page-pagination-component>

<script>
  (() => {
    const el = document.getElementById('${hostId}');
    if (!el) return;
    el.addEventListener('change-page', e => {
      console.log('[by-page-pagination change-page]', e.detail);
      if (e?.detail?.page != null) el.setAttribute('current-page', String(e.detail.page));
    });
  })();
</script>
`;
};

export const Playground = Template.bind({});
Playground.args = {
  currentPage: 7,
  totalPages: 42,
  goToButtons: '',        // "" => symbols; "text" => First/Prev/Next/Last
  size: '',
  paginationLayout: '',
  plumage: false,
  controlId: 'orders-region',
};

/* ============================== Focused Examples ============================== */

export const SymbolsDefault = () => `
<by-page-pagination-component
  current-page="1"
  total-pages="15"
></by-page-pagination-component>
`;

export const TextLabelsCentered = () => `
<by-page-pagination-component
  current-page="9"
  total-pages="25"
  go-to-buttons="text"
  pagination-layout="center"
></by-page-pagination-component>
`;

export const EndAlignedSmallPlumage = () => `
<by-page-pagination-component
  current-page="3"
  total-pages="10"
  size="sm"
  plumage
  pagination-layout="end"
></by-page-pagination-component>
`;

export const LargeWithControlId = () => `
<div>
  <div id="report-pane" style="margin-bottom: 8px; font: 14px/1.2 system-ui;">
    Report pane (aria-controls target).
  </div>

  <by-page-pagination-component
    current-page="12"
    total-pages="60"
    size="lg"
    go-to-buttons="text"
    control-id="report-pane"
  ></by-page-pagination-component>
</div>
`;

export const NearEndState = () => `
<by-page-pagination-component
  current-page="19"
  total-pages="20"
  go-to-buttons="text"
></by-page-pagination-component>
`;
