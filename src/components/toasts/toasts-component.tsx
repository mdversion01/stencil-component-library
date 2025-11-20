// src/components/toasts/toasts-component.tsx
import { Component, h, Prop, State, Method, Element } from '@stencil/core';

export type ToastVariant = '' | 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning' | 'dark' | 'light';

// ✅ export so components.d.ts can see it
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Avoid JSX.Element in public types; use `any`
export interface ToastItem {
  id: number;
  content?: string | any; // plain text / JSX
  contentHtml?: string; // trusted HTML, rendered via innerHTML
  additionalHdrContent?: string | any;
  variantClass: ToastVariant | '';
  duration: number;
  svgIcon?: string;
  persistent?: boolean;
  toastTitle?: string;
  time?: string;
  noCloseButton?: boolean;
  iconPlumageStyle?: boolean;
  bodyClass?: string;
  headerClass?: string;
  isStatus?: boolean;
  noHoverPause?: boolean;
  state: '' | 'fade' | 'show';
  hideTimeout?: any;
}

@Component({
  tag: 'toasts-component',
  styleUrls: ['toasts-styles.scss', '../utilities-styles.scss'],
  shadow: false,
})
export class ToastsComponent {
  @Element() host!: HTMLElement;

  /** (Optional) id used inside nested elements; does not override the host element id */
  @Prop() toastId: string = 'toast-component';

  /** Where the toaster tray is anchored. */
  @Prop({ reflect: true }) position: ToastPosition = 'bottom-right';

  /** Variant color for new toasts (can be overridden per-toast via showToast opts). */
  @Prop() variant: ToastVariant = '';

  /** If true, use the “solid” toast style (Bootstrap-like) instead of bordered. */
  @Prop() solidToast: boolean = false;

  /** If true, use the Plumage toast style. */
  @Prop() plumageToast: boolean = false;

  /** If true with plumageToast, render the “max” layout. */
  @Prop() plumageToastMax: boolean = false;

  /** If true, new toasts append to the end; otherwise they prepend (newest on top). */
  @Prop() appendToast: boolean = false;

  /** Default lifespan in ms for auto-dismiss toasts. */
  @Prop() duration: number = 5000;

  /** Disable fade-in/out transitions globally. */
  @Prop() noAnimation: boolean = false;

  /** Prevent hover from pausing auto-hide globally. */
  @Prop() noHoverPause: boolean = false;

  /** Make toasts persistent by default (no auto-hide). */
  @Prop() persistent: boolean = false;

  /** Default icon symbol id (from the inline sprite) for new toasts. */
  @Prop() svgIcon?: string;

  /** Default header/body helper classes. */
  @Prop() headerClass?: string;
  @Prop() bodyClass?: string;

  /** When true, use polite/status instead of alert/assertive on aria-live for new toasts. */
  @Prop() isStatus: boolean = false;

  /** If true, hide the × close button by default. */
  @Prop() noCloseButton: boolean = false;

  /** If true, use the “plumage icon” layout on compact plumage variant. */
  @Prop() iconPlumageStyle: boolean = false;

  /** Optional default title for new toasts. (Renamed from reserved `title`.) */
  @Prop() toastTitle?: string;

  /** Optional default message for simple string-only toasts. */
  @Prop() message?: string;

  /** Optional header content (string/JSX) appearing next to the title (e.g., timestamp). */
  @Prop() additionalHeaderContent?: any;

  /** Optional custom content for the body (string/JSX). Prefer using slots in apps. */
  @Prop() customContent?: any;

  /** Default time label (ZULU). */
  @Prop() time: string = ToastsComponent.getCurrentZuluTime();

  /** Internal list of active toasts. */
  @State() private toasts: ToastItem[] = [];

  // ---------- Public API ----------

