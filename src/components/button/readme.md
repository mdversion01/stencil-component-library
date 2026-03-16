# pl-button



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                  | Description                                                          | Type                                           | Default     |
| ------------------------ | -------------------------- | -------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| `absolute`               | `absolute`                 |                                                                      | `boolean`                                      | `false`     |
| `accordion`              | `accordion`                |                                                                      | `boolean`                                      | `false`     |
| `active`                 | `active`                   |                                                                      | `boolean`                                      | `false`     |
| `allowFocusableChildren` | `allow-focusable-children` |                                                                      | `boolean`                                      | `false`     |
| `ariaDescribedby`        | `aria-describedby`         |                                                                      | `string`                                       | `undefined` |
| `ariaLabel`              | `aria-label`               | Prefer using aria-labelledby when the label exists elsewhere in DOM. | `string`                                       | `''`        |
| `ariaLabelledby`         | `aria-labelledby`          |                                                                      | `string`                                       | `undefined` |
| `block`                  | `block`                    |                                                                      | `boolean`                                      | `false`     |
| `bottom`                 | `bottom`                   |                                                                      | `string`                                       | `''`        |
| `btnIcon`                | `btn-icon`                 |                                                                      | `boolean`                                      | `false`     |
| `btnText`                | `btn-text`                 |                                                                      | `string`                                       | `''`        |
| `classNames`             | `class-names`              |                                                                      | `string`                                       | `''`        |
| `devMode`                | `dev-mode`                 |                                                                      | `boolean`                                      | `false`     |
| `disabled`               | `disabled`                 |                                                                      | `boolean`                                      | `false`     |
| `elevation`              | `elevation`                |                                                                      | `string`                                       | `''`        |
| `end`                    | `end`                      |                                                                      | `boolean`                                      | `false`     |
| `fixed`                  | `fixed`                    |                                                                      | `boolean`                                      | `false`     |
| `groupBtn`               | `group-btn`                |                                                                      | `boolean`                                      | `false`     |
| `iconBtn`                | `icon-btn`                 |                                                                      | `boolean`                                      | `false`     |
| `isOpen`                 | `is-open`                  |                                                                      | `boolean`                                      | `false`     |
| `left`                   | `left`                     |                                                                      | `string`                                       | `''`        |
| `link`                   | `link`                     |                                                                      | `boolean`                                      | `false`     |
| `outlined`               | `outlined`                 |                                                                      | `boolean`                                      | `false`     |
| `pressed`                | `pressed`                  | Current pressed state (for toggle buttons).                          | `boolean`                                      | `false`     |
| `right`                  | `right`                    |                                                                      | `string`                                       | `''`        |
| `ripple`                 | `ripple`                   |                                                                      | `boolean`                                      | `false`     |
| `shape`                  | `shape`                    |                                                                      | `string`                                       | `''`        |
| `size`                   | `size`                     |                                                                      | `"" \| "lg" \| "plumage-size" \| "sm" \| "xs"` | `''`        |
| `slotSide`               | `slot-side`                |                                                                      | `"left" \| "right"`                            | `undefined` |
| `start`                  | `start`                    |                                                                      | `boolean`                                      | `false`     |
| `stripped`               | `stripped`                 |                                                                      | `boolean`                                      | `false`     |
| `styles`                 | `styles`                   | Inline CSS styles for the inner <button> or <a> element.             | `string`                                       | `''`        |
| `targetId`               | `target-id`                |                                                                      | `string`                                       | `''`        |
| `text`                   | `text`                     |                                                                      | `boolean`                                      | `false`     |
| `textBtn`                | `text-btn`                 |                                                                      | `boolean`                                      | `false`     |
| `titleAttr`              | `title-attr`               |                                                                      | `string`                                       | `''`        |
| `toggle`                 | `toggle`                   | Enable toggle-button behavior.                                       | `boolean`                                      | `false`     |
| `top`                    | `top`                      |                                                                      | `string`                                       | `''`        |
| `type`                   | `type`                     | Native button type (ignored for link mode).                          | `"button" \| "reset" \| "submit"`              | `'button'`  |
| `url`                    | `url`                      |                                                                      | `string`                                       | `''`        |
| `variant`                | `variant`                  |                                                                      | `string`                                       | `''`        |
| `vertical`               | `vertical`                 |                                                                      | `boolean`                                      | `false`     |
| `zIndex`                 | `z-index`                  |                                                                      | `string`                                       | `''`        |


## Events

| Event           | Description | Type                   |
| --------------- | ----------- | ---------------------- |
| `customClick`   |             | `CustomEvent<void>`    |
| `pressedChange` |             | `CustomEvent<boolean>` |


## Dependencies

### Used by

 - [accordion-component](../accordion)
 - [accordion-container](../accordion-container)
 - [dropdown-component](../dropdown)

### Graph
```mermaid
graph TD;
  accordion-component --> button-component
  accordion-container --> button-component
  dropdown-component --> button-component
  style button-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
