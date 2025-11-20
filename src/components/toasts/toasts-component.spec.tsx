import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ToastsComponent } from './toasts-component';

const sleep = (ms = 0) => new Promise(res => setTimeout(res, ms));

describe('toasts-component', () => {
  it('renders a standard toast (string content) and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component position="top-left"></toasts-component>,
    });

    // Keep DOM stable and avoid animations/timers
    page.root!.noAnimation = true;
    page.root!.time = '12:34:56Z';

    await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Hello',
      content: 'This is a toast',
      variantClass: 'primary',
      persistent: true,
      svgIcon: 'info-fill',
      additionalHdrContent: 'just now',
    });

    // Allow setTimeout(0) to run
    await sleep(0);
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot('standard-toast-string');
    const body = page.root!.querySelector('.toast-body');
    expect(body?.textContent).toContain('This is a toast');
    const headerStrong = page.root!.querySelector('strong.mr-auto');
    expect(headerStrong?.textContent).toBe('Hello');
  });

  it('renders HTML content via contentHtml and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component position="bottom-right"></toasts-component>,
    });

    page.root!.noAnimation = true;
    page.root!.time = '00:00:00Z';

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

    await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Solid',
      content: 'Solid body',
      variantClass: 'success',
      persistent: true,
      svgIcon: 'check-circle-fill',
      isStatus: true, // status → role="status", aria-live="polite"
    });

    await sleep(0);
    await page.waitForChanges();

    const wrapper = page.root!.querySelector('.toast');
    expect(wrapper?.getAttribute('role')).toBe('status');
    expect(wrapper?.getAttribute('aria-live')).toBe('polite');

    expect(page.root).toMatchSnapshot('solid-toast-success');
  });

  it('renders plumage toast (max) with HTML content and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [ToastsComponent],
      template: () => <toasts-component plumageToast plumageToastMax position="top-right"></toasts-component>,
    });

    page.root!.noAnimation = true;
    page.root!.time = '23:59:59Z';

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

    // Make transitions instant so we don't wait for the 500ms fade path.
    page.root!.noAnimation = true;
    await page.waitForChanges();

    // Show a toast with a very short duration.
    await (page.rootInstance as ToastsComponent).showToast({
      toastTitle: 'Auto',
      content: 'I will vanish',
      duration: 10, // 10ms auto-hide
      persistent: false, // allow auto-dismiss
    });

    // It should be in the DOM right after render.
    await Promise.resolve(); // microtask
    await page.waitForChanges();
    expect(page.root!.querySelectorAll('.toast').length).toBe(1);

    // Wait slightly longer than duration so the auto-hide fires.
    await new Promise(res => setTimeout(res, 25));
    await page.waitForChanges();

    // With noAnimation=true, startRemoveToast removes immediately.
    expect(page.root!.querySelectorAll('.toast').length).toBe(0);
  });
});
