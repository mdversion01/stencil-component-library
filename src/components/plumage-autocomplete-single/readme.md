# plumage-autocomplete-single



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                     | Type                             | Default     |
| ------------------- | -------------------- | --------------------------------------------------------------- | -------------------------------- | ----------- |
| `arialabelledBy`    | `arialabelled-by`    | id(s) of label(s) that label this input (space-separated).      | `string`                         | `''`        |
| `autoSort`          | `auto-sort`          |                                                                 | `boolean`                        | `true`      |
| `clearIcon`         | `clear-icon`         |                                                                 | `string`                         | `''`        |
| `devMode`           | `dev-mode`           |                                                                 | `boolean`                        | `false`     |
| `disabled`          | `disabled`           |                                                                 | `boolean`                        | `false`     |
| `error`             | `error`              |                                                                 | `boolean`                        | `false`     |
| `errorMessage`      | `error-message`      |                                                                 | `string`                         | `''`        |
| `formId`            | `form-id`            |                                                                 | `string`                         | `''`        |
| `formLayout`        | `form-layout`        |                                                                 | `"" \| "horizontal" \| "inline"` | `''`        |
| `inputCol`          | `input-col`          |                                                                 | `number`                         | `10`        |
| `inputCols`         | `input-cols`         |                                                                 | `string`                         | `''`        |
| `inputId`           | `input-id`           |                                                                 | `string`                         | `''`        |
| `label`             | `label`              |                                                                 | `string`                         | `''`        |
| `labelAlign`        | `label-align`        |                                                                 | `"" \| "right"`                  | `''`        |
| `labelCol`          | `label-col`          | Numeric fallback columns                                        | `number`                         | `2`         |
| `labelCols`         | `label-cols`         | Responsive column class specs                                   | `string`                         | `''`        |
| `labelHidden`       | `label-hidden`       |                                                                 | `boolean`                        | `false`     |
| `labelSize`         | `label-size`         |                                                                 | `"base" \| "lg" \| "sm" \| "xs"` | `'sm'`      |
| `options`           | `options`            |                                                                 | `string[]`                       | `[]`        |
| `placeholder`       | `placeholder`        |                                                                 | `string`                         | `undefined` |
| `removeClearBtn`    | `remove-clear-btn`   |                                                                 | `boolean`                        | `false`     |
| `required`          | `required`           |                                                                 | `boolean`                        | `false`     |
| `size`              | `size`               |                                                                 | `"" \| "lg" \| "sm"`             | `''`        |
| `type`              | `type`               |                                                                 | `string`                         | `'text'`    |
| `validation`        | `validation`         | Validation controlled externally (prop remains source of truth) | `boolean`                        | `false`     |
| `validationMessage` | `validation-message` |                                                                 | `string`                         | `''`        |
| `value`             | `value`              | Value controlled externally (don’t mutate the prop)             | `string`                         | `''`        |


## Events

| Event            | Description | Type                                                |
| ---------------- | ----------- | --------------------------------------------------- |
| `clear`          |             | `CustomEvent<void>`                                 |
| `componentError` |             | `CustomEvent<{ message: string; stack?: string; }>` |
| `itemSelect`     |             | `CustomEvent<string>`                               |
| `valueChange`    |             | `CustomEvent<string>`                               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
