# toasts-component



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                   | Description                                                                          | Type                                                                                                  | Default                                |
| ------------------------- | --------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `additionalHeaderContent` | `additional-header-content` | Optional header content (string/JSX) appearing next to the title (e.g., timestamp).  | `any`                                                                                                 | `undefined`                            |
| `appendToast`             | `append-toast`              | If true, new toasts append to the end; otherwise they prepend (newest on top).       | `boolean`                                                                                             | `false`                                |
| `bodyClass`               | `body-class`                |                                                                                      | `string`                                                                                              | `undefined`                            |
| `customContent`           | `custom-content`            | Optional custom content for the body (string/JSX). Prefer using slots in apps.       | `any`                                                                                                 | `undefined`                            |
| `duration`                | `duration`                  | Default lifespan in ms for auto-dismiss toasts.                                      | `number`                                                                                              | `5000`                                 |
| `headerClass`             | `header-class`              | Default header/body helper classes.                                                  | `string`                                                                                              | `undefined`                            |
| `iconPlumageStyle`        | `icon-plumage-style`        | If true, use the “plumage icon” layout on compact plumage variant.                   | `boolean`                                                                                             | `false`                                |
| `isStatus`                | `is-status`                 | When true, use polite/status instead of alert/assertive on aria-live for new toasts. | `boolean`                                                                                             | `false`                                |
| `message`                 | `message`                   | Optional default message for simple string-only toasts.                              | `string`                                                                                              | `undefined`                            |
| `noAnimation`             | `no-animation`              | Disable fade-in/out transitions globally.                                            | `boolean`                                                                                             | `false`                                |
| `noCloseButton`           | `no-close-button`           | If true, hide the × close button by default.                                         | `boolean`                                                                                             | `false`                                |
| `noHoverPause`            | `no-hover-pause`            | Prevent hover from pausing auto-hide globally.                                       | `boolean`                                                                                             | `false`                                |
| `persistent`              | `persistent`                | Make toasts persistent by default (no auto-hide).                                    | `boolean`                                                                                             | `false`                                |
| `plumageToast`            | `plumage-toast`             | If true, use the Plumage toast style.                                                | `boolean`                                                                                             | `false`                                |
| `plumageToastMax`         | `plumage-toast-max`         | If true with plumageToast, render the “max” layout.                                  | `boolean`                                                                                             | `false`                                |
| `position`                | `position`                  | Where the toaster tray is anchored.                                                  | `"bottom-left" \| "bottom-right" \| "top-left" \| "top-right"`                                        | `'bottom-right'`                       |
| `solidToast`              | `solid-toast`               | If true, use the “solid” toast style (Bootstrap-like) instead of bordered.           | `boolean`                                                                                             | `false`                                |
| `svgIcon`                 | `svg-icon`                  | Default icon symbol id (from the inline sprite) for new toasts.                      | `string`                                                                                              | `undefined`                            |
| `time`                    | `time`                      | Default time label (ZULU).                                                           | `string`                                                                                              | `ToastsComponent.getCurrentZuluTime()` |
| `toastId`                 | `toast-id`                  | (Optional) id used inside nested elements; does not override the host element id     | `string`                                                                                              | `'toast-component'`                    |
| `toastTitle`              | `toast-title`               | Optional default title for new toasts. (Renamed from reserved `title`.)              | `string`                                                                                              | `undefined`                            |
| `variant`                 | `variant`                   | Variant color for new toasts (can be overridden per-toast via showToast opts).       | `"" \| "danger" \| "dark" \| "info" \| "light" \| "primary" \| "secondary" \| "success" \| "warning"` | `''`                                   |


## Methods

### `removeToast(id: number) => Promise<void>`

Remove toast immediately.

#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `number` |             |

#### Returns

Type: `Promise<void>`



### `showToast(opts?: Partial<Omit<ToastItem, "id" | "state">>) => Promise<number>`

Show a toast. Returns the id of the created toast.

#### Parameters

| Name   | Type                                                                                                                                                                                                                                                                                                                                                             | Description |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `opts` | `{ duration?: number; noHoverPause?: boolean; persistent?: boolean; svgIcon?: string; headerClass?: string; bodyClass?: string; isStatus?: boolean; noCloseButton?: boolean; iconPlumageStyle?: boolean; toastTitle?: string; time?: string; content?: any; contentHtml?: string; additionalHdrContent?: any; variantClass?: ToastVariant; hideTimeout?: any; }` |             |

#### Returns

Type: `Promise<number>`



### `startRemoveToast(id: number) => Promise<void>`

Start fade-out, then remove.

#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `number` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
