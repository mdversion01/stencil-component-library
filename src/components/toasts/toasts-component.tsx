// ============================================================================
// File: src/components/toasts/toasts-component.tsx
// ============================================================================

import { Component, Element, h, Listen, Method, Prop, State } from '@stencil/core';

export type ToastVariant = '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' | 'light';

export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type ToastState = 'fade' | 'show';

export interface ToastItem {
  id: number;
  content?: any;
  contentHtml?: string;
  additionalHdrContent?: any;
  variantClass: ToastVariant;
  duration: number;
  svgIcon?: string;
  persistent?: boolean;
  toastTitle?: string;
  noCloseButton?: boolean;
  bodyClass?: string;
  headerClass?: string;
  isStatus?: boolean;
  noHoverPause?: boolean;
  state: ToastState;
  hideTimeout?: number;
}

export interface ToastPreviewItem {
  content?: any;
  contentHtml?: string;
  additionalHdrContent?: any;
  variantClass?: ToastVariant;
  duration?: number;
  svgIcon?: string;
  persistent?: boolean;
  toastTitle?: string;
  noCloseButton?: boolean;
  bodyClass?: string;
  headerClass?: string;
  isStatus?: boolean;
  noHoverPause?: boolean;
}

type ToastIconDefinition = {
  viewBox: string;
  path: string;
};

