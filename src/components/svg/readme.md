# svg-component



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description                                                                                                                                                                     | Type                                | Default          |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------- |
| `decorative`         | `decorative`           | When true, forces decorative behavior: aria-hidden="true" and removes accessible name wiring. If not set, component defaults to decorative when no accessible name is provided. | `boolean`                           | `undefined`      |
| `fill`               | `fill`                 | Fill color applied to the rendered <svg>. Defaults to 'currentColor'.                                                                                                           | `string`                            | `'currentColor'` |
| `focusable`          | `focusable`            | Optional focus override. - When true: sets tabindex="0" (keyboard focusable) - When false: sets tabindex="-1" - When omitted: decorative => -1, meaningful => no tabindex       | `boolean`                           | `undefined`      |
| `height`             | `height`               | Height in px. Default 24.                                                                                                                                                       | `number`                            | `24`             |
| `path`               | `path`                 | Raw SVG markup (e.g. `<path d="..." />`). Injected into the <svg> via innerHTML.                                                                                                | `string`                            | `''`             |
| `svgAriaDescribedby` | `svg-aria-describedby` | Optional description: aria-describedby on the <svg> (space-separated ids).                                                                                                      | `string`                            | `undefined`      |
| `svgAriaHidden`      | `svg-aria-hidden`      | Optional explicit aria-hidden forwarded to <svg>. Use: svg-aria-hidden="true" \| "false" If omitted, component computes aria-hidden based on `decorative` + labeling.           | `"false" \| "true"`                 | `undefined`      |
| `svgAriaLabel`       | `svg-aria-label`       | Optional accessible name: aria-label on the <svg>.                                                                                                                              | `string`                            | `undefined`      |
| `svgAriaLabelledby`  | `svg-aria-labelledby`  | Optional accessible name: aria-labelledby on the <svg> (space-separated ids). Takes precedence over aria-label.                                                                 | `string`                            | `undefined`      |
| `svgDesc`            | `svg-desc`             | Optional <desc> element content for the SVG. Use attribute: svg-desc="Opens settings"                                                                                           | `string`                            | `undefined`      |
| `svgMargin`          | `svg-margin`           | Optional margin applied inline to the <svg>. - 'left'  => margin-left: 10px; - 'right' => margin-right: 10px; - 'both'  => both left and right 10px                             | `"" \| "both" \| "left" \| "right"` | `''`             |
| `svgTitle`           | `svg-title`            | Optional <title> element content for the SVG. Use attribute: svg-title="Settings"                                                                                               | `string`                            | `undefined`      |
| `viewBox`            | `view-box`             | SVG viewBox. MUST match the coordinate system of `path`.                                                                                                                        | `string`                            | `'0 0 640 640'`  |
| `width`              | `width`                | Width in px. Default 24.                                                                                                                                                        | `number`                            | `24`             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
