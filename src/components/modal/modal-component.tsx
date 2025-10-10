// src/components/modal/modal-component.tsx
import { Component, h, Prop, Element, Method } from '@stencil/core';
// ✅ Import the Modal class directly from Bootstrap ESM
import Modal from 'bootstrap/js/dist/modal';

@Component({
  tag: 'modal-component',
  styleUrls: ['modal.scss', '../button/button.scss'],
  shadow: false,
})
export class ModalComponent {
  @Element() host!: HTMLElement;

  // Button Props
  @Prop() ariaLabel: string = '';
  @Prop() block: boolean = false;
  @Prop() btnText = 'Launch demo modal';
  @Prop() cancelCloseBtn: string = 'Close';
  @Prop() classNames: string = '';
  @Prop() disabled: boolean = false;
  @Prop() link: boolean = false;
  @Prop() outlined: boolean = false;
  @Prop() ripple: boolean = false;
  @Prop() size: string = '';
  @Prop() shape: string = '';
  @Prop() titleAttr: string = '';
  @Prop() variant = '';

  // Modal Props
  @Prop() modalId?: string;
  @Prop() modalTitle = 'Modal title';
  @Prop({ reflect: true }) modalSize?: 'sm' | 'lg' | 'xl';
  @Prop({ reflect: true }) modalFullScreen?: 'fullscreen' | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
  @Prop() scrollableBody: boolean = false;
  @Prop() scrollLongContent: boolean = false;
  @Prop() verticallyCentered: boolean = false;

  private modalEl?: HTMLDivElement;
  private modalInstance?: Modal;
  private lastTrigger?: HTMLElement;

  private get id() {
    return this.modalId || `modal-component-${Math.random().toString(36).slice(2, 9)}`;
  }

  // ✅ Instantiate once, after the element exists in the DOM
  componentDidLoad() {
    if (!this.modalEl) return;

    this.modalInstance = new Modal(this.modalEl, { backdrop: true, keyboard: true, focus: true });

    // During hide: blur anything focused inside and temporarily set inert
    this.modalEl.addEventListener('hide.bs.modal', () => {
      const ae = document.activeElement as HTMLElement | null;
      if (ae && this.modalEl!.contains(ae)) ae.blur();
      this.modalEl!.setAttribute('inert', '');
    });

    // After fully hidden: remove inert and return focus to the trigger
    this.modalEl.addEventListener('hidden.bs.modal', () => {
      this.modalEl!.removeAttribute('inert');
      this.lastTrigger?.focus?.();
    });

    // After fully shown: ensure dialog/focus is safe
    this.modalEl.addEventListener('shown.bs.modal', () => {
      (this.modalEl!.querySelector('.modal-dialog') as HTMLElement)?.focus?.();
    });
  }

  disconnectedCallback() {
    // ✅ Clean up when removed
    try {
      (this.modalInstance as any)?.dispose?.();
    } catch {}
    this.modalInstance = undefined;
  }

  /** Open programmatically */
  @Method() async open() {
    this.modalInstance?.show();
  }

  /** Close programmatically */
  @Method() async close() {
    // Important: blur focus inside the modal before hide
    const ae = document.activeElement as HTMLElement | null;
    if (ae && this.modalEl?.contains(ae)) ae.blur();
    this.modalInstance?.hide();
  }

  private onTriggerClick = (e: MouseEvent) => {
    this.lastTrigger = e.currentTarget as HTMLElement;
    this.open();
  };

  render() {
    const id = this.id;

    const classList = [
      'btn',
      this.block && 'btn--block',
      this.classNames,
      this.link && 'link',
      this.outlined ? `btn-outline-${this.variant}` : '',
      !this.outlined && this.variant ? `btn-${this.variant}` : '',

      this.size && `btn-${this.size}`,
      this.shape && `btn-${this.shape}`,
      this.ripple && 'btn-ripple',
    ]
      .filter(Boolean)
      .join(' ');

    const computedAriaLabel =
      (this.ariaLabel && this.ariaLabel.trim()) ||
      // (hasVisibleText ? this.btnText.trim() : '') ||
      (this.titleAttr && this.titleAttr.trim()) ||
      'Button';

    const buttonProps = {
      'aria-label': computedAriaLabel,
      'aria-disabled': this.link && this.disabled ? 'true' : undefined,
      'class': classList,
      'disabled': !this.link && this.disabled,
    };

    return (
      <div class="modal-component-wrapper">
        {/* Trigger button */}
        <button type="button" role="button" data-bs-toggle="modal" data-bs-target={`#${id}`} {...(buttonProps as any)} onClick={this.onTriggerClick}>
          {this.btnText}
        </button>

        {/* Modal (Bootstrap 5 markup) */}
        <div
          class={`modal fade ${this.scrollLongContent ? ' overflow-x: hidden; overflow-y: auto;' : ''}`}
          id={id}
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-hidden="true"
          role="dialog"
          ref={el => (this.modalEl = el as HTMLDivElement)}
        >
          <div
            class={`modal-dialog ${this.modalSize ? ` modal-${this.modalSize}` : ''}${this.modalFullScreen ? ` modal-${this.modalFullScreen}` : ''}${this.verticallyCentered ? ' modal-dialog-centered' : ''}`}
            tabIndex={-1}
            role="document"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id={`${id}-label`}>
                  {this.modalTitle}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => this.close()} />
              </div>

              <div class={` modal-body ${this.scrollableBody ? ' scrollable' : ''}`}>
                <slot></slot>
              </div>

              <div class="modal-footer">
                <button type="button" class={`btn btn-secondary ${this.size ? `btn-${this.size}` : ''}`} data-bs-dismiss="modal" onClick={() => this.close()}>
                  {this.cancelCloseBtn}
                </button>
                <slot name="footer"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
