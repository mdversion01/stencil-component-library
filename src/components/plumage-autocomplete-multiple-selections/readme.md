# plumage-autocomplete-multiple-selections-component



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                     | Description                                                      | Type                             | Default                      |
| ------------------------- | ----------------------------- | ---------------------------------------------------------------- | -------------------------------- | ---------------------------- |
| `addBtn`                  | `add-btn`                     |                                                                  | `boolean`                        | `false`                      |
| `addIcon`                 | `add-icon`                    |                                                                  | `string`                         | `''`                         |
| `addNewOnEnter`           | `add-new-on-enter`            |                                                                  | `boolean`                        | `true`                       |
| `arialabelledBy`          | `arialabelled-by`             |                                                                  | `string`                         | `''`                         |
| `autoSort`                | `auto-sort`                   |                                                                  | `boolean`                        | `true`                       |
| `badgeInlineStyles`       | `badge-inline-styles`         |                                                                  | `string`                         | `''`                         |
| `badgeShape`              | `badge-shape`                 |                                                                  | `string`                         | `''`                         |
| `badgeVariant`            | `badge-variant`               |                                                                  | `string`                         | `''`                         |
| `clearIcon`               | `clear-icon`                  |                                                                  | `string`                         | `''`                         |
| `clearInputOnBlurOutside` | `clear-input-on-blur-outside` |                                                                  | `boolean`                        | `false`                      |
| `devMode`                 | `dev-mode`                    |                                                                  | `boolean`                        | `false`                      |
| `disabled`                | `disabled`                    |                                                                  | `boolean`                        | `false`                      |
| `editable`                | `editable`                    |                                                                  | `boolean`                        | `false`                      |
| `error`                   | `error`                       |                                                                  | `boolean`                        | `false`                      |
| `errorMessage`            | `error-message`               |                                                                  | `string`                         | `''`                         |
| `formId`                  | `form-id`                     |                                                                  | `string`                         | `''`                         |
| `formLayout`              | `form-layout`                 |                                                                  | `"" \| "horizontal" \| "inline"` | `''`                         |
| `inputCol`                | `input-col`                   |                                                                  | `number`                         | `10`                         |
| `inputCols`               | `input-cols`                  |                                                                  | `string`                         | `''`                         |
| `inputId`                 | `input-id`                    |                                                                  | `string`                         | `''`                         |
| `label`                   | `label`                       |                                                                  | `string`                         | `''`                         |
| `labelAlign`              | `label-align`                 |                                                                  | `"" \| "right"`                  | `''`                         |
| `labelCol`                | `label-col`                   |                                                                  | `number`                         | `2`                          |
| `labelCols`               | `label-cols`                  | Responsive columns                                               | `string`                         | `''`                         |
| `labelHidden`             | `label-hidden`                |                                                                  | `boolean`                        | `false`                      |
| `labelSize`               | `label-size`                  |                                                                  | `"base" \| "lg" \| "sm" \| "xs"` | `'sm'`                       |
| `name`                    | `name`                        | Submit names                                                     | `string`                         | `undefined`                  |
| `options`                 | --                            |                                                                  | `string[]`                       | `[]`                         |
| `placeholder`             | `placeholder`                 |                                                                  | `string`                         | `'Type to search/filter...'` |
| `preserveInputOnSelect`   | `preserve-input-on-select`    | Behavior switches                                                | `boolean`                        | `undefined`                  |
| `rawInputName`            | `raw-input-name`              |                                                                  | `string`                         | `undefined`                  |
| `removeBtnBorder`         | `remove-btn-border`           |                                                                  | `boolean`                        | `false`                      |
| `removeClearBtn`          | `remove-clear-btn`            |                                                                  | `boolean`                        | `false`                      |
| `required`                | `required`                    |                                                                  | `boolean`                        | `false`                      |
| `size`                    | `size`                        |                                                                  | `"" \| "lg" \| "sm"`             | `''`                         |
| `type`                    | `type`                        |                                                                  | `string`                         | `''`                         |
| `validation`              | `validation`                  | Validation controlled externally; mirrored to state for visuals. | `boolean`                        | `false`                      |
| `validationMessage`       | `validation-message`          |                                                                  | `string`                         | `''`                         |


## Events

| Event               | Description | Type                                                                                          |
| ------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `clear`             |             | `CustomEvent<void>`                                                                           |
| `componentError`    |             | `CustomEvent<{ message: string; stack?: string; }>`                                           |
| `itemSelect`        |             | `CustomEvent<string>`                                                                         |
| `multiSelectChange` |             | `CustomEvent<string[]>`                                                                       |
| `optionDelete`      |             | `CustomEvent<string>`                                                                         |
| `optionsChange`     |             | `CustomEvent<{ options: string[]; reason: "replace" \| "delete" \| "add"; value?: string; }>` |


## Methods

### `filterOptions() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getOptions() => Promise<string[]>`



#### Returns

Type: `Promise<string[]>`



### `navigateOptions(direction: number) => Promise<void>`



#### Parameters

| Name        | Type     | Description |
| ----------- | -------- | ----------- |
| `direction` | `number` |             |

#### Returns

Type: `Promise<void>`



### `removeItem(value: string) => Promise<void>`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `value` | `string` |             |

#### Returns

Type: `Promise<void>`



### `setOptions(next: string[]) => Promise<void>`



#### Parameters

| Name   | Type       | Description |
| ------ | ---------- | ----------- |
| `next` | `string[]` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
