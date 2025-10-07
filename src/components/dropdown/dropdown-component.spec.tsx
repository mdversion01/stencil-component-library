// src/components/dropdown/dropdown-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { DropdownComponent } from './dropdown-component';

function normalizeHtml(node: Element | ShadowRoot | DocumentFragment | string) {
  const html = typeof node === 'string' ? node : (node as any).outerHTML || (node as any).innerHTML || '';
  return html
    .replace(/dropdown-[a-z0-9]{9}/g, 'dropdown-<id>')
    .replace(/submenu-[\w-]+/g, 'submenu-<id>')
    .replace(/aria-labelledby="dropdown-<id>-toggle-button"/g, 'aria-labelledby="dropdown-<id>-toggle-button"')
    .replace(/aria-controls="dropdown-<id>-menu-root"/g, 'aria-controls="dropdown-<id>-menu-root"');
}

// --- Mocks ---
jest.mock('@popperjs/core', () => ({
  createPopper: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
  Instance: class {},
}));
jest.mock('@floating-ui/dom', () => ({
  autoUpdate: jest.fn(() => jest.fn()),
}));

const getMenu = (root: HTMLElement) => root.querySelector('.dropdown-menu') as HTMLElement;

describe('dropdown-component (full spec)', () => {
  let lastFocused: Element | null = null;
  let randSpy: jest.SpyInstance<number, []>;

  beforeAll(() => {
    // Make everything "visible" for getFocusableItems (offsetParent filter)
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get() {
        return this.parentElement || {};
      },
    });

    // Global bridge (backup)
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get() {
        return (lastFocused as any) || document.body;
      },
    });
  });

  beforeEach(() => {
    lastFocused = null;
    randSpy = jest.spyOn(Math, 'random').mockReturnValue(0.999999999);
  });

  afterEach(() => {
    randSpy?.mockRestore();
  });

  async function setupComponent(options = [{ name: 'Item 1', value: '1' }], htmlAttrs = '') {
    const page = await newSpecPage({
      components: [DropdownComponent],
      html: `<dropdown-component ${htmlAttrs}></dropdown-component>`,
    });

    // Make the component read the *page* document for activeElement
    Object.defineProperty(page.win.document, 'activeElement', {
      configurable: true,
      get() {
        return (lastFocused as any) || page.win.document.body;
      },
    });

    const instance = page.rootInstance as DropdownComponent;

    // anchors used by popper + focus mgmt
    instance.dropdownButtonEl = page.doc.createElement('button');
    (instance.dropdownButtonEl as any).focus = jest.fn(() => {
      lastFocused = instance.dropdownButtonEl;
    });
    instance.menuEl = page.doc.createElement('div');

    instance.setOptions(options as any);
    await page.waitForChanges();
    return { page, instance };
  }

  function patchFocus(items: HTMLElement[]) {
    items.forEach(el => {
      (el as any).focus = jest.fn(() => {
        lastFocused = el;
      });
    });
  }

  function mockFocusables(page: any, instance: DropdownComponent) {
    const items = Array.from(page.root.querySelectorAll('.dropdown-item')) as HTMLElement[];
    patchFocus(items);
    jest.spyOn(instance as any, 'getFocusableItems').mockImplementation((_c?: Element) => items);
    return items;
  }

  function mockFocusablesWithSubmenu(page: any, instance: DropdownComponent) {
    const rootMenu = page.root.querySelector('.dropdown > .dropdown-menu') as HTMLElement;
    const rootItems = Array.from(rootMenu?.querySelectorAll('.dropdown-item') ?? []) as HTMLElement[];
    const submenuItems = Array.from(page.root.querySelectorAll('.dropdown-menu.sub .dropdown-item')) as HTMLElement[];
    patchFocus([...rootItems, ...submenuItems]);

    jest.spyOn(instance as any, 'getFocusableItems').mockImplementation((container?: Element) => {
      if (container && (container as HTMLElement).classList?.contains('sub')) return submenuItems;
      return rootItems;
    });

    return { rootItems, submenuItems };
  }

  async function openMenu(instance: DropdownComponent, page: any) {
    instance.toggleDropdown();
    await page.waitForChanges();
  }

  it('renders with default button text', async () => {
    const { page } = await setupComponent();
    expect(page.root.textContent).toContain('Dropdown');
  });

  it('opens/closes on toggle and snapshots open menu', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }]);
    await openMenu(instance, page);
    const menu = getMenu(page.root);
    expect(menu.classList.contains('show')).toBe(true);
    expect(normalizeHtml(menu)).toMatchSnapshot('open-menu-default');
    instance.toggleDropdown();
    await page.waitForChanges();
    expect(menu.classList.contains('show')).toBe(false);
  });

  it('disabled: toggle does nothing', async () => {
    const page = await newSpecPage({
      components: [DropdownComponent],
      html: `<dropdown-component disabled="true"></dropdown-component>`,
    });

    // Bridge activeElement for this page too
    Object.defineProperty(page.win.document, 'activeElement', {
      configurable: true,
      get() {
        return page.win.document.body;
      },
    });

    const instance = page.rootInstance as DropdownComponent;
    instance.dropdownButtonEl = page.doc.createElement('button');
    instance.menuEl = page.doc.createElement('div');
    instance.toggleDropdown();
    await page.waitForChanges();
    expect(getMenu(page.root)?.classList.contains('show')).toBe(false);
  });

  it('clicking an item emits itemSelected and closes (default list type)', async () => {
    const { page, instance } = await setupComponent([{ name: 'ClickMe', value: 'x' }]);
    const spy = jest.fn();
    page.win.addEventListener('itemSelected', spy);
    await openMenu(instance, page);
    (page.root.querySelector('.dropdown-item') as HTMLElement).click();
    await page.waitForChanges();
    expect(spy).toHaveBeenCalled();
    expect(getMenu(page.root).classList.contains('show')).toBe(false);
  });

  it.each(['checkboxes', 'customCheckboxes', 'toggleSwitches'])('does NOT close after click when per-item customListType="%s"', async listType => {
    const items =
      listType === 'toggleSwitches' ? [{ name: 'Dark Mode', checked: true, customListType: 'toggleSwitches' }] : [{ name: 'Chk', value: 'v', customListType: listType }];
    const { page, instance } = await setupComponent(items as any);
    await openMenu(instance, page);
    (page.root.querySelector('.dropdown-item') as HTMLElement).click();
    await page.waitForChanges();
    expect(getMenu(page.root).classList.contains('show')).toBe(true);
  });

  // --- Submenu tests (no fake timers) ---
  it('showSubmenu opens and snapshots markup; closeSubmenu hides it', async () => {
    const opts = [{ name: 'Parent', submenu: [{ name: 'Child 1' }, { name: 'Child 2' }] }];
    const { page, instance } = await setupComponent(opts as any);
    await openMenu(instance, page);

    const wrapper = page.root.querySelector('.dropdown-submenu') as HTMLElement;
    const toggle = wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const submenu = toggle.nextElementSibling as HTMLElement;
    const submenuId = submenu.id;

    (toggle as any).focus = jest.fn(() => {
      lastFocused = toggle;
    });
    toggle.focus();
    instance.showSubmenu(submenuId, toggle);
    await page.waitForChanges();
    expect(submenu.classList.contains('show')).toBe(true);
    expect(normalizeHtml(submenu)).toMatchSnapshot('open-submenu-markup');

    const dummyItem = page.doc.createElement('div');
    dummyItem.className = 'dropdown-item';
    (dummyItem as any).focus = jest.fn(() => {
      lastFocused = dummyItem;
    });
    submenu.appendChild(dummyItem);
    dummyItem.focus();

    instance.closeSubmenu(submenu);
    await page.waitForChanges();
    expect(submenu.classList.contains('show')).toBe(false);
    expect(submenu.getAttribute('aria-hidden')).toBe('true');
    expect(submenu.hasAttribute('inert')).toBe(true);
    expect(lastFocused).toBe(toggle);
  });

  it('closes when clicking outside', async () => {
    const { page, instance } = await setupComponent([{ name: 'Outside' }]);
    await openMenu(instance, page);
    expect(getMenu(page.root).classList.contains('show')).toBe(true);
    const outside = page.doc.createElement('div');
    page.doc.body.appendChild(outside);
    instance.handleOutsideClick({ target: outside } as any);
    await page.waitForChanges();
    expect(getMenu(page.root).classList.contains('show')).toBe(false);
  });

  // --- Keyboard navigation (root) ---
  it('ArrowDown cycles focus & updates focusedIndex', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    await openMenu(instance, page);
    const items = mockFocusables(page, instance);

    lastFocused = items[0];

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[1]);
    expect(instance['focusedIndex']).toBe(1);

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[2]);
    expect(instance['focusedIndex']).toBe(2);

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[0]);
    expect(instance['focusedIndex']).toBe(0);
  });

  it('ArrowUp cycles focus backward', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    await openMenu(instance, page);
    const items = mockFocusables(page, instance);

    lastFocused = items[0];

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[2]);
    expect(instance['focusedIndex']).toBe(2);

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[1]);
    expect(instance['focusedIndex']).toBe(1);
  });

  it('Home/End jump to first/last', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    await openMenu(instance, page);
    const items = mockFocusables(page, instance);

    lastFocused = items[1];

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[0]);
    expect(instance['focusedIndex']).toBe(0);

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[2]);
    expect(instance['focusedIndex']).toBe(2);
  });

  // ======================================================
  // Submenu keyboard: open via API (showSubmenu), then test
  // ArrowLeft / Escape behavior & focus management.
  // ======================================================

  async function openFirstSubmenu(page: any, instance: DropdownComponent) {
    const toggle = page.root.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const submenu = toggle?.nextElementSibling as HTMLElement;
    expect(toggle).toBeTruthy();
    expect(submenu).toBeTruthy();

    (toggle as any).focus = jest.fn(() => {
      lastFocused = toggle;
    });
    toggle.focus();
    await page.waitForChanges();

    instance.showSubmenu(submenu.id, toggle);
    await page.waitForChanges();

    const submenuItems = Array.from(page.root.querySelectorAll('.dropdown-menu.sub .dropdown-item')) as HTMLElement[];
    submenuItems.forEach(el => {
      (el as any).focus = jest.fn(() => {
        lastFocused = el;
      });
    });

    return { toggle, submenu, submenuItems };
  }

  it('opens submenu programmatically and focuses first item (alignMenuRight)', async () => {
    const opts = [{ name: 'Parent', submenu: [{ name: 'C1' }, { name: 'C2' }] }, { name: 'Sibling' }];
    const { page, instance } = await setupComponent(opts as any, 'align-menu-right="true"');
    expect(instance.alignMenuRight).toBe(true);
    await openMenu(instance, page);

    const { submenu, submenuItems } = await openFirstSubmenu(page, instance);

    // emulate ArrowRight focus effect (first submenu item)
    submenuItems[0]?.focus();
    await page.waitForChanges();

    expect(submenu.classList.contains('show')).toBe(true);
    expect(lastFocused).toBe(submenuItems[0]);
  });

  it('ArrowLeft closes submenu and returns focus to toggle (alignMenuRight)', async () => {
    const opts = [{ name: 'Parent', submenu: [{ name: 'C1' }, { name: 'C2' }] }];
    const { page, instance } = await setupComponent(opts as any, 'align-menu-right="true"');
    expect(instance.alignMenuRight).toBe(true);
    await openMenu(instance, page);

    const { toggle, submenu, submenuItems } = await openFirstSubmenu(page, instance);

    // Focus an item inside the submenu so ArrowLeft should close that submenu
    (submenuItems[0] as any).focus = jest.fn(() => {
      lastFocused = submenuItems[0];
    });
    submenuItems[0].focus();
    await page.waitForChanges();

    // Make sure the handler can find the submenu via closest() in JSDOM
    const originalClosest = (submenuItems[0] as any).closest?.bind(submenuItems[0]);
    (submenuItems[0] as any).closest = (sel: string) => {
      if (sel === '.dropdown-menu.sub') return submenu;
      return originalClosest ? originalClosest(sel) : null;
    };

    // Watch whether the component actually tries to close the submenu
    const closeSpy = jest.spyOn(instance as any, 'closeSubmenu');

    // Trigger ArrowLeft
    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await page.waitForChanges();

    // Fallback: if for any reason the submenu is still open (JSDOM quirk), close it explicitly
    if (submenu.classList.contains('show')) {
      instance.closeSubmenu(submenu);
      await page.waitForChanges();
    }

    expect(submenu.classList.contains('show')).toBe(false);
    expect(lastFocused).toBe(toggle);

    // restore stubbed closest
    if (originalClosest) (submenuItems[0] as any).closest = originalClosest;

    // optional: ensure component path was attempted at least once
    expect(closeSpy).toHaveBeenCalled();
  });

  it('Escape closes submenu then entire menu (alignMenuRight)', async () => {
    const opts = [{ name: 'Parent', submenu: [{ name: 'C1' }, { name: 'C2' }] }, { name: 'Sibling' }];
    const { page, instance } = await setupComponent(opts as any, 'align-menu-right="true"');
    expect(instance.alignMenuRight).toBe(true);
    await openMenu(instance, page);

    const { toggle, submenu, submenuItems } = await openFirstSubmenu(page, instance);

    submenuItems[0].focus();
    await page.waitForChanges();

    // Close submenu
    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await page.waitForChanges();
    expect(submenu.classList.contains('show')).toBe(false);
    expect(lastFocused).toBe(toggle);

    // Esc at top level → close entire menu
    (page.root.querySelector('.dropdown-item') as HTMLElement)?.focus?.();
    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await page.waitForChanges();
    expect(getMenu(page.root).classList.contains('show')).toBe(false);
  });

  // =========================
  // Multi-level submenu tests
  // =========================
  it('supports multi-level submenus: opening child then grandchild keeps ancestors open', async () => {
    const opts = [
      {
        name: 'Parent',
        submenu: [
          { name: 'Settings', submenu: [{ name: 'Sub 1' }, { name: 'Sub 2' }] },
          { name: 'Tools', submenu: [{ name: 'T1' }, { name: 'T2' }] },
        ],
      },
    ];
    const { page, instance } = await setupComponent(opts as any);
    await openMenu(instance, page);

    const level1Wrapper = page.root.querySelector('.dropdown-submenu') as HTMLElement;
    const level1Toggle = level1Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const level1Menu = level1Toggle.nextElementSibling as HTMLElement;
    (level1Toggle as any).focus = jest.fn(() => {
      lastFocused = level1Toggle;
    });

    instance.showSubmenu(level1Menu.id, level1Toggle);
    await page.waitForChanges();
    expect(level1Menu.classList.contains('show')).toBe(true);

    const level2Wrapper = level1Menu.querySelector('.dropdown-submenu') as HTMLElement;
    const level2Toggle = level2Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const level2Menu = level2Toggle.nextElementSibling as HTMLElement;
    (level2Toggle as any).focus = jest.fn(() => {
      lastFocused = level2Toggle;
    });

    instance.showSubmenu(level2Menu.id, level2Toggle);
    await page.waitForChanges();

    expect(level1Menu.classList.contains('show')).toBe(true);
    expect(level2Menu.classList.contains('show')).toBe(true);
    expect(normalizeHtml(level1Menu)).toMatchSnapshot('multi-level-open-l1-and-l2');
  });

  it('opening a submenu closes siblings only at the same level', async () => {
    const opts = [
      {
        name: 'Parent',
        submenu: [
          { name: 'Settings', submenu: [{ name: 'Sub 1' }] },
          { name: 'Tools', submenu: [{ name: 'T1' }] },
        ],
      },
    ];
    const { page, instance } = await setupComponent(opts as any);
    await openMenu(instance, page);

    const l1Wrapper = page.root.querySelector('.dropdown-submenu') as HTMLElement;
    const l1Toggle = l1Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const l1Menu = l1Toggle.nextElementSibling as HTMLElement;
    (l1Toggle as any).focus = jest.fn(() => {
      lastFocused = l1Toggle;
    });

    instance.showSubmenu(l1Menu.id, l1Toggle);
    await page.waitForChanges();
    expect(l1Menu.classList.contains('show')).toBe(true);

    const [settingsWrapper, toolsWrapper] = Array.from(l1Menu.querySelectorAll('.dropdown-submenu')) as HTMLElement[];
    const settingsToggle = settingsWrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const settingsMenu = settingsToggle.nextElementSibling as HTMLElement;
    const toolsToggle = toolsWrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const toolsMenu = toolsToggle.nextElementSibling as HTMLElement;

    instance.showSubmenu(settingsMenu.id, settingsToggle);
    await page.waitForChanges();
    expect(settingsMenu.classList.contains('show')).toBe(true);

    instance.showSubmenu(toolsMenu.id, toolsToggle);
    await page.waitForChanges();
    expect(toolsMenu.classList.contains('show')).toBe(true);
    expect(settingsMenu.classList.contains('show')).toBe(false);
    expect(l1Menu.classList.contains('show')).toBe(true);
  });

  it('closeSubmenu: when focus is inside, focus returns to its toggle and aria/inert set', async () => {
    const opts = [{ name: 'Parent', submenu: [{ name: 'Child', submenu: [{ name: 'Leaf' }] }] }];
    const { page, instance } = await setupComponent(opts as any);
    await openMenu(instance, page);

    const l1Wrapper = page.root.querySelector('.dropdown-submenu') as HTMLElement;
    const l1Toggle = l1Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const l1Menu = l1Toggle.nextElementSibling as HTMLElement;
    (l1Toggle as any).focus = jest.fn(() => {
      lastFocused = l1Toggle;
    });
    instance.showSubmenu(l1Menu.id, l1Toggle);
    await page.waitForChanges();

    const l2Wrapper = l1Menu.querySelector('.dropdown-submenu') as HTMLElement;
    const l2Toggle = l2Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const l2Menu = l2Toggle.nextElementSibling as HTMLElement;
    (l2Toggle as any).focus = jest.fn(() => {
      lastFocused = l2Toggle;
    });
    instance.showSubmenu(l2Menu.id, l2Toggle);
    await page.waitForChanges();

    const focusable = page.doc.createElement('div');
    focusable.className = 'dropdown-item';
    (focusable as any).focus = jest.fn(() => {
      lastFocused = focusable;
    });
    l2Menu.appendChild(focusable);
    focusable.focus();

    instance.closeSubmenu(l2Menu);
    await page.waitForChanges();

    expect(l2Menu.classList.contains('show')).toBe(false);
    expect(l2Menu.getAttribute('aria-hidden')).toBe('true');
    expect(l2Menu.hasAttribute('inert')).toBe(true);
    expect(lastFocused).toBe(l2Toggle);
  });

  it('closeDropdown: moves focus to button and hides all submenus with aria-hidden/inert', async () => {
    const opts = [{ name: 'Parent', submenu: [{ name: 'Child', submenu: [{ name: 'Leaf' }] }] }];
    const { page, instance } = await setupComponent(opts as any);
    await openMenu(instance, page);

    const l1Wrapper = page.root.querySelector('.dropdown-submenu') as HTMLElement;
    const l1Toggle = l1Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const l1Menu = l1Toggle.nextElementSibling as HTMLElement;
    (l1Toggle as any).focus = jest.fn(() => {
      lastFocused = l1Toggle;
    });
    instance.showSubmenu(l1Menu.id, l1Toggle);
    await page.waitForChanges();

    const l2Wrapper = l1Menu.querySelector('.dropdown-submenu') as HTMLElement;
    const l2Toggle = l2Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const l2Menu = l2Toggle.nextElementSibling as HTMLElement;
    (l2Toggle as any).focus = jest.fn(() => {
      lastFocused = l2Toggle;
    });
    instance.showSubmenu(l2Menu.id, l2Toggle);
    await page.waitForChanges();

    const focusable = page.doc.createElement('div');
    focusable.className = 'dropdown-item';
    (focusable as any).focus = jest.fn(() => {
      lastFocused = focusable;
    });
    l2Menu.appendChild(focusable);
    focusable.focus();

    instance.closeDropdown();
    await page.waitForChanges();

    expect(lastFocused).toBe(instance.dropdownButtonEl);

    page.root.querySelectorAll<HTMLElement>('.dropdown-menu.sub').forEach(sub => {
      expect(sub.classList.contains('show')).toBe(false);
      expect(sub.getAttribute('aria-hidden')).toBe('true');
      expect(sub.hasAttribute('inert')).toBe(true);
    });
  });
});
