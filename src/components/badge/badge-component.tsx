// src/components/badge/badge.tsx
import { Component, Prop, h, Element, Event, EventEmitter, Host } from '@stencil/core';
import { buildBadgeClass } from '../../utils/buildBadgeClass';
import { renderTokenSpan } from '../../utils/render.helpers';
import { logInfo } from '../../utils/log-debug';

@Component({
  tag: 'badge-component',
  styleUrl: 'badge.scss',
  shadow: false,
})
export class Badge {
  @Element() el: HTMLElement;

  @Event({ bubbles: true }) customClick: EventEmitter;

  @Prop() absolute: boolean = false;
  @Prop() ariaLabel: string = '';
  @Prop() ariaLabelledby?: string;
  @Prop() ariaDescribedby?: string;
  @Prop() bdgPosition: string = '';
  @Prop() badgeId: string = '';
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

  @Prop() devMode: boolean = false;

  private attr(v?: string) {
    return v && v.trim() ? v : undefined;
  }

  private hasAccessibleName(): boolean {
    return !!this.attr(this.ariaLabel) || !!this.attr(this.ariaLabelledby) || !!this.attr(this.ariaDescribedby);
  }

  private getHostRole(): string | undefined {
    const explicitRole = this.el.getAttribute('role');
    if (explicitRole && explicitRole.trim()) return explicitRole;

    const named = this.hasAccessibleName();

    if (this.token || this.dot) return 'status';
    if (named) return 'note';

    return undefined;
  }

  private getHostAriaHidden(): 'true' | null {
    const named = this.hasAccessibleName();
    if (named) return null;

    // If it's not a token/dot and has no name, keep it out of the a11y tree.
    return !this.token && !this.dot ? 'true' : null;
  }

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
      <div class={wrapperClass} id={this.attr(this.badgeId)}>
        <slot />
        <span class="badge__wrapper">
          {renderTokenSpan({
            className: tokenClass,
            styles: combinedStyles,
            ariaLabel: this.ariaLabel,
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
      classNames: this.classNames,
    });

    const combinedStyles = {
      ...this.getDynamicStyles(),
      ...this.parseInlineStyles(this.inlineStyles),
    };

    return (
      <div class={wrapperClass} id={this.attr(this.badgeId)}>
        <slot />
        <span class="badge__wrapper">
          {renderTokenSpan({
            className: tokenClass,
            styles: combinedStyles,
            ariaLabel: this.ariaLabel,
            ariaLabelledby: this.ariaLabelledby,
            ariaDescribedby: this.ariaDescribedby,
          })}
        </span>
      </div>
    );
  }

  private renderPositionedBadge(classAttr: string) {
    return (
      <div class={`${classAttr} ${this.bdgPosition === 'left' ? 'me-1' : 'ms-1'}`} id={this.attr(this.badgeId)}>
        <slot />
      </div>
    );
  }

  private renderDefaultBadge(classAttr: string) {
    return (
      <div class={classAttr} style={this.parseInlineStyles(this.styles)} id={this.attr(this.badgeId)}>
        <div class="badge__content">
          <slot />
          {this.icon && (
            <span class="icon">
              <slot name="icon" />
            </span>
          )}
        </div>
      </div>
    );
  }

  render() {
    const classAttr = buildBadgeClass({
      base: this.token ? 'badge__badge' : 'badge',
      variant: this.outlined ? `badge--outlined ${this.variant}` : this.variant ? 'bg-' + this.variant : 'bg-secondary',
      elevation: this.elevation,
      size: this.size,
      shape: this.shape === 'pill' ? 'rounded-pill' : this.shape === 'square' ? 'square' : '',
      bordered: this.bordered,
      classNames: this.classNames,
    });

    const role = this.getHostRole();
    const ariaHidden = this.getHostAriaHidden();
    const named = this.hasAccessibleName();
    const isLiveStatus = role === 'status';

    logInfo(this.devMode, 'Badge', 'render() decision tree', {
      token: this.token,
      dot: this.dot,
      bdgPosition: this.bdgPosition,
      classAttr,
      role,
      ariaHidden,
      named,
    });

    return (
      <Host
        role={role}
        aria-hidden={ariaHidden}
        aria-label={named ? this.attr(this.ariaLabel) : undefined}
        aria-labelledby={named ? this.attr(this.ariaLabelledby) : undefined}
        aria-describedby={named ? this.attr(this.ariaDescribedby) : undefined}
        aria-live={isLiveStatus ? 'polite' : undefined}
        aria-atomic={isLiveStatus ? 'true' : undefined}
      >
        {this.token
          ? this.renderBadgeToken()
          : this.dot
            ? this.renderDotBadge()
            : this.bdgPosition
              ? this.renderPositionedBadge(classAttr)
              : this.renderDefaultBadge(classAttr)}
      </Host>
    );
  }
}
