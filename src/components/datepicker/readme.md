# datepicker-component



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                  | Description                                                                    | Type                             | Default                    |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------ | -------------------------------- | -------------------------- |
| `appendId`               | `append-id`                |                                                                                | `string`                         | `''`                       |
| `appendProp`             | `append`                   | Reserved-name fixes kept                                                       | `boolean`                        | `true`                     |
| `calendar`               | `calendar`                 |                                                                                | `boolean`                        | `false`                    |
| `currentMonth`           | `current-month`            |                                                                                | `number`                         | `new Date().getMonth()`    |
| `currentYear`            | `current-year`             |                                                                                | `number`                         | `new Date().getFullYear()` |
| `dateFormat`             | `date-format`              |                                                                                | `"MM-DD-YYYY" \| "YYYY-MM-DD"`   | `'YYYY-MM-DD'`             |
| `disabled`               | `disabled`                 |                                                                                | `boolean`                        | `false`                    |
| `displayContextExamples` | `display-context-examples` |                                                                                | `boolean`                        | `false`                    |
| `dropdownOpen`           | `dropdown-open`            |                                                                                | `boolean`                        | `false`                    |
| `formLayout`             | `form-layout`              | Layout & sizing                                                                | `"" \| "horizontal" \| "inline"` | `''`                       |
| `icon`                   | `icon`                     | Icon & ids                                                                     | `string`                         | `'fas fa-calendar-alt'`    |
| `inputCol`               | `input-col`                |                                                                                | `number`                         | `10`                       |
| `inputCols`              | `input-cols`               |                                                                                | `string`                         | `''`                       |
| `inputId`                | `input-id`                 |                                                                                | `string`                         | `'datepicker'`             |
| `isCalendarFocused`      | `is-calendar-focused`      |                                                                                | `boolean`                        | `false`                    |
| `label`                  | `label`                    | Label & placeholder                                                            | `string`                         | `'Date Picker'`            |
| `labelCol`               | `label-col`                | Legacy numeric cols (fallback)                                                 | `number`                         | `2`                        |
| `labelCols`              | `label-cols`               | NEW: responsive column class specs (e.g., "col-sm-3 col-md-4" or "xs-12 sm-8") | `string`                         | `''`                       |
| `labelHidden`            | `label-hidden`             |                                                                                | `boolean`                        | `false`                    |
| `labelSize`              | `label-size`               |                                                                                | `"" \| "lg" \| "sm"`             | `''`                       |
| `placeholder`            | `placeholder`              |                                                                                | `string`                         | `'YYYY-MM-DD'`             |
| `plumage`                | `plumage`                  | Visual theme                                                                   | `boolean`                        | `false`                    |
| `prependId`              | `prepend-id`               |                                                                                | `string`                         | `''`                       |
| `prependProp`            | `prepend`                  | Prepend/append                                                                 | `boolean`                        | `false`                    |
| `required`               | `required`                 | Validation                                                                     | `boolean`                        | `false`                    |
| `size`                   | `size`                     |                                                                                | `"" \| "lg" \| "sm"`             | `''`                       |
| `validation`             | `validation`               |                                                                                | `boolean`                        | `false`                    |
| `validationMessage`      | `validation-message`       |                                                                                | `string`                         | `''`                       |
| `value`                  | `value`                    | Value (kept for API parity)                                                    | `string`                         | `''`                       |
| `warningMessage`         | `warning-message`          |                                                                                | `string`                         | `''`                       |


## Events

| Event           | Description | Type                                      |
| --------------- | ----------- | ----------------------------------------- |
| `date-selected` |             | `CustomEvent<{ formattedDate: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
