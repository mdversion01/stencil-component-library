import TableDocs from './table-component.docs.mdx';
import {
  Template,
  basicItems,
  basicItemsLong,
  colorVariationsItems,
  detailRowItems,
  fullDataItems,
  tableFields,
  normalizeHtml,
  toHtml,
  buildDocsHtmlJsSource,
  deriveFieldsFromFirstItem,
  isNone,
  ensureGlobalHelpers,
  runWhenConnected,
  renderTableStory,
  renderSectionStory,
  wireSortControls,
  wireFilterControls,
  SORT_RESET_STORY,
  FILTER_RESET_STORY,
  PLAYGROUND_STORY,
  pickTableA11y,
} from './table-component.story-helpers';

export default {
  title: 'Components/Table',
  tags: ['autodocs'],
  args: {
    addBorder: false,
    removeBorder: false,
    darkTableTheme: false,
    darkHeader: false,
    lightHeader: false,
    rowHover: false,
    noBorderCollapsed: false,
    plumage: false,
    striped: false,

    selectedVariant: 'table-active',
    size: '',
    tableVariant: 'table',

    caption: '',
    cloneFooter: false,
    fixedTableHeader: false,
    responsive: false,
    stacked: false,
    sticky: false,

    filterText: '',
    sortField: 'none',
    sortOrder: 'asc',
    sortable: false,

    selectMode: '',

    goToButtons: '',
    hideEllipsis: false,
    hideGotoEndButtons: false,
    paginationLayout: '',
    paginationLimit: 5,
    paginationPosition: 'bottom',
    paginationSize: '',
    paginationVariantColor: '',
    rowsPerPage: 10,
    showDisplayRange: false,
    showSizeChanger: false,

    paginationEnabled: false,
    paginationVariant: 'standard',

    usePagination: false,
  },

  parameters: {
    layout: 'padded',
    docs: {
      page: TableDocs,
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => normalizeHtml(toHtml(ctx.originalStoryFn(ctx.args))),
      },
      description: {
        component:
          'A flexible and customizable table component with support for sorting, filtering, selection, pagination, and various styling options.',
      },
    },
  },

  argTypes: {
    addBorder: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Adds borders to all table cells when true.',
      name: 'add-border',
    },
    removeBorder: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Removes all borders from the table when true.',
      name: 'remove-border',
    },
    darkTableTheme: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Applies a dark theme to the table when true.',
      name: 'dark-table-theme',
    },
    darkHeader: {
      control: 'boolean',
      name: 'dark-header',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Applies a dark theme to the table header when true.',
    },
    lightHeader: {
      control: 'boolean',
      name: 'light-header',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Applies a light theme to the table header when true.',
    },
    rowHover: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Enables hover effect on table rows when true.',
      name: 'row-hover',
    },
    noBorderCollapsed: {
      control: 'boolean',
      name: 'no-border-collapsed',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Removes borders when the table is collapsed.',
    },
    plumage: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Enables plumage style when true.',
    },
    striped: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Styling' },
      description: 'Enables striped rows when true.',
    },
    selectedVariant: {
      control: 'text',
      name: 'selected-variant',
      description: 'Variant color for selected rows.',
      table: { category: 'Styling' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm'],
      description: 'Size of the table.',
      table: { category: 'Styling' },
    },
    tableVariant: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark', 'light'],
      name: 'table-variant',
      description: 'Visual variant of the table.',
      table: { category: 'Styling' },
    },

    caption: {
      control: { type: 'select' },
      options: ['', 'top', 'bottom'],
      description: 'Position of the table caption.',
      table: { category: 'Layout' },
    },
    cloneFooter: {
      control: 'boolean',
      name: 'clone-footer',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Clones the footer row when true.',
    },
    fixedTableHeader: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Enables fixed header and/or columns when true.',
      name: 'fixed-table-header',
    },
    responsive: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Enables responsive behavior when true.',
    },
    stacked: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Stacks the table vertically on smaller screens when true.',
    },
    sticky: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Layout' },
      description: 'Makes the table header sticky when true.',
    },

    fields: {
      table: { disable: true, category: 'Data (Story-controlled)' },
      description: 'Fields configuration for the table (set via story code).',
    },
    items: {
      table: { disable: true, category: 'Data (Story-controlled)' },
      description: 'Items data for the table (set via story code).',
    },

    sortable: {
      control: 'boolean',
      description: 'Enables sorting when true.',
      table: { category: 'Sorting & Filtering' },
    },
    sortField: {
      control: 'text',
      name: 'sort-field',
      description: 'Field name to sort by.',
      table: { category: 'Sorting & Filtering' },
    },
    sortOrder: {
      control: { type: 'select' },
      options: ['asc', 'desc'],
      name: 'sort-order',
      description: 'Sort order: ascending or descending.',
      table: { category: 'Sorting & Filtering' },
    },
    filterText: {
      control: 'text',
      name: 'filter-text',
      description: 'Text to filter the table rows.',
      table: { category: 'Sorting & Filtering' },
    },

    selectMode: {
      control: { type: 'select' },
      options: ['', 'single', 'multi', 'range'],
      name: 'select-mode',
      description:
        'For selection mode of rows with checkboxes. single = only one row can be selected at a time, multi = multiple rows can be selected independently, range = allows shift-click to select a range of rows.',
      table: { category: 'Selection' },
    },

    paginationEnabled: {
      control: 'boolean',
      name: 'pagination-enabled',
      table: { defaultValue: { summary: false }, category: 'Pagination (Recommended)' },
      description: 'Enables pagination UI + slicing (recommended new API).',
    },
    paginationVariant: {
      control: { type: 'select' },
      options: ['standard', 'minimize', 'by-page'],
      name: 'pagination-variant',
      table: { defaultValue: { summary: 'standard' }, category: 'Pagination (Recommended)' },
      description: 'Which pagination UI variant to use (recommended new API).',
    },

    paginationPosition: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'both'],
      name: 'pagination-position',
      description: 'Position of the pagination controls.',
      table: { category: 'Pagination (Controls)' },
    },
    paginationLayout: {
      control: 'text',
      name: 'pagination-layout',
      description: 'Layout template for pagination controls.',
      table: { category: 'Pagination (Controls)' },
    },
    paginationSize: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      name: 'pagination-size',
      description: 'Size of the pagination controls.',
      table: { category: 'Pagination (Controls)' },
    },
    paginationLimit: {
      control: { type: 'number', min: 1, step: 1 },
      name: 'pagination-limit',
      description: 'Number of page buttons to show in pagination.',
      table: { category: 'Pagination (Controls)' },
    },
    rowsPerPage: {
      control: { type: 'number', min: 1, step: 1 },
      name: 'rows-per-page',
      description: 'Number of rows per page.',
      table: { category: 'Pagination (Controls)' },
    },
    showDisplayRange: {
      control: 'boolean',
      name: 'show-display-range',
      table: { defaultValue: { summary: false }, category: 'Pagination (Controls)' },
      description: 'Shows the display range when true.',
    },
    showSizeChanger: {
      control: 'boolean',
      name: 'show-size-changer',
      table: { defaultValue: { summary: false }, category: 'Pagination (Controls)' },
      description: 'Shows the size changer when true.',
    },
    hideGotoEndButtons: {
      control: 'boolean',
      name: 'hide-goto-end-buttons',
      table: { defaultValue: { summary: false }, category: 'Pagination (Controls)' },
      description: 'Hides Go To First/Last buttons in pagination when true.',
    },
    hideEllipsis: {
      control: 'boolean',
      name: 'hide-ellipsis',
      table: { defaultValue: { summary: false }, category: 'Pagination (Controls)' },
      description: 'Hides ellipsis in pagination when true.',
    },
    goToButtons: {
      control: { type: 'select' },
      options: ['', 'text'],
      name: 'go-to-buttons',
      description: 'Type of Go To buttons in pagination.',
      table: { category: 'Pagination (Controls)' },
    },
    paginationVariantColor: {
      control: 'text',
      name: 'pagination-variant-color',
      description: 'Variant color of the pagination controls.',
      table: { category: 'Pagination (Controls)' },
    },

    usePagination: {
      control: 'boolean',
      name: 'use-pagination',
      table: { defaultValue: { summary: false }, category: 'Pagination (Legacy)' },
      description: 'Legacy: enables pagination when true (kept for backward compatibility).',
    },
  },
};

