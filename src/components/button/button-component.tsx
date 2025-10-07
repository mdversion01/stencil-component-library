import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { logInfo } from '../../utils/log-debug';

@Component({
  tag: 'button-component',
  styleUrl: 'button.scss',
  // styleUrls: ['../../global/global.scss',],
})
export class Button {
  @Prop() absolute: boolean = false;
  @Prop() active: boolean = false;
  @Prop() ariaLabel: string = '';
  @Prop() block: boolean = false;
  @Prop() bottom: string = '';
  @Prop() btnIcon: boolean = false;
  @Prop() btnText: string = '';
  @Prop() classNames: string = '';
  @Prop() disabled: boolean = false;
  @Prop() end: boolean = false;
  @Prop() elevation: string = '';
  @Prop() fixed: boolean = false;
  @Prop() groupBtn: boolean = false;
  @Prop() iconBtn: boolean = false;
  @Prop({ reflect: true }) slotSide: 'left' | 'right' | 'none' = 'none';
  @Prop() styles: string = '';
  @Prop() left: string = '';
  @Prop() link: boolean = false;
  @Prop() outlined: boolean = false;
  @Prop() pressed: boolean | string = false;
  @Prop() right: string = '';
  @Prop() ripple: boolean = false;
  @Prop() shape: string = '';
  @Prop() size: string = '';
  @Prop() start: boolean = false;
  @Prop() stripped: boolean = false;
  @Prop() text: boolean = false;
  @Prop() textBtn: boolean = false;
  @Prop() titleAttr: string = '';
  @Prop() top: string = '';
  @Prop() url: string = '';
  @Prop() variant: string = '';
  @Prop() vertical: boolean = false;
  @Prop() zIndex: string = '';
  @Prop({ mutable: true }) isOpen: boolean = false;
  @Prop() targetId: string = '';
  @Prop() accordion: boolean = false;
  @Prop() devMode: boolean = false;

  @Event() customClick: EventEmitter;

  private handleClick() {
    this.customClick.emit();
    logInfo(this.devMode, 'Button', 'Clicked');
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !this.disabled) {
      event.preventDefault();
      this.handleClick();
    }
  };

  private getDynamicStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    if (this.absolute) styles.position = 'absolute';
    if (this.fixed) styles.position = 'fixed';
    if (this.left) styles.left = `${this.left}px`;
    if (this.right) styles.right = `${this.right}px`;
    if (this.top) styles.top = `${this.top}px`;
    if (this.bottom) styles.bottom = `${this.bottom}px`;
    if (this.zIndex) styles['z-index'] = this.zIndex;

    logInfo(this.devMode, 'Button', 'getDynamicStyles()', styles);
    return styles;
  }

  private renderButtonContent() {
    const hasLeft = this.slotSide === 'left';
    const hasRight = this.slotSide === 'right';

    const content = this.btnIcon ? (
      <slot />
    ) : this.iconBtn ? (
      <span class="btn__content">
        <slot />
      </span>
    ) : (
      [
        hasLeft && <slot />,
        <span class={`btn__content ${hasLeft ? 'ms-1' : ''} ${hasRight ? 'me-1' : ''}`}>
          {this.btnText}
          {!hasLeft && !hasRight && <slot />}
        </span>,
        hasRight && <slot />,
      ]
    );

    logInfo(this.devMode, 'Button', 'renderButtonContent()', {
      btnText: this.btnText,
      slotSide: this.slotSide,
      btnIcon: this.btnIcon,
      iconBtn: this.iconBtn,
    });

    return content;
  }

  render() {
    const dynamicStyles = this.getDynamicStyles();
    const isGroup = !!this.groupBtn;
    const buttonGroup = this.vertical ? 'btn-group-vertical' : 'btn-group';
    const placement = this.start ? `${buttonGroup}-start` : this.end ? `${buttonGroup}-end` : 'btn-group__btn';

    const classList = [
      'btn',
      this.classNames,
      this.outlined ? `btn-outline-${this.variant}` : '',
      !this.outlined && this.variant ? `btn-${this.variant}` : '',
      this.block && 'btn--block',
      this.size && `btn-${this.size}`,
      this.shape,
      this.active && 'active',
      isGroup && buttonGroup,
      isGroup && placement,
      this.ripple && 'btn-ripple',
      this.stripped && 'stripped',
      this.iconBtn && 'icon-btn',
      this.link && 'link',
      this.elevation && `elevated-${this.elevation}`,
      this.textBtn && 'text-btn',
      this.text && 'text',
      this.btnIcon && 'btn-icon',
    ]
      .filter(Boolean)
      .join(' ');

    // Accessibility: ensure an aria-label when there is no visible text
    const hasVisibleText = !!(this.btnText && this.btnText.trim().length);
    const computedAriaLabel =
      (this.ariaLabel && this.ariaLabel.trim()) ||
      (hasVisibleText ? this.btnText.trim() : '') ||
      (this.titleAttr && this.titleAttr.trim()) ||
      'Button';

    if (!hasVisibleText && !this.ariaLabel && (this.btnIcon || this.iconBtn) && this.devMode) {
      console.warn(
        '[ButtonComponent] Icon-only button has no `ariaLabel`/text. Setting aria-label="%s".',
        computedAriaLabel
      );
    }

    logInfo(this.devMode, 'Button', 'render()', {
      classList,
      link: this.link,
      disabled: this.disabled,
      slotSide: this.slotSide,
      computedAriaLabel,
    });

    const ariaProps: Record<string, any> = {};
    if (this.accordion && this.targetId) {
      ariaProps['aria-expanded'] = String(this.isOpen);
      ariaProps['aria-controls'] = this.targetId;
    }

    const buttonProps = {
      ...ariaProps,
      'aria-pressed': this.pressed === 'true' || this.pressed === 'false' ? this.pressed : undefined,
      'aria-label': computedAriaLabel,
      'aria-disabled': this.link && this.disabled ? 'true' : undefined,
      style: dynamicStyles,
      class: classList,
      disabled: !this.link && this.disabled,
      onClick: (event: MouseEvent) => {
        if (this.disabled) {
          event.preventDefault();
          return;
        }
        const shouldPrevent = !this.url || this.url === '#' || this.url.trim() === '' || this.url.startsWith('#');
        if (this.link && shouldPrevent) event.preventDefault();
        this.handleClick();
      },
    };

    return this.link ? (
      <a
        {...(buttonProps as any)}
        href={this.url && this.url.trim() !== '' ? this.url : undefined}
        role="button"
        tabindex={this.disabled ? '-1' : '0'}
        onKeyDown={this.disabled ? undefined : this.handleKeyDown}
        title={this.titleAttr}
      >
        {this.renderButtonContent()}
      </a>
    ) : (
      <button {...(buttonProps as any)} type="button" title={this.titleAttr}>
        {this.renderButtonContent()}
      </button>
    );
  }
}
