// File: src/components/toasts/toasts-component.spec.tsx

import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { ToastsComponent } from './toasts-component';

const sleep = (ms = 0): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

async function createPage(attributes = ''): Promise<SpecPage> {
  return newSpecPage({
    components: [ToastsComponent],
    html: `
      <toasts-component ${attributes}>
      </toasts-component>
    `,
  });
}

function getInstance(page: SpecPage): ToastsComponent {
  return page.rootInstance as ToastsComponent;
}

function normalizeGeneratedToastIds(root: HTMLElement): void {
  const toastElements = Array.from(root.querySelectorAll<HTMLElement>('[data-toast-id]'));

  if (toastElements.length === 0) {
    return;
  }

  const replacements = new Map<string, string>();

  toastElements.forEach((toast, index) => {
    const generatedId = toast.getAttribute('data-toast-id');

    if (!generatedId || !/^\d+$/.test(generatedId)) {
      return;
    }

    replacements.set(generatedId, `toast-test-${index + 1}`);
  });

  if (replacements.size === 0) {
    return;
  }

  const elements: Element[] = [root, ...Array.from(root.querySelectorAll('*'))];

  elements.forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      let normalizedValue = attribute.value;

      replacements.forEach((stableId, generatedId) => {
        normalizedValue = normalizedValue.split(generatedId).join(stableId);
      });

      if (normalizedValue !== attribute.value) {
        element.setAttribute(attribute.name, normalizedValue);
      }
    });
  });
}

function expectStableSnapshot(root: HTMLElement, hint: string): void {
  const snapshotRoot = root.cloneNode(true) as HTMLElement;

  normalizeGeneratedToastIds(snapshotRoot);

  expect(snapshotRoot).toMatchSnapshot(hint);
}

