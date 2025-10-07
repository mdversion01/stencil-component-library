import { newSpecPage } from '@stencil/core/testing';
import { DropdownComponent } from '../dropdown-component';

function normalizeHtml(node: Element | ShadowRoot | DocumentFragment | string) {
  const html = typeof node === 'string' ? node : (node as any).outerHTML || (node as any).innerHTML || '';
  return html
    // normalize generated component ids (dropdown-xxxxxxxxx)
    .replace(/dropdown-[a-z0-9]{9}/g, 'dropdown-<id>')
    // normalize aria-labelledby refs
    .replace(/aria-labelledby="dropdown-<id>-toggle-button"/g, 'aria-labelledby="dropdown-<id>-toggle-button"')
    // normalize aria-controls refs
    .replace(/aria-controls="dropdown-<id>-menu-root"/g, 'aria-controls="dropdown-<id>-menu-root"');
}

// Mocks to avoid async hangs
jest.mock('@popperjs/core', () => ({
  createPopper: jest.fn(() => ({ update: jest.fn(), destroy: jest.fn() })),
  Instance: class {},
}));
jest.mock('@floating-ui/dom', () => ({
  autoUpdate: jest.fn(() => jest.fn()),
}));

describe('dropdown-component (minimal test)', () => {
  let randSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    randSpy = jest.spyOn(Math, 'random').mockReturnValue(0.999999999);
  });

  afterEach(() => {
    randSpy.mockRestore();
  });

  it('smoke test: can mount and snapshot closed menu', async () => {
    const page = await newSpecPage({
      components: [DropdownComponent],
      html: '<dropdown-component></dropdown-component>',
    });
    const menu = page.root.querySelector('.dropdown-menu');
    expect(menu).toBeTruthy();
    expect(menu.classList.contains('show')).toBe(false);
    expect(normalizeHtml(page.root)).toMatchSnapshot('closed-render');
  });
});