export const Basic = args =>
  renderTableStory(args, {
    id: 'table-basic',
    items: basicItems,
  });

Basic.args = {
  addBorder: false,
  responsive: false,
  striped: false,
  rowHover: false,
  size: '',
  caption: '',
  tableVariant: 'table',
};

Basic.parameters = {
  docs: { description: { story: 'A basic table with minimal configuration.' } },
};

export const StickyNoBorderCollapsed = args =>
  renderTableStory(args, {
    id: 'table-sticky',
    items: basicItemsLong,
  });

StickyNoBorderCollapsed.args = {
  sticky: true,
  noBorderCollapsed: true,
};

StickyNoBorderCollapsed.parameters = {
  docs: { description: { story: 'A table with a sticky header and no borders when collapsed.' } },
};

export const ResponsiveBordered = args =>
  renderTableStory(args, {
    id: 'table-resp-bordered',
    items: basicItems,
  });

ResponsiveBordered.args = {
  responsive: true,
  addBorder: true,
};

ResponsiveBordered.parameters = {
  docs: { description: { story: 'A responsive table with borders.' } },
};

export const ResponsiveBorderless = args =>
  renderTableStory(args, {
    id: 'table-resp-borderless',
    items: basicItems,
  });

ResponsiveBorderless.args = {
  responsive: true,
  removeBorder: true,
};

