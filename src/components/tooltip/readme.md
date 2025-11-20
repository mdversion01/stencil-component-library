# tooltip-component



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                         | Type                                                                                       | Default         |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------- |
| `animation`    | `animation`     | Enable/disable fade animation class                                                                 | `boolean`                                                                                  | `true`          |
| `container`    | `container`     | Optional CSS selector to append tooltip into (defaults to body)                                     | `string`                                                                                   | `undefined`     |
| `customClass`  | `custom-class`  | Additional classes to apply to tooltip; can be a string                                             | `string`                                                                                   | `''`            |
| `htmlContent`  | `html-content`  | If true, treat content as HTML and use innerHTML (TRUSTED CONTENT ONLY)                             | `boolean`                                                                                  | `false`         |
| `message`      | `message`       | Message fallback when no title/data-original-title supplied                                         | `string`                                                                                   | `''`            |
| `position`     | `position`      | Initial/forced placement; use "auto" to choose best fit                                             | `"auto" \| "bottom" \| "left" \| "right" \| "top"`                                         | `'top'`         |
| `tooltipTitle` | `tooltip-title` | Title/content string; if empty, falls back to `title`/`data-original-title` attributes or `message` | `string`                                                                                   | `undefined`     |
| `trigger`      | `trigger`       | Space-separated triggers: "hover", "focus", "click", "manual"                                       | `string`                                                                                   | `'hover focus'` |
| `variant`      | `variant`       | Contextual color variant                                                                            | `"" \| "danger" \| "dark" \| "info" \| "primary" \| "secondary" \| "success" \| "warning"` | `''`            |
| `visible`      | `visible`       | If true, the tooltip is currently visible (manual control)                                          | `boolean`                                                                                  | `false`         |


## Methods

### `hide() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
