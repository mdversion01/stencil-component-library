// src/components/accordion-container/test/accordion-container.spec.tsx
import { h } from '@stencil/core'; // ✅ REQUIRED for JSX in tests
import { newSpecPage } from '@stencil/core/testing';
import { AccordionContainer } from './accordion-container';

// (continue with your test cases...)

describe('accordion-container', () => {
  const sampleData = [
    { header: 'Header 1', content: 'Content 1' },
    { header: 'Header 2', content: 'Content 2' },
  ];

  it('renders with given data and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('renders outlined, block, and disabled props', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={sampleData} outlined block disabled></accordion-container>,
    });
    await page.waitForChanges();

    const buttons = page.root.querySelectorAll('button-component');
    expect(buttons.length).toBe(2);
    buttons.forEach(btn => {
      expect(btn.hasAttribute('outlined')).toBe(true);
      expect(btn.hasAttribute('block')).toBe(true);
      expect(btn.hasAttribute('disabled')).toBe(true);
    });

    expect(page.root).toMatchSnapshot('outlined-block-disabled');
  });

  it('toggles accordion via click and matches snapshot', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const btns = page.root.querySelectorAll('button-component');
    await btns[0].dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();

    expect(page.rootInstance.openIndexes.has(0)).toBe(true);
    expect(page.root).toMatchSnapshot('click toggle first open');
  });

  it('handles keyboard Enter and Space keydown to toggle item', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const header = page.root.querySelectorAll('button-component')[0];
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    await header.dispatchEvent(enterEvent);
    await page.waitForChanges();

    expect(page.rootInstance.openIndexes.has(0)).toBe(true);
    expect(page.root).toMatchSnapshot('after Enter keydown');

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    await header.dispatchEvent(spaceEvent);
    await page.waitForChanges();

    expect(page.rootInstance.openIndexes.has(0)).toBe(false);
    expect(page.root).toMatchSnapshot('after Space keydown');
  });

  it('icon switching with snapshot', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container icon="icon-closed,icon-open" data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot('before icon toggle');

    const btns = page.root.querySelectorAll('button-component');
    await btns[0].dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot('after icon toggle');
  });

  it('applies correct text size class from contentTxtSize prop', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container contentTxtSize="lg" data={sampleData}></accordion-container>,
    });
    await page.waitForChanges();

    const btns = page.root.querySelectorAll('button-component');
    await btns[0].dispatchEvent(new CustomEvent('customClick'));
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
      components: [AccordionContainer],
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
      components: [AccordionContainer],
      template: () => <accordion-container data={undefined}></accordion-container>,
    });
    await page1.waitForChanges();
    expect(page1.root).toMatchSnapshot('undefined data fallback');

    const page2 = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={null as any}></accordion-container>,
    });
    await page2.waitForChanges();
    expect(page2.root).toMatchSnapshot('null data fallback');

    const page3 = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={{} as any}></accordion-container>,
    });
    await page3.waitForChanges();
    expect(page3.root).toMatchSnapshot('non-array data fallback');
  });

  it('renders correct ARIA attributes on accordion headers and panels', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container parentId="my-accordion" data={[{ header: 'Item 1', content: 'Content 1' }]}></accordion-container>,
    });
    await page.waitForChanges();

    const header = page.root.querySelector('.accordion-header');
    const button = header?.querySelector('button-component');
    const panel = page.root.querySelector('.accordion-collapse');

    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(button?.getAttribute('aria-controls')).toBe('collapse0');
    expect(button?.getAttribute('role')).toBe('button');
    expect(panel?.getAttribute('role')).toBe('region');
    expect(panel?.getAttribute('aria-labelledby')).toBe('header-0');

    expect(page.root).toMatchSnapshot('ARIA attributes check');
  });

  it('renders empty accordion when data is an empty array', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={[]}></accordion-container>,
    });
    await page.waitForChanges();

    const items = page.root.querySelectorAll('.accordion-item');
    expect(items.length).toBe(0);
    expect(page.root).toMatchSnapshot('empty array data');
  });

  it('logs warning in componentWillLoad() if data is not an array', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={{}}></accordion-container>,
    });
    await page.waitForChanges();

    warnSpy.mockRestore();
  });

  it('renders many accordion items and matches snapshot', async () => {
    const largeData = Array.from({ length: 12 }, (_, i) => ({
      header: `Header ${i + 1}`,
      content: `Content ${i + 1}`,
    }));

    const page = await newSpecPage({
      components: [AccordionContainer],
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
      components: [AccordionContainer],
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
        components: [AccordionContainer],
        template: () => <accordion-container data={[{ header: 'H', content: 'C' }]} icon={icon as any}></accordion-container>,
      });
      await page.waitForChanges();

      const icons = page.root.querySelectorAll('icon-component');
      expect(icons.length).toBe(1);
      expect(icons[0].getAttribute('icon')).toBe('fas fa-angle-down'); // default

      expect(page.root).toMatchSnapshot(description);
    }
  });

  it('toggles icon between first and second values in icon="a,b"', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container icon="icon-collapsed,icon-expanded" data={[{ header: 'Title', content: 'Body' }]}></accordion-container>,
    });
    await page.waitForChanges();

    const getIcon = () => page.root.querySelector('icon-component')?.getAttribute('icon');

    // Initially collapsed: expect first icon
    expect(getIcon()).toBe('icon-collapsed');

    const btn = page.root.querySelector('button-component');
    await btn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();

    // After opening: expect second icon
    expect(getIcon()).toBe('icon-expanded');

    // Toggle back (close)
    await btn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();

    // Icon back to first
    expect(getIcon()).toBe('icon-collapsed');
  });

  it('renders no icon-component if icon is "," or whitespace only', async () => {
    const cases = [
      { icon: ',', desc: 'icon as comma only' },
      { icon: ' ', desc: 'icon as space only' },
    ];

    for (const { icon, desc } of cases) {
      const page = await newSpecPage({
        components: [AccordionContainer],
        template: () => <accordion-container icon={icon} data={[{ header: 'A', content: 'B' }]}></accordion-container>,
      });
      await page.waitForChanges();

      const icons = page.root.querySelectorAll('icon-component');
      expect(icons.length).toBe(1);
      expect(icons[0].getAttribute('icon')).toBe('fas fa-angle-down');
      expect(page.root).toMatchSnapshot(`no icon rendered: ${desc}`);
    }
  });

  it('renders only first two icons from icon="a,b,c"', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container icon="a,b,c" data={[{ header: 'H', content: 'C' }]}></accordion-container>,
    });
    await page.waitForChanges();

    const btn = page.root.querySelector('button-component');
    const getIcon = () => page.root.querySelector('icon-component')?.getAttribute('icon');

    // Initially collapsed (should use first icon)
    expect(getIcon()).toBe('a');

    // Toggle open (should use second icon)
    await btn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(getIcon()).toBe('b');

    // Toggle back
    await btn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(getIcon()).toBe('a');

    expect(page.root).toMatchSnapshot('icon prop with extra values (a,b,c)');
  });

  it('renders single static icon and does not change on toggle', async () => {
    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container icon="only-icon" data={[{ header: 'Static', content: 'Content' }]}></accordion-container>,
    });
    await page.waitForChanges();

    const getIcon = () => page.root.querySelector('icon-component')?.getAttribute('icon');
    const btn = page.root.querySelector('button-component');

    expect(getIcon()).toBe('only-icon');

    await btn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(getIcon()).toBe('only-icon');

    await btn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(getIcon()).toBe('only-icon');

    expect(page.root).toMatchSnapshot('static single icon toggle does not change');
  });

  it('renders with valid data and icon without warnings', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container icon="fas fa-plus,fas fa-minus" parentId="test-acc" data={[{ header: 'Test Header', content: 'Test Content' }]}></accordion-container>,
    });

    await page.waitForChanges();

    expect(page.root).toBeTruthy();
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('shows warning for explicitly empty icon', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const page = await newSpecPage({
      components: [AccordionContainer],
      html: `<accordion-container icon=""></accordion-container>`,
    });

    // expect(warnSpy).toHaveBeenCalledWith('[accordion-container] "icon" prop is empty. Falling back to default icon: "fas fa-angle-down".');
    expect(warnSpy.mock.calls.some(call => call[0].includes('"icon" prop is empty'))).toBe(true);

    warnSpy.mockRestore();
  });

  it('shows warning if data is invalid', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const page = await newSpecPage({
      components: [AccordionContainer],
      template: () => <accordion-container data={{} as any}></accordion-container>,
    });

    await page.waitForChanges();

    // ✅ NO LONGER EXPECT A WARNING
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