ResponsiveBorderless.parameters = {
  docs: { description: { story: 'A responsive table without borders.' } },
};

export const StripedHoverBordered = args =>
  renderTableStory(args, {
    id: 'table-striped-hover',
    items: basicItems,
  });

StripedHoverBordered.args = {
  responsive: true,
  striped: true,
  rowHover: true,
  addBorder: true,
};

StripedHoverBordered.parameters = {
  docs: { description: { story: 'A responsive table with striped rows, hover effect, and borders.' } },
};

export const CaptionTopCloneFooterFixed = args =>
  renderTableStory(args, {
    id: 'table-caption-top',
    items: basicItems,
  });

CaptionTopCloneFooterFixed.args = {
  caption: 'top',
  cloneFooter: true,
  fixedTableHeader: true,
};

CaptionTopCloneFooterFixed.parameters = {
  docs: { description: { story: 'A table with the caption at the top, a cloned footer, and fixed header.' } },
};

export const StackedCaptionBottom = args =>
  renderTableStory(args, {
    id: 'table-stacked',
    items: basicItems,
  });

StackedCaptionBottom.args = {
  stacked: true,
  caption: 'bottom',
};

StackedCaptionBottom.parameters = {
  docs: { description: { story: 'A stacked table with the caption at the bottom.' } },
};

export const UsingVariantColorsInRowsAndCells = args =>
  renderTableStory(args, {
    id: 'table-variant-colors',
    items: colorVariationsItems,
  });

UsingVariantColorsInRowsAndCells.args = {
  responsive: true,
};

UsingVariantColorsInRowsAndCells.parameters = {
  docs: { description: { story: 'A table showcasing variant colors in rows and individual cells.' } },
};

export const DetailRowsOnly = args =>
  renderTableStory(args, {
    id: 'table-detail-rows',
    items: detailRowItems,
  });

DetailRowsOnly.args = {
  responsive: true,
};

DetailRowsOnly.parameters = {
  docs: { description: { story: 'A table showcasing detail rows using _showDetails and _additionalInfo.' } },
};

export const SelectableMultiSmall = args =>
  renderTableStory(args, {
    id: 'table-select-multi',
    items: basicItems,
    extraAttrs: 'table-id="table-select-multi"',
  });

SelectableMultiSmall.args = {
  responsive: true,
  striped: true,
  size: 'sm',
  selectMode: 'multi',
};

SelectableMultiSmall.parameters = {
  docs: { description: { story: 'A small, responsive table with striped rows and multi-row selection enabled.' } },
};

export const SortableSimple = args =>
  renderTableStory(args, {
    id: 'table-sortable',
    items: fullDataItems,
    fields: tableFields,
  });

SortableSimple.args = {
  striped: true,
  sortable: true,
  responsive: true,
  size: 'sm',
};

SortableSimple.parameters = {
  docs: { description: { story: 'A small, responsive, sortable table with striped rows.' } },
};

export const WithPagination = args =>
  renderTableStory(args, {
    id: 'table-paged',
    items: fullDataItems,
    fields: tableFields,
    extraAttrs: 'table-id="table-paged"',
  });

