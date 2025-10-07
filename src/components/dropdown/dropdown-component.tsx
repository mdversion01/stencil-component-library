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
  @Prop() size = '';
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

  // @State() options: DropdownItem[] = [];
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
  private submenuTimeout: ReturnType<typeof setTimeout> | null = null; // why: hover-intent delay
  private isSubmenuToggle(el: any): boolean {
  return !!el && el.classList?.contains('dropdown-submenu-toggle');
}


  private focusFirstIn(container: Element | null) {
    const first = this.getFocusableItems(container || undefined)[0];
    first?.focus();
  }

  setOptions(opts: DropdownItem[]) {
    this.options = [...opts];
  }

  componentDidLoad() {
    if (typeof window === 'undefined') return;

    try {
      this.dropdownButtonEl = this.host.querySelector<HTMLButtonElement>(`#${this.componentId}-toggle-button button`) || this.dropdownButtonEl;
      this.menuEl = this.host.querySelector<HTMLElement>(`#${this.componentId}-menu-root`) || this.menuEl;
      this.host.addEventListener('focusout', this.handleFocusOut);
    } catch (err) {
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

  toggleDropdown = () => {
    if (this.disabled) return;
    this.showDropdown = !this.showDropdown;
    this.isOpen = this.showDropdown;

    if (this.showDropdown) {
      this.createPopperInstance();
      document.addEventListener('mousedown', this.handleOutsideClick);
      setTimeout(() => {
        this.menuEl?.focus();
        this.focusedIndex = -1;
      }, 0);
    } else {
      this.closeDropdown();
    }
  };

  closeDropdown() {
    // If focus is anywhere inside the dropdown menus, return it to the trigger first
    const active = document.activeElement as HTMLElement | null;
    if (active && (this.menuEl?.contains(active) || this.host.contains(active))) {
      this.dropdownButtonEl?.focus();
    }

    this.showDropdown = false;
    this.isOpen = false;

    this.closeAllSubmenus();
    this.destroyPopper();
    document.removeEventListener('mousedown', this.handleOutsideClick);
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

  getFocusableItems(container: Element = this.menuEl): HTMLElement[] {
    return Array.from(container.querySelectorAll('.dropdown-item:not(.disabled)')).filter((el): el is HTMLElement => (el as HTMLElement).offsetParent !== null);
  }

  closeAllSubmenus() {
    const openSubs = this.host.querySelectorAll<HTMLElement>('.dropdown-menu.sub.show');

    openSubs.forEach(sub => {
      const toggle = sub.previousElementSibling as HTMLElement | null;

      // If focus is inside this submenu, move it to the toggle BEFORE hiding
      if (sub.contains(document.activeElement)) {
        toggle?.focus();
      }

      // Now it's safe to hide + inert + aria
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
    // 1) Close any open descendants first (focus out before hiding each)
    submenu.querySelectorAll<HTMLElement>('.dropdown-menu.sub.show').forEach(child => {
      const childToggle = child.previousElementSibling as HTMLElement | null;
      if (child.contains(document.activeElement)) {
        childToggle?.focus();
      }
      child.classList.remove('show');
      child.classList.add('hidden');
      child.setAttribute('inert', '');
      child.setAttribute('aria-hidden', 'true');
      childToggle?.setAttribute('aria-expanded', 'false');
      this.activeSubmenus.delete(child.id);
    });

    // 2) If focus is inside this submenu, move it to this submenu's toggle first
    const toggle = submenu.previousElementSibling as HTMLElement | null;
    if (submenu.contains(document.activeElement)) {
      toggle?.focus();
    }

    // 3) Now hide + inert + aria
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

    // No :scope — works in Stencil’s mock DOM too
    Array.from(levelMenu.querySelectorAll<HTMLElement>('.dropdown-submenu > .dropdown-menu.sub.show'))
      .filter(sub => sub.parentElement?.parentElement === levelMenu)
      .forEach(sub => {
        if (sub.id !== keepId) this.closeSubmenu(sub);
      });
  }

  showSubmenu(id: string, triggerEl: HTMLElement) {
    const submenuEl = this.host.querySelector<HTMLElement>(`#${id}`);
    if (!submenuEl) return;

    // only close siblings at the same level
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
    if (this.autoFocusSubmenu) submenuEl.focus();
  }

  /** Hover-intent: open submenu when mouse enters the wrapper */
  handleSubmenuMouseEnter = (e: MouseEvent) => {
    if (this.submenuTimeout) clearTimeout(this.submenuTimeout);
    const wrapper = e.currentTarget as HTMLElement;
    const toggle = wrapper.querySelector<HTMLElement>('.dropdown-submenu-toggle');
    const submenu = wrapper.querySelector<HTMLElement>('.dropdown-menu.sub');
    if (toggle && submenu) this.showSubmenu(submenu.id, toggle);
  };

  /** Hover-intent: close submenu a bit after leaving (prevents flicker) */
  handleSubmenuMouseLeave = (submenuId: string) => {
    if (this.submenuTimeout) clearTimeout(this.submenuTimeout);
    this.submenuTimeout = setTimeout(() => {
      const submenu = this.host.querySelector<HTMLElement>(`#${submenuId}`);
      if (submenu) this.closeSubmenu(submenu);
    }, 120);
  };

  @Listen('keydown', { target: 'window' })
  handleKeydown(event: KeyboardEvent) {
    if (!this.showDropdown || this.disabled) return;

    const focused = document.activeElement as HTMLElement | null;
    const container = focused?.closest('.dropdown-menu') || this.menuEl;
    const items = this.getFocusableItems(container);
    const currentIndex = items.findIndex(i => i === focused);
    let nextIndex = -1;

    // Directional keys depend on submenu side
    const openKey = this.alignMenuRight ? 'ArrowLeft' : 'ArrowRight';
    const closeKey = this.alignMenuRight ? 'ArrowRight' : 'ArrowLeft';

    switch (event.key) {
      case ' ':
        // Space on trigger toggles root menu, or opens submenu when on a toggle
        if (focused === this.dropdownButtonEl) {
          event.preventDefault();
          this.toggleDropdown();
        } else if (this.isSubmenuToggle(focused)) {
          event.preventDefault();
          const submenu = focused.nextElementSibling as HTMLElement | null;
          if (submenu) {
            this.showSubmenu(submenu.id, focused);
            this.focusFirstIn(submenu);
          }
        }
        break;

      case 'Enter':
        // Enter should "activate": open submenu if on a toggle, otherwise click
        if (this.isSubmenuToggle(focused)) {
          event.preventDefault();
          const submenu = focused!.nextElementSibling as HTMLElement | null;
          if (submenu) {
            this.showSubmenu(submenu.id, focused!);
            this.focusFirstIn(submenu);
          }
        } else {
          event.preventDefault();
          focused?.click();
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
        // normalize as open/close intent
        const key = event.key;

        // OPEN intent on submenu toggle
        if (key === openKey && this.isSubmenuToggle(focused)) {
          const submenu = focused!.nextElementSibling as HTMLElement | null;
          if (submenu) {
            event.preventDefault();
            this.showSubmenu(submenu.id, focused!);
            this.focusFirstIn(submenu);
          }
          break;
        }

        // CLOSE intent when inside a submenu
        const inSub = focused?.closest('.dropdown-menu.sub') as HTMLElement | null;
        if (key === closeKey && inSub) {
          event.preventDefault();
          const toggle = inSub.previousElementSibling as HTMLElement | null;
          this.closeSubmenu(inSub);
          toggle?.focus();
        }
        break;
      }

      case 'Escape': {
        const inSub = focused?.closest('.dropdown-menu.sub') as HTMLElement | null;
        if (inSub) {
          event.preventDefault();
          const toggle = inSub.previousElementSibling as HTMLElement | null;
          this.closeSubmenu(inSub);
          toggle?.focus();
        } else {
          event.preventDefault();
          this.closeDropdown();
        }
        break;
      }
    }

    if (nextIndex !== -1) {
      items[nextIndex]?.focus();
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

      if (!item.inputId) item.inputId = `dd-input-${currentId}`;

      if (item.isDivider) {
        return <div class="dropdown-divider" role="separator"></div>;
      }

      if (item.submenu) {
        const hasInputs = item.submenu.some(sub => !!sub.customListType);
        const submenuClass = ['dropdown-menu', 'sub', 'hidden', hasInputs ? 'sub-inputs' : '', this.alignMenuRight ? 'dropdown-menu-right' : ''].join(' ');

        return (
          <div class="dropdown-submenu" role="presentation" onMouseEnter={this.handleSubmenuMouseEnter} onMouseLeave={() => this.handleSubmenuMouseLeave(submenuId)}>
            <a
              href="#"
              id={`dropdown-item-${currentId}`}
              class={`dropdown-item dropdown-submenu-toggle ${this.size}`}
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls={submenuId}
              tabIndex={0}
              onClick={e => e.preventDefault()}
              onMouseEnter={e => this.showSubmenu(submenuId, e.currentTarget as HTMLElement)}
            >
              {this.alignMenuRight && <icon-component icon="fa-solid fa-caret-left" />}
              {item.name}
              {!this.alignMenuRight && <icon-component icon="fa-solid fa-caret-right" />}
            </a>

            <div id={submenuId} class={submenuClass} role="menu" tabIndex={-1}>
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
              onToggle={() => this.itemSelected.emit({ item, index })}
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
              onToggle={() => this.itemSelected.emit({ item, index })}
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
      .filter(i => i.submenu)
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
        aria-activedescendant={`dropdown-item-${this.focusedIndex}`}
        aria-owns={submenuIds}
        aria-labelledby={`${this.componentId}-toggle-button`}
        tabIndex={-1}
      >
        {this.renderNestedItems(this.options, '')}
      </div>
    );
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
          aria-haspopup="true"
          aria-controls={`${this.componentId}-menu-root`}
          aria-expanded={this.showDropdown.toString()}
          onClick={this.toggleDropdown}
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
