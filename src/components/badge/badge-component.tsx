import { Component, Prop, h, Element, Event, EventEmitter } from '@stencil/core';
import { buildBadgeClass } from '../../utils/buildBadgeClass';
import { renderTokenSpan } from '../../utils/render.helpers';
import { logInfo } from '../../utils/log-debug';

@Component({
  tag: 'badge-component',
  styleUrls: ['badge.scss',],
  shadow: false,
})
export class Badge {
  @Element() el: HTMLElement;

  @Event({ bubbles: true }) customClick: EventEmitter;

  @Prop() absolute: boolean = false;
  @Prop() ariaLabelledby?: string;
  @Prop() ariaDescribedby?: string;
  @Prop() bdgPosition: string = '';
  @Prop() backgroundColor: string = '';
  @Prop() bordered: boolean = false;
  @Prop() bottom: string = '';
  @Prop() classNames: string = '';
  @Prop() color: string = '';
  @Prop() disabled: boolean = false;
  @Prop() dot: boolean = false;
  @Prop() elevation: string = '';
  @Prop() icon: boolean = false;
  @Prop() styles: string = '';
  @Prop() inlineStyles: string = '';
  @Prop() inset: boolean = false;
  @Prop() left: string = '';
  @Prop() offsetX: string = '12';
  @Prop() offsetY: string = '12';
  @Prop() outlined: boolean = false;
  @Prop() pulse: boolean = false;
  @Prop() right: string = '';
  @Prop() shape: string = '';
  @Prop() size: string = '';
  @Prop() token: boolean = false;
  @Prop() top: string = '';
  @Prop() variant: string = '';
  @Prop() zIndex: string = '';
  @Prop() label: string = 'Badge';

  @Prop() devMode: boolean = false;


  private getDynamicStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.color) styles.color = this.color;
    if (this.backgroundColor) styles.backgroundColor = this.backgroundColor;
    if (this.absolute) styles.position = 'absolute';
    if (this.left) styles.left = `${this.left}px`;
    if (this.right) styles.right = `${this.right}px`;
    if (this.top) styles.top = `${this.top}px`;
    if (this.bottom) styles.bottom = `${this.bottom}px`;
    if (this.zIndex) styles.zIndex = this.zIndex;
    if (this.inset) {
      styles.inset = `auto auto calc(100% - ${this.offsetX}px) calc(100% - ${this.offsetY}px)`;
    }

    logInfo(this.devMode, 'Badge', 'getDynamicStyles()', styles);
    return styles;
  }

  private parseInlineStyles(styles: string): { [key: string]: string } {
    const parsed = styles.split(';').reduce((acc, style) => {
      const [key, value] = style.split(':').map(s => s.trim());
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as { [key: string]: string });

    logInfo(this.devMode, 'Badge', 'parseInlineStyles()', parsed);
    return parsed;
  }

  private renderBadgeToken() {
    const tokenClass = buildBadgeClass({
      base: 'badge__token',
      elevation: this.elevation,
      outlined: this.outlined,
      variant: this.variant ? 'bg-' + this.variant : 'bg-primary',
      size: this.size,
      shape: this.shape,
      bordered: this.bordered,
      classNames: this.classNames,
    });

    const wrapperClass = buildBadgeClass({
      base: 'badge__token-wrapper',
      variant: this.variant,
      size: this.size,
      shape: this.shape,
      outlined: this.outlined,
      bordered: this.bordered,
      classNames: this.classNames,
    });

    const combinedStyles = {
      ...this.getDynamicStyles(),
      ...this.parseInlineStyles(this.inlineStyles),
    };

    logInfo(this.devMode, 'Badge', 'renderBadgeToken()', {
      tokenClass,
      wrapperClass,
      combinedStyles,
      ariaLabelledby: this.ariaLabelledby,
      ariaDescribedby: this.ariaDescribedby,
    });

    return (
      <div class={wrapperClass} aria-disabled={this.disabled ? 'true' : 'false'}>
        <slot />
        <span class="badge__wrapper">
          {renderTokenSpan({
            className: tokenClass,
            styles: combinedStyles,
            ariaLabel: this.label,
            ariaLabelledby: this.ariaLabelledby,
            ariaDescribedby: this.ariaDescribedby,
          })}
        </span>
      </div>
    );
  }

  private renderDotBadge() {
    const tokenClass = buildBadgeClass({
      base: 'badge--dot',
      elevation: this.elevation,
      variant: this.variant ? 'bg-' + this.variant : 'bg-danger',
      size: this.size,
      shape: this.shape,
      pulse: this.pulse,
      bordered: this.bordered,
      classNames: this.classNames,
    });

    const wrapperClass = buildBadgeClass({
      base: 'badge__token-wrapper',
      variant: this.variant,
      size: this.size,
      shape: this.shape,
      outlined: this.outlined,
      bordered: this.bordered,
      classNames: this.classNames,
    });

    const combinedStyles = {
      ...this.getDynamicStyles(),
      ...this.parseInlineStyles(this.inlineStyles),
    };

    return (
      <div class={wrapperClass} aria-disabled={this.disabled ? 'true' : 'false'}>
        <slot />
        <span class="badge__wrapper">
          {renderTokenSpan({
            className: tokenClass,
            styles: combinedStyles,
            ariaLabel: this.label,
            ariaLabelledby: this.ariaLabelledby,
            ariaDescribedby: this.ariaDescribedby,
          })}
        </span>
      </div>
    );
  }

  private renderPositionedBadge(classAttr: string) {
    return (
      <div
        class={`${classAttr} ${this.bdgPosition === 'left' ? 'me-1' : 'ms-1'}`}
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-hidden={!this.token && !this.dot ? 'true' : null}
        aria-labelledby={this.ariaLabelledby}
        aria-describedby={this.ariaDescribedby}
      >
        <slot />
      </div>
    );
  }

  private renderDefaultBadge(classAttr: string) {
    return (
      <div
        class={classAttr}
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-hidden={!this.token && !this.dot ? 'true' : null}
        aria-labelledby={this.ariaLabelledby}
        aria-describedby={this.ariaDescribedby}
        style={this.parseInlineStyles(this.inlineStyles)}
      >
        <slot />
        {this.icon && (
          <span class="icon">
            <slot name="icon" />
          </span>
        )}
      </div>
    );
  }

  render() {
    const classAttr = buildBadgeClass({
      base: this.token ? 'badge__badge' : 'badge',
      outlined: this.outlined,
      variant: this.backgroundColor ? '' : this.variant ? 'bg-' + this.variant : 'bg-secondary',
      backgroundColor: this.variant ? '' : this.backgroundColor,
      elevation: this.elevation,
      size: this.size,
      shape: this.shape === 'pill' ? 'rounded-pill' : this.shape === 'square' ? 'square' : '',
      bordered: this.bordered,
      classNames: this.classNames,
    });

    logInfo(this.devMode, 'Badge', 'render() decision tree', {
      token: this.token,
      dot: this.dot,
      bdgPosition: this.bdgPosition,
      classAttr,
    });

    if (this.token) return this.renderBadgeToken();
    if (this.dot) return this.renderDotBadge();
    if (this.bdgPosition) return this.renderPositionedBadge(classAttr);
    return this.renderDefaultBadge(classAttr);
  }
}