  /** Show a toast. Returns the id of the created toast. */
  @Method()
  async showToast(opts: Partial<Omit<ToastItem, 'id' | 'state'>> = {}): Promise<number> {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    const content: string | any = (opts && opts.content) ?? this.customContent ?? this.message ?? '';

    const contentHtml: string | undefined = opts?.contentHtml;

    const additionalHdr = (opts && opts.additionalHdrContent) ?? this.additionalHeaderContent;

    const variantClass: ToastVariant | '' = (opts && (opts.variantClass as ToastVariant)) ?? this.variant ?? '';

    const toast: ToastItem = {
      id,
      content,
      contentHtml,
      additionalHdrContent: additionalHdr,
      variantClass,
      duration: (opts && opts.duration) ?? this.duration,
      svgIcon: (opts && opts.svgIcon) ?? this.svgIcon,
      persistent: (opts && opts.persistent) ?? this.persistent,
      toastTitle: (opts && opts.toastTitle) ?? this.toastTitle,
      time: (opts && opts.time) ?? this.time,
      noCloseButton: (opts && opts.noCloseButton) ?? this.noCloseButton,
      iconPlumageStyle: (opts && opts.iconPlumageStyle) ?? this.iconPlumageStyle,
      bodyClass: (opts && opts.bodyClass) ?? this.bodyClass,
      headerClass: (opts && opts.headerClass) ?? this.headerClass,
      isStatus: (opts && opts.isStatus) ?? this.isStatus,
      noHoverPause: (opts && opts.noHoverPause) ?? this.noHoverPause,
      state: 'fade',
    };

    this.toasts = this.appendToast ? [...this.toasts, toast] : [toast, ...this.toasts];

    setTimeout(
      () => {
        toast.state = 'show';
        this.toasts = [...this.toasts];
      },
      this.noAnimation ? 0 : 10,
    );

    if (!toast.persistent) {
      toast.hideTimeout = setTimeout(() => this.startRemoveToast(id), toast.duration);
    }

    return id;
  }

  /** Start fade-out, then remove. */
  @Method()
  async startRemoveToast(id: number): Promise<void> {
    const idx = this.toasts.findIndex(t => t.id === id);
    if (idx < 0) return;

    if (!this.noAnimation) {
      this.toasts[idx].state = 'fade';
      this.toasts = [...this.toasts];
      setTimeout(() => this.removeToast(id), 500);
    } else {
      this.removeToast(id);
    }
  }

  /** Remove toast immediately. */
  @Method()
  async removeToast(id: number): Promise<void> {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  // ---------- Internals ----------

  private static getCurrentZuluTime(): string {
    const now = new Date();
    return now.toISOString().substring(11, 19) + 'Z'; // HH:MM:SSZ
  }

  private handleMouseEnter = (toast: ToastItem) => {
    if (!toast.noHoverPause && toast.hideTimeout) {
      clearTimeout(toast.hideTimeout);
      toast.hideTimeout = undefined;
    }
  };

  private handleMouseLeave = (toast: ToastItem) => {
    if (!toast.noHoverPause && !toast.persistent && !toast.hideTimeout) {
      toast.hideTimeout = setTimeout(() => this.startRemoveToast(toast.id), toast.duration);
    }
  };

  private getIconColor(variant?: ToastVariant | ''): string {
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

  // ---------- Renderers ----------

  private renderSvgSprite() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="check-circle-fill" viewBox="0 0 22 22">
          <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
        </symbol>
        <symbol id="check-circle-outline" viewBox="0 0 22 22">
          <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z" />
        </symbol>
        <symbol id="info-fill" viewBox="0 0 22 22">
          <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </symbol>
        <symbol id="info-outlined" viewBox="0 0 22 22">
          <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
        </symbol>
        <symbol id="exclamation-triangle-fill" viewBox="0 0 22 22">
          <path d="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z" />
        </symbol>
        <symbol id="exclamation-triangle-outline" viewBox="0 0 22 22">
          <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
        </symbol>
        <symbol id="exclamation-circle-fill" viewBox="0 0 22 22">
          <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </symbol>
        <symbol id="exclamation-circle-outline" viewBox="0 0 22 22">
          <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
        </symbol>
      </svg>
    );
  }

