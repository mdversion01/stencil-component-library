# autocomplete-multiselect



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
| `labelCols`               | `label-cols`                  | Responsive column class specs (e.g., "col", "col-sm-3 col-md-4", or "xs-12 sm-6 md-4")                                                                 | `string`                         | `''`        |
| `labelHidden`             | `label-hidden`                |                                                                                                                                                        | `boolean`                        | `false`     |
| `labelSize`               | `label-size`                  |                                                                                                                                                        | `"base" \| "lg" \| "sm" \| "xs"` | `'sm'`      |
| `name`                    | `name`                        | Selected items hidden inputs name; if it ends with [] one input per item is emitted.                                                                   | `string`                         | `undefined` |
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
| `value`                   | --                            | Controlled selections (external source of truth; do not mutate the prop)                                                                               | `string[]`                       | `[]`        |


## Events

| Event               | Description | Type                                                                                          |
| ------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `clear`             |             | `CustomEvent<void>`                                                                           |
| `componentError`    |             | `CustomEvent<{ message: string; stack?: string; }>`                                           |
| `itemSelect`        |             | `CustomEvent<string>`                                                                         |
| `multiSelectChange` |             | `CustomEvent<string[]>`                                                                       |
| `optionDelete`      |             | `CustomEvent<string>`                                                                         |
| `optionsChange`     |             | `CustomEvent<{ options: string[]; reason: "replace" \| "delete" \| "add"; value?: string; }>` |
| `valueChange`       |             | `CustomEvent<string[]>`                                                                       |


## Methods

### `filterOptions() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getOptions() => Promise<string[]>`

Read current options (for hosts).

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

Replace options from the host (and clear "user-added" tracking). Emits optionsChange('replace').

#### Parameters

| Name   | Type       | Description |
| ------ | ---------- | ----------- |
| `next` | `string[]` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
