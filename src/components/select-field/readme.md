# select-field-component



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                         | Type                                           | Default              |
| ------------------- | -------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------- |
| `classes`           | `classes`            |                                                                                     | `string`                                       | `''`                 |
| `custom`            | `custom`             |                                                                                     | `boolean`                                      | `false`              |
| `defaultOptionTxt`  | `default-option-txt` |                                                                                     | `string`                                       | `'Select an option'` |
| `defaultTxt`        | `default-txt`        |                                                                                     | `string`                                       | `''`                 |
| `disabled`          | `disabled`           |                                                                                     | `boolean`                                      | `false`              |
| `fieldHeight`       | `field-height`       | Native <select size>; useful for visually taller lists (single or multiple)         | `number`                                       | `null`               |
| `formId`            | `form-id`            |                                                                                     | `string`                                       | `''`                 |
| `formLayout`        | `form-layout`        |                                                                                     | `"" \| "horizontal" \| "inline"`               | `''`                 |
| `inputCol`          | `input-col`          |                                                                                     | `number`                                       | `10`                 |
| `inputCols`         | `input-cols`         |                                                                                     | `string`                                       | `''`                 |
| `label`             | `label`              |                                                                                     | `string`                                       | `''`                 |
| `labelAlign`        | `label-align`        |                                                                                     | `"" \| "right"`                                | `''`                 |
| `labelCol`          | `label-col`          | Legacy numeric cols (fallback)                                                      | `number`                                       | `2`                  |
| `labelCols`         | `label-cols`         | Responsive column class specs (e.g., "col", "col-sm-3 col-md-4", "xs-12 sm-6 md-4") | `string`                                       | `''`                 |
| `labelHidden`       | `label-hidden`       |                                                                                     | `boolean`                                      | `false`              |
| `labelSize`         | `label-size`         |                                                                                     | `"" \| "lg" \| "sm" \| "xs"`                   | `'sm'`               |
| `multiple`          | `multiple`           |                                                                                     | `boolean`                                      | `false`              |
| `options`           | `options`            |                                                                                     | `string \| { value: string; name: string; }[]` | `[]`                 |
| `required`          | `required`           |                                                                                     | `boolean`                                      | `false`              |
| `selectFieldId`     | `select-field-id`    | ID attribute for the <select> (Lit: selectFieldId)                                  | `string`                                       | `''`                 |
| `selected`          | `selected`           |                                                                                     | `boolean`                                      | `false`              |
| `size`              | `size`               |                                                                                     | `"" \| "lg" \| "sm"`                           | `''`                 |
| `validation`        | `validation`         |                                                                                     | `boolean`                                      | `false`              |
| `validationMessage` | `validation-message` |                                                                                     | `string`                                       | `''`                 |
| `value`             | `value`              | Single: string; Multiple: string[]                                                  | `string \| string[]`                           | `'none'`             |
| `withTable`         | `with-table`         | When used with a table, sync with external sort events                              | `boolean`                                      | `false`              |


## Events

| Event         | Description | Type                                          |
| ------------- | ----------- | --------------------------------------------- |
| `valueChange` |             | `CustomEvent<{ value: string \| string[]; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
