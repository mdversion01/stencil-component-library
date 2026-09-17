# toasts-component



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                   | Description                                                                                                                                      | Type                                                                                                  | Default             |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------- |
| `additionalHeaderContent` | `additional-header-content` |                                                                                                                                                  | `any`                                                                                                 | `undefined`         |
| `appendToast`             | `append-toast`              |                                                                                                                                                  | `boolean`                                                                                             | `false`             |
| `ariaLabel`               | `aria-label`                |                                                                                                                                                  | `string`                                                                                              | `'Notifications'`   |
| `bodyClass`               | `body-class`                |                                                                                                                                                  | `string`                                                                                              | `undefined`         |
| `contentHtml`             | `content-html`              |                                                                                                                                                  | `string`                                                                                              | `undefined`         |
| `duration`                | `duration`                  |                                                                                                                                                  | `number`                                                                                              | `5000`              |
| `focusOnShow`             | `focus-on-show`             |                                                                                                                                                  | `boolean`                                                                                             | `false`             |
| `headerClass`             | `header-class`              |                                                                                                                                                  | `string`                                                                                              | `undefined`         |
| `isStatus`                | `is-status`                 |                                                                                                                                                  | `boolean`                                                                                             | `false`             |
| `maxWidth`                | `max-width`                 |                                                                                                                                                  | `number \| string`                                                                                    | `350`               |
| `message`                 | `message`                   |                                                                                                                                                  | `string`                                                                                              | `undefined`         |
| `noAnimation`             | `no-animation`              |                                                                                                                                                  | `boolean`                                                                                             | `false`             |
| `noCloseButton`           | `no-close-button`           |                                                                                                                                                  | `boolean`                                                                                             | `false`             |
| `noHoverPause`            | `no-hover-pause`            |                                                                                                                                                  | `boolean`                                                                                             | `false`             |
| `persistent`              | `persistent`                |                                                                                                                                                  | `boolean`                                                                                             | `false`             |
| `position`                | `position`                  |                                                                                                                                                  | `"bottom-center" \| "bottom-left" \| "bottom-right" \| "top-center" \| "top-left" \| "top-right"`     | `'bottom-right'`    |
| `previewToasts`           | --                          | Declarative render-only toast data for documentation, testing, and visual previews. When supplied, runtime toast lifecycle behavior is disabled. | `ToastPreviewItem[]`                                                                                  | `undefined`         |
| `solidToast`              | `solid-toast`               |                                                                                                                                                  | `boolean`                                                                                             | `false`             |
| `svgIcon`                 | `svg-icon`                  |                                                                                                                                                  | `string`                                                                                              | `undefined`         |
| `toastId`                 | `toast-id`                  |                                                                                                                                                  | `string`                                                                                              | `'toast-component'` |
| `toastTitle`              | `toast-title`               |                                                                                                                                                  | `string`                                                                                              | `undefined`         |
| `variant`                 | `variant`                   |                                                                                                                                                  | `"" \| "danger" \| "dark" \| "info" \| "light" \| "primary" \| "secondary" \| "success" \| "warning"` | `''`                |


## Methods

### `removeToast(id: number) => Promise<void>`



#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `number` |             |

#### Returns

Type: `Promise<void>`



### `showToast(options?: Partial<Omit<ToastItem, "id" | "state" | "hideTimeout">>) => Promise<number>`



#### Parameters

| Name      | Type                                                                                                                                                                                                                                                                                               | Description |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `options` | `{ duration?: number; noHoverPause?: boolean; persistent?: boolean; svgIcon?: string; headerClass?: string; bodyClass?: string; isStatus?: boolean; noCloseButton?: boolean; toastTitle?: string; contentHtml?: string; content?: any; additionalHdrContent?: any; variantClass?: ToastVariant; }` |             |

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
