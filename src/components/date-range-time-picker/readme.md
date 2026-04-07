# date-range-time-picker-component



<!-- Auto Generated Below -->


## Overview

<date-range-time-picker-component>

Date+time range picker with free-typing, calendar navigation,
ISO / numeric / long display modes, and synchronized dropdown.

## Properties

| Property                 | Attribute                    | Description | Type                             | Default                  |
| ------------------------ | ---------------------------- | ----------- | -------------------------------- | ------------------------ |
| `appendId`               | `append-id`                  |             | `string`                         | `''`                     |
| `appendProp`             | `append-prop`                |             | `boolean`                        | `true`                   |
| `ariaLabel`              | `aria-label`                 |             | `string`                         | `''`                     |
| `dateFormat`             | `date-format`                |             | `"MM-DD-YYYY" \| "YYYY-MM-DD"`   | `'YYYY-MM-DD'`           |
| `disabled`               | `disabled`                   |             | `boolean`                        | `false`                  |
| `formLayout`             | `form-layout`                |             | `"" \| "horizontal" \| "inline"` | `''`                     |
| `icon`                   | `icon`                       |             | `string`                         | `'fas fa-calendar-alt'`  |
| `inputCol`               | `input-col`                  |             | `number`                         | `10`                     |
| `inputCols`              | `input-cols`                 |             | `string`                         | `''`                     |
| `inputId`                | `input-id`                   |             | `string`                         | `'date-range-time'`      |
| `isTwentyFourHourFormat` | `is-twenty-four-hour-format` |             | `boolean`                        | `true`                   |
| `joinBy`                 | `join-by`                    |             | `string`                         | `' - '`                  |
| `label`                  | `label`                      |             | `string`                         | `'Date and Time Picker'` |
| `labelAlign`             | `label-align`                |             | `"" \| "right"`                  | `''`                     |
| `labelCol`               | `label-col`                  |             | `number`                         | `2`                      |
| `labelCols`              | `label-cols`                 |             | `string`                         | `''`                     |
| `labelHidden`            | `label-hidden`               |             | `boolean`                        | `false`                  |
| `placeholder`            | `placeholder`                |             | `string`                         | `undefined`              |
| `plumage`                | `plumage`                    |             | `boolean`                        | `false`                  |
| `prependId`              | `prepend-id`                 |             | `string`                         | `''`                     |
| `prependProp`            | `prepend-prop`               |             | `boolean`                        | `false`                  |
| `rangeTimePicker`        | `range-time-picker`          |             | `boolean`                        | `false`                  |
| `required`               | `required`                   |             | `boolean`                        | `false`                  |
| `showDuration`           | `show-duration`              |             | `boolean`                        | `false`                  |
| `showIso`                | `show-iso`                   |             | `boolean`                        | `false`                  |
| `showLong`               | `show-long`                  |             | `boolean`                        | `false`                  |
| `showOkButton`           | `show-ok-button`             |             | `boolean`                        | `true`                   |
| `showYmd`                | `show-ymd`                   |             | `boolean`                        | `false`                  |
| `size`                   | `size`                       |             | `"" \| "lg" \| "sm"`             | `''`                     |
| `validation`             | `validation`                 |             | `boolean`                        | `false`                  |
| `validationMessage`      | `validation-message`         |             | `string`                         | `'Required field'`       |
| `value`                  | `value`                      |             | `string`                         | `''`                     |
| `warningMessage`         | `warning-message`            |             | `string`                         | `''`                     |


## Events

| Event               | Description | Type                                                                                                                                                                                                         |
| ------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `date-time-updated` |             | `CustomEvent<{ startDate: string; endDate: string; startTime: string; endTime: string; duration: string; startDateIso?: string; endDateIso?: string; startDateTimeIso?: string; endDateTimeIso?: string; }>` |


## Methods

### `clear() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
