# autocomplete-multiple-selections



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                     | Description                                                                                                                                            | Type                             | Default     |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ----------- |
| `addBtn`                  | `add-btn`                     |                                                                                                                                                        | `boolean`                        | `false`     |
| `addIcon`                 | `add-icon`                    |                                                                                                                                                        | `string`                         | `''`        |
| `addNewOnEnter`           | `add-new-on-enter`            |                                                                                                                                                        | `boolean`                        | `true`      |
| `ariaDescribedby`         | `aria-describedby`            |                                                                                                                                                        | `string`                         | `undefined` |
| `ariaLabel`               | `aria-label`                  | Standard ARIA naming hooks                                                                                                                             | `string`                         | `undefined` |
| `ariaLabelledby`          | `aria-labelledby`             |                                                                                                                                                        | `string`                         | `undefined` |
| `arialabelledBy`          | `arialabelled-by`             | <span style="color:red">**[DEPRECATED]**</span> Use `ariaLabelledby` (mapped to `aria-labelledby`) instead. Kept for backward compatibility.<br/><br/> | `string`                         | `''`        |
| `autoSort`                | `auto-sort`                   |                                                                                                                                                        | `boolean`                        | `true`      |
| `badgeInlineStyles`       | `badge-inline-styles`         |                                                                                                                                                        | `string`                         | `''`        |
| `badgeShape`              | `badge-shape`                 |                                                                                                                                                        | `string`                         | `''`        |
| `badgeVariant`            | `badge-variant`               |                                                                                                                                                        | `string`                         | `''`        |
| `clearIcon`               | `clear-icon`                  |                                                                                                                                                        | `string`                         | `''`        |
| `clearInputOnBlurOutside` | `clear-input-on-blur-outside` |                                                                                                                                                        | `boolean`                        | `false`     |
| `devMode`                 | `dev-mode`                    |                                                                                                                                                        | `boolean`                        | `false`     |
| `disabled`                | `disabled`                    |                                                                                                                                                        | `boolean`                        | `false`     |
| `editable`                | `editable`                    | Can users add/delete options at runtime?                                                                                                               | `boolean`                        | `false`     |
| `error`                   | `error`                       |                                                                                                                                                        | `boolean`                        | `false`     |
| `errorMessage`            | `error-message`               |                                                                                                                                                        | `string`                         | `''`        |
| `formId`                  | `form-id`                     |                                                                                                                                                        | `string`                         | `''`        |
| `formLayout`              | `form-layout`                 |                                                                                                                                                        | `"" \| "horizontal" \| "inline"` | `''`        |
| `inputCol`                | `input-col`                   |                                                                                                                                                        | `number`                         | `10`        |
| `inputCols`               | `input-cols`                  |                                                                                                                                                        | `string`                         | `''`        |
| `inputId`                 | `input-id`                    |                                                                                                                                                        | `string`                         | `''`        |
| `label`                   | `label`                       |                                                                                                                                                        | `string`                         | `''`        |
| `labelAlign`              | `label-align`                 |                                                                                                                                                        | `"" \| "right"`                  | `''`        |
| `labelCol`                | `label-col`                   |                                                                                                                                                        | `number`                         | `2`         |
| `labelCols`               | `label-cols`                  | Responsive columns                                                                                                                                     | `string`                         | `''`        |
| `labelHidden`             | `label-hidden`                |                                                                                                                                                        | `boolean`                        | `false`     |
| `labelSize`               | `label-size`                  |                                                                                                                                                        | `"base" \| "lg" \| "sm" \| "xs"` | `'sm'`      |
| `name`                    | `name`                        | Field name for selected items; if it ends with [] one input per item is emitted.                                                                       | `string`                         | `undefined` |
| `options`                 | --                            |                                                                                                                                                        | `string[]`                       | `[]`        |
| `placeholder`             | `placeholder`                 |                                                                                                                                                        | `string`                         | `''`        |
| `preserveInputOnSelect`   | `preserve-input-on-select`    | Keep the typed text after a selection? Default false (clear).                                                                                          | `boolean`                        | `undefined` |
| `rawInputName`            | `raw-input-name`              | Also submit whatever the user typed under this name (verbatim).                                                                                        | `string`                         | `undefined` |
| `removeBtnBorder`         | `remove-btn-border`           |                                                                                                                                                        | `boolean`                        | `false`     |
| `removeClearBtn`          | `remove-clear-btn`            |                                                                                                                                                        | `boolean`                        | `false`     |
| `required`                | `required`                    |                                                                                                                                                        | `boolean`                        | `false`     |
| `size`                    | `size`                        |                                                                                                                                                        | `"" \| "lg" \| "sm"`             | `''`        |
| `type`                    | `type`                        |                                                                                                                                                        | `string`                         | `'text'`    |
| `validation`              | `validation`                  |                                                                                                                                                        | `boolean`                        | `false`     |
| `validationMessage`       | `validation-message`          |                                                                                                                                                        | `string`                         | `''`        |
| `value`                   | --                            |                                                                                                                                                        | `string[]`                       | `[]`        |


## Events

| Event               | Description | Type                                                |
| ------------------- | ----------- | --------------------------------------------------- |
| `clear`             |             | `CustomEvent<void>`                                 |
| `componentError`    |             | `CustomEvent<{ message: string; stack?: string; }>` |
| `itemSelect`        |             | `CustomEvent<string>`                               |
| `multiSelectChange` |             | `CustomEvent<string[]>`                             |
| `optionDelete`      |             | `CustomEvent<string>`                               |
| `valueChange`       |             | `CustomEvent<string[]>`                             |


## Methods

### `navigateOptions(direction: number) => Promise<void>`



#### Parameters

| Name        | Type     | Description |
| ----------- | -------- | ----------- |
| `direction` | `number` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