WithPagination.args = {
  striped: true,
  responsive: true,
  paginationEnabled: true,
  paginationVariant: 'standard',
  usePagination: false,
  paginationPosition: 'both',
  paginationLayout: 'start',
  showDisplayRange: true,
  showSizeChanger: true,
  size: 'sm',
  paginationLimit: 3,
  goToButtons: 'text',
  rowsPerPage: 10,
};

WithPagination.parameters = {
  docs: {
    description: {
      story: 'A small, responsive table with pagination enabled, displaying controls at both the top and bottom.',
    },
  },
};

export const SortFieldAndOrderWithReset = args => {
  const { tableId, sortFieldId, sortOrderId } = SORT_RESET_STORY;

  const wrapper = renderSectionStory(args, {
    tableId,
    items: fullDataItems,
    fields: tableFields,
    html: SORT_RESET_STORY.html({ tableId, sortFieldId, sortOrderId }),
  });

  runWhenConnected(wrapper, () => wireSortControls({ root: wrapper, tableId, sortFieldId, sortOrderId }));
  return wrapper;
};

SortFieldAndOrderWithReset.args = {
  striped: true,
  sortable: true,
  responsive: true,
  size: 'sm',
};

SortFieldAndOrderWithReset.parameters = {
  docs: {
    description: {
      story: normalizeHtml(`
This example uses **external controls** (two <select-field-component>s) to drive sorting.

**Important:** the controls are wired to the table via Storybook helper code (not table markup alone).
`),
    },
    source: {
      language: 'html',
      transform: () =>
        buildDocsHtmlJsSource({
          html: SORT_RESET_STORY.html(SORT_RESET_STORY),
          js: SORT_RESET_STORY.docsJs(SORT_RESET_STORY),
        }),
    },
  },
};

export const FilterFieldAndDropdownWithReset = args => {
  const { tableId, inputId, dropdownId } = FILTER_RESET_STORY;

  const wrapper = renderSectionStory(args, {
    tableId,
    items: fullDataItems,
    fields: tableFields,
    html: FILTER_RESET_STORY.html({ tableId, inputId, dropdownId }),
  });

  runWhenConnected(wrapper, () => wireFilterControls({ root: wrapper, tableId, inputId, dropdownId }));
  return wrapper;
};

FilterFieldAndDropdownWithReset.args = {
  striped: true,
  responsive: true,
  size: 'sm',
};

FilterFieldAndDropdownWithReset.parameters = {
  docs: {
    description: {
      story: normalizeHtml(`
This example uses **external filter UI** (input + dropdown) to drive table filtering.

**Important:** the dropdown and input are wired via Storybook helper code (not table markup alone).
`),
    },
    source: {
      language: 'html',
      transform: () =>
        buildDocsHtmlJsSource({
          html: FILTER_RESET_STORY.html(FILTER_RESET_STORY),
          js: FILTER_RESET_STORY.docsJs(FILTER_RESET_STORY),
        }),
    },
  },
};

export const Playground = args => {
  const { tableId, sortFieldId, sortOrderId, inputId, dropdownId } = PLAYGROUND_STORY;

  const wrapper = renderSectionStory(args, {
    tableId,
    items: fullDataItems,
    fields: tableFields,
    html: PLAYGROUND_STORY.html({ tableId, sortFieldId, sortOrderId, inputId, dropdownId }),
  });

  runWhenConnected(wrapper, () => {
    wireSortControls({ root: wrapper, tableId, sortFieldId, sortOrderId });
    wireFilterControls({ root: wrapper, tableId, inputId, dropdownId });
  });

  return wrapper;
};

Playground.args = {
  striped: true,
  rowHover: true,
  sortable: true,
  responsive: true,
  selectMode: 'multi',
  paginationEnabled: true,
  paginationVariant: 'standard',
  usePagination: false,
  paginationPosition: 'both',
  paginationLayout: 'start',
  paginationLimit: 3,
  showSizeChanger: true,
  size: 'sm',
  goToButtons: 'text',
  rowsPerPage: 10,
};

