// src/components/toasts/toasts-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ToastsComponent } from './toasts-component';

const sleep = (ms = 0) => new Promise((res) => setTimeout(res, ms));

describe('toasts-component', () => {
  it('renders a standard toast (string content) and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component position="top-left"></toasts-component>,
    });

    // Keep DOM stable and avoid animations/timers
    page.root!.noAnimation = true;
    page.root!.time = '12:34:56Z';
    page.root!.toastId = 'toast-component'; // stable for snapshots
    page.root!.ariaLabel = 'Notifications'; // new prop, stable

    await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Hello',
      content: 'This is a toast',
      variantClass: 'primary',
      persistent: true,
      svgIcon: 'info-fill',
      additionalHdrContent: 'just now',
    });

    // Allow setTimeout(0) to run (noAnimation => 0ms)
    await sleep(0);
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot('standard-toast-string');

    const wrapper = page.root!.querySelector('.toast') as HTMLElement;
    expect(wrapper).toBeTruthy();
    // default isStatus=false => role=alert
    expect(wrapper.getAttribute('role')).toBe('alert');
    expect(wrapper.getAttribute('aria-atomic')).toBe('true');
    expect(wrapper.getAttribute('data-toast-id')).toBeTruthy();

    const body = page.root!.querySelector('.toast-body') as HTMLElement;
    expect(body?.textContent).toContain('This is a toast');

    const headerStrong = page.root!.querySelector('strong.mr-auto') as HTMLElement;
    expect(headerStrong?.textContent).toBe('Hello');
  });

  it('renders HTML content via contentHtml and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component position="bottom-right"></toasts-component>,
    });

    page.root!.noAnimation = true;
    page.root!.time = '00:00:00Z';
    page.root!.toastId = 'toast-component';
    page.root!.ariaLabel = 'Notifications';

    await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'HTML Toast',
      contentHtml: '<div class="inner"><b>Bold</b> and <i>italic</i></div>',
      variantClass: 'danger',
      persistent: true,
      svgIcon: 'exclamation-triangle-outline',
      additionalHdrContent: '1m ago',
    });

    await sleep(0);
    await page.waitForChanges();

    const htmlContainer = page.root!.querySelector('.toast-body') as HTMLElement;
    expect(htmlContainer?.innerHTML).toContain('<b>Bold</b> and <i>italic</i>');

    expect(page.root).toMatchSnapshot('standard-toast-html');
  });

  it('renders a solid toast variant and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component solidToast position="bottom-left"></toasts-component>,
    });

    page.root!.noAnimation = true;
    page.root!.time = '07:08:09Z';
    page.root!.toastId = 'toast-component';
    page.root!.ariaLabel = 'Notifications';

    await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Solid',
      content: 'Solid body',
      variantClass: 'success',
      persistent: true,
      svgIcon: 'check-circle-fill',
      isStatus: true, // status → role="status"
    });

    await sleep(0);
    await page.waitForChanges();

    const wrapper = page.root!.querySelector('.toast') as HTMLElement;
    expect(wrapper?.getAttribute('role')).toBe('status');

    expect(page.root).toMatchSnapshot('solid-toast-success');
  });

  it('renders plumage toast (max) with HTML content and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component plumageToast plumageToastMax position="top-right"></toasts-component>,
    });

    page.root!.noAnimation = true;
    page.root!.time = '23:59:59Z';
    page.root!.toastId = 'toast-component';
    page.root!.ariaLabel = 'Notifications';

    await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Plumage Max',
      contentHtml: '<div class="data"><div>Row A</div><div>Row B</div></div>',
      variantClass: 'info',
      persistent: true,
      svgIcon: 'info-fill',
      headerClass: 'hdr-x',
      bodyClass: 'body-y',
      additionalHdrContent: 'now',
    });

    await sleep(0);
    await page.waitForChanges();

    const maxBody = page.root!.querySelector('.toast-data .data') as HTMLElement;
    expect(maxBody?.innerHTML).toContain('Row A');

    expect(page.root).toMatchSnapshot('plumage-max-toast-info');
  });

  it('auto-dismiss starts on non-persistent toast (real timers, noAnimation)', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component position="bottom-right"></toasts-component>,
    });

    // Make transitions instant so we don't wait for fade path.
    page.root!.noAnimation = true;
    page.root!.toastId = 'toast-component';
    page.root!.ariaLabel = 'Notifications';
    await page.waitForChanges();

    await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Auto',
      content: 'I will vanish',
      duration: 10,
      persistent: false,
    });

    // It should be in the DOM right after render.
    await Promise.resolve(); // microtask
    await page.waitForChanges();
    expect(page.root!.querySelectorAll('.toast').length).toBe(1);

    // Wait slightly longer than duration so the auto-hide fires.
    await new Promise((res) => setTimeout(res, 25));
    await page.waitForChanges();

    // With noAnimation=true, startRemoveToast removes immediately.
    expect(page.root!.querySelectorAll('.toast').length).toBe(0);
  });

  it('focusOnShow: renders a focusable toast content target (id + tabindex) when enabled', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component position="bottom-right"></toasts-component>,
    });

    page.root!.noAnimation = true;
    page.root!.toastId = 'toast-component';
    page.root!.focusOnShow = true;

    const id = await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Focusable',
      content: 'Focus me',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    // In Stencil/JSDOM, programmatic focus may not reliably update document.activeElement.
    // So we assert the required focus target exists and is focusable.
    const focusTarget = page.root!.querySelector(
      `#toast-component__toast_${id}__content`,
    ) as HTMLElement;

    expect(focusTarget).toBeTruthy();
    expect(focusTarget.getAttribute('tabindex')).toBe('0');
  });

  it('Escape key closes the focused toast', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component position="bottom-right"></toasts-component>,
    });

    page.root!.noAnimation = true;
    page.root!.toastId = 'toast-component';

    const id = await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Close via ESC',
      content: 'Press ESC',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const toastOuter = page.root!.querySelector(
      `#toast-component__toast_${id}__outer`,
    ) as HTMLElement;
    expect(toastOuter).toBeTruthy();

    const toastContent = page.root!.querySelector(
      `#toast-component__toast_${id}__content`,
    ) as HTMLElement;
    expect(toastContent).toBeTruthy();

    // Ensure ESC event target is within the toast (listener uses closest('[data-toast-id]'))
    toastContent.focus?.();

    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    toastContent.dispatchEvent(ev);

    await page.waitForChanges();

    expect(page.root!.querySelectorAll('.toast').length).toBe(0);
  });

  it('toaster tray has region semantics + aria-label', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component position="top-left" aria-label="Messages"></toasts-component>,
    });

    await page.waitForChanges();

    const tray = page.root!.querySelector('#toaster-top-left') as HTMLElement;
    expect(tray).toBeTruthy();
    expect(tray.getAttribute('role')).toBe('region');
    expect(tray.getAttribute('aria-label')).toBe('Messages');
    expect(tray.getAttribute('aria-relevant')).toBe('additions text');
    expect(tray.getAttribute('aria-atomic')).toBe('false');
  });
});
