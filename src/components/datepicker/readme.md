# datepicker-component



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                  | Description              | Type                             | Default                    |
| ------------------------ | -------------------------- | ------------------------ | -------------------------------- | -------------------------- |
| `appendId`               | `append-id`                |                          | `string`                         | `''`                       |
| `appendProp`             | `append`                   | Reserved-name fixes kept | `boolean`                        | `true`                     |
| `calendar`               | `calendar`                 |                          | `boolean`                        | `false`                    |
| `currentMonth`           | `current-month`            |                          | `number`                         | `new Date().getMonth()`    |
| `currentYear`            | `current-year`             |                          | `number`                         | `new Date().getFullYear()` |
| `dateFormat`             | `date-format`              |                          | `"MM-DD-YYYY" \| "YYYY-MM-DD"`   | `'YYYY-MM-DD'`             |
| `disabled`               | `disabled`                 |                          | `boolean`                        | `false`                    |
| `displayContextExamples` | `display-context-examples` |                          | `boolean`                        | `false`                    |
| `dropdownOpen`           | `dropdown-open`            |                          | `boolean`                        | `false`                    |
| `formLayout`             | `form-layout`              |                          | `"" \| "horizontal" \| "inline"` | `''`                       |
| `icon`                   | `icon`                     |                          | `string`                         | `'fas fa-calendar-alt'`    |
| `inputId`                | `input-id`                 |                          | `string`                         | `'datepicker'`             |
| `isCalendarFocused`      | `is-calendar-focused`      |                          | `boolean`                        | `false`                    |
| `label`                  | `label`                    |                          | `string`                         | `'Date Picker'`            |
| `labelHidden`            | `label-hidden`             |                          | `boolean`                        | `false`                    |
| `placeholder`            | `placeholder`              |                          | `string`                         | `'YYYY-MM-DD'`             |
| `plumage`                | `plumage`                  |                          | `boolean`                        | `false`                    |
| `prependId`              | `prepend-id`               |                          | `string`                         | `''`                       |
| `prependProp`            | `prepend`                  |                          | `boolean`                        | `false`                    |
| `required`               | `required`                 |                          | `boolean`                        | `false`                    |
| `size`                   | `size`                     |                          | `"" \| "lg" \| "sm"`             | `''`                       |
| `validation`             | `validation`               |                          | `boolean`                        | `false`                    |
| `validationMessage`      | `validation-message`       |                          | `string`                         | `''`                       |
| `value`                  | `value`                    |                          | `string`                         | `''`                       |
| `warningMessage`         | `warning-message`          |                          | `string`                         | `''`                       |


## Events

| Event           | Description | Type                                      |
| --------------- | ----------- | ----------------------------------------- |
| `date-selected` |             | `CustomEvent<{ formattedDate: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
