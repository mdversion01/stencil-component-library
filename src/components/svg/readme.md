# svg-component



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                                                                                                                                         | Type                                | Default          |
| --------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------- |
| `fill`          | `fill`            | Fill color applied to the rendered <svg>. Defaults to 'currentColor'.                                                                               | `string`                            | `'currentColor'` |
| `height`        | `height`          | Height in px. Default 24.                                                                                                                           | `number`                            | `24`             |
| `path`          | `path`            | Raw SVG markup (e.g. `<path d="..." />`). Injected into the <svg> via innerHTML.                                                                    | `string`                            | `''`             |
| `svgAriaHidden` | `svg-aria-hidden` | Forwarded as aria-hidden on the <svg>. Use: svg-aria-hidden="true" \| "false" If omitted, aria-hidden is not set.                                   | `"false" \| "true"`                 | `undefined`      |
| `svgAriaLabel`  | `svg-aria-label`  | Forwarded as aria-label on the <svg>. If omitted/empty, not set.                                                                                    | `string`                            | `undefined`      |
| `svgMargin`     | `svg-margin`      | Optional margin applied inline to the <svg>. - 'left'  => margin-left: 10px; - 'right' => margin-right: 10px; - 'both'  => both left and right 10px | `"" \| "both" \| "left" \| "right"` | `''`             |
| `viewBox`       | `view-box`        | SVG viewBox. MUST match the coordinate system of `path`.                                                                                            | `string`                            | `'0 0 640 640'`  |
| `width`         | `width`           | Width in px. Default 24.                                                                                                                            | `number`                            | `24`             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
