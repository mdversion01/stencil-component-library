# toasts-component



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                   | Description                                                     | Type                                                                                                  | Default                                |
| ------------------------- | --------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `additionalHeaderContent` | `additional-header-content` |                                                                 | `any`                                                                                                 | `undefined`                            |
| `appendToast`             | `append-toast`              |                                                                 | `boolean`                                                                                             | `false`                                |
| `bodyClass`               | `body-class`                |                                                                 | `string`                                                                                              | `undefined`                            |
| `customContent`           | `custom-content`            |                                                                 | `any`                                                                                                 | `undefined`                            |
| `duration`                | `duration`                  |                                                                 | `number`                                                                                              | `5000`                                 |
| `headerClass`             | `header-class`              |                                                                 | `string`                                                                                              | `undefined`                            |
| `iconPlumageStyle`        | `icon-plumage-style`        |                                                                 | `boolean`                                                                                             | `false`                                |
| `isStatus`                | `is-status`                 |                                                                 | `boolean`                                                                                             | `false`                                |
| `message`                 | `message`                   |                                                                 | `string`                                                                                              | `undefined`                            |
| `noAnimation`             | `no-animation`              |                                                                 | `boolean`                                                                                             | `false`                                |
| `noCloseButton`           | `no-close-button`           |                                                                 | `boolean`                                                                                             | `false`                                |
| `noHoverPause`            | `no-hover-pause`            |                                                                 | `boolean`                                                                                             | `false`                                |
| `persistent`              | `persistent`                |                                                                 | `boolean`                                                                                             | `false`                                |
| `plumageToast`            | `plumage-toast`             |                                                                 | `boolean`                                                                                             | `false`                                |
| `plumageToastMax`         | `plumage-toast-max`         |                                                                 | `boolean`                                                                                             | `false`                                |
| `position`                | `position`                  |                                                                 | `"bottom-left" \| "bottom-right" \| "top-left" \| "top-right"`                                        | `'bottom-right'`                       |
| `solidToast`              | `solid-toast`               |                                                                 | `boolean`                                                                                             | `false`                                |
| `svgIcon`                 | `svg-icon`                  | Default icon symbol id (from the inline sprite) for new toasts. | `string`                                                                                              | `undefined`                            |
| `time`                    | `time`                      |                                                                 | `string`                                                                                              | `ToastsComponent.getCurrentZuluTime()` |
| `toastId`                 | `toast-id`                  |                                                                 | `string`                                                                                              | `'toast-component'`                    |
| `toastTitle`              | `toast-title`               |                                                                 | `string`                                                                                              | `undefined`                            |
| `variant`                 | `variant`                   |                                                                 | `"" \| "danger" \| "dark" \| "info" \| "light" \| "primary" \| "secondary" \| "success" \| "warning"` | `''`                                   |


## Methods

### `removeToast(id: number) => Promise<void>`



#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `number` |             |

#### Returns

Type: `Promise<void>`



### `showToast(opts?: Partial<Omit<ToastItem, "id" | "state">>) => Promise<number>`



#### Parameters

| Name   | Type                                                                                                                                                                                                                                                                                                                                                             | Description |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `opts` | `{ duration?: number; noHoverPause?: boolean; persistent?: boolean; svgIcon?: string; headerClass?: string; bodyClass?: string; isStatus?: boolean; noCloseButton?: boolean; iconPlumageStyle?: boolean; toastTitle?: string; time?: string; content?: any; contentHtml?: string; additionalHdrContent?: any; variantClass?: ToastVariant; hideTimeout?: any; }` |             |

#### Returns

Type: `Promise<number>`



### `startRemoveToast(id: number) => Promise<void>`



#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `number` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