  private renderStandardToast(toast: ToastItem) {
    const classes = [
      'toast',
      'toast-solid',
      this.noAnimation ? '' : 'fade',
      toast.state,
      toast.persistent ? 'persistent' : '',
      toast.variantClass ? `toast-${toast.variantClass}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const style = this.noAnimation ? undefined : ({ '--toast-duration': `${toast.duration / 1000}s` } as any);

    return (
      <div
        id={`${this.toastId}__toast_outer`}
        role={toast.isStatus ? 'status' : 'alert'}
        aria-live={toast.isStatus ? 'polite' : 'assertive'}
        aria-atomic="true"
        class={classes}
        style={style}
        onMouseEnter={() => this.handleMouseEnter(toast)}
        onMouseLeave={() => this.handleMouseLeave(toast)}
      >
        <div id={this.toastId} tabIndex={0}>
          <header class={`toast-header ${toast.headerClass || ''}`}>
            <div class="d-flex flex-grow-1 align-items-center">
              {toast.svgIcon ? (
                <svg class="toast-svg flex-shrink-0 me-2" role="img" aria-label="Icon" style={{ fill: 'currentColor' }}>
                  <use href={`#${toast.svgIcon}`}></use>
                </svg>
              ) : null}
              <strong class="mr-auto">{toast.toastTitle}</strong>
              <small class="text-muted mr-2">{toast.additionalHdrContent}</small>
            </div>

            {toast.noCloseButton ? null : (
              <button type="button" aria-label="Close" class="close ml-auto m1" onClick={() => this.startRemoveToast(toast.id)}>
                ×
              </button>
            )}
          </header>

