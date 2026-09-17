// File: src/components/plumage-toasts/plumage-toasts-component.spec.tsx

import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { PlumageToastsComponent } from './plumage-toasts-component';

const sleep = (ms = 0): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

async function createPage(attributes = ''): Promise<SpecPage> {
  return newSpecPage({
    components: [PlumageToastsComponent],
    html: `
      <plumage-toasts-component ${attributes}>
      </plumage-toasts-component>
    `,
  });
}

function getInstance(page: SpecPage): PlumageToastsComponent {
  return page.rootInstance as PlumageToastsComponent;
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

describe('plumage-toasts-component', () => {
  it('renders a standard Plumage toast with string content and matches snapshot', async () => {
    const page = await createPage('position="top-left"');

    page.root!.noAnimation = true;

    page.root!.time = '12:34:56Z';

    page.root!.toastId = 'plumage-toast-component';

    page.root!.ariaLabel = 'Notifications';

    await getInstance(page).showToast({
      toastTitle: 'Hello',
      content: 'This is a toast',
      iconVariantClass: 'primary',
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

    expect(wrapper?.classList.contains('fade')).toBe(false);

    const standardToast = root.querySelector('.toast-display:not(.toast-max)') as HTMLElement | null;

    expect(standardToast).toBeTruthy();

    expect(root.querySelector('.toast-max')).toBeNull();

    const body = root.querySelector('.toast-body') as HTMLElement | null;

    expect(body?.textContent).toContain('This is a toast');

    const titleWrapper = root.querySelector('.toast-title-wrapper') as HTMLElement | null;

    expect(titleWrapper).toBeTruthy();

    const title = titleWrapper?.querySelector('.mr-auto.mb-0') as HTMLElement | null;

    expect(title?.textContent).toBe('Hello');

    const additionalHeader = titleWrapper?.querySelector('.toast-additional-header-content') as HTMLElement | null;

    expect(additionalHeader?.textContent).toBe('just now');

    const time = root.querySelector('.toast-time') as HTMLElement | null;

    expect(time?.textContent).toBe('12:34:56Z');

    expect(root.querySelector('.toast-icon')).toBeNull();

    expect(root.querySelector('.toast-svg')).toBeNull();

    expect(root.querySelector('symbol')).toBeNull();

    expect(root.querySelector('use')).toBeNull();
  });

  it('renders standard Plumage toast HTML content and matches snapshot', async () => {
    const page = await createPage('position="bottom-right"');

    page.root!.noAnimation = true;

    page.root!.time = '00:00:00Z';

    page.root!.toastId = 'plumage-toast-component';

    page.root!.ariaLabel = 'Notifications';

    await getInstance(page).showToast({
      toastTitle: 'HTML Toast',
      contentHtml: '<div class="inner"><b>Bold</b> and <i>italic</i></div>',
      iconVariantClass: 'danger',
      persistent: true,
      svgIcon: 'exclamation-triangle-outline',
      additionalHdrContent: '1m ago',
    });

    await sleep(0);
    await page.waitForChanges();

    const root = page.root as HTMLElement;

    const htmlContainer = root.querySelector('.toast-body') as HTMLElement | null;

    expect(htmlContainer?.innerHTML).toContain('<b>Bold</b> and <i>italic</i>');

    expect(root.querySelector('.toast-display:not(.toast-max)')).toBeTruthy();

    expect(root.querySelector('.toast-max')).toBeNull();

    expect(root.querySelector('.toast-title-wrapper')).toBeTruthy();

    expect(root.querySelector('.toast-time')?.textContent).toBe('00:00:00Z');

    expect(root.querySelector('.toast-svg')).toBeNull();

    expect(root.querySelector('symbol')).toBeNull();

    expect(root.querySelector('use')).toBeNull();

    expectStableSnapshot(root, 'standard-toast-html');
  });

  it('renders a standard Plumage status toast and matches snapshot', async () => {
    const page = await createPage('position="bottom-left"');

    page.root!.noAnimation = true;

    page.root!.time = '07:08:09Z';

    page.root!.toastId = 'plumage-toast-component';

    page.root!.ariaLabel = 'Notifications';

    await getInstance(page).showToast({
      toastTitle: 'Success',
      content: 'Success body',
      iconVariantClass: 'success',
      persistent: true,
      svgIcon: 'check-circle-fill',
      isStatus: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const root = page.root as HTMLElement;

    const wrapper = root.querySelector('.toast') as HTMLElement | null;

    expect(wrapper?.getAttribute('role')).toBe('status');

    expect(root.querySelector('.toast-display:not(.toast-max)')).toBeTruthy();

    expect(root.querySelector('.toast-max')).toBeNull();

    expect(root.querySelector('.toast-svg')).toBeNull();

    expect(root.querySelector('.toast-time')?.textContent).toBe('07:08:09Z');

    expectStableSnapshot(root, 'status-toast-success');
  });

  it('renders Plumage Max toast with HTML content and matches snapshot', async () => {
    const page = await createPage('plumage-toast-max position="top-right"');

    page.root!.noAnimation = true;

    page.root!.time = '23:59:59Z';

    page.root!.toastId = 'plumage-toast-component';

    page.root!.ariaLabel = 'Notifications';

    await getInstance(page).showToast({
      toastTitle: 'Plumage Max',
      contentHtml: '<div class="data"><div>Row A</div><div>Row B</div></div>',
      iconVariantClass: 'info',
      persistent: true,
      svgIcon: 'info-fill',
      headerClass: 'hdr-x',
      bodyClass: 'body-y',
      additionalHdrContent: 'now',
    });

    await sleep(0);
    await page.waitForChanges();

    const root = page.root as HTMLElement;

    const maxToast = root.querySelector('.toast-max.toast-display') as HTMLElement | null;

    expect(maxToast).toBeTruthy();

    const maxBody = root.querySelector('.toast-data .data') as HTMLElement | null;

    expect(maxBody?.innerHTML).toContain('Row A');

    expect(maxBody?.innerHTML).toContain('Row B');

    const icon = root.querySelector('.toast-icon .toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.getAttribute('viewBox')).toBe('0 0 22 22');

    expect(icon?.getAttribute('style')).toContain('fill: #5c9be6');

    const path = icon?.querySelector('path');

    expect(path).toBeTruthy();

    expect(path?.getAttribute('d')).toBeTruthy();

    expect(root.querySelector('.toast-time')).toBeNull();

    expect(root.querySelector('symbol')).toBeNull();

    expect(root.querySelector('use')).toBeNull();

    expectStableSnapshot(root, 'plumage-max-toast-info');
  });

  it('supports only standard and Plumage Max layouts', async () => {
    const standardPage = await createPage();

    standardPage.root!.noAnimation = true;

    await getInstance(standardPage).showToast({
      toastTitle: 'Standard',
      content: 'Standard body',
      persistent: true,
    });

    await sleep(0);
    await standardPage.waitForChanges();

    expect(standardPage.root!.querySelector('.toast-display:not(.toast-max)')).toBeTruthy();

    expect(standardPage.root!.querySelector('.toast-max')).toBeNull();

    const maxPage = await createPage('plumage-toast-max');

    maxPage.root!.noAnimation = true;

    await getInstance(maxPage).showToast({
      toastTitle: 'Max',
      content: 'Max body',
      persistent: true,
    });

    await sleep(0);
    await maxPage.waitForChanges();

    expect(maxPage.root!.querySelector('.toast-max.toast-display')).toBeTruthy();

    expect(maxPage.root!.querySelector('.toast-display:not(.toast-max)')).toBeNull();
  });

  it('renders an icon only in the Plumage Max layout', async () => {
    const standardPage = await createPage();

    standardPage.root!.noAnimation = true;

    await getInstance(standardPage).showToast({
      toastTitle: 'Standard',
      content: 'Standard body',
      svgIcon: 'info-fill',
      iconVariantClass: 'info',
      persistent: true,
    });

    await sleep(0);
    await standardPage.waitForChanges();

    expect(standardPage.root!.querySelector('.toast-icon')).toBeNull();

    expect(standardPage.root!.querySelector('.toast-svg')).toBeNull();

    expect(standardPage.root!.querySelector('path')).toBeNull();

    const maxPage = await createPage('plumage-toast-max');

    maxPage.root!.noAnimation = true;

    await getInstance(maxPage).showToast({
      toastTitle: 'Max',
      content: 'Max body',
      svgIcon: 'info-fill',
      iconVariantClass: 'info',
      persistent: true,
    });

    await sleep(0);
    await maxPage.waitForChanges();

    const icon = maxPage.root!.querySelector('.toast-icon .toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.querySelector('path')).toBeTruthy();
  });

  it('renders the registered SVG path directly inside a Plumage Max toast', async () => {
    const page = await createPage('plumage-toast-max');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'Information',
      content: 'Information body',
      svgIcon: 'info-fill',
      iconVariantClass: 'info',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const icon = page.root!.querySelector('.toast-icon .toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.getAttribute('viewBox')).toBe('0 0 22 22');

    const path = icon?.querySelector('path');

    expect(path).toBeTruthy();

    expect(path?.getAttribute('d')).toBe('M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z');

    expect(page.root!.querySelector('symbol')).toBeNull();

    expect(page.root!.querySelector('use')).toBeNull();
  });

  it('does not render an icon container for an unknown icon id', async () => {
    const page = await createPage('plumage-toast-max');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'Unknown icon',
      content: 'Body',
      svgIcon: 'not-a-real-icon',
      iconVariantClass: 'info',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.toast-icon')).toBeNull();

    expect(page.root!.querySelector('.toast-svg')).toBeNull();

    expect(page.root!.querySelector('path')).toBeNull();

    expect(page.root!.querySelector('symbol')).toBeNull();

    expect(page.root!.querySelector('use')).toBeNull();
  });

  it('applies icon variant color to a Plumage Max icon', async () => {
    const page = await createPage('plumage-toast-max');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'Success',
      content: 'Saved',
      svgIcon: 'check-circle-fill',
      iconVariantClass: 'success',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const icon = page.root!.querySelector('.toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.getAttribute('style')).toContain('fill: #2d9d78');

    expect(icon?.querySelector('path')).toBeTruthy();
  });

  it('uses currentColor when no icon variant is supplied', async () => {
    const page = await createPage('plumage-toast-max');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'Default icon color',
      content: 'Body',
      svgIcon: 'info-fill',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const icon = page.root!.querySelector('.toast-svg') as SVGElement | null;

    expect(icon).toBeTruthy();

    expect(icon?.getAttribute('style')).toContain('fill: currentColor');
  });

  it('uses a default maxWidth of 550px', async () => {
    const page = await createPage();

    await page.waitForChanges();

    expect(page.root!.maxWidth).toBe(550);

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot).toBeTruthy();

    expect(slot?.style.maxWidth).toBe('550px');
  });

  it('converts a numeric max-width attribute to pixels', async () => {
    const page = await createPage('max-width="700"');

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot).toBeTruthy();

    expect(slot?.style.maxWidth).toBe('700px');
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

    page.root!.maxWidth = '625';

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot?.style.maxWidth).toBe('625px');
  });

  it('supports maxWidth values with rem units', async () => {
    const page = await createPage('max-width="42rem"');

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot).toBeTruthy();

    expect(slot?.style.maxWidth).toBe('42rem');
  });

  it('supports maxWidth values with viewport units', async () => {
    const page = await createPage();

    page.root!.maxWidth = '90vw';

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot?.style.maxWidth).toBe('90vw');
  });

  it('falls back to 550px when maxWidth is an empty string', async () => {
    const page = await createPage();

    page.root!.maxWidth = '';

    await page.waitForChanges();

    const slot = page.root!.querySelector('.toaster-slot') as HTMLElement | null;

    expect(slot?.style.maxWidth).toBe('550px');
  });

  it('renders the time on a standard Plumage toast by default', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    page.root!.time = '10:11:12Z';

    await getInstance(page).showToast({
      toastTitle: 'Timed Toast',
      content: 'Body',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const time = page.root!.querySelector('.toast-time') as HTMLElement | null;

    expect(time).toBeTruthy();

    expect(time?.textContent).toBe('10:11:12Z');
  });

  it('does not render the time when noTime is true for a toast', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    page.root!.time = '10:11:12Z';

    await getInstance(page).showToast({
      toastTitle: 'No Time',
      content: 'Body',
      persistent: true,
      noTime: true,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.toast-time')).toBeNull();
  });

  it('does not render the time when the component noTime prop is enabled', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    page.root!.time = '10:11:12Z';

    page.root!.noTime = true;

    await getInstance(page).showToast({
      toastTitle: 'No Component Time',
      content: 'Body',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.toast-time')).toBeNull();
  });

  it('does not render the time when the no-time attribute is present', async () => {
    const page = await createPage('no-time');

    page.root!.noAnimation = true;

    page.root!.time = '10:11:12Z';

    await getInstance(page).showToast({
      toastTitle: 'No Attribute Time',
      content: 'Body',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.noTime).toBe(true);

    expect(page.root!.querySelector('.toast-time')).toBeNull();
  });

  it('does not render the time when an empty time string is supplied', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    page.root!.time = '10:11:12Z';

    await getInstance(page).showToast({
      toastTitle: 'Empty Time',
      content: 'Body',
      persistent: true,
      time: '',
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.toast-time')).toBeNull();
  });

  it('allows per-toast noTime false to override the component noTime prop', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    page.root!.time = '10:11:12Z';

    page.root!.noTime = true;

    await getInstance(page).showToast({
      toastTitle: 'Time Override',
      content: 'Body',
      persistent: true,
      noTime: false,
    });

    await sleep(0);
    await page.waitForChanges();

    const time = page.root!.querySelector('.toast-time') as HTMLElement | null;

    expect(time).toBeTruthy();

    expect(time?.textContent).toBe('10:11:12Z');
  });

  it('renders additional header content inside the title wrapper', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'Wrapper Test',
      content: 'Body',
      additionalHdrContent: 'Additional',
      persistent: true,
      noTime: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const titleWrapper = page.root!.querySelector('.toast-title-wrapper') as HTMLElement | null;

    expect(titleWrapper).toBeTruthy();

    expect(titleWrapper?.querySelector('.mr-auto.mb-0')?.textContent).toBe('Wrapper Test');

    expect(titleWrapper?.querySelector('.toast-additional-header-content')?.textContent).toBe('Additional');

    expect(page.root!.querySelector('.toast-time')).toBeNull();
  });

  it('auto-dismisses a non-persistent toast', async () => {
    const page = await createPage('position="bottom-right"');

    page.root!.noAnimation = true;

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

  it('appends new toasts when appendToast is true', async () => {
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

    const titles = Array.from(page.root!.querySelectorAll('.toast-title-wrapper .mr-auto.mb-0')).map(element => element.textContent);

    expect(titles).toEqual(['First', 'Second']);
  });

  it('prepends new toasts when appendToast is false', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    page.root!.appendToast = false;

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

    const titles = Array.from(page.root!.querySelectorAll('.toast-title-wrapper .mr-auto.mb-0')).map(element => element.textContent);

    expect(titles).toEqual(['Second', 'First']);
  });

  it('focusOnShow renders a focusable standard toast content target', async () => {
    const page = await createPage('position="bottom-right"');

    page.root!.noAnimation = true;

    page.root!.toastId = 'plumage-toast-component';

    page.root!.focusOnShow = true;

    const id = await getInstance(page).showToast({
      toastTitle: 'Focusable',
      content: 'Focus me',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const focusTarget = page.root!.querySelector(`#plumage-toast-component__toast_${id}__content`) as HTMLElement | null;

    expect(focusTarget).toBeTruthy();

    expect(focusTarget?.getAttribute('tabindex')).toBe('0');
  });

  it('Escape key closes the focused toast', async () => {
    const page = await createPage('position="bottom-right"');

    page.root!.noAnimation = true;

    page.root!.toastId = 'plumage-toast-component';

    const id = await getInstance(page).showToast({
      toastTitle: 'Close via ESC',
      content: 'Press ESC',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const toastContent = page.root!.querySelector(`#plumage-toast-component__toast_${id}__content`) as HTMLElement | null;

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

  it('close button removes a standard Plumage toast', async () => {
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

  it('close button removes a Plumage Max toast', async () => {
    const page = await createPage('plumage-toast-max');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'Closable Max',
      content: 'Close me',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const closeButton = page.root!.querySelector('.toast-max .close') as HTMLButtonElement | null;

    expect(closeButton).toBeTruthy();

    expect(closeButton?.getAttribute('aria-label')).toBe('Close Closable Max');

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

  it('noCloseButton removes the close control from a Plumage Max toast', async () => {
    const page = await createPage('plumage-toast-max');

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      toastTitle: 'No Close Max',
      content: 'Persistent body',
      persistent: true,
      noCloseButton: true,
    });

    await sleep(0);
    await page.waitForChanges();

    expect(page.root!.querySelector('.close')).toBeNull();
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

    expect(slot?.style.maxWidth).toBe('550px');
  });

  it('uses alert semantics by default', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Alert body',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const toast = page.root!.querySelector('.toast') as HTMLElement | null;

    expect(toast?.getAttribute('role')).toBe('alert');

    expect(toast?.getAttribute('aria-atomic')).toBe('true');

    expect(toast?.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('uses status semantics when isStatus is true', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Status body',
      persistent: true,
      isStatus: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const toast = page.root!.querySelector('.toast') as HTMLElement | null;

    expect(toast?.getAttribute('role')).toBe('status');
  });

  it('does not use aria-labelledby when no explicit toast title is supplied', async () => {
    const page = await createPage();

    page.root!.noAnimation = true;

    await getInstance(page).showToast({
      content: 'Body only',
      persistent: true,
    });

    await sleep(0);
    await page.waitForChanges();

    const toast = page.root!.querySelector('.toast') as HTMLElement | null;

    expect(toast?.getAttribute('aria-labelledby')).toBeNull();

    expect(toast?.getAttribute('aria-describedby')).toBeTruthy();

    expect(page.root!.textContent).toContain('Notification');
  });
});
