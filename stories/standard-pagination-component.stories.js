// src/stories/standard-pagination-component.stories.js

export default {
  title: 'Components/Pagination/Standard',
  parameters: {
    layout: 'padded',
    docs: { source: { type: 'dynamic' } },
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    hideGotoEndButtons: { control: 'boolean', name: 'hide-goto-end-buttons' },
    goToButtons: {
      control: { type: 'radio' },
      options: ['', 'text'],
      description: 'Use "" for symbols «‹›», or "text" for First/Prev/Next/Last',
      name: 'go-to-buttons',
    },
    size: { control: { type: 'radio' }, options: ['', 'sm', 'lg'] },
    paginationLayout: {
      control: { type: 'radio' },
      options: ['', 'center', 'end', 'fill', 'fill-left', 'fill-right'],
      name: 'pagination-layout',
    },
    hideEllipsis: { control: 'boolean', name: 'hide-ellipsis' },
    limit: { control: { type: 'number', min: 1 }, description: 'Visible page buttons window' },
    paginationVariantColor: { control: 'text', name: 'pagination-variant-color' },
    plumage: { control: 'boolean' },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, val) =>
  val === undefined || val === null || val === '' ? '' : ` ${name}="${String(val)}"`;

/* ============================== Playground ============================== */

const Template = args => {
  const id = `stdpg-${Math.random().toString(36).slice(2, 9)}`;
  return `
<standard-pagination-component
  id="${id}"
  ${attr('current-page', args.currentPage)}
  ${attr('total-pages', args.totalPages)}
  ${boolAttr('hide-goto-end-buttons', args.hideGotoEndButtons)}
  ${attr('go-to-buttons', args.goToButtons)}
  ${attr('size', args.size)}
  ${attr('pagination-layout', args.paginationLayout)}
  ${boolAttr('hide-ellipsis', args.hideEllipsis)}
  ${attr('limit', args.limit)}
  ${attr('pagination-variant-color', args.paginationVariantColor)}
  ${boolAttr('plumage', args.plumage)}
></standard-pagination-component>

<script>
  (() => {
    const el = document.getElementById('${id}');
    if (!el) return;
    el.addEventListener('change-page', e => {
      console.log('[standard-pagination change-page]', e.detail);
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
  hideGotoEndButtons: false,
  goToButtons: '',
  size: '',
  paginationLayout: '',
  hideEllipsis: false,
  limit: 5,
  paginationVariantColor: '', // e.g., "primary" if your CSS theme defines it
  plumage: false,
};

/* ============================== Focused Examples ============================== */

export const BasicSymbols = () => `
<standard-pagination-component
  current-page="1"
  total-pages="12"
  limit="5"
></standard-pagination-component>
`;

export const TextLabelsCentered = () => `
<standard-pagination-component
  current-page="6"
  total-pages="20"
  go-to-buttons="text"
  pagination-layout="center"
  limit="7"
></standard-pagination-component>
`;

export const EndAlignedSmallPlumage = () => `
<standard-pagination-component
  current-page="3"
  total-pages="10"
  size="sm"
  plumage
  pagination-layout="end"
></standard-pagination-component>
`;

export const FillLayoutStretch = () => `
<standard-pagination-component
  current-page="8"
  total-pages="30"
  pagination-layout="fill"
  limit="5"
></standard-pagination-component>
`;

export const NoEllipsisTightWindow = () => `
<standard-pagination-component
  current-page="9"
  total-pages="12"
  hide-ellipsis
  limit="3"
></standard-pagination-component>
`;

export const LargeWithVariantColor = () => `
<standard-pagination-component
  current-page="14"
  total-pages="40"
  size="lg"
  go-to-buttons="text"
  pagination-variant-color="primary"
></standard-pagination-component>
`;

export const HideGotoEndButtons = () => `
<standard-pagination-component
  current-page="5"
  total-pages="15"
  hide-goto-end-buttons
></standard-pagination-component>
`;

export const FillSides = () => `
<div style="display:grid; gap:16px;">
  <standard-pagination-component
    current-page="4"
    total-pages="25"
    pagination-layout="fill-left"
    limit="5"
  ></standard-pagination-component>

  <standard-pagination-component
    current-page="18"
    total-pages="25"
    pagination-layout="fill-right"
    limit="5"
  ></standard-pagination-component>
</div>
`;
