# autocomplete-single



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                                                                                            | Type                             | Default     |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ----------- |
| `ariaDescribedby`   | `aria-describedby`   |                                                                                                                                                        | `string`                         | `undefined` |
| `ariaLabel`         | `aria-label`         | Standard ARIA naming hooks                                                                                                                             | `string`                         | `undefined` |
| `ariaLabelledby`    | `aria-labelledby`    |                                                                                                                                                        | `string`                         | `undefined` |
| `arialabelledBy`    | `arialabelled-by`    | <span style="color:red">**[DEPRECATED]**</span> Use `ariaLabelledby` (mapped to `aria-labelledby`) instead. Kept for backward compatibility.<br/><br/> | `string`                         | `''`        |
| `autoSort`          | `auto-sort`          |                                                                                                                                                        | `boolean`                        | `true`      |
| `clearIcon`         | `clear-icon`         |                                                                                                                                                        | `string`                         | `''`        |
| `devMode`           | `dev-mode`           |                                                                                                                                                        | `boolean`                        | `false`     |
| `disabled`          | `disabled`           |                                                                                                                                                        | `boolean`                        | `false`     |
| `error`             | `error`              |                                                                                                                                                        | `boolean`                        | `false`     |
| `errorMessage`      | `error-message`      |                                                                                                                                                        | `string`                         | `''`        |
| `formId`            | `form-id`            |                                                                                                                                                        | `string`                         | `''`        |
| `formLayout`        | `form-layout`        |                                                                                                                                                        | `"" \| "horizontal" \| "inline"` | `''`        |
| `inputCol`          | `input-col`          |                                                                                                                                                        | `number`                         | `10`        |
| `inputCols`         | `input-cols`         |                                                                                                                                                        | `string`                         | `''`        |
| `inputId`           | `input-id`           |                                                                                                                                                        | `string`                         | `''`        |
| `label`             | `label`              |                                                                                                                                                        | `string`                         | `''`        |
| `labelAlign`        | `label-align`        |                                                                                                                                                        | `"" \| "right"`                  | `''`        |
| `labelCol`          | `label-col`          | Back-compat numeric columns                                                                                                                            | `number`                         | `2`         |
| `labelCols`         | `label-cols`         | Responsive column class specs                                                                                                                          | `string`                         | `''`        |
| `labelHidden`       | `label-hidden`       |                                                                                                                                                        | `boolean`                        | `false`     |
| `labelSize`         | `label-size`         |                                                                                                                                                        | `"base" \| "lg" \| "sm" \| "xs"` | `'sm'`      |
| `options`           | --                   |                                                                                                                                                        | `string[]`                       | `[]`        |
| `placeholder`       | `placeholder`        |                                                                                                                                                        | `string`                         | `''`        |
| `removeClearBtn`    | `remove-clear-btn`   |                                                                                                                                                        | `boolean`                        | `false`     |
| `required`          | `required`           |                                                                                                                                                        | `boolean`                        | `false`     |
| `size`              | `size`               |                                                                                                                                                        | `"" \| "lg" \| "sm"`             | `''`        |
| `type`              | `type`               |                                                                                                                                                        | `string`                         | `'text'`    |
| `validation`        | `validation`         | Validation controlled externally (prop remains source of truth)                                                                                        | `boolean`                        | `false`     |
| `validationMessage` | `validation-message` |                                                                                                                                                        | `string`                         | `''`        |
| `value`             | `value`              | Value controlled externally (don’t mutate the prop)                                                                                                    | `string`                         | `''`        |


## Events

| Event            | Description | Type                                                |
| ---------------- | ----------- | --------------------------------------------------- |
| `clear`          |             | `CustomEvent<void>`                                 |
| `componentError` |             | `CustomEvent<{ message: string; stack?: string; }>` |
| `itemSelect`     |             | `CustomEvent<string>`                               |
| `valueChange`    |             | `CustomEvent<string>`                               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
