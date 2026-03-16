// src/components/card-component/card-component.tsx
import { Component, Prop, Event, EventEmitter, h, State, Element } from '@stencil/core';

@Component({
  tag: 'card-component',
  styleUrl: 'card.scss',
  shadow: false,
})
export class CardComponent {
  @Element() el!: HTMLElement;

  // ---------------- Props ----------------
  @Prop() actions = false;
  @Prop() altText = '';
  @Prop() cardMaxWidth = '20';
  @Prop() classNames = '';
  @Prop() elevation = '';
  @Prop() img = false;
  @Prop() imgSrc = '';
  @Prop() inlineStyles = '';
  @Prop() noFooter = false;
  @Prop() noHeader = false;
  @Prop() imgHeight = '11.25rem';

  @Prop() clickable = false;
  @Prop() disabled = false;
  @Prop() landmark = false;

  /** Accessible naming hooks (preferred) */
  @Prop({ attribute: 'aria-label' }) ariaLabel?: string;
  @Prop({ attribute: 'aria-labelledby' }) ariaLabelledby?: string;
  @Prop({ attribute: 'aria-describedby' }) ariaDescribedby?: string;

  /** Heading level for the title slot. */
  @Prop({ attribute: 'heading-level' }) headingLevel: number = 5;

  /** If true, image is decorative and will be hidden from AT (alt=""). */
  @Prop() decorativeImage = false;

  // ---------------- Events ----------------
  @Event() customClick!: EventEmitter<void>;

  // ---------------- State (slot presence) ----------------
  @State() private hasTitleSlot = false;

  // ---------------- Unique ID (for internal wiring) ----------------
  private static _seq = 0;
  private _baseId = '';

  private resolveBaseId() {
    if (this._baseId) return;
    CardComponent._seq += 1;
    const rnd = Math.random().toString(36).slice(2, 6);
    this._baseId = `card-${CardComponent._seq}-${rnd}`;
  }

  private get ids(): string {
    this.resolveBaseId();
    return this._baseId;
  }

  private get titleId(): string {
    return `${this.ids}-title`;
  }

  private getSafeHeadingLevel(): 2 | 3 | 4 | 5 | 6 {
    const n = Number(this.headingLevel);
    if (!Number.isFinite(n)) return 5;
    const clamped = Math.max(2, Math.min(6, Math.trunc(n)));
    return clamped as 2 | 3 | 4 | 5 | 6;
  }

  // ---------------- Lifecycle ----------------
  componentDidLoad() {
    // slotchange does not reliably fire for initial slotted content,
    // so compute initial slot presence after first render.
    queueMicrotask(() => {
      requestAnimationFrame(() => this.syncAllSlots());
    });
  }

  // ---------------- Helpers ----------------
  private sanitizeIdRefList(v?: string | null): string | undefined {
    const raw = String(v ?? '').trim();
    if (!raw) return undefined;

    const tokens = raw
      .split(/\s+/)
      .map(t => t.trim())
      .filter(Boolean);

    const valid = tokens.filter(t => /^[A-Za-z_][\w:\-.]*$/.test(t));
    return valid.length ? valid.join(' ') : undefined;
  }

