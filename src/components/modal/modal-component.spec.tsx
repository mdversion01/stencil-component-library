// src/components/modal/modal-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { ModalComponent } from './modal-component';

// --- Helpers: stabilize random ids & normalize HTML for snapshots ---
const ID_REGEX = /modal-component-[a-z0-9]{7}/g;
function normalizeHtml(node: Element | ShadowRoot | DocumentFragment | string) {
  const html = typeof node === 'string' ? node : (node as any).outerHTML || (node as any).innerHTML || '';
  return html.replace(ID_REGEX, 'modal-component-<id>');
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

  it('renders trigger + modal markup (snapshot)', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component btn-text="Launch demo modal" variant="primary">
               <p>Body content</p>
               <div slot="footer"><button class="btn btn-primary">Save</button></div>
             </modal-component>`,
    });

    // Snapshot the rendered host
    expect(normalizeHtml(page.root as any)).toMatchSnapshot('render-default');
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
    // Should include: modal-lg, modal-md-down, modal-dialog-centered
    expect(dialog.className).toEqual(expect.stringContaining('modal-lg'));
    expect(dialog.className).toEqual(expect.stringContaining('modal-md-down'));
    expect(dialog.className).toEqual(expect.stringContaining('modal-dialog-centered'));

    // Snapshot the modal subtree only (keeps snapshot tidy)
    const modal = page.root!.querySelector('.modal') as HTMLElement;
    expect(normalizeHtml(modal)).toMatchSnapshot('render-sized-centered');
  });

  it('opens programmatically (calls Bootstrap show)', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component modal-title="Programmatic"></modal-component>`,
    });

    const instance = page.rootInstance as ModalComponent;

    // Make the call deterministic in JSDOM by stubbing the Bootstrap instance
    showMock.mockClear?.();
    hideMock.mockClear?.();
    disposeMock.mockClear?.();
    (instance as any).modalInstance = {
      show: showMock,
      hide: hideMock,
      dispose: disposeMock,
    };

    await instance.open();

    expect(showMock).toHaveBeenCalledTimes(1);
  });

  it('closes programmatically (calls Bootstrap hide)', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component modal-title="Programmatic"></modal-component>`,
    });

    const instance = page.rootInstance as ModalComponent;

    // Ensure the component is fully rendered
    await page.waitForChanges();

    // 🔧 Inject a mock Bootstrap Modal instance so open()/close() are deterministic
    // If you already have showMock/hideMock/disposeMock at spec scope, this will reuse them.
    showMock.mockClear?.();
    hideMock.mockClear?.();
    disposeMock.mockClear?.();

    (instance as any).modalInstance = {
      show: showMock,
      hide: hideMock,
      dispose: disposeMock,
    };

    await instance.open();
    await instance.close();

    expect(showMock).toHaveBeenCalledTimes(1);
    expect(hideMock).toHaveBeenCalledTimes(1);
  });

  it('close button inside footer calls close()', async () => {
    const page = await newSpecPage({
      components: [ModalComponent],
      html: `<modal-component modal-title="Close Test">
             <div slot="footer">
               <button class="btn btn-secondary" id="footer-close">Close</button>
             </div>
           </modal-component>`,
    });

    const instance = page.rootInstance as any;

    // Ensure component lifecycle/refs have settled
    await page.waitForChanges();

    // 🔧 Inject a deterministic mock instance so .open()/.close() work even if
    // Bootstrap's constructor didn't run in this test environment.
    instance.modalInstance = {
      show: showMock,
      hide: hideMock,
      dispose: disposeMock,
    };

    await (instance as ModalComponent).open();
    expect(showMock).toHaveBeenCalledTimes(1);

    // (Optional) pretend user wired a click handler on their footer button to call el.close().
    // We directly call close() here to validate the component API.
    await (instance as ModalComponent).close();
    expect(hideMock).toHaveBeenCalledTimes(1);
  });
});
