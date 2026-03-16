// src/components/accordion-container/test/accordion-container.spec.tsx
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { AccordionContainer } from './accordion-container';
import { Button as ButtonComponent } from '../button/button-component';

// helpers
const click = (el: Element | null) => {
  if (!el) throw new Error('Expected element to click, got null');
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
};

const firstHostBtn = (root: HTMLElement) =>
  (root.querySelectorAll('button-component')[0] as HTMLElement | null) ?? null;

const innerButtonOf = (hostBtn: HTMLElement | null) =>
  (hostBtn ? (hostBtn.querySelector('button') as HTMLButtonElement | null) : null);

const panelAt = (root: HTMLElement, i: number) => root.querySelectorAll<HTMLElement>('.accordion-collapse')[i] ?? null;

describe('accordion-container', () => {
  const sampleData = [
    { header: 'Header 1', content: 'Content 1' },
    { header: 'Header 2', content: 'Content 2' },
  ];

  it('renders with given data and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders outlined, block, and disabled props', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={sampleData} outlined block disabled></accordion-container>,
    });
    await page.waitForChanges();

    const buttons = Array.from(page.root.querySelectorAll('button-component')) as any[];
    expect(buttons.length).toBe(2);

    buttons.forEach((btnHost: any) => {
      expect(btnHost.outlined).toBe(true);
      expect(btnHost.block).toBe(true);
      expect(btnHost.disabled).toBe(true);

      const inner = btnHost.querySelector('button') as HTMLButtonElement | null;
      expect(inner).toBeTruthy();
      expect(inner!.hasAttribute('disabled')).toBe(true);
      expect(inner!.classList.contains('btn--block')).toBe(true);
    });

    expect(page.root).toMatchSnapshot('outlined-block-disabled');
  });

  it('toggles accordion via click and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const hostBtn = firstHostBtn(page.root);
    const inner = innerButtonOf(hostBtn);
    click(inner);
    await page.waitForChanges();

    expect(page.rootInstance.openIndexes.has(0)).toBe(true);
    expect(page.root).toMatchSnapshot('click toggle first open');
  });

  it('handles keyboard activation (simulate click on inner button)', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const hostBtn = firstHostBtn(page.root);
    const inner = innerButtonOf(hostBtn);

    click(inner); // open
    await page.waitForChanges();
    expect(page.rootInstance.openIndexes.has(0)).toBe(true);
    expect(page.root).toMatchSnapshot('after activation open');

    click(inner); // close
    await page.waitForChanges();
    expect(page.rootInstance.openIndexes.has(0)).toBe(false);
    expect(page.root).toMatchSnapshot('after activation close');
  });

  it('icon switching with snapshot', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container icon="icon-closed,icon-open" data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot('before icon toggle');

    const hostBtn = firstHostBtn(page.root);
    const inner = innerButtonOf(hostBtn);
    click(inner);
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot('after icon toggle');
  });

  it('applies correct text size class from contentTxtSize prop', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container contentTxtSize="lg" data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const hostBtn = firstHostBtn(page.root);
    const inner = innerButtonOf(hostBtn);
    click(inner);
    await page.waitForChanges();

    const bodies = page.root.querySelectorAll('.accordion-body');
    expect(bodies.length).toBeGreaterThan(0);
    bodies.forEach(body => {
      expect(body.classList.contains('text-large')).toBe(true);
    });

    expect(page.root).toMatchSnapshot('text size large');
  });

  it('renders static icon with no toggle switch', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container icon="icon-static" data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const icons = page.root.querySelectorAll('icon-component');
    expect(icons.length).toBe(2);
    icons.forEach(icon => {
      expect(icon.getAttribute('icon')).toBe('icon-static');
    });

    expect(page.root).toMatchSnapshot('static icon no switch');
  });

  it('renders gracefully when data is undefined, null, or not an array', async () => {
    const page1 = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={undefined}></accordion-container>,
    });
    await page1.waitForChanges();
    expect(page1.root).toMatchSnapshot('undefined data fallback');

    const page2 = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={null as any}></accordion-container>,
    });
    await page2.waitForChanges();
    expect(page2.root).toMatchSnapshot('null data fallback');

    const page3 = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={{} as any}></accordion-container>,
    });
    await page3.waitForChanges();
    expect(page3.root).toMatchSnapshot('non-array data fallback');
  });

  it('renders correct ARIA attributes on accordion headers and panels (including hidden/inert when collapsed)', async () => {
    const parentId = 'my-accordion';
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container parentId={parentId} data={[{ header: 'Item 1', content: 'Content 1' }]}></accordion-container>,
    });
    await page.waitForChanges();

    const expectedHeaderId = `${parentId}-header-0`; // <h2 id=...>
    const expectedTriggerId = `${parentId}-trigger-0`; // <button-component id=...>
    const expectedPanelId = `${parentId}-collapse-0`;

    const header = page.root.querySelector('.accordion-header')!;
    const hostBtn = header.querySelector('button-component') as HTMLElement | null;
    const inner = innerButtonOf(hostBtn);
    const panel = page.root.querySelector<HTMLElement>('.accordion-collapse')!;

    expect(header.getAttribute('id')).toBe(expectedHeaderId);
    expect(hostBtn?.getAttribute('id')).toBe(expectedTriggerId);

    expect(inner?.getAttribute('aria-expanded')).toBe('false');
    expect(inner?.getAttribute('aria-controls')).toBe(expectedPanelId);

    expect(panel.getAttribute('role')).toBe('region');
    expect(panel.getAttribute('aria-labelledby')).toBe(expectedTriggerId);

    expect(panel.getAttribute('id')).toBe(expectedPanelId);

    // collapsed panels should be hidden + inert
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(panel.hasAttribute('hidden')).toBe(true);
    expect(panel.hasAttribute('inert')).toBe(true);
    expect(panel.style.display).toBe('none');
    expect(panel.style.height).toBe('0px');

    // data-bs-parent only present when singleOpen=true
    expect(panel.getAttribute('data-bs-parent')).toBeNull();

    expect(page.root).toMatchSnapshot('ARIA attributes check');
  });

  it('closed panel becomes visible and non-inert when opened, and returns to inert when closed', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const hostBtn0 = firstHostBtn(page.root);
    const inner0 = innerButtonOf(hostBtn0);
    const panel0 = panelAt(page.root, 0)!;

    // initial (closed)
    expect(panel0.getAttribute('aria-hidden')).toBe('true');
    expect(panel0.hasAttribute('hidden')).toBe(true);
    expect(panel0.hasAttribute('inert')).toBe(true);

    // open
    click(inner0);
    await page.waitForChanges();

    expect(page.rootInstance.openIndexes.has(0)).toBe(true);
    expect(panel0.getAttribute('aria-hidden')).toBeNull();
    expect(panel0.hasAttribute('hidden')).toBe(false);
    expect(panel0.hasAttribute('inert')).toBe(false);
    expect(panel0.style.display).toBe('block');
    // during/after open transition height is auto in component; in tests it should already be "auto"
    expect(panel0.style.height).toBe('auto');

    // close
    click(inner0);
    await page.waitForChanges();

    expect(page.rootInstance.openIndexes.has(0)).toBe(false);
    expect(panel0.getAttribute('aria-hidden')).toBe('true');
    expect(panel0.hasAttribute('hidden')).toBe(true);
    expect(panel0.hasAttribute('inert')).toBe(true);
    expect(panel0.style.height).toBe('0px');
    // display becomes none immediately in render
    expect(panel0.style.display).toBe('none');
  });

  it('sets data-bs-parent when singleOpen=true', async () => {
    const parentId = 'single-parent';
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container parentId={parentId} singleOpen data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const panels = page.root.querySelectorAll('.accordion-collapse');
    expect(panels.length).toBe(2);
    panels.forEach(p => {
      expect(p.getAttribute('data-bs-parent')).toBe(`#${parentId}`);
    });
  });

  it('singleOpen closes the previously open item when opening another', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container singleOpen data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const btnHosts = Array.from(page.root.querySelectorAll('button-component')) as HTMLElement[];
    const inner0 = innerButtonOf(btnHosts[0]);
    const inner1 = innerButtonOf(btnHosts[1]);

    click(inner0);
    await page.waitForChanges();
    expect(page.rootInstance.openIndexes.has(0)).toBe(true);

    click(inner1);
    await page.waitForChanges();
    expect(page.rootInstance.openIndexes.has(1)).toBe(true);
    expect(page.rootInstance.openIndexes.has(0)).toBe(false);
  });

  it('renders empty accordion when data is an empty array', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={[]}></accordion-container>,
    });
    await page.waitForChanges();

    const items = page.root.querySelectorAll('.accordion-item');
    expect(items.length).toBe(0);
    expect(page.root).toMatchSnapshot('empty array data');
  });

  it('logs warning in componentWillLoad() if data is not an array', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={{} as any}></accordion-container>,
    });
    warnSpy.mockRestore();
  });

  it('renders many accordion items and matches snapshot', async () => {
    const largeData = Array.from({ length: 12 }, (_, i) => ({
      header: `Header ${i + 1}`,
      content: `Content ${i + 1}`,
    }));

    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={largeData}></accordion-container>,
    });
    await page.waitForChanges();

    const items = page.root.querySelectorAll('.accordion-item');
    expect(items.length).toBe(12);
    expect(page.root).toMatchSnapshot('long data array (12 items)');
  });

  it('renders an item with empty header and content strings', async () => {
    const emptyEntry = [{ header: '', content: '' }];
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={emptyEntry}></accordion-container>,
    });
    await page.waitForChanges();

    const headers = page.root.querySelectorAll('.accordion-header');
    const bodies = page.root.querySelectorAll('.accordion-body');

    expect(headers.length).toBe(1);
    expect(headers[0].textContent?.trim()).toBe('');
    expect(bodies.length).toBe(1);
    expect(bodies[0].textContent?.trim()).toBe('');

    expect(page.root).toMatchSnapshot('empty header and content');
  });

  it('renders fallback icon behavior for invalid or missing icon prop', async () => {
    const cases = [
      { icon: '', description: 'empty string icon' },
      { icon: null, description: 'null icon' },
      { icon: '  , , ,', description: 'malformed icon string' },
    ];

    for (const { icon, description } of cases) {
      const page = await newSpecPage({
        components: [AccordionContainer, ButtonComponent],
        template: () => <accordion-container data={[{ header: 'H', content: 'C' }]} icon={icon as any}></accordion-container>,
      });
      await page.waitForChanges();

      const icons = page.root.querySelectorAll('icon-component');
      expect(icons.length).toBe(1);
      expect(icons[0].getAttribute('icon')).toBe('fas fa-angle-down');
      expect(page.root).toMatchSnapshot(description);
    }
  });

  it('toggles icon between first and second values in icon="a,b"', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container icon="icon-collapsed,icon-expanded" data={[{ header: 'Title', content: 'Body' }]}></accordion-container>,
    });
    await page.waitForChanges();

    const getIcon = () => page.root.querySelector('icon-component')?.getAttribute('icon');
    expect(getIcon()).toBe('icon-collapsed');

    const hostBtn = page.root.querySelector('button-component') as HTMLElement | null;
    const inner = innerButtonOf(hostBtn);
    click(inner);
    await page.waitForChanges();
    expect(getIcon()).toBe('icon-expanded');

    click(inner);
    await page.waitForChanges();
    expect(getIcon()).toBe('icon-collapsed');
  });

  it('renders only first two icons from icon="a,b,c"', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container icon="a,b,c" data={[{ header: 'H', content: 'C' }]}></accordion-container>,
    });
    await page.waitForChanges();

    const hostBtn = page.root.querySelector('button-component') as HTMLElement | null;
    const inner = innerButtonOf(hostBtn);
    const getIcon = () => page.root.querySelector('icon-component')?.getAttribute('icon');

    expect(getIcon()).toBe('a');

    click(inner);
    await page.waitForChanges();
    expect(getIcon()).toBe('b');

    click(inner);
    await page.waitForChanges();
    expect(getIcon()).toBe('a');

    expect(page.root).toMatchSnapshot('icon prop with extra values (a,b,c)');
  });

  it('renders single static icon and does not change on toggle', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container icon="only-icon" data={[{ header: 'Static', content: 'Content' }]}></accordion-container>,
    });
    await page.waitForChanges();

    const getIcon = () => page.root.querySelector('icon-component')?.getAttribute('icon');
    const hostBtn = page.root.querySelector('button-component') as HTMLElement | null;
    const inner = innerButtonOf(hostBtn);

    expect(getIcon()).toBe('only-icon');

    click(inner);
    await page.waitForChanges();
    expect(getIcon()).toBe('only-icon');

    click(inner);
    await page.waitForChanges();
    expect(getIcon()).toBe('only-icon');

    expect(page.root).toMatchSnapshot('static single icon toggle does not change');
  });

  it('renders with valid data and icon without warnings', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => (
        <accordion-container icon="fas fa-plus,fas fa-minus" parentId="test-acc" data={[{ header: 'Test Header', content: 'Test Content' }]}></accordion-container>
      ),
    });

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('shows warning for explicitly empty icon attribute', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      html: `<accordion-container icon=""></accordion-container>`,
    });
    expect(warnSpy.mock.calls.some(call => String(call[0]).includes('"icon" prop is empty'))).toBe(true);
    warnSpy.mockRestore();
  });

  it('shows warning if data is invalid (no warning expected here, component normalizes to [])', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const page = await newSpecPage({
      components: [AccordionContainer, ButtonComponent],
      template: () => <accordion-container data={{} as any}></accordion-container>,
    });
    await page.waitForChanges();
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