          {toast.contentHtml ? (
            <div class={`toast-body ${toast.bodyClass || ''}`} innerHTML={toast.contentHtml}></div>
          ) : (
            <div class={`toast-body ${toast.bodyClass || ''}`}>{toast.content}</div>
          )}
        </div>
      </div>
    );
  }

  private renderSolidToast(toast: ToastItem) {
    const classes = [
      'toast',
      'align-items-center',
      'border-0',
      'fade',
      toast.state,
      toast.persistent ? 'persistent' : '',
      toast.variantClass ? `text-bg-${toast.variantClass}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const style = { '--toast-duration': `${toast.duration / 1000}s` } as any;

    return (
      <div
        class={classes}
        style={style}
        role={toast.isStatus ? 'status' : 'alert'}
        aria-live={toast.isStatus ? 'polite' : 'assertive'}
        aria-atomic="true"
        onMouseEnter={() => this.handleMouseEnter(toast)}
        onMouseLeave={() => this.handleMouseLeave(toast)}
      >
        <div class="d-flex">
          {toast.contentHtml ? (
            <div class={`toast-body d-flex align-items-center ${toast.bodyClass || ''}`} innerHTML={toast.contentHtml}></div>
          ) : (
            <div class={`toast-body d-flex align-items-center ${toast.bodyClass || ''}`}>
              {toast.svgIcon ? (
                <svg class="toast-svg flex-shrink-0 me-2" role="img" aria-label="Icon" style={{ fill: 'currentColor' }}>
                  <use href={`#${toast.svgIcon}`}></use>
                </svg>
              ) : null}
              {toast.content}
            </div>
          )}

          {toast.noCloseButton ? null : (
            <button type="button" aria-label="Close" class="close mr-2 ml-auto" onClick={() => this.startRemoveToast(toast.id)}>
              ×
            </button>
          )}
        </div>
      </div>
    );
  }

  private renderPlumageToast(toast: ToastItem) {
    const classes = ['pl-toast', 'fade', toast.state, toast.persistent ? 'persistent' : '', toast.variantClass ? `toast-${toast.variantClass}` : ''].filter(Boolean).join(' ');

    const style = { '--toast-duration': `${toast.duration / 1000}s` } as any;

    if (this.plumageToastMax) {
      return (
        <div
          id={`${this.toastId}__toast_outer`}
          role={toast.isStatus ? 'status' : 'alert'}
          aria-live={toast.isStatus ? 'polite' : 'assertive'}
          aria-atomic="true"
          class={classes}
          style={style}
          onMouseEnter={() => this.handleMouseEnter(toast)}
          onMouseLeave={() => this.handleMouseLeave(toast)}
        >
          <div class="pl-toast-2" id={this.toastId} tabIndex={0}>
            <div class="pl-toast-body">
              <div title="" class="pl-toast-content d-flex">
                <div class="align-self-center">
                  <div class="pl-toast-icon">
                    {toast.svgIcon ? (
                      <svg class="toast-svg flex-shrink-0 me-2" role="img" aria-label="Icon" style={{ fill: this.getIconColor(toast.variantClass) }}>
                        <use href={`#${toast.svgIcon}`}></use>
                      </svg>
                    ) : null}
                  </div>
                </div>
                <div class="toast-title w-100">
                  <div class="d-flex justify-content-between">
                    <div class={`header ${toast.headerClass || ''}`}>{toast.toastTitle}</div>
                    <div class="toast-buttons d-flex">
                      {toast.noCloseButton ? null : (
                        <button type="button" aria-label="Close" class="close ml-3" onClick={() => this.startRemoveToast(toast.id)}>
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                  <div class={`d-flex flex-column toast-data ${toast.bodyClass || ''}`}>
                    {toast.contentHtml ? (
                      <div innerHTML={toast.contentHtml}></div>
                    ) : (
                      // Keep slot for backward-compat (if users projected markup before)
                      <slot name="custom-content">{toast.content}</slot>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // compact plumage styles
    return (
      <div
        id={`${this.toastId}__toast_outer`}
        role={toast.isStatus ? 'status' : 'alert'}
        aria-live={toast.isStatus ? 'polite' : 'assertive'}
        aria-atomic="true"
        class={classes}
        style={style}
        onMouseEnter={() => this.handleMouseEnter(toast)}
        onMouseLeave={() => this.handleMouseLeave(toast)}
      >
        <div id={this.toastId} tabIndex={0} class={toast.iconPlumageStyle ? 'pl-toast-display' : ''}>
          {toast.iconPlumageStyle
            ? [
                <div class="pl-toast-icon">
                  {toast.svgIcon ? (
                    <svg class="toast-svg flex-shrink-0 me-2" role="img" aria-label="Icon" style={{ fill: this.getIconColor(toast.variantClass) }}>
                      <use href={`#${toast.svgIcon}`}></use>
                    </svg>
                  ) : null}
                </div>,
                <div class="pl-toast-content">
                  <header class={`pl-toast-header ${toast.headerClass || ''}`}>
                    <div class="d-flex flex-grow-1 align-items-center">
                      <div class="mr-auto mb-0">{toast.toastTitle}</div>
                      <div>{toast.time}</div>
                    </div>
                    {toast.noCloseButton ? null : (
                      <button type="button" aria-label="Close" class="close ml-3" onClick={() => this.startRemoveToast(toast.id)}>
                        ×
                      </button>
                    )}
                  </header>
                  {toast.contentHtml ? (
                    <div class={`pl-toast-body ${toast.bodyClass || ''}`} innerHTML={toast.contentHtml}></div>
                  ) : (
                    <div class={`pl-toast-body ${toast.bodyClass || ''}`}>
                      <em>{toast.content}</em>
                    </div>
                  )}
                </div>,
              ]
            : [
                <header class={`pl-toast-header ${toast.headerClass || ''}`}>
                  <div class="d-flex flex-grow-1 align-items-center">
                    <div class="mr-auto mb-0">{toast.toastTitle}</div>
                    <div>{toast.time}</div>
                  </div>
                  {toast.noCloseButton ? null : (
                    <button type="button" aria-label="Close" class="close ml-3" onClick={() => this.startRemoveToast(toast.id)}>
                      ×
                    </button>
                  )}
                </header>,
                toast.contentHtml ? (
                  <div class={`pl-toast-body ${toast.bodyClass || ''}`} innerHTML={toast.contentHtml}></div>
                ) : (
                  <div class={`pl-toast-body ${toast.bodyClass || ''}`}>
                    <em>{toast.content}</em>
                  </div>
                ),
              ]}
        </div>
      </div>
    );
  }

  private renderBody() {
    const trayClass = (this.plumageToast ? 'pl-toaster' : 'toaster') + ` toaster-${this.position}`;

    return (
      <div id={`toaster-${this.position}`} class={trayClass}>
        <div class="toaster-slot">
          {this.toasts.map(t => (this.solidToast ? this.renderSolidToast(t) : this.plumageToast ? this.renderPlumageToast(t) : this.renderStandardToast(t)))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderSvgSprite()}
        {this.renderBody()}
      </div>
    );
  }
}
