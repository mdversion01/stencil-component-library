# standard-pagination-component



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                       | Description                                                                                                          | Type                                                                          | Default                                                           |
| --------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `controlId`                 | `control-id`                    | Optional external id of a region that this pagination controls. Used for aria-controls on nav buttons when provided. | `string`                                                                      | `undefined`                                                       |
| `currentPage`               | `current-page`                  |                                                                                                                      | `number`                                                                      | `1`                                                               |
| `displayTotalNumberOfPages` | `display-total-number-of-pages` |                                                                                                                      | `boolean`                                                                     | `false`                                                           |
| `goToButtons`               | `go-to-buttons`                 |                                                                                                                      | `string`                                                                      | `'icon'`                                                          |
| `hideEllipsis`              | `hide-ellipsis`                 |                                                                                                                      | `boolean`                                                                     | `false`                                                           |
| `hideGoToButtons`           | `hide-go-to-buttons`            |                                                                                                                      | `boolean`                                                                     | `false`                                                           |
| `itemsPerPage`              | `items-per-page`                |                                                                                                                      | `boolean`                                                                     | `false`                                                           |
| `itemsPerPageOptions`       | --                              |                                                                                                                      | `(number \| "All")[]`                                                         | `[10, 20, 50, 100, 'All']`                                        |
| `limit`                     | `limit`                         |                                                                                                                      | `number`                                                                      | `5`                                                               |
| `pageSize`                  | `page-size`                     |                                                                                                                      | `number`                                                                      | `10`                                                              |
| `pageSizeHelpText`          | `page-size-help-text`           | SR-only helper text for the page-size select (standalone)                                                            | `string`                                                                      | `'Use this control to change how many items are shown per page.'` |
| `pageSizeLabel`             | `page-size-label`               | Label text for the page-size select (standalone)                                                                     | `string`                                                                      | `'Items per page:'`                                               |
| `paginationAriaLabel`       | `pagination-aria-label`         | Optional aria-label for the pagination landmark                                                                      | `string`                                                                      | `'Pagination'`                                                    |
| `paginationLayout`          | `pagination-layout`             |                                                                                                                      | `"" \| "center" \| "end" \| "fill" \| "fill-left" \| "fill-right" \| "start"` | `''`                                                              |
| `paginationVariantColor`    | `pagination-variant-color`      |                                                                                                                      | `string`                                                                      | `''`                                                              |
| `plumage`                   | `plumage`                       |                                                                                                                      | `boolean`                                                                     | `false`                                                           |
| `size`                      | `size`                          |                                                                                                                      | `"" \| "lg" \| "sm"`                                                          | `''`                                                              |
| `totalRows`                 | `total-rows`                    |                                                                                                                      | `number`                                                                      | `0`                                                               |


## Events

| Event         | Description | Type                             |
| ------------- | ----------- | -------------------------------- |
| `change-page` |             | `CustomEvent<{ page: number; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
