// src/components/popover/popover-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PopoverComponent } from './popover-component';

const triggerRect = { top: 100, left: 100, right: 150, bottom: 130, width: 50, height: 30, x: 100, y: 100, toJSON() {} };
const popoverRect = { top: 0, left: 0, right: 120, bottom: 80, width: 120, height: 80, x: 0, y: 0, toJSON() {} };

function mockRects() {
  const original = Element.prototype.getBoundingClientRect;
  // @ts-ignore
  Element.prototype.getBoundingClientRect = function () {
    const el = this as HTMLElement;
    if (el.id === 't') return triggerRect as any;
    if (el.classList?.contains('popover')) return popoverRect as any;
    return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON() {} } as any;
  };
  return () => {
    Element.prototype.getBoundingClientRect = original;
  };
}

function getPopover(): HTMLElement | null {
  return document.body.querySelector('.popover');
}

function normalize(html: string) {
  return html
    .replace(/id="popover_[^"]+"/g, 'id="popover_TEST"')
    .replace(/aria-controls="popover_[^"]+"/g, 'aria-controls="popover_TEST"')
    .replace(/aria-describedby="popover_[^"]+"/g, 'aria-describedby="popover_TEST"')
    .replace(/aria-labelledby="popover_[^"]+-title"/g, 'aria-labelledby="popover_TEST-title"')
    .replace(/id="popover_[^"]+-title"/g, 'id="popover_TEST-title"')
    .replace(/id="popover_[^"]+-body"/g, 'id="popover_TEST-body"')
    .replace(/aria-describedby="popover_[^"]+-body"/g, 'aria-describedby="popover_TEST-body"')
    .replace(/\sstyle="[^"]*"/g, '');
}

describe('popover-component', () => {
  let restoreRects: () => void;

  beforeAll(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
  });

  afterAll(() => {
    (Math.random as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    restoreRects = mockRects();
  });

  afterEach(() => {
    restoreRects();
    document.body.querySelectorAll('.popover').forEach(n => n.remove());
  });

  test('renders with light-DOM trigger and maps title attribute (click default => aria-controls/expanded)', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        <popover-component title="Hello" content="World">
          <button id="t">Trigger</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    const ac = btn.getAttribute('aria-controls')!;
    expect(ac).toMatch(/^popover_/);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
    expect(btn.getAttribute('aria-describedby')).toBeNull();

    const cmp = page.rootInstance as PopoverComponent;
    expect(cmp.popoverTitle).toBe('Hello');

    expect(normalize(page.root!.outerHTML)).toMatchInlineSnapshot(
      `"<popover-component title="Hello"><button id="t" tabindex="0" aria-haspopup="dialog" aria-controls="popover_TEST" aria-expanded="false">Trigger</button></popover-component>"`,
    );
  });

  test('click trigger shows popover as dialog with labelledby/descrby ids; trigger reflects expanded', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        <popover-component title="Header" content="Body text" variant="primary" plumage super placement="auto">
          <button id="t">T</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();

    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.getAttribute('aria-controls')).toMatch(/^popover_/);

    const pop = getPopover();
    expect(pop).toBeTruthy();

    expect(pop!.getAttribute('role')).toBe('dialog');
    expect(pop!.getAttribute('aria-modal')).toBe('false');

    expect(pop!.getAttribute('aria-labelledby')).toMatch(/^popover_.*-title$/);
    expect(pop!.getAttribute('aria-describedby')).toMatch(/^popover_.*-body$/);

    const titleEl = pop!.querySelector('.popover-header') as HTMLElement | null;
    const bodyEl = pop!.querySelector('.popover-body') as HTMLElement | null;
    expect(titleEl?.id).toMatch(/^popover_.*-title$/);
    expect(bodyEl?.id).toMatch(/^popover_.*-body$/);

    expect(normalize(pop!.outerHTML)).toMatchInlineSnapshot(`"<div id="popover_TEST" class="popover fade show plumage super-tooltip primary" tabindex="-1" role="dialog" aria-modal="false" aria-labelledby="popover_TEST-title" aria-describedby="popover_TEST"><div class="popover-arrow" data-popper-arrow></div> <h3 class="popover-header" id="popover_TEST">Header</h3> <div class="popover-body" tabindex="0" id="popover_TEST">Body text</div></div>"`);
  });

  test('outside click hides popover and updates aria-expanded', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        <popover-component title="X" content="Y">
          <button id="t">T</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();
    expect(getPopover()).toBeTruthy();
    expect(btn.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(getPopover()).toBeNull();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  test('Escape hides popover and returns focus to trigger', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        <popover-component title="A" content="B">
          <button id="t">T</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();

    const pop = getPopover()!;
    expect(pop).toBeTruthy();

    pop.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await page.waitForChanges();

    expect(getPopover()).toBeNull();
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  test('hover trigger shows/hides on mouseenter/mouseleave (tooltip semantics + describedby)', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        <popover-component trigger="hover" title="Hover" content="Text" placement="top">
          <button id="t">T</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;

    const ad = btn.getAttribute('aria-describedby')!;
    expect(ad).toMatch(/^popover_/);
    expect(btn.getAttribute('aria-controls')).toBeNull();
    expect(btn.getAttribute('aria-expanded')).toBeNull();

    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await page.waitForChanges();

    const pop = getPopover();
    expect(pop).toBeTruthy();
    expect(pop!.getAttribute('role')).toBe('tooltip');
    expect(pop!.getAttribute('aria-hidden')).toBe('false');

    btn.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await page.waitForChanges();
    expect(getPopover()).toBeNull();
  });

  test('arrowOff removes the arrow element', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        <popover-component title="No Arrow" content="Body" arrowOff>
          <button id="t">T</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();

    const pop = getPopover()!;
    expect(pop.querySelector('.popover-arrow')).toBeNull();
  });

  test('variant + plumage + super classes applied (click mode snapshot)', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        <popover-component title="V" content="C" variant="danger" plumage super>
          <button id="t">T</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();

    const pop = getPopover()!;
    expect(pop.className).toContain('plumage');
    expect(pop.className).toContain('super-tooltip');
    expect(pop.className).toContain('danger');

    expect(normalize(pop.outerHTML)).toMatchInlineSnapshot(`"<div id="popover_TEST" class="popover fade show plumage super-tooltip danger" tabindex="-1" role="dialog" aria-modal="false" aria-labelledby="popover_TEST-title" aria-describedby="popover_TEST"><div class="popover-arrow" data-popper-arrow></div> <h3 class="popover-header" id="popover_TEST">V</h3> <div class="popover-body" tabindex="0" id="popover_TEST">C</div></div>"`);
  });

  test('a11y override props apply on dialog (aria-label used when no header => no aria-labelledby)', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        // No title => no header => component won't set aria-labelledby automatically.
        <popover-component content="Body" aria-label="Custom label">
          <button id="t">T</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;
    btn.click();
    await page.waitForChanges();

    const pop = getPopover()!;
    expect(pop.getAttribute('role')).toBe('dialog');

    // ✅ now this is expected to exist
    expect(pop.getAttribute('aria-label')).toBe('Custom label');

    // still describes by body
    expect(pop.getAttribute('aria-describedby')).toMatch(/^popover_.*-body$/);

    // and should NOT have aria-labelledby since no header
    expect(pop.getAttribute('aria-labelledby')).toBeNull();
  });
});
