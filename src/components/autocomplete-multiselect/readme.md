# autocomplete-multiselect



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type       | Default                      |
| ------------------- | --------------------- | ----------- | ---------- | ---------------------------- |
| `addBtn`            | `add-btn`             |             | `boolean`  | `false`                      |
| `addIcon`           | `add-icon`            |             | `string`   | `''`                         |
| `arialabelledBy`    | `arialabelled-by`     |             | `string`   | `''`                         |
| `badgeInlineStyles` | `badge-inline-styles` |             | `string`   | `''`                         |
| `badgeShape`        | `badge-shape`         |             | `string`   | `''`                         |
| `badgeVariant`      | `badge-variant`       |             | `string`   | `''`                         |
| `clearIcon`         | `clear-icon`          |             | `string`   | `''`                         |
| `devMode`           | `dev-mode`            |             | `boolean`  | `false`                      |
| `disabled`          | `disabled`            |             | `boolean`  | `false`                      |
| `error`             | `error`               |             | `boolean`  | `false`                      |
| `errorMessage`      | `error-message`       |             | `string`   | `''`                         |
| `formId`            | `form-id`             |             | `string`   | `''`                         |
| `formLayout`        | `form-layout`         |             | `string`   | `''`                         |
| `inputId`           | `input-id`            |             | `string`   | `''`                         |
| `label`             | `label`               |             | `string`   | `''`                         |
| `labelHidden`       | `label-hidden`        |             | `boolean`  | `false`                      |
| `options`           | `options`             |             | `string[]` | `[]`                         |
| `placeholder`       | `placeholder`         |             | `string`   | `'Type to search/filter...'` |
| `removeClearBtn`    | `remove-clear-btn`    |             | `boolean`  | `false`                      |
| `required`          | `required`            |             | `boolean`  | `false`                      |
| `size`              | `size`                |             | `string`   | `''`                         |
| `type`              | `type`                |             | `string`   | `''`                         |
| `validation`        | `validation`          |             | `boolean`  | `false`                      |
| `validationMessage` | `validation-message`  |             | `string`   | `''`                         |


## Events

| Event               | Description | Type                                                |
| ------------------- | ----------- | --------------------------------------------------- |
| `clear`             |             | `CustomEvent<void>`                                 |
| `componentError`    |             | `CustomEvent<{ message: string; stack?: string; }>` |
| `itemSelect`        |             | `CustomEvent<string>`                               |
| `multiSelectChange` |             | `CustomEvent<string[]>`                             |


## Methods

### `filterOptions() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `navigateOptions(direction: number) => Promise<void>`



#### Parameters

| Name        | Type     | Description |
| ----------- | -------- | ----------- |
| `direction` | `number` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
