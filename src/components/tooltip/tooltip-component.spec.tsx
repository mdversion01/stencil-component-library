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
if (typeof (global as any).requestAnimationFrame === 'undefined') {
  (global as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(performance.now() as any), 0) as any;
  };
}
// -----------------------------------

describe('tooltip-component', () => {
  let rafSpy: jest.SpyInstance<number, [callback: FrameRequestCallback]>;

  beforeEach(() => {
    // Make rAF immediate for deterministic positioning
    rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(performance.now());
      return 1 as any;
    });
    Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  });

  afterEach(() => {
    rafSpy?.mockRestore();
    document.body.querySelectorAll('.tooltip').forEach(el => el.remove());
  });

  it('renders on hover with plain text and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [TooltipComponent],
      html: `
        <tooltip-component id="tip1" data-original-title="Plain tooltip" data-trigger="hover focus">
          <button id="t1">Hover me</button>
        </tooltip-component>
      `,
    });

    const host = page.doc.getElementById('tip1') as HTMLElement;
    const trigger = host.querySelector('#t1') as HTMLElement;

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
    await page.waitForChanges();

    const tip = document.body.querySelector('.tooltip') as HTMLElement;
    expect(tip).toBeTruthy();

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
    await page.waitForChanges();

    const tip = document.body.querySelector('.tooltip') as HTMLElement;
    expect(tip).toBeTruthy();

    const inner = tip.querySelector('.tooltip-inner') as HTMLElement;
    expect(inner.innerHTML).toContain('<strong>Hi</strong>');
    expect(inner.innerHTML).toContain('<em>there</em>');

    expect(host).toMatchSnapshot('host__hover_html');
    expect(tip.outerHTML).toMatchSnapshot('tooltip__hover_html');
  });

  it('applies right placement class and renders on click', async () => {
    const page = await newSpecPage({
      components: [TooltipComponent],
      html: `
        <tooltip-component id="tip3" data-placement="right" data-original-title="On the right" data-trigger="click">
          <button id="t3">Click me</button>
        </tooltip-component>
      `,
    });

    const host = page.doc.getElementById('tip3') as HTMLElement;
    const trigger = host.querySelector('#t3') as HTMLElement;

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
    await page.waitForChanges();

    const tip = document.body.querySelector('.tooltip') as HTMLElement;
    expect(tip).toBeTruthy();

    // Use className string instead of classList array to avoid JSDOM quirks
    expect(tip.className.split(/\s+/)).toContain('tooltip-right');

    expect(host).toMatchSnapshot('host__click_right');
    expect(tip.outerHTML).toMatchSnapshot('tooltip__click_right');

    // Outside click should close
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    expect(document.body.querySelector('.tooltip')).toBeNull();
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

    const host = page.doc.getElementById('tip4') as HTMLElement;
    const trigger = host.querySelector('#t4') as HTMLElement;

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
    await page.waitForChanges();
    expect(document.body.querySelector('.tooltip')).toBeNull();

    // Public show()
    await (host as any).show();
    await page.waitForChanges();
    const tip = document.body.querySelector('.tooltip') as HTMLElement;
    expect(tip).toBeTruthy();

    expect(host).toMatchSnapshot('host__manual_show');
    expect(tip.outerHTML).toMatchSnapshot('tooltip__manual_show');

    // And hide()
    await (host as any).hide();
    await page.waitForChanges();
    expect(document.body.querySelector('.tooltip')).toBeNull();
  });
});
