# timepicker-manager



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                    | Description                                                                                          | Type               | Default         |
| ------------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------ | --------------- |
| `ariaDescribedby`        | `aria-describedby`           |                                                                                                      | `string`           | `''`            |
| `ariaLabel`              | `aria-label`                 |                                                                                                      | `string`           | `'Time Picker'` |
| `ariaLabelledby`         | `aria-labelledby`            |                                                                                                      | `string`           | `''`            |
| `disableTimepicker`      | `disable-timepicker`         |                                                                                                      | `boolean`          | `false`         |
| `hideSeconds`            | `hide-seconds`               |                                                                                                      | `boolean`          | `false`         |
| `hideTimepickerBtn`      | `hide-timepicker-btn`        |                                                                                                      | `boolean`          | `false`         |
| `inputId`                | `input-id`                   |                                                                                                      | `string`           | `'time-input'`  |
| `inputName`              | `input-name`                 |                                                                                                      | `string`           | `'time'`        |
| `inputWidth`             | `input-width`                |                                                                                                      | `number \| string` | `undefined`     |
| `isTwentyFourHourFormat` | `is-twenty-four-hour-format` |                                                                                                      | `boolean`          | `true`          |
| `isValid`                | `is-valid`                   |                                                                                                      | `boolean`          | `true`          |
| `labelText`              | `label-text`                 |                                                                                                      | `string`           | `'Enter Time'`  |
| `readOnly`               | `read-only`                  |                                                                                                      | `boolean`          | `false`         |
| `required`               | `required`                   |                                                                                                      | `boolean`          | `false`         |
| `showLabel`              | `show-label`                 |                                                                                                      | `boolean`          | `undefined`     |
| `size`                   | `size`                       |                                                                                                      | `string`           | `''`            |
| `timeInputThrottleMs`    | `time-input-throttle-ms`     | Throttle window for timeInput events in milliseconds. Set to 0 to disable throttling.                | `number`           | `50`            |
| `timeValidation`         | `time-validation`            | Built-in time format/range validation is always enabled. Kept as a prop for backwards compatibility. | `boolean`          | `true`          |
| `twelveHourOnly`         | `twelve-hour-only`           |                                                                                                      | `boolean`          | `false`         |
| `twentyFourHourOnly`     | `twenty-four-hour-only`      |                                                                                                      | `boolean`          | `false`         |
| `validation`             | `validation`                 | User-controlled validation toggle/message.                                                           | `boolean`          | `false`         |
| `validationMessage`      | `validation-message`         |                                                                                                      | `string`           | `''`            |
| `value`                  | `value`                      |                                                                                                      | `string`           | `''`            |


## Events

| Event        | Description | Type                                                                                                                                                                                                    |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `timeChange` |             | `CustomEvent<{ value: string; parts: TimeParts; isValid: boolean; source: "commit" \| "spinner" \| "clear" \| "format" \| "external" \| "inputName" \| "inputId" \| "constraints" \| "hideSeconds"; }>` |
| `timeInput`  |             | `CustomEvent<{ raw: string; normalized: string; isValid: boolean; parts?: TimeParts; reason?: "pattern" \| "range"; caretStart: number; caretEnd: number; inputType: string; }>`                        |


## Methods

### `forceTimeUpdate() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
