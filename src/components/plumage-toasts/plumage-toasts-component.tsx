// ============================================================================
// File: src/components/plumage-toasts/plumage-toasts-component.tsx
// ============================================================================

import {
  Component,
  Element,
  h,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

export type IconVariantColor =
  | ''
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'info'
  | 'warning'
  | 'dark'
  | 'light';

export type PlumageToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type PlumageToastState =
  | 'fade'
  | 'show';

export interface PlumageToastItem {
  id: number;
  content?: any;
  contentHtml?: string;
  additionalHdrContent?: any;
  iconVariantClass: IconVariantColor;
  duration: number;
  svgIcon?: string;
  persistent?: boolean;
  toastTitle?: string;
  time?: string;
  noTime?: boolean;
  noCloseButton?: boolean;
  bodyClass?: string;
  headerClass?: string;
  isStatus?: boolean;
  noHoverPause?: boolean;
  state: PlumageToastState;
  hideTimeout?: number;
  removeTimeout?: number;
}

export interface PlumageToastPreviewItem {
  content?: any;
  contentHtml?: string;
  additionalHdrContent?: any;
  iconVariantClass?: IconVariantColor;
  duration?: number;
  svgIcon?: string;
  persistent?: boolean;
  toastTitle?: string;
  time?: string;
  noTime?: boolean;
  noCloseButton?: boolean;
  bodyClass?: string;
  headerClass?: string;
  isStatus?: boolean;
  noHoverPause?: boolean;
}

type PlumageToastIconDefinition = {
  viewBox: string;
  path: string;
};

const TOAST_ICONS: Record<
  string,
  PlumageToastIconDefinition
> = {
  'check-circle-fill': {
    viewBox:
      '0 0 22 22',
    path:
      'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z',
  },

  'check-circle-outline': {
    viewBox:
      '0 0 22 22',
    path:
      'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z',
  },

  'info-fill': {
    viewBox:
      '0 0 22 22',
    path:
      'M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  },

  'info-outlined': {
    viewBox:
      '0 0 22 22',
    path:
      'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z',
  },

  'exclamation-triangle-fill': {
    viewBox:
      '0 0 22 22',
    path:
      'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z',
  },

  'exclamation-triangle-outline': {
    viewBox:
      '0 0 22 22',
    path:
      'M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16',
  },

  'exclamation-circle-fill': {
    viewBox:
      '0 0 22 22',
    path:
      'M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  },

  'exclamation-circle-outline': {
    viewBox:
      '0 0 22 22',
    path:
      'M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z',
  },
};

@Component({
  tag:
    'plumage-toasts-component',
  styleUrl:
    'plumage-toasts-styles.scss',
  shadow:
    false,
})
export class PlumageToastsComponent {
  @Element()
  host!: HTMLElement;

  @Prop()
  toastId: string =
    'plumage-toasts-component';

  @Prop({
    reflect: true,
  })
  position: PlumageToastPosition =
    'bottom-right';

  @Prop()
  variant: IconVariantColor =
    '';

  @Prop()
  plumageToastMax: boolean =
    false;

  @Prop()
  appendToast: boolean =
    false;

  @Prop()
  duration: number =
    5000;

  @Prop()
  noAnimation: boolean =
    false;

  @Prop()
  noHoverPause: boolean =
    false;

  @Prop()
  persistent: boolean =
    false;

  @Prop()
  svgIcon?: string;

  @Prop()
  headerClass?: string;

  @Prop()
  bodyClass?: string;

  @Prop()
  isStatus: boolean =
    false;

  @Prop()
  noCloseButton: boolean =
    false;

  @Prop()
  noTime: boolean =
    false;

  @Prop()
  toastTitle?: string;

  @Prop()
  message?: string;

  @Prop()
  maxWidth:
    | number
    | string = 550;

  @Prop()
  additionalHeaderContent?: any;

  @Prop()
  contentHtml?: string;

  @Prop()
  time: string =
    PlumageToastsComponent.getCurrentZuluTime();

  @Prop({
    attribute:
      'aria-label',
  })
  ariaLabel: string =
    'Notifications';

  @Prop()
  focusOnShow: boolean =
    false;

  /**
   * Declarative render-only toast data for documentation, testing, and visual
   * previews. When supplied, runtime toast lifecycle behavior is disabled.
   */
  @Prop()
  previewToasts?: PlumageToastPreviewItem[];

  @State()
  private toasts: PlumageToastItem[] =
    [];

  private nextToastId =
    0;

  disconnectedCallback(): void {
    this.toasts.forEach(
      toast => {
        this.clearToastTimers(
          toast,
        );
      },
    );
  }

  @Method()
  async showToast(
    options: Partial<
      Omit<
        PlumageToastItem,
        | 'id'
        | 'state'
        | 'hideTimeout'
        | 'removeTimeout'
      >
    > = {},
  ): Promise<number> {
    const id =
      this.generateToastId();

    const toast: PlumageToastItem = {
      id,

      content:
        options.content ??
        this.message ??
        '',

      contentHtml:
        options.contentHtml ??
        this.contentHtml,

      additionalHdrContent:
        options.additionalHdrContent ??
        this.additionalHeaderContent,

      iconVariantClass:
        options.iconVariantClass ??
        this.variant,

      duration:
        options.duration ??
        this.duration,

      svgIcon:
        options.svgIcon ??
        this.svgIcon,

      persistent:
        options.persistent ??
        this.persistent,

      toastTitle:
        options.toastTitle ??
        this.toastTitle,

      time:
        options.time !==
        undefined
          ? options.time
          : this.time,

      noTime:
        options.noTime ??
        this.noTime,

      noCloseButton:
        options.noCloseButton ??
        this.noCloseButton,

      bodyClass:
        options.bodyClass ??
        this.bodyClass,

      headerClass:
        options.headerClass ??
        this.headerClass,

      isStatus:
        options.isStatus ??
        this.isStatus,

      noHoverPause:
        options.noHoverPause ??
        this.noHoverPause,

      state:
        'fade',
    };

    this.toasts =
      this.appendToast
        ? [
            ...this.toasts,
            toast,
          ]
        : [
            toast,
            ...this.toasts,
          ];

    window.setTimeout(
      () => {
        const currentToast =
          this.findToast(
            id,
          );

        if (!currentToast) {
          return;
        }

        currentToast.state =
          'show';

        this.toasts = [
          ...this.toasts,
        ];

        if (
          this.focusOnShow
        ) {
          requestAnimationFrame(
            () => {
              this.focusToast(
                id,
              );
            },
          );
        }
      },
      this.noAnimation
        ? 0
        : 10,
    );

    if (
      !toast.persistent
    ) {
      this.startHideTimer(
        toast,
      );
    }

    return id;
  }

  @Method()
  async startRemoveToast(
    id: number,
  ): Promise<void> {
    const toast =
      this.findToast(
        id,
      );

    if (!toast) {
      return;
    }

    this.clearHideTimeout(
      toast,
    );

    if (
      toast.removeTimeout !=
      null
    ) {
      return;
    }

    if (
      this.noAnimation
    ) {
      await this.removeToast(
        id,
      );

      return;
    }

    toast.state =
      'fade';

    this.toasts = [
      ...this.toasts,
    ];

    toast.removeTimeout =
      window.setTimeout(
        () => {
          toast.removeTimeout =
            undefined;

          void this.removeToast(
            id,
          );
        },
        500,
      );
  }

  @Method()
  async removeToast(
    id: number,
  ): Promise<void> {
    const toast =
      this.findToast(
        id,
      );

    if (toast) {
      this.clearToastTimers(
        toast,
      );
    }

    this.toasts =
      this.toasts.filter(
        item =>
          item.id !== id,
      );
  }

  @Listen('keydown')
  onKeyDown(
    event: KeyboardEvent,
  ): void {
    if (
      this.isPreviewMode() ||
      event.key !==
        'Escape'
    ) {
      return;
    }

    const target =
      event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    const toastElement =
      target.closest(
        '[data-toast-id]',
      ) as HTMLElement | null;

    if (!toastElement) {
      return;
    }

    const idValue =
      toastElement.getAttribute(
        'data-toast-id',
      );

    const id =
      idValue
        ? Number(
            idValue,
          )
        : Number.NaN;

    if (
      !Number.isFinite(
        id,
      )
    ) {
      return;
    }

    event.preventDefault();

    void this.startRemoveToast(
      id,
    );
  }

  private static getCurrentZuluTime(): string {
    return (
      new Date()
        .toISOString()
        .substring(
          11,
          19,
        ) +
      'Z'
    );
  }

  private isPreviewMode(): boolean {
    return (
      this.previewToasts !==
      undefined
    );
  }

  private getRenderedToasts(): PlumageToastItem[] {
    if (
      !this.isPreviewMode()
    ) {
      return this.toasts;
    }

    return (
      this.previewToasts ??
      []
    ).map(
      (
        preview,
        index,
      ) => ({
        id:
          index + 1,

        content:
          preview.content ??
          this.message ??
          '',

        contentHtml:
          preview.contentHtml ??
          this.contentHtml,

        additionalHdrContent:
          preview.additionalHdrContent ??
          this.additionalHeaderContent,

        iconVariantClass:
          preview.iconVariantClass ??
          this.variant,

        duration:
          preview.duration ??
          this.duration,

        svgIcon:
          preview.svgIcon ??
          this.svgIcon,

        persistent:
          preview.persistent ??
          this.persistent,

        toastTitle:
          preview.toastTitle ??
          this.toastTitle,

        time:
          preview.time !==
          undefined
            ? preview.time
            : this.time,

        noTime:
          preview.noTime ??
          this.noTime,

        noCloseButton:
          preview.noCloseButton ??
          this.noCloseButton,

        bodyClass:
          preview.bodyClass ??
          this.bodyClass,

        headerClass:
          preview.headerClass ??
          this.headerClass,

        isStatus:
          preview.isStatus ??
          this.isStatus,

        noHoverPause:
          true,

        state:
          'show',
      }),
    );
  }

  private generateToastId(): number {
    this.nextToastId +=
      1;

    return (
      Date.now() *
        1000 +
      this.nextToastId
    );
  }

  private findToast(
    id: number,
  ): PlumageToastItem | undefined {
    return this.toasts.find(
      toast =>
        toast.id === id,
    );
  }

  private startHideTimer(
    toast: PlumageToastItem,
  ): void {
    this.clearHideTimeout(
      toast,
    );

    toast.hideTimeout =
      window.setTimeout(
        () => {
          toast.hideTimeout =
            undefined;

          void this.startRemoveToast(
            toast.id,
          );
        },
        toast.duration,
      );
  }

  private clearHideTimeout(
    toast: PlumageToastItem,
  ): void {
    if (
      toast.hideTimeout ==
      null
    ) {
      return;
    }

    window.clearTimeout(
      toast.hideTimeout,
    );

    toast.hideTimeout =
      undefined;
  }

  private clearRemoveTimeout(
    toast: PlumageToastItem,
  ): void {
    if (
      toast.removeTimeout ==
      null
    ) {
      return;
    }

    window.clearTimeout(
      toast.removeTimeout,
    );

    toast.removeTimeout =
      undefined;
  }

  private clearToastTimers(
    toast: PlumageToastItem,
  ): void {
    this.clearHideTimeout(
      toast,
    );

    this.clearRemoveTimeout(
      toast,
    );
  }

  private focusToast(
    id: number,
  ): void {
    const contentId =
      this.getToastContentId(
        id,
      );

    const content =
      Array.from(
        this.host.querySelectorAll<HTMLElement>(
          '[id]',
        ),
      ).find(
        element =>
          element.id ===
          contentId,
      );

    content?.focus();
  }

  private handleCloseClick = (
    event: MouseEvent,
    id: number,
  ): void => {
    if (
      this.isPreviewMode()
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    void this.startRemoveToast(
      id,
    );
  };

  private handleMouseEnter = (
    toast: PlumageToastItem,
  ): void => {
    if (
      this.isPreviewMode() ||
      toast.noHoverPause
    ) {
      return;
    }

    this.clearHideTimeout(
      toast,
    );
  };

  private handleMouseLeave = (
    toast: PlumageToastItem,
  ): void => {
    if (
      this.isPreviewMode() ||
      toast.noHoverPause ||
      toast.persistent ||
      toast.hideTimeout !=
        null ||
      toast.removeTimeout !=
        null
    ) {
      return;
    }

    this.startHideTimer(
      toast,
    );
  };

  private getIconColor(
    variant:
      | IconVariantColor
      | undefined,
  ): string {
    switch (variant) {
      case 'primary':
        return '#2680eb';

      case 'secondary':
        return '#8e8e8e';

      case 'success':
        return '#2d9d78';

      case 'danger':
        return '#e34850';

      case 'info':
        return '#5c9be6';

      case 'warning':
        return '#e68619';

      case 'dark':
        return '#383838';

      case 'light':
        return '#eaeaea';

      default:
        return 'currentColor';
    }
  }

  private getIconDefinition(
    iconId:
      | string
      | undefined,
  ):
    | PlumageToastIconDefinition
    | undefined {
    if (!iconId) {
      return undefined;
    }

    return TOAST_ICONS[
      iconId
    ];
  }

  private getMaxWidthStyle(): Record<
    string,
    string
  > {
    if (
      typeof this.maxWidth ===
      'number'
    ) {
      return {
        maxWidth:
          `${this.maxWidth}px`,
      };
    }

    const value =
      this.maxWidth.trim();

    if (!value) {
      return {
        maxWidth:
          '550px',
      };
    }

    if (
      /^\d+(\.\d+)?$/.test(
        value,
      )
    ) {
      return {
        maxWidth:
          `${value}px`,
      };
    }

    return {
      maxWidth:
        value,
    };
  }

  private getToastOuterId(
    id: number,
  ): string {
    return `${this.toastId}__toast_${id}__outer`;
  }

  private getToastContentId(
    id: number,
  ): string {
    return `${this.toastId}__toast_${id}__content`;
  }

  private getToastTitleId(
    id: number,
  ): string {
    return `${this.toastId}__toast_${id}__title`;
  }

  private getToastBodyId(
    id: number,
  ): string {
    return `${this.toastId}__toast_${id}__body`;
  }

  private getToastCloseId(
    id: number,
  ): string {
    return `${this.toastId}__toast_${id}__close`;
  }

  private getToastClasses(
    toast: PlumageToastItem,
  ): string {
    return [
      'toast',

      this.noAnimation ||
      this.isPreviewMode()
        ? ''
        : 'fade',

      toast.state,

      toast.persistent
        ? 'persistent'
        : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  private getToastStyle(
    toast: PlumageToastItem,
  ):
    | Record<
        string,
        string
      >
    | undefined {
    if (
      this.noAnimation ||
      this.isPreviewMode()
    ) {
      return undefined;
    }

    return {
      '--toast-duration':
        `${toast.duration / 1000}s`,
    };
  }

  private getToastRole(
    toast: PlumageToastItem,
  ): 'status' | 'alert' {
    return toast.isStatus
      ? 'status'
      : 'alert';
  }

  private renderCloseButton(
    toast: PlumageToastItem,
    className =
      'close ml-auto m1',
  ) {
    if (
      toast.noCloseButton
    ) {
      return null;
    }

    const label =
      toast.toastTitle
        ? `Close ${toast.toastTitle}`
        : 'Close notification';

    return (
      <button
        id={
          this.getToastCloseId(
            toast.id,
          )
        }
        type="button"
        class={className}
        aria-label={label}
        aria-controls={
          this.getToastOuterId(
            toast.id,
          )
        }
        onClick={
          this.isPreviewMode()
            ? undefined
            : event =>
                this.handleCloseClick(
                  event,
                  toast.id,
                )
        }
      >
        <span aria-hidden="true">
          ×
        </span>
      </button>
    );
  }

  private renderIcon(
    toast: PlumageToastItem,
  ) {
    const icon =
      this.getIconDefinition(
        toast.svgIcon,
      );

    if (!icon) {
      return null;
    }

    return (
      <svg
        class="toast-svg flex-shrink-0"
        viewBox={
          icon.viewBox
        }
        aria-hidden="true"
        focusable="false"
        style={{
          fill:
            this.getIconColor(
              toast.iconVariantClass,
            ),
        }}
      >
        <path
          d={icon.path}
        />
      </svg>
    );
  }

  private renderAdditionalHeaderContent(
    toast: PlumageToastItem,
  ) {
    if (
      !toast.additionalHdrContent
    ) {
      return null;
    }

    return (
      <span class="toast-additional-header-content">
        {
          toast.additionalHdrContent
        }
      </span>
    );
  }

  private renderToastTime(
    toast: PlumageToastItem,
  ) {
    if (
      toast.noTime ||
      !toast.time
    ) {
      return null;
    }

    return (
      <div class="toast-time">
        {toast.time}
      </div>
    );
  }

  private renderToastBody(
    toast: PlumageToastItem,
    className =
      'toast-body',
  ) {
    const bodyId =
      this.getToastBodyId(
        toast.id,
      );

    const classes = [
      className,
      toast.bodyClass || '',
    ]
      .filter(Boolean)
      .join(' ');

    if (
      toast.contentHtml
    ) {
      return (
        <div
          id={bodyId}
          class={classes}
          innerHTML={
            toast.contentHtml
          }
        ></div>
      );
    }

    return (
      <div
        id={bodyId}
        class={classes}
      >
        {toast.content}
      </div>
    );
  }

  private renderStandardPlumageToast(
    toast: PlumageToastItem,
  ) {
    const contentId =
      this.getToastContentId(
        toast.id,
      );

    const titleId =
      this.getToastTitleId(
        toast.id,
      );

    const headerClasses = [
      'toast-header',
      toast.headerClass ||
        '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        id={contentId}
        class="toast-display"
        tabIndex={0}
      >
        <div class="toast-content">
          <header
            class={
              headerClasses
            }
          >
            <div class="toast-header-content">
              <div class="toast-title-wrapper">
                <div
                  id={
                    titleId
                  }
                  class="mr-auto mb-0"
                >
                  {toast.toastTitle ||
                    'Notification'}
                </div>

                {this.renderAdditionalHeaderContent(
                  toast,
                )}
              </div>

              {this.renderToastTime(
                toast,
              )}
            </div>

            {this.renderCloseButton(
              toast,
            )}
          </header>

          {this.renderToastBody(
            toast,
          )}
        </div>
      </div>
    );
  }

  private renderMaxPlumageToast(
    toast: PlumageToastItem,
  ) {
    const titleId =
      this.getToastTitleId(
        toast.id,
      );

    const bodyId =
      this.getToastBodyId(
        toast.id,
      );

    const icon =
      this.renderIcon(
        toast,
      );

    const headerClasses = [
      'header',
      toast.headerClass ||
        '',
    ]
      .filter(Boolean)
      .join(' ');

    const bodyClasses = [
      'd-flex',
      'flex-column',
      'toast-data',
      toast.bodyClass ||
        '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        id={
          this.getToastContentId(
            toast.id,
          )
        }
        class="toast-max toast-display"
        tabIndex={0}
      >
        {icon ? (
          <div class="toast-icon">
            {icon}
          </div>
        ) : null}

        <div class="toast-content">
          <div class="toast-header w-100">
            <div
              id={
                titleId
              }
              class={
                headerClasses
              }
            >
              <span>
                {toast.toastTitle ||
                  'Notification'}
              </span>

              {this.renderAdditionalHeaderContent(
                toast,
              )}
            </div>

            <div class="toast-buttons d-flex">
              {this.renderCloseButton(
                toast,
                'close ml-3',
              )}
            </div>
          </div>

          <div class="toast-body">
            {toast.contentHtml ? (
              <div
                id={bodyId}
                class={
                  bodyClasses
                }
              >
                <div
                  innerHTML={
                    toast.contentHtml
                  }
                ></div>
              </div>
            ) : (
              <div
                id={bodyId}
                class={
                  bodyClasses
                }
              >
                {
                  toast.content
                }
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  private renderToast(
    toast: PlumageToastItem,
  ) {
    const outerId =
      this.getToastOuterId(
        toast.id,
      );

    const titleId =
      this.getToastTitleId(
        toast.id,
      );

    const bodyId =
      this.getToastBodyId(
        toast.id,
      );

    return (
      <div
        id={outerId}
        data-toast-id={
          String(
            toast.id,
          )
        }
        role={
          this.getToastRole(
            toast,
          )
        }
        aria-atomic="true"
        aria-labelledby={
          toast.toastTitle
            ? titleId
            : undefined
        }
        aria-describedby={
          bodyId
        }
        class={
          this.getToastClasses(
            toast,
          )
        }
        style={
          this.getToastStyle(
            toast,
          )
        }
        onMouseEnter={
          this.isPreviewMode()
            ? undefined
            : () =>
                this.handleMouseEnter(
                  toast,
                )
        }
        onMouseLeave={
          this.isPreviewMode()
            ? undefined
            : () =>
                this.handleMouseLeave(
                  toast,
                )
        }
      >
        {this.plumageToastMax
          ? this.renderMaxPlumageToast(
              toast,
            )
          : this.renderStandardPlumageToast(
              toast,
            )}
      </div>
    );
  }

  private renderToaster() {
    const trayClass = [
      'toaster',
      `toaster-${this.position}`,
    ].join(' ');

    const renderedToasts =
      this.getRenderedToasts();

    return (
      <div
        id={`toaster-${this.position}`}
        class={trayClass}
        role="region"
        aria-label={
          this.ariaLabel
        }
        aria-relevant="additions text"
        aria-atomic="false"
      >
        <div
          class="toaster-slot"
          style={
            this.getMaxWidthStyle()
          }
        >
          {renderedToasts.map(
            toast =>
              this.renderToast(
                toast,
              ),
          )}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderToaster()}
      </div>
    );
  }
}
