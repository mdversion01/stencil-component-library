# select-field-component



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                         | Type                             | Default              |
| ------------------- | -------------------- | ----------------------------------------------------------------------------------- | -------------------------------- | -------------------- |
| `classes`           | `classes`            |                                                                                     | `string`                         | `''`                 |
| `custom`            | `custom`             |                                                                                     | `boolean`                        | `false`              |
| `defaultOptionTxt`  | `default-option-txt` |                                                                                     | `string`                         | `'Select an option'` |
| `defaultTxt`        | `default-txt`        |                                                                                     | `string`                         | `''`                 |
| `disabled`          | `disabled`           |                                                                                     | `boolean`                        | `false`              |
| `formId`            | `form-id`            |                                                                                     | `string`                         | `''`                 |
| `formLayout`        | `form-layout`        |                                                                                     | `"" \| "horizontal" \| "inline"` | `''`                 |
| `inputCol`          | `input-col`          |                                                                                     | `number`                         | `10`                 |
| `inputCols`         | `input-cols`         |                                                                                     | `string`                         | `''`                 |
| `label`             | `label`              |                                                                                     | `string`                         | `''`                 |
| `labelCol`          | `label-col`          | Legacy numeric cols (fallback)                                                      | `number`                         | `2`                  |
| `labelCols`         | `label-cols`         | Responsive column class specs (e.g., "col", "col-sm-3 col-md-4", "xs-12 sm-6 md-4") | `string`                         | `''`                 |
| `labelHidden`       | `label-hidden`       |                                                                                     | `boolean`                        | `false`              |
| `labelSize`         | `label-size`         |                                                                                     | `"" \| "lg" \| "sm"`             | `''`                 |
| `multiple`          | `multiple`           |                                                                                     | `boolean`                        | `false`              |
| `options`           | `options`            |                                                                                     | `SelectOption[]`                 | `[]`                 |
| `required`          | `required`           |                                                                                     | `boolean`                        | `false`              |
| `selectFieldId`     | `select-field-id`    | ID attribute for the <select> (Lit: selectFieldId)                                  | `string`                         | `''`                 |
| `selected`          | `selected`           |                                                                                     | `boolean`                        | `false`              |
| `size`              | `size`               |                                                                                     | `"" \| "lg" \| "sm"`             | `''`                 |
| `validation`        | `validation`         |                                                                                     | `boolean`                        | `false`              |
| `validationMessage` | `validation-message` |                                                                                     | `string`                         | `''`                 |
| `value`             | `value`              |                                                                                     | `string`                         | `'none'`             |
| `withTable`         | `with-table`         | When used with a table, sync with external sort events                              | `boolean`                        | `false`              |


## Events

| Event         | Description | Type                              |
| ------------- | ----------- | --------------------------------- |
| `valueChange` |             | `CustomEvent<{ value: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
