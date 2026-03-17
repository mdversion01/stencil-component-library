// src/components/dropdown/dropdown-component.tsx

import { Component, h, Prop, State, Event, EventEmitter, Element, Listen } from '@stencil/core';
import type { DropdownItem } from './dropdown-types';
import { createPopper, Instance } from '@popperjs/core';
import { autoUpdate } from '@floating-ui/dom';

@Component({
  tag: 'dropdown-component',
  styleUrls: ['dropdown.scss', '../checkbox/checkbox.scss'],
  shadow: false,
})
export class DropdownComponent {
  @Element() host: HTMLElement;

  @Prop() buttonText = 'Dropdown';
  @Prop() disabled = false;
  @Prop() iconDropdown = false;
  @Prop() alignMenuRight = false;
  @Prop() shape = '';
  @Prop() size: '' | 'xs' | 'plumage-size' | 'sm' | 'lg' = '';
  @Prop() outlined = false;
  @Prop() ripple = false;
  @Prop() variant = 'default';
  @Prop() listType = 'default';
  @Prop() subMenuListType = 'default';
  @Prop() inputId = '';
  @Prop() tableId = '';
  @Prop() titleAttr = '';
  @Prop() icon = '';
  @Prop() iconSize?: number;
  @Prop() autoFocusSubmenu = false;
  @Prop() menuOffsetY = 0;
  @Prop() submenuOffsetX = 0;
  @Prop() name = '';
  @Prop() value = '';
  @Prop({ mutable: true }) options: DropdownItem[] = [];

  @State() showDropdown = false;
  @State() focusedIndex = -1;
  @State() activeSubmenus = new Set<string>();
  @State() isOpen = false;

  @Event({ bubbles: true, composed: true }) itemSelected: EventEmitter<any>;

  private componentId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
  public dropdownButtonEl!: HTMLButtonElement;
  public menuEl!: HTMLElement;
  private popperInstance: Instance | null = null;
  private cleanupAutoUpdate: (() => void) | null = null;
  private submenuTimeout: ReturnType<typeof setTimeout> | null = null;

  // Prevent synthetic click after Enter/Space from re-toggling.
  private suppressNextClick = false;

  private safeFocus = (el?: HTMLElement | null) => {
    if (!el) return;
    try {
      (el as any).focus({ preventScroll: true });
    } catch {
      el.focus();
    }
  };

  private isSubmenuToggle(el: any): boolean {
    return !!el && el.classList?.contains('dropdown-submenu-toggle');
  }

  private toKey = (o: any) => (o?.key ?? o?.value ?? o?.name ?? '') as string;

  private isVisible(el: HTMLElement): boolean {
    return !!(el.getClientRects && el.getClientRects().length);
  }

  private getTriggerRoot(): HTMLElement | null {
    return this.host.querySelector<HTMLElement>(`#${this.componentId}-toggle-button`);
  }

  private isEventFromTrigger(ev: Event): boolean {
    const triggerRoot = this.getTriggerRoot();
    if (!triggerRoot) return false;
    const t = ev.target as Node | null;
    return !!(t && triggerRoot.contains(t));
  }

  private isFocusOnTrigger(): boolean {
    const triggerRoot = this.getTriggerRoot();
    const a = document.activeElement as HTMLElement | null;
    return !!(triggerRoot && a && triggerRoot.contains(a));
  }

