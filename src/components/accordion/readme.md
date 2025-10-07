# accordion-item-component



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type      | Default               |
| ---------------- | ------------------ | ----------- | --------- | --------------------- |
| `accordion`      | `accordion`        |             | `boolean` | `false`               |
| `block`          | `block`            |             | `boolean` | `false`               |
| `classNames`     | `class-names`      |             | `string`  | `''`                  |
| `contentTxtSize` | `content-txt-size` |             | `string`  | `''`                  |
| `disabled`       | `disabled`         |             | `boolean` | `false`               |
| `flush`          | `flush`            |             | `boolean` | `false`               |
| `icon`           | `icon`             |             | `string`  | `'fas fa-angle-down'` |
| `isOpen`         | `is-open`          |             | `boolean` | `false`               |
| `link`           | `link`             |             | `boolean` | `false`               |
| `outlined`       | `outlined`         |             | `boolean` | `false`               |
| `ripple`         | `ripple`           |             | `boolean` | `false`               |
| `size`           | `size`             |             | `string`  | `''`                  |
| `targetId`       | `target-id`        |             | `string`  | `''`                  |
| `variant`        | `variant`          |             | `string`  | `''`                  |


## Events

| Event         | Description | Type                   |
| ------------- | ----------- | ---------------------- |
| `toggleEvent` |             | `CustomEvent<boolean>` |


## Dependencies

### Depends on

- [button-component](../button)
- [icon-component](../icon)

### Graph
```mermaid
graph TD;
  accordion-component --> button-component
  accordion-component --> icon-component
  style accordion-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