describe('toasts-component', () => {
  it('renders a standard toast with string content and matches snapshot', async () => {
    const page = await createPage('position="top-left"');

    page.root!.noAnimation = true;

    page.root!.toastId = 'toast-component';

    page.root!.ariaLabel = 'Notifications';

    await getInstance(page).showToast({
      toastTitle: 'Hello',
      content: 'This is a toast',
      variantClass: 'primary',
      persistent: true,
      svgIcon: 'info-fill',
      additionalHdrContent: 'just now',
    });

    await sleep(0);
    await page.waitForChanges();

    const root = page.root as HTMLElement;

    expectStableSnapshot(root, 'standard-toast-string');

    const wrapper = root.querySelector('.toast') as HTMLElement | null;

    expect(wrapper).toBeTruthy();

    expect(wrapper?.getAttribute('role')).toBe('alert');

    expect(wrapper?.getAttribute('aria-atomic')).toBe('true');

    expect(wrapper?.getAttribute('data-toast-id')).toBeTruthy();

    expect(wrapper?.classList.contains('toast-solid')).toBe(true);

    expect(wrapper?.classList.contains('toast-primary')).toBe(true);

    expect(wrapper?.classList.contains('fade')).toBe(false);

    expect(wrapper?.classList.contains('show')).toBe(true);

    expect(wrapper?.classList.contains('persistent')).toBe(true);

    const body = root.querySelector('.toast-body') as HTMLElement | null;

    expect(body?.textContent).toContain('This is a toast');

    const headerStrong = root.querySelector('strong.mr-auto') as HTMLElement | null;

    expect(headerStrong?.textContent).toBe('Hello');

    const additionalText = root.querySelector('.additional-text') as HTMLElement | null;

    expect(additionalText?.textContent).toBe('just now');

    const icon = root.querySelector('.toast-header .toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.getAttribute('viewBox')).toBe('0 0 22 22');

    expect(icon?.querySelector('path')).toBeTruthy();

    expect(root.querySelector('symbol')).toBeNull();

    expect(root.querySelector('use')).toBeNull();
  });

  it('renders HTML content via contentHtml and matches snapshot', async () => {
    const page = await createPage('position="bottom-right"');

    page.root!.noAnimation = true;

    page.root!.toastId = 'toast-component';

    page.root!.ariaLabel = 'Notifications';

    await getInstance(page).showToast({
      toastTitle: 'HTML Toast',
      contentHtml: '<div class="inner"><b>Bold</b> and <i>italic</i></div>',
      variantClass: 'danger',
      persistent: true,
      svgIcon: 'exclamation-triangle-outline',
      additionalHdrContent: '1m ago',
    });

    await sleep(0);
    await page.waitForChanges();

    const root = page.root as HTMLElement;

    const htmlContainer = root.querySelector('.toast-body-content') as HTMLElement | null;

    expect(htmlContainer).toBeTruthy();

    expect(htmlContainer?.innerHTML).toContain('<b>Bold</b> and <i>italic</i>');

    const wrapper = root.querySelector('.toast') as HTMLElement | null;

    expect(wrapper?.classList.contains('toast-danger')).toBe(true);

    const icon = root.querySelector('.toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.getAttribute('viewBox')).toBe('0 0 22 22');

    expect(icon?.querySelector('path')).toBeTruthy();

    expect(root.querySelector('symbol')).toBeNull();

    expect(root.querySelector('use')).toBeNull();

    expectStableSnapshot(root, 'standard-toast-html');
  });

  it('renders a solid toast variant and matches snapshot', async () => {
    const page = await createPage('solid-toast position="bottom-left"');

    page.root!.noAnimation = true;

    page.root!.toastId = 'toast-component';

    page.root!.ariaLabel = 'Notifications';

    await getInstance(page).showToast({
      toastTitle: 'Solid',
      content: 'Solid body',
      variantClass: 'success',
      persistent: true,
      svgIcon: 'check-circle-fill',
      isStatus: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const root = page.root as HTMLElement;

    const wrapper = root.querySelector('.toast') as HTMLElement | null;

    expect(wrapper).toBeTruthy();

    expect(wrapper?.getAttribute('role')).toBe('status');

    expect(wrapper?.classList.contains('text-bg-success')).toBe(true);

    expect(wrapper?.classList.contains('align-items-center')).toBe(true);

    expect(wrapper?.classList.contains('border-0')).toBe(true);

    expect(wrapper?.classList.contains('toast-solid')).toBe(false);

    expect(wrapper?.classList.contains('fade')).toBe(false);

    expect(wrapper?.classList.contains('show')).toBe(true);

    const content = root.querySelector('.toast-solid-content') as HTMLElement | null;

    expect(content).toBeTruthy();

    const body = root.querySelector('.toast-body') as HTMLElement | null;

    expect(body?.textContent).toContain('Solid body');

    expect(body?.classList.contains('d-flex')).toBe(true);

    expect(body?.classList.contains('align-items-center')).toBe(true);

    const icon = body?.querySelector('.toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.getAttribute('viewBox')).toBe('0 0 22 22');

    expect(icon?.querySelector('path')).toBeTruthy();

    expect(root.querySelector('symbol')).toBeNull();

    expect(root.querySelector('use')).toBeNull();

    expectStableSnapshot(root, 'solid-toast-success');
  });

  it('renders a registered icon directly as an SVG path', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Valid icon',
      svgIcon: 'info-fill',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const icon = page.root!.querySelector('.toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.getAttribute('viewBox')).toBe('0 0 22 22');

    const path = icon?.querySelector('path');

    expect(path).toBeTruthy();

    expect(path?.getAttribute('d')).toBe('M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z');

    expect(page.root!.querySelector('symbol')).toBeNull();

    expect(page.root!.querySelector('use')).toBeNull();
  });

  it('renders an icon inside a solid toast body', async () => {
    const page = await createPage('solid-toast');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Solid icon body',
      svgIcon: 'exclamation-circle-fill',
      variantClass: 'danger',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const body = page.root!.querySelector('.toast-body') as HTMLElement | null;

    expect(body).toBeTruthy();

    const icon = body?.querySelector('.toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.querySelector('path')).toBeTruthy();

    expect(body?.textContent).toContain('Solid icon body');
  });

  it('ignores unknown icons and renders no SVG', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Unknown icon',
      svgIcon: 'not-a-real-icon',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.toast-svg')).toBeNull();

    expect(page.root!.querySelector('svg')).toBeNull();

    expect(page.root!.querySelector('path')).toBeNull();

    expect(page.root!.querySelector('symbol')).toBeNull();

    expect(page.root!.querySelector('use')).toBeNull();
  });

  it('uses a default maxWidth of 350px', async () => {
    const page = await createPage();

    await page.waitForChanges();

    expect(page.root!.maxWidth).toBe(350);

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot).toBeTruthy();

    expect(slot?.style.maxWidth).toBe('350px');
  });

  it('converts a numeric max-width attribute to pixels', async () => {
    const page = await createPage('max-width="500"');

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot).toBeTruthy();

    expect(slot?.style.maxWidth).toBe('500px');
  });

  it('converts a numeric maxWidth property to pixels', async () => {
    const page = await createPage();

    page.root!.maxWidth = 640;

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(page.root!.maxWidth).toBe(640);

    expect(slot?.style.maxWidth).toBe('640px');
  });

  it('converts a numeric string maxWidth property to pixels', async () => {
    const page = await createPage();

    page.root!.maxWidth = '425';

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot?.style.maxWidth).toBe('425px');
  });

  it('supports maxWidth values with rem units', async () => {
    const page = await createPage('max-width="32rem"');

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot).toBeTruthy();

    expect(slot?.style.maxWidth).toBe('32rem');
  });

  it('supports maxWidth values with viewport units', async () => {
    const page = await createPage();

    page.root!.maxWidth = '90vw';

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot?.style.maxWidth).toBe('90vw');
  });

  it('falls back to 350px when maxWidth is an empty string', async () => {
    const page = await createPage();

    page.root!.maxWidth = '';

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot?.style.maxWidth).toBe('350px');
  });

  it('uses alert semantics by default', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Alert message',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const wrapper = page.root!.querySelector('.toast') as HTMLElement | null;

    expect(wrapper?.getAttribute('role')).toBe('alert');

    expect(wrapper?.getAttribute('aria-atomic')).toBe('true');

    expect(wrapper?.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('uses status semantics when isStatus is enabled', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Status message',
      isStatus: true,
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const wrapper = page.root!.querySelector('.toast') as HTMLElement | null;

    expect(wrapper?.getAttribute('role')).toBe('status');
  });

  it('auto-dismisses a non-persistent toast when noAnimation is enabled', async () => {
    const page = await createPage('position="bottom-right"');

    page.root!.noAnimation = true;

    page.root!.toastId = 'toast-component';

    await getInstance(page).showToast({
      toastTitle: 'Auto',
      content: 'I will vanish',
      duration: 10,
      persistent: false,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelectorAll('.toast')).toHaveLength(1);

    await sleep(25);
    await page.waitForChanges();

    expect(page.root!.querySelectorAll('.toast')).toHaveLength(0);
  });

  it('persistent toast does not auto-dismiss', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Persistent',
      duration: 5,
      persistent: true,
    });

    await sleep(20);
    await page.waitForChanges();

    expect(page.root!.querySelectorAll('.toast')).toHaveLength(1);
  });

  it('appendToast appends new toasts when enabled', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    page.root!.appendToast = true;

    const instance = getInstance(page);

    await instance.showToast({
      toastTitle: 'First',
      content: 'First body',
      persistent: true,
    });

    await instance.showToast({
      toastTitle: 'Second',
      content: 'Second body',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const titles = Array.from(page.root!.querySelectorAll('strong.mr-auto')).map(element => element.textContent);

    expect(titles).toEqual(['First', 'Second']);
  });

  it('prepends new toasts by default', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    const instance = getInstance(page);

    await instance.showToast({
      toastTitle: 'First',
      content: 'First body',
      persistent: true,
    });

    await instance.showToast({
      toastTitle: 'Second',
      content: 'Second body',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const titles = Array.from(page.root!.querySelectorAll('strong.mr-auto')).map(element => element.textContent);

    expect(titles).toEqual(['Second', 'First']);
  });

  it('focusOnShow renders a focusable toast content target', async () => {
    const page = await createPage('position="bottom-right"');

    page.root!.noAnimation = true;

    page.root!.toastId = 'toast-component';

    page.root!.focusOnShow = true;

    const id = await getInstance(page).showToast({
      toastTitle: 'Focusable',
      content: 'Focus me',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const focusTarget = page.root!.querySelector(`#toast-component__toast_${id}__content`) as HTMLElement | null;

    expect(focusTarget).toBeTruthy();

    expect(focusTarget?.getAttribute('tabindex')).toBe('0');
  });

  it('Escape key closes the focused toast', async () => {
    const page = await createPage('position="bottom-right"');

    page.root!.noAnimation = true;

    page.root!.toastId = 'toast-component';

    const id = await getInstance(page).showToast({
      toastTitle: 'Close via ESC',
      content: 'Press ESC',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const toastOuter = page.root!.querySelector(`#toast-component__toast_${id}__outer`) as HTMLElement | null;

    expect(toastOuter).toBeTruthy();

    const toastContent = page.root!.querySelector(`#toast-component__toast_${id}__content`) as HTMLElement | null;

    expect(toastContent).toBeTruthy();

    toastContent?.focus();

    toastContent?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );

    await page.waitForChanges();

    expect(page.root!.querySelectorAll('.toast')).toHaveLength(0);
  });

  it('close button removes a standard toast', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'Closable',
      content: 'Close me',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const closeButton = page.root!.querySelector('.toast-header .close') as HTMLButtonElement | null;

    expect(closeButton).toBeTruthy();

    expect(closeButton?.getAttribute('aria-label')).toBe('Close Closable');

    closeButton?.click();

    await page.waitForChanges();

    expect(page.root!.querySelectorAll('.toast')).toHaveLength(0);
  });

  it('close button removes a solid toast', async () => {
    const page = await createPage('solid-toast');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'Closable Solid',
      content: 'Close me',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const closeButton = page.root!.querySelector('.toast-solid-content .close') as HTMLButtonElement | null;

    expect(closeButton).toBeTruthy();

    expect(closeButton?.getAttribute('aria-label')).toBe('Close Closable Solid');

    closeButton?.click();

    await page.waitForChanges();

    expect(page.root!.querySelectorAll('.toast')).toHaveLength(0);
  });

  it('noCloseButton removes the close control from a standard toast', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'No Close',
      content: 'Persistent body',
      persistent: true,
      noCloseButton: true,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.close')).toBeNull();
  });

  it('noCloseButton removes the close control from a solid toast', async () => {
    const page = await createPage('solid-toast');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'No Close Solid',
      content: 'Persistent body',
      persistent: true,
      noCloseButton: true,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.close')).toBeNull();
  });

  it('renders a screen-reader notification title when toastTitle is omitted', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Body only',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const root = page.root as HTMLElement;

    const hiddenTitle = root.querySelector('.sr-only') as HTMLElement | null;

    expect(hiddenTitle?.textContent).toBe('Notification');

    const wrapper = root.querySelector('.toast') as HTMLElement | null;

    expect(wrapper?.getAttribute('aria-labelledby')).toBeNull();

    expect(wrapper?.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('uses the supplied toast title as aria-labelledby', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    page.root!.toastId = 'toast-component';

    const id = await getInstance(page).showToast({
      toastTitle: 'Accessible title',
      content: 'Accessible body',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const wrapper = page.root!.querySelector('.toast') as HTMLElement | null;

    expect(wrapper?.getAttribute('aria-labelledby')).toBe(`toast-component__toast_${id}__title`);

    expect(wrapper?.getAttribute('aria-describedby')).toBe(`toast-component__toast_${id}__body`);
  });

  it('toaster tray has region semantics and aria-label', async () => {
    const page = await createPage('position="top-left" aria-label="Messages"');

    await page.waitForChanges();

    const tray = page.root!.querySelector('#toaster-top-left') as HTMLElement | null;

    expect(tray).toBeTruthy();

    expect(tray?.getAttribute('role')).toBe('region');

    expect(tray?.getAttribute('aria-label')).toBe('Messages');

    expect(tray?.getAttribute('aria-relevant')).toBe('additions text');

    expect(tray?.getAttribute('aria-atomic')).toBe('false');

    expect(tray?.classList.contains('toaster')).toBe(true);

    expect(tray?.classList.contains('toaster-top-left')).toBe(true);

    const slot = tray?.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot).toBeTruthy();

    expect(slot?.style.maxWidth).toBe('350px');
  });
});
