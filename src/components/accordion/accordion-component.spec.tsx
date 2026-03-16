// src/components/accordion/accordion-component.spec.tsx
import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { AccordionComponent } from './accordion-component';
// IMPORTANT: also register the child so its native control renders
import { Button as ButtonComponent } from '../button/button-component';

describe('accordion-component', () => {
  const getHostBtn = (root: HTMLElement) => root.querySelector('button-component') as HTMLElement | null;

  const getInnerControl = (root: HTMLElement) => root.querySelector<HTMLElement>('button-component button, button-component a');

  const getTargetById = (root: HTMLElement, id: string) => root.querySelector<HTMLElement>(`#${id}`);

  const fireTransitionEnd = async (el: HTMLElement, page: any) => {
    el.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();
  };

  it('renders closed by default (with hidden/inert panel)', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="section1"></accordion-component>`,
    });

    const hostBtn = getHostBtn(page.root);
    const control = getInnerControl(page.root);
    const target = getTargetById(page.root, 'section1')!;

    expect(hostBtn).toBeTruthy();
    expect(control).toBeTruthy();

    expect(hostBtn!.getAttribute('id')).toBe('section1-header');
    expect(control!.getAttribute('aria-controls')).toBe('section1');
    expect(control!.getAttribute('aria-expanded')).toBe('false');

    expect(target.getAttribute('role')).toBe('region');
    expect(target.getAttribute('aria-labelledby')).toBe('section1-header');

    expect(target.getAttribute('aria-hidden')).toBe('true');
    expect(target.hasAttribute('hidden')).toBe(true);
    expect(target.hasAttribute('inert')).toBe(true);

    expect(target.style.display).toBe('none');
    expect(target.style.height).toBe('0px');

    expect(page.root).toMatchSnapshot();
  });

  it('renders open by default when is-open is set (panel is not hidden/inert)', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="section2" is-open="true"></accordion-component>`,
    });

    const hostBtn = getHostBtn(page.root);
    const control = getInnerControl(page.root);
    const target = getTargetById(page.root, 'section2')!;

    expect(control).toBeTruthy();
    expect((page.rootInstance as any).internalOpen).toBe(true);

    expect(hostBtn!.getAttribute('id')).toBe('section2-header');
    expect(control!.getAttribute('aria-controls')).toBe('section2');
    expect(control!.getAttribute('aria-expanded')).toBe('true');

    expect(target.getAttribute('role')).toBe('region');
    expect(target.getAttribute('aria-labelledby')).toBe('section2-header');

    expect(target.getAttribute('aria-hidden')).toBeNull();
    expect(target.hasAttribute('hidden')).toBe(false);
    expect(target.hasAttribute('inert')).toBe(false);

    expect(target.style.display).toBe('block');
    expect(target.style.height).toBe('auto');

    expect(page.root).toMatchSnapshot();
  });

  it('toggles open/closed state on click (customClick from button-component) and flips hidden/inert', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="section3"></accordion-component>`,
    });

    const instance = page.rootInstance as any;
    const hostBtn = getHostBtn(page.root)!;
    const control = getInnerControl(page.root);
    const target = getTargetById(page.root, 'section3')!;

    expect(control).toBeTruthy();

    // open
    hostBtn.dispatchEvent(new CustomEvent('customClick', { bubbles: true }));
    await page.waitForChanges();

    expect(instance.internalOpen).toBe(true);
    expect(control!.getAttribute('aria-expanded')).toBe('true');

    expect(target.getAttribute('aria-hidden')).toBeNull();
    expect(target.hasAttribute('hidden')).toBe(false);
    expect(target.hasAttribute('inert')).toBe(false);
    expect(target.style.display).toBe('block');

    await fireTransitionEnd(target, page);
    expect(target.style.height).toBe('auto');

    // close
    hostBtn.dispatchEvent(new CustomEvent('customClick', { bubbles: true }));
    await page.waitForChanges();

    expect(instance.internalOpen).toBe(false);
    expect(control!.getAttribute('aria-expanded')).toBe('false');

    expect(target.getAttribute('aria-hidden')).toBe('true');
    expect(target.hasAttribute('hidden')).toBe(true);
    expect(target.hasAttribute('inert')).toBe(true);

    await fireTransitionEnd(target, page);
    expect(target.style.display).toBe('none');
    expect(target.style.height).toBe('0px');
  });

  it('renders icon and switches when toggled', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component
               accordion
               target-id="accordion-test"
               icon="fa-chevron-down, fa-chevron-up"
             >
               <span slot="accordion-header">Header</span>
               <div slot="content">Body</div>
             </accordion-component>`,
    });

    const icon = page.root.querySelector('icon-component');
    expect(icon).toBeTruthy();
    expect(icon!.getAttribute('icon')).toContain('fa-chevron-down');

    const hostBtn = getHostBtn(page.root)!;
    const target = getTargetById(page.root, 'accordion-test')!;

    hostBtn.dispatchEvent(new CustomEvent('customClick', { bubbles: true }));
    await page.waitForChanges();
    await fireTransitionEnd(target, page);

    const updatedIcon = page.root.querySelector('icon-component')!;
    expect(updatedIcon.getAttribute('icon')).toContain('fa-chevron-up');
  });

  it('toggles open/closed with keyboard (Enter and Space) via button-component', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="section5"></accordion-component>`,
    });

    const instance = page.rootInstance as any;
    const inner = getInnerControl(page.root)!;
    const target = getTargetById(page.root, 'section5')!;

    inner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    target.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();

    inner.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    inner.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    target.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();
  });

  it('renders and toggles in link mode (anchor-like button)', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component link target-id="link-section" variant="primary">
             <span slot="button-text">Open Link</span>
           </accordion-component>`,
    });

    const instance = page.rootInstance as any;
    const inner = getInnerControl(page.root)!;
    const target = getTargetById(page.root, 'link-section')!;

    expect(inner.tagName).toBe('A');
    expect(inner.getAttribute('role')).toBe('button');

    expect(inner.getAttribute('aria-controls')).toBe('link-section');
    expect(inner.getAttribute('aria-expanded')).toBe('false');

    inner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    target.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();

    inner.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    inner.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    target.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();
  });

  it('emits toggleEvent(boolean) with the new state', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="emit-section"></accordion-component>`,
    });

    const spy = jest.fn();
    page.root.addEventListener('toggleEvent', (e: CustomEvent) => spy(e.detail));
    const hostBtn = getHostBtn(page.root)!;

    hostBtn.dispatchEvent(new CustomEvent('customClick', { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(true);

    hostBtn.dispatchEvent(new CustomEvent('customClick', { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it('@Watch("isOpen"): updating host prop updates internalOpen and styles + aria-expanded + hidden/inert', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="watched"></accordion-component>`,
    });

    const instance = page.rootInstance as any;
    const control = getInnerControl(page.root);
    const target = getTargetById(page.root, 'watched')!;
    const hostBtn = getHostBtn(page.root)!;

    expect(control).toBeTruthy();

    expect(instance.internalOpen).toBe(false);
    expect(control!.getAttribute('aria-expanded')).toBe('false');
    expect(target.getAttribute('aria-hidden')).toBe('true');
    expect(target.hasAttribute('inert')).toBe(true);

    page.root.setAttribute('is-open', 'true');
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    expect(control!.getAttribute('aria-expanded')).toBe('true');
    expect(hostBtn.getAttribute('id')).toBe('watched-header');
    expect(target.style.display).toBe('block');
    expect(target.style.height).toBe('auto');
    expect(target.getAttribute('aria-hidden')).toBeNull();
    expect(target.hasAttribute('inert')).toBe(false);

    page.root.setAttribute('is-open', 'false');
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    expect(control!.getAttribute('aria-expanded')).toBe('false');
    expect(target.style.display).toBe('none');
    expect(target.style.height).toBe('0px');
    expect(target.getAttribute('aria-hidden')).toBe('true');
    expect(target.hasAttribute('inert')).toBe(true);
  });

  it('dedupes targetId when it collides in DOM (unique IDs used in aria-controls and region id)', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      template: () => (
        <div>
          <div id="dup"></div>
          <accordion-component targetId="dup"></accordion-component>
        </div>
      ),
    });
    await page.waitForChanges();

    // newSpecPage may set page.root to the first rendered component rather than the wrapper.
    const comp =
      (page.root && page.root.tagName?.toLowerCase() === 'accordion-component'
        ? (page.root as HTMLElement)
        : (page.root.querySelector('accordion-component') as HTMLElement | null)) || (page.doc.querySelector('accordion-component') as HTMLElement | null);

    expect(comp).toBeTruthy();

    const control = getInnerControl(comp!)!;
    const region = comp!.querySelector('[role="region"]') as HTMLElement;
    expect(region).toBeTruthy();

    const resolvedId = region.getAttribute('id') || '';
    expect(resolvedId).toMatch(/^dup-/);
    expect(control.getAttribute('aria-controls')).toBe(resolvedId);

    const btnHost = getHostBtn(comp!)!;
    expect(btnHost.getAttribute('id')).toBe(`${resolvedId}-header`);
    expect(region.getAttribute('aria-labelledby')).toBe(`${resolvedId}-header`);

    expect(warnSpy.mock.calls.some(call => String(call[0]).includes('already exists in DOM'))).toBe(true);
    warnSpy.mockRestore();
  });
});
