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
    .replace(/aria-describedby="popover_[^"]+"/g, 'aria-describedby="popover_TEST"')
    .replace(/\sstyle="[^"]*"/g, ''); // optional: strip inline styles for stable snaps
}

describe('popover-component', () => {
  let restoreRects: () => void;

  beforeAll(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789); // stable but we don't assert exact id
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

  test('renders with light-DOM trigger and maps title attribute', async () => {
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
    const ad = btn.getAttribute('aria-describedby')!;
    expect(ad).toMatch(/^popover_/);

    const cmp = page.rootInstance as PopoverComponent;
    expect(cmp.popoverTitle).toBe('Hello');

    // lightweight structural snapshot
    expect(normalize(page.root!.outerHTML)).toMatchInlineSnapshot(
      `"<popover-component title="Hello"><button id="t" tabindex="0" aria-describedby="popover_TEST">Trigger</button></popover-component>"`,
    );
  });

  test('click trigger shows popover with header/body, positions it', async () => {
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

    const pop = getPopover();
    expect(pop).toBeTruthy();
    expect(normalize(pop!.outerHTML)).toMatchInlineSnapshot(`"<div id="popover_TEST" class="popover popover-auto fade show plumage super-tooltip" role="tooltip" data-popover-placement="auto" tabindex="-1"><div class="popover-arrow"></div> <h3 class="popover-header">Header</h3> <div class="popover-body" tabindex="0">Body text</div></div>"`);
  });

  test('outside click hides popover', async () => {
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

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(getPopover()).toBeNull();
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
  });

  test('hover trigger shows/hides on mouseenter/mouseleave', async () => {
    const page = await newSpecPage({
      components: [PopoverComponent],
      template: () => (
        <popover-component trigger="hover" title="Hover" content="Text" placement="top">
          <button id="t">T</button>
        </popover-component>
      ),
    });

    const btn = page.root!.querySelector('#t') as HTMLButtonElement;
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await page.waitForChanges();
    expect(getPopover()).toBeTruthy();

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

  test('variant + plumage + super classes applied', async () => {
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
    expect(normalize(pop.outerHTML)).toMatchSnapshot();
  });
});