Playground.parameters = {
  docs: {
    description: {
      story: normalizeHtml(`
This combines **Sort + Filter + Selection + Pagination**.

**Important:** external controls are wired via Storybook helper code; outside Storybook you’d drive the same behavior by dispatching the table’s events.
`),
    },
    source: {
      language: 'html',
      transform: () =>
        buildDocsHtmlJsSource({
          html: PLAYGROUND_STORY.html(PLAYGROUND_STORY),
          js: PLAYGROUND_STORY.docsJs(PLAYGROUND_STORY),
        }),
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '1100px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Prints computed <code>role</code>, <code>aria-*</code>, and key ids for default / inline / horizontal, simulated error/validation, and simulated disabled.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs, { extraHtml = '', decorateHost } = {}) => {
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
      mount.innerHTML = normalizeHtml(`
        ${extraHtml}
      `);

      const storyNode = renderTableStory(
        { ...Basic.args, ...storyArgs },
        {
          id: storyArgs.__id || `mx-${Math.random().toString(36).slice(2, 7)}`,
          items: basicItems,
          fields: deriveFieldsFromFirstItem(basicItems),
        },
      );

      if (decorateHost) {
        decorateHost(storyNode);
      }

      mount.appendChild(storyNode);
      demo.appendChild(mount);

      const update = async () => {
        const host = mount.querySelector('table-component');
        if (host?.componentOnReady) {
          try {
            await host.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('table-component');
          } catch (_e) {}
        }

        if (typeof storyArgs.__tableAriaDescribedby === 'string') {
          const tEl = host?.querySelector('table');
          if (tEl) tEl.setAttribute('aria-describedby', storyArgs.__tableAriaDescribedby);
        }

        if (typeof storyArgs.__tableAriaLabelledby === 'string') {
          const tEl = host?.querySelector('table');
          if (tEl) tEl.setAttribute('aria-labelledby', storyArgs.__tableAriaLabelledby);
        }

        pre.textContent = JSON.stringify(pickTableA11y(host, mount), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    wrap.appendChild(
      card('Default', {
        __id: 'mx-default',
        striped: true,
        rowHover: true,
        sortable: true,
        responsive: true,
        size: 'sm',
      }),
    );

    wrap.appendChild(
      card(
        'Inline (simulated external label + help)',
        {
          __id: 'mx-inline',
          striped: true,
          responsive: true,
          size: 'sm',
          __tableAriaLabelledby: 'mx-inline-label',
          __tableAriaDescribedby: 'mx-inline-help',
        },
        {
          extraHtml: `
            <div id="mx-inline-label" style="font-weight:600; margin-bottom:6px;">Inline label (external)</div>
            <div id="mx-inline-help" style="opacity:.8; margin-bottom:10px;">Help: Use header cells to sort, rows can be selected if enabled.</div>
          `,
        },
      ),
    );

    wrap.appendChild(
      card(
        'Horizontal (simulated layout)',
        {
          __id: 'mx-horizontal',
          striped: true,
          responsive: true,
          size: 'sm',
          __tableAriaLabelledby: 'mx-horizontal-label',
        },
        {
          extraHtml: `
            <div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:start; max-width:980px;">
              <div id="mx-horizontal-label" style="font-weight:600;">Horizontal label area</div>
              <div></div>
            </div>
          `,
        },
      ),
    );

    wrap.appendChild(
      card(
        'Error / validation (simulated via aria-describedby)',
        {
          __id: 'mx-error',
          striped: true,
          responsive: true,
          size: 'sm',
          __tableAriaDescribedby: 'mx-error-text',
        },
        {
          extraHtml: `
            <div id="mx-error-text" style="color:#a00; font-size:12px; margin-bottom:10px;">
              Error: One or more rows are invalid. Review highlighted rows.
            </div>
          `,
        },
      ),
    );

    wrap.appendChild(
      card(
        'Disabled (simulated, non-interactive)',
        {
          __id: 'mx-disabled',
          striped: true,
          responsive: true,
          rowHover: false,
          size: 'sm',
        },
        {
          decorateHost: storyNode => {
            storyNode.setAttribute('aria-disabled', 'true');
            storyNode.style.opacity = '0.6';
            storyNode.style.pointerEvents = 'none';
          },
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
          'Shows multiple configurations and prints computed accessibility attributes for the rendered native `<table>` element and key descendants. “Inline/horizontal/error/disabled” are simulated patterns using external labels/description elements and wrapper attributes.',
      },
    },
  },
};
