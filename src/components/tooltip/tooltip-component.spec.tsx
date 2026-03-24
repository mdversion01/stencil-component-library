// src/components/tooltip/tooltip-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { TooltipComponent } from './tooltip-component';

// --- Polyfills for the test env ---
if (typeof (global as any).MutationObserver === 'undefined') {
  (global as any).MutationObserver = class {
    constructor(_cb: MutationCallback) {}
    observe() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as any;
}

if (typeof (global as any).ResizeObserver === 'undefined') {
  (global as any).ResizeObserver = class {
    constructor(_cb: ResizeObserverCallback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

if (typeof (global as any).requestAnimationFrame === 'undefined') {
  (global as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now() as any), 0) as any;
  };
}
// -----------------------------------

const flush = async (page: any) => {
  // Stencil often needs a microtask + waitForChanges to flush lifecycle/DOM updates
  await Promise.resolve();
  await page.waitForChanges();
};

// helper: split aria-describedby tokens
const splitIds = (v: string | null) =>
  String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

describe('tooltip-component', () => {
  let rafSpy: jest.SpyInstance<any, any>;

  beforeEach(() => {
    // Make rAF immediate for deterministic positioning
    rafSpy = jest.spyOn(globalThis as any, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(Date.now() as any);
      return 1 as any;
    });

    Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  });

  afterEach(() => {
    rafSpy?.mockRestore();
    document.body.querySelectorAll('.tooltip').forEach(el => el.remove());
  });

  it('wires trigger a11y attributes and shows on hover (plain text)', async () => {
    const page = await newSpecPage({
      components: [TooltipComponent],
      html: `
        <tooltip-component id="tip1" data-original-title="Plain tooltip" data-trigger="hover focus">
          <button id="t1">Hover me</button>
        </tooltip-component>
      `,
    });

    // Ensure componentDidLoad ran and applyTriggers executed
    await flush(page);

    const host = page.doc.getElementById('tip1') as HTMLElement;
    const trigger = host.querySelector('#t1') as HTMLElement;
    expect(host).toBeTruthy();
    expect(trigger).toBeTruthy();

    // Trigger wiring (applied in applyTriggers)
    // NOTE: buttons are naturally focusable, so tabindex may be absent (null).
    const tabindex = trigger.getAttribute('tabindex');
    expect(tabindex === null || tabindex === '0').toBe(true);

    expect(trigger.getAttribute('data-toggle')).toBe('tooltip');
    expect(trigger.getAttribute('data-placement')).toBe('top'); // default prop
    expect(trigger.getAttribute('aria-expanded')).toBe('false'); // initial state
    expect(trigger.getAttribute('aria-haspopup')).toBeNull(); // hover/focus only => no haspopup

    const describedby = trigger.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();

    // The tooltip id is generated; describedby must include it as a token.
    const describedIds = splitIds(describedby);
    expect(describedIds.length).toBeGreaterThan(0);

    // Stable id wiring: aria-describedby points at the tooltip id (among tokens)
    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      x: 200,
      y: 300,
      top: 300,
      left: 200,
      bottom: 340,
      right: 280,
      width: 80,
      height: 40,
      toJSON: () => {},
    } as any);

    trigger.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    await flush(page);

    const tip = document.body.querySelector('.tooltip') as HTMLElement;
    expect(tip).toBeTruthy();
    expect(tip.getAttribute('role')).toBe('tooltip');

    // describedby must include the created tooltip's id
    expect(describedIds).toContain(tip.id);

    // expanded should now be true
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    expect(host).toMatchSnapshot('host__hover_plain');
    expect(tip.outerHTML).toMatchSnapshot('tooltip__hover_plain');
  });

  it('renders HTML content when provided and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [TooltipComponent],
      html: `
        <tooltip-component id="tip2"
          data-original-title="<span><strong>Hi</strong> <em>there</em></span>"
          data-trigger="hover focus"
          data-html>
          <button id="t2">Hover me</button>
        </tooltip-component>
      `,
    });

    await flush(page);

    const host = page.doc.getElementById('tip2') as HTMLElement;
    const trigger = host.querySelector('#t2') as HTMLElement;

    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 100,
      top: 100,
      left: 100,
      bottom: 140,
      right: 180,
      width: 80,
      height: 40,
      toJSON: () => {},
    } as any);

    trigger.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    await flush(page);

    const tip = document.body.querySelector('.tooltip') as HTMLElement;
    expect(tip).toBeTruthy();

    const inner = tip.querySelector('.tooltip-inner') as HTMLElement;
    expect(inner.innerHTML).toContain('<strong>Hi</strong>');
    expect(inner.innerHTML).toContain('<em>there</em>');

    expect(host).toMatchSnapshot('host__hover_html');
    expect(tip.outerHTML).toMatchSnapshot('tooltip__hover_html');
  });

  it('applies right placement class and renders on click; outside click closes', async () => {
    const page = await newSpecPage({
      components: [TooltipComponent],
      html: `
        <tooltip-component id="tip3" data-placement="right" data-original-title="On the right" data-trigger="click">
          <button id="t3">Click me</button>
        </tooltip-component>
      `,
    });

    await flush(page);

    const host = page.doc.getElementById('tip3') as HTMLElement;
    const trigger = host.querySelector('#t3') as HTMLElement;

    // click/manual => aria-haspopup should be present
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      x: 600,
      y: 400,
      top: 400,
      left: 600,
      bottom: 440,
      right: 680,
      width: 80,
      height: 40,
      toJSON: () => {},
    } as any);

    trigger.dispatchEvent(new Event('click', { bubbles: true }));
    await flush(page);

    const tip = document.body.querySelector('.tooltip') as HTMLElement;
    expect(tip).toBeTruthy();
    expect(tip.className.split(/\s+/)).toContain('tooltip-right');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    expect(host).toMatchSnapshot('host__click_right');
    expect(tip.outerHTML).toMatchSnapshot('tooltip__click_right');

    // Outside click should close
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush(page);
    expect(document.body.querySelector('.tooltip')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('manual mode: show()/hide() only when trigger includes "manual"', async () => {
    const page = await newSpecPage({
      components: [TooltipComponent],
      html: `
        <tooltip-component id="tip4" data-original-title="Manual tip" data-trigger="manual">
          <button id="t4">Manual</button>
        </tooltip-component>
      `,
    });

    await flush(page);

    const host = page.doc.getElementById('tip4') as HTMLElement;
    const trigger = host.querySelector('#t4') as HTMLElement;

    // manual => aria-haspopup present, expanded false initially
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      x: 50,
      y: 50,
      top: 50,
      left: 50,
      bottom: 90,
      right: 130,
      width: 80,
      height: 40,
      toJSON: () => {},
    } as any);

    // Hover should NOT show in manual mode
    trigger.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    await flush(page);
    expect(document.body.querySelector('.tooltip')).toBeNull();

    // Public show()
    await (host as any).show();
    await flush(page);

    const tip = document.body.querySelector('.tooltip') as HTMLElement;
    expect(tip).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    expect(host).toMatchSnapshot('host__manual_show');
    expect(tip.outerHTML).toMatchSnapshot('tooltip__manual_show');

    // And hide()
    await (host as any).hide();
    await flush(page);
    expect(document.body.querySelector('.tooltip')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