  getFocusableItems(container: Element = this.menuEl): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>('.dropdown-item:not(.disabled)')).filter((el) => this.isVisible(el));
  }

  private focusFirstMenuItem() {
    const items = this.getFocusableItems(this.menuEl);
    this.safeFocus(items[0] ?? this.menuEl);
    this.focusedIndex = items[0] ? 0 : -1;
  }

  private focusLastMenuItem() {
    const items = this.getFocusableItems(this.menuEl);
    const idx = items.length ? items.length - 1 : -1;
    this.safeFocus(items[idx] ?? this.menuEl);
    this.focusedIndex = idx;
  }

  setOptions(opts: DropdownItem[]) {
    this.options = [...opts];
    const detail = { items: this.options };
    this.host?.dispatchEvent(new CustomEvent('items-changed', { detail, bubbles: true, composed: true }));
  }

  componentDidLoad() {
    if (typeof window === 'undefined') return;

    try {
      // button-component likely renders a <button> inside; grab that if available
      this.dropdownButtonEl =
        this.host.querySelector<HTMLButtonElement>(`#${this.componentId}-toggle-button button`) || this.dropdownButtonEl;

      this.menuEl = this.host.querySelector<HTMLElement>(`#${this.componentId}-menu-root`) || this.menuEl;

      this.host.addEventListener('focusout', this.handleFocusOut);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('dropdown-component: componentDidLoad failed in test', err);
    }
  }

  disconnectedCallback() {
    this.host?.removeEventListener('focusout', this.handleFocusOut);
    document.removeEventListener('mousedown', this.handleOutsideClick);
    this.destroyPopper();
    if (this.submenuTimeout) clearTimeout(this.submenuTimeout);
  }

  handleFocusOut = () => {
    setTimeout(() => {
      if (!this.host.contains(document.activeElement)) this.closeDropdown();
    }, 0);
  };

  handleOutsideClick = (event: MouseEvent) => {
    if (!this.host.contains(event.target as Node)) this.closeDropdown();
  };

  private openDropdown = () => {
    this.showDropdown = true;
    this.isOpen = true;

    this.createPopperInstance();
    document.addEventListener('mousedown', this.handleOutsideClick);

    // IMPORTANT: do NOT move focus on open.
    // Keep focus on trigger until user navigates with arrow keys / mouse.
    this.focusedIndex = -1;

    // Ensure Popper positions correctly after DOM updates
    setTimeout(() => this.popperInstance?.update(), 0);
  };

  private closeDropdownInternal = () => {
    this.showDropdown = false;
    this.isOpen = false;

    this.closeAllSubmenus();
    this.destroyPopper();
    document.removeEventListener('mousedown', this.handleOutsideClick);

    // Return focus to trigger if focus was inside the menu/host
    const active = document.activeElement as HTMLElement | null;
    if (active && (this.menuEl?.contains(active) || this.host.contains(active))) {
      this.safeFocus(this.dropdownButtonEl);
    }
  };

  toggleDropdown = (fromKeyboard = false) => {
    if (this.disabled) return;

    // If Enter/Space generated a synthetic click, ignore that click once.
    if (!fromKeyboard && this.suppressNextClick) {
      this.suppressNextClick = false;
      return;
    }

    if (!this.showDropdown) this.openDropdown();
    else this.closeDropdownInternal();
  };

  closeDropdown() {
    this.closeDropdownInternal();
  }

  createPopperInstance() {
    this.destroyPopper();
    if (!this.dropdownButtonEl || !this.menuEl) return;

    const placement = this.alignMenuRight ? 'bottom-end' : 'bottom-start';
    const fallback = this.alignMenuRight ? ['top-end'] : ['top-start'];

    this.popperInstance = createPopper(this.dropdownButtonEl, this.menuEl, {
      placement,
      modifiers: [
        { name: 'offset', options: { offset: [0, this.menuOffsetY] } },
        { name: 'preventOverflow', options: { padding: 8, boundary: 'viewport' } },
        { name: 'flip', options: { fallbackPlacements: fallback } },
      ],
    });

    this.cleanupAutoUpdate = autoUpdate(this.dropdownButtonEl, this.menuEl, () => this.popperInstance?.update());
  }

  destroyPopper() {
    this.popperInstance?.destroy();
    this.popperInstance = null;
    this.cleanupAutoUpdate?.();
    this.cleanupAutoUpdate = null;
  }

  private handleCheckboxToggle = (item: DropdownItem, index: number) => {
    const opts = Array.isArray(this.options) ? [...this.options] : [];
    const i = typeof index === 'number' ? index : opts.findIndex((o) => this.toKey(o) === this.toKey(item));
    if (i < 0) return;

    const updated = { ...opts[i], checked: !opts[i].checked };
    opts[i] = updated;
    this.options = opts;

    this.itemSelected.emit({ item: updated, index: i });

    const detail = { items: this.options };
    this.host.dispatchEvent(new CustomEvent('items-changed', { detail, bubbles: true, composed: true }));
    this.host.dispatchEvent(
      new CustomEvent('selection-changed', {
        detail: { items: this.options.filter((o) => o?.checked) },
        bubbles: true,
        composed: true,
      }),
    );

    const tableId = this.tableId || this.host.getAttribute('table-id') || '';
    const payload = this.options.map((o) => ({
      key: this.toKey(o),
      checked: !!o.checked,
    }));

    document.dispatchEvent(
      new CustomEvent('filter-fields-changed', {
        detail: { tableId, items: payload },
        bubbles: false,
      }),
    );
  };

  closeAllSubmenus() {
    const openSubs = this.host.querySelectorAll<HTMLElement>('.dropdown-menu.sub.show');

    openSubs.forEach((sub) => {
      const toggle = sub.previousElementSibling as HTMLElement | null;

      if (sub.contains(document.activeElement)) {
        this.safeFocus(toggle);
      }

      sub.classList.remove('show');
      sub.classList.add('hidden');
      sub.setAttribute('inert', '');
      sub.setAttribute('aria-hidden', 'true');
      toggle?.setAttribute('aria-expanded', 'false');

      this.activeSubmenus.delete(sub.id);
    });

    this.activeSubmenus.clear?.();
  }

  closeSubmenu(submenu: HTMLElement) {
    submenu.querySelectorAll<HTMLElement>('.dropdown-menu.sub.show').forEach((child) => {
      const childToggle = child.previousElementSibling as HTMLElement | null;
      if (child.contains(document.activeElement)) {
        this.safeFocus(childToggle);
      }
      child.classList.remove('show');
      child.classList.add('hidden');
      child.setAttribute('inert', '');
      child.setAttribute('aria-hidden', 'true');
      childToggle?.setAttribute('aria-expanded', 'false');
      this.activeSubmenus.delete(child.id);
    });

    const toggle = submenu.previousElementSibling as HTMLElement | null;
    if (submenu.contains(document.activeElement)) {
      this.safeFocus(toggle);
    }

    submenu.classList.remove('show');
    submenu.classList.add('hidden');
    submenu.setAttribute('inert', '');
    submenu.setAttribute('aria-hidden', 'true');
    toggle?.setAttribute('aria-expanded', 'false');

    this.activeSubmenus.delete(submenu.id);
  }

  private closeSiblingSubmenus(triggerEl: HTMLElement, keepId: string) {
    const levelMenu = triggerEl.closest('.dropdown-menu') as HTMLElement | null;
    if (!levelMenu) return;

    Array.from(levelMenu.querySelectorAll<HTMLElement>('.dropdown-submenu > .dropdown-menu.sub.show'))
      .filter((sub) => sub.parentElement?.parentElement === levelMenu)
      .forEach((sub) => {
        if (sub.id !== keepId) this.closeSubmenu(sub);
      });
  }

  showSubmenu(id: string, triggerEl: HTMLElement) {
    const submenuEl = this.host.querySelector<HTMLElement>(`#${id}`);
    if (!submenuEl) return;

    this.closeSiblingSubmenus(triggerEl, id);

    submenuEl.classList.add('show');
    submenuEl.classList.remove('hidden');
    submenuEl.removeAttribute('inert');
    submenuEl.setAttribute('aria-hidden', 'false');
    triggerEl.setAttribute('aria-expanded', 'true');

    createPopper(triggerEl, submenuEl, {
      placement: this.alignMenuRight ? 'left-start' : 'right-start',
      modifiers: [
        { name: 'offset', options: { offset: [this.submenuOffsetX, 0] } },
        { name: 'preventOverflow', options: { padding: 8 } },
        { name: 'flip', options: { fallbackPlacements: this.alignMenuRight ? ['right-start'] : ['left-start'] } },
      ],
    });

    this.activeSubmenus.add(id);
    if (this.autoFocusSubmenu) this.safeFocus(submenuEl);
  }

  handleSubmenuMouseEnter = (e: MouseEvent) => {
    if (this.submenuTimeout) clearTimeout(this.submenuTimeout);
    const wrapper = e.currentTarget as HTMLElement;
    const toggle = wrapper.querySelector<HTMLElement>('.dropdown-submenu-toggle');
    const submenu = wrapper.querySelector<HTMLElement>('.dropdown-menu.sub');
    if (toggle && submenu) this.showSubmenu(submenu.id, toggle);
  };

  handleSubmenuMouseLeave = (submenuId: string) => {
    if (this.submenuTimeout) clearTimeout(this.submenuTimeout);
    this.submenuTimeout = setTimeout(() => {
      const submenu = this.host.querySelector<HTMLElement>(`#${submenuId}`);
      if (submenu) this.closeSubmenu(submenu);
    }, 120);
  };

  // ✅ Capture keydown at host level so Enter/Space works even if button-component swallows events.
  @Listen('keydown', { capture: true })
  handleHostKeydown(event: KeyboardEvent) {
    if (this.disabled) return;

    // Only treat Enter/Space as trigger toggle if it came from the trigger area.
    if ((event.key === 'Enter' || event.key === ' ') && this.isEventFromTrigger(event)) {
      event.preventDefault();
      event.stopPropagation();
      this.suppressNextClick = true;
      this.toggleDropdown(true);
      return;
    }

    // If open and focus is still on trigger, ArrowDown/Home etc should move focus into menu
    if (this.showDropdown && this.isFocusOnTrigger()) {
      if (event.key === 'ArrowDown' || event.key === 'Home') {
        event.preventDefault();
        event.stopPropagation();
        this.focusFirstMenuItem();
        return;
      }
      if (event.key === 'ArrowUp' || event.key === 'End') {
        event.preventDefault();
        event.stopPropagation();
        this.focusLastMenuItem();
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.closeDropdown();
        return;
      }
    }
  }

  @Listen('keydown', { target: 'window' })
  handleKeydown(event: KeyboardEvent) {
    if (!this.showDropdown || this.disabled) return;

    const focused = document.activeElement as HTMLElement | null;

    // If focus is still on trigger while open, let host handler manage focus entry
    if (this.isFocusOnTrigger()) return;

    const container = (focused?.closest('.dropdown-menu') as HTMLElement | null) || this.menuEl;
    const items = this.getFocusableItems(container);
    const currentIndex = items.findIndex((i) => i === focused);
    let nextIndex = -1;

    const openKey = this.alignMenuRight ? 'ArrowLeft' : 'ArrowRight';
    const closeKey = this.alignMenuRight ? 'ArrowRight' : 'ArrowLeft';

    switch (event.key) {
      case 'Enter':
        if (this.isSubmenuToggle(focused)) {
          event.preventDefault();
          const submenu = focused!.nextElementSibling as HTMLElement | null;
          if (submenu) {
            this.showSubmenu(submenu.id, focused!);
            const first = this.getFocusableItems(submenu)[0];
            this.safeFocus(first);
          }
        } else {
          event.preventDefault();
          focused?.click();
        }
        break;

      case ' ':
        if (this.isSubmenuToggle(focused)) {
          event.preventDefault();
          const submenu = focused.nextElementSibling as HTMLElement | null;
          if (submenu) {
            this.showSubmenu(submenu.id, focused);
            const first = this.getFocusableItems(submenu)[0];
            this.safeFocus(first);
          }
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;

      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = items.length - 1;
        break;

      case 'ArrowRight':
      case 'ArrowLeft': {
        const key = event.key;

        if (key === openKey && this.isSubmenuToggle(focused)) {
          const submenu = focused!.nextElementSibling as HTMLElement | null;
          if (submenu) {
            event.preventDefault();
            this.showSubmenu(submenu.id, focused!);
            const first = this.getFocusableItems(submenu)[0];
            this.safeFocus(first);
          }
          break;
        }

        const inSub = focused?.closest('.dropdown-menu.sub') as HTMLElement | null;
        if (key === closeKey && inSub) {
          event.preventDefault();
          const toggle = inSub.previousElementSibling as HTMLElement | null;
          this.closeSubmenu(inSub);
          this.safeFocus(toggle);
        }
        break;
      }

      case 'Escape': {
        const inSub = focused?.closest('.dropdown-menu.sub') as HTMLElement | null;
        if (inSub) {
          event.preventDefault();
          const toggle = inSub.previousElementSibling as HTMLElement | null;
          this.closeSubmenu(inSub);
          this.safeFocus(toggle);
        } else {
          event.preventDefault();
          this.closeDropdown();
        }
        break;
      }
    }

    if (nextIndex !== -1) {
      this.safeFocus(items[nextIndex]);
      this.focusedIndex = nextIndex;
    }
  }

  private shouldCloseOnClick() {
    return !['checkboxes', 'customCheckboxes', 'toggleSwitches'].includes(this.listType);
  }

  renderNestedItems(options: DropdownItem[], parentIndex: string): any[] {
    return options.map((item, index) => {
      const currentId = `${parentIndex}-${index}`;
      const submenuId = `submenu-${currentId}`;
      const effectiveListType = item.customListType ?? this.listType;

      if (!item.inputId) item.inputId = `dd-input-${parentIndex}-${this.toKey(item) || index}`;

      if (item.isDivider) {
        return <div class="dropdown-divider" role="separator"></div>;
      }

      if (item.submenu) {
        const hasInputs = item.submenu.some((sub) => !!sub.customListType);
        const submenuClass = [
          'dropdown-menu',
          'sub',
          'hidden',
          hasInputs ? 'sub-inputs' : '',
          this.alignMenuRight ? 'dropdown-menu-right' : '',
        ].join(' ');

        return (
          <div
            class="dropdown-submenu"
            role="presentation"
            onMouseEnter={this.handleSubmenuMouseEnter}
            onMouseLeave={() => this.handleSubmenuMouseLeave(submenuId)}
          >
            <a
              href="javascript:void(0)"
              id={`dropdown-item-${currentId}`}
              class={`dropdown-item dropdown-submenu-toggle ${this.size}`}
              aria-haspopup="menu"
              aria-expanded="false"
              aria-controls={submenuId}
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseEnter={(e) => this.showSubmenu(submenuId, e.currentTarget as HTMLElement)}
            >
              {this.alignMenuRight && <icon-component icon="fa-solid fa-caret-left" />}
              {item.name}
              {!this.alignMenuRight && <icon-component icon="fa-solid fa-caret-right" />}
            </a>

            <div id={submenuId} class={submenuClass} role="menu" tabIndex={-1} aria-hidden="true" inert>
              {this.renderNestedItems(item.submenu, currentId)}
            </div>
          </div>
        );
      }

      const onItemClick = () => {
        this.itemSelected.emit({ item, index });
        if (this.shouldCloseOnClick()) this.closeDropdown();
      };

      if (effectiveListType === 'checkboxes' || effectiveListType === 'customCheckboxes') {
        return (
          <div id={`dropdown-item-${currentId}`} class={`dropdown-item ${this.size}`} tabIndex={0}>
            <checkbox-component
              customCheckbox={effectiveListType === 'customCheckboxes'}
              inputId={item.inputId}
              name={item.name}
              value={item.value}
              labelTxt={item.content ?? item.name}
              size={this.size}
              checked={!!item.checked}
              disabled={!!item.disabled}
              onToggle={() => this.handleCheckboxToggle(item, index)}
            />
          </div>
        );
      }

      if (effectiveListType === 'toggleSwitches') {
        return (
          <div id={`dropdown-item-${currentId}`} class={`dropdown-item ${this.size}`} tabIndex={0}>
            <toggle-switch-component
              inputId={item.inputId}
              labelTxt={item.content ?? item.name}
              size={this.size}
              checked={!!item.checked}
              disabled={!!item.disabled}
              onToggle={() => this.handleCheckboxToggle(item, index)}
            />
          </div>
        );
      }

      return (
        <div id={`dropdown-item-${currentId}`} class={`dropdown-item ${this.size}`} tabIndex={0} onClick={onItemClick}>
          {item.content ?? item.name}
        </div>
      );
    });
  }

  renderDropdownMenu() {
    const submenuIds = this.options
      .filter((i) => i.submenu)
      .map((_, i) => `submenu-${i}`)
      .join(' ');

    const classes = ['dropdown-menu'];
    if (this.showDropdown) classes.push('show');
    if (this.alignMenuRight) classes.push('dropdown-menu-right');
    if (this.listType === 'customCheckboxes' || this.listType === 'checkboxes') classes.push('chbx');
    if (this.listType === 'toggleSwitches') classes.push('tgsw');

    return (
      <div
        class={classes.join(' ')}
        role="menu"
        id={`${this.componentId}-menu-root`}
        aria-activedescendant={this.focusedIndex >= 0 ? `dropdown-item-${this.focusedIndex}` : undefined}
        aria-owns={submenuIds || undefined}
        aria-labelledby={`${this.componentId}-toggle-button`}
        tabIndex={-1}
      >
        {this.renderNestedItems(this.options, '')}
      </div>
    );
  }

  async clearSelections() {
    const opts = Array.isArray(this.options) ? this.options.map((o) => ({ ...o, checked: false })) : [];
    this.options = opts;

    this.host?.dispatchEvent(new CustomEvent('items-changed', { detail: { items: opts }, bubbles: true, composed: true }));
    this.host?.dispatchEvent(new CustomEvent('selection-changed', { detail: { items: [] }, bubbles: true, composed: true }));

    const tableId = this.tableId || this.host.getAttribute('table-id') || '';
    document.dispatchEvent(new CustomEvent('filter-fields-changed', { detail: { tableId, items: [] }, bubbles: false }));

    await Promise.resolve();
  }

  render() {
    return (
      <div class="dropdown">
        <button-component
          id={`${this.componentId}-toggle-button`}
          class={`dropdown-button ${this.iconDropdown ? 'icon-menu' : ''}`}
          variant={this.variant}
          outlined={this.outlined}
          shape={this.shape}
          size={this.size}
          ripple={this.ripple}
          disabled={this.disabled}
          aria-haspopup="menu"
          aria-controls={`${this.componentId}-menu-root`}
          aria-expanded={this.showDropdown.toString()}
          onClick={() => this.toggleDropdown(false)}
          title={this.titleAttr}
        >
          {this.iconDropdown ? <icon-component icon={this.icon} icon-size={this.iconSize} /> : this.buttonText}
          {!this.iconDropdown && (
            <div class="dropdown-caret">
              <icon-component icon="fa-solid fa-caret-down" />
            </div>
          )}
        </button-component>

        {this.renderDropdownMenu()}
      </div>
    );
  }
}