const ICONS: Record<string, ToastIconDefinition> = {
  'check-circle-fill': {
    viewBox: '0 0 22 22',
    path: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z',
  },

  'check-circle-outline': {
    viewBox: '0 0 22 22',
    path: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z',
  },

  'info-fill': {
    viewBox: '0 0 22 22',
    path: 'M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  },

  'info-outlined': {
    viewBox: '0 0 22 22',
    path: 'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z',
  },

  'exclamation-triangle-fill': {
    viewBox: '0 0 22 22',
    path: 'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z',
  },

  'exclamation-triangle-outline': {
    viewBox: '0 0 22 22',
    path: 'M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16',
  },

  'exclamation-circle-fill': {
    viewBox: '0 0 22 22',
    path: 'M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
  },

  'exclamation-circle-outline': {
    viewBox: '0 0 22 22',
    path: 'M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z',
  },
};

@Component({
  tag: 'toasts-component',
  styleUrl: 'toasts-styles.scss',
  shadow: false,
})
export class ToastsComponent {
  @Element()
  host!: HTMLElement;

  @Prop()
  toastId: string = 'toast-component';

  @Prop({ reflect: true })
  position: ToastPosition = 'bottom-right';

  @Prop()
  variant: ToastVariant = '';

  @Prop()
  solidToast: boolean = false;

  @Prop()
  appendToast: boolean = false;

  @Prop()
  duration: number = 5000;

  @Prop()
  noAnimation: boolean = false;

  @Prop()
  noHoverPause: boolean = false;

  @Prop()
  persistent: boolean = false;

  @Prop()
  svgIcon?: string;

  @Prop()
  headerClass?: string;

  @Prop()
  bodyClass?: string;

  @Prop()
  isStatus: boolean = false;

  @Prop()
  noCloseButton: boolean = false;

  @Prop()
  toastTitle?: string;

  @Prop()
  message?: string;

  @Prop()
  maxWidth: number | string = 350;

  @Prop()
  additionalHeaderContent?: any;

  @Prop()
  contentHtml?: string;

  @Prop({ attribute: 'aria-label' })
  ariaLabel: string = 'Notifications';

  @Prop()
  focusOnShow: boolean = false;

  /**
   * Declarative render-only toast data for documentation, testing, and visual
   * previews. When supplied, runtime toast lifecycle behavior is disabled.
   */
  @Prop()
  previewToasts?: ToastPreviewItem[];

  @State()
  private toasts: ToastItem[] = [];

  private nextToastId = 0;

  disconnectedCallback(): void {
    this.toasts.forEach(toast => {
      this.clearHideTimeout(toast);
    });
  }

  @Method()
  async showToast(options: Partial<Omit<ToastItem, 'id' | 'state' | 'hideTimeout'>> = {}): Promise<number> {
    const id = this.generateToastId();

    const toast: ToastItem = {
      id,

      content: options.content ?? this.message ?? '',

      contentHtml: options.contentHtml ?? this.contentHtml,

      additionalHdrContent: options.additionalHdrContent ?? this.additionalHeaderContent,

      variantClass: options.variantClass ?? this.variant,

      duration: options.duration ?? this.duration,

      svgIcon: options.svgIcon ?? this.svgIcon,

      persistent: options.persistent ?? this.persistent,

      toastTitle: options.toastTitle ?? this.toastTitle,

      noCloseButton: options.noCloseButton ?? this.noCloseButton,

      bodyClass: options.bodyClass ?? this.bodyClass,

      headerClass: options.headerClass ?? this.headerClass,

      isStatus: options.isStatus ?? this.isStatus,

      noHoverPause: options.noHoverPause ?? this.noHoverPause,

      state: 'fade',
    };

    this.toasts = this.appendToast ? [...this.toasts, toast] : [toast, ...this.toasts];

    window.setTimeout(
      () => {
        const currentToast = this.findToast(id);

        if (!currentToast) {
          return;
        }

        currentToast.state = 'show';

        this.toasts = [...this.toasts];

        if (this.focusOnShow) {
          requestAnimationFrame(() => {
            this.focusToast(id);
          });
        }
      },
      this.noAnimation ? 0 : 10,
    );

    if (!toast.persistent) {
      this.startHideTimer(toast);
    }

    return id;
  }

  @Method()
  async startRemoveToast(id: number): Promise<void> {
    const toast = this.findToast(id);

    if (!toast) {
      return;
    }

    this.clearHideTimeout(toast);

    if (this.noAnimation) {
      await this.removeToast(id);

      return;
    }

    toast.state = 'fade';

    this.toasts = [...this.toasts];

    window.setTimeout(() => {
      void this.removeToast(id);
    }, 500);
  }

  @Method()
  async removeToast(id: number): Promise<void> {
    const toast = this.findToast(id);

    if (toast) {
      this.clearHideTimeout(toast);
    }

    this.toasts = this.toasts.filter(item => item.id !== id);
  }

  @Listen('keydown')
  onKeyDown(event: KeyboardEvent): void {
    if (this.isPreviewMode() || event.key !== 'Escape') {
      return;
    }

    const target = event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    const toastElement = target.closest('[data-toast-id]') as HTMLElement | null;

    if (!toastElement) {
      return;
    }

    const idValue = toastElement.getAttribute('data-toast-id');

    const id = idValue ? Number(idValue) : Number.NaN;

    if (!Number.isFinite(id)) {
      return;
    }

    event.preventDefault();

    void this.startRemoveToast(id);
  }

  private isPreviewMode(): boolean {
    return this.previewToasts !== undefined;
  }

  private getRenderedToasts(): ToastItem[] {
    if (!this.isPreviewMode()) {
      return this.toasts;
    }

    return (this.previewToasts ?? []).map((preview, index) => ({
      id: index + 1,

      content: preview.content ?? this.message ?? '',

      contentHtml: preview.contentHtml ?? this.contentHtml,

      additionalHdrContent: preview.additionalHdrContent ?? this.additionalHeaderContent,

      variantClass: preview.variantClass ?? this.variant,

      duration: preview.duration ?? this.duration,

      svgIcon: preview.svgIcon ?? this.svgIcon,

      persistent: preview.persistent ?? this.persistent,

      toastTitle: preview.toastTitle ?? this.toastTitle,

      noCloseButton: preview.noCloseButton ?? this.noCloseButton,

      bodyClass: preview.bodyClass ?? this.bodyClass,

      headerClass: preview.headerClass ?? this.headerClass,

      isStatus: preview.isStatus ?? this.isStatus,

      noHoverPause: true,

      state: 'show',
    }));
  }

  private generateToastId(): number {
    this.nextToastId += 1;

    return Date.now() * 1000 + this.nextToastId;
  }

  private findToast(id: number): ToastItem | undefined {
    return this.toasts.find(toast => toast.id === id);
  }

  private startHideTimer(toast: ToastItem): void {
    this.clearHideTimeout(toast);

    toast.hideTimeout = window.setTimeout(() => {
      toast.hideTimeout = undefined;

      void this.startRemoveToast(toast.id);
    }, toast.duration);
  }

  private clearHideTimeout(toast: ToastItem): void {
    if (toast.hideTimeout == null) {
      return;
    }

    window.clearTimeout(toast.hideTimeout);

    toast.hideTimeout = undefined;
  }

  private focusToast(id: number): void {
    const contentId = this.getToastContentId(id);

    const content = Array.from(this.host.querySelectorAll<HTMLElement>('[id]')).find(element => element.id === contentId);

    content?.focus();
  }

  private handleMouseEnter = (toast: ToastItem): void => {
    if (this.isPreviewMode() || toast.noHoverPause) {
      return;
    }

    this.clearHideTimeout(toast);
  };

  private handleMouseLeave = (toast: ToastItem): void => {
    if (this.isPreviewMode() || toast.noHoverPause || toast.persistent || toast.hideTimeout) {
      return;
    }

    this.startHideTimer(toast);
  };

  private getMaxWidthStyle(): Record<string, string> {
    if (typeof this.maxWidth === 'number') {
      return {
        maxWidth: `${this.maxWidth}px`,
      };
    }

    const value = this.maxWidth.trim();

    if (!value) {
      return {
        maxWidth: '350px',
      };
    }

    if (/^\d+(\.\d+)?$/.test(value)) {
      return {
        maxWidth: `${value}px`,
      };
    }

    return {
      maxWidth: value,
    };
  }

  private getToastOuterId(id: number): string {
    return `${this.toastId}__toast_${id}__outer`;
  }

  private getToastContentId(id: number): string {
    return `${this.toastId}__toast_${id}__content`;
  }

  private getToastTitleId(id: number): string {
    return `${this.toastId}__toast_${id}__title`;
  }

  private getToastBodyId(id: number): string {
    return `${this.toastId}__toast_${id}__body`;
  }

  private getToastCloseId(id: number): string {
    return `${this.toastId}__toast_${id}__close`;
  }

  private getToastRole(toast: ToastItem): 'status' | 'alert' {
    return toast.isStatus ? 'status' : 'alert';
  }

  private getAnimationStyle(toast: ToastItem): Record<string, string> | undefined {
    if (this.noAnimation || this.isPreviewMode()) {
      return undefined;
    }

    return {
      '--toast-duration': `${toast.duration / 1000}s`,
    };
  }

  private renderCloseButton(toast: ToastItem, className = 'close ml-auto m1') {
    if (toast.noCloseButton) {
      return null;
    }

    const label = toast.toastTitle ? `Close ${toast.toastTitle}` : 'Close notification';

    return (
      <button
        id={this.getToastCloseId(toast.id)}
        type="button"
        class={className}
        aria-label={label}
        aria-controls={this.getToastOuterId(toast.id)}
        onClick={this.isPreviewMode() ? undefined : () => this.startRemoveToast(toast.id)}
      >
        ×
      </button>
    );
  }

  private renderIcon(toast: ToastItem, className = 'toast-svg flex-shrink-0 me-2') {
    if (!toast.svgIcon) {
      return null;
    }

    const icon = ICONS[toast.svgIcon];

    if (!icon) {
      return null;
    }

    return (
      <svg class={className} viewBox={icon.viewBox} aria-hidden="true" focusable="false">
        <path d={icon.path} />
      </svg>
    );
  }

  private renderToastBody(toast: ToastItem, extraClasses = '', prefixContent?: any) {
    const bodyId = this.getToastBodyId(toast.id);

    const classes = ['toast-body', extraClasses, toast.bodyClass || ''].filter(Boolean).join(' ');

    if (toast.contentHtml) {
      return (
        <div id={bodyId} class={classes}>
          {prefixContent}

          <div class="toast-body-content" innerHTML={toast.contentHtml}></div>
        </div>
      );
    }

    return (
      <div id={bodyId} class={classes}>
        {prefixContent}

        {toast.content}
      </div>
    );
  }

  private renderScreenReaderTitle(toast: ToastItem) {
    return (
      <span id={this.getToastTitleId(toast.id)} class="sr-only">
        {toast.toastTitle || 'Notification'}
      </span>
    );
  }

  private renderStandardToast(toast: ToastItem) {
    const classes = [
      'toast',
      'toast-solid',
      this.noAnimation || this.isPreviewMode() ? '' : 'fade',
      toast.state,
      toast.persistent ? 'persistent' : '',
      toast.variantClass ? `toast-${toast.variantClass}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const outerId = this.getToastOuterId(toast.id);

    const contentId = this.getToastContentId(toast.id);

    const titleId = this.getToastTitleId(toast.id);

    const bodyId = this.getToastBodyId(toast.id);

    return (
      <div
        id={outerId}
        data-toast-id={String(toast.id)}
        role={this.getToastRole(toast)}
        aria-atomic="true"
        aria-labelledby={toast.toastTitle ? titleId : undefined}
        aria-describedby={bodyId}
        class={classes}
        style={this.getAnimationStyle(toast)}
        onMouseEnter={this.isPreviewMode() ? undefined : () => this.handleMouseEnter(toast)}
        onMouseLeave={this.isPreviewMode() ? undefined : () => this.handleMouseLeave(toast)}
      >
        <div id={contentId} tabIndex={0}>
          <header class={['toast-header', toast.headerClass || ''].filter(Boolean).join(' ')}>
            <div class="d-flex flex-grow-1 align-items-center">
              {this.renderIcon(toast)}

              {toast.toastTitle ? (
                <strong id={titleId} class="mr-auto">
                  {toast.toastTitle}
                </strong>
              ) : (
                this.renderScreenReaderTitle(toast)
              )}

              {toast.additionalHdrContent ? <small class="additional-text text-muted mr-2">{toast.additionalHdrContent}</small> : null}
            </div>

            {this.renderCloseButton(toast)}
          </header>

          {this.renderToastBody(toast)}
        </div>
      </div>
    );
  }

  private renderSolidToast(toast: ToastItem) {
    const classes = [
      'toast',
      'align-items-center',
      toast.variantClass ? 'border-0' : '',
      this.noAnimation || this.isPreviewMode() ? '' : 'fade',
      toast.state,
      toast.persistent ? 'persistent' : '',
      toast.variantClass ? `text-bg-${toast.variantClass}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const outerId = this.getToastOuterId(toast.id);

    const contentId = this.getToastContentId(toast.id);

    const titleId = this.getToastTitleId(toast.id);

    const bodyId = this.getToastBodyId(toast.id);

    return (
      <div
        id={outerId}
        data-toast-id={String(toast.id)}
        class={classes}
        style={this.getAnimationStyle(toast)}
        role={this.getToastRole(toast)}
        aria-atomic="true"
        aria-labelledby={toast.toastTitle ? titleId : undefined}
        aria-describedby={bodyId}
        onMouseEnter={this.isPreviewMode() ? undefined : () => this.handleMouseEnter(toast)}
        onMouseLeave={this.isPreviewMode() ? undefined : () => this.handleMouseLeave(toast)}
      >
        <div id={contentId} class="toast-solid-content" tabIndex={0}>
          {this.renderScreenReaderTitle(toast)}

          {this.renderToastBody(toast, 'd-flex align-items-center', this.renderIcon(toast))}

          {toast.noCloseButton ? null : this.renderCloseButton(toast, 'close mr-2 ml-auto')}
        </div>
      </div>
    );
  }

  private renderToaster() {
    const trayClass = ['toaster', `toaster-${this.position}`].join(' ');

    const renderedToasts = this.getRenderedToasts();

    return (
      <div id={`toaster-${this.position}`} class={trayClass} role="region" aria-label={this.ariaLabel} aria-relevant="additions text" aria-atomic="false">
        <div class="toaster-slot" style={this.getMaxWidthStyle()}>
          {renderedToasts.map(toast => (this.solidToast ? this.renderSolidToast(toast) : this.renderStandardToast(toast)))}
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.renderToaster()}</div>;
  }
}