  private coerceNumberInRange(raw: string, fallback: number, min: number, max: number): number {
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  private parseStyleString(styleStr: string): { [key: string]: string } | undefined {
    if (!styleStr || typeof styleStr !== 'string') return undefined;

    const out: { [key: string]: string } = {};
    const rules = styleStr.split(';');

    for (const rule of rules) {
      const r = rule.trim();
      if (!r) continue;

      const idx = r.indexOf(':');
      if (idx === -1) continue;

      const rawKey = r.slice(0, idx).trim();
      const rawVal = r.slice(idx + 1).trim();
      if (!rawKey || !rawVal) continue;

      if (rawKey === '__proto__' || rawKey === 'constructor' || rawKey === 'prototype') continue;

      const lowerKey = rawKey.toLowerCase();
      const lowerVal = rawVal.toLowerCase();

      if (lowerKey.includes('behavior')) continue;
      if (lowerVal.includes('expression(')) continue;
      if (lowerVal.includes('javascript:')) continue;

      out[rawKey] = rawVal;
    }

    return out;
  }

  /** True if a slot has any meaningful assigned content (text or elements). */
  private slotHasContent(slot: HTMLSlotElement | null): boolean {
    if (!slot) return false;

    const assigned = slot.assignedNodes?.({ flatten: true }) || [];
    return assigned.some(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        return (n.textContent || '').trim().length > 0;
      }
      return n.nodeType === Node.ELEMENT_NODE;
    });
  }

  /** Initial + manual sync for all tracked slots. */
  private syncAllSlots() {
    const title = this.el.querySelector('slot[name="title"]') as HTMLSlotElement | null;
    this.hasTitleSlot = this.slotHasContent(title);
  }

  private onSlotChange = (slotName: 'header' | 'title' | 'actions' | 'footer', e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const hasContent = this.slotHasContent(slot);

    switch (slotName) {
      case 'title':
        this.hasTitleSlot = hasContent;
        break;
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.clickable || this.disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.customClick.emit();
    }
  };

  private handleClick = (event: MouseEvent) => {
    if (!this.clickable || this.disabled) return;

    const target = event.target as HTMLElement | null;
    const interactive = target?.closest?.(
      'button,a,input,select,textarea,[role="button"],[role="link"]',
    );

    if (interactive && interactive !== this.el) return;

    this.customClick.emit();
  };

  // ---------------- Render ----------------
  render() {
    const baseClasses = ['card', this.classNames];
    if (this.elevation) baseClasses.push(`elevated-${this.elevation}`);
    const classAttribute = baseClasses.filter(Boolean).join(' ');

    const maxW = this.coerceNumberInRange(this.cardMaxWidth, 20, 0, 200);
    const combinedStyle = `${this.inlineStyles}; max-width: ${maxW}rem;`;
    const hostStyle = this.parseStyleString(combinedStyle);

    const imgStyles = {
      height: this.imgHeight,
      width: '100%',
      display: 'block',
    };

    const labelledby = this.sanitizeIdRefList(this.ariaLabelledby);
    const describedby = this.sanitizeIdRefList(this.ariaDescribedby);

    const ariaLabel =
      !labelledby && typeof this.ariaLabel === 'string' && this.ariaLabel.trim().length > 0
        ? this.ariaLabel.trim()
        : undefined;

    const computedLandmarkLabelledby =
      this.landmark && !labelledby && !ariaLabel && this.hasTitleSlot ? this.titleId : labelledby;

    const isInteractive = this.clickable;
    const role = isInteractive ? 'button' : this.landmark ? 'region' : undefined;

    const computedButtonLabelledby = isInteractive && this.hasTitleSlot ? this.titleId : labelledby;

    const computedButtonAriaLabel =
      isInteractive && !computedButtonLabelledby ? ariaLabel || 'Card' : undefined;

    const rootAriaLabelledby = isInteractive
      ? computedButtonLabelledby
      : computedLandmarkLabelledby || labelledby;

    const rootAriaLabel = isInteractive
      ? computedButtonAriaLabel
      : this.landmark
        ? ariaLabel
        : undefined;

    const tabIndex = isInteractive && !this.disabled ? 0 : undefined;
    const HeadingTag = `h${this.getSafeHeadingLevel()}` as keyof HTMLElementTagNameMap;

    return (
      <article
        class={classAttribute}
        style={hostStyle}
        role={role}
        aria-label={rootAriaLabel}
        aria-labelledby={rootAriaLabelledby}
        aria-describedby={describedby}
        aria-disabled={isInteractive && this.disabled ? 'true' : undefined}
        tabIndex={tabIndex}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
      >
        {this.img && this.imgSrc ? (
          <img
            src={this.imgSrc}
            class="card-img-top"
            alt={this.decorativeImage ? '' : this.altText || 'Card image'}
            aria-hidden={this.decorativeImage ? 'true' : undefined}
            style={imgStyles}
          />
        ) : null}

        {!this.noHeader ? (
          <div class="card-header">
            <slot name="header" onSlotchange={e => this.onSlotChange('header', e)} />
          </div>
        ) : null}

        <div class="card-body">
          <HeadingTag class="card-title" id={this.titleId}>
            <slot name="title" onSlotchange={e => this.onSlotChange('title', e)} />
          </HeadingTag>

          <div class="card-text">
            <slot name="text" />
          </div>
        </div>

        {this.actions ? (
          <div class="card-actions">
            <slot name="actions" onSlotchange={e => this.onSlotChange('actions', e)} />
          </div>
        ) : null}

        {!this.noFooter ? (
          <div class="card-footer">
            <slot name="footer" onSlotchange={e => this.onSlotChange('footer', e)} />
          </div>
        ) : null}
      </article>
    );
  }
}
