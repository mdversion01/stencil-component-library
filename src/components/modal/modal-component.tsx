// src/components/modal/modal-component.tsx
import { Component, h, Prop, Element, Method, Watch } from '@stencil/core';
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

  // ✅ Stable id per instance (prevents re-renders generating a new id and breaking aria bindings)
  private uid = `modal-component-${Math.random().toString(36).slice(2, 9)}`;
  private resolvedId = this.uid;

  // Background a11y shielding (optional but helps SRs when modal open)
  private ariaHiddenSiblings: HTMLElement[] = [];

  private get id() {
    return this.resolvedId;
  }

  @Watch('modalId')
  onModalIdChange() {
    this.resolvedId = (this.modalId && String(this.modalId).trim()) || this.uid;
  }

  connectedCallback() {
    this.onModalIdChange();
  }

  // ---- a11y helpers ----

  private get labelId() {
    return `${this.id}-label`;
  }

  private get descId() {
    return `${this.id}-desc`;
  }

  private get dialogId() {
    return `${this.id}-dialog`;
  }

  private isOpenNow(): boolean {
    return !!this.modalEl?.classList.contains('show');
  }

  private setSiblingsAriaHidden(on: boolean) {
    // Hide everything except this component while modal is shown.
    // (Prevents SR users from wandering outside the modal.)
    const modalRoot = this.host; // keep this component exposed

    if (!on) {
      this.ariaHiddenSiblings.forEach(el => el.removeAttribute('aria-hidden'));
      this.ariaHiddenSiblings = [];
      return;
    }

    const body = document.body;
    if (!body) return;

    const siblings = Array.from(body.children).filter(
      el => el instanceof HTMLElement && el !== modalRoot && !el.contains(modalRoot),
    ) as HTMLElement[];

    siblings.forEach(el => {
      // Don’t stomp an existing author value
      if (!el.hasAttribute('aria-hidden')) {
        el.setAttribute('aria-hidden', 'true');
        this.ariaHiddenSiblings.push(el);
      }
    });
  }

  // ✅ Instantiate once, after the element exists in the DOM
  componentDidLoad() {
    if (!this.modalEl) return;

    // Ensure initial required ids exist (Bootstrap will toggle aria-hidden at runtime)
    if (!this.modalEl.id) this.modalEl.id = this.id;

    // IMPORTANT: let Bootstrap manage aria-hidden on the .modal element.
    // Do not hardcode aria-hidden="true" in render (it would remain true while open).
    if (!this.modalEl.hasAttribute('aria-hidden')) this.modalEl.setAttribute('aria-hidden', 'true');

    this.modalInstance = new Modal(this.modalEl, {
      backdrop: true,
      keyboard: true,
      focus: true, // Bootstrap handles focus-trap & restoring scroll
    });

    // When shown: shield background from SR + focus the dialog container safely.
    this.modalEl.addEventListener('shown.bs.modal', () => {
      this.setSiblingsAriaHidden(true);

      // Prefer focusing the dialog (it has tabindex=-1)
      const dialog = this.modalEl!.querySelector<HTMLElement>('.modal-dialog');
      dialog?.focus?.();
    });

    // Before hide: blur anything focused inside the modal (prevents focus issues)
    this.modalEl.addEventListener('hide.bs.modal', () => {
      const ae = document.activeElement as HTMLElement | null;
      if (ae && this.modalEl!.contains(ae)) ae.blur();
    });

    // After fully hidden: restore background + return focus to trigger (508 expectation)
    this.modalEl.addEventListener('hidden.bs.modal', () => {
      this.setSiblingsAriaHidden(false);
      this.lastTrigger?.focus?.();
    });
  }

  disconnectedCallback() {
    // ✅ Clean up when removed
    try {
      (this.modalInstance as any)?.dispose?.();
    } catch {}
    this.modalInstance = undefined;
    this.setSiblingsAriaHidden(false);
  }

  /** Open programmatically */
  @Method() async open() {
    // record trigger if focus is currently on something inside the trigger area
    const ae = document.activeElement as HTMLElement | null;
    if (ae && this.host.contains(ae)) this.lastTrigger = ae;

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

  private onTriggerKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return;

    // Native <button> already supports Enter/Space, but this makes behavior
    // consistent even if authors style it like a link, etc.
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.lastTrigger = e.currentTarget as HTMLElement;
      this.open();
    }
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
      (this.titleAttr && this.titleAttr.trim()) ||
      (this.btnText && this.btnText.trim()) ||
      'Open dialog';

    const buttonProps = {
      'aria-label': computedAriaLabel,
      // If link-style, keep button focusable but announce disabled state
      'aria-disabled': this.link && this.disabled ? 'true' : undefined,
      class: classList,
      disabled: !this.link && this.disabled,
      title: this.titleAttr || undefined,
      // Connect trigger to dialog (SR relationship)
      'aria-haspopup': 'dialog',
      'aria-controls': id,
      'aria-expanded': this.isOpenNow() ? 'true' : 'false',
    };

    const modalClass = ['modal', 'fade', this.scrollLongContent ? 'modal-scroll-long' : '']
      .filter(Boolean)
      .join(' ');

    const dialogClass = [
      'modal-dialog',
      this.modalSize ? `modal-${this.modalSize}` : '',
      this.modalFullScreen ? `modal-${this.modalFullScreen}` : '',
      this.verticallyCentered ? 'modal-dialog-centered' : '',
      this.scrollableBody ? 'modal-dialog-scrollable' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div class="modal-component-wrapper">
        {/* Trigger button */}
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#${id}`}
          {...(buttonProps as any)}
          onClick={this.onTriggerClick}
          onKeyDown={this.onTriggerKeydown}
        >
          {this.btnText}
        </button>

        {/* Modal (Bootstrap 5 markup) */}
        <div
          class={modalClass}
          id={id}
          tabIndex={-1}
          // Accessible name + description
          aria-labelledby={this.labelId}
          aria-describedby={this.descId}
          // ✅ Use dialog role + aria-modal
          role="dialog"
          aria-modal="true"
          // DO NOT hardcode aria-hidden here; Bootstrap toggles it.
          ref={el => (this.modalEl = el as HTMLDivElement)}
        >
          <div
            id={this.dialogId}
            class={dialogClass}
            tabIndex={-1}
            role="document"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id={this.labelId}>
                  {this.modalTitle}
                </h5>

                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => this.close()}
                />
              </div>

              {/* Hidden help text so aria-describedby always resolves */}
              <div id={this.descId} class="sr-only">
                {`Dialog: ${this.modalTitle}. Press Escape to close.`}
              </div>

              <div class="modal-body">
                <slot></slot>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class={`btn btn-secondary ${this.size ? `btn-${this.size}` : ''}`}
                  data-bs-dismiss="modal"
                  onClick={() => this.close()}
                >
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
