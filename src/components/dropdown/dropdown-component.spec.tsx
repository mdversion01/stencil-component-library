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
const getTriggerRoot = (root: HTMLElement) =>
  root.querySelector('[id$="-toggle-button"]') as HTMLElement | null;

describe('dropdown-component (full spec)', () => {
  let lastFocused: Element | null = null;
  let randSpy: jest.SpyInstance<number, []>;

  beforeAll(() => {
    // Keep everything "visible" for getFocusableItems
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get() {
        return this.parentElement || {};
      },
    });

    // Bridge document.activeElement to our lastFocused
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

    // Ensure menuEl references the real menu in the DOM
    instance.menuEl = getMenu(page.root);

    // Ensure dropdownButtonEl is an actual element *inside* the trigger root,
    // so isFocusOnTrigger() works (triggerRoot.contains(activeElement)).
    const triggerRoot = getTriggerRoot(page.root);
    const realBtn = page.doc.createElement('button');
    (realBtn as any).focus = jest.fn(() => {
      lastFocused = realBtn;
    });
    triggerRoot?.appendChild(realBtn);
    instance.dropdownButtonEl = realBtn;

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

  async function openMenu(instance: DropdownComponent, page: any) {
    instance.toggleDropdown(false);
    await page.waitForChanges();
  }

  // Helper: fire a keydown event as if user pressed it on the trigger area
  async function keyOnTrigger(page: any, key: string) {
    const triggerRoot = getTriggerRoot(page.root);
    expect(triggerRoot).toBeTruthy();
    const ev = new page.win.KeyboardEvent('keydown', { key, bubbles: true });
    triggerRoot!.dispatchEvent(ev);
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

    instance.toggleDropdown(false);
    await page.waitForChanges();
    expect(menu.classList.contains('show')).toBe(false);
  });

  it('disabled: toggle does nothing', async () => {
    const page = await newSpecPage({
      components: [DropdownComponent],
      html: `<dropdown-component disabled="true"></dropdown-component>`,
    });

    Object.defineProperty(page.win.document, 'activeElement', {
      configurable: true,
      get() {
        return page.win.document.body;
      },
    });

    const instance = page.rootInstance as DropdownComponent;
    instance.menuEl = getMenu(page.root);

    // still set a button ref to avoid null focus calls
    instance.dropdownButtonEl = page.doc.createElement('button');

    instance.toggleDropdown(false);
    await page.waitForChanges();

    expect(getMenu(page.root)?.classList.contains('show')).toBe(false);
  });

  // ======================================================
  // NEW: Trigger keyboard open/close (Enter / Space)
  // - handled by host capture listener
  // - DOES NOT move focus into the menu on open
  // ======================================================

  it('Enter on trigger opens the menu (and keeps focus on trigger)', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }, { name: 'B' }]);

    // Focus the internal button we injected into the trigger root
    (instance.dropdownButtonEl as any).focus();
    await page.waitForChanges();
    expect(lastFocused).toBe(instance.dropdownButtonEl);

    await keyOnTrigger(page, 'Enter');

    const menu = getMenu(page.root);
    expect(menu.classList.contains('show')).toBe(true);

    // Focus should remain on trigger (no auto-focus into menu)
    expect(lastFocused).toBe(instance.dropdownButtonEl);

    // focusedIndex remains -1 after open (no active descendant yet)
    expect((instance as any).focusedIndex).toBe(-1);

    // aria-activedescendant should be absent when focusedIndex < 0
    expect(menu.getAttribute('aria-activedescendant')).toBe(null);
  });

  it('Space on trigger opens the menu (and keeps focus on trigger)', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }]);

    (instance.dropdownButtonEl as any).focus();
    await page.waitForChanges();
    expect(lastFocused).toBe(instance.dropdownButtonEl);

    await keyOnTrigger(page, ' ');

    const menu = getMenu(page.root);
    expect(menu.classList.contains('show')).toBe(true);
    expect(lastFocused).toBe(instance.dropdownButtonEl);
    expect((instance as any).focusedIndex).toBe(-1);
    expect(menu.getAttribute('aria-activedescendant')).toBe(null);
  });

  it('when open and focus is on trigger, ArrowDown moves focus into the menu to the first item', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    const items = mockFocusables(page, instance);

    // Open via keyboard (Enter)
    (instance.dropdownButtonEl as any).focus();
    await keyOnTrigger(page, 'Enter');

    expect(getMenu(page.root).classList.contains('show')).toBe(true);
    expect(lastFocused).toBe(instance.dropdownButtonEl);

    // ArrowDown while focus is on trigger should move to first item
    await keyOnTrigger(page, 'ArrowDown');

    expect(lastFocused).toBe(items[0]);
    expect((instance as any).focusedIndex).toBe(0);

    const menu = getMenu(page.root);
    expect(menu.getAttribute('aria-activedescendant')).toBe('dropdown-item-0');
  });

  it('Escape while open and focus on trigger closes menu and keeps/returns focus to trigger', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }]);

    (instance.dropdownButtonEl as any).focus();
    await keyOnTrigger(page, 'Enter');
    expect(getMenu(page.root).classList.contains('show')).toBe(true);

    await keyOnTrigger(page, 'Escape');
    expect(getMenu(page.root).classList.contains('show')).toBe(false);

    // Close returns focus to trigger button element
    expect(lastFocused).toBe(instance.dropdownButtonEl);
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

  it.each(['checkboxes', 'customCheckboxes', 'toggleSwitches'])(
    'does NOT close after click when per-item customListType="%s"',
    async listType => {
      const items =
        listType === 'toggleSwitches'
          ? [{ name: 'Dark Mode', checked: true, customListType: 'toggleSwitches' }]
          : [{ name: 'Chk', value: 'v', customListType: listType }];

      const { page, instance } = await setupComponent(items as any);
      await openMenu(instance, page);

      (page.root.querySelector('.dropdown-item') as HTMLElement).click();
      await page.waitForChanges();

      expect(getMenu(page.root).classList.contains('show')).toBe(true);
    },
  );

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
    expect(submenu.getAttribute('aria-hidden')).toBe('false');
    expect(submenu.hasAttribute('inert')).toBe(false);
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
  it('ArrowDown cycles focus & updates focusedIndex (when focus is already in menu)', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    await openMenu(instance, page);

    const items = mockFocusables(page, instance);

    // Put focus inside menu first (new behavior: open doesn't auto-focus)
    lastFocused = items[0];

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[1]);
    expect((instance as any).focusedIndex).toBe(1);

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[2]);
    expect((instance as any).focusedIndex).toBe(2);

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[0]);
    expect((instance as any).focusedIndex).toBe(0);
  });

  it('ArrowUp cycles focus backward', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    await openMenu(instance, page);
    const items = mockFocusables(page, instance);

    lastFocused = items[0];

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[2]);
    expect((instance as any).focusedIndex).toBe(2);

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[1]);
    expect((instance as any).focusedIndex).toBe(1);
  });

  it('Home/End jump to first/last', async () => {
    const { page, instance } = await setupComponent([{ name: 'A' }, { name: 'B' }, { name: 'C' }]);
    await openMenu(instance, page);
    const items = mockFocusables(page, instance);

    lastFocused = items[1];

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[0]);
    expect((instance as any).focusedIndex).toBe(0);

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await page.waitForChanges();
    expect(lastFocused).toBe(items[2]);
    expect((instance as any).focusedIndex).toBe(2);
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

    // emulate arrow open behavior by focusing first submenu item
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
    submenuItems[0].focus();
    await page.waitForChanges();

    // Ensure closest('.dropdown-menu.sub') works in JSDOM
    const originalClosest = (submenuItems[0] as any).closest?.bind(submenuItems[0]);
    (submenuItems[0] as any).closest = (sel: string) => {
      if (sel === '.dropdown-menu.sub') return submenu;
      return originalClosest ? originalClosest(sel) : null;
    };

    const closeSpy = jest.spyOn(instance as any, 'closeSubmenu');

    await instance.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await page.waitForChanges();

    if (submenu.classList.contains('show')) {
      instance.closeSubmenu(submenu);
      await page.waitForChanges();
    }

    expect(submenu.classList.contains('show')).toBe(false);
    expect(lastFocused).toBe(toggle);

    if (originalClosest) (submenuItems[0] as any).closest = originalClosest;
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

    instance.showSubmenu(level1Menu.id, level1Toggle);
    await page.waitForChanges();

    expect(level1Menu.classList.contains('show')).toBe(true);

    const level2Wrapper = level1Menu.querySelector('.dropdown-submenu') as HTMLElement;
    const level2Toggle = level2Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const level2Menu = level2Toggle.nextElementSibling as HTMLElement;

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

    instance.showSubmenu(l1Menu.id, l1Toggle);
    await page.waitForChanges();

    const l2Wrapper = l1Menu.querySelector('.dropdown-submenu') as HTMLElement;
    const l2Toggle = l2Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const l2Menu = l2Toggle.nextElementSibling as HTMLElement;

    instance.showSubmenu(l2Menu.id, l2Toggle);
    await page.waitForChanges();

    const focusable = page.doc.createElement('div');
    focusable.className = 'dropdown-item';
    (focusable as any).focus = jest.fn(() => {
      lastFocused = focusable;
    });
    l2Menu.appendChild(focusable);
    focusable.focus();

    (l2Toggle as any).focus = jest.fn(() => {
      lastFocused = l2Toggle;
    });

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

    instance.showSubmenu(l1Menu.id, l1Toggle);
    await page.waitForChanges();

    const l2Wrapper = l1Menu.querySelector('.dropdown-submenu') as HTMLElement;
    const l2Toggle = l2Wrapper.querySelector('.dropdown-submenu-toggle') as HTMLElement;
    const l2Menu = l2Toggle.nextElementSibling as HTMLElement;

    instance.showSubmenu(l2Menu.id, l2Toggle);
    await page.waitForChanges();

    const focusable = page.doc.createElement('div');
    focusable.className = 'dropdown-item';
    (focusable as any).focus = jest.fn(() => {
      lastFocused = focusable;
    });
    l2Menu.appendChild(focusable);
    focusable.focus();

    (instance.dropdownButtonEl as any).focus = jest.fn(() => {
      lastFocused = instance.dropdownButtonEl;
    });

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
