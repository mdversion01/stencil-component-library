# standard-pagination-component



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                       | Description | Type                                                                          | Default                    |
| --------------------------- | ------------------------------- | ----------- | ----------------------------------------------------------------------------- | -------------------------- |
| `currentPage`               | `current-page`                  |             | `number`                                                                      | `1`                        |
| `displayTotalNumberOfPages` | `display-total-number-of-pages` |             | `boolean`                                                                     | `false`                    |
| `goToButtons`               | `go-to-buttons`                 |             | `string`                                                                      | `'icon'`                   |
| `hideEllipsis`              | `hide-ellipsis`                 |             | `boolean`                                                                     | `false`                    |
| `hideGoToButtons`           | `hide-go-to-buttons`            |             | `boolean`                                                                     | `false`                    |
| `itemsPerPage`              | `items-per-page`                |             | `boolean`                                                                     | `false`                    |
| `itemsPerPageOptions`       | --                              |             | `(number \| "All")[]`                                                         | `[10, 20, 50, 100, 'All']` |
| `limit`                     | `limit`                         |             | `number`                                                                      | `5`                        |
| `pageSize`                  | `page-size`                     |             | `number`                                                                      | `10`                       |
| `paginationLayout`          | `pagination-layout`             |             | `"" \| "center" \| "end" \| "fill" \| "fill-left" \| "fill-right" \| "start"` | `''`                       |
| `paginationVariantColor`    | `pagination-variant-color`      |             | `string`                                                                      | `''`                       |
| `plumage`                   | `plumage`                       |             | `boolean`                                                                     | `false`                    |
| `size`                      | `size`                          |             | `"" \| "lg" \| "sm"`                                                          | `''`                       |
| `totalRows`                 | `total-rows`                    |             | `number`                                                                      | `0`                        |


## Events

| Event         | Description | Type                             |
| ------------- | ----------- | -------------------------------- |
| `change-page` |             | `CustomEvent<{ page: number; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
