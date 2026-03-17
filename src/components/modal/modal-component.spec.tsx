// src/components/modal/modal-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { ModalComponent } from './modal-component';

// --- Helpers: stabilize random ids & normalize HTML for snapshots ---
const ID_REGEX = /modal-component-[a-z0-9]{7}/g;
function normalizeHtml(node: Element | ShadowRoot | DocumentFragment | string) {
  const html = typeof node === 'string' ? node : (node as any).outerHTML || (node as any).innerHTML || '';
  return html.replace(ID_REGEX, 'modal-component-<id>');
}

/**
 * Escape for attribute selector value: [id="..."].
 * Minimal escaping for quotes and backslashes so querySelector stays valid.
 */
function escapeAttrValue(v: string): string {
  return String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
function queryById(root: ParentNode, id: string): Element | null {
  const safe = escapeAttrValue(id);
  return root.querySelector(`[id="${safe}"]`);
}

let randSpy: jest.SpyInstance<number, []>;

// --- Mock Bootstrap Modal (default export) ---
const showMock = jest.fn();
const hideMock = jest.fn();
const disposeMock = jest.fn();

jest.mock('bootstrap/js/dist/modal', () => {
  const MockCtor = function (this: any) {
    // no-op; instance methods below
  } as any;

  MockCtor.prototype.show = showMock;
  MockCtor.prototype.hide = hideMock;
  MockCtor.prototype.dispose = disposeMock;

  return {
    __esModule: true,
    default: MockCtor,
  };
});

describe('modal-component', () => {
  beforeEach(() => {
    showMock.mockClear();
    hideMock.mockClear();
    disposeMock.mockClear();
    randSpy = jest.spyOn(Math, 'random').mockReturnValue(0.9999999); // => …zzzzzzz
  });

  afterEach(() => {
    randSpy?.mockRestore();
  });

  it('renders trigger + modal markup (snapshot) and includes required a11y attributes', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component btn-text="Launch demo modal" variant="primary">
               <p>Body content</p>
               <div slot="footer"><button class="btn btn-primary">Save</button></div>
             </modal-component>`,
    });

    const root = page.root as HTMLElement;
    expect(root).toBeTruthy();

    const trigger = root.querySelector('button[type="button"]') as HTMLButtonElement;
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBeTruthy();

    const modal = root.querySelector('.modal') as HTMLElement;
    expect(modal).toBeTruthy();
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');

    // aria-labelledby / aria-describedby must resolve to elements (no CSS.escape in Jest)
    const labelledby = modal.getAttribute('aria-labelledby');
    const describedby = modal.getAttribute('aria-describedby');
    expect(labelledby).toBeTruthy();
    expect(describedby).toBeTruthy();

    if (labelledby) expect(queryById(root, labelledby)).toBeTruthy();
    if (describedby) expect(queryById(root, describedby)).toBeTruthy();

    // Snapshot the rendered host
    expect(normalizeHtml(root as any)).toMatchSnapshot('render-default');
  });

  it('applies dialog size, fullscreen and centered classes (snapshot)', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component
               btn-text="Open"
               modal-title="Sized"
               modal-size="lg"
               modal-full-screen="md-down"
               vertically-centered="true">
             </modal-component>`,
    });

    const dialog = page.root!.querySelector('.modal-dialog') as HTMLElement;
    expect(dialog).toBeTruthy();
    expect(dialog.className).toEqual(expect.stringContaining('modal-lg'));
    expect(dialog.className).toEqual(expect.stringContaining('modal-md-down'));
    expect(dialog.className).toEqual(expect.stringContaining('modal-dialog-centered'));

    const modal = page.root!.querySelector('.modal') as HTMLElement;
    expect(normalizeHtml(modal)).toMatchSnapshot('render-sized-centered');
  });

  it('open() calls Bootstrap show', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component modal-title="Programmatic"></modal-component>`,
    });

    const instance = page.rootInstance as ModalComponent;

    (instance as any).modalInstance = {
      show: showMock,
      hide: hideMock,
      dispose: disposeMock,
    };

    await instance.open();
    expect(showMock).toHaveBeenCalledTimes(1);
  });

  it('close() calls Bootstrap hide and blurs active element inside modal first (best-effort)', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component modal-title="Programmatic"></modal-component>`,
    });

    const root = page.root as HTMLElement;
    const instance = page.rootInstance as any;

    await page.waitForChanges();

    instance.modalInstance = { show: showMock, hide: hideMock, dispose: disposeMock };

    const modalEl = root.querySelector('.modal') as HTMLDivElement;
    expect(modalEl).toBeTruthy();
    instance.modalEl = modalEl;

    const focused = root.ownerDocument!.createElement('button');
    focused.textContent = 'Inside';
    (focused as any).blur = jest.fn();
    modalEl.appendChild(focused);

    Object.defineProperty(root.ownerDocument, 'activeElement', {
      configurable: true,
      get() {
        return focused;
      },
    });

    await (instance as ModalComponent).open();
    await (instance as ModalComponent).close();

    expect(showMock).toHaveBeenCalledTimes(1);
    expect(hideMock).toHaveBeenCalledTimes(1);
    expect((focused as any).blur).toHaveBeenCalled();
  });

  it('trigger click records lastTrigger and calls open()', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component btn-text="Open Me"></modal-component>`,
    });

    const root = page.root as HTMLElement;
    const instance = page.rootInstance as any;

    instance.modalInstance = { show: showMock, hide: hideMock, dispose: disposeMock };

    const trigger = root.querySelector('button[type="button"]') as HTMLButtonElement;
    expect(trigger).toBeTruthy();

    trigger.click();
    await page.waitForChanges();

    expect(showMock).toHaveBeenCalledTimes(1);
    expect(instance.lastTrigger).toBe(trigger);
  });

  it('keydown Enter/Space on trigger opens (host capture path)', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component btn-text="Open Me"></modal-component>`,
    });

    const root = page.root as HTMLElement;
    const instance = page.rootInstance as any;

    instance.modalInstance = { show: showMock, hide: hideMock, dispose: disposeMock };

    const trigger = root.querySelector('button[type="button"]') as HTMLButtonElement;
    expect(trigger).toBeTruthy();

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();
    expect(showMock).toHaveBeenCalledTimes(1);

    showMock.mockClear();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await page.waitForChanges();
    expect(showMock).toHaveBeenCalledTimes(1);
  });

  it('disconnectedCallback disposes bootstrap instance (best-effort)', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component modal-title="Dispose"></modal-component>`,
    });

    const instance = page.rootInstance as any;
    instance.modalInstance = { show: showMock, hide: hideMock, dispose: disposeMock };

    instance.disconnectedCallback?.();
    expect(disposeMock).toHaveBeenCalledTimes(1);
  });
});
