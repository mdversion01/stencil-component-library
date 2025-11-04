# autocomplete-multiselect



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                     | Description                                                                            | Type                             | Default                      |
| ------------------------- | ----------------------------- | -------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------- |
| `addBtn`                  | `add-btn`                     |                                                                                        | `boolean`                        | `false`                      |
| `addIcon`                 | `add-icon`                    |                                                                                        | `string`                         | `''`                         |
| `addNewOnEnter`           | `add-new-on-enter`            |                                                                                        | `boolean`                        | `true`                       |
| `arialabelledBy`          | `arialabelled-by`             |                                                                                        | `string`                         | `''`                         |
| `autoSort`                | `auto-sort`                   |                                                                                        | `boolean`                        | `true`                       |
| `badgeInlineStyles`       | `badge-inline-styles`         |                                                                                        | `string`                         | `''`                         |
| `badgeShape`              | `badge-shape`                 |                                                                                        | `string`                         | `''`                         |
| `badgeVariant`            | `badge-variant`               |                                                                                        | `string`                         | `''`                         |
| `clearIcon`               | `clear-icon`                  |                                                                                        | `string`                         | `''`                         |
| `clearInputOnBlurOutside` | `clear-input-on-blur-outside` |                                                                                        | `boolean`                        | `false`                      |
| `devMode`                 | `dev-mode`                    |                                                                                        | `boolean`                        | `false`                      |
| `disabled`                | `disabled`                    |                                                                                        | `boolean`                        | `false`                      |
| `editable`                | `editable`                    |                                                                                        | `boolean`                        | `false`                      |
| `error`                   | `error`                       |                                                                                        | `boolean`                        | `false`                      |
| `errorMessage`            | `error-message`               |                                                                                        | `string`                         | `''`                         |
| `formId`                  | `form-id`                     |                                                                                        | `string`                         | `''`                         |
| `formLayout`              | `form-layout`                 |                                                                                        | `"" \| "horizontal" \| "inline"` | `''`                         |
| `inputCol`                | `input-col`                   |                                                                                        | `number`                         | `10`                         |
| `inputCols`               | `input-cols`                  |                                                                                        | `string`                         | `''`                         |
| `inputId`                 | `input-id`                    |                                                                                        | `string`                         | `''`                         |
| `label`                   | `label`                       |                                                                                        | `string`                         | `''`                         |
| `labelAlign`              | `label-align`                 |                                                                                        | `"" \| "right"`                  | `''`                         |
| `labelCol`                | `label-col`                   |                                                                                        | `number`                         | `2`                          |
| `labelCols`               | `label-cols`                  | Responsive column class specs (e.g., "col", "col-sm-3 col-md-4", or "xs-12 sm-6 md-4") | `string`                         | `''`                         |
| `labelHidden`             | `label-hidden`                |                                                                                        | `boolean`                        | `false`                      |
| `labelSize`               | `label-size`                  |                                                                                        | `"" \| "lg" \| "sm"`             | `''`                         |
| `name`                    | `name`                        |                                                                                        | `string`                         | `undefined`                  |
| `options`                 | `options`                     |                                                                                        | `string[]`                       | `[]`                         |
| `placeholder`             | `placeholder`                 |                                                                                        | `string`                         | `'Type to search/filter...'` |
| `preserveInputOnSelect`   | `preserve-input-on-select`    |                                                                                        | `boolean`                        | `undefined`                  |
| `rawInputName`            | `raw-input-name`              |                                                                                        | `string`                         | `undefined`                  |
| `removeClearBtn`          | `remove-clear-btn`            |                                                                                        | `boolean`                        | `false`                      |
| `required`                | `required`                    |                                                                                        | `boolean`                        | `false`                      |
| `size`                    | `size`                        |                                                                                        | `"" \| "lg" \| "sm"`             | `''`                         |
| `type`                    | `type`                        |                                                                                        | `string`                         | `''`                         |
| `validation`              | `validation`                  |                                                                                        | `boolean`                        | `false`                      |
| `validationMessage`       | `validation-message`          |                                                                                        | `string`                         | `''`                         |


## Events

| Event               | Description                                 | Type                                                                                          |
| ------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `clear`             |                                             | `CustomEvent<void>`                                                                           |
| `componentError`    |                                             | `CustomEvent<{ message: string; stack?: string; }>`                                           |
| `itemSelect`        |                                             | `CustomEvent<string>`                                                                         |
| `multiSelectChange` |                                             | `CustomEvent<string[]>`                                                                       |
| `optionDelete`      |                                             | `CustomEvent<string>`                                                                         |
| `optionsChange`     | 🔔 Hook for hosts to mirror/persist options | `CustomEvent<{ options: string[]; reason: "replace" \| "add" \| "delete"; value?: string; }>` |


## Methods

### `filterOptions() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getOptions() => Promise<string[]>`

🔎 Read current options from the component (for hosts).

#### Returns

Type: `Promise<string[]>`



### `navigateOptions(direction: number) => Promise<void>`



#### Parameters

| Name        | Type     | Description |
| ----------- | -------- | ----------- |
| `direction` | `number` |             |

#### Returns

Type: `Promise<void>`



### `setOptions(next: string[]) => Promise<void>`

🔧 Replace options from the host (for hosts). Also emits optionsChange('replace').

#### Parameters

| Name   | Type       | Description |
| ------ | ---------- | ----------- |
| `next` | `string[]` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
