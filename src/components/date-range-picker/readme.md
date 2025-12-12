# date-range-picker-component



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                                                                                                         | Type                             | Default                 |
| ------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------------------- |
| `appendId`          | `append-id`          |                                                                                                                                     | `string`                         | `''`                    |
| `appendProp`        | `append-prop`        | was `append`, renamed to avoid reserved name                                                                                        | `boolean`                        | `true`                  |
| `ariaLabel`         | `aria-label`         |                                                                                                                                     | `string`                         | `''`                    |
| `dateFormat`        | `date-format`        |                                                                                                                                     | `"MM-DD-YYYY" \| "YYYY-MM-DD"`   | `'YYYY-MM-DD'`          |
| `disabled`          | `disabled`           |                                                                                                                                     | `boolean`                        | `false`                 |
| `formLayout`        | `form-layout`        | '', 'horizontal', or 'inline'                                                                                                       | `"" \| "horizontal" \| "inline"` | `''`                    |
| `icon`              | `icon`               |                                                                                                                                     | `string`                         | `'fas fa-calendar-alt'` |
| `inputCol`          | `input-col`          |                                                                                                                                     | `number`                         | `10`                    |
| `inputCols`         | `input-cols`         | Responsive column class specs (e.g., "col-sm-3 col-md-4" or "xs-12 sm-8") for used for input column when formLayout is "horizontal" | `string`                         | `''`                    |
| `inputId`           | `input-id`           |                                                                                                                                     | `string`                         | `'drp'`                 |
| `joinBy`            | `join-by`            |                                                                                                                                     | `string`                         | `' - '`                 |
| `label`             | `label`              |                                                                                                                                     | `string`                         | `'Date Range Picker'`   |
| `labelCol`          | `label-col`          | Legacy numeric cols (fallback)                                                                                                      | `number`                         | `2`                     |
| `labelCols`         | `label-cols`         | Responsive column class specs (e.g., "col-sm-3 col-md-4" or "xs-12 sm-8") for used for label column when formLayout is "horizontal" | `string`                         | `''`                    |
| `labelHidden`       | `label-hidden`       |                                                                                                                                     | `boolean`                        | `false`                 |
| `placeholder`       | `placeholder`        | External placeholder prop (immutable). We derive a default into state.                                                              | `string`                         | `undefined`             |
| `plumage`           | `plumage`            |                                                                                                                                     | `boolean`                        | `false`                 |
| `prependId`         | `prepend-id`         |                                                                                                                                     | `string`                         | `''`                    |
| `prependProp`       | `prepend-prop`       | was `prepend`, renamed to avoid reserved name                                                                                       | `boolean`                        | `false`                 |
| `rangePicker`       | `range-picker`       | Render only the picker (no input group); disables OK button                                                                         | `boolean`                        | `false`                 |
| `required`          | `required`           |                                                                                                                                     | `boolean`                        | `false`                 |
| `showIso`           | `show-iso`           |                                                                                                                                     | `boolean`                        | `false`                 |
| `showLong`          | `show-long`          |                                                                                                                                     | `boolean`                        | `false`                 |
| `showOkButton`      | `show-ok-button`     | Allow host to control the OK/Close button; we'll mask it off when rangePicker = true                                                | `boolean`                        | `true`                  |
| `showYmd`           | `show-ymd`           | Use these to control output format of start/end labels (display only)                                                               | `boolean`                        | `false`                 |
| `size`              | `size`               |                                                                                                                                     | `"" \| "lg" \| "sm"`             | `''`                    |
| `validation`        | `validation`         |                                                                                                                                     | `boolean`                        | `false`                 |
| `validationMessage` | `validation-message` |                                                                                                                                     | `string`                         | `'Required field'`      |
| `value`             | `value`              |                                                                                                                                     | `string`                         | `''`                    |
| `warningMessage`    | `warning-message`    |                                                                                                                                     | `string`                         | `''`                    |


## Events

| Event                | Description                                                                   | Type                                                                                             |
| -------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `date-range-updated` | Emits both human-readable (matches input/display) and ISO (YYYY-MM-DD) values | `CustomEvent<{ startDate: string; endDate: string; startDateIso: string; endDateIso: string; }>` |


## Methods

### `clear() => Promise<void>`

Programmatically clear the selection and reset

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
